import { Step7_CostInput } from "@/components/steps/Step7_CostInput";
import { useLocation } from "wouter";

export default function WizardStep7() {
  const [, setLocation] = useLocation();

  const handleStep7Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 7 completed:", data);
    // Navigate to step 8
    setLocation("/wizard/step8");
  };

  const handleBackToStep6 = () => {
    setLocation("/wizard/step6");
  };

  return (
    <Step7_CostInput 
      onNext={handleStep7Complete} 
      onBack={handleBackToStep6}
    />
  );
}