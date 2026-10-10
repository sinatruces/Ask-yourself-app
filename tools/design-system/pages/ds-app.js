/* Didit design system — site: navigation, page templates, playground and Today simulator. */

/* ---------- templates (4) ---------- */
function phone(inner, { tab = 0, fab = true, header = "", small = false, foot = "" } = {}) {
  return `<div class="phone ${small ? "sm" : ""}">${header}<div class="scroll"><div class="body">${inner}</div></div>${fab ? `<div class="fabpos">${R.iconButton({ kind: "fab", icon: "add", label: "ساختن سؤال" })}</div>` : ""}${foot || (tab >= 0 ? R.tabBar({ active: tab }) : "")}</div>`;
}
const TPL = {
  today: () => phone(
    R.alertCard({ kind: "notif" }) +
    R.progressHero({ adherence: 22, total: 30, mode: "days", streak: 12, score: 184, level: 5, toNext: 40, xpProgress: 67, mood: "idle" }) +
    R.nextGoalCard({ streak: 18, target: 21 }) +
    R.questionCard({ state: "open", text: "امروز ۲۰ دقیقه پیاده‌روی کردی؟", category: "ورزش · پیاده‌روی", streak: 12, hasFreeze: true }) +
    R.questionCard({ state: "yes", text: "امروز ۱۰ صفحه کتاب خوندی؟", category: "یادگیری · مطالعه", streak: 19, hasFreeze: true }) +
    R.companionsLine({ count: 124, activity: "پیاده‌روی کردن" }),
    { header: R.appHeader({ kind: "main", title: "شنبه ۱۸ مهر" }) }),
  list: () => phone(
    `<div style="padding-top:4px">${R.segmented({ set: "filter", selected: 0 })}</div>` +
    [["امروز ۲۰ دقیقه پیاده‌روی کردی؟", "ورزش", 12, 73], ["امروز ۱۰ صفحه کتاب خوندی؟", "یادگیری", 20, 90], ["امروز قبل از ۱۱ خوابیدی؟", "خواب", 0, 41]].map(([q, c, s, a]) => `<div class="lift w100"><div class="px card"><div class="qc"><div class="top"><span class="tag">${c}</span>${icon("forward")}</div></div><b style="font-size:16px">${q}</b><div class="qc"><div class="top"><span class="streak">${s ? `<span class="ic">${icon("streak")}</span>${pxnum(s, 3)}` : `<span class="note-l">در حال لغزش</span>`}</span><span class="note-l">پایبندی ${fa(a)}٪</span></div></div></div></div>`).join(""),
    { header: `<header class="ahdr"><h4>سؤال‌ها</h4><button class="ibtn" type="button" aria-label="بایگانی">${icon("archive")}</button></header>`, tab: 1 }),
  detail: () => phone(
    `<div class="lift w100"><div class="px card" style="grid-template-columns:repeat(3,minmax(0,1fr))">${R.statTile({ icon: "streak", value: 12, unit: 3, label: "زنجیره" })}${R.statTile({ icon: "trophy", value: 23, unit: 3, label: "بهترین" })}${R.statTile({ icon: "goal", value: 73, unit: 3, label: "پایبندی", suffix: "percent" })}</div></div>` +
    R.monthCalendar({ today: 18 }) +
    `<div style="display:grid;gap:6px"><b>چرا برات مهمه؟</b><p class="note-l">می‌خوام سرحال‌تر باشم و کمتر خسته شم.</p></div>` +
    `<div style="display:grid;gap:10px"><b>مدال‌ها</b><div class="medals" style="justify-content:flex-start">${[7, 21, 30].map((m) => medalSvg(m, 44, m > 7)).join("")}</div></div>` +
    R.button({ variant: "secondary", label: "تموم کردن و کارنامه", block: true }),
    { header: R.appHeader({ kind: "inner", title: "پیاده‌روی", more: true }), fab: false, tab: 1 }),
  flow: () => phone(
    `<div style="display:grid;gap:8px;padding-top:8px"><span class="note-l">قدم ۱ از ۵</span>${barHTML(20, "leaf", "قدم ۱ از ۵")}</div>
     <h4 style="font-size:20px;line-height:32px">سؤالت درباره‌ی چیه؟</h4>
     <p class="note-l">یه دسته انتخاب کن؛ بعدش قالب‌های آماده رو نشونت می‌دیم.</p>` +
    R.chipGroup({ set: "categories", mode: "single", selected: "0" }),
    { header: `<header class="ahdr inner"><button class="ibtn" type="button" aria-label="برگشت">${icon("back")}</button><h4>سؤال تازه</h4>${R.button({ variant: "text", label: "رد شو" })}</header>`, fab: false,
      foot: `<div style="padding:12px 16px 16px;background:var(--dd-bg);border-block-start:2px solid var(--dd-border)">${R.button({ variant: "primary", label: "ادامه", block: true })}</div>` }),
};
REG.push(
  S({ id: "tpl-today", lvl: "template", name: "قالب «امروز»", fl: "S11", kind: "mix", r: TPL.today, tpl: true,
    lead: "مهم‌ترین صفحه‌ی اپ. ترتیب از بالا، با پیشرفت به‌عنوان قهرمان (D-051).",
    regions: ["سرصفحه: تاریخ شمسی امروز و تنظیمات", "کارت هشدار، فقط وقتی لازمه", "بخش پیشرفت: حلقه، زنجیره، امتیاز، کرکتر", "کارت هدف بعدی", "کارت‌های سؤال امروز؛ جواب‌نداده‌ها اول", "کارت لغزش، فقط وقتی لازمه", "خط همراهان", "دکمه‌ی + شناور و نوار تب"],
    pages: "S11 امروز" }),
  S({ id: "tpl-list", lvl: "template", name: "قالب فهرست", fl: "S15 · S19 · S20 · S23", kind: "mix", r: TPL.list, tpl: true,
    lead: "سرصفحه با عنوان، فیلتر اختیاری، فهرست کارت یا ردیف، حالت خالی، دکمه‌ی شناور اختیاری.",
    regions: ["سرصفحه با عنوان و یک کار (بایگانی)", "انتخاب چندگزینه‌ای برای فیلتر", "کارت یا ردیف برای هر مورد، با زنجیره و پایبندی", "حالت خالی وقتی چیزی نیست", "دکمه‌ی + و نوار تب"],
    pages: "سؤال‌ها، بایگانی، کلکسیون، تنظیمات، حساب" }),
  S({ id: "tpl-detail", lvl: "template", name: "قالب جزئیات", fl: "S14 · S16 · S18", kind: "mix", r: TPL.detail, tpl: true,
    lead: "سرصفحه‌ی داخلی، کاشی‌های آمار، تقویم، بخش‌های متنی و کار پایین صفحه.",
    regions: ["سرصفحه‌ی داخلی: برگشت، عنوان، گزینه‌های بیشتر", "سه کاشی آمار", "تقویم ماهانه", "«چرا برات مهمه؟»", "مدال‌ها", "کار پایین صفحه (فرعی)"],
    pages: "جزئیات سؤال، خلاصه‌ی هفتگی، کارنامه" }),
  S({ id: "tpl-flow", lvl: "template", name: "قالب قدم‌به‌قدم", fl: "S01–S10 · S06 · S17", kind: "mix", r: TPL.flow, tpl: true,
    lead: "نوار قدم‌ها، برگشت و «رد شو»، عنوان، محتوای قدم و دکمه‌ی اصلی چسبیده به پایین.",
    regions: ["سرصفحه‌ی داخلی با «رد شو»", "شماره‌ی قدم و نوار پیشرفت", "عنوان و توضیح کوتاه", "محتوای قدم (چیپ، فیلد، انتخاب ساعت)", "دکمه‌ی اصلی چسبیده به پایین، بالای کیبورد"],
    pages: "آنبوردینگ، ثبت‌نام، ساخت و ویرایش سؤال" })
);
REG.forEach((e) => { e.def = Object.fromEntries((e.props || []).map((p) => [p.k, p.d])); });
const BY_ID = Object.fromEntries(REG.map((e) => [e.id, e]));

/* ---------- navigation model ---------- */
const FOUND = [
  { id: "color", name: "رنگ", ic: "theme-light" }, { id: "typography", name: "تایپوگرافی", ic: "edit" }, { id: "numerals", name: "اعداد پیکسلی", ic: "chart" },
  { id: "spacing", name: "فاصله و چیدمان", ic: "expand" }, { id: "shape", name: "شکل و سایه", ic: "celebrate" }, { id: "motion", name: "حرکت", ic: "sync" }, { id: "icons", name: "آیکون‌ها", ic: "gift" },
];
const NAV = [
  { key: "start", title: "شروع", items: [{ id: "intro", name: "معرفی", ic: "today" }, { id: "principles", name: "اصول و سبک پیکسلی", ic: "goal" }] },
  { key: "found", title: "پایه‌ها", items: FOUND },
  ...["atom", "molecule", "organism", "template"].map((l) => ({ key: l, title: LV[l], overview: l, items: REG.filter((e) => e.lvl === l).map((e) => ({ id: e.id, name: e.name, kind: e.kind, fl: e.fl })) })),
  { key: "play", title: "Playground", items: [{ id: "playground", name: "کامپوننت‌ها با کنترل", ic: "settings" }, { id: "simulator", name: "شبیه‌ساز «امروز»", ic: "today" }] },
];
const ORDER = NAV.flatMap((g) => (g.overview ? [{ id: g.overview, name: g.title }] : []).concat(g.items));
const LEVEL_IDS = { atom: "atoms", molecule: "molecules", organism: "organisms", template: "templates" };

