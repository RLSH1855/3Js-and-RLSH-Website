-- cloudflare/migrations/0004_login_attempts.sql
-- Tracks failed dashboard login attempts so login.js can lock out repeated
-- guessing. Previously there was no limit at all — combined with sessions
-- that never expired server-side (fixed separately in session.js), a
-- successful brute-force login had permanent value.
CREATE TABLE login_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_login_attempts_username_time ON login_attempts (username, created_at);
