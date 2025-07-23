-- Fix email notification system with proper triggers and functions

-- Ensure pg_net extension is enabled for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set service role key for email functions (using existing configured key)
SELECT set_config('app.settings.service_role_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZW1qaWxqYWRocHZ4d2hndmlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg1MjM3MCwiZXhwIjoyMDY2NDI4MzcwfQ.3xmJ2F6FJYaZaKOzJMrGFtqkJJFLQG_6KLjU3UU-yMs', false);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS recruiter_welcome_email_trigger ON recruiter_registrations;
DROP TRIGGER IF EXISTS company_welcome_email_trigger ON company_registrations;
DROP TRIGGER IF EXISTS proposal_creation_notification ON proposals;
DROP TRIGGER IF EXISTS proposal_status_change_notification ON proposals;

-- Function to send welcome email to recruiters
CREATE OR REPLACE FUNCTION public.send_welcome_email_to_recruiter()
RETURNS TRIGGER
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
    ),
    timeout_milliseconds := 10000
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insertion
    RAISE WARNING 'Failed to send welcome email to recruiter %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Function to send welcome email to companies
CREATE OR REPLACE FUNCTION public.send_welcome_email_to_company()
RETURNS TRIGGER
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
    ),
    timeout_milliseconds := 10000
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insertion
    RAISE WARNING 'Failed to send welcome email to company %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Function to notify when new proposals are created
CREATE OR REPLACE FUNCTION public.notify_recruiter_on_new_proposal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  recruiter_data RECORD;
  company_data RECORD;
BEGIN
  -- Get recruiter information
  SELECT nome, cognome, email 
  INTO recruiter_data
  FROM recruiter_registrations 
  WHERE id = NEW.recruiter_id;
  
  -- Get company information using email
  SELECT nome_azienda, email
  INTO company_data
  FROM company_registrations
  WHERE email = NEW.company_id;
  
  -- Send notification email to recruiter
  IF recruiter_data.email IS NOT NULL THEN
    PERFORM net.http_post(
      url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'recipient_type', 'recruiter',
        'recruiter_email', recruiter_data.email,
        'recruiter_name', recruiter_data.nome || ' ' || recruiter_data.cognome,
        'company_name', COALESCE(company_data.nome_azienda, 'Azienda'),
        'company_email', COALESCE(company_data.email, NEW.company_id),
        'proposal_id', NEW.id,
        'candidate_name', NEW.candidate_name,
        'new_status', COALESCE(NEW.status, 'pending'),
        'old_status', NULL,
        'proposal_description', NEW.proposal_description
      ),
      timeout_milliseconds := 10000
    );
  END IF;
  
  -- Send notification email to company
  IF company_data.email IS NOT NULL THEN
    PERFORM net.http_post(
      url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'recipient_type', 'company',
        'recruiter_email', recruiter_data.email,
        'recruiter_name', recruiter_data.nome || ' ' || recruiter_data.cognome,
        'company_name', company_data.nome_azienda,
        'company_email', company_data.email,
        'proposal_id', NEW.id,
        'candidate_name', NEW.candidate_name,
        'new_status', COALESCE(NEW.status, 'pending'),
        'old_status', NULL,
        'proposal_description', NEW.proposal_description
      ),
      timeout_milliseconds := 10000
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insertion
    RAISE WARNING 'Failed to send proposal notification for proposal %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Function to notify when proposal status changes
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
  -- Only trigger when status actually changes
  IF NEW.status IS NOT NULL AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    
    -- Get recruiter information
    SELECT nome, cognome, email 
    INTO recruiter_data
    FROM recruiter_registrations 
    WHERE id = NEW.recruiter_id;
    
    -- Get company information using email
    SELECT nome_azienda, email
    INTO company_data
    FROM company_registrations
    WHERE email = NEW.company_id;
    
    -- Send notification to recruiter for all status changes
    IF recruiter_data.email IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object(
          'recipient_type', 'recruiter',
          'recruiter_email', recruiter_data.email,
          'recruiter_name', recruiter_data.nome || ' ' || recruiter_data.cognome,
          'company_name', COALESCE(company_data.nome_azienda, 'Azienda'),
          'company_email', COALESCE(company_data.email, NEW.company_id),
          'proposal_id', NEW.id,
          'candidate_name', NEW.candidate_name,
          'new_status', NEW.status,
          'old_status', OLD.status,
          'proposal_description', NEW.proposal_description
        ),
        timeout_milliseconds := 10000
      );
    END IF;
    
    -- Send notification to company only for certain status changes
    IF NEW.status IN ('accepted', 'rejected', 'approved') AND company_data.email IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object(
          'recipient_type', 'company',
          'recruiter_email', recruiter_data.email,
          'recruiter_name', recruiter_data.nome || ' ' || recruiter_data.cognome,
          'company_name', company_data.nome_azienda,
          'company_email', company_data.email,
          'proposal_id', NEW.id,
          'candidate_name', NEW.candidate_name,
          'new_status', NEW.status,
          'old_status', OLD.status,
          'proposal_description', NEW.proposal_description
        ),
        timeout_milliseconds := 10000
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the update
    RAISE WARNING 'Failed to send proposal update notification for proposal %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create triggers for welcome emails
CREATE TRIGGER recruiter_welcome_email_trigger
  AFTER INSERT ON recruiter_registrations
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_to_recruiter();

CREATE TRIGGER company_welcome_email_trigger
  AFTER INSERT ON company_registrations
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_to_company();

-- Create triggers for proposal notifications
CREATE TRIGGER proposal_creation_notification
  AFTER INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruiter_on_new_proposal();

CREATE TRIGGER proposal_status_change_notification
  AFTER UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_recruiter_on_proposal_update();

-- Verify triggers are created
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table, 
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND event_object_table IN ('proposals', 'recruiter_registrations', 'company_registrations')
ORDER BY event_object_table, trigger_name;