import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Switch, Route } from 'wouter';
import { AuthProvider } from './context/AuthContext';
import { UserDNAProvider } from './context/UserDNAContext';
import { SupabaseAuth } from './modules/auth/SupabaseAuth';
import { useAuth } from './context/AuthContext';
import { HomePage } from './pages/index';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { Toaster } from './components/ui/toaster';

// Import existing pages
import { EntrepreneurialDnaQuiz } from '../client/src/pages/EntrepreneurialDnaQuiz';
import { QuizResult } from '../client/src/pages/QuizResult';
import { SmartBusinessBuilder } from '../client/src/pages/SmartBusinessBuilder';
import { Courses } from '../client/src/pages/Courses';
import { About } from '../client/src/pages/About';
import { Contact } from '../client/src/pages/Contact';
import { Community } from '../client/src/pages/Community';

// Admin pages
import AdminDashboard from '../client/src/pages/admin/AdminDashboard';
import AdminCourses from '../client/src/pages/admin/AdminCourses';
import AdminCommunity from '../client/src/pages/admin/AdminCommunity';
import Leads from '../client/src/pages/admin/Leads';
import EmailCampaigns from '../client/src/pages/admin/EmailCampaigns';
import AdminSettings from '../client/src/pages/admin/AdminSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <SupabaseAuth />;
  }

  return (
    <Switch>
      {/* Public routes for authenticated users */}
      <Route path="/" component={HomePage} />
      <Route path="/quiz">
        <PublicLayout>
          <EntrepreneurialDnaQuiz />
        </PublicLayout>
      </Route>
      <Route path="/quiz-result">
        <PublicLayout>
          <QuizResult />
        </PublicLayout>
      </Route>
      <Route path="/smart-business-builder">
        <PublicLayout>
          <SmartBusinessBuilder />
        </PublicLayout>
      </Route>
      <Route path="/courses">
        <PublicLayout>
          <Courses />
        </PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout>
          <About />
        </PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout>
          <Contact />
        </PublicLayout>
      </Route>
      <Route path="/community">
        <PublicLayout>
          <Community />
        </PublicLayout>
      </Route>

      {/* Admin routes */}
      {isAdmin && (
        <>
          <Route path="/admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </Route>
          <Route path="/admin/courses">
            <AdminLayout>
              <AdminCourses />
            </AdminLayout>
          </Route>
          <Route path="/admin/community">
            <AdminLayout>
              <AdminCommunity />
            </AdminLayout>
          </Route>
          <Route path="/admin/leads">
            <AdminLayout>
              <Leads />
            </AdminLayout>
          </Route>
          <Route path="/admin/email-campaigns">
            <AdminLayout>
              <EmailCampaigns />
            </AdminLayout>
          </Route>
          <Route path="/admin/settings">
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </Route>
        </>
      )}

      {/* 404 fallback */}
      <Route>
        <PublicLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        </PublicLayout>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserDNAProvider>
          <AppRoutes />
          <Toaster />
        </UserDNAProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}