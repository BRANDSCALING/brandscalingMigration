import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const getCurrentPage = () => {
    const pathname = window.location.pathname;
    if (pathname === '/admin') return 'dashboard';
    if (pathname === '/admin/users') return 'users';
    if (pathname === '/admin/posts') return 'posts';
    if (pathname === '/admin/insights') return 'insights';
    return 'dashboard';
  };

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      href: '/admin' 
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      href: '/admin/users' 
    },
    { 
      id: 'posts', 
      label: 'Posts', 
      icon: FileText, 
      href: '/admin/posts' 
    },
    { 
      id: 'insights', 
      label: 'Insights', 
      icon: TrendingUp, 
      href: '/admin/insights' 
    },
  ];

  const SidebarContent = () => (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = getCurrentPage() === item.id;
        
        return (
          <Link key={item.id} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-12 ${
                isActive 
                  ? "bg-purple-600 text-white hover:bg-purple-700" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <SidebarContent />
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
            <div className="p-6">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}