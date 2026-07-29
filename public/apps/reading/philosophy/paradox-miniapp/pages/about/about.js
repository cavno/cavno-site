const DB = require('../../data/index.js');
Page({
  data: { stats: DB.STATS },
  onShareAppMessage() { return { title: '悖论图谱 · 方法论', path: '/pages/about/about' }; }
});
