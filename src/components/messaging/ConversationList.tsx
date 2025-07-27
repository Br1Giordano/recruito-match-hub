import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Building2, User } from 'lucide-react';
import { Conversation } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  onSelectConversation
}) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nessuna conversazione</h3>
        <p className="text-muted-foreground text-sm">
          Le tue conversazioni con recruiter e aziende appariranno qui
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {conversations.map((conversation) => {
          const isUnread = (conversation.unread_count || 0) > 0;
          const otherPartyInitials = conversation.other_party_name
            ?.split('@')[0]
            .slice(0, 2)
            .toUpperCase() || 'XX';
          
          return (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                isUnread ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary">
                        {otherPartyInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                      {conversation.recruiter_email.includes('@') && 
                       conversation.other_party_name === conversation.recruiter_email ? (
                        <User className="h-3 w-3 text-primary" />
                      ) : (
                        <Building2 className="h-3 w-3 text-primary" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium truncate ${
                        isUnread ? 'text-primary' : ''
                      }`}>
                        {conversation.other_party_name?.split('@')[0] || 'Utente'}
                      </p>
                      {isUnread && (
                        <Badge variant="default" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    
                    {conversation.proposal_title && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conversation.proposal_title}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(conversation.last_message_at), {
                        addSuffix: true,
                        locale: it
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};