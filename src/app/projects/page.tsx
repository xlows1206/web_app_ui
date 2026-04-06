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
import ProjectCard from "@/components/ui/ProjectCard";

export default function ProjectsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleRenameSubmit = (id: string, newName: string) => {
    if (!newName.trim()) return;
    const updated = projects.map(p => p.id === id ? { ...p, name: newName.trim() } : p);
    localStorage.setItem("procagent_projects", JSON.stringify(updated));
    setProjects(updated);
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
    <div className="h-screen flex flex-col overflow-hidden relative">
      <AppTopNav />

      <main className="flex-1 overflow-y-auto pt-32 px-[60px] pb-12 w-full max-w-screen-2xl mx-auto z-10 animate-in fade-in duration-700 custom-scrollbar">
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
                  <div className="w-20 s-20 rounded-full bg-on-surface/5 flex items-center justify-center mb-6">
                      <FolderKanban size={32} className="text-on-surface/20" />
                  </div>
                  <p className="text-xl font-bold text-on-surface/40 mb-2">{t.common.noMatch}</p>
                  <p className="text-sm text-on-surface/30 font-medium mb-8">{t.projects.emptyHint}</p>
                  <Link href="/" className="text-primary font-black uppercase tracking-widest text-xs hover:underline">{t.projects.backToHome}</Link>
              </div>
          ) : (
              filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onClick={() => {
                    localStorage.setItem("procagent_active_project_id", project.id);
                    localStorage.removeItem("procagent_active_session_id");
                    window.dispatchEvent(new Event("procagent_context_updated"));
                    router.push('/chat');
                  }}
                  onRename={(newName) => handleRenameSubmit(project.id, newName)}
                  onDuplicate={() => handleDuplicate(project)}
                  onDelete={() => {
                    setProjectToDelete(project);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))
          )}
        </div>

        <footer className="mt-auto pt-24 text-center">
          <p className="text-[11px] font-black text-on-surface/20 uppercase tracking-[0.3em]">Built by engineer for engineer</p>
        </footer>
      </main>

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
    </div>
  );
}
