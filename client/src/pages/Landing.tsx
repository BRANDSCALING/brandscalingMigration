import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, GraduationCap, Users, Target, ArrowRight, TrendingUp, Megaphone, Share2, MessageCircle, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Landing() {
  const [activeChatAgent, setActiveChatAgent] = useState<string | null>(null);

  const aiAgents = [
    { id: 'startup', name: 'Startup Coach', icon: Rocket, color: 'bg-blue-500' },
    { id: 'strategy', name: 'Strategy Expert', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'marketing', name: 'Marketing Guru', icon: Megaphone, color: 'bg-orange-500' },
    { id: 'social', name: 'Social Media Pro', icon: Share2, color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Scale Your Brand with 
              <span className="text-primary"> AI-Powered Learning</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of entrepreneurs building successful brands through our proven framework, 
              AI-powered insights, and exclusive mastermind community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/quiz">
                <Button size="lg" className="bg-primary hover:bg-blue-600 text-white px-8 py-4 text-lg">
                  Take Assessment Quiz
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg">
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* AI Agents Toggle Buttons */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Get Instant AI Guidance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {aiAgents.map((agent) => (
                  <Button
                    key={agent.id}
                    variant="outline"
                    onClick={() => setActiveChatAgent(agent.id)}
                    className="p-4 h-auto flex flex-col items-center space-y-2 hover:bg-blue-50 border-2"
                  >
                    <div className={`p-3 rounded-full ${agent.color} text-white`}>
                      <agent.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">{agent.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbox Overlay */}
      {activeChatAgent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${aiAgents.find(a => a.id === activeChatAgent)?.color}`}>
                  {(() => {
                    const agent = aiAgents.find(a => a.id === activeChatAgent);
                    if (agent?.icon) {
                      const IconComponent = agent.icon;
                      return <IconComponent className="w-5 h-5 text-white" />;
                    }
                    return null;
                  })()}
                </div>
                <h3 className="text-lg font-semibold">
                  {aiAgents.find(a => a.id === activeChatAgent)?.name}
                </h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveChatAgent(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Hi! I'm your {aiAgents.find(a => a.id === activeChatAgent)?.name}. 
                    How can I help you scale your brand today?
                  </p>
                </div>
                <div className="text-center text-gray-500 text-sm">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  AI chat integration coming soon...
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
                <Button disabled className="px-4 py-2">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Scale</h2>
            <p className="text-xl text-slate-600">Choose your learning path and accelerate your growth</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Architect Track</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Strategic frameworks for building scalable business systems and processes.
                </p>
                <Link href="/courses">
                  <Button variant="outline" className="w-full">
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Alchemist Track</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Creative and innovative approaches to brand transformation and growth.
                </p>
                <Link href="/courses">
                  <Button variant="outline" className="w-full">
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Mastermind</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Exclusive community access with personalized coaching and peer support.
                </p>
                <Link href="/community">
                  <Button variant="outline" className="w-full">
                    Join Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}