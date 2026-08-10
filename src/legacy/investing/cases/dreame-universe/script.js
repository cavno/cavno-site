// ========== 通用 ECharts 主题配置 ==========
const T = {
  bg: 'transparent',
  text: '#201e1a',
  textDim: '#5d5850',
  textFaint: '#8a847b',
  accent: '#c2643b',
  accentDim: 'rgba(194,100,59,0.45)',
  border: 'rgba(31,29,25,0.14)',
  surface: 'rgba(255,255,255,0.82)',
  mono: 'JetBrains Mono, SF Mono, monospace',
  sans: '-apple-system, Segoe UI, PingFang SC, Microsoft YaHei UI, Inter, system-ui, sans-serif',
};

// ========== Chart 1: 控制链路(graph 力导向) ==========
(function(){
  const el = document.getElementById('chart-control');
  if(!el) return;
  const chart = echarts.init(el,null,{renderer:'canvas'});
  chart.setOption({
    backgroundColor: T.bg,
    tooltip:{
      backgroundColor:'rgba(255,255,255,0.96)',
      borderColor:T.border,
      borderWidth:1,
      textStyle:{color:T.text,fontFamily:T.sans,fontSize:12},
      formatter:p=>p.data.tip||p.name,
    },
    series:[{
      type:'graph',
      layout:'force',
      roam:false,
      animation:true,
      animationDuration:1200,
      symbolSize:24,
      force:{repulsion:380,edgeLength:[80,140],gravity:0.12},
      label:{show:true,position:'right',color:T.text,fontFamily:T.sans,fontSize:12,fontWeight:500,distance:8,formatter:p=>p.data.short||p.name},
      edgeLabel:{show:true,formatter:p=>p.data.lbl||'',color:T.textDim,fontSize:10,fontFamily:T.mono,backgroundColor:'rgba(6,6,8,0.7)',padding:[2,5]},
      lineStyle:{color:'#6ea4ff',width:1.4,opacity:0.5,curveness:0.1},
      data:[
        {id:'yh',name:'俞浩',short:'俞浩',symbolSize:54,itemStyle:{color:T.accent,shadowBlur:24,shadowColor:T.accentDim},label:{fontSize:14,fontWeight:700,color:'#fff'},tip:'实际控制人 · 直接 31.15% + 间接 19.02%'},
        {id:'tk',name:'天空漫步科技(苏州)',short:'天空漫步',symbolSize:32,itemStyle:{color:'#6ea4ff'},tip:'俞浩 100% 控股的持股平台'},
        {id:'dr',name:'追觅科技(苏州)',short:'追觅科技',symbolSize:48,itemStyle:{color:'#e0e0e6'},label:{fontWeight:600,color:'#fff'},tip:'集团运营主体 · 2017-12 成立'},
        {id:'em',name:'追觅企业管理(天津)',short:'员工持股',symbolSize:24,itemStyle:{color:'#8a8a92'},tip:'员工持股平台 · 2017-10-25'},
        {id:'xc',name:'行胜于言(厦门)',short:'行胜于言',symbolSize:22,itemStyle:{color:'#8a8a92'},tip:'关联持股平台'},
        {id:'kn',name:'西藏昆诺赢展',short:'西藏昆诺',symbolSize:20,itemStyle:{color:'#5a5a64'},tip:'财务投资 · 6.93%'},
        {id:'sd',name:'宁波时代展鹏',short:'宁波时代',symbolSize:19,itemStyle:{color:'#5a5a64'},tip:'财务投资 · 5.35%'},
        {id:'ao',name:'宁波奥闻投资',short:'宁波奥闻',symbolSize:18,itemStyle:{color:'#5a5a64'},tip:'财务投资 · 3.96%'},
      ],
      links:[
        {source:'yh',target:'tk',lbl:'100%',lineStyle:{color:T.accent,width:2,opacity:0.85}},
        {source:'yh',target:'dr',lbl:'31.15%',lineStyle:{color:T.accent,width:2.2,opacity:0.9}},
        {source:'tk',target:'dr',lbl:'19.02%',lineStyle:{color:'#6ea4ff',width:2,opacity:0.85}},
        {source:'em',target:'dr',lbl:'9.55%',lineStyle:{color:'#8a8a92',width:1.6}},
        {source:'xc',target:'dr',lbl:'5.24%',lineStyle:{color:'#8a8a92',width:1.4}},
        {source:'kn',target:'dr',lbl:'6.93%',lineStyle:{color:'#5a5a64',width:1.3}},
        {source:'sd',target:'dr',lbl:'5.35%',lineStyle:{color:'#5a5a64',width:1.2}},
        {source:'ao',target:'dr',lbl:'3.96%',lineStyle:{color:'#5a5a64',width:1.1}},
      ],
    }],
  });
  window.addEventListener('resize',()=>chart.resize());
})();

