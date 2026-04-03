"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText, ImageIcon, File as FileIcon, Paperclip, Send, X, Square, Zap, Loader2, Info, ChevronRight, Cpu, Box, Wifi, WifiOff, Maximize2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { AgentTaskProgress, type AgentTaskStatus } from "@/components/AgentTaskProgress";
import { ProjectConfigTable, type ProjectParameter } from "@/components/ProjectConfigTable";
import { AttachmentList } from "@/components/AttachmentList";
import type { AttachedFile } from "@/components/FileCard";
import { useSelectedDoc } from "@/contexts/SelectedDocContext";
import { useLanguage } from "@/contexts/LanguageContext";
import IconButton from "@/components/ui/IconButton";
import ProjectTag from "@/components/ui/ProjectTag";
import WorkspaceUserMenu from "@/components/ui/WorkspaceUserMenu";

type DocumentTranslations = ReturnType<typeof useLanguage>["t"];

type LiveViewState = "disconnected" | "connected" | "agent-operating" | "needs-intervention";

const typeConfig = (t: DocumentTranslations) => ({
  simulation: {
    icon: Cpu,
    label: t.workDoc.simulation,
    sublabel: "Simulation",
    tagColor: "text-[#006278] bg-[#006278]/8 border-[#006278]/15",
  },
  piping: {
    icon: Box,
    label: t.workDoc.piping,
    sublabel: "3D Piping",
    tagColor: "text-[#474DB3] bg-[#C4D2FF]/50 border-[#474DB3]/15",
  },
});

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
  agentTask?: AgentTaskStatus;
}

// Re-using the same type for simplicity
type DocumentAttachedFile = AttachedFile;

interface QuickPrompt {
  id: string;
  title: string;
  prompt: string;
}

interface Attachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "word";
  label?: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm ProcAgent.\nReady to simulate. Describe your process or upload a PFD.",
    time: "just now",
  },
];

const DOCUMENT_TOP_OFFSET = 124;
const CHAT_PANEL_WIDTH = 500;
const PANEL_GAP = 20;
const COLLAPSED_LIVE_VIEW_WIDTH = 460;
const COLLAPSED_LIVE_VIEW_HEIGHT = 300;
const DEFAULT_AVATAR_SRC = "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_d9nZsts-FJw7XWhZiP5C-AT5ylfdMyc5IfTDz-r9n9HG2wb7vumoQx4Im3SPl1hWssSZWn0lY5UkJv33a7LOpoxqsL_--O9jMnl6bzBp9v-H7MCCQ8EI6TlZLrpFKAAPh5x9VDlURtKjpGTMfXBAtQFrhiOgYHpjUccel408-pMY1Yw6JzBr6cNyNoZwKUgllE42pF1K-Evc-WEzysdkxwqZJ2hwq6cELizJHir4jLqXwT81Jr20J2SNebGo9zFcnAFOOwVQgf1";

import PageLayout from "@/components/ui/PageLayout";
import GlassCard from "@/components/ui/GlassCard";
import ChatBubble from "@/components/ui/ChatBubble";
import QuickPromptTile from "@/components/ui/QuickPromptTile";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";

