(function () {
  var root = document.querySelector('.refund-article .refund-guide');
  if (!root) return;

  var toast = root.querySelector('#refundToast');
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();

      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (error) {
        reject(error);
      }

      document.body.removeChild(area);
    });
  }

  var printButton = root.querySelector('#refundPrint');
  if (printButton) {
    printButton.addEventListener('click', function () {
      window.print();
    });
  }

  root.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = button.getAttribute('data-copy');
      var target = targetId ? root.querySelector('#' + targetId) : null;
      if (!target) return;

      copyText(target.textContent.trim()).then(function () {
        showToast('话术已复制');
      }).catch(function () {
        showToast('复制失败，请手动选择文字');
      });
    });
  });

  var statusMessages = {
    none: '下一步：立即在 Report a Problem 提交正式退款申请；普通客服聊天不等于 Refund Claim。',
    pending: '下一步：等待 24–48 小时，并在 Report a Problem 继续监控；电话或聊天通常不会加快审核。',
    approved: '下一步：查看 Apple Account Balance；Store credit 最多约 48 小时显示。',
    denied: '下一步：带齐证据，要求 App Store / Media Services Billing 进行人工退款复核。',
    unavailable: '下一步：保存订单和页面截图，携 Order ID 联系 Apple Billing 人工处理。'
  };
  var statusResult = root.querySelector('.status-result');
  var rows = root.querySelectorAll('[data-row]');
  var statusButtons = root.querySelectorAll('[data-status]');

  statusButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-status');
      statusButtons.forEach(function (item) {
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });
      rows.forEach(function (row) {
        row.classList.toggle('is-highlighted', row.getAttribute('data-row') === value);
      });
      if (statusResult && statusMessages[value]) {
        statusResult.textContent = statusMessages[value];
      }
    });
  });

  var checks = Array.prototype.slice.call(root.querySelectorAll('[data-check]'));
  var count = root.querySelector('#progress-count');
  var bar = root.querySelector('#progress-bar');
  var storageKey = 'claude-apple-refund-checklist-v1';

  function readChecklist() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (error) {
      return {};
    }
  }

  function writeChecklist(state) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      // Local storage may be unavailable in privacy mode.
    }
  }

  function updateProgress() {
    if (!count || !bar || !checks.length) return;
    var done = checks.filter(function (item) { return item.checked; }).length;
    count.textContent = String(done);
    bar.style.width = ((done / checks.length) * 100) + '%';
  }

  var saved = readChecklist();
  checks.forEach(function (item) {
    var key = item.getAttribute('data-check');
    item.checked = Boolean(saved[key]);
    item.addEventListener('change', function () {
      var state = {};
      checks.forEach(function (check) {
        state[check.getAttribute('data-check')] = check.checked;
      });
      writeChecklist(state);
      updateProgress();
    });
  });
  updateProgress();

  if ('IntersectionObserver' in window) {
    var navLinks = Array.prototype.slice.call(root.querySelectorAll('#refundNav a'));
    var sections = navLinks.map(function (link) {
      var href = link.getAttribute('href');
      return href ? root.querySelector(href) : null;
    }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
}());
