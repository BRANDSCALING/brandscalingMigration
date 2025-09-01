import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";

interface WorkbookSession {
  id: string;
  userId: string;
  dnaMode: 'architect' | 'alchemist';
  completedSections: string[];
  currentSection: number;
  totalSections: number;
}

const sections = [
  { id: 'welcome', title: 'Welcome to Module 1', description: 'Introduction to Build the Foundation' },
  { id: 'business-filter', title: 'Business Filter', description: 'Validate your business idea with 4-part filter' },
  { id: 'edna-reflection', title: 'E-DNA Reflection', description: 'Reflect on your entrepreneurial DNA type' },
  { id: 'clarity-prompts', title: 'Clarity Prompts', description: 'Get AI-powered business insights' },
  { id: 'offer-builder', title: 'Offer Builder', description: 'Build your core offer with 5-part framework' },
  { id: 'viability-scorecard', title: 'Viability Scorecard', description: 'Score your idea across 8 key pillars' },
  { id: 'name-logo-builder', title: 'Name & Logo Builder', description: 'Create your business name and visual identity' }
];

export default function Module1WorkbookSimple() {
  const [, setLocation] = useLocation();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
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

  const handleNextSection = () => {
    const nextIndex = currentSectionIndex + 1;
    if (nextIndex < sections.length) {
      setCurrentSectionIndex(nextIndex);
      updateSession.mutate({ 
        currentSection: nextIndex,
        completedSections: [...(session?.completedSections || []), sections[currentSectionIndex].id]
      });
    }
  };

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    updateSession.mutate({ currentSection: sectionIndex });
  };

  // Show loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-2">Loading Module 1...</h2>
            <p className="text-gray-600">Preparing your workbook experience</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-2">Loading Session...</h2>
            <p className="text-gray-600">Getting your progress</p>
          </div>
        </Card>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="min-h-screen">
      {/* Purple Header with Navigation - Matching Reference Design */}
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

      {/* Main Content Container with Purple Background */}
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
          {/* Desktop Sidebar with Purple Theme */}
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
                    {sections.map((section, index) => (
                      <div key={section.id} className="flex items-start space-x-2">
                        <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${
                          session?.completedSections?.includes(section.id) 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-white/40'
                        }`}>
                          {session?.completedSections?.includes(section.id) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-white/90 text-xs leading-tight cursor-pointer hover:text-white" 
                              onClick={() => handleSectionChange(index)}>
                          {section.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - White Background */}
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
                    {sections.map((section, index) => (
                      <div 
                        key={section.id}
                        className={`border p-6 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer ${
                          index === currentSectionIndex
                            ? 'bg-purple-100 border-purple-300'
                            : session?.completedSections?.includes(section.id)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-purple-50 border-purple-200'
                        }`}
                        onClick={() => handleSectionChange(index)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">
                              {section.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {section.description}
                            </p>
                          </div>
                          {session?.completedSections?.includes(section.id) && (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Section Content */}
                {currentSectionIndex === 0 && (
                  <div className="text-center mb-12">
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg"
                      onClick={() => handleSectionChange(1)}
                    >
                      Next Section
                    </Button>
                  </div>
                )}

                {currentSectionIndex > 0 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">{currentSection.title}</CardTitle>
                        <p className="text-gray-600">{currentSection.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-purple-50 p-6 rounded-lg">
                          <p className="text-center text-gray-600 mb-4">
                            Section content for "{currentSection.title}" will be implemented here.
                            <br />
                            <small className="text-xs">This is a placeholder while the full workbook components are being integrated.</small>
                          </p>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between pt-6">
                          <Button
                            variant="outline"
                            onClick={() => handleSectionChange(Math.max(0, currentSectionIndex - 1))}
                            disabled={currentSectionIndex === 0}
                          >
                            Previous
                          </Button>

                          <Button
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={handleNextSection}
                            disabled={currentSectionIndex >= sections.length - 1}
                          >
                            {currentSectionIndex >= sections.length - 1 ? 'Complete Module' : 'Next Section'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}