import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  Award,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  const features = [
    {
      icon: Target,
      title: "Strategic Learning Paths",
      description: "Master the Architect and Alchemist tracks with courses designed by successful entrepreneurs.",
    },
    {
      icon: Lightbulb,
      title: "AI-Powered Insights",
      description: "Get personalized brand recommendations from our GPT-4 powered AI advisor.",
    },
    {
      icon: Users,
      title: "Mastermind Community",
      description: "Connect with like-minded entrepreneurs and accelerate growth through collaboration.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Track your progress and measure brand growth with comprehensive analytics.",
    },
  ];

  const team = [
    {
      name: "Brand Story Placeholder",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b330?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face",
      bio: "Brand story placeholder content will be added here.",
    },
    {
      name: "Mission Statement",
      role: "Head of Education",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face",
      bio: "Mission statement placeholder content will be added here.",
    },
    {
      name: "Founder Bio",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face",
      bio: "Founder bio placeholder content will be added here.",
    },
  ];

  const stats = [
    { label: "Active Entrepreneurs", value: "2,847" },
    { label: "Courses Completed", value: "12,456" },
    { label: "Success Stories", value: "890" },
    { label: "Community Posts", value: "45,672" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Brand Story Placeholder
            <span className="text-primary"> Mission Statement</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Brand story placeholder content will be added here. Mission statement placeholder content will be added here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-blue-600">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Our Story
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Mission Statement Placeholder</h2>
            <p className="text-lg text-slate-700 mb-6">
              Mission statement placeholder content will be added here. Brand story placeholder content will be added here.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-slate-700">Proven strategic frameworks</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-slate-700">AI-powered personalization</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-slate-700">Vibrant entrepreneur community</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-slate-700">Measurable growth outcomes</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=600&h=400&fit=crop"
              alt="Team collaboration"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools, knowledge, and community 
              support you need to build a successful brand.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Founder Bios Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Founder Bios</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Founder bios placeholder content will be added here.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-primary/20 bg-gradient-to-br from-blue-50 to-primary/5">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Entrepreneur First</h3>
                <p className="text-slate-600">
                  Every decision we make is focused on helping entrepreneurs succeed. 
                  Your success is our success.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Community Driven</h3>
                <p className="text-slate-600">
                  We believe in the power of peer learning and collaboration. 
                  Together, we achieve more.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Excellence Always</h3>
                <p className="text-slate-600">
                  We're committed to providing the highest quality education, 
                  tools, and support for your brand journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Brand?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who are building successful brands with our platform.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}