# Cloudflare Access 保护 Working 板块 · 保姆级操作攻略

> 目标：`cavno.org/working` 及其下全部页面，只有你（及你授权的邮箱）能打开；
> 其他人看到的是 Cloudflare 的登录页，**页面 HTML 根本不会下发**。
>
> 站点侧无需任何口令、无需改代码——防护完全由 Cloudflare 边缘完成。
> 本文档写于 2026-08，Cloudflare 后台改版频繁；若某处名称对不上，按「所在层级」找同义入口即可。

---

## 零、先决条件（30 秒自查）

| 项 | 要求 | 怎么确认 |
|---|---|---|
| 域名 | `cavno.org` 已在你的 Cloudflare 账户中，且状态为 **Active** | 后台首页域名列表看状态标签 |
| 部署 | 站点由 Cloudflare Pages 提供服务，`cavno.org` 已绑为自定义域 | Pages 项目 → Custom domains |
| 邮箱 | 你能正常收信的邮箱（用于接收一次性验证码） | — |

> ⚠️ 若 `cavno.org` 的 DNS 不在 Cloudflare（例如仍在其他注册商解析），Access 无法生效。

---

## 一、开通 Zero Trust（首次才需要）

1. 登录 <https://dash.cloudflare.com>。
2. 左侧边栏点 **Zero Trust**（新版可能显示为 **Cloudflare One**）。
3. 首次进入会要求起一个 **team name（团队名）**，它决定你的登录域名
   `<team-name>.cloudflareaccess.com`。
   - 建议填 `cavno`，全小写、无空格。**这个名字之后不易更改，想好再填。**
4. 选择 **Free 计划**（50 用户以内永久免费）。
5. 可能会要求绑定支付方式。这是 Cloudflare 的开通流程要求，**免费额度内不会扣费**；
   若你不愿绑卡而流程卡住，可换用本文第七节的替代方案。

---

## 二、添加登录方式：一次性邮箱验证码（One-time PIN）

新开的 Zero Trust 组织默认使用 Cloudflare 自带身份源，**一次性 PIN 不再自动添加**，需手动加一次。

1. Zero Trust 后台 → 左侧 **Integrations（集成）** → **Identity providers（身份提供商）**。
   - 旧版路径为 **Settings → Authentication → Login methods**。
2. 点 **Add new identity provider（添加）**。
3. 选择 **One-time PIN**。
4. 保存。

> 这样登录时只需填邮箱、收 6 位验证码即可，**无需 Google/GitHub 账号**。
> 验证码 10 分钟内有效。若你更习惯用 Google/GitHub 登录，也可在同一页面添加对应身份源，二者可并存。

---

## 三、创建 Access 应用（核心步骤）

1. Zero Trust 后台 → **Access controls（访问控制）** → **Applications（应用）**。
   - 旧版路径为 **Access → Applications**。
2. 点 **Create new application（添加应用）**。
3. 类型选 **Self-hosted（自托管）**。
4. 点 **Add public hostname（添加公开主机名）**，按下表填写：

   | 字段 | 填什么 | 说明 |
   |---|---|---|
   | **Application name** | `Cavno Working` | 随意，自己看的 |
   | **Subdomain** | **留空** | 保护 `cavno.org` 本身，不是子域 |
   | **Domain** | 下拉选 `cavno.org` | 必须是你账户里 Active 的域 |
   | **Path** | `working` | ⚠️ 见下方红字 |
   | **Session Duration** | `1 month`（或你偏好的时长） | 到期后需重新验证 |

   > 🔴 **Path 一定填 `working`，不要填 `working/*`。**
   > Cloudflare 的路径规则里，`working/*` 只覆盖子路径、**不覆盖 `/working` 本身**；
   > 而填 `working` 时，子路径会通过「策略继承」一并被保护——一条规则即可覆盖整个板块。

5. 继续下一步，进入 **Access policies（访问策略）**。

---

## 四、设置访问策略：只有你能进

1. 点 **Create new policy（新建策略）**（或「Add a policy」）。
2. 填写：

   | 字段 | 填什么 |
   |---|---|
   | **Policy name** | `Only me` |
   | **Action** | **Allow** |
   | **Session duration** | 同应用设置即可 |

