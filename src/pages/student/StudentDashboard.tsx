import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Target, TrendingUp, Play } from 'lucide-react';

export function StudentDashboard() {
  const studentEmail = localStorage.getItem('studentEmail') || 'Student';

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Continue your entrepreneurial journey with personalized learning
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Average completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Architect Foundation Course</h3>
                    <p className="text-sm text-muted-foreground">Systematic business building</p>
                  </div>
                  <Badge variant="secondary">Architect</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <p className="text-xs text-muted-foreground">2 of 8 lessons completed</p>
                </div>
                <Link href="/student/course/1">
                  <Button className="w-full mt-3">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Advanced Revenue Optimization</h3>
                    <p className="text-sm text-muted-foreground">Scale revenue across all models</p>
                  </div>
                  <Badge variant="secondary">Architect</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">9 of 12 lessons completed</p>
                </div>
                <Link href="/student/course/3">
                  <Button className="w-full mt-3">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/student/courses">
                <Button className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Courses
                </Button>
              </Link>
              
              <Link href="/quiz">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Retake DNA Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* DNA Type Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Entrepreneurial DNA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl mb-2">🏗️</div>
                <Badge className="mb-2">Architect</Badge>
                <p className="text-sm text-muted-foreground">
                  Strategic, analytical, and systematic approaches to business building
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}