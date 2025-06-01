import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import { useLocation } from 'wouter';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Lock,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  category: 'strengths' | 'learning' | 'focus' | 'fears' | 'motivation' | 'approach';
  options: {
    text: string;
    architectScore: number;
    alchemistScore: number;
    readinessScore: number;
    tags: string[];
  }[];
}

const deepQuizQuestions: Question[] = [
  {
    id: 1,
    category: 'strengths',
    text: "What's your greatest strength when building a business?",
    options: [
      {
        text: "Creating systematic processes and frameworks",
        architectScore: 10,
        alchemistScore: 2,
        readinessScore: 8,
        tags: ['systematic', 'process-oriented', 'builder']
      },
      {
        text: "Inspiring others and building emotional connections",
        architectScore: 2,
        alchemistScore: 10,
        readinessScore: 7,
        tags: ['inspirational', 'people-focused', 'connector']
      },
      {
        text: "Analyzing data and making strategic decisions",
        architectScore: 8,
        alchemistScore: 3,
        readinessScore: 9,
        tags: ['analytical', 'strategic', 'decision-maker']
      },
      {
        text: "Creative problem-solving and innovation",
        architectScore: 4,
        alchemistScore: 8,
        readinessScore: 6,
        tags: ['creative', 'innovative', 'problem-solver']
      }
    ]
  },
  {
    id: 2,
    category: 'learning',
    text: "How do you prefer to learn new business concepts?",
    options: [
      {
        text: "Step-by-step tutorials with clear frameworks",
        architectScore: 10,
        alchemistScore: 1,
        readinessScore: 8,
        tags: ['structured-learner', 'framework-focused']
      },
      {
        text: "Case studies and real-world examples",
        architectScore: 6,
        alchemistScore: 6,
        readinessScore: 9,
        tags: ['practical-learner', 'example-driven']
      },
      {
        text: "Interactive experiences and workshops",
        architectScore: 3,
        alchemistScore: 9,
        readinessScore: 7,
        tags: ['experiential-learner', 'hands-on']
      },
      {
        text: "Visual content and storytelling",
        architectScore: 2,
        alchemistScore: 10,
        readinessScore: 6,
        tags: ['visual-learner', 'story-driven']
      }
    ]
  },
  {
    id: 3,
    category: 'focus',
    text: "What's your primary focus when scaling a business?",
    options: [
      {
        text: "Optimizing operations and increasing efficiency",
        architectScore: 10,
        alchemistScore: 2,
        readinessScore: 9,
        tags: ['efficiency-focused', 'operations-minded']
      },
      {
        text: "Building brand presence and emotional connection",
        architectScore: 2,
        alchemistScore: 10,
        readinessScore: 7,
        tags: ['brand-focused', 'emotion-driven']
      },
      {
        text: "Revenue growth and profit maximization",
        architectScore: 8,
        alchemistScore: 4,
        readinessScore: 10,
        tags: ['revenue-focused', 'profit-driven']
      },
      {
        text: "Creating transformational client experiences",
        architectScore: 4,
        alchemistScore: 8,
        readinessScore: 8,
        tags: ['experience-focused', 'transformation-oriented']
      }
    ]
  },
  {
    id: 4,
    category: 'fears',
    text: "What's your biggest fear when scaling your business?",
    options: [
      {
        text: "Losing control of quality and standards",
        architectScore: 8,
        alchemistScore: 3,
        readinessScore: 6,
        tags: ['quality-concerned', 'control-oriented']
      },
      {
        text: "Losing personal connection with clients",
        architectScore: 3,
        alchemistScore: 8,
        readinessScore: 5,
        tags: ['connection-concerned', 'relationship-focused']
      },
      {
        text: "Making the wrong strategic decisions",
        architectScore: 7,
        alchemistScore: 4,
        readinessScore: 4,
        tags: ['decision-anxious', 'strategy-cautious']
      },
      {
        text: "Burning out from overwhelming complexity",
        architectScore: 5,
        alchemistScore: 6,
        readinessScore: 3,
        tags: ['burnout-concerned', 'overwhelm-prone']
      }
    ]
  },
  {
    id: 5,
    category: 'motivation',
    text: "What motivates you most about business growth?",
    options: [
      {
        text: "Building something that works perfectly at scale",
        architectScore: 10,
        alchemistScore: 2,
        readinessScore: 9,
        tags: ['perfection-driven', 'scale-focused']
      },
      {
        text: "Creating positive impact and transformation",
        architectScore: 3,
        alchemistScore: 10,
        readinessScore: 8,
        tags: ['impact-driven', 'transformation-focused']
      },
      {
        text: "Achieving financial freedom and security",
        architectScore: 7,
        alchemistScore: 4,
        readinessScore: 10,
        tags: ['financial-motivated', 'security-focused']
      },
      {
        text: "Expressing creativity and innovation",
        architectScore: 2,
        alchemistScore: 9,
        readinessScore: 6,
        tags: ['creativity-driven', 'innovation-focused']
      }
    ]
  },
  {
    id: 6,
    category: 'approach',
    text: "How do you approach major business decisions?",
    options: [
      {
        text: "Thorough analysis with detailed planning",
        architectScore: 10,
        alchemistScore: 1,
        readinessScore: 8,
        tags: ['analytical-decision-maker', 'planning-focused']
      },
      {
        text: "Trust intuition and gut feelings",
        architectScore: 1,
        alchemistScore: 10,
        readinessScore: 5,
        tags: ['intuitive-decision-maker', 'gut-driven']
      },
      {
        text: "Consult data and seek expert advice",
        architectScore: 8,
        alchemistScore: 3,
        readinessScore: 9,
        tags: ['data-driven', 'expert-consulter']
      },
      {
        text: "Test quickly and iterate based on results",
        architectScore: 6,
        alchemistScore: 7,
        readinessScore: 10,
        tags: ['test-and-learn', 'agile-approach']
      }
    ]
  }
];

