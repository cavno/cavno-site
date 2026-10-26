# 演化生成链：从物理约束到反身自由 · 增量接入

本包基于此前提供的 Cavno Astro 源码，只包含本页 6 个新增文件和本说明，不含全站源码。

## 接入

1. 将压缩包中的 `src`、`public` 文件夹合并到网站项目根目录，保持层级。
2. 运行 `npm run build`，按原有网站流程部署。
3. 新页面地址：`/reading/thinking/evolution-generative-chain/`。
4. 内容条目会自动加入 `/reading/thinking/`、Reading 页面和全站搜索，不需要修改公共导航或栏目模板。

## 新增文件

- `src/pages/reading/thinking/evolution-generative-chain.astro`
- `src/legacy/reading/thinking/evolution-generative-chain/body.html`
- `src/legacy/reading/thinking/evolution-generative-chain/style.css`
- `src/content/items/reading-thinking-evolution-generative-chain.md`
- `public/apps/reading/thinking/evolution-generative-chain/app.js`
- `public/apps/reading/thinking/evolution-generative-chain/standalone.html`

## 内容与交互

- 保留九环生成链、Ω 组成、四种理论检验方案、物质演化 11 阶段、五类约束悖论实体、五种自由伪装及五项反思问题的原始数据。
- 保留附件内嵌的 4 份完整原文，合计 515 个段落/表格块；不重新撰写原文或理论说明。
- 保留阶段选择、前进/后退、自动播放、螺旋拓扑、三项参数滑块、扰动与重置、P/S 对照、批判准则高亮、社会哲学反思及精读库检索跳转。
- 三个 Canvas 沿用附件的动画与计算规则，窄屏在图示区域内横向滑动查看，避免标注挤压。动画区域保持深色背景以确保粒子、连线和标注可读；外围页面复用 Cavno 的字体、导航、页脚、搜索、米白底和珊瑚色。
- 默认使用 Cavno 浅色；深浅切换仅作用于本页工具区，不改变全站页面。CSS 与 DOM 事件均限定在本页，Tailwind 已预编译，无需安装新运行依赖或加载 Tailwind CDN。

## 本页源码与独立预览

附件的源码查看/复制/下载功能保留，名称调整为“本页 HTML 源码”，指本页可独立运行的 HTML，不是 Cavno 全站源码。`standalone.html` 是此功能需要的资源，请一并上传。

另附同内容的独立 HTML 预览，内嵌所需样式、交互脚本、理论数据及四份原文，可直接打开。预览的搜索仅检索本页，其余栏目链接指向 cavno.org；正式接入版使用全站搜索。

完成原文数据一致性、构建、主要交互和手机布局检查。本次交付为本地增量代码，尚未发布到线上。
