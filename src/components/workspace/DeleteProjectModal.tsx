"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Portal from "@/components/ui/Portal";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

export default function DeleteProjectModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  projectName 
}: DeleteProjectModalProps) {
  const { t } = useLanguage();
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  // Case-insensitive matching for better UX while maintaining intentionality
  const isMatched = confirmText.toLowerCase() === projectName.toLowerCase();

  return (
    <Portal>
      <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Mesh Gradient Backdrop (Teal & Blue) */}
        <div
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-3xl animate-in fade-in duration-500 cursor-default"
          onClick={onClose}
        >
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#A7F3D0]/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#BFDBFE]/20 rounded-full blur-[80px] animate-pulse-slow delay-700"></div>
        </div>

        {/* Modal Container (Soft Glassmorphism) */}
        <div className="relative w-full max-w-[460px] bg-white/40 backdrop-blur-3xl rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden animate-in zoom-in-95 duration-300 z-10 flex flex-col">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/60 transition-all active:scale-90 border border-white/40"
          >
            <X size={20} className="text-[#111827]" strokeWidth={2.5} />
          </button>

          {/* Header & Warning */}
          <div className="px-10 pt-10 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 shadow-sm border border-red-500/10">
              <AlertTriangle size={28} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter uppercase leading-tight">
              Delete Project?
            </h2>
            <p className="text-[13px] font-bold text-[#111827]/50 mt-3 leading-relaxed uppercase tracking-wider">
              This action is irreversible. All documents, simulation data, and project history will be permanently erased.
            </p>
          </div>

          {/* Confirmation Input Section */}
          <div className="px-10 pb-8">
            <div className="p-5 rounded-2xl bg-[#111827]/05 border border-[#111827]/05">
              <label className="text-[10px] font-black text-[#111827]/30 uppercase tracking-[0.2em] mb-3 block">
                Type project name to confirm
              </label>
              
              <div className="text-sm font-black text-[#111827] mb-4 px-1 select-text cursor-text flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                <span className="break-all">{projectName}</span>
              </div>

              <input
                autoFocus
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Project Name..."
                className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-red-500/30 focus:ring-8 focus:ring-red-500/5 outline-none text-[15px] font-bold text-[#111827] transition-all placeholder:text-[#111827]/20 shadow-sm"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="px-10 py-8 bg-white/20 border-t border-white/60 flex flex-col gap-3">
            <button
              disabled={!isMatched}
              onClick={() => {
                onConfirm();
                setConfirmText("");
              }}
              className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95
                ${isMatched 
                  ? 'bg-red-500 text-white shadow-xl shadow-red-500/30 hover:bg-red-600' 
                  : 'bg-[#111827]/05 text-[#111827]/20 cursor-not-allowed border border-[#111827]/05'
                }`}
            >
              <Trash2 size={16} strokeWidth={2.5} />
              Confirm Delete
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-4 rounded-full font-black text-xs uppercase tracking-widest text-[#111827]/40 hover:bg-white/40 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
