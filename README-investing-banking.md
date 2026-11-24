# Cavno `Investing · Banking & Cards（银行卡）` 二级栏目与首篇页面增量包

将本压缩包内的 `src/` 与 `public/` 直接解压合并到 `D:\OneDrive\0_Private\cavno-site` 根目录即可。

## 增量文件清单（共 6 个站点文件）

1. `src/content/nav.json` — 在 `investing.subsections` 下注册新增二级栏目 `banking`（`Banking & Cards · 银行卡`），`src/pages/[...path].astro`、顶部 Mega Menu、移动端抽屉、`/investing/` 筛选栏与全站搜索会自动生成 `/investing/banking/` 二级页面，无需修改任何布局源码：
   ```json
   {
     "slug": "banking",
     "en": "Banking & Cards",
     "zh": "银行卡",
     "desc": "美国银行账户分层、借记与信用卡机制、发卡行阶梯与信用建档闭环"
   }
   ```
2. `src/content/items/investing-banking-us-bank-accounts-and-cards-guide.md` — 银行卡栏目首篇条目元数据（自动生成封面与阅读时长卡片）。
3. `src/pages/investing/banking/us-bank-accounts-and-cards-guide.astro` — 页面路由外壳（复用 `Base.astro` 与 248px 粘性章节目录）。
4. `src/legacy/investing/banking/us-bank-accounts-and-cards-guide/body.html` — 完整正文与三组交互实验台（账户生息与额度使用率推演、EFTA/FCBA 盗刷权责沙盘、双轨闭环 SVG 拓扑）。
5. `src/legacy/investing/banking/us-bank-accounts-and-cards-guide/style.css` — `.ubk-*` 命名空间局部样式（零 `.cv-*` 冲突，适配移动端与打印模式）。
6. `public/investing/banking/us-bank-accounts-and-cards-guide/assets/app.js` — 零外部依赖原生交互脚本。

## 本地验证命令

```powershell
npm run build
node scripts/audit-collisions.mjs
node scripts/audit-url-paths.mjs
node scripts/audit-covers.mjs
```
