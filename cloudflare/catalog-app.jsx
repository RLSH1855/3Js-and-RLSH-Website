const { useState, useMemo, useEffect, useRef } = React;

// ── Garage popup — always on. Add ?nogarage to the URL to suppress (use in Wix editor) ──
const GARAGE_AUTO_OPEN = true;
const _noGarage = new URLSearchParams(window.location.search).has('nogarage');

// ── Field indexes ──
const F = { brand:0, product:1, partNum:2, bedIn:3, bedSize:4, startYear:5, endYear:6, make:7, model:8, desc:9, fitNote:10, map:11, img:12 };

// ── Cover type map ──
const PRODUCT_TYPES = {
  'BAKFlip F1':'Hard Folding','BAKFlip FiberMax':'Hard Folding','BAKFlip G2':'Hard Folding',
  'BAKFlip MX4':'Hard Folding','BAKFlip MX4 TS':'Hard Folding','BAKFlip X4S':'Hard Folding',
  'ArmorFlex':'Hard Folding','Solid Fold 2.0 Toolbox':'Hard Folding','Solid Fold ALX':'Hard Folding',
  'Endure ALX':'Hard Folding','Deuce':'Hard Folding','Sentry':'Hard Folding','Sentry CT':'Hard Folding',
  'Ultra Flex':'Hard Folding',
  'Trifecta 2.0':'Soft Folding','Trifecta ALX':'Soft Folding','Trifecta Signature 2.0':'Soft Folding',
  'Trifecta Toolbox 2.0':'Soft Folding','Trifecta e-Series':'Soft Folding',
  'E-Series':'Soft Folding','E-Series XT':'Soft Folding','M-Series':'Soft Folding','M-Series XT':'Soft Folding',
  'A-Series':'Soft Folding','A-Series XT':'Soft Folding',
  'Elite':'Soft Folding','Elite LX':'Soft Folding','Elite Smooth':'Soft Folding',
  'SE':'Soft Folding','SE Smooth':'Soft Folding',
  'Lo Pro':'Roll-Up','TruXport':'Roll-Up','Lux':'Roll-Up','Fusion':'Roll-Up','Select':'Roll-Up',
  'Flex':'Roll-Up','Roll-X':'Roll-Up','Revolver X2':'Roll-Up','Revolver X4s':'Roll-Up','Revolver X4ts':'Roll-Up',
  'Titanium':'Roll-Up','Element':'Roll-Up','Edge':'Roll-Up',
  'RetraxONE MX':'Retractable','RetraxONE XR':'Retractable','RetraxPRO MX':'Retractable','RetraxPRO XR':'Retractable',
  'PowertraxPRO MX':'Retractable','PowertraxPRO XR':'Retractable','Retrax EQ':'Retractable','Retrax IX':'Retractable',
  'Pro X15':'Retractable','Pro X15 TS':'Retractable',
};

// ── Material lookup ──
const PRODUCT_MATERIAL = {
  'BAKFlip MX4':'Aircraft-grade aluminum','BAKFlip MX4 TS':'Aircraft-grade aluminum',
  'BAKFlip F1':'Fiberglass','BAKFlip FiberMax':'Fiberglass','BAKFlip G2':'Aluminum',
  'BAKFlip X4S':'Aluminum','Revolver X2':'Aluminum slats','Revolver X4s':'Aluminum slats',
  'Revolver X4ts':'Aluminum slats','ArmorFlex':'Aluminum','Solid Fold ALX':'Aluminum',
  'Solid Fold 2.0 Toolbox':'Aluminum','Endure ALX':'Aluminum','Ultra Flex':'Aluminum slats',
  'Deuce':'Aluminum/Vinyl','Sentry':'Aluminum slats','Sentry CT':'Aluminum slats',
  'Trifecta 2.0':'Vinyl/Aluminum frame','Trifecta ALX':'Aluminum-reinforced vinyl',
  'Trifecta Signature 2.0':'TriTex fabric/Aluminum','Trifecta Toolbox 2.0':'Vinyl/Aluminum frame',
  'Trifecta e-Series':'Vinyl/Aluminum frame',
  'Lo Pro':'Vinyl','TruXport':'Vinyl','Lux':'Vinyl','Fusion':'Vinyl','Select':'Vinyl',
  'Flex':'Vinyl','Roll-X':'Aluminum slats','E-Series':'Aluminum',
  'E-Series XT':'Aluminum','A-Series':'Aluminum','A-Series XT':'Aluminum',
  'M-Series':'Aluminum','M-Series XT':'Aluminum',
  'RetraxONE MX':'Aluminum','RetraxONE XR':'Aluminum',
  'RetraxPRO MX':'Polycarbonate','RetraxPRO XR':'Polycarbonate',
  'PowertraxPRO MX':'Polycarbonate','PowertraxPRO XR':'Polycarbonate',
  'Retrax EQ':'Aluminum','Retrax IX':'Polycarbonate',
  'Pro X15':'Aluminum','Pro X15 TS':'Aluminum',
  'Elite':'Fiberglass','Elite LX':'Fiberglass','Elite Smooth':'Fiberglass',
  'SE':'Fiberglass','SE Smooth':'Fiberglass',
};
// ── Warranty lookup ──
const PRODUCT_WARRANTY = {
  'BAKFlip MX4':'5-year limited','BAKFlip MX4 TS':'5-year limited',
  'BAKFlip F1':'5-year limited','BAKFlip FiberMax':'5-year limited',
  'BAKFlip G2':'3-year limited','BAKFlip X4S':'5-year limited',
  'Revolver X2':'5-year limited','Revolver X4s':'5-year limited','Revolver X4ts':'5-year limited',
  'ArmorFlex':'Lifetime limited','Solid Fold ALX':'Lifetime limited',
  'Solid Fold 2.0 Toolbox':'Lifetime limited','Endure ALX':'Lifetime limited',
  'Ultra Flex':'Lifetime limited','Deuce':'Lifetime limited',
  'Sentry':'5-year limited','Sentry CT':'5-year limited',
  'Trifecta 2.0':'Lifetime limited','Trifecta ALX':'Lifetime limited',
  'Trifecta Signature 2.0':'Lifetime limited','Trifecta Toolbox 2.0':'Lifetime limited',
  'Trifecta e-Series':'Lifetime limited',
  'Lo Pro':'5-year limited','TruXport':'5-year limited','Lux':'5-year limited',
  'Fusion':'5-year limited','Select':'5-year limited','Flex':'5-year limited',
  'Roll-X':'3-year limited','E-Series':'Limited lifetime','E-Series XT':'Limited lifetime',
  'A-Series':'Limited lifetime','A-Series XT':'Limited lifetime',
  'M-Series':'Limited lifetime','M-Series XT':'Limited lifetime',
  'RetraxONE MX':'Limited lifetime','RetraxONE XR':'Limited lifetime',
  'RetraxPRO MX':'Limited lifetime','RetraxPRO XR':'Limited lifetime',
  'PowertraxPRO MX':'Limited lifetime','PowertraxPRO XR':'Limited lifetime',
  'Retrax EQ':'Limited lifetime','Retrax IX':'Limited lifetime',
  'Pro X15':'Limited lifetime','Pro X15 TS':'Limited lifetime',
  'Elite':'3-year limited','Elite LX':'3-year limited','Elite Smooth':'3-year limited',
  'SE':'3-year limited','SE Smooth':'3-year limited',
};

// ── Brand bg colors for placeholder ──
// ADD and DV8 had no entry, so their 3 photo-less products (see landmine notes
// in FABLE5_CATALOG_FIX_PROMPT.md) fell through to the plain #181818 default.
const BRAND_BG = {
  'BAK':'#1a1a2e','Extang':'#16213e','Retrax':'#1a2a1a','Roll N Lock':'#2a1a1a','TruXedo':'#1a1a2a','UnderCover':'#201a10',
  'ADD':'#1a1512','DV8':'#12161a',
};

// ── Brand filter labels ──
// Cards stay badged with the short code; the filter list spells the brand out
// so a shopper who doesn't know the abbreviation still recognises it.
const BRAND_FILTER_LABELS = { 'ADD':'Addictive Desert Designs (ADD)' };

// ── Every brand carried anywhere in the catalog, across all 20 categories ──
// James was explicit: the Brand filter must always list every brand the shop
// carries, even in a category that brand doesn't make anything for — showing
// "Extang 0" under Bumpers tells a shopper something true (Extang doesn't make
// off-road bumpers); letting Extang silently vanish from the list reads as a
// broken site. Building the option list from only the current category's
// loaded products can't produce that, because a brand absent from THIS
// category would never appear at all. This is a roster of brand identities,
// not a per-product lookup table, so it isn't the kind of hard-coded map this
// codebase is being swept for — it only needs to grow the day a new brand is
// added to the shop.
const BRAND_UNIVERSE = [
  'ADD','AMP Research','AVS','AlphaRex','Aries','B&W','BAK','BackRack','Baja Designs',
  'Bushwacker','DV8','Diode Dynamics','Extang','Form Lighting','Go Rhino',
  'Husky Liners','KC HiLites','Lund','Morimoto','N-Fab','Oracle Lighting','Retrax',
  'Rigid Industries','Roll N Lock','Smittybilt','Spyder Auto','Stampede','Tonno Pro',
  'TrailFX','TruXedo','UnderCover','Vision X','Westin','XK Glow',
];

