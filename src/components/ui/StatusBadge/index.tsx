"use client";

import React from "react";

export type StatusType = "connected" | "agent-operating" | "needs-intervention" | "disconnected" | "success" | "warning" | "error" | "info";

interface StatusBadgeProps {
  type: StatusType;
  label: string;
  className?: string;
}

/**
 * StatusBadge provides a standardized status indicator with a colored dot.
 * Supports various operational and system states.
 */
export default function StatusBadge({
  type,
  label,
  className = ""
}: StatusBadgeProps) {
  const getStyles = (type: StatusType) => {
    switch (type) {
      case "connected":
      case "success":
        return { 
          dot: "bg-[#27C93F]", 
          text: "text-emerald-700/90", 
          bg: "bg-emerald-500/10",
          breath: "39, 201, 63" // RGB
        };
      case "agent-operating":
      case "info":
        return { 
          dot: "bg-[#007AFF]", 
          text: "text-blue-700/90", 
          bg: "bg-blue-500/10",
          breath: "0, 122, 255"
        };
      case "needs-intervention":
      case "warning":
        return { 
          dot: "bg-[#FFBD2E]", 
          text: "text-amber-700/90", 
          bg: "bg-amber-500/10",
          breath: "255, 189, 46"
        };
      case "error":
        return { 
          dot: "bg-red-500", 
          text: "text-red-700/90", 
          bg: "bg-red-500/10",
          breath: "239, 68, 68"
        };
      case "disconnected":
      default:
        return { 
          dot: "bg-[#111827]/20", 
          text: "text-[#111827]/40", 
          bg: "bg-[#111827]/5",
          breath: ""
        };
    }
  };

  const styles = getStyles(type);
  const isAnimating = type !== 'disconnected';

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-white/40 shadow-sm backdrop-blur-sm ${styles.bg} ${className}`}>
      <div 
        className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${isAnimating ? 'animate-breathing' : ''}`} 
        style={styles.breath ? { '--breath-color': styles.breath } as React.CSSProperties : {}}
      />
      <span className={`text-[10px] font-black uppercase tracking-widest ${styles.text}`}>
        {label}
      </span>
    </div>
  );
}
