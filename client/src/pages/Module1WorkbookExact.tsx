import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ProgressSidebar from "@/components/workbook/progress-sidebar";
import Module1Welcome from "@/components/workbook/module1-welcome";
import BusinessFilter from "@/components/workbook/business-filter";

// Get completion status for components
const getCompletedSections = (session?: WorkbookSession): string[] => {
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
      Object.values(session.viabilityScores).some(score => score > 0)) {
    completed.push("section-1-5");
  }
  
  // Section 1.6: Name & Logo Builder
  if (session.nameLogoBuilder && 
      (session.nameLogoBuilder.businessName || session.nameLogoBuilder.tagline)) {
    completed.push("section-1-6");
  }
  
  return completed;
};

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
  energyLevel?: number;
  completedSections: string[];
  currentSection: number;
  totalSections: number;
  createdAt: string;
  updatedAt: string;
}

export default function Module1WorkbookExact() {
  const [, setLocation] = useLocation();
  
  // Fetch workbook session
  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ["/api/workbook/session"],
    refetchOnMount: true,
  });

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading your workbook...</div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Error loading workbook session. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-700 to-indigo-800 border-b border-white/20 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/student')}
              className="text-white hover:bg-white/10 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center">
              <div className="text-white/90 text-sm font-medium uppercase tracking-wider">
                THE IDEA-TO-LAUNCH KIT™
              </div>
              <div className="text-white text-lg font-bold">
                Module 1
              </div>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-[80px] min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
        {/* Progress Sidebar */}
        <ProgressSidebar session={session} />

        {/* Main Content Area */}
        <div className="ml-80 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto p-8 space-y-16">
            {/* Module 1 Welcome */}
            <Module1Welcome 
              completedSections={getCompletedSections(session)}
              dnaMode={session?.dnaMode}
              onStartClick={() => {
                const element = document.getElementById("business-filter");
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />

            {/* Business Filter Section */}
            <BusinessFilter session={session} />

            {/* E-DNA Reflection Section */}
            <div id="edna-reflection" className="space-y-8">
              <div className="bg-purple-700 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white text-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-bold">The E-DNA Lens for Idea Clarity</h2>
                </div>
                <p className="text-purple-100">
                  Understanding how your entrepreneurial DNA affects your business approach and decision-making process.
                </p>
              </div>

              <Card className="bg-white border-purple-200 p-6">
                <h3 className="text-lg font-bold mb-4">DNA Reflection Questions</h3>
                <p className="text-gray-600 mb-6">
                  Based on your {session?.dnaMode === 'architect' ? 'Architect' : 'Alchemist'} DNA, reflect on these specific questions:
                </p>

                {session?.dnaMode === 'architect' ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Architect Reflection 1</h4>
                      <p className="text-blue-700 text-sm">How can you build systems and processes around this idea to ensure scalability and efficiency?</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Architect Reflection 2</h4>
                      <p className="text-blue-700 text-sm">What potential risks and challenges do you foresee, and how would you mitigate them?</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Alchemist Reflection 1</h4>
                      <p className="text-orange-700 text-sm">How does this idea align with your intuitive sense of what the market needs right now?</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Alchemist Reflection 2</h4>
                      <p className="text-orange-700 text-sm">What creative approaches could you use to differentiate this idea in the marketplace?</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Clarity Prompts Section */}
            <div id="clarity-prompts" className="space-y-8">
              <div className="bg-purple-700 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white text-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    3
                  </div>
                  <h2 className="text-2xl font-bold">Business Idea Clarity Prompts</h2>
                </div>
                <p className="text-purple-100">
                  AI-powered insights to refine and strengthen your business concept.
                </p>
              </div>

              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 p-6">
                <h3 className="font-bold text-lg mb-4">AI-Powered Business Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Use these targeted prompts to get specific AI feedback on different aspects of your business idea.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Market Validation Prompt</h4>
                    <p className="text-sm text-gray-600 mb-2">Get AI analysis on market demand and competition.</p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Generate Prompt
                    </Button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Revenue Model Prompt</h4>
                    <p className="text-sm text-gray-600 mb-2">Explore monetization strategies and pricing.</p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Generate Prompt
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Offer Builder Section */}
            <div id="offer-builder" className="space-y-8">
              <div className="bg-purple-700 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white text-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    4
                  </div>
                  <h2 className="text-2xl font-bold">Offer Builder Canvas</h2>
                </div>
                <p className="text-purple-100">
                  Structure your business offering using our 5-part framework.
                </p>
              </div>

              <Card className="bg-white border-purple-200 p-6">
                <h3 className="text-lg font-bold mb-6">5-Part Offer Framework</h3>
                
                <div className="space-y-6">
                  {[
                    { title: "Transformation", description: "What change do you create for your customers?" },
                    { title: "Vehicle", description: "How do you deliver this transformation?" },
                    { title: "Price", description: "What do you charge for this value?" },
                    { title: "Guarantee", description: "How do you reduce their risk?" },
                    { title: "Urgency", description: "Why should they act now?" }
                  ].map((item, index) => (
                    <div key={item.title} className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold">{item.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Viability Scorecard Section */}
            <div id="viability-scorecard" className="space-y-8">
              <div className="bg-purple-700 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white text-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    5
                  </div>
                  <h2 className="text-2xl font-bold">Idea Viability Scorecard</h2>
                </div>
                <p className="text-purple-100">
                  Score your business concept across 8 key pillars of viability.
                </p>
              </div>

              <Card className="bg-white border-purple-200 p-6">
                <h3 className="text-lg font-bold mb-6">8-Pillar Assessment</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    "Market Demand", "Competition Analysis", "Revenue Potential", "Delivery Capability",
                    "Personal Alignment", "Resource Requirements", "Risk Assessment", "Growth Potential"
                  ].map((pillar, index) => (
                    <div key={pillar} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{pillar}</h4>
                        <div className="text-sm text-gray-500">0/10</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Name & Logo Builder Section */}
            <div id="name-logo-builder" className="space-y-8">
              <div className="bg-purple-700 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white text-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    6
                  </div>
                  <h2 className="text-2xl font-bold">AI Sprint — Name + Logo Builder</h2>
                </div>
                <p className="text-purple-100">
                  Create your business name and visual identity with AI assistance.
                </p>
              </div>

              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 p-6">
                <h3 className="font-bold text-lg mb-4">Business Naming & Branding</h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Business Name Generator</h4>
                    <p className="text-sm text-gray-600 mb-4">Generate unique names based on your business concept.</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Generate Names
                    </Button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Logo Concept Creator</h4>
                    <p className="text-sm text-gray-600 mb-4">Create logo concepts that align with your brand vision.</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Create Logo Concepts
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Progress Summary Section */}
            <div id="progress-summary" className="space-y-8">
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                    ✓
                  </div>
                  <h2 className="text-2xl font-bold">Your Progress Summary</h2>
                </div>
                <p className="text-green-100">
                  Review your completion status and prepare for Module 2.
                </p>
              </div>

              <Card className="bg-white border-green-200 p-6">
                <h3 className="text-lg font-bold mb-6">Module 1 Completion Status</h3>
                
                <div className="space-y-4">
                  {[
                    { section: "Business Filter", completed: false },
                    { section: "E-DNA Reflection", completed: false },
                    { section: "Clarity Prompts", completed: false },
                    { section: "Offer Builder", completed: false },
                    { section: "Viability Scorecard", completed: true },
                    { section: "Name & Logo Builder", completed: false }
                  ].map((item) => (
                    <div key={item.section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.section}</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        item.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.completed ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Continue to Module 2
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}