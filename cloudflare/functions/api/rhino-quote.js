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

  /* ⚠️ CHECKED HERE TOO, not only in the page. The browser validation is a
     courtesy to whoever is filling the form in; this is the rule. Anything can
     POST to this route, and a request with no vehicle and no description is a
     row nobody can quote from — it would sit in the Requests lane looking like
     work and be worth nothing. */
  const make = String(data.make || '').trim();
  const model = String(data.model || '').trim();
  const message = String(data.message || '').trim();
  const year = /^\d{4}$/.test(String(data.year || '').trim()) ? Number(data.year) : null;

  if (!year || !make || !model) {
    return respond({ error: 'Please tell us the year, make and model of your truck.' }, 422);
  }
  if (!message) {
    return respond({ error: 'Please tell us a little about the job so we can quote it properly.' }, 422);
  }

  /* VIN and plate are both optional and neither is validated beyond its
     shape. A VIN typed with an O for a zero should reach the shop looking
     wrong so a person can query it, not be rejected at the door or silently
     "corrected" into a different truck. */
  const vin = String(data.vin || '').trim().toUpperCase().slice(0, 17) || null;
  const plate = String(data.plate || '').trim().toUpperCase().slice(0, 10) || null;

  /* The tonneau add-on, stored as structured data in `services_wanted` — the
     column that exists for exactly this. Glued into the message it would be
     prose somebody has to read; here the shop manager can show it as a choice.
     Ignored unless BOTH halves were picked: a half-answered add-on is worse
     than none, because it reads as a decision the customer made. */
  const t = data.tonneau;
  const tonneau = t && String(t.style || '').trim() && String(t.material || '').trim()
    ? { style: String(t.style).trim(), material: String(t.material).trim() }
    : null;
  const servicesWanted = JSON.stringify(
    tonneau ? ['Rhino bed liner', `Tonneau cover — ${tonneau.style}, ${tonneau.material}`]
            : ['Rhino bed liner']
  );

  try {
    await env.SHOP_DB
      .prepare(
        `INSERT INTO quote_requests
           (source, name, phone_e164, phone_display, email, vin, plate, year, make, model,
            services_wanted, message, sms_consent, status, ip_hash, user_agent)
         VALUES ('website', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`
      )
      .bind(
        name,
        phone.e164,
        phone.display,
        email,
        vin,
        plate,
        year,
        make,
        model,
        servicesWanted,
        message,
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
