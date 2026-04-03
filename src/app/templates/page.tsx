"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AppTopNav from '@/components/layout/AppTopNav';
import { useLanguage } from '@/contexts/LanguageContext';
import TemplateCard from '@/components/ui/TemplateCard';
import TemplateDetailModal from '@/components/workspace/TemplateDetailModal';
import PageLayout from "@/components/ui/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import FilterGroup from "@/components/ui/FilterGroup";

export default function AllTemplatesPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const handleOpenDetail = (tpl: any) => {
    setSelectedTemplate(tpl);
    setIsModalOpen(true);
  };

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(t.templates.items.map(item => item.category)))];

  // Filter templates
  const filteredTemplates = activeCategory === "All" 
    ? t.templates.items 
    : t.templates.items.filter(item => item.category === activeCategory);

  // Group by category for the display
  const groupedTemplates = filteredTemplates.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <AppTopNav />
      <PageLayout>

        <main className="relative z-10 pt-24 pb-20 px-[60px] max-w-screen-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Area */}
          <PageHeader
            title={t.templates.title}
            gap="gap-10"
            withIndicator={false}
          >
            {/* Premium Industry Filter Bar */}
            <FilterGroup
              options={categories.map(cat => ({
                value: cat,
                label: cat === "All" ? t.templates.allIndustries : cat
              }))}
              value={activeCategory}
              onChange={setActiveCategory}
            />
          </PageHeader>

          {/* Grouped Catalog Display */}
          <div className="space-y-16">
            {Object.entries(groupedTemplates).map(([category, items], idx) => (
              <section key={category} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="flex items-center justify-between">
                  <SectionHeader 
                    title={category}
                    indicatorColor="bg-gradient-to-b from-[#C4D2FF] to-[#474DB3]"
                    badge={
                      <span className="px-3 py-1 bg-surface-container-low/60 backdrop-blur-sm border border-outline-variant/10 text-[11px] font-bold text-on-surface-variant/40 rounded-full">
                        {items.length} {t.templates.countSuffix}
                      </span>
                    }
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {items.map((tpl, i) => (
                    <TemplateCard
                      key={tpl.title}
                      template={tpl}
                      index={i}
                      onClick={() => handleOpenDetail(tpl)}
                      viewLabel={t.templateCard.view}
                      newLabel={t.templates.new}
                    />
                  ))}
                </div>
              </section>
            ))}
            
            {Object.keys(groupedTemplates).length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center gap-4 opacity-50 grayscale">
                <div className="w-16 h-16 rounded-3xl bg-surface-container-low flex items-center justify-center border border-outline-variant/10">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-on-surface-variant/30 animate-spin-slow" />
                </div>
                <p className="text-sm font-bold tracking-widest uppercase text-on-surface-variant/60">{t.common.noMatch}</p>
              </div>
            )}
          </div>
        </main>

        <TemplateDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          template={selectedTemplate} 
        />
      </PageLayout>
    </>
  );
}
