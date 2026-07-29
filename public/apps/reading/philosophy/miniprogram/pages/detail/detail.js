const { getChapter, getNav } = require('../../data/content.js');

Page({
  data: {
    chapter: null,
    activeThinker: 0,
    activeTab: 'types',
    prev: null,
    next: null
  },

  onLoad(query) {
    this._render(query && query.id ? query.id : 'prologue');
  },

  _render(id) {
    const chapter = getChapter(id);
    const nav = getNav(chapter.id);
    wx.setNavigationBarTitle({ title: chapter.roman + ' · ' + chapter.navTitle });
    this.setData({
      chapter: chapter,
      prev: nav.prev,
      next: nav.next,
      activeThinker: 0,
      activeTab: 'types'
    });
    // 回到顶部
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },

  // 第一章：切换思想家
  onThinkerTap(e) {
    const i = e.currentTarget.dataset.index;
    if (i === this.data.activeThinker) return;
    this.setData({ activeThinker: i });
  },

  // 第二章：切换标签
  onTabTap(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    this.setData({ activeTab: tab });
  },

  // 上一章 / 下一章（替换当前页，避免返回栈无限增长）
  goChapter(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.redirectTo({ url: '/pages/detail/detail?id=' + id });
  },

  // 返回目录
  backToIndex() {
    wx.navigateBack({
      delta: 1,
      fail() {
        wx.reLaunch({ url: '/pages/index/index' });
      }
    });
  },

  onShareAppMessage() {
    const c = this.data.chapter || {};
    return {
      title: '探索生命的意义与价值 · ' + (c.title || ''),
      path: '/pages/detail/detail?id=' + (c.id || 'prologue')
    };
  }
});
