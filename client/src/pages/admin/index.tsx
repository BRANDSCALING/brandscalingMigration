import { useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import AdminLayout from './layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Insights from './pages/Insights';

export default function AdminPanel() {
  const { userProfile, loading, isAuthenticated } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && (!isAuthenticated || userProfile?.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [loading, isAuthenticated, userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || userProfile?.role !== 'admin') {
    return null;
  }

  const renderPage = () => {
    const pathname = window.location.pathname;
    
    if (pathname === '/admin') {
      return <Dashboard />;
    } else if (pathname === '/admin/users') {
      return <Users />;
    } else if (pathname === '/admin/posts') {
      return <Posts />;
    } else if (pathname === '/admin/insights') {
      return <Insights />;
    }
    
    return <Dashboard />;
  };

  return (
    <AdminLayout>
      {renderPage()}
    </AdminLayout>
  );
}