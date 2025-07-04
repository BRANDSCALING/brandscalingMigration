import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, Search, FileText, Download, CheckCircle2, Clock, Eye } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminSevenDayReset = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Fetch all users' 7-day reset progress
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['/api/admin/seven-day-reset/all-progress'],
  });

  // Mock data for now until backend is implemented
  const mockProgressData = [
    {
      userId: 'user-1',
      email: 'hav@sitefindr.co.uk',
      firstName: 'Hav',
      lastName: 'User',
      completedDays: [1, 2, 3],
      startedDays: [1, 2, 3, 4],
      totalDays: 7,
      lastActivity: '2025-01-03T10:30:00Z',
      responses: {
        day1: [
          "The structured half felt restrictive but produced clearer results. The intuitive half was more energizing but less focused.",
          "Time passed faster during the intuitive half.",
          "I felt more alive during the structured portions, surprisingly."
        ],
        day2: [
          "My most effortless success was launching my first product with minimal planning.",
          "Natural decisions involved trusting my gut over extensive analysis.",
          "A rhythm of burst creativity followed by systematic execution worked best."
        ],
        day3: [
          "The planned approach felt safer but less innovative.",
          "I had more energy during improvisational execution.",
          "The improvised result felt more authentically 'me'."
        ]
      }
    },
    {
      userId: 'user-2',
      email: 'reshma@sitefindr.co.uk',
      firstName: 'Reshma',
      lastName: 'User',
      completedDays: [1, 2, 3, 4, 5, 6, 7],
      startedDays: [1, 2, 3, 4, 5, 6, 7],
      totalDays: 7,
      lastActivity: '2025-01-02T14:15:00Z',
      identityContract: "From this moment on, I commit to building and leading as an Alchemist because my greatest breakthroughs come from trusting intuition over analysis.",
      responses: {
        day1: [
          "The flow state energized me completely while structure felt draining.",
          "Time disappeared during the intuitive half.",
          "Freedom made me feel most alive and authentic."
        ],
        day7: [
          "I lived in a blurred, over-analytical default that drained my energy.",
          "My business would feel effortless and naturally magnetic.",
          "I need regular intuition check-ins and creative space to stay aligned."
        ]
      }
    },
    {
      userId: 'user-3',
      email: 'james@brandscaling.com',
      firstName: 'James',
      lastName: 'User',
      completedDays: [1],
      startedDays: [1, 2],
      totalDays: 7,
      lastActivity: '2025-01-01T09:45:00Z',
      responses: {
        day1: [
          "Structure gave me clarity and momentum, while intuition felt chaotic.",
          "Time was manageable and productive during structured work.",
          "I felt most alive when following a clear plan and system."
        ]
      }
    }
  ];

  const filteredData = mockProgressData.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressPercentage = (completedDays: number[], totalDays: number) => {
    return Math.round((completedDays.length / totalDays) * 100);
  };

  const getStatusBadge = (completedDays: number[], startedDays: number[]) => {
    if (completedDays.length === 7) {
      return <Badge className="bg-green-500">Completed</Badge>;
    } else if (startedDays.length > completedDays.length) {
      return <Badge className="bg-yellow-500">In Progress</Badge>;
    } else if (completedDays.length > 0) {
      return <Badge className="bg-blue-500">Partially Complete</Badge>;
    } else {
      return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const UserDetailDialog = ({ user }: { user: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user.firstName} {user.lastName} - 7-Day Reset Progress</DialogTitle>
          <DialogDescription>
            Email: {user.email} | Progress: {user.completedDays.length}/7 days completed
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{user.completedDays.length}</div>
                  <div className="text-sm text-gray-600">Days Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.startedDays.length - user.completedDays.length}</div>
                  <div className="text-sm text-gray-600">Days Started</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{7 - user.startedDays.length}</div>
                  <div className="text-sm text-gray-600">Days Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{getProgressPercentage(user.completedDays, 7)}%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity Contract (if completed) */}
          {user.identityContract && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Identity Contract</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="italic text-green-800">"{user.identityContract}"</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Day by Day Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(user.responses).map(([day, responses]: [string, any]) => (
                  <div key={day} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 capitalize">
                      {day.replace('day', 'Day ')}
                      {user.completedDays.includes(parseInt(day.replace('day', ''))) ? 
                        <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-500" /> :
                        <Clock className="w-4 h-4 inline ml-2 text-yellow-500" />
                      }
                    </h4>
                    <div className="space-y-2">
                      {responses.map((response: string, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-purple-300">
                          <p className="text-sm text-gray-700">{response}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading 7-Day Reset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">7-Day Identity Reset Progress</h1>
          <p className="text-gray-600">Monitor and manage user progress through the identity reset program</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProgressData.length}</div>
            <p className="text-xs text-muted-foreground">Users enrolled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Programs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProgressData.filter(u => u.completedDays.length === 7).length}
            </div>
            <p className="text-xs text-muted-foreground">100% completion rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProgressData.filter(u => u.startedDays.length > 0 && u.completedDays.length < 7).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockProgressData.reduce((acc, user) => acc + user.completedDays.length, 0) / mockProgressData.length * 100 / 7)}%
            </div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Progress</CardTitle>
          <CardDescription>View detailed progress for each user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {getStatusBadge(user.completedDays, user.startedDays)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getProgressPercentage(user.completedDays, user.totalDays)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {user.completedDays.length}/{user.totalDays}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(user.lastActivity).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <UserDetailDialog user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSevenDayReset;