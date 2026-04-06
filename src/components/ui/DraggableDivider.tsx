"use client";

import React, { useState } from "react";

interface DraggableDividerProps {
  onDragStart: (e: React.MouseEvent) => void;
  className?: string;
}

export default function DraggableDivider({ onDragStart, className = "" }: DraggableDividerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative w-1.5 h-full cursor-col-resize z-50 ${className}`}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragStart(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interaction Area (Invisible broad zone) */}
      <div className="absolute inset-y-0 -left-2 -right-2 bg-transparent" />
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-12 rounded-full border border-white/60 bg-white shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
        isHovered ? "h-14 w-2.5 shadow-xl scale-y-105" : "opacity-90"
      }`}>
        <div className={`w-0.5 h-0.5 rounded-full ${isHovered ? "bg-primary" : "bg-black/20"}`} />
        <div className={`w-0.5 h-0.5 rounded-full ${isHovered ? "bg-primary" : "bg-black/20"}`} />
        <div className={`w-0.5 h-0.5 rounded-full ${isHovered ? "bg-primary" : "bg-black/20"}`} />
      </div>
    </div>
  );
}
