# 《万历十五年》交互推演系统 · Cavno 增量接入包

本压缩包仅包含新增页面的 **7 个增量文件**（不含任何既有站点源码修改），可直接合并至 `D:\OneDrive\0_Private\cavno-site`。

## 1. 接入与构建步骤

1. 将本包内的 `src`、`public` 两个文件夹按原相对路径合并到 `D:\OneDrive\0_Private\cavno-site` 根目录（全为新增文件，不覆盖任何既有文件）。
2. 在项目根目录执行构建与三项全站审计：

```powershell
npm run build
node scripts/audit-collisions.mjs
node scripts/audit-url-paths.mjs
node scripts/audit-covers.mjs
```

3. 按站点既有 Cloudflare Pages 流程发布 `dist/`。
4. 新增页面访问路径：`https://cavno.org/reading/books/wanli-fifteen-institutional-deadlock/`
5. `src/content/items/reading-books-wanli-fifteen-institutional-deadlock.md` 会由现有 `[...path].astro`、`index.astro` 与 `search-index.json.ts` 自动收录至 `https://cavno.org/reading/books/`（自动生成 `reading:books` 色系下唯一封面签名 `book/split/dots/0`）、首页「最近更新」及全站搜索索引。

## 2. 增量文件清单

- `src/pages/reading/books/wanli-fifteen-institutional-deadlock.astro`：页面路由与 `Base.astro` 统一导航页脚外壳、面包屑（`Reading & Thinking · Books`）及文末返回链接。
- `src/content/items/reading-books-wanli-fifteen-institutional-deadlock.md`：`/reading/books/` 栏目卡片与全站检索元数据。
- `src/legacy/reading/books/wanli-fifteen-institutional-deadlock/body.html`：四模块交互推演 DOM 结构与原书金句检索抽屉（移除外部 CDN 头部与重复页脚，事件统一改为 `data-wl-*` 作用域委托）。
- `src/legacy/reading/books/wanli-fifteen-institutional-deadlock/style.css`：严格限定于 `#wanli-1587-app` 作用域的预编译布局工具类与 Cavno 视觉令牌样式（象牙白 `--paper`、燕麦色 `--panel`、衬线标题 `--serif`、珊瑚赭 `--coral-deep` 与书籍栏目暖棕朱砂学术色盘，零 Tailwind CDN 依赖）。
- `public/reading/books/wanli-fifteen-institutional-deadlock/assets/app.js`：IIFE 作用域封装的完整历史数据、6 幅内嵌人物肖像、3 幅交互 SVG 渲染器、六人反事实路径推演器、组织诊断仪与 Chart.js 暖色配置。
- `public/reading/books/wanli-fifteen-institutional-deadlock/assets/chart.umd.min.js`：本地静态托管的 Chart.js v4.4.1（零外部 CDN 依赖）。
- `public/reading/books/wanli-fifteen-institutional-deadlock/assets/LICENSE-chart.js.txt`：Chart.js MIT 许可证声明。
