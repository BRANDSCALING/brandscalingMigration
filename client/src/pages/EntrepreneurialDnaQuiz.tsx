import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ArrowRight, RotateCcw } from 'lucide-react';
import { ENTREPRENEURIAL_DNA_QUESTIONS, DNA_SUBTYPES } from '@shared/entrepreneurialDnaData';

interface Question {
  id: number;
  text: string;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface QuizResult {
  defaultType: 'Architect' | 'Alchemist' | 'Blurred Identity';
  subtype: string;
  awarenessPercentage: number;
  canRetake: boolean;
  nextRetakeDate?: string;
}

// Using enhanced question set from shared data
const QUIZ_QUESTIONS = ENTREPRENEURIAL_DNA_QUESTIONS;
  {
    id: 1,
    text: "You're going away for the weekend. How do you prepare the night before?",
    answers: {
      A: "I mentally run through what I need and pack once — essentials are covered.",
      B: "I write a full list, check everything off, repack a few times, still feel uneasy.",
      C: "I throw things in last minute and trust it'll be fine.",
      D: "I pack, unpack, and get overwhelmed deciding what I even need."
    }
  },
  {
    id: 2,
    text: "A close friend unintentionally hurts your feelings. How do you respond?",
    answers: {
      A: "I won't say anything — they'll figure it out or I'll quietly move on.",
      B: "I'll express it — maybe now, maybe later — but it will come out.",
      C: "I react suddenly, then second-guess if I was overdramatic.",
      D: "I feel stuck about whether I should say something or not."
    }
  },
  {
    id: 3,
    text: "You walk into a room full of strangers. What do you do?",
    answers: {
      A: "I observe quietly, scan the room, and engage when it makes sense.",
      B: "I act on how I feel — I might blend in or suddenly become the centre of attention.",
      C: "I linger around and wait for someone to notice or invite me.",
      D: "I'm unsure how to show up — I feel pressure to act right."
    }
  },
  {
    id: 4,
    text: "You've committed to waking up at 6am for a week. Day 3, you're exhausted. What happens?",
    answers: {
      A: "I stick to it. Fatigue doesn't override commitment unless it's serious.",
      B: "I ask myself if the reason still matters — if not, I adjust without guilt.",
      C: "I sleep in, feel bad, and try again tomorrow.",
      D: "I feel torn — I want to keep going but can't force myself either."
    }
  },
  {
    id: 5,
    text: "You've completed a project and it performs well. How do you feel about it?",
    answers: {
      A: "If the result is strong, I'm satisfied — no need to change anything.",
      B: "I immediately wonder how it could have been even better.",
      C: "I feel good but uneasy — maybe I missed something important.",
      D: "I can't tell if I'm happy or not — depends what others say."
    }
  },
  {
    id: 6,
    text: "You're pursuing a goal no one else has achieved. How do you think about it?",
    answers: {
      A: "I need to see a path or example — otherwise I'm not sure it's achievable.",
      B: "Even if no one's done it, I know it's possible — I just need the steps.",
      C: "I doubt myself, but I still try in case it works out.",
      D: "I switch between confidence and confusion depending on the day."
    }
  },
  {
    id: 7,
    text: "You're preparing for something two weeks away. How do you usually plan?",
    answers: {
      A: "I break it down early and map out tasks by week or day, so it doesn't stack up.",
      B: "I map it out in detail far in advance, but then I keep improving and adding to it, often creating overwhelm — and later try to simplify again.",
      C: "I kind of half-plan, get distracted, and usually scramble to pull it together.",
      D: "I don't really plan — I usually go with what happens closer to the time."
    }
  },
  {
    id: 8,
    text: "Someone challenges your viewpoint in a conversation. How do you respond?",
    answers: {
      A: "I stay calm, clarify my logic, and listen to see if their view has merit.",
      B: "If I strongly believe in it, I won't give up until I feel they understand — but if I'm neutral, I stay open.",
      C: "I react emotionally, then question whether I overdid it.",
      D: "I nod along even if I disagree, and then think about it for hours later."
    }
  },
  {
    id: 9,
    text: "You're working with someone who's doing things 'wrong.' What's your response?",
    answers: {
      A: "I re-explain the system and ask them to stick to the structure.",
      B: "I try to understand why they're doing it that way — if I like them, I'll adapt or just do it myself out of frustration.",
      C: "I take over entirely and avoid explaining.",
      D: "I get confused about whether to fix it, explain, or let them do it their way."
    }
  },
  {
    id: 10,
    text: "How do you work toward a long-term goal (6–12 months away)?",
    answers: {
      A: "I set clear milestones and track them until the goal is complete.",
      B: "I envision the end result, emotionally commit, and make it real in my mind — then build toward it as it gets closer.",
      C: "I try to start but never build momentum — it stays an idea.",
      D: "I keep rethinking the goal before I even begin."
    }
  },
  {
    id: 11,
    text: "You've discovered a new strategy or tool. What's your style of using it?",
    answers: {
      A: "I test a small piece, measure the results, and build on it.",
      B: "I dive in, get obsessed, test everything, and either burn out or master it.",
      C: "I research endlessly and then hesitate to take action.",
      D: "I get excited, start it, then forget to follow through."
    }
  },
  {
    id: 12,
    text: "Something makes perfect sense on paper, but feels wrong to you. What do you do?",
    answers: {
      A: "If it's logical, I move forward — emotion won't hold me back.",
      B: "I need to figure out why it feels wrong. If it doesn't make sense to me, something must be missing.",
      C: "I keep asking people for advice and still stay stuck.",
      D: "I do it anyway but feel disconnected the whole time."
    }
  },
  {
    id: 13,
    text: "You're asked to speak in front of a large group. What happens internally?",
    answers: {
      A: "I know exactly what I want to say and how to explain it. I've rehearsed or practiced mentally.",
      B: "I'm happy to speak — even if I don't know the topic, I'll admit that. I can shine or stumble depending on the moment. I've been working on articulating more clearly.",
      C: "I stress out, lose clarity mid-sentence, and overcorrect.",
      D: "I prepare, but get nervous and change everything at the last minute."
    }
  },
  {
    id: 14,
    text: "You've spent the entire week at home, alone. How do you feel?",
    answers: {
      A: "Drained, foggy, and ready to get out. I need movement and stimulation.",
      B: "I could be super productive or completely still — and both are fine. When ready, I come alive in a moment.",
      C: "Unproductive and annoyed at myself for wasting the time.",
      D: "I'm not sure — part of me liked it, part of me wants to escape."
    }
  },
  {
    id: 15,
    text: "Your regular routine is completely disrupted for 3 days. How do you respond?",
    answers: {
      A: "I feel off-track, so I rebuild the routine as quickly as I can.",
      B: "I struggle with fixed routines. I can do the same tasks — just at different times and moods.",
      C: "I don't recover well — the disruption throws off everything.",
      D: "I like the break but get disoriented when it's time to get back to work."
    }
  },
  {
    id: 16,
    text: "You're up against a tight deadline and still working. What happens?",
    answers: {
      A: "I execute in structured sprints, track deliverables, and get it done on time.",
      B: "I try to work in structured sprints, but I keep tweaking — sometimes I miss deadlines and deliver brilliance late.",
      C: "I overthink, delay too much, then panic.",
      D: "I avoid working until the pressure is too high to ignore."
    }
  },
  {
    id: 17,
    text: "You see someone receive praise for a method that you know is inefficient. How do you feel?",
    answers: {
      A: "Annoyed, but I stay quiet unless it affects results directly.",
      B: "Frustrated — I feel a need to point it out, even if it causes tension.",
      C: "Jealous — I wish I got the recognition, even if I'm not sure why.",
      D: "Confused — I don't know if I'm right to judge or just overthinking."
    }
  },
  {
    id: 18,
    text: "You've been assigned a task but given almost no guidance. What do you do?",
    answers: {
      A: "I build a structure from scratch and complete it efficiently.",
      B: "I intuitively start and figure it out as I go — refining as I learn.",
      C: "I start, stop, restart — unsure how to keep momentum.",
      D: "I feel blocked and spend time waiting for more clarity."
    }
  },
  {
    id: 19,
    text: "You're being observed while doing something important. What changes?",
    answers: {
      A: "Nothing — I operate the same regardless of who's watching.",
      B: "I become more aware of the energy and adjust instinctively.",
      C: "I second-guess myself or perform better depending on who's watching.",
      D: "I feel thrown off and unsure how to act."
    }
  },
  {
    id: 20,
    text: "You receive contradictory advice from people you respect. What happens?",
    answers: {
      A: "I break it down logically, cross-check, and choose based on data.",
      B: "I filter through what aligns with my internal sense of truth and trust that.",
      C: "I spiral and delay the decision trying to weigh everything.",
      D: "I follow the advice I emotionally prefer, even if it lacks clarity."
    }
  }
];

