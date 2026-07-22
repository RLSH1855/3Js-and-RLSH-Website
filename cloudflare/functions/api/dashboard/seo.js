// cloudflare/functions/api/dashboard/seo.js
const { requireAuth } = require('../../_lib/require-auth.js');
const { buildReport } = require('../../_lib/gsc-report.js');

export async function onRequestGet({ request, env }) {
  const auth = await requireAuth(request, env);
  if (!auth.authorized) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  // Reads only what the nightly Worker stored -- no Google call at request
  // time, so the tab loads instantly regardless of API latency.
  const daily = await env.DB.prepare(
    `SELECT date, clicks, impressions, ctr, position FROM gsc_daily ORDER BY date ASC`
  ).all();
  const snapshot = await env.DB.prepare(
    `SELECT type, label, clicks, impressions, ctr, position FROM gsc_snapshot`
  ).all();
  const sync = await env.DB.prepare(
    `SELECT last_success_at, last_error FROM gsc_sync WHERE id = 1`
  ).first();

  const report = buildReport(daily.results || [], snapshot.results || [], sync || {}, null);
  return new Response(JSON.stringify(report), {
    headers: { 'content-type': 'application/json' }
  });
}
