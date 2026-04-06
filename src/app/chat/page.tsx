"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Play, FileText, X, WifiOff, Wifi, Maximize2, Minimize2, RefreshCw, Activity as TypeIcon, Activity, Box, MessageSquare, Paperclip, FileSpreadsheet, FileArchive, FileImage, FileJson, FileCode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import StatusBadge from "@/components/ui/StatusBadge";
import IconButton from "@/components/ui/IconButton";
import AIChatBox from "@/components/ui/AIChatBox";
import GradientInput from "@/components/ui/GradientInput";
import Portal from "@/components/ui/Portal";
import RemoteDesktopView from "@/components/ui/RemoteDesktopView";
import { formatTimeAgo } from "@/lib/timeUtils";
import WorkspaceNav from "@/components/layout/WorkspaceNav";
import NotificationPermissionModal from "@/components/modals/NotificationPermissionModal";
import DraggableDivider from "@/components/ui/DraggableDivider";
import CurrentTaskPanel from "@/components/ui/CurrentTaskPanel";
import PaneHeader from "@/components/ui/PaneHeader";
import ProjectSandboxView from "@/components/views/ProjectSandboxView";
import SessionActiveView from "@/components/views/SessionActiveView";

export default function SessionPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [projectId, setProjectId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [projectSessions, setProjectSessions] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("Project Workspace");
  const [type, setType] = useState<string>("simulation");
  const [cases, setCases] = useState<any[]>(t.projects.simulationCases);

  const loadContext = () => {
    const urlProjectId = searchParams.get("project_id");
    const urlSessionId = searchParams.get("session_id");

    const activeProject = urlProjectId || localStorage.getItem("procagent_active_project_id") || "";
    const activeSession = urlSessionId || ""; // Don't fall back to older sessions for sandbox auto-switching
    
    setProjectId(activeProject);
    setSessionId(activeSession);

    const saved = localStorage.getItem("procagent_projects");
    if (saved && activeProject) {
      const p = JSON.parse(saved).find((proj: any) => proj.id === activeProject);
      if (p) {
         setProjectName(p.name);
         setType(p.type || "simulation");
         setCases(p.type === "piping" ? t.projects.pipingCases : t.projects.simulationCases);
         setProjectSessions(p.sessions || []);
      }
    }
  };

  useEffect(() => {
    loadContext();
  }, [searchParams, t]);

  useEffect(() => {
    const handleUpdate = () => loadContext();
    window.addEventListener("procagent_context_updated", handleUpdate);
    window.addEventListener("procagent_project_updated", handleUpdate);
    return () => {
      window.removeEventListener("procagent_context_updated", handleUpdate);
      window.removeEventListener("procagent_project_updated", handleUpdate);
    };
  }, []);

  if (!sessionId) {
    return (
      <ProjectSandboxView 
        key={`sandbox-${projectId}`}
        projectId={projectId}
        projectName={projectName}
        type={type}
        cases={cases}
        projectSessions={projectSessions}
        setProjectSessions={setProjectSessions}
        loadContext={loadContext}
      />
    );
  }

  return (
    <SessionActiveView 
      key={`session-${sessionId}`}
      projectId={projectId}
      sessionId={sessionId}
      projectName={projectName}
      type={type}
    />
  );
}
