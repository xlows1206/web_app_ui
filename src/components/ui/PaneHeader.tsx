"use client";

import React from "react";
import { Maximize2, Minimize2, MoreHorizontal, PanelRightClose, PanelRightOpen } from "lucide-react";

interface PaneHeaderProps {
  title: string;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  minimizeIcon?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export default function PaneHeader({ 
  title, 
  isMinimized, 
  onMinimize, 
  onMaximize, 
  minimizeIcon,
  className = "",
  actions 
}: PaneHeaderProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b border-white/20 bg-white/30 backdrop-blur-md shrink-0 ${isMinimized ? "h-12" : "h-14"} transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3 shrink-0 mr-4 max-w-[120px] sm:max-w-[180px]">
        <span className={`text-[13px] font-black uppercase tracking-widest text-primary truncate transition-all ${isMinimized ? "opacity-40" : "opacity-100"}`}>
          {title}
        </span>
      </div>

      {/* Flexible Middle Spacer */}
      <div className="flex-1 min-w-4" />

      <div className="flex items-center gap-1.5 shrink-0 ml-auto whitespace-nowrap overflow-visible">
        {actions}
        
        {onMinimize && (
          <button 
            onClick={onMinimize}
            className="p-1.5 text-primary/40 hover:text-primary hover:bg-black/5 rounded-lg transition-all active:scale-90"
            title={isMinimized ? "Expand" : "Collapse"}
          >
            {minimizeIcon ? minimizeIcon : (isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />)}
          </button>
        )}
        
        {onMaximize && (
          <button 
            onClick={onMaximize}
            className="p-1.5 text-primary/20 hover:text-primary hover:bg-black/5 rounded-full transition-all active:scale-90"
            title="Maximize"
          >
            <Maximize2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
