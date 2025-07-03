import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface BusinessClarityData {
  businessVision: string;
  dnaType: "Architect" | "Alchemist";
  userId: number;
}

export function Module1_BusinessClarity() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [businessVision, setBusinessVision] = useState("");
  const [dnaType, setDnaType] = useState<"Architect" | "Alchemist" | null>(null);

  const saveClarityMutation = useMutation({
    mutationFn: async (data: BusinessClarityData) => {
      return apiRequest("POST", "/api/business-clarity", data);
    },
    onSuccess: () => {
      toast({
        title: "Business Clarity Saved",
        description: "Your entrepreneurial DNA and vision have been captured. Ready to build!",
      });
      setLocation("/home");
    },
    onError: (error) => {
      toast({
        title: "Error saving clarity",
        description: error instanceof Error ? error.message : "Failed to save your business clarity",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!businessVision.trim() || !dnaType) {
      toast({
        title: "Complete all fields",
        description: "Please share your business vision and select your entrepreneurial DNA type.",
        variant: "destructive",
      });
      return;
    }

    saveClarityMutation.mutate({
      businessVision: businessVision.trim(),
      dnaType,
      userId: 1, // Using static user ID for demo
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brandscaling-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-architect-indigo">Smart Business Builder™</h1>
              <p className="text-sm text-gray-600">Module 1: Business Clarity</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-architect-indigo leading-tight mb-6">
            Let's begin with Clarity.
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Your Entrepreneurial DNA sets the tone for how you build.
          </p>
          <div className="w-24 h-1 bg-brandscaling-gradient mx-auto rounded-full"></div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Foundation Question
            </h3>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Business Vision Input */}
            <div className="space-y-3">
              <Label htmlFor="business-vision" className="text-lg font-medium text-gray-700">
                What kind of business do you <em>feel</em> called to build?
              </Label>
              <Textarea
                id="business-vision"
                value={businessVision}
                onChange={(e) => setBusinessVision(e.target.value)}
                placeholder="Write as if you're speaking to a future co-founder..."
                className="min-h-[120px] text-base leading-relaxed resize-none border-2 border-gray-200 focus:border-architect-indigo"
                rows={5}
              />
            </div>

            {/* DNA Type Selector */}
            <div className="space-y-4">
              <Label className="text-lg font-medium text-gray-700">
                Which style feels most natural to you?
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Architect Option */}
                <button
                  onClick={() => setDnaType("Architect")}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg",
                    dnaType === "Architect"
                      ? "border-[#42047D] bg-[#42047D]/5 shadow-lg"
                      : "border-gray-200 hover:border-[#42047D]/50"
                  )}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Brain className={cn(
                      "h-6 w-6",
                      dnaType === "Architect" ? "text-[#42047D]" : "text-gray-400"
                    )} />
                    <span className={cn(
                      "text-xl font-semibold",
                      dnaType === "Architect" ? "text-[#42047D]" : "text-gray-700"
                    )}>
                      🧠 Architect
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    I think in systems, frameworks, and structure.
                  </p>
                </button>

                {/* Alchemist Option */}
                <button
                  onClick={() => setDnaType("Alchemist")}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg",
                    dnaType === "Alchemist"
                      ? "border-[#F6782F] bg-[#F6782F]/5 shadow-lg"
                      : "border-gray-200 hover:border-[#F6782F]/50"
                  )}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Sparkles className={cn(
                      "h-6 w-6",
                      dnaType === "Alchemist" ? "text-[#F6782F]" : "text-gray-400"
                    )} />
                    <span className={cn(
                      "text-xl font-semibold",
                      dnaType === "Alchemist" ? "text-[#F6782F]" : "text-gray-700"
                    )}>
                      💫 Alchemist
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    I build from presence, energy, and resonance.
                  </p>
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={!businessVision.trim() || !dnaType || saveClarityMutation.isPending}
                className="w-full bg-[#42047D] hover:bg-[#42047D]/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#42047D]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                size="lg"
              >
                {saveClarityMutation.isPending ? (
                  "Saving..."
                ) : (
                  "Start Building"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}