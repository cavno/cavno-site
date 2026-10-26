/* 附件原文、段号、页码及交互规则保持原样；查询与事件限定到本页。 */
(() => {
'use strict';
const root=document.getElementById('ec-app');if(!root)return;
const byId=id=>root.querySelector('#'+id);

'use strict';
const SOURCE=JSON.parse(byId('source-data').textContent);
const paras=SOURCE.paragraphs;
const $=id=>byId(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const para=id=>paras[id-1];
const raw=id=>para(id).text;
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const ref=(ids,label)=>`<button class="ref" data-ref="${ids.join(',')}">${label||'原文段 '+ids.join('、')}</button>`;
const quote=(id,clean=false)=>`<div class="quote" id="source-p-${id}"><p>${esc(clean?raw(id).replace(/^•\s*/, ''):raw(id))}</p><div class="loc">原文段 ${id} · 缓存页 ${para(id).pages.join('、')} ${ref([id],'查看依据')}</div></div>`;
const compact=(ids)=>ids.map(i=>quote(i,true)).join('');
const stripLabel=(id)=>raw(id).replace(/^(张力来源：|转化机制：|【核心定义】)/,'');
const STAGES=[
 {name:'约束',sub:'在可能性中划界',initial:8,definition:'约束是动态的限定动作：在无差别的可能性空间中，划出“可以”与“不可以”的边界，产生第一层差异。',evidence:[7,8],note:'本阶段还没有自由的自我设定；自由的回返将约束改写为可反思修改的元约束。'},
 {name:'结构',sub:'约束留下持久形态',initial:8,core:45,evidence:[8,43,44,45],note:'组织与结构在后续被明确区分：结构是可以变化的具体实现方式。'},
 {name:'关系',sub:'节点之间打开连接',initial:10,core:49,evidence:[9,10,47,48,49]},
 {name:'系统',sub:'闭环、整体性与边界',initial:12,core:53,evidence:[11,12,51,52,53]},
 {name:'组织',sub:'保持身份的关系模式',initial:14,core:57,evidence:[13,14,55,56,57]},
 {name:'虚实分化',sub:'实体与内部表征分层',initial:16,core:61,evidence:[15,16,59,60,61],weak:91},
 {name:'认知',sub:'持续处理模型现实落差',initial:18,core:65,evidence:[17,18,63,64,65]},
 {name:'自指',sub:'把认知自身纳入模型',initial:20,core:69,evidence:[19,20,67,68,69],weak:92},
 {name:'自由',sub:'反思并重设自身约束',initial:22,core:73,evidence:[21,22,71,72,73],note:'定义中的“自我立法”须与后文“元目标依然是外部注入”的解构并读，终章再强调反思和重新裁决目的性的资格。'}
];
const EDGES=[
 {name:'重复化 / 凝固机制',tension:43,mechanism:44,core:45},
 {name:'共域耦合机制',tension:47,mechanism:48,core:49},
 {name:'反馈闭合机制',tension:51,mechanism:52,core:53},
 {name:'扰动筛选 / 不变量提炼机制',tension:55,mechanism:56,core:57},
 {name:'去耦合 / 媒介中立化机制',tension:59,mechanism:60,core:61,weak:91},
 {name:'误差比对机制',tension:63,mechanism:64,core:65},
 {name:'递归纳入自身机制',tension:67,mechanism:68,core:69,weak:92},
 {name:'约束的可及性 / 可修改机制',tension:71,mechanism:72,core:73}
];
const BEATS=[{name:'增殖 / 分化',role:80,example:81,refs:[79,80,81]},{name:'耦合 / 闭环',role:83,example:84,refs:[82,83,84]},{name:'选择性固化',role:86,example:87,refs:[85,86,87]}];
const OMEGA=[
 {name:'增殖',tool:'范畴论之对象余积',status:'原文：严格成立',kind:'claim',ids:[98,99,100,117,118,119],math:'Cₙ 中对象的余积（Coproduct）',description:'多个同层对象被平权并置于同一范畴语境；原文将其称为不追加外部强加约束的多元基质并存。'},
 {name:'结构化',tool:'高阶范畴论之态射对象化',status:'原文：严格成立',kind:'claim',ids:[99,101,120,121,122],math:'F: Cₙ → Cₙ₊₁',description:'原文以函子把被动态约束反复锁定的态射提升为高阶范畴中的单一对象，并以 ∞-范畴中关联路径的对象化作说明。'},
 {name:'耦合 · 静态关系',tool:'古典信息论之互信息',status:'原文：严格成立',kind:'claim',ids:[103,123,124,125],math:'I(X; Y) > 0',description:'原文以非零互信息定义静态关系，并提到超越阈值后的客观相关性。它紧接着指出：互信息不足以刻画动态闭环。'},
 {name:'耦合 · 动态系统',tool:'传递熵 / 因果涌现',status:'原文：前沿未定型',kind:'caveat',ids:[102,104,126,127,128],math:'持续反馈 / 反事实因果力',description:'原文要求刻画回路中持续的信息反馈及宏观因果效力，列举传递熵与因果涌现（如 Erik Hoel 的工作），同时承认发展争论与统一定义缺位。'},
 {name:'固化 / 选择',tool:'需预设评价标准的选择算子 S',status:'原文：无法内生推导',kind:'caveat',ids:[105,106,107,108,109,110,111,129,130,131],math:'选择标准的来源：未被推导',description:'原文认为任何选择都需要预设目标函数或适应度指标；以“维持自身存在”作标准又会循环预设组织。故只能公理化假定 S。'}
];
const SOLUTIONS=[
 {name:'自然选择模型',field:'达尔文主义生物学',paradigm:150,logic:152,test:153,limit:154,table:[179,180,181,182],ids:range(149,154)},
 {name:'自由能最小化 / 主动推理',field:'Friston 理论框架',paradigm:156,logic:158,test:159,limit:160,table:[183,184,185,186],ids:range(155,160)},
 {name:'观察者选择效应',field:'人择原理 / 宇宙学范式',paradigm:162,logic:164,test:165,limit:166,table:[187,188,189,190],ids:range(161,166)},
 {name:'神学 / 形而上学目的论',field:'古典哲学范式',paradigm:168,logic:170,test:171,limit:172,table:[191,192,193,194],ids:range(167,172)}
];
const TOPICS=[{a:1,b:38,name:'九环、回返、谱系与初步反思',view:'chain'},{a:39,b:73,name:'八次跃迁的张力、机制与定义',view:'chain'},{a:74,b:88,name:'三拍模式与普适性的潜在假设',view:'omega'},{a:89,b:92,name:'两处非必然跳跃',view:'conclusion'},{a:93,b:132,name:'Ω 的三次尝试与状态评估',view:'omega'},{a:133,b:140,name:'P/S 区分与自由的元目标',view:'purpose'},{a:141,b:172,name:'三项准则与四种历史方案',view:'purpose'},{a:173,b:195,name:'横向比较及方法论代价',view:'purpose'},{a:196,b:202,name:'终章三项总结与最终判词',view:'conclusion'}];
let state={view:'chain',step:0,layout:'spiral',beat:0,omega:0,solution:0,sourcePage:null};
let dialogTrigger=null;
function view(name,scroll=true){
 state.view=name;
 root.querySelectorAll('.view').forEach(e=>e.hidden=e.id!=='view-'+name);
 root.querySelectorAll('.mainnav [data-view]').forEach(e=>{e.classList.toggle('active',e.dataset.view===name);if(e.dataset.view===name)e.setAttribute('aria-current','page');else e.removeAttribute('aria-current')});
 if(name==='source')renderSource();
 if(scroll)$('view-'+name).scrollIntoView({behavior:'auto',block:'start'});
}
function nodeSelect(i){state.step=i*2;renderChain()}
function edgeSelect(i){state.step=i*2+1;renderChain()}
function renderChain(){
 $('prevBtn').disabled=state.step===0;$('nextBtn').disabled=state.step===16;
 const isNode=state.step%2===0; const i=Math.floor(state.step/2);
 $('stepCount').textContent=`${String(state.step+1).padStart(2,'0')} / 17 · ${isNode?'阶段':'跃迁'} ${i+1}`;
 $('stepProgress').style.width=((state.step+1)/17*100)+'%';
 $('stageStrip').innerHTML=STAGES.map((s,n)=>`<button data-node="${n}" aria-pressed="${isNode&&i===n}">${s.name}</button>`).join('');
 renderDiagram();
 const s=STAGES[i];
 if(isNode){
 $('inspector').innerHTML=`<div class="eyebrow">阶段 ${String(i+1).padStart(2,'0')} / 09</div><h2>${s.name}</h2><div class="sectionlabel"><span class="tag">原文概念</span><span>${s.sub}</span></div><div class="defbox"><h4>${s.core?'核心定义（原文）':'概念说明（据原文）'}</h4><p>${esc(s.core?stripLabel(s.core):s.definition)}</p>${ref([s.core||8])}</div><div class="articletext"><h4>在链条中的含义</h4><p>${esc(raw(s.initial))} ${ref([s.initial])}</p></div>${s.weak?`<div class="alert"><h4>此阶段的到达并非逻辑必然</h4><p>${esc(raw(s.weak).replace(/^•\s*/,''))} ${ref([s.weak])}</p></div>`:''}${s.note?`<p class="smallprint">${s.note} ${ref(i===0?[24,25]:i===1?[14,57]:[140,202])}</p>`:''}<div class="linked">${i>0?`<button data-edge="${i-1}">← 从${STAGES[i-1].name}如何到达</button>`:''} ${i<8?`<button data-edge="${i}">如何走向${STAGES[i+1].name} →</button>`:'<button data-return="true">↺ 回到自设约束</button>'}</div><details><summary>展开此阶段完整依据</summary>${compact(s.evidence)}</details>`;
 }else{
 const e=EDGES[i];
 $('inspector').innerHTML=`<div class="eyebrow">跃迁 ${String(i+1).padStart(2,'0')} / 08</div><h2 style="font-size:23px">${STAGES[i].name} → ${STAGES[i+1].name}</h2><div class="sectionlabel"><span class="tag${e.weak?' caveat':''}">${e.weak?'非必然跳跃':'原文机制描述'}</span></div><h3>${e.name}</h3><div class="defbox"><h4>核心定义（原文）</h4><p>${esc(stripLabel(e.core))}</p>${ref([e.core])}</div><div class="articletext"><h4>01　张力从何而来</h4><p>${esc(stripLabel(e.tension))} ${ref([e.tension])}</p><h4>02　如何完成转化</h4><p>${esc(stripLabel(e.mechanism))} ${ref([e.mechanism])}</p></div>${e.weak?`<div class="alert"><h4>原文随后给出的限定</h4><p>${esc(raw(e.weak).replace(/^•\s*/,''))} ${ref([e.weak])}</p></div>`:''}${i===7?`<p class="smallprint">后文对“赋予自我修改目标函数的元目标”提出外部注入的解构；终章仍保留自由的反思裁决意义。${ref([140,202])}</p>`:''}<details><summary>展开此步及概念来源的完整依据</summary>${compact([s.initial,STAGES[i+1].initial,e.tension,e.mechanism,e.core].filter((v,n,a)=>a.indexOf(v)===n))}</details>`;
 }
}
function renderDiagram(){
 const linear=state.layout==='linear';
 let pts;
 if(linear)pts=[{x:92,y:88},{x:290,y:88},{x:488,y:88},{x:686,y:88},{x:686,y:250},{x:488,y:250},{x:290,y:250},{x:92,y:250},{x:92,y:412}];
 else pts=[{x:334,y:220},{x:462,y:154},{x:627,y:175},{x:702,y:309},{x:605,y:443},{x:398,y:489},{x:183,y:408},{x:112,y:234},{x:205,y:75}];
 let svg=`<svg viewBox="0 0 800 ${linear?555:590}" role="group" aria-label="九阶段路径；第5和7步为原文限定的非必然跳跃。自由回到自设约束。"><defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#789b8b" stroke-width="1.4"/></marker><marker id="retarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#156c61" stroke-width="1.4"/></marker></defs>`;
 const offsets=linear?[[0,-18],[0,-18],[0,-18],[45,0],[0,38],[0,38],[0,38],[-40,0]]:[[-20,-5],[0,-18],[36,0],[35,10],[0,29],[-10,30],[-38,8],[-45,0]];
 for(let i=0;i<8;i++){
 const a=pts[i],b=pts[i+1];const dx=b.x-a.x,dy=b.y-a.y;const dist=Math.hypot(dx,dy);const trimX=62,trimY=29;const u=Math.min(Math.abs(trimX/(dx||.00001)),Math.abs(trimY/(dy||.00001)));const ax=a.x+dx*u,ay=a.y+dy*u,bx=b.x-dx*u,by=b.y-dy*u;
 const d=`M ${ax} ${ay} L ${bx} ${by}`;const weak=i===4||i===6;const selected=state.step===i*2+1;const mx=(a.x+b.x)/2+offsets[i][0],my=(a.y+b.y)/2+offsets[i][1];
 svg+=`<path d="${d}" class="connector${weak?' weak':''}${selected?' chosen':''}" marker-end="url(#arr)"/><path d="${d}" class="edgehit" data-edge="${i}"/><g role="button" tabindex="0" data-edge="${i}" aria-label="跃迁${i+1}：${STAGES[i].name}到${STAGES[i+1].name}，${EDGES[i].name}${weak?'，非必然':''}"><rect x="${mx-18}" y="${my-14}" width="36" height="27" rx="13" fill="${selected?'#183c39':weak?'#faf0df':'#edf1e9'}"/><text x="${mx}" y="${my+4}" text-anchor="middle" class="edge-label${weak?' weaklabel':''}" style="${selected?'fill:#fffefa':''}">${String(i+1).padStart(2,'0')}</text></g>`;
 }
 if(linear){svg+=`<path class="return" d="M 151 412 C 350 412 585 422 585 485 C 585 545 232 555 160 505" marker-end="url(#retarr)"/><text x="430" y="454" font-size="14" text-anchor="middle">自我设定的约束₂ → ……</text><text x="431" y="477" font-size="11" text-anchor="middle" fill="#5e716d">下一轮结构化的初始条件</text>`;}
 else{svg+=`<path class="return" d="M 264 75 C 360 54 366 101 315 131" marker-end="url(#retarr)"/><text x="500" y="62" text-anchor="middle" font-size="13">自我设定的约束₂ → ……</text><text x="500" y="84" text-anchor="middle" style="fill:#5e716d" font-size="11">新的初始约束，不是新增阶段</text><text x="410" y="313" text-anchor="middle" font-size="20" style="fill:#156c61">约束 → 自由 → 约束</text><text x="410" y="340" text-anchor="middle" font-size="12" style="fill:#5e716d">原文：螺旋，而非直线</text>`;}
 pts.forEach((p,i)=>{svg+=`<g class="node${state.step===i*2?' selected':''}" tabindex="0" role="button" data-node="${i}" aria-pressed="${state.step===i*2}" aria-label="阶段${i+1}：${STAGES[i].name}" transform="translate(${p.x},${p.y})"><rect x="-61" y="-28" width="122" height="56" rx="8"/><text x="-47" y="-5" class="ordinal">${String(i+1).padStart(2,'0')}</text><text x="0" y="16" text-anchor="middle">${STAGES[i].name}</text></g>`});
 svg+='</svg>';$('diagram').innerHTML=svg;
 const di=$('diagram');if(di.scrollWidth>di.clientWidth){const i=Math.floor(state.step/2),x=state.step%2?(pts[i].x+pts[i+1].x)/2:pts[i].x;di.scrollLeft=Math.max(0,x*di.scrollWidth/800-di.clientWidth/2);}
}
function returnDetail(){
 openEvidence([23,24,25,26,38,73,140,202],'螺旋回返：自我设定与元目标的限度');
}
function renderBeats(){
 $('beatTabs').innerHTML=BEATS.map((b,i)=>`<button class="beat ${state.beat===i?'active':''}" data-beat="${i}" aria-pressed="${state.beat===i}"><span class="beatno">0${i+1} ${i<2?'→':''}</span><b>${b.name}</b><p>${esc(raw(b.role))}</p></button>`).join('');
 const b=BEATS[state.beat];$('beatDetail').innerHTML=`<div class="sectionlabel">原文列举的典型跃迁体现</div><p>${esc(raw(b.example))} ${ref(b.refs)}</p><div class="linked">相关阅读：${state.beat===0?'<button data-edge="0">重复化</button> <button data-edge="1">共域耦合</button>':state.beat===1?'<button data-edge="2">反馈闭合</button> <button data-edge="5">误差比对</button>':'<button data-edge="3">不变量提炼</button> <button data-omega="4">选择标准瓶颈</button>'}</div>`;
}
function renderOmega(){
 $('omegaStatuses').innerHTML=OMEGA.map((o,i)=>`<button class="status-row ${i===state.omega?'active':''}" data-omega="${i}" aria-pressed="${i===state.omega}"><div><div class="statusname">${o.name}</div><span class="tag ${o.kind==='caveat'?'caveat':''}">${o.status}</span></div><div class="statusdesc">${o.tool}</div></button>`).join('');
 const o=OMEGA[state.omega];$('omegaDetail').innerHTML=`<div class="sectionlabel"><span class="tag ${o.kind==='caveat'?'caveat':''}">原文形式化评价</span></div><h3>${o.name}</h3><div class="formula">${o.math}</div><p class="articletext">${o.description}</p><p>${ref(o.ids,'查看此项全部原文依据')}</p><div class="alert"><p>${state.omega<3?'“严格成立”“完备无争议”等强判断是原文措辞。本程序保留该判断的归属，不将这一映射进一步扩展为整条演化链已获数学证明。':state.omega===3?'原文将此项与静态互信息分开：可行性不等于公理化定论，动态闭环仍未被统一严格刻画。':'原文使用“彻底破防”“数学与控制论上的铁律”等强措辞；这里如实呈现其论证与结论，不另行推导 S 的内生起源。'}</p></div><details><summary>展开相关论述</summary>${compact(o.ids.filter(i=>i<112))}</details>`;
}
function renderSolution(){
 $('solutionTabs').innerHTML=SOLUTIONS.map((s,i)=>`<button data-solution="${i}" aria-pressed="${state.solution===i}"><span>方案 0${i+1}</span>${s.name}</button>`).join('');
 const s=SOLUTIONS[state.solution];
 $('solutionDetail').innerHTML=`<div class="headrow"><div><div class="eyebrow">${s.field}</div><h2>${s.name}</h2></div><span class="tag neutral">原文审查</span></div><div class="defbox"><h4>如何填补目标函数来源</h4><p>${esc(raw(s.paradigm).replace(/^填补范式：/,''))} ${ref([s.paradigm])}</p></div><div class="costs">${[['逻辑自洽性',s.logic],['经验可证伪性',s.test],['解释边界',s.limit]].map(([label,id])=>`<section><h4>${label}</h4><p>${esc(raw(id).replace(/^•\s*/,''))} ${ref([id])}</p></section>`).join('')}</div><details><summary>展开方案完整原文</summary>${compact(s.ids)}</details>`;
 $('comparison').innerHTML=`<table><thead><tr><th>解释方案</th><th>S 被置于何处（原文评价）</th><th>是否承认预设</th><th>可证伪性评价</th></tr></thead><tbody>${SOLUTIONS.map((s,i)=>`<tr class="${state.solution===i?'selectedrow':''}"><td><button data-solution="${i}">${esc(raw(s.table[0]))}</button></td>${s.table.slice(1).map(id=>`<td>${esc(raw(id))}${ref([id],'依据')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function renderStatic(){
 $('methodJudgment').innerHTML=compact([174,195]);
 $('initialCaveats').innerHTML=compact([35,36,37,38]);$('weakCaveats').innerHTML=compact([90,91,92]);
 $('finalSummary').innerHTML=compact([197,198,199,200]);
 $('finalVerdict').innerHTML=`<p>${esc(raw(202).replace(/^【演化链条的终极哲学判词】/,''))} ${ref([201,202],'核对全文最后两段')}</p>`;
 $('genealogy').innerHTML=compact([27,28,29,30,31,32,33]);
 $('sourceTitle').textContent=SOURCE.title+'.docx';$('sourceHash').textContent=SOURCE.sourceSha256;
 $('coverageTopics').innerHTML=TOPICS.map(t=>`<div class="coverrow"><div><b>${t.name}</b><span>段 ${t.a}–${t.b} · 已嵌入</span></div><button data-topic="${t.a},${t.b}">原文</button></div>`).join('');
}
function renderSource(){
 const q=$('sourceSearch').value.trim();const scope=$('sourceScope').value;const bounds={all:[1,202],part1:[4,38],part2:[39,92],part3:[93,140],part4:[141,202]}[scope];
 const found=paras.filter(p=>p.id>=bounds[0]&&p.id<=bounds[1]&&(!state.sourcePage||p.pages.includes(state.sourcePage))&&(!q||p.text.toLocaleLowerCase().includes(q.toLocaleLowerCase())));
 $('pageCoverage').innerHTML=Array.from({length:15},(_,i)=>{const p=i+1,rows=paras.filter(x=>x.pages.includes(p));return `<button data-page="${p}" aria-pressed="${state.sourcePage===p}"><b>${String(p).padStart(2,'0')}</b>段 ${rows[0].id}–${rows.at(-1).id}</button>`}).join('');
 $('sourceResult').textContent=`显示 ${found.length} / 202 个非空段落${state.sourcePage?' · 缓存页 '+state.sourcePage:''}${q?' · 包含“'+q+'”':''}。段落在跨页时完整显示。`;
 $('sourceList').innerHTML=found.length?found.map(p=>{let t=esc(p.text);if(q){const safe=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');t=p.text.split(safe).map(esc).join('<mark>'+esc(q)+'</mark>');}return `<article class="quote ${[1,4,39,93,141,196].includes(p.id)?'heading':''}" id="full-p-${p.id}"><div class="loc">段 ${p.id} · 缓存页 ${p.pages.join('、')} ${ref([p.id],'单独查看')}</div><p>${t}</p></article>`}).join(''):'<div class="noresult">此范围没有匹配内容。可更换词语或重置筛选。</div>';
}
function openEvidence(ids,title='原文依据'){
 const unique=[...new Set(ids)].filter(i=>i>=1&&i<=202);dialogTrigger=document.activeElement;$('evidenceTitle').textContent=title;
 $('evidenceContent').innerHTML=`<p class="smallprint space-top">以下为所附 DOCX 的原文文本。段号为程序定位号；页码来自保存的分页缓存。</p>${unique.map(i=>`<div class="quote"><div class="loc">原文段 ${i} · 缓存页 ${para(i).pages.join('、')}</div><p>${esc(raw(i))}</p></div>`).join('')}<div class="space-top"><button data-full="${unique[0]}">在全文中定位首段</button></div>`;
 if(!$('evidenceDialog').open)$('evidenceDialog').showModal();$('evidenceDialog').scrollTop=0;
}
function closeEvidence(){if($('evidenceDialog').open)$('evidenceDialog').close();}
function clearSource(){state.sourcePage=null;$('sourceSearch').value='';$('sourceScope').value='all';}
root.addEventListener('click',e=>{
 const t=e.target.closest('[data-view],[data-node],[data-edge],[data-ref],[data-beat],[data-omega],[data-solution],[data-page],[data-topic],[data-full],[data-return]');if(!t)return;
 if(t.dataset.view){view(t.dataset.view);return;}
 if(t.dataset.node!==undefined){if(state.view!=='chain')view('chain');nodeSelect(+t.dataset.node);return;}
 if(t.dataset.edge!==undefined){if(state.view!=='chain')view('chain');edgeSelect(+t.dataset.edge);return;}
 if(t.dataset.ref){openEvidence(t.dataset.ref.split(',').map(Number));return;}
 if(t.dataset.beat!==undefined){state.beat=+t.dataset.beat;renderBeats();return;}
 if(t.dataset.omega!==undefined){if(state.view!=='omega')view('omega');state.omega=+t.dataset.omega;renderOmega();return;}
 if(t.dataset.solution!==undefined){state.solution=+t.dataset.solution;renderSolution();return;}
 if(t.dataset.page){const p=+t.dataset.page;state.sourcePage=state.sourcePage===p?null:p;renderSource();return;}
 if(t.dataset.topic){const [a,b]=t.dataset.topic.split(',').map(Number);openEvidence(range(a,b),'覆盖核对 · 原文段 '+a+'–'+b);return;}
 if(t.dataset.full){const id=+t.dataset.full;closeEvidence();clearSource();view('source',false);$('full-p-'+id).scrollIntoView({block:'center'});return;}
 if(t.dataset.return){returnDetail();}
});
root.addEventListener('keydown',e=>{
 if(e.key==='Enter'||e.key===' '){const el=e.target.closest('g[role="button"]');if(el){e.preventDefault();el.dispatchEvent(new MouseEvent('click',{bubbles:true}));return;}}
 if($('evidenceDialog').open||$('helpDialog').open)return;
 if(state.view!=='chain'||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 if(e.key==='ArrowRight'&&state.step<16){e.preventDefault();state.step++;renderChain();}
 if(e.key==='ArrowLeft'&&state.step>0){e.preventDefault();state.step--;renderChain();}
});
$('prevBtn').onclick=()=>{if(state.step>0){state.step--;renderChain()}};
$('nextBtn').onclick=()=>{if(state.step<16){state.step++;renderChain()}};
$('spiralBtn').onclick=()=>{state.layout='spiral';$('spiralBtn').setAttribute('aria-pressed','true');$('linearBtn').setAttribute('aria-pressed','false');renderDiagram()};
$('linearBtn').onclick=()=>{state.layout='linear';$('spiralBtn').setAttribute('aria-pressed','false');$('linearBtn').setAttribute('aria-pressed','true');renderDiagram()};
$('returnBtn').onclick=returnDetail;
$('helpBtn').onclick=()=>{$('helpDialog').showModal()};$('closeHelp').onclick=()=>{$('helpDialog').close()};
$('closeEvidence').onclick=closeEvidence;
$('evidenceDialog').addEventListener('close',()=>{if(dialogTrigger&&document.contains(dialogTrigger))dialogTrigger.focus()});
for(const dialog of [$('evidenceDialog'),$('helpDialog')])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
$('sourceSearch').addEventListener('input',renderSource);$('sourceScope').addEventListener('change',renderSource);$('clearSource').onclick=()=>{clearSource();renderSource()};
renderChain();renderBeats();renderOmega();renderSolution();renderStatic();renderSource();

})();
