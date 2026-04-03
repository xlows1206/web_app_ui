"use client";

import React from "react";
import { FileCard, type AttachedFile } from "./FileCard";

interface AttachmentListProps {
  files: AttachedFile[];
  onRemove?: (id: string) => void;
  showRemove?: boolean;
  columns?: 1 | 2;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({ 
  files, 
  onRemove, 
  showRemove = true,
  columns = 2
}) => {
  if (files.length === 0) return null;

  return (
    <div className={`grid gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
      columns === 2 ? "grid-cols-2" : "grid-cols-1"
    }`}>
      {files.map((file) => (
        <FileCard 
          key={file.id} 
          file={file} 
          onRemove={onRemove} 
          showRemove={showRemove} 
        />
      ))}
    </div>
  );
};
