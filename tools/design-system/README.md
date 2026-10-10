<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../docs/02-brand/logo/svg/on-dark/lockup-fa-horizontal.svg">
    <img src="../../docs/02-brand/logo/svg/color/lockup-fa-horizontal.svg" alt="دیدیت" width="260">
  </picture>
</p>

# ابزارهای دیزاین سیستم

اسکریپت‌هایی که خروجی‌های [دیزاین سیستم](../../docs/07-design-system/design-system.md) رو می‌سازن (D-058). همه با Python 3 و Pillow کار می‌کنن.

| اسکریپت | کار | خروجی |
|---|---|---|
| `build_tokens.py` | توکن‌های برند و دیزاین سیستم رو ترکیب می‌کنه؛ با `--check` کنتراست جفت‌های کلیدی رو چک می‌کنه | `docs/07-design-system/tokens/` (CSS، Dart، JSON) |
| `pixel_numerals.py` | رقم‌های پیکسلی فارسی؛ با `--preview` تصویر نمونه | `docs/07-design-system/numerals/` |
| `icons.py` | زیرمجموعه‌ی Pixelarticons و آیکون‌های اختصاصی | `docs/07-design-system/icons/` |
| `character_palettes.py` | نگاشت رنگ کاندیدهای کرکتر به پالت برند (دو پیشنهاد) | ماژول، استفاده در `build_pages.py` |
| `build_pages.py` | دو صفحه‌ی تعاملی از قالب‌های `pages/` | `build/design-system/characters.html` و `components.html` |

```bash
python3 tools/design-system/build_tokens.py --check
python3 tools/design-system/pixel_numerals.py --preview
npm pack pixelarticons@2.4.2 && tar xzf pixelarticons-2.4.2.tgz   # فقط برای icons.py، در یک پوشه‌ی موقت
python3 tools/design-system/icons.py <مسیر package>
python3 tools/design-system/build_pages.py
```

## انتشار صفحه‌ها

| صفحه | لینک | فایل |
|---|---|---|
| کامپوننت‌ها | https://claude.ai/artifact/3sSuWEtZGgnKJcAGbh33Kt | `build/design-system/components.html` |
| انتخاب کرکترها | https://claude.ai/artifact/JM4KBx5EyVazMasQeogWsv | `build/design-system/characters.html` (با قابلیت `db`؛ انتخاب طراح در سند `picks/current` ذخیره می‌شه) |

صفحه‌ها توکن‌ها رو از `tokens.css` و قواعد پیکسلی رو از `pages/pixel.css` می‌گیرن، پس بعد از تغییر توکن، اول `build_tokens.py` و بعد `build_pages.py` رو اجرا کن و هر دو صفحه رو با همون لینک دوباره منتشر کن.
