import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Brain, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Step1Data {
  dnaType: "Architect" | "Alchemist";
  response: string;
}

interface Step1Props {
  onNext?: (data: Step1Data) => void;
  initialData?: Partial<Step1Data>;
}

export function Step1_IdeaInput({ onNext, initialData }: Step1Props) {
  const { toast } = useToast();
  const [dnaType, setDnaType] = useState<"Architect" | "Alchemist">(
    initialData?.dnaType || "Architect"
  );
  const [response, setResponse] = useState(initialData?.response || "");

  const submitMutation = useMutation({
    mutationFn: async (data: Step1Data) => {
      return apiRequest("POST", "/api/wizard/step1", {
        userId: "user-123", // Placeholder - would come from auth context
        step: 1,
        dnaType: data.dnaType,
        response: data.response
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Idea captured successfully!",
        description: `Your ${dnaType.toLowerCase()} response has been saved.`,
      });
      if (onNext) {
        onNext({ dnaType, response });
      }
    },
    onError: (error) => {
      toast({
        title: "Error saving your idea",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleNextStep = () => {
    if (!response.trim()) {
      toast({
        title: "Please share your idea",
        description: "Enter your response before proceeding to the next step.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({ dnaType, response });
  };

  const prompts = {
    Architect: "What is your core idea in one sentence?",
    Alchemist: "What's the story behind what you want to create?"
  };

  const colorSchemes = {
    Architect: {
      primary: "text-[#42047D]",
      bg: "bg-[#42047D]",
      border: "border-[#42047D]",
      accent: "bg-[#42047D]/10",
      focus: "focus:ring-[#42047D]/25 focus:border-[#42047D]"
    },
    Alchemist: {
      primary: "text-[#F6782F]",
      bg: "bg-[#F6782F]", 
      border: "border-[#F6782F]",
      accent: "bg-[#F6782F]/10",
      focus: "focus:ring-[#F6782F]/25 focus:border-[#F6782F]"
    }
  };

  const colors = colorSchemes[dnaType];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-xl border-0 rounded-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full mb-4">
            <span className="text-gray-600 text-sm font-medium">Step 1 of 10</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Idea Capture
          </h1>
          <p className="text-gray-600">
            Let's start by understanding your vision and approach
          </p>
        </div>

        {/* DNA Type Toggle */}
        <div className="mb-8">
          <Label className="text-base font-semibold text-gray-700 mb-4 block">
            Choose your business DNA:
          </Label>
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-6">
              <div className={`flex items-center space-x-3 ${
                dnaType === "Architect" ? colors.primary : "text-gray-500"
              }`}>
                <Brain className="w-5 h-5" />
                <span className="font-medium">Architect</span>
              </div>
              
              <Switch
                checked={dnaType === "Alchemist"}
                onCheckedChange={(checked) => setDnaType(checked ? "Alchemist" : "Architect")}
                className="data-[state=checked]:bg-[#F6782F] data-[state=unchecked]:bg-[#42047D]"
              />
              
              <div className={`flex items-center space-x-3 ${
                dnaType === "Alchemist" ? colors.primary : "text-gray-500"
              }`}>
                <Heart className="w-5 h-5" />
                <span className="font-medium">Alchemist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <div className={`p-6 rounded-2xl mb-6 ${colors.accent}`}>
          <h2 className={`text-xl font-bold ${colors.primary} mb-2`}>
            {dnaType} Prompt
          </h2>
          <p className="text-gray-700 text-lg">
            {prompts[dnaType]}
          </p>
        </div>

        {/* Response Input */}
        <div className="mb-8">
          <Label htmlFor="response" className="text-base font-semibold text-gray-700 mb-3 block">
            Your Response
          </Label>
          <Textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={dnaType === "Architect" 
              ? "Describe your core business idea clearly and concisely..."
              : "Share the story, passion, and vision behind your idea..."
            }
            className={`w-full min-h-[150px] resize-none border-2 border-gray-200 rounded-xl px-4 py-3 text-base leading-relaxed transition-all duration-200 ${colors.focus} focus:outline-none`}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {response.length} characters
            </span>
            {response.length > 0 && (
              <span className={`text-sm font-medium ${colors.primary}`}>
                Looking good! 
              </span>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="text-center">
          <Button
            onClick={handleNextStep}
            disabled={!response.trim() || submitMutation.isPending}
            className={`${colors.bg} hover:opacity-90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 ${colors.focus.split(' ')[0]} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {submitMutation.isPending ? (
              "Saving..."
            ) : (
              <>
                Next Step
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* DNA Type Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
            <span className={`text-sm font-medium ${colors.primary}`}>
              {dnaType} Mode Active
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}