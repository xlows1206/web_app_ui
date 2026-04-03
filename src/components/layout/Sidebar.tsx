"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Plus, Home, ArrowRight, FolderKanban, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Search, ChevronDown, MessageSquare, Box, Activity } from "lucide-react";



export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({"p1": true});

  useEffect(() => {
    const fetchProjects = () => {
      const saved = localStorage.getItem("procagent_projects");
      if (saved) {
        setProjects(JSON.parse(saved));
      } else {
        // Fallback to initial mock if empty
        const initialMock = [
          {
            id: "p1",
            name: "Alpha Simulation",
            type: "simulation",
            sessions: [
              { id: "s1", name: "Initial Setup" },
              { id: "s2", name: "Parameter Tuning" },
            ]
          },
          {
            id: "p2",
            name: "Site Piping 3D",
            type: "piping",
            sessions: [
              { id: "s3", name: "Routing A" },
              { id: "s4", name: "Clash Check" },
            ]
          }
        ];
        localStorage.setItem("procagent_projects", JSON.stringify(initialMock));
        setProjects(initialMock);
      }
    };

    fetchProjects();

    const handleUpdate = () => fetchProjects();
    window.addEventListener("procagent_project_updated", handleUpdate);
    window.addEventListener("procagent_context_updated", handleUpdate);
    return () => {
      window.removeEventListener("procagent_project_updated", handleUpdate);
      window.removeEventListener("procagent_context_updated", handleUpdate);
    };
  }, []);

  const recentSessions = React.useMemo(() => {
    const all: any[] = [];
    projects.forEach(p => {
      if (p.sessions) {
        p.sessions.forEach((s: any) => {
          all.push({ ...s, projectId: p.id, projectName: p.name });
        });
      }
    });
    return all.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 5);
  }, [projects]);

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };
  const filteredProjects = projects.filter(p => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out glass-panel z-[60] flex flex-col font-sans border-r ${
        isCollapsed ? "w-[80px]" : "w-[280px]"
      }`}
      style={{ borderRightColor: "var(--color-glass-border)" }}
    >
      {/* Brand / Logo Area */}
      <div className={`p-4 flex items-center justify-between gap-3 ${isCollapsed ? "flex-col gap-4 px-2" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="w-full h-auto object-contain" />
          </div>
          {!isCollapsed && (
            <span className="font-black text-lg tracking-tighter text-on-surface animate-in fade-in duration-300">
              ProcAgent
            </span>
          )}
        </div>
        
        <button 
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg hover:bg-black/5 text-on-surface/50 hover:text-primary transition-all active:scale-90 ${isCollapsed ? "mt-2" : ""}`}
          title={isCollapsed ? t.sidebar.expand : t.sidebar.collapse}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Main Navigation Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 pb-4">
        
        {/* Top Links */}
        <nav className={`px-4 space-y-1 ${isCollapsed ? "px-2" : ""}`}>
          <Link
            href="/"
            title={isCollapsed ? t.sidebar.home : undefined}
            className={`flex items-center gap-3 rounded-xl transition-all group relative ${
              isCollapsed ? "w-10 h-10 p-0 justify-center mx-auto" : "px-3 py-2.5"
            } ${pathname === "/" ? "bg-black/5 text-primary font-bold" : "text-on-surface/70 hover:bg-black/5 hover:text-primary"}`}
          >
            <Home size={18} className="shrink-0" />
            {!isCollapsed && <span className="text-sm">{t.sidebar.home}</span>}
          </Link>

          <Link
            href="/projects"
            title={isCollapsed ? t.sidebar.projects : undefined}
            className={`flex items-center gap-3 rounded-xl transition-all group relative ${
              isCollapsed ? "w-10 h-10 p-0 justify-center mx-auto" : "px-3 py-2.5"
            } ${pathname === "/projects" ? "bg-black/5 text-primary font-bold" : "text-on-surface/70 hover:bg-black/5 hover:text-primary"}`}
          >
            <FolderKanban size={18} className="shrink-0" />
            {!isCollapsed && <span className="text-sm">{t.sidebar.projects}</span>}
          </Link>
        </nav>

        {/* Sections (Only show if expanded) */}
        {!isCollapsed && (
          <div className="px-4 flex flex-col gap-6 flex-1 overflow-hidden">
            
            {/* Recent Sessions */}
            {recentSessions.length > 0 && (
              <div className="shrink-0 border-t border-black/5 pt-4">
                <div className="flex items-center justify-between px-3 text-xs font-bold text-on-surface/40 uppercase tracking-wider mb-2">
                  <span>{t.sidebar.recent}</span>
                </div>
                <div className="space-y-1">
                  {recentSessions.map((session, i) => (
                    <button 
                      key={`${session.id}-${i}`}
                      onClick={() => {
                         localStorage.setItem("procagent_active_project_id", session.projectId);
                         localStorage.setItem("procagent_active_session_id", session.id);
                         window.dispatchEvent(new Event("procagent_context_updated"));
                         router.push('/chat');
                      }}
                      className="group flex flex-col justify-center w-full px-3 py-2.5 rounded-xl text-[13px] transition-all hover:bg-black/5 text-on-surface/70 active:scale-95 text-left"
                    >
                      <div className="flex items-center gap-2 truncate mb-1">
                        <MessageSquare size={14} className="shrink-0 opacity-40 group-hover:text-primary group-hover:opacity-100 transition-colors" />
                        <span className="font-bold truncate group-hover:text-primary transition-colors">{session.name}</span>
                      </div>
                      <div className="pl-[22px] flex items-center">
                         <span className="text-[10px] bg-black/5 text-on-surface/50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider truncate">
                           {session.projectName}
                         </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Area */}
      <div className={`p-4 border-t border-black/5 flex flex-col gap-1 ${isCollapsed ? "items-center px-2" : "items-start"}`}>
        <div className="flex items-center gap-2 text-[10px] text-on-surface/40 font-bold tracking-widest uppercase">
          {!isCollapsed && <span>&copy; {new Date().getFullYear()} KUKUTECH</span>}
        </div>
        <div className={`text-[9px] text-on-surface/20 font-black uppercase tracking-wider ${isCollapsed ? "text-center" : ""}`}>
          {isCollapsed ? "V1.0.0" : t.menu.version}
        </div>
      </div>
    </aside>
  );
}
