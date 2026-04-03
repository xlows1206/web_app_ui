"use client";

import React, { useEffect } from "react";
import { X, FileText, Image as ImageIcon, Download, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Portal from "./ui/Portal";
import { AttachedFile } from "./FileCard";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: AttachedFile | null;
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  file,
}: FilePreviewModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  const isImage = file.type === 'image';
  const isPDF = file.type === 'pdf';

  // Mock URL for demonstration since we don't have a real backend/storage yet
  // In a real app, this would be a signed URL or a blob URL
  const fileUrl = `/mock-files/${file.name}`; 

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[10005] w-screen h-screen flex items-center justify-center p-4 md:p-10 overflow-hidden outline-none"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
          onClick={onClose}
        />

        <div className="relative w-full max-w-5xl h-full bg-surface-container-low rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] border border-outline-variant/10 overflow-hidden animate-in zoom-in-95 duration-300 z-10 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-xl ${
                isPDF ? 'bg-error/10 text-error' :
                isImage ? 'bg-primary/10 text-primary' :
                'bg-surface-container-high text-on-surface-variant'
              }`}>
                {isPDF ? <FileText size={20} /> :
                 isImage ? <ImageIcon size={20} /> :
                 <FileText size={20} />}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-on-surface truncate">
                  {file.name}
                </h2>
                {file.label && (
                   <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                     {file.label}
                   </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant/70 transition-colors"
                title={t.common.download}
              >
                <Download size={20} />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-error/10 text-on-surface-variant/70 hover:text-error transition-colors active:scale-95"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-surface-container-lowest flex items-center justify-center p-4">
            {isImage ? (
              <img
                src={fileUrl}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // Fallback for mock images
                  e.currentTarget.src = "https://placehold.co/800x600/f8fafc/474db3?text=" + encodeURIComponent(file.name);
                }}
              />
            ) : isPDF ? (
              <iframe
                src={`${fileUrl}#toolbar=0`}
                className="w-full h-full border-none rounded-lg bg-white"
                title={file.name}
              />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-container-high flex items-center justify-center text-on-surface-variant/30">
                  <FileText size={40} />
                </div>
                <div>
                  <p className="text-lg font-bold text-on-surface">
                    {t.common.noMatch}
                  </p>
                  <p className="text-sm text-on-surface-variant/60">
                    预览暂不可用
                  </p>
                </div>
                <button className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                  {t.common.download}
                </button>
              </div>
            )}
          </div>

          {/* Footer/Actions */}
          <div className="px-6 py-3 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex justify-end items-center gap-4">
            <span className="text-[11px] font-medium text-on-surface-variant/40">
              ProcAgent Secure Preview
            </span>
          </div>
        </div>
      </div>
    </Portal>
  );
}
