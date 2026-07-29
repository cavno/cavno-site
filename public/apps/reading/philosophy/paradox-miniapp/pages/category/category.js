const DB = require('../../data/index.js');
Page({
  data: { cat: '', color: '#a73e2c', groups: [], total: 0 },
  onLoad(q) {
    const cat = decodeURIComponent(q.cat || '');
    const meta = DB.CATS.find(c => c.name === cat) || { color: '#a73e2c' };
    const items = DB.SYS.filter(s => s.cat === cat);
    // era grouping: only when >=2 distinct eras AND >=6 items (same rule as web)
    const eras = [];
    items.forEach(s => { if (s.era && eras.indexOf(s.era) < 0) eras.push(s.era); });
    const useEra = eras.length >= 2 && items.length >= 6;
    const groups = [];
    if (useEra) {
      let last = null, cur = null;
      items.forEach(s => {
        if (s.era !== last) { cur = { era: s.era, items: [] }; groups.push(cur); last = s.era; }
        cur.items.push(s);
      });
    } else {
      groups.push({ era: '', items });
    }
    this.setData({ cat, color: meta.color, groups, total: items.length });
    wx.setNavigationBarTitle({ title: cat });
  },
  goSys(e) {
    const d = e.currentTarget.dataset;
    wx.navigateTo({ url: '/' + d.pkg + '/pages/system/system?id=' + d.id });
  },
  onShareAppMessage() {
    return { title: '悖论图谱 · ' + this.data.cat, path: '/pages/category/category?cat=' + encodeURIComponent(this.data.cat) };
  }
});
