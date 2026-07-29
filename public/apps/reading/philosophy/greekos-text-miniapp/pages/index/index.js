// 16组核心概念二元对立 · 去看古希腊哲学 —— 文字版原生小程序
const D = require('./data.js');

// 派生：脉络分组 + 编号→entry 映射
const SECTIONS = [];
const NUM2IDX = {};
let curSec = null;
D.ENTRIES.forEach((e, idx) => {
  if (e.type === 'section') { curSec = { roman: e.roman, title: e.title, idx, items: [] }; SECTIONS.push(curSec); }
  else if (e.type === 'opp') {
    if (curSec) curSec.items.push({ idx, no: e.no, cn: e.cn, greek: e.greek });
    (e.nums || []).forEach(n => { NUM2IDX[n] = idx; });
  } else if (e.type === 'synthesis') { SECTIONS.push({ synthesis: true, roman: e.roman, title: e.title, idx }); }
});
const OPP_COUNT = D.ENTRIES.filter(e => e.type === 'opp').length;

Page({
  data: {
    title: D.title,
    intro: D.INTRO,
    table: D.TABLE,
    sections: SECTIONS,
    view: 'toc',        // 'toc' | 'read'
    tab: 'table',       // 'table' | 'flow'
    idx: 0,
    entry: null,
    crumb: '',
    pos: '',
    total: D.ENTRIES.length,
    showTop: false
  },

  onLoad() {},

  switchTab(e) { this.setData({ tab: e.currentTarget.dataset.t }); },

  openByNum(e) { this.open(NUM2IDX[+e.currentTarget.dataset.n]); },
  openByIdx(e) { this.open(+e.currentTarget.dataset.i); },
  open(idx) {
    const e = D.ENTRIES[idx];
    let crumb = '', pos = '';
    if (e.type === 'opp') { crumb = e.roman + '、' + this.secTitle(e.roman); pos = '对立 ' + e.no; }
    else if (e.type === 'section') { crumb = '阶段 ' + e.roman; pos = '导言'; }
    else { crumb = e.roman + '、'; pos = '总纲'; }
    this.setData({ view: 'read', idx, entry: e, crumb, pos, showTop: false });
    this.toTop();
  },
  secTitle(roman) { const s = SECTIONS.find(x => x.roman === roman); return s ? s.title : ''; },

  prev() { if (this.data.idx > 0) this.open(this.data.idx - 1); },
  next() { if (this.data.idx < D.ENTRIES.length - 1) this.open(this.data.idx + 1); },
  toToc() { this.setData({ view: 'toc' }); },
  toTop() { wx.pageScrollTo && wx.pageScrollTo({ scrollTop: 0, duration: 200 }); },

  onPageScroll(e) {
    const show = e.scrollTop > 600;
    if (show !== this.data.showTop) this.setData({ showTop: show });
  },
  noop() {}
});
