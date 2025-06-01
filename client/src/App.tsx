import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Courses from "@/pages/Courses";
import Community from "@/pages/Community";
import Quiz from "@/pages/Quiz";
import DeepQuiz from "@/pages/DeepQuiz";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import Affiliates from "@/pages/Affiliates";
import Layout from "@/components/Layout";

// Sandboxed Modules
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentCourses from "@/pages/student/StudentCourses";
import StudentWorkbooks from "@/pages/student/StudentWorkbooks";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CommunityComingSoon from "@/pages/community/CommunityComingSoon";
import CollabComingSoon from "@/pages/collab/CollabComingSoon";

function Router() {
  const { isAuthenticated, loading, userProfile } = useFirebaseAuth();
  const [location, setLocation] = useLocation();

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

  // Helper component for public pages with access control
  const PublicPage = ({ children }: { children: React.ReactNode }) => {
    // Redirect authenticated users to their dashboards from public pages
    if (isAuthenticated && userProfile) {
      if (userProfile.role === 'student') {
        setLocation('/student');
        return null;
      }
      if (userProfile.role === 'admin') {
        setLocation('/admin');
        return null;
      }
    }
    
    return (
      <Layout>
        {children}
      </Layout>
    );
  };

  // Helper component for visitor-only pages (community/collab)
  const VisitorOnlyPage = ({ children }: { children: React.ReactNode }) => {
    // Redirect authenticated users to their dashboards
    if (isAuthenticated && userProfile) {
      if (userProfile.role === 'student') {
        setLocation('/student');
        return null;
      }
      if (userProfile.role === 'admin') {
        setLocation('/admin');
        return null;
      }
    }
    
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

      {/* Visitor-Only Routes - Block authenticated users */}
      <Route path="/community" component={() => <VisitorOnlyPage><CommunityComingSoon /></VisitorOnlyPage>} />
      <Route path="/collab" component={() => <VisitorOnlyPage><CollabComingSoon /></VisitorOnlyPage>} />

      {/* Public Marketing Routes - Redirect authenticated users to dashboards */}
      <Route path="/" component={() => <PublicPage><Landing /></PublicPage>} />
      <Route path="/about" component={() => <PublicPage><About /></PublicPage>} />
      <Route path="/courses" component={() => <PublicPage><Courses /></PublicPage>} />
      <Route path="/contact" component={() => <PublicPage><Contact /></PublicPage>} />
      <Route path="/blog" component={() => <PublicPage><Blog /></PublicPage>} />
      <Route path="/quiz" component={() => <PublicPage><Quiz /></PublicPage>} />

      <Route path="/deep-quiz" component={() => <PublicPage><DeepQuiz /></PublicPage>} />
      <Route path="/checkout" component={() => <PublicPage><Checkout /></PublicPage>} />
      <Route path="/thank-you" component={() => <PublicPage><ThankYou /></PublicPage>} />
      <Route path="/affiliates" component={() => <PublicPage><Affiliates /></PublicPage>} />

      {/* SANDBOXED AUTHENTICATED ROUTES */}
      {/* Student Module - ONLY accessible to students */}
      {isAuthenticated && userProfile?.role === 'student' && (
        <>
          <Route path="/student" component={StudentDashboard} />
          <Route path="/student/courses" component={StudentCourses} />
          <Route path="/student/workbooks" component={StudentWorkbooks} />
          <Route path="/student/:path*" component={StudentDashboard} />
        </>
      )}

      {/* Admin Module - ONLY accessible to admins */}
      {isAuthenticated && userProfile?.role === 'admin' && (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/:path*" component={AdminDashboard} />
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