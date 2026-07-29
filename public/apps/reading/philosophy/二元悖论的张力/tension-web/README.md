# 二元悖论的张力 · Interactive Atlas
#**Visit: https://cavno.github.io/philo-paradox/**
**The Tension of Dyadic Paradox — As the Motive Force of the System**
Across Ontology · Epistemology · Methodology

一个互动图谱：从「二元悖论的张力」视角观察本体论、认识论、方法论的全部发展史，
共 **64 条具体张力**、**3 个母悖论**、**5 个元洞见**，
以三种视图（时间轴 / 螺旋复现 / 三轴对照）呈现，并可深入查看每一条张力的历史脉络。

---

## 文件结构

```
philo-paradox/
├── index.html      # 页面结构
├── style.css       # 美学层（深墨 + 暖白 + 黄铜调）
├── data.js         # 数据模型：64 条张力 + 5 个元洞见
├── app.js          # 交互逻辑：分支切换 / 视图渲染 / 详情面板
└── README.md       # 本文件
```

纯静态、零依赖、零构建步骤——直接打开 `index.html` 即可。

---

## 部署到 GitHub Pages

### 方式一 · 仓库根目录（最简单）

1. 在 GitHub 新建一个仓库，例如 `philo-paradox`
2. 把这四个文件（`index.html`、`style.css`、`data.js`、`app.js`）推送到仓库根目录
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/philo-paradox.git
   git push -u origin main
   ```
3. 打开仓库 → **Settings** → 左侧 **Pages**
4. **Source** 选 `Deploy from a branch`，**Branch** 选 `main` / `(root)`，保存
5. 等待 1–2 分钟，访问 `https://<你的用户名>.github.io/philo-paradox/`

### 方式二 · 使用 `docs/` 目录

如果你想把哲学图谱放在某个更大的仓库下：
1. 把这四个文件放进仓库的 `docs/` 文件夹
2. **Settings → Pages → Branch** 选 `main` / `/docs`，保存

### 方式三 · 用户主页仓库

如果想让它直接成为你的个人主页：
1. 仓库名必须是 `<你的用户名>.github.io`
2. 文件直接放在根目录，推送 `main` 分支
3. 几分钟后访问 `https://<你的用户名>.github.io/`

---

## 三种视图说明

| 视图 | 含义 |
|---|---|
| **时间轴 · Timeline** | 沿历史顺序展开当前分支的所有阶段与张力。点击任一张力卡片，从右侧滑入详情。 |
| **螺旋复现 · Spiral** | 把同一种根本张力（如「一与多」「理性与经验」）跨越不同时代的复现汇集到一起，揭示螺旋结构。 |
| **三轴对照 · Compare** | 把本体论、认识论、方法论三个分支并列，看它们在每个时代如何同步展开同构的张力。 |

---

## 设计原则（哲学立场）

本图谱在框架上避免黑格尔式辩证综合的解读——
不把张力视为「待消解的矛盾」或「通向更高综合的环节」，
而是遵循 Wittgenstein/Heidegger 一路的语言极限观：
**张力反复出现，是因为我们的概念工具在试图言说其边界**。

页脚以《易经》第 64 卦 **未济** 收束——
> 未济，亨。

这种反思永远不能完成，因为它必须使用我们正在反思的活动本身。
这种循环不是失败，而是其本质条件。

---

## 浏览器兼容

* 现代浏览器（Chrome / Firefox / Safari / Edge 最近两年版本）
* 移动端响应式（在 900px 与 560px 两个断点重新排版）
* 字体通过 Google Fonts 加载：Noto Serif SC + Cormorant Garamond + EB Garamond + JetBrains Mono

---

## 修改与扩展

* **改数据** → 编辑 `data.js`，张力对象结构：
  ```js
  {
    id: "ont-1",
    title: "流变 ↔ 不变",
    left:  { who: "Heraclitus", pole: "万物皆流" },
    right: { who: "Parmenides", pole: "唯一永恒的「是」" },
    body:  "正文叙述……",
    recursAs: ["复现节点 1", "复现节点 2", ...]
  }
  ```
* **改美学** → 编辑 `style.css` 顶部的 `:root` CSS 变量
* **改视图** → `app.js` 中的 `renderTimeline()`、`renderSpiral()`、`renderCompare()`

---

*从文本底层逻辑生成的互动图谱*
