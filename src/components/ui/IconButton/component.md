# IconButton 组件说明

## 1. 组件定位
`IconButton` 是用于承载所有“单图标、无文字”操作指令的标准交互媒介。主要用于：顶部导航栏的设置/通知图标、各类卡片的 `more_vert` 更多操作下拉菜单等场景。

## 2. 交互特性
- 组件内置了标准的防打扰悬浮状态色（默认使用 `hover:bg-black/5` 面包屑光晕）。
- 内置了全局推崇的高层次物理触碰反馈 `active:scale-95`。

## 3. 可修改的范围参数 (Props)
- `icon` (string): 必填。依据全局引入的 `Google Material Symbols Outlined` 字符串绘制（如 `more_vert`, `settings`, `notifications`）。
- `iconClassName` (string): 用于给其内部的 icon 图标进行自由上色甚至缩放大小。默认继承 `text-on-surface-variant`。
- `className` (string): 可基于业务场景继续向包裹层外抛一些外边距，或根据宿主包裹层的颜色特点去覆写背景色行为。

## 4. 设计规范禁忌（不建议修改）
- **不要给组件硬编码绝对宽高度**：组件本身的响应度完全是由内置的 `p-2` 和图标骨架的大小撑开的，强制注入宽高会导致响应式布局变形。
- **不可剥夺自带的过渡动画机制**：动画过渡延迟 `duration-300` 与按压缩小是 UX 定义的全局呼吸节奏标准，不允许在各个局部页面中自行禁用。
