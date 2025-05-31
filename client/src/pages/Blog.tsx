import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Brand Building Insights
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Strategic insights, case studies, and actionable advice to help you build and scale your brand.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">All Topics</Badge>
            <Badge variant="outline">Strategy</Badge>
            <Badge variant="outline">Growth</Badge>
            <Badge variant="outline">Marketing</Badge>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">Blog Content Coming Soon</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-8">
            We're preparing valuable insights, case studies, and strategic advice to help you master brand building.
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

        {/* Blog Layout Preview */}
        <div className="grid md:grid-cols-3 gap-8 opacity-50">
          {/* Featured Article Placeholder */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">Featured</Badge>
                <Badge variant="outline">Strategy</Badge>
              </div>
              <CardTitle className="text-xl">Article Layout Preview</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Publishing Soon</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Expert Content</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 bg-slate-100 rounded-lg mb-4"></div>
              <p className="text-slate-600">
                In-depth articles covering strategic frameworks, growth tactics, and real-world case studies will be published here.
              </p>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Latest insights and updates will appear in this sidebar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Brand Strategy</span>
                    <Badge variant="secondary">Coming</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Growth Hacking</span>
                    <Badge variant="secondary">Coming</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Case Studies</span>
                    <Badge variant="secondary">Coming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Newsletter CTA */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white mt-16">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Be the first to receive our latest insights and strategic content directly in your inbox.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Subscribe to Updates <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}