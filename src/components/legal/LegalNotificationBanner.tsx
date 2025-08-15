import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Info } from "lucide-react";
import { useGDPRCompliance } from "@/hooks/useGDPRCompliance";

export const LegalNotificationBanner = () => {
  const { notifications, markNotificationAsRead } = useGDPRCompliance();
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);

  const activeNotifications = notifications.filter(
    notification => 
      !notification.is_read && 
      !dismissedNotifications.includes(notification.id) &&
      (!notification.expires_at || new Date(notification.expires_at) > new Date())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'high':
        return 'border-orange-200 bg-orange-50 text-orange-900';
      case 'medium':
        return 'border-blue-200 bg-blue-50 text-blue-900';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-900';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const handleDismiss = async (notificationId: string) => {
    setDismissedNotifications(prev => [...prev, notificationId]);
    await markNotificationAsRead(notificationId);
  };

  if (activeNotifications.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {activeNotifications.map((notification) => (
        <Alert key={notification.id} className={getPriorityColor(notification.priority)}>
          <div className="flex items-start gap-2">
            {getPriorityIcon(notification.priority)}
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <AlertDescription className="mt-1">
                {notification.message}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(notification.id)}
              className="h-6 w-6 p-0 hover:bg-white/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};