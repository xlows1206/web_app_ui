import { FileText, FileSpreadsheet, FileImage, FileArchive, FileJson, LucideIcon } from "lucide-react";

export interface FileIconInfo {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const getFileIconInfo = (fileName: string): FileIconInfo => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
    case 'xls':
    case 'xlsx':
    case 'csv':
      return { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' };
    case 'doc':
    case 'docx':
      return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return { icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' };
    case 'json':
      return { icon: FileJson, color: 'text-amber-600', bg: 'bg-amber-50' };
    case 'zip':
    case 'rar':
    case '7z':
      return { icon: FileArchive, color: 'text-orange-600', bg: 'bg-orange-50' };
    default:
      return { icon: FileText, color: 'text-primary', bg: 'bg-primary/10' };
  }
};
