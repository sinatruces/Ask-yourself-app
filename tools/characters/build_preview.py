"""Build the interactive character preview page: python3 tools/characters/build_preview.py <frames.json> <out.html>"""
import json, re, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
LOGO = ROOT / "docs/02-brand/logo/svg"

def svg(path, cls):
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"<title>.*?</title>\s*", "", s, flags=re.S)
    s = re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)
    return s.replace("<svg ", f'<svg class="{cls}" aria-hidden="true" focusable="false" ', 1).strip()

data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
tpl = (HERE / "preview.tpl.html").read_text(encoding="utf-8")
chips = "\n        ".join(f'<button type="button" class="chip" data-item="{k}" aria-pressed="false">{v["name"]}</button>' for k, v in data["items"].items())
logo = svg(LOGO / "color/lockup-fa-horizontal.svg", "logo-light") + svg(LOGO / "on-dark/lockup-fa-horizontal.svg", "logo-dark")
out = tpl.replace("{{DATA}}", json.dumps(data, ensure_ascii=False, separators=(",", ":"))).replace("{{ITEM_CHIPS}}", chips).replace("{{LOGO}}", logo)
assert "{{" not in out
Path(sys.argv[2]).write_text(out, encoding="utf-8")
print("preview", len(out) // 1024, "KB")
