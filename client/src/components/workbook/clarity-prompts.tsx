import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";

interface ClarityPromptsProps {
  session: WorkbookSession | undefined;
}

export default function ClarityPrompts({ session }: ClarityPromptsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [prompts, setPrompts] = useState(
    session?.clarityPrompts || {
      businessIdea: "",
      audience: ""
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
        description: "Your clarity prompts have been saved.",
      });
    },
  });

  const handlePromptChange = (key: string, value: string) => {
    const updatedPrompts = { ...prompts, [key]: value };
    setPrompts(updatedPrompts);
    updateSessionMutation.mutate({ clarityPrompts: updatedPrompts });
  };

  return (
    <section id="clarity-prompts" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            3
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Idea Clarity Prompts</h2>
        </div>
        <p className="text-gray-600 text-lg">
          AI-powered insights to refine and sharpen your business concept.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-gray-50 border border-gray-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Business Idea Description</h3>
            <p className="text-gray-700">Describe your business idea in detail:</p>
            <Textarea
              value={prompts.businessIdea}
              onChange={(e) => handlePromptChange("businessIdea", e.target.value)}
              placeholder="What is your business idea? What problem does it solve? How does it work?"
              rows={4}
              className="w-full"
            />
          </div>
        </Card>

        <Card className="p-6 bg-gray-50 border border-gray-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Target Audience</h3>
            <p className="text-gray-700">Who exactly is your target audience?</p>
            <Textarea
              value={prompts.audience}
              onChange={(e) => handlePromptChange("audience", e.target.value)}
              placeholder="Describe your ideal customer in detail. What are their pain points, demographics, and characteristics?"
              rows={4}
              className="w-full"
            />
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Complete these prompts to get AI-powered clarity on your business idea.
        </p>
      </div>
    </section>
  );
}