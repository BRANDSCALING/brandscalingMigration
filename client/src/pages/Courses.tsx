import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraftingCompass, Wand2, Clock, Users, Star, BookOpen, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Courses() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center px-6 py-20 bg-brand-purple text-white rounded-lg mb-12">
          <h1 className="text-5xl font-bold mb-4">📚 Explore Brandscaling Courses</h1>
          <p className="text-xl max-w-2xl mx-auto">From free masterclasses to high-ticket immersive strategy — choose the track that matches your scale season.</p>
        </section>

        {/* Course Tracks */}
        <Tabs defaultValue="free" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="free">Free Courses</TabsTrigger>
            <TabsTrigger value="paid">Paid Programs</TabsTrigger>
            <TabsTrigger value="mastermind">Mastermind</TabsTrigger>
          </TabsList>

          {/* Free Courses */}
          <TabsContent value="free" className="space-y-6">
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Free Courses Coming Soon</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-8">
                We're preparing foundational courses to help you get started with brand building fundamentals.
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-primary hover:bg-blue-600">
                  Get Notified <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Paid Programs */}
          <TabsContent value="paid" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Architect Track Placeholder */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/20">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <DraftingCompass className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Architect Track</CardTitle>
                      <Badge variant="secondary">Strategic Foundation</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">
                    Master the strategic frameworks for building scalable brand foundations and systems.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Content being developed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Expert-led curriculum</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Premium content</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              {/* Alchemist Track Placeholder */}
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/20">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <Wand2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Alchemist Track</CardTitle>
                      <Badge variant="secondary">Growth & Optimization</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">
                    Transform your brand with advanced growth strategies, optimization, and market positioning.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Content being developed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Advanced techniques</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Premium content</span>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mastermind */}
          <TabsContent value="mastermind" className="space-y-6">
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">Exclusive Mastermind Program</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-8">
                Join an elite community of entrepreneurs for peer learning, expert mentorship, and collaborative growth.
              </p>
              <Link href="/community">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Learn More <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get early access to our course library and be the first to know when new content is available.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}