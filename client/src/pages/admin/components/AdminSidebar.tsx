import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Tags, 
  Shield, 
  TrendingUp
} from 'lucide-react';

interface AdminSidebarProps {
  currentPage: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ currentPage, isOpen = false, onClose }: AdminSidebarProps) {

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
              onClick={() => onClose?.()}
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
    <aside className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <SidebarContent />
      </div>
    </aside>
  );
}