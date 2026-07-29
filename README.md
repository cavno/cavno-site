# Cavno · 个人公开工作台

四个 GitHub Pages 仓库（Investing / Reading_and_Thinking / Life_Style_and_Skills / Working）整合后的统一站点。Astro 静态生成 + Sveltia CMS 后台 + Cloudflare Pages 免费托管。旧的单文件 HTML 作品零改动迁入 `public/apps/`，同域直达打开。

## 0. 目录结构

```
├─ src/
│  ├─ content.config.ts        条目集合 schema
│  ├─ content/
│  │  ├─ nav.json              两级导航结构（后台「站点设置」可编辑）
│  │  └─ items/*.md            每个作品一条元数据（后台「作品条目」可编辑）
│  ├─ styles/global.css        全站设计系统（claude.com 视觉令牌）
│  ├─ layouts/Base.astro       外壳：两级导航 + 移动端抽屉 + 页脚
│  ├─ components/ItemCard.astro
│  └─ pages/
│     ├─ index.astro           首页
│     ├─ [...path].astro       自动生成全部一级/二级目录页
│     └─ 404.astro
├─ public/
│  ├─ apps/                    旧 HTML 作品原样存放（构建时原样输出）
│  ├─ covers/                  后台上传的图片
│  └─ admin/                   Sveltia CMS（index.html + config.yml）
└─ scripts/
   ├─ migrate.mjs              旧站批量迁移脚本
   └─ redirect-template.html   旧仓库跳转页模板
```

## 1. 本地运行

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 产物在 dist/
```

需 Node ≥ 18.17（仓库内 `.node-version` 指定 22）。

## 2. 部署到 Cloudflare Pages（免费）

1. 把本仓库推到 GitHub（建议仓库名 `cavno-site`，main 分支）。
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → 连接该 GitHub 仓库。
3. 框架预设选 **Astro**（构建命令 `npm run build`，输出目录 `dist`），部署。
4. 得到 `https://<项目名>.pages.dev`；自定义域名在 Pages 项目的 Custom domains 里绑定（域名本身需另行注册，Cloudflare Registrar 按成本价）。
5. 把实际地址回填到 `astro.config.mjs` 的 `site` 与 `public/admin/config.yml` 的 `site_url`。

免费额度硬限制：每月 500 次构建；站点文件总数 ≤ 20,000；**单文件 ≤ 25 MB**（内嵌大量 base64 图片的页面注意，迁移脚本会自动警告超限文件）。

## 3. 启用管理后台（/admin）

git-based 后台：每次「保存」= 一次 commit → 触发 Pages 重建（约 1 分钟生效）。只有对仓库有写权限的 GitHub 账号能提交。

1. **创建 GitHub OAuth App**：GitHub → Settings → Developer settings → OAuth Apps → New。
   - Homepage URL：你的站点地址（如 `https://cavno-site.pages.dev`）
   - Authorization callback URL：先随便填，第 2 步拿到 Worker 地址后改为 `https://<worker地址>/callback`
2. **部署 OAuth Worker**：打开 [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)，点 “Deploy to Cloudflare Workers”（免费额度内）。部署后在 Worker 的 Settings → Variables 填入：
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`（第 1 步生成）
   - `ALLOWED_DOMAINS`：你的站点域名（如 `cavno-site.pages.dev`，多个用逗号分隔）
   然后回到第 1 步，把 callback URL 改成 `https://<worker>.workers.dev/callback`。
3. **回填配置**：编辑 `public/admin/config.yml`，替换 `backend.repo`（你的 `用户名/仓库名`）与 `backend.base_url`（Worker 地址）。
4. 访问 `你的域名/admin/` → 用 GitHub 登录 → 可编辑「作品条目」与「站点设置 → 导航结构」。

可选加固：Cloudflare Zero Trust（Access，免费版）给 `/admin/*` 再套一层邮箱验证。

## 4. 迁移旧站

```bash
mkdir -p _legacy && cd _legacy      # _legacy/ 已在 .gitignore 中
git clone https://github.com/cavno/Investing
git clone https://github.com/cavno/Reading_and_Thinking
git clone https://github.com/cavno/Life_Style_and_Skills
git clone https://github.com/cavno/Working
cd ..

node scripts/migrate.mjs _legacy/Investing                        --section=investing
node scripts/migrate.mjs _legacy/Reading_and_Thinking/Books       --section=reading --subsection=books
node scripts/migrate.mjs _legacy/Reading_and_Thinking/Philosophy  --section=reading --subsection=philosophy
node scripts/migrate.mjs _legacy/Reading_and_Thinking/Thinking    --section=reading --subsection=thinking
node scripts/migrate.mjs _legacy/Reading_and_Thinking/Mathematics --section=reading --subsection=math
node scripts/migrate.mjs _legacy/Life_Style_and_Skills/Driving    --section=life    --subsection=driving
node scripts/migrate.mjs _legacy/Working/Amazon_Tools             --section=working --subsection=amazon
```

脚本行为：整树拷入 `public/apps/<板块>/<栏目>/`（相对资源引用不受影响）；为每个 `.html`（默认跳过旧 hub 的 `index.html`）生成一条条目元数据，标题取 `<title>`、摘要取 meta description、日期取文件修改时间。先加 `--dry` 试运行；脚本幂等，可反复执行；`--force` 覆盖已生成的条目。

迁移完成后：核对生成的 `src/content/items/*.md`（标题、日期、摘要可在后台修正），删除六条带「示例」标签的样例条目，然后 `git add -A && git commit && git push` 触发部署。旧仓库里的 hub `index.html` 会被一并拷入 `public/apps/`，确认无引用后可删除。

## 5. 旧站跳转

GitHub Pages 不支持服务端 301。把 `scripts/redirect-template.html` 复制为各旧仓库的 `index.html`，将 `__TARGET__` 替换为新站对应目录页（如 `https://cavno-site.pages.dev/reading/`），保留 canonical。分享过的深层链接需逐页放跳转，或接受失效。

## 6. 已知限制

- git-based 后台非即时生效（构建约 1 分钟），无草稿协作流——单人使用无碍。
- `*.pages.dev` / `workers.dev` 及未备案的 Cloudflare CDN 在中国大陆可达性不稳定（与 github.io 现状相当）。要稳定大陆访问需 ICP 备案 + 境内托管，超出本方案边界。
- 内容 schema 中 `section`/`subsection` 为自由字符串：在后台新增板块时，先在「站点设置 → 导航结构」加板块，再给条目填相同 slug 即可，构建不会因枚举不匹配而失败。
