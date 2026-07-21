// cloudflare/functions/api/dashboard/export.js
const { requireAuth } = require('../../_lib/require-auth.js');

export async function onRequestGet({ request, env }) {
  const auth = await requireAuth(request, env);
  if (!auth.authorized) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { results } = await env.DB.prepare(
    `SELECT l.id, l.conversation_id, l.name, l.phone, l.reason, l.competitor_link, l.created_at
     FROM leads l ORDER BY l.created_at DESC`
  ).all();

  const header = 'id,conversation_id,name,phone,reason,competitor_link,created_at';
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = results.map(r =>
    [r.id, r.conversation_id, r.name, r.phone, r.reason, r.competitor_link, r.created_at].map(escape).join(',')
  );
  const csv = [header, ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv',
      'content-disposition': 'attachment; filename="3js-ai-assistant-leads.csv"'
    }
  });
}
