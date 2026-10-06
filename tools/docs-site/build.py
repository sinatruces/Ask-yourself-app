#!/usr/bin/env python3
"""Build the branded Didit document site from the Markdown files in docs/.

Usage:
    pip install markdown
    python3 tools/docs-site/build.py [--out build/docs-site] [--hub-url URL]

Output:
    <out>/index.html      hub page (artifact main page: no <html>/<head>, the host adds them)
    <out>/<slug>.html     one full HTML page per document
    <out>/docs.css        shared styles (copied from tools/docs-site/docs.css)
    <out>/standalone/strategy.html
                          strategy as a single self-contained page (inline CSS), for the
                          older strategy link; needs --hub-url so its links point to the hub
"""
import argparse
import datetime
import html
import re
import shutil
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
LOGO = ROOT / "docs/02-brand/logo/svg"
BRANCH = "claude/bold-davinci-1gf74r"
REPO = "https://github.com/sinatruces/Ask-yourself-app"
IDENTITY_URL = "https://claude.ai/artifact/XXBDLh77GewD7nCdh1o24y"

# slug, source, group, one-line description
PAGES = [
    ("roadmap", "docs/00-roadmap.md", "پایه", "۱۳ مرحله‌ی محصول از استراتژی تا انتشار و وضعیت هر مرحله"),
    ("decisions", "docs/00-decision-log.md", "پایه", "همه‌ی تصمیم‌های قطعی پروژه با دلیل و تاریخ"),
    ("brainstorm", "docs/00-brainstorm.md", "پایه", "ایده‌ی اولیه، نقاط قوت، ریسک‌ها و پیشنهادها"),
    ("strategy", "docs/01-strategy/product-strategy.md", "استراتژی", "چشم‌انداز، جایگاه‌یابی، مسیر استراتژیک، مدل درآمد و متریک‌ها"),
    ("brand-platform", "docs/02-brand/brand-platform.md", "برند", "نام، شخصیت، ارزش‌ها و لحن"),
    ("palette", "docs/02-brand/palette.md", "برند", "رنگ‌های برند، طیف‌ها، توکن‌های تم و گزارش کنتراست"),
    ("logo-spec", "docs/02-brand/logo-spec.md", "برند", "الزامات فنی لوگو و آیکون برای اندروید، iOS و فروشگاه‌ها"),
    ("product-thinking", "docs/03-product-thinking/product-thinking.md", "محصول", "JTBD، حلقه‌ی اصلی، قوانین محصول و دامنه‌ی MVP"),
    ("survey", "docs/04-research/survey.md", "تحقیق", "پرسشنامه‌ی آنلاین کوتاه برای سنجش فرضیه‌ها"),
    ("interview-guide", "docs/04-research/interview-guide.md", "تحقیق", "راهنمای مصاحبه‌ی نیمه‌ساختاریافته به روش JTBD"),
]
EXTERNAL = {"docs/02-brand/visual-identity.md": IDENTITY_URL}
GROUPS = ["پایه", "استراتژی", "برند", "محصول", "تحقیق"]

FA_DIGITS = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")

STATUS = {
    "✅": '<span class="st ok" role="img" aria-label="تمام‌شده"></span>',
    "🟡": '<span class="st prog" role="img" aria-label="در حال انجام"></span>',
    "⬜": '<span class="st todo" role="img" aria-label="شروع نشده"></span>',
    "🔬": '<span class="tag hyp">فرضیه</span>',
    "❓": '<span class="tag ask">سؤال باز</span>',
    "⚠️": '<span class="tag warn" role="img" aria-label="نیاز به بررسی">!</span>',
    "⚠": '<span class="tag warn" role="img" aria-label="نیاز به بررسی">!</span>',
}


def svg_inline(path: Path, cls: str) -> str:
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"<title>.*?</title>\s*", "", s, flags=re.S)
    s = re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)
    return s.replace("<svg ", f'<svg class="{cls}" aria-hidden="true" focusable="false" ', 1).strip()


def logo(kind: str) -> str:
    """kind: lockup-fa-horizontal | symbol. Light and dark artwork, switched by CSS."""
    return (
        '<span class="logo" role="img" aria-label="دیدیت">'
        + svg_inline(LOGO / "color" / f"{kind}.svg", "logo-light")
        + svg_inline(LOGO / "on-dark" / f"{kind}.svg", "logo-dark")
        + "</span>"
    )


def slugify(value: str, separator: str = "-") -> str:
    # mirrors GitHub heading anchors, so links written for GitHub keep working
    value = re.sub(r"[^\w\- ]", "", value.lower())
    return value.replace(" ", separator)


