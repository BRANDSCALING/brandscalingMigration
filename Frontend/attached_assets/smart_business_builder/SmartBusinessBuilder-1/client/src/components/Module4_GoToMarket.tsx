import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Rocket, ChevronLeft, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface LaunchPlanData {
  launchChecklist: {
    offerReady: boolean;
    audienceChannelKnown: boolean;
    deliveryMethodMapped: boolean;
    paymentReady: boolean;
  };
  launchReadinessScore: number;
  reflectionArchitect: string;
  reflectionAlchemist: string;
  userId: number;
}

export function Module4_GoToMarket() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Checklist state
  const [checklist, setChecklist] = useState({
    offerReady: false,
    audienceChannelKnown: false,
    deliveryMethodMapped: false,
    paymentReady: false,
  });
  
  const [readinessScore, setReadinessScore] = useState([5]);
  const [reflectionArchitect, setReflectionArchitect] = useState("");
  const [reflectionAlchemist, setReflectionAlchemist] = useState("");

  const saveLaunchPlanMutation = useMutation({
    mutationFn: async (data: LaunchPlanData) => {
      console.log("Sending launch plan data:", data);
      const response = await apiRequest("POST", "/api/launch-plan", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Launch plan saved successfully:", data);
      toast({
        title: "Go-to-Market plan saved",
        description: "Ready for the next phase.",
      });
      // Navigate to Module 5: Feedback Loop
      setLocation("/feedback-loop");
    },
    onError: (error) => {
      console.error("Error saving launch plan:", error);
      toast({
        title: "Error saving launch plan",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleChecklistChange = (key: keyof typeof checklist, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = () => {
    console.log("Save launch plan clicked");
    console.log("Checklist:", checklist);
    console.log("Readiness Score:", readinessScore[0]);
    console.log("Architect Reflection:", reflectionArchitect);
    console.log("Alchemist Reflection:", reflectionAlchemist);

    saveLaunchPlanMutation.mutate({
      launchChecklist: checklist,
      launchReadinessScore: readinessScore[0],
      reflectionArchitect,
      reflectionAlchemist,
      userId: 1, // Default user ID
    });
  };

  const handleBack = () => {
    setLocation("/product-design");
  };

  const getReadinessText = (value: number) => {
    if (value <= 2) return "Still Foggy";
    if (value <= 4) return "Getting There";
    if (value <= 6) return "Almost Ready";
    if (value <= 8) return "Confident";
    return "Let's GO!";
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
            <Rocket className="w-8 h-8 text-[#42047D] mr-3" />
            <h1 className="text-3xl font-bold text-[#42047D]">
              Let's Get Your First Version Out
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Clarity is power. Now we focus on motion.
          </p>
          <blockquote className="text-lg text-gray-500 italic">
            "Build lean. Launch early. Learn fast."
          </blockquote>
        </div>

        {/* Launch-Ready Checklist */}
        <div className="mb-8">
          <Label className="text-xl font-bold text-[#42047D] mb-6 block">
            Launch-Ready Checklist
          </Label>
          <Card className="p-6 border-2 border-[#42047D]/20 bg-[#42047D]/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="offer-ready"
                  checked={checklist.offerReady}
                  onCheckedChange={(checked) => handleChecklistChange('offerReady', checked as boolean)}
                  className="border-[#42047D] data-[state=checked]:bg-[#42047D] data-[state=checked]:border-[#42047D]"
                />
                <label htmlFor="offer-ready" className="text-lg font-medium text-gray-700 cursor-pointer">
                  Have you outlined the first offer?
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="audience-channel"
                  checked={checklist.audienceChannelKnown}
                  onCheckedChange={(checked) => handleChecklistChange('audienceChannelKnown', checked as boolean)}
                  className="border-[#42047D] data-[state=checked]:bg-[#42047D] data-[state=checked]:border-[#42047D]"
                />
                <label htmlFor="audience-channel" className="text-lg font-medium text-gray-700 cursor-pointer">
                  Do you know where your audience hangs out?
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="delivery-method"
                  checked={checklist.deliveryMethodMapped}
                  onCheckedChange={(checked) => handleChecklistChange('deliveryMethodMapped', checked as boolean)}
                  className="border-[#42047D] data-[state=checked]:bg-[#42047D] data-[state=checked]:border-[#42047D]"
                />
                <label htmlFor="delivery-method" className="text-lg font-medium text-gray-700 cursor-pointer">
                  Do you have a delivery method mapped?
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="payment-ready"
                  checked={checklist.paymentReady}
                  onCheckedChange={(checked) => handleChecklistChange('paymentReady', checked as boolean)}
                  className="border-[#42047D] data-[state=checked]:bg-[#42047D] data-[state=checked]:border-[#42047D]"
                />
                <label htmlFor="payment-ready" className="text-lg font-medium text-gray-700 cursor-pointer">
                  Is payment processing set up?
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Launch Readiness Slider */}
        <div className="mb-8">
          <Card className="p-6 border-2 border-gray-200">
            <div className="space-y-4">
              <Label className="text-xl font-bold text-[#42047D]">
                How ready do you feel to go live?
              </Label>
              <div className="px-4">
                <Slider
                  value={readinessScore}
                  onValueChange={setReadinessScore}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Still Foggy</span>
                  <span>Let's GO!</span>
                </div>
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold text-[#42047D]">
                    {readinessScore[0]} - {getReadinessText(readinessScore[0])}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Reflection Prompts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Architect Reflection */}
          <Card className="p-6 border-2 border-[#42047D]/20 bg-[#42047D]/5">
            <div className="space-y-4">
              <Label className="text-lg font-bold text-[#42047D]">
                Architect: What are the top 2 tasks you must complete before launch?
              </Label>
              <Textarea
                value={reflectionArchitect}
                onChange={(e) => setReflectionArchitect(e.target.value)}
                placeholder="1. Finalize pricing and packaging structure...
2. Set up analytics and tracking systems..."
                className="min-h-[100px] resize-none border-[#42047D]/30 focus:border-[#42047D] focus:ring-[#42047D]/25"
                rows={4}
              />
            </div>
          </Card>

          {/* Alchemist Reflection */}
          <Card className="p-6 border-2 border-[#F6782F]/20 bg-[#F6782F]/5">
            <div className="space-y-4">
              <Label className="text-lg font-bold text-[#F6782F]">
                Alchemist: What would help you *feel* more ready to launch?
              </Label>
              <Textarea
                value={reflectionAlchemist}
                onChange={(e) => setReflectionAlchemist(e.target.value)}
                placeholder="Having a supportive community around me...
Feeling more confident in my message and authenticity..."
                className="min-h-[100px] resize-none border-[#F6782F]/30 focus:border-[#F6782F] focus:ring-[#F6782F]/25"
                rows={4}
              />
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={saveLaunchPlanMutation.isPending}
            className="w-full bg-[#F6782F] hover:bg-[#F6782F]/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#F6782F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            type="button"
          >
            {saveLaunchPlanMutation.isPending ? (
              "Saving Launch Plan..."
            ) : (
              "Save Launch Plan"
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}