/* 附件原文及沙盘数据保持原样；样式和 DOM 查询限定在本页。 */
(()=>{'use strict';const root=document.getElementById('socks5-app');if(!root)return;const byId=id=>root.querySelector('[id="'+id+'"]');let toastTimer;

    // ==========================================
    // 1. 剪贴板复制工具函数 (严格使用 execCommand 兼容 iFrame)
    // ==========================================
    function showToast(msg) {
      const toast = byId('toast-notification');
      const msgEl = byId('toast-message');
      msgEl.textContent = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 2200);
    }

    async function copyTextToClipboard(text,btnElement,defaultLabel){
      let copied=false;
      try{await navigator.clipboard.writeText(text);copied=true;}catch(_){}
      if(!copied){const textarea=document.createElement('textarea');textarea.value=text;textarea.style.cssText='position:fixed;left:0;top:0;opacity:0';root.appendChild(textarea);textarea.select();try{copied=document.execCommand('copy');}catch(_){}textarea.remove();}
      if(copied){if(btnElement){const originalHTML=btnElement.innerHTML;btnElement.innerHTML='<span>✓ 已复制</span>';setTimeout(()=>{btnElement.innerHTML=defaultLabel?`<span>${defaultLabel}</span>`:originalHTML;},1600);}showToast('代码已成功复制到剪贴板');}
      else{showToast('复制失败，请手动选择复制');}
    }

    function copyCodeBlock(btn, elementId) {
      const codeEl = byId(elementId);
      if (!codeEl) return;
      copyTextToClipboard(codeEl.innerText, btn, '复制代码');
    }

    function copyVerifyCommand(btn) {
      const cmdEl = byId('detail-verify-cmd');
      if (!cmdEl) return;
      copyTextToClipboard(cmdEl.innerText, btn, '复制检测命令');
    }

    // ==========================================
    // 2. 互动沙盘核心数据结构（3大流派 × 4个递进步骤）
    // ==========================================
    const SANDBOX_DATA = [
      // 流派一：验IP域名分流劫持
      {
        id: 'mode-1',
        name: '流派一：验IP域名分流劫持',
        subtitle: '羊头狗肉骗局：查IP网站走按量真家宽池，业务网站走 $0.4 廉价机房直连',
        steps: [
          {
            stepNum: 1,
            shortTitle: '买家连接 Socks5',
            nodeSub: '入口：廉价美国 VPS :10808',
            dealerDesc: '商家在月付 2 美元的廉价美国机房 VPS 上开启 Socks5 入站端口（如 10808）并发放给买家。此时买家所有流量首先进入这台廉价机房服务器。',
            mutation: 'Inbound: socks5://user:pass@23.106.xx.10:10808\nPhysical Server: $2/mo Cheap US IDC VPS (AS-Hosting)',
            surface: '买家在指纹浏览器中填入商家给的静态 Socks5 节点，测试连接延迟低、速度飞快。',
            reality: '你连接的根本不是美国家庭宽带光猫，而是一台位于廉价数据中心的 Xray / Sing-box 分流中转机。',
            verifyCmd: '# 第一步：记录商家给你的Socks5入口IP，测试基础连通\ncurl --socks5 user:pass@23.106.xx.10:10808 -I https://www.google.com'
          },
          {
            stepNum: 2,
            shortTitle: 'Xray 域名路由识别',
            nodeSub: '核心篡改：Sniffing + Domain 规则',
            dealerDesc: 'Xray/3x-ui 启用流量嗅探（Sniffing）或解析 Socks5 域名请求，比对目标域名是否命中预设的 11 家主流 IP 检测网站黑名单列表。',
            mutation: 'Routing Match Rule:\ndomain:ipinfo.io, ping0.cc, whoer.net, scamalytics.com, ip-api.com, browserleaks.com ...\n  ├─ HIT  ──► Outbound: [fake_check_resi] (真家宽池)\n  └─ MISS ──► Outbound: [direct] (廉价机房本地网卡)',
            surface: '分流过程在服务端毫秒级静默完成，客户端毫无感知。',
            reality: '服务端设置了“白名单验IP劫持”，只有你去查 IP 时才给你看真家宽，访问其他任何域名全部走机房。',
            verifyCmd: '# 对比主流查IP站与冷门回显站的出口IP是否分裂：\ncurl -s --socks5 user:pass@ip:port https://ipinfo.io/ip\ncurl -s --socks5 user:pass@ip:port https://www.cloudflare.com/cdn-cgi/trace | grep ip='
          },
          {
            stepNum: 3,
            shortTitle: '分支A：访问查IP网站',
            nodeSub: '转发至按量计费真美国家宽池',
            dealerDesc: '当买家打开 ipinfo.io 或 ping0.cc 验货时，路由规则命中 fake_check_resi，流量被二次转发到按流量计费（$1/GB）的真实 AT&T / Verizon 动态家宽池。',
            mutation: 'Target: ipinfo.io / ping0.cc\nExit IP: 71.19.142.xx (AT&T Mobility / Residential)\nASN Type: "isp" | Company Type: "isp" | Fraud Score: 0',
            surface: 'ping0.cc 显示绿色“家庭宽带”，ipinfo.io 显示完美双 ISP，买家欣喜若狂确认收货好评。',
            reality: '查一次 IP 只消耗几 KB 流量，1GB 流量（成本 1 美元）足够商家骗过几百个买家上万次验货！',
            verifyCmd: '# 用未被商家列入黑名单的冷门接口查出它的真身：\ncurl -s --socks5 user:pass@ip:port https://checkip.amazonaws.com\ncurl -s --socks5 user:pass@ip:port https://icanhazip.com'
          },
          {
            stepNum: 4,
            shortTitle: '分支B：访问业务平台',
            nodeSub: '机房 Direct 直连 → 触发风控封号',
            dealerDesc: '当买家登录 Amazon、PayPal、TikTok 等目标业务网站时，由于域名不在查 IP 列表中，流量直接从 2 美元 VPS 的本地机房网卡（direct）裸奔发出！',
            mutation: 'Target: amazon.com / paypal.com / tiktok.com\nReal Exit IP: 23.106.xx.10 (DataCenter Hosting)\nASN Type: "hosting" | Fraud Risk: HIGH (触发秒封)',
            surface: '买家以为自己顶着 AT&T 真家宽在操作店铺或养号，实则全程裸奔在垃圾机房 IP 下。',
            reality: '业务平台风控系统直接捕获到 23.106.xx.10 机房 IP，导致账号关联或秒封，买家还以为是浏览器指纹问题。',
            verifyCmd: '# 一招毙命命令（对比两个回显IP，只要不一致100%是分流狗肉节点）：\necho "查IP站显示: $(curl -s --socks5 user:pass@ip:port https://ipinfo.io/ip)"\necho "真实业务出口: $(curl -s --socks5 user:pass@ip:port https://cloudflare.com/cdn-cgi/trace | awk -F= \'/^ip=/{print $2}\')"'
          }
        ]
      },

      // 流派二：站群多IP + 协议栈与rDNS伪装
      {
        id: 'mode-2',
        name: '流派二：站群内核与rDNS伪装',
        subtitle: '中级技术流：租用 /24 站群机房服务器，篡改 Linux TTL=128 与 PTR 反向解析模仿家宽',
        steps: [
          {
            stepNum: 1,
            shortTitle: '租用 /24 站群服务器',
            nodeSub: '单机绑定 253 个廉价机房 IP',
            dealerDesc: '商家花约 100 美元/月租用一台美国洛杉矶或达拉斯的 /24 站群服务器（23.106.xx.1 ~ .254），每个独立静态 IP 成本不到 0.4 美元。',
            mutation: 'Subnet: 23.106.xx.0/24 (253 Usable Static IPs)\nUnit Cost: ~$0.39 / IP / Month\nServer OS: Ubuntu 22.04 / Debian 12 (Linux DataCenter)',
            surface: '商家宣传“一手美国本土独立静态住宅专享 IP，支持长效续费，绝不跳 IP”。',
            reality: '整段 253 个 IP 全部绑定在同一台机房母鸡的虚拟网卡上，邻居全在做批量注册或爬虫业务。',
            verifyCmd: '# 扫描同 C 段相邻 IP（.1~.254）是否普遍开放 Linux SSH (22) 端口：\nnmap -p 22,1080,3389 --open 23.106.xx.0/24'
          },
          {
            stepNum: 2,
            shortTitle: 'Sing-box 一IP一出口',
            nodeSub: 'inet4_bind_address 批量生成',
            dealerDesc: '通过 Shell 脚本自动生成 253 组 Sing-box / Xray 入站与出站配置，利用 inet4_bind_address 强制从哪个 IP 进就从哪个 IP 出，不怕买家测回显。',
            mutation: 'Inbound[in-1]: listen 23.106.xx.10:20001\nOutbound[out-1]: inet4_bind_address "23.106.xx.10"\nResult: 查IP站与 cloudflare/trace 返回相同 IP',
            surface: '买家吸取教训去测 cloudflare.com/cdn-cgi/trace，发现出口 IP 完全一致，没有分流！',
            reality: '虽然没有分流，但这颗 IP 本身依然是插在洛杉矶数据中心机柜里的 Linux 服务器 IP。',
            verifyCmd: '# 检查该 IP 自身是否开放了机房服务器特征端口（如 22 SSH 或面板端口）：\nnmap -Pn -p 22,80,443,2053,54321 23.106.xx.10'
          },
          {
            stepNum: 3,
            shortTitle: '篡改 Linux 内核协议栈',
            nodeSub: 'TTL: 64 → 128 欺骗 p0f 检测',
            dealerDesc: '修改 /etc/sysctl.conf，将 Linux 默认的 ip_default_ttl=64 改为 Windows 的 128，并关闭 tcp_timestamps，骗过 whoer.net 与 browserleaks 的 p0f 被动操作系统指纹检测。',
            mutation: 'Before: TTL = 64, timestamps = 1  ──► p0f: Linux Server (Proxy Risk!)\nAfter : TTL = 128, timestamps = 0 ──► p0f: Windows 10/11 Desktop (Pass!)',
            surface: '买家打开 whoer.net 或 browserleaks.com，看到 OS Fingerprint 显示为 Windows，伪装度直接飙到 100%！',
            reality: '仅修改了 IP 包头的默认生存时间字段，遇到深层 TCP 拥塞控制算法（BBR vs Cubic）或 MTU 探测依然可被识别。',
            verifyCmd: '# 检测远端代理 TCP 握手的详细 MSS / Window Scale 与延迟跳数特征：\ncurl -v --socks5 user:pass@23.106.xx.10:20001 https://browserleaks.com/json'
          },
          {
            stepNum: 4,
            shortTitle: '伪造 PTR 反向域名记录',
            nodeSub: 'cpe-23-106-xx-10.socal.res.rr.com',
            dealerDesc: '商家在机房后台批量修改 /24 网段的 rDNS (PTR) 记录，去掉 datacenter/vps 字样，伪造成带有 cpe、res、pool、fios 的美国家庭宽带网关格式。',
            mutation: 'Before PTR: 10.xx.106.23.static.datacenter-la.com\nForged PTR: cpe-23-106-xx-10.socal.res.rr.com (高仿 Spectrum 家宽)',
            surface: '反查 IP 的 PTR 主机名看起来跟真正的美国 Spectrum 或 Verizon Fios 家庭光猫一模一样。',
            reality: '机房只能单向修改自己 IP 的反向 PTR 记录，无法在真正的 Spectrum (rr.com) 官方权威 DNS 中添加正向 A 记录！',
            verifyCmd: '# 一招毙命：正反向解析交叉验证（FCrDNS），伪造的PTR正向ping必然不通或不一致：\ndig -x 23.106.xx.10 +short\ndig A cpe-23-106-xx-10.socal.res.rr.com +short'
          }
        ]
      },

      // 流派三：ASN借壳 + Geofeed + 数据库申诉洗白
      {
        id: 'mode-3',
        name: '流派三：ASN借壳与数据库洗白',
        subtitle: '终极源头伪造：欺骗五大商业 IP 数据库，把机房服务器洗白成全网公认的“静态双ISP家宽”',
        steps: [
          {
            stepNum: 1,
            shortTitle: '租冷门段 + 借壳 AS174 宣告',
            nodeSub: '搞定第1个ISP标签 (ASN Type=isp)',
            dealerDesc: '庄家从 IPXO/LIR 租用冷门 /24 网段，绝不用机房 ASN，而是找拥有 ISP 资质的骨干网（如 Cogent AS174、Frontier、Windstream）建立 BGP 会话进行广播宣告。',
            mutation: 'BGP Origin ASN: AS174 (Cogent Communications)\nDatabase ASN Type: "isp" (第 1 个 ISP 属性天然达成！)',
            surface: '在 ipinfo.io 查询该 IP，ASN 一栏赫然显示 type: "isp"，不再是 Vultr/DO 等 hosting 机房。',
            reality: 'AS174 (Cogent) 虽然在数据库里标为 ISP，但它在北美主要是商业骨干网与数据中心带宽批发商，根本不做普通居民家里的入户宽带！',
            verifyCmd: '# 检查 ASN 编号是否属于北美五大正统居民宽带巨头（AT&T/Verizon/Comcast/Charter/Cox）：\ncurl -s https://ipinfo.io/23.106.xx.10/json | grep -E "org|asn|type"'
          },
          {
            stepNum: 2,
            shortTitle: '注册美国宽带壳公司 + SWIP',
            nodeSub: '部署 RFC 8805 geofeed.csv',
            dealerDesc: '庄家花几十美元在美国注册名为 "Pacific Fiber Broadband LLC" 的壳公司，通过 ARIN SWIP 修改 WHOIS 归属，并在官网挂载指向洛杉矶的 geofeed.csv。',
            mutation: 'ARIN WHOIS OrgName: Pacific Fiber Broadband LLC\nRemark: Geofeed https://pacificfiberbroadband.com/geofeed.csv\nGeo Entry: 23.106.xx.0/24,US,US-CA,Los Angeles,90001',
            surface: 'WHOIS 信息显示该网段属于一家“太平洋光纤宽带公司”，且地理位置精准定位在加州洛杉矶居民区。',
            reality: '这家“光纤宽带公司”连一根实体光缆都没有，只有一个单页静态网站和一个用来自动化喂给数据库爬虫的 CSV 文件。',
            verifyCmd: '# 查询 WHOIS 原始记录，观察是否挂载了人工注入的 Geofeed 文件及近期变更记录：\nwhois 23.106.xx.10 | grep -iE "OrgName|CustName|Geofeed|Updated"'
          },
          {
            stepNum: 3,
            shortTitle: '向五大 IP 库提交申诉工单',
            nodeSub: '谎称 FTTH 家庭宽带请求更正',
            dealerDesc: '庄家使用壳公司企业邮箱向 MaxMind、IPinfo、IP2Location、DB-IP 提交官方纠错工单，声称该 /24 网段已分配给南加州本地 FTTH 家庭宽带用户使用。',
            mutation: 'Ticket Submitted to MaxMind / IPinfo / IP2Location:\nUsage Type: "Data Center (DCH)" ──► "Fixed Line ISP (RES)"\nCompany Type: "hosting" ──► "isp" (第 2 个 ISP 属性达成！)',
            surface: '商业 IP 数据库审核员看到 WHOIS 公司名带 Broadband 且有合规 Geofeed，2~4 周后批准更新数据库。',
            reality: '全球所有查 IP 网站 100% 依赖这五大数据库的标签，源头数据库一旦被骗过，下游所有检测工具集体失明。',
            verifyCmd: '# 查看该网段在 BGP 历史与路由表中的真实上游机房邻接关系：\ncurl -s https://stat.ripe.net/data/Routing-status/data.json?resource=23.106.xx.0/24'
          },
          {
            stepNum: 4,
            shortTitle: '全网显示完美“双ISP家宽”',
            nodeSub: '切分 253 个 Socks5 高价售卖',
            dealerDesc: '数据库同步后，这段插在洛杉矶机房里的服务器 IP 在 ipinfo.io 显示双 isp，在 ping0.cc 显示绿色“家庭宽带”，庄家切分成 253 个节点以 30~80 元/月高价出售。',
            mutation: 'ipinfo.io: ASN="isp" + Company="isp" (完美双ISP)\nping0.cc : 家庭宽带 (绿标) | Scamalytics: Score 0\nPhysical Truth: 依然是机房机柜里的Ubuntu服务器！',
            surface: '买家测试所有主流网站全都完美无瑕，以为买到了极品原生美国家宽。',
            reality: '市面上 90% 的廉价“静态双ISP”均属此类！只要看它不属于北美五大正统家宽 ASN，或扫同 C 段邻居全是 22 端口即可一秒戳穿。',
            verifyCmd: '# 终极验真组合拳：1.核对五大正统家宽ASN(AS7018/AS701/AS7922/AS20115/AS22773) 2.扫邻居SSH端口\ncurl -s https://ipinfo.io/23.106.xx.10/org && nmap -p 22 --open 23.106.xx.0/24'
          }
        ]
      }
    ];

    // 当前沙盘状态
    let currentModeIdx = 0;
    let currentStepIdx = 0;
    let buyerXrayEnabled = false;

    // ==========================================
    // 3. 沙盘控制与视图渲染函数
    // ==========================================
    function selectMode(modeIdx) {
      currentModeIdx = modeIdx;
      currentStepIdx = 0;
      renderSandbox();
    }

    function selectStep(stepIdx) {
      currentStepIdx = stepIdx;
      renderSandbox();
    }

    function prevStep() {
      const stepsLen = SANDBOX_DATA[currentModeIdx].steps.length;
      currentStepIdx = (currentStepIdx - 1 + stepsLen) % stepsLen;
      renderSandbox();
    }

    function nextStep() {
      const stepsLen = SANDBOX_DATA[currentModeIdx].steps.length;
      currentStepIdx = (currentStepIdx + 1) % stepsLen;
      renderSandbox();
    }

    function toggleBuyerXray(checked) {
      buyerXrayEnabled = checked;
      const track = byId('xray-track');
      const thumb = byId('xray-thumb');
      const badge = byId('xray-legend-badge');
      const panel = byId('buyer-xray-panel');

      if (buyerXrayEnabled) {
        track.classList.remove('bg-parchment-darkborder');
        track.classList.add('bg-terracotta-mid');
        thumb.classList.add('translate-x-6');
        badge.classList.remove('hidden');
        badge.classList.add('inline-flex');
        panel.classList.remove('border-parchment-darkborder');
        panel.classList.add('border-terracotta-mid', 'bg-terracotta-light/25', 'shadow-md');
      } else {
        track.classList.add('bg-parchment-darkborder');
        track.classList.remove('bg-terracotta-mid');
        thumb.classList.remove('translate-x-6');
        badge.classList.add('hidden');
        badge.classList.remove('inline-flex');
        panel.classList.add('border-parchment-darkborder');
        panel.classList.remove('border-terracotta-mid', 'bg-terracotta-light/25', 'shadow-md');
      }
      renderSandbox();
    }

    function triggerXrayHighlight() {
      const checkbox = byId('xray-toggle');
      checkbox.checked = !checkbox.checked;
      toggleBuyerXray(checkbox.checked);
    }

    function renderSandbox() {
      const modeData = SANDBOX_DATA[currentModeIdx];
      const stepData = modeData.steps[currentStepIdx];

      // 1. 更新顶部 3 个流派 Tab 样式
      for (let i = 0; i < 3; i++) {
        const tabBtn = byId(`tab-mode-${i}`);
        if (i === currentModeIdx) {
          tabBtn.className = 'px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-left transition-all border-2 border-teal-deep bg-teal-deep text-parchment-card shadow-sm flex items-center justify-between';
        } else {
          tabBtn.className = 'px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-left transition-all border border-parchment-darkborder bg-parchment-card text-ink-primary hover:bg-parchment-panel flex items-center justify-between';
        }
      }

      for(let i=0;i<3;i++)byId(`tab-mode-${i}`).setAttribute('aria-pressed',String(i===currentModeIdx));
      // 2. 更新 Step 1~4 进度点按钮
      const dotsContainer = byId('step-dots-container');
      dotsContainer.innerHTML = modeData.steps.map((s, idx) => {
        const active = idx === currentStepIdx;
        return `
          <button type="button" aria-label="步骤 ${idx+1}: ${s.shortTitle}" aria-pressed="${active}" data-s5-click="selectStep(${idx})" class="w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all ${
            active
              ? 'bg-terracotta-mid text-parchment-card shadow-sm scale-105'
              : 'bg-parchment-panel text-ink-secondary hover:bg-parchment-darkborder/40'
          }" title="跳转到步骤 ${idx + 1}: ${s.shortTitle}">
            ${idx + 1}
          </button>
        `;
      }).join('');

      // 3. 更新画布副标题
      byId('canvas-mode-subtitle').textContent = modeData.subtitle;

      // 4. 渲染 SVG 拓扑流程图
      renderModeSVG(currentModeIdx, currentStepIdx, buyerXrayEnabled);

      // 5. 更新底部左右两栏详情
      byId('detail-step-badge').textContent = `STEP ${stepData.stepNum} / 4`;
      byId('detail-step-title').textContent = stepData.shortTitle;
      byId('detail-dealer-desc').textContent = stepData.dealerDesc;
      byId('detail-mutation-box').textContent = stepData.mutation;

      byId('detail-surface-text').textContent = stepData.surface;
      byId('detail-reality-text').textContent = stepData.reality;
      byId('detail-verify-cmd').textContent = stepData.verifyCmd;
    }

    // ==========================================
    // 4. 动态 SVG 拓扑图生成器 (支持节点点击与透视镜图层)
    // ==========================================
    function renderModeSVG(modeIdx, stepIdx, xrayOn) {
      const container = byId('svg-canvas-container');
      const mode = SANDBOX_DATA[modeIdx];

      // 通用颜色定义
      const cTealDeep = '#386248';
      const cTealMid = '#48735A';
      const cTealLight = '#EDF3EE';
      const cTerraDeep = '#A34F32';
      const cTerraMid = '#C15F3C';
      const cTerraLight = '#FAF0EA';
      const cCard = '#FFFFFF';
      const cPanel = '#F0EEE6';
      const cBorder = '#CFCCC0';
      const cInk = '#141413';
      const cMuted = '#63615B';

      // 生成单个可点击 SVG 节点的辅助函数
      function drawNode(idx, x, y, w, h, badgeText, title, subtitle, paramTag, isAlertNode) {
        const isActive = idx === stepIdx;
        const strokeColor = isActive
          ? (isAlertNode ? cTerraDeep : cTealDeep)
          : (isAlertNode ? '#D98A73' : cBorder);
        const strokeWidth = isActive ? 3 : 1.5;
        const fillBg = isActive
          ? (isAlertNode ? cTerraLight : cTealLight)
          : cCard;
        const headerBg = isAlertNode ? cTerraMid : cTealDeep;

        return `
          <g class="cursor-pointer transition-transform" role="button" tabindex="0" aria-label="${badgeText}: ${title}" aria-pressed="${isActive}" data-s5-click="selectStep(${idx})">
            ${isActive ? `<rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="14" fill="none" stroke="${isAlertNode ? cTerraMid : cTealMid}" stroke-width="2" stroke-dasharray="4 3" class="node-pulse-ring" />` : ''}
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fillBg}" stroke="${strokeColor}" stroke-width="${strokeWidth}" filter="url(#drop-shadow)" />
            <!-- 顶部标题条 -->
            <path d="M ${x} ${y + 10} Q ${x} ${y} ${x + 10} ${y} L ${x + w - 10} ${y} Q ${x + w} ${y} ${x + w} ${y + 10} L ${x + w} ${y + 28} L ${x} ${y + 28} Z" fill="${headerBg}" />
            <text x="${x + 12}" y="${y + 19}" fill="#FFFFFF" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">${badgeText}</text>
            ${isActive ? `<circle cx="${x + w - 14}" cy="${y + 14}" r="4.5" fill="#FCD34D" />` : ''}

            <!-- 主标题与副标题 -->
            <text x="${x + 12}" y="${y + 52}" fill="${cInk}" font-family="Noto Serif SC, serif" font-size="13.5" font-weight="700">${title}</text>
            <text x="${x + 12}" y="${y + 72}" fill="${cMuted}" font-family="JetBrains Mono, monospace" font-size="11">${subtitle}</text>

            <!-- 参数胶囊标签 -->
            <rect x="${x + 10}" y="${y + 84}" width="${w - 20}" height="22" rx="5" fill="${cPanel}" stroke="${cBorder}" stroke-width="1" />
            <text x="${x + w / 2}" y="${y + 99}" text-anchor="middle" fill="${isAlertNode ? cTerraDeep : cTealDeep}" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="600">${paramTag}</text>
          </g>
        `;
      }

      // 透视镜叠加提示框生成器
      function drawXrayCallout(x, y, w, h, title, line1, line2) {
        if (!xrayOn) return '';
        return `
          <g class="transition-opacity duration-300">
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#261915" stroke="${cTerraMid}" stroke-width="2" filter="url(#drop-shadow)" />
            <rect x="${x}" y="${y}" width="${w}" height="22" rx="6" fill="${cTerraMid}" />
            <text x="${x + 10}" y="${y + 15}" fill="#FFFFFF" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700">🔍 买家透视镜 · 破局点: ${title}</text>
            <text x="${x + 10}" y="${y + 40}" fill="#FAF0EA" font-family="Noto Serif SC, serif" font-size="11.5" font-weight="500">${line1}</text>
            <text x="${x + 10}" y="${y + 58}" fill="#FCD34D" font-family="JetBrains Mono, monospace" font-size="10.5">${line2}</text>
          </g>
        `;
      }

      let svgContent = '';

      if (modeIdx === 0) {
        // ==========================================
        // 流派一 SVG：分流劫持（左侧入站 -> 中间路由分叉 -> 右上真家宽查IP / 右下廉价机房业务）
        // ==========================================
        svgContent = `
          <svg viewBox="0 0 920 360" class="w-full h-auto select-none">
            <defs>
              <filter id="drop-shadow" x="-5%" y="-5%" width="110%" height="115%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#141413" flood-opacity="0.10" />
              </filter>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="${cTealDeep}" />
              </marker>
              <marker id="arrow-terra" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="${cTerraMid}" />
              </marker>
            </defs>

            <!-- 背景网格装饰 -->
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E3E0D5" stroke-width="0.6"/>
            </pattern>
            <rect width="920" height="360" fill="url(#smallGrid)" />

            <!-- 连接线 1: Node 0 -> Node 1 -->
            <line x1="230" y1="150" x2="295" y2="150" stroke="${cTealDeep}" stroke-width="3" marker-end="url(#arrow-teal)" />
            <line x1="230" y1="150" x2="295" y2="150" stroke="#7CE0D6" stroke-width="2" class="animate-flow" />

            <!-- 连接线 2 (上分支): Node 1 -> Node 2 (查IP走真家宽) -->
            <path d="M 515 125 C 565 125, 565 75, 620 75" fill="none" stroke="${cTealDeep}" stroke-width="3" marker-end="url(#arrow-teal)" />
            <path d="M 515 125 C 565 125, 565 75, 620 75" fill="none" stroke="#A7F3D0" stroke-width="2" class="animate-flow" />
            <rect x="528" y="68" width="82" height="20" rx="4" fill="${cTealLight}" stroke="${cTealDeep}" stroke-width="1" />
            <text x="569" y="82" text-anchor="middle" fill="${cTealDeep}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">命中查IP域名</text>

            <!-- 连接线 3 (下分支): Node 1 -> Node 3 (业务走机房直连) -->
            <path d="M 515 175 C 565 175, 565 225, 620 225" fill="none" stroke="${cTerraMid}" stroke-width="3" marker-end="url(#arrow-terra)" />
            <path d="M 515 175 C 565 175, 565 225, 620 225" fill="none" stroke="#FCA5A5" stroke-width="2" class="animate-flow" />
            <rect x="528" y="208" width="82" height="20" rx="4" fill="${cTerraLight}" stroke="${cTerraMid}" stroke-width="1" />
            <text x="569" y="222" text-anchor="middle" fill="${cTerraDeep}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">其他业务网站</text>

            <!-- 4个核心步骤节点 -->
            ${drawNode(0, 25, 92, 205, 116, 'STEP 01 · 客户端入口', '买家连接 Socks5', '入口: 2美元廉价机房VPS', 'socks5://23.106.xx.10:10808', false)}
            ${drawNode(1, 300, 92, 215, 116, 'STEP 02 · 分流劫持核心', 'Xray 域名路由识别', '匹配 11 家查 IP 网站黑名单', 'Routing: fake_check vs direct', true)}
            ${drawNode(2, 625, 18, 265, 116, 'STEP 03 · 验货假象通道', '分支A：访问查IP网站', 'ipinfo.io / ping0.cc / whoer', '出口: 71.19.x.x (AT&T真家宽)', false)}
            ${drawNode(3, 625, 168, 265, 116, 'STEP 04 · 真实业务通道', '分支B：访问 Amazon/TikTok', '未命中规则走机房本地 Direct', '出口: 23.106.xx.10 (廉价机房)', true)}

            <!-- 底部透视镜破局层 -->
            ${drawXrayCallout(
              25, 275, 575, 70,
              '冷门回显接口交叉比对',
              '访问未在商家分流列表中的 cloudflare.com/cdn-cgi/trace，返回的是机房 IP 23.106.xx.10',
              '对比结果: ipinfo.io (71.19.x.x) ≠ cloudflare trace (23.106.xx.10) ──► 100% 羊头狗肉分流骗局！'
            )}
          </svg>
        `;
      } else if (modeIdx === 1) {
        // ==========================================
        // 流派二 SVG：站群多IP + 协议栈 TTL=128 + rDNS 伪装
        // ==========================================
        svgContent = `
          <svg viewBox="0 0 920 350" class="w-full h-auto select-none">
            <defs>
              <filter id="drop-shadow" x="-5%" y="-5%" width="110%" height="115%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#141413" flood-opacity="0.10" />
              </filter>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="${cTealDeep}" />
              </marker>
              <marker id="arrow-terra" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="${cTerraMid}" />
              </marker>
            </defs>

            <pattern id="smallGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E3E0D5" stroke-width="0.6"/>
            </pattern>
            <rect width="920" height="350" fill="url(#smallGrid2)" />

            <!-- 顶部物理服务器大框表示同一台母鸡 -->
            <rect x="15" y="18" width="890" height="175" rx="14" fill="rgba(239, 228, 200, 0.45)" stroke="${cBorder}" stroke-width="1.5" stroke-dasharray="6 4" />
            <text x="30" y="38" fill="${cTerraDeep}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">PHYSICAL HOST: 同一台洛杉矶 /24 站群母鸡服务器 (月租 $100 / 253个IP / 单IP成本 $0.4)</text>

            <!-- 顺序连接线 -->
            <line x1="218" y1="112" x2="245" y2="112" stroke="${cTealDeep}" stroke-width="3" marker-end="url(#arrow-teal)" />
            <line x1="218" y1="112" x2="245" y2="112" stroke="#A7F3D0" stroke-width="2" class="animate-flow" />

            <line x1="448" y1="112" x2="475" y2="112" stroke="${cTerraMid}" stroke-width="3" marker-end="url(#arrow-terra)" />
            <line x1="448" y1="112" x2="475" y2="112" stroke="#FCA5A5" stroke-width="2" class="animate-flow" />

            <line x1="678" y1="112" x2="705" y2="112" stroke="${cTerraMid}" stroke-width="3" marker-end="url(#arrow-terra)" />
            <line x1="678" y1="112" x2="705" y2="112" stroke="#FCA5A5" stroke-width="2" class="animate-flow" />

            <!-- 4个横向递进节点 -->
            ${drawNode(0, 25, 54, 193, 116, 'STEP 01 · 站群母鸡采购', '绑定 /24 整段机房IP', '23.106.xx.1 ~ .254', '253个独立静态IP ($0.4/个)', false)}
            ${drawNode(1, 252, 54, 196, 116, 'STEP 02 · 网卡出口绑定', 'Sing-box 一IP一出口', 'inet4_bind_address', '进出同IP (防回显不一致)', false)}
            ${drawNode(2, 482, 54, 196, 116, 'STEP 03 · 内核指纹篡改', '修改 sysctl 协议栈', '欺骗 p0f 被动OS指纹检测', 'TTL: 64(Linux) → 128(Win)', true)}
            ${drawNode(3, 712, 54, 183, 116, 'STEP 04 · 反向解析欺骗', '伪造 PTR 家宽域名', '抹除 datacenter/vps 字样', 'cpe-xx.socal.res.rr.com', true)}

            <!-- 未开透视镜时的底部伪装效果摘要 -->
            <rect x="25" y="210" width="870" height="48" rx="8" fill="${cCard}" stroke="${cBorder}" stroke-width="1" />
            <text x="42" y="239" fill="${cTealDeep}" font-family="Noto Serif SC, serif" font-size="13" font-weight="700">
              表面检测结果：出口 IP 一致（无分流） + whoer.net 识别为 Windows 100% 伪装度 + PTR 反向域名酷似 Spectrum 家宽
            </text>

            <!-- 开启透视镜后的破局覆盖层 -->
            ${drawXrayCallout(
              25, 268, 870, 70,
              'FCrDNS 正反向交叉验证 + 同 C 段邻居端口扫描',
              '1. 伪造的 PTR 域名 (cpe-23-106-xx-10.socal.res.rr.com) 正向 dig A 记录根本无法解析回原 IP！',
              '2. 扫描 23.106.xx.1~254 发现整段邻居全开着 22 (SSH) 端口 ──► 100% 是站群 Linux 服务器伪装！'
            )}
          </svg>
        `;
      } else {
        // ==========================================
        // 流派三 SVG：ASN借壳 + Geofeed + 五大IP数据库申诉洗白
        // ==========================================
        svgContent = `
          <svg viewBox="0 0 920 350" class="w-full h-auto select-none">
            <defs>
              <filter id="drop-shadow" x="-5%" y="-5%" width="110%" height="115%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#141413" flood-opacity="0.10" />
              </filter>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="${cTealDeep}" />
              </marker>
              <marker id="arrow-terra" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="${cTerraMid}" />
              </marker>
            </defs>

            <pattern id="smallGrid3" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E3E0D5" stroke-width="0.6"/>
            </pattern>
            <rect width="920" height="350" fill="url(#smallGrid3)" />

            <!-- 顶部横幅说明 -->
            <rect x="15" y="18" width="890" height="175" rx="14" fill="rgba(226, 240, 238, 0.45)" stroke="${cTealDeep}" stroke-width="1.5" stroke-dasharray="6 4" />
            <text x="30" y="38" fill="${cTealDeep}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">DATABASE WHITEWASHING PIPELINE: 从源头篡改 MaxMind / IPinfo / IP2Location 商业数据库标签</text>

            <!-- 顺序连接线 -->
            <line x1="218" y1="112" x2="245" y2="112" stroke="${cTerraMid}" stroke-width="3" marker-end="url(#arrow-terra)" />
            <line x1="218" y1="112" x2="245" y2="112" stroke="#FCA5A5" stroke-width="2" class="animate-flow" />

            <line x1="448" y1="112" x2="475" y2="112" stroke="${cTerraMid}" stroke-width="3" marker-end="url(#arrow-terra)" />
            <line x1="448" y1="112" x2="475" y2="112" stroke="#FCA5A5" stroke-width="2" class="animate-flow" />

            <line x1="678" y1="112" x2="705" y2="112" stroke="${cTealDeep}" stroke-width="3" marker-end="url(#arrow-teal)" />
            <line x1="678" y1="112" x2="705" y2="112" stroke="#A7F3D0" stroke-width="2" class="animate-flow" />

            <!-- 4个横向递进节点 -->
            ${drawNode(0, 25, 54, 193, 116, 'STEP 01 · 借壳ISP宣告', 'BGP 挂靠 AS174 广播', 'Cogent / Frontier / Zayo', '达成第1个ISP (ASN=isp)', true)}
            ${drawNode(1, 252, 54, 196, 116, 'STEP 02 · 壳公司与地理源', '美国宽带LLC + SWIP', '部署 RFC8805 geofeed.csv', 'WHOIS: Pacific Fiber LLC', true)}
            ${drawNode(2, 482, 54, 196, 116, 'STEP 03 · 官方工单洗白', '向五大IP库提交纠错', '谎称分配给FTTH家庭订阅户', 'DCH(机房) → Fixed ISP', true)}
            ${drawNode(3, 712, 54, 183, 116, 'STEP 04 · 伪双ISP诞生', '全网查IP站同步绿标', '切分253个节点高价售卖', 'ASN=isp & Company=isp', false)}

            <!-- 表面检测结果条 -->
            <rect x="25" y="210" width="870" height="48" rx="8" fill="${cCard}" stroke="${cBorder}" stroke-width="1" />
            <text x="42" y="239" fill="${cTealDeep}" font-family="Noto Serif SC, serif" font-size="13" font-weight="700">
              表面检测结果：ipinfo.io 显示完美双 "isp" + ping0.cc 显示绿色“家庭宽带” + Scamalytics 欺诈分为 0（市面上90%静态双ISP均属此类）
            </text>

            <!-- 开启透视镜后的破局覆盖层 -->
            ${drawXrayCallout(
              25, 268, 870, 70,
              '核查北美五大正统家宽 ASN 白名单 + 扫描同段 SSH 端口',
              '真美国家宽只有五大巨头：AT&T(AS7018)、Verizon(AS701)、Comcast(AS7922)、Charter(AS20115)、Cox(AS22773)',
              '凡是挂在 AS174(Cogent) 或生僻 Broadband LLC 下，且同 C 段邻居开着 22 端口的，100% 是机房洗白伪家宽！'
            )}
          </svg>
        `;
      }

      container.innerHTML = svgContent;
    }

    // 页面加载完成后初始化沙盘
    renderSandbox();
  
const actions={copyCodeBlock,copyVerifyCommand,selectMode,selectStep,prevStep,nextStep,toggleBuyerXray,triggerXrayHighlight};
function invoke(text,el){if(text==='window.print()'){window.print();return;}const m=/^(\w+)\(([^)]*)\)$/.exec(text||'');if(!m||!actions[m[1]])return;
 const args=m[2].trim()?m[2].split(',').map(s=>{s=s.trim();if(s==='this')return el;if(s==='this.checked')return el.checked;return /^\d+$/.test(s)?Number(s):s.replace(/^['"]|['"]$/g,'');}):[];actions[m[1]](...args);}
root.addEventListener('click',e=>{const el=e.target.closest('[data-s5-click]');if(el&&root.contains(el))invoke(el.dataset.s5Click,el);});
root.addEventListener('change',e=>{if(e.target.dataset.s5Change)invoke(e.target.dataset.s5Change,e.target);});
root.addEventListener('keydown',e=>{const el=e.target.closest('g[role="button"]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();invoke(el.dataset.s5Click,el);}});
})();
