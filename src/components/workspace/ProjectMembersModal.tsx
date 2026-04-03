"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, UserMinus, Lock, Link as LinkIcon, Check, Info } from 'lucide-react';
import Portal from "@/components/ui/Portal";
import Avatar from "@/components/ui/Avatar";

type Member = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
};

interface ProjectMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export default function ProjectMembersModal({ isOpen, onClose, projectName }: ProjectMembersModalProps) {
  const { t } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  // Hardcoded member database layout for simulation
  const members: Member[] = [
    { id: '1', name: 'Aaron W.', email: 'aaron.w@kukutech.com', joinedAt: '2025-10-12' },
    { id: '2', name: 'Kuku Admin', email: 'admin@kukutech.com', joinedAt: '2025-10-14' },
    { id: '3', name: 'Design Lead', email: 'design@kukutech.com', joinedAt: '2025-11-01' },
    { id: '4', name: 'Tech Engineer', email: 'dev@kukutech.com', joinedAt: '2026-01-05' },
  ];

  if (!isOpen) return null;

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden outline-none">
        <div 
          className="bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.18)] w-full max-w-lg overflow-hidden flex flex-col border border-white/60 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()} 
        >
          
          {/* Header Section */}
          <div className="px-8 py-6 flex items-center justify-between border-b border-black/5">
            <div>
              <h3 className="text-xl font-black tracking-tight text-on-surface">{t.memberModal.title}</h3>
              <p className="text-xs text-on-surface/40 font-bold uppercase tracking-widest mt-1 max-w-[300px] truncate">
                {projectName}
              </p>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-full hover:bg-black/5 text-on-surface/20 hover:text-on-surface transition-all active:scale-90">
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Sharing Hint Section */}
          <div className="px-8 py-4 bg-primary/5 border-b border-primary/10 flex items-start gap-3">
            <div className="mt-0.5 text-primary">
              <Info size={16} strokeWidth={2.5} />
            </div>
            <p className="text-[13px] font-medium text-primary/80 leading-relaxed">
              {t.memberModal.shareHint}
            </p>
          </div>
 
          {/* Dynamic Member Roster */}
          <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-4 py-4 hover:bg-black/5 rounded-[20px] group transition-all active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  <Avatar 
                    name={member.name}
                    size="lg"
                  />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-black text-on-surface">{member.name}</span>
                    <span className="text-[11px] font-bold text-on-surface/30 lowercase tracking-wider">{member.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end mr-1 opacity-40">
                    <span className="text-[9px] uppercase font-black tracking-[0.15em] mb-0.5">
                      {t.memberModal.joined}
                    </span>
                    <span className="text-[11px] font-bold">
                      {member.joinedAt}
                    </span>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100">
                    <UserMinus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
 
          {/* Footer Link & Security Bar */}
          <div className="px-8 py-6 bg-black/[0.02] border-t border-black/5 flex justify-between items-center mt-2">
            <div className="flex items-center gap-2 text-on-surface/40">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Lock size={14} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                {t.memberModal.workspaceType}
              </span>
            </div>
            
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                isCopied 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-[#111827] text-white hover:shadow-black/20'
              }`}
            >
              {isCopied ? <Check size={16} strokeWidth={3} /> : <LinkIcon size={16} strokeWidth={3} />}
              {isCopied ? t.common.copied : t.memberModal.copyLink}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
