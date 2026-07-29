# 称重机 (The Weighing Machine) — 格雷厄姆–多德自动估值工作台
## 产品说明报告 v1.0

> 命名取自 Graham 原句："短期看，市场是投票机；长期看，市场是称重机。" 本程序的职责就是那台称重机：给定一个标的，取回书中估值所需的全部财务数据，按《Value Investing: From Graham to Buffett and Beyond, 2e》的模型完成三来源估值与判定树路由，输出可审计的结论报告。

---

## 0. 总体结论（一句话定位）

**单文件、零依赖（仅 Python 标准库）的命令行估值工作台**：输入一个美股代码（或一份手工财务 JSON），自动拉取 SEC EDGAR 的 10-15 年 XBRL 财务事实与市场价格，依次执行 预处理 → EPV → 资产重置价值 AV → Case A/B/C 分类 → 特许经营诊断 → 回报法 → 风险检查 → 判定树路由，产出一份符合个人设计系统（羊皮纸/teal/terracotta/Noto Serif SC）的单文件 HTML 估值报告 + 一份完整中间过程 JSON。**程序自动计算一切可从报表机械推导的量；对书中明示"必须人类判断"的量（护城河定性、fade、v 系数、资本成本、遗留负债），程序给出证据与默认值，但以显著方式标注"待人工确认"，并支持假设文件覆盖。**

---

## 1. 设计哲学（三条纲领）

### 1.1 方法即产品：每个模块对应书中一章
程序不发明任何估值逻辑。每一个计算模块、每一个默认参数、每一条判定规则，都能指回书中的章节与页码级论断（映射表见 §5 各模块"书中依据"栏）。当书中给的是区间（如资本成本 7–14%、无形基础设施 1–3 年 SG&A），程序取保守端为默认并暴露为可覆盖参数。

### 1.2 人机分工边界显式化（本产品的第一原则）
书的立场很清楚：估值的算术可以机械化，估值的**前提判断**不可以。程序把全部变量划成三档，报告中用三种颜色标注：

| 档位 | 定义 | 变量清单 |
|---|---|---|
| **A 全自动** | 报表可直接推导，无自由度 | 周期平均利润率、税率、资本密度、维护性资本开支、折旧修正、EPV、NWC 率、分配比例、收入 CAGR、ROIC/ROE 序列、利息覆盖、净回购、案例分类比值 |
| **B 半自动（程序给证据+默认值，人可覆盖）** | 书给了规则但含区间或需情境判断 | 资本成本 R\*（定性区间法，默认 10%）、v 系数（程序算出历史实现值 v_realized 作证据，默认 min(1.0, v_realized)）、有机增速（收入 CAGR 扣并购强度旗标）、无形资产重建三参数（R&D 年数、SG&A 年数、获客成本占收入比）、PP&E 重置系数 |
| **C 纯人工（程序只标注，不猜测）** | 书明示依赖行业知识/现场判断 | 护城河定性确认（份额稳定性、进入失败史）、fade 半衰期、遗留负债（欠缴养老金/环境/诉讼）、私有市场价值交叉验证、催化剂有无、管理层四维评估 |

**推论**：程序的最终判定永远带条件——"若人工确认护城河成立且半衰期 ≥ X 年，则……"。假装 C 档可以自动化，是对方法论的背叛，也是对使用者最大的误导。

### 1.3 审计优先：每个数字可回溯
所有中间量（逐年利润率、每年维护性资本开支、每条 XBRL 标签命中情况、每个默认参数是否被覆盖）全部写入输出 JSON；HTML 报告底部附"数据血缘表"：概念 → 命中的 us-gaap 标签 → 取值年份 → 原始值。数据缺失不静默降级——缺什么、用什么替代了、影响哪个模块，逐条列示。

---

## 2. 用户与使用场景

单一用户：个人深度研究者。工作流假设：**筛选在别处完成**（新低名单、行业困境、13F 等，见书第 2 章），本工具承接"单票深检"环节：

```
候选票 → weigher.py TICKER → 阅读报告 → 补齐 C 档人工判断 →
改 assumptions.json → 重跑 → 结论收敛 → 决策（含仓位，工具不管）
```