export default function EntrepreneurialDnaQuiz() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retakeInfo, setRetakeInfo] = useState<{ canRetake: boolean; nextRetakeDate?: string } | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }
    checkRetakeEligibility();
  }, [user, setLocation]);

  const checkRetakeEligibility = async () => {
    setIsCheckingEligibility(true);
    try {
      const data = await apiRequest('GET', '/api/quiz/entrepreneurial-dna/eligibility');
      if (!data.canRetake) {
        setRetakeInfo({
          canRetake: false,
          nextRetakeDate: data.nextRetakeDate
        });
      }
    } catch (error) {
      console.error('Error checking retake eligibility:', error);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleAnswer = (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = async () => {
    if (currentQuestion === 6) {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
    }
    
    if (currentQuestion < 20) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const data = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
        answers
      });
      setResult(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Quiz submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setShowResults(false);
    setResult(null);
    setRetakeInfo(null);
  };

  const getDaysUntilRetake = (nextRetakeDate: string) => {
    const now = new Date();
    const retakeDate = new Date(nextRetakeDate);
    const diffTime = retakeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getResultContent = (type: string, awarenessPercentage: number) => {
    const templates = {
      'Architect': {
        title: 'The Architect',
        description: 'You are a systems thinker who builds scalable, sustainable businesses through strategic planning and execution.',
        strengths: ['Strategic Planning', 'Systems Thinking', 'Execution Excellence', 'Scalable Solutions'],
        growth: 'Your awareness of Alchemist traits will help you connect more deeply with customers and inspire your team.'
      },
      'Alchemist': {
        title: 'The Alchemist',
        description: 'You are a relationship builder who creates transformation through emotional connection and intuitive leadership.',
        strengths: ['Relationship Building', 'Intuitive Leadership', 'Customer Connection', 'Transformational Impact'],
        growth: 'Your awareness of Architect traits will help you build more robust systems and sustainable growth.'
      },
      'Blurred Identity': {
        title: 'The Blurred Identity',
        description: 'You have a unique blend of traits that allows you to adapt and excel in various entrepreneurial situations.',
        strengths: ['Adaptability', 'Versatile Thinking', 'Situational Leadership', 'Multi-faceted Approach'],
        growth: 'Focus on developing your strongest traits while maintaining your adaptive flexibility.'
      }
    };

    return templates[type as keyof typeof templates] || templates['Blurred Identity'];
  };

  if (!user) {
    return <div>Please log in to take the quiz.</div>;
  }

  if (retakeInfo && !retakeInfo.canRetake) {
    const daysLeft = retakeInfo.nextRetakeDate ? getDaysUntilRetake(retakeInfo.nextRetakeDate) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <RotateCcw className="h-16 w-16 mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Quiz Recently Completed</h2>
              <p className="text-gray-600 dark:text-gray-400">
                You can retake the Entrepreneurial DNA Quiz™ in {daysLeft} days.
              </p>
            </div>
            <Button onClick={() => setLocation('/dashboard')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Processing Your DNA...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing your entrepreneurial patterns
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && result) {
    const content = getResultContent(result.defaultType, result.awarenessPercentage);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-indigo-600 mb-2">{content.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  Your Entrepreneurial DNA™ Results
                </p>
                <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                  {content.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Default Type</h3>
                  <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{result.defaultType}</span>
                      <span className="text-indigo-600 font-bold">PRIMARY</span>
                    </div>
                    <Progress value={100} className="h-3" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Opposite Type Awareness</h3>
                  <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Awareness Level</span>
                      <span className="text-green-600 font-bold">{result.awarenessPercentage}%</span>
                    </div>
                    <Progress value={result.awarenessPercentage} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Strengths</h3>
                  <ul className="space-y-2">
                    {content.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Growth Opportunity</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {content.growth}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <Button 
                  onClick={() => setLocation('/courses')} 
                  size="lg"
                  className="mr-4"
                >
                  Explore Your Learning Path
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/dashboard')}
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentQuestion - 1];
  const progress = (currentQuestion / 20) * 100;
  const canProceed = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Entrepreneurial DNA Quiz™</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion} of 20
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6 leading-relaxed">
              {currentQ?.text}
            </h2>

            <div className="space-y-4 mb-8">
              {Object.entries(currentQ.answers).map(([key, text]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(currentQuestion, key as 'A' | 'B' | 'C' | 'D')}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:border-indigo-300 ${
                    answers[currentQuestion] === key
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="font-medium text-indigo-600 mr-3">{key}.</span>
                  {text}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => currentQuestion > 1 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : currentQuestion === 20 ? (
                  'Complete Quiz'
                ) : (
                  'Next'
                )}
                {currentQuestion < 20 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}