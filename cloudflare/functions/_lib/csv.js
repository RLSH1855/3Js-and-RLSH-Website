// cloudflare/functions/_lib/csv.js
function escapeField(v) {
  return `"${String(v ?? '').replace(/"/g, '""')}"`;
}

function toCsv(header, rows) {
  const lines = [header.join(',')];
  for (const row of rows) lines.push(row.map(escapeField).join(','));
  return lines.join('\n');
}

module.exports = { toCsv, escapeField };
