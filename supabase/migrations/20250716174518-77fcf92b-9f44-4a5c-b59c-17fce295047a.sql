-- Ensure service role key is configured for email functions
SELECT set_config('app.settings.service_role_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZW1qaWxqYWRocHZ4d2hndmlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg1MjM3MCwiZXhwIjoyMDY2NDI4MzcwfQ.3xmJ2F6FJYaZaKOzJMrGFtqkJJFLQG_6KLjU3UU-yMs', false);

-- Enable pg_net extension for HTTP requests from triggers
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create or update the function to handle new recruiter registrations
CREATE OR REPLACE FUNCTION public.send_welcome_email_to_recruiter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Send welcome email to newly registered recruiter
  PERFORM net.http_post(
    url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-confirmation-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'email', NEW.email,
      'userType', 'recruiter',
      'confirmationUrl', 'https://recruito.eu/auth?confirmed=true'
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create or update the function to handle new company registrations
CREATE OR REPLACE FUNCTION public.send_welcome_email_to_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Send welcome email to newly registered company
  PERFORM net.http_post(
    url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-confirmation-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'email', NEW.email,
      'userType', 'company',
      'confirmationUrl', 'https://recruito.eu/auth?confirmed=true'
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create triggers for welcome emails
DROP TRIGGER IF EXISTS recruiter_welcome_email_trigger ON recruiter_registrations;
CREATE TRIGGER recruiter_welcome_email_trigger
  AFTER INSERT ON recruiter_registrations
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_to_recruiter();

DROP TRIGGER IF EXISTS company_welcome_email_trigger ON company_registrations;
CREATE TRIGGER company_welcome_email_trigger
  AFTER INSERT ON company_registrations
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_to_company();

-- Ensure the existing proposal notification triggers are active
DROP TRIGGER IF EXISTS proposal_creation_notification ON proposals;
CREATE TRIGGER proposal_creation_notification
  AFTER INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruiter_on_new_proposal();

DROP TRIGGER IF EXISTS proposal_status_change_notification ON proposals;
CREATE TRIGGER proposal_status_change_notification
  AFTER UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruiter_on_proposal_update();