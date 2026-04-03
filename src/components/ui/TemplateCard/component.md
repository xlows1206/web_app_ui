# TemplateCard 组件说明

## 1. 组件定位
`TemplateCard` 用于在模板库或创建流程中展示预设的项目模板。它采用了创新的两层交互设计：默认展示简洁信息，Hover 时切换至包含“预览”和“应用”操作的模糊层。

## 2. 搭配方式与应用场景
- **模板列表页**：横向滚动或网格布局。
- **新建引导**：在创建项目的初始步骤中展示。

## 3. 可修改的范围参数 (Props)
- `template` (Template对象): 包含标题、描述、分类等信息的对象。
- `onClick` (function): 卡片点击逻辑（通常为查看详情）。
- `onApply` (function, 可选): 直接应用模板的逻辑。
- `viewLabel` (string): “查看”按钮的国际化文本。
- `applyLabel` (string, 可选): “应用”按钮的国际化文本。
- `newLabel` (string): “NEW”标签的国际化文本。

## 4. 设计规范禁忌（不建议修改）
- **圆角**：遵循次级嵌套容器标准 `rounded-xl` (12px)。
- **交互逻辑**：Hover 时的 `backdrop-blur-sm` 透明遮罩层是核心识别特征，不应移除。
