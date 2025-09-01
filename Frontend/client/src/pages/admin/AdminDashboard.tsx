import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Users, 
  Settings, 
  BarChart3,
  BookOpen,
  MessageSquare
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
      </div>
      
      {/* Main Content */}
      <div className="p-6 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Users</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <p className="text-xs text-gray-500 mt-1">System users</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">Email Campaigns</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">45</div>
              <p className="text-xs text-gray-500 mt-1">Emails sent</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">Analytics</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">89%</div>
              <p className="text-xs text-gray-500 mt-1">Data points</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
                <span className="text-xs text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">System Status</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm">
                  Online
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">All systems operational</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">100%</span>
                <span className="text-xs text-gray-500 ml-2">uptime</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/courses">
                <Button className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700 text-white">
                  <BookOpen className="mr-3 h-4 w-4" />
                  Manage Courses
                </Button>
              </Link>
              <Link href="/admin/community">
                <Button className="w-full justify-start h-12" variant="outline">
                  <MessageSquare className="mr-3 h-4 w-4" />
                  Community Management
                </Button>
              </Link>
              <Link href="/admin/leads">
                <Button className="w-full justify-start h-12" variant="outline">
                  <Users className="mr-3 h-4 w-4" />
                  Manage Leads
                </Button>
              </Link>
              <Link href="/admin/email-campaigns">
                <Button className="w-full justify-start h-12" variant="outline">
                  <Mail className="mr-3 h-4 w-4" />
                  Email Campaigns
                </Button>
              </Link>
              <Link href="/admin/email-templates">
                <Button className="w-full justify-start h-12" variant="outline">
                  <Mail className="mr-3 h-4 w-4" />
                  Email Templates
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Admin Access Granted</p>
                  <p className="text-xs text-gray-500 mt-1">Welcome to the admin dashboard.</p>
                  <p className="text-xs text-gray-400 mt-1">Just now</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System Status Check</p>
                  <p className="text-xs text-gray-500 mt-1">All systems operational</p>
                  <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}