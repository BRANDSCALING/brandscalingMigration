import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Clock, Plus } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import StudentHeader from "./StudentHeader";

export default function StudentDashboard() {
  const { userProfile } = useFirebaseAuth();

  // No dummy data - will be replaced with real data when courses are added
  const courses: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.firstName || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your Brandscaling journey with your personalized learning path.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                Active learning paths
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                No courses yet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                No data yet
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
          {courses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't enrolled in any courses yet. Explore our course catalog to get started.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Courses
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real courses will be displayed here when added */}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Digital Workbooks</CardTitle>
              <CardDescription>
                Access your interactive workbooks and get AI-powered feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Open Workbooks
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Unlock advanced courses and premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                View Upgrade Options
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}