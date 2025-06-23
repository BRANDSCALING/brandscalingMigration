import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocation } from 'wouter';
import { 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Bell, 
  TrendingUp,
  Play,
  FileText,
  ExternalLink,
  Star
} from 'lucide-react';

interface DashboardData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    dominantType: string;
    readinessLevel: string;
    accessTier: string;
    assessmentComplete: boolean;
    profileImageUrl?: string;
  };
  payments: Array<{
    id: number;
    product: string;
    amount: number;
    paidAt: string;
    stripeId: string;
  }>;
  courses: Array<{
    id: number;
    title: string;
    description: string;
    requiredTier: string;
    architectVideoUrl?: string;
    alchemistVideoUrl?: string;
    architectWorkbookUrl?: string;
    alchemistWorkbookUrl?: string;
  }>;
  progress: Array<{
    moduleId: number;
    completed: boolean;
    completedAt?: string;
    viewMode: string;
  }>;
  announcements: Array<{
    id: number;
    title: string;
    summary: string;
    createdAt: string;
  }>;
  stats: {
    totalCourses: number;
    completedModules: number;
    totalSpent: number;
  };
}

export default function StudentDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Check for student authentication
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    
    if (studentId && studentEmail) {
      setIsAuthenticated(true);
    } else {
      setLocation('/auth');
    }
    setLoading(false);
  }, [setLocation]);
  
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/student/dashboard'],
    enabled: isAuthenticated,
    retry: false
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Access Issue</h2>
            <p className="text-red-600 mb-4">
              Unable to load student dashboard. You may need to authenticate first.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <a href="/auth">Sign In</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/test-student">Test Dashboard</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scale-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { user, payments, courses, progress, announcements, stats } = dashboardData;
  


  const formatCurrency = (amountInPence: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amountInPence / 100);
  };

  const getProgressPercentage = () => {
    if (stats.totalCourses === 0) return 0;
    return Math.round((stats.completedModules / stats.totalCourses) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback className="text-lg">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600">
                {user.dominantType} • {user.readinessLevel} Level • {user.accessTier} Tier
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Modules</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedModules}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>My Courses</span>
              </CardTitle>
              <CardDescription>
                Your unlocked course content based on your {user.accessTier} access tier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No courses available for your current access tier.
                </p>
              ) : (
                courses.map((course) => {
                  const isCompleted = progress.some(p => p.moduleId === course.id && p.completed);
                  const videoUrl = user.dominantType === 'architect' ? course.architectVideoUrl : course.alchemistVideoUrl;
                  const workbookUrl = user.dominantType === 'architect' ? course.architectWorkbookUrl : course.alchemistWorkbookUrl;
                  
                  return (
                    <div key={course.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">{course.requiredTier}</Badge>
                            {isCompleted && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <Star className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {videoUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                              <Play className="h-4 w-4 mr-2" />
                              Watch Video
                            </a>
                          </Button>
                        )}
                        {workbookUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={workbookUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              Workbook
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Track your learning journey and completion status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{getProgressPercentage()}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.completedModules}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{stats.totalCourses - stats.completedModules}</p>
                    <p className="text-sm text-gray-600">Remaining</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book a Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Book a Call</span>
              </CardTitle>
              <CardDescription>
                Schedule a session with our expert team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="mb-4">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Ready to accelerate your progress?</p>
                </div>
                <Button className="w-full" asChild>
                  <a href="https://calendly.com/brandscaling" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* My Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>My Payments</span>
              </CardTitle>
              <CardDescription>
                Your payment history and purchase records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No payment history available.
                </p>
              ) : (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.product}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.paidAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-gray-500">Paid</p>
                      </div>
                    </div>
                  ))}
                  {payments.length > 5 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View All Payments
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Latest Announcements</span>
              </CardTitle>
              <CardDescription>
                Stay updated with the latest news and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No announcements at this time.
                </p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{announcement.summary}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}