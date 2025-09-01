import { Step8_UspInput } from "@/components/steps/Step8_UspInput";
import { useLocation } from "wouter";

export default function WizardStep8() {
  const [, setLocation] = useLocation();

  const handleStep8Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 8 completed:", data);
    // Navigate to step 9
    setLocation("/wizard/step9");
  };

  const handleBackToStep7 = () => {
    setLocation("/wizard/step7");
  };

  return (
    <Step8_UspInput 
      onNext={handleStep8Complete} 
      onBack={handleBackToStep7}
    />
  );
}