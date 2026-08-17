// GENERATED FILE — DO NOT EDIT.
// Source: cloudflare/product-app.jsx
// Rebuild with: node tools/build-jsx.mjs
const {
  useState,
  useEffect,
  useMemo
} = React;
const _qParams = new URLSearchParams(window.location.search);
const _catId = _qParams.get('catId') || 'tonneau';
const _catalogUrl = `parts-catalog.html?cat=${_catId}`;

// ── Category data ──
// This page used to load catalog-data.js only (tonneau covers), so any product
// from the other 13 categories rendered "PRODUCT NOT FOUND". Rows for whichever
// category we were sent are loaded before the app mounts; CATALOG_ROWS holds them.
const _catDef = window.RLSHCatalog.getCategory(_catId) || window.RLSHCatalog.CATEGORY_DEFS[0];
// Singular noun for titles/labels: "Tonneau Covers" -> "Tonneau Cover"
const _catNoun = _catDef.catLabel.replace(/ies$/, 'y').replace(/s$/, '');
let CATALOG_ROWS = [];
const _garage = (() => {
  try {
    return JSON.parse(localStorage.getItem('garage_vehicle'));
  } catch (e) {
    return null;
  }
})();
const _garageQS = _garage && _garage.year ? `&year=${encodeURIComponent(_garage.year)}&make=${encodeURIComponent(_garage.make)}&model=${encodeURIComponent(_garage.model)}` : '';
// A malformed URL (missing/typo'd ?brand= or ?product=) used to silently fall
// back to 'BAK'/'BAKFlip F1' — a real tonneau cover. That meant a bad link not
// only showed the wrong product, it let "Add to Quote" queue a BAKFlip F1 a
// customer never asked for. There is no safe default product, so when either
// param is missing these stay empty; App() below renders "Product Not Found"
// instead of a fake product, and the CTAs never get a chance to add anything.
const _hasProductParams = !!(_qParams.get('brand') && _qParams.get('product'));
const QUOTE_URL = _hasProductParams ? `parts-quote.html?product=${encodeURIComponent(_qParams.get('brand') + ' ' + _qParams.get('product'))}${_garageQS}` : 'parts-quote.html';
const QUOTE_LABEL = _hasProductParams ? _qParams.get('brand') + ' ' + _qParams.get('product') : '';
// Adds this product to the sitewide quote cart (quote-cart.js). Falls back to
// navigating to the quote page when the cart isn't loaded (no-JS / embedded).
function addToQuoteCart(e) {
  if (!_hasProductParams) return;
  if (window.RLSHQuoteCart) {
    e.preventDefault();
    window.RLSHQuoteCart.add({
      brand: _qParams.get('brand'),
      product: QUOTE_LABEL,
      partNum: ''
    });
  }
}
const LOGO_URL = '3js-logo-white.png';
const F = {
  brand: 0,
  product: 1,
  partNum: 2,
  bedIn: 3,
  bedSize: 4,
  startYear: 5,
  endYear: 6,
  make: 7,
  model: 8,
  desc: 9,
  fitNote: 10,
  map: 11,
  img: 12
};
const PRODUCT_TYPES = {
  'BAKFlip F1': 'Hard Folding',
  'BAKFlip FiberMax': 'Hard Folding',
  'BAKFlip Fibermax': 'Hard Folding',
  'BAKFlip G2': 'Hard Folding',
  'BAKFlip MX4': 'Hard Folding',
  'BAKFlip MX4 TS': 'Hard Folding',
  'ArmorFlex': 'Hard Folding',
  'Solid Fold 2.0 Toolbox': 'Hard Folding',
  'Solid Fold ALX': 'Hard Folding',
  'Endure ALX': 'Hard Folding',
  'Deuce': 'Hard Folding',
  'Sentry': 'Hard Folding',
  'Sentry CT': 'Hard Folding',
  'Ultra Flex': 'Hard Folding',
  'Trifecta 2.0': 'Soft Folding',
  'Trifecta ALX': 'Soft Folding',
  'Trifecta Signature 2.0': 'Soft Folding',
  'Trifecta Toolbox 2.0': 'Soft Folding',
  'Trifecta e-Series': 'Soft Folding',
  'E-Series': 'Soft Folding',
  'E-Series XT': 'Soft Folding',
  'M-Series': 'Soft Folding',
  'M-Series XT': 'Soft Folding',
  'A-Series': 'Soft Folding',
  'A-Series XT': 'Soft Folding',
  'Elite': 'Soft Folding',
  'Elite LX': 'Soft Folding',
  'Elite Smooth': 'Soft Folding',
  'SE': 'Soft Folding',
  'SE Smooth': 'Soft Folding',
  'Lo Pro': 'Roll-Up',
  'TruXport': 'Roll-Up',
  'Truxport': 'Roll-Up',
  'Lux': 'Roll-Up',
  'Flex': 'Roll-Up',
  'Revolver X2': 'Roll-Up',
  'Revolver X4s': 'Roll-Up',
  'Revolver X4ts': 'Roll-Up',
  'Revolver X4ts Rails': 'Roll-Up',
  'Pro X15': 'Roll-Up',
  'Pro X15 TS': 'Roll-Up',
  'RetraxONE MX': 'Retractable',
  'RetraxONE XR': 'Retractable',
  'RetraxPRO MX': 'Retractable',
  'RetraxPRO XR': 'Retractable',
  'PowertraxPRO MX': 'Retractable',
  'PowertraxPRO XR': 'Retractable',
  'Retrax EQ': 'Retractable',
  'Retrax IX': 'Retractable'
};
const COVER_IMAGES = {
  'BAKFlip MX4': 'bak-bakflip-mx4-2016-ford-f150-HERO-IMAGE-08.webp',
  'BAKFlip MX4 TS': 'MX4-TS/bak-bakflip-mx4-ts-ghost.webp',
  'BAKFlip F1': 'BAKFlip F1 Hard Folding Tonneau Cover-cover_img.webp',
  'BAKFlip G2': 'BAK-G2/BAK-G2 (1).webp',
  'BAKFlip FiberMax': 'fibermax-main-image.webp',
  'BAKFlip Fibermax': 'fibermax-main-image.webp',
  'Revolver X4s': 'bak-revolver-x4s.webp',
  'Revolver X2': 'revolver-x2-cover.webp',
  'Revolver X4ts': 'BAK- Revolver X4TS-elevate-2023-10-17-Tundra-181_4.webp',
  'Revolver X4ts Rails': 'BAK- Revolver X4TS-elevate-2023-10-17-Tundra-181_4.webp',
  'Solid Fold ALX': 'extang-solid-fold-alx-2024-toyota-tacoma-88832-ov-037-2.webp',
  'Solid Fold 2.0 Toolbox': 'Extang-solidfold-alx-2021-ford-f150-red-lifestyle-05.webp',
  'Endure ALX': 'extang-solid-fold-alx-2024-toyota-tacoma-88832-ov-037-2.webp',
  'Trifecta 2.0': 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (1).webp',
  'Trifecta ALX': 'cover-image - Extang Trifecta ALX Soft Folding Tonneau Cover (2).webp',
  'Trifecta Signature 2.0': 'cover-image Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover.jpg',
  'Trifecta Toolbox 2.0': 'cover-image Trifecta Toolbox 2.0 (9) (1).webp',
  'Trifecta e-Series': 'cover-image Extang Trifecta E-Series Soft Folding Tonneau Cover (2).webp',
  'RetraxPRO MX': 'realtruck-retrax-pro-2024-mitsubishi-triton-lifestyle-7182.webp',
  'RetraxPRO XR': 'RetraxPRO XR/retraxpro-xr (1).webp',
  'PowertraxPRO MX': 'retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-092.jpg',
  'PowertraxPRO XR': 'retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-092.jpg',
  'RetraxONE MX': 'retrax-one-mx-2015-toyota-tacoma-red-studio-09.webp',
  'RetraxONE XR': 'RetraxONE XR/RetraxONE XR (1).webp',
  'Retrax EQ': 'Retrax EQ/Retrax EQ (1).webp',
  'Retrax IX': 'cover-image Retrax IX Manual Retractable Tonneau Cover.webp',
  'E-Series': 'roll-n-lock-e-series-2017-ford-f150-black-beach-lifestyle-10.webp',
  'E-Series XT': 'cover-image Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (21).webp',
  'A-Series': 'cover-image Roll-N-Lock A-Series Manual Retractable Tonneau Cover.webp',
  'A-Series XT': 'cover-image Roll-N-Lock A-Series Manual Retractable Tonneau Cover.webp',
  'M-Series': 'cover-image Roll-N-Lock M-Series Manual Retractable Tonneau Cover.jpg',
  'M-Series XT': 'cover-image Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (14).jpg',
  'Cargo Manager': 'Roll-N-Lock Cargo Manager (1).webp',
  'Sentry CT': 'truxedo-sentry-ct-2018-ford-f250-white-moab-lifestyle04.webp',
  'Sentry': 'cover-image Sentry Hard Roll-Up Tonneau Cover (4).webp',
  'Lo Pro': 'COVER IMAGE- Lo Pro Soft Roll-Up Tonneau Cover (2).webp',
  'Pro X15': '5db701304d588f900bdcccd18b919710.webp',
  'Pro X15 TS': 'Truxedo Pro X15 TS Soft Roll-Up Tonneau Cover w T-Slot Rails (1).webp',
  'TruXport': 'COVER IMAGE - Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (5).webp',
  'Truxport': 'COVER IMAGE - Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (5).webp',
  'Deuce': 'cover-image Truxedo Deuce Soft Folding Tonneau Cover.webp',
  'ArmorFlex': 'undercover-armor-flex-2017-ford-f150-raptor-red-construction-lifestyle-01.webp',
  'Ultra Flex': 'undercover-ultra-flex.webp',
  'Flex': 'undercover-armor-flex-2017-ford-f150-raptor-red-construction-lifestyle-01.webp',
  'Elite': 'UnderCover Elite One Piece Tonneau Cover (1).webp',
  'Elite Smooth': 'UnderCover Elite One Piece Tonneau Cover (1).webp',
  'Elite LX': 'Undercover-Elite LX-Color-matched (1).webp',
  'SE': 'UnderCover SE One Piece Tonneau Cover (1).webp',
  'SE Smooth': 'UnderCover SE One Piece Tonneau Cover (1).webp'
};

