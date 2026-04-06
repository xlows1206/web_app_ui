"use client";

import React, { useState } from "react";
import { Zap, ChevronDown, ChevronUp, CheckCircle2, Circle, Loader2 } from "lucide-react";

export interface SubTask {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface AgentTaskStatus {
  title: string;
  subTaskName: string;
  current: number;
  total: number;
  isFinished: boolean;
  subTasks?: SubTask[];
}

interface AgentTaskCardProps {
  task: AgentTaskStatus;
}

export const AgentTaskCard: React.FC<AgentTaskCardProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const percentage = Math.min(Math.max((task.current / task.total) * 100, 0), 100);

  return (
    <div className="mt-3 relative overflow-hidden rounded-[24px] border border-white/60 bg-white/40 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Header: Major Task */}
      <div 
        className="flex items-center justify-between cursor-pointer group/header mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-black text-[#111827] tracking-tight truncate leading-tight">
              {task.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="text-[#111827]/30 group-hover/header:text-primary transition-colors">
             {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
           </div>
        </div>
      </div>

      {/* Main Progress Bar (Always Visible) with Count */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 h-2.5 bg-black/5 rounded-full overflow-hidden border border-white/20 p-[1px]">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#A7F3D0] via-[#BFDBFE] to-[#FDBA74] transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(191,219,254,0.6)]"
            style={{ width: `${percentage}%` }}
          />
          {!task.isFinished && (
            <div 
              className="absolute top-0 left-0 h-full w-full opacity-80 mix-blend-overlay animate-[shimmer_2s_infinite_linear]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                backgroundSize: '200% 100%'
              }}
            />
          )}
        </div>
        <div className="shrink-0 min-w-[32px] text-right">
           <span className="text-[11px] font-black text-[#111827]/80 tabular-nums tracking-tighter">
             {task.current}<span className="text-[#111827]/20 mx-0.5">/</span>{task.total}
           </span>
        </div>
      </div>

      {/* Expanded Details: Sub-task List */}
      {isExpanded && (
        <div className="animate-in fade-in zoom-in-95 duration-300 origin-top">
          <div className="h-[1px] bg-black/5 mb-4 mx-1" />
          
          <div className="space-y-3.5 pl-1">
            {task.subTasks?.map((sub, idx) => (
              <div key={sub.id || idx} className={`flex items-center justify-between group/item transition-all ${sub.status === 'completed' ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {sub.status === 'completed' ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : sub.status === 'in-progress' ? (
                      <div className="relative flex items-center justify-center">
                        <Loader2 size={16} className="text-primary animate-spin" />
                        <div className="absolute w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                    ) : (
                      <Circle size={16} className="text-[#111827]/20" />
                    )}
                  </div>
                  <span className={`text-[12px] font-bold tracking-tight transition-colors ${
                    sub.status === 'in-progress' ? 'animate-text-shimmer' : 
                    sub.status === 'completed' ? 'text-[#111827] line-through decoration-black/20' : 
                    'text-[#111827]/40'
                  }`}>
                    {sub.name}
                  </span>
                </div>
                {sub.status === 'in-progress' && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md animate-pulse">
                    active
                  </span>
                )}
              </div>
            ))}
            
            {/* Fallback if no subTasks provided */}
            {(!task.subTasks || task.subTasks.length === 0) && (
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[12px] font-bold text-primary">{task.subTaskName}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
