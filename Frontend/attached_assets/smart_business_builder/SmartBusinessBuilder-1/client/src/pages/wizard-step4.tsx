import { Step4_TimingInput } from "@/components/steps/Step4_TimingInput";
import { useLocation } from "wouter";

export default function WizardStep4() {
  const [, setLocation] = useLocation();

  const handleStep4Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 4 completed:", data);
    // Navigate to step 5
    setLocation("/wizard/step5");
  };

  const handleBackToStep3 = () => {
    setLocation("/wizard/step3");
  };

  return (
    <Step4_TimingInput 
      onNext={handleStep4Complete} 
      onBack={handleBackToStep3}
    />
  );
}