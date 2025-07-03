import { Step9_BlockersInput } from "@/components/steps/Step9_BlockersInput";
import { useLocation } from "wouter";

export default function WizardStep9() {
  const [, setLocation] = useLocation();

  const handleStep9Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 9 completed:", data);
    // Navigate to step 10
    setLocation("/wizard/step10");
  };

  const handleBackToStep8 = () => {
    setLocation("/wizard/step8");
  };

  return (
    <Step9_BlockersInput 
      onNext={handleStep9Complete} 
      onBack={handleBackToStep8}
    />
  );
}