#!/usr/bin/env node
/**
 * 旧页重构脚本 v2 —— 按"应用目录"为单位，把旧 GitHub Pages 重构为站内原生页面
 *
 * 旧站的真实形态：一个目录 = 一个应用，内容页就是该目录的 index.html。
 * 因此 v2 的转换单位是应用目录（slug 取目录名），而非单个文件。
 *
 * 三种输入：
 *   1) 集合根（--root）      如 Books/：发现其下所有含 index.html 的应用目录逐一转换，
 *                            集合根自身的 index.html（旧 hub）跳过
 *   2) 单个应用目录           如 CreditExpansion/：转换其 index.html，
 *                            目录内其余具名 .html（非草稿）作为附加条目一并转换
 *   3) 单个 .html 文件
 *
 * 每页处理：
 *   - <body> 装进 Base 外壳（面包屑页头，--no-head 可关）
 *   - 全部 <style> → TOKEN_MAP 令牌映射（仅"画布层"：羊皮纸底色族/墨色族/灰阶，
 *     各页强调色是内容语义，保留不动）→ 选择器限定 .lp 作用域
 *   - <head> 内 CDN 脚本/样式自动搬运；页内脚本原样保留
 *   - 相对引用改写：指向其他 .html → 改为转换后的站内路由；
 *     指向本地资产 → 仅拷贝被引用文件到 public/ 并改为绝对地址（不整树搬运）
 *   - 生成目录条目 src/content/items/*.md；输出逐页风险报告与未映射颜色清单
 *
 * 排除：.git / node_modules / 小程序与服务端工程树（wxamp|wxapps|miniprogram|
 * miniapp|weapp|linuxserver|winserver）/ index0.html 等草稿。
 *
 * 用法:
 *   node scripts/convert.mjs <路径> --section=<slug> [--subsection=<slug>] [选项]
 * 选项: --root  --slug=<slug>(单应用/单文件)  --force  --dry  --no-head  --include-root-index
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MAX_FILE = 25 * 1024 * 1024;

/* ============================================================
 * 令牌映射：只统一"画布层"（底色/墨色/灰阶），保留各页强调色
 * 来自四仓库全量扫描的真实高频值；左列可继续补充
 * ============================================================ */
