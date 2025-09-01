import { Step3_AudienceInput } from "@/components/steps/Step3_AudienceInput";
import { useLocation } from "wouter";

export default function WizardStep3() {
  const [, setLocation] = useLocation();

  const handleStep3Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 3 completed:", data);
    // Navigate to step 4
    setLocation("/wizard/step4");
  };

  const handleBackToStep2 = () => {
    setLocation("/wizard/step2");
  };

  return (
    <Step3_AudienceInput 
      onNext={handleStep3Complete} 
      onBack={handleBackToStep2}
    />
  );
}