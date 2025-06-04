import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

type AnswerType = 'Architect' | 'Alchemist' | 'Undeclared' | 'Blurred Identity';

interface Question {
  id: number;
  prompt: string;
  options: { text: string; type: AnswerType }[];
}

const questions = [
  {
    id: 1,
    prompt: "You're offered a major growth opportunity. It could stretch your ops team and timelines. What do you do first?",
    options: [
      { text: "Create a quick working outline of execution to see where the cracks may appear.", type: "Architect" },
      { text: "Say yes. The timing feels right, and you'll adjust along the way.", type: "Alchemist" },
      { text: "Wait 24 hours before replying. You want to feel how your team shows up first.", type: "Undeclared" },
      { text: "Ask for a call to understand every angle — you'll decide based on a mix of inputs.", type: "Blurred Identity" },
    ],
  },
  {
    id: 2,
    prompt: "A campaign underdelivers, and feedback is conflicting. How do you respond?",
    options: [
      { text: "Break the campaign into phases. Something likely misfired at execution level.", type: "Architect" },
      { text: "Ask: Did the message still feel true? Maybe it lost its pulse.", type: "Alchemist" },
      { text: "Let things settle. You want clarity before changing anything.", type: "Undeclared" },
      { text: "Schedule a brainstorm to gather different perspectives and decide next steps.", type: "Blurred Identity" },
    ],
  },
  {
    id: 3,
    prompt: "You need to replace yourself in a leadership role. What's your focus?",
    options: [
      { text: "Find someone who can mirror your systems and drive delivery.", type: "Architect" },
      { text: "Look for energy match and vision alignment — someone who gets it.", type: "Alchemist" },
      { text: "Postpone the decision until the business model feels more stable.", type: "Undeclared" },
      { text: "Write a broad job spec and stay open to who shows up.", type: "Blurred Identity" },
    ],
  },
  {
    id: 4,
    prompt: "A team member keeps missing deadlines, but believes in the mission. You:",
    options: [
      { text: "Review their workload, assess blockers, and reassign tasks accordingly.", type: "Architect" },
      { text: "Sit down with them — something deeper may be driving this.", type: "Alchemist" },
      { text: "Wait for one more project. You're not fully sure what the issue is yet.", type: "Undeclared" },
      { text: "Shift their role slightly and see if a change helps.", type: "Blurred Identity" },
    ],
  },
  {
    id: 5,
    prompt: "A partner offers a last-minute opportunity for exposure. It means reshuffling your week. What's your instinct?",
    options: [
      { text: "Decline for now — disruptions aren't worth reactive delivery.", type: "Architect" },
      { text: "Say yes — you move best with momentum.", type: "Alchemist" },
      { text: "Say maybe. If the window stays open, you'll decide last minute.", type: "Undeclared" },
      { text: "Try to move things around and fit it in, even if it's tight.", type: "Blurred Identity" },
    ],
  },
  {
    id: 6,
    prompt: "You're asked to give a keynote to early-stage entrepreneurs. What do you focus on?",
    options: [
      { text: "Frameworks that saved time, stress, and cashflow.", type: "Architect" },
      { text: "The moments where you trusted what couldn't be explained.", type: "Alchemist" },
      { text: "Your observations — you're still deciding how you operate best.", type: "Undeclared" },
      { text: "A bit of both — you toggle based on what the audience needs.", type: "Blurred Identity" },
    ],
  },
  {
    id: 7,
    prompt: "Your team is stuck between two competing strategies. You:",
    options: [
      { text: "Model out projections for each and choose based on potential ROI.", type: "Architect" },
      { text: "Pause the debate. You need to reconnect with the larger vision.", type: "Alchemist" },
      { text: "Ask them to vote — you want to see where their energy naturally flows.", type: "Undeclared" },
      { text: "Take pieces from both and build a hybrid option.", type: "Blurred Identity" },
    ],
  },
  {
    id: 8,
    prompt: "A rebrand is on the table. What's your first move?",
    options: [
      { text: "Update the brand architecture, messaging, and visual guidelines.", type: "Architect" },
      { text: "Tune in: What is the energy of this business now? Does the brand reflect it?", type: "Alchemist" },
      { text: "Ask customers what they notice first — you want an outside perspective.", type: "Undeclared" },
      { text: "Pull bits from brands you admire and see what fits.", type: "Blurred Identity" },
    ],
  },
  {
    id: 9,
    prompt: "You're planning a restructure. What drives your design choices?",
    options: [
      { text: "Functional logic and operational efficiency.", type: "Architect" },
      { text: "Emotional alignment — who thrives in what type of flow?", type: "Alchemist" },
      { text: "You're not ready. You need more context before making changes.", type: "Undeclared" },
      { text: "A little of both — structure matters, but so does energy.", type: "Blurred Identity" },
    ],
  },
  {
    id: 10,
    prompt: "A mentor tells you to change your offer to suit the market better. You:",
    options: [
      { text: "Review trends and adjust positioning where needed.", type: "Architect" },
      { text: "Check inward: Does this shift feel true to the original intent?", type: "Alchemist" },
      { text: "Wait. If the market really demands it, you'll feel it more clearly soon.", type: "Undeclared" },
      { text: "Start adapting — no harm in trialing different angles.", type: "Blurred Identity" },
    ],
  },
  {
    id: 11,
    prompt: "You're scaling fast. What's your priority?",
    options: [
      { text: "Operations. Without delivery clarity, scale breaks everything.", type: "Architect" },
      { text: "Culture. If the energy breaks, everything breaks.", type: "Alchemist" },
      { text: "You're watching what unfolds before making any priority call.", type: "Undeclared" },
      { text: "Balance. You need momentum and stability — even if both are shaky.", type: "Blurred Identity" },
    ],
  },
  {
    id: 12,
    prompt: "You're launching a new vertical. What's your first step?",
    options: [
      { text: "Build the executional roadmap. Then assign accountable owners.", type: "Architect" },
      { text: "Write the story and feeling of it — what will this mean to people?", type: "Alchemist" },
      { text: "Sketch some light ideas, but wait for signs to move ahead.", type: "Undeclared" },
      { text: "Start a conversation with collaborators and see what direction forms.", type: "Blurred Identity" },
    ],
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleAnswer = (value: AnswerType) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = (): AnswerType => {
    const counts = {
      'Architect': 0,
      'Alchemist': 0,
      'Undeclared': 0,
      'Blurred Identity': 0
    };

    Object.values(answers).forEach(answer => {
      counts[answer]++;
    });

    const maxCount = Math.max(...Object.values(counts));
    const dominantTypes = Object.entries(counts)
      .filter(([, count]) => count === maxCount)
      .map(([type]) => type as AnswerType);

    return dominantTypes[0];
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = calculateResult();
      
      // Save to localStorage
      localStorage.setItem('quizResult', result);
      
      // Submit to backend
      if (user?.id) {
        await apiRequest('POST', '/api/quiz/submit', { userId: user.id, result });
      }
      
      // Redirect to result page
      setLocation('/quiz/result');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 font-['Poppins']">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Entrepreneurial DNA Quiz
          </h1>
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestionData.prompt}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={(value) => handleAnswer(value as AnswerType)}
            >
              {currentQuestionData.options.map((option, index) => (
                <div key={`${currentQuestion}-${index}`} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.type} 
                    id={`${currentQuestion}-${index}`}
                  />
                  <Label 
                    htmlFor={`${currentQuestion}-${index}`}
                    className="flex items-center space-x-3 cursor-pointer flex-1 p-4 rounded-lg border hover:bg-gray-50"
                  >
                    <span className="font-medium text-sm leading-relaxed">{option.text}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={!selectedAnswer || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!selectedAnswer}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}