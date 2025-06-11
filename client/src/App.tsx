import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import CoursesPage from "@/pages/Courses";
import Community from "@/pages/Community";
import Quiz from "@/pages/Quiz";
import QuizResult from "@/pages/QuizResult";
import DeepQuiz from "@/pages/DeepQuiz";
import EntrepreneurialDnaQuiz from "@/pages/EntrepreneurialDnaQuiz";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import Affiliates from "@/pages/Affiliates";
import Layout from "@/components/Layout";
import DevLogin from "@/pages/DevLogin";
import Dashboard from "@/pages/Dashboard";
import LessonView from "@/pages/LessonView";
import AICoach from "@/pages/AICoach";

// Sandboxed Modules
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentCourses from "@/pages/student/StudentCourses";
import StudentWorkbooks from "@/pages/student/StudentWorkbooks";
import StudentCommunity from "@/pages/student/StudentCommunity";

// Admin Modules
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import EmailCampaigns from "@/pages/admin/EmailCampaigns";
import EmailTemplates from "@/pages/admin/EmailTemplates";
import Leads from "@/pages/admin/Leads";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminCommunity from "@/pages/admin/AdminCommunity";

import CommunityComingSoon from "@/pages/community/CommunityComingSoon";
import CollabComingSoon from "@/pages/collab/CollabComingSoon";

function Router() {
  const { isAuthenticated, loading, userProfile, logout } = useFirebaseAuth();
  const [location, setLocation] = useLocation();

  // Force logout on app start if needed
  useEffect(() => {
    if (!loading && location === '/force-logout') {
      logout();
    }
  }, [loading, location, logout]);

  // Role-based redirects and access control
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && userProfile) {
        // Redirect from auth page after successful login
        if (location === '/auth') {
          switch (userProfile.role) {
            case 'admin':
              setLocation('/admin');
              break;
            case 'student':
              setLocation('/student');
              break;
            default:
              setLocation('/student');
          }
        }
      } else {
        // Redirect logged-out users from protected routes to home
        if (location.startsWith('/student') || location.startsWith('/admin')) {
          setLocation('/');
        }
      }
    }
  }, [isAuthenticated, loading, userProfile, location, setLocation]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  // Helper component for public pages - allow both authenticated and unauthenticated access
  const PublicPage = ({ children }: { children: React.ReactNode }) => {
    return <Layout>{children}</Layout>;
  };

  // Helper component for visitor-only pages (community/collab)
  const VisitorOnlyPage = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
      if (isAuthenticated && userProfile) {
        if (userProfile.role === 'student') {
          setLocation('/student');
        }
      }
    }, [isAuthenticated, userProfile, setLocation]);
    
    return (
      <Layout>
        {children}
      </Layout>
    );
  };

  return (
    <Switch>
      {/* Auth Route - Always accessible */}
      <Route path="/auth" component={Auth} />
      
      {/* Development Login - Always accessible */}
      <Route path="/dev-login" component={DevLogin} />
      
      {/* Development Admin Routes - Always accessible for testing */}
      <Route path="/dev-admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/dev-admin/courses" component={() => <AdminLayout><AdminCourses /></AdminLayout>} />
      <Route path="/dev-admin/community" component={() => <AdminLayout><AdminCommunity /></AdminLayout>} />
      <Route path="/dev-admin/leads" component={() => <AdminLayout><Leads /></AdminLayout>} />
      <Route path="/dev-admin/email-campaigns" component={() => <AdminLayout><EmailCampaigns /></AdminLayout>} />
      <Route path="/dev-admin/email-templates" component={() => <AdminLayout><EmailTemplates /></AdminLayout>} />

      {/* Visitor-Only Routes - Block authenticated users */}
      <Route path="/community" component={() => <VisitorOnlyPage><CommunityComingSoon /></VisitorOnlyPage>} />
      <Route path="/collab" component={() => <VisitorOnlyPage><CollabComingSoon /></VisitorOnlyPage>} />

      {/* Public Marketing Routes - Handle authenticated users with safe navigation */}
      <Route path="/" component={() => <Layout><Landing /></Layout>} />
      <Route path="/about" component={() => <PublicPage><About /></PublicPage>} />
      <Route path="/courses" component={() => <PublicPage><CoursesPage /></PublicPage>} />
      <Route path="/contact" component={() => <PublicPage><Contact /></PublicPage>} />
      <Route path="/blog" component={() => <PublicPage><Blog /></PublicPage>} />
      <Route path="/quiz" component={() => <PublicPage><Quiz /></PublicPage>} />
      <Route path="/quiz/result" component={() => <PublicPage><QuizResult /></PublicPage>} />
      <Route path="/deep-quiz" component={() => <PublicPage><DeepQuiz /></PublicPage>} />
      <Route path="/entrepreneurial-dna-quiz" component={() => <PublicPage><EntrepreneurialDnaQuiz /></PublicPage>} />
      <Route path="/checkout" component={() => <PublicPage><Checkout /></PublicPage>} />
      <Route path="/thank-you" component={() => <PublicPage><ThankYou /></PublicPage>} />
      <Route path="/affiliates" component={() => <PublicPage><Affiliates /></PublicPage>} />

      {/* SANDBOXED AUTHENTICATED ROUTES */}
      {/* Admin Module - ONLY accessible to admins */}
      {isAuthenticated && userProfile?.role === 'admin' && (
        <>
          <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/courses" component={() => <AdminLayout><AdminCourses /></AdminLayout>} />
          <Route path="/admin/community" component={() => <AdminLayout><AdminCommunity /></AdminLayout>} />
          <Route path="/admin/leads" component={() => <AdminLayout><Leads /></AdminLayout>} />
          <Route path="/admin/email-campaigns" component={() => <AdminLayout><EmailCampaigns /></AdminLayout>} />
          <Route path="/admin/email-templates" component={() => <AdminLayout><EmailTemplates /></AdminLayout>} />
          <Route path="/admin/settings" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
        </>
      )}

      {/* Student Module - Accessible to students and admins */}
      {isAuthenticated && (userProfile?.role === 'student' || userProfile?.role === 'admin') && (
        <>
          <Route path="/student" component={StudentDashboard} />
          <Route path="/student/courses" component={StudentCourses} />
          <Route path="/student/workbooks" component={StudentWorkbooks} />
          <Route path="/student/community" component={StudentCommunity} />
          <Route path="/student/:path*" component={StudentDashboard} />
        </>
      )}

      {/* Dual-Track Learning System - Accessible to authenticated users */}
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/courses" component={CoursesPage} />
          <Route path="/courses/:courseId/lessons/:lessonId">
            {(params) => <LessonView params={params} />}
          </Route>
          <Route path="/ai-coach" component={AICoach} />
        </>
      )}



      {/* Block cross-role access with 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}