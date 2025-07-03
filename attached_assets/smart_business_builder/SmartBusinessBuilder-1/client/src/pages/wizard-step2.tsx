import { Step2_ProblemInput } from "@/components/steps/Step2_ProblemInput";
import { useLocation } from "wouter";

export default function WizardStep2() {
  const [, setLocation] = useLocation();

  const handleStep2Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 2 completed:", data);
    // Navigate to step 3
    setLocation("/wizard/step3");
  };

  const handleBackToStep1 = () => {
    setLocation("/wizard");
  };

  return (
    <Step2_ProblemInput 
      onNext={handleStep2Complete} 
      onBack={handleBackToStep1}
    />
  );
}