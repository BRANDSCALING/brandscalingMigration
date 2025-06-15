import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Download, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormAnswers {
  idea: string;
  problem: string;
  audience: string;
  timing: string;
  offer: string;
  monetization: string;
  costs: string;
  differentiation: string;
  obstacles: string;
  support: string;
}

interface BusinessModelOutput {
  audience: string;
  problem: string;
  solution: string;
  offer: string;
  deliveryModel: string;
  revenueModel: string;
  costDrivers: string;
  uniqueAdvantage: string;
  launchSteps: string[];
  warnings: string[];
  suggestions: string[];
  confidenceLevel: number;
}

const QUESTIONS = {
  architect: [
    {
      id: 'idea',
      title: 'What is your business idea?',
      description: 'Describe your core business concept in concrete terms.',
      placeholder: 'Example: A B2B SaaS platform that automates inventory management for retail chains.',
      tooltip: 'Be specific about the product/service and target market.'
    },
    {
      id: 'problem',
      title: 'What problem are you solving?',
      description: 'Define the exact problem your solution addresses.',
      placeholder: 'Example: Retail stores lose $1.1 trillion annually due to poor inventory management.',
      tooltip: 'Quantify the problem with data where possible.'
    },
    {
      id: 'audience',
      title: 'Who is your target customer?',
      description: 'Define your ideal customer profile with specifics.',
      placeholder: 'Example: Retail chain managers with 10-500 locations, $5M+ annual revenue.',
      tooltip: 'Include demographics, company size, and pain points.'
    },
    {
      id: 'timing',
      title: 'Why is now the right time?',
      description: 'What market conditions make this opportunity viable now?',
      placeholder: 'Example: Post-COVID supply chain issues increased demand for automated solutions.',
      tooltip: 'Consider market trends, technology changes, or regulatory shifts.'
    },
    {
      id: 'offer',
      title: 'What is your core offering?',
      description: 'Describe your product/service and its key features.',
      placeholder: 'Example: Cloud-based dashboard with real-time inventory tracking and predictive analytics.',
      tooltip: 'Focus on the main value proposition and deliverables.'
    },
    {
      id: 'monetization',
      title: 'How will you generate revenue?',
      description: 'Outline your pricing model and revenue streams.',
      placeholder: 'Example: Monthly SaaS subscription: $299/location + $0.10 per transaction.',
      tooltip: 'Be specific about pricing structure and payment terms.'
    },
    {
      id: 'costs',
      title: 'What are your main cost drivers?',
      description: 'List the primary expenses to deliver your solution.',
      placeholder: 'Example: Cloud hosting ($2K/month), development team ($15K/month), customer support.',
      tooltip: 'Include both fixed and variable costs.'
    },
    {
      id: 'differentiation',
      title: 'What makes you different from competitors?',
      description: 'Identify your unique competitive advantages.',
      placeholder: 'Example: Only solution with AI-powered demand forecasting and 99.9% uptime SLA.',
      tooltip: 'Focus on features, performance, or business model differences.'
    },
    {
      id: 'obstacles',
      title: 'What are your main launch obstacles?',
      description: 'Identify the biggest barriers to getting started.',
      placeholder: 'Example: Need $50K for initial development, acquiring first 10 pilot customers.',
      tooltip: 'Include funding, technical, regulatory, or market challenges.'
    },
    {
      id: 'support',
      title: 'What support do you need most?',
      description: 'Specify the help required to move forward.',
      placeholder: 'Example: Technical co-founder, $100K seed funding, introductions to retail executives.',
      tooltip: 'Prioritize the most critical gaps in your current setup.'
    }
  ],
  alchemist: [
    {
      id: 'idea',
      title: 'What vision is calling to you?',
      description: 'Share the business idea that excites and energizes you.',
      placeholder: 'Example: Creating a sanctuary where busy entrepreneurs can reconnect with their purpose.',
      tooltip: 'Describe what feels alive and meaningful to you.'
    },
    {
      id: 'problem',
      title: 'What pain are you here to heal?',
      description: 'What struggle or frustration do you feel called to address?',
      placeholder: 'Example: Entrepreneurs burning out because they\'ve lost connection to their deeper why.',
      tooltip: 'Think about the emotional or spiritual impact of this problem.'
    },
    {
      id: 'audience',
      title: 'Who are you meant to serve?',
      description: 'Describe the people whose lives you want to transform.',
      placeholder: 'Example: High-achieving entrepreneurs who feel successful but empty inside.',
      tooltip: 'Focus on the person behind the title - their hopes and fears.'
    },
    {
      id: 'timing',
      title: 'Why is this your moment?',
      description: 'What signs tell you this is the right time to step forward?',
      placeholder: 'Example: The pandemic made people question what truly matters in business.',
      tooltip: 'Consider cultural shifts, personal readiness, or collective awakening.'
    },
    {
      id: 'offer',
      title: 'How will you create transformation?',
      description: 'Describe the experience or journey you\'ll guide people through.',
      placeholder: 'Example: A 90-day immersive program combining business strategy with mindfulness practices.',
      tooltip: 'Think about the transformation, not just the deliverable.'
    },
    {
      id: 'monetization',
      title: 'How will abundance flow to you?',
      description: 'What feels aligned as an exchange for your gifts?',
      placeholder: 'Example: $5,000 for the 90-day transformation journey, payment plans available.',
      tooltip: 'Price based on transformation value, not just time or materials.'
    },
    {
      id: 'costs',
      title: 'What energy and resources will you invest?',
      description: 'What will it take from you to deliver this work?',
      placeholder: 'Example: Deep 1:1 time with clients, retreat venue costs, ongoing certification training.',
      tooltip: 'Consider emotional energy, time investment, and financial costs.'
    },
    {
      id: 'differentiation',
      title: 'What makes your approach uniquely yours?',
      description: 'What special perspective or gift do you bring?',
      placeholder: 'Example: I combine 15 years of business success with shamanic healing practices.',
      tooltip: 'Think about your unique life experience and perspective.'
    },
    {
      id: 'obstacles',
      title: 'What fears or resistance are you facing?',
      description: 'What internal or external blocks might hold you back?',
      placeholder: 'Example: Imposter syndrome about charging premium prices, fear of being too vulnerable.',
      tooltip: 'Include both practical challenges and inner resistance.'
    },
    {
      id: 'support',
      title: 'What support would feel most nourishing?',
      description: 'What help would allow you to show up fully in this work?',
      placeholder: 'Example: A business mentor who understands spiritual entrepreneurship, marketing support.',
      tooltip: 'Think about what would make you feel held and supported.'
    }
  ]
};

