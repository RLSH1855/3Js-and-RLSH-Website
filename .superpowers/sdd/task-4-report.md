# Task 4: Contact Page Audit — Report

**File:** `cloudflare/contact.html`
**Date:** 2026-06-21

---

## Changes Made

### 1. URLs Fixed (13 matches addressed)
- **Internal page links** (3): Converted from absolute Wix paths (`/body-paint-repairs`, `/rhino-liner`, `/exterior-accessories-V2`) to relative paths with `.html` extensions (`body-paint-repairs.html`, `rhino-liner.html`, `exterior-accessories-V2.html`)
- **Image URLs** (5): Converted from `rlsh1855.github.io` absolute URLs to local relative paths. All images verified to exist in `/cloudflare/`:
  - `collision-before-after.webp`
  - `Jeep Bedliner Photo Strip.webp`
  - `accessories-banner-truck-800x500px.webp`
  - `CHEVY BOAT LAUNCH RAMP_TRANSPARENT_BG.webp`
  - `3js-logo-white.webp`
- **SEO meta URLs** (5): `www.3jsautobody.com` references in canonical, og:url, and structured data kept as-is (correct for production domain)
- **External links kept absolute:** Google Maps, tel:, mailto:, Carwise estimate, social media (all correct)

### 2. `target="_top"` Removed
- Removed from 3 internal intent-card links (was Wix iframe breakout, no longer needed)
- `target="_blank"` kept on external links (Google Maps address, Carwise estimate)

### 3. Colors
- No `#c0392b` found — already using `#8B0000` throughout
- No pink detected

### 4. Corners
- All `border-radius` already `0` — no changes needed

### 5. Typography Fixes
- **Eyebrow font-size:** `10px` -> `12px` (both base `.eyebrow` and `.page-hero .eyebrow`)
- **Eyebrow font-family:** Added `Montserrat` to base `.eyebrow` class
- **H3 weight:** Intent card h3 `900` -> `700` (spec compliance)
- **H2 weight:** Info block title `900` -> `800` (spec compliance)
- **`text-wrap: balance`** already on headings
- **`text-wrap: pretty`** already on body paragraphs
- Font size floor respected (13px minimum, 12px eyebrow only)

### 6. Spacing Fixes
- **Hero padding:** `40px 20px` -> `64px 20px` (hero standard)
- **Hero mobile padding:** `40px 20px` -> `64px 20px`
- **Eyebrow margin-bottom:** `12px` -> `10px` (eyebrow->heading gap spec)
- **Section-title margin-bottom:** `18px` -> `12px` (heading->body gap spec)
- Intent section, contact section, map section padding already at `48px 20px` standard

### 7. Buttons
- **Submit button padding:** `0 24px` -> `0 32px` (button system standard)
- All buttons already: height 48px, font 13px, weight 800, letter-spacing 2px, border-radius 0

### 8. Dark Section Text
- **Hero eyebrow color:** `rgba(255,255,255,0.70)` -> `rgba(255,255,255,0.80)` (minimum contrast)
- All other dark section text already at 0.80+ minimum

### 9. Light Section Text
- **Intent subtitle color:** `#666` -> `#555` (spec minimum)

### 10. Form Behavior
- Input font-size already `16px` (iOS zoom prevention OK)
- Enter key listener already present and functional (advances focus between fields)

### 11. reportHeight Removed
- Removed entire `reportHeight()` function definition
- Removed `DOMContentLoaded`, `load`, `resize`, and `ResizeObserver` event listeners
- Removed `#height-sentinel` div
- Removed middle-click scroll script (Wix glue)

### 12. Overflow Rules Added
- Added `html { overscroll-behavior: none; }`
- Added `body { overflow-x: hidden; }`

---

## Items Already Correct (no changes needed)
- `#8B0000` brand red throughout
- All `border-radius: 0`
- Form Enter-key focus advancing
- Input font-size 16px
- `text-wrap: balance` on headings
- `text-wrap: pretty` on body text
- Section padding mobile standards (48px/56px/20px)
- Button height/font/weight/letter-spacing
- External link targets (`_blank` on Maps, Carwise)