def repo_link(path: str) -> str:
    p = ROOT / path
    kind = "tree" if path.endswith("/") or p.is_dir() else "blob"
    return f"{REPO}/{kind}/{BRANCH}/{path.rstrip('/')}"


def rewrite_links(body: str, source: str, page_of: dict, hub_url: str | None) -> str:
    src_dir = (ROOT / source).parent

    def fix(m):
        href = html.unescape(m.group(1))
        if re.match(r"^(https?:|mailto:|#)", href):
            return m.group(0)
        path, _, frag = href.partition("#")
        target = (src_dir / path).resolve()
        try:
            rel = target.relative_to(ROOT).as_posix()
        except ValueError:
            return m.group(0)
        if path.endswith("/"):
            rel += "/"
        if rel in EXTERNAL:
            new = EXTERNAL[rel]
        elif rel in page_of:
            # standalone pages live outside the hub, so they link to the hub itself
            new = hub_url or f"{page_of[rel]}.html" + (f"#{frag}" if frag else "")
        else:
            new = repo_link(rel)
        return f'href="{html.escape(new, quote=True)}"'

    return re.sub(r'href="([^"]+)"', fix, body)


LIST_ITEM = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s")


def loosen_lists(text: str) -> str:
    """GitHub lets a list start right after a paragraph line; Python-Markdown needs a blank line."""
    out, prev = [], ""
    for line in text.split("\n"):
        if LIST_ITEM.match(line) and prev.strip() and not LIST_ITEM.match(prev) and not prev.startswith(("    ", "\t", "|")):
            out.append("")
        out.append(line)
        prev = line
    return "\n".join(out)


def render(source: str, page_of: dict, hub_url: str | None = None):
    text = (ROOT / source).read_text(encoding="utf-8")
    text = re.sub(r'^<p align="center">.*?</p>\s*', "", text, flags=re.S)  # logo header used on GitHub
    m = re.match(r"#\s+(.+)\n", text)
    title = m.group(1).strip()
    text = text[m.end():]
    meta = ""
    mm = re.match(r"\s*(\*\*(?:نسخه|برای|وضعیت):\*\*.+?)\n\n", text)
    if mm:
        meta = markdown.markdown(mm.group(1)).removeprefix("<p>").removesuffix("</p>")
        text = text[mm.end():]
    text = loosen_lists(text)
    md = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists", "toc"],
                           extension_configs={"toc": {"slugify": slugify}})
    body = md.convert(text)
    body = rewrite_links(body, source, page_of, hub_url)

    def wrap_table(t):
        cols = len(re.findall(r"<th[ >]", t.group(0).split("</tr>")[0]))
        cls = ' class="wide"' if cols >= 4 else ""
        return f'<div class="table-wrap"><table{cls}>' + t.group(1) + "</table></div>"

    body = re.sub(r"<table>(.*?)</table>", wrap_table, body, flags=re.S)
    for k, v in STATUS.items():
        body = body.replace(k + "️", v).replace(k, v)
        meta = meta.replace(k, v)
    return title, meta, body


