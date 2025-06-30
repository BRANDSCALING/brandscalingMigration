import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { QuizState } from './QuizContainer';
import { AUTHENTIC_DNA_PROFILES, AUTHENTIC_DNA_LOOPS, getAuthenticProfileData } from '@/../../shared/authenticResultsData';
import { CheckCircle, Clock, Lightbulb, Target, Zap, Users, Brain, Star } from 'lucide-react';

interface Props {
  quizState: QuizState;
}

const ResultsPage: React.FC<Props> = ({ quizState }) => {
  const { defaultDNA, awarenessScore, subtype, subtypeProgress } = quizState;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Helper functions from authentic document
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

  // Debug logging to see what data is being received
  useEffect(() => {
    console.log('ResultsPage received quizState:', quizState);
    console.log('DNA Type:', defaultDNA);
    console.log('Subtype:', subtype);
    console.log('Awareness Score:', awarenessScore);
  }, [quizState, defaultDNA, subtype, awarenessScore]);

  // Store quiz results in localStorage for dashboard access
  useEffect(() => {
    if (quizState.dnaType && quizState.subtype) {
      localStorage.setItem('quizResult', JSON.stringify({
        type: quizState.dnaType,
        subtype: quizState.subtype,
        awarenessScore: quizState.awarenessScore || awarenessScore,
        subtypeProgress,
        timestamp: new Date().toISOString()
      }));
    }
  }, [quizState, awarenessScore, subtypeProgress]);

  // Get authentic profile data - ensure we're using the correct subtype
  const actualSubtype = quizState.subtype || subtype;
  const actualDnaType = quizState.dnaType || defaultDNA;
  
  console.log('Using subtype for profile data:', actualSubtype);
  console.log('Using DNA type:', actualDnaType);
  
  // Calculate opposite DNA type for awareness section
  const calculateOppositeAwareness = () => {
    if (actualDnaType === 'Architect') return 'Alchemist';
    if (actualDnaType === 'Alchemist') return 'Architect';
    return 'Opposite';
  };

  const awarenessLevel = getAwarenessLevel(awarenessScore || 0);
  const oppositeType = calculateOppositeAwareness();
  
  const profileData = actualSubtype ? getAuthenticProfileData(actualSubtype) : null;
  
  // Force re-render when quiz state changes
  const [renderKey, setRenderKey] = React.useState(0);
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [quizState]);

  const handleDashboardRedirect = () => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      // Check access tier to determine redirect
      const accessTier = localStorage.getItem('accessTier') || 'student';
      if (accessTier === 'entry') {
        setLocation('/entry');
      } else {
        setLocation('/student');
      }
    } else {
      setLocation('/auth');
    }
  };

  return (
    <div key={renderKey} className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Entrepreneurial DNA Results</h1>
          <p className="text-gray-600 mt-1">{actualSubtype || 'Your DNA Profile'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Main Result Card - Authentic Design */}
        <Card className="overflow-hidden border-0 shadow-2xl rounded-2xl">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 px-8 py-12 text-white relative">
            <div className="text-center space-y-6">
              {/* DNA Type Information - table-like layout */}
              <div className="w-full max-w-2xl mx-auto">
                {/* Header Row */}
                <div className="grid grid-cols-3 gap-4 text-sm font-medium opacity-80 mb-3">
                  <div className="text-center">Default DNA</div>
                  <div className="text-center">Your Sub-DNA</div>
                  <div className="text-center">Awareness of your opposite</div>
                </div>
                
                {/* Separator */}
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center text-white/60">|</div>
                  <div className="text-center text-white/60">|</div>
                  <div className="text-center text-white/60">|</div>
                </div>
                
                {/* Values Row */}
                <div className="grid grid-cols-3 gap-4 text-lg font-semibold">
                  <div className="text-center">{actualDnaType || 'Processing...'}</div>
                  <div className="text-center">{actualSubtype || '—'}</div>
                  <div className="text-center">{calculateOppositeAwareness()}</div>
                </div>
              </div>
              
              {/* Energetic resonance quote without title */}
              {profileData && (
                <div className="mt-8">
                  <p className="text-xl italic font-light leading-relaxed">
                    "{profileData.snapshotLine}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Assessment Progress */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Assessment Progress</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Initial DNA Detection Complete</span>
                <span className="text-sm text-gray-500">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Awareness of your opposite Complete</span>
                <span className="text-sm text-gray-500">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Subtype Analysis Complete</span>
                <span className="text-sm text-gray-500">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Default DNA Section */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Your Default DNA
          </h3>
          <p className="text-gray-700 mb-4">
            {profileData?.coreIdentity || 'Loading your DNA profile...'}
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Default Mastery</span>
                <span className="text-sm text-gray-500">{profileData?.defaultMastery || 80}%</span>
              </div>
              <Progress value={profileData?.defaultMastery || 80} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Natural Loop of Action */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Your Natural Loop of Action
          </h3>
          
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Loop Format: {profileData?.loopFormat || 'Processing...'}</h4>
              <p className="text-gray-700">
                {profileData?.loopDescription || 'Loading your authentic loop pattern...'}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-medium text-blue-800 mb-2">Loop Mastery Reminder:</p>
              <p className="text-blue-700">
                You don't evolve by switching loops — you evolve by deepening your own until it becomes powerful, repeatable, and precise.
              </p>
            </div>
          </div>
        </Card>

        {/* Opposite Mode Awareness */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Opposite Mode Awareness</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Opposite Mode Awareness</span>
                <span className="text-sm text-gray-500">{profileData?.oppositeAwareness || 50}%</span>
              </div>
              <Progress value={profileData?.oppositeAwareness || 50} className="h-2" />
            </div>
            <p className="text-gray-700">
              {profileData?.oppositeDescription || 'Developing awareness of complementary operating styles and how they enhance your natural strengths.'}
            </p>
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

        {/* What You Need Next */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">What You Need Next</h3>
          <div className="space-y-4">
            {profileData?.whatYouNeed && profileData.whatYouNeed.length > 0 && (
              <ul className="space-y-2">
                {profileData.whatYouNeed.map((item, index) => (
                  <li key={index} className="text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* Continue Your Journey Button */}
        <div className="text-center py-8">
          <Button 
            onClick={handleDashboardRedirect}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-lg"
          >
            Continue Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;