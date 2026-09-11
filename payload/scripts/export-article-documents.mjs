import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import JSZip from 'jszip';
import { chromium } from 'playwright-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const CANONICAL_ORIGIN = 'https://cavno.org';
const EXPORTER_VERSION = 1;

const args = process.argv.slice(2);
const valueAfter = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const requestedRoute = valueAfter('--route');
const forcedBrowserPath = valueAfter('--browser-path');

const normalizeRoute = (value) => {
  if (!value) return undefined;
  const withLeading = value.startsWith('/') ? value : `/${value}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
};

const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

async function walkHtml(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(full));
    else if (entry.isFile() && entry.name === 'index.html') files.push(full);
  }
  return files;
}

async function discoverArticleRoutes() {
  const routes = [];
  for (const file of await walkHtml(DIST)) {
    const html = await readFile(file, 'utf8');
    const match = html.match(/data-cv-export-route="([^"]+)"/);
    if (match) routes.push(normalizeRoute(match[1]));
  }
  return [...new Set(routes)].sort();
}

function safeRouteDirectory(root, route) {
  const segments = route.split('/').filter(Boolean);
  if (!segments.length || segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`Unsafe article route: ${route}`);
  }
  const output = path.resolve(root, ...segments, 'downloads');
  const rootResolved = path.resolve(root) + path.sep;
  if (!output.startsWith(rootResolved)) throw new Error(`Output escaped root: ${output}`);
  return output;
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function findBrowser() {
  const candidates = [
    forcedBrowserPath,
    process.env.CAVNO_CHROMIUM_PATH,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.platform === 'win32' ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' : undefined,
    process.platform === 'win32' ? 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe' : undefined,
    process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined,
    process.platform === 'win32' ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : undefined,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ].filter(Boolean);
  for (const candidate of candidates) if (await exists(candidate)) return candidate;
  throw new Error('未找到 Chromium 浏览器。请安装 Edge/Chrome，或使用 --browser-path 指定可执行文件。');
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.md': 'text/markdown; charset=utf-8',
  })[ext] ?? 'application/octet-stream';
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      let file = path.resolve(DIST, `.${pathname}`);
      const root = path.resolve(DIST) + path.sep;
      if (!file.startsWith(root)) throw new Error('Path traversal');
      const info = await stat(file);
      if (info.isDirectory()) file = path.join(file, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': mimeFor(file), 'Cache-Control': 'no-store' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 17mm 16mm 19mm; }
  html, body { width: auto !important; min-width: 0 !important; height: auto !important; overflow: visible !important; }
  body { padding-top: 0 !important; background: #fff !important; color: #181714 !important; }
  .cv-site-head, .cv-site-foot, .cv-article-actions-row, [data-export-ignore], nav, aside,
  button, form, input, select, textarea, .controls, .mobile-toc { display: none !important; }
  #cvMain, #cvMain > *, #cvMain article, #cvMain main, #cvMain .page, #cvMain .wrap,
  #cvMain .shell, #cvMain .content { width: auto !important; max-width: none !important; min-width: 0 !important;
    height: auto !important; max-height: none !important; overflow: visible !important; }
  #cvMain * { animation: none !important; transition: none !important; }
  #cvMain :is(.reveal,.fade-in,.animate-on-scroll,[data-reveal]) {
    opacity: 1 !important; visibility: visible !important; transform: none !important;
  }
  #cvMain :is(h1,h2,h3,h4,h5,h6) { break-after: avoid-page; page-break-after: avoid; }
  #cvMain :is(pre,blockquote,figure,table,.card) { break-inside: avoid-page; page-break-inside: avoid; }
  #cvMain img, #cvMain svg, #cvMain canvas { max-width: 100% !important; height: auto !important; }
  #cvMain a { color: inherit !important; text-decoration: none !important; }
}
`;

async function settlePage(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(async () => {
    document.querySelectorAll('details').forEach((details) => { details.open = true; });
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let top = 0; top < height; top += 700) {
      window.scrollTo(0, top);
      await new Promise((resolve) => setTimeout(resolve, 18));
    }
    window.scrollTo(0, 0);
    if (document.fonts?.ready) await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  });
}

