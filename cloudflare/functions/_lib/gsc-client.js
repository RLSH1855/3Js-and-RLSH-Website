// cloudflare/functions/_lib/gsc-client.js
// The Domain property covers www, non-www, http and https. The account also
// holds two URL-prefix properties, but both are strict subsets of this one.
const PROPERTY = 'sc-domain:3jsautobody.com';
const API_BASE = 'https://searchconsole.googleapis.com/webmasters/v3/sites';

function endpoint() {
  return `${API_BASE}/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`;
}

async function querySearchAnalytics(token, body, fetchImpl) {
  const doFetch = fetchImpl || fetch;
  const res = await doFetch(endpoint(), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Search Console request failed (${res.status}): ${detail}`);
  }
  return res.json();
}

// 16 months of daily rows is ~490, comfortably under the 1000-row default,
// so no pagination is required.
async function fetchDaily(token, start, end, fetchImpl) {
  const data = await querySearchAnalytics(token, {
    startDate: start,
    endDate: end,
    dimensions: ['date'],
    rowLimit: 1000
  }, fetchImpl);
  return (data.rows || []).map(r => ({
    date: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position
  }));
}

async function fetchBreakdown(token, dimension, start, end, limit, fetchImpl) {
  const data = await querySearchAnalytics(token, {
    startDate: start,
    endDate: end,
    dimensions: [dimension],
    rowLimit: limit
  }, fetchImpl);
  return (data.rows || []).map(r => ({
    label: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position
  }));
}

module.exports = { PROPERTY, endpoint, querySearchAnalytics, fetchDaily, fetchBreakdown };
