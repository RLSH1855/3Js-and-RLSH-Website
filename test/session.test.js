// test/session.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { hashPassword, verifyPassword, signSession, verifySession } = require('../cloudflare/functions/_lib/session.js');

test('hashPassword produces a hash that verifyPassword accepts', async () => {
  const hash = await hashPassword('correct-horse-battery-staple');
  assert.ok(await verifyPassword('correct-horse-battery-staple', hash));
});

test('verifyPassword rejects a wrong password', async () => {
  const hash = await hashPassword('correct-horse-battery-staple');
  assert.strictEqual(await verifyPassword('wrong-password', hash), false);
});

test('signSession produces a token that verifySession accepts and returns the username', async () => {
  const token = await signSession('james', 'test-secret');
  const result = await verifySession(token, 'test-secret');
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.username, 'james');
});

test('verifySession rejects a token signed with a different secret', async () => {
  const token = await signSession('james', 'test-secret');
  const result = await verifySession(token, 'wrong-secret');
  assert.strictEqual(result.valid, false);
});

test('verifySession rejects a tampered token', async () => {
  const token = await signSession('james', 'test-secret');
  const tampered = token.slice(0, -1) + (token.slice(-1) === 'a' ? 'b' : 'a');
  const result = await verifySession(tampered, 'test-secret');
  assert.strictEqual(result.valid, false);
});
