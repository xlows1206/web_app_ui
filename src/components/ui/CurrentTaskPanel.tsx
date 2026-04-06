"use client";

import React from "react";
import { ClipboardList } from "lucide-react";
import { type AgentTaskStatus } from "./AgentTaskCard";

interface CurrentTaskPanelProps {
  task?: AgentTaskStatus;
  isCollapsed?: boolean;
}

export default function CurrentTaskPanel({ task, isCollapsed }: CurrentTaskPanelProps) {
  if (!task) return null;

  if (isCollapsed) {
    return (
      <div className="p-4 flex flex-col items-center gap-2 border-t border-white/10 bg-primary/5">
        <div className="relative">
          <ClipboardList size={20} className={task.isFinished ? "text-green-500" : "text-primary animate-pulse"} />
          {!task.isFinished && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 border-t border-white/10 bg-white/30 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardList size={14} className="text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Current Task</span>
        </div>
        <span className="text-[10px] font-black text-primary/60">
          {task.current}/{task.total}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-[13px] font-bold text-primary truncate mb-1">{task.title}</p>
        <p className="text-[11px] text-primary/40 font-medium truncate">{task.subTaskName}</p>
      </div>

      <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(task.current / task.total) * 100}%` }}
        />
      </div>
    </div>
  );
}
