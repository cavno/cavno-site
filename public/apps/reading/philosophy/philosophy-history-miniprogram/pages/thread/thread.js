const { spine, hiddenThreads } = require("../../data/course");

Page({
  data: {
    spine,
    hiddenThreads,
    activeId: 1,
    scrollIntoView: "stage-1"
  },

  selectStage(event) {
    const id = Number(event.currentTarget.dataset.id);
    this.setData({
      activeId: id,
      scrollIntoView: `stage-${id}`
    });
  },

  goLecture(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/lecture/lecture?id=${id}`
    });
  }
});
