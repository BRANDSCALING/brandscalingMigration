import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { LogOut, User, Settings, Users, BookOpen, BarChart3, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminHeader() {
  const { logout, userProfile } = useFirebaseAuth();
  const [location, setLocation] = useLocation();

  const handleLogoClick = () => {
    // Admins get optional access to homepage for QA/testing
    if (confirm("Return to homepage? This will log you out of the admin panel.")) {
      logout();
      setLocation('/');
    }
  };

  const handleSignOut = async () => {
    await logout();
    setLocation('/');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Brandscaling
            </button>
            <span className="ml-3 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
              ADMIN
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/admin">
              <a className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/admin' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}>
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </Link>
            
            <Link href="/admin/users">
              <a className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/admin/users' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}>
                <Users className="h-4 w-4" />
                <span>Users</span>
              </a>
            </Link>

            <Link href="/admin/courses">
              <a className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/admin/courses' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}>
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </a>
            </Link>

            <Link href="/admin/content">
              <a className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/admin/content' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}>
                <FileText className="h-4 w-4" />
                <span>Content</span>
              </a>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-slate-300 hover:text-white">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{userProfile?.firstName || 'Admin'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}