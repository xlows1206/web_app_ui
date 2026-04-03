import React, { useState, useRef, useEffect } from "react";
import { Users, Copy, Check, Share2, X, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import GradientStar from "@/components/ui/icons/GradientStar";

/**
 * InviteReward — 邀请奖励组件 (视觉精修版)
 * 遵循 Soft Glassmorphism 规范，参考上传截图进行重构
 */
export default function InviteReward() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const inviteLink = "https://procagent.ai/invite?code=PA888_VIP";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative font-manrope antialiased tracking-tight" ref={containerRef}>
      {/* Trigger Button - Glass Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 group border ${
          isOpen 
            ? "bg-white/40 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)]" 
            : "bg-white/10 border-white/20 hover:bg-white/30 hover:border-white/60 hover:-translate-y-0.5 hover:shadow-lg"
        } backdrop-blur-3xl`}
      >
        <div className="w-6 h-6 flex items-center justify-center transition-transform">
          <Gift size={20} strokeWidth={2.2} className="text-primary" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#111827]">
          {t.invite.button}
        </span>
      </button>

      {/* Non-blocking Dropdown Panel - Solid White Style */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-[380px] bg-white rounded-[32px] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.15)] border border-[#111827]/10 z-[100] p-1 animate-in fade-in zoom-in-95 duration-500 origin-top-right overflow-hidden">
          
          <div className="relative p-7 flex flex-col gap-6">
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-white/40 hover:bg-white/80 transition-all active:scale-90 border border-white/60 shadow-sm z-30"
            >
              <X size={16} className="text-[#111827]" strokeWidth={2.5} />
            </button>

            {/* Header: Icon + Title Horizontal */}
            <div className="flex items-center gap-4 pr-6">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-[18px] bg-[#111827] flex items-center justify-center text-white shadow-lg relative z-10 transition-transform hover:scale-105">
                  <Users size={24} strokeWidth={1.5} />
                </div>
                {/* Visual Glow */}
                <div className="absolute inset-x-0 -bottom-1 h-4 bg-[#A7F3D0] rounded-full blur-xl opacity-40"></div>
              </div>
              
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-black text-[#111827] tracking-tighter uppercase leading-[1.1]">
                  {t.invite.title.split('得').join(' 得 ')}
                </h2>
                <p className="text-[10px] font-bold text-[#111827]/40 leading-relaxed tracking-wide mt-0.5">
                  {t.invite.subtitle}
                </p>
              </div>
            </div>

            {/* Reward Bar - Compact Horizontal Line */}
            <div className="w-full h-16 bg-white/60 rounded-[22px] border border-white/80 p-4 px-6 flex items-center group overflow-hidden relative shadow-sm">
               <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0 flex-1">
                 <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#111827]/30 shrink-0 mr-1.5">
                    {t.invite.rewardLabel}
                 </span>
                 <div className="flex items-center gap-2">
                    <div className="shrink-0">
                      <GradientStar size={22} />
                    </div>
                    <span className="text-xl font-black text-[#111827] tracking-tighter truncate">
                        {t.invite.rewardValue}
                    </span>
                 </div>
               </div>
            </div>

            {/* Invitation Link Section */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#111827]/20 px-1">
                {t.invite.linkTitle}
              </span>
              
              <div className="relative group/link">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="w-full h-11 bg-white/50 border border-white/70 rounded-[15px] pl-4 pr-32 text-[10px] font-bold text-[#111827]/70 focus:outline-none shadow-sm transition-all group-hover/link:bg-white/70"
                />
                <button
                  onClick={handleCopy}
                  className={`absolute right-1 top-1 h-9 px-5 rounded-[12px] flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 z-10 ${
                    copied 
                      ? 'bg-[#A7F3D0] text-[#111827]' 
                      : 'bg-[#111827] text-white shadow-md'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={10} strokeWidth={4} />
                      {t.invite.copied}
                    </>
                  ) : (
                    <>
                      <Copy size={10} strokeWidth={2.5} />
                      {t.invite.copyLink}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
