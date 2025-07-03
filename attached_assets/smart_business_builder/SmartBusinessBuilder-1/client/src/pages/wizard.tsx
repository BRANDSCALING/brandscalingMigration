import { Step1_IdeaInput } from "@/components/steps/Step1_IdeaInput";
import { useLocation } from "wouter";

export default function Wizard() {
  const [, setLocation] = useLocation();

  const handleStep1Complete = (data: { dnaType: "Architect" | "Alchemist"; response: string }) => {
    console.log("Step 1 completed:", data);
    // Navigate to step 2
    setLocation("/wizard/step2");
  };

  return (
    <Step1_IdeaInput onNext={handleStep1Complete} />
  );
}