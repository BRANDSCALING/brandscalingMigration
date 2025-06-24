import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ArrowRight, RotateCcw } from 'lucide-react';
import { ENTREPRENEURIAL_DNA_QUESTIONS, DNA_SUBTYPES } from '@shared/entrepreneurialDnaData';

// Fallback questions if import fails
const QUIZ_QUESTIONS = ENTREPRENEURIAL_DNA_QUESTIONS;
import DnaResultDisplay from '@/components/DnaResultDisplay';

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

  useEffect(() => {
    checkRetakeEligibility();
  }, []);

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

    if (currentQuestion < 12) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const data = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
        answers
      });
      setResult(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Quiz submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
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

  const getResultContent = (type: string, awarenessPercentage: number) => {
    const templates = {
      'Architect': {
        title: 'The Architect',
        description: 'You are a systems thinker who builds scalable, sustainable businesses through strategic planning and execution.',
        strengths: ['Strategic Planning', 'Systems Thinking', 'Execution Excellence', 'Scalable Solutions'],
        growth: 'Your awareness of Alchemist traits will help you connect more deeply with customers and inspire your team.'
      },
      'Alchemist': {
        title: 'The Alchemist',
        description: 'You are a relationship builder who creates transformation through emotional connection and intuitive leadership.',
        strengths: ['Relationship Building', 'Intuitive Leadership', 'Customer Connection', 'Transformational Impact'],
        growth: 'Your awareness of Architect traits will help you build more robust systems and sustainable growth.'
      },
      'Blurred Identity': {
        title: 'The Blurred Identity',
        description: 'You have a unique blend of traits that allows you to adapt and excel in various entrepreneurial situations.',
        strengths: ['Adaptability', 'Versatile Thinking', 'Situational Leadership', 'Multi-faceted Approach'],
        growth: 'Focus on developing your strongest traits while maintaining your adaptive flexibility.'
      }
    };

    return templates[type as keyof typeof templates] || templates['Blurred Identity'];
  };

  if (!user) {
    return <div>Please log in to take the quiz.</div>;
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
            <Button onClick={() => setLocation('/dashboard')} className="w-full">
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

  if (showResults && result) {
    const content = getResultContent(result.defaultType, result.awarenessPercentage);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-indigo-600 mb-2">{content.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  Your Entrepreneurial DNA™ Results
                </p>
                <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                  {content.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Default Type</h3>
                  <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{result.defaultType}</span>
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
                      <span className="text-green-600 font-bold">{result.awarenessPercentage}%</span>
                    </div>
                    <Progress value={result.awarenessPercentage} className="h-3" />
                  </div>
                </div>
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

              <div className="text-center space-y-4">
                <Button 
                  onClick={() => setLocation('/courses')} 
                  size="lg"
                  className="mr-4"
                >
                  Explore Your Learning Path
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/dashboard')}
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = ENTREPRENEURIAL_DNA_QUESTIONS[currentQuestion - 1];
  const progress = (currentQuestion / 12) * 100;
  const canProceed = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Entrepreneurial DNA Quiz™</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion} of 12
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6 leading-relaxed">
              {currentQ?.text}
            </h2>

            <div className="space-y-4 mb-8">
              {Object.entries(currentQ.answers).map(([key, answerObj]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(currentQuestion, key as 'A' | 'B' | 'C' | 'D')}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:border-indigo-300 ${
                    answers[currentQuestion] === key
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="font-medium text-indigo-600 mr-3">{key}.</span>
                  {answerObj.text}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => currentQuestion > 1 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : currentQuestion === 12 ? (
                  'Complete Quiz'
                ) : (
                  'Next'
                )}
                {currentQuestion < 12 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}