# 演化生成链 · 从约束到自由（原文核对版）· 增量接入

本包用于在 Cavno 的 `/reading/thinking/` 栏目新增独立页面，仅含本页 5 个新增文件及本说明，不含全站源码。

## 接入方法

1. 将 `src`、`public` 合并到网站项目根目录，保持目录层级。
2. 运行 `npm run build`，按原有流程部署。
3. 新页面地址：`/reading/thinking/evolution-chain/`。
4. 内容条目会自动加入思考栏目、Reading 页面与全站搜索；无需修改公共导航或栏目模板。
5. 本页为新附件的单篇原文核对版，与此前 `/reading/thinking/evolution-generative-chain/` 四文献交互实验室分别存在，不覆盖旧页。

## 新增文件

- `src/pages/reading/thinking/evolution-chain.astro`
- `src/legacy/reading/thinking/evolution-chain/body.html`
- `src/legacy/reading/thinking/evolution-chain/style.css`
- `src/content/items/reading-thinking-evolution-chain.md`
- `public/apps/reading/thinking/evolution-chain/app.js`

## 保留内容与功能

- 保留附件内嵌的全部 202 个非空段落、15 页缓存索引、跨页片段、DOCX 标题与原有 SHA-256 字段；这些数据与附件 HTML 中保存的内容一致，本次没有重新核验外部 DOCX 文件。
- 保留九环节点、八次跃迁、螺旋/展开布局、自由回返说明、前后步进与键盘左右键操作。
- 保留三拍模式、Ω 五项状态、P/S 区分、四种历史方案及横向比较、非必然跳跃、文内张力与终章结论。
- 保留原文依据弹窗、从依据跳至全文、正文关键词检索、部分/缓存页筛选与内容覆盖索引。
- 未重新生成原文或论证，也未增补外部事实；保留附件对“原文主张”“保留意见”“结论”和阅读并置的区分。

## Cavno 样式与实现

复用 `Base.astro` 的导航、页脚、搜索及字体，统一米白底、珊瑚色和克制的绿色。原始 CSS 选择器、变量、DOM 查询及事件均限定在本页，避免影响全站；无需新增项目依赖或外部脚本。

手机端采用单列，宽图示和表格在局部横向滚动。原文弹窗沿用浏览器原生 dialog，支持 Esc、焦点管理与遮罩点击关闭；页内定位避开固定导航。交互脚本带内容哈希参数。

另附独立 HTML 预览，可直接打开。预览已内嵌必要样式、脚本及全部原文数据，搜索仅检索本页，其余栏目链接指向 cavno.org；正式接入版使用全站搜索。

完成内嵌原文及模型数据一致性核对、构建、主要交互与手机布局检查。本次交付为本地增量代码，尚未发布到线上。
