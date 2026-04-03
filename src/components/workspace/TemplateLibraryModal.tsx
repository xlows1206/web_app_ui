"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TemplateCard, { Template } from "@/components/ui/TemplateCard";
import TemplateDetailModal from "./TemplateDetailModal";
import Portal from "@/components/ui/Portal";

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (template: Template) => void;
}

export default function TemplateLibraryModal({ isOpen, onClose, onApply }: TemplateLibraryModalProps) {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(t.templates.items.map(item => item.category)))];

  // Filter templates
  const filteredTemplates = t.templates.items.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDetail = (tpl: Template) => {
    setSelectedTemplate(tpl);
    setIsDetailOpen(true);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[10002] flex items-center justify-center overflow-hidden">
        {/* Backdrop with heavy blur for immersion */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500"
          onClick={onClose}
        />

        {/* Modal content container */}
        <div className="relative w-[95vw] h-[90vh] max-w-7xl bg-[#faf8ff] rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
          
          {/* Header */}
          <div className="px-10 pt-8 pb-6 flex flex-col gap-6 bg-white/50 backdrop-blur-md border-b border-outline-variant/10">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-medium tracking-tight text-on-surface">
                  {t.templates.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">
                    {filteredTemplates.length} {t.templates.countSuffix}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high hover:scale-105 transition-all active:scale-95 border border-outline-variant/10"
              >
                <X size={24} className="text-on-surface-variant" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 outline-none
                      ${activeCategory === cat 
                        ? "bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white shadow-lg shadow-primary/20 scale-[1.05]" 
                        : "bg-white text-on-surface-variant/60 border border-outline-variant/20 hover:border-primary/30 hover:text-primary hover:shadow-sm"
                      }`}
                  >
                    {cat === "All" ? t.templates.allIndustries : cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative group">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder={t.common.noMatch}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-outline-variant/20 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all w-full md:w-64"
                />
              </div>
            </div>
          </div>

          {/* Body - Grid of Templates */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((tpl, i) => (
                  <TemplateCard
                    key={tpl.title}
                    template={tpl}
                    index={i}
                    onClick={() => handleOpenDetail(tpl)}
                    onApply={onApply}
                    viewLabel={t.templateCard.view}
                    applyLabel={t.templateCard.applyAndCreate}
                    newLabel={t.templates.new}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center">
                  <Search size={32} />
                </div>
                <p className="text-sm font-bold tracking-widest uppercase">{t.common.noMatch}</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal Layer */}
        <TemplateDetailModal 
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onApply={onApply}
          template={selectedTemplate}
        />
      </div>
    </Portal>
  );
}
