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
  projectSessions,
  setProjectSessions,
  loadContext
}: Omit<ProjectSandboxViewProps, 'cases'>) {
  const router = useRouter();
  const { t, locale } = useLanguage();

  const [dynamicCases, setDynamicCases] = useState<any[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoadingCases(true);
        const resp = await fetch('/data/cases.json');
        const data = await resp.json();
        
        // Filter by locale and type
        const localizedData = data[locale] || data['zh'];
        const filteredCases = type === 'simulation' ? localizedData.simulation : localizedData.piping;
        
        setDynamicCases(filteredCases || []);
      } catch (err) {
        console.error("Failed to load cases:", err);
      } finally {
        setIsLoadingCases(false);
      }
    };
    fetchCases();
  }, [locale, type]);

  const {
    projectFiles,
    setProjectFiles,
    attachments,
    setAttachments,
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
    if (!c) return;
    
    // 1. Close modal and clear existing inputs to ensure a clean state
    setShowCasePopup(null);
    setInput(""); // Reset first
    setAttachments([]); // Clear existing attachments
    
    // Use a tiny delay to allow React to clear the DOM if needed before repopulating
    setTimeout(() => {
      // 2. Populate the prompt
      if (c.prompt) {
        setInput(c.prompt);
      }
      
      // 3. Add dynamic attachments from the JSON data
      if (c.attachments && Array.isArray(c.attachments)) {
        const newFiles = c.attachments.map((file: any) => ({
          id: `case_file_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size || "Unknown size",
          type: file.type || (file.name.endsWith('.pdf') ? 'pdf' : 'file')
        }));
        // We set directly to ensure these are the only attachments associated with the template
        setAttachments(newFiles);
      } else {
        const safeTitle = (c.title || "Case").replace(/\s+/g, "_");
        const newFile = { 
          id: `case_${Date.now()}`, 
          name: `${safeTitle}_Context.json`, 
          size: "8.4 KB", 
          type: "application/json" 
        };
        setAttachments([newFile]);
      }
    }, 50);
    
    // Track in pipeline
    console.log(`Applied template: ${c.title} with ${c.attachments?.length || 1} attachments`);
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
                
                {isLoadingCases ? (
                  <div className="flex flex-1 items-center justify-center -mt-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-on-surface/40 font-medium animate-pulse">{t.common.loading}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto w-full mb-12">
                    {dynamicCases.map((c) => (
                      <button key={c.id} onClick={() => setShowCasePopup(c)} className="bg-white/60 px-6 py-5 rounded-[24px] border border-white hover:border-primary/30 transition-all text-left shadow-sm hover:shadow-md h-full group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="font-bold text-lg mb-2 relative z-10">{c.title}</h4>
                        <p className="text-sm text-on-surface/60 line-clamp-2 relative z-10">{c.desc}</p>
                      </button>
                    ))}
                  </div>
                )}
                
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
