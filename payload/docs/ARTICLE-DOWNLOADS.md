# 文章复制与多格式下载

## 设计原则

文章下载文件在发布前生成，浏览器只负责复制或下载已经校验过的静态文件。不要在点击按钮时把当前 DOM 临时改名为 `.docx`，也不要用 `window.print()` 冒充稳定的 PDF 下载；这两种做法无法稳定处理中文字体、分页、表格和复杂页面。

每篇文章先从构建后的网页抽取为同一个语义模型，再分别生成：

- Markdown：UTF-8（无 BOM）、LF 换行、ATX 标题、GFM 表格、fenced code block、标准链接与图片语法；
- PDF：A4、可检索文字、保留网页图表与底色、页码、PDF 书签/可访问性标签（浏览器支持时）；
- Word：真正的 OOXML `.docx`，不是 HTML 改后缀；标题样式、列表、表格、代码块、超链接、页脚页码和中西文字体槽分别设置。

大型 SVG 和 Canvas 会先生成 PNG 快照，供 Markdown 与 Word 使用；PDF 直接从完成渲染的页面打印，因此保留原网页中的矢量图、Canvas 和 CSS 视觉结构。按钮、表单、站点导航和文章内工具栏不会进入下载文档。

## 本地环境

安装项目依赖后，确保电脑上有 Microsoft Edge 或 Google Chrome。默认会自动寻找常见安装路径；其他位置可用参数指定：

```powershell
npm install
npm run build
npm run documents:generate -- --browser-path "D:\Apps\Chrome\chrome.exe"
```

## 生成和校验

生成全部文章：

```powershell
npm run build
npm run documents:generate
npm run documents:audit
npm run build
```

只更新一篇文章：

```powershell
npm run build
npm run documents:generate -- --route /reading/thinking/elementsofgeometry/
npm run documents:audit -- --route /reading/thinking/elementsofgeometry/
npm run build
```

文件与文章放在同一访问边界内，例如：

```text
/reading/thinking/elementsofgeometry/downloads/elementsofgeometry.md
/reading/thinking/elementsofgeometry/downloads/elementsofgeometry.pdf
/reading/thinking/elementsofgeometry/downloads/elementsofgeometry.docx
```

`/working/` 下文章的下载文件仍位于 `/working/` 下，因此继续受现有 Cloudflare Access 规则保护，不会因为统一下载目录而绕过鉴权。

生成程序同时写入 `public/` 与当前 `dist/`：前者供下一次构建和部署，后者供本地预览。每篇文章还会生成 `manifest.json`，记录源网址、生成时间、字节数和 SHA-256，便于审计文件是否被意外替换。

## 文章作者约定

- 纯装饰、交互按钮、筛选器或不应出现在文档中的节点添加 `data-export-ignore`。
- 关键图片必须设置准确的 `alt`；无法嵌入的图片会在 Word 中降级为 `[图片：说明]`，不会静默丢失。
- 代码使用 `<pre><code class="language-js">...</code></pre>` 等语义结构。
- 数据表使用真实 `<table>`，不要用一组绝对定位的 `<div>` 模拟表格。
- 文章主标题使用一个 `<h1>`，正文标题按 `<h2>`、`<h3>` 递进。
- 交互工具的表单状态不会作为文章正文导出；需要留存的结论应同时存在于可读的 HTML 文本中。

## 发布门槛

自动校验会拒绝以下结果：

- Markdown 不是合法 UTF-8、含替换字符 `�`、缺少一级标题或代码围栏不成对；
- PDF 缺少 PDF 文件签名或异常小；
- Word 不是有效 ZIP/OOXML、缺少正文或样式部件、正文中出现乱码替换字符；
- 任一文章缺少三种格式中的一种。

正式发布前还应抽查至少三类页面：普通长文、表格/代码密集页、SVG/Canvas 可视化页。检查 PDF 的分页与字体嵌入、Word 的标题/列表/表格/图片、Markdown 的围栏和表格，并在 Microsoft Word、Typora/Obsidian、Chrome/Edge PDF 阅读器中分别打开一次。
