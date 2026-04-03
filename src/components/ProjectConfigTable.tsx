"use client";

import React from "react";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ProjectParameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  source?: string; // e.g., "AI Recognition", "Manual"
}

interface ProjectConfigTableProps {
  parameters: ProjectParameter[];
  onUpdate: (params: ProjectParameter[]) => void;
}

export const ProjectConfigTable: React.FC<ProjectConfigTableProps> = ({ 
  parameters, 
  onUpdate
}) => {
  const { t } = useLanguage();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState<Partial<ProjectParameter>>({});

  const startEdit = (param: ProjectParameter) => {
    setEditingId(param.id);
    setEditValues(param);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdate(parameters.map(p => p.id === editingId ? { ...p, ...editValues } as ProjectParameter : p));
      cancelEdit();
    }
  };

  const deleteRow = (id: string) => {
    onUpdate(parameters.filter(p => p.id !== id));
  };

  const addRow = () => {
    const newId = Date.now().toString();
    const newParam: ProjectParameter = {
      id: newId,
      name: t.configTable.newParam,
      value: "0",
      unit: "-",
      source: t.configTable.manual
    };
    onUpdate([...parameters, newParam]);
    startEdit(newParam);
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest/30">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
              <th className="px-3 pb-2">{t.configTable.name}</th>
              <th className="px-3 pb-2">{t.configTable.value}</th>
              <th className="px-3 pb-2">{t.configTable.unit}</th>
              <th className="px-3 pb-2 text-right">{t.configTable.actions}</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param) => (
              <tr 
                key={param.id} 
                className="group bg-white border border-outline-variant/10 rounded-lg shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              >
                <td className="px-3 py-3 rounded-l-lg border-y border-l border-outline-variant/10">
                  {editingId === param.id ? (
                    <input 
                      className="w-full bg-surface-container-low px-2 py-1 rounded text-sm font-bold border-none focus:ring-1 focus:ring-primary/30"
                      value={editValues.name || ""}
                      onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                    />
                  ) : (
                    <span className="text-sm font-bold text-on-surface">{param.name}</span>
                  )}
                </td>
                <td className="px-3 py-3 border-y border-outline-variant/10">
                  {editingId === param.id ? (
                    <input 
                      className="w-full bg-surface-container-low px-2 py-1 rounded text-sm font-bold border-none focus:ring-1 focus:ring-primary/30"
                      value={editValues.value || ""}
                      onChange={e => setEditValues({ ...editValues, value: e.target.value })}
                    />
                  ) : (
                    <span className="text-sm font-black text-primary tabular-nums tracking-tight">{param.value}</span>
                  )}
                </td>
                <td className="px-3 py-3 border-y border-outline-variant/10">
                  {editingId === param.id ? (
                    <input 
                      className="w-full bg-surface-container-low px-2 py-1 rounded text-sm font-bold border-none focus:ring-1 focus:ring-primary/30"
                      value={editValues.unit || ""}
                      onChange={e => setEditValues({ ...editValues, unit: e.target.value })}
                    />
                  ) : (
                    <span className="text-[11px] font-bold text-on-surface-variant/60">{param.unit}</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right rounded-r-lg border-y border-r border-outline-variant/10">
                  <div className="flex items-center justify-end gap-1">
                    {editingId === param.id ? (
                      <>
                        <button onClick={saveEdit} className="p-1.5 rounded-full hover:bg-green-50 text-green-600 transition-colors">
                          <Save size={14} />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 rounded-full hover:bg-error/5 text-error/60 transition-colors">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(param)} className="p-1.5 rounded-full hover:bg-primary/5 text-on-surface-variant/40 hover:text-primary transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => deleteRow(param.id)} className="p-1.5 rounded-full hover:bg-error/5 text-on-surface-variant/40 hover:text-error transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parameters.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-3">
              <Plus size={24} className="text-on-surface-variant" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {t.configTable.noParam}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-transparent mt-auto">
        <button
          onClick={addRow}
          className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 rounded-lg text-primary font-bold text-xs hover:bg-primary/5 hover:border-primary/50 transition-all active:scale-[0.98] group bg-white/50"
        >
          <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
          {t.configTable.addParam}
        </button>
      </div>
    </div>
  );
};
