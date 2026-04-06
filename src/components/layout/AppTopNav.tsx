"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import WorkspaceUserMenu from "@/components/ui/WorkspaceUserMenu";
import { useSidebar } from "@/contexts/SidebarContext";
import NotificationCenter from "../ui/NotificationCenter";
import InviteReward from "../ui/InviteReward";

const DEFAULT_AVATAR_SRC = "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_d9nZsts-FJw7XWhZiP5C-AT5ylfdMyc5IfTDz-r9n9HG2wb7vumoQx4Im3SPl1hWssSZWn0lY5UkJv33a7LOpoxqsL_--O9jMnl6bzBp9v-H7MCCQ8EI6TlZLrpFKAAPh5x9VDlURtKjpGTMfXBAtQFrhiOgYHpjUccel408-pMY1Yw6JzBr6cNyNoZwKUgllE42pF1K-Evc-WEzysdkxwqZJ2hwq6cELizJHir4jLqXwT81Jr20J2SNebGo9zFcnAFOOwVQgf1";

/**
 * AppTopNav — 全局应用顶部导航栏
 * 用于 Landing Page / Projects / Templates 等通用页面
 * 特性：磨砂玻璃风格，Fixed 定位，支持消息通知中心
 */
export default function AppTopNav() {
  const { t } = useLanguage();
  const { isCollapsed } = useSidebar();

  return (
    <header className={`fixed top-0 right-0 h-16 z-50 bg-white/[0.08] backdrop-blur-3xl font-manrope antialiased tracking-tight transition-all duration-300 ease-in-out border-b border-white/20 ${isCollapsed ? 'left-[80px]' : 'left-[280px]'}`}>
      <div className="flex justify-between items-center px-[60px] w-full h-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo area */}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Invite Rewards Button */}
{/* <InviteReward /> */}
          
          {/* Notifications Center Panel */}
          <NotificationCenter />
          
          {/* User Operations Setup Menu */}
          <WorkspaceUserMenu
            credit="200.00"
            adminName={t.nav.adminName}
            avatarSrc={DEFAULT_AVATAR_SRC}
          />
        </div>
      </div>
    </header>
  );
}
