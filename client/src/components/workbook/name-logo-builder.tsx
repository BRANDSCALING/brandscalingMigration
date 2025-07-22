import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/lib/ai-service";
import type { WorkbookSession } from "@shared/schema";

interface NameLogoBuilderProps {
  session: WorkbookSession | undefined;
}

export default function NameLogoBuilder({ session }: NameLogoBuilderProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [nameLogoData, setNameLogoData] = useState(
    session?.nameLogoBuilder || {
      businessNameOptions: ["", "", "", "", ""],
      logoConceptDirections: ["", "", ""],
      taglineOptions: ["", ""],
      colorPalette: "",
      nameRatings: {
        name1EasyToSay: 0,
        name1Memorable: 0,
        name1Professional: 0,
        name1DomainAvailable: 0,
        name1FeelsRight: 0,
        name1Total: 0,
        name2EasyToSay: 0,
        name2Memorable: 0,
        name2Professional: 0,
        name2DomainAvailable: 0,
        name2FeelsRight: 0,
        name2Total: 0,
        name3EasyToSay: 0,
        name3Memorable: 0,
        name3Professional: 0,
        name3DomainAvailable: 0,
        name3FeelsRight: 0,
        name3Total: 0,
        name4EasyToSay: 0,
        name4Memorable: 0,
        name4Professional: 0,
        name4DomainAvailable: 0,
        name4FeelsRight: 0,
        name4Total: 0,
        name5EasyToSay: 0,
        name5Memorable: 0,
        name5Professional: 0,
        name5DomainAvailable: 0,
        name5FeelsRight: 0,
        name5Total: 0
      },
      finalDecisions: {
        chosenBusinessName: "",
        chosenLogoDirection: "",
        chosenTagline: "",
        chosenColorPalette: ""
      },
      customPrompt: "",
      aiResponse: ""
    }
  );

  // Editable prompt text
  const [promptText, setPromptText] = useState(
    session?.nameLogoBuilder?.customPrompt || 
    `"I need help creating a name and logo concept for my business.

Here's my business:
• What I do: [insert your offer/service]
• Who it's for: [insert target audience]
• Key benefits: [insert main transformation/result]
• Personality/tone: [insert how you want to be perceived]
• Industry: [insert your industry/niche]

Please suggest:
• 5 business name options (check domain availability)
• 3 logo concept directions (describe style, colors, symbols)
• 2 tagline options
• Color palette suggestions (include hex codes)

Make sure everything feels professional but approachable, and works for both digital and print."`
  );

  // AI Response State
  const [aiResponse, setAiResponse] = useState(
    session?.nameLogoBuilder?.aiResponse || ""
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

  const handleBusinessNameChange = (index: number, value: string) => {
    const updatedData = { ...nameLogoData };
    updatedData.businessNameOptions[index] = value;
    setNameLogoData(updatedData);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
  };

  const handleLogoConceptChange = (index: number, value: string) => {
    const updatedData = { ...nameLogoData };
    updatedData.logoConceptDirections[index] = value;
    setNameLogoData(updatedData);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
  };

  const handleTaglineChange = (index: number, value: string) => {
    const updatedData = { ...nameLogoData };
    updatedData.taglineOptions[index] = value;
    setNameLogoData(updatedData);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
  };

  const handleColorPaletteChange = (value: string) => {
    const updatedData = { ...nameLogoData, colorPalette: value };
    setNameLogoData(updatedData);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
  };

  const handleNameRatingChange = (field: string, value: number) => {
    const updatedData = { ...nameLogoData };
    updatedData.nameRatings[field as keyof typeof updatedData.nameRatings] = value;
    
    // Calculate totals for each name
    for (let i = 1; i <= 5; i++) {
      const total = 
        (updatedData.nameRatings[`name${i}EasyToSay` as keyof typeof updatedData.nameRatings] || 0) +
        (updatedData.nameRatings[`name${i}Memorable` as keyof typeof updatedData.nameRatings] || 0) +
        (updatedData.nameRatings[`name${i}Professional` as keyof typeof updatedData.nameRatings] || 0) +
        (updatedData.nameRatings[`name${i}DomainAvailable` as keyof typeof updatedData.nameRatings] || 0) +
        (updatedData.nameRatings[`name${i}FeelsRight` as keyof typeof updatedData.nameRatings] || 0);
      updatedData.nameRatings[`name${i}Total` as keyof typeof updatedData.nameRatings] = total;
    }
    
    setNameLogoData(updatedData);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
  };

  const handleFinalDecisionChange = (field: string, value: string) => {
    const updatedData = { ...nameLogoData };
    updatedData.finalDecisions[field as keyof typeof updatedData.finalDecisions] = value;
    setNameLogoData(updatedData);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
  };

  const handlePromptChange = (value: string) => {
    setPromptText(value);
    const updatedData = { ...nameLogoData, customPrompt: value };
    updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  // AI Generation Mutation
  const generateAIResponseMutation = useMutation({
    mutationFn: (prompt: string) => AIService.generateResponse(prompt),
    onSuccess: (response) => {
      console.log("AI Response received:", response);
      setAiResponse(response);
      const updatedData = { ...nameLogoData, customPrompt: promptText, aiResponse: response };
      updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
      toast({
        title: "AI Response Generated!",
        description: "Your branding suggestions have been generated with AI insights.",
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
    <Card id="name-logo-builder" className="p-4 sm:p-6 lg:p-8 bg-[#F3F0FF] border-purple-200">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-architect-indigo text-white rounded-full flex items-center justify-center text-sm font-bold">1.6</div>
          <h2 className="text-2xl font-bold text-strategic-black">Name & Logo Builder</h2>
        </div>
        <p className="text-gray-600 text-lg mb-4">Create a memorable brand identity that works across all platforms</p>
        
        {/* Purpose of This Section */}
        <div className="p-6 bg-brand-gradient-light border border-purple-200 rounded-lg mb-6">
          <h3 className="font-semibold text-strategic-black mb-3">Purpose of This Section</h3>
          <p className="text-gray-700">
            To help entrepreneurs quickly generate a professional name and visual identity for their business — without getting stuck in perfectionism or spending weeks on design.
          </p>
        </div>

        {/* Education Box */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <h3 className="font-semibold text-strategic-black mb-2">Education Box</h3>
          <p className="text-gray-700 mb-2">
            <strong>Your business name and logo are your first impression.</strong>
          </p>
          <p className="text-gray-700 mb-2">
            They don't need to be perfect, but they do need to be:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
            <li>Clear and memorable</li>
            <li>Professional and credible</li>
            <li>Scalable across platforms (social media, website, business cards)</li>
          </ul>
          <p className="text-gray-700">
            This section gives you the tools to create a strong brand identity quickly, so you can focus on building your business.
          </p>
        </div>

        {/* Dual DNA Coaching View */}
        <div className="mb-8">
          <h3 className="font-semibold text-strategic-black text-lg mb-4">Dual DNA Coaching View</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            {/* Architect View */}
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-architect-indigo mb-4">Architect approach</h4>
              <p className="text-gray-700">
                <strong>You need:</strong> A clear, scalable name that works across systems, platforms, and assets
              </p>
            </div>

            {/* Alchemist View */}
            <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-scale-orange mb-4">Alchemist approach</h4>
              <p className="text-gray-700">
                <strong>You need:</strong> A magnetic brand identity that feels aligned, energizing, and emotionally resonant
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
            <p className="text-gray-700 mb-2">
              <strong>This step requires both Architect and Alchemist thinking.</strong>
            </p>
            <p className="text-gray-700 mb-2">
              If you only use one mode, you'll either be:
            </p>
            <ul className="text-gray-700 list-disc list-inside mb-2 ml-4">
              <li>All emotion, no usability (Alchemist stuck in perfectionism)</li>
              <li>All practicality, no connection (Architect rushing with a placeholder)</li>
            </ul>
            <p className="text-gray-700 font-medium">
              Use both sides — the perfect business name and brand lives in the middle.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Your Naming Criteria Checklist */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-4">Step 1: Your Naming Criteria Checklist</h3>
        <p className="text-gray-700 mb-6">Check off what matters to you before running prompts:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-purple-200">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-orange-100 border-b border-purple-200">
                <th className="p-4 text-left font-semibold text-strategic-black border-r border-purple-200">Criteria</th>
                <th className="p-4 text-center font-semibold text-strategic-black">Check</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">Available domain (preferably .co.uk or .com)</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
              <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">Not too long (2-3 words max)</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
              <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">Memorable and pronounceable</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
              <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">Avoids spelling confusion</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
              <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">Feels aligned with the offer</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
              <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">Has clear, clean visual potential</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
              <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">Social media handles available</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
              <tr className="hover:bg-purple-50 transition-colors">
                <td className="p-4 text-gray-700 border-r border-purple-100">No major trademark conflicts</td>
                <td className="p-4 text-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="text-gray-700 mt-4">
          <strong>Optional:</strong> Use Namecheckr.com to verify availability.
        </p>
      </div>

      {/* Master Prompt for Name + Logo Builder */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-4">Master Prompt for Name + Logo Builder</h3>
        <p className="text-gray-700 mb-4">Copy this into ChatGPT:</p>
        
        <Textarea
          value={promptText}
          onChange={(e) => handlePromptChange(e.target.value)}
          className="bg-gray-50 text-sm text-gray-700 font-mono mb-4 min-h-[200px] resize-none"
          placeholder="Edit your prompt here..."
        />
        
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            onClick={() => copyToClipboard(promptText, "Master prompt")}
            className={`${
              isArchitect 
                ? "bg-architect-indigo hover:bg-purple-variant" 
                : "bg-scale-orange hover:bg-orange-600"
            } text-white`}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Master Prompt
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

        {/* AI Response Section */}
        <div className="mb-6">
          <h4 className="font-semibold text-strategic-black mb-3">AI Response:</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Date: {new Date().toLocaleDateString()}</p>
            <Textarea
              value={aiResponse}
              onChange={(e) => {
                setAiResponse(e.target.value);
                const updatedData = { ...nameLogoData, customPrompt: promptText, aiResponse: e.target.value };
                updateSessionMutation.mutate({ nameLogoBuilder: updatedData });
              }}
              placeholder={generateAIResponseMutation.isPending ? "Generating AI response..." : "Your AI response will appear here, or paste your own response..."}
              className="w-full h-32 resize-y"
              disabled={generateAIResponseMutation.isPending}
            />
          </div>
        </div>
      </div>

      {/* Your Name Options */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-4">Your Name Options</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-purple-200">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-orange-100 border-b border-purple-200">
                <th className="p-4 text-center font-semibold text-strategic-black border-r border-purple-200">Option</th>
                <th className="p-4 text-left font-semibold text-strategic-black border-r border-purple-200">Name</th>
                <th className="p-4 text-center font-semibold text-strategic-black border-r border-purple-200">Available?</th>
                <th className="p-4 text-center font-semibold text-strategic-black">Rating (1-5)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[1, 2, 3, 4, 5].map((num) => (
                <tr key={num} className="border-b border-purple-100 hover:bg-purple-50 transition-colors last:border-b-0">
                  <td className="p-4 text-center font-medium text-strategic-black border-r border-purple-100">{num}</td>
                  <td className="p-4 border-r border-purple-100">
                    <Input
                      value={nameLogoData.businessNameOptions[num - 1] || ""}
                      onChange={(e) => handleBusinessNameChange(num - 1, e.target.value)}
                      placeholder="______"
                      className="border-none bg-transparent p-0 focus:ring-0 focus:outline-none shadow-none text-gray-700"
                    />
                  </td>
                  <td className="p-4 text-center border-r border-purple-100">
                    <div className="flex flex-col items-center space-y-2">
                      <label className="flex items-center space-x-1">
                        <input 
                          type="radio" 
                          name={`available-${num}`}
                          value="yes"
                          className="w-4 h-4 text-purple-600" 
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input 
                          type="radio" 
                          name={`available-${num}`}
                          value="no"
                          className="w-4 h-4 text-purple-600" 
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="______"
                      className="w-20 text-center border-none bg-transparent p-0 focus:ring-0 focus:outline-none shadow-none text-gray-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Your Chosen Name & Brand */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-6">Your Chosen Name & Brand</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-strategic-black mb-2">
              Final business name:
            </label>
            <div className="border-b border-gray-300 pb-2">
              <Input
                value={nameLogoData.finalDecisions.chosenBusinessName}
                onChange={(e) => handleFinalDecisionChange('chosenBusinessName', e.target.value)}
                placeholder=""
                className="border-none bg-transparent p-0 focus:ring-0 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-strategic-black mb-2">
              Tagline:
            </label>
            <div className="border-b border-gray-300 pb-2">
              <Input
                value={nameLogoData.finalDecisions.chosenTagline}
                onChange={(e) => handleFinalDecisionChange('chosenTagline', e.target.value)}
                placeholder=""
                className="border-none bg-transparent p-0 focus:ring-0 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-strategic-black mb-2">
              Brand colors:
            </label>
            <div className="border-b border-gray-300 pb-2">
              <Input
                value={nameLogoData.finalDecisions.chosenColorPalette}
                onChange={(e) => handleFinalDecisionChange('chosenColorPalette', e.target.value)}
                placeholder=""
                className="border-none bg-transparent p-0 focus:ring-0 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-strategic-black mb-2">
              Logo concept:
            </label>
            <div className="border-b border-gray-300 pb-2">
              <Input
                value={nameLogoData.finalDecisions.chosenLogoDirection}
                onChange={(e) => handleFinalDecisionChange('chosenLogoDirection', e.target.value)}
                placeholder=""
                className="border-none bg-transparent p-0 focus:ring-0 text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Tools */}
      <div className="mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-strategic-black text-lg mb-4">Bonus Tools</h3>
          
          <div>
            <label className="block text-sm font-medium text-strategic-black mb-2">
              Free logo creation:
            </label>
            <p className="text-gray-700">- Looka.com - Hatchful by Shopify - Logomakr.com</p>
            <div className="border-b border-gray-300 mt-2"></div>
          </div>
        </div>
      </div>

    </Card>
  );
}