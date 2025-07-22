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
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
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
    
    // Section 1.1: Business Filter - check if all 4 questions are answered
    if (session.businessFilter && 
        session.businessFilter.problem !== null && 
        session.businessFilter.person !== null && 
        session.businessFilter.profit !== null && 
        session.businessFilter.pull !== null) {
      completed.push("section-1-1");
    }
    
    // Section 1.2: E-DNA Reflection - check if any reflection is filled
    if (session.ednaReflection && (
        session.ednaReflection.architectReflection1 ||
        session.ednaReflection.architectReflection2 ||
        session.ednaReflection.alchemistReflection1 ||
        session.ednaReflection.alchemistReflection2)) {
      completed.push("section-1-2");
    }
    
    // Section 1.3: Clarity Prompts - check if key fields are filled
    if (session.clarityPrompts && 
        session.clarityPrompts.businessIdea && 
        session.clarityPrompts.audience) {
      completed.push("section-1-3");
    }
    
    // Section 1.4: Offer Builder - check if basic offer structure is filled
    if (session.offerBuilder && 
        session.offerBuilder.transformation && 
        session.offerBuilder.vehicle && 
        session.offerBuilder.price) {
      completed.push("section-1-4");
    }
    
    // Section 1.5: Viability Scorecard - check if any scores are entered
    if (session.viabilityScores && 
        (session.viabilityScores.clarity > 0 || 
         session.viabilityScores.demand > 0 || 
         session.viabilityScores.differentiation > 0)) {
      completed.push("section-1-5");
    }
    
    // Section 1.6: Name + Logo Builder - check if any names or decisions are made
    if (session.nameLogoBuilder && (
        session.nameLogoBuilder.finalDecisions?.chosenBusinessName ||
        session.nameLogoBuilder.nameRatings)) {
      completed.push("section-1-6");
    }
    
    return completed;
  };

  const completedSections = getSectionCompletion();
  const currentModuleSections = modules[currentModule as keyof typeof modules]?.sections || [];
  const completionPercentage = Math.round((completedSections.length / currentModuleSections.length) * 100);

  // Navigation function to scroll to sections
  const navigateToSection = (sectionId: string) => {
    const sectionMap: { [key: string]: string } = {
      "section-1-1": "business-filter",
      "section-1-2": "edna-reflection", 
      "section-1-3": "clarity-prompts",
      "section-1-4": "offer-builder",
      "section-1-5": "viability-scorecard",
      "section-1-6": "name-logo-builder"
    };
    
    const elementId = sectionMap[sectionId];
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`fixed top-1/2 transform -translate-y-1/2 z-20 bg-architect-indigo text-white p-3 rounded-r-lg shadow-lg hover:bg-purple-variant transition-all duration-300 hidden md:flex items-center ${
          isCollapsed ? 'left-0' : 'left-80'
        }`}
        aria-label={isCollapsed ? "Open progress sidebar" : "Close progress sidebar"}
      >
        {isCollapsed ? (
          <>
            <BarChart3 className="w-5 h-5 mr-2" />
            <ChevronRight className="w-4 h-4" />
          </>
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`w-80 bg-white/90 backdrop-blur-sm shadow-xl border-r border-gray-200 fixed h-full overflow-y-auto z-10 hidden md:block transition-transform duration-300 ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <div className="p-6">
          {/* Brand Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IL</span>
              </div>
              <div>
                <h1 className="font-bold text-strategic-black text-lg">THE IDEA-TO-LAUNCH KIT™</h1>
                <p className="text-gray-600 text-sm">Module {currentModule}</p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-strategic-black text-lg">Module Progress</h3>
              <div className="text-sm font-medium text-architect-indigo">{completionPercentage}%</div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-brand-gradient h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            
            {/* Module Navigation */}
            <div className="mb-6">
              <h4 className="font-medium text-strategic-black mb-3">Modules</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(modules).map(([moduleNum, moduleData]) => (
                  <button
                    key={moduleNum}
                    onClick={() => setLocation(`/module/${moduleNum}`)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      currentModule === parseInt(moduleNum)
                        ? "bg-architect-indigo text-white border-architect-indigo"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">Module {moduleNum}</div>
                    <div className="text-xs opacity-75">{moduleData.title}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              {currentModuleSections.map((section, index) => {
                const isCompleted = completedSections.includes(section.id);
                
                return (
                  <div 
                    key={section.id}
                    onClick={() => navigateToSection(section.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
                      isCompleted ? "bg-green-50 border border-green-200" : ""
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={isCompleted}
                      readOnly
                      className="w-5 h-5 text-architect-indigo rounded border-gray-300 focus:ring-architect-indigo pointer-events-none" 
                    />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${isCompleted ? "text-green-800" : "text-gray-900"}`}>
                        {section.title}
                      </p>
                      <p className={`text-xs ${isCompleted ? "text-green-600" : "text-gray-500"}`}>
                        {isCompleted ? "Completed" : section.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Energy Tracker */}
          <div className="mt-8 p-4 bg-brand-gradient-light rounded-lg">
            <h4 className="font-semibold text-strategic-black mb-3">Energy Level</h4>
            <div className="space-y-3">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={energyLevel}
                onChange={(e) => handleEnergyChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Drained</span>
                <span className="font-medium text-architect-indigo">Energized ({energyLevel}/10)</span>
              </div>
              <p className="text-sm text-gray-700 italic">"{getEnergyStatus(energyLevel)}"</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6">
            <button className="w-full bg-architect-indigo text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-variant transition-colors">
              Start Module 2
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
