/**
 * Cloudflare Pages Function — 3J's Auto Body Quote API
 * Route: POST /api/quote  (this file's path IS the route)
 *
 *   1. Validates required fields
 *   2. Creates/finds Customer in Shopmonkey
 *   3. Creates Vehicle if info provided
 *   4. Creates Order tagged "Web Quote" with service line items
 *   5. Falls back to Google Sheets on any Shopmonkey failure
 */

const SM_BASE = 'https://api.shopmonkey.cloud/v3';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

/* ── Shopmonkey helpers ── */

async function smFetch(path, env, options) {
  var url = SM_BASE + path;
  var res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': 'Bearer ' + env.SM_TOKEN,
      'Content-Type': 'application/json',
      ...(options && options.headers ? options.headers : {}),
    },
  });
  if (!res.ok) {
    var text = await res.text();
    throw new Error('Shopmonkey ' + res.status + ': ' + text);
  }
  return res.json();
}

// Always create a fresh customer from exactly what the person typed into the
// quote form. We deliberately do NOT search for an existing customer first:
// Shopmonkey's /customer search ignores the query term and returns the entire
// customer list, so the old "find first match" logic attached every single
// quote to whoever happened to be first in that list. A repeat customer may
// appear twice (harmless, mergeable in Shopmonkey) — that is far safer than
// mis-filing a real lead onto the wrong person and losing their contact info.
async function createCustomer(data, env) {
  var body = {
    firstName: data.firstName,
    lastName: data.lastName,
    customerType: 'Customer',
  };

  var created = await smFetch('/customer', env, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  var customer = created.data || created;

  // Shopmonkey's /customer create endpoint silently drops email/phone if
  // sent inline — they must be attached via separate follow-up calls.
  if (data.email) {
    await smFetch('/customer/' + customer.id + '/email', env, {
      method: 'POST',
      body: JSON.stringify({ email: data.email }),
    });
  }
  if (data.phone) {
    await smFetch('/customer/' + customer.id, env, {
      method: 'PUT',
      body: JSON.stringify({
        phoneNumbers: [{ number: data.phone.replace(/\D/g, ''), type: 'Mobile' }],
      }),
    });
  }

  return customer;
}

async function createVehicle(customerId, data, env) {
  var body = { customerId: customerId, size: 'LightDuty' };
  if (data.vehicleYear) body.year = parseInt(data.vehicleYear, 10);
  if (data.vehicleMake) body.make = data.vehicleMake;
  if (data.vehicleModel) body.model = data.vehicleModel;
  if (data.vin) body.vin = data.vin;

  var created = await smFetch('/vehicle', env, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return created.data || created;
}

async function createOrderWithServices(customerId, vehicleId, data, env) {
  var noteParts = [];
  if (data.partNumber) noteParts.push('Part #' + data.partNumber);
  if (data.addOns && data.addOns !== 'None') noteParts.push('Add-ons: ' + data.addOns);
  if (data.message) noteParts.push('Message: ' + data.message);

  var orderBody = {
    customerId: customerId,
    label: 'Web Quote',
    note: noteParts.join(' | ') || '',
  };
  if (vehicleId) orderBody.vehicleId = vehicleId;

  var orderRes = await smFetch('/order', env, {
    method: 'POST',
    body: JSON.stringify(orderBody),
  });
  var order = orderRes.data || orderRes;
  var orderId = order.id;

  if (data.product) {
    await smFetch('/order/' + orderId + '/service', env, {
      method: 'POST',
      body: JSON.stringify([{
        name: data.product,
        note: data.partNumber ? 'Part #' + data.partNumber : '',
      }]),
    });
  }

  if (data.addOns && data.addOns !== 'None') {
    var addOnItems = data.addOns.split(',').map(function(s) { return s.trim(); });
    for (var i = 0; i < addOnItems.length; i++) {
      if (addOnItems[i]) {
        await smFetch('/order/' + orderId + '/service', env, {
          method: 'POST',
          body: JSON.stringify([{ name: addOnItems[i], note: 'Web quote add-on' }]),
        });
      }
    }
  }

  return order;
}

/* ── Google Sheets fallback ── */

async function fallbackToSheets(data, env) {
  var sheetsUrl = env.FALLBACK_SHEETS_URL;
  var now = new Date();
  var dateStr = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();

  var vehicleStr = '';
  if (data.vehicleYear) {
    vehicleStr = data.vehicleYear + ' ' + (data.vehicleMake || '') + ' ' + (data.vehicleModel || '');
    if (data.vin) vehicleStr += ' (VIN: ' + data.vin + ')';
  }

  var record = {
    formType: 'parts-quote',
    date: dateStr,
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.firstName + ' ' + data.lastName,
    phone: data.phone || '',
    email: data.email || '',
    vehicle: vehicleStr || 'Not saved',
    garageYear: data.vehicleYear || '',
    garageMake: data.vehicleMake || '',
    garageModel: data.vehicleModel || '',
    garageTrim: data.vehicleTrim || '',
    garageBedSize: data.vehicleBedSize || '',
    garageVin: data.vin || '',
    product: data.product || '',
    partNum: data.partNumber || '',
    quoteType: 'Part + Installation',
    addOns: data.addOns || 'None',
  };

  var res = await fetch(sheetsUrl, {
    method: 'POST',
    body: JSON.stringify(record),
  });
  return res.json();
}

/* ── Pages Function handlers ── */

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  var request = context.request;
  var env = context.env;

  var data;
  try {
    data = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!data.firstName || !data.lastName) {
    return jsonResponse({ error: 'First name and last name are required' }, 400);
  }
  if (!data.email && !data.phone) {
    return jsonResponse({ error: 'Email or phone is required' }, 400);
  }

  try {
    var customer = await createCustomer(data, env);
    var customerId = customer.id;

    var vehicleId = null;
    if (data.vehicleYear || data.vehicleMake || data.vehicleModel || data.vin) {
      var vehicle = await createVehicle(customerId, data, env);
      vehicleId = vehicle.id;
    }

    var order = await createOrderWithServices(customerId, vehicleId, data, env);

    return jsonResponse({
      ok: true,
      status: 'ok',
      orderId: order.id,
      source: 'shopmonkey',
    });
  } catch (smError) {
    console.error('Shopmonkey error, falling back to Sheets:', smError.message);

    try {
      await fallbackToSheets(data, env);
      return jsonResponse({
        ok: true,
        status: 'ok',
        source: 'sheets',
        fallbackReason: smError.message,
      });
    } catch (sheetsError) {
      console.error('Sheets fallback also failed:', sheetsError.message);
      return jsonResponse({
        error: 'Both Shopmonkey and Sheets failed. Please call (562) 424-6744.',
      }, 500);
    }
  }
}
