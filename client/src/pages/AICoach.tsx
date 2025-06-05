import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Send, Bot, User, Brain, Lightbulb, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AICoach() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: userDnaResult } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  const { data: conversationHistory } = useQuery({
    queryKey: ['/api/ai/conversation'],
    enabled: !!user,
  });

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; dnaType: string }) => {
      return apiRequest('POST', '/api/ai/chat', data);
    },
    onSuccess: (response) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + '_assistant',
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (conversationHistory?.messages) {
      setMessages(conversationHistory.messages);
    }
  }, [conversationHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading AI Coach...</p>
        </div>
      </div>
    );
  }

  const dominantType = userDnaResult?.userDnaResult?.dominantType || 'Undeclared';

  const handleSendMessage = () => {
    if (!message.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    chatMutation.mutate({
      message: message,
      dnaType: dominantType
    });

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getDnaIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'architect': return <Brain className="h-4 w-4" />;
      case 'alchemist': return <Lightbulb className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getDnaColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'architect': return 'bg-blue-600';
      case 'alchemist': return 'bg-red-500';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Coach
          </h1>
          <p className="text-gray-600">
            Personalized guidance tailored to your {dominantType} DNA
          </p>
        </div>

        {/* DNA Profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${getDnaColor(dominantType)}`}></div>
              Your Coaching Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">DNA Type</p>
                <div className="flex items-center gap-2">
                  {getDnaIcon(dominantType)}
                  <span className="font-semibold">{dominantType}</span>
                </div>
              </div>
              
              {dominantType === 'Undeclared' && (
                <Button 
                  size="sm" 
                  onClick={() => setLocation('/quiz')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Complete DNA Assessment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Brandscaling AI Coach
            </CardTitle>
            <p className="text-sm text-gray-600">
              Ask questions about scaling your business using your {dominantType} strengths
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Ask me anything about scaling your business as an {dominantType}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {[
                      "How do I scale my team effectively?",
                      "What's the best approach for my DNA type?",
                      "How do I overcome scaling challenges?",
                      "What should I focus on next?"
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessage(suggestion)}
                        className="text-left justify-start"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white ml-12'
                          : 'bg-gray-100 text-gray-900 mr-12'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {chatMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 mr-12">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask your ${dominantType} AI coach anything...`}
                disabled={chatMutation.isPending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || chatMutation.isPending}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coaching Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Coaching Tips for {dominantType}s</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dominantType === 'Architect' ? (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Leverage Your Systems Thinking</h4>
                    <p className="text-blue-800 text-sm">
                      Use your natural ability to create structured processes and scalable frameworks
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Focus on Data-Driven Decisions</h4>
                    <p className="text-blue-800 text-sm">
                      Trust your analytical skills to make informed scaling decisions
                    </p>
                  </div>
                </>
              ) : dominantType === 'Alchemist' ? (
                <>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Trust Your Intuition</h4>
                    <p className="text-red-800 text-sm">
                      Your creative insights and transformational vision are your superpowers
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Embrace Experimentation</h4>
                    <p className="text-red-800 text-sm">
                      Use rapid prototyping and iterative approaches to test new ideas
                    </p>
                  </div>
                </>
              ) : (
                <div className="col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-yellow-800">
                    Complete your DNA assessment to unlock personalized coaching tips
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}