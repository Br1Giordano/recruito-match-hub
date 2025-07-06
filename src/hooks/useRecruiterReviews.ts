
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

interface CreateReviewData {
  recruiterEmail: string;
  proposalId: string;
  rating: number;
  reviewText?: string;
}

export const useRecruiterReviews = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createReview = async (reviewData: CreateReviewData) => {
    if (!user?.email) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per lasciare una recensione",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('recruiter_reviews')
        .insert({
          recruiter_email: reviewData.recruiterEmail,
          company_email: user.email,
          rating: reviewData.rating,
          review_text: reviewData.reviewText,
          proposal_id: reviewData.proposalId
        });

      if (error) {
        console.error('Error creating review:', error);
        toast({
          title: "Errore",
          description: "Impossibile salvare la recensione",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Successo",
        description: "Recensione salvata con successo",
      });
      return true;

    } catch (error) {
      console.error('Unexpected error creating review:', error);
      toast({
        title: "Errore",
        description: "Errore imprevisto durante il salvataggio",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId: string, rating: number, reviewText?: string) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('recruiter_reviews')
        .update({
          rating,
          review_text: reviewText,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) {
        console.error('Error updating review:', error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare la recensione",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Successo",
        description: "Recensione aggiornata con successo",
      });
      return true;

    } catch (error) {
      console.error('Unexpected error updating review:', error);
      toast({
        title: "Errore",
        description: "Errore imprevisto durante l'aggiornamento",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createReview,
    updateReview,
    loading
  };
};
