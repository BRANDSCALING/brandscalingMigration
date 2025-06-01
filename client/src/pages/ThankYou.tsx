import { Link } from "wouter";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-purple-700 mb-4">
              Welcome to Brandscaling!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your purchase was successful. You now have full access to your program and can begin your brandscaling journey.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-orange-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">What's Next?</h2>
            <p className="text-gray-600 mb-4">
              Access your learning dashboard to start exploring courses, connect with the community, and begin scaling your business.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/courses">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold py-4"
              >
                Go to Learning Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <div className="flex gap-4">
              <Link href="/community" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Join Community
                </Button>
              </Link>
              
              <Link href="/quiz" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Take Assessment
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team or check your email for next steps.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}