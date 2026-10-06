"""Render character sprites to PNG sheets: python3 tools/characters/render.py <outdir>"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw
sys.path.insert(0, str(Path(__file__).parent))
import sprites as S

def rgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def frame_img(rows, char, scale, dark=False):
    im = Image.new("RGBA", (32 * scale, 32 * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for y, row in enumerate(rows):
        for x, key in enumerate(row):
            col = S.color_of(key, char, dark)
            if col:
                d.rectangle([x * scale, y * scale, (x + 1) * scale - 1, (y + 1) * scale - 1], fill=rgb(col) + (255,))
    return im

if __name__ == "__main__":
    out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    for char in S.CHARACTERS:
        for anim in ("idle", "celebrate", "sleepy"):
            fr = S.frames(char, anim)
            sheet = Image.new("RGBA", (32 * len(fr), 32), (0, 0, 0, 0))
            for i, rows in enumerate(fr):
                sheet.paste(frame_img(rows, char, 1), (32 * i, 0))
            sheet.save(out / f"{char}-{anim}.png")
    # overview at 8x on light and dark
    chars = list(S.CHARACTERS)
    sc = 8
    for dark in (False, True):
        bg = rgb("#061720") if dark else rgb("#F1FCEA")
        ov = Image.new("RGB", (len(chars) * 32 * sc + (len(chars) + 1) * 16, 32 * sc + 32), bg)
        for i, char in enumerate(chars):
            im = frame_img(S.compose(char), char, sc, dark)
            ov.paste(im, (16 + i * (32 * sc + 16), 16), im)
        ov.save(out / f"overview-{'dark' if dark else 'light'}.png")
    # frames for the interactive preview: {char: {item: {anim: [frame rows...]}}}
    import json
    data = {"characters": {}, "items": {k: {"name": v["name"], "unlock": v["unlock"]} for k, v in S.ITEMS.items()}}
    for char, c in S.CHARACTERS.items():
        entry = {"name": c["name"], "unlock": c["unlock"], "B": c["B"], "b": c["b"], "frames": {}}
        for item in [None] + list(S.ITEMS):
            entry["frames"][item or "none"] = {
                a: [["".join(r) for r in fr] for fr in S.frames(char, a, item)]
                for a in ("idle", "celebrate", "sleepy")
            }
        data["characters"][char] = entry
    (out / "frames.json").write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    # items on every character, 6x
    sc = 6
    sheet = Image.new("RGB", (len(chars) * 32 * sc, len(S.ITEMS) * 32 * sc), rgb("#F1FCEA"))
    for j, item in enumerate(S.ITEMS):
        for i, char in enumerate(chars):
            im = frame_img(S.compose(char, item), char, sc)
            sheet.paste(im, (i * 32 * sc, j * 32 * sc), im)
    sheet.save(out / "items-check.png")
    print("ok")
