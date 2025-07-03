import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocation } from 'wouter';
import { 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Bell, 
  TrendingUp,
  Play,
  FileText,
  ExternalLink,
  Star,
  LogOut,
  Brain,
  Target,
  BarChart3,
  Layers,
  Zap,
  CheckCircle,
  Clock,
  Lock,
  Lightbulb,
  Rocket,
  PlusCircle
} from 'lucide-react';

interface DashboardData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    dominantType: string;
    subtype?: string;
    awarenessScore?: number;
    readinessLevel: string;
    accessTier: string;
    assessmentComplete: boolean;
    profileImageUrl?: string;
    lastQuizDate?: string;
  };
  payments: Array<{
    id: number;
    product: string;
    amount: number;
    paidAt: string;
    stripeId: string;
  }>;
  progress: Array<{
    moduleId: number;
    completed: boolean;
    completedAt?: string;
    viewMode: string;
  }>;
  announcements: Array<{
    id: number;
    title: string;
    summary: string;
    createdAt: string;
  }>;
}

// Define authentic course structure based on provided documents
const AUTHENTIC_COURSES = {
  "infinite-scaling": {
    id: "infinite-scaling",
    title: "The Infinite Scaling Methodology",
    description: "The foundational framework of Brandscaling - 7 strategic layers of sustainable business scaling",
    icon: Layers,
    color: "blue",
    layers: [
      {
        id: "profit-maximisation",
        title: "1. Profit Maximisation",
        description: "Unlock cashflow, refine your offer, and optimize for scalable returns",
        status: "available",
        modules: [
          "F.U.S.E. Framework™ (Embedded Offer Design)",
          "Infinite Scaling Methodology (Full 7-Layer System)",
          "Profit Maximization Blueprint (Customer Creation Factory™)",
          "Petals of Persuasion™ (Persuasion without Manipulation)",
          "Doctor–Patient Sales Model (Prescription & Pill)",
          "Core Product Builder",
          "Social Media Systems",
          "Sales Psychology",
          "Marketing Systems"
        ]
      },
      {
        id: "automate",
        title: "2. Automate",
        description: "Systems and automation for scalable operations",
        status: "coming-soon"
      },
      {
        id: "asset-builder",
        title: "3. Asset Builder",
        description: "Build valuable business assets",
        status: "coming-soon"
      },
      {
        id: "multiple-exits",
        title: "4. Multiple Exits",
        description: "Create multiple revenue streams and exit strategies",
        status: "coming-soon"
      },
      {
        id: "platform",
        title: "5. Platform",
        description: "Build platform-based business models",
        status: "coming-soon"
      },
      {
        id: "ecosystem",
        title: "6. Ecosystem",
        description: "Create business ecosystems",
        status: "coming-soon"
      },
      {
        id: "infinite-layer",
        title: "7. ∞ The Infinite Layer",
        description: "A symbolic layer that transcends all",
        status: "coming-soon"
      }
    ]
  },
  "fuse-framework": {
    id: "fuse-framework",
    title: "FUSE FRAMEWORK",
    description: "Complete system for finding problems worth solving and uniting with your solutions",
    icon: Target,
    color: "purple",
    phases: [
      "Find Problems Worth Solving",
      "Unite With Your Services or Product",
      "Scale with Embedded Solutions",
      "Execute with Blackbox Integration"
    ]
  },
  "idea-to-launch": {
    id: "idea-to-launch",
    title: "Idea-to-Launch Kit™",
    description: "A founder's complete startup execution system — designed for UK entrepreneurs",
    icon: Rocket,
    color: "green",
    modules: [
      {
        id: "module-1",
        title: "Module 1: Business Clarity Engine™",
        description: "Extract and validate a launchable business idea"
      },
      {
        id: "module-2",
        title: "Module 2: Name & Brand Identity Fast Track",
        description: "Instantly generate names, logos, colors, and brand presence"
      },
      {
        id: "module-3",
        title: "Module 3: Structure & Setup Layer",
        description: "Legally launch your business with full setup and compliance"
      },
      {
        id: "module-4",
        title: "Module 4: Financial Foundations",
        description: "Create a clean, trackable money system from day one"
      },
      {
        id: "module-5",
        title: "Module 5: Your Digital Presence",
        description: "Get online fast with domains, hosting, email, and landing page"
      },
      {
        id: "module-6",
        title: "Module 6: Brand Presence Boot-Up",
        description: "Launch social channels + establish public credibility"
      },
      {
        id: "module-7",
        title: "Module 7: Execution Planner & AI Toolkit",
        description: "Your 30-day step-by-step execution planner + AI vault"
      }
    ]
  },
  "smart-business-builder": {
    id: "smart-business-builder",
    title: "Smart Business Builder™",
    description: "AI-personalized Lean Canvas alternative based on E-DNA",
    icon: Brain,
    color: "orange",
    status: "coming-soon"
  },
  "ai-mentor-access": {
    id: "ai-mentor-access",
    title: "AI Mentor Access",
    description: "Direct access to AI Architect and AI Alchemist mentors",
    icon: Zap,
    color: "yellow",
    status: "coming-soon"
  },
  "30-day-launch": {
    id: "30-day-launch",
    title: "30 Day Launch Plan",
    description: "Complete 30-day execution plan with daily actions and milestones",
    icon: Calendar,
    color: "indigo"
  }
};

