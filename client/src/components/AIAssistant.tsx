import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Brain,
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function AIAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);

  const { data: aiAgents } = useQuery({
    queryKey: ["/api/ai-agents"],
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    },
  });

  const chatMutation = useMutation({
    mutationFn: async ({ agentId, message }: { agentId: number; message: string }) => {
      const response = await apiRequest("POST", `/api/ai-agents/${agentId}/chat`, { message });
      return response.json();
    },
    onSuccess: (data) => {
      setConversation(prev => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: new Date().toISOString() }
      ]);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || !aiAgents?.[0]) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage("");

    chatMutation.mutate({
      agentId: aiAgents[0].id,
      message: message.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* AI Assistant Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="text-white w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Brand Advisor</CardTitle>
              <p className="text-xs text-slate-600 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Powered by GPT-4</span>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 mb-4">
            Get personalized insights about your brand strategy and growth opportunities.
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Start Conversation
                <MessageSquare className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Brain className="text-white w-4 h-4" />
                  </div>
                  <span>AI Brand Advisor</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    GPT-4
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4 border rounded-lg mb-4">
                  {conversation.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                      <h3 className="font-medium text-slate-900 mb-2">
                        Welcome to your AI Brand Advisor!
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        I'm here to help you with brand strategy, positioning, marketing insights, and growth opportunities.
                      </p>
                      <div className="text-left space-y-2 text-xs text-slate-500">
                        <p>💡 Ask me about your brand positioning</p>
                        <p>📊 Get marketing strategy recommendations</p>
                        <p>🎯 Discuss your target audience</p>
                        <p>🚀 Explore growth opportunities</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === "user"
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-900"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            {msg.timestamp && (
                              <p className={`text-xs mt-1 ${
                                msg.role === "user" ? "text-blue-100" : "text-slate-500"
                              }`}>
                                {formatTime(msg.timestamp)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {chatMutation.isPending && (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 rounded-lg p-3 flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-slate-600">AI is thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask me about your brand strategy..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={2}
                    className="flex-1 resize-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || chatMutation.isPending}
                    className="self-end"
                  >
                    {chatMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
}
