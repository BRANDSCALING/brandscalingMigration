import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Calendar, Bell } from "lucide-react";

export default function CommunityComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Brandscaling Community
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect, learn, and grow with fellow entrepreneurs building extraordinary brands
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
            <Bell className="h-4 w-4 mr-2" />
            Coming Soon
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Expert Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with industry experts, successful entrepreneurs, and fellow brand builders
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Discussion Forums</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share insights, ask questions, and get feedback on your brand strategies
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Live Events</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join exclusive webinars, workshops, and networking events
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="inline-block max-w-md">
            <CardHeader>
              <CardTitle>Be the First to Know</CardTitle>
              <CardDescription>
                Get notified when the Brandscaling Community launches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  The community platform is currently in development. We're building something special for our members.
                </p>
                <Button className="w-full" disabled>
                  Notify Me When Ready
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}