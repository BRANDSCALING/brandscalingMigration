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

  // Progress steps with authentic completion states
  const progressSteps = [
    { label: 'Initial DNA Detection Complete', percentage: 100 },
    { label: 'Awareness of your opposite Complete', percentage: 100 },
    { label: 'Subtype Analysis Complete', percentage: 100 }
  ];

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
  const actualDnaType = quizState.defaultDNA || defaultDNA;
  
  console.log('Using subtype for profile data:', actualSubtype);
  console.log('Using DNA type:', actualDnaType);
  
  // Calculate opposite DNA type for awareness section
  const calculateOppositeAwareness = () => {
    if (actualDnaType === 'Architect') return 'Alchemist';
    if (actualDnaType === 'Alchemist') return 'Architect';
    return '—'; // Blurred types don't have a clear opposite
  };
  
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
      const accessTier = 'beginner'; // Default for now
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

        {/* Progress Steps */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Assessment Progress</h3>
          <div className="space-y-6">
            {progressSteps.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{step.label}</span>
                  <span className="text-sm text-gray-500">{step.percentage}%</span>
                </div>
                <Progress value={step.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Default DNA Section */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Your Default DNA
          </h3>
          <p className="text-gray-700 mb-4">
            Processing your DNA analysis...
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
                {profileData?.loopDescription || AUTHENTIC_DNA_LOOPS[defaultDNA || 'Blurred'] || 'Processing your loop pattern...'}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-medium text-blue-800 mb-2">Loop Mastery Reminder:</p>
              <p className="text-blue-700">
                You don't evolve by switching loops — you evolve by deepening your own until it 
                becomes powerful, repeatable, and precise.
              </p>
            </div>
          </div>
        </Card>

        {/* Subtype Section */}
        {actualSubtype && profileData && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Your Subtype: {actualSubtype}
            </h3>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="font-medium text-yellow-800 mb-2">Snapshot Line:</p>
                <p className="text-yellow-700 italic">"{profileData.snapshotLine}"</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Subtype Mastery</span>
                  <span className="text-sm text-gray-500">{profileData.subtypeMastery}%</span>
                </div>
                <Progress value={profileData.subtypeMastery} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Subtype Snapshot:</h4>
                <ul className="space-y-2">
                  {profileData.subtypeSnapshot.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Core Profile */}
        {subtype && profileData && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Core Identity</h3>
            <p className="text-gray-700 leading-relaxed">
              {profileData.coreIdentity}
            </p>
          </Card>
        )}

        {/* Opposite Mode Awareness */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Opposite Mode Awareness</h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Opposite Mode Awareness</span>
              <span className="text-sm text-gray-500">{profileData?.oppositeAwareness || 50}%</span>
            </div>
            <Progress value={profileData?.oppositeAwareness || 50} className="h-2" />
          </div>
          
          <p className="text-gray-700 mb-4">
            {profileData?.oppositeDescription || "Developing awareness of complementary operating styles and how they enhance your natural strengths."}
          </p>
        </Card>

        {/* Your Edge */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Edge
          </h3>
          <ul className="space-y-2">
            {(profileData?.edges || []).map((edge, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{edge}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Risks & Blind Spots */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-red-700">Risks & Blind Spots</h3>
          <ul className="space-y-2">
            {(profileData?.risks || []).map((risk, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{risk}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="font-medium text-red-800 mb-2">Key Insight:</p>
            <p className="text-red-700">Your challenges aren't weaknesses — they're signals for growth.</p>
            <p className="text-red-700">Understanding these patterns helps you build sustainable systems.</p>
          </div>
        </Card>

        {/* What You Need Next */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">What You Need Next</h3>
          <ul className="space-y-2">
            {(profileData?.whatYouNeed || []).map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* CTA Section */}
        {profileData && (
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="text-xl font-bold mb-4">{profileData.ctaTitle}</h3>
            <div className="space-y-4">
              <p className="text-gray-700">{profileData.conclusionLine}</p>
              <p className="text-gray-700">{profileData.ctaText}</p>
            </div>
          </Card>
        )}

        {/* Complementary Subtype */}
        {profileData && profileData.complementarySubtype !== 'Identity Reset Required' && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Best Complementary Opposite Subtype</h3>
            <p className="font-medium mb-4">Best Support: {profileData.complementarySubtype}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Where You Struggle | They Lead With</h4>
                <div className="space-y-2 text-sm">
                  {profileData.complementaryTable.whereYouStruggle.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-1">
                      <span>{item.challenge}</span>
                      <span>{item.theirStrength}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Where They Struggle | You Lead With</h4>
                <div className="space-y-2 text-sm">
                  {profileData.complementaryTable.whereTheyStruggle.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-1">
                      <span>{item.challenge}</span>
                      <span>{item.yourStrength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-gray-700 italic">
              "Together? You build what sparks *and* scales."
            </p>
          </Card>
        )}

        {/* Final Empowerment */}
        {profileData && (
          <Card className="p-6 bg-gradient-to-r from-purple-100 to-indigo-100">
            <h3 className="text-xl font-bold mb-4">Final Empowerment Remark</h3>
            <div className="space-y-3">
              <p className="text-gray-700">{profileData.finalRemark}</p>
            </div>
          </Card>
        )}

        {/* Milestone Tracker */}
        {profileData && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Milestone Tracker
            </h3>
            
            <div className="space-y-4">
              {profileData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{milestone.name}</p>
                  </div>
                  <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                    {milestone.status === 'completed' ? 'Complete' : 'Locked'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Blurred Identity Special Section */}
        {defaultDNA === 'Blurred' && (
          <Card className="p-6 bg-red-50 border-2 border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4">7-Day Identity Reset</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">Identity Clarity Emergency</h4>
                <p className="text-sm">
                  You're entering the 7-Day Identity Reset — a structured path to help you find your default DNA.
                  This isn't about guessing your type. It's about experiencing both Architect and Alchemist rhythms — and seeing what finally feels like home.
                </p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white mt-4">
              Start 7-Day Identity Reset
            </Button>
          </Card>
        )}

        {/* Action Button */}
        <div className="text-center py-8">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
            onClick={() => {
              const accessTier = localStorage.getItem('accessTier') || 'entry';
              if (accessTier === 'entry') {
                setLocation('/entry');
              } else {
                setLocation('/student');
              }
            }}
          >
            Continue Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;