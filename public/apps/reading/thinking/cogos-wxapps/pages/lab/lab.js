// 认知操作系统 · 演化实验室（七相位状态机 · 小程序原生实现）
const SUP = ['⁰','¹','²','³','⁴'];
const SUB = ['₀','₁','₂','₃','₄','₅'];
const PHM = [
  { k:'void',     no:'序',    name:'划界' },
  { k:'closed',   no:'1.0',   name:'稳态封闭' },
  { k:'dialectic',no:'2.0',   name:'辩证引擎' },
  { k:'reentry',  no:'3.0',   name:'再进入' },
  { k:'tower',    no:'3.0⁺',  name:'分层塔' },
  { k:'ecology',  no:'4.0',   name:'逻辑生态' },
  { k:'mirror',   no:'∞',     name:'镜厅' }
];
const LAWS0 = [
  { id:'id', name:'同一律',     f:'A=A' },
  { id:'nc', name:'矛盾律',     f:'¬(A∧¬A)' },
  { id:'em', name:'排中律',     f:'A∨¬A' },
  { id:'sr', name:'充足理由律', f:'Why' }
];
const ECO_GLOBAL = [
  { st:'rel', lbl:'局域协议 · 环境相对' },
  { st:'rel', lbl:'弗协调区: 爆炸律停用' },
  { st:'rel', lbl:'直觉主义 / 模糊区: 停用' },
  { st:'rel', lbl:'让位于拟合与收敛' }
];
const ECO_B = [
  { n:'经典逻辑', s:'局域有效 · 工程与日常', x:'12%', y:'6%',  d:150, g:'g0',
    laws:[{st:'rigid',lbl:'A=A · 刚性'},{st:'on',lbl:'在线'},{st:'on',lbl:'在线'},{st:'on',lbl:'在线'}] },
  { n:'直觉主义', s:'Brouwer / Heyting', x:'42%', y:'1%', d:158, g:'g1',
    laws:[{st:'on',lbl:'构造性同一'},{st:'on',lbl:'在线'},{st:'off',lbl:'停用: 未构造即未定'},{st:'on',lbl:'证明 = 构造'}] },
  { n:'弗协调逻辑', s:'Priest / da Costa', x:'70%', y:'7%', d:168, g:'g2',
    laws:[{st:'on',lbl:'在线'},{st:'off',lbl:'局部容纳 p∧¬p'},{st:'on',lbl:'在线'},{st:'rel',lbl:'爆炸律已拆除'}] },
  { n:'多值 / 模糊', s:'Łukasiewicz / Zadeh', x:'8%', y:'46%', d:170, g:'g3',
    laws:[{st:'rel',lbl:'以隶属度索引'},{st:'rel',lbl:'梯度化'},{st:'off',lbl:'废除: p ∈ [0,1]'},{st:'on',lbl:'在线'}] },
  { n:'贝叶斯 / 神经网络', s:'真值 = 权重 · 概率波', x:'40%', y:'50%', d:196, g:'g4',
    laws:[{st:'rel',lbl:'分布同一'},{st:'rel',lbl:'损失函数惩罚'},{st:'off',lbl:'连续状态空间'},{st:'rel',lbl:'拟合与收敛'}] },
  { n:'模态 / 相关', s:'各管一片论域', x:'74%', y:'52%', d:136, g:'g5',
    laws:[{st:'rel',lbl:'跨可能世界索引'},{st:'rel',lbl:'相关性约束'},{st:'warn',lbl:'视系统而定'},{st:'rel',lbl:'资源敏感'}] }
];

