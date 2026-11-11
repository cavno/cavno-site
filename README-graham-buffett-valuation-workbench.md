# 《价值投资：从格雷厄姆到巴菲特》交互式估值工作台 · Cavno 增量接入包

本压缩包仅包含新增页面的 **7 个增量文件**（不含修改后的全站既有源码），可直接合并至 `D:\OneDrive\0_Private\cavno-site`。

## 1. 接入与构建步骤

1. 将本包内的 `src`、`public` 两个文件夹按原相对路径合并到 `D:\OneDrive\0_Private\cavno-site` 根目录（均为新增文件，不覆盖任何既有文件）。
2. 在项目根目录打开终端，执行构建与校验：

```powershell
npm run build
node scripts/audit-collisions.mjs
node scripts/audit-url-paths.mjs
node scripts/audit-covers.mjs
```

3. 按站点既有 Cloudflare Pages 流程发布 `dist/`。
4. 新增页面访问路径：`https://cavno.org/investing/valuation/graham-buffett-valuation-workbench/`
5. `src/content/items/investing-valuation-graham-buffett-valuation-workbench.md` 会由现有 `[...path].astro` 与 `search-index.json.ts` 自动收录至 `https://cavno.org/investing/valuation/`、首页「最近更新」及全站搜索索引，与既有《核心概念与内在逻辑》长文导读及《称重机估值报告》并列呈现。

## 2. 增量文件清单

- `src/pages/investing/valuation/graham-buffett-valuation-workbench.astro`：页面路由与 `Base.astro` 统一导航页脚外壳、面包屑及文末互链。
- `src/content/items/investing-valuation-graham-buffett-valuation-workbench.md`：`/investing/valuation/` 栏目卡片与全站检索元数据。
- `src/legacy/investing/valuation/graham-buffett-valuation-workbench/body.html`：工作台五模块 DOM 结构与因果闭环弹窗（移除外部 CDN 头部与重复页脚，事件改为 `data-gbv-*` 作用域委托）。
- `src/legacy/investing/valuation/graham-buffett-valuation-workbench/style.css`：限定于 `#graham-buffett-app` 作用域的预编译布局工具类与 Cavno 视觉令牌样式（象牙白 `--paper`、燕麦色 `--panel`、衬线标题 `--serif`、珊瑚赭 `--coral-deep` 与估值栏目草木青 `#3B6E58`，零 Tailwind CDN 依赖）。
- `public/investing/valuation/graham-buffett-valuation-workbench/assets/app.js`：IIFE 作用域封装的完整估值计算逻辑、原书数据集与 Chart.js 暖色学术配色配置。
- `public/investing/valuation/graham-buffett-valuation-workbench/assets/chart.umd.min.js`：本地静态托管的 Chart.js v4.4.1（避免外部 CDN 阻塞）。
- `public/investing/valuation/graham-buffett-valuation-workbench/assets/LICENSE-chart.js.txt`：Chart.js MIT 许可证声明。
