// cloudflare/functions/api/dashboard/seo-export.js
// Flat filename rather than seo/export.js to avoid a file-vs-directory
// routing collision with seo.js.
const { requireAuth } = require('../../_lib/require-auth.js');
const { toCsv } = require('../../_lib/csv.js');

export async function onRequestGet({ request, env }) {
  const auth = await requireAuth(request, env);
  if (!auth.authorized) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const type = new URL(request.url).searchParams.get('type') || 'daily';
  let csv;
  let filename;

  if (type === 'daily') {
    const { results } = await env.DB.prepare(
      `SELECT date, clicks, impressions, ctr, position FROM gsc_daily ORDER BY date ASC`
    ).all();
    csv = toCsv(
      ['date', 'clicks', 'impressions', 'ctr', 'position'],
      (results || []).map(r => [r.date, r.clicks, r.impressions, r.ctr, r.position])
    );
    filename = '3js-search-console-daily.csv';
  } else if (type === 'queries' || type === 'pages') {
    const dimension = type === 'queries' ? 'query' : 'page';
    const { results } = await env.DB.prepare(
      `SELECT label, clicks, impressions, ctr, position, captured_at
       FROM gsc_snapshot WHERE type = ? ORDER BY clicks DESC`
    ).bind(dimension).all();
    csv = toCsv(
      [dimension, 'clicks', 'impressions', 'ctr', 'position', 'captured_at'],
      (results || []).map(r => [r.label, r.clicks, r.impressions, r.ctr, r.position, r.captured_at])
    );
    filename = `3js-search-console-${type}.csv`;
  } else {
    return new Response(JSON.stringify({ error: 'type must be daily, queries or pages' }), { status: 400 });
  }

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv',
      'content-disposition': `attachment; filename="${filename}"`
    }
  });
}
