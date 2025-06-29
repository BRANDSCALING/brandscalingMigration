import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { QuizState } from './QuizContainer';
import { PROFILE_DESCRIPTIONS, DNA_LOOP_DESCRIPTIONS } from './ProfileData';
import { CheckCircle, Clock, Lightbulb, Target, Zap, Users, Brain, Star } from 'lucide-react';

interface Props {
  quizState: QuizState;
}

const ResultsPageNew: React.FC<Props> = ({ quizState }) => {
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

        // Submit comprehensive quiz results to correct endpoint
        await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
          answers: quizState.answers
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
          description: "Your quiz results have been saved to your profile."
        });

      } catch (error: any) {
        console.error('Error submitting quiz results:', error);
        toast({
          title: "Save Failed",
          description: "Could not save results. Please try again.",
          variant: "destructive"
        });
      }
    };

    submitQuizResults();
  }, [quizState, toast, setLocation]);

  const getProfileData = (subtype: string) => {
    return PROFILE_DESCRIPTIONS[subtype] || {
      snapshotLine: "You channel what has never been seen before.",
      snapshot: ["You operate in unique patterns", "You lead with intuitive clarity"],
      longDescription: "Your entrepreneurial style is uniquely yours.",
      edge: ["Original thinking", "Unique perspective"],
      risks: ["Isolation", "Misunderstanding"]
    };
  };

  const getAwarenessLevel = (score: number) => {
    return Math.min(Math.max(score * 10, 30), 100);
  };

  const getEvolutionPath = (dnaType: string) => {
    return dnaType === 'Architect' ? 'Ultimate Architect' : 
           dnaType === 'Alchemist' ? 'Ultimate Alchemist' : 'Balanced Entrepreneur';
  };

  const oppositeType = defaultDNA === 'Architect' ? 'Alchemist' : 
                      defaultDNA === 'Alchemist' ? 'Architect' : 'Opposite';

  const milestones = [
    { name: "Finishing without burnout", status: "completed" },
    { name: "Energy-first project planning", status: "completed" },
    { name: "Aligned systems that mirror your rhythm", status: "completed" },
    { name: "Delegation without disruption", status: "in-progress" },
    { name: "Rhythmic recovery integration", status: "in-progress" },
    { name: "Protecting vision through collaboration", status: "in-progress" }
  ];

  const edges = [
    "Wildly original visions no one else can see",
    "Rapid-fire downloads that spark entirely new systems",
    "Intuitive understanding of future customer needs",
    "Emotional resonance that makes ideas feel alive",
    "Creative magnetism that attracts collaborators"
  ];

  const risks = [
    "Stalling after the idea surge fades",
    "Overwhelm from trying to build alone",
    "Emotional burnout from systems that feel restrictive",
    "Perfection paralysis if the execution doesn't match the vision",
    "Withdrawing when misunderstood or rushed"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Entrepreneurial DNA Results</h1>
          <p className="text-gray-600 mt-1">{subtype || 'Your DNA Profile'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Main Result Card */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-xl">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <Brain className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold">Your Entrepreneurial DNA Result</h2>
            <div className="space-y-2">
              <p className="text-xl opacity-90">Your Default DNA: {defaultDNA || 'Processing...'}</p>
              {subtype && defaultDNA !== 'Blurred' && <p className="text-2xl font-bold">Your Sub-DNA: {subtype}</p>}
            </div>
            {subtype && defaultDNA !== 'Blurred' && (
              <div className="bg-white/10 rounded-lg p-4 mt-6">
                <p className="text-lg font-medium mb-2">1-line energetic resonance:</p>
                <p className="text-xl italic">"{getProfileData(subtype).snapshotLine || 'You channel what has never been seen before.'}"</p>
              </div>
            )}
          </div>
        </Card>

        {/* Default DNA Section */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Your Default DNA
          </h3>
          <p className="text-gray-700 mb-4">
            {defaultDNA === 'Alchemist' ? (
              'You lead with emotional clarity. You feel first, then think. Your actions are driven by energetic resonance, not by deadlines or pressure. Your rhythm is non-linear — you move in bursts of inspiration, not mechanical steps. Productivity flows when alignment is high and pressure is low. You operate best when you\'re given space to dream, feel, and respond rather than plan, push, and perform. Your greatest strength is your creative intuition. Your greatest risk is emotional burnout from trying to \'keep up\' with linear systems.'
            ) : defaultDNA === 'Architect' ? (
              'You lead with logical clarity. You think first, then feel. Your actions are driven by systematic analysis, not by impulse or pressure. Your rhythm is linear — you move in structured steps, not emotional bursts. Productivity flows when systems are clear and processes are optimized. You operate best when you\'re given frameworks to plan, organize, and execute rather than improvise and respond. Your greatest strength is your strategic thinking. Your greatest risk is creative stagnation from over-structuring.'
            ) : (
              'Your DNA type is currently unclear. This means you may be in transition between types, or you may need more clarity on your natural operating rhythm. Take the 7-Day Identity Reset to discover your true default DNA.'
            )}
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Default Mastery</span>
                <span className="text-sm text-gray-500">{getAwarenessLevel(awarenessScore || 0)}%</span>
              </div>
              <Progress value={getAwarenessLevel(awarenessScore || 0)} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">→ Measured by Q1–Q6 + LMS feedback</p>
              <p className="text-sm text-gray-600">→ Deepens through aligned execution and supportive environments</p>
            </div>
          </div>
        </Card>

        {/* Natural Loop of Action */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Your Natural Loop of Action
          </h3>
          
          <div className="bg-orange-50 rounded-lg p-4 mb-4">
            <p className="font-medium text-orange-800">
              Loop Format: {DNA_LOOP_DESCRIPTIONS[defaultDNA || 'Blurred']?.format || 'Emotion → Thought → Emotion'}
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              {DNA_LOOP_DESCRIPTIONS[defaultDNA || 'Blurred']?.description || 
               'You feel first. Then you think about that feeling. Then you act — but only if it still feels right.'}
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="font-medium text-blue-800 mb-2">Loop Mastery Reminder:</p>
              <p className="text-blue-700">
                You don't evolve by switching loops — you evolve by deepening your own until it 
                becomes powerful, repeatable, and precise.
              </p>
            </div>
          </div>
        </Card>

        {/* Subtype Section - Only show for Architect/Alchemist, NOT for Blurred */}
        {subtype && defaultDNA !== 'Blurred' && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Your Subtype: {subtype}
            </h3>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="font-medium text-yellow-800 mb-2">Snapshot Line:</p>
                <p className="text-yellow-700 italic">"{getProfileData(subtype).snapshotLine}"</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Subtype Mastery</span>
                  <span className="text-sm text-gray-500">{subtypeProgress || 30}%</span>
                </div>
                <Progress value={subtypeProgress || 30} className="h-2" />
                <p className="text-sm text-gray-600 mt-1">→ Based on Q14–Q22 + behavioral indicators</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-medium text-green-800 mb-2">Ultimate Subtype Unlock:</p>
                <p className="text-green-700">→ Available after LMS course completion + milestone behaviors</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Subtype Snapshot:</h4>
                <ul className="space-y-2">
                  {getProfileData(subtype).snapshot?.map((item, index) => (
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

        {/* Core Identity - Only show for Architect/Alchemist with subtypes */}
        {subtype && defaultDNA !== 'Blurred' && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Core Identity Paragraph:</h3>
            <p className="text-gray-700 leading-relaxed">
              {getProfileData(subtype).longDescription}
            </p>
          </Card>
        )}

        {/* Opposite Mode Awareness */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Opposite Mode Awareness</h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Opposite Mode Awareness</span>
              <span className="text-sm text-gray-500">50%</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
          
          <p className="text-gray-700 mb-4">
            You're starting to appreciate the power of structured execution — even if you resist it. 
            You admire clarity, consistency, and follow-through in others, but you're learning that 
            imitation drains you. Integration doesn't mean copying — it means building containers 
            that protect your vision. As your awareness of the {oppositeType} style deepens, so does your 
            ability to manifest your ideas at scale. You're not meant to become an {oppositeType} — 
            you're meant to hire or partner with one.
          </p>
        </Card>

        {/* Your Edge */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Edge
          </h3>
          <ul className="space-y-2">
            {(subtype ? getProfileData(subtype).edge : edges).map((edge, index) => (
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
            {(subtype ? getProfileData(subtype).risks : risks).map((risk, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{risk}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="font-medium text-red-800 mb-2">Mini Reflection:</p>
            <p className="text-red-700">You're not scattered — you're nonlinear.</p>
            <p className="text-red-700">You're not inconsistent — you're resonance-led.</p>
          </div>
        </Card>

        {/* What You Need Next */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">What You Need Next</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Build scaffolding for your vision, not walls</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Create MVPs that reflect essence, not polish</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Protect idea surges with buffer zones and rest</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Co-create with those who can simplify your sparks</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Build backward from resonance, not just roadmap</span>
            </li>
          </ul>
        </Card>

        {/* Growth Mission */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <h3 className="text-xl font-bold mb-4">CTA: Your Growth Mission</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg">Title: "Build the Future Without Burning Out"</h4>
            </div>
            <div>
              <p className="font-medium">Mission Text:</p>
              <p className="text-gray-700">Your ideas don't need containment — they need intelligent containers.</p>
            </div>
            <p className="text-gray-700">Build systems that hold your frequency without dimming it.</p>
            <p className="text-gray-700">You're not meant to scale by grinding — you're meant to expand through alignment.</p>
            <p className="text-gray-700 font-medium">Let's build it your way — for real this time.</p>
          </div>
        </Card>

        {/* Complementary Subtype */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Best Complementary Opposite Subtype</h3>
          <p className="font-medium mb-4">Best Support: The Systemised Builder</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Where You Struggle | They Lead With</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span>Emotional burnout</span>
                  <span>Steady, predictable execution</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Over-ideation</span>
                  <span>MVP delivery and sequencing</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Missed timing</span>
                  <span>Operational discipline</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Perfection paralysis</span>
                  <span>Ship-before-perfect logic</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Where They Struggle | You Lead With</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span>Over-structuring</span>
                  <span>Energetic innovation and iteration</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Emotional disconnect</span>
                  <span>Resonance and creative magnetism</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Routine burnout</span>
                  <span>Passion, empathy, and vision</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-gray-700 italic">
            "Together? You build what sparks *and* scales."
          </p>
        </Card>

        {/* Final Empowerment */}
        <Card className="p-6 bg-gradient-to-r from-purple-100 to-indigo-100">
          <h3 className="text-xl font-bold mb-4">Final Empowerment Remark</h3>
          <div className="space-y-3">
            <p className="text-gray-700">You don't need to be both.</p>
            <p className="text-gray-700">
              You need to become the ultimate version of your DNA type — and that's exactly what 
              you're doing.
            </p>
            <p className="text-gray-700 font-medium">You are {subtype || 'Your Unique DNA Type'}.</p>
            <p className="text-gray-700">Now go finish building what only you could begin.</p>
          </div>
        </Card>

        {/* Milestone Tracker */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Milestone Tracker
          </h3>
          
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
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
                  {milestone.status === 'completed' ? 'Complete' : 'In Progress'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

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

export default ResultsPageNew;