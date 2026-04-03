"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  level?: "h2" | "h3";
  indicatorColor?: string;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * SectionHeader provides a standardized title with a vertical indicator bar.
 * level="h2" is for main sections (e.g., "Project Files").
 * level="h3" is for sub-sections (e.g., "Project Params").
 */
export default function SectionHeader({
  title,
  level = "h2",
  indicatorColor = "bg-primary",
  badge,
  className = ""
}: SectionHeaderProps) {
  const isH2 = level === "h2";
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${isH2 ? "h-5 w-1" : "h-4 w-1"} ${indicatorColor} rounded-full`} />
      <div className="flex items-center gap-3">
        {isH2 ? (
          <h2 className="text-lg font-bold text-on-surface tracking-tight">
            {title}
          </h2>
        ) : (
          <h3 className="text-[13px] font-black uppercase tracking-widest text-on-surface-variant">
            {title}
          </h3>
        )}
        {badge}
      </div>
    </div>
  );
}
