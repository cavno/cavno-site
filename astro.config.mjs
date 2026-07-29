import { defineConfig } from 'astro/config';

export default defineConfig({
  // 线上实际地址（shell.js 内嵌地址与旧仓库注入行都以此为准；换域名后改这里并重新 build + 部署）
  site: 'https://cavno-site.tchow.workers.dev',
  trailingSlash: 'ignore',
});