// ── Short product descriptions ──
const PRODUCT_DESC = {
  // BAK Tonneaus
  'BAKFlip MX4':           'All-aluminum hard fold with matte black finish. Drain rails, dual-action latches, flush mount.',
  'BAKFlip MX4 TS':        'MX4 with toolbox-compatible clearance. Full aluminum, matte finish, flush mount design.',
  'BAKFlip F1':            'Lightweight fiberglass panels with a sleek low-profile look. One of the most popular hard folds.',
  'BAKFlip FiberMax':      'Fiberglass construction with automotive-grade finish. Maximum strength, ultra-clean look.',
  'BAKFlip G2':            'Aluminum hard tri-fold with integrated pull-strap. Great entry-level hard fold.',
  'BAKFlip X4S':           'Hard folding aluminum with integrated side rails and a sharp low-profile stance.',
  // Extang
  'ArmorFlex':             'Hard folding with ArmorTec matte coating for scratch resistance. Solid aluminum frame.',
  'Solid Fold 2.0 Toolbox':'Hard fold with clearance for underbody toolbox. Aluminum construction, slam-to-lock latches.',
  'Solid Fold ALX':        'All-aluminum hard tri-fold. Aerodynamic low-profile design with EZ-Lock clamps.',
  'Endure ALX':            'One-piece hard cover with aircraft-grade aluminum and powder-coat finish.',
  'Deuce':                 'Innovative two-in-one design — use as a soft fold or convert to hard fold.',
  'Sentry':                'Solid hard folding cover with push-button latch. Matte black, flush mount.',
  'Sentry CT':             'Sentry with carbon texture finish. Sleek, durable, and scratch resistant.',
  'Ultra Flex':            'Hard tri-fold with slotted aluminum slats. Strong, low-profile, easy install.',
  'Trifecta 2.0':          'Snap-on soft tri-fold. Quick removal in under 60 seconds, no tools needed.',
  'Trifecta ALX':          'Aluminum-reinforced soft tri-fold hybrid. More rigid than vinyl, lighter than full aluminum.',
  'Trifecta Signature 2.0':'Premium soft fold with e-coated aluminum frame and TriTex fabric cover.',
  'Trifecta Toolbox 2.0':  'Trifecta soft fold designed for underbody toolbox compatibility.',
  'Trifecta e-Series':     "Updated Trifecta with enhanced weather sealing and snap-on attachment.",
  // TruXedo
  'Lo Pro':                'Ultra-low profile roll-up with a streamlined look that sits nearly flush with the bed rails.',
  'TruXport':              'Economy soft roll-up with weather-resistant seal and buckle-free tension control.',
  'Lux':                   'Premium roll-up with soft vinyl cover and powder-coated aluminum frame.',
  'Fusion':                'Upscale soft roll-up. Premium vinyl with aluminum slats for added rigidity.',
  'Select':                'Affordable soft roll-up. Easy install, easy removal, solid everyday cover.',
  'Flex':                  'Roll-up with TruXedo\'s EasyLock II mounting — no drilling, quick attach clamps.',
  // Roll N Lock
  'Roll-X':                'Heavy-duty roll-up with aluminum slats that lock in any position along the rail.',
  'Revolver X2':           'Hard rolling aluminum slat cover with low-profile design and built-in tailgate seal.',
  'Revolver X4s':          'Aircraft-grade aluminum slats with flush-mount design. Locks at any open position.',
  'Revolver X4ts':         'Revolver X4s with clearance for underbody toolbox. Full aluminum, cam-lock system.',
  'Titanium':              'Premium tri-fold with durable matte black finish. Hinged sections snap in tight.',
  'Element':               'Soft tri-fold with weather-resistant vinyl and aluminum frame reinforcement.',
  'Edge':                  'Snap-on soft fold. Installs in minutes, sleek look, no clamps to tighten.',
  // Retrax
  'RetraxONE MX':          'Retractable with matte-finish aluminum slats. Rolls up smoothly, UV-protected seal.',
  'RetraxONE XR':          'RetraxONE with extended side rails — accommodates over-rail bed accessories.',
  'RetraxPRO MX':          'Premium polycarbonate slat retractable. Strongest non-electric cover in the lineup.',
  'RetraxPRO XR':          'RetraxPRO with extended rail system for bed accessories and toolbox clearance.',
  'PowertraxPRO MX':       'Electric retractable with auto-open/close. No handles, operates by button or key fob.',
  'PowertraxPRO XR':       'Electric retractable with extended rail. Full access with one button press.',
  'Retrax EQ':             'Entry-level retractable with aluminum slats. Clean lines, easy operation.',
  'Retrax IX':             'Impact-resistant polycarbonate slats. Handles heavy loads without denting.',
  'Pro X15':               'Roll N Lock\'s flagship retractable — keyless locking, aluminum construction.',
  'Pro X15 TS':            'Pro X15 retractable with toolbox compatibility. Keyless aluminum roll-up.',
  // UnderCover
  'Ultra Flex':            'Hard tri-fold with slotted aluminum slats. Hinged sections open from any panel.',
  // Running boards / Steps
  'AMP PowerStep':         'Electric running boards — automatically extend when you open the door, retract when you close it.',
  'AMP PowerStep XL':      'Wider XL platform for lifted trucks. Same power-extend/retract system as PowerStep.',
  'AMP PowerStep Xtreme':  'Heavy-duty PowerStep with all-terrain grip pads and weatherproof motor.',
  'BedStep':               'AMP flip-down step integrated into the bumper — hands-free bed access.',
  'BedStep2':              'Side-mounted flip-down bed step. Installs in the wheel well, stays hidden when not in use.',
  // Fender Flares
  'OE Style Fender Flares':'Factory-matched style flare. Paintable to match your truck — looks stock, adds coverage.',
  'Pocket Style Fender Flares':'Bold pocket-rivet look. Adds up to 3.5" of tire coverage on each side.',
  'Flat Style Fender Flares':'Flat edge design for a clean look. Accommodates wider tires without standing out.',
  // Deflectors
  'Aeroskin II':           'Low-profile hood deflector that protects against rock chips with a sleek, painted look.',
  'Bug Deflector':         'Mounted at the front of the hood to divert insects and road debris away from the windshield.',
  'Ventvisor':             'Slim in-channel window vent visor. Lets air in with windows up, keeps rain out.',
  'Ventshade':             'Original OEM-style window vent. Deflects air and rain for all-weather venting.',
  // Headache Racks
  'Headache Rack':         'Full-width rack protects your cab glass and prevents cargo from shifting forward.',
  'Cab Protector':         'Steel cab protector with mounting points for lights and accessories.',
  // Towing
  'Turnoverball Gooseneck Hitch':  'Underbed gooseneck hitch that flips down when not in use — clean, flat bed when empty.',
  '5th Wheel Hitch':               'B&W Companion 5th wheel hitch — mounts in your truck bed for fifth-wheel towing.',
  'Receiver Hitch':                'Bolt-on receiver hitch, engineered for max tongue weight and tow capacity.',
  'Weight Distribution Hitch':     'Levels your load for safer, smoother towing with heavy trailers.',
  'Gooseneck Ball & Safety Chain': 'OEM-matched gooseneck ball kit with dual safety chain rings.',
};

// ── Get short description for a product ──
// The four tonneau styles are the only types the word "cover" belongs on.
// Appending it to everything printed "Bumper cover" under every bumper.
const COVER_TYPES = new Set(['Hard Folding', 'Soft Folding', 'Roll-Up', 'Retractable']);

function getProdDesc(name, type) {
  if (PRODUCT_DESC[name]) return PRODUCT_DESC[name];
  // Vendor-supplied products carry their own selling copy; use its opening
  // sentence as the card tagline.
  const H = window.HPAG;
  if (H) {
    for (const cat in H) {
      const entry = H[cat].content && H[cat].content[name];
      if (entry && entry.desc) {
        const first = entry.desc.split(/(?<=\.)\s+/)[0] || entry.desc;
        return first.length > 110 ? first.slice(0, 107).trimEnd() + '…' : first;
      }
    }
  }
  if (type) return COVER_TYPES.has(type) ? type + ' cover' : type;
  return '';
}

// ── Fitment match ──
const up = s => String(s == null ? '' : s).toUpperCase().trim();

// Suppliers spell the same make several ways — RAM/Ram, DODGE/Dodge, FORD/Ford
// — and the garage picker offers no "Dodge", so a pre-2011 Ram owner selects
// RAM. Group the spellings that name one vehicle family.
const MAKE_FAMILY = { CHEVROLET:'GM', CHEVY:'GM', GMC:'GM', RAM:'RAM', DODGE:'RAM' };
function makeMatches(cm, gm) {
  const c = up(cm), m = up(gm);
  if (c === m) return true;
  const cf = MAKE_FAMILY[c], mf = MAKE_FAMILY[m];
  return !!cf && cf === mf;
}

// Ram-family models that are NOT a 1500/2500/3500 pickup. A pickup owner must
// never be shown these, even if a size token leaks in from the description.
const RAM_NOT_PICKUP = /\b(DAKOTA|DURANGO|PROMASTER|RAMCHARGER|SPRINTER|CHARGER|CHALLENGER|JOURNEY|CARAVAN|NEON|NITRO|DART|MAGNUM|VIPER|HORNET|INTREPID|STRATUS|AVENGER|CALIBER|RAM 50|RAM (1500|2500|3500) VAN|[DWB]\d{3}|CB300|RD200|M3[05]0)\b/;

