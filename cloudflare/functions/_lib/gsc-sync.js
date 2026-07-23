// cloudflare/functions/_lib/gsc-sync.js
const { getAccessToken } = require('./gsc-auth.js');
const { fetchDaily, fetchBreakdown } = require('./gsc-client.js');
const { computeWindows, shiftDays, LAG_DAYS } = require('./gsc-window.js');

// Google revises recent days for a while after the fact, so each nightly run
// re-pulls a rolling window rather than only yesterday.
const ROLLING_DAYS = 90;
const SNAPSHOT_LIMIT = 10;

async function runSync(env, deps) {
  const d = deps || {};
  const todayIso = d.todayIso || new Date().toISOString().slice(0, 10);
  const getToken = d.getAccessTokenImpl || getAccessToken;
  const daily = d.fetchDailyImpl || fetchDaily;
  const breakdown = d.fetchBreakdownImpl || fetchBreakdown;
  const now = new Date().toISOString();

  await env.DB.prepare(`UPDATE gsc_sync SET last_attempt_at = ? WHERE id = 1`).bind(now).run();

  try {
    if (!env.GSC_CLIENT_EMAIL || !env.GSC_PRIVATE_KEY) {
      throw new Error('GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY must be set as Worker secrets');
    }

    const syncRow = await env.DB.prepare(`SELECT last_success_at FROM gsc_sync WHERE id = 1`).first();
    const isFirstRun = !syncRow || !syncRow.last_success_at;

    const windows = computeWindows(todayIso);
    const end = shiftDays(todayIso, -LAG_DAYS);
    const start = isFirstRun ? windows.backfillStart : shiftDays(todayIso, -ROLLING_DAYS);

    const token = await getToken(env.GSC_CLIENT_EMAIL, env.GSC_PRIVATE_KEY);

    const dailyRows = await daily(token, start, end);
    const queryRows = await breakdown(token, 'query', windows.current.start, windows.current.end, SNAPSHOT_LIMIT);
    const pageRows = await breakdown(token, 'page', windows.current.start, windows.current.end, SNAPSHOT_LIMIT);

    // Upsert rather than replace: gsc_daily accumulates history that Google
    // itself discards after 16 months, so nothing here is ever deleted.
    for (const r of dailyRows) {
      await env.DB.prepare(
        `INSERT INTO gsc_daily (date, clicks, impressions, ctr, position)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(date) DO UPDATE SET
           clicks = excluded.clicks,
           impressions = excluded.impressions,
           ctr = excluded.ctr,
           position = excluded.position`
      ).bind(r.date, r.clicks, r.impressions, r.ctr, r.position).run();
    }

    // The snapshot is current-state, not history, so it is replaced wholesale.
    await env.DB.prepare(`DELETE FROM gsc_snapshot`).run();
    for (const [type, rows] of [['query', queryRows], ['page', pageRows]]) {
      for (const r of rows) {
        await env.DB.prepare(
          `INSERT INTO gsc_snapshot (type, label, clicks, impressions, ctr, position, captured_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(type, r.label, r.clicks, r.impressions, r.ctr, r.position, now).run();
      }
    }

    await env.DB.prepare(
      `UPDATE gsc_sync SET last_success_at = ?, last_error = ? WHERE id = 1`
    ).bind(now, null).run();

    return {
      backfilled: isFirstRun,
      dailyRows: dailyRows.length,
      queryRows: queryRows.length,
      pageRows: pageRows.length
    };
  } catch (err) {
    // Record and rethrow, leaving the data tables untouched so the dashboard
    // keeps showing the last good numbers behind a staleness warning.
    await env.DB.prepare(`UPDATE gsc_sync SET last_error = ? WHERE id = 1`)
      .bind(String(err && err.message ? err.message : err)).run();
    throw err;
  }
}

module.exports = { runSync, ROLLING_DAYS, SNAPSHOT_LIMIT };
