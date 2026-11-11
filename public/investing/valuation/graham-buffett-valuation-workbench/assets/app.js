/* Cavno Valuation Workbench · Scoped IIFE (100% grounded to Greenwald et al., 2nd Ed., 2021) */
(() => {
  'use strict';
  const root = document.getElementById('graham-buffett-app');
  if (!root) return;
  const byId = (id) => root.querySelector('[id="' + id + '"]');

  // Global chart registry to ensure clean destruction and responsive redraws
    const charts = {
      empirical: null,
      dcf: null,
      wbAvEpv: null,
      wbReturn: null,
      caseStudy: null,
      masters: null
    };

    const appState = {
      mainTab: 'logic',
      pipelineStep: 0,
      taxonomy: 'value',
      biasTab: 'psych',
      empiricalKey: 'ff',
      pyramidLayer: 'av',
      strategicCase: 'caseC',
      workbenchMode: 'franchise',
      activeCase: 'hudson',
      macroRegime: 'inflation',
      masterFilter: 'all',
      ddChecked: [true, true, false, true, false, true, true, true, true, false]
    };

    // -----------------------------------------------------------------------
    // Book-Grounded Static Data Inventory
    // -----------------------------------------------------------------------
    const PIPELINE_STEPS = [
      {
        title: '第一步：搜寻策略 (Search Strategy · 第2章 pp. 17–39)',
        question: '面对上万只证券，我凭什么第一时间锁定那些被对手方非理性抛售的标的？',
        mistake: '华尔街通病：追逐高增长明星股（彩票偏好）、全市场泛泛撒网、迷信自上而下宏观主题或热门赛道的“好故事”。',
        solution: '双引擎机制：① 由内而外构建专精能力圈（耗时 ≥1000 小时深耕单一细分行业或区域，如德州陆上油气租约、欧洲利基工业品）；② 系统性聚焦“丑陋、无聊、冷门、小市值、机构被动抛售的分拆股（Spin-offs）与过去2–3年大跌股”。'
      },
      {
        title: '第二步：分层估值架构 (Valuation Architecture · 第3–8章 pp. 41–229)',
        question: '不依赖水晶球式的10年远期臆测，如何比市场更精确地衡量内在价值与安全边际？',
        mistake: '华尔街通病：一刀切套用两阶段 DCF（终值占 70%+ 且 ±1% 误差导致估值相差 3 倍）或机械套用粗糙的 EV/EBITDA 倍数。',
        solution: '信息可靠度三层隔离：① 资产价值 AV（清算/重置成本，含账外研发与客户无形资本）；② 零增长盈利能力价值 EPV（全周期调整后 NOPAT / R）；③ 交叉对比 AV 与 EPV 判定商业模式，仅对 EPV > AV 的真护城河企业启用第8章“预期收益率与半衰期衰减模型”。'
      },
      {
        title: '第三步：主动研究策略 (Active Research · 第9章 pp. 301–318)',
        question: '在信息海洋中如何分配有限研究精力，避免确认偏误与价值陷阱？',
        mistake: '华尔街通病：不计重点地堆砌行业报告、盲信 CEO 路演画饼、把“管理层过去业绩好”当成买入理由却忽视股价早已透支。',
        solution: '估值敏感度导向：① 先看间接信号（专精同行持仓、非CEO本地董事增持、发股/发债信号）；② 按估值类型聚焦（困境债盯清偿顺位与时间，竞争型企业盯 AV/EPV 双重底，特许经营企业盯护城河侵蚀与资本配置因子 v）；③ 建立投资决策日志复盘自身偏差。'
      },
      {
        title: '第四步：风险管理与组合架构 (Risk Management · 第10章 pp. 319–337)',
        question: '如何在抵御永久性本金毁灭、宏观极端尾部冲击与自身人性弱点的同时保留超额收益？',
        mistake: '华尔街通病：把股价波动率/Beta 当作风险（导致越跌越觉得危险而割肉）、雇佣几十位基金经理造成 >90% 交易互相抵消的“高费率伪指数化”。',
        solution: '选股与风控分离：① 选股端保持分散专精（每个细分领域仅重仓 5–7 只高安全边际个股），风控端在财富所有者顶层集中统筹；② 严守企业层面安全边际、零杠杆买股、约 30 只跨行业组合消除个体黑天鹅；③ 利用特许经营权穿越通胀/通缩，并在市场自满期购买廉价虚值期权作尾部保险。'
      }
    ];

    const TAXONOMY_DATA = {
      passive: {
        badge: '有效市场派 (Efficient Markets)',
        focus: '放弃主动择时与选股，专注大类资产配置、税务优化与极低费率指数化（ETF/Index）。',
        verdict: '本书评价：对于不具备“≥1000小时专精能力圈”且无法克制追涨杀跌的绝大多数投资者，低成本被动指数是完全理性的基准选择——因为主动投资总体是扣费后的负和博弈（p. 4）。'
      },
      technical: {
        badge: '短期技术与动量派 (Technical / Momentum)',
        focus: '忽略公司基本面，完全依赖价格趋势、成交量形态与短期动量（12个月内存在 +4.2%/年历史动量效应，2009年后收窄至 2.8%/年）。',
        verdict: '本书评价：高频拥挤交易面临高昂冲击成本与税负，且一旦拉长至 24–36 个月，均值回归将彻底逆转动量（p. 4, 23）。'
      },
      stfund: {
        badge: '短期基本面派 (Short-Term Fundamental · 华尔街主流)',
        focus: '计算公式为“未来价格 = 当前市价 + 预期边际变化 Δ”（预测下季度财报超预期、利率变动或新产品催化）。',
        verdict: '本书警示：这是最隐蔽的陷阱！它默认“当前市价总是合理的”，完全无视绝对估值水平（Level）与安全边际；一旦预期差落空或泡沫破裂，下方毫无资产或现金流支撑（pp. 5–6）。'
      },
      value: {
        badge: '格雷厄姆-多德价值投资派 (Long-Term Micro-Fundamental)',
        focus: '聚焦微观企业层面的绝对价值水平（Market Price vs. Intrinsic Value Level），只在市价显著低于可测算内在价值（留足 1/3 至 1/2 安全边际）时出手。',
        verdict: '核心优势：将波动的“市场先生”从风险源转化为报价仆人；价格越跌，Beta 看似升高，但真实安全边际反而越厚（如巴菲特 1973 年以 8000 万美元买入内在价值超 4 亿美元的《华盛顿邮报》，pp. 2, 13）。'
      }
    };

    const BIAS_DATA = {
      psych: [
        {
          title: '① 彩票偏好 (Lottery Ticket Preference, p. 27)',
          desc: '人类天生迷恋小概率暴富故事，系统性高估高增长魅力股（Glamour），导致其长期回报比低增长价值股每年低 9%–10%（LSV 实证）。'
        },
        {
          title: '② 损失厌恶与破产恐惧 (Loss Aversion, pp. 27–28)',
          desc: '卡尼曼与特沃斯基证实亏损痛苦远超等额盈利快感。面对最便宜十分位里的困境股，即便 1/3 幸存者的暴利足以覆盖 2/3 破产股并创造最高组合收益，多数人仍本能逃避。'
        },
        {
          title: '③ 过度自信与忽视概率基准 (Overconfidence, pp. 28–30)',
          desc: '投资者迷信精密财务模型与线性外推（如 2001 年《从优秀到卓越》推崇的 11 家标杆企业随后跑输大盘，Circuit City 与房利美甚至破产）。'
        }
      ],
      inst: [
        {
          title: '① 制度合规与 ESG 一刀切限制 (Mandate Constraints, p. 31)',
          desc: '养老金与捐赠基金受信用评级底线、分红要求或“脏行业”禁投清单束缚，在评级下调时被迫不计价格抛售（制造卡拉曼最爱的“被迫卖家”）。'
        },
        {
          title: '② 百亿规模魔咒与分拆股抛售 (Size Bias & Spin-offs, pp. 31–32)',
          desc: '100亿美元基金若持100只股且单股不超总股本10%，只能买市值 >10亿美元大盘股。当大企业分拆出1亿美元市值的子公司（New Micro）时，大基金看都不看便自动清仓砸出黄金坑！'
        },
        {
          title: '③ 客户讲故事压力与橱窗粉饰 (Window Dressing, pp. 32–34)',
          desc: '“买 IBM/FANG 亏了没人会被解雇，买冷门烂公司亏了立刻丢工作。”季度末清掉账面输家、追买热门股的羊群行为，持续不断地制造错误定价。'
        }
      ]
    };

    const EMPIRICAL_DATASETS = {
      ff: {
        labels: ['魅力股十分位 (最低B/M)', '大盘昂贵股', '价值股十分位 (最高B/M)', '小盘+高B/M价值股'],
        values: [0.64, 0.89, 1.63, 1.92],
        unit: '% / 月均回报',
        colors: ['#9C978B', '#CFCAC0', '#C15F3C', '#28543C'],
        caption: '【Fama & French (1963–1990), 原书 p. 21】按账面市值比（B/M）排序，最便宜十分位月均回报达 1.63%（年化超21%），而最昂贵魅力股仅 0.64%/月；叠加小市值效应后（小盘+低估值）高达 1.92%/月。1927–2018 长达91年间，做多最便宜30%并做空最贵30%的零成本组合年化复利达 3.35%（p. 9）。'
      },
      lsv: {
        labels: ['低B/M魅力股 + 过去5年最快销售增长', '高B/M价值股 + 过去5年最慢销售增长'],
        values: [11.0, 21.0],
        unit: '% / 年化回报',
        colors: ['#AD4C3E', '#3B6E58'],
        caption: '【Lakonishok, Shleifer & Vishny (1994), 原书 p. 22】直接击碎“高增长等于高回报”迷思：过去5年营收增速最慢且估值最低的“丑陋价值股”未来年化回报高达 21.0%，而过去5年增速最快且受追捧的“魅力成长股”未来年化仅 11.0%，年化收益差距高达 10 个百分点！'
      },
      dbt: {
        labels: ['12个月短期动量溢价 (1979–2018)', '2009年后短期动量溢价', '过去24个月输家跑赢赢家 (未来30个月)', '过去36个月输家跑赢赢家 (未来30个月)'],
        values: [4.2, 2.8, 12.0, 18.0],
        unit: '% 超额回报',
        colors: ['#7A766D', '#A8A397', '#C15F3C', '#28543C'],
        caption: '【De Bondt & Thaler (1989) & French 数据库, 原书 p. 23】时间维度决定胜负：在 12 个月窗口内市场呈现短期动量惯性，但一旦拉长至 24 个月与 36 个月，均值回归强力接管——过去 3 年跌幅最大的输家组合在随后 30 个月内跑赢过去 3 年大牛股组合达 +18.0%！'
      },
      drawdown: {
        labels: ['1989–2018 年化复利 (标普500)', '1989–2018 年化复利 (最低市盈率五分位)', '2000–2002 熊市回撤 (标普500)', '2000–2002 熊市回撤 (最低市盈率五分位)'],
        values: [9.2, 12.9, -45.0, -19.0],
        unit: '%',
        colors: ['#7A766D', '#3B6E58', '#AD4C3E', '#C15F3C'],
        caption: '【第1章附录风险实证, 原书 p. 15】1989–2018 三十年间，最便宜市盈率（E/P）五分位年化回报达 12.9%（标普500仅 9.2%），高收益并非来自更高风险：在 2000–2002 科网泡沫崩盘期标普暴跌 -45%，而低估值组合仅回撤 -19%（2007–2009 金融危机两者同跌 -51%）。价值策略之所以未被套利抹平，是因为它在每10年中约有3–4年跑输热门股。'
      }
    };

    const PYRAMID_LAYERS = {
      av: {
        title: '第1层基石：资产价值 AV（第4章 pp. 71–90）—— 依靠最坚实的当期资产负债表',
        body: '• 若行业永久衰退不可存续：采用【清算价值】（格雷厄姆 Net-Net = 流动资产 − 全部负债；如“In the Red”算例：应收打85折、存货5折、固定资产45折、商誉归零）。<br>• 若行业经济存续：采用【重置成本（Reproduction Cost）】——新进入者今天重新搭建同等经营能力需花费多少？必须将账面收购商誉归零，并从第一性原理加回四大账外无形资产：① 研发产品组合（N年研发支出）；② 客户关系簿（新品牌获客成本÷成功率或首年佣金率）；③ 熟练员工招募培训费（约1/3年薪）；④ 组织管理体系（1–3倍年度管理费用）。'
      },
      epv: {
        title: '第2层核心：零增长盈利能力价值 EPV（第5章 pp. 103–121）—— 剥离远期臆测的当期造血现值',
        body: '• 标准5步还原可持续可分配现金流：① 取完整商业周期（7–15年）平均 EBIT 利润率乘以当前可持续营收；② 扣除年均经常性“一次性重组费用”，加回为未来增长超额投入的研发/营销费用；③ 乘以（1 − 可持续有效税率）得 NOPAT；④ 关键资本开支修正：增长型 CapEx = (固定资产/营收比) × Δ营收，真实维护性 CapEx = 总 CapEx − 增长型 CapEx，加回税后（折旧摊销 − 真实维护性 CapEx）——切忌盲目用 EBITDA！⑤ 除以基于信用光谱（6%–13%，摒弃高误差 CAPM Beta）的加权资本成本 R。'
      },
      growth: {
        title: '第3层塔尖：有价值的增长（第6–8章 pp. 141–229）—— 严格限定在护城河壁垒之内',
        body: '• 核心铁律：没有进入壁垒的增长创造净价值为零（ROIC = R），劣质管理下的增长甚至毁灭价值（ROIC < R）！<br>• 仅当 EPV 显著高于重置成本 AV（证明拥有规模经济 × 客户粘性护城河）时，再投资增长才创造正价值。由于永续增长公式误差超100%，本书首创在第8章改用【预期年化收益率模型】为塔尖定价。'
      }
    };

    const STRATEGIC_CASES = {
      caseA: {
        title: '情形 A：AV > EPV（ROIC < 资本成本 R）—— 劣质管理层或行业过剩（经典“价值陷阱”）',
        colorClass: 'bg-rose-50 border-rose-200 text-rose-950',
        body: '公司坐拥1亿美元重置资产却只产出低于资本成本的微薄利润。若投资 $100M 在 ROI=5%（而 R=10%）的项目上，直接毁灭 -$50M 股东价值（表6.2, p. 149）！切勿因“破净”盲目买入，除非：① 有明确的激进股东/并购清算【催化剂】更换管理层释放资产价值（如 Hudson General）；或 ② 买入价远低于悲观 EPV。'
      },
      caseB: {
        title: '情形 B：AV ≈ EPV（相差25%以内，ROIC ≈ R）—— 无进入壁垒的自由竞争行业 + 合格管理层',
        colorClass: 'bg-blue-50 border-blue-200 text-blue-950',
        body: '绝大多数制造业与服务业的常态（如汽车零部件 Magna、家电制造）。自由进出机制使行业盈利向资产重置成本收敛，【增长创造的净价值严格等于零】（投入1元仅换回1元现值）。实战中用 AV 与 EPV 相互三角验证：重资产强周期商品侧重看 AV，轻资产专业服务侧重看 EPV，在行业恐慌期以深幅折价买入。'
      },
      caseC: {
        title: '情形 C：EPV > AV（ROIC 持续显著高于 R）—— 受进入壁垒保护的“特许经营好生意”',
        colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-950',
        body: '如可口可乐（EPV 500–600亿美元远超约300亿资产重置值）、WD-40、See’s Candy。高额超额利润之所以未被竞争者抹平，是因为在位者享有【区域/细分市场规模经济 × 客户粘性】的双重壁垒。唯有在此情形下（且资金投在护城河内部或紧邻领域），增长才真正成为复利机器（如 R=10%, ROI=20%，每投入 $100M 净赚 +$100M 增量价值）！'
      },
      shrink: {
        title: '特别警示：需求萎缩市场的不对称杀伤（第6章 pp. 155–156）',
        colorClass: 'bg-amber-50 border-amber-300 text-amber-950',
        body: '市场通常误以为护城河企业最抗衰退，实则恰恰相反！当行业需求永久萎缩时：普通竞争企业（Case B）可通过变卖营运资金、压缩设备投资收回接近 AV 的现金，抵消利润下滑；而特许经营企业（Case C，如互联网冲击下的地方垄断报纸）原本投入资本极少、全靠高 ROIC 支撑高估值，一旦收入萎缩，几乎没有实物资产可回收变现，还会遭遇反向经营杠杆暴击，导致内在价值断崖式崩塌！'
      }
    };

    const AV_EPV_PRESETS = {
      magna: {
        mktcap: 2240, netcash: 1742, bookeq: 7363, ppeadj: 1155, goodwill: 1160,
        rdcap: 2250, custcap: 1800, orgcap: 750,
        sales: 24000, margin: 5.0, acctadj: 0, tax: 33.33, daadj: 120, wacc: 10.0
      },
      hudson: {
        mktcap: 85, netcash: 70, bookeq: 65, ppeadj: 14, goodwill: 0,
        rdcap: 0, custcap: 0, orgcap: 0,
        sales: 150, margin: 2.0, acctadj: -0.5, tax: 35.0, daadj: 0, wacc: 10.0
      },
      coke: {
        mktcap: 42000, netcash: -4000, bookeq: 14000, ppeadj: 2000, goodwill: 3000,
        rdcap: 1500, custcap: 12000, orgcap: 3500,
        sales: 22000, margin: 28.0, acctadj: 300, tax: 25.0, daadj: 150, wacc: 8.0
      }
    };

    const FRANCHISE_PRESETS = {
      cg: {
        name: 'Consolidated General 标准原型（第8章表8.1–8.2, pp. 191–202）',
        m: 4000, nopat: 240, c: 60, gorg: 3.5, iorg: 4.5, v1: 1.60, rstar: 7.0, hl: 80, mres: 0, useV2: false,
        note: '原书第8章基准教学原型：6%当期盈利收益率 × 60%分红回购 = 3.6%现金回报；3.0%营收增长+0.5%经营杠杆 = 3.5%内生增长；剩余 $91.5M 主动再投资于 v=1.6 的护城河邻近项目贡献 +3.7%，合计基准回报 10.8% 远超 7.0% 资本成本。'
      },
      wd98: {
        name: 'WD-40（1998年9月 @ $26.50/股，企业市价 $403M，pp. 235–244）',
        m: 403, nopat: 23, c: 87, gorg: 4.0, iorg: 1.0, v1: 1.50, rstar: 8.0, hl: 50, mres: 0, useV2: false,
        note: '若只看静态零增长 EPV（$19.36/股），1998年 $26.50 的 WD-40 看似偏贵；但收益率模型揭示：5.0%现金回报 + 4.0%海外内生增长 + 0.74%协同收购（3-In-One 润滑油 v=1.5）= 9.7% 预期回报（显著高于8%资本成本与当时仅6%预期回报的标普500）。此后15年实际年化回报达 10.8%（同期标普仅 5.3%）！'
      },
      wd18: {
        name: 'WD-40（2018年9月 @ $172.10/股，企业市价 $2,429M，pp. 247–250）',
        m: 2429, nopat: 62, c: 97, gorg: 3.0, iorg: 2.0, v1: 1.00, rstar: 8.0, hl: 26, mres: 0, useV2: false,
        note: '2018年估值泡沫警示：高企的市值将现金分配率压低至 2.5%，内生增长降至 3.0%，基准回报仅 5.5%（低于 8.0% 资本成本）；更致命的是亚马逊电商比价与用户评价削弱了传统五金渠道的搜索成本壁垒，年均衰减率升至 2.5%–3.0%，扣除衰减与 V/M 修正后严重高估！'
      },
      intc99: {
        name: 'Intel 英特尔（1999年3月 @ $29.70/股，企业市价 $194B，pp. 278–285）',
        m: 194000, nopat: 6600, c: 53, gorg: 8.5, iorg: 1900, v1: 0.50, rstar: 12.0, hl: 30, mres: 0, useV2: false,
        note: '科网泡沫巅峰体检：1.8%现金分配 + 8.5%内生增长 + 0.3%主动投资 = 10.6%初始回报，已低于12%高风险资本成本；扣除30年半衰期（2.4%/年技术迭代衰减）并经附录 V/M 迭代向下修正后，真实预期回报仅约 5.5%/年！事后验证：1999年后10年英特尔实际年化回报为 -7.3%，15年仅 +0.7%/年。'
      },
      intc18: {
        name: 'Intel 英特尔（2018年3月 @ $47.84/股，企业市价 $232B，pp. 292–299）',
        m: 232000, nopat: 15600, c: 62.5, gorg: 4.0, iorg: 1850, v1: 0.00, rstar: 10.0, hl: 40, mres: 0, useV2: false,
        note: '跨界并购毁灭价值实录：4.2%现金分配 + 4.0%内生增长 = 8.2%初始回报（低于10%资本成本）；管理层在护城河外斥巨资收购 McAfee（$7.7B）、Altera（$14.5B）与 Mobileye（$14.5B），主动投资几乎不创造净价值（二次再投资因子仅 0.33），扣除1.8%衰减与 V/M 修正后预期回报仅约 5.0%。'
      }
    };

    const CASE_STUDIES = {
      hudson: {
        title: '案例 1：Hudson General 哈德森通用公司（1998年夏 · 第4章案例 pp. 91–101）',
        tag: '情形 A：分部资产加总 (SOTP) + 外部催化剂破局价值陷阱',
        kpis: [
          { label: '1998年夏买入市值', val: '$85M ($48/股)' },
          { label: '分部加总资产价值 AV', val: '~$149M–$150M' },
          { label: '现任管理层持续 EPV', val: '$85M (典型价值陷阱)' },
          { label: '1999年2月并购兑现', val: '$133M (+56% / 7个月)' }
        ],
        cards: [
          {
            h: '1. 完美符合第2章搜寻特征的“隐形冷门股”',
            p: '市值仅8500万美元，华尔街零分析师覆盖，登记股东仅182户，同时混杂了母公司巨额现金、合资航空地勤服务（HLLC，汉莎航空已入股26%并持有追加23%期权）以及夏威夷烂尾土地开发（Kohala）。'
          },
          {
            h: '2. 分部资产重置/清算估值（SOTP AV ≈ $149M）',
            p: '① 母公司清算现金与证券 $40M + 汉莎行权即将注入现金 $29.6M ≈ $70M 净现金；② 剩余 51% 存续核心航空地勤 HLLC 按 EPV（调整后NOPAT $12.9M ÷ 10%）及汉莎私募交易对价锚定值 $65M；③ 夏威夷910英亩土地保守清算值 $14M。合计内在资产价值约 $150M，表面安全边际达 43%！'
          },
          {
            h: '3. 致命诊断：为什么现任管理层下 EPV 仅值 $85M？',
            p: '母公司每年挥霍 $4.2M 总部管理费且历史上屡次乱投亏损项目，导致 $70M 现金留在管理层手中只值一半（$20M + 分红现值 $66M = $85M）。若无外部干预，买入就是死水一潭的【情形 A 价值陷阱】！最终管理层试图低价 MBO 激起激进股东反击，引发汉莎航空旗下 Globeground 竞购，以 $133M 现金收购落槌。'
          }
        ],
        chartTitle: 'Hudson General 估值结构与最终并购兑现对比（百万美元 $M）',
        chartLabels: ['1998年二级市场总市值', '现任管理层留任 EPV', '分部加总内在资产价值 (SOTP AV)', '1999年2月汉莎收购成交价'],
        chartDatasets: [
          { label: '估值金额 ($M)', data: [85, 85, 149, 133], backgroundColor: ['#7A766D', '#AD4C3E', '#C15F3C', '#3B6E58'] }
        ],
        tableHead: ['资产分部 / 估值口径', '估值方法（第4–5章准则）', '保守估值 ($M)', '关键锚点说明'],
        tableRows: [
          ['母公司净现金 + 汉莎期权行权款', '账面现金证券清算 + 合同期权现金', '$69.6M', '几乎等同于当前总市值的82%'],
          ['51% HLLC 航空地勤核心业务', '可持续EPV ($127M×51%) & 汉莎PMV对价', '$65.0M', '汉莎购买23%股权出价 $29.6M 交叉验证'],
          ['50% 夏威夷 Kohala 910英亩土地', '分批有序清算折现（扣6%佣金）', '$14.0M', '账面已大幅计提减值后的保守变现值'],
          ['分部加总内在价值 vs 最终收购价', 'SOTP 合计 $149M → 竞价收购兑现', '$133.0M', '外部催化剂消除管理层折价，7个月获利56%']
        ]
      },
      magna: {
        title: '案例 2：Magna International 麦格纳国际（2009年3月 · 第5章案例 pp. 123–140）',
        tag: '情形 B：金融危机恐慌抛售 + 企业价值5%折价 + 财务反舞弊核验',
        kpis: [
          { label: '2009年3月股权市值', val: '$2,240M ($20/股)' },
          { label: '扣除净现金后企业市价', val: '仅 $500M！' },
          { label: '企业重置AV / 企业EPV', val: '$10.4B / $9.2B' },
          { label: '2009–2019 十年年化回报', val: '26.0% / 年' }
        ],
        cards: [
          {
            h: '1. 多重鬼故事叠加制造的世纪错杀',
            p: '2009年3月股价从97美元暴跌80%至20美元：通用与克莱斯勒濒临破产、创始人 Stronach 双层股权独揽控制权并曾挥霍10亿美元搞赛马场（MEC）、俄罗斯寡头 Deripaska 因债务违约被迫清仓2000万股。扣除账上 $1,742M 净现金后，市场给全球顶级汽车零部件巨头的【企业经营总作价仅5亿美元】！'
          },
          {
            h: '2. AV 与 EPV 完美三角验证（情形 B 铁证）',
            p: '① 重置资产 AV：账面净资产 $7,363M + 地产设备调整 $1,155M − 商誉 $1,160M + 5年研发组合 $2,250M + 客户关系 $1,800M + 7.5万熟练工培训 $750M = 股权 AV $12,158M（企业 AV $10,416M）。② 全周期 EPV：$24B正常营收 × 5%周期利润率 × (1−33%税) + $120M超额折旧 = $920M ÷ 10% = 企业 EPV $9,200M（股权 EPV $10,940M）。两者高度吻合，证实其为管理优良的无壁垒竞争型龙头（历史10年ROE 10.4% ≈ 资本成本10%）。'
          },
          {
            h: '3. 面对“好得难以置信”的低价：第5章反欺诈三步铁律',
            p: '以企业内在价值的 5%（股权价值的 20%）买入前，原书执行了严格反舞弊体检：① 过去5年累计真实自由现金流与分红回购完全印证账面利润；② 业务结构简单透明；③ 累计新增投入资本/新增营收比仅 $0.17/美元（对比安然丑闻前高达 $3.00/美元的虚假资本黑洞），彻底排除假账风险。'
          }
        ],
        chartTitle: 'Magna International (2009.03) 市场定价 vs 重置资产 AV vs 盈利能力 EPV（百万美元 $M）',
        chartLabels: ['企业市价 (Enterprise Price)', '企业 EPV', '企业重置成本 AV', '股票市值 (Market Cap)', '股权 EPV', '股权重置成本 AV'],
        chartDatasets: [
          { label: '估值对比 ($M)', data: [500, 9200, 10416, 2240, 10940, 12158], backgroundColor: ['#AD4C3E', '#28543C', '#9E472A', '#C97A6E', '#4F846B', '#D97757'] }
        ],
        tableHead: ['核算维度', '关键调整明细（原书 pp. 129–139）', '企业口径 ($M)', '股权口径 ($M)'],
        tableRows: [
          ['2009年3月市场交易价格', '股价 $20 × 1.12亿股；净现金 $1,742M ($2,951M现金 − $1,209M债)', '$498M (~$500M)', '$2,240M'],
          ['资产重置价值 (AV)', '账面权益 + 地产设备修正 − 商誉 + 研发($2.25B)/客户($1.8B)/人力($0.75B)', '$10,416M', '$12,158M'],
          ['零增长盈利能力 (EPV)', '$24B营收 × 5%利润率 × 66.7%税后 + $120M折旧差 = $920M ÷ 10%', '$9,200M', '$10,940M'],
          ['真实安全边际与事后回报', '企业安全边际高达 95%（股权安全边际 80%）；2010年溢价消除双层股权', '买入仅占EPV 5.4%', '10年年化 +26.0%']
        ]
      },
      wd40: {
        title: '案例 3：WD-40 跨越二十年的特许经营权追踪（1998 / 2000 / 2018 · 第8章案例1 pp. 231–251）',
        tag: '情形 C：消费品利基垄断 · 从黄金买点到电商侵蚀高估',
        kpis: [
          { label: '护城河宽度量化', val: '30% ÷ 0.5% = 60年' },
          { label: '1998年模型预期 vs 15年实绩', val: '9.7% vs 实际 10.8%' },
          { label: '2000年跨界并购拖累期', val: '预期 9.0% (v=0.5)' },
          { label: '2018年高估与电商侵蚀', val: '预期 5.5% < R* 8%' }
        ],
        cards: [
          {
            h: '1. 为什么静态 EPV 会错失 1998 年的 WD-40？',
            p: 'WD-40 占据美国多用途润滑防锈喷雾 80% 市场，每户家庭几年才买一罐（约2美元），消费者绝不会为省几毛钱冒险换牌子（极高客户粘性 + 区域分销规模经济 = 60年护城河）。1998年股价 $26.50 高于静态零增长 EPV（$19.36），但第8章收益率模型算得：5.0%分红 + 4.0%全球内生增长 + 0.75%协同并购（3-In-One）= 9.7% > 8%资本成本，精准捕捉此后15年年化 10.8% 回报（同期标普仅 5.3%）！'
          },
          {
            h: '2. 2000年管理层偏离护城河的教训（v = 0.5）',
            p: '2000年管理层借债跨界收购 Lava 洗手皂、2000 Flushes 洁厕块与 Carpet Fresh 地毯除臭剂，直面宝洁与庄臣等巨头肉搏，资本创造因子跌至 v=0.5，模型预期回报降至 9.0%（扣除1.4%衰减后仅勉强持平8%资本成本）。直到后来剥离非核心业务重回主业，长期回报才恢复。'
          },
          {
            h: '3. 2018年（$172.10/股）的双杀风险：高估值 + 亚马逊渠道变革',
            p: '2018年企业市价飙至 $2,429M（NOPAT仅 $62M），现金收益率跌至 2.5%，加上 3.0% 内生增长仅 5.5% 基准回报（远低于8%资本成本）。同时互联网电商让价格对比与用户评测一目了然，削弱了传统线下货架壁垒，护城河衰减率从 1.4% 翻倍至 2.5%–3.0%！'
          }
        ],
        chartTitle: 'WD-40 三个历史时点的模型预期回报、资本成本门槛与事后15年实际年化回报（%）',
        chartLabels: ['1998年9月 ($26.50)', '2000年9月 ($21.88)', '2018年9月 ($172.10)'],
        chartDatasets: [
          { label: '模型事前预期基准回报 (%)', data: [9.7, 9.0, 5.5], backgroundColor: '#B5852B' },
          { label: '要求资本成本 R* (%)', data: [8.0, 8.0, 8.0], backgroundColor: '#9C978B' },
          { label: '事后15年实际年化回报 (%, 2018尚未满期取0)', data: [10.8, 13.7, 0], backgroundColor: '#3B6E58' }
        ],
        tableHead: ['评估时点与股价', '企业市价 M', '现金分配 + 内生 + 主动投资', '预期基准回报 vs R*', '事后实际年化回报验证'],
        tableRows: [
          ['1998.09 ($26.50/股)', '$403M', '5.0% + 4.0% + 0.74% (v=1.5)', '9.7% > 8.0% (低估买点)', '15年年化 10.8% (标普同期 5.3%)'],
          ['2000.09 ($21.88/股)', '$340M', '4.5% + 4.0% + 0.60% (清洁剂并购 v=0.5)', '9.0% vs 8.0%+1.4%衰减', '5年 8.9% / 10年 9.0% / 纠偏后15年 13.7%'],
          ['2018.09 ($172.10/股)', '$2,429M', '2.5% + 3.0% + 0.0% (电商加速衰减至2.8%)', '5.5% < 8.0% (严重高估)', '模型明确发出估值与护城河双杀预警']
        ]
      },
      intel: {
        title: '案例 4：Intel 英特尔四十三载全生命周期估值（1975–2018 · 第8章案例2 pp. 253–300）',
        tag: '从研发资本化资产买点（1982–1988）到科技特许经营泡沫与并购陷阱（1999–2018）',
        kpis: [
          { label: '1986/1988 资产与EPV买点', val: '随后5年年化 30.7% / 39.5%' },
          { label: '1999.03 泡沫顶模型修正回报', val: '5.5% vs 15年实绩 0.7%' },
          { label: '2003.03 通信并购败局修正回报', val: '3.7% vs 10年实绩 5.2%' },
          { label: '2018.03 跨界并购拖累修正回报', val: '5.0% < 资本成本 10%' }
        ],
        cards: [
          {
            h: '1. 早期科技股也能做扎实资产估值（1975–1991）',
            p: '将英特尔5年研发支出按直线摊销资本化、加回3年50%营销管理费用重建无形资产后，原书发现英特尔在行业低谷期三次跌至调整后账面重置价值与 EPV 附近：1982年1月（$0.47）、1986年8月退出DRAM转型微处理器阵痛期（$0.82）、1988年12月（$1.48），买入后5年实际年化回报分别高达 13.8%、30.7% 与 39.5%！'
          },
          {
            h: '2. 1999年与2003年：附录 V/M 修正公式如何精准刺破泡沫？',
            p: '1999年3月企业市价高达 $194B，初始回报 10.6% 看似尚可，但低于 12% 资本成本；扣除 2.4% 技术半衰期衰减并用 V/M = R/R* 向下修正高估倍数对增长项的虚增后，真实预期回报仅 5.5%！随后10年实际年化 -7.3%。2003年股价腰斩至 $16.66（企业市价 $100B），但80亿美元通信芯片并购惨败（v=0.5），修正后预期回报仅 3.7%，随后10年实际回报 5.2% 仍跑输标普（6.2%）。'
          },
          {
            h: '3. 2018年（$47.84/股）：错失移动时代与天价跨界并购毁灭价值',
            p: 'PC 停滞、错失手机芯片，虽有服务器芯片支撑，但管理层豪掷数百亿美元收购安全软件 McAfee（$7.7B）、Altera（$14.5B）与自动驾驶 Mobileye（$14.5B），均位于核心 x86 护城河之外（二次再投资因子低至 0.33），主动再投资贡献归零，修正后预期回报仅 5.0%（远低于 10% 资本成本）。'
          }
        ],
        chartTitle: 'Intel 六大历史关键时点：模型信号/调整后预期回报 vs 事后真实年化回报（%）',
        chartLabels: ['1982.01 (AV买点)', '1986.08 (AV买点)', '1988.12 (EPV买点)', '1999.03 (泡沫顶)', '2003.03 (并购拖累)', '2018.03 (跨界并购)'],
        chartDatasets: [
          { label: '模型事前预期回报 / 基准门槛 (%)', data: [12.0, 12.0, 12.0, 5.5, 3.7, 5.0], backgroundColor: '#B5852B' },
          { label: '事后5年(前3期)/10年(后2期)实际年化回报 (%)', data: [13.8, 30.7, 39.5, -7.3, 5.2, 0], backgroundColor: '#3B6E58' }
        ],
        tableHead: ['历史节点与拆股调整价', '主导估值工具', '核心基本面与资本配置特征', '模型事前诊断', '事后真实回报验证'],
        tableRows: [
          ['1982.01 ($0.47) & 1986.08 ($0.82)', '研发资本化重置 AV', '市值贴近含5年研发资本的重置净资产', '高安全边际买入', '随后5年年化 13.8% / 30.7%'],
          ['1988.12 ($1.48/股)', 'AV + 386芯片垄断初期EPV', 'x86客户转换成本与规模壁垒成型，股价低于EPV', '特许经营起飞买点', '随后5年年化 39.5% (标普17.5%)'],
          ['1999.03 ($29.70, 企业价$194B)', '特许经营收益率模型', '1.8%分红+8.5%内生+0.3%主动，扣2.4%衰减及V/M修正=5.5%', '严重高估 (<12% R*)', '10年 -7.3%/年；15年仅 +0.7%/年'],
          ['2003.03 ($16.66) & 2018.03 ($47.84)', '特许经营收益率模型', '通信芯片($8B)及McAfee/Altera/Mobileye并购毁灭留存利润', '调整后回报 3.7% / 5.0%', '2003后10年 5.2%/年跑输标普']
        ]
      }
    };

    const DD_ITEMS = [
      { cat: '间接信号', text: '1. 细分领域顶尖价值同行（13F/5%举牌）同步建仓' },
      { cat: '间接信号', text: '2. 非CEO本地资深独立董事或中层业务高管自掏腰包增持' },
      { cat: '间接信号', text: '3. 公司未在低位增发股票融资，且债务优先/契约条款稳健' },
      { cat: '间接信号', text: '4. 清晰掌握市场卖方共识预期，明确自身“差异化认知”来源' },
      { cat: '间接信号', text: '5. 已撰写事前投资决策日志（记录核心假设以防事后归因偏差）' },
      { cat: '间接信号', text: '6. 财务现金流5年累计核验通过（新增资本/新增营收比无异常膨胀）' },
      { cat: '管理层四维', text: '7. 卓越日常运营效率（单位成本处于行业前1/3，非短期裁员粉饰）' },
      { cat: '管理层四维', text: '8. 严守护城河边界配置资本（不搞帝国扩张式跨界并购，v > 1）' },
      { cat: '管理层四维', text: '9. 稳健财务与股东回报纪律（无好项目时果断分红或在低估时回购）' },
      { cat: '管理层四维', text: '10. 逆周期人才储备与清晰继任梯队（行业低谷期不毁灭组织资本）' }
    ];

    const MACRO_REGIMES = {
      inflation: {
        title: '恶性通胀冲击（Inflation Shock · 原书 pp. 331–333）',
        body: '• 【固定收益债券】：遭受毁灭性购买力打击（最差资产）。<br>• 【无壁垒实物资产企业（Case B）】：虽拥有厂房设备重置价值支撑，但历史实证显示仅能提供温和不完全的通胀对冲（税收按名义折旧计征侵蚀真实利润）。<br>• 【特许经营权企业（Case C）】：最强抗通胀利器！凭借强大客户粘性与定价权轻松转嫁成本，且维持运营所需新增名义资本开支极低（正如巴菲特推崇的 See’s Candy）。'
      },
      deflation: {
        title: '通缩萧条冲击（Deflation / Depression · 原书 pp. 331–333）',
        body: '• 【高信用国债与现金】：购买力上升，充当天然通缩对冲工具与抄底弹药库。<br>• 【高杠杆重资产周期股】：产能过剩叠加债务刚性兑付，极易引发永久性股权清零。<br>• 【特许经营权企业（Case C）】：只要核心需求不发生技术替代萎缩，客户粘性保障其维持高现金流分配率，在通胀与通缩两端均具备穿越周期韧性。'
      },
      complacency: {
        title: '宏观尾部风险对冲：为什么买廉价虚值期权远优于做空个股？（原书 pp. 334–335）',
        body: '• 【直接做空高估股票的三大致命伤】：① 盈利全按高税率短期资本利得征税；② 保证金现金回报极低造成现金拖累；③ 最可怕的“反向仓位权重恶化”——做空标的越暴涨，其在组合中的空头敞口越大，未等到泡沫破裂就已被逼仓出局！<br>• 【正确解法】：在市场极度乐观自满、隐含波动率极低时，花小额保费买入深度虚值认沽期权（OTM Puts）或违约保护，最大亏损锁定且崩盘时呈非线性赔付。'
      },
      behavior: {
        title: '个体最大风险源：每年 -600 bps 的行为追涨杀跌损耗（原书 pp. 335–336）',
        body: '• 实证研究（Odean / Dalbar）表明，个人投资者因在牛市顶部亢奋加仓、熊市底部恐慌割肉，实际到手的年化收益比其所持基金本身低约 6 个百分点（600 基点）！<br>• 【制度化克制方案】：预先设定“默认闲置资金停泊池”（如短期国债或等权重低估值股票池）与机械式再平衡规则，强迫自己在市场狂热缺乏标的时自动积累现金、在危机遍地黄金时逆向满仓。'
      }
    };

    const MASTERS_DATA = [
      {
        id: 'buffett', name: 'Warren Buffett 沃伦·巴菲特', firm: 'Berkshire Hathaway', cat: 'franchise',
        x: 85, y: 82,
        tag: '从烟蒂股到持久护城河 + 保险浮存金',
        summary: '在芒格影响下完成现代价值投资最关键跃迁：1972年以2500万美元买下 See’s Candy（仅用800万净有形资产，至2007年累计贡献13.5亿美元税前利润且仅需追加3200万营运资本），对比吞噬资本的航空业，确立“合理价格买入伟大护城河企业”与零成本保险浮存金复利模式（pp. 341–363）。'
      },
      {
        id: 'heilbrunn', name: 'Robert H. Heilbrunn 海尔布伦', firm: 'Heilbrunn Associates', cat: 'deepvalue',
        x: 45, y: 40,
        tag: '“投资于顶尖价值投资者”的鼻祖',
        summary: '1929年大萧条后进入格雷厄姆课堂并共同调研破产债券（如30美分买入净流动资产70美分的 Fisk Tire 债券）；首创个股历史特定市盈率与股息率区间估值法，随后专注于识别并长期委托格雷厄姆、施洛斯与巴菲特管理家族资本（pp. 364–368）。'
      },
      {
        id: 'schloss', name: 'Walter & Edwin Schloss 施洛斯父子', firm: 'WJS Partners', cat: 'deepvalue',
        x: 12, y: 15,
        tag: '极简深度破净百股分散 · 45年年化15.3%',
        summary: '格雷厄姆原教旨统计价值典范：1956–2000年间扣除25%业绩提成后净年化回报达 15.3%（标普工业指数仅 11.5%，1美元复利至662美元 vs 118美元）。只看财报数字、不调研管理层（防被公关洗脑）、持有约100只跌至2–3年新低的低负债破净股（pp. 369–377）。'
      },
      {
        id: 'gabelli', name: 'Mario Gabelli 马里奥·加贝利', firm: 'GAMCO Investors', cat: 'catalyst',
        x: 42, y: 50,
        tag: '私募市场价值 (PMV) + 催化剂事件驱动',
        summary: '师承哥大 Roger Murray，首创【PMV（理性产业买家愿意支付的整合并购价）+ Catalyst（监管松绑、分拆、控制权变更、管理层更替）】框架，深耕有线电视、电信媒体与工业分部加总估值，绝不被动死等市场纠偏（pp. 378–383）。'
      },
      {
        id: 'greenberg', name: 'Glenn Greenberg 格伦·格林伯格', firm: 'Chieftain / Brave Warrior', cat: 'franchise',
        x: 82, y: 95,
        tag: '十股以内极致集中 + 15%预期回报硬门槛',
        summary: '厌恶平庸分散：组合通常不足10只股票，单笔建仓起点 ≥5% 仓位，只买区域垄断有线电视、双寡头等可预测现金流企业，要求至少 15% 预期内部收益率，并实行研究团队全票一致决策机制（pp. 384–390）。'
      },
      {
        id: 'hilal', name: 'Paul Hilal 保罗·希拉尔', firm: 'Mantle Ridge (原 Pershing Square)', cat: 'catalyst',
        x: 58, y: 98,
        tag: '序列式单行业专精建设性积极主义',
        summary: '每次花数年彻底吃透单一垄断/高壁垒但运营低效的大型企业（Case A/C 交界），联合传奇产业领袖改组董事会与CEO，将潜在特许经营权转化为现实暴利——代表作包括与 Hunter Harrison 改造加拿大太平洋铁路（CP）和 CSX，以及与 Seifi Ghasemi 改造空气化工产品（Air Products）（pp. 391–397）。'
      },
      {
        id: 'hummel', name: 'Jan Hummel 扬·胡梅尔', firm: 'Paradigm Capital', cat: 'franchise',
        x: 75, y: 78,
        tag: '欧洲中小型利基冠军专精 + 温和建议型股东',
        summary: '深耕德语区（DACH）、北欧与英国 €2亿–€50亿市值盲区，75%仓位集中于约10只高ROIC细分行业隐形冠军（完整践行本书第8章收益率模型），25%配置观察仓与并购套利，以建设性“建议者（Suggestivist）”身份优化家族/管理层资本配置（pp. 398–402）。'
      },
      {
        id: 'klarman', name: 'Seth Klarman 塞思·卡拉曼', firm: 'Baupost Group', cat: 'deepvalue',
        x: 28, y: 65,
        tag: '下行保护优先 + 猎捕制度性被迫卖家',
        summary: '背靠耐心家族办公室资金，不预设资产类别边界，专门承接机构因评级下调、指数剔除、破产清算或政府清盘（RTC房地产、德士古与安然高级担保债、冷门分拆股）而恐慌抛售的错杀资产，宁可持有高额现金也绝不降低安全边际标准（pp. 403–408）。'
      },
      {
        id: 'price', name: 'Michael Price 迈克尔·普莱斯', firm: 'Mutual Shares / MFP Investors', cat: 'catalyst',
        x: 35, y: 55,
        tag: '2/3 深度分部PMV + 1/3 破产重整与并购套利',
        summary: '传承 Max Heine 体系：三分之二仓位按分部私募价值折价买入便宜股，三分之一布局破产债务重整全周期与已公告并购套利；必要时亲自充当催化剂——1995年买下大通曼哈顿银行6%股份推动其与化学银行合并，释放巨大股东价值（pp. 409–413）。'
      },
      {
        id: 'russo', name: 'Thomas Russo 托马斯·鲁索', firm: 'Gardner, Russo & Gardner', cat: 'franchise',
        x: 92, y: 74,
        tag: '全球家族控股消费品牌 + “承受短期阵痛的能力”',
        summary: '专注啤酒、烈酒、奢侈品与食品全球品牌（喜力、百富门 Jack Daniel’s、雀巢、历峰），核心洞见是【Capacity to Suffer（承受短期利润阵痛的能力）】：家族大股东愿意牺牲未来3–5年 GAAP 报表利润大举投入新兴市场渠道，华尔街短视抛售时恰是长线5折买点（pp. 414–418）。'
      },
      {
        id: 'weiss', name: 'Andrew Weiss 安德鲁·韦斯', firm: 'Weiss Asset Management', cat: 'deepvalue',
        x: 18, y: 35,
        tag: '全球冷门封闭式基金与优先股“双重折价套利”',
        summary: '经济学家出身，专攻全球最晦涩复杂的结构性折价资产：从70年代日本封基、90年代俄罗斯/哈萨克斯坦私有化凭证、英国分级信托到折价超50%的韩国大财阀无投票权优先股，构建“底层资产低估 × 载体折价”的双重安全边际（pp. 419–422）。'
      }
    ];

    // -----------------------------------------------------------------------
    // Navigation & Modal Controllers
    // -----------------------------------------------------------------------
    function toggleBlueprintModal(show) {
      const modal = byId('modal-blueprint');
      if (show) {
        modal.classList.remove('hidden');
      } else {
        modal.classList.add('hidden');
      }
    }

    function switchMainTab(tabId) {
      appState.mainTab = tabId;
      const tabs = ['logic', 'pyramid', 'workbench', 'cases', 'masters'];
      tabs.forEach((t) => {
        const viewEl = byId('view-' + t);
        const navEl = byId('nav-' + t);
        if (t === tabId) {
          viewEl.classList.remove('hidden');
          navEl.className = 'tab-btn-active px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition';
        } else {
          viewEl.classList.add('hidden');
          navEl.className = 'tab-btn-inactive px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition';
        }
      });

      // Re-render charts in newly visible tab so Chart.js measures exact container width
      if (tabId === 'logic') setEmpiricalDataset(appState.empiricalKey);
      if (tabId === 'pyramid') updateDcfSim();
      if (tabId === 'workbench') {
        if (appState.workbenchMode === 'avepv') calcAvEpvWorkbench();
        else calcFranchiseModel();
      }
      if (tabId === 'cases') selectCaseStudy(appState.activeCase);
      if (tabId === 'masters') renderMastersChart();
    }

    // -----------------------------------------------------------------------
    // View 1 Logic: Pipeline, Taxonomy, Biases & Empirical Charts
    // -----------------------------------------------------------------------
    function selectPipelineStep(idx) {
      appState.pipelineStep = idx;
      for (let i = 0; i < 4; i++) {
        const btn = byId('step-btn-' + i);
        const badge = btn.querySelector('div:first-child');
        if (i === idx) {
          btn.className = 'text-left p-3.5 rounded-xl border-2 border-blue-700 bg-blue-50/70 transition shadow-sm';
          badge.className = 'text-xs font-bold text-blue-800';
        } else {
          btn.className = 'text-left p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition';
          badge.className = 'text-xs font-bold text-slate-500';
        }
      }
      const step = PIPELINE_STEPS[idx];
      byId('pipeline-detail-box').innerHTML = `
        <div class="space-y-1">
          <div class="text-xs font-bold text-blue-900">${step.title}</div>
          <p class="text-xs text-slate-700 leading-relaxed font-medium">核心拷问：“${step.question}”</p>
        </div>
        <div class="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
          <div class="text-xs font-bold text-rose-700">✕ 对手方常见败因</div>
          <p class="text-xs text-slate-600 leading-relaxed">${step.mistake}</p>
        </div>
        <div class="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
          <div class="text-xs font-bold text-emerald-800">✓ 格雷厄姆-多德解法</div>
          <p class="text-xs text-slate-700 leading-relaxed">${step.solution}</p>
        </div>
      `;
    }

    function selectTaxonomy(key) {
      appState.taxonomy = key;
      ['passive', 'technical', 'stfund', 'value'].forEach((k) => {
        const el = byId('tax-' + k);
        el.className = (k === key ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2.5 py-2 rounded-lg text-xs font-semibold border transition';
      });
      const item = TAXONOMY_DATA[key];
      byId('taxonomy-detail').innerHTML = `
        <div class="font-bold text-slate-900">${item.badge}</div>
        <p class="text-slate-700 leading-relaxed"><strong>核心机制：</strong>${item.focus}</p>
        <p class="text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">${item.verdict}</p>
      `;
    }

    function setBiasTab(tab) {
      appState.biasTab = tab;
      byId('bias-psych').className = (tab === 'psych' ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2.5 py-1 rounded text-xs font-semibold border transition';
      byId('bias-inst').className = (tab === 'inst' ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2.5 py-1 rounded text-xs font-semibold border transition';
      const list = BIAS_DATA[tab];
      byId('bias-cards-container').innerHTML = list.map((b) => `
        <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <div class="font-bold text-slate-800">${b.title}</div>
          <div class="text-slate-600 mt-0.5 leading-relaxed">${b.desc}</div>
        </div>
      `).join('');
    }

    function setEmpiricalDataset(key) {
      appState.empiricalKey = key;
      ['ff', 'lsv', 'dbt', 'drawdown'].forEach((k) => {
        const btn = byId('emp-btn-' + k);
        btn.className = (k === key ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition';
      });

      const ds = EMPIRICAL_DATASETS[key];
      byId('empirical-caption').textContent = ds.caption;

      const ctx = byId('chart-empirical').getContext('2d');
      if (charts.empirical) charts.empirical.destroy();
      charts.empirical = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ds.labels,
          datasets: [{
            label: ds.unit,
            data: ds.values,
            backgroundColor: ds.colors,
            borderRadius: 6,
            maxBarThickness: 56
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctxItem) => `${ctxItem.parsed.y.toFixed(2)} ${ds.unit}`
              }
            }
          },
          scales: {
            y: {
              grid: { color: '#E3E0D5' },
              ticks: { callback: (v) => v + '%' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 11 } }
            }
          }
        }
      });
    }

    // -----------------------------------------------------------------------
    // View 2 Logic: DCF Simulator, Pyramid, Moat Years & Leverage Trap
    // -----------------------------------------------------------------------
    function updateDcfSim() {
      const r = parseFloat(byId('dcf-r').value);
      const g = parseFloat(byId('dcf-g').value);
      const err = parseFloat(byId('dcf-err').value);

      byId('dcf-r-val').textContent = r.toFixed(1) + '%';
      byId('dcf-g-val').textContent = g.toFixed(1) + '%';
      byId('dcf-err-val').textContent = '±' + err.toFixed(2) + '%';

      const spreadLow = Math.max(0.5, (r + err) - (g - err));
      const spreadBase = Math.max(0.5, r - g);
      const spreadHigh = Math.max(0.4, (r - err) - (g + err));

      const multLow = 100 / spreadLow;
      const multBase = 100 / spreadBase;
      const multHigh = 100 / spreadHigh;
      const ratio = multHigh / multLow;

      byId('dcf-mult-low').textContent = multLow.toFixed(1) + 'x';
      byId('dcf-mult-base').textContent = multBase.toFixed(1) + 'x';
      byId('dcf-mult-high').textContent = multHigh.toFixed(1) + 'x';

      byId('dcf-swing-callout').innerHTML =
        `<strong>实验结论（原书 p. 47）：</strong>仅当 R 与 g 各自发生 <strong>±${err.toFixed(2)}%</strong> 的常规估计偏差，永续终值倍数便从 <strong>${multLow.toFixed(1)}x</strong> 暴涨至 <strong>${multHigh.toFixed(1)}x</strong>（高低极值相差 <strong>${ratio.toFixed(1)} 倍</strong>）！在如此巨大的估值噪音面前，任何50%的安全边际都会沦为幻觉——因此必须将零增长盈利（EPV）与增长价值拆开评估。`;

      const ctx = byId('chart-dcf').getContext('2d');
      if (charts.dcf) charts.dcf.destroy();
      charts.dcf = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['悲观终值倍数 (R+ε, g−ε)', '基准终值倍数 1/(R−g)', '乐观终值倍数 (R−ε, g+ε)'],
          datasets: [{
            label: '永续现金流倍数 (x)',
            data: [multLow, multBase, multHigh],
            backgroundColor: ['#7A766D', '#C15F3C', '#AD4C3E'],
            borderRadius: 6,
            maxBarThickness: 42
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, grid: { color: '#E3E0D5' }, ticks: { callback: (v) => v + 'x' } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    function selectPyramidLayer(layer) {
      appState.pyramidLayer = layer;
      const item = PYRAMID_LAYERS[layer];
      byId('pyramid-layer-detail').innerHTML = `
        <div class="font-bold text-slate-900">${item.title}</div>
        <div class="text-slate-700 mt-1">${item.body}</div>
      `;
    }

    function selectStrategicCase(cKey) {
      appState.strategicCase = cKey;
      ['caseA', 'caseB', 'caseC', 'shrink'].forEach((k) => {
        const btn = byId('sc-' + k);
        btn.className = (k === cKey ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2 py-1.5 rounded-lg text-xs font-semibold border transition';
      });
      const info = STRATEGIC_CASES[cKey];
      const box = byId('strategic-case-detail');
      box.className = `mt-2.5 p-3.5 rounded-xl border text-xs leading-relaxed ${info.colorClass}`;
      box.innerHTML = `<div class="font-bold mb-1">${info.title}</div><div>${info.body}</div>`;
    }

    function loadMoatPreset(preset) {
      const map = {
        coke: { share: 20, turn: 0.2 },
        wd40: { share: 30, turn: 0.5 },
        lux: { share: 2, turn: 1.0 }
      };
      const cfg = map[preset];
      byId('moat-share').value = cfg.share;
      byId('moat-turn').value = cfg.turn;
      ['coke', 'wd40', 'lux'].forEach((k) => {
        const el = byId('moat-pre-' + k);
        el.className = k === preset
          ? 'px-2.5 py-1 rounded text-xs font-semibold bg-indigo-900 text-white'
          : 'px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200';
      });
      updateMoatCalc();
    }

    function updateMoatCalc() {
      const share = parseFloat(byId('moat-share').value);
      const turn = Math.max(0.1, parseFloat(byId('moat-turn').value));
      const years = share / turn;

      byId('moat-share-val').textContent = share.toFixed(1) + '%';
      byId('moat-turn-val').textContent = turn.toFixed(1) + '%/年';
      byId('moat-years-out').textContent = years.toFixed(1) + ' 年';

      let verdict = '';
      if (years >= 40) verdict = '坚不可摧的顶级特许经营护城河（EPV ≫ AV）';
      else if (years >= 15) verdict = '稳固的中期竞争壁垒（具备可观超额收益期）';
      else if (years >= 5) verdict = '有限壁垒（需密切监控技术与渠道变迁）';
      else verdict = '伪护城河！新进入者仅需数年即可站稳脚跟（EPV → AV）';
      byId('moat-verdict-label').textContent = verdict;
    }

    function resetLeverageSim() {
      byId('lev-epv').value = 800;
      byId('lev-debt').value = 650;
      byId('lev-mc').value = 75;
      byId('lev-shock').value = 15;
      updateLeverageSim();
    }

    function updateLeverageSim() {
      const entEpv = parseFloat(byId('lev-epv').value);
      const netDebt = parseFloat(byId('lev-debt').value);
      const mktCap = parseFloat(byId('lev-mc').value);
      const shockPct = parseFloat(byId('lev-shock').value);

      byId('lev-epv-val').textContent = '$' + entEpv + 'M';
      byId('lev-debt-val').textContent = '$' + netDebt + 'M';
      byId('lev-mc-val').textContent = '$' + mktCap + 'M';
      byId('lev-shock-val').textContent = '-' + shockPct + '%';

      const eqEpv = Math.max(0, entEpv - netDebt);
      const entPrice = netDebt + mktCap;

      const eqMos = eqEpv > 0 ? ((eqEpv - mktCap) / eqEpv) * 100 : -100;
      const entMos = entEpv > 0 ? ((entEpv - entPrice) / entEpv) * 100 : -100;

      const postEntEpv = entEpv * (1 - shockPct / 100);
      const postEqVal = Math.max(0, postEntEpv - netDebt);
      const eqLossPct = mktCap > 0 ? ((postEqVal - mktCap) / mktCap) * 100 : 0;

      byId('lev-eq-mos').textContent = eqMos.toFixed(1) + '%';
      byId('lev-eq-sub').textContent = `股权EPV $${eqEpv.toFixed(0)}M vs 市值 $${mktCap.toFixed(0)}M`;

      byId('lev-ent-mos').textContent = entMos.toFixed(1) + '%';
      byId('lev-ent-sub').textContent = `企业EPV $${entEpv.toFixed(0)}M vs 企业市价 $${entPrice.toFixed(0)}M`;

      const sign = eqLossPct >= 0 ? '+' : '';
      byId('lev-post-eq').textContent = `$${postEqVal.toFixed(0)}M (${sign}${eqLossPct.toFixed(0)}%)`;
      byId('lev-post-sub').textContent = `企业EPV降至 $${postEntEpv.toFixed(0)}M 后的股东残值`;
    }

    // -----------------------------------------------------------------------
    // View 3 Logic: Dual Valuation Workbench (Mode A: AV+EPV | Mode B: Return)
    // -----------------------------------------------------------------------
    function switchWorkbenchMode(mode) {
      appState.workbenchMode = mode;
      const btnA = byId('wb-mode-avepv');
      const btnB = byId('wb-mode-franchise');
      const panA = byId('wb-panel-avepv');
      const panB = byId('wb-panel-franchise');

      if (mode === 'avepv') {
        btnA.className = 'sub-pill-active px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition';
        btnB.className = 'sub-pill-inactive px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition';
        panA.classList.remove('hidden');
        panB.classList.add('hidden');
        calcAvEpvWorkbench();
      } else {
        btnB.className = 'sub-pill-active px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition';
        btnA.className = 'sub-pill-inactive px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition';
        panB.classList.remove('hidden');
        panA.classList.add('hidden');
        calcFranchiseModel();
      }
    }

    function loadAvEpvPreset(key) {
      const p = AV_EPV_PRESETS[key];
      byId('av-mktcap').value = p.mktcap;
      byId('av-netcash').value = p.netcash;
      byId('av-bookeq').value = p.bookeq;
      byId('av-ppeadj').value = p.ppeadj;
      byId('av-goodwill').value = p.goodwill;
      byId('av-rdcap').value = p.rdcap;
      byId('av-custcap').value = p.custcap;
      byId('av-orgcap').value = p.orgcap;

      byId('epv-sales').value = p.sales;
      byId('epv-margin').value = p.margin;
      byId('epv-acctadj').value = p.acctadj;
      byId('epv-tax').value = p.tax;
      byId('epv-daadj').value = p.daadj;
      byId('epv-wacc').value = p.wacc;

      ['magna', 'hudson', 'coke'].forEach((k) => {
        const el = byId('preset-av-' + k);
        el.className = k === key
          ? 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-900 text-white'
          : 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200';
      });
      calcAvEpvWorkbench();
    }

    function numVal(id, fallback = 0) {
      const v = parseFloat(byId(id).value);
      return Number.isFinite(v) ? v : fallback;
    }

    function calcAvEpvWorkbench() {
      const mktCap = Math.max(0, numVal('av-mktcap', 0));
      const netCash = numVal('av-netcash', 0);
      const bookEq = numVal('av-bookeq', 0);
      const ppeAdj = numVal('av-ppeadj', 0);
      const goodwill = numVal('av-goodwill', 0);
      const rdCap = numVal('av-rdcap', 0);
      const custCap = numVal('av-custcap', 0);
      const orgCap = numVal('av-orgcap', 0);

      const sales = Math.max(0, numVal('epv-sales', 0));
      const margin = numVal('epv-margin', 0) / 100;
      const acctAdj = numVal('epv-acctadj', 0);
      const tax = Math.min(0.9, Math.max(0, numVal('epv-tax', 25) / 100));
      const daAdj = numVal('epv-daadj', 0);
      const wacc = Math.max(0.03, numVal('epv-wacc', 10) / 100);

      byId('epv-wacc-label').textContent = (wacc * 100).toFixed(2) + '%';

      const eqAv = bookEq + ppeAdj - goodwill + rdCap + custCap + orgCap;
      const entAv = eqAv - netCash;
      const entPrice = mktCap - netCash;

      const ebit = sales * margin + acctAdj;
      const nopat = ebit * (1 - tax) + daAdj;
      const entEpv = nopat / wacc;
      const eqEpv = entEpv + netCash;

      byId('out-ent-price').textContent = '$' + Math.round(entPrice).toLocaleString() + 'M';
      byId('out-eq-price').textContent = '股权 $' + Math.round(mktCap).toLocaleString() + 'M';
      byId('out-ent-av').textContent = '$' + Math.round(entAv).toLocaleString() + 'M';
      byId('out-eq-av').textContent = '股权 $' + Math.round(eqAv).toLocaleString() + 'M';
      byId('out-ent-epv').textContent = '$' + Math.round(entEpv).toLocaleString() + 'M';
      byId('out-eq-epv').textContent = '股权 $' + Math.round(eqEpv).toLocaleString() + 'M';

      const ratio = entAv > 0 ? entEpv / entAv : 1;
      let caseBadge = '';
      if (ratio < 0.78) {
        caseBadge = '【情形 A：AV > EPV（价值陷阱风险）】管理层未能赚回资本成本，若无外部激进催化剂或控制权变更，切忌按AV盲目给溢价！';
      } else if (ratio <= 1.25) {
        caseBadge = '【情形 B：AV ≈ EPV（无壁垒竞争均衡）】管理合格但无超额进入壁垒，增长净价值≈0；AV与EPV形成坚实交叉验证！';
      } else {
        caseBadge = '【情形 C：EPV > AV（特许经营护城河）】拥有显著竞争壁垒（超额ROIC），建议切换至“模式 B：预期收益率模型”计入护城河内增长价值！';
      }

      const refIntrinsic = Math.max(1, ratio < 0.78 ? eqEpv : Math.min(eqAv, eqEpv));
      const eqMos = ((refIntrinsic - mktCap) / refIntrinsic) * 100;
      byId('out-avepv-diagnosis').innerHTML = `
        <div class="font-bold text-amber-300">企业 EPV / AV 比值 = ${ratio.toFixed(2)}x · 保守股权安全边际 = ${eqMos.toFixed(1)}%</div>
        <div class="mt-1 text-slate-200">${caseBadge}</div>
      `;

      const ctx = byId('chart-wb-avepv').getContext('2d');
      if (charts.wbAvEpv) charts.wbAvEpv.destroy();
      charts.wbAvEpv = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['企业口径 (Enterprise)', '股权口径 (Equity)'],
          datasets: [
            { label: '市场价格', data: [entPrice, mktCap], backgroundColor: '#7A766D', borderRadius: 4 },
            { label: '重置资产 AV', data: [entAv, eqAv], backgroundColor: '#B5852B', borderRadius: 4 },
            { label: '盈利能力 EPV', data: [entEpv, eqEpv], backgroundColor: '#3B6E58', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: {
            y: { grid: { color: '#E3E0D5' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    function loadFranchisePreset(key) {
      const p = FRANCHISE_PRESETS[key];
      byId('fr-m').value = p.m;
      byId('fr-nopat').value = p.nopat;
      byId('fr-c').value = p.c;
      byId('fr-gorg').value = p.gorg;
      byId('fr-iorg').value = p.iorg;
      byId('fr-v1').value = p.v1;
      byId('fr-rstar').value = p.rstar;
      byId('fr-hl').value = p.hl;
      byId('fr-mres').value = p.mres;
      byId('fr-use-v2').checked = p.useV2;

      ['cg', 'wd98', 'wd18', 'intc99', 'intc18'].forEach((k) => {
        const el = byId('fr-pre-' + k);
        el.className = (k === key ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition';
      });
      appState.franchiseNote = p.note;
      calcFranchiseModel();
    }

    function calcFranchiseModel() {
      const M = Math.max(1, numVal('fr-m', 4000));
      const nopat = Math.max(0, numVal('fr-nopat', 240));
      const cRatio = numVal('fr-c', 60) / 100;
      const gOrg = numVal('fr-gorg', 3.5);
      const iOrg = Math.max(0, numVal('fr-iorg', 4.5));
      const v1 = Math.max(0, numVal('fr-v1', 1.6));
      const rStar = Math.max(1.0, numVal('fr-rstar', 7.0));
      const halfLife = Math.max(5, numVal('fr-hl', 80));
      const mRes = numVal('fr-mres', 0) / 100;
      const useV2 = byId('fr-use-v2').checked;

      byId('fr-c-val').textContent = (cRatio * 100).toFixed(1) + '%';
      byId('fr-gorg-val').textContent = gOrg.toFixed(2) + '%';
      byId('fr-v1-val').textContent = v1.toFixed(2) + 'x';
      byId('fr-rstar-val').textContent = rStar.toFixed(2) + '%';
      byId('fr-hl-val').textContent = halfLife.toFixed(0) + ' 年';
      byId('fr-mres-val').textContent = (mRes * 100).toFixed(0) + '%';

      // Ch. 8 Appendix Eq. 36 secondary reinvestment factor
      let vEff = v1;
      if (useV2) {
        const denom = Math.max(0.12, 1 - (1 - cRatio) * v1);
        vEff = (cRatio * v1) / denom;
      }
      byId('fr-veff-badge').textContent = `有效 v = ${vEff.toFixed(2)}x`;

      const cashDist = nopat * cRatio;
      const retained = Math.max(0, nopat - cashDist);
      const activeInv = Math.max(0, retained - iOrg);

      const yCash = (cashDist / M) * 100;
      const yAct = ((activeInv * vEff) / M) * 100;
      const totalG = gOrg + yAct;
      const rBenchmark = yCash + totalG;

      // Rule of 72 franchise decay rate f = (72 / T_half) * (1 - m)
      const fadeRate = (72 / halfLife) * (1 - mRes);
      const rPostFade = rBenchmark - fadeRate;
      const spread1 = rPostFade - rStar;

      // Ch. 8 Footnote 18 & Appendix iterative V/M = R/R* adjustment
      const vmProxy = Math.max(0, rPostFade / rStar);
      const rB2Pre = yCash + totalG * vmProxy;
      const rB2Post = rB2Pre - fadeRate;

      byId('fr-out-cash').textContent = yCash.toFixed(2) + '%';
      byId('fr-out-org').textContent = gOrg.toFixed(2) + '%';
      byId('fr-out-act').textContent = yAct.toFixed(2) + '%';
      byId('fr-out-fade').textContent = '-' + fadeRate.toFixed(2) + '%';

      byId('fr-out-rb').textContent = rBenchmark.toFixed(1) + '%';
      byId('fr-out-rbfade').textContent = rPostFade.toFixed(1) + '%';
      const sSign = spread1 >= 0 ? '+' : '';
      byId('fr-out-spread1').textContent = `对比 R* ${rStar.toFixed(1)}% (${sSign}${spread1.toFixed(1)}%)`;
      byId('fr-out-rb2').textContent = rB2Post.toFixed(1) + '%';

      const verdictBox = byId('fr-verdict-box');
      let statusHtml = '';
      if (rB2Post >= rStar + 1.5) {
        verdictBox.className = 'p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 leading-relaxed';
        statusHtml = `<strong class="text-emerald-900">✓ 具备显著收益率安全边际（预期回报超资本成本 +${(rB2Post - rStar).toFixed(1)}%）：</strong>由于 <strong>R<sub>B</sub> − f &gt; R*</strong>（即内在价值 <strong>V &gt; M</strong>），第8章附录证明增长项按 <strong>V/M</strong> 放大后真实回报（${rB2Post.toFixed(1)}%）比静态基准（${rPostFade.toFixed(1)}%）更优！`;
      } else if (rB2Post >= rStar - 0.5) {
        verdictBox.className = 'p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-slate-800 leading-relaxed';
        statusHtml = `<strong class="text-amber-900">⚠ 定价接近公允水平（安全边际不足）：</strong>扣除护城河衰减率（-${fadeRate.toFixed(2)}%/年）后预期回报与资本成本 ${rStar.toFixed(1)}% 大致相当，建议等待更佳价格或更高确定性。`;
      } else {
        verdictBox.className = 'p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-slate-800 leading-relaxed';
        statusHtml = `<strong class="text-rose-900">✕ 估值过高 / 护城河侵蚀预警（低于资本成本 ${(rB2Post - rStar).toFixed(1)}%）：</strong>当 <strong>R<sub>B</sub> − f &lt; R*</strong>（即 <strong>V &lt; M</strong>）时，附录公式揭示高估值倍数会反向压低增长带来的真实股东收益率（从初始 ${rBenchmark.toFixed(1)}% 暴跌至修正后 ${rB2Post.toFixed(1)}%）。`;
      }
      const presetNote = appState.franchiseNote ? `<div class="mt-1.5 pt-1.5 border-t border-black/10 text-slate-600">${appState.franchiseNote}</div>` : '';
      verdictBox.innerHTML = statusHtml + presetNote;

      const ctx = byId('chart-wb-return').getContext('2d');
      if (charts.wbReturn) charts.wbReturn.destroy();
      charts.wbReturn = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['现金分配 D/M', '内生增长 g_org', '主动投资回报', '初始基准 R_B', '扣衰减 R_B−f', 'V/M修正真实 R_B2', '资本成本门槛 R*'],
          datasets: [{
            label: '年化收益率 (%)',
            data: [yCash, gOrg, yAct, rBenchmark, rPostFade, rB2Post, rStar],
            backgroundColor: ['#C15F3C', '#3B6E58', '#8C6239', '#2E2D2A', '#B5852B', rB2Post >= rStar ? '#28543C' : '#AD4C3E', '#9C978B'],
            borderRadius: 5,
            maxBarThickness: 40
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: '#E3E0D5' }, ticks: { callback: (v) => v + '%' } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    // -----------------------------------------------------------------------
    // View 4 Logic: 4 Empirical Case Studies Explorer
    // -----------------------------------------------------------------------
    function selectCaseStudy(key) {
      appState.activeCase = key;
      ['hudson', 'magna', 'wd40', 'intel'].forEach((k) => {
        const btn = byId('case-btn-' + k);
        btn.className = (k === key ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-3 py-2 rounded-xl text-xs font-semibold border transition';
      });

      const c = CASE_STUDIES[key];
      byId('case-header-banner').innerHTML = `
        <div class="md:col-span-4 border-b border-white/15 pb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div class="font-bold text-sm sm:text-base text-white">${c.title}</div>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-300/30">${c.tag}</span>
        </div>
        ${c.kpis.map((k) => `
          <div>
            <div class="text-xs text-slate-300">${k.label}</div>
            <div class="text-base sm:text-lg font-bold text-amber-300 mono-num mt-0.5">${k.val}</div>
          </div>
        `).join('')}
      `;

      byId('case-narrative-cards').innerHTML = c.cards.map((card) => `
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div class="text-xs sm:text-sm font-bold text-slate-900">${card.h}</div>
          <p class="text-xs text-slate-700 leading-relaxed">${card.p}</p>
        </div>
      `).join('');

      byId('case-chart-title').textContent = c.chartTitle;
      byId('case-table-head').innerHTML = `<tr>${c.tableHead.map((th) => `<th class="px-3 py-2">${th}</th>`).join('')}</tr>`;
      byId('case-table-body').innerHTML = c.tableRows.map((row) => `
        <tr class="hover:bg-slate-50">
          ${row.map((cell, idx) => `<td class="px-3 py-2 ${idx === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'}">${cell}</td>`).join('')}
        </tr>
      `).join('');

      const ctx = byId('chart-case').getContext('2d');
      if (charts.caseStudy) charts.caseStudy.destroy();
      charts.caseStudy = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: c.chartLabels,
          datasets: c.chartDatasets.map((d) => ({ ...d, borderRadius: 5, maxBarThickness: 44 }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: c.chartDatasets.length > 1, position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            y: { grid: { color: '#E3E0D5' } },
            x: { grid: { display: false }, ticks: { font: { size: 11 } } }
          }
        }
      });
    }

    // -----------------------------------------------------------------------
    // View 5 Logic: Active Research Checklist, Risk Sim & 11 Superinvestors
    // -----------------------------------------------------------------------
    function renderDueDiligence() {
      const container = byId('dd-checklist-container');
      container.innerHTML = DD_ITEMS.map((item, idx) => {
        const checked = appState.ddChecked[idx];
        return `
          <button type="button" data-gbv-click="toggleChecklistItem(${idx})" class="text-left p-2.5 rounded-xl border transition flex items-start gap-2 ${checked ? 'bg-blue-50/80 border-blue-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-500'}">
            <span class="mt-0.5 font-bold ${checked ? 'text-blue-700' : 'text-slate-400'}">${checked ? '☑' : '☐'}</span>
            <div>
              <span class="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${item.cat === '管理层四维' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'}">${item.cat}</span>
              <div class="mt-0.5 leading-snug font-medium">${item.text}</div>
            </div>
          </button>
        `;
      }).join('');

      const totalScore = appState.ddChecked.filter(Boolean).length;
      const mgmtScore = appState.ddChecked.slice(6, 10).filter(Boolean).length;

      let msg = '';
      if (mgmtScore <= 1) {
        msg = '警示：管理层质量得分极低（疑似价值陷阱 Case A）！根据第9章准则，必须具备明确的【外部接管/激进主义催化剂】方可建仓。';
      } else if (totalScore >= 8) {
        msg = '优秀：间接验证与管理层四维高度契合，无需强制依赖外部催化剂，时间站在股东一侧。';
      } else {
        msg = '中等：部分间接信号或资本配置尚待核实，建议严控仓位上限并针对薄弱项做深度行业访谈。';
      }

      byId('dd-score-banner').innerHTML = `
        <div>
          <div class="text-xs text-amber-300 font-bold">主动研究完备度：${totalScore}/10 · 管理层四维：${mgmtScore}/4</div>
          <div class="text-xs text-slate-200 mt-0.5">${msg}</div>
        </div>
      `;
    }

    function toggleChecklistItem(idx) {
      appState.ddChecked[idx] = !appState.ddChecked[idx];
      renderDueDiligence();
    }

    function resetDueDiligence() {
      appState.ddChecked = DD_ITEMS.map(() => false);
      renderDueDiligence();
    }

    function updateRiskSim() {
      const n = parseInt(byId('risk-n').value, 10);
      const industries = Math.max(1, Math.round(n / 2));
      // Illustrative idiosyncratic permanent impairment tail reduction (1 / sqrt(N) concentration decay)
      const singleStockShock = (40 / Math.sqrt(n)).toFixed(1);
      const maxSingleWeight = (100 / n).toFixed(1);

      byId('risk-n-val').textContent = `${n} 只股票（约覆盖 ${industries} 个细分行业）`;

      let comment = '';
      if (n < 8) {
        comment = `单股权重高达 ${maxSingleWeight}%（类似格林伯格/希拉尔极度集中模式），要求对每家公司的护城河与无杠杆资产负债表具备近乎绝对的把握，单次误判可造成重大永久性回撤。`;
      } else if (n <= 40) {
        comment = `处于第10章推荐的【黄金平衡区间（约30只跨15个行业的低相关价值股，由4–6位行业专精者各自贡献5–7只最佳标的）】：单股权重 ${maxSingleWeight}%，将个体估值误判导致的组合永久减损尾部风险压缩至约 ±${singleStockShock}%，同时彻底避免多管理人交易互抵！`;
      } else {
        comment = `持仓较分散（单股权重 ${maxSingleWeight}%，接近施洛斯统计深价模式）：个体黑天鹅几乎完全消除，但若非纯定量破净策略，需警惕研究深度稀释沦为高费率准指数基金。`;
      }
      byId('risk-n-readout').textContent = comment;
    }

    function selectMacroRegime(key) {
      appState.macroRegime = key;
      const mapIds = { inflation: 'macro-inf', deflation: 'macro-def', complacency: 'macro-opt', behavior: 'macro-beh' };
      Object.keys(mapIds).forEach((k) => {
        const el = byId(mapIds[k]);
        el.className = (k === key ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2 py-1.5 rounded-lg text-xs font-semibold border transition';
      });
      const info = MACRO_REGIMES[key];
      byId('macro-regime-detail').innerHTML = `
        <div class="font-bold text-slate-900 mb-1">${info.title}</div>
        <div class="text-slate-700">${info.body}</div>
      `;
    }

    function filterMasters(cat) {
      appState.masterFilter = cat;
      ['all', 'franchise', 'deepvalue', 'catalyst'].forEach((k) => {
        const btn = byId('mfilt-' + k);
        btn.className = (k === cat ? 'sub-pill-active' : 'sub-pill-inactive') + ' px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition';
      });
      renderMastersGrid();
      renderMastersChart();
    }

    function renderMastersGrid() {
      const list = appState.masterFilter === 'all'
        ? MASTERS_DATA
        : MASTERS_DATA.filter((m) => m.cat === appState.masterFilter);

      const badgeColors = {
        franchise: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        deepvalue: 'bg-blue-100 text-blue-900 border-blue-200',
        catalyst: 'bg-amber-100 text-amber-900 border-amber-300'
      };

      byId('masters-cards-grid').innerHTML = list.map((m) => `
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2 hover:border-slate-400 transition">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-slate-500">${m.firm}</span>
              <span class="text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeColors[m.cat]}">${m.tag}</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 mt-1.5">${m.name}</h4>
            <p class="text-xs text-slate-700 mt-1.5 leading-relaxed">${m.summary}</p>
          </div>
          <div class="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500 mono-num">
            <span>护城河倾向指数: ${m.x}/100</span>
            <span>持仓集中度指数: ${m.y}/100</span>
          </div>
        </div>
      `).join('');
    }

    function renderMastersChart() {
      const filteredIds = new Set(
        (appState.masterFilter === 'all' ? MASTERS_DATA : MASTERS_DATA.filter((m) => m.cat === appState.masterFilter)).map((m) => m.id)
      );

      const points = MASTERS_DATA.map((m) => ({
        x: m.x,
        y: m.y,
        name: m.name,
        tag: m.tag,
        active: filteredIds.has(m.id),
        cat: m.cat
      }));

      const bgColors = points.map((p) => {
        if (!p.active) return 'rgba(156, 151, 139, 0.28)';
        if (p.cat === 'franchise') return '#3B6E58';
        if (p.cat === 'catalyst') return '#C15F3C';
        return '#6E5A3A';
      });

      const radii = points.map((p) => (p.active ? 8 : 5));

      const ctx = byId('chart-masters').getContext('2d');
      if (charts.masters) charts.masters.destroy();
      charts.masters = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: '价值投资大师战略坐标',
            data: points,
            backgroundColor: bgColors,
            pointRadius: radii,
            pointHoverRadius: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctxItem) => {
                  const raw = ctxItem.raw;
                  return `${raw.name} — ${raw.tag}`;
                }
              }
            }
          },
          scales: {
            x: {
              min: 0,
              max: 100,
              title: { display: true, text: '估值锚点光谱：深度资产折价/套利 (0)  ──────▶  特许经营护城河复利 (100)', font: { size: 11, weight: 'bold' } },
              grid: { color: '#E3E0D5' }
            },
            y: {
              min: 0,
              max: 105,
              title: { display: true, text: '组合集中度：百股统计分散 (0) ──▶ 十股内集中 (100)', font: { size: 11, weight: 'bold' } },
              grid: { color: '#E3E0D5' }
            }
          }
        }
      });
    }

    // -----------------------------------------------------------------------
    // Initialize Everything Cleanly & Bind Scoped Event Delegation
    function configureChartDefaults() {
      if (typeof Chart === 'undefined') return;
      Chart.defaults.color = '#63615B';
      Chart.defaults.borderColor = '#E3E0D5';
      Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif';
      if (Chart.defaults.plugins && Chart.defaults.plugins.tooltip) {
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(20, 20, 19, 0.94)';
        Chart.defaults.plugins.tooltip.titleColor = '#FAF9F5';
        Chart.defaults.plugins.tooltip.bodyColor = '#F0EEE6';
        Chart.defaults.plugins.tooltip.padding = 10;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
      }
    }

    function bootWorkbench() {
      if (root.dataset.gbvBooted === '1') return;
      if (typeof Chart === 'undefined') {
        window.setTimeout(bootWorkbench, 30);
        return;
      }
      root.dataset.gbvBooted = '1';
      configureChartDefaults();

      selectPipelineStep(0);
      selectTaxonomy('value');
      setBiasTab('psych');
      setEmpiricalDataset('ff');

      selectPyramidLayer('av');
      selectStrategicCase('caseC');
      loadMoatPreset('coke');
      resetLeverageSim();

      loadAvEpvPreset('magna');
      loadFranchisePreset('cg');

      selectCaseStudy('hudson');

      renderDueDiligence();
      updateRiskSim();
      selectMacroRegime('inflation');
      renderMastersGrid();
    }

    const actions = {
      calcAvEpvWorkbench,
      calcFranchiseModel,
      filterMasters,
      loadAvEpvPreset,
      loadFranchisePreset,
      loadMoatPreset,
      resetDueDiligence,
      resetLeverageSim,
      selectCaseStudy,
      selectMacroRegime,
      selectPipelineStep,
      selectPyramidLayer,
      selectStrategicCase,
      selectTaxonomy,
      setBiasTab,
      setEmpiricalDataset,
      switchMainTab,
      switchWorkbenchMode,
      toggleBlueprintModal,
      toggleChecklistItem,
      updateDcfSim,
      updateLeverageSim,
      updateMoatCalc,
      updateRiskSim
    };

    function invokeAction(expr, el, event) {
      const m = /^(\w+)\(([^)]*)\)$/.exec((expr || '').trim());
      if (!m || !actions[m[1]]) return;
      const rawArgs = m[2].trim();
      const args = rawArgs
        ? rawArgs.split(',').map((token) => {
            const s = token.trim();
            if (s === 'true') return true;
            if (s === 'false') return false;
            if (s === 'event') return event;
            if (s === 'this') return el;
            if (/^-?\d+(?:\.\d+)?$/.test(s)) return Number(s);
            return s.replace(/^['"]|['"]$/g, '');
          })
        : [];
      actions[m[1]](...args);
    }

    ['click', 'input', 'change'].forEach((evtName) => {
      root.addEventListener(evtName, (event) => {
        const target = event.target instanceof Element ? event.target.closest(`[data-gbv-${evtName}]`) : null;
        if (target && root.contains(target)) {
          invokeAction(target.getAttribute(`data-gbv-${evtName}`), target, event);
        }
      });
    });

    // Backdrop click & Escape key to close blueprint modal
    const modalEl = byId('modal-blueprint');
    if (modalEl) {
      modalEl.addEventListener('click', (event) => {
        if (event.target === modalEl) toggleBlueprintModal(false);
      });
    }
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalEl && !modalEl.classList.contains('hidden')) {
        toggleBlueprintModal(false);
      }
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootWorkbench);
    } else {
      bootWorkbench();
    }
})();