// ========== Chart 2: 持股环 Donut ==========
(function(){
  const el = document.getElementById('chart-equity');
  if(!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    backgroundColor:T.bg,
    color:['#ff6a3d','#ff9466','#ffb591','#6ea4ff','#9ab8f0','#a08070','#7a7a82','#5a5a64','#3a3a42'],
    tooltip:{
      trigger:'item',
      backgroundColor:'rgba(255,255,255,0.96)',
      borderColor:T.border,
      borderWidth:1,
      textStyle:{color:T.text,fontFamily:T.sans,fontSize:12},
      formatter:p=>`<div style="font-weight:600;margin-bottom:4px">${p.name}</div><div style="color:#9a9aa3;font-family:monospace">${p.value}% · ${p.data.tag||''}</div>`,
    },
    legend:{
      orient:'vertical',right:'4%',top:'middle',
      textStyle:{color:T.textDim,fontFamily:T.sans,fontSize:13},
      itemWidth:10,itemHeight:10,itemGap:14,
    },
    series:[{
      type:'pie',
      radius:['44%','72%'],
      center:['32%','50%'],
      avoidLabelOverlap:false,
      label:{show:false},
      labelLine:{show:false},
      itemStyle:{borderColor:'#060608',borderWidth:2},
      emphasis:{label:{show:true,fontSize:18,fontWeight:600,color:T.text,formatter:'{b}\n{c}%'}},
      data:[
        {value:31.15,name:'俞浩(个人)',tag:'实控人 · 直接'},
        {value:19.02,name:'天空漫步科技',tag:'俞浩 100% 持股平台'},
        {value:9.55,name:'追觅企管(天津)',tag:'员工持股'},
        {value:6.93,name:'西藏昆诺赢展',tag:'财务投资'},
        {value:5.35,name:'宁波时代展鹏',tag:'财务投资'},
        {value:5.24,name:'行胜于言(厦门)',tag:'关联持股平台'},
        {value:3.96,name:'宁波奥闻投资',tag:'财务投资'},
        {value:18.80,name:'其他股东',tag:'C 轮跟投 / 老股回购后残值'},
      ],
    }],
    graphic:[
      {type:'text',left:'29%',top:'44%',style:{text:'50.17%',fill:T.accent,fontSize:42,fontWeight:700,fontFamily:T.mono},z:10},
      {type:'text',left:'30%',top:'56%',style:{text:'实控人合计',fill:T.textDim,fontSize:13,fontFamily:T.sans},z:10},
    ],
  });
  window.addEventListener('resize',()=>chart.resize());
})();

