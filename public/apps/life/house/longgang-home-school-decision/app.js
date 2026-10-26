/* 附件原始宏观数据、户号数据和计算规则；仅隔离 DOM 与按钮事件。 */
(() => {
  const root = document.getElementById('lg-house-app');
  if (!root) return;
  const byId = id => root.querySelector('#' + id);
  const leadingMetric = value => value.match(/^(?:[^\d]*\s*)?\d+(?::\d+(?:\.\d+)?|梯\d+户)/u)?.[0] || value.split(" ")[0];
  const distanceMetric = value => value.match(/\d+(?:[~～-]\d+)?米/u)?.[0] || value;

    // =========================================================================
    // 1. 宏观数据库：15个小区整体工程级指标 (COMMUNITIES_MACRO)
    // =========================================================================
    const COMMUNITIES_MACRO = {
      "佳兆业中央广场": {
        zone: "坂田片区",
        phaseSummary: "共3期住宅 (主力三期8栋围合)",
        buildYear: "2014-2016年",
        regGen: "GEN1",
        regLabel: "第1代·传统限拓规 (2014-2022)",
        usableAvg: "81%~83%",
        plotRatio: "4.8",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 2梯5户 (舒适)",
        buildingSpacing: "约 55~90米 (中央泳池开阔)",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (车位基本充裕，充电桩完善)",
        purity: "PURE",
        purityLabel: "纯商品房大城 (居住圈层纯粹，华为员工多)",
        propertyInfo: "佳兆业物业 · 3.8元/㎡",
        metroStation: "10号线岗头站/华为站",
        metroDist: "约 250~450米 (步行4~6分钟)",
        commuteMins: 10,
        commuteRoute: "10号线岗头/华为站 → 1~2站0换乘直达贝尔路站",
        schoolPrimary: "深圳大学附属坂田学校(小学部)",
        schoolMiddle: "深大附属坂田学校 (中考公办率~66%)"
      },
      "信义嘉御山": {
        zone: "坂田片区",
        phaseSummary: "共7期百万方大盘 (主力五期/七期)",
        buildYear: "2013-2018年",
        regGen: "GEN0",
        regLabel: "第0/1代·高拓展设计",
        usableAvg: "82%~85%",
        plotRatio: "4.1",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户 (舒适)",
        buildingSpacing: "约 65~110米 (超大皇家园林)",
        parkingRatio: 1.02,
        parkingLabel: "1:1.02 (夜间9点前充裕，五期车位更宽裕)",
        purity: "PURE",
        purityLabel: "纯商品房社区 (人车分流，园林极佳)",
        propertyInfo: "信义物业 · 3.6元/㎡",
        metroStation: "10号线坂田北站 / 5号线五和站",
        metroDist: "约 380~600米 (步行5~8分钟)",
        commuteMins: 14,
        commuteRoute: "10号线坂田北站 → 2站0换乘直达贝尔路站",
        schoolPrimary: "科技城外国语学校(小学部，社区旁)",
        schoolMiddle: "科技城外国语学校 (中考公办率~74%，坂田王牌)"
      },
      "诺德中央道": {
        zone: "坂田片区",
        phaseSummary: "共2期 (一期4栋 / 二期6栋)",
        buildYear: "2015-2017年",
        regGen: "GEN1",
        regLabel: "第1代·传统高拓规",
        usableAvg: "82%~84%",
        plotRatio: "4.5",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 45~70米",
        parkingRatio: 0.96,
        parkingLabel: "1:0.96 (略紧平衡，晚归偶需找位)",
        purity: "MIX",
        purityLabel: "含少量配建房源 (但学区生源极度鸡娃)",
        propertyInfo: "诺德物业 · 3.8元/㎡",
        metroStation: "10号线光雅园站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 17,
        commuteRoute: "10号线光雅园站 → 3站0换乘直达贝尔路站",
        schoolPrimary: "深圳实验学校坂田校区(小学部)",
        schoolMiddle: "深圳实验学校坂田校区 (公办率~77%，四大名校直管)"
      },
      "大族云峰": {
        zone: "坂田片区",
        phaseSummary: "共2期围合 (一期8栋 / 二期5栋)",
        buildYear: "2019-2021年",
        regGen: "GEN1",
        regLabel: "第1代·次新严规",
        usableAvg: "81%~82%",
        plotRatio: "4.6",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 60~95米 (围合式大园林)",
        parkingRatio: 1.08,
        parkingLabel: "1:1.08 (次新地下车库宽敞，充电桩多)",
        purity: "PURE",
        purityLabel: "纯正次新商品房为主 (自带4.5万㎡商业)",
        propertyInfo: "大族物业 · 3.9元/㎡",
        metroStation: "10号线光雅园站 / 坂田北站",
        metroDist: "约 550~700米 (步行8分钟)",
        commuteMins: 16,
        commuteRoute: "10号线光雅园/坂田北站 → 2~3站0换乘直达贝尔路",
        schoolPrimary: "深圳大学附属坂田学校(家门口)",
        schoolMiddle: "深圳大学附属坂田学校 (公办率~66%)"
      },
      "万科麓城三期": {
        zone: "布吉/南湾",
        phaseSummary: "共4期大城 (三期共6栋7单元)",
        buildYear: "2016-2017年",
        regGen: "GEN1",
        regLabel: "第1代·万科精装实用规",
        usableAvg: "81%~82%",
        plotRatio: "4.2",
        totalFloors: "32~34层",
        elevatorRatio: "2梯4户 / 2梯5户 (候梯快)",
        buildingSpacing: "约 50~85米 (架空层+山体公园)",
        parkingRatio: 0.86,
        parkingLabel: "⚠️ 1:0.86 (车位偏紧，晚归需停靠边或固定月卡)",
        purity: "PURE",
        purityLabel: "纯商品房标杆社区 (万科物业口碑极高)",
        propertyInfo: "万科物业 · 3.98元/㎡",
        metroStation: "5号线上水径站",
        metroDist: "约 350~500米 (步行5~7分钟)",
        commuteMins: 23,
        commuteRoute: "5号线上水径 → 1站至五和转10号线 → 2站至贝尔路",
        schoolPrimary: "万科麓城外国语小学(步行350米)",
        schoolMiddle: "南京师范大学附属龙岗学校 (公办率80.8%，第一梯队)"
      },
      "鸿荣源尚峰": {
        zone: "布吉/南湾",
        phaseSummary: "共1期8栋大型围合",
        buildYear: "2016年",
        regGen: "GEN1",
        regLabel: "第1代·鸿荣源高赠送规",
        usableAvg: "83%~84%",
        plotRatio: "4.3",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户 (舒适)",
        buildingSpacing: "约 65~100米 (背山面泳池)",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (车位比麓城充裕，地下两层车库)",
        purity: "PURE",
        purityLabel: "100%纯商品房围合社区 (豪宅级园林)",
        propertyInfo: "鸿荣源物业 · 3.9元/㎡",
        metroStation: "5号线上水径站 / 下水径站",
        metroDist: "约 450~600米 (步行6~8分钟)",
        commuteMins: 24,
        commuteRoute: "5号线上水径 → 五和转10号线 → 贝尔路站",
        schoolPrimary: "水径小学 / 麓城外国语 / 水径九年一贯制(共享)",
        schoolMiddle: "南京师范大学附属龙岗学校 (公办率80.8%)"
      },
      "特发臻华府": {
        zone: "布吉/南湾",
        phaseSummary: "共1期10栋 (含商品房6栋+回迁/保障房)",
        buildYear: "2028.06交付(期房)",
        regGen: "GEN3",
        regLabel: "🔥 第3代·2024二批新规 (去公摊神盘)",
        usableAvg: "96%~98%",
        plotRatio: "7.1",
        totalFloors: "45~47层 (超高层)",
        elevatorRatio: "⚠️ 3梯5户 / 3梯6户 (密度偏高)",
        buildingSpacing: "中央园林45~60米 (局部楼栋仅16~18米)",
        parkingRatio: 0.73,
        parkingLabel: "🚨 1:0.73 (2623户/1919车位，车位明显不足)",
        purity: "MIX",
        purityLabel: "含回迁房与保障房 (仅3栋等为纯商品房楼王)",
        propertyInfo: "特发服务 · 约4.2元/㎡",
        metroStation: "14号线快线石芽岭站G口",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 33,
        commuteRoute: "14号线石芽岭→布吉转5→五和转10→贝尔路",
        schoolPrimary: "石芽岭学校 + 旁侧规划54班深大附中南湾学校",
        schoolMiddle: "石芽岭学校 (公办率~61.5%) + 旁侧54班新校"
      },
      "佳兆业未来花园": {
        zone: "龙岗大运",
        phaseSummary: "一期6栋围合",
        buildYear: "2019-2020年",
        regGen: "GEN1",
        regLabel: "第1代·次新规",
        usableAvg: "81%~82%",
        plotRatio: "4.6",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 50~75米",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (车位达标，人车分流)",
        purity: "PURE",
        purityLabel: "纯商品房次新社区",
        propertyInfo: "佳兆业物业 · 3.9元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 500米 (步行6~7分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolPrimary: "香港中文大学(深圳)附属知新学校(小学部)",
        schoolMiddle: "港中大(深圳)附属知新学校 (公办率~75%)"
      },
      "京基御景中央": {
        zone: "龙岗大运",
        phaseSummary: "共2期 (一期6栋9座 / 二期6栋)",
        buildYear: "2018-2020年",
        regGen: "GEN1",
        regLabel: "第1代·低密舒适规",
        usableAvg: "80%~81%",
        plotRatio: "3.2 (全表最低密!)",
        totalFloors: "29~30层 (层数少)",
        elevatorRatio: "🌟 2梯4户 (候梯极快)",
        buildingSpacing: "约 60~100米 (低密阔绰水景)",
        parkingRatio: 1.11,
        parkingLabel: "🌟 1:1.11 (一期1028户配1140车位，极充裕)",
        purity: "PURE",
        purityLabel: "100%纯商品房低密豪宅感社区",
        propertyInfo: "京基物业 · 3.95元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 600~750米 (步行8~9分钟)",
        commuteMins: 53,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolPrimary: "港中大(深圳)附属知新学校 / 道远学校",
        schoolMiddle: "港中大(深圳)附属知新/道远学校 (公办率~75%)"
      },
      "颐安·都会中央": {
        zone: "龙岗大运",
        phaseSummary: "共7期百万方综合体 (主力二/三/四期)",
        buildYear: "2016-2021年",
        regGen: "GEN1",
        regLabel: "第1代·经典豪宅规",
        usableAvg: "81%~83%",
        plotRatio: "4.2",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 3梯5户",
        buildingSpacing: "约 55~90米",
        parkingRatio: 1.15,
        parkingLabel: "🌟 1:1.15 (车位充裕，带新能源快充)",
        purity: "PURE",
        purityLabel: "100%纯商品房改善大盘",
        propertyInfo: "颐安物业 · 3.9元/㎡",
        metroStation: "大运枢纽站 (3/14/16号线)",
        metroDist: "约 400~650米 (步行6~8分钟)",
        commuteMins: 44,
        commuteRoute: "大运枢纽(14号快线2站到布吉)→转5→五和转10",
        schoolPrimary: "华南师范大学附属龙岗大运学校(下楼即达)",
        schoolMiddle: "华南师范大学附属龙岗大运学校 (公办率77.5%)"
      },
      "星河时代花园": {
        zone: "龙岗大运",
        phaseSummary: "高层区8栋 + 联排别墅区",
        buildYear: "2012-2013年",
        regGen: "GEN0",
        regLabel: "🌟 第0代·2014前高偷面积规",
        usableAvg: "85%~88%",
        plotRatio: "2.6 (含别墅极低密)",
        totalFloors: "31~32层",
        elevatorRatio: "2梯4户 (极为舒适)",
        buildingSpacing: "约 70~150米 (南向俯瞰别墅无遮挡)",
        parkingRatio: 1.25,
        parkingLabel: "🌟 1:1.25 (豪宅车位配比，停车极其从容)",
        purity: "PURE",
        purityLabel: "100%纯商品房+别墅社区 (下楼即山姆+COCO Park)",
        propertyInfo: "星河智善生活 · 3.5元/㎡",
        metroStation: "大运枢纽站 / 3号线爱联站",
        metroDist: "约 550~700米 (步行7~9分钟)",
        commuteMins: 45,
        commuteRoute: "大运站(14号快线)→布吉转5→五和转10→贝尔路",
        schoolPrimary: "深中龙岗小学 / 龙外(集团)星河学校",
        schoolMiddle: "深圳中学龙岗学校 (公办率81.5%，全区顶尖)"
      },
      "中海康城花园": {
        zone: "龙岗大运",
        phaseSummary: "共2期25栋超大型社区",
        buildYear: "2010-2011年",
        regGen: "GEN0",
        regLabel: "第0代·成熟实用规",
        usableAvg: "81%~83%",
        plotRatio: "3.6",
        totalFloors: "28~32层",
        elevatorRatio: "2梯4户 / 2梯6户",
        buildingSpacing: "约 55~85米 (大花园绿树成荫)",
        parkingRatio: 0.90,
        parkingLabel: "⚠️ 1:0.90 (老社区车位略紧，需早办月卡)",
        purity: "PURE",
        purityLabel: "纯商品房成熟大社区 (生活配套极熟)",
        propertyInfo: "中海物业 · 2.95元/㎡",
        metroStation: "16号线龙城公园站 / 黄阁坑站",
        metroDist: "约 500~700米 (步行7~9分钟)",
        commuteMins: 56,
        commuteRoute: "16号线→大运转14→布吉转5→五和转10",
        schoolPrimary: "香港中文大学(深圳)附属知新学校(小学部)",
        schoolMiddle: "港中大(深圳)附属知新学校 (公办率~75%)"
      },
      "中海大运玖章": {
        zone: "龙岗大运",
        phaseSummary: "共1期5栋614户高奢大盘",
        buildYear: "2027.12交付(期房)",
        regGen: "GEN3",
        regLabel: "🔥 第3代·2024二批新规",
        usableAvg: "92%~95%",
        plotRatio: "5.35",
        totalFloors: "31~48层",
        elevatorRatio: "🌟 2梯4户(3B栋) / 3梯4户(3A/4栋)",
        buildingSpacing: "约 60~90米 (度假酒店式园林)",
        parkingRatio: 1.73,
        parkingLabel: "🏆 1:1.73 (614户配1064车位+314充电桩，全表第一!)",
        purity: "PURE",
        purityLabel: "🏆 100%纯商品房大户型改善(起步126㎡，无保障房)",
        propertyInfo: "中海高定物业 · 5.98元/㎡",
        metroStation: "16号线大运中心站 / 文曲站",
        metroDist: "约 350~500米 (步行5~6分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolPrimary: "待2028交房后划片(紧邻龙外本部/知新)",
        schoolMiddle: "待交房后划片 (大运核心名校圈，暂未锁定)"
      },
      "深铁阅云境广场": {
        zone: "龙岗大运",
        phaseSummary: "一期4栋 (3栋商品房+1栋人才房)",
        buildYear: "2026.12交付(准现房)",
        regGen: "GEN2",
        regLabel: "✨ 第2代·2023首批新规",
        usableAvg: "88%~90%",
        plotRatio: "6.1",
        totalFloors: "32层 / 45~46层",
        elevatorRatio: "2梯5户(3单元) / 3梯5户(2单元) / 3梯6户(1/4单元)",
        buildingSpacing: "约 45~65米 (抬高式空中花园)",
        parkingRatio: 1.15,
        parkingLabel: "🌟 1:1.15 (961个车位，国企TOD高配车库)",
        purity: "MIX",
        purityLabel: "含1栋独立人才房 (商品房单元独立管理)",
        propertyInfo: "深铁物业 · 约4.5元/㎡",
        metroStation: "大运综合交通枢纽 (3/14/16/深大城际)",
        metroDist: "🏆 约 100~200米 (下楼直通枢纽，步行2分钟!)",
        commuteMins: 42,
        commuteRoute: "下楼直通14号快线(2站到布吉)→转5→五和转10",
        schoolPrimary: "华附大运学校 / 楼下规划72班九年一贯制新校",
        schoolMiddle: "华附大运学校 / 规划72班新校 (公办率~77.5%)"
      },
      "泰瑞府": {
        zone: "龙岗大运",
        phaseSummary: "一期6栋 (商品房884套/总1437户)",
        buildYear: "2026.05交付(国企现房)",
        regGen: "GEN2",
        regLabel: "✨ 第2代·2023首批新规",
        usableAvg: "87%~88%",
        plotRatio: "5.29",
        totalFloors: "26~47层",
        elevatorRatio: "3梯6户",
        buildingSpacing: "约 45~70米 (中央围合园林)",
        parkingRatio: 1.10,
        parkingLabel: "🌟 1:1.10 (1437户配1590车位，车位充裕)",
        purity: "MIX",
        purityLabel: "含配建保障房楼栋 (2/3/6栋为纯商品房主力)",
        propertyInfo: "深业物业 · 约4.3元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolPrimary: "港中大(深圳)附属道远学校(一路之隔) / 知新学校",
        schoolMiddle: "港中大(深圳)附属道远/知新学校 (公办率~75%)"
      }
    };

    // =========================================================================
    // 2. 微观数据库：具体楼栋、单元、户号、厅型格局、距主干道米数、噪音源、得房率 (UNITS_DATA)
    // =========================================================================
    const UNITS_DATA = [
      // ==================== A. 坂田片区 (4盘) ====================
      {
        id: "bt-kaisa-3-89",
        project: "佳兆业中央广场",
        phase: "三期",
        building: "三期 2栋 / 3栋",
        unitCode: "02/03户 (中央泳池楼王)",
        layoutType: "3室2厅2卫",
        structureType: "南北通透·板式",
        area: 89,
        usableRateNum: 83,
        usableArea: 73.9,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距主干道180米+",
        roadDistMeters: "距坂澜大道约185米、距雪岗北路约160米",
        specialNoise: "无铁路/无高架/无地铁地上轨，仅日间泳池轻微水声（约41~44dB）",
        minPrice: 455,
        maxPrice: 498,
        priceRange: "455~498 万",
        twoKidsNote: "三期正中央楼王户号！南北对流穿堂风，太太10号线1~2站（或骑车8分钟）直达贝尔路站，中午可回家陪伴8个月二宝。",
        scores: { quiet: 95, edu: 85, commute: 99, space: 88, comm: 93 }
      },
      {
        id: "bt-kaisa-1-88",
        project: "佳兆业中央广场",
        phase: "一期 / 二期",
        building: "一期 3栋 / 二期 2栋",
        unitCode: "01/05户 (内街花园侧)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 88,
        usableRateNum: 81,
        usableArea: 71.3,
        orientation: "东南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 距宝吉支路35米",
        roadDistMeters: "距坂澜大道主干道150米，距宝吉路社区支路约35米",
        specialNoise: "无高铁/高架，上下学时段学校周边支路有轻微接送车流声（约49~53dB）",
        minPrice: 415,
        maxPrice: 448,
        priceRange: "415~448 万",
        twoKidsNote: "比三期楼王省40万，经典动静分区竖厅，紧邻深大附坂田学校与10号线地铁口。",
        scores: { quiet: 80, edu: 85, commute: 98, space: 78, comm: 90 }
      },
      {
        id: "bt-kaisa-main",
        project: "佳兆业中央广场",
        phase: "三期外围",
        building: "三期 1栋 / 6栋 / 7栋",
        unitCode: "01/04户 (外围临干道)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 81,
        usableArea: 72.1,
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 距坂澜大道仅25米",
        roadDistMeters: "距坂澜大道/雪岗北路主干道仅22~30米",
        specialNoise: "⚠️ 主干道早晚高峰及夜间货车胎噪明显（开窗65~70dB），触碰静音红线",
        minPrice: 398,
        maxPrice: 430,
        priceRange: "398~430 万",
        twoKidsNote: "虽总价便宜但紧贴坂澜大道主干道，噪音影响婴儿睡眠，直接排除。",
        scores: { quiet: 35, edu: 85, commute: 98, space: 85, comm: 86 }
      },
      {
        id: "bt-xinyi-5-89",
        project: "信义嘉御山",
        phase: "五期 / 七期",
        building: "五期 12栋·13栋 / 七期 2栋",
        unitCode: "02/03户 (百米楼距园景王)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 84,
        usableArea: 74.8,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距五和大道210米+",
        roadDistMeters: "距五和大道主干道约210米、距吉华路约190米",
        specialNoise: "无高铁/高架/地铁噪音，深居百万方大盘中心园林（约41~44dB）",
        minPrice: 495,
        maxPrice: 548,
        priceRange: "495~548 万",
        twoKidsNote: "坂田改善王牌！自带科技城外国语学校（九年一贯目送式）+ 10号线坂田北站2站直达贝尔路站。",
        scores: { quiet: 95, edu: 92, commute: 96, space: 89, comm: 95 }
      },
      {
        id: "bt-xinyi-2-86",
        project: "信义嘉御山",
        phase: "二期 / 三期",
        building: "二期 5栋·6栋 / 三期 8栋",
        unitCode: "01/05户 (内园东南向)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 86,
        usableRateNum: 83,
        usableArea: 71.4,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距主干道140米+",
        roadDistMeters: "距吉华路约145米，由外圈1~3栋完整遮挡道路噪音",
        specialNoise: "无特殊噪音源，内园安静（约43~46dB）",
        minPrice: 435,
        maxPrice: 472,
        priceRange: "435~472 万",
        twoKidsNote: "450万级入主信义嘉御山内园+科外名校+14分钟贝尔路通勤。",
        scores: { quiet: 91, edu: 92, commute: 95, space: 78, comm: 92 }
      },
      {
        id: "bt-nuode-2-89",
        project: "诺德中央道",
        phase: "二期",
        building: "二期 2栋 / 3栋",
        unitCode: "02/03户 (花园内侧高拓)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 84,
        usableArea: 74.8,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距五和大道130米",
        roadDistMeters: "距五和大道主干道约130米、距雅园路约115米",
        specialNoise: "无铁路/高架，外围楼栋阻隔五和大道车流（约43~47dB）",
        minPrice: 475,
        maxPrice: 525,
        priceRange: "475~525 万",
        twoKidsNote: "对口四大名校直管的【深圳实验学校坂田校区】九年一贯制！光雅园站10号线3站直达贝尔路站。",
        scores: { quiet: 91, edu: 96, commute: 94, space: 86, comm: 89 }
      },
      {
        id: "bt-dazu-1-96",
        project: "大族云峰",
        phase: "一期 / 二期",
        building: "一期 3栋·5栋 / 二期 2栋",
        unitCode: "01/02户 (中央园景阔绰三房)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 96,
        usableRateNum: 82,
        usableArea: 78.7,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距坂雪岗大道160米",
        roadDistMeters: "距坂雪岗大道约160米、距永香路约120米",
        specialNoise: "无铁路/高架，围合式中央园林极安静（约42~45dB）",
        minPrice: 465,
        maxPrice: 515,
        priceRange: "465~515 万",
        twoKidsNote: "96㎡比传统89㎡多出7㎡实得空间，2020年次新大园林+自带商业+家门口深大附坂田学校，太太通勤16分钟。",
        scores: { quiet: 94, edu: 85, commute: 95, space: 92, comm: 94 }
      },

      // ==================== B. 布吉水径 / 南湾片区 (3盘) ====================
      {
        id: "vanke-3-89",
        project: "万科麓城三期",
        phase: "三期",
        building: "3栋 / 4栋",
        unitCode: "01/02户 (中央园林楼王)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 82,
        usableArea: 73.0,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距布龙路190米+",
        roadDistMeters: "距布龙路主干道及高架约195米、距水径路约110米",
        specialNoise: "无铁路/无高架直射，前后双园林及5/6栋遮挡布龙路噪音（约41~45dB）",
        minPrice: 415,
        maxPrice: 445,
        priceRange: "415~445 万",
        twoKidsNote: "万科经典十字动静分区竖厅，三房两卫全明；步行350m即达麓城外国语小学+南师大附校(公办率80.8%)，去贝尔路仅23分钟！",
        scores: { quiet: 96, edu: 95, commute: 88, space: 86, comm: 91 }
      },
      {
        id: "vanke-1-88",
        project: "万科麓城三期",
        phase: "三期",
        building: "1栋A座 / 1栋B座",
        unitCode: "01/02户 (水径支路侧)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 88,
        usableRateNum: 81,
        usableArea: 71.3,
        orientation: "西南",
        noiseLevel: "SUB_ROAD",
        noiseLabel: "临辅路 · 距水径支路40米",
        roadDistMeters: "距布龙路主干道约170米，距水径社区支路约40米",
        specialNoise: "无铁路/高架，早晚接送时段支路有轻微车流声（关窗约38dB）",
        minPrice: 375,
        maxPrice: 398,
        priceRange: "375~398 万",
        twoKidsNote: "380万级上车麓城三期+南师大龙岗学校，唯独单卫需错峰、小区车位比(1:0.86)略紧。",
        scores: { quiet: 76, edu: 95, commute: 88, space: 74, comm: 88 }
      },
      {
        id: "vanke-6-88",
        project: "万科麓城三期",
        phase: "三期",
        building: "5栋 / 6栋",
        unitCode: "03/04户 (外侧近布龙路)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 88,
        usableRateNum: 81,
        usableArea: 71.3,
        orientation: "东南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 距布龙路仅35米",
        roadDistMeters: "距布龙路快速干道及高架引桥仅35~45米",
        specialNoise: "⚠️ 布龙路全天泥头车/货车及高架车流低频噪音重（65~72dB）",
        minPrice: 355,
        maxPrice: 375,
        priceRange: "355~375 万",
        twoKidsNote: "虽朝东南且便宜，但紧邻布龙路快速路噪音大，一票否决。",
        scores: { quiet: 32, edu: 95, commute: 88, space: 73, comm: 84 }
      },
      {
        id: "horoy-6-89",
        project: "鸿荣源尚峰",
        phase: "一期围合",
        building: "6栋A座 / 6栋B座 / 5栋",
        unitCode: "01/02户 (背山面泳池楼王)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 84,
        usableArea: 74.8,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距布龙路220米+",
        roadDistMeters: "距北侧布龙路主干道达220米、距东侧西环路约150米",
        specialNoise: "无任何铁路/高架/干道干扰，后靠山体前看泳池（40~44dB全片区最静）",
        minPrice: 395,
        maxPrice: 435,
        priceRange: "395~435 万",
        twoKidsNote: "车位比(1:1.05)与园林品质优于麓城，6A/6B/5栋深居南侧山脚腹地极度安静，去贝尔路仅24分钟！",
        scores: { quiet: 97, edu: 89, commute: 87, space: 89, comm: 95 }
      },
      {
        id: "horoy-7-88",
        project: "鸿荣源尚峰",
        phase: "一期围合",
        building: "7栋 (内园) / 3栋A座 (辅路)",
        unitCode: "03/05户 (山景/内园三房一卫)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 88,
        usableRateNum: 83,
        usableArea: 73.0,
        orientation: "西南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距布龙路180米",
        roadDistMeters: "7栋距布龙路180米靠南侧山体；3A栋距西环路支线约45米但看内园",
        specialNoise: "无铁路/高架，7栋伴山听鸟鸣极安静（约43~47dB）",
        minPrice: 360,
        maxPrice: 390,
        priceRange: "360~390 万",
        twoKidsNote: "360~385万买鸿荣源纯商品房园林+南师大附校共享学区+24分钟贝尔路通勤。",
        scores: { quiet: 91, edu: 89, commute: 87, space: 77, comm: 93 }
      },
      {
        id: "horoy-1-89",
        project: "鸿荣源尚峰",
        phase: "一期围合",
        building: "1栋 / 2栋 / 8栋",
        unitCode: "北侧临路户号",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 83,
        usableArea: 73.9,
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 距布龙路仅28米",
        roadDistMeters: "北侧距布龙路主干道及跨线高架仅25~35米",
        specialNoise: "⚠️ 布龙路高架桥及重型车流噪音直冲（66~73dB），严禁考虑",
        minPrice: 350,
        maxPrice: 375,
        priceRange: "350~375 万",
        twoKidsNote: "看尚峰务必避开北排1/2/8栋，只看南排5/6/7栋！",
        scores: { quiet: 28, edu: 89, commute: 87, space: 85, comm: 88 }
      },
      {
        id: "tefa-3-96",
        project: "特发臻华府",
        phase: "一期 (2024二批新规)",
        building: "3栋 (纯商品房中央楼王)",
        unitCode: "01/02户 (6米阔景大横厅)",
        layoutType: "3室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 96,
        usableRateNum: 98,
        usableArea: 94.1,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距盛宝路130米/距铁路180米",
        roadDistMeters: "位于小区正中央，距南侧盛宝路约130米、距北侧广深铁路约180米",
        specialNoise: "3栋由北侧4/5栋遮挡铁路声、南侧遮挡盛宝路声（约43~46dB）",
        minPrice: 395,
        maxPrice: 430,
        priceRange: "395~430 万",
        twoKidsNote: "微观户型满分（2024二批新规96㎡套内实得高达94㎡！6米大横厅堪比传统118㎡）；但宏观需接受容积率7.1、47层3梯5/6户及车位比1:0.73。",
        scores: { quiet: 93, edu: 82, commute: 75, space: 99, comm: 76 }
      },
      {
        id: "tefa-3-87",
        project: "特发臻华府",
        phase: "一期 (2024二批新规)",
        building: "3栋 (内圈) / 1栋·6栋 (辅路)",
        unitCode: "03/04户 (三开间朝南神户型)",
        layoutType: "3室2厅2卫",
        structureType: "三开间朝南",
        area: 87,
        usableRateNum: 96,
        usableArea: 83.5,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街/辅路 · 距主干道110米+",
        roadDistMeters: "3栋完全不临街；1栋/6栋距宝西路社区支路约35米（距盛宝路110米+）",
        specialNoise: "避开北侧铁路面，配新规双层中空LOW-E隔音玻璃（约44~49dB）",
        minPrice: 348,
        maxPrice: 380,
        priceRange: "348~380 万",
        twoKidsNote: "350万级买套内实得83.5㎡的三开间朝南三房两卫（比老盘89㎡实得还大10㎡！），下楼即18班幼+规划54班新校。",
        scores: { quiet: 89, edu: 82, commute: 75, space: 95, comm: 76 }
      },
      {
        id: "tefa-4-87",
        project: "特发臻华府",
        phase: "一期",
        building: "4栋 / 5栋 (外围北侧/临路)",
        unitCode: "外侧临路/近铁路单元",
        layoutType: "3室2厅2卫",
        structureType: "三开间朝南",
        area: 87,
        usableRateNum: 95,
        usableArea: 82.6,
        orientation: "东南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临铁路/干道 · 距广深铁路约65米",
        roadDistMeters: "北侧距广深铁路轨道约60~80米，或外侧近盛宝路",
        specialNoise: "⚠️ 存在广深线动车/火车通行轨道声及盛宝路车流声（62~68dB）",
        minPrice: 335,
        maxPrice: 352,
        priceRange: "335~352 万",
        twoKidsNote: "特发臻华府选房铁律：只选中央3栋或南侧1/6栋内园向，避开北侧近广深铁路楼栋！",
        scores: { quiet: 36, edu: 82, commute: 75, space: 93, comm: 72 }
      },

      // ==================== C. 龙岗大运片区 (8盘) ====================
      {
        id: "kaisa-3-89",
        project: "佳兆业未来花园",
        phase: "一期",
        building: "3栋 / 4栋 (中央园景)",
        unitCode: "01/02户 (东南看泳池园林)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 82,
        usableArea: 73.0,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距如意路140米",
        roadDistMeters: "距如意路主干道约140米、距龙飞大道约160米（2/5栋靠华美中路支路350万起）",
        specialNoise: "无铁路/无地铁高架，内园安静（约42~46dB）",
        minPrice: 350,
        maxPrice: 405,
        priceRange: "350~405 万",
        twoKidsNote: "2020年次新纯商品房，车位比1:1.05，对口港中大附属知新九年一贯制名校；短板是去贝尔路地铁需52分钟。",
        scores: { quiet: 93, edu: 91, commute: 48, space: 86, comm: 90 }
      },
      {
        id: "kk-3-97",
        project: "京基御景中央",
        phase: "一期 / 二期",
        building: "一期 3栋·4栋 / 二期 3栋",
        unitCode: "01/02户 (王牌双龙抱珠)",
        layoutType: "3室2厅2卫",
        structureType: "双龙抱珠·零走廊",
        area: 97,
        usableRateNum: 81,
        usableArea: 78.6,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距主干道160米+",
        roadDistMeters: "位于3.2低容积率大花园中央，距如意路/飞扬路均超150米",
        specialNoise: "无铁路/高架，百米楼间距中央水景园林（约41~44dB）",
        minPrice: 360,
        maxPrice: 406,
        priceRange: "360~406 万",
        twoKidsNote: "宏观+微观双重优等生！容积率仅3.2、总高30层2梯4户、车位比1:1.11；微观为97㎡正南【双龙抱珠】零过道浪费格局！",
        scores: { quiet: 95, edu: 91, commute: 47, space: 93, comm: 96 }
      },
      {
        id: "kk-2-86",
        project: "京基御景中央",
        phase: "一期 / 二期",
        building: "一期 2栋A·2B / 二期 2栋",
        unitCode: "03/04户 (东南向内园)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 86,
        usableRateNum: 80,
        usableArea: 68.8,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距道路110米",
        roadDistMeters: "朝向小区内部中央水景花园，距外围道路约110米",
        specialNoise: "无铁路/高架，安静宜居（约43~46dB）",
        minPrice: 305,
        maxPrice: 339,
        priceRange: "305~339 万",
        twoKidsNote: "305~339万享容积率3.2低密豪宅社区+2梯4户+充裕车位+港中大附属知新/道远学位。",
        scores: { quiet: 92, edu: 91, commute: 47, space: 79, comm: 95 }
      },
      {
        id: "yian-3-89",
        project: "颐安·都会中央",
        phase: "二期 / 三期",
        building: "二期 2栋·3栋 / 三期 3栋",
        unitCode: "01/02户 (三开间朝南园景)",
        layoutType: "3室2厅2卫",
        structureType: "三开间朝南",
        area: 89,
        usableRateNum: 82,
        usableArea: 73.0,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距龙岗大道200米+",
        roadDistMeters: "深居二/三期园林内侧，距龙岗大道及3号线高架超200米、距黄阁路140米",
        specialNoise: "彻底隔绝3号线地铁高架轨行噪音与大道车流（约42~45dB）",
        minPrice: 385,
        maxPrice: 430,
        priceRange: "385~430 万",
        twoKidsNote: "车位比1:1.15纯商品房大盘，家门口华附大运九年一贯制名校；步行至大运枢纽坐14号快线去贝尔路约44分钟。",
        scores: { quiet: 94, edu: 94, commute: 60, space: 88, comm: 95 }
      },
      {
        id: "yian-1-89",
        project: "颐安·都会中央",
        phase: "二期 / 三期外围",
        building: "二期 1栋 / 三期 1栋·4栋",
        unitCode: "外围临大道/高架侧单元",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 81,
        usableArea: 72.1,
        orientation: "西南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道/地铁高架 · 距大道35米",
        roadDistMeters: "距龙岗大道/黄阁路仅30~45米，近3号线高架段",
        specialNoise: "⚠️ 龙岗大道车流 + 地铁3号线地上高架列车运行噪音（65~71dB）",
        minPrice: 335,
        maxPrice: 365,
        priceRange: "335~365 万",
        twoKidsNote: "看颐安务必避开临龙岗大道3号线高架及黄阁路的外排楼栋！",
        scores: { quiet: 32, edu: 94, commute: 60, space: 84, comm: 88 }
      },
      {
        id: "galaxy-6-89",
        project: "星河时代花园",
        phase: "一期高层区",
        building: "5栋 / 6栋 / 7栋 (南向看别墅)",
        unitCode: "01/02户 (高偷面积南北通)",
        layoutType: "3室2厅2卫",
        structureType: "南北通透·板式",
        area: 89,
        usableRateNum: 87,
        usableArea: 77.4,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 俯瞰别墅距干道230米",
        roadDistMeters: "南向跨越整个低密联排别墅区，距龙岗大道及黄阁南路均超220米",
        specialNoise: "无任何干道/高架遮挡与噪音，视野与静音全区顶级（40~43dB）",
        minPrice: 430,
        maxPrice: 475,
        priceRange: "430~475 万",
        twoKidsNote: "第0代高偷面积神户型（89㎡实得77.4㎡且南北通透）+ 2梯4户 + 车位比1:1.25 + 深中龙岗顶级名校 + 楼下山姆会员店！",
        scores: { quiet: 96, edu: 98, commute: 58, space: 91, comm: 97 }
      },
      {
        id: "cohl-kc-89",
        project: "中海康城花园",
        phase: "一期 / 二期",
        building: "一期 3栋·4栋 / 二期 12栋·15栋",
        unitCode: "02/03户 (中央花园双龙抱珠)",
        layoutType: "3室2厅2卫",
        structureType: "双龙抱珠·零走廊",
        area: 88,
        usableRateNum: 82,
        usableArea: 72.2,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距盐龙大道200米+",
        roadDistMeters: "位于25栋大社区正中心，距北通道(盐龙大道)及黄阁路均超200米",
        specialNoise: "无高架/干道干扰，成熟大花园极安静（约42~45dB）",
        minPrice: 235,
        maxPrice: 268,
        priceRange: "235~268 万",
        twoKidsNote: "240~265万全深圳罕见的低总价【正南双龙抱珠三房两卫+港中大知新名校】！缺点是2010年楼龄、车位比0.9略紧、去坂田56分钟。",
        scores: { quiet: 92, edu: 91, commute: 42, space: 84, comm: 84 }
      },
      {
        id: "cohl-jz-126",
        project: "中海大运玖章",
        phase: "一期 (2024二批新规)",
        building: "3栋A座(3T4) / 3栋B座(2T4) / 4栋",
        unitCode: "01/02户 (新规奢阔大横厅)",
        layoutType: "3室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 126,
        usableRateNum: 94,
        usableArea: 118.4,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距黄阁路150米+",
        roadDistMeters: "位于社区中心，距黄阁路主干道约150米（4栋靠支路555万起）",
        specialNoise: "无铁路/高架，全屋配三玻两腔豪宅级隔音系统（40~43dB）",
        minPrice: 555,
        maxPrice: 708,
        priceRange: "555~708 万",
        twoKidsNote: "宏观工程指标天花板：车位比1:1.73(含314充电桩)、2梯4户/3梯4户、100%纯商品房、2024新规套内实得118㎡！唯总价高且学区待2028划片。",
        scores: { quiet: 97, edu: 78, commute: 48, space: 99, comm: 99 }
      },
      {
        id: "szt-yyj-98",
        project: "深铁阅云境广场",
        phase: "一期 (2023首批新规)",
        building: "1栋2单元(3T5) / 3单元(2T5) / 4单元",
        unitCode: "02/03户 (空中花园大横厅)",
        layoutType: "3室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 98,
        usableRateNum: 90,
        usableArea: 88.2,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距龙岗大道120米(内院向)",
        roadDistMeters: "2/3单元朝向抬高式空中花园内侧，距龙岗大道约120米（1单元临路避开）",
        specialNoise: "14/16号线均为地下隧道无噪音；外侧商业裙楼遮挡大道车流（约44~48dB）",
        minPrice: 336,
        maxPrice: 435,
        priceRange: "336~435 万",
        twoKidsNote: "下楼步行150米即入大运四轨枢纽！坐14号快线2站飙到布吉站，是大运片区去贝尔路最快的楼盘(42分钟)，车位比1:1.15。",
        scores: { quiet: 90, edu: 89, commute: 63, space: 93, comm: 93 }
      },
      {
        id: "sy-trf-99",
        project: "泰瑞府",
        phase: "一期 (2023首批新规)",
        building: "2栋 / 3栋 (纯商品房中央栋)",
        unitCode: "01/02户 (大横厅) / 6栋(89㎡竖厅一卫)",
        layoutType: "3室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 99,
        usableRateNum: 88,
        usableArea: 87.1,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距龙飞大道130米",
        roadDistMeters: "2/3栋位于园林中央，距龙飞大道及如意路约130米（5栋临路避开）",
        specialNoise: "无铁路/无高架，国企现房双层中空LOW-E隔音玻璃（约41~45dB）",
        minPrice: 337,
        maxPrice: 415,
        priceRange: "337~415 万 (6栋89㎡版299万起)",
        twoKidsNote: "2026国企现房即买即住！99㎡大横厅套内实得87㎡，车位比1:1.10，自带18班幼+马路对面港中大道远学校；唯一注意3梯6户。",
        scores: { quiet: 95, edu: 89, commute: 48, space: 92, comm: 91 }
      }
    ];

    // 默认PK对比池
    let compareIds = ["bt-xinyi-5-89", "vanke-3-89", "horoy-6-89", "tefa-3-96", "kk-3-97"];

    // =========================================================================
    // 3. 权重计算与评分逻辑
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
      const macro = COMMUNITIES_MACRO[unit.project];
      return macro.commuteMins <= parseInt(maxCommute, 10);
    }

    // =========================================================================
    // 4. 渲染视角一：15盘宏观整体工程指标横评表
    // =========================================================================
    function renderMacroTable() {
      const zoneF = byId("macroZoneFilter").value;
      const regF = byId("macroRegFilter").value;
      const parkF = byId("macroParkingFilter").value;
      const pureF = byId("macroPurityFilter").value;

      const entries = Object.entries(COMMUNITIES_MACRO).filter(([name, m]) => {
        if (zoneF !== "ALL" && m.zone !== zoneF) return false;
        if (regF !== "ALL" && m.regGen !== regF) return false;
        if (parkF !== "ALL" && m.parkingRatio < parseFloat(parkF)) return false;
        if (pureF === "PURE" && m.purity !== "PURE") return false;
        return true;
      });

      const tbody = byId("macroTableBody");
      if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" class="py-8 text-center text-slate-400">暂无符合该宏观条件的小区，请放宽上方筛选选项。</td></tr>`;
        return;
      }

      tbody.innerHTML = entries.map(([name, m]) => {
        let parkClass = "badge-green";
        if (m.parkingRatio < 1.0) parkClass = "badge-amber";
        if (m.parkingRatio < 0.8) parkClass = "badge-red";

        let regClass = "bg-slate-100 text-slate-700";
        if (m.regGen === "GEN3") regClass = "badge-purple font-bold";
        if (m.regGen === "GEN2") regClass = "badge-blue font-semibold";
        if (m.regGen === "GEN0") regClass = "badge-green font-semibold";

        return `
          <tr class="hover:bg-indigo-50/40 transition">
            <td class="py-2.5 px-2.5">
              <div class="font-bold text-slate-900">${name}</div>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${m.zone} · ${m.buildYear}</span>
            </td>
            <td class="py-2.5 px-2.5 text-slate-700">${m.phaseSummary}</td>
            <td class="py-2.5 px-2.5">
              <span class="px-2 py-0.5 rounded text-[11px] ${regClass}">${m.regLabel}</span>
              <div class="text-slate-500 mt-0.5">实得率约 <strong>${m.usableAvg}</strong></div>
            </td>
            <td class="py-2.5 px-2.5 font-bold ${parseFloat(m.plotRatio) <= 3.6 ? 'text-emerald-700' : parseFloat(m.plotRatio) >= 6.0 ? 'text-rose-600' : 'text-slate-800'}">
              ${m.plotRatio}
            </td>
            <td class="py-2.5 px-2.5">
              <div class="font-semibold text-slate-800">${m.totalFloors}</div>
              <div class="text-slate-500">${m.elevatorRatio}</div>
            </td>
            <td class="py-2.5 px-2.5 text-slate-700">${m.buildingSpacing}</td>
            <td class="py-2.5 px-2.5">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${parkClass}">${leadingMetric(m.parkingLabel)}</span>
              <div class="text-[11px] text-slate-500 mt-0.5">${m.parkingLabel.slice(leadingMetric(m.parkingLabel).length).trim()}</div>
            </td>
            <td class="py-2.5 px-2.5">
              <div class="font-medium ${m.purity === 'PURE' ? 'text-emerald-700' : 'text-amber-700'}">${m.purityLabel}</div>
              <div class="text-slate-400 text-[11px]">${m.propertyInfo}</div>
            </td>
            <td class="py-2.5 px-2.5">
              <div class="font-semibold text-slate-800">${m.metroStation}</div>
              <div class="text-slate-500">${m.metroDist}</div>
            </td>
            <td class="py-2.5 px-2.5">
              <span class="font-bold ${m.commuteMins <= 25 ? 'text-pink-700' : 'text-slate-700'}">约 ${m.commuteMins} 分钟</span>
            </td>
            <td class="py-2.5 px-2.5">
              <div class="font-medium text-slate-800">${m.schoolMiddle}</div>
            </td>
            <td class="py-2.5 px-2.5 text-center">
              <button type="button" data-drill-project="${name}" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold whitespace-nowrap">
                下钻看户号 ↓
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }

    // 点击宏观表某一行，自动下钻过滤下方具体户号
    function drillDownProject(projectName) {
      byId("filterProject").value = projectName;
      updateBuildingOptions();
      renderUnitCards();
      byId("section-micro").scrollIntoView({ behavior: "smooth" });
    };

    // =========================================================================
    // 5. 渲染顶部 TOP 4 严选推荐
    // =========================================================================
    function renderTopRecommendations() {
      const weights = getWeights();
      byId("wQuietVal").textContent = `${weights.raw.q}%`;
      byId("wEduVal").textContent = `${weights.raw.e}%`;
      byId("wCommuteVal").textContent = `${weights.raw.m}%`;
      byId("wSpaceVal").textContent = `${weights.raw.s}%`;
      byId("wCommVal").textContent = `${weights.raw.c}%`;

      const eligible = UNITS_DATA
        .filter(u => u.noiseLevel !== "MAIN_ROAD" && matchPriceFilter(u) && matchCommuteFilter(u))
        .map(u => ({ ...u, totalScore: calcWeightedScore(u, weights), macro: COMMUNITIES_MACRO[u.project] }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 4);

      const medals = ["🥇 严选TOP 1", "🥈 严选TOP 2", "🥉 严选TOP 3", "🏅 严选TOP 4"];
      const container = byId("topRecommendations");

      if (eligible.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-6 text-xs text-slate-400">当前预算与通勤条件下暂无非主干道房源，请适当放宽下方总价或通勤筛选。</div>`;
        return;
      }

      container.innerHTML = eligible.map((u, idx) => `
        <div class="rounded-xl p-3 border ${idx === 0 ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 bg-slate-50/60'} flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-[11px] mb-1">
              <span class="font-bold text-indigo-700">${medals[idx]} · ${u.macro.zone}</span>
              <span class="px-2 py-0.5 bg-indigo-600 text-white rounded-full font-bold">${u.totalScore}分</span>
            </div>
            <div class="font-bold text-xs text-slate-900">${u.project} · ${u.building}</div>
            <div class="text-[11px] text-purple-800 font-semibold mt-0.5">📐 ${u.structureType} ｜ ${u.area}㎡(实得${u.usableArea}㎡)</div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-0.5">
            <div class="flex justify-between">
              <span class="font-bold text-rose-600">💰 ${u.priceRange}</span>
              <span class="font-semibold text-pink-700">🚇 贝尔路${u.macro.commuteMins}分</span>
            </div>
            <div class="truncate">🅿️ 车位${leadingMetric(u.macro.parkingLabel)} ｜ ${leadingMetric(u.macro.elevatorRatio)}</div>
            <div class="truncate text-emerald-800">🔇 ${u.roadDistMeters}</div>
          </div>
        </div>
      `).join("");
    }

    // =========================================================================
    // 6. 渲染视角二：微观楼栋户号卡片矩阵
    // =========================================================================
    function matchProjectZone(unit, projFilter) {
      const macro = COMMUNITIES_MACRO[unit.project];
      if (projFilter === "ALL") return true;
      if (projFilter === "ZONE_BANTIAN") return macro.zone === "坂田片区";
      if (projFilter === "ZONE_BUJI") return macro.zone === "布吉/南湾";
      if (projFilter === "ZONE_DAYUN") return macro.zone === "龙岗大运";
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
      const struct = byId("filterStructure").value;
      const orient = byId("filterOrientation").value;
      const noise = byId("filterNoise").value;
      const minUsable = parseInt(byId("filterUsableRate").value, 10);
      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      const weights = getWeights();

      byId("maxPriceLabel").textContent =
        maxSlider >= 720 ? "不限上限 (≤720万)" : `预算上限 ≤ ${maxSlider} 万`;

      const filtered = UNITS_DATA.filter(u => {
        if (!matchProjectZone(u, proj)) return false;
        if (bld !== "ALL" && `${u.project} - ${u.building}` !== bld) return false;
        if (layout !== "ALL" && u.layoutType !== layout) return false;
        if (struct !== "ALL" && u.structureType !== struct) return false;
        if (orient !== "VALID_SOUTH" && u.orientation !== orient) return false;
        if (noise === "QUIET_ONLY" && u.noiseLevel !== "QUIET") return false;
        if (noise === "NO_MAIN" && u.noiseLevel === "MAIN_ROAD") return false;
        if (u.usableRateNum < minUsable) return false;
        if (!matchPriceFilter(u)) return false;
        if (!matchCommuteFilter(u)) return false;
        return true;
      }).map(u => ({
        ...u,
        totalScore: calcWeightedScore(u, weights),
        macro: COMMUNITIES_MACRO[u.project]
      })).sort((a, b) => b.totalScore - a.totalScore);

      byId("matchCountBadge").textContent = `匹配 ${filtered.length} 个具体楼栋户号`;

      const container = byId("unitCardsContainer");
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-300">
            当前九维筛选条件下暂无匹配户号，建议放宽“空间厅型格局”、“得房率”或“总价区间”选项。
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(u => {
        const isCompared = compareIds.includes(u.id);
        const m = u.macro;
        let noiseBadgeClass = "badge-green";
        if (u.noiseLevel === "SUB_ROAD") noiseBadgeClass = "badge-amber";
        if (u.noiseLevel === "MAIN_ROAD") noiseBadgeClass = "badge-red";

        let zoneBadgeColor = "bg-slate-800 text-white";
        if (m.zone === "坂田片区") zoneBadgeColor = "bg-pink-700 text-white";
        if (m.zone === "龙岗大运") zoneBadgeColor = "bg-indigo-700 text-white";

        return `
          <div class="rounded-xl border ${u.noiseLevel === 'MAIN_ROAD' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 bg-white'} p-4 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <!-- 头部：片区 + 楼盘 + 综合得分 -->
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded ${zoneBadgeColor}">${m.zone}</span>
                  <span class="font-bold text-xs text-slate-900">${u.project}</span>
                  <span class="text-[11px] text-slate-400">(${u.phase})</span>
                </div>
                <span class="text-xs font-bold text-indigo-600">综合分：${u.totalScore}</span>
              </div>

              <!-- 具体楼栋与户号标题 -->
              <h3 class="text-sm font-bold text-slate-900">${u.building} · <span class="text-indigo-700">${u.unitCode}</span></h3>

              <!-- 核心标签栏：总价 + 厅型格局 + 房卫规格 + 朝向 + 噪音 -->
              <div class="flex flex-wrap gap-1.5 mt-2 text-[11px]">
                <span class="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  💰 ${u.priceRange}
                </span>
                <span class="px-2 py-0.5 rounded font-bold badge-purple">
                  📐 ${u.structureType}
                </span>
                <span class="px-2 py-0.5 rounded font-semibold bg-indigo-100 text-indigo-800">
                  ${u.layoutType}
                </span>
                <span class="px-2 py-0.5 rounded font-semibold bg-amber-100 text-amber-800">
                  ☀️ 阳台${u.orientation}
                </span>
                <span class="px-2 py-0.5 rounded font-semibold ${noiseBadgeClass}">
                  ${u.noiseLabel}
                </span>
              </div>

              <!-- 区块1：【微观户号级】空间实得与噪音源解剖 -->
              <div class="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <div class="font-bold text-emerald-800 text-[11px] uppercase tracking-wider">🔍 微观户号解剖 (Unit Level)</div>
                <div><strong class="text-slate-800">建面与实得：</strong>建面 <strong>${u.area}㎡</strong> × 得房率 <strong>${u.usableRateNum}%</strong> ≈ 套内实得 <strong class="text-indigo-700">${u.usableArea}㎡</strong></div>
                <div><strong class="text-slate-800">主干道距离：</strong>${u.roadDistMeters}</div>
                <div><strong class="text-slate-800">特殊噪音源：</strong>${u.specialNoise}</div>
              </div>

              <!-- 区块2：【宏观小区级】硬核工程指标继承展示 -->
              <div class="mt-2.5 pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-600 space-y-1 bg-slate-50/80 p-2.5 rounded-lg">
                <div class="font-bold text-indigo-900">🏢 宏观小区底盘 (${m.regLabel.split("·")[0]})</div>
                <div class="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <div><strong>容积率：</strong>${m.plotRatio}</div>
                  <div><strong>总层高：</strong>${m.totalFloors}</div>
                  <div><strong>梯户比：</strong>${leadingMetric(m.elevatorRatio)}</div>
                  <div><strong>车位比：</strong><span class="${m.parkingRatio < 1 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}">${leadingMetric(m.parkingLabel)}</span></div>
                  <div class="col-span-2"><strong>楼间距：</strong>${m.buildingSpacing} ｜ <strong>纯粹度：</strong>${m.purity === 'PURE' ? '纯商品房' : '含配建/混居'}</div>
                  <div class="col-span-2 text-pink-800"><strong>🚇 地铁与贝尔路：</strong>距${m.metroStation}${distanceMetric(m.metroDist)} → <strong>${m.commuteMins}分钟</strong>达贝尔路</div>
                  <div class="col-span-2"><strong>🎓 学位：</strong>${m.schoolMiddle}</div>
                </div>
              </div>

              <!-- 二胎点评 -->
              <div class="mt-2 text-[11px] text-slate-700 leading-relaxed bg-indigo-50/40 p-2 rounded-lg border border-indigo-100">
                👶 <strong>二胎选房建议：</strong>${u.twoKidsNote}
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">${m.propertyInfo}</span>
              <button type="button" data-compare-id="${u.id}" class="px-3 py-1 rounded-lg text-xs font-semibold transition ${
                isCompared
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }">
                ${isCompared ? '✓ 已在PK台 (移除)' : '+ 加入同屏PK'}
              </button>
            </div>
          </div>
        `;
      }).join("");
    }

    // =========================================================================
    // 7. 渲染视角三：宏观+微观全维度同屏 PK 对比台
    // =========================================================================
    function toggleCompare(id) {
      if (compareIds.includes(id)) {
        compareIds = compareIds.filter(item => item !== id);
      } else {
        if (compareIds.length >= 5) {
          alert("同屏PK台最多同时放置 5 个具体楼栋户号，请先移除一个再添加。");
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
        .filter(Boolean)
        .map(u => ({ ...u, macro: COMMUNITIES_MACRO[u.project] }));

      const table = byId("compareTable");
      if (selectedUnits.length === 0) {
        table.innerHTML = `<tr><td class="p-6 text-center text-slate-400">请在上方卡片中点击“+ 加入同屏PK”添加对比项</td></tr>`;
        return;
      }

      const rows = [
        // 微观户号维度
        { section: "【具体视角】微观楼栋户号、厅型与实得面积", label: "具体期数 · 楼栋 · 户号", render: u => `<span class="font-bold text-indigo-700">${u.building}</span><br/><span>${u.unitCode}</span>` },
        { label: "综合加权得分", render: u => `<span class="px-2.5 py-0.5 bg-indigo-600 text-white rounded-full font-bold">${calcWeightedScore(u, weights)} 分</span>` },
        { label: "💰 参考总价区间", render: u => `<span class="font-bold text-rose-600 text-sm">${u.priceRange}</span>` },
        { label: "📐 空间厅型格局 (流派)", render: u => `<span class="px-2 py-0.5 rounded badge-purple font-bold">${u.structureType}</span>` },
        { label: "房厅卫功能规格", render: u => `<strong>${u.layoutType}</strong>` },
        { label: "建面 × 得房率 = 套内实得", render: u => `建面 <strong>${u.area}㎡</strong> × ${u.usableRateNum}%<br/><span class="text-indigo-700 font-bold">≈ 实得 ${u.usableArea}㎡</span>` },
        { label: "☀️ 阳台主朝向", render: u => `<span class="font-semibold text-amber-700">${u.orientation}</span>` },
        { label: "🔇 距主干道精确米数", render: u => `<div class="font-semibold text-emerald-800">${u.noiseLabel}</div><div class="text-slate-500 mt-0.5">${u.roadDistMeters}</div>` },
        { label: "🚨 铁路/高架/特殊噪音排查", render: u => u.specialNoise },

        // 宏观小区维度
        { section: "【整体视角】宏观小区工程指标、通勤与学位", label: "建筑新规代际 & 交房年份", render: u => `<div class="font-semibold">${u.macro.regLabel}</div><div class="text-slate-500">${u.macro.buildYear}</div>` },
        { label: "容积率 & 主力楼间距", render: u => `容积率：<strong>${u.macro.plotRatio}</strong><br/>楼间距：${u.macro.buildingSpacing}` },
        { label: "总层高 & 梯户比(候梯体验)", render: u => `<strong>${u.macro.totalFloors}</strong><br/>${u.macro.elevatorRatio}` },
        { label: "🅿️ 车位比 & 充电桩", render: u => `<span class="font-bold ${u.macro.parkingRatio < 1 ? 'text-rose-600' : 'text-emerald-700'}">${u.macro.parkingLabel}</span>` },
        { label: "社区纯粹度 & 物业费", render: u => `${u.macro.purityLabel}<br/><span class="text-slate-400">${u.macro.propertyInfo}</span>` },
        { label: "🚶 距离最近地铁站", render: u => `<strong>${u.macro.metroStation}</strong><br/>${u.macro.metroDist}` },
        { label: "🚇 太太至贝尔路站通勤", render: u => `<div class="font-bold text-pink-700">约 ${u.macro.commuteMins} 分钟</div><div class="text-slate-500">${u.macro.commuteRoute}</div>` },
        { label: "🎓 对口小学 & 初中升学率", render: u => `<div>小：${u.macro.schoolPrimary}</div><div class="font-semibold text-indigo-900 mt-0.5">初：${u.macro.schoolMiddle}</div>` },
        { label: "👶 二胎家庭终极点评", render: u => u.twoKidsNote }
      ];

      let tbodyHtml = "";
      rows.forEach(r => {
        if (r.section) {
          tbodyHtml += `
            <tr class="bg-slate-800 text-white">
              <td colspan="${selectedUnits.length + 1}" class="py-1.5 px-3 font-bold text-[11px] tracking-wider">${r.section}</td>
            </tr>
          `;
        }
        tbodyHtml += `
          <tr class="hover:bg-slate-50/80">
            <td class="py-2 px-3 font-semibold text-slate-700 bg-slate-50/70 w-40">${r.label}</td>
            ${selectedUnits.map(u => `<td class="py-2 px-3 text-slate-700 align-top">${r.render(u)}</td>`).join("")}
          </tr>
        `;
      });

      table.innerHTML = `
        <thead>
          <tr class="bg-slate-100 border-b border-slate-200">
            <th class="py-3 px-3 w-40 font-bold text-slate-800">宏观 × 微观对比维度</th>
            ${selectedUnits.map(u => `
              <th class="py-3 px-3 min-w-[210px]">
                <div class="flex items-center justify-between gap-1">
                  <div>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${u.macro.zone}</span>
                    <div class="text-indigo-950 font-bold text-xs mt-0.5">${u.project}</div>
                  </div>
                  <button type="button" data-compare-id="${u.id}" class="text-slate-400 hover:text-rose-600 text-xs shrink-0">✕ 移除</button>
                </div>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          ${tbodyHtml}
        </tbody>
      `;
    }

    // =========================================================================
    // 8. 事件绑定与初始化
    // =========================================================================
    function bindEvents() {
      // 权重滑块
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
        byId("wSpace").value = 15;
        byId("wComm").value = 15;
        renderTopRecommendations();
        renderUnitCards();
        renderCompareTable();
      });

      // 宏观表筛选器
      ["macroZoneFilter", "macroRegFilter", "macroParkingFilter", "macroPurityFilter"].forEach(id => {
        byId(id).addEventListener("change", renderMacroTable);
      });

      // 微观表筛选器
      byId("filterProject").addEventListener("change", () => {
        updateBuildingOptions();
        renderUnitCards();
      });

      ["filterBuilding", "filterLayout", "filterStructure", "filterOrientation", "filterNoise", "filterUsableRate"].forEach(id => {
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
        byId("filterStructure").value = "ALL";
        byId("filterOrientation").value = "VALID_SOUTH";
        byId("filterNoise").value = "NO_MAIN";
        byId("filterUsableRate").value = "0";
        byId("filterPriceBracket").value = "ALL";
        byId("filterCommute").value = "ALL";
        byId("filterMaxPriceSlider").value = 720;
        renderTopRecommendations();
        renderUnitCards();
      });

      byId("clearCompareBtn").addEventListener("click", () => {
        compareIds = ["bt-xinyi-5-89", "vanke-3-89", "horoy-6-89", "tefa-3-96", "kk-3-97"];
        renderUnitCards();
        renderCompareTable();
      });
    }

    function init() {
      renderMacroTable();
      updateBuildingOptions();
      renderTopRecommendations();
      renderUnitCards();
      renderCompareTable();
      bindEvents();
      root.addEventListener("click", event => {
        const button = event.target.closest("button[data-compare-id], button[data-drill-project]");
        if (!button || !root.contains(button)) return;
        if (button.dataset.compareId) toggleCompare(button.dataset.compareId);
        else drillDownProject(button.dataset.drillProject);
      });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
  
})();
