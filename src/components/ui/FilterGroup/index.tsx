"use client";

import React from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * FilterGroup provides a horizontal list of pill-shaped filter buttons.
 * Used for category filtering (e.g., in Template Library).
 */
export default function FilterGroup({
  options,
  value,
  onChange,
  className = ""
}: FilterGroupProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 backdrop-blur-md active:scale-[0.96] outline-none
              ${value === opt.value 
                ? "bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white shadow-lg shadow-primary/20 scale-[1.05] border-0" 
                : "bg-white/40 text-on-surface-variant/60 border border-outline-variant/20 hover:border-primary/20 hover:text-primary hover:bg-white/80 shadow-sm"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
