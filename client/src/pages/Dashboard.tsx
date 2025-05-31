import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/ui/stats-card";
import CourseCard from "@/components/ui/course-card";
import CommunityPost from "@/components/ui/community-post";
import AIAssistant from "@/components/AIAssistant";
import {
  GraduationCap,
  Users,
  Trophy,
  TrendingUp,
  Plus,
  DraftingCompass,
  Wand2,
  Video,
  Calendar,
  Award,
  Star,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: userProgress } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: posts } = useQuery({
    queryKey: ["/api/posts?limit=3"],
  });

  const { data: events } = useQuery({
    queryKey: ["/api/events"],
  });

  // Calculate stats from user progress
  const completedCourses = userProgress?.filter((p: any) => p.progress >= 1).length || 0;
  const totalProgress = userProgress?.reduce((acc: number, p: any) => acc + p.progress, 0) || 0;
  const avgProgress = userProgress?.length ? totalProgress / userProgress.length : 0;

  const stats = [
    {
      title: "Courses Completed",
      value: completedCourses.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: GraduationCap,
      iconColor: "text-primary",
      iconBg: "bg-blue-100",
    },
    {
      title: "Community Posts",
      value: "23",
      change: "+5",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Achievement Points",
      value: "1,247",
      change: "New!",
      changeType: "neutral" as const,
      icon: Trophy,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      title: "Progress Score",
      value: (avgProgress * 5).toFixed(1),
      change: "85%",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  const activeCourse = courses?.find((course: any) => {
    const progress = userProgress?.find((p: any) => p.courseId === course.id);
    return progress && progress.progress > 0 && progress.progress < 1;
  });

  const upcomingCourses = courses?.filter((course: any) => {
    const progress = userProgress?.find((p: any) => p.courseId === course.id);
    return !progress || progress.progress === 0;
  }).slice(0, 2) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.firstName || user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className="text-slate-600">Track your progress and continue your brandscaling journey</p>
          </div>
          <Button className="bg-primary text-white hover:bg-blue-600 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Path Progress */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Learning Path Progress</CardTitle>
                <Button variant="link" className="text-primary hover:text-blue-600">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Track Selection */}
              <div className="flex space-x-4 mb-6">
                <button className="flex-1 p-4 border-2 border-primary bg-blue-50 rounded-xl text-center transition-colors">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <DraftingCompass className="text-white w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Architect Track</h3>
                  <p className="text-xs text-slate-600">Strategic Foundation</p>
                </button>
                <button className="flex-1 p-4 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-center transition-colors">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="text-slate-600 w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Alchemist Track</h3>
                  <p className="text-xs text-slate-600">Creative Execution</p>
                </button>
              </div>

              {/* Current Course Progress */}
              <div className="space-y-4">
                {activeCourse && (
                  <CourseCard
                    course={activeCourse}
                    progress={userProgress?.find((p: any) => p.courseId === activeCourse.id)}
                    variant="active"
                  />
                )}

                {upcomingCourses.map((course: any) => (
                  <CourseCard key={course.id} course={course} variant="upcoming" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Community Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Community Highlights</CardTitle>
                <Button variant="link" className="text-primary hover:text-blue-600">
                  Join Discussion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts?.map((post: any) => (
                  <CommunityPost key={post.id} post={post} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <AIAssistant />

          {/* Quick Assessment */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Trophy className="text-white w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Brand Health Check</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-4">
                Take our 5-minute assessment to identify growth opportunities.
              </p>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Market Position</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Strong
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Digital Presence</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    Needs Work
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Customer Engagement</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Excellent
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Retake Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events?.slice(0, 2).map((event: any) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Video className="text-white w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                      <p className="text-xs text-slate-600">
                        {new Date(event.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Video className="text-white w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 text-sm">Mastermind Call</h4>
                        <p className="text-xs text-slate-600">Tomorrow, 2:00 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Users className="text-white w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 text-sm">Community Workshop</h4>
                        <p className="text-xs text-slate-600">Friday, 1:00 PM EST</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Award className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">Course Completion</h4>
                    <p className="text-xs text-slate-600">Brand Foundation Framework</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">Community Contributor</h4>
                    <p className="text-xs text-slate-600">10 helpful posts this month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
