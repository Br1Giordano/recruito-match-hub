-- Create trigger to notify companies when recruiters show interest in job offers
CREATE TRIGGER notify_company_on_job_interest_trigger
  AFTER INSERT ON public.recruiter_job_interests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_company_on_job_interest();