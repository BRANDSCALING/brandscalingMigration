import AdminLayout from './layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Insights from './pages/Insights';

export default function AdminIndex() {
  const renderPage = () => {
    const pathname = window.location.pathname;
    
    if (pathname === '/admin/users') return <Users />;
    if (pathname === '/admin/posts') return <Posts />;
    if (pathname === '/admin/insights') return <Insights />;
    return <Dashboard />;
  };

  return (
    <AdminLayout>
      {renderPage()}
    </AdminLayout>
  );
}