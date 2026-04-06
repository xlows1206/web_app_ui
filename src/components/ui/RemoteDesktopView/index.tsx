"use client";

import React from "react";
import { Monitor, Loader2 } from "lucide-react";

export type RemoteViewStatus = "connected" | "agent-operating" | "needs-intervention" | "disconnected";

interface RemoteDesktopViewProps {
  /** 是否处于活动连接状态 */
  isLive: boolean;
  /** 当前连接状态 */
  status: RemoteViewStatus;
  /** 预留后端流地址接口 */
  streamUrl?: string;
  /** 自定义类名 */
  className?: string;
  /** 是否正在调整尺寸 */
  isResizing?: boolean;
}

/**
 * RemoteDesktopView — 远程桌面视窗组件
 * 用于在 Live View 中展示 Agent 的实时操作画面
 */
export default function RemoteDesktopView({
  isLive,
  status,
  streamUrl,
  className = "",
  isResizing = false
}: RemoteDesktopViewProps) {
  return (
    <div className={`relative w-full h-full flex flex-col ${status === "agent-operating" ? "agent-operating-glow" : ""} ${className}`}>
      {/* Rectangular Remote Screen View (No margins, no internal rounds) */}
      <div className="absolute inset-0 bg-[#f0f0f0] overflow-hidden">
        {isLive ? (
          <div className="relative w-full h-full animate-in fade-in duration-500">
            {/* 模拟桌面图像 (直角处理) */}
            <img 
              src="/remote_mock.png" 
              alt="Remote Desktop" 
              className={`w-full h-full object-cover select-none ${isResizing ? 'transition-none' : 'transition-all duration-700'} ${status === 'agent-operating' ? 'brightness-110 saturate-[1.1]' : 'brightness-100'}`}
            />
            
            {/* 顶层状态叠加层 (预留接口可扩展) */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Monitor size={14} className="text-white/60" />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                {streamUrl ? "Cloud Stream Active" : "Local Simulation Mode"}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 animate-in fade-in">
            <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
            <span className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
              Establishing Secure Link...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