export default function DeepQuiz() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  // Check if user has access (must be a buyer or mastermind)
  const hasAccess = user?.role && ['buyer', 'mastermind'].includes(user.role);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to access the deep assessment.",
        variant: "destructive",
      });
      setTimeout(() => setLocation('/'), 2000);
    } else if (!isLoading && isAuthenticated && !hasAccess) {
      toast({
        title: "Access Required",
        description: "Please purchase a plan to access the deep assessment.",
        variant: "destructive",
      });
      setTimeout(() => setLocation('/'), 2000);
    }
  }, [isAuthenticated, isLoading, hasAccess, toast, setLocation]);

  const submitQuizMutation = useMutation({
    mutationFn: async (results: any) => {
      const response = await apiRequest('POST', '/api/quiz/deep-assessment', results);
      return response;
    },
    onSuccess: (data) => {
      setIsComplete(true);
      toast({
        title: "Assessment Complete!",
        description: "Your personalized profile has been created.",
      });
      
      // Store results locally for immediate use
      localStorage.setItem('deep-assessment-result', JSON.stringify(data));
      
      // Redirect to LMS after a moment
      setTimeout(() => {
        setLocation('/lms');
      }, 3000);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        setTimeout(() => setLocation('/'), 2000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save assessment results. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = { ...answers, [currentQuestion]: answerIndex };
    setAnswers(newAnswers);
    
    if (currentQuestion < deepQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      let architectScore = 0;
      let alchemistScore = 0;
      let readinessScore = 0;
      const allTags: string[] = [];
      
      Object.entries(newAnswers).forEach(([questionIndex, answerIndex]) => {
        const question = deepQuizQuestions[parseInt(questionIndex)];
        const answer = question.options[answerIndex];
        
        architectScore += answer.architectScore;
        alchemistScore += answer.alchemistScore;
        readinessScore += answer.readinessScore;
        allTags.push(...answer.tags);
      });
      
      const totalPossibleScore = deepQuizQuestions.length * 10;
      const architectPercentage = Math.round((architectScore / totalPossibleScore) * 100);
      const alchemistPercentage = Math.round((alchemistScore / totalPossibleScore) * 100);
      const readinessPercentage = Math.round((readinessScore / totalPossibleScore) * 100);
      
      const dominantType = architectScore > alchemistScore ? 'architect' : 'alchemist';
      const readinessLevel = readinessPercentage >= 80 ? 'advanced' : readinessPercentage >= 60 ? 'builder' : 'starter';
      
      // Count tag frequencies
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag);
      
      const results = {
        answers: newAnswers,
        architectScore: architectPercentage,
        alchemistScore: alchemistPercentage,
        readinessScore: readinessPercentage,
        dominantType,
        readinessLevel,
        tags: topTags,
        completedAt: new Date().toISOString()
      };
      
      submitQuizMutation.mutate(results);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Access Required</h3>
            <p className="text-gray-600 mb-4">
              The deep assessment is available to users who have purchased a plan.
            </p>
            <Button onClick={() => setLocation('/')}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Assessment Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your personalized brandscaling profile has been created. This will customize your LMS experience, 
              AI assistant responses, and recommended learning path.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Brain className="h-3 w-3 mr-1" />
                Profile Updated
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <Target className="h-3 w-3 mr-1" />
                Learning Path Set
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Personalized
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to your personalized LMS dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = deepQuizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / deepQuizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Deep Brandscaling Assessment
          </h1>
          <p className="text-gray-600 text-lg">
            Unlock your personalized brandscaling strategy with this comprehensive assessment
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {deepQuizQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                question.category === 'strengths' ? 'bg-purple-100' :
                question.category === 'learning' ? 'bg-blue-100' :
                question.category === 'focus' ? 'bg-green-100' :
                question.category === 'fears' ? 'bg-red-100' :
                question.category === 'motivation' ? 'bg-yellow-100' :
                'bg-orange-100'
              }`}>
                {question.category === 'strengths' && <TrendingUp className="h-5 w-5 text-purple-600" />}
                {question.category === 'learning' && <Brain className="h-5 w-5 text-blue-600" />}
                {question.category === 'focus' && <Target className="h-5 w-5 text-green-600" />}
                {question.category === 'fears' && <Heart className="h-5 w-5 text-red-600" />}
                {question.category === 'motivation' && <Zap className="h-5 w-5 text-yellow-600" />}
                {question.category === 'approach' && <Sparkles className="h-5 w-5 text-orange-600" />}
              </div>
              <Badge variant="outline" className="capitalize">
                {question.category}
              </Badge>
            </div>
            <CardTitle className="text-xl">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50 hover:border-purple-300"
                  onClick={() => handleAnswer(index)}
                  disabled={submitQuizMutation.isPending}
                >
                  <span className="whitespace-normal">{option.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentQuestion === 0 || submitQuizMutation.isPending}
          >
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            {submitQuizMutation.isPending && "Processing your results..."}
          </div>
        </div>
      </div>
    </div>
  );
}