"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  tags?: React.ReactNode;
  subtitle?: React.ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  withIndicator?: boolean;
  rightElement?: React.ReactNode;
  children?: React.ReactNode; // For content below the title line (like filter bars)
  gap?: string;
  className?: string;
}

/**
 * PageHeader handles the standardized navigation and title area 
 * for subpages. It includes a back button, title, optional tags, 
 * an indicator bar, and slots for additional controls.
 */
export default function PageHeader({
  title,
  tags,
  subtitle,
  showBackButton = true,
  backUrl = "/",
  withIndicator = true,
  rightElement,
  children,
  gap = "gap-8",
  className = ""
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-6 relative">
          {showBackButton && (
            <button
              onClick={() => router.push(backUrl)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-outline-variant/15 text-on-surface-variant/70 hover:text-on-surface hover:bg-white hover:border-primary/30 transition-all active:scale-95 shadow-sm hover:shadow-md group"
            >
              <ArrowLeft size={22} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-on-surface leading-tight">
                {title}
              </h1>
              {tags && (
                <div className="flex items-center gap-2">
                  {tags}
                </div>
              )}
            </div>
            {withIndicator && (
              <div className="h-0.5 w-12 bg-primary/20 rounded-full" />
            )}
            {subtitle && (
              <div className="mt-1">
                {subtitle}
              </div>
            )}
          </div>

          {rightElement && (
            <div className="ml-auto">
              {rightElement}
            </div>
          )}
        </div>

        {children}
      </div>

      <div className="h-px bg-gradient-to-r from-outline-variant/10 via-outline-variant/30 to-outline-variant/10" />
    </div>
  );
}
