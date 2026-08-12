#!/usr/bin/env node
/**
 * 旧站批量迁移脚本
 *
 * 用法:
 *   node scripts/migrate.mjs <源目录> --section=<板块slug> [--subsection=<栏目slug>] [选项]
 *
 * 行为:
 *   1) 将 <源目录> 整棵树拷贝到 public/apps/<section>[/<subsection>]/
 *      （保留相对路径，页面内的相对资源引用不受影响）
 *   2) 为其中每个 .html（默认跳过 index.html）生成一条条目元数据:
 *      src/content/items/<section>-[<subsection>-]<slug>.md
 *      标题取 <title>，摘要取 <meta name="description">，日期取文件 mtime
 *
 * 选项:
 *   --include-index   连 index.html 也生成条目（默认跳过旧 hub 首页）
 *   --force           覆盖已存在的条目 .md（默认跳过，脚本可安全重复执行）
 *   --dry             试运行：只打印将要发生的动作，不写任何文件
 *
 * 示例（对应四个旧仓库，先 clone 到 _legacy/）:
 *   node scripts/migrate.mjs _legacy/Investing                          --section=investing
 *   node scripts/migrate.mjs _legacy/Reading_and_Thinking/Books         --section=reading --subsection=books
 *   node scripts/migrate.mjs _legacy/Reading_and_Thinking/Philosophy    --section=reading --subsection=philosophy
 *   node scripts/migrate.mjs _legacy/Reading_and_Thinking/Thinking      --section=reading --subsection=thinking
 *   node scripts/migrate.mjs _legacy/Reading_and_Thinking/Mathematics   --section=reading --subsection=math
 *   node scripts/migrate.mjs _legacy/Life_Style_and_Skills/Driving      --section=life    --subsection=driving
 *   node scripts/migrate.mjs _legacy/Working/Amazon_Tools               --section=working --subsection=amazon
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { toAsciiPath } from './url-slugs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MAX_FILE = 25 * 1024 * 1024; // Cloudflare Pages 单文件上限 25 MiB

// ---------- 参数解析 ----------
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

if (!srcArg || !section) {
  console.error('用法: node scripts/migrate.mjs <源目录> --section=<slug> [--subsection=<slug>] [--include-index] [--force] [--dry]');
  process.exit(1);
}
const SRC = path.resolve(process.cwd(), srcArg);
const DEST = path.join(ROOT, 'public', 'apps', section, subsection);
const ITEMS_DIR = path.join(ROOT, 'src', 'content', 'items');

// ---------- 工具函数 ----------
const SKIP_RE = /(^|[\\/])(\.git|\.github|node_modules|\.DS_Store)([\\/]|$)/;

const decodeEntities = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

const yamlStr = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

const slugify = (s) => s
  .normalize('NFC')
  .replace(/\.html?$/i, '')
  .replace(/[\\/\s]+/g, '-')
  .replace(/[^\p{L}\p{N}\-_]+/gu, '-')
  .replace(/-{2,}/g, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase() || 'page';

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (SKIP_RE.test(p)) continue;
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function extract(html) {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const d1 = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const d2 = html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  return {
    title: t ? decodeEntities(t[1]) : '',
    desc: decodeEntities((d1?.[1] ?? d2?.[1] ?? '')),
  };
}

// ---------- 主流程 ----------
const stat = await fs.stat(SRC).catch(() => null);
if (!stat?.isDirectory()) { console.error(`源目录不存在: ${SRC}`); process.exit(1); }

console.log(`\n迁移: ${SRC}`);
console.log(`  → 文件目的地: public/apps/${section}${subsection ? '/' + subsection : ''}/`);
console.log(`  → 条目目的地: src/content/items/${DRY ? '   [试运行，不写入]' : ''}\n`);

// 1) 整树拷贝，并把公开资源路径规范为 ASCII。
if (!DRY) {
  await fs.mkdir(DEST, { recursive: true });
  for await (const source of walk(SRC)) {
    const relative = toAsciiPath(path.relative(SRC, source));
    const target = path.join(DEST, ...relative.split('/'));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
  }
}

// 2) 为每个 .html 生成条目元数据（在源树上扫描，路径映射到目的地）
let created = 0, skippedExist = 0, skippedIndex = 0, oversize = [];
if (!DRY) await fs.mkdir(ITEMS_DIR, { recursive: true });

for await (const file of walk(SRC)) {
  if (!/\.html?$/i.test(file)) continue;
  const rel = path.relative(SRC, file);
  const relPosix = rel.split(path.sep).join('/');
  const publicRelPosix = toAsciiPath(relPosix);
  const base = path.basename(file).toLowerCase();

  const st = await fs.stat(file);
  if (st.size > MAX_FILE) oversize.push(`${relPosix} (${(st.size / 1048576).toFixed(1)} MB)`);

  if (base === 'index.html' && !INCLUDE_INDEX) { skippedIndex++; continue; }

  const html = await fs.readFile(file, 'utf-8').catch(() => '');
  const { title, desc } = extract(html);
  const name = title || path.basename(file, path.extname(file));

  const href = ['/apps', section, subsection, publicRelPosix].filter(Boolean).join('/');
  const mdName = [section, subsection, slugify(publicRelPosix)].filter(Boolean).join('-') + '.md';
  const mdPath = path.join(ITEMS_DIR, mdName);
  const date = st.mtime.toISOString().slice(0, 10);

  const exists = await fs.access(mdPath).then(() => true, () => false);
  if (exists && !FORCE) { skippedExist++; continue; }

  const fm = [
    '---',
    `title: ${yamlStr(name)}`,
    `section: ${section}`,
    `subsection: ${yamlStr(subsection)}`,
    `href: ${yamlStr(href)}`,
    `date: ${date}`,
    'tags: []',
    `summary: ${yamlStr(desc)}`,
    '---',
    '',
  ].join('\n');

  if (DRY) console.log(`  [dry] ${mdName}  ←  ${relPosix}  (${name})`);
  else await fs.writeFile(mdPath, fm, 'utf-8');
  created++;
}

// ---------- 汇总 ----------
console.log(`\n完成: 新建条目 ${created} 条；已存在跳过 ${skippedExist} 条；index.html 跳过 ${skippedIndex} 个。`);
if (oversize.length) {
  console.warn(`\n⚠ 超过 Cloudflare Pages 单文件 25 MB 上限（需压缩或外链）:`);
  oversize.forEach((f) => console.warn(`   - ${f}`));
}
console.log(`\n下一步: 检查 git diff → git add -A && git commit -m "migrate ${section}${subsection ? '/' + subsection : ''}" && git push\n`);
