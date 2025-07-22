import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Import Module 1 components
import Module1Welcome from "@/components/workbook/module1-welcome";
import BusinessFilter from "@/components/workbook/business-filter";
import EdnaReflection from "@/components/workbook/edna-reflection";
import ClarityPrompts from "@/components/workbook/clarity-prompts";
import OfferBuilder from "@/components/workbook/offer-builder";
import ViabilityScorecard from "@/components/workbook/viability-scorecard";
import NameLogoBuilder from "@/components/workbook/name-logo-builder";

// Import UI components
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

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
  completedSections: string[];
  currentSection: number;
  totalSections: number;
  createdAt: string;
  updatedAt: string;
}

export default function Module1WorkbookAuthentic() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    
    if (studentId && studentEmail) {
      setIsAuthenticated(true);
    } else {
      setLocation('/auth');
    }
  }, [setLocation]);

  // Get workbook session
  const { data: session, isLoading } = useQuery<WorkbookSession>({
    queryKey: ['/api/workbook/session'],
    enabled: isAuthenticated,
  });

  // Update session mutation
  const updateSession = useMutation({
    mutationFn: async (data: Partial<WorkbookSession>) => {
      const response = await fetch('/api/workbook/session', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': localStorage.getItem('studentId') || '',
          'x-student-email': localStorage.getItem('studentEmail') || '',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workbook/session'] });
    }
  });

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-8">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Loading Module 1...</h2>
          <p className="text-gray-600">Preparing your workbook experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Purple Header with Navigation */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/student')}
                className="text-white hover:bg-white/10 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-white/90 text-sm font-medium uppercase tracking-wider">
                THE IDEA-TO-LAUNCH KIT™
              </div>
              <div className="text-white text-lg font-bold">
                Module 1
              </div>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-gradient-to-b from-purple-600 via-purple-700 to-indigo-800 min-h-screen">
        {/* Mobile Progress Bar */}
        <div className="md:hidden bg-white/10 border-b border-white/20">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between text-white text-sm">
              <span>Module Progress</span>
              <span className="font-bold">14%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <div 
                className="bg-white h-1.5 rounded-full transition-all duration-300"
                style={{ width: '14%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-80 bg-white/5 backdrop-blur-sm border-r border-white/10">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-2">Module Progress</h3>
                <div className="text-white/80 text-sm">14%</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: '14%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Modules</h4>
                
                {/* Module 1 - Active */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold text-sm">Module 1</span>
                    <span className="text-xs bg-white text-purple-700 px-2 py-1 rounded font-medium">
                      Business Foundation
                    </span>
                  </div>
                  
                  {/* Progress Items */}
                  <div className="space-y-2">
                    {[
                      { id: 1, title: "What Makes a Business Idea Work?", completed: false },
                      { id: 2, title: "The E-DNA Lens for Idea Clarity", completed: false },
                      { id: 3, title: "Business Idea Clarity Prompts", completed: false },
                      { id: 4, title: "Offer Builder Canvas", completed: false },
                      { id: 5, title: "Idea Viability Scorecard", completed: true },
                      { id: 6, title: "AI Sprint — Name + Logo Builder", completed: false },
                      { id: 7, title: "Your Progress Summary", completed: false }
                    ].map((item) => (
                      <div key={item.id} className="flex items-start space-x-2">
                        <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${
                          item.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-white/40'
                        }`}>
                          {item.completed && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-white/90 text-xs leading-tight">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Module 2 - Locked */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 opacity-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 font-bold text-sm">Module 2</span>
                    <span className="text-xs text-white/50">Build Your Brand</span>
                  </div>
                  <div className="text-white/50 text-xs">Complete Module 1 to unlock</div>
                </div>

                {/* Energy Level */}
                <div className="bg-white/5 rounded-lg p-4 mt-6">
                  <h4 className="text-white font-semibold text-sm mb-3">Energy Level</h4>
                  <div className="text-white/90 text-xs mb-2">How are you feeling right now?</div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <div 
                        key={level}
                        className={`w-4 h-4 rounded border cursor-pointer ${
                          level <= 7 ? 'bg-green-400 border-green-400' : 'border-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-white/70 text-xs mt-2">
                    You're building momentum! Keep going.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white min-h-screen">
            {/* Welcome Section */}
            <div className="py-16">
              <div className="max-w-3xl mx-auto px-6">
                {/* Hero Header */}
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Module 1
                  </h1>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Build the Foundation
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    This module helps you go from vague idea to clarity, confidence, and viability — before you invest time or money.
                  </p>
                </div>

                {/* Philosophy Quote Box */}
                <div className="mb-12">
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-8 rounded-xl shadow-sm">
                    <blockquote className="text-lg italic font-serif text-gray-700 text-center leading-relaxed">
                      "A business idea works when it solves a real problem — for a real person — in a way that makes you money — and doesn't drain your energy."
                    </blockquote>
                    <cite className="block text-center text-sm font-medium text-gray-600 mt-4">
                      — Brandscaling Philosophy
                    </cite>
                  </div>
                </div>

                {/* What You'll Be Working Through */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    What You'll Be Working Through
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { title: "What Makes a Business Idea Work?", desc: "4-part viable business filter" },
                      { title: "The E-DNA Lens for Idea Clarity", desc: "Entrepreneurial DNA analysis" },
                      { title: "Business Idea Clarity Prompts", desc: "AI-powered insights" },
                      { title: "Offer Builder Canvas", desc: "5-part framework" },
                      { title: "Idea Viability Scorecard", desc: "8-pillar assessment" },
                      { title: "AI Sprint — Name + Logo Builder", desc: "Business naming & branding" }
                    ].map((section, index) => (
                      <div 
                        key={index}
                        className="bg-purple-50 border border-purple-200 p-6 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">
                              {section.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {section.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Section Button */}
                <div className="text-center">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg"
                    onClick={() => {
                      // Scroll to first section (to be implemented)
                      console.log('Navigate to first section');
                    }}
                  >
                    Next Section
                  </Button>
                </div>
              </div>
            </div>

            {/* Placeholder for other sections */}
            <div id="business-filter" className="hidden">
              <BusinessFilter />
            </div>
            <div id="edna-reflection" className="hidden">
              <EdnaReflection />
            </div>
            <div id="clarity-prompts" className="hidden">
              <ClarityPrompts />
            </div>
            <div id="offer-builder" className="hidden">
              <OfferBuilder />
            </div>
            <div id="viability-scorecard" className="hidden">
              <ViabilityScorecard />
            </div>
            <div id="name-logo-builder" className="hidden">
              <NameLogoBuilder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}