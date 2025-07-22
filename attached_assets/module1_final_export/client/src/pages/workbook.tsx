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
import Module2Welcome from "../components/module2/Module2Welcome";
import BrandFoundation from "../components/module2/brand-foundation";
import BrandIdentityFastTrack from "../components/module2/brand-identity-fast-track";
import LogoVisualIdentity from "../components/module2/logo-visual-identity";
import BrandStoryGuideline from "../components/module2/brand-story-guideline";
import SocialProfileSetup from "../components/module2/social-profile-setup";
import LinkInfrastructure from "../components/module2/link-infrastructure";
import BrandBioProfile from "../components/module2/brand-bio-profile";
import ContentLaunchChecklist from "../components/module2/content-launch-checklist";

import MobileProgress from "../components/workbook/mobile-progress";
import type { WorkbookSession } from "@shared/schema";

export default function Workbook() {
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
              {currentModule === "1" ? (
                <>
                  <Module1Welcome completedSections={getCompletedSections()} />
                  
                  {/* DNA Toggle - Choose Your Entrepreneurial DNA */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6 mb-8">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-strategic-black mb-4">Choose Your Entrepreneurial DNA</h3>
                      <p className="text-gray-600 mb-6">Select your natural approach to building a business. This will customize your experience throughout the workbook.</p>
                      <div className="flex justify-center">
                        <DNAToggle />
                      </div>
                    </div>
                  </div>
                  
                  <BusinessFilter session={session} />
                  <EdnaReflection session={session} />
                  <ClarityPrompts session={session} />
                  <OfferBuilder session={session} />
                  <ViabilityScorecard session={session} />
                  <NameLogoBuilder session={session} />
                  
                  {/* Progress Summary - Final Section */}
                  <div id="progress-summary" className="mt-12">
                    <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-8">
                      <h2 className="text-2xl font-bold text-strategic-black mb-6">Your Progress Summary</h2>
                      
                      <div className="overflow-x-auto mb-8">
                        <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-purple-200">
                          <thead>
                            <tr className="bg-gradient-to-r from-purple-100 to-orange-100 border-b border-purple-200">
                              <th className="p-4 text-left font-semibold text-strategic-black border-r border-purple-200">Section</th>
                              <th className="p-4 text-center font-semibold text-strategic-black">Completed</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                              <td className="p-4 text-strategic-black border-r border-purple-100">1.1: What Makes a Business Idea Work?</td>
                              <td className="p-4 text-center">
                                <input type="checkbox" checked={getCompletedSections().includes("section-1-1")} readOnly className="w-5 h-5 accent-purple-500" />
                              </td>
                            </tr>
                            <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                              <td className="p-4 text-strategic-black border-r border-purple-100">1.2: The E-DNA Lens for Idea Clarity</td>
                              <td className="p-4 text-center">
                                <input type="checkbox" checked={getCompletedSections().includes("section-1-2")} readOnly className="w-5 h-5 accent-purple-500" />
                              </td>
                            </tr>
                            <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                              <td className="p-4 text-strategic-black border-r border-purple-100">1.3: Business Idea Clarity Prompts</td>
                              <td className="p-4 text-center">
                                <input type="checkbox" checked={getCompletedSections().includes("section-1-3")} readOnly className="w-5 h-5 accent-purple-500" />
                              </td>
                            </tr>
                            <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                              <td className="p-4 text-strategic-black border-r border-purple-100">1.4: Offer Builder Canvas</td>
                              <td className="p-4 text-center">
                                <input type="checkbox" checked={getCompletedSections().includes("section-1-4")} readOnly className="w-5 h-5 accent-purple-500" />
                              </td>
                            </tr>
                            <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                              <td className="p-4 text-strategic-black border-r border-purple-100">1.5: Idea Viability Scorecard</td>
                              <td className="p-4 text-center">
                                <input type="checkbox" checked={getCompletedSections().includes("section-1-5")} readOnly className="w-5 h-5 accent-purple-500" />
                              </td>
                            </tr>
                            <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                              <td className="p-4 text-strategic-black border-r border-purple-100">1.6: AI Sprint — Name + Logo Builder</td>
                              <td className="p-4 text-center">
                                <input type="checkbox" checked={getCompletedSections().includes("section-1-6")} readOnly className="w-5 h-5 accent-purple-500" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Next Steps - Separate Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-strategic-black mb-4">Next Steps</h3>
                        <p className="text-gray-700">Once you've filled in all sections, you're ready to move forward with your refined business idea and clear offer.</p>
                      </div>
                      
                      {/* Brandscaling Attribution - Beautiful Display */}
                      <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-orange-50 border border-purple-200 rounded-lg">
                        <div className="inline-block">
                          <p className="text-sm text-gray-600 mb-2">This workbook is based on the</p>
                          <h4 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                            Brandscaling Idea to Launch Kit Starter
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">Module 1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : currentModule === "2" ? (
                <>
                  <Module2Welcome 
                    completedSections={[]} 
                  />
                  {session && <BrandFoundation session={session} />}
                  {session && <BrandIdentityFastTrack session={session} />}
                  {session && <LogoVisualIdentity session={session} />}
                  {session && <BrandStoryGuideline session={session} />}
                  {session && <SocialProfileSetup session={session} />}
                  {session && <LinkInfrastructure session={session} />}
                  {session && <BrandBioProfile session={session} />}
                  {session && <ContentLaunchChecklist session={session} />}
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-strategic-black mb-4">Module {currentModule}</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </DNAModeProvider>
  );
}
