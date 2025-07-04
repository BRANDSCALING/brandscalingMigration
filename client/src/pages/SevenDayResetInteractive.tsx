import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Play,
  Upload,
  FileText,
  Lock,
} from "lucide-react";

const SevenDayResetInteractive = () => {
  const [, setLocation] = useLocation();
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's 7-day reset progress
  const { data: progressData, isLoading } = useQuery({
    queryKey: ["/api/seven-day-reset/progress"],
  });

  // Get user authentication
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const userId = (user as any)?.uid || "";

  const resetDays = [
    {
      day: 1,
      title: "Contrast Activation: Force vs Flow",
      duration: "Full workday",
      objective:
        "Surface your core operating preference through felt experience",
      task: "Spend half your workday following a rigid, structured plan. Spend the other half being completely intuitive and responsive. Track energy, results, resistance.",
      reflection: [
        "Which half of the day energized you more?",
        "When did time pass faster or slower?",
        "Did you feel more alive in structure or in freedom?",
      ],
      purpose:
        "Surface your core operating preference through felt experience, not ideas.",
      hasFileUpload: false,
    },
    {
      day: 2,
      title: "Authenticity Archaeology",
      duration: "2-3 hours",
      objective:
        "Recall embodied success from the past to find traces of your original DNA",
      task: "Journal 3 business memories where you felt deeply aligned. Note what you were doing, what type of decisions you made, and the rhythm of your day.",
      reflection: [
        "When was your business success most effortless?",
        "What decisions felt most natural?",
        "What rhythm energized you most?",
      ],
      purpose:
        "Recall embodied success from the past to find traces of your original DNA.",
      hasFileUpload: false,
    },
    {
      day: 3,
      title: "Structure vs Flow Immersion",
      duration: "3-4 hours",
      objective: "Re-experience both styles in a focused task",
      task: "Design a micro-project (1-2 hours). Do it twice: once with detailed planning (Architect mode), once improvisationally (Alchemist mode).",
      reflection: [
        "Which approach felt more natural?",
        "Where did you have more energy during execution?",
        "Which result felt like 'you'?",
      ],
      purpose:
        "Re-experience both styles in a focused task. One will feel like home.",
      hasFileUpload: true,
    },
    {
      day: 4,
      title: "Decision-Making Deep Dive",
      duration: "2-3 hours",
      objective: "Reveal which decision approach you naturally trust",
      task: "Choose 3 decisions you've been avoiding. Take action on each based purely on: intuition for 1, logic for 1, blend for 1.",
      reflection: [
        "Am I waiting for more information (Architect)?",
        "Am I waiting for more alignment (Alchemist)?",
        "Which decision approach energized me most?",
      ],
      purpose:
        "Reveal which decision approach you naturally trust (and which drains you).",
      hasFileUpload: false,
    },
    {
      day: 5,
      title: "Leadership Style in Action",
      duration: "2-4 hours",
      objective: "Discover your natural leadership connection style",
      task: "Teach something. Lead something. Coach someone. Deliver it once in Architect mode (frameworks, models), then in Alchemist mode (storytelling, energy, vision).",
      reflection: [
        "Which version resonated more with others?",
        "Where did people feel moved to act?",
        "Which style felt more authentic to you?",
      ],
      purpose:
        "Leadership style isn't about competence — it's about connection. Which way do you move people?",
      hasFileUpload: false,
    },
    {
      day: 6,
      title: "Growth Future Visioning",
      duration: "2-3 hours",
      objective: "Visualize the natural future your soul is building toward",
      task: "Imagine your business 3 years from now in two versions: one built with structured systems, one built through relationships and intuition.",
      reflection: [
        "What does each future feel like?",
        "What excites or repels you about each?",
        "Which path calls to your deepest self?",
      ],
      purpose:
        "Strip away bias. Visualize the natural future your soul is building toward.",
      hasFileUpload: true,
    },
    {
      day: 7,
      title: "Integration & Identity Declaration",
      duration: "1-2 hours",
      objective: "Declare your dominant DNA and create your identity contract",
      task: "Declare your dominant DNA (Architect, Alchemist, or Blurred). Write your identity contract and first 24-hour action step.",
      reflection: [
        "What default have you lived in (blurred, adapted, or clear)?",
        "What would your business feel like if you stayed 100% in your core DNA?",
        "What support do you need to stay aligned?",
      ],
      purpose:
        "You don't need to become someone new. You just need to return to the most natural way you already work best.",
      hasFileUpload: false,
    },
  ];

  // Form schema for day responses
  const dayFormSchema = z.object({
    reflectionResponses: z
      .array(
        z
          .string()
          .min(
            10,
            "Please provide a detailed response (at least 10 characters)",
          ),
      )
      .min(1),
    notes: z.string().optional(),
    uploadedFiles: z.array(z.any()).optional(),
  });

  type DayFormData = z.infer<typeof dayFormSchema>;

  // Mutations for saving progress
  const startDayMutation = useMutation({
    mutationFn: async (dayNumber: number) => {
      const response = await fetch("/api/seven-day-reset/start-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-student-id": userId,
        },
        body: JSON.stringify({ day: dayNumber }),
      });
      if (!response.ok) throw new Error("Failed to start day");
      return response.json();
    },
    onSuccess: (data, dayNumber) => {
      setCurrentDay(dayNumber);
      queryClient.invalidateQueries({
        queryKey: ["/api/seven-day-reset/progress"],
      });
      toast({
        title: "Day Started!",
        description: `Day ${dayNumber} has been started. Complete all reflection questions to finish.`,
      });
      // Scroll to the form section after a brief delay
      setTimeout(() => {
        const formElement = document.getElementById(`day-form-${dayNumber}`);
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start the day. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeDayMutation = useMutation({
    mutationFn: async ({ day, data }: { day: number; data: DayFormData }) => {
      const response = await fetch("/api/seven-day-reset/complete-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-student-id": userId,
        },
        body: JSON.stringify({
          day,
          reflectionResponses: data.reflectionResponses,
          notes: data.notes || "",
          uploadedFiles: data.uploadedFiles || [],
        }),
      });
      if (!response.ok) throw new Error("Failed to complete day");
      return response.json();
    },
    onSuccess: (data, { day }) => {
      setCurrentDay(null);
      queryClient.invalidateQueries({
        queryKey: ["/api/seven-day-reset/progress"],
      });
      toast({
        title: "Day Completed!",
        description: `Day ${day} has been completed successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete the day. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get completed days, started days, and responses from progress data
  const completedDays = (progressData as any)?.completedDays || [];
  const startedDays = (progressData as any)?.startedDays || [];
  const responses = (progressData as any)?.responses || {};
  const progress = (completedDays.length / resetDays.length) * 100;

  // Check if a day can be started (hierarchical)
  const canStartDay = (dayNumber: number) => {
    if (dayNumber === 1) return true;
    return completedDays.includes(dayNumber - 1);
  };

  // Check if a day is currently started but not completed
  const isDayStarted = (dayNumber: number) => {
    return (
      startedDays.includes(dayNumber) && !completedDays.includes(dayNumber)
    );
  };

  // Day form component
  const DayForm = ({ day }: { day: (typeof resetDays)[0] }) => {
    const form = useForm<DayFormData>({
      resolver: zodResolver(dayFormSchema),
      defaultValues: {
        reflectionResponses: new Array(day.reflection.length).fill(""),
        notes: "",
        uploadedFiles: [],
      },
    });

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const onSubmit = (data: DayFormData) => {
      const submissionData = {
        ...data,
        uploadedFiles: uploadedFiles,
      };
      completeDayMutation.mutate({ day: day.day, data: submissionData });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setUploadedFiles(files);
    };

    // Check if this day is completed and show responses
    const isCompleted = completedDays.includes(day.day);
    const dayResponses = responses[day.day];

    if (isCompleted && dayResponses) {
      return (
        <Card
          className="mt-6 border-green-300 bg-green-50"
          id={`day-form-${day.day}`}
        >
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Day {day.day} - {day.title} (Completed)
            </CardTitle>
            <CardDescription>
              Completed on{" "}
              {new Date(dayResponses.completedAt).toLocaleDateString()} at{" "}
              {new Date(dayResponses.completedAt).toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Task Description */}
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-700 mb-2">Task:</h4>
                <p className="text-gray-600">{day.task}</p>
              </div>

              {/* Submitted Responses */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">
                  Your Submitted Responses:
                </h4>
                {day.reflection.map((prompt, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border">
                    <h5 className="font-medium text-gray-700 mb-2">{prompt}</h5>
                    <p className="text-gray-600 italic">
                      "
                      {dayResponses.reflectionResponses[index] ||
                        "No response provided"}
                      "
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional Notes */}
              {dayResponses.notes && (
                <div className="p-4 bg-white rounded-lg border">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Additional Notes:
                  </h5>
                  <p className="text-gray-600 italic">"{dayResponses.notes}"</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentDay(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        className="mt-6 border-purple-300 bg-purple-50"
        id={`day-form-${day.day}`}
      >
        <CardHeader>
          <CardTitle className="text-purple-800">
            Day {day.day} - {day.title}
          </CardTitle>
          <CardDescription>
            Complete all fields to finish this day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Task Description */}
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-700 mb-2">Task:</h4>
                <p className="text-gray-600">{day.task}</p>
              </div>

              {/* Reflection Questions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">
                  Reflection Prompts:
                </h4>
                {day.reflection.map((prompt, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`reflectionResponses.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          {prompt}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your detailed response..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* File Upload for Day 3 and 6 */}
              {day.hasFileUpload && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Upload Documents (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id={`file-upload-${day.day}`}
                        />
                        <Label
                          htmlFor={`file-upload-${day.day}`}
                          className="cursor-pointer text-sm text-purple-600 hover:text-purple-500"
                        >
                          Click to upload or drag and drop
                        </Label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, TXT, or image files
                      </p>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm text-green-600"
                            >
                              <FileText className="w-4 h-4" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional thoughts or insights..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={completeDayMutation.isPending}
              >
                {completeDayMutation.isPending
                  ? "Saving..."
                  : `Complete Day ${day.day}`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/student")}
            className="text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Program Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            7-Day Identity Reset
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            "Identity Clarity Emergency"
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            A week to stop guessing who you are — and finally feel what fits.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-purple-600">
                {completedDays.length} / {resetDays.length} days
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Objective Card */}
        <Card className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Target className="w-5 h-5" />
              Objective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg">
              Move from "blurred" and adaptive identity to authentic clarity by
              embodying both Architect and Alchemist rhythms across 7
              experiential days.
            </p>
            <div className="mt-4 p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Remember:</h4>
              <p className="text-gray-700">
                We're not asking "Are you an Architect or Alchemist?" We're
                asking: Which operating system liberates your energy and
                results?
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Days Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resetDays.map((day) => {
            const isCompleted = completedDays.includes(day.day);
            const isStarted = isDayStarted(day.day);
            const canStart = canStartDay(day.day);
            const isCurrentDay = currentDay === day.day;

            return (
              <Card
                key={day.day}
                className={`transition-all duration-200 hover:shadow-lg ${
                  isCompleted
                    ? "border-green-200 bg-green-50"
                    : isStarted || isCurrentDay
                      ? "border-purple-300 bg-purple-50 ring-2 ring-purple-200"
                      : canStart
                        ? "border-gray-200 hover:border-purple-200"
                        : "border-gray-100 bg-gray-50"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={isCompleted ? "default" : "secondary"}
                      className={
                        isCompleted
                          ? "bg-green-500"
                          : canStart
                            ? ""
                            : "bg-gray-400"
                      }
                    >
                      Day {day.day}
                      {isCompleted && <CheckCircle2 className="w-3 h-3 ml-1" />}
                      {!canStart && <Lock className="w-3 h-3 ml-1" />}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {day.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{day.title}</CardTitle>
                  <CardDescription>{day.objective}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Task:
                      </h4>
                      <p className="text-sm text-gray-600">{day.task}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Reflection Prompts:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {day.reflection.map((prompt, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            {prompt}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 italic mb-3">
                        <strong>Purpose:</strong> {day.purpose}
                      </p>

                      <div className="flex gap-2">
                        {!isCompleted && canStart ? (
                          <Button
                            size="sm"
                            onClick={() => startDayMutation.mutate(day.day)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                            disabled={isStarted || startDayMutation.isPending}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            {isStarted
                              ? `Continue Day ${day.day}`
                              : `Start Day ${day.day}`}
                          </Button>
                        ) : isCompleted ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentDay(day.day);
                              // Scroll to the response panel after a brief delay
                              setTimeout(() => {
                                const formElement = document.getElementById(
                                  `day-form-${day.day}`,
                                );
                                if (formElement) {
                                  formElement.scrollIntoView({
                                    behavior: "smooth",
                                  });
                                }
                              }, 100);
                            }}
                            className="flex-1 bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            View Responses
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="flex-1 bg-gray-50 border-gray-200 text-gray-400"
                          >
                            <Lock className="w-3 h-3 mr-1" />
                            Complete Previous Days
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Day Form */}
        {currentDay && (
          <DayForm day={resetDays.find((d) => d.day === currentDay)!} />
        )}

        {/* Show started day form */}
        {!currentDay && startedDays.length > 0 && (
          <>
            {startedDays
              .filter((dayNum: number) => !completedDays.includes(dayNum))
              .map((dayNum: number) => (
                <div key={dayNum}>
                  <div className="mt-8 p-4 bg-purple-100 rounded-lg border border-purple-200">
                    <p className="text-purple-800 font-medium text-center">
                      You have Day {dayNum} in progress. Complete it below:
                    </p>
                  </div>
                  <DayForm day={resetDays.find((d) => d.day === dayNum)!} />
                </div>
              ))}
          </>
        )}

        {/* Identity Contract Card */}
        {completedDays.length === resetDays.length && (
          <Card className="mt-8 border-gold-200 bg-gradient-to-r from-yellow-50 to-gold-50">
            <CardHeader>
              <CardTitle className="text-gold-800">
                🎉 Identity Reset Complete!
              </CardTitle>
              <CardDescription>
                Time to create your Identity Contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Write a one-sentence identity contract:
                </p>
                <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gold-300">
                  <p className="text-gray-600 italic">
                    "From this moment on, I commit to building and leading as
                    a(n) ____________ because ____________."
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Sign it. Set a reminder to revisit it monthly.
                </p>
                <Button className="w-full bg-gold-600 hover:bg-gold-700 text-white">
                  Continue to Advanced Training
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SevenDayResetInteractive;
