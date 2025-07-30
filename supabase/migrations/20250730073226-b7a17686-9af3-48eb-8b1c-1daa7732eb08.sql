-- Function per notificare le aziende quando un recruiter prende in carico un'offerta
CREATE OR REPLACE FUNCTION public.notify_company_on_job_interest()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  job_data RECORD;
  company_data RECORD;
  recruiter_data RECORD;
BEGIN
  -- Solo per nuovi interessi
  IF TG_OP = 'INSERT' AND NEW.status = 'interested' THEN
    
    -- Get job offer info
    SELECT title, contact_email, user_id
    INTO job_data
    FROM public.job_offers
    WHERE id = NEW.job_offer_id;
    
    -- Get company info
    SELECT nome_azienda, email
    INTO company_data
    FROM public.company_registrations
    WHERE email = job_data.contact_email;
    
    -- Get recruiter info
    SELECT nome, cognome, email
    INTO recruiter_data
    FROM public.recruiter_registrations
    WHERE email = NEW.recruiter_email;
    
    -- Send notification to company
    IF job_data.contact_email IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://xwemjiljadhpvxwhgvid.supabase.co/functions/v1/send-proposal-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object(
          'recipient_type', 'company',
          'company_email', job_data.contact_email,
          'company_name', COALESCE(company_data.nome_azienda, 'Azienda'),
          'recruiter_email', NEW.recruiter_email,
          'recruiter_name', COALESCE(recruiter_data.nome || ' ' || recruiter_data.cognome, 'Recruiter'),
          'job_title', job_data.title,
          'notification_type', 'job_interest',
          'job_offer_id', NEW.job_offer_id
        ),
        timeout_milliseconds := 10000
      );
    END IF;
    
  END IF;
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to send job interest notification: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger per notificare quando un recruiter prende in carico un'offerta
CREATE TRIGGER notify_company_on_job_interest_trigger
AFTER INSERT OR UPDATE ON public.recruiter_job_interests
FOR EACH ROW
EXECUTE FUNCTION public.notify_company_on_job_interest();