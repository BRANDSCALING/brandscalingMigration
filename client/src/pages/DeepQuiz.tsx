import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { 
  Brain, 
  FileQuestion
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

const deepQuizQuestions: Question[] = [];

export default function DeepQuiz() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation('/');
    return null;
  }

  // Show empty state when no questions are configured
  if (deepQuizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Brain className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Deep Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The deep assessment is currently being configured. Please check back soon.
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Assessment Not Available
                </h3>
                <p className="text-gray-600 mb-6">
                  No questions have been configured for the deep assessment yet.
                </p>
                <Button onClick={() => setLocation('/')} className="w-full">
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Brain className="h-16 w-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deep Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your business scaling blueprint with our comprehensive assessment.
          </p>
        </div>
      </div>
    </div>
  );
}