三种输入模式：
1. `python weigher.py AAPL --price 190` — 美股自动模式（EDGAR + Stooq）
2. `python weigher.py --input manual.json` — 手工模式（A 股/港股/任何市场：按模板填年度数据）
3. `python weigher.py --demo` / `--selftest` — 演示与自检（离线，内置书中算例）

---

## 3. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│ 数据层 (fetch)                                               │
│  SEC company_tickers.json ──ticker→CIK                       │
│  SEC companyfacts API ──XBRL 全量事实(us-gaap + dei)          │
│  Stooq CSV ──收盘价（可 --price 覆盖）                        │
│  本地缓存 ~/.weigher_cache（24h TTL，尊重 SEC 限速）          │
│  手工 JSON（非美股旁路，同一内部表结构）                       │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 整形层 (facts→table)                                         │
│  概念→标签优先级映射（§4.2） · 10-K/FY 年度化 · 重述去重       │
│  产出统一年度表 tbl[concept][year] + 数据质量清单              │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 模型层 (models)                                              │
│  preprocess：周期均值/税率/资本密度/维护CapEx/折旧修正/NWC率… │
│  EPV │ AV重置 │ Case分类 │ 特许诊断 │ 回报法 │ 风险检查       │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 判定与输出层 (verdict + report)                              │
│  判定树路由（§6）→ 结论枚举 + 条件句 + 待办清单(C档)          │
│  result.json（全中间量）+ report.html（设计系统一致，含        │
│  预填回报法工作台的交互组件）                                 │
└─────────────────────────────────────────────────────────────┘
```

技术约束（刻意选择）：单文件 `weigher.py`，仅标准库（urllib/json/statistics/argparse），无 pandas/numpy——可在任何有 Python 3.9+ 的机器上直接运行；报告为零构建单 HTML，可直接进 GitHub Pages 仓库归档。

---

## 4. 数据层规格

### 4.1 数据源

| 源 | 端点 | 用途 | 合规要求 |
|---|---|---|---|
| SEC EDGAR | `https://www.sec.gov/files/company_tickers.json` | ticker→CIK | User-Agent 须含联系方式；≤10 req/s |
| SEC EDGAR | `https://data.sec.gov/api/xbrl/companyfacts/CIK{10位}.json` | 全部财务事实（us-gaap、dei 两命名空间，含历年 10-K/10-Q） | 同上；单票仅 1 次请求 |
| Stooq | `https://stooq.com/q/l/?s={t}.us&f=sd2t2ohlcv&e=csv` | 最新收盘价 | 失败即回退 `--price` 手工值 |
| 手工 JSON | 本地文件 | 非美股/私有测算 | 模板见 §7.2 |

每票网络请求 ≤3 次；结果缓存 24 小时。市值 = 价格 × 最新 `dei:EntityCommonStockSharesOutstanding`（或 assumptions 覆盖 `market_cap`）。

### 4.2 概念 → XBRL 标签映射表（优先级从左到右，首个命中即用）

