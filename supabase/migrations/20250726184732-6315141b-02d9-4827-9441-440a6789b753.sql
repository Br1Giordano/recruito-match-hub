-- Add triggers for automatic gamification updates

-- Trigger for proposals table
CREATE TRIGGER trigger_proposal_gamification
  AFTER INSERT OR UPDATE OR DELETE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_proposal_gamification();

-- Trigger for recruiter_reviews table  
CREATE TRIGGER trigger_review_gamification
  AFTER INSERT OR UPDATE OR DELETE ON public.recruiter_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_review_gamification();