async function preserveLargeVisuals(page, route, slug, publicDirectory, distDirectory, localOrigin) {
  const ids = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('#cvMain svg, #cvMain canvas, #cvMain .diagram, #cvMain .flow, #cvMain .flowchart, #cvMain .timeline, #cvMain .matrix, #cvMain .chart, #cvMain .tree, #cvMain .network, #cvMain .web-svg-wrap, #cvMain .triptych')];
    let index = 0;
    const ids = [];
    const selected = [];
    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const excluded = node.closest('button, nav, aside, [data-export-ignore], [aria-hidden="true"]');
      const meaningfulSize = rect.width >= 220 && rect.height >= 90 && rect.height <= 1400 && rect.width * rect.height >= 26000;
      if (excluded || style.display === 'none' || style.visibility === 'hidden' || !meaningfulSize) continue;
      if (selected.some((parent) => parent.contains(node))) continue;
      const id = `cv-export-visual-${String(++index).padStart(3, '0')}`;
      node.setAttribute('data-cv-export-visual', id);
      selected.push(node);
      ids.push(id);
    }
    return ids;
  });

  const assetsPublic = path.join(publicDirectory, 'assets');
  const assetsDist = path.join(distDirectory, 'assets');
  if (ids.length) {
    await mkdir(assetsPublic, { recursive: true });
    await mkdir(assetsDist, { recursive: true });
  }

  let kept = 0;
  for (const id of ids) {
    const locator = page.locator(`[data-cv-export-visual="${id}"]`);
    try {
      const fileName = `${slug}-visual-${String(++kept).padStart(3, '0')}.png`;
      const buffer = await locator.screenshot({ type: 'png' });
      await Promise.all([
        writeFile(path.join(assetsPublic, fileName), buffer),
        writeFile(path.join(assetsDist, fileName), buffer),
      ]);
      const publicPath = `${route}downloads/assets/${fileName}`;
      await locator.evaluate((node, { src, alt }) => {
        const image = document.createElement('img');
        image.src = src;
        image.alt = alt;
        image.setAttribute('data-export-generated', 'true');
        image.width = Math.max(1, Math.round(node.getBoundingClientRect().width));
        image.height = Math.max(1, Math.round(node.getBoundingClientRect().height));
        node.replaceWith(image);
      }, { src: `${localOrigin}${publicPath}`, alt: `文章图示 ${kept}` });
    } catch (error) {
      console.warn(`  ! 图示 ${id} 未能快照：${error.message}`);
    }
  }
  return kept;
}

