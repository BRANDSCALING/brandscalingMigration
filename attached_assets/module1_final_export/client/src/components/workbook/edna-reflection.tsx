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
                <p className="text-gray-700">For systems, scaling, profit clarity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-gray-700 italic">
          You are both — but one side leads. Use it to build from your natural zone, then develop the opposite when it's time to scale.
        </p>
      </div>

      {/* Reflection Prompts */}
      <div className="space-y-6">
        <h3 className="font-semibold text-strategic-black text-lg">Reflection Prompt</h3>
        
        {/* Architect Reflections - Only show when Architect mode is selected */}
        {isArchitect && (
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-architect-indigo mb-4">Architect Reflection:</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="architectReflection1" className="text-sm font-medium">
                  What parts of my business idea already feel logical, practical, and structured?
                </Label>
                <Textarea
                  id="architectReflection1"
                  rows={3}
                  placeholder="Reflect on the logical aspects..."
                  value={reflection.architectReflection1}
                  onChange={(e) => handleInputChange("architectReflection1", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="architectReflection2" className="text-sm font-medium">
                  Where do I avoid emotion or storytelling — and could that be hurting magnetism?
                </Label>
                <Textarea
                  id="architectReflection2"
                  rows={3}
                  placeholder="Consider emotional aspects..."
                  value={reflection.architectReflection2}
                  onChange={(e) => handleInputChange("architectReflection2", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Alchemist Reflections - Only show when Alchemist mode is selected */}
        {isAlchemist && (
          <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-scale-orange mb-4">Alchemist Reflection:</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="alchemistReflection1" className="text-sm font-medium">
                  What parts of my idea feel emotionally aligned, exciting, and resonant?
                </Label>
                <Textarea
                  id="alchemistReflection1"
                  rows={3}
                  placeholder="Reflect on emotional alignment..."
                  value={reflection.alchemistReflection1}
                  onChange={(e) => handleInputChange("alchemistReflection1", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="alchemistReflection2" className="text-sm font-medium">
                  Where might I be avoiding structure or pricing clarity out of fear or friction?
                </Label>
                <Textarea
                  id="alchemistReflection2"
                  rows={3}
                  placeholder="Consider structural aspects..."
                  value={reflection.alchemistReflection2}
                  onChange={(e) => handleInputChange("alchemistReflection2", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bonus Insight Box */}
      <div className="mt-8 p-6 bg-brand-gradient-light border border-scale-orange/30 rounded-lg">
        <h3 className="font-semibold text-strategic-black mb-3">Bonus Insight</h3>
        <p className="text-gray-700 mb-2">
          <strong>You don't need to become a hybrid.</strong>
        </p>
        <p className="text-gray-700">
          You need to become the best version of yourself — with a clear understanding of how your opposite works.
        </p>
        <p className="text-gray-700 mt-2 italic">
          This is the core of the Brandscaling system.
        </p>
      </div>
    </Card>
  );
}