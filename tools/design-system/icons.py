"""Didit icon set: a named subset of Pixelarticons (MIT) plus a few custom icons. D-058.

    npm pack pixelarticons@2.4.2 && tar xzf pixelarticons-2.4.2.tgz
    python3 tools/design-system/icons.py package/

All icons sit on a 24 grid drawn in 2-unit steps (12x12 brand pixels, visual-identity.md §6),
fill="currentColor", no strokes.
"""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs/07-design-system/icons"
VERSION = "2.4.2"

# didit name -> (pixelarticons name, use)
SUBSET = {
    "today": ("home", "تب امروز"),
    "questions": ("list-box", "تب سؤال‌ها"),
    "collection": ("backpack", "تب کلکسیون"),
    "settings": ("settings-cog", "تنظیمات"),
    "add": ("plus", "ساخت سؤال"),
    "yes": ("check", "بله، انجام شد"),
    "close": ("close", "بستن"),
    "back": ("chevron-right", "برگشت (در راست‌به‌چپ رو به راست)"),
    "forward": ("chevron-left", "بعدی، ورود به جزئیات"),
    "expand": ("chevron-down", "باز کردن"),
    "reminder": ("bell", "یادآوری"),
    "reminder-off": ("bell-off", "یادآوری خاموش"),
    "calendar": ("calendar", "تقویم"),
    "time": ("clock", "ساعت"),
    "alarm": ("alarm-clock", "آلارم و یادآوری دقیق"),
    "streak": ("fire", "زنجیره"),
    "freeze": ("snowflake", "فریز"),
    "trophy": ("trophy", "کارنامه، بهترین زنجیره"),
    "level": ("crown", "سطح"),
    "xp": ("zap", "امتیاز تجربه"),
    "goal": ("target", "هدف بعدی"),
    "why": ("note", "«چرا برات مهمه؟»"),
    "share": ("share", "اشتراک"),
    "edit": ("pencil", "ویرایش"),
    "archive": ("archive", "بایگانی"),
    "delete": ("trash", "حذف"),
    "info": ("info-box", "توضیح"),
    "warning": ("warning-diamond", "هشدار ملایم"),
    "help": ("circle-question", "راهنما"),
    "sync": ("refresh", "همگام‌سازی"),
    "cloud": ("cloud", "پشتیبان"),
    "lock": ("lock", "قفل (کرکتر و وسیله)"),
    "account": ("user", "حساب"),
    "companions": ("users", "همراهان"),
    "show": ("eye", "نمایش"),
    "hide": ("eye-off", "پنهان کردن"),
    "battery": ("battery-low", "راهنمای باتری"),
    "phone": ("phone", "شماره موبایل"),
    "password": ("key", "رمز"),
    "theme-dark": ("moon", "تم تیره"),
    "theme-light": ("sun", "تم روشن"),
    "celebrate": ("sparkles", "لحظه‌ی جشن"),
    "gift": ("gift", "باز شدن وسیله"),
    "chart": ("chart-bar-big", "خلاصه‌ی هفتگی"),
    "more": ("more-vertical", "گزینه‌های بیشتر"),
    "undo": ("undo", "برگردوندن جواب"),
    "logout": ("logout", "خروج"),
    "language": ("languages", "زبان"),
}

# custom icons on the 12x12 brand grid ('#' = one 2x2 cell), same rules as Pixelarticons
CUSTOM = {
    "medal": ("مدال", [
        ".#........#.",
        "..#......#..",
        "...#....#...",
        "....####....",
        "...#....#...",
        "..#......#..",
        "..#..##..#..",
        "..#.####.#..",
        "..#..##..#..",
        "...#....#...",
        "....####....",
        "............",
    ]),
    "offline": ("آفلاین", [
        "#...........",
        ".#..........",
        "..#.........",
        "...#.###....",
        "....#...#...",
        "..##.#...#..",
        ".#..#.#..##.",
        "#......#...#",
        "#.......#..#",
        "#........#.#",
        ".##########.",
        "...........#",
    ]),
}


def custom_svg(rows):
    d = []
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            if row[x] == "#":
                s = x
                while x < len(row) and row[x] == "#":
                    x += 1
                d.append(f"M{s * 2} {y * 2}h{(x - s) * 2}v2h-{(x - s) * 2}z")
            else:
                x += 1
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">\n'
            f'  <path d="{"".join(d)}"/>\n</svg>\n')


def main(pkg):
    pkg = Path(pkg)
    src = pkg / "svg"
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "svg").mkdir(parents=True)
    manifest = {}
    for name, (pa, use) in SUBSET.items():
        shutil.copy(src / f"{pa}.svg", OUT / "svg" / f"{name}.svg")
        manifest[name] = {"source": f"pixelarticons/{pa}", "use": use}
    for name, (use, rows) in CUSTOM.items():
        assert len(rows) == 12 and all(len(r) == 12 for r in rows), name
        (OUT / "svg" / f"{name}.svg").write_text(custom_svg(rows), encoding="utf-8")
        manifest[name] = {"source": "didit (custom)", "use": use}
    shutil.copy(pkg / "LICENSE", OUT / "LICENSE-pixelarticons.txt")
    (OUT / "icons.json").write_text(json.dumps(
        {"$description": f"Didit icons. Pixelarticons {VERSION} (MIT, Gerrit Halfmann) + custom. 24 grid, currentColor.",
         "icons": manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


if __name__ == "__main__":
    m = main(sys.argv[1])
    print(f"{len(m)} icons -> {OUT}")
