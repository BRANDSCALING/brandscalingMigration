import { Card } from "@/components/ui/card";
import { CheckCircle, ChevronRight } from "lucide-react";
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome to Module 1
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Build the Foundation
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            This module helps you go from vague idea to clarity, confidence, and viability — before you invest time or money.
          </p>
        </div>

        {/* Philosophy Quote Box */}
        <div className="mb-8 sm:mb-12">
          <Card className="bg-purple-50 border-l-4 border-purple-500 p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm">
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            What You'll Be Working Through
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {sections.map((section) => {
              const isCompleted = completedSections.includes(section.id);
              
              return (
                <Card 
                  key={section.id}
                  className="p-4 sm:p-6 transition-all duration-200 hover:shadow-md cursor-pointer bg-purple-50 border-purple-200 hover:shadow-md"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {section.description}
                      </p>
                    </div>
                    
                    <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div 
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-base sm:text-lg"
            onClick={handleStartClick}
          >
            Start Module 1
            <ChevronRight className="ml-2 w-5 h-5" />
          </div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
            Let's build a solid foundation for your business idea.
          </p>
        </div>
      </div>
    </div>
  );
}