"use client";

import React from "react";
import { X, CheckCircle2, Zap, ShieldCheck, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmphasisButton from "@/components/ui/EmphasisButton";
import Portal from "@/components/ui/Portal";
import GradientStar from "@/components/ui/icons/GradientStar";

interface UpgradeCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeCreditsModal({ isOpen, onClose }: UpgradeCreditsModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const plans = [
    {
      name: t.pricing.basicName,
      price: t.pricing.basicPrice,
      description: t.pricing.basicDesc,
      features: t.pricing.basicFeatures,
      button: t.pricing.currentPlan,
      credits: "200 / MONTH",
      current: true,
      popular: false 
    },
    {
      name: t.pricing.proName,
      price: t.pricing.proPrice,
      description: t.pricing.proDesc,
      features: t.pricing.proFeatures,
      button: t.pricing.upgradeBtn,
      credits: "UNLIMITED",
      current: false,
      popular: true 
    }
  ];

  return (
    <Portal>
      <div className="fixed inset-0 z-[10001] w-screen h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden outline-none">
        {/* Animated Mesh Gradient Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-3xl animate-in fade-in duration-700 cursor-default" 
          onClick={onClose}
        >
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#A7F3D0]/30 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#BFDBFE]/30 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FDBA74]/20 rounded-full blur-[100px] animate-pulse-slow delay-500"></div>
        </div>
        
        <div className="relative w-full max-w-[880px] bg-white/40 backdrop-blur-3xl rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden animate-in zoom-in-95 fade-in duration-500 z-10 flex flex-col">
          
          {/* Modal Header */}
          <div className="relative px-10 pt-10 pb-6 flex justify-between items-start z-20">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#111827] flex items-center justify-center text-white shadow-xl shadow-black/10">
                  <Zap size={20} fill="currentColor" strokeWidth={0} />
                </div>
                <h2 className="text-3xl font-extrabold text-[#111827] tracking-tighter uppercase">{t.pricing.title}</h2>
              </div>
              <p className="text-[13px] font-bold text-[#111827]/40 ml-[52px] uppercase tracking-wider">
                {t.pricing.subtitle}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/40 hover:bg-white/80 transition-all active:scale-90 border border-white/60 shadow-sm"
            >
              <X size={24} className="text-[#111827]" strokeWidth={2.5} />
            </button>
          </div>

          {/* Modal Content - Plans */}
          <div className="relative px-10 pb-12 pt-4 grid grid-cols-1 md:grid-cols-2 gap-8 z-20 overflow-y-auto scrollbar-hide max-h-[70vh]">
            
            {plans.map((plan, idx) => (
              <div 
                key={idx}
                className={`relative rounded-[28px] p-8 flex flex-col gap-6 transition-all duration-300 border backdrop-blur-md overflow-hidden ${
                  plan.popular 
                    ? 'bg-white/80 border-[#111827]/10 shadow-[0_20px_40px_rgba(0,0,0,0.06)]' 
                    : 'bg-white/60 border-white/80 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">
                    MOST POPULAR
                  </div>
                )}

                <div className="flex flex-col gap-0.5 relative z-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#111827]/30">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-5xl font-black text-[#111827] tracking-tighter">
                      {plan.price}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#111827]/40">
                      {t.pricing.month}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed text-[#111827]/60 mt-3">
                    {plan.description}
                  </p>
                </div>

                {/* Included Credit Row */}
                <div className="w-full flex items-center justify-between p-4 bg-[#111827]/05 rounded-2xl border border-[#111827]/05 relative z-10">
                  <div className="flex items-center gap-3">
                    <GradientStar size={24} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#111827]/60">Included Credits</span>
                  </div>
                  <span className="text-sm font-black text-[#111827] tracking-tighter">{plan.credits}</span>
                </div>

                <div className="h-px w-full bg-black/5 relative z-10"></div>

                <ul className="flex flex-col gap-4 flex-1 relative z-10">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3">
                      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.current ? 'bg-black/5 text-[#111827]/20' : 'bg-[#111827] text-white'}`}>
                        <CheckCircle2 size={13} strokeWidth={3} />
                      </div>
                      <span className="text-[13px] font-bold text-[#111827]/80">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <div className="w-full py-4 text-[#111827]/40 font-black text-xs uppercase tracking-widest bg-black/5 rounded-full flex items-center justify-center gap-2 cursor-default relative z-10 transition-all border border-black/5">
                    <CheckCircle2 size={16} strokeWidth={3} />
                    <span>{plan.button}</span>
                  </div>
                ) : (
                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-[#111827] text-white rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95 transition-all relative z-10"
                  >
                    {plan.button}
                  </button>
                )}
              </div>
            ))}

          </div>

          {/* Modal Footer */}
          <div className="relative px-10 py-6 bg-white/20 border-t border-white/60 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-[#111827]/30">
                <ShieldCheck size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.pricing.security}</span>
              </div>
              <div className="flex items-center gap-2 text-[#111827]/30">
                <CreditCard size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.pricing.stripe}</span>
              </div>
            </div>
            <p className="text-[9px] font-black text-[#111827]/20 uppercase tracking-widest">
              {t.pricing.taxNote}
            </p>
          </div>
        </div>
      </div>
    </Portal>
  );
}
