"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import WorkspaceUserMenu from "@/components/ui/WorkspaceUserMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import NotificationCenter from "../ui/NotificationCenter";
import InviteReward from "../ui/InviteReward";

const DEFAULT_AVATAR_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_d9nZsts-FJw7XWhZiP5C-AT5ylfdMyc5IfTDz-r9n9HG2wb7vumoQx4Im3SPl1hWssSZWn0lY5UkJv33a7LOpoxqsL_--O9jMnl6bzBp9v-H7MCCQ8EI6TlZLrpFKAAPh5x9VDlURtKjpGTMfXBAtQFrhiOgYHpjUccel408-pMY1Yw6JzBr6cNyNoZwKUgllE42pF1K-Evc-WEzysdkxwqZJ2hwq6cELizJHir4jLqXwT81Jr20J2SNebGo9zFcnAFOOwVQgf1";

interface WorkspaceNavProps {
  /** 左侧标题（通常是项目名称） */
  title?: string;
  /** 点击返回按钮的回调，不传则默认 router.push('/') */
  onBack?: () => void;
  /** 是否显示返回按钮，默认 true */
  showBack?: boolean;
}

/**
 * WorkspaceNav — 工作区轻量导航栏
 * 用于 Session / Chat 等子页面，白色轻薄风格 (h-[56px])
 * 包含：返回按钮、页面标题、消息通知中心、用户菜单
 */
export default function WorkspaceNav({
  title = "Project Workspace",
  onBack,
  showBack = true,
}: WorkspaceNavProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative w-full h-[56px] glass-panel border-b z-50 flex items-center px-4 border-t-0 border-x-0 border-white/20 shrink-0">
      {showBack && (
        <button
          className="mr-6 p-2 rounded-full hover:bg-black/5 active:scale-95 transition-all text-on-surface"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div className="font-bold text-lg tracking-tight text-on-surface">
        {title}
      </div>

      <div className="flex-1" />

      {/* Right: Notification + User Menu */}
      <div className="ml-6 flex items-center gap-4">
{/* <InviteReward /> */}
        <NotificationCenter />

        <WorkspaceUserMenu
          credit="200.00"
          adminName={t?.nav?.adminName || "User"}
          avatarSrc={DEFAULT_AVATAR_SRC}
        />
      </div>
    </div>
  );
}
