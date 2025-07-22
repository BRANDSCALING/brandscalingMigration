import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

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

export default function Module1WorkbookExact() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDNAMode, setSelectedDNAMode] = useState<'architect' | 'alchemist'>('architect');
  const [businessFilterAnswers, setBusinessFilterAnswers] = useState({
    problem: null as boolean | null,
    person: null as boolean | null,
    profit: null as boolean | null,
    pull: null as boolean | null
  });
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

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Loading Module 1...</h2>
          <p>Preparing your workbook experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 border-b border-white/20">
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

      <div className="flex h-[calc(100vh-80px)]">
        {/* Collapsible Sidebar */}
        <div className={`bg-purple-700/50 backdrop-blur-sm border-r border-white/20 transition-all duration-300 ${
          sidebarCollapsed ? 'w-12' : 'w-80'
        }`}>
          {/* Sidebar Toggle */}
          <div className="p-4 border-b border-white/20">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white hover:bg-white/10 p-2 rounded-lg w-full flex items-center justify-center"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="p-4">
              {/* Module Progress */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-2">Module Progress</h3>
                <div className="text-white/80 text-sm">14%</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '14%' }}></div>
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Modules</h4>
                
                {/* Module 1 - Active */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold text-sm">Module 1</span>
                    <span className="text-xs bg-white text-purple-700 px-2 py-1 rounded font-medium">
                      Business Foundation
                    </span>
                  </div>
                  
                  {/* Progress Items */}
                  <div className="space-y-2">
                    {[
                      { id: 'welcome', title: 'Welcome to Module 1', desc: 'Introduction to Build the Foundation' },
                      { id: 'business-filter', title: 'What Makes a Business Idea Work?', desc: '4-part viable business filter' },
                      { id: 'edna-lens', title: 'The E-DNA Lens for Idea Clarity', desc: 'Entrepreneurial DNA analysis' },
                      { id: 'clarity-prompts', title: 'Business Idea Clarity Prompts', desc: 'AI-powered insights' },
                      { id: 'offer-builder', title: 'Offer Builder Canvas', desc: '5-part framework' },
                      { id: 'viability-scorecard', title: 'Idea Viability Scorecard', desc: 'Completed', completed: true },
                      { id: 'name-logo', title: 'AI Sprint — Name + Logo Builder', desc: 'Business naming & branding' },
                      { id: 'progress-summary', title: 'Your Progress Summary', desc: 'Review completion status' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-start space-x-2">
                        <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${
                          item.completed ? 'bg-green-500 border-green-500' : 'border-white/40'
                        }`}>
                          {item.completed && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-white/90 text-xs font-medium leading-tight cursor-pointer hover:text-white">
                            {item.title}
                          </div>
                          <div className="text-white/60 text-xs">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Energy Level */}
                <div className="bg-white/5 rounded-lg p-3 mt-4">
                  <h4 className="text-white font-semibold text-sm mb-3">Energy Level</h4>
                  <div className="text-white/70 text-xs mb-2">Energised (7/10)</div>
                  <div className="text-white/60 text-xs italic">"You're building momentum! Keep going."</div>
                  
                  <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-lg">
                    Start Module 2
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Welcome Section */}
            <div className="mb-12" id="welcome">
              <div className="text-center mb-8">
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
              <div className="mb-8">
                <Card className="border-l-4 border-purple-500 bg-purple-50">
                  <CardContent className="p-6">
                    <blockquote className="text-lg italic text-gray-700 text-center leading-relaxed">
                      "A business idea works when it solves a real problem — for a real person — in a way that makes you money — and doesn't drain your energy."
                    </blockquote>
                    <cite className="block text-center text-sm font-medium text-gray-600 mt-4">
                      — Brandscaling Philosophy
                    </cite>
                  </CardContent>
                </Card>
              </div>

              {/* What You'll Be Working Through */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                  What You'll Be Working Through
                </h2>
                
                <div className="grid gap-4">
                  {[
                    { title: "What Makes a Business Idea Work?", desc: "4-part viable business filter" },
                    { title: "The E-DNA Lens for Idea Clarity", desc: "Entrepreneurial DNA analysis" },
                    { title: "Business Idea Clarity Prompts", desc: "AI-powered insights" },
                    { title: "Offer Builder Canvas", desc: "5-part framework" },
                    { title: "Idea Viability Scorecard", desc: "Score your idea across 8 key pillars" },
                    { title: "AI Sprint — Name + Logo Builder", desc: "Branding your business" }
                  ].map((item, index) => (
                    <Card key={index} className="bg-purple-50 border-purple-200 hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* DNA Mode Selection */}
            <div className="mb-12" id="dna-selection">
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-center">Choose Your Entrepreneurial DNA</CardTitle>
                  <p className="text-center text-gray-600">
                    Select your natural approach to building a business. This will customize your experience throughout the workbook.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Your E-DNA:</div>
                      <div className="flex gap-4">
                        <Button
                          variant={selectedDNAMode === 'architect' ? 'default' : 'outline'}
                          className={selectedDNAMode === 'architect' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                          onClick={() => setSelectedDNAMode('architect')}
                        >
                          Architect
                        </Button>
                        <Button
                          variant={selectedDNAMode === 'alchemist' ? 'default' : 'outline'}
                          className={selectedDNAMode === 'alchemist' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                          onClick={() => setSelectedDNAMode('alchemist')}
                        >
                          Alchemist
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business Filter Section */}
            <div className="mb-12" id="business-filter">
              <Card className="bg-purple-700 text-white">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                    <CardTitle>What Makes a Business Idea Work?</CardTitle>
                  </div>
                  <p className="text-purple-100">
                    To help entrepreneurs understand the difference between an inspiring idea and a viable business. This page builds clarity, confidence, and alignment before moving forward.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Quick Insight</h4>
                    <p className="text-sm italic">
                      "A business idea works when it solves a real problem, for a real person, in a way that makes you money — and doesn't drain your energy." — Brandscaling Philosophy
                    </p>
                    <p className="text-sm mt-2">
                      Most entrepreneurs focus on what they love, but forget the other layers: profitability, delivery model, energy alignment, and market need. This section sets the foundation for a business idea that works in real life — not just in your head.
                    </p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">
                      {selectedDNAMode === 'architect' ? 'Architect Mode: Strategic Analysis' : 'Alchemist Mode: Intuitive Flow'}
                    </h4>
                    {selectedDNAMode === 'architect' ? (
                      <div>
                        <p className="font-medium text-purple-200 mb-2">Core Risk: Over-focus on logic, skip emotional pull</p>
                        <p className="text-sm">Remember: You need magnetism, not just function. The market is human.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-orange-200 mb-2">Core Risk: Follow passion, skip practical delivery</p>
                        <p className="text-sm">Remember: Great energy needs great structure. Passion without profit burns out.</p>
                      </div>
                    )}
                  </div>

                  {/* Business Filter Questions */}
                  <div className="space-y-6">
                    {[
                      {
                        key: 'problem',
                        title: 'Problem',
                        question: 'Does this solve a real problem (or deep desire) for a specific person?',
                        help: 'If the answer is vague, you need more clarity.'
                      },
                      {
                        key: 'person',
                        title: 'Person',
                        question: 'Do I know who this is for? Can I describe them?',
                        help: 'If your answer is "everyone", you need to write this down.'
                      },
                      {
                        key: 'profit',
                        title: 'Profit',
                        question: 'Am I personally energized and excited to do this?',
                        help: 'This is where alignment happens. Don\'t skip it.'
                      },
                      {
                        key: 'pull',
                        title: 'Pull',
                        question: 'Am I personally energized and excited to do this?',
                        help: 'This is where alignment happens. Don\'t skip it.'
                      }
                    ].map((item) => (
                      <Card key={item.key} className="bg-white text-gray-900">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {item.title.charAt(0)}
                            </div>
                            <h4 className="font-semibold">{item.title}</h4>
                          </div>
                          <p className="font-medium mb-3">{item.question}</p>
                          
                          <div className="flex space-x-4 mb-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={item.key}
                                value="yes"
                                checked={businessFilterAnswers[item.key as keyof typeof businessFilterAnswers] === true}
                                onChange={() => setBusinessFilterAnswers(prev => ({
                                  ...prev,
                                  [item.key]: true
                                }))}
                                className="text-green-500"
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={item.key}
                                value="no"
                                checked={businessFilterAnswers[item.key as keyof typeof businessFilterAnswers] === false}
                                onChange={() => setBusinessFilterAnswers(prev => ({
                                  ...prev,
                                  [item.key]: false
                                }))}
                                className="text-red-500"
                              />
                              <span>No</span>
                            </label>
                          </div>
                          
                          <p className="text-xs text-gray-600">{item.help}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* AI Clarity Section */}
                  <Card className="bg-white/10">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 text-white">Get AI Clarity</h4>
                      <p className="text-sm text-purple-100 mb-3">
                        Edit the prompt below and get instant AI feedback:
                      </p>
                      
                      <textarea
                        className="w-full h-24 p-3 rounded-lg bg-white text-gray-900 text-sm"
                        placeholder="• What: I want to provide coaching and AI business automation for law firms • Why: Legal processes are slow, repetitive, and overwhelming • Target: UK solicitors who lack tech expertise • Who: I'm a business consultant who's worked in fintech • How I imagine making money: [Insert] • Can you help me review this and tell me what's missing?"
                      />
                      
                      <div className="flex space-x-2 mt-3">
                        <Button className="bg-purple-600 hover:bg-purple-700">Get AI Response</Button>
                        <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                          Copy Prompt
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-medium text-white mb-2">Your AI Response Space</h5>
                        <div className="bg-white/20 rounded-lg p-4 min-h-[100px] text-sm">
                          <p className="text-purple-100 italic">Paste your AI response and insights here...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            {/* Progress Summary */}
            <div className="mb-12" id="progress-summary">
              <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Your Progress Summary</h2>
                  
                  <div className="bg-white/90 text-gray-900 rounded-lg p-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Section</th>
                          <th className="text-right py-2">Completed</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        {[
                          { title: "1.1: What Makes a Business Idea Work?" },
                          { title: "1.2: The E-DNA Lens for Idea Clarity" },
                          { title: "1.3: Business Idea Clarity Prompts" },
                          { title: "1.4: Offer Builder Canvas" },
                          { title: "1.5: Idea Viability Scorecard", completed: true },
                          { title: "1.6: AI Sprint — Name + Logo Builder" }
                        ].map((item, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-2">{item.title}</td>
                            <td className="text-right py-2">
                              <input type="checkbox" checked={item.completed || false} readOnly className="rounded" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Next Steps</h4>
                      <p className="text-sm text-gray-600">
                        Once you've filled in all sections, you're ready to move forward with your refined business idea and clear offer.
                      </p>
                      
                      <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">This workbook is based on the</p>
                        <p className="font-bold text-purple-600">Brandscaling Idea to Launch Kit Starter</p>
                        <p className="text-sm text-gray-600">Module 1</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}