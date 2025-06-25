import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Lightbulb, 
  Send, 
  MessageCircle, 
  Sparkles,
  ArrowLeft,
  User,
  Bot
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType: 'architect' | 'alchemist';
}

export default function AIAgents() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeAgent, setActiveAgent] = useState<'architect' | 'alchemist'>('architect');
  const [message, setMessage] = useState('');
  const [architectMessages, setArchitectMessages] = useState<Message[]>([]);
  const [alchemistMessages, setAlchemistMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: userDnaResult } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  // Get separate conversation histories for each agent
  const { data: architectHistory } = useQuery({
    queryKey: ['/api/ai-conversations/architect'],
    enabled: !!user,
  });

  const { data: alchemistHistory } = useQuery({
    queryKey: ['/api/ai-conversations/alchemist'],
    enabled: !!user,
  });

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; agentType: 'architect' | 'alchemist' }) => {
      const response = await fetch('/api/ai-agents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (response) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        agentType: activeAgent
      };
      setMessages(prev => [...prev, newMessage]);
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        agentType: activeAgent
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  // Remove authentication requirement for AI agents
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     setLocation('/');
  //   }
  // }, [user, authLoading, setLocation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversationHistory) {
      setMessages(conversationHistory.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        agentType: msg.dnaType
      })));
    }
  }, [conversationHistory]);

  useEffect(() => {
    // Set default agent based on user's DNA type
    if (userDnaResult?.userDnaResult?.dominantType) {
      const dominantType = userDnaResult.userDnaResult.dominantType.toLowerCase();
      if (dominantType === 'architect' || dominantType === 'alchemist') {
        setActiveAgent(dominantType);
      }
    }
  }, [userDnaResult]);

  // Remove authentication requirement - allow access without login

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
      agentType: activeAgent
    };

    setMessages(prev => [...prev, userMessage]);
    
    chatMutation.mutate({
      message: trimmedMessage,
      agentType: activeAgent
    });
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const dominantType = userDnaResult?.userDnaResult?.dominantType || 'Architect';

  const getAgentColor = (type: 'architect' | 'alchemist') => {
    return type === 'architect' ? 'bg-blue-600' : 'bg-red-500';
  };

  const getAgentIcon = (type: 'architect' | 'alchemist') => {
    return type === 'architect' ? <Brain className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Business Advisors
              </h1>
              <p className="text-gray-600 mb-4">
                Get personalized guidance from AI agents trained on your entrepreneurial DNA
              </p>
              
              {dominantType !== 'Undeclared' && (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getAgentColor(dominantType.toLowerCase() as any)}`}></div>
                  <span className="text-sm text-gray-600">
                    Recommended: The AI {dominantType} (matches your DNA)
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <Badge variant="outline">AI-Powered</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Choose Your Advisor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Architect Agent */}
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    activeAgent === 'architect' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveAgent('architect')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">The AI Architect</h3>
                      <p className="text-sm text-gray-600">Precise • Calm • Strategic</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Performance protocols & structured routines</li>
                    <li>• Cognitive optimization frameworks</li>
                    <li>• Purpose alignment structures</li>
                  </ul>
                  {dominantType.toLowerCase() === 'architect' && (
                    <Badge variant="default" className="mt-2 text-xs">
                      Your DNA Match
                    </Badge>
                  )}
                </div>

                {/* Alchemist Agent */}
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    activeAgent === 'alchemist' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveAgent('alchemist')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">The AI Alchemist</h3>
                      <p className="text-sm text-gray-600">Intuitive • Present • Transformational</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Flow-state mastery & energy optimization</li>
                    <li>• Creative manifestation systems</li>
                    <li>• Authenticity-first scaling methods</li>
                  </ul>
                  {dominantType.toLowerCase() === 'alchemist' && (
                    <Badge variant="default" className="mt-2 text-xs">
                      Your DNA Match
                    </Badge>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Switch between agents anytime to get different perspectives on your challenges
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className={`border-b ${getAgentColor(activeAgent)} text-white`}>
                <CardTitle className="flex items-center gap-2">
                  {getAgentIcon(activeAgent)}
                  The AI {activeAgent.charAt(0).toUpperCase() + activeAgent.slice(1)}
                  <Badge variant="secondary" className="ml-auto">
                    AI Powered by n8n
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className={`w-16 h-16 ${getAgentColor(activeAgent)} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                        {getAgentIcon(activeAgent)}
                      </div>
                      <h3 className="font-semibold mb-2">
                        Welcome to The AI {activeAgent.charAt(0).toUpperCase() + activeAgent.slice(1)}
                      </h3>
                      <p className="text-gray-600 text-sm max-w-md mx-auto">
                        {activeAgent === 'architect' 
                          ? "I help you build systematic frameworks and strategic approaches to scale your business with precision and structure."
                          : "I guide you through intuitive insights and creative transformations to unlock your authentic scaling potential."
                        }
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Ask me anything about your business, strategy, or growth challenges.
                      </p>
                    </div>
                  )}
                  
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className={`w-8 h-8 ${getAgentColor(activeAgent)} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {chatMutation.isPending && (
                    <div className="flex gap-3 justify-start">
                      <div className={`w-8 h-8 ${getAgentColor(activeAgent)} rounded-full flex items-center justify-center text-white`}>
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="border-t-2 border-architect-indigo/20 p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex gap-3">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Ask The ${activeAgent === 'architect' ? 'Architect' : 'Alchemist'} anything...`}
                    disabled={chatMutation.isPending}
                    className="flex-1 h-12 text-body border-2 border-gray-300 focus:border-architect-indigo"
                    autoFocus
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || chatMutation.isPending}
                    className={`h-12 px-6 ${activeAgent === 'architect' ? 'btn-architect' : 'btn-alchemist'}`}
                    type="button"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}