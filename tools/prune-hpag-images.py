#!/usr/bin/env python3
"""Delete downloaded images for part numbers the catalog no longer publishes.

The vendor sheet covers five brands; only the brands in
build-hpag-data.BRANDS_INCLUDED are published. Images pulled for the others
would otherwise sit in the repo forever.

Shows what it would remove and asks nothing unless --force is passed.

Usage:
  python tools/prune-hpag-images.py            # dry run (default)
  python tools/prune-hpag-images.py --force    # actually delete
"""
import argparse
import importlib.util
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location(
    'build_hpag_data', os.path.join(HERE, 'build-hpag-data.py'))
BH = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(BH)

IMG_DIR = os.path.join(os.path.dirname(HERE), 'cloudflare', 'images',
                       'products', 'hpag')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--force', action='store_true',
                    help='actually delete (default is a dry run)')
    args = ap.parse_args()

    keep = set()
    for r in BH.load_rows(BH.DEFAULT_XLSX):
        if BH.g(r, 'brand') in BH.BRANDS_INCLUDED:
            part = BH.g(r, 'part')
            if part:
                keep.add(BH.image_name(part).upper())

    if not os.path.isdir(IMG_DIR):
        sys.exit('No image directory at %s' % IMG_DIR)

    files = sorted(f for f in os.listdir(IMG_DIR) if f.endswith('.webp'))
    stale = [f for f in files if os.path.splitext(f)[0].upper() not in keep]

    freed = sum(os.path.getsize(os.path.join(IMG_DIR, f)) for f in stale)
    print('published part numbers : %d' % len(keep))
    print('images on disk         : %d' % len(files))
    print('images to remove       : %d  (%.1f MB)' % (len(stale),
                                                      freed / 1024 / 1024))
    print('images kept            : %d' % (len(files) - len(stale)))

    if not stale:
        return
    if not args.force:
        print('\nDRY RUN -- nothing deleted. Re-run with --force to remove.')
        for f in stale[:10]:
            print('   would remove %s' % f)
        if len(stale) > 10:
            print('   ... and %d more' % (len(stale) - 10))
        return

    for f in stale:
        os.remove(os.path.join(IMG_DIR, f))
    print('\nRemoved %d images, freed %.1f MB.' % (len(stale),
                                                   freed / 1024 / 1024))


if __name__ == '__main__':
    main()
