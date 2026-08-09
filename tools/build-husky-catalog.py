"""
Builds/refreshes Husky Liners catalog data for the parts catalog from two source files:

1. The 2026-07-25 "Master Data & Assets Export" (SEMA flat, pipe-delimited) —
   product-level data only (description, MAP/Retail price, real product photos,
   and the "Part Terminology Label" category), keyed by Part Number. It has NO
   per-vehicle fitment.

2. The older "Husky Liners fitment no pricing 3-27-26.csv" — has an "Application"
   column ("YYYY[-YYYY] MAKE MODEL" free text), one row per (part, vehicle)
   fitment, but weak/no pricing and only a short non-marketing description.
   99% of the master export's part numbers (3815/3853) also appear here, so
   it's the fitment join key for building new category rows.

This script:
  - Parses both sources into part-number-keyed maps.
  - Backfills desc/price/image on existing rows of a target data.js array
    (matching by part number, only touching rows for a given `var NAME=[`
    block so files that mix in other brands' arrays, e.g. husky-data.js's
    TRAILFX_BEDPROT, aren't touched).
  - Emits brand-new category rows (13-column schema matching the existing
    catalog files: [brand,product,partNum,bedIn,bedSize,startYear,endYear,
    make,model,desc,fitNote,map,img]) for part numbers not already present
    in a target array, when fitment is available.

The master export's "Marketing Description" field has a data-quality quirk:
about half its values have a literal "?" where an apostrophe or (TM) symbol
used to be ("Husky?s", "ProGard? formula"). clean_desc() repairs both cases
with a conservative regex (word-char?word-char -> apostrophe; word-char?space
-> TM) since we can't tell them apart from the surrounding punctuation alone.

Usage:
  python tools/build-husky-catalog.py backfill <var_name> <target.js> --report
  python tools/build-husky-catalog.py new <categories...> --exclude-existing <target.js> [<target.js> ...] --out-var VAR --report
  (see main() for exact flags; this is driven by a small orchestration block
  at the bottom rather than a fully generic CLI, since each target file needs
  slightly different wiring.)
"""
import json
import re
import sys

MASTER_PATH = r"C:\Users\James\Desktop\MY WEB APP PROJECTS\VEHICLE DATA ASSETS\SEMA DATA EXPORTS\Husky Liners\huskry_liners_Master Data & Assets Export_20260725_22688267.txt"
FITMENT_CSV_PATH = r"C:\Users\James\Desktop\MY WEB APP PROJECTS\VEHICLE DATA ASSETS\Husky Liners fitment no pricing 3-27-26.csv"

LEAD_FIELDS = 29   # columns 0..28 are fixed (Jobber .. Video-Installation)
TRAIL_FIELDS = 15  # last 15 columns are fixed (Prop65 Y/N .. Prop65 Warning Chemical Listing)

ALLOWED_IMAGE_CODES = ['P04', 'P06', 'P07', 'P02', 'P01']  # priority order, real product photos only
LABEL_RE = re.compile(r'^(.+\.(?:jpg|jpeg|png|webp))\s*\((\w+)\)$', re.I)
URL_RE = re.compile(r'^https?://.+\.(?:jpg|jpeg|png|webp)$', re.I)  # URLs can contain literal spaces

# The master export's Marketing Description field replaces several distinct
# original characters with a literal "?": possessive/contraction apostrophes
# ("Husky?s" -> "Husky's"), trademark symbols ("DriGard? material" -> TM),
# and em dashes used mid-sentence ("cleanup is a breeze?mud, snow..." ->
# em dash). These are told apart heuristically by what follows the "?":
# a short contraction suffix (s/t/re/ve/ll/d/m) followed by a word boundary
# means apostrophe; anything else letter-to-letter is treated as a dash
# (verified against a sample of the source file: this classifies ~4,900
# apostrophe cases and ~340 dash cases correctly). This is a best-effort
# repair of a source data quality issue, not guaranteed 100% correct on
# every row \u2014 see the build report for how many rows this touched.
APOSTROPHE_RE = re.compile(r"(?<=[a-zA-Z])\?(?=(?:s|t|re|ve|ll|d|m)(?:[^a-zA-Z]|$))")
DASH_RE = re.compile(r'(?<=[a-zA-Z])\?(?=[a-zA-Z])')
TM_RE = re.compile(r'(?<=[a-zA-Z])\?(?=[\s,.\);:!]|$)')
DEGREE_RE = re.compile(r'(?<=\d)\?(?=\s|$)')
WS_RE = re.compile(r'\s{2,}')


