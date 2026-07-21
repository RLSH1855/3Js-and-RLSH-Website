// cloudflare/functions/api/dashboard/conversation.js
const { requireAuth } = require('../../_lib/require-auth.js');
const { getConversationHistory, listLeadsForConversation } = require('../../_lib/db.js');

export async function onRequestGet({ request, env }) {
  const auth = await requireAuth(request, env);
  if (!auth.authorized) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'id is required' }), { status: 400 });

  const messages = await getConversationHistory(env.DB, id);
  const leads = await listLeadsForConversation(env.DB, id);
  return new Response(JSON.stringify({ messages, leads }), {
    headers: { 'content-type': 'application/json' }
  });
}
