// tools/catalog/backfill-images.mjs
//
// Fills empty image fields in cloudflare/*-data.js from PIES supplier feeds.
// Handles both PIES shapes we have on disk:
//   • pipe-delimited  *_PIESImage72.txt  — one asset per line
//   • XML             *_PIES72.xml       — assets nested under <Item>
//
// Never overwrites an existing image. Verifies every URL with a HEAD request
// before writing, because a 404 renders a broken image, which is worse than the
// branded placeholder the catalog already falls back to.
//
// Usage:
//   node tools/catalog/backfill-images.mjs             # dry run + URL check
//   node tools/catalog/backfill-images.mjs --apply
//   node tools/catalog/backfill-images.mjs --no-verify # skip HEAD checks (fast)

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DIR = 'cloudflare';
const APPLY = process.argv.includes('--apply');
const VERIFY = !process.argv.includes('--no-verify');
const ASSETS = 'C:/Users/James/Desktop/MY WEB APP PROJECTS';

// brand → supplier feed
const SOURCES = [
  { brand: 'Spyder Auto',      file: `${ASSETS}/VEHICLE DATA ASSETS/spider auto/SPY20260315_PIES72.xml`,        kind: 'xml' },
  { brand: 'Rigid Industries', file: `${ASSETS}/VEHICLE DATA ASSETS/rigid industries/RIG20260415_PIES72.xml`,   kind: 'xml' },
  { brand: 'N-Fab',            file: `${ASSETS}/08_MISC_DATA/n-fab/NFA20260322_PIESImage72.txt`,                kind: 'pipe' },
  { brand: 'Aries',            file: `${ASSETS}/VEHICLE DATA ASSETS/aries data/ARI20260322_PIESImage72.txt`,    kind: 'pipe' },
];

const IS_IMG = /^https?:\/\/.*\.(jpg|jpeg|png|webp)$/i;
// Skip logos, warning labels and line drawings — they are not product photos.
const NOT_A_PHOTO = /logo|prop ?65|warning|made.?in|line.?art|drawing|instruction/i;

const norm = (s) => String(s ?? '').trim().toUpperCase();

// PIES AssetType priority: P04 is the primary product shot, then other P-codes.
function rankAsset(type) {
  if (/^P04$/i.test(type)) return 0;
  if (/^P0/i.test(type)) return 1;
  return 2;
}

function parsePipe(file) {
  const out = new Map();
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).slice(1);
  for (const line of lines) {
    if (!line) continue;
    const f = line.split('|');
    const part = norm(f[1]);
    const type = f[2] ?? '';
    const uri = (f[6] ?? '').trim();
    if (!part || !IS_IMG.test(uri) || NOT_A_PHOTO.test(uri)) continue;
    const prev = out.get(part);
    if (!prev || rankAsset(type) < prev.rank) out.set(part, { uri, rank: rankAsset(type) });
  }
  return new Map([...out].map(([k, v]) => [k, v.uri]));
}

function parseXml(file) {
  const out = new Map();
  const src = fs.readFileSync(file, 'utf8');
  // Split on <Item> so a PartNumber stays bound to its own DigitalAssets block.
  for (const block of src.split(/<Item[\s>]/).slice(1)) {
    const part = norm((block.match(/<PartNumber>([^<]+)<\/PartNumber>/) || [])[1]);
    if (!part) continue;
    let best = null;
    for (const asset of block.match(/<DigitalFileInformation[\s\S]*?<\/DigitalFileInformation>/g) || []) {
      const type = (asset.match(/<AssetType>([^<]+)</) || [])[1] || '';
      const uri = ((asset.match(/<URI>([^<]+)</) || [])[1] || '').trim();
      if (!IS_IMG.test(uri) || NOT_A_PHOTO.test(uri)) continue;
      const rank = rankAsset(type);
      if (!best || rank < best.rank) best = { uri, rank };
    }
    if (best) out.set(part, best.uri);
  }
  return out;
}

