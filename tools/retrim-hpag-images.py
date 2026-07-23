#!/usr/bin/env python3
"""Crop letterbox bars off already-downloaded HPAG product images.

fetch-hpag-images.py trims these on the way in. This pass fixes images that
were saved before that trimming existed. Only files that actually have bars
are rewritten, so it is safe to re-run.

Usage:  python tools/retrim-hpag-images.py [--dry-run]
"""
import argparse
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util

_spec = importlib.util.spec_from_file_location(
    'fetch_hpag_images',
    os.path.join(os.path.dirname(os.path.abspath(__file__)),
                 'fetch-hpag-images.py'))
FH = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(FH)

IMG_DIR = FH.IMG_DIR


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    files = sorted(f for f in os.listdir(IMG_DIR) if f.endswith('.webp'))
    trimmed = skipped = failed = 0

    for i, fn in enumerate(files, 1):
        path = os.path.join(IMG_DIR, fn)
        try:
            im = Image.open(path).convert('RGB')
            before = im.size
            out = FH.trim_black_bars(im)
            if out.size == before:
                skipped += 1
                continue
            trimmed += 1
            print('[%4d/%d] %-26s %dx%d -> %dx%d'
                  % (i, len(files), fn, before[0], before[1],
                     out.size[0], out.size[1]))
            if not args.dry_run:
                out.thumbnail((FH.MAX_W, FH.MAX_H), Image.LANCZOS)
                tmp = path + '.tmp'
                out.save(tmp, 'WEBP', quality=FH.QUALITY, method=5)
                os.replace(tmp, path)
        except Exception as exc:
            failed += 1
            print('[%4d/%d] FAIL %s: %s' % (i, len(files), fn, exc))

    print('\n%s%d trimmed, %d already clean, %d failed (of %d).'
          % ('DRY RUN -- ' if args.dry_run else '',
             trimmed, skipped, failed, len(files)))


if __name__ == '__main__':
    main()
