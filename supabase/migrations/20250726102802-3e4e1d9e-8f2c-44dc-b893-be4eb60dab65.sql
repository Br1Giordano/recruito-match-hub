-- Fix the user profile creation issue by modifying the handle_new_user function
-- to be more resilient and not depend on foreign key constraints
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the handle_new_user function to be more robust
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
    -- Insert into user_profiles table without foreign key dependency
    INSERT INTO public.user_profiles (auth_user_id, user_type, registration_id)
    VALUES (
      NEW.id,
      user_type_value::VARCHAR(20),
      gen_random_uuid() -- Temporary UUID, will be updated when they complete registration
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();