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
  // Authentic Q19-Q22 validation questions from user's document
  return [
    {
      id: 'Q19',
      text: 'You\'re given a blank room and asked to design it however you want — no deadline, no instructions, just freedom. What do you naturally do first?',
      options: [
        { text: 'I stand in the space and feel what it needs. Then I begin placing things intuitively.', subtype: 'energetic-empath', insight: 'Energetic Empath — feels into spaces, acts through sensation' },
        { text: 'I imagine the finished look instantly, then begin collecting images or pieces to match the vision.', subtype: 'visionary-oracle', insight: 'Visionary Oracle — downloads the final vision and works backwards' },
        { text: 'I begin sketching it out in a step-by-step plan so I don\'t waste energy.', subtype: 'ultimate-alchemist', insight: 'Ultimate Alchemist — structures flow with internal precision' },
        { text: 'I overthink each decision and delay starting until I\'m sure it\'ll look right.', subtype: 'magnetic-perfectionist', insight: 'Magnetic Perfectionist — delays due to fear of imperfection' }
      ]
    },
    {
      id: 'Q20',
      text: 'Think back to your school years. How did you usually approach a long homework assignment?',
      options: [
        { text: 'I waited until inspiration hit, then worked in a creative sprint.', subtype: 'visionary-oracle', insight: 'Visionary Oracle — creative bursts, last-minute momentum' },
        { text: 'I wrote and rewrote sections until it was perfect — even if it was last minute.', subtype: 'magnetic-perfectionist', insight: 'Magnetic Perfectionist — perfection loops, emotional control' },
        { text: 'I mapped the sections, added energy when I felt aligned, and adjusted as I went.', subtype: 'ultimate-alchemist', insight: 'Ultimate Alchemist — adaptive logic-meets-flow structure' },
        { text: 'I needed to be alone, clear the space, and feel right before even beginning.', subtype: 'energetic-empath', insight: 'Energetic Empath — energetic prep required before action' }
      ]
    },
    {
      id: 'Q21',
      text: 'When asked to clean your room or organise your space as a child, what best describes your approach?',
      options: [
        { text: 'I did it in one big emotional burst — the chaos would build until I had to act.', subtype: 'visionary-oracle', insight: 'Visionary Oracle — energetic surges over consistency' },
        { text: 'I made a plan or system first, then tackled it piece by piece.', subtype: 'ultimate-alchemist', insight: 'Ultimate Alchemist — structured, system-led even in small tasks' },
        { text: 'I felt overwhelmed unless the mood or energy felt right.', subtype: 'energetic-empath', insight: 'Energetic Empath — needs emotional/environmental alignment' },
        { text: 'I cleaned while imagining how I wanted it to look when done — I needed to see it first.', subtype: 'magnetic-perfectionist', insight: 'Magnetic Perfectionist — vision-led, highly visual control' }
      ]
    },
    {
      id: 'Q22',
      text: 'You\'re learning a new skill (e.g., cooking, driving, drawing). Which learning pattern is most natural for you?',
      options: [
        { text: 'I research first, then repeat steps until it feels mastered.', subtype: 'magnetic-perfectionist', insight: 'Magnetic Perfectionist — emotional control through repetition' },
        { text: 'I learn by doing — I just start and fix mistakes as I go.', subtype: 'visionary-oracle', insight: 'Visionary Oracle — action-led, intuitive fixer' },
        { text: 'I learn when I feel connected to what I\'m doing — if the energy\'s off, I can\'t focus.', subtype: 'energetic-empath', insight: 'Energetic Empath — emotionally attuned learning rhythm' },
        { text: 'I see the end result in my head first, then I try to recreate it immediately.', subtype: 'ultimate-alchemist', insight: 'Ultimate Alchemist — blends vision + logic execution' }
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
      console.log('ValidationBlock: All questions answered, starting analysis');
      setIsAnalyzing(true);
      setTimeout(() => {
        console.log('ValidationBlock: Analysis complete, calling onComplete');
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