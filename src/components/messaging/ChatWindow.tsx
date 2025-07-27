import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send, Building2, User } from 'lucide-react';
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

  const otherPartyName = conversation.other_party_name?.split('@')[0] || 'Utente';
  const isRecruiterConversation = conversation.recruiter_email === conversation.other_party_name;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-secondary text-xs">
              {otherPartyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
            {isRecruiterConversation ? (
              <User className="h-3 w-3 text-primary" />
            ) : (
              <Building2 className="h-3 w-3 text-primary" />
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-sm">{otherPartyName}</h3>
          {conversation.proposal_title && (
            <p className="text-xs text-muted-foreground">
              {conversation.proposal_title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              Inizia una conversazione inviando un messaggio
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_email === user?.email;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.message_content}</p>
                    </div>
                    <p
                      className={`text-xs text-muted-foreground mt-1 ${
                        isOwnMessage ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                        locale: it
                      })}
                      {message.read_at && isOwnMessage && (
                        <span className="ml-1">✓</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrivi un messaggio..."
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || isSending}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};