import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";
import type { ViabilityScores } from "@/types/workbook";

interface ViabilityScorecardProps {
  session: WorkbookSession | undefined;
}

export default function ViabilityScorecard({ session }: ViabilityScorecardProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [scores, setScores] = useState<ViabilityScores>(
    session?.viabilityScores || {
      clarity: 0,
      demand: 0,
      differentiation: 0,
      delivery: 0,
      scalability: 0,
      profitability: 0,
      competition: 0,
      energy: 0
    }
  );

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      return apiRequest("PATCH", `/api/workbook/session`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your viability scores have been saved.",
      });
    },
  });

  const handleScoreChange = (key: keyof ViabilityScores, value: number) => {
    const updatedScores = { ...scores, [key]: value };
    setScores(updatedScores);
    updateSessionMutation.mutate({ viabilityScores: updatedScores });
  };

  const criteria = [
    {
      key: "clarity" as keyof ViabilityScores,
      title: "Clarity",
      description: "How clear is your business concept and target audience?"
    },
    {
      key: "demand" as keyof ViabilityScores,
      title: "Market Demand",
      description: "How strong is the market demand for your solution?"
    },
    {
      key: "differentiation" as keyof ViabilityScores,
      title: "Differentiation", 
      description: "How unique is your approach compared to alternatives?"
    },
    {
      key: "delivery" as keyof ViabilityScores,
      title: "Delivery Capability",
      description: "How confident are you in your ability to deliver results?"
    },
    {
      key: "scalability" as keyof ViabilityScores,
      title: "Scalability",
      description: "How easily can this business model scale beyond you?"
    },
    {
      key: "profitability" as keyof ViabilityScores,
      title: "Profitability",
      description: "How clear is the path to profitable unit economics?"
    },
    {
      key: "competition" as keyof ViabilityScores,
      title: "Competitive Advantage",
      description: "How defensible is your position in the market?"
    },
    {
      key: "energy" as keyof ViabilityScores,
      title: "Energy Alignment",
      description: "How energized and motivated are you about this business?"
    }
  ];

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / criteria.length;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getOverallAssessment = (avg: number) => {
    if (avg >= 8) return { color: "text-green-600", text: "Strong viability - ready to move forward" };
    if (avg >= 6) return { color: "text-yellow-600", text: "Moderate viability - address weak areas" };
    return { color: "text-red-600", text: "Needs work - focus on improvement areas" };
  };

  return (
    <Card id="viability-scorecard" className="p-4 sm:p-6 lg:p-8 bg-purple-50 border-purple-200">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1.5</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Idea Viability Scorecard</h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          Rate each aspect of your business idea from 1 (very weak) to 10 (very strong). Be honest - this helps identify what to focus on.
        </p>
        
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">8-Pillar Assessment</h3>
          <p className="text-gray-700">
            This scorecard covers the essential elements of a viable business: clarity, market demand, 
            differentiation, delivery capability, scalability, profitability, competitive advantage, and energy alignment.
          </p>
        </div>
      </div>

      {/* DNA-Specific Coaching */}
      <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg border ${
        isArchitect 
          ? "bg-purple-100 border-purple-300" 
          : "bg-orange-50 border-orange-200"
      }`}>
        <h3 className={`font-semibold mb-4 ${
          isArchitect ? "text-purple-600" : "text-orange-500"
        }`}>
          {isArchitect ? "Architect Focus Areas" : "Alchemist Focus Areas"}
        </h3>
        <div className="text-gray-700">
          {isArchitect ? (
            <p>Pay special attention to delivery capability, scalability, and profitability. These are your natural strengths, but don't neglect energy alignment and differentiation.</p>
          ) : (
            <p>Pay special attention to energy alignment, differentiation, and market demand. These are your natural strengths, but don't neglect delivery capability and scalability.</p>
          )}
        </div>
      </div>

      {/* Scoring Grid */}
      <div className="space-y-4">
        {criteria.map((criterion, index) => (
          <div key={criterion.key} className="p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{criterion.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{criterion.description}</p>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 min-w-[80px]">1 (weak)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores[criterion.key]}
                    onChange={(e) => handleScoreChange(criterion.key, Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 min-w-[80px]">10 (strong)</span>
                  <span className={`font-bold text-lg min-w-[40px] ${getScoreColor(scores[criterion.key])}`}>
                    {scores[criterion.key]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Assessment */}
      <div className="mt-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Overall Viability Score</h3>
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {averageScore.toFixed(1)}/10
          </div>
          <div className={`font-medium ${getOverallAssessment(averageScore).color}`}>
            {getOverallAssessment(averageScore).text}
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-900">Total Score</div>
              <div className="text-purple-600 font-bold">{totalScore}/80</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Highest</div>
              <div className="text-green-600 font-bold">{Math.max(...Object.values(scores))}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Lowest</div>
              <div className="text-red-600 font-bold">{Math.min(...Object.values(scores))}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Range</div>
              <div className="text-gray-600 font-bold">{Math.max(...Object.values(scores)) - Math.min(...Object.values(scores))}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}