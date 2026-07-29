const catalog = require('../../data/catalog.js');
const app = getApp();

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navSolid: false,
    rootClass: '',
    groups: []
  },

  onLoad() {
    const g = app.globalData;
    this.setData({
      statusBarHeight: g.statusBarHeight,
      navBarHeight: g.navBarHeight,
      rootClass: g.theme === 'dark' ? 'theme-dark' : '',
      groups: catalog.grouped()
    });
  },

  onShow() {
    const g = app.globalData;
    const rc = g.theme === 'dark' ? 'theme-dark' : '';
    if (rc !== this.data.rootClass) this.setData({ rootClass: rc });
  },

  onPageScroll(e) {
    const solid = e.scrollTop > 64;
    if (solid !== this.data.navSolid) this.setData({ navSolid: solid });
  },

  toggleTheme() {
    const next = app.globalData.theme === 'dark' ? 'light' : 'dark';
    app.setTheme(next);
    this.setData({ rootClass: next === 'dark' ? 'theme-dark' : '' });
  },

  openArticle(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/article/article?id=' + id });
  },

  openAbout() {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  onShareAppMessage() {
    return { title: '在不可消解的张力中安居 · 十二篇动力学分析' };
  }
});
