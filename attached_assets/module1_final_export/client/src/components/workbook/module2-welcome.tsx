import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Module2WelcomeProps {
  completedSections?: string[];
  onStartModule?: () => void;
}

export default function Module2Welcome({ completedSections = [], onStartModule }: Module2WelcomeProps) {
  const sections = [
    {
      id: "what-is-brand",
      title: "What Is a Brand (Really)?",
      description: "Emotional + strategic brand clarity"
    },
    {
      id: "name-brand-identity",
      title: "Name & Brand Identity Fast Track",
      description: "Name, tagline, tone, colors"
    },
    {
      id: "logo-visual-identity",
      title: "Logo & Visual Identity Builder",
      description: "Logo, fonts, palettes, templates"
    },
    {
      id: "brand-story-guidelines",
      title: "Brand Story & Guideline Builder",
      description: "Messaging, values, tone, audience"
    },
    {
      id: "social-profile-setup",
      title: "Social Profile Setup & Launch System",
      description: "Align your online presence"
    },
    {
      id: "link-infrastructure",
      title: "Link Infrastructure System",
      description: "Build a clean \"link-in-bio\" experience"
    },
    {
      id: "brand-bio-profile",
      title: "Brand Bio & Profile Builder",
      description: "Conversion-optimized bios"
    },
    {
      id: "content-launch-checklist",
      title: "The Content Launch Checklist",
      description: "Post ideas to launch with clarity"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        
        {/* Hero Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-strategic-black mb-6">
            Welcome to Module 2: Build Your Brand
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            This module helps you define your brand's emotional depth, visual identity, and online presence — so people instantly get what you do and trust what you stand for.
          </p>
        </div>

        {/* Brandscaling Quote Block */}
        <div className="mb-12">
          <Card className="bg-[#FDF2E9] border-l-4 border-orange-500 p-6 rounded-xl shadow-sm">
            <blockquote className="text-lg italic font-serif text-gray-700 text-center leading-relaxed">
              "A brand isn't just a name, logo, or color scheme. It's how people feel when they see your business — and how clearly they understand what you do."
            </blockquote>
            <cite className="block text-center text-sm font-medium text-gray-600 mt-4">
              — Brandscaling Philosophy
            </cite>
          </Card>
        </div>

        {/* What You'll Work Through */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-strategic-black text-center mb-8">
            What You'll Work Through
          </h2>
          
          <div className="space-y-4">
            {sections.map((section, index) => {
              const isCompleted = completedSections.includes(section.id);
              
              return (
                <Card 
                  key={section.id}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md border cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg text-strategic-black">
                        2.{index + 1} {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onStartModule}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow mt-8 transition-colors duration-200"
          >
            Start with Section 2.1
          </button>
        </div>

      </div>
    </div>
  );
}