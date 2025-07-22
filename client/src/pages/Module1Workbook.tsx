import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDNAMode } from "@/hooks/use-dna-mode";

// Import all Module 1 components
import Module1Welcome from "@/components/workbook/module1-welcome";
import BusinessFilter from "@/components/workbook/business-filter";
import EdnaReflection from "@/components/workbook/edna-reflection";
import ClarityPrompts from "@/components/workbook/clarity-prompts";
import OfferBuilder from "@/components/workbook/offer-builder";
import ViabilityScorecard from "@/components/workbook/viability-scorecard";
import NameLogoBuilder from "@/components/workbook/name-logo-builder";
import ProgressSidebar from "@/components/workbook/progress-sidebar";
import MobileProgress from "@/components/workbook/mobile-progress";
import DNAToggle from "@/components/workbook/dna-toggle";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";

interface WorkbookSession {
  id: string;
  userId: string;
  dnaMode: 'architect' | 'alchemist';
  businessFilter?: any;
  ednaReflection?: any;
  clarityPrompts?: any;
  offerBuilder?: any;
  viabilityScores?: any;
  brandingResults?: any;
  nameLogoBuilder?: any;
  completedSections: string[];
  currentSection: number;
}

const sections = [
  { id: 'welcome', title: 'Module 1: Build the Foundation', component: 'welcome' },
  { id: 'business-filter', title: '1.1 Business Filter', component: 'business-filter' },
  { id: 'edna-reflection', title: '1.2 E-DNA Reflection', component: 'edna-reflection' },
  { id: 'clarity-prompts', title: '1.3 Clarity Prompts', component: 'clarity-prompts' },
  { id: 'offer-builder', title: '1.4 Offer Builder', component: 'offer-builder' },
  { id: 'viability-scorecard', title: '1.5 Viability Scorecard', component: 'viability-scorecard' },
  { id: 'name-logo-builder', title: '1.6 Name & Logo Builder', component: 'name-logo-builder' }
];

export default function Module1Workbook() {
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
      
      if (!response.ok) {
        throw new Error('Failed to update session');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workbook/session'] });
    },
  });

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      
      // Update progress
      const completedSections = [...(session?.completedSections || [])];
      const currentSectionId = sections[currentSectionIndex].id;
      if (!completedSections.includes(currentSectionId)) {
        completedSections.push(currentSectionId);
      }
      
      updateSession.mutate({
        completedSections,
        currentSection: nextIndex
      });
    }
  };

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    updateSession.mutate({ currentSection: sectionIndex });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Module 1: Build the Foundation...</p>
        </div>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const progress = ((session?.completedSections?.length || 0) / (sections.length - 1)) * 100;

  const renderCurrentSection = () => {
    switch (currentSection.component) {
      case 'welcome':
        return (
          <Module1Welcome
            completedSections={session?.completedSections || []}
            onStartClick={() => handleSectionChange(1)}
          />
        );
      case 'business-filter':
        return (
          <BusinessFilter
            session={session}
          />
        );
      case 'edna-reflection':
        return (
          <EdnaReflection
            session={session}
          />
        );
      case 'clarity-prompts':
        return (
          <ClarityPrompts
            session={session}
          />
        );
      case 'offer-builder':
        return (
          <OfferBuilder
            session={session}
          />
        );
      case 'viability-scorecard':
        return (
          <ViabilityScorecard
            session={session}
          />
        );
      case 'name-logo-builder':
        return (
          <NameLogoBuilder
            session={session}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/student')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Module 1: Build the Foundation</h1>
                  <p className="text-sm text-gray-600">{currentSection.title}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DNAToggle />
              <div className="text-sm text-gray-600">
                Progress: {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ProgressSidebar session={session} />
        </div>

        {/* Mobile Progress */}
        <div className="lg:hidden">
          <MobileProgress session={session} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {renderCurrentSection()}
          </div>
        </div>
      </div>
    </div>
  );
}