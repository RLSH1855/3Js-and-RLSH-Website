const { test } = require('node:test');
const assert = require('node:assert');
const { buildReport, STALE_HOURS } = require('../cloudflare/functions/_lib/gsc-report.js');

function daily(date, clicks, impressions, position) {
  return { date, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

// Freshness is measured against the wall clock, so build these relative to now
// rather than hardcoding dates that would rot.
const hoursAgo = h => new Date(Date.now() - h * 3600 * 1000).toISOString();

test('STALE_HOURS is 48', () => {
  assert.strictEqual(STALE_HOURS, 48);
});

test('reports the freshness stamp and flags staleness past the threshold', () => {
  const stamp = hoursAgo(2);
  const fresh = buildReport([], [], { last_success_at: stamp }, '2026-07-22');
  assert.strictEqual(fresh.updatedAt, stamp);
  assert.strictEqual(fresh.stale, false);

  const old = buildReport([], [], { last_success_at: hoursAgo(72) }, '2026-07-22');
  assert.strictEqual(old.stale, true);
});

test('a never-synced database reports null updatedAt and stale true', () => {
  const r = buildReport([], [], { last_success_at: null }, '2026-07-22');
  assert.strictEqual(r.updatedAt, null);
  assert.strictEqual(r.stale, true);
});

test('totals compare the 28-day window against the prior 28 days', () => {
  const rows = [
    daily('2026-06-22', 10, 100, 5),  // current window start
    daily('2026-07-19', 10, 100, 5),  // current window end
    daily('2026-05-25', 5, 100, 5),   // prior window start
    daily('2026-06-21', 5, 100, 5)    // prior window end
  ];
  const r = buildReport(rows, [], { last_success_at: hoursAgo(1) }, '2026-07-22');
  assert.strictEqual(r.totals.clicks.value, 20);
  assert.strictEqual(r.totals.clicks.delta, 100); // 20 vs 10
  assert.strictEqual(r.totals.impressions.value, 200);
});

test('totals exclude the 3 most recent days entirely', () => {
  const rows = [
    daily('2026-07-19', 10, 100, 5),   // last trustworthy day, counted
    daily('2026-07-20', 999, 999, 1),  // excluded
    daily('2026-07-21', 999, 999, 1),  // excluded
    daily('2026-07-22', 999, 999, 1)   // excluded
  ];
  const r = buildReport(rows, [], { last_success_at: hoursAgo(1) }, '2026-07-22');
  assert.strictEqual(r.totals.clicks.value, 10);
});

test('series still includes recent days but marks them incomplete', () => {
  const rows = [daily('2026-07-19', 10, 100, 5), daily('2026-07-21', 4, 40, 5)];
  const r = buildReport(rows, [], { last_success_at: hoursAgo(1) }, '2026-07-22');
  const byDate = Object.fromEntries(r.series.map(s => [s.date, s.incomplete]));
  assert.strictEqual(byDate['2026-07-19'], false);
  assert.strictEqual(byDate['2026-07-21'], true);
  assert.strictEqual(r.incompleteFrom, '2026-07-20');
});

test('series is sorted oldest to newest', () => {
  const rows = [daily('2026-07-19', 1, 1, 1), daily('2026-06-22', 1, 1, 1), daily('2026-07-01', 1, 1, 1)];
  const r = buildReport(rows, [], { last_success_at: null }, '2026-07-22');
  assert.deepStrictEqual(r.series.map(s => s.date), ['2026-06-22', '2026-07-01', '2026-07-19']);
});

test('snapshot rows are split into queries and pages, ordered by clicks', () => {
  const snap = [
    { type: 'query', label: 'b', clicks: 5, impressions: 50, ctr: 0.1, position: 3 },
    { type: 'query', label: 'a', clicks: 9, impressions: 90, ctr: 0.1, position: 2 },
    { type: 'page', label: '/x', clicks: 7, impressions: 70, ctr: 0.1, position: 4 }
  ];
  const r = buildReport([], snap, { last_success_at: null }, '2026-07-22');
  assert.deepStrictEqual(r.queries.map(q => q.label), ['a', 'b']);
  assert.deepStrictEqual(r.pages.map(p => p.label), ['/x']);
});

test('delta is null rather than Infinity when the prior window had nothing', () => {
  const rows = [daily('2026-07-19', 10, 100, 5)];
  const r = buildReport(rows, [], { last_success_at: null }, '2026-07-22');
  assert.strictEqual(r.totals.clicks.delta, null);
});
