import routeMigrations from '../content/article-route-migrations.json';
import { deriveCoverDesign, type CoverDesign } from './cover-design';
export type { CoverMotif } from './cover-design';

export interface PresentationInput {
  href?: string;
  title: string;
  summary?: string;
  tags?: string[];
  section?: string;
  subsection?: string;
  body?: string;
}

export interface AutoPresentation extends CoverDesign {
  title: string;
  summary: string;
  keywords: string[];
}

const ENTITY_MAP: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', mdash: '—', ndash: '–', hellip: '…',
};

const compact = (value = '') => value.replace(/\s+/g, ' ').trim();

const decodeEntities = (value: string) => value.replace(
  /&(#x?[0-9a-f]+|[a-z]+);/gi,
  (_, entity: string) => {
    const key = entity.toLowerCase();
    if (key[0] === '#') {
      const hex = key[1] === 'x';
      const point = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : ' ';
    }
    return ENTITY_MAP[key] ?? ' ';
  },
);

export function htmlToPlainText(html = ''): string {
  return compact(decodeEntities(html
    .replace(/<(script|style|svg|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<\/(p|div|section|article|header|footer|h[1-6]|li|tr|pre|blockquote)>/gi, '。')
    .replace(/<br\s*\/?>/gi, '。')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[。]{2,}/g, '。')));
}

const take = (value: string, max: number) => {
  const chars = Array.from(compact(value));
  if (chars.length <= max) return chars.join('');
  return `${chars.slice(0, max).join('').replace(/[，、；：,.·\s]+$/u, '')}…`;
};

const paragraphsFrom = (html = '') => Array.from(html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi))
  .map((match) => htmlToPlainText(match[1]))
  .filter((text) => text.length >= 24 && text.length <= 420)
  .filter((text) => !/(版权所有|保留所有权利|资料来源|参考来源|返回顶部|更新时间|调研方法)/.test(text));

function inferredSummary(title: string, summary = '', body = ''): string {
  const supplied = compact(summary);
  if (supplied) return take(supplied, 92);

  const candidates = paragraphsFrom(body)
    .map((text, index) => {
      let score = Math.max(0, 14 - index * .8);
      if (text.length >= 28 && text.length <= 180) score += 3;
      if (/(本页|本文|核心|通过|展示|解释|梳理|拆解|一张图|系统|框架|方法)/.test(text)) score += 2;
      if (text.includes(title) || text.length < 30) score -= 2;
      if (/(单文件|零构建|零依赖|字体除外|非实盘|版权所有|更新时间|版本说明)/.test(text)) score -= 8;
      if ((text.match(/[｜|]/g) ?? []).length >= 3) score -= 3;
      return { text, score };
    })
    .sort((a, b) => b.score - a.score);

  return take(candidates[0]?.text || htmlToPlainText(body) || title, 92);
}

function keywordCandidates(title: string, summary: string): string[] {
  const phrases = title
    .replace(/[（）()【】\[\]]/g, ' ')
    .split(/[·—–｜|:：,，。！？!?/\\]+|\s{2,}/)
    .map(compact)
    .filter((part) => Array.from(part).length >= 2 && Array.from(part).length <= 16);

  const latin = `${title} ${summary}`.match(/[A-Za-z][A-Za-z0-9.+#-]{2,}/g) ?? [];
  return [...phrases, ...latin];
}

function inferredKeywords(
  title: string,
  summary: string,
  tags: string[] = [],
  subsection = '',
): string[] {
  const blocked = new Set(['未分类', 'misc', 'Cavno', 'web', 'main']);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of [...tags, ...keywordCandidates(title, summary), subsection]) {
    const word = take(compact(raw), 14).replace(/…$/, '');
    const key = word.toLocaleLowerCase('zh-CN');
    if (!word || blocked.has(word) || seen.has(key)) continue;
    seen.add(key);
    result.push(word);
    if (result.length === 3) break;
  }
  return result;
}

export function derivePresentation(input: PresentationInput): AutoPresentation {
  const title = take(input.title, 38);
  const summary = inferredSummary(input.title, input.summary, input.body);
  const headings = Array.from((input.body ?? '').matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi))
    .map((match) => htmlToPlainText(match[1])).join(' ').slice(0, 2400);
  const design = deriveCoverDesign({
    ...input,
    summary,
    headings,
    bodyText: htmlToPlainText(input.body).slice(0, 6000),
  });

  return {
    ...design,
    title,
    summary,
    keywords: inferredKeywords(input.title, summary, input.tags, input.subsection),
  };
}

export function makeBodyLookup(modules: Record<string, unknown>): Record<string, string> {
  const lookup: Record<string, string> = {};
  for (const [rawPath, value] of Object.entries(modules)) {
    const path = rawPath.replace(/\\/g, '/');
    const marker = '/legacy/';
    const start = path.indexOf(marker);
    if (start < 0 || !path.endsWith('/body.html')) continue;
    const route = path.slice(start + marker.length, -'/body.html'.length);
    const sourceHref = `/${route}/`;
    const destination = (routeMigrations as Record<string, string>)[sourceHref] ?? sourceHref;
    lookup[destination] = typeof value === 'string' ? value : '';
  }
  return lookup;
}
