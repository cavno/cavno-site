// 悖论图谱 — Interaction Logic
// Data loaded from data.js: SYSTEMS (array), CATEGORIES (ordered list)

let currentSystemIndex = -1; // -1 = welcome state
let openCategories = new Set();

// DOM
const navEl = document.getElementById('nav');
const contentEl = document.getElementById('content');
const nowshowingEl = document.getElementById('nowshowing');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close');
const mNum = document.getElementById('m-num');
const mTitle = document.getElementById('m-title');
const mPoleA = document.getElementById('m-pole-a');
const mPoleB = document.getElementById('m-pole-b');
const mBody = document.getElementById('m-body');

// ============ INIT COUNTS ============
document.getElementById('count-systems').textContent = SYSTEMS.length;
document.getElementById('count-tensions').textContent = SYSTEMS.reduce((a, s) => a + s.tensions.length, 0);

// ============ CATEGORY NAV ============
function buildSystemsByCategory() {
  const grouped = {};
  CATEGORIES.forEach(cat => grouped[cat] = []);
  SYSTEMS.forEach((s, i) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push({ system: s, index: i });
  });
  return grouped;
}

function renderNav() {
  const grouped = buildSystemsByCategory();
  const html = CATEGORIES.map(cat => {
    const systems = grouped[cat] || [];
    const isOpen = openCategories.has(cat);

    // Check if this category has multiple distinct eras worth grouping by.
    // Show era subgroups only if there are 2+ distinct eras AND total items >= 6
    // (otherwise era labels add visual noise without useful structure).
    const eras = [...new Set(systems.map(({ system }) => system.era).filter(Boolean))];
    const useEraGroups = eras.length >= 2 && systems.length >= 6;

    let itemsHtml;
    if (useEraGroups) {
      // Group consecutively by era (preserving original order)
      let lastEra = null;
      itemsHtml = systems.map(({ system, index }) => {
        const eraHeader = (system.era && system.era !== lastEra)
          ? `<div class="era-label">${escapeHtml(system.era)}</div>`
          : '';
        lastEra = system.era;
        return eraHeader + `
          <div class="system-item ${index === currentSystemIndex ? 'active' : ''}" data-idx="${index}">
            ${escapeHtml(system.name)}
          </div>
        `;
      }).join('');
    } else {
      itemsHtml = systems.map(({ system, index }) => `
        <div class="system-item ${index === currentSystemIndex ? 'active' : ''}" data-idx="${index}">
          ${escapeHtml(system.name)}
        </div>
      `).join('');
    }

    return `
      <div class="cat-group ${isOpen ? 'open' : ''}" data-cat="${escapeHtml(cat)}">
        <div class="cat-header">
          <span class="cat-marker"></span>
          <span class="cat-name">${escapeHtml(cat)}</span>
          <span class="cat-count">${systems.length}</span>
          <span class="cat-toggle">›</span>
        </div>
        <div class="cat-items">${itemsHtml}</div>
      </div>
    `;
  }).join('');
  navEl.innerHTML = html;

  // Wire up category headers
  navEl.querySelectorAll('.cat-header').forEach(header => {
    header.addEventListener('click', () => {
      const cat = header.parentElement.dataset.cat;
      if (openCategories.has(cat)) openCategories.delete(cat);
      else openCategories.add(cat);
      renderNav();
    });
  });
  // Wire up system items
  navEl.querySelectorAll('.system-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(item.dataset.idx, 10);
      selectSystem(idx);
    });
  });
}

// ============ NOW SHOWING (header center) ============
function renderNowShowing(index) {
  if (index < 0) {
    nowshowingEl.innerHTML = '';
    return;
  }
  const s = SYSTEMS[index];
  const mp = s.mother_paradox;
  if (!mp) {
    nowshowingEl.innerHTML = `
      <div class="ns-cat">${escapeHtml(s.category)}</div>
      <div class="ns-poles">${escapeHtml(s.name)}</div>
    `;
    return;
  }
  nowshowingEl.innerHTML = `
    <div class="ns-cat">${escapeHtml(s.category)} · 母悖论</div>
    <div class="ns-poles">
      <span class="pa">${escapeHtml(mp.pole_a)}</span>
      <span class="vs">↔</span>
      <span class="pb">${escapeHtml(mp.pole_b)}</span>
    </div>
  `;
}

