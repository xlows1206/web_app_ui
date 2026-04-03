"use client";

import React from "react";

interface QuickPromptTileProps {
  title: string;
  prompt: string;
  onClick: (prompt: string) => void;
}

/**
 * QuickPromptTile provides a clickable suggestion card for common prompts.
 * Includes hover animations and brand-consistent styling.
 */
export default function QuickPromptTile({
  title,
  prompt,
  onClick
}: QuickPromptTileProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(prompt)}
      className="group rounded-[20px] border border-white/40 bg-white/30 backdrop-blur-md px-4 py-3.5 text-left transition-all hover:-translate-y-1 hover:bg-white/50 hover:border-white/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] active:scale-[0.97]"
    >
      <div className="text-[13px] font-black tracking-tight text-[#111827] group-hover:text-primary transition-colors mb-1">
        {title}
      </div>
      <div className="text-[11.5px] leading-relaxed text-[#111827]/40 font-medium line-clamp-2">
        {prompt}
      </div>
    </button>
  );
}
