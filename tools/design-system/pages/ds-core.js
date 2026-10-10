/* Didit design system — primitives and the component registry.
   Every component is one registry entry; docs pages and the playground are both generated from it. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const camel = (s) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const live = (t) => { const el = $("#live"); if (el) { el.textContent = ""; setTimeout(() => { el.textContent = t; }, 30); } };

/* ---------- primitives ---------- */
function icon(name, size = 24, label) {
  const paths = (DATA.icons[name] || []).map((d) => `<path d="${d}"/>`).join("");
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : `aria-hidden="true"`;
  return `<svg class="dd-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" ${a11y}>${paths}</svg>`;
}
const LATIN_TO_FA = { 0: "۰", 1: "۱", 2: "۲", 3: "۳", 4: "۴", 5: "۵", 6: "۶", 7: "۷", 8: "۸", 9: "۹", "%": "٪" };
function pxnum(text, unit = 4, label) {
  const N = DATA.numerals;
  const chars = [...String(text)].map((c) => LATIN_TO_FA[c] || c).filter((c) => N.glyphs[c]);
  let x = 0, rects = "";
  chars.forEach((c, i) => {
    if (i) x += N.gap;
    const g = N.glyphs[c];
    g.rows.forEach((row, y) => {
      let k = 0;
      while (k < row.length) {
        if (row[k] === "#") { const s = k; while (k < row.length && row[k] === "#") k++; rects += `<rect x="${x + s}" y="${y}" width="${k - s}" height="1"/>`; }
        else k++;
      }
    });
    x += g.width;
  });
  return `<svg class="pxnum" width="${x * unit}" height="${N.height * unit}" viewBox="0 0 ${x} ${N.height}" fill="currentColor" role="img" aria-label="${esc(label || fa(text))}">${rects}</svg>`;
}
function medalSvg(days, size = 60, locked = false, special = false) {
  const n = 15, c = 7;
  let fill = "", line = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const d = Math.hypot(x - c, y - c);
    if (d > 7.4) continue;
    (d > 6.2 ? (s) => { line += s; } : (s) => { fill += s; })(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
  }
  const unit = size >= 100 ? 4 : 2;
  const ribbon = special && !locked ? `<span style="position:absolute;bottom:-6px;width:${size * 0.6}px;height:8px;background:var(--dd-primary);outline:2px solid var(--dd-outline)"></span>` : "";
  return `<span style="position:relative;display:inline-grid;place-items:center;width:${size}px;height:${size}px;flex:none" role="img" aria-label="مدال ${fa(days)} روز${locked ? "، قفل" : ""}">
    <svg width="${size}" height="${size}" viewBox="0 0 ${n} ${n}" aria-hidden="true" style="position:absolute;inset:0" shape-rendering="crispEdges">
      <g fill="var(${locked ? "--dd-track" : "--dd-medal"})">${fill}</g><g fill="var(--dd-outline)">${line}</g></svg>
    <span style="position:relative;color:var(${locked ? "--dd-text-muted" : "--dd-on-medal"})" aria-hidden="true">${pxnum(days, unit)}</span>${ribbon}</span>`;
}
function ringHTML(value, total = 30, mode = "days") {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const center = mode === "percent" ? `${pxnum(pct + "%", 3)}<small>پایبندی</small>` : `${pxnum(value, 4)}<small>از ${fa(total)} روز</small>`;
  const label = mode === "percent" ? `پایبندی ۳۰ روزه: ${fa(pct)} درصد` : `پایبندی: ${fa(value)} روز از ${fa(total)} روز`;
  return `<div class="ring-wrap" role="img" aria-label="${label}"><canvas width="28" height="28" data-ring="${value}/${total}" aria-hidden="true"></canvas><div class="ring-c" aria-hidden="true">${center}</div></div>`;
}
function drawRing(cv) {
  const [v, t] = cv.dataset.ring.split("/").map(Number);
  const cs = getComputedStyle(cv);
  const col = { line: cs.getPropertyValue("--dd-outline").trim(), fill: cs.getPropertyValue("--dd-primary").trim(), track: cs.getPropertyValue("--dd-track").trim() };
  const g = cv.getContext("2d"), n = 28, c = 13.5, frac = t ? v / t : 0;
  g.clearRect(0, 0, n, n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const dx = x - c, dy = y - c, d = Math.hypot(dx, dy);
    if (d > 14 || d < 9.2) continue;
    let color;
    if (d > 12.8 || d < 10.4) color = col.line;
    else { let a = Math.atan2(-dx, -dy); if (a < 0) a += Math.PI * 2; color = a / (Math.PI * 2) < frac ? col.fill : col.track; } // counter-clockwise from top (RTL)
    g.fillStyle = color; g.fillRect(x, y, 1, 1);
  }
}
const SPRITE_SCALE = { sm: 3, md: 6, lg: 10 };
function spriteHTML(id = "b-05", scale = 3, mood = "idle") {
  const cls = { idle: "idle", celebrate: "celebrate", accompany: "nod", sleepy: "sleepy", still: "" }[mood] ?? "idle";
  const c = `<canvas class="sprite ${cls}" width="${16 * scale}" height="${16 * scale}" data-sprite="${id}" style="--sp:${scale}px" aria-hidden="true"></canvas>`;
  return mood === "sleepy" ? `<span style="position:relative;display:inline-block">${c}<span class="zz" aria-hidden="true">z z</span></span>` : c;
}
function drawSprite(cv) {
  const rows = DATA.chars[cv.dataset.sprite]; if (!rows) return;
  const s = cv.width / 16, g = cv.getContext("2d");
  g.clearRect(0, 0, cv.width, cv.height);
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === ".") return;
    g.fillStyle = DATA.maps.brand5[DATA.palette[parseInt(ch, 16)]];
    g.fillRect(x * s, y * s, s, s);
  }));
}
function barHTML(pct, tone = "leaf", label = "پیشرفت") {
  pct = Math.max(0, Math.min(100, pct));
  return `<div class="px bar ${tone === "gold" ? "gold" : ""}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}" aria-label="${esc(label)}"><i style="width:calc((100% - 4px) * ${pct / 100})"></i></div>`;
}
function hydrate(root = document) {
  $$("canvas[data-ring]", root).forEach(drawRing);
  $$("canvas[data-sprite]", root).forEach(drawSprite);
  requestAnimationFrame(() => $$(".bar > i", root).forEach((i) => {
    const full = i.parentElement.clientWidth - 4; if (full <= 0) return;
    const pct = +i.parentElement.getAttribute("aria-valuenow") / 100;
    i.style.width = Math.round((full * pct) / 4) * 4 + "px";
  }));
}
const bw = (inner, opts = "") => `<span class="bw lift ${opts}">${inner}</span>`;

/* ---------- Dart code helpers ---------- */
const dq = (s) => `'${String(s).replace(/'/g, "\\'")}'`;
const di = (n) => `DdIcons.${camel(n)}`;
function dart(widget, args) {
  const lines = args.filter(Boolean).map((a) => `  ${a},`);
  return `${widget}(\n${lines.join("\n")}\n)`;
}
const ICON_OPTS = () => [["none", "بدون آیکون"], ...Object.keys(DATA.icons).map((k) => [k, k])];

/* ---------- shared data ---------- */
const CHAIN30 = "yes yes no yes yes yes off yes yes yes yes freeze yes yes off yes yes yes yes yes no yes yes off yes yes yes yes yes today".split(" ");
const CELL_LABEL = { yes: "بله", no: "خیر", freeze: "فریز", missed: "بی‌پاسخ", off: "بدون برنامه", today: "امروز", future: "آینده" };
const REASONS = ["وقت نشد", "یادم رفت", "حالم خوب نبود", "نخواستم", "دلیل دیگه"];
const WEEKDAYS = [["ش", "شنبه"], ["ی", "یکشنبه"], ["د", "دوشنبه"], ["س", "سه‌شنبه"], ["چ", "چهارشنبه"], ["پ", "پنجشنبه"], ["ج", "جمعه"]];
const MEDALS = [7, 21, 30, 66, 100, 365];

