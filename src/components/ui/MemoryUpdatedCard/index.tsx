"use client";

import React from "react";
import { Brain, Check, Sparkles } from "lucide-react";

interface MemoryUpdatedCardProps {
  title: string;
  description: string;
}

/**
 * MemoryUpdatedCard - A compact, high-fidelity card to notify user of memory updates.
 * Upgraded with Mesh Gradient squircle and layered premium icons.
 */
export default function MemoryUpdatedCard({
  title,
  description
}: MemoryUpdatedCardProps) {
  return (
    <div className="relative group w-fit animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
      {/* Premium Glass Capsule - Hover Scale Removed */}
      <div className="glass-panel overflow-hidden rounded-full border border-white/80 bg-white/45 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[24px] relative transition-all active:scale-[0.98]">
        
        {/* Subtle Mesh Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A7F3D0]/5 via-transparent to-[#FDBA74]/5 pointer-events-none" />
        
        <div className="relative px-3 py-1.5 flex items-center gap-3">
          {/* Brain Icon with Light Gray Stroke Only */}
          <Brain 
            size={18} 
            className="shrink-0"
            stroke="#D1D5DB"
            fill="none"
            strokeWidth={2}
          />

          <div className="flex items-center gap-2.5 whitespace-nowrap pr-1">
            <span className="text-[13px] font-black text-[#111827]/40 tracking-tight antialiased">
              {title}
            </span>
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Check size={10} className="text-emerald-600" strokeWidth={4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
