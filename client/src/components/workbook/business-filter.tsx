import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface WorkbookSession {
  id: string;
  userId: string;
  userEmail: string;
  dnaMode: 'architect' | 'alchemist';
  businessFilter?: BusinessFilter;
  ednaReflection?: any;
  clarityPrompts?: any;
  offerBuilder?: any;
  viabilityScores?: any;
  nameLogoBuilder?: any;
  energyLevel?: number;
  completedSections: string[];
  currentSection: number;
  totalSections: number;
  createdAt: string;
  updatedAt: string;
}

interface BusinessFilter {
  problem: boolean | null;
  person: boolean | null;
  profit: boolean | null;
  pull: boolean | null;
  customPrompt?: string;
  aiResponse?: string;
}

interface BusinessFilterProps {
  session: WorkbookSession | undefined;
}

export default function BusinessFilter({ session }: BusinessFilterProps) {
  const isArchitect = session?.dnaMode === 'architect';
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
  const [isLoadingAI, setIsLoadingAI] = useState(false);

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

  const generateAIResponse = async () => {
    if (!promptText.trim()) return;
    
    setIsLoadingAI(true);
    try {
      const response = await apiRequest("POST", "/api/workbook/ai-prompt", {
        prompt: promptText,
        context: "business-filter",
        dnaMode: session?.dnaMode || 'architect'
      });
      
      if (response.response) {
        setAiResponse(response.response);
        handleAiResponseChange(response.response);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div id="business-filter" className="space-y-8">
      {/* Section Header */}
      <div className="bg-purple-700 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white text-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            1
          </div>
          <h2 className="text-2xl font-bold">What Makes a Business Idea Work?</h2>
        </div>
        <p className="text-purple-100 mb-6">
          To help entrepreneurs understand the difference between an inspiring idea and a viable business. 
          This page builds clarity, confidence, and alignment before moving forward.
        </p>

        {/* Quick Insight */}
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">Quick Insight</h4>
          <p className="text-sm italic mb-3">
            "A business idea works when it solves a real problem, for a real person, in a way that makes you money — and doesn't drain your energy." 
            <span className="text-purple-200">— Brandscaling Philosophy</span>
          </p>
          <p className="text-sm">
            Most entrepreneurs focus on what they love, but forget the other layers: profitability, delivery model, energy alignment, and market need. 
            This section sets the foundation for a business idea that works in real life — not just in your head.
          </p>
        </div>

        {/* DNA Mode Specific Guidance */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold mb-3">
            {isArchitect ? 'Architect Mode: Strategic Analysis' : 'Alchemist Mode: Intuitive Flow'}
          </h4>
          {isArchitect ? (
            <div>
              <p className="font-medium text-purple-200 mb-2">Core Risk: Over-focus on logic, skip emotional pull</p>
              <p className="text-sm">Remember: You need magnetism, not just function. The market is human.</p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-orange-200 mb-2">Core Risk: Follow passion, skip practical delivery</p>
              <p className="text-sm">Remember: Great energy needs great structure. Passion without profit burns out.</p>
            </div>
          )}
        </div>
      </div>

      {/* Business Filter Questions */}
      <div className="space-y-6">
        {[
          {
            key: 'problem' as keyof BusinessFilter,
            title: 'Problem',
            question: 'Does this solve a real problem (or deep desire) for a specific person?',
            help: 'If the answer is vague, you need more clarity.'
          },
          {
            key: 'person' as keyof BusinessFilter,
            title: 'Person',
            question: 'Do I know who this is for? Can I describe them?',
            help: 'If your answer is "everyone", you need to write this down.'
          },
          {
            key: 'profit' as keyof BusinessFilter,
            title: 'Profit',
            question: 'Can I see a clear path to making money from this?',
            help: 'If it\'s not obvious how you\'ll get paid, dig deeper.'
          },
          {
            key: 'pull' as keyof BusinessFilter,
            title: 'Pull',
            question: 'Am I personally energized and excited to do this?',
            help: 'This is where alignment happens. Don\'t skip it.'
          }
        ].map((item) => (
          <Card key={item.key} className="bg-white border-purple-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                  {item.title.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
              </div>
              
              <p className="font-medium mb-4 text-gray-900">{item.question}</p>
              
              <div className="flex space-x-6 mb-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={item.key}
                    value="yes"
                    checked={filter[item.key] === true}
                    onChange={() => handleFilterChange(item.key, true)}
                    className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-green-600 font-medium">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={item.key}
                    value="no"
                    checked={filter[item.key] === false}
                    onChange={() => handleFilterChange(item.key, false)}
                    className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-red-600 font-medium">No</span>
                </label>
              </div>
              
              <p className="text-sm text-gray-600">{item.help}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Clarity Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <div className="p-6">
          <h3 className="font-bold text-lg mb-4">Get AI Clarity</h3>
          <p className="text-gray-600 mb-4">
            Edit the prompt below and get instant AI feedback:
          </p>
          
          <Textarea
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              handlePromptChange(e.target.value);
            }}
            className="min-h-[100px] mb-4 text-sm"
            placeholder="Describe your business idea..."
          />
          
          <div className="flex space-x-3 mb-4">
            <Button 
              onClick={generateAIResponse}
              disabled={isLoadingAI || !promptText.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoadingAI ? "Generating..." : "Get AI Response"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigator.clipboard.writeText(promptText)}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Copy Prompt
            </Button>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Your AI Response Space</h4>
            <Textarea
              value={aiResponse}
              onChange={(e) => {
                setAiResponse(e.target.value);
                handleAiResponseChange(e.target.value);
              }}
              className="min-h-[120px] text-sm"
              placeholder="Paste your AI response and insights here..."
            />
          </div>
        </div>
      </Card>
    </div>
  );
}