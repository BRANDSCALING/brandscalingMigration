import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { WorkbookSession } from "@shared/schema";

interface NameLogoBuilderProps {
  session: WorkbookSession | undefined;
}

export default function NameLogoBuilder({ session }: NameLogoBuilderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [nameBuilder, setNameBuilder] = useState(
    session?.nameLogoBuilder || {
      nameOptions: ["", "", "", "", ""],
      chosenBusinessName: "",
      nameRatings: {}
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
        description: "Your naming progress has been saved.",
      });
    },
  });

  const handleNameOptionChange = (index: number, value: string) => {
    const updatedOptions = [...nameBuilder.nameOptions];
    updatedOptions[index] = value;
    const updatedNameBuilder = { ...nameBuilder, nameOptions: updatedOptions };
    setNameBuilder(updatedNameBuilder);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedNameBuilder });
  };

  const handleChosenNameChange = (value: string) => {
    const updatedNameBuilder = { ...nameBuilder, chosenBusinessName: value };
    setNameBuilder(updatedNameBuilder);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedNameBuilder });
  };

  const handleRating = (name: string, rating: number) => {
    const updatedRatings = { ...nameBuilder.nameRatings, [name]: rating };
    const updatedNameBuilder = { ...nameBuilder, nameRatings: updatedRatings };
    setNameBuilder(updatedNameBuilder);
    updateSessionMutation.mutate({ nameLogoBuilder: updatedNameBuilder });
  };

  return (
    <section id="name-logo-builder" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
            6
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Sprint — Name + Logo Builder</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Generate and evaluate potential business names for your venture.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-gray-50 border border-gray-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Business Name Options</h3>
            <p className="text-gray-700">Brainstorm potential names for your business:</p>
            <div className="space-y-3">
              {nameBuilder.nameOptions.map((name, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                  <Input
                    value={name}
                    onChange={(e) => handleNameOptionChange(index, e.target.value)}
                    placeholder={`Business name option ${index + 1}`}
                    className="flex-1"
                  />
                  {name && (
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          onClick={() => handleRating(name, rating)}
                          variant="outline"
                          size="sm"
                          className={`w-8 h-8 p-0 ${
                            (nameBuilder.nameRatings[name] || 0) >= rating 
                              ? "bg-yellow-400 hover:bg-yellow-500" 
                              : ""
                          }`}
                        >
                          ★
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-50 border border-purple-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Final Decision</h3>
            <p className="text-gray-700">Which name will you choose for your business?</p>
            <Input
              value={nameBuilder.chosenBusinessName}
              onChange={(e) => handleChosenNameChange(e.target.value)}
              placeholder="Enter your chosen business name"
              className="w-full text-lg font-semibold"
            />
          </div>
        </Card>

        {nameBuilder.chosenBusinessName && (
          <Card className="p-6 bg-green-50 border border-green-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
              <p className="text-lg text-green-700">
                You've chosen <strong>"{nameBuilder.chosenBusinessName}"</strong> as your business name.
              </p>
              <p className="text-sm text-green-600 mt-2">
                Next step: Secure your domain and social media handles!
              </p>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Complete your business naming process to move forward with branding.
        </p>
      </div>
    </section>
  );
}