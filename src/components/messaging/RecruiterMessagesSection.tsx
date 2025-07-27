import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, User, Building2, Clock, ChevronRight } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChatWindow } from './ChatWindow';

export const RecruiterMessagesSection: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, messages, isLoading, sendMessage, fetchMessages } = useMessages();

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    fetchMessages(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (selectedConversationId && selectedConversation) {
    return (
      <div className="space-y-6">
        <ChatWindow
          conversation={selectedConversation}
          messages={messages[selectedConversationId] || []}
          onSendMessage={(content) => sendMessage(selectedConversationId, content)}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nessun messaggio</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              I messaggi che ricevi dalle aziende interessate ai tuoi candidati appariranno qui. 
              Le aziende possono contattarti dopo aver ricevuto le tue proposte.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">I tuoi Messaggi</h2>
          <p className="text-muted-foreground">
            Messaggi ricevuti dalle aziende organizzati per proposta
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {conversations.length} conversazion{conversations.length !== 1 ? 'i' : 'e'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {conversations.map((conversation) => {
          const isUnread = (conversation.unread_count || 0) > 0;
          const companyInitials = conversation.company_email
            ?.split('@')[0]
            .slice(0, 2)
            .toUpperCase() || 'AZ';

          return (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isUnread 
                  ? 'border-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-sm' 
                  : 'hover:border-primary/30'
              }`}
              onClick={() => handleSelectConversation(conversation.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold ${
                        isUnread 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-muted bg-muted text-muted-foreground'
                      }`}>
                        {companyInitials}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-primary/20">
                        <Building2 className="h-3 w-3 text-primary" />
                      </div>
                      {isUnread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium truncate ${
                          isUnread ? 'text-foreground font-semibold' : 'text-foreground'
                        }`}>
                          {conversation.company_email?.split('@')[0] || 'Azienda'}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(conversation.last_message_at), {
                                addSuffix: true,
                                locale: it
                              })}
                            </span>
                          </div>
                          {isUnread && (
                            <Badge variant="default" className="h-5 px-2 text-xs bg-primary text-primary-foreground">
                              {conversation.unread_count! > 9 ? '9+' : conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {conversation.proposal_title && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal border-primary/20">
                            📋 {conversation.proposal_title}
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground">
                        Conversazione riguardo la proposta per{' '}
                        <span className="font-medium text-foreground">
                          {conversation.proposal_title || 'il candidato'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};