| 内部概念 | us-gaap 标签候选 | 类型 | 用于 |
|---|---|---|---|
| revenue | RevenueFromContractWithCustomerExcludingAssessedTax · Revenues · SalesRevenueNet · RevenueFromContractWithCustomerIncludingAssessedTax | 流量 | 全部 |
| operating_income | OperatingIncomeLoss | 流量 | 利润率、EPV |
| pretax_income | IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest · IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments | 流量 | 税率 |
| tax_expense | IncomeTaxExpenseBenefit | 流量 | 税率 |
| net_income | NetIncomeLoss | 流量 | ROE、分配比例 |
| dna | DepreciationDepletionAndAmortization · DepreciationAmortizationAndAccretionNet · Depreciation | 流量 | 折旧修正 |
| capex | PaymentsToAcquirePropertyPlantAndEquipment · PaymentsToAcquireProductiveAssets | 流量 | 维护性 CapEx |
| acquisitions | PaymentsToAcquireBusinessesNetOfCashAcquired | 流量 | 有机增速旗标、v 证据 |
| rd | ResearchAndDevelopmentExpense | 流量 | 无形重建① |
| sgna | SellingGeneralAndAdministrativeExpense | 流量 | 无形重建④ |
| interest_expense | InterestExpense · InterestExpenseDebt | 流量 | 杠杆三坏年测试 |
| dividends_paid | PaymentsOfDividends · PaymentsOfDividendsCommonStock | 流量 | 现金回报 |
| buybacks | PaymentsForRepurchaseOfCommonStock | 流量 | 现金回报 |
| stock_issued | ProceedsFromIssuanceOfCommonStock | 流量 | 净回购、负面信号旗 |
| cash | CashAndCashEquivalentsAtCarryingValue | 存量 | EPV/AV |
| st_investments | ShortTermInvestments · MarketableSecuritiesCurrent · AvailableForSaleSecuritiesDebtSecuritiesCurrent | 存量 | 超额现金 |
| receivables | AccountsReceivableNetCurrent · ReceivablesNetCurrent | 存量 | AV、NWC |
| allowance | AllowanceForDoubtfulAccountsReceivableCurrent · AccountsReceivableAllowanceForCreditLossCurrent | 存量 | AV 加回 |
| inventory | InventoryNet | 存量 | AV、NWC |
| lifo_reserve | InventoryLIFOReserve · ExcessOfReplacementOrCurrentCostsOverStatedLIFOValue | 存量 | AV 加回 |
| ppe_net / ppe_gross | PropertyPlantAndEquipmentNet / PropertyPlantAndEquipmentGross | 存量 | AV、资本密度 |
| goodwill | Goodwill | 存量 | AV 清零项 |
| intangibles | IntangibleAssetsNetExcludingGoodwill · FiniteLivedIntangibleAssetsNet | 存量 | AV 清零重建 |
| total_assets / total_liabilities | Assets / Liabilities | 存量 | AV 残差项 |
| payables | AccountsPayableCurrent · AccountsPayableAndAccruedLiabilitiesCurrent | 存量 | NWC |
| debt_* | LongTermDebtNoncurrent · LongTermDebtCurrent · LongTermDebt · ShortTermBorrowings · DebtCurrent | 存量 | 净债务、杠杆 |
| equity | StockholdersEquity · StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest | 存量 | ROE、P/B |
| minority | MinorityInterest · RedeemableNoncontrollingInterestEquityCarryingAmount | 存量 | 权益桥 |
| shares | dei:EntityCommonStockSharesOutstanding（units=shares，取最新） | 存量 | 市值 |

**标签漂移处理**：同一概念多标签命中时按年拼接（各年取该年有值的最高优先级标签）；`revenue` 类拼接后若相邻年跳变 >40% 且旧标签同年亦有值，标记"疑似重述/口径切换"进数据质量清单。

### 4.3 年度化规则

- 只取 `form ∈ {10-K, 10-K/A}` 且 `fp == "FY"` 的条目；流量概念要求区间 300–400 天（剔除季度与 YTD 混入）。
- 以会计年度结束年为键；同键多条（重述）取 `filed` 最新者。
- 存量概念取 FY 期末瞬时值。目标覆盖 15 年，≥7 年方可计算周期均值（书：7–15 年、至少一个完整周期），<7 年降级并旗标"周期覆盖不足"。

### 4.4 数据质量检查清单（自动生成，随报告输出）

缺失概念及替代方案 · 覆盖年数 · 收入口径跳变 · D&A 缺失（回退 capex 近似并旗标）· 金融业 SIC 6000–6999（**直接路由"太难堆"**：书的三模型不适用于金融企业报表结构）· 负收入/负权益异常年 · 股本单位混杂。

---
## 5. 模型层规格

每个模块给出：输入 → 公式 → 默认参数（可覆盖点加 ★）→ 书中依据。

### 5.1 预处理 preprocess

