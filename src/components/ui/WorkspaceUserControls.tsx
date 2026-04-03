import React from "react";
import { ChevronDown } from "lucide-react";
import GradientStar from "./icons/GradientStar";

import Avatar from "./Avatar";

type WorkspaceUserControlsProps = {
  credit: string;
  adminName: string;
  avatarSrc: string;
  onCreditClick?: () => void;
  onProfileClick?: () => void;
  isExpanded?: boolean;
  className?: string;
};

export default function WorkspaceUserControls({
  credit,
  adminName,
  avatarSrc,
  onCreditClick,
  onProfileClick,
  isExpanded = false,
  className = "",
}: WorkspaceUserControlsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        type="button"
        onClick={onCreditClick}
        className="flex items-center gap-2 pl-2.5 pr-4 py-1.5 bg-white/40 backdrop-blur-xl border border-white/40 rounded-full hover:bg-white/60 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-95"
      >
        <GradientStar size={18} />
        <span className="text-xs font-black tracking-tighter text-on-surface h-4 leading-4 mt-0.5">{credit}</span>
      </button>

      <button
        type="button"
        onClick={onProfileClick}
        className={`flex items-center gap-3 rounded-full pl-1.5 pr-4 py-1.5 transition-all active:scale-95 ${
          isExpanded
            ? "bg-black/5"
            : "hover:bg-black/5"
        }`}
      >
        <Avatar 
          name="K"
          size="sm"
        />
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-on-surface tracking-tight leading-none">{adminName}</span>
           <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#A7F3D0] to-[#BFDBFE] text-[#111827] rounded shadow-sm">
             Pro
           </span>
        </div>
        <ChevronDown
          size={16}
          strokeWidth={3}
          className={`text-on-surface/20 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
