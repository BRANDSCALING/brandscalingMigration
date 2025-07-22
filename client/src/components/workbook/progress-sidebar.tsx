import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import type { WorkbookSession } from "@shared/schema";

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
  },
  2: {
    title: "Build Your Brand",
    sections: [
      { id: "section-2-1", title: "What Is a Brand (Really)?", description: "Emotional + strategic brand clarity" },
      { id: "section-2-2", title: "Name & Brand Identity Fast Track", description: "Name, tagline, tone, colors" },
      { id: "section-2-3", title: "Logo & Visual Identity Builder", description: "Logo, fonts, palettes, templates" },
      { id: "section-2-4", title: "Brand Story & Guideline Builder", description: "Messaging, values, tone, audience" },
      { id: "section-2-5", title: "Social Profile Setup & Launch System", description: "Align your online presence" },
      { id: "section-2-6", title: "Link Infrastructure System", description: "Build a clean \"link-in-bio\" experience" },
      { id: "section-2-7", title: "Brand Bio & Profile Builder", description: "Conversion-optimized bios" },
      { id: "section-2-8", title: "The Content Launch Checklist", description: "Post ideas to launch with clarity" },
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
  const currentModule = location.includes("/module/2") ? 2 : 1;

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
    updateSessionMutation.mutate({ energyLevel: value });
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
        (session.viabilityScores.clarity > 0 || 
         session.viabilityScores.demand > 0 || 
         session.viabilityScores.differentiation > 0)) {
      completed.push("section-1-5");
    }
    
    // Section 1.6: Name + Logo Builder
    if (session.nameLogoBuilder && (
        session.nameLogoBuilder.finalDecisions?.chosenBusinessName ||
        session.nameLogoBuilder.nameRatings)) {
      completed.push("section-1-6");
    }
    
    return completed;
  };

  const completedSections = getSectionCompletion();
  const currentModuleSections = modules[currentModule as keyof typeof modules].sections;
  const completionPercentage = Math.round((completedSections.length / currentModuleSections.length) * 100);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } fixed left-0 top-0 h-full z-30 flex flex-col`}>
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="p-6 border-b border-gray-200">
        {!isCollapsed && (
          <>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg">
                {currentModule}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Module {currentModule}</h2>
                <p className="text-sm text-gray-600">{modules[currentModule as keyof typeof modules].title}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-purple-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg mb-2">
              {currentModule}
            </div>
            <div className="w-8 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Energy Level */}
      {!isCollapsed && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Energy Level</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Low</span>
              <span className="text-xs text-gray-500">High</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => handleEnergyChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #ef4444 20%, #f59e0b 40%, #10b981 60%, #059669 80%, #047857 100%)`
              }}
            />
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{energyLevel}/10</div>
              <div className="text-xs text-gray-600 mt-1">{getEnergyStatus(energyLevel)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Sections</h3>
            {currentModuleSections.map((section, index) => {
              const isCompleted = completedSections.includes(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}.{currentModule}
                        </span>
                        {isCompleted && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {section.title}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {section.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {isCollapsed && (
          <div className="p-2 space-y-2">
            {currentModuleSections.map((section, index) => {
              const isCompleted = completedSections.includes(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full p-2 rounded-lg border transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}.{currentModule}
                    </span>
                    {isCompleted && (
                      <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}