import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import { versionAssets } from '../scripts/version-assets.mjs';

test('legacy loader preserves scripts containing an exported HTML body', async () => {
  const source = await readFile(new URL('../src/lib/legacy.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const { loadLegacyDocument } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
  const page = loadLegacyDocument('src/tools/markdown-preview/index.html');
  assert.match(page.body, /document\.getElementById\("download"\)\.onclick/);
  assert.match(page.body, /<\/script>\s*$/);
  for (const script of page.body.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (script[1].includes('application/ld+json')) assert.doesNotThrow(() => JSON.parse(script[2]));
    else assert.doesNotThrow(() => new vm.Script(script[2]));
  }
});

test('asset versions follow transitive CSS changes and remain stable otherwise', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'zktool-assets-test-'));
  try {
    await mkdir(join(dir, 'assets'));
    await writeFile(join(dir, 'assets/tokens.css'), ':root { --color: red; }');
    await writeFile(join(dir, 'assets/shell.css'), '@import url("tokens.css");');
    await writeFile(join(dir, 'assets/page.css'), '@import url("shell.css?v=stale");');
    await writeFile(join(dir, 'index.html'), '<link href="/assets/page.css?v=old"><a href="https://example.com/">External</a>');
    await versionAssets(dir);
    const initial = await readFile(join(dir, 'index.html'), 'utf8');
    const css = await readFile(join(dir, 'assets/page.css'), 'utf8');
    assert.match(css, /shell\.css\?v=[a-f0-9]{12}/);
    assert.ok(initial.includes(createHash('sha256').update(css).digest('hex').slice(0, 12)));
    assert.ok(initial.includes('href="https://example.com/"'));
    await versionAssets(dir);
    assert.equal(await readFile(join(dir, 'index.html'), 'utf8'), initial);
    await writeFile(join(dir, 'assets/tokens.css'), ':root { --color: blue; }');
    await versionAssets(dir);
    assert.notEqual(await readFile(join(dir, 'index.html'), 'utf8'), initial);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

async function toolkitHarness(pathname = '/tools/jwt-decoder/') {
  const stored = new Map();
  const timers = new Map();
  let nextTimer = 0;
  class Element extends EventTarget {
    constructor(tag = 'textarea', id = '', off = false) {
      super(); Object.assign(this, { tagName: tag.toUpperCase(), id, value: '', defaultValue: '', type: tag, checked: false, defaultChecked: false, children: [], off });
    }
    hasAttribute(name) { return name === 'data-zk-off' && this.off; }
    appendChild(child) { this.children.push(child); return child; }
  }
  const input = new Element('textarea', 'input');
  const secret = new Element('textarea', 'secret', true);
  const output = new Element('textarea', 'output', true);
  const parent = { insertBefore(node) { this.notice = node; } }; input.parentNode = parent;
  const document = {
    readyState: 'loading', body: new Element('body'), getElementsByTagName: () => [],
    querySelectorAll: () => [input, secret, output], querySelector: (selector) => selector === 'textarea[id]' ? input : null,
    createElement: (tag) => new Element(tag), createTextNode: (text) => ({ textContent: text }), addEventListener() {}
  };
  const location = { pathname, href: 'https://example.com' + pathname, hash: '' };
  const context = {
    window: {}, document, location, Event, TextEncoder, TextDecoder, URLSearchParams, btoa, atob,
    setTimeout: (fn) => { timers.set(++nextTimer, fn); return nextTimer; }, clearTimeout: (id) => timers.delete(id),
    localStorage: { getItem: (key) => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value), removeItem: (key) => stored.delete(key) }
  };
  const source = await readFile(new URL('../public/assets/toolkit.js', import.meta.url), 'utf8');
  assert.ok(source.includes('window.zkShare = zkShare;'));
  // Test hooks exist only in this VM; they are never shipped to users.
  vm.runInNewContext(source.replace('window.zkShare = zkShare;', 'window.testHooks = { initDraft, mountPrivacyControls }; window.zkShare = zkShare;'), context);
  return { ...context, input, secret, output, stored, parent, flush() { const jobs = [...timers.values()]; timers.clear(); jobs.forEach(fn => fn()); } };
}

for (const locale of ['', '/en']) for (const slug of ['jwt-decoder', 'aes-tool', 'curl-parser', 'docker-compose-converter', 'id-card-checker']) {
  test(`sensitive drafts require fresh opt-in: ${locale}/tools/${slug}/`, async () => {
    const path = `${locale}/tools/${slug}/`;
    const h = await toolkitHarness(path);
    const key = `zktool.draft:${path}:input`;
    h.stored.set(key, 'old draft');
    h.window.testHooks.initDraft(false);
    assert.equal(h.input.value, '', 'must not restore automatically');
    h.input.value = 'synthetic input'; h.input.dispatchEvent(new Event('input')); h.flush();
    assert.equal(h.stored.get(key), 'old draft', 'must not persist automatically');
    assert.equal(h.window.zkShare.encode(), null, 'must not share silently');
    h.window.testHooks.mountPrivacyControls();
    const checkbox = h.parent.notice.children[1].children[0];
    checkbox.checked = true; checkbox.dispatchEvent(new Event('change')); h.flush();
    assert.equal(h.stored.get(key), 'synthetic input');
    h.input.value = 'pending'; h.input.dispatchEvent(new Event('input'));
    checkbox.checked = false; checkbox.dispatchEvent(new Event('change')); h.flush();
    assert.equal(h.stored.has(key), false, 'pending timer must not restore a disabled draft');
  });
}

test('ID-card checksum uses the GB 11643-1999 mapping', async () => {
  const source = await readFile(new URL('../src/tools/id-card-checker/index.html', import.meta.url), 'utf8');
  const first17 = '11010519491231002';
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const mapping = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  const checksum = mapping[[...first17].reduce((sum, digit, i) => sum + Number(digit) * weights[i], 0) % 11];
  assert.equal(checksum, 'X');
  assert.match(source, /var weights = \[7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2\]/);
  assert.match(source, /var mapping = \["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"\]/);
});

test('share restoration requires consent and rejects excluded fields and invalid state', async () => {
  const h = await toolkitHarness();
  h.location.hash = '#zk=' + Buffer.from(JSON.stringify({ input: 'synthetic JWT', secret: 'must not restore', output: 'must not restore' })).toString('base64url');
  assert.equal(h.window.zkShare.restore(), false);
  assert.equal(h.input.value, '');
  assert.equal(h.window.zkShare.restore(true), true);
  assert.equal(h.input.value, 'synthetic JWT');
  assert.equal(h.secret.value, ''); assert.equal(h.output.value, '');
  h.secret.value = 'do not share';
  const url = h.window.zkShare.encode(true);
  assert.deepEqual(JSON.parse(Buffer.from(url.split('#zk=')[1], 'base64url').toString()), { input: 'synthetic JWT' });
  for (const invalid of ['null', '[]', '{"input":42}', 'not json']) {
    h.location.hash = '#zk=' + Buffer.from(invalid).toString('base64url');
    assert.equal(h.window.zkShare.restore(true), false);
  }
});

test('ordinary tools retain automatic drafts', async () => {
  const h = await toolkitHarness('/tools/hash-tool/');
  h.window.testHooks.initDraft(false);
  h.input.value = 'abc'; h.input.dispatchEvent(new Event('input')); h.flush();
  assert.equal(h.stored.get('zktool.draft:/tools/hash-tool/:input'), 'abc');
  assert.match(h.window.zkShare.encode(), /#zk=/);
});

test('scoped translation dictionaries have no duplicate keys', async () => {
  for (const file of ['tool-ui-en.mjs', 'tool-help-en.mjs']) {
    const source = ts.createSourceFile(file, await readFile(new URL('../src/data/' + file, import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node) {
      if (ts.isObjectLiteralExpression(node)) {
        const keys = node.properties.filter(ts.isPropertyAssignment).map(property => property.name.text);
        assert.equal(new Set(keys).size, keys.length, `duplicate translation key in ${file}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
});
