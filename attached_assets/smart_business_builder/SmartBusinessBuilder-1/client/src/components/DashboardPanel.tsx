import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Edit, Calendar, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

interface SavedModel {
  id: number;
  label: string;
  status: string;
  model: string;
  warnings: string;
  suggestions: string;
  confidence: number;
  timestamp: string;
  dnaType: "Architect" | "Alchemist";
}

interface DashboardPanelProps {
  className?: string;
}

export function DashboardPanel({ className }: DashboardPanelProps) {
  const [selectedModel, setSelectedModel] = useState<SavedModel | null>(null);
  const [, setLocation] = useLocation();
  
  // Fetch saved models for the current user
  const { data: savedModels, isLoading, error } = useQuery<SavedModel[]>({
    queryKey: ['/api/models', 'user', 'user-123'], // Using hardcoded user ID for demo
    queryFn: async () => {
      const response = await fetch('/api/models/user/user-123');
      if (!response.ok) {
        throw new Error('Failed to fetch saved models');
      }
      return response.json();
    }
  });

  const getThemeClasses = (dnaType: "Architect" | "Alchemist") => {
    return dnaType === "Architect" 
      ? {
          card: "border-[#42047D]/20 bg-[#42047D]/5",
          badge: "bg-[#42047D] text-white",
          button: "bg-[#42047D] hover:bg-[#42047D]/90 text-white",
          text: "text-[#42047D]"
        }
      : {
          card: "border-[#F6782F]/20 bg-[#F6782F]/5", 
          badge: "bg-[#F6782F] text-white",
          button: "bg-[#F6782F] hover:bg-[#F6782F]/90 text-white",
          text: "text-[#F6782F]"
        };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModelPreview = (model: string) => {
    return model.length > 200 ? model.substring(0, 200) + "..." : model;
  };

  const handleEditAndResubmit = (model: SavedModel) => {
    // Navigate to resume wizard with model ID
    window.location.href = `/wizard/resume/${model.id}`;
  };

  if (isLoading) {
    return (
      <div className={cn("max-w-6xl mx-auto p-6", className)}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your saved models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("max-w-6xl mx-auto p-6", className)}>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Models</h3>
          <p className="text-gray-600">Unable to load your saved business models. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-6xl mx-auto p-6 space-y-6", className)}>
      {/* Module Navigation */}
      <Card className="border-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Your Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setLocation("/product-design")}
              className="flex items-center justify-between p-4 h-auto bg-[#42047D] hover:bg-[#42047D]/90 text-white"
            >
              <div className="text-left">
                <div className="font-semibold">Module 3</div>
                <div className="text-sm opacity-90">Product Design</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => setLocation("/go-to-market")}
              className="flex items-center justify-between p-4 h-auto bg-[#F6782F] hover:bg-[#F6782F]/90 text-white"
            >
              <div className="text-left">
                <div className="font-semibold">Module 4</div>
                <div className="text-sm opacity-90">Go-to-Market</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => setLocation("/feedback-loop")}
              className="flex items-center justify-between p-4 h-auto bg-[#841477] hover:bg-[#841477]/90 text-white"
            >
              <div className="text-left">
                <div className="font-semibold">Module 5</div>
                <div className="text-sm opacity-90">Growth Loop</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-center text-indigo-900">
          Smart Business Builder™ – Your Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          View, edit, and manage your saved business models
        </p>
      </div>

      {/* Models Grid */}
      {!savedModels || savedModels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <TrendingUp className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Models</h3>
          <p className="text-gray-600 mb-6">
            You haven't saved any business models yet. Complete the wizard to generate your first model.
          </p>
          <Link href="/wizard">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Start Building
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-8 max-w-2xl w-full">
            {savedModels.map((model) => {
              const theme = getThemeClasses(model.dnaType);
              
              return (
                <Card key={model.id} className={cn("hover:shadow-lg transition-shadow p-6 transform hover:scale-102", theme.card)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {model.label}
                      </CardTitle>
                      <Badge className={theme.badge}>
                        {model.dnaType}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(model.timestamp)}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {model.confidence}/10
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-base text-gray-700 leading-relaxed">
                        {getModelPreview(model.model)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full py-3"
                            onClick={() => setSelectedModel(model)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Model
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              <span>{selectedModel?.label}</span>
                              <Badge className={getThemeClasses(selectedModel?.dnaType || "Architect").badge}>
                                {selectedModel?.dnaType}
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh] pr-4">
                            {selectedModel && (
                              <div className="space-y-6">
                                {/* Confidence Score */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                  <span className="font-medium">Confidence Score</span>
                                  <Badge variant="secondary" className="text-lg px-3 py-1">
                                    {selectedModel.confidence}/10
                                  </Badge>
                                </div>

                                {/* Business Model */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                                    Business Model
                                  </h3>
                                  <div className="prose prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg">
                                      {selectedModel.model}
                                    </pre>
                                  </div>
                                </div>

                                {/* Warnings */}
                                {selectedModel.warnings && (
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                                      Fixes & Warnings
                                    </h3>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-amber-800">
                                        {selectedModel.warnings}
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                {/* Suggestions */}
                                {selectedModel.suggestions && (
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                      <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
                                      Next Step Suggestions
                                    </h3>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-green-800">
                                        {selectedModel.suggestions}
                                      </pre>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      
                      <Link href="/wizard">
                        <Button 
                          size="sm"
                          className={cn("w-full py-3", theme.button)}
                          onClick={() => handleEditAndResubmit(model)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit & Resubmit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
              </Card>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}