Page({
  data: {
    phm: PHM,
    phase: '',
    visited: {},
    hud: '',
    laws: [],
    kTitle: '四律内核 · 实时状态',
    kLocal: false,
    meters: { closure:0, tension:0, variety:0, entropy:0 },
    narr: '',
    actions: [],
    logs: [],
    logView: '',
    fly: { show:false, left:'0%', top:'0%', color:'#F0E5CD', wob:false, on:false },
    v: {}, c: {}, d: {}, r: {}, t: {}, e: {}, m: {},
    ecoB: ECO_B
  },

  /* ============ 生命周期 ============ */
  onLoad() { this._timers = []; this._logSeq = 0; this.goPhase('void'); },
  onUnload() { this.killTimers(); },
  onHide() { this.killTimers(); },
  onShareAppMessage() {
    return { title: '认知操作系统：亲手运行逻辑的四次大版本迭代', path: '/pages/lab/lab' };
  },
  onShareTimeline() { return { title: '认知操作系统 · 逻辑演化实验室' }; },

  /* ============ 工具 ============ */
  tm(fn, ms) { const id = setTimeout(fn, ms); this._timers.push(id); return id; },
  killTimers() { (this._timers || []).forEach(clearTimeout); this._timers = []; },
  vib(type) { try { wx.vibrateShort({ type: type || 'light' }); } catch (e) {} },
  log(txt, cls) {
    const logs = this.data.logs.slice(-59);
    const id = 'ln' + (++this._logSeq);
    logs.push({ id, cls: cls || 'sys', txt });
    this.setData({ logs, logView: id });
  },
  setKernel(map, title) {
    const laws = LAWS0.map((l, i) => ({
      ...l,
      st: map ? map[i].st : 'off',
      lbl: map ? map[i].lbl : '未安装'
    }));
    this.setData({ laws, kTitle: title || '四律内核 · 实时状态', kLocal: false });
  },
  meters(o) { this.setData({ meters: { ...this.data.meters, ...o } }); },
  narr(html) { this.setData({ narr: html }); },
  narrAdd(html) { this.setData({ narr: this.data.narr + html }); },
  acts(list) { this.setData({ actions: list }); },
  onAction(e) {
    const a = e.currentTarget.dataset.act;
    const it = this.data.actions.find(x => x.act === a);
    if (it && it.dis) return;
    const fn = this['act_' + a];
    if (fn) fn.call(this);
  },
  flyChip(from, to, color, wob, ms, after) {
    this.setData({ fly: { show:true, left:from[0], top:from[1], color, wob:!!wob, on:false } });
    this.tm(() => this.setData({ 'fly.on': true, 'fly.left': to[0], 'fly.top': to[1] }), 40);
    this.tm(() => { this.setData({ 'fly.show': false }); after && after(); }, ms || 900);
  },

  /* ============ 相位调度 ============ */
  onPhaseTap(e) {
    const k = e.currentTarget.dataset.k;
    if (!this.data.visited[k] || k === this.data.phase) return;
    this.goPhase(k);
  },
  goPhase(k) {
    this.killTimers();
    const visited = { ...this.data.visited }; visited[k] = true;
    this.setData({
      phase: k, visited, narr: '', actions: [],
      fly: { show:false, left:'0%', top:'0%', color:'', wob:false, on:false },
      kLocal: false
    });
    const enter = {
      void: this.enterVoid, closed: this.enterClosed, dialectic: this.enterDial,
      reentry: this.enterRe, tower: this.enterTower, ecology: this.enterEco, mirror: this.enterMirror
    }[k];
    enter.call(this);
  },

  /* ============ 序 · 虚空与第一刀 ============ */
  enterVoid() {
    this.setData({ hud: '相位 序 · 前逻辑虚空', v: { cut:false, inA:false, boot:[false,false,false,false] } });
    this.meters({ closure:2, tension:8, variety:12, entropy:90 });
    this.setKernel(null);
    this.narr('<p class="verdict">逻辑的「夸克」不是真理，是区分。</p>' +
      '<p class="p">Spencer-Brown 在《Laws of Form》里把整座逻辑大厦还原成一个最小动作：<b>draw a distinction</b>——在虚空里划一刀，标出「里」与「外」。同一律不是在陈述真理，而是在<b>执行划界</b>；矛盾律禁止站在刀刃上；排中律禁止停在灰带里；充足理由律驱动系统向源头追问。四条律合起来，是「如何让一个区分保持为干净区分」的操作规程。</p>' +
      '<p class="hint">面前是前逻辑的虚空——神话、流变、高熵。请执行第一个操作。</p>');
    this.acts([{ act:'cut0', label:'划下一刀 · Draw a Distinction', kind:'primary' }]);
    this.log('[BOOT] 前逻辑环境载入: 神话叙事 / 经验流变 / 熵 = 90', 'sys');
  },
  act_cut0() {
    this.acts([]);
    this.vib('light');
    this.setData({ 'v.cut': true });
    this.log('[CUT] 区分执行中: 在虚空里划一刀……', 'ok');
    this.tm(() => { this.setData({ 'v.inA': true }); this.log('[CUT] 完成: 里 = A ／ 外 = ¬A · determinatio est negatio', 'ok'); }, 1300);
    const boots = [
      [0, '划界操作 · 在线', '同一律'], [1, '禁站刀刃 · 在线', '矛盾律'],
      [2, '禁入灰带 · 在线', '排中律'], [3, '追源驱动 · 在线', '充足理由律']
    ];
    boots.forEach((b, i) => this.tm(() => {
      const laws = this.data.laws.length ? this.data.laws.slice() : LAWS0.map(l => ({ ...l, st:'off', lbl:'未安装' }));
      laws[b[0]] = { ...laws[b[0]], st:'on', lbl:b[1] };
      this.setData({ laws });
      this.log('[KERNEL] ' + b[2] + ' 上线', 'ok');
    }, 1600 + i * 420));
    this.tm(() => {
      this.meters({ closure:38, tension:8, variety:22, entropy:56 });
      this.narrAdd('<p class="p">内核已点亮。每作一个区分，就同时生出它的非自身——这套刀法的全部<b>变异度</b>，就是系统此后可用的全部资本。整部逻辑史，是这套刀法试图<b>对自己下刀</b>时发生的事。</p>');
      this.acts([{ act:'goClosed', label:'启动 1.0 · 稳态封闭系统', kind:'primary' }]);
    }, 3600);
  },
  act_goClosed() { this.goPhase('closed'); },

  /* ============ 1.0 · 稳态封闭 ============ */
  enterClosed() {
    this._paradox = ['芝诺 · 飞矢不动（连续性）', '赫拉克利特 · 万物皆流（时间）', '克里特人说谎者（自指前兆）'];
    this.setData({
      hud: '相位 1.0 · 定理 0 · 拒收 0',
      c: { thm:0, rej:0, frozen:false, shatter:false, si:0,
        slots:[
          { on:false, x:'30%', y:'22%' }, { on:false, x:'58%', y:'22%' },
          { on:false, x:'64%', y:'48%' }, { on:false, x:'44%', y:'62%' },
          { on:false, x:'24%', y:'48%' }
        ] }
    });
    this.meters({ closure:92, tension:6, variety:18, entropy:22 });
    this.setKernel([
      { st:'rigid', lbl:'基准协议 · 刚性' }, { st:'rigid', lbl:'零容忍 · 刚性' },
      { st:'rigid', lbl:'非真即假 · 刚性' }, { st:'rigid', lbl:'刚性传导' }
    ]);
    this.narr('<p class="verdict">1.0 的全部智慧是一道防火墙：确立硬边界，强行降熵。</p>' +
      '<p class="p">面对神话叙事与经验流变，亚里士多德的形式逻辑假设前提与结论之间存在<b>绝对刚性传导</b>。A=A 是基准协议——滤除时间维度与状态的连续变化，把万物锁进离散、静止的坐标点。封闭、线性、确定。</p>' +
      '<p class="hint">试试两种投喂：清晰命题会被干净吸收；而无法划界的边缘输入——看系统如何反应。</p>');
    this.acts([
      { act:'feed', label:'投喂清晰命题' },
      { act:'par', label:'注入 ' + this._paradox[0], kind:'danger' }
    ]);
    this.log('[1.0] 硬边界建立: 熵被强行滤出系统', 'sys');
  },
  act_feed() {
    const c = this.data.c;
    if (c.frozen) return;
    const si = c.si % 5;
    const sp = c.slots[si];
    this.flyChip(['92%','44%'], [sp.x, sp.y], '#F0E5CD', false, 820, () => {
      const slots = this.data.c.slots.slice();
      slots[si] = { ...slots[si], on: true };
      const thm = this.data.c.thm + 1;
      this.setData({ 'c.slots': slots, 'c.thm': thm, 'c.si': this.data.c.si + 1,
        hud: '相位 1.0 · 定理 ' + thm + ' · 拒收 ' + this.data.c.rej });
      this.log('[1.0] 刚性传导完成 → 定理 #' + thm + ' 已入格', 'ok');
      this.meters({ variety: 18 + thm * 2 });
    });
  },
  act_par() {
    const c = this.data.c;
    if (c.frozen) return;
    const name = this._paradox[c.rej];
    this.flyChip(['92%','52%'], ['72%','40%'], '#D2693F', true, 860, () => {
      const rej = this.data.c.rej + 1;
      const tension = Math.min(96, 6 + rej * 30);
      this.setData({ 'c.rej': rej, 'c.shake': true,
        hud: '相位 1.0 · 定理 ' + this.data.c.thm + ' · 拒收 ' + rej });
      this.tm(() => this.setData({ 'c.shake': false }), 430);
      this.vib('medium');
      wx.showToast({ title: '✗ 被拒收 · 张力 +30', icon: 'none', duration: 1200 });
      this.meters({ closure: 92 - rej * 9, tension, entropy: 22 + rej * 4 });
      this.log('[1.0][ERR] 无法划界的边缘输入被拒: ' + name + ' · 张力 +30', 'err');
      if (rej >= 3) this.freeze();
      else this.acts([
        { act:'feed', label:'投喂清晰命题' },
        { act:'par', label:'注入 ' + this._paradox[rej], kind:'danger' }
      ]);
    });
  },
  freeze() {
    this.setData({ 'c.frozen': true });
    this.vib('heavy');
    this.setKernel([
      { st:'rigid', lbl:'基准协议 · 刚性' }, { st:'warn', lbl:'过载: 连续 / 流变 / 自指' },
      { st:'rigid', lbl:'非真即假 · 刚性' }, { st:'warn', lbl:'传导中断' }
    ]);
    this.meters({ closure:42, tension:96, variety:24, entropy:40 });
    this.narrAdd('<p class="p">封闭系统为维持绝对一致性而拒绝一切矛盾。遇到无法划界的输入，它不降级、不协商——直接报错卡死。这是极其脆弱的稳态：<b>脆断</b>是它唯一的失败模式。</p>');
    this.log('[1.0][FATAL] 稳态系统脆断在即 · 唯一出路: 架构升级', 'err');
    this.acts([{ act:'shatter', label:'脆断 → 升级 2.0', kind:'primary' }]);
  },
  act_shatter() {
    this.acts([]);
    this.setData({ 'c.shatter': true });
    this.vib('heavy');
    this.log('[1.0] 脆断。碎片将成为 2.0 的燃料。', 'warn');
    this.tm(() => this.goPhase('dialectic'), 950);
  },

  /* ============ 2.0 · 辩证引擎 ============ */
  enterDial() {
    this.setData({
      hud: '相位 2.0 · 扬弃 0 次 · 耗散中',
      d: { n:0, anti:false, merge:false, levels:[], cur:'A' + SUP[0], curAnti:'¬A' + SUP[0] }
    });
    this.meters({ closure:40, tension:34, variety:42, entropy:62 });
    this.setKernel([
      { st:'on', lbl:'锁定当前正题' }, { st:'engine', lbl:'翻转为引擎' },
      { st:'rigid', lbl:'仍然刚性' }, { st:'on', lbl:'驱动扬弃' }
    ]);
    this.narr('<p class="verdict">2.0 的范式跃迁：Bug 被翻转为引擎。</p>' +
      '<p class="p">认知范围扩大、输入激增，刚性边界崩塌，系统内部必然生成互斥指令——康德的<b>二律背反</b>。黑格尔随即建立了一个绝妙的正反馈机制：正题在运行中必然耗散、异化出反题；结构性张力逼迫系统不能停留原处，必须通过<b>扬弃</b>（Aufheben）自组织跃迁到包含前两者的新层级。系统从静态平衡进化为远离平衡态的<b>耗散结构</b>。</p>');
    this.acts([{ act:'anti', label:'异化出反题 ¬A' + SUP[0], kind:'danger' }]);
    this.log('[2.0] 系统进入耗散态: 边界开放熵通量 · 矛盾律已征用为引擎', 'sys');
  },
  act_anti() {
    const n = this.data.d.n;
    this.setData({ 'd.anti': true, 'd.curAnti': '¬A' + SUP[n] });
    this.vib('light');
    this.log('[2.0] 正题在运行中耗散,异化出反题 ¬A' + SUP[n] + ' — 结构性张力建立', 'warn');
    this.meters({ closure:38, tension:66, variety:44 + n * 10, entropy:66 });
    this.acts([{ act:'auf', label:'扬弃 Aufheben ⊕', kind:'gold' }]);
  },
  act_auf() {
    this.acts([]);
    this.setData({ 'd.merge': true });
    this.tm(() => {
      const n = this.data.d.n + 1;
      const levels = this.data.d.levels.concat([{ label: 'A' + SUP[n] + ' := A' + SUP[n-1] + ' ⊕ ¬A' + SUP[n-1] }]);
      this.setData({
        'd.n': n, 'd.levels': levels, 'd.anti': false, 'd.merge': false,
        'd.cur': 'A' + SUP[n],
        hud: '相位 2.0 · 扬弃 ' + n + ' 次 · 耗散中'
      });
      this.vib('medium');
      this.log('[2.0] 扬弃完成: A' + SUP[n] + ' := A' + SUP[n-1] + ' ⊕ ¬A' + SUP[n-1] + ' · 系统自我扩容', 'ok');
      this.meters({ closure:36, tension:26, variety:46 + n * 12, entropy:64 });
      if (n < 3) {
        this.acts([{ act:'anti', label:'再异化 · 反题 ¬A' + SUP[n], kind:'danger' }]);
      } else {
        this.narrAdd('<p class="p">这台引擎没有刹车：矛盾无阻生成，可能失控——这是它的局限。但真正终结这个阶段的不是失控，而是一个特殊输入。从 Organon 到莱布尼茨的 calculemus，两千年的闭合之梦要求系统去运算<b>它自己</b>。</p>');
        this.acts([{ act:'goRe', label:'梦想闭合 · 让系统运算自身', kind:'primary' }]);
      }
    }, 820);
  },
  act_goRe() { this.goPhase('reentry'); },

  /* ============ 3.0 · 再进入危机 ============ */
  enterRe() {
    this.setData({
      hud: '相位 3.0 · 闭合之梦 → 再进入',
      r: { stage:0, liarVal:true, w1:26, w2:44, ex:0, trip:[] }
    });
    this.meters({ closure:78, tension:30, variety:70, entropy:30 });
    this.setKernel([
      { st:'warn', lbl:'A = A(A) ？' }, { st:'warn', lbl:'即将振荡' },
      { st:'warn', lbl:'即将现盲区' }, { st:'warn', lbl:'自证请求排队中' }
    ]);
    this.narr('<p class="verdict">闭合之梦撞上变异度铁律：强到能描述自身的闭合系统，躲不开自指。</p>' +
      '<p class="p">两千年是同一个梦——让逻辑成为<b>自创生系统</b>（Maturana-Varela）：自己生产构成自己的元件、自己为自己奠基、操作完全闭合。希尔伯特纲领是这个梦最清醒、最数学化的表述。现在，执行它。</p>');
    this.acts([{ act:'prove', label:'执行 PROVE( CONSISTENT( SELF ) )', kind:'primary' }]);
    this.log('[3.0] 目标: 用有限手段在系统内部证明自身一致且完备', 'sys');
  },
  act_prove() {
    this.acts([]);
    this.setData({ 'r.stage': 1 });
    this.log('[3.0] 系统把自身操作施加于自身: 区分重入其区分出的空间', 'warn');
    this.tm(() => {
      this.setData({ 'r.stage': 2 });
      this.log('[3.0][OSC] 真值振荡: 二值无法消化的「虚值」在时间中显形', 'err');
      this.vib('medium');
      let iv = 520;
      const step = () => {
        if (this.data.phase !== 'reentry') return;
        this.setData({ 'r.liarVal': !this.data.r.liarVal });
        iv = Math.max(150, iv * 0.84);
        this.tm(step, iv);
      };
      this.tm(step, iv);
      this.tm(() => this.ashby(), 2400);
    }, 1300);
  },
  ashby() {
    this.setData({ 'r.stage': 3 });
    this.narrAdd('<p class="p">Ashby 必要变异度定律给出系统论的「为什么」：有限公理系统的变异度，永远追不上「全部真理 ∋ 关于它自己的真理」。<i>谨慎：这是启发性的桥，不是等号——严格定理属于哥德尔、塔尔斯基、图灵。</i></p>');
    this.acts([{ act:'expand', label:'扩充公理系统 ＋' }]);
    this.meters({ tension:68, variety:72 });
  },
  act_expand() {
    const ex = this.data.r.ex + 1;
    this.setData({ 'r.ex': ex, 'r.w1': 26 + ex * 12, 'r.w2': Math.min(88, 44 + ex * 17) });
    this.log('[3.0] 公理扩充: V(系统)↑ — 但「关于扩充后系统的真理」同步膨胀 · 差距不闭合', 'warn');
    if (ex >= 2) this.trip();
  },
  trip() {
    this.acts([]);
    const items = [
      { t:'哥德尔 1931', s:'真而不可证之句存在' },
      { t:'塔尔斯基 1933', s:'真谓词不可内部定义' },
      { t:'图灵 1936', s:'停机问题不可判定' }
    ];
    items.forEach((it, i) => this.tm(() => {
      this.setData({ 'r.trip': this.data.r.trip.concat([it]) });
      this.vib('light');
      this.log('[3.0] 显影 ' + (i + 1) + '/3: ' + it.t + ' — ' + it.s, 'err');
    }, 380 + i * 540));
    this.tm(() => {
      this.narrAdd('<p class="p">同一条<b>变异度不足</b>，在三个领域的显影。希尔伯特之梦不是被一个意外杀死的，是被一条系统论必然律杀死的。当观测者成为被观测系统的一部分，几何形状会发生拓扑学坍塌。</p>');
      this.acts([{ act:'goTower', label:'分层解悖 · Entparadoxierung', kind:'primary' }]);
    }, 2350);
  },
  act_goTower() { this.goPhase('tower'); },

  /* ============ 3.0⁺ · 分层塔 ============ */
  enterTower() {
    this.setData({
      hud: '相位 3.0⁺ · 悖论位移 0 次 · 消除 0 次',
      t: { n:0, slabs:[{ i:0, sub:SUB[0], w:'94%', tag:'对象语言 · 谈论世界' }], inf:false }
    });
    this.meters({ closure:66, tension:44, variety:74, entropy:34 });
    this.setKernel([
      { st:'on', lbl:'按层级索引: A =ₙ A' }, { st:'on', lbl:'以分层阻断自指' },
      { st:'warn', lbl:'层内有效 · 留有盲区' }, { st:'on', lbl:'奠基外包至上一层' }
    ]);
    this.narr('<p class="verdict">悖论从未被解决，只被推迟——这叫解悖（Entparadoxierung, Luhmann）。</p>' +
      '<p class="p">罗素的类型论、塔尔斯基的对象语言 / 元语言、亚里士多德的「同一时间、同一方面」、那句常见的免责脚注「在同一语境下」——全是同一招：<b>把再进入发生的那个点切开，塞进上一层</b>。高维元系统可以解释低维对象系统，但不能解释自身；每个元层级都带着自己的新盲点：你能用它看，看不见它。</p>' +
      '<p class="hint">试着继续加盖。数一数：悖论被消除了几次？</p>');
    this.acts([{ act:'slab', label:'加盖元层级 L' + SUB[1], kind:'primary' }]);
    this.log('[3.0⁺] 解悖机制上线: 位移,而非消除', 'sys');
  },
  act_slab() {
    const t = this.data.t;
    if (t.n >= 4) return;
    const n = t.n + 1;
    const slabs = t.slabs.concat([{
      i:n, sub:SUB[n], w:(94 - n * 9) + '%',
      tag:'元语言 · 谈论 L' + SUB[n - 1]
    }]);
    this.setData({ 't.n': n, 't.slabs': slabs, hud: '相位 3.0⁺ · 悖论位移 ' + n + ' 次 · 消除 0 次' });
    this.vib('light');
    this.log('[3.0⁺] 悖论位移 → 塞进 L' + SUB[n] + ' 与 L' + SUB[n-1] + ' 的夹层 · 新盲点已生成', 'warn');
    this.meters({ tension: Math.max(24, 44 - n * 5), variety: 74 + n * 3 });
    if (n >= 4) {
      this.setData({ 't.inf': true });
      this.log('[3.0⁺] von Foerster: 控制论的控制论的控制论…… 无穷回退', 'err');
      this.narrAdd('<p class="p">塔尔斯基的真值层级，在系统论里就是一座观察者观察观察者的无限塔。健康的复杂系统必须<b>层级嵌套、且存在盲区</b>——不存在全知全能的扁平主系统。是时候承认这一点了。</p>');
      this.acts([{ act:'goEco', label:'放弃「唯一封闭系统」之梦 → 打开', kind:'primary' }]);
    } else if (n >= 2) {
      this.acts([
        { act:'slab', label:'再加一层 L' + SUB[n + 1] },
        { act:'goEco', label:'放弃「唯一封闭系统」之梦 → 打开', kind:'primary' }
      ]);
    } else {
      this.acts([{ act:'slab', label:'再加一层 L' + SUB[n + 1] }]);
    }
  },
  act_goEco() { this.goPhase('ecology'); },

  /* ============ 4.0 · 逻辑生态 ============ */
  enterEco() {
    this.setData({
      hud: '相位 4.0 · 整体算力 RUNNING ▮▮▮',
      e: { p:50, pTxt:'0.50', injected:false, sel:-1, foot:false }
    });
    this.meters({ closure:22, tension:24, variety:92, entropy:70 });
    this.setKernel(ECO_GLOBAL, '全局视图 · 点击气泡查看局部内核');
    this.narr('<p class="verdict">二十世纪真正的转向：放弃「唯一封闭系统」这个梦本身——从一个逻辑，到逻辑的生态。</p>' +
      '<p class="p">直觉主义砍掉排中律；弗协调逻辑砍掉爆炸律，允许<b>局部</b>容纳矛盾而不全盘崩溃；多值 / 模糊逻辑砍掉二值原则，真值成为 [0,1] 上的连续分布；贝叶斯网络与神经网络索性把推理变成高维参数空间里的<b>拟合与收敛</b>——像一个不断对冲 Delta 与 Gamma 风险的动态平衡网络。有效性彻底<b>环境相对</b>：「在同一语境下」从谦卑的免责脚注，升级为整个体系的结构原理。</p>' +
      '<p class="hint">拖动真值滑杆感受连续状态空间；然后注入一枚悖论，与 1.0 的反应对照。</p>');
    this.acts([{ act:'inject', label:'向生态注入一枚悖论', kind:'danger' }]);
    this.log('[4.0] 生态上线: 6 个子逻辑 · 有效性 = 环境相对', 'ok');
  },
  onSlide(e) {
    const p = e.detail.value;
    this.setData({ 'e.p': p, 'e.pTxt': (p / 100).toFixed(2) });
  },
  onBubble(e) {
    const i = e.currentTarget.dataset.i;
    const b = ECO_B[i];
    const laws = LAWS0.map((l, k) => ({ ...l, st:b.laws[k].st, lbl:b.laws[k].lbl }));
    this.setData({ laws, kTitle: '局部内核: ' + b.n, kLocal: true, 'e.sel': i });
    this.log('[4.0] 检视局部内核: ' + b.n, 'sys');
  },
  onKback() {
    this.setKernel(ECO_GLOBAL, '全局视图 · 点击气泡查看局部内核');
    this.setData({ 'e.sel': -1 });
  },
  act_inject() {
    if (this.data.e.injected) return;
    this.acts([{ act:'inject', label:'悖论已入生态', kind:'danger', dis:true }]);
    this.flyChip(['48%','-4%'], ['74%','22%'], '#D2693F', true, 1000, () => {
      this.setData({ 'e.injected': true, 'e.foot': true });
      this.vib('medium');
      this.log('[4.0] 悖论落点: 弗协调区 — 爆炸律已拆除,矛盾被局部围堵', 'warn');
      this.log('[4.0] 局部冗余消化局部矛盾 · 整体网络在「不完备」中持续输出', 'ok');
      this.log('[4.0] 对照 1.0: 同类输入 → 全系统卡死', 'sys');
      this.narrAdd('<p class="p">希腊怀疑派的悬置（ἐποχή）是<b>绝望的终点</b>——四个开关全拨到 off，logos 耗尽了自己。现代逻辑把这份悬置<b>焊进了架构</b>：盲点不再是失败的标志，而是系统得以生产的地方。悬置从终点变成了引擎舱。</p>');
      this.acts([
        { act:'inject', label:'悖论已入生态', kind:'danger', dis:true },
        { act:'goMirror', label:'尾声 · 把镜头拉远', kind:'primary' }
      ]);
    });
  },
  act_goMirror() { this.goPhase('mirror'); },

  /* ============ ∞ · 镜厅 ============ */
  enterMirror() {
    this.setData({
      hud: '相位 ∞ · 嵌套深度 0',
      m: { k:0, scale:'scale(1)', rings:[], final:false }
    });
    this.meters({ closure:30, tension:38, variety:95, entropy:60 });
    this.setKernel([
      { st:'warn', lbl:'指向自身……' }, { st:'warn', lbl:'指向自身……' },
      { st:'warn', lbl:'指向自身……' }, { st:'warn', lbl:'指向自身……' }
    ]);
    this.narr('<p class="verdict">最后一个诚实的残余：系统论自己，也跑不出它所描述的那条律。</p>' +
      '<p class="p">「用系统论观察逻辑系统」这个动作本身，就是又一次<b>再进入</b>——它必须用「系统 / 环境」这个区分来看一切，而它看不见自己正站在这个区分上。它的盲点，就在它划下那一刀的刀刃上。</p>' +
      '<p class="hint">那就诚实到底：把观察者也框进来。</p>');
    this.acts([{ act:'frame', label:'再划一刀（把观察者框进来）', kind:'primary' }]);
    this.log('[∞] 第二序警告: 客观性是「以为观察可以没有观察者」的错觉', 'sys');
  },
  act_frame() {
    const k = this.data.m.k + 1;
    this.acts([]);
    this.vib(k === 1 ? 'medium' : 'heavy');
    const ring = k === 1
      ? { ins:'10rpx', eyeStyle:'top:-4rpx;right:9%', lbl:'观察者: 系统论', lblStyle:'top:52rpx;right:2%', blind:true }
      : { ins:'-14rpx', eyeStyle:'bottom:-6rpx;left:9%', lbl:'观察者′: 正在读这块屏幕的你', lblStyle:'bottom:44rpx;left:2%', blind:false };
    this.setData({
      'm.k': k,
      'm.scale': 'scale(' + Math.pow(0.74, k).toFixed(2) + ')',
      'm.rings': this.data.m.rings.concat([ring]),
      hud: '相位 ∞ · 嵌套深度 ' + k
    });
    this.log('[∞] 再进入 #' + k + ': 观察行为被框进被观察者 · 新盲点生成于新刀刃', 'warn');
    if (k === 1) {
      this.tm(() => {
        this.narrAdd('<p class="p">框住了。但注意：这个新的框，又是一次划界——它自己的盲点已经在新的刀刃上生成。而且，还有一个观察者没被框进来。</p>');
        this.acts([{ act:'frame', label:'再划一刀（把你也框进来）', kind:'primary' }]);
      }, 1500);
    } else {
      this.tm(() => this.finalMirror(), 1600);
    }
  },
  finalMirror() {
    const visited = {}; PHM.forEach(p => visited[p.k] = true);
    this.setData({ 'm.final': true, visited });
    this.narrAdd('<p class="final">地图终究画进了它自己要描绘的疆域。它没有比它所分析的对象站得更高——只是把那座无穷塔又往上添了一层，并且诚实地知道：<b>自己添的是一层，而非顶层。</b></p>');
    this.acts([
      { act:'replay', label:'↺ 重新推演（回到虚空）' },
      { act:'toArchive', label:'↓ 继续阅读: 档案与结算' }
    ]);
    this.log('[∞] 推演完成 · 塔又高了一层 · 全部相位已解锁,可回跳复演', 'ok');
  },
  act_replay() { this.goPhase('void'); },
  act_toArchive() { wx.switchTab({ url: '/pages/archive/archive' }); }
});
