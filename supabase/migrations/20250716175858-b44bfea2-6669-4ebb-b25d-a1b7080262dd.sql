-- Fix notify_recruiter_on_proposal_update function to include recipient_type
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
  -- Trigger for ALL status changes, not just specific ones
  IF NEW.status IS NOT NULL AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    
    -- Get recruiter information
    SELECT nome, cognome, email 
    INTO recruiter_data
    FROM recruiter_registrations 
    WHERE id = NEW.recruiter_id;
    
    -- Get company information  
    SELECT nome_azienda, email
    INTO company_data
    FROM company_registrations
    WHERE id = NEW.company_id::uuid;
    
    -- Send notification to recruiter
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
          'company_name', company_data.nome_azienda,
          'company_email', company_data.email,
          'proposal_id', NEW.id,
          'candidate_name', NEW.candidate_name,
          'new_status', NEW.status,
          'old_status', OLD.status,
          'proposal_description', NEW.proposal_description
        )
      );
    END IF;
    
    -- Send notification to company (only for certain status changes)
    IF NEW.status IN ('accepted', 'rejected') AND company_data.email IS NOT NULL THEN
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
        )
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix notify_recruiter_on_new_proposal function to ensure consistent behavior
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
  
  -- Get company information  
  SELECT nome_azienda, email
  INTO company_data
  FROM company_registrations
  WHERE id = NEW.company_id::uuid;
  
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
        'company_name', company_data.nome_azienda,
        'company_email', company_data.email,
        'proposal_id', NEW.id,
        'candidate_name', NEW.candidate_name,
        'new_status', NEW.status,
        'old_status', NULL,
        'proposal_description', NEW.proposal_description
      )
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
        'new_status', NEW.status,
        'old_status', NULL,
        'proposal_description', NEW.proposal_description
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create test function to verify email system
CREATE OR REPLACE FUNCTION public.test_email_system()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  test_result jsonb;
BEGIN
  -- Test email sending
  SELECT net.http_post(
    url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'recipient_type', 'recruiter',
      'recruiter_email', 'test@recruito.app',
      'recruiter_name', 'Test Recruiter',
      'company_name', 'Test Company',
      'company_email', 'company@recruito.app',
      'proposal_id', gen_random_uuid(),
      'candidate_name', 'Test Candidate',
      'new_status', 'pending',
      'old_status', NULL,
      'proposal_description', 'Test proposal description'
    )
  ) INTO test_result;
  
  RETURN test_result;
END;
$$;