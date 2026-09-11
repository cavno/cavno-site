import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');

const requested = (() => {
  const index = process.argv.indexOf('--route');
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  const route = value.startsWith('/') ? value : `/${value}`;
  return route.endsWith('/') ? route : `${route}/`;
})();

async function walkHtml(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(full));
    else if (entry.name === 'index.html') files.push(full);
  }
  return files;
}

async function routesFromBuild() {
  const routes = [];
  for (const file of await walkHtml(DIST)) {
    const html = await readFile(file, 'utf8');
    const match = html.match(/data-cv-export-route="([^"]+)"/);
    if (match) routes.push(match[1].endsWith('/') ? match[1] : `${match[1]}/`);
  }
  return [...new Set(routes)].sort().filter((route) => !requested || route === requested);
}

async function verifyRoute(route) {
  const segments = route.split('/').filter(Boolean);
  const slug = segments.at(-1);
  const directory = path.join(PUBLIC, ...segments, 'downloads');
  const [markdownBuffer, pdf, docx] = await Promise.all([
    readFile(path.join(directory, `${slug}.md`)),
    readFile(path.join(directory, `${slug}.pdf`)),
    readFile(path.join(directory, `${slug}.docx`)),
  ]);

  const markdown = new TextDecoder('utf-8', { fatal: true }).decode(markdownBuffer);
  if (markdown.includes('\uFFFD') || !/^#\s+\S/m.test(markdown) || !/\n来源：\[https:\/\/cavno\.org\//.test(markdown)) {
    throw new Error('Markdown 编码、标题或来源信息不合格');
  }
  const codeFences = markdown.match(/^`{3,}.*$/gm) ?? [];
  if (codeFences.length % 2 !== 0) throw new Error('Markdown 代码围栏未成对');

  if (pdf.length < 5000 || pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error('PDF 文件签名或体积不合格');
  }

  const zip = await JSZip.loadAsync(docx);
  const required = ['[Content_Types].xml', '_rels/.rels', 'word/document.xml', 'word/styles.xml'];
  for (const name of required) if (!zip.file(name)) throw new Error(`DOCX 缺少 ${name}`);
  const documentXml = await zip.file('word/document.xml').async('string');
  if (!documentXml.includes('<w:document') || documentXml.includes('\uFFFD')) throw new Error('DOCX XML 不合格');

  return { markdown: markdownBuffer.length, pdf: pdf.length, word: docx.length };
}

async function main() {
  const routes = await routesFromBuild();
  if (!routes.length) throw new Error(requested ? `构建结果中没有文章 ${requested}` : '构建结果中没有文章导出标记');
  let failed = 0;
  let totalBytes = 0;
  for (const route of routes) {
    try {
      const sizes = await verifyRoute(route);
      totalBytes += sizes.markdown + sizes.pdf + sizes.word;
      console.log(`✓ ${route} · MD ${sizes.markdown} · PDF ${sizes.pdf} · DOCX ${sizes.word}`);
    } catch (error) {
      failed += 1;
      console.error(`✗ ${route} · ${error.message}`);
    }
  }
  if (failed) throw new Error(`${failed}/${routes.length} 篇文章未通过下载文档校验`);
  console.log(`通过：${routes.length} 篇，${routes.length * 3} 个文件，共 ${(totalBytes / 1024 / 1024).toFixed(2)} MiB。`);
}

main().catch((error) => {
  console.error(`\n校验失败：${error.message}`);
  process.exitCode = 1;
});
