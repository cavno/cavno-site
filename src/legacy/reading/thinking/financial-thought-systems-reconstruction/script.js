const roots = document.querySelectorAll('.fsi-article');

roots.forEach((root) => {
  const links = Array.from(root.querySelectorAll('[data-fsi-nav]'));
  const sections = links
    .map((link) => root.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && links.length && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const current = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-18% 0px -72% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  const jump = root.querySelector('[data-fsi-jump]');
  jump?.addEventListener('change', () => {
    if (!jump.value) return;
    root.querySelector(jump.value)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    jump.value = '';
  });
});