def clean_desc(s):
    if not s:
        return s
    s = s.strip()
    s = APOSTROPHE_RE.sub("'", s)
    s = DASH_RE.sub(' \u2014 ', s)   # remaining letter?letter = em dash
    s = TM_RE.sub('\u2122', s)
    s = DEGREE_RE.sub('\u00b0', s)  # "360? protection" -> "360\u00b0 protection"
    # Catch-all: any other stray "?" left in the source (e.g. a lost
    # fraction glyph like "?-in. polypropylene") is a corrupted character,
    # not a real question mark, in this all-declarative marketing copy \u2014
    # drop it rather than guess what it originally was.
    s = s.replace('?', '')
    s = WS_RE.sub(' ', s)
    return s.strip()


def extract_image(primary, mid_fields):
    labeled = {}
    urls = []
    for f in mid_fields:
        f = f.strip()
        if not f:
            continue
        m = LABEL_RE.match(f)
        if m:
            labeled[m.group(1).lower()] = m.group(2).upper()
        elif URL_RE.match(f):
            urls.append(f)
    primary = (primary or '').strip()
    if URL_RE.match(primary):
        urls.insert(0, primary)
    candidates = {}
    for u in urls:
        base = u.rsplit('/', 1)[-1].lower()
        code = labeled.get(base)
        if code in ALLOWED_IMAGE_CODES and code not in candidates:
            candidates[code] = u
    for code in ALLOWED_IMAGE_CODES:
        if code in candidates:
            return candidates[code].replace(' ', '%20')
    return None


def parse_price(s):
    if not s:
        return None
    t = re.sub(r'[^\d.]', '', s.strip())
    if not t:
        return None
    try:
        v = float(t)
    except ValueError:
        return None
    if v <= 0:
        return None
    return int(v) if v == int(v) else v


def load_master(path=MASTER_PATH):
    """Returns {part_number: {category, desc, price, image, title}}."""
    out = {}
    with open(path, encoding='utf-8', errors='replace') as f:
        f.readline()  # header (unreliable column count vs data rows; parsed positionally below)
        for line in f:
            cols = line.rstrip('\n').split('|')
            if len(cols) < LEAD_FIELDS + TRAIL_FIELDS:
                continue
            lead = cols[:LEAD_FIELDS]
            trail = cols[-TRAIL_FIELDS:]
            mid = cols[LEAD_FIELDS:-TRAIL_FIELDS]

            part_num = lead[1].strip()
            if not part_num or part_num in out:
                continue
            category = lead[5].strip()
            long_desc = lead[14].strip()
            ext_desc = lead[15].strip()
            mkt_desc = lead[18].strip()
            title = lead[19].strip()
            primary_img = lead[23].strip()

            desc = mkt_desc if len(mkt_desc) > 60 else (ext_desc if len(ext_desc) > len(long_desc) else long_desc)
            desc = clean_desc(desc) or None

            map_price = parse_price(trail[1])
            retail_price = parse_price(trail[2])
            price = map_price if map_price is not None else retail_price

            image = extract_image(primary_img, mid)

            out[part_num] = {
                'category': category,
                'desc': desc,
                'price': price,
                'image': image,
                'title': title,
            }
    return out


TITLE_PREFIX_RE = re.compile(r'^Husky(?:\s+Liners)?\s+{pn}\s+', re.I)
TITLE_SUFFIX_RE = re.compile(r'^Husky(?:\s+Liners)?\s+(.*)\s+{pn}$', re.I)


