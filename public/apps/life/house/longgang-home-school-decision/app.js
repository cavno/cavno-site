/* 附件原始宏观数据、户号数据和计算规则；仅隔离 DOM 与按钮事件。 */
(() => {
  const root = document.getElementById('lg-house-app');
  if (!root) return;
  const byId = id => root.querySelector('#' + id);
  const leadingMetric = value => value.match(/^(?:[^\d]*\s*)?\d+(?::\d+(?:\.\d+)?|梯\d+户)/u)?.[0] || value.split(" ")[0];
  const distanceMetric = value => value.match(/\d+(?:[~～-]\d+)?米/u)?.[0] || value;

    // =========================================================================
    // 1. 宏观与中观数据库：15个小区整体工程、圈层、民房界面、十年Beta与历史抗跌验证
    // =========================================================================
    const COMMUNITIES_MACRO = {
      "佳兆业中央广场": {
        zone: "坂田片区",
        phaseSummary: "共3期住宅 (主力三期8栋围合)",
        buildYear: "2014-2016年",
        regGen: "GEN1",
        regLabel: "第1代·传统限拓规",
        usableAvg: "81%~83%",
        // 新增：密度等级与容积率
        plotRatio: 4.8,
        densityGrade: "MID",
        densityLabel: "中密围合 (容积率4.8)",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 55~90米",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (充裕)",
        // 新增：产权纯粹度与保障房比例
        purityGrade: "S",
        subsidizedRatio: "0% (三期主力纯商品房)",
        purityLabel: "S级·纯商品房大城 (无保障房混居)",
        // 新增：产品定位与人群圈层
        assetTier: "品质改善",
        residentProfile: "华为总部研发工程师、中层主管及科技企业白领家庭为主，高学历高收入圈层",
        // 新增：周边有无民房/城市界面
        villageGrade: "B",
        urbanInterface: "B级·半现代半旧村交织（社区内豪华园林，但外围东/北侧仍有岗头/雪象民房与厂房待旧改）",
        // 新增：板块十年发展Beta與天花板
        tenYearBeta: "背靠华为全球总部20万科创新贵购买力，10号线双地铁口+百万方旧改兑现中；板块三房天花板可达520~580万。",
        // 新增：历史抗跌性验证 (2021-2026)
        resilienceGrade: "MID",
        drawdownPct: 24,
        priceCeilingVerify: "2021峰值约6.3万→2026企稳于4.8万/㎡(回撤约24%)；华为客群真实自住承接力强，抗跌性优于龙岗平均水平。",
        propertyInfo: "佳兆业物业 · 3.8元/㎡",
        metroStation: "10号线岗头站/华为站",
        metroDist: "约 250~450米 (步行5分钟)",
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
        regLabel: "第0/1代·高拓展规",
        usableAvg: "82%~85%",
        plotRatio: 4.1,
        densityGrade: "MID",
        densityLabel: "中低密大城 (容积率4.1)",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 65~110米 (皇家园林)",
        parkingRatio: 1.02,
        parkingLabel: "1:1.02 (达标)",
        purityGrade: "S",
        subsidizedRatio: "0% (纯商品房大盘)",
        purityLabel: "S级·100%纯商品房标杆大盘",
        assetTier: "品质改善",
        residentProfile: "华为资深员工、福田/北站外溢改善中产、重视教育的二胎家庭，社区育儿氛围极浓",
        villageGrade: "B",
        urbanInterface: "B级·内优外杂（小区内部百米楼距皇家园林极纯粹，但出小区周边仍有坂田老民房街区包夹）",
        tenYearBeta: "紧邻五和国际交通枢纽（深大/深惠城际交汇）+ 坂雪岗科技城南扩，未来10年枢纽红利确定性极高；三房天花板550~620万。",
        resilienceGrade: "HIGH",
        drawdownPct: 22,
        priceCeilingVerify: "五期89㎡从2021峰值约6.8万→2026稳定在5.3万/㎡(回撤仅22%)；凭科外名校+大园林成为坂田硬通货。",
        propertyInfo: "信义物业 · 3.6元/㎡",
        metroStation: "10号线坂田北站 / 5号线五和站",
        metroDist: "约 380~600米 (步行6分钟)",
        commuteMins: 14,
        commuteRoute: "10号线坂田北站 → 2站0换乘直达贝尔路站",
        schoolPrimary: "科技城外国语学校(小学部，社区旁)",
        schoolMiddle: "科技城外国语学校 (公办率~74%，坂田口碑王牌)"
      },
      "诺德中央道": {
        zone: "坂田片区",
        phaseSummary: "共2期 (一期4栋 / 二期6栋)",
        buildYear: "2015-2017年",
        regGen: "GEN1",
        regLabel: "第1代·传统高拓规",
        usableAvg: "82%~84%",
        plotRatio: 4.5,
        densityGrade: "MID",
        densityLabel: "中密社区 (容积率4.5)",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 45~70米",
        parkingRatio: 0.96,
        parkingLabel: "1:0.96 (略紧)",
        purityGrade: "A",
        subsidizedRatio: "约10% (一期含少量配建)",
        purityLabel: "A级·二期为纯正商品房",
        assetTier: "主流刚改",
        residentProfile: "冲着“深圳实验学校坂田部”买入的极度重视教育的鸡娃中产家庭、坂田/福田双职工",
        villageGrade: "B",
        urbanInterface: "B级·紧邻城中村（东/南侧紧贴光雅园村农民房，低层外向视野受民房影响，内部花园尚可）",
        tenYearBeta: "五和大道沿线城市更新带+深实验名校集团加持；但受限于小区体量中等及周边民房界面，总价天花板约530万。",
        resilienceGrade: "LOW",
        drawdownPct: 35,
        priceCeilingVerify: "⚠️ 2021年因深实验挂牌炒作至7.5万/㎡，2026回归至4.9万/㎡(回撤约35%)；验证了“有民房短板的学区盘无法长期维持豪宅溢价”，但当前泡沫已挤干。",
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
        plotRatio: 4.6,
        densityGrade: "MID",
        densityLabel: "中密次新 (容积率4.6)",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 60~95米 (大气围合园林)",
        parkingRatio: 1.08,
        parkingLabel: "1:1.08 (充裕)",
        purityGrade: "A",
        subsidizedRatio: "约12% (独立楼栋配建)",
        purityLabel: "A级·次新商品房为主 (自带4.5万㎡商业)",
        assetTier: "品质改善",
        residentProfile: "偏好次新外立面与大园林的年轻科技新贵、华为及北站商务区改善客群",
        villageGrade: "A",
        urbanInterface: "A级·现代综合体界面（自带商业MALL与学校，除局部外围有少量旧改过渡带外，整体界面崭新整洁）",
        tenYearBeta: "坂田南连接北站超核的门户位置，楼龄新(2020年)，未来10年折旧极慢，次新溢价可持续。",
        resilienceGrade: "MID",
        drawdownPct: 25,
        priceCeilingVerify: "2021峰值约6.6万→2026约4.95万/㎡(回撤约25%)；因楼龄新、园林好，在坂田次新阵营中成交极其活跃。",
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
        phaseSummary: "共4期大城 (三期6栋7单元)",
        buildYear: "2016-2017年",
        regGen: "GEN1",
        regLabel: "第1代·万科精装实用规",
        usableAvg: "81%~82%",
        plotRatio: 4.2,
        densityGrade: "MID",
        densityLabel: "中低密依山社区 (容积率4.2)",
        totalFloors: "32~34层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 50~85米",
        parkingRatio: 0.86,
        parkingLabel: "⚠️ 1:0.86 (偏紧)",
        purityGrade: "S",
        subsidizedRatio: "0% (三期100%纯商品房)",
        purityLabel: "S级·100%纯商品房标杆大城",
        assetTier: "主流刚改",
        residentProfile: "罗湖/福田/坂田通勤的教师、医生、公务员、跨境电商及科技白领，全片区生源与邻居素质最纯粹",
        villageGrade: "A",
        urbanInterface: "A级·山体公园隔离界面（北靠银湖山郊野公园及体育公园，完全隔绝下水径民房，社区视野翠绿纯净）",
        tenYearBeta: "定位为深圳中部成熟学区+生态标杆住区。虽无本土科技总部，但靠万科物业+南师大附校80%普高率，稳坐片区龙头；注意水径片区三房总价天花板在460~480万左右。",
        resilienceGrade: "MID",
        drawdownPct: 27,
        priceCeilingVerify: "2021年曾冲至6.5万/㎡(约580万)，突破了布吉片区购买力天花板；2026年回调至4.7~4.9万/㎡(415~445万，回撤27%)后换手率极高、底部极其坚实。",
        propertyInfo: "万科物业 · 3.98元/㎡",
        metroStation: "5号线上水径站",
        metroDist: "约 350~500米 (步行6分钟)",
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
        plotRatio: 4.3,
        densityGrade: "MID",
        densityLabel: "中低密围合 (容积率4.3)",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 65~100米 (背山面泳池)",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (充裕)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房)",
        purityLabel: "S级·100%纯商品房豪宅园林社区",
        assetTier: "主流刚改",
        residentProfile: "看重鸿荣源建筑品质与园林的改善型自住家庭、企业主及罗湖/福田/坂田白领，自住率超85%",
        villageGrade: "A",
        urbanInterface: "A级·背山半隔离界面（南侧紧靠三联山体公园极幽静，西侧虽有水径村但由围合建筑与台地完整隔离）",
        tenYearBeta: "共享南师大龙岗学校学区+2026新建54班水径九年一贯制学校红利，车位比(1:1.05)优于万科麓城，未来10年依然是水径片区居住品质冠军。",
        resilienceGrade: "HIGH",
        drawdownPct: 22,
        priceCeilingVerify: "2021峰值约5.7万→2026稳定在4.4~4.7万/㎡(回撤仅22%)；因前期未过度透支炒作且园林得房率硬核，抗跌性表现极佳！",
        propertyInfo: "鸿荣源物业 · 3.9元/㎡",
        metroStation: "5号线上水径站 / 下水径站",
        metroDist: "约 450~600米 (步行7分钟)",
        commuteMins: 24,
        commuteRoute: "5号线上水径 → 五和转10号线 → 贝尔路站",
        schoolPrimary: "水径小学 / 麓城外国语 / 水径九年一贯制(共享)",
        schoolMiddle: "南京师范大学附属龙岗学校 (公办率80.8%)"
      },
      "特发臻华府": {
        zone: "布吉/南湾",
        phaseSummary: "共1期10栋 (商品房6栋+回迁/保障房)",
        buildYear: "2028.06交付(期房)",
        regGen: "GEN3",
        regLabel: "🔥 第3代·2024二批新规",
        usableAvg: "96%~98%",
        plotRatio: 7.1,
        densityGrade: "HIGH",
        densityLabel: "🚨 超高层高密 (容积率7.1)",
        totalFloors: "45~47层",
        elevatorRatio: "3梯5户 / 3梯6户",
        buildingSpacing: "中央45~60米 (局部16~18米)",
        parkingRatio: 0.73,
        parkingLabel: "🚨 1:0.73 (严重偏紧)",
        purityGrade: "B",
        subsidizedRatio: "约42% (含大量回迁房与公租/保障房)",
        purityLabel: "B级·商品房与回迁/保障房混合大社区",
        assetTier: "主流刚改",
        residentProfile: "冲着14号快线石芽岭站与98%超高得房率买入的年轻刚改家庭 + 原村民回迁户 + 保障房租户",
        villageGrade: "B",
        urbanInterface: "B级·工业区旧改过渡界面（南侧靠近石芽岭生态公园，但北侧近广深铁路，周边仍有南湾旧工业园与民房待更新）",
        tenYearBeta: "14号快线石芽岭站+旁侧规划54班深大附中南湾学校；但受限于7.1高容积率、1:0.73车位比及高比例回迁保障房，未来二手溢价天花板受限（适合长期自住而非投资）。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "2025-2026新盘折后均价约4.1万/㎡，按97%得房率折算套内单价仅相当于老盘3.4万/㎡，具备极厚的一二手新规折算安全垫。",
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
        plotRatio: 4.6,
        densityGrade: "MID",
        densityLabel: "中密次新 (容积率4.6)",
        totalFloors: "32~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 50~75米",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (达标)",
        purityGrade: "S",
        subsidizedRatio: "0% (纯商品房社区)",
        purityLabel: "S级·100%纯商品房次新社区",
        assetTier: "主流刚改",
        residentProfile: "大运高校教职工、龙岗中心城体制内人员、东部年轻改善家庭",
        villageGrade: "S",
        urbanInterface: "S级·零民房大运新城界面（紧邻大运中心体育场与大运天地商圈，周边宽阔现代、无农民房）",
        tenYearBeta: "直接享受大运天地华润商圈、港中深附属知新名校与大运北国际化街区红利，未来十年城市界面稳居东部第一梯队。",
        resilienceGrade: "MID",
        drawdownPct: 26,
        priceCeilingVerify: "2021峰值约5.6万→2026约4.15万/㎡(回撤约26%)；目前365~400万买大运次新纯商品房三房两卫+港中大知新学位，性价比极实。",
        propertyInfo: "佳兆业物业 · 3.9元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 500米 (步行6分钟)",
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
        plotRatio: 3.2,
        densityGrade: "LOW",
        densityLabel: "🌟 舒居低密 (容积率仅3.2!)",
        totalFloors: "29~30层",
        elevatorRatio: "🌟 2梯4户 (极舒适)",
        buildingSpacing: "约 60~100米",
        parkingRatio: 1.11,
        parkingLabel: "🌟 1:1.11 (充裕)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房)",
        purityLabel: "S级·100%纯商品房低密社区",
        assetTier: "品质改善",
        residentProfile: "高校学者、医生、公务员、大运科教城研发人员及改善二胎家庭，邻里极其安静文明",
        villageGrade: "S",
        urbanInterface: "S级·零民房纯净新城界面（位于大运国际大学园与体育中心核心腹地，周边无任何城中村民房）",
        tenYearBeta: "在新建住宅容积率普遍破5.5~7.0的时代，京基御景中央3.2超低容积率+2梯4户+纯商品房属于不可再生稀缺孤品，长线保值力极强。",
        resilienceGrade: "MID",
        drawdownPct: 24,
        priceCeilingVerify: "2021峰值约5.3万→2026约4.0万/㎡(回撤约24%)；97㎡双龙抱珠户型在360~400万区间承接力极强。",
        propertyInfo: "京基物业 · 3.95元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 650米 (步行8分钟)",
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
        plotRatio: 4.2,
        densityGrade: "MID",
        densityLabel: "中低密改善 (容积率4.2)",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 3梯5户",
        buildingSpacing: "约 55~90米",
        parkingRatio: 1.15,
        parkingLabel: "🌟 1:1.15 (优渥)",
        purityGrade: "S",
        subsidizedRatio: "0% (主力期数100%纯商品房)",
        purityLabel: "S级·100%纯商品房百万方旗舰",
        assetTier: "品质改善",
        residentProfile: "龙岗改善型中产、企业高管、华附大运及港中深教职工，圈层纯粹度稳居大运前列",
        villageGrade: "S",
        urbanInterface: "S级·零民房都会核心界面（与大运枢纽、星河COCO Park、华附大运学校连成一片现代化摩天都市界面）",
        tenYearBeta: "大运枢纽四轨交汇(含在建深大城际)+自带约10万㎡跨界商业+华附大运名校，板块成熟度与未来十年确定性全龙岗最高，天花板可达6.5万/㎡。",
        resilienceGrade: "HIGH",
        drawdownPct: 21,
        priceCeilingVerify: "🏆 2021峰值约5.7万→2026稳定在4.5万/㎡(回撤仅21%)；凭“纯商品房+华附名校+14号快线枢纽”成为大运抗跌标杆。",
        propertyInfo: "颐安物业 · 3.9元/㎡",
        metroStation: "大运枢纽站 (3/14/16/深大城际)",
        metroDist: "约 400~650米 (步行6分钟)",
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
        plotRatio: 2.6,
        densityGrade: "LOW",
        densityLabel: "🏆 别墅级超低密 (容积率2.6!)",
        totalFloors: "31~32层",
        elevatorRatio: "2梯4户",
        buildingSpacing: "约 70~150米 (看别墅无遮挡)",
        parkingRatio: 1.25,
        parkingLabel: "🏆 1:1.25 (豪宅配比)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房+别墅)",
        purityLabel: "S级·100%纯商品房+低密别墅社区",
        assetTier: "品质改善",
        residentProfile: "别墅区为实业家与企业主，高层区为资深中产与深中龙岗陪读高净值家庭，购买力极强",
        villageGrade: "S",
        urbanInterface: "S级·零民房顶级商圈界面（下楼即星河COCO Park与山姆会员店，跨过马路即大运枢纽，完全无民房）",
        tenYearBeta: "占据“深中龙岗第一名校+山姆COCO Park商圈+2.6超低容积率+大运枢纽”四大核心资产锚点，未来10年不可复制。",
        resilienceGrade: "HIGH",
        drawdownPct: 19,
        priceCeilingVerify: "🏆 全表二手抗跌冠军！2021峰值约6.3万→2026稳定在5.1万/㎡(回撤仅19%)，89㎡高拓三房两卫常年一房难求。",
        propertyInfo: "星河智善生活 · 3.5元/㎡",
        metroStation: "大运枢纽站 / 3号线爱联站",
        metroDist: "约 550~700米 (步行8分钟)",
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
        plotRatio: 3.6,
        densityGrade: "LOW",
        densityLabel: "🌟 舒居低密 (容积率3.6)",
        totalFloors: "28~32层",
        elevatorRatio: "2梯4户 / 2梯6户",
        buildingSpacing: "约 55~85米",
        parkingRatio: 0.90,
        parkingLabel: "⚠️ 1:0.90 (略紧)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房)",
        purityLabel: "S级·100%纯商品房成熟大盘",
        assetTier: "刚需上车",
        residentProfile: "看重港中大知新学位的年轻首置刚需家庭、龙岗本地上班族及养老带娃老人，烟火气浓",
        villageGrade: "A",
        urbanInterface: "A级·南优北杂界面（南侧靠近大运体育馆与公园界面好，北侧靠近盐龙大道与局部老工业区）",
        tenYearBeta: "受益于港中大(深圳)附属知新学校名校成绩攀升与16号线地铁通车，作为大运200~260万级低门槛学区大盘，刚需接盘底座极大。",
        resilienceGrade: "LOW",
        drawdownPct: 33,
        priceCeilingVerify: "2021峰值约4.3万→2026回调至2.85万/㎡(回撤约33%)；因15年楼龄及大盘挂牌量多随大市充分回调，但目前240万买三房两卫已跌无可跌、见底企稳。",
        propertyInfo: "中海物业 · 2.95元/㎡",
        metroStation: "16号线龙城公园站 / 黄阁坑站",
        metroDist: "约 550米 (步行7分钟)",
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
        plotRatio: 5.35,
        densityGrade: "HIGH",
        densityLabel: "大户型改善密 (容积率5.35)",
        totalFloors: "31~48层",
        elevatorRatio: "🌟 2梯4户 / 3梯4户",
        buildingSpacing: "约 60~90米",
        parkingRatio: 1.73,
        parkingLabel: "🏆 1:1.73 (全表第一!)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房，零配建!)",
        purityLabel: "🏆 S级·100%纯商品房高定改善(126㎡起步)",
        assetTier: "品质改善",
        residentProfile: "企业主、科技公司高管、大学教授、龙岗终极改善换房家庭，126㎡/555万的高门槛天然筛选出顶级圈层",
        villageGrade: "S",
        urbanInterface: "S级·零民房顶配新城界面（紧邻大运天地商圈、大运公园与龙外本部，周边纯粹现代豪宅区界面）",
        tenYearBeta: "大运核心绝版纯商品房宅地+2024二批新规+1:1.73车位比，直接定义龙岗未来10年二手豪宅新天花板(6.5~8万/㎡)。",
        resilienceGrade: "HIGH",
        drawdownPct: 10,
        priceCeilingVerify: "2025.12开盘新盘，凭“大运核心+零保障房+94%超高得房率”逆市热销，验证了龙岗顶端改善客群对纯粹好房的极强支付力。",
        propertyInfo: "中海高定物业 · 5.98元/㎡",
        metroStation: "16号线大运中心站 / 文曲站",
        metroDist: "约 400米 (步行5分钟)",
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
        plotRatio: 6.1,
        densityGrade: "HIGH",
        densityLabel: "TOD枢纽高密 (容积率6.1)",
        totalFloors: "32层 / 45~46层",
        elevatorRatio: "2梯5户 / 3梯5户 / 3梯6户",
        buildingSpacing: "约 45~65米",
        parkingRatio: 1.15,
        parkingLabel: "🌟 1:1.15 (充裕)",
        purityGrade: "A",
        subsidizedRatio: "约22% (含1栋独立可售型人才房)",
        purityLabel: "A级·国企TOD社区 (人才房独立成栋)",
        assetTier: "主流刚改",
        residentProfile: "依赖14号快线/深大城际跨区通勤的福田/罗湖/坂田年轻中产家庭、深铁及国企员工",
        villageGrade: "S",
        urbanInterface: "S级·零民房TOD枢纽界面（大运综合交通枢纽上盖，周边为颐安都会中央与规划72班学校、商业综合体）",
        tenYearBeta: "大运四轨交汇枢纽(3/14/16/深大城际)+自带商业办公与72班九年一贯制学校，深大城际通车后直达五和与机场，枢纽价值长期看涨。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "2025-2026加推折后总价336~410万买大运枢纽精装98~102㎡三房两卫，比周边同面积次新二手还便宜，安全边际极高。",
        propertyInfo: "深铁物业 · 约4.5元/㎡",
        metroStation: "大运综合交通枢纽 (3/14/16/深大城际)",
        metroDist: "🏆 约 150米 (下楼直通枢纽，步行2分钟!)",
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
        plotRatio: 5.29,
        densityGrade: "HIGH",
        densityLabel: "中高密现房 (容积率5.29)",
        totalFloors: "26~47层",
        elevatorRatio: "3梯6户",
        buildingSpacing: "约 45~70米",
        parkingRatio: 1.10,
        parkingLabel: "🌟 1:1.10 (充裕)",
        purityGrade: "B",
        subsidizedRatio: "约38% (商品房884套 / 保障房约553套)",
        purityLabel: "B级·含约38%配建保障房 (2/3/6栋为纯商品房)",
        assetTier: "主流刚改",
        residentProfile: "看重国企现房交付、港中大道远学校目送式教育与大运中心配套的务实刚改家庭",
        villageGrade: "S",
        urbanInterface: "S级·零民房大运科教城界面（一路之隔即港中大附属道远学校，近大运天地与体育中心，周边无农民房）",
        tenYearBeta: "享受大运中心核心配套与高校附属教育红利；但因社区内含约38%保障房且3梯6户，未来二手上限略低于纯商品房京基/佳兆业。",
        resilienceGrade: "HIGH",
        drawdownPct: 16,
        priceCeilingVerify: "深业国企现房折后299万买89㎡三房一卫、337万买99㎡大横厅三房两卫，价格已提前反应配建因素，自住性价比突出。",
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
    // 2. 微观数据库：具体楼栋、单元、户号、厅型格局、距主干道米数、噪音源、得房率
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
        noiseLabel: "不临街 · 距主干道185米",
        roadDistMeters: "距坂澜大道约185米、距雪岗北路约160米",
        specialNoise: "无铁路/无高架/无地铁地上轨，仅日间泳池轻微水声（约41~44dB）",
        minPrice: 455,
        maxPrice: 498,
        priceRange: "455~498 万",
        twoKidsNote: "华为研发圈层核心盘！三期正中央南北通透楼王，太太10号线1~2站（或骑车8分钟）直达贝尔路站，中午可回家看二宝。",
        scores: { quiet: 95, edu: 85, commute: 99, space: 88, comm: 91, asset: 89 }
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
        scores: { quiet: 80, edu: 85, commute: 98, space: 78, comm: 88, asset: 87 }
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
        scores: { quiet: 35, edu: 85, commute: 98, space: 85, comm: 84, asset: 84 }
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
        twoKidsNote: "坂田改善与抗跌王牌（回撤仅22%）！100%纯商品房大园林+自带科技城外国语学校+10号线坂田北站2站直达贝尔路站。",
        scores: { quiet: 95, edu: 92, commute: 96, space: 89, comm: 93, asset: 94 }
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
        noiseLabel: "不临街 · 距主干道145米",
        roadDistMeters: "距吉华路约145米，由外圈1~3栋完整遮挡道路噪音",
        specialNoise: "无特殊噪音源，内园安静（约43~46dB）",
        minPrice: 435,
        maxPrice: 472,
        priceRange: "435~472 万",
        twoKidsNote: "450万级入主信义嘉御山纯商品房内园+科外名校+14分钟贝尔路通勤。",
        scores: { quiet: 91, edu: 92, commute: 95, space: 78, comm: 91, asset: 92 }
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
        twoKidsNote: "对口四大名校直管【深实验坂田校区】+10号线3站到贝尔路；前期学区溢价已充分回调(-35%)，唯周边紧邻光雅园村民房界面。",
        scores: { quiet: 91, edu: 96, commute: 94, space: 86, comm: 80, asset: 82 }
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
        twoKidsNote: "坂田城市界面最干净的次新大盘（自带商业MALL+大园林），96㎡实得78.7㎡宽敞舒适，太太通勤16分钟。",
        scores: { quiet: 94, edu: 85, commute: 95, space: 92, comm: 93, asset: 90 }
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
        noiseLabel: "不临街 · 距布龙路195米",
        roadDistMeters: "距布龙路主干道及高架约195米、距水径路约110米",
        specialNoise: "无铁路/无高架直射，前后双园林及5/6栋遮挡布龙路噪音（约41~45dB）",
        minPrice: 415,
        maxPrice: 445,
        priceRange: "415~445 万",
        twoKidsNote: "100%纯商品房+背靠山体公园隔绝民房+生源圈层极纯粹！南师大附校80.8%普高率，去贝尔路仅23分钟，430万级黄金平衡点。",
        scores: { quiet: 96, edu: 95, commute: 88, space: 86, comm: 92, asset: 88 }
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
        twoKidsNote: "380万级上车万科纯商品房社区+麓城外国语+南师大龙岗学校，唯独单卫需错峰、车位比(1:0.86)略紧。",
        scores: { quiet: 76, edu: 95, commute: 88, space: 74, comm: 90, asset: 87 }
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
        scores: { quiet: 32, edu: 95, commute: 88, space: 73, comm: 85, asset: 83 }
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
        twoKidsNote: "水径片区抗跌王(回撤仅22%)！100%纯商品房+车位比1:1.05+南靠山体公园完全隔绝民房与噪音，去贝尔路仅24分钟。",
        scores: { quiet: 97, edu: 89, commute: 87, space: 89, comm: 95, asset: 91 }
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
        twoKidsNote: "360~385万买鸿荣源100%纯商品房豪宅园林+南师大附校共享学区+24分钟贝尔路通勤。",
        scores: { quiet: 91, edu: 89, commute: 87, space: 77, comm: 93, asset: 90 }
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
        twoKidsNote: "微观户型满分（96㎡套内实得94㎡大横厅！）；但整体视角需接受：约42%回迁/保障房混居、容积率7.1、车位比1:0.73及周边工业园旧改界面。",
        scores: { quiet: 93, edu: 82, commute: 75, space: 99, comm: 72, asset: 83 }
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
        twoKidsNote: "350万级买套内实得83.5㎡三房两卫（比老盘89㎡实得还大10㎡），新规价格安全垫厚；短板同样是高容积率与配建混居。",
        scores: { quiet: 89, edu: 82, commute: 75, space: 95, comm: 72, asset: 83 }
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
        roadDistMeters: "距如意路主干道约140米、距龙飞大道约160米（2/5栋靠支路350万起）",
        specialNoise: "无铁路/无地铁高架，内园安静（约42~46dB）",
        minPrice: 350,
        maxPrice: 405,
        priceRange: "350~405 万",
        twoKidsNote: "S级零民房大运新城界面 + 100%纯商品房次新 + 港中大知新名校！唯太太去贝尔路地铁需52分钟。",
        scores: { quiet: 93, edu: 91, commute: 48, space: 86, comm: 92, asset: 89 }
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
        twoKidsNote: "社区纯粹度与低密满分：100%纯商品房+零民房高校界面+3.2超低容积率+2梯4户+1:1.11车位比+97㎡正南双龙抱珠！",
        scores: { quiet: 95, edu: 91, commute: 47, space: 93, comm: 97, asset: 92 }
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
        twoKidsNote: "305~339万享容积率3.2纯商品房低密豪宅圈层+零民房界面+港中大附校学位。",
        scores: { quiet: 92, edu: 91, commute: 47, space: 79, comm: 96, asset: 91 }
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
        twoKidsNote: "大运抗跌标杆(回撤仅21%)！100%纯商品房+零民房都会界面+车位比1:1.15+下楼即华附大运名校，14号快线去贝尔路44分钟。",
        scores: { quiet: 94, edu: 94, commute: 60, space: 88, comm: 96, asset: 96 }
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
        twoKidsNote: "全表二手抗跌总冠军(回撤仅19%)！容积率2.6别墅级低密+100%纯商品房+车位比1:1.25+楼下山姆会员店+深中龙岗顶级名校！",
        scores: { quiet: 96, edu: 98, commute: 58, space: 91, comm: 98, asset: 98 }
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
        twoKidsNote: "240~265万买容积率3.6纯商品房正南双龙抱珠三房两卫+港中大知新名校！前期已充分回调筑底，适合严控预算的务实家庭。",
        scores: { quiet: 92, edu: 91, commute: 42, space: 84, comm: 86, asset: 82 }
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
        twoKidsNote: "龙岗终极改善天花板！100%纯商品房(0保障房)+126㎡纯粹高净值圈层+零民房大运核心+车位比1:1.73+套内实得118㎡！",
        scores: { quiet: 97, edu: 78, commute: 48, space: 99, comm: 99, asset: 97 }
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
        twoKidsNote: "S级零民房大运枢纽上盖(步行2分钟入站)+车位比1:1.15+大横厅实得88㎡！含1栋独立人才房(约22%)，去贝尔路42分钟。",
        scores: { quiet: 90, edu: 89, commute: 63, space: 93, comm: 88, asset: 92 }
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
        twoKidsNote: "S级零民房科教城界面+国企现房+车位比1:1.10+马路对面港中大道远学校；注意小区含约38%配建保障房且3梯6户。",
        scores: { quiet: 95, edu: 89, commute: 48, space: 92, comm: 82, asset: 88 }
      }
    ];

    // 默认跨片区 PK 对比池
    let compareIds = ["bt-xinyi-5-89", "vanke-3-89", "horoy-6-89", "galaxy-6-89", "kk-3-97"];

    // =========================================================================
    // 3. 六维权重计算与过滤逻辑
    // =========================================================================
    function getWeights() {
      const q = parseInt(byId("wQuiet").value, 10);
      const e = parseInt(byId("wEdu").value, 10);
      const m = parseInt(byId("wCommute").value, 10);
      const s = parseInt(byId("wSpace").value, 10);
      const c = parseInt(byId("wComm").value, 10);
      const a = parseInt(byId("wAsset").value, 10);
      const total = q + e + m + s + c + a || 100;
      return {
        quiet: q / total,
        edu: e / total,
        commute: m / total,
        space: s / total,
        comm: c / total,
        asset: a / total,
        raw: { q, e, m, s, c, a }
      };
    }

    function calcWeightedScore(unit, weights) {
      const rawScore =
        unit.scores.quiet * weights.quiet +
        unit.scores.edu * weights.edu +
        unit.scores.commute * weights.commute +
        unit.scores.space * weights.space +
        unit.scores.comm * weights.comm +
        unit.scores.asset * weights.asset;
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
    // 4. 渲染视角二：15盘宏观整体圈层、纯粹度、民房界面、密度、抗跌横评表
    // =========================================================================
    function renderMacroTable() {
      const zoneF = byId("macroZoneFilter").value;
      const pureF = byId("macroPurityFilter").value;
      const vilF = byId("macroVillageFilter").value;
      const denF = byId("macroDensityFilter").value;
      const tierF = byId("macroTierFilter").value;
      const resF = byId("macroResilienceFilter").value;
      const parkF = byId("macroParkingFilter").value;
      const regF = byId("macroRegFilter").value;

      const entries = Object.entries(COMMUNITIES_MACRO).filter(([name, m]) => {
        if (zoneF !== "ALL" && m.zone !== zoneF) return false;
        if (pureF === "S" && m.purityGrade !== "S") return false;
        if (pureF === "A" && m.purityGrade === "B") return false;
        if (vilF === "S" && m.villageGrade !== "S") return false;
        if (vilF === "A" && m.villageGrade === "B") return false;
        if (denF === "LOW" && m.densityGrade !== "LOW") return false;
        if (denF === "MID" && m.densityGrade === "HIGH") return false;
        if (tierF !== "ALL" && m.assetTier !== tierF) return false;
        if (resF === "HIGH" && m.resilienceGrade !== "HIGH") return false;
        if (resF === "MID" && m.resilienceGrade === "LOW") return false;
        if (parkF !== "ALL" && m.parkingRatio < parseFloat(parkF)) return false;
        if (regF !== "ALL" && m.regGen !== regF) return false;
        return true;
      });

      const tbody = byId("macroTableBody");
      if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="py-8 text-center text-slate-400">暂无符合该组合条件的小区，请放宽上方筛选选项。</td></tr>`;
        return;
      }

      tbody.innerHTML = entries.map(([name, m]) => {
        const purityBadge = m.purityGrade === "S" ? "badge-green" : m.purityGrade === "A" ? "badge-blue" : "badge-amber";
        const vilBadge = m.villageGrade === "S" ? "badge-green" : m.villageGrade === "A" ? "badge-blue" : "badge-amber";
        const resBadge = m.resilienceGrade === "HIGH" ? "badge-green" : m.resilienceGrade === "MID" ? "badge-blue" : "badge-amber";

        return `
          <tr class="hover:bg-indigo-50/40 transition">
            <td class="py-2.5 px-2 align-top">
              <div class="font-bold text-slate-900">${name}</div>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${m.zone} · ${m.buildYear}</span>
            </td>
            <td class="py-2.5 px-2 align-top">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${purityBadge}">保障房：${m.subsidizedRatio.split(" ")[0]}</span>
              <div class="text-slate-600 mt-1 text-[11px]">${m.purityLabel}</div>
            </td>
            <td class="py-2.5 px-2 align-top max-w-[180px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold badge-purple">${m.assetTier}</span>
              <div class="text-slate-600 mt-1 text-[11px] leading-snug">${m.residentProfile}</div>
            </td>
            <td class="py-2.5 px-2 align-top max-w-[190px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${vilBadge}">${m.urbanInterface.split("（")[0]}</span>
              <div class="text-slate-500 mt-1 text-[11px] leading-snug">${m.urbanInterface.includes("（") ? m.urbanInterface.substring(m.urbanInterface.indexOf("（")) : ""}</div>
            </td>
            <td class="py-2.5 px-2 align-top">
              <div class="font-bold ${m.plotRatio <= 3.6 ? 'text-emerald-700' : m.plotRatio >= 6.0 ? 'text-rose-600' : 'text-slate-800'}">${m.densityLabel}</div>
              <div class="text-slate-600 text-[11px] mt-0.5">${m.totalFloors} · ${m.elevatorRatio}</div>
              <div class="text-slate-400 text-[11px]">楼距 ${m.buildingSpacing}</div>
            </td>
            <td class="py-2.5 px-2 align-top">
              <div class="font-semibold text-indigo-900 text-[11px]">${m.regLabel} (${m.usableAvg})</div>
              <div class="mt-1 font-bold ${m.parkingRatio < 1 ? 'text-rose-600' : 'text-emerald-700'}">🅿️ 车位 ${m.parkingLabel}</div>
            </td>
            <td class="py-2.5 px-2 align-top max-w-[210px] text-[11px] text-slate-600 leading-snug">
              ${m.tenYearBeta}
            </td>
            <td class="py-2.5 px-2 align-top max-w-[210px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${resBadge}">21-26回撤约 ${m.drawdownPct}%</span>
              <div class="text-[11px] text-slate-600 mt-1 leading-snug">${m.priceCeilingVerify}</div>
            </td>
            <td class="py-2.5 px-2 align-top">
              <div class="font-bold text-pink-700">🚇 贝尔路 ${m.commuteMins}分</div>
              <div class="text-[11px] text-slate-600 mt-0.5">${m.schoolMiddle}</div>
            </td>
            <td class="py-2.5 px-2 align-top text-center">
              <button type="button" data-drill-project="${name}" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold whitespace-nowrap">
                看户号 ↓
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }

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
      byId("wAssetVal").textContent = `${weights.raw.a}%`;

      const eligible = UNITS_DATA
        .filter(u => u.noiseLevel !== "MAIN_ROAD" && matchPriceFilter(u) && matchCommuteFilter(u))
        .map(u => ({ ...u, totalScore: calcWeightedScore(u, weights), macro: COMMUNITIES_MACRO[u.project] }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 4);

      const medals = ["🥇 严选TOP 1", "🥈 严选TOP 2", "🥉 严选TOP 3", "🏅 严选TOP 4"];
      const container = byId("topRecommendations");

      if (eligible.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-6 text-xs text-slate-400">当前预算与通勤条件下暂无非主干道房源，请放宽下方总价或通勤筛选。</div>`;
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
            <div class="text-[11px] text-purple-800 font-semibold mt-0.5">📐 ${u.structureType} ｜ 实得${u.usableArea}㎡</div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-0.5">
            <div class="flex justify-between">
              <span class="font-bold text-rose-600">💰 ${u.priceRange}</span>
              <span class="font-semibold text-pink-700">🚇 贝尔路${u.macro.commuteMins}分</span>
            </div>
            <div class="truncate">🏢 ${u.macro.purityLabel.split("·")[1]} ｜ ${u.macro.densityLabel.split(" ")[0]}</div>
            <div class="truncate text-emerald-800">🛡️ 21-26回撤约${u.macro.drawdownPct}% ｜ ${u.macro.assetTier}</div>
          </div>
        </div>
      `).join("");
    }

    // =========================================================================
    // 6. 渲染视角三：微观楼栋户号卡片矩阵（支持12维联动筛选）
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
      const purity = byId("filterPurity").value;
      const village = byId("filterVillage").value;
      const density = byId("filterDensity").value;
      const tier = byId("filterTier").value;
      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      const weights = getWeights();

      byId("maxPriceLabel").textContent =
        maxSlider >= 720 ? "不限上限 (≤720万)" : `预算上限 ≤ ${maxSlider} 万`;

      const filtered = UNITS_DATA.filter(u => {
        const m = COMMUNITIES_MACRO[u.project];
        if (!matchProjectZone(u, proj)) return false;
        if (bld !== "ALL" && `${u.project} - ${u.building}` !== bld) return false;
        if (layout !== "ALL" && u.layoutType !== layout) return false;
        if (struct !== "ALL" && u.structureType !== struct) return false;
        if (orient !== "VALID_SOUTH" && u.orientation !== orient) return false;
        if (noise === "QUIET_ONLY" && u.noiseLevel !== "QUIET") return false;
        if (noise === "NO_MAIN" && u.noiseLevel === "MAIN_ROAD") return false;
        if (purity === "S" && m.purityGrade !== "S") return false;
        if (purity === "A" && m.purityGrade === "B") return false;
        if (village === "S" && m.villageGrade !== "S") return false;
        if (village === "A" && m.villageGrade === "B") return false;
        if (density === "LOW" && m.densityGrade !== "LOW") return false;
        if (density === "MID" && m.densityGrade === "HIGH") return false;
        if (tier !== "ALL" && m.assetTier !== tier) return false;
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
            当前十二维筛选条件下暂无匹配户号，建议放宽“周边有无民房”、“高低密度”或“总价区间”选项。
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
              <!-- 头部：片区 + 楼盘 + 定位 + 综合得分 -->
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded ${zoneBadgeColor}">${m.zone}</span>
                  <span class="font-bold text-xs text-slate-900">${u.project}</span>
                  <span class="px-1.5 py-0.5 text-[10px] font-semibold rounded badge-indigo">${m.assetTier}</span>
                </div>
                <span class="text-xs font-bold text-indigo-600 shrink-0">总分：${u.totalScore}</span>
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
              <div class="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <div class="font-bold text-emerald-800 text-[11px]">🔍 ① 微观户号空间与噪音解剖</div>
                <div><strong class="text-slate-800">建面与实得：</strong>建面 <strong>${u.area}㎡</strong> × 得房率 <strong>${u.usableRateNum}%</strong> ≈ 套内实得 <strong class="text-indigo-700">${u.usableArea}㎡</strong></div>
                <div><strong class="text-slate-800">主干道距离：</strong>${u.roadDistMeters}</div>
                <div><strong class="text-slate-800">特殊噪音源：</strong>${u.specialNoise}</div>
              </div>

              <!-- 区块2：【中观社区级】纯粹度、圈层、民房界面、密度与车位 -->
              <div class="mt-2 pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-600 space-y-1 bg-slate-50/90 p-2.5 rounded-lg">
                <div class="font-bold text-indigo-900">🏢 ② 中观社区纯粹度 · 圈层 · 民房界面 · 密度</div>
                <div><strong>保障房/纯粹度：</strong><span class="${m.purityGrade === 'S' ? 'text-emerald-700 font-bold' : m.purityGrade === 'B' ? 'text-amber-700 font-bold' : 'text-slate-800'}">${m.purityLabel} (配建${m.subsidizedRatio.split(" ")[0]})</span></div>
                <div><strong>业主圈层画像：</strong>${m.residentProfile}</div>
                <div><strong>周边有无民房：</strong><span class="${m.villageGrade === 'S' ? 'text-emerald-700 font-semibold' : 'text-slate-700'}">${m.urbanInterface}</span></div>
                <div class="grid grid-cols-2 gap-1 pt-0.5">
                  <div><strong>密度：</strong>${m.densityLabel}</div>
                  <div><strong>梯户：</strong>${m.elevatorRatio}</div>
                  <div><strong>车位：</strong><span class="${m.parkingRatio < 1 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}">${m.parkingLabel}</span></div>
                  <div><strong>楼距：</strong>${m.buildingSpacing}</div>
                </div>
              </div>

              <!-- 区块3：【宏观板块级】十年Beta、历史抗跌验证、通勤与学位 -->
              <div class="mt-2 pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-600 space-y-1 bg-amber-50/40 p-2.5 rounded-lg">
                <div class="font-bold text-amber-900">📈 ③ 板块十年Beta · 抗跌验证 · 通勤与学位</div>
                <div><strong>抗跌与天花板：</strong><span class="font-bold text-indigo-900">21-26回撤约${m.drawdownPct}%</span> ｜ ${m.priceCeilingVerify}</div>
                <div class="text-pink-800"><strong>🚇 贝尔路通勤：</strong>距${m.metroStation}${distanceMetric(m.metroDist)} → <strong>${m.commuteMins}分钟</strong>达贝尔路</div>
                <div><strong>🎓 对口学区：</strong>${m.schoolMiddle}</div>
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
    // 7. 渲染视角四：三层穿透终极同屏 PK 对比台
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
        // 第一层：微观户号维度
        { section: "【第一层：具体户号视角】空间厅型、实得面积与精准噪音距离", label: "具体期数 · 楼栋 · 户号", render: u => `<span class="font-bold text-indigo-700">${u.building}</span><br/><span>${u.unitCode}</span>` },
        { label: "六维综合加权得分", render: u => `<span class="px-2.5 py-0.5 bg-indigo-600 text-white rounded-full font-bold">${calcWeightedScore(u, weights)} 分</span>` },
        { label: "💰 参考总价区间", render: u => `<span class="font-bold text-rose-600 text-sm">${u.priceRange}</span>` },
        { label: "📐 空间厅型格局 (流派)", render: u => `<span class="px-2 py-0.5 rounded badge-purple font-bold">${u.structureType}</span>` },
        { label: "房厅卫规格 & 套内实得", render: u => `<strong>${u.layoutType}</strong><br/>建面${u.area}㎡ × ${u.usableRateNum}% ≈ <strong class="text-indigo-700">实得${u.usableArea}㎡</strong>` },
        { label: "☀️ 阳台主朝向", render: u => `<span class="font-semibold text-amber-700">${u.orientation}</span>` },
        { label: "🔇 距主干道精确米数", render: u => `<div class="font-semibold text-emerald-800">${u.noiseLabel}</div><div class="text-slate-500 mt-0.5">${u.roadDistMeters}</div>` },
        { label: "🚨 铁路/高架/特殊噪音排查", render: u => u.specialNoise },

        // 第二层：中观社区纯粹度、圈层、民房界面、密度与车位
        { section: "【第二层：整体社区视角】保障房比例、业主圈层、周边有无民房、高低密度与车位", label: "🏢 产权纯粹度 & 保障房比", render: u => `<div class="font-bold ${u.macro.purityGrade === 'S' ? 'text-emerald-700' : 'text-amber-700'}">${u.macro.purityLabel}</div><div class="text-slate-500">配建比：${u.macro.subsidizedRatio}</div>` },
        { label: "👥 刚需/改善定位 & 圈层", render: u => `<span class="px-2 py-0.5 rounded badge-indigo font-bold">${u.macro.assetTier}</span><div class="mt-1 text-slate-600">${u.macro.residentProfile}</div>` },
        { label: "🏙️ 周边城市界面 (有无民房)", render: u => u.macro.urbanInterface },
        { label: "🌳 高低密度 & 容积率", render: u => `<div class="font-bold">${u.macro.densityLabel}</div><div class="text-slate-500">楼距：${u.macro.buildingSpacing}</div>` },
        { label: "总层高 & 梯户比(候梯)", render: u => `<strong>${u.macro.totalFloors}</strong> ｜ ${u.macro.elevatorRatio}` },
        { label: "🅿️ 车位比 & 建筑代际", render: u => `<div class="font-bold ${u.macro.parkingRatio < 1 ? 'text-rose-600' : 'text-emerald-700'}">车位 ${u.macro.parkingLabel}</div><div class="text-slate-500">${u.macro.regLabel}</div>` },

        // 第三层：宏观板块十年Beta、历史抗跌验证、通勤与学位
        { section: "【第三层：宏观板块视角】十年产业规划Beta、历史抗跌天花板验证、贝尔路通勤与学位", label: "📈 片区十年发展Beta & 天花板", render: u => u.macro.tenYearBeta },
        { label: "🛡️ 2021-2026历史抗跌性验证", render: u => `<span class="px-2 py-0.5 rounded badge-green font-bold">回撤约 ${u.macro.drawdownPct}%</span><div class="mt-1 text-slate-600">${u.macro.priceCeilingVerify}</div>` },
        { label: "🚇 太太至贝尔路站通勤", render: u => `<div class="font-bold text-pink-700">约 ${u.macro.commuteMins} 分钟 (距地铁${distanceMetric(u.macro.metroDist)})</div><div class="text-slate-500">${u.macro.commuteRoute}</div>` },
        { label: "🎓 对口小学 & 初中升学率", render: u => `<div>小：${u.macro.schoolPrimary}</div><div class="font-semibold text-indigo-900 mt-0.5">初：${u.macro.schoolMiddle}</div>` },
        { label: "👶 二胎家庭终极决策建议", render: u => u.twoKidsNote }
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
            <td class="py-2 px-3 font-semibold text-slate-700 bg-slate-50/70 w-44">${r.label}</td>
            ${selectedUnits.map(u => `<td class="py-2 px-3 text-slate-700 align-top">${r.render(u)}</td>`).join("")}
          </tr>
        `;
      });

      table.innerHTML = `
        <thead>
          <tr class="bg-slate-100 border-b border-slate-200">
            <th class="py-3 px-3 w-44 font-bold text-slate-800">三层穿透对比维度</th>
            ${selectedUnits.map(u => `
              <th class="py-3 px-3 min-w-[215px]">
                <div class="flex items-center justify-between gap-1">
                  <div>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${u.macro.zone} · ${u.macro.assetTier}</span>
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
    // 8. 初始化历史抗跌性与容积率对比图表 (Chart.js)
    // =========================================================================
    function initResilienceChart() {
      const ctx = byId("resilienceChart").getContext("2d");
      const labels = [
        "星河时代(大运)",
        "颐安都会(大运)",
        "鸿荣源尚峰(水径)",
        "信义嘉御山(坂田)",
        "佳兆业中央(坂田)",
        "京基御景(大运)",
        "大族云峰(坂田)",
        "佳兆业未来(大运)",
        "万科麓城三期(水径)",
        "中海康城(大运)",
        "诺德中央道(坂田)"
      ];
      const drawdowns = [19, 21, 22, 22, 24, 24, 25, 26, 27, 33, 35];

      Chart.defaults.font.family = getComputedStyle(root).fontFamily;
      Chart.defaults.color = '#63615B';
      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "2021历史高点→2026真实成交回撤幅度 (%，数值越小越抗跌)",
              data: drawdowns,
              backgroundColor: drawdowns.map(d =>
                d <= 22 ? "rgba(72, 115, 90, 0.88)" : d <= 27 ? "rgba(193, 95, 60, 0.84)" : "rgba(177, 138, 68, 0.88)"
              ),
              borderRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: ctx => ` 2021-2026周期回撤约 -${ctx.raw}%`
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 42,
              ticks: { callback: v => "-" + v + "%", font: { size: 10 } },
              title: { display: true, text: "周期回撤率 (%)", font: { size: 11 } }
            },
            x: {
              ticks: { autoSkip: false, minRotation: 38, maxRotation: 55, font: { size: 11 } }
            }
          }
        }
      });
    }

    // =========================================================================
    // 9. 事件监听绑定与初始化
    // =========================================================================
    function bindEvents() {
      // 6维权重滑块
      ["wQuiet", "wEdu", "wCommute", "wSpace", "wComm", "wAsset"].forEach(id => {
        byId(id).addEventListener("input", () => {
          renderTopRecommendations();
          renderUnitCards();
          renderCompareTable();
        });
      });

      byId("resetWeightsBtn").addEventListener("click", () => {
        byId("wQuiet").value = 20;
        byId("wEdu").value = 20;
        byId("wCommute").value = 20;
        byId("wSpace").value = 15;
        byId("wComm").value = 15;
        byId("wAsset").value = 10;
        renderTopRecommendations();
        renderUnitCards();
        renderCompareTable();
      });

      // 宏观8维筛选器
      [
        "macroZoneFilter", "macroPurityFilter", "macroVillageFilter", "macroDensityFilter",
        "macroTierFilter", "macroResilienceFilter", "macroParkingFilter", "macroRegFilter"
      ].forEach(id => {
        byId(id).addEventListener("change", renderMacroTable);
      });

      // 微观12维筛选器
      byId("filterProject").addEventListener("change", () => {
        updateBuildingOptions();
        renderUnitCards();
      });

      [
        "filterBuilding", "filterLayout", "filterStructure", "filterOrientation",
        "filterNoise", "filterPurity", "filterVillage", "filterDensity", "filterTier"
      ].forEach(id => {
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
        byId("filterPurity").value = "ALL";
        byId("filterVillage").value = "ALL";
        byId("filterDensity").value = "ALL";
        byId("filterTier").value = "ALL";
        byId("filterPriceBracket").value = "ALL";
        byId("filterCommute").value = "ALL";
        byId("filterMaxPriceSlider").value = 720;
        renderTopRecommendations();
        renderUnitCards();
      });

      byId("clearCompareBtn").addEventListener("click", () => {
        compareIds = ["bt-xinyi-5-89", "vanke-3-89", "horoy-6-89", "galaxy-6-89", "kk-3-97"];
        renderUnitCards();
        renderCompareTable();
      });
    }

    function init() {
      initResilienceChart();
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
