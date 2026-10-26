/* 保留附件理论数据、四份原文与 Canvas 仿真规则；事件和主题限定在本页。 */
(() => {
 const root=document.getElementById('evo-app');if(!root) return;
 const byId=id=>root.querySelector('#'+id);

  function bindActions() {
    const actions={clearReaderSearch,copyFullSourceCode,downloadFullSourceCode,highlightAuditCriterion,openReaderAtCurrentStage,renderReaderContent,resetCanvasSimulation,selectCosmosStage,selectOmegaComp,selectParadoxEntity,selectReaderDoc,selectStage,setPSMode,setTopologyMode,stepStage,switchDetailSubTab,switchMainTab,toggleAutoPlay,toggleLucidQuestion,toggleTheme,triggerCanvasPerturbation,updateSimSliders};
    function handle(event) {
      const el=event.target.closest('[data-action]');
      if(!el || !root.contains(el) || el.dataset.event!==event.type) return;
      const action=actions[el.dataset.action];if(!action) return;
      const args=[];
      for(let i=1;el.hasAttribute('data-type'+i);i++) {
        const type=el.dataset['type'+i], value=el.dataset['arg'+i];
        args.push(type==='number'?Number(value):type==='boolean'?value==='true':type==='value'?el.value:value);
      }
      Promise.resolve(action(...args)).catch(error=>showToast(error.message));
    }
    ['click','input','change'].forEach(type=>root.addEventListener(type,handle));
  }

    // =========================================================================
    // 1. COMPLETE RIGOROUS DATA MODEL FOR THE 9-RING EVOLUTION CHAIN
    // =========================================================================
    const CHAIN_STAGES = [
      {
        index: 0,
        id: 'constraint',
        shortName: '约束',
        enName: 'Constraint (C₁)',
        cosmicMap: '无差别可能性 → 物理约束',
        transitionTitle: '起点：最初的“切割”与存在的第一条件',
        mathTag: '相空间裁剪 / 对称性守恒约束',
        coreQuote: '【本体论命题】存在的第一条件不是实体，而是约束。约束不是世界的缺陷，是世界的语法；自由场若无约束，永远弥散，无法形成稳定形态。',
        tension: '如果一切都可以任意发生（粒子质量随机跳跃、电荷守恒不复存在、相互作用剧烈变动、时空几何处于无序湍流），无差别的可能性空间将永远处于均质弥散的混沌场，不可能凝结出任何持续存在的对象。',
        mechanism: '最初的“切割”：在无差别的可能性空间中，划出“可以（被允许的状态）”与“不可以（被严格排除的状态）”的边界，从而产生第一层相空间差异（稳定能级态与不稳定激发态、允许跃迁与禁阻转换、各向异性吸引与排斥）。差异是关系的必要中介：约束 → 差异 → 关系 → 结构。',
        beat1: '在均质无限的可能性空间中施加允许/禁止边界，打破绝对均质，分化出“此/彼、高/低、正/负”的原始相空间差异。',
        beat2: '物理守恒律（规范对称性、能量守恒、电荷守恒）对随机涨落进行持续筛选与束缚。',
        beat3: '不可逆地排除禁阻态，使被允许的物理状态得以稳定留存，为“结构”的凝结提供底层语法。',
        processType: '过程 P（纯物理/几何边界切割，无需预设主观目的性）',
        matterMapping: '对应《生成链上的物质演化》第一、二阶段：物质演化最根本的第一步不是“先有实体”，而是“某些状态被允许，另一些状态被严格排除”。物理定律本身就是最底层、最根本的约束形式（约束 → 差异 → 关系 → 结构）。',
        socialMapping: '对应《约束、结构、秩序与自由》第一章“约束：世界的语法”：A限制了B的可能状态。约束先于大脑，独立于感知。必须避免两个陷阱：①物化（把历史建构的权力当成自然规律）；②虚无化（误以为约束只是想象而忽略因果）。同时必须区分“构成性约束”（语言语法、交通规则、生态边界，让你成为你）与“压制性约束”（专制、奴役、规训、结构性贫困）。在权力维度上，约束就是权力的物质化。',
        critiqueMapping: '在形式化分析中，“约束”是范畴 C_n 中的限定态射（Morphism）。对于“为什么宇宙最初恰好拥有这套物理约束参数”，观察者选择（人择原理）将其归结为幸存偏差，而形而上学目的论诉诸第一因。',
        docJump: { docIdx: 0, keyword: '第一阶段：约束使“可能性”凝结为“存在”' }
      },
      {
        index: 1,
        id: 'structure',
        shortName: '结构',
        enName: 'Structure (S₁)',
        cosmicMap: '基本粒子 (m, q, s) → 原子核 → 原子',
        transitionTitle: '跃迁 1：约束 → 结构（重复化 / 凝固机制）',
        mathTag: '高阶范畴论：态射对象化 F: C_n → C_{n+1}',
        coreQuote: '【核心定义】结构 = 被反复冻结的约束轨迹。对象的身份，本质上是一组稳定约束关系的代名词（约束 → 稳定属性 → 对象）。上一层的结构 ＝ 下一层的约束（C_n → S_n ⇒ C_{n+1}）。',
        tension: '约束本身是一次性的限定动作，若只发生一次，不会留下痕迹；但约束若在时间维度上反复作用于同一对象，就会产生路径依赖。',
        mechanism: '重复 + 记忆（迟滞/滞后效应，hysteresis）。系统“记得”上一次被约束过的状态，于是下一次约束是在已经变形的基础上再施加——差异被不断累积、锁定，最终从动态的“过程”沉淀为稳定的“状态”。',
        beat1: '同一约束动作在时间与空间维度上对基质进行反复多次的施加与变形累积。',
        beat2: '迟滞效应（Hysteresis）使上一次变形状态与下一次约束动作产生路径依赖耦合。',
        beat3: '动态的约束过程被锁定冻结为持久的稳定形态（如基本粒子 {m_e, q_e, s} 与离散原子壳层）。',
        processType: '过程 P（高阶范畴论“态射对象化”严格成立，但隐含“什么状态被保留”的标准）',
        matterMapping: '对应《物质演化》第三、四、五、六阶段：微观层面凝结出静止质量(m)、电荷(q)、自旋(s)等稳定内禀属性——电子之所以为电子，是因为被束缚在严格确定的守恒与量子约束集 {m_e, q_e, s, interaction} 中。进而质子+中子→原子核，原子核+电子→原子。更确立了【跨层级嵌套律】：上一层的结构 = 下一层的约束（C_1 → S_1 → C_2 → S_2）。',
        socialMapping: '对应《约束、结构、秩序与自由》第二章“结构：看不见的关系如何统治可见的事物”：约束沉淀下来就形成结构。你看见一个人失业/焦虑/被算法困住，看不见背后的失业结构/绩效结构/平台结构/父权结构/资本结构。结构分配可能性（农村与都市中产面对不同的可能性空间），并通过制度、习惯、话语持续再生产自己。结构 = 权力的关系化。',
        critiqueMapping: '在范畴论形式化中，“约束→结构”对应把 C_n 中被反复稳定的态射（路径）提升为高阶范畴 C_{n+1} 中的单一对象，即“态射的对象化（Reification of Morphisms）”，数学上严格完备。但达尔文自然选择与 Friston 自由能框架均无法解释这最初一步（此时尚无复制载体与内部稳态模型）。',
        docJump: { docIdx: 1, keyword: '1. 约束 → 结构：重复化 / 凝固机制' }
      },
      {
        index: 2,
        id: 'relation',
        shortName: '关系',
        enName: 'Relation (R)',
        cosmicMap: '原子间化学键 → 分子 (2H+O≠H₂O) → 生物大分子',
        transitionTitle: '跃迁 2：结构 → 关系（共域耦合机制）',
        mathTag: '古典信息论：非零互信息 I(X; Y) > 0',
        coreQuote: '【核心定义】关系 = 多元结构争夺/共享同一基质时被迫打开的交互通道。结构给出“节点”，关系给出“连接”。约束减少了低层自由度，却在系统高层创造了全新的自由度（自由度代偿律）。',
        tension: '单一结构只是“有差异的存在”，但一旦存在不止一个结构单元，它们必然共享同一个基质/资源/空间（能量、信息、物质总量有限），这种“共存”本身就制造了相互依赖的生存压力。',
        mechanism: '差异的增殖（从一到多）+ 资源竞争或互补迫使单元之间产生信息或能量交换通道。关系不是被预先设计出来的，而是多个结构共存于有限基质中的必然副产品。',
        beat1: '结构单元从单一走向多元并置（范畴论中的对象余积 Coproduct），共享有限空间与能量基质。',
        beat2: '单元之间因电子云轨道、化合价、空间构象互补或资源竞争建立非零互信息通道 I(X;Y) > 0。',
        beat3: '稳定共价键、离子键与氢键网络锁定，涌现出单个孤立原子绝不具备的高阶整体属性。',
        processType: '过程 P（古典信息论互信息 I(X;Y) > 0 严格刻画静态关联）',
        matterMapping: '对应《物质演化》第六、七、八阶段（第五阶段：原子到分子——关系开始占据主导）：在经典算式中 2H + O ≠ H₂O。两个氢原子和一个氧原子结合后，各自原有的三维平动自由度被束缚，但整体涌现出偶极矩、氢键网络、常温液态流动性、高比热容与广谱溶解能力。【自由度代偿律】与【约束—复杂性悖论】：低层约束增加 ⟹ 高层可能性增加。',
        socialMapping: '对应《约束、结构、秩序与自由》总结与第二章：一旦有了稳定结构，就有了“内部”与“外部”、“这个”与“那个”。关系不是附加物，是结构存在的必然产物。社会结构正是哪些元素以什么方式连接、排斥、依赖、交换的关系模式。',
        critiqueMapping: '静态“关系”可用互信息 I(X; Y) > 0 严格定义；但松散的关系网络是脆弱的——任何一条关系断裂都不影响其他关系，静态互信息尚不足以解释“为什么关系会闭合成有边界的整体系统”。',
        docJump: { docIdx: 0, keyword: '八、第五阶段：原子到分子——关系开始占据主导' }
      },
      {
        index: 3,
        id: 'system',
        shortName: '系统',
        enName: 'System (Sys)',
        cosmicMap: '脂质双分子半透膜闭合 → 原始细胞边界创生',
        transitionTitle: '跃迁 3：关系 → 系统（反馈闭合机制）',
        mathTag: '传递熵 Transfer Entropy / 因果涌现 Causal Emergence',
        coreQuote: '【核心定义】系统 = 关系通过反馈自我闭合后产生的、有边界的整体性。【系统三要素】系统 ＝ 边界（Boundary） + 流动（Flow） + 反馈（Feedback）。',
        tension: '松散的关系网络是极其脆弱的——任何一条关系的偶然断裂都不影响其他关系，整体缺乏持续“存在的理由”（石英晶体虽精密有序，但只是被动静态物）。',
        mechanism: '当关系之间出现反馈回路（A维持B、B反过来维持A），尤其是正反馈稳定化 + 负反馈纠偏共同作用时，关系网络开始表现出抵抗扰动、自我维持的倾向。此时自然产生一个“内/外”边界——凡是参与闭环互动的都是“内”，不参与闭环的都是“外”。',
        beat1: '多元关系网络在开放能量流中交织出多条潜在的正向与反向作用支路。',
        beat2: 'A维持B、B反过来维持A的自催化反馈回路闭合，正反馈稳固结构，负反馈抵抗外界涨落。',
        beat3: '半透膜物理闭合，首次在客观物理世界中实存化地切割出“内部状态（Inside）”与“外部环境（Outside）”。',
        processType: '过程 P → 过程 S 交界（动态闭环需借用传递熵/因果涌现，开始涉及维持自身的评价导向）',
        matterMapping: '对应《物质演化》第九阶段（第六阶段：结构跃升为系统——“内与外”的创生）：生命史上最关键的物理分水岭是脂质双分子“膜”的闭合。膜的物理闭合首次将世界无可辩驳地分割为“内部状态（Inside）”与“外部环境（Outside）”，实现了边界 + 流动 + 反馈三位一体的跃迁。',
        socialMapping: '对应《约束、结构、秩序与自由》第三章“系统：边界、反馈与自我维持”：生态系统、经济体、免疫系统、平台、国家、自我都是系统。系统不是物，是过程。但须警惕“系统理性对生活世界的殖民”：当市场、技术、绩效系统只追求效率、增长、控制，人不再使用系统，而是被系统使用。系统 = 权力的运作化。',
        critiqueMapping: '在形式化检验中，从静态互信息迈向动态闭环系统需要引入传递熵或 Erik Hoel 的“因果涌现（Causal Emergence）”框架（衡量宏观因果力是否超越微观部分之和）。这属于前沿但尚未完全公理化定型的领域。',
        docJump: { docIdx: 0, keyword: '九、第六阶段：结构跃升为系统——“内与外”的创生' }
      },
      {
        index: 4,
        id: 'organization',
        shortName: '组织',
        enName: 'Organization (Org)',
        cosmicMap: '非平衡耗散结构 → 自创生生命组织（主动维持约束）',
        transitionTitle: '跃迁 4：系统 → 组织（扰动筛选 / 不变量提炼机制）',
        mathTag: '选择算子 S 破防点：自创生 Autopoiesis 与非平衡耗散',
        coreQuote: '【核心定义】组织 = 系统在反复扰动历史中被筛选出的“不可让渡的关系模式”。组织 ＝ 结构在时间维度上的主动自我维持（被动承受约束 ──跃迁至── 主动维持约束）。',
        tension: '花岗岩的存在是惰性的，但生命系统的存在是悬在热力学悬崖边上的动态成就。系统持续暴露在环境扰动之下，有些内部关系一受扰动系统便瓦解，有些关系在反复扰动中必须保持恒定。',
        mechanism: '扰动筛选过程（作用于系统内部关系）：经历足够多次扰动后，那些“不能变、一变系统就崩溃”的关键关系被提炼出来，固化为决定系统身份的“组织（Organization）”；其余可自由变化、只影响具体实现方式的部分留在“结构（Structure）”层面继续漂移（Maturana & Varela 自创生理论）。系统通过吸纳高品位自由能（Energy In）、排放高熵热量（Entropy Out），主动做功维持跨膜离子梯度、pH稳态与基因保真度。',
        beat1: '系统在时间长河中遭遇各类环境热力学扰动与内部关系涨落。',
        beat2: '能源流 + 选择性边界 + 负反馈纠偏 + 自催化循环协同抵抗热力学平衡态（熵增同化）。',
        beat3: '提炼并锁定决定“这还是不是同一个系统”的不可让渡核心关系模式（组织），将外在约束内化为主动维持的约束。',
        processType: '过程 S 强行介入（选择算子 S 需预设“想要维持自身存在”的目标函数，形式化在此彻底破防！）',
        matterMapping: '对应《物质演化》第十、十一、十二阶段：从平衡物质到非平衡组织（耗散结构物理学），构成物质演化史上第一道生死分野。更实现了波澜壮阔的哲学转折——【约束维持机制的内化】：非生命结构靠外在定律被动维持，生命系统调动内生力量“主动维持约束”，构成数十亿年后人类反身自由最古老的物质先祖。',
        socialMapping: '对应《约束、结构、秩序与自由》总结与第四章“秩序：时间中的可预期性”：系统在时间中自我维持、自我复制、自我修复，呈现组织性；系统在时间中反复呈现的模式就是秩序（自然秩序、社会秩序、话语秩序、技术秩序、资本秩序、全球秩序）。',
        critiqueMapping: '【算子 Ω 形式化彻底破防处】“固化”出组织需要一个选择算子 S 和适应度标准。若说“标准 = 维持系统存在本身”，则“组织”在逻辑因果上先于产生它的固化机制而存在了，陷入循环论证！达尔文自然选择在此阶段可部分填补（需复制机制已存在），但仍有“适者生存”同义反复之争。',
        docJump: { docIdx: 1, keyword: '4. 系统 → 组织：扰动筛选 / 不变量提炼机制' }
      },
      {
        index: 5,
        id: 'virtual_real',
        shortName: '虚实分化 / 秩序',
        enName: 'Virtual-Real Split / Order',
        cosmicMap: '功能价值信息（意义的物质起源）→ 脱耦符号/神经信号媒介',
        transitionTitle: '跃迁 5：组织 → 虚实分化（去耦合 / 媒介中立化机制）',
        mathTag: '多重可实现性 Multiple Realizability / 能指-所指脱耦',
        coreQuote: '【核心定义】虚实分化 = 组织为了获得“前瞻预测性”而演化出的、与实体本身相脱耦的内部表征媒介。【意义的物质起源】中性物理信息 ──跃迁至── 带有生存利害的功能价值信息。',
        tension: '一个仅能维持组织的系统只能“被动应对”当下的直接物理扰动；但若环境扰动变化的速度超过了系统物理响应的极限速度，组织为了存活，就必须在时间上提前预知扰动。这要求系统内部产生一种“不是那个物理实体、但能够代表那个物理实体”的中介。',
        mechanism: '多重可实现性（multiple realizability）——某种物理载体（神经电信号、化学分子、符号、基因编码等）脱离了它所代表的物理对象本身，可以独立于“实（实际存在之物）”而在系统内部被快速操纵、组合与推演。这个脱耦的内部媒介层就是“虚（被表征、被建模、被符号化之物）”。同时，组织为了维持自身，区分“内部状态（实，自我确认的锚点）”与“外部环境（虚，赖以生存的背景）”，将中性物理场转化为带有生存利害的意义场。',
        beat1: '外部环境变化速度超越物理响应极限，纯物理直接应激通路面临生存危机。',
        beat2: '内部微能量载体（电化学信号/符号）与外部粗重物理实体实现“去耦合（Decoupling）”与映射绑定。',
        beat3: '固化出独立于物理实体、可低成本高速推演的内部表征媒介层（“虚”层）与功能价值信息。',
        processType: '过程 S（依赖外部环境速度条件与生存利害评价函数）',
        matterMapping: '对应《物质演化》第十三阶段（第七阶段：组织产生信息——客观世界的“意义化”）：对大肠杆菌而言，葡萄糖梯度意味着“赖以充能的营养场”，重金属离子意味着“致命威胁”，光子通量意味着“指引趋光运动的能量灯塔”。同一片客观物理天地，在自维持需求下分化出“价值”与“意义”维度。',
        socialMapping: '对应《约束、结构、秩序与自由》总结与第四、五章：组织区分内部状态（实）与外部环境（虚）；而在社会秩序层面，话语秩序、符号体系、货币信用与算法界面构成了强大的表征层——地图不是领土，但地图能导航，话语与知识参与构造现实。',
        critiqueMapping: '【全链最关键薄弱环节之一】《深度解析》明确指出：第5步（组织→虚实分化）暗中引入了“环境变化速度超过系统物理响应速度”这一外部条件，而非纯粹内在逻辑推演。若外部环境绝对静止恒常，组织完全可以永久停留在纯物理自创生阶段而不演化出表征能力。',
        docJump: { docIdx: 1, keyword: '5. 组织 → 虚实分化：去耦合 / 媒介中立化机制' }
      },
      {
        index: 6,
        id: 'cognition',
        shortName: '认知',
        enName: 'Cognition (Cog)',
        cosmicMap: '神经系统 → 特化中枢大脑（约 10¹¹ 神经元环境因果仿真）',
        transitionTitle: '跃迁 6：虚实分化 → 认知（误差比对机制）',
        mathTag: '变分自由能最小化 / 预测误差最小化 Δe = |实 - 虚|',
        coreQuote: '【核心定义】认知 = 系统持续处理“虚”与“实”之间落差的动态操作系统。【认知的控制论本质】过去经验记忆 + 当前感觉输入 → 未来因果预测 → 行为输出。',
        tension: '一旦内部的“虚”（模型/表征）与外部的“实”（现实环境）并存，两者几乎必然不完全吻合——这个预测落差（误差）本身就是信息，也是系统演化的核心驱动力。',
        mechanism: '系统演化出专门比对“虚”与“实”、计算落差误差、并用误差反向修正内部表征模型或调控外部行动的操作集合——这套动态纠偏过程就是认知（高度契合预测误差最小化与 Karl Friston 主动推理 Active Inference 框架）。',
        beat1: '内部“虚”表征模型持续生成关于外部环境状态的多种预测轨迹。',
        beat2: '感觉输入将外部“实”状态与内部“虚”预测进行实时误差比对（计算惊异度 Surprise / 预测落差）。',
        beat3: '通过修正内部生成模型或预先调控机体行动，固化出高效自适应的因果模拟操作系统（认知）。',
        processType: '过程 S（Friston 变分自由能最小化框架的核心领地，但目标函数藏于“先验分布”预设中）',
        matterMapping: '对应《物质演化》第十四、十五阶段：从机械反应（刺激→简单反应）拉伸为（刺激→内部稳态评估→价值判断→行为选择），再到中枢大脑（约 10¹¹ 神经元、上百兆突触）的（过去经验记忆+当前感觉输入→未来因果预测→行为输出）。【心物连续生成谱系】彻底缝合心物二元论鸿沟：认知本就是高度组织化物质为应对高维熵增挑战而演化出的核心功能。',
        socialMapping: '对应《约束、结构、秩序与自由》总结：能区分虚实，就能建模环境，预测未来，调整行为。认知是组织在虚实边界上生长出的导航系统。但在现代技术与话语秩序中，算法与平台会通过操控信息流来窄化或塑造主体的认知模型。',
        critiqueMapping: 'Friston 的自由能最小化/主动推理模型精准覆盖此阶段，将认知归结为最小化长期预测误差期望值（惊异度）。但代价审查表明：“最小化自由能”唯有在系统已被预设为“渴望维持特定稳态先验分布（Prior Distribution）”时才成立，目的性 S 被编码进了数学先验中。',
        docJump: { docIdx: 0, keyword: '十四、从机械反应到能动认知：环境仿真模型的萌发' }
      },
      {
        index: 7,
        id: 'self_ref',
        shortName: '自指',
        enName: 'Self-Reference (Self)',
        cosmicMap: '世界模型 ＋ 自我模型 (Model of Self) → “我”的破茧',
        transitionTitle: '跃迁 7：认知 → 自指（递归纳入自身机制）',
        mathTag: '二阶控制论 / 卢曼自我指涉 Selbstreferenz 递归不动点',
        coreQuote: '【核心定义】自指 = 认知能力递归地把自身系统也当作表征对象时发生的认知闭环。【自我的系统论本质】“我” ＝ 高度自组织的复杂物质系统对自身持续存在状态构建的动态元模型。',
        tension: '认知系统在对外部世界建构表征模型的过程中，迟早会遭遇一个特殊的物理实体——系统自身（因为“认知操作”本身也是这个世界因果链条的一部分，且在直接影响外界结果）。',
        mechanism: '当系统的表征计算能力足够强，能够把“自己正在认知”这一元操作也纳入被表征的对象集合之中，就闭合出了递归环路——认知的输出（对自身状态的模型）重新变成了认知的输入（世界模型 ──跃迁至── 世界模型 ＋ 自我模型）。这一步依赖“计算带宽冗余”。',
        beat1: '表征算力冗余突破临界阈值，表征对象从外部事物扩展至系统自身的感知与行动过程。',
        beat2: '认知系统的输出（自我状态表征）递归反馈回认知系统的输入端，形成观察自身的二阶控制闭环。',
        beat3: '固化出持续性的第一人称动态元模型——“自我（The Self）”，涌现向下因果效力。',
        processType: '过程 S（依赖“表征带宽恰好冗余”的经验跃迁与二阶观察目标）',
        matterMapping: '对应《物质演化》第十六、十七阶段（第八阶段：认知产生自指——“我”的破茧）：系统具备了第一人称元认知视野（我身处何种坐标？我处于何种稳态？他者如何凝视我？我的历史记忆与未来轨迹是什么？）。“我”绝非虚幻骗局，而是如国家秩序、货币信用、语言体系一样具有不可替代向下因果效力的高阶宏观结构，能以全局指令调动百亿神经元协同重构现实。',
        socialMapping: '对应《约束、结构、秩序与自由》第六章“主体：结构如何栖居于人之中”：自指产生“我”——一个将自己识别为实体的认知结构。主体不是预先存在的，而是在家庭、学校、媒体、算法、语言中被塑造的（主体化）。但正因为有自指，主体能够“意识到自己被塑造，质疑塑造自己的力量”——开启反主体化与反身性。',
        critiqueMapping: '【全链薄弱环节之二】《深度解析》指出：认知→自指依赖于“表征带宽恰好冗余到足以纳入自身”，这更像演化史上的小概率经验事实而非逻辑必然；此外，皮亚杰发生认识论等流派认为初级身体边界感知（初级自指）可能先于高阶表征认知出现，两者存在协同螺旋演进。',
        docJump: { docIdx: 0, keyword: '十六、第八阶段：认知产生自指——“我”的破茧' }
      },
      {
        index: 8,
        id: 'freedom',
        shortName: '自由 (=元约束₂)',
        enName: 'Freedom (Meta-Constraint C₂)',
        cosmicMap: '反事实空间建模 → 反身主体与文明立法（螺旋升维新起点）',
        transitionTitle: '跃迁 8：自指 → 自由（约束的可及性 / 可修改机制）',
        mathTag: '反事实模拟 Counterfactual Modeling / 黑格尔“自我规定” C₁ ↦ C₂',
        coreQuote: '【核心定义】自由 = 自指使约束从“被盲目给定”转化为“可被系统自身重新设定”后，所获得的自我立法与重构能力。自由不是没有约束，而是在约束中看见约束、选择约束、成为自己行动的作者！',
        tension: '单纯停留在“辨识我是谁”的镜中镜像，依然不等于自由。在先前阶段中，约束是不可见的绝对边界条件（系统只能在其中行动，无法观察边界本身）；自指打开了“元层级”与“反事实空间（我现在处于状态A，但我本可选择进入状态B）”，使系统首次直面“现实（The Actual）”与“可能（The Possible）”的张力。',
        mechanism: '一旦约束变得可见，系统便能够分辨“哪些约束是维持自身存续所必需的组织基底（构成性约束）”与“哪些约束纯属历史偶然或压制性约束、完全可以被打破或替换”，并对后者展开主动干预与重写。“谁在设定约束”这一根本权力，从外部环境/盲目历史转移到了系统自身内部。同时，自由设定的新规则成为下一轮螺旋升维的初始约束（自由 ＝ 自我设定的元约束₂）！',
        beat1: '通过反事实空间建模（Counterfactual Modeling），在认识论层面展开“现实状态 A”之外的多重“可能世界 B/C”。',
        beat2: '元认知审视并区分“构成性约束”与“压制性/历史偶然约束”，对支配自身的目标函数 S 发起追问与裁决。',
        beat3: '自我立法、自我限制、自我修正，将选定的规则固化为新一轮螺旋演化的元约束（C₂），实现从“被规定”到“参与规定世界”的逆转。',
        processType: '过程 S 的反身逆转（系统首次掉转头来追问并改写“目标函数 S 是谁给的”）',
        matterMapping: '对应《物质演化》第十八、十九、二十、二十五、二十六阶段：【宇宙约束演进大序列】被动受制于约束 → 主动利用约束 → 内部维持约束 → 认知理解约束 → 自由选择约束。自由不是物理定律的例外与裂隙，而是物质组织高度复杂化后涌现出的最高形态自适应控制机能。',
        socialMapping: '对应《约束、结构、秩序与自由》第七至十章：自由至少包含四要素（有选项、非纯外部强制、实际能实现、参与制造结果并承担后果）。必须警惕五种伪装的自由（消费、绩效、退出、表达、精神自由），通过“清醒自由五问”在约束中成为自己行动的作者，与他人一起创造可被反思和修改的新秩序。',
        critiqueMapping: '【终极哲学判词】自由在数学本质上虽仍是过程 S 第 n 次迭代的产物，但它的崇高独特性在于：这一次的目标函数指向了“修改先前目标函数的权限”——系统第一次成为有资格反思、质疑并重新裁决目的性 S 的最高法庭，并开启螺旋拓扑的下一轮（C₁ → … → 自由 = C₂ → …）。',
        docJump: { docIdx: 0, keyword: '十九、第十阶段：自由的全面降临——约束权能的逆转' }
      }
    ];

    // =========================================================================
    // 2. OPERATOR OMEGA FORMALIZATION DATA (FROM DOC 2 & DOC 3)
    // =========================================================================
    const OMEGA_COMPONENTS = [
      {
        id: 'omega-1',
        name: '1. 增殖 (Proliferation)',
        tool: '范畴论之对象余积 (Coproduct, X ⊔ Y)',
        status: '严格成立 · 无争议',
        statusColor: 'emerald',
        summary: '设第 n 层对象与保结构映射构成范畴 C_n。增殖对应于 C_n 中对象的余积——多个同层对象被平权并置于同一范畴语境中，不追加任何额外约束，单纯作为多元基质并存。',
        detail: '在形式化检验中，这一步完全站得住脚：范畴论天然适合刻画“多个同层单元并置”。它属于纯粹的过程 P（组合展开），不需要引入任何目的性假设。'
      },
      {
        id: 'omega-2',
        name: '2. 结构化 (Reification of Morphisms)',
        tool: '高阶范畴论之态射对象化 (Functor F: C_n → C_{n+1})',
        status: '严格成立 · 成熟理论支撑',
        statusColor: 'emerald',
        summary: '把 C_n 中一个被动态约束反复锁定的态射（动作/路径），通过函子 F: C_n → C_{n+1} 提升为高阶范畴 C_{n+1} 中的单个对象（状态）。',
        detail: '“约束→结构”这种范畴性质变（从动态限定动作沉淀为持久稳定状态）恰好对应高阶范畴论（∞-category）中的“态射对象化（reification of morphisms）”——两个对象之间的关联路径本身被当作新一阶独立对象处理。形式化诚实且有效。'
      },
      {
        id: 'omega-3',
        name: '3. 耦合 · 静态关系 (Static Coupling)',
        tool: '古典信息论之互信息 I(X; Y) > θ',
        status: '严格成立 · 标准公理化工具',
        statusColor: 'emerald',
        summary: '“关系”本质上是两个结构单元（随机变量 X, Y）之间存在非零（或超越阈值 θ）的互信息 I(X; Y) > 0。',
        detail: '只要互信息大于阈值，两个结构单元之间便确立了客观的统计依赖与信息/能量交换通道。这一步使用古典香农信息论即可严格定义。'
      },
      {
        id: 'omega-4',
        name: '4. 耦合 · 动态闭环系统 (Dynamic Feedback Loop)',
        tool: '非平衡信息论之传递熵 (Transfer Entropy) / 因果涌现 (Causal Emergence)',
        status: '前沿可行 · 尚无统一定论',
        statusColor: 'amber',
        summary: '静态互信息无法刻画“耦合成有边界的自我维持系统”。系统需要信息在闭环中反馈纠偏，需借用传递熵或 Erik Hoel 的因果涌现框架。',
        detail: '因果涌现（Causal Emergence）试图在数学上衡量“宏观整体层面的有效信息/因果力是否超越微观部分层面因果力之和”。这一步形式化具备可行性，但借用的是学界仍在争论的前沿概念，而非已完全定型的公理定理。'
      },
      {
        id: 'omega-5',
        name: '5. 固化 / 选择 (Selection / Solidification)',
        tool: '需预设目标函数/适应度度量的选择算子 S',
        status: '彻底破防 · 陷入循环论证',
        statusColor: 'rose',
        summary: '在众多可能的耦合状态中保留某些“不可让渡的不变量”并淘汰其余，数学上必须预设一个目标函数（Objective Function）。但这个目标函数从何而来？',
        detail: '【致命破防诊断】如果宣称“目标函数 = 维持系统自身存在”，那就是用系统“组织层”已经预先设定的意图，去解释“组织”本身的产生！组织在逻辑因果上竟然先于创造它的物理机制而存在了。目前没有任何已知数学框架能从纯粹无目的的“增殖+耦合（过程 P）”中无循环论证地内生推导出“目标导向的选择（过程 S）”。我们只能公理化假定算子 S 存在，而无法推导它。'
      }
    ];

    // =========================================================================
    // 3. FOUR INTERDISCIPLINARY SCHEMES FOR PROCESS S (FROM DOC 2 & DOC 3)
    // =========================================================================
    const FOUR_SCHEMES = [
      {
        id: 'darwin',
        title: '方案一：自然选择模型（达尔文主义生物学）',
        badge: '生物学范式',
        paradigm: '目标函数 = “差异化复制 + 差异化留存”。不需要预设生物主观想活下去，只需统计事实：复制更多、更稳定的变体占比自然上升。',
        whereHidden: '藏匿于“适应度（Fitness）”的定义本身（存活后的事后倒推）',
        honesty: '部分承认（生物学哲学界已就“适者生存”同义反复问题充分争论数十年）',
        falsifiability: '中等（若用存活前可测量的生理特征如代谢率、抗旱系数独立定义适应度，漏洞可部分修补）',
        loopAudit: '部分避免。巧妙将目的性伪装成纯统计过程，但常陷入“谁存活？适者；谁是适者？存活者”的适应度同义反复漏洞。',
        testAudit: '可部分独立检验（需在存活前以物理生理指标独立定义适应度）。',
        scopeAudit: '严格受限于“已经存在自我复制机制”的层级！最多只能填补“系统→组织”这一段，对最初“约束→结构”完全无能为力（原始物理演化尚无复制载体，它预设了自己本应解释的前提）。'
      },
      {
        id: 'friston',
        title: '方案二：自由能最小化 / 主动推理（Karl Friston 框架）',
        badge: '当代认知科学范式',
        paradigm: '目标函数 = “系统抵抗热力学耗散，最小化长期的惊异度（Surprise，即预测误差期望值）”。试图统一解释生命、虚实分化、认知与自指。',
        whereHidden: '藏匿于变分贝叶斯生成模型的“先验概率分布（Prior Distribution）”技术设定中',
        honesty: '极少承认（通常被繁复优美的信息几何与变分推断数学推导所包装掩饰）',
        falsifiability: '中等（在特定脑区预测误差神经信号层面可证伪；但在生命起源层面不可测）',
        loopAudit: '看似避免，实则可疑。“最小化自由能”唯有在系统已被预先设定为“想要维持某种内部稳态分布”时才有意义——目的性没有消失，只是被搬进了“先验分布”预设中。',
        testAudit: '局部神经微回路层面可做实证预测，但对于“为什么会有自我维持系统”这一根本起源问题，理论本身承认是预设而非推导。',
        scopeAudit: '精准覆盖虚实分化、认知到自指的高阶阶段，但对“约束→结构”最初一步同样保持沉默——它必须从一个已经具有内部状态与马尔可夫毯边界的既成系统开始讲起。'
      },
      {
        id: 'anthropic',
        title: '方案三：观察者选择效应（人择原理 / 宇宙学范式）',
        badge: '宇宙学与科学哲学范式',
        paradigm: '将问题倒置：在所有可能的宇宙/系统参数配置中，唯有那些碰巧产生出自我维持与反思认知系统的配置，才会被观察到并被追问此问题。',
        whereHidden: '藏匿于提问前提本身（过程 S 在问题框架重置中被悬置消解为幸存者偏差）',
        honesty: '部分承认（直言放弃具体因果机制追问，常被批评为“逃避问题而非解决问题”）',
        falsifiability: '极弱（结构上几乎不可能被独立证伪，近乎先验重言式）',
        loopAudit: '最激进、最狡黠的规避方式：形式逻辑上确实不循环，因为它把“为什么”从因果事实重定义为筛选事实，但代价是彻底缴械了科学因果解释的雄心。',
        testAudit: '极弱。在经验实证主义框架下几乎无法设计独立证伪实验。',
        scopeAudit: '概念上能“覆盖”整条九环链条（针对元问题），但正因为它什么都能覆盖，批评者指出它丧失了对任何具体跃迁机制的生成性解释力。'
      },
      {
        id: 'teleology',
        title: '方案四：神学 / 形而上学目的论（古典哲学范式）',
        badge: '古典形而上学范式',
        paradigm: '目标函数由外在于物质系统的主体意志（神、造物主、亚里士多德“目的因”、黑格尔“绝对精神”、大道）作为第一因直接注入。',
        whereHidden: '藏匿于超越经验物理世界的“外部第一因 / 超验主体”之中',
        honesty: '完全承认（毫不掩饰地公开声明目的性先于物质世界并从外部高层注入）',
        falsifiability: '不可经验检验（超越实证科学界限，属于形而上学与信仰层面的先验分歧）',
        loopAudit: '公开承认不予避免内生推导，坦然接纳外部第一因。从“检验是否偷渡假设”的方法论角度看，它比把目的性偷偷藏进数学先验里的做法反而更坦白。',
        testAudit: '属于非经验可裁决的形而上学命题，面临与人择原理及先验预设相似的方法论挑战。',
        scopeAudit: '解释范围理论上无限（第一因可解释包括“为何有最初物理约束”在内的一切），但代价是将全部解释力建立在一个自身不再接受理性解释的终极实体之上（“往上一层甩锅”的极致形式）。'
      }
    ];

    // =========================================================================
    // 4. ELEVEN STAGES OF COSMIC MATERIAL EVOLUTION (FROM DOC 1 TABLE & 26 SECS)
    // =========================================================================
    const COSMOS_11_STAGES = [
      {
        step: 1,
        name: '基础物理',
        constraint: '时空守恒定律、基本相互作用、规范对称性',
        structure: '基本粒子（夸克、轻子、玻色子）',
        emergence: '获得质量(m)、电荷(q)、自旋(s)等最初的稳定内禀物理属性',
        ladder: '第1步：服从约束',
        lawTitle: '【本体论命题 & 对象生成原理】存在的第一条件不是实体，而是约束',
        deepText: '物质演化最根本的第一步不是“先有实体”，而是“某些状态被允许，另一些状态被严格排除”。一个电子之所以为电子，并非其内部铭刻着先验的“电子本质”，而是因为它始终被牢牢束缚在一组严格确定的守恒与量子约束关系集 {m_e, q_e, s, interaction} 之中。对象的身份，本质上是一组稳定约束关系的代名词。'
      },
      {
        step: 2,
        name: '核物理',
        constraint: '强相互作用、核结合能、结合态约束',
        structure: '原子核（质子与中子之紧密结合）',
        emergence: '确立核稳定性，奠定元素周期表多样性的物理基石',
        ladder: '第1步：服从约束',
        lawTitle: '【差异发生链】约束 → 差异 → 关系 → 结构',
        deepText: '微观粒子绝非肆意混乱堆叠，它们受到强相互作用、核结合能与对称守恒定律的严格筛选，质子与中子克服库仑排斥紧密结合为稳定的原子核，收敛为数量有限的稳定高阶组合。'
      },
      {
        step: 3,
        name: '原子物理',
        constraint: '麦克斯韦电磁规律、泡利不相容、量子壳层',
        structure: '稳定原子（核与核外电子云束缚）',
        emergence: '展现离散能级、特定化合价与独特的化学反应倾向',
        ladder: '第1-2步：服从/利用约束',
        lawTitle: '【跨层级嵌套律】上一层的结构 ＝ 下一层的约束（C_n → S_n ⇒ C_{n+1}）',
        deepText: '粒子结构作为新约束限定核外电子分布，沉淀出“原子结构”。当特定的原子结构确立之后，其所能参与的化学反应已被预先限定：特定的电子云轨道、确定的化合价与离散能级，开始刚性规定下一层级的可能性空间。'
      },
      {
        step: 4,
        name: '化学演化',
        constraint: '共价键、离子键、分子轨道能量最低原理',
        structure: '各类分子结构（简单化合物到有机物，如 H₂O）',
        emergence: '展现多样化学反应、空间立体构型、偶极矩、氢键网络与液态流动性',
        ladder: '第2步：利用约束',
        lawTitle: '【自由度代偿律】2H + O ≠ H₂O：约束减少了低层自由度，却在系统高层创造了全新自由度',
        deepText: '两个氢原子和一个氧原子结合后，原子各自原有的三维平动自由度被束缚；但作为一个整体，水分子却涌现出单个孤立原子绝不具备的新特性：偶极矩、分子间氢键网络、常温常压下的液态流动性、高比热容、表面张力以及广谱溶解能力。结构不在任何单一元素之中，而实存且生效于元素之间的动态关系网络里。'
      },
      {
        step: 5,
        name: '高分子科学',
        constraint: '分子立体几何折叠热力学、空间构象互补',
        structure: '生物大分子（功能蛋白、核酸、磷脂）',
        emergence: '涌现高效专一催化、空间自组装与模板信息自复制',
        ladder: '第2-3步：利用/维持约束过渡',
        lawTitle: '【约束—结构循环】C₁ → S₁ → C₂ → S₂ → … → C_n → S_n',
        deepText: '原子能级与轨道结构约束共价/离子键沉淀出分子结构；分子立体几何进一步约束空间折叠，沉淀出蛋白质、核酸与磷脂双分子层，涌现出锁钥般的专一酶催化与模板自复制能力。'
      },
      {
        step: 6,
        name: '原始生命',
        constraint: '半透脂质双分子膜闭合、非平衡自催化代谢网络',
        structure: '自创生原始细胞（单细胞生物原形）',
        emergence: '确立内外部边界划分(Inside/Outside)，实现跨膜梯度与能量自维持',
        ladder: '第3步：维持约束',
        lawTitle: '【系统三要素 & 约束维持机制的内化】被动承受约束 ──跃迁至── 主动维持约束',
        deepText: '石英晶体和花岗岩的存在是惰性的；但生命系统悬在热力学悬崖边上，通过脂质双分子“膜”的闭合首次将世界分割为内部(Inside)与外部(Outside)。它不断吸纳高品位自由能(Energy In)、排放高熵热量(Entropy Out)，主动做功维持跨膜离子浓度差、pH弱碱稳态与ATP能量通货——这是物质演化史上第一道生死分野，也是人类反身自由最古老的物质先祖。'
      },
      {
        step: 7,
        name: '生物组织',
        constraint: '细胞分化间质通讯、遗传编程、形态发生场',
        structure: '多细胞复杂生命体与组织器官',
        emergence: '形成精细生理劳动分工、全身免疫防卫与内稳态调节',
        ladder: '第3-4步：维持与感知约束',
        lawTitle: '【意义的物质起源】中性物理信息 ──跃迁至── 带有生存利害的功能价值信息',
        deepText: '当生命组织必须主动做功维持自身时，客观物理世界首次被赋予“功能价值与主观意义”：葡萄糖浓度梯度意味着“营养场”，重金属离子意味着“致命威胁”，光子通量意味着“指引趋光运动的能量灯塔”。分化后的体细胞虽丧失了任意迁徙变异的低阶自由度，却使多细胞整体获得了强大的内稳态调节能力。'
      },
      {
        step: 8,
        name: '神经系统',
        constraint: '神经元动作电位、化学突触可塑性传递网络',
        structure: '神经节与外周感觉-运动反射回路',
        emergence: '实现毫秒级快速环境应激、感知统合与联想学习能力',
        ladder: '第4步：感知约束',
        lawTitle: '【从机械反应到能动评估】刺激 → 内部稳态评估 → 价值判断 → 行为选择',
        deepText: '为了克服纯生化扩散反应的滞后性，神经元通过电化学动作电位与化学突触可塑性，将简单的“刺激→反应”拉伸为多级内部稳态评估与感知统合回路，在高速变化的环境中夺取生存主动权。'
      },
      {
        step: 9,
        name: '中枢大脑',
        constraint: '皮层层级柱结构、长程联络纤维环路网络',
        structure: '高度特化中枢大脑（具表征功能网络，约 10¹¹ 神经元）',
        emergence: '构建精细全息的外部世界仿真因果模型(Model of World)与行为预测',
        ladder: '第5步：预测约束',
        lawTitle: '【认知的控制论本质 & 心物连续生成谱系】利用内部表征对外部环境展开因果模拟',
        deepText: '单个人类神经元仅具简并的动作电位发放；但约 10¹¹ 个神经元经上百兆突触连接形成复杂大脑结构后，涌现出“过去经验记忆 + 当前感觉输入 → 未来因果预测 → 行为输出”的认知能力。真正需要追问的不是“无机砖块如何拼出灵魂”，而是“物质组织演进到了何种自创生深度，才必须建立关于自身与环境的内部全息模型”。'
      },
      {
        step: 10,
        name: '自我系统',
        constraint: '情境自传体记忆、符号语言系统、社会交往规约',
        structure: '持续性自我认知模型（“我”的概念，Model of Self）',
        emergence: '认知过程转向自身，确立主客体间性与自指反射闭环',
        ladder: '第6步：理解约束',
        lawTitle: '【自指演进模型】世界模型 ──跃迁至── 世界模型 ＋ 自我模型（“我”的破茧）',
        deepText: '系统把自身作为因果互动中的一个实体，递归地绘制进世界模型之中，具备了第一人称元认知视野。“我”＝高度自组织的复杂物质系统对自身持续存在状态构建的动态元模型。它虽不单存于任何一个钙离子或神经递质分子中，却具有不可替代的向下因果效力，能以全局指令调动百亿神经元协同重构现实。'
      },
      {
        step: 11,
        name: '反身主体',
        constraint: '二阶元认知监控、道德反思理性、反事实建模',
        structure: '具反身性的自由主体与文明实践秩序',
        emergence: '跳出既定框架，实现对自身约束的审视、选择与自我立法',
        ladder: '第7步：重新设定约束',
        lawTitle: '【反事实空间建模 & 约束权能的逆转】自由是物质组织涌现出的最高形态自适应控制机能',
        deepText: '通过反事实模拟（“我现在处于状态A，但我意识到我本可选择进入状态B”），划开“现实”与“可能”的深渊。自由从来不是自然规律在局部被凭空取消，而是物质自组织攀爬过极度复杂的约束阶梯后，演化出的对自身状态、未来概率分布乃至底层运行规则展开全局建模与主动调节的高阶控制能力！'
      }
    ];

    // =========================================================================
    // 5. CONSTRAINT-FREEDOM PARADOX ENTITIES (FROM DOC 1 SEC 22 & 23)
    // =========================================================================
    const PARADOX_ENTITIES = [
      {
        name: '🪨 荒原上的一颗顽石',
        constraintCount: 1,
        freedomScore: 2,
        layers: ['底层物理重力、摩擦力与弱风化侵蚀约束'],
        capabilities: '几乎为零（完全被动承受环境势阱，无自维持、无感知、无行动疆域）',
        insight: '受到的约束极其简朴，但无人会认为石头的自由度高于人类。缺乏多层约束结构，就无法开辟高维可能性空间。'
      },
      {
        name: '⚡ 孤立自由电子',
        constraintCount: 2,
        freedomScore: 10,
        layers: ['时空守恒定律与规范对称性', '固定内禀属性约束集 {m_e, q_e, s, interaction}'],
        capabilities: '微观量子态跃迁与电磁相互作用，但无法独立形成宏观复杂功能',
        insight: '获得了最初的稳定身份，但尚未进入多层次共域耦合。'
      },
      {
        name: '💧 水分子 (H₂O)',
        constraintCount: 4,
        freedomScore: 30,
        layers: ['基础物理守恒约束', '核物理结合态约束', '原子能级与量子壳层排布约束', 'H-O-H 共价键角(104.5°)与电子云共有拓扑约束'],
        capabilities: '涌现出单个氢/氧原子绝不具备的偶极矩、氢键网络、常温液态流动性、高比热容、表面张力与广谱溶解能力',
        insight: '【自由度代偿律】两个氢原子和一个氧原子各自的三维平动自由度被强行束缚，却在分子整体高层开启了全新的液态化学可能性空间（2H + O ≠ H₂O）。'
      },
      {
        name: '🦠 原生单细胞生命（如大肠杆菌）',
        constraintCount: 6,
        freedomScore: 60,
        layers: ['物理守恒律', '原子与化学键约束', '生物大分子立体折叠约束', '半透脂质双分子膜闭合边界', '非平衡自催化代谢与ATP稳态约束', '核内基因序列保真度约束'],
        capabilities: '跨膜离子梯度主动维持、趋化性导航（将葡萄糖识别为营养意义场、重金属识别为威胁）、自我修复与自我复制',
        insight: '通过加速大环境熵增的代价，用层层内部生化约束锁定了局部持久低熵，实现了从“被动承受约束”到“主动维持约束”的生死跨越。'
      },
      {
        name: '🧠 现代反身人类主体',
        constraintCount: 10,
        freedomScore: 98,
        layers: [
          '基础物理与热力学守恒定律',
          '化学键与生物大分子折叠约束',
          '生理代谢底线与体细胞分化约束',
          '10¹¹ 神经元传递规律与突触网络约束',
          '认知误差校准与偏差防御机制',
          '自然语言严格的词法与句法结构铁律',
          '形式逻辑严禁矛盾推理的法则',
          '道德伦理戒律与社会习俗沉淀',
          '宪政法治刑律规章（陌生人跨时空协作基础）',
          '数字技术协议与科学方法论规范'
        ],
        capabilities: '纵横四海、探秘微观夸克、翱翔外层太空、传达高深哲学思想、构建现代科学大厦、跨时空规模化协作、构思艺术，以及审视并重写自身约束规则！',
        insight: '【自由—约束正相关悖论】高阶存在绝没有侥幸逃脱底层的任何一道物理法则；相反，它身负最厚重的多层嵌套约束。若无语法约束，心灵将囚禁于荒蛮嘶吼；若无逻辑约束，科学大厦无从拔地而起；若无法治约束，大规模陌生人协作绝无可能。高阶约束必然催生高阶能力！'
      }
    ];

    // =========================================================================
    // 6. DISGUISED FREEDOMS & LUCID FREEDOM 5 QUESTIONS (FROM DOC 4 CH 8-10)
    // =========================================================================
    const DISGUISED_FREEDOMS = [
      {
        title: '1. 消费自由的伪装',
        illusion: '让你以为“买什么、选哪个品牌”就是自由。',
        reality: '消费完全不触动底层分配秩序。你可以在货架间自由选择，但选项早已被商业资本与广告设定，“做自己”被彻底商品化。'
      },
      {
        title: '2. 绩效自由的伪装',
        illusion: '让你以为“拼命成功、自我优化”就是自由。',
        reality: '成功可能只是成为秩序里的高级囚徒。韩炳哲指出：今天的自由与强迫合二为一，你自由地加班、自由地焦虑、自由地自我剥削，自己抽自己。'
      },
      {
        title: '3. 退出自由的伪装',
        illusion: '让你以为“离开、辞职、归隐”就是彻底自由。',
        reality: '个体的孤立退出并不改变压制性的社会结构本身，结构依然在持续再生产不平等与排斥。'
      },
      {
        title: '4. 表达自由的伪装',
        illusion: '让你以为“随时发声、展示个性”就是自由。',
        reality: '话语早已被框定，可见性完全被平台算法与流量逻辑决定——表达被流量化，连接被数据化。'
      },
      {
        title: '5. 精神自由的伪装',
        illusion: '让你以为“想开点、内心平静”就是自由。',
        reality: '新自由主义把结构性问题个体化（“不成功是因为不够努力/不够自律”）。纯粹的心态调整绝不能取代客观物质条件与结构改革。'
      }
    ];

    const LUCID_QUESTIONS = [
      { q: '① 秩序反思度', text: '它只是让我更顺从地适应既有秩序，还是让我能反思和改写秩序？', checked: true },
      { q: '② 他者扩展度', text: '它只扩展我一个人的特权与可能性，还是也扩展他人的可能性？', checked: true },
      { q: '③ 结构穿透度', text: '它把结构性压迫问题个体化（怪罪个人），还是揭示并改变结构？', checked: true },
      { q: '④ 支配警惕度', text: '它是不是在推翻旧规则时，仅仅用一种新的支配替代了旧的支配？', checked: true },
      { q: '⑤ 团结与担责', text: '它是否诚实承认对他人与生态的依赖、主动承担后果、并包含团结？', checked: true }
    ];

    // =========================================================================
    // 7. APPLICATION STATE & INITIALIZATION
    // =========================================================================
    let currentMainTab = 'sandbox';
    let currentStageIdx = 0;
    let currentTopologyMode = 'linear'; // 'linear' | 'spiral'
    let currentDetailSubTab = 'matter'; // 'matter' | 'social' | 'critique'
    let autoPlayTimer = null;

    // Simulation Sliders
    let simParam1 = 75; // Constraint strength / repetition
    let simParam2 = 60; // Perturbation speed / coupling
    let simParam3 = 80; // Bandwidth redundancy / reflexivity
    let simPerturbPulse = 0;

    // Tab 2 State
    let selectedOmegaIdx = 4; // Default to Selection S (the breakdown point)
    let psSimMode = 'PS_ALT'; // 'P_ONLY' | 'PS_ALT'
    let activeAuditCriterion = 'all';

    // Tab 3 State
    let selectedCosmosStageIdx = 0;
    let selectedParadoxEntityIdx = 4;

    // Tab 5 Reader State
    let rawDocs = [];
    let selectedDocIdx = 0;

    // Animation Frame IDs
    let mainCanvasAnimId = null;
    let psCanvasAnimId = null;
    let cosmosCanvasAnimId = null;

    // Canvas Particle / Node State Pool
    const simParticles = [];
    for (let i = 0; i < 68; i++) {
      simParticles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.008,
        vy: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2,
        type: i % 3, // 0: cyan, 1: indigo, 2: emerald
        history: []
      });
    }

    let canvasPointer = { x: 0.5, y: 0.5, active: false };

    function showToast(msg) {
      const banner = byId('toastBanner');
      const txt = byId('toastText');
      if (!banner || !txt) return;
      txt.textContent = msg;
      banner.classList.remove('hidden');
      setTimeout(() => {
        banner.classList.add('hidden');
      }, 2600);
    }

    function toggleTheme() {
      const htmlEl = root;
      htmlEl.classList.toggle('dark');
      const isDark = htmlEl.classList.contains('dark');
      try {
        localStorage.setItem('evo_theme', isDark ? 'dark' : 'light');
      } catch (e) {}
      showToast(isDark ? '已切换至深空科研暗色主题' : '已切换至学术纸本浅色主题');
    }

    // Switch Top-Level Tabs
    function switchMainTab(tabId) {
      currentMainTab = tabId;
      const tabs = ['sandbox', 'formal', 'cosmos', 'social', 'reader', 'source'];
      tabs.forEach(t => {
        const view = byId('view-' + t);
        const btn = byId('tabBtn-' + t);
        if (view) {
          if (t === tabId) view.classList.remove('hidden');
          else view.classList.add('hidden');
        }
        if (btn) {
          if (t === tabId) {
            btn.className = 'main-tab-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap bg-sky-500 text-white shadow-sm transition';
          } else if (t === 'source') {
            btn.className = 'main-tab-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition';
          } else {
            btn.className = 'main-tab-btn px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap bg-slate-800/70 text-slate-300 hover:bg-slate-700/70 transition';
          }
        }
      });

      if (tabId === 'source') {
        populateSourceCodeView();
      }
      // Resize canvases on tab switch
      setTimeout(() => {
        resizeAllCanvases();
      }, 40);
    }

    // =========================================================================
    // 8. TAB 1: 9-RING SANDBOX UI & CONTROLS
    // =========================================================================
    function renderChainBar() {
      const container = byId('chainBarContainer');
      const pillsContainer = byId('transitionPillsContainer');
      if (!container || !pillsContainer) return;

      container.innerHTML = CHAIN_STAGES.map((st, idx) => {
        const isActive = idx === currentStageIdx;
        const activeCls = isActive
          ? 'active bg-gradient-to-br from-sky-500/30 via-indigo-500/25 to-emerald-500/20 border-sky-400 text-white'
          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600';
        return `
          <button type="button" data-action="selectStage" data-event="click" data-arg1="${idx}" data-type1="number" class="chain-node-btn p-2.5 rounded-xl border text-left flex flex-col justify-between ${activeCls}">
            <div class="flex items-center justify-between w-full">
              <span class="text-[10px] font-mono ${isActive ? 'text-sky-300 font-bold' : 'text-slate-500'}">0${idx + 1}</span>
              <span class="text-[10px] font-mono ${idx < 3 ? 'text-sky-400' : 'text-amber-400'}">${idx < 3 ? '过程P' : '过程S'}</span>
            </div>
            <div class="font-bold text-xs sm:text-sm mt-1 truncate">${st.shortName}</div>
            <div class="text-[10px] text-slate-400 truncate mt-0.5">${st.enName}</div>
          </button>
        `;
      }).join('');

      const transitionNames = [
        '① 重复化/凝固',
        '② 共域耦合',
        '③ 反馈闭合',
        '④ 扰动筛选/不变量',
        '⑤ 去耦合/媒介中立化',
        '⑥ 误差比对纠偏',
        '⑦ 递归纳入自身',
        '⑧ 约束可及与重写'
      ];
      pillsContainer.innerHTML = transitionNames.map((tName, idx) => {
        const targetStage = idx + 1;
        const isCurrent = currentStageIdx === targetStage;
        const cls = isCurrent
          ? 'bg-indigo-500 text-white border-indigo-400 font-bold'
          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700';
        return `
          <button type="button" data-action="selectStage" data-event="click" data-arg1="${targetStage}" data-type1="number" class="px-2.5 py-1 rounded-full text-[11px] border whitespace-nowrap transition ${cls}">
            ${tName} → ${CHAIN_STAGES[targetStage].shortName}
          </button>
        `;
      }).join('');
    }

    function selectStage(idx) {
      currentStageIdx = (idx + CHAIN_STAGES.length) % CHAIN_STAGES.length;
      simPerturbPulse = 0.6;
      renderChainBar();
      updateSandboxDetails();
    }

    function stepStage(delta) {
      selectStage(currentStageIdx + delta);
    }

    function setTopologyMode(mode) {
      currentTopologyMode = mode;
      const btnLin = byId('btnTopologyLinear');
      const btnSpi = byId('btnTopologySpiral');
      if (btnLin && btnSpi) {
        if (mode === 'linear') {
          btnLin.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-white transition';
          btnSpi.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        } else {
          btnSpi.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-white transition';
          btnLin.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        }
      }
      updateSandboxDetails();
    }

    function toggleAutoPlay() {
      const btn = byId('btnAutoPlay');
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        if (btn) {
          btn.textContent = '▶ 自动推演全链';
          btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition';
        }
      } else {
        autoPlayTimer = setInterval(() => {
          stepStage(1);
        }, 4200);
        if (btn) {
          btn.textContent = '⏸ 暂停自动推演';
          btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-500 transition';
        }
      }
    }

    function triggerCanvasPerturbation() {
      simPerturbPulse = 1.5;
      simParticles.forEach(p => {
        p.vx += (Math.random() - 0.5) * 0.025;
        p.vy += (Math.random() - 0.5) * 0.025;
      });
    }

    function resetCanvasSimulation() {
      byId('simSlider1').value = 75;
      byId('simSlider2').value = 60;
      byId('simSlider3').value = 80;
      updateSimSliders();
      triggerCanvasPerturbation();
    }

    function updateSimSliders() {
      const s1 = byId('simSlider1');
      const s2 = byId('simSlider2');
      const s3 = byId('simSlider3');
      if (!s1 || !s2 || !s3) return;
      simParam1 = Number(s1.value);
      simParam2 = Number(s2.value);
      simParam3 = Number(s3.value);
      byId('slider1Val').textContent = simParam1 + '%';
      byId('slider2Val').textContent = simParam2 + '%';
      byId('slider3Val').textContent = simParam3 + '%';
    }

    function switchDetailSubTab(subTab) {
      currentDetailSubTab = subTab;
      ['matter', 'social', 'critique'].forEach(t => {
        const btn = byId('subTabBtn-' + t);
        if (btn) {
          if (t === subTab) {
            btn.className = 'detail-subtab px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40';
          } else {
            btn.className = 'detail-subtab px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-400 hover:text-slate-200';
          }
        }
      });
      updateSandboxDetails();
    }

    function updateSandboxDetails() {
      const st = CHAIN_STAGES[currentStageIdx];
      byId('simStageBadge').textContent = currentTopologyMode === 'spiral'
        ? `SPIRAL TOPOLOGY · RING 0${st.index + 1}`
        : `STAGE 0${st.index + 1} / 09`;
      byId('simStageTitle').textContent = currentTopologyMode === 'spiral'
        ? `螺旋升维拓扑视图：从约束₁ 到 自由（=自我设定的元约束₂）`
        : `${st.shortName} (${st.enName}) — ${st.cosmicMap}`;

      byId('hudFormulaBadge').textContent = st.coreQuote.split('。')[0] + '。';
      byId('hudMetricsLine').textContent =
        `当前节点: 0${st.index + 1}-${st.shortName} | 数学机制: ${st.mathTag} | ${st.processType.split('（')[0]}`;

      byId('beat1Text').textContent = st.beat1;
      byId('beat2Text').textContent = st.beat2;
      byId('beat3Text').textContent = st.beat3;

      const psBadge = byId('processPSBadge');
      if (psBadge) {
        psBadge.textContent = st.processType;
        psBadge.className = st.index < 3
          ? 'text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300'
          : 'text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300';
      }

      byId('detailCoreQuote').textContent = st.coreQuote;
      byId('detailTransitionHeader').textContent = st.transitionTitle;
      byId('detailMathTag').textContent = st.mathTag;
      byId('detailTension').textContent = st.tension;
      byId('detailMechanism').textContent = st.mechanism;

      const subContent = byId('detailSubContent');
      if (currentDetailSubTab === 'matter') {
        subContent.innerHTML = `<div class="font-bold text-sky-400 mb-1">🌌 物质演化大历史对应（《生成链上的物质演化》）：</div><p>${st.matterMapping}</p>`;
      } else if (currentDetailSubTab === 'social') {
        subContent.innerHTML = `<div class="font-bold text-emerald-400 mb-1">🏛️ 社会秩序、权力与主体对应（《约束、结构、秩序与自由》）：</div><p>${st.socialMapping}</p>`;
      } else {
        subContent.innerHTML = `<div class="font-bold text-amber-400 mb-1">🔍 形式化检验与科学哲学批判（《深度解析》&《形式化探讨》）：</div><p>${st.critiqueMapping}</p>`;
      }
    }

    function openReaderAtCurrentStage() {
      const st = CHAIN_STAGES[currentStageIdx];
      selectedDocIdx = st.docJump.docIdx;
      switchMainTab('reader');
      const searchInput = byId('readerSearchInput');
      if (searchInput) {
        searchInput.value = st.shortName === '自由 (=元约束₂)' ? '自由' : st.shortName.split(' ')[0];
      }
      renderReaderDocTabs();
      renderReaderContent();
    }

    // =========================================================================
    // 9. INTERACTIVE HTML5 CANVAS ENGINE FOR THE 9 STAGES & SPIRAL TOPOLOGY
    // =========================================================================
    function setupCanvasInteractions() {
      const canvas = byId('evolutionCanvas');
      if (!canvas) return;

      const updateCoord = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvasPointer.x = (clientX - rect.left) / rect.width;
          canvasPointer.y = (clientY - rect.top) / rect.height;
        }
      };

      canvas.addEventListener('mousemove', e => {
        canvasPointer.active = true;
        updateCoord(e.clientX, e.clientY);
      });
      canvas.addEventListener('mouseleave', () => {
        canvasPointer.active = false;
      });
      canvas.addEventListener('mousedown', e => {
        updateCoord(e.clientX, e.clientY);
        if (currentTopologyMode === 'spiral') {
          // Check if user clicked near one of the 9 spiral nodes
          const w = canvas.width;
          const h = canvas.height;
          const cx = w * 0.5;
          const cy = h * 0.52;
          for (let i = 0; i < 9; i++) {
            const angle = -Math.PI * 0.75 + i * (Math.PI * 1.85 / 8);
            const r = Math.min(w, h) * (0.12 + i * 0.033);
            const nx = cx + Math.cos(angle) * r;
            const ny = cy + Math.sin(angle) * r;
            const dx = canvasPointer.x * w - nx;
            const dy = canvasPointer.y * h - ny;
            if (Math.hypot(dx, dy) < 28) {
              selectStage(i);
              return;
            }
          }
        }
        triggerCanvasPerturbation();
      });
      canvas.addEventListener('touchstart', e => {
        if (e.touches.length > 0) {
          canvasPointer.active = true;
          updateCoord(e.touches[0].clientX, e.touches[0].clientY);
          triggerCanvasPerturbation();
        }
      }, { passive: true });
    }

    function resizeAllCanvases() {
      ['evolutionCanvas', 'psCanvas', 'cosmosCanvas'].forEach(id => {
        const c = byId(id);
        if (c && c.parentElement) {
          const rect = c.parentElement.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            c.width = rect.width;
            c.height = rect.height;
            const scroller=c.parentElement.parentElement;
            if(scroller.classList.contains('ep-canvas-scroll') && scroller.scrollWidth>scroller.clientWidth)
              scroller.scrollLeft=(scroller.scrollWidth-scroller.clientWidth)/2;
          }
        }
      });
    }

    function startMainCanvasLoop() {
      if (mainCanvasAnimId) cancelAnimationFrame(mainCanvasAnimId);
      let t = 0;

      function render() {
        t += 0.018;
        if (simPerturbPulse > 0) simPerturbPulse = Math.max(0, simPerturbPulse - 0.02);

        const canvas = byId('evolutionCanvas');
        if (canvas && currentMainTab === 'sandbox') {
          const ctx = canvas.getContext('2d');
          const w = canvas.width;
          const h = canvas.height;
          if (w > 0 && h > 0) {
            ctx.clearRect(0, 0, w, h);

            // Subtle scientific grid background
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
            ctx.lineWidth = 1;
            const gridStep = 36;
            for (let gx = 0; gx < w; gx += gridStep) {
              ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 0; gy < h; gy += gridStep) {
              ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }

            if (currentTopologyMode === 'spiral') {
              drawSpiralTopology(ctx, w, h, t);
            } else {
              drawStageSimulation(ctx, w, h, t, currentStageIdx);
            }
          }
        }
        mainCanvasAnimId = requestAnimationFrame(render);
      }
      mainCanvasAnimId = requestAnimationFrame(render);
    }

    // Draw the Spiral Ascending Topology (Constraint_1 -> ... -> Freedom = Meta-Constraint_2)
    function drawSpiralTopology(ctx, w, h, t) {
      const cx = w * 0.5;
      const cy = h * 0.53;
      const maxR = Math.min(w, h) * 0.39;

      // Draw continuous spiral curve
      ctx.beginPath();
      for (let s = 0; s <= 220; s++) {
        const u = s / 200;
        const angle = -Math.PI * 0.75 + u * (Math.PI * 1.85);
        const r = Math.min(w, h) * 0.11 + u * (maxR - Math.min(w, h) * 0.11);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw recursive feedback loop from Ring 9 (Freedom = Meta-Constraint 2) back to elevated Center
      const a0 = -Math.PI * 0.75;
      const r0 = Math.min(w, h) * 0.12;
      const x0 = cx + Math.cos(a0) * r0;
      const y0 = cy + Math.sin(a0) * r0;

      const a8 = -Math.PI * 0.75 + Math.PI * 1.85;
      const r8 = Math.min(w, h) * (0.12 + 8 * 0.033);
      const x8 = cx + Math.cos(a8) * r8;
      const y8 = cy + Math.sin(a8) * r8;

      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x8, y8);
      ctx.quadraticCurveTo(cx + maxR * 0.95, cy - maxR * 0.9, x0, y0 - 28);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
      ctx.fillText('🔄 螺旋升维：自由 = 自我设定的元约束₂ (进入下一轮更高阶循环)', cx - 150, 56);

      // Draw the 9 nodes along the spiral
      for (let i = 0; i < 9; i++) {
        const angle = -Math.PI * 0.75 + i * (Math.PI * 1.85 / 8);
        const r = Math.min(w, h) * (0.12 + i * 0.033);
        const nx = cx + Math.cos(angle) * r;
        const ny = cy + Math.sin(angle) * r;
        const isSelected = i === currentStageIdx;

        // Pulse ring if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(nx, ny, 22 + Math.sin(t * 3) * 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(nx, ny, isSelected ? 16 : 12, 0, Math.PI * 2);
        ctx.fillStyle = i < 3 ? '#0284c7' : i < 8 ? '#6366f1' : '#10b981';
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0' + (i + 1), nx, ny);

        ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
        ctx.font = (isSelected ? 'bold 13px ' : '12px ') + '"Noto Sans SC", sans-serif';
        const labelOffset = ny > cy ? 24 : -20;
        ctx.fillText(CHAIN_STAGES[i].shortName, nx, ny + labelOffset);
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    }

    // Draw the Stage-Specific Physics & Cybernetics Simulation
    function drawStageSimulation(ctx, w, h, t, stageIdx) {
      const cStrength = simParam1 / 100;
      const pSpeed = simParam2 / 100;
      const bRedundancy = simParam3 / 100;
      const cx = w * 0.5;
      const cy = h * 0.54;

      if (stageIdx === 0) {
        // STAGE 1: CONSTRAINT (Slicing infinite possibility space into Allowed vs Forbidden phase zones)
        const bandHalfH = Math.max(28, (1 - cStrength * 0.72) * (h * 0.42));

        // Forbidden top & bottom zones
        ctx.fillStyle = 'rgba(244, 63, 94, 0.10)';
        ctx.fillRect(0, 0, w, cy - bandHalfH);
        ctx.fillRect(0, cy + bandHalfH, w, h - (cy + bandHalfH));

        // Allowed phase-space channel
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.fillRect(0, cy - bandHalfH, w, bandHalfH * 2);

        // Constraint boundary lines
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, cy - bandHalfH); ctx.lineTo(w, cy - bandHalfH);
        ctx.moveTo(0, cy + bandHalfH); ctx.lineTo(w, cy + bandHalfH);
        ctx.stroke();

        ctx.fillStyle = '#fb7185';
        ctx.font = '12px "Noto Sans SC", sans-serif';
        ctx.fillText('⛔ 禁阻相空间（被物理定律不可逆排除的状态）', 18, cy - bandHalfH - 10);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('✅ 允许相空间（约束切割出的稳定存在通道：约束 → 差异）', 18, cy - bandHalfH + 20);

        simParticles.forEach(p => {
          p.x += p.vx * (1.2 + (1 - cStrength) * 2 + simPerturbPulse);
          p.y += p.vy * (1.2 + (1 - cStrength) * 2 + simPerturbPulse);
          if (p.x < 0.02 || p.x > 0.98) p.vx *= -1;
          const py = p.y * h;
          if (cStrength > 0.15) {
            if (py < cy - bandHalfH + 8) { p.y = (cy - bandHalfH + 8) / h; p.vy = Math.abs(p.vy); }
            if (py > cy + bandHalfH - 8) { p.y = (cy + bandHalfH - 8) / h; p.vy = -Math.abs(p.vy); }
          } else {
            if (p.y < 0.02 || p.y > 0.98) p.vy *= -1;
          }

          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = p.type === 0 ? '#38bdf8' : p.type === 1 ? '#818cf8' : '#34d399';
          ctx.fill();
        });
      }
      else if (stageIdx === 1) {
        // STAGE 2: STRUCTURE (Hysteresis & Repeated Freezing of Constraint Trajectories into Stable Nodes)
        const nodes = [
          { x: w * 0.28, y: cy, label: '基本粒子 {m, q, s}' },
          { x: w * 0.52, y: cy - 45, label: '原子核 (质子+中子)' },
          { x: w * 0.74, y: cy + 35, label: '稳定原子轨道结构' }
        ];

        // Draw hysteresis memory rings
        nodes.forEach((nd, idx) => {
          const rings = Math.max(2, Math.floor(cStrength * 6));
          for (let r = 1; r <= rings; r++) {
            ctx.beginPath();
            ctx.arc(nd.x, nd.y, r * 14 + Math.sin(t * 2 + idx) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 + (rings - r) * 0.06})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 11, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(nd.label, nd.x, nd.y + 42);
        });
        ctx.textAlign = 'left';

        simParticles.slice(0, 36).forEach((p, idx) => {
          const target = nodes[idx % nodes.length];
          const angle = t * (1.2 + (idx % 5) * 0.2) + p.phase;
          const orbitR = 24 + (idx % 3) * 14 + (1 - cStrength) * 55;
          const px = target.x + Math.cos(angle) * orbitR;
          const py = target.y + Math.sin(angle) * orbitR;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#818cf8';
          ctx.fill();
        });
      }
      else if (stageIdx === 2) {
        // STAGE 3: RELATION (Co-domain coupling & 2H + O -> H2O emergence)
        const oX = cx;
        const oY = cy - 15;
        const bondDist = 72 + (1 - pSpeed) * 45;
        const halfAngle = (104.5 / 2) * (Math.PI / 180);
        const h1X = oX - Math.sin(halfAngle) * bondDist;
        const h1Y = oY + Math.cos(halfAngle) * bondDist;
        const h2X = oX + Math.sin(halfAngle) * bondDist;
        const h2Y = oY + Math.cos(halfAngle) * bondDist;

        // Shared electron cloud & mutual information I(X;Y) > 0
        const grad = ctx.createRadialGradient(oX, oY + 20, 10, oX, oY + 20, bondDist * 1.45);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(oX, oY + 20, bondDist * 1.45, 0, Math.PI * 2);
        ctx.fill();

        // Covalent bond channels
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(oX, oY); ctx.lineTo(h1X, h1Y);
        ctx.moveTo(oX, oY); ctx.lineTo(h2X, h2Y);
        ctx.stroke();

        // Bond angle arc
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(oX, oY, 34, Math.PI * 0.5 - halfAngle, Math.PI * 0.5 + halfAngle);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('104.5° 共价键角 (I(X;Y)>0)', oX, oY + 52);

        // Oxygen & Hydrogen nodes
        ctx.beginPath(); ctx.arc(oX, oY, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7'; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif';
        ctx.fillText('O (δ⁻)', oX, oY + 4);

        [ [h1X, h1Y, 'H₁ (δ⁺)'], [h2X, h2Y, 'H₂ (δ⁺)'] ].forEach(([hx, hy, lbl]) => {
          ctx.beginPath(); ctx.arc(hx, hy, 16, 0, Math.PI * 2);
          ctx.fillStyle = '#6366f1'; ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
          ctx.fillText(lbl, hx, hy + 4);
        });

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
        ctx.fillText('2H + O ≠ H₂O：低层平动自由度被锁死 → 涌现偶极矩、氢键网络与液态流动性', cx, h - 22);
        ctx.textAlign = 'left';
      }
      else if (stageIdx === 3) {
        // STAGE 4: SYSTEM (Feedback Closure + Inside/Outside Semi-permeable Membrane Boundary)
        const memR = Math.min(w, h) * 0.29 + Math.sin(t * 2.5) * 4;

        // External environment label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.font = '12px "Noto Sans SC", sans-serif';
        ctx.fillText('🌍 外部环境 (Outside — 不参与反馈闭环)', 20, h - 22);

        // Semi-permeable membrane (Boundary)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, memR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 6]);
        ctx.strokeStyle = '#34d399';
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛡️ 脂质双分子半透膜边界 (Inside 内部闭环系统)', cx, cy - memR - 12);

        // Internal feedback loop nodes A <-> B <-> C
        const loopNodes = [0, 1, 2].map(k => {
          const a = t * (0.8 + pSpeed * 0.8) + (k * Math.PI * 2) / 3;
          return {
            x: cx + Math.cos(a) * (memR * 0.55),
            y: cy + Math.sin(a) * (memR * 0.55),
            name: k === 0 ? 'A (自催化)' : k === 1 ? 'B (正反馈稳固)' : 'C (负反馈纠偏)'
          };
        });

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        loopNodes.forEach((n, i) => {
          const next = loopNodes[(i + 1) % 3];
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(next.x, next.y);
        });
        ctx.stroke();

        loopNodes.forEach(n => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '11px "Noto Sans SC", sans-serif';
          ctx.fillText(n.name, n.x, n.y + 26);
        });
        ctx.textAlign = 'left';
      }
      else if (stageIdx === 4) {
        // STAGE 5: ORGANIZATION (Non-equilibrium Dissipative Autopoiesis: Invariant Core Organization vs Variable Structure)
        const orgR = Math.min(w, h) * 0.18;
        const structR = Math.min(w, h) * 0.31;

        // Energy In (Left) & Entropy Out (Right) arrows
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
        ctx.fillText('⚡ 高品位自由能输入 (Energy In)', 18, cy - 10);
        ctx.fillStyle = '#fb7185';
        ctx.fillText('🔥 高熵热量排出 (Entropy Out)', w - 205, cy - 10);

        // Outer drifting Structure ring
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(cx, cy, structR + Math.sin(t * 4) * (8 * pSpeed), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Inner invariant Organization core (Maturana & Varela)
        ctx.beginPath();
        ctx.arc(cx, cy, orgR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.16)';
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#fb7185';
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
        ctx.fillText('核心【组织 Organization】', cx, cy - 4);
        ctx.font = '11px "Noto Sans SC", sans-serif';
        ctx.fillText('不可让渡的不变量 (主动维持约束)', cx, cy + 14);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText('外围【结构 Structure】：可变实现方式（随扰动漂移调节）', cx, cy + structR + 22);
        ctx.textAlign = 'left';
      }
      else if (stageIdx === 5) {
        // STAGE 6: VIRTUAL-REAL SPLIT / ORDER (Decoupled Internal Symbolic Layer "虚" vs Physical Reality "实")
        const leftX = w * 0.29;
        const rightX = w * 0.71;

        // External Reality ("实")
        ctx.beginPath();
        ctx.arc(leftX, cy, 68, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Moving target in external reality
        const realTargetX = leftX + Math.cos(t * (1.5 + pSpeed * 2)) * 42;
        const realTargetY = cy + Math.sin(t * (1.5 + pSpeed * 2)) * 42;
        ctx.beginPath(); ctx.arc(realTargetX, realTargetY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24'; ctx.fill();

        // Internal Decoupled Representation ("虚")
        ctx.beginPath();
        ctx.arc(rightX, cy, 68, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Fast forward-simulated virtual symbol in "虚"
        const leadPhase = t * (1.5 + pSpeed * 2) + 0.55;
        const virtX = rightX + Math.cos(leadPhase) * 42;
        const virtY = cy + Math.sin(leadPhase) * 42;
        ctx.beginPath(); ctx.arc(virtX, virtY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8'; ctx.fill();

        // Decoupling / Mapping bridge
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.7)';
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(realTargetX, realTargetY);
        ctx.lineTo(virtX, virtY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 13px "Noto Sans SC", sans-serif';
        ctx.fillText('【实】外部物理现实与存在基质', leftX, cy + 92);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('【虚】脱耦的内部符号/神经表征媒介（超前推演）', rightX, cy + 92);
        ctx.textAlign = 'left';
      }
      else if (stageIdx === 6) {
        // STAGE 7: COGNITION (Active Inference: Comparing "虚" Model & "实" Reality to Minimize Prediction Error)
        const plotLeft = 50;
        const plotRight = w - 50;
        const plotW = plotRight - plotLeft;

        // Draw "实" wave (Amber) and "虚" prediction wave (Cyan)
        ctx.lineWidth = 2.5;
        // Real wave
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const u = i / 100;
          const x = plotLeft + u * plotW;
          const y = cy + Math.sin(u * 8 + t * 2.2) * 55 + Math.cos(u * 13 - t) * 20;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#fbbf24';
        ctx.stroke();

        // Predicted wave (phase lag shrinks as cStrength / calibration increases)
        const errorLag = (1 - cStrength) * 1.1 + 0.08;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const u = i / 100;
          const x = plotLeft + u * plotW;
          const y = cy + Math.sin(u * 8 + t * 2.2 - errorLag) * (55 * (0.75 + 0.25 * cStrength)) + Math.cos(u * 13 - t - errorLag) * 20;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
        ctx.fillText('━ 外部现实状态轨迹（实）', plotLeft, h - 42);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('━ 内部表征模型预测轨迹（虚）', plotLeft + 185, h - 42);
        ctx.fillStyle = '#34d399';
        ctx.fillText(`⚡ 实时预测误差 Δe = ${(errorLag * 42).toFixed(1)}% (认知 = 持续比对并消除虚实落差的操作系统)`, plotLeft, h - 20);
      }
      else if (stageIdx === 7) {
        // STAGE 8: SELF-REFERENCE (Second-Order Cybernetics: Model of World + Recursive Model of Self)
        // Outer World Model ring
        ctx.beginPath();
        ctx.arc(cx, cy, 108, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner Recursive Self-Model ring (appears strongly when bandwidth redundancy bRedundancy > 0.3)
        const selfAlpha = Math.max(0.25, bRedundancy);
        ctx.beginPath();
        ctx.arc(cx, cy, 62, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${selfAlpha * 0.22})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(167, 139, 250, ${selfAlpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Recursive inner mirror ("Observing the Observer")
        ctx.beginPath();
        ctx.arc(cx, cy, 26 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#c084fc';
        ctx.fill();

        // Orbiting feedback signal feeding output back into input
        const sigA = t * 2.4;
        const sx = cx + Math.cos(sigA) * 62;
        const sy = cy + Math.sin(sigA) * 62;
        ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399'; ctx.fill();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
        ctx.fillText('“我” (Self)', cx, cy + 4);
        ctx.fillStyle = '#c084fc';
        ctx.fillText('二阶自指闭环：正在观察“自己正在认知”的元模型', cx, cy + 86);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('外环：外部世界模型 (Model of World)', cx, cy - 118);
        ctx.textAlign = 'left';
      }
      else if (stageIdx === 8) {
        // STAGE 9: FREEDOM (= Self-Imposed Meta-Constraint C2 & Counterfactual Space Simulation)
        const originX = w * 0.22;
        const originY = cy;

        // Draw visible constraint cage around origin being unlocked/inspected
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.6)';
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(originX - 42, originY - 42, 84, 84);
        ctx.setLineDash([]);

        // Three counterfactual branches:
        // Branch A: Actual inertial path (Repressive / blind historical constraint)
        // Branch B: Counterfactual Possibility B (Rewriting rules)
        // Branch C: Self-legislated Meta-Constraint C2 (Constitutive Freedom)
        const branches = [
          { endX: w * 0.78, endY: cy - 88, color: '#94a3b8', label: '惯性轨迹 A（盲目服从既定历史/压制性约束）' },
          { endX: w * 0.78, endY: cy, color: '#38bdf8', label: '反事实模拟可能世界 B（“我本可以选择进入状态 B”）' },
          { endX: w * 0.78, endY: cy + 88, color: '#34d399', label: '自我立法轨迹 C（保留构成性约束，设定元约束₂ 开启新螺旋）' }
        ];

        branches.forEach((b, idx) => {
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.quadraticCurveTo(w * 0.48, originY, b.endX, b.endY);
          ctx.strokeStyle = b.color;
          ctx.lineWidth = idx === 2 ? 3.5 : 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(b.endX, b.endY, idx === 2 ? 10 : 7, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.fill();

          ctx.fillStyle = b.color;
          ctx.font = (idx === 2 ? 'bold ' : '') + '12px "Noto Sans SC", sans-serif';
          ctx.fillText(b.label, b.endX - 310, b.endY - 14);
        });

        ctx.beginPath();
        ctx.arc(originX, originY, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px "Noto Sans SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('反身主体', originX, originY + 4);
        ctx.textAlign = 'left';
      }
    }

    // =========================================================================
    // 10. TAB 2: OPERATOR OMEGA, PROCESS P vs S, & 4 INTERDISCIPLINARY SCHEMES
    // =========================================================================
    function renderOmegaComponents() {
      const listEl = byId('omegaComponentsList');
      const detailEl = byId('omegaDetailBox');
      if (!listEl || !detailEl) return;

      listEl.innerHTML = OMEGA_COMPONENTS.map((comp, idx) => {
        const isSel = idx === selectedOmegaIdx;
        const badgeColors = {
          emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          rose: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        }[comp.statusColor];
        const borderCls = isSel ? 'border-sky-400 bg-slate-900' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700';

        return `
          <button type="button" data-action="selectOmegaComp" data-event="click" data-arg1="${idx}" data-type1="number" class="w-full p-3 rounded-xl border text-left transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${borderCls}">
            <div>
              <div class="font-bold text-xs sm:text-sm text-slate-100">${comp.name}</div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">形式化工具：${comp.tool}</div>
            </div>
            <span class="px-2.5 py-1 rounded-md text-xs font-mono border shrink-0 ${badgeColors}">
              ${comp.status}
            </span>
          </button>
        `;
      }).join('');

      const active = OMEGA_COMPONENTS[selectedOmegaIdx];
      detailEl.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono uppercase text-indigo-400 font-bold">深度检验诊断 · ${active.name}</span>
          <span class="text-xs font-mono text-slate-400">${active.tool}</span>
        </div>
        <p class="text-xs sm:text-sm font-semibold text-slate-100">${active.summary}</p>
        <p class="text-xs text-slate-300 leading-relaxed">${active.detail}</p>
      `;
    }

    function selectOmegaComp(idx) {
      selectedOmegaIdx = idx;
      renderOmegaComponents();
    }

    function setPSMode(mode) {
      psSimMode = mode;
      const btnP = byId('btnModePOnly');
      const btnPS = byId('btnModePSBoth');
      const statusEl = byId('psCanvasStatus');
      if (mode === 'P_ONLY') {
        btnP.className = 'p-3 rounded-xl border border-sky-400 bg-sky-950/30 text-left transition';
        btnPS.className = 'p-3 rounded-xl border border-slate-700 bg-slate-900/70 text-left hover:border-emerald-400 transition';
        if (statusEl) {
          statusEl.textContent = '当前模式：仅运行【过程 P】（缺乏目标函数 S 注入，原地随机游走，止步于关系层）';
          statusEl.className = 'absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-slate-900/85 border border-sky-500/40 text-[11px] font-mono text-sky-300';
        }
      } else {
        btnPS.className = 'p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/30 text-left transition';
        btnP.className = 'p-3 rounded-xl border border-slate-700 bg-slate-900/70 text-left hover:border-sky-400 transition';
        if (statusEl) {
          statusEl.textContent = '当前模式：过程 P + 过程 S 交替注入（外部目标函数驱动九环螺旋升维）';
          statusEl.className = 'absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-slate-900/85 border border-emerald-500/40 text-[11px] font-mono text-emerald-300';
        }
      }
    }

    function startPSCanvasLoop() {
      if (psCanvasAnimId) cancelAnimationFrame(psCanvasAnimId);
      let t = 0;
      function render() {
        t += 0.025;
        const c = byId('psCanvas');
        if (c && currentMainTab === 'formal') {
          const ctx = c.getContext('2d');
          const w = c.width;
          const h = c.height;
          if (w > 0 && h > 0) {
            ctx.clearRect(0, 0, w, h);
            const steps = ['约束', '结构', '关系', '系统', '组织', '虚实', '认知', '自指', '自由'];
            const padX = 28;
            const usableW = w - padX * 2;

            ctx.beginPath();
            for (let i = 0; i < steps.length; i++) {
              const x = padX + (i / (steps.length - 1)) * usableW;
              let y;
              if (psSimMode === 'P_ONLY') {
                // Climbs slightly to Relation (idx 2), then thermal drift flatlines
                const level = Math.min(i, 2);
                y = h - 36 - level * 22 + (i > 2 ? Math.sin(t * 3 + i) * 12 : 0);
              } else {
                // Climbs steadily across all 9 steps via Process S injections
                y = h - 30 - (i / 8) * (h - 78);
              }
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = psSimMode === 'P_ONLY' ? '#38bdf8' : '#34d399';
            ctx.lineWidth = 3;
            ctx.stroke();

            for (let i = 0; i < steps.length; i++) {
              const x = padX + (i / (steps.length - 1)) * usableW;
              const level = Math.min(i, 2);
              const y = psSimMode === 'P_ONLY'
                ? h - 36 - level * 22 + (i > 2 ? Math.sin(t * 3 + i) * 12 : 0)
                : h - 30 - (i / 8) * (h - 78);

              ctx.beginPath();
              ctx.arc(x, y, 6, 0, Math.PI * 2);
              ctx.fillStyle = i < 3 ? '#38bdf8' : (psSimMode === 'P_ONLY' ? '#64748b' : '#f59e0b');
              ctx.fill();

              if (psSimMode === 'PS_ALT' && i >= 3) {
                ctx.fillStyle = '#fbbf24';
                ctx.font = '10px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText('↓S', x, y - 10);
              }

              ctx.fillStyle = '#cbd5e1';
              ctx.font = '11px "Noto Sans SC", sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(steps[i], x, h - 10);
            }
            ctx.textAlign = 'left';
          }
        }
        psCanvasAnimId = requestAnimationFrame(render);
      }
      psCanvasAnimId = requestAnimationFrame(render);
    }

    function highlightAuditCriterion(crit) {
      activeAuditCriterion = crit;
      ['all', 'loop', 'test', 'scope'].forEach(c => {
        const btn = byId('critBtn-' + c);
        if (btn) {
          btn.className = c === crit
            ? 'audit-crit-btn px-2.5 py-1 rounded text-xs font-semibold bg-sky-500 text-white'
            : 'audit-crit-btn px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-300';
        }
      });
      renderFourSchemes();
    }

    function renderFourSchemes() {
      const grid = byId('fourSchemesGrid');
      if (!grid) return;

      grid.innerHTML = FOUR_SCHEMES.map(sc => {
        const hiLoop = activeAuditCriterion === 'loop' ? 'ring-2 ring-amber-400 bg-amber-950/20' : 'bg-slate-950/60';
        const hiTest = activeAuditCriterion === 'test' ? 'ring-2 ring-sky-400 bg-sky-950/20' : 'bg-slate-950/60';
        const hiScope = activeAuditCriterion === 'scope' ? 'ring-2 ring-emerald-400 bg-emerald-950/20' : 'bg-slate-950/60';

        return `
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between gap-2">
                <h4 class="text-sm sm:text-base font-bold text-slate-100">${sc.title}</h4>
                <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 shrink-0">${sc.badge}</span>
              </div>
              <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">${sc.paradigm}</p>
            </div>

            <div class="grid grid-cols-1 gap-2 text-xs">
              <div class="p-2.5 rounded-lg border border-rose-500/30 bg-rose-950/20">
                <span class="font-bold text-rose-300">🕵️ S 被藏匿于何处：</span>
                <span class="text-slate-200">${sc.whereHidden}</span>
                <div class="text-[11px] text-slate-400 mt-0.5">是否坦白承认预设：${sc.honesty}</div>
              </div>

              <div class="p-2.5 rounded-lg border border-slate-800 transition ${hiLoop}">
                <span class="font-bold text-amber-400">① 逻辑自洽性（避免循环论证吗？）：</span>
                <span class="text-slate-300">${sc.loopAudit}</span>
              </div>

              <div class="p-2.5 rounded-lg border border-slate-800 transition ${hiTest}">
                <span class="font-bold text-sky-400">② 经验可证伪性：</span>
                <span class="text-slate-300">${sc.falsifiability}。${sc.testAudit}</span>
              </div>

              <div class="p-2.5 rounded-lg border border-slate-800 transition ${hiScope}">
                <span class="font-bold text-emerald-400">③ 解释局限边界：</span>
                <span class="text-slate-300">${sc.scopeAudit}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // =========================================================================
    // 11. TAB 3: COSMIC 11-STAGE EVOLUTION & PARADOX SIMULATOR
    // =========================================================================
    function renderCosmosStagesList() {
      const listEl = byId('cosmosStagesList');
      if (!listEl) return;

      listEl.innerHTML = COSMOS_11_STAGES.map((st, idx) => {
        const isSel = idx === selectedCosmosStageIdx;
        const cls = isSel
          ? 'bg-sky-500/20 border-sky-400 text-white'
          : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700';
        return `
          <button type="button" data-action="selectCosmosStage" data-event="click" data-arg1="${idx}" data-type1="number" class="w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 ${cls}">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="w-6 h-6 rounded-lg bg-slate-800 text-sky-400 font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                ${st.step}
              </span>
              <div class="truncate">
                <div class="font-bold text-xs sm:text-sm truncate">${st.name} · ${st.structure.split('（')[0]}</div>
                <div class="text-[11px] text-slate-400 truncate">约束：${st.constraint}</div>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 shrink-0">${st.ladder.split('：')[1]}</span>
          </button>
        `;
      }).join('');

      const active = COSMOS_11_STAGES[selectedCosmosStageIdx];
      byId('cosmosStageNum').textContent = `STAGE ${String(active.step).padStart(2, '0')} / 11`;
      byId('cosmosStageTitle').textContent = `${active.step}. ${active.name}：${active.structure}`;
      byId('cosmosLadderBadge').textContent = `驾驭阶梯：${active.ladder}`;
      byId('cosmosConstraintText').textContent = active.constraint;
      byId('cosmosStructureText').textContent = active.structure;
      byId('cosmosEmergenceText').textContent = active.emergence;
      byId('cosmosLawBadge').textContent = active.lawTitle;
      byId('cosmosDeepText').textContent = active.deepText;
      byId('cosmosCanvasCaption').textContent =
        `[跨层级嵌套 C_${active.step} → S_${active.step}] 约束(${active.constraint.split('、')[0]}) ⟹ 凝结结构(${active.structure.split('（')[0]})`;
    }

    function selectCosmosStage(idx) {
      selectedCosmosStageIdx = idx;
      renderCosmosStagesList();
    }

    function startCosmosCanvasLoop() {
      if (cosmosCanvasAnimId) cancelAnimationFrame(cosmosCanvasAnimId);
      let t = 0;
      function render() {
        t += 0.022;
        const c = byId('cosmosCanvas');
        if (c && currentMainTab === 'cosmos') {
          const ctx = c.getContext('2d');
          const w = c.width;
          const h = c.height;
          if (w > 0 && h > 0) {
            ctx.clearRect(0, 0, w, h);
            const cx = w * 0.5;
            const cy = h * 0.46;
            const step = selectedCosmosStageIdx + 1;

            // Concentric nested constraint shells corresponding to step (1..11)
            for (let k = 1; k <= step; k++) {
              const r = 14 + k * (Math.min(w, h) * 0.032);
              ctx.beginPath();
              ctx.arc(cx, cy, r, 0, Math.PI * 2);
              ctx.strokeStyle = k === step
                ? '#38bdf8'
                : `rgba(129, 140, 248, ${0.15 + (k / step) * 0.35})`;
              ctx.lineWidth = k === step ? 2.5 : 1.2;
              ctx.stroke();

              // Orbiting structural elements on each nested shell
              const a = t * (0.6 + (k % 3) * 0.3) * (k % 2 === 0 ? 1 : -1) + k;
              const ox = cx + Math.cos(a) * r;
              const oy = cy + Math.sin(a) * r;
              ctx.beginPath();
              ctx.arc(ox, oy, k === step ? 5.5 : 3.5, 0, Math.PI * 2);
              ctx.fillStyle = k < 6 ? '#38bdf8' : k < 9 ? '#34d399' : '#c084fc';
              ctx.fill();
            }

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 12px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`嵌套约束层数: ${step} 层`, cx, cy + 4);
            ctx.textAlign = 'left';
          }
        }
        cosmosCanvasAnimId = requestAnimationFrame(render);
      }
      cosmosCanvasAnimId = requestAnimationFrame(render);
    }

    function selectParadoxEntity(idx) {
      selectedParadoxEntityIdx = idx;
      const btns = root.querySelectorAll('.paradox-btn');
      btns.forEach((b, i) => {
        b.className = i === idx
          ? 'paradox-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-white'
          : 'paradox-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700';
      });

      const ent = PARADOX_ENTITIES[idx];
      const card = byId('paradoxDisplayCard');
      if (!card) return;

      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div class="text-sm font-bold text-slate-100">${ent.name}</div>
          <div class="flex items-center gap-3 font-mono text-xs">
            <span class="text-amber-400">承载嵌套约束层数：${ent.constraintCount} 层</span>
            <span class="text-emerald-400">宏观涌现高阶自由度：${ent.freedomScore}%</span>
          </div>
        </div>
        <div class="space-y-1.5">
          <div class="text-slate-400 font-semibold">所承载的跨层级约束网络：</div>
          <div class="flex flex-wrap gap-1.5">
            ${ent.layers.map((l, i) => `<span class="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">C_${i + 1}: ${l}</span>`).join('')}
          </div>
        </div>
        <div>
          <span class="font-bold text-emerald-400">✨ 涌现的高维行动疆域：</span>
          <span class="text-slate-200">${ent.capabilities}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
          💡 <strong>哲学洞见：</strong>${ent.insight}
        </div>
      `;
    }

    // =========================================================================
    // 12. TAB 4: DISGUISED FREEDOMS & LUCID FREEDOM 5 QUESTIONS
    // =========================================================================
    function renderSocialPhilosophy() {
      const container = byId('disguisedFreedomCards');
      if (container) {
        container.innerHTML = DISGUISED_FREEDOMS.map(df => `
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <div class="font-bold text-rose-400 text-xs sm:text-sm">${df.title}</div>
              <p class="text-xs text-slate-400 mt-1">表象幻觉：${df.illusion}</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
              <span class="text-amber-400 font-bold">结构真相：</span>${df.reality}
            </div>
          </div>
        `).join('');
      }
      renderLucidQuestions();
    }

    function toggleLucidQuestion(idx) {
      LUCID_QUESTIONS[idx].checked = !LUCID_QUESTIONS[idx].checked;
      renderLucidQuestions();
    }

    function renderLucidQuestions() {
      const list = byId('lucidQuestionsList');
      const badge = byId('lucidScoreBadge');
      if (!list || !badge) return;

      const count = LUCID_QUESTIONS.filter(q => q.checked).length;
      const verdict = count === 5
        ? '在约束中成为自己行动的作者，并与他人共创新秩序'
        : count >= 3
        ? '具备初步反身性，但仍需警惕形式自由与结构个体化陷阱'
        : '高度受制于现代网状秩序的“生产性自由”与自我剥削';

      badge.textContent = `清醒维度达成：${count} / 5（${verdict}）`;

      list.innerHTML = LUCID_QUESTIONS.map((item, idx) => `
        <button type="button" data-action="toggleLucidQuestion" data-event="click" data-arg1="${idx}" data-type1="number" class="p-3 rounded-xl border text-left transition flex flex-col justify-between ${item.checked ? 'bg-emerald-950/35 border-emerald-500/50 text-slate-100' : 'bg-slate-950/60 border-slate-800 text-slate-400'}">
          <div class="flex items-center justify-between w-full mb-1">
            <span class="font-bold ${item.checked ? 'text-emerald-400' : 'text-slate-400'}">${item.q}</span>
            <span class="font-mono text-xs">${item.checked ? '✅ 已觉醒' : '⬜ 待追问'}</span>
          </div>
          <p class="leading-relaxed text-[11px]">${item.text}</p>
        </button>
      `).join('');
    }

    // =========================================================================
    // 13. TAB 5: FULL-TEXT VERBATIM READER FOR ALL 4 ATTACHMENTS
    // =========================================================================
    function initReaderData() {
      try {
        const scriptEl = byId('rawDocsData');
        if (scriptEl) {
          rawDocs = JSON.parse(scriptEl.textContent);
        }
      } catch (e) {
        rawDocs = [];
      }
      renderReaderDocTabs();
      renderReaderContent();
    }

    function renderReaderDocTabs() {
      const tabsEl = byId('readerDocTabs');
      if (!tabsEl || !rawDocs.length) return;

      tabsEl.innerHTML = rawDocs.map((doc, idx) => {
        const isSel = idx === selectedDocIdx;
        const cls = isSel
          ? 'bg-sky-500/20 border-sky-400 text-white shadow'
          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700';
        return `
          <button type="button" data-action="selectReaderDoc" data-event="click" data-arg1="${idx}" data-type1="number" class="p-3 rounded-xl border text-left transition flex flex-col justify-between ${cls}">
            <div class="text-[11px] font-mono text-sky-400">附件 0${idx + 1} · 原文全本</div>
            <div class="font-bold text-xs sm:text-sm mt-1 line-clamp-1">${doc.title}</div>
            <div class="text-[11px] text-slate-400 mt-0.5 line-clamp-1">${doc.subtitle}</div>
          </button>
        `;
      }).join('');
    }

    function selectReaderDoc(idx) {
      selectedDocIdx = idx;
      renderReaderDocTabs();
      renderReaderContent();
    }

    function clearReaderSearch() {
      const inp = byId('readerSearchInput');
      if (inp) inp.value = '';
      renderReaderContent();
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function highlightKeyword(text, kw) {
      const safe = escapeHtml(text);
      if (!kw) return safe;
      const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedKw})`, 'gi');
      return safe.replace(regex, '<mark class="bg-amber-400 text-slate-950 px-1 rounded font-bold">$1</mark>');
    }

    function renderReaderContent() {
      const container = byId('readerBodyContainer');
      const metaEl = byId('readerDocMeta');
      const matchEl = byId('readerMatchCount');
      const inp = byId('readerSearchInput');
      if (!container || !rawDocs.length) return;

      const doc = rawDocs[selectedDocIdx] || rawDocs[0];
      const kw = inp ? inp.value.trim() : '';

      if (metaEl) {
        metaEl.textContent = `当前卷目：《${doc.filename}》 — 共 ${doc.blocks.length} 个原文段落/命题表单元（100% 原始全文）`;
      }

      let matchTotal = 0;
      const htmlBlocks = doc.blocks.map(b => {
        if (b.type === 'p') {
          if (kw && b.text.toLowerCase().includes(kw.toLowerCase())) matchTotal++;
          const isHeading = b.style.includes('Heading') || /^[一二三四五六七八九十]+、|^第[一二三四五六七八九十]+部分/.test(b.text);
          if (isHeading) {
            return `<h3 class="text-base sm:text-lg font-bold text-sky-400 pt-3 pb-1 border-b border-slate-800/80">${highlightKeyword(b.text, kw)}</h3>`;
          }
          return `<p class="text-slate-200 leading-relaxed">${highlightKeyword(b.text, kw)}</p>`;
        } else if (b.type === 'table') {
          const rows = b.rows || [];
          rows.forEach(r => r.forEach(c => {
            if (kw && c.toLowerCase().includes(kw.toLowerCase())) matchTotal++;
          }));
          if (rows.length === 1 && rows[0].length === 1) {
            // Single-cell callout box
            return `
              <div class="my-3 p-3.5 rounded-xl bg-indigo-950/40 border-l-4 border-indigo-400 text-indigo-100 font-semibold text-xs sm:text-sm">
                ${highlightKeyword(rows[0][0], kw)}
              </div>
            `;
          }
          return `
            <div class="my-3 overflow-x-auto rounded-xl border border-slate-800">
              <table class="w-full text-xs text-left border-collapse">
                <tbody>
                  ${rows.map((r, rIdx) => `
                    <tr class="${rIdx === 0 ? 'bg-slate-900 font-bold text-sky-300' : 'bg-slate-950/60 text-slate-300 border-t border-slate-800/80'}">
                      ${r.map(cell => `<td class="p-2.5 align-top">${highlightKeyword(cell, kw)}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
        return '';
      });

      if (matchEl) {
        matchEl.textContent = kw ? `检索到 ${matchTotal} 处匹配段落/单元格` : '';
      }
      container.innerHTML = htmlBlocks.join('');
    }

    // =========================================================================
    // 14. TAB 6: SOURCE CODE VIEWER, COPY & DOWNLOAD
    // =========================================================================
    let sourcePromise = null;
    async function getCompleteSourceString() {
      if (document.querySelector('meta[name="evo-standalone"]')) {
        const clone=document.documentElement.cloneNode(true);
        const pre=clone.querySelector('#sourceCodePre');if(pre) pre.textContent='';
        clone.querySelector('#toastBanner')?.classList.add('hidden');
        return '<!DOCTYPE html>\n'+clone.outerHTML;
      }
      if (!sourcePromise) sourcePromise=fetch('/apps/reading/thinking/evolution-generative-chain/standalone.html',{cache:'no-store'})
        .then(response=>{if(!response.ok) throw new Error('本页独立 HTML 暂不可用');return response.text();})
        .catch(error=>{sourcePromise=null;throw error;});
      return sourcePromise;
    }
    async function populateSourceCodeView() {
      const pre=byId('sourceCodePre');
      if(pre && !pre.textContent) {
        pre.textContent='正在加载本页独立 HTML…';
        try {pre.textContent=await getCompleteSourceString();}
        catch(error) {pre.textContent=error.message;}
      }
    }
    async function copyFullSourceCode() {
      try {
        const src=await getCompleteSourceString();
        if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(src);
        else {
          const ta=document.createElement('textarea');ta.value=src;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();
          const copied=document.execCommand('copy');ta.remove();if(!copied) throw new Error('请在源码框中手动选择并复制');
        }
        showToast('✅ 已复制本页完整 HTML 源代码');
      } catch(error) {showToast(error.message);}
    }
    async function downloadFullSourceCode() {
      try {
        const src=await getCompleteSourceString(),url=URL.createObjectURL(new Blob([src],{type:'text/html;charset=utf-8'}));
        const a=document.createElement('a');a.href=url;a.download='evolution_chain_interactive.html';document.body.appendChild(a);a.click();a.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('💾 已下载本页独立 HTML');
      } catch(error) {showToast(error.message);}
    }

    // =========================================================================
    // 15. BOOTSTRAP ON WINDOW LOAD
    // =========================================================================
    function init() {
      bindActions();
      renderChainBar();
      updateSandboxDetails();
      setupCanvasInteractions();

      renderOmegaComponents();
      renderFourSchemes();

      renderCosmosStagesList();
      selectParadoxEntity(4);

      renderSocialPhilosophy();
      initReaderData();

      resizeAllCanvases();
      window.addEventListener('resize', resizeAllCanvases);

      startMainCanvasLoop();
      startPSCanvasLoop();
      startCosmosCanvasLoop();
      switchMainTab('sandbox');
      setTopologyMode('linear');
      switchDetailSubTab('matter');
      setPSMode('PS_ALT');
      byId('toastBanner').classList.add('hidden');
      byId('btnAutoPlay').textContent='▶ 自动推演全链';
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
    else init();

})();
