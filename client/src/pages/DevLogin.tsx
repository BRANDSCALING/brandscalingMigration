import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function DevLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dev/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Admin User Created",
          description: "Test admin user has been created successfully.",
        });
        
        // Store the admin user ID in localStorage for development
        localStorage.setItem('devAdminId', result.user.id);
        
        // Redirect to admin panel
        window.location.href = '/admin';
      } else {
        throw new Error('Failed to create admin user');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: "Failed to create admin user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = () => {
    // For development: simulate admin login
    localStorage.setItem('devAdminId', 'admin-dev-12345');
    localStorage.setItem('devAdminEmail', 'admin@brandscaling.com');
    localStorage.setItem('devAdminRole', 'admin');
    
    toast({
      title: "Development Login",
      description: "Logged in as admin user for development.",
    });
    
    // Redirect to admin panel
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Development Login</CardTitle>
          <CardDescription className="text-center">
            Access admin panel for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Development Actions</Label>
            <p className="text-sm text-muted-foreground">
              Use these options to access the admin panel during development.
            </p>
          </div>
          
          <Button 
            onClick={createAdminUser} 
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? "Creating..." : "Create Admin User"}
          </Button>
          
          <Button 
            onClick={loginAsAdmin}
            className="w-full"
          >
            Login as Admin
          </Button>
          
          <div className="text-center">
            <Button variant="link" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}