"""
Generic patcher: fills null image fields in a catalog data.js file using a
brand's SEMA Data Co-op export (pipe-delimited, "Part Number" + "Primary"
columns hold the part number and hero photo URL).

Several legacy catalog files (fender-flares-data.js, deflectors-data.js,
bull-bars-data.js) were generated from an internal AMP "Light Truck Master"
CSV that has no image column at all — every row was written with a
hardcoded null image, regardless of whether a real photo exists. The
brand's own SEMA export usually has one.

Usage: python tools/patch-sema-images.py <brand> <sema_export.txt> <target_data.js> [<target_data.js> ...]
       python tools/patch-sema-images.py --strip-prefix ORC <brand> <sema_export.txt> <target_data.js> [...]
"""
import re
import sys

URL_RE = re.compile(r'https?://[^|\r\n]+?\.(?:jpg|jpeg|png|webp)', re.I)
SKIP_PATTERNS = re.compile(r'logo|prop.?65|warning|made.?in|instruction', re.I)

def build_image_map(sema_path):
    with open(sema_path, encoding='utf-8', errors='replace') as f:
        header = f.readline().rstrip('\n').split('|')
        part_idx = header.index('Part Number')
        image_map = {}
        for line in f:
            cols = line.split('|', part_idx + 1)
            if len(cols) <= part_idx:
                continue
            part_num = cols[part_idx].strip()
            if not part_num or part_num in image_map:
                continue
            urls = [u for u in URL_RE.findall(line) if not SKIP_PATTERNS.search(u)]
            if urls:
                image_map[part_num] = urls[0].replace(' ', '%20')
    return image_map

def patch_file(brand, image_map, target_path, strip_prefix=None):
    part_re = re.compile(r'^\["' + re.escape(brand) + r'","(?:[^"\\]|\\.)*","([^"]*)"')
    null_img_re = re.compile(r',null\](,?)\s*$')

    with open(target_path, encoding='utf-8-sig') as f:
        lines = f.readlines()

    total = 0
    patched = 0
    for i, line in enumerate(lines):
        m = part_re.match(line)
        if not m:
            continue
        total += 1
        nm = null_img_re.search(line)
        if not nm:
            continue
        part_num = m.group(1)
        lookup = part_num[len(strip_prefix):] if strip_prefix and part_num.startswith(strip_prefix) else part_num
        if lookup in image_map:
            trailing_comma = nm.group(1)
            lines[i] = line[:nm.start()] + ',"' + image_map[lookup] + '"]' + trailing_comma + '\n'
            patched += 1

    with open(target_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print(f"  {target_path}: {brand} rows scanned={total}, patched={patched}")

def main():
    args = sys.argv[1:]
    strip_prefix = None
    if args and args[0] == '--strip-prefix':
        strip_prefix = args[1]
        args = args[2:]
    brand, sema_path, *targets = args
    image_map = build_image_map(sema_path)
    print(f"{brand}: {len(image_map)} part numbers with a photo in SEMA export")
    for t in targets:
        patch_file(brand, image_map, t, strip_prefix)

if __name__ == '__main__':
    main()
