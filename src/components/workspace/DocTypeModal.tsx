"use client";

import React, { useState } from "react";
import { X, Cpu, Box, BookOpen } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

interface DocTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: "simulation" | "piping") => void;
  onOpenTemplateLibrary: () => void;
}

const options = (t: any) => [
  {
    key: "simulation" as const,
    icon: Cpu,
    label: t.docTypeModal.simulation,
    sublabel: "Simulation",
    desc: t.docTypeModal.simulationDesc,
    accent: "from-[#006278]/10 to-[#0048e1]/5",
    border: "border-[#006278]/20 hover:border-[#006278]/50",
    iconBg: "bg-[#006278]/10 text-[#006278]",
  },
  {
    key: "piping" as const,
    icon: Box,
    label: t.docTypeModal.piping,
    sublabel: "3D Piping",
    desc: t.docTypeModal.pipingDesc,
    accent: "from-[#C4D2FF]/30 to-[#474DB3]/5",
    border: "border-[#474DB3]/20 hover:border-[#474DB3]/50",
    iconBg: "bg-[#C4D2FF]/50 text-[#474DB3]",
  },
];

export default function DocTypeModal({ isOpen, onClose, onCreate, onOpenTemplateLibrary }: DocTypeModalProps) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState<string | null>(null);

  if (!isOpen) return null;

  const opts = options(t);

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-250 z-10">
        {/* Header */}
        <div className="px-8 pt-7 pb-5 flex justify-between items-center border-b border-outline-variant/15">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-on-surface">{t.docTypeModal.title}</h2>
            <p className="text-xs text-on-surface-variant/60 mt-0.5 font-medium">{t.docTypeModal.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <X size={20} className="text-on-surface-variant" strokeWidth={2.5} />
          </button>
        </div>

        {/* Options */}
        <div className="px-8 pt-6 pb-2 grid grid-cols-2 gap-4">
          {opts.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => { onCreate(opt.key); onClose(); }}
                onMouseEnter={() => setHovered(opt.key)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex flex-col gap-4 p-6 rounded-[20px] border-2 bg-gradient-to-br ${opt.accent} ${opt.border} transition-all duration-200 text-left active:scale-[0.98] cursor-pointer`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${opt.iconBg}`}>
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-base font-bold text-on-surface tracking-tight">{opt.label}</p>
                  <p className="text-[11px] font-medium text-on-surface-variant/50 uppercase tracking-widest mt-0.5">{opt.sublabel}</p>
                  <p className="text-xs text-on-surface-variant/70 mt-2.5 leading-relaxed font-medium">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Template Library Entry */}
        <div className="px-8 pb-8 pt-4">
          <button 
            onClick={() => {
              onOpenTemplateLibrary();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] border border-dashed border-outline-variant/40 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all group font-bold text-sm text-on-surface-variant/60"
          >
            <div className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <BookOpen size={14} />
            </div>
            {t.docTypeModal.fromTemplate}
          </button>
        </div>
      </div>
    </div>
  );
}
