#!/usr/bin/env python3
"""Generate the HPAG catalog data files from the vendor master spreadsheet.

Source : HPAG_-_Master_Data_File_<date>.xlsx  ("Master Load Sheet")
Output : cloudflare/hpag/<category>.js -- one file per site category, each
         holding window.HPAG[cat] = {rows, content}. Split per category so a
         shopper only downloads the category they opened.

The sheet carries five brands; only Addictive Desert Designs and DV8 Offroad
are published (see BRANDS_INCLUDED).

Prices published are MSRP/MAP only. Dealer cost columns are deliberately
never read by this script.

Re-run after downloading images (tools/fetch-hpag-images.py) to wire up the
image paths -- rows point at an image only when the file actually exists.

Usage:  python tools/build-hpag-data.py [path/to/master.xlsx]
"""
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from collections import OrderedDict, defaultdict

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT_DIR = os.path.join(REPO, 'cloudflare')
HPAG_OUT_DIR = os.path.join(OUT_DIR, 'hpag')
IMG_DIR = os.path.join(OUT_DIR, 'images', 'products', 'hpag')
IMG_REL = 'images/products/hpag/'

DEFAULT_XLSX = os.path.join(
    os.path.dirname(REPO), 'HPAG_-_Master_Data_File_7.22.2026.xlsx')

# ── Column indices in "Master Load Sheet" (verified against the header row) ──
C = dict(
    active=1, brand=3, part=4, intext=6, cat=7, sub=8, brandfull=9,
    make=11, model=12, submodel=13, ystart=14, yend=15,
    bed=19, fitnote=20, excluded=21,
    desclong=23, selling=24, features=25, title=26,
    installlevel=27, installtime=28, material=29, texture=30,
    warranty=31, warrantyuom=32, gtin=33, origin=35,
    weight=45, msrp=62, freight=69,
    keywords=70, installpdf=71, images=74,
)

BRAND_SHORT = {'ADD': 'ADD', 'DV8': 'DV8', 'C4': 'C4 Fab',
               'Rago': 'Rago', 'FVC': 'Flatline'}
BRAND_FULL = {'ADD': 'Addictive Desert Designs', 'DV8': 'DV8 Offroad',
              'C4': 'C4 Fabrication', 'Rago': 'Rago Fabrication',
              'FVC': 'Flatline Van Co.'}

# The vendor sheet also carries C4 Fabrication, Rago Fabrication and Flatline
# Van Co. 3J's does not sell those, so only these two brands are published.
BRANDS_INCLUDED = {'ADD', 'DV8'}

# ── Vendor category -> site category ──
# The vendor ships ~40 fine-grained categories; the site groups them into six
# browsable ones, plus two that feed the existing Bull Bars / Lighting pages.
CATEGORY_MAP = {
    'bumpers': ['Front Bumper', 'Rear Bumper', 'Bumper', 'Bumper Accessory',
                'Bumper Cap', 'Winch Kit', 'Winch', 'Fairlead',
                'Winch Fairlead', 'Winch Relocation Bracket', 'Light Hoop',
                'Tire Carrier', 'Tire Delete Kit', 'Recovery Mount',
                'Brush Guard', 'License Plate Bracket', 'Camera Relocation Kit',
                'Sensor Bezel'],
    'skid-plates': ['Skid Plate', 'Shock Guard', 'Inner Fender', 'Structural',
                    'Suspension', 'Fender Liners', 'Body Mount Relocation',
                    'Oversized Tire Fitment Kit', 'Frame', 'Cross Member'],
    'roof-racks': ['Roof Rack', 'Roof Rack Accessory', 'Chase Rack', 'Ladder',
                   'Ladders', 'Vehicle Access', 'Hard Top', 'Roof Storage',
                   'Bed Rack', 'Bike Rack', 'Awning Accessory',
                   'Roof Rack & Molle Accessory'],
    'molle-storage': ['Molle', 'Molle Panel', 'Storage', 'Interior Molle',
                      'Exterior Molle Panel', 'Battery Box', 'Bed', 'Shelving',
                      'Spare Battery Tray', 'Engine Bay Accessory Tray',
                      'Panel'],
    'rock-sliders': ['Rock Slider', 'Rock Sliders', 'Side Step'],
    'offroad-accessories': ['Bracket', 'Accessory Mount', 'Accessory', 'Mount',
                            'Mounts', 'Body Panel', 'Rear Door System',
                            'Recovery', 'Mounting Bracket', 'Handle', 'Latch',
                            'TSS Relocation Kit', 'Air Kit', 'Intercooler',
                            'Overflow Tank'],
    # folded into the categories that already exist on the site
    'bull-bars': ['Bull Bar'],
    'lighting': ['Lighting'],
}

