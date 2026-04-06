"use client";

import React, { useState } from "react";
import { MessageSquare, Paperclip, Minimize2, Maximize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SessionHistoryList from "./SessionHistoryList";
import AttachmentCard from "./AttachmentCard";
import SlidingTabs from "./SlidingTabs";

interface ProjectWorkspaceSidebarProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  width: number;
  projectSessions: any[];
  activeSessionId: string;
  onSwitchSession: (id: string) => void;
  projectFiles: any[];
  attachments: any[];
  onAddAttachment: (id: string) => void;
  onRenameFile: (id: string) => void;
  onRemoveFile: (id: string) => void;
  onUploadClick: () => void;
  isResizing?: boolean;
}

/**
 * ProjectWorkspaceSidebar - Sidebar for Project Sandbox mode (No active session)
 * Tabs: Conversations (Chat), Assets
 */
export default function ProjectWorkspaceSidebar({
  isExpanded,
  onToggleExpand,
  width,
  projectSessions,
  activeSessionId,
  onSwitchSession,
  projectFiles,
  attachments,
  onAddAttachment,
  onRenameFile,
  onRemoveFile,
  onUploadClick,
  isResizing = false
}: ProjectWorkspaceSidebarProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"chat" | "assets">("chat");

  return (
    <div 
      style={{ width: isExpanded ? width : 72 }} 
      className={`flex flex-col shrink-0 h-full overflow-hidden ${isResizing ? "transition-none" : "transition-all duration-300"}`}
    >
      <div className="glass-panel p-0 rounded-[28px] flex flex-col h-full overflow-hidden relative shadow-xl">
        

        {/* Tab Navigation (Expanded) */}
        {isExpanded && (
          <div className="p-4 pt-2 border-b border-white/10 shrink-0">
             <SlidingTabs 
                className="h-11"
                tabs={[
                  { id: "chat", label: t.document.chat, icon: <MessageSquare size={13} strokeWidth={2.5} /> },
                  { id: "assets", label: t.projects.assets, icon: <Paperclip size={13} strokeWidth={2.5} /> }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
             />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {isExpanded ? (
            <>
              {activeTab === "chat" && (
                <SessionHistoryList 
                  sessions={projectSessions} 
                  activeSessionId={activeSessionId} 
                  onSwitchSession={onSwitchSession} 
                />
              )}
              {activeTab === "assets" && (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar flex flex-col gap-2.5">
                    {projectFiles.map(file => (
                      <AttachmentCard 
                        key={file.id} 
                        {...file} 
                        active={attachments.some(a => a.id === file.id)}
                        onAdd={onAddAttachment} 
                        onRename={onRenameFile} 
                        onRemove={onRemoveFile} 
                      />
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <button 
                      onClick={onUploadClick} 
                      className="w-full py-3 bg-primary text-white rounded-full font-black text-[10px] tracking-widest uppercase"
                    >
                      {t.projects.uploadAttachment}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Collapsed Icons */
            <div className="flex-1 flex flex-col items-center py-6 gap-6">
               <button 
                 onClick={() => { onToggleExpand(); setActiveTab("chat"); }} 
                 className={`p-3 rounded-2xl transition-all ${activeTab === 'chat' ? 'bg-primary text-white shadow-lg' : 'text-primary/30'}`}
               >
                 <MessageSquare size={20} />
               </button>
               <button 
                 onClick={() => { onToggleExpand(); setActiveTab("assets"); }} 
                 className={`p-3 rounded-2xl transition-all ${activeTab === 'assets' ? 'bg-primary text-white shadow-lg' : 'text-primary/30'}`}
               >
                 <Paperclip size={20} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
