// tools/catalog/prune.mjs
//
// Removes catalog rows that fall outside James's listing scope:
//   assemblies, and brackets/hardware genuinely required for a complete install.
// Everything else — harnesses, connectors, standalone hardware kits, snap-on
// covers, spares — comes out. Whole brands can be dropped too.
//
// Rewrites each *-data.js in place, preserving the file's own header comments,
// its variable name, and CRLF line endings.
//
// Usage:
//   node tools/catalog/prune.mjs            # dry run, prints what would go
//   node tools/catalog/prune.mjs --apply    # actually rewrite the files
//   node tools/catalog/prune.mjs --list     # dry run + every product name

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DIR = 'cloudflare';
const APPLY = process.argv.includes('--apply');
const LIST = process.argv.includes('--list');

// ── Brands removed wholesale (James, 2026-08-11) ──
const DROP_BRANDS = new Set(['Diode Dynamics', 'CURT']);

// ── Category rules. Order matters: the first match wins and is reported. ──
// Each rule is [label, test]. `test` receives the product NAME only — brand is
// handled separately so a rule can't accidentally scope-creep across brands.
const RULES = [
  // Rigid sells snap-on protective covers as separate SKUs. Two naming styles:
  // "Cover 4in. E-SERIES BLK" and "RIGID LIGHT COVER FOR ...". Both are spares.
  // Scoped to Rigid so it can never touch a tonneau cover or a seat cover.
  ['snap-on light cover (sold separately)',
    (name, brand) => brand === 'Rigid Industries'
      && (/^cover\b/i.test(name.trim()) || /light cover|\bcover\b/i.test(name))],

  // Loose switches, relays and power clips — Rigid only. A broader rule is unsafe:
  // "rocker" also appears in Rocker Panel Mount nerf bars (TrailFX, Aries) and
  // Bushwacker's Rocker Panel, which are real assemblies.
  ['loose switch / relay',
    (name, brand) => brand === 'Rigid Industries'
      && /\bswitch\b|\brelay\b|power clip/i.test(name)],

  // Headlight trim rings sold without the light.
  ['trim bezel (sold separately)',
    (name) => /trim bezel/i.test(name)],

  // Mounting hardware sold loose, not as part of an assembly.
  ['loose mounting hardware',
    (name) => /mounting hardware$/i.test(name.trim())],

  ['harness / wiring / connector',
    (name) => /harness|wiring|pigtail|connector|t-?tap|splice|PNP Adapter|DEUTSCH/i.test(name)
      // keep anything that merely INCLUDES one, or is a named assembly
      && !/PowerStep|\bw\/|\bwith\b|includes?\b|Fog Kit|LED System|BULL BAR/i.test(name)],

  ['standalone hardware kit (spare)',
    (name) => /hardware kit/i.test(name)
      // TonneauMate hardware is required to mount on GM trucks without a track system
      && !/TonneauMate/i.test(name)],

  // "REP. KIT" / "HDW KIT" are Rigid's abbreviations for replacement and hardware
  // kits. Spelling out "replacement" alone misses all of them.
  ['spare / replacement part',
    (name) => /\breplacement\b|\bspare\b|repair kit|rebuild|REP\.? ?KIT|HDW ?KIT|\bHDW\b|SAE\/METRIC HW/i.test(name)],
];

function classify(brand, name) {
  if (DROP_BRANDS.has(brand)) return `brand removed: ${brand}`;
  for (const [label, test] of RULES) if (test(name, brand)) return label;
  return null;
}

// ── Read a data file, keeping its header and line endings intact ──
function readData(file) {
  const src = fs.readFileSync(file, 'utf8');
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const m = src.match(/var\s+([A-Za-z0-9_$]+)\s*=\s*\[/);
  if (!m) return null;
  const varName = m[1];
  const start = src.indexOf('[', m.index + m[0].length - 1);
  const end = src.lastIndexOf(']');
  if (start < 0 || end < start) return null;

  const sandbox = {};
  vm.runInNewContext(src, sandbox, { timeout: 30000 });
  const rows = sandbox[varName];
  if (!Array.isArray(rows)) return null;

  return { varName, rows, eol, header: src.slice(0, start) };
}

function writeData(file, header, rows, eol) {
  const body = rows.map((r) => JSON.stringify(r)).join(',' + eol);
  fs.writeFileSync(file, header + '[' + eol + body + eol + '];' + eol, 'utf8');
}

// ── Run ──
const files = fs.readdirSync(DIR).filter((f) => /-data\.js$/.test(f)).sort();
const tally = {};
let totalRows = 0, totalKept = 0;
const removedCards = new Map();

for (const f of files) {
  const file = path.join(DIR, f);
  const data = readData(file);
  if (!data) { console.log(`  SKIP ${f} — could not parse`); continue; }

  const kept = [];
  let dropped = 0;
  for (const row of data.rows) {
    if (!Array.isArray(row) || typeof row[0] !== 'string') { kept.push(row); continue; }
    const reason = classify(row[0], String(row[1] ?? ''));
    if (!reason) { kept.push(row); continue; }
    dropped++;
    tally[reason] = (tally[reason] || 0) + 1;
    removedCards.set(`${row[0]}|${row[1]}`, reason);
  }

  totalRows += data.rows.length;
  totalKept += kept.length;

  if (dropped) {
    console.log(`${f.padEnd(26)} ${String(data.rows.length).padStart(6)} rows → ${String(kept.length).padStart(6)} (removed ${dropped})`);
    if (APPLY) writeData(file, data.header, kept, data.eol);
  }
}

console.log('\nREMOVED BY REASON');
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(5)} rows   ${k}`);
}
console.log(`\ncards removed: ${removedCards.size}`);
console.log(`rows: ${totalRows} → ${totalKept} (removed ${totalRows - totalKept})`);

if (LIST) {
  console.log('\nEVERY REMOVED CARD');
  [...removedCards.entries()].sort().forEach(([k, r]) => console.log(`  [${r}] ${k.replace('|', ' — ')}`));
}

console.log(APPLY ? '\nWROTE all files.' : '\n(dry run — pass --apply to write)');