# Not vehicle parts -- deliberately kept out of the catalog.
CATEGORY_EXCLUDE = {'apparel'}

# Anything new the vendor adds later still lands somewhere browsable rather
# than silently vanishing from the catalog.
CATEGORY_FALLBACK = 'offroad-accessories'
CAT_LOOKUP = {}
for _site, _vendor_cats in CATEGORY_MAP.items():
    for _vc in _vendor_cats:
        CAT_LOOKUP[_vc.lower()] = _site

_YEAR_PREFIX = re.compile(r'^\s*\d{4}\s*(?:[-–]\s*\d{4})?\s*\+?\s*')
_WS = re.compile(r'\s+')


# ── xlsx reading ───────────────────────────────────────────────────────────
def load_rows(path, sheet='xl/worksheets/sheet1.xml'):
    z = zipfile.ZipFile(path)
    shared = [''.join(t.text or '' for t in si.iter(NS + 't'))
              for si in ET.fromstring(z.read('xl/sharedStrings.xml'))]

    def colnum(ref):
        n = 0
        for ch in re.match(r'[A-Z]+', ref).group(0):
            n = n * 26 + (ord(ch) - 64)
        return n - 1

    out = []
    for _ev, el in ET.iterparse(z.open(sheet), events=('end',)):
        if el.tag != NS + 'row':
            continue
        d = {}
        for c in el.iter(NS + 'c'):
            t, v, ise = c.get('t'), c.find(NS + 'v'), c.find(NS + 'is')
            if t == 's' and v is not None:
                val = shared[int(v.text)]
            elif ise is not None:
                val = ''.join(x.text or '' for x in ise.iter(NS + 't'))
            elif v is not None:
                val = v.text
            else:
                val = ''
            if val != '':
                d[colnum(c.get('r'))] = val
        el.clear()
        out.append(d)
    return [r for r in out[1:] if r]


# ── cell helpers ───────────────────────────────────────────────────────────
def clean(s):
    """Repair the mojibake in the vendor export and normalise whitespace."""
    if not s:
        return ''
    s = str(s)
    # The export mangles smart punctuation; � stands in for " and '
    s = s.replace('��', '"').replace('�', '"')
    s = s.replace('“', '"').replace('”', '"')
    s = s.replace('‘', "'").replace('’', "'")
    return _WS.sub(' ', s).strip()


def g(row, key):
    return clean(row.get(C[key], ''))


def gml(row, key):
    """Multi-line cell -> list of non-empty lines."""
    raw = row.get(C[key], '') or ''
    lines = []
    for ln in str(raw).split('\n'):
        ln = clean(ln).lstrip('-• ').strip()
        if ln:
            lines.append(ln)
    return lines


def num(row, key):
    v = g(row, key)
    if not v:
        return None
    try:
        return float(v)
    except ValueError:
        return None


def yr(row, key):
    v = num(row, key)
    if v is None:
        return None
    v = int(v)
    return v if 1950 <= v <= 2040 else None


def image_name(part):
    """Filename for a part's image.

    A couple of part numbers contain spaces ("WIRE HARNESS"), which would need
    URL-encoding everywhere the path is used. Kept URL-safe at the source
    instead. Shared with tools/fetch-hpag-images.py.
    """
    return re.sub(r'[^A-Za-z0-9._-]+', '_', part).strip('_')


def money(row, key):
    v = num(row, key)
    if v is None or v <= 0:
        return None
    return round(v, 2)


# ── product-line naming ────────────────────────────────────────────────────
def vehicle_tokens(make, model):
    toks = []
    for field in (make, model):
        for part in re.split(r'[,/]', field or ''):
            part = part.strip()
            if part and part.lower() != 'universal':
                toks.append(part)
                # vendors write "Chevy" where the data says "Chevrolet"
                if part == 'Chevrolet':
                    toks.append('Chevy')
                if part == 'Mercedes-Benz':
                    toks.append('Mercedes')
    return sorted(set(toks), key=len, reverse=True)


