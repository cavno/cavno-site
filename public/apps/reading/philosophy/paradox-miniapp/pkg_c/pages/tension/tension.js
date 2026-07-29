const DATA = require('../../data.js');
Page({
  data: { sname: '', t: null, hasPrev: false, hasNext: false, num: '' },
  onLoad(q) {
    this.sid = q.id;
    this.ti = parseInt(q.t || '0', 10);
    const s = DATA[q.id];
    if (!s || !s.ts[this.ti]) { wx.showToast({ title: '未找到该张力', icon: 'none' }); return; }
    const t = s.ts[this.ti];
    this.setData({
      sname: s.name,
      t: { a: t.a, b: t.b, single: !t.b, body: t.body },
      num: t.n < 10 ? '0' + t.n : '' + t.n,
      hasPrev: this.ti > 0,
      hasNext: this.ti < s.ts.length - 1
    });
    wx.setNavigationBarTitle({ title: '张力 ' + t.n + ' · ' + s.name });
  },
  prev() {
    if (!this.data.hasPrev) return;
    wx.redirectTo({ url: 'tension?id=' + this.sid + '&t=' + (this.ti - 1) });
  },
  next() {
    if (!this.data.hasNext) return;
    wx.redirectTo({ url: 'tension?id=' + this.sid + '&t=' + (this.ti + 1) });
  },
  backSys() {
    const pages = getCurrentPages();
    if (pages.length > 1) { wx.navigateBack(); }
    else { wx.redirectTo({ url: '../system/system?id=' + this.sid }); }
  },
  onShareAppMessage() {
    return { title: this.data.sname + ' · 张力 ' + this.data.num,
             path: getCurrentPages().slice(-1)[0].route + '?id=' + this.sid + '&t=' + this.ti };
  }
});
