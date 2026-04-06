"use client";

import React, { useState } from "react";
import { Zap, Box, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { AgentTaskCard, type AgentTaskStatus } from "@/components/ui/AgentTaskCard";
import ProjectRoutingCard from "@/components/ui/ProjectRoutingCard";
import MemoryUpdatedCard from "@/components/ui/MemoryUpdatedCard";

interface ChatBubbleProps {
  role: "assistant" | "user";
  content: string;
  time: string;
  agentTask?: AgentTaskStatus;
  isGenerating?: boolean;
  isRoutingCard?: boolean;
  isMemoryCard?: boolean;
  reasoning_content?: string;
  status?: "working" | "thinking" | "generating" | "completed";
}

/**
 * ChatBubble handles the visual representation of messages in the AI chat.
 * It includes avatars, shimmering text for AI generation, and task progress indicators.
 */
export default function ChatBubble({
  role,
  content,
  time,
  agentTask,
  isGenerating = false,
  isRoutingCard = false,
  isMemoryCard = false,
  reasoning_content,
  status
}: ChatBubbleProps) {
  const isAssistant = role === "assistant";
  const { t } = useLanguage();
  const [isThinkingExpanded, setIsThinkingExpanded] = React.useState(true);

  // --- Implicit Action Protocol Parser ---
  // Use greedy match to capture nested braces { ... { ... } }
  const jsonRegex = /\{[\s\S]*\}/;
  const match = content.match(jsonRegex);
  let implicitAction = null;
  let actionData: any = null;
  let displayContent = content;

  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (parsed.action) {
        implicitAction = parsed.action;
        actionData = parsed.data;
        displayContent = content.replace(match[0], "").trim();
      }
    } catch (e) {
      // Not a valid action JSON, treat as normal text
    }
  }

  // Handle routing card trigger (Prop or Implicit JSON)
  const showRoutingCard = isRoutingCard || implicitAction === "routing_new_project";
  const showMemoryCard = isMemoryCard || implicitAction === "memory_update";

  // 思考完成后自动折叠
  React.useEffect(() => {
    if (status === "completed" && reasoning_content) {
      setIsThinkingExpanded(false);
    }
  }, [status, reasoning_content]);

  if (showRoutingCard && !displayContent) {
    return (
      <div className="flex justify-start my-2 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A7F3D0] via-[#BFDBFE] to-[#FDBA74] flex items-center justify-center shrink-0 mr-3 mt-1 shadow-sm border border-white/40">
          <Zap size={18} className="text-[#111827]" strokeWidth={2.5} />
        </div>
        <div className="max-w-[92%]">
          <ProjectRoutingCard 
            title={t.document.routingPromptTitle || "Intent Mismatch"}
            description={t.document.routingPromptBody || "Your intent doesn't match the current project. Suggest creating a new project."}
            buttonText={t.document.goToProjects || "Go to Projects"}
            targetPath="/projects"
            icon={<Box size={24} className="text-white" />}
          />
          <p className="text-[10px] mt-2 ml-2 text-on-surface-variant/40 font-bold uppercase tracking-widest">
            {time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex ${!isAssistant ? "justify-end" : "justify-start"}`}>
        {isAssistant && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A7F3D0] via-[#BFDBFE] to-[#FDBA74] flex items-center justify-center shrink-0 mr-3 mt-0.5 shadow-sm border border-white/40">
            <Zap size={18} className="text-[#111827]" strokeWidth={2.5} />
          </div>
        )}
        
        {displayContent && (
          <div
            className={`relative rounded-[24px] px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
              !isAssistant 
                ? "bg-[#111827] text-white max-w-[85%] rounded-tr-none" 
                : "bg-white/40 backdrop-blur-3xl border border-white/60 text-[#111827] max-w-[92%] rounded-tl-none"
            } animate-in fade-in zoom-in-95 duration-300`}
          >
            <p className="text-[14px] leading-relaxed font-semibold whitespace-pre-wrap">
              {displayContent}
            </p>
          </div>
        )}
      </div>

      {/* Supplemental Cards (Shown even if displayContent is not empty) */}
      {isAssistant && (showRoutingCard && displayContent) && (
        <div className="ml-[37px] mt-1 animate-in fade-in slide-in-from-top-2 duration-500">
           <ProjectRoutingCard 
            title={t.document.routingPromptTitle}
            description={t.document.routingPromptBody}
            buttonText={t.document.goToProjects}
            targetPath="/projects"
            icon={<Box size={24} className="text-white" />}
          />
        </div>
      )}

      {isAssistant && reasoning_content && (
        <div className="ml-[48px] mr-4 mb-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="rounded-[16px] border border-white/60 bg-white/20 backdrop-blur-3xl overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <button 
              onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 transition-colors active:scale-[0.99]"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#111827]/40">
                {t.document.status.thoughtProcess}
              </span>
              {isThinkingExpanded ? <ChevronUp size={14} className="text-[#111827]/30" /> : <ChevronDown size={14} className="text-[#111827]/30" />}
            </button>
            
            {isThinkingExpanded && (
              <div className="px-4 pb-3.5 animate-in fade-in zoom-in-95 duration-300">
                <p className="text-[12px] leading-relaxed font-medium text-[#111827]/60 whitespace-pre-wrap">
                  {reasoning_content}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isAssistant && status === "thinking" && (
        <div className="ml-[48px] flex items-center gap-2 mb-1 animate-in fade-in duration-500">
          <div className="w-1.5 h-1.5 rounded-full bg-[#111827]/20 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase animate-thinking-shimmer text-[#111827]/30">
            {t.document.status.thinking}
          </span>
        </div>
      )}
      
      {isAssistant && showMemoryCard && (
        <div className="ml-[37px] animate-in fade-in slide-in-from-top-2 duration-500">
          <MemoryUpdatedCard 
            title={actionData?.title || t.document.memoryUpdatedTitle}
            description={actionData?.description || t.document.memoryUpdatedBody}
          />
        </div>
      )}
    </div>
  );
}
