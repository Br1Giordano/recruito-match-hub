-- Fix security issues in the migration

-- Drop and recreate the view without SECURITY DEFINER (it's not needed for views)
DROP VIEW IF EXISTS public.job_offer_interest_counts;
CREATE VIEW public.job_offer_interest_counts AS
SELECT 
  job_offer_id,
  COUNT(*) as interested_recruiters_count
FROM public.recruiter_job_interests 
WHERE status = 'interested'
GROUP BY job_offer_id;

-- Update function with proper search_path
CREATE OR REPLACE FUNCTION public.get_job_interest_count(p_job_offer_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(interested_recruiters_count, 0)::integer
  FROM public.job_offer_interest_counts
  WHERE job_offer_id = p_job_offer_id;
$$;

-- Update trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.update_job_interest_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will be called when recruiter_job_interests changes
  -- The view will automatically reflect the updated counts
  RETURN COALESCE(NEW, OLD);
END;
$$;