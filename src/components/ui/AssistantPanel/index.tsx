import React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import PaneHeader from "../PaneHeader";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssistantPanelProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  isResizing?: boolean;
  children: React.ReactNode;
}

export default function AssistantPanel({
  isMinimized,
  onMinimize,
  onExpand,
  isResizing,
  children
}: AssistantPanelProps) {
  const { t } = useLanguage();

  if (isMinimized) {
    return (
      <div 
        className="w-12 h-full flex flex-col items-center py-2 glass-panel bg-white/20 rounded-[32px] border border-white/20 transition-all cursor-pointer group" 
        onClick={onExpand}
      >
        <div className="mt-2 w-9 h-9 flex items-center justify-center rounded-xl bg-white/50 text-on-surface/40 hover:text-primary transition-all group-hover:bg-white shadow-sm border border-white">
          <PanelLeftOpen size={18} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 min-w-[320px] min-h-0 flex flex-col h-full glass-panel bg-white/40 backdrop-blur-3xl border-l border-white/20 overflow-hidden shadow-2xl relative z-10 rounded-[32px] shrink-0`}>
      <PaneHeader 
        title={t.document.assistant} 
        onMinimize={onMinimize} 
        minimizeIcon={<PanelLeftClose size={18} />}
      />
      {children}
    </div>
  );
}
