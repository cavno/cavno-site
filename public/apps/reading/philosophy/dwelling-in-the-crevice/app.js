/* 原文和交互模型来自附件；仅调整配色、作用域和输入显示。 */
(()=>{'use strict';
const root=document.getElementById('crevice-app');if(!root)return;
const byId=id=>root.querySelector('[id="'+id+'"]');
const escapeText=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

    // Mobile Menu Toggle
    const mobileMenuBtn = byId('mobile-menu-btn');
    const mobileMenu = byId('mobile-menu');
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden'); mobileMenuBtn.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
    });
    root.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => { mobileMenu.classList.add('hidden');mobileMenuBtn.setAttribute('aria-expanded','false'); });
    });

    // =========================================================================
    // 1. HERO INTERACTIVE CANVAS: Crevice Lamps, Bridges & Sisyphus
    // =========================================================================
    const canvas = byId('crevice-canvas');
    const ctx = canvas.getContext('2d');
    let heroMode = 'crevice'; // 'crevice' or 'sisyphus'
    let particles = [];
    let lamps = [];
    let mousePos = { x: -1000, y: -1000 };
    let boulderAngle = 0;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      initCanvasElements();
    }

    function initCanvasElements() {
      particles = [];
      const count = Math.min(85, Math.floor(canvas.width / 16));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 2.2 + 0.8,
          gold: Math.random() > 0.35
        });
      }
      // Initial Crevice Lamps
      lamps = [
        { x: canvas.width * 0.28, y: canvas.height * 0.55, radius: 55, pulse: 0 },
        { x: canvas.width * 0.52, y: canvas.height * 0.48, radius: 70, pulse: 1.5 },
        { x: canvas.width * 0.74, y: canvas.height * 0.58, radius: 60, pulse: 3.0 }
      ];
    }

    function setHeroMode(mode) {
      heroMode = mode;
      const btnCrevice = byId('hero-btn-crevice');
      const btnSisyphus = byId('hero-btn-sisyphus');
      if (mode === 'crevice') {
        btnCrevice.className = 'px-3.5 py-1.5 rounded-lg text-xs font-medium bg-creviceGold text-obsidian transition shadow';
        btnSisyphus.className = 'px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-warmWhite hover:bg-white/20 transition';
      } else {
        btnSisyphus.className = 'px-3.5 py-1.5 rounded-lg text-xs font-medium bg-absurdTerracotta text-warmWhite transition shadow';
        btnCrevice.className = 'px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-warmWhite hover:bg-white/20 transition';
      }
    }

    function triggerCreviceLight() {
      const x = canvas.width * (0.2 + Math.random() * 0.65);
      const y = canvas.height * (0.35 + Math.random() * 0.35);
      lamps.push({ x, y, radius: 65, pulse: Math.random() * 3 });
      if (lamps.length > 9) lamps.shift();
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      lamps.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 65,
        pulse: 0
      });
      if (lamps.length > 10) lamps.shift();
    });

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Tectonic Crevice Line across the middle
      ctx.save();
      ctx.beginPath();
      const midY = canvas.height * 0.54;
      ctx.moveTo(0, midY + 40);
      ctx.lineTo(canvas.width * 0.25, midY - 15);
      ctx.lineTo(canvas.width * 0.48, midY + 25);
      ctx.lineTo(canvas.width * 0.72, midY - 30);
      ctx.lineTo(canvas.width, midY + 10);
      ctx.strokeStyle = heroMode === 'crevice' ? 'rgba(193, 95, 60, 0.25)' : 'rgba(193, 95, 60, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      if (heroMode === 'crevice') {
        // Draw Bridges between lamps
        for (let i = 0; i < lamps.length; i++) {
          const l = lamps[i];
          l.pulse += 0.03;
          const grad = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.radius + Math.sin(l.pulse) * 12);
          grad.addColorStop(0, 'rgba(217, 119, 87, 0.6)');
          grad.addColorStop(0.4, 'rgba(193, 95, 60, 0.18)');
          grad.addColorStop(1, 'rgba(250, 249, 245, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(l.x, l.y, l.radius + 15, 0, Math.PI * 2);
          ctx.fill();

          // Core lamp dot
          ctx.fillStyle = '#D97757';
          ctx.beginPath();
          ctx.arc(l.x, l.y, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Bridge lines to next lamp
          if (i < lamps.length - 1) {
            const next = lamps[i + 1];
            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.quadraticCurveTo((l.x + next.x) / 2, Math.min(l.y, next.y) - 35, next.x, next.y);
            ctx.strokeStyle = 'rgba(193, 95, 60, 0.32)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      } else {
        // Sisyphus Slope & Boulder Mode
        boulderAngle += 0.008;
        const progress = (Math.sin(boulderAngle) + 1) / 2; // 0 to 1
        const startX = canvas.width * 0.25;
        const startY = canvas.height * 0.75;
        const endX = canvas.width * 0.78;
        const endY = canvas.height * 0.25;

        ctx.beginPath();
        ctx.moveTo(startX - 60, startY + 50);
        ctx.lineTo(endX + 40, endY - 35);
        ctx.strokeStyle = 'rgba(193, 95, 60, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        const bx = startX + (endX - startX) * progress;
        const by = startY + (endY - startY) * progress - 18;

        // Glow around Sisyphus boulder
        const bGrad = ctx.createRadialGradient(bx, by, 4, bx, by, 55);
        bGrad.addColorStop(0, 'rgba(193, 95, 60, 0.65)');
        bGrad.addColorStop(1, 'rgba(250, 249, 245, 0)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bx, by, 55, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#C15F3C';
        ctx.beginPath();
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw Floating Philosophical Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.gold ? 'rgba(193, 95, 60, 0.55)' : 'rgba(74, 144, 226, 0.45)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Connect near mouse or near particles
        const dxMouse = p.x - mousePos.x;
        const dyMouse = p.y - mousePos.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.strokeStyle = `rgba(193, 95, 60, ${1 - distMouse / 130})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animateCanvas);
    }

    // =========================================================================
    // 2. MODULE 1 DATA: Five-Element Spiral & Western History Matrix
    // =========================================================================
    const spiralNodesData = [
      {
        id: 0,
        name: '悲剧 Tragedy',
        subtitle: '存在的基底（必然实存）：你无法掌控结局',
        color: '#C15F3C',
        badgeClass: 'bg-absurdTerracotta/20 text-absurdTerracotta border-absurdTerracotta/40',
        question: '为何善人受难、恶人得志？为何理性解放反而制造系统牢笼？',
        worldview: '有秩序但内含结构性裂隙（命运偶然、系统压迫、人性自反、认知颠倒）',
        subjectState: '抗争、崇高、承担、明知必败依然迎战',
        emotion: '悲痛、怜悯与恐惧（Catharsis 净化与精神成熟）',
        function: '破除盲目乐观主义与“完满人生”幻象，让人认清存在的有限、脆弱与残酷，为真实生存奠基。',
        thinkers: '索福克勒斯、亚里士多德、奥古斯丁、霍克海默、阿多诺、马克思、韩炳哲',
        quote: '“悲剧不是例外，是常态；苦难不是偏差，是结构；不公不是偶然，是必然。拒绝承认悲剧、执着追求完满，恰恰是现代人焦虑与崩溃的根源。”'
      },
      {
        id: 1,
        name: '虚无 Nihilism',
        subtitle: '悲剧的历史化与普遍化（根基崩塌）：没有现成的意义',
        color: '#94734E',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
        question: '当上帝已死、最高价值自行贬黜，没有终极担保时我们凭什么生活？',
        worldview: '意义的“上方”空了（现实被判为不应当存在，理想被发现并不实存——两头落空）',
        subjectState: '空虚、倦怠、相对主义冷漠、当代犬儒主义（“看透一切却照做”）、躺平或功利崇拜',
        emotion: '厌倦、无聊、孤立、无意义焦虑',
        function: '揭示一切价值设定的历史性与可贬黜性。虚无本身不是终点，而是一个必须被经历到底并穿越的“零点”。',
        thinkers: '尼采、陀思妥耶夫斯基、韦伯（祛魅与铁笼）、海德格尔（存在遗忘与座架）',
        quote: '“人最难忍受的不是痛苦本身，而是痛苦的无意义。在古代，悲剧是少数英雄的命运；在现代，当一切意义框架失效，每个普通人都可能在日常中遭遇意义的崩塌。”'
      },
      {
        id: 2,
        name: '荒诞 The Absurd',
        subtitle: '穿越虚无后的最高清醒（彻底祛魅）：不要自欺',
        color: '#9C7530',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
        question: '在一切终极叙事退场后，人如何清醒地面对一个沉默的世界？',
        worldview: '世界本身不合理、沉默；荒诞产生于“人对意义的强烈渴求”与“世界沉默”的对峙关系之中',
        subjectState: '清醒、对峙、无幻、拒绝自欺（既不跳入虚假宗教/历史幻象，也不向自杀或犬儒投降）',
        emotion: '清醒的骄傲、紧张、直面巨石的庄严喜悦',
        function: '对虚无主义的第一次克服：终结一切虚假救赎与宏大叙事自欺，把人逼入赤裸真实的现代生存（反抗、自由、激情）。',
        thinkers: '加缪（《西西弗神话》《反抗者》）、鲁迅（《野草·过客/希望》）、托马斯·内格尔',
        quote: '“西西弗斯的伟大，不在于抵达终点，而在于明知徒劳、明知循环，依然坚定推动巨石。荒诞把人带到自由的门口，但现代人还需追问：巨石为何如此沉重？山坡是谁修筑的？”'
      },
      {
        id: 3,
        name: '自由 Freedom',
        subtitle: '清醒之后的余地与全书枢纽（开放的反身性）：你仍然可以回应',
        color: '#48735A',
        badgeClass: 'bg-lucidCyan/20 text-lucidCyan border-lucidCyan/40',
        question: '在命运、结构与人性的重重约束之中，人究竟还有多大的自由？',
        worldview: '结构划定可能性空间的边界与形状，但不填满这一空间；有限自由永远不为零',
        subjectState: '开放的反身性（向经验、他人、未来开放）；态度承担、识破伪自由、可及处开端、联合改变结构',
        emotion: '焦虑（自由的眩晕）与承担的勇气',
        function: '五元体系的枢纽：把荒诞的清醒转化为行动的可能，把“上方空了”转化为“空间被打开了”，为救赎提供支点。',
        thinkers: '斯多亚派、康德、萨特、波伏娃、阿伦特、吉登斯、H.法兰克福、泰勒、霍耐特、森',
        quote: '“没有自由，悲剧只是命运，虚无只是深渊，荒诞只是僵局；正因为有自由，救赎才成为可能。这份自由很小，小到常只是一次态度、一次识破；又很大，大到足以开启救赎。”'
      },
      {
        id: 4,
        name: '救赎 Redemption',
        subtitle: '主体与世界的共同重建（后形而上学安居）：去回应，并且不是一个人',
        color: '#C15F3C',
        badgeClass: 'bg-creviceGold/20 text-creviceGold border-creviceGold/40',
        question: '在不可消除的裂隙中，现代人如何重建尊严、生成意义并一起安居？',
        worldview: '裂隙永恒存在，但意义在行动、相互承认、文化共鸣与制度改造中真实生成',
        subjectState: '自我挺立与共在安居（接纳悲剧→穿越虚无→直面荒诞→主动赋义→共在建构）',
        emotion: '安宁、感激、共鸣、不虚妄的希望',
        function: '在个体、文化、社会三个层面共同完成意义重建。不是消除裂隙，而是在裂隙上搭建桥梁、点亮灯火、彼此照看。',
        thinkers: '蒂利希、列维纳斯、哈贝马斯、霍耐特、罗萨（共鸣）、弗兰克尔、马克思、儒释道传统',
        quote: '“‘挺立’是一个人在风暴中站住；‘安居’则是许多人在风暴之后一起建造一个可以栖身的地方。救赎之所以可能，正在于自由；之所以不终极，正在于自由有限；之所以需要共在，正在于自由依赖条件。”'
      }
    ];

    function selectSpiralNode(idx) {
      const data = spiralNodesData[idx];
      // Highlight SVG circle
      for (let i = 0; i < 5; i++) {
        const c = byId(`node-circle-${i}`);
        if (c) {
          c.setAttribute('r', i === 4 ? (i === idx ? '40' : '35') : (i === idx ? '31' : '25'));
          c.setAttribute('fill', i === idx ? '#F3DFD4' : '#FFFFFF');
        }
      }
      const card = byId('spiral-detail-card');
      card.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-bold border ${data.badgeClass}">0${idx + 1} · ${data.name}</span>
          <span class="text-xs text-mutedText">点击左侧罗盘节点或下方表格可切换</span>
        </div>
        <h3 class="font-philo text-2xl sm:text-3xl font-bold text-warmWhite mb-2">${data.subtitle}</h3>
        <p class="p-3.5 rounded-xl bg-obsidian/80 border-l-4 border-creviceGold text-xs sm:text-sm text-warmWhite/90 italic mb-5">
          ${data.quote}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-mutedText mb-1">核心追问：</div>
            <div class="text-warmWhite font-medium">${data.question}</div>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-mutedText mb-1">世界图景：</div>
            <div class="text-warmWhite font-medium">${data.worldview}</div>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-mutedText mb-1">主体状态与典型情绪：</div>
            <div class="text-warmWhite font-medium">${data.subjectState}（${data.emotion}）</div>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-mutedText mb-1">存在论功能：</div>
            <div class="text-warmWhite font-medium">${data.function}</div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-white/10 text-xs text-mutedText">
          <span class="text-creviceGold font-semibold">代表思想家：</span>${data.thinkers}
        </div>
      `;
    }

    function setSpiralMode(mode) {
      const connectPath = byId('spiral-connect-path');
      const fallPath = byId('spiral-fall-path');
      const ascendBtn = byId('spiral-mode-ascend');
      const fallBtn = byId('spiral-mode-fall');
      const statusBox = byId('spiral-status-box');

      if (mode === 'ascend') {
        connectPath.classList.remove('opacity-20');
        fallPath.classList.add('hidden');
        ascendBtn.className = 'px-2.5 py-1 rounded text-xs font-medium bg-creviceGold text-obsidian transition';
        fallBtn.className = 'px-2.5 py-1 rounded text-xs font-medium bg-white/10 text-mutedText hover:text-warmWhite transition';
        statusBox.innerHTML = `
          <div class="font-semibold text-creviceGold mb-1">当前模式：螺旋上升（有限自由作为每次重启的起点）</div>
          悲剧奠基实存 → 虚无掏空根基 → 荒诞确立清醒 → <span class="text-lucidCyan font-semibold">自由打开可能</span> → 救赎重构主体与世界。即便新苦难将人抛回悲剧，只要保有回应能力，螺旋就不会变成坠落。
        `;
      } else {
        connectPath.classList.add('opacity-20');
        fallPath.classList.remove('hidden');
        fallBtn.className = 'px-2.5 py-1 rounded text-xs font-medium bg-rose-600 text-warmWhite transition';
        ascendBtn.className = 'px-2.5 py-1 rounded text-xs font-medium bg-white/10 text-mutedText hover:text-warmWhite transition';
        statusBox.innerHTML = `
          <div class="font-semibold text-rose-400 mb-1">当前模式：单向坠落（缺失“自由”枢纽的病理结局）</div>
          当缺乏“开放的反身性”之自由：悲剧只剩盲目命运 → 虚无变成绝望深渊 → 荒诞的清醒凝固为“看透一切却什么都不做”的犬儒主义或自我剥削，最终永久沉沦。
        `;
      }
    }

    let simStep = 0;
    function simulateSpiralShock() {
      setSpiralMode('ascend');
      selectSpiralNode(simStep);
      const statusBox = byId('spiral-status-box');
      const stepMessages = [
        '【阶段 1/5 · 遭遇悲剧冲击】突发无常或系统挤压击碎日常完满幻象，进入悲剧实存处境...',
        '【阶段 2/5 · 跌入虚无零点】旧有努力回报叙事失效，“上方空了”，面临意义感真空...',
        '【阶段 3/5 · 抵达荒诞清醒】拒绝廉价鸡汤自欺，也拒绝向绝望投降，在沉默世界中清醒挺立...',
        '【阶段 4/5 · 启动自由枢纽】运用“开放的反身性”，区分可控与不可控，在可及范围内开启行动...',
        '【阶段 5/5 · 重返裂隙安居】在行动、他者共鸣与联合发声中生成真实意义，在更高层次上安居！'
      ];
      statusBox.innerHTML = `<div class="font-semibold text-creviceGold mb-1">⚡ 螺旋演进动态模拟中：</div>${stepMessages[simStep]}`;
      simStep = (simStep + 1) % 5;
    }

    // Historical Eras Matrix Data (Intro Section 2 Table)
    const historyErasData = [
      {
        era: '古希腊',
        concepts: '本原（ἀρχή）、存在、理念、实体',
        figures: '泰勒斯、巴门尼德、柏拉图、亚里士多德、苏格拉底',
        treatment: '个体生命问题主要在伦理学与悲剧艺术中处理，整体上从属于宇宙秩序与理念论体系。但苏格拉底提出“未经省察的人生不值得过”，开启了作为“精神修炼”与生活方式的古典传统。'
      },
      {
        era: '希腊化与罗马',
        concepts: '幸福、心灵宁静（Ataraxia）、顺应自然',
        figures: '斯多亚派（爱比克泰德、塞涅卡、奥勒留）、伊壁鸠鲁派、怀疑派',
        treatment: '城邦危机后生命问题居于中心，区分“在我们权能之内的”与“不在我们权能之内的”，但往往倾向于以理性的“不动心”消解个体苦难。'
      },
      {
        era: '中世纪',
        concepts: '上帝、存在与本质、共相之争、信仰与理性',
        figures: '奥古斯丁、托马斯·阿奎那、奥卡姆',
        treatment: '苦难与救赎被纳入神义论与恩典论框架。恶被解释为“善的匮乏”与自由意志的堕落，个体真实苦难痛感被宏大神圣秩序收纳与合理化。'
      },
      {
        era: '近代哲学',
        concepts: '认识论转向、思维与存在、理性与经验、知识的先验界限',
        figures: '笛卡尔、洛克、休谟、康德',
        treatment: '认识论居于绝对中心（“我思故我在”），个体被抽象为“认知主体”与普遍的“先验理性主体”，具体有限个体的生存苦难退居边缘。'
      },
      {
        era: '德国古典哲学',
        concepts: '绝对精神、辩证法、历史理性',
        figures: '费希特、谢林、黑格尔',
        treatment: '个体苦难被普遍性的历史理性“扬弃”。黑格尔把世界历史理解为自由意识的进步，同时坦然承认历史是各民族幸福与个人德行的“屠宰台”。'
      },
      {
        era: '19世纪中后期',
        concepts: '盲目意志、生存个体、上帝之死与价值重估、社会生产关系',
        figures: '叔本华、克尔凯郭尔、尼采、马克思、狄尔泰',
        treatment: '传统本体论—认识论结构松动！克尔凯郭尔呼喊“主观性即真理”，尼采诊断虚无主义，马克思要求“改变世界”，个体生存与社会处境首次成为独立主题。'
      },
      {
        era: '20世纪至今',
        concepts: '生存论—存在论转向（此在、边界处境、荒诞）与主体的解构/重建',
        figures: '胡塞尔、海德格尔、雅斯贝尔斯、萨特、加缪、法兰克福学派、福柯、列维纳斯、利科、哈贝马斯',
        treatment: '一方面完成从本体论/认识论向“生存论—存在论”的转向；另一方面弗洛伊德、结构主义、福柯彻底解构主体。当代任务是在多重中介世界中重建“有限而有能动性的主体”。'
      }
    ];

    function renderHistoryEras(activeIdx = 0) {
      const tabsContainer = byId('history-era-tabs');
      const contentBox = byId('history-era-content');
      tabsContainer.innerHTML = historyErasData.map((item, idx) => `
        <button data-ph-click="renderHistoryEras(${idx})" class="px-3 py-1.5 rounded-lg text-xs font-medium transition ${idx === activeIdx ? 'bg-creviceGold text-obsidian font-bold shadow' : 'bg-white/5 text-warmWhite/80 hover:bg-white/10'}">
          ${idx + 1}. ${item.era}
        </button>
      `).join('');

      const active = historyErasData[activeIdx];
      contentBox.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-4 border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-4">
            <div class="text-xs text-creviceGold font-semibold">${active.era}</div>
            <div class="font-philo font-bold text-lg text-warmWhite mt-1">${active.concepts}</div>
            <div class="text-xs text-mutedText mt-2"><span class="text-warmWhite/80">代表人物：</span>${active.figures}</div>
          </div>
          <div class="md:col-span-8 text-xs sm:text-sm text-warmWhite/90 leading-relaxed">
            <div class="text-xs text-lucidCyan font-semibold mb-1">对个体生命、苦难与救赎问题的处理：</div>
            ${active.treatment}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // 3. MODULE 2 DATA: Tragedy Lab (History Paradigms, 4 Archetypes, Composite)
    // =========================================================================
    const tragedyHistoryData = {
      greek: {
        title: '古希腊宿命悲剧：命运的盲目无情与人性的崇高抗争',
        subtitle: '第一原型：无辜受难的命运—偶然型悲剧（世界不是道德闭环）',
        cards: [
          {
            head: '俄狄浦斯王原型',
            body: '主体始终主动求真、承担责任、坚守德性，从未主动作恶，却被匿名命运裹挟犯下罪责。最终刺瞎双眼、自我放逐——毁灭不是道德惩罚，而是存在本身的无情裂隙，但人的回应彰显了尊严。'
          },
          {
            head: '亚里士多德《诗学》：过失与净化',
            body: '悲剧主人公既非大善也非大恶，而是品格较好的人因某种判断失误或无知（hamartia，非邪恶）由顺境转入逆境；通过引发怜悯与恐惧完成精神净化（catharsis），认清存在的有限性。'
          },
          {
            head: '尼采《悲剧的诞生》：日神 vs 酒神',
            body: '阿波罗（日神）赋予世界形式、秩序与个体界限幻象；狄奥尼索斯（酒神）揭示混沌、毁灭与无差别流变。悲剧瞬间撕开阿波罗假象，让人直面狄奥尼索斯式的存在本真。'
          }
        ]
      },
      medieval: {
        title: '中世纪基督教神义论悲剧：被造存在的有限裂隙与神义悖论',
        subtitle: '核心难题（Theodicy）：全善、全能、全知的上帝，为何允许无辜受难？',
        cards: [
          {
            head: '奥古斯丁：善的匮乏与被造有限性',
            body: '上帝创造的世界本为善，苦难并非实体，而是“善的匮乏”。人的悲剧来自双重局限：被造物的天然有限性 + 自由意志背离至善的堕落可能性。'
          },
          {
            head: '自由意志的双重性伏笔',
            body: '奥古斯丁把恶归因于自由意志的背离，这意味着自由从一开始就带有双重性：它既是人可能堕落（第三类悲剧）的原因，也是人可能回应恩典、走向救赎的前提。'
          },
          {
            head: '神义论的内在悖论（现代荒诞的伏笔）',
            body: '为了维护上帝至善，神义论必须将一切无辜受难解释为试炼、惩罚或救赎必经环节。结果个体真实的苦难痛感被宏大神义消解。当现代人拒绝这种合理化时，神义崩塌、荒诞降临。'
          }
        ]
      },
      modern: {
        title: '近现代四大悲剧范式：从“外在超验碾压”转为“人类自我生产”',
        subtitle: '没有暴君、没有恶魔，人类亲手建构的理性、系统与绩效成为牢笼',
        cards: [
          {
            head: '① 文明自反悲剧（启蒙辩证法）',
            body: '霍克海默、阿多诺《启蒙辩证法》：启蒙理性本为破除神话、解放人类，但工具理性化、科层制化后，反过来规训、计算、奴役创造者本身——解放手段异化为压迫牢笼。'
          },
          {
            head: '② 系统结构悲剧 & ③ 人性自反悲剧',
            body: '马克思与法兰克福学派揭示：个体勤奋善良却无力对抗阶级固化与资本逻辑（好人在坏结构中注定受挫）；同时主体在时间与权力中发生“活成讨厌的样子”与“屠龙少年终成恶龙”的自我背叛。'
          },
          {
            head: '④ 生命政治悲剧（伪自由与自我剥削）',
            body: '弗洛姆《逃避自由》揭示原子化孤独；韩炳哲《倦怠社会》揭示“你能够”取代“你应当”：人在“自我实现”幻象中主动压榨透支自己，在被奴役的同时坚信自己无比自由。'
          }
        ]
      }
    };

    function switchTragedyHistory(key) {
      ['greek', 'medieval', 'modern'].forEach(k => {
        const btn = byId(`th-btn-${k}`);
        btn.className = k === key
          ? 'px-4 py-2 rounded-xl text-xs font-semibold bg-absurdTerracotta text-warmWhite transition shadow'
          : 'px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-warmWhite/80 hover:bg-white/20 transition';
      });
      const data = tragedyHistoryData[key];
      byId('tragedy-history-panel').innerHTML = `
        <div class="mb-4">
          <div class="text-xs text-creviceGold font-semibold">${data.subtitle}</div>
          <h4 class="font-philo text-xl font-bold text-warmWhite mt-0.5">${data.title}</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${data.cards.map(c => `
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="font-philo font-bold text-sm text-absurdTerracotta mb-1.5">${c.head}</div>
              <p class="text-xs text-warmWhite/85 leading-relaxed">${c.body}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    const tragedyArchetypesData = [
      {
        title: '第一大类：偶然与命运性悲剧 —— 非人力可控的外部无常',
        motto: '共同特征：“我没有做错，但苦难依然降临。”（对应古希腊悲剧、约伯记）',
        subtypes: [
          { name: '无辜受害（无过错受难）', desc: '好人蒙冤、孩童生于战乱。道德与结果脱钩，德性不担保幸福，《约伯记》是最高原型。' },
          { name: '命运弄人（际遇错位）', desc: '相爱之人被时代拆散、抵达目标前夜遭遇变故。主观筹划被偶然性击穿，求而不得。' },
          { name: '意外倾覆（单次偶然清零）', desc: '突发重病、事故夺走亲人或倾家荡产。揭示人类世俗成就建立在极脆弱的条件之上。' },
          { name: '自然灾难与战争裹挟', desc: '地震、瘟疫等非人自然毁灭力，或普通人被动卷入大国博弈成为时代暴力的耗材。' }
        ]
      },
      {
        title: '第二大类：系统—结构性悲剧 —— 个体努力难以对抗的社会牢笼',
        motto: '共同特征：“个体无大错，但结构让个体注定失败或异化。”（对应马克思、法兰克福学派、韩炳哲）',
        subtypes: [
          { name: '系统制约（结构固化）', desc: '个体勤奋善良，但面对阶级固化、资本逻辑与体制限制，个人能动性无法改写结构条件。' },
          { name: '才华埋没（结构性遮蔽）', desc: '价值不等于被承认。社会筛选机制受权力、资本、地域左右，无数精神财富随个体湮灭。' },
          { name: '启蒙理性变铁笼（工具理性）', desc: '本为解放人的科学、科层制与量化考核，反过来成为冰冷计算和规训人的机器。' },
          { name: '伪自由（绩效社会操控）', desc: '权力内化为“自我实现”的欲望，人自愿参与对自己的无限剥削，陷入倦怠与抑郁。' }
        ]
      },
      {
        title: '第三大类：人性内在矛盾悲剧 —— 自我与人性逻辑带来的崩塌',
        motto: '共同特征：“毁灭种子存在于主体自身的性格、欲望与位置逻辑之中。”（对应莎士比亚、尼采）',
        subtypes: [
          { name: '屠龙少年终成恶龙', desc: '反抗压迫者在取得权力后被位置与权力逻辑同化，复刻旧体系的恶。仇恨本身不足以保证善。' },
          { name: '活成自己讨厌的样子', desc: '理想自我与现实自我断裂，在漫长生存妥协与社会驯化中，一步步在时间里背叛初心。' },
          { name: '欲望悖论（手段吞噬目的）', desc: '热烈追逐财富、名望或占有式的爱，实现后才发现手段早已摧毁了自己真正珍视的幸福。' }
        ]
      },
      {
        title: '第四大类：观念与认知颠倒的悲剧 —— 活在错误的自我理解之中',
        motto: '共同特征：“把枷锁当成自由，把伤害当成救赎。”（对应马克思意识形态批判、福柯话语理论）',
        subtypes: [
          { name: '幻象支配（拥抱枷锁）', desc: '个体将压迫自身的规范、意识形态内化为绝对真理，主动服从甚至狂热捍卫伤害自身的秩序。' },
          { name: '理想主义的幻灭悲剧', desc: '真诚投身宏大理想，最终见证理想被现实腐蚀或露出极权底色，精神支点彻底崩塌。' }
        ]
      }
    ];

    function selectTragedyArchetype(idx) {
      for (let i = 0; i < 4; i++) {
        const tab = byId(`arch-tab-${i}`);
        tab.className = i === idx
          ? 'p-2.5 rounded-xl text-xs font-medium bg-absurdTerracotta text-warmWhite text-left transition shadow'
          : 'p-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-warmWhite/80 text-left transition';
      }
      const data = tragedyArchetypesData[idx];
      byId('archetype-detail-box').innerHTML = `
        <div class="p-4 rounded-xl bg-obsidian/70 border border-white/10 mb-3">
          <div class="font-philo font-bold text-base text-warmWhite">${data.title}</div>
          <div class="text-xs text-creviceGold mt-1">${data.motto}</div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${data.subtypes.map(s => `
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div class="text-xs font-bold text-warmWhite mb-1">✦ ${s.name}</div>
              <p class="text-xs text-mutedText leading-relaxed">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    const compositeCasesData = [
      {
        name: '屠龙少年终成恶龙',
        weights: [
          { label: '第三类：人性内在矛盾（权力腐蚀与欲望同化）', pct: 50, color: 'bg-amber-500' },
          { label: '第二类：系统—结构性力量（位置本性重塑主体）', pct: 40, color: 'bg-absurdTerracotta' },
          { label: '第四类：认知颠倒（以崇高革命之名行压迫之实）', pct: 10, color: 'bg-purple-500' }
        ],
        desc: '本书剖析：这不仅是个人心性变坏（第三类），更是社会系统的权力结构对占据该位置者的必然同化（第二类）。因此加缪强调反抗必须有“限度”，制度必须有制衡。'
      },
      {
        name: '活成自己讨厌的样子',
        weights: [
          { label: '第二类：社会结构挤压与生存驯化', pct: 50, color: 'bg-absurdTerracotta' },
          { label: '第三类：主体在时间中的漫长妥协与自我背叛', pct: 40, color: 'bg-amber-500' },
          { label: '第四类：被世俗成功学话语重塑价值排序', pct: 10, color: 'bg-purple-500' }
        ],
        desc: '本书剖析：理想自我与现实自我的断裂，往往在无数个放弃“行动的自由（守住具体底线）”的瞬间里逐渐完成。出路在于区分必要妥协与不可退让的原则底线。'
      },
      {
        name: '战争中的普通人',
        weights: [
          { label: '第一类：命运与偶然（生于乱世、飞来横祸）', pct: 55, color: 'bg-rose-500' },
          { label: '第二类：制度权力结构与大国博弈系统', pct: 35, color: 'bg-absurdTerracotta' },
          { label: '第四类：狂热民族主义或意识形态幻象动员', pct: 10, color: 'bg-purple-500' }
        ],
        desc: '本书剖析：在宏观上是人为的制度与权力冲突（第二类），但落到具体普通人身上，则是无法选择时代的无辜受难（第一类）。'
      },
      {
        name: '绩效内卷中的过劳青年',
        weights: [
          { label: '第二类：晚期资本主义与算法科层制系统结构', pct: 45, color: 'bg-absurdTerracotta' },
          { label: '第四类：伪自由幻象（把自我剥削当自我实现）', pct: 40, color: 'bg-purple-500' },
          { label: '第三类：优绩主义焦虑下的自我苛责', pct: 15, color: 'bg-amber-500' }
        ],
        desc: '本书剖析：韩炳哲《倦怠社会》典型样本。外在竞争结构（第二类）通过“你能够”的意识形态内化为主体欲望（第四类），唯有通过“理解的自由”识破幻象并与他人联合才能突围。'
      }
    ];

    function loadCompositeCase(idx) {
      for (let i = 0; i < 4; i++) {
        const btn = byId(`comp-btn-${i}`);
        btn.className = i === idx
          ? 'p-2.5 rounded-xl text-xs font-medium bg-creviceGold text-obsidian text-left transition shadow'
          : 'p-2.5 rounded-xl text-xs font-medium bg-white/10 text-warmWhite hover:bg-white/15 text-left transition';
      }
      const c = compositeCasesData[idx];
      byId('composite-analysis-box').innerHTML = `
        <div class="font-philo font-bold text-sm text-creviceGold">复合样本解构：${c.name}</div>
        <div class="space-y-2.5">
          ${c.weights.map(w => `
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-warmWhite/90">${w.label}</span>
                <span class="font-bold text-creviceGold">${w.pct}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div class="h-full ${w.color}" style="width: ${w.pct}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
        <p class="text-xs text-mutedText leading-relaxed pt-2 border-t border-white/10">${c.desc}</p>
      `;
    }

    // =========================================================================
    // 4. MODULE 3 DATA: Nihilism Differentiation, Social Roots & Absurdity Sim
    // =========================================================================
    const nihilismDiffData = [
      { name: '怀疑论', claim: '对知识的可能性悬置判断（Epoché）', diff: '怀疑论只是怀疑，虚无主义则是直接否定；古代怀疑论追求心灵宁静（Ataraxia），并不否定生活本身的价值。' },
      { name: '相对主义', claim: '真理与价值相对于特定个人或文化', diff: '相对主义仍然承认价值存在，只是加工否认其普遍绝对性；但彻底的相对主义极易滑向道德虚无主义。' },
      { name: '悲观主义', claim: '世界上的痛苦在数量上多于快乐（如叔本华）', diff: '悲观主义仍然保有一个鲜明的价值判断（即“痛苦是坏的”），而虚无主义连这一价值判断本身也予以否定。' },
      { name: '犬儒主义', claim: '看穿崇高话语与宏大叙事背后的虚伪', diff: '现代犬儒主义是“看透了一切虚伪却照样参与其中”（斯劳特戴克称为“启蒙了的虚假意识”），常是虚无的日常形态。' },
      { name: '悲剧', claim: '存在秩序有裂隙，德性与福报不相匹配', diff: '悲剧中意义与崇高仍在场，只是受到了伤害与碾压；虚无中则是用来承载苦难的意义根基本身被彻底掏空。' },
      { name: '荒诞', claim: '人的意义渴求与世界的不合理沉默相对峙', diff: '荒诞是穿越虚无后达成的清醒关系意识；它既不制造虚假意义自欺，也绝不向虚无投降，而是以反抗挺立。' }
    ];

    function renderNihilismDiff(idx = 0) {
      const btns = byId('nihilism-diff-btns');
      btns.innerHTML = nihilismDiffData.map((d, i) => `
        <button data-ph-click="renderNihilismDiff(${i})" class="px-2.5 py-1 rounded-lg text-xs font-medium transition ${i === idx ? 'bg-purple-500 text-warmWhite' : 'bg-white/10 text-warmWhite/80 hover:bg-white/15'}">
          vs ${d.name}
        </button>
      `).join('');
      const item = nihilismDiffData[idx];
      byId('nihilism-diff-card').innerHTML = `
        <div class="text-purple-300 font-bold mb-1">【${item.name}】核心主张：${item.claim}</div>
        <div class="text-warmWhite/90 leading-relaxed"><span class="text-creviceGold font-semibold">与虚无的界限：</span>${item.diff}</div>
      `;
    }

    const nihilismManifestData = [
      {
        title: '1. 价值相对主义与道德冷漠',
        sub: '“各有各的道理”“与我无关”',
        roots: ['资本逻辑（交换价值还原一切）', '城市化与高流动性（共同体解体）'],
        analysis: '当一切价值被视为纯粹主观偏好，公共善与他者苦难便被悬置，个体退缩回原子化的自我保护壳中。'
      },
      {
        title: '2. 消费主义与娱乐至死',
        sub: '“买即是爱”“乐即是义”',
        roots: ['资本逻辑（商品拜物教）', '算法与注意力经济（即时多巴胺刺激）'],
        analysis: '用不断更新的符号消费与感官娱乐填补意义的空洞，一旦停止消费或退出屏幕，巨大的空虚便立刻反扑。'
      },
      {
        title: '3. 当代犬儒主义',
        sub: '斯劳特戴克：“启蒙了的虚假意识”',
        roots: ['理性化与科层制（铁笼无力感）', '政治的去参与化（公民变旁观者）'],
        analysis: '看透一切体制与话语的虚伪，却带着疲倦而讽刺的冷笑照样迎合规则——因为觉得任何反抗都毫无意义。'
      },
      {
        title: '4. “躺平”与功利崇拜的两极',
        sub: '放弃奋斗 vs 唯“有用”是从',
        roots: ['加速与功绩社会（自我剥削至倦怠）', '资本逻辑（人的价格化）'],
        analysis: '看似相反的两极，实则共享同一个虚无前提：除了生存竞争与世俗效用之外，世界上没有任何真正值得追求的内在价值。'
      },
      {
        title: '5. 历史虚无与理想主义消解',
        sub: '对一切超越性承诺的不信任',
        roots: ['宏大叙事破产后的防卫机制', '算法解构一切深度历史脉络'],
        analysis: '正当的祛魅反思若缺乏新的价值支点，便容易滑向对人类一切崇高努力、真诚奉献与历史连续性的嘲弄。'
      },
      {
        title: '6. 原子化与人际深度疏离',
        sub: '“社交很多，朋友很少”',
        roots: ['城市化与高流动性（脱嵌）', '加速社会（时间贫困与共鸣丧失）'],
        analysis: '人际关系沦为短暂的情绪交换或利益工具，缺乏需要时间沉淀的承诺、信任与相互承认。'
      },
      {
        title: '7. AI与算法时代的意义危机',
        sub: '“我做的事还有什么意义？”',
        roots: ['算法与注意力经济（斯蒂格勒）', '自动化对劳动与创造意义的稀释'],
        analysis: '信息过载使人对真假漠然；当写作、绘画、编程等创造性活动可由机器瞬间生成，人类首次普遍怀疑自身创造与劳动的独特价值。'
      }
    ];

    function renderNihilismManifest(idx = 0) {
      const list = byId('nihilism-manifest-list');
      list.innerHTML = nihilismManifestData.map((m, i) => `
        <button data-ph-click="renderNihilismManifest(${i})" class="w-full text-left p-2.5 rounded-xl text-xs transition border ${i === idx ? 'bg-purple-500/20 border-purple-400 text-warmWhite' : 'bg-white/5 border-white/5 text-warmWhite/75 hover:bg-white/10'}">
          <div class="font-bold">${m.title}</div>
          <div class="text-[11px] text-mutedText mt-0.5">${m.sub}</div>
        </button>
      `).join('');

      const active = nihilismManifestData[idx];
      byId('nihilism-root-detail').innerHTML = `
        <div>
          <div class="text-xs text-purple-300 font-semibold uppercase">当前剖析症状</div>
          <h4 class="font-philo text-lg font-bold text-warmWhite mt-1">${active.title}</h4>
          <p class="text-xs text-warmWhite/85 mt-2 leading-relaxed">${active.analysis}</p>
          <div class="mt-4 pt-3 border-t border-white/10">
            <div class="text-xs font-semibold text-creviceGold mb-2">🔗 对应的社会结构根源（3.5节）：</div>
            <div class="space-y-1.5">
              ${active.roots.map(r => `
                <div class="p-2 rounded-lg bg-purple-950/40 border border-purple-400/30 text-xs text-purple-200 font-medium">
                  ⚙️ ${r}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-white/10 text-[11px] text-mutedText">
          六大社会根源总览：①资本逻辑（马克思异化） ②理性化与科层制（韦伯铁笼） ③政治去参与化（阿伦特） ④城市化与流动性 ⑤加速与功绩社会（罗萨/韩炳哲） ⑥算法与注意力经济（斯蒂格勒）。
        </div>
      `;
    }

    // Absurdity Simulator
    function updateAbsurdSimulator() {
      const longing = parseInt(byId('absurd-longing-slider').value, 10);
      const lucidity = parseInt(byId('absurd-lucidity-slider').value, 10);
      byId('absurd-longing-val').textContent = longing + '%';
      byId('absurd-lucidity-val').textContent = lucidity + '%';

      const resBox = byId('absurd-sim-result');
      if (longing < 40) {
        resBox.className = 'p-3.5 rounded-lg bg-purple-950/40 border border-purple-400/40 text-xs leading-relaxed';
        resBox.innerHTML = `<span class="font-bold text-purple-300">当前状态：滑向消极虚无主义 / 犬儒躺平</span><br/>当你放弃了对意义的追问与渴求，人与世界之间的张力便消失了。这并非荒诞的清醒，而是尼采所说的“末人”状态——“看透一切、什么都无所谓”的冷漠沉沦。`;
      } else if (lucidity < 45) {
        resBox.className = 'p-3.5 rounded-lg bg-rose-950/40 border border-rose-400/40 text-xs leading-relaxed';
        resBox.innerHTML = `<span class="font-bold text-rose-300">当前状态：哲学自杀 / 宏大幻象自欺</span><br/>你保有对意义的强烈渴求，却因无法承受世界的沉默而放下了清醒，重新投向某种虚假的终极保证（迷信、狂热意识形态、成功学偶像），以此遮蔽裂隙。`;
      } else {
        resBox.className = 'p-3.5 rounded-lg bg-creviceGold/15 border border-creviceGold/50 text-xs leading-relaxed';
        resBox.innerHTML = `<span class="font-bold text-creviceGold">当前状态：加缪与鲁迅式的“荒诞清醒对峙”（反抗 · 自由 · 激情）</span><br/>你既不放弃对意义与正义的追问（${longing}%），也绝不用虚假幻象欺骗自己（${lucidity}%）。在这种清醒的张力中，西西弗斯把推石变成自己的事，并准备跨入第五章的“有限自由”！`;
      }
    }

    function resetAbsurdSliders() {
      byId('absurd-longing-slider').value = 90;
      byId('absurd-lucidity-slider').value = 95;
      updateAbsurdSimulator();
    }

    // =========================================================================
    // 5. MODULE 4 DATA: 5 Pseudo-Freedoms Diagnostic & 5 Levels of Freedom
    // =========================================================================
    function updatePseudoDiagnostic() {
      const scores = [0, 1, 2, 3, 4].map(i => {
        const val = parseInt(byId(`pf-slider-${i}`).value, 10);
        byId(`pf-score-${i}`).textContent = `${val} / 10`;
        return val;
      });

      const totalPct = Math.round((scores.reduce((a, b) => a + b, 0) / 50) * 100);
      byId('pf-total-badge').textContent = `反身性开放指数：${totalPct}%`;

      // Update SVG Radar Polygon
      // Center is (120, 120), max radius is 95
      const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI) / 5, -Math.PI / 2 + (4 * Math.PI) / 5, -Math.PI / 2 + (6 * Math.PI) / 5, -Math.PI / 2 + (8 * Math.PI) / 5];
      const pts = scores.map((s, idx) => {
        const r = (s / 10) * 92;
        const x = (120 + r * Math.cos(angles[idx])).toFixed(1);
        const y = (120 + r * Math.sin(angles[idx])).toFixed(1);
        return `${x},${y}`;
      }).join(' ');
      byId('pf-radar-poly').setAttribute('points', pts);

      // Find lowest dimension to offer targeted critical insight
      const names = ['消费自由', '表达自由', '绩效自由', '退出自由', '精神自由'];
      const advices = [
        '【消费自由预警】警惕鲍德里亚所说的“符号编码”：试着练习“不以购买来定义自我价值”，在下单前开启“二阶意志”追问这是否是被广告植入的欲望。',
        '【表达自由预警】警惕韩炳哲与祖博夫揭示的“监控资本主义与情绪流量”：减少在算法回音室中的情绪宣泄，转向真实、可辩驳、有倾听的面对面对话。',
        '【绩效自由预警】最典型的韩炳哲“功绩主体自我剥削”：你正在用封闭的反身性监控自己。请立刻为自己划定不可侵犯的休息与“无用”时间！',
        '【退出自由预警】赫希曼提醒：单纯个体化的撤离（断联/躺平）会让不合理的结构毫发无损。尝试在自我保护之后重建真实关系，或将退出与集体“发声”结合。',
        '【精神自由预警】警惕伯林所说的“退守内心城堡”与伊卢兹批判的“把社会问题心理化”：内心平静应当成为理解处境与行动的起点，而非逃避现实的鸦片。'
      ];
      let minIdx = 0;
      for (let i = 1; i < 5; i++) {
        if (scores[i] < scores[minIdx]) minIdx = i;
      }

      const reportBox = byId('pf-report-box');
      let statusTitle = '';
      if (totalPct >= 75) {
        statusTitle = '<span class="text-emerald-400 font-bold">诊断结论：高度开放的反身性主体</span>';
      } else if (totalPct >= 48) {
        statusTitle = '<span class="text-creviceGold font-bold">诊断结论：处境拉锯中的半开放反身性</span>';
      } else {
        statusTitle = '<span class="text-absurdTerracotta font-bold">诊断结论：高度受制于“伪自由”支配机制</span>';
      }

      reportBox.innerHTML = `
        <div>${statusTitle}</div>
        <p class="text-warmWhite/90">${advices[minIdx]}</p>
        <div class="text-[11px] text-mutedText pt-1 border-t border-white/10">
          当前最薄弱环节：<span class="text-creviceGold font-semibold">${names[minIdx]}（${scores[minIdx]}/10）</span>
        </div>
      `;
    }

    function resetPseudoTest() {
      const defaults = [6, 5, 4, 6, 5];
      defaults.forEach((v, i) => {
        byId(`pf-slider-${i}`).value = v;
      });
      updatePseudoDiagnostic();
    }

    // 5 Conceptual Levels of Freedom Data (Section 5.6)
    const freedomLevelsData = [
      {
        level: '第五层（最厚）：社会自由与实质自由',
        thinkers: '黑格尔、马克思、霍耐特（承认理论）、阿马蒂亚·森（实质自由/能力）',
        meaning: '在相互承认的社会关系与合理制度中实现自由，并拥有实际去做、去成为的能力与闲暇时间（马克思“缩短工作日”）。',
        lack: '自由沦为少数人的形式特权；或沦为原子化孤立的个人自由，缺乏社会支撑。'
      },
      {
        level: '第四层：实践自由（自律与开端）',
        thinkers: '康德（自律）、萨特（自由与责任）、阿伦特（行动作为“开端”）',
        meaning: '按照自己经开放反思后真正认可的理由行动，打破日常惯性，并勇敢为行动的后果承担责任。',
        lack: '知而不行（看透一切却无行动的犬儒）；或盲目冲动、行而不负责。'
      },
      {
        level: '第三层【核心枢纽】：反身自由（开放的反身性）',
        thinkers: 'H.法兰克福（二阶意志）、泰勒（强评价）、阿切尔（内在对话）、吉登斯',
        meaning: '对自身的欲望、选项与处境本身进行开放的评价与修正。没有它，前两层自由就会沦为被操纵的伪自由；有了它，才能通向实践与社会自由。',
        lack: '被欲望、习惯、算法与绩效意识形态驱动而不自知，把枷锁当自由。'
      },
      {
        level: '第二层：选择自由',
        thinkers: '市场自由主义、消费社会理论',
        meaning: '在给定的外部选项（商品、职业、生活方式）中进行挑选。',
        lack: '选项匮乏；或者选项极其丰富却已被系统预先编码与征用（消费伪自由）。'
      },
      {
        level: '第一层（底线）：消极自由',
        thinkers: '洛克、密尔、以赛亚·伯林',
        meaning: '免于外在强制与非法干涉的领域（法治、人身权利与言论保障），是一切自由的底线。',
        lack: '人身安全、基本权利与言论受到直接的外部强制压制。'
      }
    ];

    function renderFreedomLevels(activeIdx = 2) {
      const stack = byId('freedom-levels-stack');
      stack.innerHTML = freedomLevelsData.map((item, idx) => {
        const isPivot = idx === 2;
        const isActive = idx === activeIdx;
        return `
          <button data-ph-click="renderFreedomLevels(${idx})" class="w-full text-left p-3 rounded-xl text-xs transition border flex items-center justify-between ${
            isActive
              ? 'bg-lucidCyan/20 border-lucidCyan text-warmWhite shadow'
              : isPivot
              ? 'bg-creviceGold/10 border-creviceGold/40 text-creviceGold hover:bg-creviceGold/20'
              : 'bg-white/5 border-white/10 text-warmWhite/80 hover:bg-white/10'
          }">
            <span class="font-bold">${item.level}</span>
            <span class="text-[11px] opacity-80">${isPivot ? '★ 全书枢纽层' : '点击查看'}</span>
          </button>
        `;
      }).join('');

      const active = freedomLevelsData[activeIdx];
      byId('freedom-level-detail').innerHTML = `
        <div class="font-philo font-bold text-sm text-lucidCyan mb-1">${active.level}</div>
        <div class="text-[11px] text-creviceGold mb-2">代表思想家：${active.thinkers}</div>
        <p class="text-warmWhite/90 leading-relaxed mb-2"><span class="text-mutedText">核心含义：</span>${active.meaning}</p>
        <p class="text-rose-300/90 leading-relaxed"><span class="text-mutedText">缺失时的病理：</span>${active.lack}</p>
      `;
    }

    // =========================================================================
    // 6. MODULE 5 DATA: 12 Redemption Paths, Freedom Map Builder & 5 Situations
    // =========================================================================
    const redemptionPathsData = [
      { id: 1, cat: 'individual', name: '1. 信仰的跳跃与存在的勇气', thinkers: '克尔凯郭尔、蒂利希、马里翁', desc: '在承认无意义焦虑的前提下，仍然接受自己“已被接纳”；把存在的勇气植根于“存在本身”。' },
      { id: 2, cat: 'individual', name: '2. 价值重估与生命肯定', thinkers: '尼采', desc: '把虚无主义经历到底并抛在身后，以创造新价值、热爱命运（Amor fati）与承受“永恒轮回”的考验来肯定生命。' },
      { id: 3, cat: 'relation', name: '3. 存在之思与诗意栖居', thinkers: '海德格尔', desc: '从现代技术的“座架（Gestell）”中退后一步，以“泰然任之”的态度与物、与大地、与世界重新相处。' },
      { id: 4, cat: 'individual', name: '4. 反抗、限度与爱', thinkers: '加缪、鲁迅', desc: '清醒地直面荒诞并坚持反抗，同时承认反抗的“限度”，以对共同人性的爱为反抗定向（“我反抗，故我们存在”）。' },
      { id: 5, cat: 'relation', name: '5. 他者伦理（为他人的责任）', thinkers: '列维纳斯', desc: '第一哲学是伦理学。意义首先来自面对“他者的面容”时不可推卸的无限责任，而非孤立自我的实现。' },
      { id: 6, cat: 'social', name: '6. 交往理性与相互承认', thinkers: '哈贝马斯、霍耐特、泰勒', desc: '意义在自由平等的对话与“爱、法律、社会尊重”三重相互承认中生成；克服蔑视与不被承认的社会病理。' },
      { id: 7, cat: 'relation', name: '7. 共鸣理论与沉思生活', thinkers: '哈特穆特·罗萨、韩炳哲', desc: '克服加速社会的异化，重建与人、物、世界的双向“回应与共鸣关系”；恢复驻留、倾听与深度注意力。' },
      { id: 8, cat: 'individual', name: '8. 回归平凡与日常语言', thinkers: '斯坦利·卡维尔、维特根斯坦', desc: '放弃对超验绝对确定性的执念，在日常语言与具体平凡生活中重新发现世界的可亲近性。' },
      { id: 9, cat: 'individual', name: '9. 意义疗法与存在心理治疗', thinkers: '弗兰克尔、欧文·亚隆', desc: '人最根本的动机是“求意义的意志”；通过创造工作、爱的体验以及面对不可逃避苦难时的态度来实现意义。' },
      { id: 10, cat: 'relation', name: '10. 东方智慧：生生、逍遥与空', thinkers: '孔孟、老庄、禅宗、西谷启治', desc: '儒家的“生生”与伦理责任链条，道家的“无为”与逍遥，禅宗的“平常心”，京都学派西谷启治以“空”超越西方虚无。' },
      { id: 11, cat: 'social', name: '11. 社会批判与改造实践', thinkers: '马克思、法兰克福学派、共和主义', desc: '意义的缺失有其深刻的资本与制度根源；唯有改造异化的劳动与社会条件，才能使大多数人过上有意义的生活。' },
      { id: 12, cat: 'social', name: '12. 能力方法与实质自由', thinkers: '阿马蒂亚·森、玛莎·努斯鲍姆', desc: '自由不仅是不受干涉，更是实际“能够”做什么、成为什么；扩大人的实质能力，就是扩大意义生成的空间。' }
    ];

    function filterRedemptionPaths(cat) {
      ['all', 'individual', 'relation', 'social'].forEach(c => {
        const btn = byId(`rp-filter-${c}`);
        btn.className = c === cat
          ? 'px-3 py-1 rounded-lg text-xs font-medium bg-creviceGold text-obsidian shadow'
          : 'px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-warmWhite hover:bg-white/20';
      });
      const filtered = cat === 'all' ? redemptionPathsData : redemptionPathsData.filter(d => d.cat === cat);
      byId('redemption-paths-grid').innerHTML = filtered.map(item => `
        <div class="p-4 rounded-xl bg-obsidian/80 border border-white/10 hover:border-creviceGold/40 transition flex flex-col justify-between">
          <div>
            <div class="text-xs font-bold text-creviceGold">${item.name}</div>
            <div class="text-[11px] text-lucidCyan mt-0.5">代表：${item.thinkers}</div>
            <p class="text-xs text-warmWhite/85 mt-2 leading-relaxed">${item.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // Interactive Tool 1: Personal Freedom Map Builder
    let freedomMapState = {
      q1: [
        '宏观经济周期与行业结构性调整',
        'AI技术迭代带来的自动化冲击事实',
        '过去的原生家庭与既有起点'
      ],
      q2: [
        '识破“不够成功就是个人无能”的绩效洗脑',
        '设定每晚22:30后远离算法短视频，恢复深度阅读',
        '在工作中守住职业伦理底线，培养一项真正热爱的手艺',
        '认真倾听并照料身边的一位家人或朋友'
      ],
      q3: [
        '与同事互通真实薪资与工时信息，拒绝恶性内卷',
        '参与行业伦理讨论、工会或社区互助网络',
        '在公共讨论中支持劳动权益保障与合理工时制度'
      ]
    };

    function renderFreedomMapLists() {
      ['q1', 'q2', 'q3'].forEach(q => {
        const ul = byId(`fm-list-${q}`);
        ul.innerHTML = freedomMapState[q].map((text, idx) => `
          <li class="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-2 group">
            <span class="text-warmWhite/90 leading-relaxed">• ${escapeText(text)}</span>
            <button data-ph-click="removeFreedomMapItem('${q}', ${idx})" class="text-mutedText hover:text-rose-400 text-xs opacity-60 group-hover:opacity-100 transition" title="移除">✕</button>
          </li>
        `).join('');
      });
    }

    function addFreedomMapItem() {
      const input = byId('fm-new-item-input');
      const quad = byId('fm-new-item-quadrant').value;
      const val = input.value.trim();
      if (!val) return;
      freedomMapState[quad].push(val);
      input.value = '';
      renderFreedomMapLists();
    }

    function removeFreedomMapItem(quad, idx) {
      freedomMapState[quad].splice(idx, 1);
      renderFreedomMapLists();
    }

    function loadPresetFreedomMap(type) {
      const titleInput = byId('fm-dilemma-title');
      if (type === 'work') {
        titleInput.value = '高强度职场内卷、AI替代焦虑与个人意义感流失';
        freedomMapState = {
          q1: [
            '宏观经济周期与行业结构性调整',
            'AI技术迭代带来的自动化冲击事实',
            '过去的原生家庭与既有起点'
          ],
          q2: [
            '识破“不够成功就是个人无能”的绩效洗脑',
            '设定每晚22:30后远离算法短视频，恢复深度阅读',
            '在工作中守住职业伦理底线，培养一项真正热爱的手艺',
            '认真倾听并照料身边的一位家人或朋友'
          ],
          q3: [
            '与同事互通真实信息，拒绝无底线加班内卷',
            '参与行业知识共享或社区互助网络',
            '在公共讨论中支持劳动权益保障与合理工时制度'
          ]
        };
      } else {
        titleInput.value = '突发人生变故、理想受挫与虚无倦怠感';
        freedomMapState = {
          q1: [
            '已经发生的意外变故或丧失事实（偶然性悲剧）',
            '生命本身的脆弱性与必死性局限',
            '社会单一世俗成功标准的短期存在'
          ],
          q2: [
            '允许自己悲伤与停顿，不强迫自己立刻“正能量”',
            '恢复规律的睡眠、散步与一日三餐节律',
            '写下自己绝不妥协的3条做人原则并定期回看',
            '主动向信任的亲友或专业心理医生求助'
          ],
          q3: [
            '寻找志同道合的同伴建立阅读或互助小组',
            '参与力所能及的公益志愿服务，在真实连接中重建共鸣',
            '推动去污名化的心理健康公共支持环境'
          ]
        };
      }
      renderFreedomMapLists();
    }

    async function copyFreedomMapCard() {
      const title = byId('fm-dilemma-title').value;
      const text = [
        `【在裂隙中安居 · 个人自由地图与行动卡】`,
        `核心处境：${title}`,
        ``,
        `一、我无法单独改变的（交给接纳与哀悼 · 态度的自由）：`,
        ...freedomMapState.q1.map(i => `  - ${i}`),
        ``,
        `二、我能够直接影响的（交给具体开端与底线 · 理解与行动的自由）：`,
        ...freedomMapState.q2.map(i => `  - ${i}`),
        ``,
        `三、必须与他人一起改变的（交给联合与发声 · 共同的自由）：`,
        ...freedomMapState.q3.map(i => `  - ${i}`),
        ``,
        `—— 铭记：对不可改变之事保持接纳，对可以改变之事承担责任，对必须共同改变之事寻找同伴。`
      ].join('\n');

      let copied=false;
      try { await navigator.clipboard.writeText(text);copied=true; } catch (_) {}
      if(!copied){
        const textarea=document.createElement('textarea');textarea.value=text;
        textarea.style.cssText='position:fixed;top:0;left:0;opacity:0';root.appendChild(textarea);textarea.select();
        copied=document.execCommand('copy');textarea.remove();
      }
      const toast=byId('fm-copy-toast');
      toast.textContent=copied?'已复制行动卡，可粘贴保存。':'浏览器未允许复制，请在下方文本框中手动复制。';
      if(!copied){let fallback=byId('ph-copy-fallback');if(!fallback){fallback=document.createElement('textarea');fallback.id='ph-copy-fallback';fallback.setAttribute('aria-label','行动卡文本（可手动复制）');fallback.style.cssText='display:block;width:100%;min-height:280px;margin-top:16px;padding:16px;border:1px solid var(--line-2);border-radius:12px';toast.after(fallback);}fallback.value=text;fallback.focus();fallback.select();}
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    // Interactive Tool 2: 5 Typical Contemporary Situations (Section 8.5 Table)
    const typicalSituationsData = [
      {
        name: '① 职场内卷与过劳',
        archetype: '系统—结构性悲剧 + 绩效伪自由',
        constraints: '竞争性的绩效考核制度；劳动力市场中的结构性不对等；资本对剩余时间与注意力的挤压。',
        freedomSpace: '识破“你痛苦只是因为你不够努力”的意识形态叙事（理解的自由）；守住时间与身心健康的底线（行动的自由）；与同事互通信息拒绝孤立（共同的自由）。',
        actions: '设定不可侵犯的休息与“无用”时间；保留客观工作记录；与同伴建立善意同盟、参与合理的集体协商；必要时寻求劳动法律援助。'
      },
      {
        name: '② 突发疾病、意外或丧失',
        archetype: '命运—偶然型悲剧（善的脆弱性）',
        constraints: '生存的偶然性与人类身体的天然脆弱性，完全不由个人道德或努力决定（“我没有做错，但苦难降临”）。',
        freedomSpace: '选择如何哀悼与承担（态度的自由）；决定向谁敞开与求助；在风暴后逐步重建日常生活的微小节律。',
        actions: '允许自己悲伤与脆弱，拒绝“受害者自责”；积极寻求医疗、心理与社会支持系统；在力所能及的日常小事上逐步恢复掌控感。'
      },
      {
        name: '③ 意义空虚与深度倦怠',
        archetype: '现代虚无处境 + 算法注意力经济',
        constraints: '传统终极意义根基的历史性崩塌；社会加速造成的“世界沉默”；算法平台对深度注意力的系统性切割。',
        freedomSpace: '夺回注意力的投向权；选择投入哪段真实关系、哪件具体事物（意义不在空想中，而在行动与共鸣中生成）。',
        actions: '减少被动刷屏的信息流；恢复一项需要长期专注投入的爱好、阅读或手艺；承担一份对具体他人的真实照料与责任。'
      },
      {
        name: '④ 理想被挤压，“活成讨厌的样子”',
        archetype: '人性内在矛盾型悲剧 + 结构驯化',
        constraints: '现实生存压力、科层制规则以及漫长岁月中的温水煮青蛙式社会驯化。',
        freedomSpace: '保持开放的反身性，清晰区分“为了生存的必要妥协”与“不可退让的人格底线”；保持对自身变化的诚实觉察。',
        actions: '写下自己一生不愿放弃的几条核心原则并定期回看审视；在日常业务中守住底线；寻找志同道合的同伴相互提醒与支撑。'
      },
      {
        name: '⑤ 出身与机会不公，“才华埋没”',
        archetype: '系统—结构性悲剧（结构性遮蔽）',
        constraints: '阶层、地域、家庭文化资本与社会资源分配的结构性差异；社会筛选机制并非纯粹按才华运转。',
        freedomSpace: '争取一切可及的学习与成长机会；拒绝以世俗单一的金钱/地位标准否定自身的存在价值；参与改善制度。',
        actions: '善用开放的公共教育与数字知识资源；建立跨地域的互助与创作网络；在公共领域支持促进教育与机会平等的制度改革。'
      }
    ];

    function renderTypicalSituations(idx = 0) {
      const tabs = byId('situation-tabs');
      tabs.innerHTML = typicalSituationsData.map((s, i) => `
        <button data-ph-click="renderTypicalSituations(${i})" class="p-3 rounded-xl text-xs font-medium text-left transition border ${
          i === idx ? 'bg-creviceGold text-obsidian font-bold border-creviceGold shadow' : 'bg-white/5 text-warmWhite/85 border-white/10 hover:bg-white/10'
        }">
          <div>${s.name}</div>
          <div class="text-[10px] opacity-75 mt-0.5 truncate">${s.archetype}</div>
        </button>
      `).join('');

      const active = typicalSituationsData[idx];
      byId('situation-detail-panel').innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-5">
          <div>
            <span class="text-xs text-creviceGold font-semibold">对应悲剧与处境原型：${active.archetype}</span>
            <h4 class="font-philo text-xl font-bold text-warmWhite mt-0.5">${active.name}</h4>
          </div>
          <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-mutedText">同时看见“结构约束”与“自由回应”</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-xl bg-rose-950/25 border border-rose-500/30">
            <div class="font-bold text-rose-300 text-sm mb-2">🔒 结构性约束（我无法单独改变的）</div>
            <p class="text-warmWhite/90 leading-relaxed">${active.constraints}</p>
            <div class="mt-3 text-[11px] text-rose-300/80">→ 认知调整：停止把结构性困境当作个人羞耻。</div>
          </div>

          <div class="p-4 rounded-xl bg-lucidCyan/15 border border-lucidCyan/35">
            <div class="font-bold text-lucidCyan text-sm mb-2">🧭 仍然存在的自由空间（属于我的余地）</div>
            <p class="text-warmWhite/90 leading-relaxed">${active.freedomSpace}</p>
            <div class="mt-3 text-[11px] text-lucidCyan/90">→ 核心支点：开放的反身性使能动性永不为零。</div>
          </div>

          <div class="p-4 rounded-xl bg-creviceGold/15 border border-creviceGold/40">
            <div class="font-bold text-creviceGold text-sm mb-2">🌱 可以尝试的具体行动（从小处开端）</div>
            <p class="text-warmWhite/90 leading-relaxed">${active.actions}</p>
            <div class="mt-3 text-[11px] text-creviceGold/90">→ 救赎指向：在行动与联合中重建存在支点。</div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // INITIALIZE ALL INTERACTIVE MODULES ON LOAD
    // =========================================================================
    function initialize() {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      animateCanvas();

      // Module 1 Init
      selectSpiralNode(0);
      renderHistoryEras(0);

      // Module 2 Init
      switchTragedyHistory('greek');
      selectTragedyArchetype(0);
      loadCompositeCase(0);

      // Module 3 Init
      renderNihilismDiff(0);
      renderNihilismManifest(0);
      updateAbsurdSimulator();

      // Module 4 Init
      updatePseudoDiagnostic();
      renderFreedomLevels(2);

      // Module 5 Init
      filterRedemptionPaths('all');
      renderFreedomMapLists();
      renderTypicalSituations(0);
    };
  
const actions={addFreedomMapItem,copyFreedomMapCard,filterRedemptionPaths,loadCompositeCase,loadPresetFreedomMap,removeFreedomMapItem,renderFreedomLevels,renderHistoryEras,renderNihilismDiff,renderNihilismManifest,renderTypicalSituations,resetAbsurdSliders,resetPseudoTest,selectSpiralNode,selectTragedyArchetype,setHeroMode,setSpiralMode,simulateSpiralShock,switchTragedyHistory,triggerCreviceLight,updateAbsurdSimulator,updatePseudoDiagnostic};
function invoke(text){
 const match=/^(\w+)\(([^)]*)\)/.exec(text||'');if(!match||!actions[match[1]])return;
 const args=match[2].trim()?match[2].split(',').map(s=>{s=s.trim();return /^-?\d+$/.test(s)?Number(s):s.replace(/^['"]|['"]$/g,'');}):[];
 actions[match[1]](...args);
 if(text.includes('scrollIntoView'))byId('module-1').scrollIntoView({behavior:'smooth'});
}
root.addEventListener('click',e=>{const el=e.target.closest('[data-ph-click]');if(el&&root.contains(el))invoke(el.dataset.phClick);});
root.addEventListener('input',e=>{if(e.target.dataset.phInput)invoke(e.target.dataset.phInput);});
root.addEventListener('keydown',e=>{const el=e.target.closest('g[role="button"]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();invoke(el.dataset.phClick);}if(e.key==='Escape'){mobileMenu.classList.add('hidden');mobileMenuBtn.setAttribute('aria-expanded','false');}});
byId('fm-new-item-input').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addFreedomMapItem();}});
initialize();
})();
