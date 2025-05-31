import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Button } from "@/components/ui/button";

export default function DebugAuth() {
  const { userProfile, loading, logout } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Authentication</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="text-sm text-gray-900">{userProfile?.uid || 'Not found'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-sm text-gray-900">{userProfile?.email || 'Not found'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Role</label>
            <p className="text-sm font-bold text-red-600">{userProfile?.role || 'Not found'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Admin</label>
            <p className="text-sm text-gray-900">{userProfile?.role === 'admin' ? 'YES' : 'NO'}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Refresh Page
          </Button>
          
          <Button 
            onClick={logout} 
            variant="outline" 
            className="w-full"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}