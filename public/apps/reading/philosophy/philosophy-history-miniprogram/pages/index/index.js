const { lectures, hiddenThreads } = require("../../data/course");
const { getProgress, getFavorites } = require("../../utils/storage");

Page({
  data: {
    lectures: [],
    hiddenThreads,
    continueLecture: null,
    readCount: 0,
    progressPercent: 0
  },

  onShow() {
    const progress = getProgress();
    const favorites = getFavorites();
    const decorated = lectures.map((lecture) => ({
      ...lecture,
      isRead: progress.readLectures.includes(lecture.id),
      isFavorite: favorites.includes(lecture.id)
    }));
    const continueLecture = lectures.find((item) => item.id === progress.lastLectureId) || lectures[0];
    const readCount = progress.readLectures.length;

    this.setData({
      lectures: decorated,
      continueLecture,
      readCount,
      progressPercent: Math.round((readCount / lectures.length) * 100)
    });
  },

  goLecture(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/lecture/lecture?id=${id}`
    });
  },

  goThread() {
    wx.switchTab({
      url: "/pages/thread/thread"
    });
  },

  goAbout() {
    wx.navigateTo({
      url: "/pages/about/about"
    });
  }
});
