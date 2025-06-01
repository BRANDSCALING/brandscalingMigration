import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  BookOpen, 
  Download, 
  Video, 
  CheckCircle, 
  Lock,
  User,
  Brain,
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

export default function LMS() {
  // All hooks must be called unconditionally at the top level
  const { isAuthenticated, loading, userProfile } = useFirebaseAuth();
  const [selectedMode, setSelectedMode] = useState<'architect' | 'alchemist'>('architect');
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch modules with access control - always call this hook
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/lms/modules'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Mark module as complete - always declare this mutation
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
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  // Effects - always call these unconditionally
  useEffect(() => {
    const quizResult = localStorage.getItem('quiz-result');
    if (quizResult) {
      try {
        const result = JSON.parse(quizResult);
        setSelectedMode(result.type?.toLowerCase() === 'alchemist' ? 'alchemist' : 'architect');
      } catch (e) {
        console.error('Failed to parse quiz result:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, loading]);

  // Loading state - render early return after all hooks
  if (loading || !isAuthenticated || modulesLoading) {
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
              Learning Management
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{userProfile?.firstName || userProfile?.email}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  userProfile?.role === 'mastermind' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {userProfile?.role === 'mastermind' && <Crown className="h-3 w-3 mr-1" />}
                {userProfile?.role}
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
        <div className="flex-1 p-8">
          {currentModule ? (
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
                        <p className="text-gray-500">Video player will load here</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Ready for: {selectedMode === 'architect' 
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