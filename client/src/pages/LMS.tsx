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
  Clock,
  Crown,
  Play,
  FileText
} from 'lucide-react';

interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  requiredRole: string;
  isAccessible: boolean;
  unlockDate?: string;
  unlockAfterDays: number;
  isLocked: boolean;
  completed: boolean;
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
}

interface UserProgress {
  moduleId: number;
  completed: boolean;
  completedAt?: string;
}

export default function LMS() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedMode, setSelectedMode] = useState<'architect' | 'alchemist'>('architect');
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
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

  // Fetch modules with access control
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/lms/modules'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Mark module as complete
  const markCompleteMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      await apiRequest('POST', '/api/lms/progress', { moduleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lms/modules'] });
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

  if (isLoading || !isAuthenticated || modulesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const typedModules = modules as Module[];
  const completedModules = typedModules.filter(m => m.completed).length;
  const progressPercentage = typedModules.length > 0 ? (completedModules / typedModules.length) * 100 : 0;
  
  // Auto-select first accessible module if none selected
  useEffect(() => {
    if (!selectedModule && typedModules.length > 0) {
      const firstAccessible = typedModules.find(m => m.isAccessible);
      if (firstAccessible) {
        setSelectedModule(firstAccessible.id);
      }
    }
  }, [typedModules, selectedModule]);

  const currentModule = typedModules.find(m => m.id === selectedModule);

  // Countdown timer for locked modules
  const getCountdownText = (unlockDate: string) => {
    const now = new Date().getTime();
    const unlock = new Date(unlockDate).getTime();
    const diff = unlock - now;
    
    if (diff <= 0) return "Available now";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Unlocks in ${days} day${days > 1 ? 's' : ''}`;
    return `Unlocks in ${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              LMS Dashboard
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{(user as any)?.firstName || (user as any)?.email}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  (user as any)?.role === 'mastermind' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {(user as any)?.role === 'mastermind' && <Crown className="h-3 w-3 mr-1" />}
                {(user as any)?.role}
              </Badge>
            </div>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{completedModules}/{typedModules.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setSelectedMode('architect')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  selectedMode === 'architect'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Brain className="h-4 w-4 inline mr-2" />
                Architect
              </button>
              <button
                onClick={() => setSelectedMode('alchemist')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  selectedMode === 'alchemist'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Brain className="h-4 w-4 inline mr-2" />
                Alchemist
              </button>
            </div>
          </div>

          {/* Module List */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Modules</h3>
            <div className="space-y-2">
              {typedModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => module.isAccessible && setSelectedModule(module.id)}
                  disabled={!module.isAccessible}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedModule === module.id
                      ? 'border-purple-200 bg-purple-50'
                      : module.isAccessible
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {module.isAccessible ? (
                          module.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4 text-blue-500" />
                          )
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          module.isAccessible ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {module.title}
                        </span>
                      </div>
                      {!module.isAccessible && module.unlockDate && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {getCountdownText(module.unlockDate)}
                          </span>
                        </div>
                      )}
                    </div>
                    {module.requiredRole === 'mastermind' && (
                      <Crown className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{currentModule ? (
            <div className="max-w-4xl">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">{currentModule.title}</h2>
                  <Badge 
                    variant={selectedMode === 'architect' ? 'default' : 'secondary'}
                    className={`${
                      selectedMode === 'architect' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {selectedMode === 'architect' ? 'Architect Track' : 'Alchemist Track'}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-6">{currentModule.description}</p>
              </div>

              {/* Module Content */}
              <div className="grid gap-6">
                {/* Video Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Training Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Video player would load here</p>
                        <p className="text-xs text-gray-400 mt-1">
                          URL: {selectedMode === 'architect' 
                            ? currentModule.architectContent.videoUrl 
                            : currentModule.alchemistContent.videoUrl}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      {selectedMode === 'architect' 
                        ? currentModule.architectContent.summary 
                        : currentModule.alchemistContent.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const url = selectedMode === 'architect' 
                            ? currentModule.architectContent.workbookUrl 
                            : currentModule.alchemistContent.workbookUrl;
                          window.open(url, '_blank');
                        }}
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download {selectedMode === 'architect' ? 'Architect' : 'Alchemist'} Workbook
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Tracking */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={currentModule.completed}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              markCompleteMutation.mutate(currentModule.id);
                            }
                          }}
                          disabled={markCompleteMutation.isPending}
                        />
                        <span className="text-sm font-medium">
                          Mark module as complete
                        </span>
                      </div>
                      {currentModule.completed && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Module</h3>
                <p className="text-gray-500">Choose a module from the sidebar to begin learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
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