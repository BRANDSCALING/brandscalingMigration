import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import DefaultDNABlock from '@/components/quiz/DefaultDNABlock';
import AwarenessBlock from '@/components/quiz/AwarenessBlock';
import PathChoiceBlock from '@/components/quiz/PathChoiceBlock';
import SubtypeBlock from '@/components/quiz/SubtypeBlock';
import ValidationBlock from '@/components/quiz/ValidationBlock';
import ResultsPage from '@/components/quiz/ResultsPage';
import { DNAType, PathType, SubtypeType, QuizState } from '@/components/quiz/QuizContainer';

export default function EntrepreneurialDnaQuiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [canTakeQuiz, setCanTakeQuiz] = useState<boolean | null>(null);
  const [currentStage, setCurrentStage] = useState<string>('defaultDNA');
  const [quizState, setQuizState] = useState<QuizState>({
    currentStage: 'defaultDNA',
    answers: {},
  });

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

  // Handler functions for each stage
  const recordAnswer = (questionId: string, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
  };

  const handleDefaultDNAComplete = (dnaType: DNAType) => {
    setQuizState(prev => ({
      ...prev,
      dnaType,
      defaultDNA: dnaType,
      currentStage: 'awareness'
    }));
    setCurrentStage('awareness');
  };

  const handleAwarenessComplete = (awarenessScore: number) => {
    setQuizState(prev => ({
      ...prev,
      awarenessScore,
      currentStage: 'pathChoice'
    }));
    setCurrentStage('pathChoice');
  };

  const handlePathChoiceComplete = (pathType: PathType) => {
    setQuizState(prev => ({
      ...prev,
      pathType,
      currentStage: 'subtype'
    }));
    setCurrentStage('subtype');
  };

  const handleSubtypeComplete = (subtype: SubtypeType, subtypeProgress: number) => {
    setQuizState(prev => ({
      ...prev,
      subtype,
      subtypeProgress,
      currentStage: 'validation'
    }));
    setCurrentStage('validation');
  };

  const handleValidationComplete = () => {
    setQuizState(prev => ({
      ...prev,
      currentStage: 'results'
    }));
    setCurrentStage('results');
  };

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

  // Render appropriate stage based on current stage
  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'defaultDNA':
        return (
          <DefaultDNABlock
            onComplete={handleDefaultDNAComplete}
            recordAnswer={recordAnswer}
          />
        );
      case 'awareness':
        return (
          <AwarenessBlock
            defaultDNA={quizState.dnaType!}
            onComplete={handleAwarenessComplete}
            recordAnswer={recordAnswer}
          />
        );
      case 'pathChoice':
        return (
          <PathChoiceBlock
            onComplete={handlePathChoiceComplete}
          />
        );
      case 'subtype':
        return (
          <SubtypeBlock
            defaultDNA={quizState.dnaType!}
            pathChoice={quizState.pathType!}
            onComplete={handleSubtypeComplete}
            recordAnswer={recordAnswer}
          />
        );
      case 'validation':
        return (
          <ValidationBlock
            subtype={quizState.subtype!}
            onComplete={handleValidationComplete}
            recordAnswer={recordAnswer}
          />
        );
      case 'results':
        return (
          <ResultsPage
            quizState={quizState}
          />
        );
      default:
        return (
          <DefaultDNABlock
            onComplete={handleDefaultDNAComplete}
            recordAnswer={recordAnswer}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderCurrentStage()}
        </div>
      </div>
    </div>
  );
}