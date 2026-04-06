"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Maximize2, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AIChatBox from "@/components/ui/AIChatBox";
import RemoteDesktopView from "@/components/ui/RemoteDesktopView";
import WorkspaceNav from "@/components/layout/WorkspaceNav";
import DraggableDivider from "@/components/ui/DraggableDivider";
import PaneHeader from "@/components/ui/PaneHeader";
import SessionWorkspaceSidebar from "@/components/ui/SessionWorkspaceSidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import NotificationPermissionModal from "@/components/modals/NotificationPermissionModal";
import { useFileWorkspace } from "@/hooks/useFileWorkspace";
import AssistantPanel from "@/components/ui/AssistantPanel";
import LiveViewPanel from "@/components/ui/LiveViewPanel";

type LiveViewState = "disconnected" | "connected" | "agent-operating" | "needs-intervention";

interface SessionActiveViewProps {
  projectId: string;
  sessionId: string;
  projectName: string;
  type: string;
}

export default function SessionActiveView({
  projectId,
  sessionId,
  projectName,
  type
}: SessionActiveViewProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const {
    projectFiles,
    attachments,
    uploadFiles,
    removeFile,
    removeAttachment,
    clearAttachments,
    toggleContext,
    renameFile
  } = useFileWorkspace([
    { id: "f1", name: "shift.pdf", size: "129.3 KB", type: "pdf" },
    { id: "f2", name: "原料工况.pdf", size: "42.9 KB", type: "pdf" },
    { id: "f3", name: "流程说明.pdf", size: "54.3 KB", type: "pdf" }
  ]);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveViewState, setLiveViewState] = useState<LiveViewState>("disconnected");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [paneWidth, setPaneWidth] = useState(550);
  const [minimizedPanels, setMinimizedPanels] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioStart = useRef<HTMLAudioElement | null>(null);
  const audioComplete = useRef<HTMLAudioElement | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isTabFlashing, setIsTabFlashing] = useState(false);

  useEffect(() => {
    setMessages([{ id: "sys-1", role: "assistant", content: t.document.welcomeBack }]);
    audioStart.current = new Audio("/audio/task_completed.wav");
    audioComplete.current = new Audio("/audio/need-human-in-loop.wav");
    
    // Request notification permission on mount if needed
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(() => setShowNotificationModal(true), 1500);
    }
  }, []);

  // Handle Real-time Status Alerts (Audio & Notifications)
  const lastState = useRef<LiveViewState>(liveViewState);
  useEffect(() => {
    if (liveViewState === "needs-intervention") {
      audioComplete.current?.play().catch(() => {});
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Attention Required", { body: "ProcAgent needs your manual intervention.", icon: "/favicon.ico" });
      }
    } else if (lastState.current === "agent-operating" && liveViewState === "connected") {
      // Task finished successfully
      audioStart.current?.play().catch(() => {});
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Task Completed", { body: "The automated process has finished successfully.", icon: "/favicon.ico" });
      }
    }
    lastState.current = liveViewState;
  }, [liveViewState]);

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => uploadFiles(e.target.files);

  const notifyAIReply = (message: string) => {
    setIsTabFlashing(true);
    audioComplete.current?.play().catch(() => {});
  };

  const handleSend = async (forcedText?: string) => {
    const text = forcedText || input;
    if (!text || text.trim() === "" || isGenerating) return;

    if (text.includes("执行任务")) {
      const taskId = Date.now().toString();
      const assistantId = (Date.now() + 1).toString();
      const initialSubTasks: any[] = [
        { id: "st1", name: "环境初始化", status: "in-progress" },
        { id: "st2", name: "加载项目元数据", status: "pending" },
        { id: "st3", name: "解析业务需求", status: "pending" },
        { id: "st4", name: "同步资产库", status: "pending" },
        { id: "st5", name: "生成代码框架", status: "pending" },
        { id: "st6", name: "自动化测试与扫描", status: "pending" },
        { id: "st7", name: "云端测试沙盒部署", status: "pending" },
        { id: "st8", name: "验证最终输出结果", status: "pending" }
      ];

      setMessages(prev => [...prev, 
        { id: taskId, role: "user", content: text }, 
        { id: assistantId, role: "assistant", content: "执行中...", agentTask: { title: "智能业务流程自动化执行", subTaskName: "环境初始化...", current: 1, total: 8, isFinished: false, subTasks: initialSubTasks } }
      ]);
      setInput("");
      setIsGenerating(true);
      
      let currentStep = 1;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= 8) {
          setMessages(prev => prev.map(msg => {
            if (msg.id === assistantId && msg.agentTask) {
              const updatedSubTasks = msg.agentTask.subTasks?.map((st: any, idx: number) => {
                if (idx < currentStep - 1) return { ...st, status: "completed" };
                if (idx === currentStep - 1) return { ...st, status: "in-progress" };
                return st;
              });
              return { ...msg, agentTask: { ...msg.agentTask, current: currentStep, subTaskName: initialSubTasks[currentStep - 1].name + "...", subTasks: updatedSubTasks } };
            }
            return msg;
          }));
        } else {
          clearInterval(interval);
          setMessages(prev => prev.map(msg => {
            if (msg.id === assistantId && msg.agentTask) {
              return { ...msg, agentTask: { ...msg.agentTask, isFinished: true, subTaskName: "任务已全部完成", subTasks: msg.agentTask.subTasks.map((st: any) => ({ ...st, status: "completed" })) } };
            }
            return msg;
          }));
          setIsGenerating(false);
          notifyAIReply("自动化任务执行已圆满完成！");
        }
      }, 2000);
      return;
    }

    const assistantId = Date.now().toString() + "-ai";
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: "user", content: text },
      { id: assistantId, role: "assistant", content: "", reasoning_content: "", status: "thinking" }
    ]);
    
    setInput("");
    clearAttachments();
    setIsGenerating(true);

    // 1. 开始推理 (Streaming Reasoning)
    setTimeout(() => {
      const fullReasoning = "正在分析项目上下文...\n检测到用户提交了关于 " + text + " 的指令。\n正在根据 Editorial Pulse 规范检索相关 UI 组件...\n准备生成符合磨砂玻璃风格的处理方案。";
      let rIndex = 0;
      
      const reasoningInterval = setInterval(() => {
        rIndex += 5;
        const currentReasoning = fullReasoning.slice(0, rIndex);
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, reasoning_content: currentReasoning } : m));
        
        if (rIndex >= fullReasoning.length) {
          clearInterval(reasoningInterval);
          
          setTimeout(() => {
            let fullContent = t.document.processedMsg.replace("{text}", text) + "\n\n我已经根据您的要求完成了相关属性的识别与更新，您可以查看右侧 Live View 获取实时渲染结果。";
            
            // Mock Trigger for Memory Update
            if (text.includes("记住")) {
              fullContent += `\n\n{"action": "memory_update"}`;
            }

            let cIndex = 0;
            
            const contentInterval = setInterval(() => {
              cIndex += 3;
              const currentContent = fullContent.slice(0, cIndex);
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: currentContent } : m));
              
              if (cIndex >= fullContent.length) {
                clearInterval(contentInterval);
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, status: "completed" } : m));
                setIsGenerating(false);
                notifyAIReply(fullContent);
              }
            }, 30);
          }, 400);
        }
      }, 50);
    }, 500);
  };

    const startDragging = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      document.documentElement.classList.add('resizing-col');
    };

    const startDraggingSidebar = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDraggingSidebar(true);
      document.documentElement.classList.add('resizing-col');
    };

    useEffect(() => {
      let animationFrameId: number;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging && !isDraggingSidebar) return;
        
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          const totalWidth = window.innerWidth;
          const sidebarActualWidth = isSidebarExpanded ? sidebarWidth : 72;
          const minAssistantWidth = 320;
          const dividerWidth = 12; // Approximation of the interactive zone for dividers

          if (isDraggingSidebar) {
            // Sidebar resizing: don't squeeze the Assistant + LiveView too much
            const maxSidebarWidth = totalWidth - (320 + 320 + dividerWidth * 2); 
            const newWidth = Math.max(280, Math.min(maxSidebarWidth, e.clientX));
            setSidebarWidth(newWidth);
          } else if (isDragging) {
            // Main Pane resizing: ensure Assistant panel stays at least 320px
            const newRightWidth = totalWidth - e.clientX;
            const maxRightWidth = totalWidth - sidebarActualWidth - minAssistantWidth - (dividerWidth * 2);
            setPaneWidth(Math.max(320, Math.min(maxRightWidth, newRightWidth)));
          }
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setIsDraggingSidebar(false);
        document.documentElement.classList.remove('resizing-col');
        cancelAnimationFrame(animationFrameId);
      };

      if (isDragging || isDraggingSidebar) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        cancelAnimationFrame(animationFrameId);
      };
    }, [isDragging, isDraggingSidebar]);

  const toggleMinimize = (panelId: string) => {
    setMinimizedPanels(prev => prev.includes(panelId) ? prev.filter(id => id !== panelId) : [...prev, panelId]);
  };

  const handleAllowNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Notifications Enabled", { body: "You will now receive updates for task status." });
      }
    }
    setShowNotificationModal(false);
  };

  const parameterData = require("@/data/parameter_memory.json");
  const [activeParamCategory, setActiveParamCategory] = useState(Object.keys(parameterData)[0] || "");
  const statusLabels: any = { "connected": t.document.connected, "agent-operating": t.document.agentOperating, "needs-intervention": t.document.needsIntervention, "disconnected": t.document.disconnected };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden text-on-surface bg-transparent z-10">
      <WorkspaceNav title={projectName} onBack={() => router.push(`/chat?project_id=${projectId}`)} />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />

      <div className="flex-1 flex items-stretch overflow-hidden w-full relative px-0.5 gap-0 pt-2 pb-2">
        <SessionWorkspaceSidebar 
          isExpanded={isSidebarExpanded}
          onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          width={sidebarWidth}
          activeSessionId={sessionId}
          projectFiles={projectFiles}
          attachments={attachments}
          onAddAttachment={toggleContext}
          onRenameFile={renameFile}
          onRemoveFile={removeFile}
          onUploadClick={handleUploadClick}
          parameterData={parameterData}
          activeParamCategory={activeParamCategory}
          onCategoryChange={setActiveParamCategory}
          messages={messages}
          isResizing={isDragging || isDraggingSidebar}
        />

        <DraggableDivider onDragStart={startDraggingSidebar} />

        <main className="flex-1 flex flex-col overflow-hidden relative z-10 outline-none">
          <div className="flex-1 flex items-stretch gap-0 h-full overflow-hidden min-h-0">
             <AssistantPanel 
                isMinimized={minimizedPanels.includes('assistant')}
                onMinimize={() => toggleMinimize('assistant')}
                onExpand={() => toggleMinimize('assistant')}
                isResizing={isDragging || isDraggingSidebar}
             >
                <AIChatBox 
                  messages={messages.map(m => ({ ...m, time: "10:00 AM" }))} 
                  input={input} 
                  onInputChange={setInput} 
                  onSend={() => handleSend()} 
                  onStop={() => setIsGenerating(false)} 
                  isGenerating={isGenerating} 
                  attachments={attachments} 
                  onRemoveAttachment={removeAttachment} 
                  className="bg-transparent" 
                  projectFiles={projectFiles} 
                  onAddAttachment={toggleContext} 
                />
             </AssistantPanel>

              {!minimizedPanels.includes('liveview') && <DraggableDivider onDragStart={startDragging} />}
             
             <LiveViewPanel
                isMinimized={minimizedPanels.includes('liveview')}
                onMinimize={() => toggleMinimize('liveview')}
                onExpand={() => toggleMinimize('liveview')}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                liveViewState={liveViewState}
                statusLabel={statusLabels[liveViewState]}
                paneWidth={Math.max(320, paneWidth)}
                isResizing={isDragging || isDraggingSidebar}
             >
                <RemoteDesktopView 
                  isLive={true} 
                  status={liveViewState} 
                  isResizing={isDragging || isDraggingSidebar}
                />
             </LiveViewPanel>
          </div>
        </main>
      </div>

      <NotificationPermissionModal isOpen={showNotificationModal} onClose={() => setShowNotificationModal(false)} onAllow={handleAllowNotifications} />
    </div>
  );
}
