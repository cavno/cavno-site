# Cavno · 个人公开工作台

四个 GitHub Pages 仓库（Investing / Reading_and_Thinking / Life_Style_and_Skills / Working）**重构**后的统一站点：旧的单文件 HTML 页面不再原样粘贴，而是逐页重构为站内原生页面——统一导航外壳、统一设计令牌（claude.com 视觉体系），保留原有内容与交互结构。无后台、无数据库、无 GitHub OAuth，纯静态构建，托管于 Cloudflare Workers（静态资产）：`https://cavno-site.tchow.workers.dev`。

## 0. 目录结构

```
├─ src/
│  ├─ content.config.ts        目录条目 schema
│  ├─ content/
│  │  ├─ nav.json              两级导航结构（直接编辑此文件即可改菜单）
│  │  └─ items/*.md            目录卡片元数据（重构脚本自动生成，可手工维护）
│  ├─ styles/global.css        全站设计系统（含悬停下拉的"隐形桥"修复）
│  ├─ layouts/Base.astro       外壳：两级导航 + 移动端抽屉 + 页脚
│  ├─ legacy/<板块>/<栏目>/<slug>/   每个重构页的 body.html + style.css（作用域化后）
│  └─ pages/
│     ├─ index.astro           首页
│     ├─ [...path].astro       自动生成全部一级/二级目录页
│     └─ <板块>/<栏目>/<slug>.astro  重构后的旧页（脚本生成，可手工精修）
└─ scripts/
   ├─ convert.mjs              旧页重构脚本（核心工具）
   ├─ demo-legacy.html         旧设计系统示例页（用于演示/自测转换效果）
   └─ redirect-template.html   旧仓库跳转页模板
```

站内已含一个转换完成的示例：`/reading/books/legacy-demo/`（由 `scripts/demo-legacy.html` 转换而来），本地 `npm run dev` 后可对照源文件查看重构效果。确认流程后可删除该示例（删 `src/pages/reading/books/legacy-demo.astro`、`src/legacy/reading/books/legacy-demo/`、`src/content/items/reading-books-legacy-demo.md` 三处）。

## 1. 本地运行

```bash
npm install        # 大陆镜像若 404，见文末"npm 镜像问题"
npm run dev        # http://localhost:4321
npm run build      # 产物在 dist/
```

## 2. 重构旧页（核心工作流）

```bash
mkdir -p _legacy && cd _legacy        # _legacy/ 已在 .gitignore
git clone https://github.com/cavno/Investing
git clone https://github.com/cavno/Reading_and_Thinking
git clone https://github.com/cavno/Life_Style_and_Skills
git clone https://github.com/cavno/Working
cd ..

# 先 --dry 看报告（风险提示 + 未映射颜色清单），再正式执行
node scripts/convert.mjs _legacy/Reading_and_Thinking/Books       --section=reading --subsection=books --dry
node scripts/convert.mjs _legacy/Reading_and_Thinking/Books       --section=reading --subsection=books
node scripts/convert.mjs _legacy/Reading_and_Thinking/Philosophy  --section=reading --subsection=philosophy
node scripts/convert.mjs _legacy/Reading_and_Thinking/Thinking    --section=reading --subsection=thinking
node scripts/convert.mjs _legacy/Reading_and_Thinking/Mathematics --section=reading --subsection=math
node scripts/convert.mjs _legacy/Life_Style_and_Skills/Driving    --section=life    --subsection=driving
node scripts/convert.mjs _legacy/Working/Amazon_Tools             --section=working --subsection=amazon
node scripts/convert.mjs _legacy/Investing                        --section=investing --subsection=options
```

脚本对每个页面做的事：抽 `<body>` 装进 Base 外壳（带面包屑页头，`--no-head` 可关）；抽全部 `<style>` → 按 `TOKEN_MAP` 把旧色值替换为新设计变量 → 所有选择器限定到 `.lp` 作用域（`html/body/:root` 折叠为 `.lp`），旧样式不会污染站点外壳；`<head>` 里的 CDN 脚本/样式自动搬运；脚本与交互原样保留；同时生成目录卡片条目。幂等可重复执行，`--force` 覆盖。

**重构的三段式节奏（建议）**：① 全量跑脚本，拿到 80% 的统一度（底色、文字、强调色、外壳、页头全部归一）；② 按 `--dry` 报告处理告警页（`position:fixed`、`100vh`、脚本操作 `document.body` 的页面需要人工看一眼）；③ 对旗舰页面（书籍视察、五件套工具等）逐页精修 `src/legacy/**/style.css`——生成物就是普通源码，改起来没有任何黑盒。

**TOKEN_MAP 怎么补**：`convert.mjs` 顶部的映射表预填了旧羊皮纸/青绿/赭陶体系的常见值；跑一次 `--dry`，报告会列出"未映射颜色清单"（按出现频次排序），把属于旧设计令牌的补进表里、装饰性杂色留着即可，然后 `--force` 重跑。

## 2.5 公共导航：站内页面与 GitHub 旧页

