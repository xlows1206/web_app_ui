"use client";

import React from "react";
import { X, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import FilePreviewModal from "./FilePreviewModal";
import { getFileIconInfo, truncateMiddle } from "@/lib/fileUtils";

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
    <div
      className={`flex items-center gap-1.5 ${iconInfo.muted} px-2 py-0.5 rounded-lg transition-all group overflow-hidden select-none hover:brightness-95`}
    >
      <div className={`shrink-0 ${iconInfo.color}`}>
        <Icon size={12} strokeWidth={3} />
      </div>
      <span className={`text-[11px] font-semibold ${iconInfo.color} whitespace-nowrap overflow-hidden flex-1 min-w-0 max-w-[240px] tracking-tight uppercase`} title={file.name}>
        {truncateMiddle(file.name, 32)}
      </span>
      
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          className={`w-4 h-4 flex items-center justify-center ${iconInfo.color} opacity-40 hover:opacity-100 transition-opacity ml-0.5`}
          title={t.common.delete}
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};
