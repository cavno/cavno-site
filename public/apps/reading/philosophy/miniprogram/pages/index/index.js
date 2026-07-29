const app = getApp();
const { toc } = require('../../data/content.js');

// 给目录补充"诊断→救治"阶段标签与一句话说明
const phaseMap = {
  prologue: { phase: 'PROLOGUE', desc: '为什么是虚无' },
  ch1: { phase: 'DIAGNOSIS', desc: '谱系 · 病史' },
  ch2: { phase: 'SYMPTOMS', desc: '五型 · 十相' },
  ch3: { phase: 'ETIOLOGY', desc: '资本 · 政治 · 城市' },
  ch4: { phase: 'PATHOLOGY', desc: '焦虑 · 抑郁' },
  ch5: { phase: 'REMEDY', desc: '自我 · 文化 · 社会' },
  synthesis: { phase: 'SYNTHESIS', desc: '命运 · 理性 · 社会' }
};

Page({
  data: {
    statusBarHeight: 20,
    toc: []
  },
  onLoad() {
    const list = toc.map(function (t) {
      return Object.assign({}, t, phaseMap[t.id] || {});
    });
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight || 20,
      toc: list
    });
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },
  onShareAppMessage() {
    return {
      title: '探索生命的意义与价值 · 从虚无中寻找希望与力量',
      path: '/pages/index/index'
    };
  }
});
