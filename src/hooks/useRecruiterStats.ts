
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecruiterStats {
  totalProposals: number;
  interestedProposals: number;
  approvedProposals: number;
  averageRating: number;
  totalReviews: number;
}

interface RecruiterReview {
  id: string;
  company_email: string;
  rating: number;
  review_text?: string;
  created_at: string;
  proposal_id: string;
}

export const useRecruiterStats = () => {
  const [stats, setStats] = useState<RecruiterStats | null>(null);
  const [reviews, setReviews] = useState<RecruiterReview[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecruiterStats = async (recruiterEmail: string) => {
    if (!recruiterEmail) return;
    
    setLoading(true);
    console.log('Fetching stats for recruiter:', recruiterEmail);

    try {
      // Fetch proposal statistics
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select('status')
        .eq('recruiter_email', recruiterEmail);

      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError);
        return;
      }

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('recruiter_reviews' as any)
        .select('*')
        .eq('recruiter_email', recruiterEmail)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      }

      // Calculate statistics
      const totalProposals = proposalsData?.length || 0;
      const interestedProposals = proposalsData?.filter(p => p.status === 'under_review').length || 0;
      const approvedProposals = proposalsData?.filter(p => p.status === 'approved' || p.status === 'hired').length || 0;
      
      const totalReviews = reviewsData?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews 
        : 0;

      setStats({
        totalProposals,
        interestedProposals,
        approvedProposals,
        averageRating,
        totalReviews
      });

      setReviews(reviewsData || []);
      
    } catch (error) {
      console.error('Error fetching recruiter stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    reviews,
    loading,
    fetchRecruiterStats
  };
};
