import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Target, CheckCircle2, Play } from 'lucide-react';

const SevenDayReset = () => {
  const [, setLocation] = useLocation();
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const resetDays = [
    {
      day: 1,
      title: "Contrast Activation: Force vs Flow",
      duration: "Full workday",
      objective: "Surface your core operating preference through felt experience",
      task: "Spend half your workday following a rigid, structured plan. Spend the other half being completely intuitive and responsive. Track energy, results, resistance.",
      reflection: [
        "Which half of the day energized you more?",
        "When did time pass faster or slower?",
        "Did you feel more alive in structure or in freedom?"
      ],
      purpose: "Surface your core operating preference through felt experience, not ideas."
    },
    {
      day: 2,
      title: "Authenticity Archaeology",
      duration: "2-3 hours",
      objective: "Recall embodied success from the past to find traces of your original DNA",
      task: "Journal 3 business memories where you felt deeply aligned. Note what you were doing, what type of decisions you made, and the rhythm of your day.",
      reflection: [
        "When was your business success most effortless?",
        "What decisions felt most natural?",
        "What rhythm energized you most?"
      ],
      purpose: "Recall embodied success from the past to find traces of your original DNA."
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
        "Which result felt like 'you'?"
      ],
      purpose: "Re-experience both styles in a focused task. One will feel like home."
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
        "Which decision approach energized me most?"
      ],
      purpose: "Reveal which decision approach you naturally trust (and which drains you)."
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
        "Which style felt more authentic to you?"
      ],
      purpose: "Leadership style isn't about competence — it's about connection. Which way do you move people?"
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
        "Which path calls to your deepest self?"
      ],
      purpose: "Strip away bias. Visualize the natural future your soul is building toward."
    },
    {
      day: 7,
      title: "Integration & Identity Declaration",
      duration: "1-2 hours",
      objective: "Declare your dominant DNA and create your identity contract",
      task: "Declare your dominant DNA (Architect, Alchemist, or Hybrid). Write your identity contract and first 24-hour action step.",
      reflection: [
        "What default have you lived in (blurred, adapted, or clear)?",
        "What would your business feel like if you stayed 100% in your core DNA?",
        "What support do you need to stay aligned?"
      ],
      purpose: "You don't need to become someone new. You just need to return to the most natural way you already work best."
    }
  ];

  const progress = (completedDays.length / resetDays.length) * 100;

  const markDayComplete = (dayNumber: number) => {
    if (!completedDays.includes(dayNumber)) {
      setCompletedDays([...completedDays, dayNumber]);
    }
  };

  const startDay = (dayNumber: number) => {
    setCurrentDay(dayNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/student')}
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
              Move from "blurred" and adaptive identity to authentic clarity by embodying both 
              Architect and Alchemist rhythms across 7 experiential days.
            </p>
            <div className="mt-4 p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Remember:</h4>
              <p className="text-gray-700">
                We're not asking "Are you an Architect or Alchemist?" We're asking: 
                Which operating system liberates your energy and results?
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Days Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resetDays.map((day) => (
            <Card 
              key={day.day} 
              className={`transition-all duration-200 hover:shadow-lg ${
                completedDays.includes(day.day) 
                  ? 'border-green-200 bg-green-50' 
                  : currentDay === day.day 
                    ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={completedDays.includes(day.day) ? "default" : "secondary"}
                    className={completedDays.includes(day.day) ? "bg-green-500" : ""}
                  >
                    Day {day.day}
                    {completedDays.includes(day.day) && (
                      <CheckCircle2 className="w-3 h-3 ml-1" />
                    )}
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
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Task:</h4>
                    <p className="text-sm text-gray-600">{day.task}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Reflection Prompts:</h4>
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
                      {!completedDays.includes(day.day) ? (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => startDay(day.day)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Start Day {day.day}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => markDayComplete(day.day)}
                            className="border-green-300 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled
                          className="flex-1 bg-green-50 border-green-200 text-green-600"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Identity Contract Card */}
        {completedDays.length === resetDays.length && (
          <Card className="mt-8 border-gold-200 bg-gradient-to-r from-yellow-50 to-gold-50">
            <CardHeader>
              <CardTitle className="text-gold-800">🎉 Identity Reset Complete!</CardTitle>
              <CardDescription>Time to create your Identity Contract</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Write a one-sentence identity contract:
                </p>
                <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gold-300">
                  <p className="text-gray-600 italic">
                    "From this moment on, I commit to building and leading as a(n) ____________ because ____________."
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

export default SevenDayReset;