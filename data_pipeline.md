# ProcAgent 数据流演进记录

## 数据流向图
`Mouse Events` -> `Drag Handler (State/Ref Update)` -> `Panel Inline Styles (Width/Flex)` -> `Reflow`

## 环节数据详情

| 环节名称 | 输入数据格式 | 输出数据格式 | 处理节点是否通畅 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| 获取拖拽偏移量 | MouseEvent (clientX) | Delta X (number) | 已通畅 | 已增加 320px-700px 严格阈值 |
| 更新面板尺寸 | New Width (px/%) | CSS Style Update | 已通畅 | 禁用 Transition 消除抖动 |
| 窗口边界限制 | Target Width | Clamped Width | 已通畅 | 增加 Min-Width 逻辑与 items-stretch |
| Memory Update | Delta (number) | State (number) | 已通畅 | 采用极简协议，仅传递增量 |

## 当前已知问题
1. Live View 在宽度改变时发生整体缩放（可能是 transform: scale 或 aspect-ratio 导致）。
2. 面板在特定比例下发生纵向位移（可能是 container flex 布局的 align-items 或 gap 动态变化导致）。

## 任务状态
- [x] 故障修复：修正式 JSON 指令剥离正则 (ChatBubble)
- [x] 调研并确定拖拽逻辑实现方式 (SessionActiveView)
- [x] 修复 Live View 缩放问题（禁用拖拽状态下的 Transition 动画）
- [ ] 修复特定比例下窗口偏移及底部空隙问题
- [x] 增加最小宽度限制 (320px)，防止窗口无限收窄
- [ ] 验证拖拽平滑度及布局稳定性

## 拖拽性能优化记录
- 移除了拖拽过程中的 CSS Transition，通过直接操作 DOM 样式属性避免了重绘延迟。
- 引入了 requestAnimationFrame 节流机制，确保状态更新与浏览器刷新频率同步。
