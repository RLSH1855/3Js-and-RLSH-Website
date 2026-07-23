// cloudflare/functions/_lib/gsc-window.js
// Google finalises Search Console data on a 2-3 day lag; the most recent days
// are always under-reported and would read as a traffic drop that never
// happened, so every total excludes them.
const LAG_DAYS = 3;
const WINDOW_DAYS = 28;
const BACKFILL_MONTHS = 16;

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function shiftDays(isoStr, delta) {
  const d = new Date(isoStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return isoDate(d);
}

function shiftMonths(isoStr, delta) {
  const d = new Date(isoStr + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + delta);
  return isoDate(d);
}

function computeWindows(todayIso) {
  const currentEnd = shiftDays(todayIso, -LAG_DAYS);
  const currentStart = shiftDays(currentEnd, -(WINDOW_DAYS - 1));
  const priorEnd = shiftDays(currentStart, -1);
  const priorStart = shiftDays(priorEnd, -(WINDOW_DAYS - 1));
  return {
    current: { start: currentStart, end: currentEnd },
    prior: { start: priorStart, end: priorEnd },
    backfillStart: shiftMonths(todayIso, -BACKFILL_MONTHS)
  };
}

// CTR is recomputed from totals and position is impression-weighted. Averaging
// either across days gives a number that looks plausible and is wrong.
function summarize(rows, start, end) {
  let clicks = 0;
  let impressions = 0;
  let positionWeighted = 0;
  for (const r of rows) {
    if (r.date < start || r.date > end) continue;
    clicks += r.clicks;
    impressions += r.impressions;
    positionWeighted += r.position * r.impressions;
  }
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: impressions > 0 ? positionWeighted / impressions : 0
  };
}

function pctDelta(current, prior) {
  if (!prior) return null;
  return ((current - prior) / prior) * 100;
}

module.exports = {
  LAG_DAYS, WINDOW_DAYS, BACKFILL_MONTHS,
  isoDate, shiftDays, shiftMonths, computeWindows, summarize, pctDelta
};
