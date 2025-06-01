import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  activeUsers: number;
  newUsersThisWeek: number;
  postsThisWeek: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/stats');
      return await response.json();
    },
  });

  const { data: recentUsers } = useQuery({
    queryKey: ['/api/admin/users/recent'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/users/recent');
      return await response.json();
    },
  });

  const { data: recentPosts } = useQuery({
    queryKey: ['/api/admin/posts/recent'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/posts/recent');
      return await response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: `+${stats?.newUsersThisWeek || 0} this week`,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      change: `+${stats?.postsThisWeek || 0} this week`,
      icon: FileText,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Comments',
      value: stats?.totalComments || 0,
      change: 'All time',
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      change: 'Last 30 days',
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your Brandscaling platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers && Array.isArray(recentUsers) ? (
                recentUsers.slice(0, 5).map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        {user.role} • {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No users to display</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts && Array.isArray(recentPosts) ? (
                recentPosts.slice(0, 5).map((post: any) => (
                  <div key={post.id} className="border-l-2 border-gray-200 pl-4">
                    <h4 className="font-medium text-gray-900 truncate">{post.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      by {post.user?.email} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    {post.isPinned && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mt-2">
                        Pinned
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No posts to display</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}