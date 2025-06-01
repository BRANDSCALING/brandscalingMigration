import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Brain, 
  Bot,
  GraduationCap,
  Trophy,
  Clock,
  Users
} from "lucide-react";
import LmsAiAssistant from "@/components/LmsAiAssistant";

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  content: string;
  requiredTier: string;
  architectSummary: string;
  alchemistSummary: string;
  isActive: boolean;
}

interface UserProgress {
  moduleId: number;
  completed: boolean;
  completedAt: Date | null;
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

interface UserStats {
  totalModules: number;
  completedModules: number;
  currentStreak: number;
  totalHours: number;
}

export default function LMS() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<'architect' | 'alchemist'>('architect');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch courses and modules
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: !!user,
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    enabled: !!user,
  });

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ['/api/user-stats'],
    enabled: !!user,
  });

  // Mark module complete mutation
  const markCompleteMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      return apiRequest("POST", `/api/modules/${moduleId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-stats'] });
      toast({
        title: "Module Completed",
        description: "Great job! You've completed this module.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark module as complete. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || coursesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Required</h3>
            <p className="text-gray-600">Please log in to access the learning management system.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all modules from all courses
  const allModules = courses?.flatMap((course: Course) => course.modules) || [];
  const currentModule = allModules.find((module: Module) => module.id === selectedModule);
  const moduleProgress = userProgress?.find((progress: UserProgress) => progress.moduleId === selectedModule);

  const handleMarkComplete = () => {
    if (selectedModule) {
      markCompleteMutation.mutate(selectedModule);
    }
  };

  // Check if module is accessible based on tier and previous completions
  const isModuleAccessible = (module: Module) => {
    if (user.role === 'admin') return true;
    
    // Check tier access
    if (module.requiredTier === 'mastermind' && user.role !== 'mastermind') {
      return false;
    }
    
    // Check if previous modules are completed (sequential access)
    const previousModules = allModules.filter((m: Module) => m.order < module.order);
    const allPreviousCompleted = previousModules.every((m: Module) => 
      userProgress?.find((p: UserProgress) => p.moduleId === m.id)?.completed
    );
    
    return allPreviousCompleted;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-semibold">Learning Management System</h1>
            </div>
            
            {/* User Stats */}
            {userStats && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{userStats.completedModules}/{userStats.totalModules} Modules</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{userStats.currentStreak} Day Streak</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {allModules.map((module: Module) => {
                  const isAccessible = isModuleAccessible(module);
                  const isCompleted = userProgress?.find((p: UserProgress) => p.moduleId === module.id)?.completed;
                  
                  return (
                    <Button
                      key={module.id}
                      variant={selectedModule === module.id ? "default" : "ghost"}
                      className={`w-full justify-start text-left h-auto p-3 ${
                        !isAccessible ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => isAccessible && setSelectedModule(module.id)}
                      disabled={!isAccessible}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {isAccessible ? (
                          isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <BookOpen className="h-5 w-5" />
                          )
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">Module {module.order}</div>
                          <div className="text-xs text-gray-500 truncate">{module.title}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentModule ? (
              <div className="space-y-6">
                {/* Module Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">
                          Module {currentModule.order}: {currentModule.title}
                        </CardTitle>
                        <p className="text-gray-600 mt-2">{currentModule.description}</p>
                      </div>
                      {moduleProgress?.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                {/* Mode Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Learning Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={selectedMode} onValueChange={(v) => setSelectedMode(v as 'architect' | 'alchemist')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="architect" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                          🏗️ Architect Mode
                        </TabsTrigger>
                        <TabsTrigger value="alchemist" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                          🧪 Alchemist Mode
                        </TabsTrigger>
                      </TabsList>
                      
                      <div className="mt-4">
                        <TabsContent value="architect">
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2">Architect Mode</h4>
                            <p className="text-sm text-purple-700">{currentModule.architectSummary}</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="alchemist">
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <h4 className="font-medium text-orange-900 mb-2">Alchemist Mode</h4>
                            <p className="text-sm text-orange-700">{currentModule.alchemistSummary}</p>
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Module Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Module Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentModule.content || '<p>Module content will be loaded here.</p>' }} />
                      </div>
                      
                      {!moduleProgress?.completed && (
                        <div className="pt-4 border-t">
                          <Button 
                            onClick={handleMarkComplete}
                            disabled={markCompleteMutation.isPending}
                            className="w-full"
                          >
                            {markCompleteMutation.isPending ? "Marking Complete..." : "Mark Module Complete"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Assistant Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setAiAssistantOpen(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Get AI Help with this Module
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Module</h3>
                  <p className="text-gray-600">Choose a module from the sidebar to begin learning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {currentModule && (
        <LmsAiAssistant
          moduleId={currentModule.id}
          moduleTitle={currentModule.title}
          userMode={selectedMode}
          isOpen={aiAssistantOpen}
          onToggle={() => setAiAssistantOpen(!aiAssistantOpen)}
        />
      )}
    </div>
  );
}