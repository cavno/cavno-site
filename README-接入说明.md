# 深圳25盘置业决策系统 · V12纯净修复版 · Cavno 样式同步

本包仅含替换本页面的 8 个相关文件及本说明，不含修改后的全站源码。
来源：`深圳25盘置业决策系统_V12纯净修复终极版.html`。

## 接入

1. 备份同名文件，将包内 `src`、`public` 按原目录合并覆盖到现有 Cavno 项目。
2. 运行 `npm run build`。
3. 按网站原有流程部署。
4. 页面继续使用 `/life/house/longgang-home-school-decision/`，归属 `/life/house/`，不会新增第二条同名页面。
5. 原内容条目被覆盖后，房产栏目及全站搜索自动更新。

## 文件

- `src/pages/life/house/longgang-home-school-decision.astro`
- `src/legacy/life/house/longgang-home-school-decision/body.html`
- `src/legacy/life/house/longgang-home-school-decision/style.css`
- `src/content/items/life-house-longgang-home-school-decision.md`
- `public/apps/life/house/longgang-home-school-decision/app.js`
- `public/apps/life/house/longgang-home-school-decision/chart.umd.min.js`
- `public/apps/life/house/longgang-home-school-decision/LICENSE-chart.js.txt`
- `public/apps/life/house/longgang-home-school-decision/standalone.html`

## 原文与功能

以 V12 附件为唯一内容和功能来源。保留全部原文、25 个小区、45 组户号、10 个学区、六大百科、二胎时间轴、学区梯队全景和三张图表。

完整保留 V12 单核引擎的 15 维宏观与 10 维微观多选、项目/楼栋联动、预算、六维评分权重、TOP4、下钻、最多 5 项 PK、各类恢复默认和重置规则。

没有套用 V11 的追加脚本或旧版逻辑补丁；没有修改附件文字、数据、价格、学校评级、统计标签、评分公式或过滤条件。附件现有技术说明与表述均按原文保留。

## 样式同步范围

复用 Cavno 的 `Base.astro`、导航、搜索、字体和页脚；统一米白底、珊瑚色和绿色。原页面标题及模块导航移入网站页头，原版本标识、导出按钮和家庭时间轴保留在信息区。调整卡片、字号、表格列宽、多选下拉、预算栏和手机排版。

宽表在自身区域横向滚动；学区梯队卡片桌面两列、手机单列。Tailwind 工具样式已预编译并限定在本页，不新增 npm 依赖、不修改全站公共样式。Chart.js 仍为附件引用的 4.4.1 版，附本地文件及 MIT 许可证，避免依赖外部 CDN。

## 导出适配

CSV 导出保留原字段顺序、数据、单元格转义及原文件名；全量 45 组，不受当前过滤条件影响。

“一键下载本系统完整 HTML 文件”保留 V12 的纯净快照处理：移除运行时多选控件、清理 canvas 实例属性，并仍使用原下载文件名。正式网站版只把快照装入随包的独立 HTML 外壳，内嵌本页样式、Chart.js 和完整数据，使其下载后可再次独立打开。

`public/apps/life/house/longgang-home-school-decision/standalone.html` 必须一并部署。另附独立预览 HTML，与该文件一致。独立版搜索只检索本页，其余栏目链接指向 cavno.org；正式接入版使用全站搜索。外部字体不可用时回落到系统字体。

## 验证

- 静态原文一致性核对通过（仅标题和模块导航换位，忽略 HTML 排版空白）。
- 25 小区、45 户号、10 学区最终数据与附件完全一致。
- 270 组筛选条件与加权分、三张图表全部系列的标签和数值、CSV 导出均与附件一致。
- Astro 构建通过；房产目录和搜索中本页入口各 1 条。
- 已检查主要筛选、下钻、PK、权重、重置、下载与手机排版。
- HTML 与 CSV 均已实际下载，CSV 哈希与预期一致；HTML 快照经静态检查确认无残留多选组件、无外部脚本且 canvas 运行时属性已清理。受浏览器本地文件协议限制，未直接打开下载文件；通过 HTTP 访问的独立预览已验证初始化、筛选与重载。

本次为本地增量代码交付，尚未部署线上。
