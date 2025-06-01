import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileQuestion, Brain } from 'lucide-react';

const questions: any[] = [];

export default function Quiz() {
  const [, setLocation] = useLocation();

  // Show empty state when no questions are configured
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Brain className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Business Type Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The assessment is currently being configured. Please check back soon.
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quiz Not Available
                </h3>
                <p className="text-gray-600 mb-6">
                  No questions have been configured for the quiz yet.
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
            Assessment Coming Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our business assessment tool is being developed.
          </p>
        </div>
      </div>
    </div>
  );
}