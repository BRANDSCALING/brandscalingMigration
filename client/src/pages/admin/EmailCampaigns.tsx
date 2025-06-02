import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Send, Eye, Users, Clock } from "lucide-react";
import { format } from "date-fns";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  created_by_admin_uid: string;
  created_at: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface EmailLog {
  id: number;
  template_id: number;
  sent_by_admin_uid: string;
  recipient_email: string;
  recipient_name: string;
  status: string;
  sent_at: string;
  template_name?: string;
}

export default function EmailCampaigns() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch email templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/email-templates"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/email-templates");
      return response.json();
    },
  });

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/leads/campaigns"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/leads/campaigns");
      return response.json();
    },
  });

  // Fetch email campaign logs
  const { data: emailLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ["/api/email-campaign-logs"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/email-campaign-logs");
      return response.json();
    },
  });

  // Send campaign mutation
  const sendCampaignMutation = useMutation({
    mutationFn: async (data: { templateId: string; leadIds: number[] }) => {
      const response = await apiRequest("POST", "/api/email/send-campaign", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-campaign-logs"] });
      setSelectedTemplate("");
      setSelectedLeads([]);
      toast({
        title: "Campaign Sent",
        description: `Successfully sent ${data.successful} emails. ${data.failed || 0} failed.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Campaign Failed",
        description: error.message || "Failed to send campaign",
        variant: "destructive",
      });
    },
  });

  const handleLeadSelection = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(leads.map((lead: Lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSendCampaign = () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select an email template",
        variant: "destructive",
      });
      return;
    }

    if (selectedLeads.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one recipient",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Send campaign to ${selectedLeads.length} recipient(s)?`)) {
      sendCampaignMutation.mutate({
        templateId: selectedTemplate,
        leadIds: selectedLeads,
      });
    }
  };

  const getSelectedTemplate = () => {
    return templates.find((t: EmailTemplate) => t.id.toString() === selectedTemplate);
  };

  const renderPreview = () => {
    const template = getSelectedTemplate();
    if (!template) return <p className="text-gray-500">Select a template to see preview</p>;

    const sampleLead = selectedLeads.length > 0 
      ? leads.find((l: Lead) => l.id === selectedLeads[0])
      : { name: "Sample Name", email: "sample@example.com" };

    const previewSubject = template.subject
      .replace(/\{\{name\}\}/g, sampleLead?.name || "Sample Name")
      .replace(/\{\{email\}\}/g, sampleLead?.email || "sample@example.com");
    
    const previewBody = template.body
      .replace(/\{\{name\}\}/g, sampleLead?.name || "Sample Name")
      .replace(/\{\{email\}\}/g, sampleLead?.email || "sample@example.com");

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Subject Preview:</Label>
          <p className="p-2 bg-gray-50 rounded border">{previewSubject}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Body Preview:</Label>
          <div 
            className="p-4 bg-white border rounded min-h-[200px] max-h-[400px] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: previewBody }}
          />
        </div>
      </div>
    );
  };

  if (templatesLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
        <p className="text-gray-600 mt-1">Send manual campaigns and track email automation</p>
      </div>

      {/* Campaign Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Campaign Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Compose Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Selection */}
            <div>
              <Label htmlFor="template">Select Email Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template: EmailTemplate) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lead Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Select Recipients ({selectedLeads.length} selected)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {previewMode ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>
              
              {leads.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No leads available. Add leads first to send campaigns.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border rounded">
                  <div className="p-3 border-b bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedLeads.length === leads.length}
                        onCheckedChange={handleSelectAllLeads}
                      />
                      <Label className="text-sm font-medium">Select All ({leads.length})</Label>
                    </div>
                  </div>
                  {leads.map((lead: Lead) => (
                    <div key={lead.id} className="p-3 border-b flex items-center space-x-2">
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={(checked) => handleLeadSelection(lead.id, !!checked)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendCampaign}
              disabled={!selectedTemplate || selectedLeads.length === 0 || sendCampaignMutation.isPending}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {sendCampaignMutation.isPending 
                ? `Sending to ${selectedLeads.length} recipient(s)...` 
                : `Send Campaign to ${selectedLeads.length} recipient(s)`
              }
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Preview */}
        {previewMode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Email Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderPreview()}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Email Campaign Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recent Email Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : emailLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No email activity yet. Send your first campaign to see logs here.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailLogs.map((log: EmailLog) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.recipient_name}</p>
                        <p className="text-sm text-gray-500">{log.recipient_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.template_name || `Template #${log.template_id}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'sent' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.sent_by_admin_uid === 'system' ? (
                        <Badge variant="secondary">Automated</Badge>
                      ) : (
                        <Badge variant="outline">Manual</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(log.sent_at), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}