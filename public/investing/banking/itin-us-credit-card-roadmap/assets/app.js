(function () {
  'use strict';

  var root = document.getElementById('itin-cc-roadmap-app');
  if (!root) return;

  function fmtUSD(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  // 1. Pre-Application Readiness Checklist
  var readyChecks = root.querySelectorAll('.icr-ready-chk');
  var readyBadge = document.getElementById('icrReadyBadge');
  var readyNote = document.getElementById('icrReadyNote');

  function updateReadiness() {
    var done = 0;
    readyChecks.forEach(function (chk) { if (chk.checked) done += 1; });
    var total = readyChecks.length;
    if (readyBadge) {
      readyBadge.textContent = done === total ? '4 / 4 全部就绪 · 可发起预审' : ('已完成 ' + done + ' / ' + total + ' 项');
      readyBadge.classList.toggle('icr-ready-done', done === total);
    }
    if (readyNote) {
      if (done === total) {
        readyNote.textContent = '四项核心要素已全部对齐：请先在同州静态住宅 IP 环境下打开 Capital One Pre-Approval 做软查询探路，确认可批卡种后再提交正式申请。';
      } else {
        readyNote.textContent = '尚有 ' + (total - done) + ' 项未就绪：切勿在地址拼写不一致、缺少同名 Checking 或代理时区错位时强行提交网申，以免白白消耗一次 Hard Pull 或触发欺诈拒批。';
      }
    }
  }
  readyChecks.forEach(function (chk) { chk.addEventListener('change', updateReadiness); });
  updateReadiness();

  // 2. Chase 5/24 Slot Planner & 4-Stage Roadmap Filter
  var pathBtns = root.querySelectorAll('.icr-path-btn[data-path]');
  var stageBtns = root.querySelectorAll('.icr-stage-btn[data-stage]');
  var slotChips = root.querySelectorAll('.icr-slot-chip[data-stage-ref]');
  var tableRows = root.querySelectorAll('#icrRoadmapTbody tr[data-stage]');

  pathBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-path');
      pathBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      var s1Title = document.getElementById('icrSlot1Title');
      var s1Sub = document.getElementById('icrSlot1Sub');
      var s2Title = document.getElementById('icrSlot2Title');
      var s2Sub = document.getElementById('icrSlot2Sub');
      if (mode === 'gt') {
        s1Title.textContent = 'Amex Global Transfer 美版无押金卡';
        s1Sub.textContent = '凭满 6 个月海外 Amex 调取内部信报免押金下卡';
        s2Title.textContent = 'Capital One / 第二张 Amex 无年费卡';
        s2Sub.textContent = '补齐三局厚度并利用 Amex Soft Pull 扩张额度';
      } else {
        s1Title.textContent = 'Capital One Platinum / Secured';
        s1Sub.textContent = '纯网申零信用破冰 · 三局上报';
        s2Title.textContent = 'Amex BCE / Hilton 无年费';
        s2Sub.textContent = '拉高授信分母 · 后续加申多为 Soft Pull';
      }
    });
  });

  function applyStageFilter(stage) {
    stageBtns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-stage') === stage);
    });
    slotChips.forEach(function (chip) {
      chip.classList.toggle('active', stage !== 'all' && chip.getAttribute('data-stage-ref') === stage);
    });
    tableRows.forEach(function (row) {
      if (stage === 'all') {
        row.classList.remove('icr-row-dim', 'icr-row-focus');
      } else {
        var match = row.getAttribute('data-stage') === stage;
        row.classList.toggle('icr-row-focus', match);
        row.classList.toggle('icr-row-dim', !match);
      }
    });
  }

  stageBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyStageFilter(btn.getAttribute('data-stage'));
    });
  });
  slotChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var target = chip.getAttribute('data-stage-ref');
      applyStageFilter(chip.classList.contains('active') ? 'all' : target);
    });
  });

  // 3. First-Card Safe Utilization & Credit Cycling Detector
  var limitEl = document.getElementById('icrLimit');
  var spendEl = document.getElementById('icrSpend');
  var stmtEl = document.getElementById('icrStmt');
  var resetBtn = document.getElementById('icrCycleReset');

  function updateCyclingSim() {
    if (!limitEl || !spendEl || !stmtEl) return;
    var limit = Math.max(100, Number(limitEl.value) || 200);
    var spend = Math.max(0, Number(spendEl.value) || 0);
    var stmt = Math.min(limit, Math.max(0, Number(stmtEl.value) || 0));
    if (Number(stmtEl.value) > limit) {
      stmtEl.value = String(limit);
    }

    document.getElementById('icrLimitOut').textContent = fmtUSD(limit);
    document.getElementById('icrSpendOut').textContent = fmtUSD(spend);
    document.getElementById('icrStmtOut').textContent = fmtUSD(stmt);

    var minSafe = Math.max(2, Math.ceil(limit * 0.01));
    var maxSafe = Math.max(minSafe, Math.floor(limit * 0.10));
    document.getElementById('icrSafeBand').textContent = fmtUSD(minSafe) + ' – ' + fmtUSD(maxSafe);

    var turnover = spend / limit;
    var util = (stmt / limit) * 100;
    document.getElementById('icrUtilLabel').textContent = '上报使用率：' + util.toFixed(1) + '%';

    var vBox = document.getElementById('icrVerdictBox');
    var vTitle = document.getElementById('icrVerdictTitle');
    var vDesc = document.getElementById('icrVerdictDesc');
    var tOut = document.getElementById('icrTurnoverOut');

    if (turnover > 1.0) {
      tOut.textContent = turnover.toFixed(2) + 'x · 骑车高危!';
      vBox.className = 'icr-verdict icr-verdict-danger';
      vTitle.textContent = '红线警报：触发 Credit Cycling（额度循环刷卡）高危特征！';
      vDesc.textContent = '单月累计消费 ' + fmtUSD(spend) + ' 已超过授信额度 ' + fmtUSD(limit) + '（相当于单月周转 ' + turnover.toFixed(2) + ' 倍额度）。即使你中途提前还款压低了期末账单，发卡行风控系统仍会直接识别出循环套现/洗钱特征，极易引发风控锁卡甚至直接关户。';
    } else if (util > 10 && util <= 30) {
      tOut.textContent = turnover.toFixed(2) + 'x · 未超限';
      vBox.className = 'icr-verdict icr-verdict-warn';
      vTitle.textContent = '提示：出账单使用率偏高（建议压回 1%–10%）';
      vDesc.textContent = '单月未发生循环刷爆，但出账欠款占额度 ' + util.toFixed(1) + '%，略高于前 6 个月 1%–10% 黄金建档区间。可在 Statement Date 出账前用同名 Checking 单次手动还掉一部分，使上报金额落在 ' + fmtUSD(minSafe) + '–' + fmtUSD(maxSafe) + '。';
    } else if (util > 30) {
      tOut.textContent = turnover.toFixed(2) + 'x · 负债偏高';
      vBox.className = 'icr-verdict icr-verdict-warn';
      vTitle.textContent = '预警：出账使用率超过 30%，将明显压制白户早期 FICO 评分';
      vDesc.textContent = '前 6 个月白户信用极薄，上报 ' + util.toFixed(1) + '% 高负债比会让银行判定资金紧张。请直接减少当月刷卡额（首卡每月象征性消费 ' + fmtUSD(minSafe) + '–' + fmtUSD(maxSafe) + ' 即可），无需拿低额度首卡硬扛日常大额开支。';
    } else if (stmt === 0 && spend === 0) {
      tOut.textContent = '0.00x · 零账单';
      vBox.className = 'icr-verdict icr-verdict-warn';
      vTitle.textContent = '提示：长期 $0 零账单不利于早期活跃度建档';
      vDesc.textContent = '完全不刷或每月出账恒为 $0（All Zero）反而不如保留 1%–9% 微小正余额（如 ' + fmtUSD(minSafe) + '–' + fmtUSD(maxSafe) + '）再由 Autopay 全额扣款更利于孵化首个 FICO 高分。';
    } else {
      tOut.textContent = turnover.toFixed(2) + 'x · 安全';
      vBox.className = 'icr-verdict icr-verdict-good';
      vTitle.textContent = '风控状态：绿色安全（理想养卡区间）';
      vDesc.textContent = '单月总消费 ' + fmtUSD(spend) + ' 未超过 ' + fmtUSD(limit) + ' 授信上限（无 Credit Cycling 风险），且出账上报余额占额度 ' + util.toFixed(1) + '%，契合前 6 个月养卡铁律。';
    }
  }

  [limitEl, spendEl, stmtEl].forEach(function (el) {
    if (el) el.addEventListener('input', updateCyclingSim);
  });
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      limitEl.value = '200';
      spendEl.value = '16';
      stmtEl.value = '16';
      updateCyclingSim();
    });
  }
  updateCyclingSim();

  // 4. Scroll-spy active highlight for sticky TOC
  var tocLinks = document.querySelectorAll('.icr-toc nav a[href^="#"]');
  var sections = Array.prototype.slice.call(tocLinks).map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          tocLinks.forEach(function (a) {
            a.classList.toggle('cur', a.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
    sections.forEach(function (sec) { io.observe(sec); });
  }
})();
