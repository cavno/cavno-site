Investing · Options

# GOOGL · Gamma Profile (SpotGamma Framework)

[← 返回期权栏目](http://127.0.0.1:5509/investing/options/)

Gamma Profile Dashboard

SpotGamma Framework

GOOGL Alphabet Inc.

$396.015 ▼ -5.055 (-1.26%) 2026/05/15 · OPEX

CALL WALL

$400.00

Largest +γ · Resistance

PUT WALL

$395.00

Largest -γ · Support

GAMMA FLIP (HVL)

$371.24

Regime threshold

ABSOLUTE γ

$400.00

Max dealer hedge

DAILY 1σ RANGE

$392.8 - $399.2

±$3.2 implied

POSITIVE GAMMA

Dealers in **mean reversion** mode · Volatility suppressed · Price pinned between walls

DIST. TO FLIP +24.76

PIN STRENGTH HIGH

DEALER FLOW SUPPRESSIVE

Net Gamma Profile by Strike

2026/05/15 · Range $350-430 · 38 strikes

![文章图示 1](https://cavno.org/investing/options/gamma-profile/downloads/assets/gamma-profile-visual-001.png)

SIMULATE

$396.00

+γ (Call dominant)

-γ (Put dominant)

Total GEX

Call/Put Walls

Gamma Flip (HVL)

Simulated Price

HEDGING ANALYSIS

Simulated Price $396.00

Regime +γ

Distance to Flip +24.76

Total GEX at Price +$1.65B

DEALER HEDGE FLOW

$↑ $1: Sell 4.1K shares

$↓ $1: Buy 4.1K shares

MM is **short γ (always)**. In +γ zone, hedging **compresses moves** — price gets pinned toward $397.5 between walls.

NEAREST LEVELS

↑ Nearest Resistance Call Wall $400

↓ Nearest Support Put Wall $395

Range Width $5.00

Vanna Exposure ∂²V / ∂S∂σ

Dealer's delta sensitivity to IV changes. **When IV drops, vanna flows trigger systematic buying** as dealers reduce hedges. Critical near OPEX.

![文章图示 2](https://cavno.org/investing/options/gamma-profile/downloads/assets/gamma-profile-visual-002.png)

Current Vanna Flow +POS · IV ↓ → Bid

Charm Exposure ∂Δ / ∂t

Delta decay over time. **Drives the OPEX week run-up pattern** — as expiration nears, OTM call deltas decay, forcing dealers to unwind short hedges by buying.

![文章图示 3](https://cavno.org/investing/options/gamma-profile/downloads/assets/gamma-profile-visual-003.png)

Current Charm Flow +POS · Time Decay Bid

⚠ DISCLAIMER · 重要免责声明

数据基于 2026/05/15 GOOGL Gamma敞口截图的视觉重构估值,采用 SpotGamma 公开框架的术语和方法论(Call Wall / Put Wall / Gamma Flip / Absolute Gamma / Vanna / Charm),但**非 SpotGamma 官方产品**。所有数值仅供学习参考,不构成投资建议。真实交易决策应使用经过验证的实时数据源。

---

来源：[https://cavno.org/investing/options/gamma-profile/](https://cavno.org/investing/options/gamma-profile/)
