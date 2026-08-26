const roots = document.querySelectorAll('.ads-article');

roots.forEach((root) => {
  const tabs = Array.from(root.querySelectorAll('[data-lens]'));
  const panels = Array.from(root.querySelectorAll('[data-lens-panel]'));
  if (!tabs.length || !panels.length) return;

  const activate = (name, focus = false) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.lens === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.lensPanel !== name;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.lens));
    tab.addEventListener('keydown', (event) => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next].dataset.lens, true);
    });
  });
});
