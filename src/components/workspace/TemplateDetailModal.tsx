"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ImageOff, CheckCircle2 } from 'lucide-react';
import Portal from "@/components/ui/Portal";

interface Template {
  title: string;
  desc: string;
  longDesc: string;
  category: string;
  image?: string;
  isNew?: boolean;
}

interface TemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (template: Template) => void;
  template: Template | null;
}

export default function TemplateDetailModal({ isOpen, onClose, onApply, template }: TemplateDetailModalProps) {
  const { t } = useLanguage();

  if (!isOpen || !template) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden outline-none">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={onClose}
        ></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-4xl bg-white rounded-[24px] shadow-[0_30px_100px_rgba(0,0,0,0.25)] border border-outline-variant/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-300">
          
          {/* Header Area */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/5 bg-surface-container-lowest/50">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black tracking-tight text-on-surface">
                {template.title}
              </h2>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded w-fit">
                {template.category}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <X size={24} className="text-on-surface-variant" strokeWidth={2.5} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="flex flex-col gap-6">
              
              {/* Description at the top */}
              <p className="text-on-surface-variant leading-relaxed text-[15px] font-medium opacity-90 max-w-2xl">
                {template.longDesc}
              </p>

              {/* Main Preview Image below description */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-outline-variant/20 shadow-inner group">
                {template.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={template.image} 
                    alt={template.title} 
                    className="w-full h-full object-cover transition-colors duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/30 gap-3">
                    <ImageOff size={48} strokeWidth={1.5} />
                    <span className="text-sm font-bold uppercase tracking-widest">No Preview Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="px-8 py-6 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-end">
            <button 
              onClick={() => {
                if (onApply && template) {
                  onApply(template);
                  onClose();
                }
              }}
              className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 size={18} strokeWidth={2.5} />
              {t.templateModal.apply}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
