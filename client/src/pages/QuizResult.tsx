import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DnaType = 'Architect' | 'Alchemist' | 'Undeclared' | 'Blurred Identity';

const dnaTypeConfig = {
  'Architect': {
    color: '#42047D',
    icon: '🧱',
    // NEED INPUT - Add real summary content for Architect type
    summary: '// NEED INPUT - Add real content about the Architect entrepreneurial DNA type'
  },
  'Alchemist': {
    color: '#F6782F',
    icon: '🔮',
    // NEED INPUT - Add real summary content for Alchemist type
    summary: '// NEED INPUT - Add real content about the Alchemist entrepreneurial DNA type'
  },
  'Undeclared': {
    color: '#8E8E8E',
    icon: '🌫',
    // NEED INPUT - Add real summary content for Undeclared type
    summary: '// NEED INPUT - Add real content about the Undeclared entrepreneurial DNA type'
  },
  'Blurred Identity': {
    color: '#C72170',
    icon: '⚖️',
    // NEED INPUT - Add real summary content for Blurred Identity type
    summary: '// NEED INPUT - Add real content about the Blurred Identity entrepreneurial DNA type'
  }
};

export default function QuizResult() {
  const [result, setResult] = useState<DnaType | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const savedResult = localStorage.getItem('quizResult') as DnaType | null;
    if (savedResult && Object.keys(dnaTypeConfig).includes(savedResult)) {
      setResult(savedResult);
    } else {
      // Redirect to quiz if no result found
      setLocation('/quiz');
    }
  }, [setLocation]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading your results...</p>
        </div>
      </div>
    );
  }

  const config = dnaTypeConfig[result];

  const handleViewResources = () => {
    setLocation(`/courses?dna=${result}`);
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: config.color }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{config.icon}</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            You are the {result}
          </h1>
          <p className="text-xl text-white/90">
            Your Entrepreneurial DNA Results
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Understanding Your {result} DNA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg leading-relaxed">
              {config.summary}
            </div>
            
            <div className="text-center pt-6">
              <Button
                onClick={handleViewResources}
                size="lg"
                className="text-lg px-8 py-3"
                style={{ backgroundColor: config.color }}
              >
                View Tailored Resources
              </Button>
            </div>
            
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/quiz')}
                className="text-sm"
              >
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}