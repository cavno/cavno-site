Investing · Cases

# Jane Street 操纵指数策略拆解 · SEBI 调查可视化

基于 SEBI 临时禁令对 Jane Street 操纵 BANKNIFTY/NIFTY 指数的交互式拆解可视化

[← 返回案例栏目](http://127.0.0.1:5509/investing/cases/)

# Jane Street 操纵 BANKNIFTY / NIFTY 指数：策略拆解

基于 SEBI 临时禁令 WTM/AN/MRD/MRD-SEC-3/31516/2025-26（2025-07-03 印度证券交易委员会发布）

金额单位 Cr = crore = 1,000 万 INR ≈ 12 万美元（与 SEBI 原文一致）

21 天

认定违规交易日

2 套

操纵策略

₹4,843.57 Cr

违法所得（已被冻结）

## 样本日：2024-01-17 BANKNIFTY 周到期日 · 单日获利 ₹734.93 Cr

背景：HDFC Bank 业绩失望，BANKNIFTY 跳空低开（前收 48,125 → 开盘 46,574）。JS 利用恐慌氛围执行两段式操纵。

![文章图示 1](https://cavno.org/investing/cases/jane-street-viz/downloads/assets/jane-street-viz-visual-001.png)

### 四步动作分解

Patch I · 现货 + 期货市场

大举净买入 ₹4,370 Cr

12 只成分股 + 期货；订单密集挂在 LTP 之上；前 8 分钟净买 ₹572 Cr，把指数推升 600+ 点

Patch I · 指数期权市场

建立 ₹32,115 Cr 空头敞口

买便宜的 Put + 卖昂贵的 Call；现金等值规模 ≈ 现货/期货头寸的 7.3 倍

Patch II · 现货 + 期货市场

几乎完全反向卖出

订单密集挂在 LTP 之下；JS 是该时段最大单一净卖家；现货/期货段当日亏损 ₹199 Cr

Patch II · 指数期权市场

兑现期权头寸利润

期权敞口峰值 ₹46,621 Cr；末段 14:15-15:30 单段获利 ₹168 Cr（约占当日 25%）

### 市场规模不对称（Patch I 净敞口对比）

现货 + 期货

₹4,370 Cr

指数期权

₹32,115 Cr · 7.3×

小市场上的真金白银撬动指数 → 大市场上的杠杆头寸按虚假指数计价 → 反向收割

### LTP 攻击性证据（指数加权后单日 LTP 影响）

Patch I（指数被推高）

JS 单独贡献 +49,047  
其余市场参与者 −49,194

Patch II（指数被压低）

JS 单独贡献 −55,714  
其余市场参与者 +55,401

JS 与市场其余部分方向恰好相反 → 证明 JS 是单方向价格推动的主力，并非被动跟随

### 2024-01-17 当日盈亏拆解

−₹199 Cr

现货/期货段（操纵成本）

+₹735 Cr

指数期权段

+₹735 Cr

该日违法所得

该模板在 18 个被分析日中重复出现 15 次

本可视化基于公开的 SEBI 临时禁令文件（105 页）独立重构。本程序不构成任何投资建议或法律意见。

原始文件：[SEBI 官网](https://www.sebi.gov.in/) · 案件编号 WTM/AN/MRD/MRD-SEC-3/31516/2025-26

---

来源：[https://cavno.org/investing/cases/jane-street-viz/](https://cavno.org/investing/cases/jane-street-viz/)
