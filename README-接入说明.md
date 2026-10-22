# 《ITIN的作用与底层原理》增量接入说明

本包只含 4 个新增源码文件，适用于此前提供的 Cavno Astro 源码。

## 接入

1. 将压缩包中的 src 文件夹合并到网站项目根目录，保持目录结构。
2. 在项目根目录运行 `npm run build`，再沿用现有流程发布。
3. 新文章路径：`/investing/research/itin-functions-and-underlying-principles/`。
4. `/investing/research/` 栏目、Investing 页面和全站搜索会依据新增内容条目自动收录，无需修改现有栏目页、导航或搜索代码。

## 文件用途

- `src/pages/investing/research/itin-functions-and-underlying-principles.astro`：文章路由，复用站点 Base 布局、导航、页脚与搜索。
- `src/legacy/investing/research/itin-functions-and-underlying-principles/body.html`：原文 HTML，保留原始提问、正文、4 个主要章节、6 个小节、1 张表格、21 处引用标记与其 22 个原始来源链接。
- `src/legacy/investing/research/itin-functions-and-underlying-principles/style.css`：仅作用于本篇文章的样式，使用原站字体、配色和布局变量；手机端表格可横向滚动。
- `src/content/items/investing-research-itin-functions-and-underlying-principles.md`：Research 栏目及搜索索引条目。摘要摘自原文，日期采用分享页显示的发布时间 2026-10-22。

## 内容与预览

原始分享：https://share.gemini.google/A4KkFqs1eKup

保留原文措辞、顺序、加粗与列表层级，仅做 HTML 语义化和排版；不新增分析或结论。原文 21 处引用已逐一读取其来源弹层并保留实际链接，其中“+ 1”仍可点击查看第二来源。

交付中的独立 HTML 可直接双击查看，已内嵌样式和必要脚本；它的搜索仅用于本次文章预览，栏目及其他站点链接指向 cavno.org。正式网站会复用全站搜索。本包不增加运行依赖。

已完成 Astro 构建、正文文本比对、栏目收录、搜索、目录锚点及手机排版检查。尚未发布到线上。
