import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface AIAgentsProps {
  title: string;
  subtext: string;
  tags: string[];
}

export default function AIAgents({ title, subtext, tags }: AIAgentsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-alchemist-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-black/15"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
          {title}
        </h2>
        <p className="text-lg text-white/90 mb-8 drop-shadow">
          {subtext}
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tags.map((tag, index) => (
            <Badge key={index} className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button size="lg" className="bg-white text-brand-orange hover:bg-gray-50 shadow-xl">
          Chat with AI Advisors
        </Button>
      </div>
    </section>
  );
}