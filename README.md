# Cavno · 个人公开工作台

四个 GitHub Pages 仓库（Investing / Reading_and_Thinking / Life_Style_and_Skills / Working）**重构**后的统一站点：旧的单文件 HTML 页面不再原样粘贴，而是逐页重构为站内原生页面——统一导航外壳、统一设计令牌（claude.com 视觉体系），保留原有内容与交互结构。无后台、无数据库、无 GitHub OAuth，纯静态构建，托管于 Cloudflare Pages。

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

`scripts/demo-legacy.html` 保留为转换器的自测样例（可随时删除）。迁移明细与需人工过目的页面清单见 **REPORT.md**。

## 1. 本地运行

```bash
npm install        # 大陆镜像若 404，见文末"npm 镜像问题"
npm run dev        # http://localhost:4321
npm run build      # 产物在 dist/
```

## 2. 重构旧页（核心工作流）

**本仓库已内置四个旧仓库全部 78 个内容页的重构结果**（见 REPORT.md），可直接部署。日后旧仓库有更新时：

```bash
cd _legacy && git -C Investing pull && git -C Reading_and_Thinking pull \
  && git -C Life_Style_and_Skills pull && git -C Working pull && cd ..
node scripts/migrate-all.mjs --force   # 目录→板块映射在该文件顶部的 PLAN 表维护
```

新增单个页面/目录也可手动转换：

```bash
node scripts/convert.mjs <应用目录或集合根> --section=<slug> --subsection=<slug> [--root] [--dry]
```

脚本行为：抽 <body> 装进 Base 外壳（面包屑页头）；抽全部 <style> → 画布层令牌映射（含内联 style，强调色保留）→ .lp 作用域隔离；<head> CDN 依赖搬运；站内互链改写为新路由；仅拷贝被引用的资产并按应用隔离；生成目录条目与逐页风险报告。幂等，--force 覆盖。

## 2.5 公共导航：站内页面与 GitHub 旧页

**站内页面**（首页/目录页/重构页/404）的公共导航由 `src/layouts/Base.astro` 唯一提供：sticky 顶栏 + 两级下拉 + 移动端抽屉 + 页脚，并按当前 URL 自动高亮所在板块与栏目，改一处全站生效。

**仍在 GitHub Pages 上的旧页**也能拥有同款导航栏（含二级下拉、当前板块高亮、"回到主站"按钮、移动端折叠），从而随时倒回主站。原理：主站构建时由 `scripts/gen-shell.mjs` 从 `nav.json` 生成 `public/shell.js`，其中所有链接都是指向主站的**绝对地址**，旧页跨域引用一行即可（经典 script 跨域加载不受 CORS 限制，Shadow DOM 渲染不与旧页样式互相污染）：

```html
<script src="https://cavno.pages.dev/shell.js" defer data-cavno-shell></script>
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

- **前置条件**：主站必须已部署，`astro.config.mjs` 的 `site` 必须是最终线上地址——shell.js 内嵌该地址，改域名后需重新 build + push 主站（旧页因远程引用会自动跟随，无需再动）。
- 导航栏固定在顶部并把页面下推 60px；个别自带固定头部的旧页若冲突，在 script 标签上加 `data-nopad` 后自行调整。
- 旧仓库路径（如 `/Reading_and_Thinking/**`）通过 `gen-shell.mjs` 顶部的 `LEGACY_MAP` 映射到板块，用于高亮当前位置，可自行增删。
- 本站 `public/` 里未重构的原样页面同样适用这一行引用。

## 3. 部署到 Cloudflare Pages（免费）

方式 A（推荐，仓库照常放 GitHub）：Cloudflare Dashboard → Workers & Pages → Pages → 连接仓库 → 预设 Astro（构建 `npm run build`，输出 `dist`）。push 即自动部署。

方式 B（完全不连 GitHub）：本地构建后直接上传产物：

```bash
npm run build
npx wrangler pages deploy dist --project-name=cavno-site
```

免费额度：静态请求与带宽不限量；文件总数 ≤ 20,000、单文件 ≤ 25 MB。部署后把实际地址回填 `astro.config.mjs` 的 `site`。自定义域名在 Pages 项目 Custom domains 绑定（域名需另行注册）。

## 4. 旧站跳转

GitHub Pages 不支持服务端 301。把 `scripts/redirect-template.html` 复制为各旧仓库的 `index.html`，`__TARGET__` 替换为新站对应目录页。深层链接需逐页放跳转或接受失效。

## 5. 已知限制

- CSS 作用域化按常规 CSS 写法处理（不支持原生 CSS 嵌套语法）；`position:fixed`、`100vh` 布局、脚本直接操作 `document.body` 的页面会在报告中标出，需人工微调（通常是把目标从 body 改为 `.lp`）。
- 旧页内部的组件形态（圆角、按钮造型等）不会被脚本改变——脚本统一的是色彩、字体与外壳；形态级统一属于逐页精修的范畴。
- `*.pages.dev` 及未备案的 Cloudflare CDN 在中国大陆可达性不稳定（与 github.io 相当）。要稳定大陆访问需 ICP 备案 + 境内托管，超出本方案边界。

## 附：npm 镜像问题

若 `npm install` 在 `registry.npmmirror.com` 上遇到个别包 404（镜像同步滞后），任选其一：浏览器打开 `https://npmmirror.com/sync/<包名>` 触发同步后重试；或本次直连官方源 `npm install --registry=https://registry.npmjs.org`。云端 Cloudflare 构建直连官方源，不受影响。

## 6. Working 板块的访问控制

采用 **Cloudflare Access（Zero Trust）**：鉴权在 Cloudflare 边缘完成，未通过验证时
`/working/**` 的页面 HTML 根本不会下发。**仓库内不含任何口令或密钥**，防护完全由
Cloudflare 后台配置承载。

- 配置步骤见 **[docs/ACCESS-SETUP.md](docs/ACCESS-SETUP.md)**（含验证清单与排错表）。
- 关键点：Access 应用的 Path 填 `working`（**不要填 `working/*`**，后者不覆盖 `/working` 本身）。
- 站点侧配套两处：
  - `functions/_middleware.js` —— 把 `*.pages.dev` 等非规范主机 308 跳回 `cavno.org`。
    Access 只能绑在你自有域名上，管不到 Pages 自带的 `pages.dev`，不堵会形成绕过口。
  - `/working/**` 页面输出 `noindex, nofollow`；首页「最近更新」不列出 Working 条目
    （标题本身即含工作信息）。

> ⚠️ 防护不在代码里：若迁离 Cloudflare 或误删 Access 应用，`/working/` 会立刻恢复公开。
