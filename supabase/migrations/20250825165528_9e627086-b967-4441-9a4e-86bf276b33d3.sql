-- Create view to count recruiter interests per job offer
CREATE OR REPLACE VIEW public.job_offer_interest_counts AS
SELECT 
  job_offer_id,
  COUNT(*) as interested_recruiters_count
FROM public.recruiter_job_interests 
WHERE status = 'interested'
GROUP BY job_offer_id;

-- Create function to get interest count for a job offer
CREATE OR REPLACE FUNCTION public.get_job_interest_count(p_job_offer_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(interested_recruiters_count, 0)::integer
  FROM public.job_offer_interest_counts
  WHERE job_offer_id = p_job_offer_id;
$$;

-- Add trigger to update stats when interests change
CREATE OR REPLACE FUNCTION public.update_job_interest_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function will be called when recruiter_job_interests changes
  -- The view will automatically reflect the updated counts
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for interest changes
DROP TRIGGER IF EXISTS update_job_interest_stats_trigger ON public.recruiter_job_interests;
CREATE TRIGGER update_job_interest_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.recruiter_job_interests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_job_interest_stats();