import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  UserPlus,
  Settings 
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/community', label: 'Community', icon: MessageSquare },
  { href: '/admin/leads', label: 'Leads', icon: UserPlus },
  { href: '/admin/email-campaigns', label: 'Email Campaigns', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut, isAdmin } = useAuth();
  const [location] = useLocation();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Brandscaling Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}>
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}