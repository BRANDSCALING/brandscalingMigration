import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, BookOpen, Play, Lock, Star, Search, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Course {
  id: number;
  title: string;
  description: string;
  track: string;
  level: number;
  imageUrl?: string;
  accessTier: string;
  isPublished: boolean;
  hasAccess: boolean;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  createdAt: string;
}

export function StudentCourses() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrack, setFilterTrack] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch user DNA type
  const { data: userDna } = useQuery({
    queryKey: ["/api/dna/latest"],
    queryFn: async () => {
      return fetch("/api/dna/latest", {
        headers: {
          "x-student-id": localStorage.getItem('studentId') || '',
          "x-student-email": localStorage.getItem('studentEmail') || ''
        },
        credentials: "include"
      }).then(res => res.ok ? res.json() : null);
    },
    retry: false,
  });

  // Fetch courses with access information
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/student/courses"],
    queryFn: async () => {
      return fetch("/api/student/courses", {
        headers: {
          "x-student-id": localStorage.getItem('studentId') || '',
          "x-student-email": localStorage.getItem('studentEmail') || ''
        },
        credentials: "include"
      }).then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
      });
    },
    retry: false,
  });

  const userDnaType = userDna?.defaultType || 'Undeclared';
  const preferredTrack = userDnaType === 'Architect' ? 'architect' : 'alchemist';

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrack = filterTrack === "all" || course.track === filterTrack;
    const matchesTier = filterTier === "all" || course.accessTier === filterTier;
    
    if (activeTab === "available") return matchesSearch && matchesTrack && matchesTier && course.hasAccess;
    if (activeTab === "locked") return matchesSearch && matchesTrack && matchesTier && !course.hasAccess;
    if (activeTab === "in-progress") return matchesSearch && matchesTrack && matchesTier && course.hasAccess && course.progress > 0 && course.progress < 100;
    if (activeTab === "completed") return matchesSearch && matchesTrack && matchesTier && course.hasAccess && course.progress === 100;
    
    return matchesSearch && matchesTrack && matchesTier;
  });

  // Sort courses to prioritize user's DNA track
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (a.track === preferredTrack && b.track !== preferredTrack) return -1;
    if (b.track === preferredTrack && a.track !== preferredTrack) return 1;
    return 0;
  });

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

  const handleCourseClick = (course: Course) => {
    if (course.hasAccess) {
      navigate(`/student/course/${course.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with DNA personalization */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Your Learning Journey</h1>
            {userDnaType !== 'Undeclared' && (
              <p className="text-muted-foreground mt-2">
                Personalized for {userDnaType} entrepreneurs
                {userDnaType === 'Architect' && " - Strategic, analytical, and systematic approaches"}
                {userDnaType === 'Alchemist' && " - Creative, intuitive, and innovative methods"}
              </p>
            )}
          </div>
          {userDnaType === 'Undeclared' && (
            <Button onClick={() => navigate('/quiz')} variant="outline">
              Take DNA Quiz
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterTrack} onValueChange={setFilterTrack}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tracks</SelectItem>
              <SelectItem value="architect">Architect</SelectItem>
              <SelectItem value="alchemist">Alchemist</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Access Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="mastermind">Mastermind</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {sortedCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {activeTab === "all" ? "No courses available yet." : `No ${activeTab} courses found.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course: Course) => (
                <Card 
                  key={course.id} 
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    !course.hasAccess ? 'opacity-75' : ''
                  } ${
                    course.track === preferredTrack ? 'ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => handleCourseClick(course)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge className={getTrackColor(course.track)}>
                          {course.track}
                        </Badge>
                        <Badge className={getTierColor(course.accessTier)}>
                          {course.accessTier}
                        </Badge>
                      </div>
                      {!course.hasAccess && <Lock className="w-4 h-4 text-muted-foreground" />}
                      {course.track === preferredTrack && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    {course.imageUrl && (
                      <div className="w-full h-32 bg-gray-100 rounded-md mb-3 overflow-hidden">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Level {course.level}</span>
                      </div>
                    </div>
                    
                    {course.hasAccess && course.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {course.completedLessons} of {course.totalLessons} lessons completed
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full" 
                      variant={course.hasAccess ? "default" : "outline"}
                      disabled={!course.hasAccess}
                    >
                      {!course.hasAccess ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Upgrade to Access
                        </>
                      ) : course.progress === 100 ? (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Review Course
                        </>
                      ) : course.progress > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}