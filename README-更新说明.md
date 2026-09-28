# Cavno 增量更新：Linode 与 Ubuntu 24.04 IPv4-only 完整实施指南

## 本包做什么

本增量包用两份附件合并后的完整内容，替换原页面：

```text
/life/ai/linode-ubuntu-disable-ipv6-keep-ssh-ipv4/
```

网址不变，不会生成重复文章。页面标题、卡片摘要、正文和搜索索引会更新为完整版本。

合并后的内容覆盖：

- Linode Cloud Firewall 的 IPv4 SSH 入站和 IPv6 出站阻断；
- 双 FinalShell/SSH 会话与 Lish Console 安全绳；
- 修改前配置备份；
- `sysctl` 的全局、回环与 `eth0` IPv6 禁用；
- `systemd-networkd` 的 RA 与链路本地地址限制；
- IPv4/IPv6 出口、代理浏览器和 WebRTC 验收；
- Network Helper 的关闭时机；
- 重启后复验和完整回滚。

原附件中的“VPS B”已统一改为“VPS”，页面中不再保留方案字母。

## 安装方法

1. 解压 ZIP，进入 `cavno-linode-ubuntu-ipv4-only-complete-guide-increment` 文件夹。
2. 找到 Cavno 最新源码根目录。该目录里应同时存在 `package.json` 和 `src` 文件夹。
3. 在增量包文件夹空白处按住 Shift 并单击鼠标右键，选择“在终端中打开”。
4. 执行下面两行，把路径替换成你的 Cavno 源码根目录：

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\Apply-Update.ps1 -SiteRoot "D:\你的目录\cavno-site"
```

安装器支持三种情况：

- 站点尚无该页面：直接新增；
- 站点是上一版不完整页面：验证上一版哈希后安全替换；
- 已经安装本版：允许重复执行。

如果同名文件既不是上一版，也不是本版，安装器会停止，不覆盖你的其他修改。

## 构建与本地检查

进入 Cavno 源码根目录后运行：

```powershell
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

打开：

```text
http://127.0.0.1:4321/life/ai/linode-ubuntu-disable-ipv6-keep-ssh-ipv4/
http://127.0.0.1:4321/life/ai/
```

如果项目启用了文章 Markdown、PDF、Word 下载文件的预生成流程，再运行：

```powershell
npm run documents:generate
npm run documents:audit
```

## 如何恢复上一版

安装完成后终端会输出 `Recovery record` 路径，例如：

```text
D:\你的目录\cavno-site\.cavno-update-backups\linode-ubuntu-ipv4-only-complete-guide-日期-编号
```

需要撤销时，在增量包目录执行：

```powershell
.\Restore-Update.ps1 `
  -SiteRoot "D:\你的目录\cavno-site" `
  -BackupRoot "上一步输出的 Recovery record 完整路径"
```

如果是从上一版升级，恢复脚本会还原上一版4个文件；如果是全新安装，则会移除本包新增的4个文件。安装后若文件又被修改，恢复会停止，避免覆盖后续工作。

## 验证范围

- Astro 整站构建成功，共生成208个页面，最终构建无内容集合警告。
- 新路由、AI栏目卡片和搜索索引均已生成。
- 合并后的正文共390行，标准化可见文字逐字序列核对一致。
- 页面包含12个主步骤、10个子步骤、20个命令/配置块和3张表格。
- 桌面端1440×1000和移动端390×844的18项浏览器检查通过。
- 已检查页面中“VPS B”残留为0。
- 本包没有执行附件中的服务器命令，也没有部署到线上。
