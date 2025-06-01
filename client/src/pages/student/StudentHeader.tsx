import { useState } from 'react';
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { BookOpen, FileText, Bell, GraduationCap } from "lucide-react";
import brandscalingLogo from "@assets/FullLogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutConfirmation from "@/components/LogoutConfirmation";

export default function StudentHeader() {
  const { userProfile } = useFirebaseAuth();
  const [location] = useLocation();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const navItems = [
    { href: "/student", label: "Dashboard", icon: GraduationCap },
    { href: "/student/courses", label: "My Courses", icon: BookOpen },
    { href: "/student/workbooks", label: "Workbooks", icon: FileText },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutConfirmation(true);
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <button onClick={handleLogoClick} className="flex items-center">
                <img 
                  src={brandscalingLogo} 
                  alt="Brandscaling" 
                  className="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                />
              </button>
              <div className="hidden md:block">
                <span className="text-sm text-slate-500 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Student Portal
                </span>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={location === item.href ? "default" : "ghost"}
                      className={
                        location === item.href
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <Bell className="w-4 h-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 h-auto p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={userProfile?.profileImageUrl || ""} alt="Student avatar" />
                      <AvatarFallback>
                        {userProfile?.firstName?.[0] || userProfile?.email?.[0] || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-slate-900">
                        {userProfile?.firstName || userProfile?.email?.split("@")[0] || "Student"}
                      </p>
                      <p className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        Student
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/student/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/student/progress">My Progress</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirmation(true)}
                    className="text-red-600"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <LogoutConfirmation 
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
      />
    </>
  );
}