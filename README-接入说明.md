# 在裂隙中安居 · Cavno 哲学栏目增量接入

仅含本页 5 个新增文件及本说明，不包含修改后的全站源码。原附件为桌面 `code_artifact.html`，本页新增于哲学栏目，不替换其他文章。

## 接入

1. 将压缩包中的 `src` 和 `public` 文件夹合并到网站项目根目录，保持目录层级。
2. 在原网站项目运行 `npm run build`。
3. 按网站原来的方式部署构建结果。
4. 新页面地址：`/reading/philosophy/dwelling-in-the-crevice/`。
5. 哲学栏目 `/reading/philosophy/`、阅读总栏目和全站搜索通过内容集合自动收录，无需手工修改栏目模板。

## 文件清单

- `src/pages/reading/philosophy/dwelling-in-the-crevice.astro`
- `src/legacy/reading/philosophy/dwelling-in-the-crevice/body.html`
- `src/legacy/reading/philosophy/dwelling-in-the-crevice/style.css`
- `src/content/items/reading-philosophy-dwelling-in-the-crevice.md`
- `public/apps/reading/philosophy/dwelling-in-the-crevice/app.js`

## 内容与交互

原文、章节顺序和原有解释保留，未补写哲学论证或新增外部事实。保留 5 个存在论节点、7 个思想史时期、3 个悲剧历史范式、4 大悲剧原型、4 个复合案例、6 组虚无概念辨析、7 种当代虚无表现、5 层自由、12 条救赎路径及 5 种典型处境。原始数据的文字及数值已逐项比对一致。

保留裂隙灯火/西西弗斯画布、螺旋上升/单向坠落、现实冲击模拟、概念和案例切换、荒诞模拟双滑块、五种伪自由雷达测评及重置、救赎路径分类、自由地图预设/输入/分类/移除/复制。

自由地图仅在当前页面内存中编辑，刷新会回到附件默认内容；复制行动卡可保存自己的编辑结果。兼容剪贴板限制，失败时提供手动复制文本框，不再误报成功。用户输入按纯文本显示。

## 样式适配

使用网站现有 `Base.astro`，复用 Cavno 导航、搜索、页脚和字体。统一米白底、珊瑚色和绿色，保留原有分区和图表。Tailwind 工具样式已预编译，仅作用于本页，不加载 Tailwind CDN，不新增 npm 依赖，不修改全站公共样式。

手机上为单列布局，表格局部横向滚动；页内导航避开全站顶栏。按钮、滑块和 SVG 节点补充键盘及可访问性支持。

## 验证与交付

- 原文静态文字及 11 组交互数据的文字、数值一致性核对通过（配色除外）。
- Astro 构建通过，哲学目录和搜索索引均仅生成一条本页入口。
- 已检查桌面与手机布局、主要模块切换、滑块联动和重置、路径筛选、自由地图添加/移除/复制。
- 另附独立 HTML 预览，内嵌页面样式、脚本及数据，可直接打开。其搜索仅检索本页，其他栏目链接指向 cavno.org；正式接入版使用全站搜索。

本次只交付本地增量代码，尚未部署线上。
