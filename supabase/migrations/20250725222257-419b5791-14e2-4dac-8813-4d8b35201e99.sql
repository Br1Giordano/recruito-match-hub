-- Update all database functions to include SET search_path = 'public' for security

-- 1. Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = user_email
  );
$function$;

-- 2. Update populate_user_ids function
CREATE OR REPLACE FUNCTION public.populate_user_ids()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Update company_registrations with user_ids
  UPDATE public.company_registrations cr
  SET user_id = au.id
  FROM auth.users au
  WHERE cr.email = au.email
  AND cr.user_id IS NULL;

  -- Update recruiter_registrations with user_ids  
  UPDATE public.recruiter_registrations rr
  SET user_id = au.id
  FROM auth.users au
  WHERE rr.email = au.email
  AND rr.user_id IS NULL;

  -- Update job_offers with user_ids (match contact_email to auth users)
  UPDATE public.job_offers jo
  SET user_id = au.id
  FROM auth.users au
  WHERE jo.contact_email = au.email
  AND jo.user_id IS NULL;

  -- Update proposals with user_ids (match recruiter_email to auth users)
  UPDATE public.proposals p
  SET user_id = au.id
  FROM auth.users au
  WHERE p.recruiter_email = au.email
  AND p.user_id IS NULL;

  RAISE NOTICE 'User IDs populated successfully';
END;
$function$;

-- 3. Update get_current_user_registration_id function
CREATE OR REPLACE FUNCTION public.get_current_user_registration_id(table_name text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  reg_id uuid;
BEGIN
  IF table_name = 'company' THEN
    SELECT id INTO reg_id
    FROM public.company_registrations
    WHERE user_id = auth.uid()
    LIMIT 1;
  ELSIF table_name = 'recruiter' THEN
    SELECT id INTO reg_id
    FROM public.recruiter_registrations
    WHERE user_id = auth.uid()
    LIMIT 1;
  END IF;
  
  RETURN reg_id;
END;
$function$;

-- 4. Update notify_recruiter_on_new_proposal function
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

-- 5. Update send_welcome_email_to_recruiter function
CREATE OR REPLACE FUNCTION public.send_welcome_email_to_recruiter()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- 6. Update send_welcome_email_to_company function
CREATE OR REPLACE FUNCTION public.send_welcome_email_to_company()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- 7. Update test_email_system function
CREATE OR REPLACE FUNCTION public.test_email_system()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- 8. Update notify_recruiter_on_proposal_update function
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

-- 9. Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  user_type_value TEXT;
BEGIN
  -- Get user_type from metadata (set during signup)
  user_type_value := NEW.raw_user_meta_data ->> 'user_type';
  
  -- Only proceed if user_type is valid
  IF user_type_value IN ('recruiter', 'company') THEN
    -- Insert into user_profiles table
    INSERT INTO public.user_profiles (auth_user_id, user_type, registration_id)
    VALUES (
      NEW.id,
      user_type_value::VARCHAR(20),
      gen_random_uuid() -- Temporary UUID, will be updated when they complete registration
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 10. Update link_user_to_registration function
CREATE OR REPLACE FUNCTION public.link_user_to_registration(p_registration_id uuid, p_user_type character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Update the user_profile to link to the actual registration
  UPDATE public.user_profiles 
  SET registration_id = p_registration_id
  WHERE auth_user_id = auth.uid() 
  AND user_type = p_user_type;
  
  RETURN FOUND;
END;
$function$;

-- 11. Update cleanup_old_login_attempts function
CREATE OR REPLACE FUNCTION public.cleanup_old_login_attempts()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  DELETE FROM public.login_attempts 
  WHERE attempt_time < now() - interval '1 hour';
$function$;