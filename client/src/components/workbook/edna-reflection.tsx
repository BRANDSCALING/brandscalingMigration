import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Sparkles } from "lucide-react";
import type { WorkbookSession } from "@shared/schema";
import DNAToggle from "./dna-toggle";

interface EdnaReflectionProps {
  session: WorkbookSession | undefined;
}

export default function EdnaReflection({ session }: EdnaReflectionProps) {
  const { mode, isArchitect, isAlchemist } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [reflections, setReflections] = useState(
    session?.ednaReflection || {
      architectReflection1: "",
      architectReflection2: "",
      alchemistReflection1: "",
      alchemistReflection2: ""
    }
  );

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      if (!session?.id) throw new Error("No session ID");
      return apiRequest("PATCH", `/api/workbook/session/${session.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your reflections have been saved.",
      });
    },
  });

  const handleReflectionChange = (key: string, value: string) => {
    const updatedReflections = { ...reflections, [key]: value };
    setReflections(updatedReflections);
    updateSessionMutation.mutate({ ednaReflection: updatedReflections });
  };

  const architectPrompts = [
    {
      key: "architectReflection1",
      title: "Systems & Structure Analysis",
      prompt: "Looking at your business idea through your Architect lens: What systems, processes, or structures would need to be in place for this to work efficiently? What could go wrong if these aren't properly planned?"
    },
    {
      key: "architectReflection2", 
      title: "Strategic Planning Perspective",
      prompt: "As an Architect, how would you break this business idea down into logical phases or milestones? What would your 90-day implementation plan look like?"
    }
  ];

  const alchemistPrompts = [
    {
      key: "alchemistReflection1",
      title: "Vision & Transformation Focus",
      prompt: "Looking at your business idea through your Alchemist lens: What transformation are you really creating for people? How does this align with your deeper purpose and vision?"
    },
    {
      key: "alchemistReflection2",
      title: "Intuitive & Creative Insights",
      prompt: "As an Alchemist, what does your intuition tell you about this idea? What creative approaches or innovative angles could make this stand out in the market?"
    }
  ];

  const currentPrompts = isArchitect ? architectPrompts : alchemistPrompts;

  return (
    <section id="edna-reflection" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            2
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The E-DNA Lens for Idea Clarity</h2>
        </div>
        <p className="text-gray-600 text-lg mb-6">
          Use your Entrepreneurial DNA to analyze your business idea from your unique perspective.
        </p>
        
        {/* DNA Mode Toggle */}
        <div className="flex justify-center mb-8">
          <DNAToggle />
        </div>
      </div>

      <div className="space-y-6">
        {currentPrompts.map((prompt) => (
          <Card key={prompt.key} className="p-6 border-2 border-dashed border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                {isArchitect ? (
                  <Building2 className="w-6 h-6 text-indigo-600" />
                ) : (
                  <Sparkles className="w-6 h-6 text-orange-500" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {prompt.title}
                </h3>
              </div>
              
              <p className="text-gray-700 font-medium bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                {prompt.prompt}
              </p>
              
              <Textarea
                value={reflections[prompt.key as keyof typeof reflections] || ""}
                onChange={(e) => handleReflectionChange(prompt.key, e.target.value)}
                placeholder="Write your reflection here..."
                rows={4}
                className="w-full"
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isArchitect ? "Architect" : "Alchemist"} Mode Active
        </h3>
        <p className="text-gray-600">
          {isArchitect 
            ? "You're analyzing through your systematic, structure-focused Architect lens. Focus on planning, efficiency, and logical implementation."
            : "You're analyzing through your visionary, transformation-focused Alchemist lens. Focus on purpose, creativity, and innovative possibilities."
          }
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Switch modes above to see how your idea looks from a different entrepreneurial perspective.
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Complete your E-DNA reflections to gain clarity on your business approach.
        </p>
      </div>
    </section>
  );
}