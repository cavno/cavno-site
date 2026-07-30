# 迁移报告 · 2026-07-29

## 总量
- 源仓库 4 个（Investing / Reading_and_Thinking / Life_Style_and_Skills / Working），HTML 92 个
- **重构为站内原生页面：78 页**（= 全部内容页）；跳过：旧 hub 首页 7 个、草稿 index0/1/2 共 7 个
- 排除的工程树（非静态页面，未转换）：全部小程序目录（*-wxamp / miniprogram / miniapp / weapp，约 10 个）、业委会 yezhu-linuxserver / yezhu-winserver 内嵌 web
- 被引用资产按需拷贝 24 个文件（约 5 MB）；未整树搬运（源仓库含约 390 MB 图片/PDF/EPUB 等重资产，均未被页面引用）
- 构建产物 100 页（78 重构页 + 首页 + 4 板块页 + 16 栏目页 + 404），单文件全部低于 25 MB 红线

## 目录映射（可在 scripts/migrate-all.mjs 调整后 --force 重跑）
- Investing → investing/options（12 个期权类应用）· valuation（价值投资导读 + 称重机示例报告）· cases（信用扩张、Jane Street）
- Reading_and_Thinking/{Books, Philosophy, Thinking, Mathematics} → reading/{books, philosophy, thinking, math}
- Life_Style_and_Skills/{Driving, School, 房地产, 中国, 育儿, 报单} → life/{driving, school, house, china, family, orders}（house/china/family/orders 为依真实内容新增的栏目）
- Working/Amazon_Tools → working/amazon（10 个工具台）

## 设计决策
- **画布层统一，强调色保留**：羊皮纸底色族 / 墨色族 / 灰阶已映射为新设计令牌（含内联 style 属性）；各页强调色（阶段色、学派色、赭/青/紫等）是内容语义，脚本刻意不动。SVG fill 与 canvas/JS 字面色值同样保留（如《历代经济变革得失》图内文字、《形式法则》动画）。形态级统一（按钮/圆角/间距）属逐页精修范畴。
- 站内互链已改写为新路由；相对资产改写为绝对地址并按应用目录隔离拷贝。

## 需人工过目的页面（转换已完成、可正常访问，按优先级）
1. life/house/szfzsz-apartment-web —— 依赖 Tailwind CDN，运行时注入全局样式，可能轻微影响外壳，建议此页手工改造
2. 整屏布局页（100vh/100dvh，共 30 页）—— 套壳后总高度增加一个外壳高度，滚动行为需过目
3. 悬浮元素页（position:fixed，共 22 页）—— 注意与站点顶栏(z-index:60)的层叠
4. 脚本触碰 document.body/html 的页面（共 5 页）—— 确认目标是否应改为 .lp 容器
5. localStorage 页（共 7 页）—— 同域后注意各页 key 命名互不覆盖

## 已知事项
- 内容重复：总弧图（philosophical_lineage-main 与 总弧图支点搬家史）、Logos 系统动力学（独立目录与 二元悖论的张力/ 下）各有两份，均已转换，建议保留一份后删除另一份的三件套（page/legacy/item）
- 条目日期取各源仓库最后一次提交日（浅克隆无逐文件历史）：investing 2026-07-28 · reading 2026-07-29 · life 2026-07-29 · working 2026-07-20，可在 items/*.md 手工精修
- 旧仓库根部与板块根部的 hub 首页未转换（其职能由新站目录页替代）；旧站跳转与共享导航注入见 README §2.5 / §4

## 2026-07-30 · 兼容性修复：外壳命名空间化
- 病因：隔离原为单向（旧页样式圈禁于 .lp），外壳全局类反向渗入内容区。典型症状：工具内容面板类名 .panel 命中外壳下拉菜单规则（absolute + opacity:0 + visibility:hidden）整体隐身；审计显示 78/79 个旧页存在词汇撞车（.wrap/.hero/.chip/.panel/.btn 等 30 项），另有 2 页 #drawer/#drawerClose 与外壳同 ID。
- 修复：外壳 87 个组件类全部 cv- 前缀化、6 个 ID 重命名（旧页零改动、功能零触碰）；状态类 open/active/plan/scrolled/lock 保留原名但仅出现在锚定 cv- 组件的复合选择器中；唯一例外 .dot → .cv-bdot（《西方哲学史考察十讲》本就使用 cv-dot）。
- 保障：scripts/audit-collisions.mjs 实证外壳↔旧页命名交集为 ∅，转换新页后复跑即可守住边界。
- 残余已知项（外观级，非功能）：元素级全局样式（h1/h2/a/code 的字体与链接复位）仍会进入 .lp，旧页未自定义处会呈现站点排版，属可接受的统一化副作用。

## 2026-07-30 · 增量二
- 销售明细透视台：透视表新增「采购成本占比 Purchase」「头程成本占比 First-leg」两列（口径 Σ÷Σ销售额，沿用源表符号——采购/头程在财务导出中为正值，占比为正）；导出 CSV、口径说明弹窗、层级/总计行同步。数据源列 采购成本/头程成本 原本即在导入映射（NUM_COLS）中，历史批次无需重导。
- 品牌清除：站内全部 "KOKODI" 字样移除或替换为示例值（工具头/脚、关键词分组演示数据、报单演示店铺与券码、两个条目标题）。唯一保留：透视台 IndexedDB 内部键名 kokodi_sales_pivot——改名会使已导入的本地数据失联，属存储标识而非展示文案；如坚持更名需接受本地库清空或另写迁移。
- 修复 cv-cv 类名污染：上轮 ID 全词替换二次污染了 class 值（cv-drawer→cv-cvDrawer 等），致移动端抽屉掉入文档流在所有页面顶部裸奔、汉堡与目录视图选择器失配；已按语境归位（class→cv-x，id/JS→cvX），audit 脚本新增第二道检查（外壳标记 ↔ global.css 一致性），两道检查均通过。

## 2026-07-30 · 增量三：销售明细透视台「目标对比」
- 新增第五个标签页「目标对比」：《年度目标规划》（行式月度拆解，月份 YYYYMM）× 销售明细的达成分析。维度三档：按负责人 / 按产品 / 负责人×产品；粒度年/月；国家筛选；层级表（目标·实际·达成率进度条 × 销量/销售额，毛利以差额呈现，广告占比双列）+ KPI 条（目标额/实际额/达成/毛利差额/时间进度）+ CSV 导出。
- 匹配口径：人员按「负责人 = Listing负责人」精确匹配；产品按「父ASIN」连接（规划新品无 ASIN → 仅目标侧）；两侧不匹配分别标记「未规划」「仅目标」。明细广告费取绝对值后对比；币种默认同为 RMB（领星口径），已写入口径说明弹窗。
- 规划批次：IndexedDB 升级 v1→v2 新增 plans/planBatches 两仓（增量升级，既有本地数据不受影响）；同年度可多版本并存，对比按批次选择；批次管理页新增规划批次区；备份/恢复/清空全库同步扩容（旧备份文件可无损恢复）。
- 导入健壮性：表头模糊识别（年份前缀"2026销量"自动归一）、月份多格式解析、同键多行解析期合并求和、校验报告；内置示例规划与示例明细人/ASIN 对应，空库两键即可看到完整演示。
- 验证：Node 回归 16 项断言全绿，含用真实附件《年度规划.xlsx》跑通解析（5 行/2026/5 位负责人/广告费绝对值/新品无 ASIN 路径）；整页内联脚本语法校验通过；命名审计两道检查通过。
