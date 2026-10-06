#!/usr/bin/env python3
"""Concept image for survey Q14 and the interview: one candidate character with an
XP bar, next to two locked silhouettes. No Didit logo or name (D-047).

Usage: python3 tools/characters/research_concept.py
Output: docs/04-research/assets/character-concept.png
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PNG = ROOT / "docs/02-brand/characters/candidates/set-b/png"
OUT = ROOT / "docs/04-research/assets/character-concept.png"

NIGHT, LEAF, SPROUT, FOREST = (6, 23, 32), (133, 192, 108), (223, 248, 207), (52, 104, 86)
S = 12  # screen pixels per art pixel


def sprite(name, locked=False):
    im = Image.open(PNG / f"{name}.png").convert("RGBA")
    if locked:  # flat silhouette in forest green
        px = im.load()
        for y in range(im.height):
            for x in range(im.width):
                if px[x, y][3]:
                    px[x, y] = (*FOREST, 255)
    return im.resize((im.width * S, im.height * S), Image.NEAREST)


def box(img, x, y, w, h, fill, border=NIGHT, t=2 * S // 4):
    """Pixel box: stepped corners, 2px border, hard shadow down."""
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    d.rectangle([x + t, y + h, x + w, y + h + t], fill=NIGHT)  # shadow
    d.rectangle([x, y, x + w - 1, y + h - 1], fill=border)
    d.rectangle([x + t, y + t, x + w - 1 - t, y + h - 1 - t], fill=fill)
    for cx, cy in [(x, y), (x + w - t, y), (x, y + h - t), (x + w - t, y + h - t)]:
        d.rectangle([cx, cy, cx + t - 1, cy + t - 1], fill=SPROUT)


W, H = 16 * S * 3 + 4 * S * 4, 16 * S + 12 * S
img = Image.new("RGB", (W, H), SPROUT)
# right to left: active character first (RTL), then two locked ones
order = [("b-12", False), ("b-05", True), ("b-16", True)]
x = W - 2 * S - 16 * S
for name, locked in order:
    sp = sprite(name, locked)
    img.paste(sp, (x, 2 * S), sp)
    x -= 16 * S + 4 * S
# XP bar under the active character, filling right to left
bx, by, bw, bh = W - 2 * S - 16 * S, 2 * S + 16 * S + 3 * S, 16 * S, 3 * S
box(img, bx, by, bw, bh, SPROUT)
fill_w = int((bw - S) * 0.6)
from PIL import ImageDraw
ImageDraw.Draw(img).rectangle([bx + bw - S // 2 - fill_w, by + S // 2, bx + bw - S // 2 - 1, by + bh - S // 2 - 1], fill=LEAF)
OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT)
print(OUT, img.size)
