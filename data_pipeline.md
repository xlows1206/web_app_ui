# Data Pipeline

## 数据输入与输出格式记录

| 环节 | 输入数据 | 输出数据 | 格式 | 状态 | 备注 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Session UI 重构** | `UI_DESIGN_SPEC`, `Component CSS` | `Refactored Chat & Live View UI` | CSS/JSX | 已通畅 | 涉及头像、气泡、输入框、Live View。 |
| **Session 渲染** | `sessionId`, `chatMessages`, `viewState` | `React Component Tree` | JSX | 通畅 | 包含智能助手和实时视图面板。 |
| **AI Assistant 渲染** | `assistantState`, `messages` | `AI Assistant (No Pro Badge)` | JSX | 已通畅 | 成功删除了 "PRO" 标签。 |
| **Real-time View 渲染** | `simulationState`, `connectionStatus` | `Live View (Refactored)` | JSX | 已通畅 | 更新了状态标签与全屏功能。 |
| **项目附件列表** | `projectFiles`, `attachments` | `AttachmentCard (Horizontal)` | JSX/Object | 已通畅 | 实现"+"添加上下文及"更多"菜单操作。 |
- **Agent 任务卡片集成**:
    - 问题：任务进度卡片未显示。
    - 状态：已解决。
    - 解决：在 `chat/page.tsx` 的消息映射逻辑中补充了丢失的 `agentTask` 属性。

## 各环节问题及解决状态

- **AI 对话窗口视觉重构**:
    - 问题：当前风格较为基础，需对齐首屏的 Soft Glassmorphism 高级感。
    - 状态：已解决。
    - 解决：重构了 `ChatBubble` (头像气泡) 与 `QuickPromptTile` (提示卡片)。

- **输入框样式对齐**:
    - 问题：Session 页面输入框需参考项目页面的玻璃态输入框，删除多余音频按钮。
    - 状态：已解决。
    - 解决：在 `AIChatBox` 中移除了 `Mic` 按钮，将 `Paperclip` 移动到右侧动作簇，并重构发送按钮为圆形 `ArrowRight` 样式，支持自动高度增长。

- **实时视图 (Live View) 增强**:
    - 问题：状态标签单一且缺乏交互感。
    - 状态：已解决。
    - 解决：实现了多色状态转换、呼吸指示灯以及全屏模式。

## 记录示例

### 已完成：Session UI 视觉全面升级
1. 重绘 AI 头像为 Mesh Gradient。
2. 调整消息气泡对比度（User Black / Assistant Glass）。
3. 重构记忆更新提示器 (MemoryUpdatedCard) 图标，对齐全局视觉规范。

### 已完成：Agent 任务卡片集成
- **输入**: 用户输入“执行任务”关键字。
- **输出**: 包含流式进度条的任务卡片。
- **逻辑**: 前端模拟 1/8 -> 8/8 的步骤更新，每步间隔 1.5s。
- **状态**: 已通畅。
