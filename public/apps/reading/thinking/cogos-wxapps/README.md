# 认知操作系统 · 逻辑演化实验室（微信小程序版）

七相位交互状态机：序（划下第一刀）→ 1.0 稳态封闭 → 2.0 辩证引擎 → 3.0 再进入
→ 3.0⁺ 分层塔 → 4.0 逻辑生态 → ∞ 镜厅。
四个原生 Tab：〇 实验室 / 一 档案 / 二 工作台 / 三 武器库。

## 导入方式
1. 打开「微信开发者工具」→ 导入项目 → 选择本文件夹；
2. AppID 选「测试号」（工程内置 touristappid），或替换为你自己的 AppID；
3. 基础库 2.30+（工程声明 3.4.0），点编译即可运行。

## 原生适配清单（非 Web 搬运）
- 底部 tabBar + 每页原生 navigationBar（羊皮纸配色），页面即模块；
- 全量 rpx 布局，触控目标 ≥ 88rpx，safe-area 适配；
- DOM/SVG 状态机重写为 setData 声明式渲染；舞台视觉以 view + WXSS
  动画重建（脆断震屏、扬弃合并、说谎者振荡、分层塔升起、隔离脉冲环、镜厅嵌套缩放）；
- 原生组件：slider（4.0 真值 p）、scroll-view（相位轨道横滑 / 日志 scroll-into-view）；
- 触觉反馈 wx.vibrateShort（拒收 medium / 脆断 heavy / 相变分级）、
  关键拒收事件 wx.showToast；
- 每页 onShareAppMessage / onShareTimeline 自定义分享；
- 计时器统一登记，onHide/onUnload 与相位切换时全量清理；
- 字体栈 Songti SC / STSong / serif 优雅降级，保留羊皮纸-青绿-赤陶品牌体系。

## 目录
app.{js,json,wxss} · project.config.json · sitemap.json
pages/lab（实验室·状态机） pages/archive（四代档案）
pages/bench（五步法工作台） pages/arsenal（武器库·洞察·结算·残余）
