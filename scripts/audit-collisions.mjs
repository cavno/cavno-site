#!/usr/bin/env node
/**
 * 外壳↔旧页 命名冲突审计：global.css 类名 / 外壳 ID  ∩  src/legacy 全部旧页
 * 每次转换新页后可跑一次：node scripts/audit-collisions.mjs（有冲突则退出码 1）
 * 约定：外壳组件类一律 cv- 前缀；open/active/plan/scrolled/lock 为状态类，
 * 只允许出现在锚定 cv- 组件的复合选择器中。
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KEEP = new Set(['lp','open','active','plan','scrolled','lock','cur','on']);

const css = await fs.readFile(path.join(ROOT,'src/styles/global.css'),'utf-8');
const shell = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m=>m[1]).filter(c=>!KEEP.has(c)));
let sids = new Set();
for (const f of ['src/layouts/Base.astro','src/pages/index.astro','src/pages/[...path].astro']) {
  const s = await fs.readFile(path.join(ROOT,f),'utf-8');
  for (const m of s.matchAll(/id="([\w-]+)"/g)) sids.add(m[1]);
}
const badC = new Map(), badI = new Map();
async function walk(d){ for (const e of await fs.readdir(d,{withFileTypes:true})) {
  const p = path.join(d,e.name);
  if (e.isDirectory()) { await walk(p); continue; }
  const s = await fs.readFile(p,'utf-8').catch(()=> '');
  const toks = new Set();
  if (e.name==='body.html') {
    for (const m of s.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach(t=>toks.add(t));
    for (const m of s.matchAll(/id="([\w-]+)"/g)) if (sids.has(m[1]))
      badI.set(m[1], (badI.get(m[1])||0)+1);
  } else if (e.name==='style.css') {
    for (const m of s.matchAll(/\.([a-zA-Z][\w-]*)/g)) toks.add(m[1]);
  }
  for (const t of toks) if (shell.has(t)) badC.set(t,(badC.get(t)||0)+1);
}}
await walk(path.join(ROOT,'src/legacy')).catch(()=>{});
if (badC.size || badI.size) {
console.error('⚠ 命名冲突（会造成样式/脚本互相污染）:');
for (const [c,n] of [...badC].sort((a,b)=>b[1]-a[1])) console.error(`   .${c}  ×${n} 文件`);
for (const [i,n] of badI) console.error(`   #${i}  ×${n} 文件`);
console.error('处理：改外壳侧命名（保持 cv- 前缀且不与旧页语料重合），勿改旧页。');
process.exit(1);
}
console.log('外壳 ↔ 旧页 命名交集：∅ ✓');

/* 第二道检查：外壳标记里用到的 cv-* 类必须在 global.css 有定义（防止改名漂移） */
const defined = new Set([...css.matchAll(/\.(cv-[\w-]+)/g)].map(m=>m[1]));
let drift = [];
for (const f of ['src/layouts/Base.astro','src/pages/index.astro','src/pages/[...path].astro','src/pages/404.astro','src/components/ItemCard.astro']) {
  const t = await fs.readFile(path.join(ROOT,f),'utf-8');
  for (const m of t.matchAll(/class="([^"]*)"/g))
    for (const tok of m[1].split(/\s+/))
      if (tok.startsWith('cv-') && !defined.has(tok)) drift.push(`${f}: .${tok}`);
}
if (drift.length) { console.error('⚠ 外壳类名漂移（标记有、CSS 无）:'); drift.forEach(x=>console.error('   '+x)); process.exit(1); }
console.log('外壳标记 ↔ global.css 一致 ✓');

