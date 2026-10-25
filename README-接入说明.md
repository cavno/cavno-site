# 深圳龙岗11盘置业与学位决策系统 · 增量接入

本包基于此前提供的 Cavno Astro 源码，只包含 7 个新增文件及本说明，不含全站源码。

## 接入方法

1. 将压缩包中的 `src`、`public` 文件夹合并到网站项目根目录，保持目录层级。
2. 在网站项目根目录运行 `npm run build`，再按原有流程部署。
3. 新页面地址：`/life/house/longgang-home-school-decision/`。
4. `/life/house/` 房产栏目、Life 页面和全站搜索通过新增内容条目自动收录，不需修改原栏目页或导航。

你的消息里显示的目标是 `/life/house/`，链接实际指向 `/investing/research/`；本次按文字所指的房产栏目接入。

## 新增文件

- `src/pages/life/house/longgang-home-school-decision.astro`
- `src/legacy/life/house/longgang-home-school-decision/body.html`
- `src/legacy/life/house/longgang-home-school-decision/style.css`
- `src/content/items/life-house-longgang-home-school-decision.md`
- `public/apps/life/house/longgang-home-school-decision/app.js`
- `public/apps/life/house/longgang-home-school-decision/chart.umd.min.js`
- `public/apps/life/house/longgang-home-school-decision/LICENSE-chart.js.txt`

页面复用 `Base.astro`，沿用全站导航、页脚、搜索、字体、米白底和珊瑚色。工具样式预编译并限定作用域，不依赖 Tailwind CDN；Chart.js 4.4.1 与附件版本相同，已放在本地资源中并保留 MIT 许可。不需要修改 package.json 或安装新运行依赖。

## 保留内容与功能

- 完整保留附件 11 个楼盘、31 组户型数据库及静态文字；价格、学区、评分数据没有重新生成。
- 保留四项权重、原归一化评分规则、总价区间与预算上限筛选、楼盘/楼栋联动、户型/朝向/临街筛选、TOP 4 推荐、最多 5 项的 PK 台与默认恢复。
- 保留学校图表数据与原始计算规则，统一图表配色、标签换行和文字样式；表格在窄屏内可横向滚动。
- 增加表单标签关联、工具区锚点与图表可访问名称；事件与样式隔离在本工具内。

独立 HTML 预览可直接双击使用，已内嵌必要样式、Chart.js 和交互脚本；该预览中的搜索仅检索本次工具，栏目和其他站点链接指向 cavno.org。正式页面使用全站搜索。

本次交付为增量代码，尚未发布到线上。
