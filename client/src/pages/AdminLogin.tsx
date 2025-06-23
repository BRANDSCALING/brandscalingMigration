import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocation, Link } from 'wouter';
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { BrandSection } from '@/components/BrandSystem';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { signIn, loading, error, userProfile, logout } = useFirebaseAuth();
  const { toast } = useToast();

  // Force logout when accessing admin login page
  useEffect(() => {
    const forceLogout = async () => {
      try {
        await logout();
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.log('Logout error:', error);
        localStorage.clear();
        sessionStorage.clear();
      }
    };
    
    if (userProfile) {
      forceLogout();
    }
  }, []);

  // Check if user is admin after successful login
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin') {
        setLocation('/admin');
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Admin credentials required.",
          variant: "destructive",
        });
        logout();
      }
    }
  }, [userProfile, setLocation, toast, logout]);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use direct admin login API
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid admin credentials');
      }

      const data = await response.json();
      
      // Store admin session
      localStorage.setItem('adminId', 'admin-dev-12345');
      localStorage.setItem('adminEmail', email);
      
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard."
      });
      
      // Redirect to admin dashboard
      setLocation('/admin');
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid admin credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to main site */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Brandscaling
        </Link>

        <BrandSection>
          <Card className="border-architect-indigo/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-xl gradient-architect w-fit">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-strategic-black">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Administrative access to Brandscaling platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-strategic-black font-medium">
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@brandscaling.com"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-strategic-black font-medium">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-architect"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
                </Button>

                {error && (
                  <div className="text-founder-red text-sm text-center">
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-strategic-black mb-2">
                    Admin Access Information
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Only authorized administrators can access this portal. Admin accounts are created internally and cannot be self-registered.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </BrandSection>
      </div>
    </div>
  );
}