const TOKEN_MAP = [
  // 旧页面底（羊皮纸族）→ 新象牙白
  [/#F3EAD3\b/gi, 'var(--paper)'],
  [/#F3EBDA\b/gi, 'var(--paper)'],
  // 旧浅色卡面/分区（比旧底更亮）→ 新卡面白，保持"亮于底色"的相对关系
  [/#FAF4E6\b/gi, 'var(--card)'],
  [/#FBF6E8\b/gi, 'var(--card)'],
  [/#FBF6E9\b/gi, 'var(--card)'],
  [/#FDF9EE\b/gi, 'var(--card)'],
  [/#F1EFE8\b/gi, 'var(--card)'],
  [/#FAF6EC\b/gi, 'var(--card)'],
  // 旧深色分区（比旧底更深）→ 新燕麦
  [/#E8DDC6\b/gi, 'var(--panel)'],
  [/#F6EFDC\b/gi, 'var(--panel)'],
  [/#EFE6CF\b/gi, 'var(--panel)'],
  // 墨色族 → 石板黑
  [/#1C1916\b/gi, 'var(--ink)'],
  [/#1F1F1C\b/gi, 'var(--ink)'],
  [/#2B2620\b/gi, 'var(--ink)'],
  [/#3A342C\b/gi, 'var(--ink)'],
  [/#2B2B2B\b/gi, 'var(--ink)'],
  [/#333333\b/gi, 'var(--ink)'],
  [/#333\b/gi, 'var(--ink)'],
  // 次级灰 → 新次级
  [/#5F5E5A\b/gi, 'var(--ink-2)'],
  [/#6E6253\b/gi, 'var(--ink-2)'],
  [/#6B6A64\b/gi, 'var(--ink-2)'],
];

const PROJ_RE = /(^|[\\/])(\.git|node_modules)([\\/]|$)|(wxamp|wxapps|miniprogram|miniapp|weapp|linuxserver|winserver)/;
const DRAFT_RE = /^index\d+\.html?$/i;

/* ---------- 参数 ---------- */
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--') && !a.includes('=')));
const kv = Object.fromEntries(argv.filter((a) => a.startsWith('--') && a.includes('='))
  .map((a) => { const i = a.indexOf('='); return [a.slice(2, i), a.slice(i + 1)]; }));
const srcArg = argv.find((a) => !a.startsWith('--'));
const section = kv.section;
const subsection = kv.subsection || '';
const DRY = flags.has('--dry');
const FORCE = flags.has('--force');
const NO_HEAD = flags.has('--no-head');
const AS_ROOT = flags.has('--root');
const INC_ROOT_IDX = flags.has('--include-root-index');

if (!srcArg || !section) {
  console.error('用法: node scripts/convert.mjs <路径> --section=<slug> [--subsection=<slug>] [--root] [--slug=..] [--force] [--dry] [--no-head]');
  process.exit(1);
}

const nav = JSON.parse(await fs.readFile(path.join(ROOT, 'src/content/nav.json'), 'utf-8'));
const secDef = nav.sections.find((s) => s.slug === section);
const subDef = secDef?.subsections.find((x) => x.slug === subsection) ?? null;
if (!secDef) console.warn(`⚠ nav.json 中没有板块 "${section}"`);
if (subsection && secDef && !subDef) console.warn(`⚠ 板块 "${section}" 下没有栏目 "${subsection}"`);

/* ---------- 工具 ---------- */
const posix = (p) => p.split(path.sep).join('/');
const decodeEntities = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const slugify = (s) => s.normalize('NFC').replace(/\.html?$/i, '')
  .replace(/[\\/\s·×]+/g, '-').replace(/[^\p{L}\p{N}\-_]+/gu, '-')
  .replace(/-{2,}/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'page';
const yamlStr = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const urlEnc = (s) => s.split('/').map(encodeURIComponent).join('/');

/* ---------- CSS 映射 + 作用域化 ---------- */
function mapTokens(css) {
  for (const [re, to] of TOKEN_MAP) css = css.replace(re, to);
  css = css.replace(/--([\w-]+)\s*:\s*var\(\s*--\1\s*\)\s*;?/g, ''); // 自引用循环清除
  return css;
}
function scopeSelector(sel, scope) {
  let s = sel.trim();
  if (!s || s.startsWith('@') || s.startsWith('&')) return s;
  const lead = /^(?:html\b\s*)?(?:body|:root|html)(?![\w-])/i;
  if (lead.test(s)) return s.replace(lead, scope);
  return `${scope} ${s}`;
}
function scopeCss(css, scope = '.lp') {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let out = '', i = 0; const n = css.length;
  const readBlock = (from) => { let d = 0; for (let k = from; k < n; k++) { if (css[k] === '{') d++; else if (css[k] === '}') { d--; if (d === 0) return k; } } return n - 1; };
  while (i < n) {
    const brace = css.indexOf('{', i);
    if (brace === -1) { out += css.slice(i); break; }
    const header = css.slice(i, brace).trim();
    const end = readBlock(brace); const inner = css.slice(brace + 1, end);
    if (/^@(media|supports|container|layer)\b/i.test(header)) out += `${header}{${scopeCss(inner, scope)}}`;
    else if (header.startsWith('@')) out += `${header}{${inner}}`;
    else out += header.split(',').map((x) => scopeSelector(x, scope)).join(', ') + `{${inner}}`;
    i = end + 1;
  }
  return out;
}

/* ---------- HTML 解析 ---------- */
function parsePage(html) {
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const d1 = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const d2 = html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const desc = decodeEntities(d1?.[1] ?? d2?.[1] ?? '');
  const styles = [];
  let rest = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, c) => { styles.push(c); return ''; });
  const baseTag = /<base\b[^>]*>/i.test(rest);
  rest = rest.replace(/<base\b[^>]*>/gi, '');
  const head = rest.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? '';
  const carry = [];
  for (const m of head.matchAll(/<script\b[^>]*src=["'][^"']+["'][^>]*>\s*<\/script>/gi)) carry.push(m[0]);
  for (const m of head.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)) {
    if (!/fonts\.googleapis|fonts\.gstatic/i.test(m[0])) carry.push(m[0]);
  }
  for (const m of head.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) carry.push(m[0]);
  let body = rest.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1]
    ?? rest.replace(/<head[\s\S]*?<\/head>/i, '').replace(/<\/?(?:!DOCTYPE|html|body)[^>]*>/gi, '');
  body = (carry.length ? carry.join('\n') + '\n' : '') + body.trim();
  return { title, desc, css: styles.join('\n'), body, baseTag,
           externals: carry.filter((t) => /^<(script|link)\b[^>]*(src|href)=/i.test(t)) };
}

/* ---------- 风险扫描 ---------- */
function scan(css, body) {
  const notes = [];
  if (/position\s*:\s*fixed/i.test(css)) notes.push('含 position:fixed 悬浮元素（注意与站点顶栏 z-index:60 的层叠）');
  if (/100(?:d?v)h/i.test(css)) notes.push('含 100vh/100dvh 整屏布局，套壳后总高度增加');
  if (/document\.body(?!\.appendChild)|body\.classList|document\.documentElement\.style/i.test(body)) notes.push('脚本操作 document.body/html，需人工确认目标是否应改为 .lp');
  if (/cdn\.tailwindcss\.com/i.test(body)) notes.push('依赖 Tailwind CDN（运行时注入全局样式，可能轻微影响外壳，建议此页手工处理）');
  if (/localStorage|sessionStorage/i.test(body)) notes.push('使用 localStorage（注意各页 key 命名互不覆盖）');
  return notes;
}
function unmappedColors(mappedCss) {
  const count = new Map();
  for (const m of mappedCss.matchAll(/#[0-9a-f]{3,8}\b/gi)) { const c = m[0].toLowerCase(); count.set(c, (count.get(c) ?? 0) + 1); }
  return count;
}

/* ---------- 单元发现 ---------- */
const SRC = path.resolve(process.cwd(), srcArg);
const st = await fs.stat(SRC).catch(() => null);
if (!st) { console.error(`路径不存在: ${SRC}`); process.exit(1); }

async function discover() {
  /* 返回 [{file, appDir, slug}] 及模式 */
  const units = [];
  if (st.isFile()) {
    units.push({ file: SRC, appDir: path.dirname(SRC), slug: kv.slug || slugify(path.basename(SRC)) });
    return { units, srcRoot: path.dirname(SRC), rootMode: false };
  }
  const rootIdx = path.join(SRC, 'index.html');
  const rootHasIdx = await fs.access(rootIdx).then(() => true, () => false);
  const isRootMode = AS_ROOT || !rootHasIdx;
  const srcRoot = SRC;
  const walk = async (d) => {
    for (const e of await fs.readdir(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (PROJ_RE.test(posix(p))) continue;
      if (e.isDirectory()) { await walk(p); continue; }
      if (!/\.html?$/i.test(e.name) || DRAFT_RE.test(e.name)) continue;
      const isIdx = e.name.toLowerCase() === 'index.html';
      if (isIdx && d === SRC && isRootMode && !INC_ROOT_IDX) continue; // 集合根 hub
      const appDir = isIdx ? d : d; // 附加具名页归属其所在目录
      const relApp = posix(path.relative(srcRoot, appDir));
      let slug;
      if (isIdx) slug = relApp ? slugify(relApp) : (kv.slug || slugify(path.basename(SRC)));
      else slug = slugify((relApp ? relApp + '/' : '') + e.name.replace(/\.html?$/i, ''));
      if (!isRootMode && isIdx && d === SRC && kv.slug) slug = kv.slug;
      units.push({ file: p, appDir, slug });
    }
  };
  await walk(SRC);
  return { units, srcRoot, rootMode: isRootMode };
}

/* ---------- 站内路由表（供互链改写） ---------- */
function routeOf(slug) { return '/' + [section, subsection, slug].filter(Boolean).join('/') + '/'; }

/* ---------- 相对引用改写 + 资产拷贝 ---------- */
const SKIP_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#)/i;
async function rewriteRefs(text, pageDir, srcRoot, slugByFile, assetOut, report, isCss) {
  const jobs = [];
  const resolveRef = (raw) => {
    const clean = raw.split(/[?#]/)[0];
    if (!clean || SKIP_URL.test(raw)) return null;
    const abs = path.resolve(pageDir, decodeURIComponent(clean));
    return { clean, abs, suffix: raw.slice(clean.length) };
  };
  const handle = async (raw) => {
    const r = resolveRef(raw);
    if (!r) return raw;
    const ok = await fs.stat(r.abs).catch(() => null);
    if (!ok || !ok.isFile()) { report.missing.push(raw); return raw; }
    if (/\.html?$/i.test(r.abs)) {
      const key = posix(path.relative(srcRoot, r.abs));
      const slug = slugByFile.get(key);
      if (slug) return routeOf(slug) + r.suffix;
      report.unlinked.push(raw); return raw;
    }
    const relRoot = posix(path.relative(srcRoot, r.abs));
    if (relRoot.startsWith('..')) { report.escaped.push(raw); return raw; }
    const dest = path.join(assetOut, relRoot);
    jobs.push([r.abs, dest, ok.size]);
    const url = '/' + posix(path.relative(path.join(ROOT, 'public'), dest));
    return urlEnc(url) + r.suffix;
  };
  let out = '';
  if (isCss) {
    const parts = text.split(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g);
    // split 保留分隔捕获组：[pre, q, url, pre, q, url, ...]
    out = parts[0] ?? '';
    for (let i = 1; i < parts.length; i += 3) {
      const url = parts[i + 1];
      out += `url(${await handle(url)})` + (parts[i + 2] ?? '');
    }
  } else {
    const re = /((?:src|href|poster|data-src)=["'])([^"']+)(["'])/gi;
    let last = 0, m;
    while ((m = re.exec(text))) {
      out += text.slice(last, m.index) + m[1] + (await handle(m[2])) + m[3];
      last = m.index + m[0].length;
    }
    out += text.slice(last);
  }
  return { out, jobs };
}

/* ---------- 主流程 ---------- */
const { units, srcRoot, rootMode } = await discover();
if (!units.length) { console.log('没有可转换的页面。'); process.exit(0); }

const slugByFile = new Map(units.map((u) => [posix(path.relative(srcRoot, u.file)), u.slug]));
const segs = [section, subsection].filter(Boolean);
console.log(`\n重构 ${units.length} 个页面 → /${segs.join('/')}/*  ${DRY ? '[试运行]' : ''}\n`);

let done = 0, skip = 0, assetBytes = 0, assetCount = 0;
const allLeftover = new Map(); const oversize = [];

for (const u of units) {
  const html = await fs.readFile(u.file, 'utf-8');
  const { title, desc, css, body, baseTag, externals } = parsePage(html);
  const name = title || u.slug;
  const legacyDir = path.join(ROOT, 'src/legacy', ...segs, u.slug);
  const pagePath = path.join(ROOT, 'src/pages', ...segs, `${u.slug}.astro`);
  const itemPath = path.join(ROOT, 'src/content/items', [...segs, u.slug].join('-') + '.md');
  // root 模式下 relRoot 已含应用目录名；app/单文件模式按本单元 slug 隔离，避免同名资产互相覆盖
  const assetOut = rootMode ? path.join(ROOT, 'public', ...segs) : path.join(ROOT, 'public', ...segs, u.slug);
  const route = routeOf(u.slug);

  const exists = await fs.access(pagePath).then(() => true, () => false);
  if (exists && !FORCE) { skip++; console.log(`  ↷ 跳过（已存在）: ${route}`); continue; }

  const report = { missing: [], unlinked: [], escaped: [] };
  // 内联 style="..." 同步做画布层令牌映射（不触碰脚本内的字面色值）
  const bodyMapped = body.replace(/(style=")([^"]*)(")/gi, (_, a, v, z) => a + mapTokens(v) + z);
  const b = await rewriteRefs(bodyMapped, path.dirname(u.file), srcRoot, slugByFile, assetOut, report, false);
  const cRaw = mapTokens(css);
  const c = await rewriteRefs(cRaw, path.dirname(u.file), srcRoot, slugByFile, assetOut, report, true);
  const scoped = scopeCss(c.out);
  const notes = scan(css, body);
  if (baseTag) notes.push('原页含 <base> 标签，已移除');
  for (const [col, k] of unmappedColors(c.out)) allLeftover.set(col, (allLeftover.get(col) ?? 0) + k);

  const stf = await fs.stat(u.file);
  if (stf.size > MAX_FILE) oversize.push(`${u.slug} (${(stf.size / 1048576).toFixed(1)} MB)`);

  const secEn = secDef?.en ?? section, secZh = secDef?.zh ?? section;
  const subEn = subDef?.en ?? subsection;
  const up = '../'.repeat(segs.length + 1);
  const relLegacy = `${up}legacy/${[...segs, u.slug].join('/')}`;
  const headBlock = NO_HEAD ? '' : `
  <section class="page-head">
    <div class="wrap">
      <div class="eyebrow">${secEn}${subEn ? ' · ' + subEn : ''}</div>
      <h1 class="page-title">{meta.title}</h1>
      ${desc ? '<p class="lede">{meta.description}</p>' : ''}
      <a class="crumb-back" href="${'/' + segs.join('/') + '/'}">← 返回${subDef?.zh ?? secZh}栏目</a>
    </div>
  </section>
`;
  const astro = `---
// 由 scripts/convert.mjs 生成，可自由手工精修
import Base from '${up}layouts/Base.astro';
import body from '${relLegacy}/body.html?raw';
import '${relLegacy}/style.css';

const meta = ${JSON.stringify({ title: name, description: desc }, null, 2)};
---
<Base title={meta.title + ' · Cavno'} description={meta.description}>
${headBlock}
  <article class="lp">
    <Fragment set:html={body} />
  </article>
</Base>
`;
  const date = stf.mtime.toISOString().slice(0, 10);
  const itemMd = ['---', `title: ${yamlStr(name)}`, `section: ${section}`,
    `subsection: ${yamlStr(subsection)}`, `href: ${yamlStr(route)}`, `date: ${date}`,
    'tags: []', `summary: ${yamlStr(desc)}`, '---', ''].join('\n');

  if (!DRY) {
    await fs.mkdir(legacyDir, { recursive: true });
    await fs.mkdir(path.dirname(pagePath), { recursive: true });
    await fs.mkdir(path.dirname(itemPath), { recursive: true });
    await fs.writeFile(path.join(legacyDir, 'body.html'), b.out, 'utf-8');
    await fs.writeFile(path.join(legacyDir, 'style.css'), scoped, 'utf-8');
    await fs.writeFile(pagePath, astro, 'utf-8');
    if (FORCE || !(await fs.access(itemPath).then(() => true, () => false)))
      await fs.writeFile(itemPath, itemMd, 'utf-8');
    for (const [from, to, size] of [...b.jobs, ...c.jobs]) {
      await fs.mkdir(path.dirname(to), { recursive: true });
      await fs.copyFile(from, to);
      assetBytes += size; assetCount++;
    }
  } else {
    assetCount += b.jobs.length + c.jobs.length;
    assetBytes += [...b.jobs, ...c.jobs].reduce((a, [, , s]) => a + s, 0);
  }
  done++;
  console.log(`  ✓ ${route}   ←  ${posix(path.relative(srcRoot, u.file))}   (${name.slice(0, 40)})`);
  if (externals.length) console.log(`      · CDN 依赖搬运 ${externals.length} 条`);
  if (b.jobs.length + c.jobs.length) console.log(`      · 资产拷贝 ${b.jobs.length + c.jobs.length} 个文件`);
  for (const x of report.missing) console.log(`      ⚠ 引用缺失: ${x}`);
  for (const x of report.unlinked) console.log(`      ⚠ 链接目标未在本次转换范围: ${x}`);
  for (const x of report.escaped) console.log(`      ⚠ 引用越出源根目录: ${x}`);
  for (const nnote of notes) console.log(`      ⚠ ${nnote}`);
}

if (allLeftover.size) {
  console.log('\n未映射颜色 TOP15（各页强调色按设计保留；若属旧画布色可补进 TOKEN_MAP 后 --force 重跑）:');
  [...allLeftover.entries()].sort((a, b2) => b2[1] - a[1]).slice(0, 15).forEach(([c2, k]) => console.log(`   ${c2}  ×${k}`));
}
if (oversize.length) { console.warn('\n⚠ 超 25MB 单文件:'); oversize.forEach((f) => console.warn('   - ' + f)); }
console.log(`\n完成: 重构 ${done} 页，跳过 ${skip} 页；拷贝被引用资产 ${assetCount} 个（${(assetBytes / 1048576).toFixed(1)} MB）。\n`);
