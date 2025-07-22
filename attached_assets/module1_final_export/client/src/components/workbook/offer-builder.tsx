import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/lib/ai-service";
import type { WorkbookSession } from "@shared/schema";

interface OfferBuilderProps {
  session: WorkbookSession | undefined;
}

export default function OfferBuilder({ session }: OfferBuilderProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [offer, setOffer] = useState(
    session?.offerBuilder || {
      transformation: "",
      vehicle: "",
      price: "",
      timeline: "",
      promise: "",
      aiResponseSpace: "",
      offerChecklist: {
        transformationClear: false,
        vehicleValuable: false,
        priceProfitable: false,
        urgencyReason: false,
        repeatableProfitable: false
      }
    }
  );

  // Editable prompt text
  const [promptText, setPromptText] = useState(
    session?.offerBuilder?.customPrompt || 
    `"Here's what I'm thinking of offering:

Transformation/result: [insert]
What they get (vehicle): [insert]
Price: [insert]
Timeline: [insert]
Why it matters now: [insert]

Can you help me:
Improve how I describe this offer?
Spot any confusion or missing pieces?
Suggest how to position this better?"`
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

  const handleInputChange = (field: string, value: string) => {
    const updatedOffer = { ...offer, [field]: value };
    setOffer(updatedOffer);
    updateSessionMutation.mutate({ offerBuilder: updatedOffer });
  };

  const handleChecklistChange = (field: string, checked: boolean) => {
    const updatedOffer = { 
      ...offer, 
      offerChecklist: { ...offer.offerChecklist, [field]: checked }
    };
    setOffer(updatedOffer);
    updateSessionMutation.mutate({ offerBuilder: updatedOffer });
  };

  const handlePromptChange = (value: string) => {
    setPromptText(value);
    const updatedOffer = { ...offer, customPrompt: value };
    updateSessionMutation.mutate({ offerBuilder: updatedOffer });
  };

  // AI Response State
  const [aiResponse, setAiResponse] = useState(
    session?.offerBuilder?.aiResponse || ""
  );

  const copyOfferPrompt = () => {
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
      setAiResponse(response);
      const updatedOffer = { ...offer, customPrompt: promptText, aiResponse: response };
      updateSessionMutation.mutate({ offerBuilder: updatedOffer });
      toast({
        title: "AI Response Generated!",
        description: "Your offer analysis has been generated with AI insights.",
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
    <Card id="offer-builder" className="p-4 sm:p-6 lg:p-8 bg-[#F3F0FF] border-purple-200">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-architect-indigo text-white rounded-full flex items-center justify-center text-sm font-bold">1.4</div>
          <h2 className="text-2xl font-bold text-strategic-black">Offer Builder Canvas</h2>
        </div>
        <p className="text-gray-600 text-lg mb-4">Design your first offer — with clarity, value, and confidence</p>
        
        {/* Purpose of This Section */}
        <div className="p-6 bg-brand-gradient-light border border-purple-200 rounded-lg mb-6">
          <h3 className="font-semibold text-strategic-black mb-3">Purpose of This Section</h3>
          <p className="text-gray-700 mb-4">
            To help you translate your idea into a real offer — the actual product, service, or package you'll sell.
          </p>
          <p className="text-gray-700">
            Whether digital, physical, or service-based, this canvas makes it clear, structured, and scalable.
          </p>
        </div>

        {/* Education Box */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <h3 className="font-semibold text-strategic-black mb-2">Education Box</h3>
          <p className="text-gray-700 mb-2">
            <strong>An idea isn't a business until it becomes an offer.</strong>
          </p>
          <p className="text-gray-700 mb-2">
            This is where most early entrepreneurs get stuck — they overthink, overbuild, or undercharge.
          </p>
          <p className="text-gray-700 mb-2">
            The Offer Builder Canvas helps you turn your idea into a compelling offer that people understand, want, and pay for — without fluff, overwhelm, or guesswork.
          </p>
          <p className="text-gray-700">
            To build something that works, you'll need both emotional pull (Alchemist) and structural precision (Architect). This canvas gives you both.
          </p>
        </div>

        {/* Dual DNA Coaching View */}
        <div className="mb-8">
          <h3 className="font-semibold text-strategic-black text-lg mb-4">Dual DNA Coaching View</h3>
          <p className="text-gray-700 mb-4">You must build from your natural E-DNA while becoming aware of what's missing.</p>
          <div className="text-gray-700 mb-4">
            <p className="mb-2">A great offer does two things:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>It magnetically connects with your ideal client (Alchemist strength)</li>
              <li>And it is clearly packaged and profitably delivered (Architect strength)</li>
            </ol>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Alchemist View */}
            <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-scale-orange mb-4">If you lead with Alchemist energy</h4>
              <p className="text-gray-700 mb-3">
                Don't get lost in just how it feels or sounds — get clear on delivery, price, and time investment.
              </p>
              <p className="text-gray-700">
                Ask: "Would someone logically understand how this works?"
              </p>
            </div>

            {/* Architect View */}
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-architect-indigo mb-4">If you lead with Architect energy</h4>
              <p className="text-gray-700 mb-3">
                Don't make it so practical that it loses its emotional appeal.
              </p>
              <p className="text-gray-700">
                Ask: "Would someone feel drawn to this or does it just feel like a service menu?"
              </p>
            </div>
          </div>
          
          <p className="text-center text-gray-700 mt-4 italic">
            You need both. That's how you create a magnetic and scalable offer.
          </p>
        </div>

        {/* Offer Builder Canvas Template Table */}
        <div className="mb-8">
          <h3 className="font-semibold text-strategic-black text-lg mb-4">Offer Builder Canvas Template (5-Part Framework)</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-purple-200">
              <thead>
                <tr className="bg-gradient-to-r from-purple-100 to-orange-100 border-b border-purple-200">
                  <th className="p-4 text-left font-semibold text-strategic-black border-r border-purple-200">Section</th>
                  <th className="p-4 text-left font-semibold text-strategic-black border-r border-purple-200">Description</th>
                  <th className="p-4 text-left font-semibold text-strategic-black">Coaching Tips</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                  <td className="p-4 font-medium text-strategic-black border-r border-purple-100">1. The Transformation</td>
                  <td className="p-4 text-gray-700 border-r border-purple-100">What change/result are you promising?</td>
                  <td className="p-4 text-gray-700">This is what people really buy — not features. Think outcome, identity shift, or solved pain.</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                  <td className="p-4 font-medium text-strategic-black border-r border-purple-100">2. The Vehicle</td>
                  <td className="p-4 text-gray-700 border-r border-purple-100">What are you actually delivering? (e.g., coaching calls, planner, 4-week course)</td>
                  <td className="p-4 text-gray-700">Be specific. Include format, time, location, and delivery method.</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                  <td className="p-4 font-medium text-strategic-black border-r border-purple-100">3. The Price</td>
                  <td className="p-4 text-gray-700 border-r border-purple-100">What are you charging?</td>
                  <td className="p-4 text-gray-700">Alchemist: Don't undercharge. Architect: Price for profit, not just time. Include bonuses if relevant.</td>
                </tr>
                <tr className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                  <td className="p-4 font-medium text-strategic-black border-r border-purple-100">4. The Timeline</td>
                  <td className="p-4 text-gray-700 border-r border-purple-100">How long does the offer take to deliver or complete?</td>
                  <td className="p-4 text-gray-700">Is it self-paced? 4 weeks? One-day experience? Be clear.</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="p-4 font-medium text-strategic-black border-r border-purple-100">5. The Promise</td>
                  <td className="p-4 text-gray-700 border-r border-purple-100">Why should someone say yes to this now?</td>
                  <td className="p-4 text-gray-700">Emotional + logical. "So you can finally... <em>without having to</em>..."</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Your Offer Builder Canvas */}
      <div className="space-y-8">
        <h3 className="font-semibold text-strategic-black text-lg mb-6">Your Offer Builder Canvas</h3>
        
        {/* 5-Part Canvas Grid with Integrated Inputs */}
        <div className="grid lg:grid-cols-5 gap-4 mb-8">
          {/* 1. The Transformation */}
          <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-brand-gradient text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-strategic-black">Transformation</h3>
              <p className="text-xs text-gray-600 mt-1">What change are you promising?</p>
            </div>
            
            <Textarea
              rows={3}
              placeholder="Describe the outcome..."
              value={offer.transformation}
              onChange={(e) => handleInputChange("transformation", e.target.value)}
              className="text-sm resize-none mb-3"
            />
            
            <p className="text-xs text-gray-500">This is what people really buy — not features</p>
          </div>

          {/* 2. The Vehicle */}
          <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-brand-gradient text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-strategic-black">Vehicle</h3>
              <p className="text-xs text-gray-600 mt-1">What are you delivering?</p>
            </div>
            
            <Textarea
              rows={3}
              placeholder="Format, time, method..."
              value={offer.vehicle}
              onChange={(e) => handleInputChange("vehicle", e.target.value)}
              className="text-sm resize-none mb-3"
            />
            
            <p className="text-xs text-gray-500">Be specific about format and delivery</p>
          </div>

          {/* 3. The Price */}
          <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-brand-gradient text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-strategic-black">Price</h3>
              <p className="text-xs text-gray-600 mt-1">What are you charging?</p>
            </div>
            
            <Input
              placeholder="£299"
              value={offer.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="text-sm mb-3"
            />
            
            <p className="text-xs text-gray-500">Price for profit, not just time</p>
          </div>

          {/* 4. The Timeline */}
          <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-brand-gradient text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg">4</span>
              </div>
              <h3 className="font-semibold text-strategic-black">Timeline</h3>
              <p className="text-xs text-gray-600 mt-1">How long to complete?</p>
            </div>
            
            <Input
              placeholder="4 weeks, self-paced..."
              value={offer.timeline}
              onChange={(e) => handleInputChange("timeline", e.target.value)}
              className="text-sm mb-3"
            />
            
            <p className="text-xs text-gray-500">Be clear about expectations</p>
          </div>

          {/* 5. The Promise */}
          <div className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-brand-gradient text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg">5</span>
              </div>
              <h3 className="font-semibold text-strategic-black">Promise</h3>
              <p className="text-xs text-gray-600 mt-1">Why say yes now?</p>
            </div>
            
            <Textarea
              rows={3}
              placeholder="So you can finally..."
              value={offer.promise}
              onChange={(e) => handleInputChange("promise", e.target.value)}
              className="text-sm resize-none mb-3"
            />
            
            <p className="text-xs text-gray-500">Emotional + logical appeal</p>
          </div>
        </div>

        {/* Prompt to Test Your Offer */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-2">Prompt to Test Your Offer</h3>
          <p className="text-sm text-gray-700 mb-3">Edit the prompt below and copy it to ChatGPT:</p>
          <Textarea
            value={promptText}
            onChange={(e) => handlePromptChange(e.target.value)}
            className="bg-white text-sm text-gray-700 font-mono mb-4 min-h-[140px] resize-none"
            placeholder="Edit your prompt here..."
          />
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button
              onClick={copyOfferPrompt}
              className={`${
                isArchitect 
                  ? "bg-architect-indigo hover:bg-purple-variant" 
                  : "bg-scale-orange hover:bg-orange-600"
              } text-white`}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Offer Test Prompt
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
          {(aiResponse || generateAIResponseMutation.isPending) && (
            <div className="mt-4">
              <h4 className="font-semibold text-strategic-black mb-3">AI Response:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Date: {new Date().toLocaleDateString()}</p>
                <Textarea
                  value={aiResponse}
                  onChange={(e) => {
                    setAiResponse(e.target.value);
                    const updatedOffer = { ...offer, customPrompt: promptText, aiResponse: e.target.value };
                    updateSessionMutation.mutate({ offerBuilder: updatedOffer });
                  }}
                  placeholder="Your AI response will appear here, or paste your own response..."
                  className="w-full h-32 resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* Your AI Response Space */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-4">Your AI Response Space</h3>
          <Textarea
            id="aiResponseSpace"
            rows={6}
            placeholder="Paste your AI response and insights here..."
            value={offer.aiResponseSpace}
            onChange={(e) => handleInputChange("aiResponseSpace", e.target.value)}
          />
        </div>

        {/* Offer Test Checklist */}
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-strategic-black mb-4">Offer Test Checklist</h3>
          <p className="text-gray-700 mb-4">Before finalising your offer, run it through this:</p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="transformationClear"
                checked={offer.offerChecklist.transformationClear}
                onCheckedChange={(checked) => handleChecklistChange("transformationClear", checked as boolean)}
              />
              <Label htmlFor="transformationClear" className="text-sm">
                Is the transformation crystal clear?
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="vehicleValuable"
                checked={offer.offerChecklist.vehicleValuable}
                onCheckedChange={(checked) => handleChecklistChange("vehicleValuable", checked as boolean)}
              />
              <Label htmlFor="vehicleValuable" className="text-sm">
                Does the vehicle sound valuable and credible?
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="priceProfitable"
                checked={offer.offerChecklist.priceProfitable}
                onCheckedChange={(checked) => handleChecklistChange("priceProfitable", checked as boolean)}
              />
              <Label htmlFor="priceProfitable" className="text-sm">
                Is the price profitable but not off-putting?
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="urgencyReason"
                checked={offer.offerChecklist.urgencyReason}
                onCheckedChange={(checked) => handleChecklistChange("urgencyReason", checked as boolean)}
              />
              <Label htmlFor="urgencyReason" className="text-sm">
                Is there a reason to buy now (urgency)?
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="repeatableProfitable"
                checked={offer.offerChecklist.repeatableProfitable}
                onCheckedChange={(checked) => handleChecklistChange("repeatableProfitable", checked as boolean)}
              />
              <Label htmlFor="repeatableProfitable" className="text-sm">
                Could someone repeat this offer 10x and still be profitable?
              </Label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
