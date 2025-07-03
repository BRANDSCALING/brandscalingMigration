import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Brain, Heart, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Step10Data {
  dnaType: "Architect" | "Alchemist";
  response: string;
}

interface Step10Props {
  onSubmit?: (data: Step10Data) => void;
  onBack?: () => void;
  initialData?: Partial<Step10Data>;
}

export function Step10_SupportInput({ onSubmit, onBack, initialData }: Step10Props) {
  const { toast } = useToast();
  const [dnaType, setDnaType] = useState<"Architect" | "Alchemist">(
    initialData?.dnaType || "Architect"
  );
  const [response, setResponse] = useState(initialData?.response || "");

  const submitMutation = useMutation({
    mutationFn: async (data: Step10Data) => {
      return apiRequest("POST", "/api/wizard/step10", {
        userId: "user-123", // Placeholder - would come from auth context
        step: 10,
        dnaType: data.dnaType,
        response: data.response
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Wizard completed successfully!",
        description: `Your ${dnaType.toLowerCase()} business model is ready for generation.`,
      });
      if (onSubmit) {
        onSubmit({ dnaType, response });
      }
    },
    onError: (error) => {
      toast({
        title: "Error completing wizard",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmitForm = () => {
    if (!response.trim()) {
      toast({
        title: "Please describe your support needs",
        description: "Enter what kind of support would help you most before completing the wizard.",
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
    Architect: "What kind of support would help most?",
    Alchemist: "Who or what do you wish was helping you?"
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
            <span className="text-gray-600 text-sm font-medium">Step 10 of 10</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Support & Resources
            </h1>
          </div>
          <p className="text-gray-600">
            Define what support would help you succeed
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
              Consider technical expertise, funding, mentorship, tools, training, or strategic guidance you need.
            </p>
          )}
          {dnaType === "Alchemist" && (
            <p className="text-gray-600 text-sm mt-2">
              Think about the people, community, encouragement, accountability, or spiritual support that would uplift you.
            </p>
          )}
        </div>

        {/* Response Input */}
        <div className="mb-8">
          <Label htmlFor="response" className="text-base font-semibold text-gray-700 mb-3 block">
            Support Needs Assessment
          </Label>
          <Textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={dnaType === "Architect" 
              ? "What specific help do you need? Technical skills, business coaching, funding sources, software tools, industry connections, or expert guidance?"
              : "Who would you want in your corner? A supportive community, accountability partner, mentor, creative collaborator, or spiritual guidance?"
            }
            className={`w-full min-h-[180px] resize-none border-2 border-gray-200 rounded-xl px-4 py-3 text-base leading-relaxed transition-all duration-200 ${colors.focus} focus:outline-none`}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {response.length} characters
            </span>
            {response.length > 100 && (
              <span className={`text-sm font-medium ${colors.primary}`}>
                Clear support vision! 
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
            onClick={handleSubmitForm}
            disabled={!response.trim() || submitMutation.isPending}
            className={`${colors.bg} hover:opacity-90 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 ${colors.focus.split(' ')[0]} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {submitMutation.isPending ? (
              "Completing..."
            ) : (
              <>
                Complete Wizard
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* DNA Type Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
            <span className={`text-sm font-medium ${colors.primary}`}>
              {dnaType} Support Analysis
            </span>
          </div>
        </div>

        {/* Completion Indicator */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 text-sm">
            🎉 Final step! Your business model will be generated after submission.
          </p>
        </div>
      </Card>
    </div>
  );
}