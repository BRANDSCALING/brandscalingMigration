import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Tags, 
  Shield, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  currentPage: string;
}

export default function AdminSidebar({ currentPage }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      id: 'tags', 
      label: 'Tags', 
      icon: Tags, 
      href: '/admin/tags' 
    },
    { 
      id: 'moderation', 
      label: 'Moderation', 
      icon: Shield, 
      href: '/admin/moderation' 
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
        const isActive = currentPage === item.id;
        
        return (
          <Link key={item.id} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-12 ${
                isActive 
                  ? "bg-purple-600 text-white hover:bg-purple-700" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileOpen(false)}
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
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}