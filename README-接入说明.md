# 深圳20盘二胎置业全维度决策平台（数据补全版）· 替换增量代码

本包仅含本页的8个相关文件与本说明，不含全站源码。

## 接入

1. 备份同名文件，将包中的 `src`、`public` 按原路径合并覆盖到 Cavno 项目。
2. 运行 `npm run build`，按原有流程部署。页面仍为 `/life/house/longgang-home-school-decision/`，归入 `/life/house/`。
3. 同名内容条目自动更新栏目卡片与全站搜索，不重复新增记录。

## 文件

- `src/pages/life/house/longgang-home-school-decision.astro`
- `src/legacy/life/house/longgang-home-school-decision/body.html`
- `src/legacy/life/house/longgang-home-school-decision/style.css`
- `src/content/items/life-house-longgang-home-school-decision.md`
- `public/apps/life/house/longgang-home-school-decision/app.js`
- `public/apps/life/house/longgang-home-school-decision/chart.umd.min.js`
- `public/apps/life/house/longgang-home-school-decision/LICENSE-chart.js.txt`
- `public/apps/life/house/longgang-home-school-decision/standalone.html`

## 原附件内容与数量核对

- 本次附件标题仍写53组，实际 `UNITS_DATA` 内嵌31组完整记录。页面中的数量标签已统一为31，未生成缺失记录；保留20盘、9个学区、31组户号和仅补空缺的宏观补全字段。
- 横评表实际13列，已修正原来的14列标签；车位比与地铁距离显示完整原始指标，避免带图标字符串被截断。
- 清除附件保存时的动态表格/卡片快照，由原始数据重新生成，避免旧快照与当前数据不一致。
- 保留六大百科、二胎时间轴、六维权重、12项宏观筛选、16维户号筛选、全条件TOP4联动、五层PK、全部记录CSV导出。
- 学校三率图、14个二手盘历史回撤图保留原值；三年趋势缺逐年数据点，保留附件原有缺数说明，不生成趋势数值。
- 加权得分、筛选、总价区间交集、缺数处理与宏观字段只补空缺规则保持一致；没有进行外部价格或招生政策核验。

## 风格、离线与下载

复用 Cavno 的 `Base.astro`、导航、页脚、搜索、字体与米白/珊瑚色体系。样式和交互作用于本页，宽表格局部横向滚动，手机端单列筛选。Tailwind已预编译，Chart.js 4.4.1及MIT许可证本地随包提供，无需安装新依赖或更改package.json。

工具内“下载完整HTML”下载本页独立版，所需样式、脚本及数据全部内嵌；独立版自身也能继续下载。它的搜索仅检索本次工具，栏目链接指向cavno.org。正式接入版使用全站搜索。CSV导出保留所有31条数据及小区/学校字段，沿用原附件的CSV单元格转义。

## 验证

已完成数据与计算规则一致性核对、构建、主要筛选/推荐/PK、图表、手机布局及HTML/CSV下载检查。本次仅交付本地替换代码，尚未发布线上。
