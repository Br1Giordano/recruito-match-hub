import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useRealTimeNotifications = () => {
  const { user } = useAuth();
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [hasNewReviews, setHasNewReviews] = useState(false);

  const clearMessageNotifications = () => {
    setHasNewMessages(false);
  };

  const clearReviewNotifications = () => {
    setHasNewReviews(false);
  };

  useEffect(() => {
    if (!user?.email) return;

    // Subscription for new messages
    const messagesChannel = supabase
      .channel('notifications-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Only show notification if the message is not from the current user
          if (newMessage.sender_email !== user.email) {
            setHasNewMessages(true);
            toast({
              title: "Nuovo messaggio",
              description: `Hai ricevuto un nuovo messaggio da ${newMessage.sender_type === 'company' ? 'un\'azienda' : 'un recruiter'}`,
            });
          }
        }
      )
      .subscribe();

    // Subscription for new reviews (for recruiters)
    const reviewsChannel = supabase
      .channel('notifications-reviews')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recruiter_reviews'
        },
        (payload) => {
          const newReview = payload.new as any;
          
          // Only show notification if the review is for the current user
          if (newReview.recruiter_email === user.email) {
            setHasNewReviews(true);
            toast({
              title: "Nuova recensione",
              description: `Hai ricevuto una nuova recensione con ${newReview.rating} stelle!`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, [user?.email]);

  return {
    hasNewMessages,
    hasNewReviews,
    clearMessageNotifications,
    clearReviewNotifications
  };
};