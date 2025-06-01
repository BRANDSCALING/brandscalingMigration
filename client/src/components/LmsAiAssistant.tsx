import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LmsAiAssistantProps {
  moduleId: number;
  moduleTitle: string;
  userMode: 'architect' | 'alchemist';
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function LmsAiAssistant({ 
  moduleId, 
  moduleTitle, 
  userMode, 
  isOpen = false, 
  onToggle 
}: LmsAiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(!isOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message when module changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Hi! I'm your ${userMode === 'architect' ? 'Architect' : 'Alchemist'} AI assistant for "${moduleTitle}". I'm here to help you understand the content, answer questions, and guide you through the ${userMode === 'architect' ? 'structured implementation steps' : 'creative exploration process'}. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [moduleId, moduleTitle, userMode, isOpen, messages.length]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/lms/ai-assistant', {
        moduleId,
        moduleTitle,
        userMode,
        message,
        conversationHistory: messages.slice(-10), // Last 10 messages for context
      });
      return response;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue using the AI assistant.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    sendMessageMutation.mutate(inputMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2 border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className={`h-5 w-5 ${userMode === 'architect' ? 'text-purple-600' : 'text-orange-500'}`} />
              <CardTitle className="text-lg">
                {userMode === 'architect' ? 'Architect' : 'Alchemist'} AI Assistant
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={userMode === 'architect' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}
              >
                {moduleTitle}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    userMode === 'architect' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <Bot className={`h-4 w-4 ${userMode === 'architect' ? 'text-purple-600' : 'text-orange-500'}`} />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : userMode === 'architect'
                      ? 'bg-white border border-purple-200'
                      : 'bg-white border border-orange-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  userMode === 'architect' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <Loader2 className={`h-4 w-4 animate-spin ${userMode === 'architect' ? 'text-purple-600' : 'text-orange-500'}`} />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-500">AI is thinking...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask your ${userMode} assistant anything...`}
                disabled={sendMessageMutation.isPending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                className={`${
                  userMode === 'architect'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("Explain this module's key concepts")}
                disabled={sendMessageMutation.isPending}
              >
                Key Concepts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("What should I do next?")}
                disabled={sendMessageMutation.isPending}
              >
                Next Steps
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage("Give me a practical example")}
                disabled={sendMessageMutation.isPending}
              >
                Example
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}