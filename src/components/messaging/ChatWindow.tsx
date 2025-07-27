import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Building2, User, CheckCheck, Clock } from 'lucide-react';
import { Conversation, Message } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => Promise<boolean>;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const success = await onSendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const otherPartyEmail = conversation.company_email || conversation.recruiter_email;
  const otherPartyName = conversation.other_party_name || otherPartyEmail?.split('@')[0] || 'Utente';
  const isCompanyConversation = conversation.company_email && user?.email === conversation.recruiter_email;
  const userType = isCompanyConversation ? 'company' : 'recruiter';

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header migliorato */}
      <div className="flex items-center gap-4 p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-background/80 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="relative">
          <Avatar className={`h-10 w-10 border-2 ${
            userType === 'company' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'
          }`}>
            <AvatarFallback className={`font-semibold ${
              userType === 'company' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
            }`}>
              {otherPartyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 bg-background rounded-full p-1 border ${
            userType === 'company' ? 'border-blue-200' : 'border-green-200'
          }`}>
            {userType === 'company' ? (
              <Building2 className="h-3 w-3 text-blue-600" />
            ) : (
              <User className="h-3 w-3 text-green-600" />
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${
              userType === 'company' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {userType === 'company' ? (
                <>
                  <Building2 className="h-3 w-3 mr-1" />
                  Azienda
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Recruiter
                </>
              )}
            </Badge>
            <h3 className="font-semibold text-foreground">{otherPartyName}</h3>
          </div>
          {conversation.proposal_title && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs px-2 py-0 border-primary/20">
                📋 {conversation.proposal_title}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Messages con design migliorato */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8" />
              </div>
              <p className="font-medium text-lg mb-2">Inizia la conversazione</p>
              <p className="text-sm">Scrivi il primo messaggio per iniziare a chattare</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender_email === user?.email;
              const showTimestamp = index === 0 || 
                new Date(messages[index - 1].created_at).getTime() - new Date(message.created_at).getTime() > 300000; // 5 minuti
              
              return (
                <div key={message.id} className="space-y-1">
                  {showTimestamp && (
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: it
                        })}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-3 shadow-sm ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md ml-8'
                          : 'bg-muted text-foreground rounded-2xl rounded-tl-md mr-8'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message_content}</p>
                      <div className={`flex items-center gap-2 mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex items-center gap-1">
                          <Clock className={`h-3 w-3 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`} />
                          <span
                            className={`text-xs ${
                              isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString('it-IT', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {isOwnMessage && message.read_at && (
                          <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area migliorata */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-gradient-to-r from-muted/30 to-muted/20 backdrop-blur-sm">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi un messaggio..."
              className="min-h-[44px] max-h-[120px] resize-none bg-background border-muted-foreground/20 focus:border-primary transition-all duration-200 rounded-xl"
              disabled={isSending}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || isSending}
            className="h-[44px] w-[44px] p-0 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Premi <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Invio</kbd> per inviare • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Shift+Invio</kbd> per andare a capo
        </p>
      </form>
    </div>
  );
};