App({
  onLaunch() {
    // 记录系统信息，供页面做安全区/状态栏适配
    try {
      const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      this.globalData.statusBarHeight = info.statusBarHeight || 20;
      this.globalData.windowWidth = info.windowWidth || 375;
    } catch (e) {
      this.globalData.statusBarHeight = 20;
    }
  },
  globalData: {
    statusBarHeight: 20,
    windowWidth: 375
  }
});
