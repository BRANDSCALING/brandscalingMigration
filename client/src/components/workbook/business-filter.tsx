import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/lib/ai-service";
import type { WorkbookSession } from "@shared/schema";
import type { BusinessFilter } from "@/types/workbook";

interface BusinessFilterProps {
  session: WorkbookSession | undefined;
}

export default function BusinessFilter({ session }: BusinessFilterProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filter, setFilter] = useState<BusinessFilter>(
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

  const handleFilterChange = (key: keyof BusinessFilter, value: boolean) => {
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

  // AI generation mutation
  const generateAIResponseMutation = useMutation({
    mutationFn: (prompt: string) => {
      console.log("Business Filter - Starting AI generation with prompt:", prompt.substring(0, 50) + "...");
      console.log("Business Filter - DNA Mode:", isArchitect ? 'architect' : 'alchemist');
      return AIService.generateResponse(prompt, isArchitect ? 'architect' : 'alchemist');
    },
    onSuccess: (response) => {
      console.log("Business Filter AI Response received:", response);
      console.log("Business Filter - Response length:", response.length);
      console.log("Business Filter - Setting aiResponse state to:", response.substring(0, 100) + "...");
      
      setAiResponse(response);
      
      const updatedFilter = { ...filter, aiResponse: response, customPrompt: promptText };
      console.log("Business Filter - Updated filter object:", updatedFilter);
      
      setFilter(updatedFilter);
      updateSessionMutation.mutate({ businessFilter: updatedFilter });
      
      toast({
        title: "AI Response Generated!",
        description: "Your business idea analysis is ready.",
      });
    },
    onError: (error) => {
      console.error("Business Filter AI Generation Error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI response",
        variant: "destructive",
      });
    },
  });

  const getAiResponse = () => {
    console.log("BUTTON CLICKED - Starting AI generation process");
    console.log("Current promptText:", promptText.substring(0, 100) + "...");
    console.log("Current aiResponse state:", aiResponse.length, "characters");
    
    if (!promptText.trim()) {
      console.log("ERROR - No prompt text provided");
      toast({
        title: "No Prompt",
        description: "Please enter a prompt before generating AI response.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("CALLING generateAIResponseMutation.mutate with prompt");
    generateAIResponseMutation.mutate(promptText);
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
      key: "problem" as keyof BusinessFilter,
      title: "Problem",
      question: "Does this solve a real problem (or deep desire) for a specific person?",
      tip: "If the answer is vague, you need more clarity."
    },
    {
      key: "person" as keyof BusinessFilter,
      title: "Person", 
      question: "Do I know who this is for? Can I describe them?",
      tip: "If your answer is \"everyone,\" you need to niche down."
    },
    {
      key: "profit" as keyof BusinessFilter,
      title: "Profit",
      question: "Can I clearly see how this makes money and scales?",
      tip: "If you're unsure, you'll define this in Section 1.5."
    },
    {
      key: "pull" as keyof BusinessFilter,
      title: "Pull",
      question: "Am I personally energized and excited to do this?",
      tip: "This is where alignment comes in. Don't skip it."
    }
  ];

  return (
    <Card id="business-filter" className="p-4 sm:p-6 lg:p-8 bg-[#F3F0FF] border-purple-200">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-architect-indigo text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1.1</div>
          <h2 className="text-xl sm:text-2xl font-bold text-strategic-black">What Makes a Business Idea Work?</h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          To help entrepreneurs understand the difference between an inspiring idea and a viable business. 
          This page builds clarity, confidence, and alignment before moving forward.
        </p>
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-2">Quick Insight</h3>
          <p className="text-gray-700 italic">
            "A business idea works when it solves a real problem, for a real person, in a way that 
            makes you money — and doesn't drain your energy." — Brandscaling Philosophy
          </p>
          <p className="text-gray-700 mt-2">
            Most entrepreneurs focus on what they love, but forget the other layers: profitability, 
            delivery model, energy alignment, and market need. This section sets the foundation 
            for a business idea that works in real life — not just in your head.
          </p>
        </div>
      </div>

      {/* E-DNA Insights Box */}
      <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg border ${
        isArchitect 
          ? "bg-purple-50 border-purple-200" 
          : "bg-orange-50 border-orange-200"
      }`}>
        <h3 className={`font-semibold mb-4 ${
          isArchitect ? "text-architect-indigo" : "text-scale-orange"
        }`}>
          {isArchitect ? "Architect Mode: Strategic Analysis" : "Alchemist Mode: Intuitive Flow"}
        </h3>
        <div className="space-y-2">
          {isArchitect ? (
            <>
              <p className="text-gray-700"><strong>Core Risk:</strong> Over-focus on logic, skip emotional pull</p>
              <p className="text-gray-700"><strong>Remember:</strong> You need magnetism, not just function. The market is human.</p>
            </>
          ) : (
            <>
              <p className="text-gray-700"><strong>Core Risk:</strong> Lost in inspiration, forget structure</p>
              <p className="text-gray-700"><strong>Remember:</strong> Energy alone isn't enough. You need delivery power.</p>
            </>
          )}
        </div>
      </div>

      {/* 4-Part Filter */}
      <div className="space-y-4 sm:space-y-6">
        {questions.map((q, index) => (
          <div key={q.key} className="p-4 sm:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-gradient text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-strategic-black mb-2 text-sm sm:text-base">{q.title}</h4>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{q.question}</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name={q.key}
                      checked={filter[q.key] === true}
                      onChange={() => handleFilterChange(q.key, true)}
                      className="text-architect-indigo focus:ring-architect-indigo" 
                    />
                    <span className="text-sm font-medium text-green-600">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name={q.key}
                      checked={filter[q.key] === false}
                      onChange={() => handleFilterChange(q.key, false)}
                      className="text-founder-red focus:ring-founder-red" 
                    />
                    <span className="text-sm font-medium text-founder-red">No</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">{q.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistance Section */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-brand-gradient-light border border-scale-orange/30 rounded-lg">
        <h3 className="font-semibold text-strategic-black mb-3">Get AI Clarity</h3>
        <p className="text-gray-700 mb-4">Edit the prompt below and get instant AI feedback:</p>
        <Textarea
          value={promptText}
          onChange={(e) => handlePromptChange(e.target.value)}
          className="bg-white text-sm text-gray-700 font-mono mb-4 min-h-[120px] resize-none"
          placeholder="Edit your prompt here..."
        />
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Button 
            onClick={getAiResponse}
            disabled={generateAIResponseMutation.isPending}
            className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {generateAIResponseMutation.isPending ? "Getting AI Response..." : "Get AI Response"}
          </Button>
          <Button 
            onClick={copyPrompt} 
            variant="outline"
            className="border-scale-orange text-scale-orange hover:bg-orange-50"
          >
            Copy Prompt
          </Button>
        </div>
        

      </div>

      {/* AI Response Space - Always Visible */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-brand-gradient-light border border-scale-orange/30 rounded-lg">
        <h3 className="font-semibold text-strategic-black mb-3">Your AI Response Space</h3>
        <Textarea
          value={aiResponse}
          onChange={(e) => handleAiResponseChange(e.target.value)}
          className="bg-white text-sm text-gray-700 min-h-[200px] resize-y"
          placeholder="Paste your AI response and insights here..."
        />
        {/* Debug info */}
        <div className="text-xs text-gray-500 mt-2">
          Debug: aiResponse length: {aiResponse.length} | Loading: {generateAIResponseMutation.isPending ? 'Yes' : 'No'}
        </div>
      </div>
    </Card>
  );
}
