"use client";

import React from "react";

interface EmphasisButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  /** 是否启用悬浮流光扫过动效，默认开启 */
  shimmer?: boolean;
  /** 是否撑满父容器宽度，默认 false */
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * 强调按钮 (Emphasis Button)
 * 全站唯一合法的高转化率行动入口按钮样式。
 * 渐变色继承自品牌主题渐变轴：#C4D2FF → #474DB3
 * 规范详见 Global_style.md §6
 */
export default function EmphasisButton({
  children,
  onClick,
  className = "",
  shimmer = true,
  fullWidth = false,
  disabled = false,
}: EmphasisButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group/emphasis relative rounded-lg font-bold text-sm tracking-tight transition-all active:scale-95
                  bg-gradient-to-r from-[#C4D2FF] to-[#474DB3] text-white
                  overflow-hidden disabled:opacity-50 disabled:pointer-events-none
                  ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {/* Frosted Glass hover overlay */}
      <div className="absolute inset-0 rounded-lg backdrop-blur-md bg-white/10 opacity-0 group-hover/emphasis:opacity-100 transition-all duration-300 pointer-events-none"></div>

      {/* Shimmer sweep effect */}
      {shimmer && (
        <div className="absolute inset-0 rounded-lg translate-x-[-100%] group-hover/emphasis:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 ease-in-out pointer-events-none"></div>
      )}

      <span className="relative z-10 drop-shadow-sm">{children}</span>
    </button>
  );
}
