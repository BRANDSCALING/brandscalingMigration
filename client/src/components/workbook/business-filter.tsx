import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";

interface BusinessFilterProps {
  session: WorkbookSession | undefined;
}

export default function BusinessFilter({ session }: BusinessFilterProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filter, setFilter] = useState(
    session?.businessFilter || { 
      problem: null, 
      person: null, 
      profit: null, 
      pull: null
    }
  );

  // Editable prompt text
  const [promptText, setPromptText] = useState(
    session?.businessFilter?.customPrompt || 
    `I think I have a business idea, but I'm not sure if it actually works. Here's what I've got so far:
- Idea: [Insert]
- Who it's for: [Insert]
- The problem it solves: [Insert]
- How I imagine making money: [Insert]
Can you help me refine this and tell me what's missing?`
  );

  // AI response state
  const [aiResponse, setAiResponse] = useState(session?.businessFilter?.aiResponse || "");

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      if (!session?.id) throw new Error("No session ID");
      return apiRequest("PATCH", `/api/workbook/session/${session.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your responses have been saved.",
      });
    },
  });

  const handleFilterChange = (key: string, value: boolean) => {
    const updatedFilter = { ...filter, [key]: value };
    setFilter(updatedFilter);
    updateSessionMutation.mutate({ businessFilter: updatedFilter });
  };

  const handlePromptChange = (value: string) => {
    setPromptText(value);
    const updatedFilter = { ...filter, customPrompt: value };
    updateSessionMutation.mutate({ businessFilter: updatedFilter });
  };

  const handleAiResponseChange = (value: string) => {
    setAiResponse(value);
    const updatedFilter = { ...filter, aiResponse: value };
    updateSessionMutation.mutate({ businessFilter: updatedFilter });
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    toast({
      title: "Prompt copied!",
      description: "Your customized prompt has been copied to your clipboard.",
    });
  };

  const questions = [
    {
      key: "problem",
      title: "Problem",
      question: "Does this solve a real problem (or deep desire) for a specific person?",
      tip: "If the answer is vague, you need more clarity."
    },
    {
      key: "person",
      title: "Person",
      question: "Can you name the exact person (avatar) this is for?",
      tip: "If you can't name them specifically, it's too broad."
    },
    {
      key: "profit",
      title: "Profit",
      question: "Is there a clear path to making money from this?",
      tip: "Revenue model must be obvious and realistic."
    },
    {
      key: "pull",
      title: "Pull",
      question: "Does this energize you rather than drain you?",
      tip: "If it feels heavy now, it will feel heavier later."
    }
  ];

  return (
    <section id="business-filter" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            1
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Makes a Business Idea Work?</h2>
        </div>
        <p className="text-gray-600 text-lg">
          The 4-Part Viable Business Filter — Your idea must pass all four tests.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <Card key={q.key} className="p-6 bg-gray-50 border border-gray-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{q.title}</h3>
                <p className="text-gray-700 mb-4">{q.question}</p>
                <p className="text-sm text-gray-500 italic">{q.tip}</p>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleFilterChange(q.key, true)}
                  variant={filter[q.key as keyof typeof filter] === true ? "default" : "outline"}
                  className={filter[q.key as keyof typeof filter] === true ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  ✓ Yes
                </Button>
                <Button
                  onClick={() => handleFilterChange(q.key, false)}
                  variant={filter[q.key as keyof typeof filter] === false ? "default" : "outline"}
                  className={filter[q.key as keyof typeof filter] === false ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  ✗ No
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Business Idea Analysis</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customize your prompt for AI analysis:
            </label>
            <Textarea
              value={promptText}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="Describe your business idea..."
              rows={6}
              className="w-full"
            />
            <div className="mt-2 flex space-x-2">
              <Button onClick={copyPrompt} variant="outline" size="sm">
                Copy Prompt
              </Button>
            </div>
          </div>
          
          {aiResponse && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Analysis:
              </label>
              <Textarea
                value={aiResponse}
                onChange={(e) => handleAiResponseChange(e.target.value)}
                placeholder="AI response will appear here..."
                rows={8}
                className="w-full bg-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Complete all four filters to proceed to the next section.
        </p>
      </div>
    </section>
  );
}