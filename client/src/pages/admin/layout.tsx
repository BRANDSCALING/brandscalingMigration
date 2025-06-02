import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex flex-col flex-1 min-h-0">
          <div className="sticky top-0 z-50">
            <AdminHeader setSidebarOpen={setSidebarOpen} />
          </div>
          
          <main className="overflow-y-auto flex-1 min-h-0 p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}