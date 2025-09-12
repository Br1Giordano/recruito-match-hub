-- Fix the missing ELSE clause in check_and_award_badges function
CREATE OR REPLACE FUNCTION public.check_and_award_badges(recruiter_email_param character varying)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
      ELSE
        -- Default case for unknown requirement types
        current_value := 0;
    END CASE;

    -- Award badge if requirement is met
    IF current_value >= badge_record.requirement_value THEN
      INSERT INTO public.recruiter_achievements (recruiter_email, badge_id, progress)
      VALUES (recruiter_email_param, badge_record.id, current_value)
      ON CONFLICT (recruiter_email, badge_id) DO NOTHING;
    END IF;
  END LOOP;
END;
$function$;