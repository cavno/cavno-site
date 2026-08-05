#!/usr/bin/env node
/**
 * 为缺少「目录—大纲」的书籍页注入常驻侧栏大纲
 * ================================================
 * 对齐《债务危机》的形态：左侧 236px 常驻侧栏 + 主体自适应，
 * 两级大纲（h2 章 / h3 节），滚动高亮当前章、自动展开其子目。
 *
 * 做法（不改动原页任何既有结构与样式）：
 *   1. 把 .lp 的全部原有子节点包进 <div class="bk-main">
 *   2. 在其前插入 <nav class="bk-toc">，两者同置于 <div class="bk-shell"> 内
 *   3. 追加一段作用域为 .lp 的 CSS（复用原页调色板变量，带兜底值）
 *   4. 追加滚动监听脚本（IntersectionObserver）
 *   5. 原有页内导航加 .bk-hidewide —— 宽屏交给侧栏，窄屏仍由它承担
 *
 * 用法: node scripts/add-book-outline.mjs [--dry] [书名 …]
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOOKS = path.join(ROOT, 'src/legacy/reading/books');

/* 每本书的侧栏抬头：标题 + 副题（副题为编者拟定的一句定位） */
const BRAND = {
  '中国国家治理的制度逻辑': '一统体制与有效治理',
  '以利为利': '财政关系与地方政府行为',
  '八次危机': '六十年八次危机的代价转移',
  '制内市场': '市场嵌在国家里',
  '置身事内': '地方政府与经济发展',
  '形式法则': '区分 · 再入 · 观察者',
  '复杂': '还原论之后的科学',
};

/* 需要额外纳入大纲的二级锚点（章级 div 而非 section 的页面） */
const EXTRA_LV2 = {
  '置身事内': 'div.chap',
};

/* 这些页的原有 nav 含正文性内容（非纯导航），不隐藏 */
const KEEP_NAV = new Set(['复杂']);

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const only = args.filter((a) => !a.startsWith('--'));

const clean = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* 从 body.html 抽出两级大纲 */
function extract(html, book) {
  const secRe = /<section\b([^>]*\bid="([^"]+)"[^>]*)>/g;
  const marks = [];
  let m;
  while ((m = secRe.exec(html))) marks.push({ id: m[2], at: m.index });
  const out = [];
  for (let i = 0; i < marks.length; i++) {
    const body = html.slice(marks[i].at, i + 1 < marks.length ? marks[i + 1].at : html.length);
    const h2 = body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/);
    const title = h2 ? clean(h2[1]) : '';
    if (!title) continue;                       // 无标题的节不入目录
    const kids = [];
    /* 章级 div（如《置身事内》的 .chap）优先作为二级 */
    if (EXTRA_LV2[book]) {
      const cre = /<div\b[^>]*class="[^"]*\bchap\b[^"]*"[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)(?=<div\b[^>]*class="[^"]*\bchap\b|<\/section>)/g;
      let c;
      while ((c = cre.exec(body))) {
        const h = c[2].match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/) || c[2].match(/<h4\b[^>]*>([\s\S]*?)<\/h4>/);
        kids.push({ id: c[1], title: h ? clean(h[1]) : c[1], own: true });
      }
    }
    if (!kids.length) {
      const h3re = /<h3\b([^>]*)>([\s\S]*?)<\/h3>/g;
      let h3, n = 0;
      while ((h3 = h3re.exec(body))) {
        const t = clean(h3[2]);
        if (!t) continue;
        const idAttr = h3[1].match(/\bid="([^"]+)"/);
        kids.push({ id: idAttr ? idAttr[1] : `${marks[i].id}-h${++n}`, title: t, own: !!idAttr, raw: h3[0] });
      }
    }
    out.push({ id: marks[i].id, title, kids });
  }
  return out;
}

/* 给未带 id 的 h3 补 id（仅补属性，不动内容） */
function stampIds(html, outline) {
  for (const sec of outline) {
    for (const k of sec.kids) {
      if (k.own || !k.raw) continue;
      const withId = k.raw.replace(/<h3\b/, `<h3 id="${k.id}"`);
      const at = html.indexOf(k.raw);
      if (at < 0) continue;
      html = html.slice(0, at) + withId + html.slice(at + k.raw.length);
    }
  }
  return html;
}

