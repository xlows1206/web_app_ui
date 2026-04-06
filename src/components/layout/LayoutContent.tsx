"use client";

import React from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  
  const isSessionPage = pathname?.startsWith('/chat');
  const isProjectsPage = pathname?.startsWith('/projects');
  const isFixedLayout = isSessionPage || isProjectsPage;

  React.useLayoutEffect(() => {
    if (isFixedLayout) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = "0px";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }
  }, [isFixedLayout]);

  return (
    <div className={`flex ${isFixedLayout ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {!isSessionPage && <Sidebar />}
      <div 
        className={`flex-1 ${isSessionPage ? "" : "transition-all duration-300 ease-in-out "}${
          isSessionPage ? "" : (isCollapsed ? "pl-[80px]" : "pl-[280px]")
        } ${isFixedLayout ? "h-full overflow-hidden" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
