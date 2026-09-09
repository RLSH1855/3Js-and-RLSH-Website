/* ------------------------------------------------------------------
   Is this a real phone number and a real email address?

   Owner, 2026-09-08: "the phone number and email must be genuine emails and
   phone numbers not a fake number if thats possible to detect."

   ⚠️ WHAT THIS CAN AND CANNOT DO, because the difference matters.

   It can reject what CANNOT EXIST: an area code starting with 1, a 555
   directory number, ten identical digits, an email with no domain. That is
   structure, and structure is decidable here for free.

   It CANNOT tell you a real number is in service, or that a real mailbox
   receives mail. Nothing running inside this request can. That needs a
   lookup against the carrier and the mail host — Twilio Lookup for the
   number, a verification service for the address — which costs money per
   check and is a decision, not a default.

   ⚠️ AND THE BIAS IS DELIBERATE: when in doubt, LET IT THROUGH.

   A junk row costs him thirty seconds to delete. A wrongly rejected customer
   is a lead he never learns existed — he cannot call the person the form
   turned away. So every rule below rejects only what is impossible under the
   North American numbering plan or malformed as an address. Nothing here
   guesses at intent, and nothing "corrects" what was typed.
   ------------------------------------------------------------------ */

/* Numbers that are structurally legal but exist to be fake. Kept narrow. */
const FICTION_EXCHANGE = '555';

/* Free inboxes that exist to be thrown away within the hour. A short list on
   purpose — a long one goes stale and starts refusing real people. */
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'throwawaymail.com', 'yopmail.com',
  'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'fakeinbox.com', 'mailnesia.com', 'spam4.me',
]);

/* Reserved by the IETF for documentation. Never a real mailbox. */
const RESERVED_DOMAINS = new Set(['example.com', 'example.org', 'example.net', 'test', 'localhost']);

/**
 * @returns {{ok: boolean, e164: string|null, display: string|null, reason: string|null}}
 */
export function checkPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;

  const fail = (reason) => ({ ok: false, e164: null, display: String(raw || '').trim() || null, reason });

  if (ten.length !== 10) return fail('Please enter a 10-digit phone number.');

  const area = ten.slice(0, 3);
  const exchange = ten.slice(3, 6);

  /* NANP: neither the area code nor the exchange may begin with 0 or 1. */
  if (area[0] === '0' || area[0] === '1') return fail('That area code isn’t a real one.');
  if (exchange[0] === '0' || exchange[0] === '1') return fail('That phone number isn’t a real one.');

  /* N11 are service codes — 411, 911, 611. Never a subscriber line. */
  if (area.slice(1) === '11') return fail('That area code isn’t a real one.');

  /* 555 is the movie number. Reserved for directory assistance and fiction,
     and effectively never a customer's line. */
  if (exchange === FICTION_EXCHANGE) return fail('That looks like a placeholder number. We need one we can reach you on.');

  /* 0000000000, 1111111111 — legal digits, impossible customer. */
  if (/^(\d)\1{9}$/.test(ten)) return fail('That looks like a placeholder number. We need one we can reach you on.');

  /* 1234567890 and 0987654321, in either direction. */
  const ASC = '01234567890';
  const DESC = '09876543210';
  if (ASC.includes(ten) || DESC.includes(ten)) {
    return fail('That looks like a placeholder number. We need one we can reach you on.');
  }

  return {
    ok: true,
    e164: `+1${ten}`,
    // 562-424-6744 — the format CLAUDE.md fixes for this business.
    display: `${area}-${exchange}-${ten.slice(6)}`,
    reason: null,
  };
}

/**
 * @returns {{ok: boolean, value: string|null, reason: string|null}}
 */
export function checkEmail(raw) {
  const value = String(raw || '').trim().toLowerCase();
  const fail = (reason) => ({ ok: false, value: value || null, reason });

  if (!value) return fail('Please enter an email address.');

  /* Deliberately not one of the famous 200-character RFC regexes. Those
     accept things no mail host will, and reject things that work. This asks
     the three questions that actually separate an address from a typo. */
  if (!/^[^\s@]+@[^\s@]+$/.test(value)) return fail('That email address doesn’t look right.');

  const [local, domain] = value.split('@');
  if (!local || local.length > 64) return fail('That email address doesn’t look right.');
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return fail('That email address doesn’t look right.');
  }

  /* A domain needs a dot and a real top level — "james@gmail" reaches nobody,
     and it is one of the most common things people actually type. */
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
    return fail('That email address doesn’t look right.');
  }
  const tld = domain.slice(domain.lastIndexOf('.') + 1);
  if (tld.length < 2 || /\d/.test(tld)) return fail('That email address doesn’t look right.');

  if (RESERVED_DOMAINS.has(domain)) return fail('We need an email address we can actually reach you on.');
  if (DISPOSABLE.has(domain)) return fail('Please use an email address you check — we send your quote there.');

  return { ok: true, value, reason: null };
}