function navHtml(book, outline) {
  const sub = BRAND[book] || '';
  let h = '<nav class="bk-toc" aria-label="全书目录">\n';
  h += `  <div class="bk-brand">${esc(book)}</div>\n`;
  if (sub) h += `  <div class="bk-brand-sub">${esc(sub)}</div>\n`;
  h += '  <ol class="bk-list">\n';
  outline.forEach((s, i) => {
    h += `    <li class="bk-item" data-sec="${esc(s.id)}">`;
    h += `<a class="bk-l1" href="#${encodeURIComponent(s.id)}"><i>${String(i + 1).padStart(2, '0')}</i>${esc(s.title)}</a>`;
    if (s.kids.length) {
      h += '<ul class="bk-sub">';
      for (const k of s.kids) h += `<li><a class="bk-l2" href="#${encodeURIComponent(k.id)}">${esc(k.title)}</a></li>`;
      h += '</ul>';
    }
    h += '</li>\n';
  });
  h += '  </ol>\n</nav>';
  return h;
}

const CSS = `

/* ---------- 目录—大纲侧栏（由 scripts/add-book-outline.mjs 注入） ---------- */
.lp .bk-shell{display:flex;align-items:flex-start;gap:0;max-width:1280px;margin:0 auto}
.lp .bk-main{flex:1;min-width:0}
.lp .bk-toc{width:246px;flex:0 0 246px;position:sticky;top:0;align-self:flex-start;
  height:100vh;overflow-y:auto;padding:34px 14px 48px 22px;
  border-right:1px solid var(--rule,var(--line,var(--line-soft,rgba(28,25,22,.14))));
  scrollbar-width:thin}
.lp .bk-toc::-webkit-scrollbar{width:5px}
.lp .bk-toc::-webkit-scrollbar-thumb{background:rgba(28,25,22,.16);border-radius:3px}
.lp .bk-brand{font-size:15.5px;font-weight:700;letter-spacing:.06em;line-height:1.5;color:var(--ink,#1c1916)}
.lp .bk-brand-sub{margin-top:4px;font-size:11.5px;letter-spacing:.05em;
  color:var(--terra,#a73e2c);margin-bottom:16px}
.lp ol.bk-list{list-style:none;margin:0;padding:0}
.lp .bk-item{margin:0}
.lp .bk-toc a{display:block;text-decoration:none;border:none}
.lp a.bk-l1{display:flex;gap:9px;align-items:baseline;font-size:13px;line-height:1.55;
  padding:6px 9px;border-left:2px solid transparent;color:var(--ink-soft,var(--ink-2,#6b6a64));transition:.15s}
.lp a.bk-l1 i{font-style:normal;font-size:10px;opacity:.55;flex:0 0 auto;letter-spacing:.04em}
.lp a.bk-l1:hover{color:var(--ink,#1c1916)}
.lp .bk-item.on>a.bk-l1{color:var(--teal-deep,var(--teal,#1f6f6b));font-weight:700;
  border-left-color:var(--terra,#a73e2c);background:var(--teal-ghost,rgba(31,111,107,.07))}
.lp ul.bk-sub{list-style:none;margin:0;padding:0 0 4px 0;display:none}
.lp .bk-item.on ul.bk-sub{display:block}
.lp a.bk-l2{font-size:12px;line-height:1.5;padding:4px 9px 4px 30px;
  color:var(--ink-soft,var(--ink-2,#6b6a64));opacity:.82}
.lp a.bk-l2:hover{opacity:1;color:var(--ink,#1c1916)}
.lp a.bk-l2.on{color:var(--terra,#a73e2c);opacity:1}
@media (max-width:1080px){
  .lp .bk-shell{display:block}
  .lp .bk-toc{display:none}
}
@media (min-width:1081px){
  .lp .bk-hidewide{display:none}
}
`;

