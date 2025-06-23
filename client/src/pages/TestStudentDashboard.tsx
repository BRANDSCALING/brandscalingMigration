import React from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function TestStudentDashboard() {
  const { userProfile } = useFirebaseAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Welcome to your dashboard!</h2>
            <div className="text-sm text-gray-500">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Test Mode</span>
            </div>
          </div>
          
          {userProfile ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Role:</strong> {userProfile.role}</p>
              <p><strong>DNA Type:</strong> {userProfile.dominantType || 'Not assessed'}</p>
              <p><strong>Access Tier:</strong> {userProfile.accessTier || 'beginner'}</p>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">AI Advisors</h3>
              <p className="text-blue-600 mb-3">Chat with your personalized AI business advisors</p>
              <button 
                onClick={() => window.location.href = '/ai-agents'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Access AI Advisors
              </button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Courses</h3>
              <p className="text-green-600 mb-3">Access your learning materials</p>
              <button 
                onClick={() => window.location.href = '/courses'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                View Courses
              </button>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Smart Business Builder</h3>
              <p className="text-purple-600 mb-3">AI-powered business model generation</p>
              <button 
                onClick={() => window.location.href = '/smart-business-builder'}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Build Business Model
              </button>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">DNA Assessment</h3>
              <p className="text-yellow-600 mb-3">Discover your entrepreneurial DNA type</p>
              <button 
                onClick={() => window.location.href = '/entrepreneurial-dna-quiz'}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Take Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}