3. 在 **Add rules → Include（包含）** 中：
   - **Selector** 选 `Emails`
   - **Value** 填你的邮箱，例如 `you@example.com`
   - 需要多人时点 **+ Add** 继续追加，或改用 `Emails ending in` 匹配整个域名后缀。

4. 保存策略。

> 📌 **Access 默认全部拒绝**——只有匹配到 Allow 策略的人才能进。所以你不需要再写任何 Block 规则。

---

## 五、确认身份源并完成创建

1. 在 **Identity providers（登录方式）** 区块，确认 **One-time PIN** 已勾选。
2. 若只启用了这一种，可打开 **Instant Auth / Apply instant authentication**，跳过选择页直接进入。
3. 点 **Save / Add application** 完成创建。

---

## 六、验证是否真的生效（务必做完）

打开**无痕窗口**（关键：正常窗口可能带着你已有的登录态），依次测试：

| # | 访问地址 | 预期结果 |
|---|---|---|
| 1 | `https://cavno.org/` | ✅ 正常显示首页，**不要求登录** |
| 2 | `https://cavno.org/working/` | 🔒 跳转到 Cloudflare 登录页 |
| 3 | `https://cavno.org/working/amazon/` | 🔒 同样要求登录 |
| 4 | `https://cavno.org/working/amazon/销售明细透视台/` | 🔒 同样要求登录（**这条最关键，验证深层路径是否被继承保护**） |
| 5 | 输入邮箱 → 收验证码 → 登录 | ✅ 正常进入工具页，功能一切如常 |
| 6 | `https://cavno.pages.dev/working/` | ↪️ 应 308 跳回 `cavno.org`，再被 Access 拦下 |

**若第 4 条没有被拦下**（即深层页面能直接打开），说明路径继承未按预期生效。补救办法：
再建一个应用，其他设置相同，**Path 填 `working/*`**，两条规则并存即可全覆盖。

**若第 6 条没有跳转**：确认仓库根目录的 `functions/_middleware.js` 已随本次部署上线
（Git 集成方式自动生效；若用 `wrangler pages deploy dist`，需在项目根目录执行，才能一并打包 `functions/`）。

---

## 七、日常维护

- **加人**：Zero Trust → Access controls → Applications → 你的应用 → Policies → 在 Include 里加邮箱。
- **踢人**：从 Include 列表删掉邮箱。已登录者会在其 session 到期后失效；
  要立即失效可在 **Access controls → Sessions / Users** 中撤销该用户会话。
- **看谁进来过**：Zero Trust → **Logs → Access**，可见每次登录的邮箱、时间、IP。
  免费版日志保留 24 小时——需要长期留痕的话，定期导出或升级。
- **换登录方式**：Integrations → Identity providers 里可随时增删 Google / GitHub 等。

---

## 八、这套方案的边界（请知悉）

1. **防护完全依赖 Cloudflare 配置，不在代码仓库里。**
   若日后迁离 Cloudflare、或误删 Access 应用，`/working/` 会**立刻恢复公开**。
   迁移或改动前请务必先确认替代防护到位。
2. **保护的是页面访问，不是数据加密。**
   透视台等工具的数据存在你本机浏览器的 IndexedDB 中；
   Access 管不到「有人拿到你解锁后的电脑」这种情况。
3. **首页已不再列出 Working 条目**（标题本身即含工作信息）。
   若你希望恢复展示，改 `src/pages/index.astro` 中 `recent` 的过滤条件即可。
4. **免费版限制**：50 用户、24 小时日志保留、社区支持。个人使用绰绰有余。

---

## 附：出问题时的排查顺序

| 症状 | 多半是 |
|---|---|
| 全站都要登录，首页也被拦 | 应用 Path 填空了或填成 `*`。改回 `working` |
| `/working/` 不要求登录 | 域名未选对；或 DNS 未走 Cloudflare 代理（灰云）；或应用未保存成功 |
| 深层页面不被拦 | 路径继承问题 → 补建 `working/*` 应用（见第六节） |
| 收不到验证码 | 检查垃圾邮件；把 `noreply@notify.cloudflare.com` 加入白名单 |
| 登录后仍 403 | 邮箱与策略里填的不一致（注意大小写与别名） |
| pages.dev 仍可直达 | `functions/_middleware.js` 未部署（见第六节末尾） |
