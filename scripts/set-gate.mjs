#!/usr/bin/env node
/**
 * 设置 Working 板块的六位口令（只把「盐 + SHA-256 哈希」写入仓库，明文不落盘）
 * 用法: node scripts/set-gate.mjs 246810
 * 注意：静态站的前端口令门属「遮挡」而非「加密」——真正的防护请同时启用
 *      functions/working/_middleware.js（见 README §6）。
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const code = (process.argv[2] || '').trim();
if (!/^\d{6}$/.test(code)) {
  console.error('用法: node scripts/set-gate.mjs <六位数字口令>');
  process.exit(1);
}
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.createHash('sha256').update(salt + code).digest('hex');
const file = path.join(ROOT, 'src/config/access.json');
await fs.writeFile(file, JSON.stringify({
  note: '仓库内仅存盐与哈希；明文口令不入库。前端口令门为遮挡级防护，真正防护见 functions/working/_middleware.js',
  salt, hash, days: 30
}, null, 2) + '\n', 'utf-8');
console.log('已写入 src/config/access.json');
console.log('前端口令已更新；如已启用 Cloudflare Function，请同步在后台把 WORKING_CODE 设为同一口令。');