function readData(file) {
  const src = fs.readFileSync(file, 'utf8');
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const m = src.match(/var\s+([A-Za-z0-9_$]+)\s*=\s*\[/);
  if (!m) return null;
  const start = src.indexOf('[', m.index + m[0].length - 1);
  const sandbox = {};
  vm.runInNewContext(src, sandbox, { timeout: 30000 });
  const rows = sandbox[m[1]];
  if (!Array.isArray(rows)) return null;
  return { rows, eol, header: src.slice(0, start) };
}

function writeData(file, header, rows, eol) {
  fs.writeFileSync(file, header + '[' + eol + rows.map((r) => JSON.stringify(r)).join(',' + eol) + eol + '];' + eol, 'utf8');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// catalograck.com throttles: ~1,000 rapid requests earns a run of HTTP 429s.
// A 429 says nothing about whether the image exists, so back off and retry
// rather than treating it as a dead link — that under-fills the catalog.
async function headOk(url, attempt = 0) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
    if (res.status === 429) {
      if (attempt >= 4) return null;              // null = "unknown", not "bad"
      await sleep(3000 * (attempt + 1));
      return headOk(url, attempt + 1);
    }
    return res.ok && (res.headers.get('content-type') || '').startsWith('image/');
  } catch {
    if (attempt >= 2) return null;
    await sleep(1500);
    return headOk(url, attempt + 1);
  }
}

// ── Load feeds ──
const feed = new Map();
for (const s of SOURCES) {
  if (!fs.existsSync(s.file)) { console.log(`  MISSING FEED: ${s.file}`); continue; }
  const m = s.kind === 'xml' ? parseXml(s.file) : parsePipe(s.file);
  feed.set(s.brand, m);
  console.log(`${s.brand.padEnd(19)} feed: ${String(m.size).padStart(5)} parts with a photo`);
}

// ── Match against catalog ──
const files = fs.readdirSync(DIR).filter((f) => /-data\.js$/.test(f));
const candidates = new Map();   // url -> true
const plan = [];                // {file, idx, imgIdx, url}

for (const f of files) {
  const file = path.join(DIR, f);
  const data = readData(file);
  if (!data) continue;
  data.rows.forEach((row, idx) => {
    if (!Array.isArray(row) || typeof row[0] !== 'string') return;
    const m = feed.get(row[0]);
    if (!m) return;
    const imgIdx = row.length - 1;
    // Only skip when the slot already holds a real IMAGE. Some rows carry a PDF
    // install guide in the image field, which the card would try to render as a
    // photo — those get replaced.
    if (typeof row[imgIdx] === 'string' && IS_IMG.test(row[imgIdx])) return;
    const url = m.get(norm(row[2]));
    if (!url) return;
    candidates.set(url, true);
    plan.push({ file, idx, imgIdx, url });
  });
}

console.log(`\nrows that can be filled: ${plan.length}`);
console.log(`distinct URLs to verify:  ${candidates.size}`);

// ── Verify URLs ──
const good = new Set();
if (VERIFY) {
  const urls = [...candidates.keys()];
  let done = 0, bad = 0, unknown = 0;
  const BATCH = 6;            // gentle — the host throttles hard above this
  for (let i = 0; i < urls.length; i += BATCH) {
    const slice = urls.slice(i, i + BATCH);
    const res = await Promise.all(slice.map((u) => headOk(u)));
    slice.forEach((u, j) => {
      if (res[j] === true) good.add(u);
      else if (res[j] === null) unknown++;
      else bad++;
    });
    done += slice.length;
    await sleep(250);
    if (done % 120 === 0 || done === urls.length) {
      console.log(`  verified ${done}/${urls.length} — ok ${good.size}, dead ${bad}, unknown ${unknown}`);
    }
  }
  console.log(`URLs confirmed: ${good.size} / ${urls.length}  (dead ${bad}, unverifiable ${unknown})`);
  if (unknown) console.log('  NOTE: "unverifiable" means the host kept throttling — those were NOT written.');
} else {
  candidates.forEach((_, u) => good.add(u));
  console.log('(skipped verification)');
}

// ── Apply ──
const byFile = {};
for (const p of plan) { if (good.has(p.url)) (byFile[p.file] = byFile[p.file] || []).push(p); }

console.log('\nPER FILE');
let filled = 0;
for (const [file, list] of Object.entries(byFile)) {
  console.log(`  ${path.basename(file).padEnd(26)} ${String(list.length).padStart(5)} rows`);
  filled += list.length;
  if (!APPLY) continue;
  const data = readData(file);
  for (const p of list) data.rows[p.idx][p.imgIdx] = p.url;
  writeData(file, data.header, data.rows, data.eol);
}
console.log(`\ntotal rows filled: ${filled}`);
console.log(APPLY ? 'WROTE all files.' : '(dry run — pass --apply to write)');
