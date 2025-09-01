import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Play, FileText, CheckCircle, Brain, Lightbulb } from "lucide-react";

interface LessonViewProps {
  params: { courseId: string; lessonId: string };
}

export default function LessonView({ params }: LessonViewProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'architect' | 'alchemist' | 'shared'>('shared');
  const queryClient = useQueryClient();
  
  const { courseId, lessonId } = params;

  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['/api/lessons', lessonId],
    enabled: !!user && !!lessonId,
  });

  const { data: userDnaResult } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  const { data: progressData } = useQuery({
    queryKey: ['/api/progress', courseId, lessonId],
    enabled: !!user && !!courseId && !!lessonId,
  });

  const completeLessonMutation = useMutation({
    mutationFn: async (data: { courseId: string; lessonId: string; viewMode: string }) => {
      return apiRequest('POST', '/api/lessons/complete', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (userDnaResult?.userDnaResult?.dominantType) {
      const dominantType = userDnaResult.userDnaResult.dominantType.toLowerCase();
      if (dominantType === 'architect' || dominantType === 'alchemist') {
        setViewMode(dominantType);
      }
    }
  }, [userDnaResult]);

  if (authLoading || isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const lesson = lessonData?.lesson;
  const course = lessonData?.course;
  const dominantType = userDnaResult?.userDnaResult?.dominantType || 'Undeclared';
  const isCompleted = progressData?.completed || false;

  if (!lesson || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Lesson not found</h2>
          <Button onClick={() => setLocation(`/courses/${courseId}`)}>
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const handleCompleteLesson = () => {
    completeLessonMutation.mutate({
      courseId,
      lessonId,
      viewMode
    });
  };

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case 'architect': return <Brain className="h-4 w-4" />;
      case 'alchemist': return <Lightbulb className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getViewModeColor = (mode: string) => {
    switch (mode) {
      case 'architect': return 'bg-blue-600';
      case 'alchemist': return 'bg-red-500';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/courses/${courseId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {course.title}
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="capitalize">
                  {course.track} Track
                </Badge>
                <Badge variant={isCompleted ? 'default' : 'secondary'}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </div>
            
            {isCompleted && (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
          </div>
        </div>

        {/* DNA-Based View Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${getViewModeColor(dominantType.toLowerCase())}`}></div>
              Your {dominantType} Perspective
            </CardTitle>
            <p className="text-sm text-gray-600">
              This lesson adapts to your entrepreneurial DNA for optimal learning
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="shared" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Foundation
                </TabsTrigger>
                <TabsTrigger value="architect" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Architect View
                </TabsTrigger>
                <TabsTrigger value="alchemist" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Alchemist View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="shared" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Foundation Concepts</CardTitle>
                    <p className="text-sm text-gray-600">
                      Core principles that apply to all entrepreneurs
                    </p>
                  </CardHeader>
                  <CardContent>
                    {lesson.sharedContent ? (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: lesson.sharedContent }} />
                      </div>
                    ) : (
                      <p className="text-gray-600 italic">
                        Foundation content will be available soon
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="architect" className="mt-6">
                <Card className="border-l-4 border-l-blue-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      Architect Approach
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Systematic, strategic thinking for analytical minds
                    </p>
                  </CardHeader>
                  <CardContent>
                    {lesson.architectContent ? (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: lesson.architectContent }} />
                      </div>
                    ) : (
                      <p className="text-gray-600 italic">
                        Architect-specific content will be available soon
                      </p>
                    )}
                    
                    {lesson.architectVideoUrl && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Architect Video Guide</h4>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <Button onClick={() => window.open(lesson.architectVideoUrl, '_blank')}>
                            <Play className="h-4 w-4 mr-2" />
                            Watch Video
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alchemist" className="mt-6">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-red-500" />
                      Alchemist Approach
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Intuitive, creative transformation for visionary leaders
                    </p>
                  </CardHeader>
                  <CardContent>
                    {lesson.alchemistContent ? (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: lesson.alchemistContent }} />
                      </div>
                    ) : (
                      <p className="text-gray-600 italic">
                        Alchemist-specific content will be available soon
                      </p>
                    )}
                    
                    {lesson.alchemistVideoUrl && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Alchemist Video Guide</h4>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <Button onClick={() => window.open(lesson.alchemistVideoUrl, '_blank')}>
                            <Play className="h-4 w-4 mr-2" />
                            Watch Video
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Lesson Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold mb-2">Lesson Progress</h3>
                <p className="text-sm text-gray-600">
                  Learning with {viewMode} perspective
                </p>
              </div>
              
              <div className="flex gap-3">
                {lesson.workbookUrl && (
                  <Button 
                    variant="outline"
                    onClick={() => window.open(lesson.workbookUrl, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Workbook
                  </Button>
                )}
                
                {!isCompleted && (
                  <Button 
                    onClick={handleCompleteLesson}
                    disabled={completeLessonMutation.isPending}
                  >
                    {completeLessonMutation.isPending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}