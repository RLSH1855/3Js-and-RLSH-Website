# Task 8: Cloudflare Worker -- Shopmonkey Quote API

## Status: Complete

## Files Created

### `cloudflare/worker/wrangler.toml`
- Worker name: `3js-quote-api`
- Main entry: `quote-api.js`
- Compatibility date: `2024-01-01`
- Vars: `FALLBACK_SHEETS_URL` set to existing Google Apps Script endpoint

### `cloudflare/worker/quote-api.js`
- Cloudflare Worker handling `POST /api/quote`
- CORS: allows `*` origin, `POST` and `OPTIONS` methods, `Content-Type` header
- OPTIONS preflight returns 204
- Validates: firstName, lastName, email or phone required
- Shopmonkey flow:
  1. Find or create Customer (`GET /v3/customer?query=...`, `POST /v3/customer`)
  2. Create Vehicle if year/make/model/VIN provided (`POST /v3/vehicle`)
  3. Create Order labeled "Web Quote" with note (`POST /v3/order`)
  4. Add primary product as service line item (`POST /v3/order/{id}/service`)
  5. Add each add-on as separate service line item
- Falls back to Google Sheets if any Shopmonkey call fails
- Returns JSON `{ ok, status, orderId, source }` on success
- Auth via `SM_TOKEN` Worker secret (env variable)

## Changes to `cloudflare/parts-quote.html`

### Endpoint update
- Replaced `SHEETS_URL` (Google Apps Script) with `QUOTE_API_URL = '/api/quote'`
- Updated `fetch()` to POST JSON with `Content-Type: application/json` header
- Payload fields: firstName, lastName, email, phone, product, partNumber, vehicleYear, vehicleMake, vehicleModel, vehicleTrim, vehicleBedSize, vin, addOns

### Page audit fixes
- Added `html { overscroll-behavior: none; }` and `body { overflow-x: hidden; }`
- Removed `reportHeight` iframe snippet (not needed on Cloudflare standalone pages)
- Removed middle-click scroll snippet
- Fixed `/rhino-lining-quote` absolute URL to relative `rhino-lining-quote.html`
- `rlsh1855.github.io` image URLs left as-is (shared frozen assets per CLAUDE.md)

### Garage auto-fill
- Already present in existing code: reads `localStorage.getItem('garage_vehicle')` on page load and populates vehicle display + form data fields

## Deployment Notes
- Worker secret `SM_TOKEN` must be set via `wrangler secret put SM_TOKEN` before deploy
- Worker deployed separately from Pages site; Pages routes `/api/*` to worker
- NOT pushed to remote
