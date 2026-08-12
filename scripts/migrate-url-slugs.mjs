#!/usr/bin/env node
/**
 * One-time, idempotent migration from Chinese URL segments to canonical ASCII
 * slugs. Run without --apply for a preview, then run with --apply.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PUBLIC_PATH_NAMES,
  ROUTE_MIGRATIONS,
  ROUTE_SLUGS,
  englishPathNameFor,
} from './url-slugs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const TEXT_EXTENSIONS = new Set([
  '.astro', '.css', '.html', '.js', '.json', '.jsonc', '.md', '.mjs', '.svg',
  '.ts', '.txt', '.xml', '.yaml', '.yml',
]);
const SKIP_DIRS = new Set(['.git', 'dist', 'node_modules']);
const GENERATED_TEXT_FILES = new Set([
  'docs/url-slug-migration.md',
  'scripts/url-slugs.mjs',
  'src/data/legacy-route-redirects.json',
]);
const posix = (value) => value.split(path.sep).join('/');

async function exists(target) {
  return fs.access(target).then(() => true, () => false);
}

async function walk(dir, includeDirectories = false) {
  const found = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (includeDirectories) found.push(target);
      found.push(...await walk(target, includeDirectories));
    } else {
      found.push(target);
    }
  }
  return found;
}

async function renameSibling(source, target) {
  const sourceExists = await exists(source);
  const targetExists = await exists(target);
  if (!sourceExists) {
    if (!targetExists) throw new Error(`Missing source and target: ${source}`);
    return false;
  }
  if (targetExists) throw new Error(`Rename target already exists: ${target}`);
  console.log(`${APPLY ? 'rename' : '[dry] rename'} ${posix(path.relative(ROOT, source))} -> ${posix(path.relative(ROOT, target))}`);
  if (APPLY) await fs.rename(source, target);
  return true;
}

function replaceEvery(value, from, to) {
  if (!from || from === to || !value.includes(from)) return value;
  return value.split(from).join(to);
}

function encodedVariants(value) {
  return new Set([value, encodeURI(value), encodeURIComponent(value)]);
}

function replacePair(value, from, to) {
  const fromVariants = [...encodedVariants(from)];
  const toVariants = [...encodedVariants(to)];
  let out = value;
  for (let index = 0; index < fromVariants.length; index++) {
    out = replaceEvery(out, fromVariants[index], toVariants[index]);
  }
  return out;
}

const publicRoot = path.join(ROOT, 'public');
const pathNameMap = Object.freeze({ ...ROUTE_SLUGS, ...PUBLIC_PATH_NAMES });

const routePairs = ROUTE_MIGRATIONS.map(({ section, subsection, from, to }) => ({
  oldRoute: `/${section}/${subsection}/${from}/`,
  newRoute: `/${section}/${subsection}/${to}/`,
  oldLegacy: `legacy/${section}/${subsection}/${from}/`,
  newLegacy: `legacy/${section}/${subsection}/${to}/`,
  oldItem: `${section}-${subsection}-${from}`,
  newItem: `${section}-${subsection}-${to}`,
}));

function rewriteText(text) {
  let out = text;
  for (const pair of routePairs) {
    out = replacePair(out, pair.oldRoute, pair.newRoute);
    out = replacePair(out, pair.oldLegacy, pair.newLegacy);
    out = replacePair(out, pair.oldItem, pair.newItem);
  }

  // Map exact path segments only inside reference values. Never replace a bare
  // Chinese word across a whole file: page prose may legitimately contain the
  // same word as a directory or filename.
  const mapSegment = (segment) => {
    if (!segment || segment === '.' || segment === '..') return segment;
    let decoded = segment;
    try { decoded = decodeURIComponent(segment); } catch { /* retain invalid encoding */ }
    return pathNameMap[decoded] ?? segment;
  };
  const rewriteReference = (value) => {
    const trimmed = value.trim();
    if (!trimmed || /^(?:#|data:|mailto:|tel:|javascript:)/i.test(trimmed)) return value;
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)) return value;
    const match = trimmed.match(/^([^?#]*)([?#].*)?$/s);
    if (!match) return value;
    const rewritten = match[1].split('/').map(mapSegment).join('/') + (match[2] ?? '');
    return value.replace(trimmed, rewritten);
  };
  const isMappedPathReference = (value) => {
    const trimmed = value.trim();
    if (!trimmed || /^(?:#|data:|mailto:|tel:|javascript:)/i.test(trimmed)) return false;
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)) return false;
    const pathname = trimmed.split(/[?#]/, 1)[0];
    const segments = pathname.split('/').filter((segment) => segment && segment !== '.' && segment !== '..');
    const nonAsciiSegments = segments.map((segment) => {
      try { return decodeURIComponent(segment); } catch { return segment; }
    }).filter((segment) => /[^\x00-\x7f]/.test(segment));
    if (!nonAsciiSegments.length || !nonAsciiSegments.every((segment) => pathNameMap[segment])) return false;
    return pathname.includes('/') || /\.[a-z\d]{1,8}$/i.test(pathname);
  };
  const rewrite = (_, before, value, after) => before + rewriteReference(value) + after;
  out = out
    .replace(/((?:href|src|poster|data-src)\s*=\s*["'])([^"']+)(["'])/gi,
      rewrite)
    .replace(/(url\(\s*["']?)([^"')]+)(["']?\s*\))/gi,
      rewrite)
    .replace(/((?:fetch|import)\s*\(\s*["'])([^"']+)(["'])/gi,
      rewrite)
    .replace(/((?:href|src|url|path|pathname|poster|file|filename|download|image|img|icon|thumbnail|background)\s*:\s*["'])([^"']+)(["'])/gi,
      rewrite)
    .replace(/(!?\[[^\]]*\]\()([^\s)]+)(\))/g, rewrite)
    .replace(/(["'])([^"'\r\n]+)(["'])/g, (match, before, value, after) => (
      isMappedPathReference(value) ? before + rewriteReference(value) + after : match
    ));
  return out;
}

async function rewriteProjectText() {
  let changed = 0;
  for (const file of await walk(ROOT)) {
    if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    if (GENERATED_TEXT_FILES.has(posix(path.relative(ROOT, file)))) continue;
    const original = await fs.readFile(file, 'utf8');
    const rewritten = rewriteText(original);
    if (rewritten === original) continue;
    changed++;
    console.log(`${APPLY ? 'rewrite' : '[dry] rewrite'} ${posix(path.relative(ROOT, file))}`);
    if (APPLY) await fs.writeFile(file, rewritten, 'utf8');
  }
  return changed;
}

async function renameRoutes() {
  for (const { section, subsection, from, to } of ROUTE_MIGRATIONS) {
    const pageDir = path.join(ROOT, 'src/pages', section, subsection);
    const legacyDir = path.join(ROOT, 'src/legacy', section, subsection);
    const itemDir = path.join(ROOT, 'src/content/items');
    await renameSibling(path.join(pageDir, `${from}.astro`), path.join(pageDir, `${to}.astro`));
    await renameSibling(path.join(legacyDir, from), path.join(legacyDir, to));
    await renameSibling(
      path.join(itemDir, `${section}-${subsection}-${from}.md`),
      path.join(itemDir, `${section}-${subsection}-${to}.md`),
    );
  }
}

async function renamePublicEntries() {
  const entries = (await walk(publicRoot, true))
    .filter((entry) => /[^\x00-\x7f]/.test(path.basename(entry)))
    .sort((a, b) => b.split(path.sep).length - a.split(path.sep).length);
  for (const source of entries) {
    const targetName = englishPathNameFor(path.basename(source));
    await renameSibling(source, path.join(path.dirname(source), targetName));
  }
}

function legacyRedirects() {
  return Object.fromEntries(ROUTE_MIGRATIONS
    .map(({ section, subsection, from, to }) => [
      `/${section}/${subsection}/${from}/`,
      `/${section}/${subsection}/${to}/`,
    ])
    .sort(([a], [b]) => a.localeCompare(b, 'zh-CN')));
}

function migrationMarkdown() {
  const lines = [
    '# URL slug migration',
    '',
    '页面标题与正文继续使用中文；公开 URL 和文件路径统一使用有语义的 ASCII 英文 slug。',
    '',
    '## Page routes',
    '',
    '| 旧路径 | 新路径 |',
    '| --- | --- |',
    ...Object.entries(legacyRedirects()).map(([from, to]) => `| \`${from}\` | \`${to}\` |`),
    '',
    '## Public path segments and files',
    '',
    '| 原名称 | 英文名称 |',
    '| --- | --- |',
    ...Object.entries(PUBLIC_PATH_NAMES)
      .sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))
      .map(([from, to]) => `| \`${from}\` | \`${to}\` |`),
    '',
    '## Maintenance',
    '',
    '- `scripts/url-slugs.mjs` 是唯一映射源。',
    '- `scripts/convert.mjs` 会复用页面 slug 映射。',
    '- `scripts/migrate.mjs` 会拒绝未登记的非 ASCII 资源名称，防止乱码 URL 回归。',
    '- 旧中文页面路径由 404 页读取 `src/data/legacy-route-redirects.json` 后兼容跳转。',
    '',
  ];
  return lines.join('\n');
}

async function writeGeneratedFiles() {
  const redirectFile = path.join(ROOT, 'src/data/legacy-route-redirects.json');
  const docsFile = path.join(ROOT, 'docs/url-slug-migration.md');
  console.log(`${APPLY ? 'write' : '[dry] write'} ${posix(path.relative(ROOT, redirectFile))}`);
  console.log(`${APPLY ? 'write' : '[dry] write'} ${posix(path.relative(ROOT, docsFile))}`);
  if (!APPLY) return;
  await fs.mkdir(path.dirname(redirectFile), { recursive: true });
  await fs.writeFile(redirectFile, `${JSON.stringify(legacyRedirects(), null, 2)}\n`, 'utf8');
  await fs.writeFile(docsFile, migrationMarkdown(), 'utf8');
}

async function unicodePaths() {
  const roots = ['src/pages', 'src/legacy', 'src/content/items', 'public'];
  const found = [];
  for (const relativeRoot of roots) {
    const base = path.join(ROOT, relativeRoot);
    for (const entry of await walk(base, true)) {
      const relative = posix(path.relative(ROOT, entry));
      if (/[^\x00-\x7f]/.test(relative)) found.push(relative);
    }
  }
  return found;
}

console.log(APPLY ? 'Applying URL slug migration...' : 'Previewing URL slug migration...');
const rewritten = await rewriteProjectText();
await renameRoutes();
await renamePublicEntries();
await writeGeneratedFiles();

if (APPLY) {
  const leftovers = await unicodePaths();
  if (leftovers.length) {
    console.error('\nNon-ASCII URL-facing paths remain:');
    for (const leftover of leftovers) console.error(`  - ${leftover}`);
    process.exitCode = 1;
  } else {
    console.log(`\nDone. Rewrote ${rewritten} text files; no non-ASCII URL-facing paths remain.`);
  }
} else {
  console.log(`\nPreview complete. ${rewritten} text files would be rewritten; rerun with --apply.`);
}
