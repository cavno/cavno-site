#!/usr/bin/env node
/** Audit URL-facing filesystem paths and local reference values for non-ASCII. */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_PATH_NAMES, ROUTE_SLUGS } from './url-slugs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PATH_ROOTS = ['src/pages', 'src/legacy', 'src/content/items', 'public'];
const SCAN_ROOTS = ['src/pages', 'src/legacy', 'src/content', 'public'];
const TEXT_EXTENSIONS = new Set([
  '.astro', '.css', '.html', '.js', '.json', '.jsonc', '.md', '.mjs', '.svg',
  '.ts', '.txt', '.xml', '.yaml', '.yml',
]);
const SKIP_DIRS = new Set(['.git', 'dist', 'node_modules']);
const nonAscii = /[^\x00-\x7f]/;
const KNOWN_OLD_NAMES = new Set([...Object.keys(ROUTE_SLUGS), ...Object.keys(PUBLIC_PATH_NAMES)]);
const FILE_EXTENSIONS = new Set([
  'astro', 'css', 'csv', 'doc', 'docx', 'epub', 'gif', 'htm', 'html', 'ico',
  'jpeg', 'jpg', 'js', 'json', 'md', 'mjs', 'mov', 'mp3', 'mp4', 'pdf', 'png',
  'ppt', 'pptx', 'svg', 'ts', 'txt', 'webp', 'xls', 'xlsx', 'xml', 'yaml', 'yml',
]);
const posix = (value) => value.split(path.sep).join('/');

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

function decodedPathname(value) {
  const trimmed = value.trim();
  if (!trimmed || /^(?:#|data:|mailto:|tel:|javascript:)/i.test(trimmed)) return null;
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)) return null;
  const pathname = trimmed.split(/[?#]/, 1)[0];
  try { return decodeURIComponent(pathname); } catch { return pathname; }
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

function clearlyLocalPath(pathname) {
  const trimmed = pathname.trim();
  const extension = trimmed.match(/\.([a-z\d]{1,8})$/i)?.[1]?.toLowerCase();
  const segments = trimmed.split('/').filter((segment) => segment && segment !== '.' && segment !== '..');
  const nonAsciiSegments = segments.filter((segment) => nonAscii.test(segment));
  const allMapped = nonAsciiSegments.length > 0
    && nonAsciiSegments.every((segment) => KNOWN_OLD_NAMES.has(segment));
  return allMapped && (trimmed.includes('/') || (!/\s/.test(trimmed) && extension && FILE_EXTENSIONS.has(extension)));
}

function referenceMatches(text) {
  const found = [];
  const patterns = [
    [/(?:href|src|poster|data-src)\s*=\s*["']([^"']+)["']/gi, true],
    [/url\(\s*["']?([^"')]+)["']?\s*\)/gi, false],
    [/(?:fetch|import)\s*\(\s*["']([^"']+)["']/gi, true],
    [/\bfrom\s*["']([^"']+)["']/gi, true],
    [/(?:href|url|path|pathname|poster|file|filename|download|image|img|icon|thumbnail|background)\s*:\s*["']([^"']+)["']/gi, false],
    [/\bsrc\s*:\s*["']([^"']+)["']/gi, false],
    [/!?\[[^\]]*\]\(([^\s)]+)\)/g, false],
  ];
  for (const [pattern, definite] of patterns) {
    for (const match of text.matchAll(pattern)) found.push([match.index, match[1], definite]);
  }

  // Catch path-like quoted strings in arrays or less conventional object keys.
  for (const match of text.matchAll(/["']([^"'\r\n]+)["']/g)) {
    const value = match[1];
    const pathname = decodedPathname(value);
    if (!pathname || !nonAscii.test(pathname)) continue;
    if (clearlyLocalPath(pathname)) found.push([match.index, value, false]);
  }
  return found;
}

const problems = [];
for (const relativeRoot of PATH_ROOTS) {
  for (const entry of await walk(path.join(ROOT, relativeRoot), true)) {
    const relative = posix(path.relative(ROOT, entry));
    if (nonAscii.test(relative)) problems.push(`filesystem: ${relative}`);
  }
}

const seen = new Set();
for (const relativeRoot of SCAN_ROOTS) {
  for (const file of await walk(path.join(ROOT, relativeRoot))) {
    if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    const text = await fs.readFile(file, 'utf8');
    for (const [index, value, definite] of referenceMatches(text)) {
      const pathname = decodedPathname(value);
      if (!pathname || !nonAscii.test(pathname)) continue;
      if (!definite && !clearlyLocalPath(pathname)) continue;
      const relative = posix(path.relative(ROOT, file));
      const problem = `reference: ${relative}:${lineNumber(text, index)} -> ${JSON.stringify(value)}`;
      if (!seen.has(problem)) {
        seen.add(problem);
        problems.push(problem);
      }
    }
  }
}

if (problems.length) {
  console.error(`Found ${problems.length} non-ASCII URL path problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exitCode = 1;
} else {
  console.log('URL audit passed: all URL-facing paths and local references are ASCII.');
}
