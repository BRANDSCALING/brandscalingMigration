import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";
import type { NameLogoBuilder } from "@/types/workbook";

interface NameLogoBuilderProps {
  session: WorkbookSession | undefined;
}

export default function NameLogoBuilder({ session }: NameLogoBuilderProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [builder, setBuilder] = useState<NameLogoBuilder>(
    session?.nameLogoBuilder || {
      finalDecisions: {},
      nameRatings: {}
    }
  );

  const [newBusinessName, setNewBusinessName] = useState("");

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      return apiRequest("PATCH", `/api/workbook/session`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your branding decisions have been saved.",
      });
    },
  });

  const handleFinalDecisionChange = (key: keyof NameLogoBuilder["finalDecisions"], value: string) => {
    const updatedBuilder = {
      ...builder,
      finalDecisions: {
        ...builder.finalDecisions,
        [key]: value
      }
    };
    setBuilder(updatedBuilder);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedBuilder });
  };

  const addBusinessName = () => {
    if (!newBusinessName.trim()) return;
    
    const updatedBuilder = {
      ...builder,
      nameRatings: {
        ...builder.nameRatings,
        [newBusinessName]: 5 // Default rating
      }
    };
    setBuilder(updatedBuilder);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedBuilder });
    setNewBusinessName("");
  };

  const rateBusinessName = (name: string, rating: number) => {
    const updatedBuilder = {
      ...builder,
      nameRatings: {
        ...builder.nameRatings,
        [name]: rating
      }
    };
    setBuilder(updatedBuilder);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedBuilder });
  };

  const removeBusinessName = (name: string) => {
    const { [name]: removed, ...restRatings } = builder.nameRatings || {};
    const updatedBuilder = {
      ...builder,
      nameRatings: restRatings
    };
    setBuilder(updatedBuilder);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedBuilder });
  };

  const businessNames = Object.keys(builder.nameRatings || {});

  return (
    <Card id="name-logo-builder" className="p-4 sm:p-6 lg:p-8 bg-purple-50 border-purple-200">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1.6</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">AI Sprint — Name + Logo Builder</h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          Generate and evaluate business names, taglines, and basic branding elements for your concept.
        </p>
        
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Branding Sprint</h3>
          <p className="text-gray-700">
            Great branding communicates your value proposition, resonates with your audience, and is memorable. 
            Start with names and basic elements - you can refine these later.
          </p>
        </div>
      </div>

      {/* DNA-Specific Coaching */}
      <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg border ${
        isArchitect 
          ? "bg-purple-100 border-purple-300" 
          : "bg-orange-50 border-orange-200"
      }`}>
        <h3 className={`font-semibold mb-4 ${
          isArchitect ? "text-purple-600" : "text-orange-500"
        }`}>
          {isArchitect ? "Architect Branding Tips" : "Alchemist Branding Tips"}
        </h3>
        <div className="text-gray-700">
          {isArchitect ? (
            <p>Focus on names that convey authority, systems, and results. Think about scalability and professionalism in your branding choices.</p>
          ) : (
            <p>Focus on names that evoke emotion, transformation, and connection. Think about the feeling and aspiration you want to create.</p>
          )}
        </div>
      </div>

      {/* Business Name Generator */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Business Name Ideas</h3>
        
        <div className="flex space-x-2 mb-4">
          <Input
            value={newBusinessName}
            onChange={(e) => setNewBusinessName(e.target.value)}
            placeholder="Enter a business name idea..."
            className="bg-white"
            onKeyPress={(e) => e.key === 'Enter' && addBusinessName()}
          />
          <Button onClick={addBusinessName} className="bg-purple-600 hover:bg-purple-700">
            Add Name
          </Button>
        </div>

        {businessNames.length > 0 && (
          <div className="space-y-3">
            {businessNames.map((name) => (
              <div key={name} className="p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{name}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBusinessName(name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Rating:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={builder.nameRatings?.[name] || 5}
                    onChange={(e) => rateBusinessName(name, Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-bold text-purple-600 min-w-[40px]">
                    {builder.nameRatings?.[name] || 5}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Final Branding Decisions */}
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-900">Final Branding Decisions</h3>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chosen Business Name
            </label>
            <Input
              value={builder.finalDecisions?.chosenBusinessName || ""}
              onChange={(e) => handleFinalDecisionChange("chosenBusinessName", e.target.value)}
              placeholder="Select your final business name..."
              className="bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline/Subtitle
            </label>
            <Input
              value={builder.finalDecisions?.chosenTagline || ""}
              onChange={(e) => handleFinalDecisionChange("chosenTagline", e.target.value)}
              placeholder="What's your memorable tagline?..."
              className="bg-white"
            />
          </div>
        </div>

        {/* Brand Summary */}
        {(builder.finalDecisions?.chosenBusinessName || builder.finalDecisions?.chosenTagline) && (
          <div className="mt-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Your Brand Identity</h3>
            <div className="text-center">
              {builder.finalDecisions?.chosenBusinessName && (
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {builder.finalDecisions.chosenBusinessName}
                </div>
              )}
              {builder.finalDecisions?.chosenTagline && (
                <div className="text-gray-600 italic">
                  {builder.finalDecisions.chosenTagline}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check domain availability for your chosen name</li>
          <li>• Design a simple logo (or use AI tools like Canva/Midjourney)</li>
          <li>• Choose 2-3 brand colors that reflect your positioning</li>
          <li>• Create basic brand guidelines for consistency</li>
        </ul>
      </div>
    </Card>
  );
}