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
    switch (getCurrentPage()) {
      case 'users':
        return <Users />;
      case 'posts':
        return <Posts />;
      case 'tags':
        return <Tags />;
      case 'moderation':
        return <Moderation />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <AdminSidebar currentPage={getCurrentPage()} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}