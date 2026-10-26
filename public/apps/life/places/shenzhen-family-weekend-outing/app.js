/* 附件原始内容与预算规则；样式及事件限定到本页。 */
(() => {
 const root=document.getElementById('outing-app');
 if (!root) return;
 const byId=id=>root.querySelector('#'+id);

  let returnFocus = null;
  let previousOverflow = '';
  function showModal(id) {
    returnFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    const modal = byId(id);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    (modal.querySelector('button') || modal).focus();
  }
  function hideModal(id) {
    byId(id).classList.add('hidden');
    document.body.style.overflow = previousOverflow;
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
  }
  function bindActions() {
    const actions = {checkAllGear,clearCompare,closeCompareModal,closeDetailModal,openCompareModal,openDetailModal,resetAllFilters,setBudgetSandbox,setDepartureMode,setFilter,setModalWeather,setPackingMode,setSortBy,toggleCompare,toggleGearItem,toggleTag,toggleTicketSandbox};
    function handle(event) {
      const el = event.target.closest('[data-action]');
      if (!el || !root.contains(el) || el.dataset.event !== event.type) return;
      const action = actions[el.dataset.action];
      if (!action) return;
      const args = [];
      for (let i=1; el.hasAttribute('data-type'+i); i++) {
        const type=el.dataset['type'+i], value=el.dataset['arg'+i];
        args.push(type==='number' ? Number(value) : type==='boolean' ? value==='true' : type==='value' ? el.value : value);
      }
      action(...args);
    }
    root.addEventListener('click', handle);
    root.addEventListener('change', handle);
    document.addEventListener('keydown', event => {
      const modal = ['detail-modal','compare-modal'].map(byId).find(el=>!el.classList.contains('hidden'));
      if (!modal) return;
      if (event.key==='Escape') { event.preventDefault(); hideModal(modal.id); return; }
      if (event.key!=='Tab') return;
      const focusable=Array.from(modal.querySelectorAll('button,a[href],select,input,[tabindex="0"]')).filter(el=>el.getClientRects().length);
      if (!focusable.length) {event.preventDefault();modal.focus();return;}
      const first=focusable[0], last=focusable.at(-1);
      if (event.shiftKey && (document.activeElement===first || !modal.contains(document.activeElement))) {event.preventDefault();last.focus();}
      else if (!event.shiftKey && (document.activeElement===last || !modal.contains(document.activeElement))) {event.preventDefault();first.focus();}
    });
  }

    // =========================================================================
    // 1. STATE MANAGEMENT
    // =========================================================================
    const state = {
      departureMode: 'A', // 'A': Buji -> Bantian pickup -> Highway; 'B': Wife back to Buji -> Highway
      filters: {
        region: 'all',
        combo: 'all',
        maxTime: 999,
        budgetTier: 'all',
        tags: []
      },
      sortBy: 'score', // 'score', 'time', 'stroller', 'cost'
      budgetSandbox: {
        hotelRate: 850,   // per night (2 nights)
        diningRate: 500,  // per day (2.5 days calculated)
        includeTickets: true
      },
      compareList: [], // max 3 route IDs
      activeModalRouteId: null,
      modalWeatherMode: 'sunny',
      packingMode: 'full',
      checkedGear: {}
    };

    // =========================================================================
    // 2. 8 DEEPLY CRAFTED ROUTES DATABASE (Tailored for Buji/Bantian + 3.5Y & 8M)
    // =========================================================================
    const routesData = [
      {
        id: 'songshanhu',
        name: '【东莞松山湖+同沙线】松湖烟雨环湖绿道 × 科技博物慢游',
        shortName: '东莞松山湖+同沙线',
        region: 'dongguan',
        regionLabel: '东莞生态圈 · 松山湖',
        comboType: '森林湖泊+科普馆',
        distanceKm: 52,
        driveTimeModeA: 45, // Direct from Bantian via G94 Pearl River Delta Ring Expy
        driveTimeModeB: 65, // From Buji
        highwayRouteA: '布吉出发 → 坂田接太太 → 坂澜大道/珠三角环线高速(G94)直达松山湖收费站',
        highwayRouteB: '太太回布吉 → 清平高速转珠三角环线高速(G94)直达松山湖',
        tollAndEv: '单程高速费 ¥28 · 园区及万象汇配备蔚来/理想/华为超充桩，地面+地库大车位极多',
        parks: '松山湖中心公园（松湖烟雨全平路绿道）+ 同沙生态公园映翠湖大草坪',
        museums: '东莞科技馆（儿童科学启蒙互动区）+ 松山湖望野博物馆（位于文化艺术街区，人少清幽）',
        tags: ['全程无障碍推车', '五星母婴室配置', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 98,
        metrics: {
          stroller: 99,  // 推车无障碍度
          nursing: 94,   // 母婴室评级
          toddler: 96,   // 3.5岁趣味度
          infant: 98,    // 8月龄舒适度
          parking: 97,   // 停车补能便利
          scenery: 96    // 景观与出片度
        },
        costs: {
          tollAndEvCost: 110,
          ticketCost: 75, // Dongguan Science Museum + sightseeing train
          hotelCoeff: 1.0 // Multiplier on base hotel tier
        },
        parkingPinpoint: '【松山湖烟雨】导航“松山湖大学路停车场”或“松山湖万象汇地库B1母婴车位”，出电梯即达平坦环湖绿道，0台阶；【同沙生态公园】需提前在公众号预约入园车辆，直接开到“映翠湖停车场”，后备箱秒拿推车与天幕。',
        nursingPinpoint: '【松山湖万象汇】L2/L3层设高星级独立母婴室（配恒温调奶器、温水洗手池、独立哺乳沙发间及温奶器）；【东莞科技馆】一楼游客服务中心旁设独立母婴室。',
        weatherSunny: '☀️ 晴朗模式：周六上午在松湖烟雨树荫绿道推二宝、大宝骑平衡车过查理大桥；周日上午在同沙生态公园映翠湖大草坪支帐篷吹泡泡。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：直接转入【东莞科技馆】（全室内3层互动展项，3.5岁大宝可玩半天）+【松山湖万象汇室内儿童游乐区】+【松山湖望野博物馆】，全程地库连通不淋雨。',
        schedule: {
          fri: [
            { time: '15:30 - 16:35', title: '布吉出发 → 坂田接太太 → G94珠三角环线直奔松山湖', toddler: '在安全座椅听故事机、看窗外风景', infant: '上车喝奶后伴随高速白噪音进入下午小睡（约50分钟）', note: '15:50在坂田华为/天安云谷周边接上太太，完美避开五和大道17:30晚高峰。' },
            { time: '17:00 - 19:30', title: '入住松山湖滨湖酒店/凯悦或万象汇周边亲子酒店 + 湖畔粤菜晚餐', toddler: '酒店草坪看黑天鹅、吃松湖特色焖鹅/蒸水蛋', infant: '房间内铺隔尿垫练习爬行翻身，18:00吃晚间米粉辅食', note: '晚餐后沿酒店私家湖岸散步30分钟，20:30准时给两娃洗澡哄睡。' }
          ],
          sat: [
            { time: '09:00 - 11:30', title: '松湖烟雨核心段（大学路—查理大桥段平路绿道）', toddler: '全程平路骑平衡车/滑板车，在小火车站看红色复古小火车', infant: '10:00-11:15在婴儿车内拉起遮阳棚，吹着湖风睡上午觉', note: '推车天花板级别！树荫覆盖率超80%，路面丝滑无任何台阶。' },
            { time: '12:00 - 14:30', title: '松山湖万象汇午餐 + 回酒店午休充电', toddler: '午餐后回酒店大床睡午觉（13:15-15:00）', infant: '万象汇五星母婴室换尿布哺乳，回房与哥哥同步午睡', note: '趁孩子午睡，大人可在阳台喝咖啡休整，车辆在酒店地库慢充补能。' },
            { time: '15:30 - 18:00', title: '松山湖望野博物馆 + 文化艺术街区夕阳漫步', toddler: '看古代陶瓷文物展、在街区浅水景观池边玩泡泡', infant: '睡醒精神饱满，爸爸用腰凳面朝前背着看光影建筑', note: '馆内恒温清静、推车直梯全覆盖，夕阳下湖面出片率极高。' }
          ],
          sun: [
            { time: '09:30 - 12:00', title: '同沙生态公园（映翠湖大草坪）或 东莞科技馆', toddler: '大草坪奔跑踢球，或科技馆一楼儿童馆动手操作齿轮水车', infant: '草坪野餐垫坐玩牙胶摇铃，10:30推车内小睡', note: '同沙生态公园可开车直达湖边草坪旁停车，免去搬运装备之苦。' },
            { time: '12:30 - 15:00', title: '午餐退房 → 14:30准时踏上返程高速', toddler: '上午放电充分，上车10分钟即秒睡到布吉', infant: '14:15喝饱奶换好干爽尿不湿，安全提篮内一路安睡', note: '走G94珠三角环线约15:20即抵布吉地库，避开周日晚高峰。' }
          ]
        }
      },
      {
        id: 'guangming',
        name: '【深圳光明科学自然线】光明科学公园栈道 × 美术馆乳鸽慢度假',
        shortName: '深圳光明科学自然线',
        region: 'west',
        regionLabel: '深圳西部与中心 · 光明',
        comboType: '自然公园+博物馆',
        distanceKm: 36,
        driveTimeModeA: 36, // Very fast via Nanping / Longda from Bantian
        driveTimeModeB: 48,
        highwayRouteA: '布吉出发 → 坂田接太太 → 布龙路/南坪快速转龙大高速(S31)直达光明凤凰城',
        highwayRouteB: '太太回布吉 → 水官高速转沈海/龙大高速至光明',
        tollAndEv: '全程高速免费段为主(路桥费¥0-¥10) · 光明文化艺术中心及蓝鲸世界超充桩密集',
        parks: '光明科学公园（北翼无障碍森林空中栈道+科学顶大草坪）+ 欢乐田园/虹桥公园平路段',
        museums: '光明文化艺术中心美术馆（纯白旋转楼梯建筑美学）+ 光明图书馆儿童绘本区',
        tags: ['全程无障碍推车', '五星母婴室配置', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 96,
        metrics: {
          stroller: 96,
          nursing: 95,
          toddler: 93,
          infant: 97,
          parking: 98,
          scenery: 95
        },
        costs: {
          tollAndEvCost: 45,
          ticketCost: 40,
          hotelCoeff: 0.92
        },
        parkingPinpoint: '【光明科学公园】导航“光明科学公园北翼停车场”，停靠后走无障碍缓坡直接上空中森林栈道（切勿带推车爬科学顶最后一段阶梯，栈道至观景平台全程平缓）；【光明文化艺术中心】地下停车场车位极宽，直梯直通1楼美术馆与图书馆。',
        nursingPinpoint: '【光明文化艺术中心】1楼及图书馆少儿区旁配备标准母婴室（冷热水、软包护理台、独立哺乳隔间）；旁边的【光明蓝鲸世界/万达广场】每层均有高配母婴室。',
        weatherSunny: '☀️ 晴朗模式：周六上午漫步光明科学公园无障碍森林栈道与荔枝林草坪；周日上午前往欢乐田园看四季花海与稻田小火车。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：常驻【光明文化艺术中心美术馆+少儿图书馆绘本馆】（安静恒温、推车极度丝滑），下午转场【蓝鲸世界室内亲子乐园】，无缝衔接正宗光明三宝（乳鸽、牛初乳、甜玉米）。',
        schedule: {
          fri: [
            { time: '15:40 - 16:20', title: '布吉出发 → 坂田接太太 → 龙大高速36分钟极速抵光明', toddler: '车程极短，还没坐腻就到达酒店', infant: '小睡片刻即达，完全不会出现长途哭闹', note: '距离坂田最近的宝藏微度假区，周五下班毫无疲惫感。' },
            { time: '17:00 - 19:30', title: '入住光明美爵/希尔顿欢朋酒店 + 光明招待所品尝正宗红烧乳鸽', toddler: '大口喝温热的甜玉米汁与双皮奶牛初乳', infant: '餐椅坐立吃果泥与婴儿米粉，餐厅空间宽敞可停推车', note: '周五傍晚吃乳鸽完全不用排长队，体验感远胜周六中午。' }
          ],
          sat: [
            { time: '09:00 - 11:30', title: '光明科学公园（北翼无障碍森林栈道 + 雾森景观 + 芳草地）', toddler: '在巨型草坪奔跑、观察空中栈道树冠层昆虫与定时喷雾', infant: '推车行进在宽阔平缓的木塑栈道上，10:15安稳睡上午觉', note: '新建成的科学公园人少景美，无障碍坡道设计对双娃推车极友好。' },
            { time: '12:00 - 15:00', title: '蓝鲸世界午餐 + 回近邻酒店午睡休整', toddler: '午睡充沛，恢复体力', infant: '吹空调睡午觉，避开正午阳光', note: '光明各景点之间车程均在8-10分钟内，回酒店午睡成本极低。' },
            { time: '15:30 - 18:00', title: '光明文化艺术中心（美术馆看展 + 少儿图书馆亲子共读）', toddler: '在少儿绘本馆挑选立体书，在户外网红镜面水池看倒影', infant: '美术馆内极其安静凉爽，推车推行0障碍', note: '黑白几何旋转楼梯建筑非常出片，适合拍全家福。' }
          ],
          sun: [
            { time: '09:30 - 12:00', title: '光明欢乐田园（观景小火车 + 农耕科普区）', toddler: '坐田园观光车看彩色稻田、喂小动物、采摘时令蔬果', infant: '妈妈用背带或推车在遮阳棚下乘凉看风景', note: '园区道路平坦宽阔，建议直接租乘园区代步电瓶车省力。' },
            { time: '12:30 - 14:45', title: '午餐再吃一顿光明乳鸽 → 35分钟轻松返程布吉', toddler: '带两包光明牛初乳糕点路上分享', infant: '吃饱喝足午睡返程', note: '15:00前已回到布吉家中，堪称最省妈省爸的轻量级路线。' }
          ]
        }
      },
      {
        id: 'nanshan',
        name: '【深圳南山前海人文海风线】深圳湾人才公园 × 南山博物蛇口看海',
        shortName: '深圳南山前海人文海风线',
        region: 'west',
        regionLabel: '深圳西部与中心 · 南山前海',
        comboType: '自然公园+博物馆',
        distanceKm: 32,
        driveTimeModeA: 35, // Via Banyin Tunnel -> Beihuan / Binhai
        driveTimeModeB: 45,
        highwayRouteA: '布吉出发 → 坂田接太太 → 坂银通道转北环大道/沙河西路直达后海深圳湾',
        highwayRouteB: '太太回布吉 → 丹平/罗沙或水官转南坪快速至南山',
        tollAndEv: '全程城市快速路 ¥0过路费 · 深圳湾万象城/海上世界超充与母婴车位顶级配置',
        parks: '深圳人才公园（星级母婴室+无敌海景平路+儿童嬉乐园）+ 前海演艺公园日落草坪',
        museums: '南山博物馆（国家级常设大展）+ 蛇口海上世界文化艺术中心（V&A展馆+海边白色建筑）',
        tags: ['全程无障碍推车', '五星母婴室配置', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 95,
        metrics: {
          stroller: 98,
          nursing: 99,
          toddler: 92,
          infant: 97,
          parking: 94,
          scenery: 97
        },
        costs: {
          tollAndEvCost: 35,
          ticketCost: 60, // Special exhibition at Sea World Culture Arts Center
          hotelCoeff: 1.15
        },
        parkingPinpoint: '【人才公园】若周末公园P1停车场需预约排队，强烈建议直接停隔壁“深圳湾万象城地库B2”，走连廊或地面过马路3分钟即入园，车位极多且含顶级母婴室；【海上世界文化艺术中心】直接停本馆地下车库，直梯直达展厅与海滨步道。',
        nursingPinpoint: '【深圳人才公园求贤阁旁】拥有深圳公园界标杆级独立母婴室（刷脸/按铃进入，恒温空调、饮水机、尿布台一应俱全）；【深圳湾万象城】B1/L2/L3旗舰级母婴中心（提供免费温奶器、防溢乳垫、爽身粉）。',
        weatherSunny: '☀️ 晴朗模式：周六上午在深圳人才公园儿童沙池与深圳湾海滨栈道吹海风看海鸥；周六傍晚在前海演艺公园看摩天轮海景日落。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：上午【南山博物馆】（室内大体量展厅，推车无障碍直梯）+ 下午【蛇口海上世界文化艺术中心】（室内看展、海景咖啡厅小憩、儿童美育工坊），全天候恒温优雅。',
        schedule: {
          fri: [
            { time: '15:45 - 16:25', title: '布吉出发 → 坂田接太太 → 坂银通道转北环直达南山后海/蛇口', toddler: '穿行坂银通道长隧道数灯光', infant: '小睡35分钟即抵酒店', note: '16:00前通过坂银通道完全不堵车，一路畅通。' },
            { time: '17:00 - 19:30', title: '入住蛇口希尔顿南海/后海木棉花或前海JEN酒店 + 海上世界晚餐', toddler: '看明华轮巨型游轮灯光秀与音乐喷泉', infant: '沿平坦海滨木栈道推车散步吹微风', note: '海上世界餐饮选择极其丰富，各国料理与粤式早茶俱全。' }
          ],
          sat: [
            { time: '09:00 - 11:30', title: '深圳人才公园（星光桥平路 + 嬉乐园无动力沙池 + 深圳湾栈道）', toddler: '在嬉乐园挖沙、爬攀爬网，看春笋大厦倒影', infant: '10:00在海风树荫下推车小睡，醒来去公园五星母婴室换洗', note: '全深圳母婴设施最完善的市政公园，没有之一。' },
            { time: '12:00 - 15:00', title: '深圳湾万象城午餐 + 酒店午睡', toddler: '品尝亲子餐厅美食后回房午睡', infant: '享受万象城VIP级母婴室护理服务，回酒店安睡', note: '商业配套成熟度满分，忘带任何母婴用品5分钟内均可买齐。' },
            { time: '15:30 - 18:30', title: '蛇口海上世界文化艺术中心 + 前海演艺公园摩天轮日落', toddler: '在文化艺术中心门前草坪阶梯跑跳，傍晚看前海之眼摩天轮', infant: '在馆内看色彩鲜艳的艺术装置，傍晚海边吹风', note: '设计大师桢文彦作品，白墙碧海与夕阳同框，出片惊艳。' }
          ],
          sun: [
            { time: '09:30 - 12:00', title: '南山博物馆（古代南山史 + 国家级特展）', toddler: '观看古代船模、恐龙/青铜器或多媒体互动沙盘', infant: '馆内宽敞安静，推车全程走无障碍大电梯', note: '记得提前在“南山博物馆”公众号预约入馆名额。' },
            { time: '12:30 - 14:30', title: '南头古城外围老字号粤式点心午餐 → 坂银通道返程布吉', toddler: '吃虾饺烧卖叉烧包', infant: '午后上车秒睡，35分钟直回布吉', note: '市内微度假标杆，既有度假感又免去长途奔波。' }
          ]
        }
      },
      {
        id: 'yantian',
        name: '【深圳盐田云海山海线】恩上湿地森林会客厅 × 盐田海滨栈道',
        shortName: '深圳盐田云海山海线',
        region: 'east',
        regionLabel: '深圳东部滨海 · 盐田',
        comboType: '滨海栈道+湿地',
        distanceKm: 28,
        driveTimeModeA: 48, // Have to go Bantian -> Buji -> Yantian
        driveTimeModeB: 32, // Direct from Buji via Danping / Yanpai Expy!
        highwayRouteA: '坂田接太太后绕行布龙路/水官转盐排高速至盐田（晚高峰易缓行）',
        highwayRouteB: '【强烈推荐模式B】太太地铁5号线回布吉百鸽笼/布吉站 → 直接上丹平快速转罗沙/盐排高速32分钟直达盐田',
        tollAndEv: '高速过路费约 ¥10 · 盐田壹海城Mall及大梅沙洲际/凯悦地库超充与车位充足',
        parks: '恩上湿地公园（梧桐山森林会客厅高山大草坪+古树群）+ 盐田海滨栈道（海山段平坦亲海栈道）',
        museums: '深圳博物馆（同心路古代艺术馆/金田路馆顺路串联）+ 盐田灯塔图书馆/大梅沙室内海洋科普角',
        tags: ['全程无障碍推车', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 93,
        metrics: {
          stroller: 93,
          nursing: 88,
          toddler: 95,
          infant: 92,
          parking: 92,
          scenery: 98
        },
        costs: {
          tollAndEvCost: 40,
          ticketCost: 50,
          hotelCoeff: 1.05
        },
        parkingPinpoint: '【恩上湿地公园】车停“盐田壹海城地下停车场”，步行至“海山路云海专线巴士总站”，坐云海专线巴士上山（婴儿车可折叠上车，省去盘山徒步，下车即是全平路森林湿地与大草坪）；【盐田海滨栈道】壹海城出地面过天桥/连廊直达灯塔图书馆段平路栈道。',
        nursingPinpoint: '【盐田壹海城One Mall】L2层设有独立母婴室（紧邻海滨栈道入口，补给极其方便）；【大梅沙京基洲际/凯悦酒店】大堂公区配备高规格母婴护理间。',
        weatherSunny: '☀️ 晴朗模式：周六上午登恩上湿地公园在半山云端大草坪野餐放电、俯瞰盐田港巨轮；下午推车漫步盐田海滨栈道灯塔图书馆段。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：顺路先去【深圳博物馆（金田路/同心路馆）】室内看展，抵达盐田后入住【凯悦/大梅沙洲际】，畅玩酒店恒温室内儿童俱乐部与海洋生物科普体验馆。',
        schedule: {
          fri: [
            { time: '16:30 - 17:05', title: '太太回布吉汇合 → 丹平快速/盐排高速32分钟直抵盐田沙头角', toddler: '在隧道里看集装箱卡车与远处大海', infant: '短途30分钟车程，情绪极佳', note: '布吉住家去盐田有着天然地理优势，走盐排高速一路下坡即见大海。' },
            { time: '17:30 - 20:00', title: '入住盐田凯悦酒店（云端海景房）+ 盐田海鲜街/壹海城晚餐', toddler: '在酒店落地窗前看盐田港彩色集装箱与巨轮进出港', infant: '房间宽敞安静，海景浴缸温水洗澡', note: '壹海城就在酒店楼下，下楼即达海滨栈道。' }
          ],
          sat: [
            { time: '09:00 - 12:00', title: '恩上湿地公园（梧桐山森林会客厅 · 高山草坪 + 鸳鸯谷湿地）', toddler: '在超大高山草坪追泡泡、在湿地木栈道找蝌蚪与蜻蜓', infant: '半山森林负氧离子极高，温度比市区低3℃，推车睡上午觉超香', note: '务必乘坐云海专线巴士直达恩上湿地站，下车后环湖步道全平无台阶。' },
            { time: '12:30 - 15:30', title: '壹海城午餐 + 回酒店午睡', toddler: '吃海鲜粥与粤式茶点，回房午睡', infant: '吃辅食泥后午睡2小时', note: '酒店与商场无缝连接，正午完全不用晒太阳。' },
            { time: '16:00 - 18:30', title: '盐田海滨栈道（灯塔图书馆 — 背仔角亲海平路段）', toddler: '在灯塔图书馆看绘本、在观海平台用望远镜看大轮船', infant: '推车在宽阔石板海滨栈道推行，听海浪声', note: '海山段栈道平坦宽敞，护栏坚固安全，傍晚海风极舒服。' }
          ],
          sun: [
            { time: '09:30 - 12:00', title: '深圳博物馆（顺路罗湖/福田段）或 酒店室内儿童乐园+金色海岸游船', toddler: '乘盐田金色海岸双层观光游船近距离看集装箱巨轮（55分钟航程平稳）', infant: '游船一楼室内空调舱平稳舒适，可推车登船', note: '3.5岁男宝/女宝对巨型货轮与塔吊毫无抵抗力，科普感拉满。' },
            { time: '12:30 - 14:30', title: '沙头角乳鸽/肠粉午餐 → 盐排高速30分钟返抵布吉', toddler: '轻松返程不堵车', infant: '车内午睡，到家移至婴儿床继续睡', note: '距离布吉里程最短的山海微度假路线。' }
          ]
        }
      },
      {
        id: 'dapeng',
        name: '【深圳大鹏坝光生态慢游线】白沙湾赶海银叶树 × 国家地质博物馆',
        shortName: '深圳大鹏坝光生态慢游线',
        region: 'east',
        regionLabel: '深圳东部滨海 · 大鹏',
        comboType: '滨海栈道+湿地',
        distanceKm: 56,
        driveTimeModeA: 82,
        driveTimeModeB: 62, // From Buji via Shuiguan -> Shenhai -> Yanba -> Baguang
        highwayRouteA: '坂田接太太 → 水官高速转盐坝高速直达坝光出口',
        highwayRouteB: '【强烈推荐模式B】太太回布吉 → 丹平/水官转盐坝高速至葵涌/坝光出口（避开大鹏所城拥堵段）',
        tollAndEv: '高速费单程约 ¥15 · 坝光白沙湾公园各停车场极大且永远有空位，配慢充/快充桩',
        parks: '坝光白沙湾公园（极少人、全平路推车、大宝退潮赶海抓小螃蟹）+ 坝光银叶树湿地园',
        museums: '深圳大鹏半岛国家地质公园博物馆（恐龙化石+火山喷发科普及巨型地球厅）+ 坝光水翁湿地科普馆',
        tags: ['全程无障碍推车', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 91,
        metrics: {
          stroller: 95,
          nursing: 85,
          toddler: 99,
          infant: 90,
          parking: 96,
          scenery: 97
        },
        costs: {
          tollAndEvCost: 70,
          ticketCost: 30,
          hotelCoeff: 1.08
        },
        parkingPinpoint: '【坝光白沙湾公园】直接导航“白沙湾公园2号停车场”，车位距离海边平路绿道、儿童无动力沙池仅20米！完全不用像杨梅坑/较场尾那样忍受堵车和天价停车费；【国家地质公园博物馆】导航博物馆地面生态停车场，免费停车，无障碍坡道直入一楼展厅。',
        nursingPinpoint: '【大鹏半岛国家地质公园博物馆】一楼游客中心旁设独立母婴室；【坝光白沙湾公园】主游客服务中心配母婴护理间（建议随车携带恒温调奶壶，户外随时冲奶）。',
        weatherSunny: '☀️ 晴朗模式：周六上午在坝光白沙湾公园无动力沙池挖沙、退潮滩涂带3.5岁大宝抓小螃蟹拾贝壳；周日上午漫步百年古银叶树湿地园。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：重点深度游玩【大鹏半岛国家地质公园博物馆】（免费免预约，大型恐龙骨骼、矿物宝石与火山溶洞体验）+【坝光水翁湿地室内科普展馆】+ 桔钓沙莱华/浪骑瞻云酒店室内儿童乐园。',
        schedule: {
          fri: [
            { time: '16:00 - 17:05', title: '布吉出发 → 盐坝高速一路向东直达大鹏葵涌/坝光', toddler: '期待周末去海边挖沙抓螃蟹', infant: '在安全提篮内睡下午觉，60分钟准时抵达', note: '五一至十月旺季请提前在“深圳交警”预约大鹏通行（坝光片区很多时候不在核心拥堵区，通行极顺畅）。' },
            { time: '17:30 - 20:00', title: '入住大鹏佳兆业万豪/浪骑瞻云或葵涌高品质亲子美宿 + 海鲜晚餐', toddler: '在酒店儿童泳池戏水、吃窑鸡与海胆炒饭', infant: '酒店提供免费婴儿床、婴儿澡盆与奶瓶消毒锅（预订时备注）', note: '提前致电酒店礼宾部备好婴儿三件套，解放后备箱。' }
          ],
          sat: [
            { time: '09:00 - 11:45', title: '坝光白沙湾公园（沿海平路栈道 + 巨型儿童沙池 + 浅滩赶海）', toddler: '提着小桶铲子在浅滩石头下找小螃蟹、在树荫沙池玩滑梯', infant: '在海边榕树荫下的平坦绿道推车睡觉，安静无人吵闹', note: '深圳最被低估的宝藏溜娃公园！人少、免费、车位贴着沙滩草坪。' },
            { time: '12:15 - 15:15', title: '葵涌/大鹏午餐 + 回酒店睡午觉', toddler: '上午赶海大放电后秒睡2小时', infant: '洗净手脚后喝奶安睡', note: '海边紫外线强，正午12:00-15:00务必回室内休整。' },
            { time: '15:45 - 18:00', title: '大鹏半岛国家地质公园博物馆（火山与恐龙科普之旅）', toddler: '看巨型恐龙模型、摸火山石、看地球演变光影秀', infant: '馆内冷气舒适、通道极宽，推车畅行无阻', note: '博物馆就在七娘山脚下，建筑宏伟且游客密度适中，科普互动性强。' }
          ],
          sun: [
            { time: '09:30 - 11:45', title: '坝光银叶树湿地园（300年古银叶树群 + 盐灶客家古村科普馆）', toddler: '观察奇特的银叶树板状根、在海防科普馆看古船模型', infant: '全程木栈道与平路绿道，古树参天完全不晒', note: '既有自然湿地野趣，又有小型室内科普展馆群。' },
            { time: '12:00 - 14:30', title: '品尝大鹏特色将军鸭/窑鸡 → 13:45提前走盐坝高速返程布吉', toddler: '车上听故事睡午觉', infant: '避开周日16:00后东部沿海高速返程车流大军', note: '大鹏返程切记在14:00-14:30前上盐坝高速，55分钟丝滑回布吉。' }
          ]
        }
      },
      {
        id: 'zhongshan',
        name: '【深中通道·中山金钟湖人文线】跨海大桥奇观 × 金钟湖与中山新博',
        shortName: '深中通道·中山金钟湖线',
        region: 'bay',
        regionLabel: '跨海湾区 · 中山',
        comboType: '自然公园+博物馆',
        distanceKm: 88,
        driveTimeModeA: 72, // Bantian -> Jihe -> Shenzhong Link -> Zhongshan Urban
        driveTimeModeB: 85,
        highwayRouteA: '布吉出发 → 坂田接太太 → 机荷高速(G15)直接连通深中通道跨海大桥直达中山城区',
        highwayRouteB: '太太回布吉 → 水官转机荷高速经深中通道至中山',
        tollAndEv: '深中通道+机荷单程过路费约 ¥86 · 中山利和/金钟湖及温泉酒店超充桩齐全，停车费极便宜',
        parks: '金钟湖公园（大型无动力儿童乐园+绝美环湖平路步道）+ 岐江公园（工业遗址亲水草坪）',
        museums: '中山市博物馆新馆（园林式现代建筑群+华侨历史馆）+ 孙中山故居纪念馆/香山商业文化博物馆',
        tags: ['全程无障碍推车', '五星母婴室配置', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 94,
        metrics: {
          stroller: 96,
          nursing: 93,
          toddler: 96,
          infant: 92,
          parking: 97,
          scenery: 95
        },
        costs: {
          tollAndEvCost: 220, // Includes Shenzhong Link round-trip tolls
          ticketCost: 30,
          hotelCoeff: 0.78 // Zhongshan 5-star hotels are super cost-effective!
        },
        parkingPinpoint: '【金钟湖公园】导航“金钟湖公园主入口立体停车楼”或“儿童公园P1停车场”，下楼过连廊直接进入环湖无障碍绿道与儿童游乐区；【中山市博物馆新馆】导航博物馆地下停车场，电梯直达一楼大厅，馆内空间极其阔绰。',
        nursingPinpoint: '【中山市博物馆新馆】一楼游客服务中心内设高标准独立母婴室（恒温饮水机、自动感应门、软包护理台）；【金钟湖公园】游客驿站内设标准母婴室。',
        weatherSunny: '☀️ 晴朗模式：周五下午驰骋深中通道看海上日落与西人工岛；周六上午在金钟湖公园环湖步道推车、大宝畅玩无动力儿童游乐园。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：深度打卡【中山市博物馆新馆群】（主馆+侨史馆+收音机博物馆，室内连通且展陈极佳）+ 入住【中山温泉宾馆/喜来登/保利艾美】享室内恒温泳池与高性价比石岐乳鸽粤式早茶。',
        schedule: {
          fri: [
            { time: '15:30 - 16:45', title: '布吉出发 → 坂田接太太 → 机荷高速直上深中通道跨海大桥', toddler: '在深中大桥上看伶仃洋巨轮、飞机起降与海底沉管隧道灯光顶', infant: '机荷转深中通道全程高速平稳，睡醒刚好跨过伶仃洋', note: '周五下午16:00上深中通道完全不堵车，还能邂逅绝美珠江口海上夕阳！' },
            { time: '17:15 - 20:00', title: '入住中山保利艾美/喜来登或永安新城皇冠假日 + 石岐佬乳鸽大餐', toddler: '吃脆皮石岐乳鸽、菠萝包与菊花水榄', infant: '中山五星级酒店房价仅为深圳一半，房间超大（45㎡+），二宝爬行超宽敞', note: '强烈建议用小程序提前取号石岐佬或煲煲掂，性价比极高。' }
          ],
          sat: [
            { time: '09:00 - 11:45', title: '金钟湖公园（环湖无障碍绿道 + 门前大型免费儿童游乐园）', toddler: '在巨型攀爬架、滑梯群与沙池放电2小时', infant: '金钟湖步道极其平坦宽阔，湖风习习，推车睡上午觉满分', note: '金钟湖公园是中山溜娃天花板，绿化与母婴设施均为新近高标准建设。' },
            { time: '12:15 - 15:15', title: '地道粤式茶楼早茶/午茶 + 回五星酒店午睡', toddler: '吃尽兴后回酒店睡午觉', infant: '酒店婴儿床安稳午睡', note: '跨城自驾务必保证周六中午2小时酒店午休，大人小孩都不累。' },
            { time: '15:45 - 18:15', title: '中山市博物馆新馆 + 岐江公园看红色大轮船遗址', toddler: '在博物馆看老式有轨电车、粤港澳轮船模型与收音机展', infant: '新馆建筑融合岭南园林与现代极简风，全程无障碍直梯推车极丝滑', note: '中山市博物馆新馆荣获多项建筑大奖，人少好逛，冷气充足。' }
          ],
          sun: [
            { time: '09:30 - 11:45', title: '孙中山故居纪念馆（翠亨村古建园林 + 树荫平路）', toddler: '看民国中西合璧小洋楼、酸子树与民俗展示', infant: '园区古树参天、全平路石板道，推车阴凉舒适', note: '翠亨村就在深中通道翠亨东入口旁，游览完5分钟即可上高速返深！' },
            { time: '12:00 - 14:45', title: '崖口煲仔饭/海鲜午餐 → 13:45从翠亨东上深中通道返程布吉', toddler: '带着中山杏仁饼特产上车秒睡', infant: '避开周日16:00后深中通道返深高峰，70分钟直回布吉', note: '早去早回策略让跨海自驾比市内堵车还轻松。' }
          ]
        }
      },
      {
        id: 'huizhou',
        name: '【惠州植物园温室+西湖博物线】恒温玻璃温室 × 丰渚园荷花湖景',
        shortName: '惠州植物园温室+西湖线',
        region: 'huizhou',
        regionLabel: '惠州山水圈 · 惠城西湖',
        comboType: '室内恒温避暑避雨优先',
        distanceKm: 76,
        driveTimeModeA: 82,
        driveTimeModeB: 68, // From Buji via Shuiguan -> Boshen/Wushen Expy (G0422)
        highwayRouteA: '坂田接太太 → 机荷转武深高速(博深段)直达惠州西湖/植物园',
        highwayRouteB: '【推荐模式B】太太回布吉 → 丹平/水官转武深高速(G0422)一路畅通无阻至惠州城区',
        tollAndEv: '单程高速费约 ¥38 · 武深高速车流极少不堵车，惠州植物园及康帝/皇冠假日地库车位充裕',
        parks: '惠州植物园（巨型室内恒温玻璃温室馆，全平路推车天花板）+ 惠州西湖丰渚园（岭南水乡荷花平路）',
        museums: '惠州科技馆 + 惠州博物馆（刘氏大宗祠/东坡文化展，两馆紧邻同享地库）',
        tags: ['全程无障碍推车', '五星母婴室配置', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 94,
        metrics: {
          stroller: 97,
          nursing: 91,
          toddler: 94,
          infant: 96,
          parking: 96,
          scenery: 95
        },
        costs: {
          tollAndEvCost: 115,
          ticketCost: 20, // Botanical garden & West Lake are FREE!
          hotelCoeff: 0.75 // Extremely high value 5-star lake-view hotels
        },
        parkingPinpoint: '【惠州植物园】直接导航“惠州植物园地下停车场”，电梯上来就是游客中心与核心景点“巨型室内温室馆”，推车完全不用淋雨晒太阳；【惠州西湖丰渚园】建议停“丰渚园北门停车场”（比西湖平湖门人少太多，且紧邻惠州植物园，车程仅5分钟）。',
        nursingPinpoint: '【惠州植物园游客中心】一楼设独立母婴室（配冷热水与护理台）；【惠州博物馆/科技馆】一楼服务中心设标准母婴哺乳间。',
        weatherSunny: '☀️ 晴朗模式：周六上午逛惠州植物园室内温室+户外儿童科普园，下午泛舟惠州西湖丰渚园喂锦鲤；周日上午打卡惠州科技馆。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：本路线天生自带室内恒温属性！【惠州植物园巨型玻璃温室】+【惠州科技馆】+【惠州博物馆】三大室内场馆全部地库直梯直达，狂风暴雨或35℃酷暑也能优雅溜双娃。',
        schedule: {
          fri: [
            { time: '16:00 - 17:10', title: '布吉出发 → 水官转武深高速(博深段)一路向北直抵惠州西湖', toddler: '沿途穿越青山绿水隧道群', infant: '武深高速路况极好、货车少，二宝睡完整觉即达', note: '从布吉走武深高速去惠州城区，是深圳出城最不堵的一条宝藏高速走廊。' },
            { time: '17:30 - 20:00', title: '入住惠州康帝国际酒店（西湖全景房）或富力万丽 + 客家盐焗鸡晚餐', toddler: '在房间直接俯瞰整个惠州西湖与泗洲塔夜景', infant: '吃客家山水豆腐花与肉沫蒸蛋辅食', note: '康帝酒店出门过马路即是西湖平湖栈道，地理位置无敌且性价比极高。' }
          ],
          sat: [
            { time: '09:00 - 11:45', title: '惠州植物园（巨型室内恒温沙生/热带雨林温室馆 + 儿童园）', toddler: '在巨型玻璃温室看空中瀑布、食虫植物、巨型仙人掌与儿童迷宫', infant: '温室馆内全无障碍平缓坡道直通到底，推车推行丝滑度100分', note: '完全免费！温室馆造型如生态太空舱，既有科普性又非常出片。' },
            { time: '12:15 - 15:15', title: '西湖畔顺德/客家菜午餐 + 回西湖景酒店午睡', toddler: '回酒店午休，大人在窗边泡茶看西湖游船', infant: '安静午睡2小时', note: '植物园距离西湖酒店仅8分钟车程，转场极快。' },
            { time: '15:30 - 18:00', title: '惠州西湖·丰渚园（荷花池平路长廊 + 锦鲤投喂 + 电动画舫船）', toddler: '在五龙亭买鱼食喂成群大锦鲤，坐平稳电动船游湖', infant: '丰渚园三面环湖、亭台连廊遮阴，推车散步微风拂面', note: '避开游客扎堆的西湖主大门，从丰渚园进出清静雅致、推车无台阶。' }
          ],
          sun: [
            { time: '09:30 - 12:00', title: '惠州科技馆 + 惠州博物馆（江北市民乐园双馆联游）', toddler: '在科技馆玩宇宙飞船模拟、声光电互动与恐龙展厅', infant: '两馆并排相邻，冷气充足、母婴室齐备，二宝推车或腰凳轻松逛', note: '公立大馆免费开放，展品维护好且排队极少。' },
            { time: '12:30 - 15:00', title: '品尝横沥汤粉/东江酿豆腐 → 武深高速68分钟轻松回布吉', toddler: '满载客家小吃特产上车午睡', infant: '一路顺畅回深，完全不塞车', note: '预算最友好、室内恒温保障最强的跨城路线。' }
          ]
        }
      },
      {
        id: 'nansha',
        name: '【广州南沙/番禺科普滨海线】慧谷超级堤挖沙 × 广东科学中心/水鸟世界',
        shortName: '广州南沙科普滨海线',
        region: 'bay',
        regionLabel: '跨海湾区 · 广州南沙',
        comboType: '森林湖泊+科普馆',
        distanceKm: 82,
        driveTimeModeA: 72, // Via G94 -> Nansha Bridge / Humen Bridge -> Nansha
        driveTimeModeB: 85,
        highwayRouteA: '布吉出发 → 坂田接太太 → 珠三角环线(G94)转莞佛/南沙大桥直下南沙灵山岛/慧谷',
        highwayRouteB: '太太回布吉 → 机荷转广深沿江/南沙大桥至南沙',
        tollAndEv: '单程过路过桥费约 ¥68 · 南沙花园酒店、环宇城及广东科学中心超充桩与超大地面车位极多',
        parks: '南沙慧谷超级堤（7公里沿海平坦绿道+大草坪+免费海边沙池）+ 灵山岛尖儿童公园',
        museums: '广东科学中心（吉尼斯世界最大科技馆，专设儿童天地馆）+ 南沙水鸟世界生态园（东南亚竹构建筑+散养火烈鸟鹈鹕）',
        tags: ['全程无障碍推车', '五星母婴室配置', '3.5岁高能放电', '充电桩与大车位友好'],
        baseScore: 95,
        metrics: {
          stroller: 97,
          nursing: 96,
          toddler: 99,
          infant: 93,
          parking: 97,
          scenery: 94
        },
        costs: {
          tollAndEvCost: 180,
          ticketCost: 130, // Guangdong Science Center / Waterbird World tickets
          hotelCoeff: 0.90
        },
        parkingPinpoint: '【南沙慧谷超级堤】导航“南沙花园酒店”或“明珠湾大桥西侧慧谷超级堤停车场”，停好车过绿道0台阶直达海边大草坪与挖沙区；【广东科学中心】导航科学中心西门大型停车场，步行至正门坐无障碍直梯进二楼展厅。',
        nursingPinpoint: '【广东科学中心】每层展馆旁均设大型星级母婴室（尤其是二楼“儿童天地”展馆旁，配多个独立哺乳间、温水台与婴儿床）；【南沙环宇城/南沙花园酒店】配备五星级母婴护理间。',
        weatherSunny: '☀️ 晴朗模式：周六上午在南沙慧谷超级堤7公里滨海绿道骑平衡车、挖沙看虎门大桥；下午在南沙水鸟世界看火烈鸟与黑天鹅。',
        weatherRainy: '🌧️ 阴雨/暴晒B计划：全天沉浸式畅玩【广东科学中心】（吉尼斯世界纪录最大科技馆，仅“儿童天地”与“飞天之梦”两个馆就够3.5岁大宝玩足一整天！）+ 入住【南沙花园酒店】畅玩室内外恒温泳池与透明旋转滑梯。',
        schedule: {
          fri: [
            { time: '15:30 - 16:45', title: '布吉出发 → 坂田接太太 → G94转南沙大桥直抵广州南沙湾', toddler: '跨越宏伟的南沙大桥/虎门大桥看珠江口繁忙航道', infant: '趁15:30下午小睡窗口出发，过桥后即抵达酒店', note: '南沙紧邻虎门/南沙大桥西岸，一下桥就是景区和酒店，无需进入广州拥堵市区！' },
            { time: '17:15 - 20:00', title: '入住广州南沙花园酒店（邮轮造型设计酒店）或南沙越秀喜来登 + 十四涌海鲜晚餐', toddler: '在南沙花园酒店室内儿童乐园与旋转滑梯放电', infant: '酒店由克罗地亚设计师操刀，园区全无障碍连廊直通海滨绿道', note: '南沙花园酒店本身就像一座现代建筑艺术馆，且紧贴慧谷超级堤。' }
          ],
          sat: [
            { time: '09:00 - 11:30', title: '南沙慧谷超级堤（7公里全平路滨海绿道 + 鸭利沙大草坪 + 海边挖沙）', toddler: '骑滑板车/平衡车、在海边细沙池挖沙、看邮轮母港大船', infant: '在极其宽阔平整的超级堤绿道推车睡上午觉，海风清爽人极少', note: '相比深圳湾周末的人山人海，南沙慧谷超级堤宽阔清静10倍，溜娃极爽。' },
            { time: '12:00 - 15:00', title: '南沙环宇城粤式茶点午餐 + 回酒店睡午觉', toddler: '午睡养精蓄锐', infant: '环宇城高配母婴室换洗，回酒店安睡', note: '保证午睡质量，下午游园不哭闹。' },
            { time: '15:30 - 18:00', title: '南沙水鸟世界生态园（巴厘岛风竹构建筑 + 零距离看火烈鸟/孔雀/鹈鹕）', toddler: '近距离观察散养的红鹳火烈鸟、斑嘴鹈鹕与黑天鹅，趣味性爆棚', infant: '园区全平坦木栈道与东南亚竹子编织拱廊，阴凉遮阳且出片极美', note: '水鸟世界紧邻十九涌湿地，生态温和不费腿，非常适合3.5岁+8月龄组合。' }
          ],
          sun: [
            { time: '09:30 - 13:00', title: '广东科学中心（全球最大科技馆 · 二楼“儿童天地”专馆）', toddler: '在人体探秘、戏水湾、小小建筑师、感知花园动手玩足3小时', infant: '场馆极其宏大、冷气恒温、五星母婴室随处可见，推车畅行无阻', note: '3.5岁大宝的科普天堂！建议直奔二楼C区“儿童天地”与“交通世界”。' },
            { time: '13:30 - 15:15', title: '科学中心简餐/番禺美食 → 14:15上南沙大桥返程布吉', toddler: '上午高强度科普放电，上车即沉睡到深圳', infant: '喝饱奶伴随车行摇晃睡下午觉', note: '15:30前即可回到布吉地库，避开周日傍晚大桥返程车流。' }
          ]
        }
      }
    ];

    // =========================================================================
    // 3. DUAL-KID TRUNK GEAR CHECKLIST DATA (4 Categories, 28 Items)
    // =========================================================================
    const gearCategories = [
      {
        id: 'infant',
        title: '8月龄二宝专区',
        subtitle: '睡眠、喂养与移动护理核心',
        badgeColor: 'bg-terracotta text-cream',
        items: [
          { id: 'inf_1', name: '高避震轻便婴儿推车 + 防晒遮光帘', essential: true, desc: '实现上午户外绿道推车小睡的核心装备' },
          { id: 'inf_2', name: '人体工学透气腰凳 / 婴儿背带', essential: true, desc: '博物馆跨层、上下接驳车及二宝粘人时救命神器' },
          { id: 'inf_3', name: '便携恒温调奶水壶 (带电量显示) + 奶粉分装盒', essential: true, desc: '车载/酒店随时45℃恒温冲奶，不求人' },
          { id: 'inf_4', name: '成品辅食果泥/肉泥×6袋 + 便携米粉 + 硅胶软勺', essential: true, desc: '8月龄外出首选巴氏杀菌成品泥，安全省心' },
          { id: 'inf_5', name: '纸尿裤/拉拉裤×18片 + 便携隔尿垫×4张', essential: true, desc: '三天两晚日均6片+冗余备用，换尿布干净卫生' },
          { id: 'inf_6', name: '安抚奶嘴/防掉链 + 熟悉的安抚巾/牙胶摇铃×3', essential: true, desc: '高速行车与陌生酒店入睡安抚必备' },
          { id: 'inf_7', name: '连体包屁衣×4套 + 博物馆防空调薄纱巾/防风披肩', essential: false, desc: '应对室内博物馆22℃冷气与海边傍晚微风' }
        ]
      },
      {
        id: 'toddler',
        title: '3.5岁大宝专区',
        subtitle: '高能户外放电与旅途自娱',
        badgeColor: 'bg-tealDeep text-cream',
        items: [
          { id: 'tod_1', name: '儿童平衡车 / 折叠滑板车 + 护具头盔', essential: true, desc: '松山湖/人才公园/慧谷超级堤平路放电神器' },
          { id: 'tod_2', name: '折叠硅胶挖沙桶 + 小铲子 + 赶海小蟹钳', essential: true, desc: '白沙湾赶海、公园沙池玩2小时不费爸妈' },
          { id: 'tod_3', name: '全自动防漏泡泡机 + 昆虫观察放大镜', essential: false, desc: '大草坪拍照出片与森林栈道自然科普利器' },
          { id: 'tod_4', name: '速干吸汗换洗内衣汗衫×4套 + 隔汗巾×5条', essential: true, desc: '3.5岁跑跳极易出汗，及时换衣防吹风感冒' },
          { id: 'tod_5', name: '车载应急便携小尿壶 (男女宝通用密封款)', essential: true, desc: '专治高速堵车或大型公园找不到厕所的十万火急' },
          { id: 'tod_6', name: '车载故事机 / 熏听机 + 3本最爱的轻薄绘本', essential: true, desc: '保护视力不看手机，高速路上安静听故事' },
          { id: 'tod_7', name: '大宝专属保温吸管水杯 + 独立小零食包', essential: true, desc: '海苔、山楂棒、奶酪棒，随时补充体力' }
        ]
      },
      {
        id: 'car',
        title: '车载与安全移动舱',
        subtitle: '双安全座椅与座舱秩序管理',
        badgeColor: 'bg-olive text-cream',
        items: [
          { id: 'car_1', name: '双安全座椅安装检查 (二宝反向安装45°躺角)', essential: true, desc: '出发前确认ISOFIX卡扣锁紧，二宝躺角舒适易睡' },
          { id: 'car_2', name: '后排双侧磁吸遮阳帘 + 二宝座椅观察反光镜', essential: true, desc: '遮挡午后西晒阳光，前排随时观察二宝睡眠状态' },
          { id: 'car_3', name: '大宝安全座椅便携软质小桌板', essential: false, desc: '行车途中放绘本、贴纸书与小水杯' },
          { id: 'car_4', name: '80抽厚款婴儿纯水湿巾×3大包 + 柔纸巾×3包', essential: true, desc: '前排中控1包、妈咪包1包、后备箱1包' },
          { id: 'car_5', name: '粘贴式车载垃圾袋×1卷 + 免洗抑菌洗手液', essential: true, desc: '随时处理果皮、用过的纸尿裤与户外挖沙后清洁' },
          { id: 'car_6', name: '折叠户外野餐垫 (防水铝膜底) / 速开遮阳帐篷', essential: false, desc: '铺在公园草坪，大宝休息、二宝练习坐爬' },
          { id: 'car_7', name: '新能源充放电枪 / 手机多口快充线 + 大容量充电宝', essential: true, desc: '保障导航、相机与温奶器全天候不断电' }
        ]
      },
      {
        id: 'medical',
        title: '家庭医疗与避坑应急包',
        subtitle: '双娃跨城过夜定心丸',
        badgeColor: 'bg-ink text-cream',
        items: [
          { id: 'med_1', name: '博朗/红外耳温枪 + 退热贴×4片', essential: true, desc: '过夜必带！随时监测两娃体温变化' },
          { id: 'med_2', name: '美林(布洛芬混悬液) / 泰诺林 (注意核对保质期)', essential: true, desc: '应对小儿突发夜间发热的底线保障' },
          { id: 'med_3', name: '生理性海盐水鼻喷 + 婴儿吸鼻器', essential: true, desc: '缓解酒店空调房干燥或轻微鼻塞流涕' },
          { id: 'med_4', name: '派卡瑞丁物理防蚊液 (8月龄可用款) + 无比滴/紫草膏', essential: true, desc: '湿地公园、植物园草坪防蚊虫叮咬刚需' },
          { id: 'med_5', name: '独立包装碘伏棉签×15支 + 防水卡通创可贴', essential: true, desc: '3.5岁大宝骑车跑跳擦伤、赶海划伤即时消毒' },
          { id: 'med_6', name: '口服补液盐III + 蒙脱石散 + 益生菌', essential: false, desc: '预防水土不服或外食轻微肠胃不适' },
          { id: 'med_7', name: '两娃电子医保凭证确认 + 身份证/出生证明照片备份', essential: true, desc: '酒店办理入住登记及异地就医备用' }
        ]
      }
    ];

    // =========================================================================
    // 4. CORE HELPER FUNCTIONS & CALCULATIONS
    // =========================================================================

    // Calculate dynamic drive time based on Mode A or Mode B
    function getRouteDriveTime(route) {
      return state.departureMode === 'A' ? route.driveTimeModeA : route.driveTimeModeB;
    }

    // Calculate dynamic total cost based on Budget Sandbox
    function calculateRouteCost(route) {
      const hotelCost = Math.round(state.budgetSandbox.hotelRate * 2 * route.costs.hotelCoeff);
      const diningCost = Math.round(state.budgetSandbox.diningRate * 2.5);
      const ticketCost = state.budgetSandbox.includeTickets ? route.costs.ticketCost * 2 : 0;
      const tollAndEv = route.costs.tollAndEvCost;
      const total = hotelCost + diningCost + ticketCost + tollAndEv;
      return { hotelCost, diningCost, ticketCost, tollAndEv, total };
    }

    // Calculate dynamic recommendation score based on current departure mode
    function getDynamicScore(route) {
      const driveTime = getRouteDriveTime(route);
      // Slight bonus if route aligns with selected departure mode saving time
      const timeBonus = driveTime <= 45 ? 2 : (driveTime <= 65 ? 1 : -1);
      return Math.min(99, route.baseScore + timeBonus);
    }

    // =========================================================================
    // 5. DEPARTURE MODE SWITCHER (Mode A vs Mode B)
    // =========================================================================
    function setDepartureMode(mode) {
      state.departureMode = mode;

      const btnA = byId('btn-mode-a');
      const btnB = byId('btn-mode-b');
      const badgeA = byId('badge-mode-a');
      const badgeB = byId('badge-mode-b');
      const westGroup = byId('topo-west-group');
      const eastGroup = byId('topo-east-group');
      const topoLabel = byId('topology-mode-label');
      const topoDesc = byId('topology-desc');

      if (mode === 'A') {
        btnA.className = 'text-left p-4 rounded-xl border-2 transition-all relative group bg-tealDeep/5 border-tealDeep shadow-sm';
        btnB.className = 'text-left p-4 rounded-xl border-2 transition-all relative group bg-parchment/50 border-sandBorder hover:border-tealDeep/60';
        badgeA.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-tealDeep text-cream';
        badgeA.textContent = '● 当前激活 · 模式 A';
        badgeB.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-sandBorder text-ink';
        badgeB.textContent = '○ 点击切换 · 模式 B';

        westGroup.setAttribute('opacity', '1');
        eastGroup.setAttribute('opacity', '0.32');
        topoLabel.textContent = '模式A：西/北走廊优先';
        topoLabel.className = 'text-[11px] font-mono bg-tealDeep text-cream px-2 py-0.5 rounded';
        topoDesc.innerHTML = '当前示意图：<strong>模式A</strong> 下，15:30从布吉带两娃出发，20分钟到坂田接上太太直入G94珠三角环线或坂银通道，西北线与南山线耗时大幅缩短。';
      } else {
        btnB.className = 'text-left p-4 rounded-xl border-2 transition-all relative group bg-terracotta/5 border-terracotta shadow-sm';
        btnA.className = 'text-left p-4 rounded-xl border-2 transition-all relative group bg-parchment/50 border-sandBorder hover:border-tealDeep/60';
        badgeB.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-terracotta text-cream';
        badgeB.textContent = '● 当前激活 · 模式 B';
        badgeA.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-sandBorder text-ink';
        badgeA.textContent = '○ 点击切换 · 模式 A';

        westGroup.setAttribute('opacity', '0.32');
        eastGroup.setAttribute('opacity', '1');
        topoLabel.textContent = '模式B：东部山海走廊优先';
        topoLabel.className = 'text-[11px] font-mono bg-terracotta text-cream px-2 py-0.5 rounded';
        topoDesc.innerHTML = '当前示意图：<strong>模式B</strong> 下，太太乘地铁5号线/10号线回布吉汇合，直接从布吉上丹平快速/盐排高速或武深高速，去盐田、大鹏、惠州省时15-20分钟！';
      }

      renderRoutes();
    }

    // =========================================================================
    // 6. SMART FILTERS & BUDGET SANDBOX HANDLERS
    // =========================================================================
    function setFilter(key, value) {
      if (key === 'maxTime') {
        state.filters.maxTime = parseInt(value, 10);
      } else {
        state.filters[key] = value;
      }

      if (key === 'region') {
        root.querySelectorAll('.filter-chip-region').forEach(btn => {
          if (btn.dataset.val === value) {
            btn.className = 'filter-chip-region px-3 py-1.5 rounded-lg text-xs font-medium bg-tealDeep text-cream transition';
          } else {
            btn.className = 'filter-chip-region px-3 py-1.5 rounded-lg text-xs font-medium bg-parchment text-ink hover:bg-sandBorder/60 border border-sandBorder transition';
          }
        });
      }

      renderRoutes();
    }

    function toggleTag(tagName) {
      const idx = state.filters.tags.indexOf(tagName);
      if (idx > -1) {
        state.filters.tags.splice(idx, 1);
      } else {
        state.filters.tags.push(tagName);
      }

      root.querySelectorAll('.tag-filter-btn').forEach(btn => {
        const isSelected = state.filters.tags.includes(btn.dataset.tag);
        const checkBox = btn.querySelector('.tag-check-box');
        if (isSelected) {
          btn.className = 'tag-filter-btn flex items-center gap-2 p-2.5 rounded-xl border-2 border-tealDeep bg-tealDeep/10 text-left transition';
          checkBox.className = 'w-4 h-4 rounded bg-tealDeep border border-tealDeep flex items-center justify-center text-[10px] text-cream shrink-0 tag-check-box';
        } else {
          btn.className = 'tag-filter-btn flex items-center gap-2 p-2.5 rounded-xl border border-sandBorder bg-parchment/60 text-left hover:border-tealDeep transition';
          checkBox.className = 'w-4 h-4 rounded border border-sandDark flex items-center justify-center text-[10px] text-cream shrink-0 tag-check-box';
        }
      });

      renderRoutes();
    }

    function resetAllFilters() {
      state.filters = {
        region: 'all',
        combo: 'all',
        maxTime: 999,
        budgetTier: 'all',
        tags: []
      };
      byId('select-combo').value = 'all';
      byId('select-time').value = '999';
      byId('select-budget-tier').value = 'all';
      setFilter('region', 'all');

      root.querySelectorAll('.tag-filter-btn').forEach(btn => {
        const checkBox = btn.querySelector('.tag-check-box');
        btn.className = 'tag-filter-btn flex items-center gap-2 p-2.5 rounded-xl border border-sandBorder bg-parchment/60 text-left hover:border-tealDeep transition';
        checkBox.className = 'w-4 h-4 rounded border border-sandDark flex items-center justify-center text-[10px] text-cream shrink-0 tag-check-box';
      });

      renderRoutes();
    }

    function setSortBy(sortType) {
      state.sortBy = sortType;
      root.querySelectorAll('.sort-btn').forEach(btn => {
        if (btn.dataset.sort === sortType) {
          btn.className = 'sort-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-tealDeep text-cream transition';
        } else {
          btn.className = 'sort-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-parchment text-ink hover:bg-sandBorder/60 border border-sandBorder transition';
        }
      });
      renderRoutes();
    }

    function setBudgetSandbox(type, value) {
      if (type === 'hotel') {
        state.budgetSandbox.hotelRate = value;
        byId('label-hotel-rate').textContent = `¥${value} / 晚`;
        root.querySelectorAll('.sandbox-hotel-btn').forEach(btn => {
          const isSelected = parseInt(btn.dataset.hotel, 10) === value;
          btn.className = isSelected
            ? 'sandbox-hotel-btn py-2 px-2 rounded-lg border-2 border-tealDeep bg-tealDeep text-cream text-center transition'
            : 'sandbox-hotel-btn py-2 px-2 rounded-lg border border-sandBorder bg-parchment text-center transition';
        });
      } else if (type === 'dining') {
        state.budgetSandbox.diningRate = value;
        const labels = { 320: '商场简餐 ¥320/天', 500: '地道粤菜 ¥500/天', 850: '星级海鲜 ¥850/天' };
        byId('label-dining-rate').textContent = labels[value];
        root.querySelectorAll('.sandbox-dining-btn').forEach(btn => {
          const isSelected = parseInt(btn.dataset.dining, 10) === value;
          btn.className = isSelected
            ? 'sandbox-dining-btn py-2 px-2 rounded-lg border-2 border-tealDeep bg-tealDeep text-cream text-center transition'
            : 'sandbox-dining-btn py-2 px-2 rounded-lg border border-sandBorder bg-parchment text-center transition';
        });
      }
      updateSandboxAverage();
      renderRoutes();
    }

    function toggleTicketSandbox() {
      state.budgetSandbox.includeTickets = !state.budgetSandbox.includeTickets;
      const btn = byId('btn-ticket-toggle');
      if (state.budgetSandbox.includeTickets) {
        btn.textContent = '已含精选套票';
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-tealDeep text-cream transition';
      } else {
        btn.textContent = '仅免费公立馆 (¥0)';
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-parchment text-ink border border-sandDark transition';
      }
      updateSandboxAverage();
      renderRoutes();
    }

    function updateSandboxAverage() {
      const sum = routesData.reduce((acc, r) => acc + calculateRouteCost(r).total, 0);
      const avg = Math.round(sum / routesData.length);
      byId('sandbox-avg-total').textContent = `¥${avg.toLocaleString()}`;
    }

    // =========================================================================
    // 7. RENDER ROUTE CARDS MATRIX
    // =========================================================================
    function renderRoutes() {
      const grid = byId('routes-grid');
      const countBadge = byId('route-count-badge');

      // Filter routes
      let filtered = routesData.filter(route => {
        const driveTime = getRouteDriveTime(route);
        const costObj = calculateRouteCost(route);

        if (state.filters.region !== 'all' && route.region !== state.filters.region) return false;
        if (state.filters.combo !== 'all' && route.comboType !== state.filters.combo) return false;
        if (driveTime > state.filters.maxTime) return false;

        if (state.filters.budgetTier !== 'all') {
          if (state.filters.budgetTier === 'light' && costObj.total >= 1200) return false;
          if (state.filters.budgetTier === 'quality' && (costObj.total < 1200 || costObj.total > 2500)) return false;
          if (state.filters.budgetTier === 'luxury' && costObj.total <= 2500) return false;
        }

        for (const reqTag of state.filters.tags) {
          if (!route.tags.includes(reqTag)) return false;
        }

        return true;
      });

      // Sort routes
      filtered.sort((a, b) => {
        if (state.sortBy === 'score') return getDynamicScore(b) - getDynamicScore(a);
        if (state.sortBy === 'time') return getRouteDriveTime(a) - getRouteDriveTime(b);
        if (state.sortBy === 'stroller') return b.metrics.stroller - a.metrics.stroller;
        if (state.sortBy === 'cost') return calculateRouteCost(a).total - calculateRouteCost(b).total;
        return 0;
      });

      countBadge.textContent = `共匹配 ${filtered.length} 条路线`;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full bg-cream rounded-2xl editorial-border p-10 text-center space-y-3">
            <div class="text-base font-serif font-bold text-ink">当前严苛筛选条件下暂无匹配路线</div>
            <p class="text-xs text-inkMuted">您可以尝试调高住宿/预算区间，或点击下方按钮一键恢复全部 8 条精选路线</p>
            <button data-action="resetAllFilters" data-event="click" class="px-4 py-2 rounded-xl text-xs font-bold bg-tealDeep text-cream hover:bg-tealLight transition">
              重置全部筛选条件
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(route => {
        const driveTime = getRouteDriveTime(route);
        const otherModeTime = state.departureMode === 'A' ? route.driveTimeModeB : route.driveTimeModeA;
        const timeDiff = otherModeTime - driveTime;
        const costObj = calculateRouteCost(route);
        const score = getDynamicScore(route);
        const isCompared = state.compareList.includes(route.id);
        const activeHighway = state.departureMode === 'A' ? route.highwayRouteA : route.highwayRouteB;

        return `
          <article class="bg-cream rounded-2xl editorial-border card-transition flex flex-col justify-between overflow-hidden">
            <div>
              <!-- Card Top Header -->
              <div class="bg-parchment/80 px-5 py-3.5 border-b border-sandBorder flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-tealDeep text-cream">${route.regionLabel}</span>
                  <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-cream border border-sandBorder text-inkMuted">${route.comboType}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="text-[11px] text-inkMuted">双娃推荐度</span>
                  <span class="px-2 py-0.5 rounded-md font-mono text-sm font-bold bg-terracotta text-cream">${score}分</span>
                </div>
              </div>

              <!-- Main Content Body -->
              <div class="p-5 space-y-4">
                <!-- Route Title & Drive Info -->
                <div>
                  <h3 class="font-serif text-lg sm:text-xl font-bold text-ink leading-snug">${route.name}</h3>
                  <div class="mt-2.5 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs bg-parchment/60 px-3 py-2 rounded-xl border border-sandBorder">
                    <span class="font-mono font-bold text-tealDeep flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      单程 ${driveTime} 分钟 (${route.distanceKm}km)
                    </span>
                    ${timeDiff > 0
                      ? `<span class="text-[11px] font-mono px-1.5 py-0.5 rounded bg-olive/15 text-olive font-semibold">当前模式省 ${timeDiff} 分钟</span>`
                      : `<span class="text-[11px] font-mono px-1.5 py-0.5 rounded bg-terracotta/15 text-terracotta font-semibold">建议切模式${state.departureMode === 'A' ? 'B' : 'A'}省 ${Math.abs(timeDiff)}分</span>`
                    }
                  </div>
                  <p class="text-[11px] text-inkMuted mt-1.5 line-clamp-1">
                    <strong>高速走法：</strong>${activeHighway}
                  </p>
                  <p class="text-[11px] text-inkMuted mt-0.5">
                    <strong>路桥补能：</strong>${route.tollAndEv}
                  </p>
                </div>

                <!-- Park + Museum Combo Box -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div class="bg-parchment/50 p-3 rounded-xl border border-sandBorder">
                    <div class="text-[11px] font-bold text-tealDeep flex items-center gap-1 mb-1">
                      <span>🌲 自然公园 / 滨海景观</span>
                    </div>
                    <p class="text-xs text-ink leading-relaxed">${route.parks}</p>
                  </div>
                  <div class="bg-parchment/50 p-3 rounded-xl border border-sandBorder">
                    <div class="text-[11px] font-bold text-terracotta flex items-center gap-1 mb-1">
                      <span>🏛️ 博物馆 / 室内科普馆</span>
                    </div>
                    <p class="text-xs text-ink leading-relaxed">${route.museums}</p>
                  </div>
                </div>

                <!-- 6-Dimension Rating Mini Progress Bars -->
                <div class="bg-parchment/40 p-3.5 rounded-xl border border-sandBorder space-y-2">
                  <div class="flex items-center justify-between text-[11px] text-inkMuted font-medium mb-1">
                    <span>六维双娃友好度评级</span>
                    <span class="font-mono">推车 ${route.metrics.stroller} · 母婴室 ${route.metrics.nursing} · 8M舒适 ${route.metrics.infant}</span>
                  </div>
                  <div class="grid grid-cols-3 gap-x-3 gap-y-2 text-[11px]">
                    ${renderMiniMetricBar('推车无障碍', route.metrics.stroller, 'bg-tealDeep')}
                    ${renderMiniMetricBar('母婴室评级', route.metrics.nursing, 'bg-terracotta')}
                    ${renderMiniMetricBar('3.5Y趣味度', route.metrics.toddler, 'bg-tealDeep')}
                    ${renderMiniMetricBar('8M舒适度', route.metrics.infant, 'bg-terracotta')}
                    ${renderMiniMetricBar('停车与超充', route.metrics.parking, 'bg-olive')}
                    ${renderMiniMetricBar('景观出片度', route.metrics.scenery, 'bg-olive')}
                  </div>
                </div>

                <!-- Tags Row -->
                <div class="flex flex-wrap gap-1.5">
                  ${route.tags.map(t => `<span class="text-[11px] px-2 py-0.5 rounded-md bg-tealDeep/10 text-tealDeep font-medium">✓ ${t}</span>`).join('')}
                </div>
              </div>
            </div>

            <!-- Card Footer: Cost Breakdown & Actions -->
            <div class="bg-parchment/90 px-5 py-3.5 border-t border-sandBorder flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-baseline gap-2">
                  <span class="text-xs text-inkMuted">3天2晚预估总计</span>
                  <span class="font-mono text-lg font-bold text-terracotta">¥${costObj.total.toLocaleString()}</span>
                </div>
                <div class="text-[10px] font-mono text-inkMuted">
                  住¥${costObj.hotelCost} + 餐¥${costObj.diningCost} + 票¥${costObj.ticketCost} + 路电¥${costObj.tollAndEv}
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button data-action="toggleCompare" data-event="click" data-arg1="${route.id}" data-type1="string" class="px-3 py-2 rounded-xl text-xs font-bold border transition ${isCompared ? 'bg-terracotta text-cream border-terracotta' : 'bg-cream text-ink border-sandDark hover:border-tealDeep'}">
                  ${isCompared ? '✓ 已加对比' : '+ 加入对比'}
                </button>
                <button data-action="openDetailModal" data-event="click" data-arg1="${route.id}" data-type1="string" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-tealDeep text-cream hover:bg-tealLight shadow-sm transition flex items-center gap-1">
                  <span>三天两晚分时路书</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    function renderMiniMetricBar(label, val, colorClass) {
      return `
        <div>
          <div class="flex justify-between mb-0.5">
            <span class="text-ink">${label}</span>
            <span class="font-mono font-bold">${val}</span>
          </div>
          <div class="w-full h-1.5 bg-sandBorder rounded-full overflow-hidden">
            <div class="${colorClass} h-full rounded-full" style="width: ${val}%"></div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // 8. SVG 6-AXIS RADAR CHART GENERATOR
    // =========================================================================
    function generateRadarSVG(metricsList, labels, colors) {
      const size = 240;
      const cx = size / 2;
      const cy = size / 2;
      const maxR = 82;
      const axes = ['stroller', 'nursing', 'toddler', 'infant', 'parking', 'scenery'];
      const axisNames = ['推车无障碍', '母婴室配置', '3.5Y趣味', '8M舒适度', '停车补能', '景观出片'];

      const getPoint = (idx, value) => {
        const angle = (Math.PI * 2 * idx) / 6 - Math.PI / 2;
        const r = (value / 100) * maxR;
        return {
          x: (cx + r * Math.cos(angle)).toFixed(1),
          y: (cy + r * Math.sin(angle)).toFixed(1)
        };
      };

      // Concentric hexagon grids
      const levels = [40, 60, 80, 100];
      const gridPolygons = levels.map(lv => {
        const pts = axes.map((_, i) => {
          const p = getPoint(i, lv);
          return `${p.x},${p.y}`;
        }).join(' ');
        return `<polygon points="${pts}" fill="none" stroke="#E3E0D5" stroke-width="1"/>`;
      }).join('');

      // Axis lines and labels
      const axisLines = axes.map((key, i) => {
        const outer = getPoint(i, 100);
        const labelPt = getPoint(i, 123);
        return `
          <line x1="${cx}" y1="${cy}" x2="${outer.x}" y2="${outer.y}" stroke="#CFCCC0" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="${labelPt.x}" y="${labelPt.y}" text-anchor="middle" dominant-baseline="middle" fill="#141413" font-size="10.5" font-weight="600">${axisNames[i]}</text>
        `;
      }).join('');

      // Data polygons
      const dataPolygons = metricsList.map((m, idx) => {
        const pts = axes.map((k, i) => {
          const p = getPoint(i, m[k]);
          return `${p.x},${p.y}`;
        }).join(' ');
        const color = colors[idx] || '#527766';
        const dots = axes.map((k, i) => {
          const p = getPoint(i, m[k]);
          return `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}"/>`;
        }).join('');
        return `
          <polygon points="${pts}" fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-width="2.2"/>
          ${dots}
        `;
      }).join('');

      return `
        <svg viewBox="0 0 ${size} ${size}" class="w-full h-full">
          ${gridPolygons}
          ${axisLines}
          ${dataPolygons}
        </svg>
      `;
    }

    // =========================================================================
    // 9. DETAIL MODAL (3D2N BIO-RHYTHM ROADBOOK)
    // =========================================================================
    function openDetailModal(routeId) {
      const route = routesData.find(r => r.id === routeId);
      if (!route) return;

      state.activeModalRouteId = routeId;
      state.modalWeatherMode = 'sunny';

      const driveTime = getRouteDriveTime(route);
      const costObj = calculateRouteCost(route);

      byId('modal-region-badge').textContent = route.regionLabel;
      byId('modal-drive-badge').textContent = `模式${state.departureMode}单程约 ${driveTime} 分钟 (${route.distanceKm}km)`;
      byId('modal-combo-badge').textContent = route.comboType;
      byId('modal-title').textContent = route.name;

      byId('modal-radar-container').innerHTML = generateRadarSVG([route.metrics], [route.shortName], ['#527766']);
      byId('modal-parking-info').textContent = route.parkingPinpoint;
      byId('modal-nursing-info').textContent = route.nursingPinpoint;

      setModalWeather('sunny');

      // Render Friday, Saturday, Sunday Dual-Kid Timeline
      const dayConfigs = [
        { key: 'fri', label: 'DAY 1 · 周五下午错峰启程与入住 (Friday 15:30 - 20:30)', badge: '黄金错峰日' },
        { key: 'sat', label: 'DAY 2 · 周六全天：上午自然放电 + 午睡充电 + 下午人文慢游 (Saturday)', badge: '双轨核心日' },
        { key: 'sun', label: 'DAY 3 · 周日半日探索 + 15:00前黄金窗口返程 (Sunday)', badge: '轻松返深日' }
      ];

      byId('modal-timeline-container').innerHTML = dayConfigs.map(day => {
        const items = route.schedule[day.key] || [];
        return `
          <div class="bg-parchment/50 rounded-2xl border border-sandBorder overflow-hidden">
            <div class="bg-tealDeep/10 px-4 py-2.5 border-b border-sandBorder flex items-center justify-between">
              <span class="font-serif font-bold text-sm text-tealDeep">${day.label}</span>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-tealDeep text-cream">${day.badge}</span>
            </div>
            <div class="p-4 space-y-4">
              ${items.map(slot => `
                <div class="relative pl-5 border-l-2 border-tealDeep/40 space-y-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-terracotta absolute -left-[6px] top-1.5"></div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-ink text-cream">${slot.time}</span>
                    <h4 class="font-serif font-bold text-sm text-ink">${slot.title}</h4>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div class="bg-cream p-2.5 rounded-xl border border-sandBorder text-xs">
                      <span class="font-bold text-tealDeep block mb-0.5">👦 3.5岁大宝节奏：</span>
                      <span class="text-ink">${slot.toddler}</span>
                    </div>
                    <div class="bg-cream p-2.5 rounded-xl border border-sandBorder text-xs">
                      <span class="font-bold text-terracotta block mb-0.5">👶 8月龄二宝作息：</span>
                      <span class="text-ink">${slot.infant}</span>
                    </div>
                  </div>
                  <div class="text-[11px] text-inkMuted bg-cream/70 px-3 py-1.5 rounded-lg border border-sandBorder/70">
                    💡 <strong>避坑执行提示：</strong>${slot.note}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');

      byId('modal-total-cost').textContent = `¥${costObj.total.toLocaleString()}`;
      byId('modal-cost-detail').textContent = `(2晚住宿 ¥${costObj.hotelCost} · 餐饮 ¥${costObj.diningCost} · 门票 ¥${costObj.ticketCost} · 路电 ¥${costObj.tollAndEv})`;

      showModal('detail-modal');
    }

    function setModalWeather(mode) {
      state.modalWeatherMode = mode;
      const route = routesData.find(r => r.id === state.activeModalRouteId);
      if (!route) return;

      const btnSunny = byId('btn-weather-sunny');
      const btnRainy = byId('btn-weather-rainy');
      const textEl = byId('modal-weather-text');

      if (mode === 'sunny') {
        btnSunny.className = 'px-2.5 py-1 bg-tealDeep text-cream transition';
        btnRainy.className = 'px-2.5 py-1 bg-parchment text-ink hover:bg-sandBorder/50 transition';
        textEl.textContent = route.weatherSunny;
      } else {
        btnRainy.className = 'px-2.5 py-1 bg-terracotta text-cream transition';
        btnSunny.className = 'px-2.5 py-1 bg-parchment text-ink hover:bg-sandBorder/50 transition';
        textEl.textContent = route.weatherRainy;
      }
    }

    function closeDetailModal() {
      hideModal('detail-modal');
    }

    // =========================================================================
    // 10. ROUTE COMPARISON SYSTEM (Up to 3 Routes)
    // =========================================================================
    function toggleCompare(routeId) {
      const idx = state.compareList.indexOf(routeId);
      if (idx > -1) {
        state.compareList.splice(idx, 1);
      } else {
        if (state.compareList.length >= 3) {
          state.compareList.shift(); // Keep latest 3 smoothly without intrusive popups
        }
        state.compareList.push(routeId);
      }
      updateCompareDock();
      renderRoutes();
    }

    function clearCompare() {
      state.compareList = [];
      updateCompareDock();
      renderRoutes();
    }

    function updateCompareDock() {
      const dock = byId('compare-dock');
      const countEl = byId('compare-count');
      const pillsEl = byId('compare-pills');

      countEl.textContent = state.compareList.length;

      if (state.compareList.length === 0) {
        dock.classList.add('translate-y-full');
        return;
      }

      dock.classList.remove('translate-y-full');
      pillsEl.innerHTML = state.compareList.map(id => {
        const r = routesData.find(item => item.id === id);
        return `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-white/15 text-cream border border-white/20">
            <span>${r.shortName}</span>
            <button data-action="toggleCompare" data-event="click" data-arg1="${r.id}" data-type1="string" class="hover:text-terracotta font-bold">×</button>
          </span>
        `;
      }).join('');
    }

    function openCompareModal() {
      if (state.compareList.length === 0) return;

      const selectedRoutes = state.compareList.map(id => routesData.find(r => r.id === id));
      const colors = ['#527766', '#D97757', '#799886'];

      const radarSvg = generateRadarSVG(
        selectedRoutes.map(r => r.metrics),
        selectedRoutes.map(r => r.shortName),
        colors
      );

      const body = byId('compare-modal-body');
      body.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-parchment/60 p-4 rounded-2xl border border-sandBorder">
          <div class="lg:col-span-5 flex flex-col items-center">
            <div class="w-64 h-64">${radarSvg}</div>
            <div class="flex flex-wrap justify-center gap-3 mt-2">
              ${selectedRoutes.map((r, i) => `
                <span class="inline-flex items-center gap-1.5 text-xs font-bold" style="color:${colors[i]}">
                  <span class="w-3 h-3 rounded-full inline-block" style="background:${colors[i]}"></span>
                  ${r.shortName}
                </span>
              `).join('')}
            </div>
          </div>
          <div class="lg:col-span-7 overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b-2 border-tealDeep text-tealDeep font-serif">
                  <th class="py-2.5 pr-3">对比维度</th>
                  ${selectedRoutes.map((r, i) => `<th class="py-2.5 px-3 font-bold" style="color:${colors[i]}">${r.shortName}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-sandBorder">
                <tr>
                  <td class="py-2.5 pr-3 font-bold text-inkMuted">当前模式单程耗时</td>
                  ${selectedRoutes.map(r => `<td class="py-2.5 px-3 font-mono font-bold">${getRouteDriveTime(r)} 分钟 (${r.distanceKm}km)</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-2.5 pr-3 font-bold text-inkMuted">双娃综合评分</td>
                  ${selectedRoutes.map(r => `<td class="py-2.5 px-3 font-mono font-bold text-terracotta">${getDynamicScore(r)} 分</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-2.5 pr-3 font-bold text-inkMuted">推车无障碍 / 母婴室</td>
                  ${selectedRoutes.map(r => `<td class="py-2.5 px-3 font-mono">推车 ${r.metrics.stroller} / 母婴室 ${r.metrics.nursing}</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-2.5 pr-3 font-bold text-inkMuted">3.5Y趣味 / 8M舒适</td>
                  ${selectedRoutes.map(r => `<td class="py-2.5 px-3 font-mono">大宝 ${r.metrics.toddler} / 二宝 ${r.metrics.infant}</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-2.5 pr-3 font-bold text-inkMuted">3天2晚总预算</td>
                  ${selectedRoutes.map(r => `<td class="py-2.5 px-3 font-mono font-bold text-tealDeep">¥${calculateRouteCost(r).total.toLocaleString()}</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-2.5 pr-3 font-bold text-inkMuted">核心公园 + 博物馆</td>
                  ${selectedRoutes.map(r => `<td class="py-2.5 px-3 leading-relaxed">${r.parks}<br/><span class="text-terracotta">${r.museums}</span></td>`).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;

      showModal('compare-modal');
    }

    function closeCompareModal() {
      hideModal('compare-modal');
    }

    // =========================================================================
    // 11. DUAL-KID TRUNK GEAR CHECKLIST (LocalStorage Persistent)
    // =========================================================================
    const STORAGE_KEY = 'sz_buji_bantian_dualkid_gear_v1';

    function loadChecklistState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          state.checkedGear = JSON.parse(saved);
        }
      } catch (e) {
        state.checkedGear = {};
      }
    }

    function saveChecklistState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.checkedGear));
      } catch (e) {}
    }

    function toggleGearItem(itemId) {
      state.checkedGear[itemId] = !state.checkedGear[itemId];
      saveChecklistState();
      renderChecklist();
    }

    function setPackingMode(mode) {
      state.packingMode = mode;
      const btnLight = byId('btn-pack-light');
      const btnFull = byId('btn-pack-full');

      if (mode === 'light') {
        btnLight.className = 'px-3 py-2 rounded-lg text-xs font-medium bg-tealDeep text-cream transition';
        btnFull.className = 'px-3 py-2 rounded-lg text-xs font-medium bg-parchment hover:bg-sandBorder/60 text-ink border border-sandBorder transition';
      } else {
        btnFull.className = 'px-3 py-2 rounded-lg text-xs font-medium bg-tealDeep text-cream transition';
        btnLight.className = 'px-3 py-2 rounded-lg text-xs font-medium bg-parchment hover:bg-sandBorder/60 text-ink border border-sandBorder transition';
      }
      renderChecklist();
    }

    function checkAllGear(status) {
      gearCategories.forEach(cat => {
        cat.items.forEach(item => {
          if (state.packingMode === 'light' && !item.essential) return;
          state.checkedGear[item.id] = status;
        });
      });
      saveChecklistState();
      renderChecklist();
    }

    function renderChecklist() {
      const container = byId('checklist-grid');
      let totalActiveItems = 0;
      let totalCheckedItems = 0;

      container.innerHTML = gearCategories.map(cat => {
        const visibleItems = state.packingMode === 'light'
          ? cat.items.filter(i => i.essential)
          : cat.items;

        const catChecked = visibleItems.filter(i => state.checkedGear[i.id]).length;
        const catTotal = visibleItems.length;
        const catPct = catTotal > 0 ? Math.round((catChecked / catTotal) * 100) : 0;

        totalActiveItems += catTotal;
        totalCheckedItems += catChecked;

        return `
          <div class="bg-parchment/60 rounded-2xl border border-sandBorder p-4 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded text-xs font-serif font-bold ${cat.badgeColor}">${cat.title}</span>
                <span class="font-mono text-xs font-bold text-tealDeep">${catChecked}/${catTotal}</span>
              </div>
              <p class="text-[11px] text-inkMuted">${cat.subtitle}</p>
              <!-- Category Progress Bar -->
              <div class="w-full h-1.5 bg-sandBorder rounded-full overflow-hidden">
                <div class="bg-tealDeep h-full transition-all duration-300" style="width: ${catPct}%"></div>
              </div>

              <!-- Items List -->
              <div class="pt-2 space-y-2">
                ${visibleItems.map(item => {
                  const isChecked = !!state.checkedGear[item.id];
                  return `
                    <label class="flex items-start gap-2.5 p-2 rounded-xl bg-cream border border-sandBorder/80 hover:border-tealDeep cursor-pointer transition select-none">
                      <input type="checkbox" class="sr-only custom-checkbox" ${isChecked ? 'checked' : ''} data-action="toggleGearItem" data-event="change" data-arg1="${item.id}" data-type1="string"/>
                      <div class="w-4 h-4 mt-0.5 rounded border border-sandDark flex items-center justify-center shrink-0 transition">
                        <svg class="w-3 h-3 text-cream hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <div class="text-xs leading-snug">
                        <div class="font-bold ${isChecked ? 'line-through text-inkMuted' : 'text-ink'}">
                          ${item.name}
                          ${item.essential ? '<span class="text-[10px] font-mono text-terracotta ml-1">[必带]</span>' : ''}
                        </div>
                        <div class="text-[11px] text-inkMuted mt-0.5">${item.desc}</div>
                      </div>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
      }).join('');

      const overallPct = totalActiveItems > 0 ? Math.round((totalCheckedItems / totalActiveItems) * 100) : 0;
      byId('checklist-total-text').textContent = `${totalCheckedItems} / ${totalActiveItems} 项 (${overallPct}%)`;
      byId('nav-checklist-badge').textContent = `${overallPct}%`;

      const ring = byId('checklist-progress-ring');
      const circumference = 94.2;
      const offset = circumference - (overallPct / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    }

    // =========================================================================
    // 12. INITIALIZE ON WINDOW LOAD
    // =========================================================================
    function init() {
      loadChecklistState();
      updateSandboxAverage();
      renderRoutes();
      renderChecklist();
      bindActions();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
    else init();

})();
