"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Play, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import GradientInput from "@/components/ui/GradientInput";
import WorkspaceNav from "@/components/layout/WorkspaceNav";
import ProjectWorkspaceSidebar from "@/components/ui/ProjectWorkspaceSidebar";
import { useFileWorkspace } from "@/hooks/useFileWorkspace";
import CaseDetailModal from "@/components/ui/CaseDetailModal";

interface ProjectSandboxViewProps {
  projectId: string;
  projectName: string;
  type: string;
  cases: any[];
  projectSessions: any[];
  setProjectSessions: (sessions: any[]) => void;
  loadContext: () => void;
}

export default function ProjectSandboxView({
  projectId,
  projectName,
  type,
  cases,
  projectSessions,
  setProjectSessions,
  loadContext
}: ProjectSandboxViewProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const {
    projectFiles,
    setProjectFiles,
    attachments,
    uploadFiles,
    removeFile,
    removeAttachment,
    toggleContext,
    renameFile
  } = useFileWorkspace([
    { id: "f1", name: "shift.pdf", size: "129.3 KB", type: "pdf" },
    { id: "f2", name: "原料工况.pdf", size: "42.9 KB", type: "pdf" },
    { id: "f3", name: "流程说明.pdf", size: "54.3 KB", type: "pdf" }
  ]);

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCasePopup, setShowCasePopup] = useState<any>(null);
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => uploadFiles(e.target.files);

  const startDraggingSidebar = () => { setIsDraggingSidebar(true); document.documentElement.classList.add('resizing-col'); };
  const stopDragging = () => { setIsDraggingSidebar(false); document.documentElement.classList.remove('resizing-col'); };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSidebar) {
        setSidebarWidth(Math.max(260, Math.min(480, e.clientX - 12)));
      }
    };
    if (isDraggingSidebar) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [isDraggingSidebar]);

  const handleApplyCase = (c: any) => {
    setShowCasePopup(null);
    setInput(c.prompt);
    // Use setAttachments directly for preset case data
    setProjectFiles(prev => [...prev, { id: `case_${Date.now()}`, name: `${c.title.replace(/\s+/g, "_")}_Data.json`, size: "12 KB", type: "application/json" }]);
  };

  const handleSend = async (forcedText?: string | any) => {
    const text = (typeof forcedText === 'string') ? forcedText : input;
    if (!text || typeof text !== 'string' || !text.trim() || isGenerating) return;

    // Create new session
    const newSessionId = `s_${Date.now()}`;
    const saved = localStorage.getItem("procagent_projects");
    if (saved) {
      const currentProjects = JSON.parse(saved);
      const projIndex = currentProjects.findIndex((p: any) => p.id === projectId);
      if (projIndex >= 0) {
        currentProjects[projIndex].sessions.unshift({ 
          id: newSessionId, 
          name: text.substring(0, 100) + (text.length > 100 ? "..." : ""), 
          timestamp: Date.now() 
        });
        localStorage.setItem("procagent_projects", JSON.stringify(currentProjects));
        
        // We use a custom event to notify parent if needed, or just redirect
        router.push(`/chat?project_id=${projectId}&session_id=${newSessionId}`);
        window.dispatchEvent(new Event("procagent_project_updated"));
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden z-10 bg-transparent">
      <WorkspaceNav title={projectName} onBack={() => router.push('/projects')} />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />

      <div className="flex flex-1 overflow-hidden px-0.5 pt-2 pb-2 gap-0 w-full mx-auto transition-all">
        <ProjectWorkspaceSidebar 
          isExpanded={isSidebarExpanded}
          onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          width={sidebarWidth}
          projectSessions={projectSessions}
          activeSessionId={""}
          onSwitchSession={(id) => router.push(`/chat?project_id=${projectId}&session_id=${id}`)}
          projectFiles={projectFiles}
          attachments={attachments}
          onAddAttachment={toggleContext}
          onRenameFile={renameFile}
          onRemoveFile={removeFile}
          onUploadClick={handleUploadClick}
        />

        {/* --- MAIN WORKSPACE --- */}
        <div className="flex-1 flex overflow-hidden ml-2 relative">
          <div className="flex-1 glass-panel rounded-[32px] flex flex-col overflow-hidden shadow-xl relative">
             <div className="relative flex flex-col h-full z-10 pt-12 px-10 pb-10 justify-start">
                <div className="flex flex-col items-center justify-center mb-12">
                  <h2 className="text-4xl font-medium text-on-surface/90 tracking-normal">{t.projects.sandboxTitle}</h2>
                </div>
                <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto w-full mb-12">
                  {cases.map((c) => (
                    <button key={c.id} onClick={() => setShowCasePopup(c)} className="bg-white/60 px-6 py-5 rounded-[24px] border border-white hover:border-primary/30 transition-all text-left shadow-sm hover:shadow-md h-full">
                      <h4 className="font-bold text-lg mb-2">{c.title}</h4>
                      <p className="text-sm text-on-surface/60 line-clamp-2">{c.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-auto">
                  <GradientInput value={input} onChange={setInput} onSend={handleSend} placeholder={t.projects.sandboxSubtitle} attachments={attachments} onRemoveAttachment={removeAttachment} isGenerating={isGenerating} projectFiles={projectFiles} onAddAttachment={toggleContext} />
                </div>
             </div>
          </div>
        </div>
      </div>

      <CaseDetailModal 
        isOpen={!!showCasePopup}
        onClose={() => setShowCasePopup(null)}
        caseData={showCasePopup}
        typeLabel={type === 'simulation' ? t.projects.tags.simulation : t.projects.tags.piping}
        onApply={handleApplyCase}
      />
    </div>
  );
}
