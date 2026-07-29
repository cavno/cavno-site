const { CONCEPTS, DUALITIES } = require('../../data/atlas.js');

Page({
  data: {
    tab: 'concepts',
    concepts: CONCEPTS.map(c => Object.assign({}, c, {
      stages: c.stages.map((s, i) => Object.assign({ k: i }, s))
    })),
    dualities: DUALITIES
  },
  onLoad(options) {
    const tab = options.tab === 'dual' ? 'dual' : 'concepts';
    this.setData({ tab });
    wx.setNavigationBarTitle({ title: '谱系与张力' });
  },
  switchTab(e) {
    this.setData({ tab: e.currentTarget.dataset.tab });
    wx.pageScrollTo({ scrollTop: 0, duration: 200 });
  }
});
