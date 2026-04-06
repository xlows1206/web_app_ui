# ProcAgent 全局 UI 视觉规范 (Global UI Spec)

本规范定义了 ProcAgent 项目的视觉语言与交互标准，旨在确保产品在迭代过程中保持高度的审美一致性与品牌感（Editorial Pulse）。

## 1. 设计哲学 (Design Philosophy)

*   **极简主义 (Minimalism)**：移除冗余元素，专注于核心任务流。
*   **磨砂玻璃感 (Soft Glassmorphism)**：使用半透明材质、大幅度背景模糊与细腻的边框，营造层次感。
*   **物理触感 (Tactile Feedback)**：通过微缩放（`active:scale-95`）提供即时的物理反馈。
*   **呼吸感 (Editorial Pulse)**：全局不仅是静态的，通过缓慢的渐变动画与流光效果让界面“活”起来。

---

## 2. 色彩系统 (Color System)

### 2.1 背景渐变 (Background Mesh Gradient) —— **核心继承项**
为了保持全站一致的视觉底色，必须继承以下 4 色径向渐变配置：

*   **配置参数**：
    *   Top-Left (0% 0%): `#A7F3D0` (Soft Teal)
    *   Top-Right (100% 0%): `#FDBA74` (Soft Peach)
    *   Bottom-Right (100% 100%): `#BFDBFE` (Soft Blue)
    *   Bottom-Left (0% 100%): `#FDFBF7` (Cream Surface)
*   **动画 (mesh-breathe)**：
    *   时长：15s
    *   方式：`ease infinite alternate`
    *   效果：背景位置在 `0% 0%` 到 `100% 100%` 之间平滑切换。

### 2.2 基础色彩
*   **Surface (底色)**: `#FDFBF7`
*   **Primary (主色)**: `#111827` (Rich Black) - **严禁使用纯黑 #000000**。
*   **On-Primary**: `#FFFFFF`
*   **Glass Border**: `rgba(255, 255, 255, 0.65)`
*   **Glass Background**: `rgba(255, 255, 255, 0.48)`

---

## 3. 材质与高度 (Surface & Elevation)

### 3.1 玻璃板准则 (Glass Panel)
*   **Backdrop Blur**: 32px 为标准模糊度。
*   **Border**: 1px 细边框，颜色为 `glass-border`。
*   **Shadow**:
    *   外阴影：极淡的弥散阴影 (`rgba(0, 0, 0, 0.05)`)。
    *   内阴影：`inset 0 0 0 1.5px rgba(255, 255, 255, 0.35)`，增加边缘厚度感。

### 3.2 圆角层级 (Corner Radius)
*   **顶级/页面级容器**: `32px` 或 `24px`。
*   **功能区块/面板**: `16px`。
*   **小部件/文件卡片**: `12px`。
*   **原子级按钮/标签**: `8px`。
*   **行动按钮 (CTA)**: `full` (Pill shaped)。

---

## 4. 间距与布局 (Spacing & Layout)

### 4.1 Editorial Pulse 间距标准
*   **标准内边距**: `px-6 py-4` (24px 左右, 16px 上下)。
*   **面板间距**: 统一使用 `gap-4` (16px) 或 `gap-6` (24px)。

### 4.2 容器规范
*   **固定高度**: 工作区主容器（Session/Project Workspace）强制 `h-screen` 或 `100vh`，禁用全局滚动，采用局部滚动。
*   **自适应**: 支持面板拖拽缩放，缩放期间必须移除动画 (`transition: none`) 以避免抖动。

---

## 5. 字体与排版 (Typography)

*   **字体族**: `Manrope` (英文/数字), `Noto Sans SC` (中文)。
*   **对齐**: 重要标题采用中对齐，业务列表采用左对齐。
*   **对比度**: 文字优先使用 `Primary Black`，辅助信息使用淡灰色，确保在玻璃材质上的可读性。

---

## 6. 视觉动效 (Motion & Interaction)

### 6.1 交互反馈
*   **下沉感**: 所有可点击元素必须包含 `active:scale-95` 或 `active:scale-[0.98]`。
*   **悬浮感**: 悬浮时增加阴影深度与背景透明度（从 0.48 提升至 0.6）。

### 6.2 状态动效
*   **Breathing (呼吸)**: 关键操作按钮或状态点使用 2.5s 周期的缩放与外发光呼吸。
*   **Shimmer (流光)**: 
    *   AI 正在生成时：使用 `text-shimmer`。
    *   高保真按钮：使用 `shimmer-sweep`。
*   **Agent Operating (运行中)**: 渐变色模糊边框流光 (`agent-operating-glow`)。

---

> [!NOTE]
> 本文档为 ProcAgent 的视觉基石，所有新开发的组件需通过上述准则进行审计。
