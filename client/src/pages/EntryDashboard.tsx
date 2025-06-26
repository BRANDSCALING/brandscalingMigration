import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { BookOpen, Clock, CheckCircle, Lock, Trophy, LogOut } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Course {
  id: number;
  title: string;
  description: string;
  track: string;
  level: number;
  accessTier: string;
  isPublished: boolean;
  lessons?: Lesson[];
}

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  architectContent?: string;
  alchemistContent?: string;
  sharedContent?: string;
  requiredTier: string;
  order: number;
  isPublished: boolean;
}

export default function EntryDashboard() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [, setLocation] = useLocation();

  // Fetch Entry tier courses with lessons
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses/with-lessons'],
    queryFn: () => apiRequest('GET', '/api/courses/with-lessons'),
    select: (data: Course[]) => data.filter(course => 
      course.accessTier === 'beginner' && course.isPublished
    ),
  });

  const entryTierCourses = [
    "Idea-to-Launch Kit™",
    "Smart Business Builder™", 
    "AI Mentor Access",
    "30-Day Launch Plan"
  ];

  const filteredCourses = courses.filter(course => 
    entryTierCourses.includes(course.title)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading your Entry tier courses...</div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCourse(null)}
            className="mb-6"
          >
            ← Back to Courses
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                {selectedCourse.title}
              </CardTitle>
              <p className="text-gray-600">{selectedCourse.description}</p>
              <Badge variant="secondary" className="w-fit">
                Entry Tier - Read Only
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCourse.lessons?.map((lesson, index) => (
                  <Card key={lesson.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{lesson.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Module {index + 1}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Preview
                        </Badge>
                      </div>
                      
                      {/* Show lesson content preview */}
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <h4 className="font-medium text-sm mb-2 text-gray-700">Lesson Content Preview:</h4>
                        <div className="text-sm text-gray-600 space-y-2">
                          {lesson.sharedContent && (
                            <p className="leading-relaxed">{lesson.sharedContent}</p>
                          )}
                          {lesson.architectContent && (
                            <div className="mt-3">
                              <span className="font-medium text-blue-600">For Architects:</span>
                              <p className="text-gray-600 mt-1">{lesson.architectContent}</p>
                            </div>
                          )}
                          {lesson.alchemistContent && (
                            <div className="mt-3">
                              <span className="font-medium text-amber-600">For Alchemists:</span>
                              <p className="text-gray-600 mt-1">{lesson.alchemistContent}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!selectedCourse.lessons || selectedCourse.lessons.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    Course content is being prepared. Check back soon!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Your Entry Dashboard
            </h1>
            <p className="text-gray-600">
              Access your Entry tier courses. These courses are read-only and designed to give you foundational knowledge.
            </p>
          </div>
          
          {/* Sign Out Button */}
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('studentId');
              localStorage.removeItem('studentEmail');
              localStorage.clear();
              // Dispatch custom event to notify Header component
              window.dispatchEvent(new Event('auth-logout'));
              setLocation('/');
            }}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* User Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  {user?.firstName || 'Student'}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Entry Tier</Badge>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">Read-Only Access</span>
                </div>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {course.track === 'architect' ? 'Architect Track' : 'Alchemist Track'}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span>Read Only</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Access Level</span>
                    <span className="text-green-600 font-medium">Entry Tier</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Entry Courses Available</h3>
              <p className="text-gray-600">
                Entry tier courses are being prepared. Please check back soon!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Ready for More?
                </h3>
                <p className="text-blue-700 mb-4">
                  Upgrade to Expert or Elite tier to unlock interactive content, assessments, and personalized coaching.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Explore Upgrade Options
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}