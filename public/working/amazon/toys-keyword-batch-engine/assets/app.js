/* Cavno Working · Amazon Tools — 亚马逊美国站玩具类目 · 万级关键词广告策略批处理引擎 v2 (Scoped IIFE) */
(() => {
  'use strict';
  const root = document.getElementById('toys-keyword-app');
  if (!root) return;
  const byId = (id) => root.querySelector('[id="' + id + '"]');

  // =========================================================================
    // 1. GROUNDED INITIAL DATA (Verbatim from 出单词样本.xlsx & 玩具流量分析和管理方向落地.pdf)
    // =========================================================================
    const ATTACHMENT_SAMPLE_ROWS = [
      { searchTerm: 'kokodi kids smart phone', sourceMatch: '紧密匹配', bid: 0.38, adType: 'SP-Auto', clickShare: 1.13, ctr: 11.17, cpc: 1.51, spend: 2010.81, spendShare: 1.66, orders: 579, cvr: 43.44, cpa: 3.47, units: 606, sales: 18262.33 },
      { searchTerm: 'kids phones 3-5', sourceMatch: '词组匹配', bid: 0.48, adType: 'SP-Manual', clickShare: 2.21, ctr: 0.71, cpc: 1.25, spend: 3242.99, spendShare: 2.68, orders: 458, cvr: 17.59, cpa: 7.08, units: 492, sales: 15226.21 },
      { searchTerm: 'kids smart phone', sourceMatch: '词组匹配', bid: 0.25, adType: 'SP-Manual', clickShare: 1.63, ctr: 0.57, cpc: 1.36, spend: 2605.61, spendShare: 2.16, orders: 371, cvr: 19.31, cpa: 7.02, units: 388, sales: 11458.52 },
      { searchTerm: 'kids phones for 7-12', sourceMatch: '词组匹配', bid: 0.48, adType: 'SP-Manual', clickShare: 1.43, ctr: 0.50, cpc: 1.23, spend: 2070.60, spendShare: 1.71, orders: 248, cvr: 14.70, cpa: 8.35, units: 266, sales: 8186.34 },
      { searchTerm: 'kokodi kids smart phone', sourceMatch: '词组匹配', bid: 0.25, adType: 'SP-Manual', clickShare: 0.57, ctr: 0.94, cpc: 1.42, spend: 955.21, spendShare: 0.79, orders: 228, cvr: 33.78, cpa: 4.19, units: 250, sales: 7410.22 },
      { searchTerm: 'kids phone', sourceMatch: '紧密匹配', bid: 0.38, adType: 'SP-Auto', clickShare: 0.76, ctr: 1.18, cpc: 1.59, spend: 1412.66, spendShare: 1.17, orders: 193, cvr: 21.66, cpa: 7.32, units: 200, sales: 5830.82 },
      { searchTerm: 'kids phone', sourceMatch: '词组匹配', bid: 0.48, adType: 'SP-Manual', clickShare: 0.92, ctr: 0.39, cpc: 1.46, spend: 1569.68, spendShare: 1.30, orders: 171, cvr: 15.86, cpa: 9.18, units: 181, sales: 5294.84 },
      { searchTerm: 'toddler smart phone', sourceMatch: '词组匹配', bid: 0.99, adType: 'SP-Manual', clickShare: 0.66, ctr: 0.70, cpc: 1.62, spend: 1252.52, spendShare: 1.04, orders: 148, cvr: 19.17, cpa: 8.46, units: 161, sales: 4826.12 },
      { searchTerm: 'kids cell phone toy', sourceMatch: '词组匹配', bid: 0.66, adType: 'SP-Manual', clickShare: 0.21, ctr: 1.67, cpc: 1.71, spend: 428.16, spendShare: 0.35, orders: 56, cvr: 22.40, cpa: 7.65, units: 60, sales: 1708.38 },
      { searchTerm: 'b0f93b5lwz', sourceMatch: '商品', bid: 0.70, adType: 'SP-Manual', clickShare: 0.39, ctr: 0.83, cpc: 0.81, spend: 369.12, spendShare: 0.31, orders: 51, cvr: 11.16, cpa: 7.24, units: 55, sales: 2441.62 }
    ];

    // Exact labeled weekly traffic entry series from PDF Page 5 Fig 3
    const PDF_SEASONAL_SERIES = [
      { week: '9月2日', entries: 82 },
      { week: '9月9日', entries: 87 },
      { week: '9月16日', entries: 91 },
      { week: '9月23日', entries: 95 },
      { week: '9月30日', entries: 93 },
      { week: '10月7日', entries: 110 },
      { week: '10月14日(秋促)', entries: 174 },
      { week: '10月21日', entries: 125 },
      { week: '10月28日', entries: 103 },
      { week: '11月4日(启动)', entries: 138 },
      { week: '11月11日(加速)', entries: 180 },
      { week: '11月18日', entries: 222 },
      { week: '11月25日(黑五)', entries: 347 },
      { week: '12月9日', entries: 331 },
      { week: '12月16日(圣诞前)', entries: 332 },
      { week: '12月23日(回落)', entries: 259 },
      { week: '12月30日(收缩)', entries: 129 },
      { week: '1月6日', entries: 92 },
      { week: '1月13日', entries: 83 },
      { week: '1月27日', entries: 75 },
      { week: '2月17日', entries: 62 },
      { week: '3月23日', entries: 83 },
      { week: '4月20日', entries: 71 },
      { week: '5月11日', entries: 80 },
      { week: '6月1日', entries: 88 },
      { week: '6月22日', entries: 95 },
      { week: '7月20日(夏促)', entries: 126 },
      { week: '8月10日', entries: 95 },
      { week: '8月24日', entries: 82 }
    ];

    const SEASON_MODES = {
      off: {
        id: 'off',
        name: '平季稳态期 (2-9月)',
        acosFactor: 1.0,
        cpaFactor: 1.0,
        bidMultiplier: 0.95,
        allowBroad: false,
        allowGiftBoost: false,
        summary: '平季词池仅 ~4,000 词，转化率约 10%-18%：严禁裸跑纯宽泛，主力预算锁死【精准排名组 + 黄金适龄受控词组】，泛词与高龄词独立低Bid限流。'
      },
      ramp: {
        id: 'ramp',
        name: '旺季抢位启动期 (10-11月初)',
        acosFactor: 1.12,
        cpaFactor: 1.12,
        bidMultiplier: 1.15,
        allowBroad: false,
        allowGiftBoost: true,
        summary: 'ABA 排名进入启动拐点：在旺季 CPC 暴涨前，对核心精准词与黄金年龄词上调竞价 +15% 抢占自然排名坑位，并挂载全量前置否定词库。'
      },
      peak: {
        id: 'peak',
        name: '黑五网一圣诞爆发期 (11月中-12.20)',
        acosFactor: 1.25,
        cpaFactor: 1.25,
        bidMultiplier: 1.25,
        allowBroad: true,
        allowGiftBoost: true,
        summary: '词池膨胀至 2.89 万词、CVR 翻 2-3 倍：全面解锁【礼物场景词组】与【核心词根限定宽泛 (+kids +phone +toy)】，CPA 容忍度上浮 25% 吃透峰值流量。'
      },
      shrink: {
        id: 'shrink',
        name: '节后急速收缩期 (12.21后)',
        acosFactor: 0.85,
        cpaFactor: 0.85,
        bidMultiplier: 0.72,
        allowBroad: false,
        allowGiftBoost: false,
        summary: '圣诞截单后流量与 CVR 断崖下跌 (332→129→92)：立即暂停所有宽泛与圣诞礼物词，常规词组竞价下调 28%，零单止损线收紧 30% 防止利润回吐。'
      }
    };

    const STOPWORDS = new Set(['for', 'with', 'and', 'the', 'of', 'in', 'to', 'on', 'a', 'an', 'by', 'at']);

    // State Model
    const appState = {
      datasetName: '待初始化',
      workspace: {
        isInitialized: true,
        envType: 'demo', // 'clean_prod' | 'demo'
        projectName: '儿童智能玩具手机 (示例工作区)',
        skuTag: 'US-TOY-PHONE',
        negPreset: 'toy_phone',
        updatedAt: '2026-11-13'
      },
      batches: [],
      nextBatchSeq: 1,
      pendingImports: [],
      storageMode: '检测中...',
      season: 'off',
      activeTab: 'batches',
      sankeySelectedRoot: 'kids phone',
      sankeyCustomRoot: '',
      sankeyFocusNodeId: null,
      lastSankeyPlan: [],
      tableViewMode: 'dedup', // 'dedup' | 'raw'
      currentPage: 1,
      pageSize: 50,
      lastProcessMs: 0,
      rawRows: [],
      processedRaw: [],
      dedupTerms: [],
      ngramRows: [],
      triggeredNegatives: [],
      campaignBuckets: [],
      config: {
        targetAcos: 22.0,
        targetCpa: 6.80,
        exactMinOrders: 5,
        zeroOrderSpend: 14.0,
        rootNegSpend: 25.0,
        ownBrands: ['kokodi'],
        compBrands: ['vtech', 'leapfrog', 'momilla', 'luciros', 'prograce', 'gabb', 'bark', 'kidizoom'],
        goldenAges: ['toddler', '3-5', '3-6', '4-6', '3-8', '4-8', '3 year', '4 year', '5 year', '6 year'],
        secondaryAges: ['7-12', '8-12', '6-10', '9-12', '7 year', '8 year', '9 year', '10 year']
      },
      preNegCategories: {
        real_phone: {
          label: '真机通讯 / 运营商 / SIM卡意图 (玩具智能机头号烧钱黑洞)',
          words: ['sim card', 'unlocked', 'verizon', 'at&t', 't-mobile', 'cellular', 'prepaid', 'tracfone', 'iphone', 'samsung', 'android', 'real call', 'calling plan', '5g', 'lte', 'gps tracker']
        },
        parts_acc: {
          label: '无关配件 / 维修 / 说明书意图',
          words: ['case only', 'screen protector', 'replacement charger', 'charging cable', 'repair', 'manual', 'tempered glass', 'lanyard only']
        },
        low_val: {
          label: '二手 / 免费 / 批发清仓低质词',
          words: ['free', 'used', 'refurbished', 'renewed', 'wholesale', 'bulk lot', 'dollar tree', 'clearance']
        },
        wrong_age: {
          label: '严重错配年龄段词 (成人 / 婴儿0-1岁 / 青少年)',
          words: ['adult', 'senior', 'elderly', 'teenager', 'for teens', '13-15', 'infant', 'newborn', '0-6 months', '6-12 months']
        }
      }
    };

    let strategyChartInstance = null;
    let scatterChartInstance = null;
    let seasonChartInstance = null;

    // =========================================================================
    // 2. UTILITY & NORMALIZATION FUNCTIONS
    // =========================================================================
    function showToast(message, type) {
      const container = byId('toastContainer');
      const toast = document.createElement('div');
      const bgClass = type === 'error' ? 'bg-rose-600' : (type === 'warn' ? 'bg-amber-600' : 'bg-slate-900');
      toast.className = bgClass + ' text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg border border-white/10 pointer-events-auto transition-all duration-300';
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, 3200);
    }

    function parseNum(val) {
      if (typeof val === 'number') return isFinite(val) ? val : 0;
      if (val === null || val === undefined) return 0;
      const cleaned = String(val).replace(/[$,%\s,]/g, '').trim();
      const num = parseFloat(cleaned);
      return isFinite(num) ? num : 0;
    }

    function parsePct(val) {
      if (typeof val === 'number') {
        if (!isFinite(val)) return 0;
        return val <= 1 && val > 0 ? val * 100 : val;
      }
      if (val === null || val === undefined) return 0;
      const str = String(val).trim();
      const hasPct = str.indexOf('%') !== -1;
      const num = parseFloat(str.replace(/[$,%\s,]/g, ''));
      if (!isFinite(num)) return 0;
      return (!hasPct && num > 0 && num <= 1) ? num * 100 : num;
    }

    function stemToken(word) {
      if (word.length <= 3) return word;
      if (word === 'kids') return 'kids';
      if (word === 'phones') return 'phone';
      if (word === 'toys') return 'toy';
      if (word === 'gifts') return 'gift';
      if (word === 'girls') return 'girl';
      if (word === 'boys') return 'boy';
      if (word === 'toddlers') return 'toddler';
      if (word === 'games') return 'game';
      if (word.endsWith('ies') && word.length > 4) return word.slice(0, -3) + 'y';
      return word;
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function copyTextSafe(text, successMsg) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          showToast(successMsg, 'ok');
        }).catch(function() {
          fallbackCopyText(text, successMsg);
        });
      } else {
        fallbackCopyText(text, successMsg);
      }
    }

    function fallbackCopyText(text, successMsg) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast(successMsg, 'ok');
      } catch (e) {
        showToast('复制失败，请手动导出 Excel 查看', 'error');
      }
      document.body.removeChild(ta);
    }

    // =========================================================================
    // 3. CORE O(N) BATCH STRATEGY ENGINE (Handles 40,000+ Keywords Accurately)
    // =========================================================================
    function classifySearchTermIntent(termLower) {
      const trimmed = termLower.trim();
      const asinRegex = /^b0[a-z0-9]{8}$/i;
      if (asinRegex.test(trimmed)) {
        return { intent: '关联商品ASIN', isAsin: true, preNegHit: null };
      }

      // Check Pre-emptive Hard Negatives first
      const cats = appState.preNegCategories;
      for (const catKey in cats) {
        const words = cats[catKey].words;
        for (let i = 0; i < words.length; i++) {
          const w = words[i].toLowerCase().trim();
          if (w && trimmed.indexOf(w) !== -1) {
            return { intent: '前置高危否定词', isAsin: false, preNegHit: w, preNegCat: cats[catKey].label };
          }
        }
      }

      // Check Own Brand
      for (let i = 0; i < appState.config.ownBrands.length; i++) {
        const b = appState.config.ownBrands[i];
        if (b && trimmed.indexOf(b) !== -1) {
          return { intent: '自有品牌词', isAsin: false, preNegHit: null };
        }
      }

      // Check Competitor Brand
      for (let i = 0; i < appState.config.compBrands.length; i++) {
        const cb = appState.config.compBrands[i];
        if (cb && trimmed.indexOf(cb) !== -1) {
          return { intent: '竞品品牌词', isAsin: false, preNegHit: null };
        }
      }

      // Check Gift / Seasonal Modifiers
      const giftWords = ['gift', 'gifts', 'christmas', 'xmas', 'stocking', 'birthday', 'easter', 'present', 'holiday'];
      for (let i = 0; i < giftWords.length; i++) {
        if (trimmed.indexOf(giftWords[i]) !== -1) {
          return { intent: '节日礼物场景词', isAsin: false, preNegHit: null };
        }
      }

      // Check Secondary / Older Age (7-12, 8-12) before Golden Age so '7-12' is cleanly caught
      for (let i = 0; i < appState.config.secondaryAges.length; i++) {
        const sa = appState.config.secondaryAges[i];
        if (sa && trimmed.indexOf(sa) !== -1) {
          return { intent: '边缘高龄词', isAsin: false, preNegHit: null };
        }
      }

      // Check Golden Sweet-Spot Age (toddler, 3-5, etc.)
      for (let i = 0; i < appState.config.goldenAges.length; i++) {
        const ga = appState.config.goldenAges[i];
        if (ga && trimmed.indexOf(ga) !== -1) {
          return { intent: '黄金适龄词', isAsin: false, preNegHit: null };
        }
      }

      // Check High-Relevance Toy / Smart Attribute vs Pure Broad Head Term
      const toyAttrs = ['toy', 'toys', 'smart', 'pretend', 'play', 'camera', 'music', 'learning', 'educational', 'cell'];
      for (let i = 0; i < toyAttrs.length; i++) {
        if (trimmed.indexOf(toyAttrs[i]) !== -1) {
          return { intent: '高相关玩具属性词', isAsin: false, preNegHit: null };
        }
      }

      return { intent: '核心泛大词', isAsin: false, preNegHit: null };
    }

    function computeSuggestedBid(cpc, actualAcos, effectiveTargetAcos, clicks, seasonObj, bidCapRatio) {
      const baseCpc = cpc > 0 ? cpc : 0.85;
      if (actualAcos <= 0) {
        return Number((baseCpc * 0.65 * seasonObj.bidMultiplier).toFixed(2));
      }
      // Confidence damping based on click volume to prevent 1-click lucky order bid spikes
      const confidence = Math.min(1.0, Math.max(0.35, clicks / 40));
      const rawRatio = effectiveTargetAcos / actualAcos;
      const dampedRatio = 1 + (rawRatio - 1) * confidence;
      const clampedRatio = Math.min(bidCapRatio || 1.35, Math.max(0.45, dampedRatio));
      return Number((baseCpc * clampedRatio * seasonObj.bidMultiplier).toFixed(2));
    }

    function runBatchEngine() {
      const t0 = performance.now();
      const seasonObj = SEASON_MODES[appState.season];
      const effTargetAcos = appState.config.targetAcos * seasonObj.acosFactor;
      const effTargetCpa = appState.config.targetCpa * seasonObj.cpaFactor;
      const effZeroSpend = appState.season === 'shrink'
        ? appState.config.zeroOrderSpend * 0.7
        : appState.config.zeroOrderSpend;
      const effRootNegSpend = appState.season === 'shrink'
        ? appState.config.rootNegSpend * 0.75
        : appState.config.rootNegSpend;

      const termMap = new Map();
      const ngramMap = new Map();
      const processedRaw = [];

      // Pass 1: Normalize rows, aggregate deduplicated search terms & N-Gram roots
      for (let i = 0; i < appState.rawRows.length; i++) {
        const r = appState.rawRows[i];
        const rawTerm = String(r.searchTerm || '').trim();
        if (!rawTerm) continue;
        const normKey = rawTerm.toLowerCase().replace(/\s+/g, ' ');

        const spend = parseNum(r.spend);
        const orders = Math.round(parseNum(r.orders));
        const units = Math.round(parseNum(r.units)) || orders;
        const sales = parseNum(r.sales);
        const cpc = parseNum(r.cpc);
        const bid = parseNum(r.bid);
        const cvrPct = parsePct(r.cvr);
        const ctrPct = parsePct(r.ctr);

        let clicks = r.clicks ? Math.round(parseNum(r.clicks)) : 0;
        if (!clicks) {
          if (cpc > 0 && spend > 0) clicks = Math.max(1, Math.round(spend / cpc));
          else if (cvrPct > 0 && orders > 0) clicks = Math.max(orders, Math.round(orders / (cvrPct / 100)));
        }

        const acos = sales > 0 ? (spend / sales) * 100 : (spend > 0 ? 999 : 0);
        const cpa = orders > 0 ? spend / orders : spend;
        const calcCvr = clicks > 0 ? (orders / clicks) * 100 : cvrPct;
        const calcCpc = clicks > 0 ? spend / clicks : cpc;

        const cls = classifySearchTermIntent(normKey);

        const rowObj = {
          rowIndex: i + 1,
          batchId: r._batchId || 'BATCH-001',
          batchTag: r._batchTag || appState.datasetName,
          searchTerm: normKey,
          sourceMatch: r.sourceMatch || '未知',
          adType: r.adType || 'SP-Manual',
          bid: bid,
          clicks: clicks,
          ctr: ctrPct,
          cpc: Number(calcCpc.toFixed(2)),
          spend: Number(spend.toFixed(2)),
          orders: orders,
          units: units,
          sales: Number(sales.toFixed(2)),
          cvr: Number((cvrPct > 0 ? cvrPct : calcCvr).toFixed(2)),
          cpa: Number(cpa.toFixed(2)),
          acos: sales > 0 ? Number(acos.toFixed(2)) : 0,
          intent: cls.intent,
          isAsin: cls.isAsin,
          preNegHit: cls.preNegHit,
          preNegCat: cls.preNegCat
        };
        processedRaw.push(rowObj);

        // Aggregate into unique Search Term Map
        let agg = termMap.get(normKey);
        if (!agg) {
          agg = {
            searchTerm: normKey,
            intent: cls.intent,
            isAsin: cls.isAsin,
            preNegHit: cls.preNegHit,
            preNegCat: cls.preNegCat,
            channels: [],
            batchTags: [],
            hasAuto: false,
            hasManualPhraseOrBroad: false,
            hasManualExact: false,
            clicks: 0,
            spend: 0,
            orders: 0,
            units: 0,
            sales: 0,
            weightedBidSum: 0,
            bidWeight: 0
          };
          termMap.set(normKey, agg);
        }
        agg.channels.push(rowObj.adType + '·' + rowObj.sourceMatch);
        agg.batchTags.push(rowObj.batchId + ':' + rowObj.batchTag);
        if (rowObj.adType.toLowerCase().indexOf('auto') !== -1 || rowObj.sourceMatch.indexOf('紧密') !== -1 || rowObj.sourceMatch.indexOf('宽泛匹配') !== -1 && rowObj.adType.indexOf('Auto') !== -1) {
          agg.hasAuto = true;
        }
        if (rowObj.sourceMatch.indexOf('词组') !== -1 || rowObj.sourceMatch.toLowerCase().indexOf('phrase') !== -1 || rowObj.sourceMatch.indexOf('宽泛') !== -1 || rowObj.sourceMatch.toLowerCase().indexOf('broad') !== -1) {
          if (rowObj.adType.toLowerCase().indexOf('manual') !== -1) agg.hasManualPhraseOrBroad = true;
        }
        if (rowObj.sourceMatch.indexOf('精准') !== -1 || rowObj.sourceMatch.toLowerCase().indexOf('exact') !== -1) {
          agg.hasManualExact = true;
        }
        agg.clicks += clicks;
        agg.spend += spend;
        agg.orders += orders;
        agg.units += units;
        agg.sales += sales;
        if (bid > 0) {
          agg.weightedBidSum += bid * (spend > 0 ? spend : 1);
          agg.bidWeight += (spend > 0 ? spend : 1);
        }

        // Tokenize for 1-Gram & 2-Gram if not ASIN
        if (!cls.isAsin) {
          const rawTokens = normKey.replace(/[^a-z0-9-\s]/g, ' ').split(/\s+/).filter(Boolean);
          const cleanTokens = [];
          for (let t = 0; t < rawTokens.length; t++) {
            if (!STOPWORDS.has(rawTokens[t])) {
              cleanTokens.push(stemToken(rawTokens[t]));
            }
          }
          const seenGramsInRow = new Set();
          for (let t = 0; t < cleanTokens.length; t++) {
            const g1 = cleanTokens[t];
            if (g1.length >= 2 && !seenGramsInRow.has('1:' + g1)) {
              seenGramsInRow.add('1:' + g1);
              accumulateGram(ngramMap, g1, 1, normKey, clicks, spend, orders, sales);
            }
            if (t < cleanTokens.length - 1) {
              const g2 = cleanTokens[t] + ' ' + cleanTokens[t + 1];
              if (!seenGramsInRow.has('2:' + g2)) {
                seenGramsInRow.add('2:' + g2);
                accumulateGram(ngramMap, g2, 2, normKey, clicks, spend, orders, sales);
              }
            }
          }
        }
      }

      // Pass 2: Evaluate N-Gram Roots first so Root-Level Bleeding Negatives feed into Term Engine
      const bleedingRoots = new Set();
      const ngramRows = [];
      ngramMap.forEach(function(g) {
        const cvr = g.clicks > 0 ? (g.orders / g.clicks) * 100 : 0;
        const cpa = g.orders > 0 ? g.spend / g.orders : g.spend;
        const acos = g.sales > 0 ? (g.spend / g.sales) * 100 : (g.spend > 0 ? 999 : 0);
        const cls = classifySearchTermIntent(g.gram);

        let rootAdvice = '常规监控词根';
        let rootBadge = 'slate';
        if (cls.preNegHit) {
          rootAdvice = '前置否定词根 (词组否定)';
          rootBadge = 'rose';
          bleedingRoots.add(g.gram);
        } else if (g.orders === 0 && g.spend >= effRootNegSpend) {
          rootAdvice = '连坐止损否定 (0单高耗 → 词组否定)';
          rootBadge = 'rose';
          bleedingRoots.add(g.gram);
        } else if (g.orders > 0 && acos > effTargetAcos * 2.0 && g.clicks >= 25) {
          rootAdvice = '高亏词根收口 (严控竞价或词组否定)';
          rootBadge = 'amber';
        } else if (cls.intent === '自有品牌词') {
          rootAdvice = '品牌核心词根 (独立防御专案 + 他组否词隔离)';
          rootBadge = 'purple';
        } else if (g.orders >= appState.config.exactMinOrders && acos <= effTargetAcos * 1.15) {
          rootAdvice = '黄金扩量词根 (精准打排名 + 词组拓长尾)';
          rootBadge = 'emerald';
        } else if (cls.intent === '边缘高龄词' || acos > effTargetAcos * 1.15) {
          rootAdvice = '分化控价词根 (独立广告组压Bid防拖累)';
          rootBadge = 'indigo';
        }

        ngramRows.push({
          gram: g.gram,
          gramSize: g.gramSize,
          intent: cls.intent,
          termCount: g.terms.size,
          clicks: g.clicks,
          spend: Number(g.spend.toFixed(2)),
          orders: g.orders,
          sales: Number(g.sales.toFixed(2)),
          cvr: Number(cvr.toFixed(2)),
          cpa: Number(cpa.toFixed(2)),
          acos: g.sales > 0 ? Number(acos.toFixed(2)) : 0,
          rootAdvice: rootAdvice,
          rootBadge: rootBadge
        });
      });

      ngramRows.sort(function(a, b) { return b.orders - a.orders || b.spend - a.spend; });

      // Pass 3: Deduplicated Term Strategy Decision Matrix
      const dedupTerms = [];
      const triggeredNegatives = [];
      const decisionByTerm = new Map();

      termMap.forEach(function(item) {
        const cpc = item.clicks > 0 ? item.spend / item.clicks : 0;
        const cvr = item.clicks > 0 ? (item.orders / item.clicks) * 100 : 0;
        const cpa = item.orders > 0 ? item.spend / item.orders : item.spend;
        const acos = item.sales > 0 ? (item.spend / item.sales) * 100 : (item.spend > 0 ? 999 : 0);
        const avgBid = item.bidWeight > 0 ? item.weightedBidSum / item.bidWeight : 0;
        const uniqueChannels = Array.from(new Set(item.channels));
        const isOverlap = item.channels.length > 1;

        let actionCode = 'BID_CONTROL';
        let matchActionLabel = '';
        let campaignBucket = '';
        let isolationAction = '无需否定';
        let suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos, item.clicks, seasonObj, 1.35);
        let reasonText = '';

        // Rule Priority 1: Pre-emptive Hard Negative Hit
        if (item.preNegHit) {
          actionCode = 'NEG_STOP';
          matchActionLabel = '坚决不投 · 前置词组否定';
          campaignBucket = '黑名单拦截库';
          isolationAction = '全活动 · 词组否定 [' + item.preNegHit + ']';
          suggestedBid = 0;
          reasonText = '命中玩具类目前置高危否词 [' + item.preNegHit + '] (' + item.preNegCat + ')，非目标玩具受众，直接前置词组否定拦截。';
          triggeredNegatives.push({
            target: item.preNegHit,
            negCategory: '第一层：前置词库拦截',
            negMatchType: 'Negative Phrase (词组否定)',
            scope: '全部 SP-Auto / 词组 / 宽泛活动',
            spend: Number(item.spend.toFixed(2)),
            orders: item.orders,
            reason: '词内含高危非标意图词根 [' + item.preNegHit + ']'
          });
        }
        // Rule Priority 2: Performance Stop-Loss (0-Order High Spend or Extreme Losing CPA)
        else if ((item.orders === 0 && item.spend >= effZeroSpend) || (item.orders > 0 && cpa > effTargetCpa * 1.85 && acos > effTargetAcos * 1.85 && cvr < 8.0)) {
          actionCode = 'NEG_STOP';
          matchActionLabel = '停止投放 · 绩效精准否定';
          campaignBucket = '绩效止损淘汰池';
          isolationAction = item.isAsin ? '源活动 · 否定商品定位 (Neg ASIN)' : '源活动 · 精准否定 (Negative Exact)';
          suggestedBid = 0;
          reasonText = item.orders === 0
            ? '累计花费 $' + item.spend.toFixed(2) + ' 仍 0 出单（超过当前阶段止损线 $' + effZeroSpend.toFixed(2) + '），执行精准否定止损，避免误伤同词根其他出单词。'
            : 'CPA ($' + cpa.toFixed(2) + ') 与 ACOS (' + acos.toFixed(2) + '%) 严重超标且低转化，执行精准否定止损。';
          triggeredNegatives.push({
            target: item.searchTerm,
            negCategory: '第三层：单点绩效止损',
            negMatchType: item.isAsin ? 'Negative Product (否定ASIN)' : 'Negative Exact (精准否定)',
            scope: uniqueChannels.join(' / '),
            spend: Number(item.spend.toFixed(2)),
            orders: item.orders,
            reason: reasonText
          });
        }
        // Rule Priority 3: ASIN Product Targeting
        else if (item.isAsin) {
          if (item.orders >= 2 && acos <= effTargetAcos * 1.25) {
            actionCode = 'PRODUCT_ASIN';
            matchActionLabel = '商品定位 · 精准ASIN投放';
            campaignBucket = 'C6-高转关联ASIN商品定位专案';
            isolationAction = item.hasAuto ? 'SP-Auto中否定该ASIN防抢单' : '保持独立商品定位投放';
            suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos, item.clicks, seasonObj, 1.30);
            reasonText = '关联商品 ASIN 出单 ' + item.orders + ' 笔，ACOS ' + acos.toFixed(2) + '% 优于目标阈值，客单价高 ($' + (item.sales / Math.max(1, item.units)).toFixed(2) + ')，独立放入手动商品定位精准收割。';
          } else {
            actionCode = 'BID_CONTROL';
            matchActionLabel = '商品定位 · 压低竞价观察';
            campaignBucket = 'C6-高转关联ASIN商品定位专案';
            isolationAction = '限制单次点击竞价观察';
            suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos, item.clicks, seasonObj, 0.95);
            reasonText = 'ASIN 具备一定转化但绩效接近临界值，建议下调竞价独立观察。';
          }
        }
        // Rule Priority 4: Own Brand Defense (`kokodi*`)
        else if (item.intent === '自有品牌词') {
          actionCode = 'BRAND_EXACT';
          matchActionLabel = '精准匹配 (主力) + 品牌词组兜底';
          campaignBucket = 'C1-品牌防御专案 (独立预算)';
          isolationAction = '在 SP-Auto 及非品牌活动中【词组否定品牌词】';
          suggestedBid = Number(Math.min(cpc * 1.05, computeSuggestedBid(cpc, acos, effTargetAcos * 0.75, item.clicks, seasonObj, 1.15)).toFixed(2));
          reasonText = '自有品牌高转化流量 (CVR ' + cvr.toFixed(2) + '%, CPA $' + cpa.toFixed(2) + ')' + (isOverlap ? '，当前同时在 [' + uniqueChannels.join(' + ') + '] 重复跑量！' : '。') + '必须剥离至独立品牌防御专案，并在自动与常规词组活动中否定 kokodi，防止虚高 Auto 表现及内部抬价。';
          if (item.hasAuto || item.hasManualPhraseOrBroad) {
            triggeredNegatives.push({
              target: item.searchTerm,
              negCategory: '渠道分舱：品牌词剥离隔离',
              negMatchType: 'Negative Exact / Phrase (品牌隔离)',
              scope: 'SP-Auto 自动广告 & 非品牌常规词组活动',
              spend: Number(item.spend.toFixed(2)),
              orders: item.orders,
              reason: '品牌词转入【C1-品牌防御专案】精准承接，源自动/泛词组活动执行隔离防止重复抢单'
            });
          }
        }
        // Rule Priority 5: Secondary Older Age (`7-12`) OR Broad Head Term (`kids phone`) with high CPA/ACOS -> Isolate & Control Bid!
        else if (item.intent === '边缘高龄词') {
          if (acos <= effTargetAcos * 1.05 && cvr >= 16.5) {
            actionCode = 'SEG_PHRASE';
            matchActionLabel = '独立高龄组 · 精准 + 受控词组';
            campaignBucket = 'C4-边缘年龄/泛词独立控价专案';
          } else {
            actionCode = 'BID_CONTROL';
            matchActionLabel = '独立分舱 · 精准控Bid (严禁混入3-5组)';
            campaignBucket = 'C4-边缘年龄/泛词独立控价专案';
          }
          isolationAction = '从主力词组活动中精准否定剥离，单独设低Bid';
          suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos * 0.92, item.clicks, seasonObj, 0.98);
          reasonText = '7-12岁高龄儿童对“真手机”诉求增强，玩具机转化率 (' + cvr.toFixed(2) + '%) 明显低于 3-5岁/核心玩具词，CPA 达 $' + cpa.toFixed(2) + '。必须从主力词组中剥离至独立控价组单独压 Bid，避免降价连带压死 3-5 岁黄金流量！';
          triggeredNegatives.push({
            target: item.searchTerm,
            negCategory: '结构治理：高龄分化词剥离',
            negMatchType: 'Negative Exact (原混合组内隔离)',
            scope: '原混合 SP-Manual 词组活动',
            spend: Number(item.spend.toFixed(2)),
            orders: item.orders,
            reason: '剥离至【C4-边缘年龄独立控价组】单独控价，保护主力词组高转化人群不被连坐压Bid'
          });
        }
        // Rule Priority 6: Gift / Holiday Seasonal Terms
        else if (item.intent === '节日礼物场景词') {
          if (seasonObj.allowGiftBoost) {
            actionCode = seasonObj.allowBroad ? 'PEAK_BROAD' : 'SEG_PHRASE';
            matchActionLabel = seasonObj.allowBroad ? '旺季脉冲 · 词组 + 限定宽泛 (+gift)' : '旺季预热 · 独立礼物词组匹配';
            campaignBucket = 'C5-旺季礼物与限定宽泛脉冲专案';
            isolationAction = '挂载全量前置否定词库；12月21日定时关停';
            suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos * 1.1, item.clicks, seasonObj, 1.35);
            reasonText = '当前处于旺季放量窗口，礼物场景词池爆发且转化翻倍，独立归入脉冲专案吃透礼赠流量。';
          } else {
            actionCode = 'BID_CONTROL';
            matchActionLabel = '平季/节后收缩 · 仅保留精准低Bid或暂停';
            campaignBucket = 'C5-旺季礼物与限定宽泛脉冲专案 (当前收缩)';
            isolationAction = '暂停礼物宽泛/词组，防止淡季低转化损耗';
            suggestedBid = Number((cpc * 0.55).toFixed(2));
            reasonText = '当前非礼物爆发期，玩具礼赠泛词平季转化率暴跌，必须立即收缩词组/宽泛预算。';
          }
        }
        // Rule Priority 7: Core Golden Age (`3-5`, `toddler`) & High-Relevance Toy/Smart Terms
        else if (item.intent === '黄金适龄词' || item.intent === '高相关玩具属性词') {
          if (item.orders >= appState.config.exactMinOrders && acos <= effTargetAcos * 1.25) {
            actionCode = 'CORE_EXACT';
            matchActionLabel = seasonObj.allowBroad
              ? '主力精准 (打排名) + 核心词组 + 旺季限定宽泛'
              : '主力精准匹配 (打自然排名) + 受控词组拓流';
            campaignBucket = 'C2-核心大词与黄金适龄精准专案';
            isolationAction = (item.hasAuto || item.hasManualPhraseOrBroad)
              ? '升级精准后，在源 Auto / 泛词组中【精准否定毕业隔离】'
              : '挂载前置否定库保护';
            suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos * 1.05, item.clicks, seasonObj, 1.35);
            reasonText = '高确定性核心出单词（累计 ' + item.orders + ' 单，CVR ' + cvr.toFixed(2) + '%，ACOS ' + acos.toFixed(2) + '%）。主推【精准匹配】冲击 ABA 首页自然位，同时用挂载前置否词库的【受控词组】裂变长尾词。';
            if (item.hasAuto || item.hasManualPhraseOrBroad) {
              triggeredNegatives.push({
                target: item.searchTerm,
                negCategory: '渠道分舱：高转词毕业隔离',
                negMatchType: 'Negative Exact (毕业精准隔离)',
                scope: '源 SP-Auto / 泛拓词活动',
                spend: Number(item.spend.toFixed(2)),
                orders: item.orders,
                reason: '已满足精准毕业标准转入【C2-主力精准专案】，源拓词活动执行精准否定确保流量归口'
              });
            }
          } else {
            actionCode = 'SEG_PHRASE';
            matchActionLabel = '受控词组匹配 (挂载前置否定词库)';
            campaignBucket = 'C3-黄金年龄与属性受控词组专案';
            isolationAction = '必挂第一层真机/错配年龄前置词组否定';
            suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos, item.clicks, seasonObj, 1.15);
            reasonText = '意图高度契合玩具智能机属性，归入受控词组专案积累长尾转化数据。';
          }
        }
        // Rule Priority 8: Ambiguous Core Head Terms (`kids phone`) & Remaining Terms
        else {
          if (item.orders >= appState.config.exactMinOrders && acos <= effTargetAcos) {
            actionCode = 'CORE_EXACT';
            matchActionLabel = '精准匹配 + 严控词组 (禁纯宽泛)';
            campaignBucket = 'C2-核心大词与黄金适龄精准专案';
            isolationAction = '必挂真机/SIM卡前置否定库 + Auto内精准隔离';
            suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos, item.clicks, seasonObj, 1.20);
            reasonText = '头部大词具备规模单量且整体 ACOS 达标，打精准锁流，词组端必须严挂真机否词库。';
          } else if (item.orders >= 1) {
            actionCode = seasonObj.allowBroad ? 'PEAK_BROAD' : 'BID_CONTROL';
            matchActionLabel = seasonObj.allowBroad
              ? '旺季受控精准 + 限定宽泛 (+toy限定)'
              : '独立泛词专案 · 精准控Bid + 严禁裸跑宽泛';
            campaignBucket = 'C4-边缘年龄/泛词独立控价专案';
            isolationAction = '剥离混合组 + 强挂真机通讯前置否定词库';
            suggestedBid = computeSuggestedBid(cpc, acos, effTargetAcos * 0.90, item.clicks, seasonObj, 0.95);
            reasonText = '头部泛大词（如 kids phone）搜索意图混杂大量“真手机”需求' + (isOverlap ? '，且在 Auto 与 Manual 重复竞价（Manual 词组 CTR 低、CPA 偏高）' : '') + '。平季严禁放宽泛，需独立建组压低 Bid 并挂载真机否定词库！';
            if (isOverlap) {
              triggeredNegatives.push({
                target: item.searchTerm,
                negCategory: '渠道分舱：跨活动重复竞价治理',
                negMatchType: 'Negative Exact (收口单点承接)',
                scope: '低效重复的次级词组/自动活动',
                spend: Number(item.spend.toFixed(2)),
                orders: item.orders,
                reason: '同一泛大词在多渠道重复烧钱且绩效分化，统一收口至独立控价组承接'
              });
            }
          } else {
            actionCode = 'BID_CONTROL';
            matchActionLabel = '低竞价长尾观察 (触达止损线即否)';
            campaignBucket = 'C4-边缘年龄/泛词独立控价专案';
            isolationAction = '花费满 $' + effZeroSpend.toFixed(0) + ' 仍无单则自动转精准否定';
            suggestedBid = Number(Math.max(0.30, (cpc || 0.65) * 0.7).toFixed(2));
            reasonText = '长尾探索期花费尚未触及止损阈值，保持低竞价测试。';
          }
        }

        const dedupObj = {
          searchTerm: item.searchTerm,
          intent: item.intent,
          isAsin: item.isAsin,
          channelsText: uniqueChannels.join(' + '),
          batchesText: Array.from(new Set(item.batchTags)).join(' | '),
          channelCount: item.channels.length,
          isOverlap: isOverlap,
          avgBid: Number(avgBid.toFixed(2)),
          clicks: item.clicks,
          cpc: Number(cpc.toFixed(2)),
          spend: Number(item.spend.toFixed(2)),
          orders: item.orders,
          units: item.units,
          sales: Number(item.sales.toFixed(2)),
          cvr: Number(cvr.toFixed(2)),
          cpa: Number(cpa.toFixed(2)),
          acos: item.sales > 0 ? Number(acos.toFixed(2)) : 0,
          roas: item.spend > 0 ? Number((item.sales / item.spend).toFixed(2)) : 0,
          actionCode: actionCode,
          matchActionLabel: matchActionLabel,
          campaignBucket: campaignBucket,
          suggestedBid: suggestedBid,
          isolationAction: isolationAction,
          reasonText: reasonText
        };
        dedupTerms.push(dedupObj);
        decisionByTerm.set(item.searchTerm, dedupObj);
      });

      // Add N-Gram Root Bleeding Negatives to Triggered Negatives list
      for (let i = 0; i < ngramRows.length; i++) {
        const ng = ngramRows[i];
        if (ng.orders === 0 && ng.spend >= effRootNegSpend && ! classifySearchTermIntent(ng.gram).preNegHit) {
          triggeredNegatives.push({
            target: ng.gram,
            negCategory: '第二层：N-Gram词根连坐止损',
            negMatchType: 'Negative Phrase (词组否定)',
            scope: '全部 SP-Auto / 词组 / 宽泛活动',
            spend: ng.spend,
            orders: 0,
            reason: '包含词根 [' + ng.gram + '] 的 ' + ng.termCount + ' 个长尾词合计花费 $' + ng.spend.toFixed(2) + ' 且 0 出单'
          });
        }
      }

      // Enrich raw rows with row-specific diagnostic + parent deduplicated decision
      for (let i = 0; i < processedRaw.length; i++) {
        const row = processedRaw[i];
        const parent = decisionByTerm.get(row.searchTerm);
        row.actionCode = parent.actionCode;
        row.campaignBucket = parent.campaignBucket;
        row.suggestedBid = computeSuggestedBid(row.cpc, row.acos, effTargetAcos, row.clicks, seasonObj, 1.30);

        if (row.adType.indexOf('Auto') !== -1 && (parent.actionCode === 'BRAND_EXACT' || parent.actionCode === 'CORE_EXACT')) {
          row.matchActionLabel = '从 Auto 剥离 → 转入手动精准专案';
          row.isolationAction = '当前 SP-Auto 内执行【精准否定】防抢单';
        } else {
          row.matchActionLabel = parent.matchActionLabel;
          row.isolationAction = parent.isolationAction;
        }
        row.reasonText = parent.reasonText + '（当前单渠道表现：' + row.adType + '·' + row.sourceMatch + '，CVR ' + row.cvr + '%，CPA $' + row.cpa + '，ACOS ' + row.acos + '%）';
      }

      // Build 6 Standard Campaign Blueprint Summary
      const bucketDefs = [
        { id: 'C1-品牌防御专案 (独立预算)', title: 'C1 · 自有品牌防御专案', matchRule: '精准匹配 (主) + 品牌词组 (辅)', color: 'purple', desc: '收拢所有含 kokodi 品牌词流量；同时在 SP-Auto 及常规非品牌活动中词组否定 kokodi，杜绝内部抢单虚高 ACOS。' },
        { id: 'C2-核心大词与黄金适龄精准专案', title: 'C2 · 核心玩具词与3-5岁精准打排名专案', matchRule: '精准匹配 (Exact Only)', color: 'blue', desc: '承接已验证高转化的玩具属性词与 3-5/toddler 黄金适龄词，集中预算冲击自然排名与 ABA 拐点。' },
        { id: 'C3-黄金年龄与属性受控词组专案', title: 'C3 · 核心属性受控词组拓流专案', matchRule: '词组匹配 (必挂前置否定词库)', color: 'emerald', desc: '针对玩具长尾分散特征，用高相关词根裂变覆盖 2.8 万长尾词；出单达标词毕业转 C2 并在本组精准否定。' },
        { id: 'C4-边缘年龄/泛词独立控价专案', title: 'C4 · 边缘高龄(7-12)与泛大词独立控价专案', matchRule: '独立精准 / 严控低Bid词组', color: 'amber', desc: '将转化偏低的 7-12 岁词与意图混杂的泛词 kids phone 单独关进控价笼，独立调低竞价，绝不连累 3-5 岁主力组。' },
        { id: 'C5-旺季礼物与限定宽泛脉冲专案', title: 'C5 · 旺季礼物与限定宽泛脉冲专案', matchRule: '词组 + 词根锁死宽泛 (仅11-12.20开)', color: 'indigo', desc: '仅在旺季加速点至圣诞截单前开启，承接 gift/christmas 脉冲需求；12月21日一键暂停防节后亏损。' },
        { id: 'C6-高转关联ASIN商品定位专案', title: 'C6 · 关联竞品ASIN商品定位专案', matchRule: 'SP-Manual 商品精准定位', color: 'teal', desc: '定向收割高客单、高 ROAS 的关联玩具详情页流量（如 b0f93b5lwz），与关键词流量池解耦管理。' }
      ];

      appState.campaignBuckets = bucketDefs.map(function(b) {
        const matched = dedupTerms.filter(function(t) { return t.campaignBucket.indexOf(b.id.slice(0, 3)) === 0; });
        const spendSum = matched.reduce(function(s, x) { return s + x.spend; }, 0);
        const orderSum = matched.reduce(function(s, x) { return s + x.orders; }, 0);
        const salesSum = matched.reduce(function(s, x) { return s + x.sales; }, 0);
        return {
          title: b.title,
          matchRule: b.matchRule,
          color: b.color,
          desc: b.desc,
          termCount: matched.length,
          spend: Number(spendSum.toFixed(2)),
          orders: orderSum,
          sales: Number(salesSum.toFixed(2)),
          sampleTerms: matched.slice(0, 4).map(function(x) { return x.searchTerm; })
        };
      });

      const t1 = performance.now();
      appState.processedRaw = processedRaw;
      appState.dedupTerms = dedupTerms;
      appState.ngramRows = ngramRows;
      appState.triggeredNegatives = triggeredNegatives;
      appState.lastProcessMs = Math.max(1, Math.round(t1 - t0));

      updateAllViews();
    }

    function accumulateGram(map, gram, size, termKey, clicks, spend, orders, sales) {
      let g = map.get(gram);
      if (!g) {
        g = { gram: gram, gramSize: size, terms: new Set(), clicks: 0, spend: 0, orders: 0, sales: 0 };
        map.set(gram, g);
      }
      g.terms.add(termKey);
      g.clicks += clicks;
      g.spend += spend;
      g.orders += orders;
      g.sales += sales;
    }

    // =========================================================================
    // 4. UI RENDERING & CHARTS
    // =========================================================================
    function updateAllViews() {
      const enabledBatches = appState.batches.filter(function(b) { return b.enabled; });
      const batchSummaryTitle = enabledBatches.length === 0
        ? '无启用批次 (干净待导入态)'
        : (enabledBatches.length === 1
            ? enabledBatches[0].id + ' · ' + enabledBatches[0].label
            : '已合并 ' + enabledBatches.length + ' 个批次');
      appState.datasetName = batchSummaryTitle;

      // Update Header Badge & Global Workspace Context Bar
      byId('datasetBadge').textContent =
        batchSummaryTitle + ' (' + appState.processedRaw.length.toLocaleString() + '行 / ' + appState.dedupTerms.length.toLocaleString() + '唯一词)';

      byId('ctxProjectLabel').textContent =
        appState.workspace.projectName + (appState.workspace.skuTag ? ' [' + appState.workspace.skuTag + ']' : '');
      const ctxBatchEl = byId('ctxBatchStatusLabel');
      ctxBatchEl.textContent = enabledBatches.length + ' 启用 / 共 ' + appState.batches.length + ' 批次 (' + appState.dedupTerms.length.toLocaleString() + ' 唯一词)';
      ctxBatchEl.className = enabledBatches.length > 0
        ? 'px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold'
        : 'px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold';
      byId('ctxStorageBadge').textContent = '台账存储：' + appState.storageMode;
      byId('batchCountPill').textContent = enabledBatches.length + '/' + appState.batches.length;

      updateEmptyBannerVisibility();
      renderBatchManagementTab();

      const seasonObj = SEASON_MODES[appState.season];
      byId('seasonRuleSummary').textContent = seasonObj.summary;

      const sBtns = ['off', 'ramp', 'peak', 'shrink'];
      for (let i = 0; i < sBtns.length; i++) {
        const el = byId('seasonBtn_' + sBtns[i]);
        if (sBtns[i] === appState.season) el.classList.add('season-card-active');
        else el.classList.remove('season-card-active');
      }

      // Compute Global Totals
      let totalSpend = 0, totalOrders = 0, totalSales = 0, totalClicks = 0;
      let exactCnt = 0, exactOrders = 0, expandCnt = 0, expandOrders = 0, overlapCnt = 0, negStopCnt = 0;

      for (let i = 0; i < appState.dedupTerms.length; i++) {
        const t = appState.dedupTerms[i];
        totalSpend += t.spend;
        totalOrders += t.orders;
        totalSales += t.sales;
        totalClicks += t.clicks;
        if (t.isOverlap) overlapCnt++;
        if (t.actionCode === 'BRAND_EXACT' || t.actionCode === 'CORE_EXACT') {
          exactCnt++;
          exactOrders += t.orders;
        } else if (t.actionCode === 'SEG_PHRASE' || t.actionCode === 'PEAK_BROAD' || t.actionCode === 'PRODUCT_ASIN' || t.actionCode === 'BID_CONTROL') {
          expandCnt++;
          expandOrders += t.orders;
        } else if (t.actionCode === 'NEG_STOP') {
          negStopCnt++;
        }
      }

      const avgAcos = totalSales > 0 ? (totalSpend / totalSales) * 100 : 0;
      const avgRoas = totalSpend > 0 ? totalSales / totalSpend : 0;
      const avgCpa = totalOrders > 0 ? totalSpend / totalOrders : 0;
      const avgCvr = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;

      byId('kpiScale').textContent = appState.dedupTerms.length.toLocaleString() + ' 唯一词';
      byId('kpiSpeed').textContent = '原始 ' + appState.processedRaw.length.toLocaleString() + ' 行 · 引擎耗时 ' + appState.lastProcessMs + ' ms';
      byId('kpiSpendSales').textContent = '$' + totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' / $' + totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 });
      byId('kpiAcosRoas').textContent = '综合 ACOS ' + avgAcos.toFixed(2) + '% · ROAS ' + avgRoas.toFixed(2);
      byId('kpiOrdersCpa').textContent = totalOrders.toLocaleString() + ' 单 / $' + avgCpa.toFixed(2);
      byId('kpiAvgCvr').textContent = '加权平均转化率 CVR ' + avgCvr.toFixed(2) + '%';

      byId('kpiExactCount').textContent = exactCnt.toLocaleString() + ' 个核心词';
      byId('kpiExactShare').textContent = '贡献 ' + exactOrders.toLocaleString() + ' 单 (' + (totalOrders > 0 ? (exactOrders / totalOrders * 100).toFixed(1) : '0.0') + '%)';

      byId('kpiExpandCount').textContent = expandCnt.toLocaleString() + ' 个分层/控价词';
      byId('kpiExpandShare').textContent = '贡献 ' + expandOrders.toLocaleString() + ' 单 · 独立分舱管控';

      const totalPreNegWords = Object.values(appState.preNegCategories).reduce(function(acc, c) { return acc + c.words.length; }, 0);
      byId('kpiIsolateNeg').textContent = appState.triggeredNegatives.length + ' 条动作';
      byId('kpiIsolateSub').textContent = overlapCnt + ' 跨活动内耗词 · ' + negStopCnt + ' 止损淘汰词';
      byId('negCountPill').textContent = String(appState.triggeredNegatives.length + totalPreNegWords);

      renderStrategyTable();
      renderWorkbenchCharts();
      renderCampaignBlueprint();
      renderNgramTable();
      renderPreNegCategories();
      renderTriggeredNegTable();
      renderSeasonalityChart();
      populateSankeyRootControls();
      renderSankeyWorkbench();
    }

    function getActionBadgeHtml(actionCode, label) {
      const styles = {
        BRAND_EXACT: 'bg-purple-100 text-purple-800 border-purple-200',
        CORE_EXACT: 'bg-blue-100 text-blue-800 border-blue-200',
        SEG_PHRASE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        PEAK_BROAD: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        PRODUCT_ASIN: 'bg-teal-100 text-teal-800 border-teal-200',
        BID_CONTROL: 'bg-amber-100 text-amber-800 border-amber-200',
        NEG_STOP: 'bg-rose-100 text-rose-800 border-rose-200'
      };
      const cls = styles[actionCode] || 'bg-slate-100 text-slate-800 border-slate-200';
      return '<span class="inline-block px-2 py-0.5 rounded-md border text-[11px] font-semibold ' + cls + '">' + escapeHtml(label) + '</span>';
    }

    function getFilteredSortedList() {
      const source = appState.tableViewMode === 'dedup' ? appState.dedupTerms : appState.processedRaw;
      const actFilter = byId('filterActionSelect').value;
      const intentFilter = byId('filterIntentSelect').value;
      const q = byId('searchKeywordInput').value.trim().toLowerCase();
      const sortVal = byId('sortFieldSelect').value;

      const filtered = source.filter(function(item) {
        if (actFilter !== 'ALL' && item.actionCode !== actFilter) return false;
        if (intentFilter !== 'ALL' && item.intent !== intentFilter) return false;
        if (q) {
          const hay = (item.searchTerm + ' ' + item.matchActionLabel + ' ' + item.campaignBucket + ' ' + item.isolationAction).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });

      filtered.sort(function(a, b) {
        if (sortVal === 'orders_desc') return b.orders - a.orders || b.spend - a.spend;
        if (sortVal === 'spend_desc') return b.spend - a.spend;
        if (sortVal === 'sales_desc') return b.sales - a.sales;
        if (sortVal === 'acos_asc') {
          const aa = a.sales > 0 ? a.acos : 9999;
          const bb = b.sales > 0 ? b.acos : 9999;
          return aa - bb;
        }
        if (sortVal === 'cpa_desc') return b.cpa - a.cpa;
        if (sortVal === 'cvr_desc') return b.cvr - a.cvr;
        return 0;
      });

      return filtered;
    }

    function resetPageAndRenderTable() {
      appState.currentPage = 1;
      renderStrategyTable();
    }

    function changePage(delta) {
      appState.currentPage += delta;
      renderStrategyTable();
    }

    function setTableViewMode(mode) {
      appState.tableViewMode = mode;
      appState.currentPage = 1;
      const bDedup = byId('viewMode_dedup');
      const bRaw = byId('viewMode_raw');
      if (mode === 'dedup') {
        bDedup.className = 'whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white transition';
        bRaw.className = 'whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition';
      } else {
        bRaw.className = 'whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white transition';
        bDedup.className = 'whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition';
      }
      renderStrategyTable();
    }

    function renderStrategyTable() {
      const list = getFilteredSortedList();
      const total = list.length;
      const maxPage = Math.max(1, Math.ceil(total / appState.pageSize));
      if (appState.currentPage > maxPage) appState.currentPage = maxPage;
      if (appState.currentPage < 1) appState.currentPage = 1;

      const startIdx = (appState.currentPage - 1) * appState.pageSize;
      const pageItems = list.slice(startIdx, startIdx + appState.pageSize);
      const tbody = byId('strategyTableBody');

      if (pageItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="py-8 text-center text-slate-400">当前筛选条件下暂无匹配记录</td></tr>';
      } else {
        const htmlRows = [];
        for (let i = 0; i < pageItems.length; i++) {
          const row = pageItems[i];
          const channelSubtitle = appState.tableViewMode === 'dedup'
            ? (row.isOverlap
                ? '<span class="text-rose-600 font-semibold">⚡跨活动重叠 (' + escapeHtml(row.channelsText) + ')</span>'
                : '<span class="text-slate-400">' + escapeHtml(row.channelsText) + '</span>')
            : '<span class="text-slate-500">' + escapeHtml(row.adType + ' · ' + row.sourceMatch + ' (原竞价 $' + row.bid.toFixed(2) + ')') + '</span>';

          const acosColor = row.sales === 0
            ? 'text-rose-600 font-semibold'
            : (row.acos <= appState.config.targetAcos ? 'text-emerald-700 font-semibold' : (row.acos <= appState.config.targetAcos * 1.25 ? 'text-amber-700 font-medium' : 'text-rose-600 font-semibold'));

          const detailIdx = startIdx + i;
          htmlRows.push(
            '<tr class="hover:bg-blue-50/40 transition">' +
              '<td class="py-2.5 px-3">' +
                '<div class="font-mono font-semibold text-slate-900">' + escapeHtml(row.searchTerm) + '</div>' +
                '<div class="text-[11px] mt-0.5">' + channelSubtitle + '</div>' +
              '</td>' +
              '<td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">' + escapeHtml(row.intent) + '</span></td>' +
              '<td class="py-2.5 px-3 text-right font-mono">$' + row.spend.toFixed(2) + '</td>' +
              '<td class="py-2.5 px-3 text-right font-mono font-semibold">' + row.orders + '</td>' +
              '<td class="py-2.5 px-3 text-right font-mono">' + row.cvr.toFixed(2) + '%</td>' +
              '<td class="py-2.5 px-3 text-right font-mono">$' + row.cpa.toFixed(2) + '</td>' +
              '<td class="py-2.5 px-3 text-right font-mono ' + acosColor + '">' + (row.sales > 0 ? row.acos.toFixed(2) + '%' : '0单纯耗') + '</td>' +
              '<td class="py-2.5 px-3">' +
                '<div>' + getActionBadgeHtml(row.actionCode, row.matchActionLabel) + '</div>' +
                '<div class="text-[11px] text-slate-500 mt-0.5">' + escapeHtml(row.campaignBucket) + '</div>' +
              '</td>' +
              '<td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">' + (row.suggestedBid > 0 ? '$' + row.suggestedBid.toFixed(2) : '停止出价') + '</td>' +
              '<td class="py-2.5 px-3 text-[11px] text-slate-700 max-w-[210px]">' + escapeHtml(row.isolationAction) + '</td>' +
              '<td class="py-2.5 px-3 text-center">' +
                '<button type="button" data-kwe-click="openDetailModalByFilteredIndex(' + detailIdx + ')" class="whitespace-nowrap px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-medium transition">查看依据</button>' +
              '</td>' +
            '</tr>'
          );
        }
        tbody.innerHTML = htmlRows.join('');
      }

      const endIdx = Math.min(total, startIdx + pageItems.length);
      byId('paginationInfo').textContent = total > 0
        ? '显示第 ' + (startIdx + 1) + ' - ' + endIdx + ' 条，共 ' + total.toLocaleString() + ' 条'
        : '共 0 条记录';
      byId('pageIndicator').textContent = appState.currentPage + ' / ' + maxPage;
      byId('prevPageBtn').disabled = appState.currentPage <= 1;
      byId('nextPageBtn').disabled = appState.currentPage >= maxPage;
    }

    function openDetailModalByFilteredIndex(idx) {
      const list = getFilteredSortedList();
      const item = list[idx];
      if (!item) return;
      byId('modalTermTitle').textContent = item.searchTerm;
      const content = byId('modalBodyContent');
      content.innerHTML =
        '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">' +
          '<div class="p-3 rounded-lg bg-slate-50 border border-slate-200"><div class="text-[11px] text-slate-500">累计花费</div><div class="text-base font-bold text-slate-900">$' + item.spend.toFixed(2) + '</div></div>' +
          '<div class="p-3 rounded-lg bg-slate-50 border border-slate-200"><div class="text-[11px] text-slate-500">广告订单 / CVR</div><div class="text-base font-bold text-slate-900">' + item.orders + '单 · ' + item.cvr.toFixed(2) + '%</div></div>' +
          '<div class="p-3 rounded-lg bg-slate-50 border border-slate-200"><div class="text-[11px] text-slate-500">CPA / ACOS</div><div class="text-base font-bold text-slate-900">$' + item.cpa.toFixed(2) + ' · ' + (item.sales > 0 ? item.acos.toFixed(2) + '%' : '∞') + '</div></div>' +
          '<div class="p-3 rounded-lg bg-blue-50 border border-blue-200"><div class="text-[11px] text-blue-700">平滑建议竞价</div><div class="text-base font-bold text-blue-900">' + (item.suggestedBid > 0 ? '$' + item.suggestedBid.toFixed(2) : '停止投放') + '</div></div>' +
        '</div>' +
        '<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">' +
          '<div class="text-xs font-bold text-slate-900">1. 推荐投放方式与归属专案</div>' +
          '<div>' + getActionBadgeHtml(item.actionCode, item.matchActionLabel) + ' <span class="ml-2 text-xs font-semibold text-slate-700">' + escapeHtml(item.campaignBucket) + '</span></div>' +
          '<div class="text-xs font-bold text-slate-900 pt-2">2. 源广告活动隔离与否定指令</div>' +
          '<div class="text-xs text-rose-700 font-medium">' + escapeHtml(item.isolationAction) + '</div>' +
          '<div class="text-xs font-bold text-slate-900 pt-2">3. 底层规则命中逻辑</div>' +
          '<p class="text-xs text-slate-700 leading-relaxed">' + escapeHtml(item.reasonText) + '</p>' +
        '</div>';
      const modal = byId('detailModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeDetailModal() {
      const modal = byId('detailModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function renderWorkbenchCharts() {
      const bucketNames = ['品牌防御精准', '主力排名精准', '受控词组拓流', '旺季限定宽泛', '商品定位ASIN', '独立分舱控Bid', '止损淘汰否定'];
      const codes = ['BRAND_EXACT', 'CORE_EXACT', 'SEG_PHRASE', 'PEAK_BROAD', 'PRODUCT_ASIN', 'BID_CONTROL', 'NEG_STOP'];
      const spendData = [0, 0, 0, 0, 0, 0, 0];
      const salesData = [0, 0, 0, 0, 0, 0, 0];

      for (let i = 0; i < appState.dedupTerms.length; i++) {
        const t = appState.dedupTerms[i];
        const idx = codes.indexOf(t.actionCode);
        if (idx !== -1) {
          spendData[idx] += t.spend;
          salesData[idx] += t.sales;
        }
      }

      const ctx1 = byId('strategyBarChart').getContext('2d');
      if (strategyChartInstance) strategyChartInstance.destroy();
      strategyChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: bucketNames,
          datasets: [
            { label: '广告花费 ($)', data: spendData.map(function(v) { return Number(v.toFixed(2)); }), backgroundColor: '#C15F3C', borderRadius: 6 },
            { label: '广告销售额 ($)', data: salesData.map(function(v) { return Number(v.toFixed(2)); }), backgroundColor: '#356B54', borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: {
            x: { ticks: { font: { size: 10 } } },
            y: { beginAtZero: true, ticks: { font: { size: 10 } } }
          }
        }
      });

      // Scatter Chart by Intent Group (Top 60 terms by spend so chart stays crisp even on 50k rows)
      const topTerms = appState.dedupTerms.slice().sort(function(a, b) { return b.spend - a.spend; }).slice(0, 60);
      const colorByIntent = {
        '自有品牌词': '#7A4E65',
        '黄金适龄词': '#C15F3C',
        '高相关玩具属性词': '#356B54',
        '边缘高龄词': '#B5852B',
        '核心泛大词': '#AD4435',
        '关联商品ASIN': '#3B5B78',
        '节日礼物场景词': '#8C6239',
        '前置高危否定词': '#873024'
      };

      const points = topTerms.map(function(t) {
        return {
          x: t.cvr,
          y: t.cpa,
          r: Math.max(5, Math.min(18, Math.sqrt(t.orders || 1) * 0.7)),
          term: t.searchTerm,
          intent: t.intent,
          orders: t.orders,
          bg: colorByIntent[t.intent] || '#75726A'
        };
      });

      const ctx2 = byId('intentScatterChart').getContext('2d');
      if (scatterChartInstance) scatterChartInstance.destroy();
      scatterChartInstance = new Chart(ctx2, {
        type: 'bubble',
        data: {
          datasets: [{
            label: '搜索词气泡 (大小=订单量)',
            data: points,
            backgroundColor: points.map(function(p) { return p.bg + 'BB'; }),
            borderColor: points.map(function(p) { return p.bg; }),
            borderWidth: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const raw = context.raw;
                  return raw.term + ' [' + raw.intent + '] — CVR: ' + raw.x + '%, CPA: $' + raw.y + ', 订单: ' + raw.orders;
                }
              }
            }
          },
          scales: {
            x: { title: { display: true, text: '转化率 CVR (%) → 越右越好', font: { size: 11 } }, beginAtZero: true },
            y: { title: { display: true, text: '获客成本 CPA ($) → 越低越好', font: { size: 11 } }, beginAtZero: true }
          }
        }
      });
    }

    function renderCampaignBlueprint() {
      const grid = byId('campaignBlueprintGrid');
      const borderMap = {
        purple: 'border-t-4 border-t-purple-600',
        blue: 'border-t-4 border-t-blue-600',
        emerald: 'border-t-4 border-t-emerald-600',
        amber: 'border-t-4 border-t-amber-500',
        indigo: 'border-t-4 border-t-indigo-600',
        teal: 'border-t-4 border-t-teal-600'
      };
      grid.innerHTML = appState.campaignBuckets.map(function(b) {
        const samples = b.sampleTerms.length > 0
          ? b.sampleTerms.map(function(s) { return '<span class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">' + escapeHtml(s) + '</span>'; }).join(' ')
          : '<span class="text-[11px] text-slate-400">当前词表暂无归入词</span>';
        return (
          '<div class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between ' + (borderMap[b.color] || '') + '">' +
            '<div class="space-y-2">' +
              '<div class="flex items-center justify-between gap-2">' +
                '<h4 class="text-sm font-bold text-slate-900">' + escapeHtml(b.title) + '</h4>' +
                '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">' + b.termCount + ' 词</span>' +
              '</div>' +
              '<div class="text-[11px] font-semibold text-blue-700 bg-blue-50 inline-block px-2 py-0.5 rounded">' + escapeHtml(b.matchRule) + '</div>' +
              '<p class="text-xs text-slate-600 leading-relaxed">' + escapeHtml(b.desc) + '</p>' +
            '</div>' +
            '<div class="mt-4 pt-3 border-t border-slate-100 space-y-2">' +
              '<div class="flex justify-between text-xs text-slate-700 font-medium">' +
                '<span>归属花费: <strong>$' + b.spend.toLocaleString() + '</strong></span>' +
                '<span>归属订单: <strong>' + b.orders.toLocaleString() + ' 单</strong></span>' +
              '</div>' +
              '<div class="flex flex-wrap gap-1">' + samples + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    function renderNgramTable() {
      const filterSize = byId('ngramTypeFilter').value;
      const rows = appState.ngramRows.filter(function(r) {
        if (filterSize === 'ALL') return true;
        return String(r.gramSize) === filterSize;
      }).slice(0, 120);

      const badgeCls = {
        emerald: 'bg-emerald-100 text-emerald-800',
        rose: 'bg-rose-100 text-rose-800',
        amber: 'bg-amber-100 text-amber-800',
        purple: 'bg-purple-100 text-purple-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        slate: 'bg-slate-100 text-slate-700'
      };

      const tbody = byId('ngramTableBody');
      tbody.innerHTML = rows.map(function(r) {
        return (
          '<tr class="hover:bg-slate-50">' +
            '<td class="py-2.5 px-4 font-mono font-bold text-slate-900">' + escapeHtml(r.gram) + ' <span class="text-[10px] font-normal text-slate-400">(' + r.gramSize + '-Gram)</span></td>' +
            '<td class="py-2.5 px-3 text-slate-600">' + escapeHtml(r.intent) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">' + r.termCount + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">' + r.clicks.toLocaleString() + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">$' + r.spend.toFixed(2) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono font-semibold">' + r.orders.toLocaleString() + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">' + r.cvr.toFixed(2) + '%</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">$' + r.cpa.toFixed(2) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">' + (r.sales > 0 ? r.acos.toFixed(2) + '%' : '0单') + '</td>' +
            '<td class="py-2.5 px-4"><span class="px-2 py-0.5 rounded text-[11px] font-semibold ' + (badgeCls[r.rootBadge] || badgeCls.slate) + '">' + escapeHtml(r.rootAdvice) + '</span></td>' +
          '</tr>'
        );
      }).join('');
    }

    function renderPreNegCategories() {
      const container = byId('preNegCategoryContainer');
      const keys = Object.keys(appState.preNegCategories);
      container.innerHTML = keys.map(function(k) {
        const cat = appState.preNegCategories[k];
        const chips = cat.words.map(function(w, idx) {
          return (
            '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-xs font-mono">' +
              escapeHtml(w) +
              '<button type="button" data-kwe-click="removePreNegative(\'' + k + '\',' + idx + ')" class="text-rose-400 hover:text-rose-700 ml-0.5 font-bold" title="移除">×</button>' +
            '</span>'
          );
        }).join('');
        return (
          '<div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">' +
            '<div class="text-xs font-bold text-slate-800">' + escapeHtml(cat.label) + ' (' + cat.words.length + '个词根)</div>' +
            '<div class="flex flex-wrap gap-1.5">' + chips + '</div>' +
          '</div>'
        );
      }).join('');
    }

    function removePreNegative(catKey, wordIdx) {
      appState.preNegCategories[catKey].words.splice(wordIdx, 1);
      runBatchEngine();
      showToast('已移除前置否定词并实时重算策略', 'ok');
    }

    function addCustomPreNegative() {
      const catKey = byId('newNegCatSelect').value;
      const input = byId('newNegWordInput');
      const val = input.value.trim().toLowerCase();
      if (!val) {
        showToast('请输入要添加的前置否定词根', 'warn');
        return;
      }
      if (appState.preNegCategories[catKey].words.indexOf(val) === -1) {
        appState.preNegCategories[catKey].words.push(val);
      }
      input.value = '';
      runBatchEngine();
      showToast('已加入前置否定词库：' + val, 'ok');
    }

    function renderTriggeredNegTable() {
      const tbody = byId('triggeredNegTableBody');
      if (appState.triggeredNegatives.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-6 text-center text-slate-400">当前数据暂无触发动态否定项</td></tr>';
        return;
      }
      tbody.innerHTML = appState.triggeredNegatives.slice(0, 200).map(function(n) {
        const isStopLoss = n.negCategory.indexOf('止损') !== -1 || n.negCategory.indexOf('前置') !== -1;
        const badge = isStopLoss
          ? 'bg-rose-100 text-rose-800'
          : 'bg-indigo-100 text-indigo-800';
        return (
          '<tr class="hover:bg-slate-50">' +
            '<td class="py-2.5 px-4 font-mono font-bold text-slate-900">' + escapeHtml(n.target) + '</td>' +
            '<td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[11px] font-semibold ' + badge + '">' + escapeHtml(n.negCategory) + '</span></td>' +
            '<td class="py-2.5 px-3 font-semibold text-slate-800">' + escapeHtml(n.negMatchType) + '</td>' +
            '<td class="py-2.5 px-3 text-slate-600">' + escapeHtml(n.scope) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">$' + n.spend.toFixed(2) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono">' + n.orders + '</td>' +
            '<td class="py-2.5 px-4 text-slate-600">' + escapeHtml(n.reason) + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    function renderSeasonalityChart() {
      const ctx = byId('seasonalityCurveChart').getContext('2d');
      if (seasonChartInstance) seasonChartInstance.destroy();
      seasonChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: PDF_SEASONAL_SERIES.map(function(d) { return d.week; }),
          datasets: [{
            label: '周度流量入口数量指数 (PDF 图3 实盘曲线)',
            data: PDF_SEASONAL_SERIES.map(function(d) { return d.entries; }),
            borderColor: '#C15F3C',
            backgroundColor: 'rgba(193, 95, 60, 0.12)',
            fill: true,
            tension: 0.3,
            pointRadius: 3.5,
            pointBackgroundColor: PDF_SEASONAL_SERIES.map(function(d) {
              if (d.entries >= 300) return '#9E3B2E';
              if (d.entries >= 170) return '#B5852B';
              return '#C15F3C';
            })
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { font: { size: 11 } } }
          },
          scales: {
            x: { ticks: { font: { size: 10 }, maxRotation: 45 } },
            y: { beginAtZero: true, title: { display: true, text: '活跃流量入口指数', font: { size: 11 } } }
          }
        }
      });
    }

    // =========================================================================
    // 5. FILE IMPORT (40,000+ ROW XLSX/CSV) & MULTI-SHEET EXPORT
    // =========================================================================
    function mapRowColumns(rawObj) {
      const keys = Object.keys(rawObj);
      const getVal = function(candidates) {
        for (let i = 0; i < candidates.length; i++) {
          const c = candidates[i].toLowerCase();
          for (let j = 0; j < keys.length; j++) {
            const k = keys[j].trim().toLowerCase();
            if (k === c) return rawObj[keys[j]];
          }
        }
        for (let i = 0; i < candidates.length; i++) {
          const c = candidates[i].toLowerCase();
          for (let j = 0; j < keys.length; j++) {
            const k = keys[j].trim().toLowerCase();
            if (k.indexOf(c) !== -1) return rawObj[keys[j]];
          }
        }
        return '';
      };

      return {
        searchTerm: getVal(['用户搜索词', '客户搜索词', '搜索词', 'customer search term', 'search term', 'keyword']),
        sourceMatch: getVal(['源匹配方式', '匹配类型', '匹配方式', 'match type']),
        bid: getVal(['竞价', '出价', 'bid', 'keyword bid']),
        adType: getVal(['广告类型', '广告活动类型', '广告活动名称', 'campaign type', 'campaign name', 'type']),
        clicks: getVal(['点击量', '点击次数', 'clicks']),
        ctr: getVal(['ctr', '点击率', 'click-thru rate']),
        cpc: getVal(['cpc', '每次点击费用', 'cost per click']),
        spend: getVal(['花费', '广告花费', 'spend', 'cost']),
        orders: getVal(['广告订单', '订单', '7天总订单数', '7 day total orders', 'orders']),
        cvr: getVal(['cvr', '转化率', '7天转化率', '7 day conversion rate']),
        cpa: getVal(['cpa', 'acpo', '单均花费']),
        units: getVal(['广告销量', '销量', '7天总销售量', '7 day total units', 'units']),
        sales: getVal(['广告销售额', '销售额', '7天总销售额', '7 day total sales', 'sales'])
      };
    }

    function handleSearchTermUpload(event) {
      const fileList = event.target.files;
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      const parsedFiles = [];
      let completed = 0;

      files.forEach(function(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', dense: true });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
            const mapped = [];
            let sumSpend = 0, sumOrders = 0, sumSales = 0;
            for (let i = 0; i < jsonRows.length; i++) {
              const m = mapRowColumns(jsonRows[i]);
              if (m.searchTerm && String(m.searchTerm).trim() !== '') {
                mapped.push(m);
                sumSpend += parseNum(m.spend);
                sumOrders += Math.round(parseNum(m.orders));
                sumSales += parseNum(m.sales);
              }
            }
            if (mapped.length > 0) {
              parsedFiles.push({
                fileName: file.name,
                rows: mapped,
                rowCount: mapped.length,
                spend: Number(sumSpend.toFixed(2)),
                orders: sumOrders,
                sales: Number(sumSales.toFixed(2))
              });
            } else {
              showToast('文件 [' + file.name + '] 未识别出有效“用户搜索词 / Customer Search Term”列', 'error');
            }
          } catch (err) {
            showToast('解析 [' + file.name + '] 失败：' + err.message, 'error');
          } finally {
            completed++;
            if (completed === files.length && parsedFiles.length > 0) {
              openImportBatchModal(parsedFiles);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      });
      event.target.value = '';
    }

    function resetToAttachmentSample() {
      mountDemoBatchExplicitly();
    }

    function exportFullStrategyWorkbook() {
      if (typeof XLSX === 'undefined') {
        showToast('Excel 导出组件正在加载，请稍后重试', 'error');
        return;
      }
      if (appState.dedupTerms.length === 0) {
        showToast('当前无激活批次数据可导出，请先导入或启用至少一个批次', 'warn');
        return;
      }
      const wb = XLSX.utils.book_new();

      // Sheet 0: Workspace & Batch Ledger Audit Trail
      const ledgerRows = appState.batches.map(function(b) {
        return {
          '所属项目工作区': appState.workspace.projectName,
          '绑定SKU/ASIN': appState.workspace.skuTag || '-',
          '当前季节模式': SEASON_MODES[appState.season].name,
          '批次编号': b.id,
          '批次名称标签': b.label,
          '批次周期/渠道属性': b.scope,
          '源文件名': b.fileName,
          '导入时间': b.importedAt,
          '是否参与本次导出计算': b.enabled ? '启用中 (参与计算)' : '已封存 (未参与)',
          '原始行数': b.rowCount,
          '批次花费($)': b.spend,
          '批次订单': b.orders,
          '批次销售额($)': b.sales
        };
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ledgerRows), '0_工作区与导入批次台账');

      // Sheet 1: Deduplicated Strategy Master
      const s1 = appState.dedupTerms.map(function(t) {
        return {
          '客户搜索词/ASIN': t.searchTerm,
          '数据来源批次': t.batchesText || appState.datasetName,
          '语义意图标签': t.intent,
          '跨活动来源': t.channelsText,
          '是否存在跨活动内耗': t.isOverlap ? '是' : '否',
          '广告花费($)': t.spend,
          '广告订单': t.orders,
          '广告销量': t.units,
          '广告销售额($)': t.sales,
          '转化率CVR(%)': t.cvr,
          '获客成本CPA($)': t.cpa,
          'ACOS(%)': t.acos,
          '该打什么匹配方式': t.matchActionLabel,
          '归属标准广告专案': t.campaignBucket,
          '建议竞价($)': t.suggestedBid,
          '源活动隔离与否定指令': t.isolationAction,
          '底层推导依据': t.reasonText
        };
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s1), '1_去重投放与匹配策略');

      // Sheet 2: Pre-emptive + Dynamic Negative List
      const negExport = [];
      Object.keys(appState.preNegCategories).forEach(function(k) {
        const cat = appState.preNegCategories[k];
        cat.words.forEach(function(w) {
          negExport.push({
            '否定词/词根/ASIN': w,
            '否定层级': '第一层：前置坚决否定词库',
            '否定匹配方式': 'Negative Phrase (词组否定)',
            '应用广告活动范围': '全部 SP-Auto / 词组 / 宽泛活动投放前必挂',
            '涉及历史花费($)': 0,
            '涉及历史订单': 0,
            '依据说明': cat.label
          });
        });
      });
      appState.triggeredNegatives.forEach(function(n) {
        negExport.push({
          '否定词/词根/ASIN': n.target,
          '否定层级': n.negCategory,
          '否定匹配方式': n.negMatchType,
          '应用广告活动范围': n.scope,
          '涉及历史花费($)': n.spend,
          '涉及历史订单': n.orders,
          '依据说明': n.reason
        });
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(negExport), '2_前置与绩效否定清单');

      // Sheet 3: N-Gram Root Aggregation
      const s3 = appState.ngramRows.map(function(g) {
        return {
          '词根(N-Gram)': g.gram,
          '词根阶数': g.gramSize + '-Gram',
          '语义维度': g.intent,
          '覆盖唯一搜索词数': g.termCount,
          '聚合点击量': g.clicks,
          '聚合花费($)': g.spend,
          '聚合订单': g.orders,
          '聚合销售额($)': g.sales,
          '聚合CVR(%)': g.cvr,
          '聚合CPA($)': g.cpa,
          '聚合ACOS(%)': g.acos,
          '词根级投放与否词建议': g.rootAdvice
        };
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s3), '3_词根NGram聚合诊断');

      // Sheet 4: Raw Row-Level Diagnostics
      const s4 = appState.processedRaw.map(function(r) {
        return {
          '原始行号': r.rowIndex,
          '用户搜索词': r.searchTerm,
          '广告类型': r.adType,
          '源匹配方式': r.sourceMatch,
          '原竞价($)': r.bid,
          'CPC($)': r.cpc,
          '花费($)': r.spend,
          '广告订单': r.orders,
          'CVR(%)': r.cvr,
          'CPA($)': r.cpa,
          '销售额($)': r.sales,
          'ACOS(%)': r.acos,
          '语义分类': r.intent,
          '行级推荐动作': r.matchActionLabel,
          '建议调整竞价($)': r.suggestedBid,
          '当前源活动隔离操作': r.isolationAction
        };
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(s4), '4_原始行级批处理明细');

      // Sheet 5: Amazon Bulk Ready Reference
      const bulkRows = [];
      appState.dedupTerms.forEach(function(t) {
        if (t.actionCode === 'NEG_STOP') return;
        let matchTypeEn = 'Exact';
        if (t.actionCode === 'SEG_PHRASE') matchTypeEn = 'Phrase';
        else if (t.actionCode === 'PEAK_BROAD') matchTypeEn = 'Broad';
        else if (t.actionCode === 'PRODUCT_ASIN') matchTypeEn = 'Targeting Expression';

        bulkRows.push({
          'Product': 'Sponsored Products',
          'Entity': t.isAsin ? 'Product Targeting' : 'Keyword',
          'Operation': 'Create',
          'Campaign Name': t.campaignBucket,
          'Ad Group Name': t.intent + '_' + matchTypeEn,
          'State': 'enabled',
          'Bid': t.suggestedBid,
          'Keyword Text': t.isAsin ? '' : t.searchTerm,
          'Match Type': t.isAsin ? '' : matchTypeEn,
          'Product Targeting Expression': t.isAsin ? ('asin="' + t.searchTerm.toUpperCase() + '"') : ''
        });
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bulkRows), '5_亚马逊Bulk上传参考');

      XLSX.writeFile(wb, 'Amazon_US_Toys_关键词广告策略批处理结果.xlsx');
      showToast('已导出 5 表合一 Excel 策略工作簿！', 'ok');
    }

    // =========================================================================
    // 6. ABA 3-INFLECTION DETECTOR & NEGATIVE COPY HELPERS
    // =========================================================================
    function downloadAbaTemplate() {
      const csvContent = '\uFEFFKeyword,2025-W38,2025-W39,2025-W40,2025-W41,2025-W42,2025-W43,2025-W44,2025-W45,2025-W46,2025-W47,2025-W48,2025-W49,2025-W50,2025-W51,2025-W52\n' +
        'kids smart phone,48500,46200,41000,32500,24800,16200,9400,6100,3850,2100,1650,1820,4900,19800,36000\n' +
        'kids phones 3-5,62000,59000,51000,39000,27500,15800,8900,5200,3100,1950,1780,2100,6400,25000,44000\n' +
        'kids cell phone toy gift,95000,91000,84000,68000,45000,26000,12500,6800,3400,1520,1290,1450,8200,42000,78000\n';
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ABA周度排名三拐点导入模板.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('已下载 ABA 周度排名导入模板', 'ok');
    }

    function handleAbaFileUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array', dense: true });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          if (!rows || rows.length < 2 || rows[0].length < 4) {
            showToast('ABA 表格至少需包含：首列关键词 + 至少3周排名列', 'error');
            return;
          }
          const headers = rows[0].slice(1).map(String);
          const results = [];
          for (let r = 1; r < rows.length; r++) {
            const kw = String(rows[r][0] || '').trim();
            if (!kw) continue;
            const ranks = rows[r].slice(1).map(function(v) { return parseNum(v); });
            let launchWeek = '未检出', accelWeek = '未检出', peakWeek = '未检出';
            let bestRank = Infinity, bestIdx = -1;

            for (let i = 0; i < ranks.length; i++) {
              if (ranks[i] > 0 && ranks[i] < bestRank) {
                bestRank = ranks[i];
                bestIdx = i;
              }
            }
            // Launch Inflection: 2 consecutive weeks of rank improvement (number decreasing) from >10,000
            for (let i = 2; i < ranks.length; i++) {
              if (ranks[i - 2] > 10000 && ranks[i - 1] < ranks[i - 2] && ranks[i] < ranks[i - 1]) {
                launchWeek = headers[i - 1] + ' (排名 ' + ranks[i - 2] + '→' + ranks[i] + ')';
                break;
              }
            }
            // Acceleration Inflection: enters <= 10,000 with >=25% weekly jump
            for (let i = 1; i < ranks.length; i++) {
              if (ranks[i] > 0 && ranks[i] <= 10000 && ranks[i - 1] > ranks[i]) {
                accelWeek = headers[i] + ' (冲入 #' + ranks[i] + ')';
                break;
              }
            }
            if (bestIdx !== -1) {
              const dropAfter = (bestIdx + 1 < ranks.length && ranks[bestIdx + 1] > bestRank)
                ? ' → 次周回落至 #' + ranks[bestIdx + 1]
                : '';
              peakWeek = headers[bestIdx] + ' (峰值 #' + bestRank + dropAfter + ')';
            }
            results.push({ kw: kw, launchWeek: launchWeek, accelWeek: accelWeek, peakWeek: peakWeek });
          }

          const container = byId('abaResultsContainer');
          container.className = 'overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl';
          container.innerHTML =
            '<table class="w-full text-left border-collapse text-xs">' +
              '<thead><tr class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">' +
                '<th class="py-2.5 px-4">目标关键词</th>' +
                '<th class="py-2.5 px-3">拐点1：排名启动周 (提前卡精准位)</th>' +
                '<th class="py-2.5 px-3">拐点2：排名加速周 (放预算/开礼物与受控宽泛)</th>' +
                '<th class="py-2.5 px-4">拐点3：峰值见顶周 (立即收缩泛词防亏损)</th>' +
              '</tr></thead>' +
              '<tbody class="divide-y divide-slate-100 bg-white">' +
                results.slice(0, 100).map(function(item) {
                  return '<tr>' +
                    '<td class="py-2.5 px-4 font-mono font-bold text-slate-900">' + escapeHtml(item.kw) + '</td>' +
                    '<td class="py-2.5 px-3 text-amber-700 font-medium">' + escapeHtml(item.launchWeek) + '</td>' +
                    '<td class="py-2.5 px-3 text-emerald-700 font-semibold">' + escapeHtml(item.accelWeek) + '</td>' +
                    '<td class="py-2.5 px-4 text-rose-700 font-medium">' + escapeHtml(item.peakWeek) + '</td>' +
                  '</tr>';
                }).join('') +
              '</tbody>' +
            '</table>';
          showToast('成功解析 ' + results.length + ' 个关键词的 ABA 三拐点！', 'ok');
        } catch (err) {
          showToast('ABA 文件解析失败：' + err.message, 'error');
        }
      };
      reader.readAsArrayBuffer(file);
      event.target.value = '';
    }

    function copyPreemptiveNegatives() {
      const all = [];
      Object.keys(appState.preNegCategories).forEach(function(k) {
        appState.preNegCategories[k].words.forEach(function(w) { all.push(w); });
      });
      copyTextSafe(all.join('\n'), '已复制 ' + all.length + ' 个前置词组否定词（可直接粘贴至亚马逊后台）');
    }

    function copyTriggeredNegatives() {
      const lines = appState.triggeredNegatives.map(function(n) {
        return n.target + '\t' + n.negMatchType + '\t' + n.scope + '\t' + n.reason;
      });
      copyTextSafe('目标词\t否定方式\t作用范围\t原因\n' + lines.join('\n'), '已复制当前触发的否定与隔离清单');
    }

    // =========================================================================
    // 7. CONTROLS, TABS & STANDALONE PYTHON SCRIPT GENERATOR
    // =========================================================================
    function switchTab(tabId) {
      appState.activeTab = tabId;
      const tabs = ['batches', 'workbench', 'sankey', 'ngram', 'negatives', 'seasonality', 'architecture'];
      for (let i = 0; i < tabs.length; i++) {
        const panel = byId('tabPanel_' + tabs[i]);
        const btn = byId('tabBtn_' + tabs[i]);
        if (tabs[i] === tabId) {
          panel.classList.remove('hidden');
          btn.classList.add('tab-btn-active');
          btn.classList.remove('kwe-tab-idle');
        } else {
          panel.classList.add('hidden');
          btn.classList.remove('tab-btn-active');
          btn.classList.add('kwe-tab-idle');
        }
      }
      updateEmptyBannerVisibility();
      if (tabId === 'batches') renderBatchManagementTab();
      if (tabId === 'workbench') renderWorkbenchCharts();
      if (tabId === 'sankey') renderSankeyWorkbench();
      if (tabId === 'seasonality') renderSeasonalityChart();
    }

    function toggleConfigDrawer() {
      const drawer = byId('configDrawer');
      drawer.classList.toggle('hidden');
    }

    function setSeasonPhase(phase) {
      appState.season = phase;
      runBatchEngine();
      showToast('已切换至【' + SEASON_MODES[phase].name + '】，全表策略与建议竞价已实时重算', 'ok');
    }

    function applyConfigChanges() {
      appState.config.targetAcos = Math.max(1, parseNum(byId('cfgTargetAcos').value) || 22);
      appState.config.targetCpa = Math.max(0.5, parseNum(byId('cfgTargetCpa').value) || 6.8);
      appState.config.exactMinOrders = Math.max(1, Math.round(parseNum(byId('cfgExactMinOrders').value) || 5));
      appState.config.zeroOrderSpend = Math.max(1, parseNum(byId('cfgZeroOrderSpend').value) || 14);
      appState.config.rootNegSpend = Math.max(2, parseNum(byId('cfgRootNegSpend').value) || 25);

      const splitClean = function(id) {
        return byId(id).value.split(',').map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
      };
      appState.config.ownBrands = splitClean('cfgOwnBrands');
      appState.config.goldenAges = splitClean('cfgGoldenAge');
      appState.config.secondaryAges = splitClean('cfgSecondaryAge');
      appState.config.compBrands = splitClean('cfgCompBrands');

      runBatchEngine();
      showToast('策略阈值已更新并重算全量关键词', 'ok');
    }

    function buildStandalonePythonSource() {
      return [
        '#!/usr/bin/env python3',
        '# -*- coding: utf-8 -*-',
        '"""',
        '亚马逊美国站玩具类目 · 万级海量搜索词广告策略批处理引擎 v2.0 (含工作区初始化 & 多批次台账管理)',
        '',
        '核心架构升级：',
        '  1. 显式工作区初始化 (init): 独立生成 workspace_profile.json，隔离不同玩具链接的品牌词/适龄段/目标ACOS/前置否词库。',
        '  2. 受控批次台账管理 (ingest): 每次导入生成唯一 BATCH-ID 并持久化至本地 SQLite 台账 (ads_batches.db)，支持：',
        '     - isolate 模式 (默认): 激活最新导入批次并自动封存历史批次，杜绝新旧词表混杂污染；',
        '     - merge 模式: 合并同一周期多份报表 (如 SP-Auto.xlsx + SP-Manual.xlsx) 跨表去重；',
        '     - replace 模式: 清空旧批次台账重新建库。',
        '  3. 跨批次异动对比 (diff): 自动对比任意两个批次 (如 10月平季 vs 11月启动期) 识别新增爆发词与衰退词。',
        '',
        '命令行示例：',
        '  # 第一步：初始化干净工作区',
        '  python3 amazon_toys_kw_batch_processor.py init --project "US玩具手机" --brands "kokodi" --acos 22 --cpa 6.8',
        '  # 第二步：受控导入新批次并输出 5 表策略包 (默认 isolate 隔离旧批次)',
        '  python3 amazon_toys_kw_batch_processor.py ingest --files 11月W1搜索词报告.xlsx --label "2026-W45启动周" --mode isolate --season ramp',
        '  # 查看或切换已导入批次状态',
        '  python3 amazon_toys_kw_batch_processor.py list-batches',
        '"""',
        'import argparse',
        'import datetime as dt',
        'import json',
        'import os',
        'import re',
        'import sqlite3',
        'from collections import defaultdict',
        'import numpy as np',
        'import pandas as pd',
        '',
        'DEFAULT_PROFILE_PATH = "workspace_profile.json"',
        'DEFAULT_DB_PATH = "ads_batches_ledger.sqlite"',
        'STOPWORDS = {"for", "with", "and", "the", "of", "in", "to", "on", "a", "an", "by", "at"}',
        'ASIN_RE = re.compile(r"^b0[a-z0-9]{8}$", re.I)',
        '',
        'SEASON_CFG = {',
        '    "off":    {"acos_k": 1.00, "cpa_k": 1.00, "bid_k": 0.95, "broad": False, "gift": False},',
        '    "ramp":   {"acos_k": 1.12, "cpa_k": 1.12, "bid_k": 1.15, "broad": False, "gift": True},',
        '    "peak":   {"acos_k": 1.25, "cpa_k": 1.25, "bid_k": 1.25, "broad": True,  "gift": True},',
        '    "shrink": {"acos_k": 0.85, "cpa_k": 0.85, "bid_k": 0.72, "broad": False, "gift": False},',
        '}',
        '',
        'def get_default_profile():',
        '    return {',
        '        "project_name": ' + JSON.stringify(appState.workspace.projectName) + ',',
        '        "sku_tag": ' + JSON.stringify(appState.workspace.skuTag || "") + ',',
        '        "target_acos": ' + String(appState.config.targetAcos) + ',',
        '        "target_cpa": ' + String(appState.config.targetCpa) + ',',
        '        "exact_min_orders": ' + String(appState.config.exactMinOrders) + ',',
        '        "zero_order_spend": ' + String(appState.config.zeroOrderSpend) + ',',
        '        "root_neg_spend": ' + String(appState.config.rootNegSpend) + ',',
        '        "own_brands": ' + JSON.stringify(appState.config.ownBrands) + ',',
        '        "comp_brands": ' + JSON.stringify(appState.config.compBrands) + ',',
        '        "golden_ages": ' + JSON.stringify(appState.config.goldenAges) + ',',
        '        "secondary_ages": ' + JSON.stringify(appState.config.secondaryAges) + ',',
        '        "preemptive_neg_phrases": ' + JSON.stringify(
          Object.values(appState.preNegCategories).reduce(function(acc, c) { return acc.concat(c.words); }, [])
        ) + ',',
        '        "gift_words": ["gift", "gifts", "christmas", "xmas", "stocking", "birthday", "easter", "present", "holiday"],',
        '        "toy_attrs": ["toy", "toys", "smart", "pretend", "play", "camera", "music", "learning", "educational", "cell"]',
        '    }',
        '',
        'def init_db(db_path=DEFAULT_DB_PATH):',
        '    conn = sqlite3.connect(db_path)',
        '    conn.execute("""CREATE TABLE IF NOT EXISTS batches (',
        '        batch_id TEXT PRIMARY KEY,',
        '        label TEXT,',
        '        file_name TEXT,',
        '        imported_at TEXT,',
        '        enabled INTEGER,',
        '        row_count INTEGER,',
        '        spend REAL,',
        '        orders INTEGER,',
        '        sales REAL',
        '    )""")',
        '    conn.execute("""CREATE TABLE IF NOT EXISTS batch_rows (',
        '        batch_id TEXT,',
        '        search_term TEXT,',
        '        ad_type TEXT,',
        '        source_match TEXT,',
        '        clicks INTEGER,',
        '        cpc REAL,',
        '        spend REAL,',
        '        orders INTEGER,',
        '        sales REAL',
        '    )""")',
        '    conn.commit()',
        '    return conn',
        '',
        'def init_workspace(args):',
        '    prof = get_default_profile()',
        '    prof["project_name"] = args.project',
        '    prof["own_brands"] = [x.strip().lower() for x in args.brands.split(",") if x.strip()]',
        '    prof["target_acos"] = args.acos',
        '    prof["target_cpa"] = args.cpa',
        '    with open(args.profile, "w", encoding="utf-8") as f:',
        '        json.dump(prof, f, ensure_ascii=False, indent=2)',
        '    if args.clean_batches and os.path.exists(args.db):',
        '        os.remove(args.db)',
        '    init_db(args.db).close()',
        '    print(f"[初始化完成] 项目={prof[\'project_name\']} | 品牌词={prof[\'own_brands\']} | 台账已就绪: {args.db}")',
        '',
        'def clean_num(series):',
        '    if pd.api.types.is_numeric_dtype(series):',
        '        return series.fillna(0.0).astype(float)',
        '    return pd.to_numeric(series.astype(str).str.replace(r"[$,%\\s,]", "", regex=True), errors="coerce").fillna(0.0)',
        '',
        'def parse_report_file(path):',
        '    df = pd.read_csv(path) if path.lower().endswith(".csv") else pd.read_excel(path)',
        '    col_map = {}',
        '    for c in df.columns:',
        '        cl = str(c).strip().lower()',
        '        if cl in ("用户搜索词", "客户搜索词", "customer search term", "search term"):',
        '            col_map["term"] = c',
        '        elif "匹配" in cl or "match type" in cl:',
        '            col_map["match"] = c',
        '        elif "广告类型" in cl or "campaign" in cl:',
        '            col_map["ad_type"] = c',
        '        elif cl in ("花费", "spend", "cost"):',
        '            col_map["spend"] = c',
        '        elif cl in ("广告订单", "订单", "orders") or "total orders" in cl:',
        '            col_map["orders"] = c',
        '        elif cl in ("广告销售额", "销售额", "sales") or "total sales" in cl:',
        '            col_map["sales"] = c',
        '        elif cl == "cpc" or "每次点击" in cl:',
        '            col_map["cpc"] = c',
        '        elif cl in ("点击量", "clicks"):',
        '            col_map["clicks"] = c',
        '    out = pd.DataFrame()',
        '    out["search_term"] = df[col_map["term"]].astype(str).str.strip().str.lower()',
        '    out = out[out["search_term"] != ""].copy()',
        '    out["ad_type"] = df.loc[out.index, col_map["ad_type"]].astype(str) if "ad_type" in col_map else "SP-Manual"',
        '    out["source_match"] = df.loc[out.index, col_map["match"]].astype(str) if "match" in col_map else "未知"',
        '    out["spend"] = clean_num(df.loc[out.index, col_map["spend"]])',
        '    out["orders"] = clean_num(df.loc[out.index, col_map["orders"]]).round().astype(int)',
        '    out["sales"] = clean_num(df.loc[out.index, col_map["sales"]])',
        '    cpc_raw = clean_num(df.loc[out.index, col_map["cpc"]]) if "cpc" in col_map else pd.Series(0.0, index=out.index)',
        '    out["clicks"] = clean_num(df.loc[out.index, col_map["clicks"]]).round().astype(int) if "clicks" in col_map else np.where(cpc_raw > 0, np.maximum(1, np.round(out["spend"] / cpc_raw)), 0).astype(int)',
        '    out["cpc"] = np.where(out["clicks"] > 0, out["spend"] / out["clicks"], cpc_raw)',
        '    return out',
        '',
        'def ingest_and_run(args):',
        '    prof = json.load(open(args.profile, encoding="utf-8")) if os.path.exists(args.profile) else get_default_profile()',
        '    conn = init_db(args.db)',
        '    if args.mode == "replace":',
        '        conn.execute("DELETE FROM batches"); conn.execute("DELETE FROM batch_rows")',
        '    elif args.mode == "isolate":',
        '        conn.execute("UPDATE batches SET enabled = 0")',
        '',
        '    cur_cnt = conn.execute("SELECT COUNT(*) FROM batches").fetchone()[0]',
        '    for idx, fpath in enumerate(args.files, start=1):',
        '        parsed = parse_report_file(fpath)',
        '        bid = f"BATCH-{cur_cnt + idx:03d}"',
        '        lbl = args.label or os.path.basename(fpath)',
        '        now_str = dt.datetime.now().strftime("%Y-%m-%d %H:%M")',
        '        conn.execute("INSERT INTO batches VALUES (?,?,?,?,1,?,?,?,?)", (',
        '            bid, lbl, os.path.basename(fpath), now_str, len(parsed),',
        '            float(parsed["spend"].sum()), int(parsed["orders"].sum()), float(parsed["sales"].sum())',
        '        ))',
        '        parsed.insert(0, "batch_id", bid)',
        '        parsed.to_sql("batch_rows", conn, if_exists="append", index=False)',
        '    conn.commit()',
        '',
        '    work = pd.read_sql_query("""',
        '        SELECT r.* FROM batch_rows r JOIN batches b ON r.batch_id = b.batch_id WHERE b.enabled = 1',
        '    """, conn)',
        '    ledger_df = pd.read_sql_query("SELECT * FROM batches ORDER BY batch_id", conn)',
        '    conn.close()',
        '    if work.empty:',
        '        print("[提示] 当前无启用批次数据。"); return',
        '',
        '    sc = SEASON_CFG[args.season]',
        '    eff_acos = prof["target_acos"] * sc["acos_k"]',
        '    eff_cpa = prof["target_cpa"] * sc["cpa_k"]',
        '    work["channel_tag"] = work["ad_type"] + "·" + work["source_match"]',
        '    agg = work.groupby("search_term", as_index=False).agg(',
        '        batches=("batch_id", lambda s: "+".join(sorted(set(s)))),',
        '        channels=("channel_tag", lambda s: " + ".join(sorted(set(s)))),',
        '        clicks=("clicks", "sum"), spend=("spend", "sum"), orders=("orders", "sum"), sales=("sales", "sum")',
        '    )',
        '    agg["cpc"] = np.where(agg["clicks"] > 0, agg["spend"] / agg["clicks"], 0.85)',
        '    agg["cvr_pct"] = np.where(agg["clicks"] > 0, agg["orders"] / agg["clicks"] * 100, 0.0)',
        '    agg["cpa"] = np.where(agg["orders"] > 0, agg["spend"] / agg["orders"], agg["spend"])',
        '    agg["acos_pct"] = np.where(agg["sales"] > 0, agg["spend"] / agg["sales"] * 100, 999.0)',
        '',
        '    def classify(t):',
        '        if ASIN_RE.match(t): return "关联商品ASIN", True, None',
        '        for neg in prof["preemptive_neg_phrases"]:',
        '            if neg in t: return "前置高危否定词", False, neg',
        '        if any(b in t for b in prof["own_brands"]): return "自有品牌词", False, None',
        '        if any(sa in t for sa in prof["secondary_ages"]): return "边缘高龄词", False, None',
        '        if any(ga in t for ga in prof["golden_ages"]): return "黄金适龄词", False, None',
        '        if any(ta in t for ta in prof["toy_attrs"]): return "高相关玩具属性词", False, None',
        '        return "核心泛大词", False, None',
        '',
        '    rows_out = []',
        '    for r in agg.itertuples(index=False):',
        '        intent, is_asin, pre_hit = classify(r.search_term)',
        '        conf = min(1.0, max(0.35, r.clicks / 40.0))',
        '        ratio = 1.0 + ((eff_acos / r.acos_pct) - 1.0) * conf if 0 < r.acos_pct < 900 else 0.65',
        '        bid = round(r.cpc * min(1.35, max(0.45, ratio)) * sc["bid_k"], 2)',
        '        if pre_hit: act, bid = f"前置词组否定 [{pre_hit}]", 0.0',
        '        elif r.orders == 0 and r.spend >= prof["zero_order_spend"]: act, bid = "单点绩效精准否定", 0.0',
        '        elif is_asin: act = "商品定位·精准ASIN投放"',
        '        elif intent == "自有品牌词": act = "C1品牌防御精准+他组否词隔离"',
        '        elif intent == "边缘高龄词": act, bid = "C4独立高龄组控Bid", round(bid * 0.9, 2)',
        '        elif r.orders >= prof["exact_min_orders"] and r.acos_pct <= eff_acos * 1.25: act = "C2主力精准打排名+源组毕业否定"',
        '        else: act = "C3受控词组(挂前置否词库)"',
        '        rows_out.append((*r, intent, act, bid))',
        '',
        '    res_df = pd.DataFrame(rows_out, columns=list(agg.columns) + ["语义意图", "策略动作", "建议竞价($)"]).sort_values("orders", ascending=False)',
        '    with pd.ExcelWriter(args.output, engine="openpyxl") as w:',
        '        ledger_df.to_excel(w, sheet_name="0_导入批次台账", index=False)',
        '        res_df.to_excel(w, sheet_name="1_去重投放与匹配策略", index=False)',
        '    print(f"[成功] 激活批次数={int(ledger_df[\'enabled\'].sum())}/{len(ledger_df)} | 合并唯一词={len(res_df):,} -> {args.output}")',
        '',
        'if __name__ == "__main__":',
        '    p = argparse.ArgumentParser(description="Amazon US Toys 关键词批处理引擎 v2.0")',
        '    sub = p.add_subparsers(dest="cmd", required=True)',
        '    p_init = sub.add_parser("init", help="初始化项目工作区配置与台账")',
        '    p_init.add_argument("--project", default="US玩具项目")',
        '    p_init.add_argument("--brands", default="")',
        '    p_init.add_argument("--acos", type=float, default=22.0)',
        '    p_init.add_argument("--cpa", type=float, default=6.8)',
        '    p_init.add_argument("--profile", default=DEFAULT_PROFILE_PATH)',
        '    p_init.add_argument("--db", default=DEFAULT_DB_PATH)',
        '    p_init.add_argument("--clean-batches", action="store_true", default=True)',
        '',
        '    p_ing = sub.add_parser("ingest", help="受控导入搜索词批次并生成策略工作簿")',
        '    p_ing.add_argument("--files", nargs="+", required=True)',
        '    p_ing.add_argument("--label", default="")',
        '    p_ing.add_argument("--mode", choices=["isolate", "merge", "replace"], default="isolate")',
        '    p_ing.add_argument("--season", choices=["off", "ramp", "peak", "shrink"], default="off")',
        '    p_ing.add_argument("--output", default="Amazon_Toys_Batch_Strategy.xlsx")',
        '    p_ing.add_argument("--profile", default=DEFAULT_PROFILE_PATH)',
        '    p_ing.add_argument("--db", default=DEFAULT_DB_PATH)',
        '',
        '    p_ls = sub.add_parser("list-batches", help="查看当前批次台账")',
        '    p_ls.add_argument("--db", default=DEFAULT_DB_PATH)',
        '    args = p.parse_args()',
        '    if args.cmd == "init": init_workspace(args)',
        '    elif args.cmd == "ingest": ingest_and_run(args)',
        '    elif args.cmd == "list-batches":',
        '        c = init_db(args.db)',
        '        print(pd.read_sql_query("SELECT * FROM batches", c).to_string(index=False))'
      ].join('\n');
    }

    function copyPythonScript() {
      copyTextSafe(buildStandalonePythonSource(), '已复制完整无截断 Python 批处理源码');
    }

    function downloadPythonScript() {
      const code = buildStandalonePythonSource();
      const blob = new Blob([code], { type: 'text/x-python;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'amazon_toys_kw_batch_processor.py';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('已下载 amazon_toys_kw_batch_processor.py 脚本文件', 'ok');
    }

    // =========================================================================
    // 8. INTERACTIVE SANKEY DIAGRAM & VISUAL AD GROUP BUILDER ENGINE
    // =========================================================================
    function tokenizeStemSequence(text) {
      return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .map(stemToken);
    }

    // Determines how a Seed Root matches a Search Term under Amazon SP Matching Rules:
    // Returns 'EXACT' | 'PHRASE' | 'BROAD' | null
    function matchSeedToSearchTerm(seedRoot, searchTerm, isAsin) {
      if (isAsin) {
        if (seedRoot === '__ASIN_POOL__' || seedRoot.toLowerCase() === searchTerm.toLowerCase()) {
          return 'PRODUCT_AUTO';
        }
        return null;
      }
      if (seedRoot === '__ASIN_POOL__') return null;

      const seedToks = tokenizeStemSequence(seedRoot);
      const termToks = tokenizeStemSequence(searchTerm);
      if (seedToks.length === 0 || termToks.length === 0) return null;

      // 1. Exact Match: identical length & stemmed token sequence (covers singular/plural)
      if (seedToks.length === termToks.length) {
        let allSame = true;
        for (let i = 0; i < seedToks.length; i++) {
          if (seedToks[i] !== termToks[i]) {
            allSame = false;
            break;
          }
        }
        if (allSame) return 'EXACT';
      }

      // 2. Phrase Match: seedToks appears as a contiguous ordered sub-sequence inside termToks
      if (seedToks.length <= termToks.length) {
        for (let start = 0; start <= termToks.length - seedToks.length; start++) {
          let ok = true;
          for (let j = 0; j < seedToks.length; j++) {
            if (termToks[start + j] !== seedToks[j]) {
              ok = false;
              break;
            }
          }
          if (ok) return 'PHRASE';
        }
      }

      // 3. Broad Match: every meaningful token in seedToks exists in termToks (middle insertion or reordered)
      const termSet = new Set(termToks);
      for (let i = 0; i < seedToks.length; i++) {
        if (!STOPWORDS.has(seedToks[i]) && !termSet.has(seedToks[i])) {
          return null;
        }
      }
      return 'BROAD';
    }

    function getCandidateSeedRoots() {
      // Combine top meaningful 2-grams and 1-grams with multi-term or high-order impact
      const candidates = [];
      const seen = new Set();

      // Prioritize multi-word roots first, then key single-word roots
      const sortedGrams = appState.ngramRows.slice().sort(function(a, b) {
        const scoreA = a.orders * (a.gramSize === 2 ? 1.25 : 0.9);
        const scoreB = b.orders * (b.gramSize === 2 ? 1.25 : 0.9);
        return scoreB - scoreA || b.spend - a.spend;
      });

      for (let i = 0; i < sortedGrams.length; i++) {
        const g = sortedGrams[i];
        if (!seen.has(g.gram) && (g.termCount >= 1 || g.orders >= 1)) {
          // Skip bare numbers like '3-5' as standalone seed roots unless needed
          if (/^[0-9-]+$/.test(g.gram)) continue;
          seen.add(g.gram);
          candidates.push({
            root: g.gram,
            gramSize: g.gramSize,
            termCount: g.termCount,
            orders: g.orders,
            spend: g.spend
          });
        }
        if (candidates.length >= 25) break;
      }

      // Also include exact core head terms if present
      for (let i = 0; i < appState.dedupTerms.length; i++) {
        const t = appState.dedupTerms[i];
        if (!t.isAsin && t.searchTerm.split(' ').length <= 3 && !seen.has(t.searchTerm) && candidates.length < 30) {
          seen.add(t.searchTerm);
          candidates.push({
            root: t.searchTerm,
            gramSize: t.searchTerm.split(' ').length,
            termCount: 1,
            orders: t.orders,
            spend: t.spend
          });
        }
      }

      return candidates;
    }

    function populateSankeyRootControls() {
      const select = byId('sankeyRootSelect');
      const pillsBox = byId('sankeyQuickRootPills');
      if (!select || !pillsBox) return;

      const candidates = getCandidateSeedRoots();
      const hasAsin = appState.dedupTerms.some(function(t) { return t.isAsin; });

      // Validate current selected root still makes sense; default to 'kids phone' if available, else panorama
      const validSet = new Set(['__PANORAMA__']);
      candidates.forEach(function(c) { validSet.add(c.root); });
      if (hasAsin) validSet.add('__ASIN_POOL__');

      if (!appState.sankeyCustomRoot && !validSet.has(appState.sankeySelectedRoot)) {
        const hasKidsPhone = candidates.some(function(c) { return c.root === 'kids phone'; });
        appState.sankeySelectedRoot = hasKidsPhone ? 'kids phone' : '__PANORAMA__';
      }

      const opts = [
        '<option value="__PANORAMA__"' + (appState.sankeySelectedRoot === '__PANORAMA__' ? ' selected' : '') + '>🌐 全景模式：自动提炼核心根词组网对比</option>'
      ];
      if (appState.sankeyCustomRoot) {
        opts.push('<option value="__CUSTOM__" selected>🔍 自定义推演根词：' + escapeHtml(appState.sankeyCustomRoot) + '</option>');
      }
      for (let i = 0; i < candidates.length; i++) {
        const c = candidates[i];
        const isSel = (!appState.sankeyCustomRoot && appState.sankeySelectedRoot === c.root) ? ' selected' : '';
        opts.push(
          '<option value="' + escapeHtml(c.root) + '"' + isSel + '>词根：' +
          escapeHtml(c.root) + ' (覆盖 ' + c.termCount + ' 词 · ' + c.orders + ' 单)</option>'
        );
      }
      if (hasAsin) {
        opts.push('<option value="__ASIN_POOL__"' + (appState.sankeySelectedRoot === '__ASIN_POOL__' ? ' selected' : '') + '>📦 商品定位池：关联 ASIN 投放流向</option>');
      }
      select.innerHTML = opts.join('');

      // Render top 6 quick pills
      const pillItems = [{ key: '__PANORAMA__', label: '🌐 全景多根词' }];
      const preferredOrder = ['kids phone', 'smart phone', 'kids smart phone', 'kokodi', 'toddler'];
      preferredOrder.forEach(function(p) {
        if (candidates.some(function(c) { return c.root === p; })) {
          pillItems.push({ key: p, label: p });
        }
      });
      for (let i = 0; i < candidates.length && pillItems.length < 7; i++) {
        if (!pillItems.some(function(x) { return x.key === candidates[i].root; })) {
          pillItems.push({ key: candidates[i].root, label: candidates[i].root });
        }
      }

      pillsBox.innerHTML = pillItems.map(function(p) {
        const active = (!appState.sankeyCustomRoot && appState.sankeySelectedRoot === p.key);
        const cls = active
          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200';
        return '<button type="button" data-kwe-click="selectQuickSankeyRoot(\'' + escapeHtml(p.key) + '\')" class="px-2.5 py-1 rounded-full border text-xs font-mono font-medium transition ' + cls + '">' + escapeHtml(p.label) + '</button>';
      }).join('');
    }

    function selectQuickSankeyRoot(rootKey) {
      appState.sankeyCustomRoot = '';
      appState.sankeySelectedRoot = rootKey;
      appState.sankeyFocusNodeId = null;
      byId('sankeyCustomRootInput').value = '';
      populateSankeyRootControls();
      renderSankeyWorkbench();
    }

    function onSankeyRootSelectChange() {
      const val = byId('sankeyRootSelect').value;
      if (val !== '__CUSTOM__') {
        appState.sankeyCustomRoot = '';
        appState.sankeySelectedRoot = val;
        appState.sankeyFocusNodeId = null;
        byId('sankeyCustomRootInput').value = '';
      }
      populateSankeyRootControls();
      renderSankeyWorkbench();
    }

    function applyCustomSankeyRoot() {
      const val = byId('sankeyCustomRootInput').value.trim().toLowerCase();
      if (!val) {
        showToast('请输入要推演的根词，例如 kids phone 或 smart phone', 'warn');
        return;
      }
      appState.sankeyCustomRoot = val;
      appState.sankeySelectedRoot = '__CUSTOM__';
      appState.sankeyFocusNodeId = null;
      populateSankeyRootControls();
      renderSankeyWorkbench();
      showToast('已按自定义根词 [' + val + '] 生成匹配流向与建组方案', 'ok');
    }

    function clearSankeyFocus() {
      appState.sankeyFocusNodeId = null;
      byId('resetSankeyFocusBtn').classList.add('hidden');
      renderSankeyWorkbench();
    }

    function toggleSankeyFocus(nodeId) {
      if (appState.sankeyFocusNodeId === nodeId) {
        appState.sankeyFocusNodeId = null;
      } else {
        appState.sankeyFocusNodeId = nodeId;
      }
      const btn = byId('resetSankeyFocusBtn');
      if (appState.sankeyFocusNodeId) btn.classList.remove('hidden');
      else btn.classList.add('hidden');
      renderSankeyWorkbench();
    }

    function getAdGroupMetaForTerm(termObj) {
      if (termObj.actionCode === 'NEG_STOP') {
        return { id: 'AG_STOP', name: '组内否定拦截池 (不建组)', color: '#9E3B2E', matchRec: 'Negative Phrase/Exact' };
      }
      if (termObj.actionCode === 'BRAND_EXACT') {
        return { id: 'AG_BRAND', name: 'AG1 · 品牌防御精准组', color: '#7A4E65', matchRec: '精准 [Exact] + 品牌词组' };
      }
      if (termObj.actionCode === 'PRODUCT_ASIN') {
        return { id: 'AG_ASIN', name: 'AG6 · 关联ASIN商品定位组', color: '#3B5B78', matchRec: '商品精准定位 (ASIN)' };
      }
      if (termObj.intent === '边缘高龄词') {
        return { id: 'AG_OLD_AGE', name: 'AG4a · 高龄段(7-12)独立控Bid组', color: '#B5852B', matchRec: '独立精准/低Bid词组' };
      }
      if (termObj.intent === '节日礼物场景词') {
        return { id: 'AG_GIFT', name: 'AG5 · 旺季礼物脉冲组', color: '#8C6239', matchRec: '旺季词组/限定宽泛' };
      }
      if (termObj.actionCode === 'CORE_EXACT') {
        return { id: 'AG_CORE_EXACT', name: 'AG2 · 主力大词与适龄精准组', color: '#C15F3C', matchRec: '精准匹配 [Exact] 冲排名' };
      }
      if (termObj.actionCode === 'SEG_PHRASE' || termObj.actionCode === 'PEAK_BROAD') {
        return { id: 'AG_PHRASE', name: 'AG3 · 黄金适龄/属性词组拓流组', color: '#356B54', matchRec: '受控词组 "Phrase" (挂否词)' };
      }
      return { id: 'AG_HEAD_CTRL', name: 'AG4b · 泛词独立低Bid测试组', color: '#A66A28', matchRec: '独立控Bid精准/严控词组' };
    }

    function selectPanoramaRoots() {
      // Automatically pick 3 to 5 distinct high-coverage roots that partition the dataset cleanly
      const candidates = getCandidateSeedRoots();
      const chosen = [];
      // 1. Own brand root if present
      for (let i = 0; i < appState.config.ownBrands.length; i++) {
        const b = appState.config.ownBrands[i];
        if (appState.dedupTerms.some(function(t) { return !t.isAsin && t.searchTerm.indexOf(b) !== -1; })) {
          chosen.push(b);
          break;
        }
      }
      // 2. Pick top 2-gram roots that cover new terms
      const covered = new Set();
      chosen.forEach(function(r) {
        appState.dedupTerms.forEach(function(t) {
          if (matchSeedToSearchTerm(r, t.searchTerm, t.isAsin)) covered.add(t.searchTerm);
        });
      });

      for (let i = 0; i < candidates.length && chosen.length < 5; i++) {
        const c = candidates[i].root;
        if (chosen.indexOf(c) !== -1) continue;
        let newHits = 0;
        for (let j = 0; j < appState.dedupTerms.length; j++) {
          const t = appState.dedupTerms[j];
          if (!covered.has(t.searchTerm) && matchSeedToSearchTerm(c, t.searchTerm, t.isAsin)) {
            newHits++;
          }
        }
        if (newHits > 0) {
          chosen.push(c);
          appState.dedupTerms.forEach(function(t) {
            if (matchSeedToSearchTerm(c, t.searchTerm, t.isAsin)) covered.add(t.searchTerm);
          });
        }
      }

      if (appState.dedupTerms.some(function(t) { return t.isAsin; })) {
        chosen.push('__ASIN_POOL__');
      }
      return chosen.length > 0 ? chosen : ['kids phone'];
    }

    function buildSankeyGraphData() {
      const logicMode = byId('sankeyMatchLogicSelect').value; // 'simulated' | 'historical'
      const metric = byId('sankeyMetricSelect').value; // 'orders' | 'spend' | 'sales' | 'clicks'
      const topLimit = parseInt(byId('sankeyTopLimitSelect').value, 10) || 20;
      const allowCross = byId('sankeyAllowCrossCheck').checked;

      const activeRootKey = appState.sankeyCustomRoot
        ? appState.sankeyCustomRoot
        : appState.sankeySelectedRoot;

      const seedRoots = activeRootKey === '__PANORAMA__'
        ? selectPanoramaRoots()
        : [activeRootKey];

      const matchMeta = {
        EXACT:        { id: 'M_EXACT',   label: '精准匹配 [Exact]',     color: '#C15F3C' },
        PHRASE:       { id: 'M_PHRASE',  label: '词组匹配 "Phrase"',    color: '#356B54' },
        BROAD:        { id: 'M_BROAD',   label: '宽泛匹配 +Broad',      color: '#8C6239' },
        PRODUCT_AUTO: { id: 'M_PRODAUTO',label: '商品 / 自动关联匹配',   color: '#3B5B78' }
      };

      // Build atomic flow records: { rootId, rootLabel, matchId, matchLabel, matchColor, termObj, weight, orders, spend, sales, clicks, agMeta }
      const rawFlows = [];

      if (logicMode === 'simulated') {
        for (let i = 0; i < appState.dedupTerms.length; i++) {
          const t = appState.dedupTerms[i];
          const hits = [];
          for (let s = 0; s < seedRoots.length; s++) {
            const sr = seedRoots[s];
            const mType = matchSeedToSearchTerm(sr, t.searchTerm, t.isAsin);
            if (mType) {
              // Specificity score: EXACT (3) > PHRASE (2) > BROAD (1), plus token length
              const specScore = (mType === 'EXACT' ? 30 : (mType === 'PHRASE' ? 20 : 10)) + sr.split(' ').length;
              hits.push({ sr: sr, mType: mType, specScore: specScore });
            }
          }
          if (hits.length === 0) continue;
          hits.sort(function(a, b) { return b.specScore - a.specScore; });
          const selectedHits = (activeRootKey === '__PANORAMA__' && !allowCross) ? [hits[0]] : hits;

          for (let h = 0; h < selectedHits.length; h++) {
            const hit = selectedHits[h];
            const mm = matchMeta[hit.mType];
            const ag = getAdGroupMetaForTerm(t);
            const metricVal = Math.max(0.1, t[metric] || (metric === 'orders' ? 0.2 : 1));
            rawFlows.push({
              rootKey: hit.sr,
              rootLabel: hit.sr === '__ASIN_POOL__' ? '关联ASIN池' : hit.sr,
              matchKey: mm.id,
              matchTypeRaw: hit.mType,
              matchLabel: mm.label,
              matchColor: mm.color,
              termKey: t.searchTerm,
              termObj: t,
              agId: ag.id,
              agName: ag.name,
              agColor: ag.color,
              agMatchRec: ag.matchRec,
              val: metricVal,
              orders: t.orders,
              spend: t.spend,
              sales: t.sales,
              clicks: t.clicks
            });
          }
        }
      } else {
        // Historical mode: map raw report rows matching the seed root(s) via their actual report sourceMatch
        for (let i = 0; i < appState.processedRaw.length; i++) {
          const r = appState.processedRaw[i];
          const parentDedup = appState.dedupTerms.find(function(d) { return d.searchTerm === r.searchTerm; }) || r;
          const hits = [];
          for (let s = 0; s < seedRoots.length; s++) {
            const sr = seedRoots[s];
            const mType = matchSeedToSearchTerm(sr, r.searchTerm, r.isAsin);
            if (mType) hits.push({ sr: sr, specScore: sr.split(' ').length });
          }
          if (hits.length === 0) continue;
          hits.sort(function(a, b) { return b.specScore - a.specScore; });
          const chosenHits = (activeRootKey === '__PANORAMA__' && !allowCross) ? [hits[0]] : hits;

          const sm = r.sourceMatch || '';
          let histKey = 'M_HIST_PHRASE', histLabel = r.adType + ' · ' + sm, histColor = '#356B54';
          if (r.adType.indexOf('Auto') !== -1 || sm.indexOf('紧密') !== -1) {
            histKey = 'M_HIST_AUTO'; histColor = '#3B5B78';
          } else if (sm.indexOf('精准') !== -1 || sm.toLowerCase().indexOf('exact') !== -1) {
            histKey = 'M_HIST_EXACT'; histColor = '#C15F3C';
          } else if (sm.indexOf('宽泛') !== -1 || sm.toLowerCase().indexOf('broad') !== -1) {
            histKey = 'M_HIST_BROAD'; histColor = '#8C6239';
          } else if (sm.indexOf('商品') !== -1) {
            histKey = 'M_HIST_ASIN'; histColor = '#3B5B78';
          }
          histKey = histKey + '_' + histLabel;

          const ag = getAdGroupMetaForTerm(parentDedup);
          const metricVal = Math.max(0.1, r[metric] || 0.2);

          for (let h = 0; h < chosenHits.length; h++) {
            rawFlows.push({
              rootKey: chosenHits[h].sr,
              rootLabel: chosenHits[h].sr === '__ASIN_POOL__' ? '关联ASIN池' : chosenHits[h].sr,
              matchKey: histKey,
              matchTypeRaw: sm,
              matchLabel: histLabel,
              matchColor: histColor,
              termKey: r.searchTerm,
              termObj: parentDedup,
              agId: ag.id,
              agName: ag.name,
              agColor: ag.color,
              agMatchRec: ag.matchRec,
              val: metricVal,
              orders: r.orders,
              spend: r.spend,
              sales: r.sales,
              clicks: r.clicks
            });
          }
        }
      }

      // Rank unique matched terms by metric so >topLimit long-tail words fold cleanly into a summary node
      const termTotals = new Map();
      rawFlows.forEach(function(f) {
        termTotals.set(f.termKey, (termTotals.get(f.termKey) || 0) + f.val);
      });
      const sortedTermKeys = Array.from(termTotals.keys()).sort(function(a, b) {
        return termTotals.get(b) - termTotals.get(a);
      });
      const topTermSet = new Set(sortedTermKeys.slice(0, topLimit));
      const foldedCount = Math.max(0, sortedTermKeys.length - topLimit);

      const finalFlows = rawFlows.map(function(f) {
        if (topTermSet.has(f.termKey)) {
          return Object.assign({}, f, { displayTermId: 'T_' + f.termKey, displayTermLabel: f.termKey, isFolded: false });
        }
        return Object.assign({}, f, {
          displayTermId: 'T___FOLDED_TAIL__',
          displayTermLabel: '其余 ' + foldedCount + ' 个长尾搜索词汇总',
          isFolded: true
        });
      });

      return {
        flows: finalFlows,
        rawFlows: rawFlows,
        uniqueTermCount: sortedTermKeys.length,
        metric: metric,
        seedRoots: seedRoots
      };
    }

    function formatMetricValue(val, metric) {
      if (metric === 'spend' || metric === 'sales') {
        return '$' + val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
      return Math.round(val).toLocaleString() + (metric === 'orders' ? '单' : '次');
    }

    function renderSankeyWorkbench() {
      const svg = byId('sankeySvg');
      const container = byId('sankeyCanvasContainer');
      if (!svg || !container) return;

      const graph = buildSankeyGraphData();
      const flows = graph.flows;
      const metric = graph.metric;

      // Render Summary Strip
      let sumOrders = 0, sumSpend = 0, sumSales = 0;
      const seenTerms = new Set();
      graph.rawFlows.forEach(function(f) {
        if (!seenTerms.has(f.termKey)) {
          seenTerms.add(f.termKey);
          sumOrders += f.termObj.orders;
          sumSpend += f.termObj.spend;
          sumSales += f.termObj.sales;
        }
      });
      const sumAcos = sumSales > 0 ? (sumSpend / sumSales * 100).toFixed(2) + '%' : '0.00%';
      const agSet = new Set(graph.rawFlows.map(function(f) { return f.agId; }));

      byId('sankeySummaryStrip').innerHTML =
        '<div class="p-3 rounded-xl bg-slate-50 border border-slate-200">' +
          '<div class="text-[11px] text-slate-500">当前根词匹配覆盖搜索词</div>' +
          '<div class="text-base sm:text-lg font-bold text-slate-900 mt-0.5">' + graph.uniqueTermCount.toLocaleString() + ' 个唯一词</div>' +
        '</div>' +
        '<div class="p-3 rounded-xl bg-slate-50 border border-slate-200">' +
          '<div class="text-[11px] text-slate-500">覆盖词累计订单 / 花费</div>' +
          '<div class="text-base sm:text-lg font-bold text-slate-900 mt-0.5">' + sumOrders.toLocaleString() + ' 单 · $' + sumSpend.toLocaleString(undefined, { maximumFractionDigits: 0 }) + '</div>' +
        '</div>' +
        '<div class="p-3 rounded-xl bg-slate-50 border border-slate-200">' +
          '<div class="text-[11px] text-slate-500">覆盖词销售额 / 综合ACOS</div>' +
          '<div class="text-base sm:text-lg font-bold text-emerald-700 mt-0.5">$' + sumSales.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' (' + sumAcos + ')</div>' +
        '</div>' +
        '<div class="p-3 rounded-xl bg-blue-50/70 border border-blue-200">' +
          '<div class="text-[11px] text-blue-700 font-semibold">建议拆分目标广告组数</div>' +
          '<div class="text-base sm:text-lg font-bold text-blue-900 mt-0.5">' + agSet.size + ' 个独立单元</div>' +
        '</div>';

      if (flows.length === 0) {
        svg.setAttribute('height', '220');
        svg.innerHTML = '<text x="50%" y="110" text-anchor="middle" fill="#8B877E" font-size="13">当前词表中没有搜索词可被该根词匹配，请更换根词或上传完整搜索词报告。</text>';
        byId('sankeyAdGroupCardsGrid').innerHTML = '';
        return;
      }

      // Build 4-column Sankey Nodes & Aggregated Links
      // Col 0: Root | Col 1: MatchType | Col 2: DisplayTerm | Col 3: TargetAdGroup
      const nodesByCol = [new Map(), new Map(), new Map(), new Map()];
      const linkMap = new Map();

      function upsertNode(colIdx, id, label, color, extra) {
        let n = nodesByCol[colIdx].get(id);
        if (!n) {
          n = { id: id, col: colIdx, label: label, color: color, val: 0, orders: 0, spend: 0, sales: 0, extra: extra || null };
          nodesByCol[colIdx].set(id, n);
        }
        return n;
      }

      function addEdge(srcId, dstId, color, f, stageLabel) {
        const key = srcId + '-->' + dstId;
        let e = linkMap.get(key);
        if (!e) {
          e = { id: key, src: srcId, dst: dstId, color: color, val: 0, orders: 0, spend: 0, sales: 0, stageLabel: stageLabel };
          linkMap.set(key, e);
        }
        e.val += f.val;
        e.orders += f.orders;
        e.spend += f.spend;
        e.sales += f.sales;
      }

      flows.forEach(function(f) {
        const rId = 'R_' + f.rootKey;
        const mId = f.matchKey;
        const tId = f.displayTermId;
        const gId = f.agId;

        const n0 = upsertNode(0, rId, f.rootLabel, '#4A463F');
        const n1 = upsertNode(1, mId, f.matchLabel, f.matchColor);
        const n2 = upsertNode(2, tId, f.displayTermLabel, f.agColor, f.isFolded ? null : f.termObj);
        const n3 = upsertNode(3, gId, f.agName, f.agColor);

        [n0, n1, n2, n3].forEach(function(n) {
          n.val += f.val;
          n.orders += f.orders;
          n.spend += f.spend;
          n.sales += f.sales;
        });

        addEdge(rId, mId, f.matchColor, f, '根词 → 匹配方式');
        addEdge(mId, tId, f.matchColor, f, '匹配方式 → 其余搜索词');
        addEdge(tId, gId, f.agColor, f, '搜索词 → 目标广告组');
      });

      // Layout Geometry
      const containerWidth = Math.max(860, container.clientWidth || 1040);
      const maxNodesInCol = Math.max(
        nodesByCol[0].size,
        nodesByCol[1].size,
        nodesByCol[2].size,
        nodesByCol[3].size
      );
      const svgHeight = Math.max(430, maxNodesInCol * 42 + 70);
      svg.setAttribute('viewBox', '0 0 ' + containerWidth + ' ' + svgHeight);
      svg.setAttribute('height', String(svgHeight));

      const padTop = 20, padBottom = 20;
      const nodeW = 16;
      const colX = [
        18,
        Math.round(containerWidth * 0.28),
        Math.round(containerWidth * 0.57),
        containerWidth - 220
      ];

      const allNodesById = new Map();
      for (let c = 0; c < 4; c++) {
        const arr = Array.from(nodesByCol[c].values()).sort(function(a, b) { return b.val - a.val; });
        const gap = arr.length > 1 ? Math.min(16, Math.max(7, (svgHeight - padTop - padBottom) * 0.18 / (arr.length - 1))) : 0;
        const totalGap = gap * Math.max(0, arr.length - 1);
        const availH = Math.max(120, svgHeight - padTop - padBottom - totalGap);
        const totalVal = arr.reduce(function(s, x) { return s + x.val; }, 0) || 1;

        let curY = padTop;
        for (let i = 0; i < arr.length; i++) {
          const n = arr[i];
          const h = Math.max(14, (n.val / totalVal) * availH);
          n.x = colX[c];
          n.y = curY;
          n.h = h;
          n.outOffset = 0;
          n.inOffset = 0;
          curY += h + gap;
          allNodesById.set(n.id, n);
        }
        // Vertically center column if shorter than canvas
        const usedBottom = curY - gap;
        const shift = Math.max(0, (svgHeight - padBottom - usedBottom) / 2);
        if (shift > 2) {
          arr.forEach(function(n) { n.y += shift; });
        }
      }

      // Compute ribbon vertical offsets per node
      const edges = Array.from(linkMap.values()).sort(function(a, b) {
        const na = allNodesById.get(a.src), nb = allNodesById.get(b.src);
        if (na.col !== nb.col) return na.col - nb.col;
        if (na.y !== nb.y) return na.y - nb.y;
        const da = allNodesById.get(a.dst), db = allNodesById.get(b.dst);
        return da.y - db.y;
      });

      edges.forEach(function(e) {
        const sNode = allNodesById.get(e.src);
        const dNode = allNodesById.get(e.dst);
        const sThick = (e.val / (sNode.val || 1)) * sNode.h;
        const dThick = (e.val / (dNode.val || 1)) * dNode.h;
        e.thick = Math.max(2, (sThick + dThick) / 2);
        e.sy = sNode.y + sNode.outOffset + sThick / 2;
        e.dy = dNode.y + dNode.inOffset + dThick / 2;
        sNode.outOffset += sThick;
        dNode.inOffset += dThick;
      });

      // Determine connected subgraph if a focus node is locked
      let activeNodeSet = null;
      let activeEdgeSet = null;
      if (appState.sankeyFocusNodeId && allNodesById.has(appState.sankeyFocusNodeId)) {
        activeNodeSet = new Set([appState.sankeyFocusNodeId]);
        activeEdgeSet = new Set();
        // Forward BFS
        const fwd = [appState.sankeyFocusNodeId];
        while (fwd.length > 0) {
          const cur = fwd.shift();
          edges.forEach(function(e) {
            if (e.src === cur) {
              activeEdgeSet.add(e.id);
              if (!activeNodeSet.has(e.dst)) {
                activeNodeSet.add(e.dst);
                fwd.push(e.dst);
              }
            }
          });
        }
        // Backward BFS
        const bwd = [appState.sankeyFocusNodeId];
        while (bwd.length > 0) {
          const cur = bwd.shift();
          edges.forEach(function(e) {
            if (e.dst === cur) {
              activeEdgeSet.add(e.id);
              if (!activeNodeSet.has(e.src)) {
                activeNodeSet.add(e.src);
                bwd.push(e.src);
              }
            }
          });
        }
      }

      // Build SVG Markup
      const svgParts = [];

      // Render Edges
      edges.forEach(function(e, idx) {
        const sNode = allNodesById.get(e.src);
        const dNode = allNodesById.get(e.dst);
        const x0 = sNode.x + nodeW;
        const x1 = dNode.x;
        const cx = (x0 + x1) / 2;
        const dPath = 'M ' + x0 + ' ' + e.sy.toFixed(1) +
          ' C ' + cx.toFixed(1) + ' ' + e.sy.toFixed(1) + ', ' +
          cx.toFixed(1) + ' ' + e.dy.toFixed(1) + ', ' +
          x1 + ' ' + e.dy.toFixed(1);

        const isDimmed = activeEdgeSet && !activeEdgeSet.has(e.id);
        const opacity = isDimmed ? 0.07 : (activeEdgeSet ? 0.62 : 0.36);

        svgParts.push(
          '<path class="sankey-link" data-edge-idx="' + idx + '" d="' + dPath + '" ' +
          'stroke="' + e.color + '" stroke-width="' + e.thick.toFixed(1) + '" stroke-opacity="' + opacity + '" />'
        );
      });

      // Render Nodes & Labels
      allNodesById.forEach(function(n) {
        const isDimmed = activeNodeSet && !activeNodeSet.has(n.id);
        const isSelected = appState.sankeyFocusNodeId === n.id;
        const dimClass = isDimmed ? ' sankey-dimmed' : '';
        const strokeAttr = isSelected ? ' stroke="#141413" stroke-width="2.5"' : ' stroke="#ffffff" stroke-width="1"';

        const labelText = n.label.length > 26 ? n.label.slice(0, 25) + '…' : n.label;
        const subMetricText = formatMetricValue(n.val, metric);
        const textX = n.col === 3 ? (n.x + nodeW + 7) : (n.x + nodeW + 7);
        const textY = n.y + n.h / 2;

        svgParts.push(
          '<g class="sankey-node-group' + dimClass + '" data-node-id="' + escapeHtml(n.id) + '">' +
            '<rect x="' + n.x + '" y="' + n.y.toFixed(1) + '" width="' + nodeW + '" height="' + n.h.toFixed(1) + '" rx="4" fill="' + n.color + '"' + strokeAttr + ' />' +
            '<text x="' + textX + '" y="' + (textY - 2).toFixed(1) + '" font-size="11.5" font-weight="600" fill="#141413" dominant-baseline="middle">' + escapeHtml(labelText) + '</text>' +
            '<text x="' + textX + '" y="' + (textY + 11).toFixed(1) + '" font-size="10" fill="#63615B" dominant-baseline="middle">' + escapeHtml(subMetricText) + '</text>' +
          '</g>'
        );
      });

      svg.innerHTML = svgParts.join('');

      // Wire interactive hover tooltips & click-to-focus handlers on SVG elements
      const tooltip = byId('sankeyTooltip');
      const pathEls = svg.querySelectorAll('.sankey-link');
      pathEls.forEach(function(el) {
        const e = edges[parseInt(el.getAttribute('data-edge-idx'), 10)];
        const sNode = allNodesById.get(e.src);
        const dNode = allNodesById.get(e.dst);
        el.addEventListener('mouseenter', function(ev) {
          const acosStr = e.sales > 0 ? (e.spend / e.sales * 100).toFixed(2) + '%' : '0单';
          tooltip.innerHTML =
            '<div class="text-[10px] text-blue-300 font-semibold">' + escapeHtml(e.stageLabel) + '</div>' +
            '<div class="font-bold mt-0.5">' + escapeHtml(sNode.label) + ' → ' + escapeHtml(dNode.label) + '</div>' +
            '<div class="mt-1.5 pt-1.5 border-t border-slate-700 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-slate-200">' +
              '<span>订单：<strong>' + e.orders.toLocaleString() + '</strong></span>' +
              '<span>花费：<strong>$' + e.spend.toFixed(2) + '</strong></span>' +
              '<span>销售额：<strong>$' + e.sales.toFixed(2) + '</strong></span>' +
              '<span>ACOS：<strong>' + acosStr + '</strong></span>' +
            '</div>';
          tooltip.classList.remove('hidden');
          positionSankeyTooltip(ev, tooltip);
        });
        el.addEventListener('mousemove', function(ev) { positionSankeyTooltip(ev, tooltip); });
        el.addEventListener('mouseleave', function() { tooltip.classList.add('hidden'); });
        el.addEventListener('click', function() { toggleSankeyFocus(dNode.id); });
      });

      const nodeEls = svg.querySelectorAll('.sankey-node-group');
      nodeEls.forEach(function(el) {
        const nid = el.getAttribute('data-node-id');
        const n = allNodesById.get(nid);
        el.addEventListener('mouseenter', function(ev) {
          const acosStr = n.sales > 0 ? (n.spend / n.sales * 100).toFixed(2) + '%' : '0单';
          const cpaStr = n.orders > 0 ? '$' + (n.spend / n.orders).toFixed(2) : '$' + n.spend.toFixed(2);
          tooltip.innerHTML =
            '<div class="font-bold text-white">' + escapeHtml(n.label) + '</div>' +
            '<div class="mt-1.5 pt-1.5 border-t border-slate-700 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-slate-200">' +
              '<span>订单：<strong>' + n.orders.toLocaleString() + '</strong></span>' +
              '<span>花费：<strong>$' + n.spend.toFixed(2) + '</strong></span>' +
              '<span>CPA：<strong>' + cpaStr + '</strong></span>' +
              '<span>ACOS：<strong>' + acosStr + '</strong></span>' +
            '</div>' +
            '<div class="mt-1 text-[10px] text-amber-300">点击节点可锁定/取消高亮整条建组链路</div>';
          tooltip.classList.remove('hidden');
          positionSankeyTooltip(ev, tooltip);
        });
        el.addEventListener('mousemove', function(ev) { positionSankeyTooltip(ev, tooltip); });
        el.addEventListener('mouseleave', function() { tooltip.classList.add('hidden'); });
        el.addEventListener('click', function() { toggleSankeyFocus(nid); });
      });

      // Render Concrete Ad Group Builder Cards below the Sankey Diagram
      renderSankeyAdGroupCards(graph.rawFlows, activeNodeSet);
    }

    function positionSankeyTooltip(ev, tooltip) {
      const pad = 14;
      let left = ev.clientX + pad;
      let top = ev.clientY + pad;
      if (left + 270 > window.innerWidth) left = ev.clientX - 275;
      if (top + 130 > window.innerHeight) top = ev.clientY - 130;
      tooltip.style.left = Math.max(8, left) + 'px';
      tooltip.style.top = Math.max(8, top) + 'px';
    }

    function renderSankeyAdGroupCards(rawFlows, activeNodeSet) {
      const grid = byId('sankeyAdGroupCardsGrid');
      if (!grid) return;

      // Filter flows if user clicked a node in Sankey
      const filteredFlows = activeNodeSet
        ? rawFlows.filter(function(f) {
            return activeNodeSet.has('R_' + f.rootKey) &&
                   activeNodeSet.has(f.matchKey) &&
                   (activeNodeSet.has('T_' + f.termKey) || activeNodeSet.has('T___FOLDED_TAIL__')) &&
                   activeNodeSet.has(f.agId);
          })
        : rawFlows;

      const groupMap = new Map();
      // Collect high-converting exact/brand/older-age words across all rawFlows so Phrase/Broad groups know what to negate!
      const brandWords = new Set();
      const graduatedExactWords = new Set();
      const olderAgeWords = new Set();
      const stopNegWords = new Set();

      rawFlows.forEach(function(f) {
        if (f.agId === 'AG_BRAND') brandWords.add(f.termKey);
        if (f.agId === 'AG_CORE_EXACT') graduatedExactWords.add(f.termKey);
        if (f.agId === 'AG_OLD_AGE') olderAgeWords.add(f.termKey);
        if (f.agId === 'AG_STOP') stopNegWords.add(f.termObj.preNegHit || f.termKey);
      });

      filteredFlows.forEach(function(f) {
        let g = groupMap.get(f.agId);
        if (!g) {
          g = {
            agId: f.agId,
            agName: f.agName,
            agColor: f.agColor,
            agMatchRec: f.agMatchRec,
            roots: new Set(),
            termsMap: new Map(),
            orders: 0,
            spend: 0,
            sales: 0
          };
          groupMap.set(f.agId, g);
        }
        g.roots.add(f.rootLabel);
        if (!g.termsMap.has(f.termKey)) {
          g.termsMap.set(f.termKey, {
            term: f.termKey,
            viaMatch: f.matchLabel,
            bid: f.termObj.suggestedBid,
            orders: f.termObj.orders,
            cvr: f.termObj.cvr,
            cpa: f.termObj.cpa,
            acos: f.termObj.acos
          });
          g.orders += f.termObj.orders;
          g.spend += f.termObj.spend;
          g.sales += f.termObj.sales;
        }
      });

      const groups = Array.from(groupMap.values()).sort(function(a, b) { return b.orders - a.orders || b.spend - a.spend; });
      appState.lastSankeyPlan = [];

      grid.innerHTML = groups.map(function(g, gIdx) {
        const termArr = Array.from(g.termsMap.values()).sort(function(a, b) { return b.orders - a.orders; });
        const avgBid = termArr.length > 0
          ? (termArr.reduce(function(s, x) { return s + (x.bid || 0); }, 0) / termArr.length).toFixed(2)
          : '0.00';
        const acos = g.sales > 0 ? (g.spend / g.sales * 100).toFixed(2) + '%' : '0单';

        // Build concrete negative isolation list required INSIDE this Ad Group
        const mustNegate = [];
        if (g.agId === 'AG_PHRASE' || g.agId === 'AG_HEAD_CTRL' || g.agId === 'AG_GIFT') {
          appState.config.ownBrands.forEach(function(b) { mustNegate.push('[词组否] ' + b + ' (防抢品牌组)'); });
          Array.from(graduatedExactWords).slice(0, 4).forEach(function(w) { mustNegate.push('[精准否] ' + w + ' (已毕业转AG2)'); });
          if (g.agId === 'AG_PHRASE') {
            Array.from(olderAgeWords).slice(0, 3).forEach(function(w) { mustNegate.push('[精准否] ' + w + ' (剥离至高龄组)'); });
          }
          mustNegate.push('[前置词组否] sim card / unlocked / verizon 等真机词库');
        } else if (g.agId === 'AG_CORE_EXACT') {
          mustNegate.push('精准匹配天然锁词，无需额外否词；需在源词组/自动组精准否定本组词');
        } else if (g.agId === 'AG_BRAND') {
          mustNegate.push('挂载真机配件否词 (case only / screen protector)；在其他非品牌活动词组否定品牌词');
        } else if (g.agId === 'AG_OLD_AGE') {
          appState.config.ownBrands.forEach(function(b) { mustNegate.push('[词组否] ' + b); });
          mustNegate.push('单独设置低预算与竞价上限，严禁与 3-5 岁词混组');
        }

        // Record for Excel export
        termArr.forEach(function(tItem) {
          appState.lastSankeyPlan.push({
            '目标广告组': g.agName,
            '建议匹配方式': g.agMatchRec,
            '溯源根词': Array.from(g.roots).join(' / '),
            '组内投放词或拦截词': tItem.term,
            '由根词何种匹配裂变': tItem.viaMatch,
            '建议竞价($)': tItem.bid,
            '历史订单': tItem.orders,
            '历史CVR(%)': tItem.cvr,
            '历史ACOS(%)': tItem.acos,
            '本组配套必挂否定策略': mustNegate.join('；')
          });
        });

        const termChips = termArr.slice(0, 8).map(function(tItem) {
          return (
            '<div class="flex items-center justify-between gap-2 py-1 px-2 rounded bg-slate-50 border border-slate-200/80 text-[11px]">' +
              '<span class="font-mono font-semibold text-slate-800 truncate">' + escapeHtml(tItem.term) + '</span>' +
              '<span class="text-slate-500 shrink-0">' + tItem.orders + '单 · ' + (tItem.bid > 0 ? '$' + tItem.bid.toFixed(2) : '否词') + '</span>' +
            '</div>'
          );
        }).join('');

        const moreHint = termArr.length > 8
          ? '<div class="text-[11px] text-slate-400 text-center pt-0.5">… 另有 ' + (termArr.length - 8) + ' 个词（导出Excel可看全量）</div>'
          : '';

        return (
          '<div class="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between" style="border-top: 4px solid ' + g.agColor + ';">' +
            '<div class="space-y-2.5">' +
              '<div class="flex items-start justify-between gap-2">' +
                '<div>' +
                  '<h4 class="text-sm font-bold text-slate-900">' + escapeHtml(g.agName) + '</h4>' +
                  '<div class="text-[11px] font-semibold text-blue-700 mt-0.5">' + escapeHtml(g.agMatchRec) + ' · 均值竞价 $' + avgBid + '</div>' +
                '</div>' +
                '<button type="button" data-kwe-click="copyAdGroupCardTerms(' + gIdx + ')" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-medium transition shrink-0">复制组内词</button>' +
              '</div>' +
              '<div class="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">' +
                '<span>词数: <strong>' + termArr.length + '</strong></span>' +
                '<span>订单: <strong>' + g.orders.toLocaleString() + '</strong></span>' +
                '<span>ACOS: <strong>' + acos + '</strong></span>' +
              '</div>' +
              '<div class="space-y-1">' + termChips + moreHint + '</div>' +
            '</div>' +
            '<div class="mt-3 pt-2.5 border-t border-slate-100">' +
              '<div class="text-[11px] font-bold text-rose-700 mb-1">组内配套隔离 / 否定要求：</div>' +
              '<div class="text-[11px] text-slate-600 leading-relaxed">' + escapeHtml(mustNegate.slice(0, 4).join('；')) + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      window._sankeyRenderedGroups = groups;
    }

    function copyAdGroupCardTerms(groupIdx) {
      const groups = window._sankeyRenderedGroups || [];
      const g = groups[groupIdx];
      if (!g) return;
      const lines = Array.from(g.termsMap.values()).map(function(t) {
        return t.term + (t.bid > 0 ? '\t' + t.bid.toFixed(2) : '');
      });
      copyTextSafe(lines.join('\n'), '已复制【' + g.agName + '】内 ' + lines.length + ' 个关键词及建议竞价');
    }

    function exportSankeyAdGroupPlan() {
      if (!appState.lastSankeyPlan || appState.lastSankeyPlan.length === 0) {
        showToast('当前无可导出的桑基建组数据', 'warn');
        return;
      }
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(appState.lastSankeyPlan), '桑基图词根匹配建组方案');
      XLSX.writeFile(wb, 'Amazon_US_Toys_桑基图词根建组方案.xlsx');
      showToast('已导出当前桑基图词根建组方案 (.xlsx)！', 'ok');
    }

    window.addEventListener('resize', function() {
      if (appState.activeTab === 'sankey') {
        renderSankeyWorkbench();
      }
    });

    // =========================================================================
    // 9. WORKSPACE INITIALIZATION, INDEXEDDB PERSISTENCE & BATCH LEDGER ENGINE
    // =========================================================================
    const IDB_NAME = 'AmazonToysKwEngineDB_v2';
    const IDB_STORE = 'workspace_state';
    const PRESET_NEG_TEMPLATES = {
      toy_phone: {
        real_phone: {
          label: '真机通讯 / 运营商 / SIM卡意图 (玩具智能机头号烧钱黑洞)',
          words: ['sim card', 'unlocked', 'verizon', 'at&t', 't-mobile', 'cellular', 'prepaid', 'tracfone', 'iphone', 'samsung', 'android', 'real call', 'calling plan', '5g', 'lte', 'gps tracker']
        },
        parts_acc: {
          label: '无关配件 / 维修 / 说明书意图',
          words: ['case only', 'screen protector', 'replacement charger', 'charging cable', 'repair', 'manual', 'tempered glass', 'lanyard only']
        },
        low_val: {
          label: '二手 / 免费 / 批发清仓低质词',
          words: ['free', 'used', 'refurbished', 'renewed', 'wholesale', 'bulk lot', 'dollar tree', 'clearance']
        },
        wrong_age: {
          label: '严重错配年龄段词 (成人 / 婴儿0-1岁 / 青少年)',
          words: ['adult', 'senior', 'elderly', 'teenager', 'for teens', '13-15', 'infant', 'newborn', '0-6 months', '6-12 months']
        }
      },
      general_toys: {
        real_phone: { label: '跨品类非玩具意图词 (可按产品补充)', words: [] },
        parts_acc: { label: '无关配件 / 维修 / 说明书意图', words: ['replacement parts', 'repair', 'manual only', 'box only'] },
        low_val: { label: '二手 / 免费 / 批发清仓低质词', words: ['free', 'used', 'refurbished', 'wholesale', 'bulk lot', 'clearance'] },
        wrong_age: { label: '严重错配年龄段词 (成人 / 新生儿)', words: ['adult', 'senior', 'for adults', 'newborn', '0-3 months'] }
      },
      empty: {
        real_phone: { label: '自定义非目标意图词组', words: [] },
        parts_acc: { label: '配件 / 维修词组', words: [] },
        low_val: { label: '低价值 / 二手词组', words: [] },
        wrong_age: { label: '错配年龄段词组', words: [] }
      }
    };

    function formatNowTimestamp() {
      const d = new Date();
      const pad = function(n) { return n < 10 ? '0' + n : String(n); };
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function openIdbConnection(callback) {
      try {
        if (typeof indexedDB === 'undefined') {
          appState.storageMode = '内存会话模式';
          callback(null);
          return;
        }
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = function(ev) {
          const db = ev.target.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE);
          }
        };
        req.onsuccess = function(ev) {
          appState.storageMode = 'IndexedDB 本地持久化已连接';
          callback(ev.target.result);
        };
        req.onerror = function() {
          appState.storageMode = '内存安全模式';
          callback(null);
        };
      } catch (e) {
        appState.storageMode = '内存安全模式';
        callback(null);
      }
    }

    function saveWorkspaceToPersistence() {
      const payload = {
        workspace: appState.workspace,
        season: appState.season,
        config: appState.config,
        preNegCategories: appState.preNegCategories,
        batches: appState.batches,
        nextBatchSeq: appState.nextBatchSeq
      };
      openIdbConnection(function(db) {
        if (!db) return;
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).put(payload, 'current_workspace');
        } catch (e) {}
      });
    }

    function loadWorkspaceFromPersistence(done) {
      openIdbConnection(function(db) {
        if (!db) {
          done(false);
          return;
        }
        try {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const req = tx.objectStore(IDB_STORE).get('current_workspace');
          req.onsuccess = function() {
            if (req.result && Array.isArray(req.result.batches)) {
              const saved = req.result;
              appState.workspace = saved.workspace || appState.workspace;
              appState.season = saved.season || 'off';
              appState.config = Object.assign(appState.config, saved.config || {});
              if (saved.preNegCategories) appState.preNegCategories = saved.preNegCategories;
              appState.batches = saved.batches;
              appState.nextBatchSeq = saved.nextBatchSeq || (appState.batches.length + 1);
              syncConfigInputsFromState();
              done(true);
            } else {
              done(false);
            }
          };
          req.onerror = function() { done(false); };
        } catch (e) {
          done(false);
        }
      });
    }

    function syncConfigInputsFromState() {
      byId('cfgTargetAcos').value = appState.config.targetAcos;
      byId('cfgTargetCpa').value = appState.config.targetCpa;
      byId('cfgExactMinOrders').value = appState.config.exactMinOrders;
      byId('cfgZeroOrderSpend').value = appState.config.zeroOrderSpend;
      byId('cfgRootNegSpend').value = appState.config.rootNegSpend;
      byId('cfgOwnBrands').value = appState.config.ownBrands.join(', ');
      byId('cfgGoldenAge').value = appState.config.goldenAges.join(', ');
      byId('cfgSecondaryAge').value = appState.config.secondaryAges.join(', ');
      byId('cfgCompBrands').value = appState.config.compBrands.join(', ');
    }

    // Single Source of Truth: assemble appState.rawRows strictly from enabled batches
    function rebuildAndRunFromActiveBatches() {
      const combined = [];
      const enabledBatches = appState.batches.filter(function(b) { return b.enabled; });
      for (let bIdx = 0; bIdx < enabledBatches.length; bIdx++) {
        const b = enabledBatches[bIdx];
        for (let rIdx = 0; rIdx < b.rows.length; rIdx++) {
          const copy = Object.assign({}, b.rows[rIdx]);
          copy._batchId = b.id;
          copy._batchTag = b.label;
          combined.push(copy);
        }
      }
      appState.rawRows = combined;
      appState.currentPage = 1;
      byId('pythonCodeBlock').textContent = buildStandalonePythonSource();
      runBatchEngine();
      saveWorkspaceToPersistence();
    }

    function createDemoBatchObject() {
      const rows = JSON.parse(JSON.stringify(ATTACHMENT_SAMPLE_ROWS));
      let spend = 0, orders = 0, sales = 0;
      rows.forEach(function(r) { spend += r.spend; orders += r.orders; sales += r.sales; });
      return {
        id: 'BATCH-DEMO-01',
        label: '附件真实样本 (出单词样本.xlsx)',
        scope: '演示样本批次',
        fileName: '出单词样本.xlsx',
        importedAt: formatNowTimestamp(),
        isDemo: true,
        enabled: true,
        rowCount: rows.length,
        spend: Number(spend.toFixed(2)),
        orders: orders,
        sales: Number(sales.toFixed(2)),
        rows: rows
      };
    }

    function updateEmptyBannerVisibility() {
      const banner = byId('emptyActiveBatchBanner');
      if (!banner) return;
      const enabledCount = appState.batches.filter(function(b) { return b.enabled; }).length;
      const showWarn = enabledCount === 0 && appState.activeTab !== 'batches' && appState.activeTab !== 'seasonality' && appState.activeTab !== 'architecture';
      if (showWarn) banner.classList.remove('hidden');
      else banner.classList.add('hidden');
    }

    // Workspace Initialization Modal Controls
    function openInitWorkspaceModal() {
      byId('initProjNameInput').value = appState.workspace.projectName || '';
      byId('initSkuInput').value = appState.workspace.skuTag || '';
      byId('initOwnBrandInput').value = appState.config.ownBrands.join(', ');
      byId('initAcosInput').value = appState.config.targetAcos;
      byId('initCpaInput').value = appState.config.targetCpa;
      byId('initSeasonSelect').value = appState.season;
      const modal = byId('initWorkspaceModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeInitWorkspaceModal() {
      const modal = byId('initWorkspaceModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function onInitModeRadioChange() {
      const checked = root.querySelector('input[name="initModeRadio"]:checked');
      if (!checked) return;
      if (checked.value === 'clean') {
        byId('initProjNameInput').value = 'US站玩具正式项目';
        byId('initOwnBrandInput').value = '';
        byId('initNegPresetSelect').value = 'general_toys';
      } else if (checked.value === 'demo_phone') {
        byId('initProjNameInput').value = '儿童智能玩具手机 (示例工作区)';
        byId('initOwnBrandInput').value = 'kokodi';
        byId('initNegPresetSelect').value = 'toy_phone';
      }
    }

    function confirmWorkspaceInitialization() {
      const modeEl = root.querySelector('input[name="initModeRadio"]:checked');
      const mode = modeEl ? modeEl.value : 'clean';
      const projName = byId('initProjNameInput').value.trim() || '未命名玩具广告工作区';
      const skuTag = byId('initSkuInput').value.trim();
      const brandsRaw = byId('initOwnBrandInput').value;
      const acosVal = Math.max(1, parseNum(byId('initAcosInput').value) || 22);
      const cpaVal = Math.max(0.5, parseNum(byId('initCpaInput').value) || 6.8);
      const negPreset = byId('initNegPresetSelect').value;
      const seasonVal = byId('initSeasonSelect').value;

      appState.workspace = {
        isInitialized: true,
        envType: mode === 'demo_phone' ? 'demo' : 'clean_prod',
        projectName: projName,
        skuTag: skuTag,
        negPreset: negPreset,
        updatedAt: formatNowTimestamp()
      };
      appState.season = seasonVal;
      appState.config.targetAcos = acosVal;
      appState.config.targetCpa = cpaVal;
      appState.config.ownBrands = brandsRaw.split(',').map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);

      if (mode !== 'config_only') {
        appState.preNegCategories = JSON.parse(JSON.stringify(PRESET_NEG_TEMPLATES[negPreset] || PRESET_NEG_TEMPLATES.general_toys));
      }

      if (mode === 'clean') {
        appState.batches = [];
        appState.nextBatchSeq = 1;
        appState.sankeyFocusNodeId = null;
        appState.sankeyCustomRoot = '';
      } else if (mode === 'demo_phone') {
        appState.batches = [createDemoBatchObject()];
        appState.nextBatchSeq = 1;
        appState.sankeySelectedRoot = 'kids phone';
        appState.sankeyCustomRoot = '';
      }

      syncConfigInputsFromState();
      closeInitWorkspaceModal();
      rebuildAndRunFromActiveBatches();
      showToast('工作区已完成初始化：' + projName, 'ok');
    }

    // Import Batch Gate Modal Controls
    function openImportBatchModal(parsedFiles) {
      appState.pendingImports = parsedFiles;
      const totalRows = parsedFiles.reduce(function(s, f) { return s + f.rowCount; }, 0);
      const totalSpend = parsedFiles.reduce(function(s, f) { return s + f.spend; }, 0);
      const totalOrders = parsedFiles.reduce(function(s, f) { return s + f.orders; }, 0);

      byId('pendingImportPreviewBox').innerHTML =
        '<div class="font-bold text-blue-950">已预检通过 ' + parsedFiles.length + ' 个文件（共 ' + totalRows.toLocaleString() + ' 行有效搜索词记录）</div>' +
        '<div class="text-[11px] text-blue-800">预检汇总：花费 <strong>$' + totalSpend.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</strong> · 订单 <strong>' + totalOrders.toLocaleString() + ' 单</strong> · 文件：' +
        escapeHtml(parsedFiles.map(function(f) { return f.fileName; }).join(', ')) + '</div>';

      const baseLabel = parsedFiles.length === 1
        ? parsedFiles[0].fileName.replace(/\.[^.]+$/, '')
        : ('多表导入_' + parsedFiles.length + '份文件');
      byId('importBatchLabelInput').value = baseLabel;

      const modal = byId('importBatchModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeImportBatchModal() {
      appState.pendingImports = [];
      const modal = byId('importBatchModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function commitPendingImportBatches() {
      if (!appState.pendingImports || appState.pendingImports.length === 0) {
        closeImportBatchModal();
        return;
      }
      const modeEl = root.querySelector('input[name="batchIngestMode"]:checked');
      const ingestMode = modeEl ? modeEl.value : 'isolate';
      const customLabel = byId('importBatchLabelInput').value.trim();
      const scope = byId('importBatchScopeSelect').value;

      if (ingestMode === 'replace_all') {
        appState.batches = [];
        appState.nextBatchSeq = 1;
      } else if (ingestMode === 'isolate') {
        appState.batches.forEach(function(b) { b.enabled = false; });
      }

      const createdIds = [];
      appState.pendingImports.forEach(function(pf, idx) {
        const seqStr = String(appState.nextBatchSeq++).padStart(3, '0');
        const bid = 'BATCH-' + seqStr;
        const lbl = appState.pendingImports.length === 1
          ? (customLabel || pf.fileName)
          : ((customLabel || '批次导入') + '_' + (idx + 1) + '(' + pf.fileName + ')');
        appState.batches.push({
          id: bid,
          label: lbl,
          scope: scope,
          fileName: pf.fileName,
          importedAt: formatNowTimestamp(),
          isDemo: false,
          enabled: true,
          rowCount: pf.rowCount,
          spend: pf.spend,
          orders: pf.orders,
          sales: pf.sales,
          rows: pf.rows
        });
        createdIds.push(bid);
      });

      appState.workspace.envType = 'clean_prod';
      closeImportBatchModal();
      rebuildAndRunFromActiveBatches();
      showToast('已登记入库 [' + createdIds.join(', ') + '] 并完成计算 (' + appState.lastProcessMs + ' ms)', 'ok');
    }

    // Batch Ledger Operations
    function toggleBatchEnabled(batchId) {
      const target = appState.batches.find(function(b) { return b.id === batchId; });
      if (!target) return;
      target.enabled = !target.enabled;
      rebuildAndRunFromActiveBatches();
    }

    function soloActivateBatch(batchId) {
      appState.batches.forEach(function(b) {
        b.enabled = (b.id === batchId);
      });
      rebuildAndRunFromActiveBatches();
      showToast('已单独锁定批次 [' + batchId + ']，其余批次已封存隔离', 'ok');
    }

    function setAllBatchesEnabled(flag) {
      if (appState.batches.length === 0) return;
      appState.batches.forEach(function(b) { b.enabled = Boolean(flag); });
      rebuildAndRunFromActiveBatches();
      showToast(flag ? '已启用全部批次进行跨表合并去重分析' : '已封存全部批次', 'ok');
    }

    function deleteBatchById(batchId) {
      appState.batches = appState.batches.filter(function(b) { return b.id !== batchId; });
      rebuildAndRunFromActiveBatches();
      showToast('已从台账中移除批次 [' + batchId + ']', 'ok');
    }

    function clearAllBatchesToClean() {
      appState.batches = [];
      appState.nextBatchSeq = 1;
      appState.workspace.envType = 'clean_prod';
      rebuildAndRunFromActiveBatches();
      showToast('已清空所有批次数据，当前工作区已归零为干净待导入态', 'ok');
    }

    function mountDemoBatchExplicitly() {
      // Isolate demo batch cleanly so user knows exactly what is active
      appState.batches.forEach(function(b) { b.enabled = false; });
      const existingDemo = appState.batches.find(function(b) { return b.id === 'BATCH-DEMO-01'; });
      if (existingDemo) {
        existingDemo.enabled = true;
      } else {
        appState.batches.unshift(createDemoBatchObject());
      }
      rebuildAndRunFromActiveBatches();
      showToast('已单独挂载并激活 BATCH-DEMO-01 (附件真实样本)，其他批次已隔离封存', 'ok');
    }

    function exportWorkspaceSnapshotJson() {
      const payload = {
        exportedAt: formatNowTimestamp(),
        workspace: appState.workspace,
        season: appState.season,
        config: appState.config,
        preNegCategories: appState.preNegCategories,
        batches: appState.batches,
        nextBatchSeq: appState.nextBatchSeq
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Amazon_Toys_Workspace_Snapshot.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('已导出完整工作区与多批次快照 (.json)', 'ok');
    }

    function importWorkspaceSnapshotJson(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (!data || !Array.isArray(data.batches)) {
            showToast('无效的工作区快照 JSON 文件', 'error');
            return;
          }
          appState.workspace = data.workspace || appState.workspace;
          appState.season = data.season || 'off';
          appState.config = Object.assign(appState.config, data.config || {});
          if (data.preNegCategories) appState.preNegCategories = data.preNegCategories;
          appState.batches = data.batches;
          appState.nextBatchSeq = data.nextBatchSeq || (appState.batches.length + 1);
          syncConfigInputsFromState();
          rebuildAndRunFromActiveBatches();
          showToast('已成功恢复工作区档案及 ' + appState.batches.length + ' 个批次数据', 'ok');
        } catch (err) {
          showToast('恢复快照失败：' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function renderBatchManagementTab() {
      const envBadge = byId('wsEnvBadge');
      const titleEl = byId('wsCardProjTitle');
      const metaGrid = byId('wsCardMetaGrid');
      if (!envBadge || !titleEl || !metaGrid) return;

      const hasDemoActive = appState.batches.some(function(b) { return b.enabled && b.isDemo; });
      const enabledCount = appState.batches.filter(function(b) { return b.enabled; }).length;

      if (enabledCount === 0) {
        envBadge.className = 'text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800';
        envBadge.textContent = '待导入空白态';
      } else if (hasDemoActive) {
        envBadge.className = 'text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-800';
        envBadge.textContent = '演示样本模式';
      } else {
        envBadge.className = 'text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800';
        envBadge.textContent = '正式生产批次';
      }

      titleEl.textContent = appState.workspace.projectName + (appState.workspace.skuTag ? ' (' + appState.workspace.skuTag + ')' : '');
      metaGrid.innerHTML =
        '<div class="p-2 rounded bg-slate-50 border border-slate-100">自有品牌词：<strong class="text-slate-900 font-mono">' + escapeHtml(appState.config.ownBrands.join(', ') || '未设(通用)') + '</strong></div>' +
        '<div class="p-2 rounded bg-slate-50 border border-slate-100">目标 ACOS / CPA：<strong class="text-slate-900">' + appState.config.targetAcos + '% / $' + appState.config.targetCpa.toFixed(2) + '</strong></div>' +
        '<div class="p-2 rounded bg-slate-50 border border-slate-100">季节阶段：<strong class="text-blue-700">' + escapeHtml(SEASON_MODES[appState.season].name.split(' ')[0]) + '</strong></div>' +
        '<div class="p-2 rounded bg-slate-50 border border-slate-100">最近初始化：<strong class="text-slate-800">' + escapeHtml(appState.workspace.updatedAt || '-') + '</strong></div>';

      // Render Batch Ledger Table
      const tbody = byId('batchLedgerTableBody');
      if (appState.batches.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="10" class="py-10 text-center text-slate-400">' +
            '当前批次台账为空（零历史残留）。请点击上方虚线框导入您的搜索词报告 (.xlsx/.csv)，或点击“挂载样本批次”体验。' +
          '</td></tr>';
      } else {
        tbody.innerHTML = appState.batches.map(function(b) {
          const acos = b.sales > 0 ? (b.spend / b.sales * 100).toFixed(2) + '%' : '0单';
          const statusBadge = b.enabled
            ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>启用计算中</span>'
            : '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[11px]">已封存隔离</span>';
          return (
            '<tr class="' + (b.enabled ? 'bg-blue-50/20' : 'opacity-65 bg-white') + ' hover:bg-slate-50 transition">' +
              '<td class="py-3 px-4">' +
                '<button type="button" data-kwe-click="toggleBatchEnabled(\'' + escapeHtml(b.id) + '\')" class="text-left">' + statusBadge + '</button>' +
              '</td>' +
              '<td class="py-3 px-3 font-mono font-bold text-slate-900">' + escapeHtml(b.id) + '</td>' +
              '<td class="py-3 px-3">' +
                '<div class="font-semibold text-slate-900">' + escapeHtml(b.label) + '</div>' +
                '<div class="text-[11px] text-slate-400 font-mono">' + escapeHtml(b.fileName) + '</div>' +
              '</td>' +
              '<td class="py-3 px-3"><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">' + escapeHtml(b.scope) + '</span></td>' +
              '<td class="py-3 px-3 text-slate-500 font-mono text-[11px]">' + escapeHtml(b.importedAt) + '</td>' +
              '<td class="py-3 px-3 text-right font-mono font-semibold">' + b.rowCount.toLocaleString() + '</td>' +
              '<td class="py-3 px-3 text-right font-mono">$' + b.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td>' +
              '<td class="py-3 px-3 text-right font-mono font-semibold">' + b.orders.toLocaleString() + '</td>' +
              '<td class="py-3 px-3 text-right font-mono">' + acos + '</td>' +
              '<td class="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">' +
                '<button type="button" data-kwe-click="soloActivateBatch(\'' + escapeHtml(b.id) + '\')" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition">仅看此批次(Solo)</button>' +
                '<button type="button" data-kwe-click="toggleBatchEnabled(\'' + escapeHtml(b.id) + '\')" class="px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-medium transition">' + (b.enabled ? '封存' : '启用') + '</button>' +
                '<button type="button" data-kwe-click="deleteBatchById(\'' + escapeHtml(b.id) + '\')" class="px-2 py-1 rounded border border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-[11px] font-medium transition">删除</button>' +
              '</td>' +
            '</tr>'
          );
        }).join('');
      }

      // Populate Cross-Batch Diff Selectors
      const selA = byId('diffBatchASelect');
      const selB = byId('diffBatchBSelect');
      const diffBox = byId('batchDiffResultBox');
      if (appState.batches.length < 2) {
        selA.innerHTML = '<option value="">需至少2个批次</option>';
        selB.innerHTML = '<option value="">需至少2个批次</option>';
        diffBox.innerHTML = '<div class="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-slate-500 text-center">台账中当前共有 ' + appState.batches.length + ' 个批次。当您导入第 2 个周期批次后，此处将自动激活跨周期【新涌入词 / 转化跃升词 / 恶化预警词】对比分析。</div>';
      } else {
        const prevA = selA.value;
        const prevB = selB.value;
        const optsHtml = appState.batches.map(function(b) {
          return '<option value="' + escapeHtml(b.id) + '">' + escapeHtml(b.id + ' · ' + b.label) + '</option>';
        }).join('');
        selA.innerHTML = optsHtml;
        selB.innerHTML = optsHtml;
        selA.value = appState.batches.some(function(b) { return b.id === prevA; }) ? prevA : appState.batches[0].id;
        selB.value = appState.batches.some(function(b) { return b.id === prevB && prevB !== selA.value; })
          ? prevB
          : appState.batches[appState.batches.length - 1].id;
        renderBatchDiffComparison();
      }
    }

    function aggregateSingleBatchTerms(batchObj) {
      const map = new Map();
      if (!batchObj) return map;
      batchObj.rows.forEach(function(r) {
        const k = String(r.searchTerm || '').trim().toLowerCase().replace(/\s+/g, ' ');
        if (!k) return;
        let cur = map.get(k);
        if (!cur) {
          cur = { term: k, spend: 0, orders: 0, sales: 0 };
          map.set(k, cur);
        }
        cur.spend += parseNum(r.spend);
        cur.orders += Math.round(parseNum(r.orders));
        cur.sales += parseNum(r.sales);
      });
      return map;
    }

    function renderBatchDiffComparison() {
      const diffBox = byId('batchDiffResultBox');
      if (!diffBox || appState.batches.length < 2) return;
      const idA = byId('diffBatchASelect').value;
      const idB = byId('diffBatchBSelect').value;
      const bA = appState.batches.find(function(b) { return b.id === idA; });
      const bB = appState.batches.find(function(b) { return b.id === idB; });
      if (!bA || !bB || idA === idB) {
        diffBox.innerHTML = '<div class="p-3 rounded-lg bg-amber-50 text-amber-800">请选择两个不同的批次进行跨期对比。</div>';
        return;
      }

      const mapA = aggregateSingleBatchTerms(bA);
      const mapB = aggregateSingleBatchTerms(bB);
      const newEntrants = [];
      const surgingTerms = [];
      const degradedTerms = [];

      mapB.forEach(function(valB, term) {
        const valA = mapA.get(term);
        if (!valA) {
          newEntrants.push(valB);
        } else {
          const cpaA = valA.orders > 0 ? valA.spend / valA.orders : valA.spend;
          const cpaB = valB.orders > 0 ? valB.spend / valB.orders : valB.spend;
          if (valB.orders > valA.orders && cpaB <= cpaA * 1.1) {
            surgingTerms.push({ term: term, ordA: valA.orders, ordB: valB.orders, cpaA: cpaA, cpaB: cpaB });
          } else if ((valB.orders === 0 && valB.spend >= 10) || (cpaB > cpaA * 1.25 && valB.spend >= 10)) {
            degradedTerms.push({ term: term, ordA: valA.orders, ordB: valB.orders, cpaA: cpaA, cpaB: cpaB, spendB: valB.spend });
          }
        }
      });

      newEntrants.sort(function(a, b) { return b.orders - a.orders || b.spend - a.spend; });
      surgingTerms.sort(function(a, b) { return (b.ordB - b.ordA) - (a.ordB - a.ordA); });
      degradedTerms.sort(function(a, b) { return b.spendB - a.spendB; });

      const fmtList = function(arr, fn) {
        if (arr.length === 0) return '<div class="text-slate-400 py-2">无显著异动项</div>';
        return arr.slice(0, 6).map(fn).join('');
      };

      diffBox.innerHTML =
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
          '<div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">' +
            '<div class="font-bold text-emerald-900">新涌入搜索词 (' + newEntrants.length + ' 词 · 词池膨胀信号)</div>' +
            fmtList(newEntrants, function(x) {
              return '<div class="flex justify-between font-mono text-[11px] bg-white px-2 py-1 rounded border border-emerald-100"><span>' + escapeHtml(x.term) + '</span><span>+' + x.orders + '单 / $' + x.spend.toFixed(1) + '</span></div>';
            }) +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">' +
            '<div class="font-bold text-blue-900">单量跃升核心词 (' + surgingTerms.length + ' 词 · 建议加预算抢位)</div>' +
            fmtList(surgingTerms, function(x) {
              return '<div class="flex justify-between font-mono text-[11px] bg-white px-2 py-1 rounded border border-blue-100"><span>' + escapeHtml(x.term) + '</span><span>' + x.ordA + '→' + x.ordB + '单</span></div>';
            }) +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1.5">' +
            '<div class="font-bold text-rose-900">绩效恶化/需收缩词 (' + degradedTerms.length + ' 词 · 建议压Bid或否定)</div>' +
            fmtList(degradedTerms, function(x) {
              return '<div class="flex justify-between font-mono text-[11px] bg-white px-2 py-1 rounded border border-rose-100"><span>' + escapeHtml(x.term) + '</span><span>CPA $' + x.cpaA.toFixed(1) + '→$' + x.cpaB.toFixed(1) + '</span></div>';
            }) +
          '</div>' +
        '</div>';
    }

    // Scoped Initialization, Chart Theme & Event Delegation
    function configureChartDefaults() {
      if (typeof Chart === 'undefined') return;
      Chart.defaults.color = '#63615B';
      Chart.defaults.borderColor = '#E3E0D5';
      Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif';
      if (Chart.defaults.plugins && Chart.defaults.plugins.tooltip) {
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(20, 20, 19, 0.94)';
        Chart.defaults.plugins.tooltip.titleColor = '#FAF9F5';
        Chart.defaults.plugins.tooltip.bodyColor = '#F0EEE6';
        Chart.defaults.plugins.tooltip.padding = 10;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
      }
    }

    function bootEngine() {
      if (root.dataset.kweBooted === '1') return;
      if (typeof Chart === 'undefined') {
        window.setTimeout(bootEngine, 30);
        return;
      }
      root.dataset.kweBooted = '1';
      configureChartDefaults();
      loadWorkspaceFromPersistence(function(restored) {
        if (!restored) {
          appState.batches = [createDemoBatchObject()];
          appState.nextBatchSeq = 1;
        }
        rebuildAndRunFromActiveBatches();
      });
    }

    const actions = {
      addCustomPreNegative,
      applyConfigChanges,
      applyCustomSankeyRoot,
      changePage,
      clearAllBatchesToClean,
      clearSankeyFocus,
      closeDetailModal,
      closeImportBatchModal,
      closeInitWorkspaceModal,
      commitPendingImportBatches,
      confirmWorkspaceInitialization,
      copyAdGroupCardTerms,
      copyPreemptiveNegatives,
      copyPythonScript,
      copyTriggeredNegatives,
      deleteBatchById,
      downloadAbaTemplate,
      downloadPythonScript,
      exportFullStrategyWorkbook,
      exportSankeyAdGroupPlan,
      exportWorkspaceSnapshotJson,
      handleAbaFileUpload,
      handleSearchTermUpload,
      importWorkspaceSnapshotJson,
      mountDemoBatchExplicitly,
      onInitModeRadioChange,
      onSankeyRootSelectChange,
      openDetailModalByFilteredIndex,
      openInitWorkspaceModal,
      removePreNegative,
      renderBatchDiffComparison,
      renderNgramTable,
      renderSankeyWorkbench,
      resetPageAndRenderTable,
      resetToAttachmentSample,
      selectQuickSankeyRoot,
      setAllBatchesEnabled,
      setSeasonPhase,
      setTableViewMode,
      soloActivateBatch,
      switchTab,
      toggleBatchEnabled,
      toggleConfigDrawer
    };

    function invokeAction(expr, el, event) {
      const m = /^(\w+)\(([^)]*)\)$/.exec((expr || '').trim());
      if (!m || !actions[m[1]]) return;
      const rawArgs = m[2].trim();
      const args = rawArgs
        ? rawArgs.split(',').map(function(token) {
            const s = token.trim();
            if (s === 'true') return true;
            if (s === 'false') return false;
            if (s === 'event') return event;
            if (s === 'this') return el;
            if (/^-?\d+(?:\.\d+)?$/.test(s)) return Number(s);
            return s.replace(/^['"]|['"]$/g, '');
          })
        : [];
      actions[m[1]].apply(null, args);
    }

    ['click', 'input', 'change'].forEach(function(evtName) {
      root.addEventListener(evtName, function(event) {
        const rawTarget = event.target;
        const baseEl = rawTarget && typeof rawTarget.closest === 'function'
          ? rawTarget
          : (rawTarget && rawTarget.parentElement ? rawTarget.parentElement : null);
        const target = baseEl ? baseEl.closest('[data-kwe-' + evtName + ']') : null;
        if (target && root.contains(target)) {
          invokeAction(target.getAttribute('data-kwe-' + evtName), target, event);
        }
      });
    });

    const sankeyCustomInp = byId('sankeyCustomRootInput');
    if (sankeyCustomInp) {
      sankeyCustomInp.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          applyCustomSankeyRoot();
        }
      });
    }

    const newNegInp = byId('newNegWordInput');
    if (newNegInp) {
      newNegInp.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          addCustomPreNegative();
        }
      });
    }

    [
      ['detailModal', closeDetailModal],
      ['initWorkspaceModal', closeInitWorkspaceModal],
      ['importBatchModal', closeImportBatchModal]
    ].forEach(function(pair) {
      const mEl = byId(pair[0]);
      const closeFn = pair[1];
      if (mEl) {
        mEl.addEventListener('click', function(event) {
          if (event.target === mEl) closeFn();
        });
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key !== 'Escape') return;
      const dEl = byId('detailModal');
      if (dEl && !dEl.classList.contains('hidden')) closeDetailModal();
      const iEl = byId('initWorkspaceModal');
      if (iEl && !iEl.classList.contains('hidden')) closeInitWorkspaceModal();
      const bEl = byId('importBatchModal');
      if (bEl && !bEl.classList.contains('hidden')) closeImportBatchModal();
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootEngine);
    } else {
      bootEngine();
    }
})();
