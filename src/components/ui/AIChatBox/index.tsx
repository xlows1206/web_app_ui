"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowRight, Square, ChevronDown, ChevronUp, Mic, Paperclip, Check, Plus, Search, X, Terminal } from "lucide-react";
import ChatBubble from "@/components/ui/ChatBubble";
import QuickPromptTile from "@/components/ui/QuickPromptTile";
import { AttachmentList } from "@/components/AttachmentList";
import { FileCard } from "@/components/FileCard";
import type { AttachedFile } from "@/components/FileCard";
import type { AgentTaskStatus } from "@/components/ui/AgentTaskCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { truncateMiddle } from "@/lib/fileUtils";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
  agentTask?: AgentTaskStatus;
  isRoutingCard?: boolean;
  isMemoryCard?: boolean;
  reasoning_content?: string;
  status?: "working" | "thinking" | "generating" | "completed";
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
  quickPrompts?: QuickPrompt[];
  isQuickStartCollapsed?: boolean;
  onToggleQuickStart?: () => void;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
  projectFiles?: any[];
  onAddAttachment?: (id: string) => void;
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
  quickPrompts = [],
  isQuickStartCollapsed = false,
  onToggleQuickStart,
  placeholder,
  className = "",
  projectFiles = [],
  onAddAttachment
}: AIChatBoxProps) {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (editorRef.current && input === "") {
        editorRef.current.innerText = "";
    }
  }, [input]);

  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false);
  const [showCommandPicker, setShowCommandPicker] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const commandPickerRef = useRef<HTMLDivElement>(null);

  const CLI_COMMANDS = [
    { id: 'analyze', name: '/analyze', description: 'Analyze current code/context' },
    { id: 'fix', name: '/fix', description: 'Fix errors or bugs' },
    { id: 'optimize', name: '/optimize', description: 'Optimize performance/logic' },
    { id: 'refactor', name: '/refactor', description: 'Refactor for better readability' },
    { id: 'doc', name: '/document', description: 'Generate documentation' },
    { id: 'explain', name: '/explain', description: 'Explain step by step' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowAttachmentPicker(false);
      }
      if (commandPickerRef.current && !commandPickerRef.current.contains(event.target as Node)) {
        setShowCommandPicker(false);
      }
    };
    if (showAttachmentPicker || showCommandPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAttachmentPicker, showCommandPicker]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    } else if (e.key === "Backspace" && e.currentTarget.selectionStart === 0 && attachments.length > 0 && onRemoveAttachment) {
      // Remove last attachment when backspacing at the beginning of the text
      onRemoveAttachment(attachments[attachments.length - 1].id);
    }
  };

  const filteredFiles = projectFiles.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden ${className}`}>
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 flex flex-col gap-4"
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
            reasoning_content={msg.reasoning_content}
            status={msg.status}
            isGenerating={msg.role === "assistant" && (msg.status === "generating" || (msg.agentTask && !msg.agentTask.isFinished))}
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

      {/* Input Area - True Inline Flow v3 (Merged Flow) */}
      <div className="px-4 py-4 bg-transparent shrink-0">
        <div className="relative rounded-[32px] border border-white/60 premium-focus-glow transition-all group overflow-visible min-h-[100px] bg-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          
          {/* The Single Scrollable Flow & Editable Container */}
          <div 
            ref={editorRef}
            key={`session-input-${attachments.length}`} // Keyed to prevent React DOM desync crashes on node change
            className="gradient-input-container w-full custom-scrollbar"
            contentEditable={!isGenerating}
            onInput={(e) => {
              // Extract only typed text by cloning and stripping pills
              const tempDiv = e.currentTarget.cloneNode(true) as HTMLDivElement;
              const pills = tempDiv.querySelectorAll('.pill-inline-wrapper');
              pills.forEach(p => p.remove());
              onInputChange(tempDiv.innerText);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              } else if (e.key === "Backspace" && attachments.length > 0) {
                const selection = window.getSelection();
                if (selection && selection.anchorOffset === 0 && (e.currentTarget.innerText.trim() === "")) {
                   onRemoveAttachment?.(attachments[attachments.length - 1].id);
                }
              }
            }}
            onBlur={(e) => {
                const tempDiv = e.currentTarget.cloneNode(true) as HTMLDivElement;
                const pills = tempDiv.querySelectorAll('.pill-inline-wrapper');
                pills.forEach(p => p.remove());
                onInputChange(tempDiv.innerText);
            }}
            data-placeholder={placeholder || t.document.aiPlaceholder}
            spellCheck={false}
            suppressContentEditableWarning={true}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(e.currentTarget);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
              }
            }}
          >{attachments.map((file) => (
                <span key={file.id} className="pill-inline-wrapper" contentEditable={false}>
                  <FileCard 
                    file={file} 
                    showRemove 
                    onRemove={onRemoveAttachment} 
                  />
                </span>
              ))}
          </div>

          <div className="absolute bottom-2 right-4 flex items-center gap-3 z-[100]">
            {/* 1. CLI Shortcut Commands */}
            <div className="relative">
              <button
                onClick={() => setShowCommandPicker(!showCommandPicker)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm border border-black/5 ${
                  showCommandPicker 
                    ? "bg-[#111827] text-white" 
                    : "bg-white text-[#111827]/30 hover:bg-white hover:text-[#111827]/60"
                }`}
                title="Shortcut Commands (/)"
              >
                <Terminal size={18} strokeWidth={2.5} />
              </button>

              {showCommandPicker && (
                <div 
                  ref={commandPickerRef}
                  className="absolute bottom-full right-0 mb-4 w-64 bg-white/95 backdrop-blur-3xl rounded-[24px] shadow-2xl border border-white/60 p-3 z-[110] animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex items-center gap-2 bg-black/5 rounded-xl px-3 py-2 mb-3">
                    <Search size={14} className="text-[#111827]/30" />
                    <input 
                      className="bg-transparent border-none outline-none text-xs font-bold text-[#111827] w-full placeholder:text-[#111827]/20"
                      placeholder="Search commands..."
                      value={commandSearch}
                      onChange={(e) => setCommandSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                    {CLI_COMMANDS.filter(c => c.name.includes(commandSearch)).map(cmd => (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          const newText = cmd.name + " ";
                          onInputChange(newText);
                          if (editorRef.current) {
                            editorRef.current.innerText = newText;
                            editorRef.current.focus();
                            // Place cursor at end
                            const range = document.createRange();
                            const sel = window.getSelection();
                            range.selectNodeContents(editorRef.current);
                            range.collapse(false);
                            sel?.removeAllRanges();
                            sel?.addRange(range);
                          }
                          setShowCommandPicker(false);
                        }}
                        className="flex flex-col p-2.5 rounded-xl transition-all hover:bg-primary/5 text-left group"
                      >
                        <span className="text-[13px] font-black text-[#111827] group-hover:text-primary">{cmd.name}</span>
                        <span className="text-[10px] font-bold text-[#111827]/30 italic">{cmd.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Attachment Button & Picker */}
            {projectFiles.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowAttachmentPicker(!showAttachmentPicker)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm border border-black/5 ${
                    showAttachmentPicker 
                      ? "bg-[#111827] text-white" 
                      : "bg-white text-[#111827]/30 hover:bg-white hover:text-[#111827]/60"
                  }`}
                  title={t.projects.assets || "Select Assets"}
                >
                  <Paperclip size={18} strokeWidth={2.5} />
                </button>

                {showAttachmentPicker && (
                  <div 
                    ref={pickerRef}
                    className="absolute bottom-full right-[-20px] mb-4 w-72 bg-white/95 backdrop-blur-3xl rounded-[24px] shadow-2xl border border-white/60 p-3 z-[110] animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex items-center gap-2 bg-black/5 rounded-xl px-3 py-2 mb-3">
                      <Search size={14} className="text-[#111827]/30" />
                      <input 
                        className="bg-transparent border-none outline-none text-xs font-bold text-[#111827] w-full placeholder:text-[#111827]/20"
                        placeholder="Search project files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                      {filteredFiles.map(file => {
                        const isActive = attachments.some(a => a.id === file.id);
                        return (
                          <button
                            key={file.id}
                            onClick={() => onAddAttachment?.(file.id)}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                              isActive 
                                ? "bg-primary/5 border-primary/20" 
                                : "bg-transparent border-transparent hover:bg-black/5"
                            }`}
                          >
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[11px] font-black truncate ${isActive ? "text-primary" : "text-[#111827]"}`}>{file.name}</span>
                              <span className="text-[9px] font-bold text-[#111827]/30 uppercase tracking-wider">{file.size}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isActive ? "bg-primary text-white" : "bg-black/5 text-transparent"
                            }`}>
                              <Check size={10} strokeWidth={4} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={isGenerating ? onStop : onSend}
              disabled={!isGenerating && !input.trim() && attachments.length === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 shadow-[0_10px_30px_rgba(17,24,39,0.3)] active:scale-90 ${
                isGenerating 
                  ? "bg-red-500 text-white shadow-red-200" 
                  : "bg-[#111827] text-white disabled:opacity-30 hover:scale-105 hover:-translate-y-0.5"
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
