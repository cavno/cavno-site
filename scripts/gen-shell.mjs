#!/usr/bin/env node
/**
 * 生成 public/shell.js —— 未转换原始静态页的"兜底公共导航"
 *
 * 站内正规页面（首页/目录页/重构页）的公共导航由 Base.astro 提供，无需此脚本。
 * 若个别旧页暂不重构、直接以原样 HTML 放进 public/ 目录，只需在其 </body> 前加一行：
 *
 *     <script src="/shell.js" defer></script>
 *
 * 即可获得一枚悬浮导航胶囊（左上角）：Cavno. → 展开首页与四大板块链接，
 * 当前板块自动高亮。使用 Shadow DOM 渲染，与旧页样式互不污染。
 *
 * 本脚本以 src/content/nav.json 为唯一数据源，由 npm run dev / build 自动执行，
 * 改导航后无需手动同步。
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nav = JSON.parse(await fs.readFile(path.join(ROOT, 'src/content/nav.json'), 'utf-8'));
const data = nav.sections.map((s) => ({ slug: s.slug, en: s.en, zh: s.zh }));

const js = `/* 自动生成：node scripts/gen-shell.mjs（数据源 src/content/nav.json），请勿手改 */
(function () {
  if (document.getElementById('cavno-shell')) return;
  var NAV = ${JSON.stringify(data)};
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

  var links = '<a href="/">\\u9996\\u9875 <small>Home</small></a><div class="hr"></div>';
  for (var i = 0; i < NAV.length; i++) {
    var s = NAV[i];
    var cur = here.indexOf('/' + s.slug + '/') === 0 ? ' class="cur"' : '';
    links += '<a href="/' + s.slug + '/"' + cur + '>' + s.en + ' <small>' + s.zh + '</small></a>';
  }

  root.innerHTML = '<style>' + css + '</style>' +
    '<div class="wrap" id="w">' +
      '<div class="pill" id="p" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">' +
        '<span class="brand">Cavno<b>.</b></span><span class="chev">\\u25BC</span>' +
      '</div>' +
      '<nav class="panel" aria-label="\\u7AD9\\u70B9\\u5BFC\\u822A">' + links + '</nav>' +
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
`;

await fs.mkdir(path.join(ROOT, 'public'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'public/shell.js'), js, 'utf-8');
console.log(`public/shell.js 已生成（${data.length} 个板块）`);
