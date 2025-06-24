import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Play, 
  Check, 
  BookOpen, 
  Download, 
  Clock,
  Users,
  Star,
  ChevronRight,
  FileText
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  videoUrl?: string;
  workbookUrl?: string;
  requiredTier: string;
  order: number;
  courseId: number;
  completed?: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  track: string;
  level: number;
  imageUrl?: string;
  accessTier: string;
  lessons: Lesson[];
  progress: number;
  completedLessons: number;
  totalLessons: number;
  userDnaType: string;
}

export function StudentCourseView() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/student/course/:id");
  const courseId = params?.id ? parseInt(params.id) : null;
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock course data
  const courseData: Course = {
    id: 1,
    title: "Architect Foundation Course",
    description: "Master systematic business building strategies designed for analytical minds",
    track: "architect",
    level: 1,
    accessTier: "beginner",
    progress: 25,
    completedLessons: 2,
    totalLessons: 8,
    userDnaType: "Architect",
    lessons: [
      {
        id: 1,
        title: "Introduction to Architect Mindset",
        videoUrl: "/videos/lesson1.mp4",
        workbookUrl: "/workbooks/lesson1.pdf",
        requiredTier: "beginner",
        order: 1,
        courseId: 1,
        completed: true
      },
      {
        id: 2,
        title: "Building Systematic Frameworks",
        videoUrl: "/videos/lesson2.mp4",
        workbookUrl: "/workbooks/lesson2.pdf",
        requiredTier: "beginner",
        order: 2,
        courseId: 1,
        completed: true
      },
      {
        id: 3,
        title: "Data-Driven Decision Making",
        videoUrl: "/videos/lesson3.mp4",
        workbookUrl: "/workbooks/lesson3.pdf",
        requiredTier: "beginner",
        order: 3,
        courseId: 1,
        completed: false
      },
      {
        id: 4,
        title: "Strategic Planning Methods",
        videoUrl: "/videos/lesson4.mp4",
        workbookUrl: "/workbooks/lesson4.pdf",
        requiredTier: "beginner",
        order: 4,
        courseId: 1,
        completed: false
      }
    ]
  };

  // Auto-select first uncompleted lesson
  useEffect(() => {
    if (courseData?.lessons && !selectedLesson) {
      const firstLesson = courseData.lessons.find((lesson: Lesson) => 
        !lesson.completed
      ) || courseData.lessons[0];
      setSelectedLesson(firstLesson);
    }
  }, [courseData, selectedLesson]);

  if (!match || !courseId) {
    navigate("/student/courses");
    return null;
  }

  if (!courseData) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Button onClick={() => navigate("/student/courses")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>
    );
  }

  const course: Course = courseData;
  const dnaPersonalization = {
    architect: {
      icon: "🏗️",
      style: "Systematic & Strategic",
      approach: "Step-by-step methodical learning"
    },
    alchemist: {
      icon: "⚗️", 
      style: "Creative & Intuitive",
      approach: "Experimental and adaptive learning"
    }
  };

  const userPersonalization = dnaPersonalization[course.track as keyof typeof dnaPersonalization];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "mastermind": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getTrackColor = (track: string) => {
    switch (track) {
      case "architect": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "alchemist": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student/courses")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <Badge className={getTrackColor(course.track)}>
                {userPersonalization.icon} {course.track}
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
                <span>{userPersonalization.style}</span>
              </div>
            </div>
          </div>
          
          {course.imageUrl && (
            <div className="w-full lg:w-64 h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Progress */}
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

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                  <CardDescription>
                    Personalized for {course.track} entrepreneurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Learning Approach</h4>
                      <p className="text-sm text-muted-foreground">
                        {userPersonalization.approach}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Course Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">What You'll Learn</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Strategic frameworks tailored to your entrepreneurial DNA</li>
                        <li>• Practical implementation guides and worksheets</li>
                        <li>• Real-world case studies and examples</li>
                        <li>• Actionable takeaways for immediate application</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Course Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Lessons</span>
                    <span className="font-semibold">{course.totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold">{course.completedLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Track</span>
                    <Badge className={getTrackColor(course.track)}>
                      {course.track}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Level</span>
                    <Badge className={getTierColor(course.accessTier)}>
                      {course.accessTier}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="mt-6">
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
                  <ScrollArea className="h-96">
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
                              {lesson.workbookUrl && <FileText className="w-3 h-3" />}
                              <Badge variant="outline" className="text-xs">
                                {lesson.requiredTier}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
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
                                <FileText className="w-5 h-5 text-primary" />
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
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>
                Additional materials and downloads for this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.lessons.filter(lesson => lesson.workbookUrl).map((lesson: Lesson) => (
                  <Card key={lesson.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">Lesson materials</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}