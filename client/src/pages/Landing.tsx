import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, GraduationCap, Users, Target, Star, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Rocket className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900">Brandscaling</span>
            </div>
            
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-primary hover:bg-blue-600"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Scale Your Brand with 
              <span className="text-primary"> Strategic Learning</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of entrepreneurs building successful brands through our proven framework, 
              AI-powered insights, and exclusive mastermind community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/api/login"}
                className="bg-primary hover:bg-blue-600 text-lg px-8 py-6"
              >
                Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center space-x-6 text-slate-500">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-medium">4.9/5</span>
                <span className="text-sm">from 500+ reviews</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">2,000+</span> active entrepreneurs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive platform combines strategic learning, AI guidance, 
              and community support to accelerate your brand growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Strategic Learning Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Master the Architect and Alchemist tracks with structured courses 
                  designed by successful brand builders.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">AI Brand Advisor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get personalized insights and recommendations from our GPT-4 powered 
                  brand advisor tailored to your specific needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Mastermind Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Connect with like-minded entrepreneurs, share insights, 
                  and accelerate growth through peer collaboration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Scale Your Brand?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of successful entrepreneurs and start your brandscaling journey today.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6"
          >
            Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Rocket className="text-white w-3 h-3" />
              </div>
              <span className="text-lg font-bold">Brandscaling</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 Brandscaling Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
