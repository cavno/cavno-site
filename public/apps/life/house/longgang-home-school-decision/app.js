/* 保留附件数据与计算规则；DOM 查询和事件仅作用于本页。 */
(() => {
  const root = document.getElementById('lg-house-app');
  if (!root) return;
  const byId = id => root.querySelector('#' + id);

    // =========================================================================
    // 1. 11盘完整楼栋户型数据库（含片区、期、栋、户型、朝向、噪音、总价上下限、学位）
    // =========================================================================
    const UNITS_DATA = [
      // ==================== A. 布吉水径 / 南湾片区 (3盘) ====================
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
        delivery: "现房（万科物业）",
        schoolPrimary: "万科麓城外国语小学（步行350m）",
        schoolMiddle: "南京师范大学附属龙岗学校（公办率80.8%）",
        twoKidsNote: "经典竖厅三房两卫，早高峰4人洗漱从容；小学就在家门口，生源纯粹，老大2029/老二2032入学零风险。",
        scores: { quiet: 96, edu: 95, space: 86, comm: 93 }
      },
      {
        id: "vanke-1-88",
        zone: "布吉/南湾",
        project: "万科麓城三期",
        phase: "三期",
        building: "1栋A座 / 1栋B座",
        unitCode: "01/02户型 (次外围)",
        layoutType: "3室1卫",
        area: "88㎡",
        usableRate: "约81%",
        orientation: "西南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 水径支路备选",
        noiseDb: "约 51~55 dB（关窗约38dB）",
        roadDetail: "避开布龙路主干道，靠近水径社区支路，早晚接送时段有轻微车流声",
        minPrice: 375,
        maxPrice: 398,
        priceRange: "375~398 万",
        delivery: "现房（万科物业）",
        schoolPrimary: "万科麓城外国语小学",
        schoolMiddle: "南京师范大学附属龙岗学校（公办率80.8%）",
        twoKidsNote: "三期上车门槛较低，但仅1个卫生间，二胎长大后早高峰需错峰使用。",
        scores: { quiet: 75, edu: 95, space: 74, comm: 90 }
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
        delivery: "现房（万科物业）",
        schoolPrimary: "万科麓城外国语小学",
        schoolMiddle: "南京师范大学附属龙岗学校",
        twoKidsNote: "虽朝东南且总价低，但布龙路噪音影响8个月婴儿睡眠，建议直接排除。",
        scores: { quiet: 35, edu: 95, space: 73, comm: 84 }
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
        delivery: "现房（鸿荣源物业）",
        schoolPrimary: "水径小学 / 麓城外国语 / 水径九年一贯制(共享)",
        schoolMiddle: "南京师范大学附属龙岗学校(共享，公办率80.8%)",
        twoKidsNote: "鸿荣源豪宅级园林与人车分流，推婴儿车体验极佳；89㎡标准三房两卫实用率高。",
        scores: { quiet: 97, edu: 89, space: 89, comm: 95 }
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
        delivery: "现房（鸿荣源物业）",
        schoolPrimary: "水径小学 / 水径九年一贯制(共享)",
        schoolMiddle: "南京师范大学附属龙岗学校(共享)",
        twoKidsNote: "360万级享受鸿荣源品质园林与南师大附校共享学区，唯独单卫需错峰。",
        scores: { quiet: 91, edu: 89, space: 77, comm: 92 }
      },
      {
        id: "horoy-1-89",
        zone: "布吉/南湾",
        project: "鸿荣源尚峰",
        phase: "一期围合",
        building: "1栋 / 2栋 / 8栋",
        unitCode: "北侧临路单元",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约83%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 直面布龙路",
        noiseDb: "约 66~73 dB（重度车流声）",
        roadDetail: "北侧紧贴布龙路主干道及高架方向，全天车流量大，不建议考虑",
        minPrice: 350,
        maxPrice: 375,
        priceRange: "350~375 万",
        delivery: "现房（鸿荣源物业）",
        schoolPrimary: "水径小学 / 水径九年一贯制(共享)",
        schoolMiddle: "南京师范大学附属龙岗学校(共享)",
        twoKidsNote: "触碰主干道红线，噪音超标，直接排除。",
        scores: { quiet: 30, edu: 89, space: 85, comm: 86 }
      },
      {
        id: "tefa-3-96",
        zone: "布吉/南湾",
        project: "特发臻华府",
        phase: "一期（建筑新规）",
        building: "3栋 (纯商品房楼王)",
        unitCode: "01/02户型 (阔景横厅)",
        layoutType: "3室2卫",
        area: "96㎡",
        usableRate: "约98%（新规超高实得）",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中央园林",
        noiseDb: "约 42~45 dB（极安静）",
        roadDetail: "整栋纯商品房无配建混居，位于社区中心，远离盛宝路主干道与铁路",
        minPrice: 395,
        maxPrice: 430,
        priceRange: "395~430 万",
        delivery: "期房（2028.06精装交付）",
        schoolPrimary: "石芽岭学校 + 旁侧规划54班深大附中南湾学校",
        schoolMiddle: "石芽岭学校(公办率~61.5%) + 规划54班新校",
        twoKidsNote: "新规96㎡实得堪比老盘115㎡！大横厅+东南阳台+双明卫，自带18班幼儿园，目送式上学。",
        scores: { quiet: 95, edu: 82, space: 98, comm: 92 }
      },
      {
        id: "tefa-3-87",
        zone: "布吉/南湾",
        project: "特发臻华府",
        phase: "一期（建筑新规）",
        building: "3栋 (内圈) / 1栋·6栋 (辅路)",
        unitCode: "03/04户型 (三开间朝南)",
        layoutType: "3室2卫",
        area: "87㎡",
        usableRate: "约96%（新规高得房率）",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街/辅路 · 园林内侧",
        noiseDb: "约 43~48 dB（安静）",
        roadDetail: "3栋完全不临街（西南/南向）；1栋/6栋靠宝西路支路（正南向辅路备选）",
        minPrice: 348,
        maxPrice: 380,
        priceRange: "348~380 万",
        delivery: "期房（2028.06精装交付）",
        schoolPrimary: "石芽岭学校 + 规划54班深大附中南湾学校",
        schoolMiddle: "石芽岭学校 + 规划54班新校",
        twoKidsNote: "350万级买新规87㎡真三房两卫，比老盘88㎡单卫多出一个独立卫浴，二胎极实用。",
        scores: { quiet: 91, edu: 82, space: 94, comm: 91 }
      },

      // ==================== B. 龙岗大运片区 (新增 8 盘) ====================

      // ---------------- 4. 佳兆业未来花园 (佳兆业未来中央花园 / 佳兆业未来城) ----------------
      {
        id: "kaisa-3-89",
        zone: "龙岗大运",
        project: "佳兆业未来花园",
        phase: "一期",
        building: "3栋 / 4栋 (园林央座)",
        unitCode: "89㎡南向园林三房两卫",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约82%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中心园林",
        noiseDb: "约 42~46 dB（安静）",
        roadDetail: "位于小区腹地，避开如意路与龙飞大道，直看内部泳池园林，安静度高",
        minPrice: 365,
        maxPrice: 405,
        priceRange: "365~405 万",
        delivery: "次新现房（2019-2020交付）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校(小学部)",
        schoolMiddle: "香港中文大学(深圳)附属知新学校(公办率~75%)",
        twoKidsNote: "2020年左右次新社区，人车分流，89㎡三房两卫动静分区好，对口港中大附属知新九年一贯制名校。",
        scores: { quiet: 93, edu: 91, space: 87, comm: 91 }
      },
      {
        id: "kaisa-2-89",
        zone: "龙岗大运",
        project: "佳兆业未来花园",
        phase: "一期",
        building: "2栋 / 5栋",
        unitCode: "89㎡西南向单元",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约82%",
        orientation: "西南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 华美中路社区支路",
        noiseDb: "约 50~54 dB（中高层安静）",
        roadDetail: "完全避开如意路主干道，靠近华美中街生活辅路，夜间车流极少",
        minPrice: 350,
        maxPrice: 375,
        priceRange: "350~375 万",
        delivery: "次新现房（2019-2020交付）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校",
        twoKidsNote: "比中心楼王便宜约15~20万，同样享受次新园林、双卫格局与港中大知新学校九年一贯学位。",
        scores: { quiet: 80, edu: 91, space: 86, comm: 90 }
      },
      {
        id: "kaisa-1-89",
        zone: "龙岗大运",
        project: "佳兆业未来花园",
        phase: "一期",
        building: "1栋 / 6栋 (外围临路)",
        unitCode: "89㎡外侧单元",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约81%",
        orientation: "东南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 如意路侧",
        noiseDb: "约 62~68 dB（干道车流声）",
        roadDetail: "靠近如意路主干道及红绿灯路口，早晚高峰车流噪音明显",
        minPrice: 335,
        maxPrice: 355,
        priceRange: "335~355 万",
        delivery: "次新现房",
        schoolPrimary: "香港中文大学(深圳)附属知新学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校",
        twoKidsNote: "虽总价低但临如意路主干道，不符合严避主干道要求，建议避开。",
        scores: { quiet: 40, edu: 91, space: 85, comm: 85 }
      },

      // ---------------- 5. 京基御景中央 (一期 / 二期) ----------------
      {
        id: "kk-3-97",
        zone: "龙岗大运",
        project: "京基御景中央",
        phase: "一期 / 二期",
        building: "一期3栋·4栋 / 二期3栋",
        unitCode: "97~98㎡双龙抱珠/南向通透",
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
        delivery: "次新现房（2018-2020交付）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校 / 道远学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校 / 道远学校(公办率~75%)",
        twoKidsNote: "97㎡比传统89㎡多出近8㎡室内空间，客厅与两个次卧更宽裕，二胎居住尺度和收纳明显更舒适！",
        scores: { quiet: 95, edu: 91, space: 92, comm: 93 }
      },
      {
        id: "kk-2-86",
        zone: "龙岗大运",
        project: "京基御景中央",
        phase: "一期 / 二期",
        building: "一期2栋A·2B / 二期2栋",
        unitCode: "86㎡南向精装三房一卫",
        layoutType: "3室1卫",
        area: "86㎡",
        usableRate: "约80%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 看社区内园林",
        noiseDb: "约 43~47 dB（安静）",
        roadDetail: "阳台朝向小区内部中心园林，避开主干道车流，安静且采光极佳",
        minPrice: 305,
        maxPrice: 339,
        priceRange: "305~339 万",
        delivery: "次新现房（2018-2020交付）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校 / 道远学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校 / 道远学校",
        twoKidsNote: "305~339万即可买到大运核心区次新豪宅盘+港中大附属名校，预算控制在340万内的极佳选择。",
        scores: { quiet: 92, edu: 91, space: 78, comm: 92 }
      },
      {
        id: "kk-1-86",
        zone: "龙岗大运",
        project: "京基御景中央",
        phase: "一期",
        building: "一期1栋 / 5栋 (外侧)",
        unitCode: "86~97㎡外围临路单元",
        layoutType: "3室1卫",
        area: "86㎡",
        usableRate: "约80%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 如意路/飞扬路",
        noiseDb: "约 61~67 dB（路口噪音）",
        roadDetail: "靠近外围道路交叉口，车流声较明显，不建议首选",
        minPrice: 295,
        maxPrice: 320,
        priceRange: "295~320 万",
        delivery: "次新现房",
        schoolPrimary: "香港中文大学(深圳)附属知新学校 / 道远学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校 / 道远学校",
        twoKidsNote: "低总价临路房源，建议加15万选内圈2栋/3栋。",
        scores: { quiet: 42, edu: 91, space: 76, comm: 86 }
      },

      // ---------------- 6. 颐安·都会中央 (二期 / 三期 / 四期) ----------------
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
        roadDetail: "深居二期/三期园林内侧，完全避开龙岗大道、地铁3号线高架及黄阁路",
        minPrice: 385,
        maxPrice: 430,
        priceRange: "385~430 万",
        delivery: "次新现房（颐安物业）",
        schoolPrimary: "华南师范大学附属龙岗大运学校（下楼即达）",
        schoolMiddle: "华南师范大学附属龙岗大运学校（公办率77.5%）",
        twoKidsNote: "大运百万方旗舰综合体，紧邻华附大运学校（真正目送式九年一贯制名校），双孩接送省心度满分！",
        scores: { quiet: 94, edu: 94, space: 88, comm: 95 }
      },
      {
        id: "yian-2-88",
        zone: "龙岗大运",
        project: "颐安·都会中央",
        phase: "二期",
        building: "二期4栋 / 5栋",
        unitCode: "84~88㎡南向三房一卫",
        layoutType: "3室1卫",
        area: "88㎡",
        usableRate: "约81%",
        orientation: "正南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 社区内部支路",
        noiseDb: "约 49~53 dB（温和可控）",
        roadDetail: "避开龙岗大道与黄阁路主干道，靠近学校侧安静内部辅路，仅上下学时段热闹",
        minPrice: 319,
        maxPrice: 350,
        priceRange: "319~350 万",
        delivery: "次新现房",
        schoolPrimary: "华南师范大学附属龙岗大运学校",
        schoolMiddle: "华南师范大学附属龙岗大运学校（公办率77.5%）",
        twoKidsNote: "320~340万级即可拿下颐安都会中央+华附大运九年一贯制学位，总价极具吸引力。",
        scores: { quiet: 81, edu: 94, space: 77, comm: 93 }
      },
      {
        id: "yian-1-89",
        zone: "龙岗大运",
        project: "颐安·都会中央",
        phase: "二期 / 三期",
        building: "二期1栋 / 三期1栋·4栋",
        unitCode: "89㎡外围临大路单元",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约81%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 龙岗大道/黄阁路",
        noiseDb: "约 65~71 dB（大道及高架声）",
        roadDetail: "靠近龙岗大道或黄阁路主干道，车流密集，部分楼栋受3号线高架声影响",
        minPrice: 335,
        maxPrice: 365,
        priceRange: "335~365 万",
        delivery: "次新现房",
        schoolPrimary: "华南师范大学附属龙岗大运学校",
        schoolMiddle: "华南师范大学附属龙岗大运学校",
        twoKidsNote: "看房时务必避开临龙岗大道/黄阁路一侧楼栋，认准内园2栋/3栋。",
        scores: { quiet: 34, edu: 94, space: 85, comm: 88 }
      },

      // ---------------- 7. 星河时代花园 ----------------
      {
        id: "galaxy-6-89",
        zone: "龙岗大运",
        project: "星河时代花园",
        phase: "一期高层区",
        building: "5栋 / 6栋 / 7栋 (内园看别墅)",
        unitCode: "89㎡高拓三房两卫",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约86%（高赠送偷面积）",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 俯瞰别墅区与中央园林",
        noiseDb: "约 40~44 dB（极安静视野绝佳）",
        roadDetail: "内侧高层，南向俯瞰低密联排别墅区与花园，彻底隔绝黄阁南路与龙岗大道噪音",
        minPrice: 430,
        maxPrice: 475,
        priceRange: "430~475 万",
        delivery: "成熟现房（星河智善生活物业）",
        schoolPrimary: "深中龙岗小学 / 龙外(集团)星河学校",
        schoolMiddle: "深圳中学龙岗学校（公办率81.5%，顶级名校）",
        twoKidsNote: "大运老牌标杆，赠送面积极大（实得堪比100㎡+），下楼即山姆会员店+星河COCO Park，配深中龙岗王牌学位！",
        scores: { quiet: 96, edu: 98, space: 90, comm: 96 }
      },
      {
        id: "galaxy-3-86",
        zone: "龙岗大运",
        project: "星河时代花园",
        phase: "一期高层区",
        building: "3栋 / 8栋",
        unitCode: "86㎡南向高拓三房一卫",
        layoutType: "3室1卫",
        area: "86㎡",
        usableRate: "约85%",
        orientation: "东南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 怡翠路支线",
        noiseDb: "约 49~53 dB（安静可控）",
        roadDetail: "避开黄阁南路与龙岗大道两大主干道，靠近怡翠路社区辅道，居家安静",
        minPrice: 380,
        maxPrice: 415,
        priceRange: "380~415 万",
        delivery: "成熟现房",
        schoolPrimary: "深中龙岗小学 / 龙外(集团)星河学校",
        schoolMiddle: "深圳中学龙岗学校（公办率81.5%）",
        twoKidsNote: "400万以内入主星河时代+深中龙岗学位的黄金跳板，山姆商圈一步到位。",
        scores: { quiet: 82, edu: 98, space: 79, comm: 94 }
      },
      {
        id: "galaxy-1-89",
        zone: "龙岗大运",
        project: "星河时代花园",
        phase: "一期高层区",
        building: "1栋 / 2栋 (西侧外围)",
        unitCode: "89㎡西侧临路单元",
        layoutType: "3室2卫",
        area: "89㎡",
        usableRate: "约85%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 黄阁南路侧",
        noiseDb: "约 63~69 dB（干道车流声）",
        roadDetail: "西侧直面黄阁南路主干道，车速快、车流量大，不符合静音刚需",
        minPrice: 375,
        maxPrice: 405,
        priceRange: "375~405 万",
        delivery: "成熟现房",
        schoolPrimary: "深中龙岗小学 / 龙外(集团)星河学校",
        schoolMiddle: "深圳中学龙岗学校",
        twoKidsNote: "虽有深中龙岗学位，但临黄阁南路主干道噪音大，建议加预算选5/6/7栋。",
        scores: { quiet: 38, edu: 98, space: 87, comm: 89 }
      },

      // ---------------- 8. 中海康城花园 (一期 / 二期) ----------------
      {
        id: "cohl-kc-89",
        zone: "龙岗大运",
        project: "中海康城花园",
        phase: "一期 / 二期",
        building: "一期3栋·4栋 / 二期12栋·15栋",
        unitCode: "87~89㎡中心园景三房两卫",
        layoutType: "3室2卫",
        area: "88㎡",
        usableRate: "约82%",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 大社区中央花园",
        noiseDb: "约 42~46 dB（安静）",
        roadDetail: "位于超大型围合花园中心栋，远离北通道（盐龙大道）与黄阁北路，绿树成荫",
        minPrice: 235,
        maxPrice: 268,
        priceRange: "235~268 万",
        delivery: "成熟现房（2010-2011交付，中海物业）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校(小学部)",
        schoolMiddle: "香港中文大学(深圳)附属知新学校(公办率~75%)",
        twoKidsNote: "全大运片区性价比之王！仅240~265万即可买到不临街正南三房两卫+港中大知新九年一贯制名校，资金压力极小！",
        scores: { quiet: 92, edu: 91, space: 83, comm: 86 }
      },
      {
        id: "cohl-kc-85",
        zone: "龙岗大运",
        project: "中海康城花园",
        phase: "一期",
        building: "一期2栋 / 5栋 (内圈)",
        unitCode: "82~86㎡南向三房一卫",
        layoutType: "3室1卫",
        area: "85㎡",
        usableRate: "约81%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 内部园林",
        noiseDb: "约 43~47 dB（安静）",
        roadDetail: "朝向小区内部花园，避开外围主干道，生活气息浓厚",
        minPrice: 205,
        maxPrice: 230,
        priceRange: "205~230 万",
        delivery: "成熟现房（中海物业）",
        schoolPrimary: "香港中文大学(深圳)附属知新学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校",
        twoKidsNote: "210万级超低总价上车大运核心名校，留出充裕家庭教育基金，缺点是楼龄较早（2010年）且单卫。",
        scores: { quiet: 90, edu: 91, space: 74, comm: 85 }
      },
      {
        id: "cohl-kc-1",
        zone: "龙岗大运",
        project: "中海康城花园",
        phase: "一期 / 二期",
        building: "外围北侧/西侧临路栋",
        unitCode: "86㎡外围临路单元",
        layoutType: "3室1卫",
        area: "86㎡",
        usableRate: "约80%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 龙平西路/黄阁路",
        noiseDb: "约 64~70 dB（货车及干道声）",
        roadDetail: "靠近北侧龙平西路/盐龙大道辅道或黄阁路，大车噪音明显",
        minPrice: 195,
        maxPrice: 210,
        priceRange: "195~210 万",
        delivery: "成熟现房",
        schoolPrimary: "香港中文大学(深圳)附属知新学校",
        schoolMiddle: "香港中文大学(深圳)附属知新学校",
        twoKidsNote: "中海康城内部楼栋极多，看房务必避开北侧和西侧临主干道楼栋。",
        scores: { quiet: 35, edu: 91, space: 73, comm: 80 }
      },

      // ---------------- 9. 中海大运玖章 (2025.12开盘新盘，2027.12交付) ----------------
      {
        id: "cohl-jz-126",
        zone: "龙岗大运",
        project: "中海大运玖章",
        phase: "一期（高奢新规）",
        building: "3栋A座 / 3栋B座 (央座)",
        unitCode: "126~139㎡新规3+1室2卫",
        layoutType: "3室2卫",
        area: "126㎡",
        usableRate: "约93%（新规超高实得）",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 中央度假式园林",
        noiseDb: "约 40~44 dB（静谧纯粹）",
        roadDetail: "位于纯粹改善社区中央，车库入户，远离黄阁路主干道，配三玻两腔隔音系统",
        minPrice: 580,
        maxPrice: 708,
        priceRange: "580~708 万",
        delivery: "期房（2027.12精装交付）",
        schoolPrimary: "待2028交房后划片（紧邻龙外本部/知新/自建校）",
        schoolMiddle: "待交房后划片（大运核心名校圈，暂未锁定龙外本部）",
        twoKidsNote: "该盘起步即126㎡/139㎡改善四房/大三房两卫，居住品质与圈层全区天花板；但注意期房暂未划定固定龙外本部学区，总价门槛580万起。",
        scores: { quiet: 97, edu: 78, space: 99, comm: 98 }
      },
      {
        id: "cohl-jz-4",
        zone: "龙岗大运",
        project: "中海大运玖章",
        phase: "一期（高奢新规）",
        building: "4栋1单元 (次内圈)",
        unitCode: "126㎡南向改善户型",
        layoutType: "3室2卫",
        area: "126㎡",
        usableRate: "约92%",
        orientation: "西南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 社区规划支路",
        noiseDb: "约 47~51 dB（高配隔音窗）",
        roadDetail: "避开主干道，靠近内部规划支路，安静度与视野俱佳",
        minPrice: 555,
        maxPrice: 645,
        priceRange: "555~645 万",
        delivery: "期房（2027.12精装交付）",
        schoolPrimary: "待交房后划片（大运核心学区圈）",
        schoolMiddle: "待交房后划片（大运核心学区圈）",
        twoKidsNote: "适合预算充裕（600万级）、极度看重次新豪宅品质且接受交房后当年官方划片的二胎家庭。",
        scores: { quiet: 86, edu: 78, space: 97, comm: 96 }
      },

      // ---------------- 10. 深铁阅云境广场 (大运枢纽TOD新盘) ----------------
      {
        id: "szt-yyj-98",
        zone: "龙岗大运",
        project: "深铁阅云境广场",
        phase: "一期（TOD新规）",
        building: "1栋2单元 / 1栋3单元 (园林侧)",
        unitCode: "98~104㎡精装三房两卫",
        layoutType: "3室2卫",
        area: "98㎡",
        usableRate: "约90%（新规精装）",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 抬高式空中花园内侧",
        noiseDb: "约 44~48 dB（安静）",
        roadDetail: "朝向抬高式园林内院，由外围商业及楼体遮挡龙岗大道车流，配深铁高标隔音窗",
        minPrice: 355,
        maxPrice: 435,
        priceRange: "355~435 万",
        delivery: "准现房（2026年底精装交付）",
        schoolPrimary: "华南师范大学附属龙岗大运学校 / 规划72班新校",
        schoolMiddle: "华南师范大学附属龙岗大运学校 / 楼下规划72班九年一贯制",
        twoKidsNote: "地下直连大运四轨交汇枢纽（3/14/16/深大城际），父母跨区通勤无敌；楼下规划72班九年一贯制公办校+周边华附大运教育资源。",
        scores: { quiet: 90, edu: 89, space: 93, comm: 94 }
      },
      {
        id: "szt-yyj-4",
        zone: "龙岗大运",
        project: "深铁阅云境广场",
        phase: "一期（TOD新规）",
        building: "1栋4单元 (加推高性价比栋)",
        unitCode: "98~102㎡西南向精装三房两卫",
        layoutType: "3室2卫",
        area: "100㎡",
        usableRate: "约90%",
        orientation: "西南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 综合体内街支路",
        noiseDb: "约 50~54 dB（关窗极静）",
        roadDetail: "避开龙岗大道主干道正立面，靠近片区内部辅道及商业街，折后总价极具竞争力",
        minPrice: 336,
        maxPrice: 385,
        priceRange: "336~385 万",
        delivery: "准现房（2026年底精装交付）",
        schoolPrimary: "华南师范大学附属龙岗大运学校 / 规划72班新校",
        schoolMiddle: "华南师范大学附属龙岗大运学校 / 规划72班新校",
        twoKidsNote: "336万起买大运枢纽精装100㎡三房两卫国企准现房，2026年底交付后从容办理落户，完美衔接老大2029幼升小。",
        scores: { quiet: 80, edu: 89, space: 92, comm: 93 }
      },
      {
        id: "szt-yyj-1",
        zone: "龙岗大运",
        project: "深铁阅云境广场",
        phase: "一期（TOD新规）",
        building: "1栋1单元 (西侧临大道)",
        unitCode: "100~104㎡临路单元",
        layoutType: "3室2卫",
        area: "102㎡",
        usableRate: "约89%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 龙岗大道枢纽侧",
        noiseDb: "约 63~69 dB（干道及枢纽车流）",
        roadDetail: "靠近龙岗大道主干道及公交枢纽方向，车流繁忙，建议避开",
        minPrice: 330,
        maxPrice: 365,
        priceRange: "330~365 万",
        delivery: "准现房",
        schoolPrimary: "华南师范大学附属龙岗大运学校 / 规划72班新校",
        schoolMiddle: "华南师范大学附属龙岗大运学校 / 规划72班新校",
        twoKidsNote: "选深铁阅云境务必挑朝花园内侧的2/3/4单元，避开直面龙岗大道的户型。",
        scores: { quiet: 38, edu: 89, space: 90, comm: 87 }
      },

      // ---------------- 11. 泰瑞府 (深业泰瑞府，2026.05部分交付准现房/现房) ----------------
      {
        id: "sy-trf-99",
        zone: "龙岗大运",
        project: "泰瑞府",
        phase: "一期（深业国企精装）",
        building: "2栋 / 3栋 (中央园景栋)",
        unitCode: "99~102㎡精装三房两卫",
        layoutType: "3室2卫",
        area: "99㎡",
        usableRate: "约88%",
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 社区中心园林",
        noiseDb: "约 41~45 dB（极安静）",
        roadDetail: "位于小区中心位置，避开龙飞大道与如意路，直看中心花园，2026年5月已陆续交付",
        minPrice: 337,
        maxPrice: 415,
        priceRange: "337~415 万",
        delivery: "国企准现房/现房（2026.05交付）",
        schoolPrimary: "香港中文大学(深圳)附属道远学校 / 知新学校",
        schoolMiddle: "香港中文大学(深圳)附属道远学校 / 知新学校(公办率中上偏优)",
        twoKidsNote: "自带18班幼儿园，马路对面即是港中大附属道远学校，340万起买国企全新精装99㎡三房两卫，即买即办证落户！",
        scores: { quiet: 95, edu: 89, space: 92, comm: 93 }
      },
      {
        id: "sy-trf-88",
        zone: "龙岗大运",
        project: "泰瑞府",
        phase: "一期（深业国企精装）",
        building: "6栋 (内园安静侧) / 1栋 (辅路)",
        unitCode: "88~90㎡精装三房一卫",
        layoutType: "3室1卫",
        area: "89㎡",
        usableRate: "约87%",
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街/辅路 · 园林南向",
        noiseDb: "约 43~48 dB（安静）",
        roadDetail: "6栋看内园完全不临街；1栋靠社区支路（辅路），均避开主干道噪音",
        minPrice: 299,
        maxPrice: 335,
        priceRange: "299~335 万",
        delivery: "国企准现房/现房（2026.05交付）",
        schoolPrimary: "香港中文大学(深圳)附属道远学校 / 知新学校",
        schoolMiddle: "香港中文大学(深圳)附属道远学校 / 知新学校",
        twoKidsNote: "300万出头即可买大运全新精装现房三房，自带18班幼儿园+对面港中大道远学校，总价极度友好。",
        scores: { quiet: 91, edu: 89, space: 80, comm: 92 }
      },
      {
        id: "sy-trf-5",
        zone: "龙岗大运",
        project: "泰瑞府",
        phase: "一期",
        building: "5栋 (外围临干道侧)",
        unitCode: "99㎡临路单元",
        layoutType: "3室2卫",
        area: "99㎡",
        usableRate: "约87%",
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 龙飞大道/如意路侧",
        noiseDb: "约 62~67 dB（干道车流声）",
        roadDetail: "靠近外围主干道方向，车速较快，不建议作为二胎静音首选",
        minPrice: 320,
        maxPrice: 345,
        priceRange: "320~345 万",
        delivery: "国企准现房/现房",
        schoolPrimary: "香港中文大学(深圳)附属道远学校 / 知新学校",
        schoolMiddle: "香港中文大学(深圳)附属道远学校 / 知新学校",
        twoKidsNote: "建议优先选2栋/3栋/6栋内园房源，避开外侧临干道户型。",
        scores: { quiet: 40, edu: 89, space: 89, comm: 86 }
      }
    ];

    // 默认跨片区 PK 对比池（涵盖大运名校盘、大运新盘、布吉水径名校盘）
    let compareIds = ["galaxy-6-89", "yian-3-89", "kk-3-97", "sy-trf-99", "vanke-3-89"];

    // =========================================================================
    // 2. 权重计算与综合评分函数
    // =========================================================================
    function getWeights() {
      const q = parseInt(byId("wQuiet").value, 10);
      const e = parseInt(byId("wEdu").value, 10);
      const s = parseInt(byId("wSpace").value, 10);
      const c = parseInt(byId("wComm").value, 10);
      const total = q + e + s + c || 100;
      return {
        quiet: q / total,
        edu: e / total,
        space: s / total,
        comm: c / total,
        raw: { q, e, s, c }
      };
    }

    function calcWeightedScore(unit, weights) {
      const rawScore =
        unit.scores.quiet * weights.quiet +
        unit.scores.edu * weights.edu +
        unit.scores.space * weights.space +
        unit.scores.comm * weights.comm;
      return Math.round(rawScore * 10) / 10;
    }

    // 检查房源是否符合当前总价筛选（区间下拉框 + 最高预算滑块双重校验）
    function matchPriceFilter(unit) {
      const bracket = byId("filterPriceBracket").value;
      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);

      // 只要该户型的最低入手门槛 <= 用户设定的预算上限滑块，即视为预算可达
      if (unit.minPrice > maxSlider) return false;

      if (bracket === "ALL") return true;
      const [bMin, bMax] = bracket.split("-").map(Number);
      // 区间交集判定：户型价格带 [minPrice, maxPrice] 与 所选区间 [bMin, bMax] 存在交集
      return unit.maxPrice >= bMin && unit.minPrice <= bMax;
    }

    // =========================================================================
    // 3. 渲染顶部 TOP 4 严选推荐（联动权重与当前总价预算）
    // =========================================================================
    function renderTopRecommendations() {
      const weights = getWeights();
      byId("wQuietVal").textContent = `${weights.raw.q}%`;
      byId("wEduVal").textContent = `${weights.raw.e}%`;
      byId("wSpaceVal").textContent = `${weights.raw.s}%`;
      byId("wCommVal").textContent = `${weights.raw.c}%`;

      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      const bracket = byId("filterPriceBracket").value;
      const hintEl = byId("topBudgetHint");
      if (maxSlider < 720 || bracket !== "ALL") {
        hintEl.textContent = `已按当前总价筛选（上限 ≤${maxSlider}万）过滤`;
      } else {
        hintEl.textContent = "全预算段实时演算";
      }

      const eligible = UNITS_DATA
        .filter(u => u.noiseLevel !== "MAIN_ROAD" && matchPriceFilter(u))
        .map(u => ({ ...u, totalScore: calcWeightedScore(u, weights) }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 4);

      const medals = ["🥇 严选TOP 1", "🥈 严选TOP 2", "🥉 严选TOP 3", "🏅 严选TOP 4"];
      const container = byId("topRecommendations");

      if (eligible.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-6 text-xs text-slate-400">当前总价区间内暂无非主干道房源，请适当上调预算滑块或切换总价段。</div>`;
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
            <div class="text-[11px] text-indigo-900 font-medium">${u.building}</div>
            <div class="text-[11px] text-slate-600 mt-0.5">${u.area} ${u.layoutType} ｜ ☀️${u.orientation}</div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-0.5">
            <div class="font-bold text-rose-600">💰 总价：${u.priceRange}</div>
            <div class="truncate">🔇 ${u.noiseLabel}</div>
            <div class="truncate">🎓 ${u.schoolMiddle.split("（")[0].split("(")[0]}</div>
          </div>
        </div>
      `).join("");
    }

    // =========================================================================
    // 4. 楼栋下拉框联动与房源筛选渲染
    // =========================================================================
    function matchProjectZone(unit, projFilter) {
      if (projFilter === "ALL") return true;
      if (projFilter === "ZONE_DAYUN") return unit.zone === "龙岗大运";
      if (projFilter === "ZONE_BUJI") return unit.zone === "布吉/南湾";
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
        return true;
      }).map(u => ({ ...u, totalScore: calcWeightedScore(u, weights) }))
        .sort((a, b) => b.totalScore - a.totalScore);

      byId("matchCountBadge").textContent = `匹配 ${filtered.length} 个楼栋户型`;

      const container = byId("unitCardsContainer");
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-300">
            当前筛选条件下暂无匹配户型，建议放宽“房屋总价区间”、“楼栋”或“朝向/临街”选项。
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(u => {
        const isCompared = compareIds.includes(u.id);
        let noiseBadgeClass = "badge-green";
        if (u.noiseLevel === "SUB_ROAD") noiseBadgeClass = "badge-amber";
        if (u.noiseLevel === "MAIN_ROAD") noiseBadgeClass = "badge-red";

        return `
          <div class="rounded-xl border ${u.noiseLevel === 'MAIN_ROAD' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 bg-white'} p-4 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <!-- 头部标签 -->
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded ${u.zone === '龙岗大运' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-white'}">${u.zone}</span>
                  <span class="font-bold text-xs text-slate-900">${u.project}</span>
                </div>
                <span class="text-xs font-bold text-indigo-600">得分：${u.totalScore}</span>
              </div>

              <!-- 楼栋与户型标题 -->
              <h3 class="text-sm font-bold text-slate-900">${u.building} · ${u.unitCode}</h3>

              <!-- 核心属性标签（含总价高亮） -->
              <div class="flex flex-wrap gap-1.5 mt-2.5 text-[11px]">
                <span class="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  💰 ${u.priceRange}
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
                <div><strong class="text-slate-800">道路与分贝：</strong>${u.roadDetail}（${u.noiseDb}）</div>
                <div><strong class="text-slate-800">得房率/阶段：</strong>${u.usableRate} ｜ ${u.phase}</div>
                <div><strong class="text-slate-800">对口小学：</strong>${u.schoolPrimary}</div>
                <div><strong class="text-slate-800">对口初中：</strong>${u.schoolMiddle}</div>
                <div class="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-700 leading-relaxed">
                  👶 <strong>二胎适配点评：</strong>${u.twoKidsNote}
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
        { label: "参考房屋总价", render: u => `<span class="font-bold text-rose-600 text-sm">${u.priceRange}</span>` },
        { label: "户型与面积", render: u => `<strong>${u.area} · ${u.layoutType}</strong>（${u.usableRate}）` },
        { label: "阳台朝向", render: u => `<span class="font-semibold text-amber-700">☀️ ${u.orientation}</span>` },
        { label: "临街属性与分贝", render: u => `<div><span class="font-semibold">${u.noiseLabel}</span></div><div class="text-slate-500 mt-0.5">${u.noiseDb}</div>` },
        { label: "对口小学", render: u => u.schoolPrimary },
        { label: "对口初中与升学率", render: u => u.schoolMiddle },
        { label: "交付状态与2029入学衔接", render: u => u.delivery },
        { label: "二胎家庭优劣势总结", render: u => u.twoKidsNote }
      ];

      table.innerHTML = `
        <thead>
          <tr class="bg-slate-100 border-b border-slate-200">
            <th class="py-3 px-3 w-36 font-semibold text-slate-700">对比维度</th>
            ${selectedUnits.map(u => `
              <th class="py-3 px-3 min-w-[200px]">
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
    // 6. 初始化 11 盘所属学区升学率对比图表 (Chart.js)
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
            "深中龙岗(星河时代)",
            "南师大龙岗(麓城/尚峰)",
            "华附大运(颐安/阅云境)",
            "港中大知新/道远(佳兆业/京基/康城/泰瑞府)",
            "大运核心圈均值(大运玖章待划片)",
            "石芽岭学校(特发臻华府)"
          ],
          datasets: [
            {
              label: "近三年中考公办普高录取率均值 (%)",
              data: [80.2, 79.1, 76.0, 74.2, 73.5, 59.5],
              backgroundColor: [
                "#C15F3C", "#D97757", "#527766", "#799886", "#9B8C78", "#B18A44"
              ],
              borderRadius: 6
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: ctx => ` 公办普高率约 ${ctx.raw}%（深圳全市基准约 53%）`
              }
            }
          },
          scales: {
            x: {
              min: 40,
              max: 90,
              ticks: { callback: val => val + "%" },
              title: { display: true, text: "中考公办普高率 (%)", font: { size: 11 } }
            },
            y: {
              ticks: {
                font: { size: 12 },
                callback: function(value) {
                  const label = this.getLabelForValue(value);
                  return label.match(/.{1,12}/gu) || label;
                }
              }
            }
          }
        }
      });
    }

    // =========================================================================
    // 7. 事件监听绑定与初始化
    // =========================================================================
    function bindEvents() {
      ["wQuiet", "wEdu", "wSpace", "wComm"].forEach(id => {
        byId(id).addEventListener("input", () => {
          renderTopRecommendations();
          renderUnitCards();
          renderCompareTable();
        });
      });

      byId("resetWeightsBtn").addEventListener("click", () => {
        byId("wQuiet").value = 35;
        byId("wEdu").value = 30;
        byId("wSpace").value = 20;
        byId("wComm").value = 15;
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

      // 总价区间与预算滑块联动
      byId("filterPriceBracket").addEventListener("change", () => {
        renderTopRecommendations();
        renderUnitCards();
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
        byId("filterMaxPriceSlider").value = 720;
        renderTopRecommendations();
        renderUnitCards();
      });

      byId("clearCompareBtn").addEventListener("click", () => {
        compareIds = ["galaxy-6-89", "yian-3-89", "kk-3-97", "sy-trf-99", "vanke-3-89"];
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
