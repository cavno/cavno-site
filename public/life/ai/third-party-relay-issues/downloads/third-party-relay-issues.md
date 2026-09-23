Life & Skills · AI

# 第三方中转接入 Claude Code：问题全清单

CC Switch 只解决“切换”，不解决“兼容”：从协议字段、工具调用到模型能力，排查 26 项已知故障。

[← 返回 AI 栏目](http://127.0.0.1:5509/life/ai/)

调研日期 2026-08-02 覆盖 26 项已知问题 分类：Tool Use / 功能可用性

一句话结论

**Claude Code 不是一个通用 LLM 客户端，而是深度耦合 Anthropic API 的专用客户端。**它的系统提示词、工具描述、Beta Headers、缓存与思考字段全部按 Claude 模型能力定制。中转站只要在协议上是"子集"，或后端模型不是 Claude，客户端的一整套优化就失效——这是架构耦合的必然结果，不是所谓"官方投毒"。

根因 A

### 协议子集

中转站只实现 `/v1/messages` 的基本字段，对 `thinking`、`cache_control`、Beta Headers、`server_tool_use` 等做 schema 校验后丢弃或直接 400。

根因 B

### 能力探测错位

客户端靠模型名字符串与 Provider 判断能力。第三方模型名匹配不上 `claude-*` 规则，能力检测要么全 false、要么误判为 true，两种都出错。

根因 C

### 模型行为差异

Function Calling 在各家实现差异很大：并行调用、严格 JSON、长参数逐字复现、思考态下能否调工具，都不一致。工具越多，弱模型越容易崩。

故障分层

## 四层故障面，越往下越难自查

上两层报错明确、一次配对就好；下两层通常不报错，只是"感觉变笨了"。

L1 接入层

端点协议选错、Base URL 拼出 `/v1/v1`、model ID 与中转命名不符、shell 里的 `export ANTHROPIC_*` 优先级压过 settings.json 导致"切了没生效"。

404 / 401 / 连不上

L2 协议层

缓存、思考、Beta Headers、effort、流式事件类型、stop\_reason 语义在转换中丢失或被过滤。

静默降级

L3 工具层

tool\_use 结构、并行调用、tool\_use\_id 配对、参数 JSON 严格性、服务端工具缺失。

改文件失败 / 死循环

L4 运营层

限流、掉线、低价分组偷换模型、预充值、代码与对话全量经过第三方服务器。

不可控风险

清单一

## 哪些 Tool Use 会出问题

按失效机制分组，而不是按工具名罗列——同一类机制坏掉，整组工具一起坏。

阻断 · 直接报错或完全不可用 降级 · 能跑但静默变差 摩擦 · 可用但更贵更慢 基本安全

组 1 · 依赖模型逐字精度最高频的失败来源

**Edit**阻断

Edit 做的是**精确字符串替换**：`old_string` 必须与文件内容逐字节一致，不做正则、不做模糊匹配，一个空格或缩进差异就失败。第三方模型在生成长参数时容易"顺手整理"空白、转义引号、把全角标点归一化、丢掉行尾空格。

**症状：**String to replace not found → 模型重试 → 再次失败 → 反复读文件重试，token 烧光却一行没改。这是接第三方模型后最常见的体感"变笨"。

**Write**降级

整文件写入要求模型一次性输出全部内容。中转站的 `max_tokens` 上限往往低于官方（尤其按次计费的分组会隐藏单次输出上限），流式细粒度传参时参数不做 JSON 校验，截断即产生非法 JSON。

**症状：**文件被写成半截 / 结尾缺花括号 / 报 invalid JSON in tool input；`stop_reason` 若被中转统一成 `end_turn`，客户端还会以为"写完了"。

**TodoWrite**降级

参数是对象数组 + 严格枚举（status / activeForm）。对嵌套数组 schema 支持弱的模型经常给错结构或漏字段。

**症状：**校验失败后被丢弃，任务列表不更新；模型失去进度感，长任务中途"忘了自己在干嘛"。

**NotebookEdit**降级

cell\_id + 编辑模式的组合语义复杂，弱模型基本靠猜。

**症状：**插到错误的 cell、覆盖相邻单元格。

组 2 · 结构性缺失（中转端没有这个能力）配置改不好

**WebSearch**阻断

WebSearch 是 **Anthropic 服务端工具**：搜索由 Anthropic 服务器调用搜索引擎完成，客户端只收结果。中转站只做协议转换，没有搜索服务；Bedrock / Vertex 同样不支持。这是判断"你连的是不是官方通道"的最快方法——反代通道只能 Fetch，不能 Search。

**症状：**工具被隐藏，或模型回答"我无法访问实时网络"；部分中转会返回幻觉搜索结果。

**WebFetch**降级

抓取在本机执行，但正文摘要会调用小模型（`claude-haiku-4-5`）。中转站若没有这个 model ID，整条链路直接失败。

**症状：**API Error: model not found；或摘要质量骤降（被路由到不相干的廉价模型）。

**图片 / PDF 输入**阻断

粘贴截图、读取图片走多模态 content block。纯文本中转或非视觉模型不接受该 block。

**症状：**400 invalid content block type，或图片被静默丢弃、模型完全没看到你贴的报错截图。

**工具 schema 扩展字段**降级

`cache_control`、`defer_loading`（工具描述延迟加载）、`eager_input_streaming` 等字段被严格校验的中转直接拒绝或剥离。

**症状：**要么 400 unknown field，要么工具描述全量塞进每次请求，上下文迅速膨胀。

组 3 · 协议转换中丢东西OpenAI ⇄ Anthropic 转换层

**并行工具调用**降级

Claude Code 大量依赖一轮内并发多个 tool\_use（同时读多个文件、并发 Grep）。不少 OpenAI→Anthropic 转换层只透传第一个 tool call。

**症状：**后续调用被丢弃 → 模型以为读过了却没有内容 → 基于空信息编造结论；或退化为串行，速度慢数倍。

**tool\_use\_id 配对**阻断

每个 tool\_result 必须回带对应的 `tool_use_id`。转换过程重写消息时容易错配或丢失，历史一旦不一致就整个会话卡死。

**症状：**API Error 400 · tool\_use ids were found without tool\_result blocks；中断一次后无法恢复，只能 `/rewind` 或重开会话。

**思考态 + 工具调用**阻断

典型如 DeepSeek：进入 Reasoner 模式后底层不支持 function calling，而历史里又必须携带 thinking 块。Claude Code 的高强度思考提示恰好会触发这个模式。

**症状：**只要挂了 MCP 或 WebSearch，一发请求就 400；GLM 一类模型则因能力误判被发送 `thinking: adaptive` 而报错。

**流式事件**降级

缺少 `thinking_delta` / `server_tool_use` / `input_json_delta` 等事件类型。

**症状：**界面长时间空转、工具参数拼不全、"卡在 tool 调用中间"不动。

组 4 · 工具规模压垮弱模型数量问题，不是协议问题

**MCP 工具**降级

MCP 会一次性注入几十个工具定义（名称形如 `mcp__server__tool`）。工具越多，选择空间越大，弱模型选错工具、编造参数的概率显著上升；schema 体积也直接吃掉上下文和成本。

**症状：**调用不存在的工具名、参数张冠李戴、或干脆绕过工具自己"想象"结果。

**Task / 子代理**摩擦

子代理是"再开一个完整会话"，每个子代理自带全套系统提示与工具。第三方模型往往不理解委派语义，自己动手而不派发；无缓存时成本按 N 倍叠加。

**症状：**子代理不干活、返回空结果、或并发把额度瞬间打光。

**Skill / 技能调用**降级

技能本质是长指令遵循。第三方模型对"先读 SKILL.md 再执行"这类元指令的服从度低。

**症状：**技能被无视，或只读了名字就开始瞎编流程。

**Bash / Read / Glob / Grep**基本安全

这几个纯本地执行、参数结构简单，是接第三方模型后仍然稳定的部分。剩下的问题只是模型本身写不写得对命令、会不会读超长输出。

**注意：**Bash 长输出 + 无缓存时，每一轮都要重传全量上下文，成本放大最明显的就是这里。

清单二

## 哪些功能不能用、不可用、不好用

工具之外，客户端本身有一整套依赖官方 API 的能力，接第三方后大多数不会报错，只是悄悄消失。

A · 协议特性（多数静默失效）不报错，只变差

**Prompt Caching**摩擦

官方缓存能把 Claude Code 实际成本降 50–70%。中转不支持 `cache_control` 时，每轮都要重新处理数万 token 的系统提示与工具定义。

**后果：**成本翻数倍、首字延迟明显变长；返回里没有 `cache_read_input_tokens`，客户端的缓存命中监控同时失效。

**Extended Thinking**阻断

思考预算、adaptive thinking、interleaved thinking 都靠专有字段。能力探测还会误判：模型名匹配不上但 Provider 仍被当作 firstParty，于是照发 thinking 字段。

**后果：**要么参数被过滤、深度思考形同虚设，要么直接 400；`ultrathink` 一类用法完全无效。

**Beta Headers**降级

客户端会发十余个实验性 header（如 interleaved-thinking、fine-grained-tool-streaming）。第三方端不认识，静默忽略是好结果，返回错误是坏结果。

**后果：**依赖这些 header 的新特性整体不生效；部分严格中转直接拒绝请求。

**长上下文 / 1M 窗口**降级

中转标称的上下文与实际透传上限常常不一致，逆向与按次计费分组尤其容易隐藏上限，超出部分被服务端悄悄截断。

**后果：**模型"看不见"前面的文件，却不会告诉你；大重构、多文件分析准确率断崖下跌。

**上下文管理 / 自动压缩**降级

服务端上下文清理不可用，只能靠本地 compact，且压缩本身也由第三方模型执行。

**后果：**`/compact` 触发更频繁、摘要质量更差，长会话信息丢失加剧。

**stop\_reason 语义**降级

逆向类通道的 `stop_reason`、流式结束标记常与官方不一致。

**后果：**达到 max\_tokens 被当成正常结束，输出被静默截断而客户端不重试。

B · 客户端功能（界面上就少了东西）看得见的缺失

**用量与成本统计**阻断

`/cost`、状态栏 token 计数、上下文占用百分比全部依赖响应里的 usage 字段。中转返回不全或干脆不返回。

**后果：**数字为 0 或明显失真，无法判断该不该压缩、花了多少钱。

**计划模式 Plan Mode**降级

Plan Mode 会抬高思考预算并依赖 ExitPlanMode 工具的严格流程。思考不可用时退化成普通对话；某些平台还会因思考预算超过输出上限而直接报错。

**后果：**计划质量下降，或模型不调用 ExitPlanMode，卡在计划模式里出不来。

**后台小模型任务**降级

会话标题生成、命令建议、WebFetch 摘要、部分补全都会调用 haiku 级模型。

**后果：**中转缺该 model ID 时后台请求持续 404（日志刷屏），或被路由到廉价模型导致质量下降。

**模型切换 / 自动降级**摩擦

`/model` 列表与官方模型别名绑定；各中转对同一模型的 ID 命名不统一（`claude-sonnet-4-6` vs `anthropic/claude-sonnet-4.6`）。

**后果：**切换后 404 model not found；官方的限额降级策略也不再生效。

**错误恢复与重试**降级

客户端按官方状态码语义重试。中转把上游超时统一成 502/504、把余额不足返回 402、限流返回 429 的时机也各不相同。

**后果：**该重试的不重试、不该重试的疯狂重试，长任务中途整体失败。

**CC Switch 自身：无故障转移**摩擦

同一时刻只有一个 Provider 处于 Active，不支持自动 failover；shell 里手工 export 的 `ANTHROPIC_*` 优先级高于 settings.json。

**后果：**上游挂了要手动切；以及最经典的"切了但没生效"——因为 shell 变量一直在压着。

C · 运营与安全（技术之外的账）影响最长期

**代码与对话外流**阻断级风险

所有请求经中转服务器明文过境，运营方技术上可完整记录对话、代码与密钥。多数中转不公开数据处理政策。

**后果：**等价于对整个代码库做了一次中间人。含生产密钥、客户数据的仓库不应走这条路。

**API Key 明文落盘**风险

CC Switch 与 settings.json 以明文保存 Key，容易被 git commit、截屏、云盘同步带出去。

**缓解：**dotfiles 加 .gitignore、Key 放系统 keychain 或用 shell function 动态注入。

**"降智"与偷换模型**降级

低价分组把请求路由到更小的模型或更低的思考档位，返回的 model 字段照旧。价格越低，掉包概率越高。

**识别：**同一 prompt 在不同分组跑同一套基准任务对比；观察 WebSearch 是否可用可快速区分逆向/反代通道。

**稳定性与账户风险**摩擦

逆向、Kiro、Antigravity 类通道随官方策略调整随时失效；预充值余额掌握在运营方手里；共享账号池被限流或封禁会牵连所有用户。

**后果：**服务中断无 SLA、余额难追回；把官方 Key 交给第三方还可能触发风控。

**版本兼容漂移**降级

Claude Code 迭代很快，新版本引入的新字段/新 Beta 会先于中转适配。社区多次出现"升级后第三方通道工具调用集体报错"。

**缓解：**接第三方时锁定客户端版本，别开自动更新；升级前先在一个小项目里验证工具调用链路。

关于"官方内置中转站黑名单 / 注入信息收集"的说法，目前只见于社区帖子，缺乏可复现的证据，此处仅作存疑记录，不作为结论。可验证的部分是：客户端确实会做 Provider 与模型能力探测，并据此启用或跳过专有字段。

怎么自查

## 五分钟确认你接的通道到底缺什么

按顺序做，每一步的结论决定下一步——这里的编号是真实的执行序列。

### 确认协议端点

Claude Code 只发 `POST /v1/messages`（Anthropic schema）。中转若只有 `/v1/chat/completions`，两者完全不兼容，需要 Router 之类的转换层。

```
curl -s $ANTHROPIC_BASE_URL/v1/messages \
  -H "x-api-key: $KEY" -H "anthropic-version: 2023-06-01" \
  -d '{"model":"你的模型ID","max_tokens":16,"messages":[{"role":"user","content":"hi"}]}'
# 期望：200 且返回体含 content 数组。404 → 检查 BASE_URL 是否已含 /v1（会拼成 /v1/v1）
```

### 核对 model ID

不要照抄官方文档的模型名，以中转实际列表为准，大小写敏感。

```
curl -s $ANTHROPIC_BASE_URL/v1/models -H "x-api-key: $KEY"
```

### 探测专有字段是否透传

分别带上 `thinking` 和 `cache_control` 各发一次，看是被接受、被忽略还是 400。响应 usage 里有没有 `cache_creation_input_tokens` 是缓存能力的直接证据。

### 用一次真实工具调用做验收

在测试仓库里让它读一个文件 → 精确 Edit 一行 → 再 Grep 验证。这条链路同时覆盖并行调用、tool\_use\_id 配对和逐字精度三个高危点。再问一句需要联网的问题，看 WebSearch 是否存在。

### 按探测结果显式关闭不支持的能力

与其让客户端发出会被拒绝或被忽略的字段，不如主动关掉——能减少一大批莫名其妙的 400 和空转。

```
# 仅在上一步确认不支持时才设置；支持的能力不要关
export DISABLE_PROMPT_CACHING=1
export DISABLE_INTERLEAVED_THINKING=1
export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1
# 清掉残留的手工变量，避免 CC Switch "切了没生效"
unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY ANTHROPIC_BASE_URL
```

怎么用才不别扭

## 按任务类型分流，而不是全量替换

### 适合走第三方

单文件问答、写测试、翻译注释、生成样板代码、跑脚本。工具链短、上下文小、不依赖缓存与思考。

### 建议留在官方

跨文件重构、长会话调试、需要子代理与 MCP 的编排、任何依赖精确 Edit 的大改动。这些正好踩在全部高危点上。

### 通道优先级

官转 / Max 池 \> Vertex、Bedrock、Kiro、Antigravity（底层正版，字段有差异）\> 逆向与按次计费（能力因站而异，掉包概率最高）。

### 工程纪律

锁客户端版本；敏感仓库不走中转；Key 不进 git；把中转当成本优化选项而非唯一通道，保留一个可随时切回的官方 Provider。

主要来源

- [CC Switch 接第三方中转踩坑指南：6 类配置问题拆解 — ofox.ai](https://ofox.ai/zh/blog/cc-switch-claude-code-third-party-relay-config-guide/)
- [Claude Code 源码深度解析：对第三方模型的能力探测与功能降级 — CSDN](https://blog.csdn.net/SK600/article/details/159726579)
- [Claude Code 升级现兼容性问题，第三方 API 调用频现报错 — 80aj](https://www.80aj.com/2026/05/30/claude-api-errors-compatibility/)
- [中转站渠道分组：Max / 逆向 / Kiro / 反重力 / 官转 8 类技术来源 — API Ranking](https://apiranking.com/guides/channel-groups)
- [Claude Code 工具参考 · 官方文档](https://code.claude.com/docs/zh-TW/tools-reference)
- [工具使用故障排除 · Claude Platform Docs](https://platform.claude.com/docs/zh-CN/agents-and-tools/tool-use/troubleshooting-tool-use)
- [对逆向中转 API 说"不！" — 腾讯云开发者社区](https://cloud.tencent.com/developer/article/2624427)
- [使用 Claude Code 中转商的风险 — 知乎](https://zhuanlan.zhihu.com/p/1926960843502883825)

---

来源：[https://cavno.org/life/ai/third-party-relay-issues/](https://cavno.org/life/ai/third-party-relay-issues/)
