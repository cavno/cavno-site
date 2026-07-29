/* 自动生成：node scripts/gen-shell.mjs（数据源 nav.json + astro.config.site），请勿手改 */
(function () {
  var doc = document;
  if (doc.getElementById('cavno-shell')) return;
  var SITE = "https://cavno.pages.dev";
  var NAV = [{"slug":"investing","en":"Investing","zh":"投资","subs":[{"slug":"options","en":"Options","zh":"期权"},{"slug":"valuation","en":"Valuation","zh":"估值"},{"slug":"cases","en":"Cases","zh":"案例"}]},{"slug":"reading","en":"Reading & Thinking","zh":"阅读与思考","subs":[{"slug":"books","en":"Books","zh":"书籍视察"},{"slug":"philosophy","en":"Philosophy","zh":"哲学"},{"slug":"thinking","en":"Thinking","zh":"思考"},{"slug":"math","en":"Mathematics","zh":"数学"}]},{"slug":"life","en":"Life & Skills","zh":"生活与技能","subs":[{"slug":"driving","en":"Driving","zh":"驾驶"},{"slug":"house","en":"House","zh":"房产"},{"slug":"school","en":"School","zh":"学校"},{"slug":"china","en":"China","zh":"中国"},{"slug":"family","en":"Family","zh":"育儿"},{"slug":"orders","en":"Orders","zh":"报单"},{"slug":"ai","en":"AI","zh":"AI"},{"slug":"skills","en":"Skills","zh":"技能"}]},{"slug":"working","en":"Working","zh":"工作","subs":[{"slug":"amazon","en":"Amazon Tools","zh":"亚马逊工具"}]}];
  var MAP = {"Investing":"investing","Reading_and_Thinking":"reading","Life_Style_and_Skills":"life","Working":"working"};

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  /* 当前板块：优先按旧仓库路径映射，其次按新站路径首段 */
  var seg = location.pathname.split('/').filter(Boolean)[0] || '';
  var cur = MAP[seg] || '';
  if (!cur) for (var i = 0; i < NAV.length; i++) if (NAV[i].slug === seg) cur = seg;

  var me = doc.currentScript;
  var noPad = !!(me && me.hasAttribute('data-nopad'));

  var css = [
    ':host{all:initial}',
    '*{box-sizing:border-box}',
    '.bar{position:fixed;top:0;left:0;right:0;height:60px;z-index:2147483000;',
    '  background:rgba(250,249,245,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
    '  border-bottom:1px solid #E3E0D5;',
    "  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif}",
    '.in{max-width:1180px;height:100%;margin:0 auto;padding:0 24px;display:flex;align-items:center;gap:4px}',
    ".brand{font-family:'Noto Serif SC','Songti SC',Georgia,serif;font-weight:700;font-size:19px;",
    '  color:#141413;text-decoration:none;margin-right:12px;white-space:nowrap}',
    '.brand b{color:#D97757}',
    '.it{position:relative;height:100%;display:flex;align-items:center}',
    '.btn{display:flex;align-items:center;gap:6px;padding:8px 13px;border-radius:999px;',
    '  font-size:14px;color:#141413;text-decoration:none;white-space:nowrap;line-height:1}',
    '.btn:hover{background:#ECE9DF}',
    '.it.cur .btn{background:#ECE9DF;font-weight:600;box-shadow:inset 0 0 0 1px #E3E0D5}',
    '.cv{font-size:9px;color:#63615B}',
    '.pn{position:absolute;top:calc(100% - 4px);left:0;min-width:280px;background:#fff;',
    '  border:1px solid #E3E0D5;border-radius:14px;box-shadow:0 16px 40px rgba(20,20,19,.12);padding:8px;',
    '  opacity:0;visibility:hidden;transform:translateY(6px);',
    '  transition:opacity .18s ease,transform .18s ease,visibility 0s linear .28s}',
    '.pn::before{content:"";position:absolute;left:-8px;right:-8px;top:-12px;height:12px}',
    '.it:hover .pn{opacity:1;visibility:visible;transform:translateY(0);transition-delay:0s}',
    '.pn a{display:block;padding:8px 11px;border-radius:9px;color:#141413;text-decoration:none;font-size:13.5px;line-height:1.5}',
    '.pn a small{color:#63615B;font-size:11px;margin-left:6px}',
    '.pn a:hover{background:#F0EEE6}',
    '.ph{border-top:1px solid #E3E0D5;margin-top:4px;padding-top:9px;color:#63615B;font-size:12.5px}',
    '.sp{flex:1}',
    '.home{background:#141413;color:#FAF9F5;border-radius:999px;padding:9px 16px;',
    '  font-size:13px;text-decoration:none;white-space:nowrap}',
    '.home:hover{background:#000}',
    '.bg{display:none;background:none;border:0;padding:10px;cursor:pointer;margin-left:auto}',
    '.bg span{display:block;width:19px;height:2px;background:#141413;margin:4px 0;border-radius:2px}',
    '.mp{position:fixed;top:60px;left:0;right:0;max-height:calc(100vh - 60px);overflow:auto;',
    '  background:#FAF9F5;border-bottom:1px solid #E3E0D5;padding:8px 20px 20px;display:none}',
    '.open .mp{display:block}',
    ".mp .sec{display:block;font-family:'Noto Serif SC','Songti SC',Georgia,serif;font-weight:700;",
    '  font-size:16.5px;color:#141413;text-decoration:none;padding:10px 0 4px;margin-top:6px;border-top:1px solid #E3E0D5}',
    '.mp .sec:first-child{border-top:0;margin-top:0}',
    '.mp .sub{display:block;color:#63615B;text-decoration:none;font-size:14px;padding:6px 0 6px 14px}',
    '.mp a.on{color:#C15F3C}',
    '@media (max-width:860px){.it,.home{display:none}.bg{display:block}}'
  ].join('');

  var items = '';
  for (var j = 0; j < NAV.length; j++) {
    var s = NAV[j];
    var subs = '';
    for (var k = 0; k < s.subs.length; k++) {
      var u = s.subs[k];
      subs += '<a href="' + SITE + '/' + s.slug + '/' + u.slug + '/">' + esc(u.en) +
              (u.zh !== u.en ? ' <small>' + esc(u.zh) + '</small>' : '') + '</a>';
    }
    subs += '<a class="ph" href="' + SITE + '/' + s.slug + '/">\u8FDB\u5165 ' + esc(s.zh) + ' \u677F\u5757 \u2192</a>';
    items += '<div class="it' + (cur === s.slug ? ' cur' : '') + '">' +
             '<a class="btn" href="' + SITE + '/' + s.slug + '/">' + esc(s.en) + ' <span class="cv">\u25BC</span></a>' +
             '<div class="pn">' + subs + '</div></div>';
  }

  var mob = '';
  for (var m2 = 0; m2 < NAV.length; m2++) {
    var t = NAV[m2];
    mob += '<a class="sec' + (cur === t.slug ? ' on' : '') + '" href="' + SITE + '/' + t.slug + '/">' +
           esc(t.en) + ' ' + esc(t.zh) + '</a>';
    for (var m3 = 0; m3 < t.subs.length; m3++) {
      var v = t.subs[m3];
      mob += '<a class="sub" href="' + SITE + '/' + t.slug + '/' + v.slug + '/">' + esc(v.en) +
             (v.zh !== v.en ? ' ' + esc(v.zh) : '') + '</a>';
    }
  }

  var host = doc.createElement('div');
  host.id = 'cavno-shell';
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML = '<style>' + css + '</style>' +
    '<div class="bar" id="w">' +
      '<div class="in">' +
        '<a class="brand" href="' + SITE + '/">Cavno<b>.</b></a>' +
        items +
        '<span class="sp"></span>' +
        '<a class="home" href="' + SITE + '/">\u56DE\u5230\u4E3B\u7AD9</a>' +
        '<button class="bg" id="bg" aria-label="\u83DC\u5355" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>' +
      '<nav class="mp" aria-label="\u7AD9\u70B9\u5BFC\u822A">' + mob + '</nav>' +
    '</div>';

  var w = root.getElementById('w');
  var bg = root.getElementById('bg');
  bg.addEventListener('click', function (e) {
    e.stopPropagation();
    var on = !w.classList.contains('open');
    w.classList.toggle('open', on);
    bg.setAttribute('aria-expanded', String(on));
  });
  doc.addEventListener('click', function (e) {
    var inShell = e.composedPath ? e.composedPath().indexOf(host) !== -1 : false;
    if (!inShell) { w.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); }
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { w.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); }
  });

  if (!noPad) {
    var pad = parseFloat(getComputedStyle(doc.body).paddingTop) || 0;
    doc.body.style.paddingTop = (pad + 60) + 'px';
  }
  doc.body.appendChild(host);
})();
