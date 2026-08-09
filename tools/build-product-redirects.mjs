// Map retired Wix /product-page/<slug> URLs onto the rebuilt catalog.
//
// Those 271 URLs carry ~22% of all search visibility. They currently all
// 301 to /parts-catalog, which Google treats as a soft 404 and which will not
// preserve their rankings.
//
// The Wix slugs carry the product line but NOT the vehicle
// ("stealth-fighter-front-bumper-5" could be any of a dozen trucks), so a
// single product page is usually the wrong guess. Instead each slug is scored
// against the catalog's product names and sent to the right category with the
// search pre-filled, which lands the visitor on the matching products.
//
// Usage:
//   GSC_SITE="sc-domain:3jsautobody.com" node tools/gsc-query.mjs \
//     --days 480 --filter product-page --rows 500 > /tmp/pp.tsv
//   node tools/build-product-redirects.mjs /tmp/pp.tsv > /tmp/rules.txt
//
// Prints _redirects lines plus a report on stderr.

import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(fs.realpathSync(new URL(import.meta.url)));
const REPO = path.dirname(HERE);
const HPAG_DIR = path.join(REPO, 'cloudflare', 'hpag');

// Words in slugs that describe the product, not the vehicle or the noise.
// "series" is deliberately NOT here -- "Race Series" and "Spec Series" are
// product lines, and dropping the word turned the query into "race rear bumper".
const STOP = new Set(['the', 'and', 'for', 'with', 'of']);

function loadCatalog() {
  global.window = global;
  for (const f of fs.readdirSync(HPAG_DIR)) {
    if (f.endsWith('.js')) {
      // eslint-disable-next-line no-eval
      eval(fs.readFileSync(path.join(HPAG_DIR, f), 'utf8'));
    }
  }
  const out = [];
  for (const cat of Object.keys(global.HPAG)) {
    const names = new Set(global.HPAG[cat].rows.map(r => r[1]));
    for (const name of names) out.push({ cat, name });
  }
  return out;
}

const tokens = (s) => s.toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .split(' ')
  // Single letters are trim markers ("Race Series R") that the slug keeps but
  // the catalog name may not. Treated as signal they sank real matches.
  .filter(t => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));

// Fallback routing for products that are genuinely gone (ADD Lite, the
// half-over-cab chase rack). Sending these to the right shelf beats the
// catalog root, which Google reads as a soft 404.
const TYPE_CATEGORY = [
  [/chase.?rack|bed.?cage|roof.?rack|cargo/, 'roof-racks', 'chase rack'],
  [/side.?step|rock.?slider|step/, 'rock-sliders', 'side steps'],
  [/skid.?plate|skid/, 'skid-plates', 'skid plate'],
  [/molle|storage|shelf/, 'molle-storage', 'molle'],
  [/front.?bumper/, 'bumpers', 'front bumper'],
  [/rear.?bumper/, 'bumpers', 'rear bumper'],
  [/bumper|winch|light.?hoop|tire.?carrier/, 'bumpers', 'bumper'],
  [/light|led|hoop/, 'lighting', ''],
  [/bracket|mount|relocation|kit|panel|fender/, 'offroad-accessories', ''],
];

function fallbackRoute(slug) {
  for (const [re, cat, q] of TYPE_CATEGORY) {
    if (re.test(slug)) return { cat, q };
  }
  return null;
}

function slugTerms(slug) {
  // Wix appends a disambiguating -<n>; it carries no meaning for us.
  return tokens(slug.replace(/-\d+$/, ''));
}

// Rare words decide the match. Plain word-overlap sent "add-lite-front-bumper"
// to an "ADD PRO Front Bumper" -- a different product -- because "front" and
// "bumper" are everywhere and the one word that mattered, "lite", was not.
function buildIdf(catalog) {
  const df = new Map();
  for (const c of catalog) {
    for (const t of new Set(c.toks)) df.set(t, (df.get(t) || 0) + 1);
  }
  const n = catalog.length;
  return (t) => Math.log((n + 1) / ((df.get(t) || 0) + 1)) + 1;
}

