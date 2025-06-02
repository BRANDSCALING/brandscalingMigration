import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Mail, Calendar, User, Send } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: number;
  name: string;
  email: string;
  addedByAdmin: string;
  createdAt: Date | null;
  lastEmailSent?: Date;
  lastEmailSentBy?: string;
}

const emailTemplates = {
  "taster_reminder": {
    subject: "Don't Miss Out - Your Brandscaling Opportunity Awaits",
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Ready to Scale Your Brand?</h1>
            <h2 style="margin: 10px 0 0 0; font-weight: normal; font-size: 18px;">Limited Time Opportunity</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hi there,</p>
            
            <p>You've shown interest in scaling your brand, and we don't want you to miss this opportunity.</p>
            
            <p>Our proven Brandscaling method has helped countless entrepreneurs build profitable, scalable businesses. The strategies we share are battle-tested and results-driven.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">What You'll Get:</h3>
              <ul style="margin-bottom: 0;">
                <li>Proven scaling strategies</li>
                <li>Access to our exclusive community</li>
                <li>Direct mentorship opportunities</li>
                <li>Real-world case studies</li>
              </ul>
            </div>
            
            <p>Don't let this opportunity pass you by. Your competitors are already scaling - make sure you stay ahead.</p>
            
            <p>Ready to take action?</p>
            
            <p>Best regards,<br><strong>The Brandscaling Team</strong></p>
          </div>
          
          <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Limited time opportunity - Act now</p>
          </div>
        </body>
      </html>
    `
  },
  "mastermind_invite": {
    subject: "Exclusive Invitation: Join Our Elite Brandscaling Mastermind",
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">You're Invited! 🎯</h1>
            <h2 style="margin: 10px 0 0 0; font-weight: normal; font-size: 18px;">Elite Brandscaling Mastermind</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p style="font-size: 18px; margin-bottom: 20px;">Congratulations,</p>
            
            <p>You've been personally selected to join our exclusive Brandscaling Mastermind - a private group of ambitious entrepreneurs who are serious about building million-pound businesses.</p>
            
            <p>This isn't for everyone. We only invite those who demonstrate real commitment to growth and have the potential to implement our advanced strategies.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">Inside the Mastermind:</h3>
              <ul style="margin-bottom: 0;">
                <li>Weekly strategy sessions with our founders</li>
                <li>Direct access to million-pound business blueprints</li>
                <li>Peer connections with other high-level entrepreneurs</li>
                <li>Monthly live Q&A and hot seat coaching</li>
                <li>Exclusive case studies and advanced training</li>
              </ul>
            </div>
            
            <p>This is your opportunity to accelerate your business growth and connect with like-minded entrepreneurs who are playing at the highest level.</p>
            
            <p>Spaces are extremely limited and by invitation only.</p>
            
            <p>Are you ready to join the elite?</p>
            
            <p>Best regards,<br><strong>The Brandscaling Team</strong></p>
          </div>
          
          <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Exclusive invitation - Limited spaces available</p>
          </div>
        </body>
      </html>
    `
  }
};

export default function EmailCampaigns() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["/api/leads/campaigns"],
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (emailData: { leadId: number; subject: string; body: string; template: string }) => {
      return apiRequest("POST", "/api/email/campaign", emailData);
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Campaign email sent successfully and logged.",
      });
      setIsModalOpen(false);
      setSelectedLead(null);
      setSubject("");
      setBody("");
      setSelectedTemplate("");
      queryClient.invalidateQueries({ queryKey: ["/api/leads/campaigns"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Email",
        description: error.message || "An error occurred while sending the email.",
        variant: "destructive",
      });
    },
  });

  const handleSendEmail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    if (template && emailTemplates[template as keyof typeof emailTemplates]) {
      const templateData = emailTemplates[template as keyof typeof emailTemplates];
      setSubject(templateData.subject);
      setBody(templateData.body);
    }
  };

  const handleSubmitEmail = () => {
    if (!selectedLead || !subject || !body) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    sendEmailMutation.mutate({
      leadId: selectedLead.id,
      subject,
      body,
      template: selectedTemplate
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Email Campaigns</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Campaigns</h1>
          <p className="text-muted-foreground">Send targeted emails to your leads</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {leads.length} Total Leads
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Lead Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Last Email</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead: Lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy") : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.lastEmailSent ? (
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(lead.lastEmailSent), "MMM d, yyyy")}
                        </div>
                      ) : (
                        <Badge variant="outline">No emails sent</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.lastEmailSentBy ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          {lead.lastEmailSentBy.substring(0, 8)}...
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSendEmail(lead)}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Email
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Send Email to {selectedLead?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taster_reminder">Taster Reminder</SelectItem>
                  <SelectItem value="mastermind_invite">Mastermind Invite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email Body (HTML)</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter email body (HTML supported)"
                className="mt-1 min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitEmail}
                disabled={sendEmailMutation.isPending || !subject || !body}
                className="flex items-center gap-2"
              >
                {sendEmailMutation.isPending ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}