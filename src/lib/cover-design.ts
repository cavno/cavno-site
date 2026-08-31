/** Cover v2: category owns colour; content owns the drawing; URL owns the edition. */
export const MOTIF_LABELS = {
  'child-seat': 'CHILD SEAT', 'model-y': 'VEHICLE', house: 'PROPERTY', school: 'SCHOOL',
  city: 'CITY', social: 'CONVERSATION', ai: 'COMPUTATION', code: 'CODE', data: 'DATA',
  options: 'OPTIONS', market: 'MARKET', commerce: 'COMMERCE', book: 'BOOK',
  math: 'GEOMETRY', philosophy: 'PHILOSOPHY', system: 'SYSTEM', document: 'DOCUMENT',
  lineage: 'LINEAGE', timeline: 'TIMELINE', recursion: 'RECURSION', proof: 'DEDUCTION',
  matrix: 'MATRIX', bridge: 'MEDIATION', strata: 'LAYERS', feedback: 'FEEDBACK',
  balance: 'BALANCE', horizon: 'HORIZON', chain: 'CAUSAL CHAIN', rift: 'RIFT',
  network: 'NETWORK', shield: 'BOUNDARY', route: 'ROUTE', spectrum: 'DISTRIBUTION',
  payoff: 'PAYOFF', funnel: 'FUNNEL',
} as const;

export type CoverMotif = keyof typeof MOTIF_LABELS;
export type CoverLayout = 'split' | 'stacked' | 'framed' | 'band';
export type CoverTexture = 'grid' | 'rings' | 'lines' | 'dots' | 'steps' | 'plain';
export interface CoverDesign {
  hue: number;
  saturation: number;
  variant: number;
  serial: string;
  motif: CoverMotif;
  motifLabel: string;
  layout: CoverLayout;
  texture: CoverTexture;
  theme: string;
}

export interface CoverContent {
  title: string;
  href?: string;
  section?: string;
  subsection?: string;
  summary?: string;
  tags?: string[];
  headings?: string;
  bodyText?: string;
}

// No title hash, keyword or motif may change a category's palette.
export const CATEGORY_PALETTES: Record<string, { hue: number; saturation: number }> = {
  'reading:philosophy': { hue: 244, saturation: 22 },
  'reading:thinking': { hue: 164, saturation: 24 },
  'reading:books': { hue: 32, saturation: 26 },
  'reading:theology': { hue: 28, saturation: 24 },
  'reading:math': { hue: 215, saturation: 26 },
  'investing:options': { hue: 212, saturation: 28 },
  'investing:valuation': { hue: 153, saturation: 25 },
  'investing:cases': { hue: 18, saturation: 24 },
  'life:driving': { hue: 206, saturation: 24 },
  'life:house': { hue: 33, saturation: 24 },
  'life:school': { hue: 45, saturation: 26 },
  'life:china': { hue: 170, saturation: 22 },
  'life:family': { hue: 24, saturation: 27 },
  'life:orders': { hue: 186, saturation: 22 },
  'life:ai': { hue: 228, saturation: 24 },
  'life:skills': { hue: 192, saturation: 22 },
  'working:amazon': { hue: 28, saturation: 24 },
  'working:training': { hue: 166, saturation: 24 },
  reading: { hue: 164, saturation: 24 }, investing: { hue: 212, saturation: 26 },
  life: { hue: 192, saturation: 22 }, working: { hue: 28, saturation: 24 },
  default: { hue: 35, saturation: 18 },
};