function score(slugToks, nameToks, idf) {
  const nameSet = new Set(nameToks);
  let got = 0, want = 0;
  for (const t of slugToks) {
    const w = idf(t);
    want += w;
    if (nameSet.has(t)) got += w;
  }
  if (!want) return { ratio: 0, score: 0 };
  const ratio = got / want;
  // Slight preference for the tighter name when two score the same.
  return { ratio, score: ratio * 2 + got / (nameToks.length || 1) };
}

function main() {
  const tsv = process.argv[2];
  if (!tsv) {
    console.error('usage: node tools/build-product-redirects.mjs <gsc.tsv>');
    process.exit(1);
  }
  const catalog = loadCatalog().map(c => ({ ...c, toks: tokens(c.name) }));
  const idf = buildIdf(catalog);

  const rows = fs.readFileSync(tsv, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('\t'))
    .filter(p => p.length >= 3)
    .map(([clicks, impressions, url]) => ({
      clicks: +clicks,
      impressions: +impressions,
      path: new URL(url).pathname,
    }))
    .filter(r => r.path.startsWith('/product-page/'));

  rows.sort((a, b) => b.impressions - a.impressions);

  const lines = [];
  const report = [];
  let matched = 0, shelved = 0, unmatched = 0;
  let matchedImpr = 0, shelvedImpr = 0, unmatchedImpr = 0;

  for (const r of rows) {
    const slug = r.path.replace('/product-page/', '');
    const st = slugTerms(slug);
    let best = null, bestScore = 0, bestRatio = 0;
    for (const c of catalog) {
      const { ratio, score: sc } = score(st, c.toks, idf);
      if (sc > bestScore) { bestScore = sc; bestRatio = ratio; best = c; }
    }
    // The slug's distinctive words have to be present, not just its common ones.
    if (best && bestRatio >= 0.72) {
      const q = st.join(' ');
      lines.push(`${r.path}  /parts-catalog?cat=${best.cat}&q=${
        encodeURIComponent(q)}  301`);
      report.push(`  EXACT ${String(r.impressions).padStart(5)} impr  ${slug}\n` +
                  `         -> ${best.cat} "${q}"  (matches: ${best.name})`);
      matched++; matchedImpr += r.impressions;
    } else {
      const fb = fallbackRoute(slug);
      if (fb) {
        const qs = fb.q ? `&q=${encodeURIComponent(fb.q)}` : '';
        lines.push(`${r.path}  /parts-catalog?cat=${fb.cat}${qs}  301`);
        report.push(`  SHELF ${String(r.impressions).padStart(5)} impr  ${slug}\n` +
                    `         -> ${fb.cat}${fb.q ? ` "${fb.q}"` : ''}  (no exact product; discontinued)`);
        shelved++; shelvedImpr += r.impressions;
      } else {
        report.push(`  NONE  ${String(r.impressions).padStart(5)} impr  ${slug}`);
        unmatched++; unmatchedImpr += r.impressions;
      }
    }
  }

  console.log('# Retired Wix product pages -> rebuilt catalog.');
  console.log('# Generated by tools/build-product-redirects.mjs, from Search');
  console.log('# Console impression data. Keep ABOVE the /product-page/* catch-all.');
  for (const l of lines) console.log(l);

  console.error(report.join('\n'));
  const tot = matchedImpr + shelvedImpr + unmatchedImpr;
  console.error(`\nexact product match : ${matched} urls, ${matchedImpr} impressions`);
  console.error(`right category      : ${shelved} urls, ${shelvedImpr} impressions`);
  console.error(`no route            : ${unmatched} urls, ${unmatchedImpr} impressions`);
  console.error(`routed              : ${(100 * (matchedImpr + shelvedImpr) / tot).toFixed(1)}% of impressions`);
}

main();
