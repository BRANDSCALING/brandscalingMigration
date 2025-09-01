import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, ArrowLeft, Brain, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Step2Data {
  dnaType: "Architect" | "Alchemist";
  response: string;
}

interface Step2Props {
  onNext?: (data: Step2Data) => void;
  onBack?: () => void;
  initialData?: Partial<Step2Data>;
}

export function Step2_ProblemInput({ onNext, onBack, initialData }: Step2Props) {
  const { toast } = useToast();
  const [dnaType, setDnaType] = useState<"Architect" | "Alchemist">(
    initialData?.dnaType || "Architect"
  );
  const [response, setResponse] = useState(initialData?.response || "");

  const submitMutation = useMutation({
    mutationFn: async (data: Step2Data) => {
      return apiRequest("POST", "/api/wizard/step2", {
        userId: "user-123", // Placeholder - would come from auth context
        step: 2,
        dnaType: data.dnaType,
        response: data.response
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Problem definition captured!",
        description: `Your ${dnaType.toLowerCase()} analysis has been saved.`,
      });
      if (onNext) {
        onNext({ dnaType, response });
      }
    },
    onError: (error) => {
      toast({
        title: "Error saving problem definition",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleNextStep = () => {
    if (!response.trim()) {
      toast({
        title: "Please define the problem",
        description: "Enter your problem analysis before proceeding to the next step.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({ dnaType, response });
  };

  const handleBackStep = () => {
    if (onBack) {
      onBack();
    }
  };

  const prompts = {
    Architect: "What practical problem are you solving?",
    Alchemist: "What pain or frustration does your audience feel?"
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
            <span className="text-gray-600 text-sm font-medium">Step 2 of 10</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Problem Definition
          </h1>
          <p className="text-gray-600">
            Help us understand the core problem your business addresses
          </p>
        </div>

        {/* DNA Type Toggle */}
        <div className="mb-8">
          <Label className="text-base font-semibold text-gray-700 mb-4 block">
            Choose your perspective:
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
                className="data-[state=checked]:bg-scale-orange data-[state=unchecked]:bg-architect-indigo"
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
          {dnaType === "Architect" && (
            <p className="text-gray-600 text-sm mt-2">
              Focus on the specific, measurable problem and its impact on productivity or efficiency.
            </p>
          )}
          {dnaType === "Alchemist" && (
            <p className="text-gray-600 text-sm mt-2">
              Think about the emotional journey and human experience behind the problem.
            </p>
          )}
        </div>

        {/* Response Input */}
        <div className="mb-8">
          <Label htmlFor="response" className="text-base font-semibold text-gray-700 mb-3 block">
            Problem Analysis
          </Label>
          <Textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={dnaType === "Architect" 
              ? "Describe the specific problem: What inefficiency or gap exists? Who experiences it? What are the measurable consequences?"
              : "Tell the story of the problem: How does it make people feel? What frustrations do they face? What do they wish was different?"
            }
            className={`w-full min-h-[180px] resize-none border-2 border-gray-200 rounded-xl px-4 py-3 text-base leading-relaxed transition-all duration-200 ${colors.focus} focus:outline-none`}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {response.length} characters
            </span>
            {response.length > 50 && (
              <span className={`text-sm font-medium ${colors.primary}`}>
                Great detail! 
              </span>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBackStep}
            variant="outline"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNextStep}
            disabled={!response.trim() || submitMutation.isPending}
            className={`${colors.bg} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 ${colors.focus.split(' ')[0]} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
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
              {dnaType} Analysis Mode
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}