export default function StudentDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Check for student authentication
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    
    if (studentId && studentEmail) {
      setIsAuthenticated(true);
    } else {
      setLocation('/auth');
    }
    setLoading(false);
  }, [setLocation]);
  
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    enabled: isAuthenticated,
    retry: false
  });

  const { data: quizResults } = useQuery({
    queryKey: ['/api/quiz/results'],
    enabled: isAuthenticated
  });

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Access Issue</h2>
            <p className="text-red-600 mb-4">
              Unable to load student dashboard. Authentication error: {error.message}
            </p>
            <div className="space-x-4">
              <Button onClick={() => {
                localStorage.removeItem('studentId');
                localStorage.removeItem('studentEmail');
                setLocation('/auth');
              }}>
                Sign In Again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scale-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { user, payments, progress, announcements } = dashboardData;
  


  const getDNAPersonalization = () => {
    const { dominantType, subtype, awarenessScore } = user;
    
    if (dominantType === 'blurred') {
      return {
        title: `${user.firstName}, your DNA needs recalibration`,
        subtitle: "Reset Challenge Available",
        description: "You're caught between operating modes. The 7-Day Reset Challenge will help you find clarity.",
        color: "red",
        action: "Start 7-Day Reset Challenge",
        actionIcon: Lightbulb
      };
    }
    
    const typeCapitalized = dominantType.charAt(0).toUpperCase() + dominantType.slice(1);
    const subtypeDisplay = subtype ? ` – ${subtype.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : '';
    
    return {
      title: `${typeCapitalized}${subtypeDisplay}`,
      subtitle: awarenessScore ? `${awarenessScore}% aware of your opposite mode` : "Assessment complete",
      description: dominantType === 'architect' 
        ? "You excel at structured thinking and systematic execution. Consider developing your intuitive side for greater magnetism."
        : "You lead with intuition and creative energy. Developing systematic thinking will help you scale efficiently.",
      color: dominantType === 'architect' ? "blue" : "orange",
      action: "Retake Assessment",
      actionIcon: Brain
    };
  };

  const dnaPersonalization = getDNAPersonalization();

  const formatCurrency = (amountInPence: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amountInPence / 100);
  };

  const getCourseIcon = (courseId: keyof typeof AUTHENTIC_COURSES) => {
    return AUTHENTIC_COURSES[courseId]?.icon || BookOpen;
  };

  const getCourseColor = (courseId: keyof typeof AUTHENTIC_COURSES) => {
    return AUTHENTIC_COURSES[courseId]?.color || 'blue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header with DNA Personalization */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20 ring-4 ring-purple-100">
                <AvatarImage src={user.profileImageUrl} />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.firstName}!
                </h1>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="text-lg font-semibold text-purple-700">{dnaPersonalization.title}</span>
                  </div>
                  {dnaPersonalization.subtitle && (
                    <p className="text-gray-600">{dnaPersonalization.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sign Out Button */}
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('studentId');
                localStorage.removeItem('studentEmail');
                localStorage.clear();
                window.dispatchEvent(new Event('auth-logout'));
                setLocation('/');
              }}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DNA-Based Personalization Card */}
        <Card className={`mb-8 border-l-4 ${
          dnaPersonalization.color === 'red' ? 'border-l-red-500 bg-red-50/50' :
          dnaPersonalization.color === 'blue' ? 'border-l-blue-500 bg-blue-50/50' :
          'border-l-orange-500 bg-orange-50/50'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <dnaPersonalization.actionIcon className={`h-6 w-6 ${
                    dnaPersonalization.color === 'red' ? 'text-red-600' :
                    dnaPersonalization.color === 'blue' ? 'text-blue-600' :
                    'text-orange-600'
                  }`} />
                  <h3 className="text-xl font-bold text-gray-900">Your Entrepreneurial DNA</h3>
                </div>
                <p className="text-gray-700 mb-4">{dnaPersonalization.description}</p>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="text-sm">
                    {user.accessTier} Access
                  </Badge>
                  {user.lastQuizDate && (
                    <span className="text-sm text-gray-500">
                      Last assessment: {new Date(user.lastQuizDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <Button 
                variant={dnaPersonalization.color === 'red' ? 'destructive' : 'default'}
                className="ml-6"
                onClick={() => {
                  if (dnaPersonalization.color === 'red') {
                    // Route to 7-Day Reset Challenge
                    setLocation('/reset-challenge');
                  } else {
                    // Route to DNA quiz
                    setLocation('/entrepreneurial-dna-quiz');
                  }
                }}
              >
                <dnaPersonalization.actionIcon className="h-4 w-4 mr-2" />
                {dnaPersonalization.action}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Results Section */}
        {quizResults?.hasResult && (
          <Card className="mb-8 border-purple-200 bg-purple-50/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-purple-900">Your DNA Assessment Results</CardTitle>
                  <CardDescription className="text-purple-700">
                    Completed on {new Date(quizResults.completedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {quizResults.dnaType.charAt(0).toUpperCase() + quizResults.dnaType.slice(1)}
                  </div>
                  <div className="text-sm text-purple-600">Primary DNA Type</div>
                  {quizResults.subtype && (
                    <div className="mt-2 text-sm text-gray-600">
                      {quizResults.subtype.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {quizResults.awarenessScore}%
                  </div>
                  <div className="text-sm text-purple-600">Awareness Score</div>
                  <Progress value={quizResults.awarenessScore} className="mt-2" />
                </div>
                
                <div className="text-center">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Architect:</strong> {quizResults.scores?.architect || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Alchemist:</strong> {quizResults.scores?.alchemist || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Blurred:</strong> {quizResults.scores?.blurred || 0}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/entrepreneurial-dna-quiz')}
                  className="flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>View Full Results</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authentic Course Content */}
        <div className="space-y-8">
          {/* The Infinite Scaling Methodology */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">The Infinite Scaling Methodology™</CardTitle>
                  <CardDescription className="text-blue-700">
                    7 strategic layers of sustainable business scaling - your foundational framework
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {AUTHENTIC_COURSES["infinite-scaling"].layers.map((layer, index) => (
                  <AccordionItem key={layer.id} value={layer.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            layer.status === 'available' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-left font-semibold">{layer.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {layer.status === 'available' ? (
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="bg-white rounded-lg p-4 space-y-3">
                        <p className="text-gray-700">{layer.description}</p>
                        {layer.status === 'available' && layer.modules && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 mb-3">Key frameworks included:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {layer.modules.map((module, moduleIndex) => (
                                <div key={moduleIndex} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className="text-gray-700">{module}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-4">
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setLocation('/courses/infinite-scaling/profit-maximisation')}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start Layer 1
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* FUSE Framework */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-purple-900">FUSE FRAMEWORK™</CardTitle>
                  <CardDescription className="text-purple-700">
                    Complete system for finding problems worth solving and uniting with your solutions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AUTHENTIC_COURSES["fuse-framework"].phases.map((phase, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-900">{phase}</h4>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setLocation('/courses/fuse-framework')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start FUSE Framework
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Idea-to-Launch Kit */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Rocket className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-green-900">Idea-to-Launch Kit™</CardTitle>
                  <CardDescription className="text-green-700">
                    Complete startup execution system designed for UK entrepreneurs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {AUTHENTIC_COURSES["idea-to-launch"].modules.map((module, index) => (
                  <div key={module.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setLocation(`/courses/idea-to-launch/${module.id}`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Business Builder Course */}
          <div className="space-y-6">
            {/* Smart Business Builder */}
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Brain className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-orange-900 text-lg">Smart Business Builder™</CardTitle>
                    <p className="text-orange-700 text-sm">AI-personalized Lean Canvas alternative based on E-DNA</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Module 2 */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="module-2">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                            2
                          </div>
                          <div>
                            <div className="font-medium">Module 2: Name & Brand Identity Fast Track</div>
                            <div className="text-sm text-gray-500">Instantly generate names, logos, colors, and brand presence</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-11 pt-4 space-y-3">
                          <p className="text-gray-600">Create your complete brand identity in minutes with AI-powered tools tailored to your DNA type.</p>
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => setLocation('/courses/smart-business-builder/module-2')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Start Module
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Module 3 */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="module-3">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                            3
                          </div>
                          <div>
                            <div className="font-medium">Module 3: Structure & Setup Layer</div>
                            <div className="text-sm text-gray-500">Legally launch your business with full setup and compliance</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-11 pt-4 space-y-3">
                          <p className="text-gray-600">Set up your business structure, legal requirements, and compliance framework.</p>
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => setLocation('/courses/smart-business-builder/module-3')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Start Module
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Module 4 */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="module-4">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                            4
                          </div>
                          <div>
                            <div className="font-medium">Module 4: Financial Foundations</div>
                            <div className="text-sm text-gray-500">Create a clean, trackable money system from day one</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-11 pt-4 space-y-3">
                          <p className="text-gray-600">Build a robust financial foundation with proper accounting and money management systems.</p>
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => setLocation('/courses/smart-business-builder/module-4')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Start Module
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Module 5 */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="module-5">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                            5
                          </div>
                          <div>
                            <div className="font-medium">Module 5: Your Digital Presence</div>
                            <div className="text-sm text-gray-500">Get online fast with domains, hosting, email, and landing page</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-11 pt-4 space-y-3">
                          <p className="text-gray-600">Establish your digital footprint with professional online presence and infrastructure.</p>
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => setLocation('/courses/smart-business-builder/module-5')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Start Module
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Module 6 */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="module-6">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                            6
                          </div>
                          <div>
                            <div className="font-medium">Module 6: Brand Presence Boot-Up</div>
                            <div className="text-sm text-gray-500">Launch social channels + establish public credibility</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-11 pt-4 space-y-3">
                          <p className="text-gray-600">Build your brand presence across social media and establish credibility in your market.</p>
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => setLocation('/courses/smart-business-builder/module-6')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Start Module
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Module 7 */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="module-7">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                            7
                          </div>
                          <div>
                            <div className="font-medium">Module 7: Execution Planner & AI Toolkit</div>
                            <div className="text-sm text-gray-500">Your 30-day step-by-step execution planner + AI audit</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-11 pt-4 space-y-3">
                          <p className="text-gray-600">Get your complete 30-day execution plan with AI-powered tools and regular audits.</p>
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => setLocation('/courses/smart-business-builder/module-7')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Start Module
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Mentor Access */}
            <Card className="border-yellow-200 bg-yellow-50/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-yellow-900 text-lg">AI Mentor Access</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 text-sm mb-4">
                  Direct access to AI Architect and AI Alchemist mentors
                </p>
                <Badge variant="secondary" className="w-full justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>

            {/* 30 Day Launch Plan */}
            <Card className="border-indigo-200 bg-indigo-50/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-indigo-900 text-lg">30 Day Launch Plan</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-700 text-sm mb-4">
                  Complete 30-day execution plan with daily actions and milestones
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setLocation('/courses/30-day-launch-plan')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Book a Call */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Book a Call</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Ready to accelerate your progress?</p>
                <Button className="w-full" asChild>
                  <a href="https://calendly.com/brandscaling" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </a>
                </Button>
              </CardContent>
            </Card>

          {/* Book a Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Book a Call</span>
              </CardTitle>
              <CardDescription>
                Schedule a session with our expert team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="mb-4">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Ready to accelerate your progress?</p>
                </div>
                <Button className="w-full" asChild>
                  <a href="https://calendly.com/brandscaling" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No payment history available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {payments.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.product}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.paidAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          <Badge variant="secondary" className="text-xs">Paid</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Latest Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Latest Updates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No updates at this time.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement.id} className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{announcement.summary}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}