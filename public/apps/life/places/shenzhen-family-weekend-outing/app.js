/* 附件原始点位、路书与预算规则；仅隔离 DOM 查询和按钮事件。 */
(() => {
 const root=document.getElementById('outing-app');
 if(!root) return;
 const byId=id=>root.querySelector('#'+id);

  let returnFocus=null, previousOverflow='';
  function readGear() {
    try {const ids=JSON.parse(localStorage.getItem('sz_dual_kid_gear') || '[]');return new Set(Array.isArray(ids)?ids:[]);}
    catch {return new Set();}
  }
  function saveGear(ids) {try {localStorage.setItem('sz_dual_kid_gear',JSON.stringify(ids));} catch {}}
  function showDialog() {
    const modal=byId('detailModal'), content=byId('modalBodyContent');
    returnFocus=document.activeElement;previousOverflow=document.body.style.overflow;
    content.querySelector('h2')?.setAttribute('id','ot-modal-title');
    modal.classList.add('open');document.body.style.overflow='hidden';content.scrollTop=0;
    (content.querySelector('button') || modal).focus();
  }
  function hideDialog() {
    byId('detailModal').classList.remove('open');document.body.style.overflow=previousOverflow;
    if(returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
  }
  function syncButtons() {
    root.querySelectorAll('.p-tab,.depart-btn,.d-tab,button.chip').forEach(el=>el.setAttribute('aria-pressed',String(el.classList.contains('active'))));
  }
  function bindActions() {
    const actions={addToPlan,clearCustomPlan,closeModal,openCrossModal,openCustomPlanModal,openPackModal,openSpotModal,removeFromPlan,renderMainContent,resetFilters,selectCategory,selectDistrict,selectMaxDrive,selectSubarea,setDepartMode,switchPerspective,toggleGearItem,toggleNeed,updateBudgetAndRender};
    function handle(event) {
      if(event.type==='click' && event.target===byId('detailModal')) {closeModal();return;}
      const el=event.target.closest('[data-action]');
      if(!el || !root.contains(el) || el.dataset.event!==event.type) return;
      const action=actions[el.dataset.action];if(!action) return;
      const args=[];
      for(let i=1;el.hasAttribute('data-type'+i);i++) {
        const type=el.dataset['type'+i], value=el.dataset['arg'+i];
        args.push(type==='number'?Number(value):type==='boolean'?value==='true':type==='value'?el.value:value);
      }
      action(...args);syncButtons();
    }
    ['click','change','input'].forEach(event=>root.addEventListener(event,handle));
    document.addEventListener('keydown',event=>{
      const modal=byId('detailModal');if(!modal.classList.contains('open')) return;
      if(event.key==='Escape') {event.preventDefault();closeModal();return;}
      if(event.key!=='Tab') return;
      const items=Array.from(modal.querySelectorAll('button,a[href],input,select,[tabindex="0"]')).filter(el=>el.getClientRects().length);
      const first=items[0],last=items.at(-1);
      if(!first) {event.preventDefault();modal.focus();return;}
      if(event.shiftKey && (document.activeElement===first || !modal.contains(document.activeElement))) {event.preventDefault();last.focus();}
      else if(!event.shiftKey && (document.activeElement===last || !modal.contains(document.activeElement))) {event.preventDefault();first.focus();}
    });
  }

    /********************************************************************
     * 1. 全量数据库：深圳本地10大行政区32个细分点位 + 6条本地打包线 + 6条跨城微度假
     ********************************************************************/
    const DISTRICT_META = [
      { id: 'ALL', name: '深圳全区总览', subareas: [] },
      { id: '龙岗区', name: '龙岗区 (15-30m)', subareas: ['布吉/坂田/平湖圈', '大运/龙城中心圈'] },
      { id: '罗湖区', name: '罗湖区 (15-25m)', subareas: ['翠竹/洪湖圈', '仙湖/东湖/梧桐山圈'] },
      { id: '福田区', name: '福田区 (20-30m)', subareas: ['中心区/莲花山圈', '香蜜湖/农科圈', '红树林/深圳湾圈'] },
      { id: '龙华区', name: '龙华区 (20-35m)', subareas: ['红山/北站圈', '观澜/石凹水库圈'] },
      { id: '盐田区', name: '盐田区 (30-40m)', subareas: ['沙头角/海山圈', '梅沙/云海森林圈'] },
      { id: '南山区', name: '南山区 (30-45m)', subareas: ['华侨城圈', '后海/深圳湾圈', '西丽湖/大沙河圈', '蛇口/前海圈'] },
      { id: '光明区', name: '光明区 (35-45m)', subareas: ['光明科学城圈', '公明/光明湖圈'] },
      { id: '坪山区', name: '坪山区 (35-45m)', subareas: ['坪山中心圈', '马峦山/聚龙山/燕子湖圈'] },
      { id: '宝安区', name: '宝安区 (40-50m)', subareas: ['宝中/前海湾圈', '福永/立新湖圈', '石岩湖圈'] },
      { id: '大鹏新区', name: '大鹏新区 (50-70m)', subareas: ['坝光银叶树圈', '大鹏所城/金沙湾圈'] }
    ];

    const LOCAL_SPOTS = [
      // ==================== 龙岗区 ====================
      {
        id: 'lg-1',
        name: '坂田雪象体育公园（环湖栈道+儿童沙池）',
        district: '龙岗区',
        subarea: '布吉/坂田/平湖圈',
        category: '滨海/环湖栈道',
        score: 9.5,
        driveA: 10, // 坂田出发
        driveB: 18, // 布吉出发
        routeA: '坂田街道内直达（雪岗北路）',
        routeB: '布吉走布澜路→坂李大道直达',
        parking: '公园1号/2号停车场（美丽深圳预约，充电桩充足，车位宽）',
        nursing: '游客服务中心独立母婴室（恒温水+护理台）',
        strollerScore: 9.8,
        energyScore: 9.4,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: false,
        reserveTip: '周末需提前在「美丽深圳」预约停车位',
        ticketCost: 0,
        kid35: '超大无动力攀爬网、白沙池挖沙、阳光草坪踢球骑平衡车',
        kid08: '3.2公里全平缓水上环湖栈道+树荫廊架，推车哄睡零颠簸',
        planB: '遇雨或暴晒5分钟车程转场【坂田万科广场】（2.7万㎡森林中庭+奈尔宝+五星母婴室）',
        radar: [98, 92, 95, 96, 85, 95] // 推车丝滑, 母婴设施, 3.5岁放电, 停车便利, 遮阳恒温, 性价比
      },
      {
        id: 'lg-2',
        name: '甘坑古镇湿地与都市田园栈道',
        district: '龙岗区',
        subarea: '布吉/坂田/平湖圈',
        category: '红树林/河湖湿地',
        score: 9.1,
        driveA: 14,
        driveB: 15,
        routeA: '坂李大道→甘李路',
        routeB: '布澜路→甘李路',
        parking: '甘坑北门立体停车场/都市田园停车场（早9:30前到极空）',
        nursing: '甘坑游客中心标准母婴室',
        strollerScore: 8.8,
        energyScore: 9.2,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '古镇及外围湿地栈道免预约，小凉帽农场需现场购票',
        ticketCost: 0,
        kid35: '喂水鸭、看竹林水车、二十四史书院外围湿地木栈道寻宝',
        kid08: '建议避开主街中午人流，直接去北侧甘坑湿地公园环湖平缓步道推车',
        planB: '转场【万达广场（龙岗平湖店）】室内恒温溜娃',
        radar: [88, 86, 92, 88, 82, 92]
      },
      {
        id: 'lg-3',
        name: '大运公园（神仙岭水库湖泊+叠溪谷栈道）',
        district: '龙岗区',
        subarea: '大运/龙城中心圈',
        category: '森林湖泊/山水',
        score: 9.6,
        driveA: 26,
        driveB: 22,
        routeA: '水官高速→盐龙大道（全程免费）',
        routeB: '丹平快速→水官高速→龙翔大道',
        parking: '大运公园神仙岭停车场 / 大运天地地下停车场（带超充）',
        nursing: '紧邻大运天地商业区高配母婴室（温奶器/饮水机齐备）',
        strollerScore: 9.7,
        energyScore: 9.6,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '无需预约，大运天地与公园无缝连通，黑天鹅湖就在商场旁',
        ticketCost: 0,
        kid35: '8公里环神仙岭水库森林绿道骑行、大运天地看黑天鹅与梅花鹿',
        kid08: '森林氧吧树荫浓密，玩累直接推车进大运天地吹空调喝奶午睡',
        planB: '直接进入旁边的【大运天地】或5分钟到【龙岗红立方科技馆】',
        radar: [97, 96, 96, 95, 92, 98]
      },
      {
        id: 'lg-4',
        name: '深圳·红立方（龙岗科技馆+青少年宫）',
        district: '龙岗区',
        subarea: '大运/龙城中心圈',
        category: '博物馆/科技馆',
        score: 9.7,
        driveA: 28,
        driveB: 24,
        routeA: '水官高速→龙翔大道',
        routeB: '水官高速→龙城大道',
        parking: '红立方地下停车场或旁边万科广场/世贸百货地下车库',
        nursing: '馆内每层设母婴室，旁侧龙城万科广场有五星级母婴中心',
        strollerScore: 9.9,
        energyScore: 9.8,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: false,
        reserveTip: '⚠️ 必抢！需提前7天凌晨0点在「深圳红立方」公众号免费预约门票',
        ticketCost: 0,
        kid35: 'B1层「寰宇之梦」与1-3层科学互动装置（小球王国、水力互动、机械迷城），3.5岁能玩3小时不走',
        kid08: '全馆垂直电梯宽敞、恒温25℃、声光温和区适合推车观察',
        planB: '本就是顶级室内恒温场馆，风雨无阻',
        radar: [99, 96, 98, 90, 100, 99]
      },
      {
        id: 'lg-5',
        name: '龙岗儿童公园（森林山谷摩天轮+无动力乐园）',
        district: '龙岗区',
        subarea: '大运/龙城中心圈',
        category: '儿童专类乐园',
        score: 9.3,
        driveA: 28,
        driveB: 25,
        routeA: '水官高速→盐龙大道辅路',
        routeB: '丹平快速→水官高速→盐龙大道',
        parking: '龙岗儿童公园地下停车场（需提前预约车位）',
        nursing: '园区客服中心及森林家庭中心配有大型母婴室',
        strollerScore: 9.2,
        energyScore: 9.9,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: false,
        noReserve: false,
        reserveTip: '入园免费免预约，但自驾停车位必须在「龙岗儿童公园」小程序提前预约',
        ticketCost: 0,
        kid35: '湾区最高海拔星空摩天轮、超大免费无动力森林攀爬部落、水动力沙池',
        kid08: '山谷环线设无障碍电梯与缓坡步道，二宝可一起坐恒温摩天轮轿厢',
        planB: '转场10分钟车程的【龙城万科里/红立方】',
        radar: [92, 94, 99, 82, 84, 95]
      },

      // ==================== 罗湖区 ====================
      {
        id: 'lh-1',
        name: '洪湖公园（百亩荷塘湿地水上栈道+儿童沙池）',
        district: '罗湖区',
        subarea: '翠竹/洪湖圈',
        category: '红树林/河湖湿地',
        score: 9.4,
        driveA: 22,
        driveB: 14,
        routeA: '清平高速→泥岗东路→文锦北路',
        routeB: '布吉路→文锦北路直达（距布吉仅5公里）',
        parking: '洪湖公园东门/西门停车场（美丽深圳预约，或停旁边KK TIME商场）',
        nursing: '公园自然教育中心母婴室 + 隔壁KK TIME商场五星母婴室',
        strollerScore: 9.6,
        energyScore: 9.2,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '强烈建议直接导航停【KK TIME京基百纳时光】地下车库，吃完饭过天桥/连廊直入公园',
        ticketCost: 0,
        kid35: '湖心岛落羽杉木栈道看白鹭水鸟、南区大树下儿童游乐沙池',
        kid08: '全园湖畔步道平坦宽阔，大榕树遮阴率超80%，推车极度舒适',
        planB: '无缝步行进入隔壁【KK TIME商场】室内吹空调、用餐、逛玩具反斗城',
        radar: [96, 95, 92, 94, 88, 97]
      },
      {
        id: 'lh-2',
        name: '淘金山绿道（翠荫驿站环深圳水库山水栈道）',
        district: '罗湖区',
        subarea: '翠竹/洪湖圈',
        category: '滨海/环湖栈道',
        score: 9.3,
        driveA: 24,
        driveB: 16,
        routeA: '丹平快速→布心路→翠荫路',
        routeB: '丹平快速九尾岭隧道出口即达',
        parking: '翠荫驿站停车场（需美丽深圳预约）或周边小区商业车场',
        nursing: '翠荫驿站及童趣园驿站配有基础母婴护理间',
        strollerScore: 9.4,
        energyScore: 9.3,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: false,
        noReserve: true,
        reserveTip: '绿道免预约，推荐走「翠荫驿站→童趣园」精华平缓段（往返约3km）',
        ticketCost: 0,
        kid35: '专门设有「童趣园」沙坑与攀爬滑梯，俯瞰深圳水库与梧桐山倒影',
        kid08: '全柏油路面无台阶，山风凉爽，林木茂密不晒',
        planB: '8分钟车程转场【罗湖天河城（金啤坊）】',
        radar: [94, 85, 93, 82, 90, 96]
      },
      {
        id: 'lh-3',
        name: '仙湖植物园 + 深圳古生物博物馆（天上人间湖泊）',
        district: '罗湖区',
        subarea: '仙湖/东湖/梧桐山圈',
        category: '森林湖泊/山水',
        score: 9.6,
        driveA: 26,
        driveB: 18,
        routeA: '清平高速→布心路→罗沙路→仙湖路',
        routeB: '丹平快速→罗沙路→仙湖路',
        parking: '仙湖植物园立体停车库（周末必提前在公众号抢车位！）',
        nursing: '大门游客中心、天上人间驿站均设标准母婴室',
        strollerScore: 9.1,
        energyScore: 9.7,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: false,
        noReserve: false,
        reserveTip: '⚠️ 周末自驾必须提前在「深圳市仙湖植物园」公众号预约立体车库车位+购票（成人¥15，儿童免费）。进园后直接坐大巴（¥3）上天上人间，省去爬坡！',
        ticketCost: 30,
        kid35: '深圳古生物博物馆看霸王龙化石、天上人间大草坪奔跑、仙人掌温室迷宫、化石森林',
        kid08: '乘坐接驳大巴折叠推车直达湖区，环仙湖栈道平坦凉爽，温室与古生物馆室内可避暑',
        planB: '古生物博物馆+阴生植物区，或下山去【莲塘盒马鲜生/岁宝邻里】',
        radar: [91, 92, 97, 78, 90, 94]
      },

      // ==================== 福田区 ====================
      {
        id: 'ft-1',
        name: '深圳博物馆（金田路历史民俗馆）+ 当代艺术与城市规划馆',
        district: '福田区',
        subarea: '中心区/莲花山圈',
        category: '博物馆/科技馆',
        score: 9.8,
        driveA: 22,
        driveB: 25,
        routeA: '坂银通道→北环大道→彩田路（出坂银即达！）',
        routeB: '清平高速→泥岗路→彩田路',
        parking: '市民中心地下停车场 / 当代艺术馆停车场 / 领展中心城车库（超充极多）',
        nursing: '深博与两馆内均设五星级母婴室（带独立哺乳隔间、温奶器）',
        strollerScore: 10.0,
        energyScore: 9.4,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '深圳博物馆目前已免预约直接刷身份证入场；两馆可在公众号随约随进',
        ticketCost: 0,
        kid35: '深博一楼野生动物标本展（长颈鹿、非洲狮、北极熊、鲸鱼骨骼）是3.5岁娃最爱；两馆看未来深圳沙盘与巨型飞艇模型',
        kid08: '全程室内25℃恒温、超大无障碍电梯、推车畅行无阻，二宝随时可安静睡大觉',
        planB: '地下连廊直通【深业上城/领展中心城/皇庭广场】用餐休息',
        radar: [100, 99, 94, 96, 100, 100]
      },
      {
        id: 'ft-2',
        name: '笔架山体育公园 + 莲花山幸福廊桥空中栈道',
        district: '福田区',
        subarea: '中心区/莲花山圈',
        category: '城市/森林公园',
        score: 9.7,
        driveA: 18,
        driveB: 22,
        routeA: '坂银通道南出口出来3分钟即到！（距坂田最近的核心大公园）',
        routeB: '丹平/清平→北环→皇岗路',
        parking: '深业上城地下停车场（强烈推荐！车位3000+，停好直接走空中廊桥进笔架山或莲花山）',
        nursing: '深业上城L2/L3五星母婴室 + 笔架山游客中心母婴室',
        strollerScore: 9.8,
        energyScore: 9.7,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '停深业上城免预约，3楼小镇东侧直接走无障碍空中幸福廊桥进两个公园',
        ticketCost: 0,
        kid35: '笔架山超大沙池与平衡车泵道、福田河戏水浅滩、莲花山风筝草坪放风筝',
        kid08: '1.2公里空中廊桥100%无台阶，树冠层微风习习，随时推回深业上城吹空调喂奶',
        planB: '无缝退回【深业上城】室内逛蒙特梭利亲子空间与绘本馆',
        radar: [98, 99, 97, 98, 94, 99]
      },
      {
        id: 'ft-3',
        name: '香蜜公园（荔枝林空中栈道+玫瑰园+三座儿童乐园）',
        district: '福田区',
        subarea: '香蜜湖/农科圈',
        category: '滨海/环湖栈道',
        score: 9.6,
        driveA: 25,
        driveB: 28,
        routeA: '坂银通道→北环大道→香蜜湖路',
        routeB: '清平高速→北环大道→香蜜湖路',
        parking: '印力中心（山姆会员店）地下停车场（过天桥有垂直电梯直达香蜜公园）',
        nursing: '香蜜公园自然书吧母婴室 + 印力中心五星母婴室',
        strollerScore: 9.7,
        energyScore: 9.6,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '公园自身车位少，直接停【深国投广场/印力中心】，顺便山姆采购宝宝辅食牛奶',
        ticketCost: 0,
        kid35: '荔枝树冠空中栈道穿梭、蝴蝶滑梯、沙池与绳索攀爬三大儿童游乐区、花蜜湖看天鹅',
        kid08: '空中栈道全程坡道无台阶，荔枝林浓荫蔽日，推车极其顺滑',
        planB: '过天桥回【印力中心】逛山姆或室内用餐',
        radar: [97, 95, 96, 94, 88, 98]
      },
      {
        id: 'ft-4',
        name: '福田红树林生态公园（科普展馆+观鸟湿地栈道）',
        district: '福田区',
        subarea: '红树林/深圳湾圈',
        category: '红树林/河湖湿地',
        score: 9.5,
        driveA: 26,
        driveB: 28,
        routeA: '坂银通道→北环→新洲路到底',
        routeB: '清平→滨河大道→新洲路',
        parking: '公园配套停车场（美丽深圳预约）或旁边绿景佐阾红树林购物中心',
        nursing: '科普展馆内配有温馨母婴室',
        strollerScore: 9.6,
        energyScore: 9.3,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '注意区分：导航「福田红树林生态公园」（新洲路南端），人比深圳湾海滨栈道少一半且有室内科普馆！',
        ticketCost: 0,
        kid35: '室内红树林科普互动馆看弹涂鱼和招潮蟹、户外湿地栈道用望远镜看黑脸琵鹭、沙坑区',
        kid08: '室内馆+平缓湿地木栈道组合，海风习习且不嘈杂',
        planB: '园内红树林科普展馆 + 隔壁佐阾商场',
        radar: [96, 92, 93, 91, 90, 97]
      },

      // ==================== 龙华区 ====================
      {
        id: 'lhua-1',
        name: '深圳美术馆新馆 + 深圳图书馆北馆 + 北站中心公园云顶栈道',
        district: '龙华区',
        subarea: '红山/北站圈',
        category: '博物馆/科技馆',
        score: 9.6,
        driveA: 16,
        driveB: 25,
        routeA: '坂田五和大道→布龙路→腾龙路（坂田过去仅15分钟！）',
        routeB: '机荷高速/布龙路→民治大道→腾龙路',
        parking: '两馆地下停车场（车位宽敞）或红山6979商业中心地下车库',
        nursing: '美术馆与图书馆一楼均设高标准母婴室，红山6979配有豪华母婴中心',
        strollerScore: 9.9,
        energyScore: 9.1,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '两馆免预约直接入场（图书馆少儿服务区非常适合3.5岁翻立体绘本）',
        ticketCost: 0,
        kid35: '图书馆北馆一楼少儿绘本馆、北站中心公园看复兴号高铁飞驰+星球乐园滑梯',
        kid08: '美术馆新馆建筑空间挑高极度安静、全无障碍电梯、推车逛展审美启蒙两不误',
        planB: '过马路即达【红山6979】与【龙华天虹购物中心】',
        radar: [99, 97, 91, 96, 98, 98]
      },
      {
        id: 'lhua-2',
        name: '观澜中国版画博物馆 + 版画村油菜花/水田湿地 + 石凹水库碧道',
        district: '龙华区',
        subarea: '观澜/石凹水库圈',
        category: '红树林/河湖湿地',
        score: 9.2,
        driveA: 25,
        driveB: 32,
        routeA: '珠三角环线高速(G94)坂田入口→观澜出口（全程高速极快）',
        routeB: '清平高速→机荷高速→梅观高速',
        parking: '中国版画博物馆地面/地下停车场或版画村1号停车场',
        nursing: '版画博物馆及版画村游客中心均设母婴室',
        strollerScore: 9.3,
        energyScore: 9.2,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '版画博物馆与版画村目前均免预约免费入园',
        ticketCost: 0,
        kid35: '版画村看客家碉楼、水田花海木栈道、草莓采摘；版画博物馆看儿童版画互动展',
        kid08: '先逛恒温版画博物馆，傍晚推车走版画村外围平坦水田栈道',
        planB: '中国版画博物馆室内展厅 + 10分钟到【观澜湖新城MH MALL】（含冰场与室内乐园）',
        radar: [93, 90, 92, 95, 89, 95]
      },

      // ==================== 盐田区 ====================
      {
        id: 'yt-1',
        name: '盐田海滨栈道（海山段灯塔图书馆+中央公园大草坪）',
        district: '盐田区',
        subarea: '沙头角/海山圈',
        category: '滨海/环湖栈道',
        score: 9.7,
        driveA: 34,
        driveB: 26,
        routeA: '水官高速→盐排高速→深盐路（全程无红绿灯）',
        routeB: '丹平快速→罗沙路→东部沿海高速海山出口',
        parking: '盐田壹海城ONE MALL地下停车场（停好车步行150米即上海滨栈道！）',
        nursing: '壹海城商场母婴室 + 灯塔图书馆旁公用无障碍卫生间',
        strollerScore: 9.9,
        energyScore: 9.5,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '不进梅沙片区，因此即使5-10月旺季也【完全不需要大鹏/梅沙车辆通行预约】！',
        ticketCost: 0,
        kid35: '零距离看巨型远洋集装箱轮船、中央公园巨型章鱼雕塑草坪奔跑、灯塔图书馆看海景绘本',
        kid08: '海山段栈道全石板无台阶，海风轻柔，午饭午休无缝退回壹海城商场',
        planB: '紧邻【盐田壹海城】商场，吃饭、吹空调、喂奶一步到位',
        radar: [99, 95, 95, 97, 92, 99]
      },
      {
        id: 'yt-2',
        name: '云海森林服务站 + 三洲田水库高山湖泊草甸',
        district: '盐田区',
        subarea: '梅沙/云海森林圈',
        category: '森林湖泊/山水',
        score: 9.3,
        driveA: 42,
        driveB: 35,
        routeA: '水官高速→盐排高速→北山道→茶溪谷停车场转云海专线',
        routeB: '丹平快速→盐排高速→东部华侨城茶溪谷停车场',
        parking: '自驾停【东部华侨城茶溪谷停车场】，换乘云海专线D巴（8月龄建议折叠轻便推车上大巴）',
        nursing: '云海森林服务站一楼设有洗手间及基础母婴护理台',
        strollerScore: 8.6,
        energyScore: 9.5,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '社会车辆禁入三洲田核心段，在茶溪谷坐接驳专线15分钟直达山顶白色邮轮建筑',
        ticketCost: 30,
        kid35: '360°俯瞰盐田港巨轮与三洲田蓝宝石水库、高山草甸打滚、白色天空之城建筑群',
        kid08: '山顶服务站2-3楼为恒温M Stand咖啡书吧，铺有软垫可让二宝爬行休息',
        planB: '下山去【大梅沙奥特莱斯8号仓】室内用餐游乐',
        radar: [86, 86, 95, 90, 90, 92]
      },
      {
        id: 'yt-3',
        name: '大梅沙海滨公园（内湖湿地栈道+免费细腻白沙滩）',
        district: '盐田区',
        subarea: '梅沙/云海森林圈',
        category: '红树林/河湖湿地',
        score: 9.4,
        driveA: 38,
        driveB: 30,
        routeA: '水官→盐排→盐坝高速大梅沙出口',
        routeB: '丹平→罗沙路→盐坝高速大梅沙出口',
        parking: '大梅沙海滨公园配套车场或旁侧大梅沙京基洲际/奥特莱斯车库',
        nursing: '公园太阳广场游客中心配五星母婴室（还有温水冲淋房）',
        strollerScore: 9.4,
        energyScore: 9.8,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '10月下旬已过旺季限行期，车辆免预约直达；公园现已免预约免费入园',
        ticketCost: 0,
        kid35: '内湖湿地坐天鹅脚踏船、看黑天鹅、海边挖沙踏浪、海滨西栈道看海浪拍岸',
        kid08: '内湖木栈道平缓无沙，二宝推车在内湖树荫下散步，大宝在前面沙滩挖沙',
        planB: '马路对面即【大梅沙8号仓奥特莱斯】与栖息图书馆',
        radar: [94, 95, 98, 92, 85, 96]
      },

      // ==================== 南山区 ====================
      {
        id: 'ns-1',
        name: '华侨城国家湿地公园 + 欢乐海岸心湖栈道',
        district: '南山区',
        subarea: '华侨城圈',
        category: '红树林/河湖湿地',
        score: 9.7,
        driveA: 28,
        driveB: 32,
        routeA: '坂银通道→北环大道→侨城东路',
        routeB: '清平高速→滨河大道→侨城东路',
        parking: '欢乐海岸地下停车场（G区/E区离湿地公园北门及海洋奇梦馆最近，带特斯拉超充）',
        nursing: '欢乐海岸购物中心L1/L2超豪华母婴室（独立哺乳室+尿布台+温水）',
        strollerScore: 9.7,
        energyScore: 9.5,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: false,
        reserveTip: '⚠️ 华侨城湿地是中国唯一都市中心国家级湿地，需提前在「华侨城湿地」公众号免费预约（每日限额，人极少极清幽！）',
        ticketCost: 0,
        kid35: '近距离观察滩涂招潮蟹、弹涂鱼、观鸟屋看苍鹭，出园后在欢乐海岸看水秀或逛海洋奇梦馆',
        kid08: '因为严格限流，湿地内完全没有飞驰自行车，5公里平坦绿道非常适合8月龄推车安睡',
        planB: '无缝进入隔壁【欢乐海岸海洋奇梦馆】（看水母/海狮表演）及购物中心',
        radar: [97, 98, 95, 96, 94, 98]
      },
      {
        id: 'ns-2',
        name: '深圳湾公园（白鹭坡书吧+人才公园星光栈道+流花山花海）',
        district: '南山区',
        subarea: '后海/深圳湾圈',
        category: '滨海/环湖栈道',
        score: 9.6,
        driveA: 32,
        driveB: 35,
        routeA: '坂银通道→滨海大道→深圳湾公园/人才公园',
        routeB: '清平高速→滨河大道→沙河西路',
        parking: '深圳湾万象城地下车库（无需抢公园车位，走空中天桥带电梯直达人才公园！）',
        nursing: '深圳湾万象城高奢级母婴室 + 白鹭坡书吧母婴间',
        strollerScore: 9.9,
        energyScore: 9.5,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '强烈建议停【深圳湾万象城】或【海岸城】，免去美丽深圳抢位烦恼，推车走无障碍天桥入园',
        ticketCost: 0,
        kid35: '人才公园「嬉乐园」超大沙坑与滑梯、海边看候鸟群飞、春笋大厦下大草坪奔跑',
        kid08: '内湖环湖步道全胶跑道零震感，万象城母婴室体验全市天花板',
        planB: '退回【深圳湾万象城】或10分钟到【南山博物馆】',
        radar: [99, 100, 95, 95, 92, 97]
      },
      {
        id: 'ns-3',
        name: '环西丽湖绿道（问山叠水驿站+白芒河湿地+百旺百亩草坪）',
        district: '南山区',
        subarea: '西丽湖/大沙河圈',
        category: '森林湖泊/山水',
        score: 9.5,
        driveA: 26,
        driveB: 32,
        routeA: '坂田走布龙路→留仙大道→丽水路（不堵车仅25分钟！）',
        routeB: '南坪快速一期→沙河西路→西丽湖路',
        parking: '西丽湖牌坊停车场 / 问山叠水周边停车场 / 西丽生态公园车场',
        nursing: '绿道各大一级驿站均设无障碍母婴卫生间',
        strollerScore: 9.6,
        energyScore: 9.7,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '2025-2026年全线贯通的深圳顶流山水碧道，推荐走「问山叠水—大磡燕栖」段，有溪水浅滩与稻田湿地',
        ticketCost: 0,
        kid35: '问山叠水浅溪踩水捞小鱼、看白鹭与水牛、大草坪滑步车放电',
        kid08: '依山傍水，高架森林栈道平缓无阶梯，空气负氧离子极高',
        planB: '10分钟车程转场【西丽宝能环球汇】或【益田假日里】',
        radar: [96, 90, 97, 92, 88, 97]
      },
      {
        id: 'ns-4',
        name: '蛇口海上世界文化艺术中心 + 滨海文化栈道 + 四海公园',
        district: '南山区',
        subarea: '蛇口/前海圈',
        category: '博物馆/科技馆',
        score: 9.6,
        driveA: 38,
        driveB: 42,
        routeA: '坂银通道→滨海大道→南海大道→望海路',
        routeB: '南坪快速→沙河西路→望海路',
        parking: '海上世界文化艺术中心地下车库 / 海上世界A区车库',
        nursing: '文化艺术中心1-2层设计感母婴室 + 汇港购物中心母婴室',
        strollerScore: 9.8,
        energyScore: 9.4,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '艺术中心公共空间及海滨步道免费免预约；旁边明华轮巨轮夜景绝佳',
        ticketCost: 0,
        kid35: '看明华轮大邮轮、海边草坪滑梯、艺术中心儿童工坊、5分钟车程可去四海公园看湖景黑天鹅',
        kid08: '美术馆室内恒温看海景，出门即是平坦防波堤栈道，推车听海浪极易入睡',
        planB: '艺术中心室内展馆 + 汇港购物中心二期',
        radar: [98, 96, 94, 94, 96, 96]
      },
      {
        id: 'ns-5',
        name: '南山博物馆 + 南头古城微型展馆群 + 中山公园古树草坪',
        district: '南山区',
        subarea: '蛇口/前海圈',
        category: '博物馆/科技馆',
        score: 9.4,
        driveA: 34,
        driveB: 38,
        routeA: '坂银通道→北环大道→南山大道',
        routeB: '清平→北环大道→南山大道',
        parking: '南山文体中心地下停车场（车位极多，就在南山博物馆隔壁）',
        nursing: '南山博物馆一楼服务中心旁设有标准母婴室',
        strollerScore: 9.7,
        energyScore: 9.0,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: false,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '常设展免预约入场，特展水平极高；逛完步行10分钟可去中山公园大草坪放电',
        ticketCost: 0,
        kid35: '看古代战船模型、青铜器与海洋贸易沙盘，下午去隔壁中山公园3万㎡草坪跑跳',
        kid08: '南博电梯宽敞、冷气充足，非常适合午后13:30-16:00最热时段推车避暑',
        planB: '南山博物馆本就是室内核心馆，旁有南山欢乐颂商场',
        radar: [97, 94, 90, 95, 98, 96]
      },

      // ==================== 光明区 ====================
      {
        id: 'gm-1',
        name: '虹桥公园（4公里森林红飘带空中栈道+月在庭湖泊+滑板沙池）',
        district: '光明区',
        subarea: '光明科学城圈',
        category: '滨海/环湖栈道',
        score: 9.6,
        driveA: 32,
        driveB: 38,
        routeA: '坂田直上珠三角环线高速(G94)→光明出口→光侨路（全程高速30分钟！）',
        routeB: '机荷高速→龙大高速→观光路',
        parking: '虹桥公园北广场/南广场地下停车场（车位超1000个，带快充）',
        nursing: '北广场游客中心及月在庭驿站配有空调母婴室',
        strollerScore: 9.8,
        energyScore: 9.6,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '免预约免费入园！推车直接从入口上虹桥，坡度小于5°，全程无一级台阶穿过森林树冠',
        ticketCost: 0,
        kid35: '在红色空中廊桥上奔跑俯瞰森林湖泊、入口处大型儿童沙池与攀爬架放电',
        kid08: '虹桥桥面全塑胶平缓坡道，碧眼水库段视野开阔，推车毫不费力',
        planB: '8分钟车程转场【光明蓝鲸世界/万达广场】或【光明文化艺术中心美术馆】',
        radar: [98, 93, 96, 97, 86, 97]
      },
      {
        id: 'gm-2',
        name: '深圳科技馆（光明新馆·数字文明科学方舟）+ 科学公园',
        district: '光明区',
        subarea: '光明科学城圈',
        category: '博物馆/科技馆',
        score: 9.8,
        driveA: 34,
        driveB: 40,
        routeA: '珠三角环线高速(G94)→龙大高速→光明大道',
        routeB: '机荷→龙大高速楼村出口',
        parking: '科技馆新馆配套地下车库 / 科学公园南翼停车场',
        nursing: '场馆每层配备全新智慧母婴室（自动门、恒温冲奶机、独立哺乳舱）',
        strollerScore: 10.0,
        energyScore: 9.9,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: false,
        reserveTip: '⚠️ 深圳最新地标级科技大馆，需提前在官方小程序预约入场；门前即是光明科学公园北翼儿童友好区',
        ticketCost: 0,
        kid35: '宇宙探索、太空舱体验、儿童科学启蒙专厅、户外科学公园声学与水力学无动力装置',
        kid08: '全新场馆无障碍设计满分，婴儿推车通道宽敞，室内外动静皆宜',
        planB: '全天候恒温巨型室内科技馆，完全不受天气影响',
        radar: [100, 99, 99, 94, 100, 99]
      },
      {
        id: 'gm-3',
        name: '光明湖水利风景区 + 欢乐田园（千亩花海稻田+明湖鹅颈水湿地）',
        district: '光明区',
        subarea: '公明/光明湖圈',
        category: '森林湖泊/山水',
        score: 9.3,
        driveA: 35,
        driveB: 42,
        routeA: 'G94珠三角环线→龙大高速→楼村一号路',
        routeB: '机荷→龙大高速→圳园路',
        parking: '欢乐田园1号/2号生态停车场（车位极多）',
        nursing: '游客服务中心设有母婴室',
        strollerScore: 9.4,
        energyScore: 9.5,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '免门票免预约，园区很大，可租家庭四人遮阳代步车（二宝坐妈妈怀里，3.5岁大宝超爱）',
        ticketCost: 0,
        kid35: '光明湖大坝看浩瀚湖景、欢乐田园坐观光小火车、鹿鸣园喂梅花鹿与羊驼',
        kid08: '租一辆电动遮阳敞篷代步车环田园兜风，免去烈日暴走',
        planB: '去光明招待所吃正宗乳鸽+玉米汁，下午逛【光明文化艺术中心图书馆/美术馆】',
        radar: [94, 88, 95, 96, 84, 94]
      },

      // ==================== 坪山区 ====================
      {
        id: 'ps-1',
        name: '聚龙山生态湿地公园 + 坪山儿童公园（森林溪谷滑梯）',
        district: '坪山区',
        subarea: '马峦山/聚龙山/燕子湖圈',
        category: '红树林/河湖湿地',
        score: 9.6,
        driveA: 38,
        driveB: 32,
        routeA: '水官高速→南坪快速三期（全程免费高速，极少堵车！）',
        routeB: '丹平快速→水官高速→南坪三期→绿梓大道',
        parking: '聚龙山北门/南门停车场（免预约，车位极其充裕！）',
        nursing: '聚龙山游客中心及坪山儿童公园服务站均配标准母婴室',
        strollerScore: 9.7,
        energyScore: 9.6,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '深圳东部宝藏！人少景美免预约，环湖湿地路宽6米以上，3.5岁骑行+8月龄推车天堂',
        ticketCost: 0,
        kid35: '聚龙山环湖湿地看水鸟、捞小蝌蚪，下午开车10分钟去【坪山儿童公园】玩原木攀爬与沙池',
        kid08: '完全避开市区人潮，湖风清凉，推车在樱花谷与落羽杉湿地安睡',
        planB: '10分钟车程转场【坪山文化聚落（美术馆+图书馆+展览馆）】',
        radar: [97, 92, 96, 99, 88, 98]
      },
      {
        id: 'ps-2',
        name: '坪山文化聚落（坪山美术馆+少儿图书馆+中心公园大草坪）',
        district: '坪山区',
        subarea: '坪山中心圈',
        category: '博物馆/科技馆',
        score: 9.5,
        driveA: 36,
        driveB: 30,
        routeA: '水官高速→南坪快速三期→坪山大道',
        routeB: '丹平快速→水官高速→横坪路',
        parking: '坪山文化聚落地下停车场（车位极多，电梯直达各馆与公园）',
        nursing: '坪山图书馆一楼少儿区旁设五星母婴室',
        strollerScore: 9.9,
        energyScore: 9.3,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '美术馆、图书馆、文创体验馆、大剧院与中心公园连成一片，免预约直接进',
        ticketCost: 0,
        kid35: '坪山少儿图书馆看绘本、中心公园湖畔喂锦鲤、玩无动力儿童沙池',
        kid08: '室内馆群与户外草坪无缝切换，推车从地下车库直通各馆0台阶',
        planB: '旁边即是【坪山益田假日世界】商场',
        radar: [99, 96, 93, 98, 98, 98]
      },
      {
        id: 'ps-3',
        name: '金龟自然书房 + 马峦山碧岭瀑布群山水溪谷栈道',
        district: '坪山区',
        subarea: '马峦山/聚龙山/燕子湖圈',
        category: '森林湖泊/山水',
        score: 9.2,
        driveA: 35,
        driveB: 28,
        routeA: '水官高速→南坪快速三期碧岭出口即到！（布吉过去仅28分钟）',
        routeB: '丹平快速→水官高速→南坪三期',
        parking: '马峦山郊野公园西北门（碧岭入口）停车场（需在马峦山小程序预约车位）',
        nursing: '西北门游客中心配有母婴室',
        strollerScore: 8.5,
        energyScore: 9.6,
        zeroStep: false,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: false,
        reserveTip: '碧岭瀑布段前半程1.5公里平缓水泥路可推车，后段有少量台阶建议备腰凳；金龟村自然书房免预约',
        ticketCost: 0,
        kid35: '溪谷浅滩玩水、看叠水瀑布、森林自然博物步道认识植物昆虫',
        kid08: '森林峡谷比市区低3-4℃，负氧离子极高，听到流水声白噪音秒睡',
        planB: '下山10分钟去【坪山燕子湖国际会展中心/坪山中心文化聚落】',
        radar: [85, 88, 96, 92, 92, 95]
      },

      // ==================== 宝安区 ====================
      {
        id: 'ba-1',
        name: '立新湖公园（8.8公里绝美湖上木栈道+简阅书吧）',
        district: '宝安区',
        subarea: '福永/立新湖圈',
        category: '森林湖泊/山水',
        score: 9.6,
        driveA: 42,
        driveB: 48,
        routeA: '坂田上机荷高速→鹤洲立交→京港澳高速→福永大道',
        routeB: '清平→机荷高速→福永出口',
        parking: '立新湖公园东门/北门停车场（车位宽敞）',
        nursing: '景区简阅书吧旁及游客中心设母婴室',
        strollerScore: 9.9,
        energyScore: 9.5,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '被称为「深圳小西湖」，8.8公里环湖空中木栈道穿行于水杉林与湖面之上，比深圳湾人少太多！',
        ticketCost: 0,
        kid35: '水上迷宫木栈道探险、看飞机低空掠过湖面、儿童游乐场滑梯与白沙池',
        kid08: '木栈道铺设极其平整密实（不卡推车轮子），水杉树荫覆盖率高',
        planB: '10分钟车程转场【深圳国际会展中心希尔顿/皇冠假日】或【同泰时代广场】',
        radar: [99, 91, 95, 95, 89, 97]
      },
      {
        id: 'ba-2',
        name: '欢乐港湾（湾区之光摩天轮+西岸滨海栈道+童乐园）',
        district: '宝安区',
        subarea: '宝中/前海湾圈',
        category: '滨海/环湖栈道',
        score: 9.7,
        driveA: 36,
        driveB: 42,
        routeA: '坂银通道→北环大道→月亮湾大道→海天路',
        routeB: '机荷/南坪→北环大道→宝安中心区',
        parking: '欢乐港湾P1/P5地下停车场（P5离童乐园和摩天轮最近，充电桩极多）',
        nursing: '东岸/西岸商业街区均配五星级智能母婴室（带温奶器、紫外线消毒、独立沙发）',
        strollerScore: 9.9,
        energyScore: 9.7,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '公园与海滨步道免费免预约；摩天轮1米以下儿童免费（可推婴儿车直接进16㎡超大恒温轿厢！）',
        ticketCost: 0,
        kid35: '西岸「童乐园」大型无动力攀爬网与沙池、看海边日落与音乐喷泉、逛钟书阁螺旋书店',
        kid08: '推车可直接推进摩天轮轿厢升空看前海全景，商业街与海滨公园0台阶连通',
        planB: '逛欢乐港湾室内钟书阁 + 5分钟去【宝安青少年宫/宝安图书馆/壹方城】',
        radar: [99, 99, 97, 96, 95, 97]
      },

      // ==================== 大鹏新区 ====================
      {
        id: 'dp-1',
        name: '坝光银叶树湿地园 + 白沙湾海滨栈道（盐灶古村自然博物馆）',
        district: '大鹏新区',
        subarea: '坝光银叶树圈',
        category: '红树林/河湖湿地',
        score: 9.5,
        driveA: 52,
        driveB: 45,
        routeA: '水官高速→盐排高速→盐坝高速坝光出口（高速直达！）',
        routeB: '丹平快速→罗沙路→盐坝高速坝光出口',
        parking: '银叶树湿地园生态停车场 / 白沙湾公园P1停车场（完全免费且空旷！）',
        nursing: '白沙湾公园游客中心及银叶树湿地服务站均设母婴室',
        strollerScore: 9.6,
        energyScore: 9.7,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: false,
        easyPark: true,
        noReserve: true,
        reserveTip: '💡 独家秘笈：坝光片区属于大鹏预约通行豁免区外围（且10月后全区免预约），盐坝高速下来2分钟即到，绝不堵车！',
        ticketCost: 0,
        kid35: '滩涂赶海抓小螃蟹、千年古银叶树林木栈道探险、盐灶客家古村6个微型乡村自然博物馆、白沙湾草坪露营',
        kid08: '海湾风平浪静，白沙湾海滨绿道宽阔平坦，古树群浓荫遮蔽',
        planB: '参观盐灶古村室内乡村博物馆群，或走高速20分钟回坪山/盐田商圈',
        radar: [96, 90, 97, 99, 86, 98]
      },
      {
        id: 'dp-2',
        name: '深圳大鹏半岛国家地质公园博物馆 + 禾塘山水湿地园',
        district: '大鹏新区',
        subarea: '大鹏所城/金沙湾圈',
        category: '博物馆/科技馆',
        score: 9.4,
        driveA: 65,
        driveB: 58,
        routeA: '水官→盐排→盐坝高速→坪西路→地质公园路',
        routeB: '丹平→盐坝高速→坪西路',
        parking: '国家地质公园博物馆地面停车场（免费，车位充足）',
        nursing: '地质博物馆一楼游客中心设独立母婴室',
        strollerScore: 9.6,
        energyScore: 9.6,
        zeroStep: true,
        nursingRoom: true,
        kidEnergy: true,
        indoorCool: true,
        easyPark: true,
        noReserve: true,
        reserveTip: '免预约免费入馆（周一闭馆），非常适合作为大鹏2天1晚周末游的核心科普站',
        ticketCost: 0,
        kid35: '逼真火山喷发体验厅、巨型恐龙骨架与矿物宝石洞穴展，门口就是七娘山脚下的禾塘湿地溪流栈道',
        kid08: '博物馆内清凉安静、坡道与电梯完善，门外湿地平坦适合傍晚推车散步',
        planB: '博物馆室内展厅 + 金沙湾中信度假区室内恒温空间',
        radar: [96, 92, 96, 95, 95, 96]
      }
    ];

    // 深圳本地周末2日连玩打包路书（6条）
    const LOCAL_PACKS = [
      {
        id: 'pack-1',
        title: '【盐田山海栈道 + 仙湖古生物】东部森海2日连玩线',
        area: '罗湖区 + 盐田区',
        modeRec: '模式B（布吉出发向东最顺，单程20-30分钟，可回布吉睡或住大梅沙洲际/凯悦）',
        driveA: 34,
        driveB: 25,
        score: 9.7,
        spotsIncluded: ['仙湖植物园+古生物博物馆', '盐田海滨栈道灯塔图书馆', '大梅沙内湖湿地与沙滩'],
        summary: '周六上午趁凉爽逛仙湖天上人间湖泊与古生物恐龙馆，下午回壹海城午休后推车走海山灯塔海滨栈道看大轮船；周日畅玩大梅沙内湖湿地黑天鹅与沙滩挖沙。',
        timeline: [
          { time: '周六 09:00-12:00', title: '仙湖植物园 + 深圳古生物博物馆', desc: '停仙湖立体车库，坐大巴直达天上人间草坪；3.5岁大宝看霸王龙化石，8月龄二宝推车环仙湖栈道吸氧小睡。' },
          { time: '周六 12:30-15:30', title: '盐田壹海城午餐 + 车载/酒店午睡', desc: '走罗沙路15分钟到盐田壹海城吃粤菜，五星母婴室护理二宝，下午高温时段室内休息或入住海景酒店。' },
          { time: '周六 16:00-18:00', title: '海山段海滨栈道 + 灯塔图书馆 + 中央公园大草坪', desc: '全平缓石板海滨栈道推车吹海风，看巨型集装箱轮船。' },
          { time: '周日 09:30-15:00', title: '大梅沙内湖湿地栈道 + 8号仓奥莱返程', desc: '上午在大梅沙内湖湿地看黑天鹅、沙滩挖沙，中午在8号仓奥莱用餐午休后走盐排高速25分钟回布吉。' }
        ],
        planB: '若遇降雨，周六改去【深圳博物馆+深业上城】，周日去【小梅沙海洋世界室内馆】',
        radar: [96, 95, 98, 92, 90, 97]
      },
      {
        id: 'pack-2',
        title: '【坂银直达·福田顶配馆群 + 香蜜湖/红树林】都市绿洲2日线',
        area: '福田区全境',
        modeRec: '模式A（坂田出发走坂银通道18分钟直达，强烈推荐走读回布吉睡！）',
        driveA: 18,
        driveB: 22,
        score: 9.8,
        spotsIncluded: ['笔架山+莲花山幸福廊桥', '深圳博物馆+两馆', '香蜜公园空中栈道', '福田红树林生态公园'],
        summary: '把坂银通道的地理优势发挥到极致！20分钟内无缝切换森林空中栈道、野生动物标本馆与国家级红树林湿地。',
        timeline: [
          { time: '周六 09:30-12:00', title: '停深业上城 → 幸福廊桥 → 笔架山沙池与福田河', desc: '推车从深业上城3楼直接上无障碍空中廊桥，大宝在笔架山超大沙池放电，二宝在树冠廊桥推车小睡。' },
          { time: '周六 12:00-17:00', title: '深业上城午餐午休 → 深圳博物馆（历史民俗馆）', desc: '下午最晒时段进入深博恒温展厅看非洲狮、长颈鹿、北极熊标本，全程0台阶。' },
          { time: '周日 09:30-12:00', title: '香蜜公园荔枝林空中栈道 + 山姆采购', desc: '停印力中心，走天桥电梯进香蜜公园玩三大儿童游乐区，顺便山姆补给双娃物资。' },
          { time: '周日 15:00-17:30', title: '福田红树林生态公园科普馆 + 观鸟栈道', desc: '看弹涂鱼、招潮蟹与黑脸琵鹭，傍晚走坂银通道20分钟轻松返家。' }
        ],
        planB: '全程紧贴深业上城、领展中心城、印力中心三大商场与深圳博物馆，随时切换纯室内模式',
        radar: [100, 99, 96, 97, 98, 99]
      },
      {
        id: 'pack-3',
        title: '【南山华侨城国家级湿地 + 西丽湖碧道 + 欢乐港湾】湖海双栖2日线',
        area: '南山区 + 宝安中心区',
        modeRec: '模式A（周五15:30坂田接太太走北环/留仙大道，可住华侨城洲际或西丽湖紫荆山庄1晚）',
        driveA: 28,
        driveB: 34,
        score: 9.7,
        spotsIncluded: ['环西丽湖山水碧道(问山叠水)', '华侨城国家湿地公园', '欢乐海岸海洋奇梦馆', '宝安欢乐港湾摩天轮'],
        summary: '兼顾山水溪流、都市秘境湿地与海滨摩天轮，推车友好度与母婴室配置均属深圳天花板级别。',
        timeline: [
          { time: '周六 09:30-12:00', title: '环西丽湖绿道（问山叠水段）溪水草坪放电', desc: '坂田走留仙大道25分钟即达，大宝在浅溪捞鱼、草坪骑车，二宝在湖畔森林栈道推车。' },
          { time: '周六 13:00-17:30', title: '欢乐海岸午餐 + 海洋奇梦馆 + 华侨城国家湿地', desc: '中午在欢乐海岸吹空调看水母海狮，15:30进入提前预约好的华侨城湿地，清幽无自行车。' },
          { time: '周日 10:00-16:30', title: '欢乐港湾童乐园 + 推婴儿车坐摩天轮 + 钟书阁', desc: '上午海边无动力乐园放电，中午西岸用餐，下午带二宝推车直入恒温摩天轮轿厢看海。' }
        ],
        planB: '欢乐海岸海洋奇梦馆 + 南山博物馆 + 壹方城室内乐园',
        radar: [98, 99, 97, 95, 95, 96]
      },
      {
        id: 'pack-4',
        title: '【光明科学城新馆 + 虹桥森林栈道 + 光明湖田园】森科微度假2日线',
        area: '光明区全境',
        modeRec: '模式A（坂田直接上珠三角环线G94，32分钟直达光明！推荐住光明美爵或天安云谷温德姆1晚）',
        driveA: 32,
        driveB: 38,
        score: 9.6,
        spotsIncluded: ['虹桥公园森林空中栈道', '深圳科技馆光明新馆+科学公园', '光明湖+欢乐田园小火车'],
        summary: '从坂田上G94高速一路畅通无阻，森林红飘带栈道、全新巨型科技馆与千亩湖泊稻田一次集齐，吃正宗光明三宝。',
        timeline: [
          { time: '周五 15:30-18:00', title: '坂田接太太上G94 → 32分钟抵光明入住 + 吃光明乳鸽', desc: '趁二宝下午小睡直达光明酒店，晚餐品尝光明招待所红烧乳鸽、牛初乳、甜玉米汁（非常适合3.5岁大宝）。' },
          { time: '周六 09:00-17:00', title: '上午虹桥公园空中森林栈道 → 下午深圳科技馆新馆', desc: '上午0台阶推车走虹桥看碧眼水库，下午进入恒温科技馆新馆沉浸式互动。' },
          { time: '周日 09:30-15:00', title: '光明湖大坝 + 欢乐田园租代步车看花海喂小鹿', desc: '租四人电动遮阳代步车轻松环游千亩田园，午睡点走G94高速30分钟返家。' }
        ],
        planB: '深圳科技馆（光明新馆）+ 光明文化艺术中心美术馆/图书馆 + 蓝鲸世界商场',
        radar: [98, 96, 98, 97, 94, 97]
      },
      {
        id: 'pack-5',
        title: '【龙岗大运神仙岭 + 红立方 + 坪山聚龙山湿地】东部零拥堵2日线',
        area: '龙岗区 + 坪山区',
        modeRec: '模式B（布吉出发走水官+南坪三期全程免费高速，20-32分钟即达，绝不塞车！）',
        driveA: 26,
        driveB: 22,
        score: 9.6,
        spotsIncluded: ['大运公园神仙岭湖泊+大运天地', '龙岗红立方科技馆', '坪山聚龙山湿地+坪山文化聚落'],
        summary: '专为讨厌找车位与排队的父母设计：水官接南坪三期一路绿灯，森林水库、黑天鹅湖、红立方科技馆与坪山湿地全覆盖。',
        timeline: [
          { time: '周六 09:30-17:00', title: '上午大运公园神仙岭水库看黑天鹅 → 下午红立方科技馆', desc: '上午在大运公园森林绿道推车看梅花鹿与黑天鹅，中午大运天地用餐午休，下午玩转红立方科技馆。' },
          { time: '周日 09:30-16:30', title: '上午坪山聚龙山生态湿地 → 下午坪山美术馆+少儿图书馆', desc: '聚龙山车位随到随停，下午在坪山文化聚落吹空调看绘本，中心公园草坪收尾返程。' }
        ],
        planB: '红立方科技馆 + 坪山美术馆/图书馆 + 大运天地室内区',
        radar: [98, 96, 97, 98, 95, 99]
      },
      {
        id: 'pack-6',
        title: '【大鹏坝光银叶树湿地 + 国家地质博物馆 + 金沙湾】山海秘境2日1晚线',
        area: '大鹏新区',
        modeRec: '模式B（周五下午或周六早从布吉走盐坝高速，住金沙湾佳兆业万豪或坝光周边美宿1晚）',
        driveA: 52,
        driveB: 45,
        score: 9.4,
        spotsIncluded: ['坝光银叶树湿地园+白沙湾栈道', '大鹏国家地质公园博物馆', '禾塘山水湿地+金沙湾鹏飞公园'],
        summary: '避开较场尾/杨梅坑拥堵段，主打坝光千年银叶树湿地赶海与七娘山国家地质博物馆看恐龙火山。',
        timeline: [
          { time: '周六 09:30-12:30', title: '盐坝高速直达坝光 → 白沙湾海滨栈道 + 银叶树湿地赶海', desc: '从布吉出发45分钟直达坝光出口，大宝在滩涂抓小螃蟹，二宝在古银叶树林栈道推车。' },
          { time: '周六 14:00-18:00', title: '入住金沙湾亲子酒店午睡 + 鹏飞公园儿童乐园看海景日落', desc: '下午回酒店睡饱，傍晚在金沙湾草坪与鹏飞公园无动力沙池玩耍。' },
          { time: '周日 09:30-14:30', title: '大鹏国家地质公园博物馆 + 禾塘湿地栈道 → 返程', desc: '上午看恐龙化石与火山喷发模型，漫步七娘山脚禾塘湿地，午后趁二宝车载睡眠返程。' }
        ],
        planB: '大鹏国家地质博物馆 + 盐灶古村室内自然博物馆群 + 酒店室内恒温儿童乐园',
        radar: [95, 92, 97, 96, 90, 94]
      }
    ];

    // 视角二：环深跨城 3天2晚微度假精选（6条低频跨市线）
    const CROSS_CITY_ROUTES = [
      {
        id: 'cross-1',
        name: '东莞松山湖（松湖烟雨环湖栈道 + 欧式小火车远眺 + 科学公园 + 望野博物馆）',
        city: '东莞 · 松山湖生态园',
        score: 9.8,
        driveA: 40, // 坂田直上G94珠三角环线仅40分钟！
        driveB: 48,
        routeA: '坂田入口直上珠三角环线高速(G94) → 松山湖出口（全程高速仅40分钟，比去南山蛇口还快！）',
        routeB: '机荷高速 → 珠三角环线高速(G94) → 松山湖大朗出口',
        tollCost: 36,
        hotelRec: '松山湖悦榕庄 / 松山湖凯悦酒店（湖景大草坪+儿童泳池+步行直入松湖烟雨栈道）',
        spots: '松湖烟雨湖畔栈道、华为溪流背坡村康桥红砖小火车观景点、松山湖科学公园（儿童友好专馆）、松山湖望野博物馆、黄花风铃木林湾畔',
        kid35: '在康桥大桥看红色复古小火车穿梭欧式城堡与湖面、松山湖科学公园玩巨型无动力科学游乐设施、租家庭亲子脚踏车环湖',
        kid08: '30公里环湖绿道柏油路面如丝绸般顺滑，凯悦/悦榕庄酒店直通湖边栈道，二宝随时回房间午睡喂奶',
        planB: '松山湖望野博物馆 + 松山湖万象汇（室内顶级母婴室+MELAND儿童乐园）',
        timeline: [
          { time: '周五 15:30', title: '布吉出发 → 15:50坂田接太太直上G94 → 16:35抵松山湖酒店', desc: '完美卡位二宝下午小睡，避开五和大道晚高峰，傍晚在酒店湖畔草坪散步用晚餐。' },
          { time: '周六 全天', title: '上午松湖烟雨栈道+看康桥红色小火车 → 午休 → 下午松山湖科学公园', desc: '上午推车走湖岸树荫道看小火车，中午回酒店午睡，下午去松山湖科学公园儿童友好区放电。' },
          { time: '周日 半天', title: '上午松山湖望野博物馆 + 万象汇午餐 → 14:00返程回布吉', desc: '周日轻松逛室内文博馆与万象汇，趁午睡窗口40分钟回到深圳布吉。' }
        ],
        radar: [99, 98, 98, 97, 94, 96]
      },
      {
        id: 'cross-2',
        name: '惠州西湖丰渚园荷花湿地 + 惠州植物园温室玻璃球 + 红花湖绿道',
        city: '惠州 · 惠城区',
        score: 9.5,
        driveA: 65,
        driveB: 55,
        routeA: '机荷高速 → 盐排高速 → 武深高速 → 惠大高速',
        routeB: '布吉直上水官/盐排 → 仁深高速/武深高速（东向出发完全不堵！）',
        tollCost: 52,
        hotelRec: '惠州西湖皇冠假日 / 康帝国际酒店（出门即是西湖平湖栈道与丰渚园）',
        spots: '惠州植物园（巨型温室玻璃球科普馆）、西湖丰渚园（岭南园林荷花湿地栈道）、红花湖环湖绿道、惠州市博物馆',
        kid35: '惠州植物园太阳广场沙池与热带雨林温室寻宝、丰渚园喂锦鲤看白鹭、西湖坐电动画舫游船',
        kid08: '惠州植物园温室与科普馆全无障碍电梯直达；丰渚园比主景区清静10倍，长廊遮阳避雨',
        planB: '惠州植物园室内科普馆 + 惠州市博物馆/科技馆 + 华贸天地商场',
        timeline: [
          { time: '周五 16:00', title: '太太回布吉汇合出发 → 55分钟抵惠州西湖畔酒店', desc: '走盐排转武深高速一路畅通，晚上吃东江盐焗鸡与酿豆腐。' },
          { time: '周六 全天', title: '上午惠州植物园（温室玻璃球+儿童园）→ 午休 → 下午西湖丰渚园湿地+游船', desc: '植物园就在西湖旁10分钟车程，温室恒温且推车0台阶；下午坐西湖游船微风拂面。' },
          { time: '周日 半天', title: '上午红花湖绿道骑行/推车 或 惠州市博物馆 → 午后返深', desc: '红花湖可租带棚家庭电动车环湖18公里，午饭后轻松返程。' }
        ],
        radar: [95, 92, 95, 95, 92, 97]
      },
      {
        id: 'cross-3',
        name: '中山深中通道线（金钟湖环湖栈道 + 中山市博物馆 + 孙中山故居 + 崖口湿地）',
        city: '中山 · 翠亨/东区',
        score: 9.4,
        driveA: 68,
        driveB: 75,
        routeA: '坂田上机荷高速直连深中通道 → 翠亨东出口（一桥飞架伶仃洋！）',
        routeB: '清平高速 → 机荷高速 → 深中通道',
        tollCost: 132,
        hotelRec: '中山温泉宾馆（岭南园林亲子别墅+儿童乐园）或 中山利和威斯汀',
        spots: '深中通道海中大桥景观、金钟湖公园（水杉湿地栈道）+ 儿童公园、中山市博物馆新馆、孙中山故居纪念馆、崖口稻田红树林湿地',
        kid35: '开车跨越深中通道看大海巨轮、金钟湖旁的古香林儿童公园超大无动力设施、崖口湿地看稻田小火车',
        kid08: '中山市博物馆新馆园林与现代展馆结合，推车极度顺滑；金钟湖环湖栈道平坦舒适',
        planB: '中山市博物馆新馆 + 孙中山故居博物馆 + 中山利和广场/万象汇',
        timeline: [
          { time: '周五 15:30', title: '坂田出发直上机荷接深中通道 → 欣赏伶仃洋日落抵中山', desc: '周五下午3点半走深中通道车流平稳，吃正宗石岐乳鸽与脆肉鲩。' },
          { time: '周六 全天', title: '上午金钟湖环湖栈道+儿童公园 → 午休 → 下午中山市博物馆新馆', desc: '动静结合，上午森林湖泊放电，下午恒温博物馆避晒。' },
          { time: '周日 半天', title: '上午孙中山故居纪念馆 + 崖口红树林海堤栈道 → 午后返深', desc: '建议周日13:30前上深中通道返程，避开周日傍晚返深车流高峰。' }
        ],
        radar: [95, 93, 96, 92, 93, 91]
      },
      {
        id: 'cross-4',
        name: '广州南沙湿地观鸟游船 + 水鸟世界 + 广东科学中心（亚洲最大科技馆）',
        city: '广州 · 南沙/番禺',
        score: 9.5,
        driveA: 72,
        driveB: 78,
        routeA: '坂田上G94/机荷 → 广深沿江高速/南沙大桥 → 南沙万顷沙',
        routeB: '清平 → 机荷 → 广深高速 → 南沙港快速',
        tollCost: 95,
        hotelRec: '广州南沙花园酒店（自带万平山海园林、室内外恒温泳池、透明旋转楼梯推车坡道、儿童俱乐部）',
        spots: '南沙湿地公园（红树林摇橹船观候鸟）、南沙水鸟世界生态园（看火烈鸟/鹈鹕）、南沙天后宫滨海栈道、广东科学中心',
        kid35: '在南沙水鸟世界零距离看成群火烈鸟、鹈鹕与黑天鹅；坐电动游船穿行万亩红树林芦苇荡；周日打卡广东科学中心儿童天地',
        kid08: '南沙湿地游船平稳有遮阳棚，南沙花园酒店本身就是一座零台阶山海大公园',
        planB: '广东科学中心（全天逛不完的航母级室内馆）+ 南沙花园酒店室内儿童乐园',
        timeline: [
          { time: '周五 15:30', title: '坂田出发 → 70分钟抵南沙花园酒店入住', desc: '酒店依山傍海，推车可在酒店私家海岸线步道散步。' },
          { time: '周六 全天', title: '上午南沙湿地游船 + 水鸟世界看火烈鸟 → 下午酒店恒温泳池与草坪', desc: '湿地与水鸟世界仅一路之隔，上午看完鸟回酒店午睡玩水。' },
          { time: '周日 全天', title: '广东科学中心（儿童科学馆）→ 下午返深', desc: '提前预约广东科学中心，玩转专为低幼儿童设计的互动展厅后返深。' }
        ],
        radar: [94, 96, 98, 94, 95, 93]
      },
      {
        id: 'cross-5',
        name: '佛山顺德（顺峰山公园汀溪湖栈道 + 顺德博物馆 + 清晖园 + 欢乐海岸PLUS）',
        city: '佛山 · 顺德大良',
        score: 9.6,
        driveA: 78,
        driveB: 85,
        routeA: '坂田上G94/机荷 → 南沙大桥 → 广珠西线高速顺德出口',
        routeB: '清平 → 机荷 → 南沙大桥 → 顺德大良',
        tollCost: 98,
        hotelRec: '顺德美的万豪酒店（就在顺峰山公园正对面，下楼过马路即入环湖绿道！）',
        spots: '顺峰山公园（桂畔湖湿地栈道+莫比乌斯环桥+盒子美术馆）、顺德区博物馆、清晖园、顺德华侨城欢乐海岸PLUS',
        kid35: '顺峰山8公里环湖绿道、巨大草坪与儿童攀爬乐园、欢乐海岸曲水湾看状元牌坊与坐摩天轮、吃双皮奶与鱼生粥底火锅',
        kid08: '顺峰山公园平缓程度堪比深圳湾且有盒马/美术馆配套，顺德博物馆恒温清静',
        planB: '顺德区博物馆 + 顺峰山盒子美术馆 + 欢乐海岸O-PLAZA室内购物中心',
        timeline: [
          { time: '周五 15:30', title: '坂田出发 → 78分钟抵顺德大良美的万豪 + 寻味顺德晚餐', desc: '晚餐吃毋米粥（清淡米汤底极其适合给8月龄二宝做辅食粥，大宝吃嫩滑鱼片牛肉）。' },
          { time: '周六 全天', title: '上午顺峰山公园青云湖湿地栈道 → 午休 → 下午顺德博物馆 + 欢乐海岸PLUS', desc: '住顺峰山对面，随时推车回酒店午睡。' },
          { time: '周日 半天', title: '上午早茶（珍之宝/味可道）+ 清晖园岭南园林 → 午后返深', desc: '叹正宗顺德早茶后趁二宝午睡返深。' }
        ],
        radar: [97, 96, 96, 95, 94, 95]
      },
      {
        id: 'cross-6',
        name: '珠海淇澳岛红树林湿地栈道 + 珠海博物馆新馆 + 海天公园温室植物馆',
        city: '珠海 · 唐家湾/香洲情侣路',
        score: 9.5,
        driveA: 90,
        driveB: 95,
        routeA: '机荷高速 → 深中通道 → 广澳高速珠海支线 → 淇澳大桥',
        routeB: '清平 → 机荷 → 深中通道 → 珠海唐家湾',
        tollCost: 145,
        hotelRec: '珠海仁恒洲际酒店 或 珠海凤凰湾悦椿酒店（一线海景+高配母婴服务）',
        spots: '淇澳岛红树林国家级自然保护区木栈道、海天公园（名树古树区+温室植物馆+海景大草坪）、珠海博物馆与规划展览馆双馆、香炉湾城市阳台',
        kid35: '淇澳岛红树林木栈道满地招潮蟹与弹涂鱼、海天公园看名车馆与热带植物温室、香炉湾沙滩挖沙看日月贝大剧院',
        kid08: '海天公园与珠海博物馆隔情侣路通过无障碍空中连廊相连，推车从博物馆直达海边公园0红绿灯0台阶！',
        planB: '珠海博物馆 + 珠海规划展览馆 + 城市阳台百货商场 + 海天公园温室馆',
        timeline: [
          { time: '周五 15:30', title: '坂田出发经深中通道 → 90分钟抵珠海情侣路酒店', desc: '傍晚在香炉湾城市阳台推车吹海风看日月贝亮灯。' },
          { time: '周六 全天', title: '上午淇澳岛红树林湿地栈道看螃蟹 → 午休 → 下午海天公园+珠海博物馆', desc: '上午趁退潮去淇澳岛红树林栈道，下午在珠海博物馆与海天公园温室避晒。' },
          { time: '周日 半天', title: '上午唐家湾共乐园古树林或日月贝海韵城 → 13:30前返深', desc: '轻松慢游后经深中通道返深。' }
        ],
        radar: [96, 95, 96, 93, 94, 92]
      }
    ];

    // 双娃随车装备核对清单
    const GEAR_CATEGORIES = [
      {
        title: '👶 8月龄二宝专属（睡眠·哺乳·辅食）',
        items: [
          { id: 'g1', text: '轻便一键折叠避震婴儿推车 + 推车防晒遮阳棚/透气防蚊纱罩' },
          { id: 'g2', text: '人体工学省力腰凳背带（应对局部少量台阶或二宝闹觉抱睡）' },
          { id: 'g3', text: '恒温调奶保温杯（50℃温水）+ 分装奶粉盒/母乳防溢垫 + 哺乳遮羞巾' },
          { id: 'g4', text: '成品果泥/肉泥辅食袋×4 + 一次性硅胶围兜 + 磨牙米饼（车上安抚神器）' },
          { id: 'g5', text: '纸尿裤（按每天8片备足）+ 便携隔尿垫 + 婴儿手口湿巾2大包 + 护臀膏' },
          { id: 'g6', text: '车载后排安抚玩具 + 便携白噪音机 + 纯棉纱布盖毯（应对博物馆强冷气）' }
        ]
      },
      {
        title: '👦 3.5岁大宝专属（放电·观察·换洗）',
        items: [
          { id: 'g7', text: '儿童滑步车/折叠滑板车 + 护具头盔（后备箱常备，环湖绿道神器）' },
          { id: 'g8', text: '折叠硅胶挖沙桶铲套装 + 捞鱼小网兜 + 生态观察小桶（湿地/海边必用）' },
          { id: 'g9', text: '儿童双筒望远镜 + 放大镜（红树林看候鸟、弹涂鱼、博物馆看标本）' },
          { id: 'g10', text: '3套快干换洗衣服 + 备用防滑溯溪鞋/洞洞鞋 + 速干浴巾（玩水玩沙后秒换）' },
          { id: 'g11', text: '便携折叠小马桶圈/车载应急尿壶（高速堵车或公园排队应急）' }
        ]
      },
      {
        title: '🚗 车载与双娃出行安全应急包',
        items: [
          { id: 'g12', text: '双安全座椅检查（8月龄反向安装半躺角，3.5岁正向五点式）+ 侧窗遮阳帘' },
          { id: 'g13', text: '派卡瑞丁成分婴儿防蚊液（6个月以上可用，湿地/植物园必喷）+ 炉甘石洗剂' },
          { id: 'g14', text: '儿童物理防晒霜 + 大宝遮阳帽 + 婴儿耳温枪 + 退热贴 + 碘伏棉签创可贴' },
          { id: 'g15', text: '野餐防潮垫（2m×2m）+ 推车挂钩×2 + 大容量妈咪包 + 充电宝' }
        ]
      }
    ];

    /********************************************************************
     * 2. 全局状态管理
     ********************************************************************/
    let state = {
      departMode: 'A', // 'A': 坂田顺路接太太, 'B': 太太回布吉汇合
      perspective: 'localSpots', // 'localSpots' | 'localPacks' | 'crossCity' | 'gear'
      selectedDistrict: 'ALL',
      selectedSubarea: 'ALL',
      selectedCategory: 'ALL',
      maxDrive: 999,
      needs: new Set(),
      customPlan: {
        sat: [],
        sun: []
      },
      checkedGear: readGear()
    };

    /********************************************************************
     * 3. 初始化与交互控制函数
     ********************************************************************/
    function initApp() {
      bindActions();
      renderDistrictMatrix();
      updateBudgetAndRender();
      updateGearBadge();
      renderCustomPlanBar();
      syncButtons();
    }

    function setDepartMode(mode) {
      state.departMode = mode;
      byId('modeBtnA').classList.toggle('active', mode === 'A');
      byId('modeBtnB').classList.toggle('active', mode === 'B');
      byId('currentModeHint').textContent =
        mode === 'A' ? '当前：模式A 坂田顺路接太太出发' : '当前：模式B 太太回布吉汇合出发';
      renderMainContent();
    }

    function switchPerspective(p) {
      state.perspective = p;
      ['localSpots', 'localPacks', 'crossCity', 'gear'].forEach(key => {
        const btnId = 'tab' + key.charAt(0).toUpperCase() + key.slice(1);
        const el = byId(btnId);
        if (el) el.classList.toggle('active', key === p);
      });

      byId('districtMatrixBox').style.display = (p === 'localSpots') ? 'block' : 'none';
      byId('catFilterGroup').style.display = (p === 'localSpots') ? 'block' : 'none';
      byId('mainToolbar').style.display = (p === 'gear') ? 'none' : 'flex';

      renderMainContent();
    }

    function renderDistrictMatrix() {
      const tabsContainer = byId('districtTabs');
      const subareaBar = byId('subareaBar');

      tabsContainer.innerHTML = DISTRICT_META.map(d => {
        const count = d.id === 'ALL'
          ? LOCAL_SPOTS.length
          : LOCAL_SPOTS.filter(s => s.district === d.id).length;
        const activeClass = state.selectedDistrict === d.id ? 'active' : '';
        return `
          <button type="button" class="d-tab ${activeClass}" data-action="selectDistrict" data-event="click" data-arg1="${d.id}" data-type1="string">
            <span>${d.name}</span>
            <span class="count">${count}</span>
          </button>
        `;
      }).join('');

      const currentObj = DISTRICT_META.find(d => d.id === state.selectedDistrict);
      if (!currentObj || currentObj.id === 'ALL') {
        subareaBar.innerHTML = `
          <span style="font-size:12px;color:var(--ink-secondary);font-weight:700;">细分片区快选：</span>
          <span class="chip active">当前展示深圳全部 26 个细分片区（点击上方具体行政区可按片区聚焦）</span>
        `;
      } else {
        subareaBar.innerHTML = `
          <span style="font-size:12px;color:var(--ink-secondary);font-weight:700;">${currentObj.id}细分片区：</span>
          <button type="button" class="chip ${state.selectedSubarea === 'ALL' ? 'active' : ''}" data-action="selectSubarea" data-event="click" data-arg1="ALL" data-type1="string">全部片区</button>
          ${currentObj.subareas.map(sub => `
            <button type="button" class="chip ${state.selectedSubarea === sub ? 'active' : ''}" data-action="selectSubarea" data-event="click" data-arg1="${sub}" data-type1="string">${sub}</button>
          `).join('')}
        `;
      }
    }

    function selectDistrict(districtId) {
      state.selectedDistrict = districtId;
      state.selectedSubarea = 'ALL';
      renderDistrictMatrix();
      renderMainContent();
    }

    function selectSubarea(sub) {
      state.selectedSubarea = sub;
      renderDistrictMatrix();
      renderMainContent();
    }

    function selectCategory(cat) {
      state.selectedCategory = cat;
      root.querySelectorAll('#categoryChips .chip').forEach(el => {
        el.classList.toggle('active', el.dataset.cat === cat);
      });
      renderMainContent();
    }

    function selectMaxDrive(mins) {
      state.maxDrive = mins;
      root.querySelectorAll('#driveChips .chip').forEach(el => {
        el.classList.toggle('active', Number(el.dataset.drive) === mins);
      });
      renderMainContent();
    }

    function toggleNeed(needKey) {
      if (state.needs.has(needKey)) {
        state.needs.delete(needKey);
      } else {
        state.needs.add(needKey);
      }
      root.querySelectorAll('#needChips .chip').forEach(el => {
        el.classList.toggle('active', state.needs.has(el.dataset.need));
      });
      renderMainContent();
    }

    function resetFilters() {
      state.selectedDistrict = 'ALL';
      state.selectedSubarea = 'ALL';
      state.selectedCategory = 'ALL';
      state.maxDrive = 999;
      state.needs.clear();
      byId('searchInput').value = '';
      selectCategory('ALL');
      selectMaxDrive(999);
      root.querySelectorAll('#needChips .chip').forEach(el => el.classList.remove('active'));
      renderDistrictMatrix();
      renderMainContent();
    }

    function getBudgetParams() {
      const stayNights = Number(byId('stayModeSelect').value);
      const hotelRate = Number(byId('hotelTierSelect').value);
      const foodCost = Number(byId('foodTierSelect').value);
      const hotelTotal = stayNights * hotelRate;
      const baseTransport = 90; // 充电+停车基准
      return { stayNights, hotelRate, foodCost, hotelTotal, baseTransport, total: hotelTotal + foodCost + baseTransport };
    }

    function updateBudgetAndRender() {
      const b = getBudgetParams();
      byId('budgetBreakdownText').textContent =
        `房¥${b.hotelTotal} + 餐¥${b.foodCost} + 车电停¥${b.baseTransport}`;
      byId('budgetTotalDisplay').textContent = `¥ ${b.total.toLocaleString()}`;
      renderMainContent();
    }

    /********************************************************************
     * 4. 核心视图渲染器
     ********************************************************************/
    function renderMainContent() {
      const container = byId('mainCardsContainer');
      const query = (byId('searchInput').value || '').trim().toLowerCase();
      const sortBy = byId('sortSelect').value;

      if (state.perspective === 'localSpots') {
        container.className = 'cards-grid';
        let list = LOCAL_SPOTS.filter(item => {
          const driveMins = state.departMode === 'A' ? item.driveA : item.driveB;
          if (state.selectedDistrict !== 'ALL' && item.district !== state.selectedDistrict) return false;
          if (state.selectedSubarea !== 'ALL' && item.subarea !== state.selectedSubarea) return false;
          if (state.selectedCategory !== 'ALL' && item.category !== state.selectedCategory) return false;
          if (driveMins > state.maxDrive) return false;
          for (let n of state.needs) {
            if (!item[n]) return false;
          }
          if (query) {
            const hay = `${item.name} ${item.district} ${item.subarea} ${item.category} ${item.kid35} ${item.kid08}`.toLowerCase();
            if (!hay.includes(query)) return false;
          }
          return true;
        });

        list.sort((a, b) => {
          const da = state.departMode === 'A' ? a.driveA : a.driveB;
          const db = state.departMode === 'A' ? b.driveA : b.driveB;
          if (sortBy === 'drive') return da - db;
          if (sortBy === 'stroller') return b.strollerScore - a.strollerScore;
          if (sortBy === 'energy') return b.energyScore - a.energyScore;
          return b.score - a.score;
        });

        byId('resultCountText').innerHTML =
          `🎯 深圳本地图谱筛选出 <span style="color:var(--terracotta);font-size:16px;">${list.length}</span> 个宝藏点位（点击「+周六 / +周日」可自由拼装两日游）`;

        if (list.length === 0) {
          container.innerHTML = `<div class="panel-card" style="grid-column:1/-1;text-align:center;padding:40px;">未找到符合当前叠加筛选条件的点位，请点击左侧「重置全部」放宽条件。</div>`;
          return;
        }

        container.innerHTML = list.map(spot => {
          const drive = state.departMode === 'A' ? spot.driveA : spot.driveB;
          const route = state.departMode === 'A' ? spot.routeA : spot.routeB;
          return `
            <article class="spot-card">
              <div>
                <div class="card-top-badges">
                  <span class="district-pill">${spot.district} · ${spot.subarea}</span>
                  <span class="cat-pill">${spot.category}</span>
                </div>
                <div class="spot-title">
                  <span>${spot.name}</span>
                  <span class="spot-score">★ ${spot.score}</span>
                </div>
                <div class="drive-info-bar">
                  <span>🚗 <strong>${drive} 分钟</strong>（${route}）</span>
                  <span>🎫 门票：${spot.ticketCost === 0 ? '免费' : '¥'+spot.ticketCost}</span>
                </div>
                <div class="kid-dual-box">
                  <div class="kid-cell">
                    <strong>👦 3.5岁大宝玩点（放电 ${spot.energyScore}）</strong>
                    <span>${spot.kid35}</span>
                  </div>
                  <div class="kid-cell baby">
                    <strong>👶 8月龄二宝友好（推车 ${spot.strollerScore}）</strong>
                    <span>${spot.kid08}</span>
                  </div>
                </div>
                <div class="meta-list">
                  <div>🅿️ <strong>停车指引：</strong>${spot.parking}</div>
                  <div>🍼 <strong>母婴配套：</strong>${spot.nursing}</div>
                  <div>☔ <strong>阴雨/暴晒B计划：</strong>${spot.planB}</div>
                </div>
                <div class="tag-row">
                  <span class="mini-tag ${spot.noReserve ? '' : 'warn'}">${spot.noReserve ? '🟢 免预约直达' : '🔔 ' + spot.reserveTip}</span>
                </div>
              </div>
              <div class="card-actions">
                <button type="button" class="btn btn-primary" data-action="openSpotModal" data-event="click" data-arg1="${spot.id}" data-type1="string">📊 雷达图与攻略</button>
                <button type="button" class="btn btn-accent" data-action="addToPlan" data-event="click" data-arg1="sat" data-type1="string" data-arg2="${spot.id}" data-type2="string">+ 加入周六</button>
                <button type="button" class="btn btn-accent" data-action="addToPlan" data-event="click" data-arg1="sun" data-type1="string" data-arg2="${spot.id}" data-type2="string">+ 加入周日</button>
              </div>
            </article>
          `;
        }).join('');

      } else if (state.perspective === 'localPacks') {
        container.className = 'cards-grid';
        byId('resultCountText').innerHTML =
          `🗺️ 深圳本地不离深周末连玩打包路线（共 <span style="color:var(--terracotta);">${LOCAL_PACKS.length}</span> 条黄金组合）`;
        const b = getBudgetParams();

        container.innerHTML = LOCAL_PACKS.map(pack => {
          const drive = state.departMode === 'A' ? pack.driveA : pack.driveB;
          return `
            <article class="spot-card">
              <div>
                <div class="card-top-badges">
                  <span class="district-pill">📍 ${pack.area}</span>
                  <span class="cat-pill">周末2日连玩打包线</span>
                </div>
                <div class="spot-title">
                  <span>${pack.title}</span>
                  <span class="spot-score">★ ${pack.score}</span>
                </div>
                <div class="drive-info-bar">
                  <span>🚗 首站车程：约 <strong>${drive} 分钟</strong></span>
                  <span>💰 预算估算：<strong>¥${b.total}</strong></span>
                </div>
                <p style="font-size:12.5px;color:var(--ink-secondary);margin:8px 0;">${pack.summary}</p>
                <div class="meta-list">
                  <div>🧭 <strong>汇合建议：</strong>${pack.modeRec}</div>
                  <div>🏞️ <strong>串联点位：</strong>${pack.spotsIncluded.join(' → ')}</div>
                  <div>☔ <strong>全天候B计划：</strong>${pack.planB}</div>
                </div>
              </div>
              <div class="card-actions">
                <button type="button" class="btn btn-primary" data-action="openPackModal" data-event="click" data-arg1="${pack.id}" data-type1="string">🕒 查看两天分时作息级路书 & 雷达图</button>
              </div>
            </article>
          `;
        }).join('');

      } else if (state.perspective === 'crossCity') {
        container.className = 'cards-grid';
        byId('resultCountText').innerHTML =
          `🌉 环深跨城 3天2晚微度假精选（周五15:30出发 → 周日返程，共 <span style="color:var(--terracotta);">${CROSS_CITY_ROUTES.length}</span> 条低频精品线）`;
        const b = getBudgetParams();

        container.innerHTML = CROSS_CITY_ROUTES.map(route => {
          const drive = state.departMode === 'A' ? route.driveA : route.driveB;
          const road = state.departMode === 'A' ? route.routeA : route.routeB;
          const estTotal = b.total + route.tollCost;
          return `
            <article class="spot-card">
              <div>
                <div class="card-top-badges">
                  <span class="district-pill">🏙️ ${route.city}</span>
                  <span class="cat-pill">跨城 3天2晚/2天1晚</span>
                </div>
                <div class="spot-title">
                  <span>${route.name}</span>
                  <span class="spot-score">★ ${route.score}</span>
                </div>
                <div class="drive-info-bar">
                  <span>🚗 单程：<strong>${drive} 分钟</strong></span>
                  <span>🛣️ 往返过路费：¥${route.tollCost} | 总预算约 <strong>¥${estTotal}</strong></span>
                </div>
                <div class="kid-dual-box">
                  <div class="kid-cell">
                    <strong>👦 3.5岁大宝核心体验</strong>
                    <span>${route.kid35}</span>
                  </div>
                  <div class="kid-cell baby">
                    <strong>👶 8月龄二宝睡眠与推车</strong>
                    <span>${route.kid08}</span>
                  </div>
                </div>
                <div class="meta-list">
                  <div>🛣️ <strong>高速走法：</strong>${road}</div>
                  <div>🏨 <strong>亲子酒店推荐：</strong>${route.hotelRec}</div>
                  <div>☔ <strong>室内B计划：</strong>${route.planB}</div>
                </div>
              </div>
              <div class="card-actions">
                <button type="button" class="btn btn-primary" data-action="openCrossModal" data-event="click" data-arg1="${route.id}" data-type1="string">📅 查看周五至周日 3天2晚分时路书</button>
              </div>
            </article>
          `;
        }).join('');

      } else if (state.perspective === 'gear') {
        container.className = 'checklist-grid';
        container.innerHTML = GEAR_CATEGORIES.map(cat => `
          <div class="panel-card">
            <div class="panel-title"><span>${cat.title}</span></div>
            <div>
              ${cat.items.map(it => {
                const isChecked = state.checkedGear.has(it.id);
                return `
                  <label class="check-item ${isChecked ? 'checked' : ''}">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} data-action="toggleGearItem" data-event="change" data-arg1="${it.id}" data-type1="string" />
                    <span>${it.text}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        `).join('');
      }
    }

    /********************************************************************
     * 5. SVG 六维雷达图生成器与弹窗路书
     ********************************************************************/
    function buildRadarSVG(scores) {
      // scores: [推车丝滑, 母婴设施, 3.5岁放电, 停车便利, 遮阳恒温, 性价比]
      const labels = ['8月龄推车丝滑', '五星母婴室', '3.5岁放电指数', '停车/超充便利', '林荫/恒温避晒', '免票性价比'];
      const cx = 130, cy = 125, r = 80;
      const angles = [0, 60, 120, 180, 240, 300].map(a => (a - 90) * Math.PI / 180);

      const gridPolygons = [0.35, 0.7, 1.0].map(scale => {
        const pts = angles.map(ang => `${cx + r * scale * Math.cos(ang)},${cy + r * scale * Math.sin(ang)}`).join(' ');
        return `<polygon points="${pts}" fill="none" stroke="#D6C9B1" stroke-width="1"/>`;
      }).join('');

      const dataPts = scores.map((val, idx) => {
        const ratio = val / 100;
        const x = cx + r * ratio * Math.cos(angles[idx]);
        const y = cy + r * ratio * Math.sin(angles[idx]);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

      const labelNodes = labels.map((lb, idx) => {
        const lx = cx + (r + 24) * Math.cos(angles[idx]);
        const ly = cy + (r + 18) * Math.sin(angles[idx]);
        return `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#141413" font-weight="600">${lb}(${scores[idx]})</text>`;
      }).join('');

      return `
        <svg width="260" height="250" viewBox="0 0 260 250">
          ${gridPolygons}
          <polygon points="${dataPts}" fill="rgba(82, 119, 102, 0.22)" stroke="#527766" stroke-width="2.5"/>
          ${labelNodes}
        </svg>
      `;
    }

    function openSpotModal(spotId) {
      const spot = LOCAL_SPOTS.find(s => s.id === spotId);
      if (!spot) return;
      const drive = state.departMode === 'A' ? spot.driveA : spot.driveB;
      const route = state.departMode === 'A' ? spot.routeA : spot.routeB;

      byId('modalBodyContent').innerHTML = `
        <button type="button" class="modal-close" aria-label="关闭详情" data-action="closeModal" data-event="click">×</button>
        <div class="card-top-badges" style="justify-content:flex-start;">
          <span class="district-pill">${spot.district} · ${spot.subarea}</span>
          <span class="cat-pill">${spot.category}</span>
        </div>
        <h2 class="serif" style="font-size:22px;margin-bottom:6px;">${spot.name}</h2>
        <p style="font-size:13px;color:var(--ink-secondary);">
          🚗 <strong>自驾路线：</strong>${route}（单程约 ${drive} 分钟） | 🔔 <strong>预约提示：</strong>${spot.reserveTip}
        </p>
        <div class="modal-grid">
          <div style="background:var(--bg-elevated);border:1px solid var(--border-soft);border-radius:10px;padding:12px;text-align:center;">
            <h4 style="font-size:14px;color:var(--teal-primary);margin-bottom:4px;">六维双娃友好度雷达测评</h4>
            ${buildRadarSVG(spot.radar)}
          </div>
          <div class="timeline-box">
            <div class="timeline-item">
              <div class="timeline-time">👦 3.5岁大宝高能放电攻略</div>
              <div style="font-size:13px;margin-top:4px;">${spot.kid35}</div>
            </div>
            <div class="timeline-item" style="border-left-color:var(--terracotta);">
              <div class="timeline-time" style="color:var(--terracotta);">👶 8月龄二宝推车与睡眠指引</div>
              <div style="font-size:13px;margin-top:4px;">${spot.kid08}</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-time">🅿️ 停车位与五星母婴室精确点位</div>
              <div style="font-size:13px;margin-top:4px;">
                <strong>停车：</strong>${spot.parking}<br/>
                <strong>母婴室：</strong>${spot.nursing}
              </div>
            </div>
            <div class="timeline-item" style="background:var(--terracotta-light);">
              <div class="timeline-time" style="color:var(--terracotta);">☔ 晴雨/高温暴晒即时切换 B 计划</div>
              <div style="font-size:13px;margin-top:4px;">${spot.planB}</div>
            </div>
          </div>
        </div>
      `;
      showDialog();
    }

    function openPackModal(packId) {
      const pack = LOCAL_PACKS.find(p => p.id === packId);
      if (!pack) return;
      byId('modalBodyContent').innerHTML = `
        <button type="button" class="modal-close" aria-label="关闭详情" data-action="closeModal" data-event="click">×</button>
        <span class="district-pill">${pack.area}</span>
        <h2 class="serif" style="font-size:22px;margin:6px 0;">${pack.title}</h2>
        <p style="font-size:13px;color:var(--ink-secondary);">${pack.modeRec}</p>
        <div class="modal-grid">
          <div style="background:var(--bg-elevated);border:1px solid var(--border-soft);border-radius:10px;padding:12px;text-align:center;">
            <h4 style="font-size:14px;color:var(--teal-primary);">打包路线六维综合评分</h4>
            ${buildRadarSVG(pack.radar)}
            <div style="text-align:left;font-size:12px;margin-top:8px;padding:8px;background:var(--bg-panel);border-radius:6px;">
              <strong>☔ 恶劣天气备选：</strong><br/>${pack.planB}
            </div>
          </div>
          <div class="timeline-box">
            ${pack.timeline.map(t => `
              <div class="timeline-item">
                <div class="timeline-time">🕒 ${t.time} | ${t.title}</div>
                <div style="font-size:13px;margin-top:4px;">${t.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      showDialog();
    }

    function openCrossModal(crossId) {
      const route = CROSS_CITY_ROUTES.find(r => r.id === crossId);
      if (!route) return;
      byId('modalBodyContent').innerHTML = `
        <button type="button" class="modal-close" aria-label="关闭详情" data-action="closeModal" data-event="click">×</button>
        <span class="district-pill">${route.city} · 3天2晚微度假</span>
        <h2 class="serif" style="font-size:22px;margin:6px 0;">${route.name}</h2>
        <p style="font-size:13px;color:var(--ink-secondary);">🏨 <strong>推荐下榻：</strong>${route.hotelRec}</p>
        <div class="modal-grid">
          <div style="background:var(--bg-elevated);border:1px solid var(--border-soft);border-radius:10px;padding:12px;text-align:center;">
            <h4 style="font-size:14px;color:var(--teal-primary);">跨城微度假六维评分</h4>
            ${buildRadarSVG(route.radar)}
            <div style="text-align:left;font-size:12px;margin-top:8px;padding:8px;background:var(--bg-panel);border-radius:6px;">
              <strong>☔ 室内B计划：</strong><br/>${route.planB}
            </div>
          </div>
          <div class="timeline-box">
            ${route.timeline.map(t => `
              <div class="timeline-item">
                <div class="timeline-time">📅 ${t.time} | ${t.title}</div>
                <div style="font-size:13px;margin-top:4px;">${t.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      showDialog();
    }

    function closeModal() {
      hideDialog();
    }

    /********************************************************************
     * 6. 周末两日自由拼装工作台 & 装备持久化
     ********************************************************************/
    function addToPlan(day, spotId) {
      const arr = state.customPlan[day];
      if (!arr.includes(spotId)) {
        arr.push(spotId);
      }
      renderCustomPlanBar();
    }

    function removeFromPlan(day, spotId) {
      state.customPlan[day] = state.customPlan[day].filter(id => id !== spotId);
      renderCustomPlanBar();
    }

    function clearCustomPlan() {
      state.customPlan.sat = [];
      state.customPlan.sun = [];
      renderCustomPlanBar();
    }

    function renderCustomPlanBar() {
      ['sat', 'sun'].forEach(day => {
        const container = byId(day + 'SlotList');
        const ids = state.customPlan[day];
        if (ids.length === 0) {
          container.innerHTML = `<span style="opacity:0.7;font-size:12px;">点击卡片「+${day === 'sat' ? '周六' : '周日'}」加入</span>`;
        } else {
          container.innerHTML = ids.map(id => {
            const sp = LOCAL_SPOTS.find(s => s.id === id);
            return `
              <span class="slot-pill">
                ${sp.name.split('（')[0]}
                <button type="button" data-action="removeFromPlan" data-event="click" data-arg1="${day}" data-type1="string" data-arg2="${id}" data-type2="string">×</button>
              </span>
            `;
          }).join('');
        }
      });
    }

    function openCustomPlanModal() {
      const satSpots = state.customPlan.sat.map(id => LOCAL_SPOTS.find(s => s.id === id)).filter(Boolean);
      const sunSpots = state.customPlan.sun.map(id => LOCAL_SPOTS.find(s => s.id === id)).filter(Boolean);

      if (satSpots.length === 0 && sunSpots.length === 0) {
        alert('请先在深圳本地图谱卡片上点击「+ 加入周六」或「+ 加入周日」添加点位！');
        return;
      }

      const allSelected = [...satSpots, ...sunSpots];
      const reserveAlerts = allSelected.filter(s => !s.noReserve);

      byId('modalBodyContent').innerHTML = `
        <button type="button" class="modal-close" aria-label="关闭详情" data-action="closeModal" data-event="click">×</button>
        <h2 class="serif" style="font-size:22px;color:var(--teal-primary);margin-bottom:8px;">📋 您的专属定制周末两日自驾路书</h2>
        ${reserveAlerts.length > 0 ? `
          <div style="background:#FFF3CD;border:1px solid #FFEEBA;color:#856404;padding:10px 14px;border-radius:8px;margin-bottom:14px;font-size:13px;">
            <strong>🔔 出发前必办预约提醒（共 ${reserveAlerts.length} 项）：</strong>
            <ul style="margin-left:18px;margin-top:4px;">
              ${reserveAlerts.map(r => `<li><strong>${r.name}：</strong>${r.reserveTip}</li>`).join('')}
            </ul>
          </div>
        ` : `<div style="background:var(--teal-light);padding:8px 12px;border-radius:8px;margin-bottom:12px;font-size:13px;color:var(--teal-primary);">✅ 您所选的点位全部免预约，周末可随时说走就走！</div>`}

        <div class="timeline-box">
          <h3 class="serif" style="font-size:17px;color:var(--terracotta);">🗓️ 周六行程安排（${satSpots.length} 个点位）</h3>
          ${satSpots.length === 0 ? `<p style="font-size:13px;color:var(--ink-muted);">暂未添加周六点位</p>` : satSpots.map((s, idx) => `
            <div class="timeline-item">
              <div class="timeline-time">第 ${idx + 1} 站（建议 ${idx === 0 ? '09:30-12:00 上午精力高峰' : '14:30-17:30 午睡后'}）：${s.name}</div>
              <div style="font-size:12.5px;margin-top:4px;">
                🅿️ <strong>停车：</strong>${s.parking} | 🍼 <strong>母婴室：</strong>${s.nursing}<br/>
                👦 <strong>3.5岁：</strong>${s.kid35} | 👶 <strong>8月龄：</strong>${s.kid08}
              </div>
            </div>
          `).join('')}

          <h3 class="serif" style="font-size:17px;color:var(--terracotta);margin-top:10px;">🗓️ 周日行程安排（${sunSpots.length} 个点位）</h3>
          ${sunSpots.length === 0 ? `<p style="font-size:13px;color:var(--ink-muted);">暂未添加周日点位</p>` : sunSpots.map((s, idx) => `
            <div class="timeline-item">
              <div class="timeline-time">第 ${idx + 1} 站（建议 ${idx === 0 ? '09:30-12:00 上午' : '14:30-17:30 下午'}）：${s.name}</div>
              <div style="font-size:12.5px;margin-top:4px;">
                🅿️ <strong>停车：</strong>${s.parking} | 🍼 <strong>母婴室：</strong>${s.nursing}<br/>
                👦 <strong>3.5岁：</strong>${s.kid35} | 👶 <strong>8月龄：</strong>${s.kid08}
              </div>
            </div>
          `).join('')}
        </div>
      `;
      showDialog();
    }

    function toggleGearItem(itemId) {
      if (state.checkedGear.has(itemId)) {
        state.checkedGear.delete(itemId);
      } else {
        state.checkedGear.add(itemId);
      }
      saveGear([...state.checkedGear]);
      updateGearBadge();
      renderMainContent();
    }

    function updateGearBadge() {
      const total = GEAR_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);
      const pct = Math.round((state.checkedGear.size / total) * 100);
      byId('gearProgressBadge').textContent = `已备 ${pct}%`;
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp, {once:true});
    else initApp();
  
})();