async function extractArticleModel(page) {
  return page.locator('#cvMain').evaluate((root) => {
    const actions = document.querySelector('[data-cv-export-route]');
    const meta = {
      route: actions?.getAttribute('data-cv-export-route') ?? location.pathname,
      title: actions?.getAttribute('data-cv-export-title') ?? document.title.replace(/\s*·\s*Cavno\s*$/, ''),
      summary: actions?.getAttribute('data-cv-export-summary') ?? '',
      date: actions?.getAttribute('data-cv-export-date') ?? '',
      tags: (() => { try { return JSON.parse(actions?.getAttribute('data-cv-export-tags') ?? '[]'); } catch { return []; } })(),
    };
    const ignored = 'script,style,noscript,template,nav,aside,form,button,input,select,textarea,[hidden],[aria-hidden="true"],[data-export-ignore]';
    const inlineTags = new Set(['A','ABBR','B','BDI','BDO','CITE','CODE','DEL','EM','I','INS','KBD','MARK','Q','S','SAMP','SMALL','SPAN','STRONG','SUB','SUP','TIME','U','VAR','WBR','BR']);
    const cleanText = (text) => text.replaceAll('\u00a0', ' ').replace(/[\t\r\n ]+/g, ' ');
    const visible = (element) => {
      if (!(element instanceof Element) || element.matches(ignored)) return false;
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    };

    const inline = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = cleanText(node.textContent ?? '');
        return text ? [{ type: 'text', text }] : [];
      }
      if (!(node instanceof Element) || !visible(node)) return [];
      if (node.tagName === 'BR') return [{ type: 'break' }];
      if (node.tagName === 'IMG') {
        const alt = node.getAttribute('alt') || '图片';
        return [{ type: 'text', text: `[${alt}]` }];
      }
      const children = [...node.childNodes].flatMap(inline);
      if (!children.length) return [];
      const map = {
        A: 'link', B: 'strong', STRONG: 'strong', EM: 'emphasis', I: 'emphasis',
        CODE: 'code', KBD: 'code', DEL: 'strike', S: 'strike', SUB: 'subscript', SUP: 'superscript',
      };
      const type = map[node.tagName];
      if (!type) return children;
      return [{ type, href: type === 'link' ? node.href : undefined, children }];
    };
    const hasInlineText = (nodes) => nodes.some((node) => node.type === 'break' || node.text?.trim() || node.children?.length);

    const imageBlock = (element) => ({
      type: 'image',
      src: element.currentSrc || element.src,
      alt: element.getAttribute('alt') || '文章图片',
      width: element.naturalWidth || element.width || 720,
      height: element.naturalHeight || element.height || 420,
    });

    const blocksFromContainer = (element) => {
      const blocks = [];
      let pending = [];
      const flush = () => {
        if (hasInlineText(pending)) blocks.push({ type: 'paragraph', inlines: pending });
        pending = [];
      };
      for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          pending.push(...inline(child));
          continue;
        }
        if (!(child instanceof Element) || !visible(child)) continue;
        if (inlineTags.has(child.tagName)) {
          pending.push(...inline(child));
          continue;
        }
        flush();
        blocks.push(...block(child));
      }
      flush();
      return blocks;
    };

    const block = (element) => {
      if (!visible(element)) return [];
      const tag = element.tagName;
      if (/^H[1-6]$/.test(tag)) {
        const inlines = [...element.childNodes].flatMap(inline);
        return hasInlineText(inlines) ? [{ type: 'heading', level: Number(tag[1]), inlines }] : [];
      }
      if (tag === 'P') {
        const inlines = [...element.childNodes].flatMap(inline);
        return hasInlineText(inlines) ? [{ type: 'paragraph', inlines }] : [];
      }
      if (tag === 'PRE') {
        const code = element.querySelector('code');
        const className = code?.className || element.className || '';
        const language = className.match(/(?:language-|lang-)([\w+-]+)/)?.[1] ?? '';
        return [{ type: 'codeBlock', language, text: (code ?? element).textContent ?? '' }];
      }
      if (tag === 'UL' || tag === 'OL') {
        const items = [...element.children]
          .filter((child) => child.tagName === 'LI')
          .map((item) => {
            const itemBlocks = blocksFromContainer(item);
            if (itemBlocks.length) return itemBlocks;
            const inlines = [...item.childNodes].flatMap(inline);
            return hasInlineText(inlines) ? [{ type: 'paragraph', inlines }] : [];
          })
          .filter((item) => item.length);
        return items.length ? [{ type: 'list', ordered: tag === 'OL', items }] : [];
      }
      if (tag === 'BLOCKQUOTE') {
        const blocks = blocksFromContainer(element);
        return blocks.length ? [{ type: 'quote', blocks }] : [];
      }
      if (tag === 'TABLE') {
        const rows = [...element.rows].map((row) => [...row.cells].map((cell) => ({
          text: cleanText(cell.innerText).trim(),
          header: cell.tagName === 'TH' || Boolean(cell.closest('thead')),
        })));
        return rows.length ? [{ type: 'table', rows }] : [];
      }
      if (tag === 'IMG') return [imageBlock(element)];
      if (tag === 'FIGCAPTION') {
        const inlines = [...element.childNodes].flatMap(inline);
        return hasInlineText(inlines) ? [{ type: 'caption', inlines }] : [];
      }
      if (tag === 'HR') return [{ type: 'thematicBreak' }];
      if (tag === 'DT') {
        const inlines = [...element.childNodes].flatMap(inline);
        return hasInlineText(inlines) ? [{ type: 'heading', level: 4, inlines }] : [];
      }
      if (tag === 'DD') {
        const inlines = [...element.childNodes].flatMap(inline);
        return hasInlineText(inlines) ? [{ type: 'paragraph', inlines }] : [];
      }
      if (tag === 'SVG' || tag === 'CANVAS') return [{ type: 'paragraph', inlines: [{ type: 'text', text: '[交互图示请查看网页原文]' }] }];
      return blocksFromContainer(element);
    };

    return { meta, blocks: blocksFromContainer(root) };
  });
}

