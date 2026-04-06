import React, { useEffect, useRef } from "react";
import Avatar from "../Avatar";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  variant?: "default" | "danger";
}

interface GlassActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  adminName?: string;
  createdAt?: string;
  actions: ActionItem[];
  className?: string; // For positioning
}

export default function GlassActionMenu({
  isOpen,
  onClose,
  adminName,
  createdAt = "2026-10-14",
  actions,
  className = "absolute top-20 right-6"
}: GlassActionMenuProps) {
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`${className} w-56 bg-white/90 backdrop-blur-3xl border border-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Meta-Data Immersion Header */}
      <div className="px-5 pt-4 pb-3 border-b border-black/5 bg-black/[0.03] mb-1 flex flex-col gap-2.5">
        <p className="text-[10px] uppercase font-black text-on-surface/40 tracking-wider">
          {t.projectMenu.source}
        </p>
        <div className="flex items-center gap-3">
          <Avatar name={adminName || "K"} size="sm" />
          <div className="flex flex-col">
            <p className="text-xs font-black text-on-surface leading-tight">
              {adminName || t.nav.adminName}
            </p>
            <p className="text-[10px] text-on-surface/50 font-bold mt-0.5">
              {t.menu.created} {createdAt}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2 space-y-1">
        {actions.map((action, idx) => (
          <React.Fragment key={action.id}>
            <button
              onClick={(e) => {
                action.onClick(e);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all text-left ${
                action.variant === "danger"
                  ? "text-red-500 hover:bg-red-50"
                  : "text-on-surface/70 hover:bg-black/5 hover:text-primary"
              }`}
            >
              {action.icon && <span className="opacity-40">{action.icon}</span>}
              {action.label}
            </button>
            {/* Splitter if needed (e.g. before the last danger action) */}
            {idx < actions.length - 1 && actions[idx + 1].variant === "danger" && (
              <div className="h-px bg-black/5 my-1 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
