import { Link } from "wouter";
import { User, LogOut, Settings } from "lucide-react";
import brandscalingLogo from "@assets/FullLogo.png";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { isAuthenticated, userProfile, logout } = useFirebaseAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      window.location.href = '/';
    }
  };

  const getDashboardLink = () => {
    if (userProfile?.role === 'admin') return '/admin';
    if (userProfile?.role === 'student') return '/student';
    return '/auth';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <img 
                src={brandscalingLogo} 
                alt="Brandscaling" 
                className="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-gray-900 font-medium">
              Courses
            </Link>
            <Link href="/ai-agents" className="text-gray-700 hover:text-gray-900 font-medium">
              AI Advisors
            </Link>
            <Link href="/workbooks" className="text-gray-700 hover:text-gray-900 font-medium">
              Workbooks
            </Link>
            <Link href="/smart-business-builder" className="text-gray-700 hover:text-gray-900 font-medium">
              Smart Business Builder
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-gray-900 font-medium">
              Community
            </Link>
            <Link href="/collab" className="text-gray-700 hover:text-gray-900 font-medium">
              Collaboration Club
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact Us
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 font-medium">
              Blog
            </Link>
            <Link href="/entrepreneurial-dna-quiz" className="text-gray-700 hover:text-gray-900 font-medium">
              What's Your E-DNA?
            </Link>
          </nav>

          {/* User Icon - Goes to appropriate dashboard */}
          <div className="flex items-center">
            <Link href={getDashboardLink()} className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-gray-900 font-medium">
              Courses
            </Link>
            <Link href="/ai-agents" className="text-gray-700 hover:text-gray-900 font-medium">
              AI Advisors
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-gray-900 font-medium">
              Community
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact Us
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 font-medium">
              Blog
            </Link>
            <Link href="/entrepreneurial-dna-quiz" className="text-gray-700 hover:text-gray-900 font-medium">
              What's Your E-DNA?
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}