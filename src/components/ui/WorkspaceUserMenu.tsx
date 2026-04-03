"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, Globe, LogOut, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import UpgradeCreditsModal from "@/components/workspace/UpgradeCreditsModal";
import WorkspaceUserControls from "@/components/ui/WorkspaceUserControls";
import GradientStar from "./icons/GradientStar";

type WorkspaceUserMenuProps = {
  credit?: string;
  adminName?: string;
  avatarSrc: string;
  className?: string;
};

export default function WorkspaceUserMenu({
  credit = "200.00",
  adminName,
  avatarSrc,
  className = "",
}: WorkspaceUserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resolvedAdminName = adminName ?? t.nav.adminName;

  return (
    <>
      <div className={`relative ${className}`} ref={menuRef}>
        <WorkspaceUserControls
          credit={credit}
          adminName={resolvedAdminName}
          avatarSrc={avatarSrc}
          isExpanded={isMenuOpen}
          onCreditClick={() => setIsUpgradeOpen(true)}
          onProfileClick={() => setIsMenuOpen((prev) => !prev)}
        />

        {isMenuOpen && (
          <div
            className="absolute right-0 top-full mt-4 w-72 bg-white rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-black/5 z-50 flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200 overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full text-left px-5 pt-5 pb-4 text-sm font-normal text-on-surface flex flex-col gap-1.5 cursor-default">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg leading-tight tracking-tight">{resolvedAdminName}</span>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#A7F3D0] to-[#BFDBFE] text-[#111827] rounded shadow-sm">
                  Pro
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface/20">admin@kukutech.com</span>
            </div>

            <div className="h-px bg-black/5 my-1 mx-4" />

            <div className="w-full px-5 py-3 text-sm font-normal text-on-surface flex justify-between items-center my-1">
              <div className="flex items-center gap-3">
                <GradientStar size={20} />
                <span className="font-bold text-[13px] text-on-surface/70 tracking-tight">{t.menu.aiCredit}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-on-surface tracking-tighter">{credit}</span>
                <button
                  onClick={() => {
                    setIsUpgradeOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-1.5 bg-[#111827] text-white text-[10px] font-bold rounded-full tracking-widest uppercase shadow-lg shadow-black/10 active:scale-95 transition-all"
                >
                  {t.menu.upgrade}
                </button>
              </div>
            </div>

            <div className="p-1 space-y-1">
                <button className="w-full text-left px-4 py-3 rounded-2xl text-[13px] font-bold text-on-surface/70 hover:bg-black/5 hover:text-primary transition-all flex justify-between items-center group">
                <div className="flex items-center gap-3">
                    <User size={18} className="opacity-40" strokeWidth={2.5} />
                    <span>{t.menu.editProfile}</span>
                </div>
                <ChevronRight size={18} className="opacity-0 group-hover:opacity-40 transition-opacity" strokeWidth={2.5} />
                </button>

                <div className="w-full px-4 py-3 rounded-2xl text-[13px] font-bold text-on-surface/70 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                    <Globe size={18} className="opacity-40" strokeWidth={2.5} />
                    <span>{t.menu.language}</span>
                </div>
                <div className="flex bg-black/[0.03] rounded-full p-1 shadow-inner">
                    <button
                        onClick={() => setLocale("zh")}
                        className={`px-4 py-1.5 text-[11px] font-bold uppercase rounded-full transition-all ${locale === "zh" ? "bg-white shadow-sm text-on-surface" : "text-on-surface/30 hover:text-on-surface"}`}
                    >
                        {t.menu.zh}
                    </button>
                    <button
                        onClick={() => setLocale("en")}
                        className={`px-4 py-1.5 text-[11px] font-bold uppercase rounded-full transition-all ${locale === "en" ? "bg-white shadow-sm text-on-surface" : "text-on-surface/30 hover:text-on-surface"}`}
                    >
                        {t.menu.en}
                    </button>
                </div>
                </div>
            </div>

            <div className="h-px bg-black/5 my-1 mx-4" />

            <button className="w-full text-left px-5 py-3.5 text-[13px] font-bold text-red-500/60 hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-3 rounded-2xl">
              <LogOut size={18} strokeWidth={2.5} />
              <span className="uppercase tracking-[0.1em]">{t.menu.logout}</span>
            </button>
          </div>
        )}
      </div>

      <UpgradeCreditsModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </>
  );
}
