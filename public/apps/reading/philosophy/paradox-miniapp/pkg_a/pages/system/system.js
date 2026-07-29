const DATA = require('../../data.js');
const CATCOLOR = {'宗教思想':'#a73e2c','中国地域':'#1d4e5f','历史进程':'#b8893a','抽象系统':'#6d4a8f','经济金融':'#3f7a52','宇宙演化':'#a73e2c','科技演化':'#1d4e5f','思想体系':'#b8893a','影视文学':'#6d4a8f','学科反思':'#3f7a52','中国王朝史':'#a73e2c'};
Page({
  data: { s: null, cards: [], color: '#a73e2c',
          preOpen: false, preMore: false,
          mpOpen: false, mpMore: false,
          metaOpen: false, metaMore: false },
  onLoad(q) {
    this.sid = q.id;
    const s = DATA[q.id];
    if (!s) { wx.showToast({ title: '未找到该系统', icon: 'none' }); return; }
    const cards = s.ts.map((t, i) => ({ i, n: t.n, a: t.a, b: t.b, sum: t.sum, ih: t.ih, single: !t.b }));
    // 折叠视图：前置显示 1 段、母悖论显示 4 段、元结论显示 2 段，超出的可展开
    this.setData({
      s: { name: s.name, cat: s.cat, era: s.era, tag: s.tag,
           pre: s.pre, preHead: s.pre.slice(0, 1),
           mpA: s.mp.a, mpB: s.mp.b, mpd: s.mp.d, mpdHead: s.mp.d.slice(0, 4),
           meta: s.meta, metaHead: s.meta.slice(0, 2) },
      cards,
      color: CATCOLOR[s.cat] || '#a73e2c',
      preMore: s.pre.length > 1,
      mpMore: s.mp.d.length > 4,
      metaMore: s.meta.length > 2
    });
    wx.setNavigationBarTitle({ title: s.name });
  },
  togglePre() { this.setData({ preOpen: !this.data.preOpen }); },
  toggleMp() { this.setData({ mpOpen: !this.data.mpOpen }); },
  toggleMeta() { this.setData({ metaOpen: !this.data.metaOpen }); },
  goTension(e) {
    wx.navigateTo({ url: '../tension/tension?id=' + this.sid + '&t=' + e.currentTarget.dataset.i });
  },
  onShareAppMessage() {
    const s = this.data.s || {};
    return { title: '悖论图谱 · ' + (s.name || ''), path: getCurrentPages().slice(-1)[0].route + '?id=' + this.sid };
  }
});
