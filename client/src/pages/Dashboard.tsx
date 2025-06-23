import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface DashboardData {
  userDnaResult: {
    architect: number;
    alchemist: number;
    dominantType: string;
  };
  recommendedCourses: any[];
  recentProgress: any[];
  nextLessons: any[];
  communityActivity: any[];
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: dashboardData, isLoading } = useQuery({
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
          <p className="text-lg">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  const dnaResult = dashboardData?.userDnaResult;
  const dominantType = dnaResult?.dominantType || 'Undeclared';
  const architectPercentage = dnaResult?.architect || 0;
  const alchemistPercentage = dnaResult?.alchemist || 0;
  const coursesWithProgress = dashboardData?.coursesWithProgress || [];
  const recommendedCourses = dashboardData?.recommendedCourses || [];
  const inProgressCourses = dashboardData?.inProgressCourses || [];

  const getDnaColor = (type: string) => {
    switch (type) {
      case 'Architect': return 'bg-blue-600';
      case 'Alchemist': return 'bg-red-500';
      case 'Blurred Identity': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getDnaDescription = (type: string) => {
    switch (type) {
      case 'Architect': return 'You excel at systematic thinking and strategic planning';
      case 'Alchemist': return 'You thrive on intuitive wisdom and creative transformation';
      case 'Blurred Identity': return 'You balance multiple entrepreneurial approaches';
      default: return 'Complete your DNA assessment to unlock personalized content';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || user.email}
          </h1>
          <p className="text-gray-600">Your personalized learning journey continues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* DNA Profile Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getDnaColor(dominantType)}`}></div>
                Your DNA Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Architect</span>
                    <span className="text-sm text-gray-600">{architectPercentage}%</span>
                  </div>
                  <Progress value={architectPercentage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Alchemist</span>
                    <span className="text-sm text-gray-600">{alchemistPercentage}%</span>
                  </div>
                  <Progress value={alchemistPercentage} className="h-2" />
                </div>

                <div className="pt-2 border-t">
                  <Badge className={getDnaColor(dominantType)} variant="default">
                    {dominantType}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    {getDnaDescription(dominantType)}
                  </p>
                </div>

                {dominantType === 'Undeclared' && (
                  <Button 
                    onClick={() => setLocation('/entrepreneurial-dna-quiz')}
                    className="w-full mt-4"
                  >
                    Take DNA Assessment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Courses Completed</span>
                    <span className="text-sm text-gray-600">
                      {dashboardData?.recentProgress?.filter((p: any) => p.completed)?.length || 0}
                    </span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Current Tier</span>
                    <Badge variant="outline">Beginner</Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation('/courses')}
                  variant="outline" 
                  className="w-full"
                >
                  View All Courses
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => setLocation('/courses')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Continue Learning
                </Button>
                
                <Button 
                  onClick={() => setLocation('/community')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Join Community
                </Button>
                
                <Button 
                  onClick={() => setLocation('/entrepreneurial-dna-quiz')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Retake DNA Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Courses Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Recommended for {dominantType === 'Undeclared' ? 'You' : `${dominantType}s`}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {dominantType !== 'Undeclared' 
                ? `Courses tailored to your ${dominantType} strengths and learning style`
                : 'Complete your DNA assessment to see personalized recommendations'
              }
            </p>
          </CardHeader>
          <CardContent>
            {dominantType === 'Undeclared' ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Unlock personalized course recommendations by completing your DNA assessment
                </p>
                <Button onClick={() => setLocation('/entrepreneurial-dna-quiz')}>
                  Take Assessment Now
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Sample Course {i}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Course description tailored for {dominantType} entrepreneurs
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">Beginner</Badge>
                        <Button size="sm" onClick={() => setLocation('/courses')}>
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lesson {i} completed</p>
                      <p className="text-xs text-gray-600">2 days ago</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setLocation('/courses')}
                >
                  View All Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Discussion Topic {i}</p>
                    <p className="text-xs text-gray-600">
                      Join the conversation with fellow {dominantType}s
                    </p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setLocation('/community')}
                >
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}