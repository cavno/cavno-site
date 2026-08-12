/* =========================================================
   Biblical Atlas · script.js
   渲染面板 · 切换标签 · 抽屉详情 · 主题切换
   ========================================================= */

(function () {
  'use strict';

  // ---- 主题切换（深/浅色） ----
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  // 初始：检查 localStorage，否则跟随系统
  const savedTheme = localStorage.getItem('bible-atlas-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('bible-atlas-theme', next);
  });

  // ---- 标签切换 ----
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });

  // ---- 全局索引：所有可点击条目的查找表 ----
  const INDEX = new Map();

  // ---- 渲染：概览面板（66 卷书） ----
  function renderOverview() {
    const panel = document.getElementById('panel-overview');
    const html = `
      <div class="testaments">
        ${renderTestament(BOOKS_DATA.old)}
        ${renderTestament(BOOKS_DATA.new)}
      </div>
    `;
    panel.innerHTML = html;
  }

  function renderTestament(testament) {
    return `
      <article class="testament">
        <p class="testament-eyebrow">${testament.eng}</p>
        <h2 class="testament-title">${testament.name}</h2>
        <p class="testament-meta">${testament.meta} · ${testament.tagline}</p>
        ${testament.categories.map(cat => `
          <div class="cat">
            <div class="cat-head">
              <span class="cat-name">${cat.name}</span>
              <span class="cat-meta">${cat.meta}</span>
            </div>
            <div class="books">
              ${cat.books.map(book => {
                // 注册到索引
                INDEX.set(book.id, {
                  type: 'book',
                  eyebrow: `卷 · ${cat.name}`,
                  title: book.name,
                  sub: book.eng,
                  meta: [
                    { label: '作者', value: book.author },
                    { label: '写作时期', value: book.period },
                    { label: '章数', value: book.chapters }
                  ],
                  body: book.detail
                });
                return `<button class="book" data-id="${book.id}">${book.name}</button>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </article>
    `;
  }

  // ---- 渲染：时间线面板 ----
  function renderTimeline() {
    const panel = document.getElementById('panel-timeline');
    const html = `
      <div class="timeline">
        ${TIMELINE_DATA.map(era => `
          <div class="era">
            ${era.era}
            <span class="era-title">${era.eraTitle}</span>
          </div>
          ${era.events.map(event => {
            INDEX.set(event.id, {
              type: 'event',
              eyebrow: `时间线 · ${era.eraTitle.split(' · ')[0]}`,
              title: event.title,
              sub: event.ref,
              meta: [{ label: '经文', value: event.ref }],
              body: event.detail
            });
            return `
              <div class="event" data-id="${event.id}">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-brief">${event.brief}</p>
                <span class="event-ref">${event.ref}</span>
              </div>
            `;
          }).join('')}
        `).join('')}
      </div>
    `;
    panel.innerHTML = html;
  }

  // ---- 渲染：故事面板 ----
  function renderStories() {
    const panel = document.getElementById('panel-stories');
    const html = `
      ${['old', 'new'].map(testament => {
        const section = STORIES_DATA[testament];
        return `
          <div class="section">
            <div class="section-label">${section.label}</div>
            <div class="cards">
              ${section.items.map(item => {
                INDEX.set(item.id, {
                  type: 'story',
                  eyebrow: `叙事 · ${testament === 'old' ? '旧约' : '新约'}`,
                  title: item.title,
                  sub: item.sub,
                  meta: [{ label: '经文', value: item.ref }],
                  body: item.detail
                });
                return `
                  <button class="card" data-id="${item.id}">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-sub">${item.sub} · ${item.ref}</p>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    `;
    panel.innerHTML = html;
  }

  // ---- 渲染：人物面板 ----
  function renderFigures() {
    const panel = document.getElementById('panel-figures');
    const html = FIGURES_DATA.map(group => `
      <div class="section">
        <div class="section-label">${group.era}</div>
        <div class="cards">
          ${group.items.map(item => {
            INDEX.set(item.id, {
              type: 'figure',
              eyebrow: `人物 · ${group.era}`,
              title: item.name,
              sub: item.role,
              meta: [{ label: '身份', value: item.role }],
              body: item.detail
            });
            return `
              <button class="card" data-id="${item.id}">
                <h3 class="card-title">${item.name}</h3>
                <p class="card-sub">${item.role}</p>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
    panel.innerHTML = html;
  }

  // ---- 渲染：主题面板 ----
  function renderThemes() {
    const panel = document.getElementById('panel-themes');
    const html = `
      <div class="section">
        <div class="section-label">圣经的八大主题</div>
        ${THEMES_DATA.map(theme => {
          INDEX.set(theme.id, {
            type: 'theme',
            eyebrow: '神学主题',
            title: theme.name,
            sub: theme.brief,
            meta: [],
            body: theme.detail
          });
          return `
            <button class="theme-card" data-id="${theme.id}">
              <h3 class="theme-name">${theme.name}</h3>
              <p class="theme-desc">${theme.brief}</p>
            </button>
          `;
        }).join('')}
      </div>
    `;
    panel.innerHTML = html;
  }

  // ---- 抽屉逻辑 ----
  const drawer = document.getElementById('drawer');
  const drawerContent = document.getElementById('drawerContent');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer(id) {
    const data = INDEX.get(id);
    if (!data) return;
    const metaHtml = data.meta.length
      ? `<div class="d-meta">${data.meta.map(m => `<span><b>${m.label}</b>${m.value}</span>`).join('')}</div>`
      : '';
    drawerContent.innerHTML = `
      <p class="d-eyebrow">${data.eyebrow}</p>
      <h2 id="drawerTitle">${data.title}</h2>
      <p class="d-sub">${data.sub}</p>
      ${metaHtml}
      <div class="d-body">${data.body}</div>
    `;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    // 滚动抽屉内容到顶部
    drawer.querySelector('.drawer-panel').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  // ---- 事件委托：所有 [data-id] 元素都打开抽屉 ----
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-id]');
    if (trigger && document.body.contains(trigger)) {
      openDrawer(trigger.dataset.id);
    }
  });

  // ---- 启动渲染 ----
  renderOverview();
  renderTimeline();
  renderStories();
  renderFigures();
  renderThemes();

  // 控制台输出统计
  console.log(`%cBiblical Atlas`, 'font-family: serif; font-size: 16px; color: #8b2635;');
  console.log(`%c已加载 ${INDEX.size} 个条目 · 旧约 ${BOOKS_DATA.old.categories.reduce((s, c) => s + c.books.length, 0)} 卷 · 新约 ${BOOKS_DATA.new.categories.reduce((s, c) => s + c.books.length, 0)} 卷`, 'color: #786e5e;');
})();
