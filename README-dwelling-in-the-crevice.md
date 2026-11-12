# 《在裂隙中安居》五元存在论交互系统 · Cavno 原位替换增量包

本压缩包仅包含 `/reading/philosophy/dwelling-in-the-crevice/` 单页所需的 **5 个原位替换文件**（不含全站其余既有源码），可直接覆盖合并至 `D:\OneDrive\0_Private\cavno-site`。

## 1. 原位替换与构建步骤

1. 将本包内的 `src`、`public` 两个文件夹按原相对路径覆盖合并至 `D:\OneDrive\0_Private\cavno-site` 根目录（仅替换 `dwelling-in-the-crevice` 自身对应文件）。
2. 在项目根目录执行构建与三项全站审计：

```powershell
npm run build
node scripts/audit-collisions.mjs
node scripts/audit-url-paths.mjs
node scripts/audit-covers.mjs
```

3. 按站点既有流程发布 `dist/`，原路由 `https://cavno.org/reading/philosophy/dwelling-in-the-crevice/` 与 `https://cavno.org/reading/philosophy/` 哲学栏目卡片将平滑更新。

## 2. 本次融合与精修要点

- **整站视觉统一与单行导览**：移除与站头重叠的双重品牌栏及重复移动端汉堡按钮，重构为贴合站头下沿的毛玻璃胶囊章节导览栏（`.ph-subnav-bar`），建立五元独立古典语义色（悲剧朱砂 `#9A3B2E`、虚无紫灰 `#6B5278`、荒诞赭黄 `#A67228`、自由青石 `#346875`、救赎珊瑚赭 `#C15F3C`）。
- **修复两幅核心交互 SVG 失真与隐形缺陷**：修正既有版本中 `<radialGradient>` / `<linearGradient>` / `viewBox` 被小写化导致螺旋连接线消失的问题，并将螺旋同心圆与伪自由五维雷达网格线由白底白线修正为清晰暖灰石刻线条。
- **零冲突通过全站审计**：移除旧版 `style.css` 中触发 `audit-collisions.mjs` 报错的 `.cv-crumb-back` 选择器，纯 ASCII 路径与哲学栏目封面多样性校验（`rift/framed/lines/2`）全部通过。