/* ---------- render functions ---------- */
const R = {
  button(p) {
    const st = p.state || "normal";
    const content = st === "loading" ? `<span class="loader" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr">در حال ارسال</span>` : `${p.icon && p.icon !== "none" ? icon(p.icon) : ""}${esc(p.label)}`;
    const cls = `px d-btn ${p.variant} ${p.size === "sm" ? "sm" : ""} ${st === "pressed" ? "is-pressed" : ""}`;
    const btn = `<button class="${cls}" type="button" ${st === "disabled" ? "disabled" : ""} ${st === "loading" ? 'aria-busy="true"' : ""}>${content}</button>`;
    return p.variant === "text" ? `<span class="bw ${p.block ? "block" : ""}">${btn}</span>` : bw(btn, p.block ? "block" : "");
  },
  iconButton(p) {
    if (p.kind === "fab") return bw(`<button class="px fab ${p.state === "pressed" ? "is-pressed" : ""}" type="button" aria-label="${esc(p.label)}">${icon(p.icon)}</button>`);
    return `<button class="ibtn" type="button" aria-label="${esc(p.label)}" ${p.state === "disabled" ? "disabled" : ""}>${icon(p.icon)}</button>`;
  },
  answerButton(p) {
    const yes = p.kind === "yes";
    const st = p.state || "normal";
    return `<span class="bw lift" style="width:11rem;display:inline-block"><button class="px ans ${yes ? "" : "no"} ${st === "pressed" ? "is-pressed" : ""}" type="button" ${st === "disabled" ? "disabled" : ""} data-act="toggle">${yes ? icon("yes") : ""}${yes ? "بله" : "خیر"}</button></span>`;
  },
  icon(p) { return `<span style="color:${p.tone === "muted" ? "var(--dd-text-muted)" : p.tone === "brand" ? "var(--dd-yes-text)" : p.tone === "gold" ? "var(--dd-medal-text)" : "var(--dd-text)"}">${icon(p.name, +p.size, p.name)}</span>`; },
  pixelNumber(p) { return `<span style="color:${p.tone === "gold" ? "var(--dd-medal-text)" : p.tone === "brand" ? "var(--dd-yes-text)" : "var(--dd-text)"}">${pxnum(p.value, +p.unit)}</span>`; },
  tag(p) { return `<span class="tag ${p.tone === "neutral" ? "" : p.tone}">${p.icon && p.icon !== "none" ? icon(p.icon, 24) : ""}${esc(p.label)}</span>`; },
  chip(p) { return `<span class="px-lift-low"><button class="px px-sm chip" type="button" aria-pressed="${!!p.selected}" ${p.disabled ? "disabled" : ""} data-act="toggle">${p.icon && p.icon !== "none" ? icon(p.icon) : ""}${esc(p.label)}</button></span>`; },
  textInput(p) {
    const ltr = p.dir === "ltr" ? "ltr" : "";
    const pw = p.type === "password";
    return `<div class="field ${p.state === "error" ? "err" : ""} ${p.state === "disabled" ? "off" : ""}" style="max-width:18rem"><div class="ctl ${p.state === "focus" ? "is-focus" : ""}">${p.icon && p.icon !== "none" ? icon(p.icon) : ""}<input class="${ltr}" type="${pw && !p.reveal ? "password" : "text"}" value="${esc(p.value)}" placeholder="${esc(p.placeholder)}" aria-label="${esc(p.placeholder || "ورودی")}" ${p.state === "disabled" ? "disabled" : ""}>${pw ? `<button class="ibtn" type="button" aria-label="${p.reveal ? "پنهان کردن رمز" : "نمایش رمز"}" data-act="reveal">${icon(p.reveal ? "hide" : "show")}</button>` : ""}</div></div>`;
  },
  switch(p) { return `<span class="sw-l">${p.label ? `<span>${esc(p.label)}</span>` : ""}<button class="sw-t" type="button" role="switch" aria-checked="${!!p.on}" aria-label="${esc(p.label || "سوییچ")}" ${p.disabled ? "disabled" : ""} data-act="toggle"></button></span>`; },
  chainCell(p) {
    const lg = p.size === "calendar";
    const inner = lg ? (p.state === "freeze" ? icon("freeze") : p.state === "off" ? fa(p.day) : fa(p.day)) : "";
    return `<span class="cell ${p.state} ${lg ? "lg" : ""}" role="img" aria-label="${lg ? fa(p.day) + " مهر: " : ""}${CELL_LABEL[p.state]}">${inner}</span>`;
  },
  progressBar(p) { return `<div style="width:100%;max-width:18rem">${barHTML(+p.value, p.tone, p.tone === "gold" ? "XP تا سطح بعد" : "پیشرفت")}</div>`; },
  sprite(p) {
    const s = SPRITE_SCALE[p.size] || 3;
    const sp = spriteHTML(p.id, s, p.mood);
    return p.plate ? `<div class="lift"><div class="px plate" style="padding:${s * 2}px">${sp}</div></div>` : sp;
  },
  medal(p) { return `<span class="medal">${medalSvg(+p.days, +p.size, !!p.locked, +p.days === 66)}<span>${p.locked ? "قفل" : +p.days === 66 ? "عادت شد" : fa(p.days) + " روز"}</span></span>`; },

  answerPair(p) {
    if (p.state === "open") return `<div class="pair">${bw(`<button class="px ans" type="button" data-act="answer" data-val="yes" ${p.disabled ? "disabled" : ""}>${icon("yes")}بله</button>`)}${bw(`<button class="px ans no" type="button" data-act="answer" data-val="no" ${p.disabled ? "disabled" : ""}>خیر</button>`)}</div>`;
    const yes = p.state === "yes";
    return `<div class="qc w100"><div class="done ${yes ? "" : "neutral"}"><span>${yes ? icon("yes") + "انجام شد" : "ثبت شد"}</span>${R.button({ variant: "text", label: "عوضش کن" }).replace("<button", '<button data-act="undo"')}</div></div>`;
  },
  field(p) {
    const err = p.state === "error";
    return `<div class="field ${err ? "err" : ""} ${p.state === "disabled" ? "off" : ""}"><span class="flabel">${esc(p.label)}${p.required ? " *" : ""}</span><div class="ctl ${p.state === "focus" ? "is-focus" : ""}">${p.icon && p.icon !== "none" ? icon(p.icon) : ""}<input class="${p.dir === "ltr" ? "ltr" : ""}" value="${esc(p.value)}" aria-label="${esc(p.label)}" ${p.state === "disabled" ? "disabled" : ""}></div>${err ? `<span class="help" role="alert">${esc(p.error)}</span>` : p.help ? `<span class="help">${esc(p.help)}</span>` : ""}</div>`;
  },
  otpField(p) {
    const n = +p.length, f = Math.min(+p.filled, n), digits = "481926".split("");
    const cells = Array.from({ length: n }, (_, i) => `<span class="${i === f && p.state !== "error" ? "on" : ""}">${i < f ? fa(digits[i]) : ""}</span>`).join("");
    const foot = p.state === "error" ? `<small class="e" role="alert">کد درست نیست. دوباره امتحان کن یا کد تازه بگیر.</small>` : `<small>ارسال دوباره تا ${fa("0:" + String(+p.seconds).padStart(2, "0"))}</small>`;
    return `<div class="otp-w"><div class="otp ${p.state === "error" ? "err" : ""}" role="group" aria-label="کد تأیید ${fa(n)} رقمی">${cells}</div>${foot}</div>`;
  },
  weekdayPicker(p) {
    const on = p.days;
    const chips = WEEKDAYS.map(([s, full], i) => `<span class="px-lift-low"><button class="px px-sm chip" type="button" aria-pressed="${on[i] === "1"}" aria-label="${full}" data-act="day" data-val="${i}">${s}</button></span>`).join("");
    const presets = [["1111111", "هر روز"], ["1111100", "شنبه تا چهارشنبه"], ["0000011", "آخر هفته"]].map(([v, l]) => `<button class="px px-sm chip" type="button" aria-pressed="${on === v}" style="min-height:32px;font-size:12px" data-act="preset" data-val="${v}">${l}</button>`).join("");
    return `<div class="wd-w"><div class="weekday" role="group" aria-label="روزهای هفته">${chips}</div>${p.presets ? `<div class="chip-row">${presets}</div>` : ""}</div>`;
  },
  timePicker(p) {
    const h = +p.hour, m = +p.minute, pad = (x) => fa(String(x).padStart(2, "0"));
    const col = (v, step, max, unit) => `<div class="col" aria-hidden="true"><span>${pad((v - step + max) % max)}</span><span class="on">${pad(v)}</span><span>${pad((v + step) % max)}</span></div>`;
    return `<div class="timep" role="img" aria-label="ساعت ${pad(h)}:${pad(m)}">${col(h, 1, 24)}<b>:</b>${col(m, 5, 60)}</div>`;
  },
  chipGroup(p) {
    const opts = p.set === "categories" ? [["ورزش", "streak"], ["مطالعه", "why"], ["خواب", "theme-dark"], ["سلامت", "goal"], ["پول", "chart"]] : REASONS.map((r) => [r, "none"]);
    const sel = String(p.selected).split(",").filter(Boolean).map(Number);
    const role = p.mode === "multi" ? "group" : "radiogroup";
    return `<div class="chip-row" role="${role}" aria-label="${p.set === "categories" ? "دسته" : "دلیل"}" style="max-width:22rem">${opts.map(([l, ic], i) => `<span class="px-lift-low"><button class="px px-sm chip" type="button" ${p.mode === "multi" ? `aria-pressed="${sel.includes(i)}"` : `role="radio" aria-checked="${sel.includes(i)}"`} data-act="pick" data-val="${i}">${ic !== "none" ? icon(ic) : ""}${l}</button></span>`).join("")}</div>`;
  },
  chainStrip(p) {
    const len = +p.length;
    const cells = CHAIN30.slice(-len);
    return `<div style="max-width:100%;overflow-x:auto"><div class="cells" role="img" aria-label="زنجیره‌ی ${fa(len)} روز اخیر، امروز سمت چپ" style="${len > 7 ? "max-width:20rem" : ""}">${cells.map((s) => `<span class="cell ${s}"></span>`).join("")}</div></div>`;
  },
  adherenceRing(p) { return ringHTML(+p.value, +p.total, p.mode); },
  xpBar(p) {
    const L = +p.level, need = 10 * L * (L + 1), prev = 10 * L * (L - 1), xp = Math.round(prev + ((need - prev) * +p.progress) / 100);
    return `<div class="xp" style="max-width:18rem"><div class="xp-top"><span class="lvl">${icon("level", 24)}سطح ${fa(L)}</span><span>${fa(need - xp)} XP تا سطح ${fa(L + 1)}</span></div>${barHTML(+p.progress, "gold", "XP تا سطح بعد")}</div>`;
  },
  statTile(p) {
    const ic = p.icon && p.icon !== "none" ? `<span class="ic ${p.icon === "streak" ? "" : "plain"}">${icon(p.icon)}</span>` : "";
    return `<div class="stat"><span class="num">${ic}${pxnum(p.value + (p.suffix === "percent" ? "%" : ""), +p.unit, `${p.label}: ${fa(p.value)}`)}</span><small>${esc(p.label)}</small></div>`;
  },
  listRow(p) {
    const trail = { chevron: icon("forward"), switch: `<button class="sw-t" type="button" role="switch" aria-checked="${!!p.on}" aria-label="${esc(p.title)}" data-act="toggle"></button>`, value: `<span class="v">${esc(p.value)}</span>`, none: "" }[p.trailing];
    return `<div class="list"><div class="row ${p.danger ? "danger" : ""}">${p.icon && p.icon !== "none" ? icon(p.icon) : ""}<span class="t"><b>${esc(p.title)}</b>${p.sub ? `<span>${esc(p.sub)}</span>` : ""}</span>${trail}</div></div>`;
  },
  segmented(p) {
    const opts = p.set === "theme" ? ["روشن", "تیره", "سیستم"] : p.set === "filter" ? ["فعال", "بایگانی"] : ["هفته", "ماه", "۳۰ روز", "همه"];
    return `<div class="seg" role="radiogroup" aria-label="انتخاب">${opts.map((o, i) => `<button class="px" type="button" role="radio" aria-checked="${+p.selected === i}" data-act="sel" data-val="${i}">${o}</button>`).join("")}</div>`;
  },
  companionsLine(p) {
    if (+p.count < 20) return `<p class="comp">${icon("companions")}امروز بیش از ۲۰ نفر دیگه هم در «ورزش» فعال بودن</p>`;
    return `<p class="comp">${icon("companions")}امروز ${fa(p.count)} نفر دیگه هم ${esc(p.activity)}${p.offline ? " · آخرین به‌روزرسانی ۹:۱۲" : ""}</p>`;
  },

  appHeader(p) {
    if (p.kind === "main") return `<header class="ahdr"><h4>${esc(p.title)}</h4><button class="ibtn" type="button" aria-label="تنظیمات">${icon("settings")}</button></header>`;
    return `<header class="ahdr inner"><button class="ibtn" type="button" aria-label="برگشت">${icon("back")}</button><h4>${esc(p.title)}</h4>${p.more ? `<button class="ibtn" type="button" aria-label="گزینه‌های بیشتر">${icon("more")}</button>` : ""}</header>`;
  },
  tabBar(p) {
    const tabs = [["today", "امروز"], ["questions", "سؤال‌ها"], ["collection", "کلکسیون"]];
    return `<nav class="tabbar" role="tablist" aria-label="ناوبری اصلی">${tabs.map(([i, l], k) => `<button class="tab" type="button" role="tab" aria-selected="${+p.active === k}" data-act="tab" data-val="${k}">${icon(i)}${l}</button>`).join("")}</nav>`;
  },
  characterPanel(p) {
    return `<div class="cpanel w100"><div class="px plate" style="padding:6px">${spriteHTML(p.id, 3, p.mood)}</div><div class="xp"><span class="name">${esc(p.name)}</span><div class="xp-top"><span class="lvl">سطح ${fa(p.level)}</span><span>${fa(p.toNext)} XP تا سطح ${fa(+p.level + 1)}</span></div>${barHTML(+p.progress, "gold", "XP تا سطح بعد")}</div></div>`;
  },
  progressHero(p) {
    const ring = p.mode === "percent" ? ringHTML(+p.adherence, 100, "percent") : ringHTML(+p.adherence, +p.total, "days");
    return `<div class="lift w100"><section class="px card" aria-label="پیشرفت"><div class="hero">${ring}<div class="hero-stats">
      ${R.statTile({ icon: "streak", value: p.streak, unit: 3, label: "بهترین زنجیره‌ی فعال" })}
      ${R.statTile({ icon: "chart", value: p.score, unit: 3, label: "امتیاز نظم" })}</div></div>
      ${R.characterPanel({ id: "b-05", name: "فندق", level: p.level, toNext: p.toNext, progress: p.xpProgress, mood: p.mood })}</section></div>`;
  },
  nextGoalCard(p) {
    const left = Math.max(1, +p.target - +p.streak), pct = (+p.streak / +p.target) * 100;
    return `<div class="lift w100"><div class="px card goal">${medalSvg(+p.target, 44)}<div style="display:grid;gap:6px"><b>${fa(left)} روز تا مدال ${fa(p.target)}</b>${barHTML(pct, "leaf", "پیشرفت تا مدال")}</div></div></div>`;
  },
  questionCard(p) {
    const st = p.state;
    const base = CHAIN30.slice(-7, -1);
    const chain = { open: [...base, "today"], yes: [...base, "yes"], no: [...base, p.hasFreeze ? "freeze" : "no"], freeze: [...CHAIN30.slice(-7, -2), "freeze", "today"], slip: ["yes", "yes", "yes", "no", "missed", "no", "today"] }[st];
    const streak = st === "slip" ? 0 : +p.streak + (st === "yes" ? 1 : 0);
    let foot;
    if (st === "yes") foot = R.answerPair({ state: "yes" });
    else if (st === "no") foot = R.answerPair({ state: "no" }) + `<p class="note-l">${p.hasFreeze ? `<span class="ic">${icon("freeze")}</span>یکی از فریزهات زنجیره‌ت رو نگه می‌داره` : `بهترین زنجیره‌ت ${fa(p.streak)} روز بود؛ از فردا دوباره`}</p>`;
    else foot = R.answerPair({ state: "open" }) + (st === "freeze" ? `<p class="note-l"><span class="ic">${icon("freeze")}</span>دیروز فریز زنجیره‌ت رو نگه داشت</p>` : "");
    const tags = `<span class="tag">${esc(p.category)}</span>${st === "open" && p.hasFreeze ? `<span class="tag brand">${icon("freeze", 24)}فریز داری</span>` : ""}${st === "slip" ? spriteHTML("b-16", 2, "sleepy") : ""}`;
    return `<div class="lift w100"><article class="px card qc" aria-label="${esc(p.text)}">
      <div class="top">${tags}</div>
      <p class="q">${esc(p.text)}</p>
      <div class="top">${chain ? `<div class="cells" role="img" aria-label="۷ روز اخیر">${chain.map((s) => `<span class="cell ${s}"></span>`).join("")}</div>` : ""}
        <span class="streak">${streak ? `<span class="ic">${icon("streak")}</span>${pxnum(streak, 3, `زنجیره‌ی ${fa(streak)} روزه`)}` : `<span class="note-l">از امروز دوباره</span>`}</span></div>
      ${foot}${p.why && st === "open" ? `<p class="why">«${esc(p.why)}»</p>` : ""}</article></div>`;
  },
  slipCard(p) {
    return `<div class="lift w100"><div class="px card slip"><div class="head">${spriteHTML("b-16", 3, "sleepy")}<div><b>چند روزه ${esc(p.habit)} سخت شده</b><p>اشکالی نداره. بیا کوچیک‌ترش کنیم یا وقتش رو عوض کنیم.</p></div></div>
      <div class="acts">${R.button({ variant: "secondary", label: "ساعت یا روزها رو عوض کن", block: true })}${R.button({ variant: "secondary", label: "هدف رو کوچیک کن", block: true })}${R.button({ variant: "text", label: "فعلاً نه" })}</div></div></div>`;
  },
  alertCard(p) {
    const k = { notif: ["warning", "اجازه‌ی نوتیفیکیشن خاموشه؛ یادآوری‌ها نمی‌رسن.", "درستش کن"], battery: ["warning", "یادآوری دیروز نرسید. بعضی گوشی‌ها برای صرفه‌جویی باتری اپ رو می‌بندن.", "راهنمای باتری"], offline: ["offline", "آفلاینی. جواب‌ها روی گوشی ذخیره می‌شن و بعداً همگام می‌شن. آخرین همگام‌سازی: امروز ۹:۱۲", ""] }[p.kind];
    return `<div class="lift w100"><div class="px alert" role="${p.kind === "offline" ? "status" : "alert"}"><span class="ic ${p.kind === "offline" ? "muted" : ""}">${icon(k[0])}</span><p>${k[1]}</p>${k[2] ? `<div class="acts">${R.button({ variant: "secondary", size: "sm", label: k[2] })}</div>` : ""}</div></div>`;
  },
  noSheet(p) {
    const msg = p.hasFreeze
      ? `<div class="msg"><span class="ic">${icon("freeze", 36)}</span><span>ممنون که صادق بودی. یکی از فریزهات زنجیره‌ی ${fa(p.streak)} روزه‌ت رو نگه می‌داره. این ماه ${fa(Math.max(0, +p.freezes - 1))} فریز دیگه داری.</span></div>`
      : `<div class="msg plain"><span class="ic" style="color:var(--dd-text-muted)">${icon("trophy", 36)}</span><span>بهترین زنجیره‌ت ${fa(p.streak)} روز بود و سر جاش می‌مونه. از فردا دوباره می‌سازیمش.</span></div>`;
    const sel = +p.reason;
    return `<div class="backdrop"><div class="px sheet" role="dialog" aria-label="ثبت «خیر»"><span class="handle" aria-hidden="true"></span><h4>ثبت شد، صادقانه</h4>${msg}
      <p class="sub">چی شد؟ (اختیاری، فقط برای خودت)</p>
      <div class="chip-row" role="radiogroup" aria-label="دلیل">${REASONS.map((r, i) => `<span class="px-lift-low"><button class="px px-sm chip" type="button" role="radio" aria-checked="${sel === i}" data-act="pick" data-val="${i}">${r}</button></span>`).join("")}</div>
      ${p.why ? `<p class="sub">یادت باشه چرا شروع کردی: «${esc(p.why)}»</p>` : ""}
      <div class="acts">${R.button({ variant: "primary", label: "ثبت", block: true })}${R.button({ variant: "secondary", label: "رد شو", block: true })}</div></div></div>`;
  },
  confirmSheet(p) {
    const d = p.kind === "destructive";
    return `<div class="backdrop"><div class="px sheet" role="dialog" aria-label="${d ? "حذف حساب" : "تموم کردن سؤال"}"><span class="handle" aria-hidden="true"></span>
      <h4>${d ? "حساب حذف بشه؟" : "این سؤال تموم بشه؟"}</h4>
      <p class="sub">${d ? "همه‌ی سؤال‌ها، جواب‌ها و کرکترهات پاک می‌شن و برنمی‌گردن." : "کارنامه‌ش ساخته می‌شه و سؤال به بایگانی می‌ره. هر وقت خواستی برش می‌گردونی."}</p>
      <div class="acts">${R.button({ variant: d ? "danger" : "primary", label: d ? "حذف همیشگی" : "تمومش کن", block: true })}${R.button({ variant: "secondary", label: "نه، بمونه", block: true })}</div></div></div>`;
  },
  momentOverlay(p) {
    const medal = p.kind === "medal";
    const art = medal ? medalSvg(+p.value, 120, false, +p.value === 66) : spriteHTML("b-05", 8, "celebrate");
    return `<div class="backdrop center"><div class="lift"><div class="px moment" role="dialog" aria-label="${medal ? "مدال تازه" : "سطح تازه"}"><div class="pop">${art}</div>
      <h4>${medal ? `مدال ${fa(p.value)} روز` : `سطح ${fa(p.value)}`}</h4>
      <p>${medal ? (+p.value === 66 ? "۶۶ روز. این دیگه یه عادته." : `${fa(p.value)} روز پشت سر هم. آفرین.`) : "یک کرکتر تازه در کلکسیونت باز شد."}</p>
      ${medal ? `<span class="gain">${icon("xp")}${pxnum(50, 3, "۵۰")} XP</span>` : `<span class="gain">${icon("gift")}کرکتر تازه</span>`}
      <div class="acts">${R.button({ variant: "primary", label: "ادامه", block: true })}${medal ? R.button({ variant: "secondary", label: "اشتراک", icon: "share", block: true }) : ""}</div></div></div></div>`;
  },
  monthCalendar(p) {
    const offset = 4, today = +p.today;
    const st = { 2: "no", 6: "off", 9: "freeze", 13: "off", 15: "missed" };
    let cells = WEEKDAYS.map(([s, f]) => `<span class="wd" title="${f}">${s}</span>`).join("");
    for (let i = 0; i < offset; i++) cells += "<span></span>";
    for (let d = 1; d <= 30; d++) {
      const s = d === today ? "today" : d > today ? "future" : st[d] || "yes";
      cells += `<span class="cell lg ${s}" role="img" aria-label="${fa(d)} مهر: ${CELL_LABEL[s]}">${s === "freeze" ? icon("freeze") : fa(d)}</span>`;
    }
    return `<div class="cal"><div class="cal-h"><button class="ibtn" type="button" aria-label="ماه قبل">${icon("back")}</button><b>مهر ۱۴۰۵</b><button class="ibtn" type="button" aria-label="ماه بعد">${icon("forward")}</button></div><div class="cal-g">${cells}</div></div>`;
  },
  emptyState(p) {
    const k = { none: ["b-16", "هنوز سؤالی نساختی", "با یک سؤال کوچیک شروع کن؛ مثلاً «امروز ۱۰ دقیقه کتاب خوندی؟»", "ساختن سؤال"], archive: ["", "بایگانی خالیه", "سؤال‌هایی که تموم می‌کنی با کارنامه‌شون اینجا می‌مونن.", ""], done: ["b-05", "همه‌ی جواب‌های امروز ثبت شد", "فردا دوباره می‌پرسیم. فندق امروز خوشحاله.", ""] }[p.kind];
    const art = k[0] ? spriteHTML(k[0], 6, p.kind === "done" ? "celebrate" : "idle") : `<span style="color:var(--dd-text-muted)">${icon("archive", 48)}</span>`;
    return `<div class="empty">${art}<b>${k[1]}</b><p>${k[2]}</p>${k[3] ? R.button({ variant: "primary", label: k[3], icon: "add" }) : ""}</div>`;
  },
  collectionGrid(p) {
    const items = [["b-05", "فندق", "active"], ["b-16", "برفی", ""], ["b-33", "", "locked", 5], ["b-12", "", "locked", 8]].slice(0, p.count === "4" ? 4 : 3);
    return `<div class="coll" style="${p.count === "4" ? "grid-template-columns:repeat(2,minmax(0,1fr));max-width:15rem" : ""}">${items.map(([id, n, cls, lv]) => `<div class="px-lift-low"><div class="px tile ${cls}" ${cls === "locked" ? `aria-label="قفل، سطح ${fa(lv)}"` : `aria-label="${n}${cls === "active" ? "، کرکتر فعلی" : ""}"`}>${cls === "locked" ? `<span class="lockbox">${icon("lock")}</span><span>سطح ${fa(lv)}</span>` : `${spriteHTML(id, 3, "still")}<span>${n}</span>`}</div></div>`).join("")}</div>`;
  },
};

