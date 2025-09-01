import { Card } from "@/components/ui/card";
import { CheckCircle, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { useDNAMode } from "@/hooks/use-dna-mode";

interface Module1WelcomeProps {
  completedSections?: string[];
  onStartClick?: () => void;
}

const sections = [
  {
    id: "section-1-1",
    title: "What Makes a Business Idea Work?",
    description: "4-part viable business filter"
  },
  {
    id: "section-1-2", 
    title: "The E-DNA Lens for Idea Clarity",
    description: "Entrepreneurial DNA analysis"
  },
  {
    id: "section-1-3",
    title: "Business Idea Clarity Prompts", 
    description: "AI-powered insights"
  },
  {
    id: "section-1-4",
    title: "Offer Builder Canvas",
    description: "5-part framework"
  },
  {
    id: "section-1-5",
    title: "Idea Viability Scorecard",
    description: "Scoring your business concept"
  },
  {
    id: "section-1-6",
    title: "AI Sprint — Name + Logo Builder",
    description: "Branding your business"
  }
];

export default function Module1Welcome({ completedSections = [], onStartClick }: Module1WelcomeProps) {
  const [showCoaching, setShowCoaching] = useState(false);
  const { isArchitect } = useDNAMode();
  const handleStartClick = () => {
    if (onStartClick) {
      onStartClick();
    } else {
      // Default behavior: scroll to business-filter section
      const element = document.getElementById("business-filter");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSectionClick = (sectionId: string) => {
    // Map section IDs to actual element IDs
    const sectionElementMap: { [key: string]: string } = {
      "section-1-1": "business-filter",
      "section-1-2": "edna-reflection", 
      "section-1-3": "clarity-prompts",
      "section-1-4": "offer-builder",
      "section-1-5": "viability-scorecard",
      "section-1-6": "name-logo-builder"
    };

    const elementId = sectionElementMap[sectionId];
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-strategic-black mb-2">
            Welcome to Module 1
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-strategic-black mb-4">
            Build the Foundation
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            This module helps you go from vague idea to clarity, confidence, and viability — before you invest time or money.
          </p>
        </div>

        {/* Philosophy Quote Box */}
        <div className="mb-8 sm:mb-12">
          <Card className="bg-[#F3F0FF] border-l-4 border-purple-500 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">
            <blockquote className="text-base sm:text-lg italic font-serif text-gray-700 text-center leading-relaxed">
              "A business idea works when it solves a real problem — for a real person — in a way that makes you money — and doesn't drain your energy."
            </blockquote>
            <cite className="block text-center text-sm font-medium text-gray-600 mt-4">
              — Brandscaling Philosophy
            </cite>
          </Card>
        </div>



        {/* Module 1 Section Overview */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-strategic-black text-center mb-6 sm:mb-8">
            What You'll Be Working Through
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {sections.map((section) => {
              const isCompleted = completedSections.includes(section.id);
              
              return (
                <Card 
                  key={section.id}
                  className="p-4 sm:p-6 transition-all duration-200 hover:shadow-md cursor-pointer bg-[#F3F0FF] border-purple-200 hover:shadow-md"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg text-strategic-black">
                        {section.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Slide-in Coaching Panel */}
        {showCoaching && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
              onClick={() => setShowCoaching(false)}
            />
            
            {/* Slide-in Panel */}
            <div className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-full sm:w-96 max-w-sm bg-white shadow-xl z-[110] transform transition-transform duration-300 ease-in-out">
              <div className="p-6 h-full overflow-y-auto">
                {/* Panel Header */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-strategic-black">Strategic Coaching</h3>
                  <button
                    onClick={() => setShowCoaching(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* DNA-Specific Content */}
                <div className={`p-6 rounded-lg border-l-4 ${
                  isArchitect 
                    ? "bg-purple-50 border-purple-500" 
                    : "bg-orange-50 border-orange-500"
                }`}>
                  <h4 className={`font-semibold mb-4 ${
                    isArchitect ? "text-architect-indigo" : "text-scale-orange"
                  }`}>
                    {isArchitect ? "Architect Mode: Strategic Analysis" : "Alchemist Mode: Intuitive Approach"}
                  </h4>
                  
                  {isArchitect ? (
                    <div className="space-y-3 text-gray-700">
                      <p className="font-medium">Risk: Over-optimizing and skipping emotion</p>
                      <ul className="space-y-2 text-sm">
                        <li>• You might focus too much on systems and miss emotional appeal</li>
                        <li>• Remember to consider what makes people feel excited about your idea</li>
                        <li>• Don't skip the "pull" factor - what draws people in emotionally</li>
                        <li>• Balance logic with storytelling and connection</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-3 text-gray-700">
                      <p className="font-medium">Risk: Skipping delivery or market demand</p>
                      <ul className="space-y-2 text-sm">
                        <li>• You might focus on passion and miss practical delivery</li>
                        <li>• Remember to validate actual market demand, not just personal excitement</li>
                        <li>• Don't skip the "profit" factor - how will this actually make money</li>
                        <li>• Balance intuition with structured business thinking</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">
                    Use this awareness as you work through Module 1. Great ideas need both structure and resonance.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}