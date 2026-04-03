"use client";

import React from "react";
import { Zap, Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { AgentTaskProgress, type AgentTaskStatus } from "@/components/AgentTaskProgress";
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
  isMemoryCard = false
}: ChatBubbleProps) {
  const isAssistant = role === "assistant";
  const { t } = useLanguage();

  if (isRoutingCard) {
    return (
      <div className="flex justify-start my-2 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A7F3D0] via-[#BFDBFE] to-[#FDBA74] flex items-center justify-center shrink-0 mr-3 mt-1 shadow-sm border border-white/40">
          <Zap size={18} className="text-[#111827]" strokeWidth={2.5} />
        </div>
        <div className="max-w-[92%]">
          <ProjectRoutingCard 
            title={t.document.routingPromptTitle}
            description={t.document.routingPromptBody}
            buttonText={t.document.goToProjects}
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
        <div
          className={`relative rounded-[24px] px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
            !isAssistant 
              ? "bg-[#111827] text-white max-w-[85%] rounded-tr-none" 
              : "bg-white/40 backdrop-blur-3xl border border-white/60 text-[#111827] max-w-[92%] rounded-tl-none"
          }`}
        >
          <p className={`text-[14px] leading-relaxed font-semibold whitespace-pre-wrap ${
            isAssistant && isGenerating 
              ? "animate-text-shimmer" 
              : ""
          }`}>
            {content}
          </p>

          {agentTask && (
            <div className="mt-3 pt-3 border-t border-black/5">
              <AgentTaskProgress task={agentTask} />
            </div>
          )}
        </div>
      </div>
      
      {isAssistant && isMemoryCard && (
        <div className="ml-[37px] animate-in fade-in slide-in-from-top-2 duration-500">
          <MemoryUpdatedCard 
            title={t.document.memoryUpdatedTitle}
            description={t.document.memoryUpdatedBody}
          />
        </div>
      )}
    </div>
  );
}
