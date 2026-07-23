const { test } = require('node:test');
const assert = require('node:assert');
const { PROPERTY, querySearchAnalytics, fetchDaily, fetchBreakdown } =
  require('../cloudflare/functions/_lib/gsc-client.js');

function fakeFetch(payload, opts) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (opts && opts.fail) return { ok: false, status: 403, text: async () => 'forbidden' };
    return { ok: true, json: async () => payload };
  };
  impl.calls = calls;
  return impl;
}

test('PROPERTY is the domain property, url-encoded in the endpoint', async () => {
  assert.strictEqual(PROPERTY, 'sc-domain:3jsautobody.com');
  const f = fakeFetch({ rows: [] });
  await querySearchAnalytics('tok', { startDate: '2026-01-01', endDate: '2026-01-02' }, f);
  assert.strictEqual(
    f.calls[0].url,
    'https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3A3jsautobody.com/searchAnalytics/query'
  );
});

test('querySearchAnalytics sends the bearer token', async () => {
  const f = fakeFetch({ rows: [] });
  await querySearchAnalytics('tok-123', { startDate: '2026-01-01', endDate: '2026-01-02' }, f);
  assert.strictEqual(f.calls[0].init.headers.authorization, 'Bearer tok-123');
});

test('querySearchAnalytics throws a readable error on failure', async () => {
  const f = fakeFetch(null, { fail: true });
  await assert.rejects(
    () => querySearchAnalytics('tok', { startDate: 'a', endDate: 'b' }, f),
    /Search Console request failed \(403\): forbidden/
  );
});

test('fetchDaily requests the date dimension and maps rows', async () => {
  const f = fakeFetch({
    rows: [
      { keys: ['2026-07-01'], clicks: 12, impressions: 340, ctr: 0.0353, position: 7.4 },
      { keys: ['2026-07-02'], clicks: 9, impressions: 300, ctr: 0.03, position: 8.1 }
    ]
  });
  const rows = await fetchDaily('tok', '2026-07-01', '2026-07-02', f);
  assert.deepStrictEqual(f.calls[0].body.dimensions, ['date']);
  assert.strictEqual(f.calls[0].body.startDate, '2026-07-01');
  assert.strictEqual(f.calls[0].body.endDate, '2026-07-02');
  assert.deepStrictEqual(rows[0], { date: '2026-07-01', clicks: 12, impressions: 340, ctr: 0.0353, position: 7.4 });
  assert.strictEqual(rows.length, 2);
});

test('fetchDaily returns an empty array when the property has no data', async () => {
  const rows = await fetchDaily('tok', '2026-07-01', '2026-07-02', fakeFetch({}));
  assert.deepStrictEqual(rows, []);
});

test('fetchBreakdown maps the key to label and honours dimension and limit', async () => {
  const f = fakeFetch({
    rows: [{ keys: ['rhino lining near me'], clicks: 198, impressions: 3320, ctr: 0.0596, position: 4.6 }]
  });
  const rows = await fetchBreakdown('tok', 'query', '2026-07-01', '2026-07-28', 10, f);
  assert.deepStrictEqual(f.calls[0].body.dimensions, ['query']);
  assert.strictEqual(f.calls[0].body.rowLimit, 10);
  assert.deepStrictEqual(rows[0], {
    label: 'rhino lining near me', clicks: 198, impressions: 3320, ctr: 0.0596, position: 4.6
  });
});
