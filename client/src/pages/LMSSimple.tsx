import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Crown, User, Play, CheckCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

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

export default function LMSSimple() {
  const [selectedMode, setSelectedMode] = useState<'architect' | 'alchemist'>('architect');
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('guest');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication status
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Fetch modules
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/lms/modules'],
    enabled: !!user,
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  // Set user role and personality type
  useEffect(() => {
    if (user && typeof user === 'object' && 'role' in user) {
      setUserRole((user as any).role || 'guest');
    }
    
    import('@/lib/storage').then(({ safeStorage }) => {
      const quizResult = safeStorage.getItem('quiz-result');
      if (quizResult) {
        try {
          const result = JSON.parse(quizResult);
          setSelectedMode(result.type?.toLowerCase() === 'alchemist' ? 'alchemist' : 'architect');
        } catch (e) {
          console.warn("Failed to parse quiz result", e);
        }
      }
    });
  }, [user]);

  // Redirect if not authenticated after loading completes
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, userLoading]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the LMS dashboard.</p>
          <button 
            onClick={() => {
              try {
                window.location.href = "/login";
              } catch (error) {
                console.warn('Navigation failed:', error);
                window.location.assign('/login');
              }
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const typedModules = modules as Module[];
  const completedModules = typedModules.filter(m => m.completed).length;
  const progressPercentage = typedModules.length > 0 ? (completedModules / typedModules.length) * 100 : 0;

  const selectedModuleData = selectedModule ? typedModules.find(m => m.id === selectedModule) : null;
  const content = selectedModuleData?.[`${selectedMode}Content`];

  const getUnlockDate = (module: Module) => {
    if (userRole === 'mastermind') return null;
    if (module.order === 1) return null;
    
    const baseDate = new Date('2024-01-01');
    const unlockDate = new Date(baseDate);
    unlockDate.setDate(baseDate.getDate() + (module.order - 1) * 30);
    return unlockDate;
  };

  const isModuleAccessible = (module: Module) => {
    if (userRole === 'mastermind') return true;
    if (module.order === 1) return true;
    
    const unlockDate = getUnlockDate(module);
    return unlockDate ? new Date() >= unlockDate : false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  LMS Dashboard
                </h1>
                <div className="mt-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{(user as any)?.firstName || (user as any)?.email || 'User'}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      userRole === 'mastermind' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {userRole === 'mastermind' && <Crown className="h-3 w-3 mr-1" />}
                    {userRole}
                  </Badge>
                </div>
                
                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{completedModules}/{typedModules.length}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Mode Toggle */}
                <div className="p-4 border-b border-gray-100">
                  <Tabs value={selectedMode} onValueChange={(value) => setSelectedMode(value as 'architect' | 'alchemist')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="architect" className="text-xs">
                        Architect
                      </TabsTrigger>
                      <TabsTrigger value="alchemist" className="text-xs">
                        Alchemist
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Module List */}
                <div className="max-h-96 overflow-y-auto">
                  {modulesLoading ? (
                    <div className="p-4">
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-16 bg-gray-200 rounded" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    typedModules.map((module) => {
                      const isAccessible = isModuleAccessible(module);
                      const unlockDate = getUnlockDate(module);
                      
                      return (
                        <div
                          key={module.id}
                          onClick={() => isAccessible && setSelectedModule(module.id)}
                          className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                            selectedModule === module.id
                              ? 'bg-gradient-to-r from-purple-50 to-orange-50 border-l-4 border-l-purple-500'
                              : isAccessible
                              ? 'hover:bg-gray-50'
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">
                                  Module {module.order}
                                </span>
                                {module.completed && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {!isAccessible && (
                                  <Lock className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <h3 className="text-sm font-semibold text-gray-800 mt-1">
                                {module.title}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {module.description}
                              </p>
                              
                              {!isAccessible && unlockDate && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Clock className="h-3 w-3 text-orange-500" />
                                  <span className="text-xs text-orange-600">
                                    Unlocks {unlockDate.toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedModuleData ? (
              <Card className="h-full">
                <CardHeader className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Module {selectedModuleData.order}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={selectedMode === 'architect' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}
                        >
                          {selectedMode === 'architect' ? 'Architect' : 'Alchemist'} Track
                        </Badge>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {selectedModuleData.title}
                      </h1>
                      <p className="text-gray-600 mt-2">
                        {selectedModuleData.description}
                      </p>
                    </div>
                    
                    {!selectedModuleData.completed && (
                      <Button
                        onClick={() => markCompleteMutation.mutate(selectedModuleData.id)}
                        disabled={markCompleteMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                      >
                        {markCompleteMutation.isPending ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {content ? (
                    <div className="space-y-6">
                      {/* Video Section */}
                      {content.videoUrl && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Training Video
                          </h3>
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Video player would be embedded here</p>
                            <p className="text-xs text-gray-400 ml-2">({content.videoUrl})</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Workbook Section */}
                      {content.workbookUrl && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Workbook & Resources</h3>
                          <Button variant="outline" className="w-full">
                            Download Workbook
                          </Button>
                        </div>
                      )}
                      
                      {/* Summary Section */}
                      {content.summary && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Module Summary</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                              {content.summary}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Content for this track is being prepared.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-100 to-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Welcome to Your Learning Journey
                    </h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Select a module from the sidebar to begin your {selectedMode} track learning experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}