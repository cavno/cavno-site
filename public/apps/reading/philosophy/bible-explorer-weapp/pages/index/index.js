const BOOKS = require('../../data/books.js');
const TIMELINE = require('../../data/timeline.js');
const STORIES = require('../../data/stories.js');
const FIGURES = require('../../data/figures.js');
const THEMES = require('../../data/themes.js');

// 模块级索引：id -> 详情对象（不放进 data，避免 setData 负担过重）
let INDEX = {};

/* 将详情 HTML 字符串转为 rich-text 可渲染、带主题色的节点字符串 */
function toNodes(html, dark) {
  const textColor = dark ? '#c8bfa8' : '#4a443a';
  const strongColor = dark ? '#ede4d0' : '#2c2823';
  // 先转义裸 & （内容中无 HTML 实体）
  let safe = String(html).replace(/&/g, '&amp;');
  // 按双换行切分为段落
  const paras = safe.split(/<br\s*\/?>\s*<br\s*\/?>/i);
  return paras.map(function (p) {
    const inner = p
      .replace(/<strong>/g, '<strong style="color:' + strongColor + ';font-weight:600">')
      .replace(/<br\s*\/?>/g, '<br/>');
    return '<p style="margin:0 0 30rpx;font-size:30rpx;line-height:1.85;color:' + textColor + '">' + inner + '</p>';
  }).join('');
}

/* ---- 构建各面板的精简渲染数据，同时填充 INDEX ---- */
function buildTestament(t) {
  return {
    name: t.name,
    eng: t.eng,
    meta: t.meta,
    tagline: t.tagline,
    categories: t.categories.map(function (c) {
      return {
        id: c.id,
        name: c.name,
        meta: c.meta,
        books: c.books.map(function (b) {
          INDEX[b.id] = {
            eyebrow: '卷 · ' + c.name,
            title: b.name,
            sub: b.eng,
            meta: [
              { label: '作者', value: b.author },
              { label: '写作时期', value: b.period },
              { label: '章数', value: String(b.chapters) }
            ],
            body: b.detail
          };
          return { id: b.id, name: b.name };
        })
      };
    })
  };
}

function buildTimeline() {
  return TIMELINE.map(function (era) {
    const eraLabel = era.eraTitle.split(' · ')[0];
    return {
      era: era.era,
      eraTitle: era.eraTitle,
      events: era.events.map(function (ev) {
        INDEX[ev.id] = {
          eyebrow: '时间线 · ' + eraLabel,
          title: ev.title,
          sub: ev.ref,
          meta: [{ label: '经文', value: ev.ref }],
          body: ev.detail
        };
        return { id: ev.id, title: ev.title, brief: ev.brief, ref: ev.ref };
      })
    };
  });
}

function buildStories() {
  return ['old', 'new'].map(function (k) {
    const sec = STORIES[k];
    return {
      label: sec.label,
      items: sec.items.map(function (s) {
        INDEX[s.id] = {
          eyebrow: '叙事 · ' + (k === 'old' ? '旧约' : '新约'),
          title: s.title,
          sub: s.sub,
          meta: [{ label: '经文', value: s.ref }],
          body: s.detail
        };
        return { id: s.id, title: s.title, sub: s.sub, ref: s.ref };
      })
    };
  });
}

function buildFigures() {
  return FIGURES.map(function (g) {
    return {
      era: g.era,
      items: g.items.map(function (f) {
        INDEX[f.id] = {
          eyebrow: '人物 · ' + g.era,
          title: f.name,
          sub: f.role,
          meta: [{ label: '身份', value: f.role }],
          body: f.detail
        };
        return { id: f.id, name: f.name, role: f.role };
      })
    };
  });
}

function buildThemes() {
  return THEMES.map(function (t) {
    INDEX[t.id] = {
      eyebrow: '神学主题',
      title: t.name,
      sub: t.brief,
      meta: [],
      body: t.detail
    };
    return { id: t.id, name: t.name, brief: t.brief };
  });
}

Page({
  data: {
    theme: 'light',
    active: 'overview',
    tabs: [
      { id: 'overview', num: 'Ⅰ', label: '概览' },
      { id: 'timeline', num: 'Ⅱ', label: '时间线' },
      { id: 'stories', num: 'Ⅲ', label: '故事' },
      { id: 'figures', num: 'Ⅳ', label: '人物' },
      { id: 'themes', num: 'Ⅴ', label: '主题' }
    ],
    testaments: [],
    timeline: [],
    stories: [],
    figures: [],
    themes: [],
    drawerOpen: false,
    drawerData: { eyebrow: '', title: '', sub: '', meta: [], bodyNodes: '' }
  },

  onLoad() {
    INDEX = {};
    const app = getApp();
    const theme = (app && app.globalData && app.globalData.theme) || 'light';

    this.setData({
      theme: theme,
      testaments: [buildTestament(BOOKS.old), buildTestament(BOOKS.new)],
      timeline: buildTimeline(),
      stories: buildStories(),
      figures: buildFigures(),
      themes: buildThemes()
    });

    this.applyChrome(theme);
  },

  onShow() {
    // 与全局主题保持同步（以防其他入口变更）
    const app = getApp();
    const theme = (app && app.globalData && app.globalData.theme) || this.data.theme;
    if (theme !== this.data.theme) {
      this.setData({ theme: theme });
    }
    this.applyChrome(theme);
  },

  // 设置原生导航栏与窗口背景色
  applyChrome(theme) {
    const dark = theme === 'dark';
    wx.setNavigationBarColor({
      frontColor: dark ? '#ffffff' : '#000000',
      backgroundColor: dark ? '#1a1814' : '#f5f0e6'
    });
    if (wx.setBackgroundColor) {
      wx.setBackgroundColor({ backgroundColor: dark ? '#1a1814' : '#f5f0e6' });
    }
  },

  switchTab(e) {
    this.setData({ active: e.currentTarget.dataset.tab });
  },

  toggleTheme() {
    const next = this.data.theme === 'dark' ? 'light' : 'dark';
    try {
      wx.setStorageSync('bible-atlas-theme', next);
    } catch (e) {}
    const app = getApp();
    if (app && app.globalData) app.globalData.theme = next;

    const patch = { theme: next };
    // 抽屉打开时，同步重渲染正文颜色
    if (this.data.drawerOpen && this._lastId) {
      const d = INDEX[this._lastId];
      if (d) patch['drawerData.bodyNodes'] = toNodes(d.body, next === 'dark');
    }
    this.setData(patch);
    this.applyChrome(next);
  },

  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    const d = INDEX[id];
    if (!d) return;
    this._lastId = id;
    this.setData({
      drawerOpen: true,
      drawerData: {
        eyebrow: d.eyebrow,
        title: d.title,
        sub: d.sub,
        meta: d.meta,
        bodyNodes: toNodes(d.body, this.data.theme === 'dark')
      }
    });
  },

  closeDetail() {
    this.setData({ drawerOpen: false });
  },

  noop() {}
});
