import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { LogOut, User, BookOpen, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StudentHeader() {
  const { logout, userProfile } = useFirebaseAuth();
  const [location, setLocation] = useLocation();

  const handleLogoClick = () => {
    // Students can return to homepage but with logout confirmation
    if (confirm("Return to homepage? This will log you out of your student portal.")) {
      logout();
      setLocation('/');
    }
  };

  const handleSignOut = async () => {
    await logout();
    setLocation('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Brandscaling
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/student">
              <a className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/student' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:text-purple-700 hover:bg-gray-50'
              }`}>
                <BookOpen className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </Link>
            
            <Link href="/student/courses">
              <a className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/student/courses' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:text-purple-700 hover:bg-gray-50'
              }`}>
                <BookOpen className="h-4 w-4" />
                <span>My Courses</span>
              </a>
            </Link>

            <Link href="/student/workbooks">
              <a className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/student/workbooks' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:text-purple-700 hover:bg-gray-50'
              }`}>
                <FileText className="h-4 w-4" />
                <span>Workbooks</span>
              </a>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{userProfile?.firstName || 'Student'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
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