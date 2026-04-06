import React, { useState } from "react";
import { Activity, Box, FileText, ShieldAlert, MoreHorizontal, ArrowRight, Pencil, Copy, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AvatarGroup from "../AvatarGroup";
import GlassActionMenu, { ActionItem } from "../GlassActionMenu";

interface ProjectCardProps {
  project: any;
  onClick: () => void;
  onRename: (newName: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function ProjectCard({
  project,
  onClick,
  onRename,
  onDuplicate,
  onDelete
}: ProjectCardProps) {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(project.name);

  const handleRenameSubmit = () => {
    if (editValue.trim() && editValue !== project.name) {
      onRename(editValue);
    }
    setIsEditing(false);
  };

  const menuActions: ActionItem[] = [
    {
      id: "rename",
      label: t.common.rename,
      icon: <Pencil size={16} />,
      onClick: () => {
        setIsEditing(true);
        setEditValue(project.name);
      }
    },
    {
      id: "duplicate",
      label: t.projectMenu.duplicate,
      icon: <Copy size={16} />,
      onClick: onDuplicate
    },
    {
      id: "delete",
      label: t.projectMenu.delete,
      icon: <Trash2 size={16} />,
      variant: "danger",
      onClick: onDelete
    }
  ];

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className="group relative flex flex-col p-6 glass-panel rounded-[32px] text-left transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95 border-white/60 hover:border-primary/30 w-full cursor-pointer"
      >
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              project.type === "simulation"
                ? "bg-blue-500/10 text-blue-600"
                : project.type === "piping"
                ? "bg-orange-500/10 text-orange-600"
                : project.type === "pid"
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-rose-500/10 text-rose-600"
            }`}
          >
            {project.type === "simulation" && <Activity size={28} />}
            {project.type === "piping" && <Box size={28} />}
            {project.type === "pid" && <FileText size={28} />}
            {project.type === "hazop" && <ShieldAlert size={28} />}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-2.5 rounded-xl hover:bg-black/5 text-[#111827]/20 hover:text-[#111827] transition-all active:scale-90"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-1 mb-6 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                project.type === "simulation"
                  ? "bg-blue-500/10 text-blue-600"
                  : project.type === "piping"
                  ? "bg-orange-500/10 text-orange-600"
                  : project.type === "pid"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600"
              }`}
            >
              {t.projects.tags[project.type as keyof typeof t.projects.tags] || project.type}
            </span>
            <span className="text-[10px] font-medium text-on-surface/30 tracking-widest">
              {project.updatedAtValue
                ? `${project.updatedAtValue}${t.projects.ago}`
                : t.common.justNow}
            </span>
          </div>

          {isEditing ? (
            <input
              autoFocus
              className="text-xl font-black text-primary bg-white/50 border-b-2 border-primary outline-none w-full"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="text-xl font-black text-on-surface group-hover:text-primary transition-colors line-clamp-2">
              {project.name}
            </h3>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-on-surface/5">
          <AvatarGroup members={project.members || []} size="sm" />
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      <GlassActionMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        actions={menuActions}
      />
    </div>
  );
}
