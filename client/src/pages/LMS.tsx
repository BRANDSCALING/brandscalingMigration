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
import type { LmsModule, LmsProgress, User } from "@shared/schema";

interface UserStats {
  totalModules: number;
  completedModules: number;
  currentStreak: number;
  totalHours: number;
}

interface ModuleWithAccess extends LmsModule {
  isAccessible: boolean;
  unlockDate?: Date;
}

export default function LMS() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<'architect' | 'alchemist'>('architect');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch modules with access control
  const { data: modules = [], isLoading: modulesLoading } = useQuery<ModuleWithAccess[]>({
    queryKey: ['/api/lms/modules'],
    enabled: !!user,
  });

  // Fetch user progress
  const { data: userProgress = [] } = useQuery<LmsProgress[]>({
    queryKey: ['/api/lms/progress'],
    enabled: !!user,
  });

  // Fetch user stats
  const { data: userStats } = useQuery<UserStats>({
    queryKey: ['/api/lms/stats'],
    enabled: !!user,
  });

  // Mark module complete mutation
  const markCompleteMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      return apiRequest("POST", `/api/lms/modules/${moduleId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lms/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/lms/stats'] });
      toast({
        title: "Module Completed",
        description: "Great job! You've completed this module.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark module as complete. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || modulesLoading) {
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

  const currentModule = modules.find(module => module.id === selectedModule);
  const moduleProgress = userProgress.find(progress => progress.moduleId === selectedModule);

  const handleMarkComplete = () => {
    if (selectedModule) {
      markCompleteMutation.mutate(selectedModule);
    }
  };

  const getModuleStatusBadge = (module: ModuleWithAccess) => {
    const progress = userProgress.find(p => p.moduleId === module.id);
    
    if (progress?.completed) {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
    }
    
    if (!module.isAccessible) {
      return <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" />Locked</Badge>;
    }
    
    return <Badge variant="outline">Available</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Management System</h1>
          <p className="text-gray-600">Master your skills with structured learning paths</p>
        </div>

        {/* Stats Dashboard */}
        {userStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{userStats.completedModules}</p>
                    <p className="text-gray-600 text-sm">Modules Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{userStats.currentStreak}</p>
                    <p className="text-gray-600 text-sm">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{userStats.totalHours}</p>
                    <p className="text-gray-600 text-sm">Hours Learned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{Math.round((userStats.completedModules / userStats.totalModules) * 100)}%</p>
                    <p className="text-gray-600 text-sm">Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedModule === module.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!module.isAccessible ? 'opacity-60' : ''}`}
                    onClick={() => module.isAccessible && setSelectedModule(module.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{module.title}</h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{module.description}</p>
                        {getModuleStatusBadge(module)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Module Content */}
          <div className="lg:col-span-2">
            {currentModule ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{currentModule.title}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAiAssistantOpen(true)}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      AI Assistant
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedMode} onValueChange={(value) => setSelectedMode(value as 'architect' | 'alchemist')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="architect" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Architect Mode
                      </TabsTrigger>
                      <TabsTrigger value="alchemist" className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Alchemist Mode
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="architect" className="mt-6">
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentModule.architectSummary || currentModule.content }} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="alchemist" className="mt-6">
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentModule.alchemistSummary || currentModule.content }} />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4">
                    {!moduleProgress?.completed && (
                      <Button
                        onClick={handleMarkComplete}
                        disabled={markCompleteMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {markCompleteMutation.isPending ? "Marking Complete..." : "Mark as Complete"}
                      </Button>
                    )}
                    
                    {moduleProgress?.completed && (
                      <Badge className="bg-green-500 px-4 py-2">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Module</h3>
                  <p className="text-gray-600">Choose a module from the list to start learning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Assistant */}
        {aiAssistantOpen && currentModule && (
          <LmsAiAssistant
            isOpen={aiAssistantOpen}
            onClose={() => setAiAssistantOpen(false)}
            moduleId={currentModule.id}
            moduleTitle={currentModule.title}
          />
        )}
      </div>
    </div>
  );
}