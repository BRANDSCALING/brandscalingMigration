import { Link } from "wouter";
import { User, Infinity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [localUser, setLocalUser] = useState<any>(null);
  
  // Check for local student authentication
  const checkAuthState = () => {
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    const adminId = sessionStorage.getItem('adminId');
    
    if (studentId && studentEmail) {
      setLocalUser({
        id: studentId,
        email: studentEmail,
        role: 'student',
        accessTier: 'beginner'
      });
    } else if (adminId) {
      setLocalUser({
        id: adminId,
        email: 'admin@brandscaling.com',
        role: 'admin',
        accessTier: 'mastermind'
      });
    } else if (user) {
      setLocalUser(user);
    } else {
      setLocalUser(null);
    }
  };

  useEffect(() => {
    checkAuthState();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for localStorage.clear()
    const handleLocalStorageClear = () => {
      checkAuthState();
    };
    
    window.addEventListener('localStorageCleared', handleLocalStorageClear);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageCleared', handleLocalStorageClear);
    };
  }, [user]);

  const getDashboardLink = () => {
    if (!localUser) return '/auth';
    
    if (localUser.role === 'admin') return '/admin';
    
    // Check access tier for students
    if (localUser.role === 'student') {
      const accessTier = localUser.accessTier;
      if (accessTier === 'beginner' || accessTier === 'entry') {
        return '/entry';
      }
      return '/student';
    }
    
    return '/auth';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container-brandscaling">
        <div className="flex justify-between items-center h-20">
          {/* Brandscaling Logo with Infinity Symbol */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-xl gradient-brandscaling">
                <Infinity className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold gradient-brandscaling bg-clip-text text-transparent">
                  Brandscaling
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Purpose → Profit → Purpose
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/about" className="text-gray-700 hover:text-architect transition-colors font-medium">
              About
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-architect transition-colors font-medium">
              Courses
            </Link>
            <Link href="/ai-agents" className="text-gray-700 hover:text-alchemist transition-colors font-medium">
              AI Advisors
            </Link>
            <Link href="/workbooks" className="text-gray-700 hover:text-alchemist transition-colors font-medium">
              Workbooks
            </Link>
            <Link href="/entrepreneurial-dna-quiz">
              <Button variant="outline" className="border-architect-indigo text-architect-indigo hover:bg-architect-indigo hover:text-white">
                Discover Your E-DNA
              </Button>
            </Link>
          </nav>

          {/* User Dashboard Access */}
          <div className="flex items-center space-x-4">
            <Link href={getDashboardLink()}>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-architect hover:bg-gray-50">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-100 py-4">
          <nav className="flex flex-col space-y-3">
            <Link href="/about" className="text-gray-700 hover:text-architect font-medium py-2">
              About
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-architect font-medium py-2">
              Courses
            </Link>
            <Link href="/ai-agents" className="text-gray-700 hover:text-alchemist font-medium py-2">
              AI Advisors
            </Link>
            <Link href="/workbooks" className="text-gray-700 hover:text-alchemist font-medium py-2">
              Workbooks
            </Link>
            <Link href="/entrepreneurial-dna-quiz" className="py-2">
              <Button variant="outline" className="w-full border-architect-indigo text-architect-indigo hover:bg-architect-indigo hover:text-white">
                Discover Your E-DNA
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}