import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Target, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Quiz() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Brand Assessment Quiz
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Discover your current brand maturity level and get personalized recommendations for your next steps.
          </p>
        </div>

        {/* Quiz Builder Placeholder */}
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">Assessment Coming Soon</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-8">
            We're developing a comprehensive brand assessment tool to help you identify your strengths and growth opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-primary hover:bg-blue-600">
                Explore Courses <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Get Notified
              </Button>
            </Link>
          </div>
        </div>

        {/* Assessment Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Brand Foundation</h3>
              <p className="text-slate-600">
                Assess your brand's core elements, positioning, and strategic foundation.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Growth Potential</h3>
              <p className="text-slate-600">
                Evaluate your current growth strategies and identify expansion opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Optimization Areas</h3>
              <p className="text-slate-600">
                Discover specific areas where you can improve and optimize your brand performance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What You'll Get */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">What You'll Receive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Personalized Assessment</h4>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive brand maturity score</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Detailed analysis of strengths and gaps</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Custom recommendations for improvement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Strategic roadmap for next steps</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Actionable Insights</h4>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Recommended course track (Architect or Alchemist)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Priority areas for immediate focus</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Resource recommendations and tools</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Performance benchmarks and goals</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Preview Layout */}
        <Card className="mb-16 opacity-50">
          <CardHeader>
            <CardTitle className="text-xl">Assessment Preview</CardTitle>
            <p className="text-slate-600">A glimpse of what the brand assessment will look like</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-slate-900 mb-2">Sample Question</h4>
                <p className="text-slate-600 mb-4">How would you describe your current brand positioning strategy?</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                    <span className="text-slate-600">We have a clear, differentiated position</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                    <span className="text-slate-600">We're working on defining our position</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full"></div>
                    <span className="text-slate-600">We haven't established positioning yet</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Assess Your Brand?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our waitlist to be the first to access the comprehensive brand assessment tool.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Join Assessment Waitlist <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}