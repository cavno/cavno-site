# 深圳15盘二胎置业双视角决策系统 · 替换增量代码

本包针对 Cavno 现有 Astro 源码，仅包含本页的 5 个替换文件及本说明，不含全站源码。

## 使用方法

1. 备份现有同名文件，将本包的 `src`、`public` 合并到项目根目录，按原路径覆盖。
2. 运行 `npm run build`，按原有网站流程部署。
3. 页面地址保持 `/life/house/longgang-home-school-decision/`，栏目仍为 `/life/house/`。
4. 同名内容条目更新栏目卡片与全站搜索，不另建条目，避免重复收录。

## 替换文件

- `src/pages/life/house/longgang-home-school-decision.astro`
- `src/legacy/life/house/longgang-home-school-decision/body.html`
- `src/legacy/life/house/longgang-home-school-decision/style.css`
- `src/content/items/life-house-longgang-home-school-decision.md`
- `public/apps/life/house/longgang-home-school-decision/app.js`

## 内容与样式

- 保留附件的 15 个小区宏观数据库、26 组楼栋户号数据、概念百科及原始文案；未重新生成价格、指标或评分。
- 保留宏观四项筛选、楼盘下钻联动、微观九维筛选、预算上限、五维权重、TOP 4 推荐和最多 5 项 PK 对比。
- 修正附件中带图标字段的截取问题，让车位比、梯户比与地铁距离完整显示原始指标；两个数据库及计算规则保持一致。
- 复用 `Base.astro` 的导航、页脚、搜索、米白底、珊瑚色和字体。页面样式和按钮事件限定在工具内，宽表格局部滚动，手机端筛选与卡片自动换行。
- 不需要修改 `package.json` 或安装新运行依赖。附件没有使用图表功能，正式页面不加载 Chart.js；旧版图表资源无需处理。
- 交互脚本 URL 带内容哈希，更新后避免复用旧版缓存。

## 检查

完成静态文字与两个数据库一致性检查、Astro 构建，以及宏观筛选、下钻联动、微观筛选、权重与 PK 的浏览器检查；栏目和搜索使用同一条记录。

独立 HTML 预览内嵌样式和交互脚本，可直接打开；其搜索仅检索本次页面，栏目等站点链接指向 cavno.org。正式接入版使用全站搜索。

本包为本地替换代码，尚未发布到线上。
