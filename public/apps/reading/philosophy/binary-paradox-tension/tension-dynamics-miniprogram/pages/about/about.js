const app = getApp();
Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navSolid: false,
    rootClass: ''
  },
  onLoad() {
    const g = app.globalData;
    this.setData({
      statusBarHeight: g.statusBarHeight,
      navBarHeight: g.navBarHeight,
      rootClass: g.theme === 'dark' ? 'theme-dark' : ''
    });
  },
  onShow() {
    const rc = app.globalData.theme === 'dark' ? 'theme-dark' : '';
    if (rc !== this.data.rootClass) this.setData({ rootClass: rc });
  },
  onPageScroll(e) {
    const solid = e.scrollTop > 40;
    if (solid !== this.data.navSolid) this.setData({ navSolid: solid });
  },
  goBack() { wx.navigateBack({ delta: 1 }); }
});