| 量 | 公式 | 默认/规则 | 书中依据 |
|---|---|---|---|
| 逐年营业利润率 m_t | operating_income_t / revenue_t | — | Ch5 |
| 周期平均利润率 m̄ | mean(m_t)，同时给 median 与线性趋势斜率 | 默认用 mean；趋势显著（\|斜率\|>0.4pp/年 且 R²>0.5）时报告提示"结构性变化，考虑改用近 3 年"★ | Ch5：禁止趋势外推，结构性变化才用近期值 |
| 有效税率 τ | mean(tax/pretax)，逐年裁剪至 [0,45%] | 近 3 年与长期均值偏差 >5pp 时提示税制变化，默认取近 3 年★ | Ch5：税法大改只用改后年份 |
| 资本密度 κ | mean(ppe_net_t / revenue_t)（有 gross 用 gross） | ★ | Ch5 增长 CapEx = Δ收入 × κ |
| 维护性资本开支 | maint_t = capex_t − max(0, Δrevenue_t) × κ，夹在 [0, capex_t] | 取各年均值 | Ch5 法二 |
| 折旧修正 Δdep | mean(dna_t) − mean(maint_t) | 正值抬升 EP（Magna +$120M 型），负值压低 | Ch5、Magna 案例 |
| NWC 率 ω | mean((receivables+inventory−payables)/revenue) | ★ | Ch8 CG 例（5%） |
| 分配比例 C | mean₅((dividends+buybacks−stock_issued)/net_income)，夹 [0,1.2] | ★ | Ch8 |
| 收入增速 | CAGR(10y/7y/5y) 三口径并列 | 有机增速默认取 min(CAGR7, CAGR10)★；并购强度 = Σacquisitions/Σcapex_total >30% 时旗标"增速含并购，需人工扣减" | Ch8：同口径原则 |
| ROIC 序列 | NOPAT_t / (equity+debt−cash)_t | NOPAT = operating_income×(1−τ) | Ch7 检验 |
| v_realized（v 系数证据） | (ΔEP̄ / R\*) ÷ Σ(留存−有机投资)，取近 8 年窗口 | 仅作证据展示；v 默认 = clamp(v_realized, 0, 1.0)★ | Ch8：v>1 须有运营效率/邻接扩张证据；Intel 三收购 0.50/0.40/0.07 |

### 5.2 EPV 模块

```
EP        = revenue_now × m̄ × (1−τ) + Δdep + growth_opex_addback★(默认0)
EPV_ent   = EP / R*
超额现金   = cash + st_investments − 0.5% × revenue   （经营性现金留存，书给 0.25–0.5%，取保守端）
EPV_eq    = EPV_ent + 超额现金 − 债务合计 − minority − 遗留负债★(默认0，C档)
```
R\* 为 B 档：定性区间法（书 Ch5：约 7–14%，低风险≈B 级债收益率+1%，高风险≈VC 要求回报），默认 10%★，报告强制显示"R\* 每 ±1% 对 EPV 的影响"。**书中依据**：Ch5 全部；EBITDA 禁用（不做任何 EBITDA 口径）。

### 5.3 AV 重置成本模块（逐行规则表）

| 资产项 | 重置规则 | 默认参数★ | 书中依据 |
|---|---|---|---|
| 现金/证券 | ×1.0 | — | Ch4 |
| 应收 | +坏账准备（无标签则 ×1.0 并旗标） | — | Ch4：新进入者坏账更高 |
| 存货 | +LIFO 储备（若有） | — | Ch4 |
| PP&E | 净值 × 系数 | 1.0★（土地增值、棕地折价均为 C 档人工） | Ch4：三重修正需行业知识 |
| 商誉 | ×0 | — | Ch4：清零 |
| 账面无形 | ×0，重建替代 ↓ | — | Ch4 |
| 无形①产品组合 | rd_years × mean(rd) | rd_years=5★（制药 8–10、快消 3 建议值写入报告） | Ch4：年限×R&D |
| 无形②客户基础 | customer_pct × revenue | 0★（B/C 档：书给服装 0.65/元销售额、佣金 5–15% 等行业参照，必须人工选口径） | Ch4 |
| 无形③员工队伍 | 手工项 | 0★ | Ch4 |
| 无形④组织基础 | sgna_years × mean(sgna) | 1.0★（书区间 1–3 年） | Ch4 |
| 其他资产 | 账面（total_assets − 已列项） | — | 残差保守处理 |
| 负债 | total_liabilities + 遗留负债★ | 遗留=0，C 档 | Ch4 |

