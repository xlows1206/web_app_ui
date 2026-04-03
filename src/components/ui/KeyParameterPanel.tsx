import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface KeyParameterPanelProps {
  data: Record<string, Record<string, string>>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * KeyParameterPanel Component
 * Renders an adaptive grid of engineering parameters with category tabs.
 */
export default function KeyParameterPanel({ data, activeCategory, onCategoryChange }: KeyParameterPanelProps) {
  const { t } = useLanguage();
  const categories = Object.keys(data);
  
  // Safe helper to get category translation
  const getCategoryLabel = (cat: string) => {
    const i18nCats = t.projects.parameterCategories;
    return i18nCats[cat as keyof typeof i18nCats] || cat;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Sub-Category Tabs (Segmented Control style) */}
      <div className="px-4 py-3 flex gap-1 bg-black/[0.02] border-b border-white/10 overflow-x-auto no-scrollbar">
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all uppercase ${
              activeCategory === cat 
                ? "bg-[#111827] text-white shadow-lg scale-100" 
                : "text-[#111827]/30 hover:text-[#111827]/50 hover:bg-black/5 scale-[0.98]"
            }`}
          >
             {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar">
        <div className="space-y-4">
          {activeCategory && data[activeCategory] && Object.entries(data[activeCategory]).map(([key, val]) => (
            <div 
              key={key} 
              className="bg-white/60 rounded-2xl p-4 border border-white/80 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md hover:bg-white group active:scale-[0.99]"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-[#111827]/30 group-hover:text-primary/40 transition-colors">
                {key}
              </span>
              <span className="text-sm font-bold text-[#111827] tracking-tight">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
