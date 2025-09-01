import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, ArrowLeft, Brain, Heart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Step6Data {
  dnaType: "Architect" | "Alchemist";
  response: string;
}

interface Step6Props {
  onNext?: (data: Step6Data) => void;
  onBack?: () => void;
  initialData?: Partial<Step6Data>;
}

export function Step6_RevenueInput({ onNext, onBack, initialData }: Step6Props) {
  const { toast } = useToast();
  const [dnaType, setDnaType] = useState<"Architect" | "Alchemist">(
    initialData?.dnaType || "Architect"
  );
  const [response, setResponse] = useState(initialData?.response || "");

  const submitMutation = useMutation({
    mutationFn: async (data: Step6Data) => {
      return apiRequest("POST", "/api/wizard/step6", {
        userId: "user-123", // Placeholder - would come from auth context
        step: 6,
        dnaType: data.dnaType,
        response: data.response
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Revenue model captured!",
        description: `Your ${dnaType.toLowerCase()} revenue strategy has been saved.`,
      });
      if (onNext) {
        onNext({ dnaType, response });
      }
    },
    onError: (error) => {
      toast({
        title: "Error saving revenue model",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleNextStep = () => {
    if (!response.trim()) {
      toast({
        title: "Please describe your revenue model",
        description: "Enter your revenue strategy before proceeding to the next step.",
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
    Architect: "How do you plan to make money?",
    Alchemist: "How do you imagine being paid for this?"
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
            <span className="text-gray-600 text-sm font-medium">Step 6 of 10</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-gray-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Revenue Model
            </h1>
          </div>
          <p className="text-gray-600">
            Define how your business will generate income
          </p>
        </div>

        {/* DNA Type Toggle */}
        <div className="mb-8">
          <Label className="text-base font-semibold text-gray-700 mb-4 block">
            Choose your approach:
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
              Consider pricing models, revenue streams, payment structures, and scalability factors.
            </p>
          )}
          {dnaType === "Alchemist" && (
            <p className="text-gray-600 text-sm mt-2">
              Think about the energy exchange, value alignment, and how compensation feels right for your mission.
            </p>
          )}
        </div>

        {/* Response Input */}
        <div className="mb-8">
          <Label htmlFor="response" className="text-base font-semibold text-gray-700 mb-3 block">
            Revenue Strategy
          </Label>
          <Textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={dnaType === "Architect" 
              ? "What pricing model will you use? One-time payments, subscriptions, commissions? How will you structure your revenue streams and scale your income?"
              : "How do you want to be compensated for the value you create? What feels aligned with your purpose? How will money flow in support of your mission?"
            }
            className={`w-full min-h-[180px] resize-none border-2 border-gray-200 rounded-xl px-4 py-3 text-base leading-relaxed transition-all duration-200 ${colors.focus} focus:outline-none`}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {response.length} characters
            </span>
            {response.length > 100 && (
              <span className={`text-sm font-medium ${colors.primary}`}>
                Great strategy! 
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
              {dnaType} Revenue Model
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}