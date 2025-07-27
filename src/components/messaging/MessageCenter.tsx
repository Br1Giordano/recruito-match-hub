import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { useMessages } from '@/hooks/useMessages';

interface MessageCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageCenter: React.FC<MessageCenterProps> = ({ isOpen, onClose }) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            Messaggi
            {conversations.length > 0 && (
              <Badge variant="secondary">
                {conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0)} non letti
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[500px]">
          {!selectedConversationId ? (
            <div className="w-full">
              <ConversationList
                conversations={conversations}
                isLoading={isLoading}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col">
              <ChatWindow
                conversation={selectedConversation!}
                messages={messages[selectedConversationId] || []}
                onSendMessage={(content) => sendMessage(selectedConversationId, content)}
                onBack={handleBackToList}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};