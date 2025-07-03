import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { MessageCircle, ChevronLeft, Lightbulb, Brain, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

interface FeedbackLoopData {
  feedbackStrategy: string;
  topThreeInsights: string[];
  improveArchitect: string;
  improveAlchemist: string;
  userId: number;
}

export function Module5_FeedbackLoop() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [feedbackStrategy, setFeedbackStrategy] = useState("");
  const [insights, setInsights] = useState(["", "", ""]);
  const [improveArchitect, setImproveArchitect] = useState("");
  const [improveAlchemist, setImproveAlchemist] = useState("");
  const [selectedView, setSelectedView] = useState<"Architect" | "Alchemist">("Architect");

  const saveFeedbackLoopMutation = useMutation({
    mutationFn: async (data: FeedbackLoopData) => {
      console.log("Sending feedback loop data:", data);
      const response = await apiRequest("POST", "/api/feedback-loop", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Feedback loop saved successfully:", data);
      toast({
        title: "Growth loop saved successfully.",
        description: "Ready for tracking and optimization.",
      });
      // Navigate to Module 6: Progress Tracker
      setLocation("/progress-tracker");
    },
    onError: (error) => {
      console.error("Error saving feedback loop:", error);
      toast({
        title: "Error saving growth plan",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleInsightChange = (index: number, value: string) => {
    const newInsights = [...insights];
    newInsights[index] = value;
    setInsights(newInsights);
  };

  const handleSubmit = () => {
    console.log("Save feedback loop clicked");
    console.log("Feedback Strategy:", feedbackStrategy);
    console.log("Insights:", insights);
    console.log("Architect Improvement:", improveArchitect);
    console.log("Alchemist Improvement:", improveAlchemist);

    if (!feedbackStrategy.trim()) {
      toast({
        title: "Please add your feedback strategy",
        description: "Describe how you'll collect feedback from users.",
        variant: "destructive",
      });
      return;
    }

    const filledInsights = insights.filter(insight => insight.trim() !== "");
    if (filledInsights.length === 0) {
      toast({
        title: "Please add at least one insight",
        description: "Share what you're learning from people.",
        variant: "destructive",
      });
      return;
    }

    saveFeedbackLoopMutation.mutate({
      feedbackStrategy,
      topThreeInsights: insights,
      improveArchitect,
      improveAlchemist,
      userId: 1, // Default user ID
    });
  };

  const handleBack = () => {
    setLocation("/go-to-market");
  };

  const getViewClasses = (view: "Architect" | "Alchemist") => {
    return view === "Architect" 
      ? "text-[#42047D] border-[#42047D]/20 bg-[#42047D]/5"
      : "text-[#F6782F] border-[#F6782F]/20 bg-[#F6782F]/5";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 shadow-xl border-0 rounded-3xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-[#42047D] mr-3" />
            <h1 className="text-3xl font-bold text-[#42047D]">
              Growth Starts with Listening
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            You don't need scale before signal. Learn from every step.
          </p>
          <blockquote className="text-lg text-gray-500 italic">
            "Every conversation is research. Every objection is insight."
          </blockquote>
        </div>

        {/* Feedback Strategy */}
        <div className="mb-8">
          <Card className="p-6 border-2 border-[#42047D]/20 bg-[#42047D]/5">
            <div className="space-y-4">
              <Label className="text-xl font-bold text-[#42047D]">
                How will you collect feedback from your first users?
              </Label>
              <Textarea
                value={feedbackStrategy}
                onChange={(e) => setFeedbackStrategy(e.target.value)}
                placeholder="I'll ask every buyer 3 questions after delivery: What worked best for you? What was confusing? What would make this even better for someone like you?"
                className="min-h-[120px] resize-none border-[#42047D]/30 focus:border-[#42047D] focus:ring-[#42047D]/25"
                rows={5}
              />
            </div>
          </Card>
        </div>

        {/* Top 3 Insights */}
        <div className="mb-8">
          <Card className="p-6 border-2 border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-6 h-6 text-[#F6782F]" />
                <Label className="text-xl font-bold text-[#42047D]">
                  What are 3 things you're learning from people already?
                </Label>
              </div>
              
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#F6782F] text-white text-sm font-bold flex items-center justify-center mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  <Textarea
                    value={insight}
                    onChange={(e) => handleInsightChange(index, e.target.value)}
                    placeholder={`Insight ${index + 1}: What have you noticed or learned?`}
                    className="flex-1 min-h-[60px] resize-none border-gray-300 focus:border-[#F6782F] focus:ring-[#F6782F]/25"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Toggle View */}
        <div className="mb-6">
          <Label className="text-base font-semibold text-gray-700 mb-4 block">
            Next Iteration Reflection
          </Label>
          <div className="flex items-center space-x-4 mb-6">
            <span className={cn("font-medium", selectedView === "Architect" ? "text-[#42047D]" : "text-gray-500")}>
              Architect
            </span>
            <Switch
              checked={selectedView === "Alchemist"}
              onCheckedChange={(checked) => setSelectedView(checked ? "Alchemist" : "Architect")}
              className="data-[state=checked]:bg-[#F6782F] data-[state=unchecked]:bg-[#42047D]"
            />
            <span className={cn("font-medium", selectedView === "Alchemist" ? "text-[#F6782F]" : "text-gray-500")}>
              Alchemist
            </span>
          </div>
        </div>

        {/* Iteration Reflection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Architect Improvement */}
          <Card className={cn(
            "p-6 border-2 transition-all duration-200",
            selectedView === "Architect" ? getViewClasses("Architect") : "border-gray-200 opacity-60"
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-[#42047D]" />
              <h3 className="text-lg font-bold text-[#42047D]">Architect: System Improvement</h3>
            </div>
            <p className="text-gray-700 mb-4 font-medium">
              What would you improve in your product's system or delivery?
            </p>
            <Textarea
              value={improveArchitect}
              onChange={(e) => setImproveArchitect(e.target.value)}
              placeholder="Streamline the onboarding process, add automated follow-ups, create better documentation, optimize the checkout flow..."
              className="min-h-[100px] resize-none border-[#42047D]/30 focus:border-[#42047D] focus:ring-[#42047D]/25"
              rows={4}
            />
          </Card>

          {/* Alchemist Improvement */}
          <Card className={cn(
            "p-6 border-2 transition-all duration-200",
            selectedView === "Alchemist" ? getViewClasses("Alchemist") : "border-gray-200 opacity-60"
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-[#F6782F]" />
              <h3 className="text-lg font-bold text-[#F6782F]">Alchemist: Resonance Improvement</h3>
            </div>
            <p className="text-gray-700 mb-4 font-medium">
              What would help your offer feel more resonant or impactful?
            </p>
            <Textarea
              value={improveAlchemist}
              onChange={(e) => setImproveAlchemist(e.target.value)}
              placeholder="Deeper personal connection in messaging, more authentic storytelling, clearer emotional benefits, stronger community aspect..."
              className="min-h-[100px] resize-none border-[#F6782F]/30 focus:border-[#F6782F] focus:ring-[#F6782F]/25"
              rows={4}
            />
          </Card>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={saveFeedbackLoopMutation.isPending}
            className="w-full bg-[#841477] hover:bg-[#841477]/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#841477]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            type="button"
          >
            {saveFeedbackLoopMutation.isPending ? (
              "Saving My Growth Plan..."
            ) : (
              "Save My Growth Plan"
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}