-- Create gamification tables for recruiters

-- Table for badge definitions
CREATE TABLE public.recruiter_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50) NOT NULL, -- lucide icon name
  category VARCHAR(50) NOT NULL, -- 'performance', 'activity', 'quality', 'milestone'
  requirement_type VARCHAR(50) NOT NULL, -- 'proposals_count', 'acceptance_rate', 'rating', 'streak'
  requirement_value INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  rarity VARCHAR(20) NOT NULL DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for recruiter achievements
CREATE TABLE public.recruiter_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_email VARCHAR(255) NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.recruiter_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress INTEGER DEFAULT 0,
  UNIQUE(recruiter_email, badge_id)
);

-- Table for recruiter stats and levels
CREATE TABLE public.recruiter_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_email VARCHAR(255) NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  total_proposals INTEGER NOT NULL DEFAULT 0,
  accepted_proposals INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_proposal_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recruiter_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges" 
ON public.recruiter_badges 
FOR SELECT 
USING (true);

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" 
ON public.recruiter_achievements 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage achievements" 
ON public.recruiter_achievements 
FOR ALL 
USING (false);

-- RLS Policies for stats
CREATE POLICY "Anyone can view recruiter stats" 
ON public.recruiter_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Recruiters can view their own stats" 
ON public.recruiter_stats 
FOR SELECT 
USING (recruiter_email = (auth.jwt() ->> 'email'));

CREATE POLICY "System can manage stats" 
ON public.recruiter_stats 
FOR ALL 
USING (false);

-- Insert default badges
INSERT INTO public.recruiter_badges (name, description, icon, category, requirement_type, requirement_value, points, rarity) VALUES
('First Steps', 'Invia la tua prima proposta', 'Target', 'milestone', 'proposals_count', 1, 10, 'common'),
('Getting Started', 'Invia 5 proposte', 'Send', 'activity', 'proposals_count', 5, 25, 'common'),
('Active Recruiter', 'Invia 25 proposte', 'Zap', 'activity', 'proposals_count', 25, 100, 'rare'),
('Expert Recruiter', 'Invia 100 proposte', 'Crown', 'activity', 'proposals_count', 100, 500, 'epic'),
('Recruitment Master', 'Invia 500 proposte', 'Trophy', 'activity', 'proposals_count', 500, 2000, 'legendary'),

('Good Start', 'Ottieni il 25% di accettazione', 'CheckCircle', 'performance', 'acceptance_rate', 25, 50, 'common'),
('Solid Performance', 'Ottieni il 50% di accettazione', 'Award', 'performance', 'acceptance_rate', 50, 150, 'rare'),
('Top Performer', 'Ottieni il 75% di accettazione', 'Star', 'performance', 'acceptance_rate', 75, 400, 'epic'),
('Elite Recruiter', 'Ottieni il 90% di accettazione', 'Gem', 'performance', 'acceptance_rate', 90, 1000, 'legendary'),

('Quality Focus', 'Ottieni rating medio di 4.0', 'Heart', 'quality', 'rating', 4, 100, 'common'),
('Excellent Service', 'Ottieni rating medio di 4.5', 'Sparkles', 'quality', 'rating', 5, 300, 'rare'), -- 4.5 stored as 5 (multiplied by 10)
('Outstanding', 'Ottieni rating medio di 5.0', 'Diamond', 'quality', 'rating', 10, 750, 'epic'), -- 5.0 stored as 10

('Consistent', 'Mantieni uno streak di 5 proposte', 'Flame', 'activity', 'streak', 5, 75, 'common'),
('On Fire', 'Mantieni uno streak di 15 proposte', 'FireExtinguisher', 'activity', 'streak', 15, 200, 'rare'),
('Unstoppable', 'Mantieni uno streak di 30 proposte', 'Rocket', 'activity', 'streak', 30, 500, 'epic');

