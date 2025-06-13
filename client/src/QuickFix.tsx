import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

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

const QUIZ_QUESTIONS: Question[] = [
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
    text: "You're choosing a vacation. What appeals to you most?",
    answers: {
      A: "Familiar place, reliable plan, solid accommodation.",
      B: "Adventure somewhere new with room for spontaneity.",
      C: "Mix of both — some structure, some flexibility.",
      D: "I stress about picking and often delay until the last minute."
    }
  },
  {
    id: 4,
    text: "In a heated group discussion, you:",
    answers: {
      A: "Stay quiet and observe before (maybe) offering input.",
      B: "Jump right in — ideas flow when I'm engaged.",
      C: "Contribute when I have something valuable to add.",
      D: "Want to participate but often second-guess myself."
    }
  },
  {
    id: 5,
    text: "When learning something new, you prefer:",
    answers: {
      A: "Step-by-step instructions and a clear roadmap.",
      B: "Diving in and figuring it out as I go.",
      C: "A mix — some guidance but room to explore.",
      D: "I often get stuck choosing the 'right' way to start."
    }
  },
  {
    id: 6,
    text: "Your workspace tends to be:",
    answers: {
      A: "Organized, minimal, everything has its place.",
      B: "Organized chaos — I know where everything is.",
      C: "Clean enough to function, not obsessively tidy.",
      D: "It varies wildly depending on my mood and stress levels."
    }
  },
  {
    id: 7,
    text: "When making big decisions, you:",
    answers: {
      A: "Research thoroughly, weigh pros and cons systematically.",
      B: "Go with my gut feeling pretty quickly.",
      C: "Balance research with intuition.",
      D: "Overthink and often get stuck in analysis paralysis."
    }
  },
  {
    id: 8,
    text: "At social events, you:",
    answers: {
      A: "Prefer one-on-one conversations or small groups.",
      B: "Thrive in the energy of larger groups.",
      C: "Enjoy both, depending on the vibe.",
      D: "Feel awkward and often leave early."
    }
  },
  {
    id: 9,
    text: "When someone disagrees with your idea, you:",
    answers: {
      A: "Listen carefully and consider their perspective.",
      B: "Stand my ground if I believe in it.",
      C: "Try to find common ground or compromise.",
      D: "Immediately doubt myself and back down."
    }
  },
  {
    id: 10,
    text: "Your ideal Friday night is:",
    answers: {
      A: "Quiet night in with a book, movie, or hobby.",
      B: "Out with friends or trying something new.",
      C: "Either sounds good, depending on my mood.",
      D: "I can never decide and end up doing nothing."
    }
  },
  {
    id: 11,
    text: "When you receive constructive criticism, you:",
    answers: {
      A: "Appreciate the feedback and use it to improve.",
      B: "Take it personally but try to learn from it.",
      C: "Depends on how it's delivered and who it's from.",
      D: "Feel defensive and struggle to see the value."
    }
  },
  {
    id: 12,
    text: "In a crisis, you:",
    answers: {
      A: "Stay calm and think through solutions logically.",
      B: "Act quickly based on instinct.",
      C: "Assess the situation then respond accordingly.",
      D: "Panic initially but eventually find a way through."
    }
  },
  {
    id: 13,
    text: "Your approach to goal-setting is:",
    answers: {
      A: "Set clear, specific, measurable targets.",
      B: "Have big visions and adapt as I go.",
      C: "Mix of concrete goals with some flexibility.",
      D: "I struggle to set goals or stick to them."
    }
  },
  {
    id: 14,
    text: "When working on a team project, you:",
    answers: {
      A: "Prefer defined roles and clear expectations.",
      B: "Like collaborative brainstorming and shared ownership.",
      C: "Appreciate structure but value input from everyone.",
      D: "Often unsure of my role or how to contribute best."
    }
  },
  {
    id: 15,
    text: "Your relationship with routine is:",
    answers: {
      A: "I thrive on consistency and predictable schedules.",
      B: "I get bored easily and prefer variety.",
      C: "I like some routine but need flexibility too.",
      D: "I want routine but struggle to maintain it."
    }
  },
  {
    id: 16,
    text: "When facing uncertainty, you:",
    answers: {
      A: "Try to gather more information to reduce unknowns.",
      B: "Accept it as part of life and move forward.",
      C: "Acknowledge it but don't let it paralyze me.",
      D: "Feel anxious and struggle to make progress."
    }
  },
  {
    id: 17,
    text: "Your communication style is:",
    answers: {
      A: "Thoughtful, precise, and measured.",
      B: "Expressive, passionate, and spontaneous.",
      C: "Adaptable depending on the situation.",
      D: "Inconsistent and sometimes unclear."
    }
  },
  {
    id: 18,
    text: "When starting a new project, you:",
    answers: {
      A: "Plan extensively before taking action.",
      B: "Start immediately and figure it out as I go.",
      C: "Do some planning but remain flexible.",
      D: "Get overwhelmed by all the possibilities."
    }
  },
  {
    id: 19,
    text: "Your energy levels throughout the day:",
    answers: {
      A: "Pretty consistent if I stick to my routine.",
      B: "Fluctuate but I adapt and go with the flow.",
      C: "Generally stable with some natural ups and downs.",
      D: "Unpredictable and hard to manage."
    }
  },
  {
    id: 20,
    text: "When you look back on your achievements, you feel:",
    answers: {
      A: "Proud of what I've accomplished through persistence.",
      B: "Excited about the journey and what's next.",
      C: "Grateful for both successes and lessons learned.",
      D: "Like I could have done more or done things differently."
    }
  }
];

