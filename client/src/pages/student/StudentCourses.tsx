import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Lock, Star, Search, Clock } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  track: string;
  level: number;
  accessTier: string;
  hasAccess: boolean;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function StudentCourses() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock user DNA type
  const userDnaType = 'Architect';
  const preferredTrack = userDnaType === 'Architect' ? 'architect' : 'alchemist';

  // Mock courses data
  const courses: Course[] = [
    {
      id: 1,
      title: "Architect Foundation Course",
      description: "Master systematic business building strategies designed for analytical minds",
      track: "architect",
      level: 1,
      accessTier: "beginner",
      hasAccess: true,
      progress: 25,
      completedLessons: 2,
      totalLessons: 8,
    },
    {
      id: 2,
      title: "Alchemist Creative Scaling",
      description: "Unlock creative growth methods for intuitive entrepreneurs",
      track: "alchemist", 
      level: 2,
      accessTier: "intermediate",
      hasAccess: false,
      progress: 0,
      completedLessons: 0,
      totalLessons: 12,
    },
    {
      id: 3,
      title: "Advanced Revenue Optimization",
      description: "Advanced strategies for scaling revenue across all business models",
      track: "architect",
      level: 3,
      accessTier: "advanced",
      hasAccess: true,
      progress: 75,
      completedLessons: 9,
      totalLessons: 12,
    }
  ];

  const filteredCourses = courses.filter((course: Course) => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (a.track === preferredTrack && b.track !== preferredTrack) return -1;
    if (b.track === preferredTrack && a.track !== preferredTrack) return 1;
    return 0;
  });

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

  const handleCourseClick = (course: Course) => {
    if (course.hasAccess) {
      navigate(`/student/course/${course.id}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Learning Journey</h1>
        <p className="text-muted-foreground mb-6">
          Personalized for {userDnaType} entrepreneurs - Strategic, analytical, and systematic approaches
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

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
    </div>
  );
}