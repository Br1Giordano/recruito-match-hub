-- Create a function to send notification emails when proposal status changes
CREATE OR REPLACE FUNCTION public.notify_recruiter_on_proposal_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  recruiter_data RECORD;
  company_data RECORD;
BEGIN
  -- Only trigger when status changes to 'under_review' or 'accepted'
  IF NEW.status IN ('under_review', 'accepted') AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    
    -- Get recruiter information
    SELECT nome, cognome, email 
    INTO recruiter_data
    FROM recruiter_registrations 
    WHERE id = NEW.recruiter_id;
    
    -- Get company information  
    SELECT nome_azienda, email
    INTO company_data
    FROM company_registrations
    WHERE id::text = NEW.company_id;
    
    -- Call the edge function to send notification email
    PERFORM net.http_post(
      url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'recruiter_email', recruiter_data.email,
        'recruiter_name', recruiter_data.nome || ' ' || recruiter_data.cognome,
        'company_name', company_data.nome_azienda,
        'company_email', company_data.email,
        'proposal_id', NEW.id,
        'candidate_name', NEW.candidate_name,
        'new_status', NEW.status,
        'proposal_description', NEW.proposal_description
      )
    );
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE OR REPLACE TRIGGER proposal_status_change_notification
  AFTER UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruiter_on_proposal_update();

-- Enable the pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a setting for the service role key (to be set by admin)
-- This will need to be configured manually in the Supabase dashboard