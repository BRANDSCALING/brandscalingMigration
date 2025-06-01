import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Search } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import StudentHeader from "./StudentHeader";

export default function StudentCourses() {
  const { userProfile } = useFirebaseAuth();

  const enrolledCourses: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">
            Manage and continue your learning journey with enrolled courses.
          </p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Enrolled courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Active courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Finished courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Enrolled Courses</h2>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          </div>

          {enrolledCourses.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      You haven't enrolled in any courses yet. Explore our comprehensive course catalog to start your Brandscaling journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button size="lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Course Catalog
                      </Button>
                      <Button variant="outline" size="lg">
                        Take Personality Quiz
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Real enrolled courses will be displayed here when added */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}