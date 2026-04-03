import React from 'react';
import { BookOpen, DraftingCompass, Rocket, Palette, Eye } from 'lucide-react';
import Badge from '../Badge';

export interface Template {
  title: string;
  desc: string;
  longDesc: string;
  category: string;
  image?: string;
  isNew?: boolean;
}

interface TemplateCardProps {
  template: Template;
  index: number;
  onClick: () => void;
  onApply?: (template: Template) => void;
  viewLabel: string;
  applyLabel?: string;
  newLabel: string;
}

const icons = [BookOpen, DraftingCompass, Rocket, Palette];
const iconColors = ['text-primary/70', 'text-primary/40', 'text-tertiary/40', 'text-secondary/40'];

export default function TemplateCard({ template, index, onClick, onApply, viewLabel, applyLabel, newLabel }: TemplateCardProps) {
  const IconComponent = icons[index % icons.length] || BookOpen;
  
  return (
    <div
      className="min-w-[260px] h-32 bg-white rounded-xl p-5 flex flex-col justify-between snap-start group cursor-pointer transition-all active:scale-[0.98] border border-outline-variant/20 hover:shadow-md hover:border-outline-variant/40 relative overflow-hidden"
      onClick={onClick}
    >
      <div className="flex justify-between items-start relative z-10 transition-opacity duration-200 group-hover:opacity-0">
        <IconComponent className={`w-8 h-8 ${iconColors[index % iconColors.length] || 'text-on-surface-variant'}`} strokeWidth={1.5} />
        {template.isNew && (
          <Badge variant="outline" colorClassName="text-on-surface-variant/60 border-outline-variant/30">
            {newLabel}
          </Badge>
        )}
      </div>
      <div className="relative z-10 transition-opacity duration-200 group-hover:opacity-0">
        <h3 className="text-base font-medium tracking-tight text-on-surface leading-snug">
          {template.title}
        </h3>
        <p className="text-xs text-on-surface-variant/60 mt-1 line-clamp-1 transition-colors group-hover:text-on-surface-variant/30">
          {template.desc}
        </p>
      </div>

      {/* Hover Overlay Action Area */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-6 translate-y-2 group-hover:translate-y-0">
        {onApply ? (
          <>
            <button 
              className="w-full bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white py-2 rounded-full font-bold text-xs shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              onClick={(e) => { e.stopPropagation(); onApply(template); }}
            >
              <Rocket size={14} strokeWidth={2.5} />
              {applyLabel || "Apply"}
            </button>
            <button 
              className="w-full py-2 rounded-full font-bold text-xs text-on-surface-variant/70 hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
              <Eye size={14} strokeWidth={2.5} />
              {viewLabel}
            </button>
          </>
        ) : (
          <button 
            className="w-full bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white py-2.5 rounded-full font-bold text-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            <Eye size={18} strokeWidth={2.5} />
            {viewLabel}
          </button>
        )}
      </div>
    </div>
  );
}
