"use client";

import React, { useState, useEffect } from 'react';
import ProjectCard from '../ui/ProjectCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';
import CreateProjectModal from './CreateProjectModal';

import Avatar, { AvatarMember } from '../ui/Avatar';

export interface ProjectTime {
  type: 'justNow' | 'hours' | 'days';
  value?: number;
}

export interface ProjectData {
  id: string;
  title: string;
  tags: string[];
  updatedAt: ProjectTime;
  members: AvatarMember[];
  extraCount: number;
}

export default function ActiveProjectsSection() {
  const { t } = useLanguage();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  // Member name pool for randomization
  const memberPool: AvatarMember[] = [
    { name: 'Aaron W.' }, { name: 'Kuku Admin' }, { name: 'Design Lead' },
    { name: 'Tech Engineer' }, { name: 'John Doe' }, { name: 'Jane Smith' },
    { name: 'Sarah Connor' }, { name: 'Mike Ross' }, { name: 'Harvey Specter' }
  ];

  // Initial load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('procagent_projects_v2');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      // Default mock data if empty
      const defaultProjects: ProjectData[] = t.projects.items.map((p, idx) => ({
        id: `default-${idx}`,
        title: p.title,
        tags: p.tags,
        updatedAt: { type: 'hours', value: 2 },
        members: memberPool.slice(idx * 2, idx * 2 + 3),
        extraCount: [8, 3, 12][idx] || 0
      }));
      setProjects(defaultProjects);
      localStorage.setItem('procagent_projects_v2', JSON.stringify(defaultProjects));
    }
  }, [t.projects.items]);

  const saveToLocal = (newProjects: ProjectData[]) => {
    setProjects(newProjects);
    localStorage.setItem('procagent_projects_v2', JSON.stringify(newProjects));
  };

  const handleCreateProject = (data: { title: string; type: string }) => {
    const newProj: ProjectData = {
      id: Date.now().toString(),
      title: data.title,
      tags: [data.type === 'simulation' ? 'Simulation' : '3D Piping'],
      updatedAt: { type: 'justNow' },
      members: memberPool.sort(() => 0.5 - Math.random()).slice(0, 3),
      extraCount: 1
    };
    saveToLocal([newProj, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    saveToLocal(projects.filter(p => p.id !== id));
  };

  const handleRenameProject = (id: string, newTitle: string) => {
    saveToLocal(projects.map(p => p.id === id ? { ...p, title: newTitle } : p));
  };

  const translateTag = (tag: string) => {
    const normalized = tag.toUpperCase();
    if (normalized === '3D PIPING' || normalized === '3D配管') return t.projects.tags.piping;
    if (normalized === 'SIMULATION' || normalized === '仿真') return t.projects.tags.simulation;
    return tag;
  };

  const formatTime = (time: ProjectTime) => {
    if (time.type === 'justNow') return t.common.justNow;
    const unit = time.type === 'hours' ? t.projects.ago : t.projects.daysAgo;
    return `${time.value} ${unit}`;
  };

  return (
    <section className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight text-on-surface">{t.projects.title}</h2>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white px-5 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-[18px] h-[18px]" strokeWidth={3} /> {t.projects.add}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            projectData={project}
            title={project.title}
            tags={project.tags.map((lbl) => ({ 
              label: lbl, 
              colorClass: '' // No longer used by ProjectCard
            }))}
            updatedAt={`${t.projects.updated} ${formatTime(project.updatedAt)}`}
            members={project.members}
            extraCount={project.extraCount}
            onDelete={() => handleDeleteProject(project.id)}
            onRename={(newTitle) => handleRenameProject(project.id, newTitle)}
          />
        ))}
      </div>

      <CreateProjectModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onCreate={handleCreateProject}
      />
    </section>
  );
}
