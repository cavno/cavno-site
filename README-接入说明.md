# 深圳20盘二胎置业与产权排雷决策系统 · 替换增量代码

本包针对 Cavno 现有 Astro 源码，仅包含本页的 7 个替换文件及本说明，不含全站源码。

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
- `public/apps/life/house/longgang-home-school-decision/chart.umd.min.js`
- `public/apps/life/house/longgang-home-school-decision/LICENSE-chart.js.txt`

## 内容与样式

- 保留本次 gemini-code-1793116633138.html 的 20 个小区宏观数据库、24 组楼栋户号数据、9 个学区指标库及原始文案。保留回迁/保障房排雷百科、分期隔离说明、城中村距离及本栋核验字段、四大片区看板、学区双指标图与13组历史回撤图表数据；未重新生成价格、学区指标或评分。
- 保留宏观八项筛选、楼盘下钻联动、户号十二维筛选、预算上限、六维权重、TOP 4 推荐和最多 5 项 PK 对比。TOP 4 沿用附件规则，联动预算/价格区间、通勤条件、学校录取率、产权与城中村条件，默认排除主干道房源；不强制跟随全部户号筛选项。
- 修正带图标地铁距离字段的显示，保留原始距离，避免只显示“约”字。三个数据库与加权公式、筛选判断、学区排序及PK规则保持一致。
- 复用 `Base.astro` 的导航、页脚、搜索、米白底、珊瑚色和字体。页面样式和按钮事件限定在工具内，宽表格局部滚动，手机端筛选与卡片自动换行。
- 不需要修改 `package.json` 或安装新运行依赖。Tailwind 样式已预编译并限定在本工具内；Chart.js 4.4.1 及 MIT 许可证随增量包本地提供，沿用附件版本。图表字体和配色与 Cavno 一致，不再使用外部脚本 CDN。
- 交互脚本 URL 带内容哈希，更新后避免复用旧版缓存。

## 检查

完成静态文字、三个数据库、图表数值及计算规则一致性检查、Astro 构建，以及两张图表、学区表、宏观筛选、下钻联动、户号与学校录取率筛选、六维权重与 PK 的浏览器检查；栏目和搜索使用同一条记录。

独立 HTML 预览内嵌样式和交互脚本，可直接打开；其搜索仅检索本次页面，栏目等站点链接指向 cavno.org。正式接入版使用全站搜索。

本包为本地替换代码，尚未发布到线上。
