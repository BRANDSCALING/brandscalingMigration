import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Save, AlertTriangle, CheckCircle, Lightbulb, LayoutDashboard, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

interface ModelResponse {
  model: string;
  warnings: string;
  suggestions: string;
  confidence: number;
}

interface WizardData {
  userId: string;
  dnaType: "Architect" | "Alchemist";
  answers: string[];
}

interface ModelOutputPanelProps {
  className?: string;
}

export function ModelOutputPanel({ className }: ModelOutputPanelProps) {
  const [generatedModel, setGeneratedModel] = useState<ModelResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get wizard data from localStorage or API
  const getWizardData = (): WizardData => {
    // Try to get from localStorage first
    const storedData = localStorage.getItem('wizardData');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error('Error parsing wizard data from localStorage:', e);
      }
    }
    
    // Fallback to default data
    return {
      userId: "user-123",
      dnaType: "Architect",
      answers: [
        "Digital marketing consultancy for small businesses",
        "Small businesses struggle with online presence and lead generation",
        "Local service providers with 5-50 employees",
        "Market demand is high post-COVID as businesses need digital transformation",
        "Monthly digital marketing packages with strategy and implementation",
        "Recurring monthly subscriptions from $1,500-$5,000 per client",
        "Time investment of 20-30 hours per client monthly, tools cost $200/month",
        "Personalized approach with local market expertise and proven frameworks",
        "Competition from large agencies and finding quality clients",
        "Need marketing automation tools and a reliable team for scaling"
      ]
    };
  };

  const wizardData = getWizardData();

  const generateModelMutation = useMutation({
    mutationFn: async (data: WizardData): Promise<ModelResponse> => {
      const response = await fetch("/api/generate-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate model");
      }
      
      return response.json();
    },
    onSuccess: (data: ModelResponse) => {
      setGeneratedModel(data);
    },
    onError: (error) => {
      console.error("Failed to generate model:", error);
    }
  });

  const handleGenerateModel = () => {
    generateModelMutation.mutate(wizardData);
  };

  const saveModelMutation = useMutation({
    mutationFn: async (modelData: any) => {
      const response = await fetch("/api/save-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save model");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setIsSaved(true);
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save model to dashboard",
        variant: "destructive",
      });
    }
  });

  const handleSaveToDashboard = () => {
    if (!generatedModel) return;
    
    // Check if this is a resubmission from Module 5
    const isResubmission = localStorage.getItem('isResubmission') === 'true';
    const resumingModelId = localStorage.getItem('resumingModelId');
    
    // Generate version label based on context
    let versionLabel = "Smart Business Builder™ – v1";
    if (isResubmission && resumingModelId) {
      const timestamp = new Date().toISOString().slice(0, 10);
      versionLabel = `Smart Business Builder™ – v2 (${timestamp})`;
    }
    
    const saveData = {
      userId: wizardData.userId,
      label: versionLabel,
      status: "Complete",
      model: generatedModel.model,
      warnings: generatedModel.warnings,
      suggestions: generatedModel.suggestions,
      confidence: generatedModel.confidence,
    };
    
    saveModelMutation.mutate(saveData);
    
    // Clean up resubmission flags
    localStorage.removeItem('isResubmission');
    localStorage.removeItem('resumingModelId');
  };

  const handleDownloadPDF = () => {
    alert("PDF export will be available in v2.");
  };

  const getThemeClasses = (dnaType: "Architect" | "Alchemist") => {
    return dnaType === "Architect" 
      ? "text-[#42047D] border-[#42047D]/20 bg-[#42047D]/5"
      : "text-[#F6782F] border-[#F6782F]/20 bg-[#F6782F]/5";
  };

  const getButtonClasses = (dnaType: "Architect" | "Alchemist") => {
    return dnaType === "Architect"
      ? "bg-[#42047D] hover:bg-[#42047D]/90 text-white"
      : "bg-[#F6782F] hover:bg-[#F6782F]/90 text-white";
  };

  return (
    <div className={cn("max-w-4xl mx-auto p-6 space-y-6", className)}>
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-center text-indigo-900">
          Smart Business Builder™ – AI Output & Save
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Generate your personalized business model using AI
        </p>
        
        {!generatedModel && (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <Button
                onClick={handleGenerateModel}
                disabled={generateModelMutation.isPending}
                className={cn("w-full", getButtonClasses(wizardData.dnaType))}
                size="lg"
              >
                {generateModelMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Building your custom business model...
                  </>
                ) : (
                  "Build My Model"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {generateModelMutation.isPending && (
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing your responses and crafting your personalized business model...
            </p>
          </CardContent>
        </Card>
      )}

      {generatedModel && (
        <div className="space-y-6">
          {/* Business Model Summary */}
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", getThemeClasses(wizardData.dnaType))}>
                <CheckCircle className="h-5 w-5" />
                Business Model Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {generatedModel.model}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className={cn("flex items-center gap-2", getThemeClasses(wizardData.dnaType))}>
                  <Badge variant="outline" className={cn("px-3 py-1", getThemeClasses(wizardData.dnaType))}>
                    Confidence Score: {generatedModel.confidence}/10
                  </Badge>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    wizardData.dnaType === "Architect" ? "bg-[#42047D]" : "bg-[#F6782F]"
                  )}
                  style={{ width: `${(generatedModel.confidence / 10) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fixes & Warnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
                Fixes & Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {generatedModel.warnings}
              </div>
            </CardContent>
          </Card>

          {/* Next Step Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Lightbulb className="h-5 w-5" />
                Next Step Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {generatedModel.suggestions}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSaveToDashboard}
              disabled={saveModelMutation.isPending || isSaved}
              variant="outline"
              className={cn("flex items-center gap-2", getThemeClasses(wizardData.dnaType))}
            >
              {saveModelMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved to Dashboard
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save to Dashboard
                </>
              )}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className={cn("flex items-center gap-2", getThemeClasses(wizardData.dnaType))}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Continue to Module 3 */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for the Next Step?</h3>
              <p className="text-gray-600">Continue to Module 3 to design your product and define your MVP</p>
            </div>
            <Button
              onClick={() => setLocation("/product-design")}
              className="bg-[#42047D] hover:bg-[#42047D]/90 text-white px-8 py-3 text-lg font-semibold"
            >
              Continue to Module 3: Product Design
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Save Confirmation */}
          {isSaved && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 justify-center">
                    <CheckCircle className="h-5 w-5" />
                    <p>Model saved to your dashboard.</p>
                  </div>
                  <Link href="/dashboard">
                    <Button 
                      variant="outline" 
                      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {generateModelMutation.isError && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to generate business model. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}