# 企业经营管理学页面增量更新

新增地址：`/reading/thinking/business-management-systems-evolution/`

将压缩包内的 `src` 目录合并覆盖到网站源码根目录，然后按现有方式重新构建并部署。压缩包只包含本次新增的四个源码文件，不包含整站源码。

## 文件清单

1. `src/pages/reading/thinking/business-management-systems-evolution.astro`：站内页面入口与统一导航外壳。
2. `src/legacy/reading/thinking/business-management-systems-evolution/body.html`：附件原始正文与图表结构。
3. `src/legacy/reading/thinking/business-management-systems-evolution/style.css`：站内化视觉样式、吸顶目录及移动端适配。
4. `src/content/items/reading-thinking-business-management-systems-evolution.md`：栏目卡片、更新时间与搜索元数据。

## 页面处理

- 完整保留附件的 16 个章节、4 个表格、2 张 SVG 系统图、公式与结论。
- 采用 Reading & Thinking 的字体、象牙白底色、墨黑正文和绿色系统色；总论区使用深色 Hero。
- 桌面端使用左侧吸顶目录；目录位置避开全站固定导航。
- 平板改为双列目录，手机改为单列；宽表格和系统图只在各自容器内横向滚动。
- 页面自动出现在 `/reading/thinking/` 的卡片/列表视图，并进入全站搜索与最新更新排序。

## 验证结果

Astro 静态构建成功，共生成 163 个页面。附件正文与站内正文逐字节一致；新页面 16 个目录锚点均有效；栏目列表和全站搜索均包含新页面。验证未包含真实手机实机或浏览器截图检查。
