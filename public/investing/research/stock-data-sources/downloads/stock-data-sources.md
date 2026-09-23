# 给 AI 喂股市数据：价格、实时性与准确性横评

Investing · Research

# 给 AI 喂股市数据，先看价格、实时性与准确性。

把免费公开行情、券商通道、商业 API、MCP 与 Skills 放进同一套成本和延迟坐标，直接判断什么数据源适合什么任务。

[← 返回投资研究栏目](http://127.0.0.1:5509/investing/research/)

零成本档

¥0A 股秒级 + 港股实时价

腾讯／新浪／东财直连，秒级时间戳 + 五档；港股实时价走新浪 rt\_ 前缀（盘中亲验与墙钟同秒）

实时最低价

$99/月起

美股全交易所实时（SIP）：Alpaca Algo Trader Plus

tick 级

$199/月

美股实时 + 20 年历史：Massive Stocks Advanced

终端档

3.98万元/年

Wind 单账号年费（2023 报道），iFinD 约其 50–70%

01 · 定位图

## 甜点区在左上：¥0 拿秒级，$99 买实时

横轴是月成本，纵轴是延迟等级。**左上象限（便宜且快）才是要抢的位置**，右下（贵还慢）永远不选。券商模式单独标出——它不卖 API 订阅，成本绑在账户等级上。

![文章图示 1](https://cavno.org/investing/research/stock-data-sources/downloads/assets/stock-data-sources-visual-001.png)

02 · 架构图

## 三层分工：实时走通道，分析走 MCP

长桥官方自己把这套分工写了出来——**实时行情与账户数据走 CLI 或 MCP，13 个 Skills 里的分析类能力挂在 MCP 上**；它还专门做了 `longbridge-terminal`，自称 AI-native CLI、支持 `--format json`。这张图就是答案。

![文章图示 2](https://cavno.org/investing/research/stock-data-sources/downloads/assets/stock-data-sources-visual-002.png)

03 · 决策树

## 三个问题定方案，直接带月成本

![文章图示 3](https://cavno.org/investing/research/stock-data-sources/downloads/assets/stock-data-sources-visual-003.png)

04 · 价格阶梯

## 每一档钱，换到的是什么

价格为官网月付价（2026-07-25 核），年付通常另有折扣。条形长度表示相对价格量级。

![文章图示 4](https://cavno.org/investing/research/stock-data-sources/downloads/assets/stock-data-sources-visual-004.png)

05 · 主横评表

## 一张表按月成本从低到高排

每行末尾是一句话结论。赢家 该预算档首选 · 备选 有条件更优 · 留意 有明确边界 · 受限 硬门槛或信息缺口

| 方案 | 形态 | 月成本 | 延迟 | 市场 | 授权 | 盘口深度 | 下单 | 一句话结论 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 腾讯 qt.gtimg.cn 公开接口 | curl 直连 | ¥0 | 秒级 | A/港/美 |  | 五档 |  | 字段最全的零成本源，免 Referer；A 股秒级，港/美为延迟档（盘中亲验滞后 15 分 03 秒） 赢家 |
| 新浪 hq.sinajs.cn 须带 Referer | curl 直连 | ¥0 | 秒级 | A/港/美 |  | 五档（A 股） |  | 美股盘后价 + 港股实时价（rt_ 前缀，盘中亲验 0 延迟）都只有它免费给 赢家 |
| 东财 push2 代号字段制 | curl → JSON | ¥0 | 秒级 | A/港/美 |  | 五档 |  | 返回 JSON 带 Unix 时间戳，脚本化最省事 备选 |
| baostock 系 MCP a-share-mcp，41 工具 | MCP 自建 | ¥0 | T+1 | A 股 |  | 无 |  | 财报与历史够用，日线要等 17:30，绝不能盯盘 留意 |
| CnStock 公开端点 3 工具 | MCP 托管 | ¥0 | T+1 | 沪深主板 |  | 无 |  | 零配置试水，但查询流向第三方主机 留意 |
| AKShare / efinance | Python 库 | ¥0 | 秒级–T+1 | 全品类 |  | 视源 |  | 爬虫聚合，可指定复权；源站改版即失效 留意 |
| Finnhub 仅社区 MCP | API + 社区 MCP | ¥0 起 ※$11.99–99.99 | 实时（免费档） | 美股 + 全球 |  | 无 |  | 免费档 60 次/分含实时美股报价，性价比高；官方不出 MCP，免费档仅个人用途 备选 |
| Tiingo REST API | API | $0 / 30 | EOD–IEX 实时 | 美股 + 全球 |  | 无 |  | 免费档 30+ 年日线历史（50 次/时·500 标的/月·仅个人用途）；Power $30 加 IEX 实时 + 万次/时 历史赢家 |
| Twelve Data 官方 MCP | MCP 托管 | $0 / 29 / 99 / 329 | 实时（美股免费档） | 50+ 国 |  | 无 |  | 免费档就给实时美股，欧洲实时要 Pro $99 备选 |
| EODHD 官方 MCP 亲验 86 工具 | MCP 托管/本地 | $0–99.99 19.99 / 29.99 / 59.99 / 99.99 | 15 分钟–实时 | 60+ 交易所 |  | 无 |  | 国际广度最好，MCP 只在 $99.99 ALL-IN-ONE 档标注包含 赢家 |
| Alpha Vantage 官方 MCP 80+ 工具，Anthropic 认证 | MCP 托管 | $0–249.99 49.99 / 99.99 / 149.99 / 199.99 / 249.99 | 15 分钟延迟 | 美股 + 全球 |  | 无 |  | 接进 Claude 最省事，但免费档仅 25 请求/天、五档涨价买的是频次 备选 |
| Alpaca 官方 MCP 50+ 工具 | MCP 自建 + 券商 | $0 / 99 | 付费档实时 | 美股/期权/加密 |  | SIP 全交易所 |  | 美股实时的最低门槛，且自带模拟盘练手 赢家 |
| Massive（原 Polygon.io） 官方 MCP 3 工具 | MCP 自建 | $0 / 29 / 79 / 199 | $199 档 tick | 美股/期权/期货 |  | tick 级 |  | $199 档给 tick + 20 年历史，工具设计最省上下文 赢家 |
| Tushare 官方 MCP 亲验 258 工具 | MCP 托管 | 积分制 ※≈200/500 元 | 多为日频 | A 股 + 基金/期货 |  | 无 |  | A 股财务面最全，但官方无公开价目表、实时不是强项 赢家 |
| longbridge-terminal 官方 CLI，949★ | CLI（--format json） | 券商模式 | tick 级 | 港/美/A/新 |  | 盘口+经纪队列+逐笔 |  | 为 Agent 设计的实时通道；行情商店港股 LV2 ※158 港币/月，约富途三分之一 赢家 |
| 富途 OpenD + Skills 本地 TCP 网关 | 网关 + Skills | 券商模式 ※LV2 约488港币/月 | tick 级推送 | 港/美/A/日/新 |  | LV2 十档 + 逐笔 |  | 深度最好；免费 LV2 活动已中止（07-27 复核），付费行情卡在售、App 行情商城内购 留意 |
| OpenBB CLI 1.4.2 + MCP 200+ 工具 | CLI + MCP | 开源 ¥0 企业版另议 | 取决于所选源 | 全球 | 视源 | 视源 |  | 30+ 数据源统一层，接多源时省掉重复适配 赢家 |
| 同花顺 iFinD MCP ~20 工具 | MCP 托管 | ※约 2–2.8 万元/年 | 终端级 | A 股 + 基金 + 宏观 |  | 终端级 |  | 唯一把终端级数据做成 MCP 的，需终端授权 赢家 |
| Wind 万得 无官方 MCP | 本地 Agent / 社区桥 | ※39,800 元/年·单账号 | 终端级 | A 股 + 全球 |  | 终端级 |  | 官方走 WindClaw，MCP 只能靠社区桥 WindPy 受限 |
| FMP 官方 MCP | MCP | ※Professional $149 | 视订阅 | 全球 |  | 无 |  | 官网文档与托管域名均抓不到，价格与归属未核实 信息缺口 |
| FactSet / S&P Global Bloomberg 不开放 | MCP 企业 | 机构报价 | 实时 | 全球 |  | 机构级 |  | 授权与审计链条写在合同里，个人用不上 机构线 |

06 · 缺口

## 价格缺口与口径冲突：一处已裁决，三处待核

按调研纪律，抓不到就写抓不到，冲突就并列，不替厂商圆场。

### 当前状态

- **富途免费 LV2 —— 已裁决（07-27 复核）：免费活动中止，付费一直在售。**帮助中心明示"以往所有免费 LV2 串流报价的活动已中止"；港股 LV2 行情卡在售，第三方口径约 488 港币/月（※以 App 行情商城标价为准）；API 文档"境内认证免费 LV2"按过期口径处理。**收费不等于没有——开通与扣费见第 11 节。**
- **Tushare 没有公开价目表。**官方页只写"付费加入微信专业群送 5000 积分""加入高级用户 QQ 群点击付费 200"，以及"赞助社区获得积分权限，金额随意"。社区口径的 2000 分≈200 元、5000 分≈500 元来自第三方博客，本页已标 ※。
- **FMP 官方 MCP 信息拿不到。**官方文档页被 CloudFront 403 拦截，`mcp.financialmodelingprep.com` DNS 不通；"Professional $149/月含 MCP"来自二手汇总，未核。
- **EODHD 的 MCP 归属档位有歧义。**订阅页只在 ALL-IN-ONE $99.99 的功能列表里标出 MCP Server，而 MCP 产品页写"Free and paid plans"。本页按订阅页口径记为 $99.99 档，实际以下单页为准。

07 · 三层定位

## CLI、Skills、MCP 各管什么

通道层

### CLI / 直连 API

进程外执行，Agent 用 Bash 调用，不经包装与缓存。

#### 实时性上限

tick 级（券商网关）／秒级（免费直连）

#### 上下文成本

近乎零——不注入工具定义

#### 字段深度

最全：五档/十档、逐笔、经纪队列、盘后价

#### 代价

自己拼命令、处理编码与限流

方法层

### Skills

本身**不产生数据**，是按需加载的指令 + 脚本包。

#### 实时性上限

等于它背后调的通道

#### 上下文成本

低——按相关性加载

#### 典型内容

长桥 13 个：技术分析、缠论、艾略特、希腊字母、价值投资、量化因子

#### 代价

只解决"怎么算"，不解决"数据从哪来"

查询层

### MCP

把 REST API 包成工具集，适合结构化查询。

#### 实时性上限

视订阅档；免费档多为 15 分钟或 T+1

#### 上下文成本

高——Tushare 实测 258 个、长桥 148 个常驻

#### 强项

财报、一致预期、股东、宏观、机构数据

#### 代价

多一跳包装；社区实现上游是公开接口

08 · 实时性

## 延迟阶梯：先确定要落在哪一档

跨档不是"差一点"，而是根本不能用于该场景。

![文章图示 5](https://cavno.org/investing/research/stock-data-sources/downloads/assets/stock-data-sources-visual-005.png)

09 · 准确性

## 六道闸门，决定拿到的数字能不能信

闸门 1

### 行情授权等级

盘口深度是买来的授权，不是软件功能。LV2 才有实时逐笔 + 十档 + 经纪队列；免费公开接口只到五档。富途 API 文档称境内认证客户港股免费 LV2、美股推广期免费 LV3——但与行情卡帮助页口径冲突，见第 06 节。

规划成本前先确认自己账户的真实权限

闸门 2

### 复权处理

不复权价做技术分析、算收益率一定错，除权除息日会出现"假跌停"。AKShare 分时可指定复权，但各源默认口径不同，必须显式声明前复权/后复权。

跨源比价前先对齐复权口径

闸门 3

### 多源交叉校验

免费源无 SLA，唯一可行的准确性验证是同时打两三个源比对。本次亲验：新浪 1297.410、腾讯 1297.41、东财 f43=129741（÷100）——三源对 600519 完全一致。

分歧时以带交易所授权的源为准

闸门 4

### 上游稳定性

AKShare 本质是分布式爬虫集合，源站改版即失效；社区 MCP 多数建在同一批公开接口上，故障会一起发生。付费档买到的一部分就是稳定性。

生产链路别把免费爬虫当唯一源

闸门 5

### 限流与配额

Alpha Vantage 免费 25 请求/天；Alpaca 免费档 200 次/分且 WebSocket 限 30 标的；富途每 30 秒最多 60 次快照、订阅额度按资产 100/300/1000/2000；EODHD 各付费档统一 10 万次/天、1000 次/分。超限常返回空值或旧值，比报错更危险。

Agent 循环取数必须做退避与空值检查

闸门 6

### 字段语义

东财 push2 是代号制：`f43` 价格需 ÷100、`f86` 是 Unix 行情时间戳、`f169/f170` 为涨跌额与涨跌幅。搞错含义会静默产出错误结论。

用时间戳字段自检新鲜度，别假设"刚拿到就是新的"

10 · 可直接用

## 五条命令：A 股秒级 + 港股实时 + 全量历史，全零成本

不装包、不起服务，Bash 直接跑；多源同时打就是交叉校验。

![文章图示 6](https://cavno.org/investing/research/stock-data-sources/downloads/assets/stock-data-sources-visual-006.png)

11 · 开通与扣费

## 付费四张开通卡：多少钱、去哪买、怎么扣

免费档的开通只有一步（注册拿 key：[Alpaca](https://alpaca.markets/) 免信用卡、[Tiingo](https://www.tiingo.com/) 注册即用）。下面是四条付费路线的实操，价格标 ※ 为二手源，下单前以官方页为准。

A 股批量 · 第一笔最值的付费

Tushare 积分（200 元档起）

※≈¥200–500 一次性 · 年度有效

- ① [tushare.pro](https://tushare.pro/) 注册 → 个人主页复制 token
- ② 「积分获取」页充值：※2000 分≈200 元、5000 分≈500 元（本质年度赞助，官方无价目表）
- ③ 2000 分解锁周月线/财报/基金/期货主力接口；5000 分再开基金持仓、期权日线，频次更高
- ④ 扣费＝支付宝/微信一次性充值，**无自动续扣**，积分调用不消耗、到期回落

**先别买：**免费直连没被封过 IP、批量需求低——这 200 元是在买稳定性，不是买数据。

港股盘口 · 最便宜的正规解

长桥行情商店 港股 LV2

※158 港币/月（Plus 338 · 美股 L1+ 46）

- ① Longbridge App 开户（现有入金 1 万港币送 200 + 免佣活动）
- ② longbridge.com 开发者平台完成**开发者认证 + OpenAPI 权限申请**——官方原文：接口本身"不额外收取开通或使用费用"
- ③ App 行情商店订阅行情包；OpenAPI／CLI／MCP 的行情权限跟随账户
- ④ 扣费＝连续包月、从证券账户资金扣，可随时退订

**先别买：**只看价格不看盘口——新浪 `rt_` 免费拿实时价就够，LV2 买的是逐笔/十档/经纪队列。

已在富途生态 · 就地升级

富途行情卡 + OpenD

※港股 LV2 约 488 港币/月

- ① 牛牛 App 开户 → 「行情商城」购行情卡（免费 LV2 活动已中止，付费在售，另有更贵 SF 全盘档）
- ② 量化跑本地 OpenD 网关，行情权限跟随账户行情卡等级
- ③ 扣费＝App 内按月购卡；美股方向留意限时免费 LV3 活动

**先别买：**单为港股 LV2 新开户——长桥 ※158 港币约为富途三分之一。富途赢在 OpenD 生态与五市场覆盖。

美股 · 按预算上台阶

$29 Massive → $30 Tiingo → $99 Alpaca

信用卡月订（Visa/Master）· 年付普遍省 20%

- **Massive Starter $29**：15 分钟延迟 + 5 年历史 + 不限调用——回测党起步
- **Tiingo Power $30**：IEX 实时 + 10000 次/时 + 全 symbol（仍限内部使用）
- **Alpaca Algo Trader Plus $99**：全市场 SIP 实时 + OPRA 期权 + 历史无"最近 15 分钟"洞，Dashboard 内订阅
- 同价位 Alpha Vantage（$49.99 起）与 Finnhub（模块制 ※$50/月/类起）无比较优势，仅当已绑定其生态

**避雷 AllTick：**中文"横评"吹免费 5000 次/日并推为首选；官方定价页实为**免费 10 个演示品种、10 次/分**，全美股 799 USD/月——推荐文按软文看待。

**商用红线：**Tiingo 与 Finnhub 的免费/个人档均限个人或内部使用（Finnhub 退订还须删除其数据）；腾讯/新浪/东财直连无授权，不可进商业产品。要商用走 Massive/Tiingo 商务版、券商 OpenAPI 或 Tushare 企业版，先发邮件谈许可。

12 · 按预算选

## 五种典型情况，直接给方案和月成本

A 股 · 盘中要最新价，不想花钱

Bash 直连三源交叉校验

¥0 / 月

- 亲验三源对 600519 完全一致，时间戳精确到秒，可自证新鲜度与准确性
- 上下文成本近零——不注入工具定义，只有一行命令
- 腾讯免 Referer、新浪必须带 Referer（否则 403）、东财需带 Referer

**别选它：**要十档/逐笔/经纪队列，或做实盘依赖——免费源只给五档且无 SLA。

美股 · 要真实时，预算越低越好

Alpaca Algo Trader Plus

$99 / 月（免费档 $0，但 15 分钟延迟）

- 官网口径：免费档 IEX + API 15 分钟延迟 + 200 次/分 + WebSocket 限 30 标的；付费档全美交易所（SIP）、实时、无限调用
- 官方 MCP 50+ 工具，含下单，默认 paper 模拟盘——可以先零成本跑通链路
- 同价位对比：EODHD ALL-IN-ONE $99.99 广度更好但重在 EOD/基本面；Twelve Data Pro $99 的欧洲实时才解锁

**别选它：**要 tick 级与期权全链——那要 Massive Advanced $199。

量化 · tick 级 + 长历史 + 期权

Massive Stocks Advanced（自建 MCP）

$199 / 月（年付省 20%）

- 官网口径：Advanced 档 = 实时数据 + 20 年以上历史 + 无限调用，标注"Non-pros only"（非专业用户）
- 官方 MCP 只有 3 个复合工具（`search_endpoints`/`call_api`/`query_data`）+ 内存 SQLite + Black-Scholes，长会话最省上下文
- 亲验无公开托管端点（000/404），必须自建；官方自述 experimental

**别选它：**只要 15 分钟延迟——Starter $29 就够，省 $170。

港美股 · 要盘口深度且要下单

longbridge-terminal CLI 或 富途 OpenD

券商模式（无 API 订阅费）

- 长桥 CLI 官方自述 AI-native，`--format json` + shell completion，覆盖 quotes/depth/brokers/trades，Apache-2.0、949 stars
- 富途 LV2 = 实时逐笔 + 十档 + 经纪队列，覆盖港美 A 日新五市场、13 种订单类型，交易须手动确认 + 交易密码
- 成本模型和数据商完全不同：省掉订阅费，但绑定券商账户与资产门槛（富途订阅额度按资产 100–2000）

**别选它：**没有对应券商账户；或不接受本地常驻网关进程。**港股 LV2 是买的**——免费活动已中止：长桥 ※158 港币/月、富途 ※约 488 港币/月，开通步骤见第 11 节。

A 股 · 财报股东宏观要权威可引用

Tushare MCP（实时另接直连源）；预算足则 iFinD

Tushare ※≈200–500 元 · iFinD ※约 2–2.8 万元/年

- Tushare 亲验 258 工具，覆盖财报、龙虎榜、北向资金、股权质押、Shibor；官方自划分工：Skills 用于临时查数看盘，MCP 用于批量建模
- 积分是分级门槛不消耗——越高频次越高；但官方无公开价目表，※ 为社区口径
- 要授权级准确性与 SLA 才上 iFinD MCP（四模块 20 余项工具，需终端密钥）；Wind 无官方 MCP，单账号 39,800 元/年（2023 报道）

**别选它做盘中：**Tushare 多为日频，实时性不是它的强项。

13 · 可信度

## 亲验台账

2026-07-25（周六休市）实测；**2026-07-27（周一港股盘中）增补**延迟与历史接口实测。行情接口验可用性、鉴权与时间戳精度；MCP 端点验在线状态与真实工具数；价格逐家开官网订阅页核。

| 目标 | 探测 | 结果 | 结论 |
| --- | --- | --- | --- |
| 腾讯 qt.gtimg.cn | GET 不带 Referer | 200，600519＝1297.41，20260724161433；AAPL 16:00:01 | 可用，免 Referer |
| 新浪 hq.sinajs.cn | GET 带/不带 Referer | 带 200（15:34:59＋五档＋盘后 333.80）；不带 403 | 可用，须 Referer |
| 东财 push2 | GET 带/不带 Referer | 带 200（f43=129741、f86 时间戳）；不带失败 | 可用，须 Referer |
| 三源交叉校验 | 同时取 600519 | 1297.410 / 1297.41 / 1297.41 完全一致 | 准确性通过 |
| api.tushare.pro/mcp/ | initialize + tools/list | 200，258 工具；无 token 调用报「需要提供 token」 | 在线 |
| mcp.eodhd.com/v1/mcp | initialize + tools/list | 200，3.4.4，86 工具（官网写 72）；根路径 404 | 在线 |
| 82.156.17.205/cnstock/mcp | initialize + tools/call | 200，3 工具，返回茅台 2026-07-24（即 T+1） | 可用但非实时 |
| mcp.alphavantage.co · mcp.twelvedata.com | initialize | 均 401 | 在线待鉴权 |
| mcp.longbridge.com/mcp | initialize 直连/代理 | 直连 000、代理 401 | 在线，本机需代理 |
| mcp.polygon.io · mcp.massive.com | initialize | 000 / 404 | 必须自建 |
| 港股延迟 · 三源同刻（07-27 盘中） | 同一秒打新浪/腾讯，对 HK 墙钟 | 新浪 rt_hk00700 ts 15:54:58＝墙钟同秒；无前缀档 15:33（差 22 分）；腾讯 15:39:55（滞后 15 分 03 秒） | rt_ 实时已证 |
| 东财 push2his 历史（07-26/27） | GET 全量 + 连续重试 | 200·124KB·最早 2001-08-27；fqt=1 远端负价（−312.47）；连打即全 000（限流） | 可用·有限流与复权坑 |
| 腾讯 hkfqkline 港股历史（07-27） | GET | 200·58KB·320 根，末根为当天 | 可用 |
| Stooq 免费 CSV（07-26） | GET | 返回 JS proof-of-work 反爬页 | 已失效 |
| Yahoo query1 chart（07-26） | GET 带/不带 UA | 不带 UA 429；带浏览器 UA 200，range=max 全历史可取 | 可用·无授权 |
| 价格：Massive / EODHD / Twelve Data / Alpha Vantage / Alpaca / Tiingo / AllTick | 官网订阅页 | 逐档抓到明确数字（Tiingo $0/30、AllTick 免费档 10 次/分·10 演示品种，07-27 增核） | 已核 |
| 价格：Tushare / FMP / Finnhub / 富途行情卡 488 / 长桥行情商店 158·338·46 | 官网页 + 搜索 | 官方无价目表、页面被拦或仅第三方口径；采二手并标 ※，券商两家以 App 行情商店/商城标价为准 | 信息缺口 |
| 价格：Wind / iFinD | 财经媒体报道 | Wind 单账号 39,800 元/年（2023）；iFinD 约其 50–70% | 二手·年份旧 |
| openbb-cli（PyPI） | PyPI JSON | 1.4.2，Python ≥3.10,<4 | 在维护 |

14 · 坑

## 十一个会让「实时准确」落空的地方

坑 1

### 拿 MCP 当实时通道

多数免费 MCP 的上游就是那批公开接口，还多一层缓存包装。要延迟最低就直连或用官方 CLI，MCP 留给财报研报类结构化查询。

坑 2

### 以为 Skills 会带来数据

Skills 只是按需加载的指令与脚本，实时性等于它背后调的通道。装一堆分析 Skills 却连着 T+1 源，结论照样是旧的。

坑 3

### 只看订阅价不看延迟档

Massive Starter $29 与 Developer $79 都还是 15 分钟延迟，实时要跳到 Advanced $199；Alpha Vantage 五档涨价买的是频次不是实时。

坑 4

### 忽略 Referer 与编码

新浪不带 Referer 直接 403；三家返回都是 GBK，不 `iconv` 会乱码；东财字段是代号制且价格×100。

坑 5

### 不复权就做技术分析

除权除息日出现"假跌停"，收益率全错。跨源比价前先对齐复权口径。

坑 6

### 撞限流拿到旧值

超限往往返回空值或缓存值，比报错更危险——用返回的时间戳字段自检。

坑 7

### 工具数当卖点

258 / 148 个工具定义常驻上下文，既烧 token 又提高误选概率。Massive 三工具 + SQL 是相反思路。

坑 8

### 照抄改名前的资料

Polygon.io 已于 2025-10-30 改名 Massive；长桥 Skills v2 从 v1 的 127 个合并为 13 个，老教程的技能名已失效。

坑 9

### 差一个前缀差 20 分钟

新浪同一域名两种档位：`rt_hk00700` 实时、`hk00700` 延迟（盘中亲验差 22 分钟）。抄网上代码片段最容易漏掉 `rt_`，拿延迟价当实时价。

坑 10

### 免费历史管道会腐烂

东财 `fqt=1` 前复权拉长周期出负价（茅台 2001 年 −312，亲验）；Stooq 免费 CSV 已上 PoW 反爬失效；Yahoo 无浏览器 UA 即 429。免费历史链路要定期年检 + 复权口径显式声明。

坑 11

### 中文「横评」常是软文

有评测吹 AllTick"免费 5000 次/日"并推为首选——官方定价页实为免费 10 个演示品种、10 次/分。免费档权益一律以官方 pricing 页为准，横评文章只当线索。

15 · 来源

## 三档分级

### 官方一手（含价格页）

- [Massive 订阅页](https://massive.com/pricing) · [EODHD 订阅页](https://eodhd.com/pricing) · [Twelve Data 订阅页](https://twelvedata.com/pricing) · [Alpha Vantage 订阅页](https://www.alphavantage.co/premium/) · [Alpaca 数据档位](https://alpaca.markets/data) · [Alpaca 免费 vs 付费文档](https://docs.alpaca.markets/us/docs/about-market-data-api) · [Tiingo 订阅页](https://www.tiingo.com/about/pricing) · [AllTick 定价页](https://alltick.co/zh-CN) · [长桥 OpenAPI 文档（接口免费口径）](https://open.longbridge.com/zh-CN/docs)
- [longbridge-terminal（官方 CLI）](https://github.com/longbridge/longbridge-terminal) · [longbridge/skills](https://github.com/longbridge/skills) · [Claude Code 安装指引](https://longbridge.com/zh-CN/academy/ai-investing/blog/how-to-install-longbridge-skill-cli-on-claude-code-100206)
- [富途《权限和限制》](https://openapi.futunn.com/futu-api-doc/intro/authority.html) · [富途《行情卡相关》](https://support.futunn.com/topic56)（两处口径冲突源）· [富途 Agent Hub](https://github.com/FutunnOpen/futu-agent-hub)
- [Tushare MCP 与 Skills 分工](https://tushare.pro/document/1?doc_id=463) · [积分获取（无价目表）](https://tushare.pro/document/1?doc_id=13) · [积分与频次对应表](https://tushare.pro/document/1?doc_id=290)
- [Alpha Vantage MCP](https://github.com/alphavantage/alpha_vantage_mcp) · [Massive MCP](https://github.com/polygon-io/mcp_polygon) · [改名公告](https://massive.com/blog/polygon-is-now-massive) · [EODHD MCP](https://eodhd.com/financial-apis/mcp-server)
- [OpenBB](https://github.com/OpenBB-finance/OpenBB) · [iFinD MCP 上线](https://stock.10jqka.com.cn/20260312/c675239015.shtml) · [FactSet MCP](https://investor.factset.com/news-releases/news-release-details/factset-meets-demand-ai-ready-data-first-announce-mcp-sans) · [Claude for Financial Services](https://www.anthropic.com/news/claude-for-financial-services)

### 亲验（当日实测）

- 腾讯／新浪／东财行情接口：可用性、Referer 要求、时间戳精度、三源交叉校验
- 2026-07-27 港股盘中：新浪 `rt_` 前缀实时 vs 腾讯滞后 15 分 03 秒；东财历史全量/限流/复权负价；腾讯港股 K 线；Stooq 反爬；Yahoo UA/429
- Tushare／EODHD／CnStock／Alpha Vantage／Twelve Data／Longbridge／Massive MCP 端点：`initialize` + `tools/list`（+ 可免鉴权者的 `tools/call`）
- PyPI：`openbb-cli` 1.4.2
- 方法：`curl -X POST` 发 JSON-RPC，Accept 头须含 `text/event-stream`

### 二手 · 已标 ※ 待核

- [Wind 单账号 39,800 元/年（2023 新浪财经）](https://finance.sina.com.cn/wm/2023-09-11/doc-imzmiqth5856632.shtml) · [iFinD 约为 Wind 的 50–70%](https://www.guancha.cn/economy/2024_01_08_721599.shtml)
- [Tushare 积分 2000≈200 元 / 5000≈500 元（社区）](https://www.cnblogs.com/tushare/p/11609070.html)
- [FMP 计划含 MCP 的说法](https://site.financialmodelingprep.com/pricing-plans)（官方文档 403 未核）· Finnhub Premium $11.99–99.99（评测站口径）
- [三大终端厂商集体官宣](https://www.163.com/dy/article/KNVGRIIP05199NPP.html)（东财 Skills 三包，官方入口未核到）· [AKShare 文档](https://akshare.akfamily.xyz/data/stock/stock.html)
- 长桥行情商店 158/338/46 港币（火山引擎社区文）· 富途港股 LV2 约 488 港币/月（talkmoney.com.hk）——均以 App 内标价为准 · 推 AllTick"免费 5000 次/日"的横评与官方定价页矛盾，判为软文

调研 2026-07-25 · 2026-07-27 港股盘中实测增补 + 开通/扣费攻略 · 价格为官网月付价，※ 标记为二手源待核 · 免费公开行情接口无授权无 SLA，生产链路请用券商网关或商业数据源并保留多源交叉校验

© 2026 张拼拼 (Max Pin) · zpplife@gmail.com · 保留所有权利

---

来源：[https://cavno.org/investing/research/stock-data-sources/](https://cavno.org/investing/research/stock-data-sources/)
