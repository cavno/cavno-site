(function () {
  'use strict';

  var root = document.getElementById('us-banking-app');
  if (!root) return;

  function fmtUSD(n) {
    var sign = n < 0 ? '-' : '';
    var abs = Math.round(Math.abs(n));
    return sign + '$' + abs.toLocaleString('en-US');
  }

  // 1. Checking + HYSA + Credit Cashback & Utilization Simulator
  var cashPoolEl = document.getElementById('ubkCashPool');
  var spendEl = document.getElementById('ubkMonthlySpend');
  var apyEl = document.getElementById('ubkHysaApy');
  var cbEl = document.getElementById('ubkCashbackRate');
  var limitEl = document.getElementById('ubkCreditLimit');
  var resetBtn = document.getElementById('ubkSimReset');

  function updateSimulator() {
    if (!cashPoolEl || !spendEl || !apyEl || !cbEl || !limitEl) return;
    var cashPool = Number(cashPoolEl.value) || 0;
    var spend = Number(spendEl.value) || 0;
    var apy = Number(apyEl.value) || 0;
    var cb = Number(cbEl.value) || 0;
    var limit = Math.max(100, Number(limitEl.value) || 1000);

    document.getElementById('ubkCashPoolOut').textContent = fmtUSD(cashPool);
    document.getElementById('ubkMonthlySpendOut').textContent = fmtUSD(spend);
    document.getElementById('ubkHysaApyOut').textContent = apy.toFixed(2) + '%';
    document.getElementById('ubkCashbackRateOut').textContent = cb.toFixed(1) + '%';
    document.getElementById('ubkCreditLimitOut').textContent = fmtUSD(limit);

    var recommendedBuffer = Math.min(cashPool, Math.max(800, Math.round(spend * 1.3)));
    var hysaBalance = Math.max(0, cashPool - recommendedBuffer);
    var hysaInterest = hysaBalance * (apy / 100) + recommendedBuffer * 0.0005;
    var allCheckingInterest = cashPool * 0.0005;
    var annualCashback = spend * 12 * (cb / 100);
    var netGain = (hysaInterest - allCheckingInterest) + annualCashback;

    document.getElementById('ubkCheckingBuf').textContent = fmtUSD(recommendedBuffer);
    document.getElementById('ubkSavingsAlloc').textContent =
      hysaBalance > 0 ? ('其余 ' + fmtUSD(hysaBalance) + ' 沉淀至 HYSA') : '当前现金池优先保障日常 ACH 扣款';
    document.getElementById('ubkAnnualInterest').textContent = '+' + fmtUSD(hysaInterest) + ' / 年';
    document.getElementById('ubkCheckingIdleInterest').textContent = '全放 Checking 仅约 ' + fmtUSD(allCheckingInterest) + ' / 年';
    document.getElementById('ubkAnnualCashback').textContent = '+' + fmtUSD(annualCashback) + ' / 年';
    document.getElementById('ubkNetAdvantage').textContent = '+' + fmtUSD(netGain) + ' / 年';

    var util = (spend / limit) * 100;
    var utilClamped = Math.min(100, Math.max(2, util));
    var fillEl = document.getElementById('ubkUtilFill');
    var pctEl = document.getElementById('ubkUtilPct');
    var tipEl = document.getElementById('ubkUtilTip');

    fillEl.style.width = utilClamped.toFixed(1) + '%';
    if (util < 10) {
      fillEl.style.backgroundColor = '#2F634D';
      pctEl.textContent = util.toFixed(1) + '% · 极佳建档区间 (<10%)';
      tipEl.textContent = '当前月账单占授信额度 ' + util.toFixed(1) + '%，处于 FICO 模型最偏好的 1%–9% 低负债率区间，只需等出账后 Checking 自动全额 ACH 还款即可。';
    } else if (util < 30) {
      fillEl.style.backgroundColor = '#C15F3C';
      pctEl.textContent = util.toFixed(1) + '% · 稳健区间 (10%–29%)';
      tipEl.textContent = '当前账单占用 ' + util.toFixed(1) + '%（低于 30% 警戒线）。若近期准备申请高阶卡，可在 Statement Date 出账前从 Checking 提前还款，将上报使用率压至 10% 以内。';
    } else {
      fillEl.style.backgroundColor = '#9E472A';
      pctEl.textContent = util.toFixed(1) + '% · 偏高承压 (>=30%)';
      var prepay = Math.max(0, Math.round(spend - limit * 0.09));
      tipEl.textContent = '当前单月账单占授信额度达 ' + util.toFixed(1) + '%（新手低额度卡常见现象）。建议在出账日前先从 Checking 手动提前还掉约 ' + fmtUSD(prepay) + '，把上报给三大信用局的期末余额降到 9% 左右。';
    }
  }

  [cashPoolEl, spendEl, apyEl, cbEl, limitEl].forEach(function (el) {
    if (el) el.addEventListener('input', updateSimulator);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      cashPoolEl.value = '20000';
      spendEl.value = '2200';
      apyEl.value = '4.0';
      cbEl.value = '2.0';
      limitEl.value = '10000';
      updateSimulator();
    });
  }
  updateSimulator();

  // 2. Card Layer Risk & Return Scenario Switcher
  var scenarios = {
    fraud: {
      debitBadge: 'EFTA 管辖 · 冻结自有本金',
      debitClass: 'ubk-pill ubk-pill-warn',
      debitBody: '$1,500 真实现金瞬间从 Checking 被划走，可能引发后续房租或信用卡自动还款余额不足跳票；若超过 2 个工作日才挂失，个人法定责任上限升至 $500，超过 60 天未报可能自行承担全额损失。',
      creditBadge: 'FCBA 零责任 · 本金毫发无损',
      creditClass: 'ubk-pill ubk-pill-good',
      creditBody: '被占用的是银行循环授信额度，你的 Checking 存款一分钱未动；受 FCBA 保护（主流发卡行均执行 $0 Zero Liability），App 内一键发起 Dispute 期间无需垫付争议款项。',
      virtualBadge: '商户绑定拦截 · 自动拒付',
      virtualClass: 'ubk-pill',
      virtualBody: '因虚拟卡号已死锁在首个消费商户（Merchant-Locked）且设有单笔/月度上限（如 $20/月），黑客在其他网站尝试盗刷 $1,500 会被网关毫秒级直接拒付，随时可销毁该子卡且不影响底层 Checking。'
    },
    daily: {
      debitBadge: 'Durbin 限价 · 0% 返现 · 0 征信',
      debitClass: 'ubk-pill ubk-pill-warn',
      debitBody: '受《德宾修正案》限制，大型银行借记卡手续费被压低至约 $0.21 + 0.05%，几乎不提供返现；刷卡直接扣减 Checking 现金，且不向三大信用局输出任何信用记录。',
      creditBadge: '1.5%–5% 返现 + FICO 累积',
      creditClass: 'ubk-pill ubk-pill-good',
      creditBody: '发卡行向商户收取约 2%–3% 交换费，并将 1.5%–5% 以返现或里程补贴给持卡人；同时享受最长约 25–55 天免息账期（闲置资金留在 HYSA 继续生息）并按月上报信用局。',
      virtualBadge: '非日常线下主力 · 无信用累积',
      virtualClass: 'ubk-pill',
      virtualBody: 'Privacy.com 底层通过 ACH 从 Checking 扣款，属于借记代理层而非信贷产品：既不积累 FICO 信用分，也不提供高额消费返现，线下餐饮商超优先刷 Credit Card 更划算。'
    },
    saas: {
      debitBadge: '真实卡号裸奔 · 退订摩擦高',
      debitClass: 'ubk-pill ubk-pill-warn',
      debitBody: '把挂载主 Checking 的实体 Debit 卡号直接填给海外小众工具站或自动续费 SaaS，一旦对方数据库泄露或暗中连续扣费，受影响的是整个结算主账户。',
      creditBadge: '适合高信誉大厂 · 赚流媒体返现',
      creditClass: 'ubk-pill ubk-pill-good',
      creditBody: '对于 Apple、Netflix 或正规云厂商等风控透明的订阅服务，可用 Savor 等信用卡获取返现并享受零责任保障；但若遇到取消入口隐蔽的小网站，更换实体信用卡号会影响其他正常绑定。',
      virtualBadge: '一商户一卡 + 限额熔断最优解',
      virtualClass: 'ubk-pill ubk-pill-good',
      virtualBody: '为 Claude、独立开发者 SaaS 或试用服务单独生成一张专属虚拟卡并锁定每月 $20 上限：商户一旦超额扣费自动拦截，不想续订时一键 Pause / Close 即彻底切断扣款权限。'
    }
  };

  var scBtns = root.querySelectorAll('.ubk-seg-btn[data-scenario]');
  scBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-scenario');
      var data = scenarios[key];
      if (!data) return;
      scBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      var dBadge = document.getElementById('ubkScDebitBadge');
      var cBadge = document.getElementById('ubkScCreditBadge');
      var vBadge = document.getElementById('ubkScVirtualBadge');
      dBadge.className = data.debitClass;
      dBadge.textContent = data.debitBadge;
      document.getElementById('ubkScDebitBody').textContent = data.debitBody;
      cBadge.className = data.creditClass;
      cBadge.textContent = data.creditBadge;
      document.getElementById('ubkScCreditBody').textContent = data.creditBody;
      vBadge.className = data.virtualClass;
      vBadge.textContent = data.virtualBadge;
      document.getElementById('ubkScVirtualBody').textContent = data.virtualBody;
    });
  });

  // 3. Capital One Matrix Tier Filter
  var tierBtns = root.querySelectorAll('.ubk-tier-btn[data-tier]');
  var capRows = root.querySelectorAll('#ubkCapOneTbody tr[data-tier]');
  tierBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tier = btn.getAttribute('data-tier');
      tierBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      capRows.forEach(function (row) {
        if (tier === 'all') {
          row.classList.remove('ubk-row-dim', 'ubk-row-focus');
        } else {
          var match = row.getAttribute('data-tier') === tier;
          row.classList.toggle('ubk-row-focus', match);
          row.classList.toggle('ubk-row-dim', !match);
        }
      });
    });
  });

  // 4. Dual-Loop SVG Node & Track Explorer
  var nodeMeta = {
    inflow: {
      tag: 'NODE 01 · 外部美元与非居民切入节点',
      title: '外部美元资金（工资入账 / Wise / 华美 / 水星银行）',
      desc: '任何拥有合法美国 Routing Number 与 Account Number 的支票账户均可充当清算入口。由于美国“存款账户”与“信用卡”完全解耦，云居民无需死磕同一家银行的 Checking，先打通任一合规 Checking 即可为全美主流信用卡提供自动 ACH 还款支撑。'
    },
    checking: {
      tag: 'NODE 02 · 清算路由中枢（0.01%–0.1% APY）',
      title: 'Checking Account（日常结算池）',
      desc: '全美 ACH 清算网络的路由枢纽：负责接收外部入金、向信用卡发起每月自动还款（AutoPay）、向 IBKR 等美股券商出入金，以及为 Privacy.com 虚拟卡提供底层扣款支持。日常仅留足账单缓冲，不存放大额闲置资金。'
    },
    savings: {
      tag: 'NODE 03 · 闲置现金高息蓄水池（HYSA）',
      title: 'Savings Account（高息储蓄账户）',
      desc: '利率紧跟美联储基准利率，专门承接 Checking 划转过来的大额闲置美元吃高息。受 Regulation D 历史规则影响通常不用于高频对外支付，还款日前通过同行 App Internal Transfer 秒级划回 Checking 即可。'
    },
    virtual: {
      tag: 'NODE 04 · 订阅与高危商户隔离层',
      title: 'Virtual Card（如 Privacy.com 虚拟卡）',
      desc: '通过 ACH 挂载在 Checking 上派生的虚拟借记卡：执行“一商户一卡号 + 单笔/月度扣款上限”，专门对付 Claude 等 SaaS 订阅或中小独立站，单点泄露随时关停子卡，绝不波及主账户与主力信用卡。'
    },
    creditcard: {
      tag: 'NODE 05 · 双轨耦合枢纽（返现 + FCBA 保护 + 征信源头）',
      title: 'Credit Card（独立循环信贷额度）',
      desc: '整套体系里唯一同时连接“资金流闭环”与“信息流闭环”的核心组件：日常消费花银行授信（赚 1.5%–5% 返现并享 FCBA 零责任防盗刷），出账后由 Checking 自动 ACH 归还，同时向三大征信局输出还款履约记录。'
    },
    bureaus: {
      tag: 'NODE 06 · 个人信用建档引擎',
      title: '三大信用局（Experian / Equifax / TransUnion）',
      desc: '发卡行每月在 Statement Date 出账后，将你的额度使用率（Utilization）与准时还款记录同步至三大征信局，持续累积信用历史长度与履约权重，驱动 FICO Score 稳步爬升。'
    },
    unlock: {
      tag: 'NODE 07 · 风险定价正反馈回报',
      title: '解锁更高级别信用卡与银行账户权益',
      desc: '当 FICO 信用档案从零破冰迈向 Good / Excellent 后，即可从无返现的 Platinum / Secured 阶梯式升级至 Quicksilver、Savor 乃至等效负年费的高端商旅卡 Venture X，并降低全美金融机构的开户风控摩擦。'
    }
  };

  var svgNodes = root.querySelectorAll('.ubk-svg-node[data-node]');
  var svgEdges = root.querySelectorAll('.ubk-edge-group[data-track]');
  var loopBtns = root.querySelectorAll('.ubk-loop-btn[data-loop]');

  function selectNode(nodeKey) {
    var info = nodeMeta[nodeKey];
    if (!info) return;
    svgNodes.forEach(function (n) {
      n.classList.toggle('active', n.getAttribute('data-node') === nodeKey);
    });
    document.getElementById('ubkNodeTag').textContent = info.tag;
    document.getElementById('ubkNodeTitle').textContent = info.title;
    document.getElementById('ubkNodeDesc').textContent = info.desc;
  }

  svgNodes.forEach(function (node) {
    node.addEventListener('click', function () {
      selectNode(node.getAttribute('data-node'));
    });
    node.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        selectNode(node.getAttribute('data-node'));
      }
    });
  });

  loopBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-loop');
      loopBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      svgNodes.forEach(function (n) {
        var tracks = (n.getAttribute('data-track') || '').split(/\s+/);
        var show = mode === 'all' || tracks.indexOf(mode) !== -1;
        n.classList.toggle('ubk-dimmed', !show);
      });
      svgEdges.forEach(function (e) {
        var tracks = (e.getAttribute('data-track') || '').split(/\s+/);
        var show = mode === 'all' || tracks.indexOf(mode) !== -1;
        e.classList.toggle('ubk-dimmed', !show);
      });
      if (mode === 'cash') selectNode('checking');
      else if (mode === 'credit') selectNode('bureaus');
      else if (mode === 'itin') selectNode('inflow');
      else selectNode('creditcard');
    });
  });

  // 5. Scroll-spy active highlight for sticky TOC
  var tocLinks = document.querySelectorAll('.ubk-toc nav a[href^="#"]');
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
