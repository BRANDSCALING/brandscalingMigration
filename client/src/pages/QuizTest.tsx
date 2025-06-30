import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

export default function QuizTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testArchitectAnswers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
        answers: Array.from({ length: 22 }, (_, i) => ({
          questionId: i + 1,
          answer: 'A'
        }))
      });
      setResult(response);
      console.log('Architect test result:', response);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const testAlchemistAnswers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
        answers: [
          { questionId: 1, answer: 'C' }, // Q1 Alchemist answer
          { questionId: 2, answer: 'B' }, // Q2 Alchemist answer
          { questionId: 3, answer: 'B' }, // Q3 Alchemist answer
          { questionId: 4, answer: 'B' }, // Q4 Alchemist answer
          { questionId: 5, answer: 'B' }, // Q5 Alchemist answer
          { questionId: 6, answer: 'B' }, // Q6 Alchemist answer
          ...Array.from({ length: 16 }, (_, i) => ({
            questionId: i + 7,
            answer: 'B'
          }))
        ]
      });
      setResult(response);
      console.log('Alchemist test result:', response);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const testMixedAnswers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/quiz/entrepreneurial-dna/submit', {
        answers: Array.from({ length: 22 }, (_, i) => ({
          questionId: i + 1,
          answer: ['A', 'B', 'C', 'D'][i % 4]
        }))
      });
      setResult(response);
      console.log('Mixed test result:', response);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Scoring Test</h1>
        
        <div className="space-y-4 mb-8">
          <Button onClick={testArchitectAnswers} disabled={loading} className="w-full">
            Test Architect Answers (All A's)
          </Button>
          <Button onClick={testAlchemistAnswers} disabled={loading} className="w-full">
            Test Alchemist Answers (C + B's)
          </Button>
          <Button onClick={testMixedAnswers} disabled={loading} className="w-full">
            Test Mixed Answers (Should be Blurred)
          </Button>
        </div>

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Test Result</h2>
            <div className="space-y-2">
              <p><strong>DNA Type:</strong> {result.dnaType}</p>
              <p><strong>Subtype:</strong> {result.subtype}</p>
              <p><strong>Awareness:</strong> {result.awarenessPercentage}%</p>
            </div>
            
            <h3 className="text-lg font-bold mt-4 mb-2">Full Response:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}