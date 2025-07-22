import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";
import type { EdnaReflection } from "@/types/workbook";

interface EdnaReflectionProps {
  session: WorkbookSession | undefined;
}

export default function EdnaReflection({ session }: EdnaReflectionProps) {
  const { isArchitect, isAlchemist } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [reflection, setReflection] = useState<EdnaReflection>(
    session?.ednaReflection || {}
  );

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      return apiRequest("PATCH", `/api/workbook/session`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your reflections have been saved.",
      });
    },
  });

  const handleReflectionChange = (key: keyof EdnaReflection, value: string) => {
    const updatedReflection = { ...reflection, [key]: value };
    setReflection(updatedReflection);
    updateSessionMutation.mutate({ ednaReflection: updatedReflection });
  };

  return (
    <Card id="edna-reflection" className="p-4 sm:p-6 lg:p-8 bg-purple-50 border-purple-200">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1.2</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">The E-DNA Lens for Idea Clarity</h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          Your Entrepreneurial DNA affects how you think about and build businesses. Understanding your approach helps you play to your strengths and avoid common pitfalls.
        </p>
        
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Why This Matters</h3>
          <p className="text-gray-700">
            Architects tend to build systematic, scalable businesses but may miss emotional connection. 
            Alchemists create magnetic, inspiring businesses but may struggle with structure and delivery. 
            Both approaches work — when applied correctly.
          </p>
        </div>
      </div>

      {/* Architect Questions */}
      {isArchitect && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 bg-purple-100 border border-purple-300 rounded-lg">
            <h3 className="font-semibold text-purple-600 mb-4">Architect Mode: Strategic Deep Dive</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. What systems, processes, or frameworks could make this business more efficient and scalable?
                </label>
                <Textarea
                  value={reflection.architectReflection1 || ""}
                  onChange={(e) => handleReflectionChange("architectReflection1", e.target.value)}
                  className="bg-white text-sm text-gray-700 min-h-[100px]"
                  placeholder="Think about automation, standardization, measurable outcomes..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. How can you add emotional resonance and story to make people genuinely excited about this?
                </label>
                <Textarea
                  value={reflection.architectReflection2 || ""}
                  onChange={(e) => handleReflectionChange("architectReflection2", e.target.value)}
                  className="bg-white text-sm text-gray-700 min-h-[100px]"
                  placeholder="Consider the transformation story, personal connection, aspirational elements..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alchemist Questions */}
      {isAlchemist && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-500 mb-4">Alchemist Mode: Intuitive Deep Dive</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. What is the deeper transformation or feeling that people really want from this?
                </label>
                <Textarea
                  value={reflection.alchemistReflection1 || ""}
                  onChange={(e) => handleReflectionChange("alchemistReflection1", e.target.value)}
                  className="bg-white text-sm text-gray-700 min-h-[100px]"
                  placeholder="Think beyond features to the emotional outcome, identity shift, life change..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. How will you deliver this consistently and systematically to multiple people?
                </label>
                <Textarea
                  value={reflection.alchemistReflection2 || ""}
                  onChange={(e) => handleReflectionChange("alchemistReflection2", e.target.value)}
                  className="bg-white text-sm text-gray-700 min-h-[100px]"
                  placeholder="Consider processes, frameworks, tools, support systems you'll need..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DNA Switch Coaching */}
      <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-gray-600">
          Switch between Architect and Alchemist modes above to see how each approach would think about your business idea. 
          The best businesses combine both systematic thinking and emotional resonance.
        </p>
      </div>
    </Card>
  );
}