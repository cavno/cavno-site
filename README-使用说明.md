# Cavno 文章复制与下载功能增量包

本增量为站内文章统一增加右上角操作区：

- 一键复制 Markdown；
- 下载 UTF-8 Markdown；
- 下载排版后的 A4 PDF；
- 下载兼容 Microsoft Word 的 DOCX；
- 自动识别文章路由，不在栏目页、首页或搜索页显示；
- 桌面端和移动端共用同一套无横向溢出的交互。

## 应用方法

在 PowerShell 中进入本增量包目录后执行：

```powershell
.\Apply-Update.ps1 -Target "C:\path\to\cavno-site"
```

脚本只覆盖清单中的增量文件；被覆盖的旧文件会先保存到目标站点的 `_increment-backups` 目录。

然后进入网站源码目录执行：

```powershell
npm install
npm run build
npm run documents:generate
npm run documents:audit
npm run build
```

最后一次构建不可省略：它会把刚生成的下载文件写入最终 `dist` 成品目录。

## 发布注意

压缩包不包含所有文章生成出的 PDF、DOCX 和 Markdown，避免增量包体积膨胀。`npm run documents:generate` 会按照当前站点的真实文章清单批量生成这些文件。

完整设计说明、格式约定、单篇生成方法和发布检查项见：

`payload/docs/ARTICLE-DOWNLOADS.md`

