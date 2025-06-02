import { useEffect, useState } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useLocation } from 'wouter';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Tags from './pages/Tags';
import Moderation from './pages/Moderation';
import Insights from './pages/Insights';

export default function AdminPanel() {
  const { userProfile, loading, isAuthenticated } = useFirebaseAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect non-admins before rendering any admin content
  useEffect(() => {
    if (!loading && (!isAuthenticated || userProfile?.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [loading, isAuthenticated, userProfile]);

  // Show loading while auth check is in progress
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Don't render anything if not admin (redirect will handle this)
  if (!isAuthenticated || userProfile?.role !== 'admin') {
    return null;
  }

  const getCurrentPage = () => {
    if (location === '/admin' || location === '/admin/') return 'dashboard';
    if (location.startsWith('/admin/users')) return 'users';
    if (location.startsWith('/admin/posts')) return 'posts';
    if (location.startsWith('/admin/tags')) return 'tags';
    if (location.startsWith('/admin/moderation')) return 'moderation';
    if (location.startsWith('/admin/insights')) return 'insights';
    return 'dashboard';
  };

  const renderPage = () => {
    switch (location) {
      case '/admin':
      case '/admin/':
        return <Dashboard />;
      case '/admin/users':
        return <Users />;
      case '/admin/posts':
        return <Posts />;
      case '/admin/tags':
        return <Tags />;
      case '/admin/moderation':
        return <Moderation />;
      case '/admin/insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        currentPage={getCurrentPage()} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white flex-shrink-0">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto min-h-0 p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}