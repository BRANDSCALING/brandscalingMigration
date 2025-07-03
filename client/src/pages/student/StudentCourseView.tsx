import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Check, BookOpen, Download, Clock, Users } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  videoUrl?: string;
  workbookUrl?: string;
  order: number;
  completed?: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  track: string;
  level: number;
  accessTier: string;
  lessons: Lesson[];
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function StudentCourseView() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const [match, params] = useRoute("/student/course/:id");
  const [infiniteScalingMatch] = useRoute("/courses/infinite-scaling/:layer");
  const [fuseMatch] = useRoute("/courses/fuse-framework");
  const [ideaLaunchMatch, ideaParams] = useRoute("/courses/idea-to-launch/:moduleId");
  const [smartBuilderMatch, smartParams] = useRoute("/courses/smart-business-builder/:moduleId");
  const [launchPlanMatch] = useRoute("/courses/30-day-launch-plan");
  
  const courseId = params?.id ? parseInt(params.id) : null;
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Determine course type and generate appropriate data
  const getCourseData = (): Course => {
    if (infiniteScalingMatch) {
      return {
        id: 1,
        title: "The Infinite Scaling Methodology™ - Profit Maximisation",
        description: "Unlock cashflow, refine your offer, and optimize for scalable returns",
        track: "architect",
        level: 1,
        accessTier: "beginner",
        progress: 0,
        completedLessons: 0,
        totalLessons: 6,
        lessons: [
          {
            id: 1,
            title: "F.U.S.E. Framework™ (Embedded Offer Design)",
            order: 1,
            completed: false
          },
          {
            id: 2,
            title: "Profit Maximization Blueprint (Customer Creation Factory™)",
            order: 2,
            completed: false
          },
          {
            id: 3,
            title: "Doctor-Patient Sales Model (Prescription & Pill)",
            order: 3,
            completed: false
          },
          {
            id: 4,
            title: "Social Media Systems",
            order: 4,
            completed: false
          },
          {
            id: 5,
            title: "Marketing Systems",
            order: 5,
            completed: false
          },
          {
            id: 6,
            title: "Sales Psychology",
            order: 6,
            completed: false
          }
        ]
      };
    }
    
    if (fuseMatch) {
      return {
        id: 2,
        title: "FUSE FRAMEWORK™",
        description: "Complete system for finding problems worth solving and uniting with your solutions",
        track: "alchemist",
        level: 1,
        accessTier: "beginner",
        progress: 0,
        completedLessons: 0,
        totalLessons: 4,
        lessons: [
          {
            id: 1,
            title: "F - Find the Spark",
            order: 1,
            completed: false
          },
          {
            id: 2,
            title: "U - Uncover the Need",
            order: 2,
            completed: false
          },
          {
            id: 3,
            title: "S - Shape the Solution",
            order: 3,
            completed: false
          },
          {
            id: 4,
            title: "E - Execute and Evolve",
            order: 4,
            completed: false
          }
        ]
      };
    }
    
    if (ideaLaunchMatch && ideaParams?.moduleId) {
      const moduleNames: { [key: string]: string } = {
        'module-1': 'Overview + Module 1: The Entrepreneurial DNA Quiz',
        'module-2': 'Module 2: Market Validation Workbook',
        'module-3': 'Module 3: Business Model Design',
        'module-4': 'Module 4: Financial Planning & Analysis',
        'module-5': 'Module 5: Marketing & Customer Acquisition',
        'module-6': 'Module 6: Operations & Systems',
        'module-7': 'Module 7: Launch Strategy & Execution'
      };
      
      return {
        id: 3,
        title: `Idea-to-Launch Kit™ - ${moduleNames[ideaParams.moduleId] || 'Module'}`,
        description: "Complete startup execution system designed for UK entrepreneurs",
        track: "both",
        level: 1,
        accessTier: "beginner",
        progress: 0,
        completedLessons: 0,
        totalLessons: 1,
        lessons: [
          {
            id: 1,
            title: moduleNames[ideaParams.moduleId] || 'Module Content',
            order: 1,
            completed: false
          }
        ]
      };
    }
    
    if (smartBuilderMatch && smartParams?.moduleId) {
      const moduleNames: { [key: string]: string } = {
        'module-2': 'Module 2: Name & Brand Identity Fast Track',
        'module-3': 'Module 3: Structure & Setup Layer',
        'module-4': 'Module 4: Financial Foundations',
        'module-5': 'Module 5: Your Digital Presence',
        'module-6': 'Module 6: Brand Presence Boot-Up',
        'module-7': 'Module 7: Execution Planner & AI Toolkit'
      };
      
      return {
        id: 4,
        title: `Smart Business Builder™ - ${moduleNames[smartParams.moduleId] || 'Module'}`,
        description: "AI-personalized Lean Canvas alternative based on E-DNA",
        track: "both",
        level: 1,
        accessTier: "beginner",
        progress: 0,
        completedLessons: 0,
        totalLessons: 1,
        lessons: [
          {
            id: 1,
            title: moduleNames[smartParams.moduleId] || 'Module Content',
            order: 1,
            completed: false
          }
        ]
      };
    }
    
    if (launchPlanMatch) {
      return {
        id: 5,
        title: "30 Day Launch Plan",
        description: "Complete 30-day execution plan with daily actions and milestones",
        track: "both",
        level: 1,
        accessTier: "beginner",
        progress: 0,
        completedLessons: 0,
        totalLessons: 30,
        lessons: Array.from({ length: 30 }, (_, i) => ({
          id: i + 1,
          title: `Day ${i + 1}: Daily Action Plan`,
          order: i + 1,
          completed: false
        }))
      };
    }
    
    // Default course data for /student/course/:id routes
    return {
      id: courseId || 1,
      title: "Course Content",
      description: "Course content and materials",
      track: "both",
      level: 1,
      accessTier: "beginner",
      progress: 0,
      completedLessons: 0,
      totalLessons: 1,
      lessons: [
        {
          id: 1,
          title: "Course Introduction",
          order: 1,
          completed: false
        }
      ]
    };
  };

  const courseData = getCourseData();

  useEffect(() => {
    if (courseData?.lessons && !selectedLesson) {
      const firstLesson = courseData.lessons.find((lesson: Lesson) => 
        !lesson.completed
      ) || courseData.lessons[0];
      setSelectedLesson(firstLesson);
    }
  }, [courseData, selectedLesson]);

  // Check if this is a valid course route
  const isValidRoute = match || infiniteScalingMatch || fuseMatch || ideaLaunchMatch || smartBuilderMatch || launchPlanMatch;
  
  if (!isValidRoute) {
    navigate("/student");
    return null;
  }

  const course: Course = courseData;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "mastermind": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrackColor = (track: string) => {
    switch (track) {
      case "architect": return "bg-blue-100 text-blue-800";
      case "alchemist": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <Badge className={getTrackColor(course.track)}>
                🏗️ {course.track}
              </Badge>
              <Badge className={getTierColor(course.accessTier)}>
                {course.accessTier}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Level {course.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Systematic & Strategic</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Course Progress</span>
            <span>{course.progress}% Complete</span>
          </div>
          <Progress value={course.progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {course.completedLessons} of {course.totalLessons} lessons completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Course Lessons</CardTitle>
              <CardDescription>
                {course.completedLessons} of {course.totalLessons} completed
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                {course.lessons.map((lesson: Lesson, index: number) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedLesson?.id === lesson.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-muted border rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        {lesson.videoUrl && <Play className="w-3 h-3" />}
                        {lesson.workbookUrl && <Download className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-2">
          {selectedLesson ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedLesson.title}</CardTitle>
                    <CardDescription>
                      Lesson {selectedLesson.order} of {course.totalLessons}
                    </CardDescription>
                  </div>
                  {selectedLesson.completed && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Video Player */}
                  {selectedLesson.videoUrl && (
                    <div>
                      <h4 className="font-semibold mb-3">Video Content</h4>
                      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-75" />
                          <p className="text-sm opacity-75">Video Player</p>
                          <p className="text-xs opacity-50 mt-1">{selectedLesson.videoUrl}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Workbook Download */}
                  {selectedLesson.workbookUrl && (
                    <div>
                      <h4 className="font-semibold mb-3">Course Materials</h4>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Lesson Workbook</p>
                            <p className="text-sm text-muted-foreground">
                              Download materials for this lesson
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Lesson Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    {!selectedLesson.completed ? (
                      <Button>
                        <Check className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        <Check className="w-4 h-4 mr-2" />
                        Completed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Lesson</h3>
                  <p className="text-muted-foreground">
                    Choose a lesson from the list to start learning
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}