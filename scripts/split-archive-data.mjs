#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const [sourceArg, bodyArg, outputArg, publicBaseArg] = process.argv.slice(2);
if (!sourceArg || !bodyArg || !outputArg || !publicBaseArg) {
  console.error('Usage: node scripts/split-archive-data.mjs <source.html> <body.html> <output-dir> <public-base>');
  process.exit(1);
}

const sourcePath = path.resolve(sourceArg);
const bodyPath = path.resolve(bodyArg);
const outputDir = path.resolve(outputArg);
const publicBase = `/${publicBaseArg.replace(/^\/+|\/+$/g, '')}`;
const maxChunkBytes = 12 * 1024 * 1024;

const source = await fs.readFile(sourcePath, 'utf8');
const body = await fs.readFile(bodyPath, 'utf8');
const dataMatch = source.match(/<script id="archive-data" type="application\/json">([\s\S]*?)<\/script>/);
if (!dataMatch) throw new Error('Could not find #archive-data in the source HTML.');

const archive = JSON.parse(dataMatch[1]);
const groups = [];
let current = [];
let currentBytes = Buffer.byteLength('{"entries":[]}');

for (const entry of archive.entries) {
  const entryBytes = Buffer.byteLength(JSON.stringify(entry)) + (current.length ? 1 : 0);
  if (current.length && currentBytes + entryBytes > maxChunkBytes) {
    groups.push(current);
    current = [];
    currentBytes = Buffer.byteLength('{"entries":[]}');
  }
  current.push(entry);
  currentBytes += entryBytes;
}
if (current.length) groups.push(current);

await fs.mkdir(outputDir, { recursive: true });
for (const name of await fs.readdir(outputDir)) {
  if (/^archive-\d+\.json$/.test(name)) await fs.rm(path.join(outputDir, name));
}

const chunks = [];
for (const [index, entries] of groups.entries()) {
  const name = `archive-${String(index + 1).padStart(2, '0')}.json`;
  const payload = JSON.stringify({ entries });
  await fs.writeFile(path.join(outputDir, name), payload, 'utf8');
  chunks.push(`${publicBase}/${name}`);
}

const { entries: _entries, ...metadata } = archive;
const manifest = { ...metadata, chunks };
await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest), 'utf8');

const bootstrap = `<script id="archive-data" type="application/json">${JSON.stringify({ manifest: `${publicBase}/manifest.json` })}</script>`;
let nextBody = body.replace(/<script id="archive-data" type="application\/json">[\s\S]*?<\/script>/, bootstrap);
const initPattern = /\(\(\) => \{\s*'use strict';\s*const archive = JSON\.parse\(document\.getElementById\('archive-data'\)\.textContent\);\s*const entries = archive\.entries;/;
const initReplacement = `(async () => {
  'use strict';
  const bootstrap = JSON.parse(document.getElementById('archive-data').textContent);
  let archive;
  try {
    const manifest = await fetch(bootstrap.manifest).then(response => {
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return response.json();
    });
    const parts = await Promise.all(manifest.chunks.map(url => fetch(url).then(response => {
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return response.json();
    })));
    archive = { ...manifest, entries: parts.flatMap(part => part.entries) };
  } catch (error) {
    console.error('Claude archive load failed', error);
    const summary = document.getElementById('archive-summary');
    if (summary) summary.textContent = '归档数据加载失败，请刷新页面后重试';
    return;
  }
  const entries = archive.entries;`;

if (!initPattern.test(nextBody)) throw new Error('Could not find the archive initialiser in body.html.');
nextBody = nextBody.replace(initPattern, initReplacement);
await fs.writeFile(bodyPath, nextBody, 'utf8');

const sizes = await Promise.all(chunks.map(async url => {
  const name = path.basename(url);
  return { name, bytes: (await fs.stat(path.join(outputDir, name))).size };
}));
console.log(JSON.stringify({ entries: archive.entries.length, chunks: sizes }, null, 2));
