# ProcAgent: Frontier AI Engineering Workspace

ProcAgent 是一款面向工程师的高保真 AI 工程协作工作区。它采用了极简的 **Editorial Pulse** 设计美学，结合 **Soft Glassmorphism** (磨砂玻璃) 视觉风格，旨在为 AI Agent 的实时监控、任务执行与仿真建模提供沉浸式的操作体验。

---

## 🎨 视觉与设计标准 (Visual Excellence)

ProcAgent 不仅仅是一个工具，更是一个遵循严苛设计准则的视觉艺术品：
- **Soft Glassmorphism**: 层叠的 32px 模糊背景、细腻的 1px 亮色边框。
- **Editorial Pulse**: 动态呼吸的 Mesh Gradient 背景与极致的 `px-6 py-4` 排版间距标准。
- **Tactile Feedback**: 所有的交互均具备物理级下沉反馈 (`active:scale-95`)。

---

## 🛠 技术栈 (Tech Stack)

- **核心框架**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **样式方案**: [Tailwind CSS v4](https://tailwindcss.com/) (现代编译引擎)
- **图标库**: [Lucide React](https://lucide.dev/)
- **类型安全**: [TypeScript](https://www.typescriptlang.org/)

---

## 🌍 多语言管理 (Global Language Management)

ProcAgent 内置了完整的国际化方案，通过 `src/contexts/LanguageContext.tsx` 统一管理全局界面语言：

- **核心机制**: 基于 React Context 的 `LanguageProvider`。
- **支持语言**: 目前支持简体中文 (`zh`) 和 英文 (`en`)。
- **使用方式**:
  - 组件内通过 `useLanguage()` 钩子获取 `t` 字典对象和 `language` 状态。
  - **文案定义**: 所有静态文案均在 `LanguageContext.tsx` 的 `dictionaries` 对象中按模块（如 `common`, `sidebar`, `document` 等）定义。
  - **调用示例**:
    ```tsx
    const { t, language, setLanguage } = useLanguage();
    return <button>{t.common.confirm}</button>;
    ```

---

## 🚀 快速开始 (Getting Started)

### 环境要求
- Node.js 18.x 或更高版本
- 推荐使用 `pnpm` 包管理器

### 安装依赖
```bash
pnpm install
# 或使用 npm
npm install
```

### 本地开发
```bash
pnpm dev
# 或使用 npm
npm run dev
```
打开 [http://localhost:3000](http://localhost:3000) 即可预览。

---

## 📂 关键文件与开发文档 (Important Docs)

为了保持项目开发的规范性与样式继承，请务必在开发前阅读以下文档：

1.  **[全局 UI 视觉规范 (Global UI Spec)](.agent_memory/global_ui_spec.md)**
    - 记录了背景渐变色定义、圆角层级、间距规范及动效准则。
2.  **[前端 API 对接文档 (API Doc)](.agent_memory/front_end_api_doc.md)**
    - 定义了从用户会员信息、会话历史到实时任务流推送的全部数据模型与接口规范。
3.  **[组件库注册表 (Component Registry)](src/components/ui/REGISTRY.md)**
    - 所有现役 UI 原子组件与业务组件的中央索引，严禁重复造轮子。

---

## 结构概览 (Project Structure)

```text
src/
├── app/              # Next.js 路由与主页面
├── components/
│   ├── layout/       # 全局布局 (Sidebar, AppTopNav)
│   ├── ui/           # 原子级 UI 组件 (AIChatBox, GlassCard...)
│   ├── views/        # 复合视图组件 (SessionActiveView, ProjectSandboxView)
│   └── workspace/    # 业务驱动的工作区模块
├── contexts/         # 全局状态 (Language, Sidebar)
├── hooks/            # 业务逻辑 Hook (useFileWorkspace)
└── lib/              # 工具函数与时间处理
```

---

## 🤖 核心功能模块

- **AIChatBox**: 支持实时分步任务进度展示的智能交互窗口。
- **LiveViewPanel**: 支持 VNC 协议的 Agent 运行环境实时画面监控。
- **Analysis Grid**: 针对仿真模拟与 3D 配管的动态 JSON 参数解析系统。
- **Memory Systems**: 具备记忆自动更新与上下文附件管理的知识系统。

---

> Built by engineer for engineer.
> **Editorial Pulse** - Breathing visual life into AI engineering.
