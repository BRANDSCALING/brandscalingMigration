import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, Network, Briefcase, Target, Bell } from "lucide-react";

export default function CollabComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Collaboration Club
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your LinkedIn-style partner work zone for strategic business collaborations
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
            <Bell className="h-4 w-4 mr-2" />
            Coming Soon
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Handshake className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Strategic Partnerships</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with potential business partners and collaborators
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Network className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Professional Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build your professional network within the Brandscaling ecosystem
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Project Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Work together on joint ventures and collaborative projects
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Business Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Discover new business opportunities and partnership deals
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="inline-block max-w-lg">
            <CardHeader>
              <CardTitle>Exclusive Partner Network</CardTitle>
              <CardDescription>
                A premium space for serious entrepreneurs to connect and collaborate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  The Collaboration Club is being designed as an exclusive networking platform for verified entrepreneurs and business leaders. Access will be invitation-only to ensure quality connections.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">What to Expect:</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Verified member profiles</li>
                    <li>• Strategic partnership matching</li>
                    <li>• Private collaboration spaces</li>
                    <li>• Deal flow opportunities</li>
                  </ul>
                </div>
                <Button className="w-full" disabled>
                  Join Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}