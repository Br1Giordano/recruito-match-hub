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
  initialConversationId?: string | null;
}

export const MessageCenter: React.FC<MessageCenterProps> = ({ isOpen, onClose, initialConversationId }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId || null);
  const { conversations, messages, isLoading, sendMessage, fetchMessages } = useMessages();

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    fetchMessages(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  // Auto-select initial conversation and fetch its messages
  React.useEffect(() => {
    if (initialConversationId && conversations.some(c => c.id === initialConversationId)) {
      setSelectedConversationId(initialConversationId);
      fetchMessages(initialConversationId);
    }
  }, [initialConversationId, conversations, fetchMessages]);

  const totalUnread = conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Centro Messaggi
            {totalUnread > 0 && (
              <Badge variant="default" className="bg-primary text-primary-foreground">
                {totalUnread} non lett{totalUnread === 1 ? 'o' : 'i'}
              </Badge>
            )}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedConversationId ? 'Conversazione in corso' : `${conversations.length} conversazion${conversations.length !== 1 ? 'i' : 'e'} totali`}
          </p>
        </DialogHeader>
        
        <div className="flex h-[calc(85vh-120px)] bg-muted/20">
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