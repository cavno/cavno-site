#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
称重机 weigher.py — 格雷厄姆–多德自动估值工作台（单文件 · 仅标准库）
依据《Value Investing: From Graham to Buffett and Beyond, 2nd ed.》(Greenwald et al., Wiley 2021)

用法:
  python weigher.py AAPL --price 190                    # 美股自动模式 (SEC EDGAR + Stooq)
  python weigher.py MGA  --assumptions mga.json         # 带假设文件
  python weigher.py --input manual.json                 # 手工模式（A股/港股/任意市场）
  python weigher.py --demo                              # 内置示例，离线端到端
  python weigher.py --selftest                          # 书中算例回归自检

设计三纲领（详见 PRD）:
  1. 每个模块对应书中一章，不发明任何估值逻辑；
  2. 人机分工显式化: A 全自动 / B 半自动可覆盖 / C 纯人工（程序只标注不猜测）;
  3. 审计优先: 全部中间量与数据血缘写入 result JSON。
"""
import argparse, gzip, io, json, math, os, re, statistics, sys, time, urllib.request
from datetime import date, datetime

VERSION = "1.0"
SEC_UA_DEFAULT = "WeigherResearch contact@example.com"   # SEC 要求 UA 含联系方式, 用 --ua 覆盖
CACHE_DIR = os.path.join(os.path.expanduser("~"), ".weigher_cache")
CACHE_TTL = 86400

# ---------------------------------------------------------------- 假设默认值 (★=可覆盖点; null=自动)
DEFAULT_ASSUMPTIONS = {
    "cost_of_capital": 0.10,      # B档: 定性区间法 7-14%, 默认 10%
    "fade_half_life": 30,         # C档: 默认保守 30 年 → 2.4%/年
    "vcf": None,                  # B档: None → clamp(v_realized, 0, 1.0)
    "organic_growth": None,       # B档: None → min(CAGR7, CAGR10) 截断 [0, 0.15]
    "margin_uplift": 0.0,         # 利润率爬升, 须历史可见才允许 >0
    "nwc_ratio": None,            # None → 自动
    "capital_intensity": None,    # None → 自动 (PP&E/收入均值)
    "avg_margin": None,           # None → 周期均值
    "tax_rate": None,             # None → 近3年均值
    "rd_years": 5,                # 无形①: 产品组合 = 年数 × 平均R&D
    "sgna_years": 1.0,            # 无形④: 组织基础 = 年数 × 平均SG&A (书: 1-3)
    "customer_pct_rev": 0.0,      # 无形②: C档, 默认不计
    "workforce_value": 0,         # 无形③: C档
    "ppe_factor": 1.0,            # PP&E 重置系数 (土地增值/棕地折价为人工判断)
    "legacy_liabilities": 0,      # C档: 欠缴养老金/环境/诉讼
    "growth_opex_addback": 0,     # 嵌在费用里的增长性开支加回 (保守默认0)
    "operating_cash_pct": 0.005,  # 经营性现金留存 (书: 0.25-0.5% 收入, 取保守端)
    "franchise": "auto",          # auto | yes | no  (C档人工裁定护城河的落点)
    "price": None, "market_cap": None,
    "notes": ""
}

# ---------------------------------------------------------------- 概念 → XBRL 标签映射 (优先级从左到右)
FLOW, STOCK = "flow", "stock"
TAGMAP = {
    "revenue": (FLOW, ["RevenueFromContractWithCustomerExcludingAssessedTax", "Revenues",
                       "SalesRevenueNet", "RevenueFromContractWithCustomerIncludingAssessedTax"]),
    "operating_income": (FLOW, ["OperatingIncomeLoss"]),
    "pretax_income": (FLOW, ["IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest",
                             "IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments"]),
    "tax_expense": (FLOW, ["IncomeTaxExpenseBenefit"]),
    "net_income": (FLOW, ["NetIncomeLoss", "ProfitLoss"]),
    "dna": (FLOW, ["DepreciationDepletionAndAmortization", "DepreciationAmortizationAndAccretionNet", "Depreciation"]),
    "capex": (FLOW, ["PaymentsToAcquirePropertyPlantAndEquipment", "PaymentsToAcquireProductiveAssets"]),
    "acquisitions": (FLOW, ["PaymentsToAcquireBusinessesNetOfCashAcquired"]),
    "rd": (FLOW, ["ResearchAndDevelopmentExpense"]),
    "sgna": (FLOW, ["SellingGeneralAndAdministrativeExpense"]),
    "interest_expense": (FLOW, ["InterestExpense", "InterestExpenseDebt"]),
    "dividends_paid": (FLOW, ["PaymentsOfDividends", "PaymentsOfDividendsCommonStock"]),
    "buybacks": (FLOW, ["PaymentsForRepurchaseOfCommonStock"]),
    "stock_issued": (FLOW, ["ProceedsFromIssuanceOfCommonStock"]),
    "cash": (STOCK, ["CashAndCashEquivalentsAtCarryingValue"]),
    "st_investments": (STOCK, ["ShortTermInvestments", "MarketableSecuritiesCurrent",
                               "AvailableForSaleSecuritiesDebtSecuritiesCurrent"]),
    "receivables": (STOCK, ["AccountsReceivableNetCurrent", "ReceivablesNetCurrent"]),
    "allowance": (STOCK, ["AllowanceForDoubtfulAccountsReceivableCurrent",
                          "AccountsReceivableAllowanceForCreditLossCurrent"]),
    "inventory": (STOCK, ["InventoryNet"]),
    "lifo_reserve": (STOCK, ["InventoryLIFOReserve", "ExcessOfReplacementOrCurrentCostsOverStatedLIFOValue"]),
    "ppe_net": (STOCK, ["PropertyPlantAndEquipmentNet"]),
    "ppe_gross": (STOCK, ["PropertyPlantAndEquipmentGross"]),
    "goodwill": (STOCK, ["Goodwill"]),
    "intangibles": (STOCK, ["IntangibleAssetsNetExcludingGoodwill", "FiniteLivedIntangibleAssetsNet"]),
    "total_assets": (STOCK, ["Assets"]),
    "total_liabilities": (STOCK, ["Liabilities"]),
    "payables": (STOCK, ["AccountsPayableCurrent", "AccountsPayableAndAccruedLiabilitiesCurrent"]),
    "debt_lt": (STOCK, ["LongTermDebtNoncurrent", "LongTermDebt"]),
    "debt_current": (STOCK, ["LongTermDebtCurrent", "DebtCurrent", "ShortTermBorrowings"]),
    "equity": (STOCK, ["StockholdersEquity",
                       "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"]),
    "minority": (STOCK, ["MinorityInterest", "RedeemableNoncontrollingInterestEquityCarryingAmount"]),
}
CONCEPTS = list(TAGMAP.keys())

# ---------------------------------------------------------------- 通用小件
def log(msg): print("[weigher] " + msg, file=sys.stderr)

def _days(a, b):
    try: return (date.fromisoformat(b) - date.fromisoformat(a)).days
    except Exception: return -1

def mean(xs): return statistics.fmean(xs) if xs else None
def clamp(x, lo, hi): return max(lo, min(hi, x))

def cagr(first, last, n):
    if first is None or last is None or first <= 0 or last <= 0 or n <= 0: return None
    return (last / first) ** (1.0 / n) - 1.0

def lin_trend(ys):
    """最小二乘: 返回 (斜率/期, R²)。用于利润率结构性变化提示。"""
    n = len(ys)
    if n < 4: return (0.0, 0.0)
    xs = list(range(n)); mx, my = mean(xs), mean(ys)
    sxx = sum((x - mx) ** 2 for x in xs)
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    if sxx == 0: return (0.0, 0.0)
    b = sxy / sxx
    syy = sum((y - my) ** 2 for y in ys)
    r2 = (sxy * sxy) / (sxx * syy) if syy > 0 else 0.0
    return (b, r2)

# ---------------------------------------------------------------- 数据层
def http_get(url, ua, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
    return raw if binary else raw.decode("utf-8", "replace")

def cached_json(url, ua, key):
    os.makedirs(CACHE_DIR, exist_ok=True)
    p = os.path.join(CACHE_DIR, key)
    if os.path.exists(p) and time.time() - os.path.getmtime(p) < CACHE_TTL:
        with open(p, encoding="utf-8") as f: return json.load(f)
    txt = http_get(url, ua)
    obj = json.loads(txt)
    with open(p, "w", encoding="utf-8") as f: json.dump(obj, f)
    time.sleep(0.15)   # 尊重 SEC 限速
    return obj

def ticker_to_cik(ticker, ua):
    m = cached_json("https://www.sec.gov/files/company_tickers.json", ua, "company_tickers.json")
    t = ticker.upper()
    for _, row in m.items():
        if row.get("ticker", "").upper() == t:
            return int(row["cik_str"]), row.get("title", t)
    raise SystemExit("找不到 ticker=%s 的 CIK（仅支持美股；非美股请用 --input 手工模式）" % ticker)

def fetch_companyfacts(cik, ua):
    return cached_json("https://data.sec.gov/api/xbrl/companyfacts/CIK%010d.json" % cik,
                       ua, "facts_%d.json" % cik)

def fetch_price_stooq(ticker, ua):
    try:
        csv = http_get("https://stooq.com/q/l/?s=%s.us&f=sd2t2ohlcv&e=csv" % ticker.lower(), ua)
        line = csv.strip().splitlines()[-1].split(",")
        px = float(line[6])
        return px if px > 0 else None
    except Exception as e:
        log("Stooq 价格获取失败(%s) → 请用 --price 指定" % e)
        return None

# ---------------------------------------------------------------- 年度化: facts → 统一年度表
def annual_series(facts, tags, kind):
    """按标签优先级抽取 10-K/FY 年度序列。返回 (dict{year:val}, dict{year:tag})"""
    out, src = {}, {}
    ug = facts.get("facts", {}).get("us-gaap", {})
    for tag in tags:
        node = ug.get(tag)
        if not node: continue
        units = node.get("units", {})
        uname = "USD" if "USD" in units else (next(iter(units)) if units else None)
        if not uname: continue
        best = {}   # year -> (filed, val)  同标签内重述取最新 filed
        for e in units[uname]:
            if not str(e.get("form", "")).startswith("10-K"): continue
            if e.get("fp") != "FY": continue
            end = e.get("end")
            if not end: continue
            if kind == FLOW:
                st = e.get("start")
                if not st or not (300 <= _days(st, end) <= 400): continue
            try: y = int(end[:4])
            except Exception: continue
            filed = e.get("filed", "")
            v = e.get("val")
            if v is None: continue
            if y not in best or filed > best[y][0]:
                best[y] = (filed, float(v))
        for y, (_, v) in best.items():
            if y not in out:          # 跨标签: 先到先得(高优先级标签优先)
                out[y] = v; src[y] = tag
    return out, src

def latest_shares(facts):
    node = facts.get("facts", {}).get("dei", {}).get("EntityCommonStockSharesOutstanding")
    if not node: return None
    ents = node.get("units", {}).get("shares", [])
    ents = [e for e in ents if e.get("val")]
    if not ents: return None
    e = max(ents, key=lambda x: x.get("end", ""))
    return float(e["val"])

def build_table_from_facts(facts, max_years=15):
    tbl, lineage, quality = {}, {}, []
    for c in CONCEPTS:
        kind, tags = TAGMAP[c]
        series, src = annual_series(facts, tags, kind)
        tbl[c] = series
        if series:
            tags_used = sorted(set(src.values()))
            lineage[c] = {"tags": tags_used, "years": [min(series), max(series)], "n": len(series)}
    anchor = sorted(tbl.get("revenue", {}).keys())
    if not anchor:
        raise SystemExit("EDGAR 未取到收入年度序列——可能为 IFRS 外国发行人(20-F)或银行保险，改用 --input 手工模式")
    years = anchor[-max_years:]
    # 数据质量检查
    for c in ["operating_income", "dna", "capex", "total_liabilities", "equity"]:
        miss = [y for y in years if y not in tbl.get(c, {})]
        if miss: quality.append("概念 %s 缺失年份 %s" % (c, miss))
    revs = [tbl["revenue"].get(y) for y in years]
    for i in range(1, len(revs)):
        if revs[i] and revs[i-1] and abs(revs[i]/revs[i-1]-1) > 0.4:
            quality.append("收入 %d→%d 变动超40%%：疑似口径切换/重述，请核对" % (years[i-1], years[i]))
    if len(years) < 7:
        quality.append("年度覆盖仅 %d 年（<7）：周期均值可靠性不足" % len(years))
    return tbl, years, lineage, quality

def build_table_from_manual(doc, max_years=15):
    ann = doc.get("annual", {})
    tbl = {c: {} for c in CONCEPTS}
    for ystr, row in ann.items():
        y = int(ystr)
        for c, v in row.items():
            if c in tbl and v is not None:
                tbl[c][y] = float(v)
    years = sorted(tbl["revenue"].keys())[-max_years:]
    if not years: raise SystemExit("手工数据缺少 revenue 年度序列")
    lineage = {c: {"tags": ["manual"], "years": [min(s), max(s)], "n": len(s)}
               for c, s in tbl.items() if s}
    quality = [] if len(years) >= 7 else ["年度覆盖仅 %d 年（<7）：周期均值可靠性不足" % len(years)]
    return tbl, years, lineage, quality

# ---------------------------------------------------------------- 预处理 (全 A 档)
def series_list(tbl, c, years):
    return [tbl.get(c, {}).get(y) for y in years]

def preprocess(tbl, years, A):
    g = lambda c, y: tbl.get(c, {}).get(y)
    rev = {y: g("revenue", y) for y in years}
    notes, pre = [], {}

    # 逐年利润率 → 周期均值 / 中位 / 趋势
    m_pairs = [(y, g("operating_income", y) / rev[y]) for y in years
               if g("operating_income", y) is not None and rev.get(y)]
    margins = {y: m for y, m in m_pairs}
    m_vals = [m for _, m in m_pairs]
    avg_margin = A["avg_margin"] if A["avg_margin"] is not None else mean(m_vals)
    med_margin = statistics.median(m_vals) if m_vals else None
    slope, r2 = lin_trend(m_vals)
    if abs(slope) > 0.004 and r2 > 0.5:
        notes.append("利润率存在显著趋势(%.2fpp/年, R²=%.2f)：书Ch5——仅当有结构性经济解释时改用近3年，否则保持周期均值" % (slope*100, r2))

    # 税率: 近3年优先
    t_pairs = [(y, clamp(g("tax_expense", y) / g("pretax_income", y), 0, 0.45)) for y in years
               if g("tax_expense", y) is not None and (g("pretax_income", y) or 0) > 0]
    t_all = [t for _, t in t_pairs]
    t_recent = [t for y, t in t_pairs if y >= years[-1] - 2]
    tax = A["tax_rate"] if A["tax_rate"] is not None else (mean(t_recent) if len(t_recent) >= 2 else mean(t_all))
    if tax is None: tax = 0.25; notes.append("税率数据缺失：采用 25% 通用假设")
    if t_all and t_recent and abs(mean(t_recent) - mean(t_all)) > 0.05:
        notes.append("近3年税率与长期均值差>5pp：疑似税制变化，已按近3年（书Ch5）")

    # 资本密度 κ: 优先 PP&E gross
    use_gross = sum(1 for y in years if g("ppe_gross", y)) >= len(years) * 0.6
    ppe_c = "ppe_gross" if use_gross else "ppe_net"
    k_vals = [g(ppe_c, y) / rev[y] for y in years if g(ppe_c, y) and rev.get(y)]
    kappa = A["capital_intensity"] if A["capital_intensity"] is not None else mean(k_vals)
    if kappa is None: kappa = 0.3; notes.append("资本密度缺失：采用 0.30 通用假设")

    # 维护性 CapEx 与折旧修正
    maint = {}
    ys = sorted([y for y in years if g("capex", y) is not None and rev.get(y)])
    for i, y in enumerate(ys):
        if i == 0: continue
        drev = max(0.0, (rev[y] or 0) - (rev[ys[i-1]] or 0))
        maint[y] = clamp(g("capex", y) - drev * kappa, 0.0, g("capex", y))
    avg_maint = mean(list(maint.values()))
    dna_vals = [g("dna", y) for y in years if g("dna", y) is not None]
    avg_dna = mean(dna_vals)
    if avg_dna is None:
        dep_adj = 0.0; notes.append("D&A 缺失：折旧修正记 0（保守），建议手工核 10-K 现金流量表")
    elif avg_maint is None:
        dep_adj = 0.0; notes.append("CapEx 缺失：折旧修正记 0")
    else:
        dep_adj = avg_dna - avg_maint

    # NWC 率
    nwc_vals = [((g("receivables", y) or 0) + (g("inventory", y) or 0) - (g("payables", y) or 0)) / rev[y]
                for y in years if rev.get(y) and (g("receivables", y) is not None or g("inventory", y) is not None)]
    nwc = A["nwc_ratio"] if A["nwc_ratio"] is not None else (mean(nwc_vals) if nwc_vals else 0.05)

    # 分配比例 C (近5年, 仅正利润年)
    dist = {y: (g("dividends_paid", y) or 0) + (g("buybacks", y) or 0) - (g("stock_issued", y) or 0)
            for y in years}
    c_pairs = [(dist[y] / g("net_income", y)) for y in years[-5:]
               if (g("net_income", y) or 0) > 0]
    dist_ratio = clamp(mean(c_pairs), 0.0, 1.2) if c_pairs else 0.5
    issued3 = sum((g("stock_issued", y) or 0) for y in years[-3:])
    ret3 = sum((g("dividends_paid", y) or 0) + (g("buybacks", y) or 0) for y in years[-3:])
    issue_flag = issued3 > ret3 and issued3 > 0

    # 增速三口径
    def _cagr(n):
        if len(years) < n + 1: return None
        return cagr(rev.get(years[-1-n]), rev.get(years[-1]), n)
    c10, c7, c5 = _cagr(10), _cagr(7), _cagr(5)
    cands = [c for c in (c7, c10) if c is not None] or [c for c in (c5,) if c is not None]
    g_auto = clamp(min(cands), 0.0, 0.30) if cands else 0.0
    g_o = A["organic_growth"] if A["organic_growth"] is not None else g_auto
    acq = sum((g("acquisitions", y) or 0) for y in years)
    cap = sum((g("capex", y) or 0) for y in years)
    acq_int = acq / (acq + cap) if (acq + cap) > 0 else 0.0
    if acq_int > 0.30:
        notes.append("并购支出占并购+CapEx 的 %.0f%%：收入增速含并购成分，有机增速需人工扣减（书Ch8同口径原则）" % (acq_int*100))

    # ROIC / ROE 序列
    roic, roe = {}, {}
    for y in years:
        oi, eq = g("operating_income", y), g("equity", y)
        debt = (g("debt_lt", y) or 0) + (g("debt_current", y) or 0)
        cashy = (g("cash", y) or 0) + (g("st_investments", y) or 0)
        ic = (eq or 0) + debt - cashy
        if oi is not None and ic and ic > 0: roic[y] = oi * (1 - tax) / ic
        ni = g("net_income", y)
        if ni is not None and eq and eq > 0: roe[y] = ni / eq

    # 利息覆盖: 滚动3年均 EBIT / 均利息 的最小值
    cov = None
    ebit = [g("operating_income", y) for y in years]
    intr = [g("interest_expense", y) for y in years]
    covs = []
    for i in range(2, len(years)):
        e3 = [x for x in ebit[i-2:i+1] if x is not None]
        i3 = [x for x in intr[i-2:i+1] if x is not None and x > 0]
        if e3 and i3: covs.append(mean(e3) / mean(i3))
    if covs: cov = min(covs)

    # v_realized: (ΔEP̄/R*) ÷ Σ(留存−有机投资), 近8年窗口
    v_real = None
    w = [y for y in years if g("net_income", y) is not None][-8:]
    if len(w) >= 6:
        nop = {y: (g("operating_income", y) or 0) * (1 - tax) for y in w}
        ep0 = mean([nop[y] for y in w[:3]]); ep1 = mean([nop[y] for y in w[-3:]])
        reinv = 0.0
        for i, y in enumerate(w):
            if i == 0: continue
            retained = (g("net_income", y) or 0) - dist.get(y, 0)
            orginv = max(0.0, (rev.get(y) or 0) - (rev.get(w[i-1]) or 0)) * nwc
            reinv += max(0.0, retained - orginv)
        if reinv > 0:
            v_real = ((ep1 - ep0) / A["cost_of_capital"]) / reinv
    vcf = A["vcf"] if A["vcf"] is not None else (clamp(v_real, 0.0, 1.0) if v_real is not None else 1.0)

    pre.update(dict(margins=margins, avg_margin=avg_margin, med_margin=med_margin,
                    margin_trend=(slope, r2), tax=tax, kappa=kappa, kappa_basis=ppe_c,
                    maint=maint, avg_maint=avg_maint, avg_dna=avg_dna, dep_adj=dep_adj,
                    nwc=nwc, dist=dist, dist_ratio=dist_ratio, issue_flag=issue_flag,
                    cagr={"10y": c10, "7y": c7, "5y": c5}, g_organic=g_o, g_auto=g_auto,
                    acq_intensity=acq_int, roic=roic, roe=roe, min_coverage3=cov,
                    v_realized=v_real, vcf=vcf, notes=notes))
    return pre

# ---------------------------------------------------------------- 模型核 (被自检直接调用)
def epv_core(revenue, margin, tax, dep_adj, addback, R, excess_cash, debt, minority, legacy):
    EP = revenue * margin * (1 - tax) + dep_adj + addback
    ent = EP / R if R > 0 else float("nan")
    eq = ent + excess_cash - debt - minority - legacy
    return {"EP": EP, "ent": ent, "eq": eq}

def ret_core(M, EP, rev, C, g_o, g_m, nwc, vcf, Rstar, half_life):
    cash_r = C * EP / M
    org_r = g_o + g_m
    retained = (1 - C) * EP
    orginv = rev * g_o * nwc
    active = max(0.0, retained - orginv)
    act_r = active * vcf / M
    total = cash_r + org_r + act_r
    fade = 0.72 / half_life if half_life > 0 else 0.0
    net = total - fade
    return {"cash_r": cash_r, "org_r": org_r, "act_r": act_r, "total": total,
            "fade": fade, "net": net, "margin": net - Rstar, "vm": total / Rstar,
            "retained": retained, "orginv": orginv, "active": active}

# ---------------------------------------------------------------- 模型层
def model_epv(tbl, years, pre, A):
    y = years[-1]; g = lambda c: tbl.get(c, {}).get(y)
    rev = g("revenue") or 0
    cash_all = (g("cash") or 0) + (g("st_investments") or 0)
    excess = cash_all - A["operating_cash_pct"] * rev
    debt = (g("debt_lt") or 0) + (g("debt_current") or 0)
    mino = g("minority") or 0
    core = epv_core(rev, pre["avg_margin"] or 0, pre["tax"], pre["dep_adj"],
                    A["growth_opex_addback"], A["cost_of_capital"], excess, debt, mino,
                    A["legacy_liabilities"])
    # R* 敏感性 (±1pp)
    sens = {}
    for dr in (-0.01, +0.01):
        s = epv_core(rev, pre["avg_margin"] or 0, pre["tax"], pre["dep_adj"],
                     A["growth_opex_addback"], A["cost_of_capital"] + dr, excess, debt, mino,
                     A["legacy_liabilities"])
        sens["%+d" % int(dr*100)] = s["eq"]
    core.update(dict(year=y, revenue=rev, excess_cash=excess, debt=debt, minority=mino, r_sens=sens))
    return core

def model_av(tbl, years, pre, A):
    y = years[-1]; g = lambda c: tbl.get(c, {}).get(y) or 0.0
    rows = []
    def add(name, book, repl, note): rows.append({"item": name, "book": book, "repl": repl, "note": note})
    cash = g("cash"); sti = g("st_investments")
    add("现金及等价物", cash, cash, "×1.0")
    if sti: add("短期投资", sti, sti, "按市价")
    rec, allw = g("receivables"), g("allowance")
    add("应收账款", rec, rec + allw, "加回坏账准备 %s" % (fmt_m(allw) if allw else "（无标签, ×1.0 并旗标）"))
    inv, lifo = g("inventory"), g("lifo_reserve")
    add("存货", inv, inv + lifo, "加回 LIFO 储备 %s" % (fmt_m(lifo) if lifo else "（无）"))
    ppe = g("ppe_net")
    add("PP&E（净）", ppe, ppe * A["ppe_factor"], "系数 %.2f ★（土地/棕地为C档人工）" % A["ppe_factor"])
    gw = g("goodwill"); add("商誉", gw, 0.0, "清零（Ch4）")
    itg = g("intangibles"); add("账面无形资产", itg, 0.0, "清零, 下方重建替代")
    rd_avg = mean([tbl.get("rd", {}).get(t) for t in years if tbl.get("rd", {}).get(t)]) or 0.0
    sg_avg = mean([tbl.get("sgna", {}).get(t) for t in years if tbl.get("sgna", {}).get(t)]) or 0.0
    rev = g("revenue")
    add("无形①产品组合(重建)", 0.0, A["rd_years"] * rd_avg, "%.0f年 × 平均R&D ★" % A["rd_years"])
    add("无形②客户基础(重建)", 0.0, A["customer_pct_rev"] * rev, "收入×%.0f%% ★(C档: 默认不计)" % (A["customer_pct_rev"]*100))
    add("无形③员工队伍(重建)", 0.0, A["workforce_value"], "手工项 ★")
    add("无形④组织基础(重建)", 0.0, A["sgna_years"] * sg_avg, "%.1f年 × 平均SG&A ★(书1-3)" % A["sgna_years"])
    listed = cash + sti + rec + inv + ppe + gw + itg
    other = max(0.0, g("total_assets") - listed)
    add("其他资产(残差, 账面)", other, other, "保守: 照账面")
    assets_repl = sum(r["repl"] for r in rows)
    liab = g("total_liabilities") + A["legacy_liabilities"]
    debt = g("debt_lt") + g("debt_current")
    av_eq = assets_repl - liab
    av_ent = av_eq + debt - (cash + sti)
    return {"year": y, "rows": rows, "assets_repl": assets_repl, "liabilities": liab,
            "eq": av_eq, "ent": av_ent, "negative_eq": av_eq <= 0}

def classify_case(epv_ent, av_ent):
    if av_ent is None or av_ent <= 0:
        return {"case": "A", "ratio": None,
                "text": "净重置价值≤0（GM 警示型）：负资产基础支撑不了竞争下的长期盈利，除非资本结构重组"}
    r = epv_ent / av_ent
    case = "C" if r > 1.25 else ("A" if r < 0.75 else "B")
    return {"case": case, "ratio": r, "text": {
        "A": "AV>EPV：资产在、回报不在——价值陷阱警区，催化剂成为必要条件（Ch3/Ch9）",
        "B": "AV≈EPV（±25%）：竞争市场均衡，两估值三角验证，增长不付钱（Ch3）",
        "C": "EPV>AV：超额盈利存续本身即护城河证据——特许经营候选，转回报法（Ch3→Ch8）"}[case]}

def franchise_diag(pre, A, years):
    R = A["cost_of_capital"]
    rv = [v for _, v in sorted(pre["roic"].items())][-10:]
    t1 = (mean(rv) - R >= 0.02) if rv else False
    t2 = (sum(1 for v in rv if v > R) / len(rv) >= 0.70) if rv else False
    mv = [pre["margins"][y] for y in sorted(pre["margins"])][-10:]
    cv = (statistics.pstdev(mv) / abs(mean(mv))) if mv and mean(mv) else None
    t3 = cv is not None and cv < 0.35
    auto = t1 and t2 and t3
    if A["franchise"] == "yes": final, how = True, "人工裁定=yes（C档已确认）"
    elif A["franchise"] == "no": final, how = False, "人工裁定=no"
    else: final, how = auto, "auto: 定量三测" + ("全过（候选, 仍需C档定性确认）" if auto else "未全过")
    return {"roic_avg10": mean(rv), "roic_gt_R_share": (sum(1 for v in rv if v > R)/len(rv)) if rv else None,
            "margin_cv": cv, "t1": t1, "t2": t2, "t3": t3, "auto_pass": auto,
            "final": final, "how": how,
            "todo_qualitative": ["市场份额稳定性（逐子市场）", "进入失败史/无人敢试史",
                                 "粘性机制归类：习惯/搜索成本/转换成本", "规模经济×粘性是否作用于代际更替",
                                 "私有市场交易价交叉验证"]}

def model_return(pre, EP, rev_now, mkt_cap, A):
    core = ret_core(mkt_cap, EP, rev_now, pre["dist_ratio"], pre["g_organic"],
                    A["margin_uplift"], pre["nwc"], pre["vcf"], A["cost_of_capital"],
                    A["fade_half_life"])
    core["too_tough_growth"] = pre["g_organic"] > 0.15
    # v 敏感性: v=0 与 v=1.6("好但非伟大")
    core["v_sens"] = {v: ret_core(mkt_cap, EP, rev_now, pre["dist_ratio"], pre["g_organic"],
                                  A["margin_uplift"], pre["nwc"], v, A["cost_of_capital"],
                                  A["fade_half_life"])["margin"] for v in (0.0, 1.6)}
    return core

def risk_checks(tbl, years, pre, EP_eq, mkt_cap, sic):
    y = years[-1]; g = lambda c: tbl.get(c, {}).get(y) or 0.0
    flags = []
    fin = sic and str(sic).isdigit() and 6000 <= int(sic) <= 6999
    if fin: flags.append(("FIN", "金融业(SIC %s)：三模型不适用金融企业报表 → 太难堆" % sic))
    pe = (mkt_cap / EP_eq) if EP_eq and EP_eq > 0 else None
    pb = (mkt_cap / g("equity")) if g("equity") > 0 else None
    bubble = (pe is not None and pe > 30) or (pb is not None and pb > 8)
    if bubble: flags.append(("BUBBLE", "泡沫旗: P/可持续E=%s, P/B=%s（阈值30/8, Ch10）→ 太难堆"
                             % (fmt_x(pe), fmt_x(pb))))
    if pre["min_coverage3"] is not None and pre["min_coverage3"] < 2:
        flags.append(("LEVERAGE", "杠杆三坏年测试未过: 最差滚动3年 EBIT/利息=%.1f (<2, Ch10)" % pre["min_coverage3"]))
    if pre["issue_flag"]:
        flags.append(("ISSUE", "近3年股权净融资为正：稳健的负面信号（Ch9）"))
    return {"fin": fin, "bubble": bubble, "pe": pe, "pb": pb, "flags": flags}

# ---------------------------------------------------------------- 判定引擎
VERDICT_LABEL = {
    "BUY_CANDIDATE": ("买入候选", "good"), "CONDITIONAL_BUY": ("条件性买入（需催化剂）", "mid"),
    "WATCH": ("观察名单", "mid"), "AVOID": ("回避", "bad"),
    "VALUE_TRAP_WARNING": ("价值陷阱警告", "bad"), "TOO_TOUGH": ("太难堆", "tough"),
}

def decide(case, fr, epv, av, ret, risk, mkt_cap, pre, A, quality, years):
    conds, todos, sens = [], [], []
    # C 档未人工覆盖项 → 待办
    if A["franchise"] == "auto": todos.append("护城河定性确认（份额稳定性/进入失败史/粘性机制）——当前为程序三测候选")
    todos += ["fade 半衰期人工校准（当前 %.0f 年 ★默认）" % A["fade_half_life"] if A["fade_half_life"] == DEFAULT_ASSUMPTIONS["fade_half_life"] else None,
              "遗留负债核查（养老金缺口/环境/诉讼，当前记 0）" if not A["legacy_liabilities"] else None,
              "无形②客户基础重建口径（当前不计）——书给行业参照：服装≈0.65/元销售、代理佣金5–15%" if not A["customer_pct_rev"] else None,
              "私有市场价值交叉验证（同类整体交易价）", "管理层四维评估（运营效率为首，Ch9）"]
    todos = [t for t in todos if t]

    hard = [f for f in risk["flags"] if f[0] in ("FIN", "BUBBLE")]
    if hard or len(years) < 7:
        code = "TOO_TOUGH"
        why = "；".join(f[1] for f in hard) or "年度覆盖<7年，周期均值不可靠"
        headline = "路由：太难堆。%s。书的立场：这不是能力欠费，是纪律（Ch10 击球区）。" % why
        route = "NONE"
    else:
        # 路由: 人工裁定(C档)压过机械分类——franchise=yes 即走回报法, =no 即走三角验证,
        # auto 时要求 Case C 与定量三测同时成立（书Ch3: EPV>AV 是护城河的证据而非定义）
        if A["franchise"] == "yes":   franchise_route = True
        elif A["franchise"] == "no":  franchise_route = False
        else:                          franchise_route = (case["case"] == "C" and fr["final"])
        route = "RETURN_METHOD" if franchise_route else "TRIANGULATION"
        if route == "RETURN_METHOD" and ret["too_tough_growth"]:
            code = "TOO_TOUGH"
            headline = "有机增速 %.1f%% > 15%%：超高速成长股的估值属投机而非投资（Ch8 边界）→ 太难堆。" % (pre["g_organic"]*100)
        elif route == "RETURN_METHOD":
            m = ret["margin"]
            conds.append("前提：护城河成立（%s）且半衰期≥%.0f年 —— 两者均为人工判断责任" % (fr["how"], A["fade_half_life"]))
            if m >= 0.015:
                code = "BUY_CANDIDATE"
                headline = ("回报法：现金 %.1f%% + 有机 %.1f%% + 主动 %.1f%% = %.1f%%，扣 fade %.1f%% 后 %.1f%%，"
                            "超资本成本 %.1f pp（恒等式 V/M≈%.2f，且真实边际只会更大）。") % (
                    ret["cash_r"]*100, ret["org_r"]*100, ret["act_r"]*100, ret["total"]*100,
                    ret["fade"]*100, ret["net"]*100, m*100, ret["vm"])
            elif m >= 0:
                code = "WATCH"
                headline = "回报法边际仅 %.1f pp：名义达标但盖不住参数误差——观察，等价格或更硬的半衰期证据。" % (m*100)
            else:
                code = "AVOID"
                headline = ("回报法：净回报 %.1f%% < 资本成本 %.1f%%（隐含 V/M %.2f）——伟大≠便宜，"
                            "Intel 三时点同型结论。") % (ret["net"]*100, A["cost_of_capital"]*100, ret["vm"])
            sens.append("v 敏感性：v=0 时边际 %+.1f pp；v=1.6 时 %+.1f pp" % (ret["v_sens"][0.0]*100, ret["v_sens"][1.6]*100))
        else:
            bases = [x for x in (av["eq"], epv["eq"]) if x and x > 0]
            base = min(bases) if bases else None
            d = (mkt_cap / base) if base else None
            if case["case"] == "A":
                conds.append("Case A：没有近期更换管理层的催化剂（收购/行动主义/破产重组）就不买——催化剂是必要条件（Ch9）")
                todos.insert(0, "催化剂排查：管理层变动/要约/激进股东（C档）")
                if d is not None and d <= 0.67:
                    code = "CONDITIONAL_BUY"
                    headline = "价格为保守价值的 %.0f%%（≤⅔ 边际达标），但处 Case A 价值陷阱警区：结论以催化剂为条件。" % (d*100)
                else:
                    code = "VALUE_TRAP_WARNING"
                    headline = "Case A（AV>EPV）且折价不足：坏管理层毁值的速度可以磨光任何边际——回避（Ch3/Ch9）。"
            else:
                if d is None:
                    code, headline = "TOO_TOUGH", "AV 与 EPV 均无法给出正的权益价值：估值不可靠 → 太难堆。"
                elif d <= 0.67:
                    code = "BUY_CANDIDATE"
                    headline = "三角验证：市值为 min(AV, EPV) 的 %.0f%%，达格雷厄姆⅓边际；AV/EPV 相互印证（Case B）。" % (d*100)
                elif d <= 1.0:
                    code = "WATCH"
                    headline = "折价 %.0f%% 不足⅓边际——进观察名单，等更好的价格（Ch1 主配方第3步）。" % ((1-d)*100)
                else:
                    code = "AVOID"
                    headline = "市值高于保守价值（%.0f%%）：市场在为增长付费，而 Case %s 中增长不值钱。" % (d*100, case["case"])
            if d is not None:
                sens.append("折价基准=min(AV权益, EPV权益)=%s；对 R*±1pp，EPV权益变动 %s / %s" % (
                    fmt_m(base), fmt_m(epv["r_sens"]["-1"]), fmt_m(epv["r_sens"]["+1"])))
    for f in risk["flags"]:
        if f[0] in ("LEVERAGE", "ISSUE"): conds.append("风险旗：" + f[1])
    label, tone = VERDICT_LABEL[code]
    return {"code": code, "label": label, "tone": tone, "route": route,
            "headline": headline, "conditions": conds, "todos": todos, "sensitivity": sens}

# ---------------------------------------------------------------- 格式化
def fmt_m(x):
    if x is None or (isinstance(x, float) and math.isnan(x)): return "—"
    return "{:,.0f}".format(x / 1e6)
def fmt_p(x, d=1):
    return "—" if x is None else ("{:." + str(d) + "f}%").format(x * 100)
def fmt_x(x):
    return "—" if x is None else "{:.1f}×".format(x)

# ---------------------------------------------------------------- 报告模板（设计系统与既有构件一致）
REPORT_TMPL = """<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{NAME}} · 称重机估值报告</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
:root{--parchment:#F3EAD3;--card:#F8F1DE;--ink:#2C2620;--ink-soft:#5A4F3F;--teal:#1E6E68;--teal-deep:#14514C;
--teal-wash:#DCE8E2;--terra:#B5541F;--terra-deep:#8F3E12;--terra-wash:#F0DCC9;--line:#D6C6A2;--line-soft:#E3D7B8;
--gold:#8A6D1F;--mono:"SFMono-Regular",Consolas,monospace}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--parchment);color:var(--ink);font-family:"Noto Serif SC",serif;font-size:15px;line-height:1.8;padding:34px clamp(16px,4vw,56px) 70px}
.wrap{max-width:960px;margin:0 auto}
h1{font-size:clamp(24px,3.5vw,34px);font-weight:900}
h1 small{display:block;font-size:13px;color:var(--ink-soft);font-weight:400;margin-top:6px}
h2{font-size:20px;font-weight:900;color:var(--teal-deep);margin:38px 0 10px;padding-left:12px;border-left:4px solid var(--terra)}
p{margin:8px 0;text-align:justify}.note{font-size:12.5px;color:var(--ink-soft)}
.meta{font-size:13px;color:var(--ink-soft);margin:8px 0 14px}
.banner{padding:16px 20px;border-radius:4px;margin:16px 0;font-size:15px;border:1px solid}
.banner b{font-size:17px;display:block;margin-bottom:6px}
.good{background:var(--teal-wash);border-color:#B8D2C8;color:var(--teal-deep)}
.mid{background:#EFE7CE;border-color:var(--line);color:var(--gold)}
.bad{background:var(--terra-wash);border-color:#E0BC9C;color:var(--terra-deep)}
.tough{background:#E9E2D0;border-color:var(--line);color:var(--ink-soft)}
.strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}
.ro{background:var(--card);border:1px solid var(--line-soft);border-radius:3px;padding:10px 12px;text-align:center}
.ro .k{font-size:11px;color:var(--ink-soft);display:block}.ro .v{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--teal-deep)}
.ro .v.bad{color:var(--terra-deep)}
table{width:100%;border-collapse:collapse;font-size:13px;background:var(--card);border:1px solid var(--line);margin:12px 0}
th{background:var(--teal-deep);color:#F5EFDD;padding:8px 10px;text-align:left;font-size:12px;white-space:nowrap}
td{padding:7px 10px;border-top:1px solid var(--line-soft);vertical-align:top}
td.num,th.num{text-align:right;font-family:var(--mono);font-size:12px;white-space:nowrap}
tr:nth-child(even) td{background:rgba(255,255,255,.35)}
tfoot td{border-top:2px solid var(--line);font-weight:700;background:#EBDFC0}
.badge{display:inline-block;font-size:10px;font-weight:700;padding:1px 7px;border-radius:2px;margin-right:6px;letter-spacing:.08em}
.bA{background:var(--teal);color:#F5EFDD}.bB{background:var(--gold);color:#F5EFDD}.bC{background:var(--terra);color:#F5EFDD}
ul.plain{list-style:none;margin:8px 0}
ul.plain li{padding:5px 0 5px 18px;position:relative;border-bottom:1px dashed var(--line-soft);font-size:13.5px}
ul.plain li:before{content:"▸";color:var(--terra);position:absolute;left:0}
.lab{background:var(--card);border:1px solid var(--line);border-radius:4px;padding:18px 20px;margin:18px 0;position:relative}
.lab:before{content:"交互推演 · 改假设即时重算";position:absolute;top:-9px;left:14px;background:var(--terra);color:#F8F1DE;font-size:10px;letter-spacing:.2em;padding:2px 9px;border-radius:2px;font-weight:700}
.ctrl{display:grid;grid-template-columns:150px 1fr 84px;gap:10px;align-items:center;margin:8px 0;font-size:13px}
.ctrl label{color:var(--ink-soft);font-weight:600}.ctrl output{font-family:var(--mono);font-size:12.5px;color:var(--terra-deep);font-weight:700;text-align:right}
input[type=range]{-webkit-appearance:none;appearance:none;height:4px;background:var(--line);border-radius:2px}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--teal);border:2px solid var(--card);box-shadow:0 0 0 1px var(--teal-deep);cursor:pointer}
input[type=number]{font-family:var(--mono);font-size:12.5px;padding:5px 7px;width:100%;border:1px solid var(--line);border-radius:2px;background:#FDFAF0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.verdict{font-size:13.5px;margin-top:10px;padding:9px 13px;border-radius:3px;font-weight:600;border:1px solid}
footer{border-top:3px double var(--line);margin-top:44px;padding-top:16px;font-size:12px;color:var(--ink-soft);line-height:1.9}
@media(max-width:760px){.g2{grid-template-columns:1fr}.ctrl{grid-template-columns:110px 1fr 66px}}
</style></head><body><div class="wrap">
<h1>{{NAME}} <small>{{TICKER}} · 称重机 The Weighing Machine v{{VER}} · 生成于 {{DATE}} · 数据 {{Y0}}–{{Y1}}（{{NY}} 年）· 单位: 百万{{CCY}}</small></h1>
<div class="meta">价格 {{PRICE}} × 股本 {{SHARES}} = 市值 {{MCAP}} ｜ 判定路由: {{ROUTE}} ｜ 依据《Value Investing, 2e》· 全部中间量见文末内嵌 JSON</div>
<div class="banner {{TONE}}"><b>{{VLABEL}}</b>{{HEADLINE}}{{CONDS}}</div>
<div class="strip">
<div class="ro"><span class="k">EPV 权益</span><span class="v">{{EPV_EQ}}</span></div>
<div class="ro"><span class="k">AV 权益（重置）</span><span class="v">{{AV_EQ}}</span></div>
<div class="ro"><span class="k">市值 / min(AV,EPV)</span><span class="v {{DTONE}}">{{DISC}}</span></div>
<div class="ro"><span class="k">Case 分类</span><span class="v">{{CASE}}</span></div>
<div class="ro"><span class="k">回报法净回报</span><span class="v {{RTONE}}">{{RNET}}</span></div>
<div class="ro"><span class="k">对照资本成本 R*</span><span class="v">{{RSTAR}}</span></div>
</div>

<h2>一、预处理：从报表到模型输入</h2>
<p class="note">档位标注：<span class="badge bA">A 全自动</span>报表直接推导 <span class="badge bB">B 半自动</span>程序给证据+默认，可被假设文件覆盖 <span class="badge bC">C 纯人工</span>程序只标注不猜测。带 ★ 为本次运行使用了默认值（未被覆盖）。</p>
<table><thead><tr><th>参数</th><th class="num">取值</th><th>档位/来源</th></tr></thead><tbody>{{PRE_ROWS}}</tbody></table>
{{PRE_NOTES}}

<h2>二、盈利能力价值 EPV（Ch5）</h2>
<table><thead><tr><th>步骤</th><th class="num">数值</th><th>说明</th></tr></thead><tbody>{{EPV_ROWS}}</tbody></table>

<h2>三、资产价值 AV：重置成本逐行表（Ch4）</h2>
<table><thead><tr><th>项目</th><th class="num">账面</th><th class="num">重置</th><th>规则</th></tr></thead>
<tbody>{{AV_ROWS}}</tbody>
<tfoot><tr><td>重置资产合计 − 负债 {{AV_LIAB}} = <b>AV 权益</b></td><td class="num"></td><td class="num">{{AV_EQ}}</td><td>企业口径 {{AV_ENT}}</td></tr></tfoot></table>

<h2>四、Case 分类与特许经营诊断（Ch3 → Ch7）</h2>
<p><b>EPV企业/AV企业 = {{CASE_RATIO}}</b> → <b>Case {{CASE}}</b>：{{CASE_TEXT}}</p>
<table><thead><tr><th>特许三测（定量后半场）</th><th class="num">数值</th><th class="num">阈值</th><th>结果</th></tr></thead><tbody>{{FR_ROWS}}</tbody></table>
<p class="note">裁定：{{FR_HOW}}。定性前半场（C 档人工）见文末待办清单——书 Ch7：清晰很少始于复杂计算。</p>

<h2>五、回报法工作台（Ch8）——已预填本标的实际参数</h2>
<div class="lab"><div class="g2"><div>
<div class="ctrl" style="grid-template-columns:150px 1fr"><label>市值 M（百万）</label><input type="number" id="wM" value="{{W_M}}" step="10"></div>
<div class="ctrl" style="grid-template-columns:150px 1fr"><label>可持续盈利 EP</label><input type="number" id="wE" value="{{W_E}}" step="5"></div>
<div class="ctrl" style="grid-template-columns:150px 1fr"><label>可持续收入</label><input type="number" id="wRev" value="{{W_REV}}" step="10"></div>
<div class="ctrl"><label>分配比例 C</label><input type="range" id="wC" min="0" max="120" step="1" value="{{W_C}}"><output id="wCo"></output></div>
<div class="ctrl"><label>有机增速</label><input type="range" id="wGo" min="0" max="16" step="0.25" value="{{W_GO}}"><output id="wGoo"></output></div>
</div><div>
<div class="ctrl"><label>利润率爬升</label><input type="range" id="wGm" min="0" max="2" step="0.25" value="{{W_GM}}"><output id="wGmo"></output></div>
<div class="ctrl"><label>NWC 率</label><input type="range" id="wN" min="0" max="35" step="1" value="{{W_N}}"><output id="wNo"></output></div>
<div class="ctrl"><label>价值创造系数 v</label><input type="range" id="wV" min="0" max="5" step="0.1" value="{{W_V}}"><output id="wVo"></output></div>
<div class="ctrl"><label>资本成本 R*</label><input type="range" id="wR" min="5" max="14" step="0.5" value="{{W_R}}"><output id="wRo"></output></div>
<div class="ctrl"><label>特许半衰期</label><input type="range" id="wH" min="10" max="100" step="5" value="{{W_H}}"><output id="wHo"></output></div>
</div></div>
<div class="strip">
<div class="ro"><span class="k">① 现金回报</span><span class="v" id="oc">—</span></div>
<div class="ro"><span class="k">② 有机回报</span><span class="v" id="oo">—</span></div>
<div class="ro"><span class="k">③ 主动回报</span><span class="v" id="oa">—</span></div>
<div class="ro"><span class="k">合计 r_b</span><span class="v" id="ot">—</span></div>
<div class="ro"><span class="k">fade</span><span class="v bad" id="of">—</span></div>
<div class="ro"><span class="k">净回报 / 边际</span><span class="v" id="on">—</span></div>
<div class="ro"><span class="k">隐含 V/M</span><span class="v" id="ovm">—</span></div>
</div><div class="verdict mid" id="ov">—</div>
<p class="note">v_realized（近8年再投资的实现系数，程序证据）= {{V_REAL}}；恒等式 V/M = R/R*，基准边际为正 ⇒ 真实边际更大（Ch8 附录保守性证明）。{{RET_NOTE}}</p></div>

<h2>六、风险检查（Ch9/Ch10）</h2>
{{RISK_LIST}}

<h2>七、C 档人工待办（结论生效的前提）</h2>
<ul class="plain">{{TODO_LIST}}</ul>
{{SENS_LIST}}

<h2>八、数据血缘与质量</h2>
<table><thead><tr><th>概念</th><th>命中标签</th><th class="num">年份覆盖</th></tr></thead><tbody>{{LINEAGE_ROWS}}</tbody></table>
{{QUALITY_LIST}}

<footer>称重机 weigher.py v{{VER}} · 依据 Greenwald et al.《Value Investing, 2e》(Wiley 2021) 各章模型 · 单文件零构建报告 · 本工具是研究流程的算术与记账环节，不构成投资建议<br>假设文件生效值: {{ASSUMP_LINE}}</footer>
</div>
<script type="application/json" id="resultjson">{{RESULT_JSON}}</script>
<script>
(function(){"use strict";
var $=function(i){return document.getElementById(i)};
function pc(x,d){return (x*100).toFixed(d===undefined?1:d)+"%"}
function calc(){
 var M=+$("wM").value||1,E=+$("wE").value||0,rev=+$("wRev").value||0,
 C=+$("wC").value/100,go=+$("wGo").value/100,gm=+$("wGm").value/100,
 n=+$("wN").value/100,v=+$("wV").value,R=+$("wR").value/100,H=+$("wH").value;
 $("wCo").textContent=(C*100).toFixed(0)+"%";$("wGoo").textContent=pc(go,2);
 $("wGmo").textContent=pc(gm,2);$("wNo").textContent=(n*100).toFixed(0)+"%";
 $("wVo").textContent=v.toFixed(1);$("wRo").textContent=pc(R,1);$("wHo").textContent=H+" 年";
 var cash=C*E/M,org=go+gm,ret=(1-C)*E,oi=rev*go*n,act=Math.max(0,ret-oi)*v/M,
 tot=cash+org+act,f=0.72/H,net=tot-f,m=net-R,vm=tot/R;
 $("oc").textContent=pc(cash);$("oo").textContent=pc(org);$("oa").textContent=pc(act);
 $("ot").textContent=pc(tot);$("of").textContent="-"+pc(f);
 $("on").textContent=pc(net)+" / "+(m>=0?"+":"")+pc(m);
 $("on").className="v"+(m<0?" bad":"");$("ovm").textContent=vm.toFixed(2);
 $("ovm").className="v"+(vm<1?" bad":"");
 var o=$("ov");
 if(m>=0.015){o.className="verdict good";o.textContent="边际 +"+pc(m)+"：达标（前提：护城河与半衰期为人工确认项）。"}
 else if(m>=0){o.className="verdict mid";o.textContent="边际 "+pc(m)+"：名义达标但盖不住参数误差——观察。"}
 else{o.className="verdict bad";o.textContent="净回报低于资本成本 "+pc(m)+"：按当前价买入是在送出安全边际。"}}
["wM","wE","wRev","wC","wGo","wGm","wN","wV","wR","wH"].forEach(function(i){$(i).addEventListener("input",calc)});
calc();})();
</script></body></html>"""

def fill(tmpl, mapping):
    for k, v in mapping.items():
        tmpl = tmpl.replace("{{" + k + "}}", str(v))
    return tmpl

# ---------------------------------------------------------------- 报告渲染
def render_report(res):
    pre, epv, av, case, fr, ret, risk, v = (res["pre"], res["models"]["epv"], res["models"]["av"],
        res["models"]["case"], res["models"]["franchise"], res["models"]["ret"], res["risk"], res["verdict"])
    A, meta, mkt = res["assumptions_effective"], res["meta"], res["market"]
    star = lambda key: " ★" if res["assumption_src"].get(key) == "default" else ""
    def badge(b): return '<span class="badge b%s">%s</span>' % (b, b)
    pr = []
    def prow(name, val, b, src): pr.append("<tr><td>%s</td><td class='num'>%s</td><td>%s%s</td></tr>" % (name, val, badge(b), src))
    prow("周期平均营业利润率（%d年）" % len(pre["margins"]), fmt_p(pre["avg_margin"]), "A",
         "中位 %s，趋势 %.2fpp/年" % (fmt_p(pre["med_margin"]), pre["margin_trend"][0]*100) + ("" if A["avg_margin"] is None else " · 已覆盖"))
    prow("有效税率", fmt_p(pre["tax"]), "A", "近3年优先" + star("tax_rate"))
    prow("资本密度 κ", fmt_p(pre["kappa"]), "A", "基于 %s" % pre["kappa_basis"] + star("capital_intensity"))
    prow("平均维护性 CapEx / 平均D&A", "%s / %s" % (fmt_m(pre["avg_maint"]), fmt_m(pre["avg_dna"])), "A", "折旧修正 = %s" % fmt_m(pre["dep_adj"]))
    prow("NWC 率 ω", fmt_p(pre["nwc"]), "A", star("nwc_ratio") or "自动")
    prow("分配比例 C（近5年）", fmt_p(pre["dist_ratio"]), "A", "分红+净回购 / 净利")
    prow("收入 CAGR 5/7/10 年", " / ".join(fmt_p(pre["cagr"][k]) for k in ("5y","7y","10y")), "A", "有机增速取保守口径")
    prow("有机增速 g_o（生效）", fmt_p(pre["g_organic"]), "B", ("并购强度 %.0f%%需人工扣减 · " % (pre["acq_intensity"]*100) if pre["acq_intensity"]>0.3 else "") + ("默认=min(CAGR7,CAGR10)" + star("organic_growth")))
    prow("价值创造系数 v（生效）", "%.2f" % pre["vcf"], "B", "v_realized=%s，默认=clamp(v_real,0,1)" % ("%.2f" % pre["v_realized"] if pre["v_realized"] is not None else "—") + star("vcf"))
    prow("资本成本 R*", fmt_p(A["cost_of_capital"]), "B", "定性区间法 7–14%" + star("cost_of_capital"))
    prow("fade 半衰期", "%.0f 年 → %s/年" % (A["fade_half_life"], fmt_p(0.72/A["fade_half_life"])), "C", "书: ≥50年需强证据" + star("fade_half_life"))
    prow("遗留负债 / 客户基础重建", "%s / %s" % (fmt_m(A["legacy_liabilities"]), fmt_m(A["customer_pct_rev"]*(epv["revenue"] or 0))), "C", "程序不猜测" )
    pre_notes = ("<ul class='plain'>" + "".join("<li>%s</li>" % n for n in pre["notes"]) + "</ul>") if pre["notes"] else ""

    er = []
    def erow(a, b, c): er.append("<tr><td>%s</td><td class='num'>%s</td><td>%s</td></tr>" % (a, b, c))
    erow("可持续收入（%d）" % epv["year"], fmt_m(epv["revenue"]), "当期年报")
    erow("× 周期利润率 × (1−税率)", fmt_m(epv["revenue"]*(pre["avg_margin"] or 0)*(1-pre["tax"])), "%s × %s" % (fmt_p(pre["avg_margin"]), fmt_p(1-pre["tax"],0)))
    erow("+ 折旧修正（D&A − 维护CapEx）", fmt_m(pre["dep_adj"]), "Magna 型修正")
    erow("= 盈利能力 EP", fmt_m(epv["EP"]), "不含任何增长")
    erow("÷ R* = 企业 EPV", fmt_m(epv["ent"]), "R*=%s；±1pp → 权益 %s / %s" % (fmt_p(A["cost_of_capital"]), fmt_m(epv["r_sens"]["-1"]), fmt_m(epv["r_sens"]["+1"])))
    erow("+ 超额现金 − 债务 − 少数股东", "%s − %s − %s" % (fmt_m(epv["excess_cash"]), fmt_m(epv["debt"]), fmt_m(epv["minority"])), "经营现金留存 %s×收入" % fmt_p(A["operating_cash_pct"],1))
    erow("= 权益 EPV", "<b>%s</b>" % fmt_m(epv["eq"]), "对照市值 %s（%.0f%%）" % (fmt_m(mkt["cap"]), 100*mkt["cap"]/epv["eq"] if epv["eq"] else 0))

    ar = "".join("<tr><td>%s</td><td class='num'>%s</td><td class='num'>%s</td><td>%s</td></tr>" %
                 (r["item"], fmt_m(r["book"]), fmt_m(r["repl"]), r["note"]) for r in av["rows"])

    frr = []
    def frow(n, val, th, ok): frr.append("<tr><td>%s</td><td class='num'>%s</td><td class='num'>%s</td><td>%s</td></tr>" % (n, val, th, "通过" if ok else "未过"))
    frow("① 10年 ROIC 均值 − R*", fmt_p((fr["roic_avg10"] or 0) - A["cost_of_capital"]) if fr["roic_avg10"] is not None else "—", "≥ 2pp", fr["t1"])
    frow("② ROIC > R* 年份占比", fmt_p(fr["roic_gt_R_share"],0) if fr["roic_gt_R_share"] is not None else "—", "≥ 70%", fr["t2"])
    frow("③ 利润率变异系数 CV", "%.2f" % fr["margin_cv"] if fr["margin_cv"] is not None else "—", "< 0.35", fr["t3"])

    risk_html = ("<ul class='plain'>" + "".join("<li><b>[%s]</b> %s</li>" % f for f in risk["flags"]) + "</ul>") if risk["flags"] else "<p class='note'>无触发：泡沫旗（P/可持续E=%s, P/B=%s）、杠杆三坏年（最差覆盖 %s）、股权融资旗均未触发。</p>" % (fmt_x(risk["pe"]), fmt_x(risk["pb"]), ("%.1f" % pre["min_coverage3"]) if pre["min_coverage3"] is not None else "—")
    todo_html = "".join("<li>%s</li>" % t for t in v["todos"])
    sens_html = ("<ul class='plain'>" + "".join("<li>%s</li>" % s for s in v["sensitivity"]) + "</ul>") if v["sensitivity"] else ""
    lin = "".join("<tr><td>%s</td><td>%s</td><td class='num'>%s–%s（%d）</td></tr>" %
                  (c, ", ".join(d["tags"]), d["years"][0], d["years"][1], d["n"])
                  for c, d in sorted(res["lineage"].items()))
    q_html = ("<ul class='plain'>" + "".join("<li>%s</li>" % q for q in res["data_quality"]) + "</ul>") if res["data_quality"] else "<p class='note'>数据质量清单：无异常。</p>"
    conds = ("<div style='margin-top:8px;font-size:13px'>" + "<br>".join("· " + c for c in v["conditions"]) + "</div>") if v["conditions"] else ""
    ovr = [k for k, s in res["assumption_src"].items() if s == "override"]
    assump_line = ("覆盖项: " + ", ".join(ovr)) if ovr else "全部使用默认（★）"
    bases = [x for x in (av["eq"], epv["eq"]) if x and x > 0]
    disc = (mkt["cap"] / min(bases)) if bases else None

    M6 = lambda x: "%.0f" % (x / 1e6)
    mapping = dict(NAME=meta["name"], TICKER=meta["ticker"], VER=VERSION, DATE=date.today().isoformat(),
        Y0=res["years"][0], Y1=res["years"][-1], NY=len(res["years"]), CCY=meta.get("currency","USD"),
        PRICE=("%.2f" % mkt["price"]) if mkt.get("price") else "—",
        SHARES=fmt_m(mkt["shares"]) + "M" if mkt.get("shares") else "—",
        MCAP=fmt_m(mkt["cap"]), ROUTE={"RETURN_METHOD":"回报法（特许经营）","TRIANGULATION":"AV/EPV 三角验证","NONE":"—"}[v["route"]],
        TONE=v["tone"], VLABEL="%s（%s）" % (v["label"], v["code"]), HEADLINE=v["headline"], CONDS=conds,
        EPV_EQ=fmt_m(epv["eq"]), AV_EQ=fmt_m(av["eq"]), AV_ENT=fmt_m(av["ent"]), AV_LIAB=fmt_m(av["liabilities"]),
        DISC=fmt_p(disc,0) if disc else "—", DTONE="bad" if (disc and disc > 1) else "",
        CASE=case["case"], CASE_RATIO=fmt_x(case["ratio"]), CASE_TEXT=case["text"],
        RNET=fmt_p(ret["net"]), RTONE="bad" if ret["margin"] < 0 else "", RSTAR=fmt_p(A["cost_of_capital"]),
        PRE_ROWS="".join(pr), PRE_NOTES=pre_notes, EPV_ROWS="".join(er), AV_ROWS=ar,
        FR_ROWS="".join(frr), FR_HOW=fr["how"], RISK_LIST=risk_html, TODO_LIST=todo_html, SENS_LIST=sens_html,
        LINEAGE_ROWS=lin, QUALITY_LIST=q_html, ASSUMP_LINE=assump_line,
        W_M=M6(mkt["cap"]), W_E=M6(epv["EP"]), W_REV=M6(epv["revenue"]),
        W_C="%.0f" % (pre["dist_ratio"]*100), W_GO="%.2f" % (pre["g_organic"]*100),
        W_GM="%.2f" % (A["margin_uplift"]*100), W_N="%.0f" % (pre["nwc"]*100),
        W_V="%.1f" % pre["vcf"], W_R="%.1f" % (A["cost_of_capital"]*100), W_H="%.0f" % A["fade_half_life"],
        V_REAL=("%.2f" % pre["v_realized"]) if pre["v_realized"] is not None else "样本不足",
        RET_NOTE=("" if v["route"] == "RETURN_METHOD" else "注意：本标的当前路由为三角验证，工作台仅供推演。"),
        RESULT_JSON=json.dumps(res["json_slim"], ensure_ascii=False))
    return fill(REPORT_TMPL, mapping)

# ---------------------------------------------------------------- 主流程
def load_assumptions(path):
    A = dict(DEFAULT_ASSUMPTIONS)
    src = {k: "default" for k in A}
    if path:
        with open(path, encoding="utf-8") as f: user = json.load(f)
        for k, val in user.items():
            if k in A and val is not None and val != A[k]:
                A[k] = val; src[k] = "override"
    return A, src

def analyze(tbl, years, lineage, quality, meta, market_in, A, src):
    pre = preprocess(tbl, years, A)
    epv = model_epv(tbl, years, pre, A)
    av = model_av(tbl, years, pre, A)
    case = classify_case(epv["ent"], av["ent"])
    fr = franchise_diag(pre, A, years)
    # 市值
    price = A["price"] if A["price"] is not None else market_in.get("price")
    shares = market_in.get("shares")
    cap = A["market_cap"] if A["market_cap"] is not None else (
        price * shares if (price and shares) else market_in.get("market_cap"))
    if not cap: raise SystemExit("无法确定市值：请提供 --price（并确保股本可得）或 assumptions.market_cap")
    mkt = {"price": price, "shares": shares, "cap": cap}
    # 权益口径 EP（用于 P/E 与回报法）: EP − 税后利息
    y = years[-1]
    intr = tbl.get("interest_expense", {}).get(y) or 0.0
    EP_eq = epv["EP"] - intr * (1 - pre["tax"])
    ret = model_return(pre, EP_eq, epv["revenue"], cap, A)
    risk = risk_checks(tbl, years, pre, EP_eq, cap, meta.get("sic"))
    verdict = decide(case, fr, epv, av, ret, risk, cap, pre, A, quality, years)
    res = {"meta": meta, "market": mkt, "years": years, "lineage": lineage, "data_quality": quality,
           "table": {c: {str(k): v2 for k, v2 in s.items()} for c, s in tbl.items() if s},
           "pre": pre, "models": {"epv": epv, "av": av, "case": case, "franchise": fr, "ret": ret},
           "risk": {k: v2 for k, v2 in risk.items()}, "verdict": verdict,
           "assumptions_effective": A, "assumption_src": src}
    res["json_slim"] = {k: res[k] for k in ("meta", "market", "verdict", "assumptions_effective")}
    res["json_slim"]["EP_eq"] = EP_eq
    return res

def write_outputs(res, outdir):
    os.makedirs(outdir, exist_ok=True)
    t = res["meta"]["ticker"]
    jp = os.path.join(outdir, "%s_result.json" % t)
    hp = os.path.join(outdir, "%s_report.html" % t)
    with open(jp, "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=1, default=str)
    with open(hp, "w", encoding="utf-8") as f:
        f.write(render_report(res))
    log("已输出: %s · %s" % (jp, hp))
    return jp, hp

# ---------------------------------------------------------------- 内置演示数据（离线端到端）
def demo_doc():
    yrs = list(range(2013, 2025))
    grow = [1.00, 1.032, 1.012, 1.045, 1.038, 1.033, 1.028, 0.92, 1.075, 1.052, 1.030, 1.031]
    mgn  = [.052, .056, .044, .050, .058, .060, .052, .036, .054, .058, .056, .054]
    ann, rev = {}, 9.6e9
    for i, y in enumerate(yrs):
        rev = rev * grow[i]
        op = rev * mgn[i]; intr = rev * 0.006
        pretax = op - intr; tax = pretax * 0.22; ni = pretax - tax
        row = dict(revenue=rev, operating_income=op, pretax_income=pretax, tax_expense=tax,
                   net_income=ni, dna=rev*.046, capex=rev*.050, rd=rev*.012, sgna=rev*.120,
                   interest_expense=intr, dividends_paid=ni*.30, buybacks=ni*.25, stock_issued=ni*.02,
                   acquisitions=rev*.004, cash=rev*.12, receivables=rev*.12, allowance=rev*.12*.004,
                   inventory=rev*.08, payables=rev*.09, ppe_net=rev*.42, ppe_gross=rev*.62,
                   goodwill=rev*.03, intangibles=rev*.01, debt_lt=rev*.07, debt_current=rev*.01,
                   equity=rev*.38, total_liabilities=None, total_assets=None)
        assets = row["cash"]+row["receivables"]+row["inventory"]+row["ppe_net"]+row["goodwill"]+row["intangibles"]+rev*.06
        row["total_assets"] = assets; row["total_liabilities"] = assets - row["equity"]
        ann[str(y)] = row
    return {"meta": {"name": "示例工业股份 Demo Industrial", "ticker": "DEMO", "currency": "USD", "sic": "3711"},
            "market": {"price": 4.0, "shares": 1.0e9},
            "annual": ann}

DEMO_ASSUMPTIONS = {"franchise": "yes", "fade_half_life": 50,
                    "notes": "演示: 假定人工已确认护城河、半衰期50年——展示 C 档覆盖的正确用法"}

# ---------------------------------------------------------------- 自检（书中算例回归）
def selftest():
    ok = True
    def chk(name, cond, detail=""):
        nonlocal ok
        print(("PASS  " if cond else "FAIL  ") + name + ("  " + detail if detail else ""))
        ok = ok and cond
    # 1. Magna 2009 (书 Ex2.5): EP≈920, 企业EPV≈9200, 权益EPV≈10940 (百万)
    m = epv_core(18000, 0.05, 0.111, 120, 0, 0.10, 1742, 0, 0, 0)
    chk("Magna EP≈920", abs(m["EP"] - 920) < 9.2, "EP=%.0f" % m["EP"])
    chk("Magna 企业EPV≈9200", abs(m["ent"] - 9200) < 92, "ent=%.0f" % m["ent"])
    chk("Magna 权益EPV≈10942", abs(m["eq"] - 10942) < 110, "eq=%.0f" % m["eq"])
    # 2. CG 回报法 (书表8.1): 3.6 + 3.5 + ≈3.66 = ≈10.8; fade(50y)=1.44
    r = ret_core(4000, 240, 3000, 0.60, 0.03, 0.005, 0.05, 1.6, 0.07, 50)
    chk("CG 现金 3.6%", abs(r["cash_r"] - 0.036) < 1e-4, fmt_p(r["cash_r"]))
    chk("CG 有机 3.5%", abs(r["org_r"] - 0.035) < 1e-4, fmt_p(r["org_r"]))
    chk("CG 主动 ≈3.66%", abs(r["act_r"] - 0.0366) < 1e-3, fmt_p(r["act_r"],2))
    chk("CG 合计 ≈10.8%", abs(r["total"] - 0.1076) < 1e-3, fmt_p(r["total"],2))
    chk("CG fade(50y)=1.44%", abs(r["fade"] - 0.0144) < 1e-5, fmt_p(r["fade"],2))
    chk("CG 边际>1.5pp → 买入候选阈内", r["margin"] >= 0.015, fmt_p(r["margin"],2))
    # 3. Intel-2018 型: 总回报8.2% vs R*9.5% + fade1.8% → 边际<0
    ri = ret_core(232000, 12300, 70000, 0.80, 0.04, 0.0, 0.0, 0.0, 0.095, 40)
    chk("Intel 型 边际<0 (AVOID)", ri["margin"] < 0, fmt_p(ri["margin"],2))
    # 4. Case 分类
    for ratio, want in ((0.6, "A"), (1.0, "B"), (1.6, "C")):
        c = classify_case(ratio * 100, 100)
        chk("Case 分类 %.1f→%s" % (ratio, want), c["case"] == want)
    # 5. 手工模式端到端（离线）
    doc = demo_doc()
    tbl, years, lin, q = build_table_from_manual(doc)
    A, src = load_assumptions(None)
    for k, v2 in DEMO_ASSUMPTIONS.items():
        if k in A: A[k] = v2; src[k] = "override"
    res = analyze(tbl, years, lin, q, doc["meta"], doc["market"], A, src)
    html = render_report(res)
    chk("演示管线: 人工franchise=yes → 回报法路由 + 买入候选",
        res["verdict"]["route"] == "RETURN_METHOD" and res["verdict"]["code"] == "BUY_CANDIDATE",
        "verdict=%s route=%s" % (res["verdict"]["code"], res["verdict"]["route"]))
    chk("演示管线: 报告完整(>15KB)", len(html) > 15000, "%d bytes" % len(html))
    chk("演示管线: 无未替换模板令牌", "{{" not in html)
    print("\n自检%s" % ("全部通过 ✅" if ok else "存在失败 ❌"))
    return 0 if ok else 1

# ---------------------------------------------------------------- CLI
def main(argv=None):
    ap = argparse.ArgumentParser(description="称重机 — 格雷厄姆–多德估值工作台")
    ap.add_argument("ticker", nargs="?", help="美股代码 (自动模式)")
    ap.add_argument("--input", help="手工模式: 年度数据 JSON (非美股)")
    ap.add_argument("--assumptions", help="假设文件 assumptions.json")
    ap.add_argument("--price", type=float, help="价格覆盖")
    ap.add_argument("--years", type=int, default=15)
    ap.add_argument("--out", default="out")
    ap.add_argument("--ua", default=SEC_UA_DEFAULT, help="SEC User-Agent (须含联系方式)")
    ap.add_argument("--demo", action="store_true"); ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args(argv)
    if a.selftest: return selftest()
    A, src = load_assumptions(a.assumptions)
    if a.price is not None: A["price"] = a.price; src["price"] = "override"
    if a.demo:
        doc = demo_doc()
        for k, v2 in DEMO_ASSUMPTIONS.items():
            if k in A and src.get(k) != "override": A[k] = v2; src[k] = "override"
        tbl, years, lin, q = build_table_from_manual(doc, a.years)
        res = analyze(tbl, years, lin, q, doc["meta"], doc["market"], A, src)
        write_outputs(res, a.out); return 0
    if a.input:
        with open(a.input, encoding="utf-8") as f: doc = json.load(f)
        tbl, years, lin, q = build_table_from_manual(doc, a.years)
        res = analyze(tbl, years, lin, q, doc["meta"], doc["market"], A, src)
        write_outputs(res, a.out); return 0
    if not a.ticker: ap.error("需要 ticker，或 --input / --demo / --selftest")
    cik, name = ticker_to_cik(a.ticker, a.ua)
    log("CIK %d · %s" % (cik, name))
    facts = fetch_companyfacts(cik, a.ua)
    tbl, years, lin, q = build_table_from_facts(facts, a.years)
    sic = None
    try:
        sub = cached_json("https://data.sec.gov/submissions/CIK%010d.json" % cik, a.ua, "sub_%d.json" % cik)
        sic = sub.get("sic")
    except Exception: pass
    price = A["price"] if A["price"] is not None else fetch_price_stooq(a.ticker, a.ua)
    shares = latest_shares(facts)
    meta = {"name": name, "ticker": a.ticker.upper(), "currency": "USD", "sic": sic}
    res = analyze(tbl, years, lin, q, meta, {"price": price, "shares": shares}, A, src)
    write_outputs(res, a.out); return 0

if __name__ == "__main__":
    sys.exit(main())
