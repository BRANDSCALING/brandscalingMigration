import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import brandscalingLogo from '@assets/FullLogo.png';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { userProfile, logout } = useFirebaseAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleLogoClick = () => {
    setShowLogoutDialog(true);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Sidebar Menu Button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Center - Logo and Title */}
            <div className="flex items-center justify-center flex-1">
              {/* Logo - always centered */}
              <button
                onClick={handleLogoClick}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img 
                  src={brandscalingLogo} 
                  alt="Brandscaling" 
                  className="h-10 w-auto"
                />
              </button>
              
              {/* Title - only on mobile */}
              <div className="md:hidden ml-3">
                <span className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Brandscaling Admin
                </span>
              </div>
            </div>

            {/* Right - User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.profileImageUrl || ""} alt="Admin avatar" />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {userProfile?.displayName?.[0] || userProfile?.email?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-24">
                        {userProfile?.displayName || userProfile?.email?.split("@")[0] || "Admin"}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">
                        Administrator
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of the admin panel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}