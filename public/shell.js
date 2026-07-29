/* 自动生成：node scripts/gen-shell.mjs（数据源 src/content/nav.json），请勿手改 */
(function () {
  if (document.getElementById('cavno-shell')) return;
  var NAV = [{"slug":"investing","en":"Investing","zh":"投资"},{"slug":"reading","en":"Reading & Thinking","zh":"阅读与思考"},{"slug":"life","en":"Life & Skills","zh":"生活与技能"},{"slug":"working","en":"Working","zh":"工作"}];
  var here = location.pathname.endsWith('/') ? location.pathname : location.pathname + '/';

  var host = document.createElement('div');
  host.id = 'cavno-shell';
  var root = host.attachShadow({ mode: 'open' });

  var css = [
    ':host{all:initial}',
    '.wrap{position:fixed;top:14px;left:14px;z-index:2147483000;',
    "  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif}",
    '.pill{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;',
    '  background:#FAF9F5;color:#141413;border:1px solid #E3E0D5;border-radius:999px;',
    '  padding:8px 14px;font-size:14px;box-shadow:0 8px 24px rgba(20,20,19,.10)}',
    ".brand{font-family:'Noto Serif SC','Songti SC',Georgia,serif;font-weight:700;font-size:15px}",
    '.brand b{color:#D97757;font-weight:700}',
    '.chev{font-size:10px;color:#63615B;transition:transform .18s}',
    '.open .chev{transform:rotate(180deg)}',
    '.panel{margin-top:8px;min-width:210px;background:#fff;border:1px solid #E3E0D5;border-radius:14px;',
    '  box-shadow:0 16px 40px rgba(20,20,19,.12);padding:8px;display:none}',
    '.open .panel{display:block}',
    '.panel a{display:block;padding:9px 12px;border-radius:9px;text-decoration:none;',
    '  color:#141413;font-size:13.5px;line-height:1.4}',
    '.panel a small{color:#63615B;font-size:11px;margin-left:6px}',
    '.panel a:hover{background:#F0EEE6}',
    '.panel a.cur{color:#C15F3C;font-weight:600}',
    '.hr{height:1px;background:#E3E0D5;margin:6px 4px}'
  ].join('');

  var links = '<a href="/">\u9996\u9875 <small>Home</small></a><div class="hr"></div>';
  for (var i = 0; i < NAV.length; i++) {
    var s = NAV[i];
    var cur = here.indexOf('/' + s.slug + '/') === 0 ? ' class="cur"' : '';
    links += '<a href="/' + s.slug + '/"' + cur + '>' + s.en + ' <small>' + s.zh + '</small></a>';
  }

  root.innerHTML = '<style>' + css + '</style>' +
    '<div class="wrap" id="w">' +
      '<div class="pill" id="p" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">' +
        '<span class="brand">Cavno<b>.</b></span><span class="chev">\u25BC</span>' +
      '</div>' +
      '<nav class="panel" aria-label="\u7AD9\u70B9\u5BFC\u822A">' + links + '</nav>' +
    '</div>';

  var w = root.getElementById('w');
  var p = root.getElementById('p');
  function toggle(force) {
    var on = typeof force === 'boolean' ? force : !w.classList.contains('open');
    w.classList.toggle('open', on);
    p.setAttribute('aria-expanded', String(on));
  }
  p.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
  p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  document.addEventListener('click', function () { toggle(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });

  document.body.appendChild(host);
})();
