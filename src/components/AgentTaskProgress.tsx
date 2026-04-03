"use client";

import React from "react";
import { Zap } from "lucide-react";

/**
 * Interface for Agent Task Status - designed for backend integration.
 * This can be directly mapped to a streaming response chunk.
 */
export interface AgentTaskStatus {
  /** The major task name (e.g., "Build the application") */
  title: string;
  /** The human-readable name of the current sub-task */
  subTaskName: string;
  /** Current completed step index */
  current: number;
  /** Total number of steps in the task sequence */
  total: number;
  /** Whether the entire task sequence is finished */
  isFinished: boolean;
}

interface AgentTaskProgressProps {
  task: AgentTaskStatus;
  /** Optional override for the shimmer effect color */
  shimmerColor?: string;
}

export const AgentTaskProgress: React.FC<AgentTaskProgressProps> = ({ task }) => {
  const percentage = Math.min(Math.max((task.current / task.total) * 100, 0), 100);

  return (
    <div className="mt-2 relative overflow-hidden rounded-[18px] border border-white/50 bg-white/20 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.03)] backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-300">
      {/* Major Task Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111827] text-white shadow-lg">
          <Zap size={11} fill="currentColor" className={!task.isFinished ? "animate-pulse" : ""} />
        </div>
        <span className="text-[13px] font-black text-[#111827] tracking-tight uppercase">
          {task.title}
        </span>
      </div>

      {/* Sub-task and Progress Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${task.isFinished ? "bg-green-500" : "bg-primary animate-pulse"}`} />
          <span className="text-[11px] font-bold text-[#111827]/60 tracking-tight truncate max-w-[220px]">
            {task.subTaskName}
          </span>
        </div>
        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full tabular-nums border border-primary/10">
          {task.current} / {task.total}
        </span>
      </div>
      
      {/* Progress Bar with Shimmer */}
      <div className="relative h-1.5 w-full bg-[#111827]/5 rounded-full overflow-hidden border border-white/40">
        <div 
          className="absolute top-0 left-0 h-full bg-[#111827] transition-all duration-700 ease-in-out rounded-full shadow-[0_0_8px_rgba(17,24,39,0.3)]"
          style={{ width: `${percentage}%` }}
        />
        {!task.isFinished && (
          <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-sweep" />
        )}
      </div>
    </div>
  );
};
