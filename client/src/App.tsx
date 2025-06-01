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
import Quiz, { QuizResult } from "@/pages/Quiz";
import DeepQuiz from "@/pages/DeepQuiz";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import Layout from "@/components/Layout";

// Sandboxed Modules
import StudentDashboard from "@/pages/student/StudentDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CommunityComingSoon from "@/pages/community/CommunityComingSoon";
import CollabComingSoon from "@/pages/collab/CollabComingSoon";

function Router() {
  const { isAuthenticated, loading, userProfile } = useFirebaseAuth();
  const [location, setLocation] = useLocation();

  // Role-based redirects and access control
  useEffect(() => {
    if (!loading && isAuthenticated && userProfile) {
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
    }
  }, [isAuthenticated, loading, userProfile, location, setLocation]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  // Helper component for public pages
  const PublicPage = ({ children }: { children: React.ReactNode }) => {
    return (
      <Layout>
        {children}
      </Layout>
    );
  };

  return (
    <Switch>
      {/* Public Routes - Always accessible to visitors */}
      <Route path="/auth" component={Auth} />
      <Route path="/community" component={CommunityComingSoon} />
      <Route path="/collab" component={CollabComingSoon} />

      {/* Unauthenticated Routes - Public website (only for visitors) */}
      {!isAuthenticated && (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={() => <PublicPage><About /></PublicPage>} />
          <Route path="/courses" component={() => <PublicPage><Courses /></PublicPage>} />
          <Route path="/contact" component={() => <PublicPage><Contact /></PublicPage>} />
          <Route path="/blog" component={() => <PublicPage><Blog /></PublicPage>} />
          <Route path="/quiz" component={() => <PublicPage><Quiz /></PublicPage>} />
          <Route path="/quiz-result" component={() => <PublicPage><QuizResult /></PublicPage>} />
          <Route path="/deep-quiz" component={() => <PublicPage><DeepQuiz /></PublicPage>} />
          <Route path="/checkout" component={() => <PublicPage><Checkout /></PublicPage>} />
          <Route path="/thank-you" component={() => <PublicPage><ThankYou /></PublicPage>} />
        </>
      )}

      {/* Authenticated Routes - Sandboxed by Role */}
      {isAuthenticated && userProfile && (
        <>
          {/* Student Module - Sandboxed LMS */}
          {userProfile.role === 'student' && (
            <>
              <Route path="/student" component={StudentDashboard} />
              <Route path="/student/:path*" component={StudentDashboard} />
              <Route path="/" component={StudentDashboard} />
            </>
          )}

          {/* Admin Module - Sandboxed Admin Panel */}
          {userProfile.role === 'admin' && (
            <>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/:path*" component={AdminDashboard} />
              <Route path="/" component={AdminDashboard} />
            </>
          )}
        </>
      )}

      {/* 404 Route */}
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