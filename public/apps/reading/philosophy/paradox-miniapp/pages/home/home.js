const DB = require('../../data/index.js');
Page({
  data: { cats: DB.CATS, stats: DB.STATS },
  goCat(e) {
    wx.navigateTo({ url: '/pages/category/category?cat=' + encodeURIComponent(e.currentTarget.dataset.name) });
  },
  onShareAppMessage() {
    return { title: '悖论图谱 · 96 个系统的张力动力学', path: '/pages/home/home' };
  },
  onShareTimeline() { return { title: '悖论图谱 · 张力即演化的动力' }; }
});
