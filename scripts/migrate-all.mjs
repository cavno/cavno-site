#!/usr/bin/env node
/**
 * 全量迁移编排：源目录 → (板块, 栏目) 的映射一处维护
 * 用法: node scripts/migrate-all.mjs [--force] [--dry]
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const L = (p) => path.join(ROOT, '_legacy', p);
const extra = process.argv.slice(2);

/* [源路径, section, subsection, 模式('root'|'app'), 可选slug] */
const PLAN = [
  // ---- Investing：按应用分栏 ----
  [L('Investing/options'), 'investing', 'options', 'app', 'gamma-delta-squeeze'],
  [L('Investing/options_tension'), 'investing', 'options', 'app'],
  [L('Investing/options-atlas'), 'investing', 'options', 'app'],
  [L('Investing/option_greek'), 'investing', 'options', 'app'],
  [L('Investing/longcall'), 'investing', 'options', 'app'],
  [L('Investing/MaxPain'), 'investing', 'options', 'app'],
  [L('Investing/gamma-atlas'), 'investing', 'options', 'app'],
  [L('Investing/gamma-profile'), 'investing', 'options', 'app'],
  [L('Investing/动态Gamma敞口图'), 'investing', 'options', 'app'],
  [L('Investing/动态对冲'), 'investing', 'options', 'app'],
  [L('Investing/期权波动率与定价'), 'investing', 'options', 'app'],
  [L('Investing/tbill_margin_schwab_vs_ibkr'), 'investing', 'options', 'app'],
  [L('Investing/value_investing'), 'investing', 'valuation', 'app'],
  [L('Investing/CreditExpansion'), 'investing', 'cases', 'app'],
  [L('Investing/jane-street-viz'), 'investing', 'cases', 'app'],
  // ---- Reading & Thinking：集合根 ----
  [L('Reading_and_Thinking/Books'), 'reading', 'books', 'root'],
  [L('Reading_and_Thinking/Philosophy'), 'reading', 'philosophy', 'root'],
  [L('Reading_and_Thinking/Thinking'), 'reading', 'thinking', 'root'],
  [L('Reading_and_Thinking/Mathematics'), 'reading', 'math', 'root'],
  // ---- Life & Skills ----
  [L('Life_Style_and_Skills/Driving'), 'life', 'driving', 'root'],
  [L('Life_Style_and_Skills/School'), 'life', 'school', 'root'],
  [L('Life_Style_and_Skills/房地产'), 'life', 'house', 'root'],
  [L('Life_Style_and_Skills/中国'), 'life', 'china', 'root'],
  [L('Life_Style_and_Skills/育儿'), 'life', 'family', 'root'],
  [L('Life_Style_and_Skills/报单'), 'life', 'orders', 'app'],
  // ---- Working ----
  [L('Working/Amazon_Tools'), 'working', 'amazon', 'root'],
];

let fail = 0;
for (const [src, section, subsection, mode, slug] of PLAN) {
  const args = [path.join(ROOT, 'scripts/convert.mjs'), src,
    `--section=${section}`, `--subsection=${subsection}`, ...extra];
  if (mode === 'root') args.push('--root');
  if (slug) args.push(`--slug=${slug}`);
  const r = spawnSync('node', args, { stdio: 'inherit' });
  if (r.status !== 0) { fail++; console.error(`✗ 失败: ${src}`); }
}
process.exit(fail ? 1 : 0);
