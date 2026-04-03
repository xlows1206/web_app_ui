"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Activity, Box, GitMerge, FileWarning, Play, X } from "lucide-react";
import AppTopNav from "@/components/layout/AppTopNav";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);
  const [underConstructionTitle, setUnderConstructionTitle] = useState("");

  const handleCreateProject = (type: "simulation" | "piping" | "pid" | "hazop", title: string) => {
    if (type === "pid" || type === "hazop") {
      setUnderConstructionTitle(type === "pid" ? "P&ID Generation" : "HAZOP Analysis");
      setShowUnderConstruction(true);
      return;
    }

    const mockProjectId = `${type}_${Date.now()}`;
    const newProj = {
      id: mockProjectId,
      name: `New ${title} Project`,
      type: type,
      sessions: []
    };
    
    const saved = localStorage.getItem("procagent_projects");
    const currentProjects = saved ? JSON.parse(saved) : [];
    localStorage.setItem("procagent_projects", JSON.stringify([newProj, ...currentProjects]));
    
    // Set active context for /chat
    localStorage.setItem("procagent_active_project_id", mockProjectId);
    localStorage.removeItem("procagent_active_session_id");
    
    window.dispatchEvent(new Event("procagent_project_updated"));
    
    router.push(`/chat`);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between pt-24 px-[60px] max-w-screen-2xl mx-auto z-10 animate-in fade-in duration-700">
      <AppTopNav />
      
      {/* Main Content Area: Hero + Cards */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-normal text-on-surface mb-6 !leading-tight animate-in fade-in slide-in-from-top-6 duration-700 whitespace-nowrap">
            {t.landing.heroTitle}
          </h1>
          <p className="text-lg text-on-surface/60 font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-top-8 duration-700 delay-100">
            {t.landing.heroSubtitle}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {/* 1. Simulation */}
          <button 
            onClick={() => handleCreateProject("simulation", t.landing.cards.simulation.title)}
            className="group relative flex flex-col items-start p-6 glass-panel rounded-3xl text-left transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">{t.landing.cards.simulation.title}</h3>
            <p className="text-sm text-on-surface/60 font-medium mb-6">
              {t.landing.cards.simulation.desc}
            </p>
            <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
              {t.landing.cards.simulation.button} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
 
          {/* 2. 3D Piping */}
          <button 
            onClick={() => handleCreateProject("piping", t.landing.cards.piping.title)}
            className="group relative flex flex-col items-start p-6 glass-panel rounded-3xl text-left transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-6">
              <Box size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">{t.landing.cards.piping.title}</h3>
            <p className="text-sm text-on-surface/60 font-medium mb-6">
              {t.landing.cards.piping.desc}
            </p>
            <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
              {t.landing.cards.piping.button} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
 
          {/* 3. P&ID */}
          <button 
            onClick={() => handleCreateProject("pid", t.landing.cards.pid.title)}
            className="group relative flex flex-col items-start p-6 glass-panel rounded-3xl text-left transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
              <GitMerge size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">{t.landing.cards.pid.title}</h3>
            <p className="text-sm text-on-surface/60 font-medium mb-6">
              {t.landing.cards.pid.desc}
            </p>
          </button>
 
          {/* 4. HAZOP */}
          <button 
            onClick={() => handleCreateProject("hazop", t.landing.cards.hazop.title)}
            className="group relative flex flex-col items-start p-6 glass-panel rounded-3xl text-left transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-6">
              <FileWarning size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">{t.landing.cards.hazop.title}</h3>
            <p className="text-sm text-on-surface/60 font-medium mb-6">
              {t.landing.cards.hazop.desc}
            </p>
          </button>
        </div>
      </main>
 
      {/* Under Construction Popup - Opaque Premium Modal */}
      {showUnderConstruction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => setShowUnderConstruction(false)} 
          />
          
          {/* Modal Card */}
          <div className="relative bg-white border border-white shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] w-full max-w-lg rounded-[48px] overflow-hidden flex flex-col p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-500">
            {/* Close Button */}
            <button 
              onClick={() => setShowUnderConstruction(false)}
              className="absolute top-8 right-8 p-3 rounded-full hover:bg-black/5 text-[#111827]/30 hover:text-[#111827] transition-all active:scale-90"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
 
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 rounded-[40px] bg-primary/5 flex items-center justify-center mb-2 shadow-inner">
                <Play size={40} className="text-primary fill-primary opacity-80" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">{t.landing.comingSoon.badge}</span>
                    <h2 className="text-4xl font-black text-[#111827] tracking-tight">{underConstructionTitle}</h2>
                </div>
                <p className="text-lg text-[#111827]/40 font-bold max-w-sm leading-relaxed mx-auto">
                    {t.landing.comingSoon.desc}
                </p>
              </div>
 
              <div className="flex flex-col w-full gap-4 mt-4">
                <button 
                  onClick={() => {
                    alert(t.landing.comingSoon.successAlert);
                    setShowUnderConstruction(false);
                  }}
                  className="w-full bg-[#111827] text-white py-5 rounded-full font-black text-[16px] shadow-2xl shadow-black/30 hover:scale-[1.03] active:scale-95 transition-all"
                >
                  {t.landing.comingSoon.notifyBtn}
                </button>
                <button 
                  onClick={() => setShowUnderConstruction(false)}
                  className="w-full py-4 text-[#111827]/40 font-black text-sm hover:text-[#111827] transition-colors"
                >
                  {t.landing.comingSoon.cancelBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full pb-8 flex justify-center text-[11px] font-black text-on-surface/20 tracking-[0.4em] uppercase">
        <p>Built by engineer for engineer</p>
      </footer>
    </div>
  );
}