const markdownEscapes = /([\\`*_[\]<>])/g;
const escapeMarkdownText = (value) => value.replace(markdownEscapes, '\\$1');
const inlinePlainText = (nodes = []) => nodes.map((node) => node.text ?? (node.type === 'break' ? '\n' : inlinePlainText(node.children))).join('');

function markdownInline(nodes = []) {
  return nodes.map((node) => {
    if (node.type === 'text') return escapeMarkdownText(node.text);
    if (node.type === 'break') return '  \n';
    const content = markdownInline(node.children ?? []);
    if (node.type === 'strong') return `**${content}**`;
    if (node.type === 'emphasis') return `*${content}*`;
    if (node.type === 'strike') return `~~${content}~~`;
    if (node.type === 'code') {
      const plain = inlinePlainText(node.children ?? []);
      const longest = Math.max(0, ...[...plain.matchAll(/`+/g)].map((match) => match[0].length));
      const fence = '`'.repeat(longest + 1);
      return `${fence}${plain}${fence}`;
    }
    if (node.type === 'link') return `[${content}](${encodeURI(node.href ?? '')})`;
    if (node.type === 'superscript' || node.type === 'subscript') return content;
    return content;
  }).join('').trim();
}

function markdownBlock(block, depth = 0) {
  if (block.type === 'heading') return `${'#'.repeat(Math.min(6, Math.max(1, block.level)))} ${markdownInline(block.inlines)}`;
  if (block.type === 'paragraph') return markdownInline(block.inlines);
  if (block.type === 'caption') return `*${markdownInline(block.inlines)}*`;
  if (block.type === 'thematicBreak') return '---';
  if (block.type === 'image') return `![${escapeMarkdownText(block.alt)}](${encodeURI(block.src)})`;
  if (block.type === 'codeBlock') {
    const longest = Math.max(0, ...[...block.text.matchAll(/`+/g)].map((match) => match[0].length));
    const fence = '`'.repeat(Math.max(3, longest + 1));
    return `${fence}${block.language ?? ''}\n${block.text.replace(/\s+$/, '')}\n${fence}`;
  }
  if (block.type === 'quote') {
    return block.blocks.map((child) => markdownBlock(child, depth)).join('\n\n').split('\n').map((line) => `> ${line}`.trimEnd()).join('\n');
  }
  if (block.type === 'list') {
    return block.items.map((item, index) => {
      const prefix = block.ordered ? `${index + 1}. ` : '- ';
      const content = item.map((child) => markdownBlock(child, depth + 1)).join('\n\n').split('\n');
      return content.map((line, lineIndex) => `${lineIndex ? ' '.repeat(prefix.length) : prefix}${line}`).join('\n');
    }).join('\n');
  }
  if (block.type === 'table') {
    const width = Math.max(...block.rows.map((row) => row.length));
    const cell = (value = '') => value.replaceAll('|', '\\|').replace(/\s*\n\s*/g, '<br>');
    const rows = block.rows.map((row) => [...row, ...Array(Math.max(0, width - row.length)).fill({ text: '' })]);
    const header = rows[0] ?? [];
    const lines = [
      `| ${header.map((item) => cell(item.text)).join(' | ')} |`,
      `| ${Array(width).fill('---').join(' | ')} |`,
      ...rows.slice(1).map((row) => `| ${row.map((item) => cell(item.text)).join(' | ')} |`),
    ];
    return lines.join('\n');
  }
  return '';
}

function renderMarkdown(model) {
  const blocks = [...model.blocks];
  const hasTitle = blocks.some((block) => block.type === 'heading' && block.level === 1);
  if (!hasTitle) blocks.unshift({ type: 'heading', level: 1, inlines: [{ type: 'text', text: model.meta.title }] });
  const content = blocks.map((block) => markdownBlock(block)).filter(Boolean).join('\n\n').replace(/\n{4,}/g, '\n\n\n');
  const source = `${CANONICAL_ORIGIN}${model.meta.route}`;
  return `${content}\n\n---\n\n来源：[${source}](${source})\n`;
}

const DOC_FONT = { ascii: 'Aptos', hAnsi: 'Aptos', eastAsia: 'Microsoft YaHei', cs: 'Aptos' };
const CODE_FONT = { ascii: 'Consolas', hAnsi: 'Consolas', eastAsia: 'Microsoft YaHei', cs: 'Consolas' };
function docxInline(nodes = [], inherited = {}) {
  const children = [];
  for (const node of nodes) {
    if (node.type === 'break') {
      children.push(new TextRun({ break: 1, font: DOC_FONT }));
      continue;
    }
    const nextStyle = {
      ...inherited,
      bold: inherited.bold || node.type === 'strong',
      italics: inherited.italics || node.type === 'emphasis',
      strike: inherited.strike || node.type === 'strike',
      superScript: inherited.superScript || node.type === 'superscript',
      subScript: inherited.subScript || node.type === 'subscript',
      code: inherited.code || node.type === 'code',
    };
    if (node.type === 'text') {
      children.push(new TextRun({
        text: node.text,
        font: nextStyle.code ? CODE_FONT : DOC_FONT,
        bold: nextStyle.bold,
        italics: nextStyle.italics,
        strike: nextStyle.strike,
        superScript: nextStyle.superScript,
        subScript: nextStyle.subScript,
        color: nextStyle.color,
        underline: nextStyle.underline,
        shading: nextStyle.code ? { type: ShadingType.CLEAR, fill: 'F0EEE6', color: 'auto' } : undefined,
      }));
      continue;
    }
    if (node.type === 'link') {
      const linkRuns = docxInline(node.children ?? [], { ...nextStyle, color: '2F6688', underline: {} });
      children.push(new ExternalHyperlink({ children: linkRuns, link: node.href || CANONICAL_ORIGIN }));
      continue;
    }
    children.push(...docxInline(node.children ?? [], nextStyle));
  }
  return children;
}

async function imageParagraph(block) {
  try {
    const response = await fetch(block.src);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const mime = (response.headers.get('content-type') ?? '').split(';')[0].toLowerCase();
    const type = ({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/bmp': 'bmp' })[mime];
    if (!type) throw new Error(`unsupported image type ${mime || 'unknown'}`);
    const data = Buffer.from(await response.arrayBuffer());
    const ratio = Math.min(1, 560 / Math.max(1, block.width), 680 / Math.max(1, block.height));
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
      children: [new ImageRun({
        data,
        type,
        transformation: {
          width: Math.max(40, Math.round(block.width * ratio)),
          height: Math.max(28, Math.round(block.height * ratio)),
        },
        altText: { title: block.alt, description: block.alt, name: block.alt },
      })],
    });
  } catch {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [new TextRun({ text: `[图片：${block.alt}]`, italics: true, color: '6D6A63', font: DOC_FONT })],
    });
  }
}

async function docxBlocks(blocks, listLevel = 0) {
  const children = [];
  for (const block of blocks) {
    if (block.type === 'heading') {
      const heading = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6][Math.min(5, Math.max(0, block.level - 1))];
      children.push(new Paragraph({ heading, children: docxInline(block.inlines), keepNext: true }));
    } else if (block.type === 'paragraph' || block.type === 'caption') {
      children.push(new Paragraph({
        children: docxInline(block.inlines),
        alignment: block.type === 'caption' ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
        spacing: { after: block.type === 'caption' ? 160 : 140, line: 360 },
        style: block.type === 'caption' ? 'CavnoCaption' : undefined,
      }));
    } else if (block.type === 'thematicBreak') {
      children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D8D4C8' } }, spacing: { before: 120, after: 180 } }));
    } else if (block.type === 'codeBlock') {
      const lines = block.text.replace(/\s+$/, '').split('\n');
      children.push(new Paragraph({
        style: 'CavnoCode',
        children: lines.map((line, index) => new TextRun({ text: line || ' ', ...(index ? { break: 1 } : {}), font: CODE_FONT })),
      }));
    } else if (block.type === 'quote') {
      for (const quoteBlock of block.blocks) {
        if (quoteBlock.inlines) {
          children.push(new Paragraph({
            children: docxInline(quoteBlock.inlines, { italics: true, color: '4F4C46' }),
            indent: { left: 480, right: 220 },
            border: { left: { style: BorderStyle.SINGLE, size: 16, color: 'D97757', space: 12 } },
            spacing: { before: 80, after: 140, line: 340 },
          }));
        } else {
          children.push(...await docxBlocks([quoteBlock], listLevel));
        }
      }
    } else if (block.type === 'list') {
      for (const item of block.items) {
        const first = item[0];
        const firstRuns = first?.inlines ? docxInline(first.inlines) : [new TextRun({ text: inlinePlainText(first?.inlines ?? []), font: DOC_FONT })];
        children.push(new Paragraph({
          children: firstRuns,
          numbering: { reference: block.ordered ? 'cavno-numbering' : 'cavno-bullets', level: Math.min(3, listLevel) },
          spacing: { after: 80, line: 340 },
        }));
        if (item.length > 1) children.push(...await docxBlocks(item.slice(1), listLevel + 1));
      }
    } else if (block.type === 'table') {
      const columnCount = Math.max(1, ...block.rows.map((row) => row.length));
      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: block.rows.map((row, rowIndex) => new TableRow({
          tableHeader: rowIndex === 0,
          children: [...row, ...Array(Math.max(0, columnCount - row.length)).fill({ text: '', header: false })].map((cell) => new TableCell({
            width: { size: Math.floor(100 / columnCount), type: WidthType.PERCENTAGE },
            shading: (rowIndex === 0 || cell.header) ? { type: ShadingType.CLEAR, fill: 'F0EEE6', color: 'auto' } : undefined,
            margins: { top: 90, right: 110, bottom: 90, left: 110 },
            children: [new Paragraph({ children: [new TextRun({ text: cell.text, bold: rowIndex === 0 || cell.header, font: DOC_FONT, size: 19 })] })],
          })),
        })),
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: 'CFCBBE' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CFCBBE' },
          left: { style: BorderStyle.SINGLE, size: 4, color: 'CFCBBE' },
          right: { style: BorderStyle.SINGLE, size: 4, color: 'CFCBBE' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'DEDACF' },
          insideVertical: { style: BorderStyle.SINGLE, size: 2, color: 'DEDACF' },
        },
      }));
      children.push(new Paragraph({ spacing: { after: 140 } }));
    } else if (block.type === 'image') {
      children.push(await imageParagraph(block));
    }
  }
  return children;
}

