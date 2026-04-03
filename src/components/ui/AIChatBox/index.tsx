"use client";

import React, { useRef, useEffect } from "react";
import { Paperclip, ArrowRight, Square, ChevronDown, ChevronUp, Mic } from "lucide-react";
import ChatBubble from "@/components/ui/ChatBubble";
import QuickPromptTile from "@/components/ui/QuickPromptTile";
import { AttachmentList } from "@/components/AttachmentList";
import type { AttachedFile } from "@/components/FileCard";
import type { AgentTaskStatus } from "@/components/AgentTaskProgress";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
  agentTask?: AgentTaskStatus;
  isRoutingCard?: boolean;
  isMemoryCard?: boolean;
}

export interface QuickPrompt {
  id: string;
  title: string;
  prompt: string;
}

interface AIChatBoxProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isGenerating: boolean;
  attachments?: AttachedFile[];
  onRemoveAttachment?: (id: string) => void;
  onAttachClick?: () => void;
  quickPrompts?: QuickPrompt[];
  isQuickStartCollapsed?: boolean;
  onToggleQuickStart?: () => void;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
}

export default function AIChatBox({
  messages,
  input,
  onInputChange,
  onSend,
  onStop,
  isGenerating,
  attachments = [],
  onRemoveAttachment,
  onAttachClick,
  quickPrompts = [],
  isQuickStartCollapsed = false,
  onToggleQuickStart,
  placeholder,
  className = "",
  maxHeight = "500px"
}: AIChatBoxProps) {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden ${className}`}>
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 flex flex-col gap-4"
        style={{ maxHeight }}
      >
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id}
            role={msg.role}
            content={msg.content}
            time={msg.time}
            agentTask={msg.agentTask}
            isRoutingCard={msg.isRoutingCard}
            isMemoryCard={msg.isMemoryCard}
            isGenerating={msg.role === "assistant" && msg.agentTask && !msg.agentTask.isFinished}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts - Only show if specifically asked or at start */}
      {quickPrompts.length > 0 && messages.length <= 1 && (
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
              {onToggleQuickStart && (
                <button
                  onClick={onToggleQuickStart}
                  className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant/40 hover:text-on-surface transition-colors active:scale-90"
                >
                  {isQuickStartCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
              )}
            </div>
            
            {!isQuickStartCollapsed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                {quickPrompts.map((item) => (
                  <QuickPromptTile
                    key={item.id}
                    title={item.title}
                    prompt={item.prompt}
                    onClick={onInputChange}
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
            files={attachments} 
            onRemove={onRemoveAttachment || (() => {})} 
          />
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 py-8 bg-transparent shrink-0">
        <div className="relative flex items-center bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2 transition-all focus-within:bg-white/60 focus-within:shadow-[0_25px_60px_rgba(0,0,0,0.08)] focus-within:border-white group">
          
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#111827] placeholder:text-[#111827]/25 font-bold px-4 py-3.5 resize-none overflow-y-auto custom-scrollbar min-h-[56px] max-h-[200px]"
            placeholder={placeholder || t.document.aiPlaceholder}
            rows={1}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center gap-1 pr-2">
            <button
              onClick={() => onAttachClick ? onAttachClick() : fileInputRef.current?.click()}
              className="p-2.5 text-[#111827]/30 hover:text-[#111827] hover:bg-black/5 rounded-full transition-all active:scale-90"
              title={t.projects.uploadNew}
            >
              <Paperclip size={18} strokeWidth={2.5} />
            </button>
            <input ref={fileInputRef} type="file" className="hidden" />

            <button
              onClick={isGenerating ? onStop : onSend}
              disabled={!isGenerating && !input.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 shadow-[0_8px_25px_rgba(17,24,39,0.2)] active:scale-90 ${
                isGenerating 
                  ? "bg-red-500 text-white shadow-red-200" 
                  : "bg-[#111827] text-white disabled:opacity-10 disabled:pointer-events-none hover:scale-105 hover:-translate-y-0.5"
              }`}
            >
              {isGenerating ? (
                <Square size={14} fill="currentColor" strokeWidth={0} />
              ) : (
                <ArrowRight size={20} strokeWidth={3} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
