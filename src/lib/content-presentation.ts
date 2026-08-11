export interface PresentationInput {
  title: string;
  summary?: string;
  tags?: string[];
  section?: string;
  subsection?: string;
  body?: string;
}

export interface AutoPresentation {
  title: string;
  summary: string;
  keywords: string[];
  hue: number;
  variant: number;
  serial: string;
  motif: CoverMotif;
  motifLabel: string;
}

export type CoverMotif =
  | 'child-seat'
  | 'model-y'
  | 'house'
  | 'school'
  | 'city'
  | 'social'
  | 'ai'
  | 'code'
  | 'data'
  | 'options'
  | 'market'
  | 'commerce'
  | 'book'
  | 'math'
  | 'philosophy'
  | 'system'
  | 'document';

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

function hashText(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
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

const MOTIF_LABELS: Record<CoverMotif, string> = {
  'child-seat': 'CHILD SEAT',
  'model-y': 'MODEL Y',
  house: 'PROPERTY',
  school: 'SCHOOL',
  city: 'CITY ATLAS',
  social: 'SOCIAL FLOW',
  ai: 'AI CORE',
  code: 'CODE',
  data: 'DATA MAP',
  options: 'OPTIONS',
  market: 'MARKET',
  commerce: 'COMMERCE',
  book: 'OPEN BOOK',
  math: 'AXIOM',
  philosophy: 'DIALECTIC',
  system: 'SYSTEM',
  document: 'DOCUMENT',
};

const MOTIF_RULES: Array<{ motif: CoverMotif; pattern: RegExp }> = [
  { motif: 'child-seat', pattern: /(安全座椅|儿童座椅|双娃座椅|Cybex|car\s*seat)/i },
  { motif: 'model-y', pattern: /(Model\s*Y|特斯拉|Tesla|驾驶|上路|科目[一三四134]|考场|车辆)/i },
  { motif: 'school', pattern: /(入学|学校|教育|学区|school)/i },
  { motif: 'house', pattern: /(购房|房贷|房产|楼盘|住房|住宅|公寓|小区|成交|mortgage)/i },
  { motif: 'social', pattern: /(微信|公众号|企微|私域|草稿箱|WeChat|WeCom)/i },
  { motif: 'options', pattern: /(期权|Gamma|Delta|Squeeze|Long\s*Call|Max\s*Pain|Greeks|Options|卖\s*Put)/i },
  { motif: 'commerce', pattern: /(广告|Amazon|亚马逊|推广|投放|eCPM|PPC|关键词|搜索词|新品发射|月销|销售|提成|市场尽调|老品资产)/i },
  { motif: 'ai', pattern: /(^|\W)(AI|LLM)(\W|$)|Claude|智能体|机器人|API\s*模型|模型接入/i },
  { motif: 'code', pattern: /(Vibecoder|技术名词|Rules|Hooks|斜杠命令|第三方中转|个人配置|Code)/i },
  { motif: 'market', pattern: /(投资|估值|股市|股票|指数|SEBI|信用扩张|大类资产|债务|财政|经济|保证金)/i },
  { motif: 'city', pattern: /(深圳|香港|澳门|东京|大阪|大湾区|中国|城市|地形|扇区|地图)/i },
  { motif: 'data', pattern: /(数据|看板|Dashboard|查询系统|计算器|管理系统|对比系统|图表)/i },
  { motif: 'math', pattern: /(数学|几何|公理|矩阵|Axiom|Combinatorics)/i },
  { motif: 'philosophy', pattern: /(哲学|悖论|本体论|认识论|逻各斯|Logos|形而上学|生命的意义|自指)/i },
  { motif: 'book', pattern: /(圣经|全书|《|》|Biblical|阅读)/i },
  { motif: 'system', pattern: /(系统|结构|框架|逻辑|图谱|全景图|Atlas|推演|控制台|实验台)/i },
];

const MOTIF_FALLBACKS: Record<string, CoverMotif> = {
  'life:driving': 'model-y',
  'life:family': 'child-seat',
  'life:house': 'house',
  'life:school': 'school',
  'life:china': 'city',
  'life:ai': 'ai',
  'life:skills': 'code',
  'investing:options': 'options',
  'investing:cases': 'market',
  'investing:valuation': 'market',
  'reading:books': 'book',
  'reading:math': 'math',
  'reading:philosophy': 'philosophy',
  'reading:thinking': 'system',
  'working:amazon': 'commerce',
};

function inferredMotif(input: PresentationInput, summary: string): CoverMotif {
  const headline = compact([
    input.title,
    ...(input.tags ?? []),
    input.subsection ?? '',
  ].join(' '));
  const context = compact(`${headline} ${summary}`);

  for (const rule of MOTIF_RULES) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(headline)) return rule.motif;
  }
  for (const rule of MOTIF_RULES) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(context)) return rule.motif;
  }

  return MOTIF_FALLBACKS[`${input.section ?? ''}:${input.subsection ?? ''}`]
    ?? (input.section === 'reading' ? 'book' : 'document');
}

export function derivePresentation(input: PresentationInput): AutoPresentation {
  const title = take(input.title, 38);
  const summary = inferredSummary(input.title, input.summary, input.body);
  const motif = inferredMotif(input, summary);
  const seed = hashText(`${input.section}:${input.subsection}:${input.title}`);
  const motifHue: Record<CoverMotif, number> = {
    'child-seat': 20,
    'model-y': 204,
    house: 34,
    school: 48,
    city: 166,
    social: 132,
    ai: 264,
    code: 218,
    data: 188,
    options: 326,
    market: 12,
    commerce: 286,
    book: 28,
    math: 224,
    philosophy: 252,
    system: 162,
    document: 42,
  };
  const hue = motifHue[motif] + (seed % 15) - 7;

  return {
    title,
    summary,
    keywords: inferredKeywords(input.title, summary, input.tags, input.subsection),
    hue,
    variant: seed % 5,
    serial: String(seed % 1000).padStart(3, '0'),
    motif,
    motifLabel: MOTIF_LABELS[motif],
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
    lookup[`/${route}/`] = typeof value === 'string' ? value : '';
  }
  return lookup;
}
