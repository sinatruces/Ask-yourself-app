# کرکترهای دیدیت (پیش‌نویس)

پیش‌نویس فنی کرکترها برای تصمیم D-035. اسپرایت‌های این پوشه **موقت‌ان**: طراح محصول کرکترهای نهایی رو تحویل می‌ده (D-036) و این ابزار برای آزمودن قالب، انیمیشن‌ها و ایده‌ی صفحه‌ی اصلی ساخته شده.

| فایل | کار |
|---|---|
| `sprites.py` | تعریف پیکسلی قالب بدن مشترک ۳۲×۳۲، شش کرکتر، سه وسیله و انیمیشن‌ها |
| `render.py` | خروجی PNG (شیت هر انیمیشن، نمای کلی روشن و تیره) و `frames.json` |
| `preview.tpl.html` + `build_preview.py` | صفحه‌ی پیش‌نمایش تعاملی: ایده‌ی صفحه‌ی اصلی و کلکسیون |
| `extract_sheet.py` | جدا کردن کرکترهای یک فایل EPS، AI یا PDF به PNG و SVG جدا (نیاز به Ghostscript و poppler) |
| `research_concept.py` | تصویر کرکتر کاندید با نوار XP برای پرسشنامه و مصاحبه‌ی تحقیق (D-047) |

```bash
python3 tools/characters/render.py build/characters
python3 tools/characters/build_preview.py build/characters/frames.json build/characters/preview.html
```

پیش‌نمایش منتشرشده: https://claude.ai/artifact/82z4kqHfvTwWGHQx1apNQT
