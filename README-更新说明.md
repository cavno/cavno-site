# 《新手驾驶实战说明书》Cavno 增量更新

本包只包含一个新增页面所需的 4 个源码文件、一个安全安装脚本和验证资料，不包含整站源码，也不会自动发布到线上。

## 新增网址

`/life/driving/beginner-driving-practical-manual/`

原有 `/life/driving/beginner-driving-guide/` 不会被替换，两篇内容并存。

## 一键安装

1. 完整解压 ZIP，不能只在压缩包预览窗口里运行脚本。
2. 在解压后的文件夹空白处按住 Shift 并单击鼠标右键，选择“在此处打开 PowerShell”。
3. 运行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Apply-Update.ps1" -SiteRoot "你的 Cavno 源码根目录"
```

`SiteRoot` 是直接包含 `package.json` 和 `src` 的文件夹，不是 `dist`，也不是网站网址。

脚本会先完成全部预检再写入：

- 校验 4 个增量文件的 SHA-256 和字节数；
- 拒绝不安全路径；
- 如果同名新页面已存在但内容不同，立即停止，不覆盖；
- 对 `src/content/nav.json` 只替换 Driving 栏目的一句介绍，不整文件覆盖；
- 在 `.cavno-update-backups` 下保存本次涉及的原文件。

出现 `Update applied` 后，进入 Cavno 源码根目录运行：

```powershell
npm run build
```

构建成功后，按原有 Git、Cloudflare Pages 或静态文件上传方式发布。运行本脚本和本地构建都不会自动修改 cavno.org。

## 手工合并

如果不运行脚本，将本包 `src` 下的 4 个文件按原目录结构复制到 Cavno 源码根目录；然后在 `src/content/nav.json` 中把：

```json
"desc": "科目三 / 科目四备考实验台"
```

改成：

```json
"desc": "新手上路、驾驶实务、驾考训练与智能驾驶系统"
```

最后运行 `npm run build`。

## 文档下载功能

如果网站已经启用每篇文章的 Markdown、PDF、Word 下载功能，需要在合并后重新执行全站文档生成步骤，再发布生成的下载文件；否则新文章的下载菜单可能暂时返回 404。

## 已完成的验证

- Astro 生产构建成功，共生成 206 个页面；
- 新页面、驾驶栏目卡片和搜索索引条目均存在；
- 附件与站内正文的可见文字规范化后逐字一致，共 26,369 个字符；
- 桌面端与 390px 手机视口共 17 项浏览器检查通过；
- 无横向页面溢出、iframe、外部脚本、重复 ID 或 Unicode 替换乱码字符；
- 安装脚本已在隔离目录完成首次安装和重复安装测试；导航配置与同名文件备份均正常。

本次没有发布线上，也没有对全部真实手机型号逐台测试。
