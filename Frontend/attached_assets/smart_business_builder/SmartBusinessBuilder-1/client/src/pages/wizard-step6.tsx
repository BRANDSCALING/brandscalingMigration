import { Step6_RevenueInput } from "@/components/steps/Step6_RevenueInput";
import { useLocation } from "wouter";

export default function WizardStep6() {
  const [, setLocation] = useLocation();

  const handleStep6Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 6 completed:", data);
    // Navigate to step 7
    setLocation("/wizard/step7");
  };

  const handleBackToStep5 = () => {
    setLocation("/wizard/step5");
  };

  return (
    <Step6_RevenueInput 
      onNext={handleStep6Complete} 
      onBack={handleBackToStep5}
    />
  );
}