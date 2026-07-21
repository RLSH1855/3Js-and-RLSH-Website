// cloudflare/functions/api/dashboard/conversations.js
const { requireAuth } = require('../../_lib/require-auth.js');
const { listConversations } = require('../../_lib/db.js');

export async function onRequestGet({ request, env }) {
  const auth = await requireAuth(request, env);
  if (!auth.authorized) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const conversations = await listConversations(env.DB);
  return new Response(JSON.stringify({ conversations }), {
    headers: { 'content-type': 'application/json' }
  });
}
