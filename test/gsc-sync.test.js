const { test } = require('node:test');
const assert = require('node:assert');
const { runSync } = require('../cloudflare/functions/_lib/gsc-sync.js');

// Minimal D1 stand-in: records every statement and its bindings.
function fakeDb(syncRow) {
  const executed = [];
  return {
    executed,
    prepare(sql) {
      return {
        sql,
        bind(...args) { this.args = args; return this; },
        async run() { executed.push({ sql, args: this.args || [] }); return { success: true }; },
        async first() { return syncRow; },
        async all() { return { results: [] }; }
      };
    }
  };
}

function deps(overrides) {
  return Object.assign({
    todayIso: '2026-07-22',
    getAccessTokenImpl: async () => 'tok',
    fetchDailyImpl: async () => ([
      { date: '2026-07-19', clicks: 5, impressions: 50, ctr: 0.1, position: 3.2 }
    ]),
    fetchBreakdownImpl: async (token, dimension) => ([
      { label: dimension === 'query' ? 'rhino lining' : '/rhino-liner', clicks: 3, impressions: 30, ctr: 0.1, position: 2.5 }
    ])
  }, overrides || {});
}

const env = { GSC_CLIENT_EMAIL: 'bot@example.com', GSC_PRIVATE_KEY: 'PEM' };

test('first run (no prior success) backfills from 16 months back', async () => {
  const db = fakeDb({ last_success_at: null });
  let requestedStart = null;
  const d = deps({
    fetchDailyImpl: async (t, start) => { requestedStart = start; return []; }
  });
  const result = await runSync(Object.assign({ DB: db }, env), d);
  assert.strictEqual(result.backfilled, true);
  assert.strictEqual(requestedStart, '2025-03-22');
});

test('subsequent run pulls only a rolling 90-day window', async () => {
  const db = fakeDb({ last_success_at: '2026-07-21T09:00:00.000Z' });
  let requestedStart = null;
  const d = deps({
    fetchDailyImpl: async (t, start) => { requestedStart = start; return []; }
  });
  const result = await runSync(Object.assign({ DB: db }, env), d);
  assert.strictEqual(result.backfilled, false);
  assert.strictEqual(requestedStart, '2026-04-23'); // 2026-07-22 minus 90 days
});

test('the data window always ends 3 days back, never today', async () => {
  const db = fakeDb({ last_success_at: '2026-07-21T09:00:00.000Z' });
  let requestedEnd = null;
  const d = deps({
    fetchDailyImpl: async (t, start, end) => { requestedEnd = end; return []; }
  });
  await runSync(Object.assign({ DB: db }, env), d);
  assert.strictEqual(requestedEnd, '2026-07-19');
});

test('daily rows are upserted and snapshot rows replaced', async () => {
  const db = fakeDb({ last_success_at: '2026-07-21T09:00:00.000Z' });
  const result = await runSync(Object.assign({ DB: db }, env), deps());
  assert.strictEqual(result.dailyRows, 1);
  assert.strictEqual(result.queryRows, 1);
  assert.strictEqual(result.pageRows, 1);
  const sqls = db.executed.map(e => e.sql).join(' | ');
  assert.ok(/INSERT INTO gsc_daily/.test(sqls));
  assert.ok(/ON CONFLICT\(date\) DO UPDATE/.test(sqls));
  assert.ok(/DELETE FROM gsc_snapshot/.test(sqls));
  assert.ok(/INSERT INTO gsc_snapshot/.test(sqls));
});

test('gsc_daily is never deleted from -- history must accumulate', async () => {
  const db = fakeDb({ last_success_at: null });
  await runSync(Object.assign({ DB: db }, env), deps());
  const sqls = db.executed.map(e => e.sql).join(' | ');
  assert.ok(!/DELETE FROM gsc_daily/.test(sqls));
});

test('a successful run stamps last_success_at and clears last_error', async () => {
  const db = fakeDb({ last_success_at: null });
  await runSync(Object.assign({ DB: db }, env), deps());
  const success = db.executed.filter(e => /UPDATE gsc_sync/.test(e.sql) && /last_success_at/.test(e.sql));
  assert.strictEqual(success.length, 1);
  assert.ok(success[0].args.includes(null)); // last_error cleared
});

test('a failed run records the error and leaves data tables untouched', async () => {
  const db = fakeDb({ last_success_at: null });
  const d = deps({ fetchDailyImpl: async () => { throw new Error('boom'); } });
  await assert.rejects(() => runSync(Object.assign({ DB: db }, env), d), /boom/);
  const sqls = db.executed.map(e => e.sql).join(' | ');
  assert.ok(!/INSERT INTO gsc_daily/.test(sqls));
  assert.ok(!/DELETE FROM gsc_snapshot/.test(sqls));
  const errored = db.executed.filter(e => /UPDATE gsc_sync/.test(e.sql) && /last_error/.test(e.sql));
  assert.ok(errored.some(e => e.args.some(a => String(a).includes('boom'))));
});

test('missing credentials fail fast with a clear message', async () => {
  const db = fakeDb({ last_success_at: null });
  await assert.rejects(
    () => runSync({ DB: db }, deps()),
    /GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY must be set/
  );
});
