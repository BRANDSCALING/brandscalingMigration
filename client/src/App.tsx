import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import CoursesPage from "@/pages/Courses";
import Community from "@/pages/Community";



import EntrepreneurialDnaQuiz from "@/pages/EntrepreneurialDnaQuiz";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import Affiliates from "@/pages/Affiliates";
import Layout from "@/components/Layout";
import DevLogin from "@/pages/DevLogin";
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/Dashboard";
import LessonView from "@/pages/LessonView";
import AICoach from "@/pages/AICoach";
import SmartBusinessBuilder from "@/pages/SmartBusinessBuilder";
import AIAgents from "@/pages/AIAgents";
import StudentDashboard from "@/pages/student/StudentDashboard";
import InteractiveWorkbooks from "@/pages/InteractiveWorkbooks";
import StudentCourses from "@/pages/student/StudentCourses";
import StudentCourseView from "@/pages/student/StudentCourseView";
import StudentWorkbooks from "@/pages/student/StudentWorkbooks";
import StudentCommunity from "@/pages/student/StudentCommunity";
import EntryDashboard from "@/pages/EntryDashboard";
import SevenDayReset from "@/pages/SevenDayReset";

// Admin Modules
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import EmailCampaigns from "@/pages/admin/EmailCampaigns";
import EmailTemplates from "@/pages/admin/EmailTemplates";
import Leads from "@/pages/admin/Leads";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminCommunity from "@/pages/admin/AdminCommunity";
import AdminSettings from "@/pages/admin/AdminSettings";



function Router() {
  return (
    <Switch>
      {/* Quiz - Top Priority - No Header/Footer for distraction-free experience */}
      <Route
        path="/entrepreneurial-dna-quiz"
        component={() => (
          <div className="min-h-screen bg-white">
            <main className="flex-1">
              <EntrepreneurialDnaQuiz />
            </main>
          </div>
        )}
      />


      {/* Dashboard */}
      <Route
        path="/dashboard"
        component={() => (
          <Layout>
            <Dashboard />
          </Layout>
        )}
      />

      {/* Main Pages */}
      <Route
        path="/"
        component={() => (
          <Layout>
            <Landing />
          </Layout>
        )}
      />
      <Route
        path="/about"
        component={() => (
          <Layout>
            <About />
          </Layout>
        )}
      />
      <Route
        path="/courses"
        component={() => (
          <Layout>
            <CoursesPage />
          </Layout>
        )}
      />
      <Route
        path="/ai-agents"
        component={() => (
          <Layout>
            <AIAgents />
          </Layout>
        )}
      />
      <Route
        path="/smart-business-builder"
        component={() => (
          <Layout>
            <SmartBusinessBuilder />
          </Layout>
        )}
      />
      <Route
        path="/contact"
        component={() => (
          <Layout>
            <Contact />
          </Layout>
        )}
      />
      <Route
        path="/blog"
        component={() => (
          <Layout>
            <Blog />
          </Layout>
        )}
      />
      <Route path="/auth" component={Auth} />
      <Route path="/login" component={Auth} />
      <Route path="/dev-login" component={DevLogin} />
      <Route path="/admin-login" component={AdminLogin} />

      {/* Student Routes */}
      <Route path="/student">
        <Layout>
          <StudentDashboard />
        </Layout>
      </Route>
      <Route path="/student/courses">
        <Layout>
          <StudentCourses />
        </Layout>
      </Route>
      <Route path="/student/course/:id">
        <Layout>
          <StudentCourseView />
        </Layout>
      </Route>
      
      {/* Specific Course Routes */}
      <Route path="/courses/infinite-scaling/profit-maximisation">
        <Layout>
          <StudentCourseView />
        </Layout>
      </Route>
      <Route path="/courses/fuse-framework">
        <Layout>
          <StudentCourseView />
        </Layout>
      </Route>
      <Route path="/courses/idea-to-launch/:moduleId">
        <Layout>
          <StudentCourseView />
        </Layout>
      </Route>
      <Route path="/courses/smart-business-builder/:moduleId">
        <Layout>
          <StudentCourseView />
        </Layout>
      </Route>
      <Route path="/courses/30-day-launch-plan">
        <Layout>
          <StudentCourseView />
        </Layout>
      </Route>
      
      {/* 7-Day Reset Route */}
      <Route path="/7-day-reset">
        <SevenDayReset />
      </Route>

      {/* Entry Tier Routes */}
      <Route path="/entry">
        <Layout>
          <EntryDashboard />
        </Layout>
      </Route>
      <Route
        path="/workbooks"
        component={() => (
          <Layout>
            <InteractiveWorkbooks />
          </Layout>
        )}
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        component={() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/courses"
        component={() => (
          <AdminLayout>
            <AdminCourses />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/community"
        component={() => (
          <AdminLayout>
            <AdminCommunity />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/email-campaigns"
        component={() => (
          <AdminLayout>
            <EmailCampaigns />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/email-templates"
        component={() => (
          <AdminLayout>
            <EmailTemplates />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/leads"
        component={() => (
          <AdminLayout>
            <Leads />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/settings"
        component={() => (
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        )}
      />

      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
