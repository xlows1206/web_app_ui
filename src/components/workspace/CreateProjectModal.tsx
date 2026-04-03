"use client";

import React, { useState } from "react";
import { X, Layout, Activity, Box, FileText, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: { title: string; type: string }) => void;
}

export default function CreateProjectModal({ isOpen, onClose, onCreate }: CreateProjectModalProps) {
  const { t } = useLanguage();
  const m = t.newProjectModal;

  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState("simulation");

  if (!isOpen) return null;

  const projectTypes = [
    { id: "simulation", label: m.types.simulation.label, subLabel: m.types.simulation.subLabel, icon: <Activity size={18} />, color: "text-[#3B82F6]", bg: "bg-[#E9EFFF]" },
    { id: "piping",     label: m.types.piping.label,     subLabel: m.types.piping.subLabel,     icon: <Box size={18} />,      color: "text-[#F97316]", bg: "bg-[#FFF4E9]" },
    { id: "pid",        label: m.types.pid.label,        subLabel: m.types.pid.subLabel,        icon: <FileText size={18} />, color: "text-[#10B981]", bg: "bg-[#E9F9EF]" },
    { id: "hazop",      label: m.types.hazop.label,      subLabel: m.types.hazop.subLabel,      icon: <ShieldAlert size={18} />, color: "text-[#EF4444]", bg: "bg-[#F9E9E9]" },
  ];

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({ title, type: selectedType });
    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10001] w-screen h-screen flex items-center justify-center p-4 overflow-hidden outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white/70 overflow-hidden animate-in zoom-in-95 duration-300 z-10 my-auto flex flex-col">

        {/* Header */}
        <div className="px-7 pt-7 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F4F4F4] flex items-center justify-center text-[#111827]/50 shrink-0">
              <Layout size={20} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[20px] font-bold tracking-tight text-[#111827] leading-tight">
                {m.title}
              </h2>
              <p className="text-[9px] font-bold text-[#111827]/25 uppercase tracking-[0.18em]">
                {m.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-all active:scale-90"
          >
            <X size={18} className="text-[#111827]/25" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="px-7 pb-7 flex flex-col gap-5">

          {/* Engineering Type */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#111827]/20 ml-1">
              {m.typeLabel}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {projectTypes.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setSelectedType(pt.id)}
                  className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left group ${
                    selectedType === pt.id
                      ? "border-[#111827] bg-white shadow-md -translate-y-px"
                      : "border-transparent bg-[#F4F4F4] hover:bg-[#EAEAEA]"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${pt.bg} ${pt.color}`}>
                    {pt.icon}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold leading-tight text-[#111827]">
                      {pt.label}
                    </span>
                    <span className="text-[8px] font-bold text-[#111827]/30 uppercase tracking-[0.12em] mt-0.5 flex items-center gap-1 truncate">
                      <Activity size={7} className="opacity-40 shrink-0" />
                      {pt.subLabel}
                    </span>
                  </div>

                  {/* Radio */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedType === pt.id ? "border-[#111827]" : "border-[#111827]/10"
                    }`}>
                      {selectedType === pt.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#111827] animate-in zoom-in duration-300" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Project Identifier Input */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#111827]/20 ml-1">
              {m.identifierLabel}
            </label>
            <input
              type="text"
              placeholder={m.placeholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full h-12 px-5 bg-[#F4F4F4] rounded-full text-[14px] text-[#111827] font-medium transition-all outline-none placeholder:text-[#111827]/20 focus:bg-white focus:ring-1 focus:ring-[#111827]/8"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-0.5">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-full text-[12px] font-bold text-[#111827]/35 hover:bg-black/5 transition-colors active:scale-95"
            >
              {m.discard}
            </button>
            <button
              disabled={!title.trim()}
              onClick={handleCreate}
              className="flex-[2] h-11 rounded-full text-[12px] font-bold bg-[#111827] text-white shadow-lg shadow-[#111827]/10 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none"
            >
              {m.initialize}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
