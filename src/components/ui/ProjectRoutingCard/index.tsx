"use client";

import React from "react";
import { Box, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectRoutingCardProps {
  title: string;
  description: string;
  buttonText: string;
  targetPath: string;
  icon?: React.ReactNode;
}

/**
 * ProjectRoutingCard - A high-fidelity routing guidance card using Soft Glassmorphism.
 * Used to guide users to create or switch to a different project type when an intent mismatch is detected.
 */
export default function ProjectRoutingCard({
  title,
  description,
  buttonText,
  targetPath,
  icon
}: ProjectRoutingCardProps) {
  const router = useRouter();

  return (
    <div className="relative group max-w-full">
      {/* Glass Card Container */}
      <div className="glass-panel overflow-hidden rounded-[28px] border border-white/60 bg-white/40 shadow-xl backdrop-blur-[24px] relative transition-all hover:shadow-2xl hover:border-white/80">
        {/* Artistic Gradient Background inside card */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 pointer-events-none" />
        
        <div className="relative p-5 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#111827] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              {icon || <Box size={24} className="text-white" />}
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-[17px] font-black text-[#111827] tracking-tight leading-tight">
                {title}
              </h4>
              <p className="text-[13px] text-[#111827]/60 font-bold leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <button 
            onClick={() => router.push(targetPath)}
            className="group/btn w-full flex items-center justify-between px-6 py-4 bg-[#111827] text-white rounded-full font-black text-[13px] tracking-widest shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <span>{buttonText.toUpperCase()}</span>
            <ArrowRight size={16} strokeWidth={3} className="text-white/60 group-hover/btn:text-white transition-colors group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
