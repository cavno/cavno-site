/* 保留附件数据与计算规则；DOM 查询和事件仅作用于本页。 */
(() => {
  const root = document.getElementById('lg-house-app');
  if (!root) return;
  const byId = id => root.querySelector('#' + id);

    // =========================================================================
    // 1. 15盘完整楼栋户型数据库（含坂田4盘 + 布吉南湾3盘 + 大运8盘）
    // =========================================================================
    const UNITS_DATA = [
      // ==================== A. 坂田片区 (新增 4 盘：10号线直达贝尔路站) ====================

      // ---------------- 1. 佳兆业中央广场 (佳兆业城市广场，坂田雪岗北/华为站·岗头站) ----------------
      {
        id: "bt-kaisa-3-89",
        zone: "坂田片区",
        project: "佳兆业中央广场",
        phase: "三期 (核心期)",
        building: "三期 2栋 / 3栋 (中央泳池园林楼王)",
        unitCode: "89㎡南向园景三房两卫",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约82%",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中央园林泳池",
        noiseDb: "约 41~45 dB（极安静）",
        roadDetail: "位于三期围合大花园正中心，远离坂澜大道与雪岗北路，前后无遮挡看园林",
        minPrice: 455,
        maxPrice: 498,
        priceRange: "455~498 万",
        commuteMins: 10,
        commuteRoute: "10号线岗头站/华为站 → 1~2站0换乘直达贝尔路站（骑行8分钟亦可达）",
        delivery: "成熟现房（佳兆业物业）",
        schoolPrimary: "深圳大学附属坂田学校(小学部) / 省实深圳学校(共享)",
        schoolMiddle: "深圳大学附属坂田学校(初中部，公办率~66%)",
        twoKidsNote: "太太通勤天花板！10号线1~2站直达贝尔路（甚至可骑电动车10分钟上下班），中午都能回家看8个月老二；180万方大城配套成熟。",
        scores: { quiet: 95, edu: 85, commute: 99, space: 88, comm: 93 }
      },
      {
        id: "bt-kaisa-1-89",
        zone: "坂田片区",
        project: "佳兆业中央广场",
        phase: "一期 / 二期",
        building: "一期 3栋 / 二期 2栋 (内园侧)",
        unitCode: "88~89㎡东南向三房一卫/两卫",
        layoutType: "3室1卫",
        area: "88㎡",
        usableRate: "约81%",
        orientation: "东南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 社区内街支路",
        noiseDb: "约 49~53 dB（安静可控）",
        roadDetail: "避开坂澜大道与冲之大道主干道，靠近宝吉路内部生活支路，阳台看花园",
        minPrice: 415,
        maxPrice: 448,
        priceRange: "415~448 万",
        commuteMins: 12,
        commuteRoute: "10号线岗头站/华为站 → 1~2站0换乘直达贝尔路站",
        delivery: "成熟现房",
        schoolPrimary: "深圳大学附属坂田学校 / 广东实验中学深圳学校",
        schoolMiddle: "深圳大学附属坂田学校（九年一贯制）",
        twoKidsNote: "比三期楼王门槛低约40万，紧邻学校与商业街，太太通勤仅10余分钟。",
        scores: { quiet: 80, edu: 85, commute: 98, space: 78, comm: 90 }
      },
      {
        id: "bt-kaisa-main",
        zone: "坂田片区",
        project: "佳兆业中央广场",
        phase: "三期外围",
        building: "三期 1栋 / 6栋 / 7栋 (外侧)",
        unitCode: "89㎡外围临路单元",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约81%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 坂澜大道/雪岗路",
        noiseDb: "约 64~70 dB（主干道车流声）",
        roadDetail: "东侧靠坂澜大道或北侧靠雪岗北路，大车与通勤车流密集，噪音较大",
        minPrice: 398,
        maxPrice: 430,
        priceRange: "398~430 万",
        commuteMins: 11,
        commuteRoute: "10号线岗头站/华为站 → 1~2站0换乘直达贝尔路站",
        delivery: "成熟现房",
        schoolPrimary: "深圳大学附属坂田学校",
        schoolMiddle: "深圳大学附属坂田学校",
        twoKidsNote: "虽总价下探至400万出头，但临坂澜大道主干道噪音明显，建议避开。",
        scores: { quiet: 36, edu: 85, commute: 98, space: 86, comm: 86 }
      },

      // ---------------- 2. 信义嘉御山 (坂田北站，科技城外国语学校王牌学区) ----------------
      {
        id: "bt-xinyi-5-89",
        zone: "坂田片区",
        project: "信义嘉御山",
        phase: "五期 / 七期 (次新核心期)",
        building: "五期 12栋·13栋 / 七期 2栋 (中央园景)",
        unitCode: "88~89㎡南向园景三房两卫",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约83%",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 百米楼间距中心园林",
        noiseDb: "约 41~45 dB（极安静）",
        roadDetail: "深居大社区园林中央，彻底隔绝吉华路与五和大道主干道，人车分流极佳",
        minPrice: 495,
        maxPrice: 548,
        priceRange: "495~548 万",
        commuteMins: 14,
        commuteRoute: "10号线坂田北站 → 2站0换乘直达贝尔路站（车程仅4分钟，含步行约14分钟）",
        delivery: "成熟现房（信义物业）",
        schoolPrimary: "科技城外国语学校(小学部，就在社区内/旁)",
        schoolMiddle: "科技城外国语学校(初中部，公办率~74%，坂田口碑王牌)",
        twoKidsNote: "坂田标杆改善大盘！小区自带幼儿园+九年一贯制科技城外国语学校（目送式名校），太太坐10号线2站即到贝尔路站，通勤与教育双满分！",
        scores: { quiet: 95, edu: 92, commute: 96, space: 88, comm: 95 }
      },
      {
        id: "bt-xinyi-2-86",
        zone: "坂田片区",
        project: "信义嘉御山",
        phase: "一至三期",
        building: "二期 5栋·6栋 / 三期 8栋 (内园)",
        unitCode: "84~87㎡东南向三房一卫",
        layoutType: "3室1卫",
        area: "86㎡",
        usableRate: "约82%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 内部花园安静侧",
        noiseDb: "约 43~47 dB（安静）",
        roadDetail: "位于一至三期花园内圈，由外围楼栋遮挡吉华路与坂雪岗大道噪音",
        minPrice: 435,
        maxPrice: 472,
        priceRange: "435~472 万",
        commuteMins: 15,
        commuteRoute: "10号线坂田北站 → 2站0换乘直达贝尔路站（全程约15分钟）",
        delivery: "成熟现房",
        schoolPrimary: "科技城外国语学校(小学部)",
        schoolMiddle: "科技城外国语学校(初中部，公办率~74%)",
        twoKidsNote: "450万左右即可拿下信义嘉御山大花园+科技城外国语学校九年一贯制学位+15分钟贝尔路通勤。",
        scores: { quiet: 91, edu: 92, commute: 95, space: 77, comm: 92 }
      },
      {
        id: "bt-xinyi-main",
        zone: "坂田片区",
        project: "信义嘉御山",
        phase: "一至五期外围",
        building: "临五和大道 / 吉华路外围楼栋",
        unitCode: "86~89㎡临路单元",
        layoutType: "3室1卫",
        area: "87㎡",
        usableRate: "约81%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 五和大道/吉华路",
        noiseDb: "约 65~71 dB（主干道车流密集）",
        roadDetail: "西侧紧邻五和大道或南侧临吉华路，早晚高峰车流极大，不建议考虑",
        minPrice: 405,
        maxPrice: 430,
        priceRange: "405~430 万",
        commuteMins: 14,
        commuteRoute: "10号线坂田北站 → 2站0换乘直达贝尔路站",
        delivery: "成熟现房",
        schoolPrimary: "科技城外国语学校",
        schoolMiddle: "科技城外国语学校",
        twoKidsNote: "信义嘉御山体量巨大，看房务必避开西侧临五和大道及南侧临吉华路的一排楼栋。",
        scores: { quiet: 34, edu: 92, commute: 96, space: 76, comm: 86 }
      },

      // ---------------- 3. 诺德中央道 (光雅园站，深圳实验学校坂田校区顶级学区) ----------------
      {
        id: "bt-nuode-2-89",
        zone: "坂田片区",
        project: "诺德中央道",
        phase: "二期",
        building: "二期 2栋 / 3栋 (园林内侧)",
        unitCode: "88~89㎡南向高拓三房两卫",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约84%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区内部园林",
        noiseDb: "约 43~47 dB（安静）",
        roadDetail: "位于二期小区内侧，避开五和大道与雅园路主干道，直看内部中心花园",
        minPrice: 475,
        maxPrice: 525,
        priceRange: "475~525 万",
        commuteMins: 17,
        commuteRoute: "10号线光雅园站 → 3站0换乘直达贝尔路站（车程6分钟，全程约17分钟）",
        delivery: "次新现房",
        schoolPrimary: "深圳实验学校坂田校区(小学部)",
        schoolMiddle: "深圳实验学校坂田校区(初中部，公办率~77%，四大名校直管)",
        twoKidsNote: "坂田最强名校招牌（深圳实验学校坂田部）+ 10号线3站直达贝尔路！89㎡三房两卫格局紧凑实用，双孩读书与妈妈通勤兼得。",
        scores: { quiet: 91, edu: 96, commute: 94, space: 86, comm: 90 }
      },
      {
        id: "bt-nuode-1-86",
        zone: "坂田片区",
        project: "诺德中央道",
        phase: "一期",
        building: "一期 2栋 / 3栋 (内侧)",
        unitCode: "85~87㎡南向三房一卫",
        layoutType: "3室1卫",
        area: "86㎡",
        usableRate: "约82%",
        orientation: "正南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 内部支路侧",
        noiseDb: "约 50~54 dB（中高层安静）",
        roadDetail: "避开五和大道主干道正立面，靠近内部支路，阳台朝南看花园",
        minPrice: 418,
        maxPrice: 455,
        priceRange: "418~455 万",
        commuteMins: 17,
        commuteRoute: "10号线光雅园站 → 3站0换乘直达贝尔路站",
        delivery: "成熟现房",
        schoolPrimary: "深圳实验学校坂田校区(小学部)",
        schoolMiddle: "深圳实验学校坂田校区(初中部)",
        twoKidsNote: "420万级上车深实验坂田校区九年一贯制+10号线光雅园地铁口，性价比突出。",
        scores: { quiet: 79, edu: 96, commute: 94, space: 77, comm: 88 }
      },

      // ---------------- 4. 大族云峰 (光雅园站/坂田北站，次新大园林+自带华润万家商圈) ----------------
      {
        id: "bt-dazu-1-96",
        zone: "坂田片区",
        project: "大族云峰",
        phase: "一期 / 二期",
        building: "一期 3栋·5栋 / 二期 2栋 (中央园景)",
        unitCode: "95~99㎡南向阔绰三房两卫",
        layoutType: "3室2卫",
        area: "96㎡",
        usableRate: "约82%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 围合中央大园林",
        noiseDb: "约 42~46 dB（极安静）",
        roadDetail: "位于围合大社区中心栋，远离坂雪岗大道与永香路，园林品质在坂田数一数二",
        minPrice: 465,
        maxPrice: 515,
        priceRange: "465~515 万",
        commuteMins: 16,
        commuteRoute: "10号线光雅园站/坂田北站 → 2~3站0换乘直达贝尔路站（全程约16分钟）",
        delivery: "次新现房（2019-2021交付）",
        schoolPrimary: "深圳大学附属坂田学校(九年一贯，紧邻小区)",
        schoolMiddle: "深圳大学附属坂田学校(初中部，公办率~66%)",
        twoKidsNote: "楼龄新、园林大气、楼下自带4.5万㎡商业与18班幼儿园，深大附坂田学校就在家门口，二胎居住舒适度与接送便利度极高！",
        scores: { quiet: 94, edu: 85, commute: 95, space: 92, comm: 94 }
      },
      {
        id: "bt-dazu-1-88",
        zone: "坂田片区",
        project: "大族云峰",
        phase: "一期",
        building: "一期 2栋 / 6栋 (次内圈)",
        unitCode: "88㎡南向精装三房一卫",
        layoutType: "3室1卫",
        area: "88㎡",
        usableRate: "约81%",
        orientation: "西南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 虎山路安静支线",
        noiseDb: "约 49~53 dB（安静可控）",
        roadDetail: "避开坂雪岗大道主干道，靠近虎山路社区支路，车流少",
        minPrice: 385,
        maxPrice: 425,
        priceRange: "385~425 万",
        commuteMins: 16,
        commuteRoute: "10号线光雅园站 → 2~3站0换乘直达贝尔路站",
        delivery: "次新现房",
        schoolPrimary: "深圳大学附属坂田学校",
        schoolMiddle: "深圳大学附属坂田学校",
        twoKidsNote: "400万以内买坂田次新豪宅感园林社区，16分钟直达贝尔路，适合看重次新环境与通勤的家庭。",
        scores: { quiet: 81, edu: 85, commute: 95, space: 79, comm: 92 }
      },

      // ==================== B. 布吉水径 / 南湾片区 (3盘：5号线五和转10号线) ====================
      {
        id: "vanke-3-89",
        zone: "布吉/南湾",
        project: "万科麓城三期",
        phase: "三期",
        building: "3栋 / 4栋",
        unitCode: "01/02户型 (中央园林楼王)",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约82%（传统高拓）",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中央园林",
        noiseDb: "约 41~45 dB（极安静）",
        roadDetail: "远离布龙路主干道及水径路，前后双园林包夹，无货车低频噪音",
        minPrice: 415,
        maxPrice: 445,
        priceRange: "415~445 万",
        commuteMins: 23,
        commuteRoute: "5号线上水径站 → 1站至五和转10号线 → 2站至贝尔路站（共3站1换乘，约23分钟）",
        delivery: "现房（万科物业）",
        schoolPrimary: "万科麓城外国语小学（步行350m）",
        schoolMiddle: "南京师范大学附属龙岗学校（公办率80.8%）",
        twoKidsNote: "通勤与顶配学位的黄金平衡点！上水径坐地铁仅3站(五和换乘1次)23分钟即达贝尔路，且比坂田同品质三房两卫省下50~80万预算！",
        scores: { quiet: 96, edu: 95, commute: 88, space: 86, comm: 93 }
      },
      {
        id: "vanke-1-88",
        zone: "布吉/南湾",
        project: "万科麓城三期",
        phase: "三期",
        building: "1栋A座 / 1栋B座 (辅路) · 2栋 (内园)",
        unitCode: "88㎡三房一卫 / 2栋89㎡三房两卫",
        layoutType: "3室1卫",
        area: "88㎡",
        usableRate: "约81%",
        orientation: "西南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 水径支路备选",
        noiseDb: "约 51~55 dB（关窗约38dB）",
        roadDetail: "1A/1B栋避开布龙路主干道，靠近水径社区支路（2栋则为正南不临街三房两卫）",
        minPrice: 375,
        maxPrice: 398,
        priceRange: "375~398 万",
        commuteMins: 23,
        commuteRoute: "5号线上水径站 → 1站至五和转10号线 → 2站至贝尔路站（约23分钟）",
        delivery: "现房（万科物业）",
        schoolPrimary: "万科麓城外国语小学",
        schoolMiddle: "南京师范大学附属龙岗学校（公办率80.8%）",
        twoKidsNote: "380万级享受万科物业+麓城外国语+南师大附校+23分钟至贝尔路通勤。",
        scores: { quiet: 76, edu: 95, commute: 88, space: 74, comm: 90 }
      },
      {
        id: "vanke-6-88",
        zone: "布吉/南湾",
        project: "万科麓城三期",
        phase: "三期",
        building: "5栋 / 6栋",
        unitCode: "南向临路单元",
        layoutType: "3室1卫",
        area: "88㎡",
        usableRate: "约81%",
        orientation: "东南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 布龙路侧",
        noiseDb: "约 65~72 dB（货车噪音明显）",
        roadDetail: "靠近布龙路快速干道，夜间及清晨大车通行噪音重，触碰主干道红线",
        minPrice: 355,
        maxPrice: 375,
        priceRange: "355~375 万",
        commuteMins: 23,
        commuteRoute: "5号线上水径站 → 五和转10号线 → 贝尔路站（约23分钟）",
        delivery: "现房（万科物业）",
        schoolPrimary: "万科麓城外国语小学",
        schoolMiddle: "南京师范大学附属龙岗学校",
        twoKidsNote: "临布龙路主干道噪音大，影响婴儿睡眠，直接排除。",
        scores: { quiet: 35, edu: 95, commute: 88, space: 73, comm: 84 }
      },
      {
        id: "horoy-6-89",
        zone: "布吉/南湾",
        project: "鸿荣源尚峰",
        phase: "一期围合",
        building: "6栋A座 / 6栋B座 / 5栋",
        unitCode: "01/02户型 (中心泳池楼王)",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约84%（高拓展）",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 背山面水中央园景",
        noiseDb: "约 40~44 dB（全盘最静）",
        roadDetail: "深居围合社区南侧腹地，前看中心泳池园林，后靠山体公园，完全隔绝布龙路",
        minPrice: 395,
        maxPrice: 435,
        priceRange: "395~435 万",
        commuteMins: 24,
        commuteRoute: "5号线上水径站/下水径站 → 五和转10号线 → 贝尔路站（约24分钟）",
        delivery: "现房（鸿荣源物业）",
        schoolPrimary: "水径小学 / 麓城外国语 / 水径九年一贯制(共享)",
        schoolMiddle: "南京师范大学附属龙岗学校(共享，公办率80.8%)",
        twoKidsNote: "400万出头买鸿荣源豪宅园林不临街正南三房两卫，太太坐5号线转10号线仅24分钟到贝尔路站，极高性价比！",
        scores: { quiet: 97, edu: 89, commute: 87, space: 89, comm: 95 }
      },
      {
        id: "horoy-7-88",
        zone: "布吉/南湾",
        project: "鸿荣源尚峰",
        phase: "一期围合",
        building: "7栋 (不临街) / 3栋A座 (辅路)",
        unitCode: "03/05户型",
        layoutType: "3室1卫",
        area: "88㎡",
        usableRate: "约83%",
        orientation: "西南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 南侧山景/内园",
        noiseDb: "约 43~47 dB（安静）",
        roadDetail: "7栋远离布龙路主干道，靠近南侧山体；3A栋东靠西环路辅路但看内园",
        minPrice: 360,
        maxPrice: 390,
        priceRange: "360~390 万",
        commuteMins: 24,
        commuteRoute: "5号线上水径站 → 五和转10号线 → 贝尔路站（约24分钟）",
        delivery: "现房（鸿荣源物业）",
        schoolPrimary: "水径小学 / 水径九年一贯制(共享)",
        schoolMiddle: "南京师范大学附属龙岗学校(共享)",
        twoKidsNote: "360~380万享鸿荣源园林+南师大附校共享学区+24分钟贝尔路地铁通勤。",
        scores: { quiet: 91, edu: 89, commute: 87, space: 77, comm: 92 }
      },
      {
        id: "tefa-3-96",
        zone: "布吉/南湾",
        project: "特发臻华府",
        phase: "一期（建筑新规）",
        building: "3栋 (纯商品房楼王)",
        unitCode: "96㎡东南向 / 87㎡西南向 三房两卫",
        layoutType: "3室2卫",
        area: "96㎡",
        usableRate: "约98%（新规超高实得）",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中央园林",
        noiseDb: "约 42~45 dB（极安静）",
        roadDetail: "整栋纯商品房无配建混居，位于社区中心，远离盛宝路主干道与铁路",
        minPrice: 355,
        maxPrice: 430,
        priceRange: "355~430 万 (87㎡~96㎡)",
        commuteMins: 33,
        commuteRoute: "14号线石芽岭站 → 布吉转5号线 → 五和转10号线 → 贝尔路站（约33分钟）",
        delivery: "期房（2028.06精装交付）",
        schoolPrimary: "石芽岭学校 + 旁侧规划54班深大附中南湾学校",
        schoolMiddle: "石芽岭学校(公办率~61.5%) + 规划54班新校",
        twoKidsNote: "新规87㎡(约360万)/96㎡(约410万)实得面积极大，自带18班幼儿园+旁侧54班新校；去贝尔路需14转5转10号线约33分钟。",
        scores: { quiet: 95, edu: 82, commute: 75, space: 98, comm: 92 }
      },

      // ==================== C. 龙岗大运片区 (8 盘：14/16号线转5转10号线) ====================
      {
        id: "kaisa-3-89",
        zone: "龙岗大运",
        project: "佳兆业未来花园",
        phase: "一期",
        building: "3栋 / 4栋 (内园) · 2栋/5栋 (辅路)",
        unitCode: "89㎡南向园林三房两卫",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约82%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中心园林",
        noiseDb: "约 42~46 dB（安静）",
        roadDetail: "3/4栋位于小区腹地避开如意路；2/5栋靠华美中路支路（总价350万起）",
        minPrice: 350,
        maxPrice: 405,
        priceRange: "350~405 万",
        commuteMins: 52,
        commuteRoute: "16号线大运中心站 → 大运转14号线 → 布吉转5 → 五和转10 → 贝尔路（约52分钟）",
        delivery: "次新现房（2019-2020交付）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校(小学部)",
        schoolMiddle: "香港中文大学(深圳)附属知新学校(公办率~75%)",
        twoKidsNote: "大运体育场馆旁次新社区，对口港中大附属知新名校；但太太坐地铁去贝尔路需换乘3次约52分钟，早晚通勤较辛苦。",
        scores: { quiet: 93, edu: 91, commute: 48, space: 87, comm: 91 }
      },
      {
        id: "kk-3-97",
        zone: "龙岗大运",
        project: "京基御景中央",
        phase: "一期 / 二期",
        building: "一期3栋·4栋 / 二期3栋",
        unitCode: "97~98㎡正南通透三房两卫",
        layoutType: "3室2卫",
        area: "97㎡",
        usableRate: "约81%",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 中央水景园林",
        noiseDb: "约 41~45 dB（极安静）",
        roadDetail: "位于围合式大花园正中央，远离飞扬路与如意路，楼间距超百米",
        minPrice: 360,
        maxPrice: 406,
        priceRange: "360~406 万",
        commuteMins: 53,
        commuteRoute: "16号线大运中心站 → 大运转14 → 布吉转5 → 五和转10 → 贝尔路（约53分钟）",
        delivery: "次新现房（2018-2020交付）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校 / 道远学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校 / 道远学校(公办率~75%)",
        twoKidsNote: "97㎡室内尺度宽敞，港中大知新/道远学位优质；短板同样是去坂田贝尔路地铁需50分钟以上。",
        scores: { quiet: 95, edu: 91, commute: 47, space: 92, comm: 93 }
      },
      {
        id: "kk-2-86",
        zone: "龙岗大运",
        project: "京基御景中央",
        phase: "一期 / 二期",
        building: "一期2栋A·2B / 二期2栋",
        unitCode: "86㎡东南向精装三房一卫",
        layoutType: "3室1卫",
        area: "86㎡",
        usableRate: "约80%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 看社区内园林",
        noiseDb: "约 43~47 dB（安静）",
        roadDetail: "阳台朝向小区内部中心园林，避开主干道车流",
        minPrice: 305,
        maxPrice: 339,
        priceRange: "305~339 万",
        commuteMins: 53,
        commuteRoute: "16号线大运中心站 → 大运转14 → 布吉转5 → 五和转10 → 贝尔路（约53分钟）",
        delivery: "次新现房",
        schoolPrimary: "香港中文大学(深圳)附属知新学校 / 道远学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校 / 道远学校",
        twoKidsNote: "305~339万低门槛入主大运次新豪宅盘+港中大附校，唯独通勤坂田较远。",
        scores: { quiet: 92, edu: 91, commute: 47, space: 78, comm: 92 }
      },
      {
        id: "yian-3-89",
        zone: "龙岗大运",
        project: "颐安·都会中央",
        phase: "二期 / 三期",
        building: "二期2栋·3栋 / 三期3栋",
        unitCode: "89㎡南向园景三房两卫",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约82%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 内部中央园林",
        noiseDb: "约 42~46 dB（安静）",
        roadDetail: "深居二期/三期园林内侧，完全避开龙岗大道与黄阁路（二期4/5栋另有320万起三房一卫）",
        minPrice: 385,
        maxPrice: 430,
        priceRange: "385~430 万",
        commuteMins: 44,
        commuteRoute: "步行至大运枢纽(14号线快车2站到布吉) → 转5号线 → 五和转10号线 → 贝尔路（约44分钟）",
        delivery: "次新现房（颐安物业）",
        schoolPrimary: "华南师范大学附属龙岗大运学校（下楼即达）",
        schoolMiddle: "华南师范大学附属龙岗大运学校（公办率77.5%）",
        twoKidsNote: "紧邻华附大运九年一贯制名校；因可直接步行至大运枢纽坐14号快线（12分钟飙到布吉站），是大运片区去贝尔路最快的梯队（约44分钟）。",
        scores: { quiet: 94, edu: 94, commute: 60, space: 88, comm: 95 }
      },
      {
        id: "galaxy-6-89",
        zone: "龙岗大运",
        project: "星河时代花园",
        phase: "一期高层区",
        building: "5栋 / 6栋 / 7栋 (内园看别墅)",
        unitCode: "89㎡高拓三房两卫 (3/8栋另有86㎡一卫)",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约86%（高赠送）",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 俯瞰别墅区与中央园林",
        noiseDb: "约 40~44 dB（极安静视野绝佳）",
        roadDetail: "内侧高层，南向俯瞰低密联排别墅区与花园，彻底隔绝黄阁南路与龙岗大道噪音",
        minPrice: 430,
        maxPrice: 475,
        priceRange: "430~475 万",
        commuteMins: 45,
        commuteRoute: "大运站(14号线快线) → 布吉转5号线 → 五和转10号线 → 贝尔路（约45分钟）",
        delivery: "成熟现房（星河物业）",
        schoolPrimary: "深中龙岗小学 / 龙外(集团)星河学校",
        schoolMiddle: "深圳中学龙岗学校（公办率81.5%，顶级名校）",
        twoKidsNote: "下楼即山姆会员店+COCO Park+深中龙岗王牌学位；可借力大运枢纽14号线快车通勤，门到门约45分钟。",
        scores: { quiet: 96, edu: 98, commute: 58, space: 90, comm: 96 }
      },
      {
        id: "cohl-kc-89",
        zone: "龙岗大运",
        project: "中海康城花园",
        phase: "一期 / 二期",
        building: "一期3栋·4栋 / 二期12栋·15栋",
        unitCode: "88㎡中心园景三房两卫 (另有205万起一卫)",
        layoutType: "3室2卫",
        area: "88㎡",
        usableRate: "约82%",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 大社区中央花园",
        noiseDb: "约 42~46 dB（安静）",
        roadDetail: "位于超大型围合花园中心栋，远离盐龙大道与黄阁北路",
        minPrice: 235,
        maxPrice: 268,
        priceRange: "235~268 万",
        commuteMins: 56,
        commuteRoute: "16号线龙城公园/黄阁坑站 → 大运转14 → 布吉转5 → 五和转10 → 贝尔路（约56分钟）",
        delivery: "成熟现房（中海物业）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校(小学部)",
        schoolMiddle: "香港中文大学(深圳)附属知新学校(公办率~75%)",
        twoKidsNote: "235~268万即可买正南不临街三房两卫+港中大知新学位，总价最低；但距离贝尔路地铁耗时最长（近1小时）。",
        scores: { quiet: 92, edu: 91, commute: 42, space: 83, comm: 86 }
      },
      {
        id: "cohl-jz-126",
        zone: "龙岗大运",
        project: "中海大运玖章",
        phase: "一期（高奢新规）",
        building: "3栋A座 / 3栋B座 / 4栋1单元",
        unitCode: "126~139㎡新规3+1室2卫",
        layoutType: "3室2卫",
        area: "126㎡",
        usableRate: "约93%（新规超高实得）",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 中央度假式园林",
        noiseDb: "约 40~44 dB（静谧纯粹）",
        roadDetail: "位于改善社区中央，远离黄阁路主干道，配三玻两腔隔音系统",
        minPrice: 555,
        maxPrice: 708,
        priceRange: "555~708 万",
        commuteMins: 52,
        commuteRoute: "16号线大运中心站 → 大运转14 → 布吉转5 → 五和转10 → 贝尔路（约52分钟）",
        delivery: "期房（2027.12精装交付）",
        schoolPrimary: "待2028交房后划片（紧邻龙外本部/知新/自建校）",
        schoolMiddle: "待交房后划片（大运核心名校圈）",
        twoKidsNote: "产品力与圈层天花板，但总价555万起、期房暂未锁定学区且太太地铁去贝尔路需50分钟以上。",
        scores: { quiet: 97, edu: 78, commute: 48, space: 99, comm: 98 }
      },
      {
        id: "szt-yyj-98",
        zone: "龙岗大运",
        project: "深铁阅云境广场",
        phase: "一期（TOD新规）",
        building: "1栋2单元·3单元(内园) / 4单元(辅路)",
        unitCode: "98~104㎡精装三房两卫",
        layoutType: "3室2卫",
        area: "98㎡",
        usableRate: "约90%（新规精装）",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 抬高式空中花园内侧",
        noiseDb: "约 44~48 dB（安静）",
        roadDetail: "2/3单元看空中花园内院；4单元靠内街辅路（折后336万起）",
        minPrice: 336,
        maxPrice: 435,
        priceRange: "336~435 万",
        commuteMins: 42,
        commuteRoute: "下楼直通大运枢纽(14号线快车2站到布吉) → 转5 → 五和转10 → 贝尔路（约42分钟）",
        delivery: "准现房（2026年底精装交付）",
        schoolPrimary: "华南师范大学附属龙岗大运学校 / 规划72班新校",
        schoolMiddle: "华南师范大学附属龙岗大运学校 / 楼下规划72班九年一贯制",
        twoKidsNote: "大运枢纽上盖，电梯直达14号线快车，是大运片区地铁去贝尔路站最快的楼盘（约42分钟），且2026年底即交付。",
        scores: { quiet: 90, edu: 89, commute: 63, space: 93, comm: 94 }
      },
      {
        id: "sy-trf-99",
        zone: "龙岗大运",
        project: "泰瑞府",
        phase: "一期（深业国企精装）",
        building: "2栋·3栋 (99㎡两卫) / 6栋 (89㎡一卫)",
        unitCode: "99㎡东南三房两卫 / 89㎡正南三房一卫",
        layoutType: "3室2卫",
        area: "99㎡",
        usableRate: "约88%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中心园林",
        noiseDb: "约 41~45 dB（极安静）",
        roadDetail: "位于小区中心位置，避开龙飞大道与如意路（89㎡三房一卫仅299~335万）",
        minPrice: 337,
        maxPrice: 415,
        priceRange: "337~415 万 (89㎡版299万起)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心站 → 大运转14 → 布吉转5 → 五和转10 → 贝尔路（约52分钟）",
        delivery: "国企准现房/现房（2026.05交付）",
        schoolPrimary: "香港中文大学(深圳)附属道远学校 / 知新学校",
        schoolMiddle: "香港中文大学(深圳)附属道远学校 / 知新学校",
        twoKidsNote: "自带18班幼儿园+一路之隔港中大道远学校，337万起买国企精装三房两卫现房；短板是去贝尔路站需3次换乘约52分钟。",
        scores: { quiet: 95, edu: 89, commute: 48, space: 92, comm: 93 }
      }
    ];

    // 默认跨片区 PK 对比池（坂田2盘 + 布吉2盘 + 大运1盘）
    let compareIds = ["bt-xinyi-5-89", "bt-nuode-2-89", "bt-kaisa-3-89", "vanke-3-89", "horoy-6-89"];

    // =========================================================================
    // 2. 五维权重计算与综合评分函数
    // =========================================================================
    function getWeights() {
      const q = parseInt(byId("wQuiet").value, 10);
      const e = parseInt(byId("wEdu").value, 10);
      const m = parseInt(byId("wCommute").value, 10);
      const s = parseInt(byId("wSpace").value, 10);
      const c = parseInt(byId("wComm").value, 10);
      const total = q + e + m + s + c || 100;
      return {
        quiet: q / total,
        edu: e / total,
        commute: m / total,
        space: s / total,
        comm: c / total,
        raw: { q, e, m, s, c }
      };
    }

    function calcWeightedScore(unit, weights) {
      const rawScore =
        unit.scores.quiet * weights.quiet +
        unit.scores.edu * weights.edu +
        unit.scores.commute * weights.commute +
        unit.scores.space * weights.space +
        unit.scores.comm * weights.comm;
      return Math.round(rawScore * 10) / 10;
    }

    function matchPriceFilter(unit) {
      const bracket = byId("filterPriceBracket").value;
      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      if (unit.minPrice > maxSlider) return false;
      if (bracket === "ALL") return true;
      const [bMin, bMax] = bracket.split("-").map(Number);
      return unit.maxPrice >= bMin && unit.minPrice <= bMax;
    }

    function matchCommuteFilter(unit) {
      const maxCommute = byId("filterCommute").value;
      if (maxCommute === "ALL") return true;
      return unit.commuteMins <= parseInt(maxCommute, 10);
    }

    // =========================================================================
    // 3. 渲染顶部 TOP 4 严选推荐
    // =========================================================================
    function renderTopRecommendations() {
      const weights = getWeights();
      byId("wQuietVal").textContent = `${weights.raw.q}%`;
      byId("wEduVal").textContent = `${weights.raw.e}%`;
      byId("wCommuteVal").textContent = `${weights.raw.m}%`;
      byId("wSpaceVal").textContent = `${weights.raw.s}%`;
      byId("wCommVal").textContent = `${weights.raw.c}%`;

      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      const commuteVal = byId("filterCommute").value;
      const hintEl = byId("topBudgetHint");
      hintEl.textContent = `预算≤${maxSlider}万 ｜ 通勤:${commuteVal === 'ALL' ? '不限' : '≤' + commuteVal + '分钟'}`;

      const eligible = UNITS_DATA
        .filter(u => u.noiseLevel !== "MAIN_ROAD" && matchPriceFilter(u) && matchCommuteFilter(u))
        .map(u => ({ ...u, totalScore: calcWeightedScore(u, weights) }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 4);

      const medals = ["🥇 严选TOP 1", "🥈 严选TOP 2", "🥉 严选TOP 3", "🏅 严选TOP 4"];
      const container = byId("topRecommendations");

      if (eligible.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-6 text-xs text-slate-400">当前预算与通勤筛选下暂无非主干道房源，请适当放宽总价预算或通勤时长。</div>`;
        return;
      }

      container.innerHTML = eligible.map((u, idx) => `
        <div class="rounded-xl p-3 border ${idx === 0 ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 bg-slate-50/60'} flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-[11px] mb-1">
              <span class="font-bold text-indigo-700">${medals[idx]} · ${u.zone}</span>
              <span class="px-2 py-0.5 bg-indigo-600 text-white rounded-full font-bold">${u.totalScore}分</span>
            </div>
            <div class="font-bold text-xs text-slate-900">${u.project}</div>
            <div class="text-[11px] text-indigo-900 font-medium truncate">${u.building}</div>
            <div class="text-[11px] text-slate-600 mt-0.5">${u.area} ${u.layoutType} ｜ ☀️${u.orientation}</div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-0.5">
            <div class="font-bold text-rose-600">💰 ${u.priceRange}</div>
            <div class="font-semibold text-pink-700">🚇 至贝尔路：约 ${u.commuteMins} 分钟</div>
            <div class="truncate">🎓 ${u.schoolMiddle.split("（")[0].split("(")[0]}</div>
          </div>
        </div>
      `).join("");
    }

    // =========================================================================
    // 4. 楼栋下拉框联动与房源卡片渲染
    // =========================================================================
    function matchProjectZone(unit, projFilter) {
      if (projFilter === "ALL") return true;
      if (projFilter === "ZONE_BANTIAN") return unit.zone === "坂田片区";
      if (projFilter === "ZONE_BUJI") return unit.zone === "布吉/南湾";
      if (projFilter === "ZONE_DAYUN") return unit.zone === "龙岗大运";
      return unit.project === projFilter;
    }

    function updateBuildingOptions() {
      const proj = byId("filterProject").value;
      const bSelect = byId("filterBuilding");
      const currentVal = bSelect.value;

      const buildings = Array.from(new Set(
        UNITS_DATA
          .filter(u => matchProjectZone(u, proj))
          .map(u => `${u.project} - ${u.building}`)
      ));

      bSelect.innerHTML = `<option value="ALL">全部楼栋 (${buildings.length}组)</option>` +
        buildings.map(b => `<option value="${b}">${b}</option>`).join("");

      if (buildings.includes(currentVal)) {
        bSelect.value = currentVal;
      }
    }

    function renderUnitCards() {
      const proj = byId("filterProject").value;
      const bld = byId("filterBuilding").value;
      const layout = byId("filterLayout").value;
      const orient = byId("filterOrientation").value;
      const noise = byId("filterNoise").value;
      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      const weights = getWeights();

      byId("maxPriceLabel").textContent =
        maxSlider >= 720 ? "不限上限 (≤720万)" : `预算上限 ≤ ${maxSlider} 万`;

      const filtered = UNITS_DATA.filter(u => {
        if (!matchProjectZone(u, proj)) return false;
        if (bld !== "ALL" && `${u.project} - ${u.building}` !== bld) return false;
        if (layout !== "ALL" && u.layoutType !== layout) return false;
        if (orient !== "VALID_SOUTH" && u.orientation !== orient) return false;
        if (noise === "QUIET_ONLY" && u.noiseLevel !== "QUIET") return false;
        if (noise === "NO_MAIN" && u.noiseLevel === "MAIN_ROAD") return false;
        if (!matchPriceFilter(u)) return false;
        if (!matchCommuteFilter(u)) return false;
        return true;
      }).map(u => ({ ...u, totalScore: calcWeightedScore(u, weights) }))
        .sort((a, b) => b.totalScore - a.totalScore);

      byId("matchCountBadge").textContent = `匹配 ${filtered.length} 个楼栋户型`;

      const container = byId("unitCardsContainer");
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-300">
            当前筛选条件下暂无匹配户型，建议放宽“总价区间”或“至贝尔路站通勤时长”选项。
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(u => {
        const isCompared = compareIds.includes(u.id);
        let noiseBadgeClass = "badge-green";
        if (u.noiseLevel === "SUB_ROAD") noiseBadgeClass = "badge-amber";
        if (u.noiseLevel === "MAIN_ROAD") noiseBadgeClass = "badge-red";

        let zoneBadgeColor = "bg-slate-800 text-white";
        if (u.zone === "坂田片区") zoneBadgeColor = "bg-pink-700 text-white";
        if (u.zone === "龙岗大运") zoneBadgeColor = "bg-indigo-700 text-white";

        return `
          <div class="rounded-xl border ${u.noiseLevel === 'MAIN_ROAD' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 bg-white'} p-4 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <!-- 头部标签 -->
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded ${zoneBadgeColor}">${u.zone}</span>
                  <span class="font-bold text-xs text-slate-900">${u.project}</span>
                </div>
                <span class="text-xs font-bold text-indigo-600">得分：${u.totalScore}</span>
              </div>

              <!-- 楼栋与户型标题 -->
              <h3 class="text-sm font-bold text-slate-900">${u.building} · ${u.unitCode}</h3>

              <!-- 核心属性标签（含总价与贝尔路通勤高亮） -->
              <div class="flex flex-wrap gap-1.5 mt-2.5 text-[11px]">
                <span class="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  💰 ${u.priceRange}
                </span>
                <span class="px-2 py-0.5 rounded font-bold badge-blue">
                  🚇 贝尔路约${u.commuteMins}分钟
                </span>
                <span class="px-2 py-0.5 rounded font-semibold ${u.layoutType === '3室2卫' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'}">
                  ${u.area} · ${u.layoutType}
                </span>
                <span class="px-2 py-0.5 rounded font-semibold bg-amber-100 text-amber-800">
                  ☀️ 阳台${u.orientation}
                </span>
                <span class="px-2 py-0.5 rounded font-semibold ${noiseBadgeClass}">
                  ${u.noiseLabel}
                </span>
              </div>

              <!-- 细节列表 -->
              <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div class="text-pink-900 bg-pink-50/70 px-2 py-1 rounded"><strong class="text-pink-800">🚇 太太地铁通勤：</strong>${u.commuteRoute}</div>
                <div><strong class="text-slate-800">道路与分贝：</strong>${u.roadDetail}（${u.noiseDb}）</div>
                <div><strong class="text-slate-800">对口中小学：</strong>${u.schoolPrimary.split("（")[0]} + ${u.schoolMiddle}</div>
                <div class="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-700 leading-relaxed">
                  👶 <strong>二胎与家庭点评：</strong>${u.twoKidsNote}
                </div>
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">${u.delivery}</span>
              <button type="button" data-compare-id="${u.id}" class="px-3 py-1 rounded-lg text-xs font-semibold transition ${
                isCompared
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }">
                ${isCompared ? '✓ 已在PK台 (移除)' : '+ 加入PK对比台'}
              </button>
            </div>
          </div>
        `;
      }).join("");
    }

    // =========================================================================
    // 5. 渲染底部深度 PK 对比台
    // =========================================================================
    function toggleCompare(id) {
      if (compareIds.includes(id)) {
        compareIds = compareIds.filter(item => item !== id);
      } else {
        if (compareIds.length >= 5) {
          alert("PK对比台最多同时放置 5 个楼栋户型，请先移除一个再添加。");
          return;
        }
        compareIds.push(id);
      }
      renderUnitCards();
      renderCompareTable();
    };

    function renderCompareTable() {
      const weights = getWeights();
      const selectedUnits = compareIds
        .map(id => UNITS_DATA.find(u => u.id === id))
        .filter(Boolean);

      const table = byId("compareTable");
      if (selectedUnits.length === 0) {
        table.innerHTML = `<tr><td class="p-6 text-center text-slate-400">请在上方卡片中点击“+ 加入PK对比台”添加对比项</td></tr>`;
        return;
      }

      const rows = [
        { label: "所属片区与楼盘", render: u => `<span class="px-1.5 py-0.5 text-[10px] rounded bg-slate-200 text-slate-800 mr-1">${u.zone}</span><span class="font-bold text-slate-900">${u.project}</span>` },
        { label: "具体期数与楼栋", render: u => `<span class="font-bold text-indigo-700">${u.building}</span><br/><span class="text-slate-500">${u.unitCode}</span>` },
        { label: "当前加权总分", render: u => `<span class="px-2.5 py-1 bg-indigo-600 text-white rounded-full font-bold">${calcWeightedScore(u, weights)} 分</span>` },
        { label: "🚇 太太至贝尔路站通勤", render: u => `<div class="font-bold text-pink-700">约 ${u.commuteMins} 分钟</div><div class="text-slate-500 mt-0.5">${u.commuteRoute}</div>` },
        { label: "参考房屋总价", render: u => `<span class="font-bold text-rose-600 text-sm">${u.priceRange}</span>` },
        { label: "户型与面积", render: u => `<strong>${u.area} · ${u.layoutType}</strong>（${u.usableRate}）` },
        { label: "阳台朝向", render: u => `<span class="font-semibold text-amber-700">☀️ ${u.orientation}</span>` },
        { label: "临街属性与分贝", render: u => `<div><span class="font-semibold">${u.noiseLabel}</span></div><div class="text-slate-500 mt-0.5">${u.noiseDb}</div>` },
        { label: "对口小学", render: u => u.schoolPrimary },
        { label: "对口初中与升学率", render: u => u.schoolMiddle },
        { label: "二胎家庭综合评估", render: u => u.twoKidsNote }
      ];

      table.innerHTML = `
        <thead>
          <tr class="bg-slate-100 border-b border-slate-200">
            <th class="py-3 px-3 w-36 font-semibold text-slate-700">对比维度</th>
            ${selectedUnits.map(u => `
              <th class="py-3 px-3 min-w-[205px]">
                <div class="flex items-center justify-between gap-1">
                  <span class="text-indigo-900 font-bold">${u.project} · ${u.building}</span>
                  <button type="button" data-compare-id="${u.id}" class="text-slate-400 hover:text-rose-600 text-xs shrink-0">✕ 移除</button>
                </div>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          ${rows.map(r => `
            <tr class="hover:bg-slate-50/70">
              <td class="py-2.5 px-3 font-semibold text-slate-700 bg-slate-50/60">${r.label}</td>
              ${selectedUnits.map(u => `<td class="py-2.5 px-3 text-slate-700 align-top">${r.render(u)}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      `;
    }

    // =========================================================================
    // 6. 初始化 15 盘学区升学率 vs 贝尔路通勤时长双维图表 (Chart.js)
    // =========================================================================
    function initSchoolChart() {
      const ctx = byId("schoolChart").getContext("2d");
      window.Chart.defaults.font.family = getComputedStyle(root).fontFamily;
      window.Chart.defaults.color = "#63615B";
      window.Chart.defaults.borderColor = "#E3E0D5";
      new window.Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "【坂田】深实验坂田(诺德)",
            "【坂田】科技城外国语(嘉御山)",
            "【坂田】深大附坂田(佳兆业/大族)",
            "【布吉】南师大龙岗(麓城/尚峰)",
            "【南湾】石芽岭学校(特发)",
            "【大运】深中龙岗(星河)",
            "【大运】华附大运(颐安/阅云境)",
            "【大运】港中大知新/道远(4盘)"
          ],
          datasets: [
            {
              label: "中考公办普高录取率均值 (%)",
              data: [76.8, 74.0, 66.0, 79.1, 59.5, 80.2, 76.0, 74.2],
              backgroundColor: "#D97757",
              borderRadius: 5
            },
            {
              label: "至贝尔路地铁站单程耗时 (分钟)",
              data: [17, 14, 12, 23, 33, 45, 43, 53],
              backgroundColor: "#527766",
              borderRadius: 5
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            x: {
              min: 0,
              max: 90,
              ticks: { font: { size: 10 } }
            },
            y: {
              ticks: { font: { size: 11 }, callback: function(value) { const label = this.getLabelForValue(value); return label.match(/.{1,12}/gu) || label; } }
            }
          }
        }
      });
    }

    // =========================================================================
    // 7. 事件监听绑定与初始化
    // =========================================================================
    function bindEvents() {
      ["wQuiet", "wEdu", "wCommute", "wSpace", "wComm"].forEach(id => {
        byId(id).addEventListener("input", () => {
          renderTopRecommendations();
          renderUnitCards();
          renderCompareTable();
        });
      });

      byId("resetWeightsBtn").addEventListener("click", () => {
        byId("wQuiet").value = 25;
        byId("wEdu").value = 25;
        byId("wCommute").value = 20;
        byId("wSpace").value = 20;
        byId("wComm").value = 10;
        renderTopRecommendations();
        renderUnitCards();
        renderCompareTable();
      });

      byId("filterProject").addEventListener("change", () => {
        updateBuildingOptions();
        renderUnitCards();
      });

      ["filterBuilding", "filterLayout", "filterOrientation", "filterNoise"].forEach(id => {
        byId(id).addEventListener("change", renderUnitCards);
      });

      ["filterPriceBracket", "filterCommute"].forEach(id => {
        byId(id).addEventListener("change", () => {
          renderTopRecommendations();
          renderUnitCards();
        });
      });

      byId("filterMaxPriceSlider").addEventListener("input", () => {
        renderTopRecommendations();
        renderUnitCards();
      });

      byId("resetFilterBtn").addEventListener("click", () => {
        byId("filterProject").value = "ALL";
        updateBuildingOptions();
        byId("filterBuilding").value = "ALL";
        byId("filterLayout").value = "ALL";
        byId("filterOrientation").value = "VALID_SOUTH";
        byId("filterNoise").value = "NO_MAIN";
        byId("filterPriceBracket").value = "ALL";
        byId("filterCommute").value = "ALL";
        byId("filterMaxPriceSlider").value = 720;
        renderTopRecommendations();
        renderUnitCards();
      });

      byId("clearCompareBtn").addEventListener("click", () => {
        compareIds = ["bt-xinyi-5-89", "bt-nuode-2-89", "bt-kaisa-3-89", "vanke-3-89", "horoy-6-89"];
        renderUnitCards();
        renderCompareTable();
      });
    }

    function init() {
      updateBuildingOptions();
      renderTopRecommendations();
      renderUnitCards();
      renderCompareTable();
      initSchoolChart();
      bindEvents();
      root.addEventListener("click", event => {
        const button = event.target.closest("button[data-compare-id]");
        if (button && root.contains(button)) toggleCompare(button.dataset.compareId);
      });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
  
})();
