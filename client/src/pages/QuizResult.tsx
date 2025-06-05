import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizResult {
  dominantType: string;
  percentages: {
    architect: number;
    alchemist: number;
    undeclared: number;
    blurredIdentity: number;
  };
}

export default function QuizResult() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const savedResult = localStorage.getItem('quizResult');
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing quiz result:', error);
        setLocation('/quiz');
      }
    } else {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Entrepreneurial DNA Profile
          </h1>
          <p className="text-lg text-gray-600">
            Here's your personality breakdown
          </p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-600">
              The {result.dominantType}
            </CardTitle>
            <p className="text-gray-600 mt-2">Your dominant entrepreneurial type</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Architect</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {result.percentages.architect}%
                </div>
                <p className="text-sm text-gray-600">Systematic, Strategic, Optimizing</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Alchemist</h3>
                <div className="text-3xl font-bold text-red-500 mb-1">
                  {result.percentages.alchemist}%
                </div>
                <p className="text-sm text-gray-600">Intuitive, Creative, Transformational</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Business Approach</h3>
              <p className="text-gray-700 leading-relaxed">
                Based on your responses, you demonstrate a balanced approach between systematic and intuitive thinking. 
                Your entrepreneurial style combines structured planning with creative flexibility.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <Button
                onClick={() => setLocation('/courses')}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                Explore Courses
              </Button>
              
              <div>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/quiz')}
                  className="text-sm"
                >
                  Retake Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}