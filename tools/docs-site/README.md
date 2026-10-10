# ساخت اسناد برندشده

این ابزار هر سند Markdown در `docs/` رو به یک صفحه‌ی HTML با هویت بصری دیدیت تبدیل می‌کنه: جلد با لوگو، رنگ‌ها و فونت برند، سیستم پیکسلی، و تم روشن و تیره.

## ساخت

```bash
pip install markdown
python3 tools/docs-site/build.py --hub-url https://claude.ai/artifact/F2sPDzLa4rNtELc2TcVoNi
```

خروجی در `build/docs-site/` ساخته می‌شه (در git نیست):

| فایل | محتوا |
|---|---|
| `index.html` | صفحه‌ی اصلی مجموعه: مسیر پروژه و فهرست اسناد |
| `<slug>.html` | یک صفحه برای هر سند |
| `docs.css` | استایل مشترک (کپی از `tools/docs-site/docs.css`) |
| `standalone/strategy.html` | استراتژی به‌صورت صفحه‌ی تکی، برای لینک قدیمی استراتژی |

## صفحه‌های منتشرشده

| صفحه | لینک | منبع |
|---|---|---|
| مجموعه‌ی اسناد | https://claude.ai/artifact/F2sPDzLa4rNtELc2TcVoNi | `build/docs-site/index.html` + همه‌ی صفحه‌ها و `docs.css` |
| استراتژی (لینک قدیمی) | https://claude.ai/artifact/6JyCzwp5pP84ZGhKE1CDU5 | `build/docs-site/standalone/strategy.html` |
| راهنمای هویت بصری (صفحه‌ی تعاملی جدا) | https://claude.ai/artifact/XXBDLh77GewD7nCdh1o24y | دستی ساخته شده |

بعد از هر تغییر در اسناد: build رو اجرا کن و مجموعه رو با همون لینک دوباره منتشر کن.

## افزودن سند جدید

1. بالای فایل Markdown، بلوک لوگو رو مثل بقیه‌ی اسناد بذار (ابزار ساخت اون رو حذف می‌کنه و جلد خودش رو می‌سازه).
2. سند رو به فهرست `PAGES` در `build.py` اضافه کن.
3. تصویرهایی که سند با مسیر نسبی استفاده می‌کنه (مثل `assets/character-concept.png`) خودکار کنار صفحه‌ها کپی می‌شن؛ موقع انتشار اون‌ها رو هم با همون مسیر بفرست.
