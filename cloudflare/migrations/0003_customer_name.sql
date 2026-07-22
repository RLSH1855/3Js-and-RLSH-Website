-- cloudflare/migrations/0003_customer_name.sql
-- Stores the first name the customer gives at the start of a chat, so the
-- assistant can address them by name and the owner dashboard can show a real
-- name instead of a bare conversation id.
-- Additive and nullable: existing conversations are unaffected.
ALTER TABLE conversations ADD COLUMN customer_name TEXT;
