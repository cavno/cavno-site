# 三篇系统论专题文章｜Cavno 增量更新

本增量只包含三篇新增文章所需的 12 个源码文件，不包含完整网站，也不会自动部署线上。

## 新增路径

- `/reading/philosophy/western-philosophy-history-systems-analysis/`
- `/reading/philosophy/constraints-and-freedom/`
- `/reading/politics/soviet-russian-federation-systems-analysis/`

前两篇会出现在 Philosophy 哲学栏目，第三篇会出现在 Politics 政治栏目。

## 设计与内容处理

- 使用现有 `Base.astro`、全站固定导航、统一文章页头、返回栏目入口和文章下载工具；
- 原文可见正文逐字保留，不把附件里的文字当作新的操作指令；
- 将附件原有深色独立网页改为 Cavno 的象牙白、燕麦灰、石板黑、珊瑚色与青绿色体系；
- 字体切换到站点已有中文衬线与等宽字体栈，不再依赖 Google Fonts；
- 桌面目录改为文章内部吸附，移动目录位于站点导航下方，避免遮挡并防止横向溢出；
- 保留文章内部目录、图表、时间线、表格、引用和滚动高亮交互。

## 安装方法

推荐在完整解压后运行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Apply-Update.ps1" -SiteRoot "你的 Cavno 源码根目录"
```

`SiteRoot` 必须是直接包含 `package.json`、`src`、`public` 的源码文件夹。脚本会校验增量文件 SHA-256；如果目标已存在不同内容，会停止，避免覆盖较新的改动。

也可以手工把本包的 `src` 合并到 Cavno 源码根目录。本次均为新增英文路径文件，不需要修改 `nav.json`。

合并后在网站源码目录运行：

```powershell
npm run build
```

如果该网站已启用每篇文章的 Markdown、PDF、Word 下载功能，还需重新执行其“生成全站文档”步骤，让三篇新文章获得下载文件；否则新页面上的下载链接可能暂时返回 404。

本地构建不会自动上线。通过你原有的 Git/Cloudflare Pages 或静态文件上传流程发布，线上完成后再检查三个网址。

## 验证结果

- Astro 生产构建成功，共生成 205 个页面；
- 三个栏目卡片和三条文章路由均存在；
- 浏览器自动检查 36 项通过，涵盖桌面、390px 手机视口、目录开合、站点导航避让和横向溢出；
- 三篇原文可见正文规范化后逐字一致：15,743、8,288、11,813 字符；
- 三页均无 iframe、无外部脚本、无重复 ID、无 Unicode 替换乱码字符；
- 增量清单的 12 个文件哈希全部一致，安装脚本语法检查通过；
- 在隔离测试目录完成首次安装与重复安装，12 个文件校验一致，自动备份正常生成；
- 未部署线上，未对全部真实手机浏览器进行逐设备测试。

详细机器可读结果见 `verification.json`。