def product_name(m, part_num):
    """Per-SKU product name for the catalog's product-grouping column, e.g.
    'MudDog Mud Flaps - Rubber Front Mud Flaps' instead of the generic
    category bucket 'Mud Flap' for every row (which would otherwise collapse
    159 distinct mud flap products into a single catalog card). Falls back
    to the Part Terminology Label category when Title is empty or doesn't
    match either observed vendor pattern ("Husky[ Liners] <partnum> <name>"
    or "Husky <name> <partnum>")."""
    title = (m.get('title') or '').strip()
    category = m['category']
    if not title:
        return category
    prefix_re = re.compile(TITLE_PREFIX_RE.pattern.format(pn=re.escape(part_num)), re.I)
    t2 = prefix_re.sub('', title)
    if t2 == title:
        suffix_re = re.compile(TITLE_SUFFIX_RE.pattern.format(pn=re.escape(part_num)), re.I)
        sm = suffix_re.match(title)
        if sm:
            t2 = sm.group(1).strip()
    t2 = re.sub(r'[\s\-–—]+$', '', t2)  # drop trailing " - " left by "Name - PARTNUM" titles
    t2 = clean_desc(t2)
    return t2 or category


MAKES = ['LAND ROVER', 'LANDROVER', 'MERCEDES', 'CHEVROLET', 'VOLKSWAGEN', 'MITSUBISHI',
          'CADILLAC', 'CHRYSLER', 'OLDSMOBILE', 'INFINITI', 'LINCOLN', 'HYUNDAI', 'PONTIAC',
          'PORSCHE', 'SUBARU', 'NISSAN', 'TOYOTA', 'MERCURY', 'SATURN', 'ACURA', 'HONDA',
          'MAZDA', 'VOLVO', 'DODGE', 'TESLA', 'BUICK', 'LEXUS', 'JEEP', 'AUDI', 'MINI', 'BMW',
          'FORD', 'RAM', 'KIA', 'CHEVY']
MAKES_SORTED = sorted(MAKES, key=len, reverse=True)
APP_RE = re.compile(r'^(\d{4})(?:-(\d{4}))?\s+(.+)$')


def parse_application(app):
    if not app:
        return None
    t = app.strip()
    if not t:
        return None
    m = APP_RE.match(t)
    if not m:
        return None
    sy = int(m.group(1))
    ey = int(m.group(2)) if m.group(2) else sy
    rest = m.group(3).strip().upper()
    make = ''
    model = rest
    for mk in MAKES_SORTED:
        if rest == mk or rest.startswith(mk + ' '):
            make = 'CHEVROLET' if mk == 'CHEVY' else mk
            model = rest[len(mk):].strip()
            break
    if not make:
        parts = rest.split(None, 1)
        make = parts[0]
        model = parts[1] if len(parts) > 1 else ''
    return (sy, ey, make, model)


def load_fitment(path=FITMENT_CSV_PATH):
    """Returns {part_number: [(sy,ey,make,model), ...]} deduped, from the
    Application column of the older fitment CSV (row 2 = real header)."""
    import csv
    with open(path, encoding='utf-8-sig', errors='replace') as f:
        lines = f.readlines()
    clean_lines = [lines[1]] + lines[2:]
    reader = csv.DictReader(clean_lines)
    out = {}
    for row in reader:
        pn = (row.get('Part Number') or '').strip()
        app = (row.get('Application') or '').strip()
        if not pn or not app:
            continue
        fit = parse_application(app)
        if not fit:
            continue
        out.setdefault(pn, [])
        if fit not in out[pn]:
            out[pn].append(fit)
    return out


def js_string(s):
    return json.dumps(s, ensure_ascii=False)


def js_row(brand, product, part_num, sy, ey, make, model, desc, price, image):
    price_lit = str(price) if price is not None else 'null'
    img_lit = js_string(image) if image else 'null'
    desc_lit = js_string(desc) if desc else 'null'
    return ('[' + js_string(brand) + ',' + js_string(product) + ',' + js_string(part_num) +
            ',null,null,' + str(sy) + ',' + str(ey) + ',' + js_string(make) + ',' +
            js_string(model) + ',' + desc_lit + ',null,' + price_lit + ',' + img_lit + ']')


def find_block(lines, var_name):
    start = None
    for i, l in enumerate(lines):
        if l.startswith('var ' + var_name + '='):
            start = i
            break
    if start is None:
        raise SystemExit(f'var {var_name} not found')
    end = None
    for i in range(start + 1, len(lines)):
        if lines[i].rstrip('\n') == '];':
            end = i
            break
    if end is None:
        raise SystemExit(f'closing "];" for {var_name} not found')
    return start, end


