import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Brain, Sparkles, Package, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

interface ProductDesignData {
  productArchitect: string;
  productAlchemist: string;
  alignmentRating: number;
  userId: number;
}

export function Module3_ProductDesign() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [productArchitect, setProductArchitect] = useState("");
  const [productAlchemist, setProductAlchemist] = useState("");
  const [alignmentRating, setAlignmentRating] = useState([5]);
  const [selectedView, setSelectedView] = useState<"Architect" | "Alchemist">("Architect");

  const saveDesignMutation = useMutation({
    mutationFn: async (data: ProductDesignData) => {
      console.log("Sending product design data:", data);
      const response = await apiRequest("POST", "/api/product-design", data);
      console.log("Product design response:", response);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Product design saved successfully:", data);
      toast({
        title: "Product design saved successfully!",
        description: "Ready for Go-to-Market.",
      });
      // Navigate to Module 4: Go-to-Market
      setLocation("/go-to-market");
    },
    onError: (error) => {
      console.error("Error saving product design:", error);
      toast({
        title: "Error saving product design",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    console.log("Save button clicked");
    console.log("Product Architect:", productArchitect);
    console.log("Product Alchemist:", productAlchemist);
    console.log("Alignment Rating:", alignmentRating[0]);
    
    if (!productArchitect.trim() || !productAlchemist.trim()) {
      console.log("Validation failed - missing text");
      toast({
        title: "Please complete both perspectives",
        description: "Fill in both Architect and Alchemist product descriptions.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting mutation...");
    saveDesignMutation.mutate({
      productArchitect,
      productAlchemist,
      alignmentRating: alignmentRating[0],
      userId: 1, // Default user ID
    });
  };

  const handleBack = () => {
    setLocation("/model-output");
  };

  const getAlignmentText = (value: number) => {
    if (value <= 2) return "Not at all";
    if (value <= 4) return "Somewhat";
    if (value <= 6) return "Moderately";
    if (value <= 8) return "Very well";
    return "Perfectly matched";
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
            <Package className="w-8 h-8 text-[#42047D] mr-3" />
            <h1 className="text-3xl font-bold text-[#42047D]">
              Let's Define What You're Really Delivering
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            This is where clarity becomes real. And lean.
          </p>
          <blockquote className="text-lg text-gray-500 italic">
            "You don't need to build everything. Just the thing they'll pay for first."
          </blockquote>
        </div>

        {/* Toggle View */}
        <div className="mb-8">
          <Label className="text-base font-semibold text-gray-700 mb-4 block">
            Choose your perspective:
          </Label>
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center space-x-6">
              <div className={cn(
                "flex items-center space-x-3",
                selectedView === "Architect" ? "text-[#42047D]" : "text-gray-500"
              )}>
                <Brain className="w-5 h-5" />
                <span className="font-medium">Architect</span>
              </div>
              
              <Switch
                checked={selectedView === "Alchemist"}
                onCheckedChange={(checked) => setSelectedView(checked ? "Alchemist" : "Architect")}
                className="data-[state=checked]:bg-[#F6782F] data-[state=unchecked]:bg-[#42047D]"
              />
              
              <div className={cn(
                "flex items-center space-x-3",
                selectedView === "Alchemist" ? "text-[#F6782F]" : "text-gray-500"
              )}>
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Alchemist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Prompt Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Architect Card */}
          <Card className={cn(
            "p-6 border-2 transition-all duration-200",
            selectedView === "Architect" ? getViewClasses("Architect") : "border-gray-200"
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-[#42047D]" />
              <h3 className="text-xl font-bold text-[#42047D]">Architect View</h3>
            </div>
            <p className="text-gray-700 mb-4 font-medium">
              Describe your product in one sentence—features, form, format.
            </p>
            <Textarea
              value={productArchitect}
              onChange={(e) => setProductArchitect(e.target.value)}
              placeholder="A comprehensive digital marketing platform that provides small businesses with automated social media scheduling, performance analytics, and lead generation tools through an intuitive web dashboard..."
              className="min-h-[120px] resize-none border-[#42047D]/30 focus:border-[#42047D] focus:ring-[#42047D]/25"
              rows={5}
            />
          </Card>

          {/* Alchemist Card */}
          <Card className={cn(
            "p-6 border-2 transition-all duration-200",
            selectedView === "Alchemist" ? getViewClasses("Alchemist") : "border-gray-200"
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-[#F6782F]" />
              <h3 className="text-xl font-bold text-[#F6782F]">Alchemist View</h3>
            </div>
            <p className="text-gray-700 mb-4 font-medium">
              What transformation or outcome does your product create?
            </p>
            <Textarea
              value={productAlchemist}
              onChange={(e) => setProductAlchemist(e.target.value)}
              placeholder="Your product transforms overwhelmed business owners from feeling invisible online to becoming confident digital marketers who attract their ideal customers consistently..."
              className="min-h-[120px] resize-none border-[#F6782F]/30 focus:border-[#F6782F] focus:ring-[#F6782F]/25"
              rows={5}
            />
          </Card>
        </div>

        {/* Alignment Slider */}
        <div className="mb-8">
          <Label className="text-base font-semibold text-gray-700 mb-4 block">
            How well does this align with your audience's pain or aspiration?
          </Label>
          <Card className="p-6 bg-gray-50">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Not at all</span>
                <span>Perfectly matched</span>
              </div>
              <Slider
                value={alignmentRating}
                onValueChange={setAlignmentRating}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-lg font-semibold text-[#42047D]">
                  {alignmentRating[0]} - {getAlignmentText(alignmentRating[0])}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!productArchitect.trim() || !productAlchemist.trim() || saveDesignMutation.isPending}
            className="w-full bg-[#EC4049] hover:bg-[#EC4049]/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#EC4049]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            type="button"
          >
            {saveDesignMutation.isPending ? (
              "Saving Product Design..."
            ) : (
              "Save Product Design"
            )}
          </button>
        </div>


      </Card>
    </div>
  );
}