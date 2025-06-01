import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, TrendingUp, ArrowRight, Shield } from "lucide-react";

import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Join Our Private Community
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Connect with like-minded entrepreneurs, share insights, and grow together in an exclusive environment.
          </p>
        </div>

        {/* Community Access CTA */}
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">Private Community Access</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-8">
            Our community is exclusively available to registered members. Join us to participate in discussions and connect with fellow entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-blue-600">
                Login <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Community Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Discussion Forums</h3>
              <p className="text-slate-600">
                Engage in meaningful conversations about brand strategy, growth tactics, and entrepreneurship.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Peer Networking</h3>
              <p className="text-slate-600">
                Connect with entrepreneurs at similar stages and build valuable professional relationships.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Growth Insights</h3>
              <p className="text-slate-600">
                Share wins, challenges, and learn from real experiences of fellow community members.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">What to Expect</h4>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Respectful and constructive discussions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Expert insights and peer learning opportunities</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Regular community events and Q&A sessions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Access to exclusive resources and content</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Community Standards</h4>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Be respectful and professional</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Share valuable insights and experiences</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Support fellow entrepreneurs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Keep discussions relevant and constructive</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join CTA */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community of ambitious entrepreneurs and start building meaningful connections today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Sign In to Community <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}