const categories = ["全部", "原始思维", "神话宗教", "希腊哲学", "神学中世纪", "改革近代"];

const terms = [
  {
    term: "图腾",
    original: "Totem",
    category: "原始思维",
    brief: "群体认定与自身具有亲缘、祖先或保护关系的自然物和象征。",
    evolution: "从氏族身份标记延续为国旗、徽章、Logo 等现代认同符号。",
    lectureIds: [1]
  },
  {
    term: "禁忌",
    original: "Taboo",
    category: "原始思维",
    brief: "以不可做、不可说、不可触划出神圣、危险与秩序边界。",
    evolution: "讲义以 Taboo → Nomos → Law 概括其向习俗、规范和法律的转化。",
    lectureIds: [1]
  },
  {
    term: "万物有灵",
    original: "Animism",
    category: "原始思维",
    brief: "认为自然物、生命和事件都具有灵魂、意志或精神力量。",
    evolution: "它让人与自然保持互渗关系，也是神话人格化世界的认知前提。",
    lectureIds: [1]
  },
  {
    term: "交感巫术",
    original: "Sympathetic Magic",
    category: "原始思维",
    brief: "相信相似会造成相似、接触过的事物会持续互相影响。",
    evolution: "包含早期因果意识，但缺少现代科学的实证与反证机制。",
    lectureIds: [1]
  },
  {
    term: "仪式",
    original: "Ritual",
    category: "原始思维",
    brief: "通过重复、象征和集体参与，使信仰与价值成为可见行动。",
    evolution: "从祭祀、成年礼延续为现代国家、组织与个人生命仪式。",
    lectureIds: [1, 2]
  },
  {
    term: "具体科学",
    original: "Science of the Concrete",
    category: "原始思维",
    brief: "列维-斯特劳斯对原始分类和修补术式思维的肯定性描述。",
    evolution: "原始思维与现代科学的差异在媒介与抽象层级，而非有无逻辑。",
    lectureIds: [1]
  },
  {
    term: "神话",
    original: "Mythos",
    category: "神话宗教",
    brief: "以叙事、象征和拟人化整体解释起源、命运与社会秩序。",
    evolution: "神话问题被哲学继承，表达方式则从故事转向概念和论证。",
    lectureIds: [2, 3]
  },
  {
    term: "天命法则",
    original: "Me",
    category: "神话宗教",
    brief: "苏美尔传统中维持自然、社会、王权、礼仪与技艺的神圣法则。",
    evolution: "它像文明规则库，为宏观秩序和政治合法性提供神圣基础。",
    lectureIds: [2]
  },
  {
    term: "命运",
    original: "Namtar",
    category: "神话宗教",
    brief: "苏美尔传统中落在个体身上的既定状态，尤其指死亡的不可逆。",
    evolution: "它把宇宙规则具体化为个人生命的必然边界。",
    lectureIds: [2]
  },
  {
    term: "玛特",
    original: "Maat",
    category: "神话宗教",
    brief: "古埃及的真理、正义、宇宙和谐与社会平衡原则。",
    evolution: "秩序需要由法老、祭司和个人通过伦理与仪式持续维护。",
    lectureIds: [2]
  },
  {
    term: "摩伊拉",
    original: "Moira",
    category: "神话宗教",
    brief: "古希腊的份额、定数与命运，连诸神也受到其约束。",
    evolution: "它开启自由与必然的悲剧张力，深刻影响希腊哲学与文学。",
    lectureIds: [2, 3]
  },
  {
    term: "宗教",
    original: "Religion",
    category: "神话宗教",
    brief: "由信仰、教义、仪式、伦理、组织和经典构成的制度化精神体系。",
    evolution: "它整合图腾、巫术和神话，并提出人生意义与救赎的终极答案。",
    lectureIds: [2, 4]
  },
  {
    term: "本原",
    original: "Arche",
    category: "希腊哲学",
    brief: "万物由之产生并复归于它的始基、开端或主宰原则。",
    evolution: "从水、气、火走向无限者和抽象结构，神学中又被改写为创世权能。",
    lectureIds: [3, 4]
  },
  {
    term: "阿派朗",
    original: "Apeiron",
    category: "希腊哲学",
    brief: "阿那克西曼德提出的无限、无定形、无边界的本原。",
    evolution: "它使本原从具体物质提升为超越具体属性的抽象原则。",
    lectureIds: [3]
  },
  {
    term: "自然",
    original: "Physis",
    category: "希腊哲学",
    brief: "事物自身的生成、本性与生长原则，而非单指外部自然界。",
    evolution: "与 Nomos 的对立揭示自然根据与人为约定之间的张力。",
    lectureIds: [3]
  },
  {
    term: "习俗与法律",
    original: "Nomos",
    category: "希腊哲学",
    brief: "共同体形成的习俗、约定、规范和法律秩序。",
    evolution: "智者派用 Physis/Nomos 之争反思制度是否天然正当。",
    lectureIds: [1, 3]
  },
  {
    term: "逻各斯",
    original: "Logos",
    category: "希腊哲学",
    brief: "兼有言说、理由、尺度、法则与理性秩序等含义。",
    evolution: "从赫拉克利特的宇宙法则，经斯多葛普遍理性，转化为基督教的道与圣子。",
    lectureIds: [2, 3, 4]
  },
  {
    term: "努斯",
    original: "Nous",
    category: "希腊哲学",
    brief: "心灵、理智或安排宇宙秩序的纯粹精神原则。",
    evolution: "阿那克萨戈拉以 Nous 启动宇宙秩序，新柏拉图与神学继续改写其地位。",
    lectureIds: [3, 4]
  },
  {
    term: "存在",
    original: "Being / On",
    category: "希腊哲学",
    brief: "巴门尼德以唯一、永恒、不动的存在对抗感官中的流变。",
    evolution: "它成为形而上学核心，并在神学中与上帝的完满存在相连。",
    lectureIds: [3, 4]
  },
  {
    term: "知识",
    original: "Episteme",
    category: "希腊哲学",
    brief: "有根据、可把握真实对象的知识，与意见 Doxa 相对。",
    evolution: "从巴门尼德到柏拉图，理性知识被置于感官意见之上。",
    lectureIds: [3]
  },
  {
    term: "意见",
    original: "Doxa",
    category: "希腊哲学",
    brief: "基于感官、习俗或未经论证判断形成的看法。",
    evolution: "哲学不断追问如何从意见走向知识，也反思这种区分是否过于绝对。",
    lectureIds: [3]
  },
  {
    term: "理念",
    original: "Idea / Eidos",
    category: "希腊哲学",
    brief: "柏拉图所说独立、永恒、完美的本质原型。",
    evolution: "奥古斯丁把理念改写为上帝心中的永恒蓝图。",
    lectureIds: [3, 4]
  },
  {
    term: "质料与形式",
    original: "Hyle / Morphe",
    category: "希腊哲学",
    brief: "亚里士多德用质料与形式的统一解释具体实体。",
    evolution: "形式不在事物之外，而内在于事物，是其成为此物的结构。",
    lectureIds: [3, 4]
  },
  {
    term: "潜能与现实",
    original: "Dynamis / Energeia",
    category: "希腊哲学",
    brief: "事物从可以成为某物，到实际实现其形式的运动结构。",
    evolution: "它让变化不再只是流变，而成为具有方向的实现过程。",
    lectureIds: [3]
  },
  {
    term: "德性",
    original: "Arete",
    category: "希腊哲学",
    brief: "卓越、品格完善和把功能实现得好的状态。",
    evolution: "从苏格拉底的德性即知识，到亚里士多德的习惯、中道与实践智慧。",
    lectureIds: [3]
  },
  {
    term: "不动心",
    original: "Ataraxia",
    category: "希腊哲学",
    brief: "不受恐惧、欲望和独断判断扰动的心灵宁静。",
    evolution: "伊壁鸠鲁主义与怀疑主义以不同方式把它作为哲学治疗目标。",
    lectureIds: [3, 4]
  },
  {
    term: "悬置判断",
    original: "Epoche",
    category: "希腊哲学",
    brief: "面对无法确定的命题，暂不肯定也不否定。",
    evolution: "怀疑主义借此解除独断压力，现代现象学又赋予它新的方法意义。",
    lectureIds: [3]
  },
  {
    term: "恩典",
    original: "Grace",
    category: "神学中世纪",
    brief: "上帝主动、无偿给予人的拯救与更新力量。",
    evolution: "围绕恩典与自由意志的关系，形成奥古斯丁、经院哲学和宗教改革的核心争论。",
    lectureIds: [4]
  },
  {
    term: "三位一体",
    original: "Trinity",
    category: "神学中世纪",
    brief: "上帝一体三位格：圣父、圣子、圣灵同一神性而位格有别。",
    evolution: "其语言与边界在早期教父和四世纪大公会议中逐步定型。",
    lectureIds: [4]
  },
  {
    term: "原罪",
    original: "Original Sin",
    category: "神学中世纪",
    brief: "人类因始祖堕落而处于与上帝疏离、意志受损的普遍状态。",
    evolution: "奥古斯丁以原罪与恩典解释人的无力，深刻影响西方人性观。",
    lectureIds: [4]
  },
  {
    term: "共相",
    original: "Universals",
    category: "神学中世纪",
    brief: "“人性”“善”“红”等可适用于多个个体的普遍概念或本质。",
    evolution: "共相是否真实存在，关系到知识、教会、共同体与个体的地位。",
    lectureIds: [3, 4]
  },
  {
    term: "唯实论",
    original: "Realism",
    category: "神学中世纪",
    brief: "主张共相具有某种真实存在，而不只是名称。",
    evolution: "柏拉图式唯实论和阿奎那温和实在论为经院神学体系提供本体论支撑。",
    lectureIds: [4]
  },
  {
    term: "唯名论",
    original: "Nominalism",
    category: "神学中世纪",
    brief: "主张只有个别事物真实存在，共相只是名称或心灵概念。",
    evolution: "它提升个体和经验，削弱宏大形而上实体，为近代思想与宗教改革开路。",
    lectureIds: [4]
  },
  {
    term: "奥卡姆剃刀",
    original: "Ockham's Razor",
    category: "神学中世纪",
    brief: "如无必要，勿增实体；解释不应引入多余假设。",
    evolution: "它成为经验研究、科学简约性和分析方法的重要原则。",
    lectureIds: [4]
  },
  {
    term: "自然法",
    original: "Natural Law",
    category: "神学中世纪",
    brief: "人凭理性可认识、根植于人性和世界秩序的道德原则。",
    evolution: "阿奎那将其纳入神学体系，并影响近代权利、国际法和宪政思想。",
    lectureIds: [4]
  },
  {
    term: "信仰寻求理解",
    original: "Fides Quaerens Intellectum",
    category: "神学中世纪",
    brief: "信仰不是拒绝思考，而是成为理性理解的出发点。",
    evolution: "安瑟尔谟的表述概括了经院哲学处理信仰与理性的基本姿态。",
    lectureIds: [4]
  },
  {
    term: "基督教人文主义",
    original: "Christian Humanism",
    category: "改革近代",
    brief: "以古典学术、原文校勘、教育与伦理更新推动基督教改革。",
    evolution: "伊拉斯谟以此连接文艺复兴人文主义与宗教改革前夜。",
    lectureIds: [4]
  },
  {
    term: "唯独圣经",
    original: "Sola Scriptura",
    category: "改革近代",
    brief: "圣经是信仰和教义的唯一最高权威。",
    evolution: "它挑战圣经、传统与教皇并列的权威结构，重组教会与个人阅读关系。",
    lectureIds: [4]
  },
  {
    term: "因信称义",
    original: "Sola Fide",
    category: "改革近代",
    brief: "人因信领受救恩，而不是凭功德和行为赚取称义。",
    evolution: "路德借此重申恩典的优先性，并挑战中世纪功德与圣礼体系。",
    lectureIds: [4]
  },
  {
    term: "预定论",
    original: "Predestination",
    category: "改革近代",
    brief: "救恩最终根源于上帝的拣选与主权，而非人的功劳。",
    evolution: "从奥古斯丁到加尔文，它持续激化神恩与自由意志的张力。",
    lectureIds: [4]
  }
];

module.exports = {
  categories,
  terms
};
