# 深圳全区自然人文图谱与环深周末自驾工作台 · 替换增量代码

本包用于替换原有同网址页面，仅包含本页的 5 个替换文件及本说明，不含全站源码。

## 接入方法

1. 先备份原有同名文件，将本包的 `src`、`public` 合并到项目根目录，保持层级并覆盖同名路径。
2. 运行 `npm run build`，按原有流程部署。
3. 页面地址保持 `/life/places/shenzhen-family-weekend-outing/`，栏目仍为 `/life/places/`。
4. 覆盖同名内容条目，自动更新地点栏目、Life 页面和全站搜索；不要再另建一个栏目条目。

## 替换文件

- `src/pages/life/places/shenzhen-family-weekend-outing.astro`
- `src/legacy/life/places/shenzhen-family-weekend-outing/body.html`
- `src/legacy/life/places/shenzhen-family-weekend-outing/style.css`
- `src/content/items/life-places-shenzhen-family-weekend-outing.md`
- `public/apps/life/places/shenzhen-family-weekend-outing/app.js`

## 本版内容与功能

- 保留附件五个原始数据集：行政区元数据、32 个本地点位、6 条本地周末打包线、6 条跨城微度假线、15 项装备核对单。
- 保留四视图切换、双出发模式、行政区与片区联动、景观形态/车程/双娃需求联合筛选、点位搜索及四种排序。
- 本地点位筛选按附件作用于本地图谱；打包线和跨城视图按原规则展示。预算沙盘联动本地打包线和跨城线，保留原住宿、餐饮、交通与过路费计算规则。
- 保留周六/周日自由拼装、同一天内点位去重、移除/清空、专属周末路书及预约提醒；保留各类详情、六维 SVG 雷达图、分时作息与天气 B 计划。
- 装备勾选使用附件的浏览器本地存储键 `sz_dual_kid_gear`。本地存储不可用或保存值损坏时，页面仍可正常打开和操作；持久保存取决于浏览器支持。

## Cavno 适配

复用 `Base.astro` 的全站导航、页脚、搜索和字体，统一米白底、珊瑚色及克制的绿色。附件样式全部限定在本工具内，没有新增运行依赖或外部脚本。侧栏、卡片、视图导航和悬浮拼装篮适配手机；详情弹窗覆盖全站导航，并支持 Esc 关闭和键盘焦点循环。交互脚本带内容哈希参数，避免替换后继续使用旧脚本缓存。

完成原始文案与五个数据集一致性核对、Astro 构建、主要交互与手机布局检查。独立 HTML 预览内嵌必要样式与脚本；其搜索只检索本页，其余栏目链接指向 cavno.org。正式接入版使用全站搜索，预览 HTML 无需放入项目源码。

本次仅交付替换增量代码，尚未发布到线上。
