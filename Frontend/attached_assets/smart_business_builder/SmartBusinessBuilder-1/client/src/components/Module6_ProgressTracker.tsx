import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckSquare, Zap, Sparkles, Download } from "lucide-react";

interface ProgressTrackerData {
  modulesCompleted: number[];
  energyLevel: number;
  energyReflection: string;
  dnaReflection: string;
  userId: number;
}

interface ModuleItem {
  id: number;
  title: string;
  completed: boolean;
}

export function Module6_ProgressTracker() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Mock completion status - in real app, fetch from backend
  const [modules, setModules] = useState<ModuleItem[]>([
    { id: 1, title: "Module 1: Clarity", completed: true },
    { id: 2, title: "Module 2: Business Builder", completed: true },
    { id: 3, title: "Module 3: Product Design", completed: true },
    { id: 4, title: "Module 4: Go-to-Market", completed: true },
    { id: 5, title: "Module 5: Growth Loop", completed: true },
    { id: 6, title: "Module 6: Tracker", completed: false },
    { id: 7, title: "Module 7: Completion", completed: false },
  ]);

  const [energyLevel, setEnergyLevel] = useState<number[]>([7]);
  const [energyReflection, setEnergyReflection] = useState("");
  const [dnaReflection, setDnaReflection] = useState("");
  
  // Mock DNA type - in real app, fetch from user profile
  const userDnaType: "Architect" | "Alchemist" = "Architect";

  const getEnergyColor = (level: number) => {
    if (level <= 3) return "text-gray-500";
    if (level <= 6) return "text-orange-500";
    return "text-indigo-600";
  };

  const getEnergyLabel = (level: number) => {
    if (level <= 3) return "Low Energy";
    if (level <= 6) return "Medium Energy";
    return "High Energy";
  };

  const handleModuleToggle = (moduleId: number) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, completed: !module.completed }
        : module
    ));
  };

  const mutation = useMutation({
    mutationFn: async (data: ProgressTrackerData) => {
      const response = await fetch("/api/progress-tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress saved successfully",
        description: "Your tracker has been updated.",
      });
      // Navigate to completion module or dashboard
      setLocation("/dashboard");
    },
    onError: (error) => {
      console.error("Error saving progress tracker:", error);
      toast({
        title: "Error saving progress",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const completedModuleIds = modules
      .filter(module => module.completed)
      .map(module => module.id);

    const trackerData: ProgressTrackerData = {
      modulesCompleted: completedModuleIds,
      energyLevel: energyLevel[0],
      energyReflection: energyReflection.trim(),
      dnaReflection: dnaReflection.trim(),
      userId: 1, // Mock user ID
    };

    console.log("Saving progress tracker:", trackerData);
    mutation.mutate(trackerData);
  };

  const handleExportPDF = () => {
    // Mock PDF export functionality
    toast({
      title: "PDF Export",
      description: "Feature coming soon - will export your progress tracker.",
    });
  };

  const isFormValid = energyReflection.trim() !== "" && dnaReflection.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Progress, Tracked
          </h1>
          <p className="text-xl text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            See how far you've come. Tune into what fuels you next.
          </p>
        </div>

        {/* Module Completion Tracker */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              Your Module Completion Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`module-${module.id}`}
                  checked={module.completed}
                  onCheckedChange={() => handleModuleToggle(module.id)}
                  className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <label 
                  htmlFor={`module-${module.id}`}
                  className={`text-sm font-medium cursor-pointer ${
                    module.completed ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {module.title}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Energy Rating Slider */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Zap className={`w-5 h-5 ${getEnergyColor(energyLevel[0])}`} />
              How energized do you feel right now?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Low (1)</span>
                <span className={`font-medium ${getEnergyColor(energyLevel[0])}`}>
                  {getEnergyLabel(energyLevel[0])} ({energyLevel[0]})
                </span>
                <span>High (10)</span>
              </div>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Energy Reflection */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900">
              What's fueling or draining your energy this week?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={energyReflection}
              onChange={(e) => setEnergyReflection(e.target.value)}
              placeholder="Be honest with yourself..."
              className="min-h-32 resize-none border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </CardContent>
        </Card>

        {/* DNA Awareness Callout */}
        <Card className="border-2 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              E-DNA Awareness
            </CardTitle>
            <CardDescription>
              {userDnaType === "Architect" 
                ? "Where do you need more structure to feel clear?"
                : "Where do you feel off-track or unaligned?"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={dnaReflection}
              onChange={(e) => setDnaReflection(e.target.value)}
              placeholder={
                userDnaType === "Architect"
                  ? "Reflect on areas where more structure would help..."
                  : "Reflect on areas where you feel misaligned..."
              }
              className="min-h-32 resize-none border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSave}
            disabled={!isFormValid || mutation.isPending}
            className="px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: '#0B0B0B',
              border: 'none',
            }}
          >
            {mutation.isPending ? "Saving..." : "Save My Tracker"}
          </Button>
          
          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download This as PDF
          </Button>
        </div>
      </div>
    </div>
  );
}