-- Add blocked status to recruiter_registrations and company_registrations
-- Update existing status constraints to include 'blocked'

-- First, add the blocked status option for recruiters (if not already exists)
DO $$ 
BEGIN
  -- Check if we need to update the constraint for recruiter_registrations
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'recruiter_registrations' 
    AND constraint_type = 'CHECK'
  ) THEN
    -- Drop existing constraint if it exists
    ALTER TABLE public.recruiter_registrations DROP CONSTRAINT IF EXISTS recruiter_registrations_status_check;
  END IF;
  
  -- Add new constraint with blocked status
  ALTER TABLE public.recruiter_registrations 
  ADD CONSTRAINT recruiter_registrations_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected', 'blocked'));
END $$;

-- Same for company_registrations
DO $$ 
BEGIN
  -- Check if we need to update the constraint for company_registrations
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'company_registrations' 
    AND constraint_type = 'CHECK'
  ) THEN
    -- Drop existing constraint if it exists
    ALTER TABLE public.company_registrations DROP CONSTRAINT IF EXISTS company_registrations_status_check;
  END IF;
  
  -- Add new constraint with blocked status
  ALTER TABLE public.company_registrations 
  ADD CONSTRAINT company_registrations_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected', 'blocked'));
END $$;

-- Create function to send status update emails automatically
CREATE OR REPLACE FUNCTION public.send_status_update_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_type TEXT;
  user_name TEXT;
  user_email TEXT;
BEGIN
  -- Determine user type and get user details
  IF TG_TABLE_NAME = 'recruiter_registrations' THEN
    user_type := 'recruiter';
    user_name := COALESCE(NEW.nome, '') || ' ' || COALESCE(NEW.cognome, '');
    user_email := NEW.email;
  ELSIF TG_TABLE_NAME = 'company_registrations' THEN
    user_type := 'company';
    user_name := NEW.nome_azienda;
    user_email := NEW.email;
  ELSE
    RETURN NEW;
  END IF;

  -- Only send email if status actually changed and is not pending
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status != 'pending' THEN
    
    -- Send status update notification
    PERFORM net.http_post(
      url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-status-update',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'type', CASE 
          WHEN NEW.status = 'approved' THEN 'profile_approved'
          WHEN NEW.status = 'rejected' THEN 'profile_rejected'
          WHEN NEW.status = 'blocked' THEN 'profile_blocked'
          ELSE 'system_notification'
        END,
        'email', user_email,
        'name', user_name,
        'userType', user_type,
        'data', jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      ),
      timeout_milliseconds := 10000
    );
    
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the update
    RAISE WARNING 'Failed to send status update email for % %: %', user_type, user_email, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Create triggers for automatic email sending
DROP TRIGGER IF EXISTS send_recruiter_status_update_email ON public.recruiter_registrations;
CREATE TRIGGER send_recruiter_status_update_email
  AFTER UPDATE ON public.recruiter_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.send_status_update_email();

DROP TRIGGER IF EXISTS send_company_status_update_email ON public.company_registrations;
CREATE TRIGGER send_company_status_update_email
  AFTER UPDATE ON public.company_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.send_status_update_email();