def page_html(slug, title, group, meta, body, source, hub_href, standalone_css=None):
    today = datetime.date.today().isoformat().translate(FA_DIGITS)
    head_css = f"<style>\n{standalone_css}\n</style>" if standalone_css else '<link rel="stylesheet" href="docs.css">'
    nav = f'<a class="chip" href="{html.escape(hub_href)}">همه‌ی اسناد دیدیت</a>'
    content = f"""<div class="wrap" dir="rtl" lang="fa">
  <header class="topbar"><nav>{nav}</nav></header>
  <section class="px cover" aria-label="جلد سند">
    {logo("lockup-fa-horizontal")}
    <span class="cover-rule" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <p class="eyebrow" style="margin:0">{html.escape(group)} · اسناد دیدیت</p>
    <h1>{html.escape(title)}</h1>
    {f'<p class="meta" style="margin:0">{meta}</p>' if meta else ''}
  </section>
  <main class="doc">
{body}
  </main>
  <footer class="foot">{logo("symbol")}<span>دیدیت · تمام چیزی که نیاز داری نظمه.</span><span>منبع: <code>{html.escape(source)}</code> · ساخته‌شده {today}</span></footer>
</div>"""
    head = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)} · دیدیت</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Estedad:wght@400..900&display=swap">
{head_css}"""
    if standalone_css:  # artifact main page: the host adds <html>, <head>, charset and viewport
        head = re.sub(r"<meta [^>]+>\n", "", head).replace(f"{html.escape(title)} · دیدیت", f"{html.escape(title)} دیدیت")
        return head + "\n" + content + "\n"
    return f'<!doctype html>\n<html lang="fa" dir="rtl">\n<head>\n{head}\n</head>\n<body>\n{content}\n</body>\n</html>\n'


def stages_from_roadmap():
    text = (ROOT / "docs/00-roadmap.md").read_text(encoding="utf-8")
    out = []
    for num, name, mark in re.findall(r"^## مرحله‌ی ([۰-۹]+): (.+?) (✅|🟡|⬜)\s*$", text, flags=re.M):
        out.append((num, name, {"✅": "ok", "🟡": "prog", "⬜": "todo"}[mark]))
    return out


def hub_html(cards):
    today = datetime.date.today().isoformat().translate(FA_DIGITS)
    stages = stages_from_roadmap()
    labels = {"ok": "تمام‌شده", "prog": "در حال انجام", "todo": "شروع نشده"}
    stage_items = "\n".join(
        f'      <li class="{"done" if s == "ok" else ""}"><span class="st {s}" role="img" aria-label="{labels[s]}"></span><b>{n}</b><span>{html.escape(name)}</span></li>'
        for n, name, s in stages)
    groups = []
    for g in GROUPS:
        items = [c for c in cards if c[2] == g]
        if not items:
            continue
        cards_html = "\n".join(
            f'      <a class="px card" href="{html.escape(href)}"><b>{html.escape(t)}</b><span>{html.escape(d)}</span>{f"<small>{html.escape(extra)}</small>" if extra else ""}</a>'
            for href, t, _, d, extra in items)
        groups.append(f'  <section>\n    <h2 class="sec-title">{g}</h2>\n    <div class="cards">\n{cards_html}\n    </div>\n  </section>')
    return f"""<title>اسناد دیدیت</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Estedad:wght@400..900&display=swap">
<link rel="stylesheet" href="docs.css">
<div class="wrap" dir="rtl" lang="fa">
  <section class="px hub-cover" aria-label="جلد">
    {logo("lockup-fa-horizontal")}
    <span class="cover-rule" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <h1>اسناد دیدیت</h1>
    <p class="tagline">تمام چیزی که نیاز داری نظمه.</p>
    <p>همه‌ی اسناد محصول دیدیت، از استراتژی تا هویت بصری، در یک‌جا. هر سند از فایل Markdown خودش در ریپازیتوری ساخته می‌شه.</p>
    <p class="meta" style="font-size:.84rem;color:var(--text-muted)">به‌روزرسانی {today}</p>
  </section>
  <section>
    <h2 class="sec-title">مسیر پروژه</h2>
    <ul class="stages">
{stage_items}
    </ul>
    <p class="legend"><span><span class="st ok"></span> تمام‌شده</span><span><span class="st prog"></span> در حال انجام</span><span><span class="st todo"></span> شروع نشده</span></p>
  </section>
{chr(10).join(groups)}
  <footer class="foot">{logo("symbol")}<span>دیدیت · Didit</span><span>منبع: <code>docs/</code> · ابزار ساخت: <code>tools/docs-site/build.py</code></span></footer>
</div>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "build/docs-site"))
    ap.add_argument("--hub-url", default=None, help="published hub URL, used by the standalone strategy page")
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    shutil.copy(HERE / "docs.css", out / "docs.css")
    page_of = {src: slug for slug, src, _, _ in PAGES}
    cards = []
    for slug, src, group, desc in PAGES:
        title, meta, body = render(src, page_of)
        (out / f"{slug}.html").write_text(page_html(slug, title, group, meta, body, src, "index.html"), encoding="utf-8")
        version = re.search(r"نسخه:</strong>\s*([^<·]+)", meta)
        cards.append((f"{slug}.html", title, group, desc, ("نسخه‌ی " + version.group(1).strip()) if version else ""))
    cards.insert(5, (IDENTITY_URL, "راهنمای هویت بصری", "برند", "لوگو، رنگ، تایپوگرافی، سیستم پیکسلی، آیکون و حرکت", "صفحه‌ی تعاملی جدا"))
    (out / "index.html").write_text(hub_html(cards), encoding="utf-8")
    if args.hub_url:
        sa = out / "standalone"
        sa.mkdir(exist_ok=True)
        title, meta, body = render("docs/01-strategy/product-strategy.md", page_of, hub_url=args.hub_url)
        css = (HERE / "docs.css").read_text(encoding="utf-8")
        (sa / "strategy.html").write_text(
            page_html("strategy", title, "استراتژی", meta, body, "docs/01-strategy/product-strategy.md", args.hub_url, standalone_css=css),
            encoding="utf-8")
    print(f"built {len(PAGES)} pages + hub in {out}")


if __name__ == "__main__":
    main()
