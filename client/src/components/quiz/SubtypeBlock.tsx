import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DNAType, PathType, SubtypeType } from './QuizContainer';
import { ENTREPRENEURIAL_DNA_QUESTIONS } from '@/../../shared/entrepreneurialDnaData';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    subtype: SubtypeType;
  }[];
}

const getSubtypeQuestions = (defaultDNA: DNAType, pathChoice: PathType): Question[] => {
  // Get authentic Q7-Q12 subtype questions from shared data
  const subtypeQuestions = ENTREPRENEURIAL_DNA_QUESTIONS.filter(q => q.category === 'subtype');
  
  return subtypeQuestions.map(q => ({
    id: `Q${q.id}`,
    text: q.text,
    options: [
      { text: q.answers.A.text, subtype: 'master-strategist' },
      { text: q.answers.B.text, subtype: 'systemised-builder' },
      { text: q.answers.C.text, subtype: 'internal-analyzer' },
      { text: q.answers.D.text, subtype: 'ultimate-strategist' }
    ]
  }));
};

interface SubtypeBlockProps {
  defaultDNA: DNAType;
  pathChoice: PathType;
  onComplete: (subtype: SubtypeType, subtypeProgress: number) => void;
  recordAnswer: (questionId: string, answer: string) => void;
}

const SubtypeBlock: React.FC<SubtypeBlockProps> = ({ 
  defaultDNA, 
  pathChoice, 
  onComplete, 
  recordAnswer 
}) => {
  const questions = getSubtypeQuestions(defaultDNA, pathChoice);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SubtypeType>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (subtype: SubtypeType, answerText: string) => {
    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: subtype };
    setAnswers(newAnswers);
    recordAnswer(questionId, answerText);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        // Calculate dominant subtype
        const subtypeCounts: Record<SubtypeType, number> = {
          'master-strategist': 0,
          'systemised-builder': 0,
          'internal-analyzer': 0,
          'ultimate-strategist': 0,
          'visionary-oracle': 0,
          'magnetic-perfectionist': 0,
          'energetic-empath': 0,
          'ultimate-alchemist': 0,
          'overthinker': 0,
          'performer': 0,
          'self-forsaker': 0,
          'self-betrayer': 0
        };

        Object.values(newAnswers).forEach(subtype => {
          subtypeCounts[subtype]++;
        });

        const dominantSubtype = Object.entries(subtypeCounts).reduce((a, b) => 
          subtypeCounts[a[0] as SubtypeType] > subtypeCounts[b[0] as SubtypeType] ? a : b
        )[0] as SubtypeType;

        const subtypeProgress = Math.round((Object.values(newAnswers).length / questions.length) * 100);
        onComplete(dominantSubtype, subtypeProgress);
      }, 2000);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Analyzing Your Subtype</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing your responses...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-2">Subtype Assessment</CardTitle>
        <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
        <Progress value={progress} className="mt-4" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6">{currentQ.text}</h3>
        </div>

        <div className="grid gap-4">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-left p-6 h-auto whitespace-normal hover:bg-purple-50 hover:border-purple-300 transition-colors"
              onClick={() => handleAnswer(option.subtype, option.text)}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default SubtypeBlock;