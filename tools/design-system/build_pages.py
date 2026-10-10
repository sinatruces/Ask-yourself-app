"""Build the design-system HTML pages (D-058) into build/design-system/.

    python3 tools/design-system/build_tokens.py     # first, if tokens changed
    python3 tools/design-system/build_pages.py

Pages:
  characters.html   character selection (candidates, brand recolors, 6 release slots)
  components.html   interactive component showcase, light and dark
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from character_palettes import MAPS  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
PAGES = Path(__file__).parent / "pages"
OUT = ROOT / "build/design-system"
CAND = ROOT / "docs/02-brand/characters/candidates"
DS = ROOT / "docs/07-design-system"

# from docs/02-brand/characters/candidates/README.md (notes 4 and 5)
FLAGS = {
    "a": {2: "ترسناک", 11: "ترسناک", 18: "ترسناک", 23: "ترسناک", 28: "ترسناک", 39: "ترسناک", 6: "Minecraft"},
    "b": {38: "ترسناک", 41: "ترسناک"},
}
# Claude's suggested tags, only where the animal is clear
ANIMALS = {"a": {8, 38}, "b": {5, 6, 9, 11, 12, 13, 16, 26, 27, 29, 30, 33, 35, 36, 37, 42}}

SLOTS = [
    {"key": "start1", "label": "شروع ۱", "hint": "سطح ۱"},
    {"key": "start2", "label": "شروع ۲", "hint": "سطح ۱"},
    {"key": "l3", "label": "سطح ۳", "hint": "کرکتر تازه"},
    {"key": "l5", "label": "سطح ۵", "hint": "کرکتر تازه"},
    {"key": "l8", "label": "سطح ۸", "hint": "کرکتر تازه"},
    {"key": "l10", "label": "سطح ۱۰", "hint": "ویژه‌ی «عادت شد»"},
]


def hexof(p):
    return "#%02X%02X%02X" % p[:3]


def character_data():
    palette = json.loads((CAND / "set-a/report.json").read_text())["palette"]
    index = {h: i for i, h in enumerate(palette)}
    chars = []
    for s in "ab":
        for f in sorted((CAND / f"set-{s}/png").glob("*.png")):
            n = int(f.stem.split("-")[1])
            im = Image.open(f).convert("RGBA")
            rows = []
            for y in range(16):
                row = ""
                for x in range(16):
                    p = im.getpixel((x, y))
                    row += "." if p[3] < 128 else format(index[hexof(p)], "x")
                rows.append(row)
            flag = FLAGS[s].get(n)
            chars.append({"id": f.stem, "set": s, "n": n, "label": f"{s.upper()}-{n:02d}", "rows": rows,
                          "flags": [flag] if flag else [], "tags": ["حیوان"] if n in ANIMALS[s] else []})
    return {"palette": palette, "maps": MAPS, "chars": chars, "slots": SLOTS}


def logo():
    out = []
    for kind, cls in (("color", "logo logo-light"), ("on-dark", "logo logo-dark")):
        svg = (ROOT / f"docs/02-brand/logo/svg/{kind}/lockup-fa-horizontal.svg").read_text("utf-8")
        svg = re.sub(r"<\?xml[^>]*>\s*", "", svg)
        svg = re.sub(r'\swidth="[^"]*"\sheight="[^"]*"', "", svg, count=1)
        svg = svg.replace("<svg ", f'<svg class="{cls}" role="img" aria-label="دیدیت" ', 1)
        out.append(svg.strip())
    return "".join(out)


def fill(template, **parts):
    html = (PAGES / template).read_text("utf-8")
    html = html.replace("/*{{TOKENS_CSS}}*/", (DS / "tokens/tokens.css").read_text("utf-8"))
    html = html.replace("/*{{PIXEL_CSS}}*/", (PAGES / "pixel.css").read_text("utf-8"))
    html = html.replace("{{LOGO}}", logo())
    for k, v in parts.items():
        html = html.replace(f"/*{{{{{k}}}}}*/null", json.dumps(v, ensure_ascii=False, separators=(",", ":")))
    assert "{{" not in html, re.findall(r"\{\{\w+\}\}", html)
    return html


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "characters.html").write_text(fill("characters.html", DATA=character_data()), encoding="utf-8")
    if (PAGES / "components.html").exists():
        (OUT / "components.html").write_text(fill("components.html", DATA=showcase_data()), encoding="utf-8")
    print(f"pages -> {OUT.relative_to(ROOT)}")


def showcase_data():
    icons = {}
    for f in sorted((DS / "icons/svg").glob("*.svg")):
        m = re.findall(r'<path[^>]*d="([^"]+)"', f.read_text())
        icons[f.stem] = m
    numerals = json.loads((DS / "numerals/numerals.json").read_text("utf-8"))
    cd = character_data()
    return {"icons": icons, "numerals": numerals, "palette": cd["palette"], "maps": cd["maps"],
            "chars": {c["id"]: c["rows"] for c in cd["chars"] if c["id"] in ("b-05", "b-16", "b-33")}}


if __name__ == "__main__":
    main()
