// cloudflare/functions/api/chat.js
const { callClaude } = require('../_lib/claude-client.js');
const { ensureConversation, saveMessage, saveLead, getConversationHistory } = require('../_lib/db.js');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS }
  });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!body || typeof body !== 'object') {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { conversationId, message } = body;
  if (!conversationId || !message || typeof message !== 'string') {
    return jsonResponse({ error: 'conversationId and message are required' }, 400);
  }

  await ensureConversation(env.DB, conversationId);
  await saveMessage(env.DB, conversationId, 'user', message);

  const history = await getConversationHistory(env.DB, conversationId);
  const anthropicHistory = history.map(m => ({ role: m.role, content: m.content }));

  let result;
  try {
    result = await callClaude({ apiKey: env.ANTHROPIC_API_KEY, history: anthropicHistory });
  } catch (err) {
    return jsonResponse({ error: 'Assistant is temporarily unavailable, please call 562-424-6744.', debug: String(err && err.message || err) }, 502);
  }

  await saveMessage(env.DB, conversationId, 'assistant', result.replyText);

  if (result.capturedLead) {
    await saveLead(env.DB, conversationId, result.capturedLead);
  }

  return jsonResponse({ conversationId, reply: result.replyText });
}
