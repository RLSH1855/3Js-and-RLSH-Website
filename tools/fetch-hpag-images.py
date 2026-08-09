#!/usr/bin/env python3
"""Download and normalise product images for the HPAG brands.

The vendor sheet gives one Dropbox *folder* link per product rather than direct
image URLs, so images can't be hot-linked -- each folder is downloaded as a zip,
the best still image is picked out, and it is re-encoded as a web-sized WebP at
cloudflare/images/products/hpag/<PARTNUMBER>.webp.

Safe to stop and re-run: anything already on disk is skipped, and failures are
recorded so a retry pass only touches what actually failed.

Usage:
  python tools/fetch-hpag-images.py                 # fetch everything missing
  python tools/fetch-hpag-images.py --limit 25      # small trial run
  python tools/fetch-hpag-images.py --retry         # re-attempt past failures
  python tools/fetch-hpag-images.py --workers 4     # tune parallelism

Afterwards re-run  python tools/build-hpag-data.py  to wire the paths into
the catalog data files.
"""
import argparse
import io
import json
import os
import re
import sys
import threading
import time
import urllib.error
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util

_spec = importlib.util.spec_from_file_location(
    'build_hpag_data',
    os.path.join(os.path.dirname(os.path.abspath(__file__)),
                 'build-hpag-data.py'))
BH = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(BH)

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
IMG_DIR = os.path.join(REPO, 'cloudflare', 'images', 'products', 'hpag')
STATE_PATH = os.path.join(HERE, '.hpag-images-state.json')

MAX_W, MAX_H = 1200, 1200
QUALITY = 82
IMG_EXT = ('.jpg', '.jpeg', '.png', '.webp')
UA = 'Mozilla/5.0 (compatible; 3JsAutoBody-catalog-build/1.0)'

_state_lock = threading.Lock()
_print_lock = threading.Lock()


def log(msg):
    with _print_lock:
        print(msg, flush=True)


def load_state():
    if os.path.exists(STATE_PATH):
        try:
            with open(STATE_PATH, encoding='utf-8') as fh:
                return json.load(fh)
        except (ValueError, OSError):
            pass
    return {'failed': {}, 'done': {}}


def save_state(state):
    tmp = STATE_PATH + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as fh:
        json.dump(state, fh, indent=1, sort_keys=True)
    os.replace(tmp, STATE_PATH)


def first_url(cell):
    """A few cells hold several links separated by commas or newlines."""
    for token in re.split(r'[,\s]+', (cell or '').strip()):
        if token.startswith('http'):
            return token
    return ''


def as_zip_url(url):
    """Force a Dropbox share link to serve its contents rather than a preview."""
    url = first_url(url)
    url = re.sub(r'[?&]dl=\d', '', url)
    return url + ('&' if '?' in url else '?') + 'dl=1'


class Throttled(Exception):
    """Dropbox answered with something that isn't the file (usually a 429)."""


def fetch_once(url, timeout=120):
    req = urllib.request.Request(as_zip_url(url), headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read(), (resp.headers.get('Content-Type') or '').lower()


def fetch(url, timeout=120, attempts=5):
    """Fetch with backoff.

    Under load Dropbox stops serving the zip and returns an HTML notice with
    a 200 status. Treating that as "folder has no image" silently threw away
    ~40% of the catalogue, so it is retried instead.
    """
    delay = 3.0
    last = None
    for attempt in range(attempts):
        try:
            blob, ctype = fetch_once(url, timeout)
            if blob[:2] == b'PK' or ctype.startswith('image/'):
                return blob, ctype
            last = Throttled('served %s, %d bytes (not the file)'
                             % (ctype or 'unknown type', len(blob)))
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 500, 502, 503, 504):
                raise
            last = exc
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last = exc
        if attempt < attempts - 1:
            time.sleep(delay)
            delay *= 2
    raise last or Throttled('gave up')


def score_name(name, part):
    """Rank candidate images: exact part match first, then plain product shots."""
    low = name.lower()
    base = os.path.basename(low)
    s = 0
    if part and part.lower() in base:
        s += 1000
    for good in ('main', 'primary', 'hero', '_01', '-01', ' 1.', '_1.'):
        if good in base:
            s += 60
    for bad in ('install', 'instruction', 'diagram', 'dimension', 'lifestyle',
                'logo', 'packaging', 'box', 'thumb', 'back', 'detail'):
        if bad in base:
            s -= 120
    if base.endswith('.png'):
        s += 15  # usually the clean studio cut-out
    return s


def pick_image(blob, ctype, part):
    """Return raw image bytes from either a zip of assets or a single image."""
    if ctype.startswith('image/') or not blob[:2] == b'PK':
        return blob if ctype.startswith('image/') else None
    try:
        zf = zipfile.ZipFile(io.BytesIO(blob))
    except zipfile.BadZipFile:
        return None
    cands = [n for n in zf.namelist()
             if n.lower().endswith(IMG_EXT) and not n.endswith('/')
             and '__MACOSX' not in n and not os.path.basename(n).startswith('.')]
    if not cands:
        return None
    cands.sort(key=lambda n: (-score_name(n, part), -zf.getinfo(n).file_size))
    for name in cands[:5]:
        try:
            data = zf.read(name)
            Image.open(io.BytesIO(data)).verify()
            return data
        except Exception:
            continue
    return None


