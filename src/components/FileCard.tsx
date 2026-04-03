"use client";

import React from "react";
import { X, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import FilePreviewModal from "./FilePreviewModal";
import { getFileIconInfo } from "@/lib/fileUtils";

export interface AttachedFile {
  id: string;
  name: string;
  type: string; // 'pdf' | 'image' | 'word' | 'other'
  label?: string; // e.g., '流程图', '进料工况'
}

interface FileCardProps {
  file: AttachedFile;
  onRemove?: (id: string) => void;
  showRemove?: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onRemove, showRemove = true }) => {
  const { t } = useLanguage();
  
  const iconInfo = getFileIconInfo(file.name);
  const Icon = iconInfo.icon;

  const isPfd = file.label === t.document.pfd;
  const isFeeds = file.label === t.document.feeds;

  return (
    <>
      <div
        className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/60 px-3 py-2 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group active:scale-95 overflow-hidden"
      >
        {file.label && (
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors ${
            isPfd || file.label === '流程图' || file.label === 'PFD' 
              ? 'bg-cyan-50/50 text-cyan-700 border-cyan-200' 
              : isFeeds || file.label === '进料工况' || file.label === 'Feeds'
              ? 'bg-amber-50/50 text-amber-700 border-amber-200'
              : 'bg-surface-container-high text-on-surface-variant/70 border-outline-variant/30'
          }`}>
            {file.label}
          </span>
        )}
        <div className={`p-1.5 rounded-lg shrink-0 ${iconInfo.bg} ${iconInfo.color}`}>
          <Icon size={14} />
        </div>
        <span className="text-[12px] font-bold text-on-surface truncate flex-1 min-w-0 max-w-[120px]">
          {file.name}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {showRemove && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(file.id);
              }}
              className="w-6 h-6 flex items-center justify-center bg-red-50 text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all active:scale-90"
              title={t.common.delete}
            >
              <X size={12} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