`AV_eq = Σ重置资产 − 调整后负债`；`AV_ent = AV_eq + 债务 − 现金`（与 EPV_ent 同口径比较）。

### 5.4 Case 分类器

`ratio = EPV_ent / AV_ent`：**>1.25 → Case C**（特许经营候选）；**<0.75 → Case A**（价值陷阱警区）；**其间 → Case B**（三角验证区）。带宽 ±25% 直接来自 Ch3 的操作口径。

### 5.5 特许经营诊断（Case C 的定量前置检验）

自动三测：① 10 年 ROIC 均值 − R\* ≥ 2pp；② ROIC > R\* 的年份占比 ≥ 70%；③ 利润率变异系数 CV < 0.35。三测全过 → "特许经营候选"，**并列出 C 档人工确认清单**（份额稳定性、进入失败史、粘性机制、07 节三类优势归类）；任一不过 → 按 Case B 路径处理并说明原因。**依据**：Ch7 检验节（定性先行、定量再证——程序只能做后半，前半列清单）。

### 5.6 回报法模块（仅特许经营路由）

```
现金回报    = C × EP / M
有机回报    = g_o★ + g_m★(利润率爬升，默认0，须历史可见才允许>0)
留存        = (1−C) × EP
有机投资    = revenue × g_o × ω
主动回报    = max(0, 留存 − 有机投资) × v★ / M
r_b         = 三者之和
fade        = 72 / 半衰期★(默认30年 → 2.4%，刻意保守；C档)
净回报      = r_b − fade；安全边际 = 净回报 − R*；V/M ≈ r_b / R*
```
硬性熔断：`g_o > 15%` 或上市/数据 < 7 年 → **太难堆**（Ch8 边界：超高速增长属投机）。恒等式 V/M = R/R\* 及保守性证明（(R−R\*) = [R\*/(R\*−G)](R_B−R\*)）写入报告的方法说明，提醒使用者"基准边际为正 ⇒ 真实边际更大"。

### 5.7 风险模块

| 检查 | 规则 | 结论影响 | 依据 |
|---|---|---|---|
| 泡沫旗 | P/可持续EP > 30 或 P/B > 8 | 直接"太难堆" | Ch10 |
| 杠杆三坏年 | min(滚动3年均 EBIT)/利息费用 < 2 | 降级 + 红旗（不否决，因深折价困境股本就在书的射程内） | Ch10 |
| 股权融资旗 | 近3年 stock_issued > buybacks+dividends | 负面信号旗标 | Ch9 |
| 金融业 | SIC 6000–6999 | 太难堆 | 模型适用性 |
| 组合提示 | 报告尾固定文案：≈30只跨行业、杠杆存疑不用、默认预案 | 提示性 | Ch10 |

---

## 6. 判定引擎

```
IF 金融业 OR 数据<7年 OR 泡沫旗 OR (Case C 且 g_o>15%)  → TOO_TOUGH（太难堆）
ELIF Case A:
    → VALUE_TRAP_WARNING：仅当 价格 ≤ ⅔×min(AV_eq,EPV_eq) 才升为
      CONDITIONAL_BUY("需人工确认催化剂：换管理层/收购/行动主义"，C档待办)
ELIF Case B:
    d = 价格市值 / min(AV_eq, EPV_eq)
    d ≤ 0.67 → BUY_CANDIDATE（三角验证达格雷厄姆边际）
    0.67<d≤1 → WATCH（折价不足⅓）
    d > 1   → AVOID
ELIF Case C:
    特许三测未全过 → 回 Case B 逻辑（＋原因）
    通过 → 回报法：
        净回报−R* ≥ 1.5pp → BUY_CANDIDATE(条件句：护城河与半衰期为人工前提)
        0 ≤ 边际 <1.5pp   → WATCH
        边际 < 0          → AVOID（"伟大≠便宜"，Intel 型结论）
```
所有结论强制携带：①条件句（引用未确认的 C 档项）；②反方证据（如 AVOID 时亦列出"若 v 取 v_realized 上界结论是否翻转"的敏感性行）；③下一步待办清单。

## 7. 假设文件与手工输入

