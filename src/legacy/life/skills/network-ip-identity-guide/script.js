const guide = document.querySelector('.nip-article');

if (guide) {
  const progress = guide.querySelector('#nipProgress');
  const backTop = guide.querySelector('#nipBackTop');
  const tocLinks = [...guide.querySelectorAll('#nipToc a')];
  const sections = [...guide.querySelectorAll('[data-section]')];

  const updateGuide = () => {
    const start = guide.getBoundingClientRect().top + window.scrollY;
    const max = Math.max(1, guide.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / max));
    if (progress) progress.style.width = `${ratio * 100}%`;
    backTop?.classList.toggle('show', window.scrollY > start + 650);

    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 120) current = section.id;
    }
    for (const link of tocLinks) {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  backTop?.addEventListener('click', () => {
    guide.querySelector('#guide-top')?.scrollIntoView({ behavior: 'smooth' });
  });
  window.addEventListener('scroll', updateGuide, { passive: true });
  window.addEventListener('resize', updateGuide, { passive: true });
  updateGuide();
}
