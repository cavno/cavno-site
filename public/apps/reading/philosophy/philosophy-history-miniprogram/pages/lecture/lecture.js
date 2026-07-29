const { lectures, getLectureById } = require("../../data/course");
const {
  markLectureRead,
  getFavorites,
  toggleFavorite
} = require("../../utils/storage");

Page({
  data: {
    lecture: null,
    isFavorite: false,
    nextLecture: null
  },

  onLoad(options) {
    const lecture = getLectureById(options.id || 1);
    if (!lecture) {
      wx.showToast({
        title: "讲次不存在",
        icon: "none"
      });
      return;
    }

    const sections = lecture.sections.map((section) => ({
      ...section,
      expanded: true
    }));
    const nextLecture = lectures.find((item) => item.id === lecture.id + 1) || null;
    const isFavorite = getFavorites().includes(lecture.id);

    this.setData({
      lecture: {
        ...lecture,
        sections
      },
      nextLecture,
      isFavorite
    });
    markLectureRead(lecture.id);
    wx.setNavigationBarTitle({
      title: lecture.number
    });
  },

  toggleSection(event) {
    const index = Number(event.currentTarget.dataset.index);
    const key = `lecture.sections[${index}].expanded`;
    this.setData({
      [key]: !this.data.lecture.sections[index].expanded
    });
  },

  scrollToSection(event) {
    const id = event.currentTarget.dataset.id;
    wx.pageScrollTo({
      selector: `#${id}`,
      duration: 320
    });
  },

  toggleFavorite() {
    const favorites = toggleFavorite(this.data.lecture.id);
    const isFavorite = favorites.includes(this.data.lecture.id);
    this.setData({ isFavorite });
    wx.showToast({
      title: isFavorite ? "已收藏" : "已取消收藏",
      icon: "none"
    });
  },

  goNext() {
    if (!this.data.nextLecture) {
      wx.switchTab({
        url: "/pages/thread/thread"
      });
      return;
    }
    wx.redirectTo({
      url: `/pages/lecture/lecture?id=${this.data.nextLecture.id}`
    });
  },

  onShareAppMessage() {
    const lecture = this.data.lecture;
    return {
      title: `${lecture.number}：${lecture.title}`,
      path: `/pages/lecture/lecture?id=${lecture.id}`
    };
  }
});