def trim_black_bars(im):
    """Crop letterbox bars.

    Some brands ship lifestyle shots padded to a square with solid black bars.
    Left as-is they read as broken tiles next to white-background product
    shots, so any fully-dark border rows/columns are cropped off.
    """
    g = im.convert('L')
    w, h = g.size
    px = g.load()
    step_x = max(1, w // 80)
    step_y = max(1, h // 80)

    def row_dark(y):
        return all(px[x, y] < 18 for x in range(0, w, step_x))

    def col_dark(x):
        return all(px[x, y] < 18 for y in range(0, h, step_y))

    top, bottom, left, right = 0, h, 0, w
    while top < h // 3 and row_dark(top):
        top += 1
    while bottom > 2 * h // 3 and row_dark(bottom - 1):
        bottom -= 1
    while left < w // 3 and col_dark(left):
        left += 1
    while right > 2 * w // 3 and col_dark(right - 1):
        right -= 1
    if (top or left or bottom != h or right != w) \
            and right - left > w // 3 and bottom - top > h // 3:
        return im.crop((left, top, right, bottom))
    return im


def to_webp(data, dest):
    im = Image.open(io.BytesIO(data))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert('RGB')
    im = trim_black_bars(im)
    im.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
    tmp = dest + '.tmp'
    im.save(tmp, 'WEBP', quality=QUALITY, method=5)
    os.replace(tmp, dest)
    return im.size


def build_worklist(retry, state):
    raw = BH.load_rows(BH.DEFAULT_XLSX)
    seen, work = set(), []
    for r in raw:
        # Only the brands the catalog actually publishes (see build-hpag-data).
        if BH.g(r, 'brand') not in BH.BRANDS_INCLUDED:
            continue
        part = BH.g(r, 'part')
        url = first_url(BH.g(r, 'images'))
        if not part or not url or part in seen:
            continue
        seen.add(part)
        if os.path.exists(os.path.join(IMG_DIR, BH.image_name(part) + '.webp')):
            continue
        if not retry and part in state['failed']:
            continue
        work.append((part, url))
    return work


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--workers', type=int, default=4)
    ap.add_argument('--retry', action='store_true')
    args = ap.parse_args()

    if not os.path.isdir(IMG_DIR):
        os.makedirs(IMG_DIR)

    state = load_state()
    work = build_worklist(args.retry, state)
    if args.limit:
        work = work[:args.limit]

    total = len(work)
    if not total:
        log('Nothing to fetch -- every part number already has an image.')
        return
    log('Fetching images for %d part numbers with %d workers.\n'
        % (total, args.workers))

    counts = {'ok': 0, 'fail': 0}
    started = time.time()

    def handle(idx_item):
        idx, (part, url) = idx_item
        dest = os.path.join(IMG_DIR, BH.image_name(part) + '.webp')
        try:
            blob, ctype = fetch(url)
            data = pick_image(blob, ctype, part)
            if not data:
                raise ValueError('no usable image in folder')
            w, h = to_webp(data, dest)
            with _state_lock:
                counts['ok'] += 1
                state['done'][part] = {'w': w, 'h': h}
                state['failed'].pop(part, None)
            done = counts['ok'] + counts['fail']
            rate = done / max(time.time() - started, 1)
            log('[%4d/%d] ok   %-22s %dx%d  (%.1f/s, ~%d min left)'
                % (done, total, part, w, h, rate,
                   (total - done) / max(rate, 0.01) / 60))
        except Exception as exc:  # network, zip, decode -- all recoverable
            with _state_lock:
                counts['fail'] += 1
                state['failed'][part] = '%s: %s' % (type(exc).__name__, exc)
            done = counts['ok'] + counts['fail']
            log('[%4d/%d] FAIL %-22s %s' % (done, total, part, exc))
        if idx % 25 == 0:
            with _state_lock:
                save_state(state)

    try:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            list(pool.map(handle, enumerate(work, 1)))
    finally:
        save_state(state)

    mins = (time.time() - started) / 60
    log('\nDone in %.1f min -- %d saved, %d failed.'
        % (mins, counts['ok'], counts['fail']))
    on_disk = len([f for f in os.listdir(IMG_DIR) if f.endswith('.webp')])
    log('%d images now in cloudflare/images/products/hpag/' % on_disk)
    if counts['fail']:
        log('Retry just the failures with:  '
            'python tools/fetch-hpag-images.py --retry')
    log('Then re-run:  python tools/build-hpag-data.py')


if __name__ == '__main__':
    main()
