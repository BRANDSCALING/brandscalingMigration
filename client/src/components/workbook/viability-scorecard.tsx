import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";

interface ViabilityScorecardProps {
  session: WorkbookSession | undefined;
}

export default function ViabilityScorecard({ session }: ViabilityScorecardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [scores, setScores] = useState(
    session?.viabilityScores || {
      clarity: 0,
      demand: 0,
      differentiation: 0
    }
  );

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      if (!session?.id) throw new Error("No session ID");
      return apiRequest("PATCH", `/api/workbook/session/${session.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your viability scores have been saved.",
      });
    },
  });

  const handleScoreChange = (key: string, value: number) => {
    const updatedScores = { ...scores, [key]: value };
    setScores(updatedScores);
    updateSessionMutation.mutate({ viabilityScores: updatedScores });
  };

  const categories = [
    {
      key: "clarity",
      title: "Idea Clarity",
      description: "How clear and well-defined is your business concept?"
    },
    {
      key: "demand", 
      title: "Market Demand",
      description: "How strong is the demand for your solution?"
    },
    {
      key: "differentiation",
      title: "Differentiation",
      description: "How unique and different is your approach?"
    }
  ];

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxScore = categories.length * 10;
  const percentage = Math.round((totalScore / maxScore) * 100);

  return (
    <section id="viability-scorecard" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            5
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Idea Viability Scorecard</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Rate your business concept across key viability factors.
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.key} className="p-6 bg-gray-50 border border-gray-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-700 mb-4">{category.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 mr-4">Score: {scores[category.key as keyof typeof scores]}/10</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <Button
                    key={score}
                    onClick={() => handleScoreChange(category.key, score)}
                    variant={scores[category.key as keyof typeof scores] >= score ? "default" : "outline"}
                    size="sm"
                    className={`w-8 h-8 p-0 ${
                      scores[category.key as keyof typeof scores] >= score 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : ""
                    }`}
                  >
                    {score}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Overall Viability Score</h3>
          <div className="text-4xl font-bold text-purple-600 mb-4">{totalScore}/{maxScore}</div>
          <div className="text-xl text-gray-700 mb-4">{percentage}% Viable</div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <p className="text-gray-600">
            {percentage >= 80 ? "Excellent viability! Your idea shows strong potential." :
             percentage >= 60 ? "Good viability with room for improvement." :
             percentage >= 40 ? "Moderate viability. Consider refining key areas." :
             "Low viability. Significant improvements needed."}
          </p>
        </div>
      </div>
    </section>
  );
}