import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Plus, Mail } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: number;
  name: string;
  email: string;
  created_by_admin_uid: string;
  created_at: string;
}

export default function Leads() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["/api/leads"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/leads");
      return response.json();
    },
  });

  // Add lead mutation
  const addLeadMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await apiRequest("POST", "/api/leads/add", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setName("");
      setEmail("");
      toast({
        title: "Lead Added",
        description: "Lead has been added successfully and welcome email sent.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add lead",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please enter both name and email",
        variant: "destructive",
      });
      return;
    }

    addLeadMutation.mutate({ name: name.trim(), email: email.trim() });
  };

  if (isLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
        <p className="text-gray-600 mt-1">Manage your leads and send automated welcome emails</p>
      </div>

      {/* Add Lead Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Add New Lead
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter lead's name"
                  disabled={addLeadMutation.isPending}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter lead's email"
                  disabled={addLeadMutation.isPending}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={addLeadMutation.isPending || !name.trim() || !email.trim()}
              className="w-full md:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              {addLeadMutation.isPending ? "Adding Lead..." : "Add Lead & Send Welcome Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            All Leads ({leads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No leads found. Add your first lead above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Added By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead: Lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      {lead.created_at ? format(new Date(lead.created_at), 'MMM d, yyyy HH:mm') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {lead.created_by_admin_uid.substring(0, 8)}...
                      </span>
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