import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
}

/**
 * A minimalist modal for editing the user's display name.
 * Follows Soft Glassmorphism design principles.
 * Uses React Portal to ensure global centering.
 */
export default function EditNameModal({
  isOpen,
  onClose,
  currentName,
  onSave
}: EditNameModalProps) {
  const { t } = useLanguage();
  const [newName, setNewName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNewName(currentName);
  }, [currentName]);

  if (!isOpen || !mounted) return null;

  const handleSave = async () => {
    if (!newName.trim() || newName === currentName) {
      onClose();
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    console.log("Saving new name:", newName);
    
    setTimeout(() => {
      onSave(newName);
      setIsSaving(false);
      onClose();
    }, 600);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.15)] w-full max-w-sm rounded-[32px] overflow-hidden flex flex-col p-8 animate-in fade-in zoom-in-95 duration-400">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#111827]/40">
              {t.menu.editProfile}
            </span>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/5 text-[#111827]/20 hover:text-[#111827] transition-all"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="text"
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-full bg-[#111827]/5 border-none outline-none px-5 py-4 rounded-2xl text-[16px] font-bold text-[#111827] placeholder:text-[#111827]/40 focus:ring-2 focus:ring-[#111827]/5 transition-all"
                placeholder="Enter new name..."
              />
            </div>
            
            <button 
              onClick={handleSave}
              disabled={isSaving || !newName.trim()}
              className="w-full bg-[#111827] text-white py-4 rounded-2xl font-black text-[14px] shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2 group"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.common.save}</span>
                  <Check size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
