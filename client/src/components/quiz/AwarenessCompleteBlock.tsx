import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

interface AwarenessCompleteBlockProps {
  onContinue: () => void;
}

export default function AwarenessCompleteBlock({ onContinue }: AwarenessCompleteBlockProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Awareness of your opposite Complete
                </h2>
                <p className="text-purple-600 font-medium mb-6">
                  Analyzing your entrepreneurial patterns...
                </p>
              </div>

              <div className="space-y-4 text-left mb-8">
                <p className="text-gray-700">
                  Based on your responses, we're identifying your core entrepreneurial 
                  tendencies. The next questions will help us understand your 
                  awareness level and decision-making patterns.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Your approach to problem-solving is taking shape
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Decision-making patterns are becoming clearer
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Core entrepreneurial instincts are emerging
                  </div>
                </div>
              </div>

              <Button 
                onClick={onContinue}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
              >
                Continue Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}