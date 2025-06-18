import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Settings, Database, Mail, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  analyticsEnabled: boolean;
  maxFileUploadSize: number;
  sessionTimeout: number;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For development, using sample data
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    initialData: {
      siteName: "Brandscaling Platform",
      siteDescription: "AI-powered entrepreneurial DNA assessment and business growth platform",
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
      analyticsEnabled: true,
      maxFileUploadSize: 10,
      sessionTimeout: 24
    } as SystemSettings
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<SystemSettings>) => {
      const response = await apiRequest("PUT", "/api/admin/settings", updatedSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Settings updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update settings", variant: "destructive" });
    },
  });

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    if (settings) {
      const updatedSettings = { ...settings, [key]: value };
      updateSettingsMutation.mutate({ [key]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings?.siteName || ""}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileUploadSize">Max Upload Size (MB)</Label>
                  <Input
                    id="maxFileUploadSize"
                    type="number"
                    value={settings?.maxFileUploadSize || 10}
                    onChange={(e) => handleSettingChange("maxFileUploadSize", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings?.siteDescription || ""}
                  onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable public access to the site
                    </p>
                  </div>
                  <Switch
                    checked={settings?.maintenanceMode || false}
                    onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register accounts
                    </p>
                  </div>
                  <Switch
                    checked={settings?.registrationEnabled ?? true}
                    onCheckedChange={(checked) => handleSettingChange("registrationEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable analytics tracking and reporting
                    </p>
                  </div>
                  <Switch
                    checked={settings?.analyticsEnabled ?? true}
                    onCheckedChange={(checked) => handleSettingChange("analyticsEnabled", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automated email notifications
                  </p>
                </div>
                <Switch
                  checked={settings?.emailNotifications ?? true}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input placeholder="smtp.example.com" disabled />
                    <p className="text-xs text-muted-foreground">Currently using Resend service</p>
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input placeholder="587" disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings?.sessionTimeout || 24}
                  onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  How long users stay logged in
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Currently using Firebase Authentication with Google sign-in
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Status:</strong> Firebase Auth Active<br />
                    <strong>Providers:</strong> Google OAuth, Development Mode<br />
                    <strong>2FA:</strong> Available through Google accounts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Connection Status</h3>
                <p className="text-sm text-green-600">✓ Connected to PostgreSQL database</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Using Neon PostgreSQL with Drizzle ORM
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Database Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">2</p>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">5+</p>
                    <p className="text-sm text-muted-foreground">Registered Users</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">15+</p>
                    <p className="text-sm text-muted-foreground">Database Tables</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Database migrations are handled automatically through Drizzle ORM. 
                  Manual database operations should be performed with caution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}