def product_line(title, make, model):
    """"2024-2026 Ford F-150 Bomber Rear Bumper" -> "Ford F-150 Bomber Rear Bumper"

    Only the leading year range comes off, so the year variants of one product
    share a product page while the vehicle stays in the name.

    Stripping the vehicle out too was tried and produced broken names: the make
    and model are often part of a compound the vendor wrote as one unit, so
    "Ford F-250/350 Phantom Winch Front Bumper" lost "F-250" and became
    "/350 Phantom Winch Front Bumper". 79 of 584 names were mangled that way.
    """
    t = _YEAR_PREFIX.sub('', title or '')
    t = t.strip(' -–,|&/')
    return re.sub(r'\s{2,}', ' ', t).strip() or clean(title)


def split_multi(value):
    """'Chevrolet, GMC' -> ['Chevrolet','GMC'];  'Canyon/Colorado' stays whole."""
    parts = [p.strip() for p in (value or '').split(',')]
    parts = [p for p in parts if p]
    return parts or ['']


# ── JS emitting ────────────────────────────────────────────────────────────
def js(v):
    if v is None:
        return 'null'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        s = repr(round(v, 2) if isinstance(v, float) else v)
        return s[:-2] if s.endswith('.0') else s
    return json.dumps(str(v), ensure_ascii=False)


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_XLSX
    if not os.path.exists(src):
        sys.exit('Master data file not found: %s' % src)

    have_images = set()
    if os.path.isdir(IMG_DIR):
        for fn in os.listdir(IMG_DIR):
            have_images.add(os.path.splitext(fn)[0].upper())

    raw = load_rows(src)
    rows = []
    content = OrderedDict()
    line_rows = defaultdict(list)
    skipped = []

    for r in raw:
        if g(r, 'active').lower() not in ('yes', 'y', ''):
            continue
        if g(r, 'brand') not in BRANDS_INCLUDED:
            continue
        part = g(r, 'part')
        title = g(r, 'title') or g(r, 'desclong')
        vendor_cat = g(r, 'cat')
        if not part or not title:
            skipped.append((part, 'missing part number or title'))
            continue

        if vendor_cat.lower() in CATEGORY_EXCLUDE:
            skipped.append((part, 'excluded category: %s' % vendor_cat))
            continue
        site_cat = CAT_LOOKUP.get(vendor_cat.lower())
        if not site_cat:
            site_cat = CATEGORY_FALLBACK
            skipped.append((part, 'FELL BACK to %s, new vendor category: %s'
                            % (CATEGORY_FALLBACK, vendor_cat)))

        brand_code = g(r, 'brand')
        brand = BRAND_SHORT.get(brand_code, brand_code)
        make_raw, model_raw = g(r, 'make'), g(r, 'model')
        name = product_line(title, make_raw, model_raw)

        start, end = yr(r, 'ystart'), yr(r, 'yend')
        universal = (not make_raw) or make_raw.lower() == 'universal'
        if universal:
            make_raw, model_raw = 'Universal', model_raw or 'Universal'
        # An open-ended "2024+" range carries no end year in the sheet.
        if start and not end:
            end = 2035
        if end and not start:
            start = 1990
        if not start and not end:
            start, end = 1990, 2035

        # Fitment detail the row can't hold structurally goes in the note.
        note_bits = []
        for key in ('fitnote', 'excluded', 'submodel'):
            val = clean(' '.join(gml(r, key)))
            if val:
                note_bits.append(val)
        fit_note = ' | '.join(note_bits)[:600] or None

        desc = g(r, 'desclong') or title
        price = money(r, 'msrp')
        bed = g(r, 'bed') or None
        safe = image_name(part)
        img = (IMG_REL + safe + '.webp') if safe.upper() in have_images else None

        # One row per make/model combination so garage filtering is accurate.
        for make in split_multi(make_raw):
            for model in split_multi(model_raw):
                rows.append([
                    brand, name, part, None, bed, start, end, make, model,
                    desc, fit_note, price, img, site_cat,
                ])

        line_rows[(brand, name)].append(r)

    # ── rich PDP content, one entry per product line ──
    for (brand, name), members in line_rows.items():
        r = members[0]
        feats = [f for f in gml(r, 'features') if len(f) > 3][:10]
        specs = OrderedDict()

        def put(label, value):
            if value:
                specs[label] = value

        put('Brand', BRAND_FULL.get(g(r, 'brand'), brand))
        put('Material', g(r, 'material'))
        put('Finish', g(r, 'texture'))
        put('Install Time', g(r, 'installtime'))
        lvl = num(r, 'installlevel')
        if lvl:
            put('Install Difficulty', '%d of 5' % int(lvl))
        wt = num(r, 'weight')
        if wt:
            put('Weight', '%g lbs' % wt)
        wr, uom = g(r, 'warranty'), g(r, 'warrantyuom')
        if wr:
            unit = {'YR': 'Year', 'MO': 'Month'}.get(uom.upper(), uom or 'Year')
            n = int(float(wr)) if re.match(r'^\d+(\.\d+)?$', wr) else wr
            put('Warranty', '%s %s%s' % (n, unit, '' if str(n) == '1' else 's'))
        put('Made In', {'US': 'USA', 'CN': 'China', 'TW': 'Taiwan'}
            .get(g(r, 'origin').upper(), g(r, 'origin')))
        put('Category', g(r, 'cat'))

        entry = OrderedDict()
        entry['brandFull'] = BRAND_FULL.get(g(r, 'brand'), brand)
        entry['coverType'] = g(r, 'cat')
        entry['img'] = None
        entry['desc'] = g(r, 'selling') or g(r, 'desclong') or name
        if feats:
            entry['features'] = feats
        entry['specs'] = specs
        pdf = g(r, 'installpdf')
        if pdf.startswith('http'):
            entry['installPdf'] = pdf
        content[name] = entry

    # ── write one file per site category ──
    # A single combined file would be ~550 KB of rows plus ~1.6 MB of copy on
    # every catalog view. Splitting lets catalog-categories.js pull only the
    # category the shopper actually opened.
    rows_by_cat = defaultdict(list)
    for row in rows:
        rows_by_cat[row[13]].append(row[:13])

    if not os.path.isdir(HPAG_OUT_DIR):
        os.makedirs(HPAG_OUT_DIR)

    written = []
    for cat, cat_rows in sorted(rows_by_cat.items()):
        names = {r[1] for r in cat_rows}
        cat_content = OrderedDict(
            (n, content[n]) for n in content if n in names)
        out = [
            '// Addictive Desert Designs / DV8 Offroad / C4 Fabrication /',
            '// Rago Fabrication / Flatline Van Co. -- "%s".' % cat,
            '// GENERATED, do not hand-edit. Regenerate with:',
            '//   python tools/build-hpag-data.py',
            '// [brand,product,partNum,bedIn,bedSize,startYear,endYear,make,'
            'model,desc,fitNote,map,img]',
            '// %d fitment rows / %d products' % (len(cat_rows),
                                                  len(cat_content)),
            'window.HPAG=window.HPAG||{};',
            'window.HPAG[%s]={rows:[' % js(cat),
        ]
        for row in cat_rows:
            out.append('[' + ','.join(js(v) for v in row) + '],')
        out.append('],content:' + json.dumps(cat_content, ensure_ascii=False,
                                             separators=(',', ':')) + '};')
        out.append('')
        out.append('// Product page looks copy up in PRODUCT_CONTENT by name.')
        out.append('if(typeof PRODUCT_CONTENT!=="undefined"){'
                   'var _c=window.HPAG[%s].content;' % js(cat))
        out.append(' for(var _k in _c){'
                   'if(!PRODUCT_CONTENT[_k])PRODUCT_CONTENT[_k]=_c[_k];}}')
        out.append('')

        path = os.path.join(HPAG_OUT_DIR, cat + '.js')
        with open(path, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write('\n'.join(out))
        written.append((cat, len(cat_rows), len(cat_content),
                        os.path.getsize(path)))

    # ── report ──
    print('wrote %d category files to %s\n'
          % (len(written), os.path.relpath(HPAG_OUT_DIR, REPO)))
    print('  %-22s %6s %9s %9s' % ('category', 'rows', 'products', 'size'))
    for cat, nrows, nprod, size in sorted(written, key=lambda w: -w[1]):
        print('  %-22s %6d %9d %8.0f KB' % (cat, nrows, nprod, size / 1024))
    print('\nfitment rows : %d' % len(rows))
    print('product lines: %d' % len(content))
    print('with images  : %d / %d part numbers'
          % (len({r[2] for r in rows if r[12]}), len({r[2] for r in rows})))
    if skipped:
        print('\nnotes on %d rows:' % len(skipped))
        reasons = defaultdict(int)
        for _p, why in skipped:
            reasons[why] += 1
        for why in sorted(reasons, key=lambda w: -reasons[w]):
            print('  %4d  %s' % (reasons[why], why))


if __name__ == '__main__':
    main()