// ============ CONTENT RENDERING ============
function renderWelcome() {
  contentEl.innerHTML = `
    <div class="welcome">
      <div class="welcome-mark">Welcome · 入</div>
      <h1 class="welcome-title">将思想从线性时间轴解放出来</h1>
      <div class="welcome-subtitle">
        不再问"发生了什么"，而是问"哪些对立张力在此刻达到了临界爆发"。
      </div>
      <div class="welcome-method">
        <h3>Method · 方法</h3>
        <p>每一个系统——无论是基督教与佛教、《周易》与《道德经》、夏朝与改革开放、明朝与比特币、《黑暗骑士》与人性本身、哲学与脑科学——都被视作一组永久的对立张力的展开过程。这些张力不会被"解决"，只会在不同的历史与认知压力下被重新管理、重新平衡、重新引爆。</p>
        <p>每个系统都有一个 <strong style="color:var(--cinnabar);">母悖论 (mother paradox)</strong>，它是该系统所有具体张力的总根源。具体张力则是母悖论在不同维度上的变奏与展开。</p>
        <p>从左侧选择任一系统，你将看到它的前置框架、母悖论、所有具体张力、以及连接所有张力的元结论。点击任一张力卡片可以阅读详细分析。</p>
        <p style="text-indent:0;margin-top:20px;font-style:italic;color:var(--paper-darker);">「中国王朝史」按时代顺序铺开三千年的悖论谱系；「学科反思」则是各学科对自身的悖论性自我反思——这是认识论意义上最深刻的张力分析层次。</p>
      </div>
    </div>
  `;
}

