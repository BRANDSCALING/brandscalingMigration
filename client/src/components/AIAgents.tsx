import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface AIAgentsProps {
  title: string;
  subtext: string;
  tags: string[];
  samplePrompt: string;
}

export default function AIAgents({ title, subtext, tags, samplePrompt }: AIAgentsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          {title}
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          {subtext}
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Card className="max-w-md mx-auto mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <span className="font-semibold text-slate-900">Try asking:</span>
            </div>
            <p className="text-slate-600 italic">"{samplePrompt}"</p>
          </CardContent>
        </Card>
        
        <Button size="lg" className="bg-primary hover:bg-blue-600">
          Chat with AI Advisors
        </Button>
      </div>
    </section>
  );
}