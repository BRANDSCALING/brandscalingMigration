import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Target, Lightbulb } from 'lucide-react';

interface AnalysisBlockProps {
  stage: 'awareness' | 'subtype' | 'validation';
  onContinue: () => void;
}

const AnalysisBlock: React.FC<AnalysisBlockProps> = ({ stage, onContinue }) => {
  const getAnalysisContent = () => {
    switch (stage) {
      case 'awareness':
        return {
          icon: <Brain className="w-8 h-8 text-purple-600" />,
          title: "Initial DNA Detection Complete",
          subtitle: "Analyzing your entrepreneurial patterns...",
          description: "Based on your responses, we're identifying your core entrepreneurial tendencies. The next questions will help us understand your awareness level and decision-making patterns.",
          insights: [
            "Your approach to problem-solving is taking shape",
            "Decision-making patterns are becoming clearer", 
            "Core entrepreneurial instincts are emerging"
          ]
        };
      case 'subtype':
        return {
          icon: <Target className="w-8 h-8 text-purple-600" />,
          title: "Awareness Level Identified",
          subtitle: "Diving deeper into your entrepreneurial subtype...", 
          description: "Your awareness patterns are now clear. The following questions will pinpoint your specific entrepreneurial subtype and reveal your unique operating style.",
          insights: [
            "Your self-awareness level is mapped",
            "Business approach preferences are defined",
            "Ready to identify your specific subtype"
          ]
        };
      case 'validation':
        return {
          icon: <Lightbulb className="w-8 h-8 text-purple-600" />,
          title: "Subtype Analysis Complete", 
          subtitle: "Final validation in progress...",
          description: "Your entrepreneurial subtype has been identified. These final questions will validate and confirm your complete DNA profile.",
          insights: [
            "Your entrepreneurial subtype is determined",
            "Operating patterns are well-defined",
            "Final validation will complete your profile"
          ]
        };
      default:
        return {
          icon: <Brain className="w-8 h-8 text-purple-600" />,
          title: "Analysis in Progress",
          subtitle: "Processing your responses...",
          description: "Continuing with your entrepreneurial DNA assessment.",
          insights: []
        };
    }
  };

  const content = getAnalysisContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            {content.icon}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {content.title}
          </h2>
          
          <p className="text-xl text-purple-600 font-medium mb-6">
            {content.subtitle}
          </p>
          
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            {content.description}
          </p>
          
          <div className="space-y-3 mb-8">
            {content.insights.map((insight, index) => (
              <div key={index} className="flex items-center justify-center text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>{insight}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={onContinue}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200"
            >
              Continue Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisBlock;