#!/usr/bin/env python3
"""Split a pixel-art character sheet (EPS, AI saved as EPS, or PDF) into one file per character.

Usage:
    python3 tools/characters/extract_sheet.py <sheet.eps|.ai|.pdf> <out_dir> [--prefix NAME]

Needs Ghostscript (gs) for EPS/AI and poppler (pdftocairo).

Output in <out_dir>:
    png/<prefix>-NN.png    1 px per art pixel, transparent background, centered on a square canvas
    svg/<prefix>-NN.svg    the same pixels as crisp SVG rectangles
    contact-sheet.png      every character with its number, for picking
    report.json            grid size per character, verification result and palette

Characters are numbered row by row from the top-left of the sheet, the order you see when
you open the file in Illustrator.
"""
import argparse
import json
import subprocess
import tempfile
from collections import Counter, deque
from pathlib import Path

from PIL import Image, ImageDraw


def rasterize(src: Path, work: Path) -> Image.Image:
    pdf = src
    if src.read_bytes()[:4] != b"%PDF":
        pdf = work / "sheet.pdf"
        subprocess.run(["gs", "-q", "-dNOPAUSE", "-dBATCH", "-dSAFER", "-dEPSCrop",
                        "-sDEVICE=pdfwrite", "-o", str(pdf), str(src)], check=True)
    subprocess.run(["pdftocairo", "-png", "-r", "72", "-singlefile", str(pdf), str(work / "sheet")], check=True)
    return Image.open(work / "sheet.png").convert("RGB")


def close(a, b, t=3):
    return all(abs(x - y) <= t for x, y in zip(a, b))


def estimate_cell(im, bg):
    """Size of one art pixel in render pixels, from the lengths of same-color runs along rows.

    Anti-aliasing leaves 1-2 px seams between art pixels; those are folded into the run before
    them, so a 24 px art pixel is not measured as 23.
    """
    W, H = im.size
    px = im.load()
    runs = Counter()
    for y in range(0, H, 7):
        seq, prev, n = [], None, 0
        for x in range(W):
            c = px[x, y]
            if c == prev:
                n += 1
            else:
                if prev is not None:
                    seq.append((prev, n))
                prev, n = c, 1
        seq.append((prev, n))
        merged = []
        for col, n in seq:
            if n <= 2 and merged:
                merged[-1][1] += n
            else:
                merged.append([col, n])
        for col, n in merged:
            if col != bg and 8 <= n <= 120:
                runs[n] += 1
    base = runs.most_common(1)[0][0]
    est = [n / round(n / base) for n, k in runs.items() for _ in range(k)
           if round(n / base) >= 1 and abs(n / base - round(n / base)) < 0.08]
    return sum(est) / len(est)


def blobs(im, bg, cell):
    """Group non-background pixels into characters using a coarse grid and flood fill."""
    W, H = im.size
    px = im.load()
    step = max(2, int(cell // 2))
    gw, gh = W // step + 1, H // step + 1
    occ = [[False] * gw for _ in range(gh)]
    for gy in range(gh):
        for gx in range(gw):
            x, y = min(W - 1, gx * step + step // 2), min(H - 1, gy * step + step // 2)
            occ[gy][gx] = not close(px[x, y], bg)
    seen = [[False] * gw for _ in range(gh)]
    reach = 3  # merge parts that are up to ~1.5 art pixels apart
    out = []
    for gy in range(gh):
        for gx in range(gw):
            if not occ[gy][gx] or seen[gy][gx]:
                continue
            q = deque([(gx, gy)])
            seen[gy][gx] = True
            cells = []
            while q:
                cx, cy = q.popleft()
                cells.append((cx, cy))
                for dy in range(-reach, reach + 1):
                    for dx in range(-reach, reach + 1):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < gw and 0 <= ny < gh and occ[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = True
                            q.append((nx, ny))
            xs = [c[0] for c in cells]
            ys = [c[1] for c in cells]
            out.append((min(xs) * step, min(ys) * step, (max(xs) + 1) * step, (max(ys) + 1) * step))
    return out


def tight_bbox(im, bg, box):
    px = im.load()
    x0, y0, x1, y1 = box
    W, H = im.size
    x0, y0, x1, y1 = max(0, x0 - 4), max(0, y0 - 4), min(W, x1 + 4), min(H, y1 + 4)
    xs = [x for x in range(x0, x1) for y in range(y0, y1, 2) if not close(px[x, y], bg)]
    ys = [y for y in range(y0, y1) for x in range(x0, x1, 2) if not close(px[x, y], bg)]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def sample(im, bg, box, cell):
    px = im.load()
    x0, y0, x1, y1 = box
    nc, nr = round((x1 - x0) / cell), round((y1 - y0) / cell)
    cw, ch = (x1 - x0) / nc, (y1 - y0) / nr
    grid = [[None] * nc for _ in range(nr)]
    for r in range(nr):
        for c in range(nc):
            p = px[int(x0 + (c + .5) * cw), int(y0 + (r + .5) * ch)]
            grid[r][c] = None if close(p, bg) else p
    bad = tot = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            c, r = min(int((x - x0) / cw), nc - 1), min(int((y - y0) / ch), nr - 1)
            fx, fy = (x - x0) / cw - c, (y - y0) / ch - r
            if min(fx, 1 - fx) * cw < 2 or min(fy, 1 - fy) * ch < 2:
                continue  # skip anti-aliased seams between art pixels
            tot += 1
            bad += not close(grid[r][c] or bg, px[x, y])
    return grid, nc, nr, bad / max(tot, 1)


def hexc(c):
    return "#%02X%02X%02X" % c


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--prefix", default="char")
    a = ap.parse_args()
    out = Path(a.out)
    (out / "png").mkdir(parents=True, exist_ok=True)
    (out / "svg").mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        im = rasterize(Path(a.src), Path(tmp))
    bg = Counter(im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()).most_common(1)[0][0]
    cell = estimate_cell(im, bg)
    print(f"art pixel = {cell:.2f} px at 72 dpi")
    boxes = [tight_bbox(im, bg, b) for b in blobs(im, bg, cell)]
    # reading order: rows (by vertical center, grouped within one character height), then left to right
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows, cur = [], []
    for b in boxes:
        if cur and (b[1] + b[3]) / 2 - (cur[0][1] + cur[0][3]) / 2 > cell * 6:
            rows.append(cur)
            cur = []
        cur.append(b)
    rows.append(cur)
    ordered = [b for row in rows for b in sorted(row, key=lambda b: b[0])]

    chars, palette = [], Counter()
    for b in ordered:
        grid, nc, nr, err = sample(im, bg, b, cell)
        chars.append((grid, nc, nr, err))
        for row in grid:
            palette.update(v for v in row if v)
    side = max(max(nc, nr) for _, nc, nr, _ in chars)
    report = {"source": Path(a.src).name, "background": hexc(bg), "art_pixel_pt": round(cell, 3),
              "canvas": side, "palette": [hexc(c) for c, _ in palette.most_common()], "characters": []}
    for i, (grid, nc, nr, err) in enumerate(chars, 1):
        name = f"{a.prefix}-{i:02d}"
        ox, oy = (side - nc) // 2, side - nr  # centered, standing on the bottom edge
        img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        paths = {}
        for r in range(nr):
            c = 0
            while c < nc:
                v = grid[r][c]
                if v:
                    s = c
                    while c < nc and grid[r][c] == v:
                        img.putpixel((ox + c, oy + r), v + (255,))
                        c += 1
                    paths.setdefault(hexc(v), []).append(f"M{ox + s} {oy + r}h{c - s}v1h{s - c}z")
                else:
                    c += 1
        img.save(out / "png" / f"{name}.png")
        body = "\n".join(f'  <path fill="{k}" d="{"".join(d)}"/>' for k, d in paths.items())
        (out / "svg" / f"{name}.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}" width="{side}" height="{side}" shape-rendering="crispEdges">\n{body}\n</svg>\n')
        report["characters"].append({"file": name, "grid": [nc, nr], "mismatch_pct": round(err * 100, 3)})

    cols = 7
    sc, pad = 8, 26
    tile = side * sc
    rows_n = (len(chars) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tile + pad) + pad, rows_n * (tile + pad + 14) + pad), (241, 252, 234))
    d = ImageDraw.Draw(sheet)
    for i in range(len(chars)):
        r, c = divmod(i, cols)
        x, y = pad + c * (tile + pad), pad + r * (tile + pad + 14)
        t = Image.open(out / "png" / f"{a.prefix}-{i + 1:02d}.png").resize((tile, tile), Image.NEAREST)
        sheet.paste(t, (x, y), t)
        d.text((x, y + tile + 2), f"{i + 1:02d}", fill=(6, 23, 32))
    sheet.save(out / "contact-sheet.png")
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    worst = max(ch["mismatch_pct"] for ch in report["characters"])
    print(f"{len(chars)} characters, canvas {side}x{side}, {len(report['palette'])} colors, worst mismatch {worst}%")


if __name__ == "__main__":
    main()