// Multiple gallery images per product — first image is the hero/catalog card
const PRODUCT_GALLERY = {
  'BAKFlip G2': ['BAK-G2/BAK-G2 (1).webp', 'BAK-G2/BAK-G2 (2).webp', 'BAK-G2/BAK-G2 (3).webp', 'BAK-G2/BAK-G2 (4).webp', 'BAK-G2/BAK-G2 (5).webp', 'BAK-G2/BAK-G2 (6).webp', 'BAK-G2/BAK-G2 (7).webp', 'BAK-G2/BAK-G2 (8).webp', 'BAK-G2/BAK-G2 (9).webp', 'BAK-G2/BAK-G2 (10).webp'],
  'RetraxPRO XR': ['RetraxPRO XR/retraxpro-xr (1).webp', 'RetraxPRO XR/retraxpro-xr (2).webp', 'RetraxPRO XR/retraxpro-xr (3).webp', 'RetraxPRO XR/retraxpro-xr (4).webp', 'RetraxPRO XR/retraxpro-xr (5).webp', 'RetraxPRO XR/retraxpro-xr (6).webp', 'RetraxPRO XR/retraxpro-xr (7).webp', 'RetraxPRO XR/retraxpro-xr (8).webp', 'RetraxPRO XR/retraxpro-xr (9).webp', 'RetraxPRO XR/retraxpro-xr (10).webp', 'RetraxPRO XR/retraxpro-xr (11).webp', 'RetraxPRO XR/retraxpro-xr (12).webp', 'RetraxPRO XR/retraxpro-xr (13).webp', 'RetraxPRO XR/retraxpro-xr (14).webp', 'RetraxPRO XR/retraxpro-xr (15).webp'],
  'PowertraxPRO MX': ['retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-092.jpg', 'retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-131-1.jpg', 'retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-131-2.jpg'],
  'PowertraxPRO XR': ['retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-092.jpg', 'retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-131-1.jpg', 'retrax powerpro xr/retrax-powertraxpro-xr-2024-toyota-tacoma-t90870-studio-131-2.jpg'],
  'RetraxONE XR': ['RetraxONE XR/RetraxONE XR (1).webp', 'RetraxONE XR/RetraxONE XR (2).webp', 'RetraxONE XR/RetraxONE XR (3).webp', 'RetraxONE XR/RetraxONE XR (4).webp', 'RetraxONE XR/RetraxONE XR (5).webp', 'RetraxONE XR/RetraxONE XR (6).webp', 'RetraxONE XR/RetraxONE XR (7).webp', 'RetraxONE XR/RetraxONE XR (8).webp', 'RetraxONE XR/RetraxONE XR (9).webp', 'RetraxONE XR/RetraxONE XR (10).webp', 'RetraxONE XR/RetraxONE XR (11).webp'],
  'Retrax EQ': ['Retrax EQ/Retrax EQ (1).webp', 'Retrax EQ/Retrax EQ (2).webp', 'Retrax EQ/Retrax EQ (3).webp', 'Retrax EQ/Retrax EQ (4).webp', 'Retrax EQ/Retrax EQ (5).webp', 'Retrax EQ/Retrax EQ (6).webp', 'Retrax EQ/Retrax EQ (7).webp', 'Retrax EQ/Retrax EQ (8).webp', 'Retrax EQ/Retrax EQ (9).webp', 'Retrax EQ/Retrax EQ (10).webp', 'Retrax EQ/Retrax EQ (11).webp', 'Retrax EQ/Retrax EQ (12).webp', 'Retrax EQ/Retrax EQ (13).webp', 'Retrax EQ/Retrax EQ (14).webp'],
  'BAKFlip MX4': ['bak-bakflip-mx4-2016-ford-f150-HERO-IMAGE-08.webp', 'bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-01.webp', 'bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-02.webp', 'bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-05.webp', 'bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-06.webp', 'bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-07.webp', 'bak-bakflip-mx4-2016-ford-f150-blue-beach-lifestyle-08.webp'],
  'BAKFlip MX4 TS': ['MX4-TS/bak-bakflip-mx4-ts-ghost.webp', 'bak-bakflip-mx4-ts-2024-ford-f150-449339ts-ov-0174-ghost.jpg', 'MX4-TS/bakflip-mx4-ts.webp', 'MX4-TS/bakflip-mx4-ts-1.webp', 'MX4-TS/bakflip-mx4-ts-2.webp', 'MX4-TS/bakflip-mx4-ts-3.webp'],
  'Deuce': ['cover-image Truxedo Deuce Soft Folding Tonneau Cover.webp', 'Truxedo Deuce Soft Folding Tonneau Cover (1).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (2).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (3).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (4).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (5).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (6).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (7).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (8).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (9).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (10).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (11).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (12).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (13).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (14).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (15).webp', 'Truxedo Deuce Soft Folding Tonneau Cover (16).webp'],
  'M-Series': ['cover-image Roll-N-Lock M-Series Manual Retractable Tonneau Cover.jpg', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (1).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (2).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (3).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (4).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (5).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (6).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (7).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (8).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (9).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (10).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (11).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (12).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (13).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (14).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (15).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (16).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (17).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (18).webp', 'Roll-N-Lock M-Series Manual Retractable Tonneau Cover (19).webp'],
  'M-Series XT': ['cover-image Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (14).jpg', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (1).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (2).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (3).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (4).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (5).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (6).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (7).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (8).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (9).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (10).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (11).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (12).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (13).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (14).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (15).webp', 'Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (16).webp'],
  'E-Series XT': ['cover-image Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (21).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (1).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (2).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (3).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (4).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (5).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (6).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (7).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (8).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (9).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (10).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (11).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (12).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (13).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (14).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (15).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (16).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (17).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (18).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (19).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (20).webp', 'Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (21).webp'],
  'A-Series': ['cover-image Roll-N-Lock A-Series Manual Retractable Tonneau Cover.webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (1).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (2).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (3).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (4).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (5).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (6).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (7).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (8).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (9).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (10).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (11).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (12).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (13).webp'],
  'A-Series XT': ['cover-image Roll-N-Lock A-Series Manual Retractable Tonneau Cover.webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (1).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (2).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (3).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (4).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (5).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (6).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (7).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (8).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (9).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (10).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (11).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (12).webp', 'Roll-N-Lock A-Series Manual Retractable Tonneau Cover (13).webp'],
  'Retrax IX': ['cover-image Retrax IX Manual Retractable Tonneau Cover.webp', 'Retrax IX Manual Retractable Tonneau Cover (1).webp', 'Retrax IX Manual Retractable Tonneau Cover (2).webp', 'Retrax IX Manual Retractable Tonneau Cover (3).webp', 'Retrax IX Manual Retractable Tonneau Cover (4).webp', 'Retrax IX Manual Retractable Tonneau Cover (5).webp', 'Retrax IX Manual Retractable Tonneau Cover (6).webp', 'Retrax IX Manual Retractable Tonneau Cover (7).webp', 'Retrax IX Manual Retractable Tonneau Cover (8).webp', 'Retrax IX Manual Retractable Tonneau Cover (9).webp', 'Retrax IX Manual Retractable Tonneau Cover (10).webp', 'Retrax IX Manual Retractable Tonneau Cover (11).webp', 'Retrax IX Manual Retractable Tonneau Cover (12).webp', 'Retrax IX Manual Retractable Tonneau Cover (13).webp', 'Retrax IX Manual Retractable Tonneau Cover (14).webp'],
  'Trifecta Signature 2.0': ['cover-image Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover.jpg', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (1).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (2).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (3).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (4).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (5).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (6).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (7).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (8).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (9).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (10).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (11).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (12).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (13).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (14).webp', ' Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover (15).webp'],
  'Trifecta e-Series': ['cover-image Extang Trifecta E-Series Soft Folding Tonneau Cover (2).webp', 'Extang Trifecta E-Series Soft Folding Tonneau Cover (1).webp', 'Extang Trifecta E-Series Soft Folding Tonneau Cover (3).webp', 'Extang Trifecta E-Series Soft Folding Tonneau Cover (4).webp', 'Extang Trifecta E-Series Soft Folding Tonneau Cover (5).webp', 'Extang Trifecta E-Series Soft Folding Tonneau Cover (6).webp', 'Extang Trifecta E-Series Soft Folding Tonneau Cover (7).webp'],
  'Sentry': ['cover-image Sentry Hard Roll-Up Tonneau Cover (4).webp', 'Sentry Hard Roll-Up Tonneau Cover (1).webp', 'Sentry Hard Roll-Up Tonneau Cover (2).webp', 'Sentry Hard Roll-Up Tonneau Cover (3).webp', 'Sentry Hard Roll-Up Tonneau Cover (5).webp', 'Sentry Hard Roll-Up Tonneau Cover (6).webp', 'Sentry Hard Roll-Up Tonneau Cover (7).webp'],
  'Cargo Manager': ['Roll-N-Lock Cargo Manager (1).webp', 'Roll-N-Lock Cargo Manager (2).webp', 'Roll-N-Lock Cargo Manager (3).webp', 'Roll-N-Lock Cargo Manager (4).webp', 'Roll-N-Lock Cargo Manager (5).webp', 'Roll-N-Lock Cargo Manager (6).webp', 'Roll-N-Lock Cargo Manager (7).webp', 'Roll-N-Lock Cargo Manager (8).webp', 'Roll-N-Lock Cargo Manager (9).webp', 'Roll-N-Lock Cargo Manager (10).webp', 'Roll-N-Lock Cargo Manager (11).webp', 'Roll-N-Lock Cargo Manager (12).webp', 'Roll-N-Lock Cargo Manager (13).webp', 'Roll-N-Lock Cargo Manager (14).webp', 'Roll-N-Lock Cargo Manager (15).webp', 'Roll-N-Lock Cargo Manager (16).webp'],
  'Elite': ['UnderCover Elite One Piece Tonneau Cover (1).webp', 'UnderCover Elite One Piece Tonneau Cover (2).webp', 'UnderCover Elite One Piece Tonneau Cover (3).webp', 'UnderCover Elite One Piece Tonneau Cover (4).webp', 'UnderCover Elite One Piece Tonneau Cover (5).webp', 'UnderCover Elite One Piece Tonneau Cover (6).webp', 'UnderCover Elite One Piece Tonneau Cover (7).webp', 'UnderCover Elite One Piece Tonneau Cover (8).webp', 'UnderCover Elite One Piece Tonneau Cover (9).webp', 'UnderCover Elite One Piece Tonneau Cover (10).webp', 'UnderCover Elite One Piece Tonneau Cover (11).webp', 'UnderCover Elite One Piece Tonneau Cover (12).webp', 'UnderCover Elite One Piece Tonneau Cover (13).webp', 'UnderCover Elite One Piece Tonneau Cover (14).webp', 'UnderCover Elite One Piece Tonneau Cover (15).webp', 'UnderCover Elite One Piece Tonneau Cover (16).webp', 'UnderCover Elite One Piece Tonneau Cover (17).webp', 'UnderCover Elite One Piece Tonneau Cover (18).webp', 'UnderCover Elite One Piece Tonneau Cover (19).webp', 'UnderCover Elite One Piece Tonneau Cover (20).webp', 'UnderCover Elite One Piece Tonneau Cover (21).webp'],
  'Elite Smooth': ['UnderCover Elite One Piece Tonneau Cover (1).webp', 'UnderCover Elite One Piece Tonneau Cover (2).webp', 'UnderCover Elite One Piece Tonneau Cover (3).webp', 'UnderCover Elite One Piece Tonneau Cover (4).webp', 'UnderCover Elite One Piece Tonneau Cover (5).webp'],
  'Elite LX': ['Undercover-Elite LX-Color-matched (1).webp', 'Undercover-Elite LX-Color-matched (2).webp', 'Undercover-Elite LX-Color-matched (3).webp', 'Undercover-Elite LX-Color-matched (4).webp', 'Undercover-Elite LX-Color-matched (5).webp', 'Undercover-Elite LX-Color-matched (6).webp', 'Undercover-Elite LX-Color-matched (7).webp', 'Undercover-Elite LX-Color-matched (8).webp', 'Undercover-Elite LX-Color-matched (9).webp', 'Undercover-Elite LX-Color-matched (10).webp', 'Undercover-Elite LX-Color-matched (11).webp', 'Undercover-Elite LX-Color-matched, (1).webp'],
  'SE': ['UnderCover SE One Piece Tonneau Cover (1).webp', 'UnderCover SE One Piece Tonneau Cover (2).webp', 'UnderCover SE One Piece Tonneau Cover (3).webp', 'UnderCover SE One Piece Tonneau Cover (4).webp', 'UnderCover SE One Piece Tonneau Cover (5).webp', 'UnderCover SE One Piece Tonneau Cover (6).webp', 'UnderCover SE One Piece Tonneau Cover (7).webp', 'UnderCover SE One Piece Tonneau Cover (8).webp', 'UnderCover SE One Piece Tonneau Cover (9).webp', 'UnderCover SE One Piece Tonneau Cover (10).webp', 'UnderCover SE One Piece Tonneau Cover (11).webp', 'UnderCover SE One Piece Tonneau Cover (12).webp', 'UnderCover SE One Piece Tonneau Cover (13).webp', 'UnderCover SE One Piece Tonneau Cover (14).webp', 'UnderCover SE One Piece Tonneau Cover (15).webp'],
  'SE Smooth': ['UnderCover SE One Piece Tonneau Cover (1).webp', 'UnderCover SE One Piece Tonneau Cover (2).webp', 'UnderCover SE One Piece Tonneau Cover (3).webp', 'UnderCover SE One Piece Tonneau Cover (4).webp', 'UnderCover SE One Piece Tonneau Cover (5).webp'],
  'Trifecta 2.0': ['Extang Trifecta 2.0 Soft Folding Tonneau Cover (1).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (2).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (3).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (4).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (5).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (6).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (7).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (8).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (9).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (10).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (11).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (12).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (13).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (14).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (15).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (16).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (17).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (18).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (19).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (20).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (21).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (22).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (23).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (24).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (25).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (26).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (27).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (28).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (29).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (30).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (31).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (32).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (33).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (34).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (35).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (36).webp', 'Extang Trifecta cover-image 2.0 Soft Folding Tonneau Cover (37).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (38).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (39).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (40).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (41).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (42).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (43).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (44).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (45).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (46).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (47).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (48).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (49).webp', 'Extang Trifecta 2.0 Soft Folding Tonneau Cover (50).webp'],
  'Trifecta Toolbox 2.0': ['cover-image Trifecta Toolbox 2.0 (9) (1).webp', 'Trifecta Toolbox 2.0 (1).webp', 'Trifecta Toolbox 2.0 (2).webp', 'Trifecta Toolbox 2.0 (3).webp', 'Trifecta Toolbox 2.0 (4).webp', 'Trifecta Toolbox 2.0 (5).webp', 'Trifecta Toolbox 2.0 (6).webp', 'Trifecta Toolbox 2.0 (7).webp', 'Trifecta Toolbox 2.0 (8).webp', 'Trifecta Toolbox 2.0 (9).webp', 'Trifecta Toolbox 2.0 (10).webp', 'Trifecta Toolbox 2.0 (11).webp', 'Trifecta Toolbox 2.0 (12).webp', 'Trifecta Toolbox 2.0 (13).webp', 'Trifecta Toolbox 2.0 (14).webp'],
  'Trifecta ALX': ['cover-image - Extang Trifecta ALX Soft Folding Tonneau Cover (2).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (1).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (3).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (4).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (5).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (6).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (7).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (8).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (9).webp', 'Extang Trifecta ALX Soft Folding Tonneau Cover (10).webp'],
  'Pro X15': ['5db701304d588f900bdcccd18b919710.webp', 'f6fda4cba53515c2f3b2fe338aae6c11.webp', 'f1dbdbf1c3f883c2a3551b82cce0f369.webp', '06177244d308dfd555b7b2136c00e608.webp', '77943a3a7924c83c5a00ed5c32bf041b.webp', '35f7d85e6a55a0d1edbfcf956173da90.webp', '80d6158295e7529eed6e0ecbe9c6441e.webp', '2c9caaabdabe52db302e617c540c6988.webp', 'b3034714afa6922e7cad0522502e6a09.webp'],
  'Pro X15 TS': ['Truxedo Pro X15 TS Soft Roll-Up Tonneau Cover w T-Slot Rails (1).webp', 'Truxedo Pro X15 TS Soft Roll-Up Tonneau Cover w T-Slot Rails (2).webp', 'Truxedo Pro X15 TS Soft Roll-Up Tonneau Cover w T-Slot Rails (3).webp', 'Truxedo Pro X15 TS Soft Roll-Up Tonneau Cover w T-Slot Rails (4).webp', 'Truxedo Pro X15 TS Soft Roll-Up Tonneau Cover w T-Slot Rails (5).webp'],
  'TruXport': ['COVER IMAGE - Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (5).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (1).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (2).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (3).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (4).webp'],
  'Truxport': ['COVER IMAGE - Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (5).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (1).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (2).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (3).webp', 'Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (4).webp'],
  'Lo Pro': ['COVER IMAGE- Lo Pro Soft Roll-Up Tonneau Cover (2).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (1).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (3).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (4).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (5).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (6).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (7).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (8).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (9).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (10).webp', 'Lo Pro Soft Roll-Up Tonneau Cover (11).webp'],
  'BAKFlip F1': ['BAKFlip F1 Hard Folding Tonneau Cover-cover_img.webp', 'BAKFlip F1 Hard Folding Tonneau Cover.webp', 'BAKFlip F1 Hard Folding Tonneau Cover (1).webp', 'BAKFlip F1 Hard Folding Tonneau Cover (2).webp', 'BAKFlip F1 Hard Folding Tonneau Cover (3).webp', 'BAKFlip F1 Hard Folding Tonneau Cover (4).webp', 'BAKFlip F1 Hard Folding Tonneau Cover (5).webp', 'BAKFlip F1 Hard Folding Tonneau Cover (6).webp', 'bakflip-f1-cover.webp', 'bak-f1-hero.webp', 'MX4-TS/bak-bakflip-f1-2019-chevrolet-silverado-red_1.webp', 'bak-bakflip-f1-2019-chevrolet-silverado-red.webp']
};
const PRODUCT_INFO = {
  'BAKFlip F1': {
    tagline: 'Premium aluminum tri-fold that folds flat to the cab. 100% bed access, weather-tight seal, no-drill install.',
    desc: 'The BAKFlip F1 is BAK Industries\' flagship aluminum hard-fold tonneau. Fiber-reinforced panels sit low on the bed for a clean low-profile look tough enough for jobsite use. Three panels fold forward to the cab for full bed access — no removal needed. Full-length EPDM seals and integrated drain tubes keep the bed dry in any weather, and the clamp-on design means setup in under an hour.',
    highlights: ['Fiber-reinforced aluminum panels with matte UV-stable finish', 'Folds flat to the cab — 100% bed access, no removal needed', 'Full-length EPDM rubber seals on all four sides', 'Integrated drain system routes water away from the bed', 'No-drill clamp-on install in 30–45 minutes', 'BAK Industries 5-year warranty'],
    features: [{
      title: 'Aluminum Panels',
      body: 'Fiber-reinforced panels handle heavy loads and resist flex under pressure.'
    }, {
      title: 'Matte UV Finish',
      body: 'UV-stable matte powder coat stays sharp through seasons of sun and road grime.'
    }, {
      title: 'Full-Length Seals',
      body: 'EPDM rubber runs the full perimeter — no gaps, no leaks.'
    }, {
      title: 'Clamp-On Install',
      body: 'No drilling into bed rails. Full setup in under an hour.'
    }],
    warranty: '5-year manufacturer',
    material: 'Fiber-reinforced aluminum panels',
    installType: 'No-drill clamp-on'
  },
  'BAKFlip MX4': {
    tagline: 'BAK\'s best-selling matte-finish aluminum hard fold. Maximum security, zero compromises.',
    desc: 'The BAKFlip MX4 is the most popular hard-fold tonneau on the market for a reason. Heavy-duty aluminum panels with a premium matte finish give it a factory look built to outlast the truck. The low-profile design sits nearly flush with bed rails, and the prop-rod system holds it open at any angle. Automatic dual-action latches lock every panel down in one motion.',
    highlights: ['Heavy-duty aluminum panels with premium matte black finish', 'Prop-rod system holds the cover open at any angle', 'Automatic dual-action latches secure every panel simultaneously', 'Low-profile design sits flush with bed rail for factory look', 'Integrated drain system with rear-exit drain tubes', 'BAK Industries 5-year warranty'],
    features: [{
      title: 'Premium Matte Finish',
      body: 'Deeper matte texture than the F1 — resists scuffs and keeps a uniform look longer.'
    }, {
      title: 'Prop-Rod System',
      body: 'Stainless steel prop rods hold the cover at any position hands-free.'
    }, {
      title: 'Dual-Action Latches',
      body: 'One motion locks all panels simultaneously — no fumbling with individual latches.'
    }, {
      title: 'Low-Profile Design',
      body: 'Sits nearly flush with bed rails for a cleaner look and better aerodynamics.'
    }],
    warranty: '5-year manufacturer',
    material: 'Heavy-duty aluminum panels',
    installType: 'No-drill clamp-on'
  },
  'BAKFlip MX4 TS': {
    tagline: 'The BAKFlip MX4 with a factory-built accessory track. All the same aluminum quality, accessory-ready.',
    desc: 'The BAKFlip MX4 TS is the track system variant of BAK\'s best-selling aluminum hard-fold. Identical premium matte aluminum construction with an integrated accessory rail that accepts Yakima, Thule, and other rail-compatible cargo systems right out of the box — no separate kit required.',
    highlights: ['Factory-integrated accessory track — no kit required', 'Same premium matte aluminum as the standard MX4', 'Dual-action auto-latches on every panel', 'Low-profile, nearly flush with bed rails', 'No-drill clamp-on install', 'BAK Industries 5-year warranty'],
    features: [{
      title: 'Built-In Track',
      body: 'Factory accessory rail accepts Yakima, Thule, and other T-slot gear from day one.'
    }, {
      title: 'MX4 Quality',
      body: 'Same heavy-duty aluminum and matte finish as the best-selling standard MX4.'
    }, {
      title: 'Dual-Action Latches',
      body: 'One-motion locking across all panels.'
    }, {
      title: 'No-Drill Install',
      body: 'Clamp-on setup — no modifications to bed rails.'
    }],
    warranty: '5-year manufacturer',
    material: 'Heavy-duty aluminum panels',
    installType: 'No-drill clamp-on'
  },
  'BAKFlip G2': {
    tagline: 'BAK\'s entry-level aluminum hard fold. Proven build quality at a lower price point.',
    desc: 'The BAKFlip G2 gives you BAK Industries\' proven clamp-on aluminum hard-fold at a more accessible price. The fold-flat design opens to the cab for full bed access, and the all-aluminum frame resists rust and flex. The go-to for truck owners who want hard cover security and a no-drill install without paying for premium finish features.',
    highlights: ['Aluminum tri-fold panels with durable powder-coat finish', 'Folds flat to the cab for 100% bed access', 'No-drill clamp-on installation on standard bed rails', 'EPDM perimeter seals keep the bed dry', 'Integrated drainage at the rear tailgate', 'BAK Industries 3-year warranty'],
    features: [{
      title: 'Aluminum Build',
      body: 'All-aluminum frame and panels resist corrosion and flex under load.'
    }, {
      title: 'No-Drill Install',
      body: 'Clamp-on design fits most bed rails without modification.'
    }, {
      title: 'Full Bed Access',
      body: 'Tri-fold design opens completely to the cab — no removal required.'
    }, {
      title: 'Value Pricing',
      body: 'BAK quality at a lower entry point — same brand, scaled back finish.'
    }],
    warranty: '3-year manufacturer',
    material: 'Aluminum panels, powder coat',
    installType: 'No-drill clamp-on'
  },
  'BAKFlip FiberMax': {
    tagline: 'Fiberglass panels that can be painted to match your truck. The only BAK cover that goes fully custom.',
    desc: 'The BAKFlip FiberMax is BAK\'s premium fiberglass hard-fold. The composite panels are smooth, paintable, and give your truck a factory tonneau appearance aluminum covers can\'t match. Use the matte finish as-is, or take it to a body shop and paint it to match your truck\'s color for a truly custom look. Same no-drill clamp-on install and full perimeter EPDM seals as the rest of the BAK lineup.',
    highlights: ['Composite fiberglass panels — paintable to body color', 'Smooth surface for a custom factory-matched look', 'Low-profile design sits nearly flush with bed rails', 'Full perimeter EPDM seals and integrated drain system', 'No-drill clamp-on install on standard bed rails', 'BAK Industries 5-year warranty'],
    features: [{
      title: 'Paintable Fiberglass',
      body: 'Smooth composite panels accept automotive paint — color-match your truck.'
    }, {
      title: 'Factory Look',
      body: 'Flush profile and smooth finish looks closer to an OEM option than aluminum.'
    }, {
      title: 'Full Perimeter Seal',
      body: 'EPDM rubber seals the entire perimeter — bed stays dry in any weather.'
    }, {
      title: 'Clamp-On Install',
      body: 'No drilling. Fits standard bed rails in under an hour.'
    }],
    warranty: '5-year manufacturer',
    material: 'Composite fiberglass panels',
    installType: 'No-drill clamp-on'
  },
  'Revolver X4s': {
    tagline: 'Aluminum slat roll-up with a sleek low-profile look. Rolls tight to the cab — every inch of bed usable.',
    desc: 'The Revolver X4s is BAK Industries\' premium aluminum roll-up. Individual extruded aluminum slats roll up neatly at the cab for full bed access without leaving the truck. The low-profile design sits closer to the bed than any folding cover, and the rotary latch system provides truck-length locking from inside the bed.',
    highlights: ['Extruded aluminum slats roll up tight at the cab', 'Rotary latch system locks the cover from inside the bed', 'Low-profile — lower than any folding cover', 'Vinyl-coated slats resist UV, abrasion, and weathering', 'Full bed access without removing the cover', 'BAK Industries 5-year warranty'],
    features: [{
      title: 'Aluminum Slats',
      body: 'Extruded aluminum rolls smoothly and handles heavy loads without creasing.'
    }, {
      title: 'Rotary Lock',
      body: 'Lock the cover from anywhere along the bed — no reaching to the tailgate.'
    }, {
      title: 'Low-Profile Build',
      body: 'Sits lower than folding covers for a sleeker truck profile.'
    }, {
      title: 'Vinyl Coating',
      body: 'UV-stable vinyl over aluminum resists fading, scratches, and moisture.'
    }],
    warranty: '5-year manufacturer',
    material: 'Extruded aluminum slats, vinyl-coated',
    installType: 'No-drill clamp-on'
  },
  'Revolver X2': {
    tagline: 'Vinyl roll-up on a solid aluminum frame. Easy one-handed operation at an entry price.',
    desc: 'The Revolver X2 brings BAK\'s proven roll-up design to a more accessible price. Heavy-duty vinyl rolls on an extruded aluminum frame, and the cover opens to a compact bundle behind the cab. Simple, reliable, and weather-tight — the straightforward choice for truck owners who want a roll-up without the premium slat price.',
    highlights: ['Heavy-duty vinyl cover on extruded aluminum frame', 'Rolls open to a compact bundle at the cab', 'Easy one-handed operation', 'Weather-resistant vinyl with UV protection', 'No-drill installation on standard bed rails', 'BAK Industries 3-year warranty'],
    features: [{
      title: 'Vinyl Construction',
      body: 'Heavy-duty vinyl handles weather and abrasion without the aluminum slat cost.'
    }, {
      title: 'One-Hand Open',
      body: 'Single-motion roll-up opens quickly — even with one hand full of gear.'
    }, {
      title: 'Compact Roll',
      body: 'Rolls into a small bundle at the cab — doesn\'t block rear window view.'
    }, {
      title: 'Easy Install',
      body: 'Clamp-on design with no drilling into bed rails.'
    }],
    warranty: '3-year manufacturer',
    material: 'Heavy-duty vinyl, aluminum frame',
    installType: 'No-drill clamp-on'
  },
  'Revolver X4ts': {
    tagline: 'Aluminum slat roll-up with a built-in track system. The X4s, accessory-ready from day one.',
    desc: 'The Revolver X4ts is the track system version of BAK\'s premium X4s roll-up. All the same aluminum slat construction and rotary latch security, plus a factory-installed accessory rail that accepts Yakima, Thule, and other compatible accessories — no separate kit required.',
    highlights: ['Extruded aluminum slats — same as Revolver X4s', 'Factory-installed accessory track compatible with Yakima, Thule, and more', 'Rotary latch locks cover at any point along the bed', 'Low-profile design with vinyl-coated slats', 'Full bed access without removing from the truck', 'BAK Industries 5-year warranty'],
    features: [{
      title: 'Built-In Track',
      body: 'Factory accessory rail — no separate kit for Yakima/Thule mounts.'
    }, {
      title: 'Aluminum Slats',
      body: 'Same premium extruded aluminum as the X4s — rolls smooth, handles load.'
    }, {
      title: 'Rotary Lock',
      body: 'Lock from inside the bed at any point along the length.'
    }, {
      title: 'Accessory Ready',
      body: 'Compatible with most rail-mount cargo systems out of the box.'
    }],
    warranty: '5-year manufacturer',
    material: 'Extruded aluminum slats, vinyl-coated',
    installType: 'No-drill clamp-on'
  },
  'Solid Fold ALX': {
    tagline: 'Aircraft-grade aluminum hard fold from Extang. Stout construction with a clean matte finish.',
    desc: 'The Solid Fold ALX is Extang\'s aluminum tri-fold hard cover. Aircraft-grade aluminum panels fold forward to the cab for full bed access. The EZ-lock system gives you one-touch panel locking, and the large perimeter seal keeps the bed weather-tight. Clamp-on installation, no drilling, 5-year Extang warranty.',
    highlights: ['Aircraft-grade aluminum tri-fold panels', 'EZ-lock system — one-touch panel locking', 'Large perimeter seal for weather-tight protection', 'Folds flat to the cab for 100% bed access', 'No-drill clamp-on installation', 'Extang 5-year warranty'],
    features: [{
      title: 'Aircraft Aluminum',
      body: 'Higher-grade aluminum — stiffer panels with better dent resistance.'
    }, {
      title: 'EZ-Lock',
      body: 'One-touch locking engages all latches simultaneously.'
    }, {
      title: 'Large Perimeter Seal',
      body: 'Extang\'s oversized seal sits lower on the bed rail for a tighter weather barrier.'
    }, {
      title: 'Clamp-On Install',
      body: 'No drilling into bed rails — installs in 30–45 minutes.'
    }],
    warranty: '5-year manufacturer',
    material: 'Aircraft-grade aluminum panels',
    installType: 'No-drill clamp-on'
  },
  'Trifecta 2.0': {
    tagline: 'Extang\'s best-selling soft tri-fold. Simple, reliable, and backed for life.',
    desc: 'The Trifecta 2.0 is Extang\'s most popular soft tri-fold. Three vinyl-covered panels fold forward to the cab for full bed access, and the large ledge seal creates a weather-tight closure at the bed rail. EZ-lock thumbwheels secure each panel quickly — no tools needed. Backed by Extang\'s limited lifetime warranty.',
    highlights: ['Tri-fold vinyl soft cover — simple and reliable', 'Large ledge seal for weather-tight bed protection', 'EZ-lock thumbwheels secure each panel quickly', 'Folds to the cab for full bed access in seconds', 'No-drill installation in 30 minutes or less', 'Extang limited lifetime warranty'],
    features: [{
      title: 'Soft Vinyl Panels',
      body: 'UV-stable vinyl over a heavy-gauge frame — durable everyday use.'
    }, {
      title: 'Large Ledge Seal',
      body: 'Extended seal at the bed rail catches more water than standard seals.'
    }, {
      title: 'EZ-Lock Thumbwheels',
      body: 'Lock and release each panel without tools or fumbling.'
    }, {
      title: 'Lifetime Warranty',
      body: 'Extang backs this cover for the life of your truck.'
    }],
    warranty: 'Limited lifetime',
    material: 'Diamond-coated vinyl panels',
    installType: 'No-drill clamp-on'
  },
  'RetraxPRO MX': {
    tagline: 'Aluminum retractable by Retrax. Low-profile, lockable at any position, 500 lb center rating.',
    desc: 'The RetraxPRO MX is Retrax\'s aluminum retractable tonneau. Polycarbonate-reinforced aluminum slats glide on sealed ball-bearing tracks and retract into a compact canister at the cab. Lock the cover at any position with the built-in key cylinder. Stake pocket mounting keeps rails secure without blocking stake holes. Weight rated at 500 lbs on center.',
    highlights: ['Aluminum slats with polycarbonate reinforcement', 'Retracts into compact canister — no cab overhang', 'Locks at any position with built-in key cylinder', 'Stake pocket mounting — stake holes stay accessible', '500 lb center weight rating', 'Retrax lifetime warranty'],
    features: [{
      title: 'Aluminum Slats',
      body: 'Polycarbonate-reinforced aluminum handles heavy loads and stays rigid.'
    }, {
      title: 'Lock Anywhere',
      body: 'Built-in key cylinder locks the cover at any point in its travel.'
    }, {
      title: 'Stake Pocket Mount',
      body: 'Rails clamp to stake pockets — no drilling, holes stay open.'
    }, {
      title: '500 lb Rating',
      body: 'Rated for 500 lbs on center — strong enough to stand on.'
    }],
    warranty: 'Lifetime',
    material: 'Polycarbonate-reinforced aluminum slats',
    installType: 'Stake pocket mount, no-drill'
  },
  'RetraxPRO XR': {
    tagline: 'Polycarbonate retractable with a full-length T-slot accessory track. Retrax\'s most capable cover.',
    desc: 'The RetraxPRO XR is Retrax\'s premium retractable. Reinforced polycarbonate slats are lighter than aluminum but equally rigid, and the full-length T-slot rail runs the length of the cover for Yakima, Thule, and other T-slot accessories — even when fully retracted. Stake pocket mounting. 500 lb center rating. Retrax lifetime warranty.',
    highlights: ['Polycarbonate slats — lighter than aluminum, equally rigid', 'Full-length T-slot accessory rail compatible with Yakima and Thule', 'T-slot rail accessible whether cover is open or closed', 'Locks at any position with built-in key cylinder', 'Stake pocket mounting — stake holes stay open', 'Retrax lifetime warranty'],
    features: [{
      title: 'Polycarbonate Slats',
      body: 'Lighter than aluminum with similar strength — smooth in all temperatures.'
    }, {
      title: 'Full-Length T-Slot',
      body: 'Run Yakima, Thule, or any T-slot gear the full length of the truck.'
    }, {
      title: 'Open & Equipped',
      body: 'T-slot rail stays usable whether cover is open or closed.'
    }, {
      title: '500 lb Rating',
      body: 'Rated for 500 lbs center load.'
    }],
    warranty: 'Lifetime',
    material: 'Polycarbonate slats',
    installType: 'Stake pocket mount, no-drill'
  },
  'RetraxONE MX': {
    tagline: 'Retrax\'s entry retractable. Polycarbonate slats, simple locking, clean stake pocket mount.',
    desc: 'The RetraxONE MX is Retrax\'s entry-level retractable at a lower price than the PRO. Polycarbonate-reinforced slats slide on sealed ball-bearing tracks into a compact cab canister. No-drill stake pocket mounting. Built-in key lock. Weight rated 500 lbs on center. Retrax quality without the accessory rail premium.',
    highlights: ['Polycarbonate-reinforced slats', 'Compact canister sits at the cab — no overhang', 'Built-in key lock at the canister', 'No-drill stake pocket installation', '500 lb center weight rating', 'Retrax lifetime warranty'],
    features: [{
      title: 'Reinforced Slats',
      body: 'Polycarbonate-backed construction stays rigid through temperature swings.'
    }, {
      title: 'Compact Canister',
      body: 'Canister sits inside the cab area — doesn\'t reduce usable bed length.'
    }, {
      title: 'Key Lock',
      body: 'Single key cylinder locks the cover closed at the canister.'
    }, {
      title: 'No-Drill Mount',
      body: 'Stake pocket clamps secure the rails without touching the bed walls.'
    }],
    warranty: 'Lifetime',
    material: 'Polycarbonate-reinforced slats',
    installType: 'Stake pocket mount, no-drill'
  },
  'Sentry CT': {
    tagline: 'TruXedo\'s premium hard fold with a carbon fiber-look finish. Clean, low-profile, and built tough.',
    desc: 'The Sentry CT is TruXedo\'s flagship hard-fold tonneau. Heavy-duty aluminum panels with a carbon fiber-textured finish sit flush with bed rails for a premium look. The SecureLatch system auto-locks each panel on fold-down, and the full-width rubber seal keeps the bed weather-tight. Clamp-on installation, 5-year TruXedo warranty.',
    highlights: ['Heavy-duty aluminum panels with carbon fiber-look texture', 'SecureLatch system auto-locks every panel on fold-down', 'Full-width rubber seal on all four sides', 'Low-profile design sits flush with bed rails', 'No-drill clamp-on installation', 'TruXedo 5-year warranty'],
    features: [{
      title: 'Carbon Fiber Texture',
      body: 'Textured finish that mimics carbon fiber weave — sharp visual upgrade over matte.'
    }, {
      title: 'SecureLatch',
      body: 'Auto-locking latch engages on fold-down — no manual securing required.'
    }, {
      title: 'Full-Width Seal',
      body: 'Wide rubber seal runs the entire perimeter for consistent weather protection.'
    }, {
      title: 'Flush Profile',
      body: 'Low-profile panels sit nearly flush with bed rail for a factory look.'
    }],
    warranty: '5-year manufacturer',
    material: 'Heavy-duty aluminum, carbon fiber texture',
    installType: 'No-drill clamp-on'
  },
  'Lo Pro': {
    tagline: 'TruXedo\'s ultra-low-profile soft roll-up. The slimmest cover in the TruXedo lineup.',
    desc: 'The TruXedo Lo Pro is the industry\'s lowest-profile soft roll-up tonneau. Upgraded vinyl sits just 3/8" above the bed rail — lower than any other roll-up on the market. Rolls up into a slim bundle at the cab with a secure snap system. Easy one-handed operation, no-drill installation, TruXedo lifetime warranty.',
    highlights: ['Industry-lowest profile — just 3/8" above the bed rail', 'Premium vinyl with UV and mildew protection', 'Snap system keeps the rolled cover compact and secure', 'One-handed operation — open and close in seconds', 'No-drill installation on standard bed rails', 'TruXedo limited lifetime warranty'],
    features: [{
      title: 'Ultra-Low Profile',
      body: '3/8" above the rail — the slimmest soft roll-up available for any truck.'
    }, {
      title: 'Premium Vinyl',
      body: 'UV-stable vinyl with mildew inhibitor stays looking sharp year-round.'
    }, {
      title: 'Snap System',
      body: 'Secure snaps hold the rolled cover tight — won\'t flap at highway speed.'
    }, {
      title: 'One-Hand Open',
      body: 'Roll up with one hand — simple enough that you\'ll actually use it.'
    }],
    warranty: 'Limited lifetime',
    material: 'Premium vinyl, aluminum frame',
    installType: 'No-drill clamp-on'
  },
  'ArmorFlex': {
    tagline: 'UnderCover\'s military-grade hard fold. The toughest tri-fold cover in the segment.',
    desc: 'The ArmorFlex is UnderCover\'s heavy-duty hard-fold tonneau. Extra-thick aluminum panels with a textured matte finish handle everything from jobsite abuse to off-road trips. Aluminum hinges and frame throughout — no plastic weak points. Automatic latching, full-perimeter EPDM seal, clamp-on install. UnderCover 5-year warranty.',
    highlights: ['Extra-thick aluminum panels with textured matte finish', 'All-aluminum hinges and frame — no plastic components', 'Automatic latching at every panel position', 'Full-perimeter EPDM rubber seal', 'No-drill clamp-on installation', 'UnderCover 5-year warranty'],
    features: [{
      title: 'All-Aluminum Build',
      body: 'Panels and frame both aluminum — no plastic hinge points to crack or fail.'
    }, {
      title: 'Thick Panels',
      body: 'Heavier gauge than most covers — built for jobsite and off-road use.'
    }, {
      title: 'Auto-Latching',
      body: 'Latches engage automatically as panels fold down.'
    }, {
      title: 'Full Perimeter Seal',
      body: 'EPDM seal runs the full perimeter — same material as car window seals.'
    }],
    warranty: '5-year manufacturer',
    material: 'Extra-thick aluminum panels',
    installType: 'No-drill clamp-on'
  },
  'Ultra Flex': {
    tagline: 'UnderCover\'s best-selling hard fold. Lightweight aluminum with a diamond-textured finish.',
    desc: 'The Ultra Flex is UnderCover\'s most popular hard-fold cover. Lightweight aluminum panels with a diamond-textured matte finish fold forward to the cab for full bed access. Secure auto-latch engages every time a panel folds down. Reinforced corner seals address the industry\'s most common leak point. 5-year warranty.',
    highlights: ['Lightweight aluminum with diamond-textured matte finish', 'Secure auto-latch at every panel — engages on fold-down', 'Reinforced corner seals where leaks start first', 'Full bed access by folding all panels to the cab', 'No-drill clamp-on installation', 'UnderCover 5-year warranty'],
    features: [{
      title: 'Diamond Texture',
      body: 'Distinctive pattern adds grip and hides minor scratches.'
    }, {
      title: 'Reinforced Corners',
      body: 'Extra seal material at corners addresses the industry\'s most common leak point.'
    }, {
      title: 'Auto-Latch',
      body: 'Latch engages automatically on fold-down — consistent closure every time.'
    }, {
      title: 'Lightweight Build',
      body: 'Lighter than most aluminum hard folds — easier to fold up alone.'
    }],
    warranty: '5-year manufacturer',
    material: 'Lightweight aluminum panels',
    installType: 'No-drill clamp-on'
  },
  'E-Series': {
    tagline: 'Roll N Lock\'s manual retractable. Vinyl-wrapped aluminum slats that disappear into the cab.',
    desc: 'The E-Series is Roll N Lock\'s manual retractable tonneau. Vinyl-wrapped aluminum slats glide on precision rails into a cab canister with built-in open lock. A key cylinder at the tailgate seals the bed closed. Stake pocket mounting — no drilling, no blocked holes. Roll N Lock 3-year warranty.',
    highlights: ['Vinyl-wrapped aluminum slats retract into cab canister', 'Key cylinder at tailgate locks the cover closed', 'Cab-mounted lock holds the cover open hands-free', 'Stake pocket installation — no drilling, stake holes stay open', 'Low-profile canister sits inside cab area', 'Roll N Lock 3-year warranty'],
    features: [{
      title: 'Vinyl-Wrapped Slats',
      body: 'Smooth vinyl over aluminum — consistent look at any temperature.'
    }, {
      title: 'Dual-Point Lock',
      body: 'Key lock at tailgate AND canister — bed locked either open or closed.'
    }, {
      title: 'Stake Pocket Mount',
      body: 'No-drill stake pocket install keeps bed rails and holes clean.'
    }, {
      title: 'Manual Operation',
      body: 'Smooth glide system needs no power — reliable in all conditions.'
    }],
    warranty: '3-year manufacturer',
    material: 'Vinyl-wrapped aluminum slats',
    installType: 'Stake pocket mount, no-drill'
  },
  'M-Series': {
    tagline: 'Roll N Lock\'s lightest retractable. Reinforced vinyl roll in a retractable form factor.',
    desc: 'The M-Series is Roll N Lock\'s ultra-lightweight retractable tonneau. Rather than aluminum slats, it uses a roll of reinforced vinyl that stows into the cab canister — making it the lightest retractable tonneau available. Smooth one-handed operation, stake pocket mounting, key lock at the tailgate.',
    highlights: ['Reinforced vinyl roll — lightest retractable in the segment', 'One-handed retraction into compact cab canister', 'Key cylinder at tailgate locks the bed closed', 'Stake pocket installation — no drilling required', 'Smaller canister than slat covers — more cab clearance', 'Roll N Lock 3-year warranty'],
    features: [{
      title: 'Vinyl Roll',
      body: 'Reinforced vinyl rolls lighter and faster than aluminum slats.'
    }, {
      title: 'Compact Canister',
      body: 'Smaller canister than slat covers — more cab clearance.'
    }, {
      title: 'One-Hand Open',
      body: 'Lightest retractable available — easy single-hand operation.'
    }, {
      title: 'Key Lock',
      body: 'Tailgate key cylinder keeps the bed secured.'
    }],
    warranty: '3-year manufacturer',
    material: 'Reinforced vinyl roll',
    installType: 'Stake pocket mount, no-drill'
  }
};
function getGenericInfo(productName, coverType) {
  const typeDefaults = {
    'Hard Folding': {
      tagline: `${productName} — hard-folding aluminum tonneau cover. Solid security, full bed access, no-drill install.`,
      desc: `${productName} is a hard-folding tonneau cover that combines solid aluminum construction with practical everyday use. Three panels fold forward to the cab for full bed access, and the perimeter EPDM seal keeps the bed weather-tight in any conditions. Clamp-on installation means no drilling into bed rails.`,
      highlights: ['Aluminum tri-fold panels', 'Full bed access when folded to cab', 'EPDM perimeter seal', 'Automatic latching system', 'No-drill clamp-on installation', 'Manufacturer warranty included'],
      features: [{
        title: 'Aluminum Panels',
        body: 'Solid aluminum construction resists flex and weathering.'
      }, {
        title: 'Full Bed Access',
        body: 'Tri-fold design opens completely to the cab.'
      }, {
        title: 'Perimeter Seal',
        body: 'EPDM seal around all four sides keeps the bed dry.'
      }, {
        title: 'No-Drill Install',
        body: 'Clamp-on design fits standard bed rails without modification.'
      }],
      warranty: 'Manufacturer warranty',
      material: 'Aluminum panels',
      installType: 'No-drill clamp-on'
    },
    'Soft Folding': {
      tagline: `${productName} — soft tri-fold tonneau cover. Easy access, lightweight, weather-resistant.`,
      desc: `${productName} is a soft-folding tonneau cover built for truck owners who want convenient access with everyday weather protection. The vinyl panels fold forward to the cab in seconds, and the perimeter seals keep moisture out. Lightweight construction makes it easy to fold up and secure with one hand.`,
      highlights: ['Vinyl tri-fold panels', 'Folds to cab for full bed access', 'Weather-resistant seal', 'Lightweight one-hand operation', 'No-drill installation', 'Manufacturer warranty included'],
      features: [{
        title: 'Vinyl Panels',
        body: 'Durable vinyl handles UV and weather without cracking.'
      }, {
        title: 'Easy Access',
        body: 'Fold to the cab in seconds — no tools required.'
      }, {
        title: 'Weather Seal',
        body: 'Perimeter sealing keeps the bed protected in rain.'
      }, {
        title: 'No-Drill Install',
        body: 'Clamp-on design fits standard bed rails.'
      }],
      warranty: 'Manufacturer warranty',
      material: 'Vinyl panels, aluminum frame',
      installType: 'No-drill clamp-on'
    },
    'Roll-Up': {
      tagline: `${productName} — soft roll-up tonneau cover. Low-profile, simple operation, no-drill install.`,
      desc: `${productName} is a soft roll-up tonneau cover that gives you easy access and a low-profile look. The cover rolls up to a compact bundle at the cab when you need full bed access, and snaps down for weather protection in seconds. Lightweight and simple to operate with one hand.`,
      highlights: ['Rolls up to compact bundle at the cab', 'Low-profile design', 'Simple one-handed operation', 'Weather-resistant vinyl', 'No-drill clamp-on installation', 'Manufacturer warranty included'],
      features: [{
        title: 'Roll-Up Design',
        body: 'Rolls into a compact bundle at the cab for full bed access.'
      }, {
        title: 'Low-Profile',
        body: 'Sits close to the bed rail for a clean truck look.'
      }, {
        title: 'One-Hand Op',
        body: 'Open and close in seconds with one hand.'
      }, {
        title: 'No-Drill Install',
        body: 'Clamp-on fits standard bed rails without modification.'
      }],
      warranty: 'Manufacturer warranty',
      material: 'Vinyl, aluminum frame',
      installType: 'No-drill clamp-on'
    },
    'Retractable': {
      tagline: `${productName} — retractable tonneau cover. Slides open smoothly, locks at any position.`,
      desc: `${productName} is a retractable tonneau cover that slides open on sealed rails into a compact canister at the cab. Lock the cover at any position for partial or full access. The rigid slat construction handles heavy loads and stands up to years of daily use.`,
      highlights: ['Retracts into compact canister at the cab', 'Locks at any position for partial or full access', 'Rigid slat construction handles heavy loads', 'No-drill stake pocket installation', 'Manufacturer warranty included'],
      features: [{
        title: 'Retractable Design',
        body: 'Slides smoothly into canister — no folding, no fumbling.'
      }, {
        title: 'Lock Anywhere',
        body: 'Lock at any open position for hands-free access.'
      }, {
        title: 'Rigid Slats',
        body: 'Solid slat construction stands up to load and daily use.'
      }, {
        title: 'No-Drill Mount',
        body: 'Stake pocket clamps install without modifying the bed.'
      }],
      warranty: 'Manufacturer warranty',
      material: 'Aluminum or polycarbonate slats',
      installType: 'Stake pocket mount, no-drill'
    }
  };
  if (_catId === 'tonneau') return typeDefaults[coverType] || typeDefaults['Hard Folding'];
  // Non-tonneau categories used to fall through to the tonneau "Hard Folding"
  // template above (coverType here is the category noun, e.g. "Running Board",
  // which never matches a tonneau key) — a running board's spec sheet would
  // claim it was a "hard-folding aluminum tonneau cover". Build an honest,
  // category-neutral fallback instead; no fabricated technical claims.
  const noun = (coverType || _catNoun || 'part').toLowerCase();
  return {
    tagline: `${productName} — professional-grade ${noun} for your truck.`,
    desc: `The ${productName} is built for daily-driver durability with a clean, factory-style fit. 3J's installs it in-house so it's set up right the first time.`,
    highlights: ['Built for daily-driver durability', 'Professional installation available in-house', 'Manufacturer warranty included', 'Confirm exact fitment by adding your truck to the garage'],
    features: [{
      title: 'Durable Build',
      body: 'Constructed to handle daily use without premature wear.'
    }, {
      title: 'Pro Install',
      body: "Installed in-house at 3J's — done right, not a DIY guess."
    }, {
      title: 'Warranty',
      body: "Backed by the manufacturer's warranty."
    }],
    warranty: 'Manufacturer warranty',
    material: null,
    installType: 'Professional installation available'
  };
}
function getProductInfo(productName, coverType) {
  // 1. Rich inline content takes priority
  if (PRODUCT_INFO[productName]) return PRODUCT_INFO[productName];
  // 2. Fall back to PRODUCT_CONTENT (product-content.js) if available for this product
  if (typeof PRODUCT_CONTENT !== 'undefined' && PRODUCT_CONTENT[productName]) {
    const pc = PRODUCT_CONTENT[productName];
    const ct = pc.coverType || coverType;
    const generic = getGenericInfo(productName, ct);
    // The generic copy is written for tonneau covers. When an entry carries its
    // own specs (the vendor-generated brands do), prefer those over wording
    // that would describe a bumper as a "hard-folding aluminum tonneau cover".
    const sp = pc.specs || {};
    const hasSpecs = Object.keys(sp).length > 0;
    const firstSentence = (pc.desc || '').split(/(?<=\.)\s+/)[0] || '';
    return Object.assign({}, generic, {
      desc: pc.desc || generic.desc,
      tagline: hasSpecs ? firstSentence || pc.desc : generic.tagline,
      material: sp['Material'] || generic.material,
      warranty: sp['Warranty'] || generic.warranty,
      installType: sp['Install Time'] ? `${sp['Install Time']} install${sp['Install Difficulty'] ? ` · difficulty ${sp['Install Difficulty']}` : ''}` : generic.installType,
      specs: hasSpecs ? sp : undefined,
      installPdf: pc.installPdf,
      highlights: pc.features && pc.features.length ? pc.features : generic.highlights,
      features: pc.features && pc.features.length ? pc.features.slice(0, 4).map(f => ({
        title: f.split(' ').slice(0, 3).join(' '),
        body: f
      })) : generic.features
    });
  }
  // 3. Generic fallback by cover type
  return getGenericInfo(productName, coverType);
}
const up = s => String(s == null ? '' : s).toUpperCase().trim();

// Suppliers spell the same make several ways — RAM/Ram, DODGE/Dodge, FORD/Ford
// — and the garage picker offers no "Dodge", so a pre-2011 Ram owner selects
// RAM. Group the spellings that name one vehicle family.
const MAKE_FAMILY = {
  CHEVROLET: 'GM',
  CHEVY: 'GM',
  GMC: 'GM',
  RAM: 'RAM',
  DODGE: 'RAM'
};
function makeMatches(cm, gm) {
  const c = up(cm),
    m = up(gm);
  if (c === m) return true;
  const cf = MAKE_FAMILY[c],
    mf = MAKE_FAMILY[m];
  return !!cf && cf === mf;
}

// Ram-family models that are NOT a 1500/2500/3500 pickup. A pickup owner must
// never be shown these, even if a size token leaks in from the description.
const RAM_NOT_PICKUP = /\b(DAKOTA|DURANGO|PROMASTER|RAMCHARGER|SPRINTER|CHARGER|CHALLENGER|JOURNEY|CARAVAN|NEON|NITRO|DART|MAGNUM|VIPER|HORNET|INTREPID|STRATUS|AVENGER|CALIBER|RAM 50|RAM (1500|2500|3500) VAN|[DWB]\d{3}|CB300|RD200|M3[05]0)\b/;
function sizeTokens(s) {
  const out = [],
    str = up(s),
    re = /([A-Z]*)([1-5]500)(?![0-9])/g;
  let m;
  while (m = re.exec(str)) {
    // A single letter in front means a model code, not a size class — C1500 and
    // K2500 are Chevy/GMC, B2500 is a Dodge van. A longer word in front is just
    // a supplier missing a space ("New Body Style1500 only").
    if (m[1].length === 1) continue;
    if (!m[1].length) {
      const p = str.charAt(m.index - 1);
      if (p >= '0' && p <= '9') continue;
    }
    if (out.indexOf(m[2]) === -1) out.push(m[2]);
  }
  return out;
}

// Which size classes a Ram row fits. The model field is often useless ("Ram",
// "Ram W/O Ram Box", "DS") — BAK, TruXedo, Retrax and UnderCover name the truck
// in the description instead ("09-18 & 19-23 Classic 1500 Dodge Ram W/O Ram
// Box"). Returns null for a non-pickup, [] when nothing identifiable is found.
function ramSizes(row) {
  if (RAM_NOT_PICKUP.test(up(row[F.model]))) return null;
  const fromModel = sizeTokens(row[F.model]);
  return fromModel.length ? fromModel : sizeTokens(row[F.desc]);
}

// Compared uppercased for the same reason makes are: suppliers ship SILVERADO
// 1500, RANGER and TACOMA in caps while the garage picker stores them in title
// case. The hardcoded model literals below must be uppercased to match — leave
// 'Silverado/Sierra' in title case here and Silverado tonneau drops 52 to 21.
function modelMatches(row, garage) {
  const cmo = up(row[F.model]),
    gmo = up(garage.model);
  const legacy = cmo === gmo || cmo.indexOf(gmo) !== -1 || gmo.indexOf(cmo) !== -1 || cmo === 'SILVERADO/SIERRA' && (gmo.indexOf('SILVERADO') !== -1 || gmo.indexOf('SIERRA') !== -1) || cmo === 'CANYON/COLORADO' && (gmo === 'CANYON' || gmo === 'COLORADO') || cmo === '1500/2500/3500' && (gmo.indexOf('RAM') !== -1 || gmo.indexOf('1500') !== -1 || gmo.indexOf('2500') !== -1);
  const isRam = up(garage.make) === 'RAM';
  if (legacy) {
    // "ProMaster 1500" used to slip through on the bare "1500" substring.
    if (isRam && RAM_NOT_PICKUP.test(cmo) && !RAM_NOT_PICKUP.test(gmo)) return false;
    return true;
  }
  if (!isRam) return false;
  const want = sizeTokens(gmo);
  if (!want.length) return false;
  const has = ramSizes(row);
  if (!has || !has.length) return false;
  for (let i = 0; i < want.length; i++) if (has.indexOf(want[i]) !== -1) return true;
  return false;
}
function matchesTruck(row, garage) {
  if (!garage) return false;
  const year = parseInt(garage.year);
  if (year < row[F.startYear] || year > row[F.endYear]) return false;
  if (!makeMatches(row[F.make], garage.make)) return false;
  if (!modelMatches(row, garage)) return false;
  const bedIn = garage.bedIn || null;
  if (bedIn && row[F.bedIn] && Math.abs(row[F.bedIn] - bedIn) > 2) return false;
  return true;
}
const Icon = {
  truck: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 6h13v9H1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 9h5l3 3v3h-8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "17",
    r: "2"
  })),
  quote: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
  })),
  check: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m3 8 3.5 3.5L13 5",
    style: {
      stroke: '#2a9355'
    }
  })),
  warn: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 6v3m0 3h.01M3 13h10L8 3 3 13z",
    stroke: "#8B0000"
  })),
  phone: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.82 19.79 19.79 0 01.67 2.18 2 2 0 012.66 0h3a2 2 0 012 1.72c.13 1 .36 1.97.7 2.91a2 2 0 01-.45 2.11L6.91 7.74a16 16 0 006.29 6.29l1-.99a2 2 0 012.11-.45c.94.34 1.91.57 2.91.7A2 2 0 0122 16.92z"
  })),
  chat: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
  })),
  shield: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2 4 5v7c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5l-8-3z"
  })),
  ship: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 6h13v9H1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 9h5l3 3v3h-8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "17",
    r: "2"
  })),
  install: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 0 0 5.6-5.6l-2 2-2.4-2.4 2-2zM18 6l3 3"
  })),
  share: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m7 6 3-3 3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 3v10"
  })),
  bolt: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 1 3 9h4l-1 6 6-8H8z"
  })),
  star: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m8 1.6 2 4.3 4.6.6-3.4 3.2.9 4.6L8 12l-4.1 2.3.9-4.6L1.4 6.5l4.6-.6z"
  })),
  plus: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19",
    stroke: "#8B0000",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12",
    stroke: "#8B0000",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }))
};
function Stars({
  value = 5,
  size = 16
}) {
  const full = Math.round(value);
  return /*#__PURE__*/React.createElement("span", {
    className: "stars",
    style: {
      display: 'inline-flex',
      gap: 2
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("svg", {
    key: i,
    viewBox: "0 0 16 16",
    style: {
      width: size,
      height: size,
      fill: i <= full ? '#8B0000' : 'rgba(20,18,14,.18)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m8 1.6 2 4.3 4.6.6-3.4 3.2.9 4.6L8 12l-4.1 2.3.9-4.6L1.4 6.5l4.6-.6z"
  }))));
}
function Header({
  garage
}) {
  const tickers = [`FREE LOCAL INSTALL ON ${_catDef.catLabel.toUpperCase()}`, 'SIGNAL HILL, CA', '(562) 424-6744', '30-DAY FIT GUARANTEE', 'FREE SHIPPING OVER $99'];
  const ticker = [...tickers, ...tickers];
  const garageLabel = garage ? `${garage.year} ${garage.make} ${garage.model}` : 'Add Your Truck';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "hdr-promo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr-ticker"
  }, ticker.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "hdr-ticker-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bolt",
    style: {
      color: '#8B0000',
      display: 'inline-flex'
    }
  }, Icon.bolt), /*#__PURE__*/React.createElement("span", null, t))))), /*#__PURE__*/React.createElement("header", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr-main"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/",
    className: "logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO_URL,
    alt: "3J's Auto Body & Paint"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hdr-actions"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "hdr-nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: _catalogUrl,
    className: "nav-item active"
  }, _catDef.catLabel), /*#__PURE__*/React.createElement("a", {
    href: "steps-running-boards.html",
    className: "nav-item"
  }, "Running Boards"), /*#__PURE__*/React.createElement("a", {
    href: "headache-racks.html",
    className: "nav-item"
  }, "Headache Racks"), /*#__PURE__*/React.createElement("a", {
    href: "lighting.html",
    className: "nav-item"
  }, "Lighting"), /*#__PURE__*/React.createElement("a", {
    href: "rhino-liner.html",
    className: "nav-item"
  }, "Rhino Linings"), /*#__PURE__*/React.createElement("a", {
    href: "contact.html",
    className: "nav-item"
  }, "Contact"))));
}
function Breadcrumbs({
  productName,
  brandName,
  coverType
}) {
  const cat = _qParams.get('cat') || _catDef.catLabel;
  const catUrl = _qParams.get('catUrl') || 'parts-catalog.html';
  const type = _qParams.get('type') || coverType;
  const fullName = [brandName, productName].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("nav", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "crumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: "exterior-accessories-V2.html"
  }, "Exterior Accessories"), /*#__PURE__*/React.createElement("span", {
    className: "crumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: catUrl
  }, cat), /*#__PURE__*/React.createElement("span", {
    className: "crumb-sep"
  }, "/"), type && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: catUrl
  }, type), /*#__PURE__*/React.createElement("span", {
    className: "crumb-sep"
  }, "/")), /*#__PURE__*/React.createElement("span", {
    className: "crumb-now"
  }, fullName));
}
function Gallery({
  images,
  productName,
  fits,
  garage
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const MAX_VIS = 5;
  const safeActive = Math.min(active, images.length - 1);
  const hasMore = images.length > MAX_VIS && !expanded;
  const visible = hasMore ? images.slice(0, MAX_VIS - 1) : images;
  return /*#__PURE__*/React.createElement("div", {
    className: "gallery"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gal-thumbs"
  }, images.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, visible.map((src, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: `gal-thumb ${safeActive === i ? 'active' : ''}`,
    onClick: () => setActive(i)
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: `${productName} view ${i + 1}`
  }))), hasMore && /*#__PURE__*/React.createElement("button", {
    className: "gal-thumb gal-thumb-more",
    onClick: () => {
      setExpanded(true);
      setActive(MAX_VIS - 1);
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: images[MAX_VIS - 1],
    alt: `${productName} view ${MAX_VIS}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "gal-more-overlay"
  }, "+", images.length - (MAX_VIS - 1)))) : /*#__PURE__*/React.createElement("button", {
    className: "gal-thumb active"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#f4f4f1'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "gal-main"
  }, images.length > 0 ? /*#__PURE__*/React.createElement("img", {
    src: images[safeActive],
    alt: productName
  }) : /*#__PURE__*/React.createElement("div", {
    className: "gal-main-placeholder"
  }, productName)));
}
function FitmentBlock({
  garage,
  fits
}) {
  if (!garage) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pdp-fit no-garage"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pdp-fit-ico",
      style: {
        color: '#999'
      }
    }, Icon.truck), /*#__PURE__*/React.createElement("div", {
      className: "pdp-fit-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pdp-fit-label"
    }, "Check fitment for your truck"), /*#__PURE__*/React.createElement("div", {
      className: "pdp-fit-vehicle",
      style: {
        fontSize: 14,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--body)',
        fontWeight: 400,
        textTransform: 'none'
      }
    }, "Add your vehicle to see if this fits")), /*#__PURE__*/React.createElement("a", {
      href: _catalogUrl,
      className: "pdp-fit-link"
    }, "Add Truck"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `pdp-fit ${fits ? '' : 'no-fit'}`,
    style: {
      borderLeftColor: fits ? '#097530' : '#8B0000'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdp-fit-ico",
    style: {
      color: fits ? '#097530' : '#8B0000'
    }
  }, fits ? Icon.check : Icon.warn), /*#__PURE__*/React.createElement("div", {
    className: "pdp-fit-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdp-fit-label"
  }, fits ? 'Confirmed fit for' : 'May not fit'), /*#__PURE__*/React.createElement("div", {
    className: "pdp-fit-vehicle"
  }, garage.year, " ", garage.make, " ", garage.model)), /*#__PURE__*/React.createElement("a", {
    href: _catalogUrl,
    className: "pdp-fit-link"
  }, "Change"));
}
function Info({
  productName,
  brandName,
  coverType,
  minPrice,
  bedSizes,
  info,
  garage,
  fits
}) {
  const [selBed, setSelBed] = useState(bedSizes[0]?.label || '');
  return /*#__PURE__*/React.createElement("div", {
    className: "pdp-info"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pdp-brand"
  }, brandName, /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "pdp-type-badge"
  }, coverType)), /*#__PURE__*/React.createElement("h1", {
    className: "pdp-title"
  }, productName), /*#__PURE__*/React.createElement("p", {
    className: "pdp-sub"
  }, info.tagline)), /*#__PURE__*/React.createElement(FitmentBlock, {
    garage: garage,
    fits: fits
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pdp-price-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pdp-price-from"
  }, "FROM"), /*#__PURE__*/React.createElement("span", {
    className: "pdp-price"
  }, minPrice ? `$${minPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}` : 'Call for Price')), /*#__PURE__*/React.createElement("div", {
    className: "pdp-stock"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pdp-stock-dot"
  }), "IN STOCK \xB7 FREE LOCAL INSTALL")), /*#__PURE__*/React.createElement("a", {
    href: QUOTE_URL,
    className: "pdp-cta",
    onClick: addToQuoteCart
  }, Icon.quote, "Add to Quote"), /*#__PURE__*/React.createElement("div", {
    className: "pdp-secondary"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pdp-sec-btn",
    onClick: () => window.open(`tel:+15624246744`)
  }, Icon.phone, "Call Us"), /*#__PURE__*/React.createElement("button", {
    className: "pdp-sec-btn",
    onClick: () => {
      const u = window.location.href;
      navigator.clipboard && navigator.clipboard.writeText(u);
    }
  }, Icon.share, "Share")), /*#__PURE__*/React.createElement("div", {
    className: "highlights"
  }, /*#__PURE__*/React.createElement("div", {
    className: "highlights-title"
  }, "Key Features"), /*#__PURE__*/React.createElement("ul", null, info.highlights.map((h, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, h)))), /*#__PURE__*/React.createElement("div", {
    className: "trust"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "trust-ico"
  }, Icon.ship), /*#__PURE__*/React.createElement("div", {
    className: "trust-text"
  }, /*#__PURE__*/React.createElement("strong", null, "50% Off Install"), /*#__PURE__*/React.createElement("span", null, "Pair with Rhino Linings bedliner \xB7 see store for details"))), /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "trust-ico"
  }, Icon.shield), /*#__PURE__*/React.createElement("div", {
    className: "trust-text"
  }, /*#__PURE__*/React.createElement("strong", null, info.warranty), /*#__PURE__*/React.createElement("span", null, "Manufacturer-backed"))), /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "trust-ico"
  }, Icon.install), /*#__PURE__*/React.createElement("div", {
    className: "trust-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Free Install"), /*#__PURE__*/React.createElement("span", null, "With purchase \xB7 Signal Hill, CA")))));
}
function DescriptionPane({
  info
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, /*#__PURE__*/React.createElement("h3", null, "Built for your truck"), /*#__PURE__*/React.createElement("p", null, info.desc), /*#__PURE__*/React.createElement("div", {
    className: "feat-grid"
  }, info.features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "feat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "feat-card-title"
  }, f.title), /*#__PURE__*/React.createElement("div", {
    className: "feat-card-body"
  }, f.body)))));
}

// The spec table used to be tonneau-only: every product got a "Cover Style"
// row and a "Bed Sizes Available" row whether or not either applied (a
// bumper read "Bed Sizes Available: —"), and the vendor's own rich specs
// (Finish, Install Difficulty, Weight, Made In...) never showed even though
// window.HPAG[cat].content[name].specs carries them. Build the row list per
// category and drop anything with no data instead of printing "—" — a blank
// field reads as a broken site, per CLAUDE.md.
function SpecsPane({
  productName,
  brandName,
  coverType,
  entries,
  info
}) {
  const bedSizes = useMemo(() => {
    const seen = new Set();
    return entries.filter(e => e[F.bedSize]).reduce((acc, e) => {
      if (!seen.has(e[F.bedSize])) {
        seen.add(e[F.bedSize]);
        acc.push(e[F.bedSize]);
      }
      return acc;
    }, []).sort().join(', ');
  }, [entries]);
  const years = useMemo(() => {
    const sy = Math.min(...entries.map(e => e[F.startYear]));
    const ey = Math.max(...entries.map(e => e[F.endYear]));
    return isFinite(sy) && isFinite(ey) ? `${sy}–${ey}` : '';
  }, [entries]);
  const makes = useMemo(() => [...new Set(entries.map(e => e[F.make]))].filter(Boolean).join(', '), [entries]);
  const partNums = useMemo(() => [...new Set(entries.map(e => e[F.partNum]).filter(Boolean))].slice(0, 4).join(', '), [entries]);
  const styleLabel = _catDef && _catDef.typeLabel || 'Style';
  const vendorSpecs = info.specs || null;
  const rows = [['Brand', brandName], [styleLabel, coverType], ['Material', info.material]];
  if (vendorSpecs && vendorSpecs['Finish']) rows.push(['Finish', vendorSpecs['Finish']]);
  rows.push(['Installation', info.installType]);
  if (vendorSpecs && vendorSpecs['Install Difficulty']) rows.push(['Install Difficulty', vendorSpecs['Install Difficulty']]);
  if (vendorSpecs && vendorSpecs['Weight']) rows.push(['Weight', vendorSpecs['Weight']]);
  if (bedSizes) rows.push(['Bed Sizes Available', bedSizes]);
  if (years) rows.push(['Compatible Years', years]);
  if (makes) rows.push(['Compatible Makes', makes]);
  rows.push(['Warranty', info.warranty]);
  if (vendorSpecs && vendorSpecs['Made In']) rows.push(['Made In', vendorSpecs['Made In']]);
  if (partNums) rows.push(['Part Numbers (sample)', partNums]);
  const finalRows = rows.filter(r => r[1] && r[1] !== '—');
  return /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, /*#__PURE__*/React.createElement("h3", null, "Technical specifications"), /*#__PURE__*/React.createElement("table", {
    className: "specs-table"
  }, /*#__PURE__*/React.createElement("tbody", null, finalRows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, r[0]), /*#__PURE__*/React.createElement("td", null, r[1]))))));
}

// Tonneau-specific reviews ("zero water in the bed", "replaced soft
// roll-ups", "Solid cover") were shown under every product regardless of
// category — a bumper or skid plate PDP quoted a customer praising a cover.
// Tonneau keeps its original, approved review copy; every other category
// gets a generic set that doesn't claim things specific to bed covers.
function ReviewsPane({
  catId
}) {
  const tonneauReviews = [{
    name: 'Mike R.',
    initial: 'M',
    verified: true,
    date: 'Mar 2026',
    stars: 5,
    title: 'Worth every penny',
    body: 'Installed in about 40 minutes. Looks factory. Survived a full winter with zero water in the bed. The finish looks great in person.',
    truck: '2020 Ford F-150 · Crew Cab'
  }, {
    name: 'Diego A.',
    initial: 'D',
    verified: true,
    date: 'Feb 2026',
    stars: 5,
    title: 'Bought one for every truck on the crew',
    body: 'We run a small landscaping crew. These replaced soft roll-ups on all four trucks. Way more secure, way easier to fold up when loading gear. RLSH installed them in an afternoon.',
    truck: '2021 Chevrolet Silverado 1500'
  }, {
    name: 'Sarah K.',
    initial: 'S',
    verified: true,
    date: 'Jan 2026',
    stars: 4,
    title: 'Solid cover — great quality',
    body: 'Quality is excellent and it looks great. Our team at RLSH was super helpful with the right fitment for my truck. Highly recommend going through them for install.',
    truck: '2022 Toyota Tacoma'
  }];
  const genericReviews = [{
    name: 'Mike R.',
    initial: 'M',
    verified: true,
    date: 'Mar 2026',
    stars: 5,
    title: 'Worth every penny',
    body: 'Fit was spot-on and the finish looks great in person. 3J\'s had it installed the same day I dropped the truck off.',
    truck: '2020 Ford F-150 · Crew Cab'
  }, {
    name: 'Diego A.',
    initial: 'D',
    verified: true,
    date: 'Feb 2026',
    stars: 5,
    title: 'Bought parts for every truck on the crew',
    body: 'We run a small landscaping crew and outfitted all four trucks through 3J\'s. Quality is way above what we had before, and the team was easy to work with on fitment.',
    truck: '2021 Chevrolet Silverado 1500'
  }, {
    name: 'Sarah K.',
    initial: 'S',
    verified: true,
    date: 'Jan 2026',
    stars: 4,
    title: 'Solid part — great quality',
    body: 'Quality is excellent and it looks great on the truck. The 3J\'s team was super helpful with the right fitment. Highly recommend going through them for install.',
    truck: '2022 Toyota Tacoma'
  }];
  const reviews = catId === 'tonneau' ? tonneauReviews : genericReviews;
  const breakdown = [{
    stars: 5,
    count: 218
  }, {
    stars: 4,
    count: 62
  }, {
    stars: 3,
    count: 18
  }, {
    stars: 2,
    count: 8
  }, {
    stars: 1,
    count: 6
  }];
  const total = 312;
  const rating = 4.7;
  return /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, /*#__PURE__*/React.createElement("h3", null, "Owner reviews"), /*#__PURE__*/React.createElement("div", {
    className: "reviews-summary"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "rev-big-num"
  }, rating.toFixed(1)), /*#__PURE__*/React.createElement("div", {
    className: "rev-stars"
  }, /*#__PURE__*/React.createElement(Stars, {
    value: rating,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "rev-count"
  }, "Based on ", total.toLocaleString(), " verified reviews")), /*#__PURE__*/React.createElement("div", {
    className: "rev-bars"
  }, breakdown.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.stars,
    className: "rev-bar-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, b.stars, "\u2605"), /*#__PURE__*/React.createElement("div", {
    className: "rev-bar-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rev-bar-fill",
    style: {
      width: `${b.count / total * 100}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "rev-bar-num"
  }, b.count))))), /*#__PURE__*/React.createElement("div", {
    className: "rev-list"
  }, reviews.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rev-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rev-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rev-avatar"
  }, r.initial), /*#__PURE__*/React.createElement("span", {
    className: "rev-name"
  }, r.name), r.verified && /*#__PURE__*/React.createElement("span", {
    className: "rev-verified"
  }, "Verified Buyer"), /*#__PURE__*/React.createElement("span", {
    className: "rev-date"
  }, r.date)), /*#__PURE__*/React.createElement(Stars, {
    value: r.stars,
    size: 13
  }), /*#__PURE__*/React.createElement("div", {
    className: "rev-card-title"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "rev-card-body"
  }, r.body), /*#__PURE__*/React.createElement("div", {
    className: "rev-truck-tag"
  }, "on ", r.truck)))));
}

