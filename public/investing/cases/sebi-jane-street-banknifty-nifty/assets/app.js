(function () {
  'use strict';

  const root = document.getElementById('sebi-js-app');
  if (!root) return;

  const APP_DATA = {
  entities: [
    {
      id: "js_asia", sno: 4, name: "Jane Street Asia Trading Ltd.", pan: "AAECJ7368M",
      jurisdiction: "中国香港 (FPI 境外合格机构投资者)",
      parent: "Jane Street Group, LLC 间接全资附属公司",
      role: "境外 F&O 衍生品交易头寸主体之一，承担部分股指/个股期权多空敞口与个股期货对冲/砸盘任务",
      total: 6929.56, idx_opt: 7650.34, idx_fut: -85.62, stk_opt: 34.82, stk_fut: -668.87, cash: -1.12
    },
    {
      id: "jsi2", sno: 2, name: "JSI2 Investments Private Ltd.", pan: "AAGCJ5786R",
      jurisdiction: "印度孟买 (2024年9月注册境内实体)",
      parent: "JSI Investments Private Ltd. 全资子公司",
      role: "境内附属交易实体，核查期内仅参与少量指数期权交易",
      total: -168.67, idx_opt: -168.67, idx_fut: 0.00, stk_opt: 0.00, stk_fut: 0.00, cash: 0.00
    },
    {
      id: "jsi", sno: 1, name: "JSI Investments Private Ltd.", pan: "AAFCJ0285L",
      jurisdiction: "印度孟买 (2020年12月注册境内实体)",
      parent: "Jane Street Europe Ltd (英国) 全资控股 / Jane Street Group LLC 最终控股",
      role: "核心监管套利通道：绕开 FPI 条例第20(4)条对境外机构日内股票回转交易的禁令，专门在印度现货市场执行巨量日内先买后卖操纵并承担 ₹287.05 Cr 现货亏损",
      total: 4104.61, idx_opt: 4392.03, idx_fut: 0.00, stk_opt: -0.37, stk_fut: 0.00, cash: -287.05
    },
    {
      id: "js_sg", sno: 3, name: "Jane Street Singapore Pte. Ltd.", pan: "AAGCJ1682G",
      jurisdiction: "新加坡 (FPI 境外合格机构投资者)",
      parent: "与 JSI 受同一最终控制人 (Jane Street Group LLC) 控制的关联兄弟公司",
      role: "最大期权利润收割中心与个股期货干预主力：斩获 ₹31,415.63 Cr 指数期权暴利，同时在个股期货端承受 ₹6,539.36 Cr 操纵摩擦亏损，利润可自由汇出印度",
      total: 25636.62, idx_opt: 31415.63, idx_fut: -105.19, stk_opt: 865.54, stk_fut: -6539.36, cash: 0.00
    }
  ],
  table44: [
    { sr: 1,  raw_date: "31/08/2023", profit_inr: 1915880692, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 2,  raw_date: "13/09/2023", profit_inr: 2121798622, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 3,  raw_date: "20/09/2023", profit_inr: 2331329117, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 4,  raw_date: "28/09/2023", profit_inr: 2416887439, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 5,  raw_date: "04/10/2023", profit_inr: 1636711214, index: "BANKNIFTY", strategy: "MarkingClose", strategy_cn: "延长标记收盘价策略 (Extended Marking the Close)" },
    { sr: 6,  raw_date: "18/10/2023", profit_inr: 3173261362, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 7,  raw_date: "26/10/2023", profit_inr: 2591221492, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 8,  raw_date: "06/12/2023", profit_inr: 1509017742, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 9,  raw_date: "03/01/2024", profit_inr: 1646518393, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 10, raw_date: "17/01/2024", profit_inr: 7349269578, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation) ★样本详析" },
    { sr: 11, raw_date: "06/03/2024", profit_inr: 1970491842, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 12, raw_date: "16/04/2024", profit_inr: 1702729601, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 13, raw_date: "08/05/2024", profit_inr: 1710078602, index: "BANKNIFTY", strategy: "MarkingClose", strategy_cn: "延长标记收盘价策略 (Extended Marking the Close)" },
    { sr: 14, raw_date: "15/05/2024", profit_inr: 1607151918, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 15, raw_date: "29/05/2024", profit_inr: 2585535776, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 16, raw_date: "19/06/2024", profit_inr: 3224461015, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 17, raw_date: "03/07/2024", profit_inr: 2990341049, index: "BANKNIFTY", strategy: "Intraday", strategy_cn: "日内指数操纵策略 (Intra-day Index Manipulation)" },
    { sr: 18, raw_date: "10/07/2024", profit_inr: 2253513656, index: "BANKNIFTY", strategy: "MarkingClose", strategy_cn: "延长标记收盘价策略 (Extended Marking the Close) ★空头样本" },
    { sr: 19, raw_date: "08/05/2025", profit_inr: 30665621,   index: "NIFTY",     strategy: "MarkingClose", strategy_cn: "延长标记收盘价策略 (无视NSE警示函)" },
    { sr: 20, raw_date: "15/05/2025", profit_inr: 1675281113, index: "NIFTY",     strategy: "MarkingClose", strategy_cn: "延长标记收盘价策略 (无视NSE警示函) ★多头样本" },
    { sr: 21, raw_date: "22/05/2025", profit_inr: 1993624324, index: "NIFTY",     strategy: "MarkingClose", strategy_cn: "延长标记收盘价策略 (无视NSE警示函)" }
  ],
  table13: {
    times: ["09:15", "09:16", "09:17", "09:18", "09:19", "09:20", "09:21", "09:22"],
    stocks: [
      { scrip: "HDFCBANK",   js: [1.15, 5.1, 19.55, 2.3, 0.5, -1.15, 14.0, 10.4],     other: [16.6, -3.7, -14.3, -1.5, -1.7, -7.35, -13.5, -14.65],    js_tot: 51.85,  other_tot: -40.1 },
      { scrip: "KOTAKBANK",  js: [14.8, 54.95, 49.0, 8.4, 0.05, -0.1, 10.9, 35.25],   other: [-13.65, -53.2, -48.85, -7.05, 3.6, 2.0, -15.7, -31.6],   js_tot: 173.25, other_tot: -164.45 },
      { scrip: "ICICIBANK",  js: [2.25, 35.85, 24.75, 2.2, 0.75, -1.05, 8.05, 29.25], other: [7.85, -31.95, -25.2, -3.65, 2.8, 2.2, -8.65, -31.5],     js_tot: 102.05, other_tot: -88.1 },
      { scrip: "AXISBANK",   js: [10.6, 31.25, 35.9, 2.65, 0.4, 0.0, 24.15, 53.9],    other: [3.9, -30.6, -35.7, 1.65, 1.4, 8.8, -26.85, -49.05],      js_tot: 158.85, other_tot: -126.45 },
      { scrip: "SBIN",       js: [4.2, 21.75, 27.8, 2.0, 0.1, -0.05, 11.3, 39.8],     other: [0.35, -20.05, -26.9, -1.65, 0.25, 3.75, -11.45, -38.65], js_tot: 106.9,  other_tot: -94.35 },
      { scrip: "INDUSINDBK", js: [7.8, 61.6, 40.65, 4.65, 0.0, 0.0, 26.05, 131.35],   other: [-5.45, -63.9, -39.85, -2.7, 0.05, 11.55, -22.75, -125.75], js_tot: 272.1, other_tot: -248.8 }
    ]
  },
  table14: {
    cols: ["Open", "09:15", "09:16", "09:17", "09:18", "09:19", "09:20", "09:21", "09:22", "15:29"],
    spot: [46573.93, 46814.02, 46879.13, 47014.53, 47060.41, 47106.62, 47143.73, 47169.09, 47176.97, 46072.42],
    strikes: {
      "46800": { pe: [229.6, 123.55, 131.05, 131.45, 104.25, 82.6, 65.25, 72.0, 70.05, 734.75],    ce: [198.7, 653.45, 511.15, 440.3, 481.15, 491.9, 501.45, 469.0, 458.15, 0.65] },
      "46900": { pe: [494.85, 133.85, 154.4, 159.0, 128.65, 104.15, 85.15, 93.8, 92.1, 835.0],     ce: [157.35, 565.45, 432.25, 370.45, 407.1, 412.85, 421.75, 391.35, 380.2, 0.20] },
      "47000": { pe: [349.95, 144.9, 182.1, 193.3, 157.9, 131.7, 111.0, 122.0, 121.55, 935.8],     ce: [84.0, 479.9, 361.65, 302.7, 336.25, 340.5, 347.9, 318.85, 308.05, 0.30] },
      "47100": { pe: [562.9, 155.0, 212.05, 233.05, 192.25, 163.95, 142.2, 156.5, 156.25, 1038.95],ce: [77.05, 389.05, 290.35, 243.95, 271.1, 274.7, 278.8, 253.4, 242.65, 0.50] },
      "47200": { pe: [499.95, 171.35, 250.3, 279.9, 234.45, 204.15, 181.3, 199.95, 200.25, 1135.1],ce: [146.75, 303.65, 229.95, 190.6, 212.95, 214.35, 217.75, 196.35, 186.0, 0.35] },
      "47300": { pe: [700.0, 189.95, 292.85, 334.5, 283.3, 251.5, 226.25, 250.95, 251.5, 1234.75], ce: [98.4, 223.8, 174.35, 145.1, 161.4, 161.95, 164.85, 147.2, 138.8, 0.90] },
      "47400": { pe: [790.0, 224.0, 346.8, 396.95, 340.15, 307.75, 283.1, 311.85, 312.35, 1338.0], ce: [26.75, 157.45, 126.9, 107.45, 118.4, 119.05, 120.75, 107.9, 99.6, 0.30] },
      "47500": { pe: [588.0, 272.55, 408.4, 465.7, 406.15, 373.65, 349.0, 380.95, 382.4, 1435.55], ce: [21.25, 106.5, 89.65, 77.5, 85.1, 84.75, 86.5, 77.7, 70.75, 0.45] },
      "47600": { pe: [817.35, 333.2, 481.7, 544.95, 478.85, 445.95, 420.7, 457.55, 458.6, 1539.0], ce: [15.0, 70.4, 62.5, 54.8, 58.8, 58.25, 59.85, 53.75, 48.1, 0.20] },
      "47700": { pe: [535.75, 410.75, 561.8, 627.7, 560.5, 527.35, 502.55, 538.5, 543.2, 1380.0],  ce: [15.0, 48.35, 43.5, 38.45, 39.8, 39.05, 40.55, 36.5, 32.25, 0.20] }
    }
  },
  table15: [
    { strike: "46500", ce_delta_cr: 9.99,     pe_delta_cr: 24.55 },
    { strike: "46600", ce_delta_cr: -9.54,    pe_delta_cr: 17.46 },
    { strike: "46700", ce_delta_cr: -5.95,    pe_delta_cr: 22.85 },
    { strike: "46800", ce_delta_cr: -50.48,   pe_delta_cr: 51.50 },
    { strike: "46900", ce_delta_cr: -37.13,   pe_delta_cr: 48.02 },
    { strike: "47000", ce_delta_cr: -343.82,  pe_delta_cr: -226.56 },
    { strike: "47100", ce_delta_cr: -921.87,  pe_delta_cr: -904.42 },
    { strike: "47200", ce_delta_cr: -1468.93, pe_delta_cr: -2417.30 },
    { strike: "47300", ce_delta_cr: -636.16,  pe_delta_cr: -995.99 },
    { strike: "47400", ce_delta_cr: -156.62,  pe_delta_cr: -571.56 },
    { strike: "47500", ce_delta_cr: -60.45,   pe_delta_cr: -69.07 },
    { strike: "47600", ce_delta_cr: -15.82,   pe_delta_cr: -65.68 },
    { strike: "47700", ce_delta_cr: -8.93,    pe_delta_cr: -23.61 },
    { strike: "47800–55500 远端保护翼", ce_delta_cr: 47.06, pe_delta_cr: 20.00 }
  ],
  constituents: {
    jan17_p1_cash: {
      title: "2024-01-17 Patch I 现货买入 (Tables 7, 9, 10)",
      window: "09:15:43 – 11:20:15",
      note: "JS 在 Patch I 对 11 只成分股执行纯买入（零卖出），净买入 ₹1,851.57 Cr；指数加权现金净 LTP 冲击高达 +49,047.61，而市场其余所有参与者合计为 -49,194.31。",
      rows: [
        { scrip: "ICICIBANK",  win: "09:15:45–11:20:15", trades: 34673, js_tv: 445.03, mkt_tv: 1907.26, share: 23.33, ord_ltp: 1669.70, trd_ltp: 1652.85, rest_ltp: -1659.30, open: 994.2, close: 987.75 },
        { scrip: "HDFCBANK",   win: "09:15:43–11:06:05", trades: 22283, js_tv: 316.41, mkt_tv: 5506.76, share: 5.75,  ord_ltp: 130.30,  trd_ltp: 123.30,  rest_ltp: -134.90,  open: 1586.2, close: 1574.6 },
        { scrip: "AXISBANK",   win: "09:15:43–11:20:12", trades: 34343, js_tv: 277.13, mkt_tv: 1153.12, share: 24.03, ord_ltp: 1964.85, trd_ltp: 1934.50, rest_ltp: -1928.30, open: 1094.1, close: 1100.3 },
        { scrip: "SBIN",       win: "09:15:45–11:20:11", trades: 27894, js_tv: 217.67, mkt_tv: 862.53,  share: 25.24, ord_ltp: 828.65,  trd_ltp: 819.90,  rest_ltp: -818.30,  open: 627.1, close: 628.7 },
        { scrip: "KOTAKBANK",  win: "09:15:43–11:20:09", trades: 35815, js_tv: 190.26, mkt_tv: 819.78,  share: 23.21, ord_ltp: 2653.05, trd_ltp: 2603.20, rest_ltp: -2622.45, open: 1819.15, close: 1799.9 },
        { scrip: "INDUSINDBK", win: "09:15:43–11:19:54", trades: 21172, js_tv: 119.66, mkt_tv: 478.48,  share: 25.01, ord_ltp: 2960.80, trd_ltp: 2923.75, rest_ltp: -2917.50, open: 1647.15, close: 1653.4 },
        { scrip: "BANKBARODA", win: "09:15:47–11:08:00", trades: 13767, js_tv: 72.64,  mkt_tv: 294.70,  share: 24.65, ord_ltp: 184.20,  trd_ltp: 181.25,  rest_ltp: -178.15,  open: 227.45, close: 230.55 },
        { scrip: "IDFCFIRSTB", win: "09:15:50–11:07:40", trades: 5515,  js_tv: 59.56,  mkt_tv: 376.65,  share: 15.81, ord_ltp: 15.15,   trd_ltp: 15.15,   rest_ltp: -15.00,   open: 87.05, close: 87.2 },
        { scrip: "FEDERALBNK", win: "09:15:47–11:07:41", trades: 16363, js_tv: 57.94,  mkt_tv: 268.48,  share: 21.58, ord_ltp: 107.95,  trd_ltp: 107.75,  rest_ltp: -107.50,  open: 146.75, close: 147.0 },
        { scrip: "PNB",        win: "09:15:57–11:07:28", trades: 4940,  js_tv: 51.53,  mkt_tv: 311.79,  share: 16.53, ord_ltp: 13.35,   trd_ltp: 13.35,   rest_ltp: -12.40,   open: 97.0, close: 97.95 },
        { scrip: "AUBANK",     win: "09:15:45–11:20:08", trades: 18274, js_tv: 43.76,  mkt_tv: 175.45,  share: 24.94, ord_ltp: 1151.00, trd_ltp: 1134.90, rest_ltp: -1140.25, open: 763.55, close: 758.2 }
      ]
    },
    jan17_p1_fut: {
      title: "2024-01-17 Patch I 个股期货买入 (Tables 8, 11, 12)",
      window: "09:15:05 – 11:46:59",
      note: "JS 在个股期货净买入 ₹2,518.46 Cr，而同期全市场第二大净买家仅 ₹159.15 Cr（JS 规模为其 15.8 倍）。",
      rows: [
        { scrip: "ICICIBANK",  win: "09:15:05–11:46:50", trades: 6751, js_tv: 646.09, mkt_tv: 2777.55, share: 23.26, ord_ltp: 386.70, trd_ltp: 385.00, rest_ltp: -391.80, open: 990.0, close: 983.2 },
        { scrip: "SBIN",       win: "09:15:07–11:46:18", trades: 3116, js_tv: 366.75, mkt_tv: 1672.65, share: 21.93, ord_ltp: 138.40, trd_ltp: 137.40, rest_ltp: -139.15, open: 630.6, close: 628.85 },
        { scrip: "KOTAKBANK",  win: "09:15:05–11:46:59", trades: 3685, js_tv: 349.02, mkt_tv: 1448.38, share: 24.10, ord_ltp: 431.50, trd_ltp: 429.40, rest_ltp: -457.50, open: 1820.0, close: 1791.9 },
        { scrip: "AXISBANK",   win: "09:15:08–11:46:55", trades: 4051, js_tv: 348.26, mkt_tv: 1496.74, share: 23.27, ord_ltp: 381.20, trd_ltp: 378.40, rest_ltp: -381.40, open: 1097.8, close: 1094.8 },
        { scrip: "INDUSINDBK", win: "09:15:08–11:46:55", trades: 2206, js_tv: 208.02, mkt_tv: 874.01,  share: 23.80, ord_ltp: 391.80, trd_ltp: 388.65, rest_ltp: -387.80, open: 1649.35, close: 1650.2 },
        { scrip: "BANKBARODA", win: "09:15:06–11:46:47", trades: 1798, js_tv: 142.49, mkt_tv: 619.89,  share: 22.99, ord_ltp: 54.60,  trd_ltp: 54.50,  rest_ltp: -50.95,  open: 228.6, close: 232.15 },
        { scrip: "AUBANK",     win: "09:15:16–11:46:56", trades: 1196, js_tv: 120.52, mkt_tv: 513.98,  share: 23.45, ord_ltp: 213.40, trd_ltp: 211.45, rest_ltp: -217.65, open: 758.0, close: 751.8 },
        { scrip: "IDFCFIRSTB", win: "09:15:05–11:46:50", trades: 1293, js_tv: 113.95, mkt_tv: 689.96,  share: 16.52, ord_ltp: 6.25,   trd_ltp: 6.20,   rest_ltp: -6.60,   open: 87.3, close: 86.9 },
        { scrip: "PNB",        win: "09:15:06–11:41:32", trades: 977,  js_tv: 111.13, mkt_tv: 647.31,  share: 17.17, ord_ltp: 7.40,   trd_ltp: 7.40,   rest_ltp: -4.95,   open: 96.85, close: 99.3 },
        { scrip: "FEDERALBNK", win: "09:15:05–11:46:28", trades: 1215, js_tv: 105.51, mkt_tv: 534.59,  share: 19.74, ord_ltp: 15.95,  trd_ltp: 15.90,  rest_ltp: -16.40,  open: 146.85, close: 146.35 },
        { scrip: "HDFCBANK",   win: "09:57:43–09:58:05", trades: 52,   js_tv: 6.73,   mkt_tv: 17.73,   share: 37.93, ord_ltp: 3.65,   trd_ltp: 3.60,   rest_ltp: -2.30,   open: 1587.7, close: 1589.0 }
      ]
    },
    jan17_p2_cash: {
      title: "2024-01-17 Patch II 现货倾泻卖出 (Tables 16, 19, 20)",
      window: "11:49:59 – 15:29:22",
      note: "法证细节勘误：SEBI 原文第33页第15.31段将现货卖出表 Table 16 标题笔误写作 'In the stock futures market'（无 Expiry 列，第15.35段确认其为现金现货卖出 ₹1,858.78 Cr）。加权指数负向冲击达 -55,713.56。",
      rows: [
        { scrip: "ICICIBANK",  win: "11:50:12–15:22:49", trades: 37817, js_tv: 438.84, mkt_tv: 1740.55, share: 25.21, ord_ltp: -1326.00, trd_ltp: -1310.55, rest_ltp: 1308.75, open: 981.8, close: 980.0 },
        { scrip: "HDFCBANK",   win: "11:49:59–15:28:41", trades: 42769, js_tv: 330.29, mkt_tv: 5875.44, share: 5.62,  ord_ltp: -1852.55, trd_ltp: -1806.75, rest_ltp: 1786.45, open: 1561.7, close: 1541.4 },
        { scrip: "AXISBANK",   win: "11:50:01–15:12:04", trades: 48465, js_tv: 273.58, mkt_tv: 1141.31, share: 23.97, ord_ltp: -2840.80, trd_ltp: -2805.70, rest_ltp: 2795.40, open: 1093.0, close: 1082.7 },
        { scrip: "SBIN",       win: "11:49:59–15:29:22", trades: 35956, js_tv: 215.88, mkt_tv: 868.51,  share: 24.86, ord_ltp: -641.30,  trd_ltp: -635.40,  rest_ltp: 635.35,  open: 626.4, close: 626.35 },
        { scrip: "KOTAKBANK",  win: "11:50:09–15:28:49", trades: 29263, js_tv: 202.07, mkt_tv: 973.25,  share: 20.76, ord_ltp: -2219.95, trd_ltp: -2130.55, rest_ltp: 2120.10, open: 1788.05, close: 1777.6 },
        { scrip: "INDUSINDBK", win: "11:50:13–15:29:08", trades: 16021, js_tv: 114.48, mkt_tv: 535.68,  share: 21.37, ord_ltp: -942.70,  trd_ltp: -950.90,  rest_ltp: 951.65,  open: 1642.05, close: 1642.8 },
        { scrip: "BANKBARODA", win: "11:50:06–14:38:07", trades: 7354,  js_tv: 71.81,  mkt_tv: 282.06,  share: 25.46, ord_ltp: -93.45,   trd_ltp: -92.25,   rest_ltp: 87.60,   open: 230.55, close: 225.9 },
        { scrip: "IDFCFIRSTB", win: "11:50:25–14:19:11", trades: 8104,  js_tv: 58.08,  mkt_tv: 226.78,  share: 25.61, ord_ltp: -11.85,   trd_ltp: -11.80,   rest_ltp: 11.10,   open: 86.6, close: 85.9 },
        { scrip: "FEDERALBNK", win: "11:50:34–13:54:05", trades: 7931,  js_tv: 56.84,  mkt_tv: 223.29,  share: 25.45, ord_ltp: -44.90,   trd_ltp: -44.45,   rest_ltp: 44.95,   open: 145.95, close: 146.45 },
        { scrip: "PNB",        win: "11:50:14–13:14:50", trades: 3663,  js_tv: 51.15,  mkt_tv: 199.93,  share: 25.58, ord_ltp: -12.85,   trd_ltp: -12.85,   rest_ltp: 11.40,   open: 99.0, close: 97.55 },
        { scrip: "AUBANK",     win: "11:50:15–15:28:48", trades: 20810, js_tv: 45.69,  mkt_tv: 206.96,  share: 22.08, ord_ltp: -881.55,  trd_ltp: -881.45,  rest_ltp: 886.10,  open: 750.4, close: 755.05 },
        { scrip: "BANDHANBNK", win: "11:51:39–11:51:39", trades: 3,     js_tv: 0.07,   mkt_tv: 0.07,    share: 100.0, ord_ltp: 0.00,     trd_ltp: 0.00,     rest_ltp: 0.00,    open: 224.65, close: 224.65 }
      ]
    },
    jan17_p2_fut: {
      title: "2024-01-17 Patch II 期货倾泻卖出 (Tables 17, 18, 21–24)",
      window: "11:49:15 – 15:29:58",
      note: "含 12 只个股期货卖出 ₹3,513.34 Cr（Table 17）及 14:46:14–15:08:45 突击砸盘 BANKNIFTY 股指期货 ₹428.81 Cr（Table 18，净交易 LTP 冲击 -3,730.60）。",
      rows: [
        { scrip: "HDFCBANK (Fut)",    win: "12:19:16–15:29:58", trades: 8118, js_tv: 956.30, mkt_tv: 4344.02, share: 22.01, ord_ltp: -664.50,  trd_ltp: -656.20,  rest_ltp: 632.25,  open: 1570.95, close: 1547.0 },
        { scrip: "ICICIBANK (Fut)",   win: "11:49:22–15:29:51", trades: 8129, js_tv: 661.15, mkt_tv: 2635.67, share: 25.08, ord_ltp: -432.45,  trd_ltp: -425.75,  rest_ltp: 421.45,  open: 983.15, close: 978.85 },
        { scrip: "BANKNIFTY (IdxFut)",win: "14:46:14–15:08:45", trades: 2203, js_tv: 428.81, mkt_tv: 2229.85, share: 19.23, ord_ltp: -3780.55, trd_ltp: -3730.60, rest_ltp: 3497.40, open: 46314.8, close: 46081.6 },
        { scrip: "SBIN (Fut)",        win: "11:55:54–15:29:54", trades: 3776, js_tv: 419.67, mkt_tv: 1653.75, share: 25.38, ord_ltp: -172.65,  trd_ltp: -170.45,  rest_ltp: 169.25,  open: 627.6, close: 626.4 },
        { scrip: "KOTAKBANK (Fut)",   win: "11:49:15–15:29:54", trades: 3556, js_tv: 328.53, mkt_tv: 1286.77, share: 25.53, ord_ltp: -443.65,  trd_ltp: -442.20,  rest_ltp: 426.85,  open: 1793.65, close: 1778.3 },
        { scrip: "AXISBANK (Fut)",    win: "11:50:26–15:29:53", trades: 3861, js_tv: 323.10, mkt_tv: 1282.23, share: 25.20, ord_ltp: -359.50,  trd_ltp: -352.45,  rest_ltp: 338.85,  open: 1094.6, close: 1081.0 },
        { scrip: "INDUSINDBK (Fut)",  win: "11:51:58–15:29:50", trades: 2354, js_tv: 225.58, mkt_tv: 839.92,  share: 26.86, ord_ltp: -418.45,  trd_ltp: -409.25,  rest_ltp: 405.70,  open: 1648.55, close: 1645.0 },
        { scrip: "BANKBARODA (Fut)",  win: "11:56:28–15:29:52", trades: 1656, js_tv: 141.81, mkt_tv: 873.36,  share: 16.24, ord_ltp: -37.90,   trd_ltp: -37.90,   rest_ltp: 33.40,   open: 230.65, close: 226.15 },
        { scrip: "IDFCFIRSTB (Fut)",  win: "11:56:50–15:29:54", trades: 1581, js_tv: 119.76, mkt_tv: 657.82,  share: 18.21, ord_ltp: -6.90,    trd_ltp: -6.85,    rest_ltp: 5.45,    open: 86.8, close: 85.4 },
        { scrip: "AUBANK (Fut)",      win: "11:57:18–15:29:45", trades: 1380, js_tv: 109.37, mkt_tv: 434.75,  share: 25.16, ord_ltp: -193.00,  trd_ltp: -191.15,  rest_ltp: 193.05,  open: 748.4, close: 750.3 },
        { scrip: "FEDERALBNK (Fut)",  win: "11:56:52–15:28:27", trades: 1319, js_tv: 107.83, mkt_tv: 510.79,  share: 21.11, ord_ltp: -16.60,   trd_ltp: -16.50,   rest_ltp: 16.70,   open: 146.0, close: 146.2 },
        { scrip: "PNB (Fut)",         win: "11:56:41–15:29:01", trades: 1016, js_tv: 105.12, mkt_tv: 558.52,  share: 18.82, ord_ltp: -9.95,    trd_ltp: -10.25,   rest_ltp: 9.25,    open: 98.55, close: 97.55 }
      ]
    },
    jul10_close: {
      title: "2024-07-10 尾盘1小时空头砸收盘 (Tables 27–35)",
      window: "14:30:00 – 15:29:54",
      note: "收盘前 60 分钟集中抛售 ₹2,799.76 Cr（全部 11 只个股期货独占市场 37.38%–39.38% 份额！），掩护 ₹44,153.87 Cr 看跌期权敞口按 15:00–15:30 VWAP 低位结算。",
      rows: [
        { scrip: "BANKNIFTY (IdxFut)", win: "14:30:23–15:29:54", trades: 2526, js_tv: 735.86, mkt_tv: 2950.42, share: 24.94, ord_ltp: -2700.25, trd_ltp: -2644.50, rest_ltp: 2673.05, open: 52282.95, close: 52311.5 },
        { scrip: "HDFCBANK (Fut)",     win: "14:30:14–15:27:12", trades: 2752, js_tv: 400.75, mkt_tv: 1071.71, share: 37.39, ord_ltp: -219.10,  trd_ltp: -216.50,  rest_ltp: 219.55,  open: 1630.85, close: 1633.9 },
        { scrip: "ICICIBANK (Fut)",    win: "14:30:05–15:27:14", trades: 2639, js_tv: 368.13, mkt_tv: 966.29,  share: 38.10, ord_ltp: -186.45,  trd_ltp: -183.90,  rest_ltp: 183.65,  open: 1245.55, close: 1245.3 },
        { scrip: "SBIN (Fut)",         win: "14:30:00–15:27:14", trades: 2759, js_tv: 248.58, mkt_tv: 651.78,  share: 38.14, ord_ltp: -141.90,  trd_ltp: -140.80,  rest_ltp: 143.70,  open: 849.3, close: 852.2 },
        { scrip: "AXISBANK (Fut)",     win: "14:30:07–15:26:48", trades: 2099, js_tv: 219.27, mkt_tv: 567.16,  share: 38.66, ord_ltp: -197.95,  trd_ltp: -194.65,  rest_ltp: 192.35,  open: 1292.3, close: 1290.0 },
        { scrip: "KOTAKBANK (Fut)",    win: "14:30:03–15:27:15", trades: 1395, js_tv: 138.32, mkt_tv: 367.36,  share: 37.65, ord_ltp: -173.80,  trd_ltp: -170.80,  rest_ltp: 176.85,  open: 1831.55, close: 1837.6 },
        { scrip: "BANKBARODA (Fut)",   win: "14:30:29–15:27:11", trades: 1233, js_tv: 105.81, mkt_tv: 269.64,  share: 39.24, ord_ltp: -25.25,   trd_ltp: -25.10,   rest_ltp: 25.65,   open: 256.85, close: 257.4 },
        { scrip: "FEDERALBNK (Fut)",   win: "14:30:29–15:27:03", trades: 993,  js_tv: 105.40, mkt_tv: 277.28,  share: 38.01, ord_ltp: -19.60,   trd_ltp: -19.32,   rest_ltp: 19.46,   open: 188.87, close: 189.01 },
        { scrip: "INDUSINDBK (Fut)",   win: "14:30:00–15:27:15", trades: 1227, js_tv: 101.83, mkt_tv: 266.23,  share: 38.25, ord_ltp: -153.30,  trd_ltp: -151.20,  rest_ltp: 157.45,  open: 1422.85, close: 1429.1 },
        { scrip: "PNB (Fut)",          win: "14:30:39–15:27:09", trades: 816,  js_tv: 86.14,  mkt_tv: 230.42,  share: 37.38, ord_ltp: -10.30,   trd_ltp: -10.12,   rest_ltp: 10.14,   open: 119.52, close: 119.54 },
        { scrip: "AUBANK (Fut)",       win: "14:30:15–15:27:15", trades: 942,  js_tv: 70.48,  mkt_tv: 178.98,  share: 39.38, ord_ltp: -57.50,   trd_ltp: -56.25,   rest_ltp: 55.95,   open: 631.2, close: 630.9 },
        { scrip: "IDFCFIRSTB (Fut)",   win: "14:31:17–15:27:14", trades: 794,  js_tv: 55.86,  mkt_tv: 143.93,  share: 38.81, ord_ltp: -5.84,    trd_ltp: -5.81,    rest_ltp: 6.02,    open: 78.19, close: 78.4 },
        { scrip: "ICICIBANK (Cash)",   win: "14:30:14–15:25:58", trades: 4296, js_tv: 45.17,  mkt_tv: 1016.58, share: 4.44,  ord_ltp: -89.50,   trd_ltp: -87.05,   rest_ltp: 84.80,   open: 1245.15, close: 1242.9 },
        { scrip: "PNB (Cash)",         win: "14:30:21–15:27:14", trades: 9349, js_tv: 38.33,  mkt_tv: 154.85,  share: 24.75, ord_ltp: -62.01,   trd_ltp: -61.14,   rest_ltp: 61.00,   open: 119.18, close: 119.04 },
        { scrip: "HDFCBANK (Cash)",    win: "14:30:03–14:50:58", trades: 1392, js_tv: 16.09,  mkt_tv: 202.54,  share: 7.94,  ord_ltp: -31.65,   trd_ltp: -31.15,   rest_ltp: 32.45,   open: 1623.6, close: 1624.9 }
      ]
    },
    may15_nifty: {
      title: "2025-05-15 NIFTY 尾盘多头逼空拉升 (Tables 38–43 全量 49 只个股期货 + 指期)",
      window: "13:26:06 – 15:29:53",
      note: "NSE 警示函后顶风作案：故意将现货交易降为 0 伪装合规，实则横扫 49 只 NIFTY 个股期货买入 ₹4,910.96 Cr + NIFTY 股指期货买入 ₹2,505.28 Cr（法证细节：第83页 Table 43 买方成交 LTP 表头被 SEBI 笔误印成 'Sell trade'）。",
      rows: [
        { scrip: "NIFTY (IdxFut)", win: "13:44:26–15:05:35", trades: 5213, js_tv: 2505.28, mkt_tv: 10062.88, share: 24.90, ord_ltp: 1291.20, trd_ltp: 338.20, rest_ltp: -247.20, open: 25010.0, close: 25101.0 },
        { scrip: "RELIANCE",       win: "13:26:09–15:27:26", trades: 3665, js_tv: 461.80,  mkt_tv: 2106.19,  share: 21.93, ord_ltp: 43.00,   trd_ltp: 2.90,   rest_ltp: 15.40,   open: 1438.3, close: 1456.6 },
        { scrip: "ICICIBANK",      win: "13:26:06–15:28:44", trades: 2466, js_tv: 415.21,  mkt_tv: 1917.42,  share: 21.65, ord_ltp: 32.90,   trd_ltp: 2.80,   rest_ltp: 8.70,    open: 1442.0, close: 1453.5 },
        { scrip: "HDFCBANK",       win: "13:26:09–15:29:34", trades: 2624, js_tv: 410.27,  mkt_tv: 1808.43,  share: 22.69, ord_ltp: 39.90,   trd_ltp: 16.60,  rest_ltp: -9.40,   open: 1931.0, close: 1938.2 },
        { scrip: "INFY",           win: "13:26:10–15:27:16", trades: 2085, js_tv: 246.10,  mkt_tv: 1117.61,  share: 22.02, ord_ltp: 56.50,   trd_ltp: 28.30,  rest_ltp: -14.20,  open: 1598.4, close: 1612.5 },
        { scrip: "SBIN",           win: "13:26:40–15:29:49", trades: 1716, js_tv: 202.73,  mkt_tv: 1162.26,  share: 17.44, ord_ltp: 27.15,   trd_ltp: 14.45,  rest_ltp: -8.35,   open: 788.8, close: 794.9 },
        { scrip: "BHARTIARTL",     win: "13:26:08–15:25:37", trades: 1548, js_tv: 197.64,  mkt_tv: 855.97,   share: 23.09, ord_ltp: -10.60,  trd_ltp: -28.00, rest_ltp: 47.80,   open: 1851.2, close: 1871.0 },
        { scrip: "LT",             win: "13:26:40–15:29:46", trades: 1824, js_tv: 164.06,  mkt_tv: 730.03,   share: 22.47, ord_ltp: 188.50,  trd_ltp: 142.60, rest_ltp: -126.20, open: 3605.6, close: 3622.0 },
        { scrip: "AXISBANK",       win: "13:26:22–15:29:34", trades: 1140, js_tv: 135.78,  mkt_tv: 617.82,   share: 21.98, ord_ltp: 13.00,   trd_ltp: -0.70,  rest_ltp: 3.30,    open: 1208.0, close: 1210.6 },
        { scrip: "TCS",            win: "13:26:06–15:29:34", trades: 1283, js_tv: 134.98,  mkt_tv: 603.60,   share: 22.36, ord_ltp: 146.90,  trd_ltp: 114.90, rest_ltp: -97.10,  open: 3568.0, close: 3585.8 },
        { scrip: "BAJFINANCE",     win: "13:26:13–15:25:44", trades: 709,  js_tv: 120.49,  mkt_tv: 610.18,   share: 19.75, ord_ltp: 85.00,   trd_ltp: 22.00,  rest_ltp: 38.50,   open: 9159.5, close: 9220.0 },
        { scrip: "KOTAKBANK",      win: "13:26:10–15:25:49", trades: 908,  js_tv: 113.85,  mkt_tv: 506.98,   share: 22.46, ord_ltp: 52.80,   trd_ltp: 31.00,  rest_ltp: -17.90,  open: 2094.1, close: 2107.2 },
        { scrip: "HCLTECH",        win: "13:26:06–15:29:49", trades: 971,  js_tv: 104.34,  mkt_tv: 646.16,   share: 16.15, ord_ltp: 39.70,   trd_ltp: 29.00,  rest_ltp: -17.10,  open: 1680.5, close: 1692.4 },
        { scrip: "MARUTI",         win: "13:26:06–15:29:53", trades: 871,  js_tv: 100.45,  mkt_tv: 581.47,   share: 17.28, ord_ltp: 113.00,  trd_ltp: 47.00,  rest_ltp: 39.00,   open: 12791.0, close: 12877.0 },
        { scrip: "M&M",            win: "13:26:06–15:28:23", trades: 1137, js_tv: 97.87,   mkt_tv: 493.78,   share: 19.82, ord_ltp: 53.90,   trd_ltp: 47.00,  rest_ltp: -46.00,  open: 3139.0, close: 3140.0 },
        { scrip: "SUNPHARMA",      win: "13:26:06–15:25:49", trades: 1027, js_tv: 94.67,   mkt_tv: 442.68,   share: 21.39, ord_ltp: 50.40,   trd_ltp: 42.10,  rest_ltp: -20.60,  open: 1721.5, close: 1743.0 },
        { scrip: "ETERNAL",        win: "13:26:10–15:26:10", trades: 1185, js_tv: 93.09,   mkt_tv: 483.45,   share: 19.26, ord_ltp: 10.02,   trd_ltp: 7.74,   rest_ltp: -5.82,   open: 240.67, close: 242.59 },
        { scrip: "ITC",            win: "13:26:06–15:29:53", trades: 812,  js_tv: 89.79,   mkt_tv: 417.80,   share: 21.49, ord_ltp: 9.85,    trd_ltp: 4.10,   rest_ltp: -2.95,   open: 431.15, close: 432.3 },
        { scrip: "BEL",            win: "13:26:09–15:29:23", trades: 448,  js_tv: 75.22,   mkt_tv: 557.27,   share: 13.50, ord_ltp: 4.75,    trd_ltp: 1.70,   rest_ltp: 0.55,    open: 348.4, close: 350.65 },
        { scrip: "TATAMOTORS",     win: "13:26:34–15:17:40", trades: 1114, js_tv: 74.49,   mkt_tv: 543.04,   share: 13.72, ord_ltp: 12.00,   trd_ltp: 4.70,   rest_ltp: -0.40,   open: 726.75, close: 731.05 },
        { scrip: "TRENT",          win: "13:26:10–15:25:48", trades: 827,  js_tv: 74.28,   mkt_tv: 672.19,   share: 11.05, ord_ltp: 137.50,  trd_ltp: 78.00,  rest_ltp: 32.00,   open: 5478.0, close: 5588.0 },
        { scrip: "TATASTEEL",      win: "13:26:22–15:25:28", trades: 501,  js_tv: 73.07,   mkt_tv: 442.00,   share: 16.53, ord_ltp: 3.40,    trd_ltp: 2.76,   rest_ltp: -2.43,   open: 157.15, close: 157.48 },
        { scrip: "HINDUNILVR",     win: "13:26:06–15:29:33", trades: 717,  js_tv: 69.54,   mkt_tv: 301.59,   share: 23.06, ord_ltp: 45.30,   trd_ltp: 35.30,  rest_ltp: -34.60,  open: 2363.3, close: 2364.0 },
        { scrip: "NTPC",           win: "13:26:31–15:29:07", trades: 809,  js_tv: 69.07,   mkt_tv: 322.40,   share: 21.42, ord_ltp: 7.90,    trd_ltp: 5.05,   rest_ltp: -0.45,   open: 338.0, close: 342.6 },
        { scrip: "TECHM",          win: "13:26:24–15:23:15", trades: 410,  js_tv: 61.84,   mkt_tv: 286.05,   share: 21.62, ord_ltp: 34.10,   trd_ltp: 27.40,  rest_ltp: -24.60,  open: 1627.3, close: 1630.1 },
        { scrip: "POWERGRID",      win: "13:26:27–15:26:04", trades: 664,  js_tv: 60.25,   mkt_tv: 288.05,   share: 20.92, ord_ltp: 6.20,    trd_ltp: 2.55,   rest_ltp: 1.70,    open: 295.7, close: 299.95 },
        { scrip: "ULTRACEMCO",     win: "13:26:10–15:25:27", trades: 536,  js_tv: 59.82,   mkt_tv: 277.30,   share: 21.57, ord_ltp: 162.00,  trd_ltp: 80.00,  rest_ltp: -24.00,  open: 11859.0, close: 11915.0 },
        { scrip: "ADANIPORTS",     win: "13:26:09–15:29:52", trades: 669,  js_tv: 59.16,   mkt_tv: 327.53,   share: 18.06, ord_ltp: 27.00,   trd_ltp: 27.30,  rest_ltp: -23.00,  open: 1398.4, close: 1402.7 },
        { scrip: "GRASIM",         win: "13:26:45–15:25:25", trades: 424,  js_tv: 58.49,   mkt_tv: 308.62,   share: 18.95, ord_ltp: 60.70,   trd_ltp: 51.80,  rest_ltp: -3.50,   open: 2777.0, close: 2825.3 },
        { scrip: "JSWSTEEL",       win: "13:26:40–15:26:05", trades: 496,  js_tv: 58.36,   mkt_tv: 306.34,   share: 19.05, ord_ltp: 20.80,   trd_ltp: 13.10,  rest_ltp: 0.70,    open: 1025.7, close: 1039.5 },
        { scrip: "BAJAJFINSV",     win: "13:26:13–15:27:00", trades: 419,  js_tv: 57.43,   mkt_tv: 266.97,   share: 21.51, ord_ltp: 21.70,   trd_ltp: 16.90,  rest_ltp: -0.50,   open: 2035.7, close: 2052.1 },
        { scrip: "BAJAJ-AUTO",     win: "13:26:57–15:26:09", trades: 508,  js_tv: 57.41,   mkt_tv: 362.55,   share: 15.83, ord_ltp: 146.50,  trd_ltp: 91.50,  rest_ltp: 35.50,   open: 8225.0, close: 8352.0 },
        { scrip: "ASIANPAINT",     win: "13:26:09–15:25:40", trades: 852,  js_tv: 57.02,   mkt_tv: 288.56,   share: 19.76, ord_ltp: 55.90,   trd_ltp: 43.50,  rest_ltp: -24.60,  open: 2312.6, close: 2331.5 },
        { scrip: "HINDALCO",       win: "13:26:15–15:25:53", trades: 326,  js_tv: 55.35,   mkt_tv: 408.14,   share: 13.56, ord_ltp: 10.05,   trd_ltp: 8.10,   rest_ltp: -7.00,   open: 659.9, close: 661.0 },
        { scrip: "TITAN",          win: "13:26:09–15:29:22", trades: 542,  js_tv: 54.15,   mkt_tv: 302.58,   share: 17.90, ord_ltp: 0.10,    trd_ltp: 24.00,  rest_ltp: -25.10,  open: 3633.1, close: 3632.0 },
        { scrip: "EICHERMOT",      win: "13:26:42–15:26:09", trades: 384,  js_tv: 53.38,   mkt_tv: 505.29,   share: 10.57, ord_ltp: -61.50,  trd_ltp: 69.00,  rest_ltp: -53.00,  open: 5479.0, close: 5495.0 },
        { scrip: "ONGC",           win: "13:26:09–15:26:03", trades: 622,  js_tv: 48.83,   mkt_tv: 207.91,   share: 23.49, ord_ltp: 4.66,    trd_ltp: 3.92,   rest_ltp: -2.76,   open: 246.58, close: 247.74 },
        { scrip: "COALINDIA",      win: "13:26:15–15:25:30", trades: 671,  js_tv: 47.80,   mkt_tv: 215.13,   share: 22.22, ord_ltp: 6.40,    trd_ltp: 3.35,   rest_ltp: -1.70,   open: 403.3, close: 404.95 },
        { scrip: "SHRIRAMFIN",     win: "13:26:30–15:25:56", trades: 559,  js_tv: 47.08,   mkt_tv: 273.01,   share: 17.24, ord_ltp: 16.20,   trd_ltp: 11.15,  rest_ltp: -7.25,   open: 671.65, close: 675.55 },
        { scrip: "WIPRO",          win: "13:35:52–15:25:34", trades: 385,  js_tv: 44.36,   mkt_tv: 221.15,   share: 20.06, ord_ltp: 5.23,    trd_ltp: 4.79,   rest_ltp: -3.18,   open: 255.19, close: 256.8 },
        { scrip: "APOLLOHOSP",     win: "13:35:51–15:27:00", trades: 357,  js_tv: 44.33,   mkt_tv: 234.84,   share: 18.87, ord_ltp: 132.00,  trd_ltp: 119.50, rest_ltp: -10.50,  open: 7000.0, close: 7109.0 },
        { scrip: "ADANIENT",       win: "13:36:00–15:29:39", trades: 377,  js_tv: 43.72,   mkt_tv: 262.47,   share: 16.66, ord_ltp: 43.80,   trd_ltp: 40.40,  rest_ltp: -22.90,  open: 2508.5, close: 2526.0 },
        { scrip: "CIPLA",          win: "13:26:44–15:24:58", trades: 664,  js_tv: 42.21,   mkt_tv: 207.04,   share: 20.39, ord_ltp: 32.80,   trd_ltp: 27.00,  rest_ltp: -12.00,  open: 1492.7, close: 1507.7 },
        { scrip: "HDFCLIFE",       win: "13:26:06–15:29:00", trades: 334,  js_tv: 40.71,   mkt_tv: 219.29,   share: 18.56, ord_ltp: 9.65,    trd_ltp: 8.20,   rest_ltp: -3.90,   open: 747.1, close: 751.4 },
        { scrip: "DRREDDY",        win: "13:26:30–15:28:57", trades: 352,  js_tv: 40.59,   mkt_tv: 213.59,   share: 19.00, ord_ltp: 23.30,   trd_ltp: 16.30,  rest_ltp: -8.70,   open: 1222.7, close: 1230.3 },
        { scrip: "SBILIFE",        win: "13:26:15–15:25:27", trades: 388,  js_tv: 40.10,   mkt_tv: 195.50,   share: 20.51, ord_ltp: 19.90,   trd_ltp: 11.20,  rest_ltp: 0.30,    open: 1771.9, close: 1783.4 },
        { scrip: "JIOFIN",         win: "13:26:36–15:25:51", trades: 527,  js_tv: 39.57,   mkt_tv: 214.33,   share: 18.46, ord_ltp: 4.20,    trd_ltp: 2.25,   rest_ltp: 1.00,    open: 271.0, close: 274.25 },
        { scrip: "HEROMOTOCO",     win: "13:35:59–15:25:38", trades: 375,  js_tv: 35.96,   mkt_tv: 454.25,   share: 7.92,  ord_ltp: 34.60,   trd_ltp: 26.60,  rest_ltp: 1.10,    open: 4294.0, close: 4321.7 },
        { scrip: "NESTLEIND",      win: "13:26:10–15:25:37", trades: 406,  js_tv: 31.38,   mkt_tv: 143.70,   share: 21.83, ord_ltp: 38.50,   trd_ltp: 32.40,  rest_ltp: -26.10,  open: 2390.9, close: 2397.2 },
        { scrip: "TATACONSUM",     win: "13:26:35–15:29:45", trades: 388,  js_tv: 31.22,   mkt_tv: 147.24,   share: 21.20, ord_ltp: 21.00,   trd_ltp: 18.40,  rest_ltp: -16.00,  open: 1141.1, close: 1143.5 },
        { scrip: "INDUSINDBK",     win: "13:51:20–15:25:31", trades: 340,  js_tv: 21.66,   mkt_tv: 201.26,   share: 10.76, ord_ltp: 7.65,    trd_ltp: 4.45,   rest_ltp: -3.70,   open: 780.2, close: 780.95 }
      ]
    }
  },
  replays: {
    jan17: {
      index: "BANKNIFTY",
      summary_metrics: [
        { k: "Patch I 底层净买入", v: "₹4,370.03 Cr", sub: "现货 1,851.57 + 期指 2,518.46" },
        { k: "Patch I 期权建空增幅", v: "-₹32,114.96 Cr", sub: "达底层多头 7.3 倍 (首8分钟 15.3x)" },
        { k: "Patch II 底层净倾泻", v: "-₹5,372.12 Cr", sub: "加权指数冲击 -55,713.56" },
        { k: "当日最终损益闭环", v: "+₹734.93 Cr", sub: "期权暴利 vs 底层日内亏损 -₹61.6 Cr" }
      ],
      times: ["09:15", "09:22", "09:35", "09:50", "10:05", "10:20", "10:35", "10:50", "11:05", "11:20", "11:35", "11:47", "12:00", "12:20", "12:45", "13:10", "13:30", "13:53", "14:15", "14:30", "14:46", "15:00", "15:08", "15:18", "15:25", "15:30"],
      spot:  [46574,   47177,   47020,   47213,   47010,   46985,   46890,   46670,   46640,   46615,   46580,   46390,   46340,   46410,   46310,   46325,   46290,   46345,   46315,   46270,   46315,   46120,   46082,   45980,   46050,   46064],
      delta: [-7311,   -16062,  -19800,  -23400,  -25900,  -28100,  -30500,  -32400,  -35100,  -37200,  -38600,  -39426,  -41200,  -42600,  -43500,  -44200,  -45100,  -46621,  -44800,  -42100,  -37500,  -32400,  -29800,  -27200,  -25600,  -24885],
      profit:[0,       18,      32,      28,      55,      68,      95,      215,     235,     255,     285,     390,     415,     385,     435,     450,     468,     465,     494,     535,     580,     665,     702,     728,     732,     734.93],
      cm:    [340,     295,     210,     175,     130,     115,     140,     160,     155,     132,     0,       0,       -95,     -125,    -135,    -120,    -130,    -145,    -155,    -165,    -185,    -210,    -160,    -130,    -104,    0],
      futstk:[232,     380,     260,     210,     185,     170,     195,     210,     205,     190,     155,     126,     -140,    -195,    -230,    -240,    -275,    -310,    -290,    -315,    -340,    -380,    -320,    -265,    -213,    0],
      futidx:[0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       45,      65,      0,       0,       0,       0,       -195,    -140,    -94,     0,       0,       0],
      phases: [
        { idx: 0,  tag: "开盘跳空 (09:15)", desc: "受 HDFC Bank 前夜财报不及预期拖累，BANKNIFTY 从前收 48,125.10 跳空低开 1,551 点至 46,573.95，全市场弥漫看空抛压。" },
        { idx: 1,  tag: "黄金8分钟暴力诱多 (09:15–09:22)", desc: "JS 在前6大权重股逆势狂买 ₹572 Cr，单枪匹马将指数拉升 +603 点至 47,176.97；趁 Call 虚高、Put 暴跌，反向建立 -₹8,751 Cr 期权空头 Delta（15.3倍杠杆）！" },
        { idx: 11, tag: "Patch I 建仓完毕 (11:47)", desc: "底层累计净买入 ₹4,370.03 Cr（现货零卖出），同时在流动性高 353 倍的期权市场将负 Delta 从 -₹7,311 Cr 扩至 -₹39,426.15 Cr（净增空头 ₹32,114.96 Cr，7.3倍于底层多头）。" },
        { idx: 17, tag: "Patch II 反手倾泻与空头峰值 (13:53)", desc: "11:49 起 JS 全面翻空倾泻成分股现货与期货，13:53 期权负 Delta 达峰值 -₹46,620.79 Cr，指数重心持续下移。" },
        { idx: 20, tag: "尾盘指期致命一击 (14:46–15:08)", desc: "在继续抛售个股同时，JS 于 14:46–15:08 突击砸盘 BANKNIFTY 股指期货 ₹428.81 Cr（净 LTP 冲击 -3,730.60），在 15:00–15:30 结算窗口前击穿 46,000 点。" },
        { idx: 25, tag: "到期收割闭环 (15:30)", desc: "指数收于 46,064.45，所有 ATM Call（46800–47700）归零至 ₹0.20–₹0.90，Put 暴涨 7–10 倍；JS 单日期权狂赚 ₹734.93 Cr，底层故意回转亏损仅 ₹61.60 Cr。" }
      ]
    },
    jul10: {
      index: "BANKNIFTY",
      summary_metrics: [
        { k: "09:15–14:30 状态", v: "低量潜伏", sub: "无显著方向性冲击，维持中性" },
        { k: "14:30–15:30 突击砸盘", v: "-₹2,799.76 Cr", sub: "个股期指独占全市场 37.4%–39.4%！" },
        { k: "最后1小时空头激增", v: "-₹16,928.64 Cr", sub: "收盘负 Delta 达 -₹44,153.87 Cr" },
        { k: "当日到期结算非法所得", v: "+₹225.35 Cr", sub: "精准压低 15:00–15:30 VWAP 结算价" }
      ],
      times: ["09:15", "09:35", "10:00", "10:25", "10:50", "11:15", "11:40", "12:05", "12:30", "12:55", "13:20", "13:45", "14:05", "14:20", "14:30", "14:38", "14:45", "14:52", "15:00", "15:06", "15:12", "15:18", "15:24", "15:27", "15:29", "15:30"],
      spot:  [52410,   52320,   52350,   52190,   52160,   52155,   52175,   52180,   52170,   52165,   52150,   52140,   52155,   52240,   52283,   52340,   52295,   52260,   52245,   52210,   52185,   52170,   52190,   52180,   52185,   52189],
      delta: [-18500,  -17200,  -16500,  -15200,  -14800,  -15100,  -16800,  -19500,  -21200,  -22000,  -21800,  -21500,  -20200,  -23800,  -27225,  -31400,  -35800,  -37200,  -36500,  -39800,  -42600,  -41900,  -43500,  -43900,  -44100,  -44154],
      profit:[0,       35,      52,      78,      95,      108,     115,     125,     132,     140,     148,     155,     162,     158,     152,     128,     160,     185,     205,     218,     224,     219,     222,     224,     225,     225.35],
      cm:    [-45,     -12,     0,       0,       5,       8,       6,       0,       0,       -8,      -5,      -6,      -8,      -10,     -18,     -22,     -20,     -18,     -22,     -19,     -18,     -16,     -10,     0,       0,       0],
      futstk:[-25,     15,      42,      35,      12,      0,       -8,      0,       0,       -12,     -18,     -25,     -45,     -55,     -165,    -195,    -210,    -225,    -255,    -265,    -245,    -215,    -125,    0,       0,       0],
      futidx:[0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       -145,    -110,    -85,     -75,     -80,     -72,     -65,     -55,     -49,     0,       0,       0],
      phases: [
        { idx: 0,  tag: "全天前5小时静默期 (09:15–14:30)", desc: "与 1月17日 双阶段拉砸不同，JS 在 09:15–14:30 保持极低成交占比与温和 Delta，未对成分股施加强方向性冲击。" },
        { idx: 14, tag: "14:30 尾盘突袭启动", desc: "14:30 整点刚过，JS 在现货、11只个股期货与 BANKNIFTY 股指期货三线同时发起高强度市价砸盘（HDFC 现货 92%、期货 93% 交易在 LTP 及以下成交）！" },
        { idx: 18, tag: "15:00 进入 VWAP 结算定价窗口", desc: "NSE 指数期权到期结算价由 15:00–15:30 成分股成交量加权均价（VWAP）决定；JS 在此黄金窗口包揽全部11只银行股期货 37.38%–39.38% 的市场总卖盘！" },
        { idx: 25, tag: "15:30 压哨收割 (收盘结算)", desc: "最后1小时累计倾泻 ₹2,800 Cr 底层卖盘，同步将期权负 Delta 从 -₹27,225 Cr 推高至 -₹44,153.87 Cr，单日锁定 ₹225.35 Cr 结算暴利。" }
      ]
    },
    may15: {
      index: "NIFTY 50",
      summary_metrics: [
        { k: "现货市场伪装合规", v: "₹0 干预", sub: "刻意规避 NSE 2月6日警示函点名的现货端" },
        { k: "13:26–15:30 期货狂买", v: "+₹7,416.24 Cr", sub: "49只个股期指 4,910.96 + 指期 2,505.28" },
        { k: "期权 Delta 惊天翻多", v: "+₹55,422.76 Cr", sub: "从开盘 -17,125.75 翻至收盘 +38,297.01 Cr" },
        { k: "无视监管单日获利", v: "+₹167.53 Cr", sub: "2025年5月3个NIFTY到期日合赚 ₹370 Cr" }
      ],
      times: ["09:15", "09:40", "10:05", "10:35", "11:00", "11:25", "11:50", "12:15", "12:40", "13:00", "13:15", "13:26", "13:38", "13:45", "13:55", "14:05", "14:15", "14:25", "14:35", "14:45", "14:55", "15:05", "15:12", "15:20", "15:26", "15:30"],
      spot:  [24635,   24590,   24615,   24760,   24740,   24630,   24625,   24670,   24640,   24710,   24890,   24965,   25015,   25055,   25095,   25125,   25145,   25130,   25120,   25115,   25110,   25105,   25108,   25104,   25102,   25101],
      delta: [-17126,  -18200,  -17500,  -8500,   -9200,   -14500,  -15200,  -13800,  -14900,  -6200,   11500,   19800,   28500,   33400,   36200,   37500,   38100,   38200,   38250,   38280,   38290,   38295,   38296,   38297,   38297,   38297],
      profit:[0,       12,      28,      15,      8,       5,       4,       2,       0,       18,      25,      45,      95,      145,     158,     162,     175,     170,     168,     166,     167,     167,     167.2,   167.4,   167.5,   167.53],
      cm:    [0,       0,       0,       -2,      0,       0,       -2,      0,       0,       0,       1,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0],
      futstk:[0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       180,     360,     420,     410,     395,     385,     370,     355,     365,     390,     430,     380,     290,     181,     0],
      futidx:[0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       0,       380,     440,     390,     350,     290,     245,     220,     190,     0,       0,       0,       0,       0],
      phases: [
        { idx: 0,  tag: "警示函背景与上午蛰伏 (09:15–13:00)", desc: "2025年2月6日 NSE 已向 JS 发出严厉警示函（点名其印度实体在现货市场操纵成分股配合期权大额 Delta）。5月15日上午 JS 维持低波动与负 Delta (-₹17,125.75 Cr)。" },
        { idx: 9,  tag: "13:00 期权仓位急速翻多", desc: "13:00 起 JS 大举买入 NIFTY 看涨期权（Long Calls）并卖出看跌期权（Short Puts），全天总 Delta 实现 +₹55,422.76 Cr 的惊人多头大反转！" },
        { idx: 11, tag: "13:26 横扫 49 只 NIFTY 个股期货", desc: "刻意保持现货 CM=0 假装遵守警示函，实则同步横扫 49 只 NIFTY 成分股期货狂买 ₹4,910.96 Cr（RELIANCE/ICICI/HDFC/INFY 等均占全市场 ~22% 买盘）！" },
        { idx: 13, tag: "13:44 叠加 NIFTY 股指期货助推", desc: "13:44–15:05 再砸 ₹2,505.28 Cr 买入 NIFTY 股指期货（占全市场 24.90%，订单净 LTP 冲击 +1,291.20），将 NIFTY 强行拉过 25,144 点。" },
        { idx: 25, tag: "15:30 高位结算触发 SEBI 雷霆禁令", desc: "NIFTY 高位收于 25,101.00，当日到期期权多头 Delta 暴赚 ₹167.53 Cr。这种公然藐视监管承诺的顶风作案，直接促成 SEBI 于 7月3日 下达紧急市场禁入与没收令。" }
      ]
    }
  }
};

  let currentTab = 'm1';
  let selectedEntityId = 'jsi';
  let currentReplayKey = 'jan17';
  let currentReplayStep = 25;
  let replayTimer = null;
  let hoverIndex = null;
  let currentDSKey = 'jan17_p1_cash';
  let ledgerFilterIdx = 'ALL';
  let ledgerFilterStrat = 'ALL';
  let currentOrderState = 'pre';

  const PALETTE = {
    canvasBg: '#FFFFFF',
    gridBorder: '#E3E0D5',
    zeroAxis: '#CFCCC0',
    ink: '#141413',
    inkSub: '#63615B',
    pos: '#2D624C',
    posMid: '#3D7A60',
    posTint: 'rgba(45, 98, 76, 0.065)',
    neg: '#9E4427',
    negMid: '#C15F3C',
    negDark: '#7D321B',
    negTint: 'rgba(193, 95, 60, 0.075)',
    ochre: '#8C6218',
    ochreMid: '#B38128',
    ochreTint: 'rgba(179, 129, 40, 0.11)',
    plum: '#5C4B7D'
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function fmtIndianInt(n) {
    return Math.round(n).toLocaleString('en-IN');
  }

  function fmtCr(v, showPlus) {
    const s = Math.abs(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (v < 0) return '-₹' + s + ' Cr';
    return (showPlus && v > 0 ? '+₹' : '₹') + s + ' Cr';
  }

  function switchTab(tabId) {
    currentTab = tabId;
    root.querySelectorAll('.jsf-nav-btn[data-jsf-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-jsf-tab') === tabId);
    });
    root.querySelectorAll('.jsf-module').forEach(sec => {
      sec.classList.toggle('active', sec.id === 'jsf-view-' + tabId);
    });
    if (tabId !== 'm3') stopReplayTimer();
    if (tabId === 'm3') setTimeout(drawReplayCanvas, 30);
    if (tabId === 'm4') renderStrikeChart();
    if (tabId === 'm6') renderLedger();
  }

  function initModule1() {
    const container = byId('jsf-entity-cards-container');
    if (!container) return;
    const sortedEntities = [...APP_DATA.entities].sort((a, b) => a.sno - b.sno);
    container.innerHTML = sortedEntities.map(e => {
      const isIndia = e.id === 'jsi' || e.id === 'jsi2';
      return '<div class="jsf-entity-card ' + (isIndia ? 'jsf-india ' : '') + (e.id === selectedEntityId ? 'active' : '') + '" data-jsf-eid="' + e.id + '" role="button" tabindex="0">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:5px;">' +
        '<span class="jsf-badge ' + (isIndia ? 'jsf-badge-neg' : 'jsf-badge-pos') + '">#' + e.sno + ' · ' + (isIndia ? '境内实体' : '境外 FPI') + '</span>' +
        '<span class="jsf-mono" style="font-size:11.5px;color:var(--jsf-muted);">' + e.pan + '</span></div>' +
        '<div style="font-weight:700;font-size:14px;color:var(--jsf-ink);">' + e.name + '</div>' +
        '<div class="jsf-mono" style="margin-top:6px;font-size:12.5px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">' +
        '<span>总净利: <strong class="' + (e.total >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + fmtCr(e.total, true) + '</strong></span>' +
        '<span>指数期权: <strong class="' + (e.idx_opt >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + fmtCr(e.idx_opt, true) + '</strong></span></div></div>';
    }).join('');

    const tbody = byId('jsf-table4-tbody');
    const rowsHtml = APP_DATA.entities.map(e =>
      '<tr><td><strong>' + e.name + '</strong></td><td class="jsf-mono">' + e.pan + '</td>' +
      '<td class="jsf-num ' + (e.total >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + e.total.toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</td>' +
      '<td class="jsf-num ' + (e.idx_opt >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + e.idx_opt.toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</td>' +
      '<td class="jsf-num ' + (e.idx_fut < 0 ? 'jsf-neg' : '') + '">' + (e.idx_fut === 0 ? '0.00' : e.idx_fut.toLocaleString('en-IN', { minimumFractionDigits: 2 })) + '</td>' +
      '<td class="jsf-num ' + (e.stk_opt >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + (e.stk_opt === 0 ? '-' : e.stk_opt.toLocaleString('en-IN', { minimumFractionDigits: 2 })) + '</td>' +
      '<td class="jsf-num ' + (e.stk_fut < 0 ? 'jsf-neg' : '') + '">' + (e.stk_fut === 0 ? '0.00' : e.stk_fut.toLocaleString('en-IN', { minimumFractionDigits: 2 })) + '</td>' +
      '<td class="jsf-num ' + (e.cash < 0 ? 'jsf-neg' : '') + '">' + (e.cash === 0 ? '0.00' : e.cash.toLocaleString('en-IN', { minimumFractionDigits: 2 })) + '</td></tr>'
    ).join('');
    tbody.innerHTML = rowsHtml +
      '<tr class="jsf-tot-row"><td>集团合计 (JS Group Total)</td><td class="jsf-mono">4 PANs</td>' +
      '<td class="jsf-num jsf-pos">36,502.12</td><td class="jsf-num jsf-pos">43,289.33</td><td class="jsf-num jsf-neg">-190.81</td>' +
      '<td class="jsf-num jsf-pos">899.99</td><td class="jsf-num jsf-neg">-7,208.23</td><td class="jsf-num jsf-neg">-288.17</td></tr>';
    renderEntityDetail();
  }

  function selectEntity(id) {
    selectedEntityId = id;
    root.querySelectorAll('.jsf-entity-card').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-jsf-eid') === id);
    });
    renderEntityDetail();
  }

  function renderEntityDetail() {
    const e = APP_DATA.entities.find(x => x.id === selectedEntityId) || APP_DATA.entities[0];
    const panel = byId('jsf-entity-detail-panel');
    if (!panel) return;
    const segments = [
      { name: '指数期权 (Index Options)', val: e.idx_opt },
      { name: '个股期权 (Stock Options)', val: e.stk_opt },
      { name: '股指期货 (Index Futures)', val: e.idx_fut },
      { name: '个股期货 (Stock Futures)', val: e.stk_fut },
      { name: '现货股票 (Cash Equities)', val: e.cash }
    ];
    const maxAbs = Math.max(100, ...segments.map(s => Math.abs(s.val)));
    const bars = segments.map(s => {
      const pct = Math.min(100, (Math.abs(s.val) / maxAbs) * 100);
      const col = s.val >= 0 ? 'var(--jsf-pos-mid)' : 'var(--jsf-neg-mid)';
      return '<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;gap:6px;font-size:12.5px;"><span>' + s.name + '</span>' +
        '<span class="jsf-mono ' + (s.val >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + fmtCr(s.val, true) + '</span></div>' +
        '<div style="height:9px;background:var(--jsf-panel);border-radius:3px;margin-top:3px;overflow:hidden;">' +
        '<div style="width:' + pct.toFixed(1) + '%;height:100%;background:' + col + ';"></div></div></div>';
    }).join('');

    panel.innerHTML =
      '<div style="border-bottom:1px solid var(--jsf-line);padding-bottom:10px;margin-bottom:10px;">' +
      '<div class="jsf-mono" style="font-size:11.5px;color:var(--jsf-ochre);font-weight:700;">实体穿透档案 · Entity No. ' + e.sno + ' (' + e.pan + ')</div>' +
      '<div style="font-family:var(--serif);font-size:17px;font-weight:700;margin-top:2px;">' + e.name + '</div>' +
      '<div style="font-size:12.5px;color:var(--jsf-ink-2);margin-top:4px;"><strong>注册地与身份：</strong>' + e.jurisdiction + '</div>' +
      '<div style="font-size:12.5px;color:var(--jsf-ink-2);"><strong>股权控制链：</strong>' + e.parent + '（参见 <a href="https://files.brokercheck.finra.org/firm/firm_103782.pdf" target="_blank" rel="noopener noreferrer">FINRA BrokerCheck 披露</a> 与 <a href="https://www.janestreet.com/who-we-are/" target="_blank" rel="noopener noreferrer">集团官网架构</a>）</div></div>' +
      '<div style="font-size:13px;background:var(--jsf-card);padding:10px 12px;border-radius:var(--jsf-radius-sm);border:1px solid var(--jsf-line);margin-bottom:12px;"><strong>操纵链条职能分工：</strong>' + e.role + '</div>' +
      '<div style="font-weight:700;font-size:13px;margin-bottom:8px;">各业务分部净损益结构（2023.01 – 2025.03）：</div>' + bars;
  }

  const MECHANISMS = {
    lev: {
      title: '临近到期平值期权（ATM）的 100 倍现金经济敞口杠杆（Para 10–11, Page 8）',
      html: 'SEBI 原文算例：假设标的现价为 <code>₹100</code>：<br>' +
        '• <strong>现货市场交割：</strong>买入 1 股需全额支付 <code>₹100</code> 现金 → <strong>1 倍杠杆</strong>；<br>' +
        '• <strong>期货市场保证金：</strong>买入 1 股对应期货约需 <code>₹20</code> 保证金 → <strong>5 倍杠杆</strong>；<br>' +
        '• <strong>距到期仅 1 天的 ATM 看涨期权（行权价 100，25% 隐含波动率）：</strong>单份期权 Delta ≈ 0.5，买入 <strong>2 份</strong> ATM Call 即可获得等效持有 1 股现货的现金等价风险敞口（Delta-equivalent exposure），而权利金总支出仅约 <strong><code>₹1</code></strong> → <strong>相对现货高达 100 倍杠杆（相对期货 20 倍杠杆）</strong>。这正是吸引 161.5 万名散户涌入到期日指数期权、只盯指数点位而不参与底层现货交易的根本原因。'
    },
    pcp: {
      title: '看涨-看跌期权平价定理 Put-Call Parity 与合成空头（Para 7.2.1, Page 5）',
      html: '在同一行权价 K 下，同时<strong>买入看涨期权（Long Call）+ 卖出看跌期权（Short Put）</strong>的到期损益完全等价于以行权价 K 买入远期/期货合约（合成多头，2025-05-15 采用）；反之，<strong>买入看跌期权（Long Put）+ 卖出看涨期权（Short Call）</strong>等价于在期权市场建立巨量<strong>合成指数空头</strong>（2024-01-17 与 2024-07-10 采用）。当 JS 先用现货把指数人为拉高时，Call 溢价虚高而 Put 折价超跌，使其能以极优价格双向建空。'
    },
    call: {
      title: '实值看涨期权（ITM Call）跨市场套利护栏算例（Para 7.2.2.1, Page 6）',
      html: 'SEBI 原文算例：若股票/指数现价为 <code>₹100</code>，而行权价 <code>₹90</code> 的实值 Call 权利金仅售 <code>₹6</code>（即 <code>行权价 90 + 权利金 6 = ₹96 &lt; 现价 ₹100</code>），套利者会立即买入该 90 Call 并在现货市场以 <code>₹100</code> 卖出标的，到期稳赚无风险利润 <strong><code>₹4</code></strong>。正是套利者的存在，迫使期权价格时刻紧跟被 JS 操纵的现货指数点位。'
    },
    put: {
      title: '实值看跌期权（ITM Put）跨市场套利护栏算例（Para 7.2.3.1, Page 6）',
      html: 'SEBI 原文算例：若股票/指数现价为 <code>₹100</code>，而行权价 <code>₹110</code> 的实值 Put 权利金仅售 <code>₹6</code>（即 <code>行权价 110 - 权利金 6 = ₹104 &gt; 现价 ₹100</code>），套利者会立即买入该 110 Put 并在现货市场以 <code>₹100</code> 买入标的，到期稳赚无风险利润 <strong><code>₹4</code></strong>。尽管存在 STT 印花税与冲击成本，套利机制仍将现货与期权紧密绑定。'
    }
  };

  function showMechanism(key) {
    root.querySelectorAll('[data-jsf-mech]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-jsf-mech') === key);
    });
    const m = MECHANISMS[key];
    if (!m) return;
    byId('jsf-mechanism-explain-box').innerHTML =
      '<div style="font-weight:700;color:var(--jsf-pos);margin-bottom:4px;">' + m.title + '</div><div>' + m.html + '</div>';
  }

  const SANDBOX_PRESETS = {
    p_jan17_full: { x: 4370, k: 7.35, move: 2.29, cost: 1.41, note: '2024-01-17 全天实盘对齐：Patch I 买入 ₹4,370.03 Cr，建立 7.35x 反向期权敞口 (₹32,114.96 Cr)，日内底层亏损 -₹61.6 Cr，期权获利 +₹734.93 Cr。' },
    p_jan17_8m:   { x: 572,  k: 15.30, move: 2.35, cost: 1.50, note: '2024-01-17 开盘黄金8分钟对齐：6大银行股强买 ₹572 Cr，瞬间建立 -₹8,751 Cr 看跌期权敞口（高达 15.3 倍反向杠杆）。' },
    p_jul10:      { x: 2800, k: 15.77, move: 0.56, cost: 0.45, note: '2024-07-10 尾盘延长标记收盘对齐：最后60分钟抛售 ₹2,800 Cr，护航收盘 ₹44,153.87 Cr (15.77x) 空头期权结算获利 +₹225.35 Cr。' },
    p_may15:      { x: 7416, k: 7.47,  move: 0.42, cost: 0.35, note: '2025-05-15 NIFTY 尾盘多头逼空对齐：49只个股期指+指期狂买 ₹7,416.24 Cr，期权 Delta 净摆动 +₹55,422.76 Cr (7.47x)，当日结算获利 +₹167.53 Cr。' }
  };

  function loadSandboxPreset(pkey) {
    const p = SANDBOX_PRESETS[pkey];
    if (!p) return;
    root.querySelectorAll('[data-jsf-preset]').forEach(b => b.classList.toggle('active', b.getAttribute('data-jsf-preset') === pkey));
    byId('jsf-sb-x').value = p.x;
    byId('jsf-sb-k').value = p.k;
    byId('jsf-sb-move').value = p.move;
    byId('jsf-sb-cost').value = p.cost;
    updateSandbox(p.note);
  }

  function updateSandbox(customNote) {
    const x = parseFloat(byId('jsf-sb-x').value) || 0;
    const k = parseFloat(byId('jsf-sb-k').value) || 0;
    const move = parseFloat(byId('jsf-sb-move').value) || 0;
    const cost = parseFloat(byId('jsf-sb-cost').value) || 0;

    byId('jsf-sb-val-x').textContent = '₹' + fmtIndianInt(x) + ' Cr';
    byId('jsf-sb-val-k').textContent = k.toFixed(2) + ' x (期权敞口 ₹' + fmtIndianInt(x * k) + ' Cr)';
    byId('jsf-sb-val-move').textContent = move.toFixed(2) + ' %';
    byId('jsf-sb-val-cost').textContent = cost.toFixed(2) + ' %';

    const loss = x * (cost / 100);
    const gain = (x * k) * (move / 100);
    const net = gain - loss;
    const minK = move > 0 ? (cost / move) : 0;

    byId('jsf-sb-out-loss').textContent = '-₹' + loss.toFixed(2) + ' Cr';
    byId('jsf-sb-out-gain').textContent = '+₹' + gain.toFixed(2) + ' Cr';
    const netEl = byId('jsf-sb-out-net');
    netEl.textContent = (net >= 0 ? '+₹' : '-₹') + Math.abs(net).toFixed(2) + ' Cr';
    netEl.style.color = net >= 0 ? PALETTE.pos : PALETTE.neg;

    const maxBar = Math.max(10, gain, loss, Math.abs(net));
    const wLoss = (loss / maxBar) * 210;
    const wGain = (gain / maxBar) * 210;
    const wNet = (Math.abs(net) / maxBar) * 210;
    const ratioTxt = loss > 0 ? (gain / loss).toFixed(1) + 'x 赔率' : '高赔率';

    byId('jsf-sb-svg-waterfall').innerHTML =
      '<svg viewBox="0 0 470 165" width="100%" height="100%">' +
      '<text x="6" y="34" font-size="12" fill="' + PALETTE.inkSub + '">1. 底层现货/期货故意亏损</text>' +
      '<rect x="160" y="19" width="' + wLoss.toFixed(1) + '" height="22" rx="4" fill="' + PALETTE.negMid + '"/>' +
      '<text x="' + (166 + wLoss).toFixed(1) + '" y="35" font-size="11.5" font-family="monospace" font-weight="bold" fill="' + PALETTE.neg + '">-₹' + loss.toFixed(1) + ' Cr</text>' +
      '<text x="6" y="84" font-size="12" fill="' + PALETTE.inkSub + '">2. 期权 ' + k.toFixed(1) + 'x 反向敞口盈利</text>' +
      '<rect x="160" y="69" width="' + wGain.toFixed(1) + '" height="22" rx="4" fill="' + PALETTE.pos + '"/>' +
      '<text x="' + (166 + wGain).toFixed(1) + '" y="85" font-size="11.5" font-family="monospace" font-weight="bold" fill="' + PALETTE.pos + '">+₹' + gain.toFixed(1) + ' Cr</text>' +
      '<line x1="6" y1="108" x2="462" y2="108" stroke="' + PALETTE.zeroAxis + '" stroke-dasharray="4,3"/>' +
      '<text x="6" y="138" font-size="12.5" font-weight="bold" fill="' + PALETTE.ink + '">3. 跨市场操纵净收割利润</text>' +
      '<rect x="160" y="122" width="' + wNet.toFixed(1) + '" height="24" rx="4" fill="' + (net >= 0 ? PALETTE.posMid : PALETTE.neg) + '"/>' +
      '<text x="' + (166 + wNet).toFixed(1) + '" y="139" font-size="11.5" font-family="monospace" font-weight="bold" fill="' + (net >= 0 ? PALETTE.pos : PALETTE.neg) + '">' + (net >= 0 ? '+' : '-') + '₹' + Math.abs(net).toFixed(1) + ' Cr (' + ratioTxt + ')</text>' +
      '</svg>';

    byId('jsf-sb-breakeven-note').textContent = (typeof customNote === 'string' && customNote)
      ? customNote
      : ('盈亏平衡临界点：仅需期权反向倍数 k > ' + minK.toFixed(2) + 'x 即可覆盖底层操纵损耗（当前设定 k = ' + k.toFixed(2) + 'x）。');
  }

  function selectReplayDay(key) {
    stopReplayTimer();
    currentReplayKey = key;
    root.querySelectorAll('[data-jsf-rday]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-jsf-rday') === key);
    });
    const d = APP_DATA.replays[key];
    currentReplayStep = d.times.length - 1;
    const scrub = byId('jsf-replay-scrubber');
    scrub.max = d.times.length - 1;
    scrub.value = currentReplayStep;

    byId('jsf-replay-kpi-row').innerHTML = d.summary_metrics.map(m =>
      '<div style="background:var(--jsf-elevated);border:1px solid var(--jsf-line);border-radius:var(--jsf-radius-md);padding:10px 12px;">' +
      '<div style="font-size:11.5px;color:var(--jsf-muted);">' + m.k + '</div>' +
      '<div class="jsf-mono" style="font-size:16.5px;font-weight:700;color:' + (String(m.v).trim().startsWith('-') ? 'var(--jsf-neg)' : 'var(--jsf-pos)') + ';margin:2px 0;">' + m.v + '</div>' +
      '<div style="font-size:11px;color:var(--jsf-ink-2);">' + m.sub + '</div></div>'
    ).join('');

    renderReplayPhases();
    updateEvidenceDrawerImages();
    drawReplayCanvas();
  }

  function renderReplayPhases() {
    const d = APP_DATA.replays[currentReplayKey];
    byId('jsf-replay-phase-strip').innerHTML = d.phases.map(p =>
      '<button type="button" class="jsf-phase-card ' + (currentReplayStep === p.idx ? 'active' : '') + '" data-jsf-phase-idx="' + p.idx + '">' +
      '<div class="jsf-ptag">' + p.tag + '</div>' +
      '<div style="color:var(--jsf-ink-2);line-height:1.45;">' + p.desc + '</div></button>'
    ).join('');
  }

  function jumpReplayPhase(stepIdx) {
    stopReplayTimer();
    currentReplayStep = stepIdx;
    byId('jsf-replay-scrubber').value = stepIdx;
    renderReplayPhases();
    drawReplayCanvas();
  }

  function scrubReplay(val) {
    stopReplayTimer();
    currentReplayStep = parseInt(val, 10) || 0;
    renderReplayPhases();
    drawReplayCanvas();
  }

  function stepReplay(delta) {
    stopReplayTimer();
    const d = APP_DATA.replays[currentReplayKey];
    currentReplayStep = Math.max(0, Math.min(d.times.length - 1, currentReplayStep + delta));
    byId('jsf-replay-scrubber').value = currentReplayStep;
    renderReplayPhases();
    drawReplayCanvas();
  }

  function resetReplayFull() {
    stopReplayTimer();
    const d = APP_DATA.replays[currentReplayKey];
    currentReplayStep = d.times.length - 1;
    byId('jsf-replay-scrubber').value = currentReplayStep;
    renderReplayPhases();
    drawReplayCanvas();
  }

  function toggleReplayPlay() {
    if (replayTimer) {
      stopReplayTimer();
      return;
    }
    const d = APP_DATA.replays[currentReplayKey];
    if (currentReplayStep >= d.times.length - 1) currentReplayStep = 0;
    byId('jsf-btn-play-replay').textContent = '⏸ 暂停回放';
    replayTimer = setInterval(() => {
      if (currentReplayStep < d.times.length - 1) {
        currentReplayStep++;
        byId('jsf-replay-scrubber').value = currentReplayStep;
        renderReplayPhases();
        drawReplayCanvas();
      } else {
        stopReplayTimer();
      }
    }, 550);
  }

  function stopReplayTimer() {
    if (replayTimer) {
      clearInterval(replayTimer);
      replayTimer = null;
    }
    const btn = byId('jsf-btn-play-replay');
    if (btn) btn.textContent = '▶ 自动播放推演';
  }

  function toggleEvidenceDrawer(forceClose) {
    const dr = byId('jsf-evidence-drawer');
    if (forceClose === true) dr.classList.remove('open');
    else dr.classList.toggle('open');
    updateEvidenceDrawerImages();
  }

  function updateEvidenceDrawerImages() {
    const titles = {
      jan17: 'SEBI 临时禁令第 48 页（六轨全天图）与第 23 页（BANKNIFTY 5分钟K线图）原始证据',
      jul10: 'SEBI 临时禁令第 65 页（2024-07-10 BANKNIFTY 延长标记收盘价六轨图）原始证据',
      may15: 'SEBI 临时禁令第 85 页（2025-05-15 NIFTY 尾盘多头标记收盘价六轨图，注意 CM 现货轨几乎为零）原始证据'
    };
    byId('jsf-evidence-drawer-title').textContent = titles[currentReplayKey];
    byId('jsf-ev-img-jan17').style.display = currentReplayKey === 'jan17' ? 'block' : 'none';
    byId('jsf-ev-img-jan17-ohlc').style.display = currentReplayKey === 'jan17' ? 'block' : 'none';
    byId('jsf-ev-img-jul10').style.display = currentReplayKey === 'jul10' ? 'block' : 'none';
    byId('jsf-ev-img-may15').style.display = currentReplayKey === 'may15' ? 'block' : 'none';
  }

  function drawReplayCanvas() {
    const canvas = byId('jsf-replay-canvas');
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const W = Math.max(280, rect.width);
    const H = Math.max(400, rect.height);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const d = APP_DATA.replays[currentReplayKey];
    const N = d.times.length;
    const activeIdx = hoverIndex !== null ? Math.min(hoverIndex, currentReplayStep) : currentReplayStep;

    byId('jsf-replay-time-lbl').textContent = d.times[currentReplayStep];
    byId('jsf-replay-live-readout').innerHTML =
      '<span>当前截面 <strong>' + d.times[activeIdx] + '</strong></span>' +
      '<span>' + d.index + ' 现货: <strong>' + d.spot[activeIdx].toLocaleString('en-IN') + '</strong></span>' +
      '<span>期权净 Delta: <strong class="' + (d.delta[activeIdx] >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + fmtCr(d.delta[activeIdx], true) + '</strong></span>' +
      '<span>累计期权盈利: <strong class="jsf-pos">+₹' + d.profit[activeIdx].toFixed(2) + ' Cr</strong></span>' +
      '<span>CM现货分段: <strong class="' + (d.cm[activeIdx] >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + (d.cm[activeIdx] >= 0 ? '+' : '') + d.cm[activeIdx] + ' Cr</strong></span>' +
      '<span>FUTSTK分段: <strong class="' + (d.futstk[activeIdx] >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + (d.futstk[activeIdx] >= 0 ? '+' : '') + d.futstk[activeIdx] + ' Cr</strong></span>' +
      '<span>FUTIDX分段: <strong class="' + (d.futidx[activeIdx] >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + (d.futidx[activeIdx] >= 0 ? '+' : '') + d.futidx[activeIdx] + ' Cr</strong></span>';

    ctx.fillStyle = PALETTE.canvasBg;
    ctx.fillRect(0, 0, W, H);

    const compact = W < 480;
    const padL = compact ? 48 : 64;
    const padR = compact ? 52 : 72;
    const padT = 18;
    const padB = 28;
    const plotW = Math.max(120, W - padL - padR);
    const xAt = i => padL + (i / (N - 1)) * plotW;

    if (currentReplayKey === 'jan17') {
      ctx.fillStyle = PALETTE.posTint;
      ctx.fillRect(xAt(0), padT, xAt(11) - xAt(0), H - padT - padB);
      ctx.fillStyle = PALETTE.negTint;
      ctx.fillRect(xAt(11), padT, xAt(25) - xAt(11), H - padT - padB);
    } else if (currentReplayKey === 'jul10') {
      ctx.fillStyle = PALETTE.negTint;
      ctx.fillRect(xAt(14), padT, xAt(25) - xAt(14), H - padT - padB);
    } else if (currentReplayKey === 'may15') {
      ctx.fillStyle = PALETTE.posTint;
      ctx.fillRect(xAt(11), padT, xAt(25) - xAt(11), H - padT - padB);
    }

    const availH = H - padT - padB - 24;
    const t1 = { y: padT, h: availH * 0.34 };
    const t2 = { y: t1.y + t1.h + 8, h: availH * 0.20 };
    const t3 = { y: t2.y + t2.h + 8, h: availH * 0.23 };
    const t4 = { y: t3.y + t3.h + 8, h: availH * 0.23 };

    [t1, t2, t3, t4].forEach(tr => {
      ctx.strokeStyle = PALETTE.gridBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(padL, tr.y, plotW, tr.h);
    });

    function drawLine(arr, minV, maxV, tr, color, dashed) {
      const span = (maxV - minV) || 1;
      ctx.save();
      ctx.beginPath();
      if (dashed) ctx.setLineDash([4, 3]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      for (let i = 0; i <= currentReplayStep; i++) {
        const px = xAt(i);
        const py = tr.y + tr.h - ((arr[i] - minV) / span) * (tr.h - 10) - 5;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    const sMin = Math.min(...d.spot), sMax = Math.max(...d.spot);
    const dMin = Math.min(...d.delta, 0), dMax = Math.max(...d.delta, 0);
    drawLine(d.spot, sMin, sMax, t1, PALETTE.plum, false);
    drawLine(d.delta, dMin, dMax, t1, PALETTE.neg, true);

    ctx.font = (compact ? '600 9.5px sans-serif' : 'bold 11px sans-serif');
    ctx.fillStyle = PALETTE.plum;
    ctx.textAlign = 'left';
    ctx.fillText('● 指数点位(左)', padL + 6, t1.y + 13);
    if (!compact) {
      ctx.fillStyle = PALETTE.neg;
      ctx.fillText('--- 期权净Delta敞口 Cr(右)', padL + 108, t1.y + 13);
    }

    ctx.font = '9.5px monospace';
    ctx.fillStyle = PALETTE.plum;
    ctx.textAlign = 'right';
    ctx.fillText(sMax.toLocaleString('en-IN'), padL - 4, t1.y + 11);
    ctx.fillText(sMin.toLocaleString('en-IN'), padL - 4, t1.y + t1.h - 4);

    ctx.fillStyle = PALETTE.neg;
    ctx.textAlign = 'left';
    ctx.fillText((dMax / 1000).toFixed(1) + 'k', padL + plotW + 4, t1.y + 11);
    ctx.fillText((dMin / 1000).toFixed(1) + 'k', padL + plotW + 4, t1.y + t1.h - 4);

    const pMin = Math.min(0, ...d.profit), pMax = Math.max(50, ...d.profit);
    drawLine(d.profit, pMin, pMax, t2, PALETTE.pos, false);
    ctx.textAlign = 'left';
    ctx.font = (compact ? '600 9.5px sans-serif' : 'bold 11px sans-serif');
    ctx.fillStyle = PALETTE.pos;
    ctx.fillText('● 累计期权盈利 MTM (₹ Cr)', padL + 6, t2.y + 13);
    ctx.font = '9.5px monospace';
    ctx.fillText('+' + pMax.toFixed(0), padL + plotW + 4, t2.y + 11);
    ctx.fillText('0', padL + plotW + 4, t2.y + t2.h - 4);

    function drawBars(arr, arr2, tr, label1, label2) {
      const allVals = arr.concat(arr2 || []);
      const maxAbs = Math.max(50, ...allVals.map(v => Math.abs(v)));
      const midY = tr.y + tr.h / 2;
      ctx.strokeStyle = PALETTE.zeroAxis;
      ctx.beginPath();
      ctx.moveTo(padL, midY);
      ctx.lineTo(padL + plotW, midY);
      ctx.stroke();

      const bw = Math.max(3, (plotW / N) * 0.56);
      for (let i = 0; i <= currentReplayStep; i++) {
        const cx = xAt(i);
        const v1 = arr[i];
        const h1 = (Math.abs(v1) / maxAbs) * (tr.h * 0.44);
        ctx.fillStyle = v1 >= 0 ? PALETTE.posMid : PALETTE.negMid;
        ctx.fillRect(cx - bw / 2, v1 >= 0 ? midY - h1 : midY, arr2 ? bw * 0.52 : bw, h1);

        if (arr2 && arr2[i] !== 0) {
          const v2 = arr2[i];
          const h2 = (Math.abs(v2) / maxAbs) * (tr.h * 0.44);
          ctx.fillStyle = v2 >= 0 ? PALETTE.pos : PALETTE.negDark;
          ctx.fillRect(cx + 1, v2 >= 0 ? midY - h2 : midY, bw * 0.48, h2);
        }
      }
      ctx.textAlign = 'left';
      ctx.font = (compact ? '600 9.5px sans-serif' : 'bold 11px sans-serif');
      ctx.fillStyle = PALETTE.inkSub;
      ctx.fillText(compact ? label1 : (label1 + (label2 ? '  |  ' + label2 : '')), padL + 6, tr.y + 13);
      ctx.font = '9.5px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('+' + maxAbs.toFixed(0), padL - 4, tr.y + 11);
      ctx.fillText('-' + maxAbs.toFixed(0), padL - 4, tr.y + tr.h - 3);
    }

    drawBars(d.cm, d.futidx, t3, '■ CM 成分股现货净买卖(Cr)', '■ FUTIDX 股指期货(深色柱)');
    drawBars(d.futstk, null, t4, '■ FUTSTK 成分股个股期货净买卖(Cr)', '');

    ctx.fillStyle = PALETTE.inkSub;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const stepStride = compact ? 5 : 3;
    for (let i = 0; i < N; i += stepStride) {
      ctx.fillText(d.times[i], xAt(i), H - 8);
    }
    ctx.fillText(d.times[N - 1], xAt(N - 1), H - 8);

    const cx = xAt(activeIdx);
    ctx.save();
    ctx.strokeStyle = PALETTE.ochre;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, padT);
    ctx.lineTo(cx, H - padB);
    ctx.stroke();
    ctx.restore();
  }

  function renderStrikeChart() {
    const strikeEl = byId('jsf-strike-select');
    if (!strikeEl) return;
    const strike = strikeEl.value;
    const cols = APP_DATA.table14.cols;
    const sData = APP_DATA.table14.strikes[strike];
    if (!sData) return;

    const pe = sData.pe;
    const ce = sData.ce;
    const maxP = Math.max(...pe, ...ce, 100);

    const W = 540, H = 245, padL = 48, padR = 24, padT = 20, padB = 34;
    const pw = W - padL - padR, ph = H - padT - padB;
    const xAt = i => padL + (i / (cols.length - 1)) * pw;
    const yAt = v => padT + ph - (v / maxP) * ph;

    const polyCE = ce.map((v, i) => xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1)).join(' ');
    const polyPE = pe.map((v, i) => xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1)).join(' ');

    const dotsCE = ce.map((v, i) => '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(v).toFixed(1) + '" r="3.8" fill="' + PALETTE.pos + '"><title>' + cols[i] + ' Call: ₹' + v + '</title></circle>').join('');
    const dotsPE = pe.map((v, i) => '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(v).toFixed(1) + '" r="3.8" fill="' + PALETTE.negMid + '"><title>' + cols[i] + ' Put: ₹' + v + '</title></circle>').join('');
    const xLabels = cols.map((c, i) => '<text x="' + xAt(i).toFixed(1) + '" y="' + (H - 10) + '" font-size="10.5" font-family="monospace" text-anchor="middle" fill="' + (i === 9 ? PALETTE.neg : PALETTE.inkSub) + '" font-weight="' + (i === 9 ? 'bold' : 'normal') + '">' + c + '</text>').join('');

    byId('jsf-strike-svg-box').innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%">' +
      '<rect x="' + xAt(1) + '" y="' + padT + '" width="' + (xAt(8) - xAt(1)) + '" height="' + ph + '" fill="' + PALETTE.ochreTint + '"/>' +
      '<text x="' + ((xAt(1) + xAt(8)) / 2) + '" y="' + (padT + 13) + '" font-size="10.5" text-anchor="middle" fill="' + PALETTE.ochre + '">09:15–09:22 JS强拉现货诱多建空窗口</text>' +
      '<line x1="' + padL + '" y1="' + (padT + ph) + '" x2="' + (W - padR) + '" y2="' + (padT + ph) + '" stroke="' + PALETTE.zeroAxis + '"/>' +
      '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + ph) + '" stroke="' + PALETTE.zeroAxis + '"/>' +
      '<polyline fill="none" stroke="' + PALETTE.pos + '" stroke-width="2.5" points="' + polyCE + '"/>' +
      '<polyline fill="none" stroke="' + PALETTE.negMid + '" stroke-width="2.5" points="' + polyPE + '"/>' +
      dotsCE + dotsPE + xLabels +
      '<text x="' + (padL - 6) + '" y="' + (padT + 10) + '" font-size="10" font-family="monospace" text-anchor="end" fill="' + PALETTE.inkSub + '">₹' + maxP.toFixed(0) + '</text>' +
      '<text x="' + (padL - 6) + '" y="' + (padT + ph) + '" font-size="10" font-family="monospace" text-anchor="end" fill="' + PALETTE.inkSub + '">₹0</text>' +
      '<text x="' + (W - padR - 4) + '" y="' + (padT + 16) + '" font-size="11" font-weight="bold" text-anchor="end" fill="' + PALETTE.pos + '">● ' + strike + ' CE (JS 高位做空)</text>' +
      '<text x="' + (W - padR - 4) + '" y="' + (padT + 32) + '" font-size="11" font-weight="bold" text-anchor="end" fill="' + PALETTE.negMid + '">● ' + strike + ' PE (JS 低位抄底)</text>' +
      '</svg>';

    const cePeak = Math.max(...ce.slice(1, 9));
    const peTrough = Math.min(...pe.slice(1, 9));
    const peClose = pe[9];
    const ceClose = ce[9];

    byId('jsf-strike-stats-callout').innerHTML =
      '<strong><code>BANKNIFTY ' + strike + '</code> 合约实证收割链（Table 14）：</strong><br>' +
      '• <strong>Call 端（JS 高位卖空）：</strong>开盘 <code>₹' + ce[0] + '</code> → 被 JS 强拉指数推高至峰值 <strong><code>₹' + cePeak + '</code></strong>（散户追涨接盘）→ 15:29 收盘暴跌至 <strong><code>₹' + ceClose + '</code></strong>（跌幅 <strong>-99.9%</strong>，权利金几乎全额归零落袋）。<br>' +
      '• <strong>Put 端（JS 逢低买入）：</strong>开盘 <code>₹' + pe[0] + '</code> → 被人为打压至低谷 <strong><code>₹' + peTrough + '</code></strong>（JS 大举扫货建仓）→ 15:29 随下午砸盘飙升至 <strong><code>₹' + peClose + '</code></strong>（较诱多低点暴涨 <strong>' + (peClose / peTrough).toFixed(1) + ' 倍</strong>）。';
  }

  function initModule4Tables() {
    const maxD = 2500;
    byId('jsf-table15-bars-box').innerHTML = APP_DATA.table15.map(r => {
      const wCE = Math.min(100, (Math.abs(r.ce_delta_cr) / maxD) * 100);
      const wPE = Math.min(100, (Math.abs(r.pe_delta_cr) / maxD) * 100);
      return '<div style="padding:6px 4px;border-bottom:1px dashed var(--jsf-line);font-size:12px;">' +
        '<div style="display:flex;justify-content:space-between;font-family:var(--mono);flex-wrap:wrap;gap:4px;">' +
        '<strong>Strike ' + r.strike + '</strong>' +
        '<span>CE Delta: <span class="' + (r.ce_delta_cr >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + r.ce_delta_cr.toFixed(2) + ' Cr</span> | PE Delta: <span class="' + (r.pe_delta_cr >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + r.pe_delta_cr.toFixed(2) + ' Cr</span></span></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">' +
        '<div style="background:var(--jsf-panel);height:8px;border-radius:3px;overflow:hidden;"><div style="width:' + wCE.toFixed(1) + '%;height:100%;background:' + (r.ce_delta_cr < 0 ? 'var(--jsf-neg-mid)' : 'var(--jsf-pos-mid)') + ';"></div></div>' +
        '<div style="background:var(--jsf-panel);height:8px;border-radius:3px;overflow:hidden;"><div style="width:' + wPE.toFixed(1) + '%;height:100%;background:' + (r.pe_delta_cr < 0 ? 'var(--jsf-neg)' : 'var(--jsf-pos-mid)') + ';"></div></div>' +
        '</div></div>';
    }).join('');

    const t13 = APP_DATA.table13;
    let th1 = '<tr><th rowspan="2">分钟 (HH:MM)</th>';
    let th2 = '<tr>';
    t13.stocks.forEach(s => {
      th1 += '<th colspan="2" style="text-align:center;border-left:1px solid var(--jsf-line-2);">' + s.scrip + '</th>';
      th2 += '<th class="jsf-num" style="border-left:1px solid var(--jsf-line-2);color:var(--jsf-pos);">JS</th><th class="jsf-num" style="color:var(--jsf-neg);">市场其余</th>';
    });
    th1 += '</tr>';
    th2 += '</tr>';

    const bodyRows = t13.times.map((tm, idx) => {
      let cells = '<td class="jsf-mono"><strong>' + tm + '</strong></td>';
      t13.stocks.forEach(s => {
        const jv = s.js[idx], ov = s.other[idx];
        cells += '<td class="jsf-num ' + (jv >= 0 ? 'jsf-pos' : 'jsf-neg') + '" style="border-left:1px solid var(--jsf-line);">' + (jv >= 0 ? '+' : '') + jv + '</td>';
        cells += '<td class="jsf-num ' + (ov >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + (ov >= 0 ? '+' : '') + ov + '</td>';
      });
      return '<tr>' + cells + '</tr>';
    }).join('');

    let totCells = '<td><strong>8分钟合计 (Total)</strong></td>';
    t13.stocks.forEach(s => {
      totCells += '<td class="jsf-num jsf-pos" style="border-left:1px solid var(--jsf-line-2);">+' + s.js_tot + '</td><td class="jsf-num jsf-neg">' + s.other_tot + '</td>';
    });

    byId('jsf-table13-dom').innerHTML = '<thead>' + th1 + th2 + '</thead><tbody>' + bodyRows + '<tr class="jsf-tot-row">' + totCells + '</tr></tbody>';
  }

  function selectConstituentDS(dsKey) {
    currentDSKey = dsKey;
    root.querySelectorAll('[data-jsf-ds]').forEach(b => b.classList.toggle('active', b.getAttribute('data-jsf-ds') === dsKey));
    renderConstituentExplorer();
  }

  function renderConstituentExplorer() {
    const ds = APP_DATA.constituents[currentDSKey];
    if (!ds) return;
    byId('jsf-ds-note-banner').innerHTML = '<strong>' + ds.title + '（窗口：<code>' + ds.window + '</code>）</strong><br>' + ds.note;

    const q = (byId('jsf-ds-search').value || '').trim().toUpperCase();
    const sortMode = byId('jsf-ds-sort').value;

    const rows = ds.rows.filter(r => !q || r.scrip.toUpperCase().includes(q));
    rows.sort((a, b) => {
      if (sortMode === 'share') return b.share - a.share;
      if (sortMode === 'abs_ltp') return Math.abs(b.trd_ltp) - Math.abs(a.trd_ltp);
      if (sortMode === 'trades') return b.trades - a.trades;
      return b.js_tv - a.js_tv;
    });

    const maxLTP = Math.max(50, ...rows.map(r => Math.max(Math.abs(r.trd_ltp), Math.abs(r.rest_ltp))));

    byId('jsf-butterfly-chart-container').innerHTML = rows.slice(0, 20).map(r => {
      const jsPct = Math.min(100, (Math.abs(r.trd_ltp) / maxLTP) * 100);
      const mktPct = Math.min(100, (Math.abs(r.rest_ltp) / maxLTP) * 100);
      return '<div class="jsf-bfly-row"><div><strong class="jsf-mono">' + r.scrip + '</strong><div style="font-size:11px;color:var(--jsf-muted);">占比 ' + r.share.toFixed(2) + '%</div></div>' +
        '<div><div class="jsf-bfly-track" title="Jane Street 成交级净 LTP 冲击: ' + r.trd_ltp + ' INR">' +
        '<div class="jsf-bfly-left">' + (r.trd_ltp < 0 ? '<div class="jsf-bfly-bar-neg" style="width:' + jsPct.toFixed(1) + '%;"></div>' : '') + '</div>' +
        '<div class="jsf-bfly-axis"></div>' +
        '<div class="jsf-bfly-right">' + (r.trd_ltp > 0 ? '<div class="jsf-bfly-bar-pos" style="width:' + jsPct.toFixed(1) + '%;"></div>' : '') + '</div></div>' +
        '<div class="jsf-bfly-track" style="height:11px;margin-top:2px;background:transparent;" title="其余市场参与者合计净 LTP 冲击: ' + r.rest_ltp + ' INR">' +
        '<div class="jsf-bfly-left">' + (r.rest_ltp < 0 ? '<div class="jsf-bfly-bar-mkt-neg" style="width:' + mktPct.toFixed(1) + '%;"></div>' : '') + '</div>' +
        '<div class="jsf-bfly-axis" style="height:11px;"></div>' +
        '<div class="jsf-bfly-right">' + (r.rest_ltp > 0 ? '<div class="jsf-bfly-bar-mkt-pos" style="width:' + mktPct.toFixed(1) + '%;"></div>' : '') + '</div></div></div>' +
        '<div class="jsf-mono" style="text-align:right;font-size:11.5px;">' +
        '<div class="' + (r.trd_ltp >= 0 ? 'jsf-pos' : 'jsf-neg') + '">JS: ' + (r.trd_ltp >= 0 ? '+' : '') + r.trd_ltp.toFixed(1) + '</div>' +
        '<div style="color:var(--jsf-muted);">Mkt: ' + (r.rest_ltp >= 0 ? '+' : '') + r.rest_ltp.toFixed(1) + '</div></div></div>';
    }).join('') || '<div style="padding:12px;color:var(--jsf-muted);">无匹配标的</div>';

    const totJS = rows.reduce((s, r) => s + r.js_tv, 0);
    const totMkt = rows.reduce((s, r) => s + r.mkt_tv, 0);

    byId('jsf-ds-table-tbody').innerHTML = rows.map(r =>
      '<tr><td><strong class="jsf-mono">' + r.scrip + '</strong></td>' +
      '<td class="jsf-mono" style="font-size:12px;">' + r.win + '</td>' +
      '<td class="jsf-num">' + fmtIndianInt(r.trades) + '</td>' +
      '<td class="jsf-num"><strong>' + r.js_tv.toFixed(2) + '</strong></td>' +
      '<td class="jsf-num">' + r.mkt_tv.toFixed(2) + '</td>' +
      '<td class="jsf-num"><span class="jsf-badge ' + (r.share >= 25 ? 'jsf-badge-neg' : 'jsf-badge-pos') + '">' + r.share.toFixed(2) + '%</span></td>' +
      '<td class="jsf-num ' + (r.ord_ltp >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + (r.ord_ltp >= 0 ? '+' : '') + r.ord_ltp.toFixed(2) + '</td>' +
      '<td class="jsf-num ' + (r.trd_ltp >= 0 ? 'jsf-pos' : 'jsf-neg') + '">' + (r.trd_ltp >= 0 ? '+' : '') + r.trd_ltp.toFixed(2) + '</td>' +
      '<td class="jsf-num" style="color:var(--jsf-ink-2);">' + (r.rest_ltp >= 0 ? '+' : '') + r.rest_ltp.toFixed(2) + '</td>' +
      '<td class="jsf-num">' + r.open + ' → ' + r.close + '</td></tr>'
    ).join('') +
      '<tr class="jsf-tot-row"><td>当前筛选合计 (' + rows.length + ' 标的)</td><td class="jsf-mono">' + ds.window + '</td>' +
      '<td class="jsf-num">' + fmtIndianInt(rows.reduce((s, r) => s + r.trades, 0)) + '</td>' +
      '<td class="jsf-num">' + totJS.toFixed(2) + '</td><td class="jsf-num">' + totMkt.toFixed(2) + '</td>' +
      '<td class="jsf-num">' + (totMkt > 0 ? ((totJS / totMkt) * 100).toFixed(2) + '%' : '-') + '</td>' +
      '<td class="jsf-num">' + rows.reduce((s, r) => s + r.ord_ltp, 0).toFixed(2) + '</td>' +
      '<td class="jsf-num">' + rows.reduce((s, r) => s + r.trd_ltp, 0).toFixed(2) + '</td>' +
      '<td class="jsf-num">' + rows.reduce((s, r) => s + r.rest_ltp, 0).toFixed(2) + '</td><td class="jsf-num">-</td></tr>';
  }

  function filterLedgerIndex(idx) {
    ledgerFilterIdx = idx;
    root.querySelectorAll('[data-jsf-fidx]').forEach(b => b.classList.toggle('active', b.getAttribute('data-jsf-fidx') === idx));
    renderLedger();
  }

  function filterLedgerStrat(st) {
    ledgerFilterStrat = st;
    root.querySelectorAll('[data-jsf-fstrat]').forEach(b => b.classList.toggle('active', b.getAttribute('data-jsf-fstrat') === st));
    renderLedger();
  }

  function renderLedger() {
    const grandTotal = 48435770168;
    const rows = APP_DATA.table44.filter(d => {
      if (ledgerFilterIdx !== 'ALL' && d.index !== ledgerFilterIdx) return false;
      if (ledgerFilterStrat !== 'ALL' && d.strategy !== ledgerFilterStrat) return false;
      return true;
    });

    const subSum = rows.reduce((s, r) => s + r.profit_inr, 0);
    byId('jsf-ledger-summary-bar').innerHTML =
      '<span>筛选命中天数: <strong>' + rows.length + ' / 21 天</strong></span>' +
      '<span>精确卢比合计: <strong class="jsf-pos">₹' + subSum.toLocaleString('en-IN') + '</strong></span>' +
      '<span>折算 Crore: <strong>₹' + (subSum / 1e7).toFixed(2) + ' Cr</strong></span>' +
      '<span>占总追缴额比例: <strong>' + ((subSum / grandTotal) * 100).toFixed(2) + '%</strong></span>';

    const W = 920, H = 210, padL = 54, padR = 20, padT = 18, padB = 46;
    const pw = W - padL - padR, ph = H - padT - padB;
    const maxCr = Math.max(100, ...rows.map(r => r.profit_inr / 1e7));
    const bw = rows.length > 0 ? Math.min(34, (pw / rows.length) * 0.7) : 20;

    const barsSvg = rows.map((r, i) => {
      const cr = r.profit_inr / 1e7;
      const bh = (cr / maxCr) * ph;
      const x = padL + (i + 0.5) * (pw / rows.length) - bw / 2;
      const y = padT + ph - bh;
      const col = r.index === 'NIFTY' ? PALETTE.neg : (r.strategy === 'MarkingClose' ? PALETTE.ochreMid : PALETTE.pos);
      const cx = (x + bw / 2).toFixed(1);
      const ly = (padT + ph + 14).toFixed(1);
      return '<g><rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + col + '">' +
        '<title>' + r.raw_date + ' (' + r.index + ') · ₹' + cr.toFixed(2) + ' Cr</title></rect>' +
        '<text x="' + cx + '" y="' + (y - 4).toFixed(1) + '" font-size="9.5" font-family="monospace" text-anchor="middle" fill="' + PALETTE.ink + '">' + cr.toFixed(0) + '</text>' +
        '<text x="' + cx + '" y="' + ly + '" font-size="9" font-family="monospace" text-anchor="end" transform="rotate(-32 ' + cx + ' ' + ly + ')" fill="' + PALETTE.inkSub + '">' + r.raw_date.slice(0, 5) + '/' + r.raw_date.slice(8) + '</text></g>';
    }).join('');

    byId('jsf-ledger-chart-box').innerHTML = rows.length
      ? '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%">' +
        '<line x1="' + padL + '" y1="' + (padT + ph) + '" x2="' + (W - padR) + '" y2="' + (padT + ph) + '" stroke="' + PALETTE.zeroAxis + '"/>' +
        '<text x="' + (padL + 6) + '" y="' + (padT + 10) + '" font-size="11" fill="' + PALETTE.inkSub + '">图例：■ 深绿 = BANKNIFTY 日内拉砸操纵 (15天)  ｜  ■ 赭金 = BANKNIFTY 延长标记收盘 (3天)  ｜  ■ 陶土红 = 2025年5月 NIFTY 顶风作案 (3天)</text>' +
        barsSvg + '</svg>'
      : '<div style="padding:30px;text-align:center;color:var(--jsf-muted);">当前组合无记录（注：NIFTY 涉案日全部属于“延长标记收盘价策略”）</div>';

    byId('jsf-table44-tbody').innerHTML = rows.map(r => {
      const cr = r.profit_inr / 1e7;
      return '<tr><td class="jsf-mono">#' + r.sr + '</td><td class="jsf-mono"><strong>' + r.raw_date + '</strong></td>' +
        '<td><span class="jsf-badge ' + (r.index === 'NIFTY' ? 'jsf-badge-neg' : 'jsf-badge-pos') + '">' + r.index + '</span></td>' +
        '<td>' + r.strategy_cn + '</td>' +
        '<td class="jsf-num jsf-pos">₹' + r.profit_inr.toLocaleString('en-IN') + '</td>' +
        '<td class="jsf-num"><strong>' + cr.toFixed(2) + ' Cr</strong></td>' +
        '<td class="jsf-num">' + ((r.profit_inr / grandTotal) * 100).toFixed(2) + '%</td></tr>';
    }).join('') +
      '<tr class="jsf-tot-row"><td colspan="4"><strong>合计 (Grand / Filtered Total)</strong></td>' +
      '<td class="jsf-num jsf-pos">₹' + subSum.toLocaleString('en-IN') + '</td>' +
      '<td class="jsf-num">₹' + (subSum / 1e7).toFixed(2) + ' Cr</td>' +
      '<td class="jsf-num">' + ((subSum / grandTotal) * 100).toFixed(2) + '%</td></tr>';
  }

  const ORDER_CLAUSES = [
    { c: '62.1', target: '4家涉案实体 (连带责任)', liftOnEscrow: false, desc: '在印度商业银行开设托管账户（Escrow Account），连带存入全部涉嫌违法所得 ₹4,843,57,70,168/- 并设定以 SEBI 为受益人的留置权（Lien），未经 SEBI 许可不得解冻。' },
    { c: '62.2', target: '4家涉案实体', liftOnEscrow: true, desc: '全面禁止进入印度证券市场，禁止直接或间接买入、卖出或以其他方式交易任何证券。' },
    { c: '62.3', target: '开户银行', liftOnEscrow: true, desc: '冻结涉案实体单独或联名银行账户的一切借方划出（No Debits，允许资金转入及超出追缴额部分的划出，履行 62.1 托管划转除外）。' },
    { c: '62.4 & 62.5', target: '托管机构 & 证券存管处', liftOnEscrow: true, desc: '禁止第3、4号境外 FPI 实体的托管资产划出；禁止涉案实体所有 Demat 证券账户发生借方过户（允许贷方转入）。' },
    { c: '62.7 & 62.8', target: '过户代理 & 4家实体', liftOnEscrow: true, desc: '禁止共同基金份额转让或赎回；在违法所得全额存入托管账户前，不得处置或转让任何印度境内资产。' },
    { c: '62.9', target: '4家涉案实体', liftOnEscrow: false, desc: '自禁令签发之日起 15 日内，向 SEBI 提交其在印度的全部动产/不动产、银行及证券账户、持股明细完整清册。' },
    { c: '62.10', target: '4家涉案实体', liftOnEscrow: true, desc: '存续未平仓交易所衍生品合约须在 3 个月内或合约到期日（以较早者为准）平仓了结。' },
    { c: '62.11', target: '解禁触发联动条款', liftOnEscrow: false, desc: '【核心机制】一旦涉案实体全额履行第 62.1 款（将 ₹4,843.58 Cr 存入共管账户），第 62.2、62.3、62.4、62.5、62.7、62.8 及 62.10 款的市场禁入与账户冻结自动终止适用。' },
    { c: '62.12 & 62.13', target: '4家实体 & 证券交易所', liftOnEscrow: false, desc: '永久停止并不得直接或间接从事本禁令认定的任何操纵模式（Cease & Desist）；证券交易所必须在调查终结前持续严密监控 JS 集团一切后续交易与头寸（另依第63段享21天陈述申辩与听证申请期）。' }
  ];

  function setOrderState(st) {
    currentOrderState = st;
    root.querySelectorAll('[data-jsf-ostate]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-jsf-ostate') === st);
      btn.classList.toggle('jsf-terra', btn.getAttribute('data-jsf-ostate') === st && st === 'pre');
    });

    const banner = byId('jsf-order-state-banner');
    if (st === 'pre') {
      banner.className = 'jsf-callout jsf-terra';
      banner.innerHTML = '<strong>当前模拟状态：禁令签发即时生效状态（未完成第 62.1 款托管金缴存）</strong> —— 全面市场禁入（62.2）与银行/托管/Demat 账户只进不出冻结令全部处于<strong>强制封锁中</strong>，以防境外 FPI 将资产迅速变现汇出印度（Para 53, 58）。';
    } else {
      banner.className = 'jsf-callout';
      banner.innerHTML = '<strong>当前模拟状态：履行第 62.1 款全额存入 ₹4,843,57,70,168 托管保证金后（触发第 62.11 款）</strong> —— 市场禁入与账户冻结条款依法解除，但 <strong>₹4,843.58 Cr 资金继续由 SEBI 留置冻结</strong>，且<strong>禁止操纵令（62.12）与交易所实时严密监控（62.13）持续有效</strong>，直至全市场扩面调查与最终裁决完成。';
    }

    byId('jsf-clauses-tbody').innerHTML = ORDER_CLAUSES.map(r => {
      const lifted = (st === 'post' && r.liftOnEscrow);
      const badge = lifted
        ? '<span class="jsf-badge jsf-badge-muted">依 62.11 款自动解除</span>'
        : '<span class="jsf-badge jsf-badge-neg">● 强制生效中</span>';
      return '<tr style="' + (lifted ? 'opacity:0.65;' : '') + '"><td class="jsf-mono"><strong>Clause ' + r.c + '</strong></td>' +
        '<td style="white-space:normal;min-width:280px;">' + r.desc + '</td><td>' + r.target + '</td><td>' + badge + '</td></tr>';
    }).join('');
  }

  function bindEvents() {
    root.addEventListener('click', ev => {
      const target = ev.target;
      if (!(target instanceof Element)) return;

      const tabBtn = target.closest('[data-jsf-tab]');
      if (tabBtn) { switchTab(tabBtn.getAttribute('data-jsf-tab')); return; }

      const entCard = target.closest('[data-jsf-eid]');
      if (entCard && !target.closest('a')) { selectEntity(entCard.getAttribute('data-jsf-eid')); return; }

      const mechBtn = target.closest('[data-jsf-mech]');
      if (mechBtn) { showMechanism(mechBtn.getAttribute('data-jsf-mech')); return; }

      const presetBtn = target.closest('[data-jsf-preset]');
      if (presetBtn) { loadSandboxPreset(presetBtn.getAttribute('data-jsf-preset')); return; }

      const rdayBtn = target.closest('[data-jsf-rday]');
      if (rdayBtn) { selectReplayDay(rdayBtn.getAttribute('data-jsf-rday')); return; }

      const phaseBtn = target.closest('[data-jsf-phase-idx]');
      if (phaseBtn) { jumpReplayPhase(parseInt(phaseBtn.getAttribute('data-jsf-phase-idx'), 10) || 0); return; }

      const dsBtn = target.closest('[data-jsf-ds]');
      if (dsBtn) { selectConstituentDS(dsBtn.getAttribute('data-jsf-ds')); return; }

      const fidxBtn = target.closest('[data-jsf-fidx]');
      if (fidxBtn) { filterLedgerIndex(fidxBtn.getAttribute('data-jsf-fidx')); return; }

      const fstratBtn = target.closest('[data-jsf-fstrat]');
      if (fstratBtn) { filterLedgerStrat(fstratBtn.getAttribute('data-jsf-fstrat')); return; }

      const ostateBtn = target.closest('[data-jsf-ostate]');
      if (ostateBtn) { setOrderState(ostateBtn.getAttribute('data-jsf-ostate')); return; }
    });

    root.addEventListener('keydown', ev => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      const target = ev.target;
      if (!(target instanceof Element)) return;
      const entCard = target.closest('[data-jsf-eid]');
      if (entCard) {
        ev.preventDefault();
        selectEntity(entCard.getAttribute('data-jsf-eid'));
      }
    });

    ['jsf-sb-x', 'jsf-sb-k', 'jsf-sb-move', 'jsf-sb-cost'].forEach(id => {
      const el = byId(id);
      if (el) el.addEventListener('input', () => updateSandbox());
    });

    byId('jsf-btn-play-replay')?.addEventListener('click', toggleReplayPlay);
    byId('jsf-btn-step-prev')?.addEventListener('click', () => stepReplay(-1));
    byId('jsf-btn-step-next')?.addEventListener('click', () => stepReplay(1));
    byId('jsf-btn-reset-replay')?.addEventListener('click', resetReplayFull);
    byId('jsf-replay-scrubber')?.addEventListener('input', ev => scrubReplay(ev.target.value));
    byId('jsf-btn-toggle-evidence')?.addEventListener('click', () => toggleEvidenceDrawer());
    byId('jsf-btn-close-evidence')?.addEventListener('click', () => toggleEvidenceDrawer(true));
    byId('jsf-strike-select')?.addEventListener('change', renderStrikeChart);
    byId('jsf-ds-search')?.addEventListener('input', renderConstituentExplorer);
    byId('jsf-ds-sort')?.addEventListener('change', renderConstituentExplorer);

    const canvas = byId('jsf-replay-canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', ev => {
        const rect = canvas.getBoundingClientRect();
        const compact = rect.width < 480;
        const padL = compact ? 48 : 64;
        const padR = compact ? 52 : 72;
        const plotW = Math.max(120, rect.width - padL - padR);
        const relX = ev.clientX - rect.left - padL;
        const d = APP_DATA.replays[currentReplayKey];
        const idx = Math.round((relX / plotW) * (d.times.length - 1));
        if (idx >= 0 && idx < d.times.length) {
          hoverIndex = idx;
          drawReplayCanvas();
        }
      });
      canvas.addEventListener('mouseleave', () => {
        hoverIndex = null;
        drawReplayCanvas();
      });
    }

    window.addEventListener('resize', () => {
      if (currentTab === 'm3') drawReplayCanvas();
    }, { passive: true });
  }

  function boot() {
    initModule1();
    showMechanism('lev');
    loadSandboxPreset('p_jan17_full');
    selectReplayDay('jan17');
    initModule4Tables();
    renderStrikeChart();
    renderConstituentExplorer();
    renderLedger();
    setOrderState('pre');
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
