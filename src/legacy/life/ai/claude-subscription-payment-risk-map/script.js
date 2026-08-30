(function () {
      var root = document.querySelector('.cspr-article');
      if (!root) return;
      var tocToggle = document.getElementById('tocToggle');
      var toc = document.getElementById('toc');
      var links = Array.prototype.slice.call(toc.querySelectorAll('a'));
      var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
      var progressBar = document.getElementById('progressBar');
      var backTop = document.getElementById('backTop');

      tocToggle.addEventListener('click', function () {
        var open = root.classList.toggle('toc-open');
        tocToggle.setAttribute('aria-expanded', String(open));
      });

      links.forEach(function (link) {
        link.addEventListener('click', function () {
          root.classList.remove('toc-open');
          tocToggle.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          root.classList.remove('toc-open');
          tocToggle.setAttribute('aria-expanded', 'false');
        }
      });

      function updateScroll() {
        var top = window.scrollY || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - window.innerHeight;
        var progress = height > 0 ? Math.min(100, Math.max(0, top / height * 100)) : 0;
        progressBar.style.width = progress + '%';
        backTop.classList.toggle('show', top > 700);

        var current = sections[0];
        sections.forEach(function (section) {
          if (section.getBoundingClientRect().top <= 130) current = section;
        });
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
        });
      }

      backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
      window.addEventListener('scroll', updateScroll, { passive: true });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 900) {
          root.classList.remove('toc-open');
          tocToggle.setAttribute('aria-expanded', 'false');
        }
        updateScroll();
      });
      updateScroll();
    }());