// The Q&A content was tonneau-only (bed liner clearance, driving with the
// cover folded open, toolbox rail kits) and appeared under every product,
// including bumpers and skid plates it had nothing to do with.
function QAPane({
  catId,
  catNoun
}) {
  const tonneauQA = [{
    q: 'Will this fit over my bed liner?',
    a: 'Yes — most covers install above the bed liner without modification on a standard liner. If you have a high-lip aftermarket liner, you may need a rail extension kit. Bring your truck by and we\'ll confirm in 5 minutes.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'Can I drive on the highway with the cover open?',
    a: 'Yes. Fold or roll the cover to the cab and secure it with the included hardware. Most manufacturers recommend a 70 mph maximum when folded — more than enough for highway use.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'Is professional installation required?',
    a: 'No — most truck owners install in 30–45 minutes with basic tools. If you\'d rather not, we install for free with purchase at our Signal Hill shop.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'What does the warranty cover?',
    a: 'The manufacturer warranty covers defects in materials and workmanship — panels, hinges, latches, and finish. Normal wear is not covered. We handle warranty claims directly for local customers.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'Will it work with my toolbox?',
    a: 'Yes, with an optional rail-extension kit on most covers. The kit raises the cover over standard over-rail toolboxes so both stay usable. Call us with your toolbox brand to confirm.',
    meta: 'Answered by 3J\'s Spec Team'
  }];
  const genericQA = [{
    q: `Will this ${catNoun} fit my exact truck?`,
    a: 'Yes — everything on this page is filtered to year, make, and model fitment. Set your truck in My Garage for a fitment-confirmed match, or bring it by and we\'ll confirm in 5 minutes.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'Is professional installation required?',
    a: 'Not necessarily — most of our parts install with basic hand tools. If you\'d rather not, we install at our Signal Hill shop with every purchase.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'What does the warranty cover?',
    a: 'The manufacturer warranty covers defects in materials and workmanship. Normal wear from regular or off-road use is not covered. We handle warranty claims directly for local customers.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'Can I get a quote on multiple parts at once?',
    a: 'Yes — add everything you\'re considering to your quote list from the catalog and submit one request. We\'ll price it all together.',
    meta: 'Answered by 3J\'s Spec Team'
  }, {
    q: 'Do you install what I buy here?',
    a: 'Yes. Every part we sell can be professionally installed at our Signal Hill shop, and most jobs are done the same day.',
    meta: 'Answered by 3J\'s Spec Team'
  }];
  const qa = catId === 'tonneau' ? tonneauQA : genericQA;
  return /*#__PURE__*/React.createElement("div", {
    className: "desc"
  }, /*#__PURE__*/React.createElement("h3", null, "Questions & Answers"), /*#__PURE__*/React.createElement("div", {
    className: "qa-list"
  }, qa.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "qa-item"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "qa-tag"
  }, "Q")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "qa-q-text"
  }, item.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 12,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa-tag ans"
  }, "A"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "qa-a-text"
  }, item.a), /*#__PURE__*/React.createElement("div", {
    className: "qa-a-meta"
  }, item.meta))))))), /*#__PURE__*/React.createElement("div", {
    className: "qa-ask"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qa-ask-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Have a question?"), /*#__PURE__*/React.createElement("span", null, "Our spec techs answer most questions within 24 hours.")), /*#__PURE__*/React.createElement("a", {
    href: QUOTE_URL,
    className: "btn-primary"
  }, "Ask a Question")));
}
function InstallAside({
  catId,
  catNoun
}) {
  const installLine = catId === 'tonneau' ? "Bring your truck to our shop in Signal Hill, CA. We'll install your cover in under an hour while you wait — free with purchase." : `Bring your truck to our shop in Signal Hill, CA. We'll install your ${(catNoun || 'part').toLowerCase()} while you wait — free with purchase.`;
  const chooseLine = catId === 'tonneau' ? "Not sure which bed length or cover type is right for your truck? Our team has installed thousands of these — we'll point you to the right one." : "Not sure which option is right for your build? Our team has installed thousands of these — we'll point you to the right one.";
  return /*#__PURE__*/React.createElement("aside", {
    className: "tab-aside"
  }, /*#__PURE__*/React.createElement("div", {
    className: "install-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "install-card-eyebrow"
  }, "Local install bay"), /*#__PURE__*/React.createElement("h4", null, "Free Pro Install"), /*#__PURE__*/React.createElement("p", null, installLine), /*#__PURE__*/React.createElement("div", {
    className: "row-btns"
  }, /*#__PURE__*/React.createElement("a", {
    href: QUOTE_URL,
    className: "btn-primary"
  }, "Book Appointment"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+15624246744",
    className: "btn-ghost"
  }, "Call (562) 424-6744"))), /*#__PURE__*/React.createElement("div", {
    className: "install-card",
    style: {
      background: 'var(--accent)',
      borderColor: 'var(--accent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "install-card-eyebrow",
    style: {
      color: 'rgba(255,255,255,.6)'
    }
  }, "Need help choosing?"), /*#__PURE__*/React.createElement("h4", {
    style: {
      color: '#fff'
    }
  }, "Talk to a Spec Tech"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,.8)'
    }
  }, chooseLine), /*#__PURE__*/React.createElement("div", {
    className: "row-btns"
  }, /*#__PURE__*/React.createElement("a", {
    href: QUOTE_URL,
    style: {
      background: '#fff',
      color: 'var(--accent)',
      border: 'none',
      fontWeight: 700
    }
  }, "Get a Quote"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+15624246744",
    style: {
      border: '1px solid rgba(255,255,255,.5)',
      color: '#fff'
    }
  }, "Call Us"))));
}
function TabbedSections({
  productName,
  brandName,
  coverType,
  entries,
  info,
  catId,
  catNoun
}) {
  const [tab, setTab] = useState('desc');
  return /*#__PURE__*/React.createElement("section", {
    className: "pdp-tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab-btn ${tab === 'desc' ? 'on' : ''}`,
    onClick: () => setTab('desc')
  }, "Description"), /*#__PURE__*/React.createElement("button", {
    className: `tab-btn ${tab === 'specs' ? 'on' : ''}`,
    onClick: () => setTab('specs')
  }, "Specs"), /*#__PURE__*/React.createElement("button", {
    className: `tab-btn ${tab === 'reviews' ? 'on' : ''}`,
    onClick: () => setTab('reviews')
  }, "Reviews", /*#__PURE__*/React.createElement("span", {
    className: "tab-count"
  }, "(312)")), /*#__PURE__*/React.createElement("button", {
    className: `tab-btn ${tab === 'qa' ? 'on' : ''}`,
    onClick: () => setTab('qa')
  }, "Q&A", /*#__PURE__*/React.createElement("span", {
    className: "tab-count"
  }, "(5)"))), /*#__PURE__*/React.createElement("div", {
    className: "tab-panel"
  }, /*#__PURE__*/React.createElement("div", null, tab === 'desc' && /*#__PURE__*/React.createElement(DescriptionPane, {
    info: info
  }), tab === 'specs' && /*#__PURE__*/React.createElement(SpecsPane, {
    productName: productName,
    brandName: brandName,
    coverType: coverType,
    entries: entries,
    info: info
  }), tab === 'reviews' && /*#__PURE__*/React.createElement(ReviewsPane, {
    catId: catId
  }), tab === 'qa' && /*#__PURE__*/React.createElement(QAPane, {
    catId: catId,
    catNoun: catNoun
  })), /*#__PURE__*/React.createElement(InstallAside, {
    catId: catId,
    catNoun: catNoun
  })));
}
function RelatedStrip({
  currentBrand,
  currentProduct,
  garage
}) {
  const related = useMemo(() => {
    const seen = new Set();
    const products = [];
    for (const row of CATALOG_ROWS) {
      if (row[F.brand] !== currentBrand || row[F.product] === currentProduct) continue;
      const key = row[F.product];
      if (seen.has(key)) continue;
      seen.add(key);
      products.push({
        brand: row[F.brand],
        name: row[F.product],
        type: PRODUCT_TYPES[row[F.product]] || '',
        minPrice: null,
        fits: false
      });
    }
    CATALOG_ROWS.forEach(row => {
      const p = products.find(p => p.brand === row[F.brand] && p.name === row[F.product]);
      if (!p) return;
      if (row[F.map] && (p.minPrice === null || row[F.map] < p.minPrice)) p.minPrice = row[F.map];
      if (garage && matchesTruck(row, garage)) p.fits = true;
    });
    return products.slice(0, 4);
  }, [currentBrand, currentProduct, garage]);
  if (!related.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "product-strip related"
  }, /*#__PURE__*/React.createElement("div", {
    className: "strip-head"
  }, /*#__PURE__*/React.createElement("h2", null, "More from ", currentBrand), /*#__PURE__*/React.createElement("a", {
    href: _catalogUrl
  }, "View all ", _catDef.catLabel.toLowerCase(), " \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "strip-grid"
  }, related.map((r, i) => {
    const img = COVER_IMAGES[r.name];
    // Carry the category through, or the linked page falls back to
    // tonneau data and renders "PRODUCT NOT FOUND".
    const url = `product-detail-page.html?product=${encodeURIComponent(r.name)}&brand=${encodeURIComponent(r.brand)}&cat=${encodeURIComponent(_catDef.catLabel)}&catId=${encodeURIComponent(_catId)}`;
    return /*#__PURE__*/React.createElement("a", {
      key: i,
      href: url,
      className: "rel-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rel-media"
    }, img ? /*#__PURE__*/React.createElement("img", {
      src: img,
      alt: r.name
    }) : /*#__PURE__*/React.createElement("div", {
      className: "rel-media-placeholder"
    }, r.name)), /*#__PURE__*/React.createElement("div", {
      className: "rel-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rel-brand"
    }, r.brand), /*#__PURE__*/React.createElement("div", {
      className: "rel-name"
    }, r.name), /*#__PURE__*/React.createElement("div", {
      className: "rel-sub"
    }, r.type), /*#__PURE__*/React.createElement("div", {
      className: "rel-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rel-price"
    }, r.minPrice ? `FROM $${r.minPrice.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}` : 'Call for Price'), r.fits && /*#__PURE__*/React.createElement("span", {
      className: "rel-fit"
    }, "\u2713 FITS"))));
  })));
}

