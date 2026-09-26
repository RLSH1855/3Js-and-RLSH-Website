// cloudflare/functions/api/auth/login.js
const { verifyPassword, signSession } = require('../../_lib/session.js');
const { getUserByUsername, recordFailedLogin, isLoginLocked, clearFailedLogins, LOGIN_ATTEMPT_WINDOW_MIN } = require('../../_lib/db.js');

export async function onRequestPost({ request, env }) {
  let username, password;
  try {
    ({ username, password } = await request.json());
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Username and password required' }), { status: 400 });
  }

  // Five wrong passwords in fifteen minutes locks the account, regardless of
  // whether it's the same person retrying or someone guessing.
  if (await isLoginLocked(env.DB, username)) {
    return new Response(
      JSON.stringify({ error: `Too many failed attempts. Try again in ${LOGIN_ATTEMPT_WINDOW_MIN} minutes.` }),
      { status: 429 }
    );
  }

  const user = await getUserByUsername(env.DB, username);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    await recordFailedLogin(env.DB, username);
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }
  await clearFailedLogins(env.DB, username);

  const token = await signSession(user.username, env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Set-Cookie': `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    }
  });
}
