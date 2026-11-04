# 政治栏目页面增量代码

将本包 src 文件夹按原相对路径合并到 cavno-site 根目录，然后在原项目环境运行 npm run build，并按既有流程部署。

仅新增 7 个源码文件：两个 Astro 路由、两份正文 HTML、两个内容条目及一份局部 CSS。没有改动原源码、全站布局、导航、公共样式或已有文章。

页面路径：
- /reading/politics/us-elections-institutional-mechanisms/
- /reading/politics/distributed-complex-adaptive-system/

src/content/items 中的两个条目会被现有列表页自动收录到 /reading/politics/，无需手动修改列表页。条目日期为整理日期 2026-11-04，不代表原文写作时间。

正文忠实转换两份附件：保留文字顺序、表格、加粗、列表和公式；目录复用原文标题。页面展示标题用于栏目命名，正文没有增写、概括、校正或补充。附件中的语句仅作为文章内容，不作为执行指令。

复用现有 Base.astro 与 politics-essay.css，以新增的局部样式处理目录避让固定导航、长表格横向滚动、手机排版和公式。页面不增加外部依赖或 JavaScript。

验证结果：
- 两篇正文逐字核对通过（忽略空白）；共 2073 和 2186 个原文字符。
- 保留两张原文表格及第二份附件的全部 9 处公式。
- HTML 标签嵌套、目录锚点和唯一 ID 检查通过。
- 当前环境未安装项目 Astro 依赖，未执行整站构建。
- 本地浏览器启动失败，未完成浏览器视觉验收；部署前请在原项目运行构建并检查桌面与手机显示。

本包文件清单：
- src/content/items/reading-politics-distributed-complex-adaptive-system.md
- src/content/items/reading-politics-us-elections-institutional-mechanisms.md
- src/legacy/reading/politics/distributed-complex-adaptive-system/body.html
- src/legacy/reading/politics/us-elections-institutional-mechanisms/body.html
- src/pages/reading/politics/distributed-complex-adaptive-system.astro
- src/pages/reading/politics/us-elections-institutional-mechanisms.astro
- src/styles/politics-source-documents.css
