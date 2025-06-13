import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Star, Lock } from "lucide-react";

export default function Courses() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'architect' | 'alchemist'>('all');

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: !!user,
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
          <p className="text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  const courses = coursesData?.courses || [];
  const userAccessTier = coursesData?.userTier || 'beginner';
  const dominantType = userDnaResult?.userDnaResult?.dominantType || 'Undeclared';

  const filteredCourses = courses.filter(course => {
    if (selectedTrack === 'all') return true;
    return course.track === selectedTrack || course.track === 'both';
  });

  const getDnaColor = (type: string) => {
    switch (type) {
      case 'architect': return 'bg-blue-600';
      case 'alchemist': return 'bg-red-500';
      case 'both': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getAccessBadgeVariant = (hasAccess: boolean) => {
    return hasAccess ? 'default' : 'secondary';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Brandscaling Courses
          </h1>
          <p className="text-gray-600">
            Dual-track learning system designed for your {dominantType} DNA
          </p>
        </div>

        {/* DNA Profile Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${getDnaColor(dominantType.toLowerCase())}`}></div>
              Your Learning Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">DNA Type</p>
                <p className="text-lg font-semibold">{dominantType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Access Tier</p>
                <Badge variant="outline" className="capitalize">{userAccessTier}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recommended Track</p>
                <p className="text-lg font-semibold capitalize">
                  {dominantType === 'Undeclared' ? 'Complete DNA Assessment' : dominantType}
                </p>
              </div>
            </div>
            
            {dominantType === 'Undeclared' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm mb-2">
                  Complete your DNA assessment to unlock personalized course recommendations
                </p>
                <Button 
                  size="sm" 
                  onClick={() => setLocation('/entrepreneurial-dna-quiz')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Take Assessment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Filters */}
        <Tabs value={selectedTrack} onValueChange={(value) => setSelectedTrack(value as any)} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="architect">Architect Track</TabsTrigger>
            <TabsTrigger value="alchemist">Alchemist Track</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <p className="text-gray-600 mb-6">
              Browse all available courses across both DNA tracks
            </p>
          </TabsContent>

          <TabsContent value="architect">
            <p className="text-gray-600 mb-6">
              Systematic, strategic courses designed for analytical minds
            </p>
          </TabsContent>

          <TabsContent value="alchemist">
            <p className="text-gray-600 mb-6">
              Intuitive, creative courses designed for transformational leaders
            </p>
          </TabsContent>
        </Tabs>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses available</h3>
              <p className="text-gray-600">
                Courses for this track are coming soon
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className={`border-l-4 ${getDnaColor(course.track)}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={getAccessBadgeVariant(course.hasAccess)}
                      className="capitalize"
                    >
                      {course.requiredTier}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${course.track === 'both' ? 'bg-purple-50' : ''}`}
                    >
                      {course.track}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Level {course.level}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4" />
                      <span>
                        {dominantType.toLowerCase() === course.track ? 'Recommended for you' : 'Cross-training'}
                      </span>
                    </div>
                  </div>

                  {course.hasAccess ? (
                    <Button 
                      className="w-full"
                      onClick={() => setLocation(`/courses/${course.id}`)}
                    >
                      Start Course
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Requires {course.requiredTier} Access
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="w-full"
                        onClick={() => setLocation('/upgrade')}
                      >
                        Upgrade Access
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Learning Progress Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Courses Completed</p>
                <p className="text-2xl font-bold">0</p>
                <Progress value={0} className="mt-2" />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Current Focus</p>
                <p className="text-lg font-semibold capitalize">{dominantType} Track</p>
                <p className="text-sm text-gray-600">Master your natural strengths</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Next Milestone</p>
                <p className="text-lg font-semibold">First Course Completion</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setLocation('/dashboard')}
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}