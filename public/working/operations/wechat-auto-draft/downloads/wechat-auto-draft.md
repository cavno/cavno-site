# 公众号文章自动配图与草稿箱全链路

Working · Operations

# 从内容到公众号草稿箱，拆成一条可复用的自动化链路。

把写稿、排版、封面与正文配图、素材上传和草稿接口逐层拆开，并标清账号资质、平台限制与人工确认的边界。

[← 返回运营栏目](http://127.0.0.1:5509/working/operations/)

4

道接口闸门：access\_token · 正文图 · 封面素材 · 新增草稿

2

条技术路线：官方 API（无人值守）/ 浏览器 RPA（人需在场）

1

道硬门槛：**发布**接口「仅认证」，企业主体 + 已认证才放行

≤1MB

正文图走 API 的硬上限；封面永久素材 ≤10M；webp 不可上传

01

## 结论先行

先给判断，再展开。这条链路最大的认知陷阱是把它当成"把一段 HTML POST 上去"——真正的难点在闸门与资质，不在写稿。

可行性

### 技术成立，轮子齐全

官方服务端 API 支持"自动写稿 + 自动配图 + 写入草稿箱"。Python 侧 `wechatpy` 已封装草稿 / 素材 / 正文图全套接口；全链路成品（wewrite / AIWriteX）也已开源。不需要买任何"AI 写作课"。

承重结论 · 已亲核官方原文

### 硬门槛在「发布」，不在「草稿」

官方文档：`draft/add`（新增草稿）公众号 / 服务号都 ✔；`freepublish/submit`（发布）公众号 仅认证。**个人主体订阅号无法微信认证 → 无法用 API 发布。**想跑"草稿→发布"全自动，账号必须企业主体 + 已认证。

架构原则

### LLM 出结构化中间稿，不出 HTML

让 LLM 产出干净 Markdown / JSON 中间稿，把"转微信行内样式 HTML"交给确定性工具（doocs/md、juice）。LLM 不熟微信白名单，手搓 HTML 必然样式失效。生成与排版解耦。

默认策略

### 只写草稿，不自动发布

自动化默认止步于"写入草稿箱"，发布保留人工确认。既规避发布接口的认证门槛与内容合规风险，也给人留一道把关闸——这也是所有认真项目的共识（human-in-the-loop）。

#### 一句话落地路径

LLM 用 **CO-STAR 框架 + 防注水硬约束**产出干净 Markdown → 排版交 **doocs/md / juice** 内联成微信 HTML → 配图走 **AI 出底图 + Pillow 叠中文字** → 正文图换微信图床 URL、封面传永久素材 → 调 `draft/add` 进草稿箱 → 人工点发布。全程不需要买课。

02

## 全景架构与数据流

六步流水线。每一步都可独立重试——失败时不必从头再来，这也是"输出结构化中间稿"的价值。

![文章图示 1](https://cavno.org/working/operations/wechat-auto-draft/downloads/assets/wechat-auto-draft-visual-001.png)

#### 推荐中间稿结构（JSON）

```
// LLM 只产出数据，不碰接口、不拼 HTML
{
  "title_candidates": ["标题1", "标题2", …],
  "selected_title": "…",          // ≤32字
  "author": "…",                   // ≤16字
  "digest": "…",                   // ≤128字
  "sections": [ {heading, body_md}, … ],
  "cover_prompt": "…",
  "inline_image_prompts": [ … ],
  "fact_claims": [ {claim, source} ],  // 供核查
  "source_links": [ … ],
  "risk_flags": [ … ]
}
```

把事实核查、字段裁剪、生图、HTML 渲染、API 调用拆开，任一步失败可单独重试。

#### 为什么分六步而非一步

- **字段约束前置**：标题超 32 字、正文超限，最后才被接口拒会浪费模型与生图成本——在写稿阶段就裁。
- **图片是独立子系统**：封面走"永久素材"、正文图走"图文消息内图片"，两条不同接口、不同限制，必须分开处理。
- **渲染必须确定性**：微信 HTML 白名单严格，交给工具而非 LLM。
- **发布留人工闸**：内容可信 / 版权 / 合规需要人最终把关。

03

## 两条技术路线

"怎么把内容送进草稿箱"只有两条路。它们贯穿后面所有工具选型——先认清自己走哪条。

路线 A

### 官方 API

走微信开放的服务端接口 `media/uploadimg` + `material/add_material` + `draft/add`。

- **合规**，可服务端无人值守、定时跑。
- 要求**认证账号**（发布环节必须企业主体已认证）。
- 要求配 **IP 白名单**——动态出口 IP 是多数 SaaS 做不到真无人值守的根因。

**适合**：有认证企业 / 组织号、想稳定自动化的团队。

路线 B

### 浏览器会话 / RPA

浏览器插件 / 自动化复用你已登录后台的 cookie，直调 mp 后台**内部 Web 接口**。

- **绕开**认证资质与 IP 白名单。
- **人必须在浏览器前**，cookie 过期需重新扫码。
- 违反《微信软件许可及服务协议》"自动化操作"条款，有封号与司法风险（见 §13）。

**适合**：个人订阅号、低频自用、只存草稿后人工确认。**不适合**商用 / 高频 / 多账号 / 代客发布。

04

## 账号资质硬门槛 已亲核官方原文

整份报告最承重的事实。我用 Googlebot UA 抓取官方页（普通请求被反爬挡 503），逐字核对了"适用范围"表。

| 接口 | 作用 | 公众号(订阅号) | 服务号 | 认证要求 |
| --- | --- | --- | --- | --- |
| draft/add | 新增草稿 | ✔ 可调 | ✔ 可调 | 文档层面未限"仅认证" |
| material/add_material | 上传永久素材（封面） | ✔ 可调 | ✔ 可调 | 无 |
| media/uploadimg | 上传正文图 | ✔ 可调 | ✔ 可调 | 无 |
| freepublish/submit | 发布 | 仅认证 | ✔ 可调 | 企业主体已认证才放行 |

#### 官方原文（freepublish/submit · §7 适用范围）

"本接口在不同账号类型下的可调用情况：公众号 服务号 — **仅认证** ✔。"

"**仅认证：表示仅允许企业主体已认证账号调用，未认证或不支持认证的账号无法调用。**"

#### 这意味着什么

- **只写草稿**：门槛低，官方标公众号 / 服务号都 ✔。
- **草稿→发布全自动**：卡在发布接口，**账号必须企业主体 + 已微信认证**。
- 个人主体订阅号**无法微信认证** → 落入"不支持认证的账号" → 无法用 API 发布。

#### 口径冲突（诚实标注）

官方"适用范围"表把 `draft/add` 标 ✔，但微信开放社区有大量实测反馈：**未认证 / 个人订阅号调 draft/add 也返回 `48001 api unauthorized`**。

两者不一致 → **以目标账号实际调用返回码为准**。有账号就先实调一次定论，别只信文档表格。

05

## 草稿箱链路：四道闸门

把一段 HTML 送进草稿箱，至少要过四个接口。顺序不能错——正文图和封面必须先上传换成微信自家资源。

### access\_token

`cgi-bin/token`(GET) / `cgi-bin/stable_token`(POST)

- 有效期 **7200s**，需缓存。
- 新项目用 **stable\_token**（官方推荐，平台侧缓存，50万次/天）。
- 必配 **IP 白名单**，否则 `40164`。

### 正文图

`cgi-bin/media/uploadimg`

- 返回 **mmbiz.qpic.cn** 微信图床 URL。
- 仅 **jpg/png，\<1MB**；不占素材配额。
- 正文 `<img>` 必须用它，**外链会被过滤**。

### 封面素材

`cgi-bin/material/add_material?type=image`

- 上传**永久**图片素材，返回 `media_id`。
- image：bmp/png/jpeg/jpg/gif，**≤10M**。
- 该 media\_id 即填进 `thumb_media_id`。

### 新增草稿

`cgi-bin/draft/add`

- POST `articles` 数组，返回草稿 `media_id`。
- content 支持 HTML、**去 JS**、外链图被过滤。
- 草稿可在公众平台官网草稿箱查看 / 管理。

#### 两段图片接口别混 — 这是 RPA / 新手最容易卡的环节

**正文插图**走 `media/uploadimg`（换图床 URL，不占配额）；**封面**走 `material/add_material`（永久素材，拿 media\_id 当 thumb）。两者格式 / 大小 / 返回值都不同。正文里任何外链图片都会被微信草稿接口直接过滤掉，且微信端对非微信域名图片有 Referer 防盗链屏蔽。

补充：草稿发布走 `freepublish/submit`（异步，仅返回任务提交成功，最终结果靠 `PUBLISHJOBFINISH` 事件回调）——但本方案默认止步草稿，发布交人工。

06

## 字段与限制速查

`draft/add` 的 articles\[\] 字段（同页亲核）。在写稿阶段就做约束，别等末端被拒。

| 字段 | 必填 | 限制 / 说明 |
| --- | --- | --- |
| article_type | 否 | news 图文消息（默认）/ newspic 图片消息（小绿书，最多 20 图） |
| title | 是 | 标题，≤32 个字 |
| author | 否 | 作者，≤16 个字 |
| digest | 否 | 摘要，≤128 个字；仅单图文有，不填默认抓正文前 54 字 |
| content | 是 | 正文 HTML，<2 万字符、<1M；去 JS；图片 url 必须来自 uploadimg，外部 url 被过滤 |
| content_source_url | 否 | "阅读原文"链接，≤1KB |
| thumb_media_id | news 必填 | 封面，必须是永久 MediaID |
| need_open_comment / only_fans_can_comment | 否 | 评论开关 / 仅粉丝可评，0 否 1 是 |
| pic_crop_235_1 / pic_crop_1_1 | 否 | 封面 2.35:1 / 1:1 裁剪坐标 |

⚠ 官方同句出现"content 大小不可超过 2kb"与"少于 2 万字符 / 小于 1M"自相矛盾——按 2 万字符 / 1M 写为安全上界，别贴近 2kb 边界。常见错误码：`40164` IP 白名单 · `48001` 接口未授权 · `40007` 无效 media\_id · `40001` token 无效 · `45009` 超日调用上限。

07

## 内容自动撰写

用户核心诉求是"基于素材改写"而非"空洞扩写"。模板是骨架，防注水约束才是从"能写"到"不水"的关键。

Prompt 框架

### CO-STAR（长文首选）

```
Context   素材是什么 / 写给谁 / 发公众号
Objective 把素材改写成一篇公众号文章
Style     模仿谁 / 什么文风
Tone      正式 / 幽默 / 共情
Audience  目标读者画像
Response  标题+导语+小标题正文+CTA
```

把"风格 / 语气 / 受众"显式拆开——正是公众号成败的包装层。求快可用更轻的 RTGO（Role/Task/Goal/Objective）。

关键 · 防注水 5 条硬约束

### 写进 Objective 才有效

- **限定信息源**：只用所给素材，不引外部知识 / 训练记忆。
- **不足留白**：资料不够直接标注，禁止脑补。
- **逐句溯源**：关键结论引用素材原句。
- **拒套话**：用具体数据 / 案例替代泛泛，删过渡句与形容词堆砌。
- **改写非扩写**：只重组提炼，宁短勿为凑字数注水。

#### 文章结构

标题(15-30字、含情绪词) → **3 秒钩子**开头 → 小标题正文（每~300字一钩子，移动端每段≤3行）→ **PREP / SCQA** 论证骨架 → 开放式 CTA 结尾。

#### 字数

**800–2000 字**"最佳完读"区间，阅读 3–5 分钟。（注：该数字溯源到排版工具营销页，方向可信、别当硬科学）

#### 铁律

**不要让 LLM 手搓微信 HTML。**它不熟微信白名单，易用 class/position/@media 导致样式全失效。让它只出 Markdown。

08

## 公众号排版真相

把 Markdown 变成"公众号能正确显示"的 HTML，本质是**把样式逐条内联到每个标签的 style 属性**。这是整个赛道的底层方案。

### 微信正文 HTML 白名单

- **不支持** `<style>` 标签 / 外部 CSS；`class` 失效、`id` 被删除。
- **只认行内** `style`，且仅部分属性：font / color / margin / padding / line-height / text-align / border / background-color 等。
- **失效**：`position`、`@media`、`@keyframes`、`%` 单位、`float`。
- 图片必须用微信素材库链接，外链 / Base64 不显示。

### doocs/md 的内联机制 核到源码

GitHub **12.9k★** 的微信 Markdown 编辑器。网上多说"用 juice 内联"——方向对、定位不准：

- 核心渲染器输出 **class + 部分行内 style**。
- 主题系统把 `var(--xxx)` 解析成实际值。
- **复制时**由打过补丁的 `juice@12.1.1` 把 CSS 全部 flatten 进 style 属性 → 粘进微信（剥 style/class/id）后样式存活。

| 工具 | 形态 | 机制 / 定位 |
| --- | --- | --- |
| doocs/md · 12.9k★ | 在线 / 开源核心包 | Markdown→公众号 HTML，patched juice 内联；在线版 md.openwrite.cn |
| juice（Automattic） | JS 库 | 通用 CSS 内联器，整个赛道的标准底层 |
| mdnice（墨滴） | 在线编辑器 | 多主题、免费图床，兼容公众号 / 知乎 / 掘金 |
| md2wechat-skill · 2.9k★ | Go CLI / AI Skill | 面向 Agent：写作→去AI痕→排版→配图→推草稿，48 主题 |
| 秀米 / 135 / 壹伴 | 可视化编辑器 | 本质同样是行内样式内联，靠拖拽模板而非写 MD |

09

## 自动配图与封面

配图拆"封面"和"正文插图"两类。封面要把标题文字嵌进图——这是模型选型与工程路线的关键决策点。

### 封面规格

900 × 383

大图 · **2.35:1**（高清 1800×766）

200 × 200

小图 · 1:1（次条）

500 × 500

分享缩略图 · 系统从大图**中心截**

核心信息（标题 / logo）放**中央安全区**，避免被缩略图裁掉。正文配图宽 900px（常规）/ 1080px（要清晰）。尺寸来自多个排版工具帮助文档交叉，非单一官方数字文档。

### 配图 pipeline（6 步，每步有坑）

- **分段**，把"配几张"显式参数化。
- LLM 把全文**压成 3–5 句画面描述**再喂出图模型（别把正文直接当 prompt → 物体堆砌）。
- 出图 → **裁剪 / 缩放 / 压缩**到目标比例与阈值。
- 发布前**安全审核**：微信明确点名避开名人 / 知名 IP。
- 插回：正文图换微信 URL，封面传永久素材 media\_id。

风格一致性：固定 style reference 图 \> 复用 seed + 固定构图 \> 纯文字风格后缀。

### 文生图模型横评（中文字渲染视角，2026-06）

| 模型 / API | 中文字渲染 | 价格(USD/张) | 适合 / 短板 |
| --- | --- | --- | --- |
| Nano Banana Pro gemini-3-pro-image | 最强 ~90-97% 可读 | 1K/2K $0.134 | 海报 / 信息图 / 4K；最贵、慢、带 SynthID 水印 |
| Seedream 4.x doubao-seedream-4-* | 国风中文审美，原生双语 | ¥0.2–0.3（个人可调） | 写实 / 国风 / 4K 秒级；长文书法仍出错别字 |
| gpt-image-2 | 短标题基本无错别字，官方不背书 | 1024² $0.053 / 4K ~$0.41 | 文字 + 复杂版式、images.edit 强；密集小字仍瑕疵 |
| FLUX.2 [pro] | 复杂中文明显失败 | from $0.03/MP | 照片级写实、英文 in-image 强；中文弱 |
| SD 3.5 | CJK 乱码 | $0.035–0.065 | 开源自部署 + LoRA 生态；需 GPU |
| Midjourney V8 | 中文弱，需后期叠字 | 订阅 $10–120/月 | 顶级美学；无官方 API = 自动化硬伤 |

第一梯队（中文）：**Seedream**（国内便宜、个人可调）与 **Nano Banana Pro**（海外最强中文 + 4K），路线不同。中文渲染百分比是第三方评测，非厂商保证值。所有海外模型输出带 SynthID / C2PA 水印。

带字封面 · 核心决策

### 批量生产走"AI 出底图 + 程序叠字"

**路线 A（AI 直接出字）**：2026 年中文从"不可用"到"单张可用"，但准确率非 100%、长 / 密文本掉字、重抽会变样——不适合"标题一字不差 + 批量"。

**路线 B（推荐）**：AI 出无字底图，Python/Pillow 叠校对过的中文标题——零乱码、完全可控、可复现批量、零额外费。这也是 OpenAI 官方社区给的工作流。

#### Pillow 叠中文字 · 两个必避的坑

```
# 1. 必须显式加载中文字体，否则豆腐块 □□□
font = ImageFont.truetype(
  "C:/Windows/Fonts/msyh.ttc", 72)
# 2. 用 textlength 折行 + anchor='mm' 居中
draw.multiline_text((W/2, H/2), text,
  font=font, fill="white", anchor="mm",
  stroke_width=3, stroke_fill="black")  # 白字黑边压任何底图
```

`font.getsize()` 在 Pillow 10+ 已删除；Linux 部署须装中文字体 + 绝对路径 + `fc-list` 验证。本工作台已有 `poster-toolkit` skill 与 `gen_cover_poster.py` 可复用。

**图库替代**：Unsplash（必署名 + 写入文章那刻异步回调 download\_location）· Pexels（`locale=zh-CN` 最省事）· Pixabay（唯一零署名，但第三方上传版权风险转嫁使用者）。三家共同红线：禁止做成"在线图库 / 可批量导出"的检索器；含可识别人脸 / 商标的图须人工复核。

10

## 图片后处理

出图模型只出固定尺寸，必须自己裁到目标比例 + 压到平台阈值。手册口径冲突，自动化按 API 硬限走。

| 项 | 值 |
| --- | --- |
| 正文图（走 API） | jpg/png，<1MB |
| 正文图（网页编辑器） | ≤10MB（2020 起） |
| 封面永久素材 | ≤10M，bmp/png/jpeg/jpg/gif |
| webp | 不可上传 |
| 压缩阈值 | 宽 >1080 微信会二次有损压；自己先压到 1080 |

自动化走 API → 正文图按 **\<1MB** 设硬目标；封面按 10M。产物绝不产 webp。

#### 关键代码（Pillow）

```
# 居中裁到 2.35:1 封面（一行，不变形）
from PIL import Image, ImageOps
cover = ImageOps.fit(im, (900, 383),
                     centering=(.5, .5))
cover.save("cover.jpg", quality=88,
           optimize=True)

# 压到指定 KB：循环降 quality（仅 JPG）
# 更优：JPG 用 mozjpeg、PNG 用 pngquant+oxipng
```

格式选择：照片→JPG，图标 / 文字 / 透明→PNG，动图→GIF，webp 不用于上传。

11

## 现成工具与开源全景

star 为 2026-06-20 实测值。命名相似 ≠ 同功能，下表已标准确 owner/repo。

### 低代码 / 工作流平台

| 平台 | 进草稿箱 | 门槛 |
| --- | --- | --- |
| Coze 国内版（扣子） | 官方【微信公众号 API】插件：get_access_token→add_material→add_draft | 云托管免操心 IP，最省配置 |
| Dify | Marketplace 原生插件 Create Drafts（选 xwang152-jack，别选 bikeread 那个纯客服） | 插件文档明写"需账号已认证" |
| n8n | 社区节点 / HTTP Request 直调；自带 token 缓存 | 自托管最灵活，要自配 IP 白名单 |
| Make | 原生 Verified 模块 "Create Drafts"（官方维护） | 海外服务，需考虑访问 api.weixin.qq.com 可达性 |

### 开源 SDK / 全链路项目

| 项目 | star | 能力 |
| --- | --- | --- |
| wechatpy（Python） | 4292 | draft + material + uploadimg + freepublish 全有，Python 侧最稳底座 |
| werobot（Python） | 4661 | 被动消息框架，无 draft 方法，发草稿不能直接满足 |
| wewrite | 2463 | Claude Code Skill：AI 写正文 + 配图 + 官方 API 进草稿，全链路 |
| AIWriteX | ~1200 | 独立桌面应用：热搜选题→写→配图→可选自动发布；README 诚实标认证门槛 |
| jiji262/wechat-publisher | 102 | 全网搜→深度文→6-10 图→官方 API 进草稿（注意另有同名 JS 停更版） |
| Node.js 库 | — | 无活跃且覆盖新版 draft 的库，相对 Python 的真实短板 |

#### 第三方编辑器有开放 API 吗？

**没有一个**对第三方开发者开放"程序化把 HTML 推到任意公众号草稿箱"。壹伴 / 365 是浏览器插件挂后台；135 / 秀米的"开发者接口"方向相反（把编辑器嵌进你的系统 / 把内容 POST 到你的 CMS），**不是**推进微信草稿箱。唯一真正程序化进草稿箱的是微信官方 `draft/add`。

#### RPA：Wechatsync · 5793★

Chrome 扩展，读已登录后台 cookie 直调内部 Web API，**绕开认证与 IP 白名单**，默认只存草稿 + 人工确认。难点：后台编辑器是 iframe 内 UEditor，样式必须内联、图片必须先传素材库。**违反自动化条款**，限个人低频自用。

#### SaaS 成品：真·无人值守的诚实产品没找到

有一云AI / 壹伴 / 135 / 快编AI 能"AI 写 + 配图 + 一键进草稿箱"，但多数靠**浏览器插件挂后台（需人在场）**，不是服务端无人值守。商业 SaaS 官网几乎都**不提**认证门槛与 IP 白名单，让人误以为任意个人号都能全自动发布。反而开源项目（AIWriteX）最坦白。

12

## 落地建议 — 按你的情况选路径

先认清账号资质和"要不要无人值守"，路径自然清晰。

| 你的情况 | 推荐路径 |
| --- | --- |
| 有认证企业 / 组织号 + 想服务端无人值守 | 官方 API 路线：Coze 国内版插件 / Dify(xwang152-jack) / AIWriteX 自部署，配好 IP 白名单 |
| 在 Claude Code 工作流里、要全链路成品 | wewrite（Skill）或 jiji262/wechat-publisher |
| 自己拼、要最稳的 Python 底座 | wechatpy（draft+material+uploadimg 全有）+ 上层自接 AI 写作 |
| 只有个人订阅号、低频自用、能人工点一下 | Wechatsync（5793★ 插件）——但清楚它违反协议、限个人低频、只存草稿 |
| 想最少配置、不碰代码 | 135 编辑器 / 有一云AI（接受"插件 + 人在场"） |

#### 建议落地顺序（先跑通再加料）

**阶段一** 只发纯文字草稿（打通 token + draft/add） **阶段二** 接正文图（uploadimg 换 URL） **阶段三** 接封面图（永久素材 + 叠字） **阶段四** 选题 / 写作 / 审稿做厚

13

## 风险与红线

主要风险不在"能不能调接口"，而在合规、内容可信、版权与凭据安全。

合规

#### RPA 踩协议红线

浏览器自动化确定违反《微信软件许可及服务协议》"自动化操作"条款；有群控外挂类司法赔偿判例。低频自用风险低，商用 / 高频 / 多账号显著上升。

割韭菜

#### "AI 一键写爆款日赚上千"

大量"学员月入两万"案例被官媒（中新网）查实为**伪造 / 盗用截图**；几百上千元"AI 写作课"核心是拉人头分销。同等能力已大量开源，**无需买课**。

内容

#### 事实可信 + 去 AI 味

事实结论必须带来源、生成后做 claim check。"去 AI 味"被普遍当必备步骤，但**有效性无客观验证**，归为行业惯例、效果存疑。

版权

#### 配图版权 / 名人 IP

含可识别人脸 / 商标 / logo 的图三家图库都要人工复核；微信明确点名生图避开名人 / 知名 IP。

凭据

#### token 只在服务端

AppSecret / access\_token 只在服务端读取，不进前端、不进笔记、不进日志。IP 白名单换服务器记得同步更新。

渲染

#### HTML 末端被拒

本地先渲染微信安全 HTML（无 JS、无外链图、无超限样式），字段约束在写稿阶段做，避免末端被接口拒掉浪费成本。

14

## 诚实边界 · 待核实

承重结论（账号门槛、四闸门链路）已亲核官方原文；以下为本轮未能定论或存在口径冲突的项。

#### 已亲自验证

- draft/add 适用范围 公众号✔ / 服务号✔（官方原文）。
- freepublish/submit 公众号「仅认证」（官方原文逐字）。
- articles\[\] 字段与限制（同页核对）。
- 官方页快照存 `sources/wechat-verify/` 与前序 `sources/wechat-auto-draft/`，双重留底。

#### 待核实 / 口径冲突

- draft/add 对未认证账号是否真返回 48001（官方✔ vs 社区实测冲突）→ 以实调为准。
- content "2kb vs 2 万字符"官方自相矛盾。
- 普通 token "2000 次/天"现行确切值（stable\_token 是 50 万/天）。
- 封面 900×383 来自排版工具交叉，非单一官方数字文档。
- 中文渲染百分比是第三方评测，非厂商保证值。

方法说明：微信开放文档（developers.weixin.qq.com）对 WebFetch / 普通 curl 持续返回 503（反爬 SPA），须用 Googlebot UA + 绕过本地代理才取到服务端渲染正文——调研时别把 503 误判为"页面不存在"。

＊

## 资料来源

官方文档为权威源，已亲核；开源项目均给准确 owner/repo。

#### 微信官方（已亲核）

- 新增草稿 draft/add
- 发布 freepublish/submit
- 获取接口调用凭据 token / stable\_token
- 上传永久素材 add\_material
- 上传图文消息内图片 uploadimg
- 全局返回码 errCode

#### 排版 / 开源 SDK

- github.com/doocs/md
- github.com/Automattic/juice
- github.com/wechatpy/wechatpy
- github.com/oaker-io/wewrite
- github.com/iniwap/AIWriteX
- github.com/wechatsync/Wechatsync

#### 内容方法论 / 配图

- CO-STAR 框架（GPT-4 提示工程大赛）
- woshipm / 数英：防注水 · 爆款标题
- Gemini / OpenAI Images / Seedream 文档
- python-pillow（ImageOps.fit / 中文字体）
- Coze / Dify / Make 公众号集成教程
- 中新网：AI 写作课割韭菜报道

本轮调研笔记与官方快照：`research/notes/wechat-auto-draft/`、`research/sources/wechat-verify/`。前序工程版报告：`outputs/2026-06-20-wechat-auto-draft.html`。

调研方法遵循 audit-verification 四步纪律：agent 报告作线索，承重结论（账号资质门槛、接口链路）由本人用 Googlebot UA 抓取官方页逐字核实，并与前序官方快照交叉印证。外部对照（模型 / 工具）采"路线不同、各适场景"措辞，不做吹捧化结论。

© 2026 张拼拼 (Max Pin) · 保留所有权利

---

来源：[https://cavno.org/working/operations/wechat-auto-draft/](https://cavno.org/working/operations/wechat-auto-draft/)
