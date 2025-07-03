import { Step5_OfferInput } from "@/components/steps/Step5_OfferInput";
import { useLocation } from "wouter";

export default function WizardStep5() {
  const [, setLocation] = useLocation();

  const handleStep5Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 5 completed:", data);
    // Navigate to step 6
    setLocation("/wizard/step6");
  };

  const handleBackToStep4 = () => {
    setLocation("/wizard/step4");
  };

  return (
    <Step5_OfferInput 
      onNext={handleStep5Complete} 
      onBack={handleBackToStep4}
    />
  );
}