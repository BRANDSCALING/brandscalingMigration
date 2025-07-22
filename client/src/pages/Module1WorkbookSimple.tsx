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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/student')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Module 1: Build the Foundation</h1>
                <p className="text-gray-600">Section {currentSectionIndex + 1} of {sections.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentSectionIndex
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : session?.completedSections?.includes(section.id)
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSectionChange(index)}
                    >
                      <div className="flex items-center space-x-2">
                        {session?.completedSections?.includes(section.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-500">{section.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentSection.title}</CardTitle>
                <p className="text-gray-600">{currentSection.description}</p>
              </CardHeader>
              <CardContent>
                {/* Section Content */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-3">Section: {currentSection.title}</h3>
                    <p className="text-gray-700 mb-4">
                      This section will help you {currentSection.description.toLowerCase()}.
                    </p>
                    
                    {currentSectionIndex === 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Welcome to Module 1: Build the Foundation!</h4>
                        <p>In this module, you'll work through 6 key sections to build a solid foundation for your business:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Validate your business idea with our 4-part filter</li>
                          <li>Reflect on how your E-DNA type impacts your approach</li>
                          <li>Get AI-powered clarity on your business concept</li>
                          <li>Build your core offer using our proven framework</li>
                          <li>Score your idea's viability across key pillars</li>
                          <li>Create your business name and visual identity</li>
                        </ul>
                      </div>
                    )}
                    
                    {currentSectionIndex > 0 && (
                      <div className="bg-white p-4 rounded border">
                        <p className="text-center text-gray-600">
                          Section content for "{currentSection.title}" will be implemented here.
                          <br />
                          <small className="text-xs">This is a placeholder while the full workbook components are being integrated.</small>
                        </p>
                      </div>
                    )}
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
                      onClick={handleNextSection}
                      disabled={currentSectionIndex >= sections.length - 1}
                    >
                      {currentSectionIndex >= sections.length - 1 ? 'Complete Module' : 'Next Section'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}