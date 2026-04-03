"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Box, ArrowRight, Plus, Search, FolderKanban, Trash2, MoreHorizontal, Pencil, Copy, Share2, Globe } from "lucide-react";
import AppTopNav from "@/components/layout/AppTopNav";
import { useLanguage } from "@/contexts/LanguageContext";
import ProjectMembersModal from "@/components/workspace/ProjectMembersModal";
import DeleteProjectModal from "@/components/workspace/DeleteProjectModal";
import CreateProjectModal from "@/components/workspace/CreateProjectModal";
import { FileText, ShieldAlert } from "lucide-react";
import Avatar, { AvatarMember } from "@/components/ui/Avatar";
import AvatarGroup from "@/components/ui/AvatarGroup";

export default function ProjectsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Close menu on click elsewhere
  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const fetchProjects = () => {
    const saved = localStorage.getItem("procagent_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Inject mock data for UI demo purposes
          const augmented = parsed.map((p, idx) => ({
            ...p,
            updatedAtValue: [2, 5, 1][idx % 3],
            updatedAtUnit: "h",
            members: [
              { name: "Aaron" },
              { name: "Bo" },
              { name: "Cathy" },
              { name: "Dan" },
            ].slice(0, Math.floor(Math.random() * 4) + 1)
          }));
          setProjects(augmented);
        } else {
          setProjects([]);
        }
      } catch (e) {
        console.error("Error parsing projects from localStorage", e);
        setProjects([]);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = (project: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!projectToDelete) return;
    const updated = projects.filter(p => p.id !== projectToDelete.id);
    localStorage.setItem("procagent_projects", JSON.stringify(updated));
    setProjects(updated);
    setProjectToDelete(null);
    setIsDeleteModalOpen(false);
    window.dispatchEvent(new Event("procagent_project_updated"));
  };

  const handleRenameSubmit = (id: string) => {
    if (!editValue.trim()) {
        setEditingId(null);
        return;
    }
    const updated = projects.map(p => p.id === id ? { ...p, name: editValue.trim() } : p);
    localStorage.setItem("procagent_projects", JSON.stringify(updated));
    setProjects(updated);
    setEditingId(null);
    window.dispatchEvent(new Event("procagent_project_updated"));
  };

  const handleDuplicate = (project: any) => {
    const newId = `${project.type}_${Date.now()}`;
    const duplicate = {
        ...project,
        id: newId,
        name: `${project.name} (Copy)`,
        sessions: [] // Deep-clone sessions could also be done, but standard Duplicate usually starts fresh
    };
    const updated = [duplicate, ...projects];
    localStorage.setItem("procagent_projects", JSON.stringify(updated));
    setProjects(updated);
    window.dispatchEvent(new Event("procagent_project_updated"));
  };

  const handleShare = (project: any) => {
    const shareUrl = `${window.location.origin}/chat?project=${project.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert(t.projectMenu.shareSuccess.replace("{name}", project.name));
    });
  };
  const filteredProjects = projects.filter(p => 
    (p?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p?.type || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = (data: { title: string; type: string }) => {
    const newId = `${data.type}_${Date.now()}`;
    const newProject = {
      id: newId,
      name: data.title,
      type: data.type,
      sessions: [],
      attachments: [],
      createdAt: Date.now()
    };
    
    const saved = localStorage.getItem("procagent_projects");
    const currentProjects = saved ? JSON.parse(saved) : [];
    const updated = [newProject, ...currentProjects];
    
    localStorage.setItem("procagent_projects", JSON.stringify(updated));
    localStorage.setItem("procagent_active_project_id", newId);
    localStorage.removeItem("procagent_active_session_id");
    
    window.dispatchEvent(new Event("procagent_project_updated"));
    window.dispatchEvent(new Event("procagent_context_updated"));
    
    router.push('/chat');
  };

  return (
    <div className="min-h-screen relative flex flex-col pt-32 px-[60px] pb-12 max-w-screen-2xl mx-auto z-10 animate-in fade-in duration-700">
      <AppTopNav />

      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-on-surface">{t.projects.title}</h1>
            <p className="text-on-surface/50 font-medium max-w-md">
                {t.projects.subtitle}
            </p>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder={t.projects.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-3 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl w-64 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-sm font-medium"
                />
            </div>
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-[#111827] text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
            >
                <Plus size={18} />
                {t.projects.add}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center glass-panel rounded-[40px] border-dashed border-2 border-on-surface/10">
                <div className="w-20 h-20 rounded-full bg-on-surface/5 flex items-center justify-center mb-6">
                    <FolderKanban size={32} className="text-on-surface/20" />
                </div>
                <p className="text-xl font-bold text-on-surface/40 mb-2">{t.common.noMatch}</p>
                <p className="text-sm text-on-surface/30 font-medium mb-8">{t.projects.emptyHint}</p>
                <Link href="/" className="text-primary font-black uppercase tracking-widest text-xs hover:underline">{t.projects.backToHome}</Link>
            </div>
        ) : (
            filteredProjects.map((project) => (
                <div key={project.id} className="relative">
                  <div
                      onClick={() => {
                          localStorage.setItem("procagent_active_project_id", project.id);
                          localStorage.removeItem("procagent_active_session_id");
                          window.dispatchEvent(new Event("procagent_context_updated"));
                          router.push('/chat');
                      }}
                      className="group relative flex flex-col p-6 glass-panel rounded-[32px] text-left transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95 border-white/60 hover:border-primary/30 w-full cursor-pointer"
                  >
                      <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              project.type === "simulation" 
                              ? "bg-blue-500/10 text-blue-600" 
                              : project.type === "piping"
                              ? "bg-orange-500/10 text-orange-600"
                              : project.type === "pid"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-rose-500/10 text-rose-600"
                          }`}>
                              {project.type === "simulation" && <Activity size={28} />}
                              {project.type === "piping" && <Box size={28} />}
                              {project.type === "pid" && <FileText size={28} />}
                              {project.type === "hazop" && <ShieldAlert size={28} />}
                          </div>
                          
                          {/* More Actions Menu Trigger */}
                          <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === project.id ? null : project.id);
                              }}
                              className="p-2.5 rounded-xl hover:bg-black/5 text-[#111827]/20 hover:text-[#111827] transition-all active:scale-90"
                          >
                              <MoreHorizontal size={20} />
                          </button>
                      </div>

                      <div className="flex flex-col gap-1 mb-6 flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                  project.type === "simulation" ? "bg-blue-500/10 text-blue-600" : 
                                  project.type === "piping" ? "bg-orange-500/10 text-orange-600" :
                                  project.type === "pid" ? "bg-emerald-500/10 text-emerald-600" :
                                  "bg-rose-500/10 text-rose-600"
                              }`}>
                                  {t.projects.tags[project.type as keyof typeof t.projects.tags] || project.type}
                              </span>
                              <span className="text-[10px] font-medium text-on-surface/30 tracking-widest">
                                  {project.updatedAtValue
                                    ? `${project.updatedAtValue}${t.projects.ago}`
                                    : t.common.justNow}
                              </span>
                          </div>
                          {editingId === project.id ? (
                              <input 
                                autoFocus
                                className="text-xl font-black text-primary bg-white/50 border-b-2 border-primary outline-none w-full"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => handleRenameSubmit(project.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRenameSubmit(project.id);
                                    if (e.key === "Escape") setEditingId(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                          ) : (
                              <h3 className="text-xl font-black text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                  {project.name}
                              </h3>
                          )}
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-on-surface/5">
                          <div className="flex items-center">
                            <AvatarGroup 
                                members={project.members || []} 
                                size="sm" 
                            />
                          </div>

                          <div className="flex items-center gap-2 text-primary">
                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <ArrowRight size={16} />
                            </div>
                          </div>
                      </div>
                  </div>

                  {/* Glass-morphism Dropdown Menu (PRD 4.3 Aligned) */}
                  {openMenuId === project.id && (
                    <div 
                        className="absolute top-20 right-6 w-56 bg-white/90 backdrop-blur-3xl border border-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Meta-Data Immersion Header (PRD 4.3) */}
                        <div className="px-5 pt-4 pb-3 border-b border-black/5 bg-black/[0.03] mb-1 flex flex-col gap-2.5">
                            <p className="text-[10px] uppercase font-black text-on-surface/40 tracking-wider">
                                {t.projectMenu.source}
                            </p>
                            <div className="flex items-center gap-3">
                                <Avatar name="K" size="sm" />
                                <div className="flex flex-col">
                                    <p className="text-xs font-black text-on-surface leading-tight">{t.nav.adminName}</p>
                                    <p className="text-[10px] text-on-surface/50 font-bold mt-0.5">
                                        {t.menu.created} 2026-10-14
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 space-y-1">
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditingId(project.id);
                                    setEditValue(project.name);
                                    setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-on-surface/70 hover:bg-black/5 hover:text-primary transition-all text-left"
                            >
                                <Pencil size={16} className="opacity-40" /> {t.common.rename}
                            </button>

                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentProject(project);
                                    setIsMemberModalOpen(true);
                                    setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-on-surface/70 hover:bg-black/5 hover:text-primary transition-all text-left"
                            >
                                <Share2 size={16} className="opacity-40" /> {t.projectMenu.share}
                            </button>

                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDuplicate(project);
                                    setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-on-surface/70 hover:bg-black/5 hover:text-primary transition-all text-left"
                            >
                                <Copy size={16} className="opacity-40" /> {t.projectMenu.duplicate}
                            </button>
                            
                            <div className="h-px bg-black/5 my-1 mx-2" />
                            
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(project, e);
                                    setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all text-left"
                            >
                                <Trash2 size={16} className="opacity-70" /> {t.projectMenu.delete}
                            </button>
                        </div>
                    </div>
                  )}
                </div>
            ))
        )}
      </div>

      {/* Shared Modals Instance */}
      {currentProject && (
        <ProjectMembersModal 
             isOpen={isMemberModalOpen}
             onClose={() => setIsMemberModalOpen(false)}
             projectName={currentProject.name}
        />
      )}

      {projectToDelete && (
        <DeleteProjectModal 
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
          }}
          onConfirm={confirmDelete}
          projectName={projectToDelete.name}
        />
      )}

      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <footer className="mt-auto pt-24 text-center">
        <p className="text-[11px] font-black text-on-surface/20 uppercase tracking-[0.3em]">Built by engineer for engineer</p>
      </footer>
    </div>
  );
}
