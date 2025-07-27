import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Building2, User, Clock } from 'lucide-react';
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
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-muted-foreground/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
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
        <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mb-6">
          <MessageCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-3">Nessuna conversazione</h3>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          Le tue conversazioni con recruiter e aziende appariranno qui quando inizierai a chattare
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-1">
        {conversations.map((conversation) => {
          const isUnread = (conversation.unread_count || 0) > 0;
          const displayName = conversation.other_party_name || 'Utente';
          const otherPartyInitials = displayName.includes('@') 
            ? displayName.split('@')[0].slice(0, 2).toUpperCase()
            : displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'XX';
          
          return (
            <Card
              key={conversation.id}
              className={`cursor-pointer transition-all duration-200 border-muted-foreground/10 hover:border-primary/20 hover:shadow-md ${
                isUnread ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted/30'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className={`h-12 w-12 border-2 ${
                      conversation.recruiter_email.includes('@') && 
                      conversation.other_party_name === conversation.recruiter_email
                        ? isUnread ? 'border-green-300' : 'border-green-200'
                        : isUnread ? 'border-blue-300' : 'border-blue-200'
                    }`}>
                      <AvatarFallback className={`font-semibold ${
                        conversation.recruiter_email.includes('@') && 
                        conversation.other_party_name === conversation.recruiter_email
                          ? isUnread ? 'bg-green-50 text-green-600' : 'bg-green-50 text-green-500'
                          : isUnread ? 'bg-blue-50 text-blue-600' : 'bg-blue-50 text-blue-500'
                      }`}>
                        {otherPartyInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 bg-background rounded-full p-1 border ${
                      conversation.recruiter_email.includes('@') && 
                      conversation.other_party_name === conversation.recruiter_email
                        ? 'border-green-200'
                        : 'border-blue-200'
                    }`}>
                      {conversation.recruiter_email.includes('@') && 
                       conversation.other_party_name === conversation.recruiter_email ? (
                        <User className="h-3 w-3 text-green-600" />
                      ) : (
                        <Building2 className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${
                          conversation.recruiter_email.includes('@') && 
                          conversation.other_party_name === conversation.recruiter_email
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {conversation.recruiter_email.includes('@') && 
                           conversation.other_party_name === conversation.recruiter_email ? (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              Recruiter
                            </>
                          ) : (
                            <>
                              <Building2 className="h-3 w-3 mr-1" />
                              Azienda
                            </>
                          )}
                        </Badge>
                        <p className={`text-sm font-medium truncate ${
                          isUnread ? 'text-foreground font-semibold' : 'text-foreground'
                        }`}>
                          {displayName.includes('@') ? displayName.split('@')[0] : displayName}
                        </p>
                      </div>
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
                          <Badge variant="default" className="h-6 w-6 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground">
                            {conversation.unread_count! > 9 ? '9+' : conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {conversation.proposal_title && (
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant="outline" className="text-xs px-2 py-0 font-normal">
                          {conversation.proposal_title}
                        </Badge>
                      </div>
                    )}
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