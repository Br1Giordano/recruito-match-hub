-- Create function to fix existing test users that have user_profiles but missing registration records
CREATE OR REPLACE FUNCTION public.fix_test_users_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_record RECORD;
  new_reg_id uuid;
BEGIN
  -- Find user_profiles with .recruito@gmail.com emails that don't have registration records
  FOR user_record IN
    SELECT up.auth_user_id, up.user_type, au.email
    FROM public.user_profiles up
    JOIN auth.users au ON au.id = up.auth_user_id
    WHERE au.email LIKE '%.recruito@gmail.com'
    AND up.user_type IN ('recruiter', 'company')
  LOOP
    
    IF user_record.user_type = 'recruiter' THEN
      -- Check if recruiter_registrations record exists
      IF NOT EXISTS (
        SELECT 1 FROM public.recruiter_registrations 
        WHERE user_id = user_record.auth_user_id OR email = user_record.email
      ) THEN
        -- Generate new registration ID
        new_reg_id := gen_random_uuid();
        
        -- Create missing recruiter registration record
        INSERT INTO public.recruiter_registrations (
          id, user_id, nome, cognome, email, status
        ) VALUES (
          new_reg_id,
          user_record.auth_user_id,
          'Test',
          'Recruiter',
          user_record.email,
          'pending'
        );
        
        -- Update user_profiles registration_id to link to the new record
        UPDATE public.user_profiles 
        SET registration_id = new_reg_id
        WHERE auth_user_id = user_record.auth_user_id;
        
        RAISE NOTICE 'Created recruiter registration for %', user_record.email;
      END IF;
      
    ELSIF user_record.user_type = 'company' THEN
      -- Check if company_registrations record exists
      IF NOT EXISTS (
        SELECT 1 FROM public.company_registrations 
        WHERE user_id = user_record.auth_user_id OR email = user_record.email
      ) THEN
        -- Generate new registration ID
        new_reg_id := gen_random_uuid();
        
        -- Create missing company registration record
        INSERT INTO public.company_registrations (
          id, user_id, nome_azienda, email, status
        ) VALUES (
          new_reg_id,
          user_record.auth_user_id,
          'Test Company',
          user_record.email,
          'pending'
        );
        
        -- Update user_profiles registration_id to link to the new record
        UPDATE public.user_profiles 
        SET registration_id = new_reg_id
        WHERE auth_user_id = user_record.auth_user_id;
        
        RAISE NOTICE 'Created company registration for %', user_record.email;
      END IF;
    END IF;
    
  END LOOP;
  
  RAISE NOTICE 'Test users profile fix completed';
END;
$function$;

-- Execute the function to fix existing users
SELECT public.fix_test_users_profiles();