import React from "react";
import { MessageSquare } from "lucide-react";
import { formatTimeAgo } from "@/lib/timeUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Session {
  id: string;
  name: string;
  timestamp: number;
}

interface SessionHistoryListProps {
  sessions: Session[];
  activeSessionId: string;
  onSwitchSession: (id: string) => void;
}

/**
 * SessionHistoryList Component
 * Renders the list of previous chat sessions for a project.
 */
export default function SessionHistoryList({ sessions, activeSessionId, onSwitchSession }: SessionHistoryListProps) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="p-4 px-5">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#111827]/30">{t.sidebar.historySessions}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-5 custom-scrollbar">
        <div className="space-y-1">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSwitchSession(session.id)}
              className={`w-full group flex items-center gap-3 py-3.5 pl-3.5 pr-1 rounded-[20px] transition-all relative overflow-hidden ${
                activeSessionId === session.id 
                  ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-white/60' 
                  : 'hover:bg-white/40 border-transparent'
              }`}
            >
              {activeSessionId === session.id && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
              )}
              
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all ${
                activeSessionId === session.id ? 'bg-[#111827] text-white' : 'bg-white/60 text-[#111827]/30 group-hover:bg-white'
              }`}>
                <MessageSquare size={14} />
              </div>

              <div className="flex flex-col items-start overflow-hidden text-left flex-1 min-w-0">
                <span className={`text-[13px] font-bold w-full line-clamp-1 leading-snug ${
                  activeSessionId === session.id ? 'text-[#111827]' : 'text-[#111827]/60 group-hover:text-[#111827]'
                }`}>
                  {session.name}
                </span>
                <span className="text-[10px] font-black uppercase tracking-tight text-[#111827]/20 mt-1">
                  {formatTimeAgo(session.timestamp, t)}
                </span>
              </div>
            </button>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-24 px-6 flex flex-col items-center gap-4 opacity-30">
               <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                  {t.sidebar.noSessions}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
