import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

test('umask preview clears bits, handles invalid input and leaves chmod untouched', async () => {
  const page = await readFile(new URL('../src/tools/chmod-calculator/index.html', import.meta.url), 'utf8');
  const script = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)].find(m => m[1].includes('function showMask()'))[1];
  const fields = new Map();
  class Field extends EventTarget {
    value = '';
    setAttribute(name, value) { this[name] = value; }
  }
  function field(id) {
    if (!fields.has(id)) fields.set(id, new Field());
    return fields.get(id);
  }
  vm.runInNewContext(script, { document: { getElementById: field, querySelectorAll: () => [] }, Event });
  for (const [input, file, dir] of [
    ['022', '644 · -rw-r--r--', '755 · drwxr-xr-x'],
    ['0077', '600 · -rw-------', '700 · drwx------'],
    ['111', '666 · -rw-rw-rw-', '666 · drw-rw-rw-'],
    ['777', '000 · ----------', '000 · d---------'],
    ['', '—', '—'], ['088', '—', '—'], ['1022', '—', '—']
  ]) {
    field('mask-input').value = input;
    field('mask-input').dispatchEvent(new Event('input'));
    assert.equal(field('mask-file').textContent, file);
    assert.equal(field('mask-dir').textContent, dir);
    assert.equal(field('mask-error').hidden, file !== '—');
    assert.equal(field('octal').value, '755');
  }
});
