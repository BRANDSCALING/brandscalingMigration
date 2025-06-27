import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { QuizState } from './QuizContainer';

interface Props {
  quizState: QuizState;
}

const ResultsPage: React.FC<Props> = ({ quizState }) => {
  const { defaultDNA, awarenessScore, subtype, subtypeProgress } = quizState;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Submit quiz results to backend and handle redirect
  useEffect(() => {
    const submitQuizResults = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          toast({
            title: "Authentication Error",
            description: "Please log in to save results.",
            variant: "destructive"
          });
          setLocation('/auth');
          return;
        }

        // Submit comprehensive quiz results
        await apiRequest('POST', '/api/quiz/submit', {
          quizId: 1,
          answers: quizState.answers,
          result: {
            defaultDNA,
            awarenessScore,
            pathChoice: quizState.pathChoice,
            subtype,
            subtypeProgress
          },
          score: awarenessScore
        });

        // Store result for immediate access
        localStorage.setItem('quizResult', JSON.stringify({
          type: defaultDNA?.toLowerCase(),
          subtype,
          awarenessScore,
          subtypeProgress,
          timestamp: new Date().toISOString()
        }));

        toast({
          title: "Results Saved!",
          description: "Your Entrepreneurial DNA analysis is complete.",
        });

        // Auto-redirect after 5 seconds
        setTimeout(() => {
          const accessTier = localStorage.getItem('accessTier') || 'entry';
          if (accessTier === 'entry') {
            setLocation('/entry');
          } else {
            setLocation('/student');
          }
        }, 5000);

      } catch (error: any) {
        console.error('Quiz submission error:', error);
        toast({
          title: "Submission Failed",
          description: error.message || "Failed to save results.",
          variant: "destructive"
        });
      }
    };

    submitQuizResults();
  }, [quizState, setLocation, toast, defaultDNA, awarenessScore, subtype, subtypeProgress]);

  const getAwarenessLevel = (score: number) => {
    if (score === 6) return 70;
    if (score === 5) return 60;
    if (score === 4) return 50;
    if (score === 3) return 40;
    if (score === 2) return 30;
    return 20;
  };

  const getSubtypeIcon = (subtype: string) => {
    if (subtype?.includes('Strategist') || subtype?.includes('Builder') || subtype?.includes('Analyzer')) return '🧠';
    if (subtype?.includes('Oracle') || subtype?.includes('Perfectionist') || subtype?.includes('Empath') || subtype?.includes('Alchemist')) return '✨';
    return '🔄';
  };

  const getEvolutionPath = (dnaType: string) => {
    if (dnaType === 'Architect') return 'Ultimate Architect';
    if (dnaType === 'Alchemist') return 'Ultimate Alchemist';
    return 'Integrated Entrepreneur';
  };

  const awarenessLevel = getAwarenessLevel(awarenessScore);
  const oppositeType = defaultDNA === 'Architect' ? 'Alchemist' : 
                      defaultDNA === 'Alchemist' ? 'Architect' : 'Opposite';

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Your Entrepreneurial DNA Results
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Default DNA Result */}
        <Card className="border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Your Default DNA</h3>
              <div className={`px-4 py-2 rounded-full text-white font-semibold ${
                defaultDNA === 'Architect' ? 'bg-purple-500' :
                defaultDNA === 'Alchemist' ? 'bg-orange-500' : 'bg-red-500'
              }`}>
                {defaultDNA}
              </div>
            </div>
            <p className="text-gray-600">
              {defaultDNA === 'Architect' && 'You operate through logic, systems, and structured thinking.'}
              {defaultDNA === 'Alchemist' && 'You operate through intuition, vision, and transformational energy.'}
              {defaultDNA === 'Blurred' && 'You show characteristics of both types and may benefit from clarity work.'}
            </p>
          </CardContent>
        </Card>

        {/* Awareness Level */}
        <Card className="border-2 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Awareness of {oppositeType} Mode
            </h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Awareness Level</span>
                <span className="text-lg font-bold">{awarenessLevel}%</span>
              </div>
              <Progress value={awarenessLevel} className="w-full h-3" />
            </div>
            <p className="text-gray-600">
              {awarenessLevel >= 60 && 'Exceptional understanding of your opposite operating system.'}
              {awarenessLevel >= 40 && awarenessLevel < 60 && 'Good awareness with room for deeper understanding.'}
              {awarenessLevel < 40 && 'Limited awareness - exploring this could unlock new capabilities.'}
            </p>
          </CardContent>
        </Card>

        {/* Subtype */}
        <Card className="border-2 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{getSubtypeIcon(subtype || '')}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Your Subtype</h3>
                <p className="text-lg font-semibold text-green-600">{subtype}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Subtype Progress</span>
                <span className="text-lg font-bold">{subtypeProgress}%</span>
              </div>
              <Progress value={subtypeProgress} className="w-full h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Evolution Path */}
        <Card className="border-2 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Evolution Path</h3>
            <div className="text-center">
              <p className="text-lg mb-4">Grow into the <strong>{getEvolutionPath(defaultDNA || '')}</strong></p>
              {subtypeProgress >= 90 ? (
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Unlock Advanced Track
                </Button>
              ) : (
                <Button variant="outline">
                  Continue Development Journey
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blurred Identity Special Section */}
        {defaultDNA === 'Blurred' && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-red-800 mb-4">7-Day Identity Reset</h3>
              <p className="text-red-700 mb-4">
                Discover your true entrepreneurial identity with our focused clarity program.
              </p>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Start Identity Reset
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Redirect Notice */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Redirecting to Your Dashboard
            </h3>
            <p className="text-blue-700 mb-4">
              You'll be automatically redirected to your personalized dashboard in 5 seconds.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                const accessTier = localStorage.getItem('accessTier') || 'entry';
                if (accessTier === 'entry') {
                  setLocation('/entry');
                } else {
                  setLocation('/student');
                }
              }}
            >
              Access Dashboard Now
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-6">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retake Quiz
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            Get Full Report
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default ResultsPage;