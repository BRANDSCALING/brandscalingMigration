import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Step1_IdeaInput } from "./steps/Step1_IdeaInput";
import { Step2_ProblemInput } from "./steps/Step2_ProblemInput";
import { Step3_AudienceInput } from "./steps/Step3_AudienceInput";
import { Step4_TimingInput } from "./steps/Step4_TimingInput";
import { Step5_OfferInput } from "./steps/Step5_OfferInput";
import { Step6_RevenueInput } from "./steps/Step6_RevenueInput";
import { Step7_CostInput } from "./steps/Step7_CostInput";
import { Step8_UspInput } from "./steps/Step8_UspInput";
import { Step9_BlockersInput } from "./steps/Step9_BlockersInput";
import { Step10_SupportInput } from "./steps/Step10_SupportInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, AlertTriangle } from "lucide-react";

interface ResumeWizardData {
  answers: string[];
  dnaType: "Architect" | "Alchemist";
  label: string;
  timestamp: string;
}

interface ResumeWizardProps {
  modelId: string;
}

export function ResumeWizard({ modelId }: ResumeWizardProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<ResumeWizardData | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [dnaType, setDnaType] = useState<"Architect" | "Alchemist">("Architect");

  // Fetch saved model data
  const { data: savedModel, isLoading, error } = useQuery<ResumeWizardData>({
    queryKey: ['/api/models', modelId],
    queryFn: async () => {
      const response = await fetch(`/api/models/${modelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch saved model');
      }
      return response.json();
    }
  });

  // Initialize wizard data when model loads
  useEffect(() => {
    if (savedModel) {
      setWizardData(savedModel);
      setAnswers(savedModel.answers || []);
      setDnaType(savedModel.dnaType);
      
      // Store in localStorage for wizard steps to access
      const wizardLocalData = {
        userId: "user-123",
        dnaType: savedModel.dnaType,
        answers: savedModel.answers
      };
      localStorage.setItem('wizardData', JSON.stringify(wizardLocalData));
      localStorage.setItem('resumingModelId', modelId);
    }
  }, [savedModel, modelId]);

  const handleNext = (stepData: any) => {
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = stepData.response;
    setAnswers(newAnswers);
    
    if (stepData.dnaType) {
      setDnaType(stepData.dnaType);
    }

    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - navigate to model generation
      const finalWizardData = {
        userId: "user-123",
        dnaType: stepData.dnaType || dnaType,
        answers: newAnswers
      };
      localStorage.setItem('wizardData', JSON.stringify(finalWizardData));
      localStorage.setItem('isResubmission', 'true');
      setLocation('/model-output');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepInitialData = (stepIndex: number) => {
    return {
      dnaType: dnaType,
      response: answers[stepIndex] || ""
    };
  };

  const getThemeClasses = (dnaType: "Architect" | "Alchemist") => {
    return dnaType === "Architect" 
      ? {
          gradient: "bg-gradient-to-r from-[#42047D] to-[#42047D]/80",
          badge: "bg-[#42047D] text-white",
          text: "text-[#42047D]"
        }
      : {
          gradient: "bg-gradient-to-r from-[#F6782F] to-[#F6782F]/80",
          badge: "bg-[#F6782F] text-white", 
          text: "text-[#F6782F]"
        };
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Loading your saved model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Model</h3>
          <p className="text-gray-600 mb-6">Unable to load the saved business model for editing.</p>
          <Button onClick={() => setLocation('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!wizardData) {
    return null;
  }

  const theme = getThemeClasses(dnaType);

  const renderCurrentStep = () => {
    const commonProps = {
      onNext: handleNext,
      onBack: handleBack,
      initialData: getStepInitialData(currentStep - 1)
    };

    switch (currentStep) {
      case 1:
        return <Step1_IdeaInput {...commonProps} onNext={handleNext} />;
      case 2:
        return <Step2_ProblemInput {...commonProps} />;
      case 3:
        return <Step3_AudienceInput {...commonProps} />;
      case 4:
        return <Step4_TimingInput {...commonProps} />;
      case 5:
        return <Step5_OfferInput {...commonProps} />;
      case 6:
        return <Step6_RevenueInput {...commonProps} />;
      case 7:
        return <Step7_CostInput {...commonProps} />;
      case 8:
        return <Step8_UspInput {...commonProps} />;
      case 9:
        return <Step9_BlockersInput {...commonProps} />;
      case 10:
        return <Step10_SupportInput {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-center text-indigo-900">
            Smart Business Builder™ – Edit & Resubmit
          </h1>
          <Badge className={theme.badge}>
            {dnaType}
          </Badge>
        </div>
        <p className="text-lg text-gray-600">
          Editing: {wizardData.label}
        </p>
        <p className="text-sm text-gray-500">
          Original saved: {new Date(wizardData.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Step {currentStep} of 10
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${theme.gradient}`}
              style={{ width: `${(currentStep / 10) * 100}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setLocation('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="text-sm text-gray-500">
          Resuming from saved answers
        </div>
      </div>

      {/* Current Step */}
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>
    </div>
  );
}