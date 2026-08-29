(() => {
  const root = document.querySelector('.hce-article');
  if (!root) return;

  const links = [...root.querySelectorAll('.hce-toc a[href^="#"]')];
  const sections = links
    .map((link) => root.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-16% 0px -68% 0px', threshold: [0, 0.12, 0.35] },
    );
    sections.forEach((section) => observer.observe(section));
  }

  if (sections[0]) setActive(sections[0].id);

  const jump = root.querySelector('#hce-jump');
  jump?.addEventListener('change', () => {
    const target = root.querySelector(jump.value);
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  });
})();
