import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      // Use direct student login API
      const response = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }

      const data = await response.json();
      
      // Store student session
      localStorage.setItem('studentId', data.student.id);
      localStorage.setItem('studentEmail', data.student.email);
      
      // Check if user has already completed the quiz
      try {
        const quizResponse = await fetch('/api/quiz/results', {
          headers: {
            'x-student-id': data.student.id,
            'x-student-email': data.student.email
          }
        });
        
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          
          if (quizData.hasResult) {
            // User has completed quiz, redirect to dashboard
            toast({
              title: "Welcome Back!",
              description: "Redirecting to your student dashboard."
            });
            setLocation('/student');
          } else {
            // User hasn't completed quiz, redirect to quiz
            toast({
              title: "Welcome Back!",
              description: "Let's complete your Entrepreneurial DNA Quiz."
            });
            setLocation('/entrepreneurial-dna-quiz');
          }
        } else {
          // If quiz check fails, default to quiz
          toast({
            title: "Welcome Back!",
            description: "Redirecting to your Entrepreneurial DNA Quiz."
          });
          setLocation('/entrepreneurial-dna-quiz');
        }
      } catch (quizError) {
        // If quiz check fails, default to quiz
        toast({
          title: "Welcome Back!",
          description: "Redirecting to your Entrepreneurial DNA Quiz."
        });
        setLocation('/entrepreneurial-dna-quiz');
      }
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
      // Use direct student signup API
      const response = await fetch('/api/auth/student-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signUpEmail, password: signUpPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      
      // Store student session
      localStorage.setItem('studentId', data.user.id);
      localStorage.setItem('studentEmail', data.user.email);
      
      toast({
        title: "Student Account Created!",
        description: "Welcome to Brandscaling. Let's discover your Entrepreneurial DNA!"
      });
      
      // Redirect directly to quiz after signup
      setLocation('/entrepreneurial-dna-quiz');
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
              <div className="space-y-6">
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
              </div>

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
