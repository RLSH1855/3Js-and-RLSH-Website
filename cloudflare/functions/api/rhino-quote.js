/**
 * Rhino Linings quote request → Rhino Shop Manager.
 *
 * Writes straight into the shop manager's D1 (`quote_requests`) through a
 * second binding, rather than posting to the shop manager over HTTP.
 * BUILD_SPEC decision #20: Cloudflare Access sits in front of that app, so an
 * HTTP call from here would have to be let through the front door — a public
 * hole in the one system that holds every customer record. A database binding
 * is not reachable from the internet at all.
 *
 * Nothing here creates a customer or a job. The request waits in the board's
 * Requests lane until a person clicks Start, because creating a job assigns an
 * EST number and those numbers are never recycled.
 */

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const respond = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

/* 10 digits, or 11 starting with 1. Anything else is handed back unchanged
   rather than mangled — a bad number should look wrong to the person reading
   it, not be silently "fixed" into a different one. */
function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (ten.length !== 10) return { e164: null, display: String(raw || '').trim() || null };
  return {
    e164: `+1${ten}`,
    // 562-424-6744 — the format CLAUDE.md fixes for this business.
    display: `${ten.slice(0, 3)}-${ten.slice(3, 6)}-${ten.slice(6)}`,
  };
}

export async function onRequestPost({ request, env }) {
  if (!env.SHOP_DB) {
    // Fail loudly in the log, quietly to the customer. A lead is never told
    // "misconfigured" — they are told to call, which still gets them served.
    console.error('[rhino-quote] SHOP_DB binding missing');
    return respond({ error: 'Quote requests are temporarily unavailable. Please call 562-424-6744.' }, 503);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return respond({ error: 'Bad request' }, 400);
  }

  const name = [data.firstName, data.lastName].map((s) => String(s || '').trim()).filter(Boolean).join(' ');
  const email = String(data.email || '').trim() || null;
  const phone = normalizePhone(data.phone);

  if (!name) return respond({ error: 'Please give us your name.' }, 422);
  if (!phone.e164 && !email) {
    return respond({ error: 'We need a phone number or an email to send your quote to.' }, 422);
  }

  const year = /^\d{4}$/.test(String(data.year || '').trim()) ? Number(data.year) : null;

  try {
    await env.SHOP_DB
      .prepare(
        `INSERT INTO quote_requests
           (source, name, phone_e164, phone_display, email, year, make, model,
            message, sms_consent, status, ip_hash, user_agent)
         VALUES ('website', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`
      )
      .bind(
        name,
        phone.e164,
        phone.display,
        email,
        year,
        String(data.make || '').trim() || null,
        String(data.model || '').trim() || null,
        String(data.message || '').trim() || null,
        // The form carries the text/email disclosure above the button, so
        // submitting it IS the opt-in. Recorded as web_form on conversion.
        1,
        // Not the address itself — enough to spot a flood, nothing to leak.
        await hash(request.headers.get('CF-Connecting-IP') || ''),
        (request.headers.get('User-Agent') || '').slice(0, 300)
      )
      .run();

    return respond({ ok: true });
  } catch (err) {
    console.error('[rhino-quote] insert failed', err?.message || err);
    return respond({ error: 'Something went wrong. Please call us at 562-424-6744.' }, 500);
  }
}

async function hash(value) {
  if (!value) return null;
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}
