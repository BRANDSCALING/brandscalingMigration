import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WorkbookSession } from "@shared/schema";

interface EdnaReflectionProps {
  session: WorkbookSession | undefined;
}

export default function EdnaReflection({ session }: EdnaReflectionProps) {
  const { isArchitect, isAlchemist } = useDNAMode();
  const queryClient = useQueryClient();
  
  const [reflection, setReflection] = useState(
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
    },
  });

  const handleInputChange = (field: keyof typeof reflection, value: string) => {
    const updatedReflection = { ...reflection, [field]: value };
    setReflection(updatedReflection);
    updateSessionMutation.mutate({ ednaReflection: updatedReflection });
  };

  return (
    <Card id="edna-reflection" className="p-4 sm:p-6 lg:p-8 bg-[#F3F0FF] border-purple-200">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-architect-indigo text-white rounded-full flex items-center justify-center text-sm font-bold">1.2</div>
          <h2 className="text-2xl font-bold text-strategic-black">The E-DNA Lens for Idea Clarity</h2>
        </div>
        <p className="text-gray-600 text-lg">Unlocking how you naturally create, think, and build</p>
      </div>

      {/* Education Box */}
      <div className="mb-8 p-6 bg-brand-gradient-light border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-strategic-black mb-3">Every successful entrepreneur builds in alignment with how their brain and body work.</h3>
        <p className="text-gray-700 mb-4">
          At Brandscaling, we don't force you to fit a template. We help you build from your dominant mode — and strengthen your opposite for balance and scale.
        </p>
        <p className="text-gray-700">
          This is called your <strong>Entrepreneurial DNA (E-DNA)</strong>. You are either:
        </p>
        <ul className="mt-2 space-y-1 text-gray-700">
          <li>• <strong>An Alchemist</strong> — intuitive, emotional, vision-led</li>
          <li>• <strong>An Architect</strong> — strategic, logical, structure-led</li>
        </ul>
      </div>

      {/* Dual Breakdown Table */}
      <div className="mb-8">
        <h3 className="font-semibold text-strategic-black mb-4 text-lg">Dual Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Architect Column */}
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-bold text-architect-indigo mb-4 text-lg">The Architect</h4>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-strategic-black">How you get ideas</p>
                <p className="text-gray-700">Strategic clarity, mental models, visible gaps</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">How you plan</p>
                <p className="text-gray-700">Step-by-step logic, maps, timelines</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">How you overthink</p>
                <p className="text-gray-700">Paralysis by over-strategy, fear of wrong steps</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">What blocks you</p>
                <p className="text-gray-700">Uncertainty, risk without logic</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">What frees you</p>
                <p className="text-gray-700">Certainty, plans, outcomes</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">When you need the opposite</p>
                <p className="text-gray-700">For creativity, storytelling, magnetism</p>
              </div>
            </div>
          </div>

          {/* Alchemist Column */}
          <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-bold text-scale-orange mb-4 text-lg">The Alchemist</h4>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-strategic-black">How you get ideas</p>
                <p className="text-gray-700">Intuitive flashes, emotional resonance, vision-led</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">How you plan</p>
                <p className="text-gray-700">Feeling-based, flexible, adaptive</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">How you overthink</p>
                <p className="text-gray-700">Lost in possibilities, avoiding structure</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">What blocks you</p>
                <p className="text-gray-700">Too much structure, forced timelines</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">What frees you</p>
                <p className="text-gray-700">Creative freedom, emotional alignment</p>
              </div>
              <div>
                <p className="font-medium text-strategic-black">When you need the opposite</p>
                <p className="text-gray-700">For delivery scaling, systems, measurement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tip Box */}
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">💡</div>
          <div>
            <h4 className="font-semibold text-strategic-black mb-1">Pro Tip</h4>
            <p className="text-gray-700 text-sm">
              Great business ideas combine Architect and Alchemist qualities: deep to see their ideal customer would think about each approach in their everyday life.
            </p>
          </div>
        </div>
      </div>

      {/* Why This Matters Section */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-strategic-black mb-3">Why This Matters</h3>
        <p className="text-gray-700 mb-3">
          Architects tend to build systematic, scalable businesses but may miss emotional connection.
        </p>
        <p className="text-gray-700">
          Alchemists create magnetic, inspiring businesses but may struggle with structure and delivery. Both approaches work — when applied correctly.
        </p>
      </div>

      {/* DNA Mode Specific Coaching */}
      <div className={`mb-8 p-6 rounded-lg border ${
        isArchitect 
          ? "bg-purple-50 border-purple-200" 
          : "bg-orange-50 border-orange-200"
      }`}>
        <h3 className={`font-semibold mb-4 ${
          isArchitect ? "text-architect-indigo" : "text-scale-orange"
        }`}>
          {isArchitect ? "Architect Mode: Strategic Deep Dive" : "Alchemist Mode: Vision-Led Flow"}
        </h3>
        
        {isArchitect ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="architect-q1" className="text-sm font-medium text-strategic-black mb-2 block">
                1. What systems, processes, or frameworks could make this business more efficient and scalable?
              </Label>
              <p className="text-xs text-gray-600 mb-2">Think about automation, standardization, measurable outcomes...</p>
              <Textarea
                id="architect-q1"
                value={reflection.architectReflection1}
                onChange={(e) => handleInputChange("architectReflection1", e.target.value)}
                placeholder="Consider systems thinking, process optimization, scalability frameworks..."
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="architect-q2" className="text-sm font-medium text-strategic-black mb-2 block">
                2. How can you add emotional resonance and story to make people genuinely excited about this?
              </Label>
              <p className="text-xs text-gray-600 mb-2">Consider the transformation story, personal connection, aspirational elements...</p>
              <Textarea
                id="architect-q2"
                value={reflection.architectReflection2}
                onChange={(e) => handleInputChange("architectReflection2", e.target.value)}
                placeholder="Think about storytelling, emotional hooks, aspirational outcomes..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="alchemist-q1" className="text-sm font-medium text-strategic-black mb-2 block">
                1. How can you translate this vision into clear systems that can be repeated?
              </Label>
              <p className="text-xs text-gray-600 mb-2">Think about replicable processes, standard deliveries, measurable outcomes...</p>
              <Textarea
                id="alchemist-q1"
                value={reflection.alchemistReflection1}
                onChange={(e) => handleInputChange("alchemistReflection1", e.target.value)}
                placeholder="Consider structured delivery, repeatable processes, systematic approaches..."
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="alchemist-q2" className="text-sm font-medium text-strategic-black mb-2 block">
                2. What would make this irresistible? What's the deeper transformation or feeling?
              </Label>
              <p className="text-xs text-gray-600 mb-2">Consider personal impact, emotional outcomes, aspirational elements...</p>
              <Textarea
                id="alchemist-q2"
                value={reflection.alchemistReflection2}
                onChange={(e) => handleInputChange("alchemistReflection2", e.target.value)}
                placeholder="Think about emotional impact, transformational outcomes, magnetic appeal..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}