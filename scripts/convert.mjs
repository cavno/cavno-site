#!/usr/bin/env node
/**
 * 旧页重构脚本：把旧 GitHub Pages 的单文件 HTML 重构为站内原生页面
 *
 * 与"原样粘贴"不同，本脚本做四件事：
 *   1) 抽取旧页 <body> 内容，装进站点统一外壳（Base 布局：导航/页脚/页头面包屑）
 *   2) 抽取全部 <style>，按 TOKEN_MAP 把旧设计令牌替换为新设计系统变量，
 *      并将所有选择器限定在 .lp 作用域内（html/body/:root → .lp），
 *      使旧页样式只作用于内容区，不污染站点外壳
 *   3) 保留旧页脚本与交互（含 <head> 里的外部 CDN 依赖，自动搬运）
 *   4) 生成目录卡片元数据 src/content/items/*.md，并输出逐页风险报告
 *
 * 用法:
 *   node scripts/convert.mjs <html文件或目录> --section=<slug> [--subsection=<slug>] [选项]
 *
 * 选项:
 *   --slug=<slug>     指定路由 slug（仅单文件时有效，默认取文件名）
 *   --include-index   目录模式下连 index.html 也转换（默认跳过旧 hub 首页）
 *   --force           覆盖已生成的页面与条目
 *   --dry             试运行，只打印计划与报告，不写文件
 *   --no-head         不生成站内页头（旧页自带完整大标题时使用）
 *
 * 示例:
 *   node scripts/convert.mjs _legacy/Reading_and_Thinking/Books --section=reading --subsection=books
 *   node scripts/convert.mjs _legacy/Investing/gamma.html --section=investing --subsection=options --slug=gamma-atlas
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/* ============================================================
 * 设计令牌映射表：旧值 → 新设计系统
 * 左列填旧站实际用到的颜色（跑一次 --dry 会输出"未映射颜色清单"，按需补全）
 * ============================================================ */
