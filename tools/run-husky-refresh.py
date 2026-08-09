"""
Orchestrates the Husky Liners catalog refresh (2026-08) using build-husky-catalog.py.

- Backfills husky-data.js's HUSKY_CATALOG (Bed Mats/Bed Protection, 187 existing
  parts) with richer desc/price/image from the new master export, and appends
  new Truck Bed Mat / Truck Bed Liner / Tailgate Mat rows.
- Backfills floor-liners-data.js's FLOOR_CATALOG (2,003 existing Husky floor
  liner parts) the same way, and appends new Floor Liner / Cargo Floor Liner /
  Floor Liner Set / Floor Mat rows.
- Writes a new husky-extra-data.js with HUSKY_DEF (Hood + Side Window
  Deflector), HUSKY_FF (Fender Flare Set, Door Edge Guard Set, Rocker Panel
  Kit, Fender Liner), HUSKY_MUD (Mud Flap) — meant to be spread into the
  existing 'deflectors' / 'fender-flares' catalog categories and a new
  'mud-flaps' category in parts-catalog.html.

Run from the repo root: python tools/run-husky-refresh.py
"""
import importlib.util
import json

spec = importlib.util.spec_from_file_location('bhc', 'tools/build-husky-catalog.py')
bhc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bhc)

HUSKY_DATA_JS = 'cloudflare/husky-data.js'
FLOOR_DATA_JS = 'cloudflare/floor-liners-data.js'
EXTRA_DATA_JS = 'cloudflare/husky-extra-data.js'

BEDPROT_NEW_CATS = {'Truck Bed Mat', 'Truck Bed Liner', 'Tailgate Mat'}
FLOOR_NEW_CATS = {'Floor Liner', 'Cargo Floor Liner', 'Floor Liner Set', 'Floor Mat'}
DEF_CATS = {'Hood Deflector', 'Side Window Deflector'}
FF_CATS = {'Fender Flare Set', 'Door Edge Guard Set', 'Rocker Panel Kit', 'Fender Liner'}
MUD_CATS = {'Mud Flap'}
SMALL_SKIPPED_CATS = {'Truck Cab Storage Case', 'Roof Marker Light', 'Headliner',
                       'Adhesion Promoter', 'Utility Mat'}

def main():
    print('Loading master export...')
    master = bhc.load_master()
    print(f'  {len(master)} unique part numbers')
    print('Loading fitment CSV...')
    fitment = bhc.load_fitment()
    print(f'  {len(fitment)} unique part numbers with parsed YMM fitment')

    stats = {}

    print('\n--- Backfilling husky-data.js (HUSKY_CATALOG) + adding Bed Mat/Bed Liner/Tailgate Mat ---')
    bhc.backfill_and_append(HUSKY_DATA_JS, 'HUSKY_CATALOG', 'Husky Liners', BEDPROT_NEW_CATS, master, fitment, stats)

    print('--- Backfilling floor-liners-data.js (FLOOR_CATALOG) + adding Floor Liner/Cargo/Set/Mat ---')
    bhc.backfill_and_append(FLOOR_DATA_JS, 'FLOOR_CATALOG', 'Husky Liners', FLOOR_NEW_CATS, master, fitment, stats)

    print('--- Building husky-extra-data.js (HUSKY_DEF, HUSKY_FF, HUSKY_MUD) ---')
    header = ('// Husky Liners — Hood/Window Deflectors, Fender Flares & Trim, Mud Flaps\n'
               '// [brand,product,partNum,bedIn,bedSize,startYear,endYear,make,model,desc,fitNote,map,img]\n'
               '// Built 2026-08 from huskry_liners_Master Data & Assets Export_20260725_22688267.txt\n'
               '// (product/category/desc/price/image) joined to Husky Liners fitment no pricing 3-27-26.csv (YMM)')
    extra_stats = bhc.build_new_file(EXTRA_DATA_JS, header, [
        ('HUSKY_DEF', 'Husky Liners', DEF_CATS, master, fitment),
        ('HUSKY_FF', 'Husky Liners', FF_CATS, master, fitment),
        ('HUSKY_MUD', 'Husky Liners', MUD_CATS, master, fitment),
    ])

    # Small-volume categories explicitly not built out
    import collections
    cat_counts = collections.Counter(m['category'] for m in master.values())
    print('\n=== SUMMARY ===')
    print(json.dumps(stats, indent=2))
    print(json.dumps(extra_stats, indent=2))
    print('\nSmall categories intentionally skipped (not enough volume / judgment call):')
    for c in sorted(SMALL_SKIPPED_CATS):
        print(f'  {c}: {cat_counts.get(c,0)} parts in master export')
    handled = BEDPROT_NEW_CATS | FLOOR_NEW_CATS | DEF_CATS | FF_CATS | MUD_CATS | SMALL_SKIPPED_CATS
    unhandled = set(cat_counts) - handled
    if unhandled:
        print('UNHANDLED categories (not accounted for anywhere!):')
        for c in unhandled:
            print(f'  {c}: {cat_counts[c]}')

if __name__ == '__main__':
    main()
