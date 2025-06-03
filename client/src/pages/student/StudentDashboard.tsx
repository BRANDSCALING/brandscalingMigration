import { useState, useEffect } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import StudentHeader from "./StudentHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Bell, 
  PlayCircle, 
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Users
} from "lucide-react";

interface DashboardData {
  user: any;
  courses: any[];
  payments: any[];
  announcements: any[];
  progress: any[];
  upcomingEvents: any[];
}

export default function StudentDashboard() {
  const { userProfile } = useFirebaseAuth();

  // Fetch all dashboard data
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/student/dashboard"],
    enabled: !!userProfile?.uid,
  });

  const getTypeEmoji = (dominantType: string | null) => {
    switch (dominantType) {
      case 'architect': return '🏗️';
      case 'alchemist': return '⚗️';
      default: return '🎯';
    }
  };

  const getTypeTitle = (dominantType: string | null) => {
    switch (dominantType) {
      case 'architect': return 'The Architect';
      case 'alchemist': return 'The Alchemist';
      default: return 'Student';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = dashboardData?.user || userProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.firstName || 'Student'} 
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                  {getTypeEmoji(user?.dominantType)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Student'}!
              </h1>
              <p className="text-gray-600 mt-1">
                {getTypeTitle(user?.dominantType)}
                {user?.accessTier && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.accessTier.charAt(0).toUpperCase() + user.accessTier.slice(1)} Tier
                  </span>
                )}
              </p>
              {user?.assessmentComplete && user?.readinessLevel && (
                <p className="text-sm text-gray-500 mt-1">
                  Readiness Level: <span className="font-medium">{user.readinessLevel}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.courses.map((course: any) => (
                      <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={course.track === 'architect' ? 'default' : 'secondary'}>
                                {course.track}
                              </Badge>
                              <span className="text-xs text-gray-500">Level {course.level}</span>
                            </div>
                            {course.progress && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-medium">{Math.round(course.progress * 100)}%</span>
                                </div>
                                <Progress value={course.progress * 100} className="mt-1" />
                              </div>
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="ml-4">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
                    <p className="text-gray-600">Complete your assessment to unlock personalized courses.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.payments && dashboardData.payments.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.payments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{payment.product}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.paidAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            £{(payment.amount / 100).toFixed(2)}
                          </p>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-600">Your payment history will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Book a Call */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book a Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule a 1-on-1 call with our team to discuss your progress and goals.
                </p>
                <Button className="w-full" onClick={() => window.open('https://calendly.com/brandscaling', '_blank')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            {dashboardData?.upcomingEvents && dashboardData.upcomingEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.upcomingEvents.map((event: any) => (
                      <div key={event.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(event.scheduledAt).toLocaleDateString()} at{' '}
                          {new Date(event.scheduledAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {event.eventType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.announcements?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.announcements.map((announcement: any) => (
                      <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{announcement.body}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No announcements</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Progress Summary */}
            {dashboardData?.progress?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.progress.map((item: any) => (
                      <div key={item.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{item.courseTitle}</span>
                          <span className="font-medium">{Math.round(item.progress * 100)}%</span>
                        </div>
                        <Progress value={item.progress * 100} className="mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}