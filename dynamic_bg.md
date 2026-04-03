# UI 规范 - 动态背景系统 (Dynamic Background System)

本文档整理了目前 ProcAgent 项目中使用的动态背景与毛玻璃效果（Soft Glassmorphism）规范，方便在后续新增的页面或组件中复用，确保全站视觉体感高度一致。

---

## 1. 核心网格呼吸渐变背景 (Global Mesh Gradient Breathe)

这是系统的全局底层背景。利用多重径向渐变（Radial Gradient）和背景位移动画（CSS Animation）结合，使得整个页面呈现缓慢、流动的“呼吸感”，避免纯色背景的单调。

### 📌 标准实现代码
已在 `globals.css` 全局下发生作用。如需移植至新页面独立容器，可使用以下规范：

```css
/* 全局挂载方案: 利用 ::before 避免影响子元素层级 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-image: 
    radial-gradient(at 0% 0%, #a7f3d0 0px, transparent 50%),
    radial-gradient(at 100% 0%, #fdba74 0px, transparent 50%),
    radial-gradient(at 100% 100%, #bfdbfe 0px, transparent 50%),
    radial-gradient(at 0% 100%, #fdfbf7 0px, transparent 50%);
  background-size: 200% 200%;
  animation: mesh-breathe 15s ease infinite alternate;
}

@keyframes mesh-breathe {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 100%; }
  100% { background-position: 0% 100%; }
}
```

**色值说明**：
- **`#a7f3d0`** (Emerald-200) - 左上方区域
- **`#fdba74`** (Orange-300) - 右上方区域
- **`#bfdbfe`** (Blue-200) - 右下方区域
- **`#fdfbf7`** (底层 Surface 浅色黄) - 左下角托底
- **融合逻辑**：各点分别延展 50% 变为透明，使得四种颜色在屏幕中央产生柔和重叠。

---

## 2. 玻璃态遮罩层 (Glassmorphism Overlays)

所有的主控容器面板都应当叠加在这个呼吸大背景之上，保持通透感。项目抛弃了沉重的不透明背景设定。

### 📌 标准实现代码
统一抽取为全局 class `.glass-panel`，在 JSX/TSX 中无需手写冗杂的 tailwind utilities。

```css
.glass-panel {
  background: var(--color-glass-bg); /* rgba(255, 255, 255, 0.4) */
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--color-glass-border); /* rgba(255, 255, 255, 0.6) */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}
```

**复用示例**：
```tsx
<div className="glass-panel flex flex-col p-6 rounded-3xl">
   {/* 内容块 */}
</div>
```

---

## 3. 工作画板暗纹点阵背景 (Dot-grid Canvas)

这套特殊背景针对 `Live View` 仿真画布、3D 可视化空间或绘图板。不仅不会覆盖下方的动态色彩，更强化了工业 / 工程感。

### 📌 标准实现代码
```tsx
{/* 绝对定位覆于画布底层 */}
<div
  className="absolute inset-0 opacity-[0.035] pointer-events-none"
  style={{
    backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  }}
/>
```
特征：使用 `#000` 黑色小圆点，超低透明度（`0.035`），`24px` 网格尺寸。

---

## 4. Agent 交互状态发光脉冲 (Agent Activity Pulsing)

在 AI 正在计算、生成代码或对 Live View 施加操作时使用的状态动画。

### 📌 标准实现代码
结合 Tailwind CSS 的通用脉冲态与发光阴影实现“呼吸提示”：

```tsx
// 1. 点状运行指示器 (如提示模型运行中的小点)
<div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />

// 2. 容器边框交互闪烁 (如 Live View 面板)
// 在对应的 div 增添判断条件：
className={`border transition-all duration-300 ${isAgentOperating ? "animate-pulse border-primary/40 shadow-[0_0_20px_rgba(0,0,0,0.05)]" : ""}`}
```

---

## 💡 开发复用避坑指南 (Best Practices)

1. **Z-Index 层级管理**：全局动态背景强制采用 `z-index: -1` 以防止它意外阻挡页面的点击交互。
2. **Backdrop-filter 嵌套性能**：避免在非常深的层级结构中多次重复嵌套 `backdrop-filter: blur(...)`，这会导致浏览器渲染丢帧。尽量在最外层（如 `Sidebar`、页面模块封装）使用一次 `.glass-panel`，内部的小组件多使用 `bg-white/40` 等半透明实色实现层级区分。
3. **响应式色彩变量**：任何背景覆盖尽量关联 `var(--color-surface)` 或 `var(--color-primary)`，这是为了给未来的深色模式（Dark Mode）拓展留出后路。
