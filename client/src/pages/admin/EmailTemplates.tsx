import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmailTemplates() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    type: "marketing",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/admin/email-templates"],
  });

  // Create template
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: typeof newTemplate) => {
      const response = await apiRequest("POST", "/api/admin/email-templates", templateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      setIsCreateOpen(false);
      setNewTemplate({ name: "", subject: "", body: "", type: "marketing" });
      toast({ title: "Email template created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create template", variant: "destructive" });
    },
  });

  // Update template
  const updateTemplateMutation = useMutation({
    mutationFn: async (template: EmailTemplate) => {
      const response = await apiRequest("PUT", `/api/admin/email-templates/${template.id}`, template);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      setEditingTemplate(null);
      toast({ title: "Template updated successfully" });
    },
  });

  // Delete template
  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      await apiRequest("DELETE", `/api/admin/email-templates/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "Template deleted successfully" });
    },
  });

  // Toggle template status
  const toggleStatusMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await apiRequest("PUT", `/api/admin/email-templates/${templateId}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "Template status updated" });
    },
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "marketing": return "bg-blue-100 text-blue-800";
      case "transactional": return "bg-green-100 text-green-800";
      case "notification": return "bg-yellow-100 text-yellow-800";
      case "welcome": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Template Name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
              <Input
                placeholder="Email Subject"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
              />
              <Select 
                value={newTemplate.type} 
                onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Template Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Email Body (HTML supported)"
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                rows={8}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => createTemplateMutation.mutate(newTemplate)}
                  disabled={createTemplateMutation.isPending}
                >
                  Create Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates List */}
      <div className="grid gap-4">
        {templates.map((template: EmailTemplate) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type}
                    </Badge>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Subject: {template.subject}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {formatDate(template.createdAt)} | 
                    Updated: {formatDate(template.updatedAt)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatusMutation.mutate(template.id)}
                  >
                    {template.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTemplateMutation.mutate(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {template.body.replace(/<[^>]*>/g, "")}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center py-8">No email templates found</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Template Dialog */}
      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Email Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Template Name"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
              />
              <Input
                placeholder="Email Subject"
                value={editingTemplate.subject}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
              />
              <Select 
                value={editingTemplate.type} 
                onValueChange={(value) => setEditingTemplate({ ...editingTemplate, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Template Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Email Body (HTML supported)"
                value={editingTemplate.body}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                rows={8}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => updateTemplateMutation.mutate(editingTemplate)}
                  disabled={updateTemplateMutation.isPending}
                >
                  Update Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}