"use client";

import React from 'react';
import Badge from '../Badge';
import { useLanguage } from '@/contexts/LanguageContext';

export type ProjectTagType = 'simulation' | 'piping' | string;

interface ProjectTagProps {
  type: ProjectTagType;
  className?: string;
  // Option to override label if needed, but defaults to localized simulation/piping
  labelOverride?: string;
}

/**
 * Unified Project Tag component
 * Follows the visual style of the home page project cards:
 * - Rounded pill (Badge variant="pill")
 * - White background with subtle shadow
 * - Desaturated text colors
 */
export default function ProjectTag({ 
  type, 
  className = '',
  labelOverride
}: ProjectTagProps) {
  const { t } = useLanguage();
  
  const normalized = type.toUpperCase();
  const isSimulation = normalized.includes('SIMULATION') || normalized === '仿真';
  const isPiping = normalized.includes('PIPING') || normalized === '3D配管' || normalized === '3D PIPING';
  
  let label = labelOverride || type;
  let colorClass = 'text-[#64748b]'; // Default gray-ish
  
  if (isSimulation) {
    label = labelOverride || t.projects.tags.simulation;
    colorClass = 'text-[#475569]'; // Slightly darker desaturated blue/gray
  } else if (isPiping) {
    label = labelOverride || t.projects.tags.piping;
    colorClass = 'text-[#64748b]'; // Slate-ish
  }
  
  return (
    <Badge 
      variant="pill" 
      colorClassName={colorClass} 
      className={className}
    >
      {label}
    </Badge>
  );
}
