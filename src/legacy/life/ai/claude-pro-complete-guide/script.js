(() => {
  const root = document.querySelector('.cpg-article');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-cpg-tab]')];
  const panels = [...root.querySelectorAll('[data-cpg-panel]')];
  const validViews = new Set(tabs.map((tab) => tab.dataset.cpgTab));

  const activate = (view, focus = false) => {
    if (!validViews.has(view)) return;

    tabs.forEach((tab) => {
      const active = tab.dataset.cpgTab === view;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });

    panels.forEach((panel) => {
      const active = panel.dataset.cpgPanel === view;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });

    const nextHash = view === 'checklist' ? '#visual-checklist' : '#full-article';
    if (window.location.hash !== nextHash) history.replaceState(null, '', nextHash);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.cpgTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      activate(tabs[next].dataset.cpgTab, true);
    });
  });

  const initial = window.location.hash === '#visual-checklist' ? 'checklist' : 'article';
  activate(initial);
})();
