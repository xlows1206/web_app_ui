# EmphasisButton 组件说明

## 1. 组件定位
`EmphasisButton` 是全站唯一合法的高转化率行动入口按钮，遵循全局设计规范 §6。它通过品牌渐变色（#C4D2FF → #474DB3）吸引用户注意力。

## 2. 搭配方式与应用场景
- **核心 CTA**：如“升级”、“购买”、“创建项目”、“保存并保存”等关键操作。
- **模态框确认**：作为弹窗中的主操作按键。

## 3. 可修改的范围参数 (Props)
- `children` (ReactNode): 按钮文字或图标内容。
- `onClick` (function): 点击回调。
- `shimmer` (boolean, 默认: `true`): 是否启用悬浮流光扫过动效。
- `fullWidth` (boolean, 默认: `false`): 是否撑满容器。
- `disabled` (boolean): 禁用状态。

## 4. 设计规范禁忌（不建议修改）
- **颜色方案**：严禁修改 `bg-gradient-to-r` 的色值，必须保持品牌主题渐变。
- **圆角与交互**：遵循 `rounded-lg` (8px) 和 `active:scale-95` 的点击反馈。
- **排版**：强制使用 `font-bold tracking-tight`。