### 7.1 `assumptions.json`（全部可覆盖点）
```json
{ "cost_of_capital": 0.10, "fade_half_life": 30, "vcf": null,
  "organic_growth": null, "margin_uplift": 0.0, "nwc_ratio": null,
  "capital_intensity": null, "avg_margin": null, "tax_rate": null,
  "rd_years": 5, "sgna_years": 1.0, "customer_pct_rev": 0.0,
  "workforce_value": 0, "ppe_factor": 1.0, "legacy_liabilities": 0,
  "growth_opex_addback": 0, "operating_cash_pct": 0.005,
  "franchise": "auto",            // auto | yes | no（人工裁定护城河）
  "price": null, "market_cap": null, "notes": "" }
```
null = 使用程序自动值。`franchise:"yes"` 即 C 档人工确认的落点。

### 7.2 手工模式 `manual.json`
```json
{ "meta": {"name":"...", "ticker":"...", "currency":"CNY", "sic":"3711"},
  "market": {"price": 12.3, "shares": 1.0e9},
  "annual": { "2024": {"revenue":..., "operating_income":..., "...同§4.2概念名": ...},
              "2023": {...} } }
```
概念名与自动模式完全一致 → A 股/港股填表即可复用全链路。

## 8. 输出规格

- `out/{TICKER}_result.json`：meta / data_quality / table(全年度) / pre(全中间量) / models(epv, av, case, franchise, ret) / risk / verdict / assumptions_effective（含每项来源：auto|override|default）。
- `out/{TICKER}_report.html`：设计系统同前作（--parchment #F3EAD3 / --teal #1E6E68 / --terra #B5541F / Noto Serif SC / 零构建）。版式：结论横幅（含条件句）→ 判定树位置图 → EPV 表 → AV 逐行表 → Case 图 → 特许三测 → **预填真实数据的回报法交互工作台**（滑杆改假设即时重算，与前作 08 节同款）→ 风险旗 → C 档待办清单 → 数据血缘表 → 内嵌 result JSON。

## 9. 非目标（P0 明确不做）

组合管理与仓位建议 · 实时行情 · 批量筛选（P1）· 券商/交易接口 · 银行保险地产金融股模型 · 盈利预测 · 任何 DCF（书的立场即产品立场）。

## 10. 已知限制与失效模式

XBRL 标签漂移与公司自定义扩展标签（程序只认标准 us-gaap，遗漏进数据质量清单）· 财报重述仅按"最新 filed"处理 · IFRS 外国发行人（20-F，ifrs-full 命名空间）暂不支持 → 走手工模式 · 无形重建默认参数是行业均值级近似，B/C 档必须人工校准 · Stooq 价格延迟/缺失 → `--price` · 市值用最新股本×价，与报表期末股本存在时点差 · **本工具不构成投资建议，是研究流程的算术与记账环节**。

## 11. 验收标准（--selftest 固化为断言）

| 用例 | 期望 | 容差 |
|---|---|---|
| Magna 2009 算例（书 Ex2.5） | EP≈$920M；EPV_ent≈$9,200M；EPV_eq≈$10,940M | ±1% |
| CG 回报法算例（书表 8.1） | 现金 3.6% / 有机 3.5% / 主动 ≈3.66% / 合计 ≈10.8%；fade(50y)=1.44% | ±0.1pp |
| 判定树 | CG 参数 → BUY_CANDIDATE；Intel-2018 型参数（8.2% vs 9.5%+1.8%fade）→ AVOID | 精确 |
| 案例分类 | EPV/AV = 0.6/1.0/1.6 → A/B/C | 精确 |
| 手工模式 | demo 数据端到端出 JSON+HTML，无网络 | 运行通过 |

## 12. 路线图

- **P0（本次交付）**：上述全部。单文件 `weigher.py` + 报告模板内联。
- **P1**：批量模式（清单进、结论表出）；行业对照（同 SIC 的 κ、m̄ 分位）；IFRS 命名空间；13F 持有人旁证拉取。
- **P2**：组合层（30 只分散度检查、四资产×通胀通缩矩阵敞口标注、再平衡提醒）；假设版本管理（同一票多轮 assumptions 的差异审计）。
