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

function Router() {
  const { isAuthenticated, loading, userProfile } = useFirebaseAuth();
  const [location, setLocation] = useLocation();

  // Role-based redirects
  useEffect(() => {
    if (!loading && isAuthenticated && userProfile && location === '/dashboard') {
      switch (userProfile.role) {
        case 'admin':
          setLocation('/admin');
          break;
        case 'mastermind':
          setLocation('/mastermind-dashboard');
          break;
        case 'buyer':
          // Stay on dashboard
          break;
        case 'guest':
          setLocation('/courses');
          break;
      }
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
      {/* Public pages accessible to everyone */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/courses" component={Courses} />
      <Route path="/community" component={Community} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/quiz/result" component={QuizResult} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/thank-you" component={ThankYou} />
      
      {/* Authenticated routes */}
      <Layout>
        <Route path="/" component={isAuthenticated ? Dashboard : Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/lms" component={LMS} />
        <Route path="/quiz/deep" component={DeepQuiz} />
        <Route path="/mastermind-dashboard" component={Dashboard} />
        <Route path="/debug-auth" component={DebugAuth} />
        <Route path="/admin" component={AdminDashboard} />
      </Layout>
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
