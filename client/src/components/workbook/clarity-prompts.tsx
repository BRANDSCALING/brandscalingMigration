import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/lib/ai-service";
import type { WorkbookSession } from "@shared/schema";
import type { ClarityPrompts } from "@/types/workbook";

interface ClarityPromptsProps {
  session: WorkbookSession | undefined;
}

export default function ClarityPrompts({ session }: ClarityPromptsProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [prompts, setPrompts] = useState<ClarityPrompts>(
    session?.clarityPrompts || {}
  );

  const [aiResponse, setAiResponse] = useState("");

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      return apiRequest("PATCH", `/api/workbook/session`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your responses have been saved.",
      });
    },
  });

  const handlePromptChange = (key: keyof ClarityPrompts, value: string) => {
    const updatedPrompts = { ...prompts, [key]: value };
    setPrompts(updatedPrompts);
    updateSessionMutation.mutate({ clarityPrompts: updatedPrompts });
  };

  const generateAIInsightMutation = useMutation({
    mutationFn: async () => {
      const prompt = `Please analyze this business idea for clarity and viability:

Business Idea: ${prompts.businessIdea || 'Not provided'}
Target Audience: ${prompts.audience || 'Not provided'}
Problem it Solves: ${prompts.problem || 'Not provided'}
Transformation/Outcome: ${prompts.transformation || 'Not provided'}
Delivery Method: ${prompts.vehicle || 'Not provided'}

Please provide:
1. Clarity assessment (what's clear vs unclear)
2. Viability insights 
3. Key questions to explore further
4. Specific recommendations for improvement`;

      return AIService.generateResponse(prompt);
    },
    onSuccess: (response) => {
      setAiResponse(response);
      toast({
        title: "AI Insights Generated!",
        description: "Your business clarity analysis is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI insights",
        variant: "destructive",
      });
    },
  });

  const fields = [
    {
      key: "businessIdea" as keyof ClarityPrompts,
      label: "What is your business idea?",
      placeholder: "Describe your business concept in 1-2 sentences..."
    },
    {
      key: "audience" as keyof ClarityPrompts,
      label: "Who is this for?",
      placeholder: "Describe your target audience specifically..."
    },
    {
      key: "problem" as keyof ClarityPrompts,
      label: "What problem does this solve?",
      placeholder: "What specific pain point or desire are you addressing?..."
    },
    {
      key: "transformation" as keyof ClarityPrompts,
      label: "What transformation do you provide?",
      placeholder: "How will people be different after using your solution?..."
    },
    {
      key: "vehicle" as keyof ClarityPrompts,
      label: "How will you deliver this?",
      placeholder: "What's your delivery method, format, or business model?..."
    }
  ];

  return (
    <Card id="clarity-prompts" className="p-4 sm:p-6 lg:p-8 bg-purple-50 border-purple-200">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1.3</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Business Idea Clarity Prompts</h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          Use these prompts to refine your business concept. The clearer your answers, the stronger your foundation.
        </p>
        
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Purpose</h3>
          <p className="text-gray-700">
            These prompts help you move from a vague idea to specific, actionable clarity. 
            Each question builds on the previous one to create a complete picture of your business concept.
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
          {isArchitect ? "Architect Coaching" : "Alchemist Coaching"}
        </h3>
        <div className="text-gray-700">
          {isArchitect ? (
            <p>Focus on being specific and measurable in your responses. Avoid vague language and aim for concrete details that can be tested and validated.</p>
          ) : (
            <p>Let your intuition guide you, but ground it in reality. Think about the emotional journey your customers will experience alongside the practical outcomes.</p>
          )}
        </div>
      </div>

      {/* Clarity Questions */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.key} className="p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {field.label}
                </label>
                <Textarea
                  value={prompts[field.key] || ""}
                  onChange={(e) => handlePromptChange(field.key, e.target.value)}
                  className="bg-white text-sm text-gray-700 min-h-[100px]"
                  placeholder={field.placeholder}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis Section */}
      <div className="mt-8 space-y-4">
        <div className="text-center">
          <Button 
            onClick={() => generateAIInsightMutation.mutate()}
            disabled={generateAIInsightMutation.isPending}
            className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {generateAIInsightMutation.isPending ? "Generating AI Analysis..." : "Get AI Clarity Analysis"}
          </Button>
        </div>

        {aiResponse && (
          <div className="p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">AI Clarity Analysis</h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{aiResponse}</div>
          </div>
        )}
      </div>
    </Card>
  );
}