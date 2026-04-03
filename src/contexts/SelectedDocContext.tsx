"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SelectedDoc {
  id: string;
  title: string;
  type: "simulation" | "piping";
  createdAt: string;
  creator: {
    name: string;
  };
}

interface SelectedDocContextType {
  selectedDoc: SelectedDoc | null;
  setSelectedDoc: (doc: SelectedDoc | null) => void;
}

const SelectedDocContext = createContext<SelectedDocContextType>({
  selectedDoc: null,
  setSelectedDoc: () => {},
});

export const SelectedDocProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDoc, setSelectedDoc] = useState<SelectedDoc | null>(null);
  return (
    <SelectedDocContext.Provider value={{ selectedDoc, setSelectedDoc }}>
      {children}
    </SelectedDocContext.Provider>
  );
};

export const useSelectedDoc = () => useContext(SelectedDocContext);
