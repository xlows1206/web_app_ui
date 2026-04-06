import React from "react";
import { PanelRightClose, PanelRightOpen, X, Maximize2 } from "lucide-react";
import PaneHeader from "../PaneHeader";
import StatusBadge, { StatusType } from "../StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";

interface LiveViewPanelProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (full: boolean) => void;
  liveViewState: StatusType;
  statusLabel: string;
  paneWidth: number;
  isResizing?: boolean;
  children: React.ReactNode;
}

export default function LiveViewPanel({
  isMinimized,
  onMinimize,
  onExpand,
  isFullscreen,
  setIsFullscreen,
  liveViewState,
  statusLabel,
  paneWidth,
  isResizing,
  children
}: LiveViewPanelProps) {
  const { t } = useLanguage();

  if (isMinimized) {
    return (
      <div 
        className="w-12 h-full flex flex-col items-center py-2 glass-panel bg-white/20 rounded-[32px] border border-white/20 ml-1.5 transition-all cursor-pointer group" 
        onClick={onExpand}
      >
        <div className="mt-2 w-9 h-9 flex items-center justify-center rounded-xl bg-white/50 text-on-surface/40 hover:text-primary transition-all group-hover:bg-white shadow-sm border border-white">
          <PanelRightOpen size={18} />
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ width: isFullscreen ? 'auto' : Math.max(320, paneWidth), minWidth: isFullscreen ? 'auto' : 320 }} 
      className={`${isFullscreen ? "fixed top-14 left-0 right-0 bottom-0 z-40 bg-surface/10 backdrop-blur-sm" : `flex-none h-full relative min-h-0`}`}
    >
      <div className={`glass-panel ${isFullscreen ? "rounded-none" : "rounded-[32px]"} flex flex-col h-full overflow-hidden shrink-0 min-h-0 ${liveViewState === "agent-operating" ? "agent-operating-glow" : ""}`}>
        <PaneHeader 
          title={t.document.liveView} 
          onMinimize={isFullscreen ? undefined : onMinimize} 
          minimizeIcon={<PanelRightClose size={18} />}
          actions={
            <div className="flex items-center gap-3 mr-3">
              <StatusBadge type={liveViewState} label={statusLabel} />
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)} 
                className={`p-1.5 rounded-lg transition-all active:scale-95 ${isFullscreen ? "bg-primary text-white" : "text-primary/40 hover:text-primary hover:bg-black/5"}`}
              >
                {isFullscreen ? <X size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          } 
        />
        <div className="flex-1 relative overflow-hidden bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}
