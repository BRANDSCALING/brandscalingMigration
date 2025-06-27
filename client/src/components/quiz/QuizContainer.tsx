import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export type DNAType = 'Architect' | 'Alchemist' | 'Blurred' | 'Neutral';
export type PathType = 'Early' | 'Developed';
export type SubtypeType = string;

export interface QuizState {
  currentStage: string;
  answers: Record<string, string>;
  dnaType?: DNAType;
  pathType?: PathType;
  subtype?: SubtypeType;
  defaultDNA?: DNAType;
  awarenessScore?: number;
  subtypeProgress?: number;
}

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    type: DNAType;
  }[];
}

const questions: Question[] = [
  {
    id: 'Q1',
    text: "You're going away for the weekend. How do you prepare the night before?",
    options: [
      { text: 'I mentally run through what I need and pack once — essentials are covered.', type: 'Architect' },
      { text: 'I write a full list, check everything off, repack a few times, still feel uneasy.', type: 'Blurred' },
      { text: "I throw things in last minute and trust it'll be fine.", type: 'Alchemist' },
      { text: 'I pack, unpack, and get overwhelmed deciding what I even need.', type: 'Blurred' }
    ]
  },
  {
    id: 'Q2',
    text: 'A close friend unintentionally hurts your feelings. How do you respond?',
    options: [
      { text: 'I address it directly but kindly, focusing on moving forward together.', type: 'Architect' },
      { text: 'I overthink it endlessly, unsure whether to say something or let it go.', type: 'Blurred' },
      { text: 'I trust our connection and let it naturally resolve without making it heavy.', type: 'Alchemist' },
      { text: 'I withdraw and wait for them to notice, hoping they will figure it out.', type: 'Blurred' }
    ]
  },
  {
    id: 'Q3',
    text: 'Your business idea gets criticized by someone you respect. What happens next?',
    options: [
      { text: 'I evaluate their feedback objectively and adjust my plan if it makes sense.', type: 'Architect' },
      { text: 'I feel deflated and question everything, losing confidence in my direction.', type: 'Blurred' },
      { text: 'I listen for any wisdom but stay connected to my inner knowing.', type: 'Alchemist' },
      { text: 'I get defensive initially but then spiral into self-doubt later.', type: 'Blurred' }
    ]
  },
  {
    id: 'Q4',
    text: 'When making an important decision, what do you rely on most?',
    options: [
      { text: 'I gather data, weigh pros and cons, and choose the most logical path.', type: 'Architect' },
      { text: 'I go back and forth constantly, seeking endless opinions and validation.', type: 'Blurred' },
      { text: 'I tune into what feels right and trust my intuition to guide me.', type: 'Alchemist' },
      { text: 'I get paralyzed by all the options and often delay deciding.', type: 'Blurred' }
    ]
  },
  {
    id: 'Q5',
    text: 'How do you handle unexpected challenges in your business?',
    options: [
      { text: 'I break it down into steps and systematically work through solutions.', type: 'Architect' },
      { text: 'I panic initially, then exhaust myself trying to fix everything at once.', type: 'Blurred' },
      { text: 'I stay calm and trust that the right solution will emerge as I move forward.', type: 'Alchemist' },
      { text: 'I get overwhelmed and often procrastinate or avoid dealing with it.', type: 'Blurred' }
    ]
  },
  {
    id: 'Q6',
    text: 'What drives you most in your entrepreneurial journey?',
    options: [
      { text: 'Building efficient systems and achieving measurable, sustainable growth.', type: 'Architect' },
      { text: 'Proving myself worthy and avoiding the fear of failure or judgment.', type: 'Blurred' },
      { text: 'Creating meaningful impact and following my passion and purpose.', type: 'Alchemist' },
      { text: 'Trying to meet everyone else expectations while losing sight of my own.', type: 'Blurred' }
    ]
  }
];

const QuizContainer = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (optionType: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionType };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit quiz
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
        answers: finalAnswers
      });

      toast({
        title: "Quiz Complete!",
        description: `Your DNA type is: ${response.defaultType}`,
      });

      // Redirect to appropriate dashboard after delay
      setTimeout(() => {
        const accessTier = localStorage.getItem('accessTier') || 'beginner';
        if (accessTier === 'entry') {
          setLocation('/entry');
        } else {
          setLocation('/student');
        }
      }, 5000);

    } catch (error) {
      console.error('Quiz submission error:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Your Results...</h2>
          <p className="text-gray-600">Discovering your Entrepreneurial DNA type</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            ENTREPRENEURIAL DNA QUIZ™
          </h1>
          <p className="text-gray-600">Discover your unique entrepreneurial blueprint</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <Progress value={progress} className="w-full mt-4" />
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-6 h-auto text-left justify-start hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                  onClick={() => handleAnswer(option.type)}
                >
                  <span className="text-sm leading-relaxed">{option.text}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              Choose the response that feels most natural to you
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizContainer;