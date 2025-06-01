import { useState } from 'react';
import { Link, useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Button } from "@/components/ui/button";
import { Settings, Users, BarChart, Bell } from "lucide-react";
import brandscalingLogo from "@assets/FullLogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutConfirmation from "@/components/LogoutConfirmation";

export default function AdminHeader() {
  const [location] = useLocation();
  const { userProfile } = useFirebaseAuth();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: BarChart },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
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
                <span className="text-sm text-slate-500 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Admin Panel
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
                          ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
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
                      <AvatarImage src={userProfile?.profileImageUrl || ""} alt="Admin avatar" />
                      <AvatarFallback>
                        {userProfile?.firstName?.[0] || userProfile?.email?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-slate-900">
                        {userProfile?.firstName || userProfile?.email?.split("@")[0] || "Admin"}
                      </p>
                      <p className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        Administrator
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">System Settings</Link>
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