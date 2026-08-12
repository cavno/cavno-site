// 四律·逻辑思脉地图 —— 微信小程序逻辑（移植自网页版）
const { LAWS, LAWC, STANCE, BANDS, C, EDGES } = require('./data.js');

function matchStance(st, sw){
  if(sw === 'neutral') return true;
  if(st === 'na') return false;
  if(sw === 'on') return st === 'keep' || st === 'keepmax';
  return st === 'weaken' || st === 'reject' || st === 'limit' || st === 'suspend';
}
function pipStyle(cat){
  const s = STANCE[cat];
  if(s.hollow) return 'border:3rpx solid ' + s.pip + ';background:transparent';
  if(s.ring)   return 'background:' + s.pip + ';box-shadow:0 0 0 3rpx #faf4e6,0 0 0 6rpx ' + s.pip;
  return 'background:' + s.pip;
}
const LAWNAME = { id:'同一律', ct:'矛盾律', ex:'排中律', re:'充足理由律' };
const LAWF    = { id:'A=A',   ct:'¬(A∧¬A)', ex:'A∨¬A', re:'PSR' };
const QUAD = [
  { ct:'on',  ex:'on',  name:'经典逻辑',        sub:'留矛盾 · 留排中' },
  { ct:'on',  ex:'off', name:'直觉主义',        sub:'留矛盾 · 撤排中' },
  { ct:'off', ex:'on',  name:'次协调/双面真理', sub:'撤矛盾 · 留排中' },
  { ct:'off', ex:'off', name:'相关逻辑 FDE',    sub:'撤矛盾 · 撤排中' },
];

