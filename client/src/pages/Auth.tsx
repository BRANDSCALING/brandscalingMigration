import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocation, Link } from 'wouter';
import { Eye, EyeOff, ArrowLeft, GraduationCap, UserPlus } from 'lucide-react';
import { BrandSection } from '@/components/BrandSystem';

export default function Auth() {
  const [, setLocation] = useLocation();
  const { signUp, signIn, signInWithGoogle, loading, error, userProfile, logout } = useFirebaseAuth();
  const { toast } = useToast();

  // Force logout when accessing auth page
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
  
  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInEmail || !signInPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = await signIn(signInEmail, signInPassword);
      if (user && user.role === 'admin') {
        toast({
          title: "Admin Access Required",
          description: "Redirecting to admin login portal...",
        });
        logout();
        setLocation('/admin-login');
        return;
      }
      
      toast({
        title: "Welcome Back!",
        description: "Logged into your student dashboard."
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid student credentials.",
        variant: "destructive"
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpEmail || !signUpPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (signUpPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (signUpPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      await signUp(signUpEmail, signUpPassword);
      toast({
        title: "Student Account Created!",
        description: "Welcome to Brandscaling. Redirecting to your dashboard..."
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to create student account.",
        variant: "destructive"
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google."
      });
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully."
      });
      // Force a page reload to clear all state
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
      // Force logout even if there's an error
      window.location.href = '/';
    }
  };

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin') {
        toast({
          title: "Admin Access",
          description: "Please use the admin login portal.",
          variant: "destructive",
        });
        logout();
        setLocation('/admin-login');
      } else {
        setLocation('/student');
        toast({
          title: "Welcome back!",
          description: "You've been logged into your student dashboard.",
        });
      }
    }
  }, [userProfile, setLocation, toast, logout]);

  // If user is already logged in, show loading
  if (userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scale-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to main site */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Brandscaling
        </Link>

        <BrandSection>
          <Card className="border-scale-orange/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-xl gradient-alchemist w-fit">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-strategic-black">
                Student Portal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Access your personalized learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Join Platform</TabsTrigger>
                </TabsList>

              <TabsContent value="signin" className="space-y-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-strategic-black font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password" className="text-strategic-black font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
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
                  <Button type="submit" className="w-full btn-alchemist" disabled={loading}>
                    {loading ? 'Signing in...' : 'Access Learning Dashboard'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <UserPlus className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">
                        Student Registration
                      </h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Create your account to access personalized learning paths based on your Entrepreneurial DNA.
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email" className="text-strategic-black font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-strategic-black font-medium">
                      Create Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Create a secure password"
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
                  <div>
                    <Label htmlFor="confirm-password" className="text-strategic-black font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full btn-alchemist" disabled={loading}>
                    {loading ? 'Creating account...' : 'Join Brandscaling Platform'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Looking for admin access?
                </p>
                <Link href="/admin-login">
                  <Button variant="outline" size="sm" className="border-architect-indigo text-architect-indigo hover:bg-architect-indigo hover:text-white">
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        </BrandSection>
      </div>
    </div>
  );
}
