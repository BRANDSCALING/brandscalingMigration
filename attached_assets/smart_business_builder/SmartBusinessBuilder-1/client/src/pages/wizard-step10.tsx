import { Step10_SupportInput } from "@/components/steps/Step10_SupportInput";
import { useLocation } from "wouter";

export default function WizardStep10() {
  const [, setLocation] = useLocation();

  const handleWizardComplete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Wizard completed:", data);
    // Navigate to Module 2 - Model Output
    setLocation("/model-output");
  };

  const handleBackToStep9 = () => {
    setLocation("/wizard/step9");
  };

  return (
    <Step10_SupportInput 
      onSubmit={handleWizardComplete} 
      onBack={handleBackToStep9}
    />
  );
}