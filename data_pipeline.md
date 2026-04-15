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
| 弹窗轮播功能 | Media Array | Carousel UI (Auto-switch) | 已通畅 | 封面图 2s -> GIF 循环切换，右下角胶囊指示器 |
| **模板应用→附件注入** | cases.json attachments[] | GradientInput attachments[] state | **已通畅（已修复）** | **根因：pills 嵌在 contentEditable 内，innerText赋值抹掉DOM；修复方案：将 pills 移至 contentEditable 外部独立 div，React 完全控制渲染** |

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
- [x] 实现详情弹窗轮播图功能：封面 2s -> GIF 切换，含指示器
- [x] 成功生成并补充负债率测试不通过案例（2020/2021/2022年财报图片，负债率分别设为96%/97%/98%）
- [x] **修复流程模拟模板应用后 PDF 附件未在输入框显示的问题**（将 attachment pills 从 contentEditable 内部移至外部独立 flex div，解耦 React 受控渲染与浏览器 contentEditable DOM 操作的冲突）

## 拖拽性能优化记录
- 移除了拖拽过程中的 CSS Transition，通过直接操作 DOM 样式属性避免了重绘延迟。
- 引入了 requestAnimationFrame 节流机制，确保状态更新与浏览器刷新频率同步。
