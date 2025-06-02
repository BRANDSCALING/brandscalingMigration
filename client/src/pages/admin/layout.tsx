import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        currentPage={currentPage} 
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
          {children}
        </main>
      </div>
    </div>
  );
}