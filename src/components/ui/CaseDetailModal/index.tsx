import React, { useState, useEffect } from "react";
import { X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CaseMedia {
  url: string;
  type: "image" | "gif";
  duration?: number;
}

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  typeLabel: string;
  onApply: (c: any) => void;
}

export default function CaseDetailModal({
  isOpen,
  onClose,
  caseData,
  typeLabel,
  onApply
}: CaseDetailModalProps) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const mediaList: CaseMedia[] = caseData?.media || (caseData?.img ? [{ url: caseData.img, type: "image" }] : []);

  useEffect(() => {
    if (!isOpen || !caseData || mediaList.length <= 1) {
      setActiveIndex(0);
      return;
    }

    const currentMedia = mediaList[activeIndex];
    if (currentMedia.type === "image" && currentMedia.duration) {
      const timer = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % mediaList.length);
      }, currentMedia.duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, caseData, activeIndex, mediaList]);

  if (!isOpen || !caseData) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-surface glass-panel w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl flex flex-col scale-100 animate-in zoom-in-95 duration-200 border-white/60">
        {/* Media Carousel Section */}
        <div className="h-48 w-full relative overflow-hidden group">
          {mediaList.map((media, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <img 
                src={media.url} 
                alt={`${caseData.title} view ${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors z-20"
          >
            <X size={16} />
          </button>

          {/* Capsule Indicator */}
          {mediaList.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 z-20 shadow-lg">
              {mediaList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${idx === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary px-2 py-1 rounded-full">
              {typeLabel} Case
            </span>
          </div>
          <h2 className="text-2xl font-black mb-2">{caseData.title}</h2>
          <p className="text-sm text-on-surface/60 leading-relaxed mb-6">{caseData.desc}</p>
          <button 
            onClick={() => onApply(caseData)} 
            className="w-full glass-pill-btn flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            {t.common.apply} <Play size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
