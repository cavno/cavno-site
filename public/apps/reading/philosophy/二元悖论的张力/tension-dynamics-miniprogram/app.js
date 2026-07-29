App({
  globalData: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    capsuleRight: 96,
    capsuleHeight: 32,
    theme: 'light',     // 'light' | 'dark'
    fontScale: 1        // 0.9 | 1 | 1.12
  },

  onLaunch() {
    // 计算自定义导航栏尺寸（兼容不同机型与刘海屏）
    let sys = {};
    try {
      sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    } catch (e) {
      sys = {};
    }
    const statusBarHeight = sys.statusBarHeight || 20;

    let capsule = null;
    try {
      capsule = wx.getMenuButtonBoundingClientRect();
    } catch (e) {
      capsule = null;
    }

    let navBarHeight;
    let capsuleRight;
    let capsuleHeight;
    if (capsule && capsule.top >= 0 && capsule.height > 0) {
      navBarHeight = (capsule.top - statusBarHeight) * 2 + capsule.height;
      const screenWidth = sys.screenWidth || sys.windowWidth || 375;
      capsuleRight = screenWidth - capsule.left;
      capsuleHeight = capsule.height;
    } else {
      navBarHeight = 44;
      capsuleRight = 96;
      capsuleHeight = 32;
    }

    this.globalData.statusBarHeight = statusBarHeight;
    this.globalData.navBarHeight = navBarHeight;
    this.globalData.navTotalHeight = statusBarHeight + navBarHeight;
    this.globalData.capsuleRight = capsuleRight;
    this.globalData.capsuleHeight = capsuleHeight;

    // 读取阅读偏好
    try {
      const t = wx.getStorageSync('theme');
      if (t === 'light' || t === 'dark') this.globalData.theme = t;
      const f = wx.getStorageSync('fontScale');
      if (f === 0.9 || f === 1 || f === 1.12) this.globalData.fontScale = f;
    } catch (e) {}
  },

  setTheme(theme) {
    this.globalData.theme = theme;
    try { wx.setStorageSync('theme', theme); } catch (e) {}
  },

  setFontScale(scale) {
    this.globalData.fontScale = scale;
    try { wx.setStorageSync('fontScale', scale); } catch (e) {}
  }
});