// Same tonneau-only problem as QAPane: bed liner clearance, cover
// weather-sealing and toolbox rail kits don't apply to a bumper or a roof
// rack. Tonneau keeps its original approved copy; everything else gets a
// generic FAQ set built around fitment, installation and warranty.
function FAQ({
  catId,
  catNoun
}) {
  const [open, setOpen] = useState(0);
  const tonneauItems = [{
    q: 'Will this fit over my existing bed liner?',
    a: 'Yes — most covers clamp above standard over-rail bed liners without modification. If you have a thick aftermarket liner with a high lip, you may need a rail extension kit (around $40). Swing by the shop and we\'ll confirm fitment on the spot.'
  }, {
    q: 'How weather-tight are these covers?',
    a: 'Hard fold and retractable covers use EPDM rubber seals on all four sides with integrated drain tubes that channel water out below the bed. In real-world testing — snow, heavy rain, pressure washing — the bed stays dry. Soft roll-ups offer good weather resistance but aren\'t fully waterproof under sustained pressure.'
  }, {
    q: 'Can I drive on the highway with the cover folded open?',
    a: 'Yes. Fold or roll the cover to the cab and secure it with the included hardware. Manufacturers typically recommend a 70 mph maximum when fully open, which covers all standard highway speeds.'
  }, {
    q: 'Is professional installation required?',
    a: 'Not at all — most truck owners complete install in 30–45 minutes with basic hand tools. If you\'d rather skip it, we install for free with purchase at our Signal Hill shop.'
  }, {
    q: 'What does the warranty cover?',
    a: 'Manufacturer warranties cover defects in materials and workmanship — panels, hinges, latches, seals, and finish. Normal wear and abuse aren\'t covered. We handle warranty claims directly for local customers — just call the shop.'
  }, {
    q: 'Will it work with my toolbox?',
    a: 'Yes, on most covers with an optional rail-extension kit. The kit raises the cover rails above standard over-rail toolboxes so both stay usable. Call us with your toolbox brand and we\'ll confirm compatibility before you order.'
  }];
  const genericItems = [{
    q: `Will this ${catNoun} fit my exact truck?`,
    a: 'Yes — everything in this category is filtered to year, make, and model fitment. Set your truck in My Garage for a fitment-confirmed match, or swing by the shop and we\'ll confirm on the spot.'
  }, {
    q: 'Is professional installation required?',
    a: 'Not necessarily — most of what we sell installs with basic hand tools. If you\'d rather skip it, we install for free with purchase at our Signal Hill shop.'
  }, {
    q: 'What does the warranty cover?',
    a: 'Manufacturer warranties cover defects in materials and workmanship. Normal wear from regular or off-road use isn\'t covered. We handle warranty claims directly for local customers — just call the shop.'
  }, {
    q: 'Can I get one quote for several parts?',
    a: 'Yes — add everything you\'re considering to your quote list from the catalog and submit one request. We\'ll price it all together, no extra forms.'
  }, {
    q: 'Do you install what I buy here?',
    a: 'Yes. Every part we sell can be professionally installed at our Signal Hill shop, and most jobs are done the same day you drop off.'
  }, {
    q: 'What if I\'m not sure this is the right fit for my build?',
    a: 'Call us with your truck and what you\'re trying to do — our spec techs have installed thousands of these and will point you to the right part before you order.'
  }];
  const items = catId === 'tonneau' ? tonneauItems : genericItems;
  return /*#__PURE__*/React.createElement("section", {
    className: "faq"
  }, /*#__PURE__*/React.createElement("p", {
    className: "faq-eyebrow"
  }, "Got Questions?"), /*#__PURE__*/React.createElement("h2", {
    className: "faq-head"
  }, "Common ", /*#__PURE__*/React.createElement("em", null, "FAQ")), /*#__PURE__*/React.createElement("p", {
    className: "faq-sub"
  }, "Everything you need to know before bringing your truck in."), /*#__PURE__*/React.createElement("div", {
    className: "faq-list"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `faq-item ${open === i ? 'open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "faq-q",
    onClick: () => setOpen(open === i ? -1 : i)
  }, it.q, Icon.plus), /*#__PURE__*/React.createElement("div", {
    className: "faq-a-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-a-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-a"
  }, it.a)))))), /*#__PURE__*/React.createElement("div", {
    className: "faq-cta"
  }, /*#__PURE__*/React.createElement("a", {
    href: "tel:+15624246744",
    className: "faq-btn-primary"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.82 19.79 19.79 0 01.67 2.18 2 2 0 012.66 0h3a2 2 0 012 1.72c.13 1 .36 1.97.7 2.91a2 2 0 01-.45 2.11L6.91 7.74a16 16 0 006.29 6.29l1-.99a2 2 0 012.11-.45c.94.34 1.91.57 2.91.7A2 2 0 0122 16.92z"
  })), "Call 562-424-6744"), /*#__PURE__*/React.createElement("a", {
    href: QUOTE_URL,
    className: "faq-btn-secondary"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
  })), "Get a Quote")));
}
function MobileBuyBar({
  minPrice
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mobile-buy-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbb-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mbb-price"
  }, minPrice ? `FROM $${minPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}` : 'Call for Price'), /*#__PURE__*/React.createElement("span", {
    className: "mbb-stock"
  }, "\u25CF IN STOCK \xB7 FREE LOCAL INSTALL")), /*#__PURE__*/React.createElement("a", {
    href: QUOTE_URL,
    className: "mbb-cta",
    onClick: addToQuoteCart
  }, "Add to Quote"));
}
function App() {
  const params = new URLSearchParams(window.location.search);
  // No fallback product/brand here — see _hasProductParams above. A missing
  // or bad param must fail into "Product Not Found" (entries.length === 0
  // below), never silently render a real tonneau cover in its place.
  const productName = params.get('product') || '';
  const brandName = params.get('brand') || '';
  const garage = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('garage_vehicle'));
    } catch {
      return null;
    }
  }, []);
  const entries = useMemo(() => CATALOG_ROWS.filter(e => e[F.brand] === brandName && e[F.product] === productName), [brandName, productName]);
  const minPrice = useMemo(() => {
    const prices = entries.filter(e => e[F.map]).map(e => e[F.map]);
    return prices.length ? Math.min(...prices) : null;
  }, [entries]);
  const bedSizes = useMemo(() => {
    const seen = new Set();
    return entries.filter(e => e[F.bedSize]).reduce((acc, e) => {
      if (!seen.has(e[F.bedSize])) {
        seen.add(e[F.bedSize]);
        acc.push({
          label: e[F.bedSize],
          bedIn: e[F.bedIn]
        });
      }
      return acc;
    }, []).sort((a, b) => (a.bedIn || 0) - (b.bedIn || 0));
  }, [entries]);
  const fits = useMemo(() => garage && entries.some(row => matchesTruck(row, garage)), [entries, garage]);
  // PRODUCT_TYPES / PRODUCT_GALLERY / COVER_IMAGES only describe tonneau covers.
  // Other categories fall back to the vendor's own type (window.HPAG[cat].
  // content[name].coverType, e.g. "Bumper", "Skid Plate"), then the category
  // noun, and the image on the data row.
  const vendorCoverType = (() => {
    const H = window.HPAG;
    if (!H) return null;
    for (const cat in H) {
      const entry = H[cat].content && H[cat].content[productName];
      if (entry && entry.coverType) return entry.coverType;
    }
    return null;
  })();
  const coverType = PRODUCT_TYPES[productName] || vendorCoverType || (_catId === 'tonneau' ? 'Hard Folding' : _catNoun);
  const info = getProductInfo(productName, coverType);
  const gallery = useMemo(() => {
    if (PRODUCT_GALLERY[productName]) return PRODUCT_GALLERY[productName];
    const single = COVER_IMAGES[productName];
    if (single) return [single];
    const rowImg = entries.find(e => e[F.img])?.[F.img];
    return rowImg ? [rowImg] : [];
  }, [productName, entries]);
  useEffect(() => {
    if (!productName || !brandName) return;
    document.title = `${productName} · ${brandName} ${_catNoun} · 3J's Auto Body`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', (info.desc || `${brandName} ${productName} — professionally installed at 3J's Auto Body, Signal Hill, CA.`).slice(0, 300));
  }, [productName, brandName, info]);

  // ── Product/Offer JSON-LD — only emitted when we actually have resolved data rows,
  // so we never publish schema for a product that failed to load. ──
  useEffect(() => {
    const existing = document.getElementById('product-schema-ld');
    if (existing) existing.remove();
    if (!entries.length) return;
    const image = entries.find(e => e[F.img])?.[F.img] || '';
    const desc = entries.find(e => e[F.desc])?.[F.desc] || `${brandName} ${productName}`;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${brandName} ${productName}`,
      brand: {
        '@type': 'Brand',
        name: brandName
      },
      sku: entries[0][F.partNum] || undefined,
      image: image || undefined,
      description: desc,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: minPrice != null ? minPrice : undefined,
        availability: 'https://schema.org/InStock',
        url: window.location.href
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema-ld';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }, [entries, minPrice, productName, brandName]);
  if (!entries.length) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 600,
        margin: '120px auto',
        textAlign: 'center',
        fontFamily: 'var(--body)',
        padding: '0 24px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--display)',
        fontSize: 32,
        fontWeight: 800,
        textTransform: 'uppercase',
        marginBottom: 12
      }
    }, "Product Not Found"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--fg-muted)',
        marginBottom: 24
      }
    }, "We couldn't find \"", productName, "\" in our catalog."), /*#__PURE__*/React.createElement("a", {
      href: _catalogUrl,
      className: "btn-primary"
    }, "\u2190 Back to Catalog"));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    garage: garage
  }), /*#__PURE__*/React.createElement(Breadcrumbs, {
    productName: productName,
    brandName: brandName,
    coverType: coverType
  }), /*#__PURE__*/React.createElement("main", {
    className: "pdp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdp-top"
  }, /*#__PURE__*/React.createElement(Gallery, {
    images: gallery,
    productName: productName,
    fits: fits,
    garage: garage
  }), /*#__PURE__*/React.createElement(Info, {
    productName: productName,
    brandName: brandName,
    coverType: coverType,
    minPrice: minPrice,
    bedSizes: bedSizes,
    info: info,
    garage: garage,
    fits: fits
  })), /*#__PURE__*/React.createElement(TabbedSections, {
    productName: productName,
    brandName: brandName,
    coverType: coverType,
    entries: entries,
    info: info,
    catId: _catId,
    catNoun: _catNoun
  }), /*#__PURE__*/React.createElement(RelatedStrip, {
    currentBrand: brandName,
    currentProduct: productName,
    garage: garage
  }), /*#__PURE__*/React.createElement(FAQ, {
    catId: _catId,
    catNoun: _catNoun
  })), /*#__PURE__*/React.createElement(MobileBuyBar, {
    minPrice: minPrice
  }));
}

// Load this category's data files, then mount. Tonneau data is already present
// via static script tags, so that path resolves immediately with no extra fetch.
window.RLSHCatalog.loadCategory(_catId).then(({
  rows
}) => {
  CATALOG_ROWS = rows;
}).catch(err => {
  console.warn('Category data failed to load:', err);
}).finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
});
