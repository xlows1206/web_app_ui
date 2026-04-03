# AttachmentCard 组件说明

## 1. 组件定位
`AttachmentCard` 用于展示上传的文件或关联附件，遵循全局设计规范 §8。它通过紧凑的网格形式展示文件基本信息（名称、大小、类型），并提供预览、下载和删除等操作。

## 2. 搭配方式与应用场景
- **文件列表**：在项目详情页或文档工作区的附件栏中使用。
- **上传预览**：在文件上传过程中或上传完成后作为状态展示。

## 3. 可修改的范围参数 (Props)
- `id` (string): 附件的唯一标识符。
- `name` (string): 文件名称。
- `size` (number): 文件大小（字节），组件会自动格式化。
- `type` (string): MIME 类型，用于映射图标（如 `image/*`, `application/pdf`）。
- `onRemove` (function): 删除回调。
- `onPreview` (function, 可选): 预览回调。
- `onDownload` (function, 可选): 下载回调。

## 4. 设计规范禁忌（不建议修改）
- **圆角规格**：强制使用 `rounded-[24px]` 以符合顶级核心容器规范。
- **交互反馈**：内置了 `hover:border-primary/30` 和 `active:scale-[0.98]` 的物理手感，不建议自行覆盖。
- **图标风格**：统一使用 `Lucide` 库并应用预设的描边粗细 (`strokeWidth={2.5}`)。
