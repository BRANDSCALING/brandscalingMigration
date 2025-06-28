import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { QuizState } from './QuizContainer';
import { PROFILE_DESCRIPTIONS, DNA_LOOP_DESCRIPTIONS } from './ProfileData';

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
          description: "Your Entrepreneurial DNA analysis is complete.",
        });

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

  const getProfileData = (subtype: string) => {
    return PROFILE_DESCRIPTIONS[subtype as keyof typeof PROFILE_DESCRIPTIONS] || {
      description: "Unique entrepreneurial profile",
      icon: "",
      edge: [],
      risks: [],
      longDescription: "",
      complement: "",
      milestoneTracker: {},
      growthMission: { title: "", text: "" },
      complementaryOpposite: { name: "", whereYouStruggle: {}, whereTheyStruggle: {} },
      whatYouNeedNext: []
    };
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
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-700 mb-2">
                  Loop Format: {DNA_LOOP_DESCRIPTIONS[defaultDNA || 'Blurred'].format}
                </p>
                <p className="text-gray-600 text-sm">
                  {DNA_LOOP_DESCRIPTIONS[defaultDNA || 'Blurred'].description}
                </p>
              </div>
              <p className="text-gray-600">
                {defaultDNA === 'Architect' && 'You lead with logic. Your actions are structured, paced, and intentionally sequenced. You prioritize clarity, frameworks, and long-range planning over emotional flux.'}
                {defaultDNA === 'Alchemist' && 'You lead with emotion first. Your decisions come from a felt sense of alignment — not efficiency, pressure, or logic. You move in rhythm, guided by internal resonance.'}
                {defaultDNA === 'Blurred' && 'Your core identity is still there — but it\'s fogged by overthinking, over-adapting, or emotional burnout. You need the 7-Day Identity Reset to find your true default.'}
              </p>
            </div>
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

        {/* Section 4: Subtype */}
        {subtype && (
          <Card className="border-2 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">[4] Your Subtype: {subtype}</h3>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Snapshot Line:</h4>
                <p className="text-gray-700 italic mb-4">"{getProfileData(subtype).description}"</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Subtype Mastery:</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Based on Q1-Q22 + behavioral indicators</span>
                  <span className="text-lg font-bold">{subtypeProgress || 30}%</span>
                </div>
                <Progress value={subtypeProgress || 30} className="w-full h-3" />
              </div>

              {/* Ultimate Subtype Unlock */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-semibold mb-2">Ultimate Subtype Unlock:</h4>
                <p className="text-sm text-gray-700">Available after LMS course completion + milestone behaviors</p>
              </div>

              {/* Subtype Snapshot */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Subtype Snapshot:</h4>
                <div className="space-y-2 text-sm">
                  <p>• You operate in surges of insight and inspiration</p>
                  <p>• You lead with fast-vision and non-verbal clarity</p>
                  <p>• You move when energy strikes — not when the calendar says to</p>
                  <p>• You complete only if the final version "feels" like the vision</p>
                </div>
              </div>

              {/* Core Identity Paragraph */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Core Identity Paragraph:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{getProfileData(subtype).longDescription}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 5: Opposite Mode Awareness */}
        <Card className="border-2 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[5] Opposite Mode Awareness</h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Opposite Mode Awareness:</span>
                <span className="text-lg font-bold">50%</span>
              </div>
              <Progress value={50} className="w-full h-3" />
            </div>

            <p className="text-gray-700 text-sm mb-4">
              You're starting to appreciate the power of structured execution — even if you resist it. 
              You admire clarity, consistency, and follow-through in others, but you're learning that 
              imitation drains you. Integration doesn't mean copying — it means building structures 
              that protect your vision. As your awareness of the Architect style deepens, so does your 
              ability to manifest your ideas at scale. You're not meant to become an Architect — 
              you're meant to hire or partner with one.
            </p>
          </Card>
        )}

        {/* Section 6: Your Edge */}
        <Card className="border-2 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[6] Your Edge</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {getProfileData(subtype).edge.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        )}

        {/* Section 7: Risks & Blind Spots */}
        <Card className="border-2 border-red-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[7] Risks & Blind Spots</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {getProfileData(subtype).risks.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-semibold mb-2">Mini Reflection:</h4>
              <p className="text-sm text-gray-700">You're not scattered — you're nonlinear.</p>
              <p className="text-sm text-gray-700">You're not inconsistent — you're resonance-led.</p>
            </div>
          </CardContent>
        )}

        {/* Section 8: What You Need Next */}
        <Card className="border-2 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[8] What You Need Next</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Build scaffolding for your vision, not walls</li>
              <li>• Create MVPs that reflect essence, not polish</li>
              <li>• Protect idea surges with buffer zones and rest</li>
              <li>• Co-create with those who can simplify your sparks</li>
              <li>• Build backward from resonance, not just roadmap</li>
            </ul>
          </CardContent>
        )}

        {/* Section 9: CTA: Your Growth Mission */}
        <Card className="border-2 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[9] CTA: Your Growth Mission</h3>
            <h4 className="font-semibold mb-2">Title: "Build the Future Without Burning Out"</h4>
            
            <div className="mb-4">
              <h5 className="font-medium mb-2">Mission Text:</h5>
              <p className="text-gray-700 text-sm">Your ideas don't need containment — they need intelligent containers.</p>
              <p className="text-gray-700 text-sm">Build systems that hold your frequency without dimming it.</p>
              <p className="text-gray-700 text-sm">You're not meant to scale by grinding — you're meant to expand through alignment.</p>
              <p className="text-gray-700 text-sm font-semibold">Let's build it your way — for real this time.</p>
            </div>
          </CardContent>
        )}

        {/* Section 10: Best Complementary Opposite Subtype */}
        <Card className="border-2 border-indigo-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[10] Best Complementary Opposite Subtype</h3>
            <h4 className="font-semibold mb-4">Best Support: The Systemised Builder</h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">Where You Struggle | They Lead With</h5>
                <div className="space-y-2 text-sm">
                  <div className="border-b pb-1">
                    <span className="text-gray-600">Emotional burnout</span>
                    <span className="text-gray-800 ml-2">| Steady, predictable execution</span>
                  </div>
                  <div className="border-b pb-1">
                    <span className="text-gray-600">Over-ideation</span>
                    <span className="text-gray-800 ml-2">| MVP delivery and sequencing</span>
                  </div>
                  <div className="border-b pb-1">
                    <span className="text-gray-600">Missed timing</span>
                    <span className="text-gray-800 ml-2">| Operational discipline</span>
                  </div>
                  <div className="border-b pb-1">
                    <span className="text-gray-600">Perfection paralysis</span>
                    <span className="text-gray-800 ml-2">| Ship-before-perfect logic</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Where They Struggle | You Lead With</h5>
                <div className="space-y-2 text-sm">
                  <div className="border-b pb-1">
                    <span className="text-gray-600">Over-structuring</span>
                    <span className="text-gray-800 ml-2">| Energetic innovation and iteration</span>
                  </div>
                  <div className="border-b pb-1">
                    <span className="text-gray-600">Emotional disconnect</span>
                    <span className="text-gray-800 ml-2">| Resonance and creative magnetism</span>
                  </div>
                  <div className="border-b pb-1">
                    <span className="text-gray-600">Routine burnout</span>
                    <span className="text-gray-800 ml-2">| Passion, empathy, and vision</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded">
              <p className="text-sm font-semibold">Closing Line:</p>
              <p className="text-sm text-gray-700">Together? You build what sparks "want" scales.</p>
            </div>
          </CardContent>
        )}

        {/* Section 11: Final Empowerment Remark */}
        <Card className="border-2 border-green-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[11] Final Empowerment Remark</h3>
            
            <div className="space-y-4">
              <p className="text-gray-700">You don't need to be both.</p>
              <p className="text-gray-700">You need to become the ultimate version of your DNA type — and that's exactly what you're doing.</p>
              <p className="text-gray-700 font-semibold">You are The Visionary Oracle.</p>
              <p className="text-gray-700">Now go finish building what only you could begin.</p>
            </div>
          </CardContent>
        )}

        {/* Section 12: Milestone Tracker */}
        <Card className="border-2 border-teal-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">[12] Milestone Tracker</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 border-b">
                <span className="text-sm font-medium">Milestone</span>
                <span className="text-sm font-medium">Status</span>
              </div>
              
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">Finishing without burnout</span>
                <span className="text-green-600 text-sm">✓ Complete</span>
              </div>
              
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">Energy-first project planning</span>
                <span className="text-green-600 text-sm">✓ Complete</span>
              </div>
              
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">Aligned systems that mirror your rhythm</span>
                <span className="text-green-600 text-sm">✓ Complete</span>
              </div>
              
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">Delegation without disruption</span>
                <span className="text-yellow-600 text-sm">↻ In Progress</span>
              </div>
              
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">Rhythmic recovery integration</span>
                <span className="text-yellow-600 text-sm">↻ In Progress</span>
              </div>
              
              <div className="flex justify-between items-center p-2">
                <span className="text-sm">Protecting vision through collaboration</span>
                <span className="text-yellow-600 text-sm">↻ In Progress</span>
              </div>
            </div>
          </CardContent>
        )}

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
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                🔄 You've Been Operating in a Blurred Loop
              </h3>
              <div className="space-y-4 text-red-700">
                <p>
                  Your Entrepreneurial DNA is currently blurred. You've likely adapted patterns that don't belong to you.
                  Your core identity is still there — but it's fogged by overthinking, over-adapting, or emotional burnout.
                </p>
                <p className="font-semibold italic">
                  "You're not broken. You've just been blurred."
                </p>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold mb-2">Reset Mission: Find Your True Default</h4>
                  <p className="text-sm">
                    You're entering the 7-Day Identity Reset — a structured path to help you find your default DNA.
                    This isn't about guessing your type. It's about experiencing both Architect and Alchemist rhythms — and seeing what finally feels like home.
                  </p>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white mt-4">
                Start 7-Day Identity Reset
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Access */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Ready to Continue Your Journey?
            </h3>
            <p className="text-green-700 mb-4">
              Access your personalized dashboard to explore courses, tools, and resources tailored to your Entrepreneurial DNA.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                const accessTier = localStorage.getItem('accessTier') || 'entry';
                if (accessTier === 'entry') {
                  setLocation('/entry');
                } else {
                  setLocation('/student');
                }
              }}
            >
              Go to My Dashboard
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