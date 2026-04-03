"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
}

/**
 * GlassCard provides a standardized frosted glass container
 * with 24px rounded corners and a subtle border/shadow.
 */
export default function GlassCard({
  children,
  className = "",
  padding = "p-0",
  style
}: GlassCardProps) {
  return (
    <div 
      className={`bg-white/40 backdrop-blur-sm rounded-[24px] border border-outline-variant/10 shadow-sm overflow-hidden ${padding} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
