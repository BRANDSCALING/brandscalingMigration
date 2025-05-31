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

        {/* Course Grid */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Free Course */}
            <div className="border rounded-lg shadow-md p-6">
              <img src="https://via.placeholder.com/400x250" alt="Free Webinar" className="rounded mb-4 w-full" />
              <h3 className="text-2xl font-semibold text-brand-purple mb-2">🚀 Free Webinar: Infinite Scaling™ Intro</h3>
              <p className="text-gray-700 mb-4">Discover the exact 7-layer framework we've used to scale service businesses from 6 to 8 figures — without paid ads or burnout.</p>
              <a href="/webinar" className="text-brand-orange font-semibold underline">Watch Now →</a>
            </div>

            {/* Paid Course */}
            <div className="border rounded-lg shadow-md p-6">
              <img src="https://via.placeholder.com/400x250" alt="90 Day Course" className="rounded mb-4 w-full" />
              <h3 className="text-2xl font-semibold text-brand-orange mb-2">📈 90-Day Scaling Course</h3>
              <p className="text-gray-700 mb-4">Weekly modules, live Q&A, and our full scaling OS. Ideal if you're doing 5–30k/month and want to break your next revenue ceiling.</p>
              <a href="/course/90day" className="text-brand-purple font-semibold underline">See Curriculum →</a>
            </div>

            {/* Mastermind */}
            <div className="border rounded-lg shadow-md p-6">
              <img src="https://via.placeholder.com/400x250" alt="Mastermind" className="rounded mb-4 w-full" />
              <h3 className="text-2xl font-semibold text-purple-700 mb-2">🧠 Brandscaling Mastermind</h3>
              <p className="text-gray-700 mb-4">Apply to work directly with our core team. Designed for high-performance business owners scaling with embedded growth partners.</p>
              <a href="/apply" className="text-brand-orange font-semibold underline">Apply Now →</a>
            </div>

          </div>
        </section>

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