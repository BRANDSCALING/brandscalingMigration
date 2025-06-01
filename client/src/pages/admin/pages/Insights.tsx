import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, Users, Eye, MessageSquare, Activity, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function Insights() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics');
      return await response.json();
    },
  });

  const { data: topContent } = useQuery({
    queryKey: ['/api/admin/analytics/top-content'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics/top-content');
      return await response.json();
    },
  });

  const { data: userActivity } = useQuery({
    queryKey: ['/api/admin/analytics/user-activity'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics/user-activity');
      return await response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Platform Insights</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const insightCards = [
    {
      title: 'Total Page Views',
      value: analytics?.totalPageViews || 0,
      change: `+${analytics?.pageViewsGrowth || 0}% this month`,
      icon: Eye,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Active Users (30d)',
      value: analytics?.activeUsers || 0,
      change: `+${analytics?.userGrowth || 0}% this month`,
      icon: Users,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Engagement Rate',
      value: `${analytics?.engagementRate || 0}%`,
      change: `${analytics?.engagementChange > 0 ? '+' : ''}${analytics?.engagementChange || 0}% vs last month`,
      icon: Activity,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Avg. Session Duration',
      value: `${analytics?.avgSessionDuration || 0}m`,
      change: `+${analytics?.sessionGrowth || 0}% this month`,
      icon: Calendar,
      color: 'text-orange-600 bg-orange-100',
    },
    {
      title: 'Content Views',
      value: analytics?.contentViews || 0,
      change: `+${analytics?.contentGrowth || 0}% this month`,
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-100',
    },
    {
      title: 'Community Posts',
      value: analytics?.totalPosts || 0,
      change: `+${analytics?.postsGrowth || 0}% this month`,
      icon: MessageSquare,
      color: 'text-pink-600 bg-pink-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Insights</h1>
        <p className="text-gray-600 mt-2">Analytics and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightCards.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent && Array.isArray(topContent) ? (
                topContent.slice(0, 5).map((content: any, index: number) => (
                  <div key={content.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{content.title}</p>
                        <p className="text-sm text-gray-500">{content.views} views</p>
                      </div>
                    </div>
                    <Badge variant="outline">{content.type}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No content data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivity && Array.isArray(userActivity) ? (
                userActivity.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.userEmail}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No activity data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          {topContent && Array.isArray(topContent) && topContent.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topContent.map((content: any) => (
                    <TableRow key={content.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {content.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {content.author || 'Unknown'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {content.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{content.views?.toLocaleString() || 0}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {content.engagementRate || 0}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
              <p className="text-gray-500">Analytics data will appear here once content is created and viewed.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}