# 山海策 · 双娃周末自驾决策系统 · 增量接入

本包基于已提供的 Cavno Astro 源码，仅含本页 5 个新增文件及本说明，不含全站源码。

## 接入方法

1. 将 `src`、`public` 文件夹合并到网站项目根目录，保持目录层级。
2. 在项目根目录运行 `npm run build`，按原有流程部署。
3. 新页面地址：`/life/places/shenzhen-family-weekend-outing/`。
4. 内容条目会自动加入 `/life/places/` 地点栏目、Life 页面与全站搜索，无需手动修改栏目或公共导航。

## 新增文件

- `src/pages/life/places/shenzhen-family-weekend-outing.astro`
- `src/legacy/life/places/shenzhen-family-weekend-outing/body.html`
- `src/legacy/life/places/shenzhen-family-weekend-outing/style.css`
- `src/content/items/life-places-shenzhen-family-weekend-outing.md`
- `public/apps/life/places/shenzhen-family-weekend-outing/app.js`

## 内容和功能

- 保留附件的 8 条路线、路线指标、三天两晚分时路书、晴天与阴雨预案、28 项装备数据和原文；未重新生成路线或预算规则。
- 保留两种出发模式、片区/场所组合/车程/预算/标签筛选、四种排序、酒店/餐饮/门票预算沙盘、六维 SVG 雷达图、最多 3 条路线 PK 和清单进度保存。
- 复用 `Base.astro` 的导航、页脚、搜索与字体，沿用米白底、珊瑚色和克制的绿色。工具样式和交互事件限定在本页。
- Tailwind 已预编译，不需要新增依赖或 CDN 脚本；雷达与路线图使用附件原有 SVG。
- 弹窗增加名称、键盘焦点约束和 Esc 关闭；弹窗层级兼容全站固定导航，手机端宽表格在局部横向滚动。
- 装备勾选保存在当前浏览器的本地存储中，沿用附件的存储键；不需要服务器。

独立 HTML 预览内嵌必要样式与脚本，可直接打开；预览搜索仅检索本次工具，其他栏目链接指向 cavno.org。正式页面使用全站搜索。预览文件无需上传到 Astro 源码中。

完成原文和两个数据集一致性核对、Astro 构建、主要交互及手机布局检查。本次交付是本地增量代码，尚未发布到线上。
