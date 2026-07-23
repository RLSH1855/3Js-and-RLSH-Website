// One-time surgery: lift the inline `<script type="text/babel">` block out of
// parts-catalog.html and product-detail-page.html into standalone .jsx source
// files, and point the pages at the compiled .js plus self-hosted production
// React instead of unpkg dev builds + the in-browser Babel compiler.
//
// Idempotent: re-running after the swap is a no-op.
// Everything is read and written as UTF-8 so em-dashes and · survive.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const PAGES = [
  { html: 'cloudflare/parts-catalog.html', jsx: 'cloudflare/catalog-app.jsx', built: 'catalog-app.js' },
  { html: 'cloudflare/product-detail-page.html', jsx: 'cloudflare/product-app.jsx', built: 'product-app.js' },
];

const UNPKG_RE = /^[ \t]*<script src="https:\/\/unpkg\.com\/(?:react|react-dom|@babel)[^\n]*<\/script>\r?\n/gm;

for (const { html, jsx, built } of PAGES) {
  const htmlPath = join(ROOT, html);
  let src = readFileSync(htmlPath, 'utf8');

  if (src.includes(`src="${built}"`)) {
    console.log(`${html}: already converted, skipping`);
    continue;
  }

  // Line endings may be CRLF, so match the tag and step over whatever follows.
  const openTag = '<script type="text/babel">';
  const start = src.indexOf(openTag);
  if (start === -1) throw new Error(`${html}: no babel script block found`);
  const afterTag = src.slice(start + openTag.length);
  const lead = afterTag.match(/^\r?\n/);
  const bodyStart = start + openTag.length + (lead ? lead[0].length : 0);

  const closeRe = /\r?\n<\/script>/g;
  closeRe.lastIndex = bodyStart;
  const closeMatch = closeRe.exec(src);
  if (!closeMatch) throw new Error(`${html}: unterminated babel script block`);
  const end = closeMatch.index;
  const closeLen = closeMatch[0].length;

  const body = src.slice(bodyStart, end);
  writeFileSync(join(ROOT, jsx), body.replace(/\s*$/, '') + '\n', 'utf8');

  const tags =
    '<!-- React production builds, self-hosted. Previously 1.19 MB of development\n' +
    '     builds plus a 3.1 MB in-browser compiler fetched from unpkg.com. -->\n' +
    '<script src="vendor/react.production.min.js"></script>\n' +
    '<script src="vendor/react-dom.production.min.js"></script>\n' +
    `<!-- Generated from ${jsx.split('/').pop()} by tools/build-jsx.mjs - do not edit the .js -->\n` +
    `<script src="${built}"></script>`;

  // Drop the inline block, then the three unpkg <script> tags above it.
  src = src.slice(0, start) + tags + src.slice(end + closeLen);
  src = src.replace(UNPKG_RE, '');

  writeFileSync(htmlPath, src, 'utf8');
  console.log(`${html}: extracted ${Math.round(body.length / 1024)} KB -> ${jsx}`);
}