**站内页面**（首页/目录页/重构页/404）的公共导航由 `src/layouts/Base.astro` 唯一提供：sticky 顶栏 + 两级下拉 + 移动端抽屉 + 页脚，并按当前 URL 自动高亮所在板块与栏目，改一处全站生效。

**仍在 GitHub Pages 上的旧页**也能拥有同款导航栏（含二级下拉、当前板块高亮、"回到主站"按钮、移动端折叠），从而随时倒回主站。原理：主站构建时由 `scripts/gen-shell.mjs` 从 `nav.json` 生成 `public/shell.js`，其中所有链接都是指向主站的**绝对地址**，旧页跨域引用一行即可（经典 script 跨域加载不受 CORS 限制，Shadow DOM 渲染不与旧页样式互相污染）：

```html
<script src="https://cavno-site.tchow.workers.dev/shell.js" defer data-cavno-shell></script>
```

批量接入（对旧仓库本地 clone 执行，push 后全站生效）：

```bash
node scripts/inject-shell.mjs _legacy/Investing
node scripts/inject-shell.mjs _legacy/Reading_and_Thinking
node scripts/inject-shell.mjs _legacy/Life_Style_and_Skills
node scripts/inject-shell.mjs _legacy/Working
# 然后进各仓库 git add -A && git commit -m "add shared nav" && git push
```

幂等可重复执行；`--dry` 预览；`--remove` 一键清除；`--src=` 可改脚本地址（例如把 shell.js 拷进旧仓库后用相对路径，代价是更新不再自动跟随）。要点与注意：

- **前置条件**：主站必须已部署，`astro.config.mjs` 的 `site` 填线上地址（当前为 `https://cavno-site.tchow.workers.dev`）。shell.js 内嵌该地址作兜底；**跨域引用时运行时自动改用脚本实际来源域**，所以即使以后换域名，旧页只要还在引用一个能访问到的 shell.js，链接就自动指对，无需重新注入。
- **仓库根页注意**：`Reading_and_Thinking`、`Working` 两仓库根目录没有 `index.html`（根页由 GitHub 用 README.md 渲染），注入工具只处理 `.html` 文件，这两个根页默认不会有导航栏。可选补法：在仓库根新建 `_includes/head-custom.html`，内容即上面那行 `<script …>`（GitHub Pages 默认 Jekyll 主题支持该自定义包含，效果上线后自验）；或接受根页无导航。
- 导航栏固定在顶部并把页面下推 60px；个别自带固定头部的旧页若冲突，在 script 标签上加 `data-nopad` 后自行调整。
- 旧仓库路径（如 `/Reading_and_Thinking/**`）通过 `gen-shell.mjs` 顶部的 `LEGACY_MAP` 映射到板块，用于高亮当前位置，可自行增删。
- 本站 `public/` 里未重构的原样页面同样适用这一行引用。

## 3. 部署到 Cloudflare Workers（免费）

线上地址：`https://cavno-site.tchow.workers.dev`（Workers 静态资产，配置见 `wrangler.jsonc`，`name` 与线上 Worker 同名，部署即覆盖更新）。

本地一键部署（首次会引导浏览器登录 Cloudflare）：

```bash
npm run build
npx wrangler deploy
```

若 Worker 是在 Dashboard 连 GitHub 自动构建的，push 即自动部署（构建命令 `npm run build`）。以后绑自定义域名：改 `astro.config.mjs` 的 `site` → 重新 build + 部署即可，旧页无需重新注入（原理见 2.5）。

## 4. 旧站跳转

GitHub Pages 不支持服务端 301。把 `scripts/redirect-template.html` 复制为各旧仓库的 `index.html`，`__TARGET__` 替换为新站对应目录页。深层链接需逐页放跳转或接受失效。

## 5. 已知限制

- CSS 作用域化按常规 CSS 写法处理（不支持原生 CSS 嵌套语法）；`position:fixed`、`100vh` 布局、脚本直接操作 `document.body` 的页面会在报告中标出，需人工微调（通常是把目标从 body 改为 `.lp`）。
- 旧页内部的组件形态（圆角、按钮造型等）不会被脚本改变——脚本统一的是色彩、字体与外壳；形态级统一属于逐页精修的范畴。
- `*.workers.dev` / `*.pages.dev` 及未备案的 Cloudflare CDN 在中国大陆可达性不稳定（与 github.io 相当）；shell.js 加载失败时旧页只是没有导航条，内容不受影响。介意的话可用 `--src=` 把 shell.js 拷进各仓库改走同域相对路径，代价是导航更新不再自动跟随。要稳定大陆访问需 ICP 备案 + 境内托管，超出本方案边界。

## 附：npm 镜像问题

若 `npm install` 在 `registry.npmmirror.com` 上遇到个别包 404（镜像同步滞后），任选其一：浏览器打开 `https://npmmirror.com/sync/<包名>` 触发同步后重试；或本次直连官方源 `npm install --registry=https://registry.npmjs.org`。云端 Cloudflare 构建直连官方源，不受影响。