def backfill_and_append(filepath, var_name, brand, new_categories, master, fitment, out_stats):
    with open(filepath, encoding='utf-8-sig') as f:
        lines = f.readlines()
    start, end = find_block(lines, var_name)

    existing_parts = set()
    backfilled_desc = backfilled_price = backfilled_image = 0
    for i in range(start + 1, end):
        raw = lines[i]
        t = raw.rstrip('\n')
        had_comma = t.endswith(',')
        body = t[:-1] if had_comma else t
        try:
            row = json.loads(body)
        except json.JSONDecodeError:
            continue
        if row[0] != brand:
            continue
        part_num = row[2]
        existing_parts.add(part_num)
        m = master.get(part_num)
        if not m:
            continue
        changed = False
        if m['desc'] and row[9] != m['desc']:
            row[9] = m['desc']
            backfilled_desc += 1
            changed = True
        if m['price'] is not None and row[11] != m['price']:
            row[11] = m['price']
            backfilled_price += 1
            changed = True
        if m['image'] and row[12] != m['image']:
            row[12] = m['image']
            backfilled_image += 1
            changed = True
        if changed:
            lines[i] = json.dumps(row, ensure_ascii=False) + (',' if had_comma else '') + '\n'

    # New rows: parts in master with a target category, not already present,
    # with fitment available in the older CSV.
    new_lines = []
    skipped_no_fitment = {}
    added_parts_by_cat = {}
    for part_num, m in master.items():
        if m['category'] not in new_categories:
            continue
        if part_num in existing_parts:
            continue
        fits = fitment.get(part_num)
        if not fits:
            skipped_no_fitment[m['category']] = skipped_no_fitment.get(m['category'], 0) + 1
            continue
        added_parts_by_cat[m['category']] = added_parts_by_cat.get(m['category'], 0) + 1
        product = product_name(m, part_num)
        for (sy, ey, make, model) in fits:
            new_lines.append(js_row(brand, product, part_num, sy, ey, make, model,
                                     m['desc'], m['price'], m['image']))

    if new_lines:
        # ensure the previously-last row in the block now ends with a comma
        last_idx = end - 1
        last = lines[last_idx].rstrip('\n')
        if not last.endswith(','):
            lines[last_idx] = last + ',\n'
        block = ',\n'.join(new_lines) + '\n'
        lines.insert(end, block)
        end += 1  # not strictly needed further, kept for clarity

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    out_stats[filepath] = {
        'var': var_name,
        'existing_unique_parts_before': len(existing_parts),
        'backfilled_desc': backfilled_desc,
        'backfilled_price': backfilled_price,
        'backfilled_image': backfilled_image,
        'new_rows': len(new_lines),
        'new_unique_parts_by_category': added_parts_by_cat,
        'skipped_no_fitment_by_category': skipped_no_fitment,
    }


def build_new_file(filepath, header_comment, arrays):
    """arrays: list of (var_name, brand, categories, master, fitment) -> writes
    one array per tuple into a fresh file. Returns stats dict per var_name."""
    stats = {}
    out_lines = [header_comment, '']
    for var_name, brand, categories, master, fitment in arrays:
        rows = []
        skipped_no_fitment = {}
        added_by_cat = {}
        for part_num, m in master.items():
            if m['category'] not in categories:
                continue
            fits = fitment.get(part_num)
            if not fits:
                skipped_no_fitment[m['category']] = skipped_no_fitment.get(m['category'], 0) + 1
                continue
            added_by_cat[m['category']] = added_by_cat.get(m['category'], 0) + 1
            product = product_name(m, part_num)
            for (sy, ey, make, model) in fits:
                rows.append(js_row(brand, product, part_num, sy, ey, make, model,
                                    m['desc'], m['price'], m['image']))
        out_lines.append(f'// {len(rows)} entries')
        out_lines.append(f'var {var_name}=[')
        out_lines.append(',\n'.join(rows))
        out_lines.append('];')
        out_lines.append('')
        stats[var_name] = {
            'rows': len(rows),
            'unique_parts_by_category': added_by_cat,
            'skipped_no_fitment_by_category': skipped_no_fitment,
        }
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))
    return stats


if __name__ == '__main__':
    print('This module is imported by run-husky-refresh.py; run that instead.')
