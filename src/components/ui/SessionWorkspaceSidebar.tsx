"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Paperclip, Minimize2, Maximize2, ClipboardList, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AttachmentCard from "./AttachmentCard";
import KeyParameterPanel from "./KeyParameterPanel";
import { AgentTaskCard } from "./AgentTaskCard";
import SlidingTabs, { TabOption } from "./SlidingTabs";

interface SessionWorkspaceSidebarProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  width: number;
  activeSessionId: string;
  projectFiles: any[];
  attachments: any[];
  onAddAttachment: (id: string) => void;
  onRenameFile: (id: string) => void;
  onRemoveFile: (id: string) => void;
  onUploadClick: () => void;
  parameterData: any;
  activeParamCategory: string;
  onCategoryChange: (id: string) => void;
  messages: any[];
  isResizing?: boolean;
}

/**
 * SessionWorkspaceSidebar - Sidebar for active AI Session mode
 * Tabs: Parameters (Chat icon when session active), Assets, Tasks
 */
export default function SessionWorkspaceSidebar({
  isExpanded,
  onToggleExpand,
  width,
  activeSessionId,
  projectFiles,
  attachments,
  onAddAttachment,
  onRenameFile,
  onRemoveFile,
  onUploadClick,
  parameterData,
  activeParamCategory,
  onCategoryChange,
  messages,
  isResizing = false
}: SessionWorkspaceSidebarProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"chat" | "assets" | "tasks">("chat");

  const tasks = messages.filter(m => m.agentTask).map(m => m.agentTask);
  const activeTask = tasks.findLast(t => !t.isFinished);
  const completedTasks = tasks.filter(t => t.isFinished).reverse();

  // Auto-switch to tasks tab and expand sidebar when an agent task starts
  useEffect(() => {
    if (activeTask && !activeTask.isFinished && activeTab !== "tasks") {
      setActiveTab("tasks");
      if (!isExpanded) {
        onToggleExpand();
      }
    }
  }, [activeTask?.title, activeTask?.isFinished, activeTab, isExpanded, onToggleExpand]);

  return (
    <div 
      style={{ width: isExpanded ? width : 72 }} 
      className={`flex flex-col shrink-0 h-full overflow-hidden ${isResizing ? "transition-none" : "transition-all duration-300"}`}
    >
      <div className="glass-panel p-0 rounded-[28px] flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <div className={`px-4 py-2 border-b border-white/10 flex items-center shrink-0 ${isExpanded ? "justify-between" : "justify-center"}`}>
           {isExpanded && (
             <span className="text-[13px] font-black uppercase tracking-widest text-primary truncate">
               {t.projects.title}
             </span>
           )}
           <button onClick={onToggleExpand} className="p-2 hover:bg-black/5 rounded-xl text-primary/40 hover:text-primary transition-all active:scale-90">
             {isExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} className="animate-pulse" />}
           </button>
        </div>

        {/* Tab Navigation (Expanded) */}
        {isExpanded && (
          <div className="p-3 pt-2 border-b border-white/10 shrink-0">
             <SlidingTabs 
                className="h-10"
                tabs={[
                  { id: "chat", label: t.projects.parameters, icon: <MessageSquare size={13} strokeWidth={2.5} /> },
                  { id: "assets", label: t.projects.assets, icon: <Paperclip size={13} strokeWidth={2.5} /> },
                  { 
                    id: "tasks", 
                    label: t.document.taskList, 
                    icon: (
                      <ClipboardList size={13} strokeWidth={2.5} />
                    )
                  }
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
                <KeyParameterPanel 
                  data={parameterData} 
                  activeCategory={activeParamCategory} 
                  onCategoryChange={onCategoryChange} 
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
              {activeTab === "tasks" && (
                <div className="flex flex-col h-full overflow-hidden">
                  {tasks.length > 0 ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                      
                      <div className="space-y-6">
                        {/* Active Task Section - Only show the current processing one */}
                        {activeTask ? (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <AgentTaskCard task={activeTask} />
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-10 text-center py-20">
                            <ClipboardList size={48} className="mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">No Active Task</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-10 text-center">
                      <ClipboardList size={48} className="mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">No Active Task</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Collapsed Icons */
            <div className="flex-1 flex flex-col items-center py-6 gap-6">
               <button 
                 onClick={() => { onToggleExpand(); setActiveTab("chat"); }} 
                 className="p-3 text-primary/30 hover:text-primary transition-all"
               >
                 <MessageSquare size={20} />
               </button>
               <button 
                 onClick={() => { onToggleExpand(); setActiveTab("assets"); }} 
                 className="p-3 text-primary/30 hover:text-primary transition-all"
               >
                 <Paperclip size={20} />
               </button>
               <button 
                 onClick={() => { onToggleExpand(); setActiveTab("tasks"); }} 
                 className="p-3 text-primary/30 hover:text-primary transition-all"
               >
                 <ClipboardList size={20} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
