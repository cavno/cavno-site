# Cavno 增量更新：Linode 与 Ubuntu 24.04 禁用 IPv6 指南

## 本包包含什么

这是一个**增量包**，不是整站源码，只新增 4 个网站源文件：

- 新文章路由：`/life/ai/linode-ubuntu-disable-ipv6-keep-ssh-ipv4/`
- AI 栏目卡片与搜索元数据
- 完整文章正文和交互
- 文章专属响应式样式

附件中的 186 行 Markdown 已转换为站内原生 HTML；七个主步骤、八个子步骤、十三个命令/配置块和两张规则表均保留。页面不使用 iframe，也不依赖外部 CSS 或 JavaScript。

## 最稳妥的安装方法

1. 解压 ZIP，进入 `cavno-linode-ubuntu-disable-ipv6-guide-increment` 文件夹。
2. 找到 Cavno 最新源码根目录。该目录里应同时存在 `package.json` 和 `src` 文件夹。
3. 在增量包文件夹空白处按住 Shift 并单击鼠标右键，选择“在终端中打开”。
4. 执行下面两行命令，把示例路径替换成你的 Cavno 源码根目录：

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\Apply-Update.ps1 -SiteRoot "D:\你的目录\cavno-site"
```

安装器会先核对 4 个文件的大小和 SHA-256，再检查目标路径。若发现同名但内容不同的文件，会直接停止，避免覆盖你的修改。

## 构建和本地检查

进入 Cavno 源码根目录后运行：

```powershell
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

浏览器打开新页面：

```text
http://127.0.0.1:4321/life/ai/linode-ubuntu-disable-ipv6-keep-ssh-ipv4/
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
D:\你的目录\cavno-site\.cavno-update-backups\linode-ubuntu-disable-ipv6-guide-日期-编号
```

需要撤销时，在增量包目录执行：

```powershell
.\Restore-Update.ps1 `
  -SiteRoot "D:\你的目录\cavno-site" `
  -BackupRoot "上一步输出的 Recovery record 完整路径"
```

恢复脚本只处理本包登记的 4 个文件。如果安装后你又修改了其中任何文件，恢复会停止并提示，避免误删后续工作。

## 验证范围

- 已完成 Astro 整站构建，共生成 208 个页面。
- 已确认新路由、AI 栏目卡片和站内搜索索引均生成。
- 已完成桌面端 1440 × 1000 与移动端 390 × 844 的浏览器检查。
- 已检查固定导航、文章目录、移动端目录展开/关闭、响应式表格和整页横向溢出。
- 已完成附件正文的标准化可见文字逐字序列核对。
- 本包没有部署到线上；合并、构建和发布仍需在你的正式源码与发布环境中执行。
