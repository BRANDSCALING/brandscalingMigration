import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { User, BookOpen, Home, LogOut } from 'lucide-react';

export function StudentHeader() {
  const [location] = useLocation();

  const logout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEmail');
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="text-2xl font-bold text-primary">Brandscaling</div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/student">
              <Button
                variant={location === '/student' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link href="/student/courses">
              <Button
                variant={location.startsWith('/student/course') ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Courses
              </Button>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {localStorage.getItem('studentEmail') || 'Student'}
            </div>
            
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}