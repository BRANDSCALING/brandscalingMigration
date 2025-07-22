import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { WorkbookSession } from "@shared/schema";

interface MobileProgressProps {
  session: WorkbookSession | undefined;
}

const sections = [
  { id: "section-1-1", title: "Business Filter", shortTitle: "Filter" },
  { id: "section-1-2", title: "E-DNA Lens", shortTitle: "DNA" },
  { id: "section-1-3", title: "Clarity Prompts", shortTitle: "Clarity" },
  { id: "section-1-4", title: "Offer Builder", shortTitle: "Offer" },
  { id: "section-1-5", title: "Viability Scorecard", shortTitle: "Score" },
  { id: "section-1-6", title: "Name + Logo", shortTitle: "Brand" },
];

export default function MobileProgress({ session }: MobileProgressProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get completion status
  const getCompletedSections = () => {
    if (!session) return [];
    
    const completed = [];
    
    if (session.businessFilter && 
        session.businessFilter.problem !== null && 
        session.businessFilter.person !== null && 
        session.businessFilter.profit !== null && 
        session.businessFilter.pull !== null) {
      completed.push("section-1-1");
    }
    
    if (session.ednaReflection && (
        session.ednaReflection.architectReflection1 ||
        session.ednaReflection.architectReflection2 ||
        session.ednaReflection.alchemistReflection1 ||
        session.ednaReflection.alchemistReflection2)) {
      completed.push("section-1-2");
    }
    
    if (session.clarityPrompts && 
        session.clarityPrompts.businessIdea && 
        session.clarityPrompts.audience) {
      completed.push("section-1-3");
    }
    
    if (session.offerBuilder && 
        session.offerBuilder.transformation && 
        session.offerBuilder.vehicle && 
        session.offerBuilder.price) {
      completed.push("section-1-4");
    }
    
    if (session.viabilityScores && 
        (session.viabilityScores.clarity > 0 || 
         session.viabilityScores.demand > 0 || 
         session.viabilityScores.differentiation > 0)) {
      completed.push("section-1-5");
    }
    
    if (session.nameLogoBuilder && (
        session.nameLogoBuilder.finalDecisions?.chosenBusinessName ||
        session.nameLogoBuilder.nameRatings)) {
      completed.push("section-1-6");
    }
    
    return completed;
  };

  const completedSections = getCompletedSections();
  const completionPercentage = Math.round((completedSections.length / sections.length) * 100);

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
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Progress Bar - Only visible on small screens */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700"
            >
              <Menu className="w-4 h-4" />
              <span>Module Progress</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <span className="text-sm font-bold text-purple-600">{completionPercentage}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="bg-white border-t border-gray-200 max-h-64 overflow-y-auto">
            <div className="p-4 space-y-2">
              {sections.map((section) => {
                const isCompleted = completedSections.includes(section.id);
                
                return (
                  <button
                    key={section.id}
                    onClick={() => navigateToSection(section.id)}
                    className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isCompleted 
                        ? "bg-green-50 text-green-800 border border-green-200" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="font-medium text-sm">{section.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isCompleted 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {isCompleted ? "✓" : "•"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}