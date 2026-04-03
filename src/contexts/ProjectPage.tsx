"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

import { AvatarMember } from '@/components/ui/Avatar';

export interface ProjectTime {
  type: 'justNow' | 'hours' | 'days';
  value?: number;
}

export interface ProjectData {
  id: string;
  title: string;
  tags: string[];
  updatedAt: ProjectTime | string; // Support both for flexibility
  members: AvatarMember[];
  extraCount: number;
}

interface ProjectPageContextType {
  selectedProject: ProjectData | null;
  setSelectedProject: (project: ProjectData | null) => void;
}

const ProjectPageContext = createContext<ProjectPageContextType>({
  selectedProject: null,
  setSelectedProject: () => {},
});

export const ProjectPage = ({ children }: { children: ReactNode }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  return (
    <ProjectPageContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectPageContext.Provider>
  );
};

export const useProjectPage = () => useContext(ProjectPageContext);
