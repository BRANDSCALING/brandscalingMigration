import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Mail, Filter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  source: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Leads() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch leads with filters
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["/api/admin/leads", filterStatus, filterSource],
  });

  // Delete lead
  const deleteLeadMutation = useMutation({
    mutationFn: async (leadId: number) => {
      await apiRequest("DELETE", `/api/admin/leads/${leadId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({ title: "Lead deleted successfully" });
    },
  });

  // Export leads
  const exportLeadsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/admin/leads/export");
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Leads exported successfully" });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "converted": return "bg-green-100 text-green-800";
      case "unqualified": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "website": return "bg-purple-100 text-purple-800";
      case "social": return "bg-blue-100 text-blue-800";
      case "referral": return "bg-green-100 text-green-800";
      case "advertising": return "bg-orange-100 text-orange-800";
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

  const getDisplayName = (lead: Lead) => {
    if (lead.firstName || lead.lastName) {
      return `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
    }
    return lead.email;
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
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <Button onClick={() => exportLeadsMutation.mutate()}>
          <Download className="w-4 h-4 mr-2" />
          Export Leads
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="advertising">Advertising</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="grid gap-4">
        {leads.map((lead: Lead) => (
          <Card key={lead.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getDisplayName(lead).charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{getDisplayName(lead)}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    <Badge className={getSourceColor(lead.source)}>
                      {lead.source}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Created: {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteLeadMutation.mutate(lead.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leads.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center py-8">No leads found</p>
          </CardContent>
        </Card>
      )}

      {/* Lead Details Dialog */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lead Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-gray-600">{getDisplayName(selectedLead)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-gray-600">{selectedLead.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge className={getStatusColor(selectedLead.status)}>
                  {selectedLead.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Source</label>
                <Badge className={getSourceColor(selectedLead.source)}>
                  {selectedLead.source}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Created</label>
                <p className="text-sm text-gray-600">{formatDate(selectedLead.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Last Updated</label>
                <p className="text-sm text-gray-600">{formatDate(selectedLead.updatedAt)}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}