import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraftingCompass, Wand2, Clock, Users, Star, BookOpen, ArrowRight, CreditCard } from "lucide-react";

import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function Courses() {
  const { isAuthenticated } = useFirebaseAuth();
  const [, setLocation] = useLocation();

  const handlePurchase = (courseId: string, amount: string, title: string) => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setLocation(`/checkout?courseId=${courseId}&amount=${amount}&title=${encodeURIComponent(title)}`);
  };

  const handleSubscription = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setLocation('/checkout?type=subscription');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center px-6 py-20 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg mb-8">
          <h1 className="text-5xl font-bold mb-4">Explore Brandscaling Courses</h1>
          <p className="text-xl max-w-2xl mx-auto">From free masterclasses to high-ticket immersive strategy — choose the track that matches your scale season.</p>
        </section>

        {/* Subscription Banner */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-2 border-purple-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                All-Access Monthly Subscription
              </h2>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Get unlimited access to all courses, live Q&A sessions, community forum, and exclusive resources for one monthly price.
              </p>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-purple-600">£97</span>
                <span className="text-gray-500">/month</span>
              </div>
              <Button
                onClick={handleSubscription}
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-3 text-lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Start Subscription
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Course Grid */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Individual Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Free Course */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-purple-100 to-orange-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-purple-600" />
                </div>
                <Badge className="mb-2 bg-green-100 text-green-800">Free</Badge>
                <h3 className="text-2xl font-semibold text-purple-600 mb-2">Infinite Scaling™ Intro</h3>
                <p className="text-gray-700 mb-4">Discover the exact 7-layer framework we've used to scale service businesses from 6 to 8 figures — without paid ads or burnout.</p>
                <Button variant="outline" className="w-full">
                  Watch Now
                </Button>
              </CardContent>
            </Card>

            {/* 90-Day Course */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <ArrowRight className="h-16 w-16 text-orange-600" />
                </div>
                <Badge className="mb-2 bg-orange-100 text-orange-800">£497</Badge>
                <h3 className="text-2xl font-semibold text-orange-600 mb-2">90-Day Scaling Course</h3>
                <p className="text-gray-700 mb-4">Weekly modules, live Q&A, and our full scaling OS. Ideal if you're doing 5–30k/month and want to break your next revenue ceiling.</p>
                <Button 
                  onClick={() => handlePurchase('90day', '497', '90-Day Scaling Course')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase Course
                </Button>
              </CardContent>
            </Card>

            {/* Architect Track */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <DraftingCompass className="h-16 w-16 text-purple-600" />
                </div>
                <Badge className="mb-2 bg-purple-100 text-purple-800">£297</Badge>
                <h3 className="text-2xl font-semibold text-purple-600 mb-2">Architect Track</h3>
                <p className="text-gray-700 mb-4">Systems-focused approach to scaling. Perfect for logical, process-driven founders who love frameworks and measurable outcomes.</p>
                <Button 
                  onClick={() => handlePurchase('architect', '297', 'Architect Track')}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase Course
                </Button>
              </CardContent>
            </Card>

            {/* Alchemist Track */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <Wand2 className="h-16 w-16 text-orange-600" />
                </div>
                <Badge className="mb-2 bg-orange-100 text-orange-800">£297</Badge>
                <h3 className="text-2xl font-semibold text-orange-600 mb-2">Alchemist Track</h3>
                <p className="text-gray-700 mb-4">Intuition-based scaling approach. Ideal for creative, relationship-driven founders who excel at transformation and connection.</p>
                <Button 
                  onClick={() => handlePurchase('alchemist', '297', 'Alchemist Track')}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase Course
                </Button>
              </CardContent>
            </Card>

            {/* VIP Intensive */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-300">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <Star className="h-16 w-16 text-purple-700" />
                </div>
                <Badge className="mb-2 bg-purple-200 text-purple-900">£24,000</Badge>
                <h3 className="text-2xl font-semibold text-purple-700 mb-2">VIP Scaling Intensive</h3>
                <p className="text-gray-700 mb-4">1-on-1 strategy sessions, personalized scaling plan, and direct access to our core team for 30 days.</p>
                <Button 
                  onClick={() => handlePurchase('vip', '24000', 'VIP Scaling Intensive')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase VIP
                </Button>
              </CardContent>
            </Card>

            {/* Mastermind */}
            <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-indigo-600" />
                </div>
                <Badge className="mb-2 bg-indigo-100 text-indigo-800">Application Only</Badge>
                <h3 className="text-2xl font-semibold text-indigo-600 mb-2">Brandscaling Mastermind</h3>
                <p className="text-gray-700 mb-4">Work directly with our core team. Designed for high-performance business owners scaling with embedded growth partners.</p>
                <Button variant="outline" className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                  Apply Now
                </Button>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Get early access to our course library and be the first to know when new content is available.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => setLocation('/login')}
            >
              Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}