import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import yaml from 'js-yaml';

// Uses Astro's locked dependency tree; does not install packages or write files.
const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const baselinePath = args.find((arg) => arg.startsWith('--baseline='))?.slice(11);
const files = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
const loadModule = async (path) => {
  const result = await build({ entryPoints: [path], bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
};
const current = await loadModule(join(root, 'src/lib/content-presentation.ts'));
const design = await loadModule(join(root, 'src/lib/cover-design.ts'));
const baseline = baselinePath ? await loadModule(resolve(baselinePath)) : null;
const inputs = files(join(root, 'src/content/items')).filter((file) => file.endsWith('.md')).sort().map((file) => {
  const source = readFileSync(file, 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert(frontmatter, 'Missing frontmatter: ' + file);
  const data = yaml.load(frontmatter[1]);
  const url = new URL(data.href, 'https://cavno.org');
  const bodyPath = join(root, 'src/legacy', url.pathname.replace(/^\/+|\/+$/g, ''), 'body.html');
  return { ...data, tags: data.tags ?? [], summary: data.summary ?? '',
    body: url.origin === 'https://cavno.org' && existsSync(bodyPath) ? readFileSync(bodyPath, 'utf8') : '' };
});
const signature = (cover) => [cover.motif, cover.layout, cover.texture, cover.variant].join('/');
const rows = inputs.map((input) => ({
  input, cover: current.derivePresentation(input), before: baseline?.derivePresentation(input),
}));
const groups = new Map();
for (const row of rows) {
  const key = row.input.section + ':' + row.input.subsection;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}
const report = [...groups].map(([category, entries]) => ({
  category, items: entries.length,
  paletteCount: new Set(entries.map(({ cover }) => cover.hue + '/' + cover.saturation)).size,
  motifCount: new Set(entries.map(({ cover }) => cover.motif)).size,
  layoutCount: new Set(entries.map(({ cover }) => cover.layout)).size,
  signatureCount: new Set(entries.map(({ cover }) => signature(cover))).size,
  ...(baseline ? {
    oldHueCount: new Set(entries.map(({ before }) => before.hue)).size,
    oldMotifCount: new Set(entries.map(({ before }) => before.motif)).size,
  } : {}),
}));
console.table(report);
const collisions = [];
for (const [category, entries] of groups) {
  const designs = new Map();
  for (const row of entries) {
    const key = signature(row.cover);
    if (!designs.has(key)) designs.set(key, []);
    designs.get(key).push(row.input.title);
  }
  for (const [key, titles] of designs) {
    if (titles.length > 1) collisions.push({ category, signature: key, titles: titles.join(' / ') });
  }
}
if (collisions.length) console.table(collisions);
const philosophy = groups.get('reading:philosophy') ?? [];
console.table(philosophy.map(({ input, cover, before }) => ({
  title: input.title, oldMotif: before?.motif, motif: cover.motif, layout: cover.layout,
  texture: cover.texture, variant: cover.variant, hue: cover.hue,
})));
if (args.includes('--report-only')) process.exit(0);
const css = readFileSync(join(root, 'src/styles/covers.css'), 'utf8');
assert.equal(collisions.length, 0, 'Duplicate covers: add a content-specific editorial correction');
for (const group of report) assert.equal(group.paletteCount, 1, group.category + ': mixed palettes');
for (const { input, cover, before } of rows) {
  assert.deepEqual(current.derivePresentation(input), cover, 'Unstable cover: ' + input.href);
  assert(css.includes('.cv-art-' + cover.motif + ' ') || css.includes('.cv-art-' + cover.motif + '{'), 'Missing drawing: ' + cover.motif);
  if (before) {
    assert.equal(cover.title, before.title, 'Title changed: ' + input.href);
    assert.equal(cover.summary, before.summary, 'Summary changed: ' + input.href);
    assert.deepEqual(cover.keywords, before.keywords, 'Keywords changed: ' + input.href);
  }
}
const byHref = new Map(rows.map((row) => [row.input.href, row]));
for (const input of [...inputs].reverse()) {
  assert.deepEqual(current.derivePresentation(input), byHref.get(input.href).cover, 'Order-dependent cover: ' + input.href);
}
assert(new Set(philosophy.map(({ cover }) => cover.motif)).size >= 10, 'Philosophy needs at least ten semantic drawings');
const philosophyCounts = new Map();
for (const { cover } of philosophy) philosophyCounts.set(cover.motif, (philosophyCounts.get(cover.motif) ?? 0) + 1);
assert(Math.max(...philosophyCounts.values()) <= Math.ceil(philosophy.length * .3), 'One philosophy drawing dominates');
assert.equal(new Set(philosophy.map(({ cover }) => signature(cover))).size, philosophy.length, 'Duplicate philosophy compositions');
const fixture = { section: 'reading', subsection: 'philosophy' };
const cases = [
  ['公理组合矩阵', 'matrix'], ['中介之死', 'bridge'], ['自指悖论', 'recursion'],
  ['哲学思想谱系', 'lineage'], ['逻各斯原本 · 公理推演', 'proof'],
  ['古希腊的地质层图谱', 'strata'], ['裂缝的历史', 'rift'], ['反馈动力学', 'feedback'],
  ['探索生命的意义与价值', 'horizon'],
];
for (const [title, motif] of cases) {
  const result = current.derivePresentation({ ...fixture, title, body: '<p>AI 股票 学校 住房 广告</p>' });
  assert.equal(result.motif, motif, 'Off-topic body hijacks ' + title);
  assert.equal(result.hue, design.CATEGORY_PALETTES['reading:philosophy'].hue);
}
assert.equal(current.derivePresentation({ ...fixture, title: '专题', summary: '递归与自指的结构' }).motif, 'recursion');
assert.equal(current.derivePresentation({ ...fixture, title: '专题', body: '<h2>公理组合矩阵</h2>' }).motif, 'matrix');
assert.equal(current.derivePresentation({ ...fixture, title: '专题', body: '<script>公理组合矩阵</script>' }).motif, 'lineage');
assert.notEqual(
  signature(current.derivePresentation({ ...fixture, title: '同名文章', href: '/article/a/' })),
  signature(current.derivePresentation({ ...fixture, title: '同名文章', href: '/article/b/' })),
);
assert(!/Math\.random|Date\.now/.test(readFileSync(join(root, 'src/lib/cover-design.ts'), 'utf8')));
assert(!/https?:|url\(/.test(css), 'Covers must not add external assets');
assert(!css.includes('.cv-art-philosophy .cv-art-d,.cv-art-philosophy .cv-art-e'), 'Old repeated eye motif remains');
assert(design.coverClassName({ motif: 'philosophy', hue: 252, variant: 4 }).includes('cv-cover-layout-split'), 'v1 cache fallback');
assert(!design.coverStyle({ hue: NaN, saturation: Infinity }).includes('NaN'));

if (args.includes('--built')) {
  const dist = join(root, 'dist');
  assert(existsSync(dist), 'Run the site build first');
  const index = JSON.parse(readFileSync(join(dist, 'search-index.json'), 'utf8'));
  assert.equal(index.version, 2);
  assert(!index.items.some((item) => item.section === 'working'), 'Working content leaked into public search');
  const fields = ['hue', 'saturation', 'theme', 'motif', 'layout', 'texture', 'variant', 'serial'];
  for (const item of index.items) {
    const expected = byHref.get(item.href)?.cover;
    assert(expected, 'Unexpected search item: ' + item.href);
    for (const field of fields) assert.equal(item.cover[field], expected[field], 'Search mismatch ' + field + ': ' + item.href);
  }
  let checked = 0;
  for (const file of files(dist).filter((path) => path.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<a\b(?=[^>]*class="cv-item")[^>]*>[\s\S]*?<\/a>/g)) {
      const card = match[0];
      const href = card.match(/href="([^"]+)"/)?.[1];
      const expected = byHref.get(href)?.cover;
      assert(expected, 'Unexpected card: ' + relative(dist, file) + ' ' + href);
      assert(card.includes(design.coverClassName(expected)), 'Card class mismatch: ' + href);
      assert(card.includes(design.coverStyle(expected)), 'Card palette mismatch: ' + href);
      const surface = card.split('<div class="cv-item-body"')[0];
      assert(!surface.includes('<p>'), 'Summary duplicated on cover: ' + href);
      checked++;
    }
  }
  assert(checked >= rows.length * 2, 'Expected cards at primary and secondary catalog levels');
  console.log('Built verification: ' + checked + ' cards and ' + index.items.length + ' search results share the same design rules.');
}
console.log('Cover audit passed: ' + rows.length + ' articles, ' + report.length + ' categories, one palette per category.');
