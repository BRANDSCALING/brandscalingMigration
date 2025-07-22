import { useQuery } from "@tanstack/react-query";
import { DNAModeProvider } from "@/hooks/use-dna-mode";
import { useRoute } from "wouter";
import ProgressSidebar from "../components/workbook/progress-sidebar";
import DNAToggle from "../components/workbook/dna-toggle";
import BusinessFilter from "../components/workbook/business-filter";
import EdnaReflection from "../components/workbook/edna-reflection";
import ClarityPrompts from "../components/workbook/clarity-prompts";
import OfferBuilder from "../components/workbook/offer-builder";
import ViabilityScorecard from "../components/workbook/viability-scorecard";
import NameLogoBuilder from "../components/workbook/name-logo-builder";

import Module1Welcome from "../components/workbook/module1-welcome";
import MobileProgress from "../components/workbook/mobile-progress";
import type { WorkbookSession } from "@shared/schema";

export default function Module1WorkbookExact() {
  const [match, params] = useRoute("/module/:moduleNumber");
  const currentModule = params?.moduleNumber || "1";
  
  const { data: session, isLoading } = useQuery<WorkbookSession>({
    queryKey: ["/api/workbook/session"],
  });

  // Get completion status for the welcome component
  const getCompletedSections = () => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading your workbook...</div>
      </div>
    );
  }

  return (
    <DNAModeProvider>
      <div className="min-h-screen bg-brand-gradient">
        <MobileProgress session={session} />
        <div className="flex min-h-screen pt-16 md:pt-0">
          <ProgressSidebar session={session} />
          
          <div className="flex-1">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold gradient-text">THE IDEA-TO-LAUNCH KIT™</h1>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Module {currentModule}</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
              <Module1Welcome completedSections={getCompletedSections()} />
              
              <div className="space-y-6 sm:space-y-8">
                <BusinessFilter session={session} />
                <EdnaReflection session={session} />
                <ClarityPrompts session={session} />
                <OfferBuilder session={session} />
                <ViabilityScorecard session={session} />
                <NameLogoBuilder session={session} />
              </div>

              {/* Progress Summary Section */}
              <section id="progress-summary" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      ✓
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Progress Summary</h2>
                  </div>
                  <p className="text-gray-600 text-lg">
                    Review your completion status and prepare for Module 2.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Module 1 Completion Status</h3>
                    <div className="space-y-3">
                      {[
                        { id: "section-1-1", title: "What Makes a Business Idea Work?" },
                        { id: "section-1-2", title: "The E-DNA Lens for Idea Clarity" },
                        { id: "section-1-3", title: "Business Idea Clarity Prompts" },
                        { id: "section-1-4", title: "Offer Builder Canvas" },
                        { id: "section-1-5", title: "Idea Viability Scorecard" },
                        { id: "section-1-6", title: "AI Sprint — Name + Logo Builder" },
                      ].map((section) => {
                        const isCompleted = getCompletedSections().includes(section.id);
                        return (
                          <div key={section.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <span className="font-medium text-gray-700">{section.title}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isCompleted 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {isCompleted ? 'Complete' : 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">
                    Once you've completed all sections, you're ready to move forward with your refined business idea and clear offer.
                  </p>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">This workbook is based on the</p>
                    <p className="font-bold text-purple-600 text-lg">Brandscaling Idea to Launch Kit Starter</p>
                    <p className="text-sm text-gray-500">Module 1</p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </DNAModeProvider>
  );
}