function renderSystem(index) {
  const s = SYSTEMS[index];
  const num = String(index + 1).padStart(2, '0');

  // Tensions grid
  const tensionsHtml = s.tensions.map((t, ti) => {
    const tNum = String(t.num || (ti + 1)).padStart(2, '0');
    // Build summary: prefer the first heading (it's usually a tight distillation),
    // fall back to first meaningful prose paragraph.
    let summary = '';
    let isHeading = false;
    for (const block of t.body) {
      if (block.type === 'heading' && block.text.length >= 5) {
        summary = block.text;
        isHeading = true;
        break;
      }
    }
    if (!summary) {
      for (const block of t.body) {
        if (block.type === 'prose' && block.text.length > 25) {
          summary = block.text;
          break;
        }
      }
    }
    // Truncate prose to ~80 chars
    if (!isHeading && summary.length > 90) summary = summary.substring(0, 88) + '…';

    // Some tensions have no explicit ↔ (single conceptual heading). Render differently.
    const hasBothPoles = t.pole_a && t.pole_b;
    const polesHtml = hasBothPoles ? `
      <div class="tc-poles">
        <div class="tc-pole a">${escapeHtml(t.pole_a)}</div>
        <div class="tc-vs">↔</div>
        <div class="tc-pole b">${escapeHtml(t.pole_b)}</div>
      </div>
    ` : `
      <div class="tc-poles tc-poles-single">
        <div class="tc-pole-single">${escapeHtml(t.pole_a || t.full_label)}</div>
      </div>
    `;

    return `
      <div class="tension-card" data-tindex="${ti}">
        <div class="tc-num">
          <span class="tc-num-label">张力</span>
          <span>${tNum}</span>
        </div>
        ${polesHtml}
        ${summary ? `<div class="tc-summary${isHeading ? ' tc-summary-heading' : ''}">${escapeHtml(summary)}</div>` : ''}
        <div class="tc-expand">展开 →</div>
      </div>
    `;
  }).join('');

  // Preface (only if non-empty)
  const prefaceHtml = s.preface && s.preface.length > 30 ? `
    <div class="preface">
      <div class="preface-label">前置 · Preface</div>
      ${renderProseBlocks(splitToBlocks(s.preface))}
    </div>
  ` : '';

  // Mother paradox section
  let mpHtml = '';
  if (s.mother_paradox) {
    const descBlocks = Array.isArray(s.mother_paradox.description)
      ? s.mother_paradox.description
      : splitToBlocks(s.mother_paradox.description || '');
    mpHtml = `
      <section class="mother-paradox">
        <div class="mp-label">
          <div class="mp-label-en">Mother Paradox · 母悖论</div>
          <div class="mp-label-cn">所有张力的总根源</div>
        </div>
        <div class="mp-stage">
          <div class="mp-pole mp-pole-a">
            <div class="mp-pole-marker">A</div>
            <div class="mp-pole-text">${escapeHtml(s.mother_paradox.pole_a)}</div>
          </div>
          <div class="mp-tension">↔</div>
          <div class="mp-pole mp-pole-b">
            <div class="mp-pole-marker">B</div>
            <div class="mp-pole-text">${escapeHtml(s.mother_paradox.pole_b)}</div>
          </div>
        </div>
        <div class="mp-description">${renderProseBlocks(descBlocks)}</div>
      </section>
    `;
  }

  // Meta conclusion
  let metaHtml = '';
  if (s.meta_conclusion && s.meta_conclusion.length > 0) {
    const metaBlocks = Array.isArray(s.meta_conclusion) ? s.meta_conclusion : splitToBlocks(s.meta_conclusion);
    if (metaBlocks.length > 0) {
      metaHtml = `
        <section class="meta-conclusion">
          <div class="mc-title">Meta-Conclusion · 元结论</div>
          <div class="mc-text">${renderProseBlocks(metaBlocks)}</div>
        </section>
      `;
    }
  }

  contentEl.innerHTML = `
    <section class="system-hero">
      <div class="system-meta">
        <span class="system-cat-tag">${escapeHtml(s.category)}</span>
        <span class="system-id">No. ${num}</span>
      </div>
      <h1 class="system-name">${escapeHtml(s.name)}</h1>
      ${s.mother_paradox ? `<div class="system-tagline">${escapeHtml(s.mother_paradox.pole_a)} ↔ ${escapeHtml(s.mother_paradox.pole_b)}</div>` : ''}
    </section>

    ${prefaceHtml}

    ${mpHtml}

    <section class="tensions-section">
      <div class="section-heading">
        <div class="section-heading-cn">具体张力</div>
        <div class="section-heading-en">Specific Tensions — Variations of the Mother Paradox</div>
        <div class="section-heading-count">${s.tensions.length} 张力</div>
      </div>
      <div class="tensions-grid">
        ${tensionsHtml}
      </div>
    </section>

    ${metaHtml}
  `;

  // Wire up tension cards
  contentEl.querySelectorAll('.tension-card').forEach(card => {
    card.addEventListener('click', () => {
      const ti = parseInt(card.dataset.tindex, 10);
      openModal(index, ti);
    });
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render an array of {type, text} blocks as HTML
function renderProseBlocks(blocks) {
  if (!blocks || !blocks.length) return '';
  return blocks.map(b => {
    if (b.type === 'heading') {
      return `<h4>${escapeHtml(b.text)}</h4>`;
    }
    return `<p>${escapeHtml(b.text)}</p>`;
  }).join('');
}

// Split a string into rough blocks (fallback for content not pre-classified)
function splitToBlocks(str) {
  if (!str) return [];
  const parts = str.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
  return parts.map(p => {
    const isHeading = p.length <= 22 && !/[。？！；.!?;]$/.test(p) && !/[，,]/.test(p);
    return { type: isHeading ? 'heading' : 'prose', text: p };
  });
}

// ============ SELECT SYSTEM ============
function selectSystem(index) {
  if (index < 0 || index >= SYSTEMS.length) return;
  currentSystemIndex = index;

  // Open the category that contains this system
  const cat = SYSTEMS[index].category;
  openCategories.add(cat);

  renderNav();
  renderSystem(index);
  renderNowShowing(index);

  // Update URL hash for shareability
  const id = SYSTEMS[index].id;
  if (history.replaceState) {
    history.replaceState(null, '', '#' + id);
  }
}

// ============ MODAL ============
function openModal(systemIdx, tensionIdx) {
  const s = SYSTEMS[systemIdx];
  const t = s.tensions[tensionIdx];
  const tNum = String(t.num || (tensionIdx + 1)).padStart(2, '0');

  mNum.textContent = `张力 ${tNum} · ${s.name}`;
  const hasBothPoles = t.pole_a && t.pole_b;
  if (hasBothPoles) {
    mTitle.textContent = `${t.pole_a}  ↔  ${t.pole_b}`;
    mPoleA.textContent = t.pole_a;
    mPoleA.style.display = '';
    mPoleB.textContent = t.pole_b;
    mPoleB.style.display = '';
    document.querySelector('.modal-vs').style.display = '';
  } else {
    mTitle.textContent = t.pole_a || t.full_label;
    mPoleA.style.display = 'none';
    mPoleB.style.display = 'none';
    document.querySelector('.modal-vs').style.display = 'none';
  }

  mBody.innerHTML = renderProseBlocks(t.body);

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal').scrollTop = 0;
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
    closeModal();
  }
});

// ============ UTILITIES ============
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============ INIT ============
function init() {
  loadFromHash() || showWelcome();
  // React to hash changes (back/forward, manual URL edits, shared links)
  window.addEventListener('hashchange', () => {
    if (!loadFromHash()) showWelcome();
  });
}

function loadFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return false;
  const idx = SYSTEMS.findIndex(s => s.id === hash);
  if (idx < 0) return false;
  selectSystem(idx);
  return true;
}

function showWelcome() {
  currentSystemIndex = -1;
  openCategories.add(CATEGORIES[0]);
  renderNav();
  renderWelcome();
  nowshowingEl.innerHTML = '';
}

init();