const JS = `
<script>
(function () {
  var toc = document.querySelector('.bk-toc');
  if (!toc || !('IntersectionObserver' in window)) return;
  var items = Array.prototype.slice.call(toc.querySelectorAll('.bk-item'));
  var byId = {};
  items.forEach(function (li) { byId[li.getAttribute('data-sec')] = li; });
  var subs = Array.prototype.slice.call(toc.querySelectorAll('a.bk-l2'));
  function setActive(id) {
    items.forEach(function (li) { li.classList.toggle('on', li.getAttribute('data-sec') === id); });
    var cur = byId[id];
    if (cur) {
      var r = cur.getBoundingClientRect(), t = toc.getBoundingClientRect();
      if (r.top < t.top + 8 || r.bottom > t.bottom - 8) {
        toc.scrollTop += r.top - t.top - t.height / 3;
      }
    }
  }
  /* 章级：取最靠近视口上沿的可见节 */
  var visible = {};
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var id = e.target.getAttribute('id');
      if (e.isIntersecting) visible[id] = e.boundingClientRect.top;
      else delete visible[id];
    });
    var ks = Object.keys(visible);
    if (!ks.length) return;
    ks.sort(function (a, b) { return Math.abs(visible[a]) - Math.abs(visible[b]); });
    setActive(ks[0]);
  }, { rootMargin: '-12% 0px -70% 0px', threshold: 0 });
  items.forEach(function (li) {
    var el = document.getElementById(li.getAttribute('data-sec'));
    if (el) io.observe(el);
  });
  /* 节级高亮 */
  var io2 = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var a = toc.querySelector('a.bk-l2[href="#' + encodeURIComponent(e.target.id) + '"]');
      if (!a) return;
      if (e.isIntersecting) { subs.forEach(function (x) { x.classList.remove('on'); }); a.classList.add('on'); }
    });
  }, { rootMargin: '-14% 0px -74% 0px', threshold: 0 });
  subs.forEach(function (a) {
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var el = document.getElementById(id);
    if (el) io2.observe(el);
  });
  if (items.length) setActive(items[0].getAttribute('data-sec'));
})();
</script>`;

/* ---------------- 主流程 ---------------- */
const targets = only.length ? only : Object.keys(BRAND);
let done = 0;
for (const book of targets) {
  const dir = path.join(BOOKS, book);
  const bodyPath = path.join(dir, 'body.html');
  const cssPath = path.join(dir, 'style.css');
  let html = await fs.readFile(bodyPath, 'utf-8');
  if (html.includes('class="bk-toc"')) { console.log(`  ↷ 已有大纲，跳过: ${book}`); continue; }

  const outline = extract(html, book);
  if (outline.length < 3) { console.warn(`  ⚠ ${book}: 仅解析出 ${outline.length} 节，跳过（结构不符）`); continue; }
  html = stampIds(html, outline);

  /* 原有页内导航退居窄屏；但《复杂》的 nav.spine 每项带说明文字，属正文内容，保留 */
  if (!KEEP_NAV.has(book)) html = html.replace(/<nav\b(?![^>]*bk-toc)([^>]*)>/, (mm, attrs) =>
    /class="/.test(attrs)
      ? `<nav${attrs.replace(/class="/, 'class="bk-hidewide ')}>`
      : `<nav class="bk-hidewide"${attrs}>`);

  const nav = navHtml(book, outline);
  const wrapped = `<div class="bk-shell">\n${nav}\n<div class="bk-main">\n${html.trim()}\n</div>\n</div>\n${JS}\n`;

  const subCount = outline.reduce((a, s) => a + s.kids.length, 0);
  console.log(`  ✓ ${book}: ${outline.length} 章 / ${subCount} 节`);
  outline.slice(0, 3).forEach((s) => console.log(`      ${s.id} · ${s.title.slice(0, 26)}  (${s.kids.length} 节)`));

  if (!DRY) {
    await fs.writeFile(bodyPath, wrapped, 'utf-8');
    const css = await fs.readFile(cssPath, 'utf-8');
    if (!css.includes('.bk-toc')) await fs.writeFile(cssPath, css.trimEnd() + '\n' + CSS, 'utf-8');
  }
  done++;
}
console.log(`\n${DRY ? '[试运行] ' : ''}完成 ${done} 本。`);
