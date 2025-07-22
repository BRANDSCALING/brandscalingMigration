import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";

interface OfferBuilderProps {
  session: WorkbookSession | undefined;
}

export default function OfferBuilder({ session }: OfferBuilderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [offer, setOffer] = useState(
    session?.offerBuilder || {
      transformation: "",
      vehicle: "",
      price: ""
    }
  );

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkbookSession>) => {
      if (!session?.id) throw new Error("No session ID");
      return apiRequest("PATCH", `/api/workbook/session/${session.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workbook/session"] });
      toast({
        title: "Progress saved",
        description: "Your offer details have been saved.",
      });
    },
  });

  const handleOfferChange = (key: string, value: string) => {
    const updatedOffer = { ...offer, [key]: value };
    setOffer(updatedOffer);
    updateSessionMutation.mutate({ offerBuilder: updatedOffer });
  };

  return (
    <section id="offer-builder" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            4
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Offer Builder Canvas</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Build your core offer using the 5-part framework.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-gray-50 border border-gray-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Transformation</h3>
            <p className="text-gray-700">What transformation do you provide for your customers?</p>
            <Textarea
              value={offer.transformation}
              onChange={(e) => handleOfferChange("transformation", e.target.value)}
              placeholder="What outcome, result, or transformation will your customers experience?"
              rows={3}
              className="w-full"
            />
          </div>
        </Card>

        <Card className="p-6 bg-gray-50 border border-gray-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle</h3>
            <p className="text-gray-700">How will you deliver this transformation?</p>
            <Textarea
              value={offer.vehicle}
              onChange={(e) => handleOfferChange("vehicle", e.target.value)}
              placeholder="What is the method, system, or approach you use to deliver results?"
              rows={3}
              className="w-full"
            />
          </div>
        </Card>

        <Card className="p-6 bg-gray-50 border border-gray-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Price Point</h3>
            <p className="text-gray-700">What's your initial pricing strategy?</p>
            <Input
              value={offer.price}
              onChange={(e) => handleOfferChange("price", e.target.value)}
              placeholder="e.g., £497, £97/month, £5,000"
              className="w-full"
            />
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Complete your offer framework to create a compelling value proposition.
        </p>
      </div>
    </section>
  );
}