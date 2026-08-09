// Pull Search Console page data with the read-only service account.
//
// Used to find which old Wix URLs still carry search traffic, so the
// _redirects file can point them at the right page on the new site.
//
// Usage:
//   node tools/gsc-query.mjs [--days 480] [--filter product-page] [--rows 2000]
//
// Prints TSV: clicks, impressions, url

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// tools/ -> repo root -> the projects folder that holds the service-account key
const HERE = path.dirname(fs.realpathSync(new URL(import.meta.url)));
const KEY_PATH = process.env.GSC_KEY_PATH || path.join(
  path.dirname(path.dirname(HERE)), 'js3-dashboard-c1ed25d0d70a.json');

const SITE = process.env.GSC_SITE || 'https://www.3jsautobody.com/';

function arg(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? process.argv[i + 1] : dflt;
}

function b64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const sig = signer.sign(key.private_key, 'base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${sig}`,
    }),
  });
  const json = await res.json();
  if (!json.access_token) {
    throw new Error('token request failed: ' + JSON.stringify(json));
  }
  return json.access_token;
}

async function main() {
  const days = Number(arg('days', 480));
  const filter = arg('filter', '');
  const rowLimit = Number(arg('rows', 2000));

  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const token = await getToken(key);

  if (process.argv.includes('--list')) {
    const res = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites',
      { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 1));
    return;
  }

  const end = new Date();
  const start = new Date(end.getTime() - days * 864e5);
  const fmt = (d) => d.toISOString().slice(0, 10);

  const body = {
    startDate: fmt(start),
    endDate: fmt(end),
    dimensions: ['page'],
    rowLimit,
  };
  if (filter) {
    body.dimensionFilterGroups = [{
      filters: [{ dimension: 'page', operator: 'contains', expression: filter }],
    }];
  }

  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${
    encodeURIComponent(SITE)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.error) {
    throw new Error('GSC query failed: ' + JSON.stringify(json.error));
  }
  const rows = json.rows || [];
  rows.sort((a, b) => b.impressions - a.impressions);
  console.error(`# ${rows.length} pages, ${fmt(start)} .. ${fmt(end)}`);
  for (const r of rows) {
    console.log(`${r.clicks}\t${r.impressions}\t${r.keys[0]}`);
  }
}

main().catch((e) => { console.error(String(e)); process.exit(1); });
