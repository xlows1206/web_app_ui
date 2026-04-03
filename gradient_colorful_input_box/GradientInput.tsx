"use client";
import React from "react";
import { Paperclip, ArrowRight, X, CheckCircle2 } from "lucide-react";
import "./styles.css";

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
  onAttachmentClick?: () => void;
  isGenerating?: boolean;
  className?: string;
}

/**
 * GradientInput - Premium AI Context Input Component
 * Refined with outer-only glow, multi-line support, and dual-layer masking.
 */
const GradientInput: React.FC<GradientInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = "Describe your objective to launch a new session...",
  attachments = [],
  onRemoveAttachment,
  onAttachmentClick,
  isGenerating = false,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className} animate-in fade-in slide-in-from-bottom-8 duration-1000`}>
      {/* Attachments Preview Area */}
      {attachments.length > 0 && (
        <div className="flex gap-2.5 flex-wrap mb-5 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {attachments.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center gap-2.5 bg-white/90 backdrop-blur-3xl border border-white/60 shadow-lg px-5 py-3 rounded-[20px] transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <CheckCircle2 size={16} className="text-[#10b981] shrink-0" strokeWidth={3} />
              <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-black text-[#111827] truncate max-w-[180px]">{file.name}</span>
                  {file.size && <span className="text-[10px] text-[#111827]/30 font-bold uppercase tracking-wider">{file.size}</span>}
              </div>
              {onRemoveAttachment && (
                <button 
                  onClick={() => onRemoveAttachment(file.id)} 
                  className="text-[#111827]/30 hover:text-red-500 ml-1 p-1.5 hover:bg-red-50 rounded-full transition-all active:scale-90"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Input Container with Dual-Layer Masking & Glow */}
      <div className="relative flex items-end rounded-[32px] border border-white/60 premium-focus-glow transition-all group overflow-visible">
        
        {/* Text Area Field (Supports multi-line, defaults to 3 lines) */}
        <textarea
          className="gradient-input-field flex-1 resize-none custom-scrollbar"
          placeholder={placeholder}
          value={value}
          rows={3}
          onChange={e => {
            onChange(e.target.value);
            // Dynamic height logic
            e.target.style.height = 'auto';
            const newHeight = Math.max(120, e.target.scrollHeight);
            e.target.style.height = `${newHeight}px`;
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        
        {/* Actions Cluster on Right (Attachment + Send) */}
        <div className="relative flex items-center gap-1 pr-5 pb-4" style={{ zIndex: 1 }}>
            {/* Attachment Button */}
            <button 
              onClick={onAttachmentClick}
              className="p-3.5 text-[#111827]/30 hover:text-[#111827] hover:bg-black/5 rounded-full transition-all active:scale-90"
              aria-label="Upload attachment"
            >
              <Paperclip size={20} strokeWidth={2.5} />
            </button>

            {/* Send Button */}
            <div className="pl-1">
                <button 
                  onClick={() => onSend()}
                  disabled={isGenerating || !value.trim()}
                  className="bg-[#111827] text-white w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-10 transition-all hover:scale-[1.05] active:scale-90 shrink-0 shadow-[0_10px_30px_rgba(17,24,39,0.3)] hover:shadow-[0_15px_35px_rgba(17,24,39,0.4)]"
                  aria-label="Send message"
                >
                  <ArrowRight size={22} strokeWidth={3} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GradientInput;
