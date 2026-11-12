# 亚马逊玩具类目万级关键词批处理引擎 · Cavno 原位替换增量包

本压缩包仅包含 `/working/amazon/toys-keyword-batch-engine/` 单页所需的增量替换文件（不含全站其余既有源码），可直接覆盖合并至 `D:\OneDrive\0_Private\cavno-site`。

## 1. 原位替换与构建步骤

1. 将本包内的 `src`、`public` 两个文件夹按原相对路径合并至 `D:\OneDrive\0_Private\cavno-site` 根目录（仅原位替换 `toys-keyword-batch-engine` 对应页面文件，不影响站内其他页面）。
2. 在项目根目录执行构建与三项全站审计：

```powershell
npm run build
node scripts/audit-collisions.mjs
node scripts/audit-url-paths.mjs
node scripts/audit-covers.mjs
```

3. 按站点既有流程发布 `dist/`，原路由 `https://cavno.org/working/amazon/toys-keyword-batch-engine/` 与 `https://cavno.org/working/amazon/` 栏目卡片将平滑更新。

## 2. 本次融合与精修要点

- **整站视觉统一**：将深色吸顶 `<header>` 拆分为 Cavno 燕麦色编辑室静态头部（`.kwe-hero-head`）与贴合站头下沿的毛玻璃胶囊子导航栏（`.kwe-subnav-bar`），图表与语义徽章全面对齐 `working:amazon` 暖赭石/草木青/琥珀棕学术色盘。
- **修复既有对比度与横滚问题**：修正 Tab 2 实盘底座卡片深色背景下的文字对比度，将主工作台 11 列表格桌面端最小宽度由 `1700px` 优化为 `1040px`（`1440px` 桌面视口下完整一屏展示无需横向拖拽）。
- **零冲突通过全站审计**：移除旧版 `style.css` 中触发 `audit-collisions.mjs` 报错的 `.cv-crumb-back` 选择器，纯 ASCII 路径与唯一封面签名 `funnel/split/steps/1` 全部校验通过。
