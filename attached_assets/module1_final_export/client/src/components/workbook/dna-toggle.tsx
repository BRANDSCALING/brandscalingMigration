import { Building2, Sparkles } from "lucide-react";
import { useDNAMode } from "@/hooks/use-dna-mode";

export default function DNAToggle() {
  const { mode, setMode, isArchitect, isAlchemist } = useDNAMode();

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">Your E-DNA:</span>
      <span className="text-xs font-medium text-gray-700 sm:hidden">DNA:</span>
      <div className="relative flex items-center bg-gray-100 rounded-full p-0.5 sm:p-1">
        <button
          onClick={() => setMode("architect")}
          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-xs sm:text-sm ${
            isArchitect 
              ? "bg-architect-indigo text-white shadow-sm" 
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-medium hidden sm:inline">Architect</span>
          <span className="font-medium sm:hidden">Arch</span>
        </button>
        <button
          onClick={() => setMode("alchemist")}
          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-xs sm:text-sm ${
            isAlchemist 
              ? "bg-scale-orange text-white shadow-sm" 
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-medium hidden sm:inline">Alchemist</span>
          <span className="font-medium sm:hidden">Alch</span>
        </button>
      </div>
    </div>
  );
}
