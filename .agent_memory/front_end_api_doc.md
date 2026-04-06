# ProcAgent 前端 API 对接与后端架构建议文档

本文档旨在规范 ProcAgent 从前端 Mock 数据向后端真实环境迁移的接口设计，确保数据流、实时状态与 UI 交互的深度契合。

---

## 1. 系统架构与通信机制

*   **RESTful API**: 用于管理类操作（项目、会话、用户、设置、文件上传等）。
*   **WebSocket / SSE**: 用于长时任务进度、LiveView 状态同步、记忆更新通知及红点提醒。
*   **VNC over WebSocket**: 专门用于 LiveView 的画面传输。

---

## 2. 核心数据模型 (Data Models)

### 2.1 用户与会员 (User & Membership)
*   **字段**:
    *   `id`: UUID
    *   `username`: string (展示名, 示例: "Kuku 管理员")
    *   `avatar_url`: string (头像图片地址)
    *   `plan`: enum (`free`, `pro`) - 影响标题栏 Badge 展示。
    *   `credits`: float - 当前剩余点数。
*   **UI 映射**: 标题栏右侧用户菜单及状态展示。

### 2.2 项目 (Project)
*   **字段**:
    *   `id`: UUID
    *   `name`: string (项目标题)
    *   `type`: enum (`simulation` 仿真模拟, `piping` 3D 配管)
    *   `thumbnail_url`: string (项目预览图)
    *   `created_at`: timestamp
    *   `updated_at`: timestamp - **关键字段**，用于工作区列表排序。
*   **UI 映射**: 首页项目卡片及列表。

### 2.3 会话 (Session)
*   **字段**:
    *   `id`: UUID
    *   `project_id`: UUID (外键)
    *   `name`: string (示例: "Session 1")
    *   `updated_at`: timestamp - 用于侧边栏历史记录列表排序。
*   **UI 映射**: 工作区侧边栏“最近项目”/“历史记录”。

### 2.4 业务模板 (Templates)
*   **字段**:
    *   `id`: UUID
    *   `business_type`: enum (`simulation`, `piping`)
    *   `title`: string (示例: "稳态模型建立")
    *   `description`: string (简短描述)
    *   `modal_image_url`: string (弹窗内的高清预览图)
    *   `modal_content`: string (弹窗详细文字介绍)
*   **UI 映射**: 模板选择页面及点击后的详情预览弹窗。

---

## 3. 关键业务接口 (API Definition)

### 3.1 历史会话列表 (Session History)
*   **Endpoint**: `GET /api/projects/{projectId}/sessions`
*   **逻辑**: 需按 `updated_at` 倒序返回，前端据此渲染侧边栏列表。

### 3.2 动态命令列表 (Slash Commands)
*   **Endpoint**: `GET /api/commands?context={page|session}`
*   **返回示例**:
    ```json
    [
      {"command": "/analyze", "description": "Analyze current context"},
      {"command": "/optimize", "description": "Optimize performance"}
    ]
    ```
*   **UI 映射**: 输入框按下 `/` 时显示的命令浮窗。

### 3.3 关键参数空间 (Key Parameters)
*   **Endpoint**: `GET /api/projects/{projectId}/parameters`
*   **数据格式**:
    ```json
    {
      "PROCESS_PARAMS": [
        {"label": "FEED FLOW", "value": "1,240", "unit": "m³/h"},
        {"label": "OPERATING PRESSURE", "value": "3.2", "unit": "MPa"}
      ],
      "EQUIPMENT_PARAMS": [...]
    }
    ```
*   **UI 映射**: 工作区“关键参数” Tab 下的自适应网格。

*   **逻辑**: WebSocket 实时推送新消息，触发标题栏铃铛红点显示。
*   **Endpoint (History)**: `GET /api/notifications?page={n}`
*   **Endpoint (Mark as Read)**: `POST /api/notifications/{id}/read`
*   **Endpoint (Mark All Read)**: `POST /api/notifications/read-all`

### 3.5 项目成员管理 (Project Membership)
*   **Endpoint (List)**: `GET /api/projects/{projectId}/members`
*   **Endpoint (Invite)**: `POST /api/projects/{projectId}/invite` (Body: `{ "email": "string" }`)
*   **Endpoint (Remove)**: `DELETE /api/projects/{projectId}/members/{userId}`

### 3.6 全局搜索 (Global Search)
*   **Endpoint**: `GET /api/search?q={query}` (聚合搜索项目、会话、文件)

### 3.7 项目级操作 (Project Operations)
*   **Endpoint (Duplicate)**: `POST /api/projects/{id}/duplicate`
*   **Endpoint (Delete)**: `DELETE /api/projects/{id}`

---

## 4. 实时交互协议 (Real-time Spec)

### 4.1 Agent 任务流进度 (WebSocket Topic: `task_progress`)
*   **推送内容**:
    ```json
    {
      "task_id": "...",
      "status": "in-progress",
      "current_step": 3,
      "total_steps": 8,
      "sub_task_name": "解析业务需求...",
      "is_finished": false
    }
    ```
*   **UI 映射**: AI 回复中的 `AgentTaskProgress` 动效卡片。

