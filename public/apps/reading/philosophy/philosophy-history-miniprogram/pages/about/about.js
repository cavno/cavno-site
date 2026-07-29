const { lectures } = require("../../data/course");

Page({
  data: {
    lectures
  },

  goLecture(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/lecture/lecture?id=${id}`
    });
  }
});
