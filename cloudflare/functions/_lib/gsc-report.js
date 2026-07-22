// cloudflare/functions/_lib/gsc-report.js
const { computeWindows, summarize, pctDelta, shiftDays, LAG_DAYS } = require('./gsc-window.js');

// Past this, the tab warns rather than presenting old numbers as current.
const STALE_HOURS = 48;

function buildReport(dailyRows, snapshotRows, syncRow, todayIso) {
  const today = todayIso || new Date().toISOString().slice(0, 10);
  const windows = computeWindows(today);
  const incompleteFrom = shiftDays(today, -(LAG_DAYS - 1));

  const current = summarize(dailyRows, windows.current.start, windows.current.end);
  const prior = summarize(dailyRows, windows.prior.start, windows.prior.end);

  const updatedAt = syncRow && syncRow.last_success_at ? syncRow.last_success_at : null;
  const stale = !updatedAt || (Date.now() - Date.parse(updatedAt)) > STALE_HOURS * 3600 * 1000;

  const series = dailyRows
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map(r => ({
      date: r.date,
      clicks: r.clicks,
      impressions: r.impressions,
      incomplete: r.date >= incompleteFrom
    }));

  const byType = type => snapshotRows
    .filter(r => r.type === type)
    .sort((a, b) => b.clicks - a.clicks)
    .map(r => ({
      label: r.label,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position
    }));

  return {
    updatedAt,
    stale,
    windows: { current: windows.current, prior: windows.prior },
    incompleteFrom,
    totals: {
      clicks: { value: current.clicks, delta: pctDelta(current.clicks, prior.clicks) },
      impressions: { value: current.impressions, delta: pctDelta(current.impressions, prior.impressions) },
      ctr: { value: current.ctr, delta: pctDelta(current.ctr, prior.ctr) },
      position: { value: current.position, delta: pctDelta(current.position, prior.position) }
    },
    series,
    queries: byType('query'),
    pages: byType('page')
  };
}

module.exports = { buildReport, STALE_HOURS };
