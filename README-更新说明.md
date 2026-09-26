# Cavno 增量更新：AdsPower 代理协议与 IPv4/IPv6 出口指南

## 本包包含什么

这是一个**增量包**，不是整站源码，只新增 4 个站点源文件：

- 新文章路由：`/life/ai/adspower-ssh-ipv4-ipv6-guide/`
- AI 栏目卡片元数据
- 完整文章正文与交互
- 文章专属响应式样式

文章内容来自用户指定的 ChatGPT 分享页；正文结构、命令、表格和来源链接均已转成站内原生 HTML，未使用 iframe，也不依赖外部 CSS 或 JavaScript。

## 最稳妥的安装方法

1. 解压 ZIP，进入 `cavno-adspower-ssh-ipv4-ipv6-guide-increment` 文件夹。
2. 找到 Cavno 最新源码的根目录。这个目录里必须同时能看到 `package.json` 和 `src` 文件夹。
3. 在增量包文件夹空白处按住 Shift 并单击鼠标右键，选择“在终端中打开”。
4. 执行下面两行命令，把示例路径替换成你的 Cavno 源码根目录：

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\Apply-Update.ps1 -SiteRoot "D:\你的目录\cavno-site"
```

安装器会先核对 4 个文件的大小和 SHA-256，再检查目标路径。如果发现同名但内容不同的文件，会直接停止，避免覆盖你的修改。

## 构建和本地检查

进入 Cavno 源码根目录后运行：

```powershell
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

浏览器打开：

```text
http://127.0.0.1:4321/life/ai/adspower-ssh-ipv4-ipv6-guide/
```

同时检查 AI 栏目页是否出现新卡片：

```text
http://127.0.0.1:4321/life/ai/
```

如果项目启用了文章 Markdown、PDF、Word 下载文件的预生成流程，再运行：

```powershell
npm run documents:generate
npm run documents:audit
```

## 如何恢复

安装完成后，终端会输出一个 `Recovery record` 路径，类似：

```text
D:\你的目录\cavno-site\.cavno-update-backups\adspower-ssh-ipv4-ipv6-guide-日期-编号
```

需要撤销时，在增量包目录执行：

```powershell
.\Restore-Update.ps1 `
  -SiteRoot "D:\你的目录\cavno-site" `
  -BackupRoot "上一步输出的 Recovery record 完整路径"
```

恢复脚本只处理本包登记的 4 个文件。如果安装后你又修改了其中任何文件，恢复会停止并提示，避免误删后续工作。

## 验证范围

- 已完成 Astro 整站构建。
- 已确认新路由、AI 栏目卡片和站内搜索索引均生成。
- 已完成桌面端 1440 × 1000 与移动端 390 × 844 的浏览器检查。
- 已检查固定导航、文章目录、无整页横向溢出、移动目录展开/关闭和响应式宽表格。
- 已核对 19 个主章节、84 个代码/链路示意块、2 张表格与 7 个来源链接。
- 本包没有部署到线上；合并、构建和发布仍需在你的正式源码与发布环境中执行。