async function renderDocx(model) {
  const blocks = [...model.blocks];
  if (!blocks.some((block) => block.type === 'heading' && block.level === 1)) {
    blocks.unshift({ type: 'heading', level: 1, inlines: [{ type: 'text', text: model.meta.title }] });
  }
  const children = await docxBlocks(blocks);
  const source = `${CANONICAL_ORIGIN}${model.meta.route}`;
  children.push(new Paragraph({
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'D8D4C8', space: 10 } },
    spacing: { before: 260, after: 80 },
    children: [new TextRun({ text: '来源：', bold: true, font: DOC_FONT, size: 18 }), new ExternalHyperlink({
      link: source,
      children: [new TextRun({ text: source, color: '2F6688', underline: {}, font: DOC_FONT, size: 18 })],
    })],
  }));

  const document = new Document({
    creator: 'Cavno',
    title: model.meta.title,
    subject: model.meta.summary,
    description: model.meta.summary,
    keywords: model.meta.tags?.join(', ') ?? '',
    styles: {
      default: {
        document: { run: { font: DOC_FONT, size: 22, color: '25231F' }, paragraph: { spacing: { after: 140, line: 360 } } },
        heading1: { run: { font: DOC_FONT, size: 34, bold: true, color: '171612' }, paragraph: { spacing: { before: 260, after: 180 }, keepNext: true } },
        heading2: { run: { font: DOC_FONT, size: 29, bold: true, color: '26231E' }, paragraph: { spacing: { before: 240, after: 140 }, keepNext: true } },
        heading3: { run: { font: DOC_FONT, size: 25, bold: true, color: '342F28' }, paragraph: { spacing: { before: 200, after: 110 }, keepNext: true } },
      },
      paragraphStyles: [
        { id: 'CavnoCode', name: 'Cavno Code', basedOn: 'Normal', run: { font: CODE_FONT, size: 18, color: '2C2A26' }, paragraph: { shading: { type: ShadingType.CLEAR, fill: 'F3F1EA', color: 'auto' }, spacing: { before: 100, after: 160, line: 300 }, indent: { left: 220, right: 220 } } },
        { id: 'CavnoCaption', name: 'Cavno Caption', basedOn: 'Normal', run: { font: DOC_FONT, size: 18, italics: true, color: '6D6A63' }, paragraph: { spacing: { after: 160 } } },
      ],
    },
    numbering: {
      config: [
        { reference: 'cavno-bullets', levels: [0,1,2,3].map((level) => ({ level, format: LevelFormat.BULLET, text: ['•','◦','▪','–'][level], alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 620 + level * 360, hanging: 300 } } } })) },
        { reference: 'cavno-numbering', levels: [0,1,2,3].map((level) => ({ level, format: LevelFormat.DECIMAL, text: `%${level + 1}.`, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 680 + level * 360, hanging: 360 } } } })) },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1021, bottom: 1191, left: 1021, header: 454, footer: 454 } } },
      footers: { default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: `${model.meta.title}  ·  `, color: '89857C', size: 16, font: DOC_FONT }), new TextRun({ children: [PageNumber.CURRENT], color: '89857C', size: 16, font: DOC_FONT })],
      })] }) },
      children,
    }],
  });
  return Packer.toBuffer(document);
}

