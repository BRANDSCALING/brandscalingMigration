import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { VideoPlayer } from "./VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Sparkles, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ModuleStatus {
  status: string;
  module: {
    id: string;
    title: string;
    status: string;
  };
  timestamp: string;
}

interface UserProgress {
  userId: number;
  moduleId: string;
  completed: boolean;
  videoArchitectCompleted: boolean;
  videoAlchemistCompleted: boolean;
}

export function IntroPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId] = useState(1); // For demo purposes, using static user ID

  // Fetch module status
  const { data: moduleStatus, isLoading: statusLoading } = useQuery<ModuleStatus>({
    queryKey: ["/api/intro-status"],
  });

  // Fetch user progress
  const { data: progressData } = useQuery<{ progress: UserProgress }>({
    queryKey: ["/api/progress", userId, "1A"],
    enabled: !!userId,
  });

  const progress = progressData?.progress;

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (updates: Partial<UserProgress>) => {
      return apiRequest("POST", "/api/progress", {
        userId,
        moduleId: "1A",
        ...updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", userId, "1A"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating progress",
        description: error instanceof Error ? error.message : "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  const handleVideoPlay = (videoType: "architect" | "alchemist") => {
    toast({
      title: `Playing ${videoType} video`,
      description: `${videoType === "architect" ? "Hanif Khan" : "Fariza Javed"} video started`,
    });

    // Mark video as completed
    const updates: Partial<UserProgress> = {
      [videoType === "architect" ? "videoArchitectCompleted" : "videoAlchemistCompleted"]: true,
    };

    // Check if both videos will be completed
    const willCompleteModule = videoType === "architect" 
      ? progress?.videoAlchemistCompleted 
      : progress?.videoArchitectCompleted;

    if (willCompleteModule) {
      updates.completed = true;
    }

    updateProgressMutation.mutate(updates);
  };

  const handleContinueToNextModule = () => {
    if (!progress?.videoArchitectCompleted || !progress?.videoAlchemistCompleted) {
      toast({
        title: "Complete all videos first",
        description: "Please watch both introduction videos before proceeding to Module 1B.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Proceeding to Module 1B",
      description: "Great job completing Module 1A!",
    });
  };

  const bothVideosCompleted = progress?.videoArchitectCompleted && progress?.videoAlchemistCompleted;

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-architect-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Business Builder™...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brandscaling-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-architect-indigo">Smart Business Builder™</h1>
                <p className="text-sm text-gray-600">Intro Panel</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-800 hover:bg-green-100"
              >
                {moduleStatus?.module?.status || "Active"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-architect-indigo/10 rounded-full mb-6">
            <span className="text-architect-indigo text-sm font-semibold">Welcome to Your Business Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-architect-indigo leading-tight mb-6">
            Meet Your Guides
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn from our expert team who will guide you through building your business with proven strategies and frameworks.
          </p>
        </div>

        {/* Video Players Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <VideoPlayer
            title="Architect"
            instructor="Hanif Khan"
            description="Master the fundamentals of business architecture and strategic planning. Learn how to build solid foundations for sustainable growth."
            duration="12:34"
            imageUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"
            tags={["Strategy", "Planning", "Foundation"]}
            colorScheme="architect"
            onPlay={() => handleVideoPlay("architect")}
            isCompleted={progress?.videoArchitectCompleted || false}
          />

          <VideoPlayer
            title="Alchemist"
            instructor="Fariza Javed"
            description="Transform your business ideas into reality through innovation and creative problem-solving. Master the art of business transformation."
            duration="15:22"
            imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"
            tags={["Innovation", "Transformation", "Growth"]}
            colorScheme="alchemist"
            onPlay={() => handleVideoPlay("alchemist")}
            isCompleted={progress?.videoAlchemistCompleted || false}
          />
        </div>

        {/* Main Heading Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-architect-indigo leading-tight mb-6">
            Let's build your business the right way: with clarity, alignment, and strategy.
          </h2>
          <div className="w-24 h-1 bg-brandscaling-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join thousands of entrepreneurs who have transformed their business ideas into thriving enterprises using our proven methodology.
          </p>
        </div>

        {/* Next Steps Section */}
        <Card className="bg-gray-50 rounded-3xl p-8 sm:p-12 text-center border-0">
          <h3 className="text-2xl sm:text-3xl font-bold text-architect-indigo mb-6">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Watch both introduction videos above, then proceed to the next module where we'll start building your business foundation step by step.
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-architect-indigo rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1A</span>
              </div>
              <div className="w-16 h-1 bg-gray-300 rounded-full">
                <div 
                  className={`h-full bg-brandscaling-gradient rounded-full transition-all duration-500 ${
                    bothVideosCompleted ? 'w-full' : 'w-1/2'
                  }`}
                ></div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                bothVideosCompleted ? 'bg-architect-indigo' : 'bg-gray-300'
              }`}>
                <span className={`font-bold text-sm ${
                  bothVideosCompleted ? 'text-white' : 'text-gray-500'
                }`}>1B</span>
              </div>
            </div>
          </div>

          {/* Completion Status */}
          {bothVideosCompleted && (
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">Introduction Complete!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleContinueToNextModule}
              disabled={!bothVideosCompleted || updateProgressMutation.isPending}
              className="bg-brandscaling-gradient hover:shadow-lg text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-architect-indigo/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {updateProgressMutation.isPending ? (
                "Updating..."
              ) : bothVideosCompleted ? (
                <>
                  Continue to Business Builder
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                "Complete videos to continue"
              )}
            </Button>

            <Link href="/wizard">
              <Button 
                variant="outline"
                className="border-2 border-[#42047D] text-[#42047D] hover:bg-[#42047D] hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try 10-Step Wizard
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button 
                variant="outline"
                className="border-2 border-[#F6782F] text-[#F6782F] hover:bg-[#F6782F] hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  System Status: {moduleStatus?.status || "Online"}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                API Endpoint: /api/intro-status
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Smart Business Builder™ v1.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
