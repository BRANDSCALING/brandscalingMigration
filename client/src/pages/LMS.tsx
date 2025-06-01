import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import LmsAiAssistant from '@/components/LmsAiAssistant';
import { 
  BookOpen, 
  Download, 
  Video, 
  CheckCircle, 
  Lock,
  User,
  Brain,
  Calendar,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

interface Module {
  id: number;
  title: string;
  description: string;
  architectContent: {
    videoUrl: string;
    workbookUrl: string;
    summary: string;
  };
  alchemistContent: {
    videoUrl: string;
    workbookUrl: string;
    summary: string;
  };
  order: number;
  requiredRole: string;
}

interface UserProgress {
  moduleId: number;
  completed: boolean;
  completedAt?: string;
}

export default function LMS() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedMode, setSelectedMode] = useState<'architect' | 'alchemist'>('architect');
  const [selectedModule, setSelectedModule] = useState<number>(1);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's personality type from quiz results
  useEffect(() => {
    const quizResult = localStorage.getItem('quiz-result');
    if (quizResult) {
      const result = JSON.parse(quizResult);
      setSelectedMode(result.type?.toLowerCase() === 'alchemist' ? 'alchemist' : 'architect');
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to access the LMS. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch modules
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/lms/modules'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch user progress
  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['/api/lms/progress'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Mark module as complete
  const markCompleteMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      await apiRequest('POST', '/api/lms/progress', { moduleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lms/progress'] });
      toast({
        title: "Progress Updated",
        description: "Module marked as complete!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Check if user has access
  const hasAccess = user?.role === 'buyer' || user?.role === 'mastermind' || user?.role === 'admin';
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <CardTitle>LMS Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              You need to purchase access to unlock the learning management system.
            </p>
            <Button 
              onClick={() => window.location.href = '/courses'}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
            >
              View Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentModule = modules.find((m: Module) => m.id === selectedModule);
  const moduleProgress = progress.find((p: UserProgress) => p.moduleId === selectedModule);
  const completedModules = progress.filter((p: UserProgress) => p.completed).length;
  const progressPercentage = modules.length > 0 ? (completedModules / modules.length) * 100 : 0;

  const isModuleAccessible = (module: Module) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'mastermind') return true;
    if (user?.role === 'buyer') {
      // Buyers can access first 3 modules
      return module.order <= 3;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Learning Management System
          </h1>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Welcome, {user?.firstName || user?.email}</span>
              <Badge variant="secondary">{user?.role}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Progress: {completedModules}/{modules.length} modules</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modulesLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-10 bg-gray-200 rounded" />
                    ))}
                  </div>
                ) : (
                  modules.map((module: Module) => {
                    const isCompleted = progress.some((p: UserProgress) => p.moduleId === module.id && p.completed);
                    const isAccessible = isModuleAccessible(module);
                    
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
                  })
                )}
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
                      
                      <TabsContent value="architect" className="mt-6">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-2">Architect Approach</h4>
                          <p className="text-purple-700">{currentModule.architectContent?.summary}</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="alchemist" className="mt-6">
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <h4 className="font-semibold text-orange-800 mb-2">Alchemist Approach</h4>
                          <p className="text-orange-700">{currentModule.alchemistContent?.summary}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Video */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Training Video
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        {selectedMode === 'architect' && currentModule.architectContent?.videoUrl ? (
                          <iframe
                            src={currentModule.architectContent.videoUrl}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                          />
                        ) : selectedMode === 'alchemist' && currentModule.alchemistContent?.videoUrl ? (
                          <iframe
                            src={currentModule.alchemistContent.videoUrl}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                          />
                        ) : (
                          <div className="text-center text-gray-500">
                            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Video content coming soon</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resources */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Workbook Download */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{selectedMode === 'architect' ? 'Architect' : 'Alchemist'} Workbook</h4>
                            <p className="text-sm text-gray-600">PDF workbook and exercises</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const url = selectedMode === 'architect' 
                                ? currentModule.architectContent?.workbookUrl 
                                : currentModule.alchemistContent?.workbookUrl;
                              if (url) {
                                window.open(url, '_blank');
                              } else {
                                toast({
                                  title: "Coming Soon",
                                  description: "Workbook will be available soon",
                                });
                              }
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {/* Progress Checkbox */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id={`complete-${currentModule.id}`}
                            checked={moduleProgress?.completed || false}
                            onCheckedChange={(checked) => {
                              if (checked && !moduleProgress?.completed) {
                                markCompleteMutation.mutate(currentModule.id);
                              }
                            }}
                            disabled={markCompleteMutation.isPending}
                          />
                          <label 
                            htmlFor={`complete-${currentModule.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Mark as Complete
                          </label>
                        </div>
                        {moduleProgress?.completed && moduleProgress.completedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Completed on {new Date(moduleProgress.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Select a Module</h3>
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