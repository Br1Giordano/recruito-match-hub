-- Create trigger to notify recruiters when proposal status changes
CREATE TRIGGER notify_recruiter_on_proposal_update_trigger
  AFTER UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_recruiter_on_proposal_update();