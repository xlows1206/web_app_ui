"use client";

import React from "react";
import { Bell, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
}

export default function NotificationPermissionModal({
  isOpen,
  onClose,
  onAllow,
}: NotificationPermissionModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 ease-out">
        
        {/* Decorative Background Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-8 flex flex-col items-center text-center">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#111827]/20 hover:text-[#111827] hover:bg-black/5 rounded-full transition-all"
          >
            <X size={20} />
          </button>

          {/* Icon Container */}
          <div className="w-20 h-20 bg-[#111827]/5 rounded-[28px] flex items-center justify-center mb-6 relative p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-2xl font-black text-[#111827] mb-3 tracking-tight">
            {t.notificationModal.title}
          </h2>
          
          <p className="text-[15px] text-[#111827]/60 font-medium leading-relaxed mb-8 px-2">
            {t.notificationModal.desc}
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onAllow}
              className="w-full py-4 bg-[#111827] text-white rounded-2xl font-bold text-[15px] shadow-[0_12px_24px_-8px_rgba(17,24,39,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(17,24,39,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              {t.notificationModal.allow}
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 text-[#111827]/40 font-bold text-[15px] hover:text-[#111827] transition-colors"
            >
              {t.notificationModal.ignore}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
