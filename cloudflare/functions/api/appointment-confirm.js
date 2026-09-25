/**
 * Appointment confirmation — the public end of the shop manager's
 * "please confirm your appointment" email.
 *
 * Owner, 2026-09-25: the email carries a button the customer clicks, which
 * confirms the booking on his calendar without anyone at the shop doing
 * anything. This is where that click lands.
 *
 * WHY IT LIVES ON THE WEBSITE AND NOT IN THE SHOP MANAGER. Cloudflare Access
 * sits in front of the shop manager; a customer following the link would meet
 * a login page they cannot pass. The alternative was punching a public hole in
 * Access, which is a security control that should not have holes. This site
 * already binds the shop manager's database (SHOP_DB) — the same route website
 * quote requests take into the board — so the page is public here and writes
 * there, and Access stays whole.
 *
 * GET  reads the booking for a token. Safe to prefetch.
 * POST confirms it.
 *
 * ⚠️ CONFIRMING IS A POST, DELIBERATELY. Corporate mail scanners and link
 * previewers follow every URL in an incoming message. If clicking were a GET,
 * a scanner would confirm the appointment before the customer had read the
 * email, and the shop would believe a truck was coming that nobody had agreed
 * to. The page renders, the customer presses a button, and that button posts.
 */

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const respond = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

/* A token is 32 hex characters. Anything else is not a near miss worth a
   database lookup — it is someone poking at the endpoint. */
const looksLikeToken = (t) => /^[0-9a-f]{32}$/.test(String(t || ''));

const SELECT = `
  SELECT a.id, a.starts_at, a.duration_min, a.status, a.confirmed_at,
         c.name AS customer_name,
         (SELECT i.name FROM job_items i
           WHERE i.job_id = a.job_id AND i.parent_item_id IS NULL
           ORDER BY i.sort_order, i.id LIMIT 1) AS first_service
    FROM appointments a
    JOIN customers c ON c.id = a.customer_id
   WHERE a.confirm_token = ?`;

export async function onRequestGet({ request, env }) {
  if (!env.SHOP_DB) return respond({ error: 'unavailable' }, 503);

  const t = new URL(request.url).searchParams.get('t');
  if (!looksLikeToken(t)) return respond({ error: 'not found' }, 404);

  const appt = await env.SHOP_DB.prepare(SELECT).bind(t).first();
  if (!appt) return respond({ error: 'not found' }, 404);

  /* Only what the page needs to show. No order number, no phone, no email,
     no id — a link forwarded to someone else reveals a first name and a time,
     and nothing that could be used to find the customer's record. */
  return respond({
    status: appt.status,
    starts_at: appt.starts_at,
    duration_min: appt.duration_min,
    service: appt.first_service,
    first_name: String(appt.customer_name || '').trim().split(/\s+/)[0],
    already_confirmed: appt.status === 'confirmed',
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.SHOP_DB) return respond({ error: 'unavailable' }, 503);

  let body;
  try { body = await request.json(); } catch { return respond({ error: 'bad request' }, 400); }

  const t = body?.t;
  if (!looksLikeToken(t)) return respond({ error: 'not found' }, 404);

  const appt = await env.SHOP_DB.prepare(SELECT).bind(t).first();
  if (!appt) return respond({ error: 'not found' }, 404);

  /* A cancelled booking cannot be confirmed back to life from an old email.
     The shop cancelled it for a reason the customer's inbox does not know. */
  if (appt.status === 'cancelled') {
    return respond({ error: 'cancelled', message: 'This appointment was cancelled. Please call us on 562-424-6744.' }, 409);
  }

  /* Confirming twice is not an error — people click the button again when
     they are not sure it worked the first time. `confirmed_at` keeps the
     FIRST answer; re-confirming must not move it. */
  if (appt.status !== 'confirmed') {
    await env.SHOP_DB
      .prepare(
        `UPDATE appointments
            SET status = 'confirmed',
                confirmed_at = COALESCE(confirmed_at, datetime('now')),
                updated_at = datetime('now')
          WHERE confirm_token = ?`,
      )
      .bind(t)
      .run();

    await env.SHOP_DB
      .prepare(`INSERT INTO audit_log (entity, entity_id, action, detail) VALUES ('appointment', ?, 'confirmed_by_customer', ?)`)
      .bind(appt.id, JSON.stringify({ via: 'email link' }))
      .run();
  }

  return respond({ confirmed: true, starts_at: appt.starts_at });
}
