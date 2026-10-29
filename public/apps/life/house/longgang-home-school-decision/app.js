/* V11附件四段脚本与全部数据保留；将页面状态限定在本工具中。 */
(() => {
'use strict';
const root=document.getElementById('lg-house-app');if(!root)return;const byId=id=>root.querySelector('#'+id);
const readyCallbacks=[];const onReady=callback=>readyCallbacks.push(callback);let multiSelectState,getMultiValues,buildMultiSelectUI,drillDownProject,toggleCompare;

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
        rateRange: "78.0% ~ 81.5%",
        trend3Y: [78.0, 79.8, 81.5],
        top4Rate: 7.5,
        top10Rate: 18.5,
        cutoffScore: "小一约96.5分 / 初一约98.2分（一类购房落户，需提前约2~2.5年）",
        peerGrade: "S级·纯正中产与别墅圈层，学区几乎无城中村租户生源",
        lockPolicy: "小一锁6年/初一锁3年（二胎同父母通用不限）",
        highlight: "龙岗公办初中天花板之一，四大率与十大率常年领跑，现房买入落户稳赶2029老大幼升小。"
      },
      "NNU_LG": {
        name: "万科麓城外国语小学/水径小学 + 南京师范大学附属龙岗学校",
        shortName: "南师大附属龙岗学校",
        covers: "万科麓城三期、鸿荣源尚峰",
        systemType: "6+3 独立小初 (+共享水径54班九年一贯新校)",
        publicHighRate: 80.8,
        rateRange: "76.5% ~ 80.8%",
        trend3Y: [76.5, 78.2, 80.8],
        top4Rate: 5.8,
        top10Rate: 15.2,
        cutoffScore: "麓城外国语小一约88分 / 南师大龙岗初一约82分（一类购房提前1年落户100%稳录）",
        peerGrade: "S级·麓城外国语仅招收麓城等商品房生源，极纯粹无城中村干扰",
        lockPolicy: "小一锁6年/初一锁3年（2026水径九年一贯新校投用后学位更充裕）",
        highlight: "公办普高率连续三年稳居76.5%~80.8%第一梯队！积分门槛友好，2029/2032双孩100%稳上。"
      },
      "SHIYAN_BT": {
        name: "深圳实验学校坂田校区（小学部 + 初中部）",
        shortName: "深实验坂田校区",
        covers: "诺德中央道",
        systemType: "九年一贯制 (小学毕业校内直升初中)",
        publicHighRate: 77.5,
        rateRange: "75.0% ~ 78.5%",
        trend3Y: [75.0, 76.8, 77.5],
        top4Rate: 6.2,
        top10Rate: 16.0,
        cutoffScore: "小一约92~95分 / 初一校内直升为主（外考需一类95分+，提前1.5~2年落户）",
        peerGrade: "A级·一类商品房业主子女占主体（因积分门槛高，城中村租户极难考入）",
        lockPolicy: "九年一贯锁定（小一入学锁9年或分段锁，二胎同套房通用）",
        highlight: "四大名校深圳实验学校本部直管，九年一贯制免去小升初排位焦虑，四大/十大率极强。"
      },
      "HUAZHU_DY": {
        name: "华南师范大学附属龙岗大运学校（九年一贯制）",
        shortName: "华附大运学校",
        covers: "颐安·都会中央、深铁阅云境广场(+楼下规划72班新校)",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 77.5,
        rateRange: "74.0% ~ 77.5%",
        trend3Y: [74.0, 76.0, 77.5],
        top4Rate: 5.5,
        top10Rate: 14.8,
        cutoffScore: "小一约91.5分 / 初一直升为主（一类购房提前1~1.5年落户稳录）",
        peerGrade: "S级·100%纯粹大运改善商品房与高校教师子女，零城中村生源",
        lockPolicy: "九年一贯锁定（深铁阅云境另有楼下72班九年一贯制公办新校双保险）",
        highlight: "颐安家门口目送式九年一贯名校，生源纯粹度与硬件设施全大运一流。"
      },
      "CUHK_ZHIXIN": {
        name: "香港中文大学(深圳)附属知新学校 / 道远学校（九年一贯制）",
        shortName: "港中大附属知新/道远",
        covers: "佳兆业未来花园、京基御景中央、中海康城花园、泰瑞府、大运玖章(待划片)",
        systemType: "九年一贯制 (高校附属教育集团直升)",
        publicHighRate: 75.0,
        rateRange: "71.5% ~ 76.0%",
        trend3Y: [71.5, 73.8, 75.0],
        top4Rate: 5.0,
        top10Rate: 14.2,
        cutoffScore: "知新小一约90.5分(提前1~1.5年落户) / 道远小一约78分(一类购房即稳录)",
        peerGrade: "S级·大运科教城商品房生源，无城中村握手楼租户分流",
        lockPolicy: "九年一贯锁定（泰瑞府一路之隔即道远学校，目送式入学）",
        highlight: "背靠港中大(深圳)学术资源，近年中考稳居龙岗前十，九年一贯直升省心。"
      },
      "KEWAI_BT": {
        name: "科技城外国语学校（小学部 + 初中部）",
        shortName: "科技城外国语学校",
        covers: "信义嘉御山",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 74.5,
        rateRange: "72.0% ~ 75.5%",
        trend3Y: [72.0, 73.5, 74.5],
        top4Rate: 4.9,
        top10Rate: 13.8,
        cutoffScore: "小一约91.0分（一类购房+坂田户籍，提前1~1.5年落户稳录）",
        peerGrade: "S级·信义嘉御山百万方商品房大社区业主子女占90%以上",
        lockPolicy: "九年一贯锁定（学校就在嘉御山社区旁，真正下楼目送式）",
        highlight: "坂田本土口碑最稳的九年一贯制公办强校，生源高度集中在嘉御山业主。"
      },
      "XIANYI_BGL": {
        name: "贤义外国语学校(九年一贯制) + 春蕾小学/百合外国语生态圈",
        shortName: "贤义外国语(+百外生态)",
        covers: "信义金御半山、信义金御半山·珑门、百合世纪广场、万科红",
        systemType: "公办九年一贯制直升 + 顶尖民办(百外/春蕾)双轨赋能",
        publicHighRate: 73.5,
        rateRange: "71.0% ~ 74.5%",
        trend3Y: [71.0, 72.4, 73.5],
        top4Rate: 4.8,
        top10Rate: 13.5,
        cutoffScore: "贤义小一约84~89分 / 初一直升+积分（一类购房提前1年落户100%稳录）",
        peerGrade: "A+级·信义金御半山/万科红等商品房大盘生源为主，全深圳考百外氛围最浓",
        lockPolicy: "九年一贯锁定（万科红部分期数共享信义实验小学）",
        highlight: "进可攻（下楼即春蕾小学+深圳第一民办初中百合外国语，四大率超35%）、退可守（公办贤义外国语九年一贯制公办率73.5%稳保底）！"
      },
      "SHENDA_BT": {
        name: "深圳大学附属坂田学校(九年一贯) / 广东实验中学深圳学校(共享)",
        shortName: "深大附属坂田学校",
        covers: "佳兆业中央广场、大族云峰",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 66.5,
        rateRange: "63.0% ~ 68.5%",
        trend3Y: [63.0, 65.2, 66.5],
        top4Rate: 3.6,
        top10Rate: 10.8,
        cutoffScore: "2026小一录取线91.05分(迁户时间2025.05，即提前1年落户100%稳录)",
        peerGrade: "A级·一类91分高门槛将周边岗头村租户拦截在外，实际录取全为佳兆业/大族业主子女",
        lockPolicy: "九年一贯锁定（学校紧邻佳兆业与大族云峰，接送零距离）",
        highlight: "公办普高率66.5%稳居全市中上，且一类91分录取线保证了入读生源全为商品房业主。"
      },
      "SHIYALING_NW": {
        name: "石芽岭学校(九年一贯制) + 规划54班深大附中南湾学校",
        shortName: "石芽岭学校(+深大附新校)",
        covers: "健康花城、特发臻华府",
        systemType: "九年一贯制 (校内直升)",
        publicHighRate: 61.5,
        rateRange: "56.8% ~ 62.0%",
        trend3Y: [56.8, 59.4, 61.5],
        top4Rate: 2.8,
        top10Rate: 8.5,
        cutoffScore: "小一约72~78分（学位充裕，一类购房落户当年即可100%稳录）",
        peerGrade: "A-级·健康花城/中海怡瑞等商品房为主，含少量周边社区生源",
        lockPolicy: "九年一贯锁定（健康花城步行至石芽岭学校仅300米，不经城中村）",
        highlight: "公办普高率约61.5%达标中上水平，积分门槛最宽松，且特发旁54班深大附中南湾新校带来增量预期。"
      }
    };

    // =========================================================================
    // 2. 宏观与中观数据库：20个小区全量工程、商业、地铁距离、回迁/城中村、学位、十年Beta
    // =========================================================================
    const COMMUNITIES_MACRO = {
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
        parkingLabel: "1:1.05 (车位充裕，充电桩完善)",
        purityGrade: "A",
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: false,
        resettlementDetail: "旧改大盘：一期含较多象角塘村民回迁房；但【三期】为独立围合100%纯商品房，0回迁0保障！",
        purityLabel: "分期纯粹·三期0回迁0保障",
        assetTier: "品质改善",
        residentProfile: "华为总部研发工程师、中层主管及科技白领家庭为主，高学历高收入圈层",
        villageGrade: "B",
        villageDistText: "距岗头村/禾坪岗民房约 120~180米",
        urbanInterface: "B级·半现代半旧村（三期内部豪华园林，东北侧隔路有岗头民房，去地铁与深大附坂田学校走现代市政路不穿村）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "三期塔楼下为纯架空层花园，外围自带约9万㎡佳兆业商业街区(呈物理隔离，三期2/3栋无底商油烟)",
        supermarketInfo: "自带华润万家大型超市+影院餐饮；山姆极速达覆盖(驱车12分钟达坂田万科广场/龙华山姆)",
        wetMarketInfo: "楼下钱大妈/百果园生鲜店齐备，步行350米达岗头农贸肉菜市场，老人买菜极方便",
        metroMeters: 300,
        metroStation: "10号线岗头站 / 华为站",
        metroDist: "★ 约 300米 (步行4~5分钟即入站)",
        commuteMins: 10,
        commuteRoute: "10号线岗头/华为站 → 1~2站0换乘直达贝尔路站",
        tenYearBeta: "背靠华为全球总部20万科创购买力，10号线双地铁口+百万方旧改兑现中；三房天花板520~580万。",
        resilienceGrade: "MID",
        drawdownPct: 24,
        priceCeilingVerify: "三期纯商品房从2021峰值6.3万→2026企稳于4.8万/㎡(回撤24%)，抗跌性稳健。",
        propertyInfo: "佳兆业物业 · 3.8元/㎡",
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
        parkingLabel: "1:1.02 (夜间9点前充裕，五期更宽裕)",
        purityGrade: "A",
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: false,
        resettlementDetail: "旧改大盘：一、二期含部分坂田村民回迁房；【五期、七期】为独立大花园100%纯商品房，0回迁0保障！",
        purityLabel: "分期纯粹·五期/七期0回迁纯商品房",
        assetTier: "品质改善",
        residentProfile: "华为资深员工、福田/北站外溢改善中产、重视教育的二胎家庭",
        villageGrade: "B",
        villageDistText: "外围距坂田村/杨美民房约 80~200米",
        urbanInterface: "B级·内优外杂（五期百米楼距皇家园林极纯粹，出小区外围有坂田老村街区，但科外学校紧邻社区无需穿村）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "五期12/13栋深居中央纯住架空层，外围裙楼自带天虹商场与风情商业街(商住动线分离)",
        supermarketInfo: "社区自带【信义天虹商场】大型超市+步行900米达坂田万科广场MALL；山姆极速达覆盖(驱车12分钟达龙华山姆)",
        wetMarketInfo: "天虹生鲜超市+社区外围一圈钱大妈/生鲜店+步行450米达坂田农贸批零肉菜市场",
        metroMeters: 450,
        metroStation: "10号线坂田北站 / 5号线五和站",
        metroDist: "约 450米 (步行6分钟)",
        commuteMins: 14,
        commuteRoute: "10号线坂田北站 → 2站0换乘直达贝尔路站",
        tenYearBeta: "紧邻五和国际交通枢纽（深大/深惠城际交汇）+ 坂雪岗科技城南扩；三房天花板550~620万。",
        resilienceGrade: "HIGH",
        drawdownPct: 22,
        priceCeilingVerify: "五期纯商品房89㎡从2021峰值6.8万→2026稳定在5.3万/㎡(回撤仅22%)，坂田抗跌硬通货。",
        propertyInfo: "信义物业 · 3.6元/㎡",
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
        parkingLabel: "1:0.96 (紧平衡，晚归偶需找位)",
        purityGrade: "A",
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: true,
        resettlementDetail: "一期含少量旧改回迁房及配建；【二期】以纯正商品房为主，管理独立。",
        purityLabel: "二期纯商品房为主 (一期含少量回迁)",
        assetTier: "主流刚改",
        residentProfile: "冲着“深圳实验学校坂田部”买入的鸡娃中产家庭、坂田/福田双职工",
        villageGrade: "B",
        villageDistText: "⚠️ 零距离贴临光雅园村 (距边界仅15~30米)",
        urbanInterface: "B级·紧贴城中村（东南侧紧贴光雅园村握手楼，日常去地铁口经过城中村底商）",
        commGrade: "A_STREET",
        samWalk: false,
        purePodium: false,
        podiumType: "外围裙楼带两层社区沿街底商（便利店/药店/教培/轻餐饮），选房需选二期2/3栋内园侧避开底商",
        supermarketInfo: "步行600米达大族云峰华润万家/800米达星河World COCO Park；山姆极速达覆盖(驱车10分钟达龙华山姆)",
        wetMarketInfo: "下楼即光雅园生鲜街市与农贸菜市场（50米内），买菜极便宜便捷但街面较杂",
        metroMeters: 400,
        metroStation: "10号线光雅园站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 17,
        commuteRoute: "10号线光雅园站 → 3站0换乘直达贝尔路站",
        tenYearBeta: "五和大道城市更新带+深实验名校集团加持；受限于周边光雅园村界面，总价天花板约530万。",
        resilienceGrade: "LOW",
        drawdownPct: 35,
        priceCeilingVerify: "2021年炒至7.5万/㎡，2026回归至4.9万/㎡(回撤35%)，目前泡沫已挤干。",
        propertyInfo: "诺德物业 · 3.8元/㎡",
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
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: true,
        resettlementDetail: "旧改次新盘：含约12%回迁房及少量人才配建（一期3/5栋及二期中心栋为纯商品房）。",
        purityLabel: "次新商品房为主 (特定单元含少量回迁)",
        assetTier: "品质改善",
        residentProfile: "偏好次新外立面与大园林的年轻科技新贵、华为及北站商务区改善客群",
        villageGrade: "A",
        villageDistText: "距外围民房约 150米+ (自带商业MALL隔离)",
        urbanInterface: "A级·现代综合体界面（自带4.5万㎡商业与深大附坂田学校，上学与生活完全不进村）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "自带4.5万㎡独立集中式购物MALL（与住宅内园物理分区隔离，中心3/5栋完全无底商油烟干扰）",
        supermarketInfo: "下楼即自家MALL（含大型精品商超/星巴克/喜茶/品牌餐饮）+ 1公里星河COCO Park；山姆极速达覆盖",
        wetMarketInfo: "MALL内大型生鲜超市+社区钱大妈+步行500米达坂田南农贸肉菜市场",
        metroMeters: 600,
        metroStation: "10号线光雅园站 / 坂田北站",
        metroDist: "约 600米 (步行8分钟)",
        commuteMins: 16,
        commuteRoute: "10号线光雅园/坂田北站 → 2~3站0换乘直达贝尔路",
        tenYearBeta: "坂田南连接北站超核的门户位置，2020年次新折旧慢。",
        resilienceGrade: "MID",
        drawdownPct: 25,
        priceCeilingVerify: "2021峰值6.6万→2026约4.95万/㎡(回撤25%)，次新阵营成交活跃。",
        propertyInfo: "大族物业 · 3.9元/㎡",
        schoolKey: "SHENDA_BT"
      },

      // ---------------- B. 水径 / 石芽岭片区 (4盘) ----------------
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
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 三期为100%纯商品房独立组团，0村民回迁房、0配建保障房，产权与邻居极其纯粹！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯商品房)",
        assetTier: "主流刚改",
        residentProfile: "罗湖/福田/坂田通勤的教师、医生、公务员、跨境电商及科技白领，生源极纯粹",
        villageGrade: "A",
        villageDistText: "山体与大路隔绝，距下水径民房超 250米+",
        urbanInterface: "A级·山体公园隔离界面（北靠银湖山及社区体育公园，孩子步行350m去麓城外国语小学走内部天桥，完全不接触城中村！）",
        commGrade: "A_STREET",
        samWalk: false,
        purePodium: true,
        podiumType: "三期中心3/4栋下全为纯架空层泛会所(儿童游乐/阅读)，约2万㎡万科里社区商业街位于一期/三期外侧，无油烟扰民",
        supermarketInfo: "社区自带华润万家生鲜超市/麦当劳/面包房 + 步行700米达尚峰益田假日天地MALL；山姆极速达全覆盖",
        wetMarketInfo: "楼下商业街即有钱大妈/生鲜肉菜超市，步行600米可达上水径农贸肉菜市场",
        metroMeters: 400,
        metroStation: "5号线上水径站",
        metroDist: "约 400米 (步行5~6分钟)",
        commuteMins: 23,
        commuteRoute: "5号线上水径 → 1站至五和转10号线 → 2站至贝尔路",
        tenYearBeta: "万科物业+南师大附校80.8%普高率稳坐片区龙头；水径三房总价天花板约460~480万。",
        resilienceGrade: "MID",
        drawdownPct: 27,
        priceCeilingVerify: "2021峰值6.5万→2026回调至4.7~4.9万/㎡(415~445万，回撤27%)，纯商品房护城河深厚。",
        propertyInfo: "万科物业 · 3.98元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 招拍挂净地开发：全盘100%纯商品房，0村民回迁房、0配建保障房，无任何回迁砸盘风险！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯招拍挂商品房)",
        assetTier: "主流刚改",
        residentProfile: "看重鸿荣源建筑品质与园林的改善自住家庭及罗湖/福田/坂田白领，自住率超85%",
        villageGrade: "A",
        villageDistText: "高台地围合，距西侧水径民房约 120米(物理隔离)",
        urbanInterface: "A级·背山高台地隔离（南靠三联山体公园，小区抬高约10米且封闭围合，去上水径地铁站走市政大路不穿村）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "5/6/7栋位于南侧高台纯住宅区(0底商油烟)，约4.5万㎡商业MALL独立分布在东北侧外围",
        supermarketInfo: "自带4.5万㎡【尚峰益田假日天地】购物中心(含大型超市/电影院/餐饮/母婴亲子)；山姆极速达覆盖",
        wetMarketInfo: "益田假日天地大型商超生鲜区+社区钱大妈+步行400米达下水径农贸肉菜市场，老人买菜极便利",
        metroMeters: 500,
        metroStation: "5号线上水径站 / 下水径站",
        metroDist: "约 500米 (步行6~7分钟)",
        commuteMins: 24,
        commuteRoute: "5号线上水径 → 五和转10号线 → 贝尔路站",
        tenYearBeta: "共享南师大龙岗学区+新建54班水径九年一贯制学校，车位与园林稳居水径第一。",
        resilienceGrade: "HIGH",
        drawdownPct: 22,
        priceCeilingVerify: "2021峰值5.7万→2026稳定在4.4~4.7万/㎡(回撤仅22%)，0回迁0保障+豪宅园林使其极抗跌。",
        propertyInfo: "鸿荣源物业 · 3.9元/㎡",
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
        buildingSpacing: "约 60~95米",
        parkingRatio: 0.95,
        parkingLabel: "1:0.95 (基本平衡)",
        purityGrade: "S",
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 全盘100%纯商品房，0村民回迁房、0配建保障房，自住家庭纯粹！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯商品房)",
        assetTier: "主流刚改",
        residentProfile: "罗湖/福田/坂田务实自住家庭、退休长辈协助带娃的二胎家庭",
        villageGrade: "A",
        villageDistText: "南向直面78万㎡石芽岭公园，距东侧局部民房约110米",
        urbanInterface: "A级·石芽岭生态公园北门户（南排6/7/8栋永久无遮挡看山体公园，步行300米去石芽岭学校及地铁站完全不经过城中村）",
        commGrade: "A_STREET",
        samWalk: false,
        purePodium: true,
        podiumType: "北排1/11栋外侧带社区商业裙楼，而南排6/7/8栋楼王下为纯架空层花园，安静无油烟",
        supermarketInfo: "社区裙楼自带华润万家/大型生活超市+周边慢城商业街；山姆极速达与朴朴超市30分钟必达",
        wetMarketInfo: "下楼即钱大妈/百果园/生鲜肉铺，步行500米达南湾农贸肉菜市场，生活成本低且便利",
        metroMeters: 450,
        metroStation: "14号线石芽岭站 / 5号线上水径站",
        metroDist: "约 450米 (步行6分钟)",
        commuteMins: 28,
        commuteRoute: "石芽岭站(或上水径5号线) → 五和转10号线 → 贝尔路(约28分钟)",
        tenYearBeta: "坐拥14号快线石芽岭站+78万㎡公园+石芽岭学校+旁侧54班深大附中南湾新校，345万起买低密纯商品房三房两卫。",
        resilienceGrade: "HIGH",
        drawdownPct: 23,
        priceCeilingVerify: "2021峰值5.2万→2026稳定在3.9~4.2万/㎡(回撤约23%)，0回迁+低总价换手极稳。",
        propertyInfo: "金地/自有物业 · 3.2元/㎡",
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
        hasResettlement: "MIXED",
        hasSubsidized: true,
        resettlementDetail: "⚠️ 旧改综合盘：小区内含高比例村民回迁房及公租/保障房（合计占约42%），虽3栋为纯商品房，但共享花园与紧张车位。",
        purityLabel: "⚠️ B级·高比例回迁房+保障房同园混居(占42%)",
        assetTier: "主流刚改",
        residentProfile: "看重98%超高得房率与14号快线的年轻刚改家庭 + 原村民回迁户 + 保障房住户",
        villageGrade: "B",
        villageDistText: "距周边旧厂房及上李朗民房约 60~100米",
        urbanInterface: "B级·工业区旧改过渡界面（南近石芽岭公园，北近广深铁路，周边仍有旧厂房与民房交织）",
        commGrade: "A_STREET",
        samWalk: false,
        purePodium: true,
        podiumType: "外围裙楼配建约1.5万㎡社区商业街，中央3栋楼王下为纯架空层园林",
        supermarketInfo: "步行500米共享健康花城/承翰慢城商业街商超，14号线1站达布吉或大运商圈；山姆极速达覆盖",
        wetMarketInfo: "自带社区生鲜底商规划+步行500米达周边社区生鲜街市",
        metroMeters: 400,
        metroStation: "14号线快线石芽岭站G口",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 33,
        commuteRoute: "14号线石芽岭→布吉转5→五和转10→贝尔路",
        tenYearBeta: "14号快线石芽岭站+旁侧规划54班深大附中南湾学校；但受限于高比例回迁房抛盘压力与7.1容积率，二手溢价天花板受限。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "新盘折后约4.1万/㎡，按97%得房率折算套内单价仅相当于老盘3.4万/㎡，已通过低价补偿回迁混居短板。",
        propertyInfo: "特发服务 · 约4.2元/㎡",
        schoolKey: "SHIYALING_NW"
      },

      // ---------------- C. 布吉百鸽笼片区 (4盘) ----------------
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
        buildingSpacing: "约 65~110米",
        parkingRatio: 1.02,
        parkingLabel: "1:1.02 (达标)",
        purityGrade: "A",
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: false,
        resettlementDetail: "罗岗旧改大盘：一期/二期含部分原村民回迁房；【三期半山组团】为独立门禁的100%纯商品房，0回迁0保障！",
        purityLabel: "分期纯粹·三期0回迁纯商品房",
        assetTier: "品质改善",
        residentProfile: "罗湖/福田企业主、医生、珠宝商圈高净值家庭及冲刺百合外国语的陪读中产",
        villageGrade: "S",
        villageDistText: "S级·核心区零城中村 (背靠荔山公园+万象汇)",
        urbanInterface: "S级·零民房万象汇半山界面（三期背靠求水山/荔山公园，下楼即32万㎡万象汇与贤义外国语，完全不接触城中村）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "三期半山台地纯住宅架空层(0底商油烟)，通过人行连廊/电梯直通楼下32万㎡华润万象汇MALL！",
        supermarketInfo: "🏆 下楼即【32万㎡布吉华润万象汇】(含大型精品商超/华润万家/全系亲子餐饮) + 步行400米达万科红【盒马鲜生】；山姆极速达覆盖",
        wetMarketInfo: "万象汇生鲜大超市+盒马鲜生+步行450米达罗岗农贸肉菜市场，买菜与逛MALL双满分",
        metroMeters: 300,
        metroStation: "5号线百鸽笼站 (万象汇直通)",
        metroDist: "★ 约 300米 (连廊直通地铁与万象汇!)",
        commuteMins: 26,
        commuteRoute: "5号线百鸽笼站 → 4站直达五和转10号线 → 2站至贝尔路站(约26分钟)",
        tenYearBeta: "布吉/罗湖交界最高端居住综合体（万象汇+贤义外国语+百外名校圈+百鸽笼地铁上盖）；三房天花板520~600万。",
        resilienceGrade: "HIGH",
        drawdownPct: 23,
        priceCeilingVerify: "三期纯商品房89㎡从2021峰值6.9万→2026稳定在5.2~5.5万/㎡(回撤仅23%)，百鸽笼绝对龙头。",
        propertyInfo: "信义物业 · 3.6元/㎡",
        schoolKey: "XIANYI_BGL"
      },
      "信义金御半山·珑门": {
        zone: "布吉百鸽笼",
        isNewBuild: true,
        phaseSummary: "金御半山四期/珑门 (3栋现房新盘)",
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
        purityGrade: "A",
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: false,
        resettlementDetail: "含约10%~15%罗岗旧改回迁选房房源，无政府公租房；2栋中心园景主力户号以纯商品房买家为主。",
        purityLabel: "A级·全新精装现房 (含约12%回迁，0公租房)",
        assetTier: "品质改善",
        residentProfile: "既想要百鸽笼万象汇+贤义/百外学区、又偏好全新精装现房的罗湖/坂田年轻改善家庭",
        villageGrade: "S",
        villageDistText: "S级·万象汇半山核心 (距外围民房超200米)",
        urbanInterface: "S级·万象汇商圈+半山公园界面（与金御半山大社区连片，周边现代繁华，上学与乘地铁全程现代步道）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "组团内侧2栋为纯粹园林架空层，紧邻华润万象汇商圈但无重餐饮排烟直冲",
        supermarketInfo: "🏆 步行300米即达【32万㎡华润万象汇】+ 步行500米达【盒马鲜生】；山姆极速达覆盖",
        wetMarketInfo: "万象汇超市+盒马鲜生+社区门口钱大妈+罗岗肉菜市场，长辈买菜极方便",
        metroMeters: 350,
        metroStation: "5号线百鸽笼站",
        metroDist: "★ 约 350米 (步行5分钟)",
        commuteMins: 26,
        commuteRoute: "5号线百鸽笼站 → 4站至五和转10号线 → 贝尔路站(约26分钟)",
        tenYearBeta: "2025年底全新竣工现房，折后约5.1万/㎡比旁边10年楼龄的金御半山三期二手还便宜。",
        resilienceGrade: "HIGH",
        drawdownPct: 14,
        priceCeilingVerify: "现房折后约5.0~5.2万/㎡（86㎡一卫约415万、95㎡两卫约465万），一二手倒挂安全垫厚。",
        propertyInfo: "信义高定物业 · 4.2元/㎡",
        schoolKey: "XIANYI_BGL"
      },
      "百合世纪广场": {
        zone: "布吉百鸽笼",
        isNewBuild: true,
        phaseSummary: "共2期 (百外教育系开发新房)",
        buildYear: "2025-2026交付(新房)",
        regGen: "GEN2",
        regLabel: "✨ 第2代·百外系新盘",
        usableAvg: "85%~87%",
        plotRatio: 5.6,
        densityGrade: "HIGH",
        densityLabel: "都市综合体密 (容积率5.6)",
        totalFloors: "43~46层",
        elevatorRatio: "3梯5户 / 3梯6户",
        buildingSpacing: "约 50~80米",
        parkingRatio: 1.08,
        parkingLabel: "1:1.08 (充裕)",
        purityGrade: "B",
        hasResettlement: "MIXED",
        hasSubsidized: false,
        resettlementDetail: "⚠️ 百鸽笼旧改项目：一期含较多回迁房；二期2/3栋虽以商品房为主，但全盘回迁房占比约22%~25%。",
        purityLabel: "B级·含约22%村民回迁房 (二期2/3栋较纯粹)",
        assetTier: "品质改善",
        residentProfile: "冲着百合控股(百合外国语/春蕾小学母公司)教育基因与万象汇商圈买入的鸡娃家庭",
        villageGrade: "A",
        villageDistText: "东靠万象汇/荔山，西距京南老街区约100米",
        urbanInterface: "A级·百鸽笼商圈界面（东侧紧邻万象汇与百外世纪小学界面极好，西侧局部靠近老旧街区）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: false,
        podiumType: "综合体裙楼自带约3万㎡商业街区，二期2/3栋空中花园抬高隔离底商",
        supermarketInfo: "🏆 过马路即【32万㎡华润万象汇】+ 紧邻万科红【盒马鲜生】+ 沃尔玛；山姆极速达覆盖",
        wetMarketInfo: "楼下生鲜街市+盒马鲜生+步行350米达罗岗农贸肉菜市场",
        metroMeters: 300,
        metroStation: "5号线百鸽笼站",
        metroDist: "★ 约 300米 (步行4分钟)",
        commuteMins: 26,
        commuteRoute: "5号线百鸽笼站 → 五和转10号线 → 贝尔路站(约26分钟)",
        tenYearBeta: "由深圳民办第一名校“百合外国语”母公司开发，紧邻百外世纪小学，公办对口贤义外国语。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "二期折后约4.7~5.2万/㎡（98㎡大横厅三房两卫约461万起），价格已消化回迁因素。",
        propertyInfo: "百合物业 · 4.3元/㎡",
        schoolKey: "XIANYI_BGL"
      },
      "万科红": {
        zone: "布吉百鸽笼",
        isNewBuild: false,
        phaseSummary: "共4期成熟大盘 (主力三期花园社区)",
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
        parkingLabel: "⚠️ 1:0.88 (三期较好)",
        purityGrade: "A",
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: false,
        resettlementDetail: "罗岗旧改项目：一、二、四期含较多回迁房及小户型公寓（商住一体租客多）；但【三期】为独立大花园纯正商品房住区！",
        purityLabel: "分期纯粹·三期纯正商品房 (一二期商住/回迁)",
        assetTier: "主流刚改",
        residentProfile: "罗湖/福田/坂田年轻首置与刚改白领家庭，看重万科物业、楼下盒马商业与百鸽笼地铁",
        villageGrade: "B",
        villageDistText: "西/北侧距罗岗村/锦龙民房约 60~110米",
        urbanInterface: "B级·成熟街区与局部民房交织（楼下自带盒马鲜生商业街，往东步行400m达万象汇，西侧外围靠近罗岗旧村）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: false,
        podiumType: "一二期为商住一体MALL上盖(较嘈杂)；【三期2/3栋】为独立花园住区，既享隔壁MALL便利又隔绝了底商油烟！",
        supermarketInfo: "🏆 自带約5万㎡万科红生活广场（含【盒马鲜生】主力店/麦当劳/影院）+ 步行400米达【华润万象汇】",
        wetMarketInfo: "下楼即盒马鲜生+钱大妈+步行250米达罗岗传统农贸肉菜市场，买菜便利度满分",
        metroMeters: 400,
        metroStation: "5号线百鸽笼站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 27,
        commuteRoute: "5号线百鸽笼站 → 五和转10号线 → 贝尔路站(约27分钟)",
        tenYearBeta: "百鸽笼330~410万级性价比最高的万科物业大盘，共享万象汇与贤义外国语/百外教育圈。",
        resilienceGrade: "MID",
        drawdownPct: 26,
        priceCeilingVerify: "三期89㎡三房两卫从2021峰值5.8万→2026回调至4.3万/㎡(380~410万，回撤26%)，流通性极好。",
        propertyInfo: "万科物业 · 3.2元/㎡",
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
        purityGrade: "A",
        hasResettlement: "PHASE_ISOLATED",
        hasSubsidized: false,
        resettlementDetail: "含少量旧改回迁房源（集中于外围1/6栋局部，中央3/4栋为纯商品房业主）。",
        purityLabel: "A级·次新商品房为主 (0保障房)",
        assetTier: "主流刚改",
        residentProfile: "大运高校教职工、龙岗中心城体制内人员、东部年轻改善家庭",
        villageGrade: "S",
        villageDistText: "S级·大运核心区 (周边无典型握手楼城中村)",
        urbanInterface: "S级·大运新城界面（紧邻大运中心体育场、大运天地华润商圈与港中大知新学校，上学与地铁全程现代大道）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "3/4栋下为纯粹泳池园林架空层，约4万㎡未来城商业MALL独立位于北侧街区，无油烟扰民",
        supermarketInfo: "自带未来城商业中心+步行500米即达网红地标【华润大运天地MALL】；驱车6分钟达星河【山姆会员店】",
        wetMarketInfo: "楼下钱大妈/生鲜超市齐备，步行600米达黄阁坑农贸肉菜市场，买菜与逛公园兼得",
        metroMeters: 500,
        metroStation: "16号线大运中心站",
        metroDist: "约 500米 (步行6分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        tenYearBeta: "享大运天地华润商圈与港中深附属知新名校，城市界面稳居东部第一梯队。",
        resilienceGrade: "MID",
        drawdownPct: 26,
        priceCeilingVerify: "2021峰值5.6万→2026约4.15万/㎡(回撤26%)；365~400万买次新三房两卫+知新学位。",
        propertyInfo: "佳兆业物业 · 3.9元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 招拍挂净地开发：全盘100%纯商品房，0村民回迁房、0配建保障房，低密纯粹！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯招拍挂低密商品房)",
        assetTier: "品质改善",
        residentProfile: "高校学者、医生、公务员、大运科教城研发人员及改善二胎家庭",
        villageGrade: "S",
        villageDistText: "🏆 S级·方圆800米+零城中村 (高校与公园环绕)",
        urbanInterface: "S级·零城中村纯净新城界面（位于国际大学园与大运体育中心腹地，视野与动线100%纯净现代）",
        commGrade: "A_STREET",
        samWalk: false,
        purePodium: true,
        podiumType: "一期/二期中心3/4栋为100%纯住宅架空层，仅外围沿街带一层精品社区底商(无重油烟餐饮)",
        supermarketInfo: "步行700米达【华润大运天地MALL】，驱车5分钟达星河COCO Park【山姆会员店】；山姆极速达覆盖",
        wetMarketInfo: "社区沿街自带钱大妈/生鲜肉菜超市/果蔬店，日常买菜下楼即解决，环境极干净",
        metroMeters: 650,
        metroStation: "16号线大运中心站",
        metroDist: "约 650米 (步行8分钟)",
        commuteMins: 53,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        tenYearBeta: "3.2超低容积率+2梯4户+0回迁0保障纯商品房属于不可再生稀缺孤品，长线保值力极强。",
        resilienceGrade: "MID",
        drawdownPct: 24,
        priceCeilingVerify: "2021峰值5.3万→2026约4.0万/㎡(回撤24%)；97㎡双龙抱珠户型承接力极强。",
        propertyInfo: "京基物业 · 3.95元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 二、三、四期主力住宅区为100%纯商品房，0村民回迁混居、0保障房配建！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯商品房旗舰)",
        assetTier: "品质改善",
        residentProfile: "龙岗改善型中产、企业高管、华附大运及港中深教职工",
        villageGrade: "S",
        villageDistText: "🏆 S级·方圆800米+零城中村 (摩天都会核心)",
        urbanInterface: "S级·零城中村都会核心界面（与大运枢纽、COCO Park、华附大运连成现代摩天都市界面，完全无农民房）",
        commGrade: "S_MALL",
        samWalk: true,
        purePodium: true,
        podiumType: "二/三期为独立封闭住宅花园，约10万㎡颐安商业与星河COCO Park通过空中连廊衔接，住宅楼下无油烟",
        supermarketInfo: "🏆 步行500米直通星河COCO Park【山姆会员店实体店】！且自带约10万㎡旗舰商业MALL",
        wetMarketInfo: "山姆会员店+永辉/大型生鲜超市+社区钱大妈，高端采购与日常买菜一步到位",
        metroMeters: 450,
        metroStation: "大运枢纽站 (3/14/16/深大城际)",
        metroDist: "约 450米 (步行6分钟)",
        commuteMins: 44,
        commuteRoute: "大运枢纽(14号快线2站到布吉)→转5→五和转10",
        tenYearBeta: "大运枢纽四轨交汇(含深大城际)+10万㎡商业+华附大运名校，大运确定性最高标杆。",
        resilienceGrade: "HIGH",
        drawdownPct: 21,
        priceCeilingVerify: "🏆 2021峰值5.7万→2026稳定在4.5万/㎡(回撤仅21%)，大运抗跌标杆。",
        propertyInfo: "颐安物业 · 3.9元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 招拍挂净地开发：100%纯商品房高层+联排别墅，0回迁房、0保障房！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯商品房+别墅)",
        assetTier: "品质改善",
        residentProfile: "别墅区为企业主，高层区为资深中产与深中龙岗陪读高净值家庭",
        villageGrade: "S",
        villageDistText: "🏆 S级·零城中村山姆商圈界面 (>600米无民房)",
        urbanInterface: "S级·零城中村山姆商圈界面（下楼即星河COCO Park与山姆会员店，跨过马路即大运枢纽，完全无民房）",
        commGrade: "S_MALL",
        samWalk: true,
        purePodium: true,
        podiumType: "5/6/7栋南看别墅区纯住宅(0底商油烟)，8万㎡星河COCO Park与山姆会员店独立在小区东侧一路之隔！",
        supermarketInfo: "🏆 全深圳罕见：下楼步行200米即达【山姆会员店(龙岗店)实体店】+ 8万㎡【星河COCO Park】！",
        wetMarketInfo: "下楼即山姆会员店生鲜区+社区钱大妈+步行500米达爱联农贸肉菜市场，中西生鲜顶配",
        metroMeters: 550,
        metroStation: "大运枢纽站 / 3号线爱联站",
        metroDist: "约 550米 (步行7分钟)",
        commuteMins: 45,
        commuteRoute: "大运站(14号快线)→布吉转5→五和转10→贝尔路",
        tenYearBeta: "占据“深中龙岗第一名校+山姆实体店+2.6超低容积率+0回迁纯商品房”四大核心锚点。",
        resilienceGrade: "HIGH",
        drawdownPct: 19,
        priceCeilingVerify: "🏆 全表二手抗跌总冠军！2021峰值6.3万→2026稳定在5.1万/㎡(回撤仅19%)。",
        propertyInfo: "星河智善生活 · 3.5元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 招拍挂净地开发：全盘100%纯商品房，0村民回迁房、0配建保障房！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯招拍挂商品房)",
        assetTier: "刚需上车",
        residentProfile: "看重港中大知新学位的年轻首置刚需家庭、本地上班族及带娃老人",
        villageGrade: "A",
        villageDistText: "南近大运公园，东北距黄阁坑旧村约 150米+",
        urbanInterface: "A级·南优北杂界面（南侧靠近大运体育馆与公园界面好，去港中大知新学校与地铁站不穿城中村）",
        commGrade: "A_STREET",
        samWalk: false,
        purePodium: true,
        podiumType: "一期3/4栋及二期12/15栋深居大花园正中央(0底商)，外围四周为一圈极其成熟的社区商业街",
        supermarketInfo: "自带华润万家/天虹微喔+步行800米达大运天地MALL；山姆极速达覆盖(驱车8分钟达星河山姆)",
        wetMarketInfo: "大社区外围自带超10家生鲜肉菜铺/钱大妈+步行300米达福安农贸肉菜市场，老人买菜极为便利",
        metroMeters: 550,
        metroStation: "16号线龙城公园站 / 黄阁坑站",
        metroDist: "约 550米 (步行7分钟)",
        commuteMins: 56,
        commuteRoute: "16号线→大运转14→布吉转5→五和转10",
        tenYearBeta: "大运200~260万级低门槛0回迁纯商品房+港中大知新学区大盘，刚需接盘底座极大。",
        resilienceGrade: "LOW",
        drawdownPct: 33,
        priceCeilingVerify: "2021峰值4.3万→2026回调至2.85万/㎡(回撤33%)，目前240万买三房两卫已见底企稳。",
        propertyInfo: "中海物业 · 2.95元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: false,
        resettlementDetail: "🏆 2024招拍挂纯商品房净地：0村民回迁房、0人才房、0公租房，起步即126㎡纯大户！",
        purityLabel: "★ S级·0回迁+0保障 (100%纯大户型商品房)",
        assetTier: "品质改善",
        residentProfile: "企业主、科技高管、大学教授、龙岗终极改善换房家庭(126㎡/555万起)",
        villageGrade: "S",
        villageDistText: "🏆 S级·方圆800米+零城中村 (大运天地商圈旁)",
        urbanInterface: "S级·零城中村顶配新城界面（紧邻大运天地商圈、大运公园与龙外本部，100%纯净现代豪宅区）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "🏆 100%纯住宅高定会所架空层（零杂乱底商、零餐饮油烟），出小区过马路即享大运天地旗舰商业！",
        supermarketInfo: "🏆 下楼步行300米即达6.5万㎡公园式商业地标【华润大运天地MALL】，驱车5分钟达星河【山姆会员店】",
        wetMarketInfo: "大运天地精品大超市+周边高端社区生鲜店+山姆极速达30分钟送达",
        metroMeters: 400,
        metroStation: "16号线大运中心站 / 文曲站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        tenYearBeta: "大运绝版0回迁0保障宅地+2024二批新规+1:1.73车位比，定义龙岗未来10年豪宅新天花板。",
        resilienceGrade: "HIGH",
        drawdownPct: 10,
        priceCeilingVerify: "2025.12开盘新盘逆市热销，验证顶端改善客群对“零回迁零保障”纯粹好房的支付力。",
        propertyInfo: "中海高定物业 · 5.98元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: true,
        resettlementDetail: "招拍挂TOD净地：全盘【0村民回迁房】！仅含1栋独立可售型人才房(约22%)，无回迁抛盘压价风险。",
        purityLabel: "A级·0村民回迁房 (含1栋独立人才房)",
        assetTier: "主流刚改",
        residentProfile: "依赖14号快线/深大城际跨区通勤的年轻中产家庭、深铁及国企员工",
        villageGrade: "S",
        villageDistText: "🏆 S级·零城中村TOD枢纽界面 (>600米无民房)",
        urbanInterface: "S级·零城中村TOD枢纽界面（大运综合交通枢纽上盖，周边为颐安都会中央与规划72班学校、商业综合体）",
        commGrade: "S_MALL",
        samWalk: true,
        purePodium: true,
        podiumType: "TOD空中花园将住宅与底部约6.8万㎡深铁商业MALL上下物理分隔，2/3单元看花园无油烟",
        supermarketInfo: "🏆 自带6.8万㎡深铁商业MALL + 步行600米直达星河COCO Park【山姆会员店实体店】+ 颐安MALL！",
        wetMarketInfo: "步行600米去山姆会员店采购+楼下MALL大型生鲜超市+旁侧爱联农贸市场",
        metroMeters: 150,
        metroStation: "大运综合交通枢纽 (3/14/16/深大城际)",
        metroDist: "🏆 约 150米 (下楼直通四轨枢纽，全表最近!)",
        commuteMins: 42,
        commuteRoute: "下楼直通14号快线(2站到布吉)→转5→五和转10",
        tenYearBeta: "大运四轨交汇枢纽(3/14/16/深大城际)+自带商业与72班九年一贯制新校。",
        resilienceGrade: "HIGH",
        drawdownPct: 15,
        priceCeilingVerify: "折后336~410万买大运枢纽精装98~102㎡三房两卫，比周边次新二手还便宜。",
        propertyInfo: "深铁物业 · 约4.5元/㎡",
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
        hasResettlement: "ZERO",
        hasSubsidized: true,
        resettlementDetail: "招拍挂净地：全盘【0村民回迁房】（无村民二手抛售砸盘）！但配建有约38%政府保障性租赁/安居房。",
        purityLabel: "B级·0村民回迁房 / 含约38%配建保障房",
        assetTier: "主流刚改",
        residentProfile: "看重国企现房交付、港中大道远学校目送式教育与大运中心配套的务实刚改家庭",
        villageGrade: "S",
        villageDistText: "🏆 S级·方圆800米+零城中村 (大运科教城腹地)",
        urbanInterface: "S级·零城中村大运科教城界面（一路之隔即港中大附属道远学校，近大运天地与体育中心，完全无农民房）",
        commGrade: "S_MALL",
        samWalk: false,
        purePodium: true,
        podiumType: "2/3/6栋下为纯架空层园林，外围带少量约6000㎡便民社区底商，干净整洁",
        supermarketInfo: "步行450米即达【华润大运天地MALL】与佳兆业未来城商业；驱车6分钟达星河【山姆会员店】",
        wetMarketInfo: "自带社区生鲜超市+共享旁边京基/佳兆业钱大妈生鲜街市",
        metroMeters: 400,
        metroStation: "16号线大运中心站",
        metroDist: "约 400米 (步行5分钟)",
        commuteMins: 52,
        commuteRoute: "16号线大运中心→大运转14→布吉转5→五和转10",
        tenYearBeta: "享大运中心配套与高校附属教育红利；虽含38%保障房，但0村民回迁且城市界面极佳。",
        resilienceGrade: "HIGH",
        drawdownPct: 16,
        priceCeilingVerify: "深业国企现房折后299万买89㎡一卫、337万买99㎡大横厅两卫，自住性价比突出。",
        propertyInfo: "深业物业 · 约4.3元/㎡",
        schoolKey: "CUHK_ZHIXIN"
      }
    };

    // =========================================================================
    // 3. 微观户号数据库 (UNITS_DATA)
    // =========================================================================
    const UNITS_DATA = [
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
        twoKidsNote: "华为研发圈层核心盘！选三期2/3栋完美避开一期回迁房与底商油烟；步行300米入10号线1~2站直达贝尔路站，下楼华润万家+350米岗头菜市场。",
        scores: { quiet: 95, edu: 85, commute: 99, space: 88, comm: 91, asset: 89 },
        unitResettleCheck: "✅ 三期2/3栋为100%纯商品房（已避开一期回迁房楼栋）",
        unitVillageCheck: "✅ 朝向三期内部中央泳池园林，完全看不到外围岗头民房",
        unitCommNoiseCheck: "✅ 2/3栋正下方为纯住宅架空层，远离外围商业街餐饮排烟口与超市卸货区"
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
        twoKidsNote: "比三期楼王省40万，紧邻深大附坂田学校与300米地铁口，太太通勤仅10分钟。",
        scores: { quiet: 80, edu: 85, commute: 98, space: 78, comm: 84, asset: 87 },
        unitResettleCheck: "⚠️ 二期纯商品房为主，一期含部分村民回迁房（建议优先选二期2栋）",
        unitVillageCheck: "✅ 阳台看花园内侧，距外围民房超150米",
        unitCommNoiseCheck: "⚠️ 一二期裙楼沿街商铺较多，建议选10层以上中高区以规避底商喧哗"
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
        twoKidsNote: "坂田改善与抗跌王牌(回撤仅22%)！五期0回迁0保障+自带天虹商场+科技城外国语学校+步行450米坂田北站2站直达贝尔路站。",
        scores: { quiet: 95, edu: 92, commute: 96, space: 89, comm: 94, asset: 94 },
        unitResettleCheck: "✅ 五期/七期为独立围合100%纯商品房（已避开一二期回迁房）",
        unitVillageCheck: "✅ 深居百米楼距皇家园林正中央，距外围坂田民房超200米零干扰",
        unitCommNoiseCheck: "✅ 12/13栋深居中央无底商，步行出花园即达信义天虹商场与钱大妈生鲜街"
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
        twoKidsNote: "450万级入主信义嘉御山内园+科外名校+天虹超市+14分钟贝尔路通勤。",
        scores: { quiet: 91, edu: 92, commute: 95, space: 78, comm: 89, asset: 92 },
        unitResettleCheck: "⚠️ 三期纯商品房，二期含少量回迁房源（建议优先挑三期8栋）",
        unitVillageCheck: "✅ 朝向内部花园，由外围楼栋隔离外部民房街区",
        unitCommNoiseCheck: "✅ 内圈楼栋无沿街餐饮底商，下楼离天虹超市与菜市场更近"
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
        twoKidsNote: "对口四大名校直管【深实验坂田校区】(九年一贯直升，公办率77.5%)+步行400米光雅园站3站到贝尔路；下楼50米即菜市场但贴城中村。",
        scores: { quiet: 91, edu: 96, commute: 94, space: 86, comm: 76, asset: 82 },
        unitResettleCheck: "✅ 二期为纯正商品房（已避开一期配建/回迁楼栋）",
        unitVillageCheck: "⚠️ 小区东南侧紧贴光雅园村(20米)，务必选2/3栋中高区看内园户号以避开民房视野",
        unitCommNoiseCheck: "⚠️ 外围带社区底商与光雅园菜市场，选内侧2/3栋15层以上可隔绝街市喧闹"
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
        twoKidsNote: "坂田界面最干净的次新大盘，自带4.5万㎡购物中心+家门口深大附坂田学校，96㎡实得78.7㎡，太太通勤16分钟。",
        scores: { quiet: 94, edu: 85, commute: 92, space: 92, comm: 93, asset: 90 },
        unitResettleCheck: "✅ 一期3/5栋及二期2栋为纯正商品房楼栋（与边角回迁单元分离）",
        unitVillageCheck: "✅ 楼下即4.5万㎡现代MALL与深大附坂田学校，上学与地铁动线完全不经过城中村",
        unitCommNoiseCheck: "✅ 4.5万㎡大族MALL独立成区，一期3/5栋位于纯住宅花园中央，无油烟且逛MALL极方便"
      },
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
        usableArea: 73,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距布龙路195米",
        roadDistMeters: "距布龙路主干道及高架约195米、距水径路约110米",
        specialNoise: "无铁路/无高架直射，前后双园林及5/6栋遮挡布龙路噪音（约41~45dB）",
        minPrice: 415,
        maxPrice: 445,
        priceRange: "415~445 万",
        twoKidsNote: "0回迁+0保障+山体公园隔绝城中村！步行350m达麓城外国语小学+南师大龙岗初中(公办率80.8%)，步行400m入地铁23分钟达贝尔路！",
        scores: { quiet: 96, edu: 95, commute: 90, space: 86, comm: 95, asset: 88 },
        unitResettleCheck: "🏆 三期全盘0村民回迁房、0保障房（100%纯商品房）",
        unitVillageCheck: "🏆 北靠银湖山与体育公园，孩子过内部天桥350m直达麓城外国语小学，完全隔绝城中村！",
        unitCommNoiseCheck: "🏆 3/4栋下为纯架空层儿童泛会所(0底商油烟)，出大堂步行150米即达社区华润万家与钱大妈"
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
        twoKidsNote: "380万级上车万科0回迁纯商品房+麓城外国语+南师大龙岗学校(公办率80.8%)，唯单卫需错峰。",
        scores: { quiet: 76, edu: 95, commute: 90, space: 74, comm: 93, asset: 87 },
        unitResettleCheck: "🏆 三期全盘0村民回迁房、0保障房（100%纯商品房）",
        unitVillageCheck: "✅ 周边为万科四期大城与山体公园，不靠近城中村握手楼",
        unitCommNoiseCheck: "✅ 靠近社区万科里便民商业街(面包店/钱大妈/药房)，买菜极方便且无重油烟大排档"
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
        twoKidsNote: "水径抗跌王(回撤仅22%)！0回迁0保障+自带4.5万㎡益田假日天地MALL+车位比1:1.05+南师大附校(公办率80.8%)，去贝尔路24分钟。",
        scores: { quiet: 97, edu: 92, commute: 88, space: 89, comm: 97, asset: 91 },
        unitResettleCheck: "🏆 招拍挂净地：全盘0村民回迁房、0保障房（100%纯商品房）",
        unitVillageCheck: "🏆 6A/6B/5栋南靠三联山体公园、北看中央泳池，高台地物理隔绝西侧远端水径民房",
        unitCommNoiseCheck: "🏆 6A/6B/5栋下为纯架空层园林(0底商油烟)，而东北侧自带4.5万㎡益田假日天地MALL，动静分离完美！"
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
        usableArea: 73,
        orientation: "西南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距布龙路180米",
        roadDistMeters: "7栋距布龙路180米靠南侧山体；3A栋距西环路支线约45米但看内园",
        specialNoise: "无铁路/高架，7栋伴山听鸟鸣极安静（约43~47dB）",
        minPrice: 360,
        maxPrice: 390,
        priceRange: "360~390 万",
        twoKidsNote: "360~385万买鸿荣源0回迁纯商品房园林+自带MALL+南师大附校共享学区+24分钟贝尔路通勤。",
        scores: { quiet: 91, edu: 92, commute: 88, space: 77, comm: 95, asset: 90 },
        unitResettleCheck: "🏆 全盘0村民回迁房、0保障房（100%纯商品房）",
        unitVillageCheck: "✅ 高台地封闭大花园，7栋直看南侧山体公园与内园",
        unitCommNoiseCheck: "✅ 7栋无底商极安静，3A栋下楼即益田假日天地MALL与钱大妈生鲜店"
      },
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
        roadDistMeters: "位于小区南侧及中央腹地，距北侧布龙路主干道超210米（另有3/5/9栋86㎡一卫308~338万）",
        specialNoise: "无铁路/无高架，背靠78万㎡石芽岭生态公园鲜氧环绕（约41~44dB）",
        minPrice: 345,
        maxPrice: 380,
        priceRange: "345~380 万 (86㎡版308万起)",
        twoKidsNote: "石芽岭宝藏盘！容积率3.8低密+0回迁0保障，仅350~375万买正南看石芽岭公园三房两卫楼王！楼下华润万家+钱大妈，步行450米达14号线石芽岭站。",
        scores: { quiet: 95, edu: 82, commute: 84, space: 88, comm: 94, asset: 89 },
        unitResettleCheck: "🏆 全盘0村民回迁房、0保障房（100%纯商品房低密住区）",
        unitVillageCheck: "🏆 6/7/8栋南向直面78万㎡石芽岭山体公园与学校，视野与上学动线100%无城中村！",
        unitCommNoiseCheck: "✅ 商业裙楼(华润万家/钱大妈)集中在北排1/11栋外侧，南排6/7/8栋下为纯架空层0油烟"
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
        twoKidsNote: "微观户型满分（96㎡套内实得94㎡大横厅！步行400m入石芽岭站）；但需接受小区含42%回迁/保障房及0.73车位比。",
        scores: { quiet: 93, edu: 82, commute: 78, space: 99, comm: 68, asset: 83 },
        unitResettleCheck: "🚨 3栋本栋为纯商品房，但小区整体含约42%回迁房与保障房（共享花园与0.73车位）",
        unitVillageCheck: "⚠️ 3栋看社区内园，但小区外围北/西侧靠近旧工业区与上李朗民房过渡带",
        unitCommNoiseCheck: "✅ 3栋位于社区正中央纯架空层，与外围沿街底商保持安全距离"
      },
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
        roadDistMeters: "背靠求水山/荔山生态公园，距罗岗路及龙岗大道均超180米（一期86㎡一卫395万起）",
        specialNoise: "无任何铁路/高架/干道干扰，半山台地森林环抱（40~43dB极静）",
        minPrice: 460,
        maxPrice: 510,
        priceRange: "460~510 万 (一期一卫395万起)",
        twoKidsNote: "百鸽笼品质与商业天花板！三期0回迁纯商品房+下楼32万㎡万象汇/盒马/罗岗菜场+贤义外国语/百外名校圈+300米入地铁26分钟达贝尔路！",
        scores: { quiet: 96, edu: 93, commute: 88, space: 90, comm: 98, asset: 94 },
        unitResettleCheck: "✅ 三期为独立门禁的100%纯商品房豪宅组团（已完美隔离一期罗岗回迁房）",
        unitVillageCheck: "🏆 背靠荔山公园、下楼即32万㎡万象汇与贤义外国语学校，视野与动线零城中村！",
        unitCommNoiseCheck: "🏆 三期半山纯住架空层0底商油烟，通过连廊/电梯300米直通楼下32万㎡华润万象汇与百鸽笼地铁站！"
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
        roadDistMeters: "位于珑门组团内侧，看半山园林，距外围道路约125米（86㎡一卫约415~438万）",
        specialNoise: "无铁路/高架，全新精装现房配高标双层中空隔音玻璃（约42~45dB）",
        minPrice: 448,
        maxPrice: 485,
        priceRange: "448~485 万 (86㎡版415万起)",
        twoKidsNote: "2025年底全新竣工现房！单价5.1万/㎡比金御半山三期二手还便宜，步行350米入百鸽笼站，享万象汇+盒马+贤义外国语+百外生态！",
        scores: { quiet: 92, edu: 93, commute: 87, space: 92, comm: 94, asset: 93 },
        unitResettleCheck: "✅ 0公租/保障房，含约12%旧改回迁选房房源，2栋中心园景以纯商品房买家为主",
        unitVillageCheck: "🏆 位于金御半山与万象汇之间，现代都市界面，远离城中村握手楼",
        unitCommNoiseCheck: "✅ 2栋内园无重餐饮底商，步行300米即达32万㎡华润万象汇与盒马鲜生"
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
        twoKidsNote: "由深圳第一民办名校【百合外国语】母公司开发！楼下即百外世纪小学+万象汇+300米百鸽笼站，98㎡大横厅三房两卫。",
        scores: { quiet: 91, edu: 93, commute: 88, space: 92, comm: 88, asset: 91 },
        unitResettleCheck: "⚠️ 旧改盘全盘含约22%村民回迁房（主要集中在一期，选房建议锁定二期2/3栋纯商品房楼座）",
        unitVillageCheck: "✅ 东侧紧邻万象汇与百外世纪小学现代界面，二期2/3栋看内园避开了西侧老街区",
        unitCommNoiseCheck: "✅ 空中花园抬高隔离裙楼商业，过马路即万象汇与盒马鲜生，步行300米入百鸽笼地铁站"
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
        roadDistMeters: "位于万科红三期围合大花园中心，距惠康路及锦龙路约130米（一/四期83㎡一卫330万起）",
        specialNoise: "无铁路/高架，楼下自带盒马鲜生商业但三期住宅独立围合隔音佳（约44~47dB）",
        minPrice: 375,
        maxPrice: 415,
        priceRange: "375~415 万 (83㎡一卫330万起)",
        twoKidsNote: "380~410万即可拥有：万科红三期纯商品房花园 + 下楼盒马鲜生/罗岗菜市场 + 步行400m万象汇/百鸽笼站 + 贤义外国语学位！",
        scores: { quiet: 90, edu: 92, commute: 86, space: 86, comm: 90, asset: 88 },
        unitResettleCheck: "✅ 三期为独立围合大花园纯正商品房住区（已避开一、二、四期回迁房与商住公寓）",
        unitVillageCheck: "✅ 三期2/3栋看中心花园，往东步行400m去万象汇与贤义外国语学校走市政大道不进村",
        unitCommNoiseCheck: "✅ 一二期为盒马MALL商住上盖较吵；选【三期2/3栋】既可下楼逛盒马与罗岗菜场，又完全无底商油烟！"
      },
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
        usableArea: 73,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距如意路140米",
        roadDistMeters: "距如意路主干道约140米、距龙飞大道约160米（2/5栋靠支路350万起）",
        specialNoise: "无铁路/无地铁高架，内园安静（约42~46dB）",
        minPrice: 350,
        maxPrice: 405,
        priceRange: "350~405 万",
        twoKidsNote: "S级大运新城界面 + 步行500m逛华润大运天地 + 港中大知新九年一贯制(公办率75%)！唯太太去贝尔路地铁需52分钟。",
        scores: { quiet: 93, edu: 91, commute: 48, space: 86, comm: 92, asset: 89 },
        unitResettleCheck: "✅ 3/4栋中心楼座为纯商品房（仅外围局部楼栋含少量旧改回迁房源，0保障房）",
        unitVillageCheck: "🏆 S级大运中心核心界面，周边为大运场馆、大运天地商圈与港中大知新学校，无握手楼城中村",
        unitCommNoiseCheck: "✅ 3/4栋下为纯泳池架空层无底商，步行500米即达网红地标【华润大运天地MALL】"
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
        twoKidsNote: "纯粹度与低密满分：0回迁+0保障+零城中村高校界面+3.2超低容积率+2梯4户+1:1.11车位比+97㎡正南双龙抱珠+港中大知新/道远学位！",
        scores: { quiet: 95, edu: 91, commute: 46, space: 93, comm: 96, asset: 92 },
        unitResettleCheck: "🏆 招拍挂净地：全盘0村民回迁房、0配建保障房（100%纯商品房）",
        unitVillageCheck: "🏆 方圆800米内全是大运场馆、国际大学园与公园，100%零城中村纯净界面！",
        unitCommNoiseCheck: "🏆 中心3/4栋100%纯住架空层0底商油烟，外围带钱大妈生鲜店，步行700米达大运天地MALL"
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
        usableArea: 73,
        orientation: "东南",
        noiseLevel: "QUIET",
        noiseLabel: "不临街 · 距龙岗大道200米+",
        roadDistMeters: "深居二/三期园林内侧，距龙岗大道及3号线高架超200米、距黄阁路140米",
        specialNoise: "彻底隔绝3号线地铁高架轨行噪音与大道车流（约42~45dB）",
        minPrice: 385,
        maxPrice: 430,
        priceRange: "385~430 万",
        twoKidsNote: "大运抗跌标杆(回撤仅21%)！0回迁0保障+步行500米逛山姆会员店实体店+下楼即华附大运名校(公办率77.5%)，14号快线去贝尔路44分钟。",
        scores: { quiet: 94, edu: 94, commute: 62, space: 88, comm: 98, asset: 96 },
        unitResettleCheck: "🏆 二期/三期/四期全盘0村民回迁房、0配建保障房（100%纯商品房改善大盘）",
        unitVillageCheck: "🏆 方圆800米内全为摩天综合体、大运枢纽与华附大运学校，100%零城中村！",
        unitCommNoiseCheck: "🏆 二/三期内圈0餐饮底商，连廊步行500米直通星河COCO Park【山姆会员店实体店】与自家10万㎡MALL！"
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
        twoKidsNote: "全表二手抗跌总冠军(回撤仅19%)！下楼200米即山姆会员店实体店+容积率2.6别墅级低密+0回迁0保障+深中龙岗顶级学位(公办率81.5%)！",
        scores: { quiet: 96, edu: 98, commute: 60, space: 91, comm: 99, asset: 98 },
        unitResettleCheck: "🏆 招拍挂净地：全盘0村民回迁房、0配建保障房（100%纯商品房+别墅）",
        unitVillageCheck: "🏆 南向俯瞰联排别墅区，下楼即山姆与COCO Park，方圆600米+零城中村！",
        unitCommNoiseCheck: "🏆 5/6/7栋纯住0底商油烟，出小区东门200米即达【山姆会员店实体店】与8万㎡COCO Park！"
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
        twoKidsNote: "240~265万买容积率3.6、0回迁0保障纯商品房正南双龙抱珠三房两卫+港中大知新名校(公办率75%)！老人下楼买菜极方便。",
        scores: { quiet: 92, edu: 91, commute: 42, space: 84, comm: 89, asset: 82 },
        unitResettleCheck: "🏆 招拍挂净地：全盘0村民回迁房、0配建保障房（100%纯商品房）",
        unitVillageCheck: "✅ 中心楼栋看大花园，去港中大知新学校与地铁站走市政大路不经过城中村",
        unitCommNoiseCheck: "✅ 中心3/4/12/15栋下无任何商铺，外围四周则有超10家钱大妈/生鲜肉菜店与福安菜市场"
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
        twoKidsNote: "龙岗终极改善天花板！0回迁0保障+126㎡高净值圈层+下楼300m华润大运天地+车位比1:1.73+套内实得118㎡！",
        scores: { quiet: 97, edu: 80, commute: 50, space: 99, comm: 99, asset: 97 },
        unitResettleCheck: "🏆 2024纯招拍挂净地：0村民回迁房、0人才房、0公租房（100%纯大户型商品房）",
        unitVillageCheck: "🏆 S级大运天地商圈与大运公园旁，方圆800米+零城中村握手楼！",
        unitCommNoiseCheck: "🏆 全盘100%纯住宅会所架空层(零底商油烟)，步行300米过马路即达【华润大运天地MALL】！"
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
        twoKidsNote: "距地铁仅150米(下楼2分钟入大运枢纽)+步行600m逛山姆实体店+自带6.8万㎡MALL+0村民回迁房！去贝尔路42分钟。",
        scores: { quiet: 90, edu: 90, commute: 68, space: 93, comm: 93, asset: 92 },
        unitResettleCheck: "✅ 招拍挂TOD净地：全盘0村民回迁房（无回迁抛盘压价，仅含1栋独立可售人才房）",
        unitVillageCheck: "🏆 大运四轨枢纽上盖，周边为颐安都会中央与72班规划新校，零城中村！",
        unitCommNoiseCheck: "🏆 抬高式空中花园隔离底部6.8万㎡深铁商业MALL，步行600米直达星河【山姆会员店实体店】！"
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
        twoKidsNote: "0村民回迁房+零城中村科教城界面+步行450m逛大运天地MALL+400m入地铁+一路之隔港中大道远学校；注意含约38%配建保障房。",
        scores: { quiet: 95, edu: 89, commute: 50, space: 92, comm: 86, asset: 88 },
        unitResettleCheck: "✅ 招拍挂净地：全盘0村民回迁房（2/3/6栋为纯商品房，其它楼座含约38%政府保障房）",
        unitVillageCheck: "🏆 大运国际大学园与体育中心腹地，马路对面即港中大道远学校，方圆800米+零城中村！",
        unitCommNoiseCheck: "✅ 2/3栋中央纯架空层无底商油烟，步行450米达【华润大运天地MALL】，步行400米入大运中心地铁站"
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
        scores: { quiet: 90, edu: 82, commute: 82, space: 78, comm: 91, asset: 88 },
        unitResettleCheck: "🏆 全盘0村民回迁房、0保障房（100%纯商品房）",
        unitVillageCheck: "✅ 朝向社区中心花园，步行去石芽岭学校不经过城中村",
        unitCommNoiseCheck: "✅ 中圈楼栋无沿街餐饮底商"
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
        scores: { quiet: 32, edu: 82, commute: 82, space: 76, comm: 85, asset: 82 },
        unitResettleCheck: "🏆 全盘0村民回迁房、0保障房",
        unitVillageCheck: "✅ 无城中村包夹，但北侧直面布龙路干道",
        unitCommNoiseCheck: "⚠️ 北排外侧带社区商业裙楼且临大路"
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
        scores: { quiet: 92, edu: 93, commute: 85, space: 79, comm: 94, asset: 92 },
        unitResettleCheck: "⚠️ 一二期含部分罗岗旧改回迁房源（三期为100%纯商品房）",
        unitVillageCheck: "🏆 紧邻万象汇与贤义外国语学校，无城中村穿行",
        unitCommNoiseCheck: "✅ 内园楼座隔绝外街商铺喧闹"
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
        scores: { quiet: 35, edu: 85, commute: 98, space: 85, comm: 84, asset: 84 },
        unitResettleCheck: "✅ 三期为纯商品房组团",
        unitVillageCheck: "⚠️ 外圈高区可远眺东北侧岗头民房与厂房",
        unitCommNoiseCheck: "⚠️ 外围紧贴干道与沿街底商"
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
        scores: { quiet: 32, edu: 95, commute: 88, space: 73, comm: 85, asset: 83 },
        unitResettleCheck: "🏆 三期全盘0回迁0保障",
        unitVillageCheck: "✅ 无城中村干扰，但受布龙路干道噪音直冲",
        unitCommNoiseCheck: "✅ 无餐饮底商油烟"
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
        scores: { quiet: 89, edu: 82, commute: 75, space: 95, comm: 72, asset: 83 },
        unitResettleCheck: "🚨 3栋本栋为商品房，但社区整体含约42%回迁房与保障房",
        unitVillageCheck: "⚠️ 周边处于旧工业区城市更新过渡阶段",
        unitCommNoiseCheck: "✅ 3栋位于内园架空层无底商"
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
        scores: { quiet: 92, edu: 91, commute: 47, space: 79, comm: 96, asset: 91 },
        unitResettleCheck: "🏆 招拍挂净地：全盘0村民回迁房、0配建保障房",
        unitVillageCheck: "🏆 方圆800米+零城中村纯净科教城界面",
        unitCommNoiseCheck: "✅ 看中央水景花园无底商油烟"
      }
    ];

    // 默认四大片区代表盘 PK 池
    let compareIds = ["bt-xinyi-5-89", "vanke-3-89", "horoy-6-89", "bgl-banshan-3-89", "galaxy-6-89"];

    // =========================================================================
    // 4. 全局单一数据源过滤逻辑（宏观12维过滤 -> 自动向下穿透至微观户号池）
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

    function matchCommercialFilter(macro, filterVal) {
      if (filterVal === "ALL") return true;
      if (filterVal === "S_MALL") return macro.commGrade === "S_MALL";
      if (filterVal === "SAM_WALK") return macro.samWalk === true;
      if (filterVal === "PURE_PODIUM") return macro.purePodium === true;
      return true;
    }

    function matchPurityFilter(macro, filterVal) {
      if (filterVal === "ALL") return true;
      if (filterVal === "PURE_ZERO") return macro.hasResettlement === "ZERO" && !macro.hasSubsidized;
      if (filterVal === "NO_RESETTLE") return macro.hasResettlement === "ZERO";
      if (filterVal === "CLEAN_PHASE") return macro.purityGrade === "S" || macro.purityGrade === "A";
      return true;
    }

    // 统一判定某个小区是否满足【视角二：12维宏观社区过滤】
    function isCommunityPassingMacro(projectName) {
      const m = COMMUNITIES_MACRO[projectName];
      if (!m) return false;
      const school = SCHOOL_DISTRICTS[m.schoolKey];
      const zoneF = byId("macroZoneFilter").value;
      const newOldF = byId("macroNewOldFilter").value;
      const regF = byId("macroRegFilter").value;
      const pureF = byId("macroPurityFilter").value;
      const villageF = byId("macroVillageFilter").value;
      const commF = byId("macroCommFilter").value;
      const metroF = Number(byId("macroMetroDistFilter").value);
      const densityF = byId("macroDensityFilter").value;
      const parkingF = byId("macroParkingFilter").value;
      const tierF = byId("macroTierFilter").value;
      const schoolRateF = Number(byId("macroSchoolRateFilter").value);
      const resilienceF = byId("macroResilienceFilter").value;

      if (zoneF !== "ALL" && m.zone !== zoneF) return false;
      if (newOldF === "NEW" && !m.isNewBuild) return false;
      if (newOldF === "SECOND" && m.isNewBuild) return false;
      if (regF !== "ALL" && m.regGen !== regF) return false;
      if (!matchPurityFilter(m, pureF)) return false;
      if (villageF === "S" && m.villageGrade !== "S") return false;
      if (villageF === "A" && m.villageGrade === "B") return false;
      if (!matchCommercialFilter(m, commF)) return false;
      if (m.metroMeters > metroF) return false;
      if (densityF === "LOW" && m.plotRatio > 3.8) return false;
      if (densityF === "MID" && m.plotRatio > 4.8) return false;
      if (parkingF !== "ALL" && m.parkingRatio < Number(parkingF)) return false;
      if (tierF !== "ALL" && m.assetTier !== tierF) return false;
      if (school.publicHighRate < schoolRateF) return false;
      if (resilienceF === "HIGH" && m.resilienceGrade !== "HIGH") return false;
      if (resilienceF === "MID" && m.resilienceGrade === "LOW") return false;
      return true;
    }

    function matchPriceFilter(unit) {
      const bracket = byId("filterPriceBracket").value;
      let low = 0;
      let high = Number(byId("filterMaxPriceSlider").value);
      if (bracket !== "ALL") {
        const [from, to] = bracket.split("-").map(Number);
        low = from;
        high = Math.min(high, to);
      }
      return high >= low && unit.maxPrice >= low && unit.minPrice <= high;
    }

    function matchCommuteFilter(unit) {
      const maxCommute = byId("filterCommute").value;
      if (maxCommute === "ALL") return true;
      const macro = COMMUNITIES_MACRO[unit.project];
      return macro.commuteMins <= parseInt(maxCommute, 10);
    }

    // 统一获取当前同时满足【宏观12维社区条件】+【微观9维户号条件】的房源列表
    function getFilteredUnits(ignoreMainRoadForTop = false) {
      const proj = byId("filterProject").value;
      const bld = byId("filterBuilding").value;
      const layout = byId("filterLayout").value;
      const structure = byId("filterStructure").value;
      const orientation = byId("filterOrientation").value;
      const noise = byId("filterNoise").value;
      const usableRate = Number(byId("filterUsableRate").value);

      return UNITS_DATA.filter(u => {
        // 第一步：必须先通过【视角二：宏观12维社区级过滤】
        if (!isCommunityPassingMacro(u.project)) return false;
        // 第二步：再通过【视角三：微观9维户号级专属过滤】
        if (proj !== "ALL" && u.project !== proj) return false;
        if (bld !== "ALL" && `${u.project} - ${u.building}` !== bld) return false;
        if (layout !== "ALL" && u.layoutType !== layout) return false;
        if (structure !== "ALL" && u.structureType !== structure) return false;
        if (orientation === "VALID_SOUTH" && !["正南", "东南", "西南"].includes(u.orientation)) return false;
        if (orientation !== "VALID_SOUTH" && u.orientation !== orientation) return false;
        if (ignoreMainRoadForTop && u.noiseLevel === "MAIN_ROAD") return false;
        if (noise === "QUIET_ONLY" && u.noiseLevel !== "QUIET") return false;
        if (noise === "NO_MAIN" && u.noiseLevel === "MAIN_ROAD") return false;
        if (u.usableRateNum < usableRate) return false;
        return matchPriceFilter(u) && matchCommuteFilter(u);
      });
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
            <div class="text-[10px] text-slate-500 mt-1">三年区间：${s.rateRange}</div>
          </td>
          <td class="py-2.5 px-2.5 align-top">
            <div class="font-bold text-purple-800">四大率：~${s.top4Rate}%</div>
            <div class="text-slate-600">十大率：~${s.top10Rate}%</div>
          </td>
          <td class="py-2.5 px-2.5 align-top max-w-[220px] text-slate-700">${s.cutoffScore}</td>
          <td class="py-2.5 px-2.5 align-top max-w-[195px]">
            <div class="font-semibold text-emerald-800">${s.peerGrade}</div>
            <div class="text-[11px] text-slate-500 mt-0.5">${s.lockPolicy}</div>
          </td>
          <td class="py-2.5 px-2.5 align-top max-w-[220px] text-slate-600 leading-snug">${s.highlight}</td>
        </tr>
      `).join("");
    }

    // =========================================================================
    // 6. 渲染视角二：20盘宏观13列全量矩阵表 + 同步更新下方入围楼盘列表
    // =========================================================================
    function renderMacroTable() {
      const passingEntries = Object.entries(COMMUNITIES_MACRO).filter(([name]) => isCommunityPassingMacro(name));
      byId("macroMatchBadge").textContent = `入围 ${passingEntries.length} / ${Object.keys(COMMUNITIES_MACRO).length} 个小区`;

      // 更新视角三顶部的继承提示与入围楼盘下拉框
      const hintEl = byId("inheritedMacroHint");
      if (passingEntries.length === Object.keys(COMMUNITIES_MACRO).length) {
        hintEl.textContent = `全部 ${Object.keys(COMMUNITIES_MACRO).length} 个小区`;
      } else if (passingEntries.length === 0) {
        hintEl.textContent = "0 个小区（请放宽上方社区过滤条件）";
      } else {
        hintEl.textContent = `${passingEntries.length} 个小区（${passingEntries.map(([n]) => n).join("、")}）`;
      }

      updateProjectAndBuildingOptions(passingEntries.map(([n]) => n));

      const tbody = byId("macroTableBody");
      if (!passingEntries.length) {
        tbody.innerHTML = '<tr><td colspan="13" class="py-8 text-center text-slate-400">暂无符合该组合条件的小区，请放宽上方社区过滤选项。</td></tr>';
        return;
      }

      tbody.innerHTML = passingEntries.map(([name, m]) => {
        const school = SCHOOL_DISTRICTS[m.schoolKey] || {};
        const purityBadge = m.purityGrade === "S" ? "badge-green" : m.purityGrade === "A" ? "badge-blue" : "badge-amber";
        const villageBadge = m.villageGrade === "S" ? "badge-green" : m.villageGrade === "A" ? "badge-blue" : "badge-amber";
        const densityColor = m.plotRatio <= 3.8 ? "text-emerald-700" : m.plotRatio >= 6 ? "text-rose-600" : "text-slate-800";
        const parkingColor = m.parkingRatio < 1 ? "text-rose-600" : "text-emerald-700";
        const buildBadge = m.isNewBuild ? '<span class="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] rounded">新房</span>' : "";

        return `
          <tr class="hover:bg-indigo-50/40 transition">
            <td class="py-2.5 px-2 align-top min-w-[145px]">
              <div class="font-bold text-slate-900 flex items-center gap-1"><span>${name}</span>${buildBadge}</div>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${m.zone} · ${m.buildYear}</span>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[180px]">
              <div class="font-semibold text-slate-800">${m.phaseSummary}</div>
              <div class="text-purple-800 text-[11px] mt-0.5">${m.regLabel}</div>
              <div class="text-slate-600 text-[11px] mt-0.5">实得率：${m.usableAvg}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[190px]">
              <div class="font-bold ${densityColor}">${m.densityLabel}</div>
              <div class="text-slate-600 text-[11px] mt-0.5">容积率 ${m.plotRatio} · ${m.totalFloors}</div>
              <div class="text-slate-600 text-[11px] mt-0.5">${m.elevatorRatio}</div>
              <div class="text-slate-500 text-[11px] mt-0.5">楼距：${m.buildingSpacing}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[160px]">
              <div class="font-bold ${parkingColor}">🅿️ ${m.parkingLabel}</div>
              <div class="text-slate-600 text-[11px] mt-0.5">${m.propertyInfo}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[210px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${purityBadge}">${m.purityLabel}</span>
              <div class="text-slate-600 mt-1 text-[11px] leading-snug">${m.resettlementDetail}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[190px]">
              <span class="px-2 py-0.5 rounded badge-purple text-[11px] font-bold">${m.assetTier}</span>
              <div class="text-slate-600 mt-1 text-[11px] leading-snug">${m.residentProfile}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[205px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${villageBadge}">${m.villageDistText}</span>
              <div class="text-slate-500 mt-1 text-[11px] leading-snug">${m.urbanInterface}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[245px]">
              <div class="font-bold text-amber-900 text-[11px]">${m.supermarketInfo}</div>
              <div class="text-emerald-800 text-[11px] mt-0.5">🥬 <strong>买菜：</strong>${m.wetMarketInfo}</div>
              <div class="text-slate-500 text-[10px] mt-0.5">🏢 <strong>底商：</strong>${m.podiumType}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[205px]">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold ${m.metroMeters <= 350 ? 'badge-green' : 'badge-blue'}">🚶 距地铁约 ${m.metroMeters}米</span>
              <div class="text-slate-700 font-medium text-[11px] mt-1">${m.metroStation}</div>
              <div class="font-bold text-pink-700 text-[11px] mt-0.5">🚇 贝尔路：约 ${m.commuteMins}分钟</div>
              <div class="text-slate-500 text-[10px] mt-0.5">${m.commuteRoute}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[230px]">
              <div class="font-bold text-indigo-950">${school.name}</div>
              <div class="mt-0.5">
                <span class="px-1.5 py-0.5 rounded font-bold badge-green text-[10px]">公办率 ${school.publicHighRate}%</span>
                <span class="px-1.5 py-0.5 rounded font-semibold badge-purple text-[10px]">十大率 ${school.top10Rate}%</span>
              </div>
              <div class="text-[10px] text-slate-500 mt-0.5">${school.cutoffScore}</div>
            </td>
            <td class="py-2.5 px-2 align-top min-w-[200px] text-slate-600 text-[11px] leading-snug">${m.tenYearBeta}</td>
            <td class="py-2.5 px-2 align-top min-w-[190px]">
              <span class="px-1.5 py-0.5 rounded font-bold badge-indigo text-[10px]">回撤 ${m.drawdownPct}%</span>
              <div class="text-[10px] text-slate-500 mt-1 leading-snug">${m.priceCeilingVerify}</div>
            </td>
            <td class="py-2.5 px-2 align-top text-center">
              <button type="button" data-drill-project="${name}" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold whitespace-nowrap">看户号 ↓</button>
            </td>
          </tr>`;
      }).join("");
    }

    function updateProjectAndBuildingOptions(passingProjectNames) {
      const pSelect = byId("filterProject");
      const currentProj = pSelect.value;

      pSelect.innerHTML = `<option value="ALL">全部入围楼盘 (${passingProjectNames.length}盘)</option>` +
        passingProjectNames.map(p => `<option value="${p}">${p} (${COMMUNITIES_MACRO[p].zone})</option>`).join("");

      if (passingProjectNames.includes(currentProj)) {
        pSelect.value = currentProj;
      } else {
        pSelect.value = "ALL";
      }
      updateBuildingOptions();
    }

    function updateBuildingOptions() {
      const proj = byId("filterProject").value;
      const bSelect = byId("filterBuilding");
      const currentVal = bSelect.value;

      const buildings = Array.from(new Set(
        UNITS_DATA
          .filter(u => isCommunityPassingMacro(u.project) && (proj === "ALL" || u.project === proj))
          .map(u => `${u.project} - ${u.building}`)
      ));

      bSelect.innerHTML = `<option value="ALL">全部入围楼栋 (${buildings.length}组)</option>` +
        buildings.map(b => `<option value="${b}">${b}</option>`).join("");

      if (buildings.includes(currentVal)) {
        bSelect.value = currentVal;
      } else {
        bSelect.value = "ALL";
      }
    }

    drillDownProject = function(projectName) {
      byId("filterProject").value = projectName;
      updateBuildingOptions();
      redrawUnitViews();
      byId("section-micro").scrollIntoView({ behavior: "smooth", block:"start" });
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

      const eligible = getFilteredUnits(true)
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
        container.innerHTML = `<div class="col-span-full text-center py-6 text-xs text-slate-400">当前筛选组合下暂无匹配房源，请适当放宽宏观社区过滤或微观总价预算条件。</div>`;
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
              <span class="font-semibold text-pink-700">🚇 距铁${u.macro.metroMeters}m·${u.macro.commuteMins}分</span>
            </div>
            <div class="truncate font-semibold text-indigo-900">🎓 ${u.sch.shortName} (公办率${u.sch.publicHighRate}%)</div>
            <div class="truncate text-amber-900">🛒 ${u.macro.supermarketInfo.replace(/🏆 /g, '')}</div>
          </div>
        </div>
      `).join("");
    }

    // =========================================================================
    // 8. 渲染视角三：微观楼栋户号卡片矩阵（卡片精简去重，聚焦本户/本栋微观指标）
    // =========================================================================
    function renderUnitCards() {
      const maxSlider = parseInt(byId("filterMaxPriceSlider").value, 10);
      const weights = getWeights();

      byId("maxPriceLabel").textContent =
        maxSlider >= 1500 ? "不限上限 (≤1500万)" : `预算上限 ≤ ${maxSlider} 万`;

      const filtered = getFilteredUnits(false).map(u => ({
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
            当前筛选条件下暂无匹配户号，请检查上方【视角二：宏观社区过滤】或放宽【视角三：微观总价/厅型】选项。
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
              <!-- 头部：片区 + 楼盘 + 综合得分 -->
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded ${zoneBadgeColor}">${m.zone}</span>
                  <span class="font-bold text-xs text-slate-900">${u.project}</span>
                  ${m.isNewBuild ? '<span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white">新房/现房</span>' : ''}
                </div>
                <span class="text-xs font-bold text-indigo-600 shrink-0">总分：${u.totalScore}</span>
              </div>

              <!-- 具体楼栋与户号标题 -->
              <h3 class="text-sm font-bold text-slate-900">${u.building} · <span class="text-indigo-700">${u.unitCode}</span></h3>

              <!-- 核心微观标签栏：总价 + 厅型格局 + 朝向 + 噪音 -->
              <div class="flex flex-wrap gap-1.5 mt-2 text-[11px]">
                <span class="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  💰 ${u.priceRange}
                </span>
                <span class="px-2 py-0.5 rounded font-bold badge-purple">
                  📐 ${u.structureType} (${u.layoutType})
                </span>
                <span class="px-2 py-0.5 rounded font-semibold bg-amber-100 text-amber-800">
                  ☀️ 阳台${u.orientation}
                </span>
                <span class="px-2 py-0.5 rounded font-semibold ${noiseBadgeClass}">
                  ${u.noiseLabel}
                </span>
              </div>

              <!-- 区块1：【纯微观户号级】建面实得与主干道/铁路噪音解剖 -->
              <div class="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-700 space-y-1 bg-slate-50 p-2.5 rounded-lg">
                <div class="font-bold text-slate-900">📐 ① 本户空间实得 & 道路/铁路噪音解剖</div>
                <div><strong>建面与实得：</strong>建面 <strong>${u.area}㎡</strong> × 得房率 <strong>${u.usableRateNum}%</strong> ≈ 套内实得 <strong class="text-indigo-700">${u.usableArea}㎡</strong></div>
                <div><strong>距干道米数：</strong>${u.roadDistMeters}</div>
                <div><strong>特殊噪音源：</strong>${u.specialNoise}</div>
              </div>

              <!-- 区块2：【本栋/本户级】底商油烟、回迁混居与城中村视野核验 -->
              <div class="mt-2 text-[11px] text-slate-700 space-y-1 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-200/50">
                <div class="font-bold text-emerald-950">🛡️ ② 本栋回迁/底商油烟/城中村视野核验</div>
                <div><strong>本栋回迁核验：</strong>${u.unitResettleCheck}</div>
                <div><strong>本户视野核验：</strong>${u.unitVillageCheck}</div>
                <div><strong>本栋底商核验：</strong>${u.unitCommNoiseCheck}</div>
              </div>

              <!-- 二胎选房点评 -->
              <div class="mt-2 text-[11px] text-slate-700 leading-relaxed bg-indigo-50/40 p-2 rounded-lg border border-indigo-100">
                👶 <strong>二胎选房建议：</strong>${u.twoKidsNote}
              </div>
            </div>

            <!-- 底部：精简摘要徽章 + PK按钮 -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <div class="text-[11px] text-slate-500 truncate">
                🚇 距铁${m.metroMeters}m(${m.commuteMins}分达贝尔路) ｜ 🎓 ${sch.shortName}(${sch.publicHighRate}%)
              </div>
              <button type="button" data-compare-id="${u.id}" class="px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${
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
    // 9. 渲染视角四：五层穿透终极同屏 PK 对比台
    // =========================================================================
    toggleCompare = function(id) {
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
        { section: "【第一层：具体户号视角】空间厅型、实得面积与精准道路/铁路噪音距离", label: "具体期数 · 楼栋 · 户号", render: u => `<span class="font-bold text-indigo-700">${u.building}</span><br/><span>${u.unitCode}</span>` },
        { label: "六维综合加权得分", render: u => `<span class="px-2.5 py-0.5 bg-indigo-600 text-white rounded-full font-bold">${calcWeightedScore(u, weights)} 分</span>` },
        { label: "💰 参考总价区间", render: u => `<span class="font-bold text-rose-600 text-sm">${u.priceRange}</span>` },
        { label: "📐 空间厅型格局 & 实得", render: u => `<span class="px-2 py-0.5 rounded badge-purple font-bold">${u.structureType}</span><br/>建面${u.area}㎡ × ${u.usableRateNum}% ≈ <strong class="text-indigo-700">实得${u.usableArea}㎡</strong>` },
        { label: "☀️ 阳台主朝向", render: u => `<span class="font-semibold text-amber-700">${u.orientation}</span> (${u.layoutType})` },
        { label: "🔇 距主干道精确米数 & 噪音", render: u => `<div class="font-semibold text-emerald-800">${u.noiseLabel}</div><div class="text-slate-500 mt-0.5">${u.roadDistMeters}；${u.specialNoise}</div>` },

        // 第二层：商业配套（山姆/MALL/菜市场/底商）& 地铁步行米数
        { section: "【第二层：商业配套与地铁距离视角】楼下底商/商住结构、山姆/大型商超、菜市场买菜与地铁口精确米数", label: "🛒 大型商超 / 山姆会员店", render: u => `<span class="font-semibold text-amber-950">${u.macro.supermarketInfo}</span>` },
        { label: "🥬 菜市场 / 老人日常买菜", render: u => `<span class="text-emerald-900">${u.macro.wetMarketInfo}</span>` },
        { label: "🏪 楼下商铺 / 商住一体核验", render: u => `<div>${u.macro.podiumType}</div><div class="font-semibold text-indigo-900 mt-1">${u.unitCommNoiseCheck}</div>` },
        { label: "🚶 距最近地铁站精确距离", render: u => `<span class="px-2 py-0.5 rounded font-bold ${u.macro.metroMeters <= 350 ? 'badge-green' : 'badge-blue'}">步行约 ${u.macro.metroMeters} 米</span><div class="text-slate-600 mt-1">${u.macro.metroStation}<br/>${u.macro.metroDist}</div>` },
        { label: "🚇 太太至贝尔路站通勤", render: u => `<div class="font-bold text-pink-700">全程约 ${u.macro.commuteMins} 分钟</div><div class="text-slate-500">${u.macro.commuteRoute}</div>` },

        // 第三层：内部回迁房/保障房 & 外部靠近城中村排雷
        { section: "【第三层：内外纯粹度与工程底盘】回迁房/保障房、靠近城中村距离、容积率/梯户比与车位比", label: "🏠 小区整体回迁/保障房结构", render: u => `<div class="font-bold ${u.macro.purityGrade === 'S' ? 'text-emerald-700' : 'text-indigo-900'}">${u.macro.purityLabel}</div><div class="text-slate-500 mt-0.5">${u.macro.resettlementDetail}</div>` },
        { label: "✅ 本期/本栋回迁房核验", render: u => `<span class="font-semibold">${u.unitResettleCheck}</span>` },
        { label: "🏘️ 距最近城中村距离 & 动线", render: u => `<div class="font-bold ${u.macro.villageGrade === 'S' ? 'text-emerald-700' : 'text-slate-800'}">${u.macro.villageDistText}</div><div class="text-slate-500 mt-0.5">${u.unitVillageCheck}</div>` },
        { label: "🌳 高低密度 & 车位比", render: u => `<div><strong>${u.macro.densityLabel}</strong> (${u.macro.elevatorRatio})</div><div class="text-slate-500">层高：${u.macro.totalFloors} ｜ 楼距：${u.macro.buildingSpacing}</div><div class="text-slate-500">${u.macro.regLabel} ｜ ${u.macro.propertyInfo}</div><div class="font-bold ${u.macro.parkingRatio < 1 ? 'text-rose-600' : 'text-emerald-700'}">车位 ${u.macro.parkingLabel}</div>` },

        // 第四层：小初学位八维核心指标
        { section: "【第四层：小、初学位八维指标视角】公办普高率、四大/十大率、录取积分线、直升学制与生源纯粹度", label: "🎓 对口小学 & 初中名称", render: u => `<span class="font-bold text-indigo-950">${u.sch.name}</span>` },
        { label: "🏆 中考公办普高率 & 十大率", render: u => `<span class="px-2 py-0.5 rounded badge-green font-bold">公办率 ~${u.sch.publicHighRate}%</span><div class="font-bold text-purple-800 mt-1">四大率 ~${u.sch.top4Rate}% ｜ 十大率 ~${u.sch.top10Rate}%</div>` },
        { label: "📊 近3年录取积分线 & 门槛", render: u => u.sch.cutoffScore },
        { label: "👥 学区生源纯粹度(有无租户)", render: u => `<div class="font-semibold text-emerald-800">${u.sch.peerGrade}</div><div class="text-slate-500 mt-0.5">${u.sch.systemType}</div>` },

        // 第五层：宏观板块十年Beta与历史抗跌验证
        { section: "【第五层：宏观资产视角】十年产业规划Beta与2021-2026历史抗跌天花板验证", label: "📈 十年产业规划Beta & 天花板", render: u => u.macro.tenYearBeta },
        { label: "🛡️ 2021-2026历史抗跌性验证", render: u => `<span class="px-2 py-0.5 rounded badge-green font-bold">回撤约 ${u.macro.drawdownPct}%</span><div class="mt-1 text-slate-600">${u.macro.priceCeilingVerify}</div>` },
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
            <th class="py-3 px-3 w-44 font-bold text-slate-800">五层穿透对比维度</th>
            ${selectedUnits.map(u => `
              <th class="py-3 px-3 min-w-[215px]">
                <div class="flex items-center justify-between gap-1">
                  <div>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${u.macro.zone} · 距铁${u.macro.metroMeters}m</span>
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
    // 10. 初始化图表：9大学区三率图 + 2024-2026三年趋势图 + 历史抗跌性对比图
    // =========================================================================
    function initCharts() {
      if (typeof Chart === "undefined") return;

      // 图表1：9大学区公办普高率 / 十大率 / 四大率
      const ctxSchool = byId("schoolMetricsChart").getContext("2d");
      const schList = Object.values(SCHOOL_DISTRICTS).sort((a, b) => b.publicHighRate - a.publicHighRate);
      Chart.defaults.font.family=getComputedStyle(root).fontFamily;Chart.defaults.color='#63615B';
      new Chart(ctxSchool, {
        type: "bar",
        data: {
          labels: schList.map(s => s.shortName),
          datasets: [
            {
              label: "中考公办普高录取率 (%)",
              data: schList.map(s => s.publicHighRate),
              backgroundColor: "rgba(193, 95, 60, 0.84)",
              borderRadius: 4
            },
            {
              label: "深圳十大高中录取率 (%)",
              data: schList.map(s => s.top10Rate),
              backgroundColor: "rgba(72, 115, 90, 0.88)",
              borderRadius: 4
            },
            {
              label: "深圳四大名校录取率 (%)",
              data: schList.map(s => s.top4Rate),
              backgroundColor: "rgba(148, 115, 78, 0.85)",
              borderRadius: 4
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
            x: { ticks: { autoSkip:false,minRotation:38,maxRotation:55,font:{size:11} } }
          }
        }
      });

      // 图表2：2024-2026三年中考公办普高率趋势图
      const ctxTrend = byId("schoolTrendChart").getContext("2d");
      new Chart(ctxTrend, {
        type: "line",
        data: {
          labels: ["2024中考", "2025中考", "2026中考"],
          datasets: [
            {
              label: "深中龙岗(星河)",
              data: SCHOOL_DISTRICTS.SHENZHONG_LG.trend3Y,
              borderColor: "#C15F3C",
              backgroundColor: "#C15F3C",
              tension: 0.25
            },
            {
              label: "南师大龙岗(麓城/尚峰)",
              data: SCHOOL_DISTRICTS.NNU_LG.trend3Y,
              borderColor: "#48735A",
              backgroundColor: "#48735A",
              tension: 0.25
            },
            {
              label: "深实验坂田/华附大运",
              data: SCHOOL_DISTRICTS.SHIYAN_BT.trend3Y,
              borderColor: "#8F4637",
              backgroundColor: "#8F4637",
              tension: 0.25
            },
            {
              label: "科外/贤义/知新",
              data: SCHOOL_DISTRICTS.KEWAI_BT.trend3Y,
              borderColor: "#6D8775",
              backgroundColor: "#6D8775",
              tension: 0.25
            },
            {
              label: "石芽岭学校(健康花城/特发)",
              data: SCHOOL_DISTRICTS.SHIYALING_NW.trend3Y,
              borderColor: "#B18A44",
              backgroundColor: "#B18A44",
              tension: 0.25
            },
            {
              label: "全市公办普高基准线",
              data: [52.0, 53.0, 53.5],
              borderColor: "#8E8A80",
              borderDash: [5, 5],
              pointRadius: 2,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } }
          },
          scales: {
            y: {
              min: 45,
              max: 86,
              ticks: { callback: v => v + "%", font: { size: 10 } },
              title: { display: true, text: "近三年公办普高率趋势 (%)", font: { size: 10 } }
            }
          }
        }
      });

      // 图表3：二手盘2021-2026周期回撤率对比图
      const ctxRes = byId("resilienceChart").getContext("2d");
      const entries = Object.entries(COMMUNITIES_MACRO)
        .filter(([, m]) => !m.isNewBuild)
        .sort((a, b) => a[1].drawdownPct - b[1].drawdownPct);

      new Chart(ctxRes, {
        type: "bar",
        data: {
          labels: entries.map(([name]) => name),
          datasets: [
            {
              label: "2021历史峰值→2026真实成交回撤幅度 (%，数值越小代表周期抗跌性越强)",
              data: entries.map(([, m]) => m.drawdownPct),
              backgroundColor: entries.map(([, m]) =>
                m.drawdownPct <= 23
                  ? "rgba(72, 115, 90, 0.88)"
                  : m.drawdownPct <= 27
                  ? "rgba(193, 95, 60, 0.84)"
                  : "rgba(177, 138, 68, 0.88)"
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
            x: { ticks: { autoSkip:false,minRotation:38,maxRotation:55,font:{size:11} } }
          }
        }
      });
    }

    // =========================================================================
    // 11. 导出与事件监听（消除重复绑定，统一联动）
    // =========================================================================
    function redrawUnitViews() {
      renderTopRecommendations();
      renderUnitCards();
      renderCompareTable();
    }

    function redrawAllMacroAndMicro() {
      renderMacroTable();
      redrawUnitViews();
    }

    function resetMacroFilters() {
      const macroDefaults = {
        macroZoneFilter: "ALL",
        macroNewOldFilter: "ALL",
        macroRegFilter: "ALL",
        macroPurityFilter: "ALL",
        macroVillageFilter: "ALL",
        macroCommFilter: "ALL",
        macroMetroDistFilter: "9999",
        macroDensityFilter: "ALL",
        macroParkingFilter: "ALL",
        macroTierFilter: "ALL",
        macroSchoolRateFilter: "0",
        macroResilienceFilter: "ALL"
      };
      Object.entries(macroDefaults).forEach(([id, val]) => {
        byId(id).value = val;
      });
    }

    function resetMicroFilters() {
      const microDefaults = {
        filterProject: "ALL",
        filterBuilding: "ALL",
        filterLayout: "ALL",
        filterStructure: "ALL",
        filterOrientation: "VALID_SOUTH",
        filterNoise: "NO_MAIN",
        filterUsableRate: "0",
        filterCommute: "ALL",
        filterPriceBracket: "ALL",
        filterMaxPriceSlider: "1500"
      };
      Object.entries(microDefaults).forEach(([id, val]) => {
        byId(id).value = val;
      });
    }

    function bindEvents() {
      // 1. 六维权重滑块
      ["wEdu", "wQuiet", "wCommute", "wSpace", "wComm", "wAsset"].forEach(id => {
        byId(id).addEventListener("input", redrawUnitViews);
      });

      byId("resetWeightsBtn").addEventListener("click", () => {
        const defaults = { wEdu: 25, wQuiet: 20, wCommute: 20, wSpace: 15, wComm: 10, wAsset: 10 };
        Object.entries(defaults).forEach(([id, val]) => {
          byId(id).value = val;
        });
        redrawUnitViews();
      });

      // 2. 宏观12维全局过滤器（一处修改，同时刷新宏观表+TOP4+微观卡片）
      [
        "macroZoneFilter", "macroNewOldFilter", "macroRegFilter", "macroPurityFilter",
        "macroVillageFilter", "macroCommFilter", "macroMetroDistFilter", "macroDensityFilter",
        "macroParkingFilter", "macroTierFilter", "macroSchoolRateFilter", "macroResilienceFilter"
      ].forEach(id => {
        byId(id).addEventListener("change", redrawAllMacroAndMicro);
      });

      byId("resetMacroBtn").addEventListener("click", () => {
        resetMacroFilters();
        redrawAllMacroAndMicro();
      });

      // 3. 微观9维专属筛选器
      byId("filterProject").addEventListener("change", () => {
        updateBuildingOptions();
        redrawUnitViews();
      });

      [
        "filterBuilding", "filterLayout", "filterStructure", "filterOrientation",
        "filterNoise", "filterUsableRate", "filterCommute", "filterPriceBracket"
      ].forEach(id => {
        byId(id).addEventListener("change", redrawUnitViews);
      });

      byId("filterMaxPriceSlider").addEventListener("input", redrawUnitViews);

      byId("resetFilterBtn").addEventListener("click", () => {
        resetMacroFilters();
        resetMicroFilters();
        redrawAllMacroAndMicro();
      });

      byId("clearCompareBtn").addEventListener("click", () => {
        compareIds = ["bt-xinyi-5-89", "vanke-3-89", "horoy-6-89", "bgl-banshan-3-89", "galaxy-6-89"];
        renderUnitCards();
        renderCompareTable();
      });
    }

    function saveLocalFile(filename, text, type) {
      const url = URL.createObjectURL(new Blob([text], { type }));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async function downloadSelfHtml(){
      if(root.dataset.standalone==='true'){
        saveLocalFile('Cavno_深圳25盘_V11_独立页面.html','<!DOCTYPE html>\n'+document.documentElement.outerHTML,'text/html;charset=utf-8');
      }else{
        const response=await fetch('/apps/life/house/longgang-home-school-decision/standalone.html');
        if(!response.ok){alert('独立HTML文件未就绪，请确认增量包中的standalone.html已部署。');return;}
        saveLocalFile('Cavno_深圳25盘_V11_独立页面.html',await response.text(),'text/html;charset=utf-8');
      }
    }
    function exportUnitsCsv() {
      const unitFields = [...new Set(UNITS_DATA.flatMap(u => Object.keys(u)))];
      const macroFields = [...new Set(Object.values(COMMUNITIES_MACRO).flatMap(m => Object.keys(m)))];
      const schoolFields = [...new Set(Object.values(SCHOOL_DISTRICTS).flatMap(s => Object.keys(s)))];
      const cell = value => {
        let text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
        if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
        return '"' + text.replace(/"/g, '""') + '"';
      };
      const header = [...unitFields, ...macroFields.map(k => "小区_" + k), ...schoolFields.map(k => "学校_" + k)];
      const rows = UNITS_DATA.map(u => {
        const m = COMMUNITIES_MACRO[u.project];
        const s = SCHOOL_DISTRICTS[m.schoolKey];
        return [...unitFields.map(k => u[k]), ...macroFields.map(k => m[k]), ...schoolFields.map(k => s[k])];
      });
      saveLocalFile("深圳25盘_V11_全量户号数据.csv", "\uFEFF" + [header, ...rows].map(row => row.map(cell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
    };

    onReady(() => {
      renderSchoolTable();
      renderMacroTable();
      renderTopRecommendations();
      renderUnitCards();
      renderCompareTable();
      bindEvents();
      initCharts();
    });
  

(function() {
  // ==========================================================================
  // 1. 新增【福田区·景田片区】教育学区与 4 大标杆一二手楼盘数据
  // ==========================================================================
  SCHOOL_DISTRICTS["FUTIAN_WAI_JT"] = {
    name: "福田区外国语学校(景田南/北校区) / 景秀小学 + 景秀中学",
    shortName: "福田外国语本部/景秀",
    covers: "天健天骄北庐、万科金色家园、天然居、岁宝壹品(邻近)",
    systemType: "九年一贯制/6+3双优 (福田头部名校集团)",
    publicHighRate: 76.8,
    rateRange: "74.5% ~ 78.2%",
    trend3Y: [74.5, 75.8, 76.8],
    top4Rate: 6.8,
    top10Rate: 16.5,
    cutoffScore: "福外本部小一约82~86分 / 初一约85分（福田一类购房落户提前1~1.5年稳录）",
    peerGrade: "S级·福田中心区公务员、金融高管、律所合伙人及资深中产生源，圈层极纯粹",
    lockPolicy: "小一锁6年/初一锁3年（同一父母二胎同套房通用不限）",
    highlight: "福田中心区老牌王牌名校，外语特色与四大/十大率极强，且无城中村握手楼租户分流。"
  };

  const JINGTIAN_COMMUNITIES = {
    "天健天骄北庐": {
      zone: "福田景田",
      isNewBuild: false,
      phaseSummary: "北庐/南苑共2期11栋纯粹豪宅",
      buildYear: "2020-2021年",
      regGen: "GEN1",
      regLabel: "第1代·福田国企高定规",
      usableAvg: "81%~83%",
      plotRatio: 5.2,
      maxFloorNum: 42,
      elevatorGrade: "COMFORT",
      densityGrade: "HIGH",
      densityLabel: "中心区次新豪宅 (容积率5.2)",
      totalFloors: "37~42层 (准超高层)",
      elevatorRatio: "🌟 2梯2户 / 2梯3户 / 3梯4户",
      buildingSpacing: "约 65~95米 (中心大园林)",
      parkingRatio: 1.55,
      parkingLabel: "🏆 1:1.55 (车位极其充裕)",
      purityGrade: "S",
      hasResettlement: "ZERO",
      hasSubsidized: false,
      resettlementDetail: "🏆 北庐主力组团为純大户型商品房（配建人才房位于独立地块），圈层纯粹度福田顶尖！",
      purityLabel: "★ S级·纯大户豪宅 (独立地块隔离配建)",
      assetTier: "品质改善",
      residentProfile: "福田金融街高管、私募基金经理、律所合伙人、企业主，千万级顶豪圈层",
      villageGrade: "S",
      villageDistText: "🏆 S级·景田纯粹政商住区 (>800米零城中村)",
      urbanInterface: "S级·零城中村福田中心界面（紧邻香蜜湖豪宅板块与莲花山公园，绿树成荫、棋盘式街区）",
      commGrade: "S_MALL",
      samWalk: true,
      purePodium: true,
      podiumType: "北庐塔楼下为纯高定会所架空层(0餐饮底商油烟)，街区对面即商业综合体",
      supermarketInfo: "🏆 步行900米/驱车3分钟即达【山姆会员店(福田印力中心店)实体店】+ 景田岁宝盒马鲜生！",
      wetMarketInfo: "福田农批市场(深圳最大最全生鲜市场，800米)+盒马鲜生+山姆实体店，买菜天花板",
      metroMeters: 300,
      metroStation: "2号线/9号线景田站",
      metroDist: "★ 约 300米 (步行4分钟入站)",
      commuteMins: 24,
      commuteRoute: "9号线景田站 → 3站至孖岭站同台转10号线 → 4站直达贝尔路站(反向通勤不挤，全程约24分钟!)",
      tenYearBeta: "紧邻香蜜湖新金融中心（深圳未来十年核心金融街规划），福田中心区绝版次新豪宅，保值力全城顶尖。",
      resilienceGrade: "HIGH",
      drawdownPct: 16,
      priceCeilingVerify: "🏆 福田抗跌标杆！2021至今仅温和回调约16%，120~166㎡三房/四房在1250~1650万区间极度坚挺。",
      propertyInfo: "天健物业 · 6.8元/㎡",
      schoolKey: "FUTIAN_WAI_JT"
    },
    "万科金色家园": {
      zone: "福田景田",
      isNewBuild: false,
      phaseSummary: "共3期围合花园 (景田经典标杆)",
      buildYear: "2001-2003年",
      regGen: "GEN0",
      regLabel: "🌟 第0代·低公摊板式规",
      usableAvg: "85%~88%",
      plotRatio: 3.1,
      maxFloorNum: 24,
      elevatorGrade: "COMFORT",
      densityGrade: "LOW",
      densityLabel: "🏆 福田罕见低密 (容积率3.1!)",
      totalFloors: "12~24层 (小高层/高层)",
      elevatorRatio: "🌟 1梯2户 / 2梯4户 (极舒适)",
      buildingSpacing: "约 55~80米",
      parkingRatio: 0.92,
      parkingLabel: "1:0.92 (中心区老盘中等水平)",
      purityGrade: "S",
      hasResettlement: "ZERO",
      hasSubsidized: false,
      resettlementDetail: "🏆 招拍挂净地开发：100%纯商品房社区，0村民回迁房、0保障房！",
      purityLabel: "★ S级·0回迁+0保障 (100%纯商品房)",
      assetTier: "品质改善",
      residentProfile: "深圳市直机关公务员、医生、教师、金融白领及福外陪读中产家庭，人文素质极高",
      villageGrade: "S",
      villageDistText: "🏆 S级·景田核心零城中村 (近莲花山公园)",
      urbanInterface: "S级·零城中村花园街区（东近莲花山公园，西接香蜜湖，周边全是图书馆、妇儿大厦与商品房）",
      commGrade: "S_MALL",
      samWalk: false,
      purePodium: true,
      podiumType: "一期/二期/三期各自围合封闭管理，内圈楼栋下无重餐饮底商",
      supermarketInfo: "下楼即华润万家/妇儿大厦亲子MALL + 驱车5分钟达【印力中心山姆会员店】+ 盒马鲜生",
      wetMarketInfo: "步行350米达景田综合肉菜市场+钱大妈+距离福田农批市场仅1.2公里",
      metroMeters: 200,
      metroStation: "2号线/9号线景田站 (地铁口就在家门口)",
      metroDist: "🏆 约 200米 (下楼步行3分钟入景田站!)",
      commuteMins: 23,
      commuteRoute: "9号线景田站 → 3站至孖岭转10号线 → 贝尔路站(全程仅23分钟，早晚高峰反向坐车都有座位!)",
      tenYearBeta: "坐拥“福田外国语学校本部+景田双地铁口+莲花山/香蜜湖双核辐射”，容积率仅3.1，流通性常年位居景田第一。",
      resilienceGrade: "HIGH",
      drawdownPct: 21,
      priceCeilingVerify: "2021峰值约10.5万→2026稳定在8.0~8.4万/㎡(回撤约21%)，88~98㎡三房在720~820万区间成交极稳。",
      propertyInfo: "万科物业 · 3.5元/㎡",
      schoolKey: "FUTIAN_WAI_JT"
    },
    "天然居": {
      zone: "福田景田",
      isNewBuild: false,
      phaseSummary: "共1期5栋围合大花园",
      buildYear: "2004年",
      regGen: "GEN0",
      regLabel: "🌟 第0代·大阳台高实得规",
      usableAvg: "85%~87%",
      plotRatio: 3.6,
      maxFloorNum: 28,
      elevatorGrade: "COMFORT",
      densityGrade: "LOW",
      densityLabel: "🌟 舒居低密 (容积率3.6)",
      totalFloors: "26~28层",
      elevatorRatio: "🌟 2梯3户 / 2梯4户",
      buildingSpacing: "约 60~85米 (超大中心花园)",
      parkingRatio: 1.0,
      parkingLabel: "1:1.0 (景田次新老盘中车位较充裕)",
      purityGrade: "S",
      hasResettlement: "ZERO",
      hasSubsidized: false,
      resettlementDetail: "🏆 100%纯商品房净地社区，0回迁房、0保障房，纯粹大平面改善住区！",
      purityLabel: "★ S级·0回迁+0保障 (100%纯商品房)",
      assetTier: "品质改善",
      residentProfile: "福田改善型中产、公务员及二胎换房家庭，自住率超过90%",
      villageGrade: "S",
      villageDistText: "🏆 S级·景田北零城中村纯净街区",
      urbanInterface: "S级·零城中村静谧文教界面（紧邻福田外国语学校校区，周边无任何城中村握手楼）",
      commGrade: "S_MALL",
      samWalk: false,
      purePodium: true,
      podiumType: "围合花园全架空层设计，无嘈杂底商油烟",
      supermarketInfo: "步行350米即达岁宝壹品【盒马鲜生旗舰店】+ 驱车5分钟达【印力山姆会员店】",
      wetMarketInfo: "步行600米即达深圳最大的【福田农批市场】+ 盒马鲜生，生鲜品质全城最高",
      metroMeters: 350,
      metroStation: "9号线梅景站 / 2号线景田站",
      metroDist: "★ 约 350米 (步行5分钟达梅景站)",
      commuteMins: 22,
      commuteRoute: "9号线梅景站 → 2站至孖岭转10号线 → 贝尔路站(全程仅22分钟，到坂田贝尔路极快!)",
      tenYearBeta: "福田外国语学校旁低密纯商品房大盘，容积率3.6且户型方正，家庭改善终极自住优选。",
      resilienceGrade: "HIGH",
      drawdownPct: 22,
      priceCeilingVerify: "2021峰值约10.2万→2026稳定在7.8~8.2万/㎡(回撤约22%)，105㎡三房两卫约820万。",
      propertyInfo: "信和物业 · 3.5元/㎡",
      schoolKey: "FUTIAN_WAI_JT"
    },
    "翔名苑": {
      zone: "福田景田",
      isNewBuild: false,
      phaseSummary: "共1期3栋精致空中花园社区",
      buildYear: "2003年",
      regGen: "GEN0",
      regLabel: "第0代·实用紧凑规",
      usableAvg: "83%~85%",
      plotRatio: 4.2,
      maxFloorNum: 28,
      elevatorGrade: "BALANCE",
      densityGrade: "MID",
      densityLabel: "中密社区 (容积率4.2)",
      totalFloors: "28层",
      elevatorRatio: "2梯5户 / 2梯6户",
      buildingSpacing: "约 40~55米",
      parkingRatio: 0.80,
      parkingLabel: "⚠️ 1:0.80 (车位偏紧)",
      purityGrade: "S",
      hasResettlement: "ZERO",
      hasSubsidized: false,
      resettlementDetail: "🏆 100%纯商品房社区，0回迁房、0保障房！",
      purityLabel: "★ S级·0回迁+0保障 (100%纯商品房)",
      assetTier: "主流刚改",
      residentProfile: "冲着“500万级上车福田中心区+景秀/福外学区+双地铁口”的年轻中产与鸡娃家庭",
      villageGrade: "S",
      villageDistText: "🏆 S级·景田零城中村核心街区",
      urbanInterface: "S级·零城中村现代街区（周边为万科金色家园、景田酒店及市政公园，无民房）",
      commGrade: "S_MALL",
      samWalk: false,
      purePodium: false,
      podiumType: "裙楼带社区便民商业与银行，3楼为空中花园",
      supermarketInfo: "步行300米达华润万家/盒马鲜生，驱车6分钟达印力山姆会员店",
      wetMarketInfo: "步行300米达景田肉菜市场+钱大妈，买菜极便利",
      metroMeters: 250,
      metroStation: "2号线/9号线景田站",
      metroDist: "★ 约 250米 (步行3~4分钟)",
      commuteMins: 23,
      commuteRoute: "9号线景田站 → 3站至孖岭转10号线 → 贝尔路站(约23分钟)",
      tenYearBeta: "福田景田板块500~580万总价段唯一能买到正规三房的纯商品房电梯社区，上车门槛极友好。",
      resilienceGrade: "MID",
      drawdownPct: 24,
      priceCeilingVerify: "76~85㎡三房总价在510~575万区间，在福田中心区具备极强的刚需底座。",
      propertyInfo: "城建物业 · 3.2元/㎡",
      schoolKey: "FUTIAN_WAI_JT"
    }
  };

  Object.assign(COMMUNITIES_MACRO, JINGTIAN_COMMUNITIES);

  // 为原有 20 个楼盘补齐【最高楼层数 maxFloorNum】与【梯户比舒适度分级 elevatorGrade】
  const FLOOR_ELEVATOR_META = {
    "佳兆业中央广场": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "信义嘉御山": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "诺德中央道": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "大族云峰": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "万科麓城三期": { maxFloorNum: 34, elevatorGrade: "COMFORT" },
    "鸿荣源尚峰": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "健康花城": { maxFloorNum: 32, elevatorGrade: "COMFORT" },
    "特发臻华府": { maxFloorNum: 47, elevatorGrade: "DENSE" },
    "信义金御半山": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "信义金御半山·珑门": { maxFloorNum: 45, elevatorGrade: "DENSE" },
    "百合世纪广场": { maxFloorNum: 46, elevatorGrade: "DENSE" },
    "万科红": { maxFloorNum: 32, elevatorGrade: "BALANCE" },
    "佳兆业未来花园": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "京基御景中央": { maxFloorNum: 30, elevatorGrade: "COMFORT" },
    "颐安·都会中央": { maxFloorNum: 33, elevatorGrade: "COMFORT" },
    "星河时代花园": { maxFloorNum: 32, elevatorGrade: "COMFORT" },
    "中海康城花园": { maxFloorNum: 32, elevatorGrade: "BALANCE" },
    "中海大运玖章": { maxFloorNum: 48, elevatorGrade: "COMFORT" },
    "深铁阅云境广场": { maxFloorNum: 46, elevatorGrade: "BALANCE" },
    "泰瑞府": { maxFloorNum: 47, elevatorGrade: "DENSE" }
  };

  Object.entries(FLOOR_ELEVATOR_META).forEach(([k, v]) => {
    if (COMMUNITIES_MACRO[k]) Object.assign(COMMUNITIES_MACRO[k], v);
  });

  // 新增景田片区具体楼栋户号数据
  const JINGTIAN_UNITS = [
    {
      id: "jt-vanke-2-89",
      project: "万科金色家园",
      phase: "二期 / 三期",
      building: "二期 3栋 / 三期 5栋 (花园内圈)",
      unitCode: "02/03户 (低密板式通透三房)",
      layoutType: "3室2厅2卫",
      structureType: "南北通透·板式",
      area: 92,
      usableRateNum: 86,
      usableArea: 79.1,
      orientation: "正南",
      noiseLevel: "QUIET",
      acousticGrade: "ABSOLUTE_QUIET",
      arterialDistMeters: 210,
      bldgFloors: 18,
      bldgElevator: "1梯2户 / 2梯4户",
      noiseLabel: "★ 真极致静谧 · 内园且距干道210m",
      roadDistMeters: "位于景田棋盘支路内侧，距北环大道超450米、距红荔西路超350米、距新洲路约210米",
      specialNoise: "无铁路/无高架/无货车干道，18层小高层被百年大树环绕（实测约39~42dB）",
      minPrice: 695,
      maxPrice: 760,
      priceRange: "695~760 万",
      twoKidsNote: "福田景田标杆！18层小高层1梯2户/2梯4户（告别超高层等电梯），下楼200m入景田地铁站，太太9转10号线反向通勤23分钟直达贝尔路站（全程有座）！",
      scores: { quiet: 97, edu: 95, commute: 90, space: 89, comm: 96, asset: 95 },
      unitResettleCheck: "🏆 100%纯商品房净地社区（0回迁0保障）",
      unitVillageCheck: "🏆 福田中心政商住区，方圆800米零城中村",
      unitCommNoiseCheck: "✅ 二/三期内园楼座无餐饮底商油烟"
    },
    {
      id: "jt-tianjian-3-122",
      project: "天健天骄北庐",
      phase: "北庐",
      building: "B座 / C座 (中央园景央座)",
      unitCode: "01/02户 (奢阔大横厅三房两卫)",
      layoutType: "3室2厅2卫",
      structureType: "大横厅·LDKB一体",
      area: 122,
      usableRateNum: 82,
      usableArea: 100.0,
      orientation: "东南",
      noiseLevel: "QUIET",
      acousticGrade: "ABSOLUTE_QUIET",
      arterialDistMeters: 230,
      bldgFloors: 40,
      bldgElevator: "2梯3户 (专梯入户)",
      noiseLabel: "★ 真极致静谧 · 距干道230m+三玻隔音",
      roadDistMeters: "位于景田路与莲花路内侧，距北环大道超600米、距新洲路主干道约230米",
      specialNoise: "无铁路/高架，配顶豪级三玻两腔系统窗，室内极静（约38~41dB）",
      minPrice: 1180,
      maxPrice: 1350,
      priceRange: "1180~1350 万",
      twoKidsNote: "福田景田终极改善天花板！专梯入户+车位比1:1.55+福田外国语本部+步行逛山姆/盒马+24分钟反向地铁直达贝尔路站。",
      scores: { quiet: 96, edu: 96, commute: 89, space: 97, comm: 99, asset: 98 },
      unitResettleCheck: "🏆 北庐组团100%纯大户商品房",
      unitVillageCheck: "🏆 香蜜湖与莲花山之间，零城中村顶豪界面",
      unitCommNoiseCheck: "🏆 纯高定会所架空层，0底商油烟"
    },
    {
      id: "jt-tianran-2-102",
      project: "天然居",
      phase: "一期围合",
      building: "2栋 / 3栋 (超大中心花园栋)",
      unitCode: "02/03户 (正南看花园大三房两卫)",
      layoutType: "3室2厅2卫",
      structureType: "竖厅·动静分区",
      area: 102,
      usableRateNum: 86,
      usableArea: 87.7,
      orientation: "正南",
      noiseLevel: "QUIET",
      acousticGrade: "INNER_CANYON_ECHO",
      arterialDistMeters: 145,
      bldgFloors: 27,
      bldgElevator: "2梯3户 / 2梯4户",
      noiseLabel: "内园安静 · 距北环辅路约145m",
      roadDistMeters: "虽朝向社区中央大花园不临街，但小区北外围距北环大道约145米（由北排1栋遮挡）",
      specialNoise: "属于典型围合式小区：2/3栋看内园无直射噪音，但高区夜间开窗有轻微远端北环大道低频背景声（约46dB，关窗36dB）",
      minPrice: 760,
      maxPrice: 835,
      priceRange: "760~835 万",
      twoKidsNote: "27层2梯3户舒适梯户比+102㎡实得87.7㎡+家门口福外本部+步行350m入9号线梅景站（仅22分钟直达坂田贝尔路站）！",
      scores: { quiet: 88, edu: 95, commute: 92, space: 92, comm: 95, asset: 94 },
      unitResettleCheck: "🏆 100%纯商品房净地（0回迁0保障）",
      unitVillageCheck: "🏆 紧邻福外校区，零城中村",
      unitCommNoiseCheck: "✅ 全架空层围合花园，无底商油烟"
    },
    {
      id: "jt-xiangming-2-80",
      project: "翔名苑",
      phase: "一期",
      building: "B栋 (空中花园内侧)",
      unitCode: "03/05户 (紧凑实用三房一卫)",
      layoutType: "3室2厅1卫",
      structureType: "竖厅·动静分区",
      area: 80,
      usableRateNum: 84,
      usableArea: 67.2,
      orientation: "东南",
      noiseLevel: "SUB_ROAD",
      acousticGrade: "SUB_ROAD",
      arterialDistMeters: 95,
      bldgFloors: 28,
      bldgElevator: "2梯5户",
      noiseLabel: "临景田支路 · 距新洲路约95m",
      roadDistMeters: "朝向空中花园与景田内街，距新洲路主干道约95米",
      specialNoise: "无铁路/高架，日间有温和市政街区车流声（约49~52dB）",
      minPrice: 515,
      maxPrice: 565,
      priceRange: "515~565 万",
      twoKidsNote: "500万级上车福田景田双地铁口+福外/景秀学区+23分钟直达贝尔路站的最高性价比跳板！",
      scores: { quiet: 79, edu: 93, commute: 91, space: 76, comm: 86, asset: 89 },
      unitResettleCheck: "🏆 100%纯商品房（0回迁0保障）",
      unitVillageCheck: "🏆 景田中心街区，零城中村",
      unitCommNoiseCheck: "⚠️ 裙楼带银行与便民商铺，建议选8层以上"
    }
  ];

  UNITS_DATA.push(...JINGTIAN_UNITS);

  // ==========================================================================
  // 2. 为全部存量户号补充【本栋层高 bldgFloors、本栋梯户比 bldgElevator】与【五级声学直线距离模型 acousticGrade】
  //    解决“围合式小区虽看中央内园，但距外围主干道/高架/铁路仅100余米仍有低频反射噪音”的痛点
  // ==========================================================================
  const UNIT_ACOUSTIC_AND_BLDG_PATCH = {
    "bt-kaisa-3-89":    { bldgFloors: 32, bldgElevator: "2梯4户", arterialDistMeters: 185, acousticGrade: "ABSOLUTE_QUIET", echoNote: "三期正中央且由外圈1/6/7栋360度闭环阻隔，距坂澜大道185米，无低频反射（≤42dB）" },
    "bt-kaisa-1-88":    { bldgFloors: 32, bldgElevator: "2梯5户", arterialDistMeters: 150, acousticGrade: "SUB_ROAD", echoNote: "靠宝吉路支路35米，距坂澜大道150米" },
    "bt-kaisa-main":    { bldgFloors: 33, bldgElevator: "2梯5户", arterialDistMeters: 25,  acousticGrade: "MAIN_ROAD", echoNote: "直面坂澜大道仅25米，重度干道胎噪" },
    "bt-xinyi-5-89":    { bldgFloors: 32, bldgElevator: "2梯4户", arterialDistMeters: 215, acousticGrade: "ABSOLUTE_QUIET", echoNote: "深居百万方大城腹地，距五和大道215米+百米楼距，真极致静谧（≤41dB）" },
    "bt-xinyi-2-86":    { bldgFloors: 32, bldgElevator: "2梯5户", arterialDistMeters: 145, acousticGrade: "INNER_CANYON_ECHO", echoNote: "虽朝内园不临街，但距吉华路约145米，高区开窗有轻微远端道路背景音（约46dB）" },
    "bt-nuode-2-89":    { bldgFloors: 33, bldgElevator: "2梯4户", arterialDistMeters: 130, acousticGrade: "INNER_CANYON_ECHO", echoNote: "⚠️ 典型围合式痛点：虽朝内园，但小区紧凑，距五和大道130米，存在一定高区低频反射声（约47dB）" },
    "bt-dazu-1-96":     { bldgFloors: 32, bldgElevator: "2梯4户", arterialDistMeters: 165, acousticGrade: "INNER_CANYON_ECHO", echoNote: "围合式大花园内向，距坂雪岗大道165米，中低区极静，25层以上有轻微远端低频背景声" },
    "vanke-3-89":       { bldgFloors: 33, bldgElevator: "2梯4户", arterialDistMeters: 195, acousticGrade: "ABSOLUTE_QUIET", echoNote: "北靠银湖山体，南由5/6栋及双层园林隔绝布龙路(距195米)，实测≤43dB" },
    "vanke-1-88":       { bldgFloors: 33, bldgElevator: "2梯5户", arterialDistMeters: 170, acousticGrade: "SUB_ROAD", echoNote: "临水径支路40米，距布龙路170米" },
    "vanke-6-88":       { bldgFloors: 34, bldgElevator: "2梯5户", arterialDistMeters: 35,  acousticGrade: "MAIN_ROAD", echoNote: "距布龙路快速路及高架引桥仅35米，重度大车低频噪音" },
    "horoy-6-89":       { bldgFloors: 32, bldgElevator: "2梯4户", arterialDistMeters: 225, acousticGrade: "ABSOLUTE_QUIET", echoNote: "背靠三联山体公园，距北侧布龙路长达225米且由北排1/2/8栋完整屏蔽，真极致静谧（≤41dB）" },
    "horoy-7-88":       { bldgFloors: 32, bldgElevator: "2梯5户", arterialDistMeters: 185, acousticGrade: "ABSOLUTE_QUIET", echoNote: "7栋紧靠南侧山体距布龙路185米极静；3A栋则靠西环路辅路" },
    "jkhc-6-89":        { bldgFloors: 30, bldgElevator: "2梯4户", arterialDistMeters: 215, acousticGrade: "ABSOLUTE_QUIET", echoNote: "南向直面78万㎡石芽岭山体公园，距北侧布龙路超215米，真极致静谧（≤41dB）" },
    "jkhc-3-86":        { bldgFloors: 30, bldgElevator: "2梯4户", arterialDistMeters: 150, acousticGrade: "INNER_CANYON_ECHO", echoNote: "围合中圈朝内园，距北侧布龙路150米，高区有轻微远端道路混响（约46dB）" },
    "jkhc-1-main":      { bldgFloors: 32, bldgElevator: "2梯5户", arterialDistMeters: 30,  acousticGrade: "MAIN_ROAD", echoNote: "北排距布龙路仅30米，货车噪音明显" },
    "tefa-3-96":        { bldgFloors: 46, bldgElevator: "3梯5户", arterialDistMeters: 130, acousticGrade: "INNER_CANYON_ECHO", echoNote: "⚠️ 典型高密围合痛点：3栋虽在中央看内园，但南距盛宝路130m、北距广深铁路180m，高区开窗仍能听到远端列车与干道低频反射声（约46~48dB）" },
    "tefa-3-87":        { bldgFloors: 47, bldgElevator: "3梯6户", arterialDistMeters: 115, acousticGrade: "INNER_CANYON_ECHO", echoNote: "⚠️ 47层超高层3梯6户；虽看内园/支路，但距盛宝路115米、距铁路190米，存在一定围合低频回音" },
    "bgl-banshan-3-89": { bldgFloors: 32, bldgElevator: "2梯4户", arterialDistMeters: 190, acousticGrade: "ABSOLUTE_QUIET", echoNote: "半山台地后靠荔山森林公园，距外围干道超190米，真极致静谧（≤41dB）" },
    "bgl-banshan-1-86": { bldgFloors: 32, bldgElevator: "2梯5户", arterialDistMeters: 130, acousticGrade: "INNER_CANYON_ECHO", echoNote: "一期/二期围合内园，距罗岗路130米，有轻微商圈背景音" },
    "bgl-longmen-2-95": { bldgFloors: 44, bldgElevator: "3梯5户", arterialDistMeters: 125, acousticGrade: "INNER_CANYON_ECHO", echoNote: "⚠️ 44层超高层3梯5户；虽朝内园，但距罗岗路125米，高区有轻微城市干道低频背景音" },
    "bgl-baihe-2-98":   { bldgFloors: 45, bldgElevator: "3梯5户", arterialDistMeters: 130, acousticGrade: "INNER_CANYON_ECHO", echoNote: "⚠️ 45层超高层3梯5户；围合内园距翔鸽路130米，高区有轻微商圈车流混响" },
    "bgl-vankered-3-89":{ bldgFloors: 31, bldgElevator: "2梯4户", arterialDistMeters: 135, acousticGrade: "INNER_CANYON_ECHO", echoNote: "三期围合花园内圈，距惠康路135米，整体安静但高区有轻微街区背景声" },
    "kaisa-3-89":       { bldgFloors: 32, bldgElevator: "2梯4户", arterialDistMeters: 140, acousticGrade: "INNER_CANYON_ECHO", echoNote: "围合小区内园向，距如意路140米、龙飞大道160米，高区夜间有轻微干道反射音" },
    "kk-3-97":          { bldgFloors: 29, bldgElevator: "2梯4户", arterialDistMeters: 165, acousticGrade: "ABSOLUTE_QUIET", echoNote: "29层低密2梯4户，百米楼距大花园中央，距周边干道165米+，实测≤43dB" },
    "kk-2-86":          { bldgFloors: 29, bldgElevator: "2梯4户", arterialDistMeters: 115, acousticGrade: "INNER_CANYON_ECHO", echoNote: "虽朝中央水景花园不临街，但本栋属于外围围合楼座，距飞扬路/如意路约115米，背向走廊侧及高区有轻微干道低频声" },
    "yian-3-89":        { bldgFloors: 32, bldgElevator: "2梯4户", arterialDistMeters: 205, acousticGrade: "ABSOLUTE_QUIET", echoNote: "深居二/三期园林内侧，距龙岗大道及3号线高架超205米，真极致静谧" },
    "galaxy-6-89":      { bldgFloors: 31, bldgElevator: "2梯4户", arterialDistMeters: 235, acousticGrade: "ABSOLUTE_QUIET", echoNote: "南向跨越整个低密别墅区，距龙岗大道及黄阁路超235米，真极致静谧（≤40dB）" },
    "cohl-kc-89":       { bldgFloors: 30, bldgElevator: "2梯4户", arterialDistMeters: 210, acousticGrade: "ABSOLUTE_QUIET", echoNote: "25栋超大社区正中央3/4/12/15栋，距盐龙大道超210米，四周三层楼栋屏蔽，极静" },
    "cohl-jz-126":      { bldgFloors: 31, bldgElevator: "2梯4户(3B栋)/3梯4户(3A栋)", arterialDistMeters: 155, acousticGrade: "ABSOLUTE_QUIET", echoNote: "3B栋仅31层2梯4户，距黄阁路155米且全屋配豪宅级三玻两腔隔音幕墙，室内≤38dB" },
    "szt-yyj-98":       { bldgFloors: 45, bldgElevator: "2梯5户(3单元)/3梯5户(2单元)", arterialDistMeters: 120, acousticGrade: "INNER_CANYON_ECHO", echoNote: "⚠️ 典型围合TOD特征：虽朝空中花园内院不临街，但外圈距龙岗大道仅120米，高区开窗仍有大道低频车流混响（关窗37dB）" },
    "sy-trf-99":        { bldgFloors: 46, bldgElevator: "3梯6户", arterialDistMeters: 130, acousticGrade: "INNER_CANYON_ECHO", echoNote: "⚠️ 46层超高层3梯6户；围合小区内园向，距龙飞大道与如意路约130米，高区开窗有轻微干道低频反射声" }
  };

  UNITS_DATA.forEach(u => {
    if (UNIT_ACOUSTIC_AND_BLDG_PATCH[u.id]) {
      Object.assign(u, UNIT_ACOUSTIC_AND_BLDG_PATCH[u.id]);
    }
  });

  // ==========================================================================
  // 3. 动态注入新增的筛选器 DOM（宏观：13.最高层高、14.梯户比；微观：重构6.五级声学与直线距离、新增本栋层高/梯户比）
  //    并将所有下拉框一键升级为【可多选 Multi-Select 组件】
  // ==========================================================================
  onReady(() => {
    // 3.1 更新宏观片区下拉框，加入【福田景田】
    const macroZoneSel = byId("macroZoneFilter");
    if (macroZoneSel && !macroZoneSel.querySelector('option[value="福田景田"]')) {
      macroZoneSel.options[0].textContent = "全部五大片区 (25盘)";
      const opt = document.createElement("option");
      opt.value = "福田景田";
      opt.textContent = "★ 福田景田片区 (5盘·福外本部/反向通勤)";
      macroZoneSel.appendChild(opt);
    }

    // 3.2 在宏观过滤网格中新增【13. 超高层/总层高控制】与【14. 舒适梯户比】
    const macroGrid = byId("macroZoneFilter")?.parentElement.parentElement;
    if (macroGrid) {
      const floorDiv = document.createElement("div");
      floorDiv.innerHTML = `
        <label class="block text-rose-700 font-bold mb-1">13. 🏙️ 超高层/总层高控制</label>
        <select id="macroFloorFilter" class="w-full rounded-lg border border-rose-300 px-2 py-1.5 bg-rose-50/40 font-medium">
          <option value="ALL">全部楼层高度 (18~48层)</option>
          <option value="LOW_MID">★ 严避超高层：≤33层标准高层/小高层</option>
          <option value="SEMI_HIGH">34~42层准超高层</option>
          <option value="SUPER_HIGH">≥43层超高层 (43~48层)</option>
        </select>
      `;
      const elevDiv = document.createElement("div");
      elevDiv.innerHTML = `
        <label class="block text-indigo-700 font-bold mb-1">14. 🛗 社区梯户比舒适度</label>
        <select id="macroElevatorFilter" class="w-full rounded-lg border border-indigo-300 px-2 py-1.5 bg-indigo-50/40 font-medium">
          <option value="ALL">全部梯户比</option>
          <option value="COMFORT">★ 舒适候梯：1梯2户 / 2梯3户 / 2梯4户</option>
          <option value="BALANCE">平衡候梯：2梯5户 / 3梯4户</option>
          <option value="DENSE">高密候梯：3梯5户 / 3梯6户</option>
        </select>
      `;
      macroGrid.appendChild(floorDiv);
      macroGrid.appendChild(elevDiv);
    }

    // 3.3 升级微观视角【6. 临街与声学直线距离模型】下拉框选项，并新增【本栋层高/梯户比】筛选项
    const noiseSel = byId("filterNoise");
    if (noiseSel) {
      noiseSel.innerHTML = `
        <option value="NO_MAIN" selected>严避主干道/铁路直冲 (含内园+支路)</option>
        <option value="ABSOLUTE_QUIET">★ S级真极致静谧 (内园且距干道/高架/铁路>180m)</option>
        <option value="INNER_CANYON_ECHO">A-级围合内园 (不临街但距干道110~170m有轻微低频混响)</option>
        <option value="SUB_ROAD">B级临生活辅路/支路</option>
        <option value="MAIN_ROAD">⚠️ C级直面主干道/高架/铁路 (避坑警示)</option>
        <option value="ALL">显示全部声学等级</option>
      `;
    }

    const microGrid = byId("filterProject")?.parentElement.parentElement;
    if (microGrid) {
      const bldgSpecDiv = document.createElement("div");
      bldgSpecDiv.innerHTML = `
        <label class="block text-indigo-700 font-bold mb-1">10. 🛗 本栋层高与梯户比</label>
        <select id="filterBldgSpec" class="w-full rounded-lg border border-indigo-300 px-2 py-1.5 bg-indigo-50/40 font-medium">
          <option value="ALL">全部本栋规格</option>
          <option value="NO_SUPER_2T4">★ 本栋≤33层 且 ≤2梯4户(秒等电梯)</option>
          <option value="NO_SUPER">本栋≤33层标准高层 (拒45层+超高层)</option>
          <option value="SUPER_HIGH">本栋>40层超高层新规盘</option>
        </select>
      `;
      microGrid.appendChild(bldgSpecDiv);
    }

    // ========================================================================
    // 4. 核心多选组件引擎：将全站所有筛选 <select> 转换为支持多选的 Checkbox 下拉组件
    // ========================================================================
    const MULTI_SELECT_IDS = [
      "macroZoneFilter", "macroNewOldFilter", "macroRegFilter", "macroPurityFilter",
      "macroVillageFilter", "macroCommFilter", "macroMetroDistFilter", "macroDensityFilter",
      "macroParkingFilter", "macroTierFilter", "macroSchoolRateFilter", "macroResilienceFilter",
      "macroFloorFilter", "macroElevatorFilter",
      "filterProject", "filterBuilding", "filterLayout", "filterStructure",
      "filterOrientation", "filterNoise", "filterUsableRate", "filterCommute",
      "filterPriceBracket", "filterBldgSpec"
    ];

    multiSelectState = {};

    getMultiValues = function(id) {
      const st = multiSelectState[id];
      if (!st || st.selected.size === 0 || st.selected.has("ALL") || st.selected.has("9999") || st.selected.has("0")) {
        return ["ALL"];
      }
      return Array.from(st.selected);
    };

    buildMultiSelectUI = function(selectId) {
      const sel = byId(selectId);
      if (!sel) return;

      const defaultOption = sel.options[0]?.value || "ALL";
      const initialSelected = new Set();
      Array.from(sel.options).forEach(opt => {
        if (opt.selected) initialSelected.add(opt.value);
      });
      if (initialSelected.size === 0) initialSelected.add(defaultOption);

      multiSelectState[selectId] = {
        defaultVal: defaultOption,
        selected: initialSelected
      };

      // 若已包装过则仅刷新内部列表
      let wrapper = sel.parentElement.querySelector(".ms-wrapper");
      if (!wrapper) {
        sel.style.display = "none";
        wrapper = document.createElement("div");
        wrapper.className = "ms-wrapper";
        sel.parentElement.appendChild(wrapper);
      }

      const renderDropdownContent = () => {
        const st = multiSelectState[selectId];
        const opts = Array.from(sel.options);
        const nonDefaultSelected = Array.from(st.selected).filter(v => v !== st.defaultVal);

        let btnLabel = opts[0]?.textContent || "全部";
        let isActive = false;
        if (nonDefaultSelected.length === 1) {
          const found = opts.find(o => o.value === nonDefaultSelected[0]);
          btnLabel = found ? found.textContent : nonDefaultSelected[0];
          isActive = true;
        } else if (nonDefaultSelected.length > 1) {
          const firstText = opts.find(o => o.value === nonDefaultSelected[0])?.textContent.slice(0, 8) || "";
          btnLabel = `已选 ${nonDefaultSelected.length} 项 (${firstText}...)`;
          isActive = true;
        }

        wrapper.innerHTML = `
          <button type="button" class="ms-btn ${isActive ? 'active-filter' : ''}">
            <span class="truncate pr-1">${btnLabel}</span>
            <span class="text-[10px] text-slate-400 shrink-0">▼ 多选</span>
          </button>
          <div class="ms-dropdown custom-scroll">
            <div class="ms-actions">
              <span class="text-indigo-600 font-semibold cursor-pointer hover:underline" data-act="all">✓ 恢复全部(不限)</span>
              <span class="text-slate-400">可勾选多项并集</span>
            </div>
            ${opts.map((o, idx) => {
              const checked = st.selected.has(o.value) ? "checked" : "";
              const isDef = idx === 0;
              return `
                <label class="ms-item ${isDef ? 'font-semibold text-indigo-900 bg-slate-50/80' : ''}">
                  <input type="checkbox" value="${o.value}" ${checked} data-def="${isDef ? '1' : '0'}" class="accent-indigo-600 rounded cursor-pointer" />
                  <span class="leading-tight">${o.textContent}</span>
                </label>
              `;
            }).join("")}
          </div>
        `;

        const btn = wrapper.querySelector(".ms-btn");
        const drop = wrapper.querySelector(".ms-dropdown");

        btn.addEventListener("click", e => {
          e.stopPropagation();
          root.querySelectorAll(".ms-dropdown.open").forEach(d => {
            if (d !== drop) d.classList.remove("open");
          });
          drop.classList.toggle("open");btn.setAttribute("aria-expanded",String(drop.classList.contains("open")));
        });

        drop.addEventListener("click", e => e.stopPropagation());

        wrapper.querySelector('[data-act="all"]').addEventListener("click", () => {
          st.selected.clear();
          st.selected.add(st.defaultVal);
          renderDropdownContent();
          triggerFilterUpdate(selectId);
        });

        wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.addEventListener("change", () => {
            const val = cb.value;
            const isDef = cb.getAttribute("data-def") === "1";
            if (isDef) {
              st.selected.clear();
              st.selected.add(st.defaultVal);
            } else {
              if (cb.checked) {
                st.selected.delete(st.defaultVal);
                st.selected.add(val);
              } else {
                st.selected.delete(val);
                if (st.selected.size === 0) st.selected.add(st.defaultVal);
              }
            }
            renderDropdownContent();
            wrapper.querySelector(".ms-dropdown").classList.add("open");
            triggerFilterUpdate(selectId);
          });
        });
      };

      renderDropdownContent();
      wrapper.refreshUI = renderDropdownContent;
    };

    document.addEventListener("click", () => {
      root.querySelectorAll(".ms-dropdown.open").forEach(d => d.classList.remove("open"));
    });

    function triggerFilterUpdate(changedId) {
      if (changedId.startsWith("macro")) {
        renderMacroTable();
        redrawUnitViews();
      } else if (changedId === "filterProject") {
        updateBuildingOptions();
        buildMultiSelectUI("filterBuilding");
        redrawUnitViews();
      } else {
        redrawUnitViews();
      }
    }

    // ========================================================================
    // 5. 重写支持多选并集判定的宏观与微观过滤引擎
    // ========================================================================
    isCommunityPassingMacro = function(projectName) {
      const m = COMMUNITIES_MACRO[projectName];
      if (!m) return false;
      const school = SCHOOL_DISTRICTS[m.schoolKey];

      const zones = getMultiValues("macroZoneFilter");
      if (!zones.includes("ALL") && !zones.includes(m.zone)) return false;

      const newOlds = getMultiValues("macroNewOldFilter");
      if (!newOlds.includes("ALL")) {
        const passNewOld = newOlds.some(v => (v === "NEW" && m.isNewBuild) || (v === "SECOND" && !m.isNewBuild));
        if (!passNewOld) return false;
      }

      const regs = getMultiValues("macroRegFilter");
      if (!regs.includes("ALL") && !regs.includes(m.regGen)) return false;

      const purities = getMultiValues("macroPurityFilter");
      if (!purities.includes("ALL")) {
        const passPure = purities.some(v => matchPurityFilter(m, v));
        if (!passPure) return false;
      }

      const villages = getMultiValues("macroVillageFilter");
      if (!villages.includes("ALL")) {
        const passVil = villages.some(v =>
          (v === "S" && m.villageGrade === "S") ||
          (v === "A" && (m.villageGrade === "S" || m.villageGrade === "A"))
        );
        if (!passVil) return false;
      }

      const comms = getMultiValues("macroCommFilter");
      if (!comms.includes("ALL")) {
        const passComm = comms.some(v => matchCommercialFilter(m, v));
        if (!passComm) return false;
      }

      const metros = getMultiValues("macroMetroDistFilter");
      if (!metros.includes("ALL")) {
        const maxM = Math.max(...metros.map(Number));
        if (m.metroMeters > maxM) return false;
      }

      const densities = getMultiValues("macroDensityFilter");
      if (!densities.includes("ALL")) {
        const passDen = densities.some(v =>
          (v === "LOW" && m.plotRatio <= 3.8) ||
          (v === "MID" && m.plotRatio <= 4.8)
        );
        if (!passDen) return false;
      }

      const parkings = getMultiValues("macroParkingFilter");
      if (!parkings.includes("ALL")) {
        const minP = Math.min(...parkings.map(Number));
        if (m.parkingRatio < minP) return false;
      }

      const tiers = getMultiValues("macroTierFilter");
      if (!tiers.includes("ALL") && !tiers.includes(m.assetTier)) return false;

      const sRates = getMultiValues("macroSchoolRateFilter");
      if (!sRates.includes("ALL")) {
        const minR = Math.min(...sRates.map(Number));
        if (school.publicHighRate < minR) return false;
      }

      const resiliences = getMultiValues("macroResilienceFilter");
      if (!resiliences.includes("ALL")) {
        const passRes = resiliences.some(v =>
          (v === "HIGH" && m.resilienceGrade === "HIGH") ||
          (v === "MID" && (m.resilienceGrade === "HIGH" || m.resilienceGrade === "MID"))
        );
        if (!passRes) return false;
      }

      // 新增宏观 13：超高层/总层高多选过滤
      const floors = getMultiValues("macroFloorFilter");
      if (!floors.includes("ALL")) {
        const passFloor = floors.some(v =>
          (v === "LOW_MID" && m.maxFloorNum <= 33) ||
          (v === "SEMI_HIGH" && m.maxFloorNum >= 34 && m.maxFloorNum <= 42) ||
          (v === "SUPER_HIGH" && m.maxFloorNum >= 43)
        );
        if (!passFloor) return false;
      }

      // 新增宏观 14：社区梯户比舒适度多选过滤
      const elevs = getMultiValues("macroElevatorFilter");
      if (!elevs.includes("ALL") && !elevs.includes(m.elevatorGrade)) return false;

      return true;
    };

    getFilteredUnits = function(ignoreMainRoadForTop = false) {
      const projs = getMultiValues("filterProject");
      const blds = getMultiValues("filterBuilding");
      const layouts = getMultiValues("filterLayout");
      const structs = getMultiValues("filterStructure");
      const orients = getMultiValues("filterOrientation");
      const noises = getMultiValues("filterNoise");
      const usableRates = getMultiValues("filterUsableRate");
      const commutes = getMultiValues("filterCommute");
      const brackets = getMultiValues("filterPriceBracket");
      const bldgSpecs = getMultiValues("filterBldgSpec");
      const maxSlider = Number(byId("filterMaxPriceSlider").value);

      return UNITS_DATA.filter(u => {
        if (!isCommunityPassingMacro(u.project)) return false;
        if (!projs.includes("ALL") && !projs.includes(u.project)) return false;
        if (!blds.includes("ALL") && !blds.includes(`${u.project} - ${u.building}`)) return false;
        if (!layouts.includes("ALL") && !layouts.includes(u.layoutType)) return false;
        if (!structs.includes("ALL") && !structs.includes(u.structureType)) return false;

        if (!orients.includes("ALL") && !orients.includes("VALID_SOUTH")) {
          if (!orients.includes(u.orientation)) return false;
        }

        if (ignoreMainRoadForTop && u.noiseLevel === "MAIN_ROAD") return false;

        // 五级声学与直线距离多选判定
        if (!noises.includes("ALL")) {
          const passNoise = noises.some(n => {
            if (n === "NO_MAIN") return u.noiseLevel !== "MAIN_ROAD";
            if (n === "ABSOLUTE_QUIET") return u.acousticGrade === "ABSOLUTE_QUIET";
            if (n === "INNER_CANYON_ECHO") return u.acousticGrade === "INNER_CANYON_ECHO";
            if (n === "SUB_ROAD") return u.acousticGrade === "SUB_ROAD" || u.noiseLevel === "SUB_ROAD";
            if (n === "MAIN_ROAD") return u.noiseLevel === "MAIN_ROAD";
            return true;
          });
          if (!passNoise) return false;
        }

        // 本栋层高与梯户比多选判定
        if (!bldgSpecs.includes("ALL")) {
          const passBldg = bldgSpecs.some(b => {
            if (b === "NO_SUPER_2T4") return (u.bldgFloors || 32) <= 33 && !(u.bldgElevator || "").includes("5户") && !(u.bldgElevator || "").includes("6户");
            if (b === "NO_SUPER") return (u.bldgFloors || 32) <= 33;
            if (b === "SUPER_HIGH") return (u.bldgFloors || 32) >= 40;
            return true;
          });
          if (!passBldg) return false;
        }

        if (!usableRates.includes("ALL")) {
          const minU = Math.min(...usableRates.map(Number));
          if (u.usableRateNum < minU) return false;
        }

        if (!commutes.includes("ALL")) {
          const maxC = Math.max(...commutes.map(Number));
          if (COMMUNITIES_MACRO[u.project].commuteMins > maxC) return false;
        }

        if (u.minPrice > maxSlider) return false;
        if (!brackets.includes("ALL")) {
          const passPrice = brackets.some(br => {
            const [from, to] = br.split("-").map(Number);
            const high = Math.min(maxSlider, to);
            return high >= from && u.maxPrice >= from && u.minPrice <= high;
          });
          if (!passPrice) return false;
        }

        return true;
      });
    };

    // 增强微观卡片展示：显示本栋层高、本栋梯户比、距干道直线距离及围合低频混响诊断
    const origRenderUnitCards = renderUnitCards;
    renderUnitCards = function() {
      origRenderUnitCards();
      const cards = root.querySelectorAll("#unitCardsContainer > div");
      const filtered = getFilteredUnits(false).map(u => ({
        ...u,
        totalScore: calcWeightedScore(u, getWeights())
      })).sort((a, b) => b.totalScore - a.totalScore);

      cards.forEach((card, idx) => {
        const u = filtered[idx];
        if (!u) return;
        const acousticBadge = u.acousticGrade === "ABSOLUTE_QUIET"
          ? '<span class="px-2 py-0.5 rounded font-bold badge-green">🔇 S级真静谧(距干道' + u.arterialDistMeters + 'm)</span>'
          : u.acousticGrade === "INNER_CANYON_ECHO"
          ? '<span class="px-2 py-0.5 rounded font-bold badge-amber">🔉 A-级内园但有远端低频混响(距干道' + u.arterialDistMeters + 'm)</span>'
          : '';
        const bldgBadge = '<span class="px-2 py-0.5 rounded font-semibold badge-indigo">🛗 本栋' + (u.bldgFloors || 32) + '层 · ' + (u.bldgElevator || '2梯4户') + '</span>';
        const tagWrap = card.querySelector('.flex.flex-wrap[class~="gap-1.5"].mt-2');
        if (tagWrap) {
          tagWrap.insertAdjacentHTML("beforeend", bldgBadge + acousticBadge);
        }
      });
    };

    // 初始化所有多选下拉菜单
    MULTI_SELECT_IDS.forEach(id => buildMultiSelectUI(id));

    // 拦截 updateProjectAndBuildingOptions 以同步刷新多选框 UI
    const origUpdateProj = updateProjectAndBuildingOptions;
    updateProjectAndBuildingOptions = function(passingNames) {
      origUpdateProj(passingNames);
      buildMultiSelectUI("filterProject");
      buildMultiSelectUI("filterBuilding");
    };

    // 绑定重置按钮刷新多选状态
    byId("resetMacroBtn")?.addEventListener("click", () => {
      MULTI_SELECT_IDS.filter(id => id.startsWith("macro")).forEach(id => buildMultiSelectUI(id));
      renderMacroTable();
      redrawUnitViews();
    });

    byId("resetFilterBtn")?.addEventListener("click", () => {
      MULTI_SELECT_IDS.forEach(id => buildMultiSelectUI(id));
      renderMacroTable();
      redrawUnitViews();
    });

    // 初次重绘以加载景田片区与多选状态
    renderSchoolTable();
    renderMacroTable();
    redrawUnitViews();
  });
})();


(function() {
  onReady(() => {
    // 1. 新增景田片区新盘/次新综合体代表【岁宝壹品】
    COMMUNITIES_MACRO["岁宝壹品"] = {
      zone: "福田景田",
      isNewBuild: true,
      phaseSummary: "共1期5栋摩天综合体 (准现房/次新)",
      buildYear: "2023-2025年",
      regGen: "GEN2",
      regLabel: "✨ 第2代·福田中心综合体新盘",
      usableAvg: "84%~86%",
      plotRatio: 6.5,
      maxFloorNum: 46,
      elevatorGrade: "BALANCE",
      densityGrade: "HIGH",
      densityLabel: "地铁上盖综合体 (容积率6.5)",
      totalFloors: "43~46层",
      elevatorRatio: "3梯4户 / 3梯5户",
      buildingSpacing: "约 50~75米 (空中花园)",
      parkingRatio: 1.15,
      parkingLabel: "🌟 1:1.15 (充裕)",
      purityGrade: "A",
      hasResettlement: "ZERO",
      hasSubsidized: false,
      resettlementDetail: "商业与住宅分区明确，无村民握手楼回迁砸盘。",
      purityLabel: "A级·福田中心次新综合体",
      assetTier: "品质改善",
      residentProfile: "福田/罗湖金融科技高管、年轻改善二胎家庭",
      villageGrade: "S",
      villageDistText: "🏆 S级·景田零城中村核心街区",
      urbanInterface: "S级·零城中村现代都市界面（楼下即5万㎡岁宝盒马鲜生旗舰MALL）",
      commGrade: "S_MALL",
      samWalk: false,
      purePodium: true,
      podiumType: "空中花园抬高物理隔离底部5万㎡岁宝商业MALL，电梯直达商场",
      supermarketInfo: "🏆 下楼即【岁宝盒马鲜生旗舰店MALL】+ 驱车6分钟达【印力中心山姆会员店】",
      wetMarketInfo: "下楼即盒马鲜生旗舰店+步行700米达福田农批市场",
      metroMeters: 100,
      metroStation: "9号线/6号线银湖站·梅景站",
      metroDist: "🏆 约 100~250米 (下楼直通地铁!)",
      commuteMins: 20,
      commuteRoute: "9号线1~2站至孖岭转10号线 → 4站直达贝尔路站(全程约20分钟!)",
      tenYearBeta: "福田景田/笔架山片区罕见次新大盘，享受福田中心配套与超快10号线换乘。",
      resilienceGrade: "HIGH",
      drawdownPct: 15,
      priceCeilingVerify: "次新房源护城河稳固，三房/四房在750~1050万区间极具竞争力。",
      propertyInfo: "岁宝高定物业 · 5.8元/㎡",
      schoolKey: "FUTIAN_WAI_JT"
    };

    // 2. 修正中海大运玖章 126㎡ 为标准【4室2厅2卫】，并扩充全库 12 组典型【4室2厅2卫 / 3+1室2厅2卫 / 4室2厅3卫】户号
    const jzUnit = UNITS_DATA.find(u => u.id === "cohl-jz-126");
    if (jzUnit) {
      jzUnit.layoutType = "4室2厅2卫";
      jzUnit.unitCode = "01/02户 (126㎡新规奢阔四房大横厅)";
    }

    const FOUR_BEDROOM_UNITS = [
      {
        id: "cohl-jz-139-4b3w",
        project: "中海大运玖章",
        phase: "一期 (2024二批新规)",
        building: "3栋B座 (2梯4户中央楼王)",
        unitCode: "01/02户 (139㎡双套房四房三卫)",
        layoutType: "4室2厅3卫",
        structureType: "南北通透·板式",
        area: 139,
        usableRateNum: 95,
        usableArea: 132.1,
        orientation: "东南",
        noiseLevel: "QUIET",
        acousticGrade: "ABSOLUTE_QUIET",
        arterialDistMeters: 165,
        bldgFloors: 31,
        bldgElevator: "2梯4户",
        noiseLabel: "★ 真极致静谧 · 31层2梯4户央座",
        roadDistMeters: "位于社区正中央，距黄阁路主干道约165米",
        specialNoise: "无铁路/高架，全屋配三玻两腔豪宅级隔音系统（室内≤38dB）",
        minPrice: 635,
        maxPrice: 720,
        priceRange: "635~720 万",
        twoKidsNote: "31层2梯4户纯板式！2024二批新规139㎡实得高达132㎡（堪比老盘165㎡），主卧+长辈房双套房三卫设计，二胎+老人同住终极形态！",
        scores: { quiet: 98, edu: 80, commute: 50, space: 100, comm: 99, asset: 98 },
        unitResettleCheck: "🏆 2024纯招拍挂净地：0回迁房、0保障房",
        unitVillageCheck: "🏆 大运天地商圈旁，方圆800米零城中村",
        unitCommNoiseCheck: "🏆 100%纯住宅会所架空层，零底商油烟"
      },
      {
        id: "vanke-3-112-4b",
        project: "万科麓城三期",
        phase: "三期",
        building: "2栋 / 3栋 (园林央座)",
        unitCode: "01/02户 (112㎡南北通透四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "南北通透·板式",
        area: 112,
        usableRateNum: 84,
        usableArea: 94.1,
        orientation: "正南",
        noiseLevel: "QUIET",
        acousticGrade: "ABSOLUTE_QUIET",
        arterialDistMeters: 195,
        bldgFloors: 33,
        bldgElevator: "2梯4户",
        noiseLabel: "★ 真极致静谧 · 距布龙路195m",
        roadDistMeters: "深居三期中央园林，距布龙路主干道约195米",
        specialNoise: "无铁路/高架，南北双阳台穿堂风极静（约41~44dB）",
        minPrice: 515,
        maxPrice: 555,
        priceRange: "515~555 万",
        twoKidsNote: "万科麓城三期罕见一步到位四房两卫！老大老二各一间儿童房+独立书房/老人房，对口麓城外国语小学+南师大龙岗初中(公办率80.8%)，去贝尔路23分钟。",
        scores: { quiet: 96, edu: 95, commute: 90, space: 94, comm: 95, asset: 89 },
        unitResettleCheck: "🏆 三期全盘0村民回迁房、0保障房",
        unitVillageCheck: "🏆 北靠银湖山与体育公园，完全隔绝城中村",
        unitCommNoiseCheck: "🏆 纯架空层泛会所0底商油烟"
      },
      {
        id: "horoy-6-118-4b",
        project: "鸿荣源尚峰",
        phase: "一期围合",
        building: "5栋 / 6栋A座 (泳池山景楼王)",
        unitCode: "01/02户 (118㎡高拓展四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "南北通透·板式",
        area: 118,
        usableRateNum: 86,
        usableArea: 101.5,
        orientation: "正南",
        noiseLevel: "QUIET",
        acousticGrade: "ABSOLUTE_QUIET",
        arterialDistMeters: 225,
        bldgFloors: 32,
        bldgElevator: "2梯4户",
        noiseLabel: "★ 真极致静谧 · 背山面水距干道225m",
        roadDistMeters: "距北侧布龙路长达225米，南靠三联山体公园",
        specialNoise: "无任何干道/高架/铁路干扰，实测≤41dB全片区最静楼王",
        minPrice: 510,
        maxPrice: 550,
        priceRange: "510~550 万",
        twoKidsNote: "套内实得超101㎡的正南向板式四房两卫楼王！500万出头即可拥有鸿荣源豪宅园林+自带益田MALL+南师大附校学区+24分钟达贝尔路站。",
        scores: { quiet: 98, edu: 92, commute: 88, space: 96, comm: 97, asset: 92 },
        unitResettleCheck: "🏆 全盘0村民回迁房、0保障房",
        unitVillageCheck: "🏆 南靠山体公园、高台地物理隔绝民房",
        unitCommNoiseCheck: "🏆 纯住宅高台架空层0底商油烟"
      },
      {
        id: "tefa-3-114-4b",
        project: "特发臻华府",
        phase: "一期 (2024二批新规)",
        building: "3栋 (纯商品房中央楼王)",
        unitCode: "01户 (114㎡新规奢阔四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 114,
        usableRateNum: 98,
        usableArea: 111.7,
        orientation: "东南",
        noiseLevel: "QUIET",
        acousticGrade: "INNER_CANYON_ECHO",
        arterialDistMeters: 130,
        bldgFloors: 46,
        bldgElevator: "3梯5户",
        noiseLabel: "内园安静 · 距盛宝路130m/铁路180m",
        roadDistMeters: "位于小区正中央3栋，距盛宝路约130米、距北侧铁路约180米",
        specialNoise: "虽朝内园不临街，但高区开窗有轻微远端干道/轨道低频背景声（关窗36dB）",
        minPrice: 468,
        maxPrice: 510,
        priceRange: "468~510 万",
        twoKidsNote: "470万级买套内实得111.7㎡的2024新规精装大四房两卫（相当于传统138㎡大四房尺度）！四个房间全明宽敞，二胎家庭空间感拉满。",
        scores: { quiet: 91, edu: 82, commute: 78, space: 100, comm: 70, asset: 84 },
        unitResettleCheck: "🚨 3栋本栋为纯商品房，但小区整体含约42%回迁/保障房",
        unitVillageCheck: "⚠️ 周边处于工业区旧改过渡阶段",
        unitCommNoiseCheck: "✅ 3栋中央纯架空层无底商油烟"
      },
      {
        id: "bt-xinyi-5-113-4b",
        project: "信义嘉御山",
        phase: "五期 / 六期",
        building: "五期 11栋·12栋 (中央皇家园林王)",
        unitCode: "01/02户 (113~118㎡南北通四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "南北通透·板式",
        area: 115,
        usableRateNum: 85,
        usableArea: 97.8,
        orientation: "正南",
        noiseLevel: "QUIET",
        acousticGrade: "ABSOLUTE_QUIET",
        arterialDistMeters: 215,
        bldgFloors: 32,
        bldgElevator: "2梯4户",
        noiseLabel: "★ 真极致静谧 · 百米楼距距干道215m",
        roadDistMeters: "深居五期中心大花园，距五和大道约215米、距吉华路约190米",
        specialNoise: "无铁路/高架，百米楼距中心泳池园林极静（≤41dB）",
        minPrice: 630,
        maxPrice: 695,
        priceRange: "630~695 万",
        twoKidsNote: "坂田一步到位改善四房标杆！五期100%纯商品房+2梯4户+家门口科技城外国语学校九年一贯制+太太10号线2站14分钟直达贝尔路站。",
        scores: { quiet: 96, edu: 92, commute: 96, space: 96, comm: 95, asset: 95 },
        unitResettleCheck: "✅ 五期独立围合100%纯商品房（0回迁）",
        unitVillageCheck: "✅ 百米楼距皇家园林中央，零民房视野干扰",
        unitCommNoiseCheck: "✅ 中央纯住架空层0底商油烟"
      },
      {
        id: "bgl-longmen-2-112-4b",
        project: "信义金御半山·珑门",
        phase: "四期/珑门 (2025.11全新现房)",
        building: "2栋 (中央园景栋)",
        unitCode: "01户 (112㎡新规精装四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 112,
        usableRateNum: 88,
        usableArea: 98.6,
        orientation: "东南",
        noiseLevel: "QUIET",
        acousticGrade: "INNER_CANYON_ECHO",
        arterialDistMeters: 125,
        bldgFloors: 44,
        bldgElevator: "3梯5户",
        noiseLabel: "内园安静 · 距罗岗路125m",
        roadDistMeters: "朝向半山园林内侧，距外围罗岗路约125米",
        specialNoise: "全新精装双层中空LOW-E隔音窗，室内安静",
        minPrice: 545,
        maxPrice: 585,
        priceRange: "545~585 万",
        twoKidsNote: "550万级买百鸽笼万象汇旁全新精装现房四房两卫！即买即住，下楼300米达32万㎡万象汇与百鸽笼地铁站(26分钟达贝尔路)，对口贤义外国语+百外生态。",
        scores: { quiet: 92, edu: 93, commute: 87, space: 96, comm: 94, asset: 93 },
        unitResettleCheck: "✅ 0公租房，2栋以纯商品房改善买家为主",
        unitVillageCheck: "🏆 万象汇与半山公园现代界面，无城中村",
        unitCommNoiseCheck: "✅ 内园无重餐饮底商油烟"
      },
      {
        id: "szt-yyj-115-4b",
        project: "深铁阅云境广场",
        phase: "一期 (2023首批新规)",
        building: "1栋3单元 (32层2梯5户最佳楼栋)",
        unitCode: "01户 (115㎡精装大横厅四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 115,
        usableRateNum: 90,
        usableArea: 103.5,
        orientation: "东南",
        noiseLevel: "QUIET",
        acousticGrade: "INNER_CANYON_ECHO",
        arterialDistMeters: 135,
        bldgFloors: 32,
        bldgElevator: "2梯5户",
        noiseLabel: "空中花园内侧 · 32层非超高层",
        roadDistMeters: "1栋3单元仅32层(全盘唯一非超高层单元)，朝空中花园内院，距龙岗大道约135米",
        specialNoise: "深铁高标隔音窗，避开大道直射噪音",
        minPrice: 445,
        maxPrice: 495,
        priceRange: "445~495 万",
        twoKidsNote: "强烈关注！1栋3单元是深铁阅云境唯一仅32层、2梯5户的舒适楼座，450万级买大运四轨枢纽上盖(步行150m入站)精装115㎡真四房两卫，步行600m逛山姆实体店！",
        scores: { quiet: 91, edu: 90, commute: 68, space: 97, comm: 94, asset: 93 },
        unitResettleCheck: "✅ 招拍挂TOD净地：全盘0村民回迁房",
        unitVillageCheck: "🏆 大运枢纽核心，零城中村",
        unitCommNoiseCheck: "🏆 空中花园物理隔离底部商业MALL"
      },
      {
        id: "galaxy-5-122-3p1",
        project: "星河时代花园",
        phase: "一期高层区",
        building: "5栋 / 6栋 (南向看别墅楼王)",
        unitCode: "01户 (122㎡高偷面积3+1室两卫)",
        layoutType: "3+1室2厅2卫",
        structureType: "南北通透·板式",
        area: 122,
        usableRateNum: 88,
        usableArea: 107.4,
        orientation: "正南",
        noiseLevel: "QUIET",
        acousticGrade: "ABSOLUTE_QUIET",
        arterialDistMeters: 235,
        bldgFloors: 31,
        bldgElevator: "2梯4户",
        noiseLabel: "★ 真极致静谧 · 俯瞰别墅距干道235m",
        roadDistMeters: "南向跨越联排别墅区，距龙岗大道及黄阁南路超235米",
        specialNoise: "无任何遮挡与干道噪音，实测≤40dB",
        minPrice: 565,
        maxPrice: 620,
        priceRange: "565~620 万",
        twoKidsNote: "星河时代传世楼王！2梯4户南北双阳台，实得超107㎡的3+1房两卫，下楼200米即山姆会员店实体店，对口深中龙岗顶级名校(公办率81.5%)！",
        scores: { quiet: 97, edu: 98, commute: 60, space: 96, comm: 99, asset: 98 },
        unitResettleCheck: "🏆 全盘0回迁房、0保障房（纯商品房+别墅）",
        unitVillageCheck: "🏆 山姆商圈核心，方圆600米零城中村",
        unitCommNoiseCheck: "🏆 纯住宅0底商油烟"
      },
      {
        id: "jt-suibao-2-115-4b",
        project: "岁宝壹品",
        phase: "一期 (次新综合体)",
        building: "A座 / B座 (空中花园内侧)",
        unitCode: "01/02户 (115㎡精装四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "大横厅·LDKB一体",
        area: 115,
        usableRateNum: 85,
        usableArea: 97.8,
        orientation: "东南",
        noiseLevel: "QUIET",
        acousticGrade: "INNER_CANYON_ECHO",
        arterialDistMeters: 140,
        bldgFloors: 45,
        bldgElevator: "3梯4户",
        noiseLabel: "空中花园内园 · 距主干道140m",
        roadDistMeters: "位于空中花园内侧，距北环/红岭路约140米",
        specialNoise: "配高规格双层中空隔音幕墙，室内静谧",
        minPrice: 820,
        maxPrice: 910,
        priceRange: "820~910 万",
        twoKidsNote: "福田次新综合体四房两卫！下楼即5万㎡岁宝盒马鲜生MALL，步行150米入9号线地铁站，太太20分钟直达坂田贝尔路站。",
        scores: { quiet: 90, edu: 92, commute: 94, space: 95, comm: 93, asset: 93 },
        unitResettleCheck: "✅ 商业与住宅分区独立，无村民握手楼回迁",
        unitVillageCheck: "🏆 福田中心界面，零城中村",
        unitCommNoiseCheck: "✅ 空中花园隔离底部盒马MALL"
      },
      {
        id: "jt-vanke-3-116-4b",
        project: "万科金色家园",
        phase: "三期",
        building: "三期 2栋 / 6栋 (中央花园板楼)",
        unitCode: "01/02户 (116㎡一梯两户板式四房两卫)",
        layoutType: "4室2厅2卫",
        structureType: "南北通透·板式",
        area: 116,
        usableRateNum: 87,
        usableArea: 100.9,
        orientation: "正南",
        noiseLevel: "QUIET",
        acousticGrade: "ABSOLUTE_QUIET",
        arterialDistMeters: 215,
        bldgFloors: 18,
        bldgElevator: "1梯2户 (稀缺小高层板楼)",
        noiseLabel: "★ 真极致静谧 · 18层1梯2户距干道215m",
        roadDistMeters: "位于景田内街花园中央，距新洲路主干道超215米",
        specialNoise: "无任何干道/高架噪音，18层1梯2户南北对流（≤40dB）",
        minPrice: 890,
        maxPrice: 960,
        priceRange: "890~960 万",
        twoKidsNote: "福田景田极其稀缺的18层1梯2户纯板式南北通透四房两卫！容积率仅3.1，下楼200米入景田站(23分钟反向通勤贝尔路)，对口福田外国语本部。",
        scores: { quiet: 98, edu: 95, commute: 90, space: 95, comm: 97, asset: 96 },
        unitResettleCheck: "🏆 100%纯商品房净地（0回迁0保障）",
        unitVillageCheck: "🏆 景田政商核心，零城中村",
        unitCommNoiseCheck: "✅ 花园中央板楼0底商油烟"
      }
    ];

    FOUR_BEDROOM_UNITS.forEach(nu => {
      if (!UNITS_DATA.some(u => u.id === nu.id)) {
        UNITS_DATA.push(nu);
      }
    });

    // 3. 重新构建所有多选下拉菜单 UI（使重排后的建筑新规代际、新增的四房规格、扩容的价格段立即生效）
    [
      "macroZoneFilter", "macroNewOldFilter", "macroRegFilter", "macroPurityFilter",
      "macroVillageFilter", "macroCommFilter", "macroMetroDistFilter", "macroDensityFilter",
      "macroParkingFilter", "macroTierFilter", "macroSchoolRateFilter", "macroResilienceFilter",
      "macroFloorFilter", "macroElevatorFilter",
      "filterProject", "filterBuilding", "filterLayout", "filterStructure",
      "filterOrientation", "filterNoise", "filterUsableRate", "filterCommute",
      "filterPriceBracket", "filterBldgSpec"
    ].forEach(id => {
      if (typeof buildMultiSelectUI === "function") {
        buildMultiSelectUI(id);
      }
    });

    // 4. 销毁并重绘 3 张 Chart.js 图表，使福田外国语学校及景田各楼盘完整呈现在图表中
    if (typeof Chart !== "undefined") {
      ["schoolMetricsChart", "schoolTrendChart", "resilienceChart"].forEach(cid => {
        const inst = Chart.getChart(byId(cid));
        if (inst) inst.destroy();
      });

      // 重绘包含 10 大教育学区与 25 盘的完整图表
      initCharts();
      const trendInst = Chart.getChart(byId("schoolTrendChart"));
      if (trendInst && SCHOOL_DISTRICTS.FUTIAN_WAI_JT) {
        trendInst.data.datasets.splice(2, 0, {
          label: "福田外国语本部(景田)",
          data: SCHOOL_DISTRICTS.FUTIAN_WAI_JT.trend3Y,
          borderColor: "#94734E",
          backgroundColor: "#94734E",
          tension: 0.25
        });
        trendInst.update();
      }
    }

    // 5. 更新总数文案并触发全站重绘
    document.title = "深圳二胎家庭置业全维度工程与投研决策平台 · Cavno";
    renderSchoolTable();
    renderMacroTable();
    redrawUnitViews();
  });
})();


(function v11BrowserPatch() {
  onReady(function() {
    // 1. 定义 10 大教育学区的【网评综合梯队、小学梯队、初中梯队、全市排位分位】字典
    const SCHOOL_TIER_DICT = {
      "SHENZHONG_LG": {
        overallTierCode: "T1_TOP",
        overallTierBadge: "🏆 T1 第一梯队·王牌名校",
        tierColorClass: "badge-purple",
        cityRankNote: "龙岗公办头把交椅 · 全市公办前 8%",
        primaryTierCode: "T1",
        primaryTierLabel: "小学 T1 顶尖 (深中龙岗小学/龙外星河)",
        primaryDesc: "深中与龙外两大名校集团加持，别墅与改善大盘纯粹生源，英语与科创素养极强",
        middleTierCode: "T1",
        middleTierLabel: "初中 T1 王牌 (深圳中学龙岗学校)",
        middleDesc: "四大率7.5% / 十大率18.5% / 公办率81.5%，共享深中本部教研与竞赛体系"
      },
      "FUTIAN_WAI_JT": {
        overallTierCode: "T1_TOP",
        overallTierBadge: "🏆 T1 第一梯队·福田王牌",
        tierColorClass: "badge-purple",
        cityRankNote: "福田四大名校集团本部 · 全市公办前 8%",
        primaryTierCode: "T1",
        primaryTierLabel: "小学 T1 顶尖 (福外小学部/景秀小学)",
        primaryDesc: "福田中心区市直机关、金融律所高管子女聚集，外语特色鲜明，家长圈层全城顶尖",
        middleTierCode: "T1",
        middleTierLabel: "初中 T1 王牌 (福田外国语本部/景秀中学)",
        middleDesc: "四大率6.8% / 十大率16.5% / 公办率76.8%，福田传统老牌名校，外语保送与培优极强"
      },
      "SHIYAN_BT": {
        overallTierCode: "T1_TOP",
        overallTierBadge: "🏆 T1 第一梯队·四大直管",
        tierColorClass: "badge-purple",
        cityRankNote: "坂田公办第一名校 · 全市公办前 10%",
        primaryTierCode: "T1",
        primaryTierLabel: "小学 T1 顶尖 (深实验坂田小学部·直升)",
        primaryDesc: "四大名校深圳实验学校本部直管，一类高积分门槛过滤租户，华为研发家长鸡娃风气极浓",
        middleTierCode: "T1",
        middleTierLabel: "初中 T1 王牌 (深实验坂田初中部)",
        middleDesc: "四大率6.2% / 十大率16.0% / 公办率77.5%，九年一贯校内直升免二次排位焦虑"
      },
      "NNU_LG": {
        overallTierCode: "T1_TOP",
        overallTierBadge: "🏆 T1 第一梯队·片区龙头",
        tierColorClass: "badge-purple",
        cityRankNote: "布吉水径断层第一 · 全市公办前 10%",
        primaryTierCode: "T1_OR_T2",
        primaryTierLabel: "麓城外国语(T1顶尖) / 水径小学(T2稳健)",
        primaryDesc: "万科麓城外国语小学为片区公认T1口碑王牌(100%纯商品房生源)；水径小学为T2稳健公办",
        middleTierCode: "T1",
        middleTierLabel: "初中 T1 王牌 (南师大附属龙岗学校)",
        middleDesc: "公办率高达80.8% / 十大率15.2% / 四大率5.8%，小班化精细管理，加工能力极强"
      },
      "HUAZHU_DY": {
        overallTierCode: "T1_5_STRONG",
        overallTierBadge: "🌟 T1.5 准一梯队·核心强校",
        tierColorClass: "badge-indigo",
        cityRankNote: "大运核心强校 · 全市公办前 12%",
        primaryTierCode: "T1_5",
        primaryTierLabel: "小学 T1.5 强校 (华附大运小学部·直升)",
        primaryDesc: "100%大运改善商品房与高校教职工生源，零城中村租户分流，硬件与师资一流",
        middleTierCode: "T1_5",
        middleTierLabel: "初中 T1.5 强校 (华附大运初中部)",
        middleDesc: "公办率77.5% / 十大率14.8% / 四大率5.5%，九年一贯直升，稳居大运第一梯队"
      },
      "CUHK_ZHIXIN": {
        overallTierCode: "T1_5_STRONG",
        overallTierBadge: "🌟 T1.5 准一梯队·高校附校",
        tierColorClass: "badge-indigo",
        cityRankNote: "港中深直属集团 · 全市公办前 15%",
        primaryTierCode: "T1_5",
        primaryTierLabel: "小学 T1.5 强校 (港中大知新/道远小学部)",
        primaryDesc: "依托香港中文大学(深圳)教育集团打造，国际大学园学术氛围浓厚，生源纯净",
        middleTierCode: "T1_5",
        middleTierLabel: "初中 T1.5 强校 (港中大知新/道远初中部)",
        middleDesc: "公办率75.0% / 十大率14.2% / 四大率5.0%，近年中考稳居龙岗前十，直升省心"
      },
      "KEWAI_BT": {
        overallTierCode: "T1_5_STRONG",
        overallTierBadge: "🌟 T1.5 准一梯队·口碑强校",
        tierColorClass: "badge-indigo",
        cityRankNote: "坂田本土口碑王 · 全市公办前 16%",
        primaryTierCode: "T1_5",
        primaryTierLabel: "小学 T1.5 强校 (科技城外国语小学部)",
        primaryDesc: "信义嘉御山百万方纯商品房大盘业主子女占90%以上，同学圈层高度一致，家校共育极佳",
        middleTierCode: "T1_5",
        middleTierLabel: "初中 T1.5 强校 (科技城外国语初中部)",
        middleDesc: "公办率74.5% / 十大率13.8% / 四大率4.9%，九年一贯目送式直升，成绩极其稳定"
      },
      "XIANYI_BGL": {
        overallTierCode: "T1_5_STRONG",
        overallTierBadge: "🌟 T1.5 公办强校 + 🔥T0 百外圈",
        tierColorClass: "badge-teal",
        cityRankNote: "公办全市前18% + 深圳民办T0传奇名校圈",
        primaryTierCode: "T1_5_PLUS_T0",
        primaryTierLabel: "公办 T1.5 (贤义) + 民办 T0 (春蕾/百外世纪)",
        primaryDesc: "公办贤义外国语小学部生源优质；片区内更有深圳鸡娃传奇【春蕾小学/百外世纪小学】",
        middleTierCode: "T1_5_PLUS_T0",
        middleTierLabel: "公办 T1.5 (贤义73.5%) + 民办 T0 (百合外国语)",
        middleDesc: "进可考家门口T0神校【百合外国语(四大率35%+)】，退有公办贤义外国语(公办率73.5%)稳保底"
      },
      "SHENDA_BT": {
        overallTierCode: "T2_SOLID",
        overallTierBadge: "🛡️ T2 第二梯队·稳健中上",
        tierColorClass: "badge-blue",
        cityRankNote: "华为码农生源加持 · 超全市均值 13%",
        primaryTierCode: "T2",
        primaryTierLabel: "小学 T2 优质 (深大附坂田小学部·直升)",
        primaryDesc: "2026录取线91.05分，高积分门槛将岗头村租户拦截在外，实际入读全为华为/科技业主子女",
        middleTierCode: "T2",
        middleTierLabel: "初中 T2 稳健中上 (深大附坂田初中部)",
        middleDesc: "公办率66.5% / 十大率10.8% / 四大率3.6%，高于深圳全市公办普高率基准13个百分点"
      },
      "SHIYALING_NW": {
        overallTierCode: "T2_SOLID",
        overallTierBadge: "🛡️ T2 第二梯队·潜力中上",
        tierColorClass: "badge-blue",
        cityRankNote: "稳健达标中上 + 深大附中54班新校预期",
        primaryTierCode: "T2",
        primaryTierLabel: "小学 T2 稳健 (石芽岭小学部 + 深大附新校)",
        primaryDesc: "石芽岭公园周边商品房生源为主，积分门槛宽松(一类购房即稳录)，旁侧新增54班名校集团新校",
        middleTierCode: "T2",
        middleTierLabel: "初中 T2 稳健中上 (石芽岭初中部)",
        middleDesc: "公办率61.5% / 十大率8.5%，高出全市基准线8个百分点，符合“升学率中上”硬指标"
      }
    };

    Object.entries(SCHOOL_TIER_DICT).forEach(function(pair) {
      const k = pair[0];
      const v = pair[1];
      if (SCHOOL_DISTRICTS[k]) Object.assign(SCHOOL_DISTRICTS[k], v);
    });

    // 2. 为每个小区绑定精确的【本盘对口小学梯队 & 初中梯队】专属标签
    Object.entries(COMMUNITIES_MACRO).forEach(function(pair) {
      const name = pair[0];
      const m = pair[1];
      const sch = SCHOOL_DISTRICTS[m.schoolKey] || {};
      m.schoolTierCode = sch.overallTierCode || "T2_SOLID";
      m.schoolOverallBadge = sch.overallTierBadge || "T2 稳健中上";
      m.primaryTierBadge = sch.primaryTierLabel || "T2 小学";
      m.middleTierBadge = sch.middleTierLabel || "T2 初中";
      m.isDualT1 = (sch.overallTierCode === "T1_TOP");

      if (name === "万科麓城三期") {
        m.primaryTierBadge = "🏆 小学 T1 顶尖 (万科麓城外国语小学·家门口)";
        m.middleTierBadge = "🏆 初中 T1 王牌 (南师大附属龙岗学校·80.8%)";
        m.schoolTierSummary = "双T1王牌满配 (T1麓城外国语小学 + T1南师大龙岗初中)";
        m.isDualT1 = true;
      } else if (name === "鸿荣源尚峰") {
        m.primaryTierBadge = "🛡️ 小学 T2 稳健 (水径小学/水径九年一贯新校·共享麓城)";
        m.middleTierBadge = "🏆 初中 T1 王牌 (南师大附属龙岗学校·80.8%)";
        m.schoolTierSummary = "T2小学 + T1王牌初中 (初中享南师大80.8%高升学率红利)";
        m.isDualT1 = false;
      } else if (m.schoolKey === "XIANYI_BGL") {
        m.primaryTierBadge = "🌟 公办 T1.5 (贤义) + 🔥民办 T0 (春蕾/百外世纪)";
        m.middleTierBadge = "🌟 公办 T1.5 (贤义73.5%) + 🔥民办 T0 (百合外国语)";
        m.schoolTierSummary = "T1.5公办九年一贯保底 + T0深圳第一民办百外冲刺圈";
      } else {
        m.schoolTierSummary = (sch.overallTierBadge || "") + " (" + (sch.cityRankNote || "") + ")";
      }
    });

    // 3. 在【专章模块1：#section-edu】顶部插入可视化的「小学 & 初中网评等级梯队金字塔全景图」
    const eduSection = byId("section-edu");
    const schoolTableBody = byId("schoolTableBody");
    const schoolTableWrap = schoolTableBody ? schoolTableBody.closest(".overflow-x-auto") : null;
    if (eduSection && schoolTableWrap && !byId("schoolTierPyramid")) {
      const pyramidDiv = document.createElement("div");
      pyramidDiv.id = "schoolTierPyramid";
      pyramidDiv.className = "mb-5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs";
      pyramidDiv.innerHTML = [
        '<div class="rounded-xl p-3.5 bg-purple-50/70 border border-purple-200 space-y-1.5">',
        '  <div class="flex items-center justify-between">',
        '    <span class="font-bold text-purple-950 text-sm">🏆 T1 第一梯队 (王牌顶尖)</span>',
        '    <span class="px-2 py-0.5 bg-purple-700 text-white rounded font-bold text-[10px]">全市前 8%~10%</span>',
        '  </div>',
        '  <p class="text-slate-600 text-[11px]">标准：公办普高率 <strong>76.8%~81.5%</strong>，十大率 <strong>15.2%~18.5%</strong>，四大率 <strong>5.8%~7.5%</strong>。</p>',
        '  <div class="bg-white p-2 rounded border border-purple-100 space-y-1 text-[11px]">',
        '    <div><strong>• 大运：</strong>深中龙岗学校+深中小学 <em>(星河时代)</em></div>',
        '    <div><strong>• 景田：</strong>福田外国语本部+景秀 <em>(金色家园/天健/天然居/岁宝/翔名苑)</em></div>',
        '    <div><strong>• 坂田：</strong>深实验坂田校区九年一贯 <em>(诺德中央道)</em></div>',
        '    <div><strong>• 水径：</strong>麓城外国语小学[T1]+南师大龙岗[T1] <em>(万科麓城三期/尚峰共享初中)</em></div>',
        '  </div>',
        '</div>',
        '<div class="rounded-xl p-3.5 bg-indigo-50/70 border border-indigo-200 space-y-1.5">',
        '  <div class="flex items-center justify-between">',
        '    <span class="font-bold text-indigo-950 text-sm">🌟 T1.5 准一梯队 (片区强校)</span>',
        '    <span class="px-2 py-0.5 bg-indigo-700 text-white rounded font-bold text-[10px]">全市前 12%~16%</span>',
        '  </div>',
        '  <p class="text-slate-600 text-[11px]">标准：公办普高率 <strong>74.5%~77.5%</strong>，十大率 <strong>13.8%~14.8%</strong>，均为<strong>九年一贯制直升</strong>且生源高度纯粹。</p>',
        '  <div class="bg-white p-2 rounded border border-indigo-100 space-y-1 text-[11px]">',
        '    <div><strong>• 大运枢纽：</strong>华附大运学校九年一贯 <em>(颐安都会/深铁阅云境)</em></div>',
        '    <div><strong>• 大运中心：</strong>港中大附属知新/道远学校 <em>(京基/佳兆业未来/康城/泰瑞府)</em></div>',
        '    <div><strong>• 坂田北：</strong>科技城外国语学校九年一贯 <em>(信义嘉御山)</em></div>',
        '  </div>',
        '</div>',
        '<div class="rounded-xl p-3.5 bg-teal-50/70 border border-teal-200 space-y-1.5">',
        '  <div class="flex items-center justify-between">',
        '    <span class="font-bold text-teal-950 text-sm">🔥 T1.5 公办 + T0 百外特殊圈</span>',
        '    <span class="px-2 py-0.5 bg-teal-700 text-white rounded font-bold text-[10px]">公办保底+民办天花板</span>',
        '  </div>',
        '  <p class="text-slate-600 text-[11px]">标准：既有公办九年一贯强校保底，又处于深圳第一民办传奇名校<strong>【百合外国语】</strong>500米生活圈。</p>',
        '  <div class="bg-white p-2 rounded border border-teal-100 space-y-1 text-[11px]">',
        '    <div><strong>• 公办保底(T1.5)：</strong>贤义外国语九年一贯制 <em>(公办普高率73.5% · 十大率13.5%)</em></div>',
        '    <div><strong>• 民办冲刺(T0)：</strong>下楼即春蕾小学/百外世纪小学 + 百合外国语初中<em>(四大率超35%!)</em></div>',
        '    <div><strong>• 覆盖：</strong><em>信义金御半山、信义珑门、百合世纪、万科红</em></div>',
        '  </div>',
        '</div>',
        '<div class="rounded-xl p-3.5 bg-sky-50/70 border border-sky-200 space-y-1.5">',
        '  <div class="flex items-center justify-between">',
        '    <span class="font-bold text-sky-950 text-sm">🛡️ T2 第二梯队 (稳健中上)</span>',
        '    <span class="px-2 py-0.5 bg-sky-700 text-white rounded font-bold text-[10px]">超全市基准 8%~13%</span>',
        '  </div>',
        '  <p class="text-slate-600 text-[11px]">标准：公办普高率 <strong>61.5%~66.5%</strong>（深圳全市基准约53.5%），九年一贯直升，积分友好且具新校增量。</p>',
        '  <div class="bg-white p-2 rounded border border-sky-100 space-y-1 text-[11px]">',
        '    <div><strong>• 坂田华为圈：</strong>深大附属坂田学校九年一贯 <em>(公办率66.5% · 佳兆业中央/大族云峰)</em></div>',
        '    <div><strong>• 石芽岭公园圈：</strong>石芽岭学校九年一贯(61.5%) + 旁侧规划54班深大附中南湾新校 <em>(健康花城/特发臻华府)</em></div>',
        '  </div>',
        '</div>'
      ].join("");
      schoolTableWrap.parentElement.insertBefore(pyramidDiv, schoolTableWrap);
    }

    // 4. 重写 renderSchoolTable()：在学区对比表中加入【网评综合梯队 · 小学梯队 vs 初中梯队】详细列
    renderSchoolTable = function() {
      const theadTr = root.querySelector("#section-edu table thead tr");
      if (theadTr) {
        theadTr.innerHTML = [
          '<th class="py-2.5 px-2.5 font-bold">🏅 网评综合梯队 & 全市排位</th>',
          '<th class="py-2.5 px-2.5 font-bold">对口学校 / 教育集团</th>',
          '<th class="py-2.5 px-2.5 font-semibold">🏫 小学梯队评级 vs 初中梯队评级</th>',
          '<th class="py-2.5 px-2.5 font-semibold">覆盖本库楼盘 (25盘映射)</th>',
          '<th class="py-2.5 px-2.5 font-semibold">🏆 中考公办普高率</th>',
          '<th class="py-2.5 px-2.5 font-semibold">🌟 四大率 / 十大率</th>',
          '<th class="py-2.5 px-2.5 font-semibold">📊 近3年录取积分线</th>',
          '<th class="py-2.5 px-2.5 font-semibold">👥 生源纯粹度 & 锁定政策</th>'
        ].join("");
      }

      const tbody = byId("schoolTableBody");
      const list = Object.values(SCHOOL_DISTRICTS).sort(function(a, b) {
        return b.publicHighRate - a.publicHighRate;
      });

      tbody.innerHTML = list.map(function(s) {
        const badgeCls = s.tierColorClass || "badge-indigo";
        const sysCls = (s.systemType || "").includes("九年一贯") ? "badge-teal" : "badge-indigo";
        const rateCls = s.publicHighRate >= 75 ? "badge-green" : "badge-blue";
        return [
          '<tr class="hover:bg-indigo-50/40 transition">',
          '  <td class="py-2.5 px-2.5 align-top whitespace-nowrap">',
          '    <span class="px-2 py-0.5 rounded text-[11px] font-bold ' + badgeCls + '">' + (s.overallTierBadge || "T1.5 强校") + '</span>',
          '    <div class="text-[10px] text-slate-500 font-medium mt-1">' + (s.cityRankNote || "") + '</div>',
          '  </td>',
          '  <td class="py-2.5 px-2.5 align-top">',
          '    <div class="font-bold text-indigo-950">' + s.name + '</div>',
          '    <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ' + sysCls + '">' + s.systemType + '</span>',
          '  </td>',
          '  <td class="py-2.5 px-2.5 align-top max-w-[250px]">',
          '    <div class="font-bold text-emerald-800 text-[11px]">👦 ' + (s.primaryTierLabel || "") + '</div>',
          '    <div class="text-[10px] text-slate-500 mb-1">' + (s.primaryDesc || "") + '</div>',
          '    <div class="font-bold text-indigo-900 text-[11px]">🎓 ' + (s.middleTierLabel || "") + '</div>',
          '    <div class="text-[10px] text-slate-500">' + (s.middleDesc || "") + '</div>',
          '  </td>',
          '  <td class="py-2.5 px-2.5 align-top font-medium text-slate-800 max-w-[170px]">' + s.covers + '</td>',
          '  <td class="py-2.5 px-2.5 align-top whitespace-nowrap">',
          '    <span class="px-2 py-0.5 rounded font-bold ' + rateCls + '">约 ' + s.publicHighRate + '%</span>',
          '    <div class="text-[10px] text-slate-500 mt-1">三年：' + s.rateRange + '</div>',
          '  </td>',
          '  <td class="py-2.5 px-2.5 align-top whitespace-nowrap">',
          '    <div class="font-bold text-purple-800">四大率：~' + s.top4Rate + '%</div>',
          '    <div class="text-slate-600 font-semibold">十大率：~' + s.top10Rate + '%</div>',
          '  </td>',
          '  <td class="py-2.5 px-2.5 align-top max-w-[195px] text-slate-700">' + s.cutoffScore + '</td>',
          '  <td class="py-2.5 px-2.5 align-top max-w-[195px]">',
          '    <div class="font-semibold text-emerald-800">' + s.peerGrade + '</div>',
          '    <div class="text-[10px] text-slate-500 mt-0.5">' + s.highlight + '</div>',
          '  </td>',
          '</tr>'
        ].join("");
      }).join("");
    };

    // 5. 在【视角二：宏观全局过滤控制台】新增【15. 🏅 小初学区网评梯队】多选筛选器
    const macroZoneEl = byId("macroZoneFilter");
    const macroGrid = macroZoneEl ? macroZoneEl.parentElement.parentElement : null;
    if (macroGrid && !byId("macroSchoolTierFilter")) {
      const tierDiv = document.createElement("div");
      tierDiv.innerHTML = [
        '<label class="block text-purple-700 font-bold mb-1">15. 🏅 小初学区网评梯队</label>',
        '<select id="macroSchoolTierFilter" class="w-full rounded-lg border border-purple-300 px-2 py-1.5 bg-purple-50/40 font-medium">',
        '  <option value="ALL">全部网评学区梯队 (T1~T2)</option>',
        '  <option value="DUAL_T1">★ 双T1满配 (小学T1顶尖 + 初中T1王牌)</option>',
        '  <option value="T1_TOP">🏆 T1 第一梯队名校 (深中/福外/深实验/南师大)</option>',
        '  <option value="T1_5_STRONG">🌟 T1.5 准一梯队强校 (华附/港中大/科外/贤义)</option>',
        '  <option value="T0_BAIHE">🔥 含T0百合外国语/春蕾特殊冲刺圈 (百鸽笼)</option>',
        '  <option value="T2_SOLID">🛡️ T2 第二梯队稳健中上 (深大附坂田/石芽岭)</option>',
        '</select>'
      ].join("");
      macroGrid.appendChild(tierDiv);
      if (typeof buildMultiSelectUI === "function") {
        buildMultiSelectUI("macroSchoolTierFilter");
      }
    }

    // 6. 拦截 isCommunityPassingMacro 加入学区梯队多选过滤判定
    const origPassMacro = isCommunityPassingMacro;
    isCommunityPassingMacro = function(projectName) {
      if (!origPassMacro(projectName)) return false;
      const m = COMMUNITIES_MACRO[projectName];
      const tiers = typeof getMultiValues === "function"
        ? getMultiValues("macroSchoolTierFilter")
        : ["ALL"];
      if (!tiers.includes("ALL")) {
        const passTier = tiers.some(function(t) {
          if (t === "DUAL_T1") return m.isDualT1 === true;
          if (t === "T1_TOP") return m.schoolTierCode === "T1_TOP";
          if (t === "T1_5_STRONG") return m.schoolTierCode === "T1_5_STRONG";
          if (t === "T0_BAIHE") return m.schoolKey === "XIANYI_BGL";
          if (t === "T2_SOLID") return m.schoolTierCode === "T2_SOLID";
          return true;
        });
        if (!passTier) return false;
      }
      return true;
    };

    // 7. 增强宏观表格第10列：清晰展示【网评综合梯队 + 小学梯队 + 初中梯队】
    const origRenderMacro = renderMacroTable;
    renderMacroTable = function() {
      origRenderMacro();
      const rows = root.querySelectorAll("#macroTableBody tr");
      const passingEntries = Object.entries(COMMUNITIES_MACRO).filter(function(pair) {
        return isCommunityPassingMacro(pair[0]);
      });
      const badgeEl = byId("macroMatchBadge");
      if (badgeEl) {
        badgeEl.textContent = "入围 " + passingEntries.length + " / " + Object.keys(COMMUNITIES_MACRO).length + " 个小区";
      }

      rows.forEach(function(tr, idx) {
        const entry = passingEntries[idx];
        if (!entry) return;
        const m = entry[1];
        const sch = SCHOOL_DISTRICTS[m.schoolKey] || {};
        const schoolTd = tr.children[9];
        if (schoolTd) {
          const badgeCls = sch.tierColorClass || "badge-indigo";
          schoolTd.innerHTML = [
            '<div class="mb-1">',
            '  <span class="px-2 py-0.5 rounded text-[10px] font-bold ' + badgeCls + '">' + m.schoolOverallBadge + '</span>',
            '</div>',
            '<div class="text-[11px] font-semibold text-emerald-800">' + m.primaryTierBadge + '</div>',
            '<div class="text-[11px] font-bold text-indigo-950 mt-0.5">' + m.middleTierBadge + '</div>',
            '<div class="mt-1">',
            '  <span class="px-1.5 py-0.5 rounded font-bold badge-green text-[10px]">公办率 ' + sch.publicHighRate + '%</span> ',
            '  <span class="px-1.5 py-0.5 rounded font-semibold badge-purple text-[10px]">十大率 ' + sch.top10Rate + '%</span>',
            '</div>'
          ].join("");
        }
      });
    };

    // 8. 增强微观户号卡片：在卡片内直接显示【小学梯队 vs 初中梯队】对比区块
    const origRenderCards = renderUnitCards;
    renderUnitCards = function() {
      origRenderCards();
      const cards = root.querySelectorAll("#unitCardsContainer > div");
      const weights = getWeights();
      const filtered = getFilteredUnits(false).map(function(u) {
        return Object.assign({}, u, { totalScore: calcWeightedScore(u, weights) });
      }).sort(function(a, b) {
        return b.totalScore - a.totalScore;
      });

      cards.forEach(function(card, idx) {
        const u = filtered[idx];
        if (!u) return;
        const m = COMMUNITIES_MACRO[u.project];
        const sch = SCHOOL_DISTRICTS[m.schoolKey] || {};
        const badgeCls = sch.tierColorClass || "badge-indigo";
        const eduTierBlock = [
          '<div class="mt-2 text-[11px] text-slate-700 space-y-0.5 bg-purple-50/50 p-2.5 rounded-lg border border-purple-200/60 v11-tier-box">',
          '  <div class="flex items-center justify-between">',
          '    <span class="font-bold text-purple-950">🎓 ③ 对口小初网评梯队分级</span>',
          '    <span class="px-1.5 py-0.2 rounded font-bold ' + badgeCls + ' text-[10px]">' + (sch.overallTierBadge || "") + '</span>',
          '  </div>',
          '  <div><strong>小学评级：</strong><span class="text-emerald-800 font-semibold">' + m.primaryTierBadge + '</span></div>',
          '  <div><strong>初中评级：</strong><span class="text-indigo-900 font-bold">' + m.middleTierBadge + '</span> (十大率~' + sch.top10Rate + '%/四大率~' + sch.top4Rate + '%)</div>',
          '</div>'
        ].join("");

        const noteBlock = card.querySelector(".bg-indigo-50\\/40");
        if (noteBlock && !card.querySelector(".v11-tier-box")) {
          noteBlock.insertAdjacentHTML("beforebegin", eduTierBlock);
        }
      });
    };

    // 9. 增强底部五层穿透 PK 台：在第四层加入【网评综合梯队、小学梯队评级、初中梯队评级】对比行
    const origRenderPK = renderCompareTable;
    renderCompareTable = function() {
      origRenderPK();
      const selectedUnits = compareIds
        .map(function(id) { return UNITS_DATA.find(function(u) { return u.id === id; }); })
        .filter(Boolean)
        .map(function(u) {
          return Object.assign({}, u, {
            macro: COMMUNITIES_MACRO[u.project],
            sch: SCHOOL_DISTRICTS[COMMUNITIES_MACRO[u.project].schoolKey]
          });
        });
      if (!selectedUnits.length) return;

      const tbody = root.querySelector("#compareTable tbody");
      if (!tbody) return;
      const allTrs = Array.from(tbody.querySelectorAll("tr"));
      const targetTr = allTrs.find(function(tr) {
        return tr.textContent.includes("对口小学 & 初中名称");
      });
      if (targetTr && !tbody.querySelector(".v11-pk-tier-row")) {
        const colsHtml = selectedUnits.map(function(u) {
          return [
            '<td class="py-2 px-3 align-top">',
            '  <div><span class="px-2 py-0.5 rounded font-bold text-[11px] ' + (u.sch.tierColorClass || "badge-indigo") + '">' + (u.sch.overallTierBadge || "") + '</span></div>',
            '  <div class="text-emerald-800 font-semibold mt-1">' + u.macro.primaryTierBadge + '</div>',
            '  <div class="text-indigo-950 font-bold mt-0.5">' + u.macro.middleTierBadge + '</div>',
            '  <div class="text-[10px] text-slate-500 mt-0.5">' + (u.sch.cityRankNote || "") + '</div>',
            '</td>'
          ].join("");
        }).join("");

        const tierTrHtml = [
          '<tr class="bg-purple-50/40 hover:bg-purple-50/70 v11-pk-tier-row">',
          '  <td class="py-2 px-3 font-bold text-purple-950 bg-purple-100/50 w-44">🏅 小初网评等级梯队对比</td>',
          colsHtml,
          '</tr>'
        ].join("");
        targetTr.insertAdjacentHTML("beforebegin", tierTrHtml);
      }
    };

    // 10. 绑定重置按钮包含新增的 macroSchoolTierFilter
    const resetMacroBtn = byId("resetMacroBtn");
    if (resetMacroBtn) {
      resetMacroBtn.addEventListener("click", function() {
        const sel = byId("macroSchoolTierFilter");
        if (sel) sel.value = "ALL";
        if (typeof buildMultiSelectUI === "function") {
          buildMultiSelectUI("macroSchoolTierFilter");
        }
        renderMacroTable();
        redrawUnitViews();
      });
    }

    const resetFilterBtn = byId("resetFilterBtn");
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener("click", function() {
        const sel = byId("macroSchoolTierFilter");
        if (sel) sel.value = "ALL";
        if (typeof buildMultiSelectUI === "function") {
          buildMultiSelectUI("macroSchoolTierFilter");
        }
        renderMacroTable();
        redrawUnitViews();
      });
    }

    // 立即执行重绘
    renderSchoolTable();
    renderMacroTable();
    redrawUnitViews();
  });
})();

// Keep the attachment's union filter logic; synchronize native options with its checkbox state.
function finishIntegration(){
  const ids=Object.keys(multiSelectState);
  function refreshSelect(id,values){
    const sel=byId(id);if(!sel)return;
    const allowed=new Set(Array.from(sel.options,o=>o.value));
    const retained=values.filter(v=>allowed.has(v));
    const selected=retained.length?retained:[sel.options[0].value];
    Array.from(sel.options).forEach(o=>{o.selected=selected.includes(o.value);});
    buildMultiSelectUI(id);
    // Native single-selects can only store one value; retain the full union in the component.
    multiSelectState[id].selected=new Set(selected);
    byId(id).parentElement.querySelector('.ms-wrapper').refreshUI();
    decorateSelect(id);
  }
  function decorateSelect(id){
    const sel=byId(id), wrapper=sel?.parentElement.querySelector('.ms-wrapper');if(!wrapper)return;
    wrapper.dataset.selectId=id;
    const label=sel.parentElement.querySelector('label');
    if(label){label.htmlFor=id;label.id=id+'Label';}
    const btn=wrapper.querySelector('.ms-btn'),drop=wrapper.querySelector('.ms-dropdown');
    if(!btn||!drop)return;
    btn.id=id+'Button';btn.setAttribute('aria-labelledby',id+'Label '+btn.id);
    btn.setAttribute('aria-expanded',String(drop.classList.contains('open')));
    btn.setAttribute('aria-controls',id+'Options');drop.id=id+'Options';
    wrapper.querySelectorAll('[data-act="all"]').forEach(e=>{e.setAttribute('role','button');e.tabIndex=0;e.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();e.click();}});});
  }
  const originalBuild=buildMultiSelectUI;
  buildMultiSelectUI=function(id){originalBuild(id);decorateSelect(id);};
  updateBuildingOptions=function(){
    const previous=multiSelectState.filterBuilding?getMultiValues('filterBuilding'):['ALL'];
    const projects=getMultiValues('filterProject');
    const buildings=Array.from(new Set(UNITS_DATA.filter(u=>isCommunityPassingMacro(u.project)&&(projects.includes('ALL')||projects.includes(u.project))).map(u=>`${u.project} - ${u.building}`)));
    const sel=byId('filterBuilding');sel.replaceChildren();
    const add=(value,text)=>{const option=document.createElement('option');option.value=value;option.textContent=text;sel.appendChild(option);};
    add('ALL',`全部入围楼栋 (${buildings.length}组)`);buildings.forEach(b=>add(b,b));
    refreshSelect('filterBuilding',previous);
  };
  updateProjectAndBuildingOptions=function(passingNames){
    const previous=multiSelectState.filterProject?getMultiValues('filterProject'):['ALL'];
    const sel=byId('filterProject');sel.replaceChildren();
    const add=(value,text)=>{const option=document.createElement('option');option.value=value;option.textContent=text;sel.appendChild(option);};
    add('ALL',`全部入围楼盘 (${passingNames.length}盘)`);
    passingNames.forEach(p=>add(p,`${p} (${COMMUNITIES_MACRO[p].zone})`));
    refreshSelect('filterProject',previous);updateBuildingOptions();
  };
  drillDownProject=function(projectName){
    refreshSelect('filterProject',[projectName]);refreshSelect('filterBuilding',['ALL']);
    updateBuildingOptions();redrawUnitViews();byId('section-micro').scrollIntoView({behavior:'smooth',block:'start'});
  };
  const originalResetMacro=resetMacroFilters;
  resetMacroFilters=function(){originalResetMacro();byId('macroFloorFilter').value='ALL';byId('macroElevatorFilter').value='ALL';};
  const originalResetMicro=resetMicroFilters;
  resetMicroFilters=function(){originalResetMicro();byId('filterBldgSpec').value='ALL';};
  // Replace the attachment's single-value reset listeners with one complete reset.
  for(const [id,resetAll] of [['resetMacroBtn',false],['resetFilterBtn',true]]){
    const old=byId(id),button=old.cloneNode(true);old.replaceWith(button);
    button.addEventListener('click',()=>{
      resetMacroFilters();if(resetAll)resetMicroFilters();
      for(const sid of ids){if(resetAll||sid.startsWith('macro'))refreshSelect(sid,[byId(sid).options[0].value]);}
      renderMacroTable();redrawUnitViews();
    });
  }
  root.addEventListener('click',()=>{
    for(const id of ids)decorateSelect(id);
  });
  document.addEventListener('click',()=>{for(const id of ids)decorateSelect(id);});
  root.addEventListener('change',event=>{
    if(event.target.matches('.ms-item input')){
      const wrapper=event.target.closest('.ms-wrapper');
      if(wrapper?.dataset.selectId==='filterProject')updateBuildingOptions();
      for(const id of ids)decorateSelect(id);
    }
  });
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape')root.querySelectorAll('.ms-dropdown.open').forEach(e=>{e.classList.remove('open');e.parentElement.querySelector('.ms-btn').setAttribute('aria-expanded','false');});
  });
  ids.forEach(decorateSelect);
  renderMacroTable();redrawUnitViews();
}

    function init(){
      for(const callback of readyCallbacks)callback();
      finishIntegration();
      root.addEventListener('click',event=>{
        const button=event.target.closest('button[data-compare-id],button[data-drill-project],button[data-house-action]');
        if(!button||!root.contains(button))return;
        if(button.dataset.compareId)toggleCompare(button.dataset.compareId);
        else if(button.dataset.drillProject)drillDownProject(button.dataset.drillProject);
        else if(button.dataset.houseAction==='downloadSelfHtml')downloadSelfHtml();
        else if(button.dataset.houseAction==='exportUnitsCsv')exportUnitsCsv();
      });
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

})();
