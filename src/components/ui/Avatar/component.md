# Avatar 组件说明

## 1. 组件定位
`Avatar` 是用于展示用户或实体头像的基础组件，遵循圆角层次规范中的“极致圆润 (Full Radius)”标准。

## 2. 搭配方式与应用场景
- **用户标识**：在导航栏、评论区或项目成员列表中展示。
- **首字母回退**：当没有提供图片时，自动显示名称首字母。

## 3. 可修改的范围参数 (Props)
- `name` (string): 用户名称，用于生成初始值和 alt 文本。
- `image` (string, 可选): 头像图片的 URL。
- `bgClass` (string, 默认: `bg-primary/20`): 背景色类名。
- `sizeClass` (string, 默认: `w-6 h-6`): 尺寸类名。
- `className` (string): 额外的包装类名。

## 4. 设计规范禁忌（不建议修改）
- **形状**：必须保持 `rounded-full` 形状。
- **字体**：首字母使用 `font-bold tracking-tight` 以保持视觉一致性。
