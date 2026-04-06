import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
}

export function useFileWorkspace(initialFiles: FileItem[] = []) {
  const { t } = useLanguage();
  const [projectFiles, setProjectFiles] = useState<FileItem[]>(initialFiles);
  const [attachments, setAttachments] = useState<FileItem[]>([]);

  const uploadFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map((file: any) => ({
      id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type.split('/')[1] || 'other'
    }));
    setProjectFiles(prev => [...prev, ...newFiles]);
    setAttachments(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setProjectFiles(prev => prev.filter(f => f.id !== id));
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const toggleContext = useCallback((id: string) => {
    const file = projectFiles.find(f => f.id === id);
    if (file) {
      setAttachments(prev => 
        prev.some(a => a.id === id) 
          ? prev.filter(a => a.id !== id) 
          : [...prev, file]
      );
    }
  }, [projectFiles]);

  const renameFile = useCallback((id: string) => {
    const file = projectFiles.find(f => f.id === id);
    if (!file) return;
    const newName = window.prompt(t.common.rename, file.name);
    if (newName && newName.trim() !== "" && newName !== file.name) {
      setProjectFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
      setAttachments(prev => prev.map(a => a.id === id ? { ...a, name: newName } : a));
    }
  }, [projectFiles, t.common.rename]);

  return {
    projectFiles,
    setProjectFiles,
    attachments,
    setAttachments,
    uploadFiles,
    removeFile,
    removeAttachment,
    clearAttachments,
    toggleContext,
    renameFile
  };
}
