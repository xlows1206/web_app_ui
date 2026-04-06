import React from "react";
import { X, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  typeLabel: string;
  onApply: (c: any) => void;
}

export default function CaseDetailModal({
  isOpen,
  onClose,
  caseData,
  typeLabel,
  onApply
}: CaseDetailModalProps) {
  if (!isOpen || !caseData) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-surface glass-panel w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl flex flex-col scale-100 animate-in zoom-in-95 duration-200 border-white/60">
        <div 
          className="h-48 w-full bg-cover bg-center relative" 
          style={{ backgroundImage: `url('${caseData.img}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary px-2 py-1 rounded-full">
              {typeLabel} Case
            </span>
          </div>
          <h2 className="text-2xl font-black mb-2">{caseData.title}</h2>
          <p className="text-sm text-on-surface/60 leading-relaxed mb-6">{caseData.desc}</p>
          <button 
            onClick={() => onApply(caseData)} 
            className="w-full glass-pill-btn flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            Apply <Play size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