async function validateArtifacts(markdown, pdf, docx, title) {
  const decoded = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(markdown, 'utf8'));
  if (!decoded.trim() || decoded.includes('\uFFFD') || !/^#\s+/m.test(decoded)) throw new Error('Markdown UTF-8/结构校验失败');
  if (pdf.length < 5000 || pdf.subarray(0, 5).toString('ascii') !== '%PDF-') throw new Error('PDF 文件签名或体积校验失败');
  const zip = await JSZip.loadAsync(docx);
  const documentXml = await zip.file('word/document.xml')?.async('string');
  if (!zip.file('[Content_Types].xml') || !documentXml || documentXml.includes('\uFFFD')) throw new Error('DOCX OOXML 校验失败');
  if (!documentXml.includes(escapeHtml(title).replaceAll('&quot;', '"')) && !documentXml.includes(title)) {
    throw new Error('DOCX 未包含文章标题');
  }
}

async function writeBoth(publicDirectory, distDirectory, name, data) {
  await Promise.all([
    writeFile(path.join(publicDirectory, name), data),
    writeFile(path.join(distDirectory, name), data),
  ]);
}

function useCanonicalImageUrls(model, localOrigin) {
  const copy = structuredClone(model);
  const visit = (blocks) => {
    for (const block of blocks) {
      if (block.type === 'image' && block.src?.startsWith(localOrigin)) {
        block.src = `${CANONICAL_ORIGIN}${block.src.slice(localOrigin.length)}`;
      }
      if (block.blocks) visit(block.blocks);
      if (block.items) block.items.forEach(visit);
    }
  };
  visit(copy.blocks);
  return copy;
}

