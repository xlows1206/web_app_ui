import { FileText, FileSpreadsheet, FileImage, FileArchive, FileJson, LucideIcon } from "lucide-react";

export interface FileIconInfo {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const getFileIconInfo = (fileName: string): FileIconInfo & { muted: string } => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50', muted: 'bg-red-400/20' };
    case 'xls':
    case 'xlsx':
    case 'csv':
      return { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50', muted: 'bg-green-600/20' };
    case 'doc':
    case 'docx':
      return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', muted: 'bg-blue-600/20' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return { icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50', muted: 'bg-purple-600/20' };
    case 'json':
      return { icon: FileJson, color: 'text-amber-600', bg: 'bg-amber-50', muted: 'bg-amber-600/20' };
    case 'zip':
    case 'rar':
    case '7z':
      return { icon: FileArchive, color: 'text-orange-600', bg: 'bg-orange-50', muted: 'bg-orange-600/20' };
    default:
      return { icon: FileText, color: 'text-primary', bg: 'bg-primary/10', muted: 'bg-primary/20' };
  }
};

/**
 * Truncate a filename in the middle, preserving the extension.
 * Example: "very_long_filename_final_version.pdf" -> "very_long...version.pdf"
 */
export const truncateMiddle = (name: string, maxLength: number = 24) => {
  if (!name || name.length <= maxLength) return name;

  const ellipsis = "...";
  const charsToShow = maxLength - ellipsis.length;
  
  // Find extension
  const lastDotIndex = name.lastIndexOf('.');
  let extension = "";
  let baseName = name;
  
  if (lastDotIndex > 0 && name.length - lastDotIndex <= 10) { // Limit extension length sanity check
    extension = name.substring(lastDotIndex);
    baseName = name.substring(0, lastDotIndex);
  }

  // If extension is empty or very short, simple middle cut
  if (baseName.length <= 4) {
    const start = Math.ceil(charsToShow / 2);
    const end = Math.floor(charsToShow / 2);
    return name.substring(0, start) + ellipsis + name.substring(name.length - end);
  }

  // Smart cut: preserve more of the start, and ensure extension is visible
  const extLen = extension.length;
  const remainingSpace = charsToShow - extLen;
  
  if (remainingSpace <= 4) {
    // Too little space, just do a basic cut
    const start = Math.ceil(charsToShow / 2);
    const end = Math.floor(charsToShow / 2);
    return name.substring(0, start) + ellipsis + name.substring(name.length - end);
  }

  const startChars = Math.ceil(remainingSpace * 0.6); // Show 60% at start
  const endChars = remainingSpace - startChars;
  
  return baseName.substring(0, startChars) + ellipsis + baseName.substring(baseName.length - endChars) + extension;
};
