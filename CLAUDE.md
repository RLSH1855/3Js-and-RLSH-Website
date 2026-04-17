# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A GitHub Pages static asset repository for **3J's Auto Body & Paint** and **RLSH (Rhino Linings of Signal Hill)** — a dual-brand shop at 1855 E 29th St, Signal Hill, CA 90755. There is no build system, no package manager, and no test suite. All files are plain HTML/CSS/JS.

The site is published at: `https://rlsh1855.github.io/3Js-and-RLSH-Website/`

The actual business website lives on **Wix** at `https://www.3jsautobody.com/`. This repository supplies embeddable components (HTML files) and hosted media (images/video) that Wix iframes in.

## Development Workflow

Since there is no build step, development is: edit → push → GitHub Pages auto-publishes (usually within ~30 seconds to a few minutes).

To preview locally, open any `.html` file directly in a browser. Most components are designed to work standalone as well as when embedded.

No linting, formatting, or test commands exist.

## Architecture: The Wix Iframe Pattern

Every `.html` file in the repo root is a **self-contained page component** intended to be embedded as a `<iframe>` inside a Wix page. This is the central architectural pattern.

**Height reporting** — Wix iframes don't auto-resize. Every component must report its rendered height to the parent page via `postMessage`. Nearly all HTML files (21 of 25) contain this boilerplate at the bottom:

```js
function reportHeight(){
  var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  window.parent.postMessage(JSON.stringify({height: h}), '*');
}
window.addEventListener('load', function(){ reportHeight(); setTimeout(reportHeight, 500); setTimeout(reportHeight, 1500); });
window.addEventListener('resize', reportHeight);
if(window.ResizeObserver){ new ResizeObserver(reportHeight).observe(document.body); }
```

`site-footer.html` uses `getBoundingClientRect().height` instead (more accurate for that component) and posts to both `window.parent` and `window.parent.parent`.

**Embed detection** — `site-nav.js` skips nav/footer injection when running inside an iframe (`window.self !== window.top`) or when the URL contains `?embed=1`. This lets nav/footer appear when viewing standalone but not when Wix embeds the component.

## File Roles

| File | Role |
|------|------|
| `site-nav.js` | IIFE that injects the shared sticky header + footer into any page that loads it. Not used by most components (they're embedded in Wix which already has the nav). |
| `site-footer.html` | Full-featured footer embedded as an iframe in Wix. |
| `homepage-hero.html` / `homepage-hero-light.html` | Hero section variants (dark vs light theme). |
| `homepage-faq.html`, `homepage-photo-strip.html`, `homepage-awards-insurance.html` | Homepage section components. |
| `rhino-liner.html`, `tonneau-covers.html`, `body-paint-repairs.html`, etc. | Full service pages embedded as iframes. |
| `interactive-truck-diagram.html` | JS-driven SVG overlay diagram with clickable hotspots on a truck image. |
| `brands-carousel.html`, `insurance-carousel.html` | Auto-scrolling logo carousels. |
| `mx4-finder.html`, `my-garage.html` | Product finder / garage tools. |
| `index.html` | Empty placeholder (the root URL isn't used directly). |
| `*.png`, `*.jpg`, `*.webp`, `*.mp4`, `*.gif` | Media assets served from GitHub Pages and referenced by URL in Wix pages and HTML components. |

## Design Conventions

All CSS is written inline in `<style>` blocks — there is no shared stylesheet. When adding or editing styles, maintain this pattern.

**Fonts:** Montserrat from Google Fonts (weights 400–900), loaded via `<link>` in each file's `<head>`.

**Color palette:**
- Primary red: `#8B0000` (dark red, hover: `#6e0000` / `#A00000`)
- Accent red (nav hover, links): `#c0392b`
- Blue (RLSH/Rhino Liner accent): `#366B8F` (hover: `#2d5a7a`)
- Dark backgrounds: `#0A0A0A` (page), `#111` (footer), `#1a1a1a` (borders)
- White text on dark: `rgba(255,255,255,0.65)` for body, `rgba(255,255,255,0.85)` for emphasis

**Breakpoints:** `960px` (hide desktop nav, show hamburger), `768px`, `600px`, `480px`, `430px`.

**Typography patterns:** All caps + letter-spacing for labels/eyebrows (`letter-spacing: 2–3px; text-transform: uppercase; font-weight: 700–800`). Headlines use `font-weight: 900; letter-spacing: -1.5px` to -2.5px.

## Referencing Images

Images are referenced by their GitHub Pages URL, not a relative path:

```
https://rlsh1855.github.io/3Js-and-RLSH-Website/FILENAME.ext
```

URL-encode spaces and special characters (e.g., `B%26W%20Hitches%201.png`). When adding new images, place the file in the repo root and reference it with this base URL.

## SEO / Structured Data

Service pages (`rhino-liner.html`, `body-paint-repairs.html`, etc.) include JSON-LD structured data (`application/ld+json`) using Schema.org types (`AutoBodyShop`, `LocalBusiness`, `FAQPage`, `Product`). Maintain and update this markup when page content changes, as it directly affects local search visibility.

Canonical URLs point to the Wix domain (`https://www.3jsautobody.com/[page-slug]`), not to the GitHub Pages URL.

## Two-Brand Identity

The shop operates under two brands that share one location and phone number:
- **3J's Auto Body & Paint** — collision repair, paint, insurance work
- **RLSH / Rhino Linings of Signal Hill** — spray-on bedliners, truck accessories, coatings

Both brands appear in footers, social links, and structured data. Maintain both when updating contact or identity information. Phone: `(562) 424-6744`. Email: `info@3jsautobody.com`.
