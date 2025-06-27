import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import QuizContainer from '@/components/quiz/QuizContainer';

export default function EntrepreneurialDnaQuiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [canTakeQuiz, setCanTakeQuiz] = useState<boolean | null>(null);

  // Check if user can take quiz (30-day restriction)
  useEffect(() => {
    const checkQuizEligibility = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          toast({
            title: "Authentication Required",
            description: "Please log in to take the quiz.",
            variant: "destructive"
          });
          setLocation('/auth');
          return;
        }

        const response = await apiRequest('GET', '/api/quiz/entrepreneurial-dna/eligibility');
        setCanTakeQuiz(response.canRetake);
        
        if (!response.canRetake) {
          toast({
            title: "Quiz Restriction",
            description: `You can retake the quiz on ${new Date(response.nextRetakeDate).toLocaleDateString()}`,
            variant: "destructive"
          });
          
          // Redirect to appropriate dashboard after delay
          setTimeout(() => {
            const accessTier = localStorage.getItem('accessTier') || 'entry';
            if (accessTier === 'entry') {
              setLocation('/entry');
            } else {
              setLocation('/student');
            }
          }, 3000);
        }
      } catch (error: any) {
        console.error('Quiz eligibility check failed:', error);
        setCanTakeQuiz(true); // Allow quiz if check fails
      }
    };

    checkQuizEligibility();
  }, [setLocation, toast]);

  // Show loading state while checking eligibility
  if (canTakeQuiz === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking quiz eligibility...</p>
        </div>
      </div>
    );
  }

  // Show restriction message if not eligible
  if (!canTakeQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-4">You can retake the Entrepreneurial DNA Quiz once every 30 days.</p>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the new quiz system
  return <QuizContainer />;
}