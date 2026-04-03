"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Folder, CheckCircle2, Layout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Portal from "@/components/ui/Portal";

interface Project {
  id: string;
  title: string;
  tags: string[];
}

interface TemplateProjectSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (project: Project) => void;
}

export default function TemplateProjectSelectModal({ isOpen, onClose, onConfirm }: TemplateProjectSelectModalProps) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("procagent_projects");
      if (saved) {
        setProjects(JSON.parse(saved));
      }
      setIsCreating(false);
      setNewTitle("");
      setSelectedId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsCreating(false);
  };

  const handleAction = () => {
    if (isCreating) {
      if (!newTitle.trim()) return;
      const newProj: Project = {
        id: Date.now().toString(),
        title: newTitle,
        tags: [], 
      };
      
      // Save to global project list too
      const saved = localStorage.getItem("procagent_projects");
      const currentProjects = saved ? JSON.parse(saved) : [];
      localStorage.setItem("procagent_projects", JSON.stringify([newProj, ...currentProjects]));
      
      onConfirm(newProj);
    } else if (selectedId) {
      const proj = projects.find(p => p.id === selectedId);
      if (proj) onConfirm(proj);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.2)] border border-outline-variant/10 overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-on-surface">{t.templateModal.selectProjectTitle || "Select Project"}</h2>
              <p className="text-[11px] font-medium text-on-surface-variant/40 uppercase tracking-widest mt-0.5">
                {t.templateModal.selectProjectSubtitle || "Choose where to create this document"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <X size={20} className="text-on-surface-variant" strokeWidth={2.5} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col gap-3">
            {/* Project List */}
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => handleSelect(proj.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left active:scale-[0.98]
                  ${selectedId === proj.id 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-outline-variant/10 bg-white hover:border-primary/30"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === proj.id ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface-variant/40'}`}>
                  <Folder size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">{proj.title}</p>
                  {/* Removed project tags display to simplify UI */}
                </div>
                {selectedId === proj.id && (
                  <CheckCircle2 size={20} className="text-primary" strokeWidth={3} />
                )}
              </button>
            ))}

            {/* Create New Project Option */}
            {isCreating ? (
              <div className="p-4 rounded-2xl border-2 border-primary bg-primary/5 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                  <p className="text-sm font-bold text-on-surface">{t.projects.add || "New Project"}</p>
                </div>
                <input
                  autoFocus
                  type="text"
                  placeholder={t.projects.titlePlaceholder || "Project Title..."}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-outline-variant/20 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAction();
                    if (e.key === 'Escape') setIsCreating(false);
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsCreating(true);
                  setSelectedId(null);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container group-hover:bg-primary/10 flex items-center justify-center text-on-surface-variant/30 group-hover:text-primary transition-colors">
                  <Plus size={22} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-on-surface-variant/40 group-hover:text-primary transition-colors">
                  {t.projects.add || "Create New Project"}
                </p>
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-surface-container-lowest/50 border-t border-outline-variant/10">
            <button
              disabled={(!selectedId && !isCreating) || (isCreating && !newTitle.trim())}
              onClick={handleAction}
              className={`w-full py-3.5 rounded-full font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                ${((selectedId || (isCreating && newTitle.trim())))
                  ? "bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white hover:shadow-xl hover:scale-[1.01]" 
                  : "bg-surface-container-high text-on-surface-variant/30 cursor-not-allowed shadow-none border border-outline-variant/10"}`}
            >
              <Layout size={18} strokeWidth={2.5} />
              {t.common.confirm || "Confirm & Continue"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