async function exportRoute(browser, localOrigin, route) {
  const slug = route.split('/').filter(Boolean).at(-1);
  const publicDirectory = safeRouteDirectory(PUBLIC, route);
  const distDirectory = safeRouteDirectory(DIST, route);
  await Promise.all([mkdir(publicDirectory, { recursive: true }), mkdir(distDirectory, { recursive: true })]);

  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`${localOrigin}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settlePage(page);
  const marker = page.locator('[data-cv-export-route]');
  if (await marker.count() !== 1) throw new Error(`文章标记缺失或重复：${route}`);
  const title = await marker.getAttribute('data-cv-export-title');
  await page.evaluate((value) => { document.title = value; }, title);
  await page.addStyleTag({ content: PRINT_CSS });
  await page.emulateMedia({ media: 'print' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="box-sizing:border-box;width:100%;padding:0 16mm;color:#777;font:9px Arial,sans-serif;display:flex;justify-content:space-between"><span>${escapeHtml(title)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '17mm', right: '0', bottom: '19mm', left: '0' },
    tagged: true,
    outline: true,
  });
  await page.emulateMedia({ media: 'screen' });

  const visualCount = await preserveLargeVisuals(page, route, slug, publicDirectory, distDirectory, localOrigin);
  const model = await extractArticleModel(page);
  const markdown = renderMarkdown(useCanonicalImageUrls(model, localOrigin));
  const docx = await renderDocx(model);
  await validateArtifacts(markdown, pdf, docx, title);

  await Promise.all([
    writeBoth(publicDirectory, distDirectory, `${slug}.md`, markdown),
    writeBoth(publicDirectory, distDirectory, `${slug}.pdf`, pdf),
    writeBoth(publicDirectory, distDirectory, `${slug}.docx`, docx),
  ]);
  const manifest = {
    version: EXPORTER_VERSION,
    title,
    route,
    source: `${CANONICAL_ORIGIN}${route}`,
    generatedAt: new Date().toISOString(),
    visuals: visualCount,
    files: {
      markdown: { name: `${slug}.md`, bytes: Buffer.byteLength(markdown), sha256: sha256(Buffer.from(markdown)) },
      pdf: { name: `${slug}.pdf`, bytes: pdf.length, sha256: sha256(pdf) },
      word: { name: `${slug}.docx`, bytes: docx.length, sha256: sha256(docx) },
    },
  };
  await writeBoth(publicDirectory, distDirectory, 'manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
  await page.close();
  return manifest;
}

async function main() {
  if (!await exists(DIST)) throw new Error('dist 不存在。请先运行 npm run build。');
  const target = normalizeRoute(requestedRoute);
  const routes = (await discoverArticleRoutes()).filter((route) => !target || route === target);
  if (!routes.length) throw new Error(target ? `未找到文章路由：${target}` : '未发现可导出的文章页');
  const browserPath = await findBrowser();
  const { server, origin } = await startStaticServer();
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  const results = [];
  try {
    console.log(`Cavno documents · ${routes.length} article(s) · ${path.basename(browserPath)}`);
    for (const [index, route] of routes.entries()) {
      process.stdout.write(`[${index + 1}/${routes.length}] ${route} `);
      const manifest = await exportRoute(browser, origin, route);
      results.push(manifest);
      console.log(`✓ MD ${manifest.files.markdown.bytes} B · PDF ${manifest.files.pdf.bytes} B · DOCX ${manifest.files.word.bytes} B`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  console.log(`完成：${results.length} 篇文章，${results.length * 3} 个下载文档。`);
}

main().catch((error) => {
  console.error(`\n导出失败：${error.stack || error.message}`);
  process.exitCode = 1;
});
