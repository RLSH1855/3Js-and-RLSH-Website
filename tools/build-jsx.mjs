// Compiles the catalog JSX source files into plain JavaScript.
//
// WHY THIS EXISTS
// parts-catalog.html and product-detail-page.html used to ship a 3.1 MB
// in-browser compiler (@babel/standalone) and compile ~2,000 lines of JSX on
// every single page view. That is several seconds of blank screen on a phone,
// and it meant Google saw an empty page. Compiling here instead means the
// browser downloads finished JavaScript.
//
// WORKFLOW — IMPORTANT
// Edit the .jsx files, never the generated .js files. After any edit, run:
//
//     node tools/build-jsx.mjs
//
// and commit BOTH the .jsx and the regenerated .js.
//
// Babel itself is downloaded on first run into tools/.cache/ (gitignored).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'tools', '.cache');
const BABEL = join(CACHE, 'babel.min.js');
const BABEL_URL = 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js';

const BUILDS = [
  { src: 'cloudflare/catalog-app.jsx', out: 'cloudflare/catalog-app.js' },
  { src: 'cloudflare/product-app.jsx', out: 'cloudflare/product-app.js' },
];

async function getBabel() {
  if (!existsSync(BABEL)) {
    mkdirSync(CACHE, { recursive: true });
    process.stdout.write(`Downloading Babel to ${BABEL} ...\n`);
    const res = await fetch(BABEL_URL);
    if (!res.ok) throw new Error(`Babel download failed: HTTP ${res.status}`);
    writeFileSync(BABEL, Buffer.from(await res.arrayBuffer()));
  }
  // babel.min.js is a UMD bundle: require() gives us its CommonJS export.
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const babel = require(BABEL);
  if (!babel || typeof babel.transform !== 'function') throw new Error('Babel did not load');
  return babel;
}

const babel = await getBabel();

for (const { src, out } of BUILDS) {
  const srcPath = join(ROOT, src);
  const outPath = join(ROOT, out);
  const code = readFileSync(srcPath, 'utf8');

  const { code: compiled } = babel.transform(code, {
    presets: [['react', { runtime: 'classic' }]],
    filename: src,
    compact: false,
    comments: true,
  });

  const banner =
    `// GENERATED FILE — DO NOT EDIT.\n` +
    `// Source: ${src}\n` +
    `// Rebuild with: node tools/build-jsx.mjs\n`;

  writeFileSync(outPath, banner + compiled + '\n', 'utf8');

  const kb = (n) => Math.round(n / 1024);
  process.stdout.write(`${src} -> ${out}  (${kb(code.length)} KB JSX -> ${kb(compiled.length)} KB JS)\n`);
}

process.stdout.write('Done.\n');
