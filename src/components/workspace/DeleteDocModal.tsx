"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

interface DeleteDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  docName: string;
}

export default function DeleteDocModal({ isOpen, onClose, onConfirm, docName }: DeleteDocModalProps) {
  const { t } = useLanguage();
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const isMatched = confirmText === docName;

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-250 z-10">
        {/* Header */}
        <div className="px-8 pt-7 pb-5 flex justify-between items-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-error mb-1">
            <AlertTriangle size={24} strokeWidth={2.5} />
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95 absolute right-6 top-6"
          >
            <X size={20} className="text-on-surface-variant/60" strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">{t.deleteDocModal.title}</h2>
          <p className="text-sm text-on-surface-variant/70 mt-3 leading-relaxed font-medium">
            {t.deleteDocModal.warning}
          </p>
          
          <div className="mt-6 p-4 rounded-2xl bg-transparent">
            <p className="text-[11px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2.5">{t.deleteDocModal.inputPrompt}</p>
            <p className="text-sm font-bold text-on-surface mb-3 select-none px-1">{docName}</p>
            <input
              autoFocus
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={t.deleteDocModal.inputPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-error/30 focus:ring-4 focus:ring-error/5 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-surface-container-lowest flex flex-col gap-3">
          <button
            disabled={!isMatched}
            onClick={() => {
              onConfirm();
              setConfirmText("");
            }}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95
              ${isMatched 
                ? 'bg-error text-white shadow-lg shadow-error/20' 
                : 'bg-on-surface-variant/10 text-on-surface-variant/30 cursor-not-allowed opacity-50'
              }`}
          >
            <Trash2 size={16} strokeWidth={2.5} />
            {t.deleteDocModal.confirmButton}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm text-on-surface-variant/60 hover:bg-surface-container-high transition-colors active:scale-95"
          >
            {t.common.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
