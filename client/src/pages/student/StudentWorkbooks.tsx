import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Download, Eye } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import StudentHeader from "./StudentHeader";

export default function StudentWorkbooks() {
  const { userProfile } = useFirebaseAuth();

  const workbooks: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Digital Workbooks</h1>
          <p className="text-gray-600 mt-2">
            Access your interactive workbooks and get AI-powered feedback on your progress.
          </p>
        </div>

        {/* Workbook Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workbooks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workbooks.length}</div>
              <p className="text-xs text-muted-foreground">
                Available workbooks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Active workbooks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Finished workbooks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workbooks List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Workbooks</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Browse Workbooks
            </Button>
          </div>

          {workbooks.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <FileText className="h-16 w-16 text-gray-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No workbooks available</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      You don't have any workbooks yet. Complete courses to unlock interactive workbooks with AI-powered feedback.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button size="lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Explore Workbooks
                      </Button>
                      <Button variant="outline" size="lg">
                        View Course Catalog
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Real workbooks will be displayed here when added */}
            </div>
          )}
        </div>

        {/* Getting Started Guide */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">How Digital Workbooks Work</CardTitle>
            <CardDescription className="text-blue-700">
              Interactive learning materials with AI-powered feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-200 rounded-full p-2">
                  <FileText className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold">Complete Exercises</h4>
                  <p className="text-sm">Work through interactive exercises and templates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-200 rounded-full p-2">
                  <Eye className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold">Get AI Feedback</h4>
                  <p className="text-sm">Receive personalized insights and recommendations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-200 rounded-full p-2">
                  <Download className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold">Download Results</h4>
                  <p className="text-sm">Export your completed workbooks and strategies</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}