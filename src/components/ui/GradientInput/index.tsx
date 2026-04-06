"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, X, Paperclip, Check, Plus, Search, Terminal } from "lucide-react";
import "./styles.css";
import { getFileIconInfo } from "@/lib/fileUtils";
import { FileCard } from "@/components/FileCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Attachment {
  id: string;
  name: string;
  size?: string;
  [key: string]: any;
}

interface GradientInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (forcedText?: string) => void;
  placeholder?: string;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  isGenerating?: boolean;
  className?: string;
  projectFiles?: any[];
  onAddAttachment?: (id: string) => void;
}

/**
 * GradientInput - Premium AI Context Input Component
 * Refined with outer-only glow, increased height, and cleaner glassmorphism.
 */
const GradientInput: React.FC<GradientInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = "Describe your objective to launch a new session...",
  attachments = [],
  onRemoveAttachment,
  isGenerating = false,
  className = "",
  projectFiles = [],
  onAddAttachment
}) => {
  const { t } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [internalText, setInternalText] = useState(value);
  const [showCommandPicker, setShowCommandPicker] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const commandPickerRef = useRef<HTMLDivElement>(null);

  const CLI_COMMANDS = [
    { id: 'analyze', name: '/analyze', description: 'Analyze current code/context' },
    { id: 'fix', name: '/fix', description: 'Fix errors or bugs' },
    { id: 'optimize', name: '/optimize', description: 'Optimize performance/logic' },
    { id: 'refactor', name: '/refactor', description: 'Refactor for better readability' },
    { id: 'doc', name: '/document', description: 'Generate documentation' },
    { id: 'explain', name: '/explain', description: 'Explain step by step' }
  ];

  // Sync internal text when prop value changes (e.g. onSend resets it)
  useEffect(() => {
    if (value !== internalText) {
      setInternalText(value);
      if (editorRef.current && value === "") {
        editorRef.current.innerText = "";
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
      if (commandPickerRef.current && !commandPickerRef.current.contains(event.target as Node)) {
        setShowCommandPicker(false);
      }
    };
    if (showPicker || showCommandPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker, showCommandPicker]);

  const filteredFiles = projectFiles.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInput = () => {
    if (editorRef.current) {
      // Get all text nodes but ignore text inside our pills
      // A simple way is to clone the node and remove the pills before getting innerText
      const tempDiv = editorRef.current.cloneNode(true) as HTMLDivElement;
      const pills = tempDiv.querySelectorAll('.pill-inline-wrapper');
      pills.forEach(p => p.remove());
      const text = tempDiv.innerText;
      
      setInternalText(text);
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    } else if (e.key === 'Backspace' && attachments.length > 0) {
      const selection = window.getSelection();
      if (selection && selection.anchorOffset === 0 && (editorRef.current?.innerText === "" || editorRef.current?.innerText === "\n")) {
         // If at start of empty input, remove last attachment
         onRemoveAttachment?.(attachments[attachments.length - 1].id);
      }
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className} animate-in fade-in slide-in-from-bottom-8 duration-1000`}>
      
      {/* Unified Input Container - True Inline Flow v3 (Merged Flow) */}
      <div className="relative rounded-[32px] border border-white/60 premium-focus-glow transition-all group overflow-visible min-h-[100px] bg-white/40 shadow-sm">
        
        {/* The Single Scrollable Flow & Editable Container */}
        <div 
          ref={editorRef}
          key={`input-${attachments.length}`} // Keyed by attachments length to force hard reset on change, preventing DOM desync errors
          className="gradient-input-container w-full custom-scrollbar"
          contentEditable={!isGenerating}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          spellCheck={false}
          suppressContentEditableWarning={true}
          onBlur={handleInput}
        >{attachments.map((file) => (
              <span key={file.id} className="pill-inline-wrapper" contentEditable={false}>
                <FileCard 
                  file={file as any} 
                  showRemove 
                  onRemove={onRemoveAttachment} 
                />
              </span>
            ))}</div>

        {/* Actions Cluster - Absolutely positioned at bottom right */}
        <div className="absolute bottom-2 right-4 flex items-center gap-3 bg-transparent z-[100]">
            
            {/* 1. CLI Shortcut Commands */}
            <div className="relative">
              <button
                onClick={() => setShowCommandPicker(!showCommandPicker)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 border border-black/5 shadow-sm ${
                  showCommandPicker 
                    ? "bg-[#111827] text-white shadow-lg" 
                    : "bg-white text-[#111827]/30 hover:bg-white hover:text-[#111827]/60"
                }`}
                title="Shortcut Commands (/)"
              >
                <Terminal size={18} strokeWidth={2.5} />
              </button>

              {showCommandPicker && (
                <div 
                  ref={commandPickerRef}
                  className="absolute bottom-full right-0 mb-4 w-64 bg-white/95 backdrop-blur-3xl rounded-[28px] shadow-2xl border border-white/60 p-4 z-[110] animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <div className="flex items-center gap-2 bg-black/5 rounded-2xl px-4 py-2 mb-3">
                    <Search size={14} className="text-[#111827]/30" />
                    <input 
                      className="bg-transparent border-none outline-none text-[13px] font-bold text-[#111827] w-full placeholder:text-[#111827]/20"
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
                          setInternalText(newText);
                          onChange(newText);
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
            <div className="relative">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 border border-black/5 shadow-sm ${
                  showPicker 
                    ? "bg-[#111827] text-white shadow-lg" 
                    : "bg-white text-[#111827]/30 hover:bg-white hover:text-[#111827]/60"
                }`}
                title={t.projects.assets || "Select Assets"}
              >
                <Paperclip size={18} strokeWidth={2.5} />
              </button>

              {showPicker && (
                <div 
                  ref={pickerRef}
                  className="absolute bottom-full right-[-20px] mb-4 w-80 bg-white/95 backdrop-blur-3xl rounded-[28px] shadow-2xl border border-white/60 p-4 z-[110] animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <div className="flex items-center gap-2 bg-black/5 rounded-2xl px-4 py-2.5 mb-4">
                    <Search size={16} className="text-[#111827]/30" />
                    <input 
                      className="bg-transparent border-none outline-none text-sm font-bold text-[#111827] w-full placeholder:text-[#111827]/20"
                      placeholder="Search project files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 pr-1">
                    {filteredFiles.map(file => {
                      const isActive = attachments.some(a => a.id === file.id);
                      return (
                        <button
                          key={file.id}
                          onClick={() => onAddAttachment?.(file.id)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                            isActive 
                              ? "bg-primary/5 border-primary/20 shadow-sm" 
                              : "bg-transparent border-transparent hover:bg-black/5"
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`text-[13px] font-black truncate ${isActive ? "text-primary" : "text-[#111827]"}`}>{file.name}</span>
                            <span className="text-[10px] font-bold text-[#111827]/30 uppercase tracking-wider">{file.size}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isActive ? "bg-primary text-white" : "bg-black/5 text-transparent"
                          }`}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button 
              onClick={() => onSend()}
              disabled={isGenerating || (!value.trim() && attachments.length === 0)}
              className="bg-[#111827] text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 transition-all hover:scale-[1.05] active:scale-90 shadow-[0_10px_30px_rgba(17,24,39,0.3)] hover:shadow-[0_15px_35px_rgba(17,24,39,0.4)]"
              aria-label="Send message"
            >
              <ArrowRight size={20} strokeWidth={3} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default GradientInput;
