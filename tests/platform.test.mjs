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

test('US address generator covers 50 states + DC with valid ZIP/NANP rules and no SSN or card fields', async () => {
  const html = await readFile(new URL('../src/tools/us-address-generator/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /\bSSN\b|信用卡|CVV/i);
  const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(inlineScripts.length, 1);
  const scriptBody = inlineScripts[0][1];

  const statesMatch = scriptBody.match(/var STATES = (\{[\s\S]*?\n    \});/);
  const poolMatch = scriptBody.match(/var ADDRESS_POOL = (\[[\s\S]*?\n    \]);/);
  assert.ok(statesMatch && poolMatch, 'expected STATES and ADDRESS_POOL definitions');

  const dataSandbox = {};
  vm.runInNewContext(`STATES = ${statesMatch[1]}; ADDRESS_POOL = ${poolMatch[1]};`, dataSandbox);
  const stateCodes = Object.keys(dataSandbox.STATES).sort();
  assert.equal(stateCodes.length, 51, 'must include all 50 US states plus DC');

  const taxFreeCodes = stateCodes.filter((code) => dataSandbox.STATES[code][2]);
  assert.deepEqual(taxFreeCodes, ['AK', 'DE', 'MT', 'NH', 'OR']);

  const counts = Object.fromEntries(stateCodes.map((code) => [code, 0]));
  for (const row of dataSandbox.ADDRESS_POOL) {
    assert.equal(row.length, 6);
    const [street, city, county, state, zip, area] = row;
    assert.match(street, /^\d+\s+\S+/);
    assert.ok(city.length > 1 && county.length > 2);
    assert.ok(dataSandbox.STATES[state], `unknown state ${state}`);
    assert.match(zip, /^\d{5}$/);
    assert.match(area, /^[2-9]\d{2}$/);
    if (state === 'AK') assert.ok(['Anchorage', 'Fairbanks'].includes(city), 'AK entries must stay in local-tax-free cities');
    counts[state]++;
  }
  for (const code of stateCodes) {
    assert.ok(counts[code] >= 2, `expected at least 2 verified addresses for ${code}`);
  }
});

test('toolkit custom select enhances native selects, filters long lists, and dispatches change events', async () => {
  class MockNode extends EventTarget {
    constructor(tag) {
      super();
      this.tagName = tag.toUpperCase();
      this.className = '';
      this.style = { cssText: '' };
      this.dataset = {};
      this.attributes = new Map();
      this.children = [];
      this.parentNode = null;
      this.disabled = false;
      this.textContent = '';
      this._html = '';
      this.value = '';
      this.classList = {
        toggle: (cls, force) => {
          const set = new Set(this.className.split(/\s+/).filter(Boolean));
          const add = force === undefined ? !set.has(cls) : Boolean(force);
          if (add) set.add(cls); else set.delete(cls);
          this.className = [...set].join(' ');
        }
      };
    }
    set innerHTML(v) { this._html = v; if (v === '') this.children = []; }
    get innerHTML() { return this._html; }
    setAttribute(k, v) { this.attributes.set(k, String(v)); }
    getAttribute(k) { return this.attributes.get(k) ?? null; }
    hasAttribute(k) { return this.attributes.has(k); }
    appendChild(child) {
      if (child.parentNode) child.parentNode.removeChild(child);
      child.parentNode = this;
      this.children.push(child);
      return child;
    }
    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx >= 0) { this.children.splice(idx, 1); child.parentNode = null; }
      return child;
    }
    insertBefore(node, ref) {
      const idx = this.children.indexOf(ref);
      node.parentNode = this;
      if (idx >= 0) this.children.splice(idx, 0, node);
      else this.children.push(node);
      return node;
    }
    contains(target) {
      if (target === this) return true;
      return this.children.some((c) => c.contains && c.contains(target));
    }
    focus() {}
    getBoundingClientRect() { return { top: 80, bottom: 120, left: 24, width: 200, height: 40 }; }
  }

  const body = new MockNode('body');
  const host = new MockNode('label');
  body.appendChild(host);
  const select = new MockNode('select');
  select.setAttribute('aria-label', 'State');
  const opts = [];
  for (let i = 0; i < 9; i++) {
    const opt = new MockNode('option');
    opt.value = `S${i}`;
    opt.textContent = i === 3 ? 'OR · Oregon (免税)' : `State ${i}`;
    opts.push(opt);
    select.appendChild(opt);
  }
  select.options = opts;
  let selIdx = 0;
  Object.defineProperty(select, 'selectedIndex', {
    get: () => selIdx,
    set: (v) => { selIdx = v; select.value = opts[v]?.value || ''; }
  });
  select.selectedIndex = 0;
  host.appendChild(select);

  const doc = {
    readyState: 'loading',
    documentElement: { clientWidth: 1024, clientHeight: 768 },
    body,
    getElementsByTagName: () => [],
    querySelectorAll: (q) => (q === 'select' ? [select] : []),
    querySelector: () => null,
    createElement: (tag) => new MockNode(tag),
    createElementNS: (_ns, tag) => new MockNode(tag),
    createTextNode: (t) => ({ textContent: t }),
    addEventListener() {},
    removeEventListener() {}
  };
  const win = { innerWidth: 1024, innerHeight: 768, addEventListener() {}, removeEventListener() {} };
  const context = {
    window: win, document: doc, location: { pathname: '/tools/us-address-generator/', href: 'https://example.com/tools/us-address-generator/', hash: '', search: '' },
    Event, TextEncoder, TextDecoder, URLSearchParams, btoa, atob, setTimeout, clearTimeout,
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} }
  };
  const source = await readFile(new URL('../public/assets/toolkit.js', import.meta.url), 'utf8');
  vm.runInNewContext(source, context);
  win.zkMountSelects(doc);

  const wrap = host.children[0];
  assert.match(wrap.className, /\bzk-select\b/);
  const trigger = wrap.children[0];
  assert.equal(trigger.children[0].textContent, 'State 0');

  let changed = 0;
  select.addEventListener('change', () => { changed++; });

  trigger.dispatchEvent(new Event('click'));
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');
  const pop = body.children.find((c) => c.className === 'zk-select-popover');
  assert.ok(pop, 'expected popover mounted on document.body');

  const searchInput = pop.children[0].children[0];
  assert.equal(searchInput.className, 'zk-select-search', 'selects with >= 8 options include a search filter');
  searchInput.value = 'oregon';
  searchInput.dispatchEvent(new Event('input'));

  const list = pop.children[1];
  assert.equal(list.children.length, 1);
  list.children[0].dispatchEvent(new Event('click'));

  assert.equal(select.selectedIndex, 3);
  assert.equal(select.value, 'S3');
  assert.equal(changed, 1);
  assert.equal(trigger.children[0].textContent, 'OR · Oregon (免税)');
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
});
