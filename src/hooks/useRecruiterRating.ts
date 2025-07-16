import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecruiterRating {
  averageRating: number;
  totalReviews: number;
}

// Cache globale per evitare fetch multipli
const ratingCache = new Map<string, { rating: RecruiterRating; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

export const useRecruiterRating = () => {
  const [rating, setRating] = useState<RecruiterRating>({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef<Set<string>>(new Set());

  const fetchRatingByEmail = useCallback(async (email: string) => {
    if (!email) {
      console.log('No email provided for rating');
      return { averageRating: 0, totalReviews: 0 };
    }

    // Controlla la cache
    const cached = ratingCache.get(email);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached rating for:', email);
      setRating(cached.rating);
      return cached.rating;
    }

    // Evita fetch multipli simultanei per la stessa email
    if (fetchingRef.current.has(email)) {
      console.log('Already fetching rating for:', email);
      return { averageRating: 0, totalReviews: 0 };
    }

    fetchingRef.current.add(email);
    setLoading(true);
    console.log('Fetching recruiter rating for email:', email);
    
    try {
      const { data, error } = await supabase
        .from('recruiter_reviews')
        .select('rating')
        .eq('recruiter_email', email);

      if (error) {
        console.error('Error fetching recruiter rating:', error);
        const defaultRating = { averageRating: 0, totalReviews: 0 };
        ratingCache.set(email, { rating: defaultRating, timestamp: Date.now() });
        setRating(defaultRating);
        return defaultRating;
      }

      if (!data || data.length === 0) {
        console.log('No reviews found for recruiter:', email);
        const defaultRating = { averageRating: 0, totalReviews: 0 };
        ratingCache.set(email, { rating: defaultRating, timestamp: Date.now() });
        setRating(defaultRating);
        return defaultRating;
      }

      const totalReviews = data.length;
      const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      const ratingResult = {
        averageRating: Math.round(averageRating * 10) / 10, // Arrotonda a 1 decimale
        totalReviews
      };

      console.log('Rating calculated:', ratingResult);
      
      // Salva nella cache
      ratingCache.set(email, { rating: ratingResult, timestamp: Date.now() });
      setRating(ratingResult);
      return ratingResult;
    } catch (error) {
      console.error('Unexpected error in fetchRatingByEmail:', error);
      const defaultRating = { averageRating: 0, totalReviews: 0 };
      ratingCache.set(email, { rating: defaultRating, timestamp: Date.now() });
      setRating(defaultRating);
      return defaultRating;
    } finally {
      setLoading(false);
      fetchingRef.current.delete(email);
    }
  }, []);

  return {
    rating,
    loading,
    fetchRatingByEmail
  };
};