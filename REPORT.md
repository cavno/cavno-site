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