type Rule = { motif: CoverMotif; pattern: RegExp; specificity: number };
// Specific concepts precede generic domain words. Field weights below matter more
// than declaration order; a stray 'school' or 'AI' in body text cannot hijack a title.
const SPECIFIC_RULES: Rule[] = [
  { motif: 'matrix', pattern: /矩阵|组合构型|典型市场.*格局|明细透视|记分卡|combinatorics|\bmatrix\b/i, specificity: 24 },
  { motif: 'recursion', pattern: /自指|自我指涉|递归|说谎者|悖论图谱|self.reference|paradoxes/i, specificity: 28 },
  { motif: 'bridge', pattern: /中介|形式之桥|焊点|mediator/i, specificity: 28 },
  { motif: 'strata', pattern: /地质层|层叠|多层|顶层设计|权限架构|控制层|个人配置|harness/i, specificity: 26 },
  { motif: 'rift', pattern: /裂缝|裂隙|断裂|rift/i, specificity: 29 },
  { motif: 'chain', pattern: /连锁反应|因果链|新缺口|chain.reaction/i, specificity: 28 },
  { motif: 'balance', pattern: /支点|受力|张力|对比|比较|称重|对冲|hedg/i, specificity: 18 },
  { motif: 'proof', pattern: /公理推演|演绎|逻各斯原本|四律|逻辑律|deduct/i, specificity: 22 },
  { motif: 'feedback', pattern: /动力学|反馈|反身性|循环|债务周期|增长体系|feedback/i, specificity: 26 },
  { motif: 'lineage', pattern: /谱系|脉络|生命树|家族树|关键词结构|搜索词分组|genealogy|lineage/i, specificity: 23 },
  { motif: 'timeline', pattern: /发展史|演化史|哲学史|思想史|发展.*路线图|路线图|历代|timeline/i, specificity: 17 },
  { motif: 'horizon', pattern: /生命的意义|生命.*价值|虚无|希望|existential/i, specificity: 27 },
  { motif: 'shield', pattern: /防封|不被封|安全|隐私|身份|风控|退款|反脆弱|鲁棒|anti.ban|access.truth/i, specificity: 18 },
  { motif: 'route', pattern: /智驾|自动驾驶|上路|路考|驾驶指南|科目[三3]|路径规划|新品发射/i, specificity: 24 },
  { motif: 'spectrum', pattern: /波动率|概率|分布|肥尾|预测台|volatility|distribution|gamma.profile|gamma.exposure|Gamma敞口/i, specificity: 24 },
  { motif: 'payoff', pattern: /收益曲线|损益|long.?call|max.?pain|卖\s*put|期权策略/i, specificity: 25 },
  { motif: 'funnel', pattern: /转化|销售漏斗|关键词|搜索词|投放|获客|广告|PPC|eCPM/i, specificity: 18 },
  { motif: 'network', pattern: /网络|网络效应|耦合|多主体|连接|关系图|智能体|工作流|协同|Rules.*Hooks/i, specificity: 17 },
  { motif: 'child-seat', pattern: /安全座椅|儿童座椅|双娃座椅|Cybex|car\s*seat/i, specificity: 35 },
  { motif: 'math', pattern: /几何|几何原本|geometry/i, specificity: 23 },
];

const DOMAIN_RULES: Array<{ motif: CoverMotif; pattern: RegExp }> = [
  { motif: 'model-y', pattern: /Model\s*Y|特斯拉|Tesla|驾驶|车辆/i },
  { motif: 'school', pattern: /入学|学校|学区|school/i },
  { motif: 'house', pattern: /购房|房贷|房产|楼盘|住房|住宅|公寓|小区|mortgage/i },
  { motif: 'social', pattern: /微信|公众号|企微|私域|WeChat|WeCom/i },
  { motif: 'options', pattern: /期权|Gamma|Delta|Squeeze|Greeks|Options/i },
  { motif: 'commerce', pattern: /Amazon|亚马逊|新品|月销|销售|提成|尽调|老品资产/i },
  { motif: 'code', pattern: /Vibecoder|技术名词|Rules|Hooks|斜杠命令|中转|配置|Code/i },
  { motif: 'ai', pattern: /\bAI\b|\bLLM\b|Claude|机器人|模型接入/i },
  { motif: 'market', pattern: /金融|投资|估值|股票|指数|信用|资产|债务|财政|经济|保证金/i },
  { motif: 'city', pattern: /深圳|香港|澳门|东京|大阪|大湾区|城市|地图|扇区/i },
  { motif: 'data', pattern: /数据|看板|Dashboard|查询|计算器|管理系统|图表/i },
  { motif: 'math', pattern: /数学|公理|Axiom/i },
  { motif: 'philosophy', pattern: /哲学|本体论|认识论|逻各斯|Logos|形而上学/i },
  { motif: 'book', pattern: /圣经|全书|《|》|Biblical|阅读/i },
  { motif: 'system', pattern: /系统|结构|框架|逻辑|图谱|Atlas|控制台|实验台/i },
];

const FALLBACKS: Record<string, CoverMotif> = {
  'life:driving': 'route', 'life:family': 'child-seat', 'life:house': 'house',
  'life:school': 'school', 'life:china': 'city', 'life:ai': 'ai', 'life:skills': 'code',
  'life:orders': 'document', 'investing:options': 'options', 'investing:cases': 'market',
  'investing:valuation': 'balance', 'reading:books': 'book', 'reading:math': 'math',
  'reading:philosophy': 'lineage', 'reading:thinking': 'system', 'reading:theology': 'book',
  'working:amazon': 'commerce', 'working:training': 'network',
};

