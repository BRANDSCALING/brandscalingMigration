import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DNAType } from './QuizContainer';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    type: 'Architect' | 'Alchemist' | 'Blurred' | 'Neutral';
  }[];
}

import { ENTREPRENEURIAL_DNA_QUESTIONS } from '@/../../shared/entrepreneurialDnaData';

// Use only your authentic Q1-Q6 questions for default DNA detection
const questions: Question[] = ENTREPRENEURIAL_DNA_QUESTIONS.slice(0, 6).map(q => ({
  id: `Q${q.id}`,
  text: q.text,
  options: [
    { text: q.answers.A.text, type: q.answers.A.type === 'architect' ? 'Architect' : q.answers.A.type === 'alchemist' ? 'Alchemist' : q.answers.A.type === 'blurred' ? 'Blurred' : 'Neutral' },
    { text: q.answers.B.text, type: q.answers.B.type === 'architect' ? 'Architect' : q.answers.B.type === 'alchemist' ? 'Alchemist' : q.answers.B.type === 'blurred' ? 'Blurred' : 'Neutral' },
    { text: q.answers.C.text, type: q.answers.C.type === 'architect' ? 'Architect' : q.answers.C.type === 'alchemist' ? 'Alchemist' : q.answers.C.type === 'blurred' ? 'Blurred' : 'Neutral' },
    { text: q.answers.D.text, type: q.answers.D.type === 'architect' ? 'Architect' : q.answers.D.type === 'alchemist' ? 'Alchemist' : q.answers.D.type === 'blurred' ? 'Blurred' : 'Neutral' }
  ]
}));

interface Props {
  onComplete: (dna: DNAType) => void;
  recordAnswer: (questionId: string, answer: string) => void;
}

const DefaultDNABlock: React.FC<Props> = ({ onComplete, recordAnswer }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (option: { text: string; type: string }) => {
    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: option.type };
    setAnswers(newAnswers);
    recordAnswer(questionId, option.type);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        const dnaResult = calculateDNA(newAnswers);
        onComplete(dnaResult);
      }, 2000);
    }
  };

  const calculateDNA = (answers: Record<string, string>): DNAType => {
    const counts = { Architect: 0, Alchemist: 0 };
    
    Object.values(answers).forEach(answer => {
      if (answer === 'Architect') counts.Architect++;
      if (answer === 'Alchemist') counts.Alchemist++;
    });

    // 5-6 Architect answers → Default DNA = Architect
    if (counts.Architect >= 5) return 'Architect';
    // 5-6 Alchemist answers → Default DNA = Alchemist
    if (counts.Alchemist >= 5) return 'Alchemist';
    // 1-4 mixed → Default DNA = Blurred Identity
    return 'Blurred';
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isAnalyzing) {
    return (
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Analysing your Entrepreneurial DNA…
          </h2>
          <p className="text-gray-600">Processing your responses to determine your core DNA type</p>
        </div>
      </CardContent>
    );
  }

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
          Discovering Your Entrepreneurial DNA…
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
            🧭 {questions[currentQuestion].text}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-6 text-left justify-start hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
                onClick={() => handleAnswer(option)}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    option.type === 'Architect' ? 'bg-purple-500' :
                    option.type === 'Alchemist' ? 'bg-orange-500' :
                    option.type === 'Blurred' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-base">{option.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default DefaultDNABlock;