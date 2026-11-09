# Socks5 技术卷宗 · Cavno 技能栏目增量接入

本包仅包含本次页面的 5 个新增文件及本说明，不包含全站源码，不覆盖其他文章。

## 接入方法

1. 将压缩包中的 `src`、`public` 合并到现有 Cavno 项目根目录，保持目录层级。
2. 运行 `npm run build`。
3. 使用网站原有部署流程发布构建结果。
4. 新页面：`/life/skills/socks5-residential-proxy/`。
5. `/life/skills/` 技能栏目、生活总栏目及全站搜索通过内容集合自动收录，无需修改栏目公共模板。

## 文件清单

- `src/pages/life/skills/socks5-residential-proxy.astro`
- `src/legacy/life/skills/socks5-residential-proxy/body.html`
- `src/legacy/life/skills/socks5-residential-proxy/style.css`
- `src/content/items/life-skills-socks5-residential-proxy.md`
- `public/apps/life/skills/socks5-residential-proxy/app.js`

## 内容处理范围

来源为 `C:\Users\chowm\Desktop\socks5.html`。保留附件正文、章节顺序、三类流派、自卫对照表、5 段静态代码示例，以及 3 类流派 × 4 步的全部沙盘数据、参数和检测命令。没有新增技术论述、改写判断或补充外部事实。

静态正文逐字比对通过（忽略 HTML 排版空白）；所有 pre 代码内容比对通过；沙盘模型及 12 条检测命令与附件数据完全一致。文内断言、比例和技术说法沿用附件，本次只做内容接入，没有另行事实核验。

## 样式与交互

使用现有 `Base.astro`，复用网站导航、搜索、字体及页脚。页面改为 Cavno 米白底、珊瑚色和绿色，减少羊皮纸纹理，保留原章节层次、代码块及 SVG 图示结构。

保留代码复制、流派切换、四步跳转、上一步/下一步循环、SVG 节点点击、买家透视镜及打印入口。复制采用浏览器剪贴板 API 和兼容回退，失败时按原有提示引导手动复制，不误报成功。图示节点支持 Enter/空格键。

本页脚本封装在局部作用域中，DOM 查询和事件限定在 `#socks5-app`。Tailwind 样式已预编译，不依赖 Tailwind CDN，不新增 npm 依赖，不修改全站公共文件。手机上使用局部横向滚动展示宽图、表格和代码，避免挤压文字。

页面中的命令保持原文展示和复制用途，交互沙盘在浏览器本地切换预置内容。

## 交付与验证

已通过 Astro 构建；目录和搜索索引均仅包含一条本页入口；已核对 12 步详情联动、前后循环、透视镜、SVG 键盘操作及代码复制，并检查桌面、390px 手机和 320px 窄屏布局。

另附 `Socks5技术卷宗_Cavno预览.html` 独立预览，内嵌所需样式、脚本和沙盘数据，可直接打开。预览的搜索仅检索本页，其他栏目链接指向 cavno.org；正式接入版使用全站搜索。字体不可用时回落到本机字体。

本次只交付本地增量代码，尚未部署线上。
