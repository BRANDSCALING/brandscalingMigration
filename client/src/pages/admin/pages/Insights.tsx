import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  Calendar,
  Eye
} from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { apiRequest } from '@/lib/queryClient';
import InsightsHeader from '../components/insights/InsightsHeader';
import InsightCard from '../components/insights/InsightCard';
import InsightChart from '../components/insights/InsightChart';

export default function Insights() {
  const { userProfile, loading, isAuthenticated } = useFirebaseAuth();
  const [printMode, setPrintMode] = useState(false);

  // Fetch analytics data - hooks must be called unconditionally
  const { data: dailyActiveUsers } = useQuery({
    queryKey: ['/api/admin/analytics/daily-active-users'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics/daily-active-users');
      return await response.json();
    },
    enabled: !loading && isAuthenticated && userProfile?.role === 'admin',
  });

  const { data: newPostsData } = useQuery({
    queryKey: ['/api/admin/analytics/new-posts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics/new-posts');
      return await response.json();
    },
    enabled: !loading && isAuthenticated && userProfile?.role === 'admin',
  });

  const { data: userGrowthData } = useQuery({
    queryKey: ['/api/admin/analytics/user-growth'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics/user-growth');
      return await response.json();
    },
    enabled: !loading && isAuthenticated && userProfile?.role === 'admin',
  });

  const { data: moderationData } = useQuery({
    queryKey: ['/api/admin/analytics/moderation'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics/moderation');
      return await response.json();
    },
    enabled: !loading && isAuthenticated && userProfile?.role === 'admin',
  });

  const { data: bannedUsersData } = useQuery({
    queryKey: ['/api/admin/analytics/banned-users'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics/banned-users');
      return await response.json();
    },
    enabled: !loading && isAuthenticated && userProfile?.role === 'admin',
  });

  // Redirect non-admins after all hooks are called
  useEffect(() => {
    if (!loading && (!isAuthenticated || userProfile?.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [loading, isAuthenticated, userProfile]);

  // Show loading while auth check is in progress
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Don't render anything if not admin
  if (!isAuthenticated || userProfile?.role !== 'admin') {
    return null;
  }

  // Process data for charts
  const dauChartData = useMemo(() => {
    if (!dailyActiveUsers) return { labels: [], datasets: [] };
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'MMM dd');
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Daily Active Users',
          data: dailyActiveUsers.daily || Array(7).fill(0),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, [dailyActiveUsers]);

  const postsChartData = useMemo(() => {
    if (!newPostsData) return { labels: [], datasets: [] };
    
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, 'MMM dd');
    });

    return {
      labels: last30Days,
      datasets: [
        {
          label: 'New Posts',
          data: newPostsData.daily || Array(30).fill(0),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
      ],
    };
  }, [newPostsData]);

  const growthChartData = useMemo(() => {
    if (!userGrowthData) return { labels: [], datasets: [] };

    return {
      labels: userGrowthData.labels || [],
      datasets: [
        {
          label: 'Cumulative Users',
          data: userGrowthData.cumulative || [],
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [userGrowthData]);

  const moderationChartData = useMemo(() => {
    if (!moderationData) return { labels: [], datasets: [] };

    return {
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [
        {
          data: [
            moderationData.pending || 0,
            moderationData.approved || 0,
            moderationData.rejected || 0,
          ],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [moderationData]);

  // Generate CSV data
  const csvData = useMemo(() => {
    const data = [
      ['Metric', 'Value', 'Date'],
      ...((dailyActiveUsers?.daily || []).map((value: number, index: number) => [
        'Daily Active Users',
        value,
        format(subDays(new Date(), 6 - index), 'yyyy-MM-dd'),
      ])),
      ...((newPostsData?.daily || []).map((value: number, index: number) => [
        'New Posts',
        value,
        format(subDays(new Date(), 29 - index), 'yyyy-MM-dd'),
      ])),
      ['Banned Users', bannedUsersData?.total || 0, format(new Date(), 'yyyy-MM-dd')],
      ['Pending Moderation', moderationData?.pending || 0, format(new Date(), 'yyyy-MM-dd')],
    ];
    return data;
  }, [dailyActiveUsers, newPostsData, bannedUsersData, moderationData]);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  return (
    <div className={`space-y-6 ${printMode ? 'print-mode' : ''}`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .chart-container { break-inside: avoid; }
          body { font-size: 12px; }
          .grid { break-inside: avoid; }
        }
      `}</style>

      <div className="no-print">
        <InsightsHeader
          csvData={csvData}
          csvFilename={`brandscaling-insights-${format(new Date(), 'yyyy-MM-dd')}.csv`}
          onPrint={handlePrint}
        />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <InsightCard
          title="Daily Active Users (7d avg)"
          value={dailyActiveUsers?.average || 0}
          change={`${dailyActiveUsers?.change > 0 ? '+' : ''}${dailyActiveUsers?.change || 0}% vs last week`}
          changeType={dailyActiveUsers?.change > 0 ? 'positive' : dailyActiveUsers?.change < 0 ? 'negative' : 'neutral'}
          icon={Users}
          iconColor="text-blue-600 bg-blue-100"
          description="Average daily active users over the last 7 days"
        />

        <InsightCard
          title="New Posts (30d)"
          value={newPostsData?.total || 0}
          change={`${newPostsData?.change > 0 ? '+' : ''}${newPostsData?.change || 0}% vs last month`}
          changeType={newPostsData?.change > 0 ? 'positive' : newPostsData?.change < 0 ? 'negative' : 'neutral'}
          icon={FileText}
          iconColor="text-green-600 bg-green-100"
          description="Total new posts created in the last 30 days"
        />

        <InsightCard
          title="Total Users"
          value={userGrowthData?.total || 0}
          change={`${userGrowthData?.growth > 0 ? '+' : ''}${userGrowthData?.growth || 0}% growth`}
          changeType={userGrowthData?.growth > 0 ? 'positive' : 'neutral'}
          icon={TrendingUp}
          iconColor="text-purple-600 bg-purple-100"
          description="Cumulative user growth over time"
        />

        <InsightCard
          title="Banned Users"
          value={bannedUsersData?.total || 0}
          change={`${bannedUsersData?.recent || 0} this week`}
          changeType="neutral"
          icon={Shield}
          iconColor="text-red-600 bg-red-100"
          description="Total number of banned user accounts"
        />

        <InsightCard
          title="Pending Moderation"
          value={moderationData?.pending || 0}
          change={`${moderationData?.trend > 0 ? '+' : ''}${moderationData?.trend || 0} today`}
          changeType={moderationData?.trend > 0 ? 'negative' : moderationData?.trend < 0 ? 'positive' : 'neutral'}
          icon={AlertTriangle}
          iconColor="text-orange-600 bg-orange-100"
          description="Posts awaiting moderation review"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard
          title="Daily Active Users"
          value="Last 7 Days"
          icon={Activity}
          iconColor="text-blue-600 bg-blue-100"
          description="Daily active user trend"
        >
          <InsightChart type="line" data={dauChartData} height={250} />
        </InsightCard>

        <InsightCard
          title="New Posts Created"
          value="Last 30 Days"
          icon={FileText}
          iconColor="text-green-600 bg-green-100"
          description="Daily post creation volume"
        >
          <InsightChart type="bar" data={postsChartData} height={250} />
        </InsightCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard
          title="User Growth Curve"
          value="Cumulative Growth"
          icon={TrendingUp}
          iconColor="text-purple-600 bg-purple-100"
          description="Total registered users over time"
        >
          <InsightChart type="line" data={growthChartData} height={250} />
        </InsightCard>

        <InsightCard
          title="Moderation Overview"
          value="Current Status"
          icon={Shield}
          iconColor="text-orange-600 bg-orange-100"
          description="Content moderation breakdown"
        >
          <InsightChart type="doughnut" data={moderationChartData} height={250} />
        </InsightCard>
      </div>
    </div>
  );
}