// 文章目录与分类元数据
const categories = [
  { key: 'phil', name: '哲学根本', en: 'FOUNDATIONS', color: 'var(--c-phil)', desc: '关于知识、存在、方法与善的最根本追问' },
  { key: 'sci',  name: '科学之眼', en: 'THE SCIENCES', color: 'var(--c-sci)',  desc: '从元学科到具体学科，理解世界的雄心与限度' },
  { key: 'real', name: '存在与现实', en: 'EXISTENCE & WORLD', color: 'var(--c-real)', desc: '人自身、文明之间、市场之中的张力' }
];

const articles = [
  // —— 哲学根本 ——
  { id: 'ethics',       cat: 'phil', no: '01', title: '善的追求与判断的局限',           sub: '伦理学 · 动力学分析',       tension: '追求普遍原则 ↔ 应对具体情境' },
  { id: 'epistemology', cat: 'phil', no: '02', title: '知识的追求与确定性的不可达',     sub: '认识论 · 全部发展历程',     tension: '对确定性的追求 ↔ 知识无法被完全奠基' },
  { id: 'ontology',     cat: 'phil', no: '03', title: '存在的追问与言说的极限',         sub: '本体论 · 全部发展历程',     tension: '把握存在的渴望 ↔ 言说存在的不可能' },
  { id: 'methodology',  cat: 'phil', no: '04', title: '通达真理之路的追寻与每条路的局限', sub: '方法论 · 全部发展历程',   tension: '对可靠程序的追求 ↔ 创造性洞察超越方法' },

  // —— 科学之眼 ——
  { id: 'science',   cat: 'sci', no: '05', title: '系统的雄心与现实的不顺从',   sub: '科学（元学科）· 动力学分析', tension: '系统化的雄心 ↔ 现实的不顺从' },
  { id: 'chemistry', cat: 'sci', no: '06', title: '转化的雄心与守恒的纪律',     sub: '化学 · 动力学分析',         tension: '转化的雄心 ↔ 守恒的纪律' },
  { id: 'biology',   cat: 'sci', no: '07', title: '生命的统一与多样的繁茂',     sub: '生物学 · 动力学分析',       tension: '生命的统一 ↔ 多样的繁茂' },
  { id: 'neuro',     cat: 'sci', no: '08', title: '物质的精确与心灵的不可还原', sub: '神经学 · 动力学分析',       tension: '物质的精确 ↔ 心灵的不可还原' },
  { id: 'brain',     cat: 'sci', no: '09', title: '大脑作为对象与大脑作为主体', sub: '脑科学 · 动力学分析',       tension: '大脑作为对象 ↔ 大脑作为主体' },

  // —— 存在与现实 ——
  { id: 'human',   cat: 'real', no: '10', title: '人作为询问自身的存在',     sub: '人 · 人类 · 人性',        tension: '被给定的具体 ↔ 对自身永远开放' },
  { id: 'sino_us', cat: 'real', no: '11', title: '既无法共处又无法分离',     sub: '中美关系 · 修昔底德陷阱',   tension: '深度相互依存 ↔ 根本战略竞争' },
  { id: 'options', cat: 'real', no: '12', title: '风险的承担与转移的协商',   sub: '期权微观结构 · 全部发展历程', tension: '风险可被转移管理 ↔ 创造新的不稳定' }
];

function byId(id) {
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].id === id) return articles[i];
  }
  return null;
}

function grouped() {
  return categories.map(function (c) {
    return {
      cat: c,
      items: articles.filter(function (a) { return a.cat === c.key; })
    };
  });
}

module.exports = { categories: categories, articles: articles, byId: byId, grouped: grouped };
