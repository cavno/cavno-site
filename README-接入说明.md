# 亚马逊美国站玩具类目 · 关键词广告批处理引擎 · Cavno 增量接入

仅含本页 9 个新增相关文件及本说明，不含修改后的全站源码。
来源附件：`C:\Users\chowm\Downloads\code_artifact.html`。

## 接入方法

1. 将压缩包中的 `src`、`public` 合并到现有 Cavno 项目根目录，保持目录层级。
2. 运行 `npm run build`。
3. 按网站现有流程部署。
4. 新页面地址：`/working/amazon/toys-keyword-batch-engine/`。
5. 内容集合会自动把本页加入 `/working/amazon/`，不会覆盖旧的关键词结构分析台等其他工具。

## 新增文件

- `src/pages/working/amazon/toys-keyword-batch-engine.astro`
- `src/legacy/working/amazon/toys-keyword-batch-engine/body.html`
- `src/legacy/working/amazon/toys-keyword-batch-engine/style.css`
- `src/content/items/working-amazon-toys-keyword-batch-engine.md`
- `public/working/amazon/toys-keyword-batch-engine/assets/app.js`
- `public/working/amazon/toys-keyword-batch-engine/assets/chart.umd.min.js`
- `public/working/amazon/toys-keyword-batch-engine/assets/LICENSE-chart.js.txt`
- `public/working/amazon/toys-keyword-batch-engine/assets/xlsx.full.min.js`
- `public/working/amazon/toys-keyword-batch-engine/assets/LICENSE-xlsx.txt`

## 原文与功能保留

附件中的所有静态文字、10 行真实样本、29 个周度数据点、季节参数、前置否定词分类、决策规则和内嵌 Python 源码均保留，没有补写运营内容或调整策略公式。

保留五个模块：批处理投放与匹配工作台、N-Gram 与广告分舱、前置与绩效否定词库、季节性曲线与 ABA 三拐点、算法逻辑与 Python 源码。

保留表格导入、字段映射、去重/原始行视图、搜索筛选、排序分页、查看依据、季节切换、参数修改、否定词添加/移除/复制、ABA 导入及模板下载、五表 Excel 导出、Python 源码复制和下载。原附件的文内统计、策略判断及源文档描述原样保留，本次未另行事实核验。

## 样式同步

复用现有 `Base.astro` 的导航、搜索、字体和页脚。同步米白底、珊瑚色、绿色与衬线标题；调整头部、卡片、标签、图表配色、分页区和详情弹窗。宽表及代码局部滚动，手机端模块导航横向滚动。

原始事件处理函数通过本页事件代理调用，数据状态封装在本页作用域；原核心计算与导出规则不变。内嵌 Python 函数产生的源码已按字节核对一致。

Tailwind 已预编译并限定在 `#toys-keyword-app`，不依赖 Tailwind CDN、不新增 npm 依赖、不修改公共样式。Chart.js 4.4.1、SheetJS 0.18.5 沿用附件版本，改为随包本地资源，并附 MIT / Apache-2.0 许可证。

## Working 访问控制

本页 HTML 和脚本、库资源均位于 `/working/amazon/toys-keyword-batch-engine/` 下，沿用网站现有 `/working/*` 的 Cloudflare Access 规则。不要把这些资源改放到不受保护的 `/apps/` 或其他公开路径。

沿用 `Base.astro` 的 `noindex, nofollow`。按现有站点规则，Working 内容不会写入公开的 `/search-index.json`；本页不会改变全站搜索的权限边界。本次未修改 Cloudflare Access 配置。

另附独立 HTML 预览，内嵌所需样式、脚本、库和原始样本，直接打开即可。其搜索只检索该预览页，其他栏目链接指向 cavno.org；该独立文件本身不具备网站登录保护，请按本地文件管理。本次没有把独立预览加入正式部署文件。

## 验证

- 静态文字比对一致；10 行样本、29 个周度数据点、季节配置和 Python 源码一致。
- 24 组季节/阈值/数据场景的策略结果与原附件一致。
- 构建通过；Amazon 目录新增入口 1 条；公开搜索中新增入口 0 条；保留 noindex。
- 已验证 120 行 Excel 导入、3 页分页、恢复 10 行样本、四季切换、阈值修改、搜索与视图切换、详情弹窗、N-Gram 筛选、否定词添加与移除。
- Excel 五表已实际下载并逐项与预期值核对：8/49/19/10/8 行；下载的 Python 文件哈希与原附件生成的源码一致；ABA 模板下载后回导识别 3 条关键词。
- 桌面和 390px/320px 手机布局检查通过，五个模块无整页横向溢出；浏览器无脚本错误。

本次为本地增量代码交付，尚未部署线上。线上 Working 页面需要登录，样式适配依据所提供的网站源码完成。
