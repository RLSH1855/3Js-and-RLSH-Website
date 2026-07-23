const { test } = require('node:test');
const assert = require('node:assert');
const { toCsv } = require('../cloudflare/functions/_lib/csv.js');

test('toCsv quotes every field and joins with newlines', () => {
  const csv = toCsv(['a', 'b'], [[1, 2], [3, 4]]);
  assert.strictEqual(csv, 'a,b\n"1","2"\n"3","4"');
});

test('toCsv escapes embedded double quotes by doubling them', () => {
  const csv = toCsv(['q'], [['he said "hi"']]);
  assert.strictEqual(csv, 'q\n"he said ""hi"""');
});

test('toCsv renders null and undefined as empty strings', () => {
  const csv = toCsv(['a', 'b'], [[null, undefined]]);
  assert.strictEqual(csv, 'a,b\n"",""');
});

test('toCsv survives commas and newlines inside a field', () => {
  const csv = toCsv(['a'], [['x,y\nz']]);
  assert.strictEqual(csv, 'a\n"x,y\nz"');
});

test('toCsv with no rows returns just the header', () => {
  assert.strictEqual(toCsv(['a', 'b'], []), 'a,b');
});
