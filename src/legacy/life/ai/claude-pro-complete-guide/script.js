(() => {
  const root = document.querySelector('.cpg-article');
  if (!root) return;

  const frames = [...root.querySelectorAll('iframe[data-cpg-expand]')];
  const observers = new Map();
  let resizeTimer;

  const fit = (frame) => {
    const doc = frame.contentDocument;
    if (!doc?.documentElement || !doc.body) return;

    const height = Math.ceil(Math.max(
      doc.documentElement.scrollHeight,
      doc.documentElement.offsetHeight,
      doc.body.scrollHeight,
      doc.body.offsetHeight,
    ));

    if (height > 0) frame.style.height = `${height}px`;
  };

  const observe = (frame) => {
    observers.get(frame)?.disconnect();

    const doc = frame.contentDocument;
    if (!doc?.documentElement || !doc.body) return;

    const scheduleFit = () => requestAnimationFrame(() => fit(frame));
    const observer = new ResizeObserver(scheduleFit);
    observer.observe(doc.documentElement);
    observer.observe(doc.body);
    observers.set(frame, observer);

    scheduleFit();
    doc.fonts?.ready.then(scheduleFit);
  };

  frames.forEach((frame) => {
    frame.addEventListener('load', () => observe(frame));
    if (frame.contentDocument?.readyState === 'complete') observe(frame);
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      frames.forEach(fit);
    }, 120);
  });

  window.addEventListener('beforeunload', () => {
    observers.forEach((observer) => observer.disconnect());
    clearTimeout(resizeTimer);
  }, { once: true });
})();
