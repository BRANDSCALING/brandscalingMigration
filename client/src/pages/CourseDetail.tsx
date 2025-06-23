import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  CheckCircle, 
  Lock, 
  Brain, 
  Lightbulb,
  Clock,
  Users,
  Star
} from 'lucide-react';
import { useEffect } from 'react';

interface CourseDetailProps {
  params: { id: string };
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { id: courseId } = params;

  const { data: courseData, isLoading } = useQuery({
    queryKey: ['/api/courses', courseId],
    enabled: !!user && !!courseId,
  });

  const { data: userDnaResult } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/');
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  const course = courseData;
  const dominantType = userDnaResult?.userDnaResult?.dominantType || 'Undeclared';

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <Button onClick={() => setLocation('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const getDnaColor = (type: string) => {
    switch (type) {
      case 'architect': return 'bg-blue-600';
      case 'alchemist': return 'bg-red-500';
      case 'both': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getDnaIcon = (type: string) => {
    switch (type) {
      case 'architect': return <Brain className="h-5 w-5" />;
      case 'alchemist': return <Lightbulb className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/courses')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${getDnaColor(course.track)}`}></div>
                <Badge variant="outline" className="capitalize">
                  {course.track} Track
                </Badge>
                <Badge variant="secondary">
                  Level {course.level}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.lessons?.length || 0} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="capitalize">{course.accessTier} Tier</span>
                </div>
                <div className="flex items-center gap-2">
                  {getDnaIcon(course.track)}
                  <span className="capitalize">{course.track} DNA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Overall Progress</p>
                <div className="flex items-center gap-3">
                  <Progress value={course.progress || 0} className="flex-1" />
                  <span className="text-sm font-medium">{course.progress || 0}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Lessons Completed</p>
                <p className="text-2xl font-bold">
                  {course.completedLessons || 0} / {course.totalLessons || 0}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Your DNA Match</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDnaColor(dominantType.toLowerCase())}`}></div>
                  <span className="font-medium">
                    {dominantType === course.track ? 'Perfect Match' : 'Cross-Training'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DNA Personalization Info */}
        {dominantType !== 'Undeclared' && (
          <Card className="mb-8 border-l-4" style={{ borderLeftColor: getDnaColor(dominantType.toLowerCase()).replace('bg-', '#') }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getDnaIcon(dominantType.toLowerCase())}
                Your {dominantType} Learning Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">
                {dominantType === 'Architect' 
                  ? "This course includes systematic frameworks, analytical tools, and structured approaches that align with your strategic thinking style."
                  : "This course features intuitive insights, creative approaches, and transformational concepts that resonate with your visionary nature."
                }
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Content automatically adapts to your DNA type during lessons</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
            <p className="text-sm text-gray-600">
              Each lesson includes content tailored to your entrepreneurial DNA
            </p>
          </CardHeader>
          <CardContent>
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-4">
                {course.lessons.map((lesson: any, index: number) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {lesson.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            <span>Architect view</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            <span>Alchemist view</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>Foundation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {lesson.workbookUrl && (
                        <Badge variant="outline" className="text-xs">
                          Workbook
                        </Badge>
                      )}
                      
                      <Button 
                        onClick={() => setLocation(`/courses/${courseId}/lessons/${lesson.id}`)}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start Lesson
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No lessons available</h3>
                <p className="text-gray-600">
                  Lessons for this course are being prepared
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}