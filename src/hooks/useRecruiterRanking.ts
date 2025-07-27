import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecruiterRankingInfo {
  rank: number | null;
  total_recruiters: number;
  ranking_label: string | null;
}

export const useRecruiterRanking = (recruiterEmail: string | undefined) => {
  const [rankingInfo, setRankingInfo] = useState<RecruiterRankingInfo>({
    rank: null,
    total_recruiters: 0,
    ranking_label: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recruiterEmail) return;

    const fetchRanking = async () => {
      setLoading(true);
      try {
        // Fetch leaderboard data similar to useRecruiterGamification
        const { data: leaderboard, error } = await supabase
          .from('recruiter_stats')
          .select(`
            recruiter_email,
            total_points,
            level,
            total_proposals,
            accepted_proposals
          `)
          .order('total_points', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching leaderboard:', error);
          return;
        }

        if (!leaderboard || leaderboard.length === 0) {
          setRankingInfo({
            rank: null,
            total_recruiters: 0,
            ranking_label: null
          });
          return;
        }

        // Find the recruiter's position in the leaderboard
        const recruiterIndex = leaderboard.findIndex(
          (entry) => entry.recruiter_email === recruiterEmail
        );

        const rank = recruiterIndex !== -1 ? recruiterIndex + 1 : null;
        const totalRecruiters = leaderboard.length;

        // Determine ranking label
        let rankingLabel = null;
        if (rank !== null) {
          if (rank <= 5) {
            rankingLabel = 'Top 5';
          } else if (rank <= 10) {
            rankingLabel = 'Top 10';
          } else if (rank <= 25) {
            rankingLabel = 'Top 25';
          }
        }

        setRankingInfo({
          rank,
          total_recruiters: totalRecruiters,
          ranking_label: rankingLabel
        });

      } catch (error) {
        console.error('Error fetching recruiter ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [recruiterEmail]);

  return { rankingInfo, loading };
};