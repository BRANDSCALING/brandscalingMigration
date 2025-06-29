import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SubtypeType } from './QuizContainer';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    subtype: SubtypeType;
    insight: string;
  }[];
}

const getValidationQuestions = (subtype: SubtypeType): Question[] => {
  // Return the authentic Q19-Q22 validation questions from user's data
  return [
    {
      id: 'Q19',
      text: 'How often do you feel like your authentic self when leading?',
      options: [
        { text: 'Often - this feels mostly right', subtype: 'architect', insight: 'Strong alignment' },
        { text: 'Sometimes - depends on the situation', subtype: 'alchemist', insight: 'Good alignment' },
        { text: 'Rarely - I often feel like I\'m performing', subtype: 'blurred', insight: 'Moderate alignment' },
        { text: 'Never - I don\'t know who my authentic self is', subtype: 'neutral', insight: 'Low alignment' }
      ]
    },
    {
      id: 'Q20',
      text: 'When others describe your leadership style, do they see the real you?',
      options: [
        { text: 'Absolutely - they see the real me', subtype: 'architect', insight: 'Strong recognition' },
        { text: 'Mostly - with some adjustments for context', subtype: 'alchemist', insight: 'Good recognition' },
        { text: 'Sometimes - I adapt depending on who I\'m with', subtype: 'blurred', insight: 'Moderate recognition' },
        { text: 'Rarely - I feel like I\'m always adjusting', subtype: 'neutral', insight: 'Low recognition' }
      ]
    },
    {
      id: 'Q21',
      text: 'How connected do you feel to your natural operating style?',
      options: [
        { text: 'Very connected - I know how I naturally operate', subtype: 'architect', insight: 'Full authenticity' },
        { text: 'Somewhat connected - I\'m still figuring it out', subtype: 'alchemist', insight: 'Mostly authentic' },
        { text: 'Rarely - only in specific contexts', subtype: 'blurred', insight: 'Contextual suppression' },
        { text: 'Disconnected - I feel lost about my natural style', subtype: 'neutral', insight: 'Regular suppression' }
      ]
    },
    {
      id: 'Q22',
      text: 'When you think about your current business approach, how does it feel?',
      options: [
        { text: 'Fully aligned - this is exactly how I want to operate', subtype: 'architect', insight: 'Perfect alignment' },
        { text: 'Mostly aligned - minor adjustments needed', subtype: 'alchemist', insight: 'Good alignment' },
        { text: 'Somewhat misaligned - something feels off', subtype: 'blurred', insight: 'Moderate alignment' },
        { text: 'Completely misaligned - this doesn\'t feel like me', subtype: 'neutral', insight: 'Poor alignment' }
      ]
    }
  ];
};

interface Props {
  subtype: SubtypeType;
  onComplete: () => void;
  recordAnswer: (questionId: string, answer: string) => void;
}

const ValidationBlock: React.FC<Props> = ({ subtype, onComplete, recordAnswer }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const questions = getValidationQuestions(subtype);

  const handleAnswer = (answer: string, selectedOption: any) => {
    const questionId = questions[currentQuestion].id;
    recordAnswer(questionId, answer);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isAnalyzing) {
    return (
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Preparing your results…
          </h2>
          <p className="text-gray-600">Analyzing your responses</p>
        </div>
      </CardContent>
    );
  }

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
          Validating Your Profile
        </CardTitle>
        <div className="mb-4">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
            {questions[currentQuestion].text}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-6 text-left justify-start hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
                onClick={() => handleAnswer(option.text, option)}
              >
                <span className="text-base">{option.text}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default ValidationBlock;