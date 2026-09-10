# 系统论发展的总体路线图｜增量更新

本增量将附件内容更新到现有英文路径：

`/reading/thinking/systems-theory-development-roadmap/`

## 更新内容

- 更新完整文章正文、图表、阶段导航与移动端目录交互；
- 沿用 Cavno 的 `Base.astro` 页面外壳、全站导航、颜色与字体体系；
- 文章样式限定在 `.systems-roadmap-v2` 内，避免影响站内其他页面；
- 更新 Thinking 目录卡片摘要、标签和上传时间；
- 文章继续使用原英文网址，不新增同名重复条目。

## 包含文件

- `src/content/items/reading-thinking-systems-theory-development-roadmap.md`
- `src/pages/reading/thinking/systems-theory-development-roadmap.astro`
- `src/legacy/reading/thinking/systems-theory-development-roadmap/body.html`
- `src/legacy/reading/thinking/systems-theory-development-roadmap/style.css`
- `verification.json`

## 更新方法

将本目录中的 `src` 文件夹合并到 Cavno 项目根目录并允许覆盖同名文件，然后在项目根目录运行：

```powershell
npm run build
```

生产构建已通过，共生成 202 个页面。专项检查共 27 项，全部通过；检查结果见 `verification.json`。
