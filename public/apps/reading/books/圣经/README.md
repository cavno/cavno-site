# 圣经互动浏览器 · Biblical Atlas

> 一个交互式的圣经浏览工具——以五个维度（结构、时间线、故事、人物、主题）系统地呈现旧约与新约 66 卷书的内容与神学意义。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vanilla JS](https://img.shields.io/badge/JS-Vanilla-f7df1e.svg)](#)
[![No Build](https://img.shields.io/badge/build-none-success.svg)](#)

## 概述
访问：https://cavno.github.io/bible-explorer/

本项目是一个完全静态的网页应用——纯 HTML + CSS + JavaScript，无任何构建步骤、无后端依赖。可直接打开 `index.html` 在本地浏览，也可一键部署到 GitHub Pages。

设计理念：**学术编辑感** + **典雅衬线字体** + **温暖的羊皮纸色调**——避免常见的"AI 模板感"。支持深浅主题切换。

## 五大模块

| 模块 | 内容 |
|---|---|
| **Ⅰ 概览** | 旧约 39 卷 + 新约 27 卷，按传统五大类划分；点击任一书卷查看详细介绍 |
| **Ⅱ 时间线** | 7 个历史时期，从原初到基督事工，约 22 个关键事件 |
| **Ⅲ 故事** | 21 个核心叙事——从伊甸园到大马色路上 |
| **Ⅳ 人物** | 27 位关键人物，按时代分组——从亚当到保罗 |
| **Ⅴ 主题** | 8 个贯穿圣经的核心神学主题——约、救赎、弥赛亚、神的国、圣洁、信心、恩典、创造 |

每个条目都内置详细介绍，可在右侧抽屉中查看。

## 部署到 GitHub Pages

### 三步即可上线

1. **创建 GitHub 仓库**——例如命名为 `bible-explorer`
2. **上传所有文件**到该仓库（保留目录结构）
3. **启用 GitHub Pages**：
   - 进入仓库的 `Settings` → `Pages`
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `main`（或 `master`）, 文件夹选 `/ (root)`
   - 点击 `Save`
   - 几分钟后，访问 `https://<你的用户名>.github.io/bible-explorer/`

### 命令行操作示例

```bash
# 假设已下载并解压到本地
cd bible-explorer

# 初始化 Git 仓库
git init
git add .
git commit -m "初始提交：圣经互动浏览器"

# 关联远程仓库（替换为自己的）
git remote add origin https://github.com/<你的用户名>/bible-explorer.git
git branch -M main
git push -u origin main
```

然后按上述步骤启用 GitHub Pages 即可。

## 本地预览

### 方法一：直接打开

双击 `index.html`——大多数现代浏览器可直接打开。

### 方法二：本地服务器（推荐）

部分浏览器对 `file://` 协议下的字体加载有限制。运行本地服务器更稳妥：

```bash
# Python 3
python3 -m http.server 8000

# 或 Node.js (需先安装 http-server)
npx http-server -p 8000
```

然后浏览器打开 `http://localhost:8000`

## 项目结构

```
bible-explorer/
├── index.html          # 网站骨架
├── styles.css          # 全部样式（含深浅模式）
├── script.js           # 渲染逻辑、抽屉、主题切换
├── data/
│   ├── books.js        # 66 卷书的数据
│   ├── timeline.js     # 时间线事件
│   ├── stories.js      # 核心故事
│   ├── figures.js      # 关键人物
│   └── themes.js       # 神学主题
├── README.md
├── LICENSE
└── .gitignore
```

## 技术栈

- **零依赖**——无 React、Vue、Tailwind、构建工具
- **纯 HTML5 / CSS3 / ES6+**——所有现代浏览器原生支持
- **Google Fonts**——通过 CDN 加载思源宋体（Noto Serif SC）、思源黑体（Noto Sans SC）、Cormorant Garamond、Crimson Pro
- **响应式设计**——桌面与移动设备都可流畅使用
- **支持深浅主题**——自动跟随系统偏好或手动切换（保存于 localStorage）

## 自定义与扩展

由于代码结构清晰，定制非常容易：

- **修改配色**：编辑 `styles.css` 顶部的 CSS 变量（`:root` 和 `[data-theme="dark"]`）
- **添加内容**：在对应的 `data/*.js` 文件中按现有格式添加条目即可——新条目会自动出现在界面上
- **修改字体**：替换 `index.html` 中的 Google Fonts 链接，并更新 `styles.css` 中的字体变量

## 设计理念

- **章节文字采用和合本（CUV）**——华人教会最广泛使用的中文译本
- **66 卷正典基于新教传统**——若需天主教或东正教的次经，可在 `books.js` 中扩展
- **不替代专业研经资源**——本工具是导览图，不是注释书

## 已知限制

- 内容是**编纂者自撰的简介**——目的是提供整体框架，而非详尽的学术研究
- 一些复杂的神学议题（如启示录的预言、约书亚记的"圣战"问题等）只能简要提及
- 历史年代有学界争议处，本工具采用相对主流的传统年代

## 贡献

欢迎以 Issue 或 Pull Request 形式提出改进建议——文本订正、补充人物、纠正错误、改进设计等都欢迎。

## 致谢

- **和合本圣经**——华人基督教界最广泛使用的中文译本
- **Google Fonts**——提供高质量的开源中英文字体
- **历世历代圣经学者**——他们的注释和研究是本项目内容的远景背景

## 许可证

[MIT License](./LICENSE)——可自由使用、修改、分发。

---

*"圣经的弧线从伊甸开始，以新耶路撒冷结束。"*
