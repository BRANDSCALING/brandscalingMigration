import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { ENTREPRENEURIAL_DNA_QUESTIONS, DNA_SUBTYPES } from '@shared/entrepreneurialDnaData';

// Fallback questions if import fails
const QUIZ_QUESTIONS = ENTREPRENEURIAL_DNA_QUESTIONS;

interface Question {
  id: number;
  text: string;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

// Function to get result content based on DNA type
const getResultContent = (type: string, awarenessPercentage: number) => {
  switch (type) {
    case 'Architect':
      return {
        title: 'The Architect',
        description: 'You approach business with systematic thinking, strategic planning, and structured execution. You excel at building frameworks, analyzing data, and creating scalable systems.',
        strengths: [
          'Strategic planning and analysis',
          'Systems thinking and optimization',
          'Data-driven decision making',
          'Process improvement and scalability'
        ],
        growth: 'Consider developing your intuitive side and emotional intelligence to better connect with customers and team members.'
      };
    case 'Alchemist':
      return {
        title: 'The Alchemist',
        description: 'You bring intuitive creativity, emotional intelligence, and innovative problem-solving to business. You excel at seeing opportunities others miss and inspiring transformational change.',
        strengths: [
          'Creative problem solving',
          'Emotional intelligence and empathy',
          'Innovation and opportunity recognition',
          'Inspirational leadership'
        ],
        growth: 'Focus on developing systematic approaches and analytical frameworks to scale your creative insights effectively.'
      };
    case 'Blurred Identity':
      return {
        title: 'Blurred Identity',
        description: 'Your entrepreneurial approach combines elements of both Architect and Alchemist, or you may benefit from further self-discovery to clarify your dominant operating style.',
        strengths: [
          'Balanced perspective on business challenges',
          'Adaptability in different situations',
          'Potential for versatile leadership',
          'Comprehensive understanding of business needs'
        ],
        growth: 'Consider taking time to identify which approach feels most natural to you in high-pressure situations.'
      };
    default:
      return {
        title: 'Entrepreneurial DNA',
        description: 'Your unique entrepreneurial profile has been identified. Continue exploring your strengths and growth areas.',
        strengths: ['Leadership potential', 'Business acumen', 'Problem-solving abilities'],
        growth: 'Continue developing your entrepreneurial skills through practice and learning.'
      };
  }
};

interface QuizResult {
  defaultType: 'Architect' | 'Alchemist' | 'Blurred Identity';
  subtype: string;
  awarenessPercentage: number;
  canRetake: boolean;
  nextRetakeDate?: string;
}

export default function EntrepreneurialDnaQuiz() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retakeInfo, setRetakeInfo] = useState<{ canRetake: boolean; nextRetakeDate?: string } | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Quiz state changed:', {
      isProcessing,
      showResults,
      result,
      isSubmitting,
      currentQuestion,
      answersCount: Object.keys(answers).length
    });
  }, [isProcessing, showResults, result, isSubmitting, currentQuestion, answers]);

  useEffect(() => {
    // Check if user is logged in first
    if (!user) {
      // Check localStorage for student authentication
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        setLocation('/#pricing');
        return;
      }
    }
    checkRetakeEligibility();
  }, [user]);

  const checkRetakeEligibility = async () => {
    setIsCheckingEligibility(true);
    try {
      const data = await apiRequest('GET', '/api/quiz/entrepreneurial-dna/eligibility');
      if (!data.canRetake) {
        setRetakeInfo({
          canRetake: false,
          nextRetakeDate: data.nextRetakeDate
        });
      }
    } catch (error) {
      console.error('Error checking retake eligibility:', error);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleAnswer = (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = async () => {
    const answer = answers[currentQuestion];
    if (!answer) return;

    if (currentQuestion < QUIZ_QUESTIONS.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    setIsProcessing(true);
    console.log('Starting quiz submission...');
    console.log('Current answers:', answers);
    console.log('Answer count:', Object.keys(answers).length);
    
    try {
      const data = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
        answers
      });
      console.log('Quiz submission successful:', data);
      
      // Ensure all required fields are present
      const processedResult = {
        defaultType: data.defaultType || 'Blurred Identity',
        subtype: data.subtype || '',
        awarenessPercentage: data.awarenessPercentage || 85,
        canRetake: data.canRetake || false,
        nextRetakeDate: data.nextRetakeDate || null
      };
      
      console.log('Processed result:', processedResult);
      
      // Use setTimeout to ensure state updates happen after current render cycle
      setTimeout(() => {
        setIsProcessing(false);
        setIsSubmitting(false);
        setResult(processedResult);
        setShowResults(true);
        setQuizCompleted(true);
        console.log('States updated - showing results');
        
        // Auto-redirect to appropriate dashboard after showing results
        setTimeout(() => {
          redirectToDashboard();
        }, 5000); // 5 second delay to show results
      }, 100); // Small delay to ensure proper state transition
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setIsProcessing(false);
      setIsSubmitting(false);
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Quiz submission failed: ${errorMessage}`);
    }
  };

  const redirectToDashboard = async () => {
    // Check user's access tier from localStorage or API
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      try {
        // Fetch user data to determine access tier
        const userData = await apiRequest('GET', '/api/auth/user');
        if (userData && userData.accessTier) {
          // Route based on access tier
          if (userData.accessTier === 'beginner' || userData.accessTier === 'entry') {
            setLocation('/entry');
          } else if (userData.role === 'admin') {
            setLocation('/admin');
          } else {
            setLocation('/student');
          }
        } else {
          // Default to entry dashboard for students without specific tier
          setLocation('/entry');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Default to entry dashboard on error
        setLocation('/entry');
      }
    } else {
      setLocation('/auth');
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setShowResults(false);
    setResult(null);
    setRetakeInfo(null);
  };

  const getDaysUntilRetake = (nextRetakeDate: string) => {
    const now = new Date();
    const retakeDate = new Date(nextRetakeDate);
    const diffTime = retakeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Check authentication from localStorage if useAuth doesn't find user
  const studentId = localStorage.getItem('studentId');
  const studentEmail = localStorage.getItem('studentEmail');
  
  if (!user && !studentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please sign in to access the Entrepreneurial DNA Quiz.
            </p>
            <Button onClick={() => setLocation('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show results if we have them and not processing
  if (result && !isProcessing && !isCheckingEligibility) {
    console.log('Showing quiz results:', result);
    
    const resultData = result;
    const content = getResultContent(resultData.defaultType, resultData.awarenessPercentage);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h1 className="text-3xl font-bold mb-2">Your Entrepreneurial DNA Results</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover your unique business building approach
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Default Type</h3>
                  <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{resultData.defaultType}</span>
                      <span className="text-indigo-600 font-bold">PRIMARY</span>
                    </div>
                    <Progress value={100} className="h-3" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Opposite Type Awareness</h3>
                  <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Awareness Level</span>
                      <span className="text-green-600 font-bold">{resultData.awarenessPercentage}%</span>
                    </div>
                    <Progress value={resultData.awarenessPercentage} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-600 mb-2">{content.title}</h2>
                <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                  {content.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Strengths</h3>
                  <ul className="space-y-2">
                    {content.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Growth Opportunity</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {content.growth}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={redirectToDashboard} size="lg" className="px-8">
                  Access Your Dashboard
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Redirecting to your dashboard in 5 seconds...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (retakeInfo && !retakeInfo.canRetake) {
    const daysLeft = retakeInfo.nextRetakeDate ? getDaysUntilRetake(retakeInfo.nextRetakeDate) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <RotateCcw className="h-16 w-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Quiz Recently Completed</h2>
              <p className="text-gray-600 dark:text-gray-400">
                You can retake the Entrepreneurial DNA Quiz™ in {daysLeft} days.
              </p>
            </div>
            <Button onClick={redirectToDashboard} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Processing Your DNA...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing your entrepreneurial patterns
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCheckingEligibility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Checking Eligibility...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Verifying quiz access
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main quiz interface
  const currentQ = ENTREPRENEURIAL_DNA_QUESTIONS[currentQuestion - 1];
  const progress = (currentQuestion / QUIZ_QUESTIONS.length) * 100;
  const canProceed = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Entrepreneurial DNA Quiz™</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion} of {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6 leading-relaxed">
              {currentQ.text}
            </h2>

            <div className="space-y-4">
              {Object.entries(currentQ.answers).map(([key, answer]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(currentQuestion, key as 'A' | 'B' | 'C' | 'D')}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === key
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="font-medium text-indigo-600 mr-3">{key}.</span>
                    <span>{answer.text}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                disabled={currentQuestion === 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentQuestion === QUIZ_QUESTIONS.length ? (
                  'Complete Quiz'
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}