import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ENTREPRENEURIAL_DNA_QUESTIONS, getDynamicSubtypeQuestions } from '@/../../shared/entrepreneurialDnaData';
import ResultsPage from '@/components/quiz/ResultsPage';
import AnalysisBlock from '@/components/quiz/AnalysisBlock';
import { DNAType, QuizState } from '@/components/quiz/QuizContainer';

export default function EntrepreneurialDnaQuiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [canTakeQuiz, setCanTakeQuiz] = useState<boolean | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisType, setAnalysisType] = useState<'awareness' | 'subtype' | 'validation'>('awareness');
  const [defaultDnaType, setDefaultDnaType] = useState<'architect' | 'alchemist' | 'blurred' | null>(null);
  const [dynamicQuestions, setDynamicQuestions] = useState(ENTREPRENEURIAL_DNA_QUESTIONS);
  const [quizState, setQuizState] = useState<QuizState>({
    currentStage: 'results',
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
      } catch (error) {
        console.error('Error checking quiz eligibility:', error);
        setCanTakeQuiz(true); // Allow quiz on error
      }
    };

    checkQuizEligibility();
  }, [setLocation, toast]);

  const handleAnswerSelect = (questionId: number, answerKey: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerKey
    }));
  };

  // Calculate DEFAULT DNA type from Q1-Q6 answers
  const calculateDefaultDnaType = (answersQ1ToQ6: Record<number, string>): 'architect' | 'alchemist' | 'blurred' => {
    let architectScore = 0;
    let alchemistScore = 0;

    for (let i = 1; i <= 6; i++) {
      const answer = answersQ1ToQ6[i];
      const question = dynamicQuestions.find(q => q.id === i);
      if (question && answer) {
        const answerData = question.answers[answer as keyof typeof question.answers];
        if (answerData.type === 'architect') {
          architectScore++;
        } else if (answerData.type === 'alchemist') {
          alchemistScore++;
        }
      }
    }

    // Apply exact scoring rule: 4+ = clear type, <4 either = Blurred Identity
    if (architectScore >= 4) return 'architect';
    if (alchemistScore >= 4) return 'alchemist';
    return 'blurred';
  };

  const handleNext = () => {
    // After Q6 - Calculate DEFAULT DNA and generate dynamic subtype questions
    if (currentQuestionIndex === 5) {
      const defaultType = calculateDefaultDnaType(answers);
      setDefaultDnaType(defaultType);
      
      // Generate dynamic subtype questions based on DEFAULT DNA type
      const subtypeQuestions = getDynamicSubtypeQuestions(defaultType);
      const baseQuestions = ENTREPRENEURIAL_DNA_QUESTIONS.slice(0, 6); // Q1-Q6
      const awarenessQuestions = ENTREPRENEURIAL_DNA_QUESTIONS.slice(8, 12); // Q9-Q12 (awareness)
      const pathChoiceQuestions = ENTREPRENEURIAL_DNA_QUESTIONS.slice(12, 18); // Q13-Q18 (path choice)
      const validationQuestions = ENTREPRENEURIAL_DNA_QUESTIONS.slice(18, 22); // Q19-Q22 (validation)
      
      // Combine: Q1-Q6 + Dynamic Subtype Q7-Q14 + Awareness Q15-Q18 + Path Choice Q19-Q24 + Validation Q25-Q28
      const newQuestionSet = [
        ...baseQuestions,
        ...subtypeQuestions, // Q7-Q14 (8 dynamic questions)
        ...awarenessQuestions, // Q15-Q18
        ...pathChoiceQuestions, // Q19-Q24
        ...validationQuestions // Q25-Q28
      ];
      
      setDynamicQuestions(newQuestionSet);
      setAnalysisType('awareness');
      setShowAnalysis(true);
      return;
    } else if (currentQuestionIndex === 13) { // After Q14 (subtype detection complete)
      setAnalysisType('subtype');
      setShowAnalysis(true);
      return;
    } else if (currentQuestionIndex === 17) { // After Q18 (awareness complete)
      setAnalysisType('validation');
      setShowAnalysis(true);
      return;
    }

    if (currentQuestionIndex < dynamicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions completed, calculate results
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = async () => {
    try {
      const quizData = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer
        }))
      };

      const result = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', quizData);
      
      setQuizState({
        currentStage: 'results',
        answers: answers,
        dnaType: result.dnaType,
        subtype: result.subtype,
        scores: result.scores,
        insights: result.insights
      });
      
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission Error",
        description: "Failed to calculate your results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnalysisContinue = () => {
    setShowAnalysis(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };



  // Show analysis screen
  if (showAnalysis) {
    return (
      <AnalysisBlock 
        stage={analysisType}
        onContinue={handleAnalysisContinue}
      />
    );
  }

  // Show loading state while checking eligibility
  if (canTakeQuiz === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking quiz eligibility...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show restriction message if user cannot take quiz
  if (!canTakeQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Quiz Restricted</CardTitle>
            <CardDescription className="text-center">
              You have already taken the Entrepreneurial DNA Quiz recently. 
              Please wait 30 days before retaking.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show results page if quiz is completed
  if (showResults) {
    return <ResultsPage quizState={quizState} />;
  }

  // Get current question
  const currentQuestion = dynamicQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / dynamicQuestions.length) * 100;
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Entrepreneurial DNA Quiz
            </h1>
            <p className="text-gray-600 mb-6">
              Discover your authentic entrepreneurial blueprint through 22 carefully crafted questions
            </p>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {ENTREPRENEURIAL_DNA_QUESTIONS.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(currentQuestion.answers).map(([key, answer]) => (
                  <button
                    key={key}
                    onClick={() => handleAnswerSelect(currentQuestion.id, key)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      currentAnswer === key
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        currentAnswer === key
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {currentAnswer === key && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{key}.</div>
                        <div className="text-gray-700">{answer.text}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {currentQuestionIndex === ENTREPRENEURIAL_DNA_QUESTIONS.length - 1 ? 'Complete Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}