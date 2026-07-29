#!/usr/bin/env node
/**
 * 批量注入脚本：给旧 GitHub Pages 仓库的所有 HTML 加上主站导航栏引用
 *
 * 用法（对旧仓库的本地 clone 执行，然后 commit + push 到 GitHub 即生效）:
 *   node scripts/inject-shell.mjs <目录或文件> [--src=<脚本地址>] [--remove] [--dry]
 *
 * 默认注入的行（--src 缺省取 astro.config.mjs 的 site + /shell.js）:
 *   <script src="https://<主站>/shell.js" defer data-cavno-shell></script>
 *
 * 行为:
 *   - 在每个 .html 的 </body> 前插入一行；无 </body> 则追加到文件末尾
 *   - 幂等：已含 data-cavno-shell 或 shell.js 引用的文件自动跳过
 *   - --remove 反向操作，清除注入行；--dry 只打印计划
 *
 * 示例（四个旧仓库）:
 *   node scripts/inject-shell.mjs _legacy/Investing
 *   node scripts/inject-shell.mjs _legacy/Reading_and_Thinking
 *   node scripts/inject-shell.mjs _legacy/Life_Style_and_Skills
 *   node scripts/inject-shell.mjs _legacy/Working
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--') && !a.includes('=')));
const kv = Object.fromEntries(
  argv.filter((a) => a.startsWith('--') && a.includes('='))
    .map((a) => { const i = a.indexOf('='); return [a.slice(2, i), a.slice(i + 1)]; })
);
const target = argv.find((a) => !a.startsWith('--'));
const DRY = flags.has('--dry');
const REMOVE = flags.has('--remove');

if (!target) {
  console.error('用法: node scripts/inject-shell.mjs <目录或文件> [--src=URL] [--remove] [--dry]');
  process.exit(1);
}

let src = kv.src;
if (!src) {
  const cfg = await fs.readFile(path.join(ROOT, 'astro.config.mjs'), 'utf-8');
  const site = (cfg.match(/site:\s*['"]([^'"]+)['"]/)?.[1] ?? '').replace(/\/+$/, '');
  if (!site) { console.error('astro.config.mjs 缺少 site，且未提供 --src'); process.exit(1); }
  src = `${site}/shell.js`;
}
const TAG = `<script src="${src}" defer data-cavno-shell></script>`;
const STRIP_RE = /[ \t]*<script\b[^>]*(?:data-cavno-shell|shell\.js)[^>]*>\s*<\/script>[ \t]*\r?\n?/gi;

const T = path.resolve(process.cwd(), target);
const st = await fs.stat(T).catch(() => null);
if (!st) { console.error(`路径不存在: ${T}`); process.exit(1); }

const files = [];
if (st.isDirectory()) {
  const walk = async (d) => {
    for (const e of await fs.readdir(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (/(^|[\\/])(\.git|node_modules)([\\/]|$)/.test(p)) continue;
      if (e.isDirectory()) await walk(p);
      else if (/\.html?$/i.test(e.name)) files.push(p);
    }
  };
  await walk(T);
} else files.push(T);

let done = 0, skipped = 0;
for (const f of files) {
  let html = await fs.readFile(f, 'utf-8');
  const rel = path.relative(process.cwd(), f);

  if (REMOVE) {
    if (!STRIP_RE.test(html)) { skipped++; continue; }
    STRIP_RE.lastIndex = 0;
    const out = html.replace(STRIP_RE, '');
    if (DRY) console.log(`  [dry] 移除 ← ${rel}`);
    else await fs.writeFile(f, out, 'utf-8');
    done++; continue;
  }

  if (/data-cavno-shell|shell\.js/i.test(html)) { skipped++; continue; }
  const idx = html.toLowerCase().lastIndexOf('</body>');
  const out = idx === -1
    ? html + '\n' + TAG + '\n'
    : html.slice(0, idx) + TAG + '\n' + html.slice(idx);
  if (DRY) console.log(`  [dry] 注入 ← ${rel}`);
  else await fs.writeFile(f, out, 'utf-8');
  done++;
}

console.log(`\n${REMOVE ? '移除' : '注入'}完成: ${done} 个文件，跳过 ${skipped} 个。${DRY ? '（试运行，未写入）' : ''}`);
if (!REMOVE && !DRY && done > 0) console.log(`注入内容: ${TAG}\n下一步: 在旧仓库内 git add -A && git commit -m "add shared nav" && git push`);
