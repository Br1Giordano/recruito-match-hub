-- Create trigger for new proposals
CREATE OR REPLACE TRIGGER proposal_creation_notification
  AFTER INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruiter_on_new_proposal();

-- Create trigger for proposal status updates
CREATE OR REPLACE TRIGGER proposal_status_change_notification
  AFTER UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruiter_on_proposal_update();

-- Configure service role key setting (this will need to be set manually in Supabase dashboard)
-- The service role key should be configured in the Supabase dashboard under Settings > API
-- Set app.settings.service_role_key to your service role key value