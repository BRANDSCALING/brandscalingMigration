import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Community from "@/pages/Community";
import Quiz, { QuizResult } from "@/pages/Quiz";
import DeepQuiz from "@/pages/DeepQuiz";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import DebugAuth from "@/pages/DebugAuth";
import LMS from "@/pages/LMSSimple";
import TestRoute from "@/pages/TestRoute";
import Layout from "@/components/Layout";
import Header from "@/components/Header";

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
            setLocation('/dashboard');
            break;
          case 'student':
          case 'buyer':
            setLocation('/lms');
            break;
          default:
            setLocation('/lms');
        }
      }
      // Redirect students away from admin dashboard and public pages
      else if (userProfile.role === 'student' || userProfile.role === 'buyer') {
        if (location === '/dashboard' || location === '/admin' || 
            location === '/about' || location === '/courses' || 
            location === '/community' || location === '/contact' || location === '/blog') {
          setLocation('/lms');
        }
      }
      // Redirect non-admin users away from admin dashboard
      else if (userProfile.role !== 'admin' && 
               (location === '/dashboard' || location === '/admin')) {
        setLocation('/lms');
      }
      // Redirect admin users away from public pages to admin dashboard
      else if (userProfile.role === 'admin' && 
               (location === '/about' || location === '/courses' || 
                location === '/community' || location === '/contact' || location === '/blog')) {
        setLocation('/dashboard');
      }
    }
    // Redirect unauthenticated users trying to access protected routes
    else if (!loading && !isAuthenticated && 
             (location.startsWith('/dashboard') || location.startsWith('/admin') || location.startsWith('/lms'))) {
      setLocation('/auth');
    }
  }, [loading, isAuthenticated, userProfile, location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - only for unauthenticated users */}
      {!isAuthenticated && (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/courses" component={Courses} />
          <Route path="/community" component={Community} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/quiz/result" component={QuizResult} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </>
      )}

      {/* Admin routes - only for admin users */}
      {isAuthenticated && userProfile?.role === 'admin' && (
        <Layout>
          <Route path="/dashboard" component={AdminDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/debug-auth" component={DebugAuth} />
          <Route path="/" component={AdminDashboard} />
        </Layout>
      )}

      {/* Student routes - only for student/buyer users */}
      {isAuthenticated && (userProfile?.role === 'student' || userProfile?.role === 'buyer') && (
        <Layout>
          <Route path="/lms" component={LMS} />
          <Route path="/quiz/deep" component={DeepQuiz} />
          <Route path="/mastermind-dashboard" component={Dashboard} />
          <Route path="/" component={LMS} />
        </Layout>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
