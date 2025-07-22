import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AIService, type ClarityResponse } from "@/lib/ai-service";
import { Sparkles, Copy } from "lucide-react";
import type { WorkbookSession } from "@shared/schema";
import type { ClarityPrompts, AIResponse } from "@/types/workbook";

interface ClarityPromptsProps {
  session: WorkbookSession | undefined;
}

export default function ClarityPrompts({ session }: ClarityPromptsProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [prompts, setPrompts] = useState<ClarityPrompts>(() => {
    const defaultPrompts = {
      businessIdea: "",
      audience: "",
      problem: "",
      transformation: "",
      vehicle: "",
      emotion: "",
      blocker: "",
      aiResponse: "",
      clarityReflection: "",
      customPrompt: `I need help refining my business idea into a clear, scalable concept that combines clarity, strategy, and emotional resonance.

Here's what I've got so far:
• My business idea is: [insert]
• Who it's for: [insert]
• The problem I want to solve: [insert]
• The transformation or result I'm aiming for: [insert]
• What I might sell or deliver: [insert]
• What I'd love the brand to feel like (emotionally): [insert, optional]
• What's currently stopping me: [insert, optional]

Now please help me:
1. Refine the idea into a clean, simple business concept
2. Suggest a logical delivery and monetization model
3. Highlight any major risks, missing pieces, or unclear points
4. Offer 2–3 ways I could test or launch this quickly
5. Use a tone and structure that balances logic and flow

Then, summarize the final idea in 5 bullet points.`
    };
    
    const initialPrompts = session?.clarityPrompts ? 
      { ...defaultPrompts, ...session.clarityPrompts } : 
      defaultPrompts;
      
    console.log("Initial prompts loaded:", initialPrompts);
    return initialPrompts;
  });

  // Editable prompt text
  const [promptText, setPromptText] = useState(
    prompts.customPrompt || 
    `I need help refining my business idea into a clear, scalable concept that combines clarity, strategy, and emotional resonance.

Here's what I've got so far:
• My business idea is: [insert]
• Who it's for: [insert]
• The problem I want to solve: [insert]
• The transformation or result I'm aiming for: [insert]
• What I might sell or deliver: [insert]
• What I'd love the brand to feel like (emotionally): [insert, optional]
• What's currently stopping me: [insert, optional]

Now please help me:
1. Refine the idea into a clean, simple business concept
2. Suggest a logical delivery and monetization model
3. Highlight any major risks, missing pieces, or unclear points
4. Offer 2–3 ways I could test or launch this quickly
5. Use a tone and structure that balances logic and flow

Then, summarize the final idea in 5 bullet points.`
  );

  const handlePromptChange = (value: string) => {
    setPromptText(value);
    const updatedPrompts = { ...prompts, customPrompt: value };
    setPrompts(updatedPrompts);
    updateSessionMutation.mutate({ clarityPrompts: updatedPrompts });
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    toast({
      title: "Prompt copied!",
      description: "Your customized prompt has been copied to your clipboard.",
    });
  };

  // Session update mutation
  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      if (!session?.id) throw new Error("No session ID");
      return apiRequest("PATCH", `/api/workbook/session/${session.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
    },
  });

  // AI generation mutation
  const generateAIResponseMutation = useMutation({
    mutationFn: (prompt: string) => AIService.generateResponse(prompt),
    onSuccess: (response) => {
      console.log("AI Response received:", response);
      const updatedPrompts = { ...prompts, aiResponse: response };
      console.log("Updated prompts:", updatedPrompts);
      setPrompts(updatedPrompts);
      updateSessionMutation.mutate({ clarityPrompts: updatedPrompts });
      toast({
        title: "AI Response Generated!",
        description: "Your business concept has been enhanced with AI insights.",
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

  return (
    <Card id="clarity-prompts" className="p-4 sm:p-6 lg:p-8 bg-[#F3F0FF] border-purple-200">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-architect-indigo text-white rounded-full flex items-center justify-center text-sm font-bold">1.3</div>
          <h2 className="text-2xl font-bold text-strategic-black">Business Idea Clarity Prompts</h2>
        </div>
        <p className="text-gray-600 text-lg mb-4">Use AI to extract, sharpen, and simplify your business idea — instantly</p>
        
        <div className="p-6 bg-brand-gradient-light border border-purple-200 rounded-lg mb-6">
          <h3 className="font-semibold text-strategic-black mb-3">Purpose of This Section</h3>
          <p className="text-gray-700 mb-4">
            To help you use a master ChatGPT prompt to clearly articulate your business idea — 
            combining logic and energy — so you stop spinning and start building.
          </p>
          <p className="text-gray-700">
            This is a single, powerful prompt designed to:
          </p>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• Pull out your full idea</li>
            <li>• Strengthen it with both Alchemist and Architect logic</li>
            <li>• Highlight gaps, risks, and next-step opportunities</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-2">Education Box</h3>
          <p className="text-gray-700 mb-2">
            <strong>When your idea is fuzzy, your business stays stuck.</strong>
          </p>
          <p className="text-gray-700">
            Most entrepreneurs build too early, or doubt too long — because they can't articulate 
            their idea fully. The Business Clarity Prompt below is your shortcut. It's built for 
            both intuitive and logical thinkers — and gives you instant insight into your next move.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-strategic-black mb-2">Unified Master Prompt (for ChatGPT / AI agent)</h4>
          <p className="text-sm text-gray-700 mb-3">Edit the prompt below and copy it to ChatGPT:</p>
          <Textarea
            value={promptText}
            onChange={(e) => handlePromptChange(e.target.value)}
            className="bg-white text-sm text-gray-700 font-mono mb-4 min-h-[200px] resize-none"
            placeholder="Edit your prompt here..."
          />
          
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={copyPrompt}
              className={`text-white ${
                isArchitect 
                  ? "bg-architect-indigo hover:bg-purple-variant" 
                  : "bg-scale-orange hover:bg-orange-600"
              }`}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </Button>
            
            <Button
              onClick={handleGenerateWithAI}
              disabled={generateAIResponseMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateAIResponseMutation.isPending ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
        </div>

        {/* E-DNA Prompt Enhancers */}
        <div className="mt-8">
          <h3 className="font-semibold text-strategic-black text-lg mb-4">E-DNA Prompt Enhancers</h3>
          
          {/* Architect Enhancer - Only show when Architect mode is selected */}
          {isArchitect && (
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-architect-indigo mb-4">For Architects:</h4>
              <p className="text-gray-700 mb-3">
                Add these details to strengthen your prompt:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• What systems or processes would you build?</li>
                <li>• What metrics would prove this works?</li>
                <li>• What's your step-by-step delivery method?</li>
                <li>• What are the biggest logical risks?</li>
              </ul>
            </div>
          )}

          {/* Alchemist Enhancer - Only show when Alchemist mode is selected */}
          {!isArchitect && (
            <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-scale-orange mb-4">For Alchemists:</h4>
              <p className="text-gray-700 mb-3">
                Add these details to strengthen your prompt:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• What does success feel like for your client?</li>
                <li>• What story or transformation drives you?</li>
                <li>• What's your intuitive vision of the end result?</li>
                <li>• What emotional blocks might you face?</li>
              </ul>
            </div>
          )}
        </div>

        {/* AI Coaching Tip Box */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-2">AI Coaching Tip Box</h3>
          <p className="text-gray-700 mb-2"><strong>Tip:</strong></p>
          <p className="text-gray-700">
            If your response comes back too generic, try using your voice — talk out loud and transcribe, or describe your dream client like they're a friend.
          </p>
          <p className="text-gray-700 mt-2">
            The better your input, the sharper the AI's output.
          </p>
        </div>

        {/* Your AI Response Space */}
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-4">Your AI Response Space</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="responseDate" className="text-sm font-medium">
                Date:
              </Label>
              <Input
                id="responseDate"
                type="date"
                className="mt-1 max-w-xs"
              />
            </div>
            
            <div>
              <Label htmlFor="aiResponseSummary" className="text-sm font-medium">
                AI Response Summary:
              </Label>
              <Textarea
                id="aiResponseSummary"
                value={prompts.aiResponse || ""}
                onChange={(e) => {
                  console.log("Manual change to AI response:", e.target.value);
                  const updatedPrompts = { ...prompts, aiResponse: e.target.value };
                  setPrompts(updatedPrompts);
                  updateSessionMutation.mutate({ clarityPrompts: updatedPrompts });
                }}
                rows={8}
                placeholder="Your AI response will appear here, or paste your own response..."
                className="mt-2"
              />
              {/* Debug info */}
              <div className="text-xs text-gray-500 mt-1">
                Debug: aiResponse length: {(prompts.aiResponse || "").length}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Box */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-4">Completion Box</h3>
          <p className="text-gray-700 mb-4">After running the prompt, ask:</p>
          <ul className="text-gray-700 mb-4 space-y-1">
            <li>- What's clearer now?</li>
            <li>- What changed about your idea?</li>
            <li>- What still needs work?</li>
          </ul>
          
          <div>
            <Label htmlFor="completionAnswers" className="text-sm font-medium">
              Your Answers:
            </Label>
            <Textarea
              id="completionAnswers"
              rows={6}
              placeholder="Reflect on what became clearer after using the AI prompt..."
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
