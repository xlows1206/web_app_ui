# ProcAgent UI 组件库注册表 (Component Registry)

本文件为 `src/components/` 目录下 **所有现役组件** 的中央索引，记录各组件的功能、引用次数与引用位置，供开发维护和审计使用。

> 最后审计时间：2026-04-03 14:58 | 审计工具：ts-prune + grep import 双重验证

---

## 1. 核心设计哲学

- **物理手感**：所有交互组件必须继承 `active:scale-95` 或 `active:scale-[0.99]` 的微秒级下沉反馈。
- **圆角层级**：顶级容器 `24px`，次级 `16px/12px`，原子 `8px`，极致圆润 `full`。
- **色彩规范**：严禁使用纯黑 (`#000000`)，使用 `text-on-surface` 系列。

---

## 2. 现役组件列表

### 📂 `src/components/ui/` — UI 原子/业务组件

| 组件名称 | 引用次数 | 核心 Props | 功能简述 | 引用位置 |
| :--- | :---: | :--- | :--- | :--- |
| **AIChatBox** | 1 | `messages`, `onSend`, `isGenerating` | 可复用 AI 聊天框，含快捷 Prompt | `app/chat/page.tsx` |
| **Avatar** | 8 | `name`, `image`, `size` | 渐变基础头像，支持 6 组确定性渐变色 | `projects/page`, `AppTopNav`, `WorkspaceUserControls`, `ActiveProjectsSection`, `ProjectMembersModal`, `WorkDocSection`, `contexts/ProjectPage`, `NotificationCenter` |
| **AvatarGroup** | 2 | `avatars`, `extraCount` | 头像堆叠组，负边距叠层 | `app/projects/page.tsx`, `app/projects/page.tsx` |
| **BackButton** | (内部) | — | 返回按钮，由 `PageHeader` 内部调用 | `ui/PageHeader.tsx` |
| **Badge** | 5 | `variant`, `colorClassName` | 状态/分类标签 | `chat/page`, `document/page` |
| **ChatBubble** | 2 | `role`, `content`, `agentTask` | 聊天气泡，支持 shimmer 动效与任务进度 | `app/document/page.tsx` |
| **EmphasisButton** | 3 | `shimmer`, `fullWidth` | 品牌渐变强调按钮，流光动效 | `CreateProjectModal`, `UpgradeCreditsModal`, `NewUserGuideModal`* |
| **FilterGroup** | 1 | `options`, `value`, `onChange` | 分类过滤组，Premium 选中小条动效 | `app/templates/page.tsx` |
| **GlassCard** | 1 | `children`, `padding`, `style` | 磨砂玻璃卡片，`backdrop-blur` | `app/document/page.tsx` |
| **GradientInput** | 1 | `value`, `onChange`, `onSubmit` | 渐变粒子光效输入框 | `app/chat/page.tsx` |
| **IconButton** | 4 | `icon`, `iconClassName` | 纯图标按钮，`active:scale-95` | `chat/page`, `document/page`, `AppTopNav`, `NotificationCenter` |
| **PageHeader** | 1 | `title`, `tags`, `rightElement` | 页面头部，含返回按钮与右侧插槽 | `app/templates/page.tsx` |
| **PageLayout** | 2 | `variant`, `children` | 全站背景容器，Editorial Pulse 动效背景 | `document/page`, `templates/page` |
| **Portal** | 7 | `children` | DOM 挂载点，用于弹窗层级管理 | `FilePreviewModal`, `DeleteProjectModal`, `ProjectMembersModal`, `TemplateDetailModal`, `TemplateLibraryModal`, `TemplateProjectSelectModal`, `UpgradeCreditsModal` |
| **ProjectCard** | 1 | `title`, `tags`, `avatars` | 项目磁贴名片，Editorial Pulse 呼吸发光 | `workspace/ActiveProjectsSection.tsx` |
| **ProjectTag** | 3 | `type`, `labelOverride` | 业务项目标签，Badge Pill 变体 | `document/page`, `WorkDocSection` |
| **QuickPromptTile** | 2 | `title`, `prompt`, `onClick` | 快捷建议卡片，Hover 提亮动效 | `app/document/page.tsx` |
| **SectionHeader** | 2 | `title`, `level`, `badge` | 区块标题，垂直指示条 | `document/page`, `templates/page` |
| **StatusBadge** | 2 | `type`, `label` | 业务状态标签，状态圆点标准化配色 | `chat/page`, `document/page` |
| **TemplateCard** | 4 | `template`, `viewLabel`, `onApply` | 模板选择卡片，Hover 模糊遮罩 | `templates/page`, `TemplateLibraryModal`, `TemplatesSection`*, `WorkDocSection`* |
| **WorkspaceUserControls** | 1 | — | 工作区用户控件容器 | `ui/WorkspaceUserMenu.tsx` |
| **WorkspaceUserMenu** | 3 | — | 用户下拉菜单，含升级入口 | `chat/page`, `document/page`, `AppTopNav`, `WorkspaceNav` |
| **NotificationCenter** | 2 | — | 消息通知中心，含铃铛与下拉面板 | `AppTopNav`, `WorkspaceNav` |
| **SessionHistoryList** | 1 | `sessions`, `activeSessionId`, `onSwitchSession` | 处理侧边栏历史记录列表，含沉浸式状态反馈与空状态 | `app/chat/page.tsx` |
| **KeyParameterPanel** | 1 | `data`, `activeCategory`, `onCategoryChange` | 自适应工程参数网格，支持基于翻译词库的动态分类 Tab | `app/chat/page.tsx` |
| **ProjectRoutingCard** | 1 | `title`, `description`, `buttonText`, `targetPath` | 高保真项目跳转/引导卡片，Soft Glassmorphism | `ui/ChatBubble.tsx` |
| **MemoryUpdatedCard** | 1 | `title`, `description` | 轻量化记忆已更新提示卡片，Soft Glassmorphism | `ui/ChatBubble.tsx` |

