import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CourseCard from "@/components/ui/course-card";
import {
  DraftingCompass,
  Wand2,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function Courses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  const { data: architectCourses } = useQuery({
    queryKey: ["/api/courses?track=architect"],
  });

  const { data: alchemistCourses } = useQuery({
    queryKey: ["/api/courses?track=alchemist"],
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { courseId: number; progress: number; currentModule?: number }) => {
      await apiRequest("POST", "/api/user/progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      toast({
        title: "Progress Updated",
        description: "Your course progress has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCourseProgress = (courseId: number) => {
    return userProgress?.find((p: any) => p.courseId === courseId);
  };

  const handleContinueCourse = (courseId: number) => {
    // Mock progress update - in real app would navigate to course content
    const currentProgress = getCourseProgress(courseId);
    const newProgress = Math.min((currentProgress?.progress || 0) + 0.1, 1);
    
    updateProgressMutation.mutate({
      courseId,
      progress: newProgress,
      currentModule: currentProgress?.currentModule || 1,
    });
  };

  const renderCourseList = (courseList: any[], trackName: string) => {
    if (!courseList || courseList.length === 0) {
      return (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No {trackName} courses available</h3>
          <p className="text-slate-600">Check back soon for new course content.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.map((course: any) => {
          const progress = getCourseProgress(course.id);
          const isCompleted = progress?.progress >= 1;
          const isInProgress = progress && progress.progress > 0 && progress.progress < 1;
          const isLocked = !progress && course.level > 1;

          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=400&h=200&fit=crop"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {isCompleted && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Locked</p>
                    </div>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    Level {course.level}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {progress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium">{Math.round((progress.progress || 0) * 100)}%</span>
                    </div>
                    <Progress value={(progress.progress || 0) * 100} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>2h 30m</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>1.2k enrolled</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>4.8</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  variant={isCompleted ? "outline" : "default"}
                  disabled={isLocked || updateProgressMutation.isPending}
                  onClick={() => handleContinueCourse(course.id)}
                >
                  {isLocked && <Clock className="w-4 h-4 mr-2" />}
                  {isCompleted && <CheckCircle2 className="w-4 h-4 mr-2" />}
                  {isInProgress && <Play className="w-4 h-4 mr-2" />}
                  {!progress && !isLocked && <Play className="w-4 h-4 mr-2" />}
                  
                  {isLocked ? "Locked" : 
                   isCompleted ? "Review" :
                   isInProgress ? "Continue" : "Start Course"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Paths</h1>
        <p className="text-slate-600">
          Master brandscaling through our comprehensive Architect and Alchemist tracks
        </p>
      </div>

      {/* Track Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-primary bg-gradient-to-br from-blue-50 to-primary/10">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <DraftingCompass className="text-white w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-primary">Architect Track</CardTitle>
                <p className="text-sm text-slate-600">Strategic Foundation & Planning</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Build the strategic foundation of your brand with systematic planning, 
              market analysis, and positioning frameworks.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                <span className="font-medium">{architectCourses?.length || 0}</span> courses available
              </div>
              <Badge className="bg-primary">Recommended Start</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Wand2 className="text-white w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-900">Alchemist Track</CardTitle>
                <p className="text-sm text-slate-600">Creative Execution & Growth</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Transform strategy into compelling brand experiences through creative 
              execution, content creation, and growth tactics.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                <span className="font-medium">{alchemistCourses?.length || 0}</span> courses available
              </div>
              <Badge variant="secondary">After Architect</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="architect">Architect Track</TabsTrigger>
          <TabsTrigger value="alchemist">Alchemist Track</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {renderCourseList(courses || [], "All")}
        </TabsContent>

        <TabsContent value="architect" className="space-y-8">
          {renderCourseList(architectCourses || [], "Architect")}
        </TabsContent>

        <TabsContent value="alchemist" className="space-y-8">
          {renderCourseList(alchemistCourses || [], "Alchemist")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