// Optional editorial corrections for ambiguous titles. Colour is intentionally
// not configurable here, so overrides cannot break category consistency.
export const ARTICLE_COVERS: Record<string, { motif: CoverMotif; layout?: CoverLayout }> = {
  '/reading/philosophy/greek-philosophy/': { motif: 'balance', layout: 'framed' },
  '/reading/philosophy/four-laws-logos-atlas/': { motif: 'proof', layout: 'band' },
  '/reading/philosophy/copleston-history-of-philosophy/': { motif: 'timeline', layout: 'stacked' },
  '/reading/thinking/financial-system/': { motif: 'market', layout: 'band' },
  '/reading/thinking/chinese-dynasties/': { motif: 'lineage', layout: 'split' },
  '/reading/thinking/matter-evolution/': { motif: 'strata', layout: 'framed' },
  '/reading/thinking/physics-evolution/': { motif: 'spectrum', layout: 'framed' },
};

const TEXTURES: Partial<Record<CoverMotif, [CoverTexture, CoverTexture]>> = {
  lineage: ['lines', 'dots'], timeline: ['lines', 'steps'], recursion: ['rings', 'grid'],
  proof: ['steps', 'grid'], matrix: ['grid', 'dots'], bridge: ['lines', 'plain'],
  strata: ['steps', 'lines'], feedback: ['rings', 'dots'], balance: ['plain', 'grid'],
  horizon: ['rings', 'lines'], chain: ['steps', 'dots'], rift: ['lines', 'plain'],
  network: ['dots', 'grid'], shield: ['plain', 'rings'], route: ['lines', 'grid'],
  spectrum: ['grid', 'lines'], payoff: ['grid', 'steps'], funnel: ['steps', 'plain'],
};
const LAYOUTS: CoverLayout[] = ['split', 'stacked', 'framed', 'band'];

function hash(value: string): number {
  let seed = 2166136261;
  for (const char of value) seed = Math.imul(seed ^ (char.codePointAt(0) ?? 0), 16777619);
  return seed >>> 0;
}

function inferMotif(input: CoverContent): CoverMotif {
  const fields: [string, number][] = [
    [input.title, 120], [(input.tags ?? []).join(' '), 80],
    [input.summary ?? '', 45], [input.headings ?? '', 30], [input.bodyText ?? '', 10],
  ];
  const candidates: Array<{ motif: CoverMotif; score: number }> = [];
  for (const [text, weight] of fields) {
    for (const rule of SPECIFIC_RULES) {
      if (rule.pattern.test(text)) candidates.push({ motif: rule.motif, score: weight + rule.specificity });
    }
    // A title's concrete object should beat an incidental body concept.
    for (const rule of DOMAIN_RULES) {
      if (rule.pattern.test(text)) candidates.push({ motif: rule.motif, score: weight - 12 });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.motif ?? FALLBACKS[`${input.section ?? ''}:${input.subsection ?? ''}`]
    ?? (input.section === 'reading' ? 'book' : 'document');
}

export function deriveCoverDesign(input: CoverContent): CoverDesign {
  const category = `${input.section ?? ''}:${input.subsection ?? ''}`;
  const theme = CATEGORY_PALETTES[category] ? category : CATEGORY_PALETTES[input.section ?? ''] ? input.section! : 'default';
  const palette = CATEGORY_PALETTES[theme];
  const identity = input.href || `${category}:${input.title}`;
  const seed = hash(identity);
  const override = ARTICLE_COVERS[input.href ?? ''];
  const motif = override?.motif ?? inferMotif(input);
  const textures: [CoverTexture, CoverTexture] = TEXTURES[motif] ?? ['grid', 'dots'];
  return {
    ...palette, theme, motif, motifLabel: MOTIF_LABELS[motif],
    layout: override?.layout ?? LAYOUTS[(seed >>> 8) % LAYOUTS.length],
    texture: textures[(seed >>> 16) % textures.length],
    variant: seed % 3,
    serial: String(seed % 1000).padStart(3, '0'),
  };
}

/** Shared by Astro cards and client-side search. Old cached v1 indexes still render. */
export function coverClassName(cover: Partial<CoverDesign>): string {
  const motif = cover.motif && cover.motif in MOTIF_LABELS ? cover.motif : 'document';
  const layout = LAYOUTS.includes(cover.layout!) ? cover.layout : 'split';
  const textures: CoverTexture[] = ['grid', 'rings', 'lines', 'dots', 'steps', 'plain'];
  const texture = textures.includes(cover.texture!) ? cover.texture : 'grid';
  const variant = Number.isInteger(cover.variant) ? Math.abs(cover.variant!) % 3 : 0;
  return `cv-cover-v${variant} cv-cover-motif-${motif} cv-cover-layout-${layout} cv-cover-texture-${texture}`;
}

export function coverStyle(cover: Partial<CoverDesign>): string {
  const hue = Number.isFinite(cover.hue) ? Math.min(360, Math.max(0, cover.hue!)) : 35;
  const saturation = Number.isFinite(cover.saturation) ? Math.min(45, Math.max(0, cover.saturation!)) : 24;
  return `--cv-cover-h:${hue};--cv-cover-s:${saturation}%;`;
}
