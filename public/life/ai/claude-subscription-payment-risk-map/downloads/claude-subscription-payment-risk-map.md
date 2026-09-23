Life & Skills · AI

# Claude 订阅支付风控全链路

从点击付款到自动续费，沿账户、网络、设备、支付服务商、卡组织和发卡行逐层理解一笔订阅为何成功或失败。

[← 返回 AI 栏目](http://127.0.0.1:5509/life/ai/)

CLAUDE SUBSCRIPTIONPAYMENT RISK MAP

Payment Risk / System Anatomy

# 一笔 Claude 订阅，究竟如何被*批准*？

从点击 Pay 到自动续费，系统同时判断两件事：**这个账户是否像正常使用者**，以及**这张卡能否为这笔交易付款**。结果不是由某个 BIN、地址或 IP 单独决定，而是多层风险决策的合成。

*01 / MERCHANT***账户与地区**账户历史 · 登录环境 · 国家/地区

*02 / PSP***支付与反欺诈**卡片 · 地址 · IP · 设备 · 速度

*03 / ISSUER***银行授权**余额 · 权限 · 3DS · 银行风控

*04 / RECURRING***凭证与续费**Token · CIT / MIT · Off-session

**边界说明**本文解释主流订阅支付的公开机制，不提供冒用账单地址、规避地区限制或对抗风控的方法。正常支付应使用发卡机构登记的真实资料。

00 / OVERVIEW

## 不是“美区四件套”，而是一张一致性图谱

“美国账号 + 美国 IP + 美国 BIN + 美国地址 = 一定成功”把高维系统误读成四个布尔开关。真实世界里，账户、网络、设备、卡片、地址和历史会互相验证，也会互相暴露矛盾。

System A · Platform Risk ACCOUNT

### 账户 / 平台层

判断“这个人在这里使用服务是否正常”。它关心账户国家、创建时间、登录历史、IP、设备、多个支付失败以及平台自身的地区与反滥用规则。

System B · Payment Risk PAYMENT

### 支付 / 授权层

判断“这张卡能否为这笔交易付款”。它横跨 PSP 风控、收单行、Visa / Mastercard 等卡组织，以及最终拥有批准权的发卡行。

**网络身份**IP 国家 · ASN · 网络类型 · 代理声誉 · IP 历史

**账户身份**账户地区 · 年龄 · 登录历史 · 设备关系 · 尝试速度

**支付身份**BIN · 发卡国 · Billing Address · AVS · CVV · 3DS

**核心模型：**现代支付风险系统更接近 Consistency + Reputation + History，而不是“某一个字段填对就通过”。

01 / END-TO-END

## 一笔订阅付款的八级链路

Anthropic 并未承诺 Claude Web 永远固定使用某一家支付服务商。下图以 Stripe / Adyen 这类主流 PSP 的公开机制说明一般结构；实际供应商、规则与权重可以变化。

商户 / 平台支付基础设施卡组织 / 银行风险决策

01 / USER

### 点击 Pay

用户发起在场交易，提交卡号、有效期、CVV、账单资料与浏览器会话。

CITON-SESSION

02 / CLAUDE

### 账户与地区层

平台可评估账户地区、账户历史、登录环境、IP 与平台反滥用信号。

ACCOUNTREGION

03 / CHECKOUT

### PSP 收集上下文

整合 BIN、Billing Address、IP、Device、Email / Customer ID 与历史支付。

PSPENRICH

04 / FRAUD

### 反欺诈引擎

Radar / Protect 类系统可能给出 Allow、Review、Require 3DS 或 Block。

ALLOWBLOCK

05 / RAILS

### 收单行与卡组织

授权请求经 Acquirer 进入 Visa / Mastercard 等网络，再路由到发卡行。

NETWORK

06 / ISSUER

### 发卡行授权

检查卡状态、余额、权限、CVV / AVS、跨境、3DS 与银行自身反欺诈模型。

APPROVEDECLINE

07 / POST-AUTH

### 授权后二次判断

即使银行已批准，商户或 PSP 的授权后规则仍可能阻止最终创建订阅。

REVERSEREVIEW

08 / VAULT

### 保存凭证并续费

PSP 保存 PaymentMethod / Token，未来由商户发起 off-session 自动续费。

MITTOKEN

**重要：**“银行批准”只是链路中的一个决策，不等于商户一定接受，也不等于订阅一定创建。

02 / CARD SIGNALS

## BIN、AVS、CVV、3DS：四种完全不同的信号

这四项经常被混为一谈：BIN 描述卡片发行体系；AVS 比对账单资料；CVV 证明付款者掌握安全码；3DS 则由发卡行进行更强的交易认证。

02.1 / BIN & IIN

### “5177 卡段”只能说明一部分发行属性

现代 BIN / IIN 通常不能只凭前四位判断。PSP 可由更完整的卡号前缀获得或推断网络、发卡机构、国家、资金类型与卡产品，并结合历史表现形成风险信号。

| 属性 | 可能的信息 |
| --- | --- |
| Network | Visa / Mastercard |
| Issuer | 银行或发卡机构 |
| Country | 发行国家 / 地区 |
| Funding | Credit / Debit / Prepaid |
| Reputation | 该发行体系的历史风险表现 |

不存在**5177 = Claude 白名单**这样的卡组织标准

02.2 / AVS

### 地址真实存在，不等于与卡片记录匹配

Address Verification System 关注的是你提交的街道 / ZIP 与发卡机构保存的持卡人账单资料是否一致，而不是“地图上有没有这栋房子”。正常支付应使用发卡机构登记或分配给该卡的 Billing Address。

● ISSUER RECORD  
456 Market Street  
San Francisco, CA  
94105

*VS*

● SUBMITTED  
123 Main Street  
Beverly Hills, CA  
90210

即使后者是价值很高、真实存在的住宅，也不能推导出 AVS = PASS。

02.3 / CVV · CVC

### 它证明你知道安全码，不证明整笔交易安全

PAN、有效期与 CVV 正确，可能得到 CVC check pass；CVV 错误则可能 fail。但 CVV 只是授权与风控的一个输入。

CVV PASS  
AVS PASS  
3DS PASS  
ISSUER DECLINE

**CVV PASS ≠ 支付通过。**银行仍可拒绝；银行批准后，商户 / PSP 也仍可拦截。

02.4 / 3D SECURE 2

### 发卡行级别的交易认证

3DS 2 可能表现为短信验证码、银行 App 确认、生物认证或银行网页认证，也可能在后台无感完成。成功 3DS 在特定情形下还可能带来欺诈责任转移。

**Frictionless**

1. 交易与设备数据送达银行
2. 风险较低
3. 后台认证成功

**Challenge**

1. 银行要求进一步验证
2. OTP / App / 生物认证
3. Pass 或 Fail

3DS2 可携带浏览器、设备、IP、金额、货币、商户、账户与认证历史等交易背景。

### A 用户 LOWER CONFLICT

#### BIN / IP

US / US

#### AVS / CVC

Match / Match

#### 3DS

Pass

#### ACCOUNT

老账号、付款历史正常

#### VELOCITY

低

SAME  
BIN

### B 用户 HIGHER CONFLICT

#### BIN / IP

US / 代理网络

#### AVS / CVC

Fail / Match

#### 3DS

未知

#### ACCOUNT

新账号、多张卡失败

#### VELOCITY

短时间多次尝试

**BIN ≠ 支付身份。**相同 BIN 的两个人可以得到完全不同的结果，因为 BIN 只是完整风险图谱中的一个变量。

03 / CONTEXT

## IP、ASN、设备、账户与速度：付款之外的上下文

PSP 与商户的风险层会把一串看似独立的数据连成关系图：哪个网络、哪个设备、哪个账户、哪张卡，在多长时间内尝试了多少次。

03.1 / IP INTELLIGENCE

### 系统看的不是一个“US / 非 US”开关

**IP ADDRESS**原始网络地址与粗粒度国家 / 地区

**ENRICHMENT**城市、网络类型、代理 / 匿名属性

**ASN / REPUTATION**住宅、移动、公司、云机房、VPN 等网络归属

**HISTORY / VELOCITY**关联过多少账户、银行卡与失败尝试

ASN 表示 IP 所属的自治网络。它通常不是卡片授权报文里的一个简单字段，而是商户、PSP 或反滥用服务对 IP 进行情报增强后得到的网络与声誉特征。

**Residential IP ≠ Valid payment identity。**住宅网络最多改变网络身份，不能改变卡 BIN、发卡国、AVS、CVV、3DS、余额、卡片历史或商户规则。

**Device Fingerprint**ENVIRONMENT

回答“大致是不是同一个浏览器 / 设备环境”。它不是一个单一编号，而是一组相关信号。

User-AgentOSBrowserDevice modelCookiesScreen attributesSession IDsPage dwellCopy / pasteField timing

**Card Fingerprint**PAYMENT INSTRUMENT

回答“大致是不是同一张支付卡”。PSP 可将特定卡号映射为稳定标识，用于关系分析与风控。

CARD PAN  
 ↓ tokenized mapping  
card\_fingerprint  
 ↓ relationship graph  
customer / account / device / history

删除并重新添加同一张卡，不必然让支付服务商把它视为一张新卡。

03.2 / ACCOUNT GRAPH

### Email、Account ID 与账户年龄

风险系统可以对比“创建 5 分钟后连续试四张卡”的账户，与“使用两年、有稳定付款历史”的账户。Email、客户参考号、创建时间、电话与历史付款都会改变风险语境。

ACCOUNT A  
age: 5 min  
card #1: decline  
card #2: decline  
card #3: decline

ACCOUNT B  
age: 2 yrs  
regular usage  
previous success  
same instrument

03.3 / VELOCITY

### 为什么不断试卡会让问题更严重

Velocity 指单位时间内某种行为出现多少次。系统可能统计 IP 每小时尝试数、账户每日试卡数、卡关联账户数、设备创建账户数，以及 Email 的失败付款数。

- IP → attempts / hour
- Account → cards tried / day
- Card → accounts used
- Device → account creations
- Email → failed payments

**反复提交不是诊断。**先确认拒绝原因、账单资料与发卡行支持情况。

03.4 / CLAUDE PLATFORM LAYER

### 银行卡通过，与账户不触发地区 / 安全风控，是两件事

Anthropic 的公开说明表明，Claude 会基于 IP 与其他信号推断粗粒度国家 / 地区，用于平台安全、反滥用和功能可用性判断。Web 订阅的 Billing Address 也与支付方式及税费处理相关。因此账户层与银行卡层并非同一个决策系统。

**ACCOUNT**地区 · 历史 · 登录 · 设备

**CLAUDE CHECKOUT**平台规则与支付上下文相遇

**PSP / NETWORK**风控、认证与交易路由

**ISSUER**银行授权或拒绝

PUBLIC GUIDANCE · JUL 2026

### Anthropic 公开拒付说明透露的边界

- 支付方式的 origin country 应处于支持的 Billing Location
- Billing Address 应与发卡银行记录一致
- 地址与支付来源国需满足处理要求
- 被要求时应完成 3DS authentication

BILLING & TAX

### 账单地址还参与订阅与税费处理

Anthropic 针对 Pro / Max 的账单说明表明，Web 订阅的 Billing Address 来自支付方式，适用税费也会依据该地址计算。这进一步说明它不是可随意替换的装饰字段。

**正常路径：**账户地区合法受支持，支付来源受支持，账单资料与发卡机构记录一致。

04 / OWNERSHIP

## 谁主要负责检查什么？

同一个信号可能被多个参与方使用，但用途不同。下表的星级只表示概念上的大致相关程度，不代表 Claude 内部规则，也不是 Stripe、Adyen、卡组织或银行的真实权重。

| 信号 | Anthropic / 商户 | PSP 风控 | Visa / MC | Issuer |
| --- | --- | --- | --- | --- |
| Account region | ★★★ | ★ | — | — |
| Account age / history | ★★★ | ★★ | — | — |
| IP | ★★★ | ★★★ | 少 | ★ |
| ASN / network reputation | ★★★ | ★★★ | — | 间接 |
| Device fingerprint | ★★★ | ★★★ | — | 3DS 可间接获得 |
| BIN | ★ | ★★★ | ★★★ | ★★★ |
| Card country | ★★ | ★★★ | ★★★ | ★★★ |
| Prepaid / debit / credit | ★ | ★★★ | ★★★ | ★★★ |
| Billing country | ★★★ | ★★★ | ★ | ★★ |
| AVS | ★★ | ★★★ | ★★★ | ★★★ |
| CVV | ★ | ★★★ | ★★★ | ★★★ |
| 3DS | ★ | ★★★ | ★★★ | ★★★ |
| Balance / credit | — | — | — | ★★★ |
| Card fraud history | — | ★★★ | ★★ | ★★★ |
| Velocity | ★★★ | ★★★ | ★ | ★★★ |
| Recurring status | ★★ | ★★★ | ★★★ | ★★★ |
| Stored credential / token | ★ | ★★★ | ★★★ | ★★★ |

注：表格用于建立系统心智模型；真实决策取决于商户配置、地区、卡产品、发卡行与交易时点。

05 / AUTHORIZATION

## 到了发卡行，银行到底判断什么？

PSP 风控没有提前拦截时，授权请求经收单行与卡组织到达 Issuer。发卡行拥有对这笔授权的最终批准权，但商户仍拥有是否接受交易的最终业务决定权。

ISSUER DECISION INPUTS

1. 卡是否存在且有效
2. 有效期是否正确
3. CVV / CVC 结果
4. 卡是否被冻结
5. 余额或信用额度
6. Online transaction 权限
7. Recurring transaction 权限
8. International transaction 权限
9. Merchant category / 商户风险
10. 交易币种
11. 交易金额
12. 地理异常
13. 持卡人历史消费模式
14. 3DS 认证结果
15. 银行自身反欺诈模型

ISSUER**APPROVED**银行同意授权，可能在卡上产生一笔 pending 记录。

→

PSP / MERCHANT**POST-AUTH RISK**授权后 CVC / AVS 规则、风险评分或商户策略继续判断。

→

FINAL**BLOCK / REVERSE**订阅没有创建；授权随后撤销或释放，pending 记录可能数日后消失。

**“银行说没有拒绝”与“商户显示 Payment failed”并不矛盾。**授权成功、支付接受与订阅创建，是三个可分离的状态。

06 / RECURRING

## 第一次付款与第二个月续费，是两种交易语境

初次订阅通常由持卡人当场发起，并建立保存凭证关系；下个月的自动续费由商户在用户不在场时发起。Token 让商户无需保存和反复传递明文卡号。

*01 / INPUT***初始卡片资料**PAN、有效期、CVV、Billing Address，必要时进行 3DS。

*02 / CIT***首次在场付款**持卡人在网站点击 Pay，完成授权与商户风险判断。

*03 / VAULT***保存支付凭证**PSP 形成 Customer、PaymentMethod、Token / stored credential。

*04 / MIT***自动续费**商户按预先授权，在 off-session 状态发起下一期收费。

*05 / EXCEPTION***必要时重新认证**银行仍可拒绝并要求客户回到会话中重新完成 authentication。

CIT

### Cardholder-Initiated Transaction

持卡人正在网站或 App 中主动付款。

#### SESSION

On-session

#### TRIGGER

本人点击 Pay

#### INPUTS

卡片、地址、CVV，可能需要 3DS

#### PURPOSE

首次订阅并建立未来收费授权

MIT

### Merchant-Initiated Transaction

商户依据事先授权，在持卡人不在场时自动收费。

#### SESSION

Off-session

#### TRIGGER

订阅周期到期

#### INPUTS

Token / PaymentMethod + MIT indicator + 既有凭证关系

#### PURPOSE

第二个月及之后自动续费

WHY NO CVV EVERY MONTH?

### 正常续费不应每月重新获取 CVV

初始交易建立 Stored Credential Agreement。后续 MIT 使用 Token、交易类型标识与先前凭证关系，不应要求商户反复保存或重新收集安全码。

INITIAL: PAN + EXPIRY + CVV + 3DS  
 ↓  
STORED CREDENTIAL RELATIONSHIP  
 ↓  
RECURRING: TOKEN + MIT INDICATOR

TOKEN ≠ FOREVER

### 首次成功，不等于永久成功

- 余额不足或额度不够
- 卡被冻结、过期或替换
- Issuer 政策或商户风险变化
- 支付授权被撤销
- Recurring 权限不允许
- 银行要求重新 authentication

**Initial payment ✓　Recurring ✕** 是完全可能的正常失败路径。

07 / TROUBLESHOOT

## 支付失败时，正确的排查顺序

排障的目标是定位哪一层拒绝，而不是连续更换 IP、地址或 BIN。每一次重复失败都可能成为新的历史与速度信号。

01

**Billing country 是否受支持**先确认服务地区与支付来源要求。

**行动：**使用服务商允许的真实账户地区与支付地区。

02

**发卡机构是否允许该类交易**Online / International / Recurring。

**行动：**检查卡片设置或联系发卡机构确认权限。

03

**真实 Billing Address**是否为发卡机构登记或分配给该卡的资料。

**行动：**不要使用地图上找到的他人住宅地址。

04

**AVS 结果**Street / ZIP 是 match、fail 还是 unavailable。

**行动：**核对街道格式、邮编与发卡机构记录。

05

**CVV / CVC**安全码是否正确、是否完成校验。

**行动：**重新核对卡面或发卡平台显示的安全码。

06

**3DS**是否弹出挑战、是否在银行端完成。

**行动：**完成银行 App / OTP 认证；失败则联系银行。

07

**余额 / 额度**税费、预授权或小额验证可能使所需余额高于标价。

**行动：**预留合理空间，并确认卡未冻结。

08

**Issuer decline**如 insufficient funds、restricted card、do not honor。

**行动：**以发卡行提供的拒绝原因为准，避免盲目重试。

09

**Merchant / PSP risk decline**银行批准但商户仍显示失败，或授权稍后释放。

**行动：**联系商户支持；不要把 pending 误认成最终扣款。

ADDRESS

### “真实住宅地址”

只证明地址存在，不证明它是这张卡的 Billing Address。AVS 关心的是后者。

BIN

### “换一个卡段”

不能修复余额、卡权限、AVS、3DS、账户历史或商户对预付 / 虚拟卡的限制。

RETRY

### “继续多试几次”

可能把一次可诊断的失败，升级为账户、设备、IP 与卡片的速度异常。

08 / CONCLUSION

## 把订阅风控压缩成一个公式

成功概率由账户、地区、网络、设备、卡片、认证、历史与发卡行决策共同决定。任何声称某一个 BIN 或某一种“干净地址”能保证成功的说法，都忽略了系统最重要的结构。

CONCEPTUAL MODEL

P(支付成功) = f(Account, Region, IP, Device, BIN, Issuer, AVS, CVV, 3DS, History, Velocity, Issuer Decision)

P(成功) = f(5177 BIN)

**BIN ≠ 支付身份**它描述发行体系的一部分，不是商户白名单，也不能替代完整交易上下文。

**真实地址 ≠ AVS Match**地址存在与否不是核心；关键是提交资料是否与发卡机构记录一致。

**住宅 IP ≠ 有效付款人**网络身份只是账户身份与支付身份之外的一层。

**银行批准 ≠ 商户接受**授权后风控仍可拦截、撤销或释放一笔交易。

**首次成功 ≠ 永久续费**MIT 仍可能因余额、卡状态、策略变化或重新认证要求而失败。

**系统判断的是关系**Consistency + Reputation + History，比单字段“正确”更接近真实决策逻辑。

**最后一句：**所谓“神卡段”“干净地址”“美区四件套”，只是把一个高维风控系统过度简化。BIN 的确重要，但 AVS、Issuer、3DS、账户历史、支付历史与交易速度通常同样关键，甚至更关键。

**SCOPE**

基于主流 PSP、卡网络与发卡行公开机制整理的概念性系统图。Anthropic 并未公开其完整内部支付与反滥用规则。

**USE**

用于理解合法订阅支付与正常排障。请使用本人或发卡机构登记的真实账单资料，并遵守服务商条款与适用地区要求。

---

来源：[https://cavno.org/life/ai/claude-subscription-payment-risk-map/](https://cavno.org/life/ai/claude-subscription-payment-risk-map/)
