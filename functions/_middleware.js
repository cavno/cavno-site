/**
 * 规范主机名守卫（Cloudflare Pages Function）
 * ==========================================
 * 为什么需要它：Cloudflare Access 的应用绑定在自有域名 cavno.org 上，
 * 而 Pages 项目自带的 <项目名>.pages.dev 属于 Cloudflare 的域、不在你的账户区域内，
 * **Access 规则管不到它** —— 任何人拿到 cavno.pages.dev/working/... 就能绕过鉴权。
 * 官方无一键关闭 pages.dev 的开关，故在此以 308 永久重定向把所有非规范主机的
 * 请求送回 cavno.org，Access 随即接管。副作用是顺带消除搜索引擎的重复内容问题。
 *
 * 预览部署（<hash>.<项目>.pages.dev）同样会被重定向到生产域名。
 * 若你需要保留预览环境用于自测，把该 hostname 加进 ALLOW 即可。
 */

const CANONICAL = 'cavno.org';
const ALLOW = new Set([CANONICAL, 'localhost', '127.0.0.1']);

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (!ALLOW.has(url.hostname)) {
    url.hostname = CANONICAL;
    url.port = '';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 308);
  }

  return next();
}
