# ProcAgent 组件库清单 (Component List)

本文档旨在记录 ProcAgent SaaS 工作台目前已工程化提取及封装的所有 React 组件信息，供团队开发者参考与复用。所有的组件都遵循「Neural Architectures」极简工业风设计规范与双语 (i18n) 适配。

---

## 一、基础卡片与独立元素 (UI Components)
所在目录: `src/components/ui/` 等相关卡片级组件定义区

| 组件名称 | 文件路径 | 组件说明 | 所在页面 / 关联模块 |
| :--- | :--- | :--- | :--- |
| **ProjectCard** | `ui/ProjectCard/index.tsx` | 定制化的 Bento 风格大号业务实体卡片。内含顶级数据结构的展示流层（如 `3D PIPING` 等静态业务标签在标题下方），采用了带有毛玻璃高光属性底色与锁定 `rounded-[24px]` 的容器边界，专为高价值核心资源设计。附带了独立三点菜单交互。 | `workspace/ActiveProjectsSection` |
| **TemplateCard** | (渲染自 `workspace/TemplatesSection.tsx`) | 横屏展示的极简流式模版缩略实体。内置了对 hover 状态精细控制的悬停动作：“查看模版 (View Template)”。其图标颜色与静态标签体系同样遵循大红大紫去高饱和度的 `Neural Architectures` 原则。 | `workspace/TemplatesSection` |
| **TemplateDetailModal** | `workspace/TemplateDetailModal.tsx` | 32px 大圆角的沉浸式详情弹窗。挂载在模版卡片之上，提供高精度的仿真截图预览环境以及技术指标呈现，包含单一的操作闭环功能。 | `workspace/TemplatesSection` (内部唤起) |
| **ProjectMembersModal** | `ui/ProjectCard/ProjectMembersModal.tsx` | 项目级别的行政管理弹窗。响应用户成员管理的诉求，具备包含移除特定用户及拷贝加密分享链接在内的完整角色指引管理功能。 | `ui/ProjectCard` (内部唤起) |
| **AvatarGroup** | `ui/AvatarGroup/index.tsx` | 支持多用户头像叠放的组件，带 `overflow` 计数收拢功能。用于呈现参与此协作工作流的用户拥挤度。 | `ui/ProjectCard` |
| **Badge** | `ui/Badge/index.tsx` | 轻量化、结构极高解耦的属性贴纸。广泛活跃于所有主副页面用来标示产品特征（比如 `outline` 的 "NEW"）。 | 跨卡片复用 |
| **IconButton** | `ui/IconButton/index.tsx` | 确保全网孤立功能按钮均带标准的悬浮扩散（hover bg）以及 `scale-95` 物理点击下压感官的标准封装壳。 | `TopNav`, `ProjectCard` |

---

## 二、全局核心框架组件 (Core Layouts)
所在目录: `src/components/layout/` & `src/components/workspace/`

| 组件名称 | 文件路径 | 组件说明 | 所在页面 / 关联模块 |
| :--- | :--- | :--- | :--- |
| **TopNav** | `layout/TopNav.tsx` | 全盘工作台导航塔台。承载：左侧品标、中右侧带有紫变幻高光的极简 `AI Credit` 显示槽（去汉字，仅留数字余额 5.00及星标）、消息抽屉及功能完善的用户登出/i18n切换个人中心面板。 | 全局挂载 |
| **ActiveProjectsSection** | `workspace/ActiveProjectsSection.tsx` | 用户活跃工作流核心呈现区。采用高配版灰石青配色 ("New Project" 按钮变灰蓝变体)，并通过栅格向前端源源不断提供 `ProjectCard`。 | `app/page.tsx` |
| **TemplatesSection** | `workspace/TemplatesSection.tsx` | 置顶级业务起始池容器。该组件提供横向滚动滑轨并绑定带有全底边框下划线特效的“更多模板”引导链，同时全量承载与管控内部 `TemplateCard` 和预览模态窗的状态。 | `app/page.tsx` |
| **BentoUtilitySection** | `workspace/BentoUtilitySection.tsx` | 统计业务面板集合。承接所有结构化较强且高密度的数据展现诉求（云盘监控、数据分析指标等），组成整个 SaaS 沉浸面板的视觉托底。 | `app/page.tsx` |

---

## 三、上下文与状态机制 (Context)
所在目录: `src/contexts/`

| 组件/服务名称 | 文件路径 | 组件说明 | 所在页面 / 关联模块 |
| :--- | :--- | :--- | :--- |
| **LanguageContext** | `LanguageContext.tsx` | React Context 全局状态管理引擎。驱动整个工作台在英文 (`en`) 与中文 (`zh`) 环境间的无缝热切换。收拢了超过 90% 的业务文本字典（含系统预置的参数化模板）。 | `layout/TopNav.tsx` 以及所有子组件 |

---

> _如果团队有新加入的成员，请在首次提交代码前仔细阅读上述组件说明，避免因为重复造轮子而破坏“Neural Architectures”一致性设计法则。_
