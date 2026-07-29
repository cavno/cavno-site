const { BANDS } = require('../../data/figures.js');

Page({
  data: { bands: BANDS },
  onLoad() {
    wx.setNavigationBarTitle({ title: '人物长廊' });
  }
});
