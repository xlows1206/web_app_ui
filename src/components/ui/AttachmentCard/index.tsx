import React, { useState, useRef, useEffect } from 'react';
import { File, FileText, Image, Trash2, Download, Eye, Plus, MoreHorizontal, Pencil } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { truncateMiddle } from '@/lib/fileUtils';

export type AttachmentCardProps = {
  id: string;
  name: string;
  size: string | number; // Support string like "129.3 KB" as seen in chat/page.tsx
  type: string;
  onRemove: (id: string) => void;
  onDownload?: (id: string) => void;
  onAdd?: (id: string) => void;
  onRename?: (id: string) => void;
  active?: boolean;
};

function getFileIcon(type: string, name: string) {
  const lowerName = name.toLowerCase();
  
  // PDF
  if (type === 'pdf' || lowerName.endsWith('.pdf')) {
    return (
      <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
        <FileText size={16} className="text-red-500" strokeWidth={2.5} />
      </div>
    );
  }
  
  // Image
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg'].some(ext => lowerName.endsWith(`.${ext}`))) {
    return (
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        <Image size={16} className="text-blue-500" strokeWidth={2.5} />
      </div>
    );
  }
  
  // Default / Other
  return (
    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
      <File size={16} className="text-slate-500" strokeWidth={2.5} />
    </div>
  );
}

function formatSize(size: string | number): string {
  if (typeof size === 'string') return size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Refactored AttachmentCard with Horizontal Pill Layout.
 */
export default function AttachmentCard({
  id,
  name,
  size,
  type,
  onRemove,
  onDownload,
  onAdd,
  onRename,
  active = false,
}: AttachmentCardProps) {
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const displayName = truncateMiddle(name, 48);

  return (
    <div className={`group relative flex items-start p-3 rounded-[22px] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98] ${
      active 
        ? 'bg-white border border-primary/30 shadow-primary/5' 
        : 'bg-white border border-black/5'
    } ${showMenu ? 'z-[50]' : 'z-auto'}`}>
      {/* File Icon */}
      {getFileIcon(type, name)}

      {/* File Info */}
      <div className="flex flex-col overflow-hidden flex-1 px-3">
        <span 
          className="text-[11px] font-bold text-[#111827] line-clamp-2 leading-tight transition-colors group-hover:text-primary break-all" 
          title={name}
        >
          {displayName}
        </span>
        <span className="text-[9px] text-[#111827]/30 font-black uppercase tracking-wider mt-0.5">
          {formatSize(size)}
        </span>
      </div>

      {/* Action Buttons Area */}
      <div className={`flex items-center gap-1.5 transition-opacity mt-1 ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {/* Plus Button: Add to Context */}
        {onAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.(id);
            }}
            className={`w-7 h-7 flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
              active 
                ? 'bg-primary text-white shadow-primary/20' 
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
            }`}
            title={active ? (t.common.remove_from_context || "Remove from Context") : (t.common.add_to_context || "Add to Context")}
          >
            {active ? <Download size={14} className="rotate-180" strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
          </button>
        )}

        {/* More Actions Menu Button */}
        <div className={`relative ${showMenu ? 'z-[110]' : ''}`} ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`w-7 h-7 flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
              showMenu ? 'bg-primary text-white' : 'bg-black/5 text-[#111827]/30 hover:bg-black/10 hover:text-[#111827]/60'
            }`}
          >
            <MoreHorizontal size={14} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-0 right-full mr-2 w-32 bg-white border border-black/10 rounded-[18px] shadow-2xl p-1.5 z-[120] animate-in fade-in zoom-in-95 duration-200">
              {onRename && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onRename?.(id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-[#111827]/60 hover:text-primary hover:bg-primary/5 rounded-[12px] transition-colors"
                >
                  <Pencil size={12} strokeWidth={2.5} />
                  {t.common.rename || "Rename"}
                </button>
              )}
              {onDownload && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDownload?.(id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-[#111827]/60 hover:text-primary hover:bg-primary/5 rounded-[12px] transition-colors"
                >
                  <Download size={12} strokeWidth={2.5} />
                  {t.common.download}
                </button>
              )}
              <div className="h-[1px] bg-black/5 my-1 mx-2" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onRemove(id);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-[12px] transition-colors"
              >
                <Trash2 size={12} strokeWidth={2.5} />
                {t.common.delete}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
