Reading & Thinking · Science

# 信息演化史

信息史从可区分状态、相关性和物理记忆开始，逐步进入遗传、神经、语言、计算与人工智能。

[← 返回自然科学栏目](http://127.0.0.1:5509/reading/science/)

SYSTEMS HISTORY · 07

# 信息演化史

从物理差异到自我建模：记忆、编码与反馈如何扩展系统的可能性

信息史从可区分状态、相关性和物理记忆开始，逐步进入遗传、神经、语言、计算与人工智能。

差异与相关记忆外置编码复制语义与控制

SYSTEM  
MODEL

Difference → Correlation → Memory → Code → Communication → Computation → Learning

核心问题 / THE GOVERNING QUESTION

信息怎样从状态差异变成可保存、复制、解释并反过来控制物理过程的结构？

**物理起点**可区分状态

**生命跃迁**遗传编码

**文明跃迁**外部记忆

**AI 跃迁**统计生成模型

演化时间线 / EVOLUTION TIMELINE

![文章图示 1](https://cavno.org/reading/science/information-evolution/downloads/assets/information-evolution-visual-001.png)

阶段对比 / COMPARATIVE FRAME

| 系统阶段 / 模块 | 核心单位或回应 | 新增能力 | 新增脆弱性 / 限定 |
| --- | --- | --- | --- |
| 物理信息 | 状态区分与相关 | 痕迹、信号 | 不自动有意义 |
| 香农信息 | 减少多少不确定性 | 编码与信道 | 不判断真假价值 |
| 生物信息 | 复制并控制功能 | DNA、细胞网络 | 语义依赖生命 |
| 社会—AI 信息 | 共享解释、预测生成 | 语言、数据、模型 | 流畅不等于真知识 |

导论 · OPENING

可以。按照前面“物质—能量—人—经济—金融”的系统论框架来看，**信息的演化史可能是这几条历史中最容易被说错的一条**。 因为严格地说，信息不是像原子、石油或电一样的一种独立“东西”。真正发生演化的是：

**系统区分状态、保存差异、建立关联、复制模式、传递信号、压缩经验、预测环境，并最终利用这些信息反过来控制自身和外部世界的能力。**

因此，“信息演化史”最准确的主线不是：

少量信息→大量信息

而是：

差异 → 相关 → 记录 → 编码 → 复制 → 通信 → 记忆 → 计算 → 模型 → 反身知识

如果把前面三条基本线并列起来：

物质回答：什么结构存在？

能量回答：什么过程能够发生？

那么信息主要回答：

系统怎样区分过去、现在、环境与可能未来？

CHAPTER 01

## 一、先把“信息”拆成几个完全不同的概念

这是整篇最重要的前提。 日常语言里我们会把以下东西全部叫“信息”：

- 一个DNA序列；
- 一张照片；
- 一条微信；
- 一个股票价格；
- 一条神经冲动；
- 一篇论文；
- AI模型中的参数。

但它们并不属于完全相同的“信息”概念。 至少要区分四层：

| 层级 | 核心问题 | 例子 |
| --- | --- | --- |
| 物理信息 | 系统处于哪个状态？ | 粒子位置、磁畴状态 |
| 香农信息 | 一个信号能减少多少不确定性？ | 比特、通信信道 |
| 功能信息 | 某种结构对系统行为有什么作用？ | DNA、神经编码 |
| 语义信息 | 这个符号意味着什么？ | 语言、法律、科学理论 |

所以不能简单写成：

Information=Meaning

也不能写成：

Information=Entropy

更准确的是：

**不同层级的信息概念建立在不同问题上。**

### 二、如果建立一个统一的信息系统模型

可以把一个信息系统写成：

mathcal I\_t= (X\_t,D\_t,E\_t,C\_t,M\_t,P\_t,N\_t,F\_t)

其中：

| 变量 | 含义 |
| --- | --- |
| X | States：系统可能状态 |
| D | Differences：可区分差异 |
| E | Encoding：编码规则 |
| C | Channel：传输通道 |
| M | Memory：存储机制 |
| P | Processing：处理与计算 |
| N | Network：信息传播网络 |
| F | Feedback：信息如何参与控制 |

于是信息史真正研究的是：

系统怎样越来越有效地 获取差异、保存差异、压缩差异、传递差异并利用差异。

### 三、信息最原始的形式不是“文字”，而是“差异”

格雷戈里·贝特森有一句非常有名的话：

information is a difference that makes a difference.

如果用系统语言表达： 系统处于：

State\_A

而不是：

State\_B

本身就形成：

Difference

但只有当另一系统能够区分这个差异，并使行为发生变化时，它才进入更强意义的信息关系。 所以：

Difference → Discrimination → Response

可以看成信息史最早的逻辑结构。

### 四、第一阶段：物理世界首先产生的是“状态与相关性”

在生命出现以前，谈“信息”必须非常谨慎。 一个电子处在： 自旋向上， 而不是： 自旋向下。

一个晶体： 具有某种排列， 而不是另一种排列。

这些都是：

PhysicalState

如果两个变量之间存在相关：

X↔ Y

那么观察 X 可以减少我们对 Y 的不确定性。 这已经可以用：

MutualInformation

描述。

### 五、香农后来把这种“减少不确定性”形式化

对于离散随机变量 X：

H(X) = -Σ\_x p(x)log\_2p(x)

这就是香农熵。 它测量：

在知道结果之前，平均有多少不确定性。

如果：

P(X=1)=1

那么：

H(X)=0

因为结果完全确定。 如果：

P(0)=P(1)=0.5

那么：

H(X)=1\\ bit

不确定性最大。

### 六、所以“信息”首先可以被理解成对可能状态空间的区分

假设有：

2^n

种可能状态。 识别其中一个需要：

n

个比特。 于是：

Information sim Reduction\\ of\\ uncertainty

这就是现代数字信息世界能够成立的基础。

### 七、但这里必须避免一个最常见错误

不能说：

“宇宙熵越高，信息就一定越少。”

因为： 热力学熵、 香农熵、 算法复杂度、 语义信息， 不是一个概念。

它们在特定条件下存在数学和物理联系， 但不能直接互换。 尤其不能简单写：

Information=-Entropy

作为普遍定律。

### 八、物理世界真正出现的第一种“记忆”是什么？

一个系统如果今天的状态：

x\_t

取决于过去：

x\_t-1

那么： 过去留下了：

Trace

例如： 岩石中的层理； 晶体缺陷； 磁畴； 放射性同位素比例； 撞击坑。

这些结构： 都把过去的事件写进现在。 可以写：

History → PersistentState

这就是最广义的物理记忆。

### 九、所以“记忆”并不是从大脑开始

大脑只是高度复杂的记忆系统。 在此之前： 岩石已经记录： 地质历史。

冰芯记录： 古气候。 树轮记录： 过去的环境。

DNA记录： 演化历史。 共同结构都是：

PastEvent → StateChange → Persistence

CHAPTER 02

## 十、第二阶段：物质结构开始成为信息载体

当物质能够形成大量稳定状态： 信息存储能力随之增加。 例如磁性材料： 可以形成：

0

和：

1

两种稳定状态。 DNA： 四种碱基：

A,T,C,G

电子设备： 高电压和低电压：

1/0

所以信息本身不是独立于物质的东西。 必须：

Information

被某种：

PhysicalState

承载。

### 十一、这得到一条极其重要的系统规律

No\\ information without physical\\ representation

信息可以从纸： 复制到磁盘； 从磁盘： 复制到光纤； 再复制到内存。

载体可以变化。 但每一次具体存在的信息， 都需要某种物理实现。

### 十二、这就是为什么信息与能量最终必然相遇

存储信息： 需要稳定状态。 传输信息： 需要物理信号。

计算信息： 需要状态变化。 擦除信息： 存在热力学成本。

Landauer原理给出： 在理想条件下不可逆擦除一个比特信息至少耗散：

boxed E\_min=k\_BTln2

这不是说： “一个bit等于这么多能量”。 而是说：

**不可逆信息处理存在最低热力学代价。**

### 十三、第三阶段：复杂化学——信息开始从“状态”转向“序列”

分子世界中出现一个关键突破： 同样的基本单元： 只要排列不同， 就能形成完全不同结构。

例如：

ABC

和：

ACB

组成元素相同。 但序列不同。 于是：

Composition → Sequence

信息容量大幅增加。

### 十四、如果一个长度为 n 的序列有 k 种符号

可能序列数量：

k^n

因此： DNA只有四种主要碱基， 但长度足够大以后：

4^n

产生巨大状态空间。 所以序列带来：

CombinatorialExplosion

### 十五、第四阶段：生命起源——信息第一次深度进入“自维持结构”

生命相较普通化学最关键的新结构之一是：

某些分子排列不仅描述一个状态，还参与制造、维护和复制系统。

DNA/RNA的特殊性不只是： “里面有信息”。 而是：

Sequence

通过复杂细胞机制： 影响：

Protein

再影响：

Structure+Function

所以：

StoredPattern → FunctionalConsequence

信息获得了功能性。

### 十六、这里必须避免一句过于简单的话

不能说：

DNA=Blueprint

然后把生命理解成建筑图纸。 因为生物体的生成还依赖： 细胞状态； 调控网络； 表观遗传； 空间结构； 环境； 发育过程。

所以更准确：

Phenotype = F( Genome, Regulation, Development, Environment )

DNA是关键的信息结构， 但不是一个脱离系统就能独立“解释生命”的程序。

### 十七、生命真正完成的突破，是把“信息”和“复制”耦合起来

如果一个结构： 能够复制， 同时复制存在：

Variation

而变体具有不同：

Fitness

则：

Variation → Selection → Retention

于是过去成功的结构能够：

Persist

到未来。

### 十八、从信息论角度看，自然选择像一个历史过滤器

环境： 不断筛选： 哪些结构能够留下。

于是： 过去的选择压力： 通过基因频率变化， 被部分写入： 今天的生物结构。

所以：

PastEnvironment → Selection → GenomeDistribution

生命系统因此获得一种：

#### 跨世代记忆。

CHAPTER 03

## 十九、这和普通物理记忆有根本区别

岩石记录过去： 但它不会： 复制岩石记录。

遗传系统： 则可以：

Memory → Replication → Inheritance

所以信息开始： 跨世代传播。

### 二十、第五阶段：遗传密码——系统第一次形成“符号映射规则”

DNA中： 三个核苷酸：

Codon

与： 氨基酸： 建立对应关系。

例如： 某个codon：

→ AminoAcid

这是非常重要的一步：

Symbol → Function

当然遗传密码不是人类语言。 但它已经具有：

EncodingMapping

### 二十一、于是生物信息系统开始具备四个基本部分

Storage + Code + Reader + Executor

DNA： Storage。 遗传密码： Code。

核糖体等： Reader。 蛋白质与细胞过程： Executor。

这已经非常接近完整信息系统。

### 二十二、第六阶段：纠错——生命发现“信息保存需要冗余”

任何复制系统都会有：

Error

如果错误率过高： 信息无法稳定跨代保存。 于是生命发展出： DNA修复； 校对机制； 冗余编码。

这揭示一个极深的系统规律：

InformationPersistence requires ErrorControl

### 二十三、这一规律后来在人类通信系统中再次出现

数字通信： 也使用： 冗余； 校验码； 纠错码。

例如：

Message → EncodedMessage → NoisyChannel → DecodedMessage

所以生物遗传与数字通信虽然机制完全不同， 却都面对同一个系统问题：

如何让模式穿过噪声而不丢失？

### 二十四、第七阶段：感知——信息第一次用于实时环境控制

基因解决的是： 跨代适应。 但环境变化速度常常比世代更快。

因此生命发展： 感受器。 例如： 光； 化学物； 温度； 压力。

于是：

Environment → Sensor → InternalSignal

### 二十五、这标志着系统从“历史信息”进入“实时信息”

遗传：

Past\\ information

感知：

Current\\ information

于是生命同时拥有：

Memory\_evolution

与：

Sensing\_now

### 二十六、感知真正的功能不是“知道世界”

而是： 改善行动。 最简单的细菌趋化： 检测： 化学浓度变化。

然后： 调整运动。 结构：

Sense → Compare → Act

这是非常原始的控制回路。

### 二十七、从这里开始，信息正式进入“控制系统”

没有信息： 系统无法知道： 自己是否偏离目标。

有反馈：

Reference - ActualState = Error

控制器： 根据：

Error

调整行动。 于是：

Information → Control

这就是控制论最核心的一步。

CHAPTER 04

## 二十八、第八阶段：神经系统——分散信号变成高速网络

单细胞： 信息处理发生在一个细胞内部。 多细胞生命： 细胞之间需要： 通信。

于是： 化学信号； 电信号； 神经系统， 逐步形成。

结构：

Sensor → NeuronNetwork → Muscle

### 二十九、神经系统真正解决的是“通信延迟”

体型变大以后： 单纯依赖慢速化学扩散：

Latency↑

神经系统： 通过电化学信号： 大幅加快：

SignalSpeed

于是：

LargerSystem ⇒ NeedForFasterCommunication

这和后来国家、电网、互联网的发展存在非常有意思的结构相似性。

### 三十、第九阶段：大脑——信息系统开始建立“内部世界模型”

简单反馈： 只需要：

Stimulus→ Response

但复杂环境： 需要： 预测。

于是： 感觉信息：

o\_t

被整合成内部状态：

hatx\_t

然后：

Model → Prediction → Action

### 三十一、这是一场极其重要的跃迁

系统不再只能回答：

“现在发生了什么？”

还开始回答：

“接下来可能发生什么？”

所以：

Information

从：

Description

升级为：

Prediction

### 三十二、于是“模型”成为新的信息结构

现实世界： 高维。 大脑： 不可能保存全部细节。

所以必须：

Compression

把大量感觉： 压缩成： 对象； 类别； 因果； 空间； 时间； 角色。

于是：

World → Compressed\\ Model

### 三十三、这意味着认知本身是一种信息压缩

例如看到： 一百次不同角度的狗。 大脑不会分别建立： 100个毫无关系的状态。

而形成：

Category:Dog

这就是：

ManyObservations → LatentStructure

### 三十四、信息压缩为什么如此重要？

因为系统的计算资源有限。 如果每一次都从原始数据开始：

Cost↑

所以：

Model

其实是： 对过去经验的一种压缩存储。 于是：

Learning = Extracting\\ reusable\\ structure

### 三十五、第十阶段：学习——信息开始在个体生命期间积累

基因： 更新速度：

Generational

学习： 更新速度：

WithinLifetime

于是：

AdaptationRate↑

主体可以根据一次事件： 改变后续行为。 结构：

Experience\_t → Memory\_t → Policy\_t+1

### 三十六、到这里，生命已经拥有三层信息时间尺度

EvolutionaryMemory + IndividualMemory + RealTimeSensing

即： 基因： 慢。

学习： 中。 感知： 快。

这是多时间尺度信息系统。

CHAPTER 05

## 三十七、第十一阶段：社会动物——信息开始在个体之间复制

如果一个动物： 发现： 食物位置。

通过叫声： 通知其他个体。 那么：

Brain\_A → Signal → Brain\_B

信息第一次大规模突破： 单个神经系统边界。

### 三十八、这意味着一个巨大的跃迁

原来：

Knowledge\_i

死亡以后： 大部分消失。 社会传递出现以后： 知识可以：

Individual\_A → Individual\_B

于是：

InformationLifetime \> IndividualLifetime

### 三十九、第十二阶段：语言——信息第一次获得开放式组合能力

动物通信往往： 信号集合有限。 人类语言： 具有： 组合性。

有限词汇： 可以形成： 近乎无限句子。

例如：

Words + Grammar → UnboundedExpressions

这是一场信息组合革命。

### 四十、语言真正带来的并不只是“交流更方便”

而是：

**可以把不存在于眼前的对象也编码。**

可以讨论： 过去； 未来； 假设； 神； 法律； 战争计划； 数学对象。

因此：

Information

从：

CurrentEnvironment

扩展到：

CounterfactualWorlds

### 四十一、人类从此可以交换“模型”，而不只是交换信号

比如： 一个人说：

“山那边有一群猎物。”

听者没有亲自看见。 但：

Model\_A → Language → Model\_B

于是： 信息交流从：

SignalTransmission

升级成：

ModelTransmission

### 四十二、第十三阶段：叙事——人类开始压缩长时间因果结构

故事： 不是随机信息堆积。 它把： 事件A； 事件B； 人物； 动机； 结果， 压缩成：

Narrative

于是：

Events → CausalSequence

这让人类可以： 用一个人的经验， 训练很多人。

### 四十三、神话、法律和习俗也属于这种信息技术

它们把： 大量历史经验和社会规则， 压缩成： 可记忆结构。

例如： “不能偷盗” 背后可能对应： 复杂的社会稳定逻辑。

但规则将其压缩为：

Rule

所以：

ComplexExperience → SimpleNorm

### 四十四、第十四阶段：文字——信息第一次大规模脱离人脑

语言仍然依赖：

Brain\_A→ Brain\_B

文字出现以后：

Brain → ExternalMedium

于是：

Memory

被外部化。

### 四十五、这是人类信息史最大的断点之一

因为： 人脑死亡： 文字仍存在。

信息开始： 跨越： 时间； 空间； 个体。

所以：

BiologicalMemory → ExternalMemory

CHAPTER 06

## 四十六、文字也改变了文明规模

口头社会中： 治理复杂度受到： 人的记忆限制。

有账簿以后： 可以记录： 税收； 土地； 债务； 人口； 法律。

于是：

InformationCapacity↑

支持：

OrganizationScale↑

这和我们前面金融史里看到： 账簿让债务网络扩大， 其实是同一个结构。

### 四十七、文明开始出现一个重要规律

OrganizationScale ≤ InformationProcessingCapacity

组织越大： 需要记录： 更多状态。

国家越大： 需要： 更多行政信息。

企业越大： 需要： 更多会计和管理系统。

军队越大： 需要： 更多指挥与通信。

### 四十八、第十五阶段：数字与数学——信息开始被高度抽象

文字： 描述具体事物。 数学： 进一步把关系抽象出来。

例如： 三只羊； 三个苹果； 三个士兵， 全部可以压缩成：

3

这意味着：

DifferentObjects → SameStructure

### 四十九、数学从系统论看是一种极端的信息压缩

例如： 牛顿运动定律： 用几个公式， 可以描述： 大量运动现象。

于是：

10^9\\ observations

可能被压缩为： 少量方程。 因此：

Theory = Compression\\ of\\ regularity

当然理论还要求解释、预测和可检验性，不能仅仅等同于压缩。

### 五十、第十六阶段：印刷术——信息复制成本发生断崖式下降

手抄时代： 复制一本书： 成本很高。

印刷：

CopyCost↓

于是：

Copies↑↑

信息从： 稀缺物品， 进入： 规模复制。

### 五十一、这里第一次出现信息经济的一个核心规律

信息与普通物质商品不同。 制作第一份信息： 可能很贵。

复制第二份： 可能非常便宜。 即：

FixedCost↑

MarginalCopyCost↓

数字时代甚至：

MarginalCost≈0

### 五十二、因此信息天然具有高复制性

一块面包： 给A以后， B不能再吃。

但一个公式： 告诉A以后， 还可以同时告诉B。

所以信息具有：

NonRivalry

倾向。 这会深刻改变： 知识产权； 软件； 互联网； AI经济。

### 五十三、第十七阶段：科学方法——信息系统开始制度化纠错

传统知识： 可能依赖： 权威。

科学逐渐形成：

Observation → Hypothesis → Experiment → Replication → Correction

核心不是： “科学永远正确”。 而是：

Error\\ Correction

被嵌入知识生产制度。

### 五十四、这与生命DNA修复出现了结构上的遥远呼应

DNA：

Copy → Check → Repair

科学：

Claim → Test → Replicate → Correct

两者并非相同系统， 但都面对：

InformationPersistence vs Error

这一普遍问题。

CHAPTER 07

## 五十五、第十八阶段：印刷 + 科学 + 学术网络——知识开始成为分布式系统

不再是： 一个天才保存全部知识。 而是：

Researcher\_1+·s+Researcher\_n

通过： 论文； 书籍； 学会； 大学， 组成：

KnowledgeNetwork

### 五十六、知识系统从“个人记忆”升级为“社会记忆”

没有任何一个人： 掌握所有现代医学、 物理、 数学、 工程学。

但是： 社会整体： 可以。

于是：

Knowledge\_society ≫ Knowledge\_individual

这就是：

DistributedCognition

### 五十七、第十九阶段：电报——信息第一次显著脱离物质运输速度

此前： 信息速度大体受： 人； 马； 船， 限制。

电报出现： 消息不再需要： 随人或纸张移动。

于是：

InformationTransport

和：

MatterTransport

开始解耦。

### 五十八、这是一场非常深的文明跃迁

过去：

InformationSpeed ≈ TransportationSpeed

电报以后：

InformationSpeed ≫ TransportationSpeed

这直接改变： 金融市场； 战争； 新闻； 国家管理； 企业组织。

### 五十九、第二十阶段：电话与广播——信息开始实时化与一对多传播

电报： 主要传： 编码文字。

电话： 传声音。 广播： 实现：

1→ N

于是： 一个信息源： 可以同时影响： 数百万个节点。

信息网络开始形成：

CentralizedBroadcast

### 六十、这里首次大规模出现“注意力集中”

如果一个广播中心： 可以影响：

10^6

个人。 那么：

NetworkCentrality

本身成为： 权力。 于是：

InformationNetworkStructure → SocialPower

这与后来互联网平台更加明显。

### 六十一、第二十一阶段：香农——信息第一次摆脱“意义”成为可计算对象

1948年香农信息论的革命性在于： 他暂时不问：

消息“什么意思”？

而问：

信道能够多可靠地传递多少符号？

于是：

SemanticMeaning

被暂时放在系统之外。 只研究：

Source → Encoder → Channel → Decoder → Receiver

### 六十二、这是一种极其强大的抽象

因为： 声音； 文字； 图像； 视频； 都可以统一成：

Symbols

然后研究： 带宽； 噪声； 编码； 信道容量。

信息第一次拥有统一工程语言。

### 六十三、信道容量的基本思想是

有噪声时： 并不是： 只能接受错误。

可以通过编码， 在一定条件下： 实现任意低错误率的通信。

这就是香农信道编码定理的巨大意义。 于是：

Noise ≠ InevitableInformationLoss

只要： 编码和速率设计得当。

CHAPTER 08

## 六十四、第二十二阶段：数字化——世界被重新编码成bit

文字： 变成bit。 声音： 变成bit。

图片： 变成bit。 视频： 变成bit。

金融资产记录： 也变成bit。 于是：

HeterogeneousInformation → BinaryRepresentation

形成统一底层接口。

### 六十五、这和电力标准化能源形式非常相似

能源世界： 不同能源：

→ Electricity

信息世界： 不同内容：

→ Bits

于是：

Digitalization = InformationStandardization

这是结构类比，不是说bit和电是同一回事。

### 六十六、一旦信息变成bit，就产生三个革命性后果

第一：

#### 无损复制

010101

复制以后： 还是：

010101

不会像模拟复印一样： 每代不断衰减。 第二：

#### 通用计算

同一台机器： 可以处理： 文本； 图像； 音乐； 财务模型。

第三：

#### 网络统一

所有类型信息： 都可以通过同一通信基础设施传输。

### 六十七、第二十三阶段：图灵机——信息处理规则本身被形式化

图灵的真正突破之一是： 把“计算”抽象为： 有限规则作用于符号。

于是：

Input → Algorithm → Output

计算第一次从： 人的能力， 抽象为： 可以由机器执行的形式过程。

### 六十八、这里发生一次重要跃迁

以前机器处理： 物质和能量。 蒸汽机： 处理能量。

纺织机： 处理材料。 计算机： 主要处理：

RepresentedStates

也就是信息。

### 六十九、第二十四阶段：存储程序计算机——规则本身也变成数据

早期机器： 程序可能固化在机械结构里。 存储程序架构： 程序：

Program

也存储为：

Bits

于是：

Data

和：

Program

在物理存储层拥有统一形式。

### 七十、这是一次极其深的反身性萌芽

机器中的信息： 不仅描述： “要处理什么”。

还描述： “应该怎样处理信息”。 即：

Information about InformationProcessing

这已经接近： Meta-information。

### 七十一、第二十五阶段：互联网——信息从“中心广播”转向“网络互联”

传统广播：

One→ Many

互联网：

Many↔ Many

任何节点： 理论上既可以： 接受， 也可以： 发送。

于是：

InformationNetwork

变成： 分布式网络。

### 七十二、互联网最深的意义不是“网页很多”

而是：

Address + Protocol + PacketSwitching

让异构计算机可以： 进入统一通信体系。 于是：

LocalComputers → GlobalInformationNetwork

CHAPTER 09

## 七十三、信息网络出现新的系统性质：网络效应

节点数量：

N↑

潜在连接数量： 快速增加。 虽然真实价值不会简单严格按照 N^2 增长， 但结构上：

NetworkUtility

通常会随参与者增加显著提高。 于是：

Users↑ → Content↑ → Value↑ → Users↑

形成正反馈。

### 七十四、第二十六阶段：搜索引擎——问题从“有没有信息”变成“如何找到信息”

互联网解决：

Storage + Transmission

但当信息爆炸以后： 新瓶颈变成：

Attention

与：

Retrieval

所以搜索引擎的核心不是制造信息。 而是建立：

Query → RelevantInformation

映射。

### 七十五、信息系统第一次遇到一个新的反常现象

InformationSupply↑

不一定意味着：

Knowledge↑

甚至可能：

Signal/Noise\\ Ratio↓

因此：

**信息稀缺时代的问题是获得信息；信息过剩时代的问题是筛选信息。**

### 七十六、于是信息史从“传输问题”进入“过滤问题”

早期：

How\\ to\\ send?

后来：

How\\ to\\ store?

现在：

How\\ to\\ select?

这是一条极其重要的演化：

Acquisition → Transmission → Storage → Selection

### 七十七、第二十七阶段：社交媒体——信息开始大规模进入行为反馈闭环

用户： 看到内容。 产生： 点击； 点赞； 停留。

平台获得：

BehaviorData

算法： 更新推荐。 于是：

Behavior\_t → Data\_t → Model\_t → Recommendation\_t+1 → Behavior\_t+1

这和前面微观经济分析完全接上。

### 七十八、这里信息不再只是“告诉人世界是什么”

而开始：

ShapeEnvironment

即： 信息系统主动塑造用户看到的世界。 因此：

Information → Behavior → NewInformation

形成反身闭环。

### 七十九、这带来一个重要转变

传统媒体：

Content → Audience

现代平台：

AudienceBehavior → Algorithm → ContentSelection → AudienceBehavior

系统开始： 自适应。

### 八十、第二十八阶段：大数据——信息第一次从“人工记录”变成“自动行为痕迹”

过去大多数数据： 人主动写。 例如： 账簿； 调查； 报告。

现代数字系统： 用户每一次： 点击； 移动； 支付； 浏览； 搜索， 都会自动留下：

DigitalTrace

于是：

Behavior → Data

几乎实时发生。

### 八十一、数据系统开始建立“数字镜像”

现实中的： 人； 城市； 工厂； 金融市场， 越来越拥有： 数字表示。

例如：

PhysicalState → DigitalState

可以形成： Digital Twin。 于是： 系统能够： 观察； 模拟； 预测； 优化。

CHAPTER 10

## 八十二、第二十九阶段：机器学习——信息处理从“人工写规则”进入“从数据提取规则”

经典程序：

Rules+Data → Output

机器学习：

Data+Outcomes → Model

然后：

Model+NewData → Prediction

这是信息史又一次根本跃迁。

### 八十三、机器学习真正做的是什么？

从大量样本：

x\_1,ldots,x\_n

中寻找：

Pattern

然后压缩进：

θ

模型参数。 所以：

Dataset → CompressedStatisticalStructure

模型本身就是一种： 高度压缩的信息结构。

### 八十四、因此训练可以看成“信息压缩 + 函数构造”

大量经验：

D

被压缩为：

Model\_θ

之后： 模型不需要重新查看全部数据， 就可以对新输入： 进行预测。

这和大脑从经验形成内部模型， 在抽象层面有明显对应。

### 八十五、第三十阶段：生成式AI——信息系统从“检索已有信息”进入“生成新表示”

搜索引擎主要：

Query → ExistingDocument

生成模型：

Context → NewSequence

它不是简单复制数据库中的某一条文本。 而是利用训练中形成的统计结构： 产生新的组合。

### 八十六、于是信息处理发生一个重大变化

过去：

Storage → Retrieval

现在增加：

Model → Generation

所以：

InformationSystem → GenerativeSystem

### 八十七、但必须非常谨慎地说“新信息”

生成一个此前不存在的句子： 当然形成了新的符号排列。 但： 这不自动意味着： 产生了新的真实知识。

因为：

GeneratedContent ≠ VerifiedKnowledge

所以AI时代的核心问题之一又重新变成：

Verification

### 八十八、这说明信息、知识和真理必须重新分开

可以粗略写：

Data ≠ Information ≠ Knowledge ≠ Truth

#### Data

记录的状态或符号。

#### Information

能够减少某种不确定性的结构。

#### Knowledge

经过模型、解释、经验或验证组织起来的信息。

#### Truth

知识主张与其对象之间是否成立的问题。 所以： 信息数量：

↑

并不意味着： 真理数量： 同比增加。

### 八十九、第三十一阶段：Agent——信息开始直接驱动行动

过去： AI： 给答案。

Agent系统进一步：

Observe → Reason/Model → Act → Observe

于是信息系统开始进入： 完整控制闭环。

### 九十、这里发生了一次极其重要的转变

传统信息技术：

Human → Computer → Information → Human

Agent： 可能：

Computer → Information → Action → Environment

人不再是每一个行动的即时执行者。

CHAPTER 11

## 九十一、信息因此再次与控制合流

我们回到了控制论：

Information → Decision → Action → Feedback

只是现在： 控制器可能不再是： 单纯人类。

而是：

Human+AI

甚至部分自主AI。

### 九十二、如果把整个信息演化史压缩，会发现其实经历了九次核心跃迁

| 阶段 | 核心跃迁 |
| --- | --- |
| 物理世界 | 状态差异 |
| 稳定结构 | 差异可以留下痕迹 |
| 生命 | 序列可以复制 |
| 遗传 | 信息跨世代积累 |
| 神经系统 | 实时感知与处理 |
| 大脑 | 建立预测模型 |
| 语言/文字 | 信息跨个体、跨世代外部化 |
| 计算机/互联网 | 信息数字化、计算化、网络化 |
| AI | 模型化、生成化、行动化 |

### 九十三、再压缩成一条更深的演化线

Difference → Memory → Code → Replication → Communication → Computation → Model → Generation → Control

但这里真正改变的不是“宇宙中的信息越来越多”。 而是：

**越来越多系统获得了利用信息改变自身未来状态的能力。**

### 九十四、这就是信息史第一条最重要的元规律

#### 信息从“描述状态”逐渐进入“控制状态”

最早： 信息只是：

State

生命：

State → Response

神经系统：

State → Prediction → Action

文明：

Knowledge → Technology → EnvironmentChange

所以：

Representation → Control

是整条信息史的一条主线。

### 九十五、第二条规律：信息越来越与载体解耦，但永远无法脱离载体

最早： 信息和物体几乎不可分。 一个岩石纹理： 就是那块岩石。

文字出现： 同一句话： 可以写在： 竹简； 纸； 石头。

数字化之后： 同一个文件： 可以存在： 硬盘； 光纤； 内存； 云端。

于是：

Content

和：

Carrier

越来越解耦。 但绝不是：

Information

脱离物理世界。 正确结构：

LogicalIndependence↑ but PhysicalDependence\\ remains

### 九十六、第三条规律：存储不断把时间解耦

口头交流：

SenderTime = ReceiverTime

文字：

SenderTime ≠ ReceiverTime

所以：

Memory = TemporalDecoupling

这与能源中的储能高度相似。

### 九十七、第四条规律：通信不断把空间解耦

面对面：

SenderLocation = ReceiverLocation

电报、电话、互联网：

SenderLocation ≠ ReceiverLocation

于是：

Communication = SpatialDecoupling

### 九十八、因此信息文明也完成了两次巨大解耦

Memory ⇒ TimeDecoupling

系统性收束 / SYNTHESIS

## 把历史重新压缩成一条可解释的主线

1. 信息演化关键是保存差异、跨时空复制并接入反馈控制。
2. 载体革命扩大记忆半径，也制造噪声、过载和验证成本。
3. 信息被系统解释并改变行动时，才转为功能性意义。
4. AI 读取人类行为，又通过输出改变后续数据，形成反身性。

**重要限定：**物理信息、香农信息、语义、知识和智慧不是同一概念。信息量大不等于真实、相关或可行动。

[← 能量演化史](http://127.0.0.1:5509/reading/science/energy-evolution/)系统论长文集 · 从结构、反馈、信息与演化理解复杂世界[人体系统 →](http://127.0.0.1:5509/reading/science/human-body-system/)

---

来源：[https://cavno.org/reading/science/information-evolution/](https://cavno.org/reading/science/information-evolution/)
