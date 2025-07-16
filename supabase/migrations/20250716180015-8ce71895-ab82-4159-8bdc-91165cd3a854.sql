-- Recreate triggers for proposal notifications
DROP TRIGGER IF EXISTS proposal_creation_notification ON proposals;
DROP TRIGGER IF EXISTS proposal_status_change_notification ON proposals;

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

-- Test that triggers are working by checking they exist
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table, 
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND event_object_table = 'proposals';