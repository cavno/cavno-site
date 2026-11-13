# 亚马逊玩具类目万级关键词批处理引擎 v2 · Cavno 原位替换增量包

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

## 2. 本次 v2 升级与视觉融合要点

- **完整融入 v2 新增能力**：包含项目工作区生命周期初始化向导、IndexedDB 本地持久化批次台账（支持 `isolate` 独立激活、`merge` 多表合并、Solo 锁定与跨批次异动对比）以及四列交互式【词根 → 匹配方式 → 裂变搜索词 → 目标广告组】桑基流向沙盘与建组执行单导出。
- **整站视觉统一**：将深色吸顶顶栏与三个模态框头部全面重构为 Cavno 燕麦色编辑室美学（`.kwe-hero-head`、`.kwe-subnav-bar`、`.kwe-modal-head`），Chart.js 图表与桑基图丝带统一对齐 `working:amazon` 暖赭石/草木青/琥珀棕古典学术色盘。
- **零外部 CDN 与零冲突通过全站审计**：内置本地 `chart.umd.min.js` 与 `xlsx.full.min.js`，全部样式与事件严格限定于 `#toys-keyword-app` 作用域内，纯 ASCII 路径与唯一封面签名全部校验通过。
