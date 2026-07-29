const { LECTURES } = require('../../data/lectures.js');
const { SPINE } = require('../../data/threads.js');

Page({
  data: {
    chain: [
      { name: '人类出现', on: false }, { name: '语言诞生', on: false },
      { name: '图腾禁忌', on: true }, { name: '巫术仪式', on: true },
      { name: '神话史诗', on: true }, { name: '宗教', on: true },
      { name: '哲学', on: true }, { name: '科学', on: false }
    ],
    spine: SPINE,
    lectures: LECTURES.map(l => ({
      id: l.id, num: l.num, date: l.date, title: l.title,
      sub: l.sub, accent: l.accent
    })),
    specials: [
      { key: 'thread', name: '思想脉络', sub: '六条贯穿线 · 四讲如何连成一条河', accent: 'ink' },
      { key: 'atlas-c', name: '概念谱系', sub: '六条长河:Logos · 命运 · 一 · 灵魂 · 神圣 · 共相', accent: 'aegean' },
      { key: 'atlas-d', name: '张力总表', sub: '原始之分 · 希腊十六对 · 神学五大矛盾', accent: 'wine' },
      { key: 'figures', name: '人物长廊', sub: '从巫师到加尔文,再到回望者', accent: 'gold' }
    ]
  },
  goLecture(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/lecture/lecture?id=' + id });
  },
  goSpecial(e) {
    const key = e.currentTarget.dataset.key;
    if (key === 'thread') wx.navigateTo({ url: '/pages/thread/thread' });
    else if (key === 'atlas-c') wx.navigateTo({ url: '/pages/atlas/atlas?tab=concepts' });
    else if (key === 'atlas-d') wx.navigateTo({ url: '/pages/atlas/atlas?tab=dual' });
    else if (key === 'figures') wx.navigateTo({ url: '/pages/figures/figures' });
  },
  goThread() {
    wx.navigateTo({ url: '/pages/thread/thread' });
  }
});