// ========== Chart 3: 关系网络 graph ==========
(function(){
  const el = document.getElementById('chart-network');
  if(!el) return;
  const chart = echarts.init(el);

  const C = {founder:T.accent,core:'#e0e0e6',platform:'#6ea4ff',personal:'#a08060',alumni:'#4a4a52',risk:'#ff4d6d'};

  chart.setOption({
    backgroundColor:T.bg,
    tooltip:{
      backgroundColor:'rgba(255,255,255,0.96)',
      borderColor:T.border,
      textStyle:{color:T.text,fontFamily:T.sans,fontSize:12},
      formatter:p=>p.dataType==='node'?`<div style="font-weight:600;margin-bottom:4px">${p.data.name}</div><div style="color:#9a9aa3;font-size:12.5px;font-family:monospace">${p.data.tip||''}</div>`:`${p.data.lbl||''}`,
    },
    series:[{
      type:'graph',
      layout:'force',
      roam:true,
      animation:true,
      animationDuration:1500,
      force:{repulsion:520,edgeLength:[100,180],gravity:0.08,layoutAnimation:true},
      label:{show:true,color:T.text,fontFamily:T.sans,fontSize:11,position:'bottom',distance:5},
      lineStyle:{color:'source',width:1,opacity:0.45,curveness:0.08},
      emphasis:{focus:'adjacency',label:{fontWeight:600},lineStyle:{width:2.5,opacity:0.9}},
      categories:[
        {name:'实控人'},{name:'追觅本体'},{name:'持股平台'},{name:'俞浩个人系'},{name:'离职创业'},{name:'风险节点'},
      ],
      data:[
        // 实控人
        {id:'yh',name:'俞浩',category:0,symbolSize:60,itemStyle:{color:C.founder,shadowBlur:28,shadowColor:T.accentDim},label:{fontSize:14,fontWeight:700,color:'#fff'},tip:'实际控制人 · 1987 · 清华航空 · 85 亿身家'},
        // 追觅本体 4 个
        {id:'dr',name:'追觅科技',category:1,symbolSize:44,itemStyle:{color:C.core},label:{fontWeight:600},tip:'追觅科技(苏州)有限公司 · 2017-12'},
        {id:'drcx',name:'追觅创新科技',category:1,symbolSize:28,itemStyle:{color:C.core},tip:'2018-07 · 子公司母层 · 法人曹莉莉'},
        {id:'drzn',name:'追觅智能科技',category:1,symbolSize:26,itemStyle:{color:C.core},tip:'2021-05 · 注册 2000 万 · 法人曹莉莉'},
        {id:'drsz',name:'追觅(深圳)',category:1,symbolSize:24,itemStyle:{color:C.core},tip:'研发销售平台'},
        {id:'drcc',name:'追觅驰宸',category:1,symbolSize:28,itemStyle:{color:C.core},tip:'2026-01 · 注册 20 亿 · 机器人研发'},
        {id:'dryc',name:'追觅曜宸',category:1,symbolSize:26,itemStyle:{color:C.core},tip:'2026-01 · 注册 20 亿 · 机器人研发'},
        {id:'dhk',name:'Dreame HK',category:1,symbolSize:26,itemStyle:{color:C.core},tip:'2020-12 · 编号 3006519 · 出海主体'},
        // 持股平台 5 个
        {id:'tkmb',name:'天空漫步',category:2,symbolSize:34,itemStyle:{color:C.platform},tip:'苏州 · 俞浩 100% · 持追觅 19.02%'},
        {id:'tkay',name:'天空翱翔',category:2,symbolSize:28,itemStyle:{color:C.platform},tip:'上海 · 持星空计划 96.65%'},
        {id:'tktl',name:'天空踏浪',category:2,symbolSize:22,itemStyle:{color:C.platform},tip:'北京 · 投资工具'},
        {id:'tkwj',name:'天空无际',category:2,symbolSize:22,itemStyle:{color:C.platform},tip:'苏州 · 投资工具'},
        {id:'tkww',name:'天空无畏',category:2,symbolSize:22,itemStyle:{color:C.platform},tip:'苏州 · 持星宸未来'},
        {id:'kt',name:'可庭科技',category:2,symbolSize:30,itemStyle:{color:C.platform},tip:'苏州 · 高端园林品牌 · 逐越鸿智最大 LP 43.8%'},
        {id:'lcv',name:'长空纪元',category:2,symbolSize:22,itemStyle:{color:C.platform},tip:'俞浩 100% · 逐越鸿智 GP'},
        {id:'zyhz',name:'苏州逐越鸿智',category:2,symbolSize:34,itemStyle:{color:C.platform},tip:'2025-09 合伙企业 · 收购嘉美包装主体'},
        {id:'zyhj',name:'逐越鸿杰',category:2,symbolSize:22,itemStyle:{color:C.platform},tip:'天空工场资本 · 13.2% 出资'},
        // 俞浩个人系 8 个
        {id:'sx',name:'星空计划',category:3,symbolSize:34,itemStyle:{color:C.personal},tip:'2025-01 · 上海 · 注册 10 亿 · 法人战中国'},
        {id:'xch',name:'星宸未来',category:3,symbolSize:28,itemStyle:{color:C.personal},tip:'2025-06 · 苏州 · 柏美芳 99.99% · 追觅汽车'},
        {id:'zxjj',name:'转芯净界',category:3,symbolSize:24,itemStyle:{color:C.personal},tip:'南京 · 洗烘'},
        {id:'bkjy',name:'冰氪纪元',category:3,symbolSize:24,itemStyle:{color:C.personal},tip:'南京 · 冰箱'},
        {id:'xczg',name:'星辰智谷',category:3,symbolSize:22,itemStyle:{color:C.personal},tip:'南京 · 大家电基地运营'},
        {id:'mfzy',name:'魔法原子',category:3,symbolSize:32,itemStyle:{color:C.personal},tip:'2023-12 · 无锡 · 追一控股 69.78%'},
        {id:'mfgc',name:'魔法工场',category:3,symbolSize:22,itemStyle:{color:C.personal},tip:'魔法原子 100% 母层'},
        {id:'zykg',name:'追一控股',category:3,symbolSize:26,itemStyle:{color:C.personal},tip:'苏州 · 魔法工场 69.78% 母层'},
        {id:'jm',name:'嘉美包装 002969',category:3,symbolSize:36,itemStyle:{color:C.personal,borderColor:T.accent,borderWidth:1.5},tip:'A 股 · 2025-12 控制权变更 · 持股上限 54.9%'},
        // 离职创业 5 个
        {id:'wsl',name:'王生乐',category:4,symbolSize:24,itemStyle:{color:C.alumni},tip:'联合创始人 → 星迈创新 Beatbot'},
        {id:'grj',name:'郭人杰',category:4,symbolSize:24,itemStyle:{color:C.alumni},tip:'前中国区执行总裁 → 乐享科技'},
        {id:'yc',name:'喻超',category:4,symbolSize:22,itemStyle:{color:C.alumni},tip:'人形机器人业务负责人 → 鹿明机器人'},
        {id:'wp',name:'吴鹏',category:4,symbolSize:20,itemStyle:{color:C.alumni},tip:'早期核心 → 咖爷科技'},
        {id:'bmf',name:'柏美芳',category:4,symbolSize:24,itemStyle:{color:C.alumni},tip:'联合创始人 · 星宸未来 99.99%'},
        // 风险节点 2 个
        {id:'dyson',name:'Dyson UPC 案',category:5,symbolSize:30,itemStyle:{color:C.risk},tip:'UPC_CFI_387/2025 · 2025-08-14 禁售 18 国'},
        {id:'wzn',name:'吴长征离职',category:5,symbolSize:24,itemStyle:{color:C.risk},tip:'2026-03 · 春晚营销争议'},
      ],
      links:[
        // 俞浩控制
        {source:'yh',target:'dr',lbl:'31.15% 直接'},
        {source:'yh',target:'tkmb',lbl:'100%'},
        {source:'tkmb',target:'dr',lbl:'19.02%'},
        // 追觅子公司
        {source:'dr',target:'drcx'},{source:'dr',target:'drzn'},{source:'dr',target:'drsz'},
        {source:'dr',target:'drcc'},{source:'dr',target:'dryc'},{source:'dr',target:'dhk'},
        // 天空系
        {source:'yh',target:'tkay'},{source:'yh',target:'tktl'},{source:'yh',target:'tkwj'},{source:'yh',target:'tkww'},
        {source:'yh',target:'kt'},{source:'yh',target:'lcv'},
        // 造车
        {source:'tkay',target:'sx',lbl:'96.65%'},
        {source:'tkww',target:'xch',lbl:'柏美芳载体'},
        // 大家电
        {source:'yh',target:'zxjj'},{source:'yh',target:'bkjy'},{source:'yh',target:'xczg'},
        // 机器人
        {source:'dr',target:'zykg'},{source:'zykg',target:'mfgc',lbl:'69.78%'},{source:'mfgc',target:'mfzy',lbl:'100%'},
        // 资本运作
        {source:'kt',target:'zyhz',lbl:'43.8%'},
        {source:'lcv',target:'zyhz',lbl:'0.1% GP'},
        {source:'drcx',target:'zyhz',lbl:'12.3%'},
        {source:'zyhj',target:'zyhz',lbl:'13.2%'},
        {source:'zyhz',target:'jm',lbl:'54.9%'},
        // 离职创业
        {source:'yh',target:'wsl',lbl:'前同事'},
        {source:'yh',target:'grj',lbl:'前同事'},
        {source:'yh',target:'yc',lbl:'前同事'},
        {source:'yh',target:'wp',lbl:'前同事'},
        {source:'yh',target:'bmf',lbl:'联合创始人'},
        {source:'bmf',target:'xch',lbl:'99.99%'},
        // 风险
        {source:'dhk',target:'dyson',lbl:'被告',lineStyle:{color:C.risk,opacity:0.6}},
        {source:'mfzy',target:'wzn',lbl:'CEO 离职',lineStyle:{color:C.risk,opacity:0.6}},
      ],
    }],
  });
  window.addEventListener('resize',()=>chart.resize());
})();