function sizeTokens(s) {
  const out = [], str = up(s), re = /([A-Z]*)([1-5]500)(?![0-9])/g;
  let m;
  while ((m = re.exec(str))) {
    // A single letter in front means a model code, not a size class — C1500 and
    // K2500 are Chevy/GMC, B2500 is a Dodge van. A longer word in front is just
    // a supplier missing a space ("New Body Style1500 only").
    if (m[1].length === 1) continue;
    if (!m[1].length) { const p = str.charAt(m.index - 1); if (p >= '0' && p <= '9') continue; }
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

// Nameplates that share a name but are different trucks whose parts do not
// interchange. Plain substring matching cannot tell them apart — most Nissan
// rows say only "Titan" — so both sides must agree on the qualifier.
const DISTINCT_NAMEPLATES = [
  { base: /\bTITAN\b/, qualifier: /\bXD\b/ }
];
function nameplateConflict(cmo, gmo) {
  for (let i = 0; i < DISTINCT_NAMEPLATES.length; i++) {
    const d = DISTINCT_NAMEPLATES[i];
    if (!d.base.test(cmo) || !d.base.test(gmo)) continue;
    const want = d.qualifier.test(gmo);
    // A row can name both ("Titan, Titan XD"), so it conflicts only when every
    // alternative it lists disagrees with the garage vehicle.
    const parts = cmo.split(/[,/]|\bAND\b/);
    let ok = false;
    for (let j = 0; j < parts.length && !ok; j++) {
      if (d.base.test(parts[j]) && d.qualifier.test(parts[j]) === want) ok = true;
    }
    if (!ok) return true;
  }
  return false;
}

// Compared uppercased for the same reason makes are: suppliers ship SILVERADO
// 1500, RANGER and TACOMA in caps while the garage picker stores them in title
// case. The hardcoded model literals below must be uppercased to match — leave
// 'Silverado/Sierra' in title case here and Silverado tonneau drops 52 to 21.
function modelMatches(row, garage) {
  const cmo = up(row[F.model]), gmo = up(garage.model);
  if (nameplateConflict(cmo, gmo)) return false;
  const legacy = cmo===gmo || cmo.indexOf(gmo)!==-1 || gmo.indexOf(cmo)!==-1
    || (cmo==='SILVERADO/SIERRA'&&(gmo.indexOf('SILVERADO')!==-1||gmo.indexOf('SIERRA')!==-1))
    || (cmo==='CANYON/COLORADO'&&(gmo==='CANYON'||gmo==='COLORADO'))
    || (cmo==='1500/2500/3500'&&(gmo.indexOf('RAM')!==-1||gmo.indexOf('1500')!==-1||gmo.indexOf('2500')!==-1));
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

// ── Load initial garage from localStorage ──
function loadGarage() {
  try { const s = localStorage.getItem('garage_vehicle'); return s ? JSON.parse(s) : null; } catch(e) { return null; }
}

// ── My Garage hero images ──
const GARAGE_HERO = {
  // Ford
  'Ford|F-150':                       'MY GARAGE IMAGES/F-150 MY GARAGE.webp',
  'Ford|F-150 Lightning':             'MY GARAGE IMAGES/FORD LIGHTNING MY GARAGE.webp',
  'Ford|Super Duty F-250/F-350':      'MY GARAGE IMAGES/F-250 MY GARAGE.webp',
  'Ford|Ranger':                      'MY GARAGE IMAGES/FORD RANGER MY GARAGE.webp',
  'Ford|Maverick':                    'MY GARAGE IMAGES/FORD MAVERICK MY GARAGE.webp',
  // Chevrolet
  'Chevrolet|Silverado 1500':         'MY GARAGE IMAGES/CHEVY SILVERADO 1500 MY GARAGE.webp',
  'Chevrolet|Silverado 2500HD/3500HD':'MY GARAGE IMAGES/CHEVY SILVERADO HD MY GARAGE.webp',
  'Chevrolet|Colorado':               'MY GARAGE IMAGES/CHEVY COLORADO MY GARAGE.webp',
  // GMC
  'GMC|Sierra 1500':                  'MY GARAGE IMAGES/GMC SIRERA 1500 MY GARAGE.webp',
  'GMC|Sierra 2500HD/3500HD':         'MY GARAGE IMAGES/GMC SIRERA 2500 MY GARAGE.webp',
  'GMC|Sierra EV':                    'MY GARAGE IMAGES/GMC EV MY GARAGE.webp',
  'GMC|Canyon':                       'MY GARAGE IMAGES/GMC CANYON MY GARAGE.webp',
  'GMC|Canyon AT4':                   'MY GARAGE IMAGES/GMC CANYON AT4 MY GAGRAGE.webp',
  // RAM
  'RAM|1500':                         'MY GARAGE IMAGES/RAM 1500 MY GARAGE.webp',
  'RAM|1500 TRX':                     'MY GARAGE IMAGES/RAM TRX MY GARAGE.webp',
  'RAM|1500 RHO':                     'MY GARAGE IMAGES/RAM RHO MY GAGRAGE.webp',
  'RAM|2500/3500':                    'MY GARAGE IMAGES/RAM 2500 MY GARAGE.webp',
  // Toyota
  'Toyota|Tacoma':                    'MY GARAGE IMAGES/TOYOTA TACOMA MY GARAGE.webp',
  'Toyota|Tundra':                    'MY GARAGE IMAGES/TOYOTA TUNDRA MY GARAGE.webp',
  'Toyota|Pickup':                    'MY GARAGE IMAGES/TOYOTA PICKUP MY GARAGE.webp',
  'Toyota|T100':                      'MY GARAGE IMAGES/TOYOTA T100 MY GARAGE.webp',
  // Nissan
  'Nissan|Frontier':                  'MY GARAGE IMAGES/NISSAN FRONTIER MY GARAGE.png',
};
function getGarageHero(garage) {
  if (!garage) return null;
  return GARAGE_HERO[`${garage.make}|${garage.model}`] || null;
}

// ── SVG Icons ──
const Icon = {
  search: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></svg>,
  truck:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 6h13v9H1z"/><path d="M14 9h5l3 3v3h-8z"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
  swap:   <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m4 5 2-2 2 2M6 3v6M12 11l-2 2-2-2M10 13V7"/></svg>,
  filter: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h14M5 10h10M8 15h4"/></svg>,
  grid:   <svg viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="3" width="6" height="6"/><rect x="11" y="3" width="6" height="6"/><rect x="3" y="11" width="6" height="6"/><rect x="11" y="11" width="6" height="6"/></svg>,
  list:   <svg viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="4" width="14" height="3"/><rect x="3" y="9" width="14" height="3"/><rect x="3" y="14" width="14" height="3"/></svg>,
  chev:   <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m3 4.5 3 3 3-3"/></svg>,
  x:      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 4 8 8M12 4l-8 8"/></svg>,
  check:  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 8 3.5 3.5L13 5"/></svg>,
  heart:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 16.5s-6-3.7-6-8a3.5 3.5 0 0 1 6-2.5 3.5 3.5 0 0 1 6 2.5c0 4.3-6 8-6 8z"/></svg>,
  bolt:   <svg viewBox="0 0 16 16" fill="currentColor"><path d="M9 1 3 9h4l-1 6 6-8H8z"/></svg>,
  phone:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>,
};

// ── Product image map (one hero image per product name) ──
const PRODUCT_IMAGES = {
  // BAK
  'BAKFlip MX4':              'bak-bakflip-mx4-2016-ford-f150-HERO-IMAGE-08.webp',
  'BAKFlip MX4 TS':           'bak-bakflip-mx4-ts-2024-ford-f150-449339ts-ov-0174-ghost.jpg',
  'BAKFlip F1':               'BAKFlip F1 Hard Folding Tonneau Cover-cover_img.webp',
  'BAKFlip G2':               'bak-g2-cover.webp',
  'BAKFlip FiberMax':         'fibermax-main-image.webp',
  'BAKFlip Fibermax':         'fibermax-main-image.webp',
  'Revolver X4s':             'bak-revolver-x4s.webp',
  'Revolver X2':              'revolver-x2-cover.webp',
  'Revolver X4ts':            'BAK- Revolver X4TS-elevate-2023-10-17-Tundra-181_4.webp',
  'Revolver X4ts Rails':      'BAK- Revolver X4TS-elevate-2023-10-17-Tundra-181_4.webp',
  // Extang
  'Solid Fold ALX':           'extang-solid-fold-alx-2024-toyota-tacoma-88832-ov-037-2.webp',
  'Solid Fold 2.0 Toolbox':   'Extang-solidfold-alx-2021-ford-f150-red-lifestyle-05.webp',
  'Endure ALX':               'extang-solid-fold-alx-2024-toyota-tacoma-88832-ov-037-2.webp',
  'Trifecta 2.0':             'Extang Trifecta 2.0 Soft Folding Tonneau Cover (1).webp',
  'Trifecta ALX':             'cover-image - Extang Trifecta ALX Soft Folding Tonneau Cover (2).webp',
  'Trifecta Signature 2.0':   'cover-image Extang Trifecta Signature 2.0 Soft Folding Tonneau Cover.jpg',
  'Trifecta Toolbox 2.0':     'cover-image Trifecta Toolbox 2.0 (9) (1).webp',
  'Trifecta e-Series':        'cover-image Extang Trifecta E-Series Soft Folding Tonneau Cover (2).webp',
  // Retrax
  'RetraxPRO MX':             'realtruck-retrax-pro-2024-mitsubishi-triton-lifestyle-7182.webp',
  'RetraxPRO XR':             'retraxpro-xr-cover.webp',
  'PowertraxPRO MX':          'retrax-powertraxpro-xr.jpg',
  'PowertraxPRO XR':          'retrax-powertraxpro-xr.jpg',
  'RetraxONE MX':             'retrax-one-mx-2015-toyota-tacoma-red-studio-09.webp',
  'RetraxONE XR':             'retraxone-xr-cover.webp',
  'Retrax EQ':                'retrax-eq-cover.webp',
  'Retrax IX':                'cover-image Retrax IX Manual Retractable Tonneau Cover.webp',
  // Roll N Lock
  'E-Series':                 'roll-n-lock-e-series-2017-ford-f150-black-beach-lifestyle-10.webp',
  'E-Series XT':              'cover-image Roll-N-Lock E-Series XT Electric Retractable Tonneau Cover w T-Slot Rails (21).webp',
  'A-Series':                 'cover-image Roll-N-Lock A-Series Manual Retractable Tonneau Cover.webp',
  'A-Series XT':              'cover-image Roll-N-Lock A-Series Manual Retractable Tonneau Cover.webp',
  'M-Series':                 'cover-image Roll-N-Lock M-Series Manual Retractable Tonneau Cover.jpg',
  'M-Series XT':              'cover-image Roll-N-Lock M-Series XT Manual Retractable Tonneau Cover w T-Slot Rails (14).jpg',
  'Cargo Manager':            'Roll-N-Lock Cargo Manager (1).webp',
  // TruXedo
  'Sentry CT':                'truxedo-sentry-ct-2018-ford-f250-white-moab-lifestyle04.webp',
  'Sentry':                   'cover-image Sentry Hard Roll-Up Tonneau Cover (4).webp',
  'Lo Pro':                   'COVER IMAGE- Lo Pro Soft Roll-Up Tonneau Cover (2).webp',
  'Pro X15':                  '5db701304d588f900bdcccd18b919710.webp',
  'Pro X15 TS':               'Truxedo Pro X15 TS Soft Roll-Up Tonneau Cover w T-Slot Rails (1).webp',
  'TruXport':                 'COVER IMAGE - Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (5).webp',
  'Truxport':                 'COVER IMAGE - Truxedo TruXport (GEN 2) Soft Roll-Up Tonneau Cover (5).webp',
  'Deuce':                    'cover-image Truxedo Deuce Soft Folding Tonneau Cover.webp',
  // UnderCover
  'ArmorFlex':                'undercover-armor-flex-2017-ford-f150-raptor-red-construction-lifestyle-01.webp',
  'Ultra Flex':               'undercover-ultra-flex.webp',
  'Flex':                     'undercover-armor-flex-2017-ford-f150-raptor-red-construction-lifestyle-01.webp',
  'Elite':                    'UnderCover Elite One Piece Tonneau Cover (1).webp',
  'Elite Smooth':             'UnderCover Elite One Piece Tonneau Cover (1).webp',
  'Elite LX':                 'Undercover-Elite LX-Color-matched (1).webp',
  'SE':                       'UnderCover SE One Piece Tonneau Cover (1).webp',
  'SE Smooth':                'UnderCover SE One Piece Tonneau Cover (1).webp',
};

// ── Placeholder image ──
function ProductPlaceholder({ brand, name }) {
  const bg = BRAND_BG[brand] || '#181818';
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%',display:'block'}}>
      <rect width="400" height="300" fill={bg}/>
      <rect width="400" height="300" fill="rgba(255,255,255,.02)"/>
      <rect x="60" y="110" width="280" height="90" fill="rgba(0,0,0,.4)"/>
      <rect x="60" y="110" width="280" height="90" fill="none" stroke="rgba(255,255,255,.07)"/>
      <text x="200" y="148" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif" fontSize="13" fontWeight="700" fill="rgba(255,255,255,.35)" letterSpacing="0.08em" textTransform="uppercase">{brand.toUpperCase()}</text>
      <text x="200" y="170" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="rgba(255,255,255,.2)" letterSpacing="0.12em">{name.toUpperCase().slice(0,26)}</text>
    </svg>
  );
}

// ── Shared catalog module (catalog-categories.js) ──
// Category definitions, schema normalizers and the lazy data loader live
// there so product-detail-page.html reads the exact same definitions.
const { CATEGORY_DEFS, loadDataFiles, safeArr, normRB, normHR } = window.RLSHCatalog;

// ── PDP page map — products with dedicated detail pages ──
const PDP_MAP = {
  'BAKFlip MX4':    'bakflip-mx4.html',
  'BAKFlip G2':     'bakflip-g2.html',
  'BAKFlip MX4 TS': 'bakflip-mx4-ts.html',
  'BAKFlip F1':     'bakflip-f1.html',
  'Revolver X2':    'revolver-x2.html',
  'Revolver X4s':   'revolver-x4s.html',
  'Revolver X4ts':  'revolver-x4ts.html',
};


// The type shown in the sidebar filter. PRODUCT_TYPES only ever covered the
// tonneau covers, so every generated product came through with no type and the
// filter section rendered empty ("BUMPER TYPE" with nothing under it). The
// vendor data carries the real type, so fall back to that.
function productType(name) {
  if (PRODUCT_TYPES[name]) return PRODUCT_TYPES[name];
  const H = window.HPAG;
  if (H) {
    for (const cat in H) {
      const entry = H[cat].content && H[cat].content[name];
      if (entry && entry.coverType) return entry.coverType;
    }
  }
  return '';
}

// Same fallback pattern as productType(): hard-coded map first, then the
// vendor's own specs. PRODUCT_MATERIAL/PRODUCT_WARRANTY only ever covered the
// tonneau lineup, so every ADD/DV8 card printed blank Material/Warranty lines
// even though the vendor data has both (window.HPAG[cat].content[name].specs).
function productMaterial(name) {
  if (PRODUCT_MATERIAL[name]) return PRODUCT_MATERIAL[name];
  const H = window.HPAG;
  if (H) {
    for (const cat in H) {
      const entry = H[cat].content && H[cat].content[name];
      if (entry && entry.specs && entry.specs['Material']) return entry.specs['Material'];
    }
  }
  return '';
}
function productWarranty(name) {
  if (PRODUCT_WARRANTY[name]) return PRODUCT_WARRANTY[name];
  const H = window.HPAG;
  if (H) {
    for (const cat in H) {
      const entry = H[cat].content && H[cat].content[name];
      if (entry && entry.specs && entry.specs['Warranty']) return entry.specs['Warranty'];
    }
  }
  return '';
}

// Build unique product list from raw data rows
function buildProducts(data) {
  const pm = {};
  (data || []).forEach(row => {
    const key = `${row[F.brand]}|${row[F.product]}`;
    if (!pm[key]) pm[key] = { id:key, brand:row[F.brand], name:row[F.product], type:productType(row[F.product]), minPrice:null, fitments:[] };
    if (row[F.map] && (pm[key].minPrice === null || row[F.map] < pm[key].minPrice)) pm[key].minPrice = row[F.map];
    pm[key].fitments.push(row);
  });
  return Object.values(pm);
}

function getUniqueProdCount(data) {
  const s = new Set();
  (data || []).forEach(r => s.add(r[F.brand] + '|' + r[F.product]));
  return s.size;
}

// ── Category tabs ──
function CategoryTabs({ cats, selectedId, onSelect, loading, loadedCount }) {
  const [ddOpen, setDdOpen] = React.useState(false);
  const activeCat = cats.find(c => c.id === selectedId);
  const chevDown = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>;

  const handleSelect = (id) => { onSelect(id); setDdOpen(false); };

  return (
    <nav className="cat-tabs" aria-label="Product categories" style={{position:'relative'}}>
      <p className="cat-tabs-hint">Select a category to view products</p>
      <div className="cat-tabs-inner">
        {cats.map(cat => {
          const isActive = cat.id === selectedId;
          const isLoading = isActive && loading;
          const isEmpty = cat.approxCount === 0;
          const badge = isActive && !loading ? loadedCount : (cat.approxCount || null);
          return (
            <button
              key={cat.id}
              className={`cat-tab ${isActive?'cat-tab-active':''} ${isEmpty?'cat-tab-empty':''}`}
              onClick={() => !isEmpty && handleSelect(cat.id)}
              aria-current={isActive?'page':undefined}
            >
              {cat.name}
              {isLoading
                ? <span className="cat-tab-badge" style={{opacity:0.5}}>…</span>
                : isEmpty
                  ? <span className="cat-tab-soon">Soon</span>
                  : badge ? <span className="cat-tab-badge">{badge}</span> : null
              }
            </button>
          );
        })}
        {/* Mobile: active category button + dropdown */}
        {activeCat && <button className="cat-mob-trigger" onClick={() => setDdOpen(o=>!o)} aria-expanded={ddOpen}>
          {activeCat.name} {chevDown}
        </button>}
      </div>
      {ddOpen && (
        <>
          <div className="cat-dd-backdrop" onClick={() => setDdOpen(false)} />
          <div className="cat-dd">
            {cats.filter(c => c.approxCount !== 0).map(cat => (
              <button key={cat.id} className={`cat-dd-item ${cat.id===selectedId?'cat-dd-active':''}`}
                onClick={() => handleSelect(cat.id)}>
                {cat.name}
                {cat.id===selectedId && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </nav>
  );
}

// ── App ──
function App() {
  const sidebarRef = useRef(null);
  const [garage, setGarageState] = useState(() => loadGarage());
  const [filters, setFilters] = useState({
    brands: new Set(),
    types: new Set(),
    priceMin: 0,
    priceMax: 2500,
    fitOnly: !!loadGarage(),
  });
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [view, setView] = useState(() => localStorage.getItem('catalog_view') || 'grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [garageOpen, setGarageOpen] = useState(() => {
    if (!GARAGE_AUTO_OPEN || _noGarage || loadGarage()) return false;
    try { if (sessionStorage.getItem('catalog_garage_prompted')) return false; } catch(e){}
    return true;
  });
  const [showCount, setShowCount] = useState(8);
  const [selectedCatId, setSelectedCatId] = useState('tonneau');
  const [catLoading, setCatLoading] = useState(false);
  const selectedCat = CATEGORY_DEFS.find(c => c.id === selectedCatId) || CATEGORY_DEFS[0];

  const handleCatChange = (id) => {
    const def = CATEGORY_DEFS.find(c => c.id === id);
    if (!def) return;
    if (!def.files || def.files.length === 0) {
      // Already loaded (e.g. tonneau)
      setSelectedCatId(id);
      setFilters({ brands:new Set(), types:new Set(), priceMin:0, priceMax:2500, fitOnly:!!loadGarage() });
      setShowCount(8); setSort('featured');
      return;
    }
    setCatLoading(true);
    loadDataFiles(def.files).then(() => {
      setSelectedCatId(id);
      setFilters({ brands:new Set(), types:new Set(), priceMin:0, priceMax:2500, fitOnly:!!loadGarage() });
      setShowCount(8); setSort('featured');
      setCatLoading(false);
    });
  };

  // Land on the category the user came from (?cat=<id> from a category
  // page or PDP link) instead of always defaulting to Tonneau Covers.
  // ?q=<terms> pre-fills the search — retired Wix product URLs redirect here,
  // so an old link for "stealth fighter front bumper" lands on those products.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam && catParam !== 'tonneau' && CATEGORY_DEFS.some(c => c.id === catParam)) {
      handleCatChange(catParam);
    }
    const qParam = params.get('q');
    if (qParam) setQuery(qParam);
  }, []);

  const openDetail = (brand, name) => {
    // Products with dedicated PDP pages — go there directly, no garage required
    if (PDP_MAP[name]) {
      window.location.href = PDP_MAP[name];
      return;
    }
    const p = new URLSearchParams({ brand, product: name, cat: selectedCat.catLabel, catId: selectedCat.id, catUrl: 'parts-catalog.html' });
    if (filters.types.size === 1) p.set('type', [...filters.types][0]);
    window.location.href = `product-detail-page.html?${p}`;
  };

  // Reset showCount whenever filters or sort change
  useEffect(() => { setShowCount(8); }, [filters, sort, garage]);

  // Persist view
  useEffect(() => { localStorage.setItem('catalog_view', view); }, [view]);

  // Mouse-wheel over the filter sidebar: scroll the sidebar, and once it hits
  // its top/bottom edge (or has nothing to scroll) pass the wheel through to the
  // page. Without this the sticky, overflow:auto sidebar swallowed the wheel and
  // you had to drag its scrollbar by hand.
  useEffect(() => {
    const sb = sidebarRef.current;
    if (!sb) return;
    const onWheel = (e) => {
      const canScroll = sb.scrollHeight > sb.clientHeight + 1;
      const atTop = sb.scrollTop <= 0;
      const atBottom = Math.ceil(sb.scrollTop + sb.clientHeight) >= sb.scrollHeight;
      const up = e.deltaY < 0, down = e.deltaY > 0;
      if (canScroll && !((down && atBottom) || (up && atTop))) {
        sb.scrollTop += e.deltaY;           // scroll the sidebar itself
      } else {
        window.scrollBy(0, e.deltaY);       // at an edge → scroll the page
      }
      e.preventDefault();
    };
    sb.addEventListener('wheel', onWheel, { passive: false });
    return () => sb.removeEventListener('wheel', onWheel);
  }, []);

  // First-catalog-visit auto-prompt fires at most once per session
  useEffect(() => { if (garageOpen) { try { sessionStorage.setItem('catalog_garage_prompted','1'); } catch(e){} } }, []);

  // Listen for YMM popup submission and update garage state
  useEffect(() => {
    const onYMM = (e) => {
      const { year, make, model } = e.detail;
      const g = { year, make, model, trim:'', bedSize:'', bedIn:null, vin:'' };
      localStorage.setItem('garage_vehicle', JSON.stringify(g));
      setGarageState(g);
      setFilters(f => ({...f, fitOnly:true}));
    };
    window.addEventListener('rlsh:ymm', onYMM);
    return () => window.removeEventListener('rlsh:ymm', onYMM);
  }, []);

  const openGaragePopup = () => setGarageOpen(true);

  // Listen for garage save/clear from iframe
  useEffect(() => {
    const onMsg = (e) => {
      try {
        if (e.data === 'openGarage') { setGarageOpen(true); return; }
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if(data && (data.type === 'openGarage' || data === 'openGarage')) { setGarageOpen(true); return; }
        if(data && data.type === 'garage_saved' && data.vehicle){
          setGarageState(data.vehicle);
          setFilters(f => ({...f, fitOnly:true}));
          setGarageOpen(false);
        }
        if(data && data.type === 'garage_close'){
          setGarageOpen(false);
        }
        if(data && data.type === 'garage_clear'){
          setGarageState(null);
          setFilters(f => ({...f, fitOnly:false}));
          setGarageOpen(false);
        }
      } catch(err){}
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Listen for garage changes from FAB widget (same page) or other tabs
  useEffect(() => {
    const onStorage = (e) => {
      if(e.key !== 'garage_vehicle') return;
      if(e.newValue){
        try{ setGarageState(JSON.parse(e.newValue)); setFilters(f=>({...f,fitOnly:true})); }catch(err){}
      } else {
        setGarageState(null);
        setFilters(f => ({...f, fitOnly:false}));
      }
    };
    const onGarageEvent = (e) => {
      if(e.detail){ setGarageState(e.detail); setFilters(f=>({...f,fitOnly:true})); }
      else { setGarageState(null); setFilters(f=>({...f,fitOnly:false})); }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('garageUpdated', onGarageEvent);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('garageUpdated', onGarageEvent);
    };
  }, []);

  // Build unique product list — recalculates when category or loading state changes
  const allProducts = useMemo(() => {
    if (catLoading) return [];
    return buildProducts(selectedCat.getData ? selectedCat.getData() : []);
  }, [selectedCatId, catLoading]);

  // Brand/type counts.
  // Brand counts start from the FULL brand universe (every brand=0), not just
  // the brands present in this category, so the sidebar always lists every
  // brand the shop carries — a brand that makes nothing in this category
  // still shows, at 0, rather than disappearing. See BRAND_UNIVERSE above.
  const brandCounts = useMemo(() => {
    const c = {};
    BRAND_UNIVERSE.forEach(b => { c[b] = 0; });
    allProducts.forEach(p => { c[p.brand] = (c[p.brand]||0)+1; });
    return c;
  }, [allProducts]);

  const typeCounts = useMemo(() => {
    const c = {};
    allProducts.forEach(p => { if(p.type) c[p.type] = (c[p.type]||0)+1; });
    return c;
  }, [allProducts]);

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let list = allProducts.map(p => {
      const matchRow = garage ? p.fitments.find(row => matchesTruck(row, garage)) : null;
      return {
        ...p,
        fits: !!matchRow,
        partNum: matchRow ? matchRow[F.partNum] : (p.fitments.length === 1 ? p.fitments[0][F.partNum] : '')
      };
    });
    // Free-text search across name, brand, type and part number. Every term
    // must match somewhere, so "stealth fighter front" narrows properly.
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length) {
      list = list.filter(p => {
        const hay = `${p.brand} ${p.name} ${p.type || ''} ${
          p.fitments.map(r => `${r[F.partNum]} ${r[F.make]} ${r[F.model]}`).join(' ')}`.toLowerCase();
        return terms.every(t => hay.includes(t));
      });
    }
    if (filters.brands.size) list = list.filter(p => filters.brands.has(p.brand));
    if (filters.types.size) list = list.filter(p => filters.types.has(p.type));
    list = list.filter(p => p.minPrice === null || (p.minPrice >= filters.priceMin && p.minPrice <= filters.priceMax));
    if (filters.fitOnly && garage) list = list.filter(p => p.fits);
    if (sort === 'price-asc') list.sort((a,b) => (a.minPrice||9999)-(b.minPrice||9999));
    else if (sort === 'price-desc') list.sort((a,b) => (b.minPrice||0)-(a.minPrice||0));
    else if (sort === 'brand') list.sort((a,b) => a.brand.localeCompare(b.brand));
    else list.sort((a,b) => (b.fits?1:0)-(a.fits?1:0));
    return list;
  }, [allProducts, filters, sort, garage, query]);

  // ── Page <title> and meta description — these were hard-coded in the HTML
  // head as "Tonneau Covers", so every one of the 20 categories showed the
  // same tonneau title/description in the tab, in search results, and in
  // link previews. Now they follow whichever category is selected. ──
  useEffect(() => {
    if (catLoading) return;
    document.title = `${selectedCat.name} — RLSH Truck & Jeep Outfitters · Signal Hill, CA`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', `${selectedCat.heroSub || selectedCat.heroTitle} Professionally installed at 3J's Auto Body, Signal Hill, CA.`);
  }, [selectedCatId, catLoading, selectedCat]);

  // ── ItemList JSON-LD for the current grid — regenerated on category/filter change,
  // capped so payload stays reasonable. Only emitted once real product data has loaded. ──
  useEffect(() => {
    const existing = document.getElementById('catalog-schema-ld');
    if (existing) existing.remove();
    if (catLoading || !filtered.length) return;
    const items = filtered.slice(0, 24).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: `${p.brand} ${p.name}`,
        brand: { '@type': 'Brand', name: p.brand },
        image: (p.fitments.find(row => row[F.img])||[])[F.img] || undefined,
        offers: p.minPrice != null ? { '@type': 'Offer', priceCurrency: 'USD', price: p.minPrice, availability: 'https://schema.org/InStock' } : undefined,
      },
    }));
    const schema = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'catalog-schema-ld';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }, [filtered, catLoading]);

  const toggleSet = (key, val) => setFilters(f => {
    const next = new Set(f[key]); next.has(val) ? next.delete(val) : next.add(val);
    return { ...f, [key]: next };
  });

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.fitOnly && garage) chips.push({ id:'fit', label:`Fits ${garage.year} ${garage.make} ${garage.model}`, onRemove:()=>setFilters(f=>({...f,fitOnly:false})) });
    filters.brands.forEach(b => chips.push({ id:'b-'+b, label:b, onRemove:()=>toggleSet('brands',b) }));
    filters.types.forEach(t => chips.push({ id:'t-'+t, label:t, onRemove:()=>toggleSet('types',t) }));
    if (filters.priceMin>0||filters.priceMax<2500) chips.push({ id:'price', label:`$${filters.priceMin}–$${filters.priceMax}`, onRemove:()=>setFilters(f=>({...f,priceMin:0,priceMax:2500})) });
    return chips;
  }, [filters, garage]);

  const clearAll = () => setFilters({ brands:new Set(), types:new Set(), priceMin:0, priceMax:2500, fitOnly:false });

  const setGarage = (g) => {
    setGarageState(g);
    if (g) { localStorage.setItem('garage_vehicle', JSON.stringify(g)); setFilters(f=>({...f,fitOnly:true})); }
    else { localStorage.removeItem('garage_vehicle'); setFilters(f=>({...f,fitOnly:false})); }
  };

  return (
    <div className="app">
      <Header garage={garage} onSwapVehicle={openGaragePopup} catDef={selectedCat} query={query} setQuery={setQuery} />
      <MobileVehicleBar garage={garage} onSwap={openGaragePopup} />
      <HeroBanner garage={garage} onSwapVehicle={openGaragePopup} catDef={selectedCat} />
      <CategoryTabs cats={CATEGORY_DEFS} selectedId={selectedCatId} onSelect={handleCatChange} loading={catLoading} loadedCount={allProducts.length} />
      <Breadcrumbs catLabel={selectedCat.catLabel} />

      <main className="catalog">
        <MobileBar count={filtered.length} onOpenFilters={() => setDrawerOpen(true)} sort={sort} setSort={setSort} />

        {activeChips.length > 0 &&
          <div className="chip-rail">
            {activeChips.map(c =>
              <button key={c.id} className="chip-pill" onClick={c.onRemove}>
                <span>{c.label}</span>
                <span className="chip-x">{Icon.x}</span>
              </button>
            )}
            <button className="chip-clear" onClick={clearAll}>Clear all</button>
          </div>
        }

        <div className="layout layout-sidebar">
          <aside className="sidebar" ref={sidebarRef}>
            <FilterPanel filters={filters} setFilters={setFilters} toggleSet={toggleSet} garage={garage} onSwapVehicle={openGaragePopup} brandCounts={brandCounts} typeCounts={typeCounts} catDef={selectedCat} />
          </aside>
          <section className="results">
            <Toolbar count={filtered.length} sort={sort} setSort={setSort} view={view} setView={setView} garage={garage} catLabel={selectedCat.catLabel} />
            {filtered.length === 0
              ? (catLoading
    ? <div className="empty"><h3>Loading {selectedCat.name}…</h3><p>Fetching product data, just a moment.</p></div>
    : <div className="empty"><h3>No {selectedCat.name} match those filters</h3><p>Try removing a filter or expanding the price range.</p><button className="btn-primary" onClick={clearAll}>Clear all filters</button></div>
  )
              : <>
                  {view === 'grid'
                    ? <div className="grid">{filtered.slice(0, showCount).map((p) => <ProductCard key={p.id} p={p} onOpenDetail={openDetail} />)}</div>
                    : <div className="list">{filtered.slice(0, showCount).map((p) => <ProductRow key={p.id} p={p} garage={garage} onOpenDetail={openDetail} />)}</div>
                  }
                  {filtered.length > showCount && (
                    <div className="show-more-wrap">
                      <button className="show-more-btn" onClick={() => setShowCount(c => c + 8)}>
                        Show more <span className="show-more-count">({filtered.length - showCount} remaining)</span>
                      </button>
                    </div>
                  )}
                </>
            }
          </section>
        </div>
      </main>


      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <FilterPanel filters={filters} setFilters={setFilters} toggleSet={toggleSet} garage={garage} onSwapVehicle={()=>{setDrawerOpen(false);openGaragePopup();}} brandCounts={brandCounts} typeCounts={typeCounts} catDef={selectedCat} mobile />
      </FilterDrawer>

      {garageOpen && <GaragePopup onClose={() => setGarageOpen(false)} onClear={() => { setGarage(null); setGarageOpen(false); }} hasVehicle={!!garage} />}
    </div>
  );
}

// ── Garage Popup ──
function GaragePopup({ onClose, onClear, hasVehicle }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  // Rendered through a portal on document.body. The catalog app lives inside
  // site-shell's #ss-page-wrap, which sets z-index:5 and therefore creates a
  // stacking context — so the popup's own z-index:1400 could never beat the
  // fixed site header (z 1000) while nested there. That left the close button
  // sitting underneath the header, where clicks hit the nav's garage link
  // instead of closing. Portalling to body puts it in the root stacking
  // context, where 1400 wins as intended.
  return ReactDOM.createPortal(
    <div className="garage-popup-root">
      <div className="garage-popup-backdrop" onClick={onClose} />
      <div className="garage-popup-card">
        <button className="garage-popup-close" onClick={onClose} aria-label="Close">✕</button>
        <iframe
          className="garage-popup-iframe"
          src="my-garage-v2.html"
          title="My Garage"
        />
        <div className="garage-popup-footer">
          <button className="garage-popup-skip" onClick={onClose}>Skip for now</button>
          {hasVehicle && <button className="garage-popup-clear" onClick={onClear}>Remove Vehicle</button>}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Product Detail Popup ──

// ── Header ──
function Header({ garage, onSwapVehicle, catDef, query, setQuery }) {
  const searchHint = `Search ${(catDef && catDef.noun) || 'parts'}, brands…`;
  // These inputs were placeholder-only until now — typing in them did nothing.
  const searchProps = {
    value: query,
    onChange: e => setQuery(e.target.value),
    'aria-label': searchHint,
  };
  const vehicleLabel = garage ? `${garage.year} ${garage.make} ${garage.model}` : 'Set your truck';
  const mobBtnLabel = garage ? `${garage.year} ${garage.model}` : 'My Truck';
  return (
    <header className="hdr">
      <div className="hdr-promo">
        <div className="hdr-ticker">
          {Array.from({length:12},(_,i) => (
            <span key={i} className="hdr-ticker-item" aria-hidden={i>0||undefined}>
              <span className="bolt">{Icon.bolt}</span>
              <span>Free estimates · Professional installation · Signal Hill, CA</span>
              <span style={{opacity:.4}}>·</span>
              <a href="tel:5624246744" style={{color:'#fff'}}>(562) 424-6744</a>
            </span>
          ))}
        </div>
      </div>
      <div className="hdr-main">
        <div className="search">
          <span className="search-ico">{Icon.search}</span>
          <input placeholder={searchHint} {...searchProps} />
        </div>
      </div>
      <div className="mob-search-row">
        {Icon.search}
        <input placeholder={searchHint} {...searchProps} />
      </div>
    </header>
  );
}

// ── Mobile Vehicle Bar ──
function MobileVehicleBar({ garage, onSwap }) {
  const chevDown = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>;
  const truckIco = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 6h13v9H1z"/><path d="M14 9h5l3 3v3h-8z"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
  return (
    <div className={`mob-vehicle-bar ${garage ? 'has-vehicle' : 'no-vehicle'}`} onClick={onSwap}>
      <span className="mvb-ico">{truckIco}</span>
      <span className="mvb-label">{garage ? `${garage.year} ${garage.make} ${garage.model}` : 'Add Your Vehicle'}</span>
      <span className="mvb-chev">{chevDown}</span>
    </div>
  );
}

// ── Hero Banner ──
function HeroBanner({ garage, onSwapVehicle, catDef }) {
  const kicker = garage ? `${garage.year} ${garage.make.toUpperCase()} ${garage.model.toUpperCase()}` : 'SIGNAL HILL, CA';
  const title = catDef ? catDef.heroTitle : 'Bed Covers';
  const sub = catDef ? catDef.heroSub : 'Locked-in fitment for your truck. We show you covers that bolt on — nothing else.';
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker" style={{color:'#fff',fontFamily:'Montserrat',fontWeight:'600'}}>{kicker}</div>
          <h1 style={{color:'#fff'}}>{title}</h1>
          <p>{sub}</p>
          <div className="hero-cta">
            <a href="tel:5624246744" className="btn-primary" style={{fontFamily:'Montserrat',fontSize:'11px'}}>Call for a quote</a>
            <button className="btn-ghost" onClick={onSwapVehicle} style={{fontFamily:'Montserrat',fontSize:'11px',color:'#fff',borderColor:'rgba(255,255,255,.25)'}}>
              {garage ? 'Change vehicle' : 'Set my truck'}
            </button>
          </div>
        </div>
        <div className="hero-art">
          {(() => {
            const heroImg = getGarageHero(garage);
            return heroImg
              ? <img src={heroImg} alt={`${garage.year} ${garage.make} ${garage.model}`} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block'}}/>
              : <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%',display:'block'}}>
                  <defs>
                    <linearGradient id="hero-g" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="#1a1a1e"/>
                      <stop offset="1" stopColor="#2a2826"/>
                    </linearGradient>
                    <pattern id="hero-hatch" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M0 40L40 0M-10 10L10 -10M30 50L50 30" stroke="rgba(255,255,255,.04)" strokeWidth="1" fill="none"/>
                    </pattern>
                  </defs>
                  <rect width="600" height="360" fill="url(#hero-g)"/>
                  <rect width="600" height="360" fill="url(#hero-hatch)"/>
                  {[0,1,2,3,4,5].map(i =>
                    <path key={i} d={`M0 ${60+i*50} Q 200 ${30+i*50} 400 ${80+i*50} T 800 ${50+i*50}`} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
                  )}
                  <text x="50%" y="50%" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="11" fill="rgba(255,255,255,.4)" letterSpacing="0.2em">[ SET YOUR TRUCK ]</text>
                </svg>;
          })()}
          {garage && <div className="hero-tag">FITS YOUR TRUCK</div>}
        </div>
      </div>
    </section>
  );
}

// ── Breadcrumbs ──
function Breadcrumbs({ catLabel }) {
  return (
    <nav className="crumbs">
      <a href="/">Home</a>
      <span className="crumb-sep">/</span>
      <a href="exterior-accessories-V2.html">Parts &amp; Accessories</a>
      <span className="crumb-sep">/</span>
      <span className="crumb-now">{catLabel || 'Tonneau Covers'}</span>
    </nav>
  );
}

// ── Mobile bar ──
function MobileBar({ count, onOpenFilters, sort, setSort }) {
  const chevDown = <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>;
  return (
    <div className="mobile-bar">
      <button className="mb-filters" onClick={onOpenFilters}>
        <span>{Icon.filter}</span>
        <span>Filters</span>
      </button>
      <div className="mb-sort-wrap">
        <span className="mb-sort-label">Sort by</span>
        <span className="mb-sort-chev">{chevDown}</span>
        <select className="mb-sort" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="brand">Brand A–Z</option>
        </select>
      </div>
    </div>
  );
}

// ── Mobile Garage Tab ──
// ── Filter Panel ──
function FilterPanel({ filters, setFilters, toggleSet, garage, onSwapVehicle, brandCounts, typeCounts, mobile, catDef }) {
  const typeLabel = (catDef && catDef.typeLabel) || 'Product Type';
  const noun = (catDef && catDef.noun) || 'parts';
  return (
    <div className="filter-panel">
      <GarageWidget garage={garage} onSwap={onSwapVehicle} />

      <div className="fit-banner">
        <div className="fit-banner-label">Showing parts for</div>
        <div className="fit-banner-vehicle">{garage ? `${garage.year} ${garage.make} ${garage.model}` : <span style={{fontSize:13,fontWeight:500,fontFamily:'Inter',textTransform:'none',color:'var(--fg-muted)'}}>No vehicle set</span>}</div>
        <label className="fit-toggle">
          <input type="checkbox" checked={filters.fitOnly && !!garage} disabled={!garage} onChange={e => setFilters(f=>({...f,fitOnly:e.target.checked&&!!garage}))} />
          <span className="fit-toggle-track"><span className="fit-toggle-thumb"/></span>
          <span>Only show {noun} that fit</span>
        </label>
      </div>

      <FilterSection title="Brand" defaultOpen>
        {Object.keys(brandCounts).sort().map(b =>
          <CheckRow key={b} label={BRAND_FILTER_LABELS[b] || b} count={brandCounts[b]} checked={filters.brands.has(b)} onChange={() => toggleSet('brands', b)} disabled={brandCounts[b] === 0} />
        )}
      </FilterSection>

      <FilterSection title={typeLabel} defaultOpen>
        {Object.keys(typeCounts).sort().map(t =>
          <CheckRow key={t} label={t} count={typeCounts[t]} checked={filters.types.has(t)} onChange={() => toggleSet('types', t)} disabled={typeCounts[t] === 0} />
        )}
      </FilterSection>

      <FilterSection title="Price" defaultOpen>
        <PriceRange filters={filters} setFilters={setFilters} />
      </FilterSection>

      {mobile &&
        <div className="drawer-footer">
          <button className="btn-ghost" onClick={() => setFilters({ brands:new Set(), types:new Set(), priceMin:0, priceMax:2500, fitOnly:!!garage })}>Clear</button>
          <button className="btn-primary">Show results</button>
        </div>
      }
    </div>
  );
}

function FilterSection({ title, defaultOpen=false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`filter-section ${open?'open':''}`}>
      <button className="filter-section-head" onClick={() => setOpen(o=>!o)}>
        <span>{title}</span>
        <span className="filter-section-chev">{Icon.chev}</span>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}

// Zero-count rows stay visible and legible — James was explicit that a
// silently-vanished option reads as a broken site, but a visible "0" reads as
// an answer. They're just not selectable, since there's nothing to filter to.
function CheckRow({ label, count, checked, onChange, disabled }) {
  return (
    <label className={`check-row ${disabled ? 'check-row-zero' : ''}`} style={disabled ? {opacity:0.6, cursor:'default'} : undefined}>
      <input type="checkbox" checked={!!checked} onChange={onChange} disabled={!!disabled} />
      <span className="check-box"><span className="check-mark">{Icon.check}</span></span>
      <span className="check-label">{label}</span>
      {count != null && <span className="check-count">{count}</span>}
    </label>
  );
}

function PriceRange({ filters, setFilters }) {
  const max = 2500;
  const lo = filters.priceMin, hi = filters.priceMax;
  return (
    <div className="price-range">
      <div className="price-inputs">
        <label><span>Min</span><input type="number" value={lo} onChange={e => setFilters(f=>({...f,priceMin:+e.target.value||0}))}/></label>
        <label><span>Max</span><input type="number" value={hi} onChange={e => setFilters(f=>({...f,priceMax:+e.target.value||max}))}/></label>
      </div>
      <div className="price-slider">
        <div className="price-track">
          <div className="price-track-fill" style={{left:`${lo/max*100}%`,right:`${100-hi/max*100}%`}}/>
        </div>
        <input type="range" min={0} max={max} step={50} value={lo} onChange={e => setFilters(f=>({...f,priceMin:Math.min(+e.target.value,f.priceMax-50)}))}/>
        <input type="range" min={0} max={max} step={50} value={hi} onChange={e => setFilters(f=>({...f,priceMax:Math.max(+e.target.value,f.priceMin+50)}))}/>
      </div>
      <div className="price-legend"><span>${lo}</span><span>${hi}{hi>=max?'+':''}</span></div>
    </div>
  );
}

// ── Toolbar ──
function Toolbar({ count, sort, setSort, view, setView, garage, catLabel }) {
  // "covers" was hardcoded, so Tool Boxes and Lighting read "0 covers fit your…"
  const plural = (catLabel || 'products').toLowerCase();
  const noun = count === 1 ? plural.replace(/ies$/, 'y').replace(/s$/, '') : plural;
  const verb = count === 1 ? 'fits' : 'fit';
  const forTruck = `${noun} ${verb} your ${garage ? `${garage.year} ${garage.make} ${garage.model}` : ''}`;
  const label = garage ? `${count} ${forTruck}` : `${count} products`;
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="tb-count" dangerouslySetInnerHTML={{__html:`<strong>${count}</strong> ${garage ? forTruck : 'products'}`}} />
      </div>
      <div className="toolbar-right">
        <div className="tb-view">
          <button className={view==='grid'?'on':''} onClick={() => setView('grid')} aria-label="Grid">{Icon.grid}</button>
          <button className={view==='list'?'on':''} onClick={() => setView('list')} aria-label="List">{Icon.list}</button>
        </div>
        <div className="tb-sort">
          <span>Sort by</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="brand">Brand A–Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ──
// Card image: prefer the curated PRODUCT_IMAGES map, otherwise fall back to the
// first fitment row that carries an image. Spaces (e.g. ".../RealTruck Inc/...")
// are encoded so the URL actually resolves instead of showing a placeholder.
function cardImage(p) {
  var raw = PRODUCT_IMAGES[p.name] || ((p.fitments || []).find(function(row){ return row[F.img]; }) || [])[F.img];
  return raw ? raw.replace(/ /g, '%20') : null;
}

function ProductCard({ p, onOpenDetail }) {
  const imgSrc = cardImage(p);
  const quoteUrl = `parts-quote.html?product=${encodeURIComponent(p.brand + ' ' + p.name)}${p.partNum ? '&partNum=' + encodeURIComponent(p.partNum) : ''}`;
  const desc = getProdDesc(p.name, p.type);
  const material = productMaterial(p.name);
  const warranty = productWarranty(p.name);
  return (
    <div className="card" onClick={() => onOpenDetail(p.brand, p.name)}>
      <div className="card-img">
        {imgSrc
          ? <img src={imgSrc} alt={p.name} loading="lazy" />
          : <ProductPlaceholder brand={p.brand} name={p.name} />}
        <span className="card-badge">{p.brand}</span>
      </div>
      <div className="card-info">
        <div className="card-cols">
          <div className="card-left">
            <div className="card-name">{p.name}</div>
            {desc && <p className="card-tagline">{desc}</p>}
          </div>
          <div className="card-specs">
            {p.type && <div><span className="spec-label">Type</span><span className="spec-val">{p.type}</span></div>}
            {material && <div><span className="spec-label">Material</span><span className="spec-val">{material}</span></div>}
            {warranty && <div><span className="spec-label">Warranty</span><span className="spec-val">{warranty}</span></div>}
            {p.minPrice && <div><span className="spec-label">Starting at</span><span className="spec-val">${p.minPrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</span></div>}
          </div>
        </div>
        {p.fits && (
          <div className="card-fit-row">
            <div className="card-fit-check">
              <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3"/></svg>
            </div>
            <div className="card-fit-main">Fits your truck</div>
          </div>
        )}
        <div className="card-cta-wrap">
          <button className="card-cta" onClick={e=>{e.stopPropagation();if(window.RLSHQuoteCart){window.RLSHQuoteCart.add({brand:p.brand,product:p.brand+' '+p.name,partNum:p.partNum||''});}else{window.location=quoteUrl;}}}>Add to Quote</button>
        </div>
      </div>
    </div>
  );
}

// ── Product Row ──
function ProductRow({ p, garage, onOpenDetail }) {
  const quoteUrl = `parts-quote.html?product=${encodeURIComponent(p.brand + ' ' + p.name)}${p.partNum ? '&partNum=' + encodeURIComponent(p.partNum) : ''}`;
  return (
    <div className="row" onClick={() => onOpenDetail(p.brand, p.name)} style={{cursor:'pointer'}}>
      <div className="row-media">{cardImage(p) ? <img src={cardImage(p)} alt={p.name} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /> : <ProductPlaceholder brand={p.brand} name={p.name} />}</div>
      <div className="row-body">
        <div className="card-brand-label">{p.brand}</div>
        <div className="row-name">{p.name}</div>
        <div className="row-sub">{p.type}</div>
        {p.fits && garage && <div className="row-fit">{Icon.check} Fits your {garage.year} {garage.make} {garage.model}</div>}
      </div>
      <div className="row-side">
        <span className="card-price">{p.minPrice ? `Starting at $${p.minPrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}` : '—'}</span>
        <button className="row-cta" onClick={e=>{e.stopPropagation();if(window.RLSHQuoteCart){window.RLSHQuoteCart.add({brand:p.brand,product:p.brand+' '+p.name,partNum:p.partNum||''});}else{window.location=quoteUrl;}}}>Add to quote</button>
      </div>
    </div>
  );
}

// ── Garage Widget (sidebar) ──
function GarageWidget({ garage, onSwap }) {
  return (
    <div className="garage-widget" onClick={onSwap} style={{cursor:'pointer'}}>
      <div className="garage-widget-ico">{Icon.truck}</div>
      <div className="garage-widget-text">
        <div className="garage-widget-label">My Garage</div>
        <div className="garage-widget-vehicle">{garage ? `${garage.year} ${garage.make} ${garage.model}` : 'No vehicle set'}</div>
      </div>
      <span className="garage-widget-swap" aria-hidden="true">{Icon.swap}</span>
    </div>
  );
}

// ── Filter Drawer ──
function FilterDrawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="drawer-root">
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="drawer">
        <div className="drawer-head">
          <h3>Filters</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close">{Icon.x}</button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  );
}

// ── Garage Modal ──
function GarageModal({ open, onClose, garage, setGarage }) {
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selYear, setSelYear] = useState('');
  const [selMake, setSelMake] = useState('');
  const [selModel, setSelModel] = useState('');

  useEffect(() => {
    const y = {};
    CATALOG.forEach(r => { for (let i=r[F.startYear];i<=r[F.endYear];i++) y[i]=true; });
    setYears(Object.keys(y).map(Number).sort((a,b)=>b-a));
  }, []);

  useEffect(() => {
    if (!selYear) { setMakes([]); setSelMake(''); setModels([]); setSelModel(''); return; }
    const yr = parseInt(selYear);
    const m = {};
    CATALOG.forEach(r => { if (yr>=r[F.startYear]&&yr<=r[F.endYear]) m[r[F.make]]=true; });
    setMakes(Object.keys(m).sort());
    setSelMake(''); setModels([]); setSelModel('');
  }, [selYear]);

  useEffect(() => {
    if (!selMake) { setModels([]); setSelModel(''); return; }
    const yr = parseInt(selYear);
    const m = {};
    CATALOG.forEach(r => { if (yr>=r[F.startYear]&&yr<=r[F.endYear]&&r[F.make]===selMake) m[r[F.model]]=true; });
    setModels(Object.keys(m).sort());
    setSelModel('');
  }, [selMake]);

  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const apply = () => {
    if (!selYear||!selMake||!selModel) { alert('Please select Year, Make, and Model.'); return; }
    setGarage({ year:selYear, make:selMake, model:selModel, trim:'', bedSize:'', bedIn:null, vin:'' });
    onClose();
  };

  if (!open) return null;
  return (
    <div className="drawer-root">
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="garage-modal">
        <div className="drawer-head">
          <h3>My Garage</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close">{Icon.x}</button>
        </div>
        <div className="garage-body">
          {garage && (
            <div className="garage-current">
              <div className="garage-current-ico">{Icon.truck}</div>
              <div>
                <div className="garage-current-label">Current vehicle</div>
                <div className="garage-current-vehicle">{garage.year} {garage.make} {garage.model}</div>
                {garage.trim && <div className="garage-current-trim">{garage.trim}</div>}
              </div>
              <button className="btn-ghost garage-remove" onClick={() => { setGarage(null); onClose(); }}>Remove</button>
            </div>
          )}
          <div className="garage-section-title">Select your truck</div>
          <div className="garage-selects">
            <select value={selYear} onChange={e=>setSelYear(e.target.value)}>
              <option value="">Year</option>
              {years.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
            <select value={selMake} onChange={e=>setSelMake(e.target.value)} disabled={!selYear}>
              <option value="">Make</option>
              {makes.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <select value={selModel} onChange={e=>setSelModel(e.target.value)} disabled={!selMake}>
              <option value="">Model</option>
              {models.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <button className="btn-primary garage-go" onClick={apply}>Apply Vehicle</button>
        </div>
      </div>
    </div>
  );
}

// ── Footer ──
function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-cols">
        <div className="ftr-col ftr-brand">
          <div className="ftr-logo">
            <img src="3js-logo-white.png" alt="3J's Auto Body" loading="lazy" />
          </div>
          <p>Truck accessories sold, installed, and backed by the team at 3J's Auto Body &amp; Rhino Linings — Signal Hill, CA.</p>
          <div className="ftr-newsletter">
            <input placeholder="Email address" />
            <button>→</button>
          </div>
        </div>
        <div className="ftr-col">
          <h5>Shop</h5>
          <a href="parts-catalog.html">Tonneau Covers</a>
          <a href="exterior-accessories-V2.html">Accessories</a>
          <a href="rhino-lining-quote.html">Rhino Liner Quote</a>
        </div>
        <div className="ftr-col">
          <h5>Service</h5>
          <a href="body-paint-repairs.html">Body &amp; Paint</a>
          <a href="inside-3js.html">About 3J's</a>
          <a href="tel:5624246744">(562) 424-6744</a>
        </div>
        <div className="ftr-col">
          <h5>Hours</h5>
          <a>Mon–Fri: 8am–5pm</a>
          <a>Sat: 9am–3pm</a>
          <a>2820 Cherry Ave, Signal Hill CA 90755</a>
        </div>
      </div>
      <div className="ftr-bottom">
        <span>© 2026 3J's Auto Body &amp; Rhino Linings · Signal Hill, CA</span>
        <span className="ftr-links"><a href="privacy-policy.html">Privacy</a></span>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
