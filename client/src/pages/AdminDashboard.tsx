import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Settings, 
  FileText, 
  GraduationCap, 
  Bot, 
  Workflow, 
  CreditCard, 
  Activity,
  Edit,
  Save,
  Plus,
  Search
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
  profileImageUrl?: string;
}

interface Course {
  id: number;
  title: string;
  description?: string;
  track: string;
  isPublished: boolean;
  modules: any;
  createdAt: string;
}

interface AiAgent {
  id: number;
  name: string;
  description?: string;
  systemPrompt: string;
  isActive: boolean;
}

interface StripeOrder {
  id: string;
  customerEmail: string;
  amount: number;
  product: string;
  createdAt: string;
  status: string;
}

export default function AdminDashboard() {
  const { userProfile, isAdmin, loading } = useFirebaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = '/';
    }
  }, [loading, isAdmin]);

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: isAdmin,
  });

  // Fetch courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/admin/courses'],
    enabled: isAdmin,
  });

  // Fetch AI agents
  const { data: aiAgents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/admin/ai-agents'],
    enabled: isAdmin,
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiRequest('PATCH', `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      return apiRequest('POST', '/api/admin/courses', courseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({
        title: "Success",
        description: "Course created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    },
  });

  // Update AI agent mutation
  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return apiRequest('PATCH', `/api/admin/ai-agents/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-agents'] });
      toast({
        title: "Success",
        description: "AI agent updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update AI agent",
        variant: "destructive",
      });
    },
  });

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-architect-indigo mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your brandscaling platform</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="ai-agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all platform users</CardDescription>
                <div className="flex gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="mastermind">Mastermind</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            {user.firstName || user.lastName 
                              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              user.role === 'admin' ? 'default' :
                              user.role === 'mastermind' ? 'secondary' :
                              user.role === 'buyer' ? 'outline' : 'destructive'
                            }>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={user.role}
                              onValueChange={(newRole) => 
                                updateUserRoleMutation.mutate({ userId: user.id, role: newRole })
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="guest">Guest</SelectItem>
                                <SelectItem value="buyer">Buyer</SelectItem>
                                <SelectItem value="mastermind">Mastermind</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Editor Tab */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Page Editor</CardTitle>
                <CardDescription>Edit content for main pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">Homepage</CardTitle>
                        <CardDescription>Edit hero section and main content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Homepage
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">About Page</CardTitle>
                        <CardDescription>Edit about us content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit About
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">Blog</CardTitle>
                        <CardDescription>Manage blog posts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Manage Blog
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>Manage learning content for both tracks</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course: Course) => (
                      <Card key={course.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <Badge variant={course.track === 'architect' ? 'default' : 'secondary'}>
                              {course.track}
                            </Badge>
                          </div>
                          <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <Badge variant={course.isPublished ? 'default' : 'outline'}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                            <Button size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="ai-agents">
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Prompt Manager</CardTitle>
                <CardDescription>Configure AI agents for different specialties</CardDescription>
              </CardHeader>
              <CardContent>
                {agentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {aiAgents.map((agent: AiAgent) => (
                      <Card key={agent.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <Switch
                              checked={agent.isActive}
                              onCheckedChange={(checked) =>
                                updateAgentMutation.mutate({ id: agent.id, isActive: checked })
                              }
                            />
                          </div>
                          <CardDescription>{agent.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor={`prompt-${agent.id}`}>System Prompt</Label>
                            <Textarea
                              id={`prompt-${agent.id}`}
                              value={agent.systemPrompt}
                              onChange={(e) => {
                                // Update local state - you might want to implement debounced saving
                              }}
                              rows={6}
                              className="mt-2"
                            />
                          </div>
                          <Button
                            onClick={() =>
                              updateAgentMutation.mutate({
                                id: agent.id,
                                systemPrompt: agent.systemPrompt
                              })
                            }
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Prompt
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Builder</CardTitle>
                <CardDescription>Create automated workflows for user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Workflow builder coming soon</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Order History</CardTitle>
                <CardDescription>View payment history and customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Connect Stripe to view order history</p>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Stripe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent platform events and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Activity tracking coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}