// ========== Chart 4: 嘉美包装资金桑基 ==========
(function(){
  const el = document.getElementById('chart-sankey-jiamei');
  if(!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    backgroundColor:T.bg,
    tooltip:{
      backgroundColor:'rgba(255,255,255,0.96)',
      borderColor:T.border,
      textStyle:{color:T.text,fontFamily:T.sans,fontSize:12},
    },
    series:[{
      type:'sankey',
      left:'4%',right:'18%',top:'8%',bottom:'8%',
      data:[
        {name:'可庭科技 43.8%',itemStyle:{color:T.accent}},
        {name:'逐越鸿杰 13.2%',itemStyle:{color:'#ff8c5e'}},
        {name:'追觅创新科技 12.3%',itemStyle:{color:'#ffae80'}},
        {name:'追觅创业孵化器 8.8%',itemStyle:{color:'#ffc9a3'}},
        {name:'长空纪元 GP 0.1%',itemStyle:{color:'#ffe0c4'}},
        {name:'其他 21.8%',itemStyle:{color:'#7a7a82'}},
        {name:'苏州逐越鸿智',itemStyle:{color:'#6ea4ff'}},
        {name:'协议受让 29.9% · 12.43 亿',itemStyle:{color:'#9ab8f0'}},
        {name:'部分要约 25% · 10.39 亿',itemStyle:{color:'#9ab8f0'}},
        {name:'嘉美包装 002969 · 54.9% 控股',itemStyle:{color:'#e0e0e6'}},
      ],
      links:[
        {source:'可庭科技 43.8%',target:'苏州逐越鸿智',value:43.8},
        {source:'逐越鸿杰 13.2%',target:'苏州逐越鸿智',value:13.2},
        {source:'追觅创新科技 12.3%',target:'苏州逐越鸿智',value:12.3},
        {source:'追觅创业孵化器 8.8%',target:'苏州逐越鸿智',value:8.8},
        {source:'长空纪元 GP 0.1%',target:'苏州逐越鸿智',value:0.1},
        {source:'其他 21.8%',target:'苏州逐越鸿智',value:21.8},
        {source:'苏州逐越鸿智',target:'协议受让 29.9% · 12.43 亿',value:54.5},
        {source:'苏州逐越鸿智',target:'部分要约 25% · 10.39 亿',value:45.5},
        {source:'协议受让 29.9% · 12.43 亿',target:'嘉美包装 002969 · 54.9% 控股',value:54.5},
        {source:'部分要约 25% · 10.39 亿',target:'嘉美包装 002969 · 54.9% 控股',value:45.5},
      ],
      label:{color:T.text,fontFamily:T.sans,fontSize:12,fontWeight:500},
      lineStyle:{color:'gradient',curveness:0.5,opacity:0.45},
      emphasis:{focus:'adjacency',lineStyle:{opacity:0.75}},
      nodeAlign:'left',
      nodeGap:8,
      nodeWidth:14,
    }],
  });
  window.addEventListener('resize',()=>chart.resize());
})();

