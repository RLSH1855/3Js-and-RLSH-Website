const { test } = require('node:test');
const assert = require('node:assert');
const { base64UrlEncode, pemToPkcs8, buildJwt, getAccessToken } = require('../cloudflare/functions/_lib/gsc-auth.js');

// Generate a throwaway RSA key so no real credential is ever committed.
async function makeTestKeyPem() {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
  const b64 = Buffer.from(pkcs8).toString('base64').replace(/(.{64})/g, '$1\n');
  return {
    pem: `-----BEGIN PRIVATE KEY-----\n${b64}\n-----END PRIVATE KEY-----\n`,
    publicKey: pair.publicKey
  };
}

test('base64UrlEncode produces url-safe output with no padding', () => {
  assert.strictEqual(base64UrlEncode('{"a":1}'), 'eyJhIjoxfQ');
  const tricky = base64UrlEncode('???>>>');
  assert.ok(!tricky.includes('='));
  assert.ok(!tricky.includes('+'));
  assert.ok(!tricky.includes('/'));
});

test('pemToPkcs8 strips headers, newlines and escaped newlines', async () => {
  const { pem } = await makeTestKeyPem();
  const direct = pemToPkcs8(pem);
  const escaped = pemToPkcs8(pem.replace(/\n/g, '\\n'));
  assert.ok(direct.byteLength > 0);
  assert.strictEqual(direct.byteLength, escaped.byteLength);
});

test('buildJwt produces three segments with the expected claims', async () => {
  const { pem } = await makeTestKeyPem();
  const jwt = await buildJwt('bot@example.iam.gserviceaccount.com', pem, 1700000000);
  const parts = jwt.split('.');
  assert.strictEqual(parts.length, 3);
  const claim = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  assert.strictEqual(claim.iss, 'bot@example.iam.gserviceaccount.com');
  assert.strictEqual(claim.scope, 'https://www.googleapis.com/auth/webmasters.readonly');
  assert.strictEqual(claim.aud, 'https://oauth2.googleapis.com/token');
  assert.strictEqual(claim.iat, 1700000000);
  assert.strictEqual(claim.exp, 1700000000 + 3600);
});

test('buildJwt signature verifies against the matching public key', async () => {
  const { pem, publicKey } = await makeTestKeyPem();
  const jwt = await buildJwt('bot@example.iam.gserviceaccount.com', pem, 1700000000);
  const [h, c, s] = jwt.split('.');
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    Buffer.from(s, 'base64url'),
    new TextEncoder().encode(`${h}.${c}`)
  );
  assert.strictEqual(ok, true);
});

test('getAccessToken posts a jwt-bearer grant and returns the token', async () => {
  const { pem } = await makeTestKeyPem();
  let captured = null;
  const fakeFetch = async (url, opts) => {
    captured = { url, body: opts.body.toString() };
    return { ok: true, json: async () => ({ access_token: 'ya29.fake-token' }) };
  };
  const token = await getAccessToken('bot@example.iam.gserviceaccount.com', pem, fakeFetch);
  assert.strictEqual(token, 'ya29.fake-token');
  assert.strictEqual(captured.url, 'https://oauth2.googleapis.com/token');
  assert.ok(captured.body.includes('grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer'));
  assert.ok(captured.body.includes('assertion='));
});

test('getAccessToken throws a readable error when Google rejects the key', async () => {
  const { pem } = await makeTestKeyPem();
  const fakeFetch = async () => ({ ok: false, status: 400, text: async () => 'invalid_grant' });
  await assert.rejects(
    () => getAccessToken('bot@example.iam.gserviceaccount.com', pem, fakeFetch),
    /Google token request failed \(400\): invalid_grant/
  );
});
