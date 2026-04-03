"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Badge from "../Badge";
import ProjectTag from "../ProjectTag";
import IconButton from "../IconButton";
import AvatarGroup from "../AvatarGroup";
import Avatar, { AvatarMember } from "../Avatar";
import ProjectMembersModal from "../../workspace/ProjectMembersModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjectPage } from "@/contexts/ProjectPage";
import { MoreVertical, Users, Edit2, Trash2 } from 'lucide-react';
import type { ProjectData } from "@/components/workspace/ActiveProjectsSection";

interface Tag {
  label: string;
  colorClass: string;
}

interface ProjectCardProps {
  projectData: ProjectData;
  title: string;
  tags: Tag[];
  updatedAt: string;
  members: AvatarMember[];
  extraCount: number;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
}

export default function ProjectCard({
  projectData,
  title,
  tags,
  updatedAt,
  members,
  extraCount,
  onDelete,
  onRename
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useLanguage();
  const { setSelectedProject } = useProjectPage();
  const router = useRouter();

  const handleCardClick = () => {
    if (isMenuOpen || isEditing) return;
    setSelectedProject(projectData);
    router.push("/project");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative w-full h-[180px] rounded-[24px] p-5 flex flex-col justify-between cursor-pointer bg-surface-container-low shadow-sm border border-outline-variant/30 transition-all duration-300 ${isMenuOpen ? 'z-50 shadow-xl border-outline-variant/50' : 'hover:shadow-xl hover:-translate-y-1.5 hover:border-outline-variant/50 z-auto'}`}>
        
        {/* Editorial Pulse Style Visuals (Constrained to prevent menu clipping) */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:scale-125 group-hover:bg-primary/20 transition-all duration-700"></div>
        </div>

        <div className="flex flex-col gap-3 relative z-20">
          <div className="flex justify-between items-start w-full relative" ref={menuRef}>
            {isEditing ? (
              <input
                autoFocus
                className="text-[17px] font-bold text-on-surface bg-white/50 border border-primary/30 rounded px-2 py-0.5 outline-none w-full"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => {
                  setIsEditing(false);
                  if (editTitle.trim() && editTitle !== title) onRename?.(editTitle);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditing(false);
                    if (editTitle.trim() && editTitle !== title) onRename?.(editTitle);
                  }
                }}
              />
            ) : (
              <h3 className="text-[17px] font-medium text-on-surface tracking-tight line-clamp-2 leading-tight pr-8">
                {title}
              </h3>
            )}
            
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
              className="p-1 -mr-2 -mt-1 opacity-70 group-hover:opacity-100 hover:bg-surface-container rounded-full transition-colors active:scale-95 shrink-0 flex items-center justify-center"
            >
              <MoreVertical size={20} strokeWidth={2.5} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-outline-variant/30 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-5 pt-4 pb-3 border-b border-outline-variant/10 bg-surface-container-low/50 mb-1 cursor-default flex flex-col gap-2.5">
                  <p className="text-[10px] uppercase font-extrabold text-on-surface-variant/70 tracking-wider">
                    {t.menu.projectSource}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <Avatar 
                      name="Kuku Admin" 
                      size="sm" 
                    />
                    <div className="flex flex-col">
                      <p className="text-xs font-black text-on-surface leading-tight break-all">Kuku Admin</p>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 opacity-90">
                        {t.menu.created}{" "}
                        <span className="font-mono">2026-10-14</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsModalOpen(true); }}
                  className="w-full text-left px-5 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-3"
                >
                  <Users size={18} className="opacity-70" strokeWidth={2} />
                  <div className="flex flex-col">
                    <span>{t.projectMenu.members}</span>
                    <span className="text-[10px] text-on-surface-variant/60 font-normal leading-tight">
                      {t.projectMenu.membersHint}
                    </span>
                  </div>
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsEditing(true); }}
                  className="w-full text-left px-5 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-3"
                >
                  <Edit2 size={18} className="opacity-70" strokeWidth={2} />
                  {t.projectMenu.rename}
                </button>
                
                <div className="h-[1px] bg-outline-variant/20 my-1 mx-4"></div>
                
                <button 
                  onClick={() => { setIsMenuOpen(false); onDelete?.(); }}
                  className="w-full text-left px-5 pt-3 pb-4 text-sm font-bold text-error hover:bg-error/10 transition-colors flex items-center gap-3"
                >
                  <Trash2 size={18} strokeWidth={2} />
                  {t.projectMenu.delete}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <ProjectTag key={i} type={tag.label} labelOverride={tag.label} />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-outline-variant/20 pt-3 mt-4 relative z-10">
          <AvatarGroup members={members} extraCount={extraCount} />
          <span className="text-xs font-medium text-on-surface-variant/70">
            {updatedAt}
          </span>
        </div>
      </div>
      
      {/* Detached Modal Instance scoped to this card's lifecycle */}
      <ProjectMembersModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projectName={title} 
      />
    </>
  );
}
