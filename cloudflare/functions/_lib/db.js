// cloudflare/functions/_lib/db.js

async function ensureConversation(db, conversationId) {
  await db.prepare(
    `INSERT INTO conversations (id) VALUES (?) ON CONFLICT(id) DO UPDATE SET last_message_at = datetime('now')`
  ).bind(conversationId).run();
}

async function setCustomerName(db, conversationId, name) {
  if (!name) return;
  await db.prepare(
    `UPDATE conversations SET customer_name = ? WHERE id = ? AND (customer_name IS NULL OR customer_name = '')`
  ).bind(name, conversationId).run();
}

async function saveMessage(db, conversationId, role, content) {
  await db.prepare(
    `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`
  ).bind(conversationId, role, content).run();
}

async function saveLead(db, conversationId, lead) {
  await db.prepare(
    `INSERT INTO leads (conversation_id, name, phone, reason, competitor_link) VALUES (?, ?, ?, ?, ?)`
  ).bind(conversationId, lead.name || null, lead.phone || null, lead.reason || null, lead.competitor_link || null).run();
}

async function getConversationHistory(db, conversationId) {
  const { results } = await db.prepare(
    `SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id ASC`
  ).bind(conversationId).all();
  return results.map(r => ({ role: r.role, content: r.content }));
}

async function listConversations(db) {
  const { results } = await db.prepare(
    `SELECT c.id, c.started_at, c.last_message_at, c.customer_name,
            (SELECT COUNT(*) FROM leads l WHERE l.conversation_id = c.id) AS lead_count
     FROM conversations c
     ORDER BY c.last_message_at DESC`
  ).all();
  return results;
}

async function listLeadsForConversation(db, conversationId) {
  const { results } = await db.prepare(
    `SELECT name, phone, reason, competitor_link, created_at FROM leads WHERE conversation_id = ? ORDER BY id ASC`
  ).bind(conversationId).all();
  return results;
}

async function getUserByUsername(db, username) {
  return db.prepare(`SELECT id, username, password_hash FROM dashboard_users WHERE username = ?`).bind(username).first();
}

module.exports = {
  ensureConversation,
  setCustomerName,
  saveMessage,
  saveLead,
  getConversationHistory,
  listConversations,
  listLeadsForConversation,
  getUserByUsername
};
