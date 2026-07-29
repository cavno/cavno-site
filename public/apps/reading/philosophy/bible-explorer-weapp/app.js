App({
  globalData: {
    theme: 'light'
  },
  onLaunch() {
    // 读取存储的主题；若无则尝试跟随系统
    let theme = '';
    try {
      theme = wx.getStorageSync('bible-atlas-theme');
    } catch (e) {
      theme = '';
    }
    if (!theme) {
      try {
        const info = wx.getSystemInfoSync();
        theme = info.theme === 'dark' ? 'dark' : 'light';
      } catch (e) {
        theme = 'light';
      }
    }
    this.globalData.theme = theme;
  }
});
