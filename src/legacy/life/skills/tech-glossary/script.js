const q = document.getElementById('q');
  const cards = [...document.querySelectorAll('.card')];
  const secs = [...document.querySelectorAll('[data-sec]')];
  const empty = document.getElementById('empty');

  q.addEventListener('input', () => {
    const kw = q.value.trim().toLowerCase();
    let any = false;
    cards.forEach(c => {
      const hit = !kw || c.dataset.search.toLowerCase().includes(kw);
      c.style.display = hit ? '' : 'none';
      if (hit) any = true;
    });
    secs.forEach(s => {
      const vis = [...s.querySelectorAll('.card')].some(c => c.style.display !== 'none');
      s.style.display = vis ? '' : 'none';
    });
    empty.classList.toggle('show', !any);
  });

  // 关联词跳转 + 高亮
  document.querySelectorAll('.reltag[data-target]').forEach(t => {
    t.addEventListener('click', () => {
      const el = document.getElementById(t.dataset.target);
      if (!el) return;
      if (q.value) { q.value=''; q.dispatchEvent(new Event('input')); }
      el.scrollIntoView({behavior:'smooth', block:'center'});
      el.classList.add('flash');
      setTimeout(() => el.classList.remove('flash'), 1400);
    });
  });

