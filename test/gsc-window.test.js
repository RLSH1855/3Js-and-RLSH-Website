const { test } = require('node:test');
const assert = require('node:assert');
const { isoDate, shiftDays, computeWindows, summarize, pctDelta, LAG_DAYS, WINDOW_DAYS } =
  require('../cloudflare/functions/_lib/gsc-window.js');

test('constants match the agreed reporting rules', () => {
  assert.strictEqual(LAG_DAYS, 3);
  assert.strictEqual(WINDOW_DAYS, 28);
});

test('isoDate formats a Date as YYYY-MM-DD', () => {
  assert.strictEqual(isoDate(new Date(Date.UTC(2026, 6, 22))), '2026-07-22');
});

test('shiftDays moves forward and backward across month boundaries', () => {
  assert.strictEqual(shiftDays('2026-07-01', -1), '2026-06-30');
  assert.strictEqual(shiftDays('2026-02-28', 1), '2026-03-01'); // 2026 is not a leap year
  assert.strictEqual(shiftDays('2026-07-22', 0), '2026-07-22');
});

test('computeWindows excludes the last 3 days and builds two adjacent 28-day windows', () => {
  const w = computeWindows('2026-07-22');
  assert.strictEqual(w.current.end, '2026-07-19');
  assert.strictEqual(w.current.start, '2026-06-22');
  assert.strictEqual(w.prior.end, '2026-06-21');
  assert.strictEqual(w.prior.start, '2026-05-25');
});

test('computeWindows current and prior windows are the same length and do not overlap', () => {
  const w = computeWindows('2026-07-22');
  const span = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
  assert.strictEqual(span(w.current.start, w.current.end), WINDOW_DAYS - 1);
  assert.strictEqual(span(w.prior.start, w.prior.end), WINDOW_DAYS - 1);
  assert.ok(Date.parse(w.prior.end) < Date.parse(w.current.start));
});

test('computeWindows backfillStart reaches back 16 months', () => {
  const w = computeWindows('2026-07-22');
  assert.strictEqual(w.backfillStart, '2025-03-22');
});

test('summarize sums clicks and impressions inside the window only', () => {
  const rows = [
    { date: '2026-06-21', clicks: 999, impressions: 999, position: 1 }, // before window
    { date: '2026-06-22', clicks: 10, impressions: 100, position: 4 },
    { date: '2026-07-19', clicks: 30, impressions: 300, position: 8 },
    { date: '2026-07-20', clicks: 777, impressions: 777, position: 1 }  // after window
  ];
  const s = summarize(rows, '2026-06-22', '2026-07-19');
  assert.strictEqual(s.clicks, 40);
  assert.strictEqual(s.impressions, 400);
});

test('summarize recomputes CTR from totals rather than averaging daily CTRs', () => {
  const rows = [
    { date: '2026-07-01', clicks: 1, impressions: 1, position: 1 },    // 100% CTR
    { date: '2026-07-02', clicks: 0, impressions: 999, position: 50 }  // ~0% CTR
  ];
  const s = summarize(rows, '2026-07-01', '2026-07-02');
  // Averaging the daily rates would give ~0.5; the correct answer is 1/1000.
  assert.ok(Math.abs(s.ctr - 0.001) < 1e-9);
});

test('summarize weights average position by impressions', () => {
  const rows = [
    { date: '2026-07-01', clicks: 0, impressions: 1, position: 100 },
    { date: '2026-07-02', clicks: 0, impressions: 99, position: 1 }
  ];
  const s = summarize(rows, '2026-07-01', '2026-07-02');
  // Unweighted mean would be 50.5; impression-weighted is 1.99.
  assert.ok(Math.abs(s.position - 1.99) < 1e-9);
});

test('summarize returns zeroes and not NaN for an empty window', () => {
  const s = summarize([], '2026-07-01', '2026-07-28');
  assert.deepStrictEqual(s, { clicks: 0, impressions: 0, ctr: 0, position: 0 });
});

test('pctDelta computes percent change and returns null when prior is zero', () => {
  assert.strictEqual(pctDelta(110, 100), 10);
  assert.strictEqual(pctDelta(50, 100), -50);
  assert.strictEqual(pctDelta(5, 0), null);
});
