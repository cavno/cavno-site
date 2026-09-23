# AI 顶层设计图谱｜五种系统哲学

Life & Skills · AI

# AI 顶层设计图谱

真正值得比较的不是参数量或模型榜单，而是智能系统如何被约束、怎样判断、谁拥有控制权、遇到未知时如何泛化，以及安全责任落在哪一层。

[← 返回 AI 栏目](http://127.0.0.1:5509/life/ai/)

01 · THE REAL QUESTIONBEYOND MODEL SIZE

## 顶层设计决定的，是*智能如何被组织*

真正应该比较的不是“谁的模型更强”，而是每家公司把规范、判断、控制、反馈、泛化与禁区放在哪一层解决。

SYSTEM MODEL`S = (G, R, H, F, A, B)`

一个 AI 系统的顶层设计，可以压缩为六个相互制约的变量。

G

**Goal**系统为什么行动？

R

**Rules / Principles**依据什么行动？

H

**Hierarchy**指令冲突时听谁的？

F

**Feedback**判断错了怎么修？

A

**Adaptation**新情境中如何泛化？

B

**Boundary**哪些事绝不能做？

> TOP-LEVEL DESIGN
>
> 为什么行动 → 依据什么 → 听谁的 → 错了怎么修 → 未知中如何判断 → 边界在哪里

**阅读基线：**页面只整理附件对各家公开材料的描述。公开文档的性质、完整度与更新时间不同；未公开对应层级的完整治理文档，不等于不存在内部治理体系。

02 · FIVE PHILOSOPHIESNOT THE SAME SYSTEM LAYER

## 五家公司，并不在设计同一种系统

把五家强行排成一条高低顺序会误导分析。它们公开材料所突出的问题，分别落在价值、权限、风险、效率和行动五个不同方向。

AVALUES

### Anthropic

**原则内化型认知系统**

系统内部如何从一般原则生成具体判断？

OAUTHORITY

### OpenAI

**分层权限型控制系统**

复杂指令冲突时，谁拥有最终控制权？

GRISK

### Google

**实验室风险治理系统**

能力跨过危险阈值时，怎样评估与制动？

DEFFICIENCY

### DeepSeek

**高效开放智能引擎**

单位计算资源可以产生多少智能能力？

KAGENCY

### Kimi

**行动导向型智能体系统**

智能怎样从“回答”进化为“完成任务”？

ANALYSIS RULE

比较时先确认“控制点在哪一层”，再比较具体机制；否则容易把模型规范、平台权限、实验室治理、计算架构和智能体能力混成同一指标。

03 · CONTROL CENTERSSELECT A SYSTEM

## 切换五个控制中心，看系统如何作出决定

同一个“安全与可控”目标，可以通过不同控制点实现：原则、权限、能力阈值、优化目标或任务执行回路。

CONTROL = VALUES

### 原则内化

**认知宪法**

`Principle → Reasoning → Action`

附件把 Constitutional AI 的关键抽象为：不穷举所有情境，而是让模型理解原则背后的理由，并把判断推广到新状态。

#### 机制

生成规则的规则系统

#### 目标

Generalized Judgment

可使用方向键切换公司；页面不会发送任何数据。

04 · CONTROL LOCATIONMODEL / PLATFORM / LAB

## 三个闭源体系，把控制点放在三个层级

Anthropic、OpenAI 与 Google 的公开文件并不是三个同层方案。它们分别控制模型怎样判断、平台怎样分配权力，以及实验室何时必须制动。

03 · CIVILIZATION / LAB

### Google

**能力风险治理**

控制对象是实验室与模型能力阈值。

`Capability → Threshold → Mitigation`

02 · PLATFORM / INSTRUCTION

### OpenAI

**权限与冲突解决**

控制对象是模型、工具、开发者和用户组成的平台网络。

`Authority → Priority → Action`

01 · MODEL / COGNITION

### Anthropic

**原则与判断泛化**

控制对象是模型内部的价值解释与具体判断。

`Principle → Judgment → Action`

ANTHROPIC ASKS

### 模型应该怎样判断？

把复杂性从规则数量转移到价值解释与原则冲突。

`Action = f(Context, Principles)`

OPENAI ASKS

### 谁有权决定行为？

把复杂性组织成可操作、可配置但有根边界的权限拓扑。

`Action = arg max Priority(Ii)`

05 · SYSTEM BOUNDARYRESPONSIBILITY MOVES

## 开放权重改变的，是安全责任的系统边界

“开放还是闭源”不只是分发方式。模型能否离开原厂控制环境，会改变平台、部署者与下游治理之间的责任分配。

CLOSED SERVICE

### 模型与平台不可分离

`Safety = Model + Platform + Policy + Monitoring`

厂商能够把模型、权限、策略、工具和监控放在同一个受控环境中。

- 控制边界更集中
- 持续策略更新
- 平台级访问控制

OPEN WEIGHTS

### 模型进入不同部署环境

`Safety = Model + Downstream Governance`

行为边界在更大程度上由部署者、工具权限、数据环境与下游监督共同决定。

- 系统边界更开放
- 部署情境更多样
- 责任向下游迁移

EFFICIENCY ENGINE

### DeepSeek：资源约束优化

`Given Compute = C, maximize Intelligence`

公开技术哲学集中在单位资源的智能产出。

ACTION ENGINE

### Kimi：任务执行优化

`Answering → Planning → Acting`

公开技术哲学更强调工具协同与任务完成。

**重要限定：**“没有公开同层级文档”与“没有安全或治理体系”不是同一命题。本页只比较附件呈现出的公开设计重点。

06 · SYSTEM EVOLUTIONSIX SCIENTIFIC PARADIGMS

## 从结构模型到网络化行动系统

大模型已经不再是单一网络。模型、路由器、工具、智能体、用户、记忆与外部系统组成新的计算网络，不同公司在这条演化链的不同位置下注。

1. 01
   
   STRUCTURE
   
   ### 结构系统
   
   MoE、Dense、Transformer 与专家网络回答“系统由什么构成”。
   
   **DeepSeek / Kimi 公开较多**
2. 02
   
   INFORMATION
   
   ### 信息系统
   
   Attention、多模态 token 与上下文回答“信息如何编码传递”。
   
   **多模态体系的重要战场**
3. 03
   
   CONTROL
   
   ### 控制系统
   
   权限层级决定复杂网络中谁能覆盖谁的指令。
   
   **OpenAI 的公开重点**
4. 04
   
   SELF-ORGANIZATION
   
   ### 自组织系统
   
   系统从一般原则出发，在未知情境中生成具体判断。
   
   **Anthropic 的公开重点**
5. 05
   
   COMPLEX ADAPTATION
   
   ### 复杂适应系统
   
   策略根据人类、模型、工具与环境反馈持续更新。
   
   **所有厂商都已进入**
6. 06
   
   NETWORK + COMPUTE
   
   ### 网络与计算复杂性
   
   Models + Routers + Tools + Agents + Users + Memory 形成智能基础设施。
   
   **当前共同前沿**

NETWORKED AI`G = (V, E)`

控制问题从“单个模型怎样回答”扩展为“智能网络怎样分配价值、权限、风险、资源与行动能力”。

07 · FIVE-DIMENSIONAL SPACENO ONE-DIMENSIONAL RANKING

## 五条路线构成状态空间，不是一维排行榜

“更先进”必须先说明评价维度。价值泛化、权限组织、风险治理、计算效率和行动能力之间存在协同，也存在无法回避的张力。

STATE SPACE`AI = f(Intelligence, Alignment, Control, Efficiency, Agency)`

01

### Intelligence

推理、表征与泛化能力

02

### Alignment

原则、价值与行为边界

03

### Control

权限、监督与冲突解决

04

### Efficiency

单位计算资源的能力产出

05

### Agency

规划、工具使用与任务完成

| 体系 | 核心控制点 | 主要系统问题 | 抽象类型 |
| --- | --- | --- | --- |
| Anthropic | Principles / Values | 系统内部如何形成可泛化判断？ | Agent with Constitution |
| OpenAI | Authority Hierarchy | 复杂 AI 网络的控制权如何组织？ | General Intelligence Platform |
| Google | Capability Threshold | 能力越过危险阈值时如何制动？ | Risk-governed AI Infrastructure |
| DeepSeek | Optimization | 智能如何以更低资源成本产生？ | Efficient Intelligence Engine |
| Kimi | Task Execution | 智能如何从回答进化为行动？ | Action-oriented Agent |

08 · REINTEGRATIONTHE MATURE SYSTEM

## 成熟系统最终需要重新整合这些专长

未来未必会证明某一家哲学完全正确。更可能的结果，是分化后的原则、权限、风险、效率和行动能力重新组合为更高阶系统。

BASE

### Reasoning

理解情境、形成模型并处理未知。

ANTHROPIC QUESTION

### Values

有原则地判断，而非只查规则表。

OPENAI QUESTION

### Authority

清楚谁拥有最终控制权。

GOOGLE QUESTION

### Risk Control

知道何时能力已经危险并需要制动。

DEEPSEEK QUESTION

### Efficiency

把有限算力高效转化为能力。

KIMI QUESTION

### Agency

使用工具、规划步骤并完成任务。

EVOLUTION PATTERN**分化***→***专业化***→***张力***→***重新整合**

> FINAL SYSTEM
>
> AI 顶层设计的终局，不是某一项局部指标胜出，而是原则判断、权限治理、风险阈值、计算效率与智能体行动在同一系统中保持可解释的动态平衡。
>
> Reasoning + Values + Authority + Risk Control + Efficiency + Agency

**阅读边界：**厂商文档、模型结构和产品策略会持续变化。本页呈现的是附件中的系统论抽象，不构成对当前模型能力、安全水平或商业选择的实时结论。

Cavno Life / AI**AI System Design Atlas**

---

来源：[https://cavno.org/life/ai/ai-system-design-atlas/](https://cavno.org/life/ai/ai-system-design-atlas/)
