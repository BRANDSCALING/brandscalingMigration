import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  ClipboardList,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "multiple_choice" | "scale" | "text";
  options?: string[];
  category: string;
}

const sampleQuestions: Question[] = [
  {
    id: "brand_clarity",
    question: "How clearly can you describe your brand's unique value proposition in one sentence?",
    type: "scale",
    category: "Brand Strategy",
  },
  {
    id: "target_market",
    question: "How well do you understand your target market's pain points and desires?",
    type: "scale", 
    category: "Market Understanding",
  },
  {
    id: "competitive_advantage",
    question: "What makes your brand different from competitors?",
    type: "multiple_choice",
    options: [
      "Unique product features",
      "Superior customer service",
      "Better pricing strategy",
      "Strong brand story/mission",
      "I'm not sure"
    ],
    category: "Positioning",
  },
  {
    id: "marketing_channels",
    question: "Which marketing channels are currently most effective for your brand?",
    type: "multiple_choice",
    options: [
      "Social media",
      "Email marketing", 
      "Content marketing/SEO",
      "Paid advertising",
      "Word of mouth/referrals",
      "Not sure/none working well"
    ],
    category: "Marketing",
  },
  {
    id: "brand_goals",
    question: "What is your primary brand development goal for the next 6 months?",
    type: "text",
    category: "Goals",
  },
];

export default function Quiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);

  const { data: quizzes } = useQuery({
    queryKey: ["/api/quizzes"],
  });

  const { data: userResults } = useQuery({
    queryKey: ["/api/user/quiz-results"],
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: { quizId: number; answers: any; score: number }) => {
      const response = await apiRequest("POST", `/api/quizzes/${data.quizId}/submit`, {
        answers: data.answers,
        score: data.score,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quiz-results"] });
      setResults(data);
      setIsCompleted(true);
      toast({
        title: "Assessment Complete",
        description: "Your brand health assessment has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [sampleQuestions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate a simple score based on answers
    let score = 0;
    let totalQuestions = 0;

    sampleQuestions.forEach(q => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        totalQuestions++;
        if (q.type === "scale") {
          score += (answer / 5) * 20; // Convert 1-5 scale to percentage
        } else if (q.type === "multiple_choice") {
          score += 15; // Give points for answering
        } else if (q.type === "text" && answer.trim()) {
          score += 10; // Give points for text responses
        }
      }
    });

    const finalScore = totalQuestions > 0 ? score / totalQuestions : 0;

    // For demo purposes, use quiz ID 1 (in real app, would be selected quiz)
    submitQuizMutation.mutate({
      quizId: 1,
      answers,
      score: finalScore / 100, // Convert to 0-1 scale
    });
  };

  const canProceed = () => {
    const currentAnswer = answers[sampleQuestions[currentQuestion]?.id];
    if (sampleQuestions[currentQuestion]?.type === "text") {
      return currentAnswer && currentAnswer.trim().length > 0;
    }
    return currentAnswer !== undefined;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600"; 
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  if (isCompleted && results) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Assessment Complete!</h1>
          <p className="text-slate-600">Here are your personalized brand development insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Your Brand Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {Math.round((results.score || 0) * 100)}%
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {getScoreLabel((results.score || 0) * 100)}
                  </Badge>
                </div>
                <Progress value={(results.score || 0) * 100} className="h-4 mb-4" />
                <p className="text-slate-600 text-center">
                  Based on your responses, here's how your brand development is progressing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Recommended Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Complete Brand Foundation Course</h4>
                      <p className="text-sm text-slate-600">Start with the Architect track to build your strategic foundation.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Join Community Discussions</h4>
                      <p className="text-sm text-slate-600">Connect with other entrepreneurs and share your experiences.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Schedule AI Strategy Session</h4>
                      <p className="text-sm text-slate-600">Get personalized insights from our AI Brand Advisor.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Areas of Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Brand Strategy</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Understanding</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Positioning</span>
                      <span className="font-medium">58%</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Marketing</span>
                      <span className="font-medium">41%</span>
                    </div>
                    <Progress value={41} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Start Architect Course
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Book AI Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => window.location.href = "/"} size="lg">
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Brand Health Assessment</h1>
        <p className="text-slate-600">
          Discover your brand's strengths and areas for improvement with our comprehensive assessment
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Progress</span>
          <span>{currentQuestion + 1} of {sampleQuestions.length}</span>
        </div>
        <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{sampleQuestions[currentQuestion]?.category}</Badge>
            <span className="text-sm text-slate-500">
              Question {currentQuestion + 1}
            </span>
          </div>
          <CardTitle className="text-xl">
            {sampleQuestions[currentQuestion]?.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sampleQuestions[currentQuestion]?.type === "scale" && (
            <RadioGroup
              value={answers[sampleQuestions[currentQuestion].id]?.toString()}
              onValueChange={(value) => handleAnswerChange(parseInt(value))}
            >
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                      {rating === 1 && "Very Poor"}
                      {rating === 2 && "Poor"}
                      {rating === 3 && "Fair"}
                      {rating === 4 && "Good"}
                      {rating === 5 && "Excellent"}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {sampleQuestions[currentQuestion]?.type === "multiple_choice" && (
            <RadioGroup
              value={answers[sampleQuestions[currentQuestion].id]}
              onValueChange={handleAnswerChange}
            >
              <div className="space-y-3">
                {sampleQuestions[currentQuestion].options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {sampleQuestions[currentQuestion]?.type === "text" && (
            <Textarea
              placeholder="Please share your thoughts..."
              value={answers[sampleQuestions[currentQuestion].id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={4}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed() || submitQuizMutation.isPending}
        >
          {currentQuestion === sampleQuestions.length - 1 ? (
            submitQuizMutation.isPending ? "Submitting..." : "Complete Assessment"
          ) : (
            "Next"
          )}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Previous Results */}
      {userResults && userResults.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Previous Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userResults.slice(0, 3).map((result: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Brand Health Assessment</p>
                    <p className="text-sm text-slate-600">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {Math.round((result.score || 0) * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
