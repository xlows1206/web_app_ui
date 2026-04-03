"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Play, FileText, X, WifiOff, Wifi, Maximize2, RefreshCw, Activity as TypeIcon, Activity, Box, MessageSquare, Paperclip, FileSpreadsheet, FileArchive, FileImage, FileJson, FileCode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import StatusBadge from "@/components/ui/StatusBadge";
import IconButton from "@/components/ui/IconButton";
import AIChatBox from "@/components/ui/AIChatBox";
import GradientInput from "@/components/ui/GradientInput";
import Portal from "@/components/ui/Portal";
import RemoteDesktopView from "@/components/ui/RemoteDesktopView";
import { formatTimeAgo } from "@/lib/timeUtils";
import WorkspaceNav from "@/components/layout/WorkspaceNav";
import NotificationPermissionModal from "@/components/modals/NotificationPermissionModal";
import SessionHistoryList from "@/components/ui/SessionHistoryList";
import KeyParameterPanel from "@/components/ui/KeyParameterPanel";
import AttachmentCard from "@/components/ui/AttachmentCard";

type LiveViewState = "disconnected" | "connected" | "agent-operating" | "needs-intervention";

import { getFileIconInfo } from "@/lib/fileUtils";
import { type AgentTaskStatus } from "@/components/AgentTaskProgress";

// Types for Chat
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isRoutingCard?: boolean;
  isMemoryCard?: boolean;
  agentTask?: AgentTaskStatus;
};

