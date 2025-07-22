import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

interface WorkbookSession {
  id: string;
  userId: string;
  userEmail: string;
  dnaMode: 'architect' | 'alchemist';
  businessFilter?: any;
  ednaReflection?: any;
  clarityPrompts?: any;
  offerBuilder?: any;
  viabilityScores?: any;
  nameLogoBuilder?: any;
  energyLevel?: number;
  completedSections: string[];
  currentSection: number;
  totalSections: number;
  createdAt: string;
  updatedAt: string;
}

const modules = {
  1: {
    title: "Business Foundation",
    sections: [
      { id: "section-1-1", title: "What Makes a Business Idea Work?", description: "4-part viable business filter" },
      { id: "section-1-2", title: "The E-DNA Lens for Idea Clarity", description: "Entrepreneurial DNA analysis" },
      { id: "section-1-3", title: "Business Idea Clarity Prompts", description: "AI-powered insights" },
      { id: "section-1-4", title: "Offer Builder Canvas", description: "5-part framework" },
      { id: "section-1-5", title: "Idea Viability Scorecard", description: "8-pillar assessment" },
      { id: "section-1-6", title: "AI Sprint — Name + Logo Builder", description: "Business naming & branding" },
      { id: "progress-summary", title: "Your Progress Summary", description: "Review completion status" },
    ]
  }
};

interface ProgressSidebarProps {
  session: WorkbookSession | undefined;
}

export default function ProgressSidebar({ session }: ProgressSidebarProps) {
  const [energyLevel, setEnergyLevel] = useState(session?.energyLevel || 7);
  const [isCollapsed, setIsCollapsed] = useState(false); // Start expanded
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Determine current module from URL
  const currentModule = 1;

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      if (!session?.id) throw new Error("No session ID");
      return apiRequest("PATCH", `/api/workbook/session/${session.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
    },
  });

  const handleEnergyChange = (value: number) => {
    setEnergyLevel(value);
    if (session?.id) {
      updateSessionMutation.mutate({ energyLevel: value });
    }
  };

  const getEnergyStatus = (level: number) => {
    if (level <= 3) return "You need a break. Rest before continuing.";
    if (level <= 5) return "Steady progress. Take your time.";
    if (level <= 7) return "You're building momentum! Keep going.";
    return "You're on fire! Ride this energy wave!";
  };

  // Check which sections are completed based on actual data
  const getSectionCompletion = () => {
    if (!session) return [];
    
    const completed = [];
    
    // Section 1.1: Business Filter
    if (session.businessFilter && 
        session.businessFilter.problem !== null && 
        session.businessFilter.person !== null && 
        session.businessFilter.profit !== null && 
        session.businessFilter.pull !== null) {
      completed.push("section-1-1");
    }
    
    // Section 1.2: E-DNA Reflection
    if (session.ednaReflection && (
        session.ednaReflection.architectReflection1 ||
        session.ednaReflection.architectReflection2 ||
        session.ednaReflection.alchemistReflection1 ||
        session.ednaReflection.alchemistReflection2)) {
      completed.push("section-1-2");
    }
    
    // Section 1.3: Clarity Prompts
    if (session.clarityPrompts && 
        session.clarityPrompts.businessIdea && 
        session.clarityPrompts.audience) {
      completed.push("section-1-3");
    }
    
    // Section 1.4: Offer Builder
    if (session.offerBuilder && 
        session.offerBuilder.transformation && 
        session.offerBuilder.vehicle && 
        session.offerBuilder.price) {
      completed.push("section-1-4");
    }
    
    // Section 1.5: Viability Scorecard
    if (session.viabilityScores && 
        Object.values(session.viabilityScores).some(score => score > 0)) {
      completed.push("section-1-5");
    }
    
    // Section 1.6: Name & Logo Builder
    if (session.nameLogoBuilder && 
        (session.nameLogoBuilder.businessName || session.nameLogoBuilder.tagline)) {
      completed.push("section-1-6");
    }
    
    return completed;
  };

  const completedSections = getSectionCompletion();
  const progressPercentage = Math.round((completedSections.length / modules[currentModule].sections.length) * 100);

  const handleSectionClick = (sectionId: string) => {
    // Map section IDs to actual element IDs
    const sectionElementMap: { [key: string]: string } = {
      "section-1-1": "business-filter",
      "section-1-2": "edna-reflection", 
      "section-1-3": "clarity-prompts",
      "section-1-4": "offer-builder",
      "section-1-5": "viability-scorecard",
      "section-1-6": "name-logo-builder",
      "progress-summary": "progress-summary"
    };

    const elementId = sectionElementMap[sectionId];
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleNextModule = () => {
    // Navigate to next module
    if (currentModule < 2) {
      setLocation(`/module/${currentModule + 1}`);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-purple-600 via-purple-700 to-indigo-800 border-r border-white/10 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-lg hover:bg-gray-50 transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Sidebar Content */}
      {!isCollapsed && (
        <div className="h-full overflow-y-auto p-4 pt-20">
          {/* Module Progress */}
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg mb-2">Module Progress</h3>
            <div className="text-white/80 text-sm mb-2">{progressPercentage}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-3 mb-6">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Modules</h4>
            
            {/* Module 1 - Active */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-sm">Module 1</span>
                <span className="text-xs bg-white text-purple-700 px-2 py-1 rounded font-medium">
                  {modules[currentModule].title}
                </span>
              </div>
              
              {/* Progress Items */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {modules[currentModule].sections.map((section) => (
                  <div key={section.id} className="flex items-start space-x-2">
                    <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${
                      completedSections.includes(section.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/40'
                    }`}>
                      {completedSections.includes(section.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div 
                        className="text-white/90 text-xs font-medium leading-tight cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSectionClick(section.id)}
                      >
                        {section.title}
                      </div>
                      <div className="text-white/60 text-xs">{section.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Energy Level */}
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="text-white font-semibold text-sm mb-3">Energy Level</h4>
            
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-xs">Drained</span>
                <span className="text-white/80 text-xs">Energised ({energyLevel}/10)</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => handleEnergyChange(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #22c55e 100%)`
                }}
              />
            </div>
            
            <p className="text-white/60 text-xs italic mb-4">
              "{getEnergyStatus(energyLevel)}"
            </p>
            
            {completedSections.length === modules[currentModule].sections.length ? (
              <button
                onClick={handleNextModule}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm py-2 px-3 rounded-lg font-medium transition-all"
              >
                Start Module 2
              </button>
            ) : (
              <div className="text-center">
                <div className="text-white/60 text-xs">
                  Complete all sections to unlock Module 2
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed State - Show Icon */}
      {isCollapsed && (
        <div className="flex flex-col items-center pt-20 space-y-4">
          <BarChart3 className="h-6 w-6 text-white/80" />
          <div className="text-white/60 text-xs text-center transform -rotate-90 whitespace-nowrap">
            Progress
          </div>
        </div>
      )}
    </div>
  );
}