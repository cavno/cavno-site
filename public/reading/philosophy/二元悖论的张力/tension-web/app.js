/* =================================================================
   APP · 二元悖论的张力 —— 交互逻辑
   ================================================================= */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────────
  // STATE
  // ────────────────────────────────────────────────────────────────
  const state = {
    currentBranch: 'ontology',
    currentView: 'timeline',
    detailOpen: false
  };

  // ────────────────────────────────────────────────────────────────
  // ELEMENT REFS
  // ────────────────────────────────────────────────────────────────
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const els = {
    branchBtns: $$('.branch-btn'),
    viewBtns: $$('.view-btn'),
    views: $$('.view'),
    mpPursuit: $('#mp-pursuit'),
    mpLimit: $('#mp-limit'),
    mpGloss: $('#mp-gloss'),
    timelineContent: $('#timeline-content'),
    spiralContent: $('#spiral-content'),
    compareContent: $('#compare-content'),
    metaGrid: $('#meta-insights-grid'),
    detailPanel: $('#detail-panel'),
    detailContent: $('#detail-content'),
    detailClose: $('#detail-close'),
    detailBackdrop: $('#detail-backdrop')
  };

  // ────────────────────────────────────────────────────────────────
  // SVG SNIPPETS
  // ────────────────────────────────────────────────────────────────
  const TENSION_BAR_SVG = `
    <svg viewBox="0 0 50 30" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="tb-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--pole-left)"/>
          <stop offset="50%" stop-color="var(--accent-gold)"/>
          <stop offset="100%" stop-color="var(--pole-right)"/>
        </linearGradient>
      </defs>
      <line x1="2" y1="15" x2="48" y2="15" stroke="url(#tb-grad)" stroke-width="1.2" stroke-dasharray="2 2"/>
      <circle cx="25" cy="15" r="2.5" fill="var(--accent-gold)"/>
    </svg>
  `;

  // ────────────────────────────────────────────────────────────────
  // BRANCH SWITCHING
  // ────────────────────────────────────────────────────────────────
  function setBranch(branchKey) {
    if (!BRANCHES[branchKey]) return;
    state.currentBranch = branchKey;

    // Update nav
    els.branchBtns.forEach(btn => {
      const isActive = btn.dataset.branch === branchKey;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    // Update mother paradox
    const b = BRANCHES[branchKey];
    els.mpPursuit.textContent = b.motherParadox.pursuit;
    els.mpLimit.textContent = b.motherParadox.limit;
    els.mpGloss.textContent = b.motherParadox.gloss;

    // Re-render views
    renderTimeline();
    renderSpiral();
    // compare view doesn't depend on branch
  }

  // ────────────────────────────────────────────────────────────────
  // VIEW SWITCHING
  // ────────────────────────────────────────────────────────────────
  function setView(viewKey) {
    state.currentView = viewKey;

    els.viewBtns.forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.view === viewKey);
    });

    els.views.forEach(view => {
      const k = view.id.replace('view-', '');
      view.classList.toggle('is-active', k === viewKey);
    });

    if (viewKey === 'compare') {
      renderCompare();
    }

    // Scroll to top of stage
    document.querySelector('.stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ────────────────────────────────────────────────────────────────
  // RENDER · TIMELINE
  // ────────────────────────────────────────────────────────────────
  function renderTimeline() {
    const branch = BRANCHES[state.currentBranch];
    const html = branch.stages.map((stage, sIdx) => {
      const tensionsHtml = stage.tensions.map((tension, tIdx) => `
        <div class="tension-node" data-tension-id="${tension.id}" data-stage-id="${stage.id}" tabindex="0" role="button">
          <span class="tn-id">${formatTensionId(branch.key, sIdx, tIdx)}</span>
          <h3 class="tn-title">${escape(tension.title)}</h3>
          <div class="tn-axis">
            <div class="tn-pole tn-pole-left">
              <span class="tn-pole-who">${escape(tension.left.who)}</span>
              <span class="tn-pole-pole">${escape(tension.left.pole)}</span>
            </div>
            <div class="tn-tension-bar">${TENSION_BAR_SVG}</div>
            <div class="tn-pole tn-pole-right">
              <span class="tn-pole-who">${escape(tension.right.who)}</span>
              <span class="tn-pole-pole">${escape(tension.right.pole)}</span>
            </div>
          </div>
          <p class="tn-body-preview">${escape(tension.body)}</p>
          ${tension.recursAs && tension.recursAs.length ?
            `<span class="tn-recurs-hint">↻ ${tension.recursAs.length} 处复现</span>` : ''}
        </div>
      `).join('');

      return `
        <article class="stage-block" data-stage-id="${stage.id}">
          <div class="stage-marker"></div>
          <header class="stage-header">
            <h2 class="stage-name">${escape(stage.name)}</h2>
            <span class="stage-era">${escape(stage.era)}</span>
          </header>
          <div class="tension-list">${tensionsHtml}</div>
        </article>
      `;
    }).join('');

    els.timelineContent.innerHTML = html;
    attachTensionListeners(els.timelineContent);
  }

  function formatTensionId(branchKey, stageIdx, tensionIdx) {
    const prefix = { ontology: 'O', epistemology: 'E', methodology: 'M' }[branchKey];
    return `${prefix}·${stageIdx + 1}·${tensionIdx + 1}`;
  }

  // ────────────────────────────────────────────────────────────────
  // RENDER · SPIRAL (复现脉络)
  // ────────────────────────────────────────────────────────────────
  function renderSpiral() {
    const branch = BRANCHES[state.currentBranch];

    // 收集所有张力 + 它们的复现关系
    // 我们把每个张力的"recursAs"展示为螺旋链
    // 同时按"根本类型"分组（基于关键词聚类）

    const allTensions = [];
    branch.stages.forEach((stage, sIdx) => {
      stage.tensions.forEach((t, tIdx) => {
        allTensions.push({
          ...t,
          stageName: stage.name,
          stageEra: stage.era,
          stageIdx: sIdx,
          tensionIdx: tIdx
        });
      });
    });

    // 按"根本张力主题"分组——使用启发式聚类
    const themes = clusterTensionsByTheme(allTensions, state.currentBranch);

    const html = themes.map(theme => `
      <div class="spiral-group">
        <h3 class="spiral-group-title">
          ${escape(theme.title)}
          <span style="font-family: var(--font-mono); font-size: 0.7em; color: var(--paper-dim); letter-spacing: 0.15em; margin-left: auto;">
            ${theme.tensions.length} 处复现
          </span>
        </h3>
        <div class="spiral-chain">
          ${theme.tensions.map((t, i) => `
            ${i > 0 ? '<div class="spiral-arrow">↻</div>' : ''}
            <div class="spiral-item" data-tension-id="${t.id}" tabindex="0" role="button">
              <div class="spiral-item-era">${escape(t.stageName)} · ${escape(t.stageEra)}</div>
              <div class="spiral-item-title">${escape(t.title)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    els.spiralContent.innerHTML = html;

    // 复用 detail 打开逻辑
    $$('.spiral-item', els.spiralContent).forEach(item => {
      item.addEventListener('click', () => openDetail(item.dataset.tensionId));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(item.dataset.tensionId);
        }
      });
    });
  }

  /**
   * 根据张力的关键词/主题聚类
   * 这是基于文本的启发式分类——三个分支各有不同的根本主题
   */
  function clusterTensionsByTheme(tensions, branchKey) {
    const themeMap = {
      ontology: [
        {
          key: '一与多 · 变化与持续',
          match: t => /流变|不变|多元论|流出|实体|一元|二元|单子|实在论|关系/.test(t.title) ||
                     /Heraclitus|Parmenides|Spinoza|Leibniz/.test(t.left.who + t.right.who)
        },
        {
          key: '超验 ↔ 内在',
          match: t => /超验|内在|形式|神圣|现象|本体|分析|存在论遗忘/.test(t.title)
        },
        {
          key: '物质 ↔ 心智 ↔ 信息',
          match: t => /物理|意识|信息|AI|心智|生态/.test(t.title)
        },
        {
          key: '基础雄心 ↔ 多元开放',
          match: t => /基础|相对|实在论|多元|跨文化|新出现|语言/.test(t.title)
        }
      ],
      epistemology: [
        {
          key: '理性 ↔ 经验',
          match: t => /理性|经验|怀疑|方法论怀疑|逻辑形式|可证伪/.test(t.title)
        },
        {
          key: '权威 / 神话 ↔ 自主理性',
          match: t => /神话|信仰|相对主义|独断/.test(t.title)
        },
        {
          key: '基础 ↔ 整体 / 解构',
          match: t => /可证实|整体|可证伪|范式|解释学|谱系|自然化/.test(t.title)
        },
        {
          key: '客观 ↔ 视角 / 多元',
          match: t => /信息|AI|理性的理想|西方|复杂系统|数据|多元/.test(t.title)
        }
      ],
      methodology: [
        {
          key: '求真 ↔ 修辞 / 权力',
          match: t => /修辞|权力|批判/.test(t.title)
        },
        {
          key: '演绎 ↔ 归纳 ↔ 溯因',
          match: t => /几何|归纳|演绎|科学方法|Hume|形式严格|理论驱动/.test(t.title)
        },
        {
          key: '客观方法 ↔ 解释 / 位置',
          match: t => /实证主义|解释|形式分析|定性|中性方法|西方方法/.test(t.title)
        },
        {
          key: '统一方法 ↔ 多元方法',
          match: t => /可证实|频率|机器学习|跨学科|多元主义|复杂系统|可重复/.test(t.title)
        }
      ]
    };

    const themes = (themeMap[branchKey] || []).map(theme => ({
      title: theme.key,
      tensions: tensions.filter(theme.match)
    }));

    // 未被分类的归入"其他张力"
    const classifiedIds = new Set(themes.flatMap(t => t.tensions.map(x => x.id)));
    const uncategorized = tensions.filter(t => !classifiedIds.has(t.id));
    if (uncategorized.length) {
      themes.push({
        title: '其他张力线索',
        tensions: uncategorized
      });
    }

    return themes.filter(t => t.tensions.length > 0);
  }

  // ────────────────────────────────────────────────────────────────
  // RENDER · COMPARE
  // ────────────────────────────────────────────────────────────────
  function renderCompare() {
    const branches = ['ontology', 'epistemology', 'methodology'];
    const branchClasses = { ontology: 'ont', epistemology: 'epi', methodology: 'met' };

    const html = branches.map(bKey => {
      const b = BRANCHES[bKey];
      return `
        <div class="compare-col">
          <div class="compare-col-header ${branchClasses[bKey]}">
            <span class="compare-col-cn">${escape(b.title)}</span>
            <span class="compare-col-en">${escape(b.subtitle)}</span>
          </div>
          <div class="compare-mp">
            <div class="compare-mp-label">母悖论</div>
            <div class="compare-mp-pursuit">↑ ${escape(b.motherParadox.pursuit)}</div>
            <div class="compare-mp-arrow">↕</div>
            <div class="compare-mp-limit">↓ ${escape(b.motherParadox.limit)}</div>
          </div>
          ${b.stages.map(stage => `
            <div class="compare-stage" data-branch="${bKey}" data-stage-id="${stage.id}" tabindex="0" role="button">
              <div class="compare-stage-era">${escape(stage.era)}</div>
              <div class="compare-stage-name">${escape(stage.name)}</div>
              <div class="compare-stage-count">${stage.tensions.length} 张力 ◇ ${stage.tensions.map((_, i) => i + 1).join(' · ')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    els.compareContent.innerHTML = html;

    // 点击 stage 切换到该分支的时间轴视图
    $$('.compare-stage', els.compareContent).forEach(stage => {
      stage.addEventListener('click', () => {
        const targetBranch = stage.dataset.branch;
        setBranch(targetBranch);
        setView('timeline');
        // scroll to that stage
        setTimeout(() => {
          const block = $(`.stage-block[data-stage-id="${stage.dataset.stageId}"]`);
          if (block) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
      });
    });
  }

  // ────────────────────────────────────────────────────────────────
  // RENDER · META INSIGHTS
  // ────────────────────────────────────────────────────────────────
  function renderMetaInsights() {
    const html = META_INSIGHTS.map(mi => `
      <article class="mi-card">
        <span class="mi-card-num" aria-hidden="true">${escape(mi.n)}</span>
        <h3 class="mi-card-title">${escape(mi.title)}</h3>
        <p class="mi-card-body">${escape(mi.body)}</p>
      </article>
    `).join('');
    els.metaGrid.innerHTML = html;
  }

  // ────────────────────────────────────────────────────────────────
  // DETAIL PANEL
  // ────────────────────────────────────────────────────────────────
  function findTensionById(id) {
    for (const bKey of Object.keys(BRANCHES)) {
      const b = BRANCHES[bKey];
      for (const stage of b.stages) {
        for (const t of stage.tensions) {
          if (t.id === id) {
            return { tension: t, stage, branch: b };
          }
        }
      }
    }
    return null;
  }

  function openDetail(tensionId) {
    const found = findTensionById(tensionId);
    if (!found) return;

    const { tension, stage, branch } = found;

    const recursHtml = tension.recursAs && tension.recursAs.length ? `
      <div class="dt-recurs-block">
        <div class="dt-recurs-label">↻ 螺旋复现 · Spiral Recurrence</div>
        <ul class="dt-recurs-list">
          ${tension.recursAs.map(r => `<li>${escape(r)}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const html = `
      <span class="dt-stage-tag">${escape(branch.title)} · ${escape(stage.name)} · ${escape(stage.era)}</span>
      <h2 class="dt-title">${escape(tension.title)}</h2>
      <div class="dt-axis">
        <div class="dt-pole dt-pole-left">
          <span class="dt-pole-marker">左 极 · LEFT POLE</span>
          <span class="dt-pole-who">${escape(tension.left.who)}</span>
          <span class="dt-pole-pole">${escape(tension.left.pole)}</span>
        </div>
        <div class="dt-tension-glyph">
          <svg viewBox="0 0 40 80" width="40" height="80">
            <line x1="20" y1="5" x2="20" y2="75" stroke="var(--accent-gold-dim)" stroke-width="1" stroke-dasharray="2 3"/>
            <circle cx="20" cy="10" r="3" fill="var(--pole-left)"/>
            <circle cx="20" cy="40" r="4" fill="var(--accent-gold)"/>
            <circle cx="20" cy="70" r="3" fill="var(--pole-right)"/>
            <text x="20" y="55" text-anchor="middle" font-family="JetBrains Mono" font-size="6" fill="var(--accent-gold)" letter-spacing="1">⇅</text>
          </svg>
        </div>
        <div class="dt-pole dt-pole-right">
          <span class="dt-pole-marker">右 极 · RIGHT POLE</span>
          <span class="dt-pole-who">${escape(tension.right.who)}</span>
          <span class="dt-pole-pole">${escape(tension.right.pole)}</span>
        </div>
      </div>
      <div class="dt-body">${escape(tension.body)}</div>
      ${recursHtml}
    `;

    els.detailContent.innerHTML = html;
    els.detailPanel.classList.add('is-open');
    els.detailBackdrop.classList.add('is-open');
    els.detailPanel.setAttribute('aria-hidden', 'false');
    state.detailOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeDetail() {
    els.detailPanel.classList.remove('is-open');
    els.detailBackdrop.classList.remove('is-open');
    els.detailPanel.setAttribute('aria-hidden', 'true');
    state.detailOpen = false;
    document.body.style.overflow = '';
  }

  // ────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ────────────────────────────────────────────────────────────────
  function attachTensionListeners(root) {
    $$('.tension-node', root).forEach(node => {
      node.addEventListener('click', () => openDetail(node.dataset.tensionId));
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(node.dataset.tensionId);
        }
      });
    });
  }

  function bindEvents() {
    // Branch nav
    els.branchBtns.forEach(btn => {
      btn.addEventListener('click', () => setBranch(btn.dataset.branch));
    });

    // View nav
    els.viewBtns.forEach(btn => {
      btn.addEventListener('click', () => setView(btn.dataset.view));
    });

    // Detail close
    els.detailClose.addEventListener('click', closeDetail);
    els.detailBackdrop.addEventListener('click', closeDetail);

    // ESC to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && state.detailOpen) closeDetail();
    });
  }

  // ────────────────────────────────────────────────────────────────
  // UTILITIES
  // ────────────────────────────────────────────────────────────────
  function escape(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ────────────────────────────────────────────────────────────────
  // INIT
  // ────────────────────────────────────────────────────────────────
  function init() {
    bindEvents();
    renderMetaInsights();
    setBranch(state.currentBranch); // 这会触发 timeline + spiral 渲染
    renderCompare();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
