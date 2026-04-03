# Project Todo List

## 项目目标陈述
项目目标陈述：
1. 重构 Session 页面 AI 对话窗口视觉风格（头像、气泡、提示卡片）。
2. 更新重构输入框，参考项目页面的输入框样式。
3. 遵循 Soft Glassmorphism 全局视觉规范。

## 关键模块描述
- **Session Page**: 包含智能助手和实时视图的主要页面.
- **AI Assistant Component**: 渲染智能助手面板及 "PRO" 标签.
- **Real-time View Component**: 渲染实时视图面板及 "连接到本地服务器" 按钮.

## 处理流程描述
1. 确定 `PRO` 标签所在的组件位置.
2. 确定 "连接到本地服务器" 按钮所在的组件位置.
3. 在代码中删除这两个元素及其相关的样式/逻辑.
4. 验证删除后的页面效果.

- [x] **视觉重构 - AI 对话窗口**
    - [x] 重构 AI 头像 (Mesh Gradient).
    - [x] 重构聊天气泡 (User: Rich Black, Assistant: Glass).
    - [x] 重构提示卡片 (Glass Tiles).
    - [x] 重构记忆更新提示器 (MemoryUpdatedCard) 图标风格.
- [x] **视觉重构 - 输入框**
    - [x] 修改外层容器为 `rounded-[32px]`.
    - [x] 应用 `bg-white/40` 与 `backdrop-blur-2xl`（已对齐规范）.
    - [x] 删除音频按钮 (Mic).
    - [x] 复用项目页面的按钮布局 (Textarea Left / Icons Right).
    - [x] 重构发送按钮为圆形样式并使用 `ArrowRight` 图标.
- [x] **视觉重构 - 实时视图 (Live View)**
    - [x] 成功删除了 "连接到本地服务器" 按钮.
    - [x] 更新状态标签，支持不同颜色区分.
    - [x] 为状态标签添加呼吸指示灯 (Breathing Light).
    - [x] 实现全屏显示功能.
- [x] **精细化 UI Tweak**
    - [x] 移除消息通知红点的呼吸效果 (animate-pulse).
    - [x] 移除消息通知红点的白色描边 (border-2 border-white).
    - [x] 进一步缩小红点尺寸 (w-2.5 -> w-2).
- [x] **附件面板功能更新**
    - [x] 重构 `AttachmentCard` 为水平布局.
    - [x] 添加 "+" 按钮用于应用到上下文.
    - [x] 将预览、重命名、下载、删除收纳进 "更多" 菜单.
    - [x] 在 `chat/page.tsx` 中集成并实现逻辑.
- [x] **Agent 任务卡片集成**
    - [x] 修改 `AgentTaskProgress.tsx` 支持双层名称显示 (Major/Sub).
    - [x] 修改 `AIChatBox` 与 `ChatBubble` 以适配新数据结构.
    - [x] 实现在 `chat/page.tsx` 中通过关键词“执行任务”触发 Mock 动画.
    - [x] 实现 1/8 到 8/8 的流式进度更新模拟.
- [x] **验证与更新文档**
    - [x] 验证全平台响应式效果.
    - [x] 更新 data_pipeline.md.
