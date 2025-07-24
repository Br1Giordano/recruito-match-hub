-- Fix the trigger functions to use recruiter_name from proposals table instead of joining
CREATE OR REPLACE FUNCTION public.notify_recruiter_on_new_proposal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  company_data RECORD;
  final_recruiter_name TEXT;
BEGIN
  -- Get company information using email
  SELECT nome_azienda, email
  INTO company_data
  FROM company_registrations
  WHERE email = NEW.company_id;
  
  -- Use recruiter_name from proposals table, fallback to email if null
  final_recruiter_name := COALESCE(NEW.recruiter_name, NEW.recruiter_email, 'Recruiter');
  
  -- Send notification email to recruiter
  IF NEW.recruiter_email IS NOT NULL THEN
    PERFORM net.http_post(
      url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'recipient_type', 'recruiter',
        'recruiter_email', NEW.recruiter_email,
        'recruiter_name', final_recruiter_name,
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
        'recruiter_email', NEW.recruiter_email,
        'recruiter_name', final_recruiter_name,
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
$function$;

-- Also fix the update trigger function
CREATE OR REPLACE FUNCTION public.notify_recruiter_on_proposal_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  company_data RECORD;
  final_recruiter_name TEXT;
BEGIN
  -- Only trigger when status actually changes
  IF NEW.status IS NOT NULL AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    
    -- Get company information using email
    SELECT nome_azienda, email
    INTO company_data
    FROM company_registrations
    WHERE email = NEW.company_id;
    
    -- Use recruiter_name from proposals table, fallback to email if null
    final_recruiter_name := COALESCE(NEW.recruiter_name, NEW.recruiter_email, 'Recruiter');
    
    -- Send notification to recruiter for all status changes
    IF NEW.recruiter_email IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object(
          'recipient_type', 'recruiter',
          'recruiter_email', NEW.recruiter_email,
          'recruiter_name', final_recruiter_name,
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
          'recruiter_email', NEW.recruiter_email,
          'recruiter_name', final_recruiter_name,
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
$function$;