const roots = document.querySelectorAll('.ats-article');

roots.forEach((root) => {
  const tabs = Array.from(root.querySelectorAll('[data-control-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-control-panel]'));
  if (!tabs.length || !panels.length) return;

  const activate = (name, focus = false) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.controlTab === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.controlPanel !== name;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.controlTab));
    tab.addEventListener('keydown', (event) => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next].dataset.controlTab, true);
    });
  });
});