const TOKEN_MAP = [
  // 旧羊皮纸底色系 → 新象牙白 / 燕麦
  [/#F3EAD3\b/gi, 'var(--paper)'],
  [/#EFE6CF\b/gi, 'var(--panel)'],
  [/#FAF6EC\b/gi, 'var(--paper)'],
  // 旧墨色 → 新石板黑（按实际旧值补充）
  [/#2B2B2B\b/gi, 'var(--ink)'],
  [/#333(?:333)?\b/gi, 'var(--ink)'],
  // 旧青绿(teal)强调 → 新石板黑（结构色收敛为墨色，强调交给珊瑚橙）
  [/#1F6F6B\b/gi, 'var(--ink)'],
  [/#0F766E\b/gi, 'var(--ink)'],
  // 旧赭陶(terracotta)强调 → 新珊瑚橙
  [/#C96F4A\b/gi, 'var(--coral)'],
  [/#B65C3B\b/gi, 'var(--coral-deep)'],
];

/* ---------- 参数解析 ---------- */
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--') && !a.includes('=')));
const kv = Object.fromEntries(
  argv.filter((a) => a.startsWith('--') && a.includes('='))
    .map((a) => { const i = a.indexOf('='); return [a.slice(2, i), a.slice(i + 1)]; })
);
const srcArg = argv.find((a) => !a.startsWith('--'));
const section = kv.section;
const subsection = kv.subsection || '';
const DRY = flags.has('--dry');
const FORCE = flags.has('--force');
const INCLUDE_INDEX = flags.has('--include-index');
const NO_HEAD = flags.has('--no-head');

if (!srcArg || !section) {
  console.error('用法: node scripts/convert.mjs <html文件或目录> --section=<slug> [--subsection=<slug>] [--slug=..] [--include-index] [--force] [--dry] [--no-head]');
  process.exit(1);
}

/* ---------- 读取导航，解析板块中英文名 ---------- */
const nav = JSON.parse(await fs.readFile(path.join(ROOT, 'src/content/nav.json'), 'utf-8'));
const secDef = nav.sections.find((s) => s.slug === section);
if (!secDef) console.warn(`⚠ nav.json 中没有板块 "${section}"，页头将直接使用 slug。`);
const subDef = secDef?.subsections.find((x) => x.slug === subsection) ?? null;
if (subsection && secDef && !subDef) console.warn(`⚠ 板块 "${section}" 下没有栏目 "${subsection}"。`);

/* ---------- 工具 ---------- */
const decodeEntities = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

const slugify = (s) => s
  .normalize('NFC').replace(/\.html?$/i, '')
  .replace(/[\\/\s]+/g, '-')
  .replace(/[^\p{L}\p{N}\-_]+/gu, '-')
  .replace(/-{2,}/g, '-').replace(/^-|-$/g, '')
  .toLowerCase() || 'page';

const yamlStr = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/* ---------- CSS：令牌映射 + .lp 作用域化 ---------- */
function mapTokens(css) {
  for (const [re, to] of TOKEN_MAP) css = css.replace(re, to);
  // 旧页若定义了与新系统同名的变量（如 --ink/--panel），映射后会产生
  // `--ink: var(--ink)` 自引用循环 → 删除该声明，让其直接继承全局令牌
  css = css.replace(/--([\w-]+)\s*:\s*var\(\s*--\1\s*\)\s*;?/g, '');
  return css;
}

function scopeSelector(sel, scope) {
  let s = sel.trim();
  if (!s || s.startsWith('@')) return s;
  // html / body / :root（含 html body 连写、body.xxx）整体折叠为 .lp
  const lead = /^(?:html\b\s*)?(?:body|:root|html)(?![\w-])/i;
  if (lead.test(s)) return s.replace(lead, scope);
  return `${scope} ${s}`;
}

function scopeCss(css, scope = '.lp') {
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // 去注释
  let out = '', i = 0;
  const n = css.length;
  const readBlock = (from) => { // from 指向 '{'，返回匹配 '}' 的下标
    let d = 0;
    for (let k = from; k < n; k++) {
      if (css[k] === '{') d++;
      else if (css[k] === '}') { d--; if (d === 0) return k; }
    }
    return n - 1;
  };
  while (i < n) {
    const brace = css.indexOf('{', i);
    if (brace === -1) { out += css.slice(i); break; }
    const header = css.slice(i, brace).trim();
    const end = readBlock(brace);
    const inner = css.slice(brace + 1, end);
    if (/^@(media|supports|container|layer)\b/i.test(header)) {
      out += `${header}{${scopeCss(inner, scope)}}`;
    } else if (/^@(keyframes|-webkit-keyframes|font-face|page|property)\b/i.test(header)) {
      out += `${header}{${inner}}`; // 原样保留
    } else if (header.startsWith('@')) { // @import / @charset 等无块规则被上面 indexOf 误抓的概率极低，兜底原样
      out += `${header}{${inner}}`;
    } else {
      const scoped = header.split(',').map((x) => scopeSelector(x, scope)).join(', ');
      out += `${scoped}{${inner}}`;
    }
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

  // 全文的 <style>
  const styles = [];
  const noStyle = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, c) => { styles.push(c); return ''; });

  // <head> 中的外部依赖（CDN 脚本 / 样式表），搬到内容区顶部
  const head = noStyle.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? '';
  const carry = [];
  for (const m of head.matchAll(/<script\b[^>]*src=["'][^"']+["'][^>]*>\s*<\/script>/gi)) carry.push(m[0]);
  for (const m of head.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)) {
    if (!/fonts\.googleapis|fonts\.gstatic/i.test(m[0])) carry.push(m[0]); // 字体由 Base 统一加载
  }
  for (const m of head.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) carry.push(m[0]); // head 内联脚本

  let body = noStyle.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1]
    ?? noStyle.replace(/<head[\s\S]*?<\/head>/i, '').replace(/<\/?(?:!DOCTYPE|html|body)[^>]*>/gi, '');
  body = (carry.length ? carry.join('\n') + '\n' : '') + body.trim();

  return { title, desc, css: styles.join('\n'), body, externals: carry.filter((t) => /^<(script|link)\b[^>]*(src|href)=/i.test(t)) };
}

/* ---------- 风险扫描 ---------- */
function scan(css, body) {
  const notes = [];
  if (/position\s*:\s*fixed/i.test(css)) notes.push('CSS 含 position:fixed —— 悬浮元素仍相对视口定位，通常无碍，个别需检查与站点顶栏(z-index:60)的层叠关系');
  if (/100(?:d?v)h/i.test(css)) notes.push('CSS 含 100vh/100dvh —— 旧页按整屏布局，套上外壳后总高度会增加，必要时改为 min-height 或减去外壳高度');
  if (/@keyframes/i.test(css)) notes.push('含 @keyframes —— 动画名保持全局，本站按页拆分 CSS，不同页之间不会冲突');
  if (/document\.body|body\.classList|document\.documentElement/i.test(body)) notes.push('脚本操作 document.body/html —— 旧页想改整页背景或滚动锁，需人工把目标改为 .lp 容器');
  if (/<iframe/i.test(body)) notes.push('内容含 iframe');
  if (/localStorage|sessionStorage/i.test(body)) notes.push('脚本使用 localStorage —— 站内可正常使用，注意各页 key 命名避免互相覆盖');
  return notes;
}

function unmappedColors(originalCss, mappedCss) {
  const count = new Map();
  for (const m of mappedCss.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
    const c = m[0].toLowerCase();
    count.set(c, (count.get(c) ?? 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
}

/* ---------- 单页转换 ---------- */
async function convertOne(file, slug) {
  const html = await fs.readFile(file, 'utf-8');
  const { title, desc, css, body, externals } = parsePage(html);
  const name = title || path.basename(file, path.extname(file));

  const mapped = mapTokens(css);
  const scoped = scopeCss(mapped);
  const notes = scan(css, body);
  const leftover = unmappedColors(css, mapped);

  const segs = [section, subsection].filter(Boolean);
  const legacyDir = path.join(ROOT, 'src/legacy', ...segs, slug);
  const pagePath = path.join(ROOT, 'src/pages', ...segs, `${slug}.astro`);
  const itemPath = path.join(ROOT, 'src/content/items', [...segs, slug].join('-') + '.md');
  const route = '/' + [...segs, slug].join('/') + '/';
  const up = '../'.repeat(segs.length + 1); // pages/<segs>/<slug>.astro → src/
  const relLegacy = `${up}legacy/${[...segs, slug].join('/')}`;

  const exists = await fs.access(pagePath).then(() => true, () => false);
  if (exists && !FORCE) return { slug, route, name, skipped: true, notes: [], leftover: [], externals: [] };

  const secEn = secDef?.en ?? section;
  const secZh = secDef?.zh ?? section;
  const subEn = subDef?.en ?? subsection;

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

  const date = (await fs.stat(file)).mtime.toISOString().slice(0, 10);
  const itemMd = [
    '---',
    `title: ${yamlStr(name)}`,
    `section: ${section}`,
    `subsection: ${yamlStr(subsection)}`,
    `href: ${yamlStr(route)}`,
    `date: ${date}`,
    'tags: []',
    `summary: ${yamlStr(desc)}`,
    '---', '',
  ].join('\n');

  if (!DRY) {
    await fs.mkdir(legacyDir, { recursive: true });
    await fs.mkdir(path.dirname(pagePath), { recursive: true });
    await fs.mkdir(path.dirname(itemPath), { recursive: true });
    await fs.writeFile(path.join(legacyDir, 'body.html'), body, 'utf-8');
    await fs.writeFile(path.join(legacyDir, 'style.css'), scoped, 'utf-8');
    await fs.writeFile(pagePath, astro, 'utf-8');
    if (FORCE || !(await fs.access(itemPath).then(() => true, () => false))) {
      await fs.writeFile(itemPath, itemMd, 'utf-8');
    }
  }
  return { slug, route, name, skipped: false, notes, leftover, externals };
}

/* ---------- 主流程 ---------- */
const SRC = path.resolve(process.cwd(), srcArg);
const st = await fs.stat(SRC).catch(() => null);
if (!st) { console.error(`路径不存在: ${SRC}`); process.exit(1); }

let files = [];
if (st.isDirectory()) {
  const walk = async (d) => {
    for (const e of await fs.readdir(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (/(^|[\\/])(\.git|node_modules)([\\/]|$)/.test(p)) continue;
      if (e.isDirectory()) await walk(p);
      else if (/\.html?$/i.test(e.name)) {
        if (e.name.toLowerCase() === 'index.html' && !INCLUDE_INDEX) continue;
        files.push(p);
      }
    }
  };
  await walk(SRC);
} else files = [SRC];

if (!files.length) { console.log('没有找到可转换的 .html 文件。'); process.exit(0); }

console.log(`\n重构 ${files.length} 个页面 → /${[section, subsection].filter(Boolean).join('/')}/*  ${DRY ? '[试运行]' : ''}\n`);
let done = 0, skip = 0;
const allLeftover = new Map();

for (const f of files) {
  const slug = files.length === 1 && kv.slug ? kv.slug : slugify(path.basename(f));
  const r = await convertOne(f, slug);
  if (r.skipped) { skip++; console.log(`  ↷ 跳过（已存在，--force 覆盖）: ${r.route}`); continue; }
  done++;
  console.log(`  ✓ ${r.route}   ←  ${path.basename(f)}   (${r.name})`);
  for (const [c, k] of r.leftover) allLeftover.set(c, (allLeftover.get(c) ?? 0) + k);
  if (r.externals.length) console.log(`      · 外部依赖已搬运: ${r.externals.length} 条（CDN 脚本/样式）`);
  for (const nnote of r.notes) console.log(`      ⚠ ${nnote}`);
}

if (allLeftover.size) {
  console.log('\n未映射颜色清单（按出现次数，若属旧设计令牌请补进 TOKEN_MAP 后 --force 重跑）:');
  [...allLeftover.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
    .forEach(([c, k]) => console.log(`   ${c}  ×${k}`));
}
console.log(`\n完成: 重构 ${done} 页，跳过 ${skip} 页。`);
console.log('下一步: npm run build 本地检查各页 → 逐页精修 → git push 上线。\n');
