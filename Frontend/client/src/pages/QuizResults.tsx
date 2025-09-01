import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Brain, CheckCircle, Target, Zap, Star, Users } from 'lucide-react';
import { AUTHENTIC_DNA_PROFILES, getAuthenticProfileData } from '@/../../shared/authenticResultsData';

interface QuizResultsData {
  hasResult: boolean;
  dnaType?: string;
  subtype?: string;
  awarenessScore?: number;
  scores?: {
    architect?: number;
    alchemist?: number;
    blurred?: number;
  };
  completedAt?: string;
}

interface EligibilityData {
  canRetake: boolean;
  nextRetakeDate?: string;
}

export default function QuizResults() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    
    if (studentId && studentEmail) {
      setIsAuthenticated(true);
    } else {
      setLocation('/auth');
    }
  }, [setLocation]);

  const { data: quizResults, isLoading, error } = useQuery<QuizResultsData>({
    queryKey: ['/api/quiz/results'],
    enabled: isAuthenticated
  });

  const { data: eligibility } = useQuery<EligibilityData>({
    queryKey: ['/api/quiz/entrepreneurial-dna/eligibility'],
    enabled: isAuthenticated
  });

  const handleRetakeClick = () => {
    if (!eligibility || !eligibility.canRetake) {
      if (eligibility?.nextRetakeDate) {
        const nextDate = new Date(eligibility.nextRetakeDate).toLocaleDateString();
        alert(`You can retake the quiz again on ${nextDate} (30 days after your last attempt).`);
      } else {
        alert('You cannot retake the quiz at this time. Please wait 30 days from your last attempt.');
      }
      return;
    }
    setLocation('/entrepreneurial-dna-quiz');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your results...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !quizResults?.hasResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">No Results Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              You haven't taken the Entrepreneurial DNA Quiz yet.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setLocation('/entrepreneurial-dna-quiz')}>
                Take Quiz
              </Button>
              <Button variant="outline" onClick={() => setLocation('/student')}>
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileData = quizResults.subtype ? getAuthenticProfileData(quizResults.subtype) : null;

  const calculateOppositeAwareness = () => {
    if (quizResults.dnaType === 'architect') return 'Alchemist';
    if (quizResults.dnaType === 'alchemist') return 'Architect';
    return 'Opposite';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/student')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Entrepreneurial DNA Results</h1>
              <p className="text-gray-600 mt-1">
                {quizResults.subtype?.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') || 'Your DNA Profile'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Main Result Card */}
        <Card className="overflow-hidden border-0 shadow-2xl rounded-2xl">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 px-8 py-12 text-white relative">
            <div className="text-center space-y-8">
              
              {/* DNA Type Information - Attractive Boxes Layout */}
              <div className="w-full max-w-3xl mx-auto">
                {/* Header Row */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm font-medium opacity-80 mb-2">Default DNA</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                      <div className="text-xl font-bold">
                        {quizResults.dnaType?.charAt(0).toUpperCase() + quizResults.dnaType?.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium opacity-80 mb-2">Your Sub-DNA</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                      <div className="text-xl font-bold">
                        {quizResults.subtype ? 
                          quizResults.subtype.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ') : '—'
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium opacity-80 mb-2">Awareness of your opposite</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                      <div className="text-xl font-bold">{calculateOppositeAwareness()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assessment Progress */}
              <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-bold mb-4 text-center">Assessment Progress</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Initial DNA Detection Complete</span>
                      <span className="opacity-80">100%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Awareness of your opposite Complete</span>
                      <span className="opacity-80">100%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Subtype Analysis Complete</span>
                      <span className="opacity-80">100%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Energetic resonance quote */}
              {profileData && (
                <div className="mt-6">
                  <p className="text-xl italic font-light leading-relaxed">
                    "{profileData.snapshotLine}"
                  </p>
                </div>
              )}
              
            </div>
          </div>
        </Card>

        {/* Core DNA Profile */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Core DNA Profile
          </h3>
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Identity:</h4>
              <p className="text-purple-700">
                {profileData?.coreIdentity || 'Your core entrepreneurial identity and natural operating style.'}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Operating Style:</h4>
              <p className="text-blue-700">
                {profileData?.loopDescription || 'Your natural approach to business challenges and decision-making.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Your Edge */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Edge
          </h3>
          <div className="space-y-4">
            {profileData?.edges && profileData.edges.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Core Edges:</h4>
                <ul className="space-y-2">
                  {profileData.edges.map((edge, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {edge}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Risks & Blind Spots */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-red-600">Risks & Blind Spots</h3>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Key Insight:</h4>
            {profileData?.risks && profileData.risks.length > 0 ? (
              <ul className="space-y-2">
                {profileData.risks.map((risk, index) => (
                  <li key={index} className="text-red-700 flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-700">
                Your challenges aren't weaknesses — they're signals for growth. Understanding these patterns helps you build sustainable systems.
              </p>
            )}
          </div>
        </Card>

        {/* Next Steps */}
        {quizResults.dnaType === 'blurred' && (
          <Card className="p-6 bg-gradient-to-br from-red-50 to-purple-50 border-2 border-red-200">
            <h3 className="text-xl font-bold mb-4 text-red-800">Recommended Next Step</h3>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">7-Day Identity Reset Challenge</h4>
              <p className="text-gray-700 mb-4">
                Transform from "blurred" identity to authentic clarity through our comprehensive 7-day program.
              </p>
              <Button 
                onClick={() => setLocation('/7-day-reset')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Start 7-Day Reset
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/student')} variant="outline">
            Back to Dashboard
          </Button>
          <Button 
            onClick={handleRetakeClick}
            disabled={!eligibility || !eligibility.canRetake}
            className={(!eligibility || !eligibility.canRetake) ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {(!eligibility || !eligibility.canRetake) ? 'Retake Available in 30 Days' : 'Retake Assessment'}
          </Button>
        </div>

      </div>
    </div>
  );
}