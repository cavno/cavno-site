# 深圳25盘置业决策系统 · V11学区梯队版

来源附件：深圳25盘置业决策系统_V11学区梯队终极版.html。
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

- 保留附件原文、25个小区、45组户号、10个学区及六大百科、二胎时间轴。完整接入4段脚本与追加数据，没有新增楼盘记录或改写评分数据。
- 新增学区梯队全景、各小区小学/初中评级及第15项梯队多选，贯通学区表、宏观表、户号卡片、TOP4与PK；保留附件对万科麓城和鸿荣源尚峰的小学评级区分。
- 保留15维宏观、10维微观多选：同项按并集、不同项叠加过滤；支持五大片区、四房/3+1房、五级声学、本栋层高与梯户比、TOP4、六维权重和最多5项PK。
- 三率图、2024—2026趋势图（含福田外国语）、18个二手盘回撤图按附件原始序列、分组和数值呈现，没有生成新数据。
- CSV导出所有45组户号及小区、学校字段，沿用附件的CSV单元格转义；导出不受当前筛选影响。
- 下载完整HTML获得本页独立版，已内嵌样式、Chart.js、交互脚本和数据，支持离线使用（在线字体不可用时使用系统字体）。独立版搜索仅覆盖本工具，栏目链接指向cavno.org；正式接入版沿用全站搜索。

## 设计与依赖

复用现有 Base.astro、导航、页脚、字体与米白/珊瑚色风格；表格在自身区域横向滚动，手机端单列筛选。预算标签和金额保持横排、说明独立分行，保留上次布局修复。

Tailwind样式已预编译并限于本页。Chart.js 4.4.1及MIT许可证本地随包提供，无需新增项目依赖或修改package.json。不要将独立预览HTML直接替代Astro路由文件。

## 集成与旧版修复

- 旧版20/24盘、9学区、12/9维统计标签同步为实际25盘、10学区、15/10维。
- 修复附件中带小数点类名的无效选择器，避免第二段脚本报错而中止最后一段追加数据。
- 预算最高值及重置统一为附件V10的1500万元，金额标签与滑块一致。
- 多选楼盘后，只显示所选楼盘的楼栋；宏观条件变化时保留仍有效的选择；下钻按钮同步多选状态。
- 完整重置新增楼层、梯户比、声学筛选；保留上一版预算栏不挤压、不重叠的布局。
- 梯队选择器随宏观重置、全站重置一并恢复，所有事件与多选状态限定在本页；梯队全景与卡片手机端单列显示。

## 验证

已核对25盘、45户号、10学区及梯队新增字段的最终数据完整性，270个多选筛选组合与附件规则一致，图表数据核对通过。构建217页通过，栏目和搜索中本页链接各保留1条。

已验证宏观/微观联动、空结果重置、预算、权重、楼盘下钻、PK，以及1280/768/390/320px布局；浏览器无脚本错误。HTML与CSV均已实际下载，文件哈希与交付预览/预期CSV一致。独立HTML版本的社区过滤也已验证。

学区梯队、排位、升学率等均按附件原文保留，未作为外部核验结果。本次为页面集成与本地代码交付，尚未部署线上。