export default function QuickFix() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateResult = () => {
    let architectScore = 0;
    let alchemistScore = 0;
    let blurredScore = 0;
    let unfocusedScore = 0;

    // DNA Type Calculation (Q1-Q10)
    for (let i = 1; i <= 10; i++) {
      const answer = answers[i];
      if (answer === 'A') architectScore++;
      else if (answer === 'B') alchemistScore++;
      else if (answer === 'C') blurredScore++;
      else if (answer === 'D') unfocusedScore++;
    }

    // Awareness Calculation (Q11-Q20)
    let awarenessScore = 0;
    for (let i = 11; i <= 20; i++) {
      const answer = answers[i];
      if (answer === 'A' || answer === 'B') awarenessScore++;
    }
    const awarenessPercentage = (awarenessScore / 10) * 100;

    const scores = { architectScore, alchemistScore, blurredScore, unfocusedScore };
    const maxScore = Math.max(...Object.values(scores));
    
    let dominantType = 'Unfocused Potential';
    if (scores.architectScore === maxScore) dominantType = 'Architect';
    else if (scores.alchemistScore === maxScore) dominantType = 'Alchemist';
    else if (scores.blurredScore === maxScore) dominantType = 'Blurred Identity';

    return { dominantType, awarenessPercentage, scores };
  };

  if (showResult) {
    const result = calculateResult();
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-center mb-6">Your Entrepreneurial DNA</h1>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-purple-600">{result.dominantType}</h2>
                <p className="text-lg text-gray-600 mt-2">Awareness Level: {result.awarenessPercentage}%</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <h3 className="font-semibold">Architect</h3>
                  <p className="text-2xl font-bold text-blue-600">{result.scores.architectScore}/10</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Alchemist</h3>
                  <p className="text-2xl font-bold text-red-500">{result.scores.alchemistScore}/10</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Blurred Identity</h3>
                  <p className="text-2xl font-bold text-purple-600">{result.scores.blurredScore}/10</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Unfocused Potential</h3>
                  <p className="text-2xl font-bold text-gray-600">{result.scores.unfocusedScore}/10</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="w-full bg-gray-50 p-4" style={{ minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Entrepreneurial DNA Quiz™</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
            <div className="space-y-3">
              {Object.entries(question.answers).map(([key, text]) => (
                <button
                  key={key}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    answers[question.id] === key
                      ? 'bg-purple-100 border-purple-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(question.id, key)}
                >
                  <span className="font-medium mr-3">{key}.</span>
                  {text}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Complete Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}