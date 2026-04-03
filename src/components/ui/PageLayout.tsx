"use client";

import React from "react";

type LayoutVariant = "home" | "subpage";

interface PageLayoutProps {
  children: React.ReactNode;
  showPulse?: boolean;
  variant?: LayoutVariant;
  className?: string;
}

/**
 * PageLayout handles the consistent "Editorial Pulse" background 
 * and container structure across the application.
 */
export default function PageLayout({ 
  children, 
  showPulse = true,
  variant = "subpage",
  className = ""
}: PageLayoutProps) {
  return (
    <div className={`relative min-h-screen bg-[#faf8ff] overflow-hidden ${className}`}>
      {showPulse && variant === "home" && (
        <>
          {/* Home Variant: top-right and bottom-left nodes */}
          <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow delay-1000"></div>
        </>
      )}

      {showPulse && variant === "subpage" && (
        <>
          {/* Subpage Variant: top-left and bottom-right nodes */}
          <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
          <div className="absolute bottom-[-5%] right-[-10%] w-[35%] h-[35%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow delay-700"></div>
        </>
      )}
      
      {children}
    </div>
  );
}