function renderNav(filter = "") {
  const f = filter.trim();
  let html = "";
  NAV.forEach((g) => {
    const items = g.items.filter((it) => !f || it.name.includes(f) || (it.fl || "").toLowerCase().includes(f.toLowerCase()) || it.id.includes(f.toLowerCase()));
    if (!items.length && !(g.overview && !f)) return;
    const head = g.overview ? `<a href="#${LEVEL_IDS[g.overview]}" style="padding:0;font-weight:inherit;color:inherit">${g.title}</a>` : g.title;
    html += `<div class="nav-group ${g.key === "play" ? "play" : ""}"><h4>${head}<span>${g.overview ? fa(g.items.length) : ""}</span></h4><ul>`;
    items.forEach((it) => {
      const mark = it.kind ? `<span class="k ${it.kind === "flat" ? "flat-k" : "px-k"}" aria-hidden="true"></span>` : g.key === "play" ? `<span class="ic">${icon(it.ic, 24)}</span>` : "";
      html += `<li><a href="#${it.id}" data-id="${it.id}">${mark}<span>${it.name}</span></a></li>`;
    });
    html += "</ul></div>";
  });
  $("#nav").innerHTML = html || `<p class="nav-empty">چیزی پیدا نشد.</p>`;
  markCurrent();
}
function markCurrent() {
  const id = currentId();
  $$("#nav a[data-id]").forEach((a) => { if (a.dataset.id === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
}
const currentId = () => (location.hash || "#intro").slice(1) || "intro";

/* ---------- preview stages ---------- */
const PV = new Map();
let pvSeq = 0;
const MODES = [["page", "تم صفحه"], ["light", "روشن"], ["dark", "تیره"], ["both", "کنار هم"]];
function stageHTML(entry, props, { mode = "page", foot = "", key } = {}) {
  key = key || `pv${++pvSeq}`;
  PV.set(key, { entry, props: { ...entry.def, ...props }, mode });
  return `<div class="stage-wrap" data-pv="${key}"><div class="stage-bar"><span class="lbl">پیش‌نمایش زنده · بزنش و امتحان کن</span><div class="seg sm" role="radiogroup" aria-label="تم پیش‌نمایش">${MODES.map(([m, l]) => `<button class="px" type="button" role="radio" aria-checked="${m === mode}" data-mode="${m}">${l}</button>`).join("")}</div></div><div class="stages" data-stages></div>${foot ? `<div class="stage-foot">${foot}</div>` : ""}</div>`;
}
function renderStages(key) {
  const pv = PV.get(key), wrap = $(`[data-pv="${key}"]`); if (!pv || !wrap) return;
  const themes = pv.mode === "both" ? ["light", "dark"] : [pv.mode];
  const wide = pv.entry.wide || pv.entry.tpl || ["progress-hero", "question-card", "slip-card", "alert-card", "no-sheet", "confirm-sheet", "moment-overlay", "next-goal-card", "character-panel"].includes(pv.entry.id);
  $("[data-stages]", wrap).innerHTML = themes.map((t) => `<div class="stage ${t === "page" ? "" : "dd-" + t}">${t === "page" ? "" : `<span class="tag-theme">${t === "light" ? "روشن" : "تیره"}</span>`}<div class="fit ${wide ? "wide" : ""}" ${wide && !pv.entry.tpl ? 'style="max-width:24rem"' : ""}>${pv.entry.r(pv.props)}</div></div>`).join("");
  $$("[data-mode]", wrap).forEach((b) => b.setAttribute("aria-checked", b.dataset.mode === pv.mode));
  hydrate(wrap);
  if (pv.onChange) pv.onChange(pv);
}
document.addEventListener("click", (e) => {
  const wrap = e.target.closest("[data-pv]"); if (!wrap) return;
  const key = wrap.dataset.pv, pv = PV.get(key); if (!pv) return;
  const m = e.target.closest("[data-mode]");
  if (m) { pv.mode = m.dataset.mode; renderStages(key); return; }
  const a = e.target.closest("[data-act]");
  if (a && pv.entry.act) {
    const next = pv.entry.act(pv.props, a.dataset.act, a.dataset.val);
    if (next) { pv.props = next; renderStages(key); syncControls(key); if (a.dataset.act === "answer") live(a.dataset.val === "yes" ? "بله ثبت شد" : "خیر ثبت شد"); }
  }
});

/* ---------- small builders ---------- */
const crumb = (parts) => `<nav class="crumb" aria-label="مسیر">${parts.map(([l, h], i) => (h ? `<a href="#${h}">${l}</a>` : `<span>${l}</span>`) + (i < parts.length - 1 ? `<span aria-hidden="true">‹</span>` : "")).join("")}</nav>`;
const sec = (id, title, inner, note = "") => `<section class="sec" id="s-${id}" aria-labelledby="h-${id}"><h2 id="h-${id}">${title}</h2>${note ? `<p class="note">${note}</p>` : ""}${inner}</section>`;
function codeBlock(src, label = "Flutter") {
  const hl = esc(src).replace(/\b(Dd[A-Za-z.]+|show[A-Z][A-Za-z]+)/g, '<span class="k1">$1</span>').replace(/(&#39;|')(.*?)\1/g, '<span class="k2">\'$2\'</span>').replace(/\b(true|false|null)\b/g, '<span class="k3">$1</span>');
  return `<div class="code"><button class="copy" type="button" data-copy>کپی</button><pre aria-label="${label}"><code>${hl}</code></pre></div>`;
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-copy]"); if (!b) return;
  const text = b.dataset.copyText || b.parentElement.querySelector("pre").innerText;
  try { await navigator.clipboard.writeText(text); b.textContent = "کپی شد"; }
  catch { const r = document.createRange(); r.selectNodeContents(b.parentElement.querySelector("pre") || b); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "انتخاب شد"; }
  setTimeout(() => { b.textContent = "کپی"; }, 1500);
});
function tokenRow(name) {
  const isTheme = !name.includes(".");
  if (isTheme) {
    const l = DATA.tokens["theme.light." + name], d = DATA.tokens["theme.dark." + name];
    return `<tr><td><code>${name}</code></td><td><span class="sw"><i style="background:${l}"></i>${l}</span></td><td><span class="sw"><i style="background:${d}"></i>${d}</span></td></tr>`;
  }
  let v = DATA.tokens[name];
  if (v && typeof v === "object") v = `${v.fontSize} / ${v.lineHeight} · ${v.fontWeight}`;
  return `<tr><td><code>${name}</code></td><td colspan="2" class="muted"><code>${esc(v ?? "—")}</code></td></tr>`;
}
const pager = (id) => {
  const i = ORDER.findIndex((o) => o.id === id); const prev = ORDER[i - 1], next = ORDER[i + 1];
  return `<nav class="pager" aria-label="صفحه‌ی قبل و بعد">${prev ? `<a href="#${prev.id}"><span>قبلی</span><b>${prev.name}</b></a>` : "<span></span>"}${next ? `<a class="next" href="#${next.id}"><span>بعدی</span><b>${next.name}</b></a>` : ""}</nav>`;
};
const kindLabel = (k) => ({ px: "پیکسلی", flat: "ساده", mix: "ترکیبی" })[k];

/* ---------- component page ---------- */
function componentPage(e) {
  if (e.tpl) return templatePage(e);
  const hasPlay = e.props && e.props.length;
  const parts = [["preview", "پیش‌نمایش"], e.variants?.length && ["variants", "گونه‌ها"], e.states?.length && ["states", "حالت‌ها"], hasPlay && ["props", "ویژگی‌ها"], ["tokens", "توکن‌ها"], ["usage", "بایدها و نبایدها"], ["a11y", "دسترس‌پذیری"], ["code", "Flutter"]].filter(Boolean);
  const cellGrid = (list) => `<div class="grid-v ${e.wide || ["question-card", "progress-hero", "slip-card", "alert-card", "no-sheet", "confirm-sheet", "moment-overlay"].includes(e.id) ? "wide" : ""}">${list.map(([cap, sub, p]) => `<div class="cellv"><div class="show">${e.r({ ...e.def, ...p })}</div><div class="cap"><b>${cap}</b>${sub ? `<span>${sub}</span>` : ""}</div></div>`).join("")}</div>`;
  const props = hasPlay ? `<div class="tw"><table class="t"><thead><tr><th>ویژگی</th><th>کاربرد</th><th>مقدارها</th><th>پیش‌فرض</th></tr></thead><tbody>${e.props.map((p) => `<tr><td><code>${p.k}</code></td><td>${p.l}</td><td class="muted">${p.t === "sel" ? p.o.map((o) => o[1]).join("، ") : p.t === "bool" ? "بله / خیر" : p.t === "num" ? `${fa(p.min)} تا ${fa(p.max)}` : p.t === "icon" ? "نام آیکون" : "متن"}</td><td class="muted">${p.t === "sel" ? (p.o.find((o) => o[0] === String(p.d)) || [0, p.d])[1] : p.t === "bool" ? (p.d ? "بله" : "خیر") : esc(fa(p.d === "" ? "—" : p.d))}</td></tr>`).join("")}</tbody></table></div>` : "";
  return `<div class="page">
    <div class="phead">${crumb([[LV[e.lvl], LEVEL_IDS[e.lvl]], [e.name]])}<h1>${e.name}</h1>
      <div class="chips"><span class="chip-i code">${e.fl}</span><span class="chip-i ${e.kind === "px" ? "brand" : ""}">${kindLabel(e.kind)}</span>${hasPlay ? `<a class="chip-i" href="#playground" data-play="${e.id}">${icon("settings", 24)}باز کردن در Playground</a>` : ""}</div>
      <p class="lead">${e.lead}</p>
      <nav class="toc" aria-label="بخش‌های این صفحه">${parts.map(([id, l]) => `<a href="#${e.id}" data-jump="s-${id}">${l}</a>`).join("")}</nav></div>
    ${sec("preview", "پیش‌نمایش", stageHTML(e, {}))}
    ${e.variants?.length ? sec("variants", "گونه‌ها", cellGrid(e.variants)) : ""}
    ${e.states?.length ? sec("states", "حالت‌ها", cellGrid(e.states)) : ""}
    ${hasPlay ? sec("props", "ویژگی‌ها", props, "همین ویژگی‌ها در Playground قابل تغییرن.") : ""}
    ${sec("tokens", "توکن‌ها", `<div class="tw"><table class="t"><thead><tr><th>توکن</th><th>روشن</th><th>تیره</th></tr></thead><tbody>${e.tokens.map(tokenRow).join("")}</tbody></table></div>`)}
    ${sec("usage", "بایدها و نبایدها", `<div class="dd"><div class="do"><h3>${icon("yes")}بکن</h3><ul>${e.dos.map((x) => `<li>${x}</li>`).join("")}</ul></div><div class="dont"><h3>${icon("close")}نکن</h3><ul>${e.donts.map((x) => `<li>${x}</li>`).join("")}</ul></div></div>`)}
    ${sec("a11y", "دسترس‌پذیری", `<ul class="plain">${e.a11y.map((x) => `<li>${x.replace(/`([^`]+)`/g, "<code>$1</code>")}</li>`).join("")}</ul>`)}
    ${sec("code", "Flutter", codeBlock(e.code(e.def)), "ویجت‌ها هنوز ساخته نشدن؛ این API پیشنهادیه و در مرحله‌ی توسعه نهایی می‌شه.")}
    ${pager(e.id)}</div>`;
}
function templatePage(e) {
  return `<div class="page">
    <div class="phead">${crumb([[LV.template, "templates"], [e.name]])}<h1>${e.name}</h1><div class="chips"><span class="chip-i code">${e.fl}</span></div><p class="lead">${e.lead}</p></div>
    ${sec("layout", "چیدمان", `<div class="tpl">${stageHTML(e, {}, { mode: "page" }).replace('class="stage-wrap"', 'class="stage-wrap" style="flex:0 1 auto"')}<div class="tpl-legend"><b style="color:var(--dd-text)">بخش‌ها از بالا</b><ol>${e.regions.map((r) => `<li>${r}</li>`).join("")}</ol><p>صفحه‌ها: ${e.pages}</p><p>حاشیه‌ی کناری ۱۶، فاصله‌ی بخش‌ها ۲۰ تا ۲۴، نوار تب و دکمه‌ی پایین با ناحیه‌ی امن گوشی.</p></div></div>`)}
    ${pager(e.id)}</div>`;
}
function levelPage(lvl) {
  const items = REG.filter((e) => e.lvl === lvl);
  const lead = { atom: "کوچک‌ترین اجزا؛ داده‌ی محصول نمی‌شناسن و هر جای اپ استفاده می‌شن.", molecule: "چند اتم با یک کار مشخص.", organism: "بخش‌های کامل صفحه که داده‌ی محصول (سؤال، جواب، XP) می‌گیرن.", template: "چیدمان صفحه از ارگانیسم‌ها، بدون داده‌ی واقعی. صفحه‌های نهایی در مرحله‌ی ۸." }[lvl];
  return `<div class="page"><div class="phead">${crumb([[LV[lvl]]])}<h1>${LV[lvl]}</h1><p class="lead">${lead} ${fa(items.length)} مورد.</p></div>
    <div class="cards">${items.map((e) => `<a class="ccard" href="#${e.id}"><div class="mini"><div class="scale" style="--s:${e.tpl ? 0.2 : ["question-card", "progress-hero", "no-sheet", "confirm-sheet", "moment-overlay", "month-calendar", "slip-card"].includes(e.id) ? 0.55 : 0.85}">${e.r(e.def)}</div></div><div class="meta"><b>${e.name}</b><span>${kindLabel(e.kind)}</span><code>${e.fl}</code></div></a>`).join("")}</div>${pager(LEVEL_IDS[lvl])}</div>`;
}

/* ---------- start pages ---------- */
function introPage() {
  const n = (l) => REG.filter((e) => e.lvl === l).length;
  return `<div class="page">
    <div class="phead"><h1>دیزاین سیستم دیدیت</h1><p class="lead">همه‌ی اجزای بصری اپ، از رنگ و فاصله تا کامپوننت و قالب صفحه. هر کامپوننت صفحه‌ی خودش رو داره با یک ساختار ثابت: پیش‌نمایش زنده، گونه‌ها، حالت‌ها، ویژگی‌ها، توکن‌ها، بایدها و نبایدها، دسترس‌پذیری و کد Flutter. در Playground می‌شه هر کامپوننت رو تنظیم کرد یا صفحه‌ی «امروز» رو روز به روز جلو برد.</p>
      <div class="chips"><span class="chip-i brand">Atomic Design</span><span class="chip-i">پیکسلی ترکیبی</span><span class="chip-i">Flutter، بدون Material</span><span class="chip-i">راست‌به‌چپ</span><span class="chip-i">روشن و تیره</span></div></div>
    ${sec("count", "اندازه‌ی سیستم", `<div class="stats">${[["color", Object.keys(DATA.tokens).length, "توکن"], ["icons", Object.keys(DATA.icons).length, "آیکون"], ["atoms", n("atom"), "اتم"], ["molecules", n("molecule"), "مولکول"], ["organisms", n("organism"), "ارگانیسم"], ["templates", n("template"), "قالب"]].map(([h, v, l]) => `<a class="stat-c" href="#${h}">${pxnum(v, 4)}<span>${l}</span></a>`).join("")}</div>`)}
    ${sec("map", "از کجا شروع کنم", `<div class="cards">${[["principles", "اصول و سبک پیکسلی", "پنج اصل و قاعده‌ی «کجا پیکسلی، کجا ساده»"], ["color", "پایه‌ها", "رنگ، تایپ، اعداد پیکسلی، فاصله، شکل، حرکت، آیکون"], ["question-card", "کارت سؤال", "مهم‌ترین کامپوننت اپ"], ["playground", "Playground", "هر کامپوننت با کنترل‌ها و کد Flutter"], ["simulator", "شبیه‌ساز «امروز»", "جواب بده، روز رو جلو ببر، فریز و XP رو ببین"], ["tpl-today", "قالب «امروز»", "چیدمان صفحه‌ی اصلی"]].map(([h, t, d]) => `<a class="ccard" href="#${h}" style="grid-template-rows:auto"><div class="meta" style="border:0"><b>${t}</b><span>${d}</span></div></a>`).join("")}</div>`)}
    ${sec("more", "منابع", `<ul class="plain"><li><a href="https://claude.ai/artifact/UKKarSEFcVJJfPSsx2p6c8" target="_blank" rel="noopener">مجموعه‌ی اسناد</a>: پنج سند دیزاین سیستم با جزئیات و دلیل هر تصمیم</li><li><a href="https://claude.ai/artifact/JM4KBx5EyVazMasQeogWsv" target="_blank" rel="noopener">انتخاب کرکترها</a>: ۸۴ کاندید و ۶ جایگاه انتشار اول</li><li>منبع مقدارها: <code>docs/07-design-system/tokens/tokens.json</code>؛ این صفحه و اپ از یک فایل ساخته می‌شن.</li></ul>`)}
    ${pager("intro")}</div>`;
}
function principlesPage() {
  const P = [["صداقت از شکست مهم‌تره", "«خیر» هیچ‌وقت قرمز نیست؛ دکمه‌ی «خیر» هم‌اندازه و خنثی‌ست؛ کرکتر غمگین نمی‌شه."], ["حلقه‌ی روزانه زیر ۱۰ ثانیه", "کارت سؤال بزرگ‌ترین هدف لمسی صفحه‌ست و بدون رفتن به صفحه‌ی دیگه جواب می‌گیره."], ["پیشرفت قهرمانه", "پایبندی و زنجیره با رقم پیکسلی بزرگ؛ بازی کنارشه، نه جلوش (D-051)."], ["پیکسل جایی که لذت می‌ده، سادگی جایی که باید خوند", "قاعده‌ی سبک ترکیبی (D-058)."], ["یک منبع، دو خروجی", "هر مقدار بصری یک توکن داره؛ این صفحه و اپ Flutter از یک فایل ساخته می‌شن."]];
  const rows = [["دکمه‌ها (اصلی، فرعی، بله، خیر، شناور)", "متن‌ها و عنوان‌ها"], ["کارت‌ها و برگه‌ها", "فیلدهای متن و کد"], ["نوار پیشرفت، حلقه، زنجیره، تقویم", "فهرست‌ها و ردیف‌های تنظیمات"], ["مدال، نشان سطح، نوار XP", "سوییچ و انتخاب ساعت"], ["کرکتر و آیکون‌ها", "نوار تب و سرصفحه"], ["اعداد بزرگ (رقم پیکسلی)", "اعداد داخل متن"]];
  return `<div class="page"><div class="phead">${crumb([["شروع"], ["اصول و سبک پیکسلی"]])}<h1>اصول و سبک پیکسلی</h1><p class="lead">هر تصمیم دیزاین سیستم باید با این پنج اصل جور باشه.</p></div>
    ${sec("p", "پنج اصل", `<ol class="principles">${P.map(([b, s], i) => `<li><span class="no">${fa(i + 1)}</span><div><b>${b}</b><span>${s}</span></div></li>`).join("")}</ol>`)}
    ${sec("rule", "کجا پیکسلی، کجا ساده", `<div class="tw"><table class="t"><thead><tr><th><span class="k px-k"></span> پیکسلی</th><th><span class="k flat-k"></span> ساده و خوانا</th></tr></thead><tbody>${rows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody></table></div>
      <div class="grid-v wide"><div class="cellv"><div class="show"><div class="lift"><div class="px card" style="width:14rem;height:5rem"></div></div></div><div class="cap"><b>نشانه‌های پیکسلی</b><span>گوشه‌ی پله‌ای، خط دور ۲، سایه‌ی سخت ۴ رو به پایین، حرکت پله‌ای</span></div></div><div class="cellv"><div class="show"><div style="width:14rem;height:5rem;background:var(--dd-surface);border:2px solid var(--dd-border)"></div></div><div class="cap"><b>نشانه‌های ساده</b><span>گوشه‌ی صاف، لبه‌ی ۲ رنگ border، بدون سایه</span></div></div></div>`, "در فهرست کناری، مربع سبز یعنی پیکسلی و مربع توخالی یعنی ساده.")}
    ${pager("principles")}</div>`;
}

/* ---------- foundations ---------- */
const ROLE_USE = { bg: "زمینه‌ی صفحه", surface: "کارت، برگه، فیلد", "surface-tint": "سطح برند، انتخاب‌شده", "surface-sunken": "فرورفته، برچسب خنثی", "surface-pressed": "جزء ساده‌ی فشرده", text: "متن اصلی", "text-muted": "متن فرعی", outline: "خط دور پیکسلی", border: "لبه‌ی اجزای ساده", primary: "دکمه‌ی اصلی", "on-primary": "متن روی دکمه‌ی اصلی", "primary-pressed": "اصلی فشرده", yes: "دکمه و خونه‌ی «بله»", "yes-text": "متن سبز و لینک", "no-text": "متن «خیر»", "no-border": "لبه‌ی «خیر»", focus: "حلقه‌ی فوکوس", medal: "مدال و XP", "medal-text": "متن طلایی، هشدار", "on-medal": "متن روی طلا", error: "فقط خطای سیستم", track: "بخش خالی نوار و حلقه", scrim: "پرده‌ی پشت برگه", "disabled-bg": "زمینه‌ی غیرفعال", "disabled-text": "متن غیرفعال", "chain-yes": "روز «بله»", "chain-freeze": "روز فریز", "chain-no": "روز «خیر»", "chain-off": "روز بدون برنامه", "xp-fill": "نوار XP", highlight: "نور بالای دکمه‌ی اصلی", shadow: "سایه‌ی سخت" };
const GROUPS_ROLES = [["سطح‌ها", ["bg", "surface", "surface-tint", "surface-sunken", "surface-pressed", "scrim"]], ["متن و خط", ["text", "text-muted", "outline", "border", "focus", "shadow", "highlight"]], ["کار و جواب", ["primary", "on-primary", "primary-pressed", "yes", "yes-text", "no-text", "no-border", "disabled-bg", "disabled-text"]], ["زنجیره و پاداش", ["chain-yes", "chain-freeze", "chain-no", "chain-off", "track", "medal", "medal-text", "on-medal", "xp-fill"]], ["سیستم", ["error"]]];
function foundationPage(id) {
  const f = FOUND.find((x) => x.id === id);
  const head = (lead) => `<div class="phead">${crumb([["پایه‌ها"], [f.name]])}<h1>${f.name}</h1><p class="lead">${lead}</p></div>`;
  let body = "";
  if (id === "color") {
    const ramp = (pre, keys) => `<div style="display:grid;grid-template-columns:repeat(${keys.length},minmax(0,1fr));border:2px solid var(--dd-border)">${keys.map((k) => { const v = DATA.tokens[pre + k]; return `<div style="background:${v};height:56px" title="${k} ${v}"></div>`; }).join("")}</div><div style="display:grid;grid-template-columns:repeat(${keys.length},minmax(0,1fr));font-size:11px;color:var(--dd-text-muted);text-align:center;direction:ltr">${keys.map((k) => `<span>${k}</span>`).join("")}</div>`;
    body = head("ویجت‌ها فقط نقش‌ها رو می‌شناسن، نه کد رنگ رو. هر نقش در تم روشن و تیره مقدار جدا داره.") +
      sec("brand", "رنگ‌های برند", `<div class="stats">${[["ink", "شب"], ["leaf", "برگ"], ["sprout", "جوانه"], ["forest", "جنگل"]].map(([k, l]) => `<div class="stat-c" style="padding:0;gap:0"><div style="height:72px;background:${DATA.tokens["color.brand." + k]}"></div><div style="padding:10px 12px;display:grid;gap:2px"><b>${l}</b><span class="sw">${DATA.tokens["color.brand." + k]}</span></div></div>`).join("")}<div class="stat-c" style="padding:0;gap:0"><div style="height:72px;background:${DATA.tokens["color.semantic.medal"]}"></div><div style="padding:10px 12px;display:grid;gap:2px"><b>طلا</b><span class="sw">${DATA.tokens["color.semantic.medal"]}</span></div></div></div>`) +
      sec("ramps", "طیف‌ها", `<div style="display:grid;gap:6px"><b style="font-size:14px">سبز</b>${ramp("color.green.", ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"])}<b style="font-size:14px;margin-top:10px">خنثی</b>${ramp("color.neutral.", ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"])}</div>`) +
      GROUPS_ROLES.map(([g, keys], i) => sec("roles" + i, `نقش‌ها: ${g}`, `<div class="tw"><table class="t"><thead><tr><th>نقش</th><th>کاربرد</th><th>روشن</th><th>تیره</th></tr></thead><tbody>${keys.map((k) => `<tr><td><code>${k}</code></td><td>${ROLE_USE[k]}</td><td><span class="sw"><i style="background:${DATA.tokens["theme.light." + k]}"></i>${DATA.tokens["theme.light." + k]}</span></td><td><span class="sw"><i style="background:${DATA.tokens["theme.dark." + k]}"></i>${DATA.tokens["theme.dark." + k]}</span></td></tr>`).join("")}</tbody></table></div>`)).join("") +
      sec("rules", "قاعده‌ها", `<ul class="plain"><li><b>«خیر» هیچ‌وقت قرمز نیست.</b> <code>error</code> فقط برای خطای سیستم.</li><li>برگ روی سفید فقط ۲ کنتراست داره؛ متن سبز همیشه <code>yes-text</code>.</li><li>خط دور در تم تیره سبز ۶۰۰ه (کنتراست ۴٫۰۵) تا کارت‌ها از زمینه جدا بشن؛ منتظر تأیید طراح.</li><li>شفافیت فقط در <code>scrim</code>؛ غیرفعال با رنگ جدا.</li></ul>`);
  } else if (id === "typography") {
    const T = [["display", "۲۱ روز پشت سر هم", "عنوان لحظه‌ی جشن"], ["question", "امروز ۲۰ دقیقه پیاده‌روی کردی؟", "متن سؤال روی کارت"], ["title-1", "سؤال‌های من", "عنوان صفحه"], ["title-2", "خلاصه‌ی این هفته", "عنوان کارت و برگه"], ["answer", "بله", "دکمه‌های جواب"], ["button", "ساختن سؤال", "دکمه‌ها"], ["body", "هر «بله» یک پیکسل به تصویر بزرگت اضافه می‌کنه.", "متن اصلی"], ["small", "آخرین همگام‌سازی: ۱۰ دقیقه پیش", "توضیح و متن فرعی"], ["label", "سطح ۵", "برچسب و چیپ"]];
    body = head("فونت Estedad (D-017)، داخل اپ بسته‌بندی می‌شه. همه‌ی سبک‌ها ارقام هم‌عرض دارن و با اندازه‌ی متن سیستم بزرگ می‌شن.") +
      sec("scale", "مقیاس", `<div class="tw"><table class="t"><thead><tr><th>توکن</th><th>نمونه</th><th>اندازه / خط · وزن</th></tr></thead><tbody>${T.map(([k, t, u]) => { const v = DATA.tokens["type." + k]; return `<tr><td><code>type.${k}</code><br><span class="muted" style="font-size:12px">${u}</span></td><td><span style="font-size:${v.fontSize};line-height:${v.lineHeight};font-weight:${v.fontWeight}">${t}</span></td><td class="muted"><code>${v.fontSize} / ${v.lineHeight} · ${v.fontWeight}</code></td></tr>`; }).join("")}</tbody></table></div>`) +
      sec("rules", "قاعده‌ها", `<ul class="plain"><li>اعداد داخل متن فارسی‌ان؛ عدد قهرمان با رقم پیکسلی.</li><li>ارتفاع خط فارسی ۱٫۶ تا ۱٫۷ برابر اندازه.</li><li>متن بلند به خط بعد می‌ره و بریده نمی‌شه.</li></ul>`);
  } else if (id === "numerals") {
    body = head("رقم‌های فارسی پیکسلی برای عددهای قهرمان. شبکه‌ی نوشتار لوگو: ۷ ردیف، خط عمودی دو واحد، خط افقی یک واحد.") +
      sec("try", "امتحان کن", `<div class="pg" style="grid-template-columns:minmax(0,1fr) 16rem"><div class="stage" id="num-out" style="min-height:10rem"></div><div class="ctrls"><div class="ctrl"><label for="num-in">عدد</label><input type="text" id="num-in" value="۳۶۵" inputmode="numeric"></div><div class="ctrl"><span class="lab">واحد</span><div class="seg sm" role="radiogroup" id="num-unit">${[3, 4, 6, 8].map((u) => `<button class="px" type="button" role="radio" aria-checked="${u === 6}" data-u="${u}">${fa(u)}dp</button>`).join("")}</div></div></div></div>`) +
      sec("glyphs", "همه‌ی رقم‌ها", `<div class="grid-v">${Object.keys(DATA.numerals.glyphs).map((g) => `<div class="cellv"><div class="show" style="min-height:6rem">${pxnum(g, 6)}</div><div class="cap"><b>${g}</b><span>عرض ${fa(DATA.numerals.glyphs[g].width)} واحد</span></div></div>`).join("")}</div>`) +
      sec("sizes", "اندازه‌ها", `<div class="tw"><table class="t"><thead><tr><th>توکن</th><th>واحد</th><th>نمونه</th><th>کاربرد</th></tr></thead><tbody>${[["sm", 3, "کاشی آمار، مدال"], ["md", 4, "حلقه، کارت سؤال"], ["lg", 6, "بخش پیشرفت، کارنامه"], ["xl", 8, "لحظه‌ی جشن"]].map(([k, u, d]) => `<tr><td><code>size.numeral-unit.${k}</code></td><td>${fa(u)}dp</td><td>${pxnum(21, u)}</td><td class="muted">${d}</td></tr>`).join("")}</tbody></table></div>`) +
      sec("rules", "قاعده‌ها", `<ul class="plain"><li>ارقام همیشه چپ‌به‌راست، حتی داخل متن فارسی.</li><li>فقط ضریب صحیح، بدون نرم کردن لبه‌ها.</li><li>برای صفحه‌خوان عدد به‌صورت متن.</li><li>شکل ۴ و ۶ منتظر نظر طراحه.</li></ul>`);
  } else if (id === "spacing") {
    const sp = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
    body = head("واحد پیکسل ۴dp؛ همه‌ی فاصله‌ها و اندازه‌ها مضرب ۴ان.") +
      sec("scale", "مقیاس فاصله", `<div class="tw"><table class="t"><thead><tr><th>توکن</th><th>مقدار</th><th></th></tr></thead><tbody>${sp.map((k) => `<tr><td><code>space.${k}</code></td><td>${fa(parseInt(DATA.tokens["space." + k]))}dp</td><td><i style="display:block;height:12px;width:${DATA.tokens["space." + k]};background:var(--dd-primary)"></i></td></tr>`).join("")}</tbody></table></div>`) +
      sec("layout", "چیدمان صفحه", `<div class="grid-v wide"><div class="cellv"><div class="show"><div style="width:180px;height:220px;border:2px solid var(--dd-outline);background:var(--dd-bg);position:relative"><div style="position:absolute;inset:16px 16px;border:2px dashed var(--dd-primary);display:grid;place-items:center;font-size:12px;color:var(--dd-text-muted)">محتوا</div></div></div><div class="cap"><b>حاشیه‌ی کناری ۱۶</b><span>یک ستون؛ در تبلت حداکثر ۴۸۰ و وسط‌چین</span></div></div><div class="cellv"><div class="show"><div style="display:grid;gap:24px;width:180px"><i style="height:40px;background:var(--dd-surface-sunken);display:block"></i><i style="height:40px;background:var(--dd-surface-sunken);display:block"></i></div></div><div class="cap"><b>فاصله‌ی بخش‌ها ۲۴</b><span>داخل کارت ۱۲ تا ۱۶</span></div></div></div>`) +
      sec("sizes", "اندازه‌های ثابت", `<div class="tw"><table class="t"><tbody>${["size.touch-min", "size.icon.md", "size.icon.lg", "size.icon.xl", "size.character.sm", "size.character.md", "size.character.lg", "size.content-max", "component.button.height", "component.answer.height", "component.field.height", "component.tab-bar.height", "component.fab.size"].map(tokenRow).join("")}</tbody></table></div>`);
  } else if (id === "shape") {
    body = head("گردی صفره. اجزای پیکسلی گوشه‌ی پله‌ای، خط دور و سایه‌ی سخت دارن؛ اجزای ساده گوشه‌ی صاف و لبه‌ی خنثی.") +
      sec("shapes", "شکل‌ها", `<div class="grid-v">${[["پله‌ای ۴", "کارت، دکمه، برگه", `<div class="lift"><div class="px card" style="width:9rem;height:4rem"></div></div>`], ["پله‌ای ۲", "چیپ، برچسب، خونه", `<span class="px-lift-low"><span class="px px-sm chip">چیپ</span></span>`], ["صاف", "فیلد، فهرست", `<div style="width:9rem;height:4rem;background:var(--dd-surface);border:2px solid var(--dd-border)"></div>`]].map(([b, s, h]) => `<div class="cellv"><div class="show">${h}</div><div class="cap"><b>${b}</b><span>${s}</span></div></div>`).join("")}</div>`) +
      sec("elev", "سایه و فشردن", `<div class="grid-v">${[["عادی", "سایه‌ی ۴ رو به پایین", R.button({ variant: "secondary", label: "عادی" })], ["کم", "سایه‌ی ۲ برای چیپ", `<span class="px-lift-low"><span class="px px-sm chip">چیپ</span></span>`], ["فشرده", "۴ پایین، سایه ۰", R.button({ variant: "secondary", label: "فشرده", state: "pressed" })]].map(([b, s, h]) => `<div class="cellv"><div class="show">${h}</div><div class="cap"><b>${b}</b><span>${s}</span></div></div>`).join("")}</div>`, "سایه همیشه رو به پایینه و با جهت متن عوض نمی‌شه. برگه‌ی پایینی سایه نداره.") +
      sec("tokens", "توکن‌ها", `<div class="tw"><table class="t"><tbody>${["shape.notch", "shape.notch-sm", "shape.outline", "shape.border", "shape.divider", "elevation.rest", "elevation.low", "elevation.pressed"].map(tokenRow).join("")}</tbody></table></div>`);
  } else if (id === "motion") {
    const D = [["fast", "فشردن، سوییچ"], ["base", "تغییر حالت، چیپ"], ["slow", "برگه، ورود کارت"], ["check", "ساخته شدن تیک بعد از «بله»"], ["celebrate", "لحظه‌ی سطح و مدال"]];
    body = head("حرکت پله‌ای (steps) به‌جای حرکت نرم، تا حس پیکسلی بمونه. با «کاهش حرکت» سیستم همه‌چیز فوری می‌شه.") +
      sec("dur", "مدت‌ها", `<div class="tw"><table class="t"><thead><tr><th>توکن</th><th>مدت</th><th>کاربرد</th><th>نمونه</th></tr></thead><tbody>${D.map(([k, u]) => `<tr><td><code>motion.duration.${k}</code></td><td>${fa(parseInt(DATA.tokens["motion.duration." + k]))}ms</td><td class="muted">${u}</td><td><button class="px d-btn secondary sm" type="button" data-motion="${k}" style="min-height:32px">پخش</button><span class="mv" data-mv="${k}" style="display:inline-block;width:12px;height:12px;background:var(--dd-primary);margin-inline-start:12px;outline:2px solid var(--dd-outline)"></span></td></tr>`).join("")}</tbody></table></div>`, "روی «پخش» بزن؛ مربع با پله‌های ۴dp جابه‌جا می‌شه.") +
      sec("sprite", "کرکتر", `<div class="grid-v">${[["ایستاده", "idle"], ["جشن", "celebrate"], ["همراهی", "accompany"], ["خواب‌آلود", "sleepy"]].map(([l, m]) => `<div class="cellv"><div class="show">${spriteHTML("b-05", 5, m)}</div><div class="cap"><b>${l}</b><span>۶ فریم در ثانیه، پله‌ای</span></div></div>`).join("")}</div>`) +
      sec("rules", "قاعده‌ها", `<ul class="plain"><li>هر حرکت یک معنی داره: فشردن، ثبت شدن، جشن.</li><li>هیچ چیزی بیشتر از ۳ بار در ثانیه چشمک نمی‌زنه.</li><li>کشیدن برگه با انگشت استثناست و دنبال انگشت میاد.</li><li>لرزش: «بله» ضربه‌ی سبک، «خیر» کلیک انتخاب، جشن ضربه‌ی متوسط.</li></ul>`);
  } else if (id === "icons") {
    body = head("Pixelarticons نسخه‌ی ۲٫۴٫۲ (لایسنس MIT) و دو آیکون اختصاصی. شبکه‌ی ۲۴ با گام ۲؛ فقط اندازه‌های ۲۴، ۳۶ و ۴۸. روی هر آیکون بزن تا اسم Flutterش کپی بشه.") +
      sec("all", "همه‌ی آیکون‌ها", `<div class="chips"><label class="search" style="flex:1;min-width:12rem;display:flex;align-items:center;gap:6px;padding-inline:10px;min-height:40px;background:var(--dd-surface);border:2px solid var(--dd-border)">${icon("help", 24)}<span class="sr">جست‌وجوی آیکون</span><input id="icon-q" type="search" placeholder="جست‌وجو: فریز، تقویم، streak…" style="flex:1;border:0;background:transparent;outline:none;color:var(--dd-text)"></label><div class="seg sm" role="radiogroup" id="icon-size">${[24, 36, 48].map((s) => `<button class="px" type="button" role="radio" aria-checked="${s === 24}" data-s="${s}">${fa(s)}</button>`).join("")}</div></div><div class="grid-v" id="icon-grid" style="grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr))"></div>`);
  }
  return `<div class="page">${body}${pager(id)}</div>`;
}
function wireFoundation(id) {
  if (id === "numerals") {
    let unit = 6;
    const draw = () => { const v = $("#num-in").value.replace(/[^\d۰-۹%٪]/g, "").slice(0, 6) || "0"; $("#num-out").innerHTML = pxnum(v.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace("٪", "%"), unit); };
    $("#num-in").addEventListener("input", draw);
    $("#num-unit").addEventListener("click", (e) => { const b = e.target.closest("[data-u]"); if (!b) return; unit = +b.dataset.u; $$("#num-unit button").forEach((x) => x.setAttribute("aria-checked", x === b)); draw(); });
    draw();
  }
  if (id === "icons") {
    let size = 24;
    const draw = () => {
      const q = ($("#icon-q").value || "").trim().toLowerCase();
      const items = Object.entries(DATA.iconMeta).filter(([n, m]) => !q || n.includes(q) || m.use.includes(q));
      $("#icon-grid").innerHTML = items.map(([n, m]) => `<button class="cellv" type="button" data-copy data-copy-text="${di(n)}" style="border:0;cursor:pointer;text-align:start;padding:0"><span class="show" style="min-height:6rem">${icon(n, size)}</span><span class="cap"><b style="direction:ltr;text-align:end;font-family:var(--mono);font-weight:400;font-size:12px">${n}</b><span>${m.use}</span></span></button>`).join("") || `<p class="note" style="padding:16px;background:var(--dd-bg)">آیکونی پیدا نشد.</p>`;
    };
    $("#icon-q").addEventListener("input", draw);
    $("#icon-size").addEventListener("click", (e) => { const b = e.target.closest("[data-s]"); if (!b) return; size = +b.dataset.s; $$("#icon-size button").forEach((x) => x.setAttribute("aria-checked", x === b)); draw(); });
    draw();
  }
  if (id === "motion") {
    $$("[data-motion]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.motion, el = $(`[data-mv="${k}"]`), ms = parseInt(DATA.tokens["motion.duration." + k]);
      const steps = k === "fast" || k === "base" ? 2 : 4;
      el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-48px)" }], { duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms, easing: `steps(${steps})`, fill: "forwards" }).finished.then(() => setTimeout(() => el.animate([{ transform: "translateX(0)" }], { duration: 0, fill: "forwards" }), 500));
    }));
  }
}

/* ---------- playground ---------- */
const PLAY = { id: "question-card", key: "pg-main" };
function controlHTML(p, val) {
  const id = `c-${p.k}`;
  if (p.t === "sel" || p.t === "icon") {
    const opts = p.t === "icon" ? (p.noNone ? ICON_OPTS().slice(1) : ICON_OPTS()) : p.o;
    return `<div class="ctrl"><label for="${id}">${p.l}</label><select id="${id}" data-k="${p.k}">${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? "selected" : ""}>${l}</option>`).join("")}</select></div>`;
  }
  if (p.t === "bool") return `<div class="ctrl"><div class="row2"><span class="lab" id="${id}-l">${p.l}</span><button class="sw-t" type="button" role="switch" aria-checked="${!!val}" aria-labelledby="${id}-l" data-k="${p.k}" data-bool></button></div></div>`;
  if (p.t === "num") return `<div class="ctrl"><div class="row2"><label for="${id}">${p.l}</label><span class="rv" data-rv="${p.k}">${fa(val)}</span></div><input type="range" id="${id}" data-k="${p.k}" min="${p.min}" max="${p.max}" step="${p.step || 1}" value="${val}"></div>`;
  return `<div class="ctrl"><label for="${id}">${p.l}</label><input type="text" id="${id}" data-k="${p.k}" value="${esc(val)}"></div>`;
}
function playgroundPage() {
  const opts = ["atom", "molecule", "organism"].map((l) => `<optgroup label="${LV[l]}">${REG.filter((e) => e.lvl === l && e.props?.length).map((e) => `<option value="${e.id}" ${e.id === PLAY.id ? "selected" : ""}>${e.name}</option>`).join("")}</optgroup>`).join("");
  return `<div class="page"><div class="phead">${crumb([["Playground"], ["کامپوننت‌ها با کنترل"]])}<h1>Playground کامپوننت‌ها</h1><p class="lead">یک کامپوننت انتخاب کن و با کنترل‌ها گونه، حالت، متن و آیکونش رو عوض کن. پیش‌نمایش در تم روشن، تیره یا کنار هم، و کد Flutter همون تنظیم پایینش.</p></div>
    <div class="pg"><div class="pv" id="pg-pv"></div><aside class="ctrls" aria-label="کنترل‌ها"><div class="ctrl ctrl-big"><label for="pg-comp">کامپوننت</label><select id="pg-comp">${opts}</select></div><hr><div id="pg-ctrls" style="display:grid;gap:var(--dd-space-4)"></div><hr><div class="btn-row"><button class="px d-btn secondary sm" type="button" id="pg-reset">برگشت به پیش‌فرض</button><a class="chip-i" id="pg-doc" href="#${PLAY.id}">صفحه‌ی مستندات</a></div></aside></div></div>`;
}
function mountPlayground() {
  const e = BY_ID[PLAY.id];
  const prev = PV.get(PLAY.key);
  const mode = prev ? prev.mode : "both";
  $("#pg-pv").innerHTML = stageHTML(e, PLAY.props || {}, { key: PLAY.key, mode }).replace('class="stage-wrap"', 'class="stage-wrap" style="border:0"') + `<div id="pg-code"></div>`;
  const pv = PV.get(PLAY.key);
  pv.onChange = (p) => { $("#pg-code").innerHTML = codeBlock(e.code(p.props)); PLAY.props = p.props; };
  $("#pg-ctrls").innerHTML = e.props.map((p) => controlHTML(p, pv.props[p.k])).join("");
  $("#pg-doc").setAttribute("href", "#" + e.id);
  renderStages(PLAY.key);
}
function syncControls(key) {
  if (key !== PLAY.key || !$("#pg-ctrls")) return;
  const pv = PV.get(key);
  $$("#pg-ctrls [data-k]").forEach((el) => {
    const v = pv.props[el.dataset.k];
    if (el.dataset.bool !== undefined) el.setAttribute("aria-checked", !!v);
    else if (el.type === "range") { el.value = v; $(`[data-rv="${el.dataset.k}"]`).textContent = fa(v); }
    else if (document.activeElement !== el) el.value = v;
  });
}
function wirePlayground() {
  $("#pg-comp").addEventListener("change", (ev) => { PLAY.id = ev.target.value; PLAY.props = null; mountPlayground(); });
  $("#pg-reset").addEventListener("click", () => { PLAY.props = null; PV.delete(PLAY.key); mountPlayground(); });
  const update = (el) => {
    const pv = PV.get(PLAY.key), k = el.dataset.k, spec = pv.entry.props.find((p) => p.k === k);
    let v = el.dataset.bool !== undefined ? el.getAttribute("aria-checked") !== "true" : el.value;
    if (spec.t === "num") { v = +v; $(`[data-rv="${k}"]`).textContent = fa(v); }
    if (el.dataset.bool !== undefined) el.setAttribute("aria-checked", v);
    pv.props = { ...pv.props, [k]: v };
    renderStages(PLAY.key);
  };
  $("#pg-ctrls").addEventListener("input", (ev) => { if (ev.target.dataset.k) update(ev.target); });
  $("#pg-ctrls").addEventListener("change", (ev) => { if (ev.target.tagName === "SELECT" && ev.target.dataset.k) update(ev.target); });
  $("#pg-ctrls").addEventListener("click", (ev) => { const b = ev.target.closest("[data-bool]"); if (b) update(b); });
  mountPlayground();
}
document.addEventListener("click", (e) => { const a = e.target.closest("[data-play]"); if (a) { PLAY.id = a.dataset.play; PLAY.props = null; PV.delete(PLAY.key); } });

/* ---------- Today simulator (rules: D-024, D-025, D-034, D-036, D-040, D-052) ---------- */
const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const WD_FULL = WEEKDAYS.map((w) => w[1]);
const NON_YES = ["no", "missed", "fno", "fmissed"];
const levelOf = (xp) => { let L = 1; while (10 * (L + 1) * L <= xp) L++; return L; };
const SIM = { s: null, mood: null, overlay: [], toast: "", theme: "page" };
function simInit() {
  SIM.s = {
    date: { m: 7, d: 18 }, wd: 0, freezes: 1, xp: 170, score: 184,
    notifOff: true, offline: false, hideCompanions: false,
    qs: [
      { id: "walk", text: "امروز ۲۰ دقیقه پیاده‌روی کردی؟", cat: "ورزش · پیاده‌روی", act: "پیاده‌روی کردن", habit: "پیاده‌روی", why: "می‌خوام سرحال‌تر باشم", companions: 124, streak: 6, best: 12, medals: [7], broken: false, today: null, slipHidden: false,
        hist: [..."yxyymyy".split(""), ..."yyyyyyyy".split(""), "fm", "y", "y", "y", "y", "n", "m", "n", ..."yyyyyy".split("")].map((c) => ({ y: "yes", n: "no", m: "missed", x: "no", fm: "fmissed" })[c] || c) },
      { id: "read", text: "امروز ۱۰ صفحه کتاب خوندی؟", cat: "یادگیری · مطالعه", act: "کتاب خوندن", habit: "کتاب خوندن", why: "", companions: 87, streak: 20, best: 20, medals: [7], broken: false, today: null, slipHidden: false,
        hist: [..."yynyymyn".split(""), ..."yyyyyyyyyy".split(""), "fno", ..."yyyyyyyyyy".split("")].map((c) => ({ y: "yes", n: "no", m: "missed" })[c] || c) },
    ],
    log: [],
  };
  SIM.mood = null; SIM.overlay = []; SIM.toast = "";
  simLog("شروع: شنبه ۱۸ مهر. ۱ فریز برای این ماه مونده.", "");
}
const dateLabel = (s = SIM.s) => `${WD_FULL[s.wd]} ${fa(s.date.d)} ${MONTHS[s.date.m - 1]}`;
function simLog(msg, kind = "") { SIM.s.log.unshift({ t: `${fa(SIM.s.date.d)} ${MONTHS[SIM.s.date.m - 1]}`, msg, kind }); }
const nextMedal = (q) => MEDALS.find((m) => m > showStreak(q) && !q.medals.includes(m));
const showStreak = (q) => q.streak + (q.today === "yes" ? 1 : 0);
const pendingMedal = (q) => q.today === "yes" && MEDALS.includes(q.streak + 1) && !q.medals.includes(q.streak + 1) ? q.streak + 1 : 0;
const simXp = () => SIM.s.xp + SIM.s.qs.reduce((a, q) => a + (q.today === "yes" ? 10 : q.today === "no" ? 4 : 0) + (pendingMedal(q) ? 50 : 0), 0);
const slipping = (q) => q.today !== "yes" && q.hist.slice(-3).length === 3 && q.hist.slice(-3).every((h) => NON_YES.includes(h));
function adherence() {
  let yes = 0, all = 0;
  SIM.s.qs.forEach((q) => { const h = q.hist.slice(-29); all += h.length + 1; yes += h.filter((x) => x === "yes").length + (q.today === "yes" ? 1 : 0); });
  return { yes, all, pct: Math.round((yes / all) * 100) };
}
function simAnswer(id, a) {
  const q = SIM.s.qs.find((x) => x.id === id);
  const before = levelOf(simXp());
  q.today = a;
  const after = levelOf(simXp());
  if (a === "yes") {
    SIM.mood = "celebrate"; setTimeout(() => { SIM.mood = null; drawSim(); }, 1900);
    simLog(`«بله» برای ${q.act}: ‎+۱۰ XP. زنجیره ${fa(showStreak(q))} روزه شد.`, "good");
    SIM.toast = `+۱۰ XP · زنجیره‌ی ${fa(showStreak(q))} روزه`;
    const m = pendingMedal(q);
    if (m) { SIM.overlay.push({ kind: "medal", value: m }); simLog(`مدال ${fa(m)} روز برای ${q.act}: ‎+۵۰ XP.`, "gold"); }
  } else {
    SIM.mood = "accompany"; setTimeout(() => { SIM.mood = null; drawSim(); }, 1900);
    simLog(`«خیر» برای ${q.act}: ‎+۴ XP. ${SIM.s.freezes ? "نیمه‌شب یکی از فریزها زنجیره رو نگه می‌داره." : "فریزی نمونده؛ نیمه‌شب زنجیره صفر می‌شه."}`, "");
    SIM.toast = "+۴ XP · صداقتت حساب شد";
    SIM.overlay.push({ kind: "no", q: q.id });
  }
  if (after > before) { SIM.overlay.push({ kind: "level", value: after }); simLog(`سطح ${fa(after)}! یک کرکتر یا وسیله‌ی تازه باز شد.`, "gold"); }
  setTimeout(() => { SIM.toast = ""; drawSim(); }, 2200);
  live(a === "yes" ? `بله ثبت شد. زنجیره‌ی ${fa(showStreak(q))} روزه` : "خیر ثبت شد");
  drawSim();
}
function simUndo(id) {
  const q = SIM.s.qs.find((x) => x.id === id);
  simLog(`جواب ${q.act} عوض شد؛ امتیاز و XP امروز دوباره حساب می‌شه (D-025).`, "");
  q.today = null; drawSim();
}
function simEndDay(auto = null) {
  const s = SIM.s;
  if (auto) s.qs.forEach((q) => { if (!q.today) q.today = auto; });
  s.xp = simXp();
  const needs = s.qs.some((q) => q.today !== "yes");
  const useFreeze = needs && s.freezes > 0;
  if (useFreeze) { s.freezes--; simLog(`نیمه‌شب: یک فریز کل روز رو پوشش داد (D-024). ${fa(s.freezes)} فریز مونده.`, "good"); }
  s.qs.forEach((q) => {
    const a = q.today || "missed";
    if (a === "yes") {
      q.streak++; q.best = Math.max(q.best, q.streak);
      const pts = 5 + (q.streak >= 30 ? 2 : q.streak >= 7 ? 1 : 0) + (q.broken ? 3 : 0);
      s.score += pts; q.broken = false;
      if (MEDALS.includes(q.streak) && !q.medals.includes(q.streak)) q.medals.push(q.streak);
      q.hist.push("yes");
    } else if (useFreeze) {
      q.hist.push(a === "no" ? "fno" : "fmissed");
    } else {
      const pts = a === "no" ? 2 : 5;
      s.score = Math.max(0, s.score - pts);
      if (q.streak > 0) { simLog(`زنجیره‌ی ${q.act} (${fa(q.streak)} روز) صفر شد. بهترین زنجیره (${fa(q.best)}) سر جاشه.`, ""); q.broken = true; }
      q.streak = 0; q.hist.push(a);
      if (a === "missed") simLog(`${q.act}: بی‌پاسخ موند (‎−۵ امتیاز).`, "");
    }
    if (q.hist.length > 60) q.hist.shift();
    q.today = null; q.slipHidden = false;
  });
  s.wd = (s.wd + 1) % 7;
  const len = s.date.m <= 6 ? 31 : s.date.m <= 11 ? 30 : 29;
  s.date.d++;
  if (s.date.d > len) { s.date.d = 1; s.date.m = s.date.m % 12 + 1; s.freezes = 2; simLog(`ماه تازه (${MONTHS[s.date.m - 1]}): فریزها به ۲ تمدید شدن (D-034).`, "good"); }
  s.qs.forEach((q) => { if (slipping(q)) simLog(`${q.act} وارد «در حال لغزش» شد (۳ روز پیاپی بدون «بله»).`, ""); });
  SIM.overlay = []; SIM.mood = null;
  simLog(`صبح ${dateLabel()}.`, "");
}
function simCard(q) {
  const cells = q.hist.slice(-6).map((h) => (h.startsWith("f") ? "freeze" : h)).concat(q.today === "yes" ? "yes" : q.today === "no" ? (SIM.s.freezes ? "freeze" : "no") : "today");
  const st = showStreak(q), sl = slipping(q);
  let foot;
  if (q.today) foot = `<div class="qc w100"><div class="done ${q.today === "yes" ? "" : "neutral"}"><span>${q.today === "yes" ? icon("yes") + "انجام شد" : "ثبت شد"}</span><span class="bw"><button class="px d-btn text" type="button" data-sim="undo" data-q="${q.id}">عوضش کن</button></span></div></div>${q.today === "no" ? `<p class="note-l">${SIM.s.freezes ? `<span class="ic">${icon("freeze")}</span>یکی از فریزهات زنجیره‌ت رو نگه می‌داره` : `بهترین زنجیره‌ت ${fa(q.best)} روزه و سر جاشه`}</p>` : ""}`;
  else foot = `<div class="pair">${bw(`<button class="px ans" type="button" data-sim="yes" data-q="${q.id}">${icon("yes")}بله</button>`)}${bw(`<button class="px ans no" type="button" data-sim="no" data-q="${q.id}">خیر</button>`)}</div>`;
  return `<div class="lift w100"><article class="px card qc" aria-label="${esc(q.text)}"><div class="top"><span class="tag">${q.cat}</span>${!q.today && SIM.s.freezes ? `<span class="tag brand">${icon("freeze", 24)}فریز داری</span>` : ""}${sl ? spriteHTML("b-16", 2, "sleepy") : ""}</div>
    <p class="q">${q.text}</p><div class="top"><div class="cells" role="img" aria-label="۷ روز اخیر">${cells.map((c) => `<span class="cell ${c}"></span>`).join("")}</div>
    <span class="streak">${st ? `<span class="ic">${icon("streak")}</span>${pxnum(st, 3, `زنجیره‌ی ${fa(st)} روزه`)}` : `<span class="note-l">از امروز دوباره</span>`}</span></div>${foot}</article></div>`;
}
function simPhone() {
  const s = SIM.s, xp = simXp(), L = levelOf(xp), base = 10 * L * (L - 1), need = 10 * (L + 1) * L;
  const ad = adherence();
  const order = [...s.qs].sort((a, b) => (a.today ? 1 : 0) - (b.today ? 1 : 0));
  const best = Math.max(...s.qs.map(showStreak));
  const goals = s.qs.map((q) => ({ q, m: nextMedal(q) })).filter((g) => g.m).sort((a, b) => (a.m - showStreak(a.q)) - (b.m - showStreak(b.q)));
  const anySlip = s.qs.some(slipping);
  const mood = SIM.mood || (anySlip ? "sleepy" : "idle");
  const allDone = s.qs.every((q) => q.today);
  let body = "";
  if (s.notifOff) body += `<div class="lift w100"><div class="px alert" role="alert"><span class="ic">${icon("warning")}</span><p>اجازه‌ی نوتیفیکیشن خاموشه؛ یادآوری‌ها نمی‌رسن.</p><div class="acts"><span class="bw lift"><button class="px d-btn secondary sm" type="button" data-sim="fixnotif">درستش کن</button></span></div></div></div>`;
  if (s.offline) body += R.alertCard({ kind: "offline" });
  body += `<div class="lift w100"><section class="px card" aria-label="پیشرفت"><div class="hero">${ringHTML(ad.pct, 100, "percent")}<div class="hero-stats">${R.statTile({ icon: "streak", value: best, unit: 3, label: "بهترین زنجیره‌ی فعال" })}${R.statTile({ icon: "chart", value: s.score, unit: 3, label: "امتیاز نظم" })}</div></div>${R.characterPanel({ id: "b-05", name: "فندق", level: L, toNext: need - xp, progress: ((xp - base) / (need - base)) * 100, mood })}</section></div>`;
  if (goals[0]) body += R.nextGoalCard({ streak: showStreak(goals[0].q), target: goals[0].m });
  if (allDone) body += `<div class="note-l" style="justify-content:center;padding:4px 0">${icon("celebrate")}همه‌ی جواب‌های امروز ثبت شد. فردا دوباره می‌پرسیم.</div>`;
  body += order.map(simCard).join("");
  s.qs.filter((q) => slipping(q) && !q.slipHidden).forEach((q) => { body += R.slipCard({ habit: q.habit }).replace(/<button class="px d-btn text"([^>]*)>فعلاً نه/, `<button class="px d-btn text"$1 data-sim="hideslip" data-q="${q.id}">فعلاً نه`); });
  if (!s.hideCompanions) { const q = s.qs[0]; body += R.companionsLine({ count: q.companions + (q.today === "yes" ? 1 : 0), activity: q.act, offline: s.offline }); }
  let overlay = "";
  const o = SIM.overlay[0];
  if (o) {
    if (o.kind === "no") { const q = s.qs.find((x) => x.id === o.q); overlay = R.noSheet({ hasFreeze: s.freezes > 0, freezes: s.freezes, streak: showStreak(q) || q.streak, why: q.why, reason: SIM.reason ?? -1 }); }
    else overlay = R.momentOverlay(o);
    overlay = `<div class="overlay" data-sim-overlay>${overlay}</div>`;
  }
  return `<div class="phone ${SIM.theme === "page" ? "" : "dd-" + SIM.theme}" id="sim-phone">${R.appHeader({ kind: "main", title: dateLabel() })}<div class="scroll"><div class="body">${body}</div></div><div class="fabpos">${R.iconButton({ kind: "fab", icon: "add", label: "ساختن سؤال" })}</div>${R.tabBar({ active: 0 })}${SIM.toast ? `<div class="toast" role="status">${icon("xp")}${SIM.toast}</div>` : ""}${overlay}</div>`;
}
function simPanel() {
  const s = SIM.s, xp = simXp(), L = levelOf(xp);
  return `<div class="panel"><h3>وضعیت</h3><div class="kv">
      <div><span>تاریخ</span><b>${dateLabel()}</b></div>
      <div><span>فریز این ماه</span><b>${s.freezes ? icon("freeze") .repeat(s.freezes) : "۰"}</b></div>
      <div><span>XP و سطح</span><b>${fa(xp)} · سطح ${fa(L)}</b></div>
      <div><span>امتیاز نظم</span><b>${fa(s.score)}</b></div></div></div>
    <div class="panel"><h3>زمان</h3><div class="btn-row">
      <span class="bw lift"><button class="px d-btn primary" type="button" data-sim="end">${icon("forward")}پایان روز، برو به فردا</button></span>
      <span class="bw lift"><button class="px d-btn secondary sm" type="button" data-sim="week">۷ روز با «بله»</button></span>
      <span class="bw lift"><button class="px d-btn secondary sm" type="button" data-sim="skip">یک روز بی‌پاسخ</button></span>
      <span class="bw"><button class="px d-btn text" type="button" data-sim="reset">شروع دوباره</button></span></div>
      <p class="rules">جواب‌های امروز تا «پایان روز» قابل تغییرن. نیمه‌شب فریز، زنجیره، امتیاز و لغزش حساب می‌شن.</p></div>
    <div class="panel"><h3>شرایط</h3><div class="toggles">
      ${[["notifOff", "اجازه‌ی نوتیفیکیشن خاموش"], ["offline", "آفلاین"], ["hideCompanions", "پنهان کردن همراهان"]].map(([k, l]) => `<span class="sw-l"><span id="t-${k}">${l}</span><button class="sw-t" type="button" role="switch" aria-checked="${!!s[k]}" aria-labelledby="t-${k}" data-sim="toggle" data-k="${k}"></button></span>`).join("")}
      <span class="sw-l"><span>تم گوشی</span><span class="seg sm" role="radiogroup" aria-label="تم گوشی">${[["page", "صفحه"], ["light", "روشن"], ["dark", "تیره"]].map(([m, l]) => `<button class="px" type="button" role="radio" aria-checked="${SIM.theme === m}" data-sim="theme" data-k="${m}">${l}</button>`).join("")}</span></span></div></div>
    <div class="panel"><h3>اتفاق‌ها</h3><ol class="log" aria-live="polite">${s.log.slice(0, 40).map((l) => `<li class="${l.kind}"><time>${l.t}</time><span>${l.msg}</span></li>`).join("")}</ol></div>
    <div class="panel"><h3>قاعده‌هایی که اجرا می‌شن</h3><ul class="plain rules"><li>«بله» ‎+۱۰ XP، «خیر» ‎+۴ XP، مدال ‎+۵۰ XP؛ XP کم نمی‌شه (D-036).</li><li>سطح L با ۱۰×L×(L−۱) XP.</li><li>روز بدون «بله» با فریز پوشیده می‌شه، چه «خیر» چه بی‌پاسخ؛ یک فریز برای کل روز (D-024، D-040).</li><li>۲ فریز در ماه شمسی، ذخیره نمی‌شه (D-034).</li><li>امتیاز: «بله» ‎+۵ (+۱ از روز ۷، +۲ از روز ۳۰، +۳ بازگشت)؛ «خیر» بدون فریز ‎−۲؛ بی‌پاسخ ‎−۵؛ هیچ‌وقت زیر صفر.</li><li>۳ روز پیاپی بدون «بله» ← «در حال لغزش»؛ با اولین «بله» تموم می‌شه.</li><li>پایبندی = روزهای «بله» ÷ روزهای زمان‌بندی‌شده؛ فریز اثر نداره.</li></ul></div>`;
}
function simulatorPage() {
  return `<div class="page"><div class="phead">${crumb([["Playground"], ["شبیه‌ساز «امروز»"]])}<h1>شبیه‌ساز صفحه‌ی «امروز»</h1><p class="lead">صفحه‌ی اصلی اپ با قاعده‌های واقعی محصول. جواب بده، «پایان روز» بزن و ببین زنجیره، فریز، XP، سطح، مدال و کرکتر چطور عوض می‌شن. دو سؤال نمونه داره؛ «بله» به کتاب امروز مدال ۲۱ روز و سطح تازه رو باز می‌کنه.</p></div>
    <div class="sim"><div id="sim-phone-wrap"></div><div class="sim-panel" id="sim-panel"></div></div></div>`;
}
function drawSim() {
  if (!$("#sim-phone-wrap")) return;
  const sc = $("#sim-phone .scroll"); const top = sc ? sc.scrollTop : 0;
  $("#sim-phone-wrap").innerHTML = simPhone();
  $("#sim-panel").innerHTML = simPanel();
  hydrate($("#sim-phone-wrap"));
  const ns = $("#sim-phone .scroll"); if (ns) ns.scrollTop = top;
}
document.addEventListener("click", (e) => {
  const ov = e.target.closest("[data-sim-overlay]");
  if (ov && SIM.s) {
    const o = SIM.overlay[0];
    const chip = e.target.closest("[data-act='pick']");
    if (o?.kind === "no" && chip) { SIM.reason = +chip.dataset.val; drawSim(); return; }
    if (e.target.closest("button") || e.target === ov.firstElementChild) {
      if (o?.kind === "no" && SIM.reason != null && SIM.reason >= 0) simLog(`دلیل «خیر»: ${REASONS[SIM.reason]} (فقط برای خود کاربر).`, "");
      SIM.overlay.shift(); SIM.reason = null; drawSim(); return;
    }
  }
  const b = e.target.closest("[data-sim]"); if (!b || !SIM.s) return;
  const k = b.dataset.sim, s = SIM.s;
  if (k === "yes" || k === "no") return simAnswer(b.dataset.q, k);
  if (k === "undo") return simUndo(b.dataset.q);
  if (k === "end") { simEndDay(); }
  else if (k === "week") { for (let i = 0; i < 7; i++) simEndDay("yes"); simLog("۷ روز با «بله» جلو رفت.", "good"); }
  else if (k === "skip") { s.qs.forEach((q) => { q.today = null; }); simEndDay(); }
  else if (k === "reset") simInit();
  else if (k === "toggle") s[b.dataset.k] = !s[b.dataset.k];
  else if (k === "theme") SIM.theme = b.dataset.k;
  else if (k === "fixnotif") { s.notifOff = false; simLog("اجازه‌ی نوتیفیکیشن داده شد.", "good"); }
  else if (k === "hideslip") { const q = s.qs.find((x) => x.id === b.dataset.q); q.slipHidden = true; }
  drawSim();
});

/* ---------- router ---------- */
function route() {
  const id = currentId();
  [...PV.keys()].forEach((k) => { if (k !== PLAY.key) PV.delete(k); });
  let html, after;
  if (id === "intro") html = introPage();
  else if (id === "principles") html = principlesPage();
  else if (FOUND.some((f) => f.id === id)) { html = foundationPage(id); after = () => wireFoundation(id); }
  else if (Object.values(LEVEL_IDS).includes(id)) html = levelPage(Object.keys(LEVEL_IDS).find((k) => LEVEL_IDS[k] === id));
  else if (id === "playground") { html = playgroundPage(); after = wirePlayground; }
  else if (id === "simulator") { html = simulatorPage(); after = () => { if (!SIM.s) simInit(); drawSim(); }; }
  else if (BY_ID[id]) html = componentPage(BY_ID[id]);
  else { html = introPage(); }
  const main = $("#main");
  main.innerHTML = html;
  $$("[data-pv]", main).forEach((w) => { if (w.dataset.pv !== PLAY.key) renderStages(w.dataset.pv); });
  hydrate(main);
  after && after();
  markCurrent();
  const ttl = ORDER.find((o) => o.id === id)?.name || BY_ID[id]?.name;
  document.title = ttl && id !== "intro" ? `${ttl} · دیزاین سیستم دیدیت` : "دیزاین سیستم دیدیت";
  window.scrollTo(0, 0);
  document.body.classList.remove("nav-open");
  $("#menu-btn").setAttribute("aria-expanded", "false");
}
document.addEventListener("click", (e) => {
  const j = e.target.closest("[data-jump]"); if (!j) return;
  e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t) t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
addEventListener("hashchange", route);

/* ---------- theme & shell ---------- */
const THEMES = [["light", "روشن"], ["dark", "تیره"], ["system", "سیستم"]];
let theme = "system";
try { theme = localStorage.getItem("didit-ds-theme") || "system"; } catch (e) {}
function applyTheme() {
  if (theme === "system") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", theme);
  $("#theme-seg").innerHTML = THEMES.map(([k, l]) => `<button class="px" type="button" role="radio" aria-checked="${theme === k}" data-t="${k}">${l}</button>`).join("");
  const label = THEMES.find((t) => t[0] === theme)[1];
  $("#theme-btn").innerHTML = icon(theme === "dark" ? "theme-dark" : theme === "light" ? "theme-light" : "sync", 24);
  $("#theme-btn").setAttribute("aria-label", `تم: ${label}. برای عوض کردن بزن`);
  requestAnimationFrame(() => $$("canvas[data-ring]").forEach(drawRing));
}
$("#theme-btn").addEventListener("click", () => { theme = THEMES[(THEMES.findIndex((t) => t[0] === theme) + 1) % 3][0]; try { localStorage.setItem("didit-ds-theme", theme); } catch (er) {} applyTheme(); });
$("#theme-seg").addEventListener("click", (e) => { const b = e.target.closest("[data-t]"); if (!b) return; theme = b.dataset.t; try { localStorage.setItem("didit-ds-theme", theme); } catch (er) {} applyTheme(); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => $$("canvas[data-ring]").forEach(drawRing));
$("#menu-btn").innerHTML = icon("questions", 24);
$("#menu-btn").addEventListener("click", () => { const open = document.body.classList.toggle("nav-open"); $("#menu-btn").setAttribute("aria-expanded", open); });
$("#scrim").addEventListener("click", () => { document.body.classList.remove("nav-open"); $("#menu-btn").setAttribute("aria-expanded", "false"); });
$("#search-ic").innerHTML = icon("help", 24);
$("#filter").addEventListener("input", (e) => renderNav(e.target.value));
addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("nav-open")) { document.body.classList.remove("nav-open"); $("#menu-btn").focus(); } });

applyTheme();
renderNav();
route();
