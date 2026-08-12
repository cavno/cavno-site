const catalog = require('../../data/catalog.js');
const contentMap = require('../../data/content.js');
const parser = require('../../utils/parser.js');
const app = getApp();

const FONT_CLASS = { 0.9: 'fs-s', 1: 'fs-m', 1.12: 'fs-l' };
const FONT_LABEL = { 0.9: '小', 1: '中', 1.12: '大' };

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    capsuleRight: 96,

    rootClass: '',
    fontClass: 'fs-m',
    fontLabel: '中',

    meta: null,
    catName: '',
    catColor: 'var(--c-phil)',
    blocks: [],
    outline: [],

    progress: 0,
    showTitle: false,
    showTop: false,
    intoView: '',

    tocOpen: false
  },

  onLoad(query) {
    const g = app.globalData;
    const id = query.id;
    const meta = catalog.byId(id);
    let catName = '';
    let catColor = 'var(--c-phil)';
    if (meta) {
      const c = catalog.categories.find(function (x) { return x.key === meta.cat; });
      if (c) { catName = c.name; catColor = c.color; }
    }
    const raw = contentMap[id] || '（暂无内容）';
    const blocks = parser.parse(raw);
    const outline = parser.outline(blocks);

    const scale = g.fontScale || 1;

    this.setData({
      statusBarHeight: g.statusBarHeight,
      navBarHeight: g.navBarHeight,
      navTotalHeight: g.navTotalHeight,
      capsuleRight: g.capsuleRight,
      rootClass: g.theme === 'dark' ? 'theme-dark' : '',
      fontClass: FONT_CLASS[scale] || 'fs-m',
      fontLabel: FONT_LABEL[scale] || '中',
      meta: meta,
      catName: catName,
      catColor: catColor,
      blocks: blocks,
      outline: outline
    });

    if (meta) {
      wx.setNavigationBarTitle({ title: meta.title });
    }
  },

  onContentScroll(e) {
    const st = e.detail.scrollTop;
    const sh = e.detail.scrollHeight;
    const vh = this.data.navTotalHeight; // placeholder; recompute below
    // 视口高度
    const winH = (wx.getWindowInfo ? wx.getWindowInfo().windowHeight : 667);
    const denom = Math.max(1, sh - winH);
    let p = st / denom;
    if (p < 0) p = 0; if (p > 1) p = 1;

    const showTitle = st > 160;
    const showTop = st > 700;
    const patch = { progress: p };
    if (showTitle !== this.data.showTitle) patch.showTitle = showTitle;
    if (showTop !== this.data.showTop) patch.showTop = showTop;
    this.setData(patch);
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  openToc() {
    this.setData({ tocOpen: true });
  },
  closeToc() {
    this.setData({ tocOpen: false });
  },
  noop() {},

  jumpTo(e) {
    const sid = e.currentTarget.dataset.sid;
    this.setData({ tocOpen: false, intoView: sid });
    const self = this;
    setTimeout(function () { self.setData({ intoView: '' }); }, 450);
  },

  backToTop() {
    this.setData({ intoView: 'reading-top' });
    const self = this;
    setTimeout(function () { self.setData({ intoView: '' }); }, 450);
  },

  cycleFont() {
    const order = [0.9, 1, 1.12];
    const cur = app.globalData.fontScale || 1;
    let i = order.indexOf(cur);
    i = (i + 1) % order.length;
    const next = order[i];
    app.setFontScale(next);
    this.setData({ fontClass: FONT_CLASS[next], fontLabel: FONT_LABEL[next] });
  },

  toggleTheme() {
    const next = app.globalData.theme === 'dark' ? 'light' : 'dark';
    app.setTheme(next);
    this.setData({ rootClass: next === 'dark' ? 'theme-dark' : '' });
  },

  onShareAppMessage() {
    const m = this.data.meta;
    return { title: (m ? m.title + ' · ' + m.sub : '张力 · 动力学') };
  }
});
