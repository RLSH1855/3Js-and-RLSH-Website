// cloudflare/functions/_lib/require-auth.js
const { verifySession } = require('./session.js');

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function requireAuth(request, env) {
  const token = getCookie(request, 'session');
  if (!token) return { authorized: false };
  const result = await verifySession(token, env.SESSION_SECRET);
  return result.valid ? { authorized: true, username: result.username } : { authorized: false };
}

module.exports = { requireAuth };
