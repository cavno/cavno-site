/* 原附件数据、策略规则与内嵌 Python 保留；仅限定页面作用域并适配配色。 */
(()=>{'use strict';const root=document.getElementById('toys-keyword-app');if(!root)return;const byId=id=>root.querySelector('[id="'+id+'"]');

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
      datasetName: '附件真实样本 (出单词样本.xlsx)',
      season: 'off',
      activeTab: 'workbench',
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
      // Update Header Badge & Season Bar
      byId('datasetBadge').textContent =
        appState.datasetName + ' (' + appState.processedRaw.length.toLocaleString() + '行 / ' + appState.dedupTerms.length.toLocaleString() + '唯一词)';

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
        bDedup.className = 'px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white transition';
        bRaw.className = 'px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition';
      } else {
        bRaw.className = 'px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white transition';
        bDedup.className = 'px-3 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition';
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
                '<button type="button" data-kwe-click="openDetailModalByFilteredIndex(' + detailIdx + ')" class="px-2 py-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-medium transition">查看依据</button>' +
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
            { label: '广告销售额 ($)', data: salesData.map(function(v) { return Number(v.toFixed(2)); }), backgroundColor: '#48735A', borderRadius: 6 }
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
        '自有品牌词': '#94734E',
        '黄金适龄词': '#C15F3C',
        '高相关玩具属性词': '#48735A',
        '边缘高龄词': '#B18A44',
        '核心泛大词': '#A65341',
        '关联商品ASIN': '#5E8870',
        '节日礼物场景词': '#D97757',
        '前置高危否定词': '#8F4637'
      };

      const points = topTerms.map(function(t) {
        return {
          x: t.cvr,
          y: t.cpa,
          r: Math.max(5, Math.min(18, Math.sqrt(t.orders || 1) * 0.7)),
          term: t.searchTerm,
          intent: t.intent,
          orders: t.orders,
          bg: colorByIntent[t.intent] || '#777368'
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
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            fill: true,
            tension: 0.3,
            pointRadius: 3.5,
            pointBackgroundColor: PDF_SEASONAL_SERIES.map(function(d) {
              if (d.entries >= 300) return '#dc2626';
              if (d.entries >= 170) return '#B18A44';
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
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', dense: true });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
          if (!jsonRows || jsonRows.length === 0) {
            showToast('上传的表格内容为空，请检查表头与数据行', 'error');
            return;
          }
          const mapped = [];
          for (let i = 0; i < jsonRows.length; i++) {
            const m = mapRowColumns(jsonRows[i]);
            if (m.searchTerm && String(m.searchTerm).trim() !== '') {
              mapped.push(m);
            }
          }
          if (mapped.length === 0) {
            showToast('未能识别“用户搜索词 / Customer Search Term”列，请核对列名', 'error');
            return;
          }
          appState.datasetName = file.name;
          appState.rawRows = mapped;
          appState.currentPage = 1;
          runBatchEngine();
          showToast('成功批处理 ' + mapped.length.toLocaleString() + ' 行搜索词数据 (耗时 ' + appState.lastProcessMs + ' ms)', 'ok');
        } catch (err) {
          showToast('解析文件失败：' + err.message, 'error');
        }
      };
      reader.readAsArrayBuffer(file);
      event.target.value = '';
    }

    function resetToAttachmentSample() {
      appState.datasetName = '附件真实样本 (出单词样本.xlsx)';
      appState.rawRows = JSON.parse(JSON.stringify(ATTACHMENT_SAMPLE_ROWS));
      appState.currentPage = 1;
      runBatchEngine();
      showToast('已恢复为附件《出单词样本.xlsx》真实样本数据', 'ok');
    }

    function exportFullStrategyWorkbook() {
      if (typeof XLSX === 'undefined') {
        showToast('Excel 导出组件正在加载，请稍后重试', 'error');
        return;
      }
      const wb = XLSX.utils.book_new();

      // Sheet 1: Deduplicated Strategy Master
      const s1 = appState.dedupTerms.map(function(t) {
        return {
          '客户搜索词/ASIN': t.searchTerm,
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
      const tabs = ['workbench', 'ngram', 'negatives', 'seasonality', 'architecture'];
      for (let i = 0; i < tabs.length; i++) {
        const panel = byId('tabPanel_' + tabs[i]);
        const btn = byId('tabBtn_' + tabs[i]);
        if (tabs[i] === tabId) {
          panel.classList.remove('hidden');
          btn.classList.add('tab-btn-active');
          btn.classList.remove('text-slate-600');
        } else {
          panel.classList.add('hidden');
          btn.classList.remove('tab-btn-active');
          btn.classList.add('text-slate-600');
        }
      }
      if (tabId === 'workbench') renderWorkbenchCharts();
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
        '亚马逊美国站玩具类目 · 万级海量搜索词广告策略批处理引擎 (CLI 离线版)',
        '用法: python3 amazon_toys_kw_batch_processor.py --input 搜索词报告.xlsx --output 策略输出包.xlsx --season off',
        '季节参数 (--season): off (平季稳态) | ramp (10-11月初启动) | peak (黑五圣诞爆发) | shrink (12.21后收缩)',
        '"""',
        'import argparse',
        'import re',
        'from collections import defaultdict',
        'import numpy as np',
        'import pandas as pd',
        '',
        'OWN_BRANDS = ' + JSON.stringify(appState.config.ownBrands),
        'COMP_BRANDS = ' + JSON.stringify(appState.config.compBrands),
        'GOLDEN_AGES = ' + JSON.stringify(appState.config.goldenAges),
        'SECONDARY_AGES = ' + JSON.stringify(appState.config.secondaryAges),
        'PREEMPTIVE_NEG_PHRASES = ' + JSON.stringify(
          Object.values(appState.preNegCategories).reduce(function(acc, c) { return acc.concat(c.words); }, [])
        ),
        'GIFT_WORDS = ["gift", "gifts", "christmas", "xmas", "stocking", "birthday", "easter", "present", "holiday"]',
        'TOY_ATTRS = ["toy", "toys", "smart", "pretend", "play", "camera", "music", "learning", "educational", "cell"]',
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
        'def clean_num(series):',
        '    if pd.api.types.is_numeric_dtype(series):',
        '        return series.fillna(0.0).astype(float)',
        '    return pd.to_numeric(series.astype(str).str.replace(r"[$,%\\s,]", "", regex=True), errors="coerce").fillna(0.0)',
        '',
        'def stem_token(w):',
        '    mapping = {"phones": "phone", "toys": "toy", "gifts": "gift", "girls": "girl", "boys": "boy", "toddlers": "toddler"}',
        '    return mapping.get(w, w)',
        '',
        'def classify_intent(term):',
        '    t = term.strip().lower()',
        '    if ASIN_RE.match(t):',
        '        return "关联商品ASIN", True, None',
        '    for neg in PREEMPTIVE_NEG_PHRASES:',
        '        if neg in t:',
        '            return "前置高危否定词", False, neg',
        '    if any(b in t for b in OWN_BRANDS):',
        '        return "自有品牌词", False, None',
        '    if any(cb in t for cb in COMP_BRANDS):',
        '        return "竞品品牌词", False, None',
        '    if any(g in t for g in GIFT_WORDS):',
        '        return "节日礼物场景词", False, None',
        '    if any(sa in t for sa in SECONDARY_AGES):',
        '        return "边缘高龄词", False, None',
        '    if any(ga in t for ga in GOLDEN_AGES):',
        '        return "黄金适龄词", False, None',
        '    if any(ta in t for ta in TOY_ATTRS):',
        '        return "高相关玩具属性词", False, None',
        '    return "核心泛大词", False, None',
        '',
        'def run_pipeline(input_path, output_path, season="off", target_acos=22.0, target_cpa=6.8, exact_orders=5, zero_spend=14.0, root_neg_spend=25.0):',
        '    sc = SEASON_CFG[season]',
        '    eff_acos = target_acos * sc["acos_k"]',
        '    eff_cpa = target_cpa * sc["cpa_k"]',
        '    df = pd.read_csv(input_path) if input_path.lower().endswith(".csv") else pd.read_excel(input_path)',
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
        '',
        '    work = pd.DataFrame()',
        '    work["search_term"] = df[col_map["term"]].astype(str).str.strip().str.lower()',
        '    work["ad_type"] = df[col_map["ad_type"]].astype(str) if "ad_type" in col_map else "SP-Manual"',
        '    work["source_match"] = df[col_map["match"]].astype(str) if "match" in col_map else "未知"',
        '    work["spend"] = clean_num(df[col_map["spend"]])',
        '    work["orders"] = clean_num(df[col_map["orders"]]).round().astype(int)',
        '    work["sales"] = clean_num(df[col_map["sales"]])',
        '    cpc_raw = clean_num(df[col_map["cpc"]]) if "cpc" in col_map else pd.Series(0.0, index=df.index)',
        '    work["clicks"] = clean_num(df[col_map["clicks"]]).round().astype(int) if "clicks" in col_map else np.where(cpc_raw > 0, np.maximum(1, np.round(work["spend"] / cpc_raw)), 0).astype(int)',
        '    work["channel_tag"] = work["ad_type"] + "·" + work["source_match"]',
        '',
        '    # Step 1: 跨活动同词聚合 O(N)',
        '    agg = work.groupby("search_term", as_index=False).agg(',
        '        channels=("channel_tag", lambda s: " + ".join(sorted(set(s)))),',
        '        channel_rows=("channel_tag", "count"),',
        '        clicks=("clicks", "sum"),',
        '        spend=("spend", "sum"),',
        '        orders=("orders", "sum"),',
        '        sales=("sales", "sum"),',
        '    )',
        '    agg["cpc"] = np.where(agg["clicks"] > 0, agg["spend"] / agg["clicks"], 0.85)',
        '    agg["cvr_pct"] = np.where(agg["clicks"] > 0, agg["orders"] / agg["clicks"] * 100, 0.0)',
        '    agg["cpa"] = np.where(agg["orders"] > 0, agg["spend"] / agg["orders"], agg["spend"])',
        '    agg["acos_pct"] = np.where(agg["sales"] > 0, agg["spend"] / agg["sales"] * 100, np.where(agg["spend"] > 0, 999.0, 0.0))',
        '',
        '    # Step 2: N-Gram 词根穿透统计',
        '    gram_stats = defaultdict(lambda: [0, 0.0, 0, 0.0, set()])',
        '    for row in agg.itertuples(index=False):',
        '        if ASIN_RE.match(row.search_term):',
        '            continue',
        '        toks = [stem_token(t) for t in re.sub(r"[^a-z0-9-\\s]", " ", row.search_term).split() if t not in STOPWORDS]',
        '        grams = set(t for t in toks if len(t) >= 2) | set(f"{toks[i]} {toks[i+1]}" for i in range(len(toks)-1))',
        '        for g in grams:',
        '            st = gram_stats[g]',
        '            st[0] += row.clicks; st[1] += row.spend; st[2] += row.orders; st[3] += row.sales; st[4].add(row.search_term)',
        '',
        '    # Step 3: 策略分流与竞价计算',
        '    decisions, neg_records = [], []',
        '    for row in agg.itertuples(index=False):',
        '        intent, is_asin, pre_hit = classify_intent(row.search_term)',
        '        conf = min(1.0, max(0.35, row.clicks / 40.0))',
        '        ratio = 1.0 + ((eff_acos / row.acos_pct) - 1.0) * conf if row.acos_pct > 0 and row.acos_pct < 900 else 0.65',
        '        sug_bid = round(row.cpc * min(1.35, max(0.45, ratio)) * sc["bid_k"], 2)',
        '',
        '        if pre_hit:',
        '            act, bucket, iso, sug_bid = "坚决不投·前置词组否定", "黑名单拦截库", f"全活动词组否定 [{pre_hit}]", 0.0',
        '            neg_records.append((pre_hit, "前置高危词根否定", "Negative Phrase", "全部活动", row.spend, row.orders))',
        '        elif (row.orders == 0 and row.spend >= zero_spend) or (row.orders > 0 and row.cpa > eff_cpa * 1.85 and row.cvr_pct < 8.0):',
        '            act, bucket, iso, sug_bid = "停止投放·绩效精准否定", "绩效止损淘汰池", "源活动精准否定", 0.0',
        '            neg_records.append((row.search_term, "单点绩效止损", "Negative Exact", row.channels, row.spend, row.orders))',
        '        elif is_asin:',
        '            act, bucket, iso = "商品定位·精准ASIN投放", "C6-高转关联ASIN专案", "SP-Auto内否定该ASIN防抢单"',
        '        elif intent == "自有品牌词":',
        '            act, bucket, iso = "精准匹配(主)+品牌词组", "C1-品牌防御专案", "SP-Auto及非品牌活动词组否定品牌词"',
        '            neg_records.append((row.search_term, "品牌防御剥离隔离", "Negative Exact/Phrase", "SP-Auto及常规非品牌组", row.spend, row.orders))',
        '        elif intent == "边缘高龄词":',
        '            act, bucket, iso = "独立高龄组·精准控Bid", "C4-边缘年龄/泛词独立控价专案", "从主力3-5岁混合组中精准否定剥离"',
        '            sug_bid = round(sug_bid * 0.9, 2)',
        '        elif intent == "节日礼物场景词":',
        '            act = "旺季脉冲·词组+限定宽泛" if sc["gift"] else "淡季/节后收缩·暂停泛投"',
        '            bucket, iso = "C5-旺季礼物脉冲专案", "必挂前置否词库；12月21日关停"',
        '        elif intent in ("黄金适龄词", "高相关玩具属性词") and row.orders >= exact_orders and row.acos_pct <= eff_acos * 1.25:',
        '            act, bucket, iso = "主力精准(打排名)+受控词组", "C2-核心大词与黄金适龄精准专案", "源Auto/泛词组执行毕业精准否定"',
        '            neg_records.append((row.search_term, "高转词毕业隔离", "Negative Exact", "源SP-Auto/拓词词组组", row.spend, row.orders))',
        '        elif intent in ("黄金适龄词", "高相关玩具属性词"):',
        '            act, bucket, iso = "受控词组匹配(拓长尾)", "C3-黄金年龄与属性受控词组专案", "必挂第一层真机/错配年龄前置否定库"',
        '        else:',
        '            act, bucket, iso = "独立泛词专案·控Bid禁宽泛", "C4-边缘年龄/泛词独立控价专案", "严禁平季裸跑宽泛，强挂真机前置否词库"',
        '        decisions.append((*row, intent, act, bucket, sug_bid, iso))',
        '',
        '    for g, st in gram_stats.items():',
        '        if st[2] == 0 and st[1] >= root_neg_spend:',
        '            neg_records.append((g, f"N-Gram连坐止损(覆盖{len(st[4])}词)", "Negative Phrase", "全部自动/词组/宽泛组", round(st[1], 2), 0))',
        '',
        '    out_cols = list(agg.columns) + ["语义分类", "推荐匹配方式", "归属标准专案", "建议竞价($)", "源活动隔离与否定动作"]',
        '    res_df = pd.DataFrame(decisions, columns=out_cols).sort_values("orders", ascending=False)',
        '    neg_df = pd.DataFrame(neg_records, columns=["否定目标", "否定层级", "否定匹配方式", "作用范围", "涉及花费($)", "涉及订单"]).drop_duplicates()',
        '    ngram_df = pd.DataFrame([',
        '        {"词根": g, "覆盖词数": len(v[4]), "点击": v[0], "花费($)": round(v[1], 2), "订单": v[2], "销售额($)": round(v[3], 2)}',
        '        for g, v in gram_stats.items()',
        '    ]).sort_values(["订单", "花费($)"], ascending=False)',
        '',
        '    with pd.ExcelWriter(output_path, engine="openpyxl") as writer:',
        '        res_df.to_excel(writer, sheet_name="1_投放与匹配策略总表", index=False)',
        '        neg_df.to_excel(writer, sheet_name="2_前置与动态否定清单", index=False)',
        '        ngram_df.to_excel(writer, sheet_name="3_词根NGram聚合表", index=False)',
        '    print(f"[完成] 共处理 {len(work):,} 条原始记录 -> {len(res_df):,} 个唯一搜索词，已保存至: {output_path}")',
        '',
        'if __name__ == "__main__":',
        '    parser = argparse.ArgumentParser(description="Amazon US Toys 万级关键词广告批处理引擎")',
        '    parser.add_argument("--input", required=True, help="输入的搜索词报告 (.xlsx / .csv)")',
        '    parser.add_argument("--output", default="Amazon_Toys_Ad_Strategy_Output.xlsx", help="输出的策略工作簿路径")',
        '    parser.add_argument("--season", choices=["off", "ramp", "peak", "shrink"], default="off", help="季节阶段")',
        '    args = parser.parse_args()',
        '    run_pipeline(args.input, args.output, season=args.season)'
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

    // Boot Application
    window.addEventListener('DOMContentLoaded', function() {
      appState.rawRows = JSON.parse(JSON.stringify(ATTACHMENT_SAMPLE_ROWS));
      byId('pythonCodeBlock').textContent = buildStandalonePythonSource();
      runBatchEngine();
    });
  
const actions={addCustomPreNegative,applyConfigChanges,changePage,closeDetailModal,copyPreemptiveNegatives,copyPythonScript,copyTriggeredNegatives,downloadAbaTemplate,downloadPythonScript,exportFullStrategyWorkbook,handleAbaFileUpload,handleSearchTermUpload,openDetailModalByFilteredIndex,removePreNegative,renderNgramTable,resetPageAndRenderTable,resetToAttachmentSample,setSeasonPhase,setTableViewMode,switchTab,toggleConfigDrawer};
function invoke(text,el,event){const m=/^(\w+)\(([^)]*)\)$/.exec(text||'');if(!m||!actions[m[1]])return;const args=m[2].trim()?m[2].split(',').map(s=>{s=s.trim();if(s==='event')return event;if(s==='this')return el;return /^-?\d+$/.test(s)?Number(s):s.replace(/^['"]|['"]$/g,'');}):[];actions[m[1]](...args);}
for(const eventName of ['click','change','input'])root.addEventListener(eventName,event=>{const el=event.target.closest('[data-kwe-'+eventName+']');if(el&&root.contains(el))invoke(el.getAttribute('data-kwe-'+eventName),el,event);});
})();