// ========== Chart 5: 产业基金桑基 ==========
(function(){
  const el = document.getElementById('chart-sankey-funds');
  if(!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    backgroundColor:T.bg,
    tooltip:{
      backgroundColor:'rgba(255,255,255,0.96)',
      borderColor:T.border,
      textStyle:{color:T.text,fontFamily:T.sans,fontSize:12},
    },
    series:[{
      type:'sankey',
      left:'3%',right:'18%',top:'5%',bottom:'5%',
      data:[
        // LP 层
        {name:'绍兴市 / 滨海 / 越城',itemStyle:{color:T.accent}},
        {name:'厦门国资',itemStyle:{color:'#ff8c5e'}},
        {name:'宁波国资',itemStyle:{color:'#ffae80'}},
        {name:'南京国资',itemStyle:{color:'#ffc9a3'}},
        {name:'武汉临空港',itemStyle:{color:'#ffd9b5'}},
        {name:'其他 20+ 城市国资',itemStyle:{color:'#ffe9d2'}},
        {name:'追觅系 LP',itemStyle:{color:'#6ea4ff'}},
        // 基金层
        {name:'绍兴生态基金 100 亿',itemStyle:{color:'#9ab8f0'}},
        {name:'厦门国升追创 10 亿',itemStyle:{color:'#9ab8f0'}},
        {name:'宁波追创兴仑',itemStyle:{color:'#9ab8f0'}},
        {name:'南京追创重点产业',itemStyle:{color:'#9ab8f0'}},
        {name:'武汉追创智灵',itemStyle:{color:'#9ab8f0'}},
        {name:'厦门"博"系 8 只 35 亿',itemStyle:{color:'#9ab8f0'}},
        {name:'其他 50+ 只基金',itemStyle:{color:'#9ab8f0'}},
        // 投向
        {name:'追觅关联方 40 家',itemStyle:{color:'#e0e0e6',borderColor:T.accent,borderWidth:1}},
        {name:'外部被投 8 家',itemStyle:{color:'#7a7a82'}},
      ],
      links:[
        {source:'绍兴市 / 滨海 / 越城',target:'绍兴生态基金 100 亿',value:13.5},
        {source:'追觅系 LP',target:'绍兴生态基金 100 亿',value:16.5},
        {source:'厦门国资',target:'厦门国升追创 10 亿',value:6},
        {source:'追觅系 LP',target:'厦门国升追创 10 亿',value:4},
        {source:'宁波国资',target:'宁波追创兴仑',value:12},
        {source:'追觅系 LP',target:'宁波追创兴仑',value:3},
        {source:'南京国资',target:'南京追创重点产业',value:6.42},
        {source:'追觅系 LP',target:'南京追创重点产业',value:14.6},
        {source:'武汉临空港',target:'武汉追创智灵',value:8},
        {source:'追觅系 LP',target:'武汉追创智灵',value:2},
        {source:'厦门国资',target:'厦门"博"系 8 只 35 亿',value:14},
        {source:'追觅系 LP',target:'厦门"博"系 8 只 35 亿',value:21},
        {source:'其他 20+ 城市国资',target:'其他 50+ 只基金',value:60},
        {source:'追觅系 LP',target:'其他 50+ 只基金',value:40},
        // 基金 → 被投
        {source:'绍兴生态基金 100 亿',target:'追觅关联方 40 家',value:26},
        {source:'绍兴生态基金 100 亿',target:'外部被投 8 家',value:4},
        {source:'厦门国升追创 10 亿',target:'追觅关联方 40 家',value:8},
        {source:'厦门国升追创 10 亿',target:'外部被投 8 家',value:2},
        {source:'宁波追创兴仑',target:'追觅关联方 40 家',value:12},
        {source:'宁波追创兴仑',target:'外部被投 8 家',value:3},
        {source:'南京追创重点产业',target:'追觅关联方 40 家',value:18},
        {source:'南京追创重点产业',target:'外部被投 8 家',value:3},
        {source:'武汉追创智灵',target:'追觅关联方 40 家',value:8},
        {source:'武汉追创智灵',target:'外部被投 8 家',value:2},
        {source:'厦门"博"系 8 只 35 亿',target:'追觅关联方 40 家',value:28},
        {source:'厦门"博"系 8 只 35 亿',target:'外部被投 8 家',value:7},
        {source:'其他 50+ 只基金',target:'追觅关联方 40 家',value:80},
        {source:'其他 50+ 只基金',target:'外部被投 8 家',value:20},
      ],
      label:{color:T.text,fontFamily:T.sans,fontSize:11,fontWeight:500},
      lineStyle:{color:'gradient',curveness:0.5,opacity:0.4},
      emphasis:{focus:'adjacency',lineStyle:{opacity:0.75}},
      nodeAlign:'left',
      nodeGap:6,
      nodeWidth:12,
    }],
  });
  window.addEventListener('resize',()=>chart.resize());
})();

