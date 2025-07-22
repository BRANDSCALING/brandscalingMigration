import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDNAMode } from "@/hooks/use-dna-mode";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";
import type { OfferBuilder } from "@/types/workbook";

interface OfferBuilderProps {
  session: WorkbookSession | undefined;
}

export default function OfferBuilder({ session }: OfferBuilderProps) {
  const { isArchitect } = useDNAMode();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [offer, setOffer] = useState<OfferBuilder>(
    session?.offerBuilder || {}
  );

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      return apiRequest("PATCH", `/api/workbook/session`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your offer details have been saved.",
      });
    },
  });

  const handleOfferChange = (key: keyof OfferBuilder, value: string) => {
    const updatedOffer = { ...offer, [key]: value };
    setOffer(updatedOffer);
    updateSessionMutation.mutate({ offerBuilder: updatedOffer });
  };

  const fields = [
    {
      key: "transformation" as keyof OfferBuilder,
      label: "What transformation do you provide?",
      placeholder: "How will your customers be different after working with you?...",
      type: "textarea"
    },
    {
      key: "vehicle" as keyof OfferBuilder,
      label: "What's your delivery vehicle?",
      placeholder: "Course, coaching, service, product, etc...",
      type: "input"
    },
    {
      key: "price" as keyof OfferBuilder,
      label: "What's your price point?",
      placeholder: "£97, £497, £2000, etc...",
      type: "input"
    },
    {
      key: "timeline" as keyof OfferBuilder,
      label: "What's the timeline?",
      placeholder: "4 weeks, 90 days, 6 months...",
      type: "input"
    },
    {
      key: "delivery" as keyof OfferBuilder,
      label: "How will you deliver this?",
      placeholder: "Online, in-person, self-paced, group calls...",
      type: "textarea"
    }
  ];

  return (
    <Card id="offer-builder" className="p-4 sm:p-6 lg:p-8 bg-purple-50 border-purple-200">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">1.4</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Offer Builder Canvas</h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg mb-4">
          Build a clear, compelling offer that addresses your customer's needs and fits your business model.
        </p>
        
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">The 5-Part Framework</h3>
          <p className="text-gray-700">
            A strong offer clearly defines: (1) the transformation, (2) the delivery method, 
            (3) the investment required, (4) the time commitment, and (5) how it will be delivered. 
            This creates clarity for both you and your customers.
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
          {isArchitect ? "Architect Approach" : "Alchemist Approach"}
        </h3>
        <div className="text-gray-700">
          {isArchitect ? (
            <p>Focus on systematizing and scaling your delivery. Think about processes, frameworks, and measurable outcomes that can be replicated.</p>
          ) : (
            <p>Lead with transformation and emotional outcomes. Think about the journey and experience your customers will have working with you.</p>
          )}
        </div>
      </div>

      {/* Offer Builder Fields */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.key} className="p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={offer[field.key] || ""}
                    onChange={(e) => handleOfferChange(field.key, e.target.value)}
                    className="bg-white text-sm text-gray-700 min-h-[100px]"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    value={offer[field.key] || ""}
                    onChange={(e) => handleOfferChange(field.key, e.target.value)}
                    className="bg-white text-sm text-gray-700"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Summary */}
      {(offer.transformation || offer.vehicle || offer.price) && (
        <div className="mt-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Your Offer Summary</h3>
          <div className="text-sm text-gray-700 space-y-1">
            {offer.transformation && <p><strong>Transformation:</strong> {offer.transformation}</p>}
            {offer.vehicle && <p><strong>Vehicle:</strong> {offer.vehicle}</p>}
            {offer.price && <p><strong>Price:</strong> {offer.price}</p>}
            {offer.timeline && <p><strong>Timeline:</strong> {offer.timeline}</p>}
            {offer.delivery && <p><strong>Delivery:</strong> {offer.delivery}</p>}
          </div>
        </div>
      )}
    </Card>
  );
}