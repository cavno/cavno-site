App({
  globalData: {
    courseTitle: "西方哲学史考察十讲",
    teacher: "梅春雷"
  },

  onLaunch() {
    const progress = wx.getStorageSync("courseProgress");
    if (!progress) {
      wx.setStorageSync("courseProgress", {
        lastLectureId: 1,
        readLectures: []
      });
    }
  }
});
