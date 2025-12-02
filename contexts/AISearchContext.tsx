"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AISearchContextType {
  aiSearchQuery: string | null;
  setAISearchQuery: (query: string) => void;
}

const AISearchContext = createContext<AISearchContextType | undefined>(undefined);

export function AISearchProvider({ children }: { children: ReactNode }) {
  const [aiSearchQuery, setAISearchQueryState] = useState<string | null>(null);

  const setAISearchQuery = (query: string) => {
    console.log("AI Search Query:", query);
    setAISearchQueryState(query);
  };

  return (
    <AISearchContext.Provider value={{ aiSearchQuery, setAISearchQuery }}>
      {children}
    </AISearchContext.Provider>
  );
}

export function useAISearch() {
  const context = useContext(AISearchContext);
  if (context === undefined) {
    throw new Error("useAISearch must be used within an AISearchProvider");
  }
  return context;
}
