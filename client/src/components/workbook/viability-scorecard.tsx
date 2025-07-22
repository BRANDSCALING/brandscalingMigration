import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import type { WorkbookSession } from "@shared/schema";
import { AIService } from "@/lib/ai-service";

interface ViabilityScoreCardProps {
  session: WorkbookSession | undefined;
}

export default function ViabilityScorecard({ session }: ViabilityScoreCardProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [scores, setScores] = useState(
    session?.viabilityScores || {
      clarity: 0,
      demand: 0,
      differentiation: 0,
      deliveryFeasibility: 0,
      emotionalPull: 0,
      buyerUrgency: 0,
      profitPotential: 0,
      founderFit: 0,
      totalScore: 0,
      aiResponseSpace: ""
    }
  );

  const [aiResponseSpace, setAiResponseSpace] = useState(session?.viabilityScores?.aiResponseSpace || "");

  // Editable prompt text
  const [promptText, setPromptText] = useState(
    session?.viabilityScores?.customPrompt || 
    `"Here are my ratings across 8 offer viability areas:

Clarity: [insert]
Demand: [insert]
Differentiation: [insert]
Delivery: [insert]
Emotional pull: [insert]
Buyer urgency: [insert]
Profit potential: [insert]
Founder fit: [insert]

Can you analyse where this idea is weak and suggest improvements that would raise my score to 35+?"`
  );

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      if (!session?.id) throw new Error("No session ID");
      return apiRequest("PATCH", `/api/workbook/session/${session.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
    },
  });

  const handleScoreChange = (factor: string, value: number) => {
    const updatedScores = { ...scores, [factor]: value };
    const totalScore = Object.keys(updatedScores)
      .filter(key => key !== 'totalScore' && key !== 'aiResponseSpace')
      .reduce((sum, key) => {
        const scoreValue = updatedScores[key as keyof typeof updatedScores];
        return sum + (typeof scoreValue === 'number' ? scoreValue : 0);
      }, 0);
    updatedScores.totalScore = totalScore;
    setScores(updatedScores);
    updateSessionMutation.mutate({ viabilityScores: { ...updatedScores, aiResponseSpace } });
  };

  const handleAiResponseChange = (value: string) => {
    setAiResponseSpace(value);
    updateSessionMutation.mutate({ viabilityScores: { ...scores, aiResponseSpace: value } });
  };

  const handlePromptChange = (value: string) => {
    setPromptText(value);
    updateSessionMutation.mutate({ viabilityScores: { ...scores, aiResponseSpace, customPrompt: value } });
  };

  const copyAiPrompt = () => {
    navigator.clipboard.writeText(promptText);
    toast({
      title: "Prompt copied!",
      description: "Your customized prompt has been copied to your clipboard.",
    });
  };

  // AI Generation Mutation
  const generateAIResponseMutation = useMutation({
    mutationFn: (prompt: string) => AIService.generateResponse(prompt),
    onSuccess: (response) => {
      console.log("AI Response received:", response);
      setAiResponseSpace(response);
      updateSessionMutation.mutate({ 
        viabilityScores: { 
          ...scores, 
          aiResponseSpace: response, 
          customPrompt: promptText 
        } 
      });
      toast({
        title: "AI Response Generated!",
        description: "Your viability analysis has been generated with AI insights.",
      });
    },
    onError: (error) => {
      console.error("AI Generation Error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI response",
        variant: "destructive",
      });
    },
  });

  const handleGenerateWithAI = () => {
    if (!promptText.trim()) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt before generating AI response.",
        variant: "destructive",
      });
      return;
    }
    generateAIResponseMutation.mutate(promptText);
  };

  const getScoreInterpretation = (total: number) => {
    if (total >= 35) {
      return {
        title: "Strong — launch ready",
        description: "Minor refinements only.",
        color: "bg-green-500"
      };
    } else if (total >= 28) {
      return {
        title: "Viable — refine the weak spots",
        description: "Address low-scoring areas before launching.",
        color: "bg-blue-500"
      };
    } else if (total >= 20) {
      return {
        title: "Needs work — pause and adjust",
        description: "Significant improvements needed before proceeding.",
        color: "bg-yellow-500"
      };
    } else {
      return {
        title: "Not viable — pivot or reassess",
        description: "Build clarity before proceeding.",
        color: "bg-red-500"
      };
    }
  };

  const totalScore = scores.totalScore || Object.keys(scores)
    .filter(key => key !== 'totalScore' && key !== 'aiResponseSpace' && key !== 'actionPlanning')
    .reduce((sum, key) => {
      const scoreValue = scores[key as keyof typeof scores];
      return sum + (typeof scoreValue === 'number' ? scoreValue : 0);
    }, 0);

  const factors = [
    {
      key: "clarity" as const,
      title: "Clarity",
      description: "Can you explain what it is, who it's for, and why it matters in 30 seconds?",
      coachingNote: "No clarity = no sales."
    },
    {
      key: "demand" as const,
      title: "Demand", 
      description: "Is there visible demand? (searches, questions, buying behavior)",
      coachingNote: "Check Google, Reddit, forums, competitors."
    },
    {
      key: "differentiation" as const,
      title: "Differentiation",
      description: "Does this stand out from what already exists?",
      coachingNote: "Doesn't have to be brand new — just clearly better or different."
    },
    {
      key: "deliveryFeasibility" as const,
      title: "Delivery Feasibility",
      description: "Can you deliver this offer reliably and at scale?",
      coachingNote: "Can YOU or a system/team fulfill this without breaking?"
    },
    {
      key: "emotionalPull" as const,
      title: "Emotional Pull",
      description: "Does this feel aligned and exciting to build?",
      coachingNote: "If you dread it, you won't grow it."
    },
    {
      key: "buyerUrgency" as const,
      title: "Buyer Urgency",
      description: "Is there a reason they'll buy now vs. later?",
      coachingNote: "Is the pain high, or the timing right?"
    },
    {
      key: "profitPotential" as const,
      title: "Profit Potential",
      description: "Is there enough margin to grow, hire, reinvest?",
      coachingNote: "Don't build a hamster wheel."
    },
    {
      key: "founderFit" as const,
      title: "Founder Fit",
      description: "Are you the right person to build this, now?",
      coachingNote: "Based on your skills, E-DNA, and current life season."
    }
  ];

  const interpretation = getScoreInterpretation(totalScore);

  return (
    <Card id="viability-scorecard" className="p-4 sm:p-6 lg:p-8 bg-[#F3F0FF] border-purple-200">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-architect-indigo text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1.5</div>
          <h2 className="text-xl sm:text-2xl font-bold text-strategic-black">Idea Viability Scorecard</h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">Test your idea before you waste time, money, or energy</p>
        
        {/* Purpose Section */}
        <div className="p-4 sm:p-6 bg-brand-gradient-light border border-purple-200 rounded-lg mb-4 sm:mb-6">
          <h3 className="font-semibold text-strategic-black mb-3">Purpose of This Section</h3>
          <p className="text-gray-700">
            To help entrepreneurs pressure-test their idea or offer against 8 viability pillars — so they can confidently decide to move forward, refine it, or pivot before investing time and resources.
          </p>
        </div>

        {/* Education Box */}
        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-2">Education Box</h3>
          <p className="text-gray-700 mb-2">
            <strong>It's easy to fall in love with your idea.</strong>
          </p>
          <p className="text-gray-700 mb-2">
            But success comes from building something that the market wants, can afford, and understands.
          </p>
          <p className="text-gray-700 mb-2">
            This scorecard gives you an honest, structured check on your idea's readiness — using both Alchemist signals (pull, resonance, mission) and Architect signals (profit, delivery, demand).
          </p>
          <p className="text-gray-700">
            Don't wait for the market to reject your idea. Use this tool to self-correct now.
          </p>
        </div>
      </div>

      {/* Dual DNA Coaching View */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-4">Dual DNA Coaching View</h3>
        <p className="text-gray-700 mb-4">
          Your Entrepreneurial DNA determines what you focus on naturally — and what you may ignore. This scorecard balances both:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-architect-indigo mb-4">Architect bias</h4>
            <p className="text-gray-700">
              You might over-focus on efficiency or profitability and ignore emotional appeal.
            </p>
          </div>

          <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-scale-orange mb-4">Alchemist bias</h4>
            <p className="text-gray-700">
              You may focus on alignment and passion but forget about delivery, cost, or buyer urgency.
            </p>
          </div>
        </div>
        
        <p className="text-gray-700">
          Great ideas need both structure and resonance — use this scorecard to zoom out and see the full picture.
        </p>
      </div>

      {/* The Viability Scorecard */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-4">The Viability Scorecard (8 Pillars)</h3>
        <p className="text-gray-700 mb-6">Rate each pillar from 1 to 5 (1 = weak, 5 = strong)</p>
        
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {factors.map((factor) => (
            <div key={factor.key} className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-strategic-black mb-2 text-sm sm:text-base">{factor.title}</h4>
                  <p className="text-gray-700 text-xs sm:text-sm mb-2">{factor.description}</p>
                  <p className="text-xs text-gray-600">{factor.coachingNote}</p>
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-4 text-center">
                  <div className="text-lg sm:text-xl font-bold text-architect-indigo mb-1">
                    {scores[factor.key] || 0}
                  </div>
                  <p className="text-xs text-gray-500">/ 5</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleScoreChange(factor.key, rating)}
                    className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors ${
                      scores[factor.key] === rating
                        ? isArchitect
                          ? "bg-architect-indigo border-architect-indigo text-white"
                          : "bg-scale-orange border-scale-orange text-white"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total Score Display */}
        <div className="p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <h4 className="font-semibold text-strategic-black mb-2">Your Total Score</h4>
          <div className="text-2xl sm:text-3xl font-bold text-architect-indigo mb-2">
            {totalScore} / 40
          </div>
          <div className={`inline-block px-4 py-2 rounded-lg text-white font-medium ${interpretation.color}`}>
            {interpretation.title}
          </div>
          <p className="text-gray-700 mt-2">{interpretation.description}</p>
        </div>
      </div>

      {/* Score Interpretation */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-4">Score Interpretation</h3>
        
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gradient-to-r from-purple-100 to-orange-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-strategic-black border-b border-gray-300">Score Range</th>
                <th className="px-4 py-3 text-left font-semibold text-strategic-black border-b border-gray-300">Interpretation</th>
                <th className="px-4 py-3 text-left font-semibold text-strategic-black border-b border-gray-300">Next Steps</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-green-50">
                <td className="px-4 py-3 font-medium text-green-700">32-40</td>
                <td className="px-4 py-3">Strong idea — move forward with confidence</td>
                <td className="px-4 py-3">Start building your MVP or first offer</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-blue-50">
                <td className="px-4 py-3 font-medium text-blue-700">24-31</td>
                <td className="px-4 py-3">Good foundation — needs refinement</td>
                <td className="px-4 py-3">Focus on your lowest-scoring pillars</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-yellow-50">
                <td className="px-4 py-3 font-medium text-yellow-700">16-23</td>
                <td className="px-4 py-3">Promising but needs work</td>
                <td className="px-4 py-3">Revisit your core concept and target audience</td>
              </tr>
              <tr className="hover:bg-red-50">
                <td className="px-4 py-3 font-medium text-red-700">8-15</td>
                <td className="px-4 py-3">Significant gaps — consider pivoting</td>
                <td className="px-4 py-3">Go back to ideation or find a different angle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Planning */}


      {/* AI Prompt & Response */}
      <div>
        <h3 className="font-semibold text-strategic-black text-lg mb-4">Optional AI Prompt</h3>
        <p className="text-gray-700 mb-4">Edit the prompt below and copy it to ChatGPT:</p>
        
        <Textarea
          value={promptText}
          onChange={(e) => handlePromptChange(e.target.value)}
          className="bg-gray-50 text-sm text-gray-700 font-mono mb-4 min-h-[120px] resize-none"
          placeholder="Edit your prompt here..."
        />
        
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            onClick={copyAiPrompt}
            className={`${
              isArchitect 
                ? "bg-architect-indigo hover:bg-purple-variant" 
                : "bg-scale-orange hover:bg-orange-600"
            } text-white`}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy AI Analysis Prompt
          </Button>
          
          <Button
            onClick={handleGenerateWithAI}
            disabled={generateAIResponseMutation.isPending}
            className={`${
              isArchitect 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-orange-600 hover:bg-orange-700"
            } text-white`}
          >
            {generateAIResponseMutation.isPending ? "Generating..." : "Generate with AI"}
          </Button>
        </div>

        <div>
          <h4 className="font-medium text-strategic-black mb-3">Your AI Response Space</h4>
          <Textarea
            rows={6}
            placeholder="Paste your AI response and insights here..."
            value={aiResponseSpace}
            onChange={(e) => handleAiResponseChange(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
