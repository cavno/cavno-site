# 智驾战争的系统论｜Tesla FSD 与理想 VLA

Life & Skills · Driving

# 智驾战争的系统论

Tesla FSD 与理想 VLA 的真正差异，不只在传感器或模型名称，而在两套学习系统从哪里获得复杂性、如何处理长尾，以及怎样被现实持续纠错。

[← 返回驾驶栏目](http://127.0.0.1:5509/life/driving/)

01 · CORE THESISREALITY-FIRST / MODEL-FIRST

## 真正的分叉是：*系统从哪里获得复杂性？*

附件把两条路线归纳为两种不同的复杂性来源：一条尽可能扩大现实世界采样，一条尝试把现实的统计结构搬进可高速迭代的内部世界模型。

A**Reality-first**

### Tesla 路线

1. 现实世界
2. 海量车队数据
3. 统一神经网络
4. 驾驶策略

让真实道路不断提供长尾，让模型从人类驾驶轨迹与接管反馈中吸收复杂性。

**CORE FLYWHEEL · FLEET SCALE**

B**Model-first**

### 理想 VLA 路线

1. 现实数据
2. 世界模型
3. 仿真生成
4. 强化学习

先学习一个可以生成场景的内部环境，再用合成变体提高单位真实数据的训练信息量。

**CORE FLYWHEEL · SIMULATION ITERATION**

> THE QUESTION
>
> 不是“纯视觉还是激光雷达”，也不只是“端到端还是 VLA”，而是现实采样能力与内部世界生成能力，谁能形成更强、更快、更安全的学习闭环。

**内容基线：**页面中的具体路线描述均沿用附件文本；可视化与系统结构是对附件的编辑性抽象，不代表对当前产品版本、法规状态或道路安全能力的实时判断。

02 · OPEN SYSTEMPERCEPTION → ACTION → FEEDBACK

## 先把智驾定义成开放复杂适应系统

成熟智驾不是一次性的“输入—输出”机器，而是在真实交通环境中采取行动、接收反馈、更新模型并再次行动的持续循环。

P**Physical**车辆、芯片与传感器

E**Environment**道路、天气与交通主体

I**Information**视觉、雷达、语言与时序

M**Model**神经网络与内部世界表示

A**Action**转向、制动与加速

F**Feedback**接管、风险、舒适与规则

1. 01**感知**读取环境状态
2. 02**建模**形成内部表示
3. 03**行动**改变下一时刻
4. 04**反馈**记录结果与接管
5. 05**学习**更新模型和策略

MODELt+1*返回下一轮*

SYSTEM EQUATION `S = (P, E, I, M, A, F)`

Environmentt → Perceptiont → Modelt → Actiont → Environmentt+1

03 · EVOLUTIONSIX SYSTEM PARADIGMS

## 智驾几乎复现了系统科学的六阶段演化

技术革命不只是把规则代码换成神经网络，而是把工程对象从“驾驶行为”逐步改造成“能够生成经验、学习策略并持续纠错的系统”。

1. 01
   
   MECHANICAL
   
   ### 机械系统
   
   工程师编写规则，感知、预测、规划与控制彼此分离。
2. 02
   
   GENERAL SYSTEM
   
   ### 整体融合
   
   BEV、Occupancy 与多任务网络开始形成一致世界表示。
3. 03
   
   CYBERNETICS
   
   ### 闭环控制
   
   动作改变环境，接管与结果成为模型训练的反馈信号。
4. 04
   
   SELF-ORGANIZATION
   
   ### 自组织
   
   从显式规则转向由架构、目标和数据共同涌现驾驶策略。
5. 05
   
   COMPLEX ADAPTATION
   
   ### 复杂适应
   
   世界模型、强化学习与新颖场景推动策略持续演化。
6. 06
   
   NETWORK + COMPUTE
   
   ### 网络化认知
   
   车队、仿真、训练基础设施与部署形成分布式学习系统。

PARADIGM SHIFT

工程师设计行为 → 工程师设计学习系统 → 学习系统生成经验、形成策略并由现实持续纠错

04 · LEARNING LOOPSTHE PRODUCT IS THE LOOP

## 竞争单位不是单个模型，而是整套学习飞轮

模型只是某个时间点的产物。真正决定演化速度的是数据如何进入、难例怎样被发现、策略如何验证，以及更新多久回到道路。

LOOP A

### 现实车队学习网络

Fleet → Data → Model → Fleet

1. 01**Reality**真实道路
2. 02**Fleet**分布式感知节点
3. 03**Real Data**长尾与接管信号
4. 04**E2E Network**统一策略学习
5. 05**Deployment**模型回到车辆

**关键张力：**车队规模放大长尾覆盖，但真实极端场景仍然昂贵，数据边际收益也可能递减。

LOOP B

### 世界模型仿真网络

Reality → Simulation → Policy → Reality

1. 01**Reality**真实困难场景
2. 02**World Model**重建环境结构
3. 03**Simulation**生成大量变体
4. 04**RL + VLA**主动试错学习
5. 05**Calibration**道路验证纠偏

**关键张力：**仿真可以解耦物理时间，但世界模型偏差可能被强化学习放大，必须持续接受现实校准。

05 · FOUR LENSESSELECT A COMPARISON

## 切换四个透镜，看复杂性被放到了哪里

两条路线都没有消灭复杂性，只是把它分配到现实采样、内部生成、硬件冗余、模型学习或接口协同的不同位置。

TESLA

### 扩大现实世界采样能力

`Reality → Data → Intelligence`

把真实道路和车队行为视为最重要的训练环境。

核心张力**现实规模***VS***仿真速度**

LI AUTO

### 扩大内部世界生成能力

`Reality → World Model → Synthetic Experience`

把困难场景搬进可并行、可变体、可重复的训练环境。

可使用方向键切换透镜；页面不会发送任何数据。

06 · TRADE-OFFSCOMPLEXITY MOVES, NOT DISAPPEARS

## 复杂性没有消失，只是被转移

路线选择的本质，是决定让哪一部分系统承担不确定性：现实网络、仿真环境、硬件层、模型层，还是组织与供应链。

01 · SENSING

### 传感器异质性

**较低***接口更少***↔****较高***物理冗余*

02 · EXPERIENCE

### 训练经验来源

**真实世界***开放但缓慢***↔****生成世界***快速但有偏差*

03 · COMPUTE

### 计算与供应链

**垂直整合***强耦合优化***↔****模块生态***借力外部进步*

| 系统维度 | Tesla 路线 | 理想 VLA 路线 |
| --- | --- | --- |
| 信息来源 | 真实世界为主 | 真实数据 + 生成数据 |
| 感知结构 | 较低传感器异质性 | 多传感器冗余 |
| 模型结构 | 高度统一的端到端网络 | 从双系统向统一 VLA 演进 |
| 学习机制 | 大规模模仿与反馈学习 | 模仿 + 世界模型 + 强化学习 |
| 长尾方式 | 车队覆盖现实事件 | 仿真主动生成变体 |
| 计算体系 | 更强调垂直整合 | 更偏供应链模块化 |
| 核心资产 | 车队学习网络 | VLA 与仿真学习系统 |
| 主要风险 | 真实长尾成本、共同失效与数据边际收益 | Sim-to-Real 偏差与世界模型错误放大 |
| 系统哲学 | Reality → Intelligence | Model Reality → Generate Experience → Intelligence |

07 · OBSERVATION METRICSBEYOND PARAMETERS AND TOPS

## 真正值得观察的五项系统指标

参数量和单次演示容易吸引注意，但长期上限取决于整个学习闭环如何把数据、算力和时间转化为可验证的能力增量。

01

### 现实信息摄取率

`RI = 有效新现实信息 / 时间`

系统多快吸收到真正新增、可训练的道路事实。

02

### 长尾发现率

`RL = 新高风险场景 / 里程或模拟时间`

多快暴露低概率但高后果的困难情境。

03

### 学习闭环时间

`Tloop = Tcollect + Ttrain + Tvalidate + Tdeploy`

从发现问题到验证更新重新上路需要多久。

04

### 世界模型偏差

`EW = D(Wreal, Wsim)`

模拟环境与真实分布的距离，决定强化学习是否会优化错方向。

05

### 学习闭环效率

`ηL = ΔCapability / (Data × Compute × Time)`

每单位数据、算力和时间最终换来多少可靠能力。

08 · CONVERGENCENETWORKED EVOLUTIONARY COGNITION

## 两条路线最终可能再次合流

现实采样与内部生成并非永久对立。世界模型仍需道路反馈，车队学习也可能吸收合成数据、仿真与更丰富的推理能力。

01**Real Data**现实采样

*+*

02**World Model**内部建模

*+*

03**Simulation**模拟生成

*+*

04**RL / E2E**策略学习

*+*

05**Fleet Feedback**道路纠错

END STATE **Perception → World Model → Prediction → Action → Feedback → Learning**

当感知、内部世界、预测、行动、反馈、记忆与学习闭合成持续演化的回路，“自动驾驶算法”就逐渐变成一个自主认知系统。

> FINAL JUDGMENT
>
> 真正的智驾战争，不是谁先拥有一个更响亮的模型名字，而是谁先形成足够强、足够快、足够安全，并且能被现实持续纠错的自我学习闭环。
>
> 现实采样 ↔ 内部建模 ↔ 模拟生成 ↔ 策略学习 ↔ 道路反馈

**阅读边界：**本页讨论的是系统架构与学习机制，不构成车型选择、自动驾驶能力承诺或道路操作建议。实际驾驶应始终遵守当地法规、车辆说明与驾驶员监督要求。

Cavno Life / Driving**Autonomous Driving Systems**

---

来源：[https://cavno.org/life/driving/autonomous-driving-systems/](https://cavno.org/life/driving/autonomous-driving-systems/)