> \* 标注的引用方来自其他已存在但当前未在页面直接挂载的组件内部

---

### 📂 `src/components/workspace/` — 工作区业务组件

| 组件名称 | 引用次数 | 功能简述 | 引用位置 |
| :--- | :---: | :--- | :--- |
| **ActiveProjectsSection** | 1 | 首页活跃项目区块（含 ProjectCard 列表） | `app/projects/page.tsx`（ProjectCard 内 import type） |
| **CreateProjectModal** | 2 | 新建项目弹窗，2x2 宫格类型选择 | `app/projects/page.tsx`, `ActiveProjectsSection.tsx` |
| **DeleteDocModal** | 1 | 文档删除确认弹窗 | `workspace/WorkDocSection.tsx`* |
| **DeleteProjectModal** | 1 | 项目删除双重确认弹窗（名称匹配） | `app/projects/page.tsx` |
| **DocTypeModal** | 1 | 文档类型选择弹窗 | `workspace/WorkDocSection.tsx`* |
| **ProjectMembersModal** | 2 | 项目成员管理弹窗 | `app/projects/page.tsx` |
| **TemplateDetailModal** | 3 | 模板详情预览与应用弹窗 | `templates/page`, `TemplateLibraryModal`, `TemplatesSection`* |
| **TemplateLibraryModal** | 1 | 模板库总览弹窗 | `workspace/WorkDocSection.tsx`* |
| **TemplateProjectSelectModal** | 1 | 模板应用时选择目标项目弹窗 | `workspace/TemplatesSection.tsx`* |
| **UpgradeCreditsModal** | 1 | 升级/积分购买弹窗，Soft Glassmorphism | `ui/WorkspaceUserMenu.tsx` |

---

### 📂 `src/components/layout/` — 全局布局组件

| 组件名称 | 引用次数 | 功能简述 | 引用位置 |
| :--- | :---: | :--- | :--- |
| **LayoutContent** | 1 | 主内容区布局适配容器 | `app/layout.tsx` |
| **Sidebar** | 3 | ChatGPT 风格暗色可折叠侧边栏 | `app/layout.tsx`, `LayoutContent.tsx`, `AppTopNav.tsx` |
| **AppTopNav** | 3 | 首页/项目页深色导航栏 | `app/page.tsx`, `projects/page.tsx`, `templates/page.tsx` |
| **WorkspaceNav** | 1 | 工作区/会话页白色导航栏 | `app/chat/page.tsx` |

---

### 📂 `src/components/` — 根目录业务组件

| 组件名称 | 引用次数 | 功能简述 | 引用位置 |
| :--- | :---: | :--- | :--- |
| **AgentTaskProgress** | 3 | Agent 任务执行进度展示 | `app/document/page.tsx` |
| **AttachmentList** | 2 | 附件列表，包含 FileCard 渲染 | `app/document/page.tsx` |
| **FileCard** | 4 | 单个文件卡片，含预览触发 | `document/page`, `AttachmentList.tsx`, `FilePreviewModal.tsx` |
| **FilePreviewModal** | 1 | 文件全屏预览弹窗 | `components/FileCard.tsx` |
| **ProjectConfigTable** | 1 | 项目参数配置表格 | `app/document/page.tsx` |

---

## 3. 使用建议

- 引入新组件前，先查阅本文件确认是否已有可复用组件。
- 修改现有组件时，请同步更新对应目录下的 `component.md`。
- 每次清理/新增组件后，请更新本文件的**最后审计时间**。

---

*Last Updated: 2026-04-03 14:58 | Audited via: ts-prune + grep double-check*
