import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

type AnswerType = 'Architect' | 'Alchemist' | 'Undeclared' | 'Blurred Identity';

interface Question {
  id: number;
  text: string;
  options: { value: AnswerType; label: string; icon: string }[];
}

// ADD REAL QUESTIONS HERE - This is the structure for the 12 questions
const questions: Question[] = [
  {
    id: 1,
    text: "// NEED INPUT - Add real question text here",
    options: [
      { value: 'Architect', label: 'Architect', icon: '🧱' },
      { value: 'Alchemist', label: 'Alchemist', icon: '🔮' },
      { value: 'Undeclared', label: 'Undeclared', icon: '🌫' },
      { value: 'Blurred Identity', label: 'Blurred Identity', icon: '⚖️' }
    ]
  },
  // NEED INPUT - Add 11 more questions with the same structure
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleAnswer = (value: AnswerType) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = (): AnswerType => {
    const counts = {
      'Architect': 0,
      'Alchemist': 0,
      'Undeclared': 0,
      'Blurred Identity': 0
    };

    Object.values(answers).forEach(answer => {
      counts[answer]++;
    });

    const maxCount = Math.max(...Object.values(counts));
    const dominantTypes = Object.entries(counts)
      .filter(([, count]) => count === maxCount)
      .map(([type]) => type as AnswerType);

    return dominantTypes[0];
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = calculateResult();
      
      // Save to localStorage
      localStorage.setItem('dnaQuizResult', result);
      
      // Submit to backend
      if (user) {
        await apiRequest('POST', '/api/quiz/submit', { result });
      }
      
      // Redirect to result page
      setLocation('/quiz/result');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Entrepreneurial DNA Quiz
          </h1>
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestionData.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={(value) => handleAnswer(value as AnswerType)}
            >
              {currentQuestionData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value}
                  />
                  <Label 
                    htmlFor={option.value}
                    className="flex items-center space-x-2 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={!selectedAnswer || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!selectedAnswer}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}