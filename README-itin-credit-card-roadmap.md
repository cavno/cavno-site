# Cavno `/investing/banking/` 新增《云居民 ITIN 申请美国信用卡实操指南与四阶段路线图》增量包

将本压缩包内的 `src/` 与 `public/` 直接解压合并到 `D:\OneDrive\0_Private\cavno-site` 根目录即可，无需修改任何既有源码文件（自动挂载至 `https://cavno.org/investing/banking/` 栏目页与全站搜索索引）。

## 新增增量文件（共 5 个站点文件）

1. `src/content/items/investing-banking-itin-us-credit-card-roadmap.md` — 银行卡栏目条目元数据（自动生成 `timeline` 几何封面，与栏目首篇 `feedback` 封面天然区分、同享 `212/26%` 投资蓝灰色板）。
2. `src/pages/investing/banking/itin-us-credit-card-roadmap.astro` — 页面路由外壳（含 248px 粘性目录与同栏目/跨栏目延伸阅读互链）。
3. `src/legacy/investing/banking/itin-us-credit-card-roadmap/body.html` — 完整正文与三组交互工作台（Pre-Flight 准入核验清单、Chase 5/24 卡槽与 GT 路径沙盘、首卡 1%–10% 安全使用率及 Credit Cycling 骑车风控检测器）。
4. `src/legacy/investing/banking/itin-us-credit-card-roadmap/style.css` — `.icr-*` 局部作用域样式（零 `.cv-*` 交叉冲突）。
5. `public/investing/banking/itin-us-credit-card-roadmap/assets/app.js` — 零外部依赖原生交互脚本。

## 本地验证命令

```powershell
npm run build
node scripts/audit-collisions.mjs
node scripts/audit-url-paths.mjs
node scripts/audit-covers.mjs
```
