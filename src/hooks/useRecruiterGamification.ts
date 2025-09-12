import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned_at?: string;
}

export interface RecruiterStats {
  id: string;
  recruiter_email: string;
  total_points: number;
  level: number;
  total_proposals: number;
  accepted_proposals: number;
  current_streak: number;
  best_streak: number;
  last_proposal_date?: string;
}

export interface LeaderboardEntry {
  recruiter_email: string;
  recruiter_name?: string;
  total_points: number;
  level: number;
  total_proposals: number;
  accepted_proposals: number;
  acceptance_rate: number;
}

export const useRecruiterGamification = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<RecruiterStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBadges = async () => {
    if (!user?.email) return;

    try {
      // Fetch all badges with earned status
      const { data: allBadges, error: badgesError } = await supabase
        .from('recruiter_badges')
        .select('*')
        .order('points', { ascending: true });

      if (badgesError) throw badgesError;

      // Fetch user's achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('recruiter_achievements')
        .select('badge_id, earned_at')
        .eq('recruiter_email', user.email);

      if (achievementsError) throw achievementsError;

      // Merge badges with earned status
      const achievementMap = new Map(achievements?.map(a => [a.badge_id, a.earned_at]) || []);
      
      const badgesWithStatus = allBadges?.map(badge => ({
        ...badge,
        rarity: badge.rarity as 'common' | 'rare' | 'epic' | 'legendary',
        earned_at: achievementMap.get(badge.id)
      })) || [];

      setBadges(badgesWithStatus);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchStats = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('recruiter_stats')
        .select('*')
        .eq('recruiter_email', user.email)
        .maybeSingle();

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data: leaderboardData, error } = await supabase
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

      if (error) throw error;

      // Fetch recruiter names for leaderboard
      const emails = leaderboardData?.map(entry => entry.recruiter_email) || [];
      const { data: recruiters } = await supabase
        .from('recruiter_registrations')
        .select('email, nome, cognome')
        .in('email', emails);

      const recruitersMap = new Map(
        recruiters?.map(r => [r.email, `${r.nome} ${r.cognome}`]) || []
      );

      const enrichedLeaderboard = (leaderboardData?.map(entry => ({
        ...entry,
        recruiter_name: recruitersMap.get(entry.recruiter_email),
        acceptance_rate: entry.total_proposals > 0 
          ? Math.round((entry.accepted_proposals / entry.total_proposals) * 100)
          : 0
      })) || []).filter(entry => recruitersMap.has(entry.recruiter_email));

      setLeaderboard(enrichedLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const refreshGamificationData = async () => {
    if (!user?.email) return;

    // Trigger stats update for current user
    try {
      await supabase.rpc('update_recruiter_stats', {
        recruiter_email_param: user.email
      });
      
      await supabase.rpc('check_and_award_badges', {
        recruiter_email_param: user.email
      });

      // Refresh data
      await Promise.all([fetchBadges(), fetchStats(), fetchLeaderboard()]);
    } catch (error) {
      console.error('Error refreshing gamification data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBadges(), fetchStats(), fetchLeaderboard()]);
      setLoading(false);
    };

    if (user?.email) {
      loadData();
    }
  }, [user?.email]);

  return {
    badges,
    stats,
    leaderboard,
    loading,
    refreshGamificationData
  };
};