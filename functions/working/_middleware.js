/**
 * Working 板块的边缘鉴权（Cloudflare Pages Function）
 * ==================================================
 * 与前端口令门的区别：这一层在 Cloudflare 边缘执行，未通过校验时
 * **页面 HTML 根本不会下发** —— 直接访问 URL、查看源码、抓包都拿不到内容。
 * 前端那层只是遮挡，这一层才是真正的防护。
 *
 * 启用方式（Cloudflare 后台 → Pages 项目 → Settings → Environment variables）：
 *   WORKING_CODE   六位口令（与前端口令保持一致即可，也可不同）
 *   WORKING_SECRET 任意长随机串，用于给 Cookie 签名（务必与口令不同）
 * 两个变量都设为 Secret 类型。未设置 WORKING_CODE 时本中间件直接放行，
 * 站点行为与现在完全一致（便于先部署、后开启）。
 *
 * Cookie 有效期 30 天，HttpOnly + Secure + SameSite=Lax，签名防伪造。
 */

const COOKIE = 'cvw';
const MAX_AGE = 30 * 24 * 3600;

const enc = new TextEncoder();

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* 定长比较，避免计时侧信道 */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function makeToken(secret, exp) {
  return exp + '.' + (await hmac(secret, String(exp)));
}

async function validToken(secret, token) {
  if (!token) return false;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return false;
  const exp = token.slice(0, dot);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(token.slice(dot + 1), await hmac(secret, exp));
}

function readCookie(req, name) {
  const raw = req.headers.get('Cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function loginPage(msg, status) {
  const body = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>受限板块 · Cavno</title>
<style>
:root{--paper:#FAF9F5;--card:#fff;--ink:#141413;--ink2:#5F5E5A;--line:#E5E3DC;--coral:#D97757}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
background:var(--paper);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;padding:24px}
form{width:100%;max-width:400px;background:var(--card);border:1px solid var(--line);border-radius:18px;
padding:38px 32px;box-shadow:0 10px 40px rgba(20,20,19,.07);text-align:center}
.eb{font-size:11.5px;letter-spacing:.18em;color:var(--coral);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
h1{font-size:23px;margin:12px 0 8px;font-weight:600}
p{font-size:13.5px;line-height:1.85;color:var(--ink2);margin:0 0 22px}
input{width:100%;height:52px;text-align:center;font-size:24px;letter-spacing:.5em;border:1px solid var(--line);
border-radius:10px;background:var(--paper);color:var(--ink);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
input:focus{outline:none;border-color:var(--coral);box-shadow:0 0 0 3px rgba(217,119,87,.16)}
button{margin-top:14px;width:100%;height:46px;border:0;border-radius:10px;background:var(--ink);color:#fff;font-size:14.5px;cursor:pointer}
button:hover{opacity:.88}
.err{color:var(--coral);font-size:12.5px;margin-top:12px;min-height:18px}
.bk{display:inline-block;margin-top:18px;font-size:13px;color:var(--ink2);text-decoration:none;border-bottom:1px solid var(--line)}
</style></head><body>
<form method="POST">
  <div class="eb">WORKING · 受限板块</div>
  <h1>请输入六位口令</h1>
  <p>本板块含工作数据与内部工具。验证通过后 30 天内免再次输入。</p>
  <input name="code" type="password" inputmode="numeric" maxlength="6" autocomplete="off" autofocus aria-label="六位口令">
  <button type="submit">进入</button>
  <div class="err">${msg || ''}</div>
  <a class="bk" href="/">← 返回首页</a>
</form></body></html>`;
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html;charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const code = env.WORKING_CODE;
  const secret = env.WORKING_SECRET || code;

  // 未配置口令 → 不启用鉴权，行为与静态站一致
  if (!code) return next();

  // 已持有有效签名 Cookie → 放行
  if (await validToken(secret, readCookie(request, COOKIE))) {
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return out;
  }

  // 提交口令
  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const input = ((form && form.get('code')) || '').toString().trim();
    if (safeEqual(input, String(code))) {
      const token = await makeToken(secret, Date.now() + MAX_AGE * 1000);
      return new Response(null, {
        status: 303,
        headers: {
          Location: new URL(request.url).pathname,
          'Set-Cookie': `${COOKIE}=${encodeURIComponent(token)}; Path=/working/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'Cache-Control': 'no-store',
        },
      });
    }
    return loginPage('口令不正确，请重试', 401);
  }

  return loginPage('', 401);
}