### 4.2 LiveView 状态机 (WebSocket Topic: `live_view_status`)
*   **状态枚举**:
    *   `agent-operating`: Agent 运行中（触发边框流光动效）
    *   `needs-intervention`: 需要介入（触发红色警示及全局弹窗）
*   **浏览器级反馈 (Alerts & Audio)**:
    - **需要介入 (`needs-intervention`)**:
        - **音频**: 自动播放报警音 (路径: `/audio/need-human-in-loop.wav`)。
        - **通知**: 触发 `Notification API` 弹出浏览器级系统警告。
        - **UI**: 强制挂载全屏红色警示 Overlay，通过弹窗提醒用户。
    - **任务完成 (任务成功结束)**:
        - **音频**: 播放成功音 (路径: `/audio/task_completed.wav`)。
        - **通知**: 触发浏览器级成功通知提醒。
*   **逻辑**: 后端根据运行环境状态实时主动推送，前端据此触发音效与通知。

### 4.3 隐式指令协议 (Implicit Action Protocol)
*   **传输媒介**: 消息正文 `content` 字段。
*   **协议格式**: 在文本中嵌入特定的 JSON 块，例如 `{"action": "routing_new_project"}`。
*   **渲染行为**:
    - **文字过滤**: 前端渲染时会自动识别并剥离 JSON 全文，用户在气泡中看不见原始代码。
    - **零文本支持**: 若消息内容仅由 JSON 构成，则隐藏对话气泡，直接显示功能卡片。
    - **组件映射**: 映射至 `ProjectRoutingCard`。

*   **前台状态**: 点击“GET STARTED”或“APPLY”按钮后，前端会利用 `next/navigation` 的 `useRouter` 进行平滑跳转，引导用户前往项目管理页面进行环境重置或新建。

#### 4.3.2 记忆已更新 (Memory Update Feed - Minimalist)
*   **触发场景**: 当 AI 完成知识库更新、参数识别或根据用户指令（如“记住这些参数”）执行持久化操作后，通过该协议进行非侵入式通知。
*   **JSON 结构**:
    ```json
    {
      "action": "memory_update"
    }
    ```
*   **渲染行为**:
    - **组件挂载**: 在当前 AI 回复气泡下方自动挂载 `MemoryUpdatedCard`。
    - **文案策略**: 前端优先调用 `LanguageContext` 中的标准本地化词条（如：“记忆已更新”），确保 UI 简洁一致。
*   **开发建议**: 后端无需在消息文本中显式说明“已记住”，只需拼入此指令块，前端即会通过高保真磨砂卡片形式优雅呈现。

### 4.4 OpenAI 标准思维过程协议 (Streaming Thinking Protocol)
*   **协议标准**: 兼容 OpenAI API /v1/chat/completions 的 SSE 流式输出。
*   **流式字段映射**:
    - `delta.reasoning_content` (或 `delta.thinking`): AI 正在进行的思维流。
    - `delta.content`: AI 最终生成的回答流。
*   **渲染行为与状态机**:
    - **思维阶段 (Thinking Phase)**: 
        - 当前端收到 `reasoning_content` 块时，自动展开 `ThinkingBlock` 面板。
        - **视觉效果**: 文字应用 `animate-thinking-shimmer` 流光扫描效果，配合状态行显示 "Thinking..."。
    - **内容阶段 (Answering Phase)**: 
        - 当收到第一个 `content` 块或 `reasoning_content` 结束时，前端会自动执行 **思维面板折叠动画**。
        - 随后在主气泡中开始渲染最终回答。
*   **交互逻辑**: 已折叠的思维过程支持用户点击标题手动二次展开查看。

---

---

## 6. 其他业务接口

*   **前端行为**: 提交成功后触发全局 `successAlert` 提示，并记录本地标志位避免重复申请。

### 6.2 用户个人资料更新 (User Profile)
*   **Endpoint (Update Name)**: `POST /api/user/profile/name`
*   **请求 Body**: `{ "name": "string" }`
*   **成功响应**: `{"success": true, "updatedName": "string"}`
*   **UI 映射**: 用户菜单中的“修改名称”极简弹窗。

---

## 7. 实现细节与逻辑说明

1.  **指令剥离算法**: 前端使用 `\{[\s\S]*\}` (贪婪模式) 正则表达式捕获内容中完整的 JSON 块。解析成功后，该块将从 `content` 中被物理移除。这意味着后端可以安全地在消息末尾追加指令，而不会干扰正常的文本显示。
2.  **气泡隐藏逻辑**: 若 `cleanContent` 长度为 0，则该消息不渲染传统的 `ChatBubble` 磨砂底色框，仅渲染卡片。
3.  **思维过程状态处理**: 前端通过拦截 SSE 的 `delta` 数据包，实时计算 `status` (thinking | completed)，动态驱动 UI 状态机的切换。
4.  **记忆已更新 (Memory Update)**: 当后端分析完附件或完成任务后，推送类型为 `memory_update` 的通知，前端弹出 `MemoryUpdatedCard`。
5.  **状态感知与反馈**: 若 `live_view_status` 变为 `needs-intervention` 或任务圆满完成，前端需立刻触发浏览器级通知声效并弹出确认提示，确保用户感知。

---

> [!IMPORTANT]
> 所有的附件上传应支持分片上传，并需在上传完成后触发后端解析，解析完成后通过 WebSocket 通知前端更新文件状态。
