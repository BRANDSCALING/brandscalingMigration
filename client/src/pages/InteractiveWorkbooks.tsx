import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  Circle,
  BookOpen,
  Brain,
  Lightbulb,
  Save,
  RefreshCw
} from 'lucide-react';

interface WorkbookQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'multiple_choice' | 'scale';
  options?: string[];
  required: boolean;
  dnaSpecific?: 'architect' | 'alchemist' | 'both';
}

interface Workbook {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dnaTrack: 'architect' | 'alchemist' | 'both';
  questions: WorkbookQuestion[];
  estimatedTime: number;
  requiredTier: string;
}

interface WorkbookResponse {
  questionId: string;
  answer: string;
  timestamp: Date;
}

interface UserWorkbookProgress {
  workbookId: string;
  responses: WorkbookResponse[];
  completedAt?: Date;
  downloadUrl?: string;
}

export default function InteractiveWorkbooks() {
  const [selectedWorkbook, setSelectedWorkbook] = useState<Workbook | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockWorkbooks: Workbook[] = [
    {
      id: 'business-model-canvas',
      title: 'Business Model Canvas Workshop',
      description: 'Comprehensive guide to creating your business model canvas with DNA-specific insights',
      category: 'Strategy',
      difficulty: 'intermediate',
      dnaTrack: 'both',
      estimatedTime: 45,
      requiredTier: 'beginner',
      questions: [
        {
          id: 'value_proposition',
          question: 'What unique value does your business provide to customers?',
          type: 'textarea',
          required: true,
          dnaSpecific: 'both'
        },
        {
          id: 'customer_segments',
          question: 'Who are your target customer segments?',
          type: 'textarea',
          required: true,
          dnaSpecific: 'both'
        },
        {
          id: 'approach_style',
          question: 'How do you prefer to approach business planning?',
          type: 'multiple_choice',
          options: ['Systematic analysis', 'Intuitive exploration', 'Balanced approach'],
          required: true,
          dnaSpecific: 'both'
        }
      ]
    },
    {
      id: 'architect-systems-design',
      title: 'Systems & Process Design',
      description: 'Structure your business operations with systematic frameworks',
      category: 'Operations',
      difficulty: 'advanced',
      dnaTrack: 'architect',
      estimatedTime: 60,
      requiredTier: 'intermediate',
      questions: [
        {
          id: 'current_processes',
          question: 'Document your current business processes and identify inefficiencies',
          type: 'textarea',
          required: true,
          dnaSpecific: 'architect'
        },
        {
          id: 'optimization_priorities',
          question: 'Rate the importance of optimizing different areas (1-10)',
          type: 'scale',
          required: true,
          dnaSpecific: 'architect'
        }
      ]
    },
    {
      id: 'alchemist-vision-alignment',
      title: 'Vision & Purpose Alignment',
      description: 'Connect deeply with your business purpose and emotional drivers',
      category: 'Purpose',
      difficulty: 'intermediate',
      dnaTrack: 'alchemist',
      estimatedTime: 40,
      requiredTier: 'beginner',
      questions: [
        {
          id: 'core_purpose',
          question: 'What deeply drives you to build this business? Connect with your emotions.',
          type: 'textarea',
          required: true,
          dnaSpecific: 'alchemist'
        },
        {
          id: 'vision_clarity',
          question: 'Describe your vision as if you\'re painting a vivid picture',
          type: 'textarea',
          required: true,
          dnaSpecific: 'alchemist'
        }
      ]
    }
  ];

  const { data: userProfile } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false
  });

  const { data: workbookProgress } = useQuery({
    queryKey: ['/api/workbooks/progress'],
    retry: false
  });

  const generateWorkbookMutation = useMutation({
    mutationFn: async (data: { workbookId: string; responses: Record<string, string> }) => {
      const response = await fetch('/api/workbooks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to generate workbook');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workbooks/progress'] });
    },
  });

  const uploadWorkbookMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/workbooks/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload workbook');
      return response.json();
    },
  });

  const handleAnswerChange = (questionId: string, answer: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (selectedWorkbook && currentQuestionIndex < selectedWorkbook.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleCompleteWorkbook = () => {
    if (selectedWorkbook) {
      generateWorkbookMutation.mutate({
        workbookId: selectedWorkbook.id,
        responses
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const getProgressPercentage = () => {
    if (!selectedWorkbook) return 0;
    const totalQuestions = selectedWorkbook.questions.length;
    const answeredQuestions = Object.keys(responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const getDnaIcon = (dnaTrack: string) => {
    switch (dnaTrack) {
      case 'architect': return <Brain className="h-4 w-4" />;
      case 'alchemist': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDnaColor = (dnaTrack: string) => {
    switch (dnaTrack) {
      case 'architect': return 'bg-blue-100 text-blue-800';
      case 'alchemist': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedWorkbook) {
    const currentQuestion = selectedWorkbook.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === selectedWorkbook.questions.length - 1;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedWorkbook(null);
                setCurrentQuestionIndex(0);
                setResponses({});
              }}
              className="mb-4"
            >
              ← Back to Workbooks
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedWorkbook.title}</h1>
                <p className="text-gray-600 mt-1">{selectedWorkbook.description}</p>
              </div>
              <Badge className={getDnaColor(selectedWorkbook.dnaTrack)}>
                {getDnaIcon(selectedWorkbook.dnaTrack)}
                <span className="ml-1 capitalize">{selectedWorkbook.dnaTrack}</span>
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {selectedWorkbook.questions.length}
                </span>
                <span className="text-sm text-gray-600">{getProgressPercentage()}% Complete</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
              {currentQuestion.required && (
                <Badge variant="outline" className="w-fit">Required</Badge>
              )}
            </CardHeader>
            <CardContent>
              {currentQuestion.type === 'text' && (
                <Input
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full"
                />
              )}
              
              {currentQuestion.type === 'textarea' && (
                <Textarea
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Enter your detailed answer..."
                  className="w-full min-h-32"
                />
              )}
              
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option}
                        checked={responses[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {isLastQuestion ? (
              <Button
                onClick={handleCompleteWorkbook}
                disabled={generateWorkbookMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {generateWorkbookMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Workbook
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestion.required && !responses[currentQuestion.id]}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Interactive Workbooks</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete DNA-personalized workbooks to structure your business thinking and generate 
            downloadable resources tailored to your entrepreneurial type.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Your Own Workbook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Upload PDF or DOCX files to convert into interactive workbooks
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose Files
              </Button>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Uploaded Files:</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline">Pending Processing</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Workbooks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWorkbooks.map((workbook) => (
            <Card key={workbook.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{workbook.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-3">{workbook.description}</p>
                  </div>
                  <Badge className={getDnaColor(workbook.dnaTrack)}>
                    {getDnaIcon(workbook.dnaTrack)}
                    <span className="ml-1 capitalize">{workbook.dnaTrack}</span>
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{workbook.category}</Badge>
                  <Badge variant="outline" className="capitalize">{workbook.difficulty}</Badge>
                  <Badge variant="outline">{workbook.estimatedTime} min</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {workbook.questions.length} questions
                  </span>
                  <Button 
                    onClick={() => setSelectedWorkbook(workbook)}
                    size="sm"
                  >
                    Start Workbook
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completed Workbooks */}
        {workbookProgress && workbookProgress.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Completed Workbooks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workbookProgress.map((progress: UserWorkbookProgress) => (
                <Card key={progress.workbookId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Workbook Complete</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Completed on {progress.completedAt?.toLocaleDateString()}
                    </p>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}