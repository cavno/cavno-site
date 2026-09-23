Investing · Options

# 希腊字母统一图谱 · Greeks Unified Atlas

[← 返回期权栏目](http://127.0.0.1:5509/investing/options/)

Option Greeks · Unified Atlas

# 希腊字母统一图谱

Delta · Gamma · Theta · Vega · IV Skew —— 同一枚硬币 φ(d₁) 的五个投影

BSM 解析解参数全局联动跨图同步十字光标复刻自五个 xlwings 工作簿（2025-08-25）

行权价 K **100**

无风险利率 r **5.00%**

波动率 σ **30%**

近月剩余 T近 **30 d**

远月剩余 T远 **365 d**

d₁ = \[ln(S/K) + (r + σ²/2)T\] / (σ√T)　·　φ = 标准正态密度　·　N = 标准正态分布函数　·　原版默认 B1:B5 = {100, 5%, 30%, 30d, 365d}

导 语 **五个工作簿、五段 xlwings 宏、五张静态 PNG——但它们本来就是同一个函数 φ(d₁) 在不同算子下的五个投影。**整合的意义不是把图放进同一页，而是让它们共享同一组参数、同一个光标、同一条时间轴：拖动任一滑杆，五张图同步重算；按下「到期演化」，看 Delta 数字化、Gamma 爆炸、Theta 挖深、Vega 流干在同一秒发生。原图的全部语法被完整保留——近月／远月双曲线对照（原版红虚／蓝实，此处译为赤陶／深青）、ATM 参考虚线、Call/Put 双视角 moneyness 标注、以及 B1:B5 的默认参数。

操作：拖动滑杆全图联动｜悬停任一图表出现十字光标并跨图同步（金色虚线）｜「到期演化」将近月 T 从当前值压至 0.5 天。

Δ

壹 · Delta

## Delta —— 复制组合的持仓指令

Δc = N(d₁)　Δp = N(d₁) − 1

远月 Call（T=365d）近月 Call（T=30d）远月 Put近月 PutK = 100（ATM）

S = **100.0**（ATM）　近月 Δc **0.536** · Δp **-0.464**　远月 Δc **0.624** · Δp **-0.376**

![文章图示 1](https://cavno.org/investing/options/option_greek/downloads/assets/option_greek-visual-001.png)

Delta 的本质不是"方向观点"，而是复制该期权所需持有的标的数量；时间是它的显影液——T→0 时 S 形曲线塌缩为 0/1 阶跃，期权彻底"数字化"。 远月（365d）曲线平缓，Delta 对价格的敏感度被时间摊薄；近月（30d）在 ATM 附近陡峭得多——而这条曲线在每一点的**斜率**，正是下一张图的 Gamma。Put 曲线不携带新信息：Δp = Δc − 1（对平价关系 C − P = S − Ke⁻ʳᵀ 求导即得），四条线实为两条的垂直平移。水平参考线 ±0.5 标出教科书式的 ATM 读数，但注意 ATM Delta 并不恰为 0.5：d₁ 中的 (r + σ²/2)T 项把 Call 推到 0.5 之上（本组参数近月 0.536、远月 0.624），期限越长偏离越大。 ↓ 这条"斜率"本身就是一个可交易的量——见第贰图。

源：option\_charts\_Delta/option\_charts.py（generate\_and\_insert\_delta\_chart\_unified）· 定义域 0.5K–1.5K · 参考线 0 / ±0.5 · 双视角标注完整保留

Γ

贰 · Gamma

## Gamma —— 期权性的密度分布

Γ = φ(d₁) / (S·σ·√T)

远月（T=365d）近月（T=30d）K = 100（ATM）

S = **100.0**（ATM）　Γ近 **0.0462** · Γ远 **0.0126**　近/远 = **3.65×**

![文章图示 2](https://cavno.org/investing/options/option_greek/downloads/assets/option_greek-visual-002.png)

Gamma 是"期权性"（optionality）的密度：钟形、ATM 封顶、Call 与 Put 完全同值——凸性与方向无关。 公式里 √T 在**分母**：ATM Gamma ∝ 1/√T，到期临近时曲线向行权价塌缩并飙升。本组默认参数下 30 天期峰值约为 365 天期的 3.65 倍；按下「到期演化」压到 0.5 天，倍数逼近 28 倍——这就是 0DTE 的物理学，也是做市商对冲频率随到期日逼近而急剧上升的原因。远离 ATM 时 Gamma 归零：深度 ITM 已是"准股票"，深度 OTM 是"准废纸"，两端都失去期权性。一个常被忽略的细节：峰值严格位于 K 左侧（S\* = K·e^{−(r+3σ²/2)T}，近月约 98.5），对数正态分布的不对称所致，放大远月曲线尤其可见。 ↓ 凸性不是免费的午餐——账单见第叁图。

源：option\_charts\_Gamma/option\_charts3.py（generate\_and\_insert\_gamma\_chart\_unified）· 定义域 0.7K–1.3K · Call ≡ Put

Θ

叁 · Theta

## Theta —— Gamma 的账单

Θd = \[−Sφ(d₁)σ/(2√T) ∓ rKe⁻ʳᵀN(±d₂)\] / 365

远月（T=365d）近月（T=30d）K = 100 · Call

S = **100.0**（ATM）　Θ近 **-0.0638**/天 · Θ远 **-0.0222**/天　（Call）

![文章图示 3](https://cavno.org/investing/options/option_greek/downloads/assets/option_greek-visual-003.png)

Theta 是 Gamma 的账单：本图就是上一张图乘以 −½σ²S² 后的镜像，Gamma 峰在哪里，Theta 谷就在哪里。 这不是巧合而是无套利的会计恒等（第陆节给出完整台账）：持有凸性必须按日付租。近月 ATM 谷底最深（默认参数下约 −0.064/天，远月仅 −0.022/天），且随 T→0 继续加深；深度 ITM/OTM 几乎不付租——因为那里没有 Gamma 可租。切换到 **Put** 可见第二项 +rKe⁻ʳᵀN(−d₂) 的作用：深度 ITM Put 的 Theta 可以为**正**（S=70、T=365d 时约 +0.0036/天）——等待行权收取 K 的利息补贴，是"时间只会侵蚀期权"这一直觉的唯一系统性例外。 ↓ 同一个 φ(d₁)，把 √T 从分母搬到分子，就得到第肆图。

源：option\_charts\_Theta/option\_charts\_Theta.py（generate\_and\_insert\_theta\_chart\_unified）· 原脚本以 Call 为代表曲线，Put 分支存而未用——本页将其激活为切换项

ν

肆 · Vega

## Vega —— Gamma 的时间对偶

ν = S·φ(d₁)·√T / 100

远月（T=365d）近月（T=30d）K = 100（ATM）

S = **100.0**（ATM）　ν近 **0.114** · ν远 **0.379**　远/近 = **3.33×**

![文章图示 4](https://cavno.org/investing/options/option_greek/downloads/assets/option_greek-visual-004.png)

Vega 与 Gamma 同形不同时：同样的钟形、同样的 ATM 封顶，但 √T 从分母搬到了分子——远月才是波动率的载体。 默认参数下 365 天期 ATM Vega ≈ 0.379，30 天期仅 ≈ 0.114，与 Gamma 的排序完全颠倒（3.3 倍 vs 3.65 倍，方向相反）。这条时间不对称是期限结构交易的全部语法：日历价差 = 卖近月的 Gamma/Theta、买远月的 Vega；做空 0DTE 收 Theta 时，你几乎没有卖出任何 Vega——两种风险住在时间轴的两端。Vega 峰同样不严格钉在 K 上（S\* = K·e^{(σ²/2−r)T}），本组参数下 σ²/2 ≈ r，偏移可忽略。 ↓ 至此四张图都把 σ 当作常数——最后一张图撤销这个假设。

源：option\_charts\_Vega/option\_charts\_vega.py（generate\_and\_insert\_vega\_chart\_unified）· 每 1 个百分点 IV 变动对应的价格变化（÷100 缩放保留）

σ

伍 · Implied Volatility

## IV 微笑与偏斜 —— 市场对 BSM 的修正案

σ(K) = σₐ + 0.0007(K−S₀)² − 0.005(K−S₀)

隐含波动率曲线 σ(K)现价 S₀ = 100（ATM）

K = **100.0**（ATM）　σ(K) = **30.0%**　σ\_ATM = **30.0%**　谷底 K\* ≈ **103.6** @ **29.1%**

![文章图示 5](https://cavno.org/investing/options/option_greek/downloads/assets/option_greek-visual-005.png)

前四张图都把 σ 当常数，这张图承认市场不这么认为——注意横轴换成了行权价 K，moneyness 语义随之翻转：低 K 一侧是 Call ITM / Put OTM。 原脚本用二次项 + 线性项模拟股票期权的典型"微笑 + 左偏"（smirk）：抛物线是两翼的微笑，线性负项把低行权价一侧抬得更高——市场为崩盘风险付费的永久疤痕（1987 年之后 OTM Put 的 IV 再未回到对称）。曲线最低点不在 ATM 而在 K\* = S₀ + 3.57（偏斜把谷底推向 OTM Call 一侧，默认参数下谷值 29.1%）。这意味着 BSM 在每个行权价使用不同的 σ——模型是错的，但错得如此有规律，以至于错误本身成了可交易的对象（skew trading）。整合说明：原版此图有独立参数 B1:B2（现价、ATM IV，默认值与其余四簿相同），本页将其与全局 K、σ 联动。 ↓ 五个投影至此收拢——进入整合视角。

源：option\_charts\_IV/option\_charts\_IV.py（simulate\_iv\_skew + generate\_and\_insert\_iv\_skew\_chart\_unified）· 定义域 0.75S₀–1.25S₀ · Y 轴百分比格式保留

陆 · SYNTHESIS

## 整合视角：五张图为什么是一张图

原先五个工作簿各自为政，看不见的正是下面三件事——它们只有在共享参数与坐标时才会显形。

√T

6.1 · Term Structure

## ATM 期限结构 —— Γ ∝ 1/√T 与 ν ∝ √T 背向而行

各曲线按自身最大值归一化

Γ\_ATM（∝ 1/√T，短端发散）ν\_ATM（∝ √T，长端为王）|Θ|\_ATM（与 Γ 同构）

T = **30** 天（S 固定于 K）　Γ **0.0462**　ν **0.114**　Θ **-0.0638**/天

![文章图示 6](https://cavno.org/investing/options/option_greek/downloads/assets/option_greek-visual-006.png)

固定在同一个 ATM 点上看时间：短端是 Gamma 的世界，长端是 Vega 的世界，|Θ| 与 Γ 几乎重叠。 重叠不是拟合而是结构：Θ 的主项就是 −½σ²S²Γ，所以两者共享 1/√T 的发散；ν 携带 √T 单调反向。两条竖直虚线跟随控制台的近月／远月位置移动——拖动 T 滑杆，看你的两只合约分别站在这条时间轴的哪一端。

本图为整合新增（原五簿无此视角）· S 固定于 K · T ∈ \[1, 365\] 天

Γ|Θ

6.2 · Mirror Identity

## 镜像验证 —— 你付的每一分 Theta 都是 Gamma 的租金

−Θd ≈ ½σ²S²Γ / 365（Call，近月）

−Θd（每日实付时间价值 · Call · T=30d）½σ²S²Γ/365（凸性公允租金）两线之缝 = 资金项 rKe⁻ʳᵀN(d₂)/365

S = **100.0**　−Θd **0.0638**　凸性租金 **0.0570**　资金项 **0.0068**

![文章图示 7](https://cavno.org/investing/options/option_greek/downloads/assets/option_greek-visual-007.png)

把 −Θ 与 ½σ²S²Γ/365 画进同一坐标：两线几乎重合，中间那道细缝就是资金项 rKe⁻ʳᵀN(d₂)/365。 这是恒等式的直接可视化，不是回归——你每天付出的时间价值，逐元等于所持凸性的公允租金，外加一点利息。把控制台的 r 拉到 0，细缝闭合；拉到 10%，细缝张开。悬停任意 S 可读出三个量的精确分解。

本图为整合新增 · 使用 T近 与 Call 公式 · 与第贰、叁图共享十字光标

≡

6.3 · No-Arbitrage Ledger

## BSM 偏微分方程 —— 实时台账

Θ + ½σ²S²Γ + rSΔ − rV = 0

| 取值：S = K = 100 · T = 30 天 · Call　｜　V = 3.6321 · Δ = 0.5362 · Γ = 0.04619 |  |
| --- | --- |
| Θ（年化时间损耗） | -23.2865 |
| ＋ ½σ²S²Γ（凸性租金） | 20.7873 |
| ＋ rSΔ（Delta 持仓的资金收益） | 2.6808 |
| － rV（期权价值的资金成本） | -0.1816 |
| 合计（无套利残差） | 6.94e-16 |

无套利要求四项之和恒为零：时间损耗、凸性租金、持仓的资金收益、期权价值的资金成本，一分不多一分不少。 表中数值随控制台实时重算（取 S = K、T = T近、Call、年化 Θ）。残差稳定在 10⁻¹⁵ 量级——不是巧合：N(x) 虽用有理近似（Abramowitz–Stegun 7.1.26），但 N(d₁)、N(d₂) 在四项之间**代数上严格对消**，Θ 的扩散项又与 ½σ²S²Γ 精确抵偿，恒等式对任何 N 的实现都成立，剩下的只有浮点舍入。这张台账就是五张图的最终判词：**Delta、Gamma、Theta 不是三个独立的量，而是同一份无套利合同的三个条款。**

本表为整合新增 · V 为 BSM Call 价格 · Θ 取年化值（日 Theta × 365）

附 · PROVENANCE

## 复刻说明

| 原文件 | 对应区块 | 完整保留 | Web 升级 |
| --- | --- | --- | --- |
| option_charts.py （Delta） | 壹 · Delta | 四条曲线、0/±0.5 参考线、0.5K–1.5K 定义域、Put 曲线 70% 透明度、底部双视角标注 | 静态 PNG → 实时 SVG；悬停显示四曲线精确读数 |
| option_charts3.py （Gamma） | 贰 · Gamma | 近／远双曲线、0.7K–1.3K 定义域、ATM 虚线、双视角标注 | 峰值倍数实时显示；到期演化动画 |
| option_charts_Theta.py | 叁 · Theta | Call 代表曲线、零轴、日化换算（÷365） | 激活原脚本存而未用的 Put 分支为切换项 |
| option_charts_vega.py | 肆 · Vega | ÷100 缩放（每 1% IV）、双曲线语法 | 与 Gamma 卡并读，倍数对照 |
| option_charts_IV.py | 伍 · IV Skew | 模拟公式系数 0.0007 / −0.005、0.75–1.25 倍定义域、百分比 Y 轴、翻转的 moneyness 标注 | 独立参数 B1:B2 并入全局 K、σ |
| 五簿共同 | 控制台 | B1:B5 默认参数 {100, 5%, 30%, 30d, 365d}；近月红虚／远月蓝实的视觉语法（译为赤陶虚线／深青实线） | 五套独立参数 → 单一全局状态；新增陆节三个整合视角 |

φ(d₁)

一枚硬币 · 五个投影　｜　单文件 · 零构建 · 零依赖（字体除外）　｜　BSM 解析解，教学用途，非实盘建议　｜　2026 · 07

---

来源：[https://cavno.org/investing/options/option_greek/](https://cavno.org/investing/options/option_greek/)
