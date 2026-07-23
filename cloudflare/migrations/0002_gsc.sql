-- cloudflare/migrations/0002_gsc.sql
-- Google Search Console data, refreshed nightly by the 3js-gsc-sync Worker.

-- Daily totals. Never pruned: Google only retains 16 months, so accumulating
-- here eventually gives James history Google itself can no longer provide.
CREATE TABLE gsc_daily (
  date TEXT PRIMARY KEY,
  clicks INTEGER NOT NULL,
  impressions INTEGER NOT NULL,
  ctr REAL NOT NULL,
  position REAL NOT NULL
);

-- Current top queries/pages. Replaced wholesale each run -- a snapshot of the
-- trailing 28 days, not a history.
CREATE TABLE gsc_snapshot (
  type TEXT NOT NULL CHECK (type IN ('query','page')),
  label TEXT NOT NULL,
  clicks INTEGER NOT NULL,
  impressions INTEGER NOT NULL,
  ctr REAL NOT NULL,
  position REAL NOT NULL,
  captured_at TEXT NOT NULL,
  PRIMARY KEY (type, label)
);

-- Single-row sync log, so the dashboard can show when data was last refreshed
-- and warn rather than silently display stale numbers.
CREATE TABLE gsc_sync (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_success_at TEXT,
  last_attempt_at TEXT,
  last_error TEXT
);

INSERT INTO gsc_sync (id, last_success_at, last_attempt_at, last_error)
VALUES (1, NULL, NULL, NULL);