export default function DocumentPage() {
  const router = useRouter();
  const { selectedDoc } = useSelectedDoc();
  const { t, locale } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [liveViewState, setLiveViewState] = useState<LiveViewState>("disconnected");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiveViewCollapsed, setIsLiveViewCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "configs">("chat");
  const [projectParams, setProjectParams] = useState<ProjectParameter[]>([
    { id: "1", name: "进料压力", value: "4.2", unit: "MPa", source: "AI 识别" },
    { id: "2", name: "进料温度", value: "320", unit: "℃", source: "AI 识别" },
    { id: "3", name: "氢油比", value: "850", unit: "v/v", source: "AI 识别" },
  ]);
  const [showParamNotification, setShowParamNotification] = useState(false);
  const [newParamsCount, setNewParamsCount] = useState(0);
  const [isQuickStartCollapsed, setIsQuickStartCollapsed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const generatingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "1", name: "Process_Flow_Diagram.pdf", type: "pdf", label: t.document.pfd },
    { id: "2", name: "Feed_Conditions_Summary.pdf", type: "pdf", label: t.document.feeds },
    { id: "3", name: "Requirements.docx", type: "word" },
  ]);

  const cfg = selectedDoc ? typeConfig(t)[selectedDoc.type] : null;
  const quickPrompts = t.document.quickPrompts;

  const cycleStatus = () => {
    // 模拟后端对接接口: toggleLiveViewState(nextState)
    const states: LiveViewState[] = ["disconnected", "connected", "agent-operating", "needs-intervention"];
    const currentIndex = states.indexOf(liveViewState);
    const nextIndex = (currentIndex + 1) % states.length;
    setLiveViewState(states[nextIndex]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      time: new Date().toLocaleTimeString(locale === 'zh' ? "zh-CN" : "en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Basic Parameter Recognition Logic
    const paramKeywords = ["温度", "压力", "流量", "比", "Temperature", "Pressure", "Flow", "Ratio"];
    const foundParams = paramKeywords.filter(k => input.includes(k));
    if (foundParams.length > 0) {
      setNewParamsCount(foundParams.length);
      setShowParamNotification(true);
      setTimeout(() => setShowParamNotification(false), 8000); // Hide after 8s
      
      // Add fake params for demo
      const recognitions = foundParams.map((k, i) => ({
        id: (Date.now() + i + 10).toString(),
        name: k,
        value: (Math.random() * 100).toFixed(1),
        unit: k === "温度" ? "℃" : k === "压力" ? "MPa" : "m³/h",
        source: t.document.aiRecognitionMsg
      }));
      setProjectParams(prev => [...prev, ...recognitions]);
    }

    setAttachments([]); // Clear attachments after sending
    setIsGenerating(true);

    // Initial "Thinking" state
    const replyId = (Date.now() + 1).toString();
    const replyMsg: ChatMessage = {
      id: replyId,
      role: "assistant",
      content: t.document.analyzingMsg,
      time: new Date().toLocaleTimeString(locale === 'zh' ? "zh-CN" : "en-US", { hour: "2-digit", minute: "2-digit" }),
      agentTask: { name: t.document.tasks.initializing, current: 1, total: 12, isFinished: false }
    };
    setMessages((prev) => [...prev, replyMsg]);

    // Simulate task progress
    let step = 1;
    const taskInterval = setInterval(() => {
      step += 2;
      if (step >= 12) {
        clearInterval(taskInterval);
        setMessages(prev => prev.map(m => m.id === replyId ? {
          ...m,
          agentTask: { ...m.agentTask!, current: 12, isFinished: true }
        } : m));
        setIsGenerating(false);
      } else {
        const taskNames = [
          t.document.tasks.parsing, 
          t.document.tasks.extracting, 
          t.document.tasks.matching, 
          t.document.tasks.checking, 
          t.document.tasks.generating
        ];
        setMessages(prev => prev.map(m => m.id === replyId ? {
          ...m,
          agentTask: { ...m.agentTask!, name: taskNames[Math.floor(step / 3)] || m.agentTask!.name, current: step }
        } : m));
      }
    }, 400);

    generatingTimeoutRef.current = setTimeout(() => {
      clearInterval(taskInterval);
      setIsGenerating(false);
      generatingTimeoutRef.current = null;
    }, 3000);
  };

  const handleStop = () => {
    if (generatingTimeoutRef.current) {
      clearTimeout(generatingTimeoutRef.current);
      generatingTimeoutRef.current = null;
    }
    setIsGenerating(false);
  };

  if (!selectedDoc) {
    return (
      <PageLayout>
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 gap-4 animate-in fade-in duration-500">
          <p className="text-on-surface-variant/60 font-medium text-sm">
            {t.document.noDocSelected}
          </p>
          <button
            onClick={() => router.push("/project")}
            className="bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white px-6 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            {t.document.backToProject}
          </button>
        </main>
      </PageLayout>
    );
  }

  const TypeIcon = cfg!.icon;

  return (
    <>
      <style>{`
        @keyframes agent-breathe {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(71, 77, 179, 0.3), 0 0 0 1px rgba(71, 77, 179, 0.2), inset 0 0 8px rgba(71, 77, 179, 0.1); 
            border-color: rgba(71, 77, 179, 0.3); 
          }
          50% { 
            box-shadow: 0 0 25px rgba(71, 77, 179, 0.5), 0 0 0 1.5px rgba(71, 77, 179, 0.4), inset 0 0 20px rgba(71, 77, 179, 0.2); 
            border-color: rgba(71, 77, 179, 0.6); 
          }
        }
        .animate-agent-breathe {
          animation: agent-breathe 2.8s ease-in-out infinite;
          background: linear-gradient(white, white) padding-box, 
                      linear-gradient(135deg, #C4D2FF 0%, #474DB3 50%, #0048e1 100%) border-box !important;
          border: 2px solid transparent !important;
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%) skewX(-35deg); }
          100% { transform: translateX(150%) skewX(-35deg); }
        }
        .animate-shimmer-sweep {
          animation: shimmer-sweep 2s infinite linear;
        }
        @keyframes text-shimmer {
          0% { background-position: 100% center; }
          100% { background-position: -100% center; }
        }
        .animate-text-shimmer {
          background: linear-gradient(90deg, #191b24 0%, #474DB3 40%, #C4D2FF 50%, #474DB3 60%, #191b24 100%);
          background-size: 200% auto;
          color: transparent !important;
          -webkit-background-clip: text;
          background-clip: text;
          animation: text-shimmer 3s linear infinite;
        }
      `}</style>
      <PageLayout className="flex flex-col h-screen">

        {/* Header Bar */}
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[72px] border-b border-outline-variant/15 bg-white/60 backdrop-blur-xl flex items-center">
          <div className="flex items-center justify-between px-[60px] w-full max-w-screen-2xl mx-auto h-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/project")}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-low/60 border border-outline-variant/15 text-on-surface-variant/70 hover:text-on-surface hover:bg-white hover:border-primary/30 transition-all active:scale-95 shadow-sm group"
              >
                <ArrowLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-on-surface tracking-tight truncate max-w-[320px]">
                  {selectedDoc.title}
                </span>
                <ProjectTag type={selectedDoc.type} />
              </div>
            </div>
            <WorkspaceUserMenu
              credit="200.00"
              adminName={t.nav.adminName}
              avatarSrc={DEFAULT_AVATAR_SRC}
            />
          </div>
        </div>

        {/* Main Content: Split Screen - Scrollable Area */}
        <main
          className="relative z-10 flex px-[60px] pt-6 pb-8 max-w-screen-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500 overflow-y-auto custom-scrollbar"
          style={{
            marginTop: `${DOCUMENT_TOP_OFFSET}px`,
            height: `calc(100vh - ${DOCUMENT_TOP_OFFSET}px + 32px)`,
            gap: `${PANEL_GAP}px`,
          }}
        >

          {/* ── LEFT: AI Chat Panel ── */}
          <GlassCard
            className="relative flex min-w-0 flex-col transition-[width,flex-basis] duration-200 ease-linear"
            style={{
              flex: isLiveViewCollapsed ? "1 1 0%" : `0 0 ${CHAT_PANEL_WIDTH}px`,
              width: isLiveViewCollapsed ? undefined : `${CHAT_PANEL_WIDTH}px`,
            }}
          >
            {/* Chat Panel Header - with Tab Switcher */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10 bg-surface-container-lowest/50">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                <span className="text-sm font-bold text-on-surface tracking-tight">ProcAgent AI</span>
              </div>
              
              <div className="flex bg-surface-container-low/60 p-1 rounded-full border border-outline-variant/5">
                <button 
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'chat' 
                      ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                      : "text-on-surface-variant/40 hover:text-on-surface-variant/60"
                  }`}
                >
                  {t.document.chat}
                </button>
                <button 
                  onClick={() => {
                    setActiveTab("configs");
                    setNewParamsCount(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'configs' 
                      ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                      : "text-on-surface-variant/40 hover:text-on-surface-variant/60"
                  }`}
                >
                  {t.configTable.params}
                  {newParamsCount > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black animate-in zoom-in duration-300">
                      +{newParamsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Inner Content Container for Overflow Control */}
            <div className="flex flex-col h-full w-full overflow-hidden rounded-b-[24px] relative">
              {/* Parameter Recognition Notification Bubble - Relocated to Top */}
              {showParamNotification && (
                <div className="absolute left-1/2 top-4 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500 w-full px-4 flex justify-center pointer-events-none">
                  <button 
                    onClick={() => {
                      setActiveTab("configs");
                      setNewParamsCount(0); // Reset count when viewing
                      setShowParamNotification(false);
                    }}
                    className="flex items-center gap-2.5 bg-white/95 backdrop-blur shadow-[0_12px_40px_rgba(71,77,179,0.15)] border border-primary/10 px-4 py-2 rounded-full text-on-surface ring-1 ring-black/5 active:scale-95 transition-all group pointer-events-auto"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Zap size={10} fill="currentColor" strokeWidth={0} />
                    </div>
                    <span className="text-xs font-bold tracking-tight text-on-surface/80">
                      {t.document.identifiedParams.replace('{count}', newParamsCount.toString())}
                    </span>
                    <div className="flex items-center gap-1 pl-2 border-l border-outline-variant/30 ml-1">
                      <span className="text-[10px] font-black uppercase text-primary/70">{t.document.viewDetail}</span>
                      <ChevronRight size={12} strokeWidth={3} className="text-primary/70 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              )}
              {activeTab === 'chat' ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 flex flex-col gap-4">
                    {messages.map((msg) => (
                      <ChatBubble 
                        key={msg.id}
                        role={msg.role}
                        content={msg.content}
                        time={msg.time}
                        agentTask={msg.agentTask}
                        isGenerating={msg.role === "assistant" && msg.agentTask && !msg.agentTask.isFinished}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {messages.length === 1 && (
                    <div className="px-4 pb-4">
                      <div className="rounded-[22px] border border-outline-variant/15 bg-white/55 p-3 shadow-[0_12px_30px_rgba(116,119,180,0.08)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-on-surface-variant/45">
                              {t.document.quickStart}
                            </span>
                            {!isQuickStartCollapsed && (
                              <span className="text-[10px] text-on-surface-variant/35 font-medium mt-0.5">
                                {t.document.tapToFill}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setIsQuickStartCollapsed(!isQuickStartCollapsed)}
                            className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant/40 hover:text-on-surface transition-colors active:scale-90"
                            title={isQuickStartCollapsed ? t.document.expand : t.document.collapse}
                          >
                            {isQuickStartCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                          </button>
                        </div>
                        
                        {!isQuickStartCollapsed && (
                          <div className="grid grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            {quickPrompts.map((item) => (
                              <QuickPromptTile
                                key={item.id}
                                title={item.title}
                                prompt={item.prompt}
                                onClick={setInput}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Attachments Area */}
                  {attachments.length > 0 && (
                    <div className="px-4 pt-1 pb-3">
                      <AttachmentList 
                        files={attachments as DocumentAttachedFile[]} 
                        onRemove={(id) => setAttachments(prev => prev.filter(a => a.id !== id))} 
                      />
                    </div>
                  )}

                  <div className="px-4 py-4 border-t border-outline-variant/10 bg-surface-container-lowest/30">
                    <div className="flex items-end gap-2 bg-surface-container-low/50 rounded-[18px] border border-outline-variant/15 px-3 py-2 focus-within:border-primary/30 focus-within:shadow-sm transition-all">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant/50 hover:text-on-surface shrink-0 active:scale-90 mb-0.5"
                      >
                        <Paperclip size={16} strokeWidth={2} />
                      </button>
                      <input ref={fileInputRef} type="file" className="hidden" />

                      <textarea
                        ref={textareaRef}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant/30 font-medium py-1.5 resize-none overflow-hidden max-h-[160px] custom-scrollbar"
                        placeholder={t.document.aiPlaceholder}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />

                      <button
                        onClick={isGenerating ? handleStop : handleSend}
                        disabled={!isGenerating && !input.trim()}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-tight active:scale-95 transition-all shadow-sm hover:shadow-md shrink-0 mb-0.5 ${
                          isGenerating 
                            ? "bg-error/10 border border-error/20 text-error hover:bg-error/15" 
                            : "bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white disabled:opacity-40 disabled:pointer-events-none"
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <Square size={10} fill="currentColor" className="text-error" />
                            {t.document.stop}
                          </>
                        ) : (
                          <>
                            <Send size={12} strokeWidth={2.5} />
                            {t.document.send}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <ProjectConfigTable 
                  parameters={projectParams} 
                  onUpdate={setProjectParams} 
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsLiveViewCollapsed((prev) => !prev)}
              className="absolute right-[-12px] top-1/2 z-30 flex h-20 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant/15 bg-white text-on-surface-variant/50 shadow-[0_10px_24px_rgba(60,64,123,0.12),0_0_0_1px_rgba(255,255,255,0.85)] backdrop-blur-xl transition-[color,box-shadow] duration-150 ease-linear hover:text-on-surface hover:shadow-[0_14px_30px_rgba(60,64,123,0.16),0_0_0_1px_rgba(255,255,255,0.92)]"
              aria-label={isLiveViewCollapsed ? t.document.expandLiveView : t.document.collapseLiveView}
              title={isLiveViewCollapsed ? t.document.expandLiveView : t.document.collapseLiveView}
            >
              {isLiveViewCollapsed ? (
                <ArrowLeft size={12} strokeWidth={3} />
              ) : (
                <ArrowRight size={12} strokeWidth={3} />
              )}
            </button>
          </GlassCard>

          {/* ── RIGHT: Live View Panel ── */}
          <GlassCard
            className={`relative flex flex-col transition-[width,flex-basis,height,border-radius,box-shadow] duration-200 ease-linear ${
              isLiveViewCollapsed
                ? "self-start rounded-[28px] shadow-[0_24px_60px_rgba(60,64,123,0.22)]"
                : `min-w-0 ${isFullscreen ? "fixed inset-4 z-[10000]" : ""}`
            } ${liveViewState === "agent-operating" ? "animate-agent-breathe" : ""}`}
            style={
              isFullscreen
                ? undefined
                : {
                    flex: isLiveViewCollapsed ? `0 0 ${COLLAPSED_LIVE_VIEW_WIDTH}px` : "1 1 0%",
                    height: isLiveViewCollapsed ? `${COLLAPSED_LIVE_VIEW_HEIGHT}px` : undefined,
                    width: isLiveViewCollapsed ? `${COLLAPSED_LIVE_VIEW_WIDTH}px` : undefined,
                  }
            }
          >
            {/* Live View Header */}
            <div className={`flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/50 ${isLiveViewCollapsed ? "px-4 py-3" : "px-6 py-4"}`}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/40 border border-error/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50 border border-yellow-400/20" />
                  <div className="w-3 h-3 rounded-full bg-[#006278]/40 border border-[#006278]/20" />
                </div>
                <span className="text-sm font-bold text-on-surface tracking-tight">Live View</span>
              </div>

              <div className="flex items-center gap-2.5">
                <StatusBadge 
                  type={liveViewState} 
                  label={
                    liveViewState === "connected" ? t.document.connected :
                    liveViewState === "agent-operating" ? t.document.agentOperating :
                    liveViewState === "needs-intervention" ? t.document.needsIntervention :
                    t.document.disconnected
                  }
                />

                <IconButton
                  icon={RefreshCw}
                  onClick={cycleStatus}
                  className="p-2 text-on-surface-variant/50 hover:text-on-surface hover:bg-surface-container-high active:scale-90"
                  iconClassName="text-current"
                  title={t.document.toggleConnection}
                  aria-label={t.document.toggleConnection}
                />
                <IconButton
                  icon={Maximize2}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-on-surface-variant/50 hover:text-on-surface hover:bg-surface-container-high active:scale-90"
                  iconClassName="text-current"
                  title={t.document.fullscreen}
                  aria-label={t.document.fullscreen}
                />
              </div>
            </div>

            {/* Live View Body — Always Mock */}
            <div className="flex-1 relative overflow-hidden bg-[#f0f1fa]">
              {/* Subtle dot-grid background */}
              <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {liveViewState !== "disconnected" ? (
                /* Connected State: mock simulation chrome */
                <div className="absolute inset-0 flex flex-col">
                  {/* Fake app top bar ... (unchanged) */}
                  <div className="h-8 bg-[#1e1e2e] flex items-center px-4 gap-3 shrink-0">
                    <div className="flex gap-1">
                      {["Home", "View", "Customize", "Resources"].map((item) => (
                        <span key={item} className="text-[10px] text-white/50 px-2 py-0.5 hover:bg-white/10 rounded cursor-default transition-colors">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto text-[10px] text-white/25 font-mono truncate">
                      Oil_Gas_Separation_Demo.hsc · Aspen HYSYS V15
                    </div>
                  </div>

                  <div className="h-9 bg-[#252536] border-b border-white/5 flex items-center px-4 gap-5 shrink-0">
                    {["Component Lists", "Fluid Packages", "Reactions", "Components", "Hypotheticals"].map((item) => (
                      <span key={item} className="text-[10px] text-white/35 hover:text-white/60 cursor-default transition-colors">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-1 overflow-hidden">
                    <div className="w-44 bg-white border-r border-outline-variant/20 flex flex-col shrink-0">
                      <div className="px-3 py-2 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest border-b border-outline-variant/10">
                        Properties
                      </div>
                      {["Component Lists", "Fluid Packages", "Petroleum Assays", "Reactions", "Component Maps", "User Properties"].map((item, i) => (
                        <div key={item} className={`px-3 py-1.5 text-[11px] text-on-surface-variant/70 cursor-default flex items-center gap-2 transition-colors ${i === 0 ? "bg-surface-container-low/60 font-bold text-primary/80" : "hover:bg-surface-container-low/40"}`}>
                          <div className={`w-1 h-1 rounded-full ${i === 0 ? "bg-primary/60" : "bg-on-surface-variant/20"}`} />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 relative bg-[#f8f9ff] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center shadow-sm">
                          <TypeIcon size={22} strokeWidth={1.5} className="text-primary/60" />
                        </div>
                        <p className="text-sm font-bold text-on-surface/50 tracking-tight">
                          {t.document.simulationCanvasReady}
                        </p>
                        <p className="text-xs text-on-surface-variant/35 font-medium max-w-[200px] leading-relaxed">
                          {t.document.simulationCanvasDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-7 bg-[#1e1e2e] flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2">
                       {["Properties", "Simulation", "Safety Analysis", "Energy Analysis"].map((item, i) => (
                        <span
                          key={item}
                          className={`text-[10px] px-2 py-0.5 rounded cursor-default ${
                            i === 0 ? "bg-[#e6840a] text-white font-bold" : "text-white/35 hover:text-white/55"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-white/25 font-mono">Responsiveness: 3</span>
                  </div>
                </div>
              ) : (
                /* Disconnected State */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                  <div className="w-20 h-20 rounded-[24px] bg-white/80 border border-outline-variant/20 flex items-center justify-center shadow-sm">
                    <WifiOff size={28} strokeWidth={1.5} className="text-on-surface-variant/30" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-base font-bold text-on-surface/50 tracking-tight">
                      {t.document.simulationEngineOffline}
                    </p>
                    <p className="text-sm text-on-surface-variant/35 font-medium max-w-[240px] leading-relaxed">
                      {t.document.simulationEngineDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => setLiveViewState("connected")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white rounded-lg font-bold text-sm active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    <Wifi size={15} strokeWidth={2.5} />
                    {t.document.connectButton}
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </main>
      </PageLayout>
    </>
  );
}