-- Function to calculate level from points
CREATE OR REPLACE FUNCTION public.calculate_level_from_points(total_points INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Level formula: sqrt(points / 100) + 1
  -- Level 1: 0-99 points
  -- Level 2: 100-399 points  
  -- Level 3: 400-899 points
  -- Level 4: 900-1599 points
  -- etc.
  RETURN FLOOR(SQRT(total_points / 100.0)) + 1;
END;
$$;

-- Function to update recruiter stats
CREATE OR REPLACE FUNCTION public.update_recruiter_stats(recruiter_email_param VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  stats_record RECORD;
  total_props INTEGER;
  accepted_props INTEGER;
  avg_rating NUMERIC;
  streak INTEGER := 0;
  last_prop_date TIMESTAMP WITH TIME ZONE;
  current_points INTEGER := 0;
  new_level INTEGER;
BEGIN
  -- Get proposal statistics
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status IN ('accepted', 'approved')) as accepted,
    MAX(created_at) as last_date
  INTO total_props, accepted_props, last_prop_date
  FROM public.proposals 
  WHERE recruiter_email = recruiter_email_param;

  -- Get average rating
  SELECT AVG(rating) INTO avg_rating
  FROM public.recruiter_reviews 
  WHERE recruiter_email = recruiter_email_param;

  -- Calculate current streak (consecutive days with proposals)
  WITH daily_proposals AS (
    SELECT DATE(created_at) as proposal_date
    FROM public.proposals 
    WHERE recruiter_email = recruiter_email_param
    ORDER BY created_at DESC
  ),
  consecutive_days AS (
    SELECT 
      proposal_date,
      ROW_NUMBER() OVER (ORDER BY proposal_date DESC) as rn,
      proposal_date - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY proposal_date DESC) - 1) as expected_date
    FROM daily_proposals
  )
  SELECT COUNT(*) INTO streak
  FROM consecutive_days
  WHERE proposal_date = expected_date;

  -- Calculate points from achievements
  SELECT COALESCE(SUM(rb.points), 0) INTO current_points
  FROM public.recruiter_achievements ra
  JOIN public.recruiter_badges rb ON ra.badge_id = rb.id
  WHERE ra.recruiter_email = recruiter_email_param;

  -- Calculate level
  new_level := public.calculate_level_from_points(current_points);

  -- Insert or update stats
  INSERT INTO public.recruiter_stats (
    recruiter_email, total_points, level, total_proposals, 
    accepted_proposals, current_streak, best_streak, last_proposal_date
  ) VALUES (
    recruiter_email_param, current_points, new_level, COALESCE(total_props, 0),
    COALESCE(accepted_props, 0), COALESCE(streak, 0), COALESCE(streak, 0), last_prop_date
  )
  ON CONFLICT (recruiter_email) 
  DO UPDATE SET
    total_points = EXCLUDED.total_points,
    level = EXCLUDED.level,
    total_proposals = EXCLUDED.total_proposals,
    accepted_proposals = EXCLUDED.accepted_proposals,
    current_streak = EXCLUDED.current_streak,
    best_streak = GREATEST(recruiter_stats.best_streak, EXCLUDED.current_streak),
    last_proposal_date = EXCLUDED.last_proposal_date,
    updated_at = now();
END;
$$;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(recruiter_email_param VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  badge_record RECORD;
  current_value INTEGER;
  stats_record RECORD;
BEGIN
  -- Get current stats
  SELECT * INTO stats_record
  FROM public.recruiter_stats
  WHERE recruiter_email = recruiter_email_param;

  -- If no stats found, return
  IF stats_record IS NULL THEN
    RETURN;
  END IF;

  -- Check each badge requirement
  FOR badge_record IN 
    SELECT * FROM public.recruiter_badges 
    WHERE id NOT IN (
      SELECT badge_id 
      FROM public.recruiter_achievements 
      WHERE recruiter_email = recruiter_email_param
    )
  LOOP
    current_value := 0;
    
    -- Calculate current value based on requirement type
    CASE badge_record.requirement_type
      WHEN 'proposals_count' THEN
        current_value := stats_record.total_proposals;
      WHEN 'acceptance_rate' THEN
        IF stats_record.total_proposals > 0 THEN
          current_value := (stats_record.accepted_proposals * 100 / stats_record.total_proposals);
        END IF;
      WHEN 'rating' THEN
        SELECT (AVG(rating) * 10)::INTEGER INTO current_value
        FROM public.recruiter_reviews 
        WHERE recruiter_email = recruiter_email_param;
      WHEN 'streak' THEN
        current_value := stats_record.best_streak;
    END CASE;

    -- Award badge if requirement is met
    IF current_value >= badge_record.requirement_value THEN
      INSERT INTO public.recruiter_achievements (recruiter_email, badge_id, progress)
      VALUES (recruiter_email_param, badge_record.id, current_value)
      ON CONFLICT (recruiter_email, badge_id) DO NOTHING;
    END IF;
  END LOOP;
END;
$$;

-- Trigger to update stats when proposals change
CREATE OR REPLACE FUNCTION public.handle_proposal_gamification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update stats for the recruiter
  PERFORM public.update_recruiter_stats(COALESCE(NEW.recruiter_email, OLD.recruiter_email));
  
  -- Check and award badges
  PERFORM public.check_and_award_badges(COALESCE(NEW.recruiter_email, OLD.recruiter_email));
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update stats when reviews change
CREATE OR REPLACE FUNCTION public.handle_review_gamification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update stats for the recruiter
  PERFORM public.update_recruiter_stats(COALESCE(NEW.recruiter_email, OLD.recruiter_email));
  
  -- Check and award badges
  PERFORM public.check_and_award_badges(COALESCE(NEW.recruiter_email, OLD.recruiter_email));
  
  RETURN COALESCE(NEW, OLD);
END;
$$;