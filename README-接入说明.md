# 深圳20盘二胎置业决策平台 · 社区与户号联动版

来源附件：gemini-code-1793194457348.html。
本包仅含本页的8个相关文件和本说明，不含全站源码。

## 接入

1. 备份同名文件，将包内 src、public 按原目录合并覆盖到 Cavno 项目。
2. 运行 npm run build，按原网站流程部署。
3. 页面继续使用 /life/house/longgang-home-school-decision/，归属 /life/house/；原有内容条目被覆盖，栏目卡片和搜索自动更新，不重复新增。

## 文件

- `src/pages/life/house/longgang-home-school-decision.astro`
- `src/legacy/life/house/longgang-home-school-decision/body.html`
- `src/legacy/life/house/longgang-home-school-decision/style.css`
- `src/content/items/life-house-longgang-home-school-decision.md`
- `public/apps/life/house/longgang-home-school-decision/app.js`
- `public/apps/life/house/longgang-home-school-decision/chart.umd.min.js`
- `public/apps/life/house/longgang-home-school-decision/LICENSE-chart.js.txt`
- `public/apps/life/house/longgang-home-school-decision/standalone.html`

## 内容与交互

- 保留附件原文、20个小区、31组户号、9个学区及六大百科、二胎时间轴。仅适配站点布局与交互作用域。
- 保留附件的新架构：12维宏观条件同步过滤宏观表、入围楼盘与楼栋、9维户号卡片以及TOP4；保留下钻、重置、六维权重和最多5项PK。
- 三率图、2024—2026趋势图、14个二手盘回撤图按附件原始序列、分组和数值呈现，没有生成新数据。
- CSV导出所有31组户号及小区、学校字段，沿用附件的CSV单元格转义；导出不受当前筛选影响。
- 下载完整HTML获得本页独立版，已内嵌样式、Chart.js、交互脚本和数据，支持离线使用（在线字体不可用时使用系统字体）。独立版搜索仅覆盖本工具，栏目链接指向cavno.org；正式接入版沿用全站搜索。

## 设计与依赖

复用现有 Base.astro、导航、页脚、字体与米白/珊瑚色风格；表格在自身区域横向滚动，手机端单列筛选。预算标签和金额保持横排、说明独立分行，保留上次布局修复。

Tailwind样式已预编译并限于本页。Chart.js 4.4.1及MIT许可证本地随包提供，无需新增项目依赖或修改package.json。不要将独立预览HTML直接替代Astro路由文件。

## 验证

已核对原文和三组数据完整性，8个筛选/评分函数及101个筛选场景与原附件一致，三张图表的数据序列一致。构建217页通过，栏目和搜索中本页链接各保留1条。

已验证宏观/微观联动、空结果重置、预算、权重、楼盘下钻、PK，以及1280/768/390/320px布局；浏览器无脚本错误。HTML与CSV均已实际下载，文件哈希与交付预览/预期CSV一致。独立HTML版本的社区过滤也已验证。

本次是页面集成与本地代码交付，未重新核验附件中的房价或招生政策，尚未部署线上。