export default function SessionPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [projectId, setProjectId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  
  const searchParams = useSearchParams();
  const [projectSessions, setProjectSessions] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("Project Workspace");
  const [type, setType] = useState<string>("simulation");
  const [cases, setCases] = useState<any[]>(t.projects.simulationCases);

  const loadContext = () => {
    // Prioritize URL search parameters for a route-driven experience
    const urlProjectId = searchParams.get("project_id");
    const urlSessionId = searchParams.get("session_id");

    const activeProject = urlProjectId || localStorage.getItem("procagent_active_project_id") || "";
    const activeSession = urlSessionId || localStorage.getItem("procagent_active_session_id") || "";
    
    setProjectId(activeProject);
    setSessionId(activeSession);

    const saved = localStorage.getItem("procagent_projects");
    if (saved && activeProject) {
      const p = JSON.parse(saved).find((proj: any) => proj.id === activeProject);
      if (p) {
         setProjectName(p.name);
         setType(p.type || "simulation");
         setCases(p.type === "piping" ? t.projects.pipingCases : t.projects.simulationCases);
         setProjectSessions(p.sessions || []);
      }
    }

    // Default: Load all project documents if it's a new context (Sandbox)
    if (!urlSessionId && !activeSession) {
      setAttachments(prev => {
        // Only set if different to avoid infinite loop or flickering
        return [...projectFiles];
      });
    }
  };

  useEffect(() => {
    loadContext();
  }, [searchParams, t]);

  useEffect(() => {
    const handleUpdate = () => loadContext();
    window.addEventListener("procagent_context_updated", handleUpdate);
    window.addEventListener("procagent_project_updated", handleUpdate);
    return () => {
      window.removeEventListener("procagent_context_updated", handleUpdate);
      window.removeEventListener("procagent_project_updated", handleUpdate);
    };
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [projectFiles, setProjectFiles] = useState<any[]>([
    { id: "f1", name: "shift.pdf", size: "129.3 KB", type: "pdf" },
    { id: "f2", name: "原料工况.pdf", size: "42.9 KB", type: "pdf" },
    { id: "f3", name: "流程说明.pdf", size: "54.3 KB", type: "pdf" }
  ]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showCasePopup, setShowCasePopup] = useState<any>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"chat" | "assets">("chat");
  const isInitialRedirect = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSwitchSession = (id: string) => {
    setSessionId(id);
    router.push(`/chat?project_id=${projectId}&session_id=${id}`);
  };

  const handleNewSession = () => {
    router.push(`/chat?project_id=${projectId}`);
  };

  const handleRemoveAttachment = (id: string) => {
    // This is DESELECT for session, not global delete
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleRemoveProjectFile = (id: string) => {
    // This is GLOBAL DELETE
    setProjectFiles(prev => prev.filter(a => a.id !== id));
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map(file => ({
      id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type.split('/')[1] || 'other'
    }));

    setProjectFiles(prev => [...prev, ...newFiles]);
    setAttachments(prev => [...prev, ...newFiles]);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddToContext = (id: string) => {
    const file = projectFiles.find(f => f.id === id);
    if (file && !attachments.some(a => a.id === id)) {
      setAttachments(prev => [...prev, file]);
    }
  };

  const handleRenameProjectFile = (id: string) => {
    const file = projectFiles.find(f => f.id === id);
    if (!file) return;

    const newName = window.prompt(t.common.rename, file.name);
    if (newName && newName.trim() !== "" && newName !== file.name) {
      setProjectFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
      // Also update in current attachments if present
      setAttachments(prev => prev.map(a => a.id === id ? { ...a, name: newName } : a));
    }
  };

  useEffect(() => {
    // If we just redirected from a send action, don't clear the messages
    if (isInitialRedirect.current) {
      isInitialRedirect.current = false;
      return;
    }

    if (sessionId) {
       setMessages([{ id: "sys-1", role: "assistant", content: t.document.welcomeBack }]);
    } else {
       setMessages([]);
    }
  }, [sessionId, projectId]);
  // Live View states
  const [liveViewState, setLiveViewState] = useState<LiveViewState>("disconnected");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    if (isFullscreen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);

  const cycleStatus = () => {
    const states: LiveViewState[] = ["disconnected", "connected", "agent-operating", "needs-intervention"];
    const currentIndex = states.indexOf(liveViewState);
    const nextIndex = (currentIndex + 1) % states.length;
    setLiveViewState(states[nextIndex]);
  };

  // Audio & Notification Logic
  const audioStart = useRef<HTMLAudioElement | null>(null);
  const audioComplete = useRef<HTMLAudioElement | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isTabFlashing, setIsTabFlashing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reserved port for backend integration
  const notifyAIReply = (message: string) => {
    setActiveToast(message);
    setIsTabFlashing(true);
    audioComplete.current?.play().catch(() => {});
    triggerNotification("ProcAgent", message);
    
    // Auto-hide toast after 5s
    setTimeout(() => setActiveToast(null), 5000);
  };

  useEffect(() => {
    audioStart.current = new Audio("/audio/mixkit-software-interface-start-2574.wav");
    audioComplete.current = new Audio("/audio/mixkit-alert-bells-echo-765.wav");
    
    // Check notification permission on mount
    if ("Notification" in window) {
      const permission = Notification.permission;
      const hasDismissedInSession = sessionStorage.getItem("procagent_notification_dismissed");
      
      if (permission === "default" && !hasDismissedInSession) {
        // Delay slightly for better UX
        const timer = setTimeout(() => setShowNotificationModal(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAllowNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        triggerNotification("Notifications Enabled", "You will now receive updates for task status.");
      }
    }
    setShowNotificationModal(false);
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
    sessionStorage.setItem("procagent_notification_dismissed", "true");
  };

  const triggerNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      // Use absolute URL and timestamp to bypass browser/OS icon caching
      const iconUrl = `${window.location.origin}/logo.png?v=${Date.now()}`;
      new Notification(title, { body, icon: iconUrl });
    }
  };

  // Watch for state changes that require notifications
  useEffect(() => {
    if (liveViewState === "needs-intervention") {
      audioComplete.current?.play().catch(() => {});
      triggerNotification(
        t.document.needsIntervention, 
        "Assistant requires your intervention to proceed with the current task."
      );
    }
  }, [liveViewState, t]);

  // Tab Flashing Logic
  useEffect(() => {
    let interval: any;
    const originalTitle = document.title;
    
    if (isTabFlashing) {
      let isAlt = false;
      interval = setInterval(() => {
        document.title = isAlt ? t.document.newMessage : originalTitle;
        isAlt = !isAlt;
      }, 1000);
    } else {
      document.title = originalTitle;
    }

    return () => {
      if (interval) clearInterval(interval);
      document.title = originalTitle;
    };
  }, [isTabFlashing, t]);

  // Reset effects on focus
  useEffect(() => {
    const handleFocus = () => {
      setIsTabFlashing(false);
      setActiveToast(null);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);


  /**
   * detectIntent performs a mock check for specific user intents.
   * This is a placeholder for a future backend LLM call.
   */
  const detectIntent = async (text: string, currentType: string) => {
    // --- BEGIN RESERVED BACKEND INTERFACE ---
    // In a real implementation, this would call:
    // const response = await fetch('/api/intent', { method: 'POST', body: JSON.stringify({ text, projectType: currentType }) });
    // const { intentType } = await response.json();
    // return intentType; // mismatch_piping | memory_update | none
    // --- END RESERVED BACKEND INTERFACE ---

    // Current Mock Implementation
    if (currentType === "simulation" && (text.toLowerCase().includes("piping") || text.includes("配管") || text.includes("管线"))) {
      return "mismatch_piping";
    }
    
    if (text.includes("记住") || text.toLowerCase().includes("remember")) {
      return "memory_update";
    }

    return "none";
  };

  const handleSend = async (forcedText?: string | any) => {
    // Ensure text is a string; ignore if it's a MouseEvent or other event objects
    const text = (typeof forcedText === 'string') ? forcedText : input;
    if (!text || typeof text !== 'string' || !text.trim() || isGenerating) return;

    const isFirstMessage = messages.length === 0;

    // Process Intent Detection (Mock)
    const intentType = await detectIntent(text, type);
    
    if (intentType === "mismatch_piping") {
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), role: "user", content: text },
        { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          content: t.document.routingPrompt, 
          isRoutingCard: true 
        }
      ]);
      setInput("");
      setAttachments([]);
      return;
    }

    if (intentType === "memory_update") {
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), role: "user", content: text },
        { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          content: t.document.memoryUpdatedAck, 
          isMemoryCard: true 
        }
      ]);
      setInput("");
      setAttachments([]);
      return;
    }

    // Detect "执行任务" (Execute Task) keyword for Agent Task Card Mock
    if (text.includes("执行任务")) {
      const taskId = Date.now().toString();
      const assistantId = (Date.now() + 1).toString();
      
      const initialTask: AgentTaskStatus = {
        title: "智能业务流程自动化执行",
        subTaskName: "正在初始化环境...",
        current: 1,
        total: 8,
        isFinished: false
      };

      setMessages(prev => [
        ...prev,
        { id: taskId, role: "user", content: text },
        { 
          id: assistantId, 
          role: "assistant", 
          content: "收到，正在为您执行自动化业务流程任务。您可以实时查看下方的任务执行进度。",
          agentTask: initialTask
        }
      ]);
      
      setInput("");
      setAttachments([]);
      setIsGenerating(true);

      // Simulate Backend Stream Updates
      const subTasks = [
        "正在加载项目元数据...",
        "正在解析业务需求文档...",
        "正在同步本地资产库...",
        "正在生成代码框架...",
        "正在运行单元测试自动化...",
        "正在部署测试沙盒...",
        "正在验证最终输出结果...",
        "任务执行完成。"
      ];

      let currentStep = 1;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= 8) {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantId 
              ? { 
                  ...msg, 
                  agentTask: { 
                    ...msg.agentTask!, 
                    current: currentStep, 
                    subTaskName: subTasks[currentStep - 1] 
                  } 
                } 
              : msg
          ));
        } else {
          clearInterval(interval);
          setMessages(prev => prev.map(msg => 
            msg.id === assistantId 
              ? { 
                  ...msg, 
                  agentTask: { 
                    ...msg.agentTask!, 
                    isFinished: true 
                  } 
                } 
              : msg
          ));
          setIsGenerating(false);
          notifyAIReply("自动化任务执行已圆满完成！");
        }
      }, 1500);

      return;
    }

    // Process logic
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: text }]);
    setInput("");
    setAttachments([]);
    setIsGenerating(true);

    // Session logic AFTER sending
    if (isFirstMessage && !sessionId) {
       isInitialRedirect.current = true;
       const newSessionId = `s_${Date.now()}`;
       const saved = localStorage.getItem("procagent_projects");
       if (saved) {
         const currentProjects = JSON.parse(saved);
         const projIndex = currentProjects.findIndex((p: any) => p.id === projectId);
         if (projIndex >= 0) {
           currentProjects[projIndex].sessions.unshift({
             id: newSessionId,
             name: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
             timestamp: Date.now()
           });
           localStorage.setItem("procagent_projects", JSON.stringify(currentProjects));
           
           // Immediate Redirect to the new session's URL
           router.push(`/chat?project_id=${projectId}&session_id=${newSessionId}`);
           
           // Update Context silently (for immediate UI response)
           setSessionId(newSessionId);
           setProjectSessions(currentProjects[projIndex].sessions);
           window.dispatchEvent(new Event("procagent_project_updated"));
         }
       }
    }



    // Play start audio (needs intervention/task start)
    audioStart.current?.play().catch(() => {});
    
    // Simulate generation
    setMessages(prev => [...prev, { id: "loading", role: "assistant", content: "..." }]);
    
    setTimeout(() => {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs.pop(); // remove loading
        return [...newMsgs, { id: Date.now().toString(), role: "assistant", content: t.document.processedMsg.replace("{text}", text) }];
      });
      setIsGenerating(false);

      // Play complete audio & trigger browser notification
      audioComplete.current?.play().catch(() => {});
      const processedMsg = t.document.processedMsg.replace("{text}", text);
      notifyAIReply(processedMsg);
      
      // Memory system updated bubble logic could go here
    }, 2500);
  };

  const handleApplyCase = (c: any) => {
    setShowCasePopup(null);
    setInput(c.prompt);
    setAttachments([{ id: Date.now().toString(), name: `${c.title.replace(/\s+/g, "_")}_Data.json`, size: "12 KB", type: "application/json" }]);
  };

  // --- Sidebar Panels (Isolated Abstractions) ---
  const parameterData = require("@/data/parameter_memory.json");
  const paramCategories = Object.keys(parameterData);
  const [activeParamCategory, setActiveParamCategory] = useState(paramCategories[0] || "");

  return (
    <div className="h-screen relative flex flex-col pt-[56px] z-10 overflow-hidden">
      <WorkspaceNav
        title={projectName}
        onBack={() => router.push('/')}
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        multiple
      />

      <div className="flex flex-1 overflow-hidden p-5 gap-5 max-w-[1800px] w-full mx-auto">

        {/* Left Column: Shared Tabbable Sidebar */}
        <div className="w-[300px] flex flex-col shrink-0 h-full overflow-hidden">
          <div className="glass-panel p-0 rounded-[28px] border border-white/40 flex flex-col h-full overflow-hidden relative bg-white/40 shadow-xl">
            
            {/* Tab Switcher (Segmented Control) */}
            <div className="p-4 border-b border-white/10 shrink-0">
               <div className="bg-black/5 p-[1px] rounded-full flex relative h-11">
                  <button 
                    onClick={() => setActiveSidebarTab("chat")}
                    className={`flex-1 relative z-10 flex items-center justify-center gap-2 text-[11px] font-black tracking-widest transition-all ${activeSidebarTab === "chat" ? "text-[#111827]" : "text-[#111827]/30 hover:text-[#111827]/50"}`}
                  >
                    {!sessionId ? (
                      <>
                        <MessageSquare size={13} strokeWidth={2.5} />
                        {t.document.chat}
                        {projectSessions.length > 0 && (
                          <span className={`px-2.5 py-0.5 rounded-[6px] text-xs font-black leading-none ${activeSidebarTab === "chat" ? "bg-primary text-white" : "bg-black/5 text-[#111827]/30"}`}>
                            {projectSessions.length}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <TypeIcon size={13} strokeWidth={2.5} />
                        {t.projects.parameters}
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveSidebarTab("assets")}
                    className={`flex-1 relative z-10 flex items-center justify-center gap-2 text-[11px] font-black tracking-widest transition-all ${activeSidebarTab === "assets" ? "text-[#111827]" : "text-[#111827]/30 hover:text-[#111827]/50"}`}
                  >
                    <Paperclip size={13} strokeWidth={2.5} />
                    {t.projects.assets}
                    {attachments.length > 0 && (
                      <span className={`px-2.5 py-0.5 rounded-[6px] text-xs font-black leading-none ${activeSidebarTab === "assets" ? "bg-primary text-white" : "bg-black/5 text-[#111827]/30"}`}>
                        {attachments.length}
                      </span>
                    )}
                  </button>
                  <div 
                    className="absolute top-[1px] bottom-[1px] left-[1px] w-[calc(50%-1px)] bg-white rounded-full shadow-sm border border-white/60 transition-transform duration-300 ease-out z-0" 
                    style={{ transform: activeSidebarTab === "chat" ? "translateX(0)" : "translateX(100%)" }}
                  />
               </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              
              {/* PRIMARY CONTENT TAB */}
              {activeSidebarTab === "chat" && (
                !sessionId ? (
                  <SessionHistoryList 
                    sessions={projectSessions} 
                    activeSessionId={sessionId} 
                    onSwitchSession={handleSwitchSession} 
                  />
                ) : (
                  <KeyParameterPanel 
                    data={parameterData} 
                    activeCategory={activeParamCategory} 
                    onCategoryChange={setActiveParamCategory} 
                  />
                )
              )}

              {/* ASSETS LIST */}
              {activeSidebarTab === "assets" && (
                <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="p-4 px-5 flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#111827]/30">{t.projects.attachmentsTitle}</span>
                  </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-2 custom-scrollbar">
                      {projectFiles.length > 0 ? (
                        <div className="space-y-2">
                          {projectFiles.map(file => (
                            <AttachmentCard
                              key={file.id}
                              id={file.id}
                              name={file.name}
                              size={file.size}
                              type={file.type}
                              onAdd={handleAddToContext}
                              onRename={handleRenameProjectFile}
                              onRemove={handleRemoveProjectFile}
                              onDownload={(id) => console.log("Download", id)}
                            />
                          ))}
                        </div>
                      ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#111827]/20 flex items-center justify-center mb-4">
                          <Paperclip size={24} className="text-[#111827]/40" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.projects.noAttachments}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* UPLOAD BUTTON AREA */}
                  <div className="p-4 pt-2 border-t border-white/10 mt-auto">
                    <button 
                      onClick={handleUploadClick}
                      className="w-full group flex items-center justify-center gap-3 py-3.5 bg-[#111827] text-white rounded-full font-black text-[11px] tracking-widest shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                    >
                      <Paperclip size={14} strokeWidth={3} className="text-white/60 group-hover:text-white transition-colors" />
                      {t.projects.uploadNew.toUpperCase()}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -bottom-8 -right-8 opacity-5 pointer-events-none">
              <Activity size={100} />
            </div>
          </div>
        </div>

        {/* Right side logic conditionally rendered (Center and live view vs Project Sandbox) */}
        {!sessionId ? (
          // PROJECT DASHBOARD (No session)
          <div className="flex-1 glass-panel rounded-[32px] flex flex-col overflow-hidden border border-white/40 shadow-xl bg-white/40 relative">
             <div className="absolute inset-0 bg-gradient-to-br from-surface to-[#f8f9fa] opacity-90 pointer-events-none" />
             <div className="relative flex flex-col h-full z-10 pt-12 px-10 pb-10 justify-start">

                {/* Project Sandbox Header */}
                <div className="flex flex-col items-center justify-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                  <h2 className="text-4xl font-medium text-on-surface/90 tracking-normal text-center">
                    {t.projects.sandboxTitle}
                  </h2>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto w-full animate-in fade-in duration-1000">
                  {cases.map((c) => (
                    <button 
                      key={c.id}
                      onClick={() => setShowCasePopup(c)}
                      className="flex flex-col justify-start text-left bg-white/60 px-6 py-5 rounded-[24px] border border-white hover:border-primary/30 transition-all group hover:shadow-xl hover:-translate-y-1 h-full"
                    >
                      <h4 className="font-bold text-lg text-on-surface mb-2 group-hover:text-primary transition-colors flex items-center justify-between min-h-[3rem] leading-tight w-full">
                        <span className="flex-1">{c.title}</span>
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                      </h4>
                      <p className="text-sm text-on-surface/60 line-clamp-2 leading-relaxed min-h-[2.75rem]">
                        {c.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Reusable Gradient Input Box */}
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <GradientInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    placeholder={t.projects.sandboxSubtitle}
                    attachments={attachments}
                    onRemoveAttachment={(id) => setAttachments(attachments.filter(a => a.id !== id))}
                    onAttachmentClick={() => alert("Attachment upload would be triggered here.")}
                    isGenerating={isGenerating}
                  />
                </div>
             </div>
          </div>
        ) : (
          // SESSION WORKSPACE (Center chat + Right live view)
          <>
            {/* Center Column: AI Chat Panel */}
            <div className="w-[450px] shrink-0 glass-panel bg-white/40 rounded-[32px] flex flex-col overflow-hidden border border-white/40 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/20 px-6 py-4 bg-white/30 backdrop-blur-md">
                <span className="text-[15px] font-black text-[#111827] tracking-tight">{t.document.assistant}</span>
              </div>
              <AIChatBox
                messages={messages.map(m => ({
                  id: m.id,
                  role: m.role as "assistant" | "user",
                  content: m.content,
                  isRoutingCard: m.isRoutingCard,
                  isMemoryCard: m.isMemoryCard,
                  agentTask: m.agentTask,
                  time: "10:00 AM", // Mock time since we don't store it in basic chat messages yet
                }))}
                input={input}
                onInputChange={setInput}
                onSend={() => handleSend()}
                onStop={() => setIsGenerating(false)}
                isGenerating={isGenerating}
                attachments={attachments}
                onRemoveAttachment={(id) => setAttachments(attachments.filter(a => a.id !== id))}
                className="bg-transparent"
              />
            </div>

            {/* Right Column: Live View Panel */}
            {(() => {
              const panelContent = (
                <div className={`flex flex-col h-full overflow-hidden ${isFullscreen ? "fixed top-[56px] bottom-0 left-0 right-0 z-[9999] bg-surface" : ""}`}>
                  {/* Live View Header */}
                  <div className="flex items-center justify-between border-b border-white/20 bg-white/30 backdrop-blur-md px-6 py-4 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/5" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/5" />
                      </div>
                      <span className="text-[15px] font-black text-[#111827] tracking-tight">{t.document.liveView}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge 
                        type={liveViewState} 
                        label={
                          liveViewState === "connected" ? t.document.connected :
                          liveViewState === "agent-operating" ? t.document.agentOperating :
                          liveViewState === "needs-intervention" ? t.document.needsIntervention :
                          t.document.disconnected
                        } 
                      />

                      <div className="flex items-center gap-2 border-l border-[#111827]/10 pl-4 ml-1">
                        <button onClick={cycleStatus} className="p-1.5 text-[#111827]/40 hover:text-[#111827] transition-colors active:scale-90" title="Cycle Status (Demo)">
                          <RefreshCw size={18} />
                        </button>
                        <button 
                          onClick={() => setIsFullscreen(!isFullscreen)} 
                          className={`p-1.5 transition-all active:scale-90 ${isFullscreen ? "text-[#111827] bg-[#111827]/5 rounded-full" : "text-[#111827]/40 hover:text-[#111827]"}`}
                          title={isFullscreen ? t.document.collapseLiveView : t.document.expandLiveView}
                        >
                          {isFullscreen ? <X size={18} /> : <Maximize2 size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Live View Body — Always Mock */}
                  <div className="flex-1 relative bg-transparent overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-[0.04] pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />

                    {liveViewState !== "disconnected" ? (
                      <RemoteDesktopView 
                        isLive={true} 
                        status={liveViewState} 
                        className="animate-in fade-in duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
                        <div className="w-28 h-28 rounded-[40px] bg-white border border-[#111827]/5 flex items-center justify-center shadow-xl">
                          <WifiOff size={40} className="text-[#111827]/20" />
                        </div>
                        <div className="flex flex-col items-center gap-3 text-center">
                          <p className="text-[20px] font-black text-[#111827] tracking-tight">
                            {t.document.engineOffline}
                          </p>
                          <p className="text-[15px] text-[#111827]/40 font-bold max-w-[280px] leading-relaxed">
                            {t.document.engineOfflineDesc}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );

              if (isFullscreen) {
                return (
                  <>
                    <div className="flex-1 glass-panel bg-white/40 rounded-[32px] border border-white/40 flex items-center justify-center opacity-40">
                      <div className="flex flex-col items-center gap-2">
                        <Maximize2 size={24} className="text-primary/20" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/30">Expanded in Full Screen</span>
                      </div>
                    </div>
                    <Portal>
                      <div className={`fixed top-[56px] bottom-0 left-0 right-0 z-[9999] ${liveViewState === "agent-operating" ? "agent-operating-glow" : ""}`}>
                        {panelContent}
                      </div>
                    </Portal>
                  </>
                );
              }

              return (
                <div className={`flex-1 relative ${liveViewState === "agent-operating" ? "agent-operating-glow" : ""}`}>
                  <div className={`glass-panel bg-white/40 rounded-[32px] flex flex-col h-full overflow-hidden border border-white/40 shadow-xl transition-all duration-500 ease-in-out ${liveViewState === "agent-operating" ? "ring-2 ring-primary/10" : ""}`}>
                    {panelContent}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Case Popup Modal */}
      {showCasePopup && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-surface glass-panel w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl flex flex-col scale-100 animate-in zoom-in-95 duration-200 border-white/60">
            <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${showCasePopup.img}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              <button 
                onClick={() => setShowCasePopup(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
               >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 pt-2">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary px-2 py-1 rounded-full">{type === 'simulation' ? t.projects.tags.simulation : t.projects.tags.piping} Case</span>
               </div>
               <h2 className="text-2xl font-black mb-2">{showCasePopup.title}</h2>
               <p className="text-sm text-on-surface/60 leading-relaxed mb-6">
                 {showCasePopup.desc} 
               </p>
               
               <button 
                 onClick={() => handleApplyCase(showCasePopup)}
                 className="w-full glass-pill-btn flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
               >
                 Apply <Play size={16} fill="currentColor" />
               </button>
            </div>
          </div>
        </div>
      )}

      <NotificationPermissionModal
        isOpen={showNotificationModal}
        onClose={handleCloseNotificationModal}
        onAllow={handleAllowNotifications}
      />

      {/* Floating Toast Notification */}
      {activeToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 bg-white/60 border-white/80 shadow-2xl shadow-primary/10 min-w-[320px]">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-widest text-primary/40 leading-none mb-1">AI Assistant</span>
                <p className="text-sm font-bold text-primary truncate max-w-[240px]">{activeToast}</p>
             </div>
             <button 
               onClick={() => setActiveToast(null)}
               className="ml-4 p-1.5 hover:bg-black/5 rounded-full transition-colors text-primary/20 hover:text-primary"
             >
                <X size={16} />
             </button>
             
             {/* Progress Bar Loader */}
             <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/20 animate-progress-shrink" />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
