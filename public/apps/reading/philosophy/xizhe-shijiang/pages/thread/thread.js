const { SPINE, THREADS } = require('../../data/threads.js');

Page({
  data: {
    spine: SPINE,
    threads: THREADS.map(t => Object.assign({}, t, {
      stops: t.stops.map((sp, i) => Object.assign({ k: i }, sp))
    }))
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: '思想脉络 · 六条贯穿线' });
  },
  goLecture(e) {
    const lec = e.currentTarget.dataset.lec;
    const map = { '第一讲': 1, '第二讲': 2, '第三讲': 3, '第四讲': 4 };
    if (map[lec]) {
      wx.navigateTo({ url: '/pages/lecture/lecture?id=' + map[lec] });
    }
  }
});
