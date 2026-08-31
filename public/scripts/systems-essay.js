(() => {
  const root = document.querySelector('.systems-essay');
  if (!root) return;
  const bar = root.querySelector('.progress');
  const links = [...root.querySelectorAll('.toc a,.mobile-toc a')];
  const sections = [...root.querySelectorAll('.chapter[id]')];
  const track = () => {
    if (!bar) return;
    const page = document.documentElement;
    const distance = Math.max(1, page.scrollHeight - page.clientHeight);
    bar.style.width = Math.min(100, Math.max(0, page.scrollTop / distance * 100)) + '%';
  };
  window.addEventListener('scroll', track, { passive: true });
  track();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }), { rootMargin: '-20% 0px -68% 0px' });
    sections.forEach((section) => observer.observe(section));
  }
  root.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  root.querySelector('[data-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