/* ---------- registry ---------- */
const LV = { start: "شروع", found: "پایه‌ها", atom: "اتم‌ها", molecule: "مولکول‌ها", organism: "ارگانیسم‌ها", template: "قالب‌ها", play: "Playground" };
const S = (o) => o; // readability marker

const REG = [
  /* ===== atoms ===== */
  S({ id: "button", lvl: "atom", name: "دکمه", fl: "DdButton", kind: "px", r: R.button,
    lead: "دکمه‌ی متنی برای کارهای اصلی و فرعی. در هر صفحه فقط یک دکمه‌ی اصلی.",
    props: [
      { k: "variant", l: "گونه", t: "sel", o: [["primary", "اصلی"], ["secondary", "فرعی"], ["text", "متنی"], ["danger", "برگشت‌ناپذیر"]], d: "primary" },
      { k: "label", l: "متن", t: "text", d: "ساختن سؤال" },
      { k: "icon", l: "آیکون", t: "icon", d: "none" },
      { k: "size", l: "اندازه", t: "sel", o: [["md", "۴۸"], ["sm", "۴۰"]], d: "md" },
      { k: "state", l: "حالت", t: "sel", o: [["normal", "عادی"], ["pressed", "فشرده"], ["disabled", "غیرفعال"], ["loading", "در حال بارگذاری"]], d: "normal" },
      { k: "block", l: "تمام‌عرض", t: "bool", d: false },
    ],
    variants: [["اصلی", "زمینه‌ی برگ، نور ۲dp جوانه بالای دکمه", {}], ["فرعی", "زمینه‌ی سطح", { variant: "secondary", label: "بعداً" }], ["متنی", "بدون قاب، برای کار سوم", { variant: "text", label: "عوضش کن" }], ["با آیکون", "آیکون در سمت شروع", { icon: "add", label: "سؤال تازه" }], ["کوچیک", "۴۰dp، داخل کارت‌ها", { size: "sm", label: "ثبت" }], ["برگشت‌ناپذیر", "متن خطا روی زمینه‌ی سطح", { variant: "danger", label: "حذف حساب" }]],
    states: [["عادی", "", {}], ["فشرده", "۴dp پایین، بدون سایه", { state: "pressed" }], ["غیرفعال", "بدون سایه", { state: "disabled" }], ["در حال بارگذاری", "سه پیکسل پله‌ای", { state: "loading" }]],
    tokens: ["primary", "on-primary", "highlight", "surface", "outline", "shadow", "disabled-bg", "disabled-text", "error", "component.button.height", "component.button.height-sm", "component.button.padding-x", "type.button", "elevation.rest", "motion.duration.fast"],
    dos: ["یک دکمه‌ی اصلی در هر صفحه؛ بقیه فرعی یا متنی", "متن با فعل و کوتاه: «ساختن سؤال»، «ثبت»", "برای کار برگشت‌ناپذیر، تأیید در برگه‌ی تأیید"],
    donts: ["دو دکمه‌ی اصلی کنار هم", "استفاده از گونه‌ی برگشت‌ناپذیر برای «خیر»", "گرد کردن گوشه‌ها یا سایه‌ی محو"],
    a11y: ["هدف لمسی حداقل ۴۸dp حتی در اندازه‌ی ۴۰ (فاصله‌ی اضافه دور دکمه)", "در حالت بارگذاری `aria-busy` و متن «در حال ارسال» برای صفحه‌خوان", "غیرفعال با `onPressed: null` تا صفحه‌خوان بگه «غیرفعال»"],
    code: (p) => dart("DdButton", [`label: ${dq(p.label)}`, `variant: DdButtonVariant.${p.variant}`, p.size === "sm" ? "size: DdButtonSize.sm" : "", p.icon !== "none" ? `icon: ${di(p.icon)}` : "", p.block ? "expand: true" : "", p.state === "loading" ? "loading: true" : "", `onPressed: ${p.state === "disabled" ? "null" : "() {}"}`]) }),

  S({ id: "icon-button", lvl: "atom", name: "دکمه‌ی آیکون", fl: "DdIconButton", kind: "mix", r: R.iconButton,
    lead: "دکمه‌ی فقط آیکون برای سرصفحه و ردیف‌ها؛ گونه‌ی شناور برای ساختن سؤال.",
    props: [
      { k: "kind", l: "گونه", t: "sel", o: [["plain", "عادی"], ["fab", "شناور (+)"]], d: "plain" },
      { k: "icon", l: "آیکون", t: "icon", d: "settings" },
      { k: "label", l: "برچسب صفحه‌خوان", t: "text", d: "تنظیمات" },
      { k: "state", l: "حالت", t: "sel", o: [["normal", "عادی"], ["pressed", "فشرده"]], d: "normal" },
    ],
    variants: [["عادی ۴۸", "بدون زمینه، سرصفحه", {}], ["برگشت", "رو به راست در فارسی", { icon: "back", label: "برگشت" }], ["شناور ۵۶", "پیکسلی، فقط ساختن سؤال", { kind: "fab", icon: "add", label: "ساختن سؤال" }]],
    states: [["عادی", "", { kind: "fab", icon: "add", label: "ساختن سؤال" }], ["فشرده", "", { kind: "fab", icon: "add", label: "ساختن سؤال", state: "pressed" }]],
    tokens: ["text", "surface-pressed", "primary", "on-primary", "size.icon.md", "component.fab.size", "elevation.rest"],
    dos: ["همیشه برچسب صفحه‌خوان", "دکمه‌ی شناور فقط در «امروز» و «سؤال‌ها»"], donts: ["بیشتر از یک دکمه‌ی شناور", "آیکون بدون برچسب برای کار مبهم"],
    a11y: ["`semanticLabel` اجباری", "ناحیه‌ی لمس ۴۸×۴۸ حتی با آیکون ۲۴"],
    code: (p) => p.kind === "fab" ? dart("DdFab", [`icon: ${di(p.icon)}`, `semanticLabel: ${dq(p.label)}`, "onPressed: () {}"]) : dart("DdIconButton", [`icon: ${di(p.icon)}`, `semanticLabel: ${dq(p.label)}`, "onPressed: () {}"]) }),

  S({ id: "answer-button", lvl: "atom", name: "دکمه‌ی جواب", fl: "DdAnswerButton", kind: "px", r: R.answerButton,
    lead: "یک دکمه‌ی بله یا خیر. «خیر» هم‌اندازه و خنثی‌ست تا صداقت هزینه نداشته باشه.",
    props: [{ k: "kind", l: "جواب", t: "sel", o: [["yes", "بله"], ["no", "خیر"]], d: "yes" }, { k: "state", l: "حالت", t: "sel", o: [["normal", "عادی"], ["pressed", "فشرده"], ["disabled", "غیرفعال"]], d: "normal" }],
    variants: [["بله", "زمینه‌ی برگ با تیک", {}], ["خیر", "زمینه‌ی سطح، لبه‌ی خنثی، بدون آیکون", { kind: "no" }]],
    states: [["عادی", "", {}], ["فشرده", "", { state: "pressed" }], ["غیرفعال", "مثلاً موقع ثبت", { state: "disabled" }]],
    tokens: ["yes", "on-primary", "surface", "no-border", "no-text", "outline", "component.answer.height", "type.answer"],
    dos: ["«بله» در سمت شروع (راست)", "عرض برابر برای هر دو"], donts: ["رنگ قرمز یا ضربدر برای «خیر»", "کوچیک‌تر یا کم‌رنگ‌تر کردن «خیر»"],
    a11y: ["برچسب کامل: «بله، انجام دادم» و «خیر، انجام ندادم»", "لرزش: «بله» ضربه‌ی سبک، «خیر» کلیک انتخاب"],
    code: (p) => dart("DdAnswerButton", [`answer: DdAnswer.${p.kind}`, `onPressed: ${p.state === "disabled" ? "null" : "() {}"}`]) }),

  S({ id: "icon", lvl: "atom", name: "آیکون", fl: "DdIcon", kind: "flat", r: R.icon,
    lead: "آیکون پیکسلی شبکه‌ی ۲۴ از Pixelarticons. فهرست کامل در صفحه‌ی «آیکون‌ها».",
    props: [{ k: "name", l: "آیکون", t: "icon", d: "streak", noNone: true }, { k: "size", l: "اندازه", t: "sel", o: [["24", "۲۴"], ["36", "۳۶"], ["48", "۴۸"]], d: "24" }, { k: "tone", l: "رنگ", t: "sel", o: [["text", "متن"], ["muted", "فرعی"], ["brand", "سبز"], ["gold", "طلایی"]], d: "text" }],
    variants: [["۲۴", "هر پیکسل ۲dp", {}], ["۳۶", "هر پیکسل ۳dp", { size: "36" }], ["۴۸", "هر پیکسل ۴dp", { size: "48" }]],
    states: [["متن", "", {}], ["فرعی", "", { tone: "muted" }], ["طلایی", "زنجیره و هشدار", { tone: "gold" }]],
    tokens: ["size.icon.md", "size.icon.lg", "size.icon.xl", "text", "text-muted", "medal-text"],
    dos: ["فقط اندازه‌های ۲۴، ۳۶ و ۴۸", "رنگ از متن کنارش"], donts: ["اندازه‌ی ۲۰ یا ۳۲ (پیکسل‌ها تار می‌شن)", "ایموجی به‌جای آیکون"],
    a11y: ["آیکون تزئینی پنهان از صفحه‌خوان", "آیکون تنها، برچسب می‌خواد"],
    code: (p) => `DdIcon(${di(p.name)}, size: ${p.size})` }),

  S({ id: "pixel-number", lvl: "atom", name: "رقم پیکسلی", fl: "DdPixelNumber", kind: "px", r: R.pixelNumber,
    lead: "عددهای قهرمان با رقم‌های پیکسلی فارسی. ارقام همیشه چپ‌به‌راست چیده می‌شن.",
    props: [{ k: "value", l: "عدد", t: "text", d: "21" }, { k: "unit", l: "واحد", t: "sel", o: [["3", "۳dp"], ["4", "۴dp"], ["6", "۶dp"], ["8", "۸dp"]], d: "4" }, { k: "tone", l: "رنگ", t: "sel", o: [["text", "متن"], ["brand", "سبز"], ["gold", "طلایی"]], d: "text" }],
    variants: [["sm · ۳dp", "کاشی آمار", { unit: "3" }], ["md · ۴dp", "حلقه و کارت", { value: "66" }], ["lg · ۶dp", "بخش پیشرفت", { unit: "6", value: "365" }], ["درصد", "با ٪", { value: "73%" }]],
    states: [], tokens: ["size.numeral-unit.sm", "size.numeral-unit.md", "size.numeral-unit.lg", "size.numeral-unit.xl", "text"],
    dos: ["برای عدد قهرمان (زنجیره، پایبندی، سطح)", "برچسب متنی برای صفحه‌خوان"], donts: ["عدد داخل جمله (اون با Estedad)", "واحد غیرصحیح"],
    a11y: ["عدد به‌صورت متن خونده می‌شه، نه تصویر", "با بزرگ شدن متن سیستم، واحد بعدی (۴ ← ۶ ← ۸)"],
    code: (p) => dart("DdPixelNumber", [String(+String(p.value).replace("%", "") || 0), `unit: ${p.unit}`, String(p.value).includes("%") ? "percent: true" : "", `semanticLabel: ${dq(fa(p.value))}`]) }),

  S({ id: "tag", lvl: "atom", name: "برچسب", fl: "DdTag", kind: "flat", r: R.tag,
    lead: "برچسب کوچیک و غیرلمسی برای دسته، وضعیت یا «جدید».",
    props: [{ k: "label", l: "متن", t: "text", d: "ورزش · پیاده‌روی" }, { k: "tone", l: "رنگ", t: "sel", o: [["neutral", "خنثی"], ["brand", "برند"], ["gold", "طلایی"]], d: "neutral" }, { k: "icon", l: "آیکون", t: "icon", d: "none" }],
    variants: [["خنثی", "دسته", {}], ["برند", "وضعیت مثبت", { tone: "brand", label: "فریز داری", icon: "freeze" }], ["طلایی", "تازه یا پاداش", { tone: "gold", label: "جدید" }]],
    states: [], tokens: ["surface-sunken", "surface-tint", "medal", "on-medal", "text-muted", "type.label"],
    dos: ["متن یک تا سه کلمه"], donts: ["برچسب لمسی (برای انتخاب، چیپ)"], a11y: ["متن برچسب جزء برچسب کارت خونده می‌شه"],
    code: (p) => dart("DdTag", [dq(p.label), `tone: DdTagTone.${p.tone}`, p.icon !== "none" ? `icon: ${di(p.icon)}` : ""]) }),

  S({ id: "chip", lvl: "atom", name: "چیپ", fl: "DdChip", kind: "px", r: R.chip, act: (p, a) => (a === "toggle" ? { ...p, selected: !p.selected } : null),
    lead: "گزینه‌ی قابل انتخاب؛ دسته، دلیل «خیر» و روزهای هفته.",
    props: [{ k: "label", l: "متن", t: "text", d: "ورزش" }, { k: "icon", l: "آیکون", t: "icon", d: "streak" }, { k: "selected", l: "انتخاب‌شده", t: "bool", d: false }, { k: "disabled", l: "غیرفعال", t: "bool", d: false }],
    variants: [["با آیکون", "دسته", {}], ["بدون آیکون", "دلیل", { icon: "none", label: "یادم رفت" }]],
    states: [["انتخاب‌نشده", "لبه‌ی خنثی", {}], ["انتخاب‌شده", "زمینه‌ی جوانه، خط دور", { selected: true }], ["غیرفعال", "", { disabled: true }]],
    tokens: ["surface", "border", "surface-tint", "outline", "component.chip.height", "component.chip.padding-x", "shape.notch-sm", "elevation.low"],
    dos: ["حالت انتخاب با خط دور، نه فقط رنگ"], donts: ["چیپ برای کار اصلی صفحه"], a11y: ["`aria-pressed` یا نقش radio در گروه تک‌انتخابی"],
    code: (p) => dart("DdChip", [`label: ${dq(p.label)}`, p.icon !== "none" ? `icon: ${di(p.icon)}` : "", `selected: ${!!p.selected}`, `onChanged: ${p.disabled ? "null" : "(v) {}"}`]) }),

  S({ id: "text-input", lvl: "atom", name: "ورودی متن", fl: "DdTextInput", kind: "flat", r: R.textInput, act: (p, a) => (a === "reveal" ? { ...p, reveal: !p.reveal } : null),
    lead: "ورودی خام بدون برچسب؛ داخل «فیلد» استفاده می‌شه. ساده، بدون پیکسل.",
    props: [{ k: "value", l: "مقدار", t: "text", d: "امروز کتاب خوندی؟" }, { k: "placeholder", l: "راهنما", t: "text", d: "متن سؤال" }, { k: "dir", l: "جهت", t: "sel", o: [["rtl", "راست‌چین"], ["ltr", "چپ‌چین (شماره، رمز)"]], d: "rtl" }, { k: "type", l: "نوع", t: "sel", o: [["text", "متن"], ["password", "رمز"]], d: "text" }, { k: "icon", l: "آیکون", t: "icon", d: "none" }, { k: "state", l: "حالت", t: "sel", o: [["normal", "عادی"], ["focus", "فوکوس"], ["error", "خطا"], ["disabled", "غیرفعال"]], d: "normal" }],
    variants: [["متن فارسی", "راست‌چین", {}], ["شماره", "چپ‌چین با آیکون", { value: "", placeholder: "۰۹۱۲ ۳۴۵ ۶۷۸۹", dir: "ltr", icon: "phone" }], ["رمز", "با دکمه‌ی نمایش", { value: "didit2026", placeholder: "رمز", dir: "ltr", type: "password", icon: "password" }]],
    states: [["عادی", "", {}], ["فوکوس", "لبه‌ی شب", { state: "focus" }], ["خطا", "لبه‌ی خطا", { state: "error" }], ["غیرفعال", "", { state: "disabled" }]],
    tokens: ["surface", "border", "outline", "error", "disabled-bg", "component.field.height", "component.field.padding-x", "shape.border"],
    dos: ["کیبورد مناسب (شماره، رمز)", "پذیرش ارقام فارسی و انگلیسی"], donts: ["گوشه‌ی پله‌ای یا سایه (ورودی‌ها ساده‌ان)"], a11y: ["همیشه داخل `DdField` با برچسب دیدنی"],
    code: (p) => dart("DdTextInput", [p.value ? `initialValue: ${dq(p.value)}` : "", `hint: ${dq(p.placeholder)}`, p.dir === "ltr" ? "textDirection: TextDirection.ltr" : "", p.type === "password" ? "obscure: true" : "", p.icon !== "none" ? `icon: ${di(p.icon)}` : "", p.state === "disabled" ? "enabled: false" : ""]) }),

  S({ id: "switch", lvl: "atom", name: "سوییچ", fl: "DdSwitch", kind: "flat", r: R.switch, act: (p, a) => (a === "toggle" && !p.disabled ? { ...p, on: !p.on } : null),
    lead: "روشن و خاموش برای تنظیمات. مستطیل با دستگیره‌ی مربعی.",
    props: [{ k: "label", l: "برچسب", t: "text", d: "یادآوری مجدد" }, { k: "on", l: "روشن", t: "bool", d: true }, { k: "disabled", l: "غیرفعال", t: "bool", d: false }],
    variants: [], states: [["روشن", "", {}], ["خاموش", "", { on: false }], ["غیرفعال", "", { disabled: true }]],
    tokens: ["primary", "track", "outline", "no-border", "surface", "motion.duration.fast"],
    dos: ["اثر فوری، بدون دکمه‌ی ذخیره"], donts: ["سوییچ برای کاری که تأیید می‌خواد"], a11y: ["نقش switch و `aria-checked`"],
    code: (p) => dart("DdSwitch", [`value: ${!!p.on}`, `semanticLabel: ${dq(p.label)}`, `onChanged: ${p.disabled ? "null" : "(v) {}"}`]) }),

  S({ id: "chain-cell", lvl: "atom", name: "خونه‌ی زنجیره", fl: "DdChainCell", kind: "px", r: R.chainCell,
    lead: "یک روز در نوار زنجیره (۱۶dp) یا تقویم (۴۰dp). هر حالت جدا از رنگ، نشانه‌ی شکلی هم داره.",
    props: [{ k: "state", l: "حالت", t: "sel", o: Object.entries(CELL_LABEL).filter(([k]) => k !== "future"), d: "yes" }, { k: "size", l: "اندازه", t: "sel", o: [["strip", "نوار ۱۶"], ["calendar", "تقویم ۴۰"]], d: "calendar" }, { k: "day", l: "روز", t: "num", min: 1, max: 30, d: 12 }],
    variants: [["نوار ۱۶dp", "", { size: "strip" }], ["تقویم ۴۰dp", "با عدد روز", {}]],
    states: Object.entries(CELL_LABEL).filter(([k]) => k !== "future").map(([k, l]) => [l, { yes: "برگ با خط دور", freeze: "جوانه با خط دور و آیکون", no: "خنثی، بدون قرمز", missed: "فقط لبه", off: "مربع کوچیک", today: "قاب فوکوس" }[k], { state: k }]),
    tokens: ["chain-yes", "chain-freeze", "chain-no", "chain-off", "track", "outline", "focus", "component.chain-cell.size", "component.calendar-cell.size"],
    dos: ["روز قدیمی سمت راست، امروز سمت چپ"], donts: ["قرمز یا ضربدر برای «خیر»", "رنگ تنها برای تشخیص حالت"], a11y: ["برچسب: «۱۲ مهر: بله»"],
    code: (p) => dart("DdChainCell", [`state: DdDayState.${p.state}`, p.size === "calendar" ? `day: ${p.day}` : "", p.size === "calendar" ? "size: DdChainCellSize.calendar" : ""]) }),

  S({ id: "progress-bar", lvl: "atom", name: "نوار پیشرفت", fl: "DdProgressBar", kind: "px", r: R.progressBar,
    lead: "نوار پیکسلی که از راست و در قطعه‌های ۴dp پر می‌شه.",
    props: [{ k: "value", l: "مقدار ٪", t: "num", min: 0, max: 100, d: 60 }, { k: "tone", l: "رنگ", t: "sel", o: [["leaf", "برگ (پیشرفت)"], ["gold", "طلا (XP)"]], d: "leaf" }],
    variants: [["برگ", "پیشرفت تا مدال", {}], ["طلا", "XP", { tone: "gold", value: 35 }]],
    states: [["خالی", "", { value: 0 }], ["نیمه", "", { value: 50 }], ["پر", "", { value: 100 }]],
    tokens: ["track", "primary", "xp-fill", "outline", "component.progress-bar.height", "component.progress-bar.segment"],
    dos: ["همیشه با متن کنارش («۳ روز تا مدال ۲۱»)"], donts: ["حرکت نرم؛ پر شدن پله‌ای‌ه"], a11y: ["نقش progressbar با مقدار"],
    code: (p) => dart("DdProgressBar", [`value: ${(+p.value / 100).toFixed(2)}`, p.tone === "gold" ? "tone: DdProgressTone.gold" : ""]) }),

  S({ id: "sprite", lvl: "atom", name: "اسپرایت کرکتر", fl: "DdSprite", kind: "px", r: R.sprite,
    lead: "کرکتر ۱۶ پیکسلی با ضریب صحیح. کرکترها نمونه‌ان تا انتخاب نهایی طراح.",
    props: [{ k: "id", l: "کرکتر", t: "sel", o: [["b-05", "فندق (B-05)"], ["b-16", "برفی (B-16)"], ["b-33", "B-33"], ["b-12", "B-12"]], d: "b-05" }, { k: "size", l: "اندازه", t: "sel", o: [["sm", "۴۸"], ["md", "۹۶"], ["lg", "۱۶۰"]], d: "md" }, { k: "mood", l: "حالت", t: "sel", o: [["idle", "ایستاده"], ["celebrate", "جشن"], ["accompany", "همراهی"], ["sleepy", "خواب‌آلود"], ["still", "ثابت (کاهش حرکت)"]], d: "idle" }, { k: "plate", l: "پلاک", t: "bool", d: true }],
    variants: [["۴۸", "ضریب ۳", { size: "sm" }], ["۹۶", "ضریب ۶", {}], ["۱۶۰", "ضریب ۱۰", { size: "lg", id: "b-16" }]],
    states: [["ایستاده", "", {}], ["جشن", "بعد از «بله»", { mood: "celebrate" }], ["همراهی", "بعد از «خیر»", { mood: "accompany" }], ["خواب‌آلود", "در حال لغزش", { mood: "sleepy" }]],
    tokens: ["surface-tint", "size.character.sm", "size.character.md", "size.character.lg", "motion.sprite-fps"],
    dos: ["در تم تیره روی پلاک", "ضریب صحیح"], donts: ["حالت غمگین یا تنبیهی", "نرم کردن لبه‌ها"], a11y: ["با کاهش حرکت روی فریم اول", "برچسب فقط وقتی معنی داره"],
    code: (p) => dart("DdSprite", [`character: DdCharacters.${camel(p.id)}`, `size: DdSpriteSize.${p.size}`, `mood: DdMood.${p.mood === "still" ? "idle" : p.mood}`, p.plate ? "plate: true" : ""]) }),

  S({ id: "medal", lvl: "atom", name: "مدال", fl: "DdMedal", kind: "px", r: R.medal,
    lead: "نشان روزشمار برای زنجیره‌ی ۷، ۲۱، ۳۰، ۶۶، ۱۰۰ و ۳۶۵ روز. ۶۶ روز ویژه‌ی «عادت شد».",
    props: [{ k: "days", l: "روز", t: "sel", o: MEDALS.map((m) => [String(m), fa(m)]), d: "21" }, { k: "locked", l: "قفل", t: "bool", d: false }, { k: "size", l: "اندازه", t: "sel", o: [["44", "۴۴"], ["60", "۶۰"], ["120", "۱۲۰"]], d: "60" }],
    variants: MEDALS.map((m) => [`${fa(m)} روز`, m === 66 ? "ویژه، با روبان برگ" : "", { days: String(m) }]),
    states: [["گرفته‌شده", "طلا", {}], ["قفل", "مسیر خالی", { locked: true }]],
    tokens: ["medal", "on-medal", "track", "outline"],
    dos: ["عدد با رقم پیکسلی"], donts: ["مدال برای چیزی جز زنجیره"], a11y: ["«مدال ۲۱ روز» یا «قفل»"],
    code: (p) => dart("DdMedal", [`days: ${p.days}`, p.locked ? "locked: true" : "", `size: ${p.size}`]) }),

  /* ===== molecules ===== */
  S({ id: "answer-pair", lvl: "molecule", name: "جفت بله/خیر", fl: "DdAnswerPair", kind: "px", r: R.answerPair, act: (p, a, v) => (a === "answer" ? { ...p, state: v } : a === "undo" ? { ...p, state: "open" } : null),
    lead: "دو دکمه‌ی جواب کنار هم؛ بعد از جواب جاشون ردیف نتیجه با «عوضش کن» میاد (تا نیمه‌شب، D-025).",
    props: [{ k: "state", l: "حالت", t: "sel", o: [["open", "جواب‌نداده"], ["yes", "بله ثبت شد"], ["no", "خیر ثبت شد"]], d: "open" }, { k: "disabled", l: "در حال ثبت", t: "bool", d: false }],
    variants: [], states: [["جواب‌نداده", "", {}], ["بله", "", { state: "yes" }], ["خیر", "", { state: "no" }]],
    tokens: ["component.answer.gap", "surface-tint", "surface-sunken", "yes-text"],
    dos: ["عرض برابر و فاصله‌ی ۱۲"], donts: ["پنهان کردن «عوضش کن»"], a11y: ["بعد از جواب: اعلام «ثبت شد»"],
    code: (p) => dart("DdAnswerPair", [`answer: ${p.state === "open" ? "null" : "DdAnswer." + p.state}`, "onAnswer: (a) {}", "onUndo: () {}"]) }),

  S({ id: "field", lvl: "molecule", name: "فیلد", fl: "DdField", kind: "flat", r: R.field,
    lead: "برچسب + ورودی + راهنما یا خطا. خطا فقط برای خطای سیستم و همیشه با راه درست کردن.",
    props: [{ k: "label", l: "برچسب", t: "text", d: "شماره موبایل" }, { k: "value", l: "مقدار", t: "text", d: "0912 345" }, { k: "help", l: "راهنما", t: "text", d: "کد تأیید به این شماره پیامک می‌شه" }, { k: "error", l: "متن خطا", t: "text", d: "شماره کامل نیست؛ ۱۱ رقم لازمه." }, { k: "dir", l: "جهت", t: "sel", o: [["ltr", "چپ‌چین"], ["rtl", "راست‌چین"]], d: "ltr" }, { k: "icon", l: "آیکون", t: "icon", d: "phone" }, { k: "required", l: "اجباری", t: "bool", d: true }, { k: "state", l: "حالت", t: "sel", o: [["normal", "عادی"], ["focus", "فوکوس"], ["error", "خطا"], ["disabled", "غیرفعال"]], d: "normal" }],
    variants: [["شماره", "", {}], ["متن", "", { label: "چرا برات مهمه؟", value: "می‌خوام سرحال‌تر باشم", help: "اختیاری؛ گاهی بهت یادآوری می‌کنیم", dir: "rtl", icon: "why", required: false }]],
    states: [["عادی", "", {}], ["فوکوس", "", { state: "focus" }], ["خطا", "علت + راه حل", { state: "error" }], ["غیرفعال", "", { state: "disabled" }]],
    tokens: ["text-muted", "border", "outline", "error", "type.small", "type.label"],
    dos: ["برچسب دیدنی بالای ورودی", "خطا زیر همون فیلد، با راه حل"], donts: ["فقط راهنمای داخل ورودی", "خطا برای «خیر»"], a11y: ["خطا با `role=alert`", "بعد از ثبت ناموفق، فوکوس روی اولین فیلد خطادار"],
    code: (p) => dart("DdField", [`label: ${dq(p.label)}`, p.required ? "required: true" : "", p.help ? `helper: ${dq(p.help)}` : "", p.state === "error" ? `error: ${dq(p.error)}` : "", p.dir === "ltr" ? "textDirection: TextDirection.ltr" : "", p.icon !== "none" ? `icon: ${di(p.icon)}` : ""]) }),

  S({ id: "otp-field", lvl: "molecule", name: "فیلد کد تأیید", fl: "DdOtpField", kind: "flat", r: R.otpField,
    lead: "خونه‌های کد پیامکی، چپ‌به‌راست، با پر شدن خودکار و شمارش معکوس.",
    props: [{ k: "length", l: "طول کد", t: "sel", o: [["5", "۵"], ["6", "۶"]], d: "6" }, { k: "filled", l: "پرشده", t: "num", min: 0, max: 6, d: 3 }, { k: "seconds", l: "ثانیه تا ارسال دوباره", t: "num", min: 0, max: 59, d: 42 }, { k: "state", l: "حالت", t: "sel", o: [["normal", "عادی"], ["error", "کد اشتباه"]], d: "normal" }],
    variants: [["۵ رقمی", "", { length: "5" }], ["۶ رقمی", "", {}]], states: [["در حال وارد کردن", "", {}], ["کد اشتباه", "", { state: "error", filled: 6 }]],
    tokens: ["surface", "border", "outline", "error"], dos: ["پر شدن خودکار از پیامک"], donts: ["راست‌به‌چپ کردن ارقام"], a11y: ["گروه با برچسب «کد تأیید ۶ رقمی»"],
    code: (p) => dart("DdOtpField", [`length: ${p.length}`, "autofill: true", `resendIn: Duration(seconds: ${p.seconds})`, "onCompleted: (code) {}"]) }),

  S({ id: "weekday-picker", lvl: "molecule", name: "انتخاب روزهای هفته", fl: "DdWeekdayPicker", kind: "px", r: R.weekdayPicker,
    act: (p, a, v) => (a === "day" ? { ...p, days: p.days.split("").map((c, i) => (i === +v ? (c === "1" ? "0" : "1") : c)).join("") } : a === "preset" ? { ...p, days: v } : null),
    lead: "هفت چیپ مربعی، شنبه سمت راست؛ با میان‌بُرهای رایج.",
    props: [{ k: "days", l: "روزها (شنبه تا جمعه)", t: "text", d: "1111100" }, { k: "presets", l: "میان‌بُرها", t: "bool", d: true }],
    variants: [["هر روز", "", { days: "1111111" }], ["شنبه تا چهارشنبه", "", {}]], states: [],
    tokens: ["surface", "surface-tint", "outline", "border", "shape.notch-sm"], dos: ["شروع هفته از تنظیم منطقه‌ای"], donts: ["حروف لاتین برای روزها"], a11y: ["برچسب کامل روز («سه‌شنبه»)"],
    code: (p) => dart("DdWeekdayPicker", [`selected: {${p.days.split("").map((c, i) => (c === "1" ? i : null)).filter((x) => x !== null).map((i) => "DdWeekday." + ["sat", "sun", "mon", "tue", "wed", "thu", "fri"][i]).join(", ")}}`, `showPresets: ${!!p.presets}`, "onChanged: (days) {}"]) }),

  S({ id: "time-picker", lvl: "molecule", name: "انتخاب ساعت", fl: "DdTimePicker", kind: "flat", r: R.timePicker,
    lead: "دو ستون چرخان، ۲۴ ساعته، گام ۵ دقیقه. دیرترین یادآوری ۲۲:۰۰ (D-026).",
    props: [{ k: "hour", l: "ساعت", t: "num", min: 5, max: 22, d: 20 }, { k: "minute", l: "دقیقه", t: "num", min: 0, max: 55, step: 5, d: 30 }],
    variants: [], states: [], tokens: ["surface", "border", "surface-tint", "outline"], dos: ["محدود به ۲۲:۰۰"], donts: ["گام ۱ دقیقه"], a11y: ["هر ستون قابل تنظیم با کلیدهای بالا و پایین"],
    code: (p) => dart("DdTimePicker", [`initial: TimeOfDay(hour: ${p.hour}, minute: ${p.minute})`, "latest: TimeOfDay(hour: 22, minute: 0)", "minuteStep: 5", "onChanged: (t) {}"]) }),

  S({ id: "chip-group", lvl: "molecule", name: "گروه چیپ", fl: "DdChipGroup", kind: "px", r: R.chipGroup,
    act: (p, a, v) => { if (a !== "pick") return null; if (p.mode === "single") return { ...p, selected: String(v) }; const s = new Set(String(p.selected).split(",").filter(Boolean)); s.has(v) ? s.delete(v) : s.add(v); return { ...p, selected: [...s].join(",") }; },
    lead: "چند چیپ که به خط بعد می‌شکنن؛ تک‌انتخابی یا چندانتخابی.",
    props: [{ k: "set", l: "محتوا", t: "sel", o: [["reasons", "دلیل «خیر»"], ["categories", "دسته‌ها"]], d: "reasons" }, { k: "mode", l: "انتخاب", t: "sel", o: [["single", "تک‌انتخابی"], ["multi", "چندانتخابی"]], d: "single" }, { k: "selected", l: "انتخاب‌شده (شماره‌ها)", t: "text", d: "0" }],
    variants: [["دلیل «خیر»", "تک‌انتخابی", {}], ["دسته‌ها", "با آیکون", { set: "categories", selected: "1" }]], states: [],
    tokens: ["surface", "surface-tint", "outline", "border"], dos: ["فاصله‌ی ۸ بین چیپ‌ها"], donts: ["بیشتر از ۸ گزینه بدون جست‌وجو"], a11y: ["radiogroup برای تک‌انتخابی"],
    code: (p) => dart("DdChipGroup", [`options: ${p.set === "reasons" ? "noReasons" : "categories"}`, `multiple: ${p.mode === "multi"}`, "onChanged: (selection) {}"]) }),

  S({ id: "chain-strip", lvl: "molecule", name: "نوار زنجیره", fl: "DdChainStrip", kind: "px", r: R.chainStrip, wide: true,
    lead: "۷ یا ۳۰ خونه‌ی زنجیره؛ روز قدیمی راست، امروز چپ.",
    props: [{ k: "length", l: "طول", t: "sel", o: [["7", "۷ روز"], ["30", "۳۰ روز"]], d: "7" }],
    variants: [["۷ روز", "روی کارت سؤال", {}], ["۳۰ روز", "جزئیات سؤال", { length: "30" }]], states: [],
    tokens: ["chain-yes", "chain-freeze", "chain-no", "track", "focus", "component.chain-cell.gap"], dos: ["امروز با قاب"], donts: ["جهت چپ‌به‌راست در فارسی"], a11y: ["برچسب کلی + جزئیات در تقویم"],
    code: (p) => dart("DdChainStrip", [`days: last${p.length}Days`]) }),

  S({ id: "adherence-ring", lvl: "molecule", name: "حلقه‌ی پایبندی", fl: "DdAdherenceRing", kind: "px", r: R.adherenceRing,
    lead: "حلقه‌ی پیکسلی ۲۸×۲۸ که از بالا و پادساعت‌گرد پر می‌شه. فریز روی پایبندی اثر نداره (D-040).",
    props: [{ k: "value", l: "روزهای «بله»", t: "num", min: 0, max: 30, d: 22 }, { k: "total", l: "روزهای زمان‌بندی‌شده", t: "num", min: 1, max: 30, d: 30 }, { k: "mode", l: "نمایش", t: "sel", o: [["days", "روز (یک سؤال)"], ["percent", "درصد (همه‌ی سؤال‌ها)"]], d: "days" }],
    variants: [["روز", "«۲۲ از ۳۰ روز»", {}], ["درصد", "چند سؤال", { mode: "percent" }], ["کاربر تازه", "از روز اول، نه ۳۰", { value: 3, total: 3 }]], states: [],
    tokens: ["primary", "track", "outline", "component.ring.size", "component.ring.thickness", "size.numeral-unit.md"], dos: ["همیشه با عدد وسط"], donts: ["حرکت نرم پر شدن"], a11y: ["«پایبندی: ۲۲ روز از ۳۰ روز»"],
    code: (p) => dart("DdAdherenceRing", [`yesDays: ${p.value}`, `scheduledDays: ${p.total}`, p.mode === "percent" ? "display: DdRingDisplay.percent" : ""]) }),

  S({ id: "xp-bar", lvl: "molecule", name: "نوار XP", fl: "DdXpBar", kind: "px", r: R.xpBar,
    lead: "نشان سطح + نوار طلایی + فاصله تا سطح بعد. سطح L با ۱۰×L×(L−۱) XP (D-036).",
    props: [{ k: "level", l: "سطح", t: "num", min: 1, max: 20, d: 5 }, { k: "progress", l: "پیشرفت ٪", t: "num", min: 0, max: 100, d: 67 }],
    variants: [], states: [], tokens: ["medal", "on-medal", "xp-fill", "track", "type.label"], dos: ["XP هیچ‌وقت کم نمی‌شه"], donts: ["نمایش XP منفی"], a11y: ["«سطح ۵، ۴۰ XP تا سطح ۶»"],
    code: (p) => dart("DdXpBar", [`level: ${p.level}`, `progress: ${(+p.progress / 100).toFixed(2)}`]) }),

  S({ id: "stat-tile", lvl: "molecule", name: "کاشی آمار", fl: "DdStatTile", kind: "mix", r: R.statTile,
    lead: "آیکون + رقم پیکسلی + برچسب.",
    props: [{ k: "icon", l: "آیکون", t: "icon", d: "streak" }, { k: "value", l: "عدد", t: "text", d: "12" }, { k: "label", l: "برچسب", t: "text", d: "بهترین زنجیره‌ی فعال" }, { k: "unit", l: "واحد", t: "sel", o: [["3", "۳"], ["4", "۴"], ["6", "۶"]], d: "3" }, { k: "suffix", l: "پسوند", t: "sel", o: [["none", "بدون"], ["percent", "٪"]], d: "none" }],
    variants: [["زنجیره", "", {}], ["امتیاز نظم", "", { icon: "chart", value: "184", label: "امتیاز نظم" }], ["پایبندی", "", { icon: "goal", value: "73", label: "پایبندی کل", suffix: "percent" }]], states: [],
    tokens: ["medal-text", "text", "text-muted", "size.numeral-unit.sm"], dos: ["برچسب کوتاه"], donts: ["بیشتر از ۳ کاشی کنار هم"], a11y: ["«بهترین زنجیره‌ی فعال: ۱۲»"],
    code: (p) => dart("DdStatTile", [`icon: ${di(p.icon)}`, `value: ${+p.value || 0}`, `label: ${dq(p.label)}`]) }),

  S({ id: "list-row", lvl: "molecule", name: "ردیف فهرست", fl: "DdListRow", kind: "flat", r: R.listRow, act: (p, a) => (a === "toggle" ? { ...p, on: !p.on } : null),
    lead: "ردیف ساده‌ی ۵۶dp برای تنظیمات و فهرست‌ها، با جداکننده‌ی ۱dp.",
    props: [{ k: "icon", l: "آیکون", t: "icon", d: "reminder" }, { k: "title", l: "عنوان", t: "text", d: "یادآوری مجدد" }, { k: "sub", l: "توضیح", t: "text", d: "تا ۲ بار، تا ۲۳:۳۰" }, { k: "trailing", l: "انتهای ردیف", t: "sel", o: [["switch", "سوییچ"], ["chevron", "فلش"], ["value", "مقدار"], ["none", "هیچ"]], d: "switch" }, { k: "value", l: "مقدار", t: "text", d: "نمایش" }, { k: "on", l: "روشن", t: "bool", d: true }, { k: "danger", l: "خطرناک", t: "bool", d: false }],
    variants: [["با سوییچ", "", {}], ["با فلش", "", { icon: "battery", title: "راهنمای باتری", sub: "تا یادآوری‌ها حتماً برسن", trailing: "chevron" }], ["با مقدار", "", { icon: "companions", title: "شمارنده‌ی همراهان", sub: "", trailing: "value" }], ["خطرناک", "جدا از بقیه", { icon: "logout", title: "خروج از حساب", sub: "", trailing: "none", danger: true }]],
    states: [], tokens: ["surface", "border", "text", "text-muted", "error", "shape.divider"], dos: ["کار خطرناک در گروه جدا، آخر فهرست"], donts: ["سایه یا پله برای ردیف"], a11y: ["کل ردیف یک هدف لمسی"],
    code: (p) => dart("DdListRow", [`icon: ${di(p.icon)}`, `title: ${dq(p.title)}`, p.sub ? `subtitle: ${dq(p.sub)}` : "", p.trailing === "switch" ? `trailing: DdSwitch(value: ${!!p.on}, onChanged: (v) {})` : p.trailing === "chevron" ? "showChevron: true" : p.trailing === "value" ? `value: ${dq(p.value)}` : "", p.danger ? "destructive: true" : "", "onTap: () {}"]) }),

  S({ id: "segmented", lvl: "molecule", name: "انتخاب چندگزینه‌ای", fl: "DdSegmented", kind: "px", r: R.segmented, act: (p, a, v) => (a === "sel" ? { ...p, selected: +v } : null),
    lead: "۲ تا ۴ گزینه‌ی چسبیده برای تم و فیلتر.",
    props: [{ k: "set", l: "گزینه‌ها", t: "sel", o: [["theme", "تم"], ["filter", "فعال/بایگانی"], ["range", "بازه"]], d: "theme" }, { k: "selected", l: "انتخاب", t: "num", min: 0, max: 3, d: 2 }],
    variants: [["تم", "", {}], ["فیلتر", "", { set: "filter", selected: 0 }]], states: [],
    tokens: ["surface", "surface-tint", "outline", "border"], dos: ["حداکثر ۴ گزینه"], donts: ["برای ناوبری اصلی"], a11y: ["radiogroup"],
    code: (p) => dart("DdSegmented", [`options: ${p.set}Options`, `selected: ${p.selected}`, "onChanged: (i) {}"]) }),

  S({ id: "companions-line", lvl: "molecule", name: "خط همراهان", fl: "DdCompanionsLine", kind: "flat", r: R.companionsLine,
    lead: "تعداد تجمیعی کسانی که امروز همون کار رو کردن؛ فقط بالای ۲۰ نفر (D-038) و قابل پنهان کردن (D-052).",
    props: [{ k: "count", l: "تعداد", t: "num", min: 0, max: 999, d: 124 }, { k: "activity", l: "کار", t: "text", d: "پیاده‌روی کردن" }, { k: "offline", l: "آفلاین", t: "bool", d: false }],
    variants: [["عادی", "", {}], ["زیر ۲۰ نفر", "عدد دسته‌ی بالاتر", { count: 12 }], ["آفلاین", "با زمان به‌روزرسانی", { offline: true }]], states: [],
    tokens: ["text-muted", "type.small"], dos: ["فقط عدد تجمیعی"], donts: ["اسم یا عکس آدم‌ها"], a11y: ["متن ساده"],
    code: (p) => dart("DdCompanionsLine", [`count: ${p.count}`, `activity: ${dq(p.activity)}`, p.offline ? "lastUpdated: lastSync" : ""]) }),

  /* ===== organisms ===== */
  S({ id: "app-header", lvl: "organism", name: "سرصفحه", fl: "DdAppHeader", kind: "flat", r: R.appHeader, wide: true,
    lead: "اصلی: تاریخ شمسی امروز و تنظیمات. داخلی: برگشت (رو به راست)، عنوان و گزینه‌های بیشتر.",
    props: [{ k: "kind", l: "گونه", t: "sel", o: [["main", "اصلی"], ["inner", "داخلی"]], d: "main" }, { k: "title", l: "عنوان", t: "text", d: "شنبه ۱۸ مهر" }, { k: "more", l: "گزینه‌های بیشتر", t: "bool", d: true }],
    variants: [["اصلی", "", {}], ["داخلی", "", { kind: "inner", title: "پیاده‌روی" }]], states: [],
    tokens: ["bg", "text", "border", "type.title-1", "type.title-2"], dos: ["تاریخ با اعداد فارسی"], donts: ["لوگو در سرصفحه‌ی داخلی"], a11y: ["عنوان صفحه heading سطح ۱"],
    code: (p) => p.kind === "main" ? dart("DdAppHeader.main", ["date: today", "onSettings: () {}"]) : dart("DdAppHeader.inner", [`title: ${dq(p.title)}`, p.more ? "onMore: () {}" : ""]) }),

  S({ id: "tab-bar", lvl: "organism", name: "نوار تب", fl: "DdTabBar", kind: "flat", r: R.tabBar, wide: true, act: (p, a, v) => (a === "tab" ? { ...p, active: +v } : null),
    lead: "سه تب پایین: امروز، سؤال‌ها، کلکسیون (تعداد نهایی در مرحله‌ی ۸، D-056).",
    props: [{ k: "active", l: "تب فعال", t: "sel", o: [["0", "امروز"], ["1", "سؤال‌ها"], ["2", "کلکسیون"]], d: "0" }],
    variants: [], states: [["امروز فعال", "", {}], ["کلکسیون فعال", "", { active: "2" }]],
    tokens: ["surface", "border", "text", "text-muted", "primary", "component.tab-bar.height"], dos: ["آیکون + برچسب"], donts: ["بیشتر از ۵ تب"], a11y: ["tablist با `aria-selected`", "ناحیه‌ی امن پایین گوشی"],
    code: (p) => dart("DdTabBar", [`current: ${p.active}`, "onSelect: (i) {}"]) }),

  S({ id: "progress-hero", lvl: "organism", name: "بخش پیشرفت", fl: "DdProgressHero", kind: "px", r: R.progressHero,
    lead: "قهرمان صفحه‌ی «امروز» (D-051): حلقه‌ی پایبندی، بهترین زنجیره، امتیاز نظم و کرکتر.",
    props: [{ k: "adherence", l: "پایبندی", t: "num", min: 0, max: 30, d: 22 }, { k: "total", l: "از", t: "num", min: 1, max: 30, d: 30 }, { k: "mode", l: "نمایش حلقه", t: "sel", o: [["days", "روز"], ["percent", "درصد"]], d: "days" }, { k: "streak", l: "بهترین زنجیره", t: "num", min: 0, max: 400, d: 12 }, { k: "score", l: "امتیاز نظم", t: "num", min: 0, max: 999, d: 184 }, { k: "level", l: "سطح", t: "num", min: 1, max: 20, d: 5 }, { k: "toNext", l: "XP تا سطح بعد", t: "num", min: 0, max: 400, d: 40 }, { k: "xpProgress", l: "پیشرفت XP ٪", t: "num", min: 0, max: 100, d: 67 }, { k: "mood", l: "حالت کرکتر", t: "sel", o: [["idle", "ایستاده"], ["celebrate", "جشن"], ["sleepy", "خواب‌آلود"]], d: "idle" }],
    variants: [["عادی", "", {}], ["کاربر تازه", "۳ روز از ۳ روز", { adherence: 3, total: 3, streak: 3, score: 15, level: 2, toNext: 20, xpProgress: 25 }]], states: [],
    tokens: ["surface", "outline", "shadow", "component.card.padding"], dos: ["پیشرفت پررنگ، کرکتر کنارش"], donts: ["کرکتر بزرگ‌تر از حلقه"], a11y: ["ترتیب خوندن: پایبندی، زنجیره، امتیاز، کرکتر"],
    code: (p) => dart("DdProgressHero", [`adherence: DdAdherence(yesDays: ${p.adherence}, scheduledDays: ${p.total})`, `bestActiveStreak: ${p.streak}`, `score: ${p.score}`, `character: DdCharacterState(level: ${p.level}, mood: DdMood.${p.mood})`]) }),

  S({ id: "character-panel", lvl: "organism", name: "پنل کرکتر", fl: "DdCharacterPanel", kind: "px", r: R.characterPanel,
    lead: "کرکتر روی پلاک + اسم + نوار XP. لمس ← کلکسیون.",
    props: [{ k: "id", l: "کرکتر", t: "sel", o: [["b-05", "فندق"], ["b-16", "برفی"]], d: "b-05" }, { k: "name", l: "اسم", t: "text", d: "فندق" }, { k: "level", l: "سطح", t: "num", min: 1, max: 20, d: 5 }, { k: "toNext", l: "XP تا بعد", t: "num", min: 0, max: 400, d: 40 }, { k: "progress", l: "پیشرفت ٪", t: "num", min: 0, max: 100, d: 67 }, { k: "mood", l: "حالت", t: "sel", o: [["idle", "ایستاده"], ["celebrate", "جشن"], ["accompany", "همراهی"], ["sleepy", "خواب‌آلود"]], d: "idle" }],
    variants: [], states: [["ایستاده", "", {}], ["جشن", "", { mood: "celebrate" }], ["همراهی", "", { mood: "accompany" }], ["خواب‌آلود", "", { mood: "sleepy" }]],
    tokens: ["surface-tint", "medal", "xp-fill"], dos: ["حالت از رفتار امروز"], donts: ["کرکتر غمگین"], a11y: ["«کرکتر تو، فندق، سطح ۵»"],
    code: (p) => dart("DdCharacterPanel", [`character: DdCharacters.${camel(p.id)}`, `name: ${dq(p.name)}`, `level: ${p.level}`, `mood: DdMood.${p.mood}`, "onTap: () {}"]) }),

  S({ id: "next-goal-card", lvl: "organism", name: "کارت هدف بعدی", fl: "DdNextGoalCard", kind: "px", r: R.nextGoalCard,
    lead: "فقط نزدیک‌ترین مدال: «۳ روز تا مدال ۲۱».",
    props: [{ k: "streak", l: "زنجیره", t: "num", min: 0, max: 364, d: 18 }, { k: "target", l: "مدال", t: "sel", o: MEDALS.map((m) => [String(m), fa(m)]), d: "21" }],
    variants: [], states: [], tokens: ["surface", "medal", "primary"], dos: ["یک هدف"], donts: ["فهرست همه‌ی مدال‌ها"], a11y: ["متن کامل هدف"],
    code: (p) => dart("DdNextGoalCard", [`currentStreak: ${p.streak}`, `nextMedal: ${p.target}`]) }),

  S({ id: "question-card", lvl: "organism", name: "کارت سؤال", fl: "DdQuestionCard", kind: "px", r: R.questionCard,
    act: (p, a, v) => (a === "answer" ? { ...p, state: v } : a === "undo" ? { ...p, state: "open" } : null),
    lead: "مهم‌ترین کامپوننت اپ: جواب در کمتر از ۱۰ ثانیه، بدون رفتن به صفحه‌ی دیگه.",
    props: [{ k: "state", l: "حالت", t: "sel", o: [["open", "جواب‌نداده"], ["yes", "بله"], ["no", "خیر"], ["freeze", "فریز دیروز"], ["slip", "در حال لغزش"]], d: "open" }, { k: "text", l: "متن سؤال", t: "text", d: "امروز ۲۰ دقیقه پیاده‌روی کردی؟" }, { k: "category", l: "دسته", t: "text", d: "ورزش · پیاده‌روی" }, { k: "streak", l: "زنجیره", t: "num", min: 0, max: 400, d: 12 }, { k: "hasFreeze", l: "فریز داره", t: "bool", d: true }, { k: "why", l: "چرا برات مهمه؟", t: "text", d: "" }],
    variants: [["با «چرا»", "گاهی نشون داده می‌شه (D-052)", { why: "می‌خوام سرحال‌تر باشم" }], ["متن بلند", "به خط بعد می‌ره", { text: "امروز قبل از ساعت ۱۱ شب گوشی رو کنار گذاشتی و خوابیدی؟" }]],
    states: [["جواب‌نداده", "", {}], ["بله", "", { state: "yes" }], ["خیر با فریز", "", { state: "no" }], ["خیر بدون فریز", "", { state: "no", hasFreeze: false }], ["فریز دیروز", "", { state: "freeze" }], ["در حال لغزش", "", { state: "slip" }]],
    tokens: ["surface", "outline", "shadow", "type.question", "component.card.padding", "component.card.gap"], dos: ["جواب‌نداده‌ها اول", "متن کامل سؤال، بدون بریدن"], donts: ["پنهان کردن «خیر»", "پیام سرزنش"], a11y: ["«امروز دویدی؟ زنجیره‌ی ۱۲ روزه. جواب نداده.»"],
    code: (p) => dart("DdQuestionCard", [`question: ${dq(p.text)}`, `category: ${dq(p.category)}`, `streak: ${p.streak}`, `answer: ${p.state === "yes" || p.state === "no" ? "DdAnswer." + p.state : "null"}`, `hasFreeze: ${!!p.hasFreeze}`, p.state === "slip" ? "slipping: true" : "", p.why ? `why: ${dq(p.why)}` : "", "onAnswer: (a) {}"]) }),

  S({ id: "slip-card", lvl: "organism", name: "کارت لغزش", fl: "DdSlipCard", kind: "px", r: R.slipCard,
    lead: "بعد از ۳ روز پیاپی «خیر» یا بی‌پاسخ (D-034)، با لحن مهربون پیشنهاد کوچیک کردن یا جابه‌جایی.",
    props: [{ k: "habit", l: "کار", t: "text", d: "پیاده‌روی" }],
    variants: [], states: [], tokens: ["surface", "outline"], dos: ["سه راه، یکی «فعلاً نه»"], donts: ["کلمه‌ی «شکست»"], a11y: ["دکمه‌ها با متن کامل"],
    code: (p) => dart("DdSlipCard", [`habit: ${dq(p.habit)}`, "onReschedule: () {}", "onShrink: () {}", "onDismiss: () {}"]) }),

  S({ id: "alert-card", lvl: "organism", name: "کارت هشدار", fl: "DdAlertCard", kind: "px", r: R.alertCard,
    lead: "هشدار ملایم بالای «امروز»، همیشه با راه درست کردن. حالت آفلاین خبری‌ه، نه هشدار.",
    props: [{ k: "kind", l: "نوع", t: "sel", o: [["notif", "نوتیفیکیشن خاموش"], ["battery", "یادآوری نرسید"], ["offline", "آفلاین"]], d: "notif" }],
    variants: [["نوتیفیکیشن", "", {}], ["باتری", "", { kind: "battery" }], ["آفلاین", "", { kind: "offline" }]], states: [],
    tokens: ["surface", "medal-text", "text-muted", "outline"], dos: ["یک هشدار در یک زمان"], donts: ["رنگ خطا برای هشدار"], a11y: ["alert برای هشدار، status برای آفلاین"],
    code: (p) => dart("DdAlertCard", [`kind: DdAlertKind.${p.kind}`, p.kind !== "offline" ? "onFix: () {}" : ""]) }),

  S({ id: "no-sheet", lvl: "organism", name: "برگه‌ی «خیر»", fl: "DdNoSheet", kind: "px", r: R.noSheet, act: (p, a, v) => (a === "pick" ? { ...p, reason: +v } : null),
    lead: "بعد از «خیر»: پیام فریز یا بهترین زنجیره، دلیل اختیاری، و گاهی «چرا».",
    props: [{ k: "hasFreeze", l: "فریز داره", t: "bool", d: true }, { k: "freezes", l: "فریزهای این ماه", t: "num", min: 0, max: 2, d: 2 }, { k: "streak", l: "زنجیره", t: "num", min: 0, max: 400, d: 12 }, { k: "why", l: "چرا", t: "text", d: "می‌خوام سرحال‌تر باشم" }, { k: "reason", l: "دلیل انتخاب‌شده", t: "num", min: -1, max: 4, d: -1 }],
    variants: [["با فریز", "", {}], ["بدون فریز", "", { hasFreeze: false }]], states: [],
    tokens: ["surface", "surface-tint", "scrim", "component.sheet.padding", "component.sheet.handle-width"], dos: ["جواب «خیر» قبل از برگه ثبت شده"], donts: ["اجبار به دلیل", "سرزنش"], a11y: ["فوکوس داخل برگه؛ بستن با کشیدن یا «رد شو»"],
    code: (p) => dart("showDdNoSheet", ["context", `freezeAvailable: ${!!p.hasFreeze}`, `streak: ${p.streak}`, p.why ? `why: ${dq(p.why)}` : ""]) }),

  S({ id: "confirm-sheet", lvl: "organism", name: "برگه‌ی تأیید", fl: "DdConfirmSheet", kind: "px", r: R.confirmSheet,
    lead: "تأیید کار مهم. کار برگشت‌ناپذیر با متن خطا.",
    props: [{ k: "kind", l: "نوع", t: "sel", o: [["normal", "برگشت‌پذیر"], ["destructive", "برگشت‌ناپذیر"]], d: "normal" }],
    variants: [["برگشت‌پذیر", "", {}], ["برگشت‌ناپذیر", "", { kind: "destructive" }]], states: [],
    tokens: ["surface", "scrim", "error"], dos: ["پیامد رو صریح بگو"], donts: ["تأیید برای کار کوچیک"], a11y: ["دکمه‌ی امن («نه، بمونه») در دسترس"],
    code: (p) => dart("showDdConfirmSheet", ["context", `title: ${dq(p.kind === "destructive" ? "حساب حذف بشه؟" : "این سؤال تموم بشه؟")}`, p.kind === "destructive" ? "destructive: true" : ""]) }),

  S({ id: "moment-overlay", lvl: "organism", name: "لحظه‌ی جشن", fl: "DdMomentOverlay", kind: "px", r: R.momentOverlay,
    lead: "مدال تازه یا سطح تازه، با XP و اشتراک.",
    props: [{ k: "kind", l: "نوع", t: "sel", o: [["medal", "مدال تازه"], ["level", "سطح تازه"]], d: "medal" }, { k: "value", l: "عدد", t: "num", min: 2, max: 365, d: 21 }],
    variants: [["مدال", "", {}], ["مدال ۶۶", "ویژه", { value: 66 }], ["سطح", "", { kind: "level", value: 6 }]], states: [],
    tokens: ["surface", "scrim", "medal", "medal-text", "motion.duration.celebrate"], dos: ["یک لحظه در یک زمان"], donts: ["پنهان کردن دکمه‌ی ادامه"], a11y: ["با کاهش حرکت بدون انیمیشن ورود"],
    code: (p) => dart("showDdMoment", ["context", p.kind === "medal" ? `DdMoment.medal(days: ${p.value})` : `DdMoment.level(${p.value})`]) }),

  S({ id: "month-calendar", lvl: "organism", name: "تقویم ماهانه", fl: "DdMonthCalendar", kind: "flat", r: R.monthCalendar,
    lead: "ماه شمسی، شنبه تا جمعه از راست، خونه‌های ۴۰dp. داده‌ی نمونه: مهر ۱۴۰۵.",
    props: [{ k: "today", l: "امروز", t: "num", min: 1, max: 30, d: 18 }],
    variants: [], states: [], tokens: ["component.calendar-cell.size", "chain-yes", "chain-freeze", "chain-no"], dos: ["فلش راست = ماه قبل"], donts: ["تقویم میلادی برای فارسی"], a11y: ["هر روز: «۹ مهر: فریز»"],
    code: () => dart("DdMonthCalendar", ["month: JalaliMonth(1405, 7)", "days: answers", "onDayTap: (d) {}"]) }),

  S({ id: "empty-state", lvl: "organism", name: "حالت خالی", fl: "DdEmptyState", kind: "flat", r: R.emptyState,
    lead: "کرکتر یا آیکون + عنوان + توضیح + کار بعدی.",
    props: [{ k: "kind", l: "نوع", t: "sel", o: [["none", "بدون سؤال"], ["archive", "بایگانی خالی"], ["done", "همه جواب داده شد"]], d: "none" }],
    variants: [["بدون سؤال", "", {}], ["بایگانی خالی", "", { kind: "archive" }], ["روز تموم شد", "", { kind: "done" }]], states: [],
    tokens: ["text", "text-muted"], dos: ["یک کار مشخص"], donts: ["صفحه‌ی خالی بی‌توضیح"], a11y: ["عنوان heading"],
    code: (p) => dart("DdEmptyState", [`kind: DdEmptyKind.${p.kind}`]) }),

  S({ id: "collection-grid", lvl: "organism", name: "شبکه‌ی کلکسیون", fl: "DdCollectionGrid", kind: "px", r: R.collectionGrid,
    lead: "کرکترها و وسیله‌ها: باز، فعال، قفل با سطح لازم.",
    props: [{ k: "count", l: "ستون", t: "sel", o: [["3", "۳"], ["4", "۲×۲"]], d: "3" }],
    variants: [], states: [], tokens: ["surface", "surface-tint", "focus", "track"], dos: ["نشون دادن سطح لازم برای قفل‌ها"], donts: ["پس گرفتن چیز باز شده"], a11y: ["«قفل، سطح ۸»"],
    code: () => dart("DdCollectionGrid", ["items: collection", "activeId: current", "onSelect: (item) {}"]) }),
];
