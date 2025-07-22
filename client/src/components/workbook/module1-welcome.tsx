import { Card } from "@/components/ui/card";
import { CheckCircle, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface Module1WelcomeProps {
  completedSections?: string[];
  onStartClick?: () => void;
  dnaMode?: 'architect' | 'alchemist';
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

export default function Module1Welcome({ completedSections = [], onStartClick, dnaMode = 'architect' }: Module1WelcomeProps) {
  const [showCoaching, setShowCoaching] = useState(false);
  const isArchitect = dnaMode === 'architect';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Module 1
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Build the Foundation
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          This module helps you go from vague idea to clarity, confidence, and viability — before you invest time or money.
        </p>
      </div>

      {/* Philosophy Quote */}
      <Card className="border-l-4 border-purple-500 bg-purple-50">
        <div className="p-6">
          <blockquote className="text-lg italic text-gray-700 text-center leading-relaxed">
            "A business idea works when it solves a real problem — for a real person — in a way that makes you money — and doesn't drain your energy."
          </blockquote>
          <cite className="block text-center text-sm font-medium text-gray-600 mt-4">
            — Brandscaling Philosophy
          </cite>
        </div>
      </Card>

      {/* Coaching Tip - Conditional */}
      {showCoaching && (
        <Card className={`border-l-4 ${isArchitect ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50'}`}>
          <div className="p-4 relative">
            <button
              onClick={() => setShowCoaching(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            
            <h4 className={`font-semibold mb-2 ${isArchitect ? 'text-blue-800' : 'text-orange-800'}`}>
              {isArchitect ? 'Architect Coaching Tip' : 'Alchemist Coaching Tip'}
            </h4>
            
            {isArchitect ? (
              <p className="text-blue-700 text-sm">
                <strong>Your strength:</strong> You naturally think systematically and see the bigger picture.<br/>
                <strong>Watch out for:</strong> Don't get lost in planning. This module will help you validate before you build.
              </p>
            ) : (
              <p className="text-orange-700 text-sm">
                <strong>Your strength:</strong> You have great instincts and creative energy.<br/>
                <strong>Watch out for:</strong> Don't skip the foundation work. Structure will amplify your creativity.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* What You'll Be Working Through */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          What You'll Be Working Through
        </h2>
        
        <div className="space-y-3">
          {sections.map((section) => (
            <Card 
              key={section.id}
              className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                completedSections.includes(section.id)
                  ? 'bg-green-50 border-green-200'
                  : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
              }`}
              onClick={() => handleSectionClick(section.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {completedSections.includes(section.id) ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Coaching Tip Toggle */}
      {!showCoaching && (
        <div className="text-center">
          <button
            onClick={() => setShowCoaching(true)}
            className={`text-sm px-4 py-2 rounded-lg border ${
              isArchitect
                ? 'text-blue-600 border-blue-200 hover:bg-blue-50'
                : 'text-orange-600 border-orange-200 hover:bg-orange-50'
            }`}
          >
            Show {isArchitect ? 'Architect' : 'Alchemist'} Coaching Tip
          </button>
        </div>
      )}

      {/* Start Button */}
      <div className="text-center pt-6">
        <button
          onClick={handleStartClick}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors inline-flex items-center space-x-2"
        >
          <span>Start Building Your Foundation</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}