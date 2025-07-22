import { createContext, useContext, useState, ReactNode } from "react";

type DNAMode = "architect" | "alchemist";

interface DNAModeContextType {
  mode: DNAMode;
  setMode: (mode: DNAMode) => void;
  isArchitect: boolean;
  isAlchemist: boolean;
}

const DNAModeContext = createContext<DNAModeContextType | undefined>(undefined);

export function DNAModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DNAMode>("architect");

  const value = {
    mode,
    setMode,
    isArchitect: mode === "architect",
    isAlchemist: mode === "alchemist",
  };

  return (
    <DNAModeContext.Provider value={value}>
      {children}
    </DNAModeContext.Provider>
  );
}

export function useDNAMode() {
  const context = useContext(DNAModeContext);
  if (context === undefined) {
    throw new Error("useDNAMode must be used within a DNAModeProvider");
  }
  return context;
}