import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cavno.org',
  trailingSlash: 'ignore',
  build: {
    /* 样式内联进 HTML：
     * 1) 大陆网络下少一次对 Cloudflare 的阻塞式请求，首屏不再依赖外链 CSS 是否可达；
     * 2) 彻底消除"旧缓存 HTML 指向已轮换的 /_astro/<hash>.css → 404 → 页面裸奔"这一类故障。
     * 代价：单页 HTML 增大（最重的页约 +33KB，多数页 +16KB），换来零外链依赖。*/
    inlineStylesheets: 'always',
  },
});