Page({
  data: {
    laws: LAWS.map(l => ({ id:l.id, n:l.n, f:l.f, c:LAWC[l.id], role:l.role })),
    sw: { id:'neutral', ct:'neutral', ex:'neutral', re:'neutral' },
    legend: [],
    pipKeys: [],
    bands: [], nodes: [], mapH: 0,
    panel: { type:'guide' },
    quad: [],
    sheetOpen: true,
    playMode: false, playing: false, playK: 0,
    intoView: ''
  },

  onLoad(){
    // 图例 / 签名点说明
    const keys = [
      ['持守','keep'],['极致','keepmax'],['松动','weaken'],
      ['否弃','reject'],['限定','limit'],['悬置','suspend'],['不涉','na']
    ];
    this.setData({
      legend: keys.map(k => ({ l:k[0], style:pipStyle(k[1]) })),
      pipKeys: keys.map(k => ({ l:k[0], style:pipStyle(k[1]) }))
    });
    this.layout();
    this.updateQuad();
    this.renderFilter();
  },

  // ---------- 布局（手机：每行 2 个）----------
  layout(){
    let W = 375;
    try { const info = wx.getSystemInfoSync(); W = info.windowWidth || 375; } catch(e){}
    const PAD = 10, COLGAP = 10, PERROW = 2, NODEH = 74, ROWH = 88, PADTOP = 30, PADBOT = 10;
    const nodeW = (W - 2*PAD - (PERROW-1)*COLGAP) / PERROW;
    const nodes = [], bands = [];
    this.box = {}; this.nodeIndex = {}; this.curCls = {};
    let cy = 8;
    BANDS.forEach((b, bi) => {
      const k = b.nodes.length, rows = Math.ceil(k / PERROW);
      const bandTop = cy, bandH = PADTOP + rows*ROWH + PADBOT;
      bands.push({ lab:b.lab, top:bandTop, h:bandH, labTop:bandTop+6, bg:(bi % 2 === 0) });
      b.nodes.forEach((id, i) => {
        const r = Math.floor(i / PERROW), col = i % PERROW, inRow = Math.min(PERROW, k - r*PERROW);
        const total = inRow*nodeW + (inRow-1)*COLGAP, startX = (W - total) / 2;
        const left = startX + col*(nodeW + COLGAP), top = bandTop + PADTOP + r*ROWH;
        const n = C[id];
        this.box[id] = { top:top };
        nodes.push({
          id, name:n.name, rep:n.rep, tag:n.tag || '', tagc:n.tagc || '',
          left, top, w:nodeW, h:NODEH,
          pips: ['id','ct','ex','re'].map(L => pipStyle(n.s[L])),
          cls: ''
        });
      });
      cy += bandH;
    });
    this.bandTops = bands.map(b => b.top);
    this.nodesRef = nodes;
    nodes.forEach((nd, i) => { this.nodeIndex[nd.id] = i; this.curCls[nd.id] = ''; });
    this.setData({ nodes, bands, mapH: cy + 24 });
  },

  // ---------- 高亮：只 setData 变化的节点 ----------
  applyClasses(clsMap){
    const patch = {};
    this.nodesRef.forEach(nd => {
      const c = clsMap[nd.id] || '';
      if(this.curCls[nd.id] !== c){
        patch['nodes[' + this.nodeIndex[nd.id] + '].cls'] = c;
        this.curCls[nd.id] = c;
      }
    });
    if(Object.keys(patch).length) this.setData(patch);
  },

  matchSet(){
    const sw = this.data.sw;
    const any = Object.keys(sw).some(k => sw[k] !== 'neutral');
    if(!any) return null;
    const set = {};
    Object.keys(C).forEach(id => {
      const s = C[id].s; let ok = true;
      ['id','ct','ex','re'].forEach(L => { if(ok && !matchStance(s[L], sw[L])) ok = false; });
      if(ok) set[id] = true;
    });
    return set;
  },
  applyFilter(){
    const set = this.matchSet();
    const cls = {};
    if(set) this.nodesRef.forEach(nd => { cls[nd.id] = set[nd.id] ? 'hl' : 'dim'; });
    this.applyClasses(cls);
  },
  applyFocus(id){
    const nb = {}; nb[id] = 'sel';
    EDGES.forEach(e => {
      if(e.f === id) nb[e.t] = nb[e.t] || 'lin';
      if(e.t === id) nb[e.f] = nb[e.f] || 'lin';
    });
    const cls = {};
    this.nodesRef.forEach(nd => { cls[nd.id] = nb[nd.id] ? nb[nd.id] : 'dim'; });
    this.applyClasses(cls);
  },

  // ---------- 开关 ----------
  onSwitch(e){
    const { law, s } = e.currentTarget.dataset;
    const sw = Object.assign({}, this.data.sw); sw[law] = s;
    this.selected = null; this.clearPlay();
    this.setData({ sw, playMode:false, playing:false });
    this.applyFilter(); this.updateQuad(); this.renderFilter(); this.openSheet();
  },
  onQuad(e){
    const q = QUAD[+e.currentTarget.dataset.i];
    const sw = Object.assign({}, this.data.sw); sw.ct = q.ct; sw.ex = q.ex;
    this.selected = null; this.clearPlay();
    this.setData({ sw, playMode:false, playing:false });
    this.applyFilter(); this.updateQuad(); this.renderFilter(); this.openSheet();
  },
  updateQuad(){
    const sw = this.data.sw;
    this.setData({ quad: QUAD.map(q => ({ name:q.name, sub:q.sub, active:(sw.ct === q.ct && sw.ex === q.ex) })) });
  },

  // ---------- 选中节点 ----------
  onNode(e){ this.selectNode(e.currentTarget.dataset.id); },
  selectNode(id){
    this.selected = id; this.clearPlay();
    this.setData({ playMode:false, playing:false });
    this.applyFocus(id);
    this.renderNode(id);
    this.openSheet();
    this.scrollToView('n-' + id);
  },
  setConfigFromNode(){
    const id = this.selected; if(!id) return;
    const s = C[id].s, sw = {};
    ['id','ct','ex','re'].forEach(L => { sw[L] = (s[L] === 'na') ? 'neutral' : ((s[L] === 'keep' || s[L] === 'keepmax') ? 'on' : 'off'); });
    this.selected = null;
    this.setData({ sw });
    this.applyFilter(); this.updateQuad(); this.renderFilter();
  },

  // ---------- 面板渲染 ----------
  bandLabel(id){ const b = BANDS.find(b => b.nodes.indexOf(id) >= 0); return b ? b.lab : ''; },
  stanceRows(s){
    return ['id','ct','ex','re'].map(L => {
      const st = STANCE[s[L]], isNa = (s[L] === 'na');
      return { name:LAWNAME[L], f:LAWF[L], lab:st.lab, pip:pipStyle(s[L]), color:isNa ? '#6e6253' : st.pip };
    });
  },
  renderNode(id){
    const n = C[id], inc = [], out = [];
    EDGES.forEach(e => {
      if(e.t === id) inc.push({ id:e.f, name:C[e.f].name, anti:(e.k === 'anti') });
      if(e.f === id) out.push({ id:e.t, name:C[e.t].name, anti:(e.k === 'anti') });
    });
    this.setData({ panel: {
      type:'node', name:n.name, rep:n.rep, era:this.bandLabel(id),
      stances:this.stanceRows(n.s), move:n.move, note:n.note, inc, out
    }});
  },
  renderFilter(){
    const set = this.matchSet();
    if(!set){ this.setData({ panel:{ type:'guide' } }); return; }
    const sw = this.data.sw;
    const active = LAWS.filter(l => sw[l.id] !== 'neutral')
      .map(l => ({ n:l.n, v:(sw[l.id] === 'on' ? '守' : '松/弃'), on:(sw[l.id] === 'on'), c:LAWC[l.id] }));
    const list = Object.keys(set).map(id => ({ id, name:C[id].name }));
    this.setData({ panel:{ type:'filter', active, list, count:list.length } });
  },

  // ---------- 松绑史 ----------
  togglePlay(){ if(this.data.playMode) this.exitPlay(); else this.enterPlay(); },
  enterPlay(){ this.selected = null; this.setData({ playMode:true, sheetOpen:true }); this.stepTo(0); },
  exitPlay(){ this.clearPlay(); this.setData({ playMode:false, playing:false }); this.reset(); },
  clearPlay(){ if(this.timer){ clearInterval(this.timer); this.timer = null; } if(this.data.playing) this.setData({ playing:false }); },
  stepTo(k){
    const shown = {}; for(let i = 0; i <= k; i++) BANDS[i].nodes.forEach(id => shown[id] = true);
    const cur = {}; BANDS[k].nodes.forEach(id => cur[id] = true);
    const cls = {};
    this.nodesRef.forEach(nd => { cls[nd.id] = cur[nd.id] ? 'sel' : (shown[nd.id] ? 'hl' : 'dim'); });
    this.applyClasses(cls);
    const b = BANDS[k];
    this.setData({
      playK:k, sw:{ id:'neutral', ct:'neutral', ex:'neutral', re:'neutral' },
      panel: { type:'play', idx:k+1, total:BANDS.length, lab:b.lab,
        items:b.nodes.map(id => ({ id, name:C[id].name, move:C[id].move })) }
    });
    this.updateQuad();
    this.scrollToView('b-' + k);
  },
  stepNext(){ if(this.data.playK < BANDS.length - 1) this.stepTo(this.data.playK + 1); },
  stepPrev(){ if(this.data.playK > 0) this.stepTo(this.data.playK - 1); },
  playToggle(){
    if(this.timer){ clearInterval(this.timer); this.timer = null; this.setData({ playing:false }); return; }
    this.setData({ playing:true });
    this.timer = setInterval(() => {
      if(this.data.playK >= BANDS.length - 1){ clearInterval(this.timer); this.timer = null; this.setData({ playing:false }); return; }
      this.stepTo(this.data.playK + 1);
    }, 1800);
  },

  // ---------- 滚动 / 抽屉 ----------
  scrollToView(viewId){
    // 先清空再设置，确保重复点击同一目标也能触发
    this.setData({ intoView: '' });
    this.setData({ intoView: viewId });
  },
  toggleSheet(){ this.setData({ sheetOpen: !this.data.sheetOpen }); },
  openSheet(){ if(!this.data.sheetOpen) this.setData({ sheetOpen:true }); },

  reset(){
    this.selected = null; this.clearPlay();
    this.setData({ sw:{ id:'neutral', ct:'neutral', ex:'neutral', re:'neutral' }, playMode:false, playing:false, intoView:'' });
    this.applyClasses({});
    this.updateQuad(); this.renderFilter();
  },

  onUnload(){ if(this.timer){ clearInterval(this.timer); this.timer = null; } }
});
