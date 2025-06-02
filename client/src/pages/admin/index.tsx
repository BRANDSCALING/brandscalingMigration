import { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Tags from './pages/Tags';
import Moderation from './pages/Moderation';
import Insights from './pages/Insights';

export default function AdminIndex() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getCurrentPage = () => {
    const pathname = window.location.pathname;
    if (pathname === '/admin/users') return 'users';
    if (pathname === '/admin/posts') return 'posts';
    if (pathname === '/admin/tags') return 'tags';
    if (pathname === '/admin/moderation') return 'moderation';
    if (pathname === '/admin/insights') return 'insights';
    return 'dashboard';
  };

  const renderPage = () => {
    const currentPage = getCurrentPage();
    switch (currentPage) {
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
    <div className="flex h-screen w-screen">
      <AdminSidebar 
        currentPage={getCurrentPage()} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-col flex-1 min-h-0">
        <div className="sticky top-0 z-50">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}