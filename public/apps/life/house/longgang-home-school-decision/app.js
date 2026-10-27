/* 附件原始宏观数据、户号数据和计算规则；仅隔离 DOM 与按钮事件。 */
(() => {
  const root = document.getElementById('lg-house-app');
  if (!root) return;
  const byId = id => root.querySelector('#' + id);
  const leadingMetric = value => value.match(/^(?:[^\d]*\s*)?\d+(?::\d+(?:\.\d+)?|梯\d+户)/u)?.[0] || value.split(" ")[0];
  const distanceMetric = value => value.match(/\d+(?:[~～-]\d+)?米/u)?.[0] || value;

    // =========================================================================
    // 1. 教育学区专项数据库：9大核心学区八维指标库 (SCHOOL_DISTRICTS)
    // =========================================================================
    const SCHOOL_DISTRICTS = {
      "SHENZHONG_LG": {
        name: "深中龙岗小学/龙外星河 + 深圳中学龙岗学校(初中部)",
        shortName: "深中龙岗学校",
        covers: "星河时代花园",
        systemType: "6+3 独立小初 (深中集团名校)",
        publicHighRate: 81.5,
        top4Rate: 7.5,
        top10Rate: 18.5,
        cutoffScore: "小一约96.5分 / 初一约98.2分（一类购房落户，需提前约2~2.5年）",
        peerGrade: "S级·纯正中产与别墅圈层生源",
        lockPolicy: "小一锁6年/初一锁3年（二胎同父母通用不限）",
        highlight: "龙岗公办初中天花板之一，四大率与十大率常年领跑，现房买入落户稳赶2029老大幼升小。"
      },
      "NNU_LG": {
        name: "万科麓城外国语小学/水径小学 + 南京师范大学附属龙岗学校",
        shortName: "南师大附属龙岗学校",
        covers: "万科麓城三期、鸿荣源尚峰",
        systemType: "6+3 独立小初 (+共享水径54班九年一贯新校)",
        publicHighRate: 80.8,
        top4Rate: 5.8,
        top10Rate: 15.2,
        cutoffScore: "麓城外国语小一约88分 / 南师大龙岗初一约82分（一类购房提前1年落户100%稳录）",
        peerGrade: "S级·麓城外国语生源极纯粹，南师大附校小班化精研",
        lockPolicy: "小一锁6年/初一锁3年（2026水径九年一贯新校投用后学位更充裕）",
        highlight: "公办普高率连续三年稳居78%~80.8%第一梯队！积分门槛比大运/坂田更友好，2029/2032双孩100%稳上。"
      },
      "SHIYAN_BT": {
        name: "深圳实验学校坂田校区（小学部 + 初中部）",
        shortName: "深实验坂田校区",
        covers: "诺德中央道",
        systemType: "九年一贯制 (小学毕业校内直升初中)",
        publicHighRate: 77.5,
        top4Rate: 6.2,
        top10Rate: 16.0,
        cutoffScore: "小一约92~95分 / 初一校内直升为主（外考需一类95分+，提前1.5~2年落户）",
        peerGrade: "A+级·坂田鸡娃风气最浓，华为家长深度参与家委会",
        lockPolicy: "九年一贯锁定（小一入学锁9年或分段锁，二胎同套房通用）",
        highlight: "四大名校深圳实验学校本部直管，九年一贯制免去小升初排位焦虑，四大/十大率极强。"
      },
      "HUAZHU_DY": {
        name: "华南师范大学附属龙岗大运学校（九年一贯制）",
        shortName: "华附大运学校",
        covers: "颐安·都会中央、深铁阅云境广场(+楼下规划72班新校)",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 77.5,
        top4Rate: 5.5,
        top10Rate: 14.8,
        cutoffScore: "小一约91.5分 / 初一直升为主（一类购房提前1~1.5年落户稳录）",
        peerGrade: "S级·纯粹改善大盘与高校教师子女，零城中村生源",
        lockPolicy: "九年一贯锁定（深铁阅云境另有楼下72班九年一贯制公办新校双保险）",
        highlight: "颐安家门口目送式九年一贯名校，生源纯粹度与硬件设施全大运一流。"
      },
      "CUHK_ZHIXIN": {
        name: "香港中文大学(深圳)附属知新学校 / 道远学校（九年一贯制）",
        shortName: "港中大附属知新/道远",
        covers: "佳兆业未来花园、京基御景中央、中海康城花园、泰瑞府",
        systemType: "九年一贯制 (高校附属教育集团直升)",
        publicHighRate: 75.0,
        top4Rate: 5.0,
        top10Rate: 14.2,
        cutoffScore: "知新小一约90.5分(提前1~1.5年落户) / 道远小一约78分(一类购房即稳录)",
        peerGrade: "A+级·大运科教城纯净生源，知新与道远共享港中深教研资源",
        lockPolicy: "九年一贯锁定（泰瑞府一路之隔即道远学校，目送式入学）",
        highlight: "背靠港中大(深圳)学术资源，近年中考稳居龙岗前十，九年一贯直升省心。"
      },
      "KEWAI_BT": {
        name: "科技城外国语学校（小学部 + 初中部）",
        shortName: "科技城外国语学校",
        covers: "信义嘉御山",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 74.5,
        top4Rate: 4.9,
        top10Rate: 13.8,
        cutoffScore: "小一约91.0分（一类购房+坂田户籍，提前1~1.5年落户稳录）",
        peerGrade: "S级·信义嘉御山百万方纯商品房大社区生源占主体",
        lockPolicy: "九年一贯锁定（学校就在嘉御山社区旁，真正下楼目送式）",
        highlight: "坂田本土口碑最稳的九年一贯制公办强校，生源几乎全来自嘉御山业主子女。"
      },
      "XIANYI_BGL": {
        name: "贤义外国语学校(九年一贯制) + 春蕾小学/百合外国语生态圈",
        shortName: "贤义外国语(+百外生态)",
        covers: "信义金御半山、信义金御半山·珑门、百合世纪广场、万科红",
        systemType: "公办九年一贯制直升 + 顶尖民办(百外/春蕾)双轨赋能",
        publicHighRate: 73.5,
        top4Rate: 4.8,
        top10Rate: 13.5,
        cutoffScore: "贤义小一约84~89分 / 初一直升+积分（一类购房提前1年落户100%稳录）",
        peerGrade: "S级·百鸽笼纯现代商圈大盘生源，全深圳“考百外”培优氛围最浓片区",
        lockPolicy: "九年一贯锁定（万科红部分期数共享信义实验小学）",
        highlight: "进可攻（下楼即春蕾小学+深圳第一民办初中百合外国语，四大率超35%）、退可守（公办贤义外国语九年一贯制公办率73.5%稳保底）！"
      },
      "SHENDA_BT": {
        name: "深圳大学附属坂田学校(九年一贯) / 广东实验中学深圳学校(共享)",
        shortName: "深大附属坂田学校",
        covers: "佳兆业中央广场、大族云峰",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 66.5,
        top4Rate: 3.6,
        top10Rate: 10.8,
        cutoffScore: "2026小一录取线91.05分(迁户时间2025.05，即提前1年落户100%稳录)",
        peerGrade: "A级·华为研发家庭生源比例极高，理科思维与家风优良",
        lockPolicy: "九年一贯锁定（学校紧邻佳兆业与大族云峰，接送零距离）",
        highlight: "公办普高率66.5%稳居全市中上（高出全市均值13个百分点），且就在家门口无需过马路。"
      },
      "SHIYALING_NW": {
        name: "石芽岭学校(九年一贯制) + 规划54班深大附中南湾学校",
        shortName: "石芽岭学校(+深大附新校)",
        covers: "健康花城、特发臻华府",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 61.5,
        top4Rate: 2.8,
        top10Rate: 8.5,
        cutoffScore: "小一约72~78分（学位充裕，一类购房落户当年即可100%稳录）",
        peerGrade: "A-级·石芽岭公园周边商品房生源为主，特发旁新增54班名校集团新校",
        lockPolicy: "九年一贯锁定（健康花城步行至石芽岭学校仅300米）",
        highlight: "公办普高率约61.5%达标中上水平，积分门槛最宽松，且特发旁54班深大附中南湾新校带来强劲增量预期。"
      }
    };

    // =========================================================================
    // 2. 宏观与中观数据库：20个小区整体工程、圈层、民房界面、学位映射与抗跌验证
    // =========================================================================
    const COMMUNITIES_MACRO = {
      // ---------------- A. 坂田片区 (4盘) ----------------
      "佳兆业中央广场": {
        zone: "坂田片区",
        isNewBuild: false,
        phaseSummary: "共3期住宅 (主力三期8栋围合)",
        buildYear: "2014-2016年",
        regGen: "GEN1",
        regLabel: "第1代·传统限拓规",
        usableAvg: "81%~83%",
        plotRatio: 4.8,
        densityGrade: "MID",
        densityLabel: "中密围合 (容积率4.8)",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 55~90米",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (充裕)",
        purityGrade: "S",
        subsidizedRatio: "0% (三期纯商品房)",
        purityLabel: "S级·纯商品房大城",
        assetTier: "品质改善",
        residentProfile: "华为总部研发工程师、中层主管及科技企业白领家庭为主，高学历高收入圈层",
        villageGrade: "B",
        urbanInterface: "B级·半现代半旧村交织（社区内豪华园林，外围东北侧仍有岗头/雪象民房待旧改）",
        tenYearBeta: "背靠华为全球总部20万科创购买力，10号线双地铁口+百万方旧改兑现中；三房天花板520~580万。",
        resilienceGrade: "MID",
        drawdownPct: 24,
        priceCeilingVerify: "2021峰值6.3万→2026企稳于4.8万/㎡(回撤24%)；华为自住承接力强。",
        propertyInfo: "佳兆业物业 · 3.8元/㎡",
        metroStation: "10号线岗头站/华为站",
        metroDist: "约 300米 (步行5分钟)",
        commuteMins: 10,
        commuteRoute: "10号线岗头/华为站 → 1~2站0换乘直达贝尔路站",
        schoolKey: "SHENDA_BT"
      },
      "信义嘉御山": {
        zone: "坂田片区",
        isNewBuild: false,
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
        residentProfile: "华为资深员工、福田/北站外溢改善中产、重视教育的二胎家庭",
        villageGrade: "B",
        urbanInterface: "B级·内优外杂（内部百米楼距皇家园林极纯粹，出小区外围仍有坂田老民房街区）",
        tenYearBeta: "紧邻五和国际交通枢纽（深大/深惠城际交汇）+ 坂雪岗科技城南扩；三房天花板550~620万。",
        resilienceGrade: "HIGH",
        drawdownPct: 22,
        priceCeilingVerify: "五期89㎡从2021峰值6.8万→2026稳定在5.3万/㎡(回撤仅22%)，坂田抗跌硬通货。",
        propertyInfo: "信义物业 · 3.6元/㎡",
        metroStation: "10号线坂田北站 / 5号线五和站",
        metroDist: "约 450米 (步行6分钟)",
        commuteMins: 14,
        commuteRoute: "10号线坂田北站 → 2站0换乘直达贝尔路站",
        schoolKey: "KEWAI_BT"
      },
      "诺德中央道": {
        zone: "坂田片区",
        isNewBuild: false,
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
        subsidizedRatio: "约10% (一期少量配建)",
        purityLabel: "A级·二期为纯正商品房",
        assetTier: "主流刚改",
        residentProfile: "冲着“深圳实验学校坂田部”买入的鸡娃中产家庭、坂田/福田双职工",
        villageGrade: "B",
        urbanInterface: "B级·紧邻城中村（东南侧紧贴光雅园村农民房，低层外向视野受影响）",
        tenYearBeta: "五和大道城市更新带+深实验名校集团加持；总价天花板约530万。",
        resilienceGrade: "LOW",
        drawdownPct: 35,
        priceCeilingVerify: "2021年炒至7.5万/㎡，2026回归至4.9万/㎡(回撤35%)，学区溢价泡沫已挤干。",
        propertyInfo: "诺德物业 · 3.8元/㎡",
        metroStation: "10号线光雅园站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 17,
        commuteRoute: "10号线光雅园站 → 3站0换乘直达贝尔路站",
        schoolKey: "SHIYAN_BT"
      },
      "大族云峰": {
        zone: "坂田片区",
        isNewBuild: false,
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
        buildingSpacing: "约 60~95米",
        parkingRatio: 1.08,
        parkingLabel: "1:1.08 (充裕)",
        purityGrade: "A",
        subsidizedRatio: "约12% (独立楼栋配建)",
        purityLabel: "A级·次新商品房为主",
        assetTier: "品质改善",
        residentProfile: "偏好次新外立面与大园林的年轻科技新贵、华为及北站商务区改善客群",
        villageGrade: "A",
        urbanInterface: "A级·现代综合体界面（自带4.5万㎡商业与学校，整体界面崭新整洁）",
        tenYearBeta: "坂田南连接北站超核的门户位置，2020年次新折旧慢。",
        resilienceGrade: "MID",
        drawdownPct: 25,
        priceCeilingVerify: "2021峰值6.6万→2026约4.95万/㎡(回撤25%)，次新阵营成交活跃。",
        propertyInfo: "大族物业 · 3.9元/㎡",
        metroStation: "10号线光雅园站 / 坂田北站",
        metroDist: "约 600米 (步行8分钟)",
        commuteMins: 16,
        commuteRoute: "10号线光雅园/坂田北站 → 2~3站0换乘直达贝尔路",
        schoolKey: "SHENDA_BT"
      },

      // ---------------- B. 水径 / 石芽岭片区 (4盘：含新增健康花城) ----------------
      "万科麓城三期": {
        zone: "水径/石芽岭",
        isNewBuild: false,
        phaseSummary: "共4期大城 (三期6栋7单元)",
        buildYear: "2016-2017年",
        regGen: "GEN1",
        regLabel: "第1代·万科精装规",
        usableAvg: "81%~82%",
        plotRatio: 4.2,
        densityGrade: "MID",
        densityLabel: "中低密依山 (容积率4.2)",
        totalFloors: "32~34层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 50~85米",
        parkingRatio: 0.86,
        parkingLabel: "⚠️ 1:0.86 (偏紧)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房)",
        purityLabel: "S级·100%纯商品房标杆大城",
        assetTier: "主流刚改",
        residentProfile: "罗湖/福田/坂田通勤的教师、医生、公务员、跨境电商及科技白领，生源极纯粹",
        villageGrade: "A",
        urbanInterface: "A级·山体公园隔离界面（北靠银湖山郊野公园及体育公园，隔绝下水径民房）",
        tenYearBeta: "万科物业+南师大附校80.8%普高率稳坐片区龙头；水径三房总价天花板约460~480万。",
        resilienceGrade: "MID",
        drawdownPct: 27,
        priceCeilingVerify: "2021峰值6.5万→2026回调至4.7~4.9万/㎡(415~445万，回撤27%)，底部坚实。",
        propertyInfo: "万科物业 · 3.98元/㎡",
        metroStation: "5号线上水径站",
        metroDist: "约 400米 (步行6分钟)",
        commuteMins: 23,
        commuteRoute: "5号线上水径 → 1站至五和转10号线 → 2站至贝尔路",
        schoolKey: "NNU_LG"
      },
      "鸿荣源尚峰": {
        zone: "水径/石芽岭",
        isNewBuild: false,
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
        buildingSpacing: "约 65~100米",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (充裕)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房)",
        purityLabel: "S级·100%纯商品房豪宅园林",
        assetTier: "主流刚改",
        residentProfile: "看重鸿荣源建筑品质与园林的改善自住家庭及罗湖/福田/坂田白领",
        villageGrade: "A",
        urbanInterface: "A级·背山半隔离界面（南靠三联山体公园极幽静，台地围合隔绝外部村落）",
        tenYearBeta: "共享南师大龙岗学区+新建54班水径九年一贯制学校，车位与园林稳居水径第一。",
        resilienceGrade: "HIGH",
        drawdownPct: 22,
        priceCeilingVerify: "2021峰值5.7万→2026稳定在4.4~4.7万/㎡(回撤仅22%)，抗跌表现极佳。",
        propertyInfo: "鸿荣源物业 · 3.9元/㎡",
        metroStation: "5号线上水径站 / 下水径站",
        metroDist: "约 500米 (步行7分钟)",
        commuteMins: 24,
        commuteRoute: "5号线上水径 → 五和转10号线 → 贝尔路站",
        schoolKey: "NNU_LG"
      },
      "健康花城": {
        zone: "水径/石芽岭",
        isNewBuild: false,
        phaseSummary: "共1期11栋围合大花园",
        buildYear: "2014-2015年",
        regGen: "GEN0",
        regLabel: "🌟 第0/1代·高实用率规",
        usableAvg: "83%~85%",
        plotRatio: 3.8,
        densityGrade: "LOW",
        densityLabel: "🌟 公园低密社区 (容积率3.8!)",
        totalFloors: "28~32层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 60~95米 (中心泳池大园林)",
        parkingRatio: 0.95,
        parkingLabel: "1:0.95 (基本平衡)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房)",
        purityLabel: "S级·100%纯商品房公园社区",
        assetTier: "主流刚改",
        residentProfile: "罗湖/福田/坂田务实自住家庭、退休长辈协助带娃的二胎家庭，居住氛围极浓",
        villageGrade: "A",
        urbanInterface: "A级·78万㎡石芽岭生态公园北门户（南侧直面石芽岭山体公园与体育中心，无民房遮挡）",
        tenYearBeta: "坐拥14号快线石芽岭站+78万㎡石芽岭公园+石芽岭学校(步行300米)+旁侧54班深大附中南湾新校，345万起买低密纯商品房三房两卫，性价比极高！",
        resilienceGrade: "HIGH",
        drawdownPct: 23,
        priceCeilingVerify: "2021峰值约5.2万→2026稳定在3.9~4.2万/㎡(回撤约23%)，因总价门槛低(310~375万)且低密宜居，换手极稳。",
        propertyInfo: "金地/自有物业 · 3.2元/㎡",
        metroStation: "14号线石芽岭站 / 5号线上水径站",
        metroDist: "约 450米 (步行6分钟达石芽岭站)",
        commuteMins: 28,
        commuteRoute: "步行至石芽岭站(或骑行至上水径5号线) → 五和转10号线 → 贝尔路(约26~30分钟)",
        schoolKey: "SHIYALING_NW"
      },
      "特发臻华府": {
        zone: "水径/石芽岭",
        isNewBuild: true,
        phaseSummary: "共1期10栋 (商品房6栋+回迁/保障房)",
        buildYear: "2028.06交付(新房)",
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
        subsidizedRatio: "约42% (含回迁房与保障房)",
        purityLabel: "B级·商品房与回迁/保障混居",
        assetTier: "主流刚改",
        residentProfile: "看重98%超高得房率与14号快线的年轻刚改家庭 + 回迁户 + 保障房住户",
        villageGrade: "B",
        urbanInterface: "B级·工业区旧改过渡界面（南近石芽岭公园，北近广深铁路，周边厂房待更新）",
        tenYearBeta: "14号快线石芽岭站+旁侧规划54班深大附中南湾学校；但受限于7.1容积率与0.73车位比，未来二手溢价受限。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "新盘折后约4.1万/㎡，按97%得房率折算套内单价仅相当于老盘3.4万/㎡，具备新规折算安全垫。",
        propertyInfo: "特发服务 · 约4.2元/㎡",
        metroStation: "14号线快线石芽岭站G口",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 33,
        commuteRoute: "14号线石芽岭→布吉转5→五和转10→贝尔路",
        schoolKey: "SHIYALING_NW"
      },

      // ---------------- C. 布吉百鸽笼片区 (新增4盘：万象汇商圈·贤义外国语+百外生态) ----------------
      "信义金御半山": {
        zone: "布吉百鸽笼",
        isNewBuild: false,
        phaseSummary: "一至三期百万方半山豪宅大城",
        buildYear: "2013-2016年",
        regGen: "GEN0",
        regLabel: "🌟 第0/1代·高赠送规",
        usableAvg: "84%~87%",
        plotRatio: 4.0,
        densityGrade: "MID",
        densityLabel: "中低密半山大城 (容积率4.0)",
        totalFloors: "31~33层",
        elevatorRatio: "2梯4户 / 2梯5户",
        buildingSpacing: "约 65~110米 (半山双泳池皇家园林)",
        parkingRatio: 1.02,
        parkingLabel: "1:1.02 (达标)",
        purityGrade: "S",
        subsidizedRatio: "0% (一至三期100%纯商品房)",
        purityLabel: "S级·100%纯商品房半山豪宅大盘",
        assetTier: "品质改善",
        residentProfile: "罗湖/福田企业主、医生、珠宝黄金商圈高净值家庭及冲刺百合外国语的陪读中产",
        villageGrade: "S",
        urbanInterface: "S级·零民房万象汇都会半山界面（背靠求水山/荔山生态公园，下楼即32万㎡华润万象汇，无农民房）",
        tenYearBeta: "布吉/罗湖交界最高端居住综合体（万象汇+贤义外国语+百外名校圈+百鸽笼地铁上盖），地位无可替代；三房天花板520~600万。",
        resilienceGrade: "HIGH",
        drawdownPct: 23,
        priceCeilingVerify: "三期89㎡从2021峰值约6.9万→2026稳定在5.2~5.5万/㎡(回撤仅23%)，百鸽笼绝对龙头。",
        propertyInfo: "信义物业 · 3.6元/㎡",
        metroStation: "5号线百鸽笼站 (万象汇直通)",
        metroDist: "约 200~450米 (步行3~6分钟)",
        commuteMins: 26,
        commuteRoute: "5号线百鸽笼站 → 4站直达五和转10号线 → 2站至贝尔路站(约26分钟)",
        schoolKey: "XIANYI_BGL"
      },
      "信义金御半山·珑门": {
        zone: "布吉百鸽笼",
        isNewBuild: true,
        phaseSummary: "金御半山四期/珑门 (共3栋现房新盘)",
        buildYear: "2025.11交付(全新现房)",
        regGen: "GEN2",
        regLabel: "✨ 第2代·新规精装现房",
        usableAvg: "86%~88%",
        plotRatio: 5.2,
        densityGrade: "HIGH",
        densityLabel: "中高密次新 (容积率5.2)",
        totalFloors: "42~45层",
        elevatorRatio: "3梯5户 / 3梯6户",
        buildingSpacing: "约 50~75米",
        parkingRatio: 1.05,
        parkingLabel: "1:1.05 (充裕)",
        purityGrade: "S",
        subsidizedRatio: "0% (纯商品房现房组团)",
        purityLabel: "S级·纯商品房全新现房",
        assetTier: "品质改善",
        residentProfile: "既想要百鸽笼万象汇+贤义/百外学区、又嫌弃二手房楼龄老的罗湖/坂田年轻改善家庭",
        villageGrade: "S",
        urbanInterface: "S级·万象汇商圈+半山公园界面（与金御半山大社区连片，周边现代繁华）",
        tenYearBeta: "2025年底全新竣工现房，折后均价约5.1万/㎡，比旁边10年楼龄的金御半山三期二手房还便宜，享受全新精装与次新保值周期！",
        resilienceGrade: "HIGH",
        drawdownPct: 14,
        priceCeilingVerify: "开盘备案7万/㎡，2025-2026现房折后约5.0~5.2万/㎡（86㎡一卫约415万、95㎡两卫约465万），一二手倒挂安全垫极厚。",
        propertyInfo: "信义高定物业 · 4.2元/㎡",
        metroStation: "5号线百鸽笼站",
        metroDist: "约 350米 (步行5分钟)",
        commuteMins: 26,
        commuteRoute: "5号线百鸽笼站 → 4站至五和转10号线 → 贝尔路站(约26分钟)",
        schoolKey: "XIANYI_BGL"
      },
      "百合世纪广场": {
        zone: "布吉百鸽笼",
        isNewBuild: true,
        phaseSummary: "共2期 (百外教育系开发准现房/现房)",
        buildYear: "2025-2026交付(新房)",
        regGen: "GEN2",
        regLabel: "✨ 第2代·百外系新盘",
        usableAvg: "85%~87%",
        plotRatio: 5.6,
        densityGrade: "HIGH",
        densityLabel: "都市综合体密 (容积率5.6)",
        totalFloors: "43~46层",
        elevatorRatio: "3梯5户 / 3梯6户",
        buildingSpacing: "约 50~80米 (中央园林)",
        parkingRatio: 1.08,
        parkingLabel: "1:1.08 (充裕)",
        purityGrade: "A",
        subsidizedRatio: "约20% (含部分回迁房源，商品房独立栋)",
        purityLabel: "A级·百外集团开发综合体",
        assetTier: "品质改善",
        residentProfile: "冲着百合控股(百合外国语/春蕾小学母公司)教育基因与万象汇商圈买入的改善及鸡娃家庭",
        villageGrade: "S",
        urbanInterface: "S级·百鸽笼核心商圈界面（紧邻万象汇、百外世纪小学、信义荔山公园，无民房）",
        tenYearBeta: "由深圳民办第一名校“百合外国语”母公司百合集团倾力打造，紧邻百外世纪小学，公办对口贤义外国语/信义实验，教育光环极强。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "二期折后约4.7~5.2万/㎡（98㎡三房两卫约461万起），在百鸽笼核心区新房市场极具号召力。",
        propertyInfo: "百合物业 · 4.3元/㎡",
        metroStation: "5号线百鸽笼站",
        metroDist: "约 300米 (步行4分钟)",
        commuteMins: 26,
        commuteRoute: "5号线百鸽笼站 → 五和转10号线 → 贝尔路站(约26分钟)",
        schoolKey: "XIANYI_BGL"
      },
      "万科红": {
        zone: "布吉百鸽笼",
        isNewBuild: false,
        phaseSummary: "共4期成熟大盘 (主力三期花园大社区)",
        buildYear: "2011-2014年",
        regGen: "GEN0",
        regLabel: "第0代·高赠送实用规",
        usableAvg: "84%~86%",
        plotRatio: 4.3,
        densityGrade: "MID",
        densityLabel: "中密成熟社区 (容积率4.3)",
        totalFloors: "30~32层",
        elevatorRatio: "2梯4户 / 2梯6户",
        buildingSpacing: "约 50~80米",
        parkingRatio: 0.88,
        parkingLabel: "⚠️ 1:0.88 (三期较好，一二期略紧)",
        purityGrade: "S",
        subsidizedRatio: "0% (纯商品房社区)",
        purityLabel: "S级·万科纯商品房成熟大盘",
        assetTier: "主流刚改",
        residentProfile: "罗湖/福田/坂田年轻首置与刚改白领家庭，看重万科物业、楼下商业与百鸽笼地铁商圈",
        villageGrade: "A",
        urbanInterface: "A级·成熟都会街区界面（楼下自带万科红生活广场盒马鲜生，步行400米达万象汇）",
        tenYearBeta: "百鸽笼330~410万级性价比最高的万科物业大盘，共享万象汇商圈与贤义外国语/百外教育圈，流通性极好。",
        resilienceGrade: "MID",
        drawdownPct: 26,
        priceCeilingVerify: "2021峰值约5.8万→2026回调至4.2~4.5万/㎡(回撤26%)；三期89㎡三房两卫380~410万成交极快。",
        propertyInfo: "万科物业 · 3.2元/㎡",
        metroStation: "5号线百鸽笼站",
        metroDist: "约 350~500米 (步行5分钟)",
        commuteMins: 27,
        commuteRoute: "5号线百鸽笼站 → 五和转10号线 → 贝尔路站(约27分钟)",
        schoolKey: "XIANYI_BGL"
      },

      // ---------------- D. 龙岗大运片区 (8盘) ----------------
      "佳兆业未来花园": {
        zone: "龙岗大运",
        isNewBuild: false,
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
        subsidizedRatio: "0% (纯商品房)",
        purityLabel: "S级·100%纯商品房次新社区",
        assetTier: "主流刚改",
        residentProfile: "大运高校教职工、龙岗中心城体制内人员、东部年轻改善家庭",
        villageGrade: "S",
        urbanInterface: "S级·零民房大运新城界面（紧邻大运中心体育场与大运天地商圈，无农民房）",
        tenYearBeta: "享大运天地华润商圈与港中深附属知新名校，城市界面稳居东部第一梯队。",
        resilienceGrade: "MID",
        drawdownPct: 26,
        priceCeilingVerify: "2021峰值5.6万→2026约4.15万/㎡(回撤26%)；365~400万买次新三房两卫+知新学位。",
        propertyInfo: "佳兆业物业 · 3.9元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 500米 (步行6分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolKey: "CUHK_ZHIXIN"
      },
      "京基御景中央": {
        zone: "龙岗大运",
        isNewBuild: false,
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
        residentProfile: "高校学者、医生、公务员、大运科教城研发人员及改善二胎家庭",
        villageGrade: "S",
        urbanInterface: "S级·零民房纯净新城界面（位于国际大学园与体育中心腹地，无城中村）",
        tenYearBeta: "3.2超低容积率+2梯4户+纯商品房属于不可再生稀缺孤品，长线保值力极强。",
        resilienceGrade: "MID",
        drawdownPct: 24,
        priceCeilingVerify: "2021峰值5.3万→2026约4.0万/㎡(回撤24%)；97㎡双龙抱珠户型承接力极强。",
        propertyInfo: "京基物业 · 3.95元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 650米 (步行8分钟)",
        commuteMins: 53,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolKey: "CUHK_ZHIXIN"
      },
      "颐安·都会中央": {
        zone: "龙岗大运",
        isNewBuild: false,
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
        subsidizedRatio: "0% (100%纯商品房)",
        purityLabel: "S级·100%纯商品房百万方旗舰",
        assetTier: "品质改善",
        residentProfile: "龙岗改善型中产、企业高管、华附大运及港中深教职工",
        villageGrade: "S",
        urbanInterface: "S级·零民房都会核心界面（与大运枢纽、COCO Park、华附大运连成现代摩天界面）",
        tenYearBeta: "大运枢纽四轨交汇(含深大城际)+10万㎡商业+华附大运名校，大运确定性最高标杆。",
        resilienceGrade: "HIGH",
        drawdownPct: 21,
        priceCeilingVerify: "🏆 2021峰值5.7万→2026稳定在4.5万/㎡(回撤仅21%)，大运抗跌标杆。",
        propertyInfo: "颐安物业 · 3.9元/㎡",
        metroStation: "大运枢纽站 (3/14/16/深大城际)",
        metroDist: "约 450米 (步行6分钟)",
        commuteMins: 44,
        commuteRoute: "大运枢纽(14号快线2站到布吉)→转5→五和转10",
        schoolKey: "HUAZHU_DY"
      },
      "星河时代花园": {
        zone: "龙岗大运",
        isNewBuild: false,
        phaseSummary: "高层区8栋 + 联排别墅区",
        buildYear: "2012-2013年",
        regGen: "GEN0",
        regLabel: "🌟 第0代·高偷面积规",
        usableAvg: "85%~88%",
        plotRatio: 2.6,
        densityGrade: "LOW",
        densityLabel: "🏆 别墅级超低密 (容积率2.6!)",
        totalFloors: "31~32层",
        elevatorRatio: "2梯4户",
        buildingSpacing: "约 70~150米",
        parkingRatio: 1.25,
        parkingLabel: "🏆 1:1.25 (豪宅配比)",
        purityGrade: "S",
        subsidizedRatio: "0% (100%纯商品房+别墅)",
        purityLabel: "S级·100%纯商品房+别墅社区",
        assetTier: "品质改善",
        residentProfile: "别墅区为企业主，高层区为资深中产与深中龙岗陪读高净值家庭",
        villageGrade: "S",
        urbanInterface: "S级·零民房山姆商圈界面（下楼即星河COCO Park与山姆会员店，完全无民房）",
        tenYearBeta: "占据“深中龙岗第一名校+山姆商圈+2.6超低容积率+大运枢纽”四大核心锚点。",
        resilienceGrade: "HIGH",
        drawdownPct: 19,
        priceCeilingVerify: "🏆 全表二手抗跌总冠军！2021峰值6.3万→2026稳定在5.1万/㎡(回撤仅19%)。",
        propertyInfo: "星河智善生活 · 3.5元/㎡",
        metroStation: "大运枢纽站 / 3号线爱联站",
        metroDist: "约 600米 (步行8分钟)",
        commuteMins: 45,
        commuteRoute: "大运站(14号快线)→布吉转5→五和转10→贝尔路",
        schoolKey: "SHENZHONG_LG"
      },
      "中海康城花园": {
        zone: "龙岗大运",
        isNewBuild: false,
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
        residentProfile: "看重港中大知新学位的年轻首置刚需家庭、本地上班族及带娃老人",
        villageGrade: "A",
        urbanInterface: "A级·南优北杂界面（南靠大运体育馆与公园，北靠盐龙大道）",
        tenYearBeta: "大运200~260万级低门槛港中大知新学区大盘，刚需接盘底座极大。",
        resilienceGrade: "LOW",
        drawdownPct: 33,
        priceCeilingVerify: "2021峰值4.3万→2026回调至2.85万/㎡(回撤33%)，目前240万买三房两卫已见底企稳。",
        propertyInfo: "中海物业 · 2.95元/㎡",
        metroStation: "16号线龙城公园站 / 黄阁坑站",
        metroDist: "约 550米 (步行7分钟)",
        commuteMins: 56,
        commuteRoute: "16号线→大运转14→布吉转5→五和转10",
        schoolKey: "CUHK_ZHIXIN"
      },
      "中海大运玖章": {
        zone: "龙岗大运",
        isNewBuild: true,
        phaseSummary: "共1期5栋614户高奢大盘",
        buildYear: "2027.12交付(新房)",
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
        purityLabel: "🏆 S级·100%纯商品房高定改善",
        assetTier: "品质改善",
        residentProfile: "企业主、科技高管、大学教授、龙岗终极改善换房家庭(126㎡/555万起)",
        villageGrade: "S",
        urbanInterface: "S级·零民房顶配新城界面（紧邻大运天地商圈、大运公园与龙外本部）",
        tenYearBeta: "大运绝版纯商品房宅地+2024二批新规+1:1.73车位比，定义龙岗未来10年豪宅新天花板。",
        resilienceGrade: "HIGH",
        drawdownPct: 10,
        priceCeilingVerify: "2025.12开盘新盘逆市热销，验证顶端改善客群对纯粹好房的支付力。",
        propertyInfo: "中海高定物业 · 5.98元/㎡",
        metroStation: "16号线大运中心站 / 文曲站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolKey: "CUHK_ZHIXIN"
      },
      "深铁阅云境广场": {
        zone: "龙岗大运",
        isNewBuild: true,
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
        subsidizedRatio: "约22% (1栋独立人才房)",
        purityLabel: "A级·国企TOD社区(独立成栋)",
        assetTier: "主流刚改",
        residentProfile: "依赖14号快线/深大城际跨区通勤的年轻中产家庭、深铁及国企员工",
        villageGrade: "S",
        urbanInterface: "S级·零民房TOD枢纽界面（大运综合交通枢纽上盖，旁侧规划72班新校）",
        tenYearBeta: "大运四轨交汇枢纽(3/14/16/深大城际)+自带商业与72班九年一贯制新校。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "折后336~410万买大运枢纽精装98~102㎡三房两卫，比周边次新二手还便宜。",
        propertyInfo: "深铁物业 · 约4.5元/㎡",
        metroStation: "大运综合交通枢纽 (3/14/16/深大城际)",
        metroDist: "🏆 约 150米 (下楼直通枢纽!)",
        commuteMins: 42,
        commuteRoute: "下楼直通14号快线(2站到布吉)→转5→五和转10",
        schoolKey: "HUAZHU_DY"
      },
      "泰瑞府": {
        zone: "龙岗大运",
        isNewBuild: true,
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
        subsidizedRatio: "约38% (含保障房约553套)",
        purityLabel: "B级·含约38%配建保障房",
        assetTier: "主流刚改",
        residentProfile: "看重国企现房交付、港中大道远学校目送式教育与大运中心配套的务实刚改家庭",
        villageGrade: "S",
        urbanInterface: "S级·零民房大运科教城界面（一路之隔即港中大附属道远学校，无农民房）",
        tenYearBeta: "享大运中心配套与高校附属教育红利；但因含38%保障房且3梯6户，二手上限略受制约。",
        resilienceGrade: "HIGH",
        drawdownPct: 16,
        priceCeilingVerify: "深业国企现房折后299万买89㎡一卫、337万买99㎡大横厅两卫，自住性价比高。",
        propertyInfo: "深业物业 · 约4.3元/㎡",
        metroStation: "16号线大运中心站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        schoolKey: "CUHK_ZHIXIN"
      }
    };

    // =========================================================================
    // 3. 微观数据库：20盘具体楼栋、单元、户号、厅型格局、距主干道米数、噪音源、得房率
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
        twoKidsNote: "华为研发圈层核心盘！三期正中央南北通透楼王，太太10号线1~2站（或骑车8分钟）直达贝尔路站，对口深大附坂田九年一贯制(2026录取线91.05分，提前1年落户稳录)。",
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
        twoKidsNote: "比三期楼王省40万，紧邻深大附坂田学校与10号线地铁口，太太通勤仅10分钟。",
        scores: { quiet: 80, edu: 85, commute: 98, space: 78, comm: 88, asset: 87 }
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
        twoKidsNote: "坂田改善与抗跌王牌(回撤仅22%)！100%纯商品房+自带科技城外国语学校(九年一贯直升，公办率74.5%)+10号线坂田北站2站直达贝尔路站。",
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
        twoKidsNote: "450万级入主信义嘉御山纯商品房内园+科技城外国语九年一贯制+14分钟贝尔路通勤。",
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
        twoKidsNote: "对口四大名校直管【深实验坂田校区】(九年一贯直升，公办率77.5%、十大率16%)+10号线3站到贝尔路；前期泡沫已挤干。",
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
        twoKidsNote: "坂田界面最干净的次新大盘(自带商业MALL)，96㎡实得78.7㎡，家门口深大附坂田九年一贯制，通勤16分钟。",
        scores: { quiet: 94, edu: 85, commute: 95, space: 92, comm: 93, asset: 90 }
      },

      // ==================== B. 水径 / 石芽岭片区 (4盘：含新增健康花城) ====================
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
        twoKidsNote: "100%纯商品房+山体公园隔绝民房！步行350m达麓城外国语小学+对口南师大龙岗初中(公办率80.8%、十大率15.2%)，一类购房稳录，去贝尔路仅23分钟！",
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
        twoKidsNote: "380万级上车万科纯商品房+麓城外国语+南师大龙岗学校(公办率80.8%)，唯单卫需错峰。",
        scores: { quiet: 76, edu: 95, commute: 88, space: 74, comm: 90, asset: 87 }
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
        twoKidsNote: "水径抗跌王(回撤仅22%)！100%纯商品房+车位比1:1.05+南师大附校学区(公办率80.8%)，去贝尔路仅24分钟。",
        scores: { quiet: 97, edu: 92, commute: 87, space: 89, comm: 95, asset: 91 }
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
        scores: { quiet: 91, edu: 92, commute: 87, space: 77, comm: 93, asset: 90 }
      },
      // 新增：石芽岭·健康花城
      {
        id: "jkhc-6-89",
        project: "健康花城",
        phase: "一期围合",
        building: "6栋 / 7栋 / 8栋 (中央园景楼王)",
        unitCode: "01/02户 (南向看泳池与石芽岭公园)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 85,
        usableArea: 75.6,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距布龙路210米+",
        roadDistMeters: "位于小区南侧及中央腹地，距北侧布龙路主干道超210米，南向直望石芽岭山体公园",
        specialNoise: "无铁路/无高架，背靠78万㎡石芽岭生态公园鲜氧环绕（约41~44dB）",
        minPrice: 345,
        maxPrice: 380,
        priceRange: "345~380 万",
        twoKidsNote: "石芽岭隐藏宝藏盘！容积率仅3.8低密纯商品房(0保障房)，仅350~375万即可买到正南不临街三房两卫楼王！步行300米即达九年一贯制石芽岭学校，下楼即石芽岭公园带二宝遛娃。",
        scores: { quiet: 95, edu: 82, commute: 82, space: 88, comm: 93, asset: 89 }
      },
      {
        id: "jkhc-3-86",
        project: "健康花城",
        phase: "一期围合",
        building: "3栋 / 5栋 / 9栋 (内园侧)",
        unitCode: "03/04户 (东南向看花园)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 86,
        usableRateNum: 84,
        usableArea: 72.2,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距布龙路150米",
        roadDistMeters: "位于社区中圈，由北侧1/2/11栋阻挡布龙路车流，阳台朝内园",
        specialNoise: "无铁路/高架，社区内部花园安静宜居（约43~47dB）",
        minPrice: 308,
        maxPrice: 338,
        priceRange: "308~338 万",
        twoKidsNote: "310~335万极低门槛拿下3.8低密纯商品房+石芽岭公园+14号线石芽岭站+九年一贯制学位。",
        scores: { quiet: 90, edu: 82, commute: 82, space: 78, comm: 91, asset: 88 }
      },
      {
        id: "jkhc-1-main",
        project: "健康花城",
        phase: "一期外围",
        building: "1栋 / 2栋 / 11栋 (北排临路)",
        unitCode: "北侧近布龙路单元",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 86,
        usableRateNum: 83,
        usableArea: 71.4,
        orientation: "东南",
        noiseLevel: "MAIN_ROAD",
        noiseLabel: "⚠️ 临主干道 · 距布龙路仅30米",
        roadDistMeters: "北侧紧贴布龙路主干道，距主路仅28~35米",
        specialNoise: "⚠️ 布龙路货车与快速车流噪音明显（65~71dB），看健康花城务必避开北排1/2/11栋！",
        minPrice: 290,
        maxPrice: 312,
        priceRange: "290~312 万",
        twoKidsNote: "虽总价不到310万，但临布龙路主干道噪音大，建议加35万选南排6/7/8栋。",
        scores: { quiet: 32, edu: 82, commute: 82, space: 76, comm: 85, asset: 82 }
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
        roadDistMeters: "位于小区正中央，距南侧盛宝路约130米、距北侧广深铁路约180米（87㎡三开间朝南355万起）",
        specialNoise: "3栋由北侧4/5栋遮挡铁路声、南侧遮挡盛宝路声（约43~46dB）",
        minPrice: 355,
        maxPrice: 430,
        priceRange: "355~430 万 (87㎡~96㎡)",
        twoKidsNote: "微观户型满分（96㎡套内实得94㎡大横厅！）；但整体视角需接受：约42%回迁/保障房混居、容积率7.1、车位比1:0.73。",
        scores: { quiet: 93, edu: 82, commute: 75, space: 99, comm: 72, asset: 83 }
      },

      // ==================== C. 布吉百鸽笼片区 (新增4盘：万象汇商圈·贤义外国语+百外生态) ====================
      {
        id: "bgl-banshan-3-89",
        project: "信义金御半山",
        phase: "三期 (半山豪宅期)",
        building: "三期 5栋 / 6栋 / 8栋 (半山园景楼王)",
        unitCode: "01/02户 (看荔山公园与双泳池)",
        layoutType: "3室2厅2卫",
        structureType: "南北通透·板式",
        area: 89,
        usableRateNum: 86,
        usableArea: 76.5,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 背靠荔山距干道180米+",
        roadDistMeters: "背靠求水山/荔山生态公园，距罗岗路及龙岗大道均超180米",
        specialNoise: "无任何铁路/高架/干道干扰，半山台地森林环抱（40~43dB极静）",
        minPrice: 460,
        maxPrice: 510,
        priceRange: "460~510 万",
        twoKidsNote: "百鸽笼二手品质天花板！100%纯商品房+零民房万象汇商圈+对口贤义外国语(九年一贯制，公办率73.5%)+下楼即百合外国语/春蕾小学名校圈，去贝尔路26分钟！",
        scores: { quiet: 96, edu: 93, commute: 85, space: 90, comm: 96, asset: 94 }
      },
      {
        id: "bgl-banshan-1-86",
        project: "信义金御半山",
        phase: "一期 / 二期",
        building: "一期 3栋 / 二期 5栋 (内园侧)",
        unitCode: "03/05户 (东南向看花园)",
        layoutType: "3室2厅1卫",
        structureType: "竖厅·动静分区",
        area: 86,
        usableRateNum: 85,
        usableArea: 73.1,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距罗岗路130米",
        roadDistMeters: "位于一期/二期围合花园内侧，距外围道路约130米",
        specialNoise: "无铁路/高架，社区人车分流极安静（约43~46dB）",
        minPrice: 395,
        maxPrice: 435,
        priceRange: "395~435 万",
        twoKidsNote: "400万出头即可入主信义金御半山+万象汇电梯直达+贤义外国语九年一贯制学位。",
        scores: { quiet: 92, edu: 93, commute: 85, space: 79, comm: 94, asset: 92 }
      },
      {
        id: "bgl-longmen-2-95",
        project: "信义金御半山·珑门",
        phase: "四期/珑门 (2025.11全新现房)",
        building: "2栋 (中央园林栋)",
        unitCode: "95㎡三房两卫 / 86㎡三房一卫",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 95,
        usableRateNum: 88,
        usableArea: 83.6,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距罗岗路125米",
        roadDistMeters: "位于珑门组团内侧，看半山园林，距外围道路约125米（1/3栋另有86㎡一卫约415~438万）",
        specialNoise: "无铁路/高架，全新精装现房配高标双层中空隔音玻璃（约42~45dB）",
        minPrice: 448,
        maxPrice: 485,
        priceRange: "448~485 万 (86㎡版415万起)",
        twoKidsNote: "2025年底全新竣工现房！单价5.1万/㎡比旁边金御半山三期二手还便宜，95㎡新规实得83.6㎡，即买即办证落户赶2029幼升小，享万象汇+贤义外国语+百外生态！",
        scores: { quiet: 92, edu: 93, commute: 85, space: 92, comm: 92, asset: 93 }
      },
      {
        id: "bgl-baihe-2-98",
        project: "百合世纪广场",
        phase: "二期 (百外教育系新房)",
        building: "二期 2栋 / 3栋 (内园央座)",
        unitCode: "01/02户 (98~104㎡阔景大横厅)",
        layoutType: "3室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 98,
        usableRateNum: 86,
        usableArea: 84.3,
        orientation: "正南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距翔鸽路130米",
        roadDistMeters: "朝向小区中央大园林，距翔鸽路及罗岗路约130米",
        specialNoise: "无铁路/高架，紧邻百外世纪小学与万象汇商圈（约43~47dB）",
        minPrice: 455,
        maxPrice: 489,
        priceRange: "455~489 万",
        twoKidsNote: "由深圳传奇名校【百合外国语】母公司百合集团开发！楼下即百外世纪小学+万象汇+5号线百鸽笼站，98㎡大横厅三房两卫，鸡娃家庭心头好。",
        scores: { quiet: 91, edu: 93, commute: 86, space: 92, comm: 89, asset: 91 }
      },
      {
        id: "bgl-vankered-3-89",
        project: "万科红",
        phase: "三期 (花园大社区期)",
        building: "三期 2栋 / 3栋 (园林内圈)",
        unitCode: "02/03户 (高赠送南向三房两卫)",
        layoutType: "3室2厅2卫",
        structureType: "竖厅·动静分区",
        area: 89,
        usableRateNum: 85,
        usableArea: 75.6,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距惠康路130米",
        roadDistMeters: "位于万科红三期围合大花园中心，距惠康路及锦龙路约130米（一/四期另有83㎡一卫330万起）",
        specialNoise: "无铁路/高架，楼下自带盒马鲜生商业但住宅抬高隔音佳（约44~47dB）",
        minPrice: 375,
        maxPrice: 415,
        priceRange: "375~415 万 (83㎡一卫330万起)",
        twoKidsNote: "380~410万即可拥有：万科物业纯商品房 + 步行5分钟达万象汇/百鸽笼地铁站 + 贤义外国语九年一贯制学位 + 27分钟达贝尔路站！",
        scores: { quiet: 90, edu: 92, commute: 84, space: 86, comm: 89, asset: 88 }
      },

      // ==================== D. 龙岗大运片区 (8盘) ====================
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
        twoKidsNote: "S级零民房大运新城界面 + 100%纯商品房次新 + 港中大知新九年一贯制(公办率75%、十大率14.2%)！唯太太去贝尔路地铁需52分钟。",
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
        roadDistMeters: "位于3.2低容积率大花园中央，距如意路/飞扬路均超150米（另有86㎡一卫305~339万）",
        specialNoise: "无铁路/高架，百米楼间距中央水景园林（约41~44dB）",
        minPrice: 360,
        maxPrice: 406,
        priceRange: "360~406 万 (86㎡版305万起)",
        twoKidsNote: "社区纯粹度与低密满分：100%纯商品房+零民房高校界面+3.2超低容积率+2梯4户+1:1.11车位比+97㎡正南双龙抱珠+港中大知新/道远学位！",
        scores: { quiet: 95, edu: 91, commute: 47, space: 93, comm: 97, asset: 92 }
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
        twoKidsNote: "大运抗跌标杆(回撤仅21%)！100%纯商品房+零民房都会界面+车位比1:1.15+下楼即华附大运九年一贯制(公办率77.5%)，14号快线去贝尔路44分钟。",
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
        twoKidsNote: "全表二手抗跌总冠军(回撤仅19%)！容积率2.6别墅级低密+100%纯商品房+车位比1:1.25+楼下山姆会员店+深中龙岗顶级学位(公办率81.5%、十大率18.5%)！",
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
        roadDistMeters: "位于25栋大社区正中心，距盐龙大道及黄阁路均超200米",
        specialNoise: "无高架/干道干扰，成熟大花园极安静（约42~45dB）",
        minPrice: 235,
        maxPrice: 268,
        priceRange: "235~268 万 (一卫版205万起)",
        twoKidsNote: "240~265万买容积率3.6纯商品房正南双龙抱珠三房两卫+港中大知新九年一贯制名校(公办率75%)！适合严控预算留足教育金的家庭。",
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
        twoKidsNote: "龙岗终极改善天花板！100%纯商品房(0保障房)+126㎡高净值圈层+零民房大运核心+车位比1:1.73+套内实得118㎡（学区待2028交房后划片）。",
        scores: { quiet: 97, edu: 80, commute: 48, space: 99, comm: 99, asset: 97 }
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
        roadDistMeters: "2/3单元朝向抬高式空中花园内侧，距龙岗大道约120米",
        specialNoise: "14/16号线均为地下隧道无噪音；外侧商业裙楼遮挡大道车流（约44~48dB）",
        minPrice: 336,
        maxPrice: 435,
        priceRange: "336~435 万",
        twoKidsNote: "S级零民房大运枢纽上盖(步行2分钟入站)+车位比1:1.15+大横厅实得88㎡+华附大运/楼下72班新校！去贝尔路42分钟。",
        scores: { quiet: 90, edu: 90, commute: 63, space: 93, comm: 88, asset: 92 }
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
        roadDistMeters: "2/3栋位于园林中央，距龙飞大道及如意路约130米",
        specialNoise: "无铁路/无高架，国企现房双层中空LOW-E隔音玻璃（约41~45dB）",
        minPrice: 337,
        maxPrice: 415,
        priceRange: "337~415 万 (89㎡版299万起)",
        twoKidsNote: "S级零民房科教城界面+国企现房+车位比1:1.10+一路之隔港中大道远学校(九年一贯直升，一类购房稳录)；注意含约38%保障房。",
        scores: { quiet: 95, edu: 89, commute: 48, space: 92, comm: 82, asset: 88 }
      }
    ];

    // 默认四大片区代表盘 PK 池（坂田嘉御山 + 水径麓城 + 石芽岭健康花城 + 百鸽笼信义半山/珑门 + 大运星河/京基）
    let compareIds = ["bt-xinyi-5-89", "vanke-3-89", "jkhc-6-89", "bgl-banshan-3-89", "bgl-longmen-2-95"];

    // =========================================================================
    // 4. 六维权重计算与过滤逻辑
    // =========================================================================
    function getWeights() {
      const e = parseInt(byId("wEdu").value, 10);
      const q = parseInt(byId("wQuiet").value, 10);
      const m = parseInt(byId("wCommute").value, 10);
      const s = parseInt(byId("wSpace").value, 10);
      const c = parseInt(byId("wComm").value, 10);
      const a = parseInt(byId("wAsset").value, 10);
      const total = q + e + m + s + c + a || 100;
      return {
        edu: e / total,
        quiet: q / total,
        commute: m / total,
        space: s / total,
        comm: c / total,
        asset: a / total,
        raw: { e, q, m, s, c, a }
      };
    }

    function calcWeightedScore(unit, weights) {
      const rawScore =
        unit.scores.edu * weights.edu +
        unit.scores.quiet * weights.quiet +
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
    // 5. 渲染专章模块1：9大学区八维核心指标表
    // =========================================================================
    function renderSchoolTable() {
      const tbody = byId("schoolTableBody");
      const list = Object.values(SCHOOL_DISTRICTS).sort((a, b) => b.publicHighRate - a.publicHighRate);

      tbody.innerHTML = list.map(s => `
        <tr class="hover:bg-indigo-50/40 transition">
          <td class="py-2.5 px-2.5 align-top font-bold text-indigo-950">${s.name}</td>
          <td class="py-2.5 px-2.5 align-top font-medium text-slate-800">${s.covers}</td>
          <td class="py-2.5 px-2.5 align-top">
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${s.systemType.includes('九年一贯') ? 'badge-teal' : 'badge-indigo'}">${s.systemType}</span>
          </td>
          <td class="py-2.5 px-2.5 align-top">
            <span class="px-2 py-0.5 rounded font-bold ${s.publicHighRate >= 75 ? 'badge-green' : 'badge-blue'}">约 ${s.publicHighRate}%</span>
          </td>
          <td class="py-2.5 px-2.5 align-top">
            <div class="font-bold text-purple-800">四大率：~${s.top4Rate}%</div>
            <div class="text-slate-600">十大率：~${s.top10Rate}%</div>
          </td>
          <td class="py-2.5 px-2.5 align-top max-w-[220px] text-slate-700">${s.cutoffScore}</td>
          <td class="py-2.5 px-2.5 align-top max-w-[190px]">
            <div class="font-semibold text-emerald-800">${s.peerGrade}</div>
            <div class="text-[11px] text-slate-500 mt-0.5">${s.lockPolicy}</div>
          </td>
          <td class="py-2.5 px-2.5 align-top max-w-[220px] text-slate-600 leading-snug">${s.highlight}</td>
        </tr>
      `).join("");
    }

    // =========================================================================
    // 6. 渲染视角二：20盘宏观整体工程、圈层、民房界面、学位横评表
    // =========================================================================
    function renderMacroTable() {
      const zoneF = byId("macroZoneFilter").value;
      const pureF = byId("macroPurityFilter").value;
      const vilF = byId("macroVillageFilter").value;
      const denF = byId("macroDensityFilter").value;
      const tierF = byId("macroTierFilter").value;
      const minRate = parseFloat(byId("macroSchoolRateFilter").value);
      const parkF = byId("macroParkingFilter").value;
      const newOldF = byId("macroNewOldFilter").value;

      const entries = Object.entries(COMMUNITIES_MACRO).filter(([name, m]) => {
        const sch = SCHOOL_DISTRICTS[m.schoolKey];
        if (zoneF !== "ALL" && m.zone !== zoneF) return false;
        if (pureF === "S" && m.purityGrade !== "S") return false;
        if (pureF === "A" && m.purityGrade === "B") return false;
        if (vilF === "S" && m.villageGrade !== "S") return false;
        if (vilF === "A" && m.villageGrade === "B") return false;
        if (denF === "LOW" && m.densityGrade !== "LOW") return false;
        if (denF === "MID" && m.densityGrade === "HIGH") return false;
        if (tierF !== "ALL" && m.assetTier !== tierF) return false;
        if (sch.publicHighRate < minRate) return false;
        if (parkF !== "ALL" && m.parkingRatio < parseFloat(parkF)) return false;
        if (newOldF === "NEW" && !m.isNewBuild) return false;
        if (newOldF === "SECOND" && m.isNewBuild) return false;
        return true;
      });

      const tbody = byId("macroTableBody");
      if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="py-8 text-center text-slate-400">暂无符合该组合条件的小区，请放宽上方筛选选项。</td></tr>`;
        return;
      }

      tbody.innerHTML = entries.map(([name, m]) => {
        const sch = SCHOOL_DISTRICTS[m.schoolKey];
        const purityBadge = m.purityGrade === "S" ? "badge-green" : m.purityGrade === "A" ? "badge-blue" : "badge-amber";
        const vilBadge = m.villageGrade === "S" ? "badge-green" : m.villageGrade === "A" ? "badge-blue" : "badge-amber";

        return `
          <tr class="hover:bg-indigo-50/40 transition">
            <td class="py-2.5 px-2 align-top">
              <div class="font-bold text-slate-900 flex items-center gap-1">
                <span>${name}</span>
                ${m.isNewBuild ? '<span class="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] rounded">新房</span>' : ''}
              </div>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${m.zone} · ${m.buildYear}</span>
            </td>
            <td class="py-2.5 px-2 align-top">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${purityBadge}">保障房：${m.subsidizedRatio.split(" ")[0]}</span>
              <div class="text-slate-600 mt-1 text-[11px]">${m.purityLabel}</div>
            </td>
            <td class="py-2.5 px-2 align-top max-w-[175px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold badge-purple">${m.assetTier}</span>
              <div class="text-slate-600 mt-1 text-[11px] leading-snug">${m.residentProfile}</div>
            </td>
            <td class="py-2.5 px-2 align-top max-w-[180px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${vilBadge}">${m.urbanInterface.split("（")[0]}</span>
              <div class="text-slate-500 mt-1 text-[11px] leading-snug">${m.urbanInterface.includes("（") ? m.urbanInterface.substring(m.urbanInterface.indexOf("（")) : ""}</div>
            </td>
            <td class="py-2.5 px-2 align-top">
              <div class="font-bold ${m.plotRatio <= 3.8 ? 'text-emerald-700' : m.plotRatio >= 6.0 ? 'text-rose-600' : 'text-slate-800'}">${m.densityLabel}</div>
              <div class="text-slate-600 text-[11px] mt-0.5">${m.totalFloors} · ${m.elevatorRatio}</div>
            </td>
            <td class="py-2.5 px-2 align-top">
              <div class="font-bold ${m.parkingRatio < 1 ? 'text-rose-600' : 'text-emerald-700'}">🅿️ ${m.parkingLabel}</div>
              <div class="text-slate-500 text-[11px] mt-0.5">${m.regLabel} (${m.usableAvg})</div>
            </td>
            <td class="py-2.5 px-2 align-top max-w-[190px]">
              <div class="font-bold text-indigo-950">${sch.shortName}</div>
              <div class="mt-0.5">
                <span class="px-1.5 py-0.5 rounded font-bold badge-green text-[10px]">公办率 ${sch.publicHighRate}%</span>
                <span class="px-1.5 py-0.5 rounded font-semibold badge-purple text-[10px]">十大率 ${sch.top10Rate}%</span>
              </div>
              <div class="text-[10px] text-slate-500 mt-0.5">${sch.systemType}</div>
            </td>
            <td class="py-2.5 px-2 align-top max-w-[185px] text-[11px] text-slate-600 leading-snug">
              ${sch.cutoffScore}
            </td>
            <td class="py-2.5 px-2 align-top">
              <div class="font-bold text-pink-700">🚇 贝尔路 ${m.commuteMins}分</div>
              <div class="text-[11px] text-emerald-800 font-medium mt-0.5">🛡️ 21-26回撤 ${m.drawdownPct}%</div>
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
    // 7. 渲染顶部 TOP 4 严选推荐
    // =========================================================================
    function renderTopRecommendations() {
      const weights = getWeights();
      byId("wEduVal").textContent = `${weights.raw.e}%`;
      byId("wQuietVal").textContent = `${weights.raw.q}%`;
      byId("wCommuteVal").textContent = `${weights.raw.m}%`;
      byId("wSpaceVal").textContent = `${weights.raw.s}%`;
      byId("wCommVal").textContent = `${weights.raw.c}%`;
      byId("wAssetVal").textContent = `${weights.raw.a}%`;

      const minRate = parseFloat(byId("filterSchoolRate").value);

      const eligible = UNITS_DATA
        .filter(u => {
          const sch = SCHOOL_DISTRICTS[COMMUNITIES_MACRO[u.project].schoolKey];
          return u.noiseLevel !== "MAIN_ROAD" && matchPriceFilter(u) && matchCommuteFilter(u) && sch.publicHighRate >= minRate;
        })
        .map(u => ({
          ...u,
          totalScore: calcWeightedScore(u, weights),
          macro: COMMUNITIES_MACRO[u.project],
          sch: SCHOOL_DISTRICTS[COMMUNITIES_MACRO[u.project].schoolKey]
        }))
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
            <div class="truncate font-semibold text-indigo-900">🎓 ${u.sch.shortName} (公办率${u.sch.publicHighRate}%)</div>
            <div class="truncate text-emerald-800">🏢 ${u.macro.purityLabel.split("·")[1]} ｜ 回撤${u.macro.drawdownPct}%</div>
          </div>
        </div>
      `).join("");
    }

    // =========================================================================
    // 8. 渲染视角三：微观楼栋户号卡片矩阵（支持12维联动筛选）
    // =========================================================================
    function matchProjectZone(unit, projFilter) {
      const macro = COMMUNITIES_MACRO[unit.project];
      if (projFilter === "ALL") return true;
      if (projFilter === "ZONE_BANTIAN") return macro.zone === "坂田片区";
      if (projFilter === "ZONE_SHUIJING") return macro.zone === "水径/石芽岭";
      if (projFilter === "ZONE_BAIGELONG") return macro.zone === "布吉百鸽笼";
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
      const minSchoolRate = parseFloat(byId("filterSchoolRate").value);
      const purity = byId("filterPurity").value;
      const village = byId("filterVillage").value;
      const density = byId("filterDensity").value;
      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      const weights = getWeights();

      byId("maxPriceLabel").textContent =
        maxSlider >= 720 ? "不限上限 (≤720万)" : `预算上限 ≤ ${maxSlider} 万`;

      const filtered = UNITS_DATA.filter(u => {
        const m = COMMUNITIES_MACRO[u.project];
        const sch = SCHOOL_DISTRICTS[m.schoolKey];
        if (!matchProjectZone(u, proj)) return false;
        if (bld !== "ALL" && `${u.project} - ${u.building}` !== bld) return false;
        if (layout !== "ALL" && u.layoutType !== layout) return false;
        if (struct !== "ALL" && u.structureType !== struct) return false;
        if (orient !== "VALID_SOUTH" && u.orientation !== orient) return false;
        if (noise === "QUIET_ONLY" && u.noiseLevel !== "QUIET") return false;
        if (noise === "NO_MAIN" && u.noiseLevel === "MAIN_ROAD") return false;
        if (sch.publicHighRate < minSchoolRate) return false;
        if (purity === "S" && m.purityGrade !== "S") return false;
        if (purity === "A" && m.purityGrade === "B") return false;
        if (village === "S" && m.villageGrade !== "S") return false;
        if (village === "A" && m.villageGrade === "B") return false;
        if (density === "LOW" && m.densityGrade !== "LOW") return false;
        if (density === "MID" && m.densityGrade === "HIGH") return false;
        if (!matchPriceFilter(u)) return false;
        if (!matchCommuteFilter(u)) return false;
        return true;
      }).map(u => ({
        ...u,
        totalScore: calcWeightedScore(u, weights),
        macro: COMMUNITIES_MACRO[u.project],
        sch: SCHOOL_DISTRICTS[COMMUNITIES_MACRO[u.project].schoolKey]
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
        const sch = u.sch;
        let noiseBadgeClass = "badge-green";
        if (u.noiseLevel === "SUB_ROAD") noiseBadgeClass = "badge-amber";
        if (u.noiseLevel === "MAIN_ROAD") noiseBadgeClass = "badge-red";

        let zoneBadgeColor = "bg-emerald-800 text-white";
        if (m.zone === "坂田片区") zoneBadgeColor = "bg-pink-700 text-white";
        if (m.zone === "布吉百鸽笼") zoneBadgeColor = "bg-teal-700 text-white";
        if (m.zone === "龙岗大运") zoneBadgeColor = "bg-indigo-700 text-white";

        return `
          <div class="rounded-xl border ${u.noiseLevel === 'MAIN_ROAD' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 bg-white'} p-4 flex flex-col justify-between hover:border-indigo-400 transition">
            <div>
              <!-- 头部：片区 + 楼盘 + 定位 + 综合得分 -->
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded ${zoneBadgeColor}">${m.zone}</span>
                  <span class="font-bold text-xs text-slate-900">${u.project}</span>
                  ${m.isNewBuild ? '<span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white">新房/现房</span>' : ''}
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

              <!-- 区块2：【小初学位专项】普高率、四大十大率、积分线与学制 -->
              <div class="mt-2 pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-700 space-y-1 bg-indigo-50/60 p-2.5 rounded-lg">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-indigo-950">🎓 ② 对口小初学位硬核指标</span>
                  <span class="px-1.5 py-0.2 rounded font-bold badge-green text-[10px]">公办率 ${sch.publicHighRate}%</span>
                </div>
                <div><strong>对口学校：</strong>${sch.name}</div>
                <div><strong>名校上限：</strong><span class="text-purple-800 font-semibold">四大率 ~${sch.top4Rate}% ｜ 十大率 ~${sch.top10Rate}%</span> ｜ ${sch.systemType.split(" ")[0]}</div>
                <div><strong>录取积分线：</strong>${sch.cutoffScore}</div>
                <div><strong>生源纯粹度：</strong>${sch.peerGrade}</div>
              </div>

              <!-- 区块3：【中观社区+宏观资产】纯粹度、圈层、民房界面、密度与通勤 -->
              <div class="mt-2 pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-600 space-y-1 bg-slate-50/90 p-2.5 rounded-lg">
                <div class="font-bold text-slate-800">🏢 ③ 社区纯粹度 · 民房界面 · 密度 · 贝尔路通勤</div>
                <div><strong>保障房/纯粹度：</strong><span class="${m.purityGrade === 'S' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}">${m.purityLabel} (${m.subsidizedRatio.split(" ")[0]})</span></div>
                <div><strong>周边有无民房：</strong>${m.urbanInterface.split("（")[0]}</div>
                <div class="grid grid-cols-2 gap-1 pt-0.5">
                  <div><strong>密度：</strong>${m.densityLabel}</div>
                  <div><strong>车位：</strong><span class="${m.parkingRatio < 1 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}">${m.parkingLabel}</span></div>
                </div>
                <div class="text-pink-800 font-medium"><strong>🚇 太太通勤：</strong>距${m.metroStation.split(" ")[0]}${distanceMetric(m.metroDist)} → <strong>${m.commuteMins}分钟</strong>达贝尔路</div>
              </div>

              <!-- 二胎点评 -->
              <div class="mt-2 text-[11px] text-slate-700 leading-relaxed bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                👶 <strong>二胎选房建议：</strong>${u.twoKidsNote}
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">${m.propertyInfo} ｜ 21-26回撤${m.drawdownPct}%</span>
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
    // 9. 渲染视角四：四层穿透终极同屏 PK 对比台
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
        .map(u => ({
          ...u,
          macro: COMMUNITIES_MACRO[u.project],
          sch: SCHOOL_DISTRICTS[COMMUNITIES_MACRO[u.project].schoolKey]
        }));

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

        // 第二层：小初学位八维核心指标（全新强化！）
        { section: "【第二层：小、初学位八维指标视角】公办普高率、四大/十大率、录取积分线、直升学制与生源", label: "🎓 对口小学 & 初中名称", render: u => `<span class="font-bold text-indigo-950">${u.sch.name}</span>` },
        { label: "🏆 中考公办普高录取率", render: u => `<span class="px-2 py-0.5 rounded badge-green font-bold text-xs">约 ${u.sch.publicHighRate}%</span> <span class="text-slate-400">(全市基准53.5%)</span>` },
        { label: "🌟 四大名校率 & 十大率", render: u => `<div class="font-bold text-purple-800">四大率：约 ${u.sch.top4Rate}%</div><div class="font-semibold text-indigo-700">十大率：约 ${u.sch.top10Rate}%</div>` },
        { label: "📊 近3年录取积分线 & 门槛", render: u => u.sch.cutoffScore },
        { label: "🔄 学制模式 (小升初衔接)", render: u => `<span class="font-semibold text-teal-800">${u.sch.systemType}</span>` },
        { label: "👥 生源纯粹度 & 锁定政策", render: u => `<div class="font-semibold">${u.sch.peerGrade}</div><div class="text-slate-500 mt-0.5">${u.sch.lockPolicy}</div>` },

        // 第三层：中观社区纯粹度、圈层、民房界面、密度与车位
        { section: "【第三层：整体社区视角】保障房比例、业主圈层、周边有无民房、高低密度与车位", label: "🏢 产权纯粹度 & 保障房比", render: u => `<div class="font-bold ${u.macro.purityGrade === 'S' ? 'text-emerald-700' : 'text-amber-700'}">${u.macro.purityLabel}</div><div class="text-slate-500">配建比：${u.macro.subsidizedRatio}</div>` },
        { label: "👥 刚需/改善定位 & 圈层", render: u => `<span class="px-2 py-0.5 rounded badge-indigo font-bold">${u.macro.assetTier}</span><div class="mt-1 text-slate-600">${u.macro.residentProfile}</div>` },
        { label: "🏙️ 周边城市界面 (有无民房)", render: u => u.macro.urbanInterface },
        { label: "🌳 高低密度 & 梯户比", render: u => `<div class="font-bold">${u.macro.densityLabel}</div><div class="text-slate-500">${u.macro.totalFloors} · ${u.macro.elevatorRatio}</div>` },
        { label: "🅿️ 车位比 & 建筑代际", render: u => `<div class="font-bold ${u.macro.parkingRatio < 1 ? 'text-rose-600' : 'text-emerald-700'}">车位 ${u.macro.parkingLabel}</div><div class="text-slate-500">${u.macro.regLabel}</div>` },

        // 第四层：宏观板块十年Beta、历史抗跌验证与贝尔路通勤
        { section: "【第四层：宏观资产与通勤视角】十年产业规划Beta、历史抗跌天花板验证与贝尔路通勤", label: "📈 片区十年发展Beta & 天花板", render: u => u.macro.tenYearBeta },
        { label: "🛡️ 2021-2026历史抗跌性验证", render: u => `<span class="px-2 py-0.5 rounded badge-green font-bold">回撤约 ${u.macro.drawdownPct}%</span><div class="mt-1 text-slate-600">${u.macro.priceCeilingVerify}</div>` },
        { label: "🚇 太太至贝尔路站通勤", render: u => `<div class="font-bold text-pink-700">约 ${u.macro.commuteMins} 分钟 (距地铁${distanceMetric(u.macro.metroDist)})</div><div class="text-slate-500">${u.macro.commuteRoute}</div>` },
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
            <th class="py-3 px-3 w-44 font-bold text-slate-800">四层穿透对比维度</th>
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
    // 10. 初始化图表：学区双指标图 + 历史抗跌性对比图 (Chart.js)
    // =========================================================================
    function initCharts() {
      // 图表1：9大学区公办普高率 vs 十大名校率
      const ctxSchool = byId("schoolMetricsChart").getContext("2d");
      const schList = Object.values(SCHOOL_DISTRICTS).sort((a, b) => b.publicHighRate - a.publicHighRate);
      Chart.defaults.font.family = getComputedStyle(root).fontFamily;
      Chart.defaults.color = '#63615B';
      new Chart(ctxSchool, {
        type: "bar",
        data: {
          labels: schList.map(s => s.shortName),
          datasets: [
            {
              label: "中考公办普高录取率 (%)",
              data: schList.map(s => s.publicHighRate),
              backgroundColor: "rgba(193, 95, 60, 0.84)",
              borderRadius: 5
            },
            {
              label: "深圳十大高中录取率 (%)",
              data: schList.map(s => s.top10Rate),
              backgroundColor: "rgba(72, 115, 90, 0.88)",
              borderRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            y: {
              min: 0,
              max: 90,
              ticks: { callback: v => v + "%", font: { size: 10 } },
              title: { display: true, text: "升学率 (%)", font: { size: 11 } }
            },
            x: { ticks: { autoSkip: false, minRotation: 38, maxRotation: 55, font: { size: 11 } } }
          }
        }
      });

      // 图表2：二手代表盘2021-2026回撤率对比
      const ctxRes = byId("resilienceChart").getContext("2d");
      const labels = [
        "星河时代(大运)",
        "颐安都会(大运)",
        "鸿荣源尚峰(水径)",
        "信义嘉御山(坂田)",
        "健康花城(石芽岭)",
        "信义金御半山(百鸽笼)",
        "佳兆业中央(坂田)",
        "京基御景(大运)",
        "大族云峰(坂田)",
        "万科红(百鸽笼)",
        "万科麓城三期(水径)",
        "中海康城(大运)",
        "诺德中央道(坂田)"
      ];
      const drawdowns = [19, 21, 22, 22, 23, 23, 24, 24, 25, 26, 27, 33, 35];

      new Chart(ctxRes, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "2021历史峰值→2026真实成交回撤幅度 (%，数值越小代表周期抗跌性越强)",
              data: drawdowns,
              backgroundColor: drawdowns.map(d =>
                d <= 23 ? "rgba(72, 115, 90, 0.88)" : d <= 27 ? "rgba(193, 95, 60, 0.84)" : "rgba(177, 138, 68, 0.88)"
              ),
              borderRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            y: {
              min: 0,
              max: 40,
              ticks: { callback: v => "-" + v + "%", font: { size: 10 } }
            },
            x: { ticks: { autoSkip: false, minRotation: 38, maxRotation: 55, font: { size: 11 } } }
          }
        }
      });
    }

    // =========================================================================
    // 11. 事件监听绑定与初始化
    // =========================================================================
    function bindEvents() {
      ["wEdu", "wQuiet", "wCommute", "wSpace", "wComm", "wAsset"].forEach(id => {
        byId(id).addEventListener("input", () => {
          renderTopRecommendations();
          renderUnitCards();
          renderCompareTable();
        });
      });

      byId("resetWeightsBtn").addEventListener("click", () => {
        byId("wEdu").value = 25;
        byId("wQuiet").value = 20;
        byId("wCommute").value = 20;
        byId("wSpace").value = 15;
        byId("wComm").value = 10;
        byId("wAsset").value = 10;
        renderTopRecommendations();
        renderUnitCards();
        renderCompareTable();
      });

      [
        "macroZoneFilter", "macroPurityFilter", "macroVillageFilter", "macroDensityFilter",
        "macroTierFilter", "macroSchoolRateFilter", "macroParkingFilter", "macroNewOldFilter"
      ].forEach(id => {
        byId(id).addEventListener("change", renderMacroTable);
      });

      byId("filterProject").addEventListener("change", () => {
        updateBuildingOptions();
        renderUnitCards();
      });

      [
        "filterBuilding", "filterLayout", "filterStructure", "filterOrientation",
        "filterNoise", "filterPurity", "filterVillage", "filterDensity"
      ].forEach(id => {
        byId(id).addEventListener("change", renderUnitCards);
      });

      ["filterSchoolRate", "filterPriceBracket", "filterCommute"].forEach(id => {
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
        byId("filterSchoolRate").value = "0";
        byId("filterPurity").value = "ALL";
        byId("filterVillage").value = "ALL";
        byId("filterDensity").value = "ALL";
        byId("filterPriceBracket").value = "ALL";
        byId("filterCommute").value = "ALL";
        byId("filterMaxPriceSlider").value = 720;
        renderTopRecommendations();
        renderUnitCards();
      });

      byId("clearCompareBtn").addEventListener("click", () => {
        compareIds = ["bt-xinyi-5-89", "vanke-3-89", "jkhc-6-89", "bgl-banshan-3-89", "bgl-longmen-2-95"];
        renderUnitCards();
        renderCompareTable();
      });
    }

    function init() {
      renderSchoolTable();
      initCharts();
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
