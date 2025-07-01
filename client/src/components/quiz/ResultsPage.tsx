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
    // Get authentication details from localStorage
    const studentId = localStorage.getItem('studentId');
    const accessTier = localStorage.getItem('accessTier');
    const authToken = localStorage.getItem('authToken');
    
    console.log('Dashboard redirect - Auth check:', { studentId, accessTier, hasToken: !!authToken });
    
    if (studentId && authToken) {
      // Valid authentication - redirect based on access tier
      if (accessTier === 'entry') {
        console.log('Redirecting to entry dashboard');
        setLocation('/entry');
      } else {
        console.log('Redirecting to student dashboard');
        setLocation('/student');
      }
    } else {
      // No valid authentication - redirect to auth page
      console.log('No valid auth - redirecting to sign in');
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
        {/* Main Result Card - Redesigned with Boxes and Assessment Progress */}
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
                      <div className="text-xl font-bold">{actualDnaType || 'Processing...'}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium opacity-80 mb-2">Your Sub-DNA</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                      <div className="text-xl font-bold">{actualSubtype || '—'}</div>
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
              
              {/* Assessment Progress - Integrated into First Panel */}
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

        {/* Evolution Path */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Evolution Path
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Evolution Goal:</h4>
              <p className="text-green-700">
                {actualDnaType ? getEvolutionPath(actualDnaType) : 'Integrated Entrepreneur'} - Mastery of your natural operating system while building awareness of complementary approaches.
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Next Milestone:</h4>
              <p className="text-yellow-700">
                Deepen your default loop mastery while developing strategic awareness of opposite-mode thinking patterns.
              </p>
            </div>
          </div>
        </Card>

        {/* Mastery Levels */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            Mastery Levels
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Loop Mastery</span>
                <span className="text-sm text-gray-500">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">Your natural operating loop efficiency</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Opposite Awareness</span>
                <span className="text-sm text-gray-500">{profileData?.oppositeAwareness || 50}%</span>
              </div>
              <Progress value={profileData?.oppositeAwareness || 50} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">Understanding of complementary approaches</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Integration Potential</span>
                <span className="text-sm text-gray-500">{Math.round((75 + (profileData?.oppositeAwareness || 50)) / 2)}%</span>
              </div>
              <Progress value={Math.round((75 + (profileData?.oppositeAwareness || 50)) / 2)} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">Capacity for balanced decision-making</p>
            </div>
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