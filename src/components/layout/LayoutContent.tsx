"use client";

import React from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  
  const isSessionPage = pathname?.startsWith('/chat');

  return (
    <div className="flex min-h-screen">
      {!isSessionPage && <Sidebar />}
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSessionPage ? "" : (isCollapsed ? "pl-[80px]" : "pl-[280px]")
        }`}
      >
        {children}
      </div>
    </div>
  );
}
