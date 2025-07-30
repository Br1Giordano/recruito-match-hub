import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';

interface MessageIconProps {
  onClick: () => void;
  hasNotification?: boolean;
}

export const MessageIcon: React.FC<MessageIconProps> = ({ onClick, hasNotification }) => {
  const { unreadCount } = useMessages();

  const showIndicator = unreadCount > 0 || hasNotification;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative"
    >
      <MessageCircle className="h-5 w-5" />
      {showIndicator && (
        <Badge
          variant="default"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-green-500 text-white animate-pulse"
        >
          {unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : '!'}
        </Badge>
      )}
    </Button>
  );
};