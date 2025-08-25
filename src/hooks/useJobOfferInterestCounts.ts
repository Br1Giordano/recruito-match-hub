import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface JobOfferInterestCount {
  job_offer_id: string;
  interested_recruiters_count: number;
}

export const useJobOfferInterestCounts = (jobOfferIds: string[]) => {
  const [interestCounts, setInterestCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const fetchInterestCounts = async () => {
    if (jobOfferIds.length === 0) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_offer_interest_counts')
        .select('job_offer_id, interested_recruiters_count')
        .in('job_offer_id', jobOfferIds);

      if (error) {
        console.error('Error fetching interest counts:', error);
        return;
      }

      // Convert array to object for easier lookup
      const countsMap: Record<string, number> = {};
      data?.forEach((item: JobOfferInterestCount) => {
        countsMap[item.job_offer_id] = item.interested_recruiters_count;
      });

      setInterestCounts(countsMap);
    } catch (error) {
      console.error('Error fetching interest counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterestCounts();
  }, [jobOfferIds.join(',')]);

  // Set up real-time subscription for interest changes
  useEffect(() => {
    if (jobOfferIds.length === 0) return;

    const channel = supabase
      .channel('recruiter-job-interests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recruiter_job_interests',
          filter: `job_offer_id=in.(${jobOfferIds.join(',')})`
        },
        () => {
          // Refetch counts when interests change
          fetchInterestCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobOfferIds.join(',')]);

  const getInterestCount = (jobOfferId: string): number => {
    return interestCounts[jobOfferId] || 0;
  };

  return {
    interestCounts,
    loading,
    getInterestCount,
    refetch: fetchInterestCounts
  };
};