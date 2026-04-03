"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Avatar from "../Avatar";

/**
 * NotificationCenter — 消息通知中心组件
 * 包含：铃铛图标按钮（带未读圆点）、磨砂玻璃下拉面板
 */
export default function NotificationCenter() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Mock Notifications Data
  const mockNotifications = [
    {
      id: 1,
      user: "Design Lead",
      project: t.notifications.mockProject1,
      time: t.notifications.time1,
      type: "joined",
      unread: true,
      avatar: "Design Lead"
    },
    {
      id: 2,
      user: "Kuku Admin",
      project: t.notifications.mockProject2,
      time: t.notifications.time2,
      type: "joined",
      unread: true,
      avatar: "Kuku Admin"
    },
    {
      id: 3,
      user: "System",
      project: "ProcAgent Alpha",
      time: "3h ago",
      type: "removed",
      unread: false,
      avatar: "System"
    },
    {
      id: 4,
      user: "Sarah Chen",
      project: "Quantum Core",
      time: "5h ago",
      type: "joined",
      unread: false,
      avatar: "Sarah Chen"
    },
    {
      id: 5,
      user: "Mike Ross",
      project: "Aero-Dynamics",
      time: "1d ago",
      type: "joined",
      unread: false,
      avatar: "Mike Ross"
    }
  ];

  const hasUnread = mockNotifications.some(n => n.unread);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notifRef}>
      <div className="relative">
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsNotifOpen(!isNotifOpen);
          }}
          className={`p-2.5 rounded-full transition-all active:scale-95 relative ${
            isNotifOpen ? "bg-white/30 shadow-inner" : "hover:bg-white/10"
          }`}
        >
          <Bell
            size={20}
            strokeWidth={2}
            className={`${isNotifOpen ? "text-black" : "text-slate-600"}`}
          />
          {/* Unread dot indicator */}
          {hasUnread && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </div>

      {isNotifOpen && (
        <div
          className="absolute right-0 top-full mt-4 w-[400px] bg-white rounded-[32px] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.15)] border border-slate-200 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="px-7 pt-6 pb-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900 tracking-tight text-xl">
              {t.notifications.title}
            </h3>
            <button
              onClick={() => setIsNotifOpen(false)}
              className="px-4 py-1.5 rounded-full bg-slate-900 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
            >
              {t.notifications.markAllRead}
            </button>
          </div>

          <div className="flex flex-col max-h-[420px] overflow-y-auto custom-scrollbar p-3">
            {mockNotifications.map((notif) => (
              <div
                key={notif.id}
                className="mx-1 px-5 py-5 hover:bg-slate-50 rounded-[24px] transition-all flex gap-4 items-start group cursor-pointer relative active:scale-[0.98]"
                onClick={() => setIsNotifOpen(false)}
              >
                {/* Unread Indicator Dot */}
                {notif.unread && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full absolute left-2 top-8 shadow-[0_0_8px_rgba(37,99,235,0.4)] z-10"></div>
                )}

                <Avatar name={notif.avatar} size="md" />

                <div className="flex flex-col gap-1.5 pr-2 text-left">
                  <p className="text-[14px] font-semibold text-slate-900 leading-relaxed">
                    <span className="font-extrabold">{notif.user}</span>{" "}
                    {notif.type === "joined" ? t.notifications.types.joined : t.notifications.types.removed}{" "}
                    <span className="font-extrabold text-blue-700">
                      {notif.project}
                    </span>
                    {notif.type === "removed" && t.notifications.types.removedSuffix}
                  </p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                    {notif.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}