export default function SmartBusinessBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dnaType, setDnaType] = useState<'architect' | 'alchemist'>('architect');
  const [answers, setAnswers] = useState<FormAnswers>({
    idea: '',
    problem: '',
    audience: '',
    timing: '',
    offer: '',
    monetization: '',
    costs: '',
    differentiation: '',
    obstacles: '',
    support: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessModel, setBusinessModel] = useState<BusinessModelOutput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const currentQuestions = QUESTIONS[dnaType];
  const currentQuestion = currentQuestions[currentStep];
  const progress = ((currentStep + 1) / currentQuestions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < currentQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateModel = async () => {
    setIsGenerating(true);
    try {
      const result = await apiRequest('POST', '/api/build-model', {
        answers,
        dnaType
      });
      setBusinessModel(result);
      toast({
        title: "Business Model Generated",
        description: "Your personalized business model is ready!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveModel = async () => {
    if (!businessModel) return;
    
    setIsSaving(true);
    try {
      await apiRequest('POST', '/api/business-models', {
        dnaType,
        inputAnswers: answers,
        gptOutput: businessModel,
        confidenceScore: businessModel.confidenceLevel,
        title: `${dnaType} Model - ${new Date().toLocaleDateString()}`
      });
      toast({
        title: "Model Saved",
        description: "Your business model has been saved to your dashboard.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (businessModel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Your Smart Business Model</h1>
            <Badge variant="secondary" className={dnaType === 'architect' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}>
              {dnaType === 'architect' ? 'Architect' : 'Alchemist'} Perspective
            </Badge>
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>1-Page Business Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><strong>Audience:</strong> {businessModel.audience}</div>
                <div><strong>Problem:</strong> {businessModel.problem}</div>
                <div><strong>Solution:</strong> {businessModel.solution}</div>
                <div><strong>Offer:</strong> {businessModel.offer}</div>
                <div><strong>Delivery Model:</strong> {businessModel.deliveryModel}</div>
                <div><strong>Revenue Model:</strong> {businessModel.revenueModel}</div>
                <div><strong>Cost Drivers:</strong> {businessModel.costDrivers}</div>
                <div><strong>Unique Advantage:</strong> {businessModel.uniqueAdvantage}</div>
                <div>
                  <strong>Launch Priority Steps:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {businessModel.launchSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Warnings / Fixes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {businessModel.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Suggestions to Improve</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {businessModel.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Confidence Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">{businessModel.confidenceLevel}/10</div>
                  <Progress value={businessModel.confidenceLevel * 10} className="flex-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={handleSaveModel} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save My Model
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download as PDF
            </Button>
            <Button variant="outline" onClick={() => setBusinessModel(null)}>
              Create Another Model
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-4">Smart Business Builder™</h1>
            <p className="text-gray-600 mb-6">
              Build a viable business model tailored to your Entrepreneurial DNA
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className={`font-medium ${dnaType === 'architect' ? 'text-purple-600' : 'text-gray-400'}`}>
                Architect
              </span>
              <Switch
                checked={dnaType === 'alchemist'}
                onCheckedChange={(checked) => setDnaType(checked ? 'alchemist' : 'architect')}
              />
              <span className={`font-medium ${dnaType === 'alchemist' ? 'text-orange-600' : 'text-gray-400'}`}>
                Alchemist
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentStep + 1} of {currentQuestions.length}
              </span>
              <Badge variant="outline" className={dnaType === 'architect' ? 'border-purple-300' : 'border-orange-300'}>
                {dnaType === 'architect' ? 'Logic-Based' : 'Emotion-Based'}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{currentQuestion.title}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded" title={currentQuestion.tooltip}>
                ?
              </span>
            </CardTitle>
            <p className="text-gray-600">{currentQuestion.description}</p>
          </CardHeader>
          <CardContent>
            <Label htmlFor="answer">Your Response</Label>
            <Textarea
              id="answer"
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.id as keyof FormAnswers]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === currentQuestions.length - 1 ? (
            <Button
              onClick={handleGenerateModel}
              disabled={!answers[currentQuestion.id as keyof FormAnswers] || isGenerating}
              className={dnaType === 'architect' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Building Model...
                </>
              ) : (
                'Build My Model'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id as keyof FormAnswers]}
              className={dnaType === 'architect' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}