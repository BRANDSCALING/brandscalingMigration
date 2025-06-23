import { Link, useLocation } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  User, 
  Brain,
  Building 
} from 'lucide-react';

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/quiz', label: 'DNA Quiz', icon: Brain },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/smart-business-builder', label: 'Business Builder', icon: Building },
  { href: '/community', label: 'Community', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Navigation() {
  const [location] = useLocation();
  const { isAdmin } = useAuth();

  return (
    <nav className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
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
          
          {isAdmin && (
            <li className="pt-4 mt-4 border-t">
              <Link href="/admin">
                <a className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-purple-600 hover:bg-purple-50">
                  <User className="mr-3 h-5 w-5" />
                  Admin Panel
                </a>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}