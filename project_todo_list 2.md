# Project To-Do List

## 项目目标陈述
在项目详情页 (`ProjectPage`) 底部集成一个 AI 对话框组件，该组件通过重构 `document` 页面中的 AI 聊天逻辑实现。

## 关键模块描述
- `src/components/ui/AIChatBox`: [NEW] 封装后的 AI 聊天框组件。
- `src/app/project/page.tsx`: 目标集成页面。
- `src/app/document/page.tsx`: AI 聊天逻辑源页面。

## 处理流程描述
1. 审计 `src/app/document/page.tsx` 中的 AI 聊天逻辑与样式。
2. 提取并封装为通用的 `AIChatBox` 组件。
3. 在 `src/app/project/page.tsx` 底部集成 `AIChatBox`。
4. 确保样式、动效与全局设计规范一致。

## 各环节主任务与子任务
- [x] 提取 AI 聊天逻辑与组件
    - [x] 分析 `document` 页面的 `ChatMessage`、`handleSend` 等逻辑
    - [x] 创建 `src/components/ui/AIChatBox` 文件夹
    - [x] 实现 `AIChatBox` 基础结构与样式
- [x] 集成到项目页面
    - [x] 修改 `src/app/project/page.tsx` 的布局
    - [x] 引入并布局 `AIChatBox`
- [x] 验证与优化
    - [x] 验证聊天交互与动效
    - [x] 验证响应式布局
    - [x] 更新 `REGISTRY.md`
