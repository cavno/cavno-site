const { LECTURES } = require('../../data/lectures.js');

Page({
  data: { lec: null, prev: null, next: null },
  onLoad(options) {
    const id = parseInt(options.id, 10) || 1;
    this.setLecture(id);
  },
  setLecture(id) {
    const raw = LECTURES.find(l => l.id === id) || LECTURES[0];
    const lec = Object.assign({}, raw, {
      sections: raw.sections.map((s, i) => Object.assign({ k: i }, s))
    });
    const prev = LECTURES.find(l => l.id === lec.id - 1) || null;
    const next = LECTURES.find(l => l.id === lec.id + 1) || null;
    this.setData({
      lec,
      prev: prev ? { id: prev.id, num: prev.num, title: prev.title } : null,
      next: next ? { id: next.id, num: next.num, title: next.title } : null
    });
    wx.setNavigationBarTitle({ title: lec.num + ' · ' + lec.title });
  },
  goPrev() {
    if (this.data.prev) {
      wx.redirectTo({ url: '/pages/lecture/lecture?id=' + this.data.prev.id });
    }
  },
  goNext() {
    if (this.data.next) {
      wx.redirectTo({ url: '/pages/lecture/lecture?id=' + this.data.next.id });
    }
  },
  goHome() {
    wx.navigateBack({
      fail() { wx.reLaunch({ url: '/pages/index/index' }); }
    });
  }
});
