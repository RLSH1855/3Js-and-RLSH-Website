// cloudflare/functions/_lib/session.js
const subtle = globalThis.crypto.subtle;

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function hashPassword(password) {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  return `${toHex(salt)}:${toHex(derived)}`;
}

async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex] = storedHash.split(':');
  const salt = fromHex(saltHex);
  const keyMaterial = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  return toHex(derived) === hashHex;
}

async function hmac(data, secret) {
  const key = await subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toHex(sig);
}

async function signSession(username, secret) {
  const payload = JSON.stringify({ username, issued: Date.now() });
  const payloadB64 = btoa(payload);
  const sig = await hmac(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

/* Same lifetime as the cookie's Max-Age (login.js: 86400s / 24h). The cookie
   expiring client-side was the only expiry this token ever had — a copy of
   it replayed straight against the API, bypassing the browser entirely,
   stayed valid forever. `issued` was already in the payload for this and
   was simply never read. */
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

async function verifySession(token, secret) {
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return { valid: false };
  const expectedSig = await hmac(payloadB64, secret);
  if (sig !== expectedSig) return { valid: false };
  const payload = JSON.parse(atob(payloadB64));
  if (typeof payload.issued !== 'number' || Date.now() - payload.issued > SESSION_MAX_AGE_MS) {
    return { valid: false };
  }
  return { valid: true, username: payload.username };
}

module.exports = { hashPassword, verifyPassword